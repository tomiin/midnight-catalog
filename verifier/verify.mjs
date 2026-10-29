#!/usr/bin/env node
// Evidence checks for catalog entries. Node 22+, no dependencies.
// Usage: node verifier/verify.mjs data/projects.json  -> writes data/results.json
import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { scanText, describeFindings, nameNotes } from './scan.mjs';

const GH = 'https://api.github.com';
const headers = { 'User-Agent': 'midnight-catalog-verifier', Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const days = (iso) => Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
const check = (id, ok, detail) => ({ id, ok, detail });
const skipped = (id) => ({ id, ok: null, detail: 'not provided (optional)' });

async function gh(path) {
  try {
    const r = await fetch(GH + path, { headers, signal: AbortSignal.timeout(15000) });
    if (!r.ok) return { status: r.status };
    return { status: r.status, data: await r.json(), link: r.headers.get('link') };
  } catch (e) { return { status: `network error (${e.cause?.code || e.message})` }; }
}

async function repoChecks(url, otherNames) {
  const m = /^https:\/\/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?\/?$/.exec(url || '');
  if (!m) return { checks: [check('repo.url', false, 'not a github.com repo URL')], notes: [], commit: null };
  const [, owner, name] = m;
  const out = [];
  const notes = [];
  let commit = null;
  const repo = await gh(`/repos/${owner}/${name}`);
  if (!repo.data) return { checks: [check('repo.exists', false, `GitHub returned ${repo.status}`)], notes: [], commit: null };
  const d = repo.data;
  out.push(check('repo.exists', true, `${owner}/${name}`));
  out.push(check('repo.public', !d.private, d.private ? 'private' : 'public'));
  out.push(check('repo.original', !d.fork, d.fork ? `fork of ${d.parent?.full_name ?? 'another repo'}` : 'not a fork'));
  const age = days(d.created_at);
  out.push(check('repo.age', age >= 3, `${age} days old`));
  const commits = await gh(`/repos/${owner}/${name}/commits?per_page=1`);
  if (commits.data) {
    const last = commits.data[0]?.commit?.committer?.date;
    if (commits.data[0]?.sha) commit = { sha: commits.data[0].sha, date: last, branch: d.default_branch };
    const n = /page=(\d+)>; rel="last"/.exec(commits.link || '')?.[1] ?? (commits.data.length ? '1' : '0');
    out.push(check('repo.commits', Number(n) >= 3, `${n} commits`));
    if (last) out.push(check('repo.recent', days(last) <= 90, `last commit ${days(last)} days ago`));
  } else out.push(check('repo.commits', false, `GitHub returned ${commits.status}`));
  const readme = await gh(`/repos/${owner}/${name}/readme`);
  out.push(check('repo.readme', !!readme.data && readme.data.size > 300, readme.data ? `${readme.data.size} bytes` : 'none'));
  const user = await gh(`/users/${owner}`);
  if (user.data) out.push(check('owner.age', days(user.data.created_at) >= 30, `account ${days(user.data.created_at)} days old`));
  if (commit) {
    // Everything below is read at exactly this commit, so the result is bound to it.
    const scan = await scanRepo(owner, name, commit.sha);
    const envFiles = scan.secrets.filter((x) => x.pattern === 'sensitive-file-committed');
    scan.secrets = scan.secrets.filter((x) => x.pattern !== 'sensitive-file-committed');
    if (envFiles.length) notes.push({ id: 'scan.env-file', detail: 'env or key-style file committed (often public config; contents were checked for key patterns separately): ' + describeFindings(envFiles) });
    out.push(check('scan.secrets', scan.secrets.length === 0, scan.note ?? (scan.secrets.length ? 'possible secrets (values not shown): ' + describeFindings(scan.secrets) : `no secret patterns in ${scan.files} files`)));
    if (scan.wallet.length) notes.push({ id: 'scan.wallet-patterns', detail: 'patterns common in wallet-draining code (also used by legitimate dApps), worth a human look: ' + describeFindings(scan.wallet) });
  }
  return { checks: out, notes, commit };
}

const TEXT_EXT = /\.(?:[cm]?[jt]sx?|json|ya?ml|toml|env|sh|py|rs|go|sol|compact|md|txt|html?|cfg|ini|conf)$/i;
const SKIP_DIR = /(?:^|\/)(?:node_modules|dist|build|\.git|vendor|target|managed)\//;
async function scanRepo(owner, name, sha) {
  const tree = await gh(`/repos/${owner}/${name}/git/trees/${sha}?recursive=1`);
  if (!tree.data?.tree) return { secrets: [], wallet: [], files: 0, note: `scan skipped: tree unavailable (${tree.status})` };
  const blobs = tree.data.tree.filter((t) => t.type === 'blob' && !SKIP_DIR.test(t.path));
  const secrets = [], wallet = [];
  // Sensitive file names are caught from the tree alone, no download needed.
  for (const t of blobs) secrets.push(...scanText('', t.path).secrets);
  const files = blobs.filter((t) => (TEXT_EXT.test(t.path) || /(?:^|\/)\.env/.test(t.path)) && (t.size ?? 0) < 200_000).slice(0, 200);
  for (const t of files) {
    try {
      const r = await fetch(`https://raw.githubusercontent.com/${owner}/${name}/${sha}/${t.path.split('/').map(encodeURIComponent).join('/')}`, { headers: { 'User-Agent': headers['User-Agent'] }, signal: AbortSignal.timeout(15000) });
      if (!r.ok) continue;
      const res = scanText(await r.text(), t.path);
      secrets.push(...res.secrets.filter((x) => x.pattern !== 'sensitive-file-committed'));
      wallet.push(...res.wallet);
    } catch { /* skip unreadable file */ }
  }
  return { secrets, wallet, files: files.length, note: tree.data.truncated ? 'scan partial: repo tree truncated by GitHub' : null };
}

async function urlCheck(id, url) {
  if (!url) return skipped(id);
  try {
    const r = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': headers['User-Agent'] }, signal: AbortSignal.timeout(15000) });
    return check(id, r.ok, `HTTP ${r.status}`);
  } catch (e) { return check(id, false, String(e.cause?.code || e.message)); }
}

function contractCheck(p) {
  if (!p.contract) return skipped('contract.format');
  const ok = /^[0-9a-f]{64}$/i.test(p.contract);
  // TODO: on-chain existence lookup via Blockfrost (needs project token); indexer retired 2026-09-30.
  return check('contract.format', ok, ok ? `64-hex, ${p.network ?? 'network unspecified'} (on-chain lookup not yet implemented)` : 'not a 64-char hex address');
}

if (process.argv[2] === '--freshness') {
  // Cheap re-check: fetch only each repo's current HEAD and compare with the commit the stored result was bound to.
  const stored = JSON.parse(await readFile('data/results.json', 'utf8'));
  const proj = JSON.parse(await readFile('data/projects.json', 'utf8'));
  for (const r of stored) {
    const m = /github\.com\/([^/]+)\/([^/#?]+)/.exec(proj.find((p) => p.name === r.name)?.repo || '');
    if (!m || !r.commit) { console.log(`${r.name}: no commit recorded`); continue; }
    const c = await gh(`/repos/${m[1]}/${m[2].replace(/\.git$/, '')}/commits?per_page=1`);
    const head = c.data?.[0]?.sha;
    console.log(`${r.name}: ${!head ? 'could not check (' + c.status + ')' : head === r.commit.sha ? 'current @' + head.slice(0, 7) : `OUTDATED  checked @${r.commit.sha.slice(0, 7)}, repo now @${head.slice(0, 7)}`}`);
  }
  process.exit(0);
}
const input = process.argv[2] || 'data/projects.json';
const projects = JSON.parse(await readFile(input, 'utf8'));
const results = [];
const isCatalogRun = basename(input) === 'projects.json';
let previous = [];
if (isCatalogRun) { try { previous = JSON.parse(await readFile(input.replace(/projects\.json$/, 'results.json'), 'utf8')); } catch { /* first run */ } }
const names = projects.map((p) => p.name);
for (const p of projects) {
  const rc = await repoChecks(p.repo);
  const checks = [
    ...rc.checks,
    await urlCheck('demo.loads', p.demo),
    await urlCheck('video.loads', p.video),
    contractCheck(p),
  ];
  const ran = checks.filter((c) => c.ok !== null);
  const failed = ran.filter((c) => !c.ok).map((c) => c.id);
  const notes = [...rc.notes, ...nameNotes(p.name, names.filter((n) => n !== p.name)).map((d) => ({ id: 'name.similar', detail: d }))];
  const prev = previous.find((r) => r.name === p.name)?.commit;
  const changed = prev && rc.commit && prev.sha !== rc.commit.sha ? { from: prev.sha, note: 'repo changed since the previous check' } : undefined;
  results.push({ name: p.name, checkedAt: new Date().toISOString(), commit: rc.commit, ...(changed ? { changedSince: changed } : {}), passed: ran.length - failed.length, total: ran.length, skipped: checks.length - ran.length, flags: failed, notes, checks });
  console.log(`${p.name}: ${ran.length - failed.length}/${ran.length} passed${checks.length > ran.length ? ` (${checks.length - ran.length} optional skipped)` : ''}${failed.length ? '  flags: ' + failed.join(', ') : ''}${rc.commit ? '  @' + rc.commit.sha.slice(0, 7) : ''}${changed ? '  (repo changed since last check)' : ''}${notes.length ? '  notes: ' + notes.length : ''}`);
}
const isCatalog = basename(input) === 'projects.json';
const outPath = isCatalog ? input.replace(/projects\.json$/, 'results.json') : input.replace(/\.json$/, '.results.json');
await writeFile(outPath, JSON.stringify(results, null, 2));
// Also write site/data.js so site/index.html works by double-click (no server needed).
if (isCatalog) {
  const merged = projects.map((p) => ({ ...p, result: results.find((r) => r.name === p.name) }));
  await writeFile(new URL('../site/data.js', import.meta.url), 'window.CATALOG = ' + JSON.stringify(merged, null, 2) + ';\n');
  console.log(`Wrote ${outPath} and site/data.js`);
} else {
  // Test mode: compare flags against each entry's expectFlags (if given).
  let bad = 0;
  for (const p of projects) {
    if (!p.expectFlags) continue;
    const got = results.find((r) => r.name === p.name).flags.slice().sort();
    const want = p.expectFlags.slice().sort();
    const ok = JSON.stringify(got) === JSON.stringify(want);
    if (!ok) bad++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${p.name}  expected [${want}]  got [${got}]`);
  }
  console.log(bad ? `${bad} test case(s) FAILED` : 'All test cases behaved as expected');
  console.log(`Wrote ${outPath} (site/data.js untouched)`);
}

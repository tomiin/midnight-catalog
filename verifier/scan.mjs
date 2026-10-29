// Pure helpers (no network) so they can be unit-tested.
// Design rules: report WHERE a pattern matched, never the matched value.
// Patterns are heuristics: they produce flags/notes with evidence for a human, not verdicts.

export const SECRET_PATTERNS = [
  { id: 'aws-access-key', re: /\bAKIA[0-9A-Z]{16}\b/ },
  { id: 'github-token', re: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}\b/ },
  { id: 'github-fine-grained-token', re: /\bgithub_pat_[A-Za-z0-9_]{50,}\b/ },
  { id: 'slack-token', re: /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/ },
  { id: 'private-key-block', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY(?: BLOCK)?-----/ },
  { id: 'stripe-live-key', re: /\b[sr]k_live_[A-Za-z0-9]{20,}\b/ },
  { id: 'blockfrost-project-id', re: /\b(?:mainnet|preprod|preview|nightmainnet|nightpreprod|nightpreview)[A-Za-z0-9]{32}\b/ },
];

// Soft signals only. Plenty of legitimate dApps match some of these.
export const WALLET_PATTERNS = [
  { id: 'setApprovalForAll', re: /\bsetApprovalForAll\b/ },
  { id: 'unlimited-approve', re: /\bapprove\s*\([^)]*(?:MaxUint256|0xf{16,}|2\s*\*\*\s*256)/i },
  { id: 'eth_sign', re: /\beth_sign\b/ },
  { id: 'drain-or-sweep-function', re: /\b(?:drain|sweepAll|sweep_all)\w*\s*\(/i },
];

const SENSITIVE_FILE = /(?:^|\/)(?:\.env(?:\.(?![^/]*(?:example|sample|template))[^/]+)?|id_rsa|id_ed25519|[^/]+\.(?:p12|pfx|keystore))$/i;

export function isSensitiveFile(path) {
  return SENSITIVE_FILE.test(path);
}

export function scanText(text, path) {
  const secrets = [];
  const wallet = [];
  if (isSensitiveFile(path)) secrets.push({ pattern: 'sensitive-file-committed', path, line: 1 });
  const lines = String(text).split('\n');
  for (let i = 0; i < lines.length && i < 20000; i++) {
    const l = lines[i];
    if (l.length > 4000) continue; // minified blobs: skip
    for (const p of SECRET_PATTERNS) if (p.re.test(l)) secrets.push({ pattern: p.id, path, line: i + 1 });
    for (const p of WALLET_PATTERNS) if (p.re.test(l)) wallet.push({ pattern: p.id, path, line: i + 1 });
  }
  return { secrets, wallet };
}

export function describeFindings(list, max = 5) {
  const shown = list.slice(0, max).map((f) => `${f.pattern} at ${f.path}:${f.line}`);
  return shown.join('; ') + (list.length > max ? `; +${list.length - max} more` : '');
}

// ---- name similarity ----
export const OFFICIAL_NAMES = ['Midnight', 'Midnight Network', 'Midnight City', 'Lace', 'Lace Wallet', 'NIGHT', 'DUST', 'Cardano', '1AM', 'AKINDO', 'Nightstream', 'Nightframes', 'Compact'];

export const normName = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

export function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

export function nameNotes(name, otherListingNames = []) {
  const n = normName(name);
  const notes = [];
  if (!n) return notes;
  for (const o of OFFICIAL_NAMES) {
    const on = normName(o);
    if (n === on) notes.push(`name is identical to "${o}"`);
    else if (n.length >= 5 && on.length >= 5 && lev(n, on) <= 1) notes.push(`name is one character away from "${o}"`);
  }
  for (const other of otherListingNames) {
    const on = normName(other);
    if (n === on) notes.push(`same name as another listing "${other}"`);
    else if (n.length >= 5 && on.length >= 5 && lev(n, on) <= 1) notes.push(`very similar to listing "${other}"`);
  }
  return notes;
}

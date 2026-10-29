import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scanText, describeFindings, nameNotes, isSensitiveFile, lev } from './scan.mjs';

// Fake values are assembled at runtime so this file itself never contains a secret-looking string.
const fakeAws = 'AKIA' + 'ABCDEFGHIJKLMNOP';
const fakeGh = 'ghp_' + 'a'.repeat(36);
const fakeBf = 'nightmainnet' + 'A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6'.slice(0, 32);

test('detects secrets and reports location, never the value', () => {
  const text = `const a = 1;\nconst k = "${fakeAws}";\nconst t = "${fakeGh}";\nconst b = "${fakeBf}";`;
  const { secrets } = scanText(text, 'src/app.ts');
  assert.deepEqual(secrets.map((s) => [s.pattern, s.line]), [['aws-access-key', 2], ['github-token', 3], ['blockfrost-project-id', 4]]);
  const desc = describeFindings(secrets);
  for (const v of [fakeAws, fakeGh, fakeBf]) assert.ok(!desc.includes(v), 'value must not appear in output');
});

test('clean code has no findings', () => {
  const { secrets, wallet } = scanText('export const add = (a, b) => a + b;\n// approve the request', 'src/x.ts');
  assert.equal(secrets.length, 0);
  assert.equal(wallet.length, 0);
});

test('private key header flagged', () => {
  const header = '-----BEGIN ' + 'PRIVATE KEY-----';
  assert.equal(scanText(header, 'k.txt').secrets[0].pattern, 'private-key-block');
});

test('sensitive files', () => {
  assert.ok(isSensitiveFile('.env'));
  assert.ok(isSensitiveFile('policy/.env.local'));
  assert.ok(isSensitiveFile('keys/id_rsa'));
  assert.ok(!isSensitiveFile('.env.example'));
  assert.ok(!isSensitiveFile('.env.preprod.example'));
  assert.ok(isSensitiveFile('ui/.env.preprod'));
  assert.ok(!isSensitiveFile('src/environment.ts'));
  assert.equal(scanText('', '.env').secrets[0].pattern, 'sensitive-file-committed');
});

test('wallet patterns are soft signals', () => {
  const { wallet, secrets } = scanText('await c.setApprovalForAll(op, true);\nrpc("eth_sign", [])\ntoken.approve(spender, ethers.MaxUint256)', 'a.js');
  assert.equal(secrets.length, 0);
  assert.deepEqual(wallet.map((w) => w.pattern).sort(), ['eth_sign', 'setApprovalForAll', 'unlimited-approve']);
});

test('name similarity', () => {
  assert.equal(lev('lace', 'lacy'), 1);
  assert.deepEqual(nameNotes('Mandate', ['NightPoll', 'Attesta']), []);
  assert.ok(nameNotes('Midnlght', []).some((n) => n.includes('one character away from "Midnight"')));
  assert.ok(nameNotes('Lace', []).some((n) => n.includes('identical')));
  assert.ok(nameNotes('NightPol', ['NightPoll']).some((n) => n.includes('very similar')));
  assert.ok(nameNotes('nightpoll', ['NightPoll']).some((n) => n.includes('same name')));
  assert.deepEqual(nameNotes('tell', ['tall']), []); // short names are ignored on purpose
});

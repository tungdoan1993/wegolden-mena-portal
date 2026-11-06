/**
 * Encrypts the Partner Area (detailed IB scheme) so it can live in a public repo.
 *
 *   IB_ID=... IB_PASSWORD=... node tools/encrypt-ib-scheme.mjs
 *
 * Reads   private/ib-scheme.data.js   (plaintext, gitignored — never committed)
 * Writes  src/encrypted/ib-scheme.json (AES-256-GCM, key = PBKDF2-SHA256(id + password))
 * The build inlines that JSON into partner-area.html; the browser decrypts it after login.
 * Changing the ID/password = re-run this script with the new values, then build + push.
 */
import { webcrypto as crypto } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderScheme } from '../src/templates/ib-scheme.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const KDF = { name: 'PBKDF2', hash: 'SHA-256', iterations: 310000 };

const id = (process.env.IB_ID || '').trim().toLowerCase();
const password = process.env.IB_PASSWORD || '';
if (!id || !password) {
  console.error('Set IB_ID and IB_PASSWORD environment variables.');
  process.exit(1);
}

const { ibScheme } = await import(pathToFileURL(join(ROOT, 'private/ib-scheme.data.js')).href);
const enc = new TextEncoder();
const b64 = (buf) => Buffer.from(buf).toString('base64');

const salt = crypto.getRandomValues(new Uint8Array(16));
const material = await crypto.subtle.importKey('raw', enc.encode(`${id}\n${password}`), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ ...KDF, salt }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);

const payload = { v: 1, kdf: { ...KDF, salt: b64(salt) }, version: ibScheme.version, langs: {} };
for (const lang of ['en', 'ar', 'fa']) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const html = renderScheme(ibScheme[lang], ibScheme.version);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(html));
  payload.langs[lang] = { iv: b64(iv), ct: b64(ct) };
}

mkdirSync(join(ROOT, 'src/encrypted'), { recursive: true });
writeFileSync(join(ROOT, 'src/encrypted/ib-scheme.json'), JSON.stringify(payload));
console.log(`✔ Encrypted IB scheme v${ibScheme.version} (en, ar, fa) → src/encrypted/ib-scheme.json`);

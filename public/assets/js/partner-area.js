/* Partner Area: decrypts the detailed IB scheme in the browser after login (AES-GCM + PBKDF2). */
(() => {
  'use strict';
  const form = document.querySelector('[data-partner-login]');
  const content = document.querySelector('[data-partner-content]');
  const output = document.querySelector('[data-partner-output]');
  const status = form && form.querySelector('.form-status');
  const raw = document.getElementById('ib-payload');
  if (!form || !raw || !window.crypto || !crypto.subtle) return;

  let payload;
  try { payload = JSON.parse(raw.textContent); } catch (e) { return; }

  const SESSION_KEY = 'wg-partner-key';
  const lang = form.dataset.lang;
  const enc = new TextEncoder();
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

  const deriveKey = async (id, password) => {
    const material = await crypto.subtle.importKey('raw', enc.encode(`${id.trim().toLowerCase()}\n${password}`), 'PBKDF2', false, ['deriveKey']);
    const { name, hash, iterations, salt } = payload.kdf;
    return crypto.subtle.deriveKey(
      { name, hash, iterations, salt: unb64(salt) }, material,
      { name: 'AES-GCM', length: 256 }, true, ['decrypt'],
    );
  };

  const decrypt = async (key) => {
    const part = payload.langs[lang] || payload.langs.en;
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(part.iv) }, key, unb64(part.ct));
    return new TextDecoder().decode(plain);
  };

  const show = (html) => {
    output.innerHTML = html;
    form.hidden = true;
    content.hidden = false;
  };

  // Stay signed in for this browser session (works across the 3 languages).
  (async () => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (!saved) return;
      const key = await crypto.subtle.importKey('raw', unb64(saved), 'AES-GCM', false, ['decrypt']);
      show(await decrypt(key));
    } catch (e) { try { sessionStorage.removeItem(SESSION_KEY); } catch (_) { /* ignore */ } }
  })();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = form.elements.id.value;
    const password = form.elements.password.value;
    if (!id || !password) return;
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    status.className = 'form-status';
    status.textContent = status.dataset.loading;
    try {
      const key = await deriveKey(id, password);
      show(await decrypt(key));
      try {
        const rawKey = await crypto.subtle.exportKey('raw', key);
        sessionStorage.setItem(SESSION_KEY, btoa(String.fromCharCode(...new Uint8Array(rawKey))));
      } catch (e) { /* storage unavailable — stays signed in until reload */ }
      form.reset();
    } catch (e) {
      status.className = 'form-status is-error';
      status.textContent = status.dataset.error;
    } finally {
      button.disabled = false;
    }
  });

  document.querySelector('[data-partner-logout]').addEventListener('click', () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
    output.innerHTML = '';
    content.hidden = true;
    form.hidden = false;
    status.textContent = '';
  });
})();

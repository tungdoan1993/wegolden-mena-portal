/* WeGolden MENA portal — progressive enhancement only. Pages work without JS. */
(() => {
  'use strict';

  // Sticky header shadow
  const header = document.querySelector('[data-header]');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile navigation
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Remember language choice (used by the root redirect)
  document.querySelectorAll('[data-lang]').forEach((link) => {
    link.addEventListener('click', () => {
      try { localStorage.setItem('wg-lang', link.dataset.lang); } catch (e) { /* storage unavailable */ }
    });
  });

  // Lead form
  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    const status = form.querySelector('.form-status');
    const setStatus = (type) => {
      status.textContent = status.dataset[type];
      status.className = `form-status is-${type}`;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach((input) => {
        const ok = input.type === 'checkbox' ? input.checked : input.checkValidity();
        input.closest('.field, .check').classList.toggle('is-invalid', !ok);
        valid = valid && ok;
      });
      if (!valid) return;

      const data = Object.fromEntries(new FormData(form));
      const endpoint = form.dataset.endpoint;
      const button = form.querySelector('[type="submit"]');
      button.disabled = true;

      try {
        if (endpoint) {
          // HubSpot Forms API shape — adjust field names to match the HubSpot form.
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: Object.entries(data).map(([name, value]) => ({ name, value })),
              context: { pageUri: location.href, pageName: document.title },
            }),
          });
          if (!res.ok) throw new Error(res.status);
        } else {
          console.info('[WeGolden] Demo mode — lead not sent. Set leadFormEndpoint in src/config.js.', data);
        }
        setStatus('success');
        form.reset();
      } catch (err) {
        setStatus('error');
      } finally {
        button.disabled = false;
      }
    });
  });
})();

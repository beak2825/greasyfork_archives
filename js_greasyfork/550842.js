// ==UserScript==
// @name         Perplexity Helper — True Turquoise
// @namespace    https://greasyfork.org/users/1513610
// @version      1.0.0
// @description  Auto-enable Incognito mode, enable Social sources, and open the Model switcher popup on perplexity.ai with a full-screen True Turquoise animated loader
// @description:en  Auto-enable Incognito mode, enable Social sources, and open the Model switcher popup on perplexity.ai with a full-screen True Turquoise animated loader
// @license      MIT
// @match        https://www.perplexity.ai/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550842/Perplexity%20Helper%20%E2%80%94%20True%20Turquoise.user.js
// @updateURL https://update.greasyfork.org/scripts/550842/Perplexity%20Helper%20%E2%80%94%20True%20Turquoise.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ────── guard: avoid double-run ──────────────────────────────────────────
  if (window.__ppxHelperActive) return;
  window.__ppxHelperActive = true;

  // ────── configuration ────────────────────────────────────────────────────
  const CFG = {
    debug: false,
    initialDelayMs: 1000,
    waitTimeoutMs: 10_000,
    waitIntervalMs: 100,
    smallPauseMs: 300,
    menuPauseMs: 400,
    loader: { enable: true },
  };

  // ────── logging ─────────────────────────────────────────────────────────
  const log = (...args) => {
    if (!CFG.debug) return;
    console.log('%c[Perplexity-Helper]', 'color:#1ABC9C;font-weight:bold;', ...args);
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function withTimeout(promise, ms, label = 'timeout') {
    let t;
    const timeout = new Promise((_, rej) => (t = setTimeout(() => rej(new Error(label)), ms)));
    return Promise.race([promise.finally(() => clearTimeout(t)), timeout]);
  }

  function waitFor(predicate, { timeout = CFG.waitTimeoutMs, interval = CFG.waitIntervalMs } = {}) {
    return withTimeout(
      new Promise((resolve, reject) => {
        (function tick() {
          try {
            const val = predicate();
            if (val) return resolve(val);
            setTimeout(tick, interval);
          } catch (e) {
            reject(e);
          }
        })();
      }),
      timeout,
      'waitFor: timed-out'
    );
  }

  function waitForEl(selector, { timeout = CFG.waitTimeoutMs, root = document } = {}) {
    const now = root.querySelector(selector);
    if (now) return Promise.resolve(now);

    if (typeof MutationObserver !== 'function') {
      return waitFor(() => root.querySelector(selector), { timeout, interval: CFG.waitIntervalMs });
    }

    return withTimeout(
      new Promise((resolve, reject) => {
        let done = false;
        const finish = (val, err) => {
          if (done) return;
          done = true;
          try { observer.disconnect(); } catch {}
          clearTimeout(timer);
          if (err) reject(err); else resolve(val);
        };

        const observer = new MutationObserver(() => {
          try {
            const el = root.querySelector(selector);
            if (el) finish(el);
          } catch (e) {
            finish(null, e);
          }
        });

        try {
          observer.observe(root === document ? document.documentElement : root, {
            childList: true,
            subtree: true,
          });
        } catch (e) {
          // Fallback polling if observe fails (rare)
          waitFor(() => root.querySelector(selector), { timeout, interval: CFG.waitIntervalMs })
            .then(resolve, reject);
          return;
        }

        queueMicrotask(() => {
          const el = root.querySelector(selector);
          if (el) finish(el);
        });

        const timer = setTimeout(() => {
          finish(null, new Error(`waitForEl: timed-out for "${selector}"`));
        }, timeout);
      }),
      timeout + 50,
      'waitForEl: timed-out'
    );
  }

  const normalize = (s) => s?.replace(/\s+/g, ' ').trim() ?? '';

  async function findByText(tag, text, { exact = false, timeout = 3_000 } = {}) {
    const needle = normalize(text);
    return waitFor(() => {
      const nodes = Array.from(document.getElementsByTagName(tag));
      return nodes.find((n) => {
        const t = normalize(n.textContent || '');
        return exact ? t === needle : t.toLowerCase().includes(needle.toLowerCase());
      });
    }, { timeout, interval: CFG.waitIntervalMs });
  }

  async function safeClick(el) {
    if (!el) return;
    try {
      el.scrollIntoView?.({ block: 'center', inline: 'center' });
      await sleep(36);
      el.dispatchEvent?.(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      el.click?.();
    } catch {}
  }

  // ────── animated loader (True Turquoise) ─────────────────────────────────
  function showLoader() {
    if (!CFG.loader.enable) return;
    try {
      document.getElementById('ppx-loader-backdrop')?.remove();
      document.getElementById('ppx-loader-style')?.remove();

      const style = document.createElement('style');
      style.id = 'ppx-loader-style';
      style.textContent = `
:root {
  --ppx-bg: rgba(6, 18, 18, 0.75);
  --ppx-card: rgba(255, 255, 255, 0.06);
  --ppx-stroke: rgba(255, 255, 255, 0.16);
  --ppx-accent: #40E0D0;
  --ppx-accent-2: #1ABC9C;
  --ppx-text: #eafffb;
  --ppx-subtext: #bff3ea;
}
#ppx-loader-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: grid;
  place-items: center;
  background:
    radial-gradient(1200px 800px at 10% -10%, rgba(64,224,208,0.14), transparent 60%),
    radial-gradient(1000px 700px at 110% 110%, rgba(26,188,156,0.12), transparent 60%),
    var(--ppx-bg);
  backdrop-filter: saturate(120%) blur(5px);
  -webkit-backdrop-filter: saturate(120%) blur(5px);
  animation: ppx-fade-in 220ms ease-out both;
  pointer-events: auto;
}
#ppx-loader-card {
  display: grid;
  grid-auto-rows: min-content;
  gap: 14px;
  padding: 24px 28px;
  border-radius: 16px;
  background: var(--ppx-card);
  box-shadow:
    0 10px 30px rgba(0,0,0,0.35),
    inset 0 0 0 1px var(--ppx-stroke);
  transform: translateZ(0);
  animation: ppx-pop 220ms cubic-bezier(.2,.9,.2,1) both;
}
#ppx-spinner-wrap { position: relative; width: 64px; height: 64px; margin-inline: auto; }
#ppx-spinner {
  box-sizing: border-box; width: 64px; height: 64px; border-radius: 50%;
  border: 6px solid rgba(255,255,255,0.18);
  border-top-color: var(--ppx-accent);
  border-right-color: var(--ppx-accent-2);
  animation: ppx-spin 1000ms linear infinite;
}
#ppx-spinner-ring {
  position: absolute; inset: -8px; border-radius: 50%;
  border: 2px dotted rgba(64,224,208,0.28);
  animation: ppx-spin 6s linear infinite reverse;
}
#ppx-title {
  color: var(--ppx-text);
  font: 700 15px/1.35 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial;
  text-align: center; letter-spacing: .2px;
}
#ppx-sub {
  color: var(--ppx-subtext);
  font: 600 12.5px/1.4 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial;
  text-align: center;
}
#ppx-dots { display: inline-grid; grid-auto-flow: column; gap: 4px; margin-left: 4px; vertical-align: baseline; }
.ppx-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--ppx-accent); opacity: .45; animation: ppx-bounce 900ms ease-in-out infinite; }
.ppx-dot:nth-child(2) { animation-delay: 120ms; }
.ppx-dot:nth-child(3) { animation-delay: 240ms; }
@keyframes ppx-spin { to { transform: rotate(360deg); } }
@keyframes ppx-bounce { 0%,100% { transform: translateY(0); opacity: .5; } 50% { transform: translateY(-3px); opacity: 1; } }
@keyframes ppx-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes ppx-pop { from { transform: translateY(4px) scale(.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { #ppx-spinner, #ppx-spinner-ring, .ppx-dot { animation-duration: 2.5s; } }
`;
      const overlay = document.createElement('div');
      overlay.id = 'ppx-loader-backdrop';
      overlay.setAttribute('aria-hidden', 'true');

      const card = document.createElement('div');
      card.id = 'ppx-loader-card';
      card.setAttribute('role', 'status');
      card.setAttribute('aria-live', 'polite');

      const spinnerWrap = document.createElement('div');
      spinnerWrap.id = 'ppx-spinner-wrap';

      const spinner = document.createElement('div');
      spinner.id = 'ppx-spinner';

      const ring = document.createElement('div');
      ring.id = 'ppx-spinner-ring';

      const title = document.createElement('div');
      title.id = 'ppx-title';
      title.textContent = 'Preparing workspace';

      const sub = document.createElement('div');
      sub.id = 'ppx-sub';
      sub.innerHTML = 'Please wait<span id="ppx-dots"><i class="ppx-dot"></i><i class="ppx-dot"></i><i class="ppx-dot"></i></span>';

      spinnerWrap.append(spinner, ring);
      card.append(spinnerWrap, title, sub);
      overlay.append(card);

      const prevOverflow = {
        html: document.documentElement.style.overflow,
        body: document.body.style.overflow,
      };
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      const prevBusyHtml = document.documentElement.getAttribute('aria-busy');
      document.documentElement.setAttribute('aria-busy', 'true');

      document.head.appendChild(style);
      document.body.appendChild(overlay);
      window.__ppxAnimLock = { style, overlay, prevOverflow, prevBusyHtml };
    } catch (err) {
      log('showLoader error:', err?.message || err);
    }
  }

  function hideLoader() {
    if (!CFG.loader.enable) return;
    try {
      const lock = window.__ppxAnimLock;
      if (!lock) return;
      const { overlay, style, prevOverflow, prevBusyHtml } = lock;
      overlay.style.animation = 'ppx-fade-in 180ms ease-in reverse both';
      setTimeout(() => {
        try {
          overlay?.parentNode?.removeChild(overlay);
          style?.parentNode?.removeChild(style);
        } catch {}
        document.documentElement.style.overflow = prevOverflow?.html ?? '';
        document.body.style.overflow = prevOverflow?.body ?? '';
        if (prevBusyHtml == null) {
          document.documentElement.removeAttribute('aria-busy');
        } else {
          document.documentElement.setAttribute('aria-busy', prevBusyHtml);
        }
        delete window.__ppxAnimLock;
      }, 180);
    } catch (err) {
      log('hideLoader error:', err?.message || err);
    }
  }

  // ────── tasks ────────────────────────────────────────────────────────────
  async function toggleIncognitoIfNeeded() {
    try {
      const avatarBtn = await waitForEl('[data-testid="sidebar-popover-trigger-signed-in"], [data-testid="sidebar-popover-trigger"]', { timeout: 5_000 });
      // Heuristic: if avatar has an <img> it likely indicates signed-in mode; otherwise Incognito is already active.
      if (!avatarBtn.querySelector('img')) {
        log('Incognito appears already enabled');
        return;
      }
      await safeClick(avatarBtn);
      log('Avatar clicked. Waiting for menu…');
      await sleep(CFG.menuPauseMs);

      // Find the "Incognito" control by common patterns: explicit text or a role=switch near "Incognito".
      let incognitoBtn = null;
      try {
        incognitoBtn = await findByText('button', 'Incognito', { exact: false, timeout: 3_000 });
      } catch {}
      if (!incognitoBtn) {
        // Fallback: any switch adjacent to a label containing "Incognito"
        const buttons = Array.from(document.querySelectorAll('button[role="switch"], [role="menuitemcheckbox"], button'));
        const guess = buttons.find((b) => /incognito/i.test(b.textContent || '') || /incognito/i.test(b.getAttribute('aria-label') || ''));
        if (guess) incognitoBtn = guess;
      }
      await safeClick(incognitoBtn);
      log('Incognito enabled');
      await sleep(CFG.smallPauseMs);
    } catch (err) {
      log('toggleIncognitoIfNeeded error:', err?.message || err);
    }
  }

  async function enableSocialSources() {
    try {
      const sourcesBtn = await waitForEl('[data-testid="sources-switcher-button"]', { timeout: 6_000 });
      await safeClick(sourcesBtn);
      log('Sources button clicked. Waiting for popup…');
      await sleep(CFG.menuPauseMs);

      const socialToggleContainer = await waitForEl('[data-testid="source-toggle-social"]', { timeout: 6_000 });
      const socialSwitch = socialToggleContainer.querySelector('button[role="switch"], [role="switch"]');
      const isEnabled =
        socialSwitch?.getAttribute('aria-checked') === 'true' ||
        socialSwitch?.getAttribute('data-state') === 'checked';
      if (!isEnabled) {
        await safeClick(socialSwitch);
        log('Social sources enabled');
        await sleep(CFG.smallPauseMs);
      } else {
        log('Social sources already enabled');
      }
    } catch (err) {
      log('enableSocialSources error:', err?.message || err);
    }
  }

  async function openModelSwitcher() {
    try {
      let modelBtn =
        document.querySelector('[data-testid="model-switcher-button"]') ||
        document.querySelector('button[aria-haspopup="menu"][aria-expanded], .max-w-24');

      modelBtn = modelBtn || (await waitForEl('[data-testid="model-switcher-button"]', { timeout: 5_000 }));
      await safeClick(modelBtn);
      log('Model switcher opened (no selection performed)');
      await sleep(CFG.smallPauseMs);
    } catch (err) {
      log(`openModelSwitcher error: ${err?.message || err}`);
    }
  }

  // ────── bootstrap ────────────────────────────────────────────────────────
  (async () => {
    try {
      await sleep(CFG.initialDelayMs);
      showLoader();
      await toggleIncognitoIfNeeded();
      await enableSocialSources();
      await openModelSwitcher();
      log('Helper script completed');
    } catch (err) {
      log('bootstrap error:', err?.message || err);
    } finally {
      hideLoader();
      delete window.__ppxHelperActive;
    }
  })();
})();

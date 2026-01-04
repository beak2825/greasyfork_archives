// ==UserScript==
// @name         Genspark Nano Banana Auto 2K
// @namespace    https://github.com/lueluelue2006
// @version      0.1.0
// @description  Auto-select 2K image size on https://www.genspark.ai/agents?type=moa_generate_image
// @author       schweigen
// @license      MIT
// @match        https://www.genspark.ai/agents*
// @match        https://genspark.ai/agents*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560697/Genspark%20Nano%20Banana%20Auto%202K.user.js
// @updateURL https://update.greasyfork.org/scripts/560697/Genspark%20Nano%20Banana%20Auto%202K.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TARGET_TYPE = 'moa_generate_image';
  const TARGET_SIZE_LABEL = '2K';

  const DEBUG = false;
  const LOG_PREFIX = '[Genspark Auto 2K]';
  const log = (...args) => {
    if (!DEBUG) return;
    // eslint-disable-next-line no-console
    console.log(LOG_PREFIX, ...args);
  };

  const normalizeText = (text) => (text || '').replace(/\s+/g, ' ').trim();

  const isTargetPage = () => {
    try {
      const url = new URL(location.href);
      return url.pathname === '/agents' && url.searchParams.get('type') === TARGET_TYPE;
    } catch {
      return false;
    }
  };

  const safeClick = (el) => {
    if (!el) return false;
    const rect = typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : null;
    const x = rect ? Math.floor(rect.left + rect.width / 2) : 0;
    const y = rect ? Math.floor(rect.top + rect.height / 2) : 0;

    if (typeof PointerEvent === 'function' && rect && rect.width > 0 && rect.height > 0) {
      el.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          view: window,
          pointerType: 'mouse',
          isPrimary: true,
          clientX: x,
          clientY: y,
          button: 0,
          buttons: 1,
        })
      );
      el.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          view: window,
          pointerType: 'mouse',
          isPrimary: true,
          clientX: x,
          clientY: y,
          button: 0,
          buttons: 0,
        })
      );
    }

    el.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        button: 0,
      })
    );

    return true;
  };

  const waitFor = (predicate, { timeoutMs = 15_000, pollMs = 250 } = {}) =>
    new Promise((resolve, reject) => {
      const start = Date.now();
      let done = false;

      const cleanup = () => {
        obs.disconnect();
        clearInterval(poller);
        clearTimeout(timeout);
      };

      const tryResolve = () => {
        if (done) return;

        let value = null;
        try {
          value = predicate();
        } catch {
          value = null;
        }

        if (value) {
          done = true;
          cleanup();
          resolve(value);
        }
      };

      const obs = new MutationObserver(tryResolve);
      const poller = setInterval(tryResolve, pollMs);
      const timeout = setTimeout(() => {
        if (done) return;
        done = true;
        cleanup();
        reject(new Error(`Timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      obs.observe(document.documentElement, { childList: true, subtree: true });
      tryResolve();
    });

  const findSettingsPanel = () => {
    const panels = Array.from(document.querySelectorAll('.settings-panel'));
    return (
      panels.find((p) => normalizeText(p.textContent).includes('Image Size')) ||
      panels.find((p) => normalizeText(p.textContent).includes('Aspect Ratio')) ||
      null
    );
  };

  const findSettingTrigger = () => {
    const textNodes = Array.from(document.querySelectorAll('.text'));
    const settingText = textNodes.find((el) => normalizeText(el.textContent) === 'Setting');
    if (!settingText) return null;
    return (
      settingText.closest('[role="button"],button,a,.models-selected,.model-selected') || settingText
    );
  };

  const findSizeOption = (label) => {
    const panel = findSettingsPanel();
    if (!panel) return null;
    const options = Array.from(panel.querySelectorAll('.size-option'));
    const normalizedLabel = normalizeText(label);
    return (
      options.find((el) => normalizeText(el.textContent) === normalizedLabel) ||
      options.find((el) => normalizeText(el.textContent).startsWith(normalizedLabel)) ||
      null
    );
  };

  const ensure2KOnce = async () => {
    if (!isTargetPage()) return false;

    const trigger = await waitFor(findSettingTrigger).catch(() => null);
    if (!trigger) return false;

    const alreadyOpen = !!findSettingsPanel();
    if (!alreadyOpen) safeClick(trigger);

    const panel = await waitFor(findSettingsPanel).catch(() => null);
    if (!panel) return false;

    const option2k = findSizeOption(TARGET_SIZE_LABEL);
    if (!option2k) return false;

    if (!option2k.classList.contains('selected')) {
      log('Selecting', TARGET_SIZE_LABEL);
      safeClick(option2k);
    } else {
      log('Already selected', TARGET_SIZE_LABEL);
    }
    return true;
  };

  let runInFlight = null;
  const scheduleEnsure2K = () => {
    if (runInFlight) return;
    runInFlight = (async () => {
      try {
        await ensure2KOnce();
      } finally {
        runInFlight = null;
      }
    })();
  };

  const hookHistory = () => {
    const emit = () => window.dispatchEvent(new Event('genspark:auto-2k:urlchange'));
    const wrap = (method) =>
      function (...args) {
        const ret = method.apply(this, args);
        emit();
        return ret;
      };

    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
    window.addEventListener('popstate', emit, { passive: true });
    window.addEventListener('genspark:auto-2k:urlchange', scheduleEnsure2K, { passive: true });
  };

  hookHistory();
  scheduleEnsure2K();
})();

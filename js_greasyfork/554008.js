// ==UserScript==
// @name         Wikipedia Dark Theme Automatic
// @namespace    https://github.com/ImElio/wikipedia-dark-theme-automatic
// @version      1.0.0
// @description  Applies and maintains the dark theme on Wikipedia (Vector/Minerva), without white flash and local persistence.
// @author       Elio
// @license      MIT
// @homepageURL  https://github.com/ImElio/wikipedia-dark-theme-automatic
// @supportURL   https://github.com/ImElio/wikipedia-dark-theme-automatic/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @match        *://*.wikipedia.org/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554008/Wikipedia%20Dark%20Theme%20Automatic.user.js
// @updateURL https://update.greasyfork.org/scripts/554008/Wikipedia%20Dark%20Theme%20Automatic.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ——— Config ——————————————————————————————————————————————————————————
  const CONFIG = {
    FORCE_DARK: true,
    AUTO_BASED_ON_OS: true,
    WRITE_LOCAL_PREF: true,
    ANTI_FLASH_INLINE_CSS: true,
    LOG: false
  };

  const log = (...a) => CONFIG.LOG && console.log('[WikiDark]', ...a);

  const DARK_CLASS = 'skin-theme-clientpref-night'; // classe ufficiale usata da MediaWiki per night mode
  const isDark = () => document.documentElement.classList.contains(DARK_CLASS);
  const addDark = () => {
    if (!isDark()) document.documentElement.classList.add(DARK_CLASS);
  };

  const htmlClass = document.documentElement.className || '';
  const isMinerva = /skin-minerva/.test(htmlClass) || location.hostname.startsWith('m.');
  const isVector = /skin-vector/.test(htmlClass) || !isMinerva; // default desktop

  if (CONFIG.ANTI_FLASH_INLINE_CSS) {
    const s = document.createElement('style');
    s.textContent = `
      :root { color-scheme: dark !important; }
      html, body { background: #111 !important; color: #ddd !important; }
      a { color: #9dc1ff !important; }
    `;
    document.documentElement.appendChild(s);
  }


  if (CONFIG.WRITE_LOCAL_PREF) {
    try {
      localStorage.setItem('wikimedia-ui-theme', 'dark');
    } catch (e) {
      log('localStorage non disponibile:', e);
    }
  }


  const ensureNightParam = () => {
    const url = new URL(window.location.href);
    let changed = false;

    if (isVector && url.searchParams.get('vectornightmode') !== '1') {
      url.searchParams.set('vectornightmode', '1');
      changed = true;
    }
    if (isMinerva && url.searchParams.get('minervanightmode') !== '1') {
      url.searchParams.set('minervanightmode', '1');
      changed = true;
    }

    if (changed) {
      history.replaceState(null, '', url.toString());
      log('Parametri night mode impostati');
    }
  };


  const prefersDark = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const shouldApplyDark =
    CONFIG.FORCE_DARK || (CONFIG.AUTO_BASED_ON_OS && prefersDark());

  if (shouldApplyDark) {
    addDark();
    ensureNightParam();
  }


  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'attributes' && m.attributeName === 'class') {
        if (!isDark() && shouldApplyDark) {
          addDark();
          ensureNightParam();
          log('Dark riapplicato dopo mutazione');
        }
      }
    }
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });


  const linkObserver = new MutationObserver(() => {
    const link = document.querySelector('link[data-mw-dynamic-theme]');
    if (link && shouldApplyDark) {
      const href = link.getAttribute('href') || '';
      if (/light/i.test(href)) {
        link.setAttribute('href', href.replace(/light/ig, 'dark'));
        log('link[data-mw-dynamic-theme] forzato a dark');
      }
    }
  });
  linkObserver.observe(document.documentElement, { childList: true, subtree: true });

  if (!CONFIG.FORCE_DARK && CONFIG.AUTO_BASED_ON_OS && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener?.('change', () => {
      if (mq.matches) {
        addDark();
        ensureNightParam();
      } else {
        document.documentElement.classList.remove(DARK_CLASS);
        const url = new URL(location.href);
        url.searchParams.delete('vectornightmode');
        url.searchParams.delete('minervanightmode');
        history.replaceState(null, '', url.toString());
      }
      log('Sistema ha cambiato tema; pagina adeguata');
    });
  }

})();
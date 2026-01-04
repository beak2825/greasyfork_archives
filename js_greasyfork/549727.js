// ==UserScript==
// @name         Twitch - Force sort Viewers High to Low
// @namespace    twitch-force-sort-viewers
// @version      1.7
// @description  Auto-set sort to "Viewers High->Low" with configurable run policy
// @author       Vikindor (https://vikindor.github.io/)
// @homepageURL  https://github.com/Vikindor/twitch-force-sort-viewers/
// @supportURL   https://github.com/Vikindor/twitch-force-sort-viewers/issues
// @license      MIT
// @match        https://www.twitch.tv/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549727/Twitch%20-%20Force%20sort%20Viewers%20High%20to%20Low.user.js
// @updateURL https://update.greasyfork.org/scripts/549727/Twitch%20-%20Force%20sort%20Viewers%20High%20to%20Low.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------------- CONFIG ----------------
  // RUN_POLICY options:
  // - 'perLoad' : run once per URL per page load (F5 will run again)
  // - 'perTab'  : run once per URL per tab session (F5 won't run again)
  const RUN_POLICY = 'perLoad';

  const SORT_ID_SUBSTR = 'browse-sort-drop-down';
  const TARGET_SUFFIX = 'opt1';
  const TARGET_LABELS = [
    "Viewers (High to Low)",
    "Seere (høj-lav)",
    "Zuschauer (viel -> wenig)",
    "Espectadores (descend.)",
    "Más espectadores",
    "Spectateurs (décroissant)",
    "Spettatori (decr.)",
    "Nézők száma (csökkenő)",
    "Kijkers (hoog - laag)",
    "Seere (høyt til lavt)",
    "Widzów (najwięcej)",
    "Espetadores (ordem desc.)",
    "Espectadores (ordem decrescente)",
    "Vizualizatori (mare la mic)",
    "Divákov (zostupne)",
    "Katsojaluku (suurin ensin)",
    "Tittare (flest först)",
    "Lượng xem (Cao đến thấp)",
    "İzleyici (çoktan aza)",
    "Diváků (sestupně)",
    "Θεατές (Φθίν. ταξιν.)",
    "Зрители (низходящ ред)",
    "Аудитория (по убыв.)",
    "ผู้ชม (สูงไปต่ำ)",
    "المشاهدون (من الأعلى إلى الأقل)",
    "观众人数（高到低）",
    "觀眾人數 (高到低)",
    "視聴者数（降順）",
    "시청자 수 (높은 순)"
  ];
  // ---------------------------------------

  const waitFor = (selector, { timeout = 15000, interval = 150, filter = null } = {}) =>
    new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function poll() {
        const nodes = Array.from(document.querySelectorAll(selector));
        const el = filter ? nodes.find(filter) : nodes[0];
        if (el) return resolve(el);
        if (Date.now() - t0 > timeout) return reject(new Error('timeout:' + selector));
        setTimeout(poll, interval);
      })();
    });

  const safeClick = (el) => { try { el.click(); } catch (_) {} };

  const HEADING_FOCUS_SEL = [
    'h1.tw-title',
    'h1[tabindex="-1"]',
    '[role="heading"].tw-title',
    '[data-test-selector="channel-header-title"] h1',
  ].join(',');

  function defocusWeirdHeading() {
    const el = document.activeElement;

    if (!el || el === document.body) return;

    if (
      el.matches(HEADING_FOCUS_SEL) ||
      ((el.getAttribute('role') === 'heading' || /^H\d$/.test(el.tagName)) && el.tabIndex === -1)
    ) {
      try { el.blur(); } catch (_) {}
    }
  }

  (function injectNoOutlineCSS() {
    const css = `
      ${HEADING_FOCUS_SEL}:focus { outline: none !important; box-shadow: none !important; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);
  })();

  const urlPart = () => {
    const u = new URL(location.href);
    u.searchParams.delete('sort');
    return `${u.pathname}${u.search}`;
  };
  const loadPart = () => `${performance.timeOrigin}`;

  const keyForUrl = () => {
    if (RUN_POLICY === 'perLoad') return `tw_sort_opt1_${urlPart()}_${loadPart()}`;
    if (RUN_POLICY === 'perTab')  return `tw_sort_opt1_${urlPart()}`;
    return '';
  };

  const alreadyRan = () => !!sessionStorage.getItem(keyForUrl());
  const markRan = () => sessionStorage.setItem(keyForUrl(), '1');


  async function ensureSortOpt1() {

    if (!document.querySelector(`[role="combobox"][aria-controls*="${SORT_ID_SUBSTR}"]`)) {
      defocusWeirdHeading();
      return;
    }
    if (alreadyRan()) return;

    try {
      const combo = await waitFor(
        `[role="combobox"][aria-controls*="${SORT_ID_SUBSTR}"]`
      );


      const labelEl = combo.querySelector('[data-a-target="tw-core-button-label-text"]');
      const labelText = (labelEl ? labelEl.textContent : combo.textContent || '').trim();
      if (TARGET_LABELS.includes(labelText)) {
        defocusWeirdHeading();
        markRan();
        return;
      }

      const current = combo.getAttribute('aria-activedescendant') || '';
      if (current.endsWith(TARGET_SUFFIX)) {
        defocusWeirdHeading();
        markRan();
        return;
      }

      safeClick(combo);
      const option = await waitFor(
        `[id$="${TARGET_SUFFIX}"][role="menuitemradio"], [id$="${TARGET_SUFFIX}"][role="option"], [id$="${TARGET_SUFFIX}"]`,
        { filter: (el) => !!(el.offsetParent || el.getClientRects().length) }
      );
      safeClick(option);


      setTimeout(defocusWeirdHeading, 0);

      markRan();
    } catch (_) {

      setTimeout(defocusWeirdHeading, 0);
    }
  }

  setTimeout(() => { defocusWeirdHeading(); ensureSortOpt1(); }, 500);

  window.addEventListener('focusin', defocusWeirdHeading, true);

  (function hookHistory() {
    const fire = () => window.dispatchEvent(new Event('locationchange'));
    const p = history.pushState, r = history.replaceState;
    history.pushState = function () { p.apply(this, arguments); fire(); };
    history.replaceState = function () { r.apply(this, arguments); fire(); };
    window.addEventListener('popstate', fire);
  })();

  window.addEventListener('locationchange', () => {
    setTimeout(() => { defocusWeirdHeading(); ensureSortOpt1(); }, 600);
  });
})();

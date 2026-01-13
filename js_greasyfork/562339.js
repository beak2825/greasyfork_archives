// ==UserScript==
// @name         Universalis 繁中⇄簡中自動轉換
// @namespace    https://universalis.app/
// @version      1.5.1
// @description  繁中輸入→簡中查詢（mapping+OpenCC），頁面簡中→繁中，React controlled input 穩定版
// @author       kimklai
// @match        https://universalis.app/*
// @icon         https://universalis.app/favicon.ico
// @license      MIT
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562339/Universalis%20%E7%B9%81%E4%B8%AD%E2%87%84%E7%B0%A1%E4%B8%AD%E8%87%AA%E5%8B%95%E8%BD%89%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/562339/Universalis%20%E7%B9%81%E4%B8%AD%E2%87%84%E7%B0%A1%E4%B8%AD%E8%87%AA%E5%8B%95%E8%BD%89%E6%8F%9B.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /***************** Google Sheets Mapping *****************/
  const SHEET_CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vR-_aanwWQL9fsLyVEfrgrCNU6_vc1oL8k4k617VvbAieUkPoGAAxOrw71YR9R2jPQ0GkCL9ikNB17d/pub?gid=0&single=true&output=csv';

  const MAP_CACHE_KEY = 'ffxivZhMappingSheet';
  const MAP_CACHE_TIME = 12 * 60 * 60 * 1000; // 12h

  async function loadMappingFromSheet() {
    const cached = GM_getValue(MAP_CACHE_KEY);
    if (cached && Date.now() - cached.time < MAP_CACHE_TIME) {
      //console.log('[ZH-Fix] Mapping loaded from cache');
      return cached.data;
    }

    try {
      const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
      const text = await res.text();
      const lines = text.split('\n').slice(1);

      const map = {};
      for (const line of lines) {
        if (!line.trim()) continue;
        const [tw, cn] = line.split(',').map(v => v?.trim());
        if (tw && cn) map[tw] = cn;
      }

      GM_setValue(MAP_CACHE_KEY, { time: Date.now(), data: map });
      //console.log('[ZH-Fix] Mapping loaded from Sheets:', map);
      return map;
    } catch (e) {
      console.warn('[ZH-Fix] Mapping load failed', e);
      return {};
    }
  }

  /***************** Load OpenCC *****************/
  function loadScript(url) {
    return new Promise(resolve => {
      const s = document.createElement('script');
      s.src = url;
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  loadScript('https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js')
    .then(async () => {
      //console.log('[ZH-Fix] OpenCC loaded');

      const NAME_MAP = await loadMappingFromSheet();

      const t2s = OpenCC.Converter({ from: 'twp', to: 'cn' });
      const s2t = OpenCC.Converter({ from: 'cn', to: 'twp' });

      function applyMapping(text) {
        let result = text;
        for (const [tw, cn] of Object.entries(NAME_MAP)) {
          result = result.replaceAll(tw, cn);
        }
        return result;
      }

      /***************** React-safe setter *****************/
      const nativeSetter =
        Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'value'
        ).set;

      function setReactValue(input, value) {
        nativeSetter.call(input, value);
        input.dispatchEvent(new InputEvent('input', { bubbles: true }));
      }

      /***************** Input Hook *****************/
      const hooked = new WeakSet();

      function hookInput(input) {
        if (!input || hooked.has(input)) return;
        hooked.add(input);

        const handler = () => {
          const original = input.value;
          if (!original) return;

          const mapped = applyMapping(original);
          const converted = t2s(mapped);

          //console.log(`[ZH-Fix] "${original}" → mapped "${mapped}" → cn "${converted}"`);

          if (converted !== original) {
            setReactValue(input, converted);
            requestAnimationFrame(() => {
              input.value = original; // 畫面維持繁中
            });
          }
        };

        input.addEventListener('input', handler);
        input.addEventListener('compositionend', handler);
        input.addEventListener('blur', handler);

        //console.log('[ZH-Fix] Hooked input:', input);
      }

      function findAndHookInputs() {
        document
          .querySelectorAll('input[type="search"], input')
          .forEach(hookInput);
      }

      /***************** DOM 簡 → 繁 *****************/
      function convertDOM(root = document.body) {
        const walker = document.createTreeWalker(
          root,
          NodeFilter.SHOW_TEXT,
          null
        );
        let node;
        while ((node = walker.nextNode())) {
          if (
            node.parentNode &&
            !['SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA'].includes(
              node.parentNode.tagName
            )
          ) {
            const converted = s2t(node.textContent);
            if (node.textContent !== converted) {
              node.textContent = converted;
            }
          }
        }
      }

      /***************** Observe *****************/
      const observer = new MutationObserver(() => {
        requestAnimationFrame(() => {
          findAndHookInputs();
          convertDOM();
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });

      requestAnimationFrame(() => {
        findAndHookInputs();
        convertDOM();
        //console.log('[ZH-Fix] Initial conversion done');
      });

      /***************** Manual reload *****************/
      document.addEventListener('keydown', async e => {
        if (e.altKey && e.shiftKey && e.code === 'KeyR') {
          console.log('[ZH-Fix] Reload mapping from Sheets');
          GM_setValue(MAP_CACHE_KEY, null);
          location.reload();
        }
      });
    });
})();

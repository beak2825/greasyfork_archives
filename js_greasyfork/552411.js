// ==UserScript==
// @name         Translate Website (Alt+X)
// @namespace    https://github.com/zyrocossol11/Translate-Websites-Userscript
// @version      2.1.0
// @description  Press Alt+X to toggle between original and Google-translated page.
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552411/Translate%20Website%20%28Alt%2BX%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552411/Translate%20Website%20%28Alt%2BX%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const STORAGE_KEY = 'translate_toggle_target_lang';
  const DEFAULT_LANG = 'en';
  const TRANSLATE_BASE = 'https://translate.google.com/translate';

  const PRESET_LANGS = [
    { label: 'English (en)', code: 'en' },
    { label: 'Español (es)', code: 'es' },
    { label: 'Français (fr)', code: 'fr' },
    { label: 'Deutsch (de)', code: 'de' },
    { label: 'Português (pt)', code: 'pt' },
    { label: 'Русский (ru)', code: 'ru' },
    { label: '日本語 (ja)', code: 'ja' },
    { label: '한국어 (ko)', code: 'ko' },
    { label: '简体中文 (zh-CN)', code: 'zh-CN' },
    { label: '繁體中文 (zh-TW)', code: 'zh-TW' },
    { label: 'العربية (ar)', code: 'ar' },
  ];

  let targetLang = DEFAULT_LANG;
  const setLang = (code) => {
    targetLang = code;
    try {
      const r = typeof GM_setValue === 'function' ? GM_setValue(STORAGE_KEY, code) : null;
      if (r && typeof r.then === 'function') r.catch(() => {});
      console.info(`[Translate Toggle] Language set to ${code}`);
    } catch {}
  };
  const loadLang = () => {
    try {
      const v = typeof GM_getValue === 'function' ? GM_getValue(STORAGE_KEY, DEFAULT_LANG) : DEFAULT_LANG;
      if (v && typeof v.then === 'function') {
        v.then((val) => (targetLang = val || DEFAULT_LANG)).catch(() => {});
      } else {
        targetLang = v || DEFAULT_LANG;
      }
    } catch {
      targetLang = DEFAULT_LANG;
    }
  };
  loadLang();

  const isEditable = (el) => {
    if (!el) return false;
    if (el.isContentEditable) return true;
    const tag = (el.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (tag === 'DIV' && el.getAttribute('role') === 'textbox') return true;
    return false;
  };

  const isOnGoogleTranslate = (urlObj) => {
    const host = urlObj.hostname;
    return (
      /^translate\.google\./i.test(host) ||
      /(^|\.)translate\.goog$/i.test(host) ||
      /translate\.googleusercontent\.com$/i.test(host)
    );
  };

  const extractOriginalFromTranslateURL = (urlObj) => {
    const params = urlObj.searchParams;
    for (const name of ['u', 'url', 'q']) {
      const val = params.get(name);
      if (val) return val;
    }
    return '';
  };

  const buildTranslateUrl = (originalUrl, lang) =>
    `${TRANSLATE_BASE}?sl=auto&tl=${encodeURIComponent(lang)}&hl=${encodeURIComponent(lang)}&u=${encodeURIComponent(originalUrl)}`;

  const toggleTranslate = () => {
    const here = new URL(location.href);

    if (isOnGoogleTranslate(here)) {
      const original = extractOriginalFromTranslateURL(here);
      if (original) {
        location.assign(original);
        return;
      }
      const canonical = document.querySelector('link[rel="canonical"]')?.href;
      if (canonical) {
        try {
          const ch = new URL(canonical).hostname;
          if (!/translate\./i.test(ch)) {
            location.assign(canonical);
            return;
          }
        } catch {}
      }
      if (history.length > 1) {
        history.back();
      } else {
        console.warn('[Translate Toggle] Could not find original URL.');
      }
    } else {
      const to = buildTranslateUrl(location.href, targetLang);
      location.assign(to);
    }
  };

  const chooseLanguage = () => {
    const list = PRESET_LANGS.map((o, i) => `${i + 1}. ${o.label}`).join('\n');
    const input = prompt(
      `Choose target language (type number or code)\nCurrent: ${targetLang}\n\n${list}\n\nOr enter any language code (e.g., en, es, fr, de, ja, zh-CN):`,
      targetLang
    );
    if (!input) return;
    const trimmed = input.trim();
    const idx = Number(trimmed);
    if (Number.isInteger(idx) && idx >= 1 && idx <= PRESET_LANGS.length) {
      setLang(PRESET_LANGS[idx - 1].code);
    } else {
      setLang(trimmed);
    }
  };

  window.addEventListener(
    'keydown',
    (e) => {
      if (
        e.altKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.repeat &&
        String(e.key).toLowerCase() === 'x' &&
        !isEditable(e.target)
      ) {
        e.preventDefault();
        toggleTranslate();
      }
    },
    true
  );

  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('Toggle translate (Alt+X)', toggleTranslate);
    GM_registerMenuCommand('Set language…', chooseLanguage);
  }
})();
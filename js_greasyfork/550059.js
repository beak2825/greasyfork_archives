// ==UserScript==
// @name         PyCard Autofill (Save/Persist Form Data CodeInput)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Persist and restore textarea contents per problem page
// @match        https://pycard.org/*
// @match        https://www.pycard.org/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550059/PyCard%20Autofill%20%28SavePersist%20Form%20Data%20CodeInput%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550059/PyCard%20Autofill%20%28SavePersist%20Form%20Data%20CodeInput%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const storageKey = 'pycard_autofill::' + location.href;

  function save(val) {
    try { localStorage.setItem(storageKey, val); } catch (e) {}
  }

  function restore(el) {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved && el.value.trim() === '') el.value = saved;
    } catch (e) {}
  }

  function init() {
    let textarea = document.getElementById('codeInput');
    if (!textarea) return;

    restore(textarea);

    textarea.addEventListener('input', () => save(textarea.value));

    const submitBtn = document.querySelector('#codeForm button[type="button"]');
    if (submitBtn) submitBtn.addEventListener('click', () => save(textarea.value));

    window.addEventListener('beforeunload', () => save(textarea.value));

    const obs = new MutationObserver(() => {
      const current = document.getElementById('codeInput');
      if (current && current !== textarea) {
        textarea = current;
        restore(textarea);
        textarea.addEventListener('input', () => save(textarea.value));
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
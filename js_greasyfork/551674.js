// ==UserScript==
// @name         АНИМАЦИИ ГОВНО
// @namespace    http://tampermonkey.net/
// @description  Отключение анимаций
// @version      1
// @match        https://*/cards/pack/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551674/%D0%90%D0%9D%D0%98%D0%9C%D0%90%D0%A6%D0%98%D0%98%20%D0%93%D0%9E%D0%92%D0%9D%D0%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/551674/%D0%90%D0%9D%D0%98%D0%9C%D0%90%D0%A6%D0%98%D0%98%20%D0%93%D0%9E%D0%92%D0%9D%D0%9E.meta.js
// ==/UserScript==

(function() { 'use strict';

    const observer = new MutationObserver(() => { document.querySelectorAll('.lootbox__list').forEach(el => { el.classList.remove('step1', 'step2', 'step3'); }); });

    observer.observe(document.body, { childList: true, subtree: true });
})();
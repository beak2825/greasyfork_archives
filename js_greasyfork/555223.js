// ==UserScript==
// @name         Ответы Mail.ru - Ctrl+Click в новой вкладке
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Открывает посты в новой фоновой вкладке по Ctrl+Click
// @author       torch
// @match        https://otvet.mail.ru/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/555223/%D0%9E%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20Mailru%20-%20Ctrl%2BClick%20%D0%B2%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/555223/%D0%9E%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20Mailru%20-%20Ctrl%2BClick%20%D0%B2%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%B9%20%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(e) {
        if (e.ctrlKey) {
            let target = e.target;
            while (target && target !== document.body) {
                if (target.matches('a[href*="/question/"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                    GM_openInTab(target.href, { active: false });
                    break;
                }
                target = target.parentElement;
            }
        }
    }, true);
})();
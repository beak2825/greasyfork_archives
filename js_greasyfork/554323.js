// ==UserScript==
// @name         Solve with SCTG
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Auto-click "Solve with SCTG" on any site
// @author       KukuModz
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554323/Solve%20with%20SCTG.user.js
// @updateURL https://update.greasyfork.org/scripts/554323/Solve%20with%20SCTG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TARGET = 'solve with sctg';

    function clickSolve() {
        const elements = document.querySelectorAll('*:not(script):not(style)');
        for (const el of elements) {
            if (el.textContent && el.textContent.toLowerCase().includes(TARGET)) {
                el.click();
                console.log('[KukuModz] Clicked:', el);
            }
        }
    }

    window.addEventListener('load', () => {
        console.log('[KukuModz] Solve with SCTG active on', location.href);
        clickSolve();

        const observer = new MutationObserver(() => clickSolve());
        observer.observe(document.body, { childList: true, subtree: true });

        setInterval(clickSolve, 3000);

        // =========================
        // === TELEGRAM BANNER
        // =========================
        const telegramBanner = document.createElement('div');
        telegramBanner.style.cssText = `
            position: fixed; bottom: 15px; right: 15px;
            display: flex; align-items: center; gap: 8px;
            background: linear-gradient(90deg, #0088cc, #00c6ff);
            padding: 8px 16px; border-radius: 12px;
            color: white; font-weight: bold;
            box-shadow: 0 0 15px rgba(0,255,255,0.5);
            z-index: 999999;
            cursor: pointer;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        const telegramLink = document.createElement('a');
        telegramLink.href = 'https://t.me/+CKt0ZiZ-3GEwZTA0';
        telegramLink.target = '_blank';
        telegramLink.style.cssText = `
            display: flex; align-items: center; gap: 6px;
            color: white; text-decoration: none;
        `;
        const logo = document.createElement('img');
        logo.src = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg';
        logo.style.width = '20px';
        logo.style.height = '20px';
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Join Telegram';
        telegramLink.appendChild(logo);
        telegramLink.appendChild(textSpan);
        telegramBanner.appendChild(telegramLink);

        telegramBanner.onmouseover = () => {
            telegramBanner.style.transform = 'scale(1.1)';
            telegramBanner.style.boxShadow = '0 0 25px rgba(0,255,255,0.8)';
        };
        telegramBanner.onmouseout = () => {
            telegramBanner.style.transform = 'scale(1)';
            telegramBanner.style.boxShadow = '0 0 15px rgba(0,255,255,0.5)';
        };

        document.body.appendChild(telegramBanner);
    });

})();

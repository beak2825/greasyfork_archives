// ==UserScript==
// @name         YouTube MP3 Button (Simple & Working)
// @namespace    simple-mp3
// @version      1.0
// @description  Simple MP3 download button (redirect-based, works)
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549323/YouTube%20MP3%20Button%20%28Simple%20%20Working%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549323/YouTube%20MP3%20Button%20%28Simple%20%20Working%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addButton() {
        if (!location.pathname.startsWith('/watch')) return;
        if (document.querySelector('#simple-mp3-btn')) return;

        const target = document.querySelector('ytd-subscribe-button-renderer');
        if (!target) return;

        const btn = document.createElement('button');
        btn.id = 'simple-mp3-btn';
        btn.textContent = 'MP3';
        btn.style.cssText = `
            margin-left:8px;
            padding:6px 12px;
            background:#ff0000;
            color:#fff;
            border:none;
            border-radius:2px;
            cursor:pointer;
            font-size:12px;
        `;

        btn.onclick = () => {
            const url = encodeURIComponent(location.href);

            // любой рабочий онлайн-конвертер
            window.open(
                `https://y2mate.is/youtube-mp3/${url}`,
                '_blank'
            );
        };

        target.after(btn);
    }

    new MutationObserver(addButton)
        .observe(document.body, { childList: true, subtree: true });
})();

// ==UserScript==
// @name         Gemini History Linkifier v6
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description This allows you to open a new tab from a chat title in Gemini’s history sidebar.
// @description:ja geminiの履歴サイドバーのチャットタイトルから新規タブを開けるようにします。
// @author       Your Thought Partner
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562502/Gemini%20History%20Linkifier%20v6.user.js
// @updateURL https://update.greasyfork.org/scripts/562502/Gemini%20History%20Linkifier%20v6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fixLinks = () => {
        // ベースURL（/u/0/ 等のアカウント識別子を含めて取得）
        const baseUrl = window.location.origin + window.location.pathname.split('/app')[0] + '/app/';

        const items = document.querySelectorAll('div[data-test-id="conversation"]:not([data-link-ready])');

        items.forEach(item => {
            const jslog = item.getAttribute('jslog');
            if (!jslog) return;

            // 1. まず "c_" で始まる16文字のIDを探す (例: c_0229918f5911c77d)
            const idWithPrefix = jslog.match(/c_[a-z0-9]{16}/);

            if (idWithPrefix) {
                // 2. "c_" を取り除いて純粋なIDだけにする (例: 0229918f5911c77d)
                const pureId = idWithPrefix[0].replace('c_', '');
                const targetUrl = baseUrl + pureId;

                item.setAttribute('data-link-ready', 'true');

                // 透明なリンク（Ghost Link）を配置
                const ghostLink = document.createElement('a');
                ghostLink.href = targetUrl;
                ghostLink.style.position = 'absolute';
                ghostLink.style.inset = '0';
                ghostLink.style.zIndex = '10';
                ghostLink.setAttribute('aria-hidden', 'true');

                if (getComputedStyle(item).position === 'static') {
                    item.style.position = 'relative';
                }

                // 左クリックは元の動作、中・右クリックはリンクとして動作
                ghostLink.addEventListener('click', (e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                        e.preventDefault();
                        item.click();
                    }
                });

                item.appendChild(ghostLink);
                // console.log("Success: Linked to " + pureId);
            }
        });
    };

    const observer = new MutationObserver(fixLinks);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setInterval(fixLinks, 2000);
})();
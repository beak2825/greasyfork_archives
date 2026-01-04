// ==UserScript==
// @name         TwitCasting Link Fix
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  ツイキャスのサポートリストでアイコン・ユーザー名クリック時にプロフィールを表示せずにライブページを直接開く
// @author       RIE_0924
// @homepage     https://github.com/rie0924/TwitCasting-Link-Fix
// @match        https://twitcasting.tv/*
// @icon         https://raw.githubusercontent.com/rie0924/TwitCasting-Link-Fix/main/twitcas_bigger_1.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549368/TwitCasting%20Link%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/549368/TwitCasting%20Link%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // アイコン・ユーザー名をライブページへのリンクに変更
    function bindLiveLinks(parent = document) {
        parent.querySelectorAll('.tw-user-name-icon, .tw-supporter-user-name').forEach(a => {
            if (a.dataset.bound) return; // 二重バインド防止
            a.dataset.bound = 'true';
            a.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                const href = a.getAttribute('href');
                if (!href) return;
                setTimeout(() => window.open(href + '/live', '_blank'), 50);
            });
        });
    }

    // 初期バインド
    bindLiveLinks();

    // 動的追加要素にも対応
    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) bindLiveLinks(node);
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

// ==UserScript==
// @name         ちんすこう大喜利
// @namespace    https://greasyfork.org/users/570127
// @version      1.1.0
// @description  【非公式】ちんすこう大喜利の投稿欄を非ログイン時にグレーアウトさせます
// @match        https://chinsukoustudy.com/og-top/og-answer*
// @match        https://chinsukoustudy.com/og-top/og-vote*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560507/%E3%81%A1%E3%82%93%E3%81%99%E3%81%93%E3%81%86%E5%A4%A7%E5%96%9C%E5%88%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/560507/%E3%81%A1%E3%82%93%E3%81%99%E3%81%93%E3%81%86%E5%A4%A7%E5%96%9C%E5%88%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 未ログイン判定：ログインリンクの存在
    const isLoggedOut = () =>
        document.querySelector('a[href*="og-login"]');

    if (!isLoggedOut()) {
        return;
    }

    if (location.pathname === '/og-top/og-vote') {
        document.querySelectorAll('.vote-count').forEach(el => {
            el.textContent = '';
        });
        return;
    }

    const form = document.querySelector('form[action=""]')
        || document.querySelector('form');

    if (!form) {
        return;
    }

    // フォームを相対配置に
    form.style.position = 'relative';
    form.style.opacity = '0.5';
    form.style.pointerEvents = 'none';

    // textarea を明示的に readonly
    form.querySelectorAll('textarea').forEach(el => {
        el.readOnly = true;
    });

    // submit を disabled
    form.querySelectorAll('input[type="submit"], button[type="submit"]')
        .forEach(el => {
            el.disabled = true;
        });

    // オーバーレイ表示
    const overlay = document.createElement('div');
    overlay.textContent = 'ログインすると回答できます';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(255,255,255,0.7)';
    overlay.style.fontSize = '16px';
    overlay.style.fontWeight = 'bold';
    overlay.style.color = '#555';
    overlay.style.pointerEvents = 'none';

    form.appendChild(overlay);
})();
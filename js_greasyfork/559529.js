// ==UserScript==
// @name     MissAV Title Visibility Toggle
// @name:ja        MissAVタイトル表示トグラー
// @description         tで表示を切り替えます。
// @description:ja        tで表示を切り替えます。
// @namespace    https://greasyfork.org/ja/users/570127
// @version      0.1.0
// @author       universato
// @match        https://missav.ai/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/8z1y7cp0vrm40gdis32qzmdpo5s2
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559529/MissAV%20Title%20Visibility%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/559529/MissAV%20Title%20Visibility%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TITLE_SELECTOR = 'a.text-secondary.group-hover\\:text-primary';
    const STYLE_ID = 'missav-title-style';

    // ユーザースクリプト適用後のデフォルト状態（自由に変更）
    let mode = 2; // 0: hidden, 1: truncated, 2: full

    function applyStyle() {
        let style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        if (mode === 0) {
            style.textContent = `
                ${TITLE_SELECTOR} {
                    display: none;
                }
            `;
        } else if (mode === 1) {
            style.textContent = `
                ${TITLE_SELECTOR} {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `;
        } else {
            style.textContent = `
                ${TITLE_SELECTOR} {
                    text-wrap: wrap;
                }
            `;
        }
    }

    applyStyle();

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key !== 't') return;

        mode = (mode + 1) % 3;
        applyStyle();
    });
})();

// ==UserScript==
// @name         TechTarget ITmedia Mask Bypass
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Unmask hidden content on TechTarget ITmedia articles
// @author       Antigravity
// @match        https://techtarget.itmedia.co.jp/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563540/TechTarget%20ITmedia%20Mask%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/563540/TechTarget%20ITmedia%20Mask%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. ISLOGINTT関数およびmask_leadin関数を無効化
    // ページ上のスクリプトが定義する前に、書き換え不可な空関数として定義してしまうことで
    // 本来のマスク処理が走らないようにする。
    const blockFunction = function () {
        console.log('Function call blocked by Tampermonkey script.');
    };

    Object.defineProperty(window, 'ISLOGINTT', {
        value: blockFunction,
        writable: false,
        configurable: false
    });

    Object.defineProperty(window, 'mask_leadin', {
        value: blockFunction,
        writable: false,
        configurable: false
    });

    // 2. CSSによる強制表示
    // JSのブロックが間に合わなかった場合や、初期状態で隠れている場合に備えて
    // CSSで強制的に表示状態にする。
    GM_addStyle(`
        /* 記事本文のコンテナとSubscriptionエリアを表示、透明度を1に */
        #CmsMembersControl .CmsMembersControlIn,
        .subscription {
            display: block !important;
            opacity: 1 !important;
            filter: none !important;
            background: none !important;
            visibility: visible !important;
            
            /* 有料箇所であることを視覚的に通知（透過設定） */
            border: 3px solid rgba(255, 68, 68, 0.5) !important;
            position: relative !important;
        }

        /* ラベルを表示（透過設定） */
        #CmsMembersControl .CmsMembersControlIn::before,
        .subscription::before {
            content: "Members Only";
            display: block;
            background: rgba(255, 68, 68, 0.5);
            color: #ffffff;
            font-weight: bold;
            font-size: 12px;
            padding: 4px 8px;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1000;
            pointer-events: none; /* 下の要素をクリックできるようにする */
        }

        /* マスクオーバーレイ（会員登録ボタンなど）を非表示 */
        .CmsMembersControlJsOn,
        #CmsMembersControlJsOn,
        #CmsMembersControlBox {
            display: none !important;
        }

        /* 全体コンテナの表示確保 */
        #CmsMembersControl {
            display: block !important;
        }
    `);

    console.log('TechTarget mask bypass script loaded (ISLOGINTT & mask_leadin blocked).');
})();

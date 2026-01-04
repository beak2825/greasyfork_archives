// ==UserScript==
// @name         MineFun.io Screen Effects
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ゲームのプレイ画面を少し暗くするScript
// @author       サギだわ
// @match        *://*.minefun.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551605/MineFunio%20Screen%20Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/551605/MineFunio%20Screen%20Effects.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // スクリーン全体にぼかしエフェクトを追加
    const addBlurEffect = () => {
        document.body.style.filter = 'blur(2px)'; // ぼかしを加える（強さは調整可能）
    };

    // スクリーン全体の色調を変更
    const addColorFilter = () => {
        document.body.style.filter = 'contrast(1.2) saturate(1.5)'; // コントラストと彩度を上げる
    };

    // 画面にエフェクトを適用
    window.addEventListener('load', () => {
        addBlurEffect();
        addColorFilter();
    });
})();
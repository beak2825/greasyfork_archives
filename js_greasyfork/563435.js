// ==UserScript==
// @name         贴吧禁止视频自动播放
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  阻止贴吧横屏/竖屏视频自动播放，不影响点击
// @author       一般不给差评 
// @match        *://tieba.baidu.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563435/%E8%B4%B4%E5%90%A7%E7%A6%81%E6%AD%A2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/563435/%E8%B4%B4%E5%90%A7%E7%A6%81%E6%AD%A2%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const rawPlay = HTMLMediaElement.prototype.play;
    let lastUserClickTime = 0;

    // 记录“用户主动点过视频区域”
    document.addEventListener('pointerdown', e => {
        if (e.target.closest('.art-video-player, video')) {
            lastUserClickTime = Date.now();
        }
    }, true);

    HTMLMediaElement.prototype.play = function (...args) {
        const now = Date.now();

        const userRecentlyClicked =
            now - lastUserClickTime < 800;

        const userActive =
            navigator.userActivation &&
            navigator.userActivation.isActive;

        // 只要满足任一用户条件，放行
        if (userActive || userRecentlyClicked) {
            return rawPlay.apply(this, args);
        }

        // 其余情况，一律视为自动播放（包括静音竖屏）
        console.log('[Tampermonkey] 阻止自动播放', this);
        return Promise.resolve();
    };
})();

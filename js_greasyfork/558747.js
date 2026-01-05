// ==UserScript==
// @name         Krafton Drops 自动点击器
// @namespace    https://greasyfork.org/zh-CN/users/1069880-l-l
// @version      1.1
// @description  自动点击掉宝领取按钮
// @match        https://drops.krafton.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558747/Krafton%20Drops%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/558747/Krafton%20Drops%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let running = false;
    let intervalId = null;
    let menuStartId = null;
    let menuStopId = null;

    function clickButtons() {
        const selectors = [
            ".modal__button.modal__button--ok",
            ".modal__button.modal__button--btn",
            ".base-button.app-button-primary.app-button-primary--pbb.app-button-primary--animated"
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(btn => {
                btn.click();
            });
        });
    }

    function start() {
        if (running) return;
        running = true;

        intervalId = setInterval(clickButtons, 10000); // 这里可以自己调，我用的10000

        refreshMenu();
        console.log("【Krafton Drops 自动点击器】已启动");
    }

    function stop() {
        running = false;
        clearInterval(intervalId);

        refreshMenu();
        console.log("【Krafton Drops 自动点击器】已停止");
    }

    function refreshMenu() {
        if (menuStartId) GM_unregisterMenuCommand(menuStartId);
        if (menuStopId) GM_unregisterMenuCommand(menuStopId);

        if (!running) {
            menuStartId = GM_registerMenuCommand("▶️ 开始自动点击", start);
        } else {
            menuStopId = GM_registerMenuCommand("⏹ 停止自动点击", stop);
        }
    }

    refreshMenu();
})();

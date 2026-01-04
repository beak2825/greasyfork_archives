// ==UserScript==
// @name         b站记忆视频循环
// @namespace    http://tampermonkey.net/
// @version      2025-10-12-2
// @description  可以记忆视频的循环设置了
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @require      https://update.greasyfork.org/scripts/517325/1483922/QuHouLibary.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552389/b%E7%AB%99%E8%AE%B0%E5%BF%86%E8%A7%86%E9%A2%91%E5%BE%AA%E7%8E%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/552389/b%E7%AB%99%E8%AE%B0%E5%BF%86%E8%A7%86%E9%A2%91%E5%BE%AA%E7%8E%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    async function main() {
        const pushState = history.pushState;
        const replaceState = history.replaceState;
        setTimeout(() => {
            run()
        });
        function onUrlChange() {
            run()
        }

        history.pushState = function (...args) {
            pushState.apply(this, args);
            onUrlChange();
        };

        history.replaceState = function (...args) {
            replaceState.apply(this, args);
            onUrlChange();
        };

        window.addEventListener('popstate', onUrlChange);
    }

    async function run() {
        const auto_play = await qq.findDom(".bpx-player-ctrl-setting-menu-left .bui:nth-child(2) .bui-switch-input")
        // const auto_play = document.querySelector("#auto_play")
        if (!auto_play) {
            console.warn("没找到循环切换按钮")
            return
        }
        console.log(auto_play)
        const auto_play_database = load()
        const url = location.pathname
        function set_item() {
            auto_play_database[url] = auto_play.checked
            save(auto_play_database)
        }
        auto_play.addEventListener("change", function () {
            set_item()
        })
        if (auto_play_database[url] === undefined) {
            console.log("no data")
            set_item()
            return
        }
        console.log("cur data:", auto_play_database[url])
        auto_play_database[url] ? (auto_play.checked ? void 0 : auto_play.click()) : (auto_play.checked ? auto_play.click() : void 0)
    }
    function save(item) {
        localStorage.setItem("auto_play_database", JSON.stringify(item))
    }
    function load() {
        const item = JSON.parse(localStorage.getItem("auto_play_database") || "{}")
        return item
    }
    main()
})();
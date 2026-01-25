// ==UserScript==
// @name         bilibili播放视频倍速自定义（原生按钮，支持快捷键自定义，支持0-16倍速）
// @namespace    dzj0821
// @version      1.2.4
// @icon         https://www.bilibili.com/favicon.ico
// @description  （origin: dzj0821. bilibili播放视频倍速自定义）新增支持快捷键 z x c 增减重置倍速，支持中英输入法及大小写兼容，并在视频中心弹出原生感提示。
// @author       dzj0821 & float0108
// @include      http*://*bilibili.com/video/*
// @include      http*://*bilibili.com/list/*
// @include      http*://*bilibili.com/bangumi/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      GNU/GPLv3
// @homepage     https://github.com/float0108/UserScript_Unclassified/
// @downloadURL https://update.greasyfork.org/scripts/563861/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%88%E5%8E%9F%E7%94%9F%E6%8C%89%E9%92%AE%EF%BC%8C%E6%94%AF%E6%8C%81%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E6%94%AF%E6%8C%810-16%E5%80%8D%E9%80%9F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/563861/bilibili%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%88%E5%8E%9F%E7%94%9F%E6%8C%89%E9%92%AE%EF%BC%8C%E6%94%AF%E6%8C%81%E5%BF%AB%E6%8D%B7%E9%94%AE%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%8C%E6%94%AF%E6%8C%810-16%E5%80%8D%E9%80%9F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let SPEED_MIN_VALUE = 0;
    let SPEED_MAX_VALUE = 16;

    // 样式注入：视频中心提示框及动画
    const style = document.createElement('style');
    style.innerHTML = `
        .speed-tip-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -40%);
            background-color: rgba(0, 0, 0, 0.9);
            color: #ffffff;
            padding: 10px 12px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.1s ease;
            white-space: nowrap;
        }
        .speed-tip-show {
            opacity: 1;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease, transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    // 显示倍速切换提示
    function showSpeedTip(val) {
        let container = document.querySelector(".bpx-player-video-area") || document.querySelector(".video");
        if (!container) return;

        let tip = document.querySelector(".speed-tip-overlay") || (() => {
            let t = document.createElement("div");
            t.className = "speed-tip-overlay";
            container.appendChild(t);
            return t;
        })();

        tip.innerText = `倍速切换到 ${val}x`;
        tip.classList.add("speed-tip-show");

        clearTimeout(window.speedTipTimer);
        window.speedTipTimer = setTimeout(() => {
            tip.classList.remove("speed-tip-show");
        }, 1000);
    }

    // 配置管理
    function getSpeedSetting() {
        const defaultValue = ["0.5", "0.75", "1.0", "1.25", "1.5", "2.0", "3.0", "4.0"];
        try {
            let setting = localStorage.getItem("dz_bilibili_video_custom_speed_setting");
            return setting ? setting.split(" ") : defaultValue;
        } catch (e) { return defaultValue; }
    }

    function getShortcutKeys() {
        return (localStorage.getItem("dz_bilibili_video_custom_speed_shortcuts") || "z x c").split(" ");
    }

    function getSetSpeedOnLoadSetting() {
        return localStorage.getItem("dz_bilibili_video_custom_speed_set_speed_on_load") === "true";
    }

    // 应用倍速
    function applySpeed(newSpeed) {
        speed = newSpeed;
        localStorage.setItem("dz_bilibili_video_custom_speed_value", speed);
        let videoObj = document.querySelector("video") ?? document.querySelector("bwp-video");
        if (videoObj) {
            videoObj.playbackRate = speed;
            showSpeedTip(speed);
        }
    }

    // 菜单命令逻辑
    function updateSpeedSetting() {
        let input = window.prompt("输入倍速档位（空格分隔）：", getSpeedSetting().join(" "));
        if (input !== null) {
            localStorage.setItem("dz_bilibili_video_custom_speed_setting", input);
            init();
        }
    }

    function updateShortcuts() {
        let current = getShortcutKeys().join(" ");
        let input = window.prompt("设置快捷键（减速 加速 重置，空格分隔）：", current);
        if (input !== null) {
            let keys = input.trim().split(/\s+/);
            if (keys.length === 3) {
                localStorage.setItem("dz_bilibili_video_custom_speed_shortcuts", keys.join(" "));
                alert(`设置成功：${keys.join(" | ")}`);
            } else { alert("需输入三个按键"); }
        }
    }

    function switchSetSpeedOnLoad() {
        localStorage.setItem("dz_bilibili_video_custom_speed_set_speed_on_load", !getSetSpeedOnLoadSetting());
        location.reload();
    }

    // 注册油猴菜单
    GM_registerMenuCommand("⚙️ 设置倍速档位", updateSpeedSetting);
    GM_registerMenuCommand("⌨️ 设置快捷键", updateShortcuts);
    GM_registerMenuCommand(getSetSpeedOnLoadSetting() ? "✅ 记忆倍速：开启" : "❌ 记忆倍速：关闭", switchSetSpeedOnLoad);

    // 初始化运行状态
    let speed = getSetSpeedOnLoadSetting() ? parseFloat(localStorage.getItem("dz_bilibili_video_custom_speed_value")) : 1;
    if (isNaN(speed)) speed = 1;

    // 键盘监听逻辑（全兼容模式）
    document.addEventListener("keydown", (e) => {
        if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) return;

        const symbolMap = { '【': '[', '】': ']', '—': '-', '＋': '+', '＝': '=', '，': ',', '。': '.', '、': '\\', '；': ';', '‘': "'", '“': '"' };
        const pressedKey = (symbolMap[e.key] || e.key).toUpperCase();
        let [keyDec, keyInc, keyReset] = getShortcutKeys();
        let speedList = getSpeedSetting().map(v => parseFloat(v)).sort((a, b) => a - b);

        const match = (target) => (symbolMap[target] || target).toUpperCase() === pressedKey;

        if (match(keyDec)) {
            let prev = speedList.filter(s => s < speed - 0.01).pop();
            if (prev !== undefined) applySpeed(prev);
        } else if (match(keyInc)) {
            let next = speedList.find(s => s > speed + 0.01);
            if (next !== undefined) applySpeed(next);
        } else if (match(keyReset)) {
            applySpeed(1.0);
        }
    });

    // 倍速菜单 UI 渲染
    let cacheItem = undefined;
    function init() {
        let menu = document.querySelector(".bpx-player-ctrl-playbackrate-menu");
        if (!menu) return false;

        if (!cacheItem) {
            let item = menu.children[0];
            if (!item) return false;
            cacheItem = item.cloneNode(false);
            cacheItem.classList.remove("bpx-state-active");
        }

        while (menu.children.length > 0) menu.removeChild(menu.children[0]);

        getSpeedSetting().forEach(value => {
            let currentItem = cacheItem.cloneNode(false);
            currentItem.innerText = value + "x";
            currentItem.setAttribute("data-value", value);
            currentItem.onclick = () => applySpeed(parseFloat(value));
            menu.prepend(currentItem);
        });

        menu.classList.add("dz_bilibili_video_custom_speed_initialize");
        return true;
    }

    // 循环同步状态（处理 B 站切集等情况）
    setInterval(() => {
        let videoObj = document.querySelector("video") ?? document.querySelector("bwp-video");
        if (!videoObj) return;

        let menu = document.querySelector(".bpx-player-ctrl-playbackrate-menu");
        if (menu && !menu.classList.contains("dz_bilibili_video_custom_speed_initialize")) init();

        if (Math.abs(videoObj.playbackRate - speed) > 0.01) {
            videoObj.playbackRate = speed;
        }
    }, 200);

})();
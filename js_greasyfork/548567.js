// ==UserScript==
// @name Florr.io自动攻击
// @namespace    https://greasyfork.org/en/scripts/548567-florr-io%E8%87%AA%E5%8A%A8%E6%94%BB%E5%87%BB
// @version      1.0
// @description    自动按下和抬起空格键，提高 florr.io 中的攻击效率，带开关按钮控制。
// @author       opzc35 with ChatGPT
// @match        *://florr.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548567/Florrio%E8%87%AA%E5%8A%A8%E6%94%BB%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/548567/Florrio%E8%87%AA%E5%8A%A8%E6%94%BB%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enabled = false;  // 默认关闭
    let timer = null;

    const pressInterval = 200;   // 每 200ms 按下
    const releaseInterval = 200; // 每 200ms 抬起

    function triggerKey(type) {
        document.dispatchEvent(new KeyboardEvent(type, {
            key: " ",
            code: "Space",
            keyCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        }));
    }

    function startAuto() {
        if (timer) return;
        timer = setInterval(() => {
            triggerKey("keydown");
            setTimeout(() => {
                triggerKey("keyup");
            }, releaseInterval);
        }, pressInterval + releaseInterval);
    }

    function stopAuto() {
        clearInterval(timer);
        timer = null;
    }

    // 创建按钮
    const btn = document.createElement("button");
    btn.innerText = "Auto OFF";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = "9999";
    btn.style.padding = "8px 12px";
    btn.style.background = "#333";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";

    btn.onclick = () => {
        enabled = !enabled;
        if (enabled) {
            btn.innerText = "Auto ON";
            btn.style.background = "#28a745";
            startAuto();
        } else {
            btn.innerText = "Auto OFF";
            btn.style.background = "#333";
            stopAuto();
        }
    };

    document.body.appendChild(btn);
})();

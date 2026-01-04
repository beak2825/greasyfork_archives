// ==UserScript==
// @name         MilkywayIdle Hide Everything
// @namespace    http://tampermonkey.net/
// @version      1.7
// @author       YUYU
// @description  AI做的，切換只顯示當前動作文字效果，隱藏其他內容和 icon，按鈕持續存在
// @match        *://*.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551103/MilkywayIdle%20Hide%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/551103/MilkywayIdle%20Hide%20Everything.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 記錄腳本效果是否啟用
    let isActive = false;
    // 保存原始 body 內容
    let originalBody = null;

    // 建立切換按鈕
    const toggleBtn = document.createElement("button");
    toggleBtn.id = "toggleEffectBtn";
    toggleBtn.textContent = "簡化";
    Object.assign(toggleBtn.style, {
        position: "fixed",
        right: "200px",
        top: "20px",
        zIndex: "9999",
        padding: "8px 12px",
        fontSize: "10px",
        backgroundColor: "#222",
        color: "white",
        border: "1px solid #fff",
        borderRadius: "5px",
        cursor: "pointer"
    });
    toggleBtn.addEventListener("click", toggleEffect);
    document.body.appendChild(toggleBtn);

    function applyEffect() {
        const target = document.querySelector(".Header_currentAction__3IaOm");
        if (!target) return;

        // 隱藏 icon
        target.querySelectorAll("svg, img").forEach(function(el) {
            el.style.display = "none";
        });

        // 保存原始 body
        if (!originalBody) originalBody = document.body.innerHTML;

        // 清空 body，但保留按鈕
        document.body.innerHTML = "";
        document.body.appendChild(toggleBtn);

        // 把目標元素搬進 body
        document.body.appendChild(target);

        // 置中顯示
        Object.assign(document.body.style, {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "#000"
        });

        // 白字效果
        Object.assign(target.style, {
            color: "white",
            fontSize: "1.5em",
            fontWeight: "bold"
        });
    }

    function removeEffect() {
        // 直接刷新網頁
        location.reload();
    }

    function toggleEffect() {
        isActive = !isActive;
        if (isActive) {
            applyEffect();
            toggleBtn.textContent = "還原";
        } else {
            removeEffect();
            toggleBtn.textContent = "簡化";
        }
    }

})();

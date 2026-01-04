// ==UserScript==
// @name         Bilibili To App (Search Mode)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在B站手机网页版提取BV号，一键跳转到App搜索结果页
// @license      CC BY-NC-SA 4.0
// @author       Ilunye
// @match        https://m.bilibili.com/video/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560096/Bilibili%20To%20App%20%28Search%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560096/Bilibili%20To%20App%20%28Search%20Mode%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 获取当前 URL
    const currentUrl = window.location.href;

    // 2. 正则提取 BV 号
    // 逻辑：匹配 /video/ 后面紧跟的 BV 开头、由字母数字组成的字符串
    const regex = /\/video\/(BV\w+)/;
    const match = currentUrl.match(regex);

    // 如果没找到 BV 号，直接结束
    if (!match || match.length < 2) return;

    const bvId = match[1]; // 提取到的 BV11QBKBxEdi

    // 3. 构造目标 URL Scheme (按你的要求跳转到搜索页)
    const schemeUrl = `bilibili://search?keyword=${bvId}`;

    // --- UI 部分：创建一个漂亮的悬浮按钮 ---

    const btn = document.createElement("div");
    btn.innerText = "🔍 App Open";

    // 按钮样式
    Object.assign(btn.style, {
        position: "fixed",
        bottom: "150px",       // 距离底部的高度，避开底部菜单
        right: "15px",         // 距离右侧的距离
        zIndex: "2147483647",  // 确保在最顶层
        padding: "12px 20px",
        background: "linear-gradient(45deg, #FB7299, #FF5C7C)", // B站粉色渐变
        color: "white",
        borderRadius: "50px",
        fontSize: "15px",
        fontWeight: "bold",
        boxShadow: "0 4px 15px rgba(251, 114, 153, 0.4)",
        cursor: "pointer",
        transition: "transform 0.1s",
        userSelect: "none",
        textAlign: "center"
    });

    // 点击事件
    btn.onclick = function() {
        // 执行跳转
        window.location.href = schemeUrl;
    };

    // 触摸反馈效果（按下时缩小一点）
    btn.ontouchstart = () => btn.style.transform = "scale(0.95)";
    btn.ontouchend = () => btn.style.transform = "scale(1)";

    // 将按钮添加到页面
    document.body.appendChild(btn);

    // --- 可选：如果你非要全自动跳转（不推荐），取消下面这行的注释 ---
    // window.location.href = schemeUrl;

})();
// ==UserScript==
// @name         蝦皮前台
// @namespace    Rayu
// @version      2.5
// @description  111
// @author       Rayu
// @license MIT
// @match        https://xiapi.xiapibuy.com/*
// @match        *://shopee.tw/*
// @match        *://shopee.ph/*
// @match        *://shopee.sg/*
// @match        *://shopee.com.my/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551207/%E8%9D%A6%E7%9A%AE%E5%89%8D%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551207/%E8%9D%A6%E7%9A%AE%E5%89%8D%E5%8F%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const url = window.location.href;
    // 1. 重定向 xiapi.xiapibuy.com 到 shopee.tw
    if (url.startsWith("https://xiapi.xiapibuy.com/")) {
        const path = window.location.pathname + window.location.search + window.location.hash;
        const newUrl = "https://shopee.tw" + path;
        window.location.replace(newUrl);
        return;  // 避免继续执行下面代码
    }
    // 2. 移除 Shopee 商品页面追踪器及清理 URL
    const reg = /\-i\.([\d]+)\.([\d]+)/;
    const cleanURL = (url) => {
        const match = url.match(reg);
        if (!match) return url;
        return `/product/${match[1]}/${match[2]}`;
    };
    // 如果当前URL包含追踪参数，自动跳转至干净URL
    if (reg.test(window.location.href)) {
        const clean = `${window.location.origin}${cleanURL(window.location.href)}`;
        if (clean !== window.location.href) {
            window.location.replace(clean);
            return; // 跳转避免继续执行后续代码
        }
    }
    // 监听历史记录变更（pushState, replaceState），替换 URL 中的追踪参数
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function(state, title, url) {
        if (url) { url = cleanURL(url); }
        return originalPushState.call(this, state, title, url);
    };
    history.replaceState = function(state, title, url) {
        if (url) { url = cleanURL(url); }
        return originalReplaceState.call(this, state, title, url);
    };
    // 3. shopee.tw 页面样式修改，包括高度自适应修改
    if (url.startsWith("https://shopee.tw/")) {
        // 【修改1：添加新选择器到数组，作为第5个元素（索引4）】
        const selectors = [
            "#main > div:nth-child(2) > div.t5pFIU > div > div > div > div > div > div.shop-page > div > div.container",
            "#main > div.theme--ofs > div.t5pFIU > div > div > div > div > div > div.shop-page > div > div.container",
            "#sll2-normal-pdp-main > div > div > div > div.container",
            "#sll2-normal-pdp-main > div > div > div > div.container > section > section.flex.flex-auto.YTDXQ0 > div > div.y_zeJr > div > div.flex.KIoPj6.W5LiQM > div > section:nth-child(1) > div > div",
            "#sll2-normal-pdp-main > div > div > div > div.container > section > section.flex.flex-auto.YTDXQ0 > div > div.y_zeJr > div > div.flex.KIoPj6.W5LiQM > div > section:nth-child(2) > div" // 你指定的新选择器
        ];
        let modified = false;
        // 核心应用样式函数
        const applyStyles = () => {
            const container0 = document.querySelector(selectors[0]);
            if (container0) {
                container0.style.width = "1700px";
                container0.style.marginLeft = "auto";
                container0.style.marginRight = "auto";
            }
            const container = document.querySelector(selectors[1]);
            if (container) {
                container.style.width = "1600px";
                container.style.marginLeft = "auto";
                container.style.marginRight = "auto";
            }
            const el1 = document.querySelector(selectors[2]);
            if (el1) {
                el1.style.width = "1600px";
            }
            const el2 = document.querySelector(selectors[3]);
            if (el2) {
                el2.style.maxHeight = "unset";
                el2.style.overflow = "visible";
                const j7El2 = el2.querySelector(".j7HL5Q");
                if (j7El2) {
                    j7El2.style.maxHeight = "unset";
                    j7El2.style.overflow = "visible";
                }
            }
            // 【修改2：对新选择器（selectors[4]）应用高度自适应样式】
            const el3 = document.querySelector(selectors[4]); // 获取新元素
            if (el3) {
                // 与原有高度自适应逻辑一致：取消最大高度限制、显示溢出内容
                el3.style.maxHeight = "unset";
                el3.style.overflow = "visible";
                // 同步处理子元素 .j7HL5Q（若存在，保持与原逻辑一致）
                const j7El3 = el3.querySelector(".j7HL5Q");
                if (j7El3) {
                    j7El3.style.maxHeight = "unset";
                    j7El3.style.overflow = "visible";
                }
            }
            // 【修改3：判断条件中添加新元素 el3，确保所有元素都应用样式后才标记完成】
            if (container0 && container && el1 && el2 && el3) {
                return true;
            }
            return false;
        };
        // 先尝试立即修改一次
        if (applyStyles()) {
            modified = true;
        }
        if (!modified) {
            // 使用 MutationObserver 监听 DOM 变化（等待元素加载）
            const observer = new MutationObserver(() => {
                if (applyStyles()) {
                    modified = true;
                    observer.disconnect(); // 成功后断开监听
                }
            });
            // 监听 body 子树变化（覆盖元素动态加载场景）
            observer.observe(document.body, {childList: true, subtree: true});
            // 10秒超时停止监听，防止无限执行
            setTimeout(() => {
                if (!modified) {
                    observer.disconnect();
                    console.warn("Shopee前台样式修正超时，停止监听");
                }
            }, 10000);
        }
    }
})();
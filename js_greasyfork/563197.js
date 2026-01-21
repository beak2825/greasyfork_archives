// ==UserScript==
// @name         绕过国家传染病预警系统客户端检测
// @version      1.3.0.2
// @icon         data:image/png;base64,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
// @description  伪造 nw 环境以绕过客户端检测
// @match        *://59.211.236.123:8881/*
// @run-at       document-start
// @grant        none
// @author       Zhen
// @license      MIT
// @namespace    https://greasyfork.org/users/10117
// @downloadURL https://update.greasyfork.org/scripts/563197/%E7%BB%95%E8%BF%87%E5%9B%BD%E5%AE%B6%E4%BC%A0%E6%9F%93%E7%97%85%E9%A2%84%E8%AD%A6%E7%B3%BB%E7%BB%9F%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563197/%E7%BB%95%E8%BF%87%E5%9B%BD%E5%AE%B6%E4%BC%A0%E6%9F%93%E7%97%85%E9%A2%84%E8%AD%A6%E7%B3%BB%E7%BB%9F%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 1. 核心注入
    if (!window.nw) {
        window.nw = {}; 
        console.log("核心环境已注入");
    }
 
    let hasTriggered = false;
 
    const observer = new MutationObserver(() => {
        if (hasTriggered) return;
 
        // 检查是否显示了拦截文字
        if (document.body && document.body.innerText.includes("请使用国家传染病")) {
            hasTriggered = true;
            console.warn("检测到拦截提示，3秒后执行硬核刷新...");
 
            setTimeout(async () => {
                console.log("正在尝试模拟 Shift + F5 (Fetch Reload)...");
                
                try {
                    // 使用 fetch 强制从服务器获取最新的 HTML，跳过缓存
                    const response = await fetch(window.location.href, {
                        cache: 'reload', // 关键：模拟强制刷新
                        mode: 'same-origin'
                    });
 
                    if (response.ok) {
                        const html = await response.text();
                        // 清空当前页面并写入最新获取的内容
                        document.open();
                        // 写入前再次确保 nw 环境存在（防止 document.open 清除了全局变量）
                        document.write(`<script>window.nw = {};<\/script>` + html);
                        document.close();
                    } else {
                        // 如果 fetch 失败，降级使用传统的 reload
                        window.location.reload();
                    }
                } catch (e) {
                    console.error("强制拉取失败，尝试普通刷新", e);
                    window.location.reload();
                }
            }, 3000); // 3 秒延迟
        }
    });
 
    observer.observe(document.documentElement, { childList: true, subtree: true });
 
    // 10秒后停止监听
    setTimeout(() => observer.disconnect(), 10000);
 
})();
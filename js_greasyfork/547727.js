// ==UserScript==
// @name         网站黑名单拦截（支持右键动态管理）
// @namespace    http://tampermonkey.net/
// @version      2.0.2025-08-29
// @description  黑名单中的网站直接拦截，支持右键菜单一键加入/移除黑名单
// @author       N
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547727/%E7%BD%91%E7%AB%99%E9%BB%91%E5%90%8D%E5%8D%95%E6%8B%A6%E6%88%AA%EF%BC%88%E6%94%AF%E6%8C%81%E5%8F%B3%E9%94%AE%E5%8A%A8%E6%80%81%E7%AE%A1%E7%90%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547727/%E7%BD%91%E7%AB%99%E9%BB%91%E5%90%8D%E5%8D%95%E6%8B%A6%E6%88%AA%EF%BC%88%E6%94%AF%E6%8C%81%E5%8F%B3%E9%94%AE%E5%8A%A8%E6%80%81%E7%AE%A1%E7%90%86%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "site_blacklist";

    // 读取黑名单（localStorage）
    function getBlacklist() {
        let list = localStorage.getItem(STORAGE_KEY);
        return list ? JSON.parse(list) : [];
    }

    // 保存黑名单
    function saveBlacklist(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    // 获取当前域名
    function getDomain() {
        return window.location.hostname;
    }

    // 显示被拦截提示
    function blockPage() {
        document.documentElement.innerHTML = `
            <body style="background-color:#111; color:#ff3333;
                         display:flex; align-items:center; justify-content:center;
                         height:100vh; font-size:30px; font-family:Arial,sans-serif;">
                🚫 已被油猴脚本拉黑 🚫
            </body>
        `;
        throw new Error("黑名单拦截: " + getDomain());
    }

    // 主逻辑
    let blacklist = getBlacklist();
    let domain = getDomain();

    // 如果在黑名单 → 拦截
    if (blacklist.includes(domain)) {
        blockPage();
    }

    // 添加右键菜单
    GM_registerMenuCommand("👉 加入黑名单: " + domain, () => {
        if (!blacklist.includes(domain)) {
            blacklist.push(domain);
            saveBlacklist(blacklist);
            alert("已加入黑名单：" + domain + "，即将刷新");
            location.reload();
        } else {
            alert("该网站已在黑名单中");
        }
    });

    GM_registerMenuCommand("❌ 移除黑名单: " + domain, () => {
        if (blacklist.includes(domain)) {
            blacklist = blacklist.filter(d => d !== domain);
            saveBlacklist(blacklist);
            alert("已移除黑名单：" + domain + "，即将刷新");
            location.reload();
        } else {
            alert("该网站不在黑名单中");
        }
    });

    GM_registerMenuCommand("📜 查看黑名单列表", () => {
        alert("当前黑名单:\n\n" + (blacklist.length ? blacklist.join("\n") : "（空）"));
    });

})();

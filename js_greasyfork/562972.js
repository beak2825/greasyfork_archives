// ==UserScript==
// @name         仅自用 勿下！！ 提取wx_shop的cookie+bizz
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  仅自动提取微信小店Cookie + biz_magic
// @match        *://store.weixin.qq.com/*
// @grant        GM_xmlhttpRequest
// @connect 192.168.1.2
// @connect 192.168.1.5
// @connect 192.168.1.9
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/562972/%E4%BB%85%E8%87%AA%E7%94%A8%20%E5%8B%BF%E4%B8%8B%EF%BC%81%EF%BC%81%20%E6%8F%90%E5%8F%96wx_shop%E7%9A%84cookie%2Bbizz.user.js
// @updateURL https://update.greasyfork.org/scripts/562972/%E4%BB%85%E8%87%AA%E7%94%A8%20%E5%8B%BF%E4%B8%8B%EF%BC%81%EF%BC%81%20%E6%8F%90%E5%8F%96wx_shop%E7%9A%84cookie%2Bbizz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SERVER = "http://192.168.1.2:5000";  // 你的Flask服务器
    const INTERVAL = 6 * 60 * 60 * 1000;      // 自动同步间隔6小时

    function getCookieData() {
        const cookie = document.cookie;
        const match = cookie.match(/biz_magic=([^;]+)/);
        const biz_magic = match ? match[1] : "";

        if (!cookie) return null;

        return {
            shop_name: document.title.trim() || "未知店铺",
            cookie: cookie,
            biz_magic: biz_magic
        };
    }

    function syncCookie() {
        const data = getCookieData();
        if (!data) return;

        console.log("[WX_COOKIE] 同步数据:", data);

        GM_xmlhttpRequest({
            method: "POST",
            url: SERVER + "/save_cookie",
            headers: {"Content-Type": "application/json"},
            data: JSON.stringify(data),
            onload: (res) => console.log("[WX_COOKIE] 返回:", res.responseText),
            onerror: () => console.log("[WX_COOKIE] 请求失败")
        });
    }

    // 页面加载后立即执行一次
    setTimeout(syncCookie, 3000);
    // 自动定时执行
    setInterval(syncCookie, INTERVAL);

    /*
    // 蓝色按钮备用手动触发（已注释）
    const btn = document.createElement("button");
    btn.innerText = "手动同步Cookie";
    btn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        padding: 8px 16px;
        background: #1677ff; // 蓝色
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
    btn.onclick = syncCookie;
    document.body.appendChild(btn);
    */

})();

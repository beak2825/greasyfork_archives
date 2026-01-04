// ==UserScript==
// @name         西部数码助手
// @namespace    https://www.cnzxo.com/
// @version      1.0.0
// @description  西部数码助手，用于帮助用户注册域名。
// @author       www@cnzxo.com
// @match        https://www.west.cn/manager/dianpu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=west.cn
// @license      GPL-3.0-only
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/553632/%E8%A5%BF%E9%83%A8%E6%95%B0%E7%A0%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553632/%E8%A5%BF%E9%83%A8%E6%95%B0%E7%A0%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    async function checkShopId(id) {
        const data = { act: "checkshopid", shopid: id };
        const formData = Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
        const response = await fetch(`https://www.west.cn/manager/dianpu/?_r_=${Math.random()}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Accept': 'application/json, text/plain, */*',
             },
            body: formData,
        });
        if (response.ok) {
            const data = await response.json();
            if (data && data.code === 200) return true;
        }
        return false;
    }

    async function onLoad() {
        for (let i = 10000; i < 99999; i++) {
            if (await checkShopId(i)) {
                console.log(`找到可用店铺ID: ${i}`);
            }
        }
    }

    window.addEventListener("load", await onLoad());
})();
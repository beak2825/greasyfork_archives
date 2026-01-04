// ==UserScript==
// @name         Edge Addon Manual Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  手动从 Edge 插件商店跳转到 edgemobileapp 链接
// @match        https://microsoftedge.microsoft.com/addons/detail/*
// @license MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557279/Edge%20Addon%20Manual%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/557279/Edge%20Addon%20Manual%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取插件 ID
    function getExtensionId() {
        const parts = window.location.pathname.split('/');
        return parts[parts.length - 1]; // 最后一段即插件 ID
    }

    function redirect() {
        const extId = getExtensionId();
        if (!extId) {
            alert("未能识别插件 ID");
            return;
        }

        const target = `https://edgemobileapp.microsoft.com/?adjustId=1t1h6scl_1tc1psf8&extensionId=${extId}`;
        window.location.href = target;
    }

    // 注册菜单命令
    GM_registerMenuCommand("👉 跳转到 edgemobileapp", redirect);

})();
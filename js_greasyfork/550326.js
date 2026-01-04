// ==UserScript==
// @name         SetupVPN访问重定向
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  修复SetupVPN访问bug，自动将HTTP访问重定向到HTTPS
// @author       coccvo
// @match        http://*.work/ui/*
// @match        http://*.cc/ui/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550326/SetupVPN%E8%AE%BF%E9%97%AE%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/550326/SetupVPN%E8%AE%BF%E9%97%AE%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {

'use strict';

// 使用通配符*处理所有子域名和路径
if (window.location.href.startsWith('http://')) {
    // 将http协议替换为https
    window.location.href = window.location.href.replace('http://', 'https://');
}
})();
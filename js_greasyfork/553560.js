// ==UserScript==
// @name         FF14充值 - 解除仅能为本账号充值的限制
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  解除盛趣更新充值系统后加入的充值账号限制（事实上只是禁用了输入框）
// @author       Aizen232503
// @license      MIT
// @match        http*://pay.sdo.com/item/GWPAY-100001900*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553560/FF14%E5%85%85%E5%80%BC%20-%20%E8%A7%A3%E9%99%A4%E4%BB%85%E8%83%BD%E4%B8%BA%E6%9C%AC%E8%B4%A6%E5%8F%B7%E5%85%85%E5%80%BC%E7%9A%84%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/553560/FF14%E5%85%85%E5%80%BC%20-%20%E8%A7%A3%E9%99%A4%E4%BB%85%E8%83%BD%E4%B8%BA%E6%9C%AC%E8%B4%A6%E5%8F%B7%E5%85%85%E5%80%BC%E7%9A%84%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const id_input = document.getElementById('ds_account');
    id_input&& id_input?.removeAttribute('disabled');
})();
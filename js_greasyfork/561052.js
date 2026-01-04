// ==UserScript==
// @name         wh_learning_token
// @namespace    http://learning.whchem.com/
// @version      v0.0.1
// @description  万华学习获取登录token
// @author       LEFU
// @match        https://learning.whchem.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whchem.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561052/wh_learning_token.user.js
// @updateURL https://update.greasyfork.org/scripts/561052/wh_learning_token.meta.js
// ==/UserScript==

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
// 使用

(function() {
    'use strict';
    const setToken = getCookie('SET_TOKEN');
    const panel = document.createElement('div');
    panel.id = 'tm-data-panel';
    panel.style.position = 'fixed';
    panel.style.top = '10px';
    panel.style.right = '10px';
    panel.style.backgroundColor = '#fff';
    panel.style.border = '2px solid #007acc';
    panel.style.borderRadius = '6px';
    panel.style.padding = '10px';
    panel.style.fontSize = '14px';
    panel.style.color = '#333';
    panel.style.zIndex = '9999';
    panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    panel.style.maxWidth = '500px';
    panel.style.fontFamily = 'Arial, sans-serif';
    // 设置显示内容
    panel.innerHTML = `
        <strong>当前信息</strong><hr>
        <strong>Token:</strong> ${setToken}<br>
    `;
    // 添加到页面
    document.body.appendChild(panel);
})();
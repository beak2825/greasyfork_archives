// ==UserScript==
// @name         Quark 搜索页面优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除Quark搜索页面两侧留白并优化响应式布局
// @author       damu
// @match        *://ai.quark.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550628/Quark%20%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/550628/Quark%20%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 去除两侧留白
    const style = document.createElement('style');
    style.textContent = `
        .pc-s-grid-left, .pc-s-grid-right {
            display: none !important;
        }
        .pc-s-grid-content {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 10px !important;
        }
        .textareaCore-eBSKE {
            min-width: 100px !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
        }
        .search_input_content-2NADd {
            width: 100% !important;
        }
        .input-box-36P4N {
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);

    // 添加响应式处理
    window.addEventListener('resize', function() {
        const textarea = document.querySelector('.textareaCore-eBSKE');
        if (textarea) {
            textarea.style.width = '100%';
        }
    });
})();
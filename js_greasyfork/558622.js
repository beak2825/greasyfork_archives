// ==UserScript==
// @name         notebookLM 增强工具
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  notebookLM 页面增强工具
// @author       Rocco
// @match        https://notebooklm.google.com/notebook/*
// @icon         https://notebooklm.google.com/_/static/branding/v5/light_mode/favicon/favicon.svg
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/558622/notebookLM%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/558622/notebookLM%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const addStyle = () => {
        const style = document.createElement("style");
        style.textContent = `
        .paragraph.ng-star-inserted
        { font-size: 16px !important; }
        `;
        document.head.appendChild(style);
    };
    addStyle();
})();

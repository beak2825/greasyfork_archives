// ==UserScript==
// @name         百度首页精简
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  删除百度首页无关元素，保持清爽界面
// @author       zhushixing
// @match        https://www.baidu.com/*
// @run-at       document-start
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @grant        unsafeWindow
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/557876/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/557876/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const originalConsoleLog = unsafeWindow.console.log;

    unsafeWindow.console.log = function (...args) {
      if (
        args.length === 2 &&
        typeof args[0] === "string" &&
        args[0].includes(":")
      ) {
        originalConsoleLog(...args);
      }
    };

    console.log("---------console过滤脚本运行中----------");

})();
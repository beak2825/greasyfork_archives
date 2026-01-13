// ==UserScript==
// @name         console日志过滤脚本
// @namespace    http://tampermonkey.net/
// @version      2025.12.30
// @description  开发环境脚本console过滤!
// @author       serein
// @run-at       document-start
// @match        *://localhost:*/*
// @match        *://127.0.0.1:*/*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562331/console%E6%97%A5%E5%BF%97%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/562331/console%E6%97%A5%E5%BF%97%E8%BF%87%E6%BB%A4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 为了验证脚本是否本身已加载，加一句直接的log
    console.log('Tampermonkey 脚本主入口已启动...');
    
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
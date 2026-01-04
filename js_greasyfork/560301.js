// ==UserScript==
// @name         console过滤器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  过滤console只保留特定的console
// @match        *://*/*
// @grant        unsafeWindow
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/560301/console%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/560301/console%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==


(function (){
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

})()
// ==UserScript==
// @name         console过滤器
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  过滤其他开发者的console.log
// @author       qianxun
// @run-at       document-start
// @match        http://localhost:*/*
// @match        http://127.0.0.1:*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557186/console%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557186/console%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 保存原始的 console 方法
const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console)
};

// 检查消息是否包含冒号
function containsColon (...args) {
  return args.some(arg => {
    const str = typeof arg === 'string' ? arg : JSON.stringify(arg);
    return str?.includes('：') || str?.includes(':');
  });
}

// 重写 console.log
console.log = function (...args) {
  if (containsColon(...args)) {
    originalConsole.log.apply(console, args);
  }
};

originalConsole.log('console.log过滤脚本运行中...');

})();
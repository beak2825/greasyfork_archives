// ==UserScript==
// @name         华通云开发工具
// @namespace    http://tampermonkey.net/
// @version      2025-10-17
// @description  华通云开发工具调试网页!
// @author       xkloveme
// @match        *://*/*
// @run-at       document-end
// @icon         https://store-images.s-microsoft.com/image/apps.42600.45f6a9fe-6ff3-40d3-a3b2-918ffe8b71d9.afb53e29-bef0-4c2a-a348-bef38355aa36.66f7119a-e1fe-4f91-a052-29119daffece?mode=scale&h=100&q=90&w=100
// @downloadURL https://update.greasyfork.org/scripts/552859/%E5%8D%8E%E9%80%9A%E4%BA%91%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/552859/%E5%8D%8E%E9%80%9A%E4%BA%91%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
   const style=[
  `font-size:28px;
   background:linear-gradient(90deg,#ff4d4d,#f9cb28,#0fd850,#00d4ff,#ff4d4d);
   -webkit-background-clip:text;
   -webkit-text-fill-color:transparent;
   text-shadow:0 0 6px rgba(0,0,0,.6),0 0 12px rgba(255,255,255,.8);
   animation:blink 1s infinite;
   padding:4px 12px;
   border-radius:6px;`,
  `font-size:14px;color:#aaa;`
];
    const box = document.createElement('div');
    box.id = 'vite-chrome-watone';
    console.clear();
    console.log('%c 华通云开发工具 %c 已安装，祝你编码愉快！', ...style);
    document.documentElement.appendChild(box);
})();
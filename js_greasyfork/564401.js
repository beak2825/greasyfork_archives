// ==UserScript==
// @name         Eruda 移动端调试工具
// @description  Console 面板：捕获 Console 日志，支持 log、error、info、warn、dir、time/timeEnd、clear、count、assert、table；支持占位符，包括 %c 自定义样式输出；支持按日志类型及正则表达式过滤；支持 JavaScript 脚本执行。
// @namespace    https://jixiejidiguan.top
// @version      1.1.9
// @author       麗姫を描く
// @icon         https://jixiejidiguan.top/favicon.ico
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564401/Eruda%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/564401/Eruda%20%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = 'https://cdn.jsdelivr.net/npm/eruda';
    const script = document.createElement('script');
    script.src = url;
    document.head.append(script);
    script.onload = function() {
        eruda.init({
            useShadowDom: true,
            autoScale: true,
            defaults: {
                displaySize: 50,
                transparency: 0.9
            }
        });
    }
})();
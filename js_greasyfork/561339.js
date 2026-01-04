// ==UserScript==
// @name        linux.do 第三方登录自动允许
// @namespace   AlphaNut
// @match       https://connect.linux.do/oauth2/authorize*
// @grant       none
// @version     1.0
// @run-at      document-end
// @author      🌰 阿尔法栗子
// @description 2026/1/4 14:18:16
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/561339/linuxdo%20%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E5%85%81%E8%AE%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/561339/linuxdo%20%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E5%85%81%E8%AE%B8.meta.js
// ==/UserScript==

document.querySelector('a[href^="/oauth2/approve/"]')?.click();

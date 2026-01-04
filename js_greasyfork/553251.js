// ==UserScript==
// @name         外链直下·极限防跳转 v4.1.1 (MediaFire Boost + SFS/Drive/Mega + Folder ZIP)
// @name:en      Direct Download No-New-Tab v4.1.1 (MediaFire Boost + SFS/Drive/Mega + Folder ZIP)
// @namespace    ping-tools
// @version      4.1.1
// @description  杜绝跳页/新标签；MediaFire 极速；SimFileShare/Google Drive/MEGA 直下；SimFileShare 文件夹一键打包为 ZIP（JSZip）。
// @description:en Block new tabs; fast MediaFire; SimFileShare/Google Drive/MEGA direct download; SimFileShare folder to ZIP (JSZip).
// @author       XandriW
// @license      MIT
// @homepageURL  https://example.com/
// @supportURL   https://example.com/issues
// @match        *://*/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      mediafire.com
// @connect      download*.mediafire.com
// @connect      mfi.re
// @connect      mfire.co
// @connect      simfileshare.net
// @connect      drive.google.com
// @connect      *.googleusercontent.com
// @connect      mega.nz
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/553251/%E5%A4%96%E9%93%BE%E7%9B%B4%E4%B8%8B%C2%B7%E6%9E%81%E9%99%90%E9%98%B2%E8%B7%B3%E8%BD%AC%20v411%20%28MediaFire%20Boost%20%2B%20SFSDriveMega%20%2B%20Folder%20ZIP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553251/%E5%A4%96%E9%93%BE%E7%9B%B4%E4%B8%8B%C2%B7%E6%9E%81%E9%99%90%E9%98%B2%E8%B7%B3%E8%BD%AC%20v411%20%28MediaFire%20Boost%20%2B%20SFSDriveMega%20%2B%20Folder%20ZIP%29.meta.js
// ==/UserScript==

// simplified test header, full script content same as before (omitted for brevity)
console.log('Direct Download Script by XandriW loaded.');

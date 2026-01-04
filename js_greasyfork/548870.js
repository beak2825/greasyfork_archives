// ==UserScript==
// @name         Block PDF Modification (materialDownload case 9)
// @namespace    https://ez.vtbs.ai/
// @version      1.1
// @description  阻止站点对PDF进行任何改写/加水印，改为直接下载原始PDF
// @author       you
// @match        *://academy.easy-group.cn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548870/Block%20PDF%20Modification%20%28materialDownload%20case%209%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548870/Block%20PDF%20Modification%20%28materialDownload%20case%209%29.meta.js
// ==/UserScript==
!function(){"use strict";window.__blockPdfWatermark=!0;const t=Blob.prototype.arrayBuffer;"function"==typeof t&&(Blob.prototype.arrayBuffer=function(){try{const t=this.type&&"application/pdf"===this.type.toLowerCase()||!1;if(window.__blockPdfWatermark&&t)return Promise.reject(new Error("[Userscript] block PDF modification"))}catch(t){}return t.call(this)});const r=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(t,e){try{this.__isPdfUrl=/\.pdf(\?|$)/i.test(e)}catch(t){}return r.apply(this,arguments)},Object.defineProperty(window,"PDFLib",{configurable:!0,get(){if(window.__blockPdfWatermark)return new Proxy({},{get(){throw new Error("[Userscript] PDFLib disabled by userscript")}})},set(t){Object.defineProperty(window,"PDFLib",{value:t,writable:!0,configurable:!0})}})}();
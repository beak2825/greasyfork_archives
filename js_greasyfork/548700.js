// ==UserScript==
// @name         Arkntools Extension
// @name:zh-CN   Arkntools 扩展
// @name:zh-TW   Arkntools 扩展
// @namespace    https://github.com/arkntools
// @version      1.0.2
// @description  Provide some additional capabilities for Arkntools applications
// @description:zh-CN  为 Arkntools 应用提供一些额外能力
// @description:zh-TW  为 Arkntools 应用提供一些额外能力
// @author       神代綺凛
// @match        https://arkntools.app/
// @match        https://*.arkntools.app/
// @icon         https://arkntools.app/favicon.ico
// @connect      ak-conf.hypergryph.com
// @connect      ak.hycdn.cn
// @connect      ak-conf.arknights.global
// @connect      ark-us-static-online.yo-star.com
// @connect      ak-conf.arknights.jp
// @connect      ark-jp-static-online.yo-star.com
// @connect      ak-conf.arknights.kr
// @connect      ark-kr-static-online-1300509597.yo-star.com
// @connect      ak-conf-tw.gryphline.com
// @connect      ak-tw.hg-cdn.com
// @connect      as.hypergryph.com
// @connect      zonai.skland.com
// @connect      *
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/548700/Arkntools%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/548700/Arkntools%20Extension.meta.js
// ==/UserScript==

(function () {
  'use strict';

  unsafeWindow.__arkntools_extensions__ = {
    GM_xmlhttpRequest,
  };

  unsafeWindow.__arkntools_extensions_ready_callback__?.(unsafeWindow.__arkntools_extensions__);
  delete unsafeWindow.__arkntools_extensions_ready_callback__;
})();

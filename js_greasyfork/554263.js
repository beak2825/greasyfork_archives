// ==UserScript==
// @name               百度翻译 - 无登陆 AI 翻译
// @name:zh-CN         百度翻译 - 无登陆 AI 翻译
// @namespace          https://fanyi.baidu.com
// @version            0.0.1
// @author             Soxfmr
// @description        Show the AI translation without login
// @description:zh-CN  无登陆显示 AI 翻译
// @license            MIT
// @copyright          Copyright (c) [2025] [Soxfmr]
// @icon               https://fanyi.baidu.com/favicon.ico
// @match              *://fanyi.baidu.com/mtpe-individual/*
// @match              *://fanyi.baidu.com/*
// @grant              GM_addStyle
// @grant              GM_log
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/554263/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%20-%20%E6%97%A0%E7%99%BB%E9%99%86%20AI%20%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/554263/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%20-%20%E6%97%A0%E7%99%BB%E9%99%86%20AI%20%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
  const css = `
    .BKn4n1SM{max-height: 100% !important;}
  `;
  try {
    _GM_addStyle(css);
  } catch (e) {
    _GM_log(new Error("GM_addStyle stopped working！"));
  }

})();
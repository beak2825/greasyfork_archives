// ==UserScript==
// @name        cycity-fix-img-blur
// @namespace   Violentmonkey Scripts
// @match       https://www.cycani.org/*
// @grant       none
// @version     1.0
// @author      mesimpler
// @grant       GM_addStyle
// @license     MIT
// @description 修复次元城动漫web端图片过度锐化问题。
// @downloadURL https://update.greasyfork.org/scripts/549537/cycity-fix-img-blur.user.js
// @updateURL https://update.greasyfork.org/scripts/549537/cycity-fix-img-blur.meta.js
// ==/UserScript==

GM_addStyle(`
  .lazy, .lazy-p {
    height: auto !important;
  }
  .player-news {
    display: none;
  }
  .gen-btn-container.down-none {
    display: none;
  }
`)
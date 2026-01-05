// ==UserScript==
// @name        Run function
// @namespace   Alpe
// @include     http://dropvideo.com/embed/*
// @include     http://video.pw/e/*
// @version     1
// @grant       none
// @run-at      document-end
// @description Executa funções dependendo do site
// @downloadURL https://update.greasyfork.org/scripts/8479/Run%20function.user.js
// @updateURL https://update.greasyfork.org/scripts/8479/Run%20function.meta.js
// ==/UserScript==

var myFuncs = {
  "dropvideo.com": function () { rmOv(); },
  "video.pw": function () { closea(); }
};

myFuncs[document.domain]();
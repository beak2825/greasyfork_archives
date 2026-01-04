// ==UserScript==
// @name            YouTube Window Size FullScreen
// @name:ja         [Youtube]全画面 ブラウザサイズ
// @namespace       https://midra.me
// @version         1.0.1
// @description     Window Size FullScreen for YouTube
// @description:ja  YouTubeの全画面表示をブラウザサイズにするスクリプト
// @author          Midra
// @license         MIT
// @match           https://www.youtube.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at          document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551902/YouTube%20Window%20Size%20FullScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/551902/YouTube%20Window%20Size%20FullScreen.meta.js
// ==/UserScript==

(() => {
  'use strict'

  Element.prototype.requestFullscreen = function () {
    Object.defineProperty(document, 'fullscreenElement', {
      get: () => this,
      configurable: true,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
  }
  Document.prototype.exitFullscreen = function () {
    Object.defineProperty(document, 'fullscreenElement', {
      get: () => null,
      configurable: true,
    })
    document.dispatchEvent(new Event('fullscreenchange'))
  }
})()
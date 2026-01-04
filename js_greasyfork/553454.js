// ==UserScript==
// @name         移除、精简UI、
// @run-at       document-end
// @namespace    LemonNoCry
// @license      MIT
// @version      1.0.1
// @description  移除游戏中的广告和多余UI元素，提升游戏体验。
// @match        https://gltyx.github.io/*
// @match        https://cosmic-collection.g8hh.com.cn/*
// @match        https://kuzzigames.com/cosmic_collection/*
// @downloadURL https://update.greasyfork.org/scripts/553454/%E7%A7%BB%E9%99%A4%E3%80%81%E7%B2%BE%E7%AE%80UI%E3%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/553454/%E7%A7%BB%E9%99%A4%E3%80%81%E7%B2%BE%E7%AE%80UI%E3%80%81.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const timer = setInterval(() => {
    const el = document.querySelector('.main-im');
    if (el) {
      el.remove();
      clearInterval(timer);
    }
  }, 500);
})();

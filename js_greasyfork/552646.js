// ==UserScript==
// @name         颜色反转
// @namespace    http://tampermonkey.net/
// @version      2025-08-27
// @description  网页颜色反转
// @author       MUTTERTOOLS
// @match        http://**/*
// @match        https://**/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552646/%E9%A2%9C%E8%89%B2%E5%8F%8D%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552646/%E9%A2%9C%E8%89%B2%E5%8F%8D%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInverted = false;

document.addEventListener('keydown', (e) => {
  if (e.metaKey && e.key === 'i') {
    e.preventDefault();

    isInverted = !isInverted;

    // 只对 body 元素应用样式
    const targetElement = document.querySelector('html')

    if (isInverted) {
      targetElement.style.filter = 'invert(0.9)';
    } else {
      targetElement.style.filter = '';
    }

    console.log('Invert mode:', isInverted ? 'ON' : 'OFF');
  }
});
    // Your code here...
})();
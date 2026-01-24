// ==UserScript==
// @name         知乎 阻止点击两侧空白区域时折叠回答
// @description  通过拦截冒泡事件实现
// @namespace    https://zhihu.com/
// @version      1.1
// @match        https://www.zhihu.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563858/%E7%9F%A5%E4%B9%8E%20%E9%98%BB%E6%AD%A2%E7%82%B9%E5%87%BB%E4%B8%A4%E4%BE%A7%E7%A9%BA%E7%99%BD%E5%8C%BA%E5%9F%9F%E6%97%B6%E6%8A%98%E5%8F%A0%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/563858/%E7%9F%A5%E4%B9%8E%20%E9%98%BB%E6%AD%A2%E7%82%B9%E5%87%BB%E4%B8%A4%E4%BE%A7%E7%A9%BA%E7%99%BD%E5%8C%BA%E5%9F%9F%E6%97%B6%E6%8A%98%E5%8F%A0%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

const interceptors = [
  'div.Topstory-container',
  'div.Question-main'
];

interceptors.forEach(selector => {
  const el = document.querySelector(selector);
  el?.addEventListener('click', e => {
    console.log('拦截了一次愚蠢的点击折叠!');
    if (e.currentTarget === e.target) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
});
// ==UserScript==
// @name         屏蔽百度搜索百家号文章
// @website      https://225336.xyz
// @source       https://github.com/tengxunlaozu/baijiahao
// @namespace    https://github.com/tengxunlaozu/baijiahao
// @support      https://github.com/tengxunlaozu/baijiahao/issues
// @version      2.1
// @description  屏蔽百家号文章
// @author       tengxunlaozu
// @match        *://www.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/551100/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/551100/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function killBaijiahao() {

    /* 1️⃣ 新版 cosc-card 百家号 */
    document.querySelectorAll('.cosc-card, .cosc-card-content')
      .forEach(el => el.remove());

    /* 2️⃣ contype = nohumanReview */
    document.querySelectorAll('[data-click-info]')
      .forEach(el => {
        const info = el.getAttribute('data-click-info');
        if (info && info.includes('"nohumanReview"')) {
          el.closest('.c-container, .result, .cosc-card')?.remove();
        }
      });

    /* 3️⃣ aladdin 结构 + mu 指向百家号（你这张图的核心） */
    document.querySelectorAll('.result.c-container[mu]')
      .forEach(el => {
        const mu = el.getAttribute('mu');
        if (mu && mu.includes('baijiahao.baidu.com')) {
          el.remove();
        }
      });

    /* 4️⃣ 兜底：标题链接但真实来源是百家号 */
    document.querySelectorAll('a[href^="https://www.baidu.com/link"]')
      .forEach(a => {
        const container = a.closest('.result.c-container');
        if (!container) return;

        const mu = container.getAttribute('mu');
        if (mu && mu.includes('baijiahao.baidu.com')) {
          container.remove();
        }
      });

    /* 5️⃣ aladdin_struct 聚合卡（百家号常用） */
    document.querySelectorAll('[class*="aladdin"], [class*="aladding"]')
      .forEach(el => {
        if (el.innerText.includes('百家号')) {
          el.closest('.result, .c-container')?.remove();
        }
      });
  }

  // 初次执行
  killBaijiahao();

  // 监听动态加载
  const observer = new MutationObserver(() => {
    killBaijiahao();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();


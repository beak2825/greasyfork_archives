// ==UserScript==
// @name         Reddit 去广告增强版（修正版）
// @namespace    https://reddit.com/
// @version      1.2
// @description  自动移除 Reddit 广告，保留评论区输入框
// @author       Glyn
// @match        https://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555471/Reddit%20%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%88%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/555471/Reddit%20%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%88%E4%BF%AE%E6%AD%A3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const adSelectors = [
    'shreddit-comments-page-ad',
    'shreddit-ad-post',
    'div[data-testid="adpost"]',
    'div[data-testid*="promoted"]',
    'div[data-adclicklocation]',
    'div[id^="ad_"]',
    'faceplate-tracker[thing-type="ad_post"]',
  ];

  const removeAds = () => {
    // 删除明确的广告元素
    adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });

    // 有些广告被封装在 async-loader 里，我们要精准判断
    document.querySelectorAll('shreddit-async-loader').forEach(el => {
      const bundle = el.getAttribute('bundlename') || '';
      if (
        bundle.includes('ad') &&                     // 包含广告关键字
        !bundle.includes('comment') &&               // 但不是评论区相关
        !bundle.includes('reply') &&
        !bundle.includes('body_header')
      ) {
        el.remove();
      }
    });

    // 删除包含 "Promoted" 标签的帖子
    document.querySelectorAll('span, a').forEach(el => {
      if (el.textContent.trim().toLowerCase() === 'promoted') {
        const post = el.closest('shreddit-post, shreddit-ad-post, div[data-testid="post-container"]');
        if (post) post.remove();
      }
    });
  };

  removeAds();

  const observer = new MutationObserver(() => removeAds());
  observer.observe(document.body, { childList: true, subtree: true });

  console.log('[RedditCleaner] 广告清理脚本已运行，评论输入框已保留 🧹');
})();

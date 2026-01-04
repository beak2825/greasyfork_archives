// ==UserScript==
// @name            Twitter 广告隐藏器
// @name:en         Twitter Ad Hider Userscript
// @namespace       https://git.roshanca.com/roshanca
// @version         1.3
// @description     隐藏 Twitter 首页的推广广告
// @description:en  Hide promoted tweets on Twitter homepage
// @author          roshanca <wwj1983@gmail.com>
// @homepageURL     https://git.roshanca.com/roshanca/userscript
// @supportURL      https://git.roshanca.com/roshanca/userscript/issues
// @match           https://twitter.com/*
// @match           https://x.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/552524/Twitter%20%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/552524/Twitter%20%E5%B9%BF%E5%91%8A%E9%9A%90%E8%97%8F%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 定义广告类型
  const AD_TYPES = {
    PROMOTED: "推广",
    ADVOCACY: "宣传",
  };

  // 用于存储已处理的元素，避免重复处理
  const processedElements = new WeakSet();

  /**
   * 检查元素是否包含"推廣"标记
   * @param {Element} element
   * @returns {boolean}
   */
  function isPromotedTweet(element) {
    // 使用正则直接匹配包含"推廣"的 span 标签
    const promotedPattern = /<span[^>]*>.*(推廣|推广)<\/span>/;
    return promotedPattern.test(element.innerHTML);
  }

  /**
   * 检查元素是否包含"宣傳"标记
   * @param {Element} element
   * @returns {boolean}
   */
  function isAdvocacyTweet(element) {
    // 使用正则直接匹配包含"宣傳"的 span 标签
    const advocacyPattern =
      /<span[^>]*>(宣傳|宣传)\s*\([\u4e00-\u9fa5a-zA-Z]*\)<\/span>/;
    return advocacyPattern.test(element.innerHTML);
  }

  /**
   * 隐藏广告帖子
   * @param {Element} element
   * @param {AD_TYPES} type
   * @returns
   */
  function hideAdTweet(element, type) {
    if (processedElements.has(element)) {
      return;
    }

    // 查找帖子容器（通常是 article 标签或其父元素）
    let tweetContainer = element.closest("article");

    if (!tweetContainer) {
      // 如果没找到 article，尝试向上查找可能的容器
      tweetContainer = element.closest('[data-testid="cellInnerDiv"]');
    }

    if (tweetContainer) {
      console.log(`隐藏${type}帖子:`, tweetContainer);
      tweetContainer.style.display = "none";
      processedElements.add(element);
    }
  }

  // 扫描并隐藏广告
  function scanAndHideAds() {
    // 查找所有可能的帖子容器
    const tweets = document.querySelectorAll(
      'article, [data-testid="cellInnerDiv"]',
    );

    tweets.forEach((tweet) => {
      if (!processedElements.has(tweet)) {
        if (isPromotedTweet(tweet)) {
          hideAdTweet(tweet, AD_TYPES.PROMOTED);
        }

        if (isAdvocacyTweet(tweet)) {
          hideAdTweet(tweet, AD_TYPES.ADVOCACY);
        }
      }
    });
  }

  // 初始扫描
  scanAndHideAds();

  // 创建 MutationObserver 监听 DOM 变化
  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;

    for (let mutation of mutations) {
      // 检查是否有新节点添加
      if (mutation.addedNodes.length > 0) {
        shouldScan = true;
        break;
      }
    }

    if (shouldScan) {
      // 使用 requestAnimationFrame 优化性能
      requestAnimationFrame(() => {
        scanAndHideAds();
      });
    }
  });

  // 开始观察整个文档
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // 页面滚动时也检查一次（因为 Twitter 使用虚拟滚动）
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scanAndHideAds();
      }, 200);
    },
    { passive: true },
  );

  console.log("Twitter 广告隐藏器已启动");
})();

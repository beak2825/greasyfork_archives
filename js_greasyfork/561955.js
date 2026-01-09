// ==UserScript==
// @name         万能链接清理助手
// @namespace    CombinedCleaner
// @version      1.0
// @description  去除 Bilibili 和 阿里巴巴集团（淘宝、天猫、阿里云等）链接中不需要的跟踪参数，还地址栏以清白干净
// @author       GeBron
// @match        *://*.bilibili.com/*
// @match        *://*.aliyun.com/*
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.alibaba.com/*
// @match        *://*.aliexpress.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561955/%E4%B8%87%E8%83%BD%E9%93%BE%E6%8E%A5%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561955/%E4%B8%87%E8%83%BD%E9%93%BE%E6%8E%A5%E6%B8%85%E7%90%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** 待清理的垃圾参数黑名单 (合并自两个脚本) */
  const PARAMS_BLACK_LIST = new Set([
    // Bilibili 参数
    "spm_id_from", "from_source", "msource", "bsource", "seid", "source", "session_id",
    "visit_id", "sourceFrom", "from_spmid", "share_source", "share_medium", "share_plat",
    "share_session_id", "share_tag", "unique_k", "csource", "vd_source", "tab",
    "is_story_h5", "share_from", "plat_id", "-Arouter", "spmid", "trackid",
    // 阿里巴巴参数
    "spm", "acm", "scm", "ali_trackid", "clk1", "upsid", "bxsign", "mi_id",
    "u_channel", "ali_refid", "utparam", "mm_sceneid", "xxc", "pvid", "umpChannel"
  ]);

  /** * 核心清理函数 
   */
  function cleanURL(urlStr) {
    try {
      if (!urlStr || typeof urlStr !== 'string') return urlStr;
      
      // 处理省略协议头的情况 (//example.com)
      let fullUrl = urlStr;
      if (urlStr.startsWith("//")) {
        fullUrl = window.location.protocol + urlStr;
      }

      const url = new URL(fullUrl, window.location.href);
      let hasChanged = false;

      // 遍历并删除黑名单参数
      PARAMS_BLACK_LIST.forEach((param) => {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          hasChanged = true;
        }
      });

      // 处理 B 站特有的域名替换 (tv -> com)
      if (url.hostname.endsWith("bilibili.tv")) {
        url.hostname = "bilibili.com";
        hasChanged = true;
      }

      return hasChanged ? url.toString() : urlStr;
    } catch (e) {
      return urlStr;
    }
  }

  /**
   * 刷新地址栏 (不刷新页面)
   */
  function cleanCurrentLocation() {
    const currentHref = window.location.href;
    const cleanedHref = cleanURL(currentHref);
    if (currentHref !== cleanedHref) {
      window.history.replaceState(window.history.state, "", cleanedHref);
      console.log(`[Cleaner] 已清理当前地址栏: ${cleanedHref}`);
    }
  }

  /**
   * 清理页面中的 A 标签
   */
  function cleanAnchors(nodes) {
    const targets = nodes || document.querySelectorAll("a");
    targets.forEach((a) => {
      if (a.href && (a.href.includes("bilibili") || a.href.includes("taobao") || a.href.includes("tmall") || a.href.includes("alibaba"))) {
        const newHref = cleanURL(a.href);
        if (a.href !== newHref) a.href = newHref;
      }
    });
  }

  // --- 1. 执行初始清理 ---
  cleanCurrentLocation();

  // --- 2. 劫持 History API (处理单页应用 SPA 跳转) ---
  const wrapState = function (type) {
    const orig = window.history[type];
    return function () {
      const rv = orig.apply(this, arguments);
      cleanCurrentLocation();
      return rv;
    };
  };
  window.history.pushState = wrapState("pushState");
  window.history.replaceState = wrapState("replaceState");
  window.addEventListener("popstate", cleanCurrentLocation);

  // --- 3. 劫持 window.open ---
  window.open = ((origOpen) => {
    return (url, name, params) => {
      return origOpen(cleanURL(url), name, params);
    };
  })(window.open);

  // --- 4. 监听点击/右键事件 (即时清理被点击的链接) ---
  const handleEvent = (e) => {
    let el = e.target;
    while (el && el.tagName !== "A") el = el.parentNode;
    if (el && el.tagName === "A") {
      el.href = cleanURL(el.href);
    }
  };
  window.addEventListener("click", handleEvent, true);
  window.addEventListener("contextmenu", handleEvent, true);

  // --- 5. 监听 DOM 变动 (处理异步加载的新内容) ---
  let timer;
  const observer = new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cleanAnchors();
      cleanCurrentLocation();
    }, 500); // 降低频率防止卡顿
  });
  observer.observe(document, { childList: true, subtree: true });

  // 页面完全加载后再跑一次
  window.addEventListener("load", () => cleanAnchors());

})();
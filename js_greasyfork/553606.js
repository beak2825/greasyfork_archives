// ==UserScript==
// @name         Weibo 视频自动最高画质（支持4K/2K/2K60）
// @version      1.4.0
// @description  在微博网页自动切换到可用的最高分辨率，支持新版 wbplayer（如超清 4K、2K60等）和旧播放器
// @match        *://weibo.com/*
// @match        *://www.weibo.com/*
// @match        *://m.weibo.cn/*
// @run-at       document-idle
// @grant        none
// @namespace https://letsmod.com/userscripts
// @downloadURL https://update.greasyfork.org/scripts/553606/Weibo%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%EF%BC%88%E6%94%AF%E6%8C%814K2K2K60%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553606/Weibo%20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%EF%BC%88%E6%94%AF%E6%8C%814K2K2K60%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 根据文本解析分辨率；支持 K/k 后缀（如 4K、2K60），默认为千倍
  function parseResolution(text) {
    if (!text) return 0;
    const match = /(?:(\d+)(K)?)(?:\d*)/i.exec(text);
    if (!match) return 0;
    const num = parseInt(match[1], 10) || 0;
    if (/K/i.test(match[0])) {
      return num * 1000; // 4K → 4000
    }
    return num;
  }

  // 选择 wbplayer 菜单中可用的最高分辨率
  function selectHighestQuality(menu) {
    const items = menu.querySelectorAll(".wbpv-menu-item .wbpv-menu-item-text");
    let bestItem = null;
    let bestRes = 0;
    items.forEach((span) => {
      const res = parseResolution(span.textContent || "");
      if (res > bestRes) {
        bestRes = res;
        bestItem = span.closest(".wbpv-menu-item");
      }
    });
    if (bestItem) {
      bestItem.click();
    }
  }

  // 处理新版 wbplayer 容器：打开菜单并切换最高画质
  function handleWbpvPlayer(container) {
    const qualityButton = container.querySelector(".wbpv-quality button");
    const menu = container.querySelector(".wbpv-menu");
    if (!qualityButton || !menu) return;

    const current = container.querySelector(".wbpv-quality-value");
    const currentRes = current ? parseResolution(current.textContent || "") : 0;
    if (currentRes >= 2000) return; // 已是 2K 或更高，不再切换

    qualityButton.click();
    setTimeout(() => {
      selectHighestQuality(menu);
    }, 100);
  }

  // 旧版播放器关键字列表（顺序代表优先级）
  const QUALITY_KEYS = ["原画", "8K", "6K", "4K", "蓝光", "3K", "2K", "超清", "1440", "1080", "1080P", "高清", "720", "720P", "标清", "480"];
  const MENU_KEYS = ["画质", "清晰度", "设置", "更多", "齿轮", "gear"];

  // 根据文本匹配关键字
  function queryByText(root, texts = [], selector = "*") {
    const nodes = root.querySelectorAll(selector);
    return Array.from(nodes).find((el) => {
      const t = (el.textContent || "").trim();
      return texts.some((x) => t && t.includes(x));
    });
  }

  // 安全点击
  function safeClick(el) {
    if (!el) return false;
    try {
      el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      el.click();
      return true;
    } catch {
      try {
        el.click();
        return true;
      } catch {
        return false;
      }
    }
  }

  // 处理旧版播放器容器
  function applyHighestQuality(container) {
    if (!container || container.__hq_done) return;
    container.__hq_done = true;
    try {
      let opener = queryByText(container, MENU_KEYS, 'button, [role="button"], [class], span');
      if (!opener) {
        opener = container.querySelector('[class*="quality"], [class*="clarity"], [class*="setting"], [class*="gear"]');
      }
      if (opener) safeClick(opener);

          // 菜单根：尝试页面内常见选择器，不一定都存在
      const menuRoot =
        document.querySelector('[role="menu"], [class*="menu"], [class*="popover"], [class*="dropdown"], [class*="list"]') || container;
      for (const key of QUALITY_KEYS) {
        const item =
          queryByText(menuRoot, [key], 'li, div, button, [role="menuitem"], [class], span') ||
          queryByText(document, [key], 'li, div, button, [role="menuitem"], [class], span');
        if (item) {
          if (safeClick(item)) break;
        }
      }
    } catch (err) {
      console.error("Quality switching failed:", err);
    }
  }

  // 初始扫描及动态监听
  function scan() {
    // 新版 wbplayer
    document.querySelectorAll(".wbpv-quality").forEach((c) => {
      if (!c.__hq_checked) {
        c.__hq_checked = true;
        handleWbpvPlayer(c);
      }
    });
    // 旧版播放器
    document.querySelectorAll(
      '[class*="Player"], [class*="player"], [class*="video"], .WB_media_wrap, .wbpro-feed-video, .mplayer, .m-video, .mwb-video, video'
    ).forEach((el) => {
      const container =
        el.closest('[class*="player"], [class*="video"], [class*="WB_"], [class*="m-"], article, section') || el;
      applyHighestQuality(container);
    });
  }

  function boot() {
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    let lastHref = location.href;
    setInterval(() => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        setTimeout(scan, 500);
      }
    }, 400);
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    boot();
  } else {
    window.addEventListener("DOMContentLoaded", boot, { once: true });
  }
})();

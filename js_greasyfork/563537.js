// ==UserScript==
// @name         Bilibili 深色跟随系统
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动跟随系统设置切换B站深浅色主题
// @author       柒泗
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563537/Bilibili%20%E6%B7%B1%E8%89%B2%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/563537/Bilibili%20%E6%B7%B1%E8%89%B2%E8%B7%9F%E9%9A%8F%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const THEME_COOKIE = "theme_style";
  const CSS_ID = "__css-map__";
  const FILTER_ID = "__css-map-filter__";
  const CSS_BASE = "https://s1.hdslb.com/bfs/seed/jinkela/short/bili-theme/";
  const ONE_YEAR = 60 * 60 * 24 * 365;

  const HOST_BG_SWAPS = {
    "t.bilibili.com": {
      light: "https://s1.hdslb.com/bfs/static/stone-free/dyn-home/assets/bg.png",
      dark: "https://s1.hdslb.com/bfs/static/stone-free/dyn-home/assets/bg_dark.png",
    },
    "message.bilibili.com": {
      light: "https://i0.hdslb.com/bfs/seed/jinkela/short/message/img/light_bg.png",
      dark: "https://i0.hdslb.com/bfs/seed/jinkela/short/message/img/dark_bg.png",
    },
  };

  const IS_SPACE = location.hostname === "space.bilibili.com";
  const NEED_BG_WATCH = !!HOST_BG_SWAPS[location.hostname];

  let lastApplied = null;
  let selfChanging = false;

  function getSystemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setThemeCookie(theme) {
    document.cookie =
      `${THEME_COOKIE}=${theme}; domain=.bilibili.com; path=/; max-age=${ONE_YEAR}`;
  }

  function pickCssName(theme) {
    const link = document.getElementById(CSS_ID);
    const href = link?.href || "";
    const useAll = /\/(light_all|dark_all)\.css/i.test(href);
    if (useAll) return theme === "dark" ? "dark_all" : "light_all";
    return theme;
  }

  function ensureThemeLink(allowCreate) {
    let link = document.getElementById(CSS_ID);
    if (link) return link;
    if (!allowCreate) return null;

    const head = document.head || document.documentElement;
    if (!head) return null;

    link = document.createElement("link");
    link.id = CSS_ID;
    link.rel = "stylesheet";
    head.insertBefore(link, head.firstChild);
    return link;
  }

  function syncFilterStyle(theme) {
    const style = document.getElementById(FILTER_ID);
    if (!style) return;

    const txt = style.innerText || "";
    const trimmed = txt.trim();
    const isCommented = trimmed.startsWith("/*") && trimmed.endsWith("*/");

    if (theme === "light") {
      if (!isCommented) style.innerHTML = `/*${txt}*/`;
    } else {
      if (isCommented) {
        style.innerHTML = trimmed
          .replace(/^\/\*+/, "")
          .replace(/\*\/+$/, "");
      }
    }
  }

  function dispatchThemeEvent(theme) {
    try {
      document.dispatchEvent(
        new CustomEvent("biliThemeChange", {
          detail: { theme },
          bubbles: true,
          cancelable: true,
        })
      );
    } catch (_) {}
  }

  function getBgSwapConfig() {
    return HOST_BG_SWAPS[location.hostname] || null;
  }

  function replaceInlineAndImg(fromUrl, toUrl, root) {
    if (!root || !root.querySelectorAll) return;

    // 1) inline style
    const styleNodes = root.querySelectorAll(`[style*="${fromUrl}"], [style*="${toUrl}"]`);
    for (const el of styleNodes) {
      const s = el.getAttribute("style") || "";
      if (s.includes(fromUrl)) el.setAttribute("style", s.replaceAll(fromUrl, toUrl));
    }

    const imgs = root.querySelectorAll("img");
    for (const img of imgs) {
      const src = img.getAttribute("src");
      const dsrc = img.getAttribute("data-src");
      const osrc = img.getAttribute("data-original");
      if (src && src.includes(fromUrl)) img.setAttribute("src", src.replace(fromUrl, toUrl));
      if (dsrc && dsrc.includes(fromUrl)) img.setAttribute("data-src", dsrc.replace(fromUrl, toUrl));
      if (osrc && osrc.includes(fromUrl)) img.setAttribute("data-original", osrc.replace(fromUrl, toUrl));
    }
  }

  function forceComputedBg(fromUrl, toUrl) {
    const root = document.documentElement;
    if (!root) return;

    const candidates = [];
    if (document.body) candidates.push(document.body);
    const app = document.getElementById("app");
    if (app) candidates.push(app);

    const extra = root.querySelectorAll("main, section, div");
    let checked = 0;
    let hits = 0;

    for (const el of extra) {
      if (checked++ > 1200) break;
      const bg = getComputedStyle(el).backgroundImage || "";
      if (bg.includes(fromUrl) || bg.includes(toUrl)) {
        el.style.setProperty("background-image", `url("${toUrl}")`, "important");
        hits++;
        if (hits >= 25) break;
      }
    }

    for (const el of candidates) {
      const bg = getComputedStyle(el).backgroundImage || "";
      if (bg.includes(fromUrl) || bg.includes(toUrl)) {
        el.style.setProperty("background-image", `url("${toUrl}")`, "important");
      }
    }
  }

  function applyHostBackground(theme) {
    const conf = getBgSwapConfig();
    if (!conf) return;

    const toUrl = theme === "dark" ? conf.dark : conf.light;
    const fromUrl = theme === "dark" ? conf.light : conf.dark;

    const root = document.documentElement;
    replaceInlineAndImg(fromUrl, toUrl, root);
    if (document.body) replaceInlineAndImg(fromUrl, toUrl, document.body);

    forceComputedBg(fromUrl, toUrl);
  }

  let bgWatchPending = false;
  function scheduleBgFix() {
    if (!NEED_BG_WATCH) return;
    if (bgWatchPending) return;
    bgWatchPending = true;
    setTimeout(() => {
      bgWatchPending = false;
      applyHostBackground(getSystemTheme());
    }, 60);
  }

  function watchHostBackgroundIfNeeded() {
    if (!NEED_BG_WATCH) return;

    const mo = new MutationObserver(() => {
      if (selfChanging) return;
      scheduleBgFix();
    });

    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "src", "href", "class"],
    });

    document.addEventListener("DOMContentLoaded", scheduleBgFix);
    window.addEventListener("pageshow", scheduleBgFix);
  }
  // --------------------------------------

  function applyTheme(theme, reason = "") {
    if (theme !== "dark" && theme !== "light") return;
    if (lastApplied === theme && reason !== "force") {
      if (NEED_BG_WATCH) applyHostBackground(theme);
      return;
    }

    selfChanging = true;
    try {
      document.documentElement.classList.toggle("bili_dark", theme === "dark");

      const allowCreate = !IS_SPACE;
      const link = ensureThemeLink(allowCreate);
      if (link) {
        const cssName = pickCssName(theme);
        const targetHref = `${CSS_BASE}${cssName}.css`;
        if (link.href !== targetHref) link.href = targetHref;
      }

      syncFilterStyle(theme);

      setThemeCookie(theme);

      dispatchThemeEvent(theme);

      applyHostBackground(theme);

      lastApplied = theme;
    } finally {
      Promise.resolve().then(() => (selfChanging = false));
    }
  }

  let pending = false;
  function scheduleApply(reason = "") {
    if (pending) return;
    pending = true;
    setTimeout(() => {
      pending = false;
      applyTheme(getSystemTheme(), reason);
    }, 30);
  }

  function observeThemeOnly() {
    const html = document.documentElement;
    if (html) {
      const mo1 = new MutationObserver(() => {
        if (selfChanging) return;
        scheduleApply("html-class-changed");
      });
      mo1.observe(html, { attributes: true, attributeFilter: ["class"] });
    }

    const tryWatchLink = () => {
      const link = document.getElementById(CSS_ID);
      if (!link) return;

      const mo2 = new MutationObserver(() => {
        if (selfChanging) return;
        scheduleApply("theme-link-changed");
      });
      mo2.observe(link, { attributes: true, attributeFilter: ["href"] });
    };

    setTimeout(tryWatchLink, 200);
    setTimeout(tryWatchLink, 800);
    setTimeout(tryWatchLink, 1500);
  }

  function boot() {
    if (!window.matchMedia) return;

    applyTheme(getSystemTheme(), "force");

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    if (mql.addEventListener) mql.addEventListener("change", () => scheduleApply("mql-change"));
    else mql.addListener(() => scheduleApply("mql-change"));

    document.addEventListener("biliThemeChange", () => scheduleApply("biliThemeChange"), true);

    observeThemeOnly();

    watchHostBackgroundIfNeeded();

    if (IS_SPACE) {
      document.addEventListener("DOMContentLoaded", () => {
        applyTheme(getSystemTheme(), "force");
      });
    }

    window.addEventListener("pageshow", () => scheduleApply("pageshow"));
  }

  boot();
})();

// ==UserScript==
// @name         Emby Web端自动隐藏播放UI
// @namespace    https://example.com/
// @version      2.0
// @description  Only hide Emby OSD (top/bottom bars) AFTER video starts playing. Show UI on pause. Toggle with Shift+U.
// @match        http://*/web/index.html*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563094/Emby%20Web%E7%AB%AF%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E6%92%AD%E6%94%BEUI.user.js
// @updateURL https://update.greasyfork.org/scripts/563094/Emby%20Web%E7%AB%AF%E8%87%AA%E5%8A%A8%E9%9A%90%E8%97%8F%E6%92%AD%E6%94%BEUI.meta.js
// ==/UserScript==
// 快捷键 shift+U 开启/关闭
(function () {
  "use strict";

  const TOGGLE = { shiftKey: true, code: "KeyU" }; // Shift+U
  const STORAGE_KEY = "tm_emby_auto_hide_osd_enabled";
  let enabled = (localStorage.getItem(STORAGE_KEY) ?? "1") === "1";

  // 只在 videoosd 路由生效
  function isVideoOsdRoute() {
    return /#!\/videoosd\//i.test(location.hash);
  }

  // 只瞄准“顶部/底部 UI”，不要动最外层容器，避免影响播放器初始化
  const OSD_BARS = [
    // top bars
    ".videoOsdTop",
    ".videoOsdHeader",
    ".skinHeader",
    ".playerTopBar",
    ".osdTopBar",

    // bottom bars
    ".videoOsdBottom",
    ".videoOsdFooter",
    ".videoOsdBottomBar",
    ".skinFooter",
    ".playerBottomBar",
    ".videoPlayerControls",
    ".playerControls",
    ".osdBottomBar",

    // seek / time
    ".seekSlider",
    ".timeSlider",
    ".progressSlider",
    ".sliderContainer",
    ".osdTimeText",
    ".positionText",
    ".durationText",

    // scrims / gradients (仅限常见类名)
    ".scrimTop",
    ".scrimBottom",
    ".videoOsdScrim",
    ".osdScrim",
    ".shade",
    ".dim"
  ];

  const STYLE_ID = "tm-emby-auto-hide-osd-style";

  // 我们用一个状态：只有在“正在播放”时才隐藏
  let hideNow = false;

  function cssText() {
    if (!enabled || !isVideoOsdRoute() || !hideNow) return "";

    const sel = OSD_BARS.join(",\n");
    return `
${sel} {
  opacity: 0 !important;
  pointer-events: none !important;
}
${sel} * {
  pointer-events: none !important;
}
`.trim();
  }

  function applyStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.documentElement.appendChild(style);
    }
    style.textContent = cssText();
  }

  function setEnabled(next) {
    enabled = !!next;
    localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    applyStyle();
    console.log(`[TM] Emby auto-hide OSD: ${enabled ? "ON" : "OFF"} (Shift+U)`);
  }

  function onKeyDown(e) {
    if (e.code === TOGGLE.code && e.shiftKey === TOGGLE.shiftKey) {
      setEnabled(!enabled);
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function findVideoEl() {
    // Emby 通常用 <video>，有时会重新创建节点，所以每次都找最新的
    return document.querySelector("video");
  }

  function wireVideoEvents() {
    const v = findVideoEl();
    if (!v) return false;

    const onPlayLike = () => {
      // 进入播放后再隐藏，避免影响“点播放”
      hideNow = true;
      applyStyle();
    };
    const onPauseLike = () => {
      // 暂停/结束时显示 UI，方便继续点播放/操作
      hideNow = false;
      applyStyle();
    };

    // 先移除可能重复绑定（通过自定义标记）
    if (v.__tmEmbyBound) return true;
    v.__tmEmbyBound = true;

    v.addEventListener("playing", onPlayLike, true);
    v.addEventListener("play", onPlayLike, true);
    v.addEventListener("pause", onPauseLike, true);
    v.addEventListener("ended", onPauseLike, true);
    v.addEventListener("waiting", () => {
      // 缓冲时可选择显示 UI；这里保持隐藏（更沉浸）
      // 如果你想缓冲时显示，把下面两行取消注释：
      // hideNow = false;
      // applyStyle();
    }, true);

    // 初始：如果已经在播放（比如自动续播），同步状态
    hideNow = !v.paused && !v.ended;
    applyStyle();

    return true;
  }

  // 监听路由变化 + DOM 变化，保证 video 节点换了也能重新绑定
  function boot() {
    applyStyle();
    window.addEventListener("keydown", onKeyDown, true);

    const tryBind = () => wireVideoEvents();

    // 先尝试一次
    tryBind();

    // DOM 变化时再尝试绑定（Emby 会动态重建 video）
    const mo = new MutationObserver(() => {
      if (!isVideoOsdRoute()) return;
      tryBind();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // hash 路由变化时刷新状态
    window.addEventListener("hashchange", () => {
      hideNow = false; // 切页先别隐藏，避免影响新页面交互
      applyStyle();
      setTimeout(tryBind, 300);
    }, true);

    // 轻量兜底轮询：防止某些情况下没触发 mutation
    setInterval(() => {
      if (!isVideoOsdRoute()) return;
      tryBind();
    }, 1000);
  }

  boot();
})();

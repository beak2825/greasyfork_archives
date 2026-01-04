// ==UserScript==
// @name         Video Sites Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      Unlicense
// @description  Add keyboard shortcuts to various video sites
// @author       Jim Chen
// @homepage     https://jimchen.me
// @match        *://*.bilibili.com/*
// @match        *://vkvideo.ru/*
// @match        *://rutube.ru/*
// @match        *://*.1tv.ru/*
// @match        *://*.matchtv.ru/*
// @match        file://*/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550371/Video%20Sites%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/550371/Video%20Sites%20Shortcuts.meta.js
// ==/UserScript==
(function () {
  document.addEventListener("keydown", function (e) {
    const activeElement = document.activeElement;
    const isInputElement = activeElement && /input|textarea/i.test(activeElement.tagName);

    // If typing in an input/textarea, only allow Escape to blur
    if (isInputElement) {
      if (e.key === "Escape") {
        activeElement.blur();
      }
      return;
    }

    const hostname = window.location.hostname;
    const isBilibili = hostname.includes("bilibili.com");
    const isVkVideo = hostname.includes("vkvideo.ru");
    const isRuTube = hostname.includes("rutube.ru");

    // --- Search Focus ---
    if (e.key === "/" || e.key === ".") {
      let searchInput = null;

      if (isBilibili) {
        const selector = window.location.href.startsWith("https://search.bilibili.com/")
          ? 'input.search-input-el[placeholder="输入关键字搜索"]' // More specific selector for search page
          : ".nav-search-input"; // General header search
        searchInput = document.querySelector(selector);
      } else if (isVkVideo) {
        // VK Video specific selector
        searchInput = document.querySelector("#video_service_search_input");
      } else if (isRuTube) {
        // RuTube specific selector for search input
        searchInput = document.querySelector(".wdp-search-line-module__input");
      }

      if (searchInput) {
        e.preventDefault(); // Prevent browser's default find action
        searchInput.focus();
        searchInput.select(); // Select existing text
      }
      return;
    }

    const video = document.querySelector("video");
    if (!video) return;

    // Number keys 0-9 for seeking
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      const percentage = parseInt(e.key) * 10;
      if (video.duration && isFinite(video.duration)) {
        video.currentTime = (percentage / 100) * video.duration;
      }
      return;
    }

    let keyHandled = false;

    if (e.shiftKey && (e.key === ">" || e.key === "Ю")) {
      // Increase speed
      video.playbackRate = Math.min(video.playbackRate + 0.25, 4); // Capped at 4x
      keyHandled = true;
    } else if (e.shiftKey && (e.key === "<" || e.key === "Б")) {
      // Decrease speed
      video.playbackRate = Math.max(video.playbackRate - 0.25, 0.25); // Minimum 0.25x
      keyHandled = true;
    } else if (e.key === "j" || e.key === "J" || e.key === "о" || e.key === "О") {
      video.currentTime = Math.max(video.currentTime - 10, 0);
      keyHandled = true;
    } else if (e.key === "k" || e.key === "K" || e.key === "л" || e.key === "Л") {
      if (video.paused) {
        video.play().catch((err) => console.error("Play failed:", err)); // Add error handling for play()
      } else {
        video.pause();
      }
      keyHandled = true;
    } else if (e.key === "l" || e.key === "L" || e.key === "д" || e.key === "Д") {
      if (video.duration && isFinite(video.duration)) {
        video.currentTime = Math.min(video.currentTime + 10, video.duration);
      }
      keyHandled = true;
    }
    if (keyHandled) {
      e.preventDefault();
    }
  });
})();
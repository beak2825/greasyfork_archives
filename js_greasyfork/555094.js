// ==UserScript==
// @name         Bilibili Auto Theme
// @namespace    https://bilibili.com/
// @version      1.0.1
// @description  Sync Bilibili theme_style cookie with system dark/light mode
// @match        *://*.bilibili.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555094/Bilibili%20Auto%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/555094/Bilibili%20Auto%20Theme.meta.js
// ==/UserScript==

(function () {
  const COOKIE_KEY = "theme_style";
  const DARK_QUERY = "(prefers-color-scheme: dark)";

  const getCookie = (key) =>
    document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`))?.[1];

  const setThemeCookie = (theme) => {
    document.cookie = `${COOKIE_KEY}=${theme}; domain=.bilibili.com; path=/; max-age=31536000; secure`;
    console.log("[Theme Sync] Cookie updated:", theme);
  };

  const updateTheme = () => {
    const isDark = window.matchMedia(DARK_QUERY).matches;
    const systemTheme = isDark ? "dark" : "light";
    const currentTheme = getCookie(COOKIE_KEY);

    if (currentTheme !== systemTheme) {
      setThemeCookie(systemTheme);
      // recommended small delay to ensure cookie applied before reload
      setTimeout(() => window.location.reload(), 100);
    }
  };

  // Initial sync
  updateTheme();

  // Watch for system theme changes
  window.matchMedia(DARK_QUERY).addEventListener("change", updateTheme);
})();
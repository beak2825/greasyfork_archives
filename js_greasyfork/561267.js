// ==UserScript==
// @name         YouTube Music Light Mode
// @namespace    http://tampermonkey.net/
// @version      2026-01-23.1
// @description  Simple white light theme for YouTube Music that auto-disables on dark mode
// @author       Sreinumder
// @match        https://music.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561267/YouTube%20Music%20Light%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/561267/YouTube%20Music%20Light%20Mode.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let enabled = false;

  function init() {
    if (mediaQuery.matches || enabled) return;
    enabled = true;

    const style = document.createElement("style");
    style.id = "uLight-style";
    style.textContent = `
      * { color: #000 !important; }
      body, #background.ytmusic-app { background: #fff !important; }
      .background-gradient, ytmusic-browse-response .background-gradient { background: #fff !important; }
      .logo.style-scope.ytmusic-logo[src*="on_platform_logo_dark"] { content: url('data:image/svg+xml,<svg fill="none" height="26" viewBox="0 0 77 26" width="77" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><clipPath id="a"><path d="m0 0h77v26h-77z"/></clipPath><g clip-path="url(%23a)"><g fill="%23000"><path d="m30.112 21.8671h2.32v-7.29c0-2.04-.04-4.21-.2-7.10995h.26l.43 1.78 2.74 12.61995h2.36l2.69-12.61995.47-1.78h.24c-.12 2.56995-.19 4.88995-.19 7.10995v7.29h2.33v-16.79995h-3.96l-1.42 6.20995c-.6 2.58-1.03 5.78-1.28 7.41h-.19c-.18-1.66-.63-4.85-1.22-7.39l-1.46-6.22995h-3.92z"/><path d="m48.202 22.0571c1.46 0 2.37-.61 3.12-1.71h.11l.11 1.52h1.99v-12.35995h-2.64v9.92995c-.28.49-.93.85-1.54.85-.77 0-1.01-.61-1.01-1.63v-9.14995h-2.63v9.26995c0 2.01.58 3.28 2.49 3.28z"/><path d="m58.7536 22.1271c2.42 0 3.77-1.07 3.77-3.26 0-1.99-1-2.8-3.38-4.42-1.09-.72-1.68-1.17-1.68-2.23 0-.79.49-1.21 1.38-1.21.97 0 1.3.64 1.34 2.46l2.16-.12c.18-2.85-.84-4.06995-3.46-4.06995-2.48 0-3.67 1.06995-3.67 3.18995 0 1.96.93 2.85 2.68 4.07 1.55 1.07 2.4 1.74 2.4 2.63 0 .73-.51 1.26-1.4 1.26-1.02 0-1.6-.88-1.5-2.21l-2.19.04c-.34 2.56.86 3.87 3.55 3.87z"/><path d="m65.387 7.93715c.9 0 1.32-.3 1.32-1.54 0-1.16-.45-1.52-1.32-1.52-.88 0-1.31.32-1.31 1.52 0 1.24.41 1.54 1.31 1.54zm-1.22 13.92995h2.53v-12.35995h-2.53z"/><path d="m72.3428 22.0671c1.26 0 1.97-.1499 2.54-.69.85-.74 1.2-1.89 1.14-3.83l-2.31-.12c0 2.12-.34 2.92-1.33 2.92-1.09 0-1.27-1.19-1.27-3.35v-2.56c0-2.36.23-3.48 1.29-3.48.88 0 1.23.74 1.23 3.1l2.29-.16c.16-1.69-.01-3.07-.81-3.84-.6-.55995-1.49-.77995-2.67-.77995-3.03 0-3.97 1.91995-3.97 5.56995v1.69c0 3.65.71 5.53 3.87 5.53z"/></g><path d="m13 26c7.176 0 13-5.824 13-13s-5.824-13-13-13-13 5.824-13 13 5.824 13 13 13z" fill="%23f03"/><path d="m20.5 13c0 4.1439-3.3561 7.5-7.5 7.5-4.14386 0-7.5-3.3561-7.5-7.5 0-4.14386 3.35614-7.5 7.5-7.5 4.1439 0 7.5 3.35614 7.5 7.5z" stroke="%23fff"/><path d="m17.75 13-7.5-4.25v8.5z" fill="%23fff"/></g></svg>') !important; }
      ytmusic-search-box .search-container,
      ytmusic-search-box .search-box,
      ytmusic-search-box #input { background: #fff !important; }
      ytmusic-search-box #input { color: #000 !important; caret-color: #000 !important; }
      ytmusic-search-box #placeholder { color: #666 !important; }
      ytmusic-search-box #suggestion-list,
      ytmusic-search-suggestions-section,
      ytmusic-search-suggestion { background: #fff !important; color: #000 !important; }
      ytmusic-search-suggestion:hover { background: #f5f5f5 !important; }
    `;
    document.head.appendChild(style);

    document.documentElement.style.setProperty(
      "--ytmusic-color-black4",
      "#fff",
    );
    document.documentElement.style.setProperty(
      "--ytmusic-color-black1",
      "#fff",
    );
    document.body.style.background = "#fff";
  }

  function disable() {
    if (!enabled) return;
    enabled = false;

    document.getElementById("uLight-style")?.remove();
    document.documentElement.style.removeProperty("--ytmusic-color-black1");
    document.documentElement.style.removeProperty("--ytmusic-color-black4");
    document.body.style.removeProperty("background");
  }

  mediaQuery.addEventListener("change", (e) =>
    e.matches ? disable() : init(),
  );
  mediaQuery.matches ? disable() : init();
})();

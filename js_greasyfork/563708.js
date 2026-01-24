// ==UserScript==
// @name         SoundCloud RSS Feed
// @namespace    https://github.com/26d0/userscripts
// @version      0.1.0
// @description  Get RSS feed URL for SoundCloud user pages
// @match        https://soundcloud.com/*
// @grant        none
// @icon         https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico
// @downloadURL https://update.greasyfork.org/scripts/563708/SoundCloud%20RSS%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/563708/SoundCloud%20RSS%20Feed.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ===================
  // Icons
  // ===================

  const ICONS = {
    rss: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f70" stroke="none">
      <circle cx="6.18" cy="17.82" r="2.18"/>
      <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z"/>
    </svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>`,
  };

  // ===================
  // Button Management
  // ===================

  const btn = {
    init() {
      this.el = document.createElement("button");
      this.el.innerHTML = ICONS.rss;
      this.el.title = "Copy RSS feed URL";
      this.el.classList.add("sc-button");
      this.el.classList.add("sc-button-medium");
      this.el.classList.add("sc-button-icon");
      this.el.classList.add("sc-button-responsive");
      this.el.classList.add("sc-button-secondary");
    },

    cb() {
      // Try multiple selectors for different page layouts
      const selectors = [
        // User profile page - header action buttons
        ".userInfoBar__buttons .sc-button-group",
        ".profileHeaderInfo__buttons .sc-button-group",
        ".userMain__headerButtons .sc-button-group",
        // Generic button group in user header
        ".soundHeader__actions .sc-button-group",
        ".header__actions .sc-button-group",
        // Fallback: any button group containing Follow/Station buttons
        ".sc-button-group:has(.sc-button-follow)",
        ".sc-button-group:has(.sc-button-station)",
      ];

      let par = null;
      for (const selector of selectors) {
        par = document.querySelector(selector);
        if (par) {
          console.log("[RSS] Found button container with selector:", selector);
          break;
        }
      }

      if (par && this.el.parentElement !== par) {
        par.insertAdjacentElement("beforeend", this.el);
      }
    },

    attach() {
      this.detach();
      this.observer = new MutationObserver(this.cb.bind(this));
      this.observer.observe(document.body, { childList: true, subtree: true });
      this.cb();
    },

    detach() {
      if (this.observer) {
        this.observer.disconnect();
      }
    },
  };

  btn.init();

  // ===================
  // Utility Functions
  // ===================

  function hook(obj, name, callback, type) {
    const fn = obj[name];
    obj[name] = function (...args) {
      if (type === "before") callback.apply(this, args);
      fn.apply(this, args);
      if (type === "after") callback.apply(this, args);
    };
    return () => {
      obj[name] = fn;
    };
  }

  function isUserPage() {
    const excludedPaths = [
      "/you",
      "/stations",
      "/discover",
      "/stream",
      "/upload",
      "/search",
      "/settings",
      "/messages",
      "/notifications",
      "/charts",
      "/people",
      "/pages",
      "/pro",
      "/jobs",
      "/creators",
      "/terms-of-use",
      "/privacy",
    ];

    const pathname = location.pathname;

    // Check if it's an excluded path
    for (const excluded of excludedPaths) {
      if (pathname.startsWith(excluded)) {
        return false;
      }
    }

    // User page pattern: /username or /username/tracks etc.
    // Should have at least one path segment that looks like a username
    const match = pathname.match(/^\/([^/]+)/);
    if (!match) return false;

    const username = match[1];
    // Username should not be empty
    return username.length > 0;
  }

  function extractUsername() {
    const match = location.pathname.match(/^\/([^/]+)/);
    return match ? match[1] : null;
  }

  function extractUserId() {
    const html = document.documentElement.innerHTML;
    const match = html.match(/soundcloud:\/\/users:(\d+)/);
    return match ? match[1] : null;
  }

  function buildRssFeedUrl(userId) {
    return `http://feeds.soundcloud.com/users/soundcloud:users:${userId}/sounds.rss`;
  }

  // ===================
  // Main Logic
  // ===================

  function load(by) {
    btn.detach();
    console.log("[RSS] load triggered by:", by, location.href);

    if (!isUserPage()) {
      console.log("[RSS] Not a user page, skipping");
      return;
    }

    const username = extractUsername();
    if (!username) {
      console.log("[RSS] Could not extract username");
      return;
    }

    console.log("[RSS] Detected user page for:", username);

    btn.el.onclick = async () => {
      const userId = extractUserId();
      if (!userId) {
        console.log("[RSS] Could not find user ID in page");
        btn.el.innerHTML = ICONS.error;
        setTimeout(() => {
          btn.el.innerHTML = ICONS.rss;
        }, 2000);
        return;
      }

      const rssUrl = buildRssFeedUrl(userId);
      console.log("[RSS] RSS Feed URL:", rssUrl);

      try {
        await navigator.clipboard.writeText(rssUrl);
        btn.el.innerHTML = ICONS.check;
      } catch (err) {
        console.error("[RSS] Failed to copy to clipboard:", err);
        btn.el.innerHTML = ICONS.error;
      }

      setTimeout(() => {
        btn.el.innerHTML = ICONS.rss;
      }, 2000);
    };

    btn.attach();
    console.log("[RSS] Button attached");
  }

  // ===================
  // Initialization
  // ===================

  load("init");
  hook(history, "pushState", () => load("pushState"), "after");
  window.addEventListener("popstate", () => load("popstate"));
})();

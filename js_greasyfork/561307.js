// ==UserScript==
// @name         TOMT - Flair Tools Button (old reddit mod log)
// @namespace    nevv-flair-tools
// @version      1.1
// @description  Adds a small button next to usernames in old reddit mod log to open Arctic Shift + flair editor tabs.
// @match        https://old.reddit.com/r/*/about/log*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/561307/TOMT%20-%20Flair%20Tools%20Button%20%28old%20reddit%20mod%20log%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561307/TOMT%20-%20Flair%20Tools%20Button%20%28old%20reddit%20mod%20log%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEFAULT_SUBREDDIT = "tipofmytongue";

  function detectSubreddit() {
    const m = location.pathname.match(/^\/r\/([^/]+)\//i);
    return m ? m[1] : DEFAULT_SUBREDDIT;
  }

  function cleanUsername(raw) {
    if (!raw) return null;
    let u = raw.trim().replace(/^u\//i, "");
    u = u.replace(/[)\],.!?;:"'`]+$/g, "");
    u = u.replace(/[^A-Za-z0-9_-]/g, "");
    return u || null;
  }

  function openTools(sub, user) {
    const encU = encodeURIComponent(user);
    const encS = encodeURIComponent(sub);
    const urls = [
      `https://old.reddit.com/r/${encS}/about/flair/?name=${encU}`,
      `https://arctic-shift.photon-reddit.com/api/users/aggregate_flairs?author=${encU}`
    ];
    urls.forEach((url) => GM_openInTab(url, { active: false, insert: true, setParent: true }));
  }

  function makeButton(sub, user) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "2 tabs";
    btn.title = `Open tools for u/${user}`;
    btn.style.marginLeft = "6px";
    btn.style.padding = "0px 6px";
    btn.style.fontSize = "11px";
    btn.style.lineHeight = "16px";
    btn.style.border = "1px solid #bbb";
    btn.style.borderRadius = "10px";
    btn.style.background = "#f5f5f5";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openTools(sub, user);
    });
    return btn;
  }

  function extractUsernameFromHref(href) {
    if (!href) return null;

    // Handle relative: /user/Name or /u/Name
    let m = href.match(/^\/(?:user|u)\/([^\/?#]+)/i);
    if (m) return cleanUsername(m[1]);

    // Handle absolute: https://old.reddit.com/user/Name or https://www.reddit.com/user/Name
    m = href.match(/^https?:\/\/(?:old\.reddit\.com|www\.reddit\.com|reddit\.com)\/(?:user|u)\/([^\/?#]+)/i);
    if (m) return cleanUsername(m[1]);

    return null;
  }

  function addButtons() {
    const sub = detectSubreddit();

    // Match both relative and absolute user links
    const userLinks = Array.from(document.querySelectorAll(
      'a[href*="/user/"], a[href*="/u/"]'
    ));

    userLinks.forEach((a) => {
      if (a.dataset.flairToolsButtonAdded === "1") return;

      const href = a.getAttribute("href") || "";
      const user = extractUsernameFromHref(href);
      if (!user) return;

      a.dataset.flairToolsButtonAdded = "1";
      a.insertAdjacentElement("afterend", makeButton(sub, user));
    });
  }

  addButtons();

  const intervalId = setInterval(addButtons, 1000);
  setTimeout(() => clearInterval(intervalId), 60000);
})();
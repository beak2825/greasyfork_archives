// ==UserScript==
// @name         YouTube Comments Sidebar (Toggle, 2025)
// @namespace    yt-comments-sidebar
// @version      1.3
// @description  Show comments in the right sidebar with a Comments/Recommended toggle on YouTube watch pages.
// @match        https://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548856/YouTube%20Comments%20Sidebar%20%28Toggle%2C%202025%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548856/YouTube%20Comments%20Sidebar%20%28Toggle%2C%202025%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const IS_WATCH = () => location.pathname === "/watch" && /[?&]v=/.test(location.search);
  const QS = sel => document.querySelector(sel);

  const SELECTORS = {
    flexy: "ytd-watch-flexy",
    secondary: "ytd-watch-flexy #secondary",
    comments: "ytd-watch-flexy ytd-comments#comments, ytd-watch-flexy #comments",
  };

  const STYLE_ID = "tm-ycs-styles";
  const WRAP_ID = "tm-ycs-wrap";
  const TABS_ID = "tm-ycs-tabs";
  const UP_NEXT_ID = "tm-ycs-upnext";
  const COMMENTS_WRAP_ID = "tm-ycs-comments";

  function injectStyles() {
    if (QS(`#${STYLE_ID}`)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = `
      #${TABS_ID} {
        display:flex; gap:.5rem; align-items:center;
        position:sticky; top:56px; z-index:5;
        padding:.5rem .75rem; border-bottom:1px solid rgba(255,255,255,.08);
        background: rgba(18,18,18,.98);
        backdrop-filter: saturate(120%) blur(6px);
      }
      #${TABS_ID} button{
        font: 500 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial;
        padding:.4rem .7rem; border-radius:999px; border:1px solid transparent; cursor:pointer;
        background:#272727; color:#eee;
      }
      #${TABS_ID} button.active{ background:#3a3a3a; border-color:#4a4a4a; }
      #${COMMENTS_WRAP_ID}, #${UP_NEXT_ID} {
        max-height: calc(100vh - 56px - 44px); /* header + tabs */
        overflow-y: auto; overflow-x: hidden;
      }
      /* Make comments readable in the narrow column */
      #${COMMENTS_WRAP_ID} #content { max-width: 100% !important; }
    `;
    document.documentElement.appendChild(s);
  }

  function waitFor(selector, { timeout = 15000, root = document } = {}) {
    return new Promise((resolve, reject) => {
      const found = root.querySelector(selector);
      if (found) return resolve(found);

      const obs = new MutationObserver(() => {
        const el = root.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(root, { childList: true, subtree: true });

      setTimeout(() => {
        obs.disconnect();
        reject(new Error("Timeout waiting for " + selector));
      }, timeout);
    });
  }

  function buildTabs() {
    const tabs = document.createElement("div");
    tabs.id = TABS_ID;

    const btnComments = document.createElement("button");
    btnComments.textContent = "Comments";
    btnComments.dataset.target = COMMENTS_WRAP_ID;

    const btnUpNext = document.createElement("button");
    btnUpNext.textContent = "Recommended";
    btnUpNext.dataset.target = UP_NEXT_ID;

    tabs.append(btnComments, btnUpNext);

    function activate(targetId) {
      const commentsWrap = QS(`#${COMMENTS_WRAP_ID}`);
      const upnextWrap = QS(`#${UP_NEXT_ID}`);
      if (!commentsWrap || !upnextWrap) return;

      const buttons = tabs.querySelectorAll("button");
      buttons.forEach(b => b.classList.toggle("active", b.dataset.target === targetId));

      commentsWrap.style.display = (targetId === COMMENTS_WRAP_ID) ? "" : "none";
      upnextWrap.style.display     = (targetId === UP_NEXT_ID)     ? "" : "none";
    }

    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      activate(b.dataset.target);
    });

    // default to Comments first
    queueMicrotask(() => activate(COMMENTS_WRAP_ID));
    return tabs;
  }

  function wrapSecondary(secondary) {
    if (QS(`#${WRAP_ID}`)) return; // already wrapped

    // Move existing children into our UpNext wrapper
    const upNext = document.createElement("div");
    upNext.id = UP_NEXT_ID;

    const frag = document.createDocumentFragment();
    while (secondary.firstChild) frag.appendChild(secondary.firstChild);
    upNext.appendChild(frag);

    const commentsWrap = document.createElement("div");
    commentsWrap.id = COMMENTS_WRAP_ID;

    const container = document.createElement("div");
    container.id = WRAP_ID;

    const tabs = buildTabs();
    container.append(tabs, commentsWrap, upNext);
    secondary.appendChild(container);
  }

  function moveCommentsIntoSidebar() {
    const comments = QS(SELECTORS.comments);
    const slot = QS(`#${COMMENTS_WRAP_ID}`);
    if (!comments || !slot) return false;

    // Only move once
    if (!slot.contains(comments)) {
      slot.appendChild(comments);
    }
    return true;
  }

  function primeCommentsLoad() {
    // If YouTube hasn’t hydrated comments yet, nudge it by briefly scrolling
    // the original position into view (if it exists in DOM).
    const original = QS(SELECTORS.comments);
    if (original) {
      original.scrollIntoView({ block: "center" });
    }
  }

  async function initOnce() {
    if (!IS_WATCH()) return;

    injectStyles();

    const flexy = await waitFor(SELECTORS.flexy).catch(() => null);
    if (!flexy) return;

    const secondary = await waitFor(SELECTORS.secondary, { root: flexy }).catch(() => null);
    if (!secondary) return;

    wrapSecondary(secondary);
    primeCommentsLoad();

    // Keep trying to capture comments as soon as they appear
    let tries = 0;
    const maxTries = 40;
    const interval = setInterval(() => {
      const ok = moveCommentsIntoSidebar();
      tries++;
      if (ok || tries >= maxTries) clearInterval(interval);
    }, 500);
  }

  // Handle SPA navigation and first load
  const boot = () => {
    if (!IS_WATCH()) return;
    initOnce().catch(() => {});
  };

  // YouTube fires this on in-page navigation
  window.addEventListener("yt-navigate-finish", boot);
  // Also run after full load
  window.addEventListener("load", boot);
  // And if URL changes without event (edge cases)
  let lastHref = location.href;
  new MutationObserver(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
      boot();
    }
  }).observe(document, { childList: true, subtree: true });
})();

// ==UserScript==
// @name        Youtube transcript copy
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch?v=*
// @grant       none
// @run-at      document-idle
// @version     1.0.0
// @author      Sue Smith MD
// @license     AGPL-3.0; https://www.gnu.org/licenses/agpl-3.0.html#license-text
// @description 9/10/2025, 8:56:08 PM
// @downloadURL https://update.greasyfork.org/scripts/549096/Youtube%20transcript%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/549096/Youtube%20transcript%20copy.meta.js
// ==/UserScript==

// src/youtube/copy-ytb-transcript.ts
var TRANSCRIPT_REGEX = /transcript/i;
(() => {
  const BUTTON_ID = "yt-transcript-copier";
  const STYLE_ID = "yt-transcript-copier-styles";
  const MAX_INSERT_ATTEMPTS = 30;
  const INSERT_INTERVAL_MS = 500;
  const WHITESPACE_REGEX = /\s+/g;
  const YT_BTN_CLASS = [
    "yt-spec-button-shape-next",
    "yt-spec-button-shape-next--tonal",
    "yt-spec-button-shape-next--mono",
    "yt-spec-button-shape-next--size-m",
    "yt-spec-button-shape-next--icon-leading"
  ].join(" ");
  let currentURL = location.href;
  let insertAttempts = 0;
  let insertTimer = null;
  let copyButton = null;
  let isCopyRunning = false;
  function isWatchPage() {
    return location.pathname === "/watch";
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  function runAsync(fn) {
    fn().catch((err) => {
      console.error("YT Transcript Copier async error:", err);
    });
  }
  function clearInsertTimer() {
    if (!insertTimer) {
      return;
    }
    clearInterval(insertTimer);
    insertTimer = null;
  }
  async function waitFor(selector, timeoutMs = 1e4, intervalMs = 150) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const el = document.querySelector(selector);
      if (el) {
        return el;
      }
      await sleep(intervalMs);
    }
    return null;
  }
  function createSvgPath(d) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.classList.add("yt-tc-icon");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("d", d);
    svg.appendChild(path);
    return svg;
  }
  function createClipboardIcon() {
    return createSvgPath("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2");
  }
  function createCheckIcon() {
    return createSvgPath("M20 6L9 17l-5-5");
  }
  function createSpinnerIcon() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.classList.add("yt-tc-icon", "yt-tc-spinner");
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", "12");
    circle.setAttribute("cy", "12");
    circle.setAttribute("r", "10");
    circle.setAttribute("stroke", "currentColor");
    circle.setAttribute("stroke-width", "3");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke-dasharray", "60");
    circle.setAttribute("stroke-dashoffset", "15");
    svg.appendChild(circle);
    return svg;
  }
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
#${BUTTON_ID} { margin: 8px 8px 8px 0; }

#${BUTTON_ID} .yt-tc-icon {
  margin-right: 8px;
  flex-shrink: 0;
}

#${BUTTON_ID} .yt-tc-spinner { animation: ytTcSpin 1s linear infinite; }

@keyframes ytTcSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

#${BUTTON_ID}[data-state="success"] {
  color: var(--yt-spec-call-to-action, currentColor);
}

#${BUTTON_ID}[data-state="error"] {
  color: var(--yt-spec-text-primary, currentColor);
}

#${BUTTON_ID}:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--yt-spec-10-percent-layer, rgba(62, 166, 255, 0.35));
}
`;
    document.head.appendChild(style);
  }
  function createButton() {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.className = YT_BTN_CLASS;
    btn.type = "button";
    btn.setAttribute("aria-label", "Copy transcript");
    btn.setAttribute("title", "Copy transcript");
    btn.dataset.state = "default";
    const label = document.createElement("span");
    label.textContent = "Transcript";
    btn.appendChild(createClipboardIcon());
    btn.appendChild(label);
    btn.addEventListener("click", () => runAsync(handleCopyClick));
    return btn;
  }
  function getStateIcon(state) {
    if (state === "loading") {
      return createSpinnerIcon();
    }
    if (state === "success") {
      return createCheckIcon();
    }
    return createClipboardIcon();
  }
  function setButtonState(state, text) {
    if (!copyButton) {
      return;
    }
    copyButton.dataset.state = state;
    const existingIcon = copyButton.querySelector("svg");
    if (existingIcon) {
      existingIcon.remove();
    }
    copyButton.disabled = state === "loading";
    copyButton.insertBefore(getStateIcon(state), copyButton.firstChild);
    const label = copyButton.querySelector("span") ?? document.createElement("span");
    label.textContent = text;
    if (!copyButton.querySelector("span")) {
      copyButton.appendChild(label);
    }
  }
  function insertButtonIfPossible() {
    if (!isWatchPage()) {
      return false;
    }
    const existing = document.getElementById(BUTTON_ID);
    if (existing) {
      return true;
    }
    const titleDiv = document.querySelector("div#title.style-scope.ytd-watch-metadata");
    if (!titleDiv?.parentNode) {
      return false;
    }
    const btn = createButton();
    titleDiv.parentNode.insertBefore(btn, titleDiv);
    copyButton = btn;
    injectStyles();
    return true;
  }
  function startInsertLoop() {
    clearInsertTimer();
    insertAttempts = 0;
    insertTimer = setInterval(() => {
      insertAttempts += 1;
      const ok = insertButtonIfPossible();
      if (ok) {
        clearInsertTimer();
        return;
      }
      const isExhausted = insertAttempts >= MAX_INSERT_ATTEMPTS;
      if (isExhausted) {
        clearInsertTimer();
        return;
      }
    }, INSERT_INTERVAL_MS);
  }
  function resetPageState() {
    document.getElementById(BUTTON_ID)?.remove();
    clearInsertTimer();
    insertAttempts = 0;
    copyButton = null;
    isCopyRunning = false;
  }
  function findMoreActionsButton() {
    const structural = document.querySelector("ytd-watch-metadata ytd-menu-renderer yt-icon-button#button button");
    if (structural) {
      return structural;
    }
    const aria = document.querySelector('button[aria-label="More actions"]');
    if (aria) {
      return aria;
    }
    return null;
  }
  function findMenuItemByText() {
    const items = Array.from(document.querySelectorAll("ytd-menu-service-item-renderer tp-yt-paper-item, ytd-menu-service-item-renderer"));
    for (const el of items) {
      const text = (el.textContent ?? "").replace(WHITESPACE_REGEX, " ").trim();
      if (!text) {
        continue;
      }
      if (TRANSCRIPT_REGEX.test(text)) {
        return el;
      }
    }
    return null;
  }
  function findShowTranscriptItem() {
    const exact = document.querySelector('[aria-label="Show transcript"]');
    if (exact) {
      return exact;
    }
    const contains = document.querySelector('[aria-label*="transcript" i]');
    if (contains) {
      return contains;
    }
    return findMenuItemByText();
  }
  async function handleCopyClick() {
    if (isCopyRunning) {
      return;
    }
    if (!copyButton) {
      return;
    }
    isCopyRunning = true;
    setButtonState("loading", "Loading…");
    try {
      const more = findMoreActionsButton();
      if (!more) {
        throw new Error("More actions button not found");
      }
      more.click();
      await sleep(300);
      const transcript = findShowTranscriptItem();
      if (!transcript) {
        throw new Error("Transcript button not found");
      }
      transcript.click();
      const panel = await waitFor('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"] #content', 15000, 200);
      if (!panel) {
        throw new Error("Transcript panel not found");
      }
      const start = Date.now();
      const timeoutMs = 15000;
      while (Date.now() - start < timeoutMs) {
        const segments2 = panel.querySelectorAll(".segment-text");
        if (segments2.length === 0) {
          await sleep(200);
          continue;
        }
        await sleep(450);
        break;
      }
      const segments = Array.from(panel.querySelectorAll(".segment-text"));
      const parts = segments.map((s) => (s.textContent ?? "").trim()).filter((s) => s.length > 0);
      const text = parts.join(" ");
      if (!text) {
        throw new Error("No transcript text found");
      }
      await navigator.clipboard.writeText(text);
      setButtonState("success", "Copied");
      setTimeout(() => setButtonState("default", "Transcript"), 1600);
      return;
    } catch (err) {
      console.error("Transcript copy error:", err);
      setButtonState("error", "Not available");
      setTimeout(() => setButtonState("default", "Transcript"), 2400);
      return;
    } finally {
      isCopyRunning = false;
    }
  }
  function handleUrlChange() {
    const next = location.href;
    if (!next) {
      return;
    }
    if (next === currentURL) {
      return;
    }
    currentURL = next;
    resetPageState();
    if (!isWatchPage()) {
      return;
    }
    setTimeout(() => {
      if (!insertButtonIfPossible()) {
        startInsertLoop();
      }
    }, 200);
  }
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  history.pushState = (...args) => {
    originalPushState.apply(history, args);
    setTimeout(handleUrlChange, 60);
  };
  history.replaceState = (...args) => {
    originalReplaceState.apply(history, args);
    setTimeout(handleUrlChange, 60);
  };
  window.addEventListener("popstate", handleUrlChange);
  window.addEventListener("yt-navigate-finish", handleUrlChange);
  window.addEventListener("yt-page-data-updated", handleUrlChange);
  if (!isWatchPage()) {
    resetPageState();
    return;
  }
  if (insertButtonIfPossible()) {
    return;
  }
  startInsertLoop();
})();
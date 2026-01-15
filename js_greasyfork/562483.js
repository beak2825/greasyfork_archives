// ==UserScript==
// @name         ChatGPT: Jump between my messages  
// @namespace    http://doi.ac
// @version      1.0.1
// @description  Alt+Up/Down jumps between your (user) messages in a ChatGPT conversation (with debug logs).
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/562483/ChatGPT%3A%20Jump%20between%20my%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/562483/ChatGPT%3A%20Jump%20between%20my%20messages.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const ROLE_SELECTOR = '[data-message-author-role="user"]';

  console.log("[ChatGPT Jump] Script injected");

  function isTypingContext(el) {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    if (tag === "textarea" || tag === "input") return true;
    if (el.isContentEditable) return true;

    let n = el;
    for (let i = 0; i < 6 && n; i++, n = n.parentElement) {
      if (n.isContentEditable) return true;
    }
    return false;
  }

  function getUserMessages() {
    const msgs = Array.from(document.querySelectorAll(ROLE_SELECTOR));
    console.log(`[ChatGPT Jump] Found ${msgs.length} user messages`);
    return msgs;
  }

  function nearestIndex(messages) {
    if (!messages.length) return -1;

    const y = 8;
    let bestIdx = 0;
    let bestScore = Infinity;

    for (let i = 0; i < messages.length; i++) {
      const r = messages[i].getBoundingClientRect();
      const score = Math.abs(r.top - y);
      if (score < bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    console.log("[ChatGPT Jump] Nearest index:", bestIdx);
    return bestIdx;
  }

  function scrollToMessage(el, idx) {
    if (!el) return;

    console.log("[ChatGPT Jump] Scrolling to message index:", idx);

    el.scrollIntoView({ behavior: "smooth", block: "start" });

    el.animate(
      [
        { outline: "2px solid rgba(255,200,0,0)", outlineOffset: "6px" },
        { outline: "2px solid rgba(255,200,0,0.9)", outlineOffset: "6px" },
        { outline: "2px solid rgba(255,200,0,0)", outlineOffset: "6px" }
      ],
      { duration: 650, easing: "ease-out" }
    );
  }

  function jump(delta) {
    console.log("[ChatGPT Jump] jump()", delta);

    const msgs = getUserMessages();
    if (!msgs.length) {
      console.log("[ChatGPT Jump] No messages found");
      return;
    }

    const idx = nearestIndex(msgs);
    if (idx < 0) return;

    const next = Math.min(msgs.length - 1, Math.max(0, idx + delta));
    console.log("[ChatGPT Jump] Moving from", idx, "to", next);

    scrollToMessage(msgs[next], next);
  }

  function jumpToEnd(which) {
    console.log("[ChatGPT Jump] jumpToEnd()", which);

    const msgs = getUserMessages();
    if (!msgs.length) return;

    const idx = which === "first" ? 0 : msgs.length - 1;
    scrollToMessage(msgs[idx], idx);
  }

  window.addEventListener(
    "keydown",
    (e) => {
      if (isTypingContext(document.activeElement)) {
        console.log("[ChatGPT Jump] Typing context – ignoring");
        return;
      }

      if (!e.altKey || e.ctrlKey || e.metaKey) return;

      console.log("[ChatGPT Jump] Key pressed:", e.key);

      if (e.key === "ArrowUp") {
        e.preventDefault();
        jump(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        jump(+1);
      } else if (e.key === "Home") {
        e.preventDefault();
        jumpToEnd("first");
      } else if (e.key === "End") {
        e.preventDefault();
        jumpToEnd("last");
      }
    },
    { capture: true }
  );

  console.log("[ChatGPT Jump] Ready. Try Alt+Up / Alt+Down");
})();

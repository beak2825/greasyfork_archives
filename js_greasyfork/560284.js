// ==UserScript==
// @name        Primewire Chat YouTube Title Linkifier
// @namespace   Chat_link_mod
// @description  Swaps raw youtube links to their titled version.
// @version     4.1
// @license MIT
// @match       https://www.primewire.mov/*
// @match       https://www.primewire.tf/*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/560284/Primewire%20Chat%20YouTube%20Title%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/560284/Primewire%20Chat%20YouTube%20Title%20Linkifier.meta.js
// ==/UserScript==

(function () {
  // --- tiny style addition ---
  const style = document.createElement("style");
  style.textContent = `
    a[href*="youtube.com"], a[href*="youtu.be"] {
      color: #2ecc71 !important;
    }`;
  document.head.appendChild(style);
  // --- end of style addition ---

  const ytPattern = /https?:\/\/(?:www\.)?youtu(?:be\.com\/(?:watch\?(?:.*&)?v=|shorts\/)|\.be\/)([\w-]{11})/i;
  const cacheKeyPrefix = "ytTitleCache_";
  const maxAge = 2 * 60 * 60 * 1000; // 2 hours

  function getCachedTitle(id) {
    try {
      const j = localStorage.getItem(cacheKeyPrefix + id);
      if (!j) return null;
      const data = JSON.parse(j);
      if (Date.now() - data.time > maxAge) return null;
      return data.title;
    } catch {
      return null;
    }
  }

  function storeTitle(id, title) {
    localStorage.setItem(
      cacheKeyPrefix + id,
      JSON.stringify({ title, time: Date.now() })
    );
  }

  function fetchTitle(id, callback) {
    const url = "https://www.youtube.com/watch?v=" + id;
    GM_xmlhttpRequest({
      method: "GET",
      url,
      headers: { Range: "bytes=0-30000" },
      onload: (resp) => {
        const m = resp.responseText.match(/<title[^>]*>(.*?)<\/title>/i);
        if (m) {
          const t = m[1].replace(/\s*-\s*YouTube$/i, "").trim();
          storeTitle(id, t);
          callback(t);
        }
      },
    });
  }

  function processLink(a) {
    const href = a.href;
    const m = ytPattern.exec(href);
    if (!m) return;
    const id = m[1];
    if (a.textContent !== href) return; // already replaced
    const cached = getCachedTitle(id);
    if (cached) {
      a.textContent = cached;
    } else {
      fetchTitle(id, (title) => {
        if (a && a.textContent === href) a.textContent = title;
      });
    }
  }

  function processMessage(div) {
    if (!div || div.dataset.linkified) return;
    div.querySelectorAll("a[href]").forEach((a) => processLink(a));
    div.dataset.linkified = "true";
  }

  function scanAll() {
    document
      .querySelectorAll("div.chat-message")
      .forEach((div) => processMessage(div));
  }

  const chatContainer =
    document.querySelector(".chat-container") || document.body;

  scanAll();

  const obs = new MutationObserver(() => scanAll());
  obs.observe(chatContainer, { childList: true, subtree: true });

  setInterval(scanAll, 5000);
})();

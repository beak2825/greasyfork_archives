// ==UserScript==
// @name         Gemini DeepResearch Auto Extract Links
// @name:zh-CN   Gemini DeepResearch自动提取链接
// @namespace    https://gemini.google.com/
// @version      1.0.2
// @description  Extract all links from Gemini Deep Research result into a clean list (one per line). Suitable for importing into NotebookLM.
// @description:zh-CN 从 Gemini 深度研究结果中提取所有链接，每行一个，方便导入 NotebookLM。
// @match        https://gemini.google.com/*
// @grant        GM_setClipboard
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557798/Gemini%20DeepResearch%20Auto%20Extract%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/557798/Gemini%20DeepResearch%20Auto%20Extract%20Links.meta.js
// ==/UserScript==

(function () {
  // Extract all links inside browse-web-item elements
  function extractLinks() {
    const aTags = [...document.querySelectorAll('browse-web-item a')];
    if (aTags.length === 0) {
      alert("No browse-web-item links found.");
      return;
    }

    const links = aTags.map(a => a.href).join("\n");

    // Copy to clipboard
    if (typeof GM_setClipboard === "function") {
      GM_setClipboard(links);
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(links).catch(err => console.error(err));
    }

    console.log("Extracted links:\n" + links);
    alert(`Copied ${aTags.length} links to clipboard.`);
  }

  // Insert Extract button into the Gemini toolbar
  function addButtonIfNeeded() {
    const actionButtons = document.querySelector(".toolbar.has-title .action-buttons");
    if (!actionButtons) return;

    // Prevent duplicate buttons
    if (actionButtons.querySelector(".extract-links-button")) return;

    const btn = document.createElement("button");
    btn.textContent = "Extract Links";
    btn.className =
      "mdc-button mat-mdc-button-base mat-mdc-unelevated-button extract-links-button";
    btn.style.marginLeft = "8px";

    btn.addEventListener("click", extractLinks);

    actionButtons.insertBefore(btn, actionButtons.firstChild);
  }

  // Run once on load
  addButtonIfNeeded();

  // Observe DOM since Gemini loads UI dynamically
  const observer = new MutationObserver(() => {
    addButtonIfNeeded();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();

// ==UserScript==
// @name Genius Lyrics Copy
// @name:ja Genius Lyrics Copy
// @description Add a lyrics copy button to Genius
// @description:ja Geniusに歌詞コピーボタンを追加します
// @author Yos_sy
 // @match *://genius.com/*
// @namespace http://tampermonkey.net/
// @icon https://github.com/yossy17/genius-lyrics-copy/raw/master/images/icons/icon-128.webp
// @license MIT
 // @version 1.0.0
 // @supportURL https://github.com/yossy17/genius-lyrics-copy
// @downloadURL https://update.greasyfork.org/scripts/549204/Genius%20Lyrics%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/549204/Genius%20Lyrics%20Copy.meta.js
 // ==/UserScript==

(function() {
  "use strict";
  function extractLyricsText() {
    const nodeList = document.querySelectorAll(
      'div[class^="Lyrics__Container"] > p, div[class^="Lyrics__Container"] p'
    );
    if (!nodeList.length) return "";
    return Array.from(nodeList).map((p) => p.innerText.trim()).filter(Boolean).join("\n\n");
  }
  const toastMessages = {
    copied: "Copied!",
    nothing: "Can't copy..."
  };
  let currentToast = null;
  function showToast(msg) {
    if (currentToast) {
      currentToast.remove();
      currentToast = null;
    }
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
    position: fixed;
    top: 50%;
    right: 50%;
    padding: 8px 16px;
    background: rgb(255, 255, 100, 0.75);
    color: #000000;
    box-shadow: rgba(0, 0, 0, 0.6) 3px 3px 8px 0px;
    border-radius: 8px;
    backdrop-filter: blur(10px) saturate(180%);
    z-index: calc(infinity);
    user-select: none;
    font-size: 16px;
    font-weight: bold;
  `;
    document.body.appendChild(toast);
    currentToast = toast;
    setTimeout(() => {
      setTimeout(() => {
        toast.remove();
        if (currentToast === toast) {
          currentToast = null;
        }
      }, 200);
    }, 2e3);
  }
  function copyLyrics() {
    var _a;
    const text = extractLyricsText();
    if (!text) {
      showToast(toastMessages.nothing);
      return;
    }
    try {
      GM_setClipboard(text);
      showToast(toastMessages.copied);
    } catch {
      (_a = navigator.clipboard) == null ? void 0 : _a.writeText(text).then(() => {
        showToast(toastMessages.copied);
      });
    }
  }
  function addCopyButton() {
    const toolbar = document.querySelector(
      'div[class*="PageGrid-desktop"][class*="StickyContributorToolbar__Container"]'
    );
    if (!toolbar || toolbar.querySelector(".genius-lyrics-copy-button")) return;
    const copyButton = document.createElement("button");
    copyButton.className = "genius-lyrics-copy-button";
    copyButton.style.cssText = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: #000;
    background: #ffff64;
    box-shadow: rgba(0, 0, 0, 0.6) 3px 3px 8px 0px;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.3s;
    user-select: none;
  `;
    copyButton.addEventListener("mouseenter", () => {
      copyButton.style.color = "#ffff64";
      copyButton.style.backgroundColor = "#000";
      copyButton.style.transform = "translate(2px, 2px)";
      copyButton.style.boxShadow = "rgba(0, 0, 0, 0.6) 5px 5px 8px 0px";
    });
    copyButton.addEventListener("mouseleave", () => {
      copyButton.style.color = "#000";
      copyButton.style.backgroundColor = "#ffff64";
      copyButton.style.transform = "translate(0)";
      copyButton.style.boxShadow = "rgba(0, 0, 0, 0.6) 3px 3px 8px 0px";
    });
    copyButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 115.77 122.88"
         width="20" height="20" fill="currentColor">
      <path d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1
      c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02v73.27v0.01h-0.02c-0.01,3.84-1.57,
      7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02
      c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02
      V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98
      -4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86
      c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7h0.01v0.02c3.85,0.01,7.34,1.57,
      9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,
      21.69v-7.73v-0.02h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1
      v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01c-0.61,0.61-1,1.46
      -1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37
      c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65v-0.01h0.02c0.01-3.85,
      1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,
      21.69z M105.18,108.92V35.65v-0.02h0.02c0-0.91-0.39-1.75-1.01-2.37
      c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39
      -2.37,1.01c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,
      0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02v0.02
      c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,
      108.92z"/>
    </svg>
  `;
    copyButton.addEventListener("click", copyLyrics);
    toolbar.insertBefore(copyButton, toolbar.children[1] || null);
  }
  function setupObserver() {
    const observer = new MutationObserver(() => {
      addCopyButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    addCopyButton();
  }
  (function() {
    setupObserver();
  })();
})();
//# sourceMappingURL=userscript.user.js.map

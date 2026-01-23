// ==UserScript==
// @name         ChatGPT: remove horizontal scrollbar (Firefox)
// @namespace    https://mekineer.com
// @author       mekineer and Nova (ChatGPT 5.2 Thinking)
// @license      GPL-3.0-or-later
// @version      1.0
// @description  ChatGPT and Firefox don't get along, adding an unnecessary horizontal scrollbar to the page
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563629/ChatGPT%3A%20remove%20horizontal%20scrollbar%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563629/ChatGPT%3A%20remove%20horizontal%20scrollbar%20%28Firefox%29.meta.js
// ==/UserScript==

(() => {
  // Prefer overflow-x: clip (no scrollbar, and also blocks programmatic scrolling)
  // Fallback to hidden if clip isn't supported.
  const overflowX = (window.CSS && CSS.supports && CSS.supports("overflow-x: clip"))
    ? "clip"
    : "hidden";

  const css = `
    html, body {
      overflow-x: ${overflowX} !important;
      max-width: 100% !important;
    }
    /* ChatGPT app root */
    #__next, main {
      overflow-x: ${overflowX} !important;
      max-width: 100% !important;
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.documentElement.appendChild(style);

  // Re-assert after early hydration/layout shifts
  const reapply = () => {
    document.documentElement.style.overflowX = overflowX;
    if (document.body) document.body.style.overflowX = overflowX;
  };
  window.addEventListener("DOMContentLoaded", reapply, { once: true });
  window.addEventListener("load", reapply, { once: true });
})();

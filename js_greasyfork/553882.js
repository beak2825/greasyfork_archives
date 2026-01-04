// ==UserScript==
// @name         YouTube Metallic Subscribe Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a metallic red gradient to the Subscribe button when not subscribed, with pulse on hover and shift on press
// @author       Ricky + Copilot
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553882/YouTube%20Metallic%20Subscribe%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/553882/YouTube%20Metallic%20Subscribe%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulseRed {
      0% {
        box-shadow: 0 0 5px rgba(255, 99, 71, 0.6), inset 0 0 10px rgba(139, 0, 0, 0.5);
      }
      50% {
        box-shadow: 0 0 10px rgba(255, 99, 71, 0.9), inset 0 0 15px rgba(139, 0, 0, 0.7);
      }
      100% {
        box-shadow: 0 0 5px rgba(255, 99, 71, 0.6), inset 0 0 10px rgba(139, 0, 0, 0.5);
      }
    }

    .metallic-subscribe {
      background: linear-gradient(135deg, #8B0000, #FF6347) !important;
      color: white !important;
      font-weight: bold !important;
      text-transform: uppercase !important;
      border: none !important;
      animation: pulseRed 2s infinite;
      transition: transform 0.2s ease, box-shadow 0.3s ease !important;
    }

    .metallic-subscribe:hover {
      animation: pulseRed 1s infinite;
      cursor: pointer !important;
    }

    .metallic-subscribe:active {
      background: linear-gradient(135deg, #FF6347, #8B0000) !important;
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(style);

  const applyStyle = () => {
    const buttons = document.querySelectorAll('ytd-subscribe-button-renderer:not([subscribed]) yt-button-shape button');

    buttons.forEach(btn => {
      if (!btn.classList.contains('metallic-subscribe')) {
        btn.classList.add('metallic-subscribe');
      }
    });
  };

  // Observe for dynamic page changes
  const observer = new MutationObserver(() => {
    applyStyle();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run
  applyStyle();
})();

// ==UserScript==
// @name         Acesse uma web mais limpa!
// @namespace    Acesse uma web mais limpa!
// @version      1.1
// @description  Remova popups, banners, e ads de qualquer website.Um oferecimento da #bolhatech e #bolhasec Bluesky/Twitter ♥.
// @match        *://*/*
// @exclude      *://sempaywall.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559968/Acesse%20uma%20web%20mais%20limpa%21.user.js
// @updateURL https://update.greasyfork.org/scripts/559968/Acesse%20uma%20web%20mais%20limpa%21.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (document.getElementById('sempaywall-float')) return;

  // botão
  const btn = document.createElement('div');
  btn.id = 'sempaywall-float';
  btn.innerHTML = `
    <span class="spw-icon">∞</span>
    <span class="spw-text">SemPaywall</span>
  `;

  // estilo futurista
  const style = document.createElement('style');
  style.textContent = `
    #sempaywall-float {
      position: fixed;
      bottom: 28px;
      left: 28px;
      z-index: 999999;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 18px;
      font-family: "Segoe UI", system-ui, sans-serif;
      font-size: 14px;
      letter-spacing: 0.4px;
      color: #eaf6ff;
      cursor: pointer;

      background: linear-gradient(
        135deg,
        rgba(20, 20, 30, 0.85),
        rgba(10, 10, 20, 0.65)
      );

      border: 1px solid rgba(120, 180, 255, 0.35);
      border-radius: 14px;

      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);

      box-shadow:
        0 0 18px rgba(120, 180, 255, 0.25),
        inset 0 0 12px rgba(120, 180, 255, 0.15);

      transition: all 0.25s ease;
    }

    #sempaywall-float:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow:
        0 0 28px rgba(120, 180, 255, 0.55),
        inset 0 0 18px rgba(120, 180, 255, 0.25);
      border-color: rgba(150, 210, 255, 0.7);
    }

    #sempaywall-float:active {
      transform: scale(0.97);
    }

    #sempaywall-float .spw-icon {
      font-size: 18px;
      color: #9fd4ff;
      text-shadow: 0 0 8px rgba(120, 180, 255, 0.9);
    }

    #sempaywall-float .spw-text {
      white-space: nowrap;
      opacity: 0.95;
    }
  `;
  document.head.appendChild(style);

  // clique
  btn.addEventListener('click', () => {
    const url = encodeURIComponent(window.location.href);
    window.location.href = `https://sem-paywall.com/api/clean/${url}`;
  });

  document.body.appendChild(btn);
})();

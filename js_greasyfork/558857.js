// ==UserScript==
// @name         soundcloud, soul theme!
// @namespace    soulsecret.soundcloud
// @version      1.3
// @description  thingy for my e-kitten SOUL SECRETTT!
// @match        https://soundcloud.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558857/soundcloud%2C%20soul%20theme%21.user.js
// @updateURL https://update.greasyfork.org/scripts/558857/soundcloud%2C%20soul%20theme%21.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- SOUL SECRET POPUP NOTICE ---
  function showSoulSecretNotice() {
    if (document.getElementById('tm-soulsecret-notice')) return;

    const notice = document.createElement('div');
    notice.id = 'tm-soulsecret-notice';
    notice.textContent = 'Make sure to wait a bit if some stuff isn’t loading, it might take a lil! <3';

    Object.assign(notice.style, {
      position: 'fixed',
      top: '-120px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '900px',
      background: 'linear-gradient(90deg, rgba(120,70,200,0.9), rgba(180,80,255,0.9))',
      color: '#fff',
      fontWeight: '600',
      textAlign: 'center',
      padding: '16px 0',
      zIndex: '999999',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      fontSize: '15px',
      borderRadius: '14px',
      boxShadow: '0 0 25px rgba(180, 80, 255, 0.45), 0 8px 20px rgba(0,0,0,0.6)',
      cursor: 'pointer',
      opacity: '0',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
    });

    document.body.appendChild(notice);

    setTimeout(() => {
      notice.style.top = '20px';
      notice.style.opacity = '1';
    }, 60);

    setTimeout(() => {
      notice.style.opacity = '0';
      notice.style.top = '-120px';
      setTimeout(() => notice.remove(), 900);
    }, 6500);

    notice.addEventListener('click', () => {
      notice.style.opacity = '0';
      notice.style.top = '-120px';
      setTimeout(() => notice.remove(), 900);
    });
  }

  // --- SOUL SECRET BOTTOM TAG ---
  function addSoulSecretTag() {
    if (document.getElementById('soulsecret-tag')) return;

    const tag = document.createElement('div');
    tag.id = 'soulsecret-tag';
    tag.textContent = '@nosleep.wav  •  @kamikaze._._.';

    document.body.appendChild(tag);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      showSoulSecretNotice();
      addSoulSecretTag();
    }, { once: true });
  } else {
    showSoulSecretNotice();
    addSoulSecretTag();
  }

  /* ---------- STYLES ---------- */
  GM_addStyle(`
    /* BASE BACKGROUND IMAGE */
    html, body {
      background: url("https://files.catbox.moe/3jgbag.png") center center / cover fixed no-repeat !important;
      color: #d0d0d0 !important;
    }

    /* GLASS BLUR LAYER */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(10px) saturate(130%);
      -webkit-backdrop-filter: blur(10px) saturate(130%);
      z-index: -1;
    }

    a {
      color: #b46bff !important;
    }

    /* HEADER */
    .header,
    .header__nav,
    .header__inner {
      background: rgba(10, 10, 10, 0.65) !important;
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(255,255,255,0.05) !important;
    }

    /* MAIN CONTAINERS */
    .l-container,
    .l-fluid-fixed,
    .l-fullwidth {
      background: transparent !important;
    }

    /* GLASS CARDS */
    .sound,
    .sound__body,
    .sound__content,
    .commentItem {
      background: rgba(15, 15, 15, 0.55) !important;
      backdrop-filter: blur(6px) saturate(120%);
      border-radius: 12px;
    }

    /* WAVEFORM */
    .waveform__layer path {
      filter: drop-shadow(0 0 6px rgba(180, 80, 255, 0.45));
    }

    /* PLAYER BAR */
    .playControls {
      background: rgba(8, 8, 8, 0.7) !important;
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255,255,255,0.05) !important;
    }

    /* BUTTONS */
    .sc-button,
    .sc-button-primary,
    .sc-button-secondary {
      background: rgba(25, 25, 25, 0.65) !important;
      border: 1px solid rgba(255,255,255,0.08) !important;
      color: #ddd !important;
    }

    .sc-button:hover {
      background: rgba(40, 40, 40, 0.7) !important;
    }

    /* TITLES */
    .soundTitle__title,
    .soundTitle__username {
      text-transform: lowercase;
      letter-spacing: 0.07em;
    }

    /* SIDEBAR */
    .sidebar {
      background: rgba(12, 12, 12, 0.6) !important;
      backdrop-filter: blur(8px);
      border-left: 1px solid rgba(255,255,255,0.05) !important;
    }

    /* HIDE PROMOS */
    [class*="ads"],
    [class*="promoted"],
    .upsellBanner,
    .sidebarModule {
      display: none !important;
    }

    /* SOUL SECRET TAG */
    #soulsecret-tag {
      position: fixed;
      bottom: 48px;
      left: 14px;
      font-family: 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255,255,255,0.85);
      background: rgba(15, 15, 15, 0.55);
      backdrop-filter: blur(8px);
      padding: 8px 14px;
      border-radius: 14px;
      letter-spacing: 0.06em;
      z-index: 999999;
      pointer-events: none;
      box-shadow: 0 0 14px rgba(180, 80, 255, 0.35);
      animation: soulsecret-bounce 2.6s ease-in-out infinite;
    }

    @keyframes soulsecret-bounce {
      0%   { transform: translateY(0); }
      20%  { transform: translateY(-6px); }
      40%  { transform: translateY(0); }
      55%  { transform: translateY(-3px); }
      70%  { transform: translateY(0); }
      100% { transform: translateY(0); }
    }

    /* GRAIN */
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background-image: url("https://i.imgur.com/8QZQZ4y.png");
      opacity: 0.035;
      z-index: 9999;
    }
  `);
})();

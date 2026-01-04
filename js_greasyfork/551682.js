// ==UserScript==
// @name         Радио - Мунгав музика
// @namespace    https://your.namespace
// @version      1.1
// @description  Добавя плаващ бутон "Радио", който показва/скрива SoundCloud плеър с музика от Хари Потър.
// @match        https://*.forumotion.com/*
// @match        https://*.bg-magic-world.com/*
// @run-at       document-idle
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/551682/%D0%A0%D0%B0%D0%B4%D0%B8%D0%BE%20-%20%D0%9C%D1%83%D0%BD%D0%B3%D0%B0%D0%B2%20%D0%BC%D1%83%D0%B7%D0%B8%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551682/%D0%A0%D0%B0%D0%B4%D0%B8%D0%BE%20-%20%D0%9C%D1%83%D0%BD%D0%B3%D0%B0%D0%B2%20%D0%BC%D1%83%D0%B7%D0%B8%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // --- CONFIG ---
  const PLAYER_URL = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1350015109&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true";

  const PLAYER_HEIGHT = "450px";
  const PLAYER_WIDTH = "360px";

  // --- STYLES ---
  const css = `
    #radioPlayerContainer {
      position: fixed;
      bottom: 0;
      right: 0;
      width: ${PLAYER_WIDTH};
      height: 0;
      overflow: hidden;
      background: #1a1a1d;
      border-top-left-radius: 10px;
      box-shadow: 0 0 20px rgba(255,140,0,0.25);
      transition: height 0.5s ease;
      z-index: 999999;
    }
    #radioPlayerContainer.active {
      height: ${PLAYER_HEIGHT};
    }
    #radioPlayerContainer iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    #radioToggle {
      position: fixed;
      bottom: 15px;
      right: 20px;
      background: linear-gradient(135deg, #ff5500, #ff9966);
      color: #fff;
      font-family: 'Philosopher', sans-serif;
      font-size: 15px;
      padding: 10px 18px;
      border-radius: 30px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      z-index: 1000000;
      user-select: none;
      transition: background 0.25s ease, transform 0.2s ease;
    }
    #radioToggle:hover {
      background: linear-gradient(135deg, #ff7733, #ff9966);
      transform: translateY(-1px);
    }
    #radioToggle::before {
      content: '🎵 ';
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- ELEMENTS ---
  const container = document.createElement('div');
  container.id = 'radioPlayerContainer';
  container.innerHTML = `<iframe src="${PLAYER_URL}" allow="autoplay"></iframe>`;

  const toggle = document.createElement('div');
  toggle.id = 'radioToggle';
  toggle.textContent = 'Радио';

  document.body.appendChild(container);
  document.body.appendChild(toggle);

  // --- TOGGLE ---
  toggle.addEventListener('click', () => {
    container.classList.toggle('active');
  });
})();
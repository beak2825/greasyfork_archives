// ==UserScript==
// @name         YouTube Auto Fullscreen on Change
// @namespace    http://tampermonkey.net/
// @version      2025-10-16
// @description  Entrar en pantalla completa automáticamente cuando cambias de vídeo en YouTube o YouTube Music.
// @author       You
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552799/YouTube%20Auto%20Fullscreen%20on%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/552799/YouTube%20Auto%20Fullscreen%20on%20Change.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Configurable: tiempo de espera tras la navegación antes de intentar fullscreen
  const FULLSCREEN_DELAY_MS = 800;
  const POLL_INTERVAL_MS = 150;
  const POLL_MAX_TRIES = 40;

  let lastVideoId = null;

  const isWatchPage = () => {
    // Páginas de vídeo típico (/watch) y directos (/live/ID). Evita /embed y Shorts.
    if (!location.hostname.includes('youtube.com')) return false;
    const p = location.pathname;
    if (p === '/watch') return true;
    if (p.startsWith('/live/')) return true;
    // Music a veces usa /watch también.
    if (location.hostname === 'music.youtube.com') return p === '/watch' || p === '/';
    return false;
  };

  const getVideoId = () => {
    // Para /watch: v=...
    const params = new URLSearchParams(location.search);
    const v = params.get('v');
    // Para /live/VIDEO_ID
    if (!v && location.pathname.startsWith('/live/')) {
      const parts = location.pathname.split('/');
      return parts[2] || null;
    }
    return v;
  };

  const inFullscreen = () => !!document.fullscreenElement;

  const clickFullscreenButton = () => {
    const btn = document.querySelector('.ytp-fullscreen-button');
    if (btn) btn.click();
  };

  const requestFullscreenFallback = () => {
    const player = document.getElementById('movie_player') || document.querySelector('#player') || document.querySelector('video');
    if (player && player.requestFullscreen && !inFullscreen()) {
      player.requestFullscreen().catch(() => {
        // Ignorar errores (p.ej. bloqueo por política del navegador)
      });
    }
  };

  const goFullscreen = () => {
    if (inFullscreen()) return;
    // Primero intenta el botón (respeta UI/atajos de YouTube)
    clickFullscreenButton();
    // Si no funcionó, intenta API nativa
    if (!inFullscreen()) requestFullscreenFallback();
  };

  const waitForPlayerThenFullscreen = () => {
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      const hasVideo = document.querySelector('video');
      const hasBtn = document.querySelector('.ytp-fullscreen-button');
      if (hasVideo && hasBtn) {
        clearInterval(iv);
        setTimeout(goFullscreen, FULLSCREEN_DELAY_MS);
      } else if (tries >= POLL_MAX_TRIES) {
        clearInterval(iv);
        // Último intento tras esperar un poco más
        setTimeout(goFullscreen, FULLSCREEN_DELAY_MS);
      }
    }, POLL_INTERVAL_MS);
  };

  const handleNavigation = () => {
    if (!isWatchPage()) return;
    const vid = getVideoId();
    if (vid && vid !== lastVideoId) {
      lastVideoId = vid;
      waitForPlayerThenFullscreen();
    }
  };

  // Hook de SPA: YouTube usa navegación sin recargar página
  const hookHistory = () => {
    const _pushState = history.pushState;
    history.pushState = function () {
      const ret = _pushState.apply(this, arguments);
      queueMicrotask(handleNavigation);
      return ret;
    };
    const _replaceState = history.replaceState;
    history.replaceState = function () {
      const ret = _replaceState.apply(this, arguments);
      queueMicrotask(handleNavigation);
      return ret;
    };
    window.addEventListener('popstate', handleNavigation);
  };

  // Eventos propios de YouTube (cuando termina la navegación interna)
  const hookYouTubeEvents = () => {
    window.addEventListener('yt-navigate-finish', handleNavigation);
    document.addEventListener('yt-page-data-updated', handleNavigation);
  };

  // Como red de seguridad: cuando el <video> empiece a reproducir en una nueva página
  const hookPlayListener = () => {
    const attach = () => {
      const v = document.querySelector('video');
      if (v) {
        v.addEventListener('play', () => {
          // Si estamos en una watch page y no está fullscreen, intentar
          if (isWatchPage() && !inFullscreen()) {
            setTimeout(goFullscreen, 300);
          }
        }, { once: false });
      }
    };
    const obs = new MutationObserver(() => attach());
    obs.observe(document.documentElement, { childList: true, subtree: true });
    attach();
  };

  // Inicialización
  hookHistory();
  hookYouTubeEvents();
  hookPlayListener();
  handleNavigation();
})();
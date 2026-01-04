// ==UserScript==
// @name         Miniblox.io Font Switcher (Chrome/Brave + 1001juegos)
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  Cambia la tipografía del UI de Miniblox. Compatible con Chrome y Brave. Funciona en miniblox.io y dentro del iframe de 1001juegos (miniblox.io).
// @author       tú
// @match        https://miniblox.io/*
// @match        https://*.miniblox.io/*
// @match        https://1001juegos.com/*
// @match        https://www.1001juegos.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548763/Minibloxio%20Font%20Switcher%20%28ChromeBrave%20%2B%201001juegos%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548763/Minibloxio%20Font%20Switcher%20%28ChromeBrave%20%2B%201001juegos%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- SOLO CHROME/BRAVE ---------- */
  const ua = navigator.userAgent || '';
  const isChromium = !!window.chrome && /Chrome\/\d+/.test(ua);
  const isBrave = typeof navigator.brave !== 'undefined' || /Brave\//.test(ua);
  const isChrome = /Chrome\/\d+/.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua);
  if (!(isChromium && (isBrave || isChrome))) return;

  /* ---------- EVITAR EJECUTARSE EN LA PÁGINA PADRE DE 1001JUEGOS ---------- */
  // El juego real vive en un iframe de miniblox.io. Ahí también se inyecta este script
  // por los @match de miniblox.io. En el documento padre (1001juegos.com) no hacemos nada.
  if (/1001juegos\.com$/i.test(location.hostname)) return;

  /* ---------- PREFERENCIAS ---------- */
  const STORE_KEY = 'mbx_font_pref_v1';
  const FONTS = [
    { name: 'Sistema', css: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Arial' },
    { name: 'Roboto', css: '"Roboto", system-ui, Segoe UI, Arial' },
    { name: 'Poppins', css: '"Poppins", system-ui, Segoe UI, Arial' },
    { name: 'Montserrat', css: '"Montserrat", system-ui, Segoe UI, Arial' },
  ];
  let idx = 0;

  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) idx = Math.max(0, Math.min(FONTS.length - 1, parseInt(saved, 10)));
  } catch {}

  /* ---------- CARGAR GOOGLE FONTS (ROBOTO/POPPINS/MONTSERRAT) ---------- */
  function injectGoogleFonts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    // Roboto + Poppins + Montserrat
    link.href =
      'https://fonts.googleapis.com/css2?' +
      'family=Roboto:wght@400;500;700&' +
      'family=Poppins:wght@400;600;700&' +
      'family=Montserrat:wght@400;600;700&display=swap';
    document.head.appendChild(link);
  }

  /* ---------- APLICAR FUENTE ---------- */
  let styleEl;
  function applyFont() {
    const stack = FONTS[idx].css;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'mbx-font-style';
      document.head.appendChild(styleEl);
    }
    // No tocamos canvas/img/video, solo UI HTML
    styleEl.textContent = `
      html, body, :not(canvas):not(img):not(video) {
        font-family: ${stack} !important;
      }
    `;
    try { localStorage.setItem(STORE_KEY, String(idx)); } catch {}
    console.log('[Miniblox Font] Aplicada:', FONTS[idx].name);
  }

  /* ---------- ATALHO: CTRL+ALT+F = CAMBIAR FUENTE ---------- */
  function onKeyDown(e) {
    const t = e.target;
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if (typing) return;

    if (e.ctrlKey && e.altKey && (e.code === 'KeyF' || e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      idx = (idx + 1) % FONTS.length;
      applyFont();
      showToast('Fuente: ' + FONTS[idx].name);
    }
  }

  /* ---------- TOAST PEQUEÑO ---------- */
  let toastEl;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.style.cssText = `
        position: fixed; right: 12px; bottom: 12px; z-index: 2147483647;
        background: rgba(20,20,24,.95); color: #e9eef5; padding: 8px 10px;
        border-radius: 8px; border: 1px solid rgba(255,255,255,.12);
        box-shadow: 0 8px 24px rgba(0,0,0,.35); font: 13px/1.35 system-ui, Segoe UI, Roboto, Arial;
      `;
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => (toastEl.style.opacity = '0'), 1800);
  }

  /* ---------- INIT ---------- */
  function init() {
    injectGoogleFonts();
    applyFont();
    window.addEventListener('keydown', onKeyDown, { passive: false });
    console.log('[Miniblox Font] Listo. Ctrl+Alt+F para cambiar fuente.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

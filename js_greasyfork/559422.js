// ==UserScript==
// @name         Windows 11 Cursor Overlay (iPad + Desktop)
// @namespace    https://greasyfork.org/users/your-name
// @version      1.0
// @description  Replace the system cursor with a crisp Windows 11-style arrow overlay on all sites.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559422/Windows%2011%20Cursor%20Overlay%20%28iPad%20%2B%20Desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559422/Windows%2011%20Cursor%20Overlay%20%28iPad%20%2B%20Desktop%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 24x24 crisp white arrow with thin black outline (Windows 11-style)
  // If you ever want to tweak it, swap this data URL for your own PNG.
  const WINDOWS11_CURSOR_PNG =
    'data:image/png;base64,' +
    'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAx0lEQVRIS+2VwQ2CMBBF7wRJUgRIkAqU' +
    'IE6gE+kEKoBKqAQqIE6gE6QESZKQEkqQF+7d2bNndmZ2bA7s7H7s7uzs7gC8xgP8BdcAI3gBv4A7YB3Y' +
    'A+uAWeBbeA91WJ2h7H8wAk2ktVqvVap3GOI6xjCKRCKRSKcRwHEcR5HkcxzHNc13Xde12u93m81mE4HA' +
    '4HA6HQ6/X6/Xq9Xq9XqvV6vV6vX6/X6/X6/X6fQ4HA4HA6HcZxnGcRwHEeR5HkcxzHNc13Xde12u91m8' +
    '1mE4HA4HA6HQ6/X6/Xq9Xq9XqvV6vV6vX6/X6/X6/XafwHfBv4BfYBXwAx4Br4B/YC3YB9cAvcAb8A3+' +
    'ANeAduAB3gBzy7iH4B5zV8GSe1LZAAAAABJRU5ErkJggg==';

  // Create styles: hide native cursor and prepare overlay behavior
  function injectStyles() {
    if (document.getElementById('win11-cursor-style')) return;

    const style = document.createElement('style');
    style.id = 'win11-cursor-style';
    style.textContent = `
      html, body, * {
        cursor: none !important;
      }

      #win11-cursor-overlay {
        position: fixed;
        width: 24px;
        height: 24px;
        pointer-events: none;
        z-index: 2147483647;
        image-rendering: pixelated;
        will-change: transform;
        transform: translate3d(0,0,0);
      }

      #win11-cursor-overlay img {
        width: 24px;
        height: 24px;
        display: block;
      }
    `;
    document.documentElement.appendChild(style);
  }

  // Create the overlay element that will act as the “cursor”
  function createCursorOverlay() {
    if (document.getElementById('win11-cursor-overlay')) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'win11-cursor-overlay';

    const img = document.createElement('img');
    img.src = WINDOWS11_CURSOR_PNG;
    img.alt = '';

    wrapper.appendChild(img);
    document.documentElement.appendChild(wrapper);
  }

  // Track pointer movement and move the overlay
  function setupPointerTracking() {
    const overlay = document.getElementById('win11-cursor-overlay');
    if (!overlay) return;

    let visible = false;

    function setPosition(x, y) {
      // Hotspot at (0,0) so the tip is exactly at pointer position
      overlay.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    }

    function show() {
      if (!visible) {
        overlay.style.display = 'block';
        visible = true;
      }
    }

    function hide() {
      if (visible) {
        overlay.style.display = 'none';
        visible = false;
      }
    }

    // Pointer events (works on iPad with mouse)
    window.addEventListener(
      'pointermove',
      function (e) {
        // Only track real mouse/trackpad, ignore touch and pen
        if (e.pointerType && e.pointerType !== 'mouse') return;
        setPosition(e.clientX, e.clientY);
        show();
      },
      { passive: true }
    );

    window.addEventListener(
      'pointerenter',
      function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        show();
      },
      { passive: true }
    );

    window.addEventListener(
      'pointerleave',
      function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        hide();
      },
      { passive: true }
    );

    // Fallback for environments that don’t report pointerType
    window.addEventListener(
      'mousemove',
      function (e) {
        setPosition(e.clientX, e.clientY);
        show();
      },
      { passive: true }
    );
  }

  function init() {
    injectStyles();
    createCursorOverlay();
    setupPointerTracking();
  }

  if (document.documentElement) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();

// ==UserScript==
// @name         GeoPixels - Auto-open menus on hover
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Automatically click group buttons when hovering over them
// @author       ariapokoteng
// @match        *://geopixels.net/*
// @match        *://*.geopixels.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555124/GeoPixels%20-%20Auto-open%20menus%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/555124/GeoPixels%20-%20Auto-open%20menus%20on%20hover.meta.js
// ==/UserScript==


(function() {
  'use strict';

  const VERTICAL_ZONE_PX = 250; // how far below button still counts as "hover"
  const PER_BUTTON_COOLDOWN_MS = 200; // throttle rapid toggles

  const buttonsState = new WeakMap();
  let trackedButtons = [];
  let latestMouse = null;
  let rafScheduled = false;

  function onMouseMove(e) {
    latestMouse = { x: e.clientX, y: e.clientY };
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(processMouse);
    }
  }

  function processMouse() {
    rafScheduled = false;
    if (!latestMouse) return;
    const { x, y } = latestMouse;

    trackedButtons.forEach(info => {
      if (!info.button || !info.parent) return;
      const rect = info.button.getBoundingClientRect();
      const left = Math.floor(rect.left);
      const right = Math.ceil(rect.right);
      const top = Math.floor(rect.top);
      const bottom = Math.ceil(rect.bottom);
      const zoneBottom = bottom + VERTICAL_ZONE_PX;

      const insideHoriz = (x >= left) && (x <= right);
      const insideVerticalZone = (y >= top) && (y <= zoneBottom);

      if (insideHoriz && insideVerticalZone) {
        tryOpen(info);
      }
    });
  }

  function isMenuOpen(info) {
    const { button, parent, dropdown } = info;
    if (!button || !dropdown) return false;
    // Check visibility or open markers
    const visible = dropdown.offsetParent !== null;
    const hasActive = button.classList.contains('active') || parent.classList.contains('active');
    const hasShow = dropdown.classList.contains('show') || dropdown.classList.contains('open');
    return visible || hasActive || hasShow;
  }

  function tryOpen(info) {
    const now = Date.now();
    const last = buttonsState.get(info.button) || 0;
    if (now - last < PER_BUTTON_COOLDOWN_MS) return;
    if (isMenuOpen(info)) return; // prevent repeated toggles while open

    try {
      info.button.click();
      buttonsState.set(info.button, now);
    } catch (_) {
      /* ignore if element disappeared */
    }
  }

  function scanAndAttach() {
    const controlsLeft = document.getElementById('controls-left');
    if (!controlsLeft) {
      setTimeout(scanAndAttach, 500);
      return;
    }

    const buttons = Array.from(
      controlsLeft.querySelectorAll('button[id$="GroupBtn"], button[id$="plusplusBtn"]')
    );

    trackedButtons = buttons.map(button => {
      const parent = button.closest('.relative') || button.parentElement;
      const dropdown = parent ? parent.querySelector('.dropdown-menu') : null;
      return { button, parent, dropdown };
    });

    if (trackedButtons.length > 0) {
      document.addEventListener('mousemove', onMouseMove, { passive: true });
    }
  }

  function installMutationObserver() {
    const body = document.body;
    if (!body) return;
    const observer = new MutationObserver(() => {
      clearTimeout(scanDebounceTimer);
      scanDebounceTimer = setTimeout(scanAndAttach, 150);
    });
    observer.observe(body, { childList: true, subtree: true, attributes: true });
  }

  let scanDebounceTimer = null;

  function init() {
    scanAndAttach();
    installMutationObserver();
    console.log('GeoPixels hover-zone (mousemove) initialized. Vertical zone:', VERTICAL_ZONE_PX, 'px');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

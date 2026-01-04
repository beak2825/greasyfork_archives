// ==UserScript==
// @name         Quizlet TTS Audio Keybind
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Keybind to trigger Quizlet's sound button for flashcards.
// @author       Richard Rogalski
// @match        https://quizlet.com/*
// @grant        none
// @run-at       document-idle
// @license      0BSD
// @downloadURL https://update.greasyfork.org/scripts/555215/Quizlet%20TTS%20Audio%20Keybind.user.js
// @updateURL https://update.greasyfork.org/scripts/555215/Quizlet%20TTS%20Audio%20Keybind.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Config: change key combo here. Works always-- even when currently typing.
  const KEYBIND = { ctrl: true, alt: false, shift: false, meta: false, key: 'P' };
  // Config: change key combo here. Only works when not typing.
  const KEYBIND2 = 'P';

  const DEBOUNCE_MS = 250;

  let lastTriggered = 0;

  function isTyping() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
    if (el.isContentEditable) return true;
    return false;
  }

  function matchesKeybind(e) {
    if (isTyping()) {
        if (!!KEYBIND.ctrl !== !!e.ctrlKey) return false;
        if (!!KEYBIND.alt !== !!e.altKey) return false;
        if (!!KEYBIND.shift !== !!e.shiftKey) return false;
        if (!!KEYBIND.meta !== !!e.metaKey) return false;
        return e.key && e.key.toLowerCase() === KEYBIND.key.toLowerCase();
    } return e.key && e.key.toLowerCase() === KEYBIND2.toLowerCase();
  }

  // Check if element or any ancestor hides it (display:none, visibility:hidden, opacity:0, aria-hidden="true")
  function isElementHiddenByStyleOrAria(el) {
    for (let cur = el; cur; cur = cur.parentElement) {
      const ariaHidden = cur.getAttribute && cur.getAttribute('aria-hidden');
      if (ariaHidden === 'true') return true;
      const style = window.getComputedStyle(cur);
      if (!style) continue;
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return true;
    }
    return false;
  }

  // Compute visible intersection area of element's bounding rect with viewport
  function visibleAreaInViewport(el) {
    try {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return 0;
      const vx1 = Math.max(0, r.left);
      const vy1 = Math.max(0, r.top);
      const vx2 = Math.min(window.innerWidth, r.right);
      const vy2 = Math.min(window.innerHeight, r.bottom);
      const w = Math.max(0, vx2 - vx1);
      const h = Math.max(0, vy2 - vy1);
      return w * h;
    } catch (err) {
      return 0;
    }
  }

  // Determine whether element is interactable / visible
  function isElementLikelyVisible(el) {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') {
      // offsetParent null often means display:none or not in layout; but positioned fixed elements can still be visible
      // keep checking style/aria anyway
      if (isElementHiddenByStyleOrAria(el)) return false;
    }
    if (el.disabled) return false;
    if (isElementHiddenByStyleOrAria(el)) return false;
    // If it's offscreen, visibleAreaInViewport will be 0 and we consider it not visible
    return visibleAreaInViewport(el) > 0;
  }

  // Find all matching sound buttons and choose the best visible one (largest visible area). Fallback to first visible.
  function findBestSoundButton() {
    const selector = 'button[aria-label="sound"][data-testid="assembly-icon-button-text-secondary"], button[aria-label="sound"]';
    const all = Array.from(document.querySelectorAll(selector));
    if (!all.length) return null;

    // Filter out things clearly hidden or disabled
    const candidates = all.filter(el => {
      try {
        return isElementLikelyVisible(el);
      } catch (err) {
        return false;
      }
    });

    if (candidates.length === 0) {
      // maybe buttons are present but off-viewport; fallback: include elements that are not aria-hidden and not display:none
      const relaxed = all.filter(el => {
        try {
          return !el.disabled && !isElementHiddenByStyleOrAria(el);
        } catch (err) {
          return false;
        }
      });
      if (!relaxed.length) return null;
      return relaxed[0];
    }

    // Score by visible area in viewport and by closeness to center (prefer central card control)
    let best = null;
    let bestScore = -Infinity;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (const el of candidates) {
      const area = visibleAreaInViewport(el);
      const r = el.getBoundingClientRect();
      const ex = r.left + r.width / 2;
      const ey = r.top + r.height / 2;
      const dist = Math.hypot(ex - cx, ey - cy);
      // Score: area weighted higher, penalize distance
      const score = area - dist * 10;
      if (score > bestScore) {
        bestScore = score;
        best = el;
      }
    }

    return best || candidates[0] || null;
  }

  // Click helper with synthetic events fallback
  function clickElement(el) {
    if (!el) return false;
    try {
      el.focus();
      el.click();
      return true;
    } catch (err) {
      try {
        ['pointerdown', 'mousedown', 'mouseup', 'click'].forEach(name => {
          const evt = new MouseEvent(name, { bubbles: true, cancelable: true, view: window });
          el.dispatchEvent(evt);
        });
        return true;
      } catch (err2) {
        console.warn('Quizlet Sound Keybind: click failed', err2);
      }
    }
    return false;
  }

  function triggerSound() {
    const now = Date.now();
    if (now - lastTriggered < DEBOUNCE_MS) return;
    lastTriggered = now;

    const btn = findBestSoundButton();
    if (btn && clickElement(btn)) return;

    // Fallback: try any visible audio element
    const audios = Array.from(document.querySelectorAll('audio'));
    for (const a of audios) {
      try {
        if (a.paused) a.play().catch(() => {});
        else { a.currentTime = 0; a.play().catch(() => {}); }
        return;
      } catch (err) {}
    }

    console.info('Quizlet Sound Keybind: no suitable sound control found.');
  }

  // Key listener
  window.addEventListener('keydown', function (e) {
    if (matchesKeybind(e)) {
      e.preventDefault();
      e.stopPropagation();
      triggerSound();
    }
  }, true);

  // Console helpers for testing
  window.__quizletSoundKeybind = {
    trigger: triggerSound,
    findBest: findBestSoundButton,
    findAll: () => Array.from(document.querySelectorAll('button[aria-label="sound"]'))
  };

  console.info('Quizlet Sound Keybind Visible Side loaded (default Ctrl+Shift+S).');
})();

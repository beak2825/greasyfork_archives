// ==UserScript==
// @name         Imaglr hotkeys: Carousel & Like/Repost
// @version      1.0
// @description  Add keyboard shortcuts: ←/→ for carousel prev/next, L for Like, R for Repost.
// @match        https://imaglr.com/post/*
// @grant        none
// @namespace https://greasyfork.org/users/897843
// @downloadURL https://update.greasyfork.org/scripts/558950/Imaglr%20hotkeys%3A%20Carousel%20%20LikeRepost.user.js
// @updateURL https://update.greasyfork.org/scripts/558950/Imaglr%20hotkeys%3A%20Carousel%20%20LikeRepost.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Utility: return true if the element is an editable field where we should not intercept keys
  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName && el.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return true;
    if (el.isContentEditable) return true;
    return false;
  }

  // Utility: find a button by selector and click it if found
  function clickButton(selector) {
    try {
      const btn = document.querySelector(selector);
      if (btn) {
        // If element is disabled, do nothing
        if (btn.disabled) return false;
        // Dispatch both mouse events and call click() to cover different handlers
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        btn.click();
        return true;
      }
    } catch (e) {
      // ignore any errors
    }
    return false;
  }

  // Key handler
  function onKeyDown(e) {
    // Ignore if modifier keys are pressed
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;

    // Ignore if focus is in typing field
    const active = document.activeElement;
    if (isTypingTarget(active)) return;

    // Map keys
    // ArrowRight (key) or 39 (keyCode)
    // ArrowLeft or 37
    // 'L' and 'R' keys: note e.key gives 'l' or 'L' depending on layout; normalize to uppercase
    const key = e.key;

    switch (key) {
      case 'ArrowRight':
        if (clickButton('button.carousel-control.next')) {
          e.preventDefault();
        }
        break;
      case 'ArrowLeft':
        if (clickButton('button.carousel-control.prev')) {
          e.preventDefault();
        }
        break;
      default:
        // normalize letter keys to uppercase
        if (typeof key === 'string' && key.length === 1) {
          const K = key.toUpperCase();
          if (K === 'L') {
            if (clickButton('button[title="Like"]')) {
              e.preventDefault();
            }
          } else if (K === 'R') {
            if (clickButton('button[title="Repost"]')) {
              e.preventDefault();
            }
          }
        }
        break;
    }
  }

  // Attach listener when document is ready enough
  function attach() {
    window.addEventListener('keydown', onKeyDown, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }
})();
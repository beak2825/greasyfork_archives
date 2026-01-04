// ==UserScript==
// @name         ChatGPT Thinking / Instant Toggle (Pointer Click)
// @namespace    https://chatgpt.com/
// @version      2.3
// @description  Toggle between ChatGPT "Thinking" and "Instant" with Ctrl+Alt+.
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556499/ChatGPT%20Thinking%20%20Instant%20Toggle%20%28Pointer%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556499/ChatGPT%20Thinking%20%20Instant%20Toggle%20%28Pointer%20Click%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- Helpers ----

  function log(...args) {
    console.log('[MODEL-TOGGLE]', ...args);
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function waitFor(predicate, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      (function check() {
        try {
          const val = predicate();
          if (val) return resolve(val);
        } catch (e) { /* ignore */ }
        if (performance.now() - start > timeout) {
          return reject(new Error('waitFor timeout'));
        }
        requestAnimationFrame(check);
      })();
    });
  }

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  // NEW (v2.3): Simulate a POINTER event (focus, pointerdown, pointerup, click)
  function simulateClick(element) {
    if (!element) return;
    log('Simulating POINTER click (focus, pointerdown, pointerup, click)');
    try {
      // 1. Focus the element
      element.focus();

      // 2. Simulate Pointer Down
      const pointerdownEvent = new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        view: window,
        pointerType: 'mouse',
        isPrimary: true
      });
      element.dispatchEvent(pointerdownEvent);

      // 3. Simulate Pointer Up
      const pointerupEvent = new PointerEvent('pointerup', {
        bubbles: true,
        cancelable: true,
        view: window,
        pointerType: 'mouse',
        isPrimary: true
      });
      element.dispatchEvent(pointerupEvent);

      // 4. Trigger standard click for good measure
      element.click();
    } catch (e) {
      log('Error during simulateClick, falling back', e);
      if (element.click) element.click(); // Fallback
    }
  }

  // Get the visible model selector button
  function getModelButton() {
    const buttons = document.querySelectorAll("button[data-testid='model-switcher-dropdown-button']");
    for (const btn of buttons) {
      if (isVisible(btn)) return btn;
    }
    return null;
  }

  // Determine if current model is Thinking or Instant
  function isCurrentlyThinking(btn) {
    if (!btn) return null;
    const label = (
      btn.getAttribute('aria-label') ||
      btn.textContent ||
      ''
    ).toLowerCase();

    if (label.includes('thinking')) return true;
    if (label.includes('instant')) return false;
    return null;
  }

  // Open dropdown and return the menu container element
  async function openModelMenu() {
    let btn = getModelButton();
    if (!btn) {
      log('❌ No visible model button found.');
      return null;
    }

    if (btn.getAttribute('aria-expanded') !== 'true') {
      simulateClick(btn); // <-- USE NEW POINTER CLICK
    }

    // Wait for aria-expanded="true"
    try {
        await waitFor(() => {
            const b = getModelButton();
            return b && b.getAttribute('aria-expanded') === 'true';
        }, 3000);
    } catch (e) {
        log('❌ Menu did not report aria-expanded="true" in time.');
        return null;
    }

    btn = getModelButton();
    if (!btn || btn.getAttribute('aria-expanded') !== 'true') {
      return null;
    }

    // Find menu container
    const contentId = btn.getAttribute('aria-controls');
    if (contentId) {
      const menu = document.getElementById(contentId);
      if (menu && isVisible(menu)) return menu;
    }

    const fallbackMenu = document.querySelector('[data-radix-menu-content][data-state="open"]');
    if (fallbackMenu && isVisible(fallbackMenu)) return fallbackMenu;

    return null;
  }

  // Find Instant / Thinking item inside a given menu
  function findMenuItemByVariant(menu, variant /* 'instant' | 'thinking' */) {
    const v = variant.toLowerCase();
    const selector = `[role="menuitem"][data-testid^="model-switcher-"][data-testid$="-${v}"]`;
    let el = menu.querySelector(selector);
    if (el) return el;

    // Fallback: text search
    const candidates = Array.from(menu.querySelectorAll('[role="menuitem"], [role="option"]'));
    for (const c of candidates) {
      if (!isVisible(c)) continue;
      const text = (c.textContent || '').toLowerCase();
      if (text.includes(v)) return c;
    }
    return null;
  }

  let toggleInProgress = false;

  async function toggleModel() {
    if (toggleInProgress) return;
    toggleInProgress = true;

    try {
      const btn = getModelButton();
      if (!btn) {
        log('❌ No visible model button (before toggle).');
        return;
      }

      const currentThinking = isCurrentlyThinking(btn);
      const targetVariant =
        currentThinking === null
          ? 'thinking'
          : currentThinking
            ? 'instant'
            : 'thinking';

      log('Current mode thinking?:', currentThinking, '→ target:', targetVariant);

      const menu = await openModelMenu();
      if (!menu) {
        log('❌ Could not open/find model dropdown menu.');
        return;
      }

      await sleep(50);

      const item = findMenuItemByVariant(menu, targetVariant);
      if (!item) {
        log('❌ Could not find menu item for', targetVariant);
        return;
      }

      item.click();
      log('✅ Switched to', targetVariant);
    } catch (err) {
      log('❌ Error while toggling model:', err);
    } finally {
      toggleInProgress = false;
    }
  }

  // Hotkey: Ctrl + Alt + .
  window.addEventListener(
    'keydown',
    (e) => {
      if (!e.ctrlKey || !e.altKey || e.shiftKey) return;
      if (e.key !== '.' && e.code !== 'Period') return;

      const t = e.target;
      const tag = t && t.tagName;
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (t && t.isContentEditable)
      ) {
        return;
      }

      e.preventDefault();
      toggleModel();
    },
    true
  );

  log('Userscript loaded (v2.3 - Pointer Click): Ctrl+Alt+. to toggle.');
})();
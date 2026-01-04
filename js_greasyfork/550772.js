// ==UserScript==
// @name         Aternos Auto Start & Extend
// @namespace    https://aternos.org/
// @version      1.1.0
// @description  Auto-start when offline; auto-extend when online with 0 players and <60s left; dismiss notifications
// @match        https://aternos.org/server
// @match        https://aternos.org/server/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550772/Aternos%20Auto%20Start%20%20Extend.user.js
// @updateURL https://update.greasyfork.org/scripts/550772/Aternos%20Auto%20Start%20%20Extend.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SELECTORS = {
    offlineContainer: 'div.status.offline',
    onlineContainer: 'div.status.online',
    startButton: '#start',
    players: '.live-status-box-value.js-players',
    countdown: '.server-end-countdown',
    extendButton: 'button.btn.btn-tiny.btn-success.server-extend-end',
    notificationHeader: 'header span.alert-title',
    notificationClose: 'i.fa-times.fa-solid',
  };

  let lastStartClickMs = 0;
  let lastExtendClickMs = 0;
  let lastNotificationClickMs = 0;
  let isRunning = true;

  // Cleanup function to prevent memory leaks
  function cleanup() {
    isRunning = false;
    if (window.aternosObserver) {
      window.aternosObserver.disconnect();
      delete window.aternosObserver;
    }
    if (window.aternosIntervals) {
      window.aternosIntervals.forEach(clearInterval);
      window.aternosIntervals = [];
    }
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function queryText(selector) {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : '';
  }

  function isOffline() {
    return !!document.querySelector(SELECTORS.offlineContainer);
  }

  function isOnline() {
    return !!document.querySelector(SELECTORS.onlineContainer);
  }

  function playersAreZero() {
    const txt = queryText(SELECTORS.players); // e.g., "0/20"
    return /^0\s*\/\s*\d+$/i.test(txt);
  }

  function getCountdownSeconds() {
    const txt = queryText(SELECTORS.countdown); // e.g., "5:22" or "59s"
    if (!txt) return null;

    const trimmed = txt.replace(/\s+/g, '');
    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
      const [m, s] = trimmed.split(':').map(Number);
      if (Number.isFinite(m) && Number.isFinite(s)) return m * 60 + s;
    } else if (/^\d{1,3}s$/i.test(trimmed)) {
      const s = Number(trimmed.slice(0, -1));
      if (Number.isFinite(s)) return s;
    }
    return null;
  }

  function hasNotification() {
    return !!document.querySelector(SELECTORS.notificationHeader);
  }

  function clickIfAvailable(selector, lastClickRef, minIntervalMs) {
    if (!isRunning) return false;
    
    const now = Date.now();
    if (now - lastClickRef.value < minIntervalMs) return false;
    
    const btn = document.querySelector(selector);
    if (!btn || !isVisible(btn) || btn.disabled) return false;
    
    btn.click();
    lastClickRef.value = now;
    return true;
  }

  function tryStartIfOffline() {
    if (!isRunning) return;
    if (!isOffline()) return;
    clickIfAvailable(SELECTORS.startButton, { get value() { return lastStartClickMs; }, set value(v) { lastStartClickMs = v; } }, 10000);
  }

  function tryExtendIfEndingSoon() {
    if (!isRunning) return;
    if (!isOnline()) return;
    if (!playersAreZero()) return;

    const seconds = getCountdownSeconds();
    if (seconds === null) return;

    // If <= 59 seconds remaining, extend
    if (seconds <= 59) {
      clickIfAvailable(SELECTORS.extendButton, { get value() { return lastExtendClickMs; }, set value(v) { lastExtendClickMs = v; } }, 5000);
    }
  }

  function tryDismissNotification() {
    if (!isRunning) return;
    if (!hasNotification()) return;
    
    clickIfAvailable(SELECTORS.notificationClose, { get value() { return lastNotificationClickMs; }, set value(v) { lastNotificationClickMs = v; } }, 2000);
  }

  // Initialize intervals array for cleanup
  window.aternosIntervals = [];

  // Initial delay to allow SPA content to render
  setTimeout(() => {
    if (!isRunning) return;

    // Poll for offline -> start (every 5 seconds)
    window.aternosIntervals.push(setInterval(tryStartIfOffline, 5000));
    
    // Poll for extend condition (every second)
    window.aternosIntervals.push(setInterval(tryExtendIfEndingSoon, 1000));
    
    // Poll for notifications (every 2 seconds)
    window.aternosIntervals.push(setInterval(tryDismissNotification, 2000));

    // Optimized mutation observer with throttling
    let mutationTimeout;
    const throttledMutationHandler = () => {
      if (mutationTimeout) return;
      mutationTimeout = setTimeout(() => {
        if (isRunning) {
          tryStartIfOffline();
          tryExtendIfEndingSoon();
          tryDismissNotification();
        }
        mutationTimeout = null;
      }, 1000); // Throttle to max once per second
    };

    // More targeted mutation observer to reduce memory usage
    window.aternosObserver = new MutationObserver((mutations) => {
      // Only react to significant changes
      const hasRelevantChanges = mutations.some(mutation => {
        if (mutation.type === 'childList') {
          // Check if status containers, buttons, or notifications were added/removed
          return Array.from(mutation.addedNodes).some(node => 
            node.nodeType === 1 && (
              node.matches && (
                node.matches('.status') || 
                node.matches('#start') || 
                node.matches('.server-extend-end') ||
                node.matches('header span.alert-title')
              )
            )
          );
        }
        return false;
      });

      if (hasRelevantChanges) {
        throttledMutationHandler();
      }
    });

    // Observe only the main content area instead of entire document
    const mainContent = document.querySelector('#main') || document.body;
    if (mainContent) {
      window.aternosObserver.observe(mainContent, { 
        childList: true, 
        subtree: true,
        attributes: false, // Don't watch attribute changes to reduce memory usage
        characterData: false // Don't watch text changes to reduce memory usage
      });
    }

    // Initial check
    tryStartIfOffline();
    tryExtendIfEndingSoon();
    tryDismissNotification();

  }, 1500);

  // Additional cleanup on visibility change (when tab becomes inactive)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause some operations when tab is not visible
      isRunning = false;
    } else {
      // Resume when tab becomes visible again
      isRunning = true;
    }
  });

})();
// ==UserScript==
// @name         Background Video Playback Fix (Instagram, Facebook, Reddit, TikTok)
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      1.6
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Prevents videos from pausing when the tab/window loses visibility or focus. Spoofs Page Visibility API, blocks lifecycle events, and auto-resumes videos paused by the site.
// @match        *://*facebook*/*
// @match        *://*instagram*/*
// @match        *://*reddit*/*
// @match        *://*tiktok*/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="4" y="8" width="56" height="48" rx="6" fill="%231a1a2e"/><rect x="8" y="16" width="48" height="36" rx="3" fill="%2316213e"/><polygon points="26,24 26,44 42,34" fill="%2300d9ff"/><circle cx="52" cy="12" r="8" fill="%2300ff88"/><path d="M49,12 L51,14 L55,10" stroke="%231a1a2e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561144/Background%20Video%20Playback%20Fix%20%28Instagram%2C%20Facebook%2C%20Reddit%2C%20TikTok%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561144/Background%20Video%20Playback%20Fix%20%28Instagram%2C%20Facebook%2C%20Reddit%2C%20TikTok%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════════
   * CONFIGURATION
   * ═══════════════════════════════════════════════════════════════════════════ */

  const CONFIG = Object.freeze({
    // Spoof Page Visibility API so the site believes the page is always visible
    spoofVisibilityAPI: true,

    // Block visibility/lifecycle events from reaching site handlers
    blockVisibilityEvents: true,

    // Block window-level focus/blur events (some sites pause on blur instead of visibilitychange)
    // Element-level focus (inputs, etc.) still works normally
    blockFocusBlurEvents: true,

    // Auto-resume videos paused by the site while the page is backgrounded
    autoResumeVideos: true,

    // Time (ms) after a user gesture during which a pause is considered intentional
    userGestureGraceMs: 1500,

    // Delay (ms) before attempting auto-resume (allows site animations to complete)
    resumeDelayMs: 50,

    // Enable debug logging
    debug: false,
  });

  /* ═══════════════════════════════════════════════════════════════════════════
   * UTILITIES
   * ═══════════════════════════════════════════════════════════════════════════ */

  const log = CONFIG.debug
    ? (...args) => console.log('[BackgroundPlayback]', ...args)
    : () => {};

  /**
   * Safely executes a function, catching and logging any errors.
   * @param {Function} fn - Function to execute
   * @param {string} [context] - Context for error logging
   */
  const safeExecute = (fn, context = '') => {
    try {
      return fn();
    } catch (err) {
      log(`Error${context ? ` in ${context}` : ''}:`, err);
      return undefined;
    }
  };

  /**
   * Extracts the original getter from a property descriptor on a prototype.
   * @param {object} proto - Prototype object
   * @param {string} prop - Property name
   * @returns {Function|null} - Bound getter or null
   */
  const extractGetter = (proto, prop) => {
    const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
    return descriptor?.get ?? null;
  };

  /* ═══════════════════════════════════════════════════════════════════════════
   * REAL VISIBILITY STATE (captured before spoofing)
   * ═══════════════════════════════════════════════════════════════════════════ */

  const RealVisibility = (() => {
    const docProto = Document.prototype;

    // Capture original getters before any spoofing
    const getters = {
      hidden: extractGetter(docProto, 'hidden'),
      visibilityState: extractGetter(docProto, 'visibilityState'),
    };

    // Bind hasFocus if available
    const hasFocusFn = typeof document.hasFocus === 'function'
      ? document.hasFocus.bind(document)
      : () => true;

    /**
     * Returns the real hidden state of the document.
     * @returns {boolean}
     */
    const isHidden = () => {
      if (getters.hidden) return !!getters.hidden.call(document);
      return false;
    };

    /**
     * Returns the real visibility state of the document.
     * @returns {string}
     */
    const getState = () => {
      if (getters.visibilityState) return String(getters.visibilityState.call(document));
      return 'visible';
    };

    /**
     * Returns true if the page is actually backgrounded (hidden or unfocused).
     * @returns {boolean}
     */
    const isBackgrounded = () => {
      const state = getState();
      if (state !== 'visible') return true;
      if (isHidden()) return true;
      return !hasFocusFn();
    };

    return Object.freeze({ isHidden, getState, isBackgrounded, hasFocus: hasFocusFn });
  })();

  /* ═══════════════════════════════════════════════════════════════════════════
   * VISIBILITY API SPOOFING
   * ═══════════════════════════════════════════════════════════════════════════ */

  if (CONFIG.spoofVisibilityAPI) {
    safeExecute(() => {
      const spoofedProperties = {
        hidden: { get: () => false, configurable: true, enumerable: true },
        visibilityState: { get: () => 'visible', configurable: true, enumerable: true },
      };

      // Define on document instance (less invasive than prototype modification)
      for (const [prop, descriptor] of Object.entries(spoofedProperties)) {
        safeExecute(() => Object.defineProperty(document, prop, descriptor), `spoof ${prop}`);
      }

      log('Visibility API spoofed');
    }, 'spoofVisibilityAPI');
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * EVENT BLOCKING
   * ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Event handler that stops immediate propagation without preventing default.
   * This blocks site handlers while allowing browser-level behavior.
   * @param {Event} event
   */
  const blockEventPropagation = (event) => {
    event.stopImmediatePropagation();
    log(`Blocked event: ${event.type}`);
  };

  /**
   * Event handler for focus/blur that only blocks window-level events (tab switching).
   * Allows element-level focus/blur to propagate for UI components.
   * @param {Event} event
   */
  const blockWindowLevelFocusBlur = (event) => {
    // Only block if the event target is the window itself (tab switching)
    // Allow focus/blur on actual elements (inputs, buttons, etc.) to propagate
    if (event.target === window || event.target === document) {
      event.stopImmediatePropagation();
      log(`Blocked window-level event: ${event.type}`);
    }
  };

  /**
   * Adds blocking listeners for specified event types on a target.
   * @param {EventTarget} target
   * @param {string[]} eventTypes
   */
  const addBlockingListeners = (target, eventTypes) => {
    for (const type of eventTypes) {
      safeExecute(() => {
        target.addEventListener(type, blockEventPropagation, true);
      }, `block ${type}`);
    }
  };

  if (CONFIG.blockVisibilityEvents) {
    const visibilityEvents = [
      'visibilitychange',
      'pagehide',
      'pageshow',
      'freeze',
      'resume',
    ];

    addBlockingListeners(document, visibilityEvents);
    addBlockingListeners(window, visibilityEvents);
    log('Visibility events blocked');
  }

  if (CONFIG.blockFocusBlurEvents) {
    // Use selective blocking: only block focus/blur when target is window/document
    // This allows element-level focus (search inputs, etc.) to work normally
    for (const type of ['blur', 'focus']) {
      window.addEventListener(type, blockWindowLevelFocusBlur, true);
      document.addEventListener(type, blockWindowLevelFocusBlur, true);
    }
    log('Focus/blur events blocked (window-level only, element focus allowed)');
  }

  /* ═══════════════════════════════════════════════════════════════════════════
   * VIDEO AUTO-RESUME SYSTEM
   * ═══════════════════════════════════════════════════════════════════════════ */

  if (CONFIG.autoResumeVideos) {
    /** Symbol to mark videos we've already processed */
    const HOOKED = Symbol('bgPlayback.hooked');

    /** Timestamp of the last user gesture */
    let lastGestureTime = 0;

    /**
     * Updates the last gesture timestamp.
     */
    const recordUserGesture = () => {
      lastGestureTime = Date.now();
    };

    /**
     * Returns true if a pause event is likely user-initiated.
     * @returns {boolean}
     */
    const isUserInitiatedPause = () => {
      return (Date.now() - lastGestureTime) <= CONFIG.userGestureGraceMs;
    };

    /**
     * Attempts to play a video, suppressing any errors.
     * @param {HTMLVideoElement} video
     */
    const tryPlay = (video) => {
      safeExecute(() => {
        const playPromise = video.play();
        if (playPromise?.catch) {
          playPromise.catch((err) => {
            log('Play rejected:', err.name, err.message);
          });
        }
      }, 'tryPlay');
    };

    /**
     * Handles the pause event on a video element.
     * Resumes playback if the pause was triggered by a background state transition.
     * @param {Event} event
     */
    const handleVideoPause = (event) => {
      /** @type {HTMLVideoElement} */
      const video = event.currentTarget;

      // Skip if this looks like a user-initiated pause
      if (isUserInitiatedPause()) {
        log('Pause appears user-initiated, not resuming');
        return;
      }

      // Skip if the video has naturally ended
      if (video.ended) {
        log('Video ended, not resuming');
        return;
      }

      // Skip if the video isn't ready
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        log('Video not ready, not resuming');
        return;
      }

      // Skip if there's an error
      if (video.error) {
        log('Video has error, not resuming');
        return;
      }

      // Only resume if the page is actually backgrounded
      // This prevents interfering with legitimate in-page pauses (e.g., scroll-based)
      if (!RealVisibility.isBackgrounded()) {
        log('Page is visible, not resuming');
        return;
      }

      log('Resuming video after background pause');
      setTimeout(() => tryPlay(video), CONFIG.resumeDelayMs);
    };

    /**
     * Hooks a video element to enable background playback.
     * @param {HTMLVideoElement} video
     */
    const hookVideo = (video) => {
      if (!(video instanceof HTMLVideoElement)) return;
      if (video[HOOKED]) return;

      video[HOOKED] = true;

      video.addEventListener('pause', handleVideoPause, { passive: true });

      log('Hooked video:', video.src?.slice(0, 50) || '(no src)');

      // If the video is already paused and we're backgrounded, try to play
      queueMicrotask(() => {
        if (video.paused && !video.ended && RealVisibility.isBackgrounded()) {
          log('Attempting initial play for backgrounded video');
          tryPlay(video);
        }
      });
    };

    /**
     * Scans a DOM node (and its descendants) for video elements to hook.
     * @param {Node} root
     */
    const scanForVideos = (root) => {
      if (!root) return;

      if (root instanceof HTMLVideoElement) {
        hookVideo(root);
        return;
      }

      if (root.querySelectorAll) {
        const videos = root.querySelectorAll('video');
        videos.forEach(hookVideo);
      }

      // Also check shadow roots
      if (root.shadowRoot) {
        scanForVideos(root.shadowRoot);
      }
    };

    // Listen for user gestures to detect intentional pauses
    const gestureEvents = ['pointerdown', 'mousedown', 'touchstart', 'keydown', 'click'];
    for (const type of gestureEvents) {
      safeExecute(() => {
        window.addEventListener(type, recordUserGesture, { capture: true, passive: true });
      }, `gesture listener ${type}`);
    }

    // Initial scan once DOM is available
    const initialScan = () => {
      scanForVideos(document.documentElement || document.body || document);
      log('Initial video scan complete');
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initialScan, { once: true });
    } else {
      initialScan();
    }

    // Watch for dynamically added videos (SPAs add content dynamically)
    safeExecute(() => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              scanForVideos(node);
            }
          }
        }
      });

      // Start observing once we have a root
      const startObserver = () => {
        const root = document.documentElement || document.body;
        if (root) {
          observer.observe(root, { childList: true, subtree: true });
          log('MutationObserver started');
        } else {
          // Retry if DOM not ready
          setTimeout(startObserver, 10);
        }
      };

      startObserver();
    }, 'MutationObserver setup');

    log('Auto-resume system initialized');
  }

  log('Background playback fix loaded');
})();
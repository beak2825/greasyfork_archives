// ==UserScript==
// @name         Disable YouTube Music beforeunload
// @namespace    https://example.local/
// @version      1.2
// @description  Prevent "Are you sure you want to leave?" on music.youtube.com
// @match        https://music.youtube.com/*
// @run-at       document-start
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/557144/Disable%20YouTube%20Music%20beforeunload.user.js
// @updateURL https://update.greasyfork.org/scripts/557144/Disable%20YouTube%20Music%20beforeunload.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // 1) Prevent assignment to window.onbeforeunload
  try {
    Object.defineProperty(window, 'onbeforeunload', {
      configurable: false,
      enumerable: true,
      get: function() { return null; },
      set: function() { /* ignore attempts to set */ }
    });
  } catch (e) {
    // If that fails (rare), fallback below
  }

  // 2) Intercept addEventListener/removeEventListener on Window and Document
  const blockType = 'beforeunload';
  const origWinAdd = window.addEventListener;
  const origDocAdd = Document.prototype.addEventListener;
  const origWinRemove = window.removeEventListener;
  const origDocRemove = Document.prototype.removeEventListener;

  window.addEventListener = function(type, listener, opts) {
    if (String(type).toLowerCase() === blockType) return;
    return origWinAdd.call(this, type, listener, opts);
  };
  Document.prototype.addEventListener = function(type, listener, opts) {
    if (String(type).toLowerCase() === blockType) return;
    return origDocAdd.call(this, type, listener, opts);
  };

  window.removeEventListener = function(type, listener, opts) {
    if (String(type).toLowerCase() === blockType) return;
    return origWinRemove.call(this, type, listener, opts);
  };
  Document.prototype.removeEventListener = function(type, listener, opts) {
    if (String(type).toLowerCase() === blockType) return;
    return origDocRemove.call(this, type, listener, opts);
  };

  // 3) Remove any already-attached handlers at intervals for robustness
  const stripOnce = () => {
    try {
      if (window.onbeforeunload) window.onbeforeunload = null;
    } catch(e){}

    // Walk through common targets to remove listeners via clone (safe)
    try {
      // Remove inline attributes
      if (document && document.body) {
        if (document.body.onbeforeunload) document.body.onbeforeunload = null;
      }
    } catch(e){}

    // Also try to remove event listeners by replacing window with a proxy of listeners:
    // (the addEventListener overrides above are the primary defense)
  };

  // Run immediately and a few times shortly after load (handles late attachments)
  stripOnce();
  const t1 = setInterval(stripOnce, 300);
  // Stop after 5 seconds to avoid forever timers
  setTimeout(() => clearInterval(t1), 5000);
})();

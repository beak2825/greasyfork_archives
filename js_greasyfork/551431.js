// ==UserScript==
// @name         CheatTheSystem
// @namespace    http://bdstudios.nl
// @version      2025-10-03
// @description  Blocks native fullscreen transitions while emulating a true fullscreen state to websites, and suppresses tab-switch / visibility detection. 
// @author       JTD
// @match        *://*/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=proxyahh1.vercel.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551431/CheatTheSystem.user.js
// @updateURL https://update.greasyfork.org/scripts/551431/CheatTheSystem.meta.js
// ==/UserScript==

// content_script.js
(function () {
  'use strict';
  function inject(fn) {
    const s = document.createElement('script');
    s.textContent = '(' + fn.toString() + ')();';
    (document.documentElement || document.head || document.body).appendChild(s);
    s.remove();
  }

  inject(function () {
    try {
      // Fake fullscreen request
      Element.prototype.requestFullscreen = function () {
        // set fake fullscreen element
        document._fakeFullscreenEl = this;
        // fire event so sites think it happened
        setTimeout(() => {
          document.dispatchEvent(new Event("fullscreenchange"));
        }, 0);
        return Promise.resolve(this);
      };
      Element.prototype.mozRequestFullScreen = Element.prototype.requestFullscreen;
      Element.prototype.webkitRequestFullscreen = Element.prototype.requestFullscreen;

      // Fake exitFullscreen
      document.exitFullscreen = function () {
        document._fakeFullscreenEl = null;
        setTimeout(() => {
          document.dispatchEvent(new Event("fullscreenchange"));
        }, 0);
        return Promise.resolve();
      };

      // Always report a fullscreen element (truthy)
      Object.defineProperty(document, 'fullscreenElement', {
        get() { return document._fakeFullscreenEl || document.documentElement; },
        configurable: true
      });
    } catch (e) {}

    try {
      Object.defineProperty(document, 'hidden', {
        get() { return false; },
        configurable: true
      });
      Object.defineProperty(document, 'visibilityState', {
        get() { return 'visible'; },
        configurable: true
      });
      document.hasFocus = function () { return true; };
      window.hasFocus = function () { return true; };
    } catch (e) {}

    function stopEvent(e) { try { e.stopImmediatePropagation(); } catch (err) {} }
    addEventListener('visibilitychange', stopEvent, true);
    addEventListener('blur', stopEvent, true);
    addEventListener('focus', stopEvent, true);
    addEventListener('pageshow', stopEvent, true);
    addEventListener('pagehide', stopEvent, true);

    const origDocAdd = Document.prototype.addEventListener;
    Document.prototype.addEventListener = function (type, listener, opts) {
      if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
        return origDocAdd.call(this, type, function () {}, opts);
      }
      return origDocAdd.call(this, type, listener, opts);
    };
  });
})();
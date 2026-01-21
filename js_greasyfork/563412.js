// ==UserScript==
// @name         Torn Fast Keno
// @namespace    https://www.torn.com/
// @version      1.0.0
// @description  Speeds up Keno animations
// @match        https://www.torn.com/page.php?sid=keno*
// @run-at       document-start
// @grant        none
// @author       WinterValor [3945658]
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563412/Torn%20Fast%20Keno.user.js
// @updateURL https://update.greasyfork.org/scripts/563412/Torn%20Fast%20Keno.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SPEED_MULTIPLIER = 5;          // 5x faster
  const SCALE = 1 / SPEED_MULTIPLIER;  // delay * SCALE
  const MIN_DELAY_MS = 16;             // don’t go below ~1 frame

  // Only scale timers that originate from keno.js (based on stack trace)
  function isKenoCaller() {
    try {
      const stack = new Error().stack || "";
      // Matches ".../casino/keno/js/keno.js?v=..." etc.
      return stack.includes("casino/keno/js/keno.js") || stack.includes("keno.js");
    } catch {
      return false;
    }
  }

  function scaleDelay(delay) {
    if (typeof delay !== "number" || !isFinite(delay) || delay <= 0) return delay;
    const scaled = Math.max(MIN_DELAY_MS, Math.round(delay * SCALE));
    return scaled;
  }

  // Patch timers early so keno.js inherits the behavior
  const _setTimeout = window.setTimeout.bind(window);
  const _setInterval = window.setInterval.bind(window);

  window.setTimeout = function (fn, delay, ...args) {
    const d = isKenoCaller() ? scaleDelay(delay) : delay;
    return _setTimeout(fn, d, ...args);
  };

  window.setInterval = function (fn, delay, ...args) {
    const d = isKenoCaller() ? scaleDelay(delay) : delay;
    return _setInterval(fn, d, ...args);
  };

  // OPTIONAL: also speed up jQuery animations inside the Keno container.
  // (Reveals are already sped up by setInterval; this just makes the UI transitions snappier.)
  function patchJQueryWhenReady() {
    const $ = window.jQuery;
    if (!$ || !$.fn) return;

    const inKeno = (jqObj) => {
      const el = jqObj && jqObj[0];
      if (!el) return false;
      // Only elements within the keno game container
      return (el.closest && el.closest("#kenoGame")) || el.id === "kenoGame";
    };

    const patchDurationArg = (jqObj, dur) => {
      if (typeof dur !== "number") return dur;
      if (!inKeno(jqObj)) return dur;
      return Math.max(MIN_DELAY_MS, Math.round(dur * SCALE));
    };

    // animate
    const _animate = $.fn.animate;
    $.fn.animate = function (props, speed, easing, callback) {
      const newSpeed = patchDurationArg(this, speed);
      return _animate.call(this, props, newSpeed, easing, callback);
    };

    // slideDown / slideUp
    const _slideDown = $.fn.slideDown;
    $.fn.slideDown = function (speed, easing, callback) {
      const newSpeed = patchDurationArg(this, speed);
      return _slideDown.call(this, newSpeed, easing, callback);
    };

    const _slideUp = $.fn.slideUp;
    $.fn.slideUp = function (speed, easing, callback) {
      const newSpeed = patchDurationArg(this, speed);
      return _slideUp.call(this, newSpeed, easing, callback);
    };

    // fadeIn / fadeOut
    const _fadeIn = $.fn.fadeIn;
    $.fn.fadeIn = function (speed, easing, callback) {
      const newSpeed = patchDurationArg(this, speed);
      return _fadeIn.call(this, newSpeed, easing, callback);
    };

    const _fadeOut = $.fn.fadeOut;
    $.fn.fadeOut = function (speed, easing, callback) {
      const newSpeed = patchDurationArg(this, speed);
      return _fadeOut.call(this, newSpeed, easing, callback);
    };
  }

  // Poll briefly until jQuery exists (it loads early, but not at document-start)
  const jqPoll = window.setInterval(() => {
    if (window.jQuery) {
      window.clearInterval(jqPoll);
      patchJQueryWhenReady();
    }
  }, 50);
})();

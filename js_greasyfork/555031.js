// ==UserScript==
// @name         Echo360 Video Speed Controller Fixer
// @namespace    http://tampermonkey.net/
// @version      2025-11-06
// @description  Fixes an issue where the Video Speed Controller extension was not working on Echo360, and repositions the speed element to prevent overlap with existing elements for better visibility.
// @author       Integrace
// @match        https://echo360.org.uk/lesson/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=echo360.org.uk
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555031/Echo360%20Video%20Speed%20Controller%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/555031/Echo360%20Video%20Speed%20Controller%20Fixer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**********************************************************
   * :one: Block playbackRate resets to 1.0x
   **********************************************************/
  const desc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
  if (desc && desc.set && desc.get) {
    window.__blockEchoPlaybackRateReset = true;
    Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
      configurable: true,
      enumerable: desc.enumerable,
      get() {
        return desc.get.call(this);
      },
      set(value) {
        if (window.__blockEchoPlaybackRateReset && value === 1) return;
        return desc.set.call(this, value);
      },
    });
  }

  /**********************************************************
   * :two: Keep the #controller always shifted down
   **********************************************************/
  const MOVE_OFFSET = 35; // pixels downward

  function shiftController(controller) {
    if (!controller) return;
    if (controller.style.transform !== `translateY(${MOVE_OFFSET}px)`) {
      controller.style.transform = `translateY(${MOVE_OFFSET}px)`;
    }
  }

  function handleShadowHost(host) {
    if (!host || !host.shadowRoot) return;
    const shadow = host.shadowRoot;

    // Apply immediately if exists
    shiftController(shadow.getElementById('controller'));

    // Observe inside shadow DOM for controller creation / resets
    const innerObserver = new MutationObserver(() => {
      const ctrl = shadow.getElementById('controller');
      shiftController(ctrl);
    });
    innerObserver.observe(shadow, { childList: true, subtree: true, attributes: true });
  }

  function scanForHosts() {
    document.querySelectorAll('div.vsc-controller').forEach(handleShadowHost);
  }

  // Watch for new .vsc-controller elements in main DOM
  const outerObserver = new MutationObserver(() => scanForHosts());
  outerObserver.observe(document.documentElement, { childList: true, subtree: true });

  // Backup interval in case observers miss it (Echo360 can use detached shadow roots)
  setInterval(scanForHosts, 1000);
})();

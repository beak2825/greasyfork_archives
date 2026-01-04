// ==UserScript==
// @name         GeoGuessr - Right Click to Remove Pin
// @namespace    https://greasyfork.org/en/users/your-name
// @version      1.2.1
// @description  Right-click on the map to remove pin
// @author       Rotski
// @license      MIT
// @match        https://www.geoguessr.com/*
// @run-at       document-end
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/551078/GeoGuessr%20-%20Right%20Click%20to%20Remove%20Pin.user.js
// @updateURL https://update.greasyfork.org/scripts/551078/GeoGuessr%20-%20Right%20Click%20to%20Remove%20Pin.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Only target the canvas container
  var MAP_SELECTOR = '[class^="guess-map_canvasContainer__"], [class*=" guess-map_canvasContainer__"]';

  function fireEvent(type, target, baseEvt) {
    var opts = {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: baseEvt.clientX,
      clientY: baseEvt.clientY,
      screenX: baseEvt.screenX,
      screenY: baseEvt.screenY,
      button: 0,      // left button
      buttons: 1,     // left pressed
      shiftKey: true, // emulate Shift held
      ctrlKey: false,
      altKey: false,
      metaKey: false,
      view: window
    };

    var ev;
    try {
      if (window.PointerEvent && type.startsWith('pointer')) {
        ev = new PointerEvent(type, Object.assign({ pointerType: 'mouse', pointerId: 1 }, opts));
      } else {
        ev = new MouseEvent(type, opts);
      }
    } catch (e) {
      ev = document.createEvent('MouseEvents');
      ev.initMouseEvent(
        type, true, true, window,
        0, opts.screenX, opts.screenY, opts.clientX, opts.clientY,
        opts.ctrlKey, opts.altKey, opts.shiftKey, opts.metaKey,
        opts.button, null
      );
    }
    target.dispatchEvent(ev);
  }

  function emulateShiftLeftClickAt(clientX, clientY, baseEvt) {
    var target = document.elementFromPoint(clientX, clientY) || baseEvt.target;
    if (!target || !target.closest(MAP_SELECTOR)) return;

    if (window.PointerEvent) fireEvent('pointerdown', target, baseEvt);
    fireEvent('mousedown', target, baseEvt);

    if (window.PointerEvent) fireEvent('pointerup', target, baseEvt);
    fireEvent('mouseup', target, baseEvt);
    fireEvent('click', target, baseEvt);
  }

  function attachHandlers() {
    var mapEls = document.querySelectorAll(MAP_SELECTOR);
    for (var i = 0; i < mapEls.length; i++) {
      var el = mapEls[i];
      if (el.dataset.ggRightToShift === '1') continue;
      el.dataset.ggRightToShift = '1';

      el.addEventListener('contextmenu', function (e) {
        if (!e.target.closest(MAP_SELECTOR)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        emulateShiftLeftClickAt(e.clientX, e.clientY, e);
        return false;
      }, { capture: true, passive: false });

      // Auxclick fallback
      el.addEventListener('auxclick', function (e) {
        if (e.button !== 2) return;
        if (!e.target.closest(MAP_SELECTOR)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        emulateShiftLeftClickAt(e.clientX, e.clientY, e);
      }, { capture: true, passive: false });

      // Block right-drag
      el.addEventListener('mousedown', function (e) {
        if (e.button !== 2) return;
        if (!e.target.closest(MAP_SELECTOR)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
      }, { capture: true, passive: false });
    }
  }

  // Initial attach
  attachHandlers();

  // Re-attach on SPA re-renders
  if (window.MutationObserver) {
    var obs = new MutationObserver(function () { attachHandlers(); });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  // History hook for round navigation
  function wrap(fn) {
    return function () {
      var r = fn.apply(this, arguments);
      setTimeout(attachHandlers, 0);
      setTimeout(attachHandlers, 200);
      return r;
    };
  }
  try {
    if (!history.__ggRightToShiftWrappedCanvas) {
      history.pushState = wrap(history.pushState);
      history.replaceState = wrap(history.replaceState);
      window.addEventListener('popstate', function () { setTimeout(attachHandlers, 0); }, false);
      history.__ggRightToShiftWrappedCanvas = true;
    }
  } catch (e) {}
})();

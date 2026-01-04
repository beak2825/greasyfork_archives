// ==UserScript==
// @name         Bloxd.io Pointer Lock + L Toggle
// @namespace    https://greasyfork.org/users/your-name
// @version      1.0
// @description  Keep the cursor frozen in-game (pointer lock) with an L toggle, normal cursor in menus.
// @author       You
// @match        *://bloxd.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559423/Bloxdio%20Pointer%20Lock%20%2B%20L%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/559423/Bloxdio%20Pointer%20Lock%20%2B%20L%20Toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // CONFIG
  const TOGGLE_KEY = 'l'; // press "L" to toggle lock on/off

  let stickyLock = true;        // we want lock in-game by default
  let userToggleLock = true;    // user-controlled "allow lock" flag
  let lastRequestedCanvas = null;

  function getGameCanvas() {
    // Bloxd uses a big main canvas; grab the largest one.
    const canvases = Array.from(document.getElementsByTagName('canvas'));
    if (!canvases.length) return null;
    return canvases.reduce((biggest, c) => {
      const area = c.width * c.height;
      const biggestArea = biggest.width * biggest.height;
      return area > biggestArea ? c : biggest;
    });
  }

  function isPointerLocked() {
    return document.pointerLockElement != null;
  }

  function requestLock(canvas) {
    if (!canvas) return;
    lastRequestedCanvas = canvas;

    const req =
      canvas.requestPointerLock ||
      canvas.mozRequestPointerLock ||
      canvas.webkitRequestPointerLock;

    if (req) {
      try {
        req.call(canvas);
      } catch (e) {
        // ignore
      }
    }
  }

  function exitLock() {
    const exit =
      document.exitPointerLock ||
      document.mozExitPointerLock ||
      document.webkitExitPointerLock;

    if (exit) {
      try {
        exit.call(document);
      } catch (e) {
        // ignore
      }
    }
  }

  function lockIfAllowed() {
    if (!userToggleLock) return; // user disabled lock with L
    const canvas = getGameCanvas();
    if (!canvas) return;
    if (!isPointerLocked()) {
      requestLock(canvas);
    }
  }

  function handlePointerLockChange() {
    const locked = isPointerLocked();

    if (locked) {
      // We’re in FPS mode; cursor frozen. Good.
      stickyLock = true;
    } else {
      // Lost lock. Only auto‑relock if user wants lock AND we think we're in-game.
      if (userToggleLock) {
        // Small delay to avoid fighting Bloxd when it *really* wants to unlock
        setTimeout(() => {
          // Recheck before relocking
          if (!isPointerLocked()) {
            lockIfAllowed();
          }
        }, 50);
      }
    }
  }

  function handleClick(e) {
    // When player clicks inside the main canvas, we assume they intend to play.
    const canvas = getGameCanvas();
    if (!canvas) return;

    if (e.target === canvas || canvas.contains(e.target)) {
      if (userToggleLock) {
        lockIfAllowed();
      }
    }
  }

  function handleKeydown(e) {
    if (e.key.toLowerCase() === TOGGLE_KEY) {
      // Toggle user-controlled lock
      userToggleLock = !userToggleLock;

      if (!userToggleLock) {
        // User turned lock OFF: release pointer if locked
        if (isPointerLocked()) {
          exitLock();
        }
      } else {
        // User turned lock ON: try to lock immediately if in-game
        lockIfAllowed();
      }
    }
  }

  function injectCursorHintStyle() {
    if (document.getElementById('bloxd-lock-hint-style')) return;

    const style = document.createElement('style');
    style.id = 'bloxd-lock-hint-style';
    style.textContent = `
      /* When pointer is locked, the system cursor is hidden at OS level.
         We don't mess with menus: Bloxd decides when it's in-game. */
      canvas:focus {
        cursor: none !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function init() {
    injectCursorHintStyle();

    document.addEventListener('click', handleClick, true);
    window.addEventListener('keydown', handleKeydown, true);

    document.addEventListener('pointerlockchange', handlePointerLockChange, false);
    document.addEventListener('mozpointerlockchange', handlePointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', handlePointerLockChange, false);

    // If the game already locked pointer before our script loaded, respect that
    if (isPointerLocked()) {
      stickyLock = true;
    } else {
      // Try to auto-lock once when the canvas is ready and userToggleLock is true
      setTimeout(() => {
        if (userToggleLock) {
          lockIfAllowed();
        }
      }, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

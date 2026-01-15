// ==UserScript==
// @name         Haxball Arrow Avatar Animation (Instant + Toggle T)
// @namespace    http://tampermonkey.net/
// @version      2026-01-15
// @description  Instantly animates your Haxball avatar based on movement keys( You can change this to your keys) Press T to toggle on/off. Zero delay, smooth animation
// @license      MIT
// @author       ikeda
// @match        https://www.haxball.com/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562679/Haxball%20Arrow%20Avatar%20Animation%20%28Instant%20%2B%20Toggle%20T%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562679/Haxball%20Arrow%20Avatar%20Animation%20%28Instant%20%2B%20Toggle%20T%29.meta.js
// ==/UserScript==

(function() {
  "use strict";

  // SET DURATION FOR AVATAR TO APPEAR
  var defaultDuration = 800;

  // AVATARS ( U CAN CONFIG TO UR KEYs)
  var avatars = {
    'default': "",
    'arrowup': "↑",
    'arrowleft': "←",
    'arrowdown': "↓",
    'arrowright': "→",
    'arrowleftarrowup': "↖",
    'arrowrightarrowup': "↗",
    'arrowleftarrowdown': "↙",
    'arrowdownarrowright': "↘"
  };

  var reset;
  var heldKeys = new Set();
  var iframe;
  var enabled = true; // 🔥 TOGGLE STATE

  function process() {
    if (!enabled) return;

    var combo = Array.from(heldKeys).sort().join("");
    var avatar = avatars[combo] || avatars[Array.from(heldKeys)[0]];

    if (avatar !== undefined) {
      setAvatar(avatar);

      if (reset !== undefined) clearTimeout(reset);

      reset = setTimeout(function() {
        if (heldKeys.size === 0) {
          setAvatar(avatars['default']);
        }
      }, defaultDuration);
    }
  }

  // CHANGE AVATAR
  function setAvatar(avatar) {
    if (!enabled) return;

    var inputElement = iframe.body.querySelector("[data-hook='input']");
    if (!inputElement) return;

    inputElement.value = "/avatar " + avatar;

    inputElement.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter",
      keyCode: 13,
      code: "Enter",
      which: 13,
      bubbles: true
    }));

    var notices = iframe.body.getElementsByClassName("notice");
    for (var i = 0; i < notices.length; i++) {
      if (notices[i].innerHTML === "Avatar set") {
        notices[i].remove();
      }
    }
  }

  // KEYDOWN
  function keyDown(event) {
    if (iframe.activeElement === iframe.querySelector("[data-hook='input']")) return;

    var key = event.key.toLowerCase();

    // 🔥 TOGGLE WITH T
    if (key === 't') {
      enabled = !enabled;
      heldKeys.clear();
      setAvatar(avatars['default']);
      console.log("Avatar animation " + (enabled ? "ON" : "OFF"));
      return;
    }

    if (!enabled) return;
    if (!(key in avatars)) return;

    heldKeys.add(key);
    process();
  }

  // KEYUP
  function keyUp(event) {
    if (!enabled) return;

    var key = event.key.toLowerCase();
    heldKeys.delete(key);

    if (heldKeys.size === 0) {
      setAvatar(avatars['default']);
    } else {
      process();
    }
  }

  // INIT
  setTimeout(function() {
    iframe = document.querySelector("iframe").contentWindow.document;
    iframe.body.addEventListener("keydown", keyDown, true);
    iframe.body.addEventListener("keyup", keyUp, true);
    console.log("Avatar animation loaded (press T to toggle)");
  }, 3000);

})();
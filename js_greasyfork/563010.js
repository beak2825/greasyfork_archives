// ==UserScript==
// @name         Skyskraber Hotkeys
// @namespace    local.skyskraber.hotkeys
// @version      1.3.4
// @description  Hokteys for Skyskraber
// @match        https://www.skyskraber.dk/chat*
// @match        https://skyskraber.dk/chat*
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/563007/Skyskraber%20Core.user.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563010/Skyskraber%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/563010/Skyskraber%20Hotkeys.meta.js
// ==/UserScript==

(() => {
  "use strict";

  console.log("[Hotkeys] Script loaded, version 1.3.4");

  let roomExits = {};
  let navigationFrozen = false;
  let enabled = true;
  let lastMove = 0;
  let nextMove = null;
  let blockedItemId = null;
  let unblockTimeout = null;
  let currentRoomId = null;

  const STORAGE_HOTKEYS_ENABLED = "HOTKEYS_ENABLED";
  const BASE_RATE_LIMIT_MS = 400; // 0.4s between moves

  /******************************************************************
   * INITIALIZATION - Wait for Core
   ******************************************************************/
  async function waitForCore() {
    while (!window.SkyskraberCore) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  /******************************************************************
   * DOOR → ARROW MAPPING (SCREEN-RELATIVE)
   ******************************************************************/
  function extractScreenRelativeExits(fields) {
    const doors = fields.filter(f => f.state === "door" && typeof f.goto === "number");
    if (!doors.length) return {};

    const xs = fields.map(f => f.x);
    const ys = fields.map(f => f.y);

    const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;

    const exits = {};

    for (const door of doors) {
      const dx = door.x - centerX;
      const dy = door.y - centerY;

      if (Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? exits.ArrowLeft = door.goto : exits.ArrowRight = door.goto;
      } else {
        dy < 0 ? exits.ArrowUp = door.goto : exits.ArrowDown = door.goto;
      }
    }

    return exits;
  }

  /******************************************************************
   * HOTKEYS
   ******************************************************************/
  document.addEventListener("keydown", e => {
    if (!enabled || navigationFrozen || !window.SkyskraberCore.isConnected()) return;

    const now = Date.now();
    const rateLimit = BASE_RATE_LIMIT_MS;
    if (now - lastMove < rateLimit) {
      // Buffer the next move if rate limited
      nextMove = e.key;
      return;
    }
    lastMove = now;

    const targetRoom = roomExits[e.key];
    if (!targetRoom) return;

    window.SkyskraberCore.send({
      type: "goto",
      data: { room: targetRoom }
    });

    e.preventDefault();
  });

  // Timer to process buffered move
  setInterval(() => {
    if (!enabled || !nextMove) return;
    const now = Date.now();
    const rateLimit = BASE_RATE_LIMIT_MS;
    if (now - lastMove >= rateLimit) {
      const targetRoom = roomExits[nextMove];
      if (targetRoom) {
        window.SkyskraberCore.send({
          type: "goto",
          data: { room: targetRoom }
        });
        lastMove = now;
      }
      nextMove = null;
    }
  }, 50);

  /******************************************************************
   * INIT
   ******************************************************************/
  async function start() {
    await waitForCore();

    // Load enabled state
    enabled = localStorage.getItem(STORAGE_HOTKEYS_ENABLED) !== "false";

    // Add enable/disable button
    window.SkyskraberCore.addIndicatorButton(enabled ? "Disable Hotkeys" : "Enable Hotkeys", () => {
      enabled = !enabled;
      localStorage.setItem(STORAGE_HOTKEYS_ENABLED, String(enabled));
    });

    // Listen for outgoing messages
    window.SkyskraberCore.onSend((msg) => {
      if (enabled && msg?.type === "goto") {
        // Manual room change always unfreezes navigation
        navigationFrozen = false;
        blockedItemId = null;
        if (unblockTimeout) {
          clearTimeout(unblockTimeout);
          unblockTimeout = null;
        }
        console.log("[Hotkeys] Movement unblocked by manual move");
      }

      // Block mood messages while hotkeys are enabled
      if (enabled && msg?.type === "mood") {
        // Prevent mood message from being sent
        return false;
      }

      return true;
    });

    // Listen for incoming messages
    window.SkyskraberCore.onMessage((msg) => {
      /******** ROOM ENTRY ********/
      if (msg?.room?.id) {
        navigationFrozen = false;
        currentRoomId = msg.room.id;
      }

      if (msg?.room?.fields) {
        roomExits = extractScreenRelativeExits(msg.room.fields);
      }

      // Listen for itemTypeId 232
      if (msg?.items?.updates) {
        for (const update of msg.items.updates) {
          if (update.itemTypeId === 232) {
            blockedItemId = update.id;
            navigationFrozen = true;
            if (unblockTimeout) clearTimeout(unblockTimeout);
            unblockTimeout = setTimeout(() => {
              navigationFrozen = false;
              blockedItemId = null;
              console.log("[Hotkeys] Movement auto-unblocked after 8s");
            }, 8000);
            console.log(`[Hotkeys] Movement blocked for item id ${blockedItemId}`);
          }
        }
      }
      // Unfreeze if blocked item is removed
      if (blockedItemId && msg?.items?.removes?.includes(`item-${blockedItemId}`)) {
        navigationFrozen = false;
        blockedItemId = null;
        if (unblockTimeout) {
          clearTimeout(unblockTimeout);
          unblockTimeout = null;
        }
        console.log("[Hotkeys] Movement unblocked after item removal");
      }
      // Listen for pick up of blocked item
      if (blockedItemId && msg?.type === "pick up" && msg?.data?.item === `item-${blockedItemId}`) {
        navigationFrozen = false;
        blockedItemId = null;
        if (unblockTimeout) {
          clearTimeout(unblockTimeout);
          unblockTimeout = null;
        }
        console.log("[Hotkeys] Movement unblocked after pick up");
      }
    });
  }

  start();
})();

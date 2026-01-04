// ==UserScript==
// @name         Inventory Keyboard Hotkey for SMMO
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Hotkeys for managing inventory in Simple MMO: A: Select All, C: Collect All, S: Sell All to NPC, D: Add All to Dump.
// @author       @dngda
// @match        https://web.simple-mmo.com/inventory*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=simple-mmo.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554475/Inventory%20Keyboard%20Hotkey%20for%20SMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/554475/Inventory%20Keyboard%20Hotkey%20for%20SMMO.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // ================== UTIL: INPUT STATE ==================
    function isTypingElement() {
        const ae = document.activeElement;
        if (!ae) return false;
        const tag = (ae.tagName || "").toLowerCase();

        const type = (ae.type || "").toLowerCase();
        if (tag === "input") {
            const nonTypingTypes = [
                "button",
                "checkbox",
                "radio",
                "submit",
                "reset",
                "hidden",
                "image",
            ];
            if (nonTypingTypes.includes(type)) {
                return false;
            }
        }
        return (
            ["input", "textarea", "select"].includes(tag) ||
            !!ae.isContentEditable
        );
    }

    // ================== HOTKEYS ==================
    document.addEventListener(
        "keydown",
        (e) => {
            if (isTypingElement()) return;
            const singleKey =
                !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;

            if (e.code === "KeyA" && singleKey) {
                e.preventDefault();
                document
                    .querySelector('[x-on\\:change="checkAll(this);"]')
                    .click();
            }

            if (e.code === "KeyC" && singleKey) {
                e.preventDefault();
                collectAllItems();
            }

            if (e.code === "KeyS" && singleKey) {
                e.preventDefault();
                sellAllToNPC();
            }

            if (e.code === "KeyD" && singleKey) {
                e.preventDefault();
                addAllToDump();
            }
        },
        { passive: false }
    );

    function createBadge(id) {
        const bid = id;
        let badge = document.getElementById(bid);
        if (!badge) {
            badge = document.createElement("div");
            badge.id = bid;
            badge.style.cssText = [
                "position:fixed",
                "right:8px",
                "bottom:8px",
                "z-index:1001",
                "background:#4f46e5",
                "color:#fff",
                "padding:6px 8px",
                "font-size:12px",
                "border-radius:6px",
                "opacity:.9",
                "font-family:sans-serif",
                "cursor:help",
            ].join(";");
            document.body.appendChild(badge);
        }

        return badge;
    }

    // ================== Info ==================
    function ensureUI() {
        // Badge info
        const badge = createBadge("inventory-badge");
        badge.textContent = `[A] Select All, [C] Collect All, [S] Sell All to NPC, [D] Add All to Dump`;
    }

    ensureUI();
})();

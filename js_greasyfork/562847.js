// ==UserScript==
// @name         Skyskraber Smart Arrow Navigation Only
// @namespace    local.skyskraber.arrows
// @version      1.0.0
// @description  Arrow-key room navigation based on door position
// @match        https://www.skyskraber.dk/chat*
// @match        https://skyskraber.dk/chat*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562847/Skyskraber%20Smart%20Arrow%20Navigation%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/562847/Skyskraber%20Smart%20Arrow%20Navigation%20Only.meta.js
// ==/UserScript==

(() => {
    "use strict";

    let wsRef = null;
    let roomExits = {};
    let arrowsEnabled = false;

    /******************************************************************
     * WEBSOCKET HOOK
     ******************************************************************/
    (function hookWebSocket() {
        const nativeSend = WebSocket.prototype.send;

        WebSocket.prototype.send = function (...args) {
            if (!wsRef) {
                wsRef = this;
                attachMessageListener(wsRef);
            }
            return nativeSend.call(this, ...args);
        };
    })();

    /******************************************************************
     * MESSAGE LISTENER
     ******************************************************************/
    function attachMessageListener(ws) {
        ws.addEventListener("message", e => {
            try {
                const msg = JSON.parse(e.data);

                if (msg?.room?.fields) {
                    arrowsEnabled = true;
                    roomExits = extractScreenRelativeExits(msg.room.fields);
                }
            } catch {}
        });
    }

    /******************************************************************
     * DOOR → ARROW MAPPING (CENTER-RELATIVE)
     ******************************************************************/
    function extractScreenRelativeExits(fields) {
        const doors = fields.filter(
            f => f.state === "door" && typeof f.goto === "number"
        );

        if (!doors.length) return {};

        const xs = fields.map(f => f.x);
        const ys = fields.map(f => f.y);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const exits = {};

        for (const door of doors) {
            const dx = door.x - centerX;
            const dy = door.y - centerY;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx < 0) exits.ArrowLeft = door.goto;
                else exits.ArrowRight = door.goto;
            } else {
                if (dy < 0) exits.ArrowUp = door.goto;
                else exits.ArrowDown = door.goto;
            }
        }

        // Remove duplicate room targets
        const used = new Set();
        for (const key of Object.keys(exits)) {
            if (used.has(exits[key])) {
                delete exits[key];
            } else {
                used.add(exits[key]);
            }
        }

        return exits;
    }

    /******************************************************************
     * KEY HANDLER
     ******************************************************************/
    document.addEventListener("keydown", e => {
        if (!arrowsEnabled || !wsRef) return;

        const targetRoom = roomExits[e.key];
        if (!targetRoom) return;

        wsRef.send(JSON.stringify({
            type: "goto",
            data: { room: targetRoom }
        }));

        e.preventDefault();
    });
})();

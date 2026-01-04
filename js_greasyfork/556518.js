// ==UserScript==
// @name         Voxiom Lock Screen v2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Blocks voxiom.io with a realistic maintenance/error screen, unlock with secret SPACE+Y and code. Includes Lock button when site is unlocked.
// @match        https://voxiom.io/*
// @match        http://voxiom.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556518/Voxiom%20Lock%20Screen%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/556518/Voxiom%20Lock%20Screen%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ACCESS_CODE   = "000";
    const OVERLAY_ID    = "voxiom-lockscreen-overlay";
    const UNLOCKED_KEY  = "voxiom_unlocked";
    const LOCK_BTN_ID   = "voxiom-lockscreen-lockbtn";

    // ---- Core helpers ----
    function lockSite() {
        sessionStorage.removeItem(UNLOCKED_KEY);
        removeLockButton();
        createOverlay();
    }

    function unlockSite() {
        sessionStorage.setItem(UNLOCKED_KEY, "yes");

        const ov = document.getElementById(OVERLAY_ID);
        if (ov) ov.remove();

        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        // Once unlocked, show lock button (not the error screen)
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", createLockButton, { once: true });
        } else {
            createLockButton();
        }
    }

    function removeLockButton() {
        const btn = document.getElementById(LOCK_BTN_ID);
        if (btn) btn.remove();
    }

    function createLockButton() {
        if (document.getElementById(LOCK_BTN_ID)) return;
        if (!document.body) return; // safety

        const lockBtn = document.createElement("button");
        lockBtn.id = LOCK_BTN_ID;
        lockBtn.textContent = "Lock Voxiom";

        Object.assign(lockBtn.style, {
            position: "fixed",
            top: "10px",
            left: "10px",
            padding: "6px 12px",
            borderRadius: "6px",
            background: "#d32f2f",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            zIndex: 999999999,
            fontFamily: "Segoe UI, sans-serif",
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)"
        });

        lockBtn.onclick = lockSite;
        document.body.appendChild(lockBtn);
    }

    // ---- Fake maintenance / error overlay ----
    function createOverlay() {
        if (document.getElementById(OVERLAY_ID)) return;
        if (!document.body) {
            // If body isn't ready yet, wait.
            document.addEventListener("DOMContentLoaded", createOverlay, { once: true });
            return;
        }

        const overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;

        Object.assign(overlay.style, {
            position: 'fixed',
            top: "0", left: "0",
            width: "100vw",
            height: "100vh",
            background: "#f5f5f5",
            color: "#222",
            fontFamily: "Segoe UI, system-ui, sans-serif",
            zIndex: 999999999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            userSelect: "none",
        });

        overlay.innerHTML = `
            <div style="max-width:460px; padding:24px;">
                <h1 style="font-size:26px; margin-bottom:8px; font-weight:600;">
                    Voxiom is temporarily unavailable
                </h1>
                <p style="font-size:15px; margin:4px 0; opacity:0.85;">
                    We’re currently performing scheduled maintenance and upgrades.
                </p>
                <p style="font-size:14px; margin-top:6px; opacity:0.7;">
                    Please try again in a little while. If the problem continues,
                    check your connection or try another browser.
                </p>
                <p style="font-size:12px; margin-top:16px; opacity:0.5;">
                    Reference: maintenance-ERR-502
                </p>

                <div id="unlock-box" style="display:none; margin-top:28px;">
                    <input id="unlock-input" type="password" placeholder="Access code"
                        style="padding:9px 10px; font-size:15px; border:1px solid #ccc;
                               border-radius:6px; width:220px; box-sizing:border-box;">
                    <button id="unlock-btn"
                        style="margin-left:8px; padding:9px 14px; border:none;
                               border-radius:6px; background:#1976d2; color:white;
                               cursor:pointer; font-size:14px;">
                        Continue
                    </button>
                    <p id="unlock-msg" style="color:#d32f2f; font-size:13px; height:18px; margin-top:6px;"></p>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        const unlockBox = document.getElementById("unlock-box");
        const input     = document.getElementById("unlock-input");
        const btn       = document.getElementById("unlock-btn");
        const msg       = document.getElementById("unlock-msg");

        // Unlock button click
        btn.onclick = () => {
            if (input.value.trim() === ACCESS_CODE) {
                unlockSite();
            } else {
                msg.textContent = "Incorrect code. Please try again.";
                input.value = "";
                input.focus();
            }
        };

        // Enter key submits code
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") btn.click();
        });

        // Secret key combo: SPACE + Y to reveal unlock box
        let spacePressed = false;
        let yPressed = false;

        window.addEventListener("keydown", function(e) {
            if (e.code === "Space") spacePressed = true;
            if (e.key && e.key.toLowerCase() === "y") yPressed = true;

            if (spacePressed && yPressed) {
                unlockBox.style.display = "block";
                input.focus();
            }
        });

        window.addEventListener("keyup", function(e) {
            if (e.code === "Space") spacePressed = false;
            if (e.key && e.key.toLowerCase() === "y") yPressed = false;
        });
    }

    // ---- Initial state on page load ----
    if (sessionStorage.getItem(UNLOCKED_KEY) === "yes") {
        // Site is unlocked → only show the lock button
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", createLockButton, { once: true });
        } else {
            createLockButton();
        }
    } else {
        // Site is locked → show fake error/maintenance screen (no lock button)
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", createOverlay, { once: true });
        } else {
            createOverlay();
        }
    }
})();
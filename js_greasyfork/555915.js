// ==UserScript==
// @name         Better PTT login
// @namespace    NoNameSpace
// @version      1.0.1
// @description  Use a popup to enter credentials, make your password managers work.
// @match        https://term.ptt.cc/
// @match        https://term.ptt2.cc/
// @icon         https://term.ptt.cc/assets/logo_connect.c8fa42175331bab52f24fd5e64cf69bb.png
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555915/Better%20PTT%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/555915/Better%20PTT%20login.meta.js
// ==/UserScript==

let USERNAME = null;
let PASSWORD = null;

// --------------------------------------------------------
// 1. Override WebSocket before any connection
// --------------------------------------------------------
const RealWebSocket = window.WebSocket;

class FakeWebSocket extends RealWebSocket {
    constructor(url) {
        super(url);

        this.sendStr = (e) => {
            for (let t = 0; t < e.length; t += 1000) {
                const part = e.substring(t, t + 1000);
                const bytes = new Uint8Array(part.split("").map(ch => ch.charCodeAt(0)));
                this.send(bytes.buffer);
            }
        };

        this.addEventListener("open", () => {
            if (USERNAME && PASSWORD) {
                loginPTT(this);
            } else {
                console.log("[PTT] Waiting for credentials from popup...");
                // Wait for credentials to arrive
                const interval = setInterval(() => {
                    if (USERNAME && PASSWORD) {
                        clearInterval(interval);
                        loginPTT(this);
                    }
                }, 200);
            }
        });
    }
}

window.WebSocket = FakeWebSocket;

// --------------------------------------------------------
// 2. Helper to send credentials to PTT via WebSocket
// --------------------------------------------------------
function loginPTT(ws) {
    console.log("[PTT] Logging in with provided credentials");
    ws.sendStr(USERNAME + "\x0d");
    ws.sendStr(PASSWORD + "\x0d");
    setTimeout(() => {
        ws.sendStr("\x0d");
        ws.sendStr("\x08");
        ws.sendStr("\x08");
        ws.sendStr("\x0d");
        ws.sendStr("\x1a");
        ws.sendStr("\x66");
    }, 500);
}

// --------------------------------------------------------
// 3. Listen for credentials from popup
// --------------------------------------------------------
window.addEventListener("message", ev => {
    if (!ev.data || ev.data.type !== "CREDENTIALS") return;

    USERNAME = ev.data.username;
    PASSWORD = ev.data.password;

    console.log("[PTT] Received credentials:", USERNAME);
});

// --------------------------------------------------------
// 4. Open popup for user credentials
// --------------------------------------------------------
function openLoginPopup() {
    // Prevent multiple modals
    if (document.getElementById("BetterPTTDialog")) return;

    // Container div
    const container = document.createElement("div");
    container.id = "BetterPTTDialog";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.zIndex = "9999";
    container.style.backgroundColor = "rgba(0,0,0,0.5)";

    // Dialog element
    const dialog = document.createElement("dialog");
    dialog.style.padding = "30px";
    dialog.style.borderRadius = "12px";
    dialog.style.border = "none";
    dialog.style.backgroundColor = "#1c1c1e";
    dialog.style.color = "#d1d1d6";
    dialog.style.fontFamily = "-apple-system, BlinkMacSystemFont, sans-serif";
    dialog.style.width = "320px";
    dialog.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";

    dialog.innerHTML = `
        <h2 style="margin-bottom:20px; text-align:center;">Better PTT Login</h2>
        <form method="dialog" id="pttLoginForm" style="display:flex; flex-direction:column;">
            <input id="u" name="username" autocomplete="username" placeholder="Username" required
                style="margin-bottom:12px;padding:10px;border-radius:8px;border:1px solid #3a3a3c;background-color:#2c2c2e;color:#d1d1d6;font-size:14px;">
            <input id="p" type="password" name="password" autocomplete="current-password" placeholder="Password" required
                style="margin-bottom:20px;padding:10px;border-radius:8px;border:1px solid #3a3a3c;background-color:#2c2c2e;color:#d1d1d6;font-size:14px;">
            <button type="submit" style="padding:10px;border-radius:8px;border:none;background-color:#0a84ff;color:#fff;font-size:16px;cursor:pointer;">Login</button>
        </form>
        <div style="text-align:center;margin-top:10px;">
            <button type="button" id="closeBtn" style="background:none;border:none;color:#d1d1d6;opacity:0.6;cursor:pointer;">✖ Close</button>
        </div>
    `;

    container.appendChild(dialog);
    document.body.appendChild(container);

    // Username input
    const u = dialog.querySelector("#u");
    const p = dialog.querySelector("#p");

    // Stop key events from propagating to page
    ['keydown', 'keypress', 'keyup'].forEach(eventName => {
        container.addEventListener(eventName, e => e.stopPropagation());
    });

    // Submit form
    const form = dialog.querySelector("#pttLoginForm");
    form.addEventListener("submit", e => {
        e.preventDefault();

        if (u.value && p.value) {
            window.postMessage({
                type: "CREDENTIALS",
                username: u.value,
                password: p.value
            }, "*");
            closeModal();
        }
    });

    // ESC key closes modal
    document.addEventListener("keydown", function escHandler(e) {
        if (e.key === "Escape") closeModal();
    });

    // Close button
    dialog.querySelector("#closeBtn").addEventListener("click", closeModal);

    // Show modal
    dialog.showModal();

    // Close function
    function closeModal() {
        if (!container.parentNode) return; // already removed
        dialog.close();
        container.remove();
        dialog.removeEventListener("cancel", cancelHandler);
    }

    // Handle Esc key reliably
    function cancelHandler(e) {
        e.preventDefault(); // prevent default <dialog> Esc behavior
        closeModal();
    }

    // Listen for Esc on the dialog itself
    dialog.addEventListener("cancel", cancelHandler);
}

// --------------------------------------------------------
// 5. Trigger popup on DOMContentLoaded
// --------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
    openLoginPopup();
});

// --------------------------------------------------------
// 6. Prevent PTT's beforeunload handler
// --------------------------------------------------------
const origAEL = window.addEventListener;
window.addEventListener = function (...args) {
    if (args[0] === "beforeunload") return;
    return origAEL.apply(this, args);
};

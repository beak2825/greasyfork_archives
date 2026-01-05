// ==UserScript==
// @name         Torn Dump - Search/Pickup Toggle Button
// @namespace    torn-dump-toggle
// @version      1.1
// @description  Adds a toggle button on dump.php to Search then (if success) PickUp; shows server text.
// @match        https://www.torn.com/dump.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558923/Torn%20Dump%20-%20SearchPickup%20Toggle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/558923/Torn%20Dump%20-%20SearchPickup%20Toggle%20Button.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const logPrefix = "[DumpToggle]";
    let nextIsPickup = false;

    function requestJSON(url, options = {}) {
        return fetch(url, {
            method: options.method || "GET",
            credentials: "same-origin",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                ...(options.headers || {}),
            },
            body: options.body,
        }).then(async (res) => {
            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch {
                console.error(logPrefix, "Non-JSON response:", text);
                throw new Error("Invalid JSON response");
            }
        });
    }

    function ensureUI() {
        const h4 = document.querySelector("h4#skip-to-content");
        if (!h4 || !h4.parentElement?.parentElement) {
            console.log(logPrefix, "Target header not found");
            return null;
        }

        const target = h4.parentElement.parentElement;

        if (target.querySelector("#dumpToggleContainer")) {
            return {
                btn: target.querySelector("#dumpToggleBtn"),
                out: target.querySelector("#dumpToggleOut"),
            };
        }

        const container = document.createElement("div");
        container.id = "dumpToggleContainer";
        container.style.cssText = `
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 6px;
      padding: 8px 10px;
      background: rgba(0,0,0,0.25);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      font-size: 12px;
    `;

        const btn = document.createElement("button");
        btn.id = "dumpToggleBtn";
        btn.textContent = "Dump: Search";
        btn.style.cssText = `
      padding: 5px 12px;
      border-radius: 4px;
      border: 1px solid #444;
      background: linear-gradient(#3a3a3a, #222);
      color: #e6e6e6;
      cursor: pointer;
      font-weight: 600;
    `;

        btn.onmouseenter = () => {
            if (!btn.disabled) btn.style.filter = "brightness(1.1)";
        };
        btn.onmouseleave = () => {
            btn.style.filter = "";
        };

        const out = document.createElement("div");
        out.id = "dumpToggleOut";
        out.style.cssText = `
      min-height: 16px;
      color: #cfcfcf;
      opacity: 0.95;
    `;

        container.appendChild(btn);
        container.appendChild(out);

        const parent = h4.parentElement;
        const grandparent = parent.parentElement;
        grandparent.insertBefore(container, parent.nextSibling);

        return { btn, out };
    }

    function updateButtonLabel(btn) {
        btn.textContent = nextIsPickup ? "Dump: Pick Up" : "Dump: Search";
    }

    async function doSearch(out) {
        const rfc = getRFC();
        if (!rfc) {
            out.textContent = "Missing rfc.";
            return;
        }

        out.textContent = "Searching the dump…";
        const url = `https://www.torn.com/dump.php?step=search&rfcv=${encodeURIComponent(rfc)}`;

        const data = await requestJSON(url);
        out.innerHTML = data?.text ?? "";

        nextIsPickup = !!data?.success;
    }

    async function doPickup(out) {
        const rfc = getRFC();
        if (!rfc) {
            out.textContent = "Missing rfc.";
            return;
        }

        out.textContent = "Picking up item…";
        const url = `https://www.torn.com/dump.php?step=pickUp&rfcv=${encodeURIComponent(rfc)}&ajax=dump`;

        const data = await requestJSON(url);
        out.innerHTML = data?.text ?? "";

        nextIsPickup = false;
    }

    function getRFC() {
        const cookies = document.cookie.split("; ");
        for (const c of cookies) {
            const [name, value] = c.split("=");
            if (name === "rfc_v") return value;
        }
        return null;
    }

    function init() {
        const ui = ensureUI();
        if (!ui) return;

        const { btn, out } = ui;
        updateButtonLabel(btn);

        btn.addEventListener("click", async () => {
            btn.disabled = true;
            btn.style.opacity = "0.6";

            try {
                if (nextIsPickup) {
                    await doPickup(out);
                } else {
                    await doSearch(out);
                }
            } catch (e) {
                console.error(logPrefix, e);
                out.textContent = "Error occurred.";
                nextIsPickup = false;
            } finally {
                btn.disabled = false;
                btn.style.opacity = "1";
                updateButtonLabel(btn);
            }
        });
    }

    document.readyState === "loading"
        ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();

// ==UserScript==
// @name         Torn - Quick Dump
// @namespace    odung
// @version      0.1
// @description  Adds a button that searches the dump without an animation, and utilizes the auto pickup feature to search faster
// @match        https://www.torn.com/dump.php*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558936/Torn%20-%20Quick%20Dump.user.js
// @updateURL https://update.greasyfork.org/scripts/558936/Torn%20-%20Quick%20Dump.meta.js
// ==/UserScript==

(() => {
    "use strict";

    function getRFC() {
        const cookies = document.cookie.split("; ");
        for (const c of cookies) {
            const [name, value] = c.split("=");
            if (name === "rfc_v") return value;
        }
        return null;
    }

    function requestJSON(url) {
        return fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        }).then(async res => {
            const text = await res.text();
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error("[DumpSearch] Non-JSON response:", text);
                throw new Error("Invalid JSON response");
            }
        });
    }

    function ensureUI() {
        const h4 = document.querySelector("h4#skip-to-content");
        if (!h4 || !h4.parentElement?.parentElement) return false;

        const parent = h4.parentElement;
        const grandparent = parent.parentElement;

        if (grandparent.querySelector("#dumpSearchContainer")) {
            return true;
        }

        const container = document.createElement("div");
        container.id = "dumpSearchContainer";
        container.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 6px 0;
            padding: 8px 10px;
            background: rgba(0,0,0,0.25);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 6px;
            font-size: 12px;
        `;

        const btn = document.createElement("button");
        btn.textContent = "Quick Dump";
        btn.style.cssText = `
            padding: 5px 12px;
            border-radius: 4px;
            border: 1px solid #444;
            background: linear-gradient(#3a3a3a, #222);
            color: #e6e6e6;
            cursor: pointer;
            font-weight: 600;
        `;

        btn.onmouseenter = () => { btn.style.filter = "brightness(1.1)"};
        btn.onmouseleave = () => { btn.style.filter = ""};

        const out = document.createElement("div");
        out.style.cssText = `
            min-height: 16px;
            color: #cfcfcf;
            opacity: 0.95;
        `;

        btn.addEventListener("click", async () => {
            const rfc = getRFC();
            if (!rfc) {
                out.textContent = "Missing rfc.";
                return;
            }

            btn.disabled = true;
            btn.style.opacity = "0.6";
            out.textContent = "Searching the dump…";

            try {
                const url = `https://www.torn.com/dump.php?step=search&rfcv=${encodeURIComponent(rfc)}`;
                const data = await requestJSON(url);
                out.innerHTML = data?.text ?? "";
            } catch (e) {
                console.error(e);
                out.textContent = "Search failed.";
            } finally {
                btn.disabled = false;
                btn.style.opacity = "1";
            }
        });

        container.appendChild(btn);
        container.appendChild(out);

        grandparent.insertBefore(container, parent.nextSibling);

        return true;
    }

    const observer = new MutationObserver(() => {
        if (ensureUI()) {
            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

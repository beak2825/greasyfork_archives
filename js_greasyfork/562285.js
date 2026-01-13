// ==UserScript==
// @name         Copilot Search Overlay (Lazy First-Match, Draggable, Deduped, Auto-Load Sidebar)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Search Copilot conversations; pause on first match; resume on Next; draggable overlay; auto-load all sidebar conversations
// @match        https://copilot.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562285/Copilot%20Search%20Overlay%20%28Lazy%20First-Match%2C%20Draggable%2C%20Deduped%2C%20Auto-Load%20Sidebar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562285/Copilot%20Search%20Overlay%20%28Lazy%20First-Match%2C%20Draggable%2C%20Deduped%2C%20Auto-Load%20Sidebar%29.meta.js
// ==/UserScript==
// @license MIT

(function() {
    'use strict';

    /******************************
     *  GLOBAL STATE
     ******************************/
    let matches = [];
    let currentIndex = -1;
    let paused = false;
    let keyword = "";
    let convoNodes = [];
    let currentConvoIndex = 0;
    let seen = new Set();

    /******************************
     *  UTIL: WAIT FOR ELEMENT
     ******************************/
    function waitFor(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const start = performance.now();
            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                } else if (performance.now() - start > timeout) {
                    clearInterval(timer);
                    reject("Timeout waiting for " + selector);
                }
            }, 100);
        });
    }

    /******************************
     *  MAKE OVERLAY DRAGGABLE
     ******************************/
    function makeOverlayDraggable(overlay) {
        const handle = overlay.querySelector("#dragHandle");
        let offsetX = 0, offsetY = 0;
        let isDragging = false;

        handle.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - overlay.offsetLeft;
            offsetY = e.clientY - overlay.offsetTop;
            overlay.style.transition = "none";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            overlay.style.left = (e.clientX - offsetX) + "px";
            overlay.style.top = (e.clientY - offsetY) + "px";
            overlay.style.right = "auto";
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            overlay.style.transition = "";
        });
    }
    /******************************
     *  AUTO-LOAD SIDEBAR
     ******************************/
    async function loadAllConversations() {
        const status = document.getElementById("searchStatus");
        status.innerText = "Loading all conversations...";

        let sidebar = document.querySelector('.t-custom-scrollbar.h-full.overflow-x-hidden.overflow-y-auto');
        if (!sidebar) {
            status.innerText = "Sidebar not found.";
            return;
        }

        let lastCount = 0;
        let stableTries = 0;

        while (stableTries < 5) {
            sidebar.scrollTop = sidebar.scrollHeight;
            await new Promise(r => setTimeout(r, 400));

            const items = document.querySelectorAll('p.truncate[title]');
            if (items.length === lastCount) {
                stableTries++;
            } else {
                lastCount = items.length;
                stableTries = 0;
            }
        }

        status.innerText = `Loaded ${lastCount} conversations.`;
    }

    /******************************
     *  OVERLAY CREATION
     ******************************/
    function injectOverlay() {
        if (document.getElementById("copilotSearchOverlay")) return;

        const overlay = document.createElement("div");
        overlay.id = "copilotSearchOverlay";
        overlay.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 260px;
            background: #1e1e1e;
            color: white;
            padding: 0;
            border-radius: 10px;
            z-index: 2147483647;
            font-family: sans-serif;
            box-shadow: 0 0 12px rgba(0,0,0,0.4);
            user-select: none;
        `;

        overlay.innerHTML = `
            <div id="dragHandle"
                style="cursor: move; padding: 10px; background: #333; border-radius: 10px 10px 0 0; font-weight: bold;">
                🔍 Copilot Search
            </div>

            <div style="padding: 15px;">
                <input id="searchInput" type="text" placeholder="Search keyword..."
                    style="width: 100%; padding: 6px; border-radius: 6px; border: none; margin-bottom: 10px; color: black !important; background: white;">

                <button id="startSearchBtn" style="width: 100%; padding: 6px; margin-bottom: 10px;">
                    Start Search
                </button>

                <div id="searchStatus" style="font-size: 12px; margin-bottom: 10px; opacity: 0.8;">
                    Idle
                </div>

                <button id="prevBtn" style="width: 48%; padding: 6px;">⬅ Prev</button>
                <button id="nextBtn" style="width: 48%; padding: 6px; float: right;">Next ➡</button>
            </div>
        `;

        document.body.appendChild(overlay);
        attachHandlers();
        makeOverlayDraggable(overlay);
    }

    /******************************
     *  BUTTON HANDLERS
     ******************************/
    function attachHandlers() {
        document.getElementById("startSearchBtn").onclick = startSearch;

        document.getElementById("prevBtn").onclick = () => {
            if (currentIndex > 0) showMatch(currentIndex - 1);
        };

        document.getElementById("nextBtn").onclick = () => {
            if (paused) {
                paused = false;
                scanNextConversation();
                return;
            }
            if (currentIndex < matches.length - 1) {
                showMatch(currentIndex + 1);
            }
        };
    }

    /******************************
     *  START SEARCH
     ******************************/
    async function startSearch() {
        keyword = document.getElementById("searchInput").value.trim().toLowerCase();
        if (!keyword) return alert("Enter a keyword first.");

        matches = [];
        currentIndex = -1;
        paused = false;
        seen.clear();

        await loadAllConversations();

        const status = document.getElementById("searchStatus");
        status.innerText = "Collecting conversations...";

        convoNodes = [...document.querySelectorAll('p.truncate[title]')]
            .map(p => p.closest("div, button"))
            .filter(Boolean);

        currentConvoIndex = 0;
        status.innerText = "Scanning conversations...";

        scanNextConversation();
    }
    /******************************
     *  MATCH DISPLAY
     ******************************/
    function highlightMatch(msg) {
        msg.style.outline = "3px solid orange";
        msg.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function showMatch(index) {
        if (index < 0 || index >= matches.length) return;
        currentIndex = index;
        highlightMatch(matches[currentIndex]);
        document.getElementById("searchStatus").innerText =
            `Match ${currentIndex + 1} of ${matches.length}`;
    }

    /******************************
     *  SCAN CONVERSATIONS LAZILY
     ******************************/
    async function scanNextConversation() {
        if (paused) return;

        const status = document.getElementById("searchStatus");

        if (currentConvoIndex >= convoNodes.length) {
            status.innerText = "Search complete.";
            return;
        }

        const convo = convoNodes[currentConvoIndex];
        status.innerText = `Opening conversation ${currentConvoIndex + 1}/${convoNodes.length}...`;

        convo.click();

        try {
            await waitFor('div[data-content="user-message"], span.font-ligatures-none.whitespace-pre-wrap');
        } catch {
            currentConvoIndex++;
            return scanNextConversation();
        }

        const messages = [
            ...document.querySelectorAll('div[data-content="user-message"]'),
            ...document.querySelectorAll('span.font-ligatures-none.whitespace-pre-wrap')
        ];

        for (const msg of messages) {
            const text = msg.innerText.toLowerCase();
            if (text.includes(keyword)) {
                const signature = text.trim() + "::" + currentConvoIndex;

                if (!seen.has(signature)) {
                    seen.add(signature);
                    matches.push(msg);
                    currentIndex = matches.length - 1;

                    highlightMatch(msg);
                    paused = true;

                    status.innerText = `Match ${currentIndex + 1} found. Click Next to continue.`;
                    return;
                }
            }
        }

        currentConvoIndex++;
        scanNextConversation();
    }

    /******************************
     *  KEEP OVERLAY ALIVE
     ******************************/
    const observer = new MutationObserver(() => {
        if (!document.getElementById("copilotSearchOverlay")) {
            injectOverlay();
        }
    });

    window.addEventListener("load", () => {
        setTimeout(() => {
            injectOverlay();
            observer.observe(document.body, { childList: true, subtree: true });
        }, 1500);
    });

})();

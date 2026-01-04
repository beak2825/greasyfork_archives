// ==UserScript==
// @name         Torn - Copy Last Incoming Message (Exact DOM Version)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Copies the most recent incoming chat message based on actual Torn DOM
// @author       yoyoyossarian
// @license      MIT
// @match        https://www.torn.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/556907/Torn%20-%20Copy%20Last%20Incoming%20Message%20%28Exact%20DOM%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556907/Torn%20-%20Copy%20Last%20Incoming%20Message%20%28Exact%20DOM%20Version%29.meta.js
// ==/UserScript==


(function () {
    "use strict";

    // ---------------------------------------------------------
    // Extract last incoming message EXACTLY from your chat DOM
    // ---------------------------------------------------------
    function getLastIncomingMessage(chatBox) {
        // Any element containing an <a href="/profiles.php?XID=????">
        // is an incoming message container.
        const possible = chatBox.querySelectorAll("div, span");

        let last = null;

        possible.forEach(el => {
            // Incoming messages always have a profile link of the sender
            const profileLink = el.querySelector('a[href*="profiles.php"]');
            if (!profileLink) return;

            // Real message text is ALWAYS in a span.root___Xw4jI inside the container
            const msgText = el.querySelector(".root___Xw4jI");
            if (!msgText) return;

            last = msgText.innerText.trim();
        });

        return last;
    }

    // ---------------------------------------------------------
    // Inject Copy button
    // ---------------------------------------------------------
    function injectCopyButton(chatBox) {
        if (chatBox.querySelector(".copy-last-msg-button")) return;

        // Torn new + old chat input areas
        const inputContainer =
            chatBox.querySelector(".root___WUd1h") ||
            chatBox.querySelector(".chat-box-footer___YK914");

        if (!inputContainer) return;

        // Button container area
        let buttonContainer = chatBox.querySelector(".copy-button-container");
        if (!buttonContainer) {
            buttonContainer = document.createElement("div");
            buttonContainer.className = "copy-button-container";
            buttonContainer.style.display = "flex";
            buttonContainer.style.flexWrap = "wrap";
            inputContainer.insertAdjacentElement("beforebegin", buttonContainer);
        }

        // Create button
        const btn = document.createElement("button");
        btn.innerText = "Copy Msg";
        btn.className = "copy-last-msg-button";
        btn.style.background = "#6c5ce7";
        btn.style.color = "white";
        btn.style.margin = "4px";
        btn.style.padding = "4px 8px";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";
        btn.style.border = "none";

        btn.addEventListener("click", () => {
            const msg = getLastIncomingMessage(chatBox);
            if (!msg) {
                console.log("[CopyLastMsg] No incoming message found");
                return;
            }
            GM_setClipboard(msg);
            console.log("[CopyLastMsg] COPIED:", msg);
        });

        buttonContainer.appendChild(btn);
    }

    // ---------------------------------------------------------
    // Auto-detect all chat windows (same logic as Enhanced Buttons)
    // ---------------------------------------------------------
    const observer = new MutationObserver(() => {
        const chatBoxes = document.querySelectorAll(
            '.root___FmdS_, .chat-box___mHm01, div[id^="private-"]'
        );
        chatBoxes.forEach(injectCopyButton);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
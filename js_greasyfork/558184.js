// ==UserScript==
// @name         Branch/Butter/Thread Notifier
// @namespace    http://tampermonkey.net/
// @version      2025-12-07
// @description  alert when you get a rare drop from any action
// @author       Gragatrim
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558184/BranchButterThread%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/558184/BranchButterThread%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    style.textContent = `
.mwi-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 400px;
    background: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 14px 18px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    z-index: 999999;
    font-family: sans-serif;
    font-size: 14px;
}
        .mwi-toast-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            font-weight: bold;
        }
        .mwi-toast-close {
            border: none;
            background: transparent;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            padding-left: 8px;
        }
    `;
    document.head.appendChild(style);
    // 2) Function to show the popup
    function showNotification(message) {
        const toast = document.createElement('div');
        toast.className = 'mwi-toast';

        const header = document.createElement('div');
        header.className = 'mwi-toast-header';
        header.textContent = 'MWI Notice';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'mwi-toast-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });

        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.textContent = message;

        toast.appendChild(header);
        toast.appendChild(body);

        document.body.appendChild(toast);
    }



    let item_hrid_to_name;


    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) return oriGet.call(this);
            if (!socket.url.includes("api.milkywayidle.com/ws") && !socket.url.includes("api-test.milkywayidle.com/ws")) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });
            return handleMessage(message);
        }
    }

    function handleMessage(message) {
        try {
            const obj = JSON.parse(message);
            if (!obj) return message;

            if (obj.type === "action_completed") {
                for (const item of obj.endCharacterItems) {
                    if (item.itemHrid === "/items/branch_of_insight" || item.itemHrid == "/items/butter_of_proficiency" || item.itemHrid == "/items/thread_of_expertise") {
                        // Example: show a notification
                        showNotification("You got: " + item.itemHrid);

                        // If you only care about the first match, you can break
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
        return message;
    }
    function handleInitData() {
        const initClientData = localStorage.getItem('initClientData');
        if (!initClientData) {
            setTimeout(handleInitData, 500); // Retry if not ready
            return;
        }

        try {
            const data = JSON.parse(initClientData);
            item_hrid_to_name = {};

            // Properly map all item names
            for (const [hrid, details] of Object.entries(data.itemDetailMap)) {
                item_hrid_to_name[hrid] = details.name;
            }

            console.log("Translations loaded:", item_hrid_to_name);
        } catch (error) {
            console.error('Data parsing failed:', error);
        }
    }
    hookWS();
})();
// ==UserScript==
// @name         Auto-gpt4o
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Automatically force GPT-4o, even if switched back to GPT-5
// @author       Prof_Bum
// @match        https://chatgpt.com/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @downloadURL https://update.greasyfork.org/scripts/552386/Auto-gpt4o.user.js
// @updateURL https://update.greasyfork.org/scripts/552386/Auto-gpt4o.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const preferredModelName = "GPT-4o";
    let menuAlreadyOpened = false;
    let legacyMenuOpened = false;
    let gpt4oSelected = false;
    let lastModel = null;

    const TOGGLE_ID = "gpt4o-toggle";
    const TOGGLE_STATE_KEY = "gpt4o-toggle-enabled";

    function getToggleState() {
        return JSON.parse(localStorage.getItem(TOGGLE_STATE_KEY) || "true");
    }

    function createToggleButton(enabled) {
        const btn = document.createElement("button");
        btn.id = TOGGLE_ID;
        btn.textContent = enabled ? "Auto 4o: ON" : "Auto 4o: OFF";
        btn.style = `
            margin-left: 8px;
            padding: 4px 10px;
            font-size: 12px;
            border-radius: 6px;
            border: 1px solid #888;
            background-color: ${enabled ? "#4caf50" : "#aaa"};
            color: white;
            cursor: pointer;
        `;

        btn.onclick = () => {
            const newState = !getToggleState();
            localStorage.setItem(TOGGLE_STATE_KEY, JSON.stringify(newState));
            btn.textContent = newState ? "Auto 4o: ON" : "Auto 4o: OFF";
            btn.style.backgroundColor = newState ? "#4caf50" : "#aaa";
            console.log(`[GPT4o Toggle] Switched to ${newState ? "ENABLED" : "DISABLED"}`);
        };

        return btn;
    }

    function isInsideMain(el) {
        let node = el;
        while (node) {
            if (node.tagName === "MAIN") return true;
            node = node.parentElement;
        }
        return false;
    }

    function injectToggleIntoModelSwitcher() {
        const switchers = document.querySelectorAll('[data-testid="model-switcher-dropdown-button"]');

        for (const btn of switchers) {
            if (isInsideMain(btn)) {
                const parentFlex = btn.parentElement;
                if (!parentFlex || document.getElementById(TOGGLE_ID)) return;

                // Hydrated check: must include readable model label
                if (!btn.innerText.includes("ChatGPT")) return;

                const toggle = createToggleButton(getToggleState());
                parentFlex.appendChild(toggle);
                console.log("[GPT4o Toggle] Toggle injected into hydrated model switcher inside <main>");
                return;
            }
        }
    }

    function simulateClick(el) {
        el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
    let lastCheckTime = 0;
    const CHECK_COOLDOWN = 200; // ms
    const checkAndSwitchModel = () => {
        if (!getToggleState()) {
            return; // Toggle disabled, do nothing
        }
        const now = Date.now();
        const button = document.querySelector('button[aria-label^="Model selector"]');
        if (!button) return;

        const label = button.getAttribute("aria-label") || "";
        const currentModel = label.split("current model is")[1]?.trim();
        if (!currentModel) return;

        // Always detect model change instantly
        if (currentModel !== lastModel) {
            lastModel = currentModel;
            lastCheckTime = now; // reset cooldown window
            menuAlreadyOpened = false;
            legacyMenuOpened = false;
            gpt4oSelected = false;
            console.log(`[Model Switcher] Detected model change → ${currentModel}`);
        } else {
            // Only cooldown if no model change
            if (now - lastCheckTime < CHECK_COOLDOWN) return;
            lastCheckTime = now; // Update time so future calls can continue
        }

        if (currentModel !== preferredModelName && !menuAlreadyOpened) {
            console.log(`[Model Switcher] Model is "${currentModel}", switching to "${preferredModelName}"`);
            setTimeout(() => simulateClick(button), 100); // Open dropdown
            menuAlreadyOpened = true;
        }

        if (currentModel === preferredModelName && !gpt4oSelected) {
            console.log(`[Model Switcher] Already on preferred model: "${preferredModelName}"`);
            gpt4oSelected = true;
        }
    };


    const tryClickLegacyMenu = () => {
        if (legacyMenuOpened) return;

        const legacyItem = [...document.querySelectorAll('[role="menuitem"]')]
            .find(el => el.textContent.trim().includes("Legacy models"));

        if (legacyItem) {
            simulateClick(legacyItem);
            legacyMenuOpened = true;
            console.log("[Model Switcher]  Clicked Legacy models submenu");
        }
    };

    const trySelectGPT4o = () => {
        if (gpt4oSelected) return;

        const gpt4oItem = [...document.querySelectorAll('[role="menuitem"]')]
        .find(el => el.textContent.trim().toLowerCase().startsWith("gpt-4o"));

        if (gpt4oItem) {
            simulateClick(gpt4oItem);
            gpt4oSelected = true;
            console.log("[Model Switcher] Switched to GPT-4o");
            document.body.click();
        }
    };

    function injectToggleIfReady() {
        const modelButton = document.querySelector('[data-testid="model-switcher-dropdown-button"]');
        const parentFlex = modelButton?.parentElement;

        if (!modelButton || !parentFlex || document.getElementById("gpt4o-toggle")) return;

        // ONLY inject if we're inside <main>
        if (!isInsideMain(modelButton)) {
            console.log("[GPT4o Toggle]  Model button not inside <main>, skipping injection");
        return;
    }

    const label = modelButton.innerText.trim();
    if (!label.includes("ChatGPT")) {
        console.log("[GPT4o Toggle]  Waiting for hydration...");
        return;
    }

    const toggleBtn = createToggleButton(getToggleState());
    parentFlex.appendChild(toggleBtn);
    console.log("[GPT4o Toggle]  Injected toggle inside hydrated <main>");
}

    const observer = new MutationObserver(() => {
        checkAndSwitchModel();
        tryClickLegacyMenu();
        trySelectGPT4o();
        injectToggleIntoModelSwitcher();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

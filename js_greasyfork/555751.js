// ==UserScript==
// @name         Grok Imagine Auto-Retry
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  Automatically retries Grok Imagine generations on moderation, with a clean collapsible toolbar.
// @author       You
// @license      MIT
// @match        https://grok.com/imagine/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555751/Grok%20Imagine%20Auto-Retry.user.js
// @updateURL https://update.greasyfork.org/scripts/555751/Grok%20Imagine%20Auto-Retry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /********************
     * CONFIG + STATE
     ********************/

    const MAKE_VIDEO_SELECTOR = "button[aria-label='Make video']";

    const STORAGE_KEYS = {
        enabled:      "grokAutoRetry_enabled",
        maxAttempts:  "grokAutoRetry_maxAttempts",
        delayMs:      "grokAutoRetry_delayMs",
        collapsed:    "grokAutoRetry_collapsed",
    };

    const DEFAULTS = {
        enabled: true,
        maxAttempts: 5,
        delayMs: 2000,
        collapsed: false,
    };

    // Phrases used to detect "you've hit your cap" type messages.
    const DAILY_LIMIT_PATTERNS = [
        "image limit reached"   // exact Grok message, case-insensitive
        // add more variants here if Grok changes wording
    ];

    let state = {
        enabled:   loadBool(STORAGE_KEYS.enabled, DEFAULTS.enabled),
        maxAttempts: loadInt(STORAGE_KEYS.maxAttempts, DEFAULTS.maxAttempts),
        delayMs:   loadInt(STORAGE_KEYS.delayMs, DEFAULTS.delayMs),
        attempts:  0,
        lastEvent: "Idle",
        collapsed: loadBool(STORAGE_KEYS.collapsed, DEFAULTS.collapsed),
    };

    let observer = null;
    let toolbarElements = {};

    /********************
     * STORAGE HELPERS
     ********************/

    function loadBool(key, fallback) {
        const v = localStorage.getItem(key);
        if (v === null) return fallback;
        return v === "true";
    }

    function loadInt(key, fallback) {
        const v = localStorage.getItem(key);
        const n = parseInt(v, 10);
        return Number.isNaN(n) ? fallback : n;
    }

    function saveState() {
        localStorage.setItem(STORAGE_KEYS.enabled,      String(state.enabled));
        localStorage.setItem(STORAGE_KEYS.maxAttempts,  String(state.maxAttempts));
        localStorage.setItem(STORAGE_KEYS.delayMs,      String(state.delayMs));
        localStorage.setItem(STORAGE_KEYS.collapsed,    String(state.collapsed));
    }

    /********************
     * TOOLBAR UI
     ********************/

    function createToolbar() {
        const style = document.createElement("style");
        style.textContent = `
#grok-auto-retry-toolbar {
    position: fixed;
    bottom: 12px;
    right: 12px;
    z-index: 999999;
    background: rgba(15,15,20,0.9);
    border-radius: 8px;
    padding: 8px 10px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 12px;
    color: #f5f5f5;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    min-width: 220px;
}
#grok-auto-retry-toolbar header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
}
#grok-auto-retry-toolbar .title {
    font-weight: 600;
    font-size: 12px;
}
#grok-auto-retry-toolbar .header-buttons {
    display: flex;
    align-items: center;
    gap: 4px;
}
#grok-auto-retry-toolbar .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    margin-right: 6px;
    background: #888;
    display: inline-block;
}
#grok-auto-retry-toolbar .status-row {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
}
#grok-auto-retry-toolbar .controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 4px 8px;
    align-items: center;
    margin-bottom: 4px;
}
#grok-auto-retry-toolbar label {
    font-size: 11px;
}
#grok-auto-retry-toolbar input[type="number"] {
    width: 70px;
    background: #111;
    border-radius: 4px;
    border: 1px solid #444;
    color: #f5f5f5;
    padding: 2px 4px;
    font-size: 11px;
}
#grok-auto-retry-toolbar input[type="checkbox"] {
    vertical-align: middle;
}
#grok-auto-retry-toolbar .small-text {
    font-size: 10px;
    opacity: 0.8;
}
#grok-auto-retry-toolbar button {
    background: #333;
    border-radius: 4px;
    border: 1px solid #555;
    color: #f5f5f5;
    font-size: 11px;
    padding: 2px 6px;
    cursor: pointer;
}
#grok-auto-retry-toolbar button:hover {
    background: #444;
}
#grok-auto-retry-toolbar .row-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
}

/* Collapsed state */
#grok-auto-retry-toolbar.collapsed {
    padding: 6px 10px;
    width: 180px;
    min-width: 180px;
    max-width: 180px;
    height: auto;
}
#grok-auto-retry-toolbar.collapsed header {
    margin-bottom: 0;
}
#grok-auto-retry-toolbar.collapsed .status-row,
#grok-auto-retry-toolbar.collapsed .controls,
#grok-auto-retry-toolbar.collapsed .row-bottom,
#grok-auto-retry-toolbar.collapsed #grok-auto-retry-last-event {
    display: none;
}
        `;
        document.head.appendChild(style);

        const bar = document.createElement("div");
        bar.id = "grok-auto-retry-toolbar";

        bar.innerHTML = `
<header>
  <div class="title">Grok Auto-Retry</div>
  <div class="header-buttons">
    <button type="button" id="grok-auto-retry-collapse-btn" title="Collapse/expand panel">–</button>
  </div>
</header>

<div class="status-row">
  <span class="status-dot" id="grok-auto-retry-status-dot"></span>
  <span id="grok-auto-retry-status-text">Status: ?</span>
</div>

<div class="controls">
  <label>
    <input type="checkbox" id="grok-auto-retry-enabled">
    Enabled
  </label>
  <div></div>

  <label for="grok-auto-retry-max">Max attempts</label>
  <input type="number" id="grok-auto-retry-max" min="1" max="50">

  <label for="grok-auto-retry-delay">Delay (ms)</label>
  <input type="number" id="grok-auto-retry-delay" min="0" max="60000">
</div>

<div class="row-bottom">
  <span class="small-text" id="grok-auto-retry-attempts-text"></span>
  <button type="button" id="grok-auto-retry-reset-btn">Reset</button>
</div>

<div class="small-text" id="grok-auto-retry-last-event"></div>
        `;

        document.body.appendChild(bar);

        toolbarElements = {
            bar,
            statusDot: document.getElementById("grok-auto-retry-status-dot"),
            statusText: document.getElementById("grok-auto-retry-status-text"),
            attemptsText: document.getElementById("grok-auto-retry-attempts-text"),
            lastEvent: document.getElementById("grok-auto-retry-last-event"),
            enabledCheckbox: document.getElementById("grok-auto-retry-enabled"),
            maxInput: document.getElementById("grok-auto-retry-max"),
            delayInput: document.getElementById("grok-auto-retry-delay"),
            resetBtn: document.getElementById("grok-auto-retry-reset-btn"),
            collapseBtn: document.getElementById("grok-auto-retry-collapse-btn"),
        };

        toolbarElements.enabledCheckbox.checked = state.enabled;
        toolbarElements.maxInput.value = state.maxAttempts;
        toolbarElements.delayInput.value = state.delayMs;

        toolbarElements.enabledCheckbox.addEventListener("change", () => {
            state.enabled = toolbarElements.enabledCheckbox.checked;
            state.lastEvent = state.enabled ? "Auto-retry enabled" : "Auto-retry disabled";
            saveState();
            updateToolbar();
            if (state.enabled) ensureObserverRunning();
            else if (observer) observer.disconnect();
        });

        toolbarElements.maxInput.addEventListener("change", () => {
            const val = parseInt(toolbarElements.maxInput.value, 10);
            if (!Number.isNaN(val) && val > 0) {
                state.maxAttempts = val;
                saveState();
                updateToolbar();
            }
        });

        toolbarElements.delayInput.addEventListener("change", () => {
            const val = parseInt(toolbarElements.delayInput.value, 10);
            if (!Number.isNaN(val) && val >= 0) {
                state.delayMs = val;
                saveState();
                updateToolbar();
            }
        });

        // ✅ Reset now also re-enables auto-retry if it was off
        toolbarElements.resetBtn.addEventListener("click", () => {
            state.attempts = 0;

            if (!state.enabled) {
                state.enabled = true;
                toolbarElements.enabledCheckbox.checked = true;
                state.lastEvent = "Reset: Auto-retry re-enabled";
                saveState();
                updateToolbar();
                ensureObserverRunning();
                return;
            }

            state.lastEvent = "Attempts reset by user";
            updateToolbar();
        });

        toolbarElements.collapseBtn.addEventListener("click", () => {
            state.collapsed = !state.collapsed;
            saveState();
            applyCollapsedState();
        });

        applyCollapsedState();
        updateToolbar();
    }

    function applyCollapsedState() {
        if (!toolbarElements.bar) return;
        if (state.collapsed) {
            toolbarElements.bar.classList.add("collapsed");
            toolbarElements.collapseBtn.textContent = "+";
            toolbarElements.collapseBtn.title = "Expand panel";
        } else {
            toolbarElements.bar.classList.remove("collapsed");
            toolbarElements.collapseBtn.textContent = "–";
            toolbarElements.collapseBtn.title = "Collapse panel";
        }
    }

    function updateToolbar() {
        if (!toolbarElements.bar) return;
        const { statusDot, statusText, attemptsText, lastEvent } = toolbarElements;

        statusText.textContent = state.enabled
            ? "Status: Watching"
            : "Status: Paused";

        attemptsText.textContent = `Attempts: ${state.attempts}/${state.maxAttempts}`;
        lastEvent.textContent = `Last: ${state.lastEvent}`;

        statusDot.style.background = state.enabled
            ? (state.attempts > 0 ? "#ff9800" : "#4caf50")
            : "#777";
    }

    /********************
     * CORE LOGIC
     ********************/

    function containsModerationMessage(root) {
        if (!root) return false;
        const text = root.textContent || "";
        return text.includes("Content Moderated");
    }

    function containsDailyLimitMessage(root) {
        if (!root) return false;
        const text = (root.textContent || "").toLowerCase();
        return DAILY_LIMIT_PATTERNS.some(p => text.includes(p));
    }

    function handleDailyLimit() {
        // Stop this round and disable auto-retry, but do NOT date-lock it.
        state.attempts = 0;
        state.enabled = false;
        state.lastEvent = "Image limit reached – auto-retry stopped. Press Reset to re-enable later.";

        if (toolbarElements.enabledCheckbox) {
            toolbarElements.enabledCheckbox.checked = false;
        }

        saveState();
        updateToolbar();
    }

    function handleModerationToast() {
        state.attempts++;
        if (state.attempts < state.maxAttempts) {
            state.lastEvent = `Content moderated – retrying (attempt ${state.attempts}/${state.maxAttempts}) in ${state.delayMs}ms`;
            updateToolbar();

            setTimeout(() => {
                if (!state.enabled) {
                    state.lastEvent = "Retry skipped – disabled during delay";
                    updateToolbar();
                    return;
                }

                const btn = document.querySelector(MAKE_VIDEO_SELECTOR);
                if (btn) {
                    btn.click();
                    state.lastEvent = "Clicked 'Make video' to retry";
                } else {
                    state.lastEvent = "Button not found – cannot retry";
                }
                updateToolbar();
            }, state.delayMs);

        } else {
            state.lastEvent = `Max attempts reached (${state.maxAttempts})`;
            state.attempts = 0;
            updateToolbar();
        }
    }

    function createObserver() {
        if (observer) return observer;

        observer = new MutationObserver((mutationsList) => {
            if (!state.enabled) return;

            for (const mutation of mutationsList) {
                if (mutation.type !== "childList") continue;

                // Success detection: new content under the grid
                if (mutation.target instanceof Element && mutation.target.matches("div.grid")) {
                    state.attempts = 0;
                    state.lastEvent = "Generation successful – reset";
                    updateToolbar();
                }

                for (const node of mutation.addedNodes) {
                    if (!(node instanceof Element)) continue;

                    // 1) Check for image/daily limit first
                    let isDailyLimit = containsDailyLimitMessage(node);
                    if (!isDailyLimit) {
                        const dlPossible = node.querySelector("div, span, p, ol, li");
                        if (dlPossible && containsDailyLimitMessage(dlPossible)) {
                            isDailyLimit = true;
                        }
                    }
                    if (isDailyLimit) {
                        handleDailyLimit();
                        continue;
                    }

                    // 2) Check for moderation
                    let isModeration = containsModerationMessage(node);
                    if (!isModeration) {
                        const possible = node.querySelector("ol, li, div");
                        if (possible && containsModerationMessage(possible)) {
                            isModeration = true;
                        }
                    }

                    if (!isModeration) continue;
                    handleModerationToast();
                }
            }
        });

        return observer;
    }

    function ensureObserverRunning() {
        if (!document.body) return;
        const obs = createObserver();
        obs.observe(document.body, { childList: true, subtree: true });
        if (state.lastEvent === "Idle") state.lastEvent = "Observer started";
        updateToolbar();
    }

    /********************
     * INIT
     ********************/

    function init() {
        createToolbar();
        if (state.enabled) ensureObserverRunning();
        else {
            state.lastEvent = "Loaded disabled";
            updateToolbar();
        }
        console.log("[Grok Auto-Retry] Loaded (no close button, image limit aware, reset re-enables).");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();

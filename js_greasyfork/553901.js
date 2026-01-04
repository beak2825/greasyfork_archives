// ==UserScript==
// @name         Homepage Targets
// @namespace    http://tampermonkey.net/
// @version      2025-10-27
// @description  Widget for torn homepage.
// @author       You
// @match        https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553901/Homepage%20Targets.user.js
// @updateURL https://update.greasyfork.org/scripts/553901/Homepage%20Targets.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // SETTINGS SECTION - All configurable values in one place
    const CONFIG = {
        WIDGET: {
            ID: "homepage_targets_widget",
            TITLE: "Chain Target Finder",
            TARGET_COUNT: 7,
            MONITORING_DELAY: 1000
        },
        API: {
            BASE_URL: "https://api.torn.com/v2",
            STORAGE_KEY: "homepage_widget_targets_api_key",
            POSITION_KEY: "customWidget_position"
        },
        USER_RANGE: {
            MIN: 3000000,
            MAX: 3400000
        },
        UI: {
            LOADING_TEXT: "Loading random targets...",
            DEFAULT_TEXT: "Click to add target names or IDs",
            ATTACK_BUTTON_COLOR: "#ff4444",
            VALIDATE_BUTTON_COLOR: "#4CAF50"
        }
    };

    // Utility functions
    const storage = {
        get: (key) => localStorage.getItem(key),
        set: (key, value) => localStorage.setItem(key, typeof value === "object" ? JSON.stringify(value) : value),
        getJson: (key) => {
            try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
        }
    };

    const api = {
        getKey: () => storage.get(CONFIG.API.STORAGE_KEY)?.trim() || null,
        saveKey: (key) => storage.set(CONFIG.API.STORAGE_KEY, key.trim()),
        validateKey: async (key) => {
            try {
                const response = await fetch(`${CONFIG.API.BASE_URL}/user/profile?striptags=true`, {
                    headers: { "Authorization": `ApiKey ${key}`, "accept": "application/json" }
                });
                const data = await response.json();
                return !data.error;
            } catch { return false; }
        },
        fetchProfile: async (userId, key) => {
            const response = await fetch(`${CONFIG.API.BASE_URL}/user/${userId}/profile?striptags=true`, {
                headers: { "Authorization": `ApiKey ${key}`, "accept": "application/json" }
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.error);
            return data.profile;
        }
    };

    const position = {
        save: (widgetId, columnId, index) => {
            storage.set(`${CONFIG.API.POSITION_KEY}_${widgetId}`, { columnId, position: index, timestamp: Date.now() });
        },
        get: (widgetId) => storage.getJson(`${CONFIG.API.POSITION_KEY}_${widgetId}`),
        current: (element) => {
            const parent = element.parentElement;
            if (!parent) return null;
            return { columnId: parent.id, position: Array.from(parent.children).indexOf(element) };
        }
    };

    // Target generation
    const getRandomUserId = () => Math.floor(Math.random() * (CONFIG.USER_RANGE.MAX - CONFIG.USER_RANGE.MIN + 1)) + CONFIG.USER_RANGE.MIN;

    const createTarget = (profile) => {
        const info = [];
        if (profile.level) info.push(`Level ${profile.level}`);
        if (profile.rank) info.push(`Rank: ${profile.rank}`);
        if (profile.status?.state) info.push(`Status: ${profile.status.state}`);
        if (profile.life) {
            const percent = Math.round((profile.life.current / profile.life.maximum) * 100);
            info.push(`Health: ${percent}% (${profile.life.current.toLocaleString()}/${profile.life.maximum.toLocaleString()})`);
        }

        return {
            name: profile.name,
            xid: profile.id,
            tooltipInfo: info.join(" | "),
            profileLink: `https://www.torn.com/loader.php?sid=attack&user2ID=${profile.id}`
        };
    };

    const fetchTargets = async (apiKey, count = CONFIG.WIDGET.TARGET_COUNT) => {
        const promises = Array(count).fill().map(async () => {
            const id = getRandomUserId();
            try {
                const profile = await api.fetchProfile(id, apiKey);
                return createTarget(profile);
            } catch {
                return { name: `User ${id}`, xid: id, tooltipInfo: "Failed to load profile data" };
            }
        });
        return Promise.all(promises);
    };

    // Widget HTML generation
    const generateWidget = (id, title, content) => `
<div class="sortable-box t-blue-cont h" id="${id}" style="display: block; top: 0px; left: 0px;">
    <div class="title main-title title-black top-round active" role="table">
        <div class="arrow-wrap"><a href="#/" role="button" class="accordion-header-arrow right" aria-label="Close ${title} panel" tabindex="0"></a></div>
        <div class="arrow-wrap"><a href="#/" role="button" class="accordion-header-arrow right" aria-label="Refresh targets" tabindex="0"></a></div>
        <div class="move-wrap"><i class="accordion-header-move right"></i></div>
        <h5 class="box-title" tabindex="0">${title}</h5>
    </div>
    <div class="bottom-round" style="display: block;">
        <div class="cont-gray bottom-round">
            <ul class="list-cont">${content}</ul>
        </div>
    </div>
</div>`;

    const generateApiInput = () => `
<li class="first" title="Enter your Torn API key" tabindex="0">
    <div style="padding: 10px;">
        <input type="text" id="api-key-input" placeholder="Enter your Torn API key..."
               style="width: 100%; padding: 5px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 3px;">
        <button id="validate-api-key"
                style="width: 100%; padding: 5px 10px; background: ${CONFIG.UI.VALIDATE_BUTTON_COLOR}; color: white; border: none; border-radius: 3px; cursor: pointer;">
            Validate API Key
        </button>
    </div>
</li>
<li class="last" title="API Key Help" tabindex="0">
    <span style="font-size: 12px; color: #666; padding: 5px;">
        Get your API key from <a href="https://www.torn.com/preferences.php#tab=api" target="_blank">Torn Preferences</a>
    </span>
</li>`;

    const generateTargetList = (targets) => targets.map((target, i) => {
        const classes = [i === 0 && "first", i === targets.length - 1 && "last"].filter(Boolean).join(" ");
        const name = typeof target === "string" ? target : target.name;
        const tooltip = target.tooltipInfo || `Target: ${name}`;
        const content = typeof target === "string" ? target :
            `<a href="profiles.php?XID=${target.xid}" style="text-decoration: none; color: inherit;">${target.name}</a>`;

        return `
<li class="${classes}" title="${tooltip}" tabindex="0" aria-label="Target: ${name}"
    style="display: flex; justify-content: space-between; align-items: center; padding: 5px 10px;">
    <span style="flex-grow: 1;">${content}</span>
    <a href="https://www.torn.com/loader.php?sid=attack&user2ID=${target.xid}"
       style="background: ${CONFIG.UI.ATTACK_BUTTON_COLOR}; color: white; padding: 2px 8px; border-radius: 3px; text-decoration: none; font-size: 11px; margin-left: 10px;"
       target="_blank" onclick="event.stopPropagation();">Attack</a>
</li>`;
    }).join("");

    const generateLoading = () => `<li class="first last" title="Loading targets" tabindex="0"><span style="text-align: center; padding: 20px; display: block;">${CONFIG.UI.LOADING_TEXT}</span></li>`;
    const generateDefault = () => `<li class="first last" title="Click to add targets" tabindex="0"><span>${CONFIG.UI.DEFAULT_TEXT}</span></li>`;

    // Widget management
    const createWidget = (targets = [], widgetId = null) => {
        const id = widgetId || CONFIG.WIDGET.ID;
        const apiKey = api.getKey();

        let content;
        if (!apiKey) content = generateApiInput();
        else if (targets.length === 0) content = generateDefault();
        else content = generateTargetList(targets);

        const container = document.createElement("div");
        container.innerHTML = generateWidget(id, CONFIG.WIDGET.TITLE, content);
        const widget = container.firstElementChild;

        // Setup event listeners
        if (!apiKey) {
            setupApiEvents(widget, id);
        } else {
            setupRefreshEvent(widget, id);
        }

        return { widget, widgetId: id };
    };

    const createLoadingWidget = (id) => {
        const container = document.createElement("div");
        container.innerHTML = generateWidget(id, CONFIG.WIDGET.TITLE, generateLoading());
        return container.firstElementChild;
    };

    // Event handlers
    const setupApiEvents = (widget, widgetId) => {
        const button = widget.querySelector("#validate-api-key");
        const input = widget.querySelector("#api-key-input");

        if (button && input) {
            const validate = async () => {
                const key = input.value.trim();
                if (!key) return alert("Please enter an API key");

                button.disabled = true;
                button.textContent = "Validating...";

                if (await api.validateKey(key)) {
                    api.saveKey(key);
                    rebuildWidget(widget, widgetId);
                } else {
                    alert("Invalid API key. Please check and try again.");
                    button.disabled = false;
                    button.textContent = "Validate API Key";
                }
            };

            button.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); validate(); });
            input.addEventListener("keypress", (e) => { if (e.key === "Enter") validate(); });
        }
    };

    const setupRefreshEvent = (widget, widgetId) => {
        const refreshButton = widget.querySelectorAll(".arrow-wrap")[1]?.querySelector(".accordion-header-arrow");
        if (refreshButton) {
            // Add loading cursor on hover
            refreshButton.style.cursor = "progress";

            refreshButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                refreshWidget(widget, widgetId);
            });
        }
    };

    const rebuildWidget = async (currentWidget, widgetId) => {
        const apiKey = api.getKey();
        if (!apiKey) return;

        const loading = createLoadingWidget(widgetId);
        currentWidget.replaceWith(loading);

        try {
            const targets = await fetchTargets(apiKey);
            const { widget: newWidget } = createWidget(targets, widgetId);
            loading.replaceWith(newWidget);
            setTimeout(() => setupPositionMonitoring(newWidget, widgetId), CONFIG.WIDGET.MONITORING_DELAY);
        } catch (error) {
            console.error("Error fetching targets:", error);
            const { widget: fallback } = createWidget([], widgetId);
            loading.replaceWith(fallback);
        }
    };

    const refreshWidget = async (currentWidget, widgetId) => {
        const apiKey = api.getKey();
        if (!apiKey) return alert("No API key found. Please validate your API key first.");
        await rebuildWidget(currentWidget, widgetId);
    };

    // Position management
    const setupPositionMonitoring = (widget, widgetId) => {
        let lastPos = position.current(widget);

        const observer = new MutationObserver(() => {
            const currentPos = position.current(widget);
            if (currentPos && lastPos &&
                (currentPos.columnId !== lastPos.columnId || currentPos.position !== lastPos.position)) {
                position.save(widgetId, currentPos.columnId, currentPos.position);
                lastPos = currentPos;
            }
        });

        ["column0", "column1"].forEach(id => {
            const column = document.getElementById(id);
            if (column) observer.observe(column, { childList: true });
        });
    };

    const insertWidget = (widget, widgetId) => {
        const saved = position.get(widgetId);

        if (saved) {
            const column = document.getElementById(saved.columnId);
            if (column) {
                const children = Array.from(column.children);
                if (saved.position < children.length) {
                    column.insertBefore(widget, children[saved.position]);
                } else {
                    column.appendChild(widget);
                }
                return true;
            }
        }

        // Default: column0, index 1
        const defaultColumn = document.getElementById("column0");
        if (defaultColumn) {
            const children = Array.from(defaultColumn.children);
            if (children.length >= 2) {
                defaultColumn.insertBefore(widget, children[1]);
            } else {
                defaultColumn.appendChild(widget);
            }
            return true;
        }

        return false;
    };

    // Main initialization
    const waitForColumn = () => new Promise(resolve => {
        const column = document.getElementById("column0");
        if (column) return resolve(column);

        const observer = new MutationObserver(() => {
            const found = document.getElementById("column0");
            if (found) {
                observer.disconnect();
                resolve(found);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    const init = async () => {
        try {
            await waitForColumn();

            const apiKey = api.getKey();
            let targets = [];

            if (apiKey) {
                try {
                    targets = await fetchTargets(apiKey);
                } catch (error) {
                    console.error("Error fetching targets:", error);
                }
            }

            const { widget, widgetId } = createWidget(targets, CONFIG.WIDGET.ID);

            if (insertWidget(widget, widgetId)) {
                setTimeout(() => setupPositionMonitoring(widget, widgetId), CONFIG.WIDGET.MONITORING_DELAY);
                console.log("Widget initialized successfully");
            }
        } catch (error) {
            console.error("Error initializing widget:", error);
        }
    };

    init();
})();

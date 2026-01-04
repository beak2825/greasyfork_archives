// ==UserScript==
// @name         TrondinTargets Widget
// @namespace    http://tampermonkey.net/
// @version      2025-10-27
// @description  Creates a widget which fetches random target profiles from TrondinTargets.com and displays them on Torn homepage for easy attacking.
// @author       Vassilios [2276659]
// @match        https://www.torn.com/index.php
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/554029/TrondinTargets%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/554029/TrondinTargets%20Widget.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // SETTINGS SECTION - All configurable values in one place
    const CONFIG = {
        WIDGET: {
            ID: "trondin_targets_widget",
            TITLE: "TrondinTargets Widget",
            TARGET_COUNT: 7,
            MONITORING_DELAY: 1000
        },
        API: {
            BASE_URL: "https://api.torn.com/v2",
            STORAGE_KEY: "trondin_widget_api_key",
            POSITION_KEY: "trondin_widget_position"
        },
        USER_RANGE: {
            MIN: 3000000,
            MAX: 3400000
        },
        FAIR_FIGHT: {
            MIN: 1.05,
            MAX: 5.0,
            DEFAULT_MIN: 1.05,
            DEFAULT_MAX: 5.0,
            STORAGE_KEY: "trondin_fair_fight_range"
        },
        BSS: {
            STORAGE_KEY: "trondin_user_bss_cache",
            CACHE_DURATION: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        },
        UI: {
            LOADING_TEXT: "Loading random targets...",
            DEFAULT_TEXT: "Uh oh.. An error has happened somewhere along the way.",
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

    const battleStats = {
        get: async (apiKey) => {
            const cachedData = storage.getJson(CONFIG.BSS.STORAGE_KEY);
            const now = Date.now();

            // Check if we have valid cached data (less than 24 hours old)
            if (cachedData && cachedData.timestamp && (now - cachedData.timestamp) < CONFIG.BSS.CACHE_DURATION) {
                console.log("Using cached BSS data");
                return cachedData.userBSS;
            }

            console.log("Fetching fresh BSS data");
            try {
                const battlestats = await api.fetchBattlestats(apiKey);
                const userBSS = Math.floor(
                    Math.sqrt(battlestats.strength) +
                    Math.sqrt(battlestats.dexterity) +
                    Math.sqrt(battlestats.defense) +
                    Math.sqrt(battlestats.speed)
                );

                // Cache the BSS data with timestamp
                storage.set(CONFIG.BSS.STORAGE_KEY, {
                    userBSS: userBSS,
                    timestamp: now
                });

                return userBSS;
            } catch (error) {
                console.error("Error fetching battlestats:", error);
                // If we have any cached data, return it even if expired
                if (cachedData && cachedData.userBSS) {
                    console.log("Using expired cached BSS data due to error");
                    return cachedData.userBSS;
                }
                throw error;
            }
        },
        clearCache: () => {
            localStorage.removeItem(CONFIG.BSS.STORAGE_KEY);
        }
    };

    const fairFight = {
        get: () => {
            const saved = storage.getJson(CONFIG.FAIR_FIGHT.STORAGE_KEY);
            return saved || { min: CONFIG.FAIR_FIGHT.DEFAULT_MIN, max: CONFIG.FAIR_FIGHT.DEFAULT_MAX };
        },
        set: (min, max) => {
            storage.set(CONFIG.FAIR_FIGHT.STORAGE_KEY, { min, max });
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
        },
        fetchBattlestats: async (key) => {
            const response = await fetch(`https://api.torn.com/user/?selections=battlestats&key=${key}`, {
                headers: {
                    "accept": "application/json",
                }
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.error);
            return data;  // Note: removed .profile since v1 structure might be different
        },
        fetchTrondinTargets: async (minBSS, maxBSS) => {
            try {
                const url = `https://trondintargets.com/api/defenders?minBss=${minBSS}&maxBss=${maxBSS}`;

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            "User-Agent": navigator.userAgent,
                            "Accept": "*/*",
                            "Accept-Language": navigator.language || "en-US,en;q=0.5",
                            "Referer": "https://trondintargets.com/"
                        },
                        onload: function (response) {
                            if (response.status === 200) {
                                resolve(response.responseText);
                            } else {
                                reject(new Error(`HTTP error! status: ${response.status}`));
                            }
                        },
                        onerror: function (error) {
                            reject(new Error("Network error occurred"));
                        },
                        ontimeout: function () {
                            reject(new Error("Request timed out"));
                        },
                        timeout: 10000 // 10 second timeout
                    });
                });
            } catch (error) {
                console.error("Error fetching Trondin targets:", error);
                throw error;
            }
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

    // TARGET GENERATION
    const createTarget = (targetEntry, userBSS, profile) => {
        const info = [];
        if (profile.level) info.push(`Level ${profile.level}`);
        if (profile.rank) info.push(`Rank: ${profile.rank}`);
        if (profile.status?.state) info.push(`Status: ${profile.status.state}`);
        if (profile.life) {
            const percent = Math.round((profile.life.current / profile.life.maximum) * 100);
            info.push(`Health: ${percent}% (${profile.life.current.toLocaleString()}/${profile.life.maximum.toLocaleString()})`);
        }

        // Calculate user FF.
        const targetFF = (1 + (8 / 3) * (targetEntry.bssEstimate / userBSS)).toFixed(2);

        return {
            name: profile.name + ` (FF: ${targetFF})`,
            xid: profile.id,
            tooltipInfo: info.join(" | "),
            profileLink: `https://www.torn.com/loader.php?sid=attack&user2ID=${profile.id}`
        };
    };

    const fetchTargets = async (apiKey, count = CONFIG.WIDGET.TARGET_COUNT) => {
        const { min, max } = fairFight.get();

        try {
            const userBSS = await battleStats.get(apiKey);
            const minBSS = Math.floor(userBSS * (3 / 8) * (min - 1));
            const maxBSS = Math.floor(userBSS * (3 / 8) * (max - 1));

            console.log("User BSS:", userBSS, "Min BSS:", minBSS, "Max BSS:", maxBSS);

            const targetsResponse = await api.fetchTrondinTargets(minBSS, maxBSS);
            const targetsData = JSON.parse(targetsResponse);

            if (!targetsData.items || !Array.isArray(targetsData.items)) {
                throw new Error("Invalid targets data structure");
            }

            // Get 'count' random targets from the targets list.
            const shuffled = targetsData.items.sort(() => 0.5 - Math.random());
            const selectedTargets = shuffled.slice(0, count);

            const promises = selectedTargets.map(async (targetEntry) => {
                const defenderId = targetEntry.defenderId;
                try {
                    const profile = await api.fetchProfile(defenderId, apiKey);
                    return createTarget(targetEntry, userBSS, profile);
                } catch (error) {
                    console.error(`Failed to fetch profile for defender ${defenderId}:`, error);
                    return {
                        name: `User ${defenderId}`,
                        xid: defenderId,
                        tooltipInfo: "Failed to load profile data",
                        profileLink: `https://www.torn.com/loader.php?sid=attack&user2ID=${defenderId}`
                    };
                }
            });

            return Promise.all(promises);
        } catch (error) {
            console.error("Error in fetchTargets:", error);
            // Fallback to empty array if there's an error
            return [];
        }
    };

    // Widget HTML generation
    const generateFairFightControls = () => {
        const { min, max } = fairFight.get();
        return `
<div style="padding: 8px; border-bottom: 1px solid #393939; background-color: #2e2e2e;">
    <div style="display: flex; gap: 15px; align-items: center;">
        <div style="flex: 1;">
            <label style="display: block; font-size: 11px; color: #ccc; margin-bottom: 3px; font-weight: bold;">Min FF: <span id="min-ff-value" style="color: #4CAF50;">${min.toFixed(2)}</span></label>
            <input type="range" id="min-ff-slider" min="${CONFIG.FAIR_FIGHT.MIN}" max="${CONFIG.FAIR_FIGHT.MAX}"
                   step="0.01" value="${min}"
                   style="width: 100%; height: 6px; background: #555; outline: none; border-radius: 3px;
                          -webkit-appearance: none; appearance: none;">
        </div>
        <div style="flex: 1;">
            <label style="display: block; font-size: 11px; color: #ccc; margin-bottom: 3px; font-weight: bold;">Max FF: <span id="max-ff-value" style="color: #4CAF50;">${max.toFixed(2)}</span></label>
            <input type="range" id="max-ff-slider" min="${CONFIG.FAIR_FIGHT.MIN}" max="${CONFIG.FAIR_FIGHT.MAX}"
                   step="0.01" value="${max}"
                   style="width: 100%; height: 6px; background: #555; outline: none; border-radius: 3px;
                          -webkit-appearance: none; appearance: none;">
        </div>
    </div>
    <style>
        #min-ff-slider::-webkit-slider-thumb, #max-ff-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: #4CAF50;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #333;
        }
        #min-ff-slider::-moz-range-thumb, #max-ff-slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #4CAF50;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #333;
        }
    </style>
</div>`;
    };

    const generateWidget = (id, title, content, showFairFight = false) => `
<div class="sortable-box t-blue-cont h" id="${id}" style="display: block; top: 0px; left: 0px;">
    <div class="title main-title title-black top-round active" role="table">
        <div class="arrow-wrap"><a href="#/" role="button" class="accordion-header-arrow right" aria-label="Close ${title} panel" tabindex="0"></a></div>
        <div class="arrow-wrap"><a href="#/" role="button" class="accordion-header-arrow right" aria-label="Refresh targets" tabindex="0"></a></div>
        <div class="move-wrap"><i class="accordion-header-move right"></i></div>
        <h5 class="box-title" tabindex="0">${title}</h5>
    </div>
    <div class="bottom-round" style="display: block;">
        ${showFairFight ? generateFairFightControls() : ''}
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
        const showFairFight = apiKey && targets.length > 0;

        let content;
        if (!apiKey) content = generateApiInput();
        else if (targets.length === 0) content = generateDefault();
        else content = generateTargetList(targets);

        const container = document.createElement("div");
        container.innerHTML = generateWidget(id, CONFIG.WIDGET.TITLE, content, showFairFight);
        const widget = container.firstElementChild;

        // Setup event listeners
        if (!apiKey) {
            setupApiEvents(widget, id);
        } else {
            setupRefreshEvent(widget, id);
            if (showFairFight) {
                setupFairFightEvents(widget, id);
            }
        }

        return { widget, widgetId: id };
    };

    const createLoadingWidget = (id) => {
        const container = document.createElement("div");
        container.innerHTML = generateWidget(id, CONFIG.WIDGET.TITLE, generateLoading(), false);
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

    const setupFairFightEvents = (widget, widgetId) => {
        const minSlider = widget.querySelector("#min-ff-slider");
        const maxSlider = widget.querySelector("#max-ff-slider");
        const minValue = widget.querySelector("#min-ff-value");
        const maxValue = widget.querySelector("#max-ff-value");

        if (minSlider && maxSlider && minValue && maxValue) {
            let refreshTimeout = null;

            const scheduleRefresh = () => {
                // Clear any existing timeout
                if (refreshTimeout) {
                    clearTimeout(refreshTimeout);
                }

                // Set a new timeout to refresh after 1 second of inactivity
                refreshTimeout = setTimeout(() => {
                    refreshTargetsOnly(widget, widgetId);
                }, 1000);
            };

            const updateMinSlider = () => {
                let min = parseFloat(minSlider.value);
                const max = parseFloat(maxSlider.value);

                // Ensure min doesn't exceed max
                if (min > max) {
                    min = max;
                    minSlider.value = max;
                }

                // Update display values
                minValue.textContent = min.toFixed(2);
                fairFight.set(min, max);

                // Schedule a refresh
                scheduleRefresh();
            };

            const updateMaxSlider = () => {
                const min = parseFloat(minSlider.value);
                let max = parseFloat(maxSlider.value);

                // Ensure max doesn't go below min
                if (max < min) {
                    max = min;
                    maxSlider.value = min;
                }

                // Update display values
                maxValue.textContent = max.toFixed(2);
                fairFight.set(min, max);

                // Schedule a refresh
                scheduleRefresh();
            };

            minSlider.addEventListener("input", updateMinSlider);
            maxSlider.addEventListener("input", updateMaxSlider);
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

    const refreshTargetsOnly = async (currentWidget, widgetId) => {
        const apiKey = api.getKey();
        if (!apiKey) return;

        const targetList = currentWidget.querySelector(".list-cont");
        if (!targetList) return;

        // Show loading state in target list only
        targetList.innerHTML = generateLoading();

        try {
            const targets = await fetchTargets(apiKey);
            targetList.innerHTML = generateTargetList(targets);
        } catch (error) {
            console.error("Error fetching targets:", error);
            targetList.innerHTML = generateDefault();
        }
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

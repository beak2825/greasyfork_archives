// ==UserScript==
// @name         Torn Shoplifting Monitor test test
// @namespace    http://tampermonkey.net/
// @version      6.8
// @description  Monitors Shoplifting Security
// @author       Deviyl[3722358]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559029/Torn%20Shoplifting%20Monitor%20test%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/559029/Torn%20Shoplifting%20Monitor%20test%20test.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // -------------------------
    // Configuration / Constants
    // -------------------------
    const CONSTANTS = {
        API_URL: "https://api.torn.com/torn/?selections=shoplifting&key=",
        KEYS: {
            API: "tornShopliftingApiKey",
            SELECTIONS: "tornShopliftingSelections",
            POLL_INTERVAL: "tornShopliftingPollInterval",
            AUDIBLE: "tornShopliftingAudible",
            VISUAL: "tornShopliftingVisual",
            AUDIO_UNLOCKED: "tornShopliftingAudioUnlocked",
            VISUAL_DURATION: "tornShopliftingVisualDuration",
            AUDIBLE_VOLUME: "tornShopliftingAudibleVolume",
            BORDER_WIDTH: "tornShopliftingBorderWidth"
        },
        IDS: {
            WRAPPER: "tornShopliftIcon",
            MAIN_ICON: "tornShopliftMain",
            GEAR_ICON: "tornShopliftGear",
            SETTINGS: "tornShopliftSettings",
            ALERT: "tornShopliftAlert",
            TOOLTIP: "tornShopliftTooltip",
            OVERLAY: "tornShopliftOverlay"
        },
        STORE_NAMES: {
            "sallys_sweet_shop": "Sally's Sweet Shop",
            "Bits_n_bobs": "Bits 'n' Bobs",
            "tc_clothing": "TC Clothing",
            "super_store": "Super Store",
            "pharmacy": "Pharmacy",
            "cyber_force": "Cyber Force",
            "jewelry_store": "Jewelry Store",
            "big_als": "Big Al's Gun Shop"
        }
    };

    const slAudio = new Audio("https://www.soundjay.com/buttons/button-3.mp3");

    // -------------------------
    // Runtime State
    // -------------------------
    const state = {
        lastAlertList: [],
        tooltipData: {},
        pollTimer: null,
        previousState: {},
        isApiInvalid: false,
        isMonitoring: false
    };

    // -------------------------
    // Helpers
    // -------------------------
    function getStorageNum(key, def, min, max, scale = 1) {
        const raw = localStorage.getItem(key);
        if (!raw) return def;
        let val = parseFloat(raw);
        if (!Number.isFinite(val)) return def;

        if (scale !== 1 && val > (max / scale)) val = val / scale;
        if (min !== null && val < min) val = min;
        if (max !== null && val > max) val = max;
        return val;
    }

    function createEl(tag, styles = {}, props = {}) {
        const el = document.createElement(tag);
        if (styles) Object.assign(el.style, styles);
        if (props) Object.assign(el, props);
        return el;
    }

    // -------------------------
    // Audio / Visual Setup
    // -------------------------
    function getVisualAlarmDuration() {
        return getStorageNum(CONSTANTS.KEYS.VISUAL_DURATION, 5000, 500, null);
    }

    function getAudibleAlarmVolume() {
        const v = getStorageNum(CONSTANTS.KEYS.AUDIBLE_VOLUME, 0.005, 0, 1000);
        return v > 1 ? v / 1000 : v;
    }

    function getBorderWidth() {
        return getStorageNum(CONSTANTS.KEYS.BORDER_WIDTH, 5, 5, 50);
    }

    function updateVisualSettings(customWidth) {
        const width = customWidth || getBorderWidth();
        document.documentElement.style.setProperty('--sl-border-width', `${width}px`);
    }

    function updateAudioVolume() {
        try {
            slAudio.volume = getAudibleAlarmVolume();
        } catch (e) {
            console.warn("Invalid volume, resetting:", e);
            slAudio.volume = 0.005;
        }
    }

    // Initialize settings
    updateAudioVolume();
    updateVisualSettings();

    function isAudioUnlocked() {
        return localStorage.getItem(CONSTANTS.KEYS.AUDIO_UNLOCKED) === "true";
    }

    function setAudioUnlocked(flag = true) {
        if (flag) localStorage.setItem(CONSTANTS.KEYS.AUDIO_UNLOCKED, "true");
        else localStorage.removeItem(CONSTANTS.KEYS.AUDIO_UNLOCKED);
    }

    // -------------------------
    // UI Injection (Sidebar)
    // -------------------------
    function injectSidebarIcon() {
        if (document.getElementById(CONSTANTS.IDS.WRAPPER)) return;

        let barParent = document.querySelector('a[class*="energy___"]')?.parentElement ||
            document.querySelector('.sidebar-block')?.parentElement;

        if (!barParent) return;

        const wrapper = createEl("div", {
            display: "flex", alignItems: "center", justifyContent: "flex-start",
            height: "32px", padding: "4px 6px", margin: "4px 0",
            cursor: "default", borderRadius: "4px", transition: "all .15s",
            position: "relative", gap: "8px"
        }, {
            id: CONSTANTS.IDS.WRAPPER, className: "sidebar-block"
        });

        const label = createEl("div", {
            fontSize: "10px", lineHeight: "10px", color: "#ddd",
            textAlign: "left", marginRight: "6px"
        });
        label.innerHTML = `Shoplifting<br>Monitor`;

        const mainIcon = createEl("div", {
            width: "24px", height: "24px", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
            color: "#f4d742"
        }, {
            id: CONSTANTS.IDS.MAIN_ICON, title: "Shoplifting Monitor"
        });

        mainIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="7" width="14" height="13" rx="2" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>`;

        const gearIcon = createEl("div", {
            width: "12px", height: "12px", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
            color: "#bbb"
        }, {
            id: CONSTANTS.IDS.GEAR_ICON, title: "Shoplifting Settings"
        });
        gearIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94a1.72,1.72,0,0,0,0-1.88l2-1.53a.5.5,0,0,0,.12-.64l-1.9-3.29a.5.5,0,0,0-.6-.22l-2.35,0.94a7,7,0,0,0-1.62-.94L14.9,2.9a.5.5,0,0,0-.5-.4H9.6a.5.5,0,0,0-.5.4L8.05,6.06a7,7,0,0,0-1.62.94L4.08,6.06a.5.5,0,0,0-.6.22L1.58,9.57a.5.5,0,0,0,.12.64l2,1.53a1.72,1.72,0,0,0,0,1.88l-2,1.53a.5.5,0,0,0-.12.64l1.9,3.29a.5.5,0,0,0,.6.22l2.35-.94c.5.37,1,.68,1.62.94L9.1,21.1a.5.5,0,0,0,.5.4h4.8a.5.5,0,0,0,.5-.4l1.05-3.16c.55-.22,1.08-.49,1.62-.94l2.35.94a.5.5,0,0,0,.6-.22l1.9-3.29a.5.5,0,0,0-.12-.64Z M12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>`;
        mainIcon.addEventListener("mouseenter", showTooltip);
        mainIcon.addEventListener("mouseleave", hideTooltip);
        mainIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            if (state.isApiInvalid) showGenericPopup("Invalid API Key", "Please enter a valid API key in Settings.", [{ text: "Open Settings", cb: toggleSettingsPopup }, { text: "Close", cb: null }], "#ffb3b3");
            else if (state.lastAlertList.length > 0) showGenericPopup("⚠ Security Disabled", state.lastAlertList.map(s => `• ${s}`).join("<br>"), [{ text: "Shoplift", cb: goToShopliftPage }, { text: "Close", cb: null }], "#ff6f6f");
            else showGenericPopup("No Security Disabled", "All monitored stores currently have their security measures active.", [{ text: "Shoplift", cb: goToShopliftPage }, { text: "Close", cb: null }], "#8cff8c");
        });
        gearIcon.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleSettingsPopup();
        });
        wrapper.appendChild(label);
        wrapper.appendChild(mainIcon);
        wrapper.appendChild(gearIcon);
        barParent.appendChild(wrapper);
    }

    function setIconState(color, flash = false) {
        const icon = document.getElementById(CONSTANTS.IDS.MAIN_ICON);
        if (!icon) return;
        icon.style.color = color;
        icon.style.animation = flash ? "flashRed 1s infinite" : "none";
    }

    // -------------------------
    // Styles
    // -------------------------
    GM_addStyle(`
        :root { --sl-border-width: 5px; }
        @keyframes flashRed {
            0% { color:#ff3b3b; }
            50% { color:#b90000; }
            100% { color:#ff3b3b; }
        }
        @keyframes flashBorder {
            0% { box-shadow: 0 0 0 var(--sl-border-width) rgba(255,0,0,0.85) inset; }
            50% { box-shadow: 0 0 0 var(--sl-border-width) rgba(255,0,0,0.35) inset; }
            100% { box-shadow: 0 0 0 var(--sl-border-width) rgba(255,0,0,0.85) inset; }
        }
        #${CONSTANTS.IDS.TOOLTIP} { position: absolute; background:#222; color:#fff; padding:6px 10px; border-radius:4px; font-size:13px; z-index:999999; white-space:nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.5); }
        #${CONSTANTS.IDS.SETTINGS} { position: fixed; top: 60px; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; padding:12px; border-radius:8px; border: 2px solid #333; z-index: 999999; width: 340px; box-shadow: 0 4px 10px rgba(0,0,0,0.6); }
        #${CONSTANTS.IDS.ALERT} { position: fixed; top: 120px; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; padding:12px; border-radius:8px; border: 2px solid #444; z-index: 999999; width: 360px; box-shadow: 0 4px 10px rgba(0,0,0,0.6); }
        #${CONSTANTS.IDS.SETTINGS} input[type=text], #${CONSTANTS.IDS.SETTINGS} input[type=number] { width: 100%; padding: 6px; margin: 4px 0 10px 0; border-radius: 4px; border: 1px solid #555; background: #111; color: #fff; box-sizing: border-box; }

        #${CONSTANTS.IDS.OVERLAY} {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 2147483647; display: none;
            animation: flashBorder 1s infinite;
        }
        .sl_btn { flex:1; padding:6px; border:none; border-radius:4px; color:white; cursor:pointer; }
        .sl_close { position:absolute; top:8px; right:10px; font-size:16px; color:#999; cursor:pointer; font-weight:bold; }
        .sl_close:hover { color:#fff; }

        /* TornPDA Scrolling Fix */
        .bars-mobile___PDyjE {
            overflow-x: auto !important;
            display: flex !important;
            flex-wrap: nowrap !important;
            white-space: nowrap !important;
            -webkit-overflow-scrolling: touch;
        }
        .bars-mobile___PDyjE > * {
            flex-shrink: 0 !important;
        }
        .bars-mobile___PDyjE::-webkit-scrollbar {
            display: none;
        }
        .bars-mobile___PDyjE #tornShopliftIcon {
            position: relative !important;
            top: -8px !important;
        }
    `);

    // -------------------------
    // Settings Popup
    // -------------------------
    function toggleSettingsPopup() {
        let popup = document.getElementById(CONSTANTS.IDS.SETTINGS);
        if (!popup) createSettingsPopup();
        else popup.style.display = popup.style.display === "none" ? "block" : "none";
    }

    function createSettingsPopup() {
        const popup = createEl("div", null, { id: CONSTANTS.IDS.SETTINGS });
        // Added display:grid to store_list style to split into two columns
        popup.innerHTML = `
            <span id="sl_close_settings" class="sl_close" title="Close">✕</span>
            <h3 style="margin-top:0;">Shoplifting Settings</h3>
            <div style="display:flex; align-items:center;">
                <label style="width:50%"> Public API Key:</label>
                <label style="width:50%"> Polling Interval (min 5s):</label>
            </div>
            <div style="display:flex; align-items:center; margin-bottom:8px;">
                <input id="sl_api_key" type="text" placeholder="Enter public API key" style="width:50%">
                <input id="sl_poll_interval" type="number" min="5" style="width:50%">
            </div>
            <strong>Monitor These Stores:</strong>
            <div id="sl_store_list" style="border:1px solid #444; padding:6px; margin-bottom:10px; max-height:220px; overflow:auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;"></div>
            <strong>Alerts:</strong>
            <div style="border:1px solid #444; padding:6px; margin-bottom:20px;">
                <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
                    <label style="width:50%"><input id="sl_audible_cb" type="checkbox"> Audible Alert</label>
                    <label style="width:50%"><input id="sl_visual_cb" type="checkbox"> Visual Alert</label>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <input id="sl_audible_volume" type="number" step="1" min="1" max="1000" placeholder="50" style="width:33%">
                    <input id="sl_visual_duration" type="number" min="1" placeholder="5" style="width:33%">
                    <input id="sl_border_width" type="number" min="5" max="50" placeholder="5" style="width:33%">
                </div>
                <div style="display:flex; gap:8px; align-items:center; font-size: 10px; margin-bottom:8px;">
                    <label style="width:33%">Vol (1-1000)</label>
                    <label style="width:33%">Duration (s)</label>
                    <label style="width:33%">Border (5-50px)</label>
                </div>
                <button id="sl_test_btn" class="sl_btn" style="background:#666; width:100%">Test Alerts (Click to Enable Audio)</button>
            </div>
            <button id="sl_save_btn" class="sl_btn" style="background:#4CAF50; width:100%">Save Settings</button>
        `;
        document.body.appendChild(popup);
        document.getElementById("sl_save_btn").addEventListener("click", saveSettings);
        document.getElementById("sl_test_btn").addEventListener("click", runAlertTest);
        document.getElementById("sl_close_settings").addEventListener("click", () => {
            popup.style.display = "none";
        });
        loadSettingsIntoPopup();
    }

    function loadSettingsIntoPopup() {
        document.getElementById("sl_api_key").value = localStorage.getItem(CONSTANTS.KEYS.API) || "";
        document.getElementById("sl_poll_interval").value = localStorage.getItem(CONSTANTS.KEYS.POLL_INTERVAL) || 5;
        document.getElementById("sl_audible_cb").checked = localStorage.getItem(CONSTANTS.KEYS.AUDIBLE) === "true";
        document.getElementById("sl_visual_cb").checked = localStorage.getItem(CONSTANTS.KEYS.VISUAL) === "true";
        document.getElementById("sl_visual_duration").value = getVisualAlarmDuration() / 1000;
        document.getElementById("sl_audible_volume").value = Math.round(getAudibleAlarmVolume() * 1000);
        document.getElementById("sl_border_width").value = getBorderWidth();

        const storeList = document.getElementById("sl_store_list");
        const selected = JSON.parse(localStorage.getItem(CONSTANTS.KEYS.SELECTIONS) || "{}");
        storeList.innerHTML = "";

        for (const [key, name] of Object.entries(CONSTANTS.STORE_NAMES)) {
            const div = createEl("div", { marginBottom: "4px" });
            div.innerHTML = `<label><input type="checkbox" class="sl_store_cb" data-store="${key}" ${selected[key] ? "checked" : ""}> ${name}</label>`;
            storeList.appendChild(div);
        }
    }

    function saveSettings() {
        const apiKey = document.getElementById("sl_api_key").value.trim();
        const poll = parseInt(document.getElementById("sl_poll_interval").value);
        const visDur = parseInt(document.getElementById("sl_visual_duration").value);
        const vol = parseFloat(document.getElementById("sl_audible_volume").value);
        const border = parseInt(document.getElementById("sl_border_width").value);

        if (poll < 5 || isNaN(poll)) return alert("Polling interval must be > 5s");
        if (visDur < 1 || isNaN(visDur)) return alert("Duration must be > 1s");
        if (vol < 1 || vol > 1000 || isNaN(vol)) return alert("Volume must be 1-1000");
        if (border < 5 || border > 50 || isNaN(border)) return alert("Border width must be 5-50px");

        localStorage.setItem(CONSTANTS.KEYS.API, apiKey);
        localStorage.setItem(CONSTANTS.KEYS.POLL_INTERVAL, poll);
        localStorage.setItem(CONSTANTS.KEYS.VISUAL_DURATION, visDur * 1000);
        localStorage.setItem(CONSTANTS.KEYS.AUDIBLE_VOLUME, vol / 1000);
        localStorage.setItem(CONSTANTS.KEYS.BORDER_WIDTH, border);
        localStorage.setItem(CONSTANTS.KEYS.AUDIBLE, document.getElementById("sl_audible_cb").checked);
        localStorage.setItem(CONSTANTS.KEYS.VISUAL, document.getElementById("sl_visual_cb").checked);

        const selections = {};
        document.querySelectorAll(".sl_store_cb").forEach(cb => {
            selections[cb.dataset.store] = cb.checked;
        });
        localStorage.setItem(CONSTANTS.KEYS.SELECTIONS, JSON.stringify(selections));
        document.getElementById(CONSTANTS.IDS.SETTINGS).style.display = "none";

        updateAudioVolume();
        updateVisualSettings();
        startMonitoring(true);
    }

    function runAlertTest() {
        // Use user input values for test
        const vol = parseFloat(document.getElementById("sl_audible_volume").value);
        if (vol) slAudio.volume = vol / 1000;

        const visDurInput = parseFloat(document.getElementById("sl_visual_duration").value);
        const testDuration = (visDurInput && visDurInput > 0) ? visDurInput * 1000 : 2000;
        const testBorder = parseInt(document.getElementById("sl_border_width").value);
        if (testBorder && testBorder >= 5 && testBorder <= 50) updateVisualSettings(testBorder);
        if (document.getElementById("sl_audible_cb").checked) {
            slAudio.currentTime = 0;
            slAudio.play().then(() => setAudioUnlocked(true)).catch(console.warn);
        }
        if (document.getElementById("sl_visual_cb").checked) {
            startVisualAlarm(testDuration);
        }
    }

    // -------------------------
    // Universal Popup
    // -------------------------
    function showGenericPopup(title, contentHtml, buttons, titleColor) {
        const existing = document.getElementById(CONSTANTS.IDS.ALERT);
        if (existing) existing.remove();

        const popup = createEl("div", null, { id: CONSTANTS.IDS.ALERT });

        let btnsHtml = buttons.map((b, i) =>
            `<button id="sl_popup_btn_${i}" class="sl_btn" style="background:${i === 0 ? '#2196F3' : '#444'}">${b.text}</button>`
        ).join("");

        popup.innerHTML = `
            <h3 style="margin-top:0; color:${titleColor || '#fff'};">${title}</h3>
            <div style="margin-bottom:8px; white-space:normal;">${contentHtml}</div>
            <div style="display:flex; gap:8px;">${btnsHtml}</div>
        `;
        document.body.appendChild(popup);

        buttons.forEach((b, i) => {
            document.getElementById(`sl_popup_btn_${i}`).addEventListener("click", () => {
                if (b.cb) b.cb();
                popup.remove();
            });
        });
    }

    function goToShopliftPage() {
        if (!window.location.href.includes("shoplifting")) {
            window.location.href = "https://www.torn.com/page.php?sid=crimes#/shoplifting";
        }
    }

    // -------------------------
    // Tooltip
    // -------------------------
    function showTooltip() {
        hideTooltip();
        const icon = document.getElementById(CONSTANTS.IDS.MAIN_ICON);
        if (!icon) return;

        const tooltip = createEl("div", null, { id: CONSTANTS.IDS.TOOLTIP });

        if (state.isApiInvalid) tooltip.innerText = "Invalid API Key";
        else if (Object.keys(state.tooltipData).length === 0) tooltip.innerText = "Loading data...";
        else {
            tooltip.innerHTML = Object.keys(CONSTANTS.STORE_NAMES)
                .filter(key => state.tooltipData[key] !== undefined)
                .map(key => {
                    const disabled = state.tooltipData[key];
                    return `<div style="color:${disabled ? '#ff6767' : '#8cff8c'}">${CONSTANTS.STORE_NAMES[key]}</div>`;
                }).join("");
        }
        document.body.appendChild(tooltip);
        const rect = icon.getBoundingClientRect();
        const ttRect = tooltip.getBoundingClientRect();
        tooltip.style.top = `${window.scrollY + rect.top - ttRect.height - 6}px`;
        tooltip.style.left = `${window.scrollX + rect.left + (rect.width/2) - (ttRect.width/2)}px`;
    }

    function hideTooltip() {
        const t = document.getElementById(CONSTANTS.IDS.TOOLTIP);
        if (t) t.remove();
    }

    // -------------------------
    // Alarms
    // -------------------------
    function triggerAlarms() {
        if (localStorage.getItem(CONSTANTS.KEYS.AUDIBLE) === "true" && isAudioUnlocked()) {
            slAudio.currentTime = 0;
            slAudio.play().catch(() => {});
        }
        if (localStorage.getItem(CONSTANTS.KEYS.VISUAL) === "true") {
            startVisualAlarm();
        }
    }

    function startVisualAlarm(customDuration) {
        let overlay = document.getElementById(CONSTANTS.IDS.OVERLAY);

        if (!overlay) {
            overlay = createEl("div", null, { id: CONSTANTS.IDS.OVERLAY });
            document.body.appendChild(overlay);
        }

        overlay.style.display = "block";
        setTimeout(() => {
            overlay.style.display = "none";
        }, customDuration || getVisualAlarmDuration());
    }

    // -------------------------
    // Main Logic
    // -------------------------
    async function checkShops(forceTrigger = false) {
        const key = localStorage.getItem(CONSTANTS.KEYS.API);
        if (!key) {
            state.isApiInvalid = false;
            setIconState("#f4d742");
            return;
        }

        try {
            const res = await fetch(CONSTANTS.API_URL + key);
            const data = await res.json();

            // Handle Errors
            if (!data || !data.shoplifting) {
                if (data && data.error && data.error.code === 2) {
                    state.isApiInvalid = true;
                    state.lastAlertList = [];
                    setIconState("#f4d742");
                } else {
                    setIconState("#f4d742");
                }
                return;
            }

            // Valid Data
            state.isApiInvalid = false;
            const selected = JSON.parse(localStorage.getItem(CONSTANTS.KEYS.SELECTIONS) || "{}");
            const newTooltipData = {};
            const newLastAlertList = [];
            let shouldTrigger = false;

            for (const store in data.shoplifting) {
                const measures = data.shoplifting[store] || [];
                const currentDisabled = {};
                measures.forEach(m => {
                    currentDisabled[m.title || "(unknown)"] = (m.disabled === true);
                });

                const anyDisabled = Object.values(currentDisabled).some(v => v);
                newTooltipData[store] = anyDisabled;

                if (selected[store]) {
                    state.previousState[store] = state.previousState[store] || {};
                    for (const [title, isDisabled] of Object.entries(currentDisabled)) {
                        const wasDisabled = !!state.previousState[store][title];
                        if (isDisabled && !wasDisabled) shouldTrigger = true;
                        state.previousState[store][title] = isDisabled;
                    }
                    if (anyDisabled) {
                        const disabledNames = Object.entries(currentDisabled).filter(([_, d]) => d).map(([t]) => t).join(" & ");
                        newLastAlertList.push(`${CONSTANTS.STORE_NAMES[store] || store} - ${disabledNames}`);
                    }
                }
            }

            state.tooltipData = newTooltipData;
            state.lastAlertList = newLastAlertList;

            if (state.lastAlertList.length > 0) setIconState("#ff3b3b", true);
            else setIconState("#4CAF50");

            if (forceTrigger && state.lastAlertList.length > 0) triggerAlarms();
            else if (shouldTrigger) triggerAlarms();
        } catch (e) {
            console.warn("Shoplift Monitor Error:", e);
            setIconState("#f4d742");
        }
    }

    // -------------------------
    // Monitoring Loop
    // -------------------------
    function startMonitoring(force = false) {
        if (state.pollTimer) clearTimeout(state.pollTimer);
        state.isMonitoring = true;

        const loop = async () => {
            if (!state.isMonitoring) return;
            await checkShops(force);
            force = false;
            const interval = parseInt(localStorage.getItem(CONSTANTS.KEYS.POLL_INTERVAL)) || 5;
            state.pollTimer = setTimeout(loop, interval * 1000);
        };
        loop();
    }

    // -------------------------
    // Initialization
    // -------------------------
    injectSidebarIcon();
    startMonitoring(true);

    //try a few times in case it doesn't load
    [1000, 3000, 6000].forEach(ms => setTimeout(injectSidebarIcon, ms));

})();
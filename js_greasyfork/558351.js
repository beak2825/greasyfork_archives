// ==UserScript==
// @name         Torn Shoplifting Monitor
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  Monitors Shoplifting Security
// @author       Deviyl[3722358]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558351/Torn%20Shoplifting%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/558351/Torn%20Shoplifting%20Monitor.meta.js
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
            SELECTIONS: "tornShopliftingGranularSels",
            POLL_INTERVAL: "tornShopliftingPollInterval",
            AUDIBLE: "tornShopliftingAudible",
            VISUAL: "tornShopliftingVisual",
            VISUAL_DURATION: "tornShopliftingVisualDuration",
            AUDIBLE_VOLUME: "tornShopliftingAudibleVolume",
            BORDER_WIDTH: "tornShopliftingBorderWidth",
            AUDIO_UNLOCKED: "tornShopliftingAudioUnlocked"
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
        STORES: {
            "sallys_sweet_shop": { name: "Sally's Sweet Shop", m: ["One camera"] },
            "Bits_n_bobs": { name: "Bits 'n' Bobs", m: ["Two cameras"] },
            "tc_clothing": { name: "TC Clothing", m: ["One camera", "Checkpoint"] },
            "super_store": { name: "Super Store", m: ["Two cameras", "Checkpoint"] },
            "pharmacy": { name: "Pharmacy", m: ["Three cameras", "Checkpoint"] },
            "cyber_force": { name: "Cyber Force", m: ["Two cameras", "One guard"] },
            "jewelry_store": { name: "Jewelry Store", m: ["Three cameras", "One guard"] },
            "big_als": { name: "Big Al's Gun Shop", m: ["Four cameras", "Two guards"] }
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
        isMonitoring: false,
        settingsSnapshot: {}
    };

    // -------------------------
    // Helpers
    // -------------------------
    function getStorageNum(key, def, min, max) {
        const raw = localStorage.getItem(key);
        if (!raw) return def;
        let val = parseFloat(raw);
        if (!Number.isFinite(val)) return def;
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
    // Validation
    // -------------------------
    function validateSettings() {
        const poll = parseInt(document.getElementById("sl_poll_interval").value);
        const vol = parseInt(document.getElementById("sl_audible_volume").value);
        const dur = parseInt(document.getElementById("sl_visual_duration").value);
        const bor = parseInt(document.getElementById("sl_border_width").value);

        let errors = [];
        if (isNaN(poll) || poll < 5) errors.push("Polling Interval must be at least 5s.");
        if (isNaN(vol) || vol < 1 || vol > 1000) errors.push("Volume must be between 1 and 1000.");
        if (isNaN(dur) || dur < 1 || dur > 30) errors.push("Duration must be between 1 and 30s.");
        if (isNaN(bor) || bor < 5 || bor > 50) errors.push("Border must be between 5 and 50px.");

        if (errors.length > 0) {
            showGenericPopup("Invalid Input", errors.join("<br>"), [{ text: "Close", cb: null }], "#ff6f6f");
            return false;
        }
        return true;
    }

    // -------------------------
    // Audio / Visual Setup
    // -------------------------
    function updateAudioVolume(customVol = null) {
        try {
            const v = customVol !== null ? customVol : getStorageNum(CONSTANTS.KEYS.AUDIBLE_VOLUME, 0.005, 0, 1000);
            slAudio.volume = v > 1 ? v / 1000 : v;
        } catch (e) {
            slAudio.volume = 0.005;
        }
    }

    function updateVisualSettings(customWidth = null) {
        const width = customWidth || getStorageNum(CONSTANTS.KEYS.BORDER_WIDTH, 5, 5, 50);
        document.documentElement.style.setProperty('--sl-border-width', `${width}px`);
    }

    function unlockAudio() {
        if (localStorage.getItem(CONSTANTS.KEYS.AUDIO_UNLOCKED) === "true") return;
        const enableAudio = () => {
            slAudio.play().then(() => {
                slAudio.pause(); slAudio.currentTime = 0;
                localStorage.setItem(CONSTANTS.KEYS.AUDIO_UNLOCKED, "true");
                window.removeEventListener('click', enableAudio);
            }).catch(() => {});
        };
        window.addEventListener('click', enableAudio);
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

        mainIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="7" width="14" height="13" rx="2" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>`;

        const gearIcon = createEl("div", {
            width: "12px", height: "12px", display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
            color: "#bbb"
        }, {
            id: CONSTANTS.IDS.GEAR_ICON, title: "Shoplifting Settings"
        });
        gearIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94a1.72,1.72,0,0,0,0-1.88l2-1.53a.5.5,0,0,0,.12-.64l-1.9-3.29a.5.5,0,0,0-.6-.22l-2.35,0.94a7,7,0,0,0-1.62-.94L14.9,2.9a.5.5,0,0,0-.5-.4H9.6a.5.5,0,0,0-.5.4L8.05,6.06a7,7,0,0,0-1.62.94L4.08,6.06a.5.5,0,0,0-.6.22L1.58,9.57a.5.5,0,0,0,.12.64l2,1.53a1.72,1.72,0,0,0,0,1.88l-2,1.53a.5.5,0,0,0-.12.64l1.9,3.29a.5.5,0,0,0,.6.22l2.35-.94c.5.37,1,.68,1.62.94L9.1,21.1a.5.5,0,0,0,.5.4h4.8a.5.5,0,0,0,.5-.4l1.05-3.16c.55-.22,1.08-.49,1.62-.94l2.35.94a.5.5,0,0,0,.62.22l1.9-3.29a.5.5,0,0,0-.12-.64Z M12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/></svg>`;

        mainIcon.addEventListener("mouseenter", showTooltip);
        mainIcon.addEventListener("mouseleave", hideTooltip);
        mainIcon.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (state.isApiInvalid) showGenericPopup("Invalid API Key", "Check settings to enter a valid public api key.", [{ text: "Settings", cb: toggleSettingsPopup }, { text: "Close", cb: null }], "#ffb3b3");
            else if (state.lastAlertList.length > 0) showGenericPopup("⚠ Security Disabled", state.lastAlertList.join("<br>"), [{ text: "Shoplift", cb: goToShopliftPage }, { text: "Close", cb: null }], "#ff6f6f");
            else showGenericPopup("No Security Disabled", "All monitored security is active.", [{ text: "Shoplift", cb: goToShopliftPage }, { text: "Close", cb: null }], "#8cff8c");
        });

        gearIcon.addEventListener("pointerdown", (e) => {
            e.preventDefault();
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
        @keyframes flashRed { 0% { color:#ff3b3b; } 50% { color:#b90000; } 100% { color:#ff3b3b; } }
        @keyframes flashBorder { 0% { box-shadow: 0 0 0 var(--sl-border-width) rgba(255,0,0,0.85) inset; } 50% { box-shadow: 0 0 0 var(--sl-border-width) rgba(255,0,0,0.35) inset; } 100% { box-shadow: 0 0 0 var(--sl-border-width) rgba(255,0,0,0.85) inset; } }

        #${CONSTANTS.IDS.TOOLTIP} { position: absolute; background:#222; color:#fff; padding:6px 10px; border-radius:4px; font-size:12px; z-index:999999; box-shadow: 0 2px 6px rgba(0,0,0,0.5); border: 1px solid #444; }
        #${CONSTANTS.IDS.SETTINGS} { position: fixed; top: 60px; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; padding:12px; border-radius:8px; border: 2px solid #333; z-index: 999999; width: 340px; max-width: 90vw; box-shadow: 0 4px 10px rgba(0,0,0,0.6); max-height: 80vh; overflow-y: auto; -webkit-overflow-scrolling: touch; }
        #${CONSTANTS.IDS.ALERT} { position: fixed; top: 60px; left: 50%; transform: translateX(-50%); background: #1a1a1a; color: #fff; padding:12px; border-radius:8px; border: 2px solid #444; z-index: 999999; width: 340px; max-width: 90vw; box-shadow: 0 4px 10px rgba(0,0,0,0.6); max-height: 80vh; overflow-y: auto; -webkit-overflow-scrolling: touch; }
        #${CONSTANTS.IDS.SETTINGS} input[type=text], #${CONSTANTS.IDS.SETTINGS} input[type=number] { width: 100%; padding: 6px; margin: 4px 0 10px 0; border-radius: 4px; border: 1px solid #555; background: #111; color: #fff; box-sizing: border-box; }
        #${CONSTANTS.IDS.OVERLAY} { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 2147483647; display: none; animation: flashBorder 1s infinite; }
        .sl_btn { flex:1; padding:6px; border:none; border-radius:4px; color:white; cursor:pointer; font-weight:bold; }
        .sl_close { position:absolute; top:8px; right:10px; font-size:16px; color:#999; cursor:pointer; }

        /* Store List Column Logic */
        #sl_store_list { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; position: relative; }
        .sl_store_group { margin-top: 8px; border-bottom: 2px solid #333;}
        .sl_checkbox_row { display: flex; align-items: center; gap: 6px; font-size: 10px; cursor: pointer; margin-bottom: 2px; }
        .sl_checkbox_row input { width: auto !important; margin: 0 !important; cursor: pointer; }

        /* Gray out the store name when not monitored */
        .sl_store_name { font-size: 11px; font-weight: bold; transition: color 0.2s; margin-bottom: 8px }
        .sl_store_name.dimmed { color: #666 !important; }
        .sl_store_name.active { color: #f4d742 !important; }

        /* Column Divider Line */
        #sl_store_list > div:nth-child(even) { border-left: 2px solid #444; padding-left: 8px; }

        /* PDA Scrolling Fix */
        .bars-mobile___PDyjE { overflow-x: auto !important; display: flex !important; flex-wrap: nowrap !important; white-space: nowrap !important; -webkit-overflow-scrolling: touch; }
        .bars-mobile___PDyjE > * { flex-shrink: 0 !important; }
        .bars-mobile___PDyjE::-webkit-scrollbar { display: none; }
        .bars-mobile___PDyjE #tornShopliftIcon { position: relative !important; top: -8px !important; }

        /* Slide Switch */
        .sl_switch_label { font-size: 9px; color: #888; margin-right: 4px; text-transform: uppercase; }
        .sl_switch { position: relative; display: inline-block; width: 28px; height: 14px; margin-left: auto; }
        .sl_switch input { opacity: 0; width: 0; height: 0; }
        .sl_slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #444; transition: .2s; border-radius: 14px; }
        .sl_slider:before { position: absolute; content: ""; height: 10px; width: 10px; left: 2px; bottom: 2px; background-color: white; transition: .2s; border-radius: 50%; }
        input:checked + .sl_slider { background-color: #2196F3; }
        input:checked + .sl_slider:before { transform: translateX(14px); }
        .sl_store_header { display: flex; align-items: center; justify-content: space-between;}

    `);

    // -------------------------
    // Settings Popup
    // -------------------------
    function toggleSettingsPopup() {
        let popup = document.getElementById(CONSTANTS.IDS.SETTINGS);
        if (!popup) {
            createSettingsPopup();
        } else {
            if (popup.style.display === "none") {
                takeSettingsSnapshot();
                popup.style.display = "block";
            } else {
                revertSettings();
                popup.style.display = "none";
            }
        }
    }

    function takeSettingsSnapshot() {
        state.settingsSnapshot = {
            api: localStorage.getItem(CONSTANTS.KEYS.API) || "",
            poll: localStorage.getItem(CONSTANTS.KEYS.POLL_INTERVAL) || 5,
            audible: localStorage.getItem(CONSTANTS.KEYS.AUDIBLE) === "true",
            visual: localStorage.getItem(CONSTANTS.KEYS.VISUAL) === "true",
            vol: getStorageNum(CONSTANTS.KEYS.AUDIBLE_VOLUME, 0.005, 0, 1000),
            duration: getStorageNum(CONSTANTS.KEYS.VISUAL_DURATION, 5000, 500),
            border: getStorageNum(CONSTANTS.KEYS.BORDER_WIDTH, 5, 5, 50),
            selections: localStorage.getItem(CONSTANTS.KEYS.SELECTIONS) || "{}"
        };
    }

    function revertSettings() {
        if (state.settingsSnapshot.api === undefined) return;
        updateAudioVolume(state.settingsSnapshot.vol);
        updateVisualSettings(state.settingsSnapshot.border);

        // Reset any fields if x pressed
        const apiEl = document.getElementById("sl_api_key");
        const pollEl = document.getElementById("sl_poll_interval");
        const audEl = document.getElementById("sl_audible_cb");
        const visEl = document.getElementById("sl_visual_cb");
        const volEl = document.getElementById("sl_audible_volume");
        const durEl = document.getElementById("sl_visual_duration");
        const borEl = document.getElementById("sl_border_width");
        const savedSels = JSON.parse(state.settingsSnapshot.selections);
        const savedModes = JSON.parse(localStorage.getItem("tornShopliftingModes") || "{}");

        if (apiEl) apiEl.value = state.settingsSnapshot.api;
        if (pollEl) pollEl.value = state.settingsSnapshot.poll;
        if (audEl) audEl.checked = state.settingsSnapshot.audible;
        if (visEl) visEl.checked = state.settingsSnapshot.visual;
        if (volEl) volEl.value = Math.round(state.settingsSnapshot.vol * 1000);
        if (durEl) durEl.value = state.settingsSnapshot.duration / 1000;
        if (borEl) borEl.value = state.settingsSnapshot.border;

        document.querySelectorAll(".sl_store_group").forEach(group => {
            const nameEl = group.querySelector('.sl_store_name');
            const storeKey = nameEl?.dataset.storeName;
            if (!storeKey) return;

            // Reset Checkboxes
            const checkboxes = group.querySelectorAll(".sl_store_cb");
            let hasSelected = false;
            checkboxes.forEach(cb => {
                cb.checked = savedSels[storeKey]?.includes(cb.dataset.title) || false;
                if (cb.checked) hasSelected = true;
            });

            // Reset Store Name Color
            if (nameEl) {
                nameEl.classList.toggle("active", hasSelected);
                nameEl.classList.toggle("dimmed", !hasSelected);
            }

            // Reset ANY/ALL Toggle
            const toggle = group.querySelector(".sl_mode_toggle");
            if (toggle) {
                const isAll = savedModes[storeKey] === "all";
                toggle.checked = isAll;
                const label = group.querySelector('.sl_switch_label');
                if (label) {
                    label.textContent = isAll ? "ALL" : "ANY";
                    label.style.color = isAll ? "#2196F3" : "#888";
                }
            }
        });
    }

    function createSettingsPopup() {
        const popup = createEl("div", null, { id: CONSTANTS.IDS.SETTINGS });
        const savedSels = JSON.parse(localStorage.getItem(CONSTANTS.KEYS.SELECTIONS) || "{}");

        takeSettingsSnapshot();

        let storeHtml = "";
        const savedModes = JSON.parse(localStorage.getItem("tornShopliftingModes") || "{}");

        for (const [key, data] of Object.entries(CONSTANTS.STORES)) {
            let itemsHtml = "";
            for (const m of data.m) {
                const isChecked = savedSels[key]?.includes(m) ? "checked" : "";
                itemsHtml += `<label class="sl_checkbox_row"><input type="checkbox" class="sl_store_cb" data-store="${key}" data-title="${m}" ${isChecked}> ${m}</label>`;
            }

            // Only show the toggle if more than 1 security measure
            const showToggle = data.m.length > 1;
            const isAllMode = savedModes[key] === "all";

            const hasCheckedItems = data.m.some(m => savedSels[key]?.includes(m));
            storeHtml += `
                <div class="sl_store_group">
                    <div class="sl_store_header">
                        <div class="sl_store_name ${hasCheckedItems ? 'active' : 'dimmed'}" data-store-name="${key}">
                             ${data.name}
                         </div>
                        ${showToggle ? `
                            <div style="display:flex; align-items:center;">
                                <span class="sl_switch_label">${isAllMode ? 'ALL' : 'ANY'}</span>
                                <label class="sl_switch">
                                    <input type="checkbox" class="sl_mode_toggle" data-store="${key}" ${isAllMode ? 'checked' : ''}>
                                    <span class="sl_slider"></span>
                                </label>
                            </div>
                        ` : ''}
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2px;">${itemsHtml}</div>
                </div>`;
        }

        popup.innerHTML = `
            <span id="sl_close_settings" class="sl_close">✕</span>
            <h3 style="margin-top:0;">Shoplifting Settings</h3>
            <div style="display:flex; align-items:center;">
                <label style="width:50%"> Public API Key:</label>
                <label style="width:50%"> Polling Interval (min 5s):</label>
            </div>
            <div style="display:flex; align-items:center; margin-bottom:8px;">
                <input id="sl_api_key" type="text" placeholder="Enter public API key" style="width:50%">
                <input id="sl_poll_interval" type="number" min="5" style="width:50%">
            </div>
            <strong>Monitor Selections:</strong>
            <div id="sl_store_list" style="border:1px solid #444; padding:6px; margin-bottom:10px; max-height:230px; overflow:auto;">${storeHtml}</div>
            <strong>Alerts:</strong>
            <div style="border:1px solid #444; padding:6px; margin-bottom:20px;">
                <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
                    <label style="width:50%"><input id="sl_audible_cb" type="checkbox"> Audible Alert</label>
                    <label style="width:50%"><input id="sl_visual_cb" type="checkbox"> Visual Alert</label>
                </div>
                <div style="display:flex; gap:8px; align-items:center;">
                    <input id="sl_audible_volume" type="number" step="1" min="1" max="1000" placeholder="50" style="width:33%">
                    <input id="sl_visual_duration" type="number" min="1" max="30" placeholder="5" style="width:33%">
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

        // update store name colors (gray inactive)
        popup.querySelectorAll(".sl_store_cb").forEach(cb => {
            cb.addEventListener("change", (e) => {
                const storeKey = e.target.dataset.store;
                const group = e.target.closest('.sl_store_group');
                const nameEl = group.querySelector(`[data-store-name="${storeKey}"]`);

                // Check if ANY checkbox in this group is now checked
                const anyChecked = group.querySelectorAll(".sl_store_cb:checked").length > 0;

                if (nameEl) {
                    nameEl.classList.toggle("active", anyChecked);
                    nameEl.classList.toggle("dimmed", !anyChecked);
                }
            });
        });

        // update for live ANY/ALL
        popup.querySelectorAll(".sl_mode_toggle").forEach(toggle => {
            toggle.addEventListener("change", (e) => {
                const isChecked = e.target.checked;
                const group = e.target.closest('.sl_store_group');
                const labelSpan = group.querySelector('.sl_switch_label');

                // change color if all
                if (labelSpan) {
                    labelSpan.textContent = isChecked ? "ALL" : "ANY";
                    labelSpan.style.color = isChecked ? "#2196F3" : "#888";
                }

                // auto-check boxes if all
                if (isChecked) {
                    const checkboxes = group.querySelectorAll(".sl_store_cb");
                    checkboxes.forEach(cb => {
                        cb.checked = true;
                    });

                    // update store name color
                    const nameEl = group.querySelector('.sl_store_name');
                    if (nameEl) {
                        nameEl.classList.add("active");
                        nameEl.classList.remove("dimmed");
                    }
                }
            });
        });

        document.getElementById("sl_api_key").value = localStorage.getItem(CONSTANTS.KEYS.API) || "";
        document.getElementById("sl_poll_interval").value = localStorage.getItem(CONSTANTS.KEYS.POLL_INTERVAL) || 5;
        document.getElementById("sl_audible_cb").checked = localStorage.getItem(CONSTANTS.KEYS.AUDIBLE) === "true";
        document.getElementById("sl_visual_cb").checked = localStorage.getItem(CONSTANTS.KEYS.VISUAL) === "true";
        document.getElementById("sl_audible_volume").value = Math.round(getStorageNum(CONSTANTS.KEYS.AUDIBLE_VOLUME, 0.005, 0, 1000) * 1000);
        document.getElementById("sl_visual_duration").value = getStorageNum(CONSTANTS.KEYS.VISUAL_DURATION, 5000, 500) / 1000;
        document.getElementById("sl_border_width").value = getStorageNum(CONSTANTS.KEYS.BORDER_WIDTH, 5, 5, 50);
        document.getElementById("sl_save_btn").onclick = saveSettings;
        document.getElementById("sl_test_btn").onclick = runAlertTest;
        document.getElementById("sl_close_settings").onclick = () => {
            revertSettings();
            popup.style.display = "none";
        };
    }

    function saveSettings() {
        if (!validateSettings()) return;

        const selections = {};
        document.querySelectorAll(".sl_store_cb").forEach(cb => {
            if (cb.checked) {
                if (!selections[cb.dataset.store]) selections[cb.dataset.store] = [];
                selections[cb.dataset.store].push(cb.dataset.title);
            }
        });

        const modes = {};
        document.querySelectorAll(".sl_mode_toggle").forEach(toggle => {
            modes[toggle.dataset.store] = toggle.checked ? "all" : "any";
        });

        localStorage.setItem(CONSTANTS.KEYS.SELECTIONS, JSON.stringify(selections));
        localStorage.setItem("tornShopliftingModes", JSON.stringify(modes));
        localStorage.setItem(CONSTANTS.KEYS.API, document.getElementById("sl_api_key").value.trim());
        localStorage.setItem(CONSTANTS.KEYS.POLL_INTERVAL, document.getElementById("sl_poll_interval").value);
        localStorage.setItem(CONSTANTS.KEYS.SELECTIONS, JSON.stringify(selections));
        localStorage.setItem(CONSTANTS.KEYS.AUDIBLE, document.getElementById("sl_audible_cb").checked);
        localStorage.setItem(CONSTANTS.KEYS.VISUAL, document.getElementById("sl_visual_cb").checked);
        localStorage.setItem(CONSTANTS.KEYS.AUDIBLE_VOLUME, document.getElementById("sl_audible_volume").value / 1000);
        localStorage.setItem(CONSTANTS.KEYS.VISUAL_DURATION, document.getElementById("sl_visual_duration").value * 1000);
        localStorage.setItem(CONSTANTS.KEYS.BORDER_WIDTH, document.getElementById("sl_border_width").value);

        updateAudioVolume();
        updateVisualSettings();
        document.getElementById(CONSTANTS.IDS.SETTINGS).style.display = "none";
        startMonitoring(true);
    }

    function runAlertTest() {
        if (!validateSettings()) return;

        const testVol = document.getElementById("sl_audible_volume").value;
        const testDur = document.getElementById("sl_visual_duration").value * 1000;
        updateAudioVolume(testVol);
        updateVisualSettings(document.getElementById("sl_border_width").value);

        if (document.getElementById("sl_audible_cb").checked) {
            slAudio.currentTime = 0;
            slAudio.play().catch(console.warn);
        }
        if (document.getElementById("sl_visual_cb").checked) {
            startVisualAlarm(testDur);
        }
    }

    // -------------------------
    // Universal Popup
    // -------------------------
    function showGenericPopup(title, contentHtml, buttons, titleColor) {
        const existing = document.getElementById(CONSTANTS.IDS.ALERT);
        if (existing) existing.remove();

        const popup = createEl("div", null, { id: CONSTANTS.IDS.ALERT });
        let btnsHtml = buttons.map((b, i) => `<button id="sl_p_btn_${i}" class="sl_btn" style="background:${i === 0 ? '#2196F3' : '#444'}">${b.text}</button>`).join("");

        popup.innerHTML = `<h3 style="margin-top:0; color:${titleColor || '#fff'};">${title}</h3><div style="margin-bottom:12px;">${contentHtml}</div><div style="display:flex; gap:8px;">${btnsHtml}</div>`;
        document.body.appendChild(popup);

        buttons.forEach((b, i) => {
            document.getElementById(`sl_p_btn_${i}`).onclick = () => { if (b.cb) b.cb(); popup.remove(); };
        });
    }

    function goToShopliftPage() {
        window.location.href = "https://www.torn.com/page.php?sid=crimes#/shoplifting";
    }

    // -------------------------
    // Tooltip
    // -------------------------
    function showTooltip() {
        // If alert popup is visible, do nothing (to prevent tooltip on PDA when clicking)
        if (document.getElementById(CONSTANTS.IDS.ALERT)) { return; }
        const icon = document.getElementById(CONSTANTS.IDS.MAIN_ICON);
        if (!icon || state.isApiInvalid) return;

        const tooltip = createEl("div", null, { id: CONSTANTS.IDS.TOOLTIP });
        let html = "";

        for (const [sKey, data] of Object.entries(CONSTANTS.STORES)) {
            const items = state.tooltipData[sKey] || [];
            if (items.length === 0) continue;
            let mHtml = items.map(m => `<div style="color:${m.disabled ? '#ff6767' : '#8cff8c'}; margin-left:8px;">${m.monitored ? '◈' : '◇'} ${m.title}</div>`).join("");
            html += `<div style="margin-bottom:4px;"><strong>${data.name}</strong>${mHtml}</div>`;
        }

        tooltip.innerHTML = html || "No data available";
        document.body.appendChild(tooltip);
        const rect = icon.getBoundingClientRect();
        tooltip.style.top = `${window.scrollY + rect.top - tooltip.offsetHeight - 8}px`;
        tooltip.style.left = `${window.scrollX + rect.left - (tooltip.offsetWidth/2) + 12}px`;
    }

    function hideTooltip() {
        const t = document.getElementById(CONSTANTS.IDS.TOOLTIP);
        if (t) t.remove();
    }

    // -------------------------
    // Alarms
    // -------------------------
    function triggerAlarms() {
        if (localStorage.getItem(CONSTANTS.KEYS.AUDIBLE) === "true") {
            slAudio.currentTime = 0;
            slAudio.play().catch(() => {});
        }
        if (localStorage.getItem(CONSTANTS.KEYS.VISUAL) === "true") {
            startVisualAlarm();
        }
    }

    function startVisualAlarm(customDuration) {
        let overlay = document.getElementById(CONSTANTS.IDS.OVERLAY) || createEl("div", null, { id: CONSTANTS.IDS.OVERLAY });
        if (!overlay.parentElement) document.body.appendChild(overlay);
        overlay.style.display = "block";
        setTimeout(() => { overlay.style.display = "none"; }, customDuration || getStorageNum(CONSTANTS.KEYS.VISUAL_DURATION, 5000, 500));
    }

    // -------------------------
    // Main Logic
    // -------------------------
    async function checkShops(forceTrigger = false) {
        const key = localStorage.getItem(CONSTANTS.KEYS.API);
        if (!key) return setIconState("#f4d742");

        try {
            const res = await fetch(CONSTANTS.API_URL + key);
            const data = await res.json();
            if (data?.error?.code === 2) { state.isApiInvalid = true; return setIconState("#f4d742"); }
            if (!data?.shoplifting) return;

            state.isApiInvalid = false;
            const userSels = JSON.parse(localStorage.getItem(CONSTANTS.KEYS.SELECTIONS) || "{}");
            const userModes = JSON.parse(localStorage.getItem("tornShopliftingModes") || "{}");
            const newTooltip = {}; const newAlerts = []; let trigger = false;

            for (const sKey in CONSTANTS.STORES) {
                if (!Object.prototype.hasOwnProperty.call(CONSTANTS.STORES, sKey)) continue;
                newTooltip[sKey] = [];
                const storeData = data.shoplifting[sKey] || [];
                const mode = userModes[sKey] || "any";
                let monitoredItemsCount = 0;
                let disabledMonitoredItemsCount = 0;
                let storeAlerts = [];

                for (const m of storeData) {
                    const monitored = userSels[sKey]?.includes(m.title);
                    newTooltip[sKey].push({ title: m.title, disabled: m.disabled, monitored });

                    if (monitored) {
                        monitoredItemsCount++;
                        if (m.disabled) {
                            disabledMonitoredItemsCount++;
                            storeAlerts.push(`• ${CONSTANTS.STORES[sKey].name}: ${m.title}`);
                        }
                    }
                }

                let shouldAlertStore = false;
                if (monitoredItemsCount > 0) {
                    if (mode === "all") {
                        if (disabledMonitoredItemsCount === monitoredItemsCount && disabledMonitoredItemsCount > 0) {
                            shouldAlertStore = true;
                        }
                    } else {
                        if (disabledMonitoredItemsCount > 0) {
                            shouldAlertStore = true;
                        }
                    }
                }

                if (shouldAlertStore) {
                    newAlerts.push(...storeAlerts);
                    const stateKey = `${sKey}_${mode}`;
                    const currentStateValue = mode === "all" ? "full_down" : storeAlerts.join("|");
                    if (!state.previousState[stateKey] || state.previousState[stateKey] !== currentStateValue) {
                        trigger = true;
                    }
                    state.previousState[stateKey] = currentStateValue;
                } else {
                    state.previousState[`${sKey}_${mode}`] = null;
                }
            }

            state.tooltipData = newTooltip;
            state.lastAlertList = newAlerts;
            setIconState(newAlerts.length > 0 ? "#ff3b3b" : "#4CAF50", newAlerts.length > 0);
            if (trigger || (forceTrigger && newAlerts.length > 0)) triggerAlarms();
        } catch (e) {
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
            const interval = getStorageNum(CONSTANTS.KEYS.POLL_INTERVAL, 5, 5);
            state.pollTimer = setTimeout(loop, interval * 1000);
        };
        loop();
    }

    // -------------------------
    // Initialization
    // -------------------------
    updateAudioVolume();
    updateVisualSettings();
    unlockAudio();
    injectSidebarIcon();
    startMonitoring(true);
    setInterval(injectSidebarIcon, 3000);

})();
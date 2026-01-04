// ==UserScript==
// @name         ZedTools Notifier
// @namespace    http://tampermonkey.net/
// @version      3.4.0
// @description  ZedTools notifier with persistent timers for Junk Store, Scrap Expert, and Radio Tower (works during travel) + toolbar icon & UI
// @author       You
// @match        https://zed.city/*
// @match        https://*.zed.city/*
// @grant        GM_xmlhttpRequest
// @connect      zed.city
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551847/ZedTools%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/551847/ZedTools%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 60 * 1000; // normal stats
    const XP_CHECK_INTERVAL = 10 * 1000; // XP percentage check
    const STORAGE_KEY = 'ZedToolsNotifier';

    const defaultConfig = {
        thresholds: { energy: 100, rad: 15, morale: 100, life: 100, booster: 300, raid: 300, xp: 80, scrap_expert: 300, radio_tower: 300 },
        notified: { energy: false, rad: false, morale: false, life: false, reset_time: false, booster: false, raid: false, xp: false, relaxed: false, rested: false, traveling: false, scrap_expert: false, radio_tower: false },
        enabled: { energy: true, rad: true, morale: true, life: true, reset_time: true, booster: true, raid: true, xp: true, relaxed: true, rested: true, traveling: true, scrap_expert: true, radio_tower: true },
        uiVisible: true
    };

    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    config = {
        thresholds: { ...defaultConfig.thresholds, ...(config.thresholds || {}) },
        notified: { ...defaultConfig.notified, ...(config.notified || {}) },
        enabled: { ...defaultConfig.enabled, ...(config.enabled || {}) },
        uiVisible: config.uiVisible ?? defaultConfig.uiVisible,
        isMember: config.membership ?? false
    };

    function saveConfig() { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); }

    // timers (remaining seconds shown in UI)
    let junkTimeSeconds = 0;
    let scrapExpertTime = 0;
    let radioTowerTime = 0;
    let boosterTime = 0;
    let raidTime = 0;
    let relaxedTime = 0;
    let restedTime = 0;
    let currentXP = 0;
    let nextLevelXP = 0;
    let travelingTime = 0;
    let travelingLoc = "";
    let travelingNotified = false;

    // === Persistent Cooldown storage using expiry timestamps (now + seconds) ===
    function saveCooldownExpiry(key, seconds) {
        try {
            const expiry = Date.now() + (Number(seconds) * 1000);
            localStorage.setItem(`ZedCooldown_${key}`, expiry.toString());
        } catch (e) { console.error("[ZedTools] saveCooldownExpiry error:", e); }
    }

    function loadCooldownRemaining(key) {
        try {
            const raw = localStorage.getItem(`ZedCooldown_${key}`);
            if (!raw) return null;
            const expiry = parseInt(raw, 10);
            if (!expiry) return null;
            const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
            return remaining;
        } catch (e) {
            console.error("[ZedTools] loadCooldownRemaining error:", e);
            return null;
        }
    }

    // audio + notify permission
    const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
    if (Notification.permission !== "granted" && Notification.permission !== "denied") Notification.requestPermission();

    function sendNotification(title, text) {
        if (Notification.permission === "granted") {
            try { new Notification(title, { body: text }); } catch (e) { console.log("[ZedTools] Notification error:", e); }
            audio.play().catch(e => console.log("[ZedTools] Audio error:", e));
        } else {
            console.log(`[ZedTools] ${title}: ${text}`);
            audio.play().catch(e => console.log("[ZedTools] Audio error:", e));
        }
    }

    function notifyUser(stat, value) {
        const msg = typeof value === 'number' ? `${stat} reached ${value}!` : value;
        console.log("[ZedTools Notifier] Notify:", msg);
        sendNotification("⚡ ZedTools Notifier", msg);
        gmNotify(msg, "warning", "Stat Alert!");
    }

    function gmNotify(message, color = "positive", caption) {
        const vueApp = window.app || window.vueApp || document.querySelector("#q-app")?._vnode?.appContext?.app;
        const $q = vueApp?.config?.globalProperties?.$q;
        if ($q && typeof $q.notify === "function") {
            $q.notify({
                message: `⚡ [ZedTools Notifier] ${message}`,
                caption: caption || "",
                color,
                position: "top-right",
                timeout: 3500,
                multiLine: true
            });
        } else {
            console.log("[ZedTools Notifier] Notify:", message);
        }
    }

    // UI update helpers
    function updateCountdownUI(elId, timeSeconds) {
        const el = document.getElementById(elId);
        if (!el) return;
        if (timeSeconds <= 0) {
            el.textContent = "(Ready!)";
            el.style.color = "#00ff66";
            el.style.fontWeight = "bold";
        } else {
            const hours = Math.floor(timeSeconds / 3600);
            const minutes = Math.floor((timeSeconds % 3600) / 60);
            const seconds = timeSeconds % 60;
            const timeStr = hours > 0 ? `${hours}h ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`;
            el.textContent = `(${timeStr})`;
            el.style.color = "#ffd966";
            el.style.fontWeight = "normal";
        }
    }
    function updateJunkUI() { updateCountdownUI("zc_junk_time", junkTimeSeconds); }
    function updateScrapExpertUI() { updateCountdownUI("zc_scrapexpert_time", scrapExpertTime); }
    function updateRadioTowerUI() { updateCountdownUI("zc_radiotower_time", radioTowerTime); }
    function updateBoosterUI() { updateCountdownUI("zc_booster_time", boosterTime); }
    function updateRaidUI() { updateCountdownUI("zc_raid_time", raidTime); }
    function updateRelaxedUI() { updateCountdownUI("zc_relaxed_time", relaxedTime); }
    function updateRestedUI() { updateCountdownUI("zc_rested_time", restedTime); }
    function updateTravelingUI() { updateCountdownUI("zc_traveling_time", travelingTime); }

    function updateXPUI(percent) {
        const el = document.getElementById("zc_xp");
        if (!el) return;
        el.textContent = `${percent}%`;
        el.style.color = "#000";
    }

    // portable xhr helper
    function xhrGet(url, onload) {
        if (typeof GM_xmlhttpRequest === 'function') {
            GM_xmlhttpRequest({ method: "GET", url, headers: { "Accept": "application/json" }, onload });
        } else {
            fetch(url, { headers: { "Accept": "application/json" } })
                .then(r => r.text())
                .then(responseText => onload({ status: 200, responseText }))
                .catch(e => onload({ status: 0, error: e }));
        }
    }

    // === Core checks ===
    function checkStats() {
        xhrGet("https://api.zed.city/getStats", function(response) {
            if (response.status === 200) {
                try {
                    const data = JSON.parse(response.responseText);

                    // Basic stats checks
                    const stats = { energy: data.energy, rad: data.rad, morale: data.morale, life: data.life };
                    for (const stat in stats) {
                        if (!config.enabled[stat]) continue;
                        const value = stats[stat];
                        const limit = config.thresholds[stat];
                        if (value >= limit && !config.notified[stat]) {
                            notifyUser(stat, value);
                            config.notified[stat] = true; saveConfig();
                        } else if (value < limit && config.notified[stat]) {
                            config.notified[stat] = false; saveConfig();
                        }
                    }

                    // Booster & Raid (seconds)
                    boosterTime = Number(data.booster_cooldown ?? 0);
                    raidTime = Number(data.raid_cooldown ?? 0);

                    // Notifications for booster/raid
                    if (config.enabled.booster && ((boosterTime <= config.thresholds.booster && boosterTime > 0 && !config.notified.booster) || (boosterTime === 0 && !config.notified.booster))) {
                        const msg = boosterTime === 0 ? "Booster ready!" : `Booster ready in ${Math.ceil(boosterTime/60)} min!`;
                        notifyUser("Booster", msg); config.notified.booster = true; saveConfig();
                    } else if (boosterTime > config.thresholds.booster && config.notified.booster) { config.notified.booster = false; saveConfig(); }

                    if (config.enabled.raid && ((raidTime <= config.thresholds.raid && raidTime > 0 && !config.notified.raid) || (raidTime === 0 && !config.notified.raid))) {
                        const msg = raidTime === 0 ? "Raid ready!" : `Raid ready in ${Math.ceil(raidTime/60)} min!`;
                        notifyUser("Raid", msg); config.notified.raid = true; saveConfig();
                    } else if (raidTime > config.thresholds.raid && config.notified.raid) { config.notified.raid = false; saveConfig(); }

                    updateBoosterUI();
                    updateRaidUI();

                    // Temporary effects
                    const effects = data.effects || [];
                    const relaxed = effects.find(e => e.codename === "player_effect_feeling_relaxed");
                    const rested = effects.find(e => e.codename === "player_effect_recently_rested");

                    relaxedTime = relaxed ? Number(relaxed.expire) : 0;
                    restedTime = rested ? Number(rested.expire) : 0;

                    updateRelaxedUI();
                    updateRestedUI();

                } catch (e) { console.error("[ZedTools Notifier] Error parsing stats:", e); }
            }
        });

        // === Junk Store ===
        xhrGet("https://api.zed.city/getStore?store_id=junk", function(response) {
            try {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data.error) throw new Error(data.error);
                    // API returns seconds until reset
                    junkTimeSeconds = Number(data?.limits?.reset_time ?? data?.store?.reset_time ?? 0);
                    if (junkTimeSeconds > 0) saveCooldownExpiry("junk", junkTimeSeconds);
                } else {
                    const stored = loadCooldownRemaining("junk");
                    if (stored !== null) junkTimeSeconds = stored;
                }
            } catch (e) {
                // parse/other error => try stored expiry
                const stored = loadCooldownRemaining("junk");
                if (stored !== null) junkTimeSeconds = stored;
            }
            updateJunkUI();

            // notify based on config thresholds (reset_time used for junk)
            if (config.enabled.reset_time) {
                if ((junkTimeSeconds <= config.thresholds.reset_time && junkTimeSeconds > 0 && !config.notified.reset_time) || (junkTimeSeconds === 0 && !config.notified.reset_time)) {
                    const msg = junkTimeSeconds === 0 ? "Junk store has just reset!" : `Junk store reset in ${Math.ceil(junkTimeSeconds/60)} minutes!`;
                    notifyUser("Junk Store Reset", msg); config.notified.reset_time = true; saveConfig();
                } else if (junkTimeSeconds > config.thresholds.reset_time && config.notified.reset_time) {
                    config.notified.reset_time = false; saveConfig();
                }
            }
        });
    }

    function checkTraveling() {
        xhrGet("https://api.zed.city/getTraveling", function(response) {
            if (response.status === 200) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.traveling) {
                        travelingTime = Number(data.time_left ?? 0);
                        travelingLoc = data.loc_name ?? data.codename ?? "Unknown location";
                        // store? traveling is ephemeral; keep as-is
                        if (!travelingNotified && travelingTime <= 60) {
                            notifyUser("Traveling", `Arriving soon at ${travelingLoc}!`);
                            travelingNotified = true;
                        }
                    } else {
                        if (travelingTime > 0) notifyUser("Traveling", `You have arrived at ${travelingLoc}!`);
                        travelingTime = 0;
                        travelingNotified = false;
                    }
                    updateTravelingUI();
                } catch(e) { console.error("[ZedTools Notifier] Traveling parse error:", e); }
            } else {
                // if traveling API not reachable, try to keep previous travelingTime as-is (countdown will continue locally)
                const stored = null; // no persistent store for traveling
                // nothing to do
            }
        });
    }

    function checkScrapExpert() {
        xhrGet("https://api.zed.city/getRoom?group=scrap_expert", function(response) {
            try {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    // API returns seconds remaining for scrapnote_time_limit_remaining
                    scrapExpertTime = Number(data?.extra?.scrapnote_time_limit_remaining ?? 0);
                    if (scrapExpertTime > 0) saveCooldownExpiry("scrap_expert", scrapExpertTime);
                } else {
                    const stored = loadCooldownRemaining("scrap_expert");
                    if (stored !== null) scrapExpertTime = stored;
                }
            } catch (e) {
                const stored = loadCooldownRemaining("scrap_expert");
                if (stored !== null) scrapExpertTime = stored;
            }
            updateScrapExpertUI();

            if (config.enabled.scrap_expert) {
                if ((scrapExpertTime <= config.thresholds.scrap_expert && scrapExpertTime > 0 && !config.notified.scrap_expert) || (scrapExpertTime === 0 && !config.notified.scrap_expert)) {
                    const msg = scrapExpertTime === 0 ? "Scrap Expert reset!" : `Scrap Expert reset in ${Math.ceil(scrapExpertTime/60)} minutes!`;
                    notifyUser("Scrap Expert", msg); config.notified.scrap_expert = true; saveConfig();
                } else if (scrapExpertTime > config.thresholds.scrap_expert && config.notified.scrap_expert) {
                    config.notified.scrap_expert = false; saveConfig();
                }
            }
        });
    }

    function checkRadioTower() {
        xhrGet("https://api.zed.city/getRadioTower", function(response) {
            try {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    radioTowerTime = Number(data?.expire ?? 0); // seconds until expire/reset
                    if (radioTowerTime > 0) saveCooldownExpiry("radio_tower", radioTowerTime);
                } else {
                    const stored = loadCooldownRemaining("radio_tower");
                    if (stored !== null) radioTowerTime = stored;
                }
            } catch (e) {
                const stored = loadCooldownRemaining("radio_tower");
                if (stored !== null) radioTowerTime = stored;
            }
            updateRadioTowerUI();

            if (config.enabled.radio_tower) {
                if ((radioTowerTime <= config.thresholds.radio_tower && radioTowerTime > 0 && !config.notified.radio_tower) || (radioTowerTime === 0 && !config.notified.radio_tower)) {
                    const msg = radioTowerTime === 0 ? "Radio Tower reset!" : `Radio Tower reset in ${Math.ceil(radioTowerTime/60)} minutes!`;
                    notifyUser("Radio Tower", msg); config.notified.radio_tower = true; saveConfig();
                } else if (radioTowerTime > config.thresholds.radio_tower && config.notified.radio_tower) {
                    config.notified.radio_tower = false; saveConfig();
                }
            }
        });
    }

    function checkXP() {
        xhrGet("https://api.zed.city/getStats", function(response) {
            if (response.status === 200) {
                try {
                    const data = JSON.parse(response.responseText);
                    currentXP = Number(data.experience);
                    nextLevelXP = Number(data.xp_end);
                    const xpPercent = nextLevelXP > 0 ? Math.floor((currentXP / nextLevelXP) * 100) : 0;
                    updateXPUI(xpPercent);
                    if (config.enabled.xp && xpPercent >= config.thresholds.xp && !config.notified.xp) {
                        notifyUser("XP", `You are ${xpPercent}% towards next level!`);
                        config.notified.xp = true; saveConfig();
                    } else if (xpPercent < config.thresholds.xp && config.notified.xp) {
                        config.notified.xp = false; saveConfig();
                    }
                } catch(e){ console.error("[ZedTools Notifier] XP parse error:", e); }
            }
        });
    }

    // === Initialization calls & intervals ===
    checkStats();
    checkXP();
    checkTraveling();
    checkScrapExpert();
    checkRadioTower();

    setInterval(checkStats, CHECK_INTERVAL);
    setInterval(checkXP, XP_CHECK_INTERVAL);
    setInterval(checkTraveling, CHECK_INTERVAL);
    setInterval(checkScrapExpert, CHECK_INTERVAL);
    setInterval(checkRadioTower, CHECK_INTERVAL);

    // === Local 1-second countdowns (UI smooth countdown) ===
    setInterval(() => {
        if (junkTimeSeconds > 0) junkTimeSeconds--;
        if (boosterTime > 0) boosterTime--;
        if (raidTime > 0) raidTime--;
        if (relaxedTime > 0) relaxedTime--;
        if (restedTime > 0) restedTime--;
        if (travelingTime > 0) travelingTime--;
        if (scrapExpertTime > 0) scrapExpertTime--;
        if (radioTowerTime > 0) radioTowerTime--;

        updateJunkUI();
        updateBoosterUI();
        updateRaidUI();
        updateRelaxedUI();
        updateRestedUI();
        updateTravelingUI();
        updateScrapExpertUI();
        updateRadioTowerUI();
    }, 1000);

    // === Settings Panel & Toolbar Icon (injected into site) ===
    const panel = document.createElement("div");
    Object.assign(panel.style, { position: "fixed", bottom: "60px", left: "20px", width: "260px", background: "rgba(20,20,20,0.95)", color: "#fff", borderRadius: "10px", fontFamily: "Arial,sans-serif", fontSize: "12px", zIndex: "9999", boxShadow: "0 0 10px rgba(0,0,0,0.5)", transition: "all 0.3s ease", opacity: config.uiVisible ? "1" : "0", transform: config.uiVisible ? "translateY(0)" : "translateY(10px)", display: config.uiVisible ? "block" : "none", backdropFilter: "blur(4px)" });

    const header = document.createElement("div");
    header.textContent = "⚙️ ZedTools Notifier";
    Object.assign(header.style, { padding: "6px", fontWeight: "bold", textAlign: "center", background: "#2c2c2c", borderRadius: "10px 10px 0 0" });
    panel.appendChild(header);

    const content = document.createElement("div");
    content.style.padding = "6px";

    const fields = [
        { id: "energy", label: "Energy" },
        { id: "rad", label: "Rad" },
        { id: "morale", label: "Morale" },
        { id: "life", label: "Life" },
        { id: "xp", label: "Experience (%)" }
    ];

    function createRow(labelText, elId, key, isNumberInput = true) {
        const row = document.createElement("div");
        Object.assign(row.style, { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" });
        const label = document.createElement("label");
        label.textContent = labelText; label.style.flex = "1";
        let input;
        if (isNumberInput) {
            input = document.createElement("input");
            input.type = "number";
            input.value = config.thresholds[key];
            input.id = "zc_" + key;
            Object.assign(input.style, { width: "50px", marginRight: "4px" });
        }
        const timeEl = document.createElement("span");
        timeEl.id = elId;
        timeEl.textContent = isNumberInput ? "" : "(—)";
        timeEl.style.marginRight = "6px";
        timeEl.style.opacity = "0.8";
        timeEl.style.fontSize = "11px";
        const bell = document.createElement("span");
        bell.textContent = "🔔";
        const check = document.createElement("input");
        check.type = "checkbox";
        check.checked = config.enabled[key];
        check.id = "zc_enable_" + key;
        row.appendChild(label);
        if (isNumberInput) row.appendChild(input);
        row.appendChild(timeEl);
        row.appendChild(bell);
        row.appendChild(check);
        content.appendChild(row);
    }

    createRow("Energy", "zc_energy_time", "energy");
    createRow("Rad", "zc_rad_time", "rad");
    createRow("Morale", "zc_morale_time", "morale");
    createRow("Life", "zc_life_time", "life");
    createRow("Experience (%)", "zc_xp", "xp", true);
    createRow("Junk Reset", "zc_junk_time", "reset_time", false);
    createRow("Traveling", "zc_traveling_time", "traveling", false);
    createRow("Scrap Expert", "zc_scrapexpert_time", "scrap_expert", false);
    createRow("Radio Tower", "zc_radiotower_time", "radio_tower", false);
    createRow("Booster Ready", "zc_booster_time", "booster", false);
    createRow("Raid Ready", "zc_raid_time", "raid", false);
    createRow("SPA Timer", "zc_relaxed_time", "relaxed", false);
    createRow("Sleeping Timer", "zc_rested_time", "rested", false);

    // Test button
    const testButton = document.createElement("button");
    testButton.textContent = "🔊 Test Alert";
    Object.assign(testButton.style, { marginTop: "5px", width: "100%", borderRadius: "6px", border: "none", background: "#28a745", color: "white", padding: "5px 0", cursor: "pointer" });
    testButton.addEventListener("click", () => { sendNotification("ZedTools Notifier Test", "This is a test alert!"); gmNotify("Test notification sent!", "info"); });
    content.appendChild(testButton);

    // Save button
    const saveButton = document.createElement("button");
    saveButton.id = "zc_save";
    saveButton.textContent = "💾 Save";
    Object.assign(saveButton.style, { marginTop: "5px", width: "100%", borderRadius: "6px", border: "none", background: "#0078d7", color: "white", padding: "5px 0", cursor: "pointer" });
    saveButton.addEventListener("click", () => {
        fields.forEach(f => {
            if (f.id !== "xp") {
                config.thresholds[f.id] = parseInt(document.getElementById("zc_" + f.id).value) || 100;
            } else {
                config.thresholds[f.id] = parseInt(document.getElementById("zc_" + f.id).value) || 80;
            }
            config.enabled[f.id] = document.getElementById("zc_enable_" + f.id).checked;
        });
        // enable checkboxes for non-field items
        ["reset_time","booster","raid","relaxed","rested","traveling","scrap_expert","radio_tower"].forEach(k => {
            const el = document.getElementById("zc_enable_" + k);
            if (el) config.enabled[k] = el.checked;
        });
        saveConfig();
        gmNotify("Settings saved!", "info");
    });
    content.appendChild(saveButton);

    panel.appendChild(content);
    document.body.appendChild(panel);

    let visible = config.uiVisible;
    function updatePanelVisibility() {
        if (visible) {
            panel.style.display = "block";
            setTimeout(() => { panel.style.opacity = "1"; panel.style.transform = "translateY(0)"; }, 10);
        } else {
            panel.style.opacity = "0";
            panel.style.transform = "translateY(10px)";
            setTimeout(() => { panel.style.display = "none"; }, 300);
        }
        config.uiVisible = visible;
        saveConfig();
    }

    // toolbar injection (keeps site look & feel by copying notifications link style)
    function insertToolbarIcon() {
        try {
            const notifIcon = document.querySelector('a[href="/notifications"]');
            if (!notifIcon || document.getElementById('zcToolbarBtn')) return false;
            const iconLink = document.createElement('a'); iconLink.id = 'zcToolbarBtn'; iconLink.className = notifIcon.className; iconLink.href = 'javascript:void(0)'; iconLink.style.display = 'inline-flex'; iconLink.style.alignItems = 'center'; iconLink.style.justifyContent = 'center'; iconLink.style.height = notifIcon.offsetHeight + 'px'; iconLink.style.width = notifIcon.offsetWidth + 'px';
            iconLink.innerHTML = `<span class="q-focus-helper"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row" style="font-size: 1.3em;"><i class="q-icon fal fa-bullhorn" style="font-size: 1em; line-height: 1;" aria-hidden="true" role="img"></i></span>`;
            iconLink.title = "ZedTools Notifier";
            iconLink.addEventListener('click', () => { visible = !visible; updatePanelVisibility(); });
            notifIcon.parentElement.insertBefore(iconLink, notifIcon);
            const computed = window.getComputedStyle(notifIcon); iconLink.style.color = computed.color;
            iconLink.addEventListener("mouseenter", () => { iconLink.style.opacity = "0.8"; });
            iconLink.addEventListener("mouseleave", () => { iconLink.style.opacity = "1"; });
            return true;
        } catch (e) {
            console.error("[ZedTools] insertToolbarIcon error:", e);
            return false;
        }
    }

    const toolbarCheck = setInterval(() => { if (insertToolbarIcon()) clearInterval(toolbarCheck); }, 1000);

})();

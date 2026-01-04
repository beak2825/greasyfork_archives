// ==UserScript==
// @name         LWM The One Script Grey
// @author       ImmortalRegis
// @namespace    https://www.lordswm.com/pl_info.php?id=6736731
// @version      v1.1
// @description  Will keep track of all your needs. Timer or otherwise.
// @match        https://www.lordswm.com/*
// @grant		     GM.notification
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/555486/LWM%20The%20One%20Script%20Grey.user.js
// @updateURL https://update.greasyfork.org/scripts/555486/LWM%20The%20One%20Script%20Grey.meta.js
// ==/UserScript==
/*
Grey version, Not for Public
@grant unsafeWindow -is required to grab the thieves guild timer. to parse the war.php pages.
i've disabled this method for now alternative method is better because it detects losses as well.
@grant GM.notification -this is for the windows notification.

Join the discord to give me feedback - https://discord.com/invite/mbYt5TT

If you really like the script, gifts are welcome - https://www.lordswm.com/pl_info.php?id=6736731
*/
(function() {
    'use strict';
    // ========== Schedules Constants ==========
    const MODULES = {
        hunt: {
            name: 'Hunters Guild',
            enabledKey: 'mod_hunt_enabled',
            alertKey: 'mod_hunt_alert',
            timerKey: 'mod_hunt_timer',
            lastCheckedKey: 'mod_hunt_last_checked',
            notifiedKey: 'mod_hunt_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/map.php'
        },
        mg: {
            name: 'Mercenaries Guild',
            enabledKey: 'mod_mg_enabled',
            alertKey: 'mod_mg_alert',
            timerKey: 'mod_mg_timer',
            lastCheckedKey: 'mod_mg_last_checked',
            notifiedKey: 'mod_mg_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/mercenary_guild.php'
        },
        leaders: {
            name: 'Leaders Guild',
            enabledKey: 'mod_leg_enabled',
            alertKey: 'mod_leg_alert',
            timerKey: 'mod_leg_timer',
            lastCheckedKey: 'mod_leg_last_checked',
            notifiedKey: 'mod_leg_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/leader_guild.php'
        },
        laborers: {
            name: 'Laborers Guild',
            enabledKey: 'mod_labor_enabled',
            alertKey: 'mod_labor_alert',
            timerKey: 'mod_labor_timer',
            lastCheckedKey: 'mod_labor_last_checked',
            notifiedKey: 'mod_labor_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/map.php'
        },
        smith: {
            name: 'Smiths Guild',
            enabledKey: 'mod_smith_enabled',
            alertKey: 'mod_smith_alert',
            timerKey: 'mod_smith_timer',
            lastCheckedKey: 'mod_smith_last_checked',
            notifiedKey: 'mod_smith_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/mod_workbench.php'
        },
        enchant: {
            name: 'Enchanters Guild',
            enabledKey: 'mod_enchant_enabled',
            alertKey: 'mod_enchant_alert',
            timerKey: 'mod_enchant_timer',
            lastCheckedKey: 'mod_enchant_last_checked',
            notifiedKey: 'mod_enchant_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: true,
            moduleUrl: '/mod_workbench.php'
        },
        thieves: {
            name: 'Thieves Guild',
            enabledKey: 'mod_thieves_enabled',
            alertKey: 'mod_thieves_alert',
            timerKey: 'mod_thieves_timer',
            lastCheckedKey: 'mod_thieves_checked',
            notifiedKey: 'mod_thieves_notified',
            lastWarIdKey: 'mod_thieves_last_warid', //this will parse the battle page, needs unsafe window
            showInPanel: true,
            defaultEnabled: true,
            defaultAlert: true,
            moduleUrl: '/map.php',
        },
        /*custom: {
            name: 'Custom Button',
            enabledKey: 'mod_custom_enabled',
            alertKey: 'mod_custom_alert',
            timerKey: 'mod_custom_timer',
            lastCheckedKey: 'mod_custom_last_checked',
            notifiedKey: 'mod_custom_notified',
            defaultEnabled: true,
            showInPanel: true,
            defaultAlert: false,
            moduleUrl:'/home.php'
        },*/
    };
    const PLAYERINFO = {
        premiumKey: 'player_premium_status',
        signValue: 'player_sign_value',
        lastPage: 'player_last_used_page'
    };
    const WINDOWS_NOTIFICATION_ENABLE = true; //true would give windows notifications
    let minimized = false;
    const recheckCooldownShort = 0.5 * 60 * 1000; //2 minutes cooldown used for HG and MG , for bun 2.5
    const recheckCooldownMedium = 10 * 60 * 1000; //10 minutes cooldown used for TG
    const recheckCooldownLong = 15 * 60 * 1000; //15 min cooldown for smith or enchant pages
    // --- Unified storage layer using localStorage internally ---
    function setFlag(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) {
            console.error(`[setFlag] Failed to store key "${key}":`, e);
        }
    }

    function getFlag(key, def = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw === null ? def : JSON.parse(raw);
        } catch (e) {
            console.warn(`[getFlag] Failed to parse key "${key}":`, e);
            return def;
        }
    }

    function removeFlag(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error(`[removeFlag] Failed to remove key "${key}":`, e);
        }
    }
    // --- Tampermonkey-style async wrappers using the above ---
    async function setValue(key, value) {
        setFlag(key, value);
    }
    async function getValue(key, defaultValue = null) {
        return getFlag(key, defaultValue);
    }
    async function removeValue(key) {
        removeFlag(key);
    }
    // ========== UI Elements ==========
    function createPanel() {
        let panel = document.getElementById('lwm_scheduler_panel');
        if (panel) {
            panel.remove();
        }
        if (!getFlag(MASTER_PANEL_FLAG, true)) return;
        panel = document.createElement('div');
        panel.id = 'lwm_scheduler_panel';
        panel.className = 'lwm_custom_container';
        panel.innerHTML = `
            <div class="lwm_custom_decor_top"></div>
            <div class="lwm_custom_decor_bottom"></div>
		    <div class="lwm_custom_header" id="lwm-header">
            <strong id="lwm-title" title="Minimize Panel">Schedules </strong>
            <span id="lwm-settings" title="Settings">&#9881;</span>
            </div>
            <div id="lwm-modules"></div>
        `;
        document.body.appendChild(panel);
        setupListeners();
        document.getElementById('lwm-modules').style.display = minimized ? 'none' : 'block';
        document.getElementById('lwm-title').textContent = minimized ? 'Schedules ▽' : 'Schedules 🜂';
        document.getElementById('lwm-title').title = minimized ? 'Show Panel' : 'Hide Panel';
    }

    function setupListeners() {
        const title = document.getElementById('lwm-title');
        title.addEventListener('click', () => {
            minimized = !minimized;
            title.textContent = minimized ? 'Schedules ▽' : 'Schedules 🜂';
            title.title = minimized ? 'Show Panel' : 'Hide Panel';
            setFlag('panel_minimized', minimized);
            document.getElementById('lwm-modules').style.display = minimized ? 'none' : 'block';
        });
        document.getElementById('lwm-settings').addEventListener('click', showSettingsPopup);
    }

    function showSettingsPopup() {
        let modal = document.getElementById('lwm-settings-popup');
        if (modal) {
            modal.remove();
            return;
        }
        modal = document.createElement('div');
        modal.id = 'lwm-settings-popup';
        modal.className = 'lwm_custom_container lwm_custom_popup_centered';
        modal.innerHTML = `
            <div>
                <strong>Module Settings</strong> <br>
                <strong>Timer Modules</strong>
                <div id="lwm-settings-list"></div>
                <button id="close-settings" class="lwm_custom_button">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
        renderSettingsList();
        document.getElementById('close-settings').addEventListener('click', () => modal.remove());
    }
    async function renderSettingsList() {
        const list = document.getElementById('lwm-settings-list');
        list.innerHTML = '';
        for (const [key, mod] of Object.entries(MODULES)) {
            const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
            const alertEnabled = getFlag(mod.alertKey, mod.defaultAlert);
            const div = document.createElement('div');
            div.innerHTML = `
                <label>
                    <input type="checkbox" class="lwm_custom_checkbox" data-key="${key}" data-type="enabled" ${enabled ? 'checked' : ''}>
                    Enable ${mod.name}
                </label>
                <label>
                    <input type="checkbox" class="lwm_custom_checkbox" data-key="${key}" data-type="alert" ${alertEnabled ? 'checked' : ''}>
                    Alert for ${mod.name}
                </label>
            `;
            list.appendChild(div);
        }
        list.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', async (e) => {
                const modKey = e.target.dataset.key;
                const type = e.target.dataset.type;
                const storageKey = type === 'enabled' ? MODULES[modKey].enabledKey : MODULES[modKey].alertKey;
                setFlag(storageKey, e.target.checked);
                if (type === 'enabled') renderModules(); // Refresh modules in panel
            });
        });
        renderOtherSettings();
    }
    // ========== Module UI & Logic ==========
    async function renderModules() {
        const container = document.getElementById('lwm-modules');
        container.innerHTML = '';
        for (const [key, mod] of Object.entries(MODULES)) {
            const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
            if (!enabled) continue;
            const timeLeft = await getTimeLeft(mod.timerKey);
            const div = document.createElement('div');
            div.className = 'lwm_custom_module';
            /*const availableAt = +timeLeft;
            if (isNaN(availableAt)) {
                div.innerHTML = `
                <div><strong>${mod.name}</strong></div>
                <div id="status-${key}">Time left: Unknown</div>
                `;
            } else {*/
            div.innerHTML = `
                <div><strong>${mod.name}</strong></div>
                <div id="status-${key}">Time left: ${formatTime(timeLeft)}</div>
                `;
            /*}*/
            div.addEventListener('click', () => {
                if (key === 'hunt' || key === 'mg') {
                    if (getFlag(HG_MG_THRESHOLD_FLAG, false)) {
                        void guildPointsThresholdEnabled(key, HG_MG_GOANYWAY, HG_MG_ENABLESKIP, false);
                    } else {
                        const url = mod.moduleUrl;
                        if (url) {
                            window.location.href = url;
                        }
                    }
                } else if (key === 'laborers' && (getFlag(JOB_SEARCHER_ENABLED, false))) {
                    void toggleJobSearcher();
                } else {
                    const url = mod.moduleUrl;
                    if (url) {
                        window.location.href = url;
                    }
                }
            });
            container.appendChild(div);
            startModuleCountdown(key, mod);
        }
        await renderOtherModules();
    }
    async function startModuleCountdown(key, mod) {
        const statusEl = document.getElementById(`status-${key}`);
        const timerKey = mod.timerKey;
        const alertKey = mod.alertKey;
        const notifiedKey = mod.notifiedKey;
        const interval = setInterval(async () => {
            const now = Date.now();
            const stored = getFlag(timerKey);
            // Handle special cases: if stored is not a valid number
            const availableAt = +stored;
            if (isNaN(availableAt)) {
                clearInterval(interval);
                statusEl.textContent = stored; // Directly display status string
                return;
            }
            const timeLeft = Math.max(0, availableAt - now);
            if (timeLeft <= 0) {
                clearInterval(interval);
                statusEl.textContent = 'Ready!';
                const alertEnabled = getFlag(alertKey, mod.defaultAlert);
                const alreadyNotified = getFlag(notifiedKey, false);
                if (key === 'hunt' || key === 'mg') {
                    if (getFlag(HG_MG_THRESHOLD_FLAG, false)) {
                        void guildPointsThresholdEnabled(key, HG_MG_GOANYWAY, HG_MG_ENABLESKIP, HG_MG_NOALERTS);
                    } else if (alertEnabled && !alreadyNotified) {
                        setFlag(notifiedKey, true);
                        const confirmJump = confirm(`⏰ ${mod.name} is ready! Go now?`);
                        if (confirmJump) {
                            const url = mod.moduleUrl;
                            if (url) window.location.href = url;
                        }
                    }
                } else if (alertEnabled && !alreadyNotified) {
                    setFlag(notifiedKey, true);
                    if (WINDOWS_NOTIFICATION_ENABLE) {
                        const handleModuleClick = () => {
                            window.focus(); // bring browser window to front when clicked
                            const moduleDiv = statusEl.closest('.lwm_custom_module');
                            if (moduleDiv) moduleDiv.click();
                        };
                        GM.notification({
                            title: "LWM Timers Panel",
                            text: "Your " + mod.name + " timer is ready!",
                            timeout: 10000, // in milliseconds (510 seconds)
                            onclick: handleModuleClick,
                            //image: "https://www.lordswm.com/i/icon_hunters.gif" // optional
                        });
                    } else {
                        const confirmJump = confirm(`⏰ ${mod.name} is ready! Go now?`);
                        if (confirmJump) {
                            const url = mod.moduleUrl;
                            if (url) window.location.href = url;
                        }
                    }
                }
                //alert(`🛠️ ${mod.name} status: Ready!`);
                //setFlag(notifiedKey, true);
            } else {
                statusEl.textContent = 'Time left: ' + formatTime(timeLeft);
            }
        }, 1000);
    }
    async function getTimeLeft(timerKey) {
        const target = getFlag(timerKey, 0);
        return Math.max(0, target - Date.now());
    }

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }
    async function fetchAndParse(url, parserFn) {
        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
            const html = await resp.text();
            await parserFn(html); // supports both sync and async functions
        } catch (err) {
            console.error(`[fetchAndParse] Failed to fetch ${url}:`, err);
        }
    }
    // ========== All Timer Modules ==========
    // ========== Hunt Module ==========
    async function initHuntModule() {
        const mod = MODULES.hunt;
        const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;
        const lastChecked = getFlag(mod.lastCheckedKey, 0);
        const timer = getFlag(mod.timerKey, 0);
        const now = Date.now();
        const availableAt = +timer;
        // 🟢 Handle Special Cases
        if (isNaN(availableAt)) {
            if (typeof timer === "string" && timer.toLowerCase().includes("reward")) {
                const lastPage = getFlag(PLAYERINFO.lastPage, 'home')
                if (lastPage.toLowerCase().includes("map.php") && location.pathname.includes('war.php')) {
                    //if you were last on map page where hunts and MG start, and current page is war then it will reset the timer.
                    setFlag(mod.timerKey, 0);
                } else {
                    return;
                }
            }
        }
        if (location.pathname === '/map.php') {
            parseHuntPage(document.documentElement.innerHTML);
        }
        if (availableAt > now) {
            return;
        }
        if (now - lastChecked > recheckCooldownShort) {
            if (!location.pathname.includes('war.php')) {
                //if current page is not war page only then trigger the fetch
                if (getFlag(HG_MG_THRESHOLD_FLAG, false)) {
                    await guildPointsThresholdEnabled('hunt', HG_MG_GOANYWAY, HG_MG_ENABLESKIP, HG_MG_NOALERTS);
                } else {
                    fetchAndParse('https://www.lordswm.com/map.php', parseHuntPage);
                }
            } else {
                setFlag(mod.timerKey, 'Cannot Fetch in Battle');
            }
        }
    }

    function parseHuntPage(text) {
        const mod = MODULES.hunt;
        setFlag(mod.lastCheckedKey, Date.now());
        const matches = [...text.matchAll(/MapHunterDelta\s*=\s*(\d+);/g)];
        if (matches.length < 2) return false; // parsing failed;
        const seconds = parseInt(matches[1][1], 10);
        const futureTime = Date.now() + seconds * 1000 + 5000; // 5 seconds buffer
        setFlag(mod.timerKey, futureTime);
        setFlag(mod.notifiedKey, false);
        return true; // parsing success
    }
    // ========== Mercenary Guild Module ==========
    async function initMGModule() {
        const mod = MODULES.mg;
        const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;
        const lastChecked = getFlag(mod.lastCheckedKey, 0);
        const timer = getFlag(mod.timerKey, 0);
        const now = Date.now();
        const availableAt = +timer;
        // 🟢 Handle Special Cases
        if (isNaN(availableAt)) {
            if (typeof timer === "string" && timer.toLowerCase().includes("reward")) {
                const lastPage = getFlag(PLAYERINFO.lastPage, 'home')
                if (lastPage.toLowerCase().includes("map.php") && location.pathname.includes('war.php')) {
                    //if you were last on map page where hunts and MG start, and current page is war then it will reset the timer.
                    setFlag(mod.timerKey, 0);
                } else {
                    return;
                }
            }
        }
        if (location.pathname === '/mercenary_guild.php') {
            parseMGPage(document.documentElement.textContent);
        }
        if (availableAt > now) {
            return;
        }
        if (now - lastChecked > recheckCooldownShort) {
            if (!location.pathname.includes('war.php')) {
                //if current page is not war page only then trigger the fetch
                if (getFlag(HG_MG_THRESHOLD_FLAG, false)) {
                    await guildPointsThresholdEnabled('mg', HG_MG_GOANYWAY, HG_MG_ENABLESKIP, HG_MG_NOALERTS);
                } else {
                    fetchAndParse('https://www.lordswm.com/mercenary_guild.php', parseMGPage);
                }
            } else {
                setFlag(mod.timerKey, 'Cannot Fetch in Battle');
            }
        }
    }

    function parseMGPage(text) {
        const mod = MODULES.mg;
        setFlag(mod.lastCheckedKey, Date.now());
        const matchDiffLoc = text.match(/You are in a different location\./i);
        if (matchDiffLoc) setFlag(mod.timerKey, "Different Location.");
        const match = text.match(/Come back in (\d{1,2}) min/i);
        if (!match) return false; // parsing failed;
        const minutes = parseInt(match[1], 10);
        const totalMs = (minutes + 1) * 60 * 1000; // +1 min to account for rounding
        const readyAt = Date.now() + totalMs;
        setFlag(mod.timerKey, readyAt);
        setFlag(mod.notifiedKey, false);
        return true; // parsing success
    }
    // ========== HG and MG point threshold check ==========
    const HG_MG_THRESHOLD_FLAG = 'hg_mg_threshold_enabled';
    const HG_THRESHOLD_KEY = 'hg_threshold_saved';
    const MG_THRESHOLD_KEY = 'mg_threshold_saved';
    const HG_MG_GOANYWAY = false;
    const HG_MG_ENABLESKIP = true;
    const HG_MG_NOALERTS = true;

    function injectHGMGThresholdSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(HG_MG_THRESHOLD_FLAG, false);
        const savedHG = getFlag(HG_THRESHOLD_KEY, '');
        const savedMG = getFlag(MG_THRESHOLD_KEY, '');
        const div = document.createElement('div');
        div.id = 'hg_mg_threshold_settings_wrapper';
        div.innerHTML = `
        <strong>Hunt/Merc Auto Skip</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="hg_mg_threshold_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable at
        </label>
        <label>HG:
            <input type="number" class="lwm_custom_checkbox" id="hg_threshold_input"
                   placeholder="2" value="${savedHG}" style="width: 30px" maxlength="1" size="1" pattern="\\d{1,5}" />
        </label>
        <label>MG:
            <input type="number" class="lwm_custom_checkbox" id="mg_threshold_input"
                   placeholder="2" value="${savedMG}" style="width: 30px" maxlength="1" size="1" pattern="\\d{1,5}" />
        </label>
    `;
        container.appendChild(div);
        // Checkbox toggle
        div.querySelector('#hg_mg_threshold_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(HG_MG_THRESHOLD_FLAG, enabled);
            setTimeout(() => location.reload(), STANDARD_DELAY);
        });
        // Input for HG threshold
        div.querySelector('#hg_threshold_input').addEventListener('change', (e) => {
            const val = e.target.value.trim();
            const num = parseInt(val, 10);
            if (num >= 1 && num <= 5) {
                setFlag(HG_THRESHOLD_KEY, num);
            } else {
                alert("Invalid HG threshold. Enter a number from 1 to 5.");
                e.target.value = '';
            }
        });
        // Input for MG threshold
        div.querySelector('#mg_threshold_input').addEventListener('change', (e) => {
            const val = e.target.value.trim();
            const num = parseInt(val, 10);
            if (num >= 1 && num <= 5) {
                setFlag(MG_THRESHOLD_KEY, num);
            } else {
                alert("Invalid MG threshold. Enter a number from 1 to 5.");
                e.target.value = '';
            }
        });
    }
    async function guildPointsThresholdEnabled(key, goAnyway = false, skipEnabled = true, noAlerts = false) {
        if (!getFlag(HG_MG_THRESHOLD_FLAG, false)) return;
        let result, module, confirmJump;
        let skipped = false;
        let html;
        const mod = MODULES[key];
        if (key === 'mg') module = 'MG';
        if (key === 'hunt') module = 'HG';
        const url = 'https://www.lordswm.com' + mod.moduleUrl;
        if (module) {
            try {
                const resp = await fetch(url);
                if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
                html = await resp.text();
                result = parseGuildPointsReward(html, module);
            } catch (err) {
                console.error(`[fetch] Failed to fetch data`, err);
                setFlag(mod.timerKey, "Unable to Fetch"); // ✅ prevent re-triggering
                return;
            }
        }
        if (result) {
            console.log(module + ` Reward: +${result.points} points`);
            if (result.meetsThreshold) {
                if (!noAlerts) {
                    confirmJump = confirm(`🔥 This ${module} rewards +${result.points} points! Worth doing. Go there?`);
                }
                setFlag(mod.timerKey, `Reward: +${result.points} points`);
            } else {
                if (skipEnabled) {
                    let skipurl = '';
                    if (module === 'HG') {
                        skipurl = 'https://www.lordswm.com/map.php?action=skip';
                    } else if (module === 'MG') {
                        const signval = getFlag(PLAYERINFO.signValue, '');
                        skipurl = 'https://www.lordswm.com/mercenary_guild.php?action=skip&sign=' + signval;
                    }
                    if (skipurl) {
                        console.log(`⚡ Skipping ${module} quest via: ${skipurl}`);
                        await fetch(skipurl);
                        skipped = true;
                        setFlag(mod.timerKey, `Skipped: +${result.points} points`);
                        console.log(`🔁 Quest skipped. Refreshing page in 2 minutes...`);
                        if (!location.pathname.includes('war.php')) {
                            //if current page is not war page only then trigger the auto refresh i.e. if war page then no auto refresh
                            console.log(`Auto refresh queued.`);
                            setTimeout(() => {
                                location.reload()
                                //initSchedulesPanel();
                            }, recheckCooldownShort + 10000);
                        }
                    }
                } else {
                    if (!noAlerts) {
                        confirmJump = confirm(`😐 Only +${result.points} points. You may want to skip this ${module}. Go there?`);
                    }
                }
            }
        } else {
            let parsedSuccessfully = false;
            // Try parsing the reward/timer normally
            if (module === 'HG') parsedSuccessfully = parseHuntPage(html);
            if (module === 'MG') parsedSuccessfully = parseMGPage(html);
            console.log(`❌ No ${module} reward info found.`);
            if (!parsedSuccessfully) {
                setFlag(mod.timerKey, "Status Unknown"); // only set if parsing failed
            } //prevents a retry loop
            if (!goAnyway && !noAlerts) {
                confirmJump = confirm(`😐 Could not find points for ${module}. Go there anyway?`);
            }
        }
        if (!skipped && (confirmJump || goAnyway)) {
            window.location.href = url;
        }
        renderModules();
    }

    function parseGuildPointsReward(html, type) {
        const regex = new RegExp(`<b>\\+(\\d+)\\s*${type}\\s*points<\\/b>`, 'gi');
        let match;
        let maxPoints = 0;
        while ((match = regex.exec(html)) !== null) {
            const points = parseInt(match[1], 10);
            if (points > maxPoints) maxPoints = points;
        }
        if (maxPoints > 0) {
            const hgThreshold = getFlag(HG_THRESHOLD_KEY, 2);
            const mgThreshold = getFlag(MG_THRESHOLD_KEY, 2);
            const threshold = type === 'HG' ? hgThreshold : mgThreshold;
            return {
                points: maxPoints,
                meetsThreshold: maxPoints >= threshold
            };
        } else {
            // ✅ Fallback: detect gold reward structure like "Award: <b>100</b> gold" or army info for hunts
            const fallbackGoldRegex = type === 'HG' ? /army_info\.php/ : /Award:\s*<b>\d+<\/b>\s*gold/i;
            if (fallbackGoldRegex.test(html)) {
                return {
                    points: 1, // inferred reward
                    meetsThreshold: false
                };
            } else {
                return null;
            }
        } // no quest reward found at all
    }
    // ========== Enchanters Guild Module ==========
    async function initEnchantModule() {
        const mod = MODULES.enchant;
        const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;
        const lastChecked = getFlag(mod.lastCheckedKey, 0);
        const timer = getFlag(mod.timerKey, 0);
        const now = Date.now();
        // Don't re-fetch if timer is still active
        if (timer > now) return;
        if (location.pathname === '/mod_workbench.php') {
            parseEnchantPage(document.documentElement.textContent);
        } else if (now - lastChecked > recheckCooldownLong) { // fetch cooldown
            if (!location.pathname.includes('war.php')) {
                fetchAndParse('https://www.lordswm.com/mod_workbench.php', parseEnchantPage);
            }
        }
    }

    function parseEnchantPage(text) {
        const mod = MODULES.enchant;
        setFlag(mod.lastCheckedKey, Date.now());
        const match = text.match(/Complete in: (\d{1,2} h\.)?\s*(\d{1,2} min)?/i);
        if (!match) return;
        let totalMs = 0;
        if (match[1]) {
            const hours = parseInt(match[1].match(/\d+/)[0], 10);
            totalMs += hours * 60 * 60 * 1000;
        }
        if (match[2]) {
            const minutes = parseInt(match[2].match(/\d+/)[0], 10);
            totalMs += (minutes + 1) * 60 * 1000; // +1 to be safe
        }
        if (totalMs > 0) {
            const readyAt = Date.now() + totalMs;
            setFlag(mod.timerKey, readyAt);
            setFlag(mod.notifiedKey, false); // reset notification
        }
    }
    // ========== Smiths Guild Module ==========
    async function initSmithModule() {
        const mod = MODULES.smith;
        const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;
        const lastChecked = getFlag(mod.lastCheckedKey, 0);
        const timer = getFlag(mod.timerKey, 0);
        const now = Date.now();
        if (timer > now) return;
        if (location.pathname === '/mod_workbench.php') {
            parseSmithPage(document.documentElement.textContent);
        } else if (now - lastChecked > recheckCooldownLong) {
            if (!location.pathname.includes('war.php')) {
                fetchAndParse('https://www.lordswm.com/mod_workbench.php', parseSmithPage);
            }
        }
    }

    function parseSmithPage(text) {
        const mod = MODULES.smith;
        setFlag(mod.lastCheckedKey, Date.now());
        const match = text.match(/Under repair another (\d{1,2} h\.\s*)?(\d{1,2} min)/i);
        if (!match) return;
        let totalMs = 0;
        if (match[1]) {
            const hours = parseInt(match[1].match(/\d+/)[0], 10);
            totalMs += hours * 60 * 60 * 1000;
        }
        if (match[2]) {
            const minutes = parseInt(match[2].match(/\d+/)[0], 10);
            totalMs += (minutes + 1) * 60 * 1000; // +1 to be safe
        }
        if (totalMs > 0) {
            const readyAt = Date.now() + totalMs;
            setFlag(mod.timerKey, readyAt);
            setFlag(mod.notifiedKey, false);
        }
    }
    // ========== Laborers Guild Module ==========
    async function initLaborersModule() {
        const mod = MODULES.laborers;
        const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;
        const lastChecked = getFlag(mod.lastCheckedKey, 0);
        const timer = getFlag(mod.timerKey, 0);
        const now = Date.now();
        if (typeof timer === 'number' && timer > now) return;
        if (location.pathname.startsWith('/object-info.php')) {
            parseLaborersFromObjectInfo();
        } else if (location.pathname === '/home.php') {
            parseLaborersFromHome();
        } else if (now - lastChecked > recheckCooldownShort) {
            if (!location.pathname.includes('war.php')) {
                fetchAndParse('https://www.lordswm.com/home.php', parseLaborersFromHome);
            }
        }
    }

    function parseLaborersFromHome(html) {
        const mod = MODULES.laborers;
        setFlag(mod.lastCheckedKey, Date.now());
        let text;
        if (window.location.pathname === '/home.php') {
            const header = document.querySelector('#set_mobile_max_width');
            if (!header) return;
            text = header.innerText;
        } else {
            text = html;
        }
        if (text.includes('You are currently unemployed')) {
            setFlag(mod.timerKey, 'Unemployed.');
            setFlag(mod.lastCheckedKey, Date.now());
            setFlag(mod.notifiedKey, false);
            return;
        }
        // Case: cooldown - enroll again in X min
        const cooldownMatch = text.match(/You may enroll again in (\d{1,2}) min/i);
        if (cooldownMatch) {
            const minutes = parseInt(cooldownMatch[1], 10);
            const endTime = Date.now() + (minutes + 1) * 60 * 1000;
            setFlag(mod.timerKey, endTime);
            setFlag(mod.notifiedKey, false);
            return;
        }
        // Case: currently employed since HH:MM
        const match = text.match(/since\s+(\d{1,2}):(\d{2})/);
        if (match) {
            const [_, h, m] = match.map(Number);
            const now = new Date();
            const utc3Date = new Date(Date.UTC(
                now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h - 3, // from UTC+3 to UTC
                m
            ));
            const endTime = utc3Date.getTime() + 60 * 60 * 1000 + 60 * 1000;
            setFlag(mod.timerKey, endTime);
            setFlag(mod.notifiedKey, false);
        }
    }

    function parseLaborersFromObjectInfo() {
        const mod = MODULES.laborers;
        setFlag(mod.lastCheckedKey, Date.now());
        const match = document.body.textContent.match(/(enrolled|устроены)/i);
        if (!match) return;
        const endTime = Date.now() + 60 * 60 * 1000;
        setFlag(mod.timerKey, endTime);
        setFlag(mod.notifiedKey, false);
    }
    // ========== Thieves Guild Module ==========
    async function initThievesModule() {
        const mod = MODULES.thieves;
        const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;
        const timer = getFlag(mod.timerKey, 0);
        const now = Date.now();
        if (location.pathname === '/war.php') {
            //   await checkThievesBattle(); // This will handle setting the timer if needed via battle
        }
        if (location.pathname === '/pl_warlog.php') {
            parseThievesLogPage(document.documentElement.innerHTML); //document.documentElement.innerHTML  .textContent
        }
        if (timer > now) return;
        const userId = getCookie("pl_id");
        if (!userId) return console.warn("User ID not found.");
        const lastChecked = getFlag(mod.lastCheckedKey, 0);
        if (now - lastChecked < recheckCooldownMedium) return;
        setFlag(mod.lastCheckedKey, now);
        fetchAndParse(`https://www.lordswm.com/pl_warlog.php?id=${userId}`, parseThievesLogPage);
    }

    function parseThievesLogPage(html) {
        const mod = MODULES.thieves;
        const isPremium = getFlag('mod_premium_status', false); // already saved in initThievesModule
        const lines = html.split('<BR>').filter(Boolean);
        const now = Date.now();
        for (const line of lines) {
            if (!line.includes('Caravan')) continue;
            if (!/<b>Caravan/.test(line)) continue; // bold = you lost
            const timeMatch = line.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
            if (!timeMatch) continue;
            const [_, y, m, d, h, min] = timeMatch.map(Number);
            const utcPlus3 = new Date(Date.UTC(y, m - 1, d, h - 3, min)); // convert UTC+3 to UTC
            const timestamp = utcPlus3.getTime();
            if (now - timestamp > 60 * 60 * 1000) continue; // older than 1 hour
            const cooldown = (isPremium ? 42 : 60) * 60 * 1000;
            const readyAt = timestamp + cooldown;
            getFlag(mod.timerKey, 0).then(existingTime => {
                if (readyAt > existingTime) {
                    setFlag(mod.timerKey, readyAt);
                    setFlag(mod.notifiedKey, false);
                }
            });
            break; // only care about first match
        }
    }
    async function checkThievesBattle() {
        const match = unsafeWindow.run_all?.toString();
        if (!match) return;
        const mod = MODULES.thieves;
        const btype = match.match(/btype\|(\d+)/)?.[1];
        const plid = match.match(/plid1\|(\d+)/)?.[1];
        const warid = new URLSearchParams(window.location.search).get("warid");
        const userId = getCookie("pl_id");
        if (btype === "66" && plid === userId && warid) {
            const lastWarId = getFlag(mod.lastWarIdKey, 0);
            if (Number(warid) > Number(lastWarId)) {
                const isPremium = getFlag(PLAYERINFO.premiumKey, false);
                const cooldown = (isPremium ? 42 : 60) * 60 * 1000;
                const expireAt = Date.now() + cooldown;
                setFlag(mod.timerKey, expireAt);
                setFlag(mod.lastCheckedKey, Date.now());
                setFlag(mod.lastWarIdKey, warid);
                setFlag(mod.notifiedKey, false);
            }
        }
    }
    // ========== Leaders Guild Module ==========
    //if last page was leaders guild can even do full auto battle with setup.
    async function initLeadersModule() {
        const mod = MODULES.leaders;
        const enabled = getFlag(mod.enabledKey, mod.defaultEnabled);
        if (!enabled) return;
        const lastChecked = getFlag(mod.lastCheckedKey, 0);
        const timer = getFlag(mod.timerKey, 0);
        const now = Date.now();
        const availableAt = +timer;
        // 🟢 Handle Special Cases
        if (isNaN(availableAt)) {
            if (typeof timer === "string" && timer.toLowerCase().includes("max")) {
                const lastPage = getFlag(PLAYERINFO.lastPage, 'home')
                if (lastPage.toLowerCase().includes("leader_guild.php") && location.pathname.includes('war.php')) {
                    //if you were last on map page where leg start, and current page is war then it will reset the timer.
                    setFlag(mod.timerKey, 0);
                } else {
                    return;
                }
            }
        }
        if (availableAt > now) return;
        // (timer && timer > now && timer !== 'Max available') only recheck if timer expired
        if (location.pathname === '/leader_guild.php') {
            parseLeadersPage(document.documentElement.textContent);
        } else if (now - lastChecked > recheckCooldownLong) {
            if (!location.pathname.includes('war.php')) {
                fetchAndParse('https://www.lordswm.com/leader_guild.php', parseLeadersPage);
            }
        }
    }

    function parseLeadersPage(text) {
        const mod = MODULES.leaders;
        setFlag(mod.lastCheckedKey, Date.now());
        // Check challenges available: "Challenges available: 2 of 3 max"
        const match = text.match(/Challenges available:\s*(\d+)\s*of\s*(\d+)\s*max/i);
        if (!match) return; // no challenges info found
        const available = parseInt(match[1], 10);
        const max = parseInt(match[2], 10);
        // If available == max → capped → set 'Max available'
        if (available === max) {
            setFlag(mod.timerKey, 'Max available');
            setFlag(mod.notifiedKey, false);
            return;
        }
        // Otherwise, find Delta2
        const deltaMatch = text.match(/var\s+Delta2\s*=\s*(\d+);/);
        if (deltaMatch) {
            const seconds = parseInt(deltaMatch[1], 10);
            if (seconds > 0) {
                const futureTime = Date.now() + seconds * 1000 + 5000; // 5 sec buffer
                setFlag(mod.timerKey, futureTime);
                setFlag(mod.notifiedKey, false);
            }
        }
    }
    // ========== Relevant Player Info ==========
    function detectPremium() {
        // Always reset first
        setFlag(PLAYERINFO.premiumKey, false);
        const isPremium = !!document.body.innerHTML.match(/star\.png/);
        setFlag(PLAYERINFO.premiumKey, isPremium);
    }

    function detectSignValue() {

            setValue(PLAYERINFO.signValue, null);

    // Try to detect via global function definition
    const fn = unsafeWindow.home_css_change_stat || window.home_css_change_stat;
    if (typeof fn === 'function') {
        const src = fn.toString();
        // Example match: sign=82aa055b32582436ff448b527ad433bf
        const match = src.match(/sign=([a-f0-9]{32})/i);
        if (match) {
            const sign = match[1];
            setValue(PLAYERINFO.signValue, sign);
            console.log('🔐 Detected sign value from function:', sign);
            return sign;
        }
    }

    // --- Optional fallback ---
    // Sometimes the function may be minified or not yet loaded.
    // We can scan all inline scripts on the page for "sign="
    const scripts = document.querySelectorAll('script');
    for (const s of scripts) {
        const text = s.textContent;
        const match = text.match(/sign=([a-f0-9]{32})/i);
        if (match) {
            const sign = match[1];
            setValue(PLAYERINFO.signValue, sign);
            console.log('🔐 Detected sign value from inline script:', sign);
            return sign;
        }
    }
    const logoutLink = document.querySelector('a[href*="logout.php"][href*="sign="]');
        if (logoutLink) {
            const url = new URL(logoutLink.href, location.origin);
            const sign = url.searchParams.get('sign');
            if (sign) {
                setValue(PLAYERINFO.signValue, sign);
                return sign;
                //console.log('🔐 Detected sign value:', sign);
            } else {
                //console.warn('⚠️ Sign param missing in logout link');
            }
        } else {
            //console.warn('⚠️ Logout link with sign not found');
        }

    console.warn('⚠️ Sign value not found anywhere.');
    return null;

        // Reset stored value
       /* setFlag(PLAYERINFO.signValue, null);
        const logoutLink = document.querySelector('a[href*="logout.php"][href*="sign="]');
        if (logoutLink) {
            const url = new URL(logoutLink.href, location.origin);
            const signval = url.searchParams.get('sign');
            if (signval) {
                setFlag(PLAYERINFO.signValue, signval);
                //console.log('🔐 Detected sign value:', sign);
            } else {
                //console.warn('⚠️ Sign param missing in logout link');
            }
        } else {
			const signval = "82aa055b32582436ff448b527ad433bf";
			setFlag(PLAYERINFO.signValue, signval);
			console.warn('⚠️ Logout link with sign not found, attempt just sign');
            //console.warn('⚠️ Logout link with sign not found');
        }*/
    }

    function playerSaveCurrentPage() {
        setFlag(PLAYERINFO.lastPage, window.location.pathname + window.location.search);
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    // ========== Battle Ready Set Checker ==========
    const STANDARD_DELAY = 2000;
    let ring_slot_avoid = 8;
    const BRCFLAGS = {
        enabled: 'brc_enabled',
        setSaved: 'brc_set_saved',
        isReady: 'brc_ready',
        artNames: 'brc_art_names',
        setLock: 'brc_set_locked',
        setName: 'brc_set_name'
    };
    let myArts = [];
    let statusEl, setNameEl, nameDisplayEl;
    async function setCheckerPanel() {
        //if (window.location.pathname === '/war.php') return;
        if (!getFlag(BRCFLAGS.enabled, false)) return;
        const container = document.querySelector('#lwm-modules');
        if (!container) return console.warn("Scheduler module container not found!");
        const div = document.createElement('div');
        div.className = 'lwm-module';
        div.id = 'brc_scheduler_module';
        div.innerHTML = `
            <div><span><strong>Set Checker:</strong> <span id="brc_set_name_display">-</span></span><br>
                 <span><strong>Status:</strong> <span id="brc_status">Loading...</span></span>
            </div>
        `;
        container.appendChild(div);
        // Reference handles
        statusEl = div.querySelector('#brc_status');
        nameDisplayEl = div.querySelector('#brc_set_name_display');
        updatePanelStatus();
        // Click-to-reset functionality
        statusEl.style.cursor = 'pointer';
        statusEl.title = 'Click to reset and recheck';
        statusEl.addEventListener('click', () => {
            const saved = getFlag(BRCFLAGS.setSaved, 0);
            const ready = getFlag(BRCFLAGS.isReady, 0);
            if (saved && ready) {
                setFlag(BRCFLAGS.isReady, 0);
                updatePanelStatus();
                statusEl.textContent = 'Recheck Triggered 🔄';
                setTimeout(updatePanelStatus, STANDARD_DELAY);
                initSetChecker();
                //setTimeout(() => location.reload(), STANDARD_DELAY);
            }
        });
    }

    function updatePanelStatus() {
        const saved = getFlag(BRCFLAGS.setSaved, 0);
        const ready = getFlag(BRCFLAGS.isReady, 0);
        const setName = getFlag(BRCFLAGS.setName, '');
        if (statusEl) {
            statusEl.textContent = saved ?
                (ready ? 'Ready ✅' : 'Not Ready ❌') :
                'Set Not Saved ⚠️';
        }
        if (nameDisplayEl) {
            nameDisplayEl.textContent = setName || '-';
        }
    }

    function getEquippedArtNames() {
        const equippedIds = [];
        document.querySelectorAll('[onClick^="javascript: try_undress("]').forEach(el => {
            const match = el.getAttribute('onClick').match(/try_undress\((\d+)\)/);
            if (match) equippedIds.push(Number(match[1]));
        });
        const equippedNames = equippedIds.map(id => {
            const artPage = Object.values(arts).find(a => a.id === id);
            if (!artPage) {
                console.warn(`[Set Checker] No art object found for equipped ID ${id}`);
                return '[UNKNOWN]';
            }
            return artPage.name + (artPage.suffix || '');
        });
        return equippedNames;
    }

    function isMatchingSet(equippedNames, savedNames) {
        if (equippedNames.length !== savedNames.length) return false;
        // Count occurrences in equipped
        const equippedCount = {};
        for (const name of equippedNames) {
            equippedCount[name] = (equippedCount[name] || 0) + 1;
        }
        // Count occurrences in saved
        const savedCount = {};
        for (const name of savedNames) {
            savedCount[name] = (savedCount[name] || 0) + 1;
        }
        // Compare counts
        for (const name in savedCount) {
            if (savedCount[name] !== equippedCount[name]) return false;
        }
        return true;
    }

    function equipMissingItems(savedNames, myArts, ring_slot_avoid) {
        const equippedIds = Object.values(myArts)
            .filter(art => art.dressed)
            .map(art => art.id);
        const equippedNames = equippedIds
            .map(id => {
                const art = Object.values(myArts).find(art => art.id === id);
                return art ? art.name + (art.suffix || '') : null;
            })
            .filter(Boolean);
        const savedCount = {};
        const equippedCount = {};
        savedNames.forEach(name => savedCount[name] = (savedCount[name] || 0) + 1);
        equippedNames.forEach(name => equippedCount[name] = (equippedCount[name] || 0) + 1);
        const missing = [];
        for (const name in savedCount) {
            const diff = savedCount[name] - (equippedCount[name] || 0);
            for (let i = 0; i < diff; i++) missing.push(name);
        }
        const alreadyUsedIds = new Set(equippedIds);
        const tasks = [];
        for (const name of missing) {
            const candidates = Object.values(myArts).filter(art =>
                (art.name + (art.suffix || '')) === name &&
                Number(art.durability1) > 0 &&
                !alreadyUsedIds.has(art.id)
            );
            if (candidates.length === 0) {
                alert(`[Set Checker] No spare art found for "${name}". Disabling.`);
                setFlag(BRCFLAGS.enabled, false);
                return Promise.reject(`Missing artifact "${name}"`);
            }
            const artToUse = candidates[0];
            alreadyUsedIds.add(artToUse.id);
            tasks.push(() => callTryDressByIdWithPromise(artToUse.id, ring_slot_avoid));
        }
        if (tasks.length === 0) return Promise.resolve();
        return tasks.reduce((promise, taskFn) => {
            return promise.then(() => taskFn()).then(() => STANDARD_DELAY);
        }, Promise.resolve());
    }

    function callTryDressByIdWithPromise(id, ring_slot_avoid = 8) {
        return new Promise((resolve, reject) => {
            const url = `inventory.php?dress=${id}&js=1&last_ring_dress=${ring_slot_avoid}&rand=${Math.random() * 1000000}`;
            console.log(`[BRC] Trying to equip ID ${id} with slot avoid = ${ring_slot_avoid}`);
            if (ring_slot_avoid === 8) {
                ring_slot_avoid = 9;
            } else if (ring_slot_avoid === 9) {
                ring_slot_avoid = 8;
            }
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    console.log(`[BRC] Successfully equipped ${id}`);
                    resolve();
                } else {
                    reject(`[BRC] Failed to equip ${id} - status ${xhr.status}`);
                }
            };
            xhr.onerror = () => reject(`[BRC] Network error equipping ${id}`);
            xhr.send();
        });
    }
    async function getInventoryDataFromBackend() {
        try {
            const response = await fetch('/inventory.php', {
                credentials: 'same-origin'
            });
            const htmlText = await response.text();
            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            // Extract arts array from embedded JS
            const myArtsScript = [...doc.querySelectorAll('script')]
                .map(s => s.textContent)
                .find(text => text.includes('arts=new Array();'));
            //console.log("[Raw JS Arts Block]", myArtsScript.slice(-1000));
            let myArtsI = [];
            let artsMap = {};
            if (myArtsScript) {
                const propRegex = /arts\[(\d+)]\[['"]?(\w+)['"]?]\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|(\d+)|null|true|false);/g;
                let match;
                while ((match = propRegex.exec(myArtsScript)) !== null) {
                    const artId = parseInt(match[1]);
                    const key = match[2];
                    let value = match[3] ?? match[4] ?? match[5]; // string or number
                    // Try to parse values into appropriate types
                    if (value === undefined) {
                        const raw = match[0];
                        if (raw.includes('= null;')) value = null;
                        else if (raw.includes('= true;')) value = true;
                        else if (raw.includes('= false;')) value = false;
                        else value = "";
                    } else if (!isNaN(value)) {
                        value = Number(value);
                    }
                    if (!artsMap[artId]) {
                        artsMap[artId] = {
                            id: artId
                        }; // include art ID
                    }
                    artsMap[artId][key] = value;
                }
                myArtsI = Object.values(artsMap);
            }
            //console.log("[Parsed Arts Sample]", myArtsI.slice(0, 3));
            return myArtsI;
        } catch (err) {
            console.error("[Inventory Fetch Error]", err);
            return null;
        }
    }

    function getRingSlotAvoid(myArts) {
        const ringSlots = new Set();
        for (const art of Object.values(myArts)) {
            if (art.slot === 8 && art.dressed !== 0) {
                ringSlots.add(art.dressed);
            }
        }
        // If slot 8 is used, avoid 8 → use 9
        if (ringSlots.has(8) && !ringSlots.has(9)) return 8;
        if (ringSlots.has(9) && !ringSlots.has(8)) return 9;
        // If both are empty or both used, default to 8
        return 8;
    }
    async function undressAllItems() {
        try {
            const rand = Math.random() * 1000000;
            const url = `https://www.lordswm.com/inventory.php?all_off=100&js=1&rand=${rand}`;
            const response = await fetch(url, {
                credentials: 'same-origin'
            });
            const result = await response.text(); // this is usually an empty or small response
            console.log("[Undress All] Request sent successfully", result);
            return true;
        } catch (err) {
            console.error("[Undress All] Error sending undress request", err);
            return false;
        }
    }
    // ========== Battle Ready Set Checker init ==========
    function injectSetCheckerSettings() {
        const container = document.getElementById('lwm-settings-list');
        // Avoid duplicate injection
        //if (document.getElementById('brc_settings_wrapper')) return;
        const setCheckerEnabled = getFlag(BRCFLAGS.enabled, false);
        const setCheckerLocked = getFlag(BRCFLAGS.setLock, false);
        const div = document.createElement('div');
        div.id = 'brc_settings_wrapper';
        div.innerHTML = `
        <hr>
        <strong>Set Checker</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="brc_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Set Checker
        </label>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="brc_lock_checkbox" ${setCheckerLocked ? 'checked' : ''}>
            Set Locked
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#brc_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(BRCFLAGS.enabled, enabled);
            if (!getFlag(BRCFLAGS.setLock, false)) {
                setFlag(BRCFLAGS.setSaved, 0);
                updatePanelStatus();
            }
            initSetChecker();
            renderModules();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
        div.querySelector('#brc_lock_checkbox').addEventListener('change', (e) => {
            const locked = e.target.checked;
            setFlag(BRCFLAGS.setLock, locked);
        });
    }
    async function initSetChecker() {
        /*document.addEventListener('click', (e) => {
            if (e.target.id === 'lwm-settings') {
                // Delay to let the popup render
                setTimeout(injectSetCheckerSettings, 50);
            }
        });*/
        if (window.location.pathname === '/war.php') {
            setFlag(BRCFLAGS.isReady, 0);
            updatePanelStatus();
        } else if (window.location.pathname === '/inventory.php') {
            //createFloatingPanel();
            if (!getFlag(BRCFLAGS.enabled, false)) {
                return;
            }
            const saved = getFlag(BRCFLAGS.setSaved, 0);
            if (!saved) {
                const DefaultSetName = "Standard";
                const confirmSaveSet = prompt('[Set Checker] Save current set using name - ', DefaultSetName);
                if (confirmSaveSet === null) // User cancelled
                {
                    console.warn('[Set Checker] User declined to save current set.');
                    return;
                }
                const names = getEquippedArtNames();
                setFlag(BRCFLAGS.artNames, names);
                setFlag(BRCFLAGS.setSaved, 1);
                updatePanelStatus();
                setFlag(BRCFLAGS.setName, confirmSaveSet);
                updatePanelStatus();
                alert('[Set Checker] Set saved successfully.');
                return;
            }
            const savedNames = getFlag(BRCFLAGS.artNames, []);
            const equippedNames = getEquippedArtNames();
            console.log("Saved set");
            console.log(savedNames);
            console.log("Equipped set");
            console.log(equippedNames);
        } else {
            //createFloatingPanel();
            if (!getFlag(BRCFLAGS.enabled, false)) return;
            if (!getFlag(BRCFLAGS.setSaved, 0)) {
                alert('[Set Checker] No saved set found. Please visit inventory.php and save a set.');
                return;
            }
            if (getFlag(BRCFLAGS.isReady, true)) return;
            myArts = await getInventoryDataFromBackend();
            if (!myArts) return;
            ring_slot_avoid = getRingSlotAvoid(myArts);
            const equippedNames = Object.values(myArts)
                .filter(art => art.dressed)
                .map(art => art.name + (art.suffix || ''));
            const savedNames = getFlag(BRCFLAGS.artNames, []);
            if (isMatchingSet(equippedNames, savedNames)) {
                setFlag(BRCFLAGS.isReady, 1);
                updatePanelStatus();
                console.log("[Set Checker] Success — Correct artifacts are already equipped.");
                return;
            }
            console.warn('[Set Checker] Mismatch — equipping missing items...');
            try {
                await equipMissingItems(savedNames, myArts, ring_slot_avoid);
                const refreshedmyArts = await getInventoryDataFromBackend();
                const finalEquippedNames = Object.values(refreshedmyArts)
                    .filter(art => art.dressed)
                    .map(art => art.name + (art.suffix || ''));
                setFlag(BRCFLAGS.isReady, isMatchingSet(finalEquippedNames, savedNames) ? 1 : 0);
                updatePanelStatus();
                if (!isMatchingSet(finalEquippedNames, savedNames)) {
                    await undressAllItems();
                    setTimeout(() => {
                        location.reload();
                    }, STANDARD_DELAY);
                }
            } catch (err) {
                console.error('[Set Checker] Error during equipping:', err);
                setFlag(BRCFLAGS.isReady, 0);
                updatePanelStatus();
            }
        }
    }
    // ========== Dark Mode Experimental ==========
    const DARK_MODE_FLAG = 'dark_mode_enabled';

    function enableDarkMode() {
        if (!getFlag(DARK_MODE_FLAG, false)) return;
        // 🎨 Color constants
        const mainTextColor = `#d0d0d0`;
        const mainBGColor = `#2e2e2e`;
        const panelColor = `#1e1e1e`;
        const containerColor = `#262626`;
        const headerColor = `#1b1b1b`;
        const buttonText = `#e0c090`;
        const linkColor = `#b0b0b0`;
        const style = document.createElement('style');
        style.id = 'lwm_dark_theme';
        style.textContent = `
        html, body {
            background-color: ${mainBGColor} !important;
            color: ${mainTextColor} !important;
        }

        table, td, th {
            background-color: ${panelColor} !important;
            color: ${mainTextColor} !important;
            background-image: none !important;
        }

        input, select, textarea, button {
            background-color: ${panelColor} !important;
            color: ${mainTextColor} !important;
            border: 1px solid #666 !important;
        }

        a {
            color: ${linkColor} !important;
        }

        a:hover {
            color: #ddd !important;
        }

        .home_container_block,
        .home_pers_block,
        .home_left_landscape_mobile,
        .map_container_block,
        .global_container_block,
        .global_container_block_header,
        .global_table_div,
        .global_table_div_no_lines,
        .global_table_bg_color,
        .global_notice {
            background-color: ${containerColor} !important;
            color: ${mainTextColor} !important;
            background-image: none !important;
        }

        .global_container_block_header {
            font-weight: bold;
            background-color: ${headerColor} !important;
            border-bottom: 1px solid #555;
        }

        .home_button3,
        .home_button_text_left3 {
            color: ${buttonText} !important;
            background-color: transparent !important;
        }

        button, .button, input[type="submit"], input[type="button"] {
            background-color: #555 !important;
            color: ${mainTextColor} !important;
            border: 1px solid #999 !important;
            padding: 3px 8px;
            border-radius: 4px;
        }

        .wbwhite, .wbwhite2, .wbwhite3 {
            background-color: ${panelColor} !important;
            color: ${mainTextColor} !important;
        }

        .sh_dd_container, .sh_dd_container div {
            background-color: #3b2f23 !important;
            color: #fad49f !important;
            border-color: #e2b77d !important;
        }

        iframe, .banner_top, .adv, .adv_right {
            display: none !important;
        }

        ::-webkit-scrollbar {
            width: 10px;
        }

        ::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 4px;
        }
    `;
        document.head.appendChild(style);
    }

    function injectDarkModeSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(DARK_MODE_FLAG, false);
        const div = document.createElement('div');
        div.id = 'dark_mode_settings_wrapper';
        div.innerHTML = `
        <strong>Dark Mode</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="dark_mode_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Dark Mode
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#dark_mode_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(DARK_MODE_FLAG, enabled);
            enableDarkMode();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }
    // ========== Incoming Transfers Alert ==========
    const INCOMING_ART_KEY_LAST_CHECK = 'lwm_incoming_arts_last_check';
    const INCOMING_ART_FLAG = 'lwm_incoming_arts_enabled';
    const INCOMING_ARTS_TRANSFERS_LIST = 'lwm_incoming_arts_transfer_list';

    function injectIncomingArtSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(INCOMING_ART_FLAG, false);
        const div = document.createElement('div');
        div.id = 'incoming_art_settings_wrapper';
        div.innerHTML = `
        <strong>Incoming Arts</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="incoming_art_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Incoming Art Transfer Alerts
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#incoming_art_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(INCOMING_ART_FLAG, enabled);
            incomingTransferAlerts();
            renderModules();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }
    async function incomingArtPanel() {
        if (!getFlag(INCOMING_ART_FLAG, false)) return;
        const container = document.querySelector('#lwm-modules');
        if (!container) return console.warn("Scheduler module container not found!");
        const incomingTransfers = await getStoredTransfers(); // assumes list of TIDs
        const artCount = incomingTransfers.length;
        if (artCount === 0) return; // don't display anything
        const div = document.createElement('div');
        div.className = 'lwm-module';
        div.id = 'incoming_arts_module';
        div.innerHTML = `
        <div><span><strong>Incoming Arts:</strong> <span id="incoming_arts_display">${artCount}</span></span></div>
    `;
        container.appendChild(div);
    }
    async function getStoredTransfers() {
        const raw = getFlag(INCOMING_ARTS_TRANSFERS_LIST, '[]');
        try {
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }
    async function incomingTransferAlerts() {
        if (!getFlag(INCOMING_ART_FLAG, false)) return;
        async function checkForNewTransfers(currentList) {
            //console.log('incoming transfer module triggered 3');
            const previousList = await getStoredTransfers();
            const newTransfers = currentList.filter(tid => !previousList.includes(tid));
            if (newTransfers.length > 0) {
                alert("📦 You have incoming transfers!");
            }
            await saveTransfers(currentList);
        }
        async function saveTransfers(tidList) {
            setFlag(INCOMING_ARTS_TRANSFERS_LIST, JSON.stringify(tidList));
        }

        function extractIncomingTransfers(html) {
            //console.log('incoming transfer module triggered 2.');
            let text;
            if (window.location.pathname === '/inventory.php') {
                const header = document;
                text = header.innerText;
            } else {
                text = html;
            }
            const regex = /trade_accept\.php\?tid=(\d+)/g;
            const matches = [];
            let match;
            while ((match = regex.exec(text)) !== null) {
                matches.push(match[1]); // only store the tid number
            }
            //return matches;
            setFlag(INCOMING_ART_KEY_LAST_CHECK, Date.now());
            checkForNewTransfers(matches);
        }
        async function initIncomingTransfers() {
            const lastChecked = getFlag(INCOMING_ART_KEY_LAST_CHECK, 0);
            const now = Date.now();
            //console.log('incoming transfer module triggered.');
            if (location.pathname === '/inventory.php') {
                extractIncomingTransfers();
            } else if (now - lastChecked > recheckCooldownLong) {
                fetchAndParse('https://www.lordswm.com/inventory.php', extractIncomingTransfers);
            }
        }
        initIncomingTransfers();
    }
    // ========== Inventory To Auction Lot ==========
    const INV_TO_LOT_KEY = 'lwm_post_new_lot';
    const INV_TO_LOT_FLAG = 'lwm_post_new_lot_enabled';

    function injectInvToLotSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(INV_TO_LOT_FLAG, false);
        const div = document.createElement('div');
        div.id = 'inv_to_lot_settings_wrapper';
        div.innerHTML = `
        <strong>Inv to Lot</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="inv_to_lot_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Inventory to Auction Lot
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#inv_to_lot_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(INV_TO_LOT_FLAG, enabled);
            inventoryToAuctionLot();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function inventoryToAuctionLot() {
        if (!getFlag(INV_TO_LOT_FLAG, false)) return;

        function createButton(artTransferName) {
            const wrapper = document.createElement('div');
            wrapper.className = 'inv_item_select lwm-transfer-btn';
            const btn = document.createElement('img');
            btn.className = 'inv_item_select inv_item_select_img';
            btn.src = 'https://dcdn2.lordswm.com/i/r/48/gold.png?v=3.23de65';
            btn.title = 'Sell on Market';
            btn.addEventListener('click', () => {
                setFlag(INV_TO_LOT_KEY, artTransferName);
                console.log('saved the art' + artTransferName);
                openAuctionNewLogPage();
            });
            wrapper.appendChild(btn);
            return wrapper;
        }

        function injectButton() {
            const menu = document.getElementById('inv_menu');
            const idx = parseInt(menu?.getAttribute('art_idx'), 10);
            if (isNaN(idx) || !arts || !arts[idx]) return;
            const artTransferName = arts[idx].art_id + '@' + arts[idx].id;
            //console.log(artTransferName);
            const container = document.getElementById('inv_item_buttons');
            const old = container.querySelector('.lwm-transfer-btn');
            if (old) old.remove();
            const newBtn = createButton(artTransferName);
            container.appendChild(newBtn);
        }

        function addToInvMenu() {
            const target = document.getElementById('inv_menu');
            if (!target) return;
            const observer = new MutationObserver(() => {
                if (target.style.display !== 'none') {
                    injectButton();
                }
            });
            observer.observe(target, {
                attributes: true,
                attributeFilter: ['style', 'art_idx'],
            });
        }

        function openAuctionNewLogPage() {
            const url = 'https://www.lordswm.com/auction_new_lot.php';
            window.location.href = url;
        }
        if (location.pathname === '/inventory.php') {
            addToInvMenu();
        } else if (location.pathname === '/auction_new_lot.php') {
            (async () => {
                const artToSelect = getFlag(INV_TO_LOT_KEY, null);
                if (artToSelect) {
                    const sel = document.querySelector('#sel');
                    if (sel) {
                        sel.value = artToSelect;
                        console.log('✅ sel set to:', artToSelect);
                        setTimeout(() => {
                            sel.dispatchEvent(new Event('change'));
                            //console.log('✅ Change event dispatched after delay.');
                        }, 700); // 100ms delay is usually enough, 700 to be careful
                    } else {
                        //console.warn('❌ #sel not found on auction_new_lot.php');
                    }
                    const countInput = document.querySelector('#anl_count');
                    setTimeout(() => {
                        if (countInput) {
                            countInput.value = '1';
                        }
                    }, 1000);
                    setFlag(INV_TO_LOT_KEY, null); //after everything, clear the value
                    //console.log('Stored art value cleared.');
                } else {
                    //console.log('No art stored for sale.');
                }
            })();
        }
    }
    // ========== Rational Seller ==========
    const RATIONAL_AUCTIONS_FLAG = 'rational_auctions_enabled';
    const RATIONAL_SELLER_FLAG = 'rational_seller_enabled';

    function injectRationalAuctionsSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(RATIONAL_AUCTIONS_FLAG, false);
        const div = document.createElement('div');
        div.id = 'rational_auctions_settings_wrapper';
        div.innerHTML = `
        <strong>Rational Auctions</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="rational_auctions_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Auction Page CPB calcs
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#rational_auctions_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(RATIONAL_AUCTIONS_FLAG, enabled);
            rationalMarketEnjoyer();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function injectRationalSellerSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(RATIONAL_SELLER_FLAG, false);
        const div = document.createElement('div');
        div.id = 'rational_seller_settings_wrapper';
        div.innerHTML = `
        <strong>Rational Seller</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="rational_seller_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Auction New Lot Assist
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#rational_seller_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(RATIONAL_SELLER_FLAG, enabled);
            rationalMarketEnjoyer();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function rationalMarketEnjoyer() {
        'use strict';
        const goldImg = '<img alt="" src="https://dcdn2.lordswm.com/i/r/48/gold.png?v=3.23de65" border="0" width="24" height="24" title="Cost">&nbsp;';
        let table, rows, artId;
        const artCache = new Map();
        const STORAGE_KEY = 'lwm_art_data_cache';
        const SMITH_SETTINGS_KEY = 'lwm_smith_settings';
        //#region smith and cache functions
        function smithEffiInput() {
            return parseFloat(document.getElementById('smithEffi')?.value || 90);
        }

        function smithChargeInput() {
            return parseFloat(document.getElementById('smithCharge')?.value || 102);
        }

        function loadSmithSettings() {
            return getFlag(SMITH_SETTINGS_KEY, {
                effi: 90,
                charge: 102
            });
        }

        function saveSmithSettings(effi, charge) {
            setFlag(SMITH_SETTINGS_KEY, {
                effi,
                charge
            });
        }

        function loadCacheFromStorage() {
            const obj = getFlag(STORAGE_KEY, {});
            for (const [key, val] of Object.entries(obj)) {
                artCache.set(key, val);
            }
        }

        function saveCacheToStorage() {
            const obj = Object.fromEntries(artCache);
            setFlag(STORAGE_KEY, obj);
        }
        //#endregion
        function AuctionPageMarketTableRows(context = document, skipHeaders = false) {
            const xpath = "//td[contains(text(),'Bids')]";
            const bidsEl = context.evaluate(xpath, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const table = bidsEl?.parentNode?.parentNode;
            if (!table) return {
                table: null,
                rows: []
            };
            const rows = Array.from(table.children);
            return {
                table,
                rows: skipHeaders ? rows.slice(2) : rows
            };
        }

        function AuctionPageAddColumns() {
            const header = rows[1];
            let labels = [];
            let cacheA = artCache.get(artId);
            const lowestCPB = cacheA?.lowestCPB ?? null;
            if (lowestCPB !== null) {
                labels = ['CPB', 'Repair Till', 'Total Fights', 'Shop CPB'];
            } else labels = ['CPB', 'Repair Till', 'Total Fights'];
            labels.forEach(label => {
                const td = document.createElement('td');
                td.innerHTML = `<span align="center">${label}</span>`;
                td.setAttribute('width', '100');
                header.appendChild(td);
            });
        }

        function AuctionPageAddSmithSettings() {
            const settings = rows[0];
            settings.children[0].colSpan = 2;
            settings.children[1].align = "center";
            settings.children[1].colSpan = 3;
            const {
                effi,
                charge
            } = loadSmithSettings();
            const td = document.createElement('td');
            td.align = "center";
            td.colSpan = 4;
            td.innerHTML = `
		<b>Cost Per Battle</b><br>
		Effi.: <input type="number" id="smithEffi" value="${effi}" style="width: 40px">%
		| Cost: <input type="number" id="smithCharge" value="${charge}" style="width: 45px">%
		`;
            settings.appendChild(td);
            setTimeout(() => {
                document.getElementById('smithEffi').addEventListener('change', () => {
                    saveSmithSettings(smithEffiInput(), smithChargeInput());
                    location.reload(); // full re-calc
                });
                document.getElementById('smithCharge').addEventListener('change', () => {
                    saveSmithSettings(smithEffiInput(), smithChargeInput());
                    location.reload(); // full re-calc
                });
            }, 100);
        }
        async function fetchRepairCost(artId) {
            if (artCache.has(artId)) {
                const entry = artCache.get(artId);
                if (entry.repairCost) {
                    console.log(`[Cache] ✅ Found Repair Cost for ${artId} via cache`);
                    return Number(entry.repairCost);
                }
            }
            const url = `https://www.lordswm.com/art_info.php?id=${artId}`;
            const resp = await fetch(url);
            const html = await resp.text();
            const value = Number(html.split("Repairing")[1]?.split('<td>')[2]?.split('</td>')[0]?.replace(',', '').trim()) || 0;
            console.log(`[Cache] ❌ Had to fetch Repair Cost for ${artId} via website`);
            let updated = artCache.get(artId) || {};
            updated.repairCost = value;
            artCache.set(artId, updated);
            saveCacheToStorage();
            return value;
        }
        async function fetchMarketURL(artId) {
            if (artCache.has(artId)) {
                const entry = artCache.get(artId);
                if (entry.marketURL) {
                    console.log(`[Cache] ✅ Found marketURL for ${artId} in cache`);
                    return entry.marketURL;
                }
            }
            const artInfoUrl = `https://www.lordswm.com/art_info.php?id=${artId}`;
            const resp = await fetch(artInfoUrl);
            const html = await resp.text();
            const match = html.match(/auction\.php\?cat=[^"]+art_type=[^"]+/);
            if (!match) {
                console.warn(`[MarketURL] ❌ No market link found for artId ${artId}`);
                return null;
            }
            const rawUrl = match[0].replace(/&amp;/g, '&');
            const marketURL = `https://www.lordswm.com/${rawUrl}`;
            console.log(`[MarketURL] ❌ Had to fetch marketURL for ${artId}`);
            const updated = artCache.get(artId) || {};
            updated.marketURL = marketURL;
            artCache.set(artId, updated);
            saveCacheToStorage();
            return marketURL;
        }

        function cpbCalc(currDura, maxDura, iniCost, repCost, effi, charge) {
            let tempMaxDura = maxDura;
            let totDura = currDura;
            let totCost = iniCost;
            const se = effi / 100;
            const sc = charge / 100;
            let minCPB = totCost / totDura;
            let optDura = tempMaxDura;
            let optFights = totDura;
            for (let i = 1; i <= maxDura; i++) {
                totCost += repCost * sc;
                const restored = Math.floor(tempMaxDura * se);
                totDura += restored;
                const cpb = totCost / totDura;
                tempMaxDura -= 1;
                if (cpb <= minCPB) {
                    minCPB = cpb;
                    optDura = tempMaxDura;
                    optFights = totDura;
                }
            }
            return [minCPB.toFixed(2), optDura, optFights];
        }
        async function AuctionPageCPB() {
            const rowData = [];
            for (let i = 2; i < rows.length; i++) {
                const cells = rows[i].children;
                const info = cells[0].textContent;
                const price = Number(cells[2].textContent.replace(/,/g, '').match(/\d+/)?.[0] || 0);
                const name = info.split('-')[1]?.split('[')[0]?.trim() || '';
                let durabilityText = info.split("Durability: ")[1] || "";
                if (durabilityText.includes("pcs")) {
                    durabilityText = durabilityText.substring(0, durabilityText.length - 6);
                }
                let [cur, max] = durabilityText.split('/') || [0, 0];
                cur = parseInt(cur, 10);
                max = parseInt(max.match(/\d+/)?.[0] || 0);
                rowData.push({
                    row: rows[i],
                    name,
                    price,
                    cur,
                    max
                });
            }
            let cacheA = artCache.get(artId);
            let repCost = await fetchRepairCost(artId);
            let shopCost = cacheA?.shopCost || 0;
            let lowestCPB = cacheA?.lowestCPB ?? null;
            for (const data of rowData) {
                const [cpb, till, fights] = cpbCalc(
                    data.cur, data.max, data.price, repCost, smithEffiInput(), smithChargeInput()
                );
                const cpbCell = `<td width="100">${cpb}</td>`;
                const tillCell = `<td width="100">0/${till}</td>`;
                const fightCell = `<td width="100">${fights}</td>`;
                if (lowestCPB !== null) {
                    let mapCPBCell = `<td width="100">-</td>`;
                    if (shopCost > 0 && lowestCPB !== null) {
                        const highlight = parseFloat(lowestCPB) < parseFloat(cpb) ? ' style="color:red;font-weight:bold"' : '';
                        mapCPBCell = `<td width="100"${highlight}>${lowestCPB}</td>`;
                    }
                    data.row.innerHTML += cpbCell + tillCell + fightCell + mapCPBCell;
                } else {
                    data.row.innerHTML += cpbCell + tillCell + fightCell;
                }
            }
        }

        function AuctionPageAutoSort() {
            const waitForDropdown = setInterval(() => {
                const dropdown = document.getElementById('ss');
                if (!dropdown || dropdown.dataset.cpbEnhanced) return;
                dropdown.dataset.cpbEnhanced = 'true';
                const cpbOption = new Option("Cost per Battle: Ascending", "304");
                dropdown.appendChild(cpbOption);
                // Remove default onchange handler to prevent reload
                dropdown.removeAttribute("onchange");
                dropdown.addEventListener('change', e => {
                    const value = dropdown.value;
                    if (value === "304") {
                        e.preventDefault();
                        e.stopPropagation();
                        AuctionPageSorting();
                        return false;
                    } else if (value === "0") {
                        e.preventDefault();
                        location.reload();
                        return false;
                    } else {
                        const form = dropdown.closest('form');
                        if (form) form.submit();
                    }
                });
                dropdown.value = "304";
                AuctionPageSorting();
                clearInterval(waitForDropdown);
            }, 300);
        }

        function AuctionPageSorting() {
            const dataRows = rows.slice(2);
            dataRows.sort((a, b) => parseFloat(a.children[5].textContent) - parseFloat(b.children[5].textContent));
            for (const row of dataRows) table.appendChild(row);
        }
        async function NewLotFindMarketFetch(artId) {
            try {
                const {
                    effi,
                    charge
                } = loadSmithSettings();
                const marketUrl = await fetchMarketURL(artId);
                const marketHtml = await (await fetch(marketUrl)).text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(marketHtml, 'text/html');
                const xpath = "//td[contains(text(),'Bids')]";
                const bidsEl = document.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                const table = bidsEl?.parentNode?.parentNode;
                if (!table) {
                    console.warn("[Market Table] Not found.");
                    return;
                }
                const rows = Array.from(table.children).slice(2); // Skip header
                console.log(`[Market Table] Found ${rows.length} data rows.`);
                const repCost = await fetchRepairCost(artId);
                const resultTable = [];
                for (const row of rows) {
                    const cells = row.children;
                    const info = cells[0]?.textContent;
                    const bidsCol = cells[1]?.textContent.trim();
                    const priceText = cells[2]?.textContent.replace(/,/g, '') || '';
                    let type = 'uncapped';
                    if (bidsCol.includes("Buy now")) type = 'fixed';
                    else if (bidsCol.includes("Buyout price")) type = 'capped';
                    const price = Number(priceText.match(/\d+/)?.[0] || 0);
                    if (price <= 0) continue;
                    let durabilityText = info.split("Durability: ")[1] || "";
                    if (durabilityText.includes("pcs")) {
                        durabilityText = durabilityText.substring(0, durabilityText.length - 6);
                    }
                    const [curRaw, maxRaw] = durabilityText.split('/');
                    const cur = parseInt(curRaw, 10);
                    const max = parseInt(maxRaw?.match(/\d+/)?.[0] || 0);
                    if (!cur || !max || max < cur) continue;
                    const [cpb] = cpbCalc(cur, max, price, repCost, 90, 100);
                    resultTable.push({
                        cur,
                        max,
                        price,
                        cpb: parseFloat(cpb),
                        type
                    });
                }
                if (resultTable.length === 0) {
                    console.warn(`⚠️ No valid lots found for ${artId}`);
                } else {
                    console.log(`✅ Parsed ${resultTable.length} valid lots.`);
                    console.table(resultTable);
                }
                NewLotAnalyzeMarketTable(resultTable);
            } catch (e) {
                console.error(`[Error] Failed to fetch or parse market data:`, e);
            }
        }
        async function fetchFacilityMinPrice(artId) {
            const url = `https://www.lordswm.com/ecostat_details.php?r=${artId}`;
            try {
                const res = await fetch(url);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const tables = Array.from(doc.querySelectorAll('table'));
                let minPrice = Infinity;
                for (const table of tables) {
                    const firstRow = table.querySelector('tr');
                    if (!firstRow || !firstRow.textContent.includes('Facility')) continue;
                    const rows = table.querySelectorAll('tr');
                    for (let i = 1; i < rows.length; i++) {
                        const cells = rows[i].querySelectorAll('td');
                        if (cells.length < 4) continue;
                        const priceText = cells[3].textContent.replace(/,/g, '').trim();
                        const price = parseInt(priceText);
                        if (!isNaN(price) && price < minPrice) {
                            minPrice = price;
                        }
                    }
                }
                return isFinite(minPrice) ? minPrice : null;
            } catch (err) {
                console.error("[Facility Fetch Error]", err);
                return null;
            }
        }
        async function parseAndCacheArtInfo(artId, html) {
            const doc = document;
            const repairMatch = html.split("Repairing")[1]?.split('<td>')[2]?.split('</td>')[0];
            const repairCost = repairMatch ? Number(repairMatch.replace(',', '').trim()) : 0;
            const shopBox = doc.querySelector('.s_art_inside');
            const shopTable = shopBox?.querySelector('table');
            let shopCost = 0;
            let durability = null;
            let shopCPB = null;
            let facilityPrice = null;
            let facilityCPB = null;
            let lowestCPB = null;
            if (shopTable) {
                const cells = shopTable.querySelectorAll('td');
                for (let i = 0; i < cells.length; i += 2) {
                    const icon = cells[i]?.querySelector('img');
                    const qty = Number(cells[i + 1]?.textContent.replace(',', '').trim());
                    if (!icon || isNaN(qty)) continue;
                    switch (icon.getAttribute('title')) {
                        case 'Gold':
                            shopCost += qty;
                            break;
                        case 'Ore':
                        case 'Wood':
                            shopCost += qty * 180;
                            break;
                        case 'Gems':
                        case 'Sulfur':
                        case 'Mercury':
                        case 'Crystals':
                            shopCost += qty * 360;
                            break;
                    }
                }
                if (shopCost > 0) {
                    durability = parseInt(doc.body.innerText.match(/Durability:\s*(\d+)\s*$/m)?.[1] || '') || null;
                    shopCPB = parseFloat((shopCost / durability).toFixed(1));
                    facilityPrice = await fetchFacilityMinPrice(artId);
                    const lastRow = shopTable.rows[shopTable.rows.length - 1];
                    const tdEq = doc.createElement('td');
                    let extras = '';
                    if (shopCPB) extras += ` (CPB: ${shopCPB})`;
                    if (facilityPrice) {
                        extras += `, Facility: ${facilityPrice}`;
                        facilityCPB = parseFloat((facilityPrice / durability).toFixed(1));
                        extras += ` (${facilityCPB})`;
                    }
                    tdEq.innerHTML = `&nbsp;&nbsp;=&nbsp;&nbsp;${goldImg}`;
                    lastRow.appendChild(tdEq);
                    const tdVal = doc.createElement('td');
                    tdVal.innerHTML = `${shopCost}${extras}`;
                    lastRow.appendChild(tdVal);
                    lowestCPB = facilityCPB !== null ? Math.min(shopCPB, facilityCPB) : shopCPB;
                }
            }
            const marketLinkMatch = html.match(/auction\.php\?cat=[^"]+art_type=[^"]+/);
            if (!marketLinkMatch) {
                console.warn(`[Cache] ❌ No market URL found for ${artId}`);
                return;
            }
            const rawUrl = marketLinkMatch[0].replace(/&amp;/g, '&');
            const marketURL = `https://www.lordswm.com/${rawUrl}`;
            const artURL = `https://www.lordswm.com/art_info.php?id=${artId}`;
            // ✅ Add/Update in artCache map
            artCache.set(artId, {
                repairCost,
                shopCost,
                shopDurability: durability,
                shopCPB: shopCPB ? parseFloat(shopCPB.toFixed(2)) : null,
                facilityPrice,
                facilityCPB,
                lowestCPB,
                artURL,
                marketURL,
            });
            // 💾 Save using the existing save function
            saveCacheToStorage();
            console.log(`[Cache] Stored for ${artId}:`, artCache.get(artId));
        }

        function NewLotPriceFromCPB(currDura, maxDura, repCost, effi, charge, targetCPB) {
            const se = effi / 100;
            const sc = charge / 100;
            let bestPrice = null;
            let bestRepairCount = 0;
            let bestTotalFights = 0;
            let tempMaxDura = maxDura;
            let totalFights = currDura;
            for (let i = 0; i <= maxDura; i++) {
                const totalCost = targetCPB * totalFights;
                const repairCostTotal = repCost * sc * i;
                const iniCost = totalCost - repairCostTotal;
                if (bestPrice === null || iniCost > bestPrice) {
                    bestPrice = iniCost;
                    bestRepairCount = i;
                    bestTotalFights = totalFights;
                }
                const restored = Math.floor(tempMaxDura * se);
                totalFights += restored;
                tempMaxDura -= 1;
            }
            return [bestPrice.toFixed(2), bestRepairCount, bestTotalFights];
        }

        function NewLotInsertCustomFlexBox() {
            const target = document.querySelector('#set_mobile_max_width');
            if (!target || !target.parentNode) {
                console.warn('❌ Could not find #set_mobile_max_width or its parent');
                return;
            }
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'stretch';
            wrapper.style.gap = '5px';
            wrapper.style.marginTop = '5px';
            target.style.width = '50%';
            target.parentNode.insertBefore(wrapper, target);
            wrapper.appendChild(target);
            const customBox = document.createElement('div');
            customBox.className = 'global_container_block eco_container_block';
            customBox.id = 'custom-flex-box';
            customBox.style.width = '50%';
            customBox.style.display = 'flex';
            customBox.style.justifyContent = 'flex-start';
            customBox.style.flexDirection = 'column';
            customBox.style.paddingLeft = '0.5em';
            customBox.style.paddingRight = '0.5em';
            const customHeader = document.createElement('div');
            customHeader.className = 'global_container_block_header';
            customHeader.id = 'rational-seller-header';
            customHeader.textContent = '🔧 Rational Seller';
            customBox.appendChild(customHeader);
            const customContent = document.createElement('div');
            customContent.textContent = 'Select an item to post a new lot with.';
            customContent.id = 'rational-seller-pre-text';
            customContent.style = 'width: 100%; padding-left: 0.5em; padding-right: 0.5em; font-size: 80%;';
            customBox.appendChild(customContent);
            const separator1 = document.createElement('div');
            separator1.className = 'separator2';
            customBox.appendChild(separator1);
            const fields = [{
                label: 'Current durability',
                id: 'curr_dura'
            }, {
                label: 'Max durability',
                id: 'max_dura'
            }, {
                label: 'Repair cost',
                id: 'repair_cost'
            }, {
                label: 'Target cost per battle',
                id: 'target_cpb'
            }, {
                label: 'Recommended market price',
                id: 'recommended_price'
            }];
            fields.forEach(field => {
                const container = document.createElement('div');
                container.style.margin = '4px 0';
                const label = document.createElement('label');
                label.textContent = field.label + ': ';
                label.setAttribute('for', field.id);
                label.style = 'width: 100%; padding-left: 0.5em; padding-right: 0.5em; font-size: 80%;';
                const input = document.createElement('input');
                input.type = 'text';
                input.id = field.id;
                input.style = 'width: 100px;';
                container.appendChild(label);
                container.appendChild(input);
                customBox.appendChild(container);
            });
            const separator2 = document.createElement('div');
            separator2.className = 'separator2';
            customBox.appendChild(separator2);
            const customContent2 = document.createElement('div');
            customContent2.textContent = 'Here will show the results from current market lots.';
            customContent2.id = 'rational-seller-post-text';
            customContent2.style = 'width: 100%; padding-left: 0.5em; padding-right: 0.5em; font-size: 80%;';
            customContent2.style.whiteSpace = 'pre-wrap';
            customBox.appendChild(customContent2);
            wrapper.id = 'flex-wrapper';
            wrapper.appendChild(customBox);
            document.querySelector('#target_cpb').addEventListener('input', function() {
                const curr = parseInt(document.querySelector('#curr_dura').value);
                const max = parseInt(document.querySelector('#max_dura').value);
                const rep = parseFloat(document.querySelector('#repair_cost').value);
                const targetCPB = parseFloat(document.querySelector('#target_cpb').value);
                if (isNaN(curr) || isNaN(max) || isNaN(rep) || isNaN(targetCPB)) return;
                const effi = 90; // Smith efficiency % fixed
                const charge = 100; // Smith charge % fixed
                const [price] = NewLotPriceFromCPB(curr, max, rep, effi, charge, targetCPB);
                const roundedPrice = Math.floor(price / 100) * 100;
                document.querySelector('#recommended_price').value = roundedPrice;
            });
        }

        function StyleAddSeparator() {
            if (!document.querySelector('style[data-injected="separator2"]')) {
                const style = document.createElement('style');
                style.setAttribute('data-injected', 'separator2');
                style.textContent = `
            .separator2 {
				width: 95%;
				height: 1px;
				margin: .45em .7em;
				background-color: #bdb6a8;
             }`;
                document.head.appendChild(style);
            }
        }

        function NewLotGetOptionDurability(optionText) {
            const match = optionText.match(/(\d+)\s*\/\s*(\d+)/);
            if (!match) return {
                cur: 0,
                max: 0
            };
            const cur = parseInt(match[1], 10);
            const max = parseInt(match[2], 10);
            return {
                cur,
                max
            };
        }

        function NewLotAnalyzeMarketTable(resultTable) {
            const selected = [];
            const usedIndexes = new Set();

            function pickOneRow(filterFn, sortFn) {
                const filtered = resultTable
                    .map((row, index) => ({
                        ...row,
                        _index: index
                    }))
                    .filter(filterFn);
                if (!filtered.length) return;
                const best = filtered.sort(sortFn)[0];
                if (!usedIndexes.has(best._index)) {
                    usedIndexes.add(best._index);
                    selected.push(best);
                }
            }
            // 1. Lowest CPB of type 'fixed'
            pickOneRow(
                row => row.type === 'fixed', (a, b) => a.cpb - b.cpb
            );
            // 2. Among 'fixed', select lowest CPB from lots with max durability == highest
            const fixedWithMaxDurability = resultTable
                .map((row, index) => ({
                    ...row,
                    _index: index
                }))
                .filter(row => row.type === 'fixed');
            if (fixedWithMaxDurability.length) {
                const maxDura = Math.max(...fixedWithMaxDurability.map(r => r.max));
                pickOneRow(
                    row => row.type === 'fixed' && row.max === maxDura, (a, b) => a.cpb - b.cpb
                );
            }
            // 3. Highest CPB of type 'uncapped'
            pickOneRow(
                row => row.type === 'uncapped', (a, b) => b.cpb - a.cpb
            );
            // 4. Lowest CPB of type 'capped'
            pickOneRow(
                row => row.type === 'capped', (a, b) => a.cpb - b.cpb
            );
            console.table(selected);
            NewLotDisplayHighlights(selected);
            NewLotSelectBestArtLot(resultTable);
        }

        function NewLotDisplayHighlights(lots) {
            console.log("triggered highlights in textbox");
            const lines = lots.map((lot, i) => {
                return `lot ${i + 1} - ${lot.cur}/${lot.max} for ${lot.price} , cpb = ${lot.cpb.toFixed(2)} , type = ${lot.type}`;
            });
            const output = lines.join('\n');
            const box = document.querySelector('#rational-seller-post-text');
            if (box) {
                box.textContent = output;
            } else {
                console.warn("⚠️ #rational-seller-post-text element not found.");
            }
        }

        function NewLotSelectBestArtLot(lots) {
            console.log("triggered single best lot finder");
            const fixedLots = lots.filter(lot => lot.type === 'fixed');
            if (fixedLots.length === 0) {
                const cappedLots = lots.filter(lot => lot.type === 'capped');
                return cappedLots.sort((a, b) => a.cpb - b.cpb)[0] || null;
            }
            // Sort by CPB ascending
            const sorted = [...fixedLots].sort((a, b) => a.cpb - b.cpb);
            const top3 = sorted.slice(0, 3);
            const best = top3.reduce((acc, lot) => {
                if (!acc || lot.max > acc.max) return lot;
                return acc;
            }, null);
            document.querySelector('#target_cpb').value = best.cpb;
            setTimeout(() => {
                document.querySelector('#target_cpb').dispatchEvent(new Event('input'));
            }, 0);
        }

        function NewLotSelectBestElementPrice(lots) {
            console.log("🔍 Selecting best element lot with 3rd-price strategy");
            const fixedLots = lots.filter(lot => lot.type === 'fixed').sort((a, b) => a.price - b.price);
            let best = null;
            if (fixedLots.length >= 3) {
                best = fixedLots[2];
            } else if (fixedLots.length > 0) {
                best = fixedLots[fixedLots.length - 1];
            } else {
                const cappedLots = lots.filter(lot => lot.type === 'capped').sort((a, b) => a.price - b.price);
                if (cappedLots.length > 0) {
                    best = cappedLots[0];
                }
            }
            if (best) {
                setTimeout(() => {
                    document.querySelector('#recommended_price').value = best.price;
                }, 0);
            } else {
                console.warn("⚠️ No valid element lots found to recommend.");
            }
        }
        async function NewLotFetchElements(artType) {
            try {
                const marketUrl = `https://www.lordswm.com/auction.php?cat=elements&art_type=${artType}`;
                console.log(`[Element] ✅ Found Market URL: ${marketUrl}`);
                const marketHtml = await (await fetch(marketUrl)).text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(marketHtml, 'text/html');
                const xpath = "//td[contains(text(),'Bids')]";
                const bidsEl = document.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                const table = bidsEl?.parentNode?.parentNode;
                if (!table) {
                    console.warn("[Market Table] Not found.");
                    return;
                }
                //because this is elements, keep only Price and Type
                const rows = Array.from(table.children).slice(2);
                console.log(`[Market Table] Found ${rows.length} data rows.`);
                const resultTable = [];
                for (const row of rows) {
                    const cells = row.children;
                    const info = cells[0]?.textContent;
                    const bidsCol = cells[1]?.textContent.trim();
                    const priceText = cells[2]?.textContent.replace(/,/g, '') || '';
                    let type = 'uncapped';
                    if (bidsCol.includes("Buy now")) type = 'fixed';
                    else if (bidsCol.includes("Buyout price")) type = 'capped';
                    const price = Number(priceText.match(/\d+/)?.[0] || 0);
                    if (price <= 0) continue;
                    resultTable.push({
                        price,
                        type
                    });
                }
                if (resultTable.length === 0) {
                    console.warn(`⚠️ No valid lots found for ${artId}`);
                } else {
                    console.log(`✅ Parsed ${resultTable.length} valid lots.`);
                    console.table(resultTable); // ← View the table directly in console
                }
                NewLotSelectBestElementPrice(resultTable);
            } catch (e) {
                console.error(`[Error] Failed to fetch or parse market data:`, e);
            }
        }
        async function mainAuctionNewLot() {
            if (!getFlag(RATIONAL_SELLER_FLAG, false)) return;
            if (!location.pathname.includes('auction_new_lot.php')) return;
            const sel = document.querySelector('#sel');
            if (!sel) return;
            StyleAddSeparator();
            window.addEventListener('load', NewLotInsertCustomFlexBox);
            sel.addEventListener('change', async () => {
                const val = sel.value;
                console.log(`[Step 1] Selected value: ${val}`);
                const selectedText = sel.options[sel.selectedIndex].textContent;
                if (val.includes("@")) {
                    artId = val.split("@")[0];
                    await NewLotFindMarketFetch(artId);
                    const {
                        cur,
                        max
                    } = NewLotGetOptionDurability(selectedText);
                    let repairCost = await fetchRepairCost(artId);
                    document.querySelector('#repair_cost').value = repairCost;
                    document.querySelector('#curr_dura').value = cur;
                    document.querySelector('#max_dura').value = max;
                    document.querySelector('#rational-seller-pre-text').textContent = 'Selected ' + selectedText;
                } else if (val.includes("EL_")) {
                    const ELEMENT_NAME_TO_ART_TYPE = {
                        "abrasive": "abrasive",
                        "fern flower": "fern_flower",
                        "fire crystal": "fire_crystal",
                        "ice crystal": "ice_crystal",
                        "meteorite shard": "meteorit",
                        "moonstone": "moon_stone",
                        "tiger`s claw": "tiger_tusk",
                        "toadstool": "badgrib",
                        "viper venom": "snake_poison",
                        "windflower": "wind_flower",
                        "witch bloom": "witch_flower"
                    };
                    const name = selectedText.split(' (')[0].trim().toLowerCase();
                    const artType = ELEMENT_NAME_TO_ART_TYPE[name];
                    if (!artType) {
                        console.warn(`[Element] ❌ No mapping found for element name: "${name}"`);
                        return;
                    }
                    document.querySelector('#repair_cost').value = "";
                    document.querySelector('#curr_dura').value = "";
                    document.querySelector('#max_dura').value = "";
                    document.querySelector('#target_cpb').value = "";
                    document.querySelector('#rational-seller-post-text').textContent = "";
                    document.querySelector('#rational-seller-pre-text').textContent = 'Selected ' + selectedText;
                    NewLotFetchElements(artType);
                } else {
                    console.log("[Step 0] Not an artifact or element, aborting.");
                    return;
                }
            });
        }
        async function mainAuctionPage() {
            if (!getFlag(RATIONAL_AUCTIONS_FLAG, false)) return;
            if (!location.pathname.includes('auction.php')) return;
            const excludedCategories = ['part', 'elements', 'obj_share', 'cert', 'dom'];
            const cat = new URL(location.href).searchParams.get("cat");
            if (excludedCategories.includes(cat) || !cat) return;
            artId = new URL(location.href).searchParams.get("art_type");
            if (!artId) return;
            console.log('Found Art = ' + artId);
            const result = AuctionPageMarketTableRows(document);
            table = result.table;
            rows = result.rows;
            AuctionPageAddSmithSettings();
            AuctionPageAddColumns();
            await AuctionPageCPB();
            AuctionPageAutoSort();
        }
        async function mainArtInfo() {
            if (!location.pathname.includes('art_info.php')) return;
            const url = new URL(location.href);
            const artId = url.searchParams.get("id");
            const html = document.body.innerHTML;
            await parseAndCacheArtInfo(artId, html);
        }
        loadCacheFromStorage();
        mainAuctionNewLot();
        mainArtInfo();
        mainAuctionPage();
    }
    // ========== Bulk Transfer Arts ==========
    const BULK_TRANSFER_FLAG = 'bulk_transfer_enabled';

    function injectBulkTransferSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(BULK_TRANSFER_FLAG, false);
        const div = document.createElement('div');
        div.id = 'bulk_transfer_settings_wrapper';
        div.innerHTML = `
        <strong>Bulk Transfer Arts</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="bulk_transfer_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable bulk repair, sales, and lease
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#bulk_transfer_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(BULK_TRANSFER_FLAG, enabled);
            initbulkTransferArts();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function initbulkTransferArts() {
        if (!getFlag(BULK_TRANSFER_FLAG, false)) return;
        if (!location.pathname.includes('inventory.php')) return;
        let artId, repairContainer, leaseContainer;
        let broken_arts = [];
        let REPAIR_PRICE = 101;
        const artCache = new Map();
        const STORAGE_KEY = 'lwm_art_data_cache';

        function h(el, attrs = {}, ...children) {
            let element = document.createElement(el);
            Object.entries(attrs).forEach(([key, value]) => {
                element[key] = value;
            });
            if (children.length > 0) {
                element.append(...children);
            }
            return element;
        }
        let enterSmithName = h("input", {
            type: "text",
            required: "true",
            name: "nick",
            placeholder: "Enter smith name",
        });
        let transferBulkIcon = h("img", {
            src: "https://dcdn.lordswm.com/i/inv_im/btn_art_transfer.png",
            className: "show_hint inv_item_select_img",
        });
        transferBulkIcon.setAttribute("hwm_hint_added", "1");
        transferBulkIcon.setAttribute("hint", "Transfer");
        addHints(transferBulkIcon);
        let transferBulk = h(
            "button", {
                className: "inv_item_select inv_item_select_img",
                type: "submit"
            }, transferBulkIcon
        );
        transferBulk.style.border = "none";
        transferBulk.style.background = "none";

        function loadCacheFromStorage() {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            try {
                const obj = JSON.parse(raw);
                for (const [key, val] of Object.entries(obj)) {
                    artCache.set(key, val);
                }
            } catch (e) {
                console.warn("Failed to parse the art cache: ", e);
            }
        }
        loadCacheFromStorage();

        function saveCacheToStorage() {
            const obj = Object.fromEntries(artCache);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
        }
        async function fetchRepairCost(artId) {
            if (artCache.has(artId)) {
                const entry = artCache.get(artId);
                if (entry.repairCost) {
                    console.log(`[Cache] ✅ Found Repair Cost for ${artId} via cache`);
                    return Number(entry.repairCost);
                }
            }
            const url = `https://www.lordswm.com/art_info.php?id=${artId}`;
            const resp = await fetch(url);
            const html = await resp.text();
            const valueRaw = html.split("Repairing")[1]?.split('<td>')[2]?.split('</td>')[0];
            const value = valueRaw ? Number(valueRaw.replace(',', '').trim()) : null;
            console.log(`[Cache] ❌ Had to fetch Repair Cost for ${artId} via website`);
            let updated = artCache.get(artId) || {};
            updated.repairCost = value;
            artCache.set(artId, updated);
            saveCacheToStorage();
            return value ?? 0;
        }

        function addHints(el) {
            el.addEventListener("mousemove", show_hwm_hint);
            el.addEventListener("touchstart", show_hwm_hint);
            el.addEventListener("mouseout", hide_hwm_hint);
            el.addEventListener("touchend", hide_hwm_hint);
        }
        let actions = h(
            "form", {
                className: "filter_tabs_block_outer"
            }, h("div", {
                className: "lwm_GM_smith_name"
            }, enterSmithName, transferBulk), h("div", {
                className: "separator2"
            }), h("input", {
                id: "rep_price",
                type: "text",
                className: "lwm_GM_repair_price",
                readonly: true,
                value: "The repair cost is set to " + REPAIR_PRICE + "%",
            }), h("div", {
                className: "separator2"
            }), h("div", {
                className: "lwm_GM_pricing_table"
            }, ...createRepairPriceTable())
        );
        const leaseToggleBtn = h("button", {
            textContent: "Switch to Lease/Sell",
            type: "button",
            style: `
    width: 100%;
    padding: 0.3em;
    font-family: verdana, geneva, arial, sans-serif;
    font-size: 9pt;
    font-weight: bold;
    color: #592c08;
    background: #f4ecd3;
    border: 1px solid #5d413a;
    cursor: pointer;
    text-align: center;
    text-decoration: underline;
  `,
            onclick: () => {
                leaseContainer = createLeaseSellContainer(); // (or create once if static)
                mount(leaseContainer);
            },
        });
        (async () => {
            for (let art of arts) {
                if (art.durability1 == 0) {
                    let artEl = h("div", {
                        innerHTML: art.html,
                        className: "inventory_item_div",
                    });
                    const cost = await fetchRepairCost(art.art_id);
                    if (cost === null || cost === 0) {
                        artEl.querySelector(".cre_mon_image1").style.filter =
                            "sepia(0.3) grayscale(0.7)";
                        artEl.querySelector(".cre_mon_image2").style.filter =
                            "sepia(1) grayscale(0.3)";
                    } else {
                        artEl.addEventListener("click", () => {
                            art.bulk_repair_selected = !art.bulk_repair_selected;
                            artEl.classList.toggle("lwm_GM_selected_border");
                        });
                        addHints(artEl.querySelector(".cre_mon_image2"));
                    }
                    broken_arts.push(artEl);
                }
            }
            repairContainer = h(
                "div", {
                    className: "container_block_right",
                    id: "repair-container"
                }, h(
                    "div", {
                        className: "container_block"
                    },
                    // ⬇️ Insert button and separator inline at the top
                    h("div", {}, leaseToggleBtn), h("div", {
                        className: "separator2"
                    }),
                    // ⬇️ Then Broken Items line
                    h(
                        "div", {
                            className: "arts_predmeti"
                        }, document.createTextNode(
                            "Broken Items: " +
                            broken_arts.length +
                            " / " +
                            arts.filter((_) => _.slot >= 0).length
                        )
                    ), h("div", {
                        className: "separator2"
                    }), actions, h("div", {
                        className: "separator2"
                    }), h("div", {
                        className: "inventory_block"
                    }, ...(broken_arts.length ? broken_arts : [h("div", {
                        textContent: "No broken artifacts found."
                    })]))
                )
            );
            repairContainer.style.width = "100%";
            repairContainer.style.flex = "2";
            repairContainer.style.height = "fit-content";
            container_inventory.querySelector(".container_block_right").style.width = "";
            container_inventory.querySelector(".container_block_right").style.flex = "2";
            container_inventory.querySelector(".container_block_right").style.height = "fit-content";
            mount(repairContainer);
        })();

        function addBump(event) {
            if (event.target.dataset.mode === "bump") {
                REPAIR_PRICE = REPAIR_PRICE + Number(event.target.dataset.size);
            } else {
                REPAIR_PRICE = Number(event.target.dataset.size);
            }
            document.getElementById("rep_price").value =
                "The repair cost is set to " + REPAIR_PRICE + "%";
        }

        function createRepairPriceTable() {
            let table = [];
            for (let i = 10; i <= 100; i += 10) {
                let btn = h("button", {
                    textContent: i + "%",
                    type: "button"
                });
                btn.dataset.mode = "fixed";
                btn.dataset.size = i;
                btn.addEventListener("click", addBump);
                table.push(btn);
            }
            let plusOneBtn = h("button", {
                textContent: "+" + 1 + "%",
                type: "button"
            });
            plusOneBtn.dataset.mode = "bump";
            plusOneBtn.dataset.size = 1;
            plusOneBtn.addEventListener("click", addBump);
            table.push(plusOneBtn);
            let plusTenBtn = h("button", {
                textContent: "+" + 10 + "%",
                type: "button"
            });
            plusTenBtn.dataset.mode = "bump";
            plusTenBtn.dataset.size = 10;
            plusTenBtn.addEventListener("click", addBump);
            table.push(plusTenBtn);
            let resetBtn = h("button", {
                textContent: "Reset",
                type: "button"
            });
            resetBtn.dataset.mode = "fixed";
            resetBtn.dataset.size = 101;
            resetBtn.addEventListener("click", addBump);
            table.push(resetBtn);
            return table;
        }
        actions.addEventListener("submit", async (event) => {
            transferBulk.type = "button";
            event.preventDefault();
            event.stopPropagation();
            let form = new FormData(event.target);
            let selectedArts = arts.filter((_) => _.bulk_repair_selected);
            let toBeFixed;
            if (selectedArts.length > 0) {
                toBeFixed = selectedArts;
            } else {
                toBeFixed = [];
                for (const art of arts) {
                    if (art.durability1 == 0) {
                        const cost = await fetchRepairCost(art.art_id);
                        if (cost !== 0) {
                            toBeFixed.push(art);
                        }
                    }
                }
            }
            for (const artToBeFixed of toBeFixed) {
                const baseRepairCost = await fetchRepairCost(artToBeFixed.art_id); // use await here
                if (baseRepairCost == 0) continue;
                let body = new URLSearchParams();
                body.set("nick", form.get("nick"));
                body.set("id", artToBeFixed.id);
                body.set("sendtype", "5");
                body.set("dtime", "0");
                body.set("bcount", "0");
                body.set("art_id", "");
                body.set("rep_price", (baseRepairCost * (REPAIR_PRICE / 100)).toFixed(0));
                body.set("sign", sign);
                await fetch("https://www.lordswm.com/art_transfer.php", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        referer: `https://www.lordswm.com/art_transfer.php?id=${artToBeFixed.id}`,
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    redirect: "manual",
                    body,
                }).catch(() => {});
            }
            window.location.reload();
        });

        function showRepairContainer() {
            const existing = document.getElementById("lease-sell-container");
            if (existing) existing.remove();
            container_inventory.appendChild(repairContainer);
        }

        function createLeaseSellContainer() {
            const leaseArts = arts.filter(a => a.slot >= 0 && a.transfer_ok === 1);
            //a.durability1 >= 0 &&
            const leaseArtElements = leaseArts.map(art => {
                const el = h("div", {
                    innerHTML: art.html,
                    className: "inventory_item_div",
                });
                art.bulk_lease_selected = false;
                el.addEventListener("click", () => {
                    art.bulk_lease_selected = !art.bulk_lease_selected;
                    el.classList.toggle("lwm_GM_selected_border");
                });
                addHints(el.querySelector(".cre_mon_image2"));
                return el;
            });
            const enterNickForLease = h("input", {
                type: "text",
                required: true,
                name: "nick",
                placeholder: "Enter recipient name",
            });
            const priceInput = h("input", {
                type: "number",
                name: "gold",
                min: "0",
                placeholder: "Price",
                style: "width: 100px; margin-right: 0.4em;",
            });
            const priceLabel = h("label", {
                textContent: "Specify Price",
                style: "margin-right: 1em;"
            });
            const sendtype1 = h("input", {
                type: "radio",
                name: "sendtype",
                value: "1",
                id: "sendtype1",
                checked: true,
            });
            const sendtypeLabel1 = h("label", {
                htmlFor: "sendtype1",
                textContent: "Transfer into ownership",
                style: "margin-right: 1em;",
            });
            const sendtype2 = h("input", {
                type: "radio",
                name: "sendtype",
                value: "2",
                id: "sendtype2",
            });
            const sendtypeLabel2 = h("label", {
                htmlFor: "sendtype2",
                textContent: "Transfer with recall in",
            });
            const dtimeInput = h("input", {
                type: "number",
                name: "dtime",
                min: "0",
                placeholder: "Days",
                style: "width: 100px; margin-right: 0.4em;",
            });
            const dtimeLabel = h("label", {
                textContent: "Recall in days",
                style: "margin-right: 1em;"
            });
            const bcountInput = h("input", {
                type: "number",
                name: "bcount",
                min: "0",
                placeholder: "Combats",
                style: "width: 100px; margin-right: 0.4em;",
            });
            const bcountLabel = h("label", {
                textContent: "No. of combats"
            });
            const repPriceHidden = h("input", {
                type: "hidden",
                name: "rep_price",
                value: "0",
            });
            const leaseTransferImg = h("img", {
                src: "https://dcdn.lordswm.com/i/inv_im/btn_art_transfer.png",
                className: "show_hint inv_item_select_img",
            });
            leaseTransferImg.setAttribute("hint", "Transfer All");
            leaseTransferImg.setAttribute("hwm_hint_added", "1");
            addHints(leaseTransferImg);
            const leaseSubmitBtn = h(
                "button", {
                    className: "inv_item_select inv_item_select_img",
                    type: "submit",
                    style: "border: none; background: none;",
                }, leaseTransferImg
            );
            const leaseFormRow = h("div", {
                className: "lwm_GM_smith_name"
            }, enterNickForLease, leaseSubmitBtn);
            const leaseForm = h(
                "form", {
                    className: "filter_tabs_block_outer",
                    id: "lease-form"
                }, leaseFormRow, h("div", {
                    className: "separator2"
                }), h("div", {
                    className: "lwm_GM_smith_name"
                }, priceInput, priceLabel), h("div", {
                    className: "separator2"
                }), h("div", {}, sendtype1, sendtypeLabel1, sendtype2, sendtypeLabel2), h("div", {
                    className: "separator2"
                }), h("div", {
                    className: "lwm_GM_smith_name"
                }, dtimeInput, dtimeLabel, bcountInput, bcountLabel), repPriceHidden
            );
            leaseForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const form = new FormData(event.target);
                const selectedArts = arts.filter((a) => a.bulk_lease_selected);
                for (const artToSend of selectedArts) {
                    const body = new URLSearchParams();
                    body.set("nick", form.get("nick"));
                    body.set("id", artToSend.id);
                    body.set("sendtype", form.get("sendtype")); // 1 or 2
                    body.set("dtime", form.get("dtime") || "0");
                    body.set("bcount", form.get("bcount") || "0");
                    body.set("art_id", "");
                    body.set("rep_price", "0");
                    body.set("gold", form.get("gold") || "0");
                    body.set("sign", sign);
                    await fetch("https://www.lordswm.com/art_transfer.php", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            referer: `https://www.lordswm.com/art_transfer.php?id=${artToSend.id}`,
                            "content-type": "application/x-www-form-urlencoded",
                        },
                        redirect: "manual",
                        body,
                    }).catch(() => {});
                }
                window.location.reload();
            });
            const backToRepairBtn = h("button", {
                textContent: "Switch to Repairs",
                type: "button",
                style: `
    width: 100%;
    padding: 0.3em;
    font-family: verdana, geneva, arial, sans-serif;
    font-size: 9pt;
    font-weight: bold;
    color: #592c08;
    background: #f4ecd3;
    border: 1px solid #5d413a;
    cursor: pointer;
    text-align: center;
    text-decoration: underline;
  `,
                onclick: () => {
                    mount(repairContainer);
                },
            });
            const leaseContainer = h(
                "div", {
                    className: "container_block_right",
                    id: "lease-sell-container"
                }, h(
                    "div", {
                        className: "container_block"
                    }, h("div", {}, backToRepairBtn), h("div", {
                        className: "separator2"
                    }), h(
                        "div", {
                            className: "arts_predmeti"
                        }, document.createTextNode(`Leasable / Sellable Items: ${leaseArts.length}`)
                    ), h("div", {
                        className: "separator2"
                    }), leaseForm, h("div", {
                        className: "separator2"
                    }), h("div", {
                        className: "inventory_block"
                    }, ...leaseArtElements)
                )
            );
            leaseContainer.style.width = "100%";
            leaseContainer.style.flex = "2";
            leaseContainer.style.height = "fit-content";
            return leaseContainer;
        }

        function addStyle() {
            const style = document.createElement("style");
            style.innerText = `
.lwm_GM_selected_border {
border: 2px solid green;
}.lwm_GM_smith_name {
display: flex;
	align-items: center;
gap: 0.4em;
}.lwm_GM_pricing_table {
width: min-content;
gap: 0.4em 0.4em;
display: grid;
	grid-template-columns: repeat(4, 1fr);
	place-items: center;
}.lwm_GM_pricing_table > button {
padding: 1em;
width: 70px;
border: 1px #5d413a solid;
background: none;
cursor: pointer;
	font-size: 9pt;
color: #592c08;
	font-weight: bold;
	text-decoration: underline;
	font-family: verdana, geneva, arial cyr;
}input.lwm_GM_repair_price {
width: 300px;
background: none;
border: none;
}.inventory_block {
justify-content: flex-start !important;
}
`;
            document.head.appendChild(style);
        }
        addStyle();

        function mount(containerToShow) {
            document.getElementById("repair-container")?.remove();
            document.getElementById("lease-sell-container")?.remove();
            container_inventory.appendChild(containerToShow);
            alwaysShowDurability();
        }

        function alwaysShowDurability() {
            document.querySelectorAll('.art_durability_hidden').forEach(el => {
                el.style.display = 'block';
            });
        }
        alwaysShowDurability();
    }
    // ========== Endless Inventory Sets ==========
    const MORE_INV_SETS_FLAG = 'more_inv_sets_enabled';
    const MORE_INV_SETS_CREATION_FLAG = 'more_inv_sets_create_enabled';

    function injectMoreInvSetsSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(MORE_INV_SETS_FLAG, false);
        const div = document.createElement('div');
        div.id = 'more_inv_sets_settings_wrapper';
        div.innerHTML = `
        <strong>More Inventory Sets</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="more_inv_sets_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable Additional Set slots
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#more_inv_sets_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(MORE_INV_SETS_FLAG, enabled);
            initMoreInvSets();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }

    function initMoreInvSets() {
        if (!getFlag(MORE_INV_SETS_FLAG, false)) return;
        if (!location.pathname.includes('inventory.php')) return;
        'use strict';
        const STORAGE_KEY = 'lwm_custom_inventory_sets';

        function loadSets() {
            return getFlag(STORAGE_KEY, []);
        }

        function saveSets(sets) {
            setFlag(STORAGE_KEY, sets);
        }

        function getEquippedArtifactIds() {
            const equipped = [];
            document.querySelectorAll('[onClick^="javascript: try_undress("]').forEach(el => {
                const match = el.getAttribute('onClick').match(/try_undress\((\d+)\)/);
                if (match) equipped.push(Number(match[1]));
            });
            return equipped;
        }

        function createButton(label, onClick, style = '') {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.className = 'btn_standard inv_cut_text btn_txt_hover';
            btn.style.cursor = 'pointer';
            btn.style.height = '24px';
            btn.style.fontSize = '12px';
            btn.style.fontFamily = 'Arial, Helvetica, sans-serif';
            btn.style.textAlign = 'center';
            btn.style.padding = '0px 6px';
            btn.style.outline = 'none';
            btn.style.border = 'none';
            //btn.title = label;
            if (style) Object.assign(btn.style, style);
            btn.addEventListener('click', onClick);
            return btn;
        }

        function refreshButtons() {
            const container = document.querySelector('#container_inventory > div.container_block_left > div > div.inv_note_kukla');
            if (!container) return;
            const existing = document.getElementById('custom-set-buttons');
            if (existing) existing.remove();
            const wrapper = document.createElement('div');
            wrapper.id = 'custom-set-buttons';
            wrapper.className = 'inv_hidden_block inv_hidden_block_showed';
            const sets = loadSets();
            sets.forEach((set, index) => {
                wrapper.appendChild(createButton(`${set.name}`, () => loadSet(set)));
                wrapper.appendChild(createButton(`Delete ${index+11}`, () => {
                    if (confirm(`Delete set "${set.name}"?`)) {
                        sets.splice(index, 1);
                        saveSets(sets);
                        refreshButtons();
                    }
                }));
            });
            wrapper.appendChild(createButton('Create New Set', () => {
                setFlag(MORE_INV_SETS_CREATION_FLAG, true);
                location.reload();
            }, {
                fontWeight: 'bold',
                title: 'Create a New Custom Set'
            }));
            wrapper.style.display = 'grid';
            wrapper.style.gridTemplateColumns = 'auto auto';
            wrapper.style.gap = '4px 8px';
            container.appendChild(wrapper);
        }

        function callTryDressByIdWithPromise(id) {
            return new Promise((resolve, reject) => {
                const art = Object.values(arts).find(a => a.id == id);
                if (!art) return reject(`Artifact ${id} not found in arts`);
                const k = art.pos_dress;
                const url = `inventory.php?dress=${id}&js=1&last_ring_dress=${last_ring_dress}&rand=${Math.random() * 1000000}`;
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve();
                        } else {
                            reject(`Failed to equip artifact ${id}: ${xhr.status}`);
                        }
                    }
                };
                xhr.send(null);
            });
        }

        function createProgressBox(total) {
            let box = document.createElement('div');
            box.id = 'equipProgressBox';
            box.style.position = 'fixed';
            box.style.top = '50%';
            box.style.left = '50%';
            box.style.transform = 'translate(-50%, -50%)';
            box.style.background = 'rgba(0, 0, 0, 0.85)';
            box.style.color = '#fff';
            box.style.padding = '20px 30px';
            box.style.borderRadius = '10px';
            box.style.zIndex = '1009';
            box.style.fontSize = '16px';
            box.style.fontWeight = 'bold';
            box.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
            box.textContent = `Equipping artifacts... 0 of ${total} equipped`;
            document.body.appendChild(box);
        }

        function updateProgressBox(current, total) {
            const box = document.getElementById('equipProgressBox');
            if (box) box.textContent = `Equipping artifacts... ${current} of ${total} equipped`;
        }

        function removeProgressBox() {
            const box = document.getElementById('equipProgressBox');
            if (box) box.remove();
        }
        async function loadSet(set) {
            const undressBtn = document.getElementById('undress_all_div');
            const ids = set.ids;
            const total = ids.length;
            if (undressBtn) undressBtn.click();
            createProgressBox(total);
            await new Promise(r => setTimeout(r, 1000));
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i];
                try {
                    await callTryDressByIdWithPromise(id);
                    console.log(`Equipped ${id}`);
                } catch (err) {
                    console.warn(err);
                }
                updateProgressBox(i + 1, total);
            }
            console.log("All artifacts attempted.");
            removeProgressBox();
            location.reload();
        }

        function triggerEndlessSets() {
            if (getFlag(MORE_INV_SETS_CREATION_FLAG) === "true") {
                removeFlag(MORE_INV_SETS_CREATION_FLAG);
                const equipped = getEquippedArtifactIds();
                if (equipped.length === 0) {
                    alert("No artifacts are currently equipped.");
                    return;
                }
                const name = prompt("Enter a name for this set:");
                if (!name) return;
                const sets = getFlag(STORAGE_KEY, []);
                sets.push({
                    name,
                    ids: equipped
                });
                setFlag(STORAGE_KEY, sets);
                alert("Set saved successfully!");
            }
            refreshButtons();
        }
        if (document.readyState === "complete") {
            triggerEndlessSets();
        } else {
            window.addEventListener("load", () => {
                triggerEndlessSets();
            });
        }
    }
    // ========== Master Panel Visibility ==========
    const MASTER_PANEL_FLAG = 'master_panel_enabled';
    //if (!getFlag(MASTER_PANEL_FLAG, true)) return;
    function injectMasterPanelSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(MASTER_PANEL_FLAG, true); //defaults to true
        const div = document.createElement('div');
        div.id = 'master_panel_settings_wrapper';
        div.innerHTML = `
        <strong>Master Panel</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="master_panel_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable the Floating Window Panel
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#master_panel_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            if (enabled == false) {
                const confirmInput = prompt(
                    "Disabling the panel will hide the entire Schedules window and the settings button. " +
                    "You must go to the www.lordswm.com/pers_navlinks.php to re-enable the Master Panel. " +
                    "If understood, type \"navlinks\" in the box."
                );
                if (confirmInput === 'navlinks') {
                    setFlag(MASTER_PANEL_FLAG, enabled);
                    createPanel();
                } else {
                    // User canceled or typed wrong → revert checkbox to checked
                    e.target.checked = true;
                }
            } else {
                setFlag(MASTER_PANEL_FLAG, enabled);
                createPanel();
            }
        });
    }
    // ========== Battle Tooltip ==========
    /*
	const BATTLE_TOOLTIP_FLAG = 'battle_tooltip_enabled';

    function injectBattleTooltipSettings() {
        const container = document.getElementById('lwm-settings-list');
        const setCheckerEnabled = getFlag(BATTLE_TOOLTIP_FLAG, false);

        const div = document.createElement('div');
        div.id = 'battle_tooltip_settings_wrapper';
        div.innerHTML = `
        <strong>Battle Tooltip</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="battle_tooltip_enable_checkbox" ${setCheckerEnabled ? 'checked' : ''}>
            Enable melee and magic damage helper
        </label>
    `;

        container.appendChild(div);
        div.querySelector('#battle_tooltip_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(BATTLE_TOOLTIP_FLAG, enabled);
			initBattleDamageCalcTooltips();
            //setTimeout(() => location.reload(), STANDARD_DELAY);
        });
    }
*/
    // ========== Helper ==========
    const STANDARD_WAIT = 1000; // 1 second wait between checks
    const STANDARD_PROGRESS_WAIT = 600000; // 10 minutes wait for the button to appear

    function onSafeLoad(callback) {
        if (document.readyState === "complete") {
            console.log(`Detected page ${window.location.pathname}`);
            callback();
        } else {
            window.addEventListener('load', () => {
                console.log(`Detected page ${window.location.pathname}`);
                callback();
            });
        }
    }
    async function overwriteErrors() {
        //only run this on pages like war.php
        if (window.location.pathname !== '/war.php') return;
        const enabled1 = getFlag(BATTLE_ENDER_HELPER_FLAG, BATTLE_ENDER_HELPER_DEFAULT);
        if (!enabled1) return;
        window.alert = function(msg) {
            console.warn('[Suppressed alert]:', msg);
        };
        window.onerror = function(msg, url, line, col, error) {
            console.error('[Global Error Caught]', msg, url, line);
            setTimeout(() => {
                location.href = 'https://www.lordswm.com/home.php';
            }, 5000);
            return true;
        };
    }

    function randomSmallDelay(baseMs) {
        const extra = Math.floor(Math.random() * 500); // 0 - .5 seconds
        return baseMs + extra;
    }

    // ========== Master Sets One Click ==========
    const MASTER_SETS_FLAG = 'master_sets_enabled';
    const MASTER_SETS_KEY = 'master_sets_saved';
    const MASTER_SETS_CONFIG_FLAG = 'master_sets_config_enabled';
    /*const MASTER_SETS_SAVED = {
        set1: {
            setName: 'PvE Unholy Necro',
            factionUrl: 'https://www.lordswm.com/castle.php?change_clr_to=102&sign=82aa055b32582436ff448b527ad433bf',
            equipUrl: 'https://www.lordswm.com/inventory.php?all_on=3',
            talentUrl: 'https://www.lordswm.com/skillwheel.php?setuserperk=1&prace=102&buildid=13',
            recruitMainUrl: 'https://www.lordswm.com/army_apply.php?action=load_set&sign=82aa055b32582436ff448b527ad433bf&set_id=2',
            recruitTempUrl: 'https://www.lordswm.com/army_apply.php?action=load_set&sign=82aa055b32582436ff448b527ad433bf&set_id=1',
            characterUrl: 'https://www.lordswm.com/pl_info.php?id=6736731'
        },
        set2: {
            setName: 'PvE Hunter Elf',
            factionUrl: 'https://www.lordswm.com/castle.php?change_clr_to=4&sign=82aa055b32582436ff448b527ad433bf',
            equipUrl: 'https://www.lordswm.com/inventory.php?all_on=3',
            talentUrl: 'https://www.lordswm.com/skillwheel.php?setuserperk=1&prace=4&buildid=5',
            recruitMainUrl: 'https://www.lordswm.com/army_apply.php?action=load_set&sign=82aa055b32582436ff448b527ad433bf&set_id=1',
            recruitTempUrl: 'https://www.lordswm.com/army_apply.php?action=load_set&sign=82aa055b32582436ff448b527ad433bf&set_id=2',
            characterUrl: 'https://www.lordswm.com/pl_info.php?id=6736731'
        }
    };*/
    async function MasterSetsButtonsPanel() {
        //if (window.location.pathname === '/war.php') return;
        if (!getFlag(MASTER_SETS_FLAG, true)) return;
        const MASTER_SETS_SAVED = getFlag(MASTER_SETS_KEY, {});
        const container = document.querySelector('#lwm-modules');
        if (!container) return console.warn("Master Panel not found!");
        for (const [key, savedset] of Object.entries(MASTER_SETS_SAVED)) {
            const div = document.createElement('div');
            div.className = 'lwm-module';
            div.id = 'master_sets_panel_module';
            div.innerHTML = `
            <div>
                 <span><strong>Build: <span id="master_sets_display-${key}">Loading...</span></strong></span>
            </div>
        `;
            container.appendChild(div);
            let statusEl = div.querySelector(`#master_sets_display-${key}`);
            const factionUrl = savedset.factionUrl;
            const equipUrl = savedset.equipUrl;
            const talentUrl = savedset.talentUrl;
            const recruitMainUrl = savedset.recruitMainUrl;
            const recruitTempUrl = savedset.recruitTempUrl;
            const setName = savedset.setName;
            statusEl.textContent = setName;
            async function runFetches() {
                try {
                    statusEl.textContent = setName + ' 0/5';
                    if (equipUrl) {
                        await fetch(equipUrl);
                    }
                    statusEl.textContent = setName + ' 1/5';
                    if (factionUrl) {
                        await fetch(factionUrl);
                    }
                    statusEl.textContent = setName + ' 2/5';
                    if (talentUrl) {
                        await fetch(talentUrl);
                    }
                    statusEl.textContent = setName + ' 3/5';
                    if (recruitTempUrl) {
                        await fetch(recruitTempUrl);
                    }
                    statusEl.textContent = setName + ' 4/5';
                    if (recruitMainUrl) {
                        await fetch(recruitMainUrl);
                    }
                    statusEl.textContent = setName + ' 5/5';
                    location.reload();
                } catch (err) {
                    console.error("Error during fetch sequence:", err);
                }
            }
            statusEl.style.cursor = 'pointer';
            statusEl.title = `Click to Use ${setName} Build`;
            statusEl.addEventListener('click', runFetches);
        }
    }

    function injectMasterSetsSettings() {
        const container = document.getElementById('lwm-settings-list');
        const masterSetsEnabled = getFlag(MASTER_SETS_FLAG, false);
        const masterSetsConfigEnabled = getFlag(MASTER_SETS_CONFIG_FLAG, false);
        const div = document.createElement('div');
        div.id = 'master_sets_settings_wrapper';
        div.innerHTML = `
        <strong>Master Sets</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="master_sets_enable_checkbox" ${masterSetsEnabled ? 'checked' : ''}>
            Show Master Sets
            </label>
            <label>
			<input type="checkbox" class="lwm_custom_checkbox" id="master_sets_config_checkbox" ${masterSetsConfigEnabled ? 'checked' : ''}>
            Config Builds
        </label>
    `;
        container.appendChild(div);
        div.querySelector('#master_sets_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(MASTER_SETS_FLAG, enabled);
            renderModules();
        });
        div.querySelector('#master_sets_config_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(MASTER_SETS_CONFIG_FLAG, enabled);
            initMasterSetsConfig();
        });
    }

    function initMasterSetsConfig() {
        if (!getFlag(MASTER_SETS_CONFIG_FLAG, false)) return;
        // --- Keys ---
        const MASTER_SETS_CREATE_FLAG = 'master_sets_create_flag'; // 0 = none, n = set number being created
        const STEP_KEY = 'master_sets_create_step'; // 1=name, 2=faction, 3=...
        let panel;
        (function runMasterSets() {
            if (!getFlag(MASTER_SETS_FLAG, true)) return;
            // Load sets
            // --- renderMasterSetsPanel ---
            panel = masterSetsConfigPanel();
            renderMasterSetsPanel();
        })();
        // --- UI: Panel ---
        function masterSetsConfigPanel() {
            let panel = document.getElementById('master-sets-config-panel');
            if (panel) return panel;
            panel = document.createElement('div');
            panel.id = 'master-sets-config-panel';
            panel.className = 'lwm_custom_container'
            panel.style.position = 'fixed';
            panel.style.top = '10px';
            panel.style.right = '10px';
            panel.style.width = '240px';
            panel.style.height = "fit-content";
            panel.style.fontSize = '15px';
            panel.style.zIndex = '1002';
            document.body.appendChild(panel);
            return panel;
        }

        function button(label, onClick) {
            const b = document.createElement('button');
            b.textContent = label;
            b.className = 'lwm_custom_button';
            b.style.display = 'block';
            b.addEventListener('click', onClick);
            return b;
        }
        // Find next available set number (fills gaps)
        function getNextSetNumber() {
            const MASTER_SETS_SAVED = getFlag(MASTER_SETS_KEY, {});
            let n = 1;
            while (MASTER_SETS_SAVED[`set${n}`]) n++;
            return n;
        }
        async function renderMasterSetsPanel() {
            const MASTER_SETS_SAVED = getFlag(MASTER_SETS_KEY, {});
            const currentSet = getFlag(MASTER_SETS_CREATE_FLAG, 0);
            const step = getFlag(STEP_KEY, 0);
            panel.innerHTML = `
		<div style="font-weight:700;margin-bottom:6px;">Master Set Configuration</div>
		<div id="master-set-config-body"></div>
		`;
            const body = panel.querySelector('#master-set-config-body');
            // If no active creation
            if (!currentSet || currentSet === 0) {
                // (Optional) show existing sets summary
                if (Object.keys(MASTER_SETS_SAVED).length) {
                    const ul = document.createElement('ul');
                    ul.style.margin = '8px 0 0';
                    ul.style.paddingLeft = '18px';
                    const refreshList = () => {
                        ul.innerHTML = ''; // Clear old list
                        Object.entries(MASTER_SETS_SAVED).forEach(([k, v]) => {
                            const li = document.createElement('li');
                            // Set name
                            const nameSpan = document.createElement('span');
                            nameSpan.textContent = 'Build: ' + v.setName || k;
                            li.appendChild(nameSpan);
                            // Delete button
                            const delBtn = document.createElement('button');
                            delBtn.textContent = '❌'; //❌
                            delBtn.style.cursor = 'pointer';
                            delBtn.style.border = 'none';
                            delBtn.style.background = 'transparent';
                            //delBtn.style.color = 'red';
                            delBtn.style.fontSize = '14px';
                            delBtn.title = 'Delete this Build';
                            delBtn.addEventListener('click', () => {
                                if (confirm(`Delete set "${v.setName || k}"?`)) {
                                    delete MASTER_SETS_SAVED[k];
                                    setFlag(MASTER_SETS_KEY, MASTER_SETS_SAVED);
                                    refreshList(); // Rebuild the list after delete
                                }
                            });
                            li.appendChild(delBtn);
                            ul.appendChild(li);
                        });
                    };
                    refreshList();
                    body.appendChild(ul);
                }
                body.appendChild(button('New Master Set', () => {
                    const setNum = getNextSetNumber();
                    setFlag(MASTER_SETS_CREATE_FLAG, setNum);
                    setFlag(STEP_KEY, 1);
                    renderMasterSetsPanel();
                }));
                return;
            }
            // We are creating setN
            const setKey = `set${currentSet}`;
            const setObj = MASTER_SETS_SAVED[setKey] || {};
            // --- Step 1: Name ---
            if (step === 1) {
                const nameLbl = document.createElement('div');
                nameLbl.textContent = `Creating ${setKey}`;
                const nameInput = document.createElement('input');
                nameInput.type = 'text';
                nameInput.classList.add("lwm_custom_dropdown");
                nameInput.placeholder = 'Enter set name';
                const saveBtn = button('Save Name 1/5', () => {
                    const name = nameInput.value.trim();
                    if (!name) {
                        alert('Please enter a set name first!');
                        return;
                    }
                    MASTER_SETS_SAVED[setKey] = {
                        setName: name,
                        factionUrl: setObj.factionUrl || '',
                        equipUrl: setObj.equipUrl || '',
                        talentUrl: setObj.talentUrl || '',
                        recruitMainUrl: setObj.recruitMainUrl || '',
                        recruitTempUrl: setObj.recruitTempUrl || ''
                    };
                    setFlag(MASTER_SETS_KEY, MASTER_SETS_SAVED);
                    setFlag(STEP_KEY, 2);
                    renderMasterSetsPanel();
                });
                body.appendChild(nameLbl);
                body.appendChild(nameInput);
                body.appendChild(saveBtn);
                return;
            }
            // --- Step 2: Faction URL ---
            if (step === 2) {
                const nameRow = document.createElement('div');
                nameRow.innerHTML = `<div><b>Set Name:</b> ${setObj.setName || setKey}</div>`;
                body.appendChild(nameRow);
                const factionRow = document.createElement('div');
                factionRow.textContent = 'Choose faction:';
                body.appendChild(factionRow);
                const selectfaction = document.createElement('select');
                selectfaction.classList.add("lwm_custom_dropdown");
                selectfaction.style.boxSizing = 'border-box';

                function getFactionOptions() {
                    // Fixed (covers all factions)
                    return [{
                        name: 'Knight',
                        id: '1'
                    }, {
                        name: 'Holy knight',
                        id: '101'
                    }, {
                        name: 'Necromancer',
                        id: '2'
                    }, {
                        name: 'Unholy necromancer',
                        id: '102'
                    }, {
                        name: 'Wizard',
                        id: '3'
                    }, {
                        name: 'Battlewise wizard',
                        id: '103'
                    }, {
                        name: 'Elf',
                        id: '4'
                    }, {
                        name: 'Charmer elf',
                        id: '104'
                    }, {
                        name: 'Barbarian',
                        id: '5'
                    }, {
                        name: 'Fury barbarian',
                        id: '105'
                    }, {
                        name: 'Shadow barbarian',
                        id: '205'
                    }, {
                        name: 'Dark elf',
                        id: '6'
                    }, {
                        name: 'Tamer dark elf',
                        id: '106'
                    }, {
                        name: 'Demon',
                        id: '7'
                    }, {
                        name: 'Darkness demon',
                        id: '107'
                    }, {
                        name: 'Dwarf',
                        id: '8'
                    }, {
                        name: 'Fire dwarf',
                        id: '108'
                    }, {
                        name: 'Tribal',
                        id: '9'
                    }, {
                        name: 'Wrathbringer tribal',
                        id: '109'
                    }, {
                        name: 'Pharaoh',
                        id: '10'
                    }];
                }
                const factions = getFactionOptions();
                factions.forEach(({
                    name,
                    id
                }) => {
                    const opt = document.createElement('option');
                    opt.value = id;
                    opt.textContent = `${name} (${id})`;
                    selectfaction.appendChild(opt);
                });
                const saveFactionBtn = button('Save Faction 2/5', async () => {
                    const chosenId = selectfaction.value;
                    if (!chosenId) {
                        alert('Please pick a faction first.');
                        return;
                    }
                    const signVal = getFlag(PLAYERINFO.signValue, '');
                    if (!signVal) {
                        alert('signValue not found.');
                        return;
                    }
                    const factionUrl = `https://www.lordswm.com/castle.php?change_clr_to=${encodeURIComponent(chosenId)}&sign=${encodeURIComponent(signVal)}`;
                    MASTER_SETS_SAVED[setKey] = MASTER_SETS_SAVED[setKey] || {};
                    MASTER_SETS_SAVED[setKey].factionUrl = factionUrl;
                    setFlag(MASTER_SETS_KEY, MASTER_SETS_SAVED);
                    setFlag(STEP_KEY, 3);
                    await fetch(factionUrl);
                    window.location.href = "https://www.lordswm.com/inventory.php";
                });
                body.appendChild(selectfaction);
                body.appendChild(saveFactionBtn);
                return;
            }
            // --- Step 2: Equip URL ---
            if (step === 3) {
                const nameRow = document.createElement('div');
                nameRow.innerHTML = `<div><b>Set Name:</b> ${setObj.setName || setKey}</div>`;
                body.appendChild(nameRow);
                const factionRow = document.createElement('div');
                factionRow.innerHTML = `<div><b>Faction:</b> ${setObj.factionUrl ? 'Saved ✔' : 'Not saved'}</div>`;
                body.appendChild(factionRow);
                const equipRow = document.createElement('div');
                equipRow.textContent = 'Choose Equipment Set:';
                body.appendChild(equipRow);

                function buildSetDropdown() {
                    const setsContainer = document.querySelector("#inv_expandedBlock");
                    if (!setsContainer) return null;
                    const setDivs = setsContainer.querySelectorAll("[set_div_id]");
                    const dropdown = document.createElement("select");
                    dropdown.id = "equipSetSelect";
                    dropdown.classList.add("lwm_custom_dropdown");
                    setDivs.forEach(div => {
                        const setId = div.getAttribute("set_div_id");
                        const name = div.querySelector("div[or_name]").getAttribute("or_name");
                        const opt = document.createElement("option");
                        opt.value = setId;
                        opt.textContent = name;
                        dropdown.appendChild(opt);
                    });
                    return dropdown;
                }
                const dropdown = buildSetDropdown();
                if (dropdown) body.appendChild(dropdown);
                async function saveEquipUrl() {
                    const setId = dropdown.value;
                    const equipUrl = `https://www.lordswm.com/inventory.php?all_on=${setId}`;
                    try {
                        const resp = await fetch(equipUrl, {
                            credentials: "include"
                        });
                        if (!resp.ok) throw new Error("Failed to equip set");
                        MASTER_SETS_SAVED[setKey] = MASTER_SETS_SAVED[setKey] || {};
                        MASTER_SETS_SAVED[setKey].equipUrl = equipUrl;
                        setFlag(MASTER_SETS_KEY, MASTER_SETS_SAVED);
                        setFlag(STEP_KEY, 4);
                        window.location.href = "https://www.lordswm.com/skillwheel.php";
                    } catch (e) {
                        alert(`Error equipping set: ${e.message}`);
                    }
                }
                const saveBtn = button("Save Equipment 3/5", saveEquipUrl);
                panel.appendChild(saveBtn);
                async function skipEquipUrl() {
                    try {
                        setFlag(STEP_KEY, 4);
                        window.location.href = "https://www.lordswm.com/skillwheel.php";
                    } catch (e) {
                        alert(`Error equipping set: ${e.message}`);
                    }
                }
                const skipBtn = button("Skip this step", skipEquipUrl);
                panel.appendChild(skipBtn);
                return;
            }
            // --- Step 4: Talent URL ---
            if (step === 4) {
                const nameRow = document.createElement('div');
                nameRow.innerHTML = `<div><b>Set Name:</b> ${setObj.setName || setKey}</div>`;
                body.appendChild(nameRow);
                const factionRow = document.createElement('div');
                factionRow.innerHTML = `<div><b>Faction:</b> ${setObj.factionUrl ? 'Saved ✔' : 'Not saved'}</div>`;
                body.appendChild(factionRow);
                const equipRow = document.createElement('div');
                equipRow.innerHTML = `<div><b>Artefact set:</b> ${setObj.equipUrl ? 'Saved ✔' : 'Not saved'}</div>`;
                body.appendChild(equipRow);
                const talentRow = document.createElement('div');
                talentRow.innerHTML = `<div>Choose Talent preset:<br> (NOTE: Player made talent sets only.
                    Also make sure all stat points are assigned before saving the talent.)</div>`;
                body.appendChild(talentRow);

                function buildTalentDropdown() {
                    if (!Array.isArray(builds)) return null;
                    const dropdown = document.createElement("select");
                    dropdown.id = "talentSetSelect";
                    dropdown.classList.add("lwm_custom_dropdown");
                    // Filter to only user-created builds
                    const userBuilds = builds.filter(build => build.isuser === 1);
                    if (userBuilds.length === 0) {
                        const opt = document.createElement("option");
                        opt.value = "";
                        opt.textContent = "No builds found";
                        opt.disabled = true;
                        opt.selected = true;
                        dropdown.appendChild(opt);
                        dropdown.disabled = true; // Disable the dropdown itself
                    } else {
                        userBuilds.forEach(build => {
                            const opt = document.createElement("option");
                            opt.value = build.btype;
                            opt.textContent = build.name;
                            dropdown.appendChild(opt);
                        });
                    }
                    return dropdown;
                }
                const dropdown = buildTalentDropdown();
                if (dropdown) body.appendChild(dropdown);
                async function saveTalentUrl() {
                    try {
                        const buildId = dropdown.value;
                        const praceMatch = setObj.factionUrl.match(/change_clr_to=(\d+)/);
                        if (!praceMatch) throw new Error("Failed to extract faction number");
                        const prace = praceMatch[1];
                        const talentUrl = `https://www.lordswm.com/skillwheel.php?setuserperk=1&prace=${prace}&buildid=${buildId}`;
                        const resp = await fetch(talentUrl, {
                            credentials: "include"
                        });
                        if (!resp.ok) throw new Error("Failed to apply talent build");
                        MASTER_SETS_SAVED[setKey] = MASTER_SETS_SAVED[setKey] || {};
                        MASTER_SETS_SAVED[setKey].talentUrl = talentUrl;
                        setFlag(MASTER_SETS_KEY, MASTER_SETS_SAVED);
                        setFlag(STEP_KEY, 5);
                        window.location.href = "https://www.lordswm.com/army.php";
                    } catch (e) {
                        alert(`Error applying talent build: ${e.message}`);
                    }
                }
                const saveBtn = button("Save Talent 4/5", saveTalentUrl);
                panel.appendChild(saveBtn);
                async function skipEquipUrl() {
                    try {
                        setFlag(STEP_KEY, 5);
                        window.location.href = "https://www.lordswm.com/army.php";
                    } catch (e) {
                        alert(`Error equipping set: ${e.message}`);
                    }
                }
                const skipBtn = button("Skip this step", skipEquipUrl);
                panel.appendChild(skipBtn);
                return;
            }
            // --- Step 4: Recruit URL ---
            if (step === 5) {
                const nameRow = document.createElement('div');
                nameRow.innerHTML = `<div><b>Set Name:</b> ${setObj.setName || setKey}</div>`;
                body.appendChild(nameRow);
                const factionRow = document.createElement('div');
                factionRow.innerHTML = `<div><b>Faction:</b> ${setObj.factionUrl ? 'Saved ✔' : 'Not saved'}</div>`;
                body.appendChild(factionRow);
                const equipRow = document.createElement('div');
                equipRow.innerHTML = `<div><b>Artefact set:</b> ${setObj.equipUrl ? 'Saved ✔' : 'Not saved'}</div>`;
                body.appendChild(equipRow);
                const talentRow = document.createElement('div');
                talentRow.innerHTML = `<div><b>Talent set:</b> ${setObj.talentUrl ? 'Saved ✔' : 'Not saved'}</div>`;
                body.appendChild(talentRow);
                const recruitRow = document.createElement('div');
                recruitRow.innerHTML = `<div>Choose Recruitment set: </div>`;
                body.appendChild(recruitRow);

                function buildRecruitDropdown() {
                    const recruitOptions = [{
                        name: 'Set 1',
                        id: '1'
                    }, {
                        name: 'Set 2',
                        id: '2'
                    }, {
                        name: 'Set 3',
                        id: '3'
                    }, {
                        name: 'Set 4',
                        id: '4'
                    }, {
                        name: 'Set 5',
                        id: '5'
                    }, {
                        name: 'Set 6',
                        id: '6'
                    }, {
                        name: 'Set 7',
                        id: '7'
                    }];
                    const dropdown = document.createElement("select");
                    dropdown.id = "recruitSetSelect";
                    dropdown.classList.add("lwm_custom_dropdown");
                    recruitOptions.forEach(optData => {
                        const opt = document.createElement("option");
                        opt.value = optData.id;
                        opt.textContent = optData.name;
                        dropdown.appendChild(opt);
                    });
                    return dropdown;
                }
                const dropdown = buildRecruitDropdown();
                if (dropdown) body.appendChild(dropdown);
                async function saveRecruitUrl() {
                    const setId = dropdown.value;
                    const signVal = getFlag(PLAYERINFO.signValue, '');
                    if (!signVal) {
                        //console.warn('PLAYERINFO.signValue not found; saving without sign (placeholder).');
                        alert('signValue not found.');
                        return;
                    }
                    const recruitMainUrl = `https://www.lordswm.com/army_apply.php?action=load_set&sign=${signVal}&set_id=${setId}`;
                    let recruitTempUrl = `https://www.lordswm.com/army_apply.php?action=load_set&sign=${signVal}&set_id=1`;
                    if (setId == 1) {
                        recruitTempUrl = `https://www.lordswm.com/army_apply.php?action=load_set&sign=${signVal}&set_id=2`;
                    }
                    try {
                        const resp = await fetch(recruitTempUrl, {
                            credentials: "include"
                        });
                        if (!resp.ok) throw new Error("Failed to recruit set");
                        const resp2 = await fetch(recruitMainUrl, {
                            credentials: "include"
                        });
                        if (!resp2.ok) throw new Error("Failed to recruit set");
                        MASTER_SETS_SAVED[setKey] = MASTER_SETS_SAVED[setKey] || {};
                        MASTER_SETS_SAVED[setKey].recruitMainUrl = recruitMainUrl;
                        MASTER_SETS_SAVED[setKey].recruitTempUrl = recruitTempUrl;
                        setFlag(MASTER_SETS_KEY, MASTER_SETS_SAVED);
                        setFlag(STEP_KEY, 0);
                        setFlag(MASTER_SETS_CREATE_FLAG, 0);
                        location.reload();
                    } catch (e) {
                        alert(`Error recruiting set: ${e.message}`);
                    }
                }
                const saveBtn = button("Save Recruit set 5/5", saveRecruitUrl)
                panel.appendChild(saveBtn);
                async function skipEquipUrl() {
                    try {
                        setFlag(STEP_KEY, 0);
                        setFlag(MASTER_SETS_CREATE_FLAG, 0);
                        window.location.href = "https://www.lordswm.com/skillwheel.php";
                    } catch (e) {
                        alert(`Error equipping set: ${e.message}`);
                    }
                }
                const skipBtn = button("Skip this step", skipEquipUrl);
                panel.appendChild(skipBtn);
                return;
            }
        }
    }
    // ========== Job Searcher ==========
    const FETCH_DELAY = 500; // ms between adjacent location fetches
    const JOB_SEARCHER_ENABLED = 'job_searcher_enabled';
    const JOB_SEARCHER_RUNNING_FLAG = 'job_searcher_running';
    const JOB_SEARCHER_MININUM_WAGE = 'job_searcher_minimum_wage';
    const JOB_SEARCHER_SEARCH_RANGE = 'job_searcher_search_range';
    const JOB_SEARCHER_FLAG = 'job_searcher_triggered_map'; //fw_auto_click_dbut0
    let MINIMUM_WAGE = parseInt(getFlag(JOB_SEARCHER_MININUM_WAGE, '180'), 10); // Change this to adjust the the minimum wage cutoff
    let SEARCH_RANGE = parseInt(getFlag(JOB_SEARCHER_SEARCH_RANGE, '2'), 10); //change this to adjust search radius
    const WORK_PAGES = [{
        code: 'sh',
        name: 'Production'
    }, {
        code: 'fc',
        name: 'Processing'
    }, {
        code: 'mn',
        name: 'Mining'
    }, ];
    const VALID_LOCATIONS = [
        "48,48", "49,48", "50,48", "51,48", "52,48",
        "48,49", "49,49", "50,49", "51,49", "52,49", "53,49",
        "48,50", "49,50", "50,50", "51,50", "52,50", "53,50",
        "49,51", "50,51", "51,51",
        "49,52", "50,52", "51,52",
        "51,53", "52,53",
        "52,54"
    ];

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function parseMapCoordsFromDOM() {
        const links = [...document.querySelectorAll('a[href*="map.php?cx="]')];
        for (const link of links) {
            const match = link.href.match(/cx=(\d+)&cy=(\d+)/);
            if (match) {
                const coords = `${match[1]},${match[2]}`;
                // console.log('[Map Scan] Found map coords from link:', coords);
                return coords;
            }
        }
        return null;
    }

    function getAdjacentCoords(cx, cy) {
        const adj = [];
        const deltas = [];
        for (let dx = -SEARCH_RANGE; dx <= SEARCH_RANGE; dx++) {
            for (let dy = -SEARCH_RANGE; dy <= SEARCH_RANGE; dy++) {
                if (dx === 0 && dy === 0) continue;
                deltas.push([dx, dy]);
            }
        }
        // Sort deltas by Manhattan distance from (0,0) so closest ones come first
        deltas.sort((a, b) => {
            const distA = Math.abs(a[0]) + Math.abs(a[1]);
            const distB = Math.abs(b[0]) + Math.abs(b[1]);
            return distA - distB;
        });
        for (const [dx, dy] of deltas) {
            const newCx = cx + dx;
            const newCy = cy + dy;
            const coordStr = `${newCx},${newCy}`;
            if (VALID_LOCATIONS.includes(coordStr)) {
                adj.push(coordStr);
            }
        }
        return adj;
    }
    async function checkWorkPagesInLocation(cx, cy) {
        for (const page of WORK_PAGES) {
            //skip mining pages if minimum wage is more than 200
            if (page.code === 'mn' && MINIMUM_WAGE >= 200) continue;
            const url = `/map.php?cx=${cx}&cy=${cy}&st=${page.code}`;
            // console.log(`[Check] (${cx},${cy}) ${page.code}: Fetching: ${url}`);
            const resp = await fetch(url);
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const rows = [...doc.querySelectorAll('tr.map_obj_table_hover')];
            for (const row of rows) {
                const wageCell = row.querySelector('td:nth-child(4)');
                const arrowLink = row.querySelector('td:last-child a');
                const link = arrowLink?.href;
                const isOpen = arrowLink?.innerHTML.includes('»»»') && !arrowLink.innerHTML.includes('#E65054');
                if (wageCell && isOpen && link?.includes('object-info.php')) {
                    const wage = parseInt(wageCell.textContent.replace(/[^\d]/g, ''), 10);
                    // console.log(`[Check] (${cx},${cy}) ${page.code}: Wage: ${wage}, Link: ${link}, Open: ${isOpen}`);
                    if (wage >= MINIMUM_WAGE) {
                        return {
                            link,
                            cx,
                            cy
                        };
                    }
                } else {
                    //  console.log(`[Skip] (${cx},${cy}) ${page.code}: Skipping row — Open: ${isOpen}, Wage Cell: ${wageCell?.textContent}`);
                }
            }
        }
        return null;
    }

    function updateLaborerStatus(text) {
        const statusField = document.getElementById('status-laborers');
        if (statusField) statusField.textContent = text;
    }
    async function findAndGoToWorkFacility() {
        if (!getFlag(JOB_SEARCHER_RUNNING_FLAG, false)) {
            //console.warn("[JobSearcher] Aborted — not running.");
            updateLaborerStatus("🛑 Job search stopped.");
            setFlag(JOB_SEARCHER_RUNNING_FLAG, false);
            return;
        }
        let cx = null,
            cy = null;
        updateLaborerStatus(`🔍 Searching initiated`);
        const url = new URL(location.href);
        if (url.pathname === '/map.php' && url.searchParams.has('cx') && url.searchParams.has('cy')) {
            cx = parseInt(url.searchParams.get('cx'), 10);
            cy = parseInt(url.searchParams.get('cy'), 10);
            //  console.log(`[Current] On map with coords: ${cx},${cy}`);
        } else {
            // Try to find from links on map.php
            const resp = await fetch('/map.php');
            const html = await resp.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = [...doc.querySelectorAll('a[href*="map.php?cx="]')];
            for (const link of links) {
                const match = link.href.match(/cx=(\d+)&cy=(\d+)&st=[^&]+/);
                if (match) {
                    cx = parseInt(match[1], 10);
                    cy = parseInt(match[2], 10);
                    //   console.log(`[Map Fallback] Parsed coords: ${cx},${cy}`);
                    break;
                }
            }
        }
        if (cx == null || cy == null) {
            alert('Current location not found.');
            setFlag(JOB_SEARCHER_RUNNING_FLAG, false);
            return;
        }
        const currentResult = await checkWorkPagesInLocation(cx, cy);
        if (currentResult) {
            //  console.log(`[Success] Valid job found in current location: ${currentResult.link}`);
            window.location.href = currentResult.link;
            return;
        }
        //  console.log('[Info] No valid facility found in current location. Checking adjacent...');
        const adjacentCoords = getAdjacentCoords(cx, cy);
        for (let i = 0; i < adjacentCoords.length; i++) {
            if (!getFlag(JOB_SEARCHER_RUNNING_FLAG, false)) return; // user stopped mid-loop
            const coord = adjacentCoords[i];
            const [adjCx, adjCy] = coord.split(',').map(Number);
            updateLaborerStatus(`🔍 Searching ${i + 1} out of ${adjacentCoords.length}`);
            const result = await checkWorkPagesInLocation(adjCx, adjCy);
            if (result) {
                updateLaborerStatus(`✅ Job found at ${coord}`);
                setFlag(JOB_SEARCHER_FLAG, 'another location');
                window.location.href = `/map.php?cx=${adjCx}&cy=${adjCy}`;
                return;
            }
            await sleep(FETCH_DELAY); // 💤 Delay between fetches
        }
        updateLaborerStatus(`❌ No jobs found nearby.`);
        setFlag(JOB_SEARCHER_RUNNING_FLAG, false);
        const wageInput = prompt('No valid jobs found, Change minimum wage? (recommend 160):', MINIMUM_WAGE);
        if (wageInput === null || wageInput > 215) // User cancelled
        {
            const rangeInput = prompt('Change Search range instead? (recommend 3):', SEARCH_RANGE);
            if (rangeInput === null) return; // User cancelled
            const userRange = parseInt(rangeInput, 10);
            if (!isNaN(userRange)) SEARCH_RANGE = userRange;
        }
        const userWage = parseInt(wageInput, 10);
        if (!isNaN(userWage)) MINIMUM_WAGE = userWage;
        findAndGoToWorkFacility();
    }
    //status-laborers
    async function toggleJobSearcher() {
    const isRunning = getFlag(JOB_SEARCHER_RUNNING_FLAG, false);

    if (isRunning) {
        // 🛑 Stop the loop manually
        setFlag(JOB_SEARCHER_RUNNING_FLAG, false);
        updateLaborerStatus("🛑 Search stopped.");
        console.log("[JobSearcher] Stopped by user.");
        return;
    }

    // ✅ Start the loop
    setFlag(JOB_SEARCHER_RUNNING_FLAG, true);
    updateLaborerStatus("🚀 Job Search started...");
    console.log("[JobSearcher] Starting job search...");
    void findAndGoToWorkFacility();
    }
    function initJobSearcher() {
        // If redirected to map location, start traveling
        if (
            window.location.pathname === '/map.php' &&
            window.location.search.includes('cx=') &&
            getFlag(JOB_SEARCHER_FLAG) === 'another location'
        ) {
            updateLaborerStatus('🧭 Initiating travel.');
            setTimeout(() => {
                const btn = document.querySelector('#dbut0');
                if (btn) {
                    btn.click();
                } else {
                    updateLaborerStatus('⚠️ Travel button not found');
                }
                setFlag(JOB_SEARCHER_FLAG, 'travelling');
            }, 1000);
        }
        // When already in map.php and in 'travelling' mode
        else if (
            window.location.pathname === '/map.php' &&
            getFlag(JOB_SEARCHER_FLAG) === 'travelling'
        ) {
            const travelingNotice = document.querySelector('.map_moving_text_style');
            const isTraveling =
                travelingNotice &&
                travelingNotice.textContent.includes('During the journey you have access to');
            if (isTraveling) {
                // 🛑 Still traveling — don’t auto-trigger yet
                updateLaborerStatus('🧭 Traveling to Facility');
                console.log('[JobSearcher] Player is traveling, skipping auto-trigger.');
                const mod = MODULES.hunt;
                setFlag(mod.timerKey, `Reset due to Travel`);
                return;
            } else {
                updateLaborerStatus('📍 Arrived, searching facility');
            }
            setTimeout(() => {
                // Check if the player is currently in the middle of travel
                // ✅ Not traveling — safe to auto-trigger
                // console.log('[JobSearcher] Travel ended, triggering findAndGoToWorkFacility()...');
                findAndGoToWorkFacility();
            }, 1000);
        }
        // Reset when player lands on work facility page
        else if (location.pathname.startsWith('/object-info.php')) {
            setFlag(JOB_SEARCHER_RUNNING_FLAG, false);
        }
        else {
            setFlag(JOB_SEARCHER_RUNNING_FLAG, false);
        }
    }

    function injectJobSearcherSettings() {
        const container = document.getElementById('lwm-settings-list');
        const jobSearcherEnabled = getFlag(JOB_SEARCHER_ENABLED, false);
        const savedWage = getFlag(JOB_SEARCHER_MININUM_WAGE, '');
        const savedRange = getFlag(JOB_SEARCHER_SEARCH_RANGE, '');
        const div = document.createElement('div');
        div.id = 'job_searcher_settings_wrapper';
        div.innerHTML = `
        <strong>Job Search</strong>
        <label>
            <input type="checkbox" class="lwm_custom_checkbox" id="job_searcher_enable_checkbox" ${jobSearcherEnabled ? 'checked' : ''}>
        </label>
        <label>Min. Wage:
            <input type="number" class="lwm_custom_checkbox" id="job_searcher_wage_input" placeholder="180" value="${savedWage}" style="width: 50px"/>
        </label>
        <label>Search Range:
            <input type="number" class="lwm_custom_checkbox" id="job_searcher_range_input" placeholder="2" value="${savedRange}" style="width: 30px" maxlength="1" size="1" pattern="\\d{1,5}" />
        </label>
    `;
        container.appendChild(div);
        // Checkbox toggle
        div.querySelector('#job_searcher_enable_checkbox').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            setFlag(JOB_SEARCHER_ENABLED, enabled);
        });
        // Input for Wage threshold
        div.querySelector('#job_searcher_wage_input').addEventListener('change', (e) => {
            const val = e.target.value.trim();
            const num = parseInt(val, 10);
            if (num >= 0 && num <= 215) {
                setFlag(JOB_SEARCHER_MININUM_WAGE, num);
            } else {
                alert("Invalid Minimum Wage. Must be 215 or less.");
                e.target.value = '';
            }
        });
        // Input for Search Range
        div.querySelector('#job_searcher_range_input').addEventListener('change', (e) => {
            const val = e.target.value.trim();
            const num = parseInt(val, 10);
            if (num >= 1 && num <= 6) {
                setFlag(JOB_SEARCHER_SEARCH_RANGE, num);
            } else {
                alert("Invalid Search Range. Enter a number from 1 to 6.");
                e.target.value = '';
            }
        });
    }

    // ========== New Module ==========
    // ========== New Module ==========
    async function renderOtherModules() {
        incomingArtPanel();
        setCheckerPanel();
        MasterSetsButtonsPanel();
    }

    function renderOtherSettings() {
        injectMasterPanelSettings();
        injectSetCheckerSettings();
        injectRationalAuctionsSettings();
        injectRationalSellerSettings();
        injectDarkModeSettings();
        injectInvToLotSettings();
        injectIncomingArtSettings();
        injectBulkTransferSettings();
        injectMoreInvSetsSettings();
        injectMasterSetsSettings();
        injectHGMGThresholdSettings();
        injectJobSearcherSettings();
        //injectBattleTooltipSettings(); didnt work.
        injectLegFarmerSettings();
        injectBattleEnderSettings();
    }
    // ========== Start ==========
    function injectFloatingPanelStyles() {
        if (!document.querySelector('style[data-injected="floating_panel"]')) {
            const style = document.createElement('style');
            style.setAttribute('data-injected', 'floating_panel');
            style.textContent = `
		/* Main container styled like sh_dd_container */
.lwm_custom_container {
    z-index: 1000;
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: inline-block;
    padding: .5em .5em 1em .5em;
    background:
        url(https://www.lordswm.com/i/new_top/mm_dd_decorS.png) no-repeat,
        url(https://www.lordswm.com/i/new_top/mm_dd_decorS.png) no-repeat,
        url(https://www.lordswm.com/i/new_top/mm_dd_tile.jpg) top left,
        #314657;
    background-position:
        -32px 100%,
        calc(100% + 32px) 100%,
        top left;
    background-size:
        64px 16px,
        64px 16px,
        auto;
    border-radius: 6px;
    box-shadow:
        inset 0 0 4px rgba(0,0,0,.5),
        inset 0 0 0 1px #e2b77d,
        0 1px 7px rgba(0,0,0,.7);
    color: #fad49f;
    font-family: Arial, sans-serif;
    font-size: 12px;
    min-width: 180px;
}

/* Decorative elements
.lwm_custom_decor_top {
    width: 20px;
    height: 20px;
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(https://www.lordswm.com/i/new_top/mm_decor3.png) no-repeat center;
}
.lwm_custom_decor_bottom {
    width: 8px;
    height: 8px;
    position: absolute;
    bottom: 1px;
    left: 50%;
    transform: translate(-50%, 50%);
    background: url(https://www.lordswm.com/i/new_top/mm_decor2.png) no-repeat center;
} */

/* Header */
.lwm_custom_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    margin-bottom: 4px;
    cursor: pointer;
}
/* Each module/row block */
.lwm_custom_module {
    min-width: 145px;
    color: #fad49f;
    cursor: pointer;
    padding: .5em;
    margin: 5px 8px;
    text-align: center;
    background-color: #866c4f;
    border-radius: 4px;
    transition-duration: .1s;
    box-shadow:
        inset 0 0 0 1px #e2b77d,
        inset 0 0 4px rgba(0,0,0,.5),
        inset 0 -13px 5px rgba(0,0,0,.4),
        0 1px 7px rgba(0,0,0,.7);
    text-shadow: 0 0 5px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,1);
}
.lwm_custom_module:hover {
    filter: brightness(110%);
    box-shadow:
        0 0 10px #fad49f,
        inset 0 0 0 1px #fad49f,
        inset 0 0 4px rgba(0,0,0,.5),
        inset 0 -5px 10px rgba(0,0,0,.4),
        0 1px 7px rgba(0,0,0,.7);
}
/* Custom Buttons popup */
.lwm_custom_button {
    display: inline-block;
    min-width: 20px;
    padding: .5em;
    margin: 5px 8px;
    text-align: center;
    background-color: #866c4f;
    border-radius: 4px;
    border: none;
    outline: none;
    color: #fad49f;
    font-family: Arial, sans-serif;
    font-size: 15px;
    cursor: pointer;
    text-shadow: 0 0 5px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,1);
    box-shadow:
        inset 0 0 0 1px #e2b77d,
        inset 0 0 4px rgba(0,0,0,.5),
        inset 0 -13px 5px rgba(0,0,0,.4),
        0 1px 7px rgba(0,0,0,.7);
    transition-duration: .1s;
}
.lwm_custom_button:hover {
    filter: brightness(110%);
    box-shadow:
        0 0 10px #fad49f,
        inset 0 0 0 1px #fad49f,
        inset 0 0 4px rgba(0,0,0,.5),
        inset 0 -5px 10px rgba(0,0,0,.4),
        0 1px 7px rgba(0,0,0,.7);
}
.lwm_custom_button:active {
    filter: brightness(90%);
    transform: scale(0.98);
}
/* Wrapper so checkbox + label stay clickable */
.lwm_custom_checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 3px 0;
    gap: 6px;
    color: #fad49f;
    font-size: 13px;
    user-select: none;
}

/* Base checkbox look */
.lwm_custom_checkbox {
    appearance: none;
    width: 15px;
    height: 15px;
    margin-right: 3px;
    margin-left: 3px;
    vertical-align: middle;
    border: 1px solid #e2b77d;
    border-radius: 3px;
    background-color: #4e3b2c;
    cursor: pointer;
    position: relative;
    display: inline-block;
    text-align: center;
    font-size: 15px;
    color: #fad49f;
}

/* Show ❌ by default */
.lwm_custom_checkbox::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
}

/* Checked state shows ✔️ */
.lwm_custom_checkbox:checked::before {
    content: "✔️";
}

/* Hover effect */
.lwm_custom_checkbox:hover {
    filter: brightness(110%);
    box-shadow: 0 0 5px #fad49f;
}
/* custom dropdown */
.lwm_custom_dropdown {
    background-color: #4e3b2c;
    color: #fad49f;
    border: 1px solid #e2b77d;
    border-radius: 4px;
    padding: 4px 8px;
    margin: 5px 8px;
    cursor: pointer;
    font-size: 14px;
    text-shadow: 0 0 3px rgba(0,0,0,0.7);
    box-shadow:
        inset 0 0 0 1px #e2b77d,
        inset 0 0 4px rgba(0,0,0,.5),
        0 1px 4px rgba(0,0,0,.7);
    transition: 0.2s;
}

.lwm_custom_dropdown:hover {
    filter: brightness(110%);
    box-shadow: 0 0 5px #fad49f, inset 0 0 0 1px #fad49f;
}

.lwm_custom_dropdown option {
    background-color: #4e3b2c;
    color: #fad49f;
}

/* Settings popup */
.lwm_custom_popup_centered {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #e2b77d;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 1001;
    min-width: 405px;
    max-width: 500px;
    width : fit-content;
    height : fit-content;
    min-height: 50px;
    max-height: 2000px;
    box-shadow: 0 0 10px rgba(0,0,0,0.7);
    font-size: 15px;
}
`;
            document.head.appendChild(style);
        }
    }
    async function initSchedulesPanel() {
            if (window.location.pathname === '/pers_navlinks.php') {
                const form = document.querySelector('form[name="tt"]');
                if (!form) return;
                const container = document.createElement('div');
                container.style.marginTop = '20px';
                container.innerHTML = `
                <strong>LWM Scheduler Module Settings</strong>
                <div id="lwm-settings-list"></div>
            `;
                form.appendChild(container);
                renderSettingsList(); // Same function for the settings
            }
            if (getFlag(MASTER_PANEL_FLAG, true)) {
                await renderModules();
            }
            await initHuntModule();
            await initMGModule();
            await initLaborersModule();
            await initThievesModule();
            await initLeadersModule();
            await initSmithModule();
            await initEnchantModule();
        }
        (async function main() {
            injectFloatingPanelStyles();
            minimized = getFlag('panel_minimized', false);
            if (window.location.pathname === '/war.php') {
                minimized = true;
            }
            if (getFlag(MASTER_PANEL_FLAG, true)) {
                createPanel();
            }
            if (window.location.pathname === '/home.php') {
                detectPremium();
                detectSignValue();
            }
            enableDarkMode();
            inventoryToAuctionLot();
            rationalMarketEnjoyer();
            initbulkTransferArts();
            initMoreInvSets();
            initJobSearcher();
            initMasterSetsConfig();
            await initSchedulesPanel(); //await this because it does perform fetch requests and game doesnt like if you fetch request multiple things at once.
            await initSetChecker(); // await because does fetch
            await incomingTransferAlerts();
            playerSaveCurrentPage();
        })();
})();
// ==UserScript==
// @name         DataAnnotation Power-Up v1
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Includes multi-currency support, togglable filters, a project grabber, and a horrific notification system.
// @author       adonno55
// @match        https://app.dataannotation.tech/workers/payments*
// @match        https://app.dataannotation.tech/workers/projects*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @connect      api.frankfurter.app
// @connect      self
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550050/DataAnnotation%20Power-Up%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/550050/DataAnnotation%20Power-Up%20v1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_PREFIX = "[DataAnnotation Power-Up v1]";
    const ENABLE_DEBUG_LOGGING = true;
    const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$', CHF: 'CHF', CNY: '¥', INR: '₹' };

    const Config = {
        defaults: {
            payThreshold: 25,
            nameFilters: ['chatbot', 'ai', 'model', 'llm'],
            checkInterval: 1,
            enableSound: true,
            enableCurrencyConversion: true,
            targetCurrency: 'GBP',
            includePayPalFee: true,
            paypalFeePercentage: 3.0,
            enablePayFilter: true,
            enableNameFilter: true,
            notifyForHighPay: true,
            notifyForNameMatch: true,
            notifyForOtherNew: true,
            // Project Grabber Settings
            enableProjectGrabber: false, // Defaulted to off for user safety
            grabHighPay: true,
            grabNameMatch: true,
            grabberDelay: 2, // Delay in seconds between opening tabs
            grabberMaxTabs: 1 // Safety limit: max tabs to open in one check cycle
        },
        settings: {},
        async load() {
            const loadedSettings = await GM_getValue('powerUpConfig_v10', {});
            if (typeof loadedSettings.enableUnseenAlerts !== 'undefined') {
                loadedSettings.notifyForOtherNew = loadedSettings.enableUnseenAlerts;
                delete loadedSettings.enableUnseenAlerts;
            }
            this.settings = { ...this.defaults, ...loadedSettings };
            if (ENABLE_DEBUG_LOGGING) console.info(`${SCRIPT_PREFIX} [Config] Settings loaded:`, this.settings);
        },
        async save() {
            await GM_setValue('powerUpConfig_v10', this.settings);
            if (ENABLE_DEBUG_LOGGING) console.info(`${SCRIPT_PREFIX} [Config] Settings saved:`, this.settings);
        }
    };

    const SettingsGUI = {
        init() { this._addStyles(); this._createSettingsButton(); },
        _createSettingsButton() { const btn = document.createElement('button'); btn.id = 'powerup-settings-btn'; btn.textContent = '⚙️'; btn.title = 'Open Power-Up Settings'; btn.onclick = () => this._togglePanel(); document.body.appendChild(btn); },
        _togglePanel() { let panel = document.getElementById('powerup-settings-panel'); if (panel) { panel.remove(); } else { this._createPanel(); } },
        _createPanel() {
            const panel = document.createElement('div'); panel.id = 'powerup-settings-panel';
            panel.innerHTML = `
                <div class="powerup-header"><h3>DA Power-Up Settings</h3><button class="powerup-close-btn">&times;</button></div>
                <div class="powerup-content">
                    <h4>🔔 Notification Filters</h4>
                    <div class="powerup-setting-checkbox"><input type="checkbox" id="enablePayFilter" ${Config.settings.enablePayFilter ? 'checked' : ''}><label for="enablePayFilter">Enable High-Pay Filter</label></div>
                    <div class="powerup-setting ${!Config.settings.enablePayFilter ? 'disabled' : ''}"><label for="payThreshold">High-Pay Threshold ($/hr)</label><input type="number" id="payThreshold" min="0" value="${Config.settings.payThreshold}" ${!Config.settings.enablePayFilter ? 'disabled' : ''}></div>
                    <div class="powerup-setting-checkbox"><input type="checkbox" id="enableNameFilter" ${Config.settings.enableNameFilter ? 'checked' : ''}><label for="enableNameFilter">Enable Name Filter</label></div>
                    <div class="powerup-setting ${!Config.settings.enableNameFilter ? 'disabled' : ''}"><label for="nameFilters">Name Filters (one per line)</label><textarea id="nameFilters" rows="4" ${!Config.settings.enableNameFilter ? 'disabled' : ''}>${Config.settings.nameFilters.join('\n')}</textarea></div>
                    <h4>🎯 Notification Triggers</h4>
                    <p style="margin-top: -10px; font-size: 0.9em; color: #ccc;">Choose which types of new projects should trigger a notification.</p>
                    <div class="powerup-setting-checkbox"><input type="checkbox" id="notifyForHighPay" ${Config.settings.notifyForHighPay ? 'checked' : ''}><label for="notifyForHighPay">Notify for High-Pay projects</label></div>
                    <div class="powerup-setting-checkbox"><input type="checkbox" id="notifyForNameMatch" ${Config.settings.notifyForNameMatch ? 'checked' : ''}><label for="notifyForNameMatch">Notify for Name-Filter matches</label></div>
                    <div class="powerup-setting-checkbox"><input type="checkbox" id="notifyForOtherNew" ${Config.settings.notifyForOtherNew ? 'checked' : ''}><label for="notifyForOtherNew">Notify for other new projects (general)</label></div>

                    <h4>🤖 Project Grabber</h4>
                    <p style="margin-top: -10px; font-size: 0.9em; color: #ccc;">Automatically open matching new projects in a new tab. Use with caution.</p>
                    <div class="powerup-setting-checkbox"><input type="checkbox" id="enableProjectGrabber" ${Config.settings.enableProjectGrabber ? 'checked' : ''}><label for="enableProjectGrabber">Enable Project Grabber</label></div>
                    <div id="grabber-options" class="${!Config.settings.enableProjectGrabber ? 'disabled' : ''}">
                        <p style="margin-bottom: 5px; margin-top: 10px; font-size: 0.9em; color: #ccc;">Grab projects that match:</p>
                        <div class="powerup-setting-checkbox"><input type="checkbox" id="grabHighPay" ${Config.settings.grabHighPay ? 'checked' : ''} ${!Config.settings.enableProjectGrabber ? 'disabled' : ''}><label for="grabHighPay">High-Pay Filter</label></div>
                        <div class="powerup-setting-checkbox"><input type="checkbox" id="grabNameMatch" ${Config.settings.grabNameMatch ? 'checked' : ''} ${!Config.settings.enableProjectGrabber ? 'disabled' : ''}><label for="grabNameMatch">Name Filter</label></div>
                        <div class="powerup-setting"><label for="grabberMaxTabs">Max Tabs per Check</label><input type="number" id="grabberMaxTabs" min="1" max="5" value="${Config.settings.grabberMaxTabs}" ${!Config.settings.enableProjectGrabber ? 'disabled' : ''}></div>
                        <div class="powerup-setting"><label for="grabberDelay">Delay Between Grabs (seconds)</label><input type="number" id="grabberDelay" min="0" value="${Config.settings.grabberDelay}" ${!Config.settings.enableProjectGrabber ? 'disabled' : ''}></div>
                    </div>

                    <h4>⚙️ General Settings</h4>
                    <div class="powerup-setting"><label for="checkInterval">Check Interval (minutes)</label><input type="number" id="checkInterval" min="1" value="${Config.settings.checkInterval}"></div>
                    <div class="powerup-setting-checkbox"><input type="checkbox" id="enableSound" ${Config.settings.enableSound ? 'checked' : ''}><label for="enableSound">Enable Sound Notifications</label></div>
                    <h4>💱 Currency Converter</h4>
                    <div class="powerup-setting-checkbox"><input type="checkbox" id="enableCurrencyConversion" ${Config.settings.enableCurrencyConversion ? 'checked' : ''}><label for="enableCurrencyConversion">Enable Currency Conversion</label></div>
                    <div class="powerup-setting ${!Config.settings.enableCurrencyConversion ? 'disabled' : ''}"><label for="targetCurrency">Target Currency</label><select id="targetCurrency" ${!Config.settings.enableCurrencyConversion ? 'disabled' : ''}>
                        <option value="GBP" ${Config.settings.targetCurrency === 'GBP' ? 'selected' : ''}>🇬🇧 British Pound (GBP)</option>
                        <option value="EUR" ${Config.settings.targetCurrency === 'EUR' ? 'selected' : ''}>🇪🇺 Euro (EUR)</option>
                        <option value="JPY" ${Config.settings.targetCurrency === 'JPY' ? 'selected' : ''}>🇯🇵 Japanese Yen (JPY)</option>
                        <option value="CAD" ${Config.settings.targetCurrency === 'CAD' ? 'selected' : ''}>🇨🇦 Canadian Dollar (CAD)</option>
                        <option value="AUD" ${Config.settings.targetCurrency === 'AUD' ? 'selected' : ''}>🇦🇺 Australian Dollar (AUD)</option>
                        <option value="INR" ${Config.settings.targetCurrency === 'INR' ? 'selected' : ''}>🇮🇳 Indian Rupee (INR)</option>
                    </select></div>
                    <div class="powerup-setting-checkbox ${!Config.settings.enableCurrencyConversion ? 'disabled' : ''}"><input type="checkbox" id="includePayPalFee" ${Config.settings.includePayPalFee ? 'checked' : ''} ${!Config.settings.enableCurrencyConversion ? 'disabled' : ''}><label for="includePayPalFee">Deduct estimated PayPal Fee (${Config.settings.paypalFeePercentage}%)</label></div>
                </div>
                <div class="powerup-footer"><button id="powerup-save-btn">Save & Apply</button><span id="powerup-save-confirm" style="display:none;">✅ Saved!</span></div>`;
            document.body.appendChild(panel);
            panel.querySelector('.powerup-close-btn').onclick = () => this._togglePanel();
            document.getElementById('powerup-save-btn').onclick = () => this._saveSettings();
            const setupToggle = (checkId, fieldIds, containerSelector) => {
                const checkbox = document.getElementById(checkId);
                const updateState = () => {
                    const isDisabled = !checkbox.checked;
                    fieldIds.forEach(id => document.getElementById(id).disabled = isDisabled);
                    document.getElementById(fieldIds[0]).closest(containerSelector).classList.toggle('disabled', isDisabled);
                };
                checkbox.onchange = updateState;
            };
            setupToggle('enablePayFilter', ['payThreshold'], '.powerup-setting');
            setupToggle('enableNameFilter', ['nameFilters'], '.powerup-setting');
            setupToggle('enableCurrencyConversion', ['targetCurrency', 'includePayPalFee'], '.powerup-setting');

            const grabberCheckbox = document.getElementById('enableProjectGrabber');
            grabberCheckbox.onchange = () => {
                const isDisabled = !grabberCheckbox.checked;
                document.getElementById('grabber-options').classList.toggle('disabled', isDisabled);
                document.querySelectorAll('#grabber-options input, #grabber-options select').forEach(input => input.disabled = isDisabled);
            };
        },
        async _saveSettings() {
            Config.settings.payThreshold = parseFloat(document.getElementById('payThreshold').value);
            Config.settings.nameFilters = document.getElementById('nameFilters').value.split('\n').map(f => f.trim()).filter(Boolean);
            Config.settings.enablePayFilter = document.getElementById('enablePayFilter').checked;
            Config.settings.enableNameFilter = document.getElementById('enableNameFilter').checked;
            Config.settings.notifyForHighPay = document.getElementById('notifyForHighPay').checked;
            Config.settings.notifyForNameMatch = document.getElementById('notifyForNameMatch').checked;
            Config.settings.notifyForOtherNew = document.getElementById('notifyForOtherNew').checked;

            Config.settings.enableProjectGrabber = document.getElementById('enableProjectGrabber').checked;
            Config.settings.grabHighPay = document.getElementById('grabHighPay').checked;
            Config.settings.grabNameMatch = document.getElementById('grabNameMatch').checked;
            Config.settings.grabberMaxTabs = parseInt(document.getElementById('grabberMaxTabs').value, 10);
            Config.settings.grabberDelay = parseFloat(document.getElementById('grabberDelay').value);

            Config.settings.checkInterval = parseInt(document.getElementById('checkInterval').value, 10);
            Config.settings.enableSound = document.getElementById('enableSound').checked;
            Config.settings.enableCurrencyConversion = document.getElementById('enableCurrencyConversion').checked;
            Config.settings.targetCurrency = document.getElementById('targetCurrency').value;
            Config.settings.includePayPalFee = document.getElementById('includePayPalFee').checked;
            await Config.save();
            const confirmMsg = document.getElementById('powerup-save-confirm'); confirmMsg.style.display = 'inline';
            setTimeout(() => { this._togglePanel(); alert('Settings saved. Page will reload to apply changes.'); window.location.reload(); }, 1000);
        },
        _addStyles() { GM_addStyle(`#powerup-settings-btn { position: fixed; bottom: 20px; left: 20px; width: 50px; height: 50px; background: linear-gradient(135deg, #6a0dad, #a020f0); color: white; border: none; border-radius: 50%; font-size: 24px; cursor: pointer; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.4); } #powerup-settings-panel { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 500px; max-height: 80vh; overflow-y: auto; background: #2d2d2d; color: #f0f0f0; border: 1px solid #6a0dad; border-radius: 12px; z-index: 10001; box-shadow: 0 10px 40px rgba(0,0,0,0.8); font-family: -apple-system, BlinkMacSystemFont, sans-serif; } .powerup-header { padding: 15px 20px; background: #444; border-bottom: 1px solid #555; display: flex; justify-content: space-between; align-items: center; border-radius: 10px 10px 0 0; position: sticky; top: 0; z-index: 1; } .powerup-header h3 { margin: 0; } .powerup-close-btn { background: none; border: none; color: white; font-size: 24px; cursor: pointer; } .powerup-content { padding: 20px; display: flex; flex-direction: column; gap: 15px; } .powerup-content h4 { margin: 10px 0 5px 0; color: #a020f0; border-bottom: 1px solid #555; padding-bottom: 5px; } .powerup-setting, .powerup-setting-checkbox, #grabber-options { transition: opacity 0.3s; } .powerup-setting.disabled, .powerup-setting-checkbox.disabled, #grabber-options.disabled { opacity: 0.5; } .powerup-setting label, .powerup-setting-checkbox label { margin-bottom: 5px; font-weight: bold; } .powerup-setting input, .powerup-setting textarea, .powerup-setting select { background: #222; border: 1px solid #666; color: white; padding: 10px; border-radius: 4px; width: 100%; box-sizing: border-box; } .powerup-setting-checkbox { display: flex; align-items: center; gap: 10px; } .powerup-footer { padding: 15px 20px; background: #444; border-top: 1px solid #555; text-align: right; border-radius: 0 0 10px 10px; position: sticky; bottom: 0; z-index: 1;} #powerup-save-btn { background: #6a0dad; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; } #powerup-save-confirm { margin-left: 10px; color: lightgreen; }`); }
    };

    const Notifier = {
        NOTIFICATION_SOUND_URL: 'https://www.myinstants.com/media/sounds/hell_AJWSn3e.mp3', _originalTitle: document.title,
        send(project, reasons) {
            if (ENABLE_DEBUG_LOGGING) console.info(`${SCRIPT_PREFIX} [Notifier] Sending notification for '${project.name}' for reasons:`, reasons);
            const { title, text, highlight } = this._formatMessage(project, reasons);
            GM_notification({ title, text, highlight, silent: false, timeout: 30000, onclick: () => window.focus() });
            this._showBanner(title);
            if (Config.settings.enableSound) { const audio = new Audio(this.NOTIFICATION_SOUND_URL); audio.play().catch(e => console.warn(`${SCRIPT_PREFIX} Audio notification was blocked.`)); }
        },
        _formatMessage(project, reasons) {
            let title = "✨ New Project Available!"; let text = `${project.name} | $${project.pay.toFixed(2)}/hr | ${project.tasks} tasks`; let highlight = true;
            const isHighPay = reasons.includes('highPay'); const isNameMatch = reasons.includes('nameMatch');
            if (isHighPay && isNameMatch) { title = `💸🎯 High-Pay & Filter Match!`; }
            else if (isHighPay) { title = `💸 High-Pay Project Found!`; }
            else if (isNameMatch) { title = `🎯 Filter Match Project Found!`; }
            return { title, text, highlight };
        },
        _showBanner(title) {
            document.title = `(${title.slice(0, 1)}) New Project! | ${this._originalTitle}`;
            let banner = document.getElementById('new-project-notifier-banner');
            if (!banner) { banner = document.createElement('div'); banner.id = 'new-project-notifier-banner'; document.documentElement.appendChild(banner); }
            banner.innerHTML = `<span>${title} Refresh the page to see the new project.</span><button title="Dismiss">&times;</button>`;
            banner.querySelector('button').onclick = () => { banner.remove(); document.title = this._originalTitle; };
        }
    };

    const ProjectTracker = {
        _tabId: Date.now() + Math.random(), _isLeader: false, _isChecking: false, _checkTimeoutId: null,
        async _updateLeaderTimestamp() {
            if (this._isLeader) { const now = Date.now(); await GM_setValue('leaderInfo', { id: this._tabId, timestamp: now }); if (ENABLE_DEBUG_LOGGING) console.log(`%c[LEADERSHIP] Heartbeat updated at ${new Date(now).toLocaleTimeString()}`, 'color: cyan;'); }
        },
        _getProjectsFromDoc(doc) {
            const projectsMap = new Map(); doc.querySelectorAll('tbody tr').forEach(row => { try { const cells = row.querySelectorAll('td'); if (cells.length < 4) return; const linkElement = cells[0].querySelector('a'); if (!linkElement) return; const projectId = new URL(linkElement.href, doc.baseURI).searchParams.get('project_id'); const name = linkElement.textContent.trim(); const pay = parseFloat(cells[1].textContent.trim().replace(/[^0-9.-]+/g, "")); const tasks = parseInt(cells[2].textContent.trim().replace(/,/g, ''), 10); const url = linkElement.href; if (projectId && name) { projectsMap.set(projectId, { id: projectId, name, pay: isNaN(pay) ? 0 : pay, tasks: isNaN(tasks) ? 0 : tasks, url }); } } catch (e) { console.error(`${SCRIPT_PREFIX} Error parsing a project row:`, e, row); } }); return projectsMap;
        },
        _fetchProjectsWithIframe() {
            return new Promise((resolve, reject) => { const iframe = document.createElement('iframe'); iframe.id = 'powerup-fetch-iframe'; iframe.style.display = 'none'; const timeout = setTimeout(() => { cleanup(); reject(new Error('Iframe load timed out.')); }, 30000); const cleanup = () => { clearTimeout(timeout); const el = document.getElementById('powerup-fetch-iframe'); if (el) el.remove(); }; iframe.onload = () => { try { const projects = this._getProjectsFromDoc(iframe.contentDocument); resolve(projects); } catch (e) { reject(e); } finally { cleanup(); } }; iframe.onerror = () => { cleanup(); reject(new Error('Iframe failed to load.')); }; iframe.src = window.location.href; document.body.appendChild(iframe); });
        },
        async _checkForNewProjects() {
            if (this._isChecking) return;
            this._isChecking = true;
            if (ENABLE_DEBUG_LOGGING) console.groupCollapsed(`${SCRIPT_PREFIX} [Tracker] Starting Project Check @ ${new Date().toLocaleTimeString()}`);
            try {
                await this._updateLeaderTimestamp();
                const currentProjectsMap = await this._fetchProjectsWithIframe();
                const currentProjectIds = Array.from(currentProjectsMap.keys());
                const previousProjectIds = await GM_getValue('powerUpLastSeenProjects_v10', []);
                const historicalDB = await GM_getValue('slimProjectDatabase_v10', {});
                const previousProjectIdsSet = new Set(previousProjectIds);
                let historicalDbWasModified = false;
                const projectsToGrab = [];

                if (ENABLE_DEBUG_LOGGING) {
                    console.log("Projects now:", currentProjectIds);
                    console.log("Projects last check:", previousProjectIds);
                }
                for (const [projectId, projectData] of currentProjectsMap.entries()) {
                    if (!previousProjectIdsSet.has(projectId)) {
                        if (ENABLE_DEBUG_LOGGING) console.log(`%c[NEW THIS CYCLE]`, 'color: lightgreen; font-weight: bold;', projectData);
                        const triggeringReasons = [];
                        const lowerCaseName = projectData.name.toLowerCase();
                        const isHighPay = Config.settings.enablePayFilter && projectData.pay >= Config.settings.payThreshold;
                        const isNameMatch = Config.settings.enableNameFilter && Config.settings.nameFilters.some(filter => lowerCaseName.includes(filter.toLowerCase()));

                        if (isHighPay && Config.settings.notifyForHighPay) { triggeringReasons.push('highPay'); }
                        if (isNameMatch && Config.settings.notifyForNameMatch) { triggeringReasons.push('nameMatch'); }
                        if (triggeringReasons.length > 0) { Notifier.send(projectData, triggeringReasons); }
                        else if (Config.settings.notifyForOtherNew) { Notifier.send(projectData, ['unseen']); }

                        if (Config.settings.enableProjectGrabber) {
                            const shouldGrabHighPay = isHighPay && Config.settings.grabHighPay;
                            const shouldGrabNameMatch = isNameMatch && Config.settings.grabNameMatch;
                            if (shouldGrabHighPay || shouldGrabNameMatch) {
                                projectsToGrab.push(projectData);
                            }
                        }
                    }
                    if (!historicalDB[projectId]) {
                        historicalDB[projectId] = { id: projectData.id, name: projectData.name, pay: projectData.pay };
                        historicalDbWasModified = true;
                        if (ENABLE_DEBUG_LOGGING) console.log(`%c[NEW TO HISTORY] Added '${projectData.name}' to the historical database.`, 'color: cyan;');
                    }
                }

                if (projectsToGrab.length > 0) {
                    if (ENABLE_DEBUG_LOGGING) console.info(`${SCRIPT_PREFIX} [Grabber] Found ${projectsToGrab.length} project(s) matching grab criteria.`);
                    const projectsToActuallyOpen = projectsToGrab.slice(0, Config.settings.grabberMaxTabs);
                    if (projectsToActuallyOpen.length < projectsToGrab.length) {
                        console.warn(`${SCRIPT_PREFIX} [Grabber] Max tabs limit (${Config.settings.grabberMaxTabs}) reached. Not opening all ${projectsToGrab.length} matched projects.`);
                    }
                    projectsToActuallyOpen.forEach((project, index) => {
                        const delay = index * Config.settings.grabberDelay * 1000;
                        setTimeout(() => {
                            console.log(`%c[GRABBING] Opening '${project.name}' in new tab...`, 'color: magenta; font-weight: bold;');
                            GM_openInTab(project.url, { active: true, setParent: true });
                        }, delay);
                    });
                }

                if (historicalDbWasModified) {
                    await GM_setValue('slimProjectDatabase_v10', historicalDB);
                }
                await GM_setValue('powerUpLastSeenProjects_v10', currentProjectIds);
            } catch (error) {
                console.error(`${SCRIPT_PREFIX} [Tracker] A critical error occurred during the project check:`, error);
            } finally {
                this._isChecking = false;
                if (ENABLE_DEBUG_LOGGING) console.groupEnd();
            }
        },
        async _electLeader() {
            const leaderInfo = await GM_getValue('leaderInfo', {}); const now = Date.now(); let becameLeader = false; if (!leaderInfo.id || (now - leaderInfo.timestamp) > Config.settings.checkInterval * 60 * 1000 * 1.5) { this._isLeader = true; becameLeader = true; await this._updateLeaderTimestamp(); } else { this._isLeader = (leaderInfo.id === this._tabId); } if (ENABLE_DEBUG_LOGGING) { console.log(`%c[LEADERSHIP CHECK] This tab is ${this._isLeader ? 'the leader' : 'a follower'}. ${becameLeader ? '(Newly Elected)' : ''}`, 'color: orange;'); }
        },
        async init() {
            if (ENABLE_DEBUG_LOGGING) console.info(`${SCRIPT_PREFIX} [Tracker] Initializing...`);
            GM_addStyle(`#new-project-notifier-banner { position: fixed; top: 0; left: 0; width: 100%; background: linear-gradient(45deg, #6a0dad, #a020f0); color: white; text-align: center; padding: 15px; font-size: 1.2em; z-index: 9999; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 8px rgba(0,0,0,0.3); } #new-project-notifier-banner button { background:none; border:none; color:white; font-size:2em; cursor:pointer; margin-left:20px; } }`);
            window.addEventListener('unload', async () => { if (this._isLeader) { if (ENABLE_DEBUG_LOGGING) console.log(`%c[LEADERSHIP] Leader tab closing. Abdicating leadership.`, 'color: red;'); await GM_setValue('leaderInfo', {}); } });
            await this._electLeader();
            if (this._isLeader) { if (ENABLE_DEBUG_LOGGING) console.info(`${SCRIPT_PREFIX} [Tracker] This is the leader tab. Performing an immediate initial check.`); this._checkForNewProjects(); }
            const scheduleNextCheck = () => { clearTimeout(this._checkTimeoutId); this._checkTimeoutId = setTimeout(() => { if (this._isLeader) { this._checkForNewProjects(); } scheduleNextCheck(); }, Config.settings.checkInterval * 60 * 1000); };
            setInterval(() => this._electLeader(), 5000);
            scheduleNextCheck();
            if (ENABLE_DEBUG_LOGGING) console.info(`${SCRIPT_PREFIX} [Tracker] Project tracker active. Checks every ${Config.settings.checkInterval} minutes.`);
        }
    };

    const CurrencyConverter = {
        FALLBACK_RATES: { GBP: 0.79, EUR: 0.92, JPY: 150.0, CAD: 1.35, AUD: 1.50, INR: 83.0 },
        _fetchRate(callback) {
            const target = Config.settings.targetCurrency;
            const fallback = this.FALLBACK_RATES[target] || 1.0;
            GM_xmlhttpRequest({
                method: "GET", url: `https://api.frankfurter.app/latest?from=USD&to=${target}`,
                onload: (res) => { try { callback(JSON.parse(res.responseText)?.rates?.[target] || fallback); } catch (e) { callback(fallback); } },
                onerror: () => callback(fallback)
            });
        },
        _convertPrices(rootNode, effectiveRate) {
            const usdRegex = /\$(-?[\d,]+(?:\.\d{2})?)/g;
            const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                const p = node.parentElement;
                if (!p || p.closest('[data-usd-converted]') || ['SCRIPT', 'STYLE'].includes(p.tagName)) continue;
                if (node.nodeValue.includes('$')) {
                    const newText = node.nodeValue.replace(usdRegex, (_, numStr) => {
                        const symbol = CURRENCY_SYMBOLS[Config.settings.targetCurrency] || Config.settings.targetCurrency;
                        const value = parseFloat(numStr.replace(/,/g, '')) * effectiveRate;
                        const decimalPlaces = ['JPY'].includes(Config.settings.targetCurrency) ? 0 : 2;
                        return `${symbol}${value.toFixed(decimalPlaces)}`;
                    });
                    if (newText !== node.nodeValue) {
                        node.nodeValue = newText;
                        p.dataset.usdConverted = 'true';
                    }
                }
            }
        },
        init() {
            if (!Config.settings.enableCurrencyConversion) return;
            this._fetchRate(marketRate => {
                const feeMultiplier = Config.settings.includePayPalFee ? (1 - (Config.settings.paypalFeePercentage / 100)) : 1;
                const effectiveRate = marketRate * feeMultiplier;
                this._convertPrices(document.body, effectiveRate);
                new MutationObserver(mutations => mutations.forEach(m => m.addedNodes.forEach(n => {
                    if (n.nodeType === Node.ELEMENT_NODE && !n.closest('#powerup-fetch-iframe')) {
                        this._convertPrices(n, effectiveRate);
                    }
                }))).observe(document.body, { childList: true, subtree: true });
            });
        }
    };

    const DebugConsole = {
        _createButton() { GM_addStyle(`#debug-dump-btn { position: fixed; bottom: 20px; right: 20px; background-color: #c0392b; color: white; border: none; border-radius: 5px; padding: 10px 15px; font-size: 14px; z-index: 10000; box-shadow: 0 4px 8px rgba(0,0,0,0.4); }`); const btn = document.createElement('button'); btn.id = 'debug-dump-btn'; btn.textContent = 'Dump Project DB'; btn.addEventListener('click', this._dumpDatabaseToConsole); document.body.appendChild(btn); },
        async _dumpDatabaseToConsole() {
            console.groupCollapsed(`%c[DebugConsole] Project Database Dump`, 'color: #c0392b; font-weight: bold;');
            const projectDB = await GM_getValue('slimProjectDatabase_v10', {});
            const projectArray = Object.values(projectDB);
            if (projectArray.length === 0) {
                console.warn("The slim project database is currently empty.");
            } else {
                console.log(`Found ${projectArray.length} total projects in historical database.`);
                console.table(projectArray);
            }
            console.groupEnd();
        },
        init() { if (ENABLE_DEBUG_LOGGING) { this._createButton(); } }
    };

    async function main() {
        if (ENABLE_DEBUG_LOGGING) console.log(`${SCRIPT_PREFIX} Script loaded on: ${window.location.href}`);
        await Config.load();
        const url = window.location.href;
        if (url.includes('/payments') || url.includes('/projects')) {
            CurrencyConverter.init();
            SettingsGUI.init();
            DebugConsole.init();
        }
        if (url.includes('/projects')) {
            setTimeout(() => ProjectTracker.init(), 2000);
        }
    }
    main();

})();
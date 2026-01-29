// ==UserScript==
// @name         RR Mug Helper
// @version      5.9
// @description  Mug Everyone!!!
// @author       dingus [3188789]
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @namespace https://greasyfork.org/users/1338514
// @downloadURL https://update.greasyfork.org/scripts/563949/RR%20Mug%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/563949/RR%20Mug%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
        .rr-padded-input {
            padding-left: 5px !important;
            padding-right: 5px !important;
            height: 22px !important;
        }
        #crit-api {
            -webkit-text-security: disc;
        }
        #crit-api:focus {
            -webkit-text-security: none;
        }
        .rr-watch-check, #crit-autowatch, #crit-newtabs {
            accent-color: #93c47d;
            cursor: pointer;
        }
        .rr-btn-shared {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 2px 8px !important;
            font-size: 11px !important;
            cursor: pointer !important;
            height: 24px !important;
            min-width: 65px !important;
            text-align: center;
            text-decoration: none !important;
            box-sizing: border-box;
        }
        .rr-remove-btn {
            margin-right: 10px;
        }
        .rr-mug-btn {
            margin-left: 10px;
            color: #fff !important;
        }
        .rr-deposit-btn {
            flex: 1;
            margin: 0 5px;
            height: 28px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none !important;
            color: #fff !important;
            font-size: 11px !important;
        }
    `;
    document.head.appendChild(style);

    const watchedUsers = new Map();
    const statusCache = new Map();
    const sessionHistory = [];
    let isProcessing = false;

    const criteria = {
        apiKey: localStorage.getItem('rr_apiKey') || '',
        maxAge: parseInt(localStorage.getItem('rr_maxAge')) || 1000,
        maxLevel: parseInt(localStorage.getItem('rr_maxLevel')) || 75,
        minMoney: parseInt(localStorage.getItem('rr_minMoney')) || 25000000,
        merits: parseInt(localStorage.getItem('rr_merits')) || 0,
        plunder: parseInt(localStorage.getItem('rr_plunder')) || 0,
        autoWatch: localStorage.getItem('rr_autoWatch') === 'true',
        newTabs: localStorage.getItem('rr_newTabs') === 'true'
    };

    const REFRESH_INTERVAL = 45000;
    const PERSIST_LIMIT = 5 * 60 * 1000;
    const audioAlert = new Audio('https://www.soundjay.com/buttons/sounds/button-3.mp3');

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function calculateMug(betAmount, isClothingStore) {
        const potentialWallet = betAmount * 2;
        const meritMod = criteria.merits * 0.05;
        const plunderMod = criteria.plunder / 100;
        const totalMod = 1 + meritMod + plunderMod;

        let minMug = (potentialWallet * 0.05) * totalMod;
        let maxMug = (potentialWallet * 0.10) * totalMod;

        if (isClothingStore) {
            minMug *= 0.25;
            maxMug *= 0.25;
        }

        return {
            min: Math.floor(minMug),
            max: Math.floor(maxMug),
            formatted: `$${(Math.floor(minMug)/1000000).toFixed(1)}m-$${(Math.floor(maxMug)/1000000).toFixed(1)}m`
        };
    }

    function saveTargetsToStorage(targets) {
        localStorage.setItem('rr_active_targets', JSON.stringify(Array.from(targets.entries())));
    }

    function getTargetsFromStorage() {
        const stored = localStorage.getItem('rr_active_targets');
        if (!stored) return new Map();
        const now = Date.now();
        const parsed = JSON.parse(stored);
        const valid = parsed.filter(([id, data]) => (now - data.timestamp) < PERSIST_LIMIT);
        return new Map(valid);
    }

    function checkCriteriaMet(userId, currentBet) {
        const res = statusCache.get(userId);
        if (!res) return false;
        return (res.level <= criteria.maxLevel && res.age <= criteria.maxAge && currentBet >= criteria.minMoney);
    }

    function applyHighlight(row, userId, currentBet) {
        if (checkCriteriaMet(userId, currentBet)) {
            row.style.background = "rgba(242, 177, 36, 0.12)";
            row.style.boxShadow = "inset 0 0 10px rgba(242, 177, 36, 0.1)";

            if (criteria.autoWatch && !watchedUsers.has(userId)) {
                const checkbox = row.querySelector('.rr-watch-check');
                if (checkbox && !checkbox.checked) {
                    checkbox.checked = true;
                    const stats = statusCache.get(userId) || {};
                    watchedUsers.set(userId, {
                        id: userId,
                        name: row.querySelector('a[href*="profiles.php?XID="]').textContent.trim(),
                        betRaw: currentBet,
                        isClothingStore: stats.isClothingStore || false
                    });
                }
            }
        } else {
            row.style.background = "";
            row.style.boxShadow = "";
        }
    }

    function renderHistory() {
        const histCont = document.getElementById('rr-history-list');
        if (!histCont) return;
        histCont.innerHTML = sessionHistory.length ? '' : '<div style="padding:10px; color:#666; text-align:center;">No session history yet.</div>';

        sessionHistory.slice().reverse().forEach(item => {
            const entry = document.createElement('div');
            entry.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:4px 8px; border-bottom:1px solid #333; font-size:11px; color: #ccc;';
            const targetAttr = criteria.newTabs ? 'target="_blank"' : '';
            entry.innerHTML = `
                <span>[${item.time}] <b>${item.name}</b> - $${formatNumber(item.betRaw)}</span>
                <a href="https://www.torn.com/profiles.php?XID=${item.id}" ${targetAttr} class="torn-btn rr-btn-shared" i-data="i_892_247_65_24" style="height:18px !important; min-width:45px !important; font-size:10px !important;">VIEW</a>
            `;
            histCont.appendChild(entry);
        });
    }

    function addTargetToMenu(userId, userData, isLoad = false) {
        const list = document.getElementById('rr-targets-list');
        if (!list || !userData) return;

        if (list.querySelector('.rr-placeholder')) list.innerHTML = '';
        if (list.querySelector(`[data-target-id="${userId}"]`)) return;

        const mugEst = calculateMug(userData.betRaw, userData.isClothingStore);
        const timeStr = isLoad ? userData.timeStr : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        if (!isLoad) {
            userData.timestamp = Date.now();
            userData.timeStr = timeStr;
            const currentTargets = getTargetsFromStorage();
            currentTargets.set(userId, userData);
            saveTargetsToStorage(currentTargets);
            sessionHistory.push({...userData, id: userId, time: timeStr});
            audioAlert.play();
        }

        const entry = document.createElement('div');
        entry.className = 'rr-target-entry';
        entry.setAttribute('data-target-id', userId);
        entry.style.cssText = 'display:flex; align-items:center; padding:6px 8px; border-bottom:1px solid #444; font-size:12px; background: rgba(255,255,255,0.05); margin-bottom: 2px;';

        const storeWarning = userData.isClothingStore ? ' <span style="color:#e06666; font-weight:bold; font-size:10px;">[CS]</span>' : '';
        const targetAttr = criteria.newTabs ? 'target="_blank"' : '';

        entry.innerHTML = `
            <button class="torn-btn rr-btn-shared rr-remove-btn" i-data="i_892_247_65_24">REMOVE</button>
            <div style="display:flex; flex-direction:column; flex: 1;">
                <span><span style="color:#aaa;">[${timeStr}]</span> <strong>${userData.name}</strong>${storeWarning}</span>
                <div style="display:flex; gap:10px; font-size:11px; margin-top:2px;">
                    <span style="color:#93c47d; font-weight:bold;">Bet: $${formatNumber(userData.betRaw)}</span>
                    <span class="rr-target-mug-est" style="color:#f2b124; font-weight:bold;">Est. Mug: ${mugEst.formatted}</span>
                </div>
            </div>
            <a href="https://www.torn.com/loader.php?sid=attack&user2ID=${userId}" ${targetAttr} class="torn-btn rr-btn-shared rr-mug-btn" i-data="i_892_247_65_24">MUG</a>
        `;

        const removeFromStorage = (id) => {
            const currentTargets = getTargetsFromStorage();
            currentTargets.delete(id);
            saveTargetsToStorage(currentTargets);
        };

        entry.querySelector('.rr-mug-btn').onclick = () => {
            removeFromStorage(userId);
            entry.remove();
        };

        entry.querySelector('.rr-remove-btn').onclick = () => {
            removeFromStorage(userId);
            entry.remove();
            if (!list.hasChildNodes()) {
                list.innerHTML = '<div class="rr-placeholder" style="padding:10px; color:#888; font-size:11px; text-align:center;">Targets will appear here.</div>';
            }
        };

        list.prepend(entry);

        if (!isLoad) {
            const flash = document.createElement('div');
            flash.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(242, 177, 36, 0.15); z-index:999998; pointer-events:none;';
            document.body.appendChild(flash);
            setTimeout(() => flash.remove(), 400);
        }
    }

    function injectCriteriaPanel() {
        if (document.getElementById('rr-criteria-panel-wrapper')) return;
        const createWrap = document.querySelector('.createWrap___l0pd7');
        if (!createWrap) return;

        const panelWrapper = document.createElement('div');
        panelWrapper.id = 'rr-criteria-panel-wrapper';
        panelWrapper.className = 'createWrap___l0pd7';
        panelWrapper.style.marginTop = '10px';

        const targetAttr = criteria.newTabs ? 'target="_blank"' : '';

        panelWrapper.innerHTML = `
            <div class="title-black top-round" style="display: flex; justify-content: space-between; align-items: center; padding: 0 10px;">
                <span>Highlight Criteria & Target Tracker</span>
                <div style="display:flex; gap:10px;">
                    <span id="rr-toggle-history" style="font-size: 10px; cursor: pointer; text-decoration: underline; color: #f2b124;">History</span>
                    <span id="rr-clear-list" style="font-size: 10px; cursor: pointer; text-decoration: underline; color: #aaa;">Clear List</span>
                </div>
            </div>
            <div class="cont-gray bottom-round" style="padding:10px;">
                <div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                    <div style="font-size: 11px; color: #f2b124; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Quick Deposit Links</div>
                    <div style="display: flex; justify-content: space-between;">
                        <a href="https://www.torn.com/companies.php?step=your&type=1#/option=funds" ${targetAttr} class="torn-btn rr-deposit-btn" i-data="i_892_247_65_24">COMPANY</a>
                        <a href="https://www.torn.com/factions.php?step=your#/tab=armoury" ${targetAttr} class="torn-btn rr-deposit-btn" i-data="i_892_247_65_24">ARMORY</a>
                        <a href="https://www.torn.com/page.php?sid=stocks" ${targetAttr} class="torn-btn rr-deposit-btn" i-data="i_892_247_65_24">STOCKS</a>
                    </div>
                </div>

                <div style="display: flex; gap: 10px; align-items: center; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 10px; flex-wrap: wrap;">
                    <div style="display:flex; gap:3px; align-items:center;"><span style="font-size:11px; color:#aaa;">Key:</span><input type="text" id="crit-api" class="input___CnjG4 rr-padded-input" value="${criteria.apiKey}" style="width:70px;" placeholder="API Key"></div>
                    <div style="display:flex; gap:3px; align-items:center;"><span style="font-size:11px;">Age:</span><input type="number" id="crit-age" class="input___CnjG4 rr-padded-input" value="${criteria.maxAge}" style="width:45px;"></div>
                    <div style="display:flex; gap:3px; align-items:center;"><span style="font-size:11px;">Lvl:</span><input type="number" id="crit-lvl" class="input___CnjG4 rr-padded-input" value="${criteria.maxLevel}" style="width:35px;"></div>
                    <div style="display:flex; gap:3px; align-items:center;"><span style="font-size:11px;">Min $:</span><input type="text" id="crit-money" class="input-money input___CnjG4 rr-padded-input" value="${formatNumber(criteria.minMoney)}" style="width:80px;"></div>
                    <div style="display:flex; gap:3px; align-items:center;"><span style="font-size:11px; color:#f2b124;">Merits:</span><input type="number" id="crit-merits" min="0" max="10" class="input___CnjG4 rr-padded-input" value="${criteria.merits}" style="width:30px;"></div>
                    <div style="display:flex; gap:3px; align-items:center;"><span style="font-size:11px; color:#f2b124;">Plunder%:</span><input type="number" id="crit-plunder" min="0" max="50" class="input___CnjG4 rr-padded-input" value="${criteria.plunder}" style="width:35px;"></div>
                    <div style="display:flex; gap:5px; align-items:center; margin-left: auto;">
                        <span style="font-size:11px; color:#f2b124;">Auto-Watch:</span><input type="checkbox" id="crit-autowatch" ${criteria.autoWatch ? 'checked' : ''}>
                        <span style="font-size:11px; color:#f2b124; margin-left:5px;">New Tabs:</span><input type="checkbox" id="crit-newtabs" ${criteria.newTabs ? 'checked' : ''}>
                    </div>
                </div>

                <div id="rr-targets-list" style="max-height:250px; overflow-y:auto; background:rgba(0,0,0,0.2); border-radius:3px; border: 1px solid #444;">
                    <div class="rr-placeholder" style="padding:10px; color:#888; font-size:11px; text-align:center;">Targets will appear here when they leave the lobby.</div>
                </div>
                <div id="rr-history-panel" style="display:none; margin-top:10px; border-top: 1px dashed #555; padding-top:10px;">
                    <div style="font-size:11px; color:#f2b124; margin-bottom:5px; font-weight:bold;">Session History:</div>
                    <div id="rr-history-list" style="max-height:150px; overflow-y:auto; background:rgba(0,0,0,0.3); border-radius:3px;"></div>
                </div>
            </div>`;
        createWrap.parentNode.insertBefore(panelWrapper, createWrap.nextSibling);

        const storedTargets = getTargetsFromStorage();
        storedTargets.forEach((data, id) => addTargetToMenu(id, data, true));

        document.getElementById('rr-clear-list').onclick = () => {
             document.getElementById('rr-targets-list').innerHTML = '<div class="rr-placeholder" style="padding:10px; color:#888; font-size:11px; text-align:center;">Targets will appear here.</div>';
             localStorage.removeItem('rr_active_targets');
        };

        document.getElementById('rr-toggle-history').onclick = () => {
            const panel = document.getElementById('rr-history-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            if (panel.style.display === 'block') renderHistory();
        };

        const updateAndRefresh = () => {
            criteria.apiKey = document.getElementById('crit-api').value.trim();
            criteria.maxAge = parseInt(document.getElementById('crit-age').value) || 0;
            criteria.maxLevel = parseInt(document.getElementById('crit-lvl').value) || 0;
            criteria.minMoney = parseInt(document.getElementById('crit-money').value.replace(/[^0-9]/g, '')) || 0;
            criteria.merits = parseInt(document.getElementById('crit-merits').value) || 0;
            criteria.plunder = parseInt(document.getElementById('crit-plunder').value) || 0;
            criteria.autoWatch = document.getElementById('crit-autowatch').checked;
            criteria.newTabs = document.getElementById('crit-newtabs').checked;

            localStorage.setItem('rr_apiKey', criteria.apiKey);
            localStorage.setItem('rr_maxAge', criteria.maxAge);
            localStorage.setItem('rr_maxLevel', criteria.maxLevel);
            localStorage.setItem('rr_minMoney', criteria.minMoney);
            localStorage.setItem('rr_merits', criteria.merits);
            localStorage.setItem('rr_plunder', criteria.plunder);
            localStorage.setItem('rr_autoWatch', criteria.autoWatch);
            localStorage.setItem('rr_newTabs', criteria.newTabs);

            const targetVal = criteria.newTabs ? '_blank' : '';
            document.querySelectorAll('.rr-deposit-btn, .rr-mug-btn').forEach(a => a.target = targetVal);

            document.querySelectorAll('.topSection___BVsS0').forEach(row => {
                const userId = row.getAttribute('data-user-id');
                const dataSpan = row.querySelector('.custom-api-data');
                if (userId && dataSpan && statusCache.has(userId)) {
                    const res = statusCache.get(userId);
                    const currentBet = getBetAmountRaw(row);
                    const mug = calculateMug(currentBet, res.isClothingStore);
                    dataSpan.innerHTML = `
                        <span style="color: #fff">L${res.level}</span>
                        <span style="color: #fff; margin-left:8px;">A${res.age}</span>
                        <span style="color: ${res.color}; margin-left:8px;">[${res.state}]</span>
                        <span style="color: #f2b124; margin-left:12px;">Mug: ${mug.formatted}</span>
                        ${res.isClothingStore ? ' <span style="color:#e06666; font-weight:bold; margin-left:5px;">[CS]</span>' : ''}
                    `;
                    applyHighlight(row, userId, currentBet);
                }
            });
        };

        ['crit-api', 'crit-age', 'crit-lvl', 'crit-money', 'crit-merits', 'crit-plunder', 'crit-autowatch', 'crit-newtabs'].forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                if(id === 'crit-money') e.target.value = formatNumber(e.target.value.replace(/[^0-9]/g, ''));
                updateAndRefresh();
            });
        });
    }

    async function fetchUserDetail(userId, callback) {
        if (!criteria.apiKey) return;
        const now = Date.now();
        if (statusCache.has(userId) && (now - statusCache.get(userId).timestamp < REFRESH_INTERVAL)) {
            callback(statusCache.get(userId));
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/${userId}?selections=profile&key=${criteria.apiKey}`,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.error) return;
                    const result = {
                        level: data.level || 0,
                        age: data.age || 0,
                        state: data.status?.state || "Unknown",
                        color: data.status?.color === "red" ? "#e06666" : "#93c47d",
                        isClothingStore: (data.job?.company_type === 5),
                        timestamp: Date.now()
                    };
                    statusCache.set(userId, result);
                    callback(result);
                } catch (e) { console.error("API parse error", e); }
            }
        });
    }

    const getUserId = (row) => {
        const link = row.querySelector('a[href*="profiles.php?XID="]');
        return link ? link.href.match(/XID=(\d+)/)?.[1] : null;
    };

    const getBetAmountRaw = (row) => {
        const betBlock = row.querySelector('div[class*="betBlock___"]');
        if (!betBlock) return 0;
        const customData = betBlock.querySelector('.custom-api-data');
        let text = (customData) ? betBlock.textContent.substring(customData.textContent.length) : betBlock.textContent;
        return parseInt(text.replace(/[^0-9]/g, '')) || 0;
    };

    const updateRowUI = (row) => {
        const userId = getUserId(row);
        if (!userId) return;
        row.setAttribute('data-user-id', userId);

        const statusBlock = row.querySelector('div[class*="statusBlock___"]');
        if (statusBlock) statusBlock.style.display = 'none';

        const betBlock = row.querySelector('div[class*="betBlock___"]');
        if (betBlock && !betBlock.querySelector('.custom-api-data')) {
            betBlock.style.display = 'flex';
            betBlock.style.flex = '1';
            betBlock.style.justifyContent = 'flex-end';
            betBlock.style.alignItems = 'center';

            const dataSpan = document.createElement('span');
            dataSpan.className = 'custom-api-data';
            dataSpan.style.cssText = `color: #aaa; font-weight: bold; margin-right: 15px; font-size: 11px; white-space: nowrap;`;
            dataSpan.innerText = "[...]";
            betBlock.prepend(dataSpan);

            fetchUserDetail(userId, (res) => {
                const currentBet = getBetAmountRaw(row);
                const mug = calculateMug(currentBet, res.isClothingStore);
                dataSpan.innerHTML = `
                    <span style="color: #fff">L${res.level}</span>
                    <span style="color: #fff; margin-left:8px;">A${res.age}</span>
                    <span style="color: ${res.color}; margin-left:8px;">[${res.state}]</span>
                    <span style="color: #f2b124; margin-left:12px;">Mug: ${mug.formatted}</span>
                    ${res.isClothingStore ? ' <span style="color:#e06666; font-weight:bold; margin-left:5px;">[CS]</span>' : ''}
                `;
                applyHighlight(row, userId, currentBet);
            });
        }

        if (!row.querySelector('.rr-attack-tracker-wrap')) {
            const container = document.createElement('div');
            container.className = 'rr-attack-tracker-wrap columnItem___hnwxL';
            container.style.cssText = 'display:flex; align-items:center; padding:0 10px;';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'rr-watch-check';
            checkbox.onclick = (e) => {
                if (e.target.checked) {
                    const stats = statusCache.get(userId) || {};
                    watchedUsers.set(userId, {
                        name: row.querySelector('a[href*="profiles.php?XID="]').textContent.trim(),
                        betRaw: getBetAmountRaw(row),
                        isClothingStore: stats.isClothingStore || false
                    });
                } else {
                    watchedUsers.delete(userId);
                }
            };
            container.appendChild(checkbox);
            row.appendChild(container);
        }
    };

    const processLobby = () => {
        // STRICT CHECK: Stop everything if not visible or already processing
        if (document.hidden || isProcessing) return;

        isProcessing = true;
        injectCriteriaPanel();

        const rows = document.querySelectorAll('div[class*="topSection___"]');
        const currentIds = new Set();

        rows.forEach(row => {
            const id = getUserId(row);
            if (id) {
                currentIds.add(id);
                updateRowUI(row);
                if (watchedUsers.has(id)) {
                    watchedUsers.get(id).betRaw = getBetAmountRaw(row);
                }
            }
        });

        for (const [id, userData] of watchedUsers.entries()) {
            if (!currentIds.has(id)) {
                // This logic triggers the alert.
                // Because of the 'document.hidden' check above,
                // this won't even be reached if you're tabbed out.
                addTargetToMenu(id, userData);
                watchedUsers.delete(id);
            }
        }
        isProcessing = false;
    };

    const init = () => {
        const target = document.querySelector('.content-wrapper') || document.body;
        // Mutation observer will only trigger processLobby which now checks focus
        new MutationObserver(processLobby).observe(target, { childList: true, subtree: true });
        setInterval(processLobby, 3000);
        processLobby();
    };

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
})();
// ==UserScript==
// @name         aquagloop scripts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A single package for multiple Torn City scripts with an integrated UI for toggling.
// @author       aquagloop & Gemini
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.torn.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548580/aquagloop%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/548580/aquagloop%20scripts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- UI and Settings Logic ---
    const SCRIPT_CONFIG_KEY = 'tornScriptManagerConfig';
    let config = GM_getValue(SCRIPT_CONFIG_KEY, {
        disposalSelector: true,
        rouletteAnimation: true,
        workstatsViewer: true,
        weaponHighlighter: true,
        bazaarViewer: true,
        marketBadges: true,
        plushiesFlowers: true,
        ffDisplayer: true,
        fightMadeEasy: true,
        defenderLastAction: true,
        bazaarApiKey: '',
        workstatsApiKey: '',
        fightMadeEasyConfig: { targetSlot: 'weapon_melee', postFightAction: 'mug', apiKey: '' }
    });

    function saveConfig() {
        GM_setValue(SCRIPT_CONFIG_KEY, config);
        console.log("Torn Script Manager: Configuration saved.");
    }

    function createToggleButton(label, key) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = label;
        const toggle = document.createElement('label');
        toggle.className = 'toggle-switch';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = config[key];
        input.addEventListener('change', () => {
            config[key] = input.checked;
            saveConfig();
            location.reload();
        });
        const slider = document.createElement('span');
        slider.className = 'slider round';

        toggle.appendChild(input);
        toggle.appendChild(slider);
        li.appendChild(span);
        li.appendChild(toggle);
        return li;
    }

    function createSettingsPanel() {
        if (document.getElementById('torn-script-manager-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'torn-script-manager-panel';
        panel.innerHTML = `
            <div id="tsm-header">
                <h3>Script Manager</h3>
            </div>
            <ul id="tsm-script-list">
                ${createToggleButton('Disposal Auto Selector', 'disposalSelector').outerHTML}
                ${createToggleButton('Skip Roulette Animation', 'rouletteAnimation').outerHTML}
                ${createToggleButton('Workstats Viewer', 'workstatsViewer').outerHTML}
                ${createToggleButton('Weapon Effects Highlighter', 'weaponHighlighter').outerHTML}
                ${createToggleButton('Bazaar Viewer (Hospital)', 'bazaarViewer').outerHTML}
                ${createToggleButton('Market Bonus Badges', 'marketBadges').outerHTML}
                ${createToggleButton('Add All Plushies & Flowers', 'plushiesFlowers').outerHTML}
                ${createToggleButton('FF Value & Offline', 'ffDisplayer').outerHTML}
                ${createToggleButton('Fight Made Easy', 'fightMadeEasy').outerHTML}
                ${createToggleButton('Defender Last Action', 'defenderLastAction').outerHTML}
            </ul>
        `;
        document.body.appendChild(panel);
    }

    GM_addStyle(`
        #torn-script-manager-panel {
            position: fixed;
            top: 100px;
            left: 20px;
            background: #222;
            color: #fff;
            padding: 15px;
            border-radius: 12px;
            border: 1px solid #444;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-family: 'Segoe UI', Tahoma, sans-serif;
            z-index: 10000;
        }
        #tsm-header { cursor: move; text-align: center; }
        #tsm-header h3 { margin: 0; font-size: 18px; font-weight: 600; border-bottom: 1px solid #444; padding-bottom: 10px; margin-bottom: 10px; }
        #tsm-script-list { list-style: none; padding: 0; margin: 0; }
        #tsm-script-list li { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #333; }
        #tsm-script-list li:last-child { border-bottom: none; }
        .toggle-switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
        .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; }
        input:checked + .slider { background-color: #4CAF50; }
        input:checked + .slider:before { transform: translateX(20px); }
        .slider.round { border-radius: 20px; }
        .slider.round:before { border-radius: 50%; }
        #torn-script-manager-panel label { cursor: pointer; }
    `);

    function makeDraggable(el) {
        let isDown = false, offset = [0, 0];
        const header = el.querySelector('#tsm-header');
        if (!header) return;
        header.addEventListener('mousedown', (e) => {
            isDown = true;
            offset = [
                el.offsetLeft - e.clientX,
                el.offsetTop - e.clientY
            ];
        });
        document.addEventListener('mouseup', () => { isDown = false; });
        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            el.style.left = `${e.clientX + offset[0]}px`;
            el.style.top = `${e.clientY + offset[1]}px`;
            el.style.right = 'auto';
        });
    }

    // --- Script Functions (Pulled from your provided code) ---

    // 1. Disposal Auto Selector
    if (config.disposalSelector) {
        (function() {
            function isDisposalPage() { return window.location.hash === '#/disposal'; }
            const BEST_BY_JOB = {
                'Broken Appliance': 'Sink', 'Biological Waste': 'Sink', 'Body Part': 'Dissolve',
                'Dead Body': 'Dissolve', 'Documents': 'Burn', 'Firearm': 'Sink', 'Firearms': 'Sink',
                'General Waste': 'Bury', 'Industrial Waste': 'Sink', 'Murder Weapon': 'Sink',
                'Old Furniture': 'Burn', 'Vehicle': 'Sink', 'Building Debris': 'Bury'
            };
            function isVisible(el) { return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length)); }
            setInterval(() => {
                if (!isDisposalPage()) return;
                document.querySelectorAll('.crime-option').forEach(container => {
                    if (container.dataset.autoClicked === 'true') {
                        const anyVisible = Array.from(container.querySelectorAll('button[aria-label]')).some(isVisible);
                        if (!anyVisible) delete container.dataset.autoClicked;
                        return;
                    }
                    const visibleBtns = Array.from(container.querySelectorAll('button[aria-label]')).filter(isVisible);
                    if (visibleBtns.length === 0) return;
                    const header = container.querySelector('[class^="crimeOptionSection"]');
                    const jobName = header ? header.textContent.trim() : null;
                    let best = BEST_BY_JOB[jobName];
                    if (!best) {
                        for (let key in BEST_BY_JOB) {
                            if (jobName && jobName.includes(key)) {
                                best = BEST_BY_JOB[key];
                                break;
                            }
                        }
                    }
                    let target = null;
                    if (best) {
                        target = visibleBtns.find(btn => btn.getAttribute('aria-label').toLowerCase() === best.toLowerCase());
                    }
                    if (!target) target = visibleBtns[0];
                    if (target) {
                        target.click();
                        container.dataset.autoClicked = 'true';
                    }
                });
            }, 300);
        })();
    }

    // 2. Torn City: Skip Roulette Animation
    if (config.rouletteAnimation) {
        (function($) {
            function displayInfo(message, color) {
                $('#infoSpotText').html(message);
                $('#infoSpot').removeClass('red green');
                if (color) { $('#infoSpot').addClass(color); }
            }
            window.addEventListener('load', function() {
                const tornGetAction = window.getAction;
                window.getAction = function(options) {
                    if (options?.data?.sid === 'rouletteData' && options.data.step === 'processStakes') {
                        $('#rouletteCanvas').hide();
                        options.success = function(response) {
                            const title = response.won ? `You won \$${response.won}!` : 'You lost...';
                            const message = ' The ball landed on ' + response.number;
                            displayInfo(title + message, response.won ? 'green' : 'red');
                            setTimeout(() => { window.location.reload(); }, 200);
                        };
                        return tornGetAction(options);
                    }
                    return tornGetAction.apply(this, arguments);
                };
            }, false);
        })(jQuery);
    }

    // 3. Torn Workstats Viewer
    if (config.workstatsViewer) {
        (function () {
            const STORAGE_KEY = 'tornWorkstatsApiKey';
            const fetchWorkStats = (userId, apiKey) => {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.torn.com/v2/user/${userId}/hof?key=${apiKey}`,
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                if (data.error) reject(data.error.error);
                                else resolve(data.hof?.working_stats?.value || 0);
                            } catch (e) { reject('Failed to parse response'); }
                        },
                        onerror: () => reject('Network error')
                    });
                });
            };
            const formatStats = (value) => (value >= 1000) ? Math.round(value / 100) / 10 + 'k' : value.toLocaleString();
            const isMobileView = () => window.matchMedia("only screen and (max-width: 768px)").matches;
            const handlePage = async (apiKey) => {
                const path = window.location.pathname;
                const urlParams = new URLSearchParams(window.location.search);
                if (path.includes('profiles.php') && urlParams.get('XID')) {
                    const userId = urlParams.get('XID');
                    try {
                        const totalStats = await fetchWorkStats(userId, apiKey);
                        const jobLi = Array.from(document.querySelectorAll('li')).find(li => li.querySelector('.user-information-section span.bold')?.textContent.trim() === 'Job');
                        if (jobLi) {
                            const workstatsLi = document.createElement('li');
                            workstatsLi.innerHTML = `<div class="user-information-section"><span class="bold">Work Stats</span></div><div class="user-info-value"><span>${totalStats.toLocaleString()}</span></div>`;
                            jobLi.parentNode.insertBefore(workstatsLi, jobLi.nextSibling);
                        }
                    } catch (error) { console.error('Workstats error on profile page:', error); }
                } else if (path.includes('joblist.php')) {
                    const employeeItems = document.querySelectorAll('ul.employees-list li');
                    for (const item of employeeItems) {
                        const userLink = item.querySelector('.employee a.user.name');
                        if (!userLink) continue;
                        const userId = userLink.href.match(/XID=(\d+)/)?.[1];
                        if (userId) {
                            try {
                                const totalStats = await fetchWorkStats(userId, apiKey);
                                const rankLi = item.querySelector('.rank');
                                if (!rankLi) continue;
                                const formattedStats = formatStats(totalStats);
                                const statsSpan = document.createElement('span');
                                statsSpan.textContent = formattedStats;
                                Object.assign(statsSpan.style, { marginLeft: '5px', fontWeight: 'bold' });
                                rankLi.appendChild(statsSpan);
                            } catch (error) { console.error(`Error fetching work stats for user ${userId}:`, error); }
                        }
                    }
                } else if (path.includes('factions.php')) {
                    const memberItems = document.querySelectorAll('ul.table-body li.table-row');
                    for (const item of memberItems) {
                        const userLink = item.querySelector('a[href*="/profiles.php?XID="]');
                        if (!userLink) continue;
                        const userId = userLink.href.match(/XID=(\d+)/)?.[1];
                        if (userId) {
                            try {
                                const totalStats = await fetchWorkStats(userId, apiKey);
                                const positionCell = item.querySelector('.positionCol___WXhYA') || item.querySelector('.positionCol___Lk6E4');
                                if (positionCell) {
                                    const formattedStats = formatStats(totalStats);
                                    const statsSpan = document.createElement('span');
                                    statsSpan.textContent = formattedStats;
                                    Object.assign(statsSpan.style, { marginLeft: '5px', fontWeight: 'bold' });
                                    positionCell.appendChild(statsSpan);
                                }
                            } catch (error) { console.error(`Error fetching work stats for user ${userId}:`, error); }
                        }
                    }
                }
            };
            const main = async () => {
                let apiKey = GM_getValue(STORAGE_KEY, null);
                if (!apiKey) {
                    apiKey = prompt('Enter your Torn API key for Workstats Viewer:');
                    if (apiKey) GM_setValue(STORAGE_KEY, apiKey);
                    else { alert('No API key entered. Work stats will not be displayed.'); return; }
                }
                try {
                    await fetchWorkStats('1', apiKey);
                    handlePage(apiKey);
                } catch (error) {
                    console.error('API key validation error:', error);
                    if (error === 'Incorrect key' || error === 2) {
                        GM_setValue(STORAGE_KEY, null);
                        alert('Invalid Workstats API key. Reload the page to enter a new one.');
                    } else alert(`Error: ${error}`);
                }
            };
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.profile-container') || document.querySelector('.employees-list') || document.querySelector('.members-list')) {
                    main();
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        })();
    }

    // 4. Torn Weapon Effects Highlighter
    if (config.weaponHighlighter) {
        (function() {
            const weaponEffects = {
                'blindfire': 'Expends remaining ammunition in current clip with reduced accuracy', 'burn': 'Burning DOT effect over 3 turns (45% initial damage)',
                'demoralized': '10% debuff to all opponent stats (stacks up to 5x)', 'emasculate': 'Grants percentage of max happy on finishing hit',
                'freeze': '50% debuff to opponent speed and dexterity', 'hazardous': 'Take percentage of damage you deal',
                'laceration': 'Devastating DOT effect over 9 turns (90% initial damage)', 'poisoned': 'Long DOT effect over 19 turns (95% initial damage)',
                'severe burning': 'Short DOT effect over 3 turns (45% initial damage)', 'shock': 'Causes opponent to miss next turn',
                'sleep': 'Enemy misses turns until damaged', 'smash': 'Double damage but requires recharge turn',
                'spray': 'Empty full clip for double damage', 'storage': 'Allows two temporary items in fight',
                'toxin': '25% debuff to random opponent stat (stacks up to 3x)', 'achilles': 'Increased foot damage',
                'assassinate': 'Increased damage on first turn', 'backstab': 'Double damage when opponent distracted',
                'berserk': 'Increased damage but reduced hit chance', 'bleed': 'Bleeding DOT effect over 9 turns (45% initial damage)',
                'blindside': 'Increased damage if target has full life', 'bloodlust': 'Life regenerated by percentage of damage dealt',
                'comeback': 'Increased damage while under 25% life', 'conserve': 'Increased ammo conservation',
                'cripple': 'Reduces dexterity by 25% (stacks up to 3x for -75% total)', 'crusher': 'Increased head damage',
                'cupid': 'Increased heart damage', 'deadeye': 'Increased critical hit damage', 'deadly': 'Chance of deadly hit (+500% damage)',
                'disarm': 'Disables opponent weapon for multiple turns', 'double-edged': 'Double damage at cost of self injury', 'double tap': 'Hit twice in single turn',
                'empower': 'Increased strength while using weapon', 'eviscerate': 'Opponent receives extra damage under effect',
                'execute': 'Instant defeat when opponent below threshold life', 'expose': 'Increased critical hit rate',
                'finale': 'Increased damage for every turn weapon not used', 'focus': 'Hit chance increase for successive misses',
                'frenzy': 'Damage and accuracy increase on successive hits', 'fury': 'Hit twice in single turn', 'grace': 'Increased hit chance but reduced damage',
                'home run': 'Deflect incoming temporary items', 'irradiate': 'Apply radiation poisoning on finishing hit', 'motivation': 'Increase all stats by 10% (stacks 5x)',
                'paralyzed': '50% chance of missing turns for 300 seconds', 'parry': 'Block incoming melee attacks', 'penetrate': 'Ignore percentage of enemy armor',
                'plunder': 'Increase money mugged on finishing hit', 'powerful': 'Increased damage', 'proficience': 'Increase XP gained on finishing hit',
                'puncture': 'Ignore armor completely', 'quicken': 'Increased speed while using weapon', 'rage': 'Hit 2-8 times in single turn',
                'revitalize': 'Restore energy spent attacking on finishing hit', 'roshambo': 'Increased groin damage',
                'slow': 'Reduce opponent speed by 25% (stacks 3x)', 'smurf': 'Damage increase for each level under opponent',
                'specialist': 'Increased damage but limited to single clip', 'stricken': 'Increased hospital time on final hit',
                'stun': 'Cause opponent to miss next turn', 'suppress': '25% chance for opponent to miss future turns',
                'sure shot': 'Guaranteed hit', 'throttle': 'Increased throat damage', 'warlord': 'Increases respect gained',
                'weaken': 'Reduce opponent defense by 25% (stacks 3x)', 'wind-up': 'Increased damage after spending turn to wind up',
                'wither': 'Reduce opponent strength by 25% (stacks 3x)'
            };
            const effectPatterns = [
                { regex: /\bcrippled\b/gi, key: 'cripple' }, { regex: /\bweakened\b/gi, key: 'weaken' },
                { regex: /\bwithered\b/gi, key: 'wither' }, { regex: /\bslowed\b/gi, key: 'slow' },
                { regex: /\bdemoralized\b/gi, key: 'demoralized' }, { regex: /\bfrozen\b/gi, key: 'freeze' },
                { regex: /\beviscerated\b/gi, key: 'eviscerate' }, { regex: /\bstunned\b/gi, key: 'stun' },
                { regex: /\bpoisoned\b/gi, key: 'poisoned' }, { regex: /\bbleeding\b/gi, key: 'bleed' },
                { regex: /\bburning\b/gi, key: 'burn' }, { regex: /powerful hit/gi, key: 'powerful' },
                { regex: /double damage/gi, key: 'backstab' }, { regex: /punctured through armor/gi, key: 'puncture' },
                { regex: /ignores armor/gi, key: 'puncture' }, { regex: /deadly hit/gi, key: 'deadly' },
                { regex: /fired \d+ rounds.*hitting.*\d+ times/gi, key: 'rage' }, { regex: /executed/gi, key: 'execute' },
                { regex: /finishing blow/gi, key: 'execute' }
            ];
            const css = `.wep-highlight { display: inline; background-color: #add8e6; color: #ffffff; border: 1px solid #88b0c2; border-radius: 2px; padding: 0 2px; cursor: help; } .wep-highlight:hover { background-color: #87ceeb; }`;
            const styleTag = document.createElement('style');
            styleTag.textContent = css;
            document.head.appendChild(styleTag);
            function makeHighlightSpan(matchedText, effectKey) {
                const span = document.createElement('span');
                span.className = 'wep-highlight';
                span.setAttribute('title', `${effectKey.toUpperCase()}: ${weaponEffects[effectKey]}`);
                span.textContent = matchedText;
                return span;
            }
            function replaceInTextNodes(node, regex, effectKey) {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('wep-highlight')) return;
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue;
                    if (!regex.test(text)) return;
                    const frag = document.createDocumentFragment();
                    let lastIndex = 0;
                    text.replace(regex, (match, ...args) => {
                        const matchIndex = args[args.length - 2];
                        if (matchIndex > lastIndex) frag.appendChild(document.createTextNode(text.slice(lastIndex, matchIndex)));
                        const hlSpan = makeHighlightSpan(match, effectKey);
                        frag.appendChild(hlSpan);
                        lastIndex = matchIndex + match.length;
                    });
                    if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
                    node.parentNode.replaceChild(frag, node);
                    return;
                }
                if (node.nodeType === Node.ELEMENT_NODE) {
                    Array.from(node.childNodes).forEach(child => replaceInTextNodes(child, regex, effectKey));
                }
            }
            function highlightInsideMessage(msgNode) {
                const rawText = msgNode.innerText;
                if (!rawText || !rawText.trim()) return;
                Object.keys(weaponEffects).forEach(key => {
                    const regex = new RegExp(`\\b${key}\\b`, 'gi');
                    if (regex.test(rawText)) replaceInTextNodes(msgNode, regex, key);
                });
                effectPatterns.forEach(({ regex, key }) => {
                    if (regex.test(rawText)) replaceInTextNodes(msgNode, regex, key);
                });
            }
            function processExistingLog() {
                document.querySelectorAll('.log-list.overview li').forEach(li => {
                    const msg = li.querySelector('.message');
                    if (msg) highlightInsideMessage(msg);
                });
            }
            function watchForNewLines() {
                const container = document.querySelector('.log-list.overview') || document.body;
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== Node.ELEMENT_NODE) return;
                            if (node.tagName === 'LI') {
                                const msg = node.querySelector('.message');
                                if (msg) highlightInsideMessage(msg);
                            } else {
                                const newLis = node.querySelectorAll?.('li') || [];
                                newLis.forEach(li => {
                                    const msg = li.querySelector('.message');
                                    if (msg) highlightInsideMessage(msg);
                                });
                            }
                        });
                    });
                });
                observer.observe(container, { childList: true, subtree: true });
            }
            function init() { processExistingLog(); watchForNewLines(); }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
            else init();
        })();
    }

    // 5. Torn Bazaar Viewer
    if (config.bazaarViewer) {
        (function () {
            const REFRESH_INTERVAL = 30000;
            let previousItems = {};
            let fetchInterval = null;
            let container = null;
            const getStoredApiKey = () => localStorage.getItem('torn_api_key') || '';
            const setStoredApiKey = (key) => localStorage.setItem('torn_api_key', key);
            const createUI = () => {
                container = document.createElement('div');
                container.id = 'bazaarViewer';
                container.innerHTML = `
                    <div id="bazaarHeader">
                        <h3>Your Bazaar</h3>
                    </div>
                    <div id="apiKeyContainer" style="margin-bottom:10px;">
                        <label for="apiKeyInput">API Key:</label>
                        <input type="text" id="apiKeyInput" placeholder="Enter API Key" style="width: calc(100% - 12px); margin-top: 4px; padding: 4px;" />
                        <button id="saveApiKeyBtn" style="margin-top: 6px; width: 100%;">Save Key</button>
                    </div>
                    <table><thead><tr><th>Name</th><th>Qty</th><th>Price</th></tr></thead><tbody></tbody></table>
                `;
                document.body.appendChild(container);
                const savedKey = getStoredApiKey();
                if (savedKey) {
                    document.getElementById('apiKeyContainer').style.display = 'none';
                    startFetching();
                }
                document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
                    const key = document.getElementById('apiKeyInput').value.trim();
                    if (key) {
                        setStoredApiKey(key);
                        document.getElementById('apiKeyContainer').style.display = 'none';
                        startFetching();
                    }
                });
                makeDraggableBazaar(container);
            };
            const updateUI = (items) => {
                const tbody = document.querySelector('#bazaarViewer tbody');
                if (!tbody) return;
                tbody.innerHTML = '';
                items.forEach(item => {
                    const prevQty = previousItems[item.ID]?.quantity ?? item.quantity;
                    const decreased = item.quantity < prevQty;
                    previousItems[item.ID] = { quantity: item.quantity };
                    const row = document.createElement('tr');
                    if (decreased) row.style.outline = '2px solid #4CAF50';
                    row.innerHTML = `<td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toLocaleString()}</td>`;
                    tbody.appendChild(row);
                });
            };
            const fetchBazaar = () => {
                const key = getStoredApiKey();
                if (!key) return;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://api.torn.com/user/?selections=bazaar&key=${key}`,
                    onload: function (res) {
                        const data = JSON.parse(res.responseText);
                        const items = Array.isArray(data.bazaar) ? data.bazaar : [];
                        updateUI(items);
                    }
                });
            };
            const startFetching = () => {
                if (fetchInterval) clearInterval(fetchInterval);
                fetchBazaar();
                fetchInterval = setInterval(fetchBazaar, REFRESH_INTERVAL);
            };
            const init = () => { createUI(); };
            init();
            GM_addStyle(`
                #bazaarViewer { position: fixed; top: 100px; right: 20px; background: #ffffff; color: #222; padding: 12px; border-radius: 12px; border: 1px solid #ccc; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-height: 500px; width: 340px; overflow-y: auto; font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 13px; z-index: 9999; display: block; }
                #bazaarHeader { cursor: move; }
                #bazaarViewer h3 { margin: 0; font-size: 16px; font-weight: 600; }
                #bazaarViewer table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                #bazaarViewer thead th { position: sticky; top: 0; background: #f9f9f9; font-weight: 600; text-align: left; padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 13px; }
                #bazaarViewer tbody td { padding: 6px 8px; border-bottom: 1px solid #eee; }
                #bazaarViewer tr:last-child td { border-bottom: none; }
                #bazaarViewer input, #bazaarViewer button { font-size: 13px; }
            `);
            function makeDraggableBazaar(el) {
                let isDown = false, offset = [0, 0];
                const header = el.querySelector('#bazaarHeader');
                header.addEventListener('mousedown', (e) => {
                    isDown = true;
                    offset = [el.offsetLeft - e.clientX, el.offsetTop - e.clientY];
                    header.style.userSelect = 'none';
                });
                document.addEventListener('mouseup', () => {
                    isDown = false;
                    header.style.userSelect = '';
                });
                document.addEventListener('mousemove', (e) => {
                    if (isDown) {
                        e.preventDefault();
                        el.style.left = `${e.clientX + offset[0]}px`;
                        el.style.top = `${e.clientY + offset[1]}px`;
                        el.style.right = 'auto';
                    }
                });
            }
        })();
    }

    // 6. Torn Market Bonus Badges
    if (config.marketBadges) {
        (function () {
            const ALLOWED_CATEGORIES = ["Melee", "Primary", "Secondary", "Defensive"];
            const isAllowedWeaponCategory = () => {
                const hash = window.location.hash || '';
                return ALLOWED_CATEGORIES.some(cat => hash.includes(`categoryName=${cat}`) || hash.includes(`itemType=${cat}`));
            };
            const extractPercent = desc => {
                const m = /\b(\d+)%/.exec(desc);
                return m ? +m[1] : null;
            };
            function injectBonusBadges(liEl, numericBonuses, bonusTitles) {
                if (liEl.querySelector('.bonus-badge-wrapper')) return;
                if (getComputedStyle(liEl).position === 'static') liEl.style.position = 'relative';
                const wrapper = document.createElement('div');
                wrapper.className = 'bonus-badge-wrapper';
                Object.assign(wrapper.style, { position: 'absolute', top: '4px', right: '4px', display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', zIndex: '10', pointerEvents: 'none' });
                if (numericBonuses.length) {
                    const pctBadge = document.createElement('div');
                    pctBadge.className = 'bonus-badge-percent';
                    pctBadge.textContent = `${numericBonuses.reduce((a, b) => a + b, 0)}%`;
                    Object.assign(pctBadge.style, { backgroundColor: 'rgba(255,215,0,0.9)', color: '#000', fontSize: '12px', fontWeight: 'bold', padding: '2px 4px', borderRadius: '3px', textAlign: 'right' });
                    wrapper.appendChild(pctBadge);
                }
                bonusTitles.forEach(title => {
                    const titleBadge = document.createElement('div');
                    titleBadge.className = 'bonus-badge-title';
                    titleBadge.textContent = title;
                    Object.assign(titleBadge.style, { backgroundColor: 'rgba(0,128,255,0.85)', color: '#fff', fontSize: '10px', fontWeight: 'normal', padding: '1px 3px', borderRadius: '3px', whiteSpace: 'nowrap', textAlign: 'right' });
                    wrapper.appendChild(titleBadge);
                });
                liEl.appendChild(wrapper);
            }
            function badgeAllRows() {
                const ul = document.querySelector('ul[class^="itemList___"]');
                if (!ul) return false;
                const rows = Array.from(ul.querySelectorAll('li'));
                if (!rows.length) return false;
                rows.forEach(li => {
                    const icons = Array.from(li.querySelectorAll('i[data-bonus-attachment-description]'));
                    if (!icons.length) return;
                    const numericBonuses = [];
                    const bonusTitles = [];
                    icons.forEach(ico => {
                        const desc = ico.dataset.bonusAttachmentDescription || "";
                        const pct = extractPercent(desc);
                        if (pct !== null) numericBonuses.push(pct);
                        const title = ico.dataset.bonusAttachmentTitle || "";
                        if (title) bonusTitles.push(title);
                    });
                    injectBonusBadges(li, numericBonuses, bonusTitles);
                });
                return true;
            }
            function waitForFinalLayoutAndBadge() {
                let attempts = 0;
                const poll = setInterval(() => {
                    if (++attempts > 20 || !isAllowedWeaponCategory()) {
                        clearInterval(poll);
                        return;
                    }
                    const ul = document.querySelector('ul[class^="itemList___"]');
                    if (ul) {
                        clearInterval(poll);
                        setTimeout(() => {
                            badgeAllRows();
                            observeListChanges(ul);
                        }, 2500);
                    }
                }, 300);
            }
            function observeListChanges(ul) {
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        if (mutation.addedNodes.length) badgeAllRows();
                    });
                });
                observer.observe(ul, { childList: true, subtree: true });
            }
            function onCategoryLoad() { waitForFinalLayoutAndBadge(); }
            window.addEventListener('load', () => isAllowedWeaponCategory() && onCategoryLoad());
            window.addEventListener('hashchange', () => isAllowedWeaponCategory() && onCategoryLoad());
        })();
    }

    // 7. Torn Add All Plushies & Flowers
    if (config.plushiesFlowers) {
        (function() {
            function autoMaxPlushiesAndFlowers() {
                const containers = document.querySelectorAll('ul.items-cont.plushies-items, ul.items-cont.flowers-items');
                containers.forEach(container => {
                    container.querySelectorAll('li').forEach(item => {
                        const quantityInput = item.querySelector('input[name="amount"], input[placeholder="Qty"]');
                        if (quantityInput) {
                            quantityInput.value = '999';
                            ['input', 'change', 'blur', 'keyup'].forEach(event => {
                                quantityInput.dispatchEvent(new Event(event, { bubbles: true }));
                            });
                        }
                    });
                });
            }
            function observeTradeInterface() {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            const hasPlushiesOrFlowers = Array.from(mutation.addedNodes).some(el =>
                                el.nodeType === 1 && (el.classList?.contains('plushies-items') || el.classList?.contains('flowers-items'))
                            );
                            if (hasPlushiesOrFlowers) setTimeout(autoMaxPlushiesAndFlowers, 500);
                        }
                    });
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
            function addManualTriggerButton() {
                const button = document.createElement('button');
                button.textContent = 'Add all Plushies & Flowers';
                button.style.cssText = `position: fixed; top: 10px; left: 10px; z-index: 9999; background: #2d5aa0; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;`;
                button.addEventListener('click', autoMaxPlushiesAndFlowers);
                document.body.appendChild(button);
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { setTimeout(addManualTriggerButton, 1000); });
            else addManualTriggerButton();
            observeTradeInterface();
        })();
    }

    // 8. BSP FF Value Displayer & Offline Indicator
    if (config.ffDisplayer) {
        (function () {
            const StorageKey = {
                PlayerBattleStats: 'tdup.battleStatsPredictor.playerBattleStats', PlayerId: 'tdup.battleStatsPredictor.PlayerId',
                BSPPrediction: 'tdup.battleStatsPredictor.cache.prediction.', TornStatsSpy: 'tdup.battleStatsPredictor.cache.spy_v2.tornstats_',
                YataSpy: 'tdup.battleStatsPredictor.cache.spy_v2.yata_',
            };
            function getUsersScore() {
                const userDataJSON = localStorage.getItem(StorageKey.PlayerBattleStats);
                try { return userDataJSON ? JSON.parse(userDataJSON).Score : null; } catch (e) { return null; }
            }
            function getTargetScore(playerId) {
                const calculateScore = (stats) => Math.sqrt(stats.str) + Math.sqrt(stats.def) + Math.sqrt(stats.spd) + Math.sqrt(stats.dex);
                const tsSpyJSON = localStorage.getItem(StorageKey.TornStatsSpy + playerId);
                const yataSpyJSON = localStorage.getItem(StorageKey.YataSpy + playerId);
                let bestSpy = null;
                try {
                    const tsSpy = tsSpyJSON ? JSON.parse(tsSpyJSON) : null;
                    const yataSpy = yataSpyJSON ? JSON.parse(yataSpyJSON) : null;
                    if (tsSpy && yataSpy) bestSpy = tsSpy.timestamp >= yataSpy.timestamp ? tsSpy : yataSpy;
                    else bestSpy = tsSpy || yataSpy;
                    if (bestSpy) { const score = calculateScore(bestSpy); if (score > 0) return score; }
                } catch (e) {}
                const predictionJSON = localStorage.getItem(StorageKey.BSPPrediction + playerId);
                try { return predictionJSON ? JSON.parse(predictionJSON).Score : null; } catch (e) { return null; }
            }
            function calculateFF(userScore, targetScore) {
                if (!userScore || !targetScore) return null;
                const ff = Math.min(3, 1 + (8 / 3) * (targetScore / userScore));
                return Math.max(1, ff).toFixed(2);
            }
            function injectFFValue(element, ffValue) {
                const parentLi = element.closest('li');
                if (!parentLi || parentLi.querySelector('.bsp-ff-display-box')) return;
                parentLi.style.position = 'relative';
                const ffSpan = document.createElement('span');
                ffSpan.className = 'bsp-ff-display-box';
                Object.assign(ffSpan.style, { position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', fontWeight: 'bold', padding: '2px 4px', borderRadius: '3px', backgroundColor: '#e8e8e8', border: '1px solid #aaa', zIndex: '10', whiteSpace: 'nowrap' });
                if (ffValue) {
                    ffSpan.textContent = `FF: ${ffValue}`;
                    ffSpan.style.color = (ffValue > 2.5) ? '#28a745' : (ffValue > 2) ? '#fd7e14' : '#dc3545';
                    ffSpan.style.borderColor = (ffValue > 2.5) ? '#28a745' : (ffValue > 2) ? '#fd7e14' : '#dc3545';
                } else {
                    ffSpan.textContent = `FF: N/A`;
                    ffSpan.style.color = "#777";
                }
                parentLi.appendChild(ffSpan);
            }
            function processAllLinks() {
                const userScore = getUsersScore();
                const selfId = localStorage.getItem(StorageKey.PlayerId);
                if (!userScore) return;
                const isFactionPage = location.href.includes('/factions.php');
                const container = isFactionPage ? document.querySelector('#faction_war_list_id > li.descriptions > div > div.faction-war.membersWrap___NbYLx') : document;
                if (!container) return;
                container.querySelectorAll('a[href*="profiles.php?XID="]').forEach(linkElement => {
                    if (linkElement.closest('#chatRoot, #sidebar')) return;
                    const parentLi = linkElement.closest('li');
                    if (!parentLi) return;
                    const isOffline = parentLi.querySelector('svg[fill*="offline"]');
                    parentLi.style.backgroundColor = isOffline ? 'rgba(40, 167, 69, 0.2)' : '';
                    if (parentLi.querySelector('.bsp-ff-display-box')) return;
                    const playerId = linkElement.href.match(/XID=(\d+)/)?.[1];
                    if (!playerId || playerId === selfId) return;
                    const targetScore = getTargetScore(playerId);
                    const ffValue = calculateFF(userScore, targetScore);
                    injectFFValue(linkElement, ffValue);
                });
            }
            function startObserver() {
                const isFactionPage = location.href.includes('/factions.php');
                const targetNode = isFactionPage ? document.querySelector('#faction_war_list_id > li.descriptions > div > div.faction-war.membersWrap___NbYLx') : document.getElementById('mainContainer');
                if (!targetNode) return;
                const observer = new MutationObserver(() => setTimeout(processAllLinks, 500));
                observer.observe(targetNode, { childList: true, subtree: true });
            }
            setTimeout(() => { processAllLinks(); startObserver(); }, 1000);
        })();
    }

    // 9. Torn Fight Made Easy
    if (config.fightMadeEasy) {
        (function() {
            const ACTION_CONTAINER_SELECTOR = 'div[class*="dialogButtons___"]';
            const SCRIPT_OVERLAY_ID = 'tfme-script-overlay';
            const SETTINGS_PANEL_ID = 'tfme-settings-panel';
            let fightMadeEasyConfig = config.fightMadeEasyConfig;
            let styleElement = null;
            let countdownInterval, finalActionTimeout, nextPollTimeout;

            const loadSettings = () => { config.fightMadeEasyConfig = GM_getValue('TFME_CONFIG', config.fightMadeEasyConfig); };
            const saveSettings = (newConfig) => {
                config.fightMadeEasyConfig = newConfig;
                GM_setValue('TFME_CONFIG', newConfig);
                updateStyles();
                const oldOverlay = document.getElementById(SCRIPT_OVERLAY_ID);
                if (oldOverlay) oldOverlay.remove();
                main();
            };

            const createSettingsPanel = () => {
                const oldPanel = document.getElementById(SETTINGS_PANEL_ID);
                if (oldPanel) oldPanel.remove();
                const panel = document.createElement('div');
                panel.id = SETTINGS_PANEL_ID;
                panel.innerHTML = `
                    <div class="tfme-settings-content">
                        <h2>Torn Fight Made Easy Settings</h2>
                        <div class="tfme-setting">
                            <label for="apiKey">Your Torn API Key (Full Access):</label>
                            <input type="text" id="apiKey" placeholder="Enter your API Key" value="${fightMadeEasyConfig.apiKey}">
                        </div>
                        <div class="tfme-setting">
                            <label for="targetSlot">Target Weapon Slot:</label>
                            <select id="targetSlot">
                                <option value="weapon_main" ${fightMadeEasyConfig.targetSlot === 'weapon_main' ? 'selected' : ''}>Primary</option>
                                <option value="weapon_second" ${fightMadeEasyConfig.targetSlot === 'weapon_second' ? 'selected' : ''}>Secondary</option>
                                <option value="weapon_melee" ${fightMadeEasyConfig.targetSlot === 'weapon_melee' ? 'selected' : ''}>Melee</option>
                                <option value="weapon_temp" ${fightMadeEasyConfig.targetSlot === 'weapon_temp' ? 'selected' : ''}>Temporary</option>
                                <option value="weapon_fists" ${fightMadeEasyConfig.targetSlot === 'weapon_fists' ? 'selected' : ''}>Fists</option>
                            </select>
                        </div>
                        <div class="tfme-setting">
                            <label for="postFightAction">Preferred Post-Fight Action:</label>
                            <select id="postFightAction">
                                <option value="mug" ${fightMadeEasyConfig.postFightAction === 'mug' ? 'selected' : ''}>Mug</option>
                                <option value="hospitalize" ${fightMadeEasyConfig.postFightAction === 'hospitalize' ? 'selected' : ''}>Hospitalize</option>
                                <option value="leave" ${fightMadeEasyConfig.postFightAction === 'leave' ? 'selected' : ''}>Leave</option>
                            </select>
                        </div>
                        <div class="tfme-buttons">
                            <button id="tfme-save">Save & Close</button>
                            <button id="tfme-cancel">Cancel</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(panel);
                document.getElementById('tfme-save').addEventListener('click', () => {
                    const newConfig = {
                        apiKey: document.getElementById('apiKey').value.trim(),
                        targetSlot: document.getElementById('targetSlot').value,
                        postFightAction: document.getElementById('postFightAction').value
                    };
                    saveSettings(newConfig);
                    panel.remove();
                });
                document.getElementById('tfme-cancel').addEventListener('click', () => panel.remove());
            };
            const updateStyles = () => {
                if (styleElement) styleElement.remove();
                styleElement = GM_addStyle(`
                    #${SETTINGS_PANEL_ID} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 9999; display: flex; justify-content: center; align-items: center; font-family: 'Signika', sans-serif; }
                    .tfme-settings-content { background-color: #333; color: #fff; padding: 20px 30px; border-radius: 8px; border: 1px solid #555; text-align: left; width: 400px; }
                    .tfme-settings-content h2 { margin-top: 0; text-align: center; }
                    .tfme-setting { margin: 15px 0; }
                    .tfme-setting label { display: block; margin-bottom: 5px; }
                    .tfme-setting select, .tfme-setting input { width: 100%; padding: 8px; box-sizing: border-box; background: #222; color: #fff; border: 1px solid #555; border-radius: 4px;}
                    .tfme-buttons { margin-top: 20px; text-align: right; }
                    .tfme-buttons button { padding: 8px 15px; margin-left: 10px; border-radius: 5px; border: 1px solid #555; cursor: pointer; }
                    #tfme-save { background: #4CAF50; color: white; }
                    #tfme-cancel { background: #f44336; color: white; }
                    #${fightMadeEasyConfig.targetSlot} { position: relative !important; }
                    #${SCRIPT_OVERLAY_ID} { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; align-items: stretch; gap: 5px; padding: 5px; background-color: rgba(0, 0, 0, 0.4); border: 1px dashed #888; box-sizing: border-box; z-index: 10; }
                    .proxy-button-by-script { width: 100%; margin: 0 !important; box-sizing: border-box; padding: 10px 5px; background-image: linear-gradient(to bottom,#555 0,#333 100%); color: white; text-shadow: 1px 1px 1px rgba(0,0,0,0.5); border-radius: 5px; text-align: center; font-size: 14px; font-weight: bold; border: 1px solid #222; cursor: pointer; flex-grow: 1; display: flex; align-items: center; justify-content: center; }
                    .proxy-button-by-script:hover { background-image: linear-gradient(to bottom,#666 0,#444 100%); }
                    .proxy-button-by-script.mug-button { background-image: linear-gradient(to bottom,#8b0000 0,#5d0000 100%); }
                    .proxy-button-by-script.mug-button:hover { background-image: linear-gradient(to bottom,#9f0000 0,#6f0000 100%); }
                    .proxy-button-by-script:disabled { background-image: linear-gradient(to bottom,#777 0,#555 100%) !important; cursor: not-allowed !important; color: #ccc !important; }
                    .hidden-by-script { visibility: hidden !important; height: 0 !important; padding: 0 !important; margin: 0 !important; opacity: 0 !important; }
                `);
            };
            const clearAllTimers = () => {
                if (countdownInterval) clearInterval(countdownInterval);
                if (finalActionTimeout) clearTimeout(finalActionTimeout);
                if (nextPollTimeout) clearTimeout(nextPollTimeout);
                countdownInterval = finalActionTimeout = nextPollTimeout = null;
            };
            const setButtonToRefreshState = (button) => {
                clearAllTimers();
                if (!button || !document.body.contains(button)) return;
                button.disabled = false;
                button.textContent = "Refresh to Attack";
                button.style.backgroundImage = 'linear-gradient(to bottom, #4caf50, #388e3c)';
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                newButton.addEventListener('click', () => {
                    newButton.disabled = true;
                    newButton.textContent = "Loading...";
                    window.location.reload();
                });
            };
            const formatDuration = (ms) => {
                if (ms <= 0) return "00:00";
                const s = Math.round(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
                const pad = (n) => n.toString().padStart(2, '0');
                return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
            };
            const startCountdown = (button, userID, until) => {
                clearAllTimers();
                button.disabled = true;
                const endTime = until * 1000;
                const durationMs = endTime - Date.now();
                if (durationMs <= 500) { setButtonToRefreshState(button); return; }
                finalActionTimeout = setTimeout(() => setButtonToRefreshState(button), durationMs + 500);
                countdownInterval = setInterval(() => {
                    const remainingMs = endTime - Date.now();
                    if (!document.body.contains(button)) { clearAllTimers(); return; }
                    if (remainingMs <= 0) setButtonToRefreshState(button);
                    else button.textContent = `Attack (${formatDuration(remainingMs)})`;
                }, 1000);
                const pollIntervalMs = (durationMs > 60000) ? 30000 : (durationMs > 10000) ? 5000 : 2000;
                nextPollTimeout = setTimeout(() => handleApiCheck(button, userID), pollIntervalMs);
            };
            const handleApiCheck = (button, userID) => {
                checkTargetStatus(userID, fightMadeEasyConfig.apiKey, (status) => {
                    if (!status || !document.body.contains(button)) { clearAllTimers(); return; }
                    if (status.state === 'Okay') { setButtonToRefreshState(button); }
                    else if (status.state === 'Hospital' && status.until > 0) { startCountdown(button, userID, status.until); }
                    else if (status.state) {
                        clearAllTimers();
                        button.textContent = `Attack (${status.state})`;
                        button.disabled = false;
                        button.addEventListener('click', () => {
                            button.disabled = true;
                            button.textContent = "Checking...";
                            handleApiCheck(button, userID);
                        });
                    }
                    else { button.textContent = `API Error`; button.disabled = false; }
                });
            };
            const setupWaitingButton = (destinationSlot, userID) => {
                const overlay = setupActionOverlay(destinationSlot);
                const waitButton = document.createElement('button');
                waitButton.textContent = "Attack (Checking...)";
                waitButton.className = 'proxy-button-by-script';
                waitButton.disabled = true;
                overlay.appendChild(waitButton);
                checkTargetStatus(userID, fightMadeEasyConfig.apiKey, (status) => {
                    if (!status || !document.body.contains(waitButton)) { clearAllTimers(); return; }
                    if (status.state === 'Okay') { setButtonToRefreshState(waitButton); }
                    else if (status.state === 'Hospital' && status.until > 0) { startCountdown(waitButton, userID, status.until); }
                    else if (status.state) {
                        clearAllTimers();
                        waitButton.textContent = `Attack (${status.state})`;
                        waitButton.disabled = false;
                        waitButton.addEventListener('click', () => {
                            waitButton.disabled = true;
                            waitButton.textContent = "Checking...";
                            handleApiCheck(waitButton, userID);
                        });
                    } else { waitButton.textContent = `API Error`; waitButton.disabled = false; }
                });
            };
            const findButtonByText = (container, text, useIncludes = false) => {
                if (!container || !text) return null;
                const buttons = container.querySelectorAll('button, a[class*="button"]');
                for (const button of buttons) {
                    const buttonText = button.textContent.trim().toLowerCase();
                    if (useIncludes) { if (buttonText.includes(text.toLowerCase())) return button; }
                    else { if (buttonText === text.toLowerCase()) return button; }
                }
                return null;
            };
            const createProxyButton = (realElement, destinationOverlay, onClickCallback) => {
                const proxyButton = document.createElement('button');
                const buttonText = realElement.textContent.trim().toLowerCase();
                proxyButton.textContent = realElement.textContent.trim();
                proxyButton.className = 'proxy-button-by-script';
                if (buttonText === 'mug') proxyButton.classList.add('mug-button');
                proxyButton.addEventListener('click', (e) => {
                    const userID = getTargetUserID();
                    if (buttonText.includes('start fight') || buttonText.includes('join')) {
                        if (userID) sessionStorage.setItem(`fightInitiated_${userID}`, 'true');
                    } else if (userID) { sessionStorage.removeItem(`fightInitiated_${userID}`); }
                    e.stopPropagation();
                    if (onClickCallback) onClickCallback();
                    realElement.click();
                });
                destinationOverlay.appendChild(proxyButton);
            };
            const setupActionOverlay = (destinationSlot) => {
                const oldOverlay = document.getElementById(SCRIPT_OVERLAY_ID);
                if (oldOverlay) oldOverlay.remove();
                const overlay = document.createElement('div');
                overlay.id = SCRIPT_OVERLAY_ID;
                destinationSlot.appendChild(overlay);
                return overlay;
            };
            const getTargetUserID = () => new URLSearchParams(window.location.search).get('user2ID');
            const checkTargetStatus = (userID, apiKey, callback) => {
                GM_xmlhttpRequest({
                    method: "GET", url: `https://api.torn.com/user/${userID}?selections=profile&key=${apiKey}`,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                console.error("Torn API Error:", data.error.error);
                                if (data.error.code === 2 && !sessionStorage.getItem('tfme_api_key_alerted')) {
                                    alert("Torn Fight Made Easy: API key is invalid. Please check settings.");
                                    sessionStorage.setItem('tfme_api_key_alerted', 'true');
                                }
                                callback(null);
                            } else callback(data.status);
                        } catch (e) { console.error("Failed to parse Torn API response:", e); callback(null); }
                    },
                    onerror: (response) => { console.error("Failed to fetch from Torn API:", response); callback(null); }
                });
            };
            const main = () => {
                const destinationSlot = document.getElementById(fightMadeEasyConfig.targetSlot);
                if (!destinationSlot || document.getElementById(SCRIPT_OVERLAY_ID)) return;
                const userID = getTargetUserID();
                const actionContainer = document.querySelector(ACTION_CONTAINER_SELECTOR);
                if (actionContainer) {
                    const actionPriority = [fightMadeEasyConfig.postFightAction, 'mug', 'hospitalize', 'leave', 'continue'];
                    let buttonToMove = null;
                    for (const action of [...new Set(actionPriority)]) {
                        if ((buttonToMove = findButtonByText(actionContainer, action, true))) {
                            const overlay = setupActionOverlay(destinationSlot);
                            createProxyButton(buttonToMove, overlay, () => { overlay.remove(); actionContainer.classList.add('hidden-by-script'); });
                            return;
                        }
                    }
                }
                const preFightButton = findButtonByText(actionContainer, 'start fight', true) || findButtonByText(actionContainer, 'join', true);
                if (preFightButton && preFightButton.getAttribute('aria-disabled') !== 'true') {
                    if (userID && sessionStorage.getItem(`fightInitiated_${userID}`)) return;
                    const overlay = setupActionOverlay(destinationSlot);
                    createProxyButton(preFightButton, overlay, () => { overlay.remove(); actionContainer.classList.add('hidden-by-script'); });
                    return;
                }
                if (!userID) return;
                if (!fightMadeEasyConfig.apiKey) {
                    if (!sessionStorage.getItem('tfme_api_key_prompted')) {
                        if (confirm("Torn Fight Made Easy: API key required. Open settings now?")) createSettingsPanel();
                        sessionStorage.setItem('tfme_api_key_prompted', 'true');
                    }
                    return;
                }
                if (sessionStorage.getItem(`fightInitiated_${userID}`)) return;
                setupWaitingButton(destinationSlot, userID);
            };
            loadSettings();
            updateStyles();
            GM_registerMenuCommand('TFME Settings', createSettingsPanel);
            const observer = new MutationObserver(() => setTimeout(main, 150));
            observer.observe(document.body, { childList: true, subtree: true });
        })();
    }

    // 10. Torn Defender Last Action
    if (config.defenderLastAction) {
        (function() {
            let lastActionTimer = null;
            let lastKnownTimestamp = 0;
            function formatTimeAgo(totalSeconds) {
                if (totalSeconds < 0) totalSeconds = 0;
                const d = Math.floor(totalSeconds / 86400), h = Math.floor((totalSeconds % 86400) / 3600), m = Math.floor((totalSeconds % 3600) / 60), s = Math.floor(totalSeconds % 60);
                if (d > 0) return `${d}d ${h}h ago`;
                if (h > 0) return `${h}h ${m}m ago`;
                if (m > 0) return `${m}m ${s}s ago`;
                return `${s}s ago`;
            }
            function runFeature() {
                const POLLING_INTERVAL_MS = 5000;
                const API_KEY_STORAGE = 'TORN_API_KEY_LastAction';
                const apiKey = getApiKey();
                if (!apiKey) return;
                const defenderId = new URLSearchParams(window.location.search).get('user2ID');
                if (!defenderId) return;
                const displayElement = createDisplayElement();
                if (!displayElement) return;
                function getApiKey() {
                    let apiKey = GM_getValue(API_KEY_STORAGE, null);
                    if (!apiKey) {
                        apiKey = prompt('Please enter your Torn API key (Public or Limited Access is fine) for Defender Last Action.');
                        if (apiKey) GM_setValue(API_KEY_STORAGE, apiKey);
                    }
                    return apiKey;
                }
                function createDisplayElement() {
                    const titleContainer = document.querySelector('div[class*="titleContainer"]');
                    if (!titleContainer) return null;
                    Object.assign(titleContainer.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
                    const rightGroup = document.createElement('div');
                    Object.assign(rightGroup.style, { display: 'flex', alignItems: 'center', gap: '15px' });
                    const backLink = titleContainer.querySelector('a[href*="profiles.php"]');
                    const infoPill = document.createElement('div');
                    const clockIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
                    Object.assign(infoPill.style, { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '5px 10px', borderRadius: '5px', border: '1px solid #111', color: '#e0e0e0', fontSize: '13px', textShadow: '0 1px 1px #000' });
                    const iconSpan = document.createElement('span');
                    iconSpan.innerHTML = clockIconSVG;
                    Object.assign(iconSpan.style, { display: 'flex', alignItems: 'center', opacity: '0.7' });
                    const statusSpan = document.createElement('span');
                    statusSpan.textContent = 'Polling...';
                    infoPill.appendChild(iconSpan);
                    infoPill.appendChild(statusSpan);
                    rightGroup.appendChild(infoPill);
                    if (backLink) rightGroup.appendChild(backLink);
                    titleContainer.appendChild(rightGroup);
                    return statusSpan;
                }
                function pollApi() {
                    GM_xmlhttpRequest({
                        method: "GET", url: `https://api.torn.com/user/${defenderId}?selections=profile&key=${apiKey}`,
                        onload: function(response) {
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                if (data.error) {
                                    if (lastActionTimer) clearInterval(lastActionTimer);
                                    displayElement.textContent = `API Error`;
                                    displayElement.style.color = '#e53935';
                                    displayElement.parentElement.title = data.error.error;
                                    if (data.error.code === 2) { if (apiPollTimer) clearInterval(apiPollTimer); }
                                    return;
                                }
                                const newTimestamp = data.last_action ? data.last_action.timestamp : 0;
                                if (newTimestamp > 0 && newTimestamp !== lastKnownTimestamp) {
                                    lastKnownTimestamp = newTimestamp;
                                    const status = data.last_action.status;
                                    let statusColor = '#f0f0f0';
                                    if (status === 'Online') statusColor = '#4CAF50';
                                    else if (status === 'Idle') statusColor = '#FFC107';
                                    displayElement.style.fontWeight = 'bold';
                                    displayElement.style.color = statusColor;
                                    if (lastActionTimer) clearInterval(lastActionTimer);
                                    lastActionTimer = setInterval(() => {
                                        const now = Math.floor(Date.now() / 1000);
                                        const secondsAgo = now - lastKnownTimestamp;
                                        displayElement.textContent = formatTimeAgo(secondsAgo);
                                    }, 1000);
                                } else if (!data.last_action) {
                                    displayElement.textContent = 'Unknown';
                                }
                            } else {
                                displayElement.textContent = `HTTP Error ${response.status}`;
                                displayElement.style.color = '#e53935';
                            }
                        },
                        onerror: function() {
                            displayElement.textContent = `Network Error`;
                            displayElement.style.color = '#e53935';
                        }
                    });
                }
                pollApi();
                const apiPollTimer = setInterval(pollApi, POLLING_INTERVAL_MS);
            }
            const observer = new MutationObserver((mutationsList, obs) => {
                const targetNode = document.querySelector('div[class*="titleContainer"]');
                if (targetNode) {
                    runFeature();
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        })();
    }

    // --- Final Execution for UI ---
    window.addEventListener('load', () => {
        createSettingsPanel();
        const panel = document.getElementById('torn-script-manager-panel');
        if (panel) makeDraggable(panel);
    });

})();
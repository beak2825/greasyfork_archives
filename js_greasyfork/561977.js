// ==UserScript==
// @name         Torn PDA OC Auto-Payout
// @namespace    toby.torn.pda.ocpayout
// @version      1.8.8
// @description  Calculates payouts. Fixes 85% bug via active item validation and cache self-repair.
// @author       Toby
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_xmlhttpRequest
// @connect      the-revenant.com
// @downloadURL https://update.greasyfork.org/scripts/561977/Torn%20PDA%20OC%20Auto-Payout.user.js
// @updateURL https://update.greasyfork.org/scripts/561977/Torn%20PDA%20OC%20Auto-Payout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================
    // CONFIGURATION
    // =========================================================
    const USER_API_KEY = '';    // Enter your 16-char PUBLIC API key here
    const DEBUG_MODE = false;    // Debugging enabled for verification
    // =========================================================

    const SERVER_URL = 'https://the-revenant.com';
    let itemPriceMap = null; 
    let isProcessing = false;

    const log = (msg, data = '', type = 'log') => {
        if (!DEBUG_MODE && type === 'log') return;
        const prefix = `[OC ${type.toUpperCase()}] `;
        if (type === 'error') console.error(prefix + msg, data);
        else if (type === 'warn') console.warn(prefix + msg, data);
        else console.log(prefix + msg, data);
    };

    async function fetchFromServer(endpoint, method = "GET", body = {}) {
        log(`📡 Requesting: ${method} ${endpoint}`);
        if (!USER_API_KEY || USER_API_KEY.length !== 16) {
            log("❌ ABORTED: API Key invalid.", '', 'error');
            return null;
        }

        return new Promise((resolve) => {
            const url = method === "GET" ? `${SERVER_URL}${endpoint}?apiKey=${USER_API_KEY}` : `${SERVER_URL}${endpoint}`;
            
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: { "Content-Type": "application/json", "x-api-key": USER_API_KEY },
                data: method === "POST" ? JSON.stringify({ ...body, apiKey: USER_API_KEY }) : null,
                timeout: 15000,
                onload: (res) => {
                    if (!res || typeof res.status === 'undefined') {
                        log("❌ Hard Error: Response undefined.", '', 'error');
                        resolve(null);
                        return;
                    }
                    log(`📥 Response ${endpoint}: ${res.status}`);
                    try { resolve(JSON.parse(res.responseText)); } catch (e) { resolve(null); }
                },
                onerror: (err) => { log("❌ Network Error", err, 'error'); resolve(null); },
                ontimeout: () => { log("⌛ Timeout", endpoint, 'warn'); resolve(null); }
            });
        });
    }

    async function ensureItemsLoaded(forceRefresh = false) {
        if (itemPriceMap !== null && !forceRefresh) return true;

        log(forceRefresh ? "🔄 Refreshing Item Cache..." : "🔄 Initializing Item Cache...");
        const items = await fetchFromServer('/api/items', 'GET');
        
        if (items && Object.keys(items).length > 0) {
            itemPriceMap = items;
            log(`✅ Item cache ready (${Object.keys(items).length} items).`);
            return true;
        } else {
            log("⚠️ Item fetch failed. Retrying...", '', 'warn');
            setTimeout(() => ensureItemsLoaded(true), 3000); 
            return false;
        }
    }

    async function init() {
        log("🚀 v1.8.8 Initializing...");
        ensureItemsLoaded();

        const tornObserver = new MutationObserver(async () => {
            const isCrimesTab = window.location.hash.includes('tab=crimes') || window.location.href.includes('type=1');
            if (!isCrimesTab) return;

            document.querySelectorAll('button[class*="payoutBtn___"]').forEach(btn => {
                if (!btn.hasAttribute('data-debug-hooked')) {
                    btn.setAttribute('data-debug-hooked', 'true');
                    btn.addEventListener('click', () => {
                        log("🖱️ PayOut clicked. Queuing audit...");
                        setTimeout(() => runAudit(), 400);
                    });
                }
            });

            if (isProcessing) return;
            runAudit();
        });

        const targetContainer = document.querySelector('#factionsApp') || document.body;
        tornObserver.observe(targetContainer, { childList: true, subtree: true });
    }

    async function runAudit() {
        if (itemPriceMap === null) {
            log("⏳ Audit deferred: Waiting for Item Sync...");
            return;
        }

        const ocWrappers = document.querySelectorAll('[data-oc-id]');
        if (ocWrappers.length === 0) return;

        isProcessing = true;
        log(`🔎 Audit: Scanning ${ocWrappers.length} OCs...`);

        try {
            const crimes = await fetchFromServer('/api/organized-crimes', 'POST', { category: 'completed' });
            if (!crimes || !Array.isArray(crimes)) { 
                isProcessing = false; 
                return; 
            }

            const noReserveMap = {};
            crimes.forEach(c => { if (c.name === "No Reserve") noReserveMap[c.id] = c; });

            ocWrappers.forEach(wrapper => {
                const ocId = wrapper.getAttribute('data-oc-id');
                const crimeData = crimes.find(c => c.id.toString() === ocId.toString());

                if (!crimeData) return;

                const isPayableStatus = ["Successful", "Failure"].includes(crimeData.status);
                const isUnpaid = !crimeData.rewards?.payout?.percentage;
                const splitInput = wrapper.querySelector('input[type="number"]');

                if (isPayableStatus && isUnpaid && splitInput && !splitInput.hasAttribute('data-mobile-synced')) {
                    log(`🎯 Match found: #${ocId}.`);
                    const parentCrime = noReserveMap[crimeData.previous_crime_id] || null;
                    
                    try {
                        const stats = calculateMobileStats(crimeData, parentCrime);
                        // Only inject if stats were calculated successfully (not null)
                        if (stats) attemptInjection(wrapper, splitInput, crimeData, stats);
                    } catch (e) {
                        log(`⚠️ Calculation aborted for #${ocId}: ${e.message}`, '', 'warn');
                        // Trigger self-repair if we found a missing item
                        if (e.message.includes("Missing price")) {
                            ensureItemsLoaded(true); // Force refresh items
                        }
                    }
                }
            });
        } catch (e) { log("Runtime Error", e, 'error'); }
        finally { setTimeout(() => { isProcessing = false; }, 3000); }
    }

    function calculateMobileStats(crime, parentCrime = null) {
        let totalConsumedCost = 0;

        const sumCosts = (c) => {
            if (c.slots) {
                c.slots.forEach(slot => {
                    const req = slot.item_requirement;
                    if (req && req.is_reusable === false) {
                        const itemPrice = itemPriceMap[req.id];
                        
                        // --- ACTIVE VALIDATION CHECK ---
                        if (!itemPrice) {
                            throw new Error(`Missing price for item #${req.id}. Cache needs refresh.`);
                        }
                        // -------------------------------

                        totalConsumedCost += parseFloat(itemPrice.cost || 0);
                    }
                });
            }
        };

        sumCosts(crime);
        if (parentCrime) {
            log(`📦 Including parent #${parentCrime.id} costs.`);
            sumCosts(parentCrime);
        }

        let totalRewardValue = parseFloat(crime.rewards?.money) || 0;
        if (crime.rewards?.items) {
            crime.rewards.items.forEach(ri => {
                const itemPrice = itemPriceMap[ri.id];
                if (itemPrice) {
                    totalRewardValue += (parseFloat(itemPrice.cost || 0) * ri.quantity);
                }
            });
        }

        let suggestedSplit = 100;
        if (totalRewardValue > 0) {
            if (crime.difficulty >= 6) {
                const factionProfit = totalRewardValue * 0.15;
                const remaining = totalRewardValue - factionProfit - totalConsumedCost;
                suggestedSplit = (remaining / totalRewardValue) * 100;
            } else {
                suggestedSplit = (1 - (totalConsumedCost / totalRewardValue)) * 100;
            }
        }
        
        return { suggestedSplit: suggestedSplit, totalCost: totalConsumedCost };
    }

    function attemptInjection(wrapper, input, crime, stats, attempt = 1) {
        const finalValue = Math.floor(Math.max(0, stats.suggestedSplit));
        log(`✍️ Attempt ${attempt}: #${crime.id} -> ${finalValue}% (Cost: $${stats.totalCost.toLocaleString()})`);

        try {
            input.setAttribute('data-mobile-synced', 'true');
            const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            valueSetter.call(input, finalValue);
            
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));

            setTimeout(() => {
                if (input.value != finalValue && attempt < 5) {
                    log(`🔄 React Reset on #${crime.id}. Retrying...`, '', 'warn');
                    attemptInjection(wrapper, input, crime, stats, attempt + 1);
                } else {
                    addStatusLabel(wrapper, input, finalValue);
                }
            }, 600);
        } catch (e) { log("Injection error", e, 'error'); }
    }

    function addStatusLabel(wrapper, input, value) {
        if (!wrapper.querySelector('.payout-note')) {
            const note = document.createElement('div');
            note.className = 'payout-note';
            note.style.cssText = 'color:#f7941d; font-size:11px; margin-top:4px; font-weight:bold;';
            note.innerText = `Suggested: ${value}%`;
            input.parentNode.appendChild(note);
        }
    }

    init();
})();

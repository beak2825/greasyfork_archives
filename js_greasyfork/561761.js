// ==UserScript==
// @name         OC Payout Companion
// @namespace    toby.torn.occompanion
// @version      1.6.8
// @description  Syncs splits from Revenant, fallback to local math if missing. Always Injects OC IDs. Fixed for SPA navigation.
// @author       Toby
// @match        https://the-revenant.com/oc2/
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      the-revenant.com
// @downloadURL https://update.greasyfork.org/scripts/561761/OC%20Payout%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/561761/OC%20Payout%20Companion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const USER_API_KEY = '';
    const DEBUG_MODE = false;
    const SERVER_URL = 'https://the-revenant.com';

    const IS_REVENANT = window.location.href.includes('the-revenant.com');
    const IS_TORN = window.location.href.includes('torn.com');

    let itemPriceMap = {};
    let isFetchingMath = false;

    const log = (msg, data = '', type = 'log') => {
        if (!DEBUG_MODE && type === 'log') return;
        const prefix = `[OC COMPANION] `;
        if (type === 'error') console.error(prefix + msg, data);
        else console.log(prefix + msg, data);
    };

    async function fetchFromServer(endpoint, method = "GET", body = {}) {
        log(`📡 Requesting: ${method} ${endpoint}`);
        if (!USER_API_KEY) return null;

        return new Promise((resolve) => {
            const url = method === "GET"
                ? `${SERVER_URL}${endpoint}?apiKey=${USER_API_KEY}`
                : `${SERVER_URL}${endpoint}`;

            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": USER_API_KEY
                },
                data: method === "POST" ? JSON.stringify({ ...body, apiKey: USER_API_KEY }) : null,
                withCredentials: true,
                onload: (res) => {
                    log(`📥 Server Response (${endpoint}): Status ${res.status}`);
                    try { resolve(JSON.parse(res.responseText)); } catch (e) { resolve(null); }
                },
                onerror: (err) => { log("❌ Network error", err, 'error'); resolve(null); }
            });
        });
    }

    if (IS_REVENANT) {
        const observer = new MutationObserver(() => {
            const crimeHeaders = document.querySelectorAll('.crime-header-row');
            const payoutData = GM_getValue('oc_payout_map', {});
            crimeHeaders.forEach(header => {
                const bannerRight = header.querySelector('.banner-right');
                if (bannerRight && (bannerRight.innerText.includes('Not Paid') || bannerRight.innerText.includes('Spawns Bidding War'))) {
                    const splitMatch = bannerRight.innerText.match(/Suggested Split:\s*([\d.]+)%/);
                    if (splitMatch) {
                        payoutData[header.dataset.crimeId] = Math.floor(parseFloat(splitMatch[1])).toString();
                    }
                }
            });
            GM_setValue('oc_payout_map', payoutData);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (IS_TORN) {
        const initTorn = async () => {
            log("Initializing SPA-aware observer...");
            const items = await fetchFromServer('/api/items', 'GET');
            if (items) itemPriceMap = items;

            // We observe the main content area which survives tab changes
            const tornObserver = new MutationObserver(() => {
                // Only act if we are on the Crimes tab
                if (!window.location.hash.includes('tab=crimes') && !window.location.href.includes('type=1')) return;

                const ocWrappers = document.querySelectorAll('[data-oc-id]');
                const payoutData = GM_getValue('oc_payout_map', {});

                ocWrappers.forEach(async (wrapper) => {
                    const ocId = wrapper.getAttribute('data-oc-id');
                    if (!ocId) return;

                    injectIdLabel(wrapper, ocId);

                    const splitInput = wrapper.querySelector('input[type="number"]');
                    if (splitInput && !splitInput.hasAttribute('data-companion-synced')) {
                        let targetVal = payoutData[ocId];

                        if (targetVal) {
                            log(`📦 Sync Hit #${ocId}: Found ${targetVal}% in storage.`);
                            injectValue(splitInput, targetVal, ocId);
                        }
                        else if (!isFetchingMath) {
                            log(`🕵️ No sync data for #${ocId}. Fetching server math...`);
                            targetVal = await calculateLocalPayout(ocId);
                            if (targetVal) injectValue(splitInput, targetVal, ocId);
                        }
                    }
                });
            });

            // Start observing the root app element
            tornObserver.observe(document.querySelector('#factionsApp') || document.body, {
                childList: true,
                subtree: true
            });
        };

        // ... (calculateLocalPayout, injectValue, injectIdLabel functions stay exactly the same as v2.5) ...

        async function calculateLocalPayout(targetOcId) {
            isFetchingMath = true;
            try {
                const crimes = await fetchFromServer('/api/organized-crimes', 'POST', { category: 'completed' });
                if (!crimes || !Array.isArray(crimes)) return null;
                const crime = crimes.find(c => c.id.toString() === targetOcId.toString());
                if (!crime) return null;
                const isPayableStatus = ["Successful", "Failure"].includes(crime.status);
                const isUnpaid = !crime.rewards?.payout?.percentage;
                if (!isPayableStatus || !isUnpaid) return null;
                const noReserveMap = {};
                crimes.forEach(c => { if (c.name === "No Reserve") noReserveMap[c.id] = c; });
                const parentCrime = noReserveMap[crime.previous_crime_id] || null;
                let totalConsumedCost = 0;
                const sumCosts = (c) => {
                    if (c.slots) {
                        c.slots.forEach(slot => {
                            const req = slot.item_requirement;
                            if (req && req.is_reusable === false) {
                                totalConsumedCost += parseFloat(itemPriceMap[req.id]?.cost || 0);
                            }
                        });
                    }
                };
                sumCosts(crime);
                if (parentCrime) sumCosts(parentCrime);
                let totalRewardValue = parseFloat(crime.rewards?.money) || 0;
                if (crime.rewards?.items) {
                    crime.rewards.items.forEach(ri => {
                        totalRewardValue += (parseFloat(itemPriceMap[ri.id]?.cost || 0) * ri.quantity);
                    });
                }
                let suggestedSplit = 100;
                if (totalRewardValue > 0) {
                    if (crime.difficulty >= 6) {
                        const factionProfit = totalRewardValue * 0.15;
                        suggestedSplit = ((totalRewardValue - factionProfit - totalConsumedCost) / totalRewardValue) * 100;
                    } else {
                        suggestedSplit = (1 - (totalConsumedCost / totalRewardValue)) * 100;
                    }
                }
                return Math.floor(Math.max(0, suggestedSplit)).toString();
            } catch (e) { return null; }
            finally { isFetchingMath = false; }
        }

        function injectValue(input, value, ocId) {
            input.setAttribute('data-companion-synced', 'true');
            const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            valueSetter.call(input, value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.style.border = "2px solid #f7941d";
            input.style.backgroundColor = "rgba(247, 148, 29, 0.05)";
        }

        function injectIdLabel(wrapper, ocId) {
            const titlePanel = wrapper.querySelector('[class*="panelTitle___"]');
            if (titlePanel && !titlePanel.querySelector('.toby-oc-id')) {
                const idSpan = document.createElement('span');
                idSpan.className = 'toby-oc-id';
                idSpan.style.cssText = 'font-size:14px; color:#f7941d; margin-left:10px; font-weight:bold; opacity:0.8;';
                idSpan.innerText = `#${ocId}`;
                titlePanel.appendChild(idSpan);
                log(`📍 Injected Label #${ocId}`);
            }
        }

        initTorn();
    }
})();
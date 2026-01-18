// ==UserScript==
// @name         Torn OC Loan Manager
// @namespace    https://torn.com
// @version      1.3.1
// @description  Highlights over-loaned items and helps loan missing OC tools + split calculator
// @author       Allenone [2033011]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557127/Torn%20OC%20Loan%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/557127/Torn%20OC%20Loan%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = '';
    const BLACKLISTED_ITEM_IDS = new Set([1012]);
    const color = '#0f0'; // #0f0 default

    const overAllocated = new Map();
    const memberNameMap = new Map();
    let membersLoaded = false;

    const armoryCache = new Map();
    let preparedArmoryID = null;
    let pendingArmoryItemID = null;

    // Split calculator
    const SCENARIOS = {
        "Ace in the Hole": {
            "Stacking the Deck": 6.8,
            "Ace in the Hole": 12.56
        },
        "Crane Reaction": {
            "Manifest Cruelty": 3.125,
            "Gone Fission": 5.7,
            "Crane Reaction": 8.167
        }
    };

    // ------------------- Utilities -------------------
    const getRfcvToken = () => {
        const match = document.cookie.match(/rfc_v=([^;]+)/);
        return match ? match[1] : null;
    };

    const isOnArmoryUtilities = () => {
        return location.hash.includes('#/tab=armoury') && location.hash.includes('sub=utilities');
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // ------------------- API Helpers -------------------
    const loadMembers = async () => {
        if (membersLoaded) return;
        const res = await fetch(`https://api.torn.com/v2/faction/members?key=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to load members');
        const data = await res.json();
        Object.values(data.members || {}).forEach(m => memberNameMap.set(m.id, m.name));
        membersLoaded = true;
    };

    const getMissingOCItems = async () => {
        const res = await fetch(`https://api.torn.com/v2/faction/crimes?cat=available&key=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to load OC data');
        const data = await res.json();

        const missing = [];
        data.crimes.forEach(crime => {
            crime.slots?.forEach(slot => {
                if (slot.item_requirement && !slot.item_requirement.is_available && slot.user?.id && !BLACKLISTED_ITEM_IDS.has(slot.item_requirement.id)) {
                    missing.push({
                        crimeName: crime.name,
                        position: slot.position,
                        itemID: slot.item_requirement.id,
                        userID: slot.user.id,
                        userName: memberNameMap.get(slot.user.id) || `Unknown [${slot.user.id}]`
                    });
                }
            });
        });
        return missing;
    };

    // ------------------- Armory Cache -------------------
    const fetchArmoryUtilitiesJSON = async () => {
        const rfcv = getRfcvToken();
        if (!rfcv) throw new Error('Missing RFCV token');

        const body = new URLSearchParams({
            step: 'armouryTabContent',
            type: 'utilities',
            start: '0',
            ajax: 'true'
        });

        const res = await fetch(`https://www.torn.com/factions.php?rfcv=${rfcv}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body,
            credentials: 'same-origin'
        });

        if (!res.ok) throw new Error('Failed to fetch armoury');
        const data = await res.json();
        if (!data?.items) throw new Error('Malformed response');
        return data.items;
    };

    const refreshArmoryCache = async () => {
        armoryCache.clear();
        const items = await fetchArmoryUtilitiesJSON();
        for (const entry of items) {
            if (entry.user === false && entry.qty > 0) {
                armoryCache.set(entry.itemID, { armoryID: entry.armoryID, qty: entry.qty });
            }
        }
    };

    const prepareArmouryForItem = async (itemID) => {
        if (!armoryCache.has(itemID)) await refreshArmoryCache();
        const entry = armoryCache.get(itemID);
        if (!entry || entry.qty <= 0) return null;
        preparedArmoryID = entry.armoryID;
        pendingArmoryItemID = itemID;
        return entry.armoryID;
    };

    // ------------------- Loaning -------------------
    const loanItem = async ({ armoryID, itemID, userID, userName }) => {
        const rfcv = getRfcvToken();
        if (!rfcv) throw new Error('Missing RFCV token');

        const body = new URLSearchParams({
            ajax: 'true',
            step: 'armouryActionItem',
            role: 'loan',
            item: armoryID,
            itemID: itemID,
            type: 'Tool',
            user: `${userName} [${userID}]`,
            quantity: '1'
        });

        const res = await fetch(`https://www.torn.com/factions.php?rfcv=${rfcv}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body,
            credentials: 'same-origin'
        });

        if (!res.ok) throw new Error('Loan request failed');
        const text = await res.text();
        if (!text.includes('success')) throw new Error('Loan failed');
    };

    const loanPreparedItem = async ({ userID, userName }) => {
        if (!preparedArmoryID || pendingArmoryItemID === null) throw new Error('Armoury not prepared');
        await loanItem({ armoryID: preparedArmoryID, itemID: pendingArmoryItemID, userID, userName });
        armoryCache.delete(pendingArmoryItemID);
        preparedArmoryID = null;
        pendingArmoryItemID = null;
    };

    // ------------------- Highlighting -------------------
    let highlightedRows = new Set();

    const clearHighlights = () => {
        highlightedRows.forEach(el => {
            if (el?.style) {
                el.style.outline = '';
                el.style.boxShadow = '';
            }
        });
        highlightedRows.clear();
    };

    const highlightOverAllocated = () => {
        clearHighlights();
        const container = document.querySelector('#armoury-utilities');
        if (!container) return;

        container.querySelectorAll('li.tt-overlay-ignore').forEach(li => {
            const loanedDiv = li.querySelector('.loaned');
            if (!loanedDiv) return;
            const link = loanedDiv.querySelector('a[href^="/profiles.php?XID="]');
            if (!link) return;
            const playerId = parseInt(link.href.match(/XID=(\d+)/)?.[1], 10);
            if (!playerId) return;
            const itemImg = li.querySelector('.img-wrap');
            const itemId = parseInt(itemImg?.getAttribute('data-itemid'), 10);
            if (!itemId) return;

            if (overAllocated.get(playerId)?.has(itemId)) {
                li.style.outline = `4px solid ${color}`;
                li.style.outlineOffset = '-2px';
                li.style.boxShadow = `0 0 15px ${color}`;
                li.style.transition = 'all 0.3s ease';
                highlightedRows.add(li);
            }
        });
    };

    // ------------------- UI -------------------
    const createUI = async () => {
        document.querySelectorAll('#oc-loan-btn, #oc-loan-panel').forEach(el => el.remove());

        const button = document.createElement('button');
        button.id = 'oc-loan-btn';
        button.textContent = 'OC Loans';
        button.style.cssText = `
            position:fixed; top:12px; right:12px; z-index:99999;
            padding:10px 20px; background:#000; color:${color}; border:2px solid ${color};
            border-radius:8px; font-weight:bold; cursor:pointer;
            box-shadow:0 0 15px rgba(0,255,0,0.3); transition:all 0.25s;
        `;
        button.onmouseover = () => { button.style.background = color; button.style.color = '#000'; };
        button.onmouseout = () => { button.style.background = '#000'; button.style.color = color; };

        const panel = document.createElement('div');
        panel.id = 'oc-loan-panel';
        panel.style.cssText = `
            position:fixed; top:70px; right:12px; width:420px; max-height:80vh;
            background:#000; border:2px solid ${color}; border-radius:10px;
            box-shadow:0 0 25px rgba(0,255,0,0.4); z-index:99998;
            opacity:0; visibility:hidden; transform:translateY(-10px);
            transition:all 0.3s; overflow:hidden; font-family:monospace;
        `;

        const style = document.createElement('style');
        style.textContent = `
            #oc-loan-panel .oc-tab { padding:8px 12px; background:#111; color:${color}; border:1px solid ${color};
                border-radius:6px; cursor:pointer; font-weight:bold; transition:0.2s; margin-right:6px; }
            #oc-loan-panel .oc-tab.active, #oc-loan-panel .oc-tab:hover { background:${color}; color:#000; }
            #oc-loan-panel #oc-content { padding:16px; max-height:calc(80vh - 70px); overflow-y:auto; color:${color}; }
            #oc-loan-panel #oc-close { cursor:pointer; font-size:24px; color:#f66; margin-left:auto; }
            #oc-loan-panel #oc-close:hover { color:#f00; }
            #oc-loan-panel #action-btn { width:100%; padding:14px; margin:16px 0 8px; background:#222; color:${color}; border:2px solid ${color}; border-radius:8px; cursor:pointer; font-weight:bold; font-size:15px; }
            #oc-loan-panel #action-btn.ready { background:${color}; color:#000; }
            #oc-loan-panel .navigate-btn { background:#222; color:${color}; border:2px solid ${color}; padding:12px; width:100%; border-radius:8px; font-weight:bold; cursor:pointer; }
            #oc-loan-panel .copy-btn { cursor:pointer; margin-left:8px; opacity:0.8; }
            #oc-loan-panel .copy-btn:hover { opacity:1; }
        `;
        document.head.appendChild(style);

        panel.innerHTML = `
            <div style="background:#000; padding:12px; border-bottom:2px solid ${color}; display:flex; align-items:center; flex-wrap:wrap; gap:6px;">
                <div style="display:flex; gap:6px;">
                    <button id="tab-unused" class="oc-tab active">Unused</button>
                    <button id="tab-missing" class="oc-tab">Missing</button>
                    <button id="tab-split" class="oc-tab">Split Calc</button>
                </div>
                <span id="oc-close">×</span>
            </div>
            <div id="oc-content"><em style="color:#666;">Select a tab...</em></div>
        `;

        document.body.appendChild(button);
        document.body.appendChild(panel);

        const content = panel.querySelector('#oc-content');
        const tabUnused = panel.querySelector('#tab-unused');
        const tabMissing = panel.querySelector('#tab-missing');
        const tabSplit = panel.querySelector('#tab-split');
        let isOpen = false;

        const openPanel = () => {
            isOpen = true;
            panel.style.opacity = '1';
            panel.style.visibility = 'visible';
            panel.style.transform = 'translateY(0)';
            if (tabUnused.classList.contains('active') && isOnArmoryUtilities()) highlightOverAllocated();
        };

        const closePanel = () => {
            isOpen = false;
            panel.style.opacity = '0';
            panel.style.visibility = 'hidden';
            panel.style.transform = 'translateY(-10px)';
            clearHighlights();
        };

        button.onclick = () => isOpen ? closePanel() : openPanel();
        panel.querySelector('#oc-close').onclick = closePanel;

        // Tabs
        tabUnused.onclick = async () => {
            [tabUnused, tabMissing, tabSplit].forEach(t => t.classList.remove('active'));
            tabUnused.classList.add('active');
            content.innerHTML = '<div style="text-align:center;padding:40px;">Loading unused loans...</div>';

            try {
                await loadMembers();
                overAllocated.clear();

                const [crimesRes, utilsRes] = await Promise.all([
                    fetch(`https://api.torn.com/v2/faction/crimes?cat=available&key=${API_KEY}`),
                    fetch(`https://api.torn.com/faction/?selections=utilities&key=${API_KEY}`)
                ]);

                const crimesData = await crimesRes.json();
                const utilsData = await utilsRes.json();

                const usedItems = new Map();
                crimesData.crimes.forEach(c => c.slots?.forEach(s => {
                    if (!s.user?.id || !s.item_requirement?.id) return;
                    const pid = s.user.id;
                    if (!usedItems.has(pid)) usedItems.set(pid, new Set());
                    usedItems.get(pid).add(s.item_requirement.id);
                }));

                const overList = [];
                (utilsData.utilities || []).forEach(u => {
                    if (!u.loaned || BLACKLISTED_ITEM_IDS.has(u.ID)) return;

                    const loanedTo = typeof u.loaned_to === 'number' ? [u.loaned_to] :
                    typeof u.loaned_to === 'string' ? u.loaned_to.split(',').map(x => parseInt(x.trim(), 10)).filter(Boolean) :
                    [];

                    loanedTo.forEach(pid => {
                        if (!usedItems.get(pid)?.has(Number(u.ID))) {
                            if (!overAllocated.has(pid)) overAllocated.set(pid, new Set());
                            overAllocated.get(pid).add(Number(u.ID));
                            overList.push({
                                name: memberNameMap.get(pid) || `Unknown [${pid}]`,
                                pid,
                                item: u.name,
                                iid: u.ID
                            });
                        }
                    });
                });

                overList.sort((a, b) => a.name.localeCompare(b.name));

                if (overList.length === 0) {
                    content.innerHTML = '<div style="text-align:center;padding:50px;font-size:18px;">All loaned items in use!</div>';
                } else {
                    const rows = overList.map(e => `
                        <tr style="border-bottom:1px solid #333;">
                            <td style="padding:12px 8px;">${e.name} <span style="font-size:11px;color:#0b0;">[${e.pid}]</span></td>
                            <td style="padding:12px 8px;">${e.item} <span style="font-size:11px;color:#0b0;">(${e.iid})</span></td>
                        </tr>
                    `).join('');
                    content.innerHTML = `
                        <div style="margin-bottom:12px;font-weight:bold;">${overList.length} unused loaned item${overList.length > 1 ? 's' : ''}</div>
                        <table style="width:100%;border-collapse:collapse;">
                            <thead><tr style="border-bottom:2px solid ${color};">
                                <th style="text-align:left;padding:8px;">Player</th>
                                <th style="text-align:left;padding:8px;">Item</th>
                            </tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    `;
                }

                if (isOnArmoryUtilities()) highlightOverAllocated();
            } catch (err) {
                content.innerHTML = `<div style="color:#f66;padding:20px;">Error: ${err.message}</div>`;
            }
        };

        tabMissing.onclick = async () => {
            [tabUnused, tabMissing, tabSplit].forEach(t => t.classList.remove('active'));
            tabMissing.classList.add('active');
            renderMissingTab();
        };

        const renderMissingTab = async () => {
            const onArmory = isOnArmoryUtilities();

            if (!onArmory) {
                content.innerHTML = `
                    <div style="text-align:center;padding:60px;">
                        <div style="margin-bottom:20px;font-size:15px;">Loan actions require the Armoury → Utilities tab</div>
                    </div>
                `;
                return;
            }

            let missingQueue = [];
            try {
                await loadMembers();
                missingQueue = await getMissingOCItems();
            } catch (err) {
                content.innerHTML = `<div style="color:#f66;padding:20px;">Error loading: ${err.message}</div>`;
                return;
            }

            if (missingQueue.length === 0) {
                content.innerHTML = '<div style="text-align:center;padding:50px;font-size:18px;">No missing OC items!</div>';
                return;
            }

            let index = 0;
            const renderCurrent = () => {
                const item = missingQueue[index];
                const isLoaded = armoryCache.has(item.itemID) && armoryCache.get(item.itemID).qty > 0;

                content.innerHTML = `
                    <div style="line-height:1.7; margin-bottom:16px;">
                        <strong style="font-size:17px;">${item.crimeName}</strong><br>
                        Position: ${item.position}<br>
                        Item ID: ${item.itemID}<br>
                        User: <span style="color:${color};">${item.userName}</span>
                    </div>
                    <button id="action-btn" class="${isLoaded ? 'ready' : ''}">
                        ${isLoaded ? `Loan Item (${index + 1}/${missingQueue.length})` : 'Load Armoury'}
                    </button>
                `;

                const actionBtn = content.querySelector('#action-btn');

                actionBtn.onclick = async () => {
                    actionBtn.disabled = true;
                    actionBtn.textContent = 'Processing...';

                    try {
                        if (!isLoaded) {
                            const armoryID = await prepareArmouryForItem(item.itemID);
                            if (!armoryID) throw new Error('Item not available in armoury');
                            renderCurrent();
                        } else {
                            if (
                                preparedArmoryID === null ||
                                pendingArmoryItemID !== item.itemID
                            ) {
                                const armoryID = await prepareArmouryForItem(item.itemID);
                                if (!armoryID) {
                                    throw new Error('Item not available in armoury');
                                }
                            }

                            await loanPreparedItem({
                                userID: item.userID,
                                userName: item.userName
                            });

                            index++;
                            if (index >= missingQueue.length) {
                                content.innerHTML =
                                    '<div style="text-align:center;padding:50px;font-size:18px;">All items loaned!</div>';
                            } else {
                                renderCurrent();
                            }
                        }
                    } catch (err) {
                        actionBtn.textContent = isLoaded ? `Loan Item (${index + 1}/${missingQueue.length})` : 'Load Armoury';
                        actionBtn.disabled = false;
                    }
                };
            };

            renderCurrent();
        };

        tabSplit.onclick = () => {
            [tabUnused, tabMissing, tabSplit].forEach(t => t.classList.remove('active'));
            tabSplit.classList.add('active');

            content.innerHTML = `
                <select id="split-scenario" style="width:100%; padding:10px; margin-bottom:12px; background:#111; color:${color}; border:1px solid ${color}; border-radius:6px;">
                    ${Object.keys(SCENARIOS).map(s => `<option>${s}</option>`).join('')}
                </select>
                <input id="split-total" type="text" placeholder="e.g. 597,150,000" style="width:-webkit-fill-available; padding:10px; margin-bottom:16px; background:#111; color:${color}; border:1px solid ${color}; border-radius:6px;">
                <div id="split-results" style="line-height:1.6;"></div>
            `;

            const select = content.querySelector('#split-scenario');
            const input = content.querySelector('#split-total');
            const results = content.querySelector('#split-results');

            const calculate = () => {
                const scenario = SCENARIOS[select.value];
                const raw = input.value.replace(/,/g, '');
                const total = parseFloat(raw);

                if (isNaN(total) || total <= 0) {
                    results.innerHTML = '<div style="color:#888; text-align:center; padding:20px;">Enter valid total</div>';
                    return;
                }

                results.innerHTML = `
        <table style="width:100%; border-collapse:collapse; line-height:1.6;">
            <thead>
                <tr style="border-bottom:1px solid ${color};">
                    <th style="text-align:left; padding:6px;">Scenario</th>
                    <th style="text-align:right; padding:6px;">%</th>
                    <th style="text-align:right; padding:6px;">Amount</th>
                    <th style="width:32px;"></th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(scenario).map(([role, percent]) => {
                    const amount = Math.floor(total * (percent / 100));
                    const formatted = formatNumber(amount);

                    return `
                        <tr style="border-bottom:1px solid #444;">
                            <td style="padding:6px; color:${color};">${role}</td>
                            <td style="padding:6px;  color:${color}; text-align:right;">${percent}%</td>
                            <td style="padding:6px;  color:${color}; text-align:right; font-weight:bold;">
                                $${formatted}
                            </td>
                            <td style="text-align:center;">
                                <span class="copy-btn" data-val="${amount}" style="cursor:pointer;">📋</span>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

                results.querySelectorAll('.copy-btn').forEach(btn => {
                    btn.onclick = async () => {
                        await navigator.clipboard.writeText(btn.dataset.val);
                        btn.textContent = '✅';
                        setTimeout(() => btn.textContent = '📋', 1500);
                    };
                });
            };


            select.onchange = calculate;
            input.oninput = () => {
                let v = input.value.replace(/,/g, '');
                if (/^\d*$/.test(v)) input.value = formatNumber(v);
                calculate();
            };
            calculate();
        };

        // Mutation observer for highlighting
        new MutationObserver(() => {
            if (isOpen && tabUnused.classList.contains('active') && isOnArmoryUtilities()) {
                highlightOverAllocated();
            }
        }).observe(document.body, { childList: true, subtree: true });

        // Re-render missing on navigation to armory
        window.addEventListener('hashchange', () => {
            if (isOpen && tabMissing.classList.contains('active')) {
                renderMissingTab();
            }
        });
    };

    createUI();
})();
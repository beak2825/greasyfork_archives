// ==UserScript==
// @name         Torn OC Loan Manager
// @namespace    https://torn.com
// @version      1.2
// @description  Highlights over-loaned items and helps loan missing OC tools
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
    const overAllocated = new Map(); // playerID → Set<itemID>
    const memberNameMap = new Map(); // playerID → name
    const BLACKLISTED_ITEM_IDS = new Set([1012]);
    let highlightedRows = new Set();
    let membersLoaded = false;
    let pendingArmoryItemID = null;
    let preparedArmoryID = null;
    let armouryLoaded = false;

    // ==================== UTILITIES ====================
    const waitForElement = (selector) => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) return resolve(document.querySelector(selector));
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        });
    };

    const getRfcvToken = () => {
        const match = document.cookie.match(/rfc_v=([^;]+)/);
        return match ? match[1] : null;
    };

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

            // check if this user has this item in overAllocated
            if (!overAllocated.get(playerId)?.has(itemId)) return;

            // highlight it
            li.style.outline = '4px solid #0f0';
            li.style.outlineOffset = '-2px';
            li.style.boxShadow = '0 0 15px #0f0';
            li.style.transition = 'all 0.3s ease';
            highlightedRows.add(li);
        });
    };

    const prepareArmouryForItem = async (itemID) => {
        if (!armoryCache.has(itemID)) {
            await refreshArmoryCache();
        }

        const entry = armoryCache.get(itemID);
        if (!entry || entry.qty <= 0) return null;

        preparedArmoryID = entry.armoryID;
        pendingArmoryItemID = itemID;
        return entry.armoryID;
    };

    // ==================== API HELPERS ====================
    const fetchAllPages = async (url, key = 'data') => {
        const items = [];
        while (url) {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const data = await res.json();
            items.push(...(data[key] || []));
            url = data._metadata?.links?.next || null;
        }
        return items;
    };

    const loadMembers = async () => {
        if (membersLoaded) return;
        const res = await fetch(`https://api.torn.com/v2/faction/members?key=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to load faction members');
        const data = await res.json();
        Object.values(data.members || {}).forEach(m => {
            memberNameMap.set(m.id, m.name);
        });
        membersLoaded = true;
    };

    const getMissingOCItems = async () => {
        const res = await fetch(`https://api.torn.com/v2/faction/crimes?cat=available&key=${API_KEY}`);
        if (!res.ok) throw new Error('Failed to load OC data');
        const data = await res.json();

        const missing = [];
        data.crimes.forEach(crime => {
            crime.slots?.forEach(slot => {
                if (
                    slot.item_requirement &&
                    !slot.item_requirement.is_available &&
                    slot.user?.id &&
                    !BLACKLISTED_ITEM_IDS.has(slot.item_requirement.id)
                ) {
                    missing.push({
                        crimeName: crime.name,
                        position: slot.position,
                        itemID: slot.item_requirement.id,
                        userID: slot.user.id
                    });
                }
            });
        });
        return missing;
    };

    // ==================== ARMORY CACHE ====================
    const armoryCache = new Map();

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

        if (!res.ok) throw new Error('Failed to fetch armoury utilities');

        const data = await res.json();
        if (!data?.items) throw new Error('Malformed armoury response');

        return data.items;
    };

    const refreshArmoryCache = async () => {
        armoryCache.clear();

        const items = await fetchArmoryUtilitiesJSON();

        for (const entry of items) {
            if (entry.user === false && entry.qty > 0) {
                armoryCache.set(entry.itemID, {
                    armoryID: entry.armoryID,
                    qty: entry.qty
                });
            }
        }

        armouryLoaded = true;
    };

    // ==================== LOANING LOGIC ====================
    const loanPreparedItem = async ({ userID, userName }) => {
        if (!preparedArmoryID || pendingArmoryItemID === null) {
            throw new Error('Armoury not prepared');
        }

        await loanItem({
            armoryID: preparedArmoryID,
            itemID: pendingArmoryItemID,
            userID,
            userName
        });

        // IMPORTANT: consuming an armoryID invalidates this item
        armoryCache.delete(pendingArmoryItemID);
        //armouryLoaded = false; // force reload only if same item appears again

        preparedArmoryID = null;
        pendingArmoryItemID = null;
    };

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
            credentials: 'same-origin',
            redirect: 'manual'
        });

        if (!res.ok) throw new Error('Loan request failed');
    };

    // ==================== UI ====================
    const createUI = async () => {
        // Remove old instances
        document.querySelectorAll('#oc-loan-btn, #oc-loan-panel').forEach(el => el.remove());

        const button = document.createElement('button');
        button.id = 'oc-loan-btn';
        button.textContent = 'OC Loans';
        button.style.cssText = `
            position: fixed; top: 12px; right: 12px; z-index: 99999;
            padding: 10px 18px; background: #000; color: #0f0; border: 2px solid #0f0;
            border-radius: 8px; font-family: monospace; font-weight: bold; cursor: pointer;
            box-shadow: 0 0 15px rgba(0,255,0,0.3); transition: all 0.25s ease;
        `;
        button.onmouseover = () => { button.style.background = '#0f0'; button.style.color = '#000'; };
        button.onmouseout = () => { button.style.background = '#000'; button.style.color = '#0f0'; };

        const panel = document.createElement('div');
        panel.id = 'oc-loan-panel';
        panel.style.cssText = `
            position: fixed; top: 70px; right: 12px; width: 420px; max-height: 80vh;
            background: #000; border: 2px solid #0f0; border-radius: 10px;
            box-shadow: 0 0 25px rgba(0,255,0,0.4); z-index: 99999;
            opacity: 0; visibility: hidden; transform: translateY(-10px);
            transition: all 0.3s ease; overflow: hidden; font-family: monospace;
        `;

        const style = document.createElement('style');
        style.textContent = `
            .oc-tab { padding: 8px 12px; background: #111; color: #0f0; border: 1px solid #0f0;
                      border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
            .oc-tab.active, .oc-tab:hover { background: #0f0; color: #000; }
            #oc-content { padding: 16px; max-height: calc(80vh - 70px); overflow-y: auto; }
            #oc-close { cursor: pointer; font-size: 24px; color: #f66; font-weight: bold; }
            #oc-close:hover { color: #f00; }
        `;
        document.head.appendChild(style);

        panel.innerHTML = `
            <div style="background:#000; padding:12px; border-bottom:2px solid #0f0; display:flex; align-items:center;">
                <div style="display:flex; gap:8px;">
                    <button id="tab-unused" class="oc-tab active">Unused Loans</button>
                    <button id="tab-missing" class="oc-tab">Missing Items</button>
                </div>
                <span id="oc-close" style="margin-left:auto;">×</span>
            </div>
            <div id="oc-content">
                <em style="color:#666;">Select a tab to begin...</em>
            </div>
        `;

        document.body.appendChild(button);
        document.body.appendChild(panel);

        const content = panel.querySelector('#oc-content');
        const tabUnused = panel.querySelector('#tab-unused');
        const tabMissing = panel.querySelector('#tab-missing');
        let isOpen = false;

        const openPanel = () => {
            isOpen = true;
            panel.style.opacity = '1';
            panel.style.visibility = 'visible';
            panel.style.transform = 'translateY(0)';
            highlightOverAllocated();
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
        panel.onclick = e => e.stopPropagation();

        // Tab: Unused Loans
        tabUnused.onclick = async () => {
            tabUnused.classList.add('active');
            tabMissing.classList.remove('active');
            content.innerHTML = '<div style="text-align:center;padding:40px;color:#0f0;">Loading...</div>';

            try {
                await loadMembers();
                overAllocated.clear();

                const [crimes, utilsData] = await Promise.all([
                    fetchAllPages(`https://api.torn.com/v2/faction/crimes?cat=available&key=${API_KEY}`, 'crimes'),
                    fetch(`https://api.torn.com/faction/?selections=utilities&key=${API_KEY}`).then(r => r.json())
                ]);

                const usedItems = new Map();
                crimes.forEach(c => c.slots?.forEach(s => {
                    if (!s.user?.id) return;

                    const pid = s.user.id;

                    if (!usedItems.has(pid)) {
                        usedItems.set(pid, new Set());
                    }

                    if (s.item_requirement?.id) {
                        usedItems.get(pid).add(s.item_requirement.id);
                    }
                }));

                const overList = [];
                (utilsData.utilities || []).forEach(u => {
                    if (!u.loaned) return;
                    if (BLACKLISTED_ITEM_IDS.has(u.ID)) return;

                    const loanedTo = (() => {
                        if (!u.loaned_to) return [];
                        if (typeof u.loaned_to === 'number') return [u.loaned_to];
                        if (typeof u.loaned_to === 'string') {
                            return u.loaned_to
                                .split(',')
                                .map(x => parseInt(x.trim(), 10))
                                .filter(Boolean);
                        }
                        return [];
                    })();

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
                    content.innerHTML = '<div style="text-align:center;padding:50px;color:#0f0;font-size:18px;">All loaned items are in use!</div>';
                } else {
                    const rows = overList.map(e => `
                        <tr style="border-bottom:1px solid #333;">
                            <td style="padding:12px 8px; color:#0f0;">${e.name} <span style="font-size:11px;color:#0b0;">[${e.pid}]</span></td>
                            <td style="padding:12px 8px; color:#0f0;">${e.item} <span style="font-size:11px;color:#0b0;">(${e.iid})</span></td>
                        </tr>
                    `).join('');

                    content.innerHTML = `
                        <div style="margin-bottom:12px;font-weight:bold;">${overList.length} unused loaned item${overList.length > 1 ? 's' : ''}</div>
                        <table style="width:100%;border-collapse:collapse;">
                            <thead>
                                <tr style="border-bottom:2px solid #0f0;">
                                    <th style="text-align:left;padding:8px;">Player</th>
                                    <th style="text-align:left;padding:8px;">Item</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    `;
                }

                setTimeout(highlightOverAllocated, 300);
            } catch (err) {
                content.innerHTML = `<div style="color:#f66;padding:20px;">Error: ${err.message}</div>`;
                console.error(err);
            }
        };

        // Tab: Missing Items
        tabMissing.onclick = async () => {
            tabMissing.classList.add('active');
            tabUnused.classList.remove('active');
            content.innerHTML = '<div style="text-align:center;padding:40px;color:#0f0;">Loading missing items...</div>';

            try {
                await loadMembers();
                const missingQueue = await getMissingOCItems();

                if (missingQueue.length === 0) {
                    content.innerHTML = '<div style="text-align:center;padding:50px;color:#0f0;font-size:18px;">No missing OC items!</div>';
                    return;
                }

                let index = 0;
                const renderCurrent = () => {
                    const item = missingQueue[index];
                    const userName = memberNameMap.get(item.userID) || `Unknown [${item.userID}]`;

                    content.innerHTML = `
                        <div style="margin-bottom:16px; line-height:1.5;">
                            <strong style="font-size:16px;">${item.crimeName}</strong><br>
                            <span style="color:#aaa;">Position: ${item.position}</span><br>
                            <span style="color:#aaa;">Item ID: ${item.itemID}</span><br>
                            <span style="color:#0f0;">User: ${userName}</span>
                        </div>
                        <button id="prepare-btn"
                            style="width:100%; padding:10px; margin-bottom:8px;
                            background:#222; color:#0f0; border:2px solid #0f0;
                            border-radius:8px; cursor:pointer; font-weight:bold;">
                        Load Armoury
                        </button>

                        <button id="loan-next-btn" disabled
                            style="width:100%; padding:12px;
                            background:#333; color:#666;
                            border:none; border-radius:8px;
                            cursor:not-allowed; font-weight:bold; font-size:15px;">
                        Loan Item (${index + 1}/${missingQueue.length})
                        </button>

                        <div id="prep-status" style="margin-top:6px;color:#666;font-size:12px;">
                            Armoury not Loaded.
                        </div>`;

                    const loanBtn = document.getElementById('loan-next-btn');
                    const prepStatus = document.getElementById('prep-status');

                    if (armoryCache.has(item.itemID)) {
                        preparedArmoryID = armoryCache.get(item.itemID).armoryID;
                        pendingArmoryItemID = item.itemID;

                        loanBtn.disabled = false;
                        loanBtn.style.background = '#0f0';
                        loanBtn.style.color = '#000';
                        loanBtn.style.cursor = 'pointer';

                        prepStatus.textContent = 'Armoury already loaded.';
                    }

                    document.getElementById('prepare-btn').onclick = async () => {
                        try {
                            const armoryID = await prepareArmouryForItem(item.itemID); // ✔ POST here
                            if (!armoryID) {
                                alert('Item not available in armoury');
                                return;
                            }

                            // enable loan button
                            const loanBtn = document.getElementById('loan-next-btn');
                            loanBtn.disabled = false;
                            loanBtn.style.background = '#0f0';
                            loanBtn.style.color = '#000';
                            loanBtn.style.cursor = 'pointer';

                            document.getElementById('prep-status').textContent =
                                `Prepared (armoryID ${armoryID})`;

                        } catch (err) {
                            alert(`Prepare failed: ${err.message}`);
                        }
                    };

                    document.getElementById('loan-next-btn').onclick = async () => {
                        try {
                            await loanPreparedItem({
                                userID: item.userID,
                                userName
                            });

                            index++;
                            if (index >= missingQueue.length) {
                                content.innerHTML =
                                    '<div style="text-align:center;padding:50px;color:#0f0;font-size:18px;">All items loaned!</div>';
                            } else {
                                renderCurrent();
                            }

                        } catch (err) {
                            alert(`Loan failed: ${err.message}`);
                        }
                    };
                };

                renderCurrent();
            } catch (err) {
                content.innerHTML = `<div style="color:#f66;padding:20px;">Error: ${err.message}</div>`;
                console.error(err);
            }
        };

        // Highlight on armoury changes
        let highlightTimeout;
        new MutationObserver(() => {
            if (isOpen) {
                clearTimeout(highlightTimeout);
                highlightTimeout = setTimeout(highlightOverAllocated, 300);
            }
        }).observe(document.body, { childList: true, subtree: true });
    };

    createUI();
})();
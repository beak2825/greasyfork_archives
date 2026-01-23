// ==UserScript==
// @name         Torn Market Listing Binder
// @namespace    torn-mugging-bot
// @version      1.9.3
// @description  Sends market listing data to mugging bot server when viewing items
// @author       BaM
// @license      All Rights Reserved
// @match        https://www.torn.com/imarket.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563552/Torn%20Market%20Listing%20Binder.user.js
// @updateURL https://update.greasyfork.org/scripts/563552/Torn%20Market%20Listing%20Binder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SERVER_URL = 'http://157.180.17.47:3000';
    const BINDING_ENDPOINT = SERVER_URL + '/api/listing-binding';
    const SCRIPT_VERSION = '1.9.3';

    const MONITORED_ITEMS = new Set([
        1118, 1119, 1120, 1121, 1122,
        23, 24, 25, 26, 27, 28, 29, 30, 31, 63,
        174, 219, 223, 228, 231, 232, 241, 249, 1157,
        398, 399, 484, 486, 612, 837, 1155, 1156,
        109, 240, 1152, 1153,
        9, 11, 146, 217, 237, 247, 391, 395, 614, 615,
        453, 455, 456, 457, 458, 459,
        103, 283, 367, 428,
        106, 329, 330, 331, 421,
        655, 656, 657, 658, 659,
        660, 661, 662, 663, 664,
        665, 666, 667, 668, 669,
        670, 671, 672, 673, 674,
        675, 676, 677, 678, 679,
        680, 681, 682, 683, 684,
        1307, 1308, 1309, 1310, 1311,
        1355, 1356, 1357, 1358, 1359
    ]);

    const NON_UID_ITEMS = new Set([
        1118, 1119, 1120, 1121, 1122,
        453, 455, 456, 457, 458, 459,
        103, 283, 367, 428,
        106, 329, 330, 331, 421
    ]);

    let isEnabled = GM_getValue('binderEnabled', true);
    let isSilentMode = GM_getValue('silentMode', false);

    const domCache = { container: null, toggle: null, dot: null, label: null, silent: null, flash: null };
    let saveTimeout = null;
    let flashTimeout = null;

    function saveState(key, value) {
        if (key === 'binderEnabled') isEnabled = value;
        if (key === 'silentMode') isSilentMode = value;
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => GM_setValue(key, value), 100);
    }

    function getToggleBackground() {
        if (!isEnabled) return '#6c757d';
        if (isSilentMode) return '#5a6268';
        return '#28a745';
    }

    function getDotColor() {
        if (!isEnabled) return '#aaa';
        return '#90EE90';
    }

    function getLabelText() {
        if (!isEnabled) return 'Binder: OFF';
        if (isSilentMode) return 'Binder: ON (Silent)';
        return 'Binder: ON';
    }

    function updateUI() {
        const toggle = domCache.toggle || document.getElementById('_mb_t');
        const dot = domCache.dot || document.getElementById('_mb_d');
        const label = domCache.label || document.getElementById('_mb_l');
        const silent = domCache.silent || document.getElementById('_mb_s');

        if (toggle && dot && label) {
            toggle.style.background = getToggleBackground();
            dot.style.background = getDotColor();
            label.textContent = getLabelText();
        }

        if (silent) {
            silent.style.background = isSilentMode ? '#6f42c1' : '#495057';
            silent.textContent = isSilentMode ? '🔇' : '🔔';
        }
    }

    function toggleEnabled() {
        isEnabled = !isEnabled;
        saveState('binderEnabled', isEnabled);
        updateUI();
        if (!isSilentMode) {
            showFlash(isEnabled ? '✅ Binder Enabled' : '⏸️ Binder Disabled', isEnabled ? '#28a745' : '#6c757d');
        }
    }

    function toggleSilent() {
        isSilentMode = !isSilentMode;
        saveState('silentMode', isSilentMode);
        updateUI();
        showFlash(isSilentMode ? '🔇 Silent Mode ON' : '🔔 Notifications ON', isSilentMode ? '#6f42c1' : '#28a745');
    }

    function createGUI() {
        const container = document.createElement('div');
        container.id = '_mb_c';
        container.style.cssText = 'position:fixed;top:10px;right:10px;z-index:999999;font-family:system-ui,-apple-system,sans-serif;font-size:12px;display:flex;flex-direction:column;gap:5px';

        const row = document.createElement('div');
        row.id = '_mb_tr';
        row.style.cssText = 'display:flex;align-items:center;gap:5px';

        const toggle = document.createElement('div');
        toggle.id = '_mb_t';
        toggle.style.cssText = 'background:' + getToggleBackground() + ';color:white;padding:8px 12px;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;gap:8px;user-select:none;transition:background 0.2s';

        const dot = document.createElement('span');
        dot.id = '_mb_d';
        dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:' + getDotColor();

        const label = document.createElement('span');
        label.id = '_mb_l';
        label.textContent = getLabelText();

        toggle.appendChild(dot);
        toggle.appendChild(label);
        toggle.addEventListener('click', toggleEnabled);

        const silentBtn = document.createElement('div');
        silentBtn.id = '_mb_s';
        silentBtn.title = 'Silent Mode - No popup notifications';
        silentBtn.style.cssText = 'background:' + (isSilentMode ? '#6f42c1' : '#495057') + ';color:white;padding:8px 10px;border-radius:6px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);user-select:none;transition:background 0.2s;font-size:14px';
        silentBtn.textContent = isSilentMode ? '🔇' : '🔔';
        silentBtn.addEventListener('click', toggleSilent);

        row.appendChild(toggle);
        row.appendChild(silentBtn);
        container.appendChild(row);
        document.body.appendChild(container);

        domCache.container = container;
        domCache.toggle = toggle;
        domCache.dot = dot;
        domCache.label = label;
        domCache.silent = silentBtn;
    }

    function showFlash(message, bgColor = '#28a745', duration = 3000) {
        let flash = domCache.flash;
        if (!flash) {
            flash = document.createElement('div');
            flash.id = '_mb_fl';
            flash.style.cssText = 'position:fixed;top:50px;left:50%;transform:translateX(-50%);color:#fff;padding:10px 20px;border-radius:5px;box-shadow:0px 4px 6px rgba(0,0,0,0.2);z-index:999999;font-size:14px;text-align:center;font-family:system-ui,-apple-system,sans-serif;white-space:pre-line;transition:opacity 0.2s;opacity:0;pointer-events:none';
            document.body.appendChild(flash);
            domCache.flash = flash;
        }
        clearTimeout(flashTimeout);
        flash.textContent = message;
        flash.style.backgroundColor = bgColor;
        flash.style.color = bgColor === '#ffc107' ? '#000' : '#fff';
        flash.style.opacity = '1';
        flashTimeout = setTimeout(() => { flash.style.opacity = '0'; }, duration);
    }

    function showSuccess(msg, dur = 3000) { showFlash(msg, '#28a745', dur); }
    function showError(msg, dur = 3000) { showFlash(msg, '#dc3545', dur); }
    function showWarning(msg, dur = 3000) { showFlash(msg, '#ffc107', dur); }

    const { fetch: originalFetch } = unsafeWindow;
    const recentRequests = new Map();
    const DEBOUNCE_MS = 2000;

    unsafeWindow.fetch = async (...args) => {
        const response = await originalFetch(...args);

        if (args[0].includes('page.php?sid=iMarket&step=getListing')) {
            if (!isEnabled) return response;

            let requestData = {};
            if (args[1] && args[1].body) {
                args[1].body.forEach((v, k) => (requestData[k] = v));
            }

            const itemID = parseInt(requestData.itemID);
            if (!MONITORED_ITEMS.has(itemID)) return response;

            const armouryID = requestData.armouryID;
            const hasArmoury = armouryID && armouryID !== '0' && armouryID !== 0;
            const now = Date.now();

            if (hasArmoury) {
                const lastSent = recentRequests.get(armouryID);
                if (lastSent && (now - lastSent) < DEBOUNCE_MS) return response;
                recentRequests.set(armouryID, now);
            }

            if (recentRequests.size > 100) {
                for (const [id, time] of recentRequests) {
                    if (now - time > DEBOUNCE_MS * 5) recentRequests.delete(id);
                }
            }

            const requestArmouryID = requestData.armouryID;
            const hasRequestUid = requestArmouryID && requestArmouryID !== '0' && requestArmouryID !== 0;
            
            response.clone().json().then(data => {
                if (!data.list || !Array.isArray(data.list)) {
                    console.log('[Binder] No list data in response');
                    return;
                }

                console.log(`[Binder] Processing item ${itemID}, ${data.list.length} listings found`);
                if (hasRequestUid) {
                    console.log(`[Binder] Request armouryID: ${requestArmouryID} (clicked item's UID)`);
                }
                
                const isUidItem = !NON_UID_ITEMS.has(itemID);
                const canUseRequestUid = isUidItem && hasRequestUid && data.list.length === 1;

                const bindings = [];
                data.list.forEach((listing, index) => {
                    const userID = listing.user?.ID || 0;
                    const listingID = listing.listingID;
                    const price = listing.price || 0;
                    const quantity = listing.available || listing.quantity || listing.amount || 1;
                    
                    let listingUid = '';
                    if (canUseRequestUid && index === 0) {
                        listingUid = requestArmouryID;
                        console.log(`[Binder] Sending armouryID ${listingUid} for listing ${listingID}`);
                    }
                    
                    bindings.push(`${itemID}|${listingID}|${userID}|${listingUid}|${price}|${quantity}`);
                });

                if (isUidItem) {
                    console.log(`[Binder] UID item ${itemID} - server will match by item_uid (from API) + composite verification`);
                } else {
                    console.log(`[Binder] Non-UID item ${itemID} - using COMPOSITE matching`);
                }

                if (bindings.length === 0) {
                    console.log('[Binder] No bindings to send');
                    return;
                }
                console.log(`[Binder] Sending ${bindings.length} bindings to server...`);
                sendBindings(bindings);
            }).catch(e => { console.error('[Binder] Error parsing response:', e); });
        }

        return response;
    };

    function sendBindings(data) {
        const batchSize = 50;

        if (data.length > batchSize) {
            const batches = [];
            for (let i = 0; i < data.length; i += batchSize) {
                batches.push(data.slice(i, i + batchSize));
            }

            const combined = { processed: 0, updated: 0, alreadyBound: 0, anonymousTracked: 0, pending: 0, rejected: 0, notMonitored: 0, errors: 0 };
            let batchErrors = 0;
            let batchIndex = 0;

            const sendNext = () => {
                if (batchIndex >= batches.length) {
                    showNotification(combined, batchErrors);
                    return;
                }
                const batch = batches[batchIndex];
                batchIndex++;
                sendBatch(batch, (result, hadError) => {
                    if (result) {
                        combined.processed += result.processed || 0;
                        combined.updated += result.updated || 0;
                        combined.alreadyBound += result.alreadyBound || 0;
                        combined.anonymousTracked += result.anonymousTracked || 0;
                        combined.pending += result.pending || result.notFound || 0;
                        combined.rejected += result.rejected || 0;
                        combined.notMonitored += result.notMonitored || 0;
                        combined.errors += result.errors || 0;
                    }
                    if (hadError) batchErrors++;
                    setTimeout(sendNext, 200);
                });
            };
            sendNext();
            return;
        }

        sendBatch(data, (result, hadError) => {
            if (hadError) return;
            if (result) showNotification(result, 0);
        });
    }

    function sendBatch(data, callback) {
        console.log(`[Binder] Sending batch of ${data.length} to ${BINDING_ENDPOINT}`);
        GM_xmlhttpRequest({
            method: 'POST',
            url: BINDING_ENDPOINT,
            headers: { 
                'Content-Type': 'application/json',
                'X-Userscript-Version': SCRIPT_VERSION
            },
            data: JSON.stringify(data),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.error === 'outdated_version') {
                        console.error('[Binder] ❌ Outdated version:', result.message);
                        showError('❌ ' + result.message, 10000);
                        callback(null, true);
                        return;
                    }
                    console.log('[Binder] Server response:', result);
                    callback(result, false);
                } catch (e) {
                    console.error('[Binder] Failed to parse response:', response.responseText);
                    if (!isSilentMode) showError('❌ Server error: Could not parse response');
                    callback(null, true);
                }
            },
            onerror: function(err) {
                console.error('[Binder] Connection error:', err);
                if (!isSilentMode) showError('❌ Could not connect to server. Is it running?');
                callback(null, true);
            },
            ontimeout: function() {
                console.error('[Binder] Request timed out');
                if (!isSilentMode) showError('❌ Server request timed out');
                callback(null, true);
            },
            timeout: 15000
        });
    }

    function showNotification(result, batchErrors) {
        if (isSilentMode) return;

        const lines = [];
        if (result.updated > 0) lines.push('✅ Bound: ' + result.updated);
        if (result.alreadyBound > 0) lines.push('🔗 Already bound: ' + result.alreadyBound);
        if (result.anonymousTracked > 0) lines.push('👁️ New anonymous: ' + result.anonymousTracked);
        if (result.pending > 0) lines.push('⏳ Queued: ' + result.pending);
        if (result.rejected > 0) lines.push('🚫 Filtered: ' + result.rejected);
        if (result.notMonitored > 0) lines.push('⛔ Not monitored: ' + result.notMonitored);
        if (result.errors > 0) lines.push('❌ Errors: ' + result.errors);
        if (batchErrors > 0) lines.push('⚠️ Failed batches: ' + batchErrors);

        const message = lines.length > 0 ? lines.join('\n') : '✅ Request processed';
        const isSuccess = (result.updated > 0 || result.alreadyBound > 0 || result.anonymousTracked > 0 || result.pending > 0) && result.errors === 0 && result.rejected === 0 && result.notMonitored === 0 && batchErrors === 0;
        const duration = isSuccess ? 500 : 3000;
        const allSkipped = (result.rejected + result.notMonitored) === result.processed && result.updated === 0 && result.alreadyBound === 0 && result.anonymousTracked === 0;

        if (allSkipped) {
            showWarning(message, duration);
        } else if (result.updated > 0 || result.alreadyBound > 0 || result.anonymousTracked > 0 || result.pending > 0) {
            showSuccess(message, duration);
        } else {
            showError(message, duration);
        }
    }

    createGUI();
    console.log('✅ Torn Market Listing Binder v' + SCRIPT_VERSION + ' loaded (' + (isEnabled ? 'ENABLED' : 'DISABLED') + (isSilentMode ? ' - SILENT' : '') + ') - Monitoring ' + MONITORED_ITEMS.size + ' items');
})();


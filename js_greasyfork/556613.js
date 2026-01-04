// ==UserScript==
// @name         TORN Shoplifting Jewelry Panel (single API caller)
// @namespace    https://torn.com/
// @version      1.2
// @description  Floating panel showing jewelry store cameras/guard status from Torn API (only one tab calls API)
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addValueChangeListener
// @connect      api.torn.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556613/TORN%20Shoplifting%20Jewelry%20Panel%20%28single%20API%20caller%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556613/TORN%20Shoplifting%20Jewelry%20Panel%20%28single%20API%20caller%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const POSITION_LEFT_KEY = 'tornPanelLeft';
    const POSITION_TOP_KEY = 'tornPanelTop';
    const API_KEY_STORAGE = 'tornApiKey';

    const LEADER_KEY = 'tornShopliftLeader';
    const DATA_KEY = 'tornShopliftData';

    const FETCH_INTERVAL_MS = 60 * 1000;
    const STALE_LEADER_MS = 90 * 1000;

    const TAB_ID = Math.random().toString(16).slice(2) + String(Date.now());

    let currentApiKey = '';
    let fetchIntervalId = null;
    let leaderCheckIntervalId = null;

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'torn-shoplift-panel';
        panel.style.position = 'fixed';
        panel.style.zIndex = '999999';
        panel.style.background = 'rgba(20, 20, 20, 0.9)';
        panel.style.color = '#eee';
        panel.style.padding = '6px 8px';
        panel.style.border = '1px solid #444';
        panel.style.borderRadius = '6px';
        panel.style.fontSize = '12px';
        panel.style.minWidth = '220px';
        panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';

        const savedLeft = GM_getValue(POSITION_LEFT_KEY, 20);
        const savedTop = GM_getValue(POSITION_TOP_KEY, 80);
        panel.style.left = savedLeft + 'px';
        panel.style.top = savedTop + 'px';

        panel.innerHTML = `
            <div id="torn-shoplift-panel-header"
                 style="cursor: move; font-weight: bold; margin: -6px -8px 6px -8px; padding: 4px 8px; background:#333; border-radius:6px 6px 0 0;">
                TORN Shoplifting
            </div>
            <div style="margin-bottom:4px;">
                <label style="display:block; font-size:11px; margin-bottom:2px;">API key:</label>
                <input type="password" id="torn-shoplift-api-input"
                       style="width: 100%; box-sizing:border-box; font-size:11px; padding:2px 4px;" />
            </div>
            <div id="torn-shoplift-status" style="font-size:11px; margin-bottom:4px;">
                Waiting for API key...
            </div>
            <div id="torn-shoplift-jewelry"
                 style="font-size:12px; font-weight:bold;">
                Jewelry_store: Cameras: -, Guard: -
            </div>
        `;

        document.body.appendChild(panel);

        makePanelDraggable(panel);
        setupApiKey(panel);
        return panel;
    }

    function makePanelDraggable(panel) {
        const header = panel.querySelector('#torn-shoplift-panel-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        header.addEventListener('mousedown', function (e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(panel.style.left, 10) || 0;
            startTop = parseInt(panel.style.top, 10) || 0;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            const maxLeft = window.innerWidth - panel.offsetWidth;
            const maxTop = window.innerHeight - panel.offsetHeight;
            newLeft = Math.max(0, Math.min(maxLeft, newLeft));
            newTop = Math.max(0, Math.min(maxTop, newTop));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
        }

        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            const left = parseInt(panel.style.left, 10) || 0;
            const top = parseInt(panel.style.top, 10) || 0;
            GM_setValue(POSITION_LEFT_KEY, left);
            GM_setValue(POSITION_TOP_KEY, top);
        }
    }

    function setupApiKey(panel) {
        const input = panel.querySelector('#torn-shoplift-api-input');
        const savedKey = GM_getValue(API_KEY_STORAGE, '');

        if (savedKey) {
            input.value = savedKey;
            currentApiKey = savedKey;
        }

        input.addEventListener('change', function () {
            const key = input.value.trim();
            GM_setValue(API_KEY_STORAGE, key);
            currentApiKey = key;
            onApiKeyChanged();
        });

        GM_addValueChangeListener(API_KEY_STORAGE, function (name, oldVal, newVal, remote) {
            if (!remote) return;
            const inputEl = document.getElementById('torn-shoplift-api-input');
            if (inputEl && typeof newVal === 'string') {
                inputEl.value = newVal;
            }
            currentApiKey = newVal || '';
            onApiKeyChanged();
        });

        onApiKeyChanged();
    }

    function onApiKeyChanged() {
        stopFetching();
        if (!currentApiKey) {
            updateStatus('Waiting for API key...');
            updateJewelryDisplay(null, null);
            return;
        }
        evaluateLeadership();
    }

    function setupDataListener() {
        GM_addValueChangeListener(DATA_KEY, function (name, oldVal, newVal, remote) {
            if (!newVal) return;
            try {
                const obj = JSON.parse(newVal);
                applySharedData(obj);
            } catch (e) {
                console.error('Error parsing shared data', e);
            }
        });

        const initialRaw = GM_getValue(DATA_KEY, null);
        if (initialRaw) {
            try {
                const obj = JSON.parse(initialRaw);
                applySharedData(obj);
            } catch (e) {
                // ignore
            }
        }
    }

    function applySharedData(obj) {
        if (!obj) return;
        if (typeof obj.camerasStatus !== 'undefined' && typeof obj.guardStatus !== 'undefined') {
            updateJewelryDisplay(obj.camerasStatus, obj.guardStatus);
        }
        if (obj.lastUpdate) {
            const d = new Date(obj.lastUpdate);
            if (!isNaN(d.getTime())) {
                updateStatus('Last update: ' + d.toLocaleTimeString());
            }
        }
    }

    function setupLeadership() {
        GM_addValueChangeListener(LEADER_KEY, function (name, oldVal, newVal, remote) {
            if (!remote) return;
            evaluateLeadership();
        });

        startLeaderCheckLoop();
        evaluateLeadership();
    }

    function startLeaderCheckLoop() {
        if (leaderCheckIntervalId) return;
        leaderCheckIntervalId = setInterval(function () {
            evaluateLeadership();
        }, 15000);
    }

    function readLeader() {
        const raw = GM_getValue(LEADER_KEY, '');
        if (!raw) {
            return { leaderId: null, ts: 0 };
        }
        const parts = String(raw).split('|');
        return {
            leaderId: parts[0] || null,
            ts: parseInt(parts[1] || '0', 10) || 0
        };
    }

    function evaluateLeadership() {
        if (!currentApiKey) {
            stopFetching();
            return;
        }
        const now = Date.now();
        const info = readLeader();

        if (!info.leaderId || (now - info.ts) > STALE_LEADER_MS) {
            GM_setValue(LEADER_KEY, TAB_ID + '|' + now);
            ensureFetchRunning();
        } else if (info.leaderId === TAB_ID) {
            ensureFetchRunning();
        } else {
            stopFetching();
        }
    }

    function ensureFetchRunning() {
        if (fetchIntervalId) return;
        fetchShoplifting();
        fetchIntervalId = setInterval(fetchShoplifting, FETCH_INTERVAL_MS);
    }

    function stopFetching() {
        if (fetchIntervalId) {
            clearInterval(fetchIntervalId);
            fetchIntervalId = null;
        }
    }

    function fetchShoplifting() {
        const apiKey = currentApiKey;
        if (!apiKey) {
            stopFetching();
            return;
        }

        GM_setValue(LEADER_KEY, TAB_ID + '|' + Date.now());

        const url = 'https://api.torn.com/torn/?selections=shoplifting&key=' + encodeURIComponent(apiKey);
        updateStatus('Loading shoplifting data...');

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);

                    if (data.error) {
                        const msg = data.error.error || data.error.error_msg || 'Unknown error';
                        updateStatus('API error: ' + msg);
                        return;
                    }

                    if (!data.shoplifting || !data.shoplifting.jewelry_store) {
                        updateStatus('No jewelry_store data in response.');
                        return;
                    }

                    const jewelry = data.shoplifting.jewelry_store;

                    const camerasEntry = jewelry.find(e => /camera/i.test(e.title));
                    const guardEntry = jewelry.find(e => /guard/i.test(e.title));

                    const camerasStatus = (camerasEntry && camerasEntry.disabled === false) ? 'enabled' : 'disabled';
                    const guardStatus = (guardEntry && guardEntry.disabled === false) ? 'on' : 'off';

                    const shared = {
                        camerasStatus: camerasStatus,
                        guardStatus: guardStatus,
                        lastUpdate: Date.now()
                    };

                    GM_setValue(DATA_KEY, JSON.stringify(shared));

                    applySharedData(shared);

                } catch (e) {
                    console.error('JSON parse error', e, response.responseText);
                    updateStatus('Error parsing response JSON.');
                }
            },
            onerror: function () {
                updateStatus('Network error calling API.');
            }
        });
    }

    function updateStatus(text) {
        const el = document.getElementById('torn-shoplift-status');
        if (el) el.textContent = text;
    }

    function updateJewelryDisplay(camerasStatus, guardStatus) {
        const el = document.getElementById('torn-shoplift-jewelry');
        if (!el) return;

        if (!camerasStatus && !guardStatus) {
            el.style.color = '#eee';
            el.textContent = 'Jewelry_store: Cameras: -, Guard: -';
            return;
        }


        let cameraColor = '#eee';
        if (camerasStatus === 'disabled') cameraColor = 'limegreen';
        else if (camerasStatus === 'enabled') cameraColor = 'red';

        let guardColor = '#eee';
        if (guardStatus === 'off') guardColor = 'limegreen';
        else if (guardStatus === 'on') guardColor = 'red';

        el.innerHTML =
            'Jewelry_store: ' +
            'Cameras: <span style="color:' + cameraColor + ';">' +
            (camerasStatus || '-') +
            '</span>, ' +
            'Guard: <span style="color:' + guardColor + ';">' +
            (guardStatus || '-') +
            '</span>';
    }



    function init() {
        if (!document.body) return;
        createPanel();
        setupDataListener();
        setupLeadership();
    }

    init();
})();

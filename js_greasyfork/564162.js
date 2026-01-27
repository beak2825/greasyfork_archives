// ==UserScript==
// @name         Hasoth's My Today Prayer
// @namespace    torn.rings.float
// @version      3.26.0
// @description  My Today Prayer for Torn - Restored UI & Original Drag + Efficient Log Check
// @author       Hasoth [4042954]
// @match        https://www.torn.com/*
// @grant        GM.addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @require      https://www.torn.com/js/script/lib/jquery-1.8.2.js
// @downloadURL https://update.greasyfork.org/scripts/564162/Hasoth%27s%20My%20Today%20Prayer.user.js
// @updateURL https://update.greasyfork.org/scripts/564162/Hasoth%27s%20My%20Today%20Prayer.meta.js
// ==/UserScript==

'use strict';

/* ================= DEV TOOLS / DEBUG MODE ================= */
const DEBUG_ENV = null;
const DEBUG_STATUS = null;

/* ================= STATE & SETTINGS ================= */
let RingFloatPos = localStorage.getItem('rings-float-pos') || '3';
let CustomPos = JSON.parse(localStorage.getItem('rings-float-custom') || '{"top": "20%", "left": "80%"}');
let ShowOnlyUntilDone = GM_getValue('setting-show-only-until-done', false);
let ForceCompactMode = GM_getValue('setting-force-compact', false);

let TORN_API_KEY = null;
let API_KEY_CHECKED = false;

/* ================= ENVIRONMENT DETECTION ================= */
function detectEnvironment() {
    if (DEBUG_ENV) return DEBUG_ENV;
    const ua = navigator.userAgent.toLowerCase();
    const pdaIndicators = /tornpda|dart|flutter/i.test(ua);
    const mobileWebview = /android|iphone|ipad/i.test(ua) && /wv\)|\.app|version\/[\d.]+.*safari/i.test(ua);
    const isMobileWidth = window.innerWidth <= 768;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (pdaIndicators || mobileWebview) return 'pda';
    if (isMobileWidth && hasTouch) return 'mobile';
    return 'desktop';
}

const ENV = detectEnvironment();
const isPDA = ENV === 'pda';
const isMobile = ENV === 'mobile';
const isDesktop = ENV === 'desktop';
const useCompactMode = isPDA || isMobile || ForceCompactMode;

const obs_ops = { childList: true, subtree: true };

/* ================= ICONS ================= */
const prayer_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M4 12 Q4 8 8 8 L28 8 Q32 8 32 12 L32 52 Q32 48 28 48 L8 48 Q4 48 4 52 Z" fill="#F5F5F5" stroke="#8B4513" stroke-width="1.5"/><path d="M60 12 Q60 8 56 8 L36 8 Q32 8 32 12 L32 52 Q32 48 36 48 L56 48 Q60 48 60 52 Z" fill="#F5F5F5" stroke="#8B4513" stroke-width="1.5"/><path d="M32 8 L32 52" stroke="#8B4513" stroke-width="2"/><line x1="10" y1="16" x2="26" y2="16" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="10" y1="20" x2="26" y2="20" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="10" y1="24" x2="24" y2="24" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="10" y1="28" x2="26" y2="28" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="10" y1="32" x2="25" y2="32" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="10" y1="36" x2="26" y2="36" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="10" y1="40" x2="23" y2="40" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="38" y1="16" x2="54" y2="16" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="38" y1="20" x2="54" y2="20" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="38" y1="24" x2="54" y2="24" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="38" y1="28" x2="54" y2="28" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="38" y1="32" x2="54" y2="32" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="38" y1="36" x2="54" y2="36" stroke="#666" stroke-width="1" opacity="0.5"/><line x1="40" y1="40" x2="54" y2="40" stroke="#666" stroke-width="1" opacity="0.5"/><path d="M32 12 L32 52" stroke="#000" stroke-width="1" opacity="0.2"/><ellipse cx="32" cy="52" rx="26" ry="3" fill="#000" opacity="0.1"/><line x1="18" y1="12" x2="18" y2="18" stroke="#FFD700" stroke-width="2" opacity="0.8"/><line x1="15" y1="15" x2="21" y2="15" stroke="#FFD700" stroke-width="2" opacity="0.8"/></svg>`;
const check_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`;
const x_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFC107"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 17.59 13.41 12 19 6.41z"/></svg>`;
const exclamation_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F44336"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
const gear_svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#888"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L3.16 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.04.64.09.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`;

/* ================= API FUNCTIONS ================= */
async function getAPIKey() {
    if (API_KEY_CHECKED) return TORN_API_KEY;
    TORN_API_KEY = GM_getValue('torn-api-key', null);
    API_KEY_CHECKED = true;
    return TORN_API_KEY;
}

function isPrayerActivity(entry) {
    if (!entry) return false;
    const details = entry.details || {};
    // Optimized check for v2 API
    if (details.id === 5971 || details.title === "Church pray") return true;

    // Fallback text check
    const fullText = JSON.stringify(entry).toLowerCase();
    if (fullText.includes('church') && fullText.includes('pray')) return true;

    return false;
}

async function getTornTimestamp() {
    if (!TORN_API_KEY) return null;
    return new Promise((resolve) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: `https://api.torn.com/v2/torn/timestamp?key=${TORN_API_KEY}`,
            headers: { 'Accept': 'application/json' },
            onload: (res) => {
                try {
                    const d = JSON.parse(res.responseText);
                    resolve(d.error ? null : d.timestamp);
                } catch { resolve(null); }
            },
            onerror: () => resolve(null)
        });
    });
}

async function checkPrayerActivity() {
    if (DEBUG_STATUS) {
        await new Promise(r => setTimeout(r, 500));
        if (DEBUG_STATUS === 'found') return { found: true, message: '✓ Completed (DEBUG)', displayTime: '12:00', count: 1 };
        if (DEBUG_STATUS === 'not-found') return { found: false, message: '✗ No Prayer', logsChecked: 999 };
        if (DEBUG_STATUS === 'no-key') return { found: false, message: 'No API Key', needsReset: false };
    }

    await getAPIKey();
    if (!TORN_API_KEY) return { found: false, message: 'No API Key' };

    const serverTime = await getTornTimestamp();
    if (!serverTime) return { found: false, message: 'Timestamp error', needsReset: true };

    // Calculate Midnight UTC based on serverTime
    const todayStart = Math.floor(serverTime / 86400) * 86400;
    const from = todayStart + 1; // 00:00:01
    const to = serverTime;       // Now

    return new Promise((resolve) => {
        GM.xmlHttpRequest({
            method: 'GET',
            // OPTIMIZED QUERY: cat=143 (Church) + Time Range
            url: `https://api.torn.com/v2/user/log?cat=143&from=${from}&to=${to}&key=${TORN_API_KEY}`,
            headers: { 'Accept': 'application/json' },
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);

                    if (data.error) {
                        resolve({ found: false, message: 'API Error', error: data.error.error, needsReset: true });
                        return;
                    }

                    if (!data.log || (Array.isArray(data.log) && data.log.length === 0)) {
                        resolve({ found: false, message: '✗ No Prayer' });
                        return;
                    }

                    const logs = Array.isArray(data.log) ? data.log : Object.values(data.log);
                    const prayers = logs.filter(e => isPrayerActivity(e));

                    if (prayers.length > 0) {
                        prayers.sort((a, b) => b.timestamp - a.timestamp); // Newest first
                        const pt = new Date(prayers[0].timestamp * 1000);
                        resolve({
                            found: true,
                            message: '✓ Prayer completed',
                            displayTime: `${String(pt.getUTCHours()).padStart(2,'0')}:${String(pt.getUTCMinutes()).padStart(2,'0')} <span class="rings-server-time">(server time)</span>`,
                            data: prayers[0]
                        });
                    } else {
                        resolve({ found: false, message: '✗ No Prayer' });
                    }
                } catch { resolve({ found: false, message: 'Parse error', needsReset: true }); }
            },
            onerror: () => resolve({ found: false, message: 'Request error', needsReset: true })
        });
    });
}

/* ================= UI LOGIC ================= */

const observer = new MutationObserver(async () => {
    if (!document.getElementById('ringsFloat') && document.body) {
        await insertFloat();
    }
});
observer.observe(document, obs_ops);

async function insertFloat() {
    if(document.getElementById('ringsFloat')) return;
    const isCompact = useCompactMode;
    const ringBtn = `
        <a id="ringsFloat" class="rings-float ${isCompact ? 'rings-compact' : ''}" title="Click to refresh">
            <span class="rings-icon">${prayer_svg}</span>
            <div class="rings-info">
                <span class="rings-text">TODAY PRAYER</span>
                <span class="rings-status" id="ringsStatus">Checking...</span>
            </div>
            <div class="rings-status-icon" id="ringsStatusIcon"></div>
            <div class="rings-gear" id="ringsGear" title="Settings">${gear_svg}</div>
            <div class="rings-drag-label">drag</div>
        </a>
    `;

    $('body').append(ringBtn);
    setFloatPosition();
    insertStyle();
    createSettingsModal();

    const btn = document.getElementById('ringsFloat');
    if (btn) {
        setupDrag(btn);
        btn.addEventListener('click', (e) => {
            if (!btn.classList.contains('is-dragging')) handleRingsButtonClick(e);
        });
        await refreshPrayerStatus();
    }

    const gearBtn = document.getElementById('ringsGear');
    if (gearBtn) {
        gearBtn.addEventListener('click', openSettingsModal);
        gearBtn.addEventListener('mousedown', (e) => e.stopPropagation());
        gearBtn.addEventListener('touchstart', (e) => e.stopPropagation());
    }
}

function setupDrag(el) {
    let isDragging = false;
    let startX, startY;

    const start = (cx, cy) => { isDragging = false; startX = cx; startY = cy; };
    const move = (cx, cy, e) => {
        if (Math.abs(cx - startX) > 5 || Math.abs(cy - startY) > 5) {
            isDragging = true;
            el.classList.add('is-dragging');
            if(e) e.preventDefault();
            el.style.left = (cx - el.offsetWidth/2) + 'px';
            el.style.top = (cy - el.offsetHeight/2) + 'px';
            el.classList.remove('rings-top','rings-bottom','rings-left','rings-right');
        }
    };
    const end = () => {
        if (isDragging) {
            const lp = (parseInt(el.style.left)/window.innerWidth*100).toFixed(1)+'%';
            const tp = (parseInt(el.style.top)/window.innerHeight*100).toFixed(1)+'%';
            CustomPos = {top:tp, left:lp};
            localStorage.setItem('rings-float-custom', JSON.stringify(CustomPos));
            RingFloatPos = 'custom';
            localStorage.setItem('rings-float-pos', 'custom');
            setTimeout(() => { isDragging = false; el.classList.remove('is-dragging'); }, 50);
        }
    };

    el.addEventListener('mousedown', e => { if(e.button===0 && !e.target.closest('#ringsGear')) {
        start(e.clientX, e.clientY);
        const mm = ev => move(ev.clientX, ev.clientY, ev);
        const mu = () => { end(); document.removeEventListener('mousemove', mm); document.removeEventListener('mouseup', mu); };
        document.addEventListener('mousemove', mm); document.addEventListener('mouseup', mu);
    }});

    el.addEventListener('touchstart', e => start(e.touches[0].clientX, e.touches[0].clientY), {passive:false});
    el.addEventListener('touchmove', e => move(e.touches[0].clientX, e.touches[0].clientY, e), {passive:false});
    el.addEventListener('touchend', end);
}

async function handleRingsButtonClick(e) {
    if (e.target.closest('#ringsGear')) return;
    if(e.preventDefault) e.preventDefault();

    const statusEl = document.getElementById('ringsStatus');
    const statusText = statusEl ? statusEl.textContent : '';
    if (statusEl && (statusText === 'API Error' || statusText === 'No API Key provided')) {
         if (!DEBUG_STATUS) openSettingsModal();
    } else {
         await refreshPrayerStatus();
    }
}

async function refreshPrayerStatus() {
    const statusEl = document.getElementById('ringsStatus');
    const statusIconEl = document.getElementById('ringsStatusIcon');
    if (statusEl) { statusEl.textContent = 'Checking...'; statusEl.className = 'rings-status'; }

    const result = await checkPrayerActivity();
    let statusClass = '', iconHTML = '';

    if (result.found) {
        statusClass = 'rings-found'; iconHTML = check_svg;
        if (statusEl) statusEl.innerHTML = `Completed: ${result.displayTime}`;
    } else if (result.message === 'No API Key' || result.needsReset) {
        statusClass = 'rings-error'; iconHTML = exclamation_svg;
        if (statusEl) statusEl.textContent = result.message;
    } else {
        statusClass = 'rings-not-found'; iconHTML = x_svg;
        if (statusEl) statusEl.textContent = 'Not completed yet';
    }

    if (statusEl) statusEl.classList.add(statusClass);
    if (statusIconEl) {
        statusIconEl.innerHTML = iconHTML;
        statusIconEl.className = 'rings-status-icon';
        if (result.found) statusIconEl.classList.add('rings-icon-check');
        else if (statusClass === 'rings-error') statusIconEl.classList.add('rings-icon-error');
        else statusIconEl.classList.add('rings-icon-x');
    }

    const btn = document.getElementById('ringsFloat');
    if (btn) btn.style.display = (ShowOnlyUntilDone && result.found) ? 'none' : 'flex';
}

/* ================= SETTINGS MODAL ================= */

function createSettingsModal() {
    if(document.getElementById('ringsSettingsModal')) return;
    const modalHTML = `
        <div id="ringsSettingsModal" class="rings-modal" style="display:none;">
            <div class="rings-modal-content">
                <span id="ringsCloseModal" class="rings-close">&times;</span>
                <h3>Prayer Script Settings</h3>

                <div class="rings-setting-group">
                    <label>API Key:</label>
                    <div style="font-size: 11px; color: #aaa; margin-bottom: 5px;">
                        Requires full access or a custom access key with permission to check logs (required to determine when the prayer was performed).
                        <br><a href="https://www.torn.com/preferences.php#tab=api?step=addNewKey&user=log&title=TodayPrayer" target="_blank" style="color: #4CAF50; text-decoration: underline;">Get it here</a>
                    </div>
                    <input type="text" id="ringsApiKeyInput" placeholder="Enter Torn API Key" />
                    <div class="rings-btn-row">
                        <button id="ringsSaveKey" class="rings-btn rings-btn-green">Save Key</button>
                        <button id="ringsDelKey" class="rings-btn rings-btn-red">Delete Key</button>
                    </div>
                </div>

                <div class="rings-setting-group">
                    <label>Position:</label>
                    <select id="ringsPosSelect">
                        <option value="0">Bottom-Left</option>
                        <option value="1">Top-Left</option>
                        <option value="2">Bottom-Right</option>
                        <option value="3">Top-Right</option>
                        <option value="custom">Custom (Drag widget to set)</option>
                    </select>
                </div>

                <div class="rings-setting-group rings-checkbox-row">
                    <input type="checkbox" id="ringsHideDone" />
                    <label for="ringsHideDone">Hide when completed today</label>
                </div>

                <div class="rings-setting-group rings-checkbox-row" id="ringsDesktopOpt" style="display:none;">
                    <input type="checkbox" id="ringsCompact" />
                    <label for="ringsCompact">Force Minimal View (Compact)</label>
                </div>

                <div class="rings-footer">
                    <button id="ringsCloseBtn" class="rings-btn">Close</button>
                    <small>Version 3.26.0</small>
                </div>
            </div>
        </div>
    `;
    $('body').append(modalHTML);

    $('#ringsCloseModal, #ringsCloseBtn').click(() => $('#ringsSettingsModal').fadeOut(200));
    $('#ringsSaveKey').click(() => {
        const key = $('#ringsApiKeyInput').val().trim();
        if(key) {
            TORN_API_KEY = key;
            GM_setValue('torn-api-key', key);
            API_KEY_CHECKED = true;
            alert('Key Saved!');
            refreshPrayerStatus();
        }
    });
    $('#ringsDelKey').click(() => {
        GM_deleteValue('torn-api-key');
        TORN_API_KEY = null;
        $('#ringsApiKeyInput').val('');
        alert('Key Deleted');
        refreshPrayerStatus();
    });
    $('#ringsPosSelect').change(function() {
        RingFloatPos = $(this).val();
        localStorage.setItem('rings-float-pos', RingFloatPos);
        setFloatPosition();
    });
    $('#ringsHideDone').change(function() {
        ShowOnlyUntilDone = $(this).is(':checked');
        GM_setValue('setting-show-only-until-done', ShowOnlyUntilDone);
        refreshPrayerStatus();
    });
    $('#ringsCompact').change(function() {
        ForceCompactMode = $(this).is(':checked');
        GM_setValue('setting-force-compact', ForceCompactMode);
        alert('Reloading page to apply layout change...');
        location.reload();
    });
}

function openSettingsModal(e) {
    if(e && e.stopPropagation) e.stopPropagation();
    if(e && e.preventDefault) e.preventDefault();

    $('#ringsApiKeyInput').val(TORN_API_KEY || '');
    $('#ringsPosSelect').val(RingFloatPos);
    $('#ringsHideDone').prop('checked', ShowOnlyUntilDone);

    if(isDesktop) {
        $('#ringsDesktopOpt').show();
        $('#ringsCompact').prop('checked', ForceCompactMode);
    } else {
        $('#ringsDesktopOpt').hide();
    }
    $('#ringsSettingsModal').fadeIn(200);
}

/* ================= STYLES ================= */

function setFloatPosition() {
    const btn = document.getElementById('ringsFloat');
    if (!btn) return;
    btn.classList.remove('rings-top', 'rings-bottom', 'rings-left', 'rings-right');
    btn.style.top = ''; btn.style.bottom = ''; btn.style.left = ''; btn.style.right = '';

    if (RingFloatPos === 'custom') {
        btn.style.top = CustomPos.top;
        btn.style.left = CustomPos.left;
    } else {
        const posInt = parseInt(RingFloatPos);
        switch (posInt) {
            case 0: btn.classList.add('rings-bottom', 'rings-left'); break;
            case 1: btn.classList.add('rings-top', 'rings-left'); break;
            case 2: btn.classList.add('rings-bottom', 'rings-right'); break;
            case 3: btn.classList.add('rings-top', 'rings-right'); break;
            default: btn.classList.add('rings-top', 'rings-right');
        }
    }
}

function insertStyle() {
    GM.addStyle(`
        #ringsFloat {
            z-index: 999999; position: fixed; font-family: Arial, sans-serif; font-weight: 700; font-size: 12px;
            cursor: pointer; text-decoration: none; color: #333;
            background: #f2f2f2;
            border: 1px solid #999; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: flex; user-select: none; touch-action: none;
        }
        #ringsFloat:active { transform: scale(0.98); }

        #ringsFloat:not(.rings-compact) { padding: 8px 12px; flex-direction: row; align-items: center; gap: 10px; min-width: 160px; }
        #ringsFloat:not(.rings-compact) .rings-icon svg { width: 28px; height: 28px; }
        #ringsFloat:not(.rings-compact) .rings-info { display: flex; flex-direction: column; }
        #ringsFloat:not(.rings-compact) .rings-status-icon { display: none; }
        #ringsFloat:not(.rings-compact) .rings-gear {
            width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
            opacity: 0.3; margin-left: auto;
        }
        #ringsFloat:not(.rings-compact):hover .rings-gear { opacity: 1; background: rgba(0,0,0,0.1); }
        #ringsFloat:not(.rings-compact) .rings-gear svg { width: 16px; height: 16px; }

        /* Drag Label (Full Mode) - Top, centered */
        #ringsFloat:not(.rings-compact) .rings-drag-label {
            position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
            font-size: 8px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;
            background: #fff; padding: 0 4px; border-radius: 3px; border: 1px solid #ccc;
            pointer-events: none; opacity: 1; z-index: 1000000;
        }

        #ringsFloat.rings-compact { width: 48px; padding: 6px; flex-direction: column; justify-content: center; align-items: center; }
        #ringsFloat.rings-compact .rings-info { display: none; }
        #ringsFloat.rings-compact .rings-icon svg { width: 32px; height: 32px; }
        #ringsFloat.rings-compact .rings-status-icon {
            position: absolute; top: -5px; right: -5px; width: 20px; height: 20px;
            background: white; border-radius: 50%; border: 1px solid #ccc;
            display: flex; align-items: center; justify-content: center;
        }
        #ringsFloat.rings-compact .rings-status-icon svg { width: 16px; height: 16px; }
        #ringsFloat.rings-compact .rings-gear {
            position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%);
            width: 20px; height: 20px; background: #fff; border: 1px solid #999; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 3px rgba(0,0,0,0.2); z-index: 10;
        }
        #ringsFloat.rings-compact .rings-gear svg { width: 14px; height: 14px; }

        /* Drag Label (Compact Mode) - Top-Left, no center transform */
        #ringsFloat.rings-compact .rings-drag-label {
            position: absolute; top: -8px; left: 4px; transform: none;
            font-size: 8px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;
            background: #fff; padding: 0 4px; border-radius: 3px; border: 1px solid #ccc;
            pointer-events: none; opacity: 1; z-index: 1000000;
        }

        /* RESTORED COLORS & SERVER TIME STYLE */
        .rings-status.rings-found { color: #006400 !important; }
        .rings-status.rings-not-found { color: #cc8400 !important; }
        .rings-status.rings-error { color: #cc0000 !important; animation: pulse-error 1s infinite; }
        .rings-server-time { font-size: 0.8em; font-weight: normal; opacity: 0.8; }
        @keyframes pulse-error { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

        .rings-top { top: 80px; } .rings-bottom { bottom: 80px; } .rings-left { left: 15px; } .rings-right { right: 15px; }

        .rings-modal { position: fixed; z-index: 1000000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); }
        .rings-modal-content {
            background-color: #222; color: #ddd; margin: 15% auto; padding: 20px; border: 1px solid #444; width: 300px; border-radius: 8px; font-family: Arial;
        }
        .rings-close { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
        .rings-close:hover { color: #fff; }
        .rings-setting-group { margin-bottom: 15px; }
        .rings-setting-group label { display: block; margin-bottom: 5px; font-weight: bold; }
        .rings-setting-group input[type="text"], .rings-setting-group select { width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #333; color: #fff; }
        .rings-checkbox-row { display: flex; align-items: center; gap: 10px; }
        .rings-checkbox-row label { margin: 0; }
        .rings-btn-row { display: flex; gap: 10px; margin-top: 5px; }
        .rings-btn { padding: 8px 12px; cursor: pointer; border: none; border-radius: 4px; color: white; background: #555; }
        .rings-btn:hover { background: #666; }
        .rings-btn-green { background: #4CAF50; } .rings-btn-green:hover { background: #45a049; }
        .rings-btn-red { background: #f44336; } .rings-btn-red:hover { background: #d32f2f; }
        .rings-footer { text-align: center; margin-top: 20px; border-top: 1px solid #444; padding-top: 10px; }
    `);
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        GM_registerMenuCommand('⚙️ Open Settings', openSettingsModal);
        GM_registerMenuCommand('🔄 Refresh Status', refreshPrayerStatus);

        if(document.body && !document.getElementById('ringsFloat')) {
            insertFloat();
        }
    }, 500);
});

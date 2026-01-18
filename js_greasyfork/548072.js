// ==UserScript==
// @name         Torn: Refill Blood Bag Reminder
// @namespace    torn.tools.reminders
// @version      4.2.1
// @description  Show blood-bag icon when ready to fill blood bags. Configurable 1-3 bags with dynamic life/cooldown thresholds.
// @author       ButtChew [3840391]
// @license      MIT
// @match        https://www.torn.com/*
// @match        https://torn.com/*
// @icon         https://i.postimg.cc/mkZ1T68H/blood-bag-2.png
// @homepageURL  https://greasyfork.org/en/scripts/548072-torn-xanax-pre-use-blood-bag-reminder-full-life-icon-yellow-tip-native-style
// @supportURL   https://greasyfork.org/en/scripts/548072-torn-xanax-pre-use-blood-bag-reminder-full-life-icon-yellow-tip-native-style/feedback
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/548072/Torn%3A%20Refill%20Blood%20Bag%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/548072/Torn%3A%20Refill%20Blood%20Bag%20Reminder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        // Icon settings
        fullLifeIconId: 'tm-full-life-bloodbag',
        bloodBagPng: 'https://i.postimg.cc/mkZ1T68H/blood-bag-2.png',

        // Destination URLs
        destinations: {
            factionArmoury: 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=medical',
            personalInventory: 'https://www.torn.com/item.php#medical-items',
        },

        // Blood bag mechanics
        lifePerBag: 30,           // Each bag uses 30% life
        cooldownPerBagMs: 60 * 60 * 1000,  // Each bag adds 1 hour cooldown

        // Status icons selector (for inserting our icon)
        statusIconsSelector: 'ul[class*="status-icons"]',

        // Poll interval
        pollMs: 2000,
    };

    // ===== GM_* COMPATIBILITY (TornPDA support) =====
    const safeGM = {
        getValue: (key, defaultVal) => {
            try {
                return typeof GM_getValue === 'function' ? GM_getValue(key, defaultVal) : defaultVal;
            } catch { return defaultVal; }
        },
        setValue: (key, val) => {
            try {
                if (typeof GM_setValue === 'function') GM_setValue(key, val);
            } catch { /* ignore */ }
        },
        registerMenuCommand: (name, fn) => {
            try {
                if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand(name, fn);
            } catch { /* ignore */ }
        }
    };

    // ===== SESSIONSTORAGE DATA EXTRACTION =====
    function getSidebarData() {
        try {
            const key = Object.keys(sessionStorage).find(k => /sidebarData\d+/.test(k));
            if (!key) return null;
            return JSON.parse(sessionStorage.getItem(key));
        } catch {
            return null;
        }
    }

    function getLifeFromStorage() {
        const data = getSidebarData();
        if (!data) return null;

        // Life data is at data.bars.life with amount/max properties
        const life = data?.bars?.life;
        if (life && typeof life.amount === 'number' && typeof life.max === 'number') {
            const pct = life.max > 0 ? Math.round((life.amount / life.max) * 100) : 0;
            return { current: life.amount, max: life.max, pct };
        }

        return null;
    }

    function hmsToMs(hms) {
        if (!hms) return 0;
        const parts = hms.split(':').map(Number);
        if (parts.length === 3) {
            const [h, m, s] = parts;
            return ((h * 60 + m) * 60 + s) * 1000;
        }
        return 0;
    }

    function getMedicalCooldownInfo() {
        const data = getSidebarData();
        if (!data) return null;

        const med = data?.statusIcons?.icons?.medical_cooldown;
        if (!med) return null;

        const nowSec = Date.now() / 1000;

        const remainingMs = Math.max(0, (med.timerExpiresAt - nowSec) * 1000);
        const maxMs = hmsToMs(med.factionUpgrade);

        return {
            remainingMs,
            maxMs,
            freeMs: Math.max(0, maxMs - remainingMs)
        };
    }

    // ===== SETTINGS =====
    function getDestinationURL() {
        const destination = safeGM.getValue('bloodBagDestination', 'factionArmoury');
        return CONFIG.destinations[destination] || CONFIG.destinations.factionArmoury;
    }

    function getBagsToFill() {
        const bags = safeGM.getValue('bloodBagCount', 3);
        return Math.max(1, Math.min(3, bags));  // Clamp to 1-3
    }

    function getThresholds() {
        const bags = getBagsToFill();
        return {
            lifePercent: bags * CONFIG.lifePerBag,  // 30%, 60%, or 90%
            cooldownBufferMs: (bags - 1) * CONFIG.cooldownPerBagMs  // 0, 1hr, or 2hr buffer
        };
    }

    function openSettingsModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('bloodbag-settings-modal');
        if (existingModal) existingModal.remove();

        const currentDestination = safeGM.getValue('bloodBagDestination', 'factionArmoury');
        const currentBags = getBagsToFill();
        const thresholds = getThresholds();

        const settingsModal = document.createElement('div');
        settingsModal.id = 'bloodbag-settings-modal';
        settingsModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const getCooldownText = (bags) => {
            if (bags === 1) return 'any room available';
            return `${bags - 1}hr buffer available`;
        };

        settingsModal.innerHTML = `
            <div style="
                background: #2e2e2e;
                border-radius: 10px;
                width: 450px;
                max-width: 90%;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            ">
                <div style="
                    background: linear-gradient(to bottom, #1a1a1a, #2a2a2a);
                    padding: 15px 20px;
                    border-radius: 10px 10px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h2 style="margin: 0; color: #fff; font-size: 18px;">Blood Bag Settings</h2>
                    <button id="close-bloodbag-settings" style="
                        background: none;
                        border: none;
                        color: #aaa;
                        font-size: 24px;
                        cursor: pointer;
                        padding: 0;
                        width: 30px;
                        height: 30px;
                    ">x</button>
                </div>
                <div style="padding: 20px; color: #ccc;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaa; font-size: 14px;">
                            Bags to Fill:
                        </label>
                        <select id="bloodbag-count" style="
                            width: 100%;
                            padding: 10px;
                            background: #1a1a1a;
                            border: 1px solid #444;
                            border-radius: 5px;
                            color: #fff;
                            font-size: 14px;
                            box-sizing: border-box;
                        ">
                            <option value="1" ${currentBags === 1 ? 'selected' : ''}>1 bag (requires >30% life)</option>
                            <option value="2" ${currentBags === 2 ? 'selected' : ''}>2 bags (requires >60% life)</option>
                            <option value="3" ${currentBags === 3 ? 'selected' : ''}>3 bags (requires >90% life)</option>
                        </select>
                        <p style="font-size: 12px; color: #888; margin-top: 5px;">
                            How many blood bags do you want to fill at once?<br>
                            Each bag uses 30% life and adds 1hr medical cooldown.
                        </p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #aaa; font-size: 14px;">
                            Destination Page:
                        </label>
                        <select id="bloodbag-destination" style="
                            width: 100%;
                            padding: 10px;
                            background: #1a1a1a;
                            border: 1px solid #444;
                            border-radius: 5px;
                            color: #fff;
                            font-size: 14px;
                            box-sizing: border-box;
                        ">
                            <option value="factionArmoury" ${currentDestination === 'factionArmoury' ? 'selected' : ''}>Faction Armoury (Medical)</option>
                            <option value="personalInventory" ${currentDestination === 'personalInventory' ? 'selected' : ''}>Personal Inventory (Medical)</option>
                        </select>
                        <p style="font-size: 12px; color: #888; margin-top: 5px;">
                            Where clicking the blood bag icon takes you.<br>
                            <em>Tip: Long-press the icon to open this settings panel.</em>
                        </p>
                    </div>

                    <div id="trigger-conditions" style="
                        background: rgba(255,255,255,0.05);
                        padding: 12px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        font-size: 12px;
                        color: #aaa;
                    ">
                        <strong style="color: #ccc;">Current Trigger Conditions:</strong><br>
                        - Life above ${thresholds.lifePercent}%<br>
                        - Medical cooldown: ${getCooldownText(currentBags)}
                    </div>

                    <div style="text-align: right;">
                        <button id="cancel-bloodbag-settings" style="
                            background: linear-gradient(to bottom, #555, #777);
                            border: none;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            margin-right: 10px;
                            font-size: 14px;
                        ">Cancel</button>
                        <button id="save-bloodbag-settings" style="
                            background: linear-gradient(to bottom, #799427, #a3c248);
                            border: none;
                            color: white;
                            padding: 10px 20px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 14px;
                        ">Save</button>
                    </div>
                </div>
            </div>
        `;

        // Update trigger conditions when bags selection changes
        const updateTriggerDisplay = () => {
            const bags = parseInt(document.getElementById('bloodbag-count').value, 10);
            const lifeReq = bags * CONFIG.lifePerBag;
            const conditionsDiv = document.getElementById('trigger-conditions');
            if (conditionsDiv) {
                conditionsDiv.innerHTML = `
                    <strong style="color: #ccc;">Current Trigger Conditions:</strong><br>
                    - Life above ${lifeReq}%<br>
                    - Medical cooldown: ${getCooldownText(bags)}
                `;
            }
        };

        document.body.appendChild(settingsModal);

        // Event listeners
        document.getElementById('bloodbag-count').addEventListener('change', updateTriggerDisplay);
        document.getElementById('close-bloodbag-settings').addEventListener('click', () => settingsModal.remove());
        document.getElementById('cancel-bloodbag-settings').addEventListener('click', () => settingsModal.remove());
        document.getElementById('save-bloodbag-settings').addEventListener('click', () => {
            const bags = parseInt(document.getElementById('bloodbag-count').value, 10);
            const destination = document.getElementById('bloodbag-destination').value;
            safeGM.setValue('bloodBagCount', bags);
            safeGM.setValue('bloodBagDestination', destination);
            settingsModal.remove();
            updateIcon();
        });
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) settingsModal.remove();
        });
    }

    // Register settings menu command
    safeGM.registerMenuCommand('Blood Bag Settings', openSettingsModal);

    // ===== ICON MANAGEMENT =====
    function updateIcon() {
        const statusUl = document.querySelector(CONFIG.statusIconsSelector);
        if (!statusUl) return;

        const existing = document.getElementById(CONFIG.fullLifeIconId);
        const life = getLifeFromStorage();
        const med = getMedicalCooldownInfo();
        const thresholds = getThresholds();

        // Check conditions
        // Life must be above threshold (30%, 60%, or 90% based on bags setting)
        const lifeOk = life && life.pct > thresholds.lifePercent;

        // Cooldown check: current < max - buffer
        // For 1 bag: just need current < max (any room)
        // For 2 bags: need current < max - 1hr
        // For 3 bags: need current < max - 2hr
        let cooldownOk = true;
        if (med && med.maxMs > 0) {
            // We have medical cooldown info
            // Check if: remainingMs < maxMs - bufferMs
            // Which means: we have enough room for all bags
            cooldownOk = med.remainingMs < (med.maxMs - thresholds.cooldownBufferMs);
        }
        // If no medical cooldown icon exists, cooldownOk stays true (no cooldown = can use)

        const shouldShow = lifeOk && cooldownOk;

        if (shouldShow) {
            // Build tooltip text
            let label = `Life: ${formatNum(life.current)} / ${formatNum(life.max)} (${life.pct}%)`;
            if (med && med.maxMs > 0) {
                const remainHrs = Math.floor(med.remainingMs / 3600000);
                const remainMin = Math.floor((med.remainingMs % 3600000) / 60000);
                const maxHrs = Math.floor(med.maxMs / 3600000);
                label += ` - CD: ${remainHrs}h${remainMin}m / ${maxHrs}h`;
            } else {
                label += ` - No medical cooldown`;
            }

            if (existing) {
                updateIconTooltip(existing, label);
                return;
            }

            const li = buildBloodBagIcon(label);
            statusUl.appendChild(li);
        } else if (existing) {
            existing.remove();
        }
    }

    function buildBloodBagIcon(tooltipText) {
        const li = document.createElement('li');
        li.id = CONFIG.fullLifeIconId;
        li.style.background = 'none';
        li.style.animation = 'tmPulse 900ms ease-out 1';

        const a = document.createElement('a');
        a.href = getDestinationURL();
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', tooltipText);
        a.tabIndex = 0;
        a.setAttribute('data-is-tooltip-opened', 'false');

        const img = document.createElement('img');
        img.src = CONFIG.bloodBagPng;
        img.alt = 'Blood Bag';
        img.width = 17;
        img.height = 17;
        img.style.display = 'block';

        a.appendChild(img);
        li.appendChild(a);

        // Long-press to open settings
        setupLongPress(a, 500, openSettingsModal);

        // Native-style tooltip
        enableNativeLikeTooltip(a);

        // Add pulse animation style if not present
        if (!document.getElementById('tm-pulse-style')) {
            const style = document.createElement('style');
            style.id = 'tm-pulse-style';
            style.textContent = `
                @keyframes tmPulse {
                    0%   { transform: scale(0.9); }
                    60%  { transform: scale(1.1); }
                    100% { transform: scale(1.0); }
                }
            `;
            document.head.appendChild(style);
        }

        return li;
    }

    function setupLongPress(element, duration, callback) {
        let timer = null;
        let didLongPress = false;

        function startPress() {
            didLongPress = false;
            timer = setTimeout(() => {
                didLongPress = true;
                callback();
            }, duration);
        }

        function cancelPress() {
            clearTimeout(timer);
            timer = null;
        }

        function endPress(e) {
            clearTimeout(timer);
            if (didLongPress) {
                e.preventDefault();
                e.stopPropagation();
                didLongPress = false;
            }
        }

        // Touch events (mobile/TornPDA)
        element.addEventListener('touchstart', startPress, { passive: true });
        element.addEventListener('touchend', endPress);
        element.addEventListener('touchmove', cancelPress, { passive: true });
        element.addEventListener('touchcancel', cancelPress);

        // Mouse events (desktop)
        element.addEventListener('mousedown', startPress);
        element.addEventListener('mouseup', endPress);
        element.addEventListener('mouseleave', cancelPress);

        // Prevent click if long-press occurred
        element.addEventListener('click', (e) => {
            if (didLongPress) {
                e.preventDefault();
                e.stopPropagation();
                didLongPress = false;
            }
        });
    }

    function updateIconTooltip(li, text) {
        const a = li.querySelector('a');
        if (!a) return;
        a.href = getDestinationURL();
        a.setAttribute('aria-label', text);
        if (typeof a.__tmUpdateTipText === 'function') a.__tmUpdateTipText(text);
    }

    // ===== TOOLTIP =====
    function enableNativeLikeTooltip(anchor) {
        let tipEl = null;
        let hideTimer = null;

        const CLS = {
            tip: 'tooltip___aWICR tooltipCustomClass___gbI4V',
            arrowWrap: 'arrow___yUDKb top___klE_Y',
            arrowIcon: 'arrowIcon___KHyjw',
        };

        function buildTooltip(text) {
            const el = document.createElement('div');
            el.className = CLS.tip;
            el.setAttribute('role', 'tooltip');
            el.setAttribute('tabindex', '-1');
            el.style.position = 'absolute';
            el.style.transitionProperty = 'opacity';
            el.style.transitionDuration = '200ms';
            el.style.opacity = '0';

            const [title, subtitle] = parseTwoLines(text);
            const b = document.createElement('b');
            b.textContent = title;
            el.appendChild(b);

            if (subtitle) {
                const div = document.createElement('div');
                div.textContent = subtitle;
                el.appendChild(div);
            }

            const arrowWrap = document.createElement('div');
            arrowWrap.className = CLS.arrowWrap;
            const arrowIcon = document.createElement('div');
            arrowIcon.className = CLS.arrowIcon;
            arrowWrap.appendChild(arrowIcon);
            el.appendChild(arrowWrap);

            return el;
        }

        function setText(text) {
            if (!tipEl) return;
            const [title, subtitle] = parseTwoLines(text);
            const b = tipEl.querySelector('b');
            if (b) b.textContent = title;
            let sub = b?.nextElementSibling;
            if (subtitle) {
                if (!sub || sub.tagName !== 'DIV') {
                    sub = document.createElement('div');
                    b.after(sub);
                }
                sub.textContent = subtitle;
            } else if (sub) {
                sub.remove();
            }
        }

        function parseTwoLines(text) {
            const parts = text.split(' - ');
            if (parts.length >= 2) {
                return [parts[0].trim(), parts[1].trim()];
            }
            return [text.trim(), ''];
        }

        function positionTooltip() {
            if (!tipEl) return;

            const r = anchor.getBoundingClientRect();
            const ew = tipEl.offsetWidth;
            const eh = tipEl.offsetHeight;

            let left = Math.round(r.left + (r.width - ew) / 2);
            let top = Math.round(r.top - eh - 14);

            left = Math.max(8, Math.min(left, window.innerWidth - ew - 8));
            if (top < 8) {
                top = Math.round(r.bottom + 10);
            }

            tipEl.style.left = `${left}px`;
            tipEl.style.top = `${top}px`;

            const arrow = tipEl.querySelector(`.${CLS.arrowWrap.split(' ')[0]}`);
            if (arrow) {
                const iconCenter = r.left + r.width / 2;
                const arrowLeft = Math.round(iconCenter - left - 6 + 14);
                arrow.style.left = `${arrowLeft}px`;
            }
        }

        function showTip() {
            clearTimeout(hideTimer);
            const text = anchor.getAttribute('aria-label');
            if (!text) return;

            if (!tipEl) {
                tipEl = buildTooltip(text);
                document.body.appendChild(tipEl);
                anchor.__tmTipEl = tipEl;
            } else {
                setText(text);
            }

            anchor.setAttribute('data-is-tooltip-opened', 'true');

            tipEl.style.opacity = '0';
            tipEl.style.left = '-9999px';
            tipEl.style.top = '-9999px';
            requestAnimationFrame(() => {
                positionTooltip();
                requestAnimationFrame(() => {
                    if (tipEl) tipEl.style.opacity = '1';
                });
            });
        }

        function hideTip(immediate = false) {
            if (!tipEl) return;
            anchor.setAttribute('data-is-tooltip-opened', 'false');

            if (immediate) {
                tipEl.remove();
                anchor.__tmTipEl = null;
                tipEl = null;
                return;
            }
            tipEl.style.opacity = '0';
            hideTimer = setTimeout(() => {
                tipEl?.remove();
                anchor.__tmTipEl = null;
                tipEl = null;
            }, 210);
        }

        anchor.__tmUpdateTipText = (text) => setText(text);

        anchor.addEventListener('mouseenter', showTip);
        anchor.addEventListener('mouseleave', () => hideTip(false));
        anchor.addEventListener('focus', showTip);
        anchor.addEventListener('blur', () => hideTip(true));
        window.addEventListener('scroll', () => hideTip(true), { passive: true });
    }

    // ===== CSS GUARDS =====
    function ensureStyles() {
        if (document.getElementById('tm-bloodbag-styles')) return;
        const s = document.createElement('style');
        s.id = 'tm-bloodbag-styles';
        s.textContent = `
            #${CONFIG.fullLifeIconId},
            #${CONFIG.fullLifeIconId} a,
            #${CONFIG.fullLifeIconId} img {
                background: none !important;
                background-image: none !important;
                -webkit-mask: none !important;
                mask: none !important;
                box-shadow: none !important;
                border: none !important;
            }
            #${CONFIG.fullLifeIconId}::before,
            #${CONFIG.fullLifeIconId}::after,
            #${CONFIG.fullLifeIconId} a::before,
            #${CONFIG.fullLifeIconId} a::after {
                content: none !important;
            }
            ul[class*="status-icons"] {
                height: auto !important;
                overflow: visible !important;
            }
        `;
        document.head.appendChild(s);
    }

    // ===== UTILITIES =====
    function formatNum(n) {
        try {
            return n.toLocaleString();
        } catch {
            return String(n);
        }
    }

    // ===== INITIALIZATION =====
    // Declare before anything can call scheduleCheck (fixes TDZ crash)
    let checkScheduled = false;

    function scheduleCheck() {
        if (checkScheduled) return;
        checkScheduled = true;
        requestAnimationFrame(() => {
            checkScheduled = false;
            updateIcon();
        });
    }

    // One-time CSS injection (run immediately like v3.4)
    ensureStyles();

    // Observe DOM changes (SPA) and poll (like v3.4)
    const mo = new MutationObserver(() => {
        scheduleCheck();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setInterval(scheduleCheck, CONFIG.pollMs);

    // Initial check
    scheduleCheck();

    console.log('[Blood Bag v4.2.1] Initialized - using sessionStorage');

})();

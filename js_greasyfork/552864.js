// ==UserScript==
// @name         Torn Faction Respect Tracker
// @namespace    http://tampermonkey.net/
// @description  Track faction respect like a boss!
// @match        *://*/*
// @run-at       document-end
// @version      10020
// @icon         https://img.icons8.com/?size=100&id=tM5WsaZgzeEC&format=png&color=000000
// @author       M3X1C0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552864/Torn%20Faction%20Respect%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/552864/Torn%20Faction%20Respect%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Don't run in iframes
    if (window.self !== window.top) {
        return;
    }

    // Prevent duplicates
    if (document.getElementById('factionTrackerBtn')) {
        return;
    }

    // ========== UTILITY FUNCTIONS ==========
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function cleanNumberInput(value) {
        if (value == null) return 0;
        value = value.toString().trim();

        if (value === '') return 0;

        // Remove spaces
        value = value.replace(/\s+/g, '');

        // Replace commas with dots for consistency
        value = value.replace(/,/g, '.');

        // Split on dots
        const parts = value.split('.');

        if (parts.length === 1) {
            return parseFloat(parts[0]) || 0;
        }

        const last = parts[parts.length - 1];

        if (/^\d{1,2}$/.test(last)) {
            const intPart = parts.slice(0, -1).join('');
            return parseFloat(`${intPart}.${last}`) || 0;
        } else {
            return parseFloat(parts.join('')) || 0;
        }
    }

    // ========== STORAGE HELPER FUNCTIONS ==========
    function savePosition(top, left) {
        if (typeof GM_setValue !== 'undefined') {
            // Store as percentages of viewport
            const topPercent = (top / window.innerHeight) * 100;
            const leftPercent = (left / window.innerWidth) * 100;
            GM_setValue('factionBtn-top', topPercent.toString());
            GM_setValue('factionBtn-left', leftPercent.toString());
        }
    }

    function getPosition(key, defaultValue) {
        if (typeof GM_getValue !== 'undefined') {
            const value = GM_getValue(key);
            if (value !== undefined && value !== null) {
                const percent = parseFloat(value);
                // Convert percentage back to pixels based on current viewport
                if (key === 'factionBtn-top') {
                    return (percent / 100) * window.innerHeight;
                } else if (key === 'factionBtn-left') {
                    return (percent / 100) * window.innerWidth;
                }
            }
        }
        return defaultValue;
    }

    function saveModalPosition(top, left) {
        if (typeof GM_setValue !== 'undefined') {
            // Store as percentages of viewport
            const topPercent = (top / window.innerHeight) * 100;
            const leftPercent = (left / window.innerWidth) * 100;
            GM_setValue('modal-top', topPercent.toString());
            GM_setValue('modal-left', leftPercent.toString());
        }
    }

    function getModalPosition(key, defaultValue) {
        if (typeof GM_getValue !== 'undefined') {
            const value = GM_getValue(key);
            if (value !== undefined && value !== null) {
                const percent = parseFloat(value);
                // Convert percentage back to pixels based on current viewport
                if (key === 'modal-top') {
                    return (percent / 100) * window.innerHeight;
                } else if (key === 'modal-left') {
                    return (percent / 100) * window.innerWidth;
                }
            }
        }
        return defaultValue;
    }

    function saveModalState(isOpen) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('modal-open', isOpen.toString());
        }
    }

    function getModalState() {
        if (typeof GM_getValue !== 'undefined') {
            const value = GM_getValue('modal-open');
            return value === 'true';
        }
        return false;
    }

    function saveModalSize(width, height) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('modal-width', width.toString());
            GM_setValue('modal-height', height.toString());
        }
    }

    function getModalSize(key, defaultValue) {
        if (typeof GM_getValue !== 'undefined') {
            const value = GM_getValue(key);
            if (value !== undefined && value !== null) {
                return parseInt(value);
            }
        }
        return defaultValue;
    }

    function saveTheme(theme) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('theme', theme);
        }
    }

    function getTheme() {
        if (typeof GM_getValue !== 'undefined') {
            const value = GM_getValue('theme');
            return value || 'dark';
        }
        return 'dark';
    }

    function saveFontSize(fontSize) {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('fontSize', fontSize);
        }
    }

    function getFontSize() {
        if (typeof GM_getValue !== 'undefined') {
            const value = GM_getValue('fontSize');
            return value || 'small';
        }
        return 'small';
    }

    function saveInputValues() {
        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('input-apiKey', document.getElementById('apiKeyInput').value);
            GM_setValue('input-factionId', document.getElementById('factionIdInput').value);
            GM_setValue('input-startTime', document.getElementById('startTimeInput').value);
            GM_setValue('input-endTime', document.getElementById('endTimeInput').value);
            GM_setValue('input-reviveEnergyCost', document.getElementById('reviveEnergyCostInput').value);
            GM_setValue('input-reviveSuccessPct', document.getElementById('reviveSuccessPctInput').value);
            GM_setValue('input-totalWarPayout', document.getElementById('totalWarPayoutInput').value);
            GM_setValue('input-totalWithheld', document.getElementById('totalWithheldInput').value);
            GM_setValue('input-insideHitsPct', document.getElementById('insideHitsPctInput').value);
            GM_setValue('input-outsideHitsPct', document.getElementById('outsideHitsPctInput').value);
            GM_setValue('input-assistsPct', document.getElementById('assistsPctInput').value);
            GM_setValue('input-reviveFailedPct', document.getElementById('reviveFailedPctInput').value);

            GM_setValue('checkbox-excludeAssists', document.getElementById('excludeAssistsCheckbox').checked.toString());
            GM_setValue('checkbox-excludeReviveSuccess', document.getElementById('excludeReviveSuccessCheckbox').checked.toString());
            GM_setValue('checkbox-excludeReviveFailed', document.getElementById('excludeReviveFailedCheckbox').checked.toString());

            GM_setValue('toggle-withheldMode', document.getElementById('withheldToggleBtn').textContent);
        }
    }

    function loadInputValues() {
        if (typeof GM_getValue !== 'undefined') {
            const apiKey = GM_getValue('input-apiKey');
            const factionId = GM_getValue('input-factionId');
            const startTime = GM_getValue('input-startTime');
            const endTime = GM_getValue('input-endTime');
            const reviveEnergyCost = GM_getValue('input-reviveEnergyCost');
            const reviveSuccessPct = GM_getValue('input-reviveSuccessPct');
            const totalWarPayout = GM_getValue('input-totalWarPayout');
            const totalWithheld = GM_getValue('input-totalWithheld');
            const insideHitsPct = GM_getValue('input-insideHitsPct');
            const outsideHitsPct = GM_getValue('input-outsideHitsPct');
            const assistsPct = GM_getValue('input-assistsPct');
            const reviveFailedPct = GM_getValue('input-reviveFailedPct');

            const excludeAssists = GM_getValue('checkbox-excludeAssists');
            const excludeReviveSuccess = GM_getValue('checkbox-excludeReviveSuccess');
            const excludeReviveFailed = GM_getValue('checkbox-excludeReviveFailed');

            const withheldMode = GM_getValue('toggle-withheldMode');

            if (apiKey) document.getElementById('apiKeyInput').value = apiKey;
            if (factionId) document.getElementById('factionIdInput').value = factionId;
            if (startTime) document.getElementById('startTimeInput').value = startTime;
            if (endTime) document.getElementById('endTimeInput').value = endTime;
            if (reviveEnergyCost) document.getElementById('reviveEnergyCostInput').value = reviveEnergyCost;
            if (reviveSuccessPct) document.getElementById('reviveSuccessPctInput').value = reviveSuccessPct;
            if (totalWarPayout) document.getElementById('totalWarPayoutInput').value = totalWarPayout;
            if (totalWithheld) document.getElementById('totalWithheldInput').value = totalWithheld;
            if (insideHitsPct) document.getElementById('insideHitsPctInput').value = insideHitsPct;
            if (outsideHitsPct) document.getElementById('outsideHitsPctInput').value = outsideHitsPct;
            if (assistsPct) document.getElementById('assistsPctInput').value = assistsPct;
            if (reviveFailedPct) document.getElementById('reviveFailedPctInput').value = reviveFailedPct;

            if (excludeAssists !== undefined) {
                document.getElementById('excludeAssistsCheckbox').checked = excludeAssists === 'true';
            }
            if (excludeReviveSuccess !== undefined) {
                document.getElementById('excludeReviveSuccessCheckbox').checked = excludeReviveSuccess === 'true';
            }
            if (excludeReviveFailed !== undefined) {
                document.getElementById('excludeReviveFailedCheckbox').checked = excludeReviveFailed === 'true';
            }

            if (withheldMode) {
                document.getElementById('withheldToggleBtn').textContent = withheldMode;
            }
        }
    }

    // ========== STYLES ==========
    const style = document.createElement('style');
    style.textContent = `
        /* ========== BUTTON STYLES ========== */
        #factionTrackerBtn {
            position: fixed !important;
            z-index: 2147483647 !important;
            background-color: #e8741a !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
            font-size: 14px !important;
            cursor: move !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            user-select: none !important;
            min-width: 120px !important;
            width: 120px !important;
            height: 36px !important;
            text-align: center !important;
            white-space: nowrap !important;
        }
        #factionTrackerBtn:hover {
            background-color: #b05815 !important;
        }
        #factionTrackerBtn.dragging {
            opacity: 0.7 !important;
            cursor: grabbing !important;
        }

        /* ========== MODAL BASE STYLES ========== */
        #factionTrackerModal {
            display: none;
            position: fixed !important;
            z-index: 2147483648 !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
            padding: 24px !important;
            padding-top: 50px !important;
            min-width: 250px !important;
            max-width: 1000px !important;
            min-height: 200px !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
            resize: both !important;
        }

        /* Mobile-specific styles */
        @media (max-width: 768px) {
            #factionTrackerModal {
                min-width: 150px !important;
                min-height: 250px !important;
            }
        }

        #factionTrackerModal.active {
            display: block !important;
        }
        #factionTrackerModal.dragging-modal {
            opacity: 0.9 !important;
            cursor: grabbing !important;
        }

        /* ========== DARK THEME ========== */
        #factionTrackerModal.theme-dark {
            background: #232323 !important;
            color: #e0e0e0 !important;
        }
        #factionTrackerModal.theme-dark .faction-modal-title {
            color: #e0e0e0 !important;
        }
        #factionTrackerModal.theme-dark .faction-input-group label {
            color: #e0e0e0 !important;
        }
        #factionTrackerModal.theme-dark .faction-input-group input {
            background: #1a1a1a !important;
            color: #e0e0e0 !important;
            border: 1px solid #444 !important;
        }
        #factionTrackerModal.theme-dark .faction-input-group input:focus {
            border-color: #e8741a !important;
        }
        #factionTrackerModal.theme-dark .faction-toggle-btn {
            background: #444 !important;
            color: #e0e0e0 !important;
            border: 1px solid #666 !important;
        }
        #factionTrackerModal.theme-dark .faction-toggle-btn:hover {
            background: #555 !important;
        }
        #factionTrackerModal.theme-dark .faction-checkbox {
            color: #ccc !important;
        }
        #factionTrackerModal.theme-dark #modalCloseBtn {
            color: #999 !important;
        }
        #factionTrackerModal.theme-dark #modalCloseBtn:hover {
            background: #333 !important;
            color: #fff !important;
        }
        #factionTrackerModal.theme-dark .faction-theme-toggle,
        #factionTrackerModal.theme-dark .faction-font-toggle {
            background: #444 !important;
            color: #e0e0e0 !important;
            border: 1px solid #666 !important;
        }
        #factionTrackerModal.theme-dark .faction-theme-toggle:hover,
        #factionTrackerModal.theme-dark .faction-font-toggle:hover {
            background: #555 !important;
        }

        /* ========== LIGHT THEME ========== */
        #factionTrackerModal.theme-light {
            background: #FFEFD5 !important;
            color: #2c2c2c !important;
        }
        #factionTrackerModal.theme-light .faction-modal-title {
            color: #2c2c2c !important;
        }
        #factionTrackerModal.theme-light .faction-input-group label {
            color: #2c2c2c !important;
        }
        #factionTrackerModal.theme-light .faction-input-group input {
            background: #FFF8DC !important;
            color: #2c2c2c !important;
            border: 1px solid #D2B48C !important;
        }
        #factionTrackerModal.theme-light .faction-input-group input:focus {
            border-color: #e8741a !important;
        }
        #factionTrackerModal.theme-light .faction-toggle-btn {
            background: #FFE4B5 !important;
            color: #2c2c2c !important;
            border: 1px solid #D2B48C !important;
        }
        #factionTrackerModal.theme-light .faction-toggle-btn:hover {
            background: #FFDAB9 !important;
        }
        #factionTrackerModal.theme-light .faction-checkbox {
            color: #2c2c2c !important;
        }
        #factionTrackerModal.theme-light #modalCloseBtn {
            color: #8B4513 !important;
        }
        #factionTrackerModal.theme-light #modalCloseBtn:hover {
            background: #FFE4B5 !important;
            color: #2c2c2c !important;
        }
        #factionTrackerModal.theme-light .faction-theme-toggle,
        #factionTrackerModal.theme-light .faction-font-toggle {
            background: #FFE4B5 !important;
            color: #2c2c2c !important;
            border: 1px solid #D2B48C !important;
        }
        #factionTrackerModal.theme-light .faction-theme-toggle:hover,
        #factionTrackerModal.theme-light .faction-font-toggle:hover {
            background: #FFDAB9 !important;
        }

        /* ========== FONT SIZE SMALL ========== */
        #factionTrackerModal.font-small .faction-modal-title {
            font-size: 18px !important;
        }
        #factionTrackerModal.font-small .faction-input-group label {
            font-size: 13px !important;
        }
        #factionTrackerModal.font-small .faction-input-group input {
            font-size: 13px !important;
            padding: 7px 10px !important;
        }
        #factionTrackerModal.font-small .faction-submit-btn {
            font-size: 14px !important;
        }
        #factionTrackerModal.font-small .faction-status {
            font-size: 12px !important;
        }
        #factionTrackerModal.font-small .faction-checkbox {
            font-size: 12px !important;
        }

        /* ========== FONT SIZE LARGE ========== */
        #factionTrackerModal.font-large .faction-modal-title {
            font-size: 24px !important;
        }
        #factionTrackerModal.font-large .faction-input-group label {
            font-size: 16px !important;
        }
        #factionTrackerModal.font-large .faction-input-group input {
            font-size: 16px !important;
            padding: 10px 14px !important;
        }
        #factionTrackerModal.font-large .faction-submit-btn {
            font-size: 18px !important;
        }
        #factionTrackerModal.font-large .faction-status {
            font-size: 15px !important;
        }
        #factionTrackerModal.font-large .faction-checkbox {
            font-size: 15px !important;
        }

        /* ========== MODAL HEADER ========== */
        .faction-modal-header {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            margin-bottom: 20px !important;
            gap: 10px !important;
        }
        .faction-modal-title {
            font-size: 20px !important;
            font-weight: 600 !important;
            margin: 0 !important;
            flex: 1 !important;
        }
        .faction-header-controls {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        .faction-theme-toggle,
        .faction-font-toggle {
            padding: 6px 12px !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            cursor: pointer !important;
            font-weight: 600 !important;
            min-width: 45px !important;
            text-align: center !important;
        }
        #modalCloseBtn {
            position: absolute !important;
            top: 8px !important;
            right: 8px !important;
            background: transparent !important;
            border: none !important;
            font-size: 24px !important;
            cursor: pointer !important;
            width: 32px !important;
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 4px !important;
            line-height: 1 !important;
            padding: 0 !important;
        }
        #factionTrackerOverlay {
            display: none !important;
        }

        /* ========== INPUTS CONTAINER - RESPONSIVE GRID ========== */
        .faction-inputs-container {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
            margin-bottom: 16px !important;
        }

        /* Default: 2 columns (wide modal) */
        .faction-input-group.order-1 { order: 1; grid-column: 1; }
        .faction-input-group.order-2 { order: 2; grid-column: 2; }
        .faction-input-group.order-3 { order: 3; grid-column: 1; }
        .faction-input-group.order-4 { order: 4; grid-column: 2; }
        .faction-input-group.order-5 { order: 5; grid-column: 1; }
        .faction-input-group.order-6 { order: 6; grid-column: 2; }
        .faction-input-group.order-7 { order: 7; grid-column: 1; }
        .faction-input-group.order-8 { order: 8; grid-column: 2; }
        .faction-input-group.order-9 { order: 9; grid-column: 1; }
        .faction-input-group.order-10 { order: 10; grid-column: 2; }
        .faction-input-group.order-11 { order: 11; grid-column: 1; }
        .faction-input-group.order-12 { order: 12; grid-column: 2; }

        /* Narrow modal: 1 column with custom order */
        .faction-inputs-container.narrow-layout {
            grid-template-columns: 1fr !important;
        }
        .faction-inputs-container.narrow-layout .faction-input-group.order-1 { order: 1; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-3 { order: 2; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-5 { order: 3; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-7 { order: 4; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-2 { order: 5; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-4 { order: 6; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-6 { order: 7; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-8 { order: 8; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-10 { order: 9; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-9 { order: 10; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-11 { order: 11; grid-column: 1; }
        .faction-inputs-container.narrow-layout .faction-input-group.order-12 { order: 12; grid-column: 1; }

        .faction-input-group {
            display: flex !important;
            flex-direction: column !important;
        }
        .faction-input-group label {
            display: block !important;
            margin-bottom: 6px !important;
            font-weight: 500 !important;
            font-size: 14px !important;
        }
        .faction-input-wrapper {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        .faction-input-group input[type="text"],
        .faction-input-group input[type="number"] {
            flex: 1 !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            box-sizing: border-box !important;
        }
        .faction-input-group input:focus {
            outline: none !important;
        }
        .faction-toggle-btn {
            padding: 4px 8px !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            cursor: pointer !important;
            min-width: 32px !important;
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        .faction-checkbox {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            font-size: 13px !important;
            white-space: nowrap !important;
        }
        .faction-checkbox input[type="checkbox"] {
            cursor: pointer !important;
            width: 16px !important;
            height: 16px !important;
        }
        .faction-submit-btn {
            width: 100% !important;
            padding: 12px !important;
            background-color: #e8741a !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            font-size: 16px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            margin-top: 8px !important;
        }
        .faction-submit-btn:hover {
            background-color: #b05815 !important;
        }
        .faction-submit-btn:disabled {
            background-color: #ccc !important;
            cursor: not-allowed !important;
        }
        .faction-clear-btn {
            width: 100% !important;
            padding: 6px !important;
            background-color: #dc3545 !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            font-weight: 400 !important;
            cursor: pointer !important;
            margin-top: 8px !important;
            opacity: 0.8 !important;
        }
        .faction-clear-btn:hover {
            opacity: 1 !important;
            background-color: #c82333 !important;
        }
        .faction-status {
            margin-top: 12px !important;
            padding: 8px !important;
            border-radius: 4px !important;
            font-size: 13px !important;
            text-align: center !important;
        }
        .faction-status.success {
            background-color: #d4edda !important;
            color: #155724 !important;
        }
        .faction-status.error {
            background-color: #f8d7da !important;
            color: #721c24 !important;
        }
        .faction-status.info {
            background-color: #d1ecf1 !important;
            color: #0c5460 !important;
        }
    `;
    document.head.appendChild(style);

    // ========== CREATE FACTION TRACKER BUTTON ==========
    const factionBtn = document.createElement('button');
    factionBtn.innerText = "Run Script";
    factionBtn.id = "factionTrackerBtn";
    factionBtn.type = "button";

    // Get saved position as pixels (converted from stored percentages)
    let factionSavedTop = getPosition('factionBtn-top', 10);
    let factionSavedLeft = getPosition('factionBtn-left', window.innerWidth - 150);

    // Constrain button to viewport
    function constrainButtonPosition() {
        const maxLeft = window.innerWidth - factionBtn.offsetWidth;
        const maxTop = window.innerHeight - factionBtn.offsetHeight;

        let currentTop = parseInt(factionBtn.style.top) || 0;
        let currentLeft = parseInt(factionBtn.style.left) || 0;

        currentTop = Math.max(0, Math.min(currentTop, maxTop));
        currentLeft = Math.max(0, Math.min(currentLeft, maxLeft));

        factionBtn.style.top = currentTop + 'px';
        factionBtn.style.left = currentLeft + 'px';
    }

    factionBtn.style.top = factionSavedTop + 'px';
    factionBtn.style.left = factionSavedLeft + 'px';

    document.body.appendChild(factionBtn);

    // Constrain button on initial load and window resize
    setTimeout(constrainButtonPosition, 0);
    window.addEventListener('resize', constrainButtonPosition);

    // ========== CREATE FACTION MODAL ==========
    const overlay = document.createElement('div');
    overlay.id = 'factionTrackerOverlay';
    document.body.appendChild(overlay);

    const modal = document.createElement('div');
    modal.id = 'factionTrackerModal';
    modal.innerHTML = `
        <button id="modalCloseBtn" type="button">×</button>

        <div class="faction-modal-header">
            <div class="faction-modal-title">Faction Respect Tracker</div>
            <div class="faction-header-controls">
                <button class="faction-theme-toggle" id="themeToggleBtn" type="button">L/D</button>
                <button class="faction-font-toggle" id="fontToggleBtn" type="button">f/F</button>
            </div>
        </div>

        <div class="faction-inputs-container" id="inputsContainer">
            <!-- Order 1: API Key (L1) -->
            <div class="faction-input-group order-1">
                <label>Enter Limited API Key:</label>
                <input type="text" id="apiKeyInput" placeholder="e.g., n8qGytrnQnU0OBlH">
            </div>

            <!-- Order 2: Total War Payout (R1) -->
            <div class="faction-input-group order-2">
                <label>Total War Payout:</label>
                <input type="text" id="totalWarPayoutInput" placeholder="e.g., 653,000,000">
            </div>

            <!-- Order 3: Faction ID (L2) -->
            <div class="faction-input-group order-3">
                <label>Enter Enemy Faction ID:</label>
                <input type="text" id="factionIdInput" placeholder="e.g., 15961">
            </div>

            <!-- Order 4: Total Withheld (R2) -->
            <div class="faction-input-group order-4">
                <label>Total Withheld:</label>
                <div class="faction-input-wrapper">
                    <input type="number" id="totalWithheldInput" placeholder="Amount or %">
                    <button class="faction-toggle-btn" id="withheldToggleBtn" type="button">%</button>
                </div>
            </div>

            <!-- Order 5: Start Time (L3) -->
            <div class="faction-input-group order-5">
                <label>Enter Start Time:</label>
                <input type="text" id="startTimeInput" placeholder="e.g., 20:00:00 - 09/10/25">
            </div>

            <!-- Order 6: Inside Hits % (R3) -->
            <div class="faction-input-group order-6">
                <label>% Payable for Inside Hits:</label>
                <input type="number" id="insideHitsPctInput" placeholder="0-100" min="0" max="100">
            </div>

            <!-- Order 7: End Time (L4) -->
            <div class="faction-input-group order-7">
                <label>Enter End Time:</label>
                <input type="text" id="endTimeInput" placeholder="e.g., 15:56:10 - 11/10/25">
            </div>

            <!-- Order 8: Outside Hits % (R4) -->
            <div class="faction-input-group order-8">
                <label>% Payable for Outside Hits:</label>
                <input type="number" id="outsideHitsPctInput" placeholder="0-100" min="0" max="100">
            </div>

            <!-- Order 9: Revive Energy Cost (L5) -->
            <div class="faction-input-group order-9">
                <label>Revive Energy Cost (Multiples of 5):</label>
                <input type="number" id="reviveEnergyCostInput" placeholder="e.g., 70" min="5" step="5">
            </div>

            <!-- Order 10: Assists % (R5) -->
            <div class="faction-input-group order-10">
                <label>% Payable for Assists:</label>
                <div class="faction-input-wrapper">
                    <input type="number" id="assistsPctInput" placeholder="0-100" min="0" max="100">
                    <div class="faction-checkbox">
                        <input type="checkbox" id="excludeAssistsCheckbox" checked>
                        <label for="excludeAssistsCheckbox">Exclude</label>
                    </div>
                </div>
            </div>

            <!-- Order 11: Revive Success % (L6) -->
            <div class="faction-input-group order-11">
                <label>% Payable for Successful Revives:</label>
                <div class="faction-input-wrapper">
                    <input type="number" id="reviveSuccessPctInput" placeholder="0-100" min="0" max="100">
                    <div class="faction-checkbox">
                        <input type="checkbox" id="excludeReviveSuccessCheckbox" checked>
                        <label for="excludeReviveSuccessCheckbox">Exclude</label>
                    </div>
                </div>
            </div>

            <!-- Order 12: Revive Failed % (R6) -->
            <div class="faction-input-group order-12">
                <label>% Payable for Failed Revives:</label>
                <div class="faction-input-wrapper">
                    <input type="number" id="reviveFailedPctInput" placeholder="0-100" min="0" max="100">
                    <div class="faction-checkbox">
                        <input type="checkbox" id="excludeReviveFailedCheckbox" checked>
                        <label for="excludeReviveFailedCheckbox">Exclude</label>
                    </div>
                </div>
            </div>
        </div>

        <button class="faction-submit-btn" id="factionSubmitBtn">Run Report</button>
        <button class="faction-clear-btn" id="factionClearBtn">Clear Data</button>
        <div id="factionStatus"></div>
    `;
    document.body.appendChild(modal);

    // Apply saved theme and font size
    const savedTheme = getTheme();
    const savedFontSize = getFontSize();
    modal.classList.add(`theme-${savedTheme}`);
    modal.classList.add(`font-${savedFontSize}`);

    // Load saved input values
    loadInputValues();

    // Auto-save all inputs on change
    const inputs = [
        'apiKeyInput', 'factionIdInput', 'startTimeInput', 'endTimeInput',
        'reviveEnergyCostInput', 'reviveSuccessPctInput', 'totalWarPayoutInput',
        'totalWithheldInput', 'insideHitsPctInput', 'outsideHitsPctInput',
        'assistsPctInput', 'reviveFailedPctInput'
    ];

    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', saveInputValues);
    });

    // Auto-save checkboxes
    ['excludeAssistsCheckbox', 'excludeReviveSuccessCheckbox', 'excludeReviveFailedCheckbox'].forEach(id => {
        document.getElementById(id).addEventListener('change', saveInputValues);
    });

    // Toggle button functionality
    document.getElementById('withheldToggleBtn').addEventListener('click', function() {
        const btn = this;
        btn.textContent = btn.textContent === '%' ? '$' : '%';
        saveInputValues();
    });

    // Theme toggle functionality
    document.getElementById('themeToggleBtn').addEventListener('click', function() {
        const currentTheme = modal.classList.contains('theme-dark') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        modal.classList.remove('theme-dark', 'theme-light');
        modal.classList.add(`theme-${newTheme}`);
        saveTheme(newTheme);
    });

    // Font size toggle functionality
    document.getElementById('fontToggleBtn').addEventListener('click', function() {
        const currentFont = modal.classList.contains('font-small') ? 'small' : 'large';
        const newFont = currentFont === 'small' ? 'large' : 'small';

        modal.classList.remove('font-small', 'font-large');
        modal.classList.add(`font-${newFont}`);
        saveFontSize(newFont);
    });

    // Function to check modal width and update layout
    function updateModalLayout() {
        if (!modal.classList.contains('active')) return;

        const inputsContainer = document.getElementById('inputsContainer');
        const modalWidth = modal.offsetWidth;

        // Use 600px as breakpoint
        if (modalWidth < 600) {
            inputsContainer.classList.add('narrow-layout');
        } else {
            inputsContainer.classList.remove('narrow-layout');
        }
    }

    // Restore modal state, position, and size if it was open
    const wasModalOpen = getModalState();
    if (wasModalOpen) {
        modal.classList.add('active');
        overlay.classList.add('active');

        const mobile = isMobile();
        const savedModalTop = getModalPosition('modal-top', null);
        const savedModalLeft = getModalPosition('modal-left', null);
        const savedWidth = getModalSize('modal-width', null);
        const savedHeight = getModalSize('modal-height', null);

        let finalWidth, finalHeight;

        if (mobile) {
            // Mobile defaults
            finalWidth = savedWidth || (window.innerWidth - 10);
            finalHeight = savedHeight || Math.min(window.innerHeight / 2, window.innerHeight - 10);

            if (savedModalTop && savedModalLeft) {
                modal.style.setProperty('left', savedModalLeft + 'px', 'important');
                modal.style.setProperty('top', savedModalTop + 'px', 'important');
                modal.style.setProperty('transform', 'none', 'important');
            } else {
                // Default to bottom half
                modal.style.setProperty('left', '5px', 'important');
                modal.style.setProperty('top', (window.innerHeight - finalHeight - 5) + 'px', 'important');
                modal.style.setProperty('transform', 'none', 'important');
            }
        } else {
            // Desktop defaults
            finalWidth = savedWidth || 600;
            finalHeight = savedHeight || Math.min(500, window.innerHeight * 0.9);

            if (savedModalTop && savedModalLeft) {
                modal.style.setProperty('left', savedModalLeft + 'px', 'important');
                modal.style.setProperty('top', savedModalTop + 'px', 'important');
                modal.style.setProperty('transform', 'none', 'important');
            }
        }

        modal.style.setProperty('width', finalWidth + 'px', 'important');
        modal.style.setProperty('height', finalHeight + 'px', 'important');

        setTimeout(() => {
            constrainModalToViewport();
            updateModalLayout();
        }, 0);
    }

    function constrainModalToViewport() {
        if (!modal.classList.contains('active')) return;

        const mobile = isMobile();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const currentWidth = modal.offsetWidth;
        const currentHeight = modal.offsetHeight;

        // Mobile: 5px padding on all sides, Desktop: 20px margin
        const padding = mobile ? 10 : 40;
        const maxAllowedWidth = mobile ? (viewportWidth - padding) : Math.min(1000, viewportWidth - padding);
        const maxAllowedHeight = mobile ? (viewportHeight - padding) : (viewportHeight * 0.9);

        // Mobile: min 150x250, Desktop: min 250x200
        const minWidth = mobile ? 150 : 250;
        const minHeight = mobile ? 250 : 200;

        let needsUpdate = false;
        let newWidth = currentWidth;
        let newHeight = currentHeight;

        if (currentWidth > maxAllowedWidth) {
            newWidth = Math.max(minWidth, maxAllowedWidth);
            needsUpdate = true;
        }

        if (currentHeight > maxAllowedHeight) {
            newHeight = Math.max(minHeight, maxAllowedHeight);
            needsUpdate = true;
        }

        if (currentWidth < minWidth) {
            newWidth = minWidth;
            needsUpdate = true;
        }

        if (currentHeight < minHeight) {
            newHeight = minHeight;
            needsUpdate = true;
        }

        if (needsUpdate) {
            modal.style.setProperty('width', newWidth + 'px', 'important');
            modal.style.setProperty('height', newHeight + 'px', 'important');
            saveModalSize(newWidth, newHeight);
            updateModalLayout();
        }

        // Also constrain position to stay within viewport
        const rect = modal.getBoundingClientRect();
        if (rect.left < 5) {
            modal.style.setProperty('left', '5px', 'important');
            modal.style.setProperty('transform', 'none', 'important');
        }
        if (rect.top < 5) {
            modal.style.setProperty('top', '5px', 'important');
            modal.style.setProperty('transform', 'none', 'important');
        }
        if (rect.right > viewportWidth - 5) {
            modal.style.setProperty('left', (viewportWidth - newWidth - 5) + 'px', 'important');
            modal.style.setProperty('transform', 'none', 'important');
        }
        if (rect.bottom > viewportHeight - 5) {
            modal.style.setProperty('top', (viewportHeight - newHeight - 5) + 'px', 'important');
            modal.style.setProperty('transform', 'none', 'important');
        }
    }

    // Save modal size when resized and update layout
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === modal && modal.classList.contains('active')) {
                const mobile = isMobile();
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;

                // Mobile: min 150x250, Desktop: min 250x200
                const minWidth = mobile ? 150 : 250;
                const minHeight = mobile ? 250 : 200;

                // Max size: viewport minus 10px (5px padding on each side)
                const maxWidth = mobile ? (window.innerWidth - 10) : Math.min(1000, window.innerWidth - 40);
                const maxHeight = mobile ? (window.innerHeight - 10) : (window.innerHeight * 0.9);

                const constrainedWidth = Math.max(minWidth, Math.min(width, maxWidth));
                const constrainedHeight = Math.max(minHeight, Math.min(height, maxHeight));

                if (width !== constrainedWidth || height !== constrainedHeight) {
                    modal.style.setProperty('width', constrainedWidth + 'px', 'important');
                    modal.style.setProperty('height', constrainedHeight + 'px', 'important');
                }

                saveModalSize(constrainedWidth, constrainedHeight);
                updateModalLayout();
            }
        }
    });
    resizeObserver.observe(modal);

    window.addEventListener('resize', () => {
        constrainButtonPosition();
        constrainModalToViewport();
        updateModalLayout();
    });

    // ========== DRAG FUNCTIONALITY FOR MODAL ==========
    let isModalDragging = false;
    let modalStartX, modalStartY;
    let modalStartLeft, modalStartTop;

    modal.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'INPUT' ||
            e.target.tagName === 'BUTTON' ||
            e.target.tagName === 'LABEL' ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('.faction-checkbox')) {
            return;
        }

        if (e.button !== 0) {
            return;
        }

        const rect = modal.getBoundingClientRect();
        const resizeHandleSize = 20;
        const isNearRightEdge = e.clientX > rect.right - resizeHandleSize;
        const isNearBottomEdge = e.clientY > rect.bottom - resizeHandleSize;

        if (isNearRightEdge && isNearBottomEdge) {
            return;
        }

        isModalDragging = true;
        modal.classList.add('dragging-modal');

        modalStartX = e.clientX;
        modalStartY = e.clientY;

        const hasExplicitPosition = modal.style.left &&
                                    modal.style.left !== '50%' &&
                                    modal.style.getPropertyValue('transform') === 'none';

        if (hasExplicitPosition) {
            modalStartLeft = parseFloat(modal.style.left);
            modalStartTop = parseFloat(modal.style.top);
        } else {
            const rect = modal.getBoundingClientRect();
            modalStartLeft = rect.left;
            modalStartTop = rect.top;

            modal.style.setProperty('left', modalStartLeft + 'px', 'important');
            modal.style.setProperty('top', modalStartTop + 'px', 'important');
            modal.style.setProperty('transform', 'none', 'important');
        }

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isModalDragging) return;

        e.preventDefault();

        const deltaX = e.clientX - modalStartX;
        const deltaY = e.clientY - modalStartY;

        const newLeft = modalStartLeft + deltaX;
        const newTop = modalStartTop + deltaY;

        const modalWidth = modal.offsetWidth;
        const modalHeight = modal.offsetHeight;

        // Constrain to viewport with 5px padding on all sides
        const finalLeft = Math.max(5, Math.min(newLeft, window.innerWidth - modalWidth - 5));
        const finalTop = Math.max(5, Math.min(newTop, window.innerHeight - modalHeight - 5));

        modal.style.setProperty('left', finalLeft + 'px', 'important');
        modal.style.setProperty('top', finalTop + 'px', 'important');
    });

    document.addEventListener('mouseup', (e) => {
        if (isModalDragging) {
            isModalDragging = false;
            modal.classList.remove('dragging-modal');

            const top = parseFloat(modal.style.top);
            const left = parseFloat(modal.style.left);
            saveModalPosition(top, left);
        }
    });

    // ========== DRAG FUNCTIONALITY FOR FACTION BUTTON ==========
    let isDragging = false;
    let startX, startY;
    let startLeft, startTop;

    factionBtn.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDragging = true;
        factionBtn.classList.add('dragging');
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(factionBtn.style.left) || 0;
        startTop = parseInt(factionBtn.style.top) || 0;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;
        const maxLeft = window.innerWidth - factionBtn.offsetWidth;
        const maxTop = window.innerHeight - factionBtn.offsetHeight;
        const constrainedLeft = Math.max(0, Math.min(newLeft, maxLeft));
        const constrainedTop = Math.max(0, Math.min(newTop, maxTop));
        factionBtn.style.left = constrainedLeft + 'px';
        factionBtn.style.top = constrainedTop + 'px';
    });

    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            factionBtn.classList.remove('dragging');
            const top = parseInt(factionBtn.style.top.replace('px', ''));
            const left = parseInt(factionBtn.style.left.replace('px', ''));
            savePosition(top, left);
        }
    });

    // ========== FACTION BUTTON CLICK HANDLER ==========
    let clickStartX, clickStartY;

    factionBtn.addEventListener('mousedown', (e) => {
        clickStartX = e.clientX;
        clickStartY = e.clientY;
    });

    factionBtn.addEventListener('click', (e) => {
        const dragDistance = Math.sqrt(
            Math.pow(e.clientX - clickStartX, 2) +
            Math.pow(e.clientY - clickStartY, 2)
        );

        if (dragDistance > 5) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        modal.classList.add('active');
        overlay.classList.add('active');

        saveModalState(true);

        const mobile = isMobile();
        const savedModalTop = getModalPosition('modal-top', null);
        const savedModalLeft = getModalPosition('modal-left', null);
        const savedWidth = getModalSize('modal-width', null);
        const savedHeight = getModalSize('modal-height', null);

        let finalWidth, finalHeight, finalTop, finalLeft;

        if (mobile) {
            // Mobile: full width minus 10px (5px padding each side), half height, bottom half of screen
            finalWidth = savedWidth || (window.innerWidth - 10);
            finalHeight = savedHeight || Math.min(window.innerHeight / 2, window.innerHeight - 10);

            // Position at bottom half (if no saved position)
            if (!savedModalTop || !savedModalLeft) {
                finalLeft = 5; // 5px from left edge
                finalTop = window.innerHeight - finalHeight - 5; // 5px from bottom
                modal.style.setProperty('left', finalLeft + 'px', 'important');
                modal.style.setProperty('top', finalTop + 'px', 'important');
                modal.style.setProperty('transform', 'none', 'important');
            }
        } else {
            // Desktop: centered or use saved position
            finalWidth = savedWidth || 600;
            finalHeight = savedHeight || Math.min(500, window.innerHeight * 0.9);

            if (!savedModalTop || !savedModalLeft) {
                modal.style.left = '50%';
                modal.style.top = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
            }
        }

        modal.style.setProperty('width', finalWidth + 'px', 'important');
        modal.style.setProperty('height', finalHeight + 'px', 'important');

        setTimeout(() => {
            constrainModalToViewport();
            updateModalLayout();
        }, 0);

        return false;
    });

    // Close modal when clicking X button
    document.addEventListener('click', (e) => {
        if (e.target.id === 'modalCloseBtn') {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            saveModalState(false);
        }
    });

    // Clear Data button handler
    document.getElementById('factionClearBtn').addEventListener('click', () => {
        if (!confirm('Are you sure you want to clear all saved data? This will reset the GUI to default settings and clear all saved inputs.')) {
            return;
        }

        if (typeof GM_setValue !== 'undefined') {
            GM_setValue('factionBtn-top', undefined);
            GM_setValue('factionBtn-left', undefined);
            GM_setValue('modal-top', undefined);
            GM_setValue('modal-left', undefined);
            GM_setValue('modal-width', undefined);
            GM_setValue('modal-height', undefined);
            GM_setValue('modal-open', undefined);
            GM_setValue('theme', undefined);
            GM_setValue('fontSize', undefined);
            GM_setValue('input-apiKey', undefined);
            GM_setValue('input-factionId', undefined);
            GM_setValue('input-startTime', undefined);
            GM_setValue('input-endTime', undefined);
            GM_setValue('input-reviveEnergyCost', undefined);
            GM_setValue('input-reviveSuccessPct', undefined);
            GM_setValue('input-totalWarPayout', undefined);
            GM_setValue('input-totalWithheld', undefined);
            GM_setValue('input-insideHitsPct', undefined);
            GM_setValue('input-outsideHitsPct', undefined);
            GM_setValue('input-assistsPct', undefined);
            GM_setValue('input-reviveFailedPct', undefined);
            GM_setValue('checkbox-excludeAssists', undefined);
            GM_setValue('checkbox-excludeReviveSuccess', undefined);
            GM_setValue('checkbox-excludeReviveFailed', undefined);
            GM_setValue('toggle-withheldMode', undefined);
        }

        window.location.reload();
    });

    // ========== FACTION TRACKER LOGIC ==========

    function tornTimeToTimestamp(dateStr) {
        dateStr = dateStr.trim();
        const parts = dateStr.split(' - ');
        if (parts.length !== 2) {
            throw new Error('Invalid format. Use: HH:MM:SS - DD/MM/YY');
        }

        const timePart = parts[0].trim();
        const datePart = parts[1].trim();

        const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');

        const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);

        const date = new Date(Date.UTC(fullYear, parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds)));

        return Math.floor(date.getTime() / 1000);
    }

    function showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('factionStatus');
        statusDiv.textContent = message;
        statusDiv.className = `faction-status ${type}`;
    }

    function makeRequest(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            resolve(JSON.parse(response.responseText));
                        } catch (e) {
                            reject(new Error('Failed to parse response'));
                        }
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: () => reject(new Error('Network error'))
            });
        });
    }

    async function fetchEnemyMembers(apiKey, enemyFactionId) {
        showStatus('Fetching enemy faction members...', 'info');
        const url = `https://api.torn.com/v2/faction/${enemyFactionId}/members?striptags=true&key=${apiKey}`;

        const data = await makeRequest(url);

        if (data.error) {
            throw new Error(data.error.error);
        }

        const members = data.members || [];
        const enemyNames = new Set();

        if (Array.isArray(members)) {
            members.forEach(m => enemyNames.add(m.name));
        } else if (typeof members === 'object') {
            Object.values(members).forEach(m => enemyNames.add(m.name));
        }

        return enemyNames;
    }

    async function fetchAttacks(apiKey, attackType, startTime, endTime) {
        const allAttacks = [];
        const url = `https://api.torn.com/v2/faction/attacks`;
        let params = `filters=${attackType}&limit=100&sort=DESC&from=${startTime}&to=${endTime}&key=${apiKey}`;

        showStatus(`Fetching ${attackType} attacks...`, 'info');

        let page = 1;
        const MAX_PAGES = 95;
        const DELAY_MS = 1000;

        while (page <= MAX_PAGES) {
            if (page > 1) {
                await sleep(DELAY_MS);
            }

            showStatus(`Fetching ${attackType} attacks (page ${page}) - ${allAttacks.length} attacks found`, 'info');

            const fullUrl = `${url}?${params}`;

            try {
                const data = await makeRequest(fullUrl);

                if (data.error) {
                    if (data.error.code === 5 || data.error.error.includes('Too many requests')) {
                        showStatus(`Rate limited, waiting 10 seconds... (page ${page})`, 'info');
                        await sleep(10000);
                        continue;
                    }
                    throw new Error(data.error.error);
                }

                const attacks = data.attacks || [];

                if (attacks.length === 0) {
                    break;
                }

                allAttacks.push(...attacks);

                if (attacks.length < 100) {
                    break;
                }

                const lastTimestamp = attacks[attacks.length - 1].ended || attacks[attacks.length - 1].started || 0;
                params = `filters=${attackType}&limit=100&sort=DESC&from=${startTime}&to=${lastTimestamp - 1}&key=${apiKey}`;

                page++;
            } catch (error) {
                if (error.message.includes('Too many requests')) {
                    showStatus(`Rate limited, waiting 10 seconds... (page ${page})`, 'info');
                    await sleep(10000);
                    continue;
                }
                throw error;
            }
        }

        showStatus(`Fetched ${allAttacks.length} ${attackType} attacks`, 'success');

        return allAttacks;
    }

    async function fetchRevives(apiKey, startTime, endTime) {
        const allRevives = [];
        const url = `https://api.torn.com/v2/faction/revives`;
        let params = `filters=outgoing&limit=100&sort=DESC&from=${startTime}&to=${endTime}&key=${apiKey}`;

        showStatus('Fetching revive data...', 'info');

        let page = 1;
        const MAX_PAGES = 95;
        const DELAY_MS = 1000;

        while (page <= MAX_PAGES) {
            if (page > 1) {
                await sleep(DELAY_MS);
            }

            showStatus(`Fetching revives (page ${page}) - ${allRevives.length} revives found`, 'info');

            const fullUrl = `${url}?${params}`;

            try {
                const data = await makeRequest(fullUrl);

                if (data.error) {
                    if (data.error.code === 5 || data.error.error.includes('Too many requests')) {
                        showStatus(`Rate limited, waiting 10 seconds... (page ${page})`, 'info');
                        await sleep(10000);
                        continue;
                    }
                    throw new Error(data.error.error);
                }

                const revives = data.revives || [];

                if (revives.length === 0) {
                    break;
                }

                allRevives.push(...revives);

                if (revives.length < 100) {
                    break;
                }

                const lastTimestamp = revives[revives.length - 1].timestamp || 0;
                params = `filters=outgoing&limit=100&sort=DESC&from=${startTime}&to=${lastTimestamp - 1}&key=${apiKey}`;

                page++;
            } catch (error) {
                if (error.message.includes('Too many requests')) {
                    showStatus(`Rate limited, waiting 10 seconds... (page ${page})`, 'info');
                    await sleep(10000);
                    continue;
                }
                throw error;
            }
        }

        showStatus(`Fetched ${allRevives.length} revive attempts`, 'success');

        return allRevives;
    }

    function analyzeDefense(incomingAttacks) {
        const memberDefense = {};
        const memberAssistsReceived = {};

        for (const attack of incomingAttacks) {
            const defender = attack.defender || {};
            const defenderName = defender.name || 'Unknown';

            const respectGain = attack.respect_gain || 0;
            const modifiers = attack.modifiers || {};
            const isOverseas = (modifiers.overseas || 1) > 1;
            const isAssist = attack.result === 'Assist';

            if (isAssist) {
                if (!memberAssistsReceived[defenderName]) {
                    memberAssistsReceived[defenderName] = {
                        total_assists_received: 0
                    };
                }
                memberAssistsReceived[defenderName].total_assists_received++;
            } else {
                if (!memberDefense[defenderName]) {
                    memberDefense[defenderName] = {
                        total_attacks_received: 0,
                        total_respect_enemy_gained: 0,
                        attacks_overseas: 0,
                        respect_lost_overseas: 0
                    };
                }

                memberDefense[defenderName].total_attacks_received++;
                memberDefense[defenderName].total_respect_enemy_gained += respectGain;

                if (isOverseas) {
                    memberDefense[defenderName].attacks_overseas++;
                    memberDefense[defenderName].respect_lost_overseas += respectGain;
                }
            }
        }

        return { memberDefense, memberAssistsReceived };
    }

    function analyzeOffense(outgoingAttacks, enemyNames) {
        const memberOffense = {};
        const memberAssistsMade = {};

        for (const attack of outgoingAttacks) {
            const attacker = attack.attacker || {};
            const attackerName = attacker.name || 'Unknown';

            const defender = attack.defender || {};
            const defenderName = defender.name || 'Unknown';

            const respectGain = attack.respect_gain || 0;
            const modifiers = attack.modifiers || {};
            const isOverseas = (modifiers.overseas || 1) > 1;
            const isChain = (attack.chain || 0) > 0;
            const isWarlord = (modifiers.warlord || 1) > 1;
            const isAgainstEnemy = enemyNames.has(defenderName);
            const isAssist = attack.result === 'Assist';

            if (isAssist) {
                if (!memberAssistsMade[attackerName]) {
                    memberAssistsMade[attackerName] = {
                        total_assists_made: 0
                    };
                }
                memberAssistsMade[attackerName].total_assists_made++;
            } else {
                if (!memberOffense[attackerName]) {
                    memberOffense[attackerName] = {
                        total_attacks_made: 0,
                        total_respect_gained: 0,
                        attacks_in: 0,
                        attacks_out: 0,
                        outside_with_chain: 0,
                        attacks_overseas: 0,
                        respect_gained_overseas: 0,
                        attacks_with_warlord: 0
                    };
                }

                memberOffense[attackerName].total_attacks_made++;
                memberOffense[attackerName].total_respect_gained += respectGain;

                if (isAgainstEnemy) {
                    memberOffense[attackerName].attacks_in++;
                } else {
                    memberOffense[attackerName].attacks_out++;
                    if (isChain) {
                        memberOffense[attackerName].outside_with_chain++;
                    }
                }

                if (isOverseas) {
                    memberOffense[attackerName].attacks_overseas++;
                    memberOffense[attackerName].respect_gained_overseas += respectGain;
                }

                if (isWarlord) {
                    memberOffense[attackerName].attacks_with_warlord++;
                }
            }
        }

        return { memberOffense, memberAssistsMade };
    }

    function analyzeRevives(reviveData) {
        const memberRevives = {};

        for (const revive of reviveData) {
            const reviver = revive.reviver || {};
            const reviverName = reviver.name || 'Unknown';
            const result = revive.result || 'unknown';

            if (!memberRevives[reviverName]) {
                memberRevives[reviverName] = {
                    revives_successful: 0,
                    revives_failed: 0
                };
            }

            if (result === 'success') {
                memberRevives[reviverName].revives_successful++;
            } else if (result === 'failure') {
                memberRevives[reviverName].revives_failed++;
            }
        }

        return memberRevives;
    }

    function generateExcel(memberDefense, memberAssistsReceived, memberOffense, memberAssistsMade, memberRevives, paymentConfig, startInput, endInput) {
        showStatus('Generating Excel report...', 'info');

        if (typeof XLSX === 'undefined') {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                script.onload = () => {
                    resolve(createExcelFile(memberDefense, memberAssistsReceived, memberOffense, memberAssistsMade, memberRevives, paymentConfig, startInput, endInput));
                };
                script.onerror = () => {
                    reject(new Error('Failed to load Excel library'));
                };
                document.head.appendChild(script);
            });
        } else {
            return Promise.resolve(createExcelFile(memberDefense, memberAssistsReceived, memberOffense, memberAssistsMade, memberRevives, paymentConfig, startInput, endInput));
        }
    }

    function createExcelFile(memberDefense, memberAssistsReceived, memberOffense, memberAssistsMade, memberRevives, paymentConfig, startInput, endInput) {
        const wb = XLSX.utils.book_new();

        // ========== MAIN DATA SHEET ==========
        const headers = [
            "Name",
            "Total Attacks Rec'd",
            "Total Respect Lost (Enemy Gained)",
            "Attacks Rec'd Overseas",
            "Respect Lost Overseas",
            "Total Assists Rec'd",
            "",
            "Total Attacks Made",
            "Total Respect Gained",
            "Attacks In (vs Enemy)",
            "Attacks Out (Outside)",
            "Outside w/ Chain",
            "Attacks Overseas",
            "Respect Gained Overseas",
            "Attacks w/ Warlord",
            "Total Assists Made",
            "Revives Successful",
            "Revives Failed"
        ];

        const allMembers = new Set([
            ...Object.keys(memberDefense),
            ...Object.keys(memberAssistsReceived),
            ...Object.keys(memberOffense),
            ...Object.keys(memberAssistsMade),
            ...Object.keys(memberRevives)
        ]);

        const sortedMembers = Array.from(allMembers).sort((a, b) => {
            const aVal = (memberDefense[a] || {}).total_respect_enemy_gained || 0;
            const bVal = (memberDefense[b] || {}).total_respect_enemy_gained || 0;
            return bVal - aVal;
        });

        const data = [headers];

        for (const member of sortedMembers) {
            const defense = memberDefense[member] || {};
            const assistsRec = memberAssistsReceived[member] || {};
            const offense = memberOffense[member] || {};
            const assistsMade = memberAssistsMade[member] || {};
            const revives = memberRevives[member] || {};

            data.push([
                member,
                defense.total_attacks_received || 0,
                Math.round((defense.total_respect_enemy_gained || 0) * 100) / 100,
                defense.attacks_overseas || 0,
                Math.round((defense.respect_lost_overseas || 0) * 100) / 100,
                assistsRec.total_assists_received || 0,
                "",
                offense.total_attacks_made || 0,
                Math.round((offense.total_respect_gained || 0) * 100) / 100,
                offense.attacks_in || 0,
                offense.attacks_out || 0,
                offense.outside_with_chain || 0,
                offense.attacks_overseas || 0,
                Math.round((offense.respect_gained_overseas || 0) * 100) / 100,
                offense.attacks_with_warlord || 0,
                assistsMade.total_assists_made || 0,
                revives.revives_successful || 0,
                revives.revives_failed || 0
            ]);
        }

        data.push([]);
        data.push([]);

        const totalDefense = {
            attacks_received: Object.values(memberDefense).reduce((sum, d) => sum + (d.total_attacks_received || 0), 0),
            respect_enemy_gained: Object.values(memberDefense).reduce((sum, d) => sum + (d.total_respect_enemy_gained || 0), 0),
            attacks_overseas: Object.values(memberDefense).reduce((sum, d) => sum + (d.attacks_overseas || 0), 0),
            respect_lost_overseas: Object.values(memberDefense).reduce((sum, d) => sum + (d.respect_lost_overseas || 0), 0)
        };

        const totalAssistsReceived = Object.values(memberAssistsReceived).reduce((sum, a) => sum + (a.total_assists_received || 0), 0);

        const totalOffense = {
            attacks_made: Object.values(memberOffense).reduce((sum, o) => sum + (o.total_attacks_made || 0), 0),
            respect_gained: Object.values(memberOffense).reduce((sum, o) => sum + (o.total_respect_gained || 0), 0),
            attacks_in: Object.values(memberOffense).reduce((sum, o) => sum + (o.attacks_in || 0), 0),
            attacks_out: Object.values(memberOffense).reduce((sum, o) => sum + (o.attacks_out || 0), 0),
            outside_with_chain: Object.values(memberOffense).reduce((sum, o) => sum + (o.outside_with_chain || 0), 0),
            attacks_overseas: Object.values(memberOffense).reduce((sum, o) => sum + (o.attacks_overseas || 0), 0),
            respect_gained_overseas: Object.values(memberOffense).reduce((sum, o) => sum + (o.respect_gained_overseas || 0), 0),
            attacks_with_warlord: Object.values(memberOffense).reduce((sum, o) => sum + (o.attacks_with_warlord || 0), 0)
        };

        const totalAssistsMade = Object.values(memberAssistsMade).reduce((sum, a) => sum + (a.total_assists_made || 0), 0);

        const totalRevives = {
            successful: Object.values(memberRevives).reduce((sum, r) => sum + (r.revives_successful || 0), 0),
            failed: Object.values(memberRevives).reduce((sum, r) => sum + (r.revives_failed || 0), 0)
        };

        data.push([
            "TOTAL",
            totalDefense.attacks_received,
            Math.round(totalDefense.respect_enemy_gained * 100) / 100,
            totalDefense.attacks_overseas,
            Math.round(totalDefense.respect_lost_overseas * 100) / 100,
            totalAssistsReceived,
            "",
            totalOffense.attacks_made,
            Math.round(totalOffense.respect_gained * 100) / 100,
            totalOffense.attacks_in,
            totalOffense.attacks_out,
            totalOffense.outside_with_chain,
            totalOffense.attacks_overseas,
            Math.round(totalOffense.respect_gained_overseas * 100) / 100,
            totalOffense.attacks_with_warlord,
            totalAssistsMade,
            totalRevives.successful,
            totalRevives.failed
        ]);

        const ws = XLSX.utils.aoa_to_sheet(data);

        const colWidths = [];
        for (let col = 0; col < headers.length; col++) {
            let maxWidth = headers[col].length;
            for (let row = 1; row < data.length; row++) {
                if (data[row][col]) {
                    const cellLength = String(data[row][col]).length;
                    maxWidth = Math.max(maxWidth, cellLength);
                }
            }
            colWidths.push({ wch: maxWidth + 2 });
        }
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, "Faction Report");

        // ========== PAYMENT CALCULATION SHEET ==========
        const paymentData = calculatePayments(
            memberOffense,
            memberAssistsMade,
            memberRevives,
            paymentConfig
        );

        const payoutSheet = createPaymentSheet(paymentData, sortedMembers, paymentConfig);
        XLSX.utils.book_append_sheet(wb, payoutSheet, "Payout");

        const filename = `faction_report_${startInput.replace(/[:\s\-\/]/g, '_')}_to_${endInput.replace(/[:\s\-\/]/g, '_')}.xlsx`;
        XLSX.writeFile(wb, filename);

        return filename;
    }

    function calculatePayments(memberOffense, memberAssistsMade, memberRevives, config) {
        const {
            totalWarPayout,
            withheldAmount,
            withheldMode,
            insideHitsPct,
            outsideHitsPct,
            assistsPct,
            reviveSuccessPct,
            reviveFailedPct,
            excludeAssists,
            excludeReviveSuccess,
            excludeReviveFailed,
            reviveMultiplier
        } = config;

        let actualWithheld = 0;
        if (withheldMode === '%') {
            actualWithheld = (totalWarPayout * withheldAmount) / 100;
        } else {
            actualWithheld = withheldAmount;
        }

        const availablePayout = totalWarPayout - actualWithheld;

        let totalHitsRaw = 0;
        let pTotal = 0;

        const memberPayments = {};

        const allMembers = new Set([
            ...Object.keys(memberOffense),
            ...Object.keys(memberAssistsMade),
            ...Object.keys(memberRevives)
        ]);

        for (const member of allMembers) {
            const offense = memberOffense[member] || {};
            const assists = memberAssistsMade[member] || {};
            const revives = memberRevives[member] || {};

            const insideHits = offense.attacks_in || 0;
            const outsideHits = offense.attacks_out || 0;
            const assistsCount = assists.total_assists_made || 0;
            const reviveSuccess = revives.revives_successful || 0;
            const reviveFailed = revives.revives_failed || 0;

            const rawTotal = insideHits + outsideHits + assistsCount + reviveSuccess + reviveFailed;
            totalHitsRaw += rawTotal;

            let memberPTotal = 0;
            memberPTotal += insideHits * insideHitsPct;
            memberPTotal += outsideHits * outsideHitsPct;

            if (!excludeAssists) {
                memberPTotal += assistsCount * assistsPct;
            }
            if (!excludeReviveSuccess) {
                memberPTotal += reviveSuccess * reviveSuccessPct * reviveMultiplier;
            }
            if (!excludeReviveFailed) {
                memberPTotal += reviveFailed * reviveFailedPct * reviveMultiplier;
            }

            pTotal += memberPTotal;

            memberPayments[member] = {
                insideHits,
                outsideHits,
                assistsCount,
                reviveSuccess,
                reviveFailed,
                memberPTotal,
                rawTotal
            };
        }

        const scaleFactor = pTotal > 0 ? 100 / pTotal : 0;
        const rawPerHit = totalHitsRaw > 0 ? availablePayout / totalHitsRaw : 0;

        for (const member of allMembers) {
            const payment = memberPayments[member];
            const memberAdjustedPct = payment.memberPTotal * scaleFactor;
            const finalPayout = Math.floor((availablePayout * memberAdjustedPct) / 100);

            memberPayments[member].finalPayout = finalPayout;
        }

        return {
            totalWarPayout,
            actualWithheld,
            availablePayout,
            totalHitsRaw,
            rawPerHit,
            memberPayments,
            config
        };
    }

    function createPaymentSheet(paymentData, sortedMembers, config) {
        const { totalWarPayout, totalHitsRaw, rawPerHit, memberPayments } = paymentData;

        const data = [];

        data.push(["Payment Configuration"]);
        data.push(["Total War Plunder:", totalWarPayout]);

        let withheldDisplay = "";
        if (config.withheldMode === '%') {
            withheldDisplay = config.withheldAmount + "%";
        } else {
            withheldDisplay = "$" + config.withheldAmount;
        }
        data.push(["Withheld:", withheldDisplay]);
        data.push([]);
        data.push(["Payment Percentages:"]);
        data.push(["Inside Hits:", config.insideHitsPct + "%"]);
        data.push(["Outside Hits:", config.outsideHitsPct + "%"]);
        data.push(["Assists:", config.excludeAssists ? "EXCLUDED" : config.assistsPct + "%"]);
        data.push(["Revive Success:", config.excludeReviveSuccess ? "EXCLUDED" : config.reviveSuccessPct + "%"]);
        data.push(["Revive Failed:", config.excludeReviveFailed ? "EXCLUDED" : config.reviveFailedPct + "%"]);
        data.push(["Revive Multiplier:", config.reviveMultiplier.toFixed(2) + "x"]);
        data.push([]);
        data.push(["Total Hits (No Exclusions):", totalHitsRaw]);
        data.push(["Raw Per Hit:", Math.floor(rawPerHit)]);
        data.push([]);
        data.push([]);

        data.push(["Name", "Raw Per Hit Payout", "Scaled Payout"]);

        let totalRawPayout = 0;
        let totalScaledPayout = 0;

        for (const member of sortedMembers) {
            const payment = memberPayments[member];
            if (!payment) {
                data.push([member, 0, 0]);
                continue;
            }

            const rawPayout = Math.floor(payment.rawTotal * rawPerHit);
            const scaledPayout = payment.finalPayout;

            totalRawPayout += rawPayout;
            totalScaledPayout += scaledPayout;

            data.push([member, rawPayout, scaledPayout]);
        }

        data.push([]);
        data.push(["TOTAL", totalRawPayout, totalScaledPayout]);

        const ws = XLSX.utils.aoa_to_sheet(data);

        const colWidths = [
            { wch: 20 },
            { wch: 20 },
            { wch: 20 }
        ];
        ws['!cols'] = colWidths;

        return ws;
    }

    // ========== SUBMIT HANDLER ==========
    document.getElementById('factionSubmitBtn').addEventListener('click', async () => {
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const enemyFactionId = document.getElementById('factionIdInput').value.trim();
        const startTime = document.getElementById('startTimeInput').value.trim();
        const endTime = document.getElementById('endTimeInput').value.trim();

        const totalWarPayout = cleanNumberInput(document.getElementById('totalWarPayoutInput').value);
        const totalWithheldInput = cleanNumberInput(document.getElementById('totalWithheldInput').value);
        const withheldMode = document.getElementById('withheldToggleBtn').textContent;
        const insideHitsPct = cleanNumberInput(document.getElementById('insideHitsPctInput').value);
        const outsideHitsPct = cleanNumberInput(document.getElementById('outsideHitsPctInput').value);
        const assistsPct = cleanNumberInput(document.getElementById('assistsPctInput').value);
        const reviveSuccessPct = cleanNumberInput(document.getElementById('reviveSuccessPctInput').value);
        const reviveFailedPct = cleanNumberInput(document.getElementById('reviveFailedPctInput').value);
        const reviveEnergyCost = cleanNumberInput(document.getElementById('reviveEnergyCostInput').value) || 70;
        const excludeAssists = document.getElementById('excludeAssistsCheckbox').checked;
        const excludeReviveSuccess = document.getElementById('excludeReviveSuccessCheckbox').checked;
        const excludeReviveFailed = document.getElementById('excludeReviveFailedCheckbox').checked;

        const reviveMultiplier = reviveEnergyCost / 25;

        const paymentConfig = {
            totalWarPayout,
            withheldAmount: totalWithheldInput,
            withheldMode,
            insideHitsPct,
            outsideHitsPct,
            assistsPct,
            reviveSuccessPct,
            reviveFailedPct,
            excludeAssists,
            excludeReviveSuccess,
            excludeReviveFailed,
            reviveMultiplier
        };

        if (!apiKey) {
            showStatus('Please enter an API key', 'error');
            return;
        }

        if (!enemyFactionId) {
            showStatus('Please enter an enemy faction ID', 'error');
            return;
        }

        if (!startTime) {
            showStatus('Please enter a start time', 'error');
            return;
        }

        if (!endTime) {
            showStatus('Please enter an end time', 'error');
            return;
        }

        const submitBtn = document.getElementById('factionSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        try {
            const startTimestamp = tornTimeToTimestamp(startTime);
            const endTimestamp = tornTimeToTimestamp(endTime);

            console.log('Start timestamp:', startTimestamp, '(', startTime, ')');
            console.log('End timestamp:', endTimestamp, '(', endTime, ')');

            const enemyNames = await fetchEnemyMembers(apiKey, enemyFactionId);
            showStatus(`Found ${enemyNames.size} enemy faction members`, 'success');
            await sleep(1000);

            const incomingAttacks = await fetchAttacks(apiKey, 'incoming', startTimestamp, endTimestamp);
            await sleep(1000);

            const outgoingAttacks = await fetchAttacks(apiKey, 'outgoing', startTimestamp, endTimestamp);
            await sleep(1000);

            const reviveData = await fetchRevives(apiKey, startTimestamp, endTimestamp);

            if (incomingAttacks.length === 0 && outgoingAttacks.length === 0) {
                showStatus('No attacks found in the specified time range', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Run Report';
                return;
            }

            showStatus('Analyzing attack data...', 'info');
            const { memberDefense, memberAssistsReceived } = analyzeDefense(incomingAttacks);
            const { memberOffense, memberAssistsMade } = analyzeOffense(outgoingAttacks, enemyNames);
            const memberRevives = analyzeRevives(reviveData);

            const filename = await generateExcel(memberDefense, memberAssistsReceived, memberOffense, memberAssistsMade, memberRevives, paymentConfig, startTime, endTime);
            showStatus(`Excel report downloaded: ${filename}`, 'success');

            submitBtn.disabled = false;
            submitBtn.textContent = 'Run Report';

        } catch (error) {
            console.error('Error:', error);
            showStatus(`Error: ${error.message}`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Run Report';
        }
    });

})();

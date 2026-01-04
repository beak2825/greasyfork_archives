// ==UserScript==
// @name         Neopets Trading Post - Get Your Boxes Outta Here
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Boxes We Don't Like
// @author       Fatalsymptoms
// @match        https://www.neopets.com/island/tradingpost.phtml*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558379/Neopets%20Trading%20Post%20-%20Get%20Your%20Boxes%20Outta%20Here.user.js
// @updateURL https://update.greasyfork.org/scripts/558379/Neopets%20Trading%20Post%20-%20Get%20Your%20Boxes%20Outta%20Here.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const STYLES = `
        .grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-3 {
            display: none !important;
        }

        .tp-custom-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
            max-width: 100%;
        }

        .tp-custom-row {
            display: flex;
            align-items: stretch;
            background: #63C46F;
            border: 24px solid transparent;
            border-image: url("https://images.neopets.com/tradingpost/assets/images/border-frame.png") 78 / 1 / 0.3 repeat;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            gap: 0;
            min-height: 80px;
            opacity: 0;
            animation: fadeInRow 0.3s ease forwards;
        }

        .tp-custom-row:nth-child(even) {
            background: #C4A1E0;
        }

        .tp-custom-row-inner {
            display: flex;
            align-items: stretch;
            background: #fff;
            border-radius: 4px;
            padding: 12px;
            gap: 12px;
            flex: 1;
            min-height: 72px;
            margin: -8px;
        }

        @keyframes fadeInRow {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .tp-custom-row:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            filter: brightness(1.05);
        }

        .tp-custom-lot-info {
            min-width: 140px;
            max-width: 140px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            border-right: 2px solid #E3DEDE;
            padding-right: 12px;
            overflow: visible;
        }

        .tp-custom-lot-id {
            font-weight: bold;
            color: #432005;
            font-size: 16px;
            font-family: 'Cafeteria', 'MuseoSans', sans-serif;
        }

        .tp-custom-lot-time {
            font-size: 11px;
            color: #888;
        }

        .tp-custom-lot-owner {
            font-size: 12px;
            color: #869EFF;
            text-decoration: none;
        }

        .tp-custom-lot-owner:hover {
            text-decoration: underline;
        }

        .tp-custom-icons-row {
            display: flex;
            gap: 8px;
            margin-top: 4px;
            overflow: visible;
        }

        .tp-custom-icon-btn {
            width: 24px;
            height: 24px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s, transform 0.2s;
            position: relative;
        }

        .tp-custom-icon-btn:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        .tp-copied-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            z-index: 1000;
        }

        .tp-copied-tooltip.show {
            opacity: 1;
        }

        .tp-copied-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: #333;
        }

        .tp-custom-items-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 8px;
            min-width: 200px;
            border-right: 2px solid #E3DEDE;
            padding-right: 12px;
        }

        .tp-custom-items {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: flex-start;
            align-content: flex-start;
        }

        .tp-custom-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            background: #f9f9f9;
            border-radius: 8px;
            font-size: 12px;
            border: 1px solid #E3DEDE;
            max-width: 200px;
        }

        .tp-custom-item img {
            width: 40px;
            height: 40px;
            min-width: 40px;
            object-fit: contain;
        }

        .tp-custom-item-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .tp-custom-item-name {
            color: #333;
            font-weight: 600;
            font-family: 'MuseoSans', sans-serif;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .tp-custom-item-rarity {
            color: #E86060;
            font-size: 10px;
            font-weight: bold;
        }

        .tp-custom-item-count {
            background: #e74c3c;
            color: white;
            font-size: 10px;
            font-weight: bold;
            padding: 1px 5px;
            border-radius: 10px;
            position: absolute;
            top: -4px;
            right: -4px;
        }

        .tp-custom-view-more {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            color: #E18C1D;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: underline;
            font-family: 'Cafeteria', 'MuseoSans', sans-serif;
            transition: color 0.2s;
            background: transparent;
            border: none;
        }

        .tp-custom-view-more:hover {
            color: #c97a18;
        }

        .tp-custom-view-details {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            color: #E18C1D;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: underline;
            font-family: 'Cafeteria', 'MuseoSans', sans-serif;
            transition: color 0.2s;
            background: transparent;
            border: none;
            margin-left: auto;
        }

        .tp-custom-view-details:hover {
            color: #c97a18;
            text-decoration: underline;
        }

        .tp-custom-view-details:active {
            color: #a56815;
            transform: scale(0.98);
        }

        .tp-custom-view-more:active {
            color: #a56815;
            transform: scale(0.98);
        }

        /* Custom Popup Styles */
        .tp-custom-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .tp-custom-popup {
            background: #63C46F;
            border: 24px solid transparent;
            border-image: url("https://images.neopets.com/tradingpost/assets/images/border-frame.png") 78 / 1 / 0.3 repeat;
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            animation: popupSlideIn 0.3s ease;
        }

        @keyframes popupSlideIn {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .tp-custom-popup-inner {
            background: #fff;
            border-radius: 10px;
            padding: 20px;
        }

        .tp-custom-popup-header {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            margin-bottom: 12px;
        }

        .tp-custom-popup-title {
            background: linear-gradient(180deg, #E8D4F8 0%, #D4B8E8 100%);
            border: 2px solid #C4A8D8;
            border-radius: 20px;
            padding: 8px 24px;
            font-family: 'Cafeteria', sans-serif;
            font-size: 20px;
            color: #432005;
            text-align: center;
        }

        .tp-custom-popup-close {
            position: absolute;
            right: 0;
            top: -5px;
            cursor: pointer;
            width: 40px;
            height: 30px;
            background: #e74c3c;
            border: 2px solid #c0392b;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            transition: background 0.2s;
        }

        .tp-custom-popup-close:hover {
            background: #c0392b;
        }

        .tp-custom-popup-time {
            text-align: center;
            color: #765E00;
            font-size: 14px;
            font-family: 'Cafeteria', sans-serif;
            margin-bottom: 12px;
        }

        .tp-custom-popup-owner {
            text-align: center;
            margin-bottom: 12px;
        }

        .tp-custom-popup-owner a {
            color: #869EFF;
            text-decoration: none;
            font-weight: bold;
        }

        .tp-custom-popup-owner a:hover {
            text-decoration: underline;
        }

        .tp-custom-popup-items {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 16px;
            padding: 16px;
            background: #f9f9f9;
            border-radius: 10px;
            margin-bottom: 16px;
        }

        .tp-custom-popup-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 4px;
        }

        .tp-custom-popup-item-img-container {
            position: relative;
        }

        .tp-custom-popup-item img {
            width: 64px;
            height: 64px;
            object-fit: contain;
        }

        .tp-custom-popup-item-count {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #e74c3c;
            color: white;
            font-size: 11px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 10px;
        }

        .tp-custom-popup-item-name {
            font-size: 12px;
            color: #333;
            word-wrap: break-word;
            max-width: 100px;
        }

        .tp-custom-popup-item-rarity {
            font-size: 11px;
            color: #E86060;
            font-weight: bold;
        }

        .tp-custom-popup-section {
            border-top: 2px solid #E3DEDE;
            padding: 12px 0;
        }

        .tp-custom-popup-section-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 4px;
        }

        .tp-custom-popup-wishlist {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            word-wrap: break-word;
        }

        .tp-custom-popup-instant-buy {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #FFEBC6;
            padding: 10px 14px;
            border-radius: 8px;
        }

        .tp-custom-popup-instant-buy-price {
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: bold;
            font-size: 16px;
        }

        .tp-custom-popup-instant-buy-price img {
            width: 28px;
            height: 28px;
        }

        .tp-custom-popup-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 16px;
            flex-wrap: wrap;
        }

        .tp-custom-popup-btn {
            padding: 10px 24px;
            border-radius: 8px;
            font-family: 'Cafeteria', sans-serif;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            border: 2px solid;
            transition: all 0.2s;
        }

        .tp-custom-popup-btn-offer {
            background: #63C46F;
            border-color: #4CAF50;
            color: white;
        }

        .tp-custom-popup-btn-offer:hover {
            background: #4CAF50;
        }

        .tp-custom-popup-btn-buy {
            background: #FFD700;
            border-color: #DAA520;
            color: #333;
        }

        .tp-custom-popup-btn-buy:hover {
            background: #DAA520;
        }

        .tp-custom-popup-btn-cancel {
            background: #e74c3c;
            border-color: #c0392b;
            color: white;
        }

        .tp-custom-popup-btn-cancel:hover {
            background: #c0392b;
        }

        .tp-custom-popup-btn-view {
            background: #3498db;
            border-color: #2980b9;
            color: white;
        }

        .tp-custom-popup-btn-view:hover {
            background: #2980b9;
        }

        .tp-custom-popup-icons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 12px;
        }

        .tp-custom-popup-icon {
            width: 28px;
            height: 28px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s, transform 0.2s;
        }

        .tp-custom-popup-icon:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        .tp-report-link {
            display: inline-block;
            text-decoration: none;
        }

        .tp-reload-btn {
            transition: transform 0.2s, filter 0.2s;
        }

        .tp-reload-btn:hover {
            filter: brightness(1.1);
            transform: scale(1.02);
        }

        .tp-reload-btn:active {
            transform: scale(0.98);
        }

        .tp-custom-wishlist-row {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding-top: 8px;
            border-top: 1px solid #E3DEDE;
        }

        .tp-custom-wishlist-header {
            font-size: 12px;
            font-weight: bold;
            color: #432005;
            font-family: 'Cafeteria', 'MuseoSans', sans-serif;
            white-space: nowrap;
        }

        .tp-custom-wishlist-text {
            font-size: 12px;
            color: #333;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        .tp-custom-wishlist-empty {
            font-size: 12px;
            color: #999;
            font-style: italic;
        }

        .tp-custom-right-section {
            min-width: 160px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
            justify-content: center;
        }

        .tp-custom-instant-buy {
            background: #FFEBC6;
            padding: 8px 12px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-weight: bold;
            font-size: 12px;
            width: 100%;
            box-sizing: border-box;
        }

        .tp-custom-instant-buy img {
            width: 20px;
            height: 20px;
        }

        .tp-custom-offers {
            font-size: 11px;
            color: #666;
        }

        .tp-custom-buttons {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
        }

        .tp-custom-btn {
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            transition: opacity 0.2s;
            width: 100%;
        }

        .tp-custom-btn:hover { opacity: 0.85; }
        .tp-custom-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .tp-custom-btn-offer { background: #4A90D9; color: white; }
        .tp-custom-btn-buy { background: #FFD700; border: 2px solid #DAA520; color: #333; }
        .tp-custom-btn-buy:hover { background: #DAA520; opacity: 1; }
        .tp-custom-btn-view { background: #F39C12; color: white; }
        .tp-custom-btn-cancel { background: #E74C3C; color: white; }

        .tp-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .tp-modal {
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .tp-modal-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 16px;
            text-align: center;
        }

        .tp-modal-body {
            margin-bottom: 20px;
            text-align: center;
            font-size: 14px;
        }

        .tp-modal-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }

        .tp-modal-btn {
            padding: 10px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
        }

        .tp-modal-btn-confirm { background: #2ECC71; color: white; }
        .tp-modal-btn-cancel { background: #95a5a6; color: white; }
        .tp-modal-btn-ok { background: #3498db; color: white; }

        .tp-modal-items {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            margin: 16px 0;
            padding: 12px;
            background: #f8f8f8;
            border-radius: 8px;
        }

        .tp-modal-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 11px;
            max-width: 80px;
            text-align: center;
        }

        .tp-modal-item img {
            width: 80px;
            height: 80px;
        }
    `;

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = STYLES;
        (document.head || document.documentElement).appendChild(style);
    }
    injectStyles();

    const processedLots = new Set();
    const originalLotElements = new Map(); // Store original lot elements by ID for clicking
    let customListContainer = null;
    let lastUrl = location.href;

    function formatNumber(num) {
        if (num == null) return '0';
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function parsePrice(priceStr) {
        if (!priceStr) return 0;
        return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
    }

    function fixImageUrl(src) {
        if (!src) return '';
        if (src.startsWith('http')) return src;
        if (src.startsWith('//')) return 'https:' + src;
        return 'https://images.neopets.com' + src;
    }

    function getCK() {
        if (typeof window.getCK === 'function') {
            try {
                const ck = window.getCK();
                if (ck) return ck;
            } catch (e) {}
        }

        if (window._ref_ck) return window._ref_ck;

        try {
            const appEl = document.getElementById('app');
            if (appEl?.__vue_app__) {
                const props = appEl.__vue_app__.config?.globalProperties;
                if (props?.$ck) return props.$ck;
                if (props?._ref_ck) return props._ref_ck;
            }
        } catch (e) {}

        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            const patterns = [
                /_ref_ck['":\s]+['"]([a-f0-9]{32})['"]/i,
                /ck['":\s]+['"]([a-f0-9]{32})['"]/i
            ];
            for (const pattern of patterns) {
                const match = script.textContent.match(pattern);
                if (match) return match[1];
            }
        }

        const inputs = document.querySelectorAll('input[name="_ref_ck"], input[name="ck"]');
        for (const input of inputs) {
            if (input.value) return input.value;
        }

        return null;
    }

    function showModal(options) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'tp-modal-overlay';

            let buttonsHtml = options.type === 'confirm'
                ? `<button class="tp-modal-btn tp-modal-btn-cancel">Cancel</button>
                   <button class="tp-modal-btn tp-modal-btn-confirm">Confirm</button>`
                : `<button class="tp-modal-btn tp-modal-btn-ok">OK</button>`;

            overlay.innerHTML = `
                <div class="tp-modal">
                    <div class="tp-modal-title">${options.title || ''}</div>
                    <div class="tp-modal-body">${options.body || ''}</div>
                    <div class="tp-modal-buttons">${buttonsHtml}</div>
                </div>
            `;

            document.body.appendChild(overlay);

            const closeModal = (result) => { overlay.remove(); resolve(result); };

            overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(false); });
            overlay.querySelector('.tp-modal-btn-cancel')?.addEventListener('click', () => closeModal(false));
            overlay.querySelector('.tp-modal-btn-confirm')?.addEventListener('click', () => closeModal(true));
            overlay.querySelector('.tp-modal-btn-ok')?.addEventListener('click', () => closeModal(true));
        });
    }

    function updateNP(np) {
        if (np == null) return;
        const npAnchor = document.getElementById('npanchor');
        if (npAnchor) {
            npAnchor.textContent = formatNumber(np);
        }
    }

    function removeLotRow(lotId) {
        const row = document.querySelector(`.tp-custom-row[data-lot-id="${lotId}"]`);
        if (row) {
            row.style.transition = 'opacity 0.3s, transform 0.3s';
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            setTimeout(() => row.remove(), 300);
        }
    }

    async function doInstantBuy(lotId, price, items) {
        const priceNum = parsePrice(price);
        const ck = getCK();

        if (!ck) {
            await showModal({
                type: 'alert',
                title: 'Error',
                body: '<p>Could not find security token. Please refresh the page.</p>'
            });
            return;
        }

        const itemsHtml = items.map(item => `
            <div class="tp-modal-item">
                <img src="${item.image || ''}" alt="${item.name || ''}">
                <span>${item.name || 'Item'}</span>
            </div>
        `).join('');

        const confirmed = await showModal({
            type: 'confirm',
            title: 'Confirm Instant Buy',
            body: `<p>Purchase Lot ${lotId} for <strong>${formatNumber(priceNum)} NP</strong>?</p>
                   <div class="tp-modal-items">${itemsHtml}</div>`
        });

        if (!confirmed) return;

        try {
            const response = await fetch('/np-templates/ajax/island/tradingpost/process-tradingpost.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    type: 'instant_buy',
                    lot_id: parseInt(lotId),
                    _ref_ck: ck
                })
            });

            const result = await response.json();

            if (result.success) {
                if (result.data?.remaining_np != null) {
                    updateNP(result.data.remaining_np);
                }

                const receivedItems = (result.data?.items?.length > 0) ? result.data.items : items;
                const receivedHtml = receivedItems.map(item => {
                    const imgSrc = fixImageUrl(item.image || item.img_url);
                    return `
                        <div class="tp-modal-item">
                            <img src="${imgSrc}" alt="${item.name || ''}">
                            <span>${item.name || 'Item'}</span>
                        </div>
                    `;
                }).join('');

                await showModal({
                    type: 'alert',
                    title: 'Lot Purchased!',
                    body: `<p>You've successfully purchased lot ${lotId}!</p>
                           <div class="tp-modal-items">${receivedHtml}</div>
                           <p>All items have been placed in your <a href="/inventory.phtml" style="color:#869EFF;">inventory</a>.</p>`
                });

                removeLotRow(lotId);
            } else {
                await showModal({
                    type: 'alert',
                    title: 'Purchase Failed',
                    body: `<p>${result.error || result.message || 'Unknown error'}</p>`
                });
            }
        } catch (error) {
            console.error('[TP Layout] Error:', error);
            await showModal({
                type: 'alert',
                title: 'Note',
                body: `<p>Request completed. Please check your <a href="/inventory.phtml" style="color:#869EFF;">inventory</a> to confirm the purchase.</p>`
            });
            removeLotRow(lotId);
        }
    }

    async function doCancelLot(lotId) {
        const ck = getCK();

        if (!ck) {
            await showModal({
                type: 'alert',
                title: 'Error',
                body: '<p>Could not find security token. Please refresh the page.</p>'
            });
            return;
        }

        const confirmed = await showModal({
            type: 'confirm',
            title: 'Cancel Lot',
            body: `<p>Cancel Lot ${lotId}?</p><p><strong>Warning:</strong> 25,000 NP fee will be charged.</p>`
        });

        if (!confirmed) return;

        try {
            const response = await fetch('/np-templates/ajax/island/tradingpost/process-tradingpost.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    type: 'cancel_lot',
                    lot_id: parseInt(lotId),
                    _ref_ck: ck
                })
            });

            const result = await response.json();

            if (result.success) {
                if (result.data?.remaining_np != null) {
                    updateNP(result.data.remaining_np);
                }

                await showModal({
                    type: 'alert',
                    title: 'Lot Cancelled',
                    body: `<p>Lot ${lotId} has been cancelled.</p><p>Items returned to your inventory.</p>`
                });

                removeLotRow(lotId);
            } else {
                await showModal({
                    type: 'alert',
                    title: 'Error',
                    body: `<p>${result.error || result.message || 'Unknown error'}</p>`
                });
            }
        } catch (error) {
            console.error('[TP Layout] Error:', error);
            await showModal({
                type: 'alert',
                title: 'Note',
                body: `<p>Request completed. Please check your <a href="/inventory.phtml" style="color:#869EFF;">inventory</a> to see if the lot was cancelled.</p>`
            });
        }
    }

    function extractItemsFromVueComponent(lotId) {
        // Find the original lot element and extract Vue component data
        const origLot = originalLotElements.get(lotId);
        if (!origLot) {
            console.log('[TP Layout] No original lot element found');
            return null;
        }

        // Try to get Vue component data
        const vueComponent = origLot.__vueParentComponent;
        if (vueComponent && vueComponent.ctx) {
            const ctx = vueComponent.ctx;

            // The lot data is in ctx.lot
            if (ctx.lot) {
                console.log('[TP Layout] Found lot data in Vue ctx.lot');
                const lot = ctx.lot;

                // Map items to our format
                const items = (lot.items || []).map(item => ({
                    name: item.name || 'Unknown Item',
                    image: fixImageUrl(item.img_url),
                    rarity: item.sub_name || '',
                    count: item.amount || 1,
                    description: item.description || ''
                }));

                return {
                    items: items,
                    wishlist: lot.wishlist || '',
                    instantBuyPrice: lot.instant_buy_amount ? formatNumber(lot.instant_buy_amount) : null,
                    owner: lot.owner || '',
                    isPremium: lot.premium_owner || false,
                    offerCount: lot.offer_count || 0
                };
            }

            // Also check lotDetails
            if (ctx.lotDetails && ctx.lotDetails.items) {
                console.log('[TP Layout] Found lot data in Vue ctx.lotDetails');
                const lot = ctx.lotDetails;

                const items = (lot.items || []).map(item => ({
                    name: item.name || 'Unknown Item',
                    image: fixImageUrl(item.img_url),
                    rarity: item.sub_name || '',
                    count: item.amount || 1,
                    description: item.description || ''
                }));

                return {
                    items: items,
                    wishlist: lot.wishlist || '',
                    instantBuyPrice: lot.instant_buy_amount ? formatNumber(lot.instant_buy_amount) : null,
                    owner: lot.owner || '',
                    isPremium: lot.premium_owner || false,
                    offerCount: lot.offer_count || 0
                };
            }
        }

        return null;
    }

    async function fetchLotData(lotId) {
        // Method 1: Try to extract from Vue component - this has ALL the data
        const vueData = extractItemsFromVueComponent(lotId);
        if (vueData && vueData.items && vueData.items.length > 0) {
            console.log('[TP Layout] Got full data from Vue component:', vueData.items.length, 'items');
            return vueData;
        }

        console.log('[TP Layout] Vue extraction failed, no fallback available');
        return null;
    }

    async function showLotPopup(data) {
        const isBrowseView = location.hash.includes('type=browse') || location.search.includes('type=browse');

        // Try to fetch full lot data from Vue component
        const fullLotData = await fetchLotData(data.lotId);

        // Use fetched items if available, otherwise fall back to extracted data
        let items = data.items;
        let wishlist = data.wishlist;
        let instantBuyPrice = data.instantBuyPrice;

        if (fullLotData) {
            // Data is already formatted correctly from extractItemsFromVueComponent
            if (fullLotData.items && fullLotData.items.length > 0) {
                items = fullLotData.items;
            }
            if (fullLotData.wishlist) {
                wishlist = fullLotData.wishlist;
            }
            if (fullLotData.instantBuyPrice) {
                instantBuyPrice = fullLotData.instantBuyPrice;
            }
        }

        // Build items HTML
        const itemsHtml = items.map(item => `
            <div class="tp-custom-popup-item">
                <div class="tp-custom-popup-item-img-container">
                    <img src="${item.image}" alt="${item.name}">
                    ${item.count > 1 ? `<span class="tp-custom-popup-item-count">${item.count}</span>` : ''}
                </div>
                <span class="tp-custom-popup-item-name">${item.name}</span>
                ${item.rarity ? `<span class="tp-custom-popup-item-rarity">${item.rarity}</span>` : ''}
            </div>
        `).join('');

        // Build wishlist section
        const wishlistHtml = wishlist
            ? `<div class="tp-custom-popup-section">
                   <div class="tp-custom-popup-section-label">Wishlist:</div>
                   <div class="tp-custom-popup-wishlist">${wishlist}</div>
               </div>`
            : '';

        // Build instant buy section
        const instantBuyHtml = instantBuyPrice
            ? `<div class="tp-custom-popup-section">
                   <div class="tp-custom-popup-instant-buy">
                       <span>Instant Buy</span>
                       <div class="tp-custom-popup-instant-buy-price">
                           <img src="https://images.neopets.com/tradingpost/assets/images/np-icon.png" alt="NP">
                           <span>${instantBuyPrice} NP</span>
                       </div>
                   </div>
               </div>`
            : '';

        // Build buttons based on view
        let buttonsHtml = '';
        if (isBrowseView) {
            buttonsHtml = `
                <button class="tp-custom-popup-btn tp-custom-popup-btn-offer" data-action="offer">Make an Offer</button>
                ${instantBuyPrice ? `<button class="tp-custom-popup-btn tp-custom-popup-btn-buy" data-action="buy">Instant Buy</button>` : ''}
            `;
        } else {
            buttonsHtml = `
                ${data.offersCount > 0 ? `<button class="tp-custom-popup-btn tp-custom-popup-btn-view" data-action="view-offers">View Offers (${data.offersCount})</button>` : ''}
                <button class="tp-custom-popup-btn tp-custom-popup-btn-cancel" data-action="cancel">Cancel Lot</button>
            `;
        }

        // Build owner section
        const ownerHtml = data.owner
            ? `<div class="tp-custom-popup-owner">by <a href="${data.ownerLink}">${data.owner}</a></div>`
            : '';

        // Create popup HTML
        const popupHtml = `
            <div class="tp-custom-popup-overlay">
                <div class="tp-custom-popup">
                    <div class="tp-custom-popup-inner">
                        <div class="tp-custom-popup-header">
                            <div class="tp-custom-popup-title">Lot ${data.lotId}</div>
                            <div class="tp-custom-popup-close">&times;</div>
                        </div>
                        <div class="tp-custom-popup-time">${data.time}</div>
                        ${ownerHtml}
                        <div class="tp-custom-popup-items">${itemsHtml}</div>
                        ${wishlistHtml}
                        ${instantBuyHtml}
                        <div class="tp-custom-popup-buttons">${buttonsHtml}</div>
                        <div class="tp-custom-popup-icons">
                            <div class="tp-icon-wrapper" style="position: relative; display: inline-block;">
                                <img src="https://images.neopets.com/tradingpost/assets/images/link-icon.png"
                                     class="tp-custom-popup-icon" data-action="copy-link" title="Copy lot link">
                                <span class="tp-copied-tooltip">Copied!</span>
                            </div>
                            ${isBrowseView ? `<img src="https://images.neopets.com/tradingpost/assets/images/report-icon.png"
                                 class="tp-custom-popup-icon" data-action="report" title="Report ${data.owner}">` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add popup to page
        const popupContainer = document.createElement('div');
        popupContainer.innerHTML = popupHtml;
        const overlay = popupContainer.firstElementChild;
        document.body.appendChild(overlay);

        // Close popup function
        const closePopup = () => {
            overlay.remove();
        };

        // Handle close button
        overlay.querySelector('.tp-custom-popup-close').addEventListener('click', closePopup);

        // Handle clicking outside popup
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup();
        });

        // Handle escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Handle button clicks - use fetched items data
        overlay.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const action = btn.dataset.action;

                switch (action) {
                    case 'offer':
                        closePopup();
                        window.location.href = `/island/tradingpost.phtml?type=makeoffer&lot_id=${data.lotId}`;
                        break;
                    case 'buy':
                        closePopup();
                        doInstantBuy(data.lotId, instantBuyPrice, items);
                        break;
                    case 'view-offers':
                        closePopup();
                        window.location.href = `/island/tradingpost.phtml?type=offers-lot&lot_id=${data.lotId}`;
                        break;
                    case 'cancel':
                        closePopup();
                        doCancelLot(data.lotId);
                        break;
                    case 'copy-link':
                        const lotUrl = `https://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=id&search_string=${data.lotId}`;
                        try {
                            await navigator.clipboard.writeText(lotUrl);
                            // Show "Copied!" tooltip
                            const tooltip = btn.parentElement.querySelector('.tp-copied-tooltip');
                            if (tooltip) {
                                tooltip.classList.add('show');
                                setTimeout(() => tooltip.classList.remove('show'), 1500);
                            }
                        } catch {
                            prompt('Copy this URL:', lotUrl);
                        }
                        break;
                    case 'report':
                        closePopup();
                        window.location.href = `/island/tradingpost.phtml?type=report&lot_id=${data.lotId}&owner=${encodeURIComponent(data.owner)}`;
                        break;
                }
            });
        });
    }

    function extractLotData(lotEl) {
        const data = {
            lotId: '',
            time: '',
            owner: '',
            ownerLink: '',
            items: [],
            wishlist: '',
            instantBuyPrice: null,
            offersCount: 0,
            totalItems: 0,
            hasLinkIcon: false,
            hasBinIcon: false,
            hasReportIcon: false
        };

        // Extract lot ID from text-cafeteria class
        const lotIdEl = lotEl.querySelector('.text-cafeteria');
        if (lotIdEl) {
            const match = lotIdEl.textContent.match(/Lot\s*(\d+)/i);
            if (match) data.lotId = match[1];
        }

        // Extract time - look for "Posted" text
        const allTextEls = lotEl.querySelectorAll('.text-cafeteria');
        allTextEls.forEach(el => {
            if (el.textContent.includes('Posted')) {
                data.time = el.textContent.trim();
            }
        });

        // Extract owner
        const ownerLink = lotEl.querySelector('a[href*="userlookup.phtml"]');
        if (ownerLink) {
            const ownerSpan = ownerLink.querySelector('span');
            data.owner = ownerSpan ? ownerSpan.textContent.trim() : ownerLink.textContent.trim();
            data.ownerLink = ownerLink.href;
        }

        // Extract items - look for containers with item images
        // Items are in .flex.gap-4 containers with py-1 class
        const itemContainers = lotEl.querySelectorAll('.flex.gap-4.py-1, .flex.gap-4.px-3.py-1, [class*="flex"][class*="gap-4"][class*="py-1"]');
        itemContainers.forEach(container => {
            // Make sure this container has an item image (not just any flex container)
            const img = container.querySelector('img[src*="/items/"]');
            if (img) {
                // Get item name from .text-museo-bold or .item-name-text
                const nameEl = container.querySelector('.text-museo-bold, .item-name-text, p.text-museo-bold');

                // Get rarity - it's in format [Special - r101] or [Retired - r180]
                let rarity = '';
                const rarityEl = container.querySelector('.text-\\[\\#E86060\\], [class*="E86060"]');
                if (rarityEl && rarityEl.textContent.trim()) {
                    // Parse the rarity text like "[Special - r101]" or "[Retired - r180]"
                    const rarityText = rarityEl.textContent.trim();
                    // Extract the full bracket content or just the rarity number
                    const bracketMatch = rarityText.match(/\[([^\]]+)\]/);
                    if (bracketMatch) {
                        rarity = bracketMatch[1]; // "Special - r101" or "Retired - r180"
                    } else {
                        // Fallback: look for r### pattern
                        const rMatch = rarityText.match(/r\d+/i);
                        if (rMatch) rarity = rMatch[0];
                    }
                }

                // Check for item count badge
                const countEl = container.querySelector('.item-count, .item-count-big');

                data.items.push({
                    name: nameEl ? nameEl.textContent.trim() : 'Unknown Item',
                    image: fixImageUrl(img.src),
                    rarity: rarity,
                    count: countEl ? parseInt(countEl.textContent) || 1 : 1
                });
            }
        });

        // Get total item count from Vue component
        const vueComponent = lotEl.__vueParentComponent;
        if (vueComponent && vueComponent.ctx && vueComponent.ctx.lot && vueComponent.ctx.lot.items) {
            data.totalItems = vueComponent.ctx.lot.items.length;
        } else {
            // Fallback: check for "and more..." text or use extracted items count
            const allParagraphs = lotEl.querySelectorAll('p');
            let hasMore = false;
            allParagraphs.forEach(p => {
                if (p.textContent.toLowerCase().includes('and more')) {
                    hasMore = true;
                }
            });
            data.totalItems = hasMore ? data.items.length + 1 : data.items.length; // +1 if there's more
        }

        // Extract wishlist
        const wishlistEl = lotEl.querySelector('.wishlist-text');
        if (wishlistEl) {
            const wishlistText = wishlistEl.textContent.trim();
            data.wishlist = (wishlistText.toLowerCase() === 'none') ? '' : wishlistText;
        }

        // Extract instant buy price
        const instantBuyEl = lotEl.querySelector('.bg-\\[\\#FFEBC6\\]');
        if (instantBuyEl) {
            const priceMatch = instantBuyEl.textContent.match(/([\d,]+)\s*NP/);
            if (priceMatch) data.instantBuyPrice = priceMatch[1];
        }

        // Extract offers count
        const offersMatch = lotEl.textContent.match(/(\d+)\s*offer/i);
        if (offersMatch) data.offersCount = parseInt(offersMatch[1]);

        // Check for icons
        data.hasLinkIcon = !!lotEl.querySelector('img[src*="link-icon"]');
        data.hasBinIcon = !!lotEl.querySelector('img[src*="bin-icon"]');
        data.hasReportIcon = !!lotEl.querySelector('img[src*="report-icon"]');

        return data;
    }

    function createCustomRow(data, originalLotEl) {
        const row = document.createElement('div');
        row.className = 'tp-custom-row';
        row.dataset.lotId = data.lotId;

        const isBrowseView = location.hash.includes('type=browse') || location.search.includes('type=browse');
        const isYourTrades = !isBrowseView;

        let iconsHtml = `<div class="tp-icon-wrapper" style="position: relative; display: inline-block;">
                            <img src="https://images.neopets.com/tradingpost/assets/images/link-icon.png"
                              class="tp-custom-icon-btn tp-link-icon" title="Copy lot link" alt="Link">
                            <span class="tp-copied-tooltip">Copied!</span>
                         </div>`;

        if (isYourTrades && data.hasBinIcon) {
            iconsHtml += `<img src="https://images.neopets.com/tradingpost/assets/images/bin-icon.png"
                              class="tp-custom-icon-btn tp-bin-icon" title="Cancel lot" alt="Delete">`;
        } else if (isBrowseView) {
            iconsHtml += `<a href="/island/tradingpost.phtml?type=report&amp;lot_id=${data.lotId}&amp;owner=${encodeURIComponent(data.owner)}" class="tp-report-link">
                            <img src="https://images.neopets.com/tradingpost/assets/images/report-icon.png"
                              class="tp-custom-icon-btn tp-report-icon" title="Report ${data.owner}" alt="Report">
                         </a>`;
        }

        // Build items HTML
        let itemsHtml = data.items.map(item => `
            <div class="tp-custom-item">
                <div style="position: relative;">
                    <img src="${item.image}" alt="${item.name}">
                    ${item.count > 1 ? `<span class="tp-custom-item-count">${item.count}</span>` : ''}
                </div>
                <div class="tp-custom-item-info">
                    <span class="tp-custom-item-name" title="${item.name}">${item.name}</span>
                    ${item.rarity ? `<span class="tp-custom-item-rarity">${item.rarity}</span>` : ''}
                </div>
            </div>
        `).join('');

        // Add "and more..." if there are more than 4 items total
        if (data.totalItems > 4) {
            const extraCount = data.totalItems - data.items.length;
            itemsHtml += `
                <span class="tp-custom-view-more tp-view-details-btn" title="View all ${data.totalItems} items">
                    and ${extraCount} more...
                </span>
            `;
        }

        // Always add View Details link
        itemsHtml += `
            <span class="tp-custom-view-details tp-view-details-btn" title="View lot details">
                View Details
            </span>
        `;

        const wishlistHtml = data.wishlist
            ? `<span class="tp-custom-wishlist-text">${data.wishlist}</span>`
            : `<span class="tp-custom-wishlist-empty">No wishlist</span>`;

        let rightHtml = '';

        if (data.instantBuyPrice) {
            rightHtml += `
                <div class="tp-custom-instant-buy">
                    <img src="https://images.neopets.com/tradingpost/assets/images/np-icon.png" alt="NP">
                    <span>${data.instantBuyPrice} NP</span>
                </div>
            `;
        }

        if (data.offersCount > 0) {
            rightHtml += `<span class="tp-custom-offers">${data.offersCount} offer${data.offersCount > 1 ? 's' : ''}</span>`;
        }

        rightHtml += '<div class="tp-custom-buttons">';

        if (isBrowseView) {
            rightHtml += `<button class="tp-custom-btn tp-custom-btn-offer tp-make-offer-btn">Make Offer</button>`;
            if (data.instantBuyPrice) {
                rightHtml += `<button class="tp-custom-btn tp-custom-btn-buy tp-instant-buy-btn">Instant Buy</button>`;
            }
        } else {
            if (data.offersCount > 0) {
                rightHtml += `<button class="tp-custom-btn tp-custom-btn-view tp-view-offers-btn">View Offers (${data.offersCount})</button>`;
            }
            rightHtml += `<button class="tp-custom-btn tp-custom-btn-cancel tp-cancel-btn">Cancel Lot</button>`;
        }

        rightHtml += '</div>';

        row.innerHTML = `
            <div class="tp-custom-row-inner">
                <div class="tp-custom-lot-info">
                    <span class="tp-custom-lot-id">Lot ${data.lotId}</span>
                    <span class="tp-custom-lot-time">${data.time}</span>
                    ${data.owner ? `<a href="${data.ownerLink}" class="tp-custom-lot-owner">${data.owner}</a>` : ''}
                    <div class="tp-custom-icons-row">${iconsHtml}</div>
                </div>
                <div class="tp-custom-items-section">
                    <div class="tp-custom-items">${itemsHtml}</div>
                    <div class="tp-custom-wishlist-row">
                        <span class="tp-custom-wishlist-header">📝 Wishlist:</span>
                        ${wishlistHtml}
                    </div>
                </div>
                <div class="tp-custom-right-section">${rightHtml}</div>
            </div>
        `;

        attachEventHandlers(row, data, originalLotEl);
        return row;
    }

    function attachEventHandlers(row, data, originalLotEl) {
        const linkIcon = row.querySelector('.tp-link-icon');
        if (linkIcon) {
            linkIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                const lotUrl = `https://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=id&search_string=${data.lotId}`;
                const tooltip = linkIcon.parentElement.querySelector('.tp-copied-tooltip');
                navigator.clipboard.writeText(lotUrl).then(() => {
                    if (tooltip) {
                        tooltip.classList.add('show');
                        setTimeout(() => tooltip.classList.remove('show'), 1500);
                    }
                }).catch(() => prompt('Copy:', lotUrl));
            });
        }

        row.querySelector('.tp-bin-icon')?.addEventListener('click', (e) => {
            e.stopPropagation();
            doCancelLot(data.lotId);
        });

        // Report link is now an <a> tag, no handler needed

        row.querySelector('.tp-make-offer-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `/island/tradingpost.phtml?type=makeoffer&lot_id=${data.lotId}`;
        });

        row.querySelector('.tp-instant-buy-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            doInstantBuy(data.lotId, data.instantBuyPrice, data.items);
        });

        row.querySelector('.tp-view-offers-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = `/island/tradingpost.phtml?type=offers-lot&lot_id=${data.lotId}`;
        });

        row.querySelector('.tp-cancel-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            doCancelLot(data.lotId);
        });

        // View Details links - show our custom popup
        row.querySelectorAll('.tp-view-details-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                await showLotPopup(data);
            });
        });
    }

    function isLotReady(lotEl) {
        const hasId = lotEl.querySelector('.text-cafeteria')?.textContent.includes('Lot');
        const hasImages = lotEl.querySelectorAll('img[src*="/items/"]').length > 0;
        return hasId && hasImages;
    }

    function processLot(lotEl, originalGrid) {
        const lotIdEl = lotEl.querySelector('.text-cafeteria');
        if (!lotIdEl) return;

        const match = lotIdEl.textContent.match(/Lot\s*(\d+)/i);
        if (!match) return;

        const lotId = match[1];
        if (processedLots.has(lotId)) return;
        if (!isLotReady(lotEl)) return;

        processedLots.add(lotId);
        originalLotElements.set(lotId, lotEl); // Store reference to original element

        const data = extractLotData(lotEl);
        if (!data.lotId || data.items.length === 0) return;

        if (!customListContainer) {
            customListContainer = document.createElement('div');
            customListContainer.className = 'tp-custom-list';
            originalGrid.parentNode.insertBefore(customListContainer, originalGrid);
        }

        const row = createCustomRow(data, lotEl);
        customListContainer.appendChild(row);
    }

    function processAllLots() {
        const grid = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.xl\\:grid-cols-3');
        if (!grid) return;
        grid.querySelectorAll(':scope > div').forEach(lot => processLot(lot, grid));
    }

    function resetState() {
        processedLots.clear();
        originalLotElements.clear();
        if (customListContainer) { customListContainer.remove(); customListContainer = null; }
    }

    function addReloadButton() {
        // Check if button already exists
        if (document.querySelector('.tp-reload-btn')) return;

        // Find the menu container
        const menuContainer = document.querySelector('#horizontal-menu-container .flex.justify-start');
        if (!menuContainer) return;

        // Find the "Offers You Have Made" button (the third desktop button)
        const desktopButtons = menuContainer.querySelectorAll('button.hidden.xl\\:block, button:not(.selected-tab-btn):not([class*="hidden"])');

        // Create reload button
        const reloadBtn = document.createElement('button');
        reloadBtn.className = 'tp-reload-btn relative w-fit cursor-pointer z-20 h-full unselected-tab-btn hidden xl:block';
        reloadBtn.type = 'button';
        reloadBtn.innerHTML = `
            <div class="item-label">
                <p class="text-[12px] sm:text-[18px] leading-[1.2rem] whitespace-normal break-words overflow-hidden">Refresh</p>
            </div>
        `;
        reloadBtn.addEventListener('click', () => {
            location.reload();
        });

        // Find where to insert - after the "Offers You Have Made" button
        // Look for the flex-col ml-auto div (inventory section)
        const inventorySection = menuContainer.querySelector('.flex-col.ml-auto');
        if (inventorySection) {
            menuContainer.insertBefore(reloadBtn, inventorySection);
        } else {
            // Fallback: append to menu
            menuContainer.appendChild(reloadBtn);
        }
    }

    function startObserving() {
        const observer = new MutationObserver((mutations) => {
            if (location.href !== lastUrl) { lastUrl = location.href; resetState(); }
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.querySelector?.('.text-cafeteria')) {
                        setTimeout(processAllLots, 100);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        let checks = 0;
        const interval = setInterval(() => {
            processAllLots();
            addReloadButton();
            if (++checks > 20) clearInterval(interval);
        }, 250);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }

    console.log('[TP Layout] Horizontal layout script v1.3 loaded');
})();
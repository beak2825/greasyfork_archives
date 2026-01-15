// ==UserScript==
// @name         Solidgate Subscription Pause Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Calculates pause interval, offers a 3-column date selection grid, and auto-copies on selection.
// @author       You
// @match        https://hub.solidgate.com/billing/subscription/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562532/Solidgate%20Subscription%20Pause%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/562532/Solidgate%20Subscription%20Pause%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTORS = {
        startsLabel: "Starts (UTC)",
        endsLabel: "Ends (UTC)",
        immediateLabel: "Pause immediately",
        panelId: "sg-pause-helper-panel"
    };

    // --- DATE UTILS ---

    function parseDate(dateStr) {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? null : d;
    }

    // Smart month addition (Jan 31 + 1 Mo = Feb 28)
    function addMonths(date, months) {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        if (d.getDate() !== date.getDate()) {
            d.setDate(0);
        }
        return d;
    }

    function formatUIDate(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${months[date.getMonth()]} ${day}, ${year}`;
    }

    // --- INPUT SIMULATION ---

    function setReactInputValue(input, value) {
        if (!input) return;
        input.focus();
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', keyCode: 13 }));
        setTimeout(() => input.blur(), 50);
    }

    // --- DOM HELPERS ---

    function findInputByText(text) {
        const xpath = `//*[contains(text(), '${text}')]`;
        const iterator = document.evaluate(xpath, document.body, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
        let node = iterator.iterateNext();
        while (node) {
            if (node.offsetParent !== null) {
                let input = node.querySelector('input');
                if (input) return input;
                let parent = node.parentElement;
                let attempts = 0;
                while (parent && attempts < 4) {
                    input = parent.querySelector('input');
                    if (input) return input;
                    parent = parent.parentElement;
                    attempts++;
                }
            }
            node = iterator.iterateNext();
        }
        return null;
    }

    function isImmediateMode() {
        const xpath = `//*[contains(text(), '${SELECTORS.immediateLabel}')]`;
        const labelResult = document.evaluate(xpath, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const label = labelResult.singleNodeValue;
        if (label) {
            const radioWrapper = label.closest('.ant-radio-wrapper');
            if (radioWrapper && radioWrapper.classList.contains('ant-radio-wrapper-checked')) return true;
            const radioInput = label.querySelector('input[type="radio"]') || label.closest('label')?.querySelector('input[type="radio"]');
            if (radioInput && radioInput.checked) return true;
        }
        return false;
    }

    // --- RENDER UI ---

    function updateUI() {
        const startInput = findInputByText(SELECTORS.startsLabel);
        const endInput = findInputByText(SELECTORS.endsLabel);

        if (!endInput) {
            const existing = document.getElementById(SELECTORS.panelId);
            if (existing) existing.remove();
            return;
        }

        // Create Panel if missing
        let panel = document.getElementById(SELECTORS.panelId);
        if (!panel) {
            panel = document.createElement('div');
            panel.id = SELECTORS.panelId;
            panel.style.cssText = `
                width: 100%;
                box-sizing: border-box;
                margin-top: 15px;
                padding: 12px;
                background-color: #f4f5f7;
                border: 1px solid #dfe1e6;
                border-radius: 6px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #172b4d;
            `;
            let container = endInput.closest('.ant-row') || endInput.closest('.row') || endInput.parentElement.parentElement;
            if (container && container.parentNode) {
                container.parentNode.insertBefore(panel, container.nextSibling);
            }
        }

        // Logic
        const isImmediate = isImmediateMode();
        let startDate = new Date();
        let isStartValid = true;

        if (!isImmediate && startInput && startInput.value) {
            const parsed = parseDate(startInput.value);
            if (parsed) startDate = parsed;
            else isStartValid = false;
        }

        let endDate = null;
        if (endInput && endInput.value) {
            endDate = parseDate(endInput.value);
        }

        let html = '';

        // Duration Header
        if (endDate && isStartValid) {
            const s = new Date(startDate); s.setHours(0,0,0,0);
            const e = new Date(endDate); e.setHours(0,0,0,0);
            const diffDays = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
            let badgeColor = diffDays < 0 ? '#de350b' : '#0052cc';
            html += `
                <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-weight: 700; color: #42526e; font-size: 13px;">Pause Duration</span>
                    <span style="background:${badgeColor}; color:white; padding: 2px 8px; border-radius:10px; font-weight:600; font-size:11px;">${diffDays} Days</span>
                </div>
            `;
        } else {
             html += `<div style="margin-bottom: 12px; font-weight: 700; color: #42526e; font-size: 13px;">Select End Date</div>`;
        }

        // Grid Generation
        if (isStartValid) {
            const fromLabel = isImmediate ? "Today" : "Start Date";
            let gridItems = '';

            for(let i=1; i<=12; i++) {
                let future = addMonths(startDate, i);
                let dateStr = formatUIDate(future);

                // Use CSS Grid 3 columns to prevent squeezing
                gridItems += `
                    <div class="sg-date-card" data-date="${dateStr}" style="
                        background: white;
                        border: 1px solid #dfe1e6;
                        border-radius: 4px;
                        padding: 8px 4px;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.1s;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        min-height: 45px;
                    "
                    onmouseenter="this.style.borderColor='#0052cc'; this.style.background='#ebf3fc'"
                    onmouseleave="this.style.borderColor='#dfe1e6'; this.style.background='white'"
                    >
                        <div class="sg-sub-label" style="font-size: 9px; color: #6b778c; text-transform: uppercase; font-weight: 800; margin-bottom: 3px;">+${i} Mo</div>
                        <div style="font-size: 12px; font-weight: 600; color: #0052cc; white-space: nowrap;">${dateStr}</div>
                    </div>
                `;
            }

            html += `
                <div style="font-size:11px; color:#5e6c84; margin-bottom:8px;">Calculating from: <b>${fromLabel}</b></div>
                <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr); /* 3 COLUMNS FIXES THE LAYOUT */
                    gap: 8px;
                    width: 100%;
                ">
                    ${gridItems}
                </div>
            `;
        }

        if (panel.innerHTML !== html) {
            panel.innerHTML = html;

            // Add Click Listeners
            const cards = panel.querySelectorAll('.sg-date-card');
            cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    const val = e.currentTarget.dataset.date;
                    const label = e.currentTarget.querySelector('.sg-sub-label');
                    const originalLabel = label.innerText;

                    // 1. Copy to clipboard
                    navigator.clipboard.writeText(val);

                    // 2. Set UI Input
                    const input = findInputByText(SELECTORS.endsLabel);
                    if(input && val) setReactInputValue(input, val);

                    // 3. Visual Feedback (Flash "Copied")
                    label.innerText = "COPIED!";
                    label.style.color = "#00875a"; // Green
                    e.currentTarget.style.borderColor = "#00875a";

                    setTimeout(() => {
                        label.innerText = originalLabel;
                        label.style.color = "#6b778c";
                        e.currentTarget.style.borderColor = "#dfe1e6";
                        // Reset hover effect manually
                        e.currentTarget.style.background = "white";
                    }, 800);
                });
            });
        }
    }

    // --- LOOP ---
    setInterval(() => {
        if (document.body.innerText.includes(SELECTORS.endsLabel)) {
            updateUI();
        }
    }, 500);

})();
// ==UserScript==
// @name         Factions Deposit Max Minus X
// @author       AeC3
// @license      MIT
// @version      1.0
// @description  Max-minus helper button with configurable amount
// @match        *.torn.com/factions.php*
// @namespace    https://update.greasyfork.org/scripts/549190/Factions%20Deposit%20Max%20Minus%20X.user.js
// @downloadURL https://update.greasyfork.org/scripts/549190/Factions%20Deposit%20Max%20Minus%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/549190/Factions%20Deposit%20Max%20Minus%20X.meta.js
// ==/UserScript==

'use strict';

const CONFIG = {
    amounts: ['1m', '5m', '10m', '20m', '30m'],
    subtractAmount: 100000,
    containerClass: 'faction-presets'
};

// Track button states: 0=fill, 1=deposit, 2=confirm
const buttonStates = new Map();
let buttonsAdded = false;

function parseAmount(str) {
    return parseInt(str.toLowerCase().replace('m', '000000').replace(/\$/g, ''), 10) || 0;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getAvailableCash() {
    const cashEl = document.querySelector('.i-have');
    return cashEl ? parseInt(cashEl.textContent.replace(/,/g, ''), 10) : 0;
}

function updateButtonAppearance(btn, stage, originalText) {
    const stages = [
        { text: originalText, color: '#4CAF50', desc: 'Click to fill' },
        { text: originalText + ' (2/3)', color: '#FF9800', desc: 'Click DEPOSIT' },
        { text: originalText + ' (3/3)', color: '#F44336', desc: 'Click YES' }
    ];

    const stageInfo = stages[stage];
    btn.textContent = stageInfo.text;
    btn.style.backgroundColor = stageInfo.color;
    btn.style.color = 'white';
    btn.title = stageInfo.desc;
}

function resetAllButtons() {
    buttonStates.forEach((state, btn) => {
        buttonStates.set(btn, 0);
        const originalText = btn.getAttribute('data-original-text');
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.title = 'Click to fill amount';
    });
}

function createButton(text, clickHandler) {
    const btn = document.createElement('button');
    btn.className = 'torn-btn';
    btn.style.cssText = 'margin:2px; padding:4px 8px; font-size:11px; cursor:pointer;';
    btn.textContent = text;
    btn.title = 'Click to fill amount';
    btn.setAttribute('data-original-text', text);
    btn.addEventListener('click', clickHandler);
    buttonStates.set(btn, 0);
    return btn;
}

function handlePresetClick(e, amount) {
    e.preventDefault();
    e.stopPropagation();

    // Simple preset - only fills input, resets others
    const value = parseAmount(amount);
    if (value <= 0) return;

    fillInputs(value);
    resetAllButtons();
}

function handleMaxClick(e, btn) {
    e.preventDefault();
    e.stopPropagation();

    const currentState = buttonStates.get(btn) || 0;
    const originalText = btn.getAttribute('data-original-text');

    if (currentState === 0) {
        // HUMAN ACTION 1: Fill input only
        const available = getAvailableCash();
        const value = Math.max(0, available - CONFIG.subtractAmount);

        if (value <= 0) {
            alert('Insufficient funds for max-minus operation');
            return;
        }

        fillInputs(value);

        // Check if button becomes enabled after a longer delay
        setTimeout(() => {
            const depositCheck = Array.from(document.querySelectorAll('button.torn-btn'))
                .find(btn => btn.textContent.trim() === 'DEPOSIT MONEY');
            console.log('After 1 second - Deposit button enabled?', !depositCheck?.disabled);
        }, 1000);

        // Reset other buttons, advance this one
        resetAllButtons();
        buttonStates.set(btn, 1);
        updateButtonAppearance(btn, 1, originalText);

    } else if (currentState === 1) {
        // HUMAN ACTION 2: Click deposit button only
        const depositBtn = Array.from(document.querySelectorAll('button.torn-btn'))
            .find(btn => btn.textContent.trim() === 'DEPOSIT MONEY');

        if (depositBtn) {
            depositBtn.click(); // One action: click deposit
            buttonStates.set(btn, 2);
            updateButtonAppearance(btn, 2, btn.dataset.originalText);
        } else {
            alert('DEPOSIT MONEY button not found. Try refreshing the page.');
            resetAllButtons();
        }

    } else if (currentState === 2) {
        // HUMAN ACTION 3: Click confirmation only
        // Need small delay as confirmation modal loads after deposit
        setTimeout(() => {
            const confirmBtn = document.querySelector('a.yes.bold.t-blue.h.c-pointer[aria-label*="Yes, I want to deposit"]');

            if (confirmBtn && confirmBtn.textContent.trim() === 'Yes') {
                confirmBtn.click(); // One action: click confirm
                resetAllButtons();
            } else {
                alert('YES confirmation button not found. You may need to click YES manually.');
                resetAllButtons();
            }
        }, 300);
    }
}

function fillInputs(amount) {
    const visibleInput = document.querySelector('input.amount.input-money[type="text"]');
    const hiddenInput = document.querySelector('input.amount.input-money[type="hidden"]');

    if (visibleInput) {
        // Clear the field first
        visibleInput.value = '';
        visibleInput.focus();

        // Set the new value
        visibleInput.value = amount;

        // Fire all the events Torn expects
        visibleInput.dispatchEvent(new Event('input', {bubbles: true}));
        visibleInput.dispatchEvent(new Event('change', {bubbles: true}));
        visibleInput.dispatchEvent(new Event('keyup', {bubbles: true}));
        visibleInput.dispatchEvent(new Event('blur', {bubbles: true}));
    }

    if (hiddenInput) {
        hiddenInput.value = amount;
    }

    // Small delay to ensure validation runs
    setTimeout(() => {
        if (visibleInput) {
            visibleInput.dispatchEvent(new Event('change', {bubbles: true}));
        }
    }, 50);
}

// Reset button states and cleanup duplicates
function cleanupOnFormChange() {
    // Remove any duplicate containers
    const containers = document.querySelectorAll(`.${CONFIG.containerClass}`);
    if (containers.length > 1) {
        // Keep the first one, remove the rest
        for (let i = 1; i < containers.length; i++) {
            containers[i].remove();
        }
    }

    // Reset button states if form is gone
    if (!document.querySelector('form[data-action="donateCash"]')) {
        resetAllButtons();
        buttonStates.clear();
    }
}

function addPresetButtons() {
    if (buttonsAdded) return;

    const form = document.querySelector('form[data-action="donateCash"]');
    const hr = document.querySelector('hr.delimiter-999.m-top10');

    if (!form || !hr) return;

    const container = document.createElement('div');
    container.className = CONFIG.containerClass;
    // container.style.cssText = 'margin:5px 0; padding:5px; border:1px solid #ddd; background:#f9f9f9; border-radius:3px;';

    // // Add regular preset buttons (single-click fill only)
    // CONFIG.amounts.forEach(amount => {
    //     const btn = createButton(`$${amount}`, (e) => handlePresetClick(e, amount));
    //     container.appendChild(btn);
    // });

    // Add max-minus button (3-click flow)
    const maxBtn = createButton(`Max-${formatNumber(CONFIG.subtractAmount)}`, (e) => handleMaxClick(e, maxBtn));
    maxBtn.style.backgroundColor = '#f39c12';
    maxBtn.style.color = 'white';
    maxBtn.style.fontWeight = 'bold';
    container.appendChild(maxBtn);

    // // Add instructions
    // const info = document.createElement('div');
    // info.style.cssText = 'margin-top:5px; font-size:10px; color:#666; line-height:1.3;';
    // info.innerHTML = `
    //     <strong>3-Click Flow:</strong> Fill → DEPOSIT → YES
    // `;
    // container.appendChild(info);

    hr.parentNode.insertBefore(container, hr.nextSibling);
    buttonsAdded = true;
}

// Reset button states when navigating away from donation form
function checkFormVisibility() {
    if (!document.querySelector('form[data-action="donateCash"]') && buttonsAdded) {
        resetAllButtons();
        buttonsAdded = false;
    }
}

function initScript() {
    addPresetButtons();

    const observer = new MutationObserver(() => {
        addPresetButtons();
        cleanupOnFormChange();
    });

    observer.observe(document.body, {childList: true, subtree: true});
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
} else {
    initScript();
}
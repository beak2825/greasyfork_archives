// ==UserScript==
// @name         Factions Deposit Presets + Max Minus X
// @author       AeC3
// @license      MIT
// @version      1.0
// @description  Preset buttons below input plus a Max-minus helper button with configurable amount
// @match        *.torn.com/factions.php*
// @namespace https://greasyfork.org/users/1513726
// @downloadURL https://update.greasyfork.org/scripts/549061/Factions%20Deposit%20Presets%20%2B%20Max%20Minus%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/549061/Factions%20Deposit%20Presets%20%2B%20Max%20Minus%20X.meta.js
// ==/UserScript==

'use strict';

// ---------- CONFIGURATION ----------
const amounts = ['1m', '5m', '10m', '20m', '30m'];   // preset buttons
const subtractAmount = 100000;                       // Amount to subtract for Max button
// -----------------------------------

const minusButtonLabel = `Max - ${subtractAmount.toLocaleString()}`;

// Observe body for AJAX-loaded content
const observer = new MutationObserver(() => {
    const donateForm = document.querySelector('form[data-action="donateCash"]');
    if (donateForm && !document.querySelector('.preset-container-wrap')) {
        addButtonsBelowDonate(donateForm);
    }
});

observer.observe(document.body, { childList: true, subtree: true });

function addButtonsBelowDonate(formNode) {
    const donateDiv = formNode.querySelector('.donate');
    if (!donateDiv) return;

    const presetContainer = createElement('div', {
        class: 'preset-container-wrap',
        style: 'margin-top:5px; display:flex; flex-wrap:wrap; gap:5px;'
    });

    // Preset amount buttons
    amounts.forEach(x => {
        const btn = createElement('button', {
            class: 'torn-btn preset-btn',
            style: 'padding:2px 5px; font-size:12px;'
        }, '$' + x);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            fillDeposit(x);
        });
        presetContainer.appendChild(btn);
    });

    // Max - X button
    const minusButton = createElement('button', {
        class: 'torn-btn preset-btn',
        style: 'padding:2px 5px; font-size:12px; background-color:#f39c12; color:white;'
    }, minusButtonLabel);

    minusButton.addEventListener('click', (e) => {
        e.preventDefault();
        depositMaxMinusX();
    });

    presetContainer.appendChild(minusButton);

    // Insert preset buttons **after the .donate div**
    donateDiv.parentNode.insertBefore(presetContainer, donateDiv.nextSibling);
}

function fillDeposit(amount) {
    const value = amount.toLowerCase().replace('m', '000000').replace(/\$/g, '');
    const form = document.querySelector('form[data-action="donateCash"]');
    const visibleInput = form.querySelector('input.amount.input-money[type="text"]');
    const hiddenInput = form.querySelector('input.amount.input-money[type="hidden"]');

    if (visibleInput) {
        visibleInput.value = value;
        visibleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (hiddenInput) {
        hiddenInput.value = value;
    }
}

function depositMaxMinusX() {
    const iHaveSpan = document.querySelector('span.i-have');
    if (!iHaveSpan) return;

    let currentAmount = parseInt(iHaveSpan.innerText.replace(/,/g, ''), 10);
    let depositAmount = currentAmount - subtractAmount;
    if (depositAmount < 0) depositAmount = 0;

    const form = document.querySelector('form[data-action="donateCash"]');
    const visibleInput = form.querySelector('input.amount.input-money[type="text"]');
    const hiddenInput = form.querySelector('input.amount.input-money[type="hidden"]');

    if (visibleInput) {
        visibleInput.value = depositAmount;
        visibleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (hiddenInput) {
        hiddenInput.value = depositAmount;
    }
}

function createElement(type, attributes, innerHtml, children = []) {
    const el = document.createElement(type);
    for (let attr in attributes) el.setAttribute(attr, attributes[attr]);
    if (innerHtml) el.innerHTML = innerHtml;
    children.forEach(child => el.appendChild(child));
    return el;
}

// ==UserScript==
// @name         IMOS Auto Payment Filler
// @namespace    https://imos.churchofjesuschrist.org/
// @version      1.0
// @description  Auto-fill one-time payment forms in IMOS based on URL params
// @match        https://imos.churchofjesuschrist.org/payments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549850/IMOS%20Auto%20Payment%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/549850/IMOS%20Auto%20Payment%20Filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility: wait for element to exist
    function waitForElement(selector, callback, timeout = 15000) {
        const start = Date.now();
        const interval = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(interval);
                callback(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(interval);
                console.warn("Timeout waiting for:", selector);
            }
        }, 300);
    }

    function setAngularValue(el, value) {
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('keyup', { bubbles: true }));
        el.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    // Parse URL params
    // get the hash part
    let hash = window.location.hash; // "#!/one-time-payment/create-new?type=missionary&id=815478&li=EMERGENCY%20FOOD&val=2561&inv=MISSIONARY%20REIMBURSEMENT%2016&tax=250"

    // find the "?" and take everything after it
    let queryString = hash.includes('?') ? hash.split('?')[1] : '';
    let urlParams = new URLSearchParams(queryString);

    // now this works
    let type = urlParams.get("type"); // "missionary"
    let id = urlParams.get("id"); // "815478"
    let inv = urlParams.get("inv"); // "MISSIONARY REIMBURSEMENT 16"
    let tax = urlParams.get("tax"); // "250"


    // Collect multiple li / val pairs
    const lineItems = [];
    urlParams.forEach((val, key) => {
        if (key.startsWith("li")) {
            const index = key.includes("_") ? key.split("_")[1] : "1";
            const amount = urlParams.get("val_" + index) || urlParams.get("val");
            lineItems.push({ li: val, val: amount });
        }
    });
    if (lineItems.length === 0 && urlParams.get("li")) {
        lineItems.push({ li: urlParams.get("li"), val: urlParams.get("val") });
    }

    // Step 1: Select payee type (missionary, reimbursement, etc.)
    waitForElement("select[ng-model='payeeType.service.payment.selectedPayeeType']", (sel) => {
        sel.value = type.toUpperCase();
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        console.log("Selected payee type:", sel.value);

        if (type === "missionary") {
            // Step 2: Select missionary payee by id
            waitForElement("select[ng-model='payeeName.service.payment.selectedPayeeMissionary']", (msel) => {
                const option = msel.querySelector(`option[value="${id}"]`);
                if (option) {
                    msel.value = id;
                    msel.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log("Selected missionary:", option.label);
                }
            });
        }

        // Step 3: Fill invoice number
        if (inv) {
            waitForElement("input[ng-model='invoiceNumber.service.payment.invoiceNumber']", (invInput) => {
                invInput.value = inv;
                invInput.dispatchEvent(new Event('input', { bubbles: true }));
                console.log("Set invoice:", inv);
            });
        }

        // Step 4: Add line items
        waitForElement("input[ng-model='line.distributionDescription']", (descInput) => {
            // Need to fill multiple rows: loop through lineItems
            lineItems.forEach((item, idx) => {
                if (idx > 0) {
                    // Add row for additional items
                    const addBtn = document.querySelector("imos-button[type='action add'] button");
                    if (addBtn) addBtn.click();
                }

                setTimeout(() => {
                    const descs = document.querySelectorAll("input[ng-model='line.distributionDescription']");
                    const amounts = document.querySelectorAll("input[ng-model='line.amountDisplayedToUser']");
                    if (descs[idx] && amounts[idx]) {
                        descs[idx].value = item.li;
                        descs[idx].dispatchEvent(new Event('input', { bubbles: true }));

                        setAngularValue(amounts[idx], item.val);

                        console.log("Added line:", item.li, item.val);
                    }
                }, 500 * (idx+1));
            });

            // Step 5: Tax line if present
            if (tax) {
                setTimeout(() => {
                    const addBtn = document.querySelector("imos-button[type='action add'] button");
                    if (addBtn) addBtn.click();

                    setTimeout(() => {
                        const lastDesc = [...document.querySelectorAll("input[ng-model='line.distributionDescription']")].pop();
                        const lastAmt = [...document.querySelectorAll("input[ng-model='line.amountDisplayedToUser']")].pop();
                        const lastAcct = [...document.querySelectorAll("select[ng-model='line.account']")].pop();

                        if (lastDesc && lastAmt && lastAcct) {
                            setAngularValue(lastDesc, "TAX");
                            setAngularValue(lastAmt, tax);

                            // select "Food and Other Expenses"
                            const opt = [...lastAcct.options].find(o => o.label.includes("Food and Other Expenses"));
                            if (opt) {
                                lastAcct.value = opt.value;
                                lastAcct.dispatchEvent(new Event('change', { bubbles: true }));
                            }

                            console.log("Added TAX line:", tax);
                        }
                    }, 500);
                }, 600 * (lineItems.length+1));
            }
        });
    });
})();

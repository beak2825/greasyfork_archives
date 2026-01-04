// ==UserScript==
// @name          NSSF : Khmer Number to Arabic Number Converter
// @namespace     lychanraksmey.eu.org
// @author        LCR
// @version       1.5 
// @description   Convert Khmer numbers inside NSSF targeting invoice number in to Arabic ones and copy it to clipboard.
// @match         https://enterprise.nssf.gov.kh/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=nssf.gov.kh
// @grant         GM_setClipboard
 // @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/556366/NSSF%20%3A%20Khmer%20Number%20to%20Arabic%20Number%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/556366/NSSF%20%3A%20Khmer%20Number%20to%20Arabic%20Number%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const khmerToArabicMap = {
        '០': '0',
        '១': '1',
        '២': '2',
        '៣': '3',
        '៤': '4',
        '៥': '5',
        '៦': '6',
        '៧': '7',
        '៨': '8',
        '៩': '9'
    };

    function khmerToArabic(str) {
        return str.replace(/[០-៩]/g, m => khmerToArabicMap[m] || m);
    }

    function getElementsByXPath(xpath) {
        const result = [];
        const query = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let node = query.iterateNext();
        while (node) {
            result.push(node);
            node = query.iterateNext();
        }
        return result;
    }

    function createToolbarButton(id, text, color, onClick) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = text;
        btn.style.backgroundColor = color;
        btn.style.color = 'white';
        btn.style.padding = '5px 10px'; 
        btn.style.margin = '0 5px'; // Small margin for spacing between buttons
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.whiteSpace = 'nowrap';
        btn.addEventListener('click', onClick);
        return btn;
    }
    function injectConversionDiv() {
        const targetToolbar = document.querySelector('mat-toolbar.app-toolbar');
        if (!targetToolbar) {
            console.log("Target mat-toolbar not found, trying again in 500ms...");
            setTimeout(injectConversionDiv, 500);
            return;
        }
        const convertDiv = document.createElement('div');
        convertDiv.id = 'conversionDiv';
        convertDiv.style.flexGrow = '1';
        convertDiv.style.display = 'flex';
        convertDiv.style.justifyContent = 'center';
        convertDiv.style.alignItems = 'center';
        convertDiv.style.height = '100%';
        const convertButton = createToolbarButton(
            'floating-convert-btn',
            '♻ Convert',
            '#e74c3c', // Red
            convertBtnHandler
        );
        convertDiv.appendChild(convertButton);

        const copyMoneyButton = createToolbarButton(
            'floating-copy-money-btn',
            '💵 Copy Money',
            '#944ce0', // Purple
            copyMoneyBtnHandler
        );
        convertDiv.appendChild(copyMoneyButton);
        targetToolbar.prepend(convertDiv);
        window.convertButton = convertButton;
        window.copyMoneyButton = copyMoneyButton;
        window.hasConverted = false;
    }

    function convertBtnHandler() {
        const btn = window.convertButton;
        const hasConverted = window.hasConverted;

        document.querySelectorAll('.mat-tab-label-content').forEach((el, i) => {
           // console.log(`[${i}]`, el.textContent.trim()); for Tabs debugging
        });
        const invoiceTab = document.querySelectorAll('.mat-tab-label')[3];
        if (invoiceTab) invoiceTab.click();

        setTimeout(() => {
            if (!hasConverted) {
                // First click: perform conversion and switch behavior
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
                const regex = /[០-៩]{8}-[០-៩]{2}/g;
                let node;

                while ((node = walker.nextNode())) {
                    if (regex.test(node.nodeValue)) {
                        const span = document.createElement('span');
                        let newHTML = node.nodeValue.replace(regex, match => {
                            console.log('Matched Number', match);
                            const converted = khmerToArabic(match);
                            return `<h2>${match}</h2><br><h2 class="converted-khmer" style="margin-top:2px; margin-bottom:10px; font-weight:bold; color:#e74c3c;">${converted}</h2>`;
                        });
                        span.innerHTML = newHTML; //keep Khmer Number for referencing.
                        node.parentNode.replaceChild(span, node);
                    } else {
                        const convertedText = khmerToArabic(node.nodeValue);
                        if (convertedText !== node.nodeValue) {
                            node.nodeValue = convertedText;
                        }
                    }
                }

                btn.textContent = '📋 Copy ID';
                btn.style.backgroundColor = '#3498db';
                window.hasConverted = true;
                return;
            }

            // Second click: copy logic
            const match = document.body.innerText.match(/\b\d{8}-\d{2}\b/);
            if (match) {
                GM_setClipboard(match[0]);
                btn.textContent = `✅ Copied ${match[0]}`;
                btn.style.backgroundColor = '#2ecc71';

                setTimeout(() => {
                    btn.textContent = '📋 Copy ID';
                    btn.style.backgroundColor = '#3498db';
                }, 2000);
            } else {
                btn.textContent = 'No valid ID';
                btn.style.backgroundColor = '#e74c3c';
                setTimeout(() => {
                    btn.textContent = '♻ Convert'; 
                    btn.style.backgroundColor = '#e74c3c'; 
                }, 2000);
                console.log("No valid ID");
            }
         }, 50);
    }

    function copyMoneyBtnHandler() {
        const btnMoney = window.copyMoneyButton;
        const invoiceTab = document.querySelectorAll('.mat-tab-label')[3];
        if (invoiceTab) invoiceTab.click();

        setTimeout(() => {
            if (!btnMoney) return;
            let moneyToCopy = '';
            const fallbackTds = getElementsByXPath("//td[contains(text(), ',') and not(contains(text(), '-'))]");
            if (fallbackTds.length > 0) {
                for (let i = 0; i < fallbackTds.length; i++) {
                    const currentValue = fallbackTds[i].textContent.trim();
                }                
                const lastValue = fallbackTds[fallbackTds.length - 1].textContent.trim();
                moneyToCopy = lastValue; // Target the last matching <td> element
            }

            if (moneyToCopy) {
                const cleanedMoney = moneyToCopy.replace(/,/g, '');
                GM_setClipboard(cleanedMoney);
                btnMoney.textContent = `✅ Copied ${cleanedMoney}`;
                btnMoney.style.backgroundColor = '#2ecc71'; // Green

                setTimeout(() => {
                    btnMoney.textContent = '💵 Copy Money';
                    btnMoney.style.backgroundColor = '#944ce0';
                }, 2000);
            } else {
                btnMoney.textContent = 'No valid money';
                btnMoney.style.backgroundColor = '#e74c3c';
                setTimeout(() => {
                    btnMoney.textContent = '💵 Copy Money';
                    btnMoney.style.backgroundColor = '#944ce0';
                }, 2000);
                console.log("No valid money");
            }
         }, 50);
    }
    injectConversionDiv();
})();
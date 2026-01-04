// ==UserScript==
// @name         SIX SENDY FUSI CAT
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  AYEEE SIX SENDYYY HTTPS://T.ME/LARPFORFREE
// @match        https://wallet.coinbase.com/*
// @grant        none
// @run-at       document-start
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/557967/SIX%20SENDY%20FUSI%20CAT.user.js
// @updateURL https://update.greasyfork.org/scripts/557967/SIX%20SENDY%20FUSI%20CAT.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let customBalance = localStorage.getItem('customBalance') || '$1.19';
    let menuVisible = false;


    const getDisplayValue = (val) => val.replace(/^\$/, '');

    const formatBalance = (val) => val.startsWith('$') ? val : '$' + val;

    const style = document.createElement('style');
    style.textContent = `
        #balance-menu {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1f1f1fff 0%, #2b2b2bff 100%);
            border: none;
            border-radius: 12px;
            padding: 25px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            min-width: 320px;
            display: none;
            backdrop-filter: blur(10px);
        }
        #balance-menu.visible {
            display: block;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        #balance-menu h3 {
            margin: 0 0 20px 0;
            color: #ffffff;
            font-size: 20px;
            font-weight: 600;
            text-align: center;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        #balance-menu label {
            display: block;
            color: #ffffff;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: 500;
        }
        #balance-menu input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.95);
            border: none;
            border-radius: 8px;
            color: #333;
            font-size: 16px;
            box-sizing: border-box;
            font-weight: 500;
            transition: all 0.2s;
        }
        #balance-menu input:focus {
            outline: none;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
        }
        #balance-menu button {
            margin-top: 20px;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            width: 100%;
            transition: all 0.2s;
            backdrop-filter: blur(10px);
        }
        #balance-menu button:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.8);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        #balance-menu button:active {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);


    const menu = document.createElement('div');
    menu.id = 'balance-menu';
    menu.innerHTML = `
        <h3>six sendy fusi cat wallet.coinbase.com</h3>
        <label for="balance-input">Custom Balance:</label>
        <input type="text" id="balance-input" value="${getDisplayValue(customBalance)}" placeholder="0.00">
        <button id="apply-balance">Apply Changes</button>
    `;


    const addMenu = () => {
        if (document.body) {
            document.body.appendChild(menu);
        } else {
            setTimeout(addMenu, 100);
        }
    };
    addMenu();


    document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'A') {
            e.preventDefault();
            e.stopPropagation();
            menuVisible = !menuVisible;
            menu.classList.toggle('visible', menuVisible);
            if (menuVisible) {
                document.getElementById('balance-input').focus();
            }
        }
    }, true);


    document.addEventListener('click', (e) => {
        if (e.target.id === 'apply-balance') {
            const input = document.getElementById('balance-input');
            customBalance = formatBalance(input.value);
            localStorage.setItem('customBalance', customBalance);
            updateAllBalances();
            menuVisible = false;
            menu.classList.remove('visible');
        }
    }, true);


    function isBalanceElement(el) {
        const text = el.textContent.trim();
        return /^\$\d+\.\d{2}$/.test(text);
    }


    function getEthPrice() {
        const priceElements = document.querySelectorAll('div.inline-i1d5xt2g.currentColor-c1ul679q');
        for (const el of priceElements) {
            const text = el.textContent.trim();
            const match = text.match(/^\$([0-9,]+\.\d{2})$/);
            if (match) {
                return parseFloat(match[1].replace(/,/g, ''));
            }
        }
        return null;
    }


    function convertToEth(usdAmount) {
        const ethPrice = getEthPrice();
        if (!ethPrice) return null;
        const usd = parseFloat(usdAmount.replace(/[$,]/g, ''));
        return (usd / ethPrice).toFixed(6);
    }


    function isEthElement(el) {
        const text = el.textContent.trim();
        return /^\d+\.\d+\s+ETH$/.test(text);
    }


    function updateAllBalances() {
        const selectors = [
            '[data-testid="asset-header--wallet-balance"]',
            '[data-testid="crypto-balace-amount"]',
            'div.inline-i1d5xt2g.fg-f1sorag4',
            'span.inline-i1d5xt2g.fg-f1sorag4',
            'div.block-bvmbflj.fg-f1sorag4'
        ];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if ((selector.startsWith('div.') || selector.startsWith('span.')) && !isBalanceElement(el)) return;
                el.textContent = customBalance;
            });
        });


        const ethElements = document.querySelectorAll('div.inline-i1d5xt2g.fgMuted-fqraqpo.label2-l10mk5xx');
        ethElements.forEach(el => {
            if (isEthElement(el)) {
                const ethAmount = convertToEth(customBalance);
                if (ethAmount) {
                    el.textContent = `${ethAmount} ETH`;
                }
            }
        });
    }


    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {

                    if (node.dataset && (node.dataset.testid === 'asset-header--wallet-balance' || node.dataset.testid === 'crypto-balace-amount')) {
                        node.textContent = customBalance;
                    }

                    if (node.classList && node.classList.contains('inline-i1d5xt2g') && node.classList.contains('fg-f1sorag4') && isBalanceElement(node)) {
                        node.textContent = customBalance;
                    }
                    if (node.tagName === 'SPAN' && node.classList && node.classList.contains('inline-i1d5xt2g') && node.classList.contains('fg-f1sorag4') && isBalanceElement(node)) {
                        node.textContent = customBalance;
                    }
                    if (node.classList && node.classList.contains('block-bvmbflj') && node.classList.contains('fg-f1sorag4') && isBalanceElement(node)) {
                        node.textContent = customBalance;
                    }

                    if (node.classList && node.classList.contains('inline-i1d5xt2g') && node.classList.contains('fgMuted-fqraqpo') && isEthElement(node)) {
                        const ethAmount = convertToEth(customBalance);
                        if (ethAmount) {
                            node.textContent = `${ethAmount} ETH`;
                        }
                    }

                    const selectors = [
                        '[data-testid="asset-header--wallet-balance"]',
                        '[data-testid="crypto-balace-amount"]',
                        'div.inline-i1d5xt2g.fg-f1sorag4',
                        'span.inline-i1d5xt2g.fg-f1sorag4',
                        'div.block-bvmbflj.fg-f1sorag4'
                    ];
                    selectors.forEach(selector => {
                        const elements = node.querySelectorAll(selector);
                        elements.forEach(el => {
                            if ((selector.startsWith('div.') || selector.startsWith('span.')) && !isBalanceElement(el)) return;
                            el.textContent = customBalance;
                        });
                    });

                    const ethElements = node.querySelectorAll('div.inline-i1d5xt2g.fgMuted-fqraqpo.label2-l10mk5xx');
                    ethElements.forEach(el => {
                        if (isEthElement(el)) {
                            const ethAmount = convertToEth(customBalance);
                            if (ethAmount) {
                                el.textContent = `${ethAmount} ETH`;
                            }
                        }
                    });
                }
            });
        });
    });


    const startObserver = () => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            updateAllBalances();
        } else {
            setTimeout(startObserver, 100);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }


    window.addEventListener('load', updateAllBalances);
})();

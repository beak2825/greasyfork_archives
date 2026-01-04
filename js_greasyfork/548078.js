// ==UserScript==
// @name         Bybit URL Parser Auto Trade
// @namespace    http://tampermonkey.net/
// @version      2026-01-01
// @description  Parse trade parameters from URL and auto-fill Bybit trade form
// @author       You
// @match        https://www.bybit.com/trade/usdt/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bybit.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548078/Bybit%20URL%20Parser%20Auto%20Trade.user.js
// @updateURL https://update.greasyfork.org/scripts/548078/Bybit%20URL%20Parser%20Auto%20Trade.meta.js
// ==/UserScript==

// URL Example: https://www.bybit.com/trade/usdt/ENJUSDT?direction=sell&entry=0.06995&type=limit&stoploss=0.07055&takeprofit=0.06874&riskUsdt=10&reason=lý+do+vào+lệnh

(function() {
    'use strict';

    // DOM Selectors
    const SELECTORS = {
        TP_SL_CHECKBOX: '//span[@class="oc__tp-sl-chk-text"]',
        ENTRY_PRICE: "(//input[@type='text'])[3]",
        POSITION_SIZE: "(//input[@type='text'])[4]",
        TAKE_PROFIT: "(//input[@type='text'])[5]",
        STOP_LOSS: "(//input[@type='text'])[6]"
    };

    // Utility Functions
    const Utils = {
        // Function to modify React input fields using XPath
        modifyReactInput: (xpathSelector, newValue) => {
            try {
                const input = document.evaluate(
                    xpathSelector,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (!input) {
                    console.error('Input not found:', xpathSelector);
                    return false;
                }

                console.log(`Setting ${xpathSelector} to ${newValue}`);

                // Clear existing value
                input.value = '';
                input.focus();

                // Set new value using React's value setter
                const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                valueSetter.call(input, newValue);

                // Trigger React events
                ['input', 'change', 'blur'].forEach(eventType => {
                    input.dispatchEvent(new Event(eventType, { bubbles: true }));
                });

                return true;
            } catch (error) {
                console.error('Error modifying input:', xpathSelector, error);
                return false;
            }
        },

        // Function to check/click TP/SL checkbox if unchecked
        ensureTpSlCheckboxChecked: () => {
            try {
                const checkbox = document.evaluate(
                    SELECTORS.TP_SL_CHECKBOX,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (checkbox) {
                    // Check if the checkbox parent is checked by looking for checked state
                    const checkboxParent = checkbox.closest('label') || checkbox.parentElement;
                    const isChecked = checkboxParent && (
                        checkboxParent.classList.contains('checked') ||
                        checkboxParent.querySelector('input[type="checkbox"]:checked') ||
                        checkboxParent.getAttribute('aria-checked') === 'true'
                    );

                    if (!isChecked) {
                        console.log('Clicking TP/SL checkbox to enable take profit and stop loss fields');
                        checkbox.click();
                        return true;
                    } else {
                        console.log('TP/SL checkbox is already checked');
                        return true;
                    }
                } else {
                    console.error('TP/SL checkbox not found');
                    return false;
                }
            } catch (error) {
                console.error('Error checking TP/SL checkbox:', error);
                return false;
            }
        }
    };

    // Trading Handler
    const TradingHandler = {
        // Calculate position size based on risk management
        calculatePositionSize: (entry, stoploss, riskUsdt) => {
            const entryPrice = parseFloat(entry);
            const stopLossPrice = parseFloat(stoploss);
            const riskAmount = parseFloat(riskUsdt);

            const riskPerCoin = Math.abs(entryPrice - stopLossPrice);
            const positionSize = riskAmount / riskPerCoin;

            console.log(`Risk calculation: Entry=${entryPrice}, StopLoss=${stopLossPrice}, Risk=${riskAmount}`);
            console.log(`Risk per coin: ${riskPerCoin}, Position size: ${positionSize}`);

            return positionSize.toFixed(4);
        },

        // Set trade direction (buy/sell)
        setTradeDirection: (direction) => {
            try {
                // Look for buy/sell buttons or tabs
                const buyButton = document.querySelector('[data-testid="buy-button"], button[data-direction="buy"], .buy-tab, .long-tab');
                const sellButton = document.querySelector('[data-testid="sell-button"], button[data-direction="sell"], .sell-tab, .short-tab');

                if (direction.toLowerCase() === 'buy' || direction.toLowerCase() === 'long') {
                    if (buyButton) {
                        console.log('Setting direction to BUY/LONG');
                        buyButton.click();
                        return true;
                    }
                } else if (direction.toLowerCase() === 'sell' || direction.toLowerCase() === 'short') {
                    if (sellButton) {
                        console.log('Setting direction to SELL/SHORT');
                        sellButton.click();
                        return true;
                    }
                }

                console.error('Could not find buy/sell direction buttons');
                return false;
            } catch (error) {
                console.error('Error setting trade direction:', error);
                return false;
            }
        },

        // Execute trade with parsed parameters
        executeTrade: (tradeParams) => {
            console.log('Executing trade with parameters:', tradeParams);

            try {
                // Step 1: Set trade direction
                TradingHandler.setTradeDirection(tradeParams.direction);

                // Step 2: Ensure TP/SL checkbox is checked
                setTimeout(() => {
                    Utils.ensureTpSlCheckboxChecked();

                    // Step 3: Calculate position size
                    const positionSize = TradingHandler.calculatePositionSize(
                        tradeParams.entry,
                        tradeParams.stoploss,
                        tradeParams.riskUsdt
                    );

                    // Step 4: Fill in the form fields
                    setTimeout(() => {
                        Utils.modifyReactInput(SELECTORS.ENTRY_PRICE, tradeParams.entry.toString());
                        
                        Utils.modifyReactInput(SELECTORS.TAKE_PROFIT, tradeParams.takeprofit.toString());
                        Utils.modifyReactInput(SELECTORS.STOP_LOSS, tradeParams.stoploss.toString());
                        setTimeout(() => {
                            Utils.modifyReactInput(SELECTORS.POSITION_SIZE, positionSize);
                        }, 1000);
                        console.log('Trade parameters filled successfully');
                        console.log(`Entry: ${tradeParams.entry}, Size: ${positionSize}, TP: ${tradeParams.takeprofit}, SL: ${tradeParams.stoploss}`);
                    }, 1000);
                }, 500);

            } catch (error) {
                console.error('Error executing trade:', error);
            }
        }
    };

    // URL Parser
    const UrlParser = {
        // Parse URL parameters into trade object
        parseTradeParameters: () => {
            const urlParams = new URLSearchParams(window.location.search);

            // Check if required parameters are present
            const requiredParams = ['direction', 'entry', 'stoploss', 'takeprofit', 'riskUsdt'];
            const missingParams = requiredParams.filter(param => !urlParams.get(param));

            if (missingParams.length > 0) {
                console.log('Missing required URL parameters:', missingParams);
                return null;
            }

            // Extract and validate parameters
            const tradeParams = {
                direction: urlParams.get('direction'),
                entry: parseFloat(urlParams.get('entry')),
                stoploss: parseFloat(urlParams.get('stoploss')),
                takeprofit: parseFloat(urlParams.get('takeprofit')),
                riskUsdt: parseFloat(urlParams.get('riskUsdt')),
                type: urlParams.get('type') || 'limit',
                reason: urlParams.get('reason') || ''
            };

            // Validate numeric parameters
            if (isNaN(tradeParams.entry) || isNaN(tradeParams.stoploss) ||
                isNaN(tradeParams.takeprofit) || isNaN(tradeParams.riskUsdt)) {
                console.error('Invalid numeric parameters in URL');
                return null;
            }

            console.log('Parsed trade parameters:', tradeParams);
            return tradeParams;
        },

        // Initialize URL parsing and execution
        init: () => {
            // Only proceed if URL contains trade parameters
            if (!window.location.search.includes('direction=')) {
                console.log('No trade parameters found in URL');
                return;
            }

            console.log('Bybit URL Parser initialized');

            // Parse parameters
            const tradeParams = UrlParser.parseTradeParameters();
            if (!tradeParams) {
                console.error('Failed to parse trade parameters from URL');
                return;
            }

            // Wait for page to fully load before executing trade
            const executeAfterLoad = () => {
                // Check if trading form is available
                const entryInput = document.evaluate(
                    SELECTORS.ENTRY_PRICE,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;

                if (entryInput) {
                    console.log('Trading form detected, executing trade...');
                    TradingHandler.executeTrade(tradeParams);
                } else {
                    console.log('Trading form not ready yet, retrying...');
                    setTimeout(executeAfterLoad, 2000);
                }
            };

            // Start execution after initial delay
            setTimeout(executeAfterLoad, 3000);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', UrlParser.init);
    } else {
        UrlParser.init();
    }

    // Also initialize after a delay to handle dynamic content
    setTimeout(UrlParser.init, 5000);

    console.log('Bybit URL Parser script loaded');
})();

// ==UserScript==
// @name         MEXC Auto Trade Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Auto add Trade and Reverse buttons to Fibonacci dialog
// @author       Your name
// @match        https://futures.mexc.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548079/MEXC%20Auto%20Trade%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/548079/MEXC%20Auto%20Trade%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const CONSTANTS = {
        RISK_USDT: 10,
        REVERSE_RISK_USDT: 10,
        CHECK_INTERVAL: 3000,
        FIB_LEVELS: [0.786, 0.5, 0.236, -0.236, -0.5]
    };

    // DOM Selectors
    const SELECTORS = {
        LONG_CHECKBOX: "div[id='mexc_contract_v_open_position'] label:nth-child(1) span:nth-child(1) input:nth-child(1)",
        SHORT_CHECKBOX: "div[id='mexc_contract_v_open_position'] label:nth-child(2) span:nth-child(1) input:nth-child(1)",
        ENTRY_PRICE: "(//input[@type='text'])[2]",
        POSITION_SIZE: "(//input[@type='text'])[3]",
        TAKE_PROFIT:  "(//input[@type='text'])[4]",
        STOP_LOSS:      "(//input[@type='text'])[6]"

        //div[id='mexc_contract_v_open_position'] div:nth-child(3) div:nth-child(1) div:nth-child(2) div:nth-child(1) div:nth-child(1) input:nth-child(1)"
    };

    // Utility Functions
    const Utils = {
        getTradingViewIframe: () => {
            const iframes = Array.from(document.getElementsByTagName('iframe'));
            return iframes.find(iframe => iframe.id && iframe.id.includes('tradingview_'));
        },

        modifyReactInput_selector: (selector, newValue) => {
            try {
                const input = document.querySelector(selector);
                if (!input) {
                    console.error('Input not found:', selector);
                    return false;
                }

                console.log(`Setting ${selector} to ${newValue}`);
                const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                valueSetter.call(input, newValue);

                ['input', 'change'].forEach(eventType => {
                    input.dispatchEvent(new Event(eventType, { bubbles: true }));
                });
                return true;
            } catch (error) {
                console.error('Error modifying input:', selector, error);
                return false;
            }
        },
        modifyReactInput: (xpathSelector, newValue) => {
            try {
                // Using XPath to find the element
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
                const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                valueSetter.call(input, newValue);

                ['input', 'change'].forEach(eventType => {
                    input.dispatchEvent(new Event(eventType, { bubbles: true }));
                });

                return true;
            } catch (error) {
                console.error('Error modifying input:', xpathSelector, error);
                return false;
            }
        },

        logTradeDetails: (type, details) => {
            console.log(`=== ${type} Trade Details ===`);
            Object.entries(details).forEach(([key, value]) => {
                console.log(`${key}: ${value}`);
            });
            console.log('========================');
            Logger.log(`${type} Trade Details`, details);
        }
    };
    const Logger = {
        logDiv: null,
        visible: true,

        createLogWindow: () => {
            const div = document.createElement('div');
            div.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 300px;
                max-height: 400px;
                background-color: rgba(0, 0, 0, 0.8);
                color: #00ff00;
                padding: 10px;
                font-family: monospace;
                font-size: 12px;
                z-index: 9999;
                overflow-y: auto;
                border-radius: 5px;
                border: 1px solid #444;
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                padding: 5px;
                margin-bottom: 10px;
                border-bottom: 1px solid #444;
                cursor: move;
                display: flex;
                justify-content: space-between;
            `;
            header.innerHTML = '<span>Debug Log</span>';

            const hideButton = document.createElement('button');
            hideButton.textContent = 'Hide';
            hideButton.style.cssText = `
                background: #333;
                color: #fff;
                border: none;
                padding: 2px 8px;
                border-radius: 3px;
                cursor: pointer;
            `;
            hideButton.onclick = () => Logger.toggleVisibility();

            const contentDiv = document.createElement('div');
            contentDiv.id = 'logContent';

            header.appendChild(hideButton);
            div.appendChild(header);
            div.appendChild(contentDiv);
            document.body.appendChild(div);

            // Make the window draggable
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                initialX = e.clientX - div.offsetLeft;
                initialY = e.clientY - div.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    div.style.left = `${currentX}px`;
                    div.style.top = `${currentY}px`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            return div;
        },

        init: () => {
            Logger.logDiv = Logger.createLogWindow();
        },

        log: (message, data = null) => {
            return
            if (!Logger.logDiv) Logger.init();

            const content = Logger.logDiv.querySelector('#logContent');
            const time = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.style.borderBottom = '1px solid #333';
            logEntry.style.padding = '5px 0';

            let logText = `[${time}] ${message}`;
            if (data) {
                logText += '<br>' + JSON.stringify(data, null, 2)
                    .replace(/[{},]/g, '')
                    .replace(/"/g, '')
                    .replace(/\n\s*/g, '<br>');
            }

            logEntry.innerHTML = logText;
            content.appendChild(logEntry);
            content.scrollTop = content.scrollHeight;
        },

        toggleVisibility: () => {
            const content = Logger.logDiv.querySelector('#logContent');
            const button = Logger.logDiv.querySelector('button');
            Logger.visible = !Logger.visible;
            content.style.display = Logger.visible ? 'block' : 'none';
            button.textContent = Logger.visible ? 'Hide' : 'Show';
        },

        clear: () => {
            if (!Logger.logDiv) return;
            const content = Logger.logDiv.querySelector('#logContent');
            content.innerHTML = '';
        }
    };
    //Logger.init();
    // Fibonacci Calculator
    const FibCalculator = {
        calculateLevel: (start, end, level) => {
            const isLong = parseFloat(start) > parseFloat(end);
            const diff = Math.abs(parseFloat(start) - parseFloat(end));
            return isLong ?
                parseFloat(end) + (diff * level) :
            parseFloat(start) + (diff * (1 - level));
        },

        calculateFibLevels: (fibo_1, fibo_2) => {
            const results = {};
            const isLong = parseFloat(fibo_1) > parseFloat(fibo_2);

            CONSTANTS.FIB_LEVELS.forEach(level => {
                results[level] = FibCalculator.calculateLevel(
                    parseFloat(fibo_1),
                    parseFloat(fibo_2),
                    level
                ).toFixed(10);
            });

            results.direction = isLong ? 'LONG' : 'SHORT';
            return results;
        },

        // New function for reverse trade calculations

    };

    // Trading Handler
    const TradingHandler = {
        calculatePositionSize: (entry, stoploss, riskUsdt) => {
            const riskPerCoin = Math.abs(parseFloat(entry) - parseFloat(stoploss));
            return (riskUsdt / riskPerCoin).toFixed(3);
        },

        setTradeDirection: (isLong) => {
            const selector = isLong ? SELECTORS.LONG_CHECKBOX : SELECTORS.SHORT_CHECKBOX;
            const checkbox = document.querySelector(selector);
            if (checkbox) {
                console.log(`Setting direction to ${isLong ? 'LONG' : 'SHORT'}`);
                checkbox.click();
            } else {
                console.error('Direction checkbox not found');
            }
        },

        executeNormalTrade: (inputs) => {
            const [fibo_1, fibo_2] = [inputs[1].value, inputs[3].value];
            const fibLevels = FibCalculator.calculateFibLevels(fibo_1, fibo_2);

            const entry = fibLevels[0.236];
            const stoploss = fibo_2;
            const takeprofit = fibLevels[0.786]
            const positionSize = TradingHandler.calculatePositionSize(entry, stoploss, CONSTANTS.RISK_USDT);

            Utils.logTradeDetails('Normal', {
                fibo_1,
                fibo_2,
                entry,
                takeprofit,
                stoploss,
                positionSize,
                direction: fibLevels.direction
            });
            Logger.log(`Executing Normal Trade:\n positionSize:${positionSize}`);
            TradingHandler.setTradeDirection(fibLevels.direction === 'LONG');

            Utils.modifyReactInput(SELECTORS.ENTRY_PRICE, entry);
            Utils.modifyReactInput(SELECTORS.TAKE_PROFIT, takeprofit);
            Utils.modifyReactInput(SELECTORS.STOP_LOSS, stoploss);
            Utils.modifyReactInput(SELECTORS.POSITION_SIZE, positionSize);
            const property = fibLevels.direction === 'LONG' ?'[data-testid="contract-trade-open-long-btn"]' : '[data-testid="contract-trade-open-short-btn"]'
            const btn = document.querySelector(property);
            if (btn) btn.click();



        },
        executeReverseTrade: (inputs) => {
            try {
                const [fibo_1, fibo_2] = [inputs[1].value, inputs[3].value];

                const fibLevels = FibCalculator.calculateFibLevels(fibo_1, fibo_2);
                let levels = {
                    entry: fibo_2, stoploss: fibLevels[0.236], takeprofit :fibLevels[-0.5]
                }
                console.log('Calculated Reverse Levels:', levels);

                const positionSize = TradingHandler.calculatePositionSize(
                    levels.entry,
                    levels.stoploss,
                    CONSTANTS.REVERSE_RISK_USDT
                );

                Utils.logTradeDetails('Reverse', {
                    ...levels,
                    positionSize
                });

                // Execute trade
                const isLong = levels.takeprofit > levels.entry
                TradingHandler.setTradeDirection(isLong);

                // Use setTimeout to ensure direction is set before modifying inputs
                setTimeout(() => {
                    Utils.modifyReactInput(SELECTORS.ENTRY_PRICE, levels.entry);

                    Utils.modifyReactInput(SELECTORS.STOP_LOSS, levels.stoploss);
                    Utils.modifyReactInput(SELECTORS.POSITION_SIZE, positionSize);
                    Utils.modifyReactInput(SELECTORS.TAKE_PROFIT, levels.takeprofit);
                    const property =isLong ?'[data-testid="contract-trade-open-long-btn"]' : '[data-testid="contract-trade-open-short-btn"]'
                    const btn = document.querySelector(property);
                    if (btn) btn.click();

                }, 1000);

            } catch (error) {
                console.error('Error in executeReverseTrade:', error);
            }
        }

    };

    // Button Handler
    const ButtonHandler = {
        createButton: (text, onClick, okButton) => {
            const buttonSpan = document.createElement('span');
            buttonSpan.className = 'submitButton-PQhX1JKt';

            const button = document.createElement('button');
            button.name = `${text.toLowerCase()}-trade`;
            button.className = okButton.className;

            const contentSpan = document.createElement('span');
            contentSpan.className = 'content-OvB35Th_';
            contentSpan.textContent = text;

            button.appendChild(contentSpan);
            buttonSpan.appendChild(button);

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`${text} button clicked`);
                onClick(e);
            });

            return buttonSpan;
        },

        processButtons: () => {
            const tvIframe = Utils.getTradingViewIframe();
            if (!tvIframe || !tvIframe.contentDocument) return;

            try {
                const inputs = Array.from(tvIframe.contentDocument.getElementsByTagName('input'));
                if (inputs.length !== 5) return;

                // Remove Cancel button if exists
                const cancelButton = Array.from(tvIframe.contentDocument.getElementsByTagName('button'))
                .find(button => button.textContent.trim().toLowerCase() === 'cancel');
                if (cancelButton) cancelButton.remove();

                // Find OK button
                const okButton = tvIframe.contentDocument.querySelector('button[data-name="submit-button"]');
                if (!okButton) return;

                // Add Trade button if not exists
                if (!tvIframe.contentDocument.querySelector('button[name="trade-trade"]')) {
                    const tradeButton = ButtonHandler.createButton('Trade', () => {
                        TradingHandler.executeNormalTrade(inputs);
                    }, okButton);
                    okButton.parentElement.after(tradeButton);
                }

                // Add Reverse button if not exists
                if (!tvIframe.contentDocument.querySelector('button[name="reverse-trade"]')) {
                    const reverseButton = ButtonHandler.createButton('Reverse', () => {
                        TradingHandler.executeReverseTrade(inputs);
                    }, okButton);
                    okButton.parentElement.parentElement.appendChild(reverseButton);
                }
            } catch (error) {
                console.error('Error processing buttons:', error);
            }
        },

        init: () => {
            setInterval(ButtonHandler.processButtons, CONSTANTS.CHECK_INTERVAL);
            console.log('Button handler initialized');
        }
    };

    // Initialize the script
    ButtonHandler.init();

    // Function to parse trade parameters from URL and execute trade
    function parseUrlAndExecuteTrade() {
        const urlParams = new URLSearchParams(window.location.search);

        // Check if all required parameters are present
        const requiredParams = ['type', 'direction', 'entry', 'stoploss', 'takeprofit', 'riskUsdt'];
        const missingParams = requiredParams.filter(param => !urlParams.get(param));

        if (missingParams.length > 0) {
            console.error('Missing URL parameters:', missingParams);
            return;
        }

        // Extract parameters
        const tradeParams = {
            type: urlParams.get('type'),
            direction: urlParams.get('direction').toUpperCase().replace("BUY","LONG"),
            entry: parseFloat(urlParams.get('entry')),
            stoploss: parseFloat(urlParams.get('stoploss'),4),
            takeprofit: parseFloat(urlParams.get('takeprofit'),4),
            riskUsdt: parseFloat(urlParams.get('riskUsdt'))
        };

        console.log('Parsed Trade Parameters:', tradeParams);

        // Function to find and interact with TradingView iframe
        function executeTrade() {
            const tvIframe = Utils.getTradingViewIframe();
            if (!tvIframe || !tvIframe.contentDocument) {
                console.error('TradingView iframe not found');
                return;
            }

            try {
                // Set trade direction
                const isLong = tradeParams.direction === 'LONG';
                TradingHandler.setTradeDirection(isLong);

                // Calculate position size
                const positionSize = TradingHandler.calculatePositionSize(
                    tradeParams.entry.toString(),
                    tradeParams.stoploss.toString(),
                    tradeParams.riskUsdt
                );
                console.log(`positionSize = ${positionSize}`);
                // Modify inputs
                setTimeout(() => {
                    Utils.modifyReactInput(SELECTORS.ENTRY_PRICE, tradeParams.entry.toString());
                    Utils.modifyReactInput(SELECTORS.STOP_LOSS, tradeParams.stoploss.toString());
                    Utils.modifyReactInput(SELECTORS.TAKE_PROFIT, tradeParams.takeprofit.toString());
                    Utils.modifyReactInput(SELECTORS.POSITION_SIZE, positionSize);

                    console.log('Trade parameters set successfully');
                }, 1000);

            } catch (error) {
                console.error('Error executing trade from URL:', error);
            }
        }

        // Add URL parsing initialization to existing script
        setTimeout(executeTrade, 10000); // Wait 10 seconds after page load
    }

    // Only run if trade parameters are present in URL
    if (window.location.search.includes('direction=')) {
        parseUrlAndExecuteTrade();
    }
})();


const clickButton = (property='[data-testid="contract-trade-open-long-btn"]') => {
    const button = document.querySelector(property);

    if (button) {
        try {
            button.click();
            return true;
        } catch (error) {
            console.error('Error clicking button:', error);
            return false;
        }
    } else {
        console.warn('Button not found');
        return false;
    }
};
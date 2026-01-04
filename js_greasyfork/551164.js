// ==UserScript==
// @name         FarmRPG Currency Doubler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Doubles Silver, Gold, and Ancient Coins when spending them
// @author       daris337
// @license      MIT
// @match        https://farmrpg.com/*
// @match        https://www.farmrpg.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/551164/FarmRPG%20Currency%20Doubler.user.js
// @updateURL https://update.greasyfork.org/scripts/551164/FarmRPG%20Currency%20Doubler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store original fetch function
    const originalFetch = window.fetch;
    
    // Store original XMLHttpRequest send function
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    // Function to intercept and modify requests
    function interceptCurrencyRequests() {
        // Intercept fetch requests
        window.fetch = async function(...args) {
            const url = args[0];
            const options = args[1] || {};
            
            // Check if this is a currency spending request
            if (options.body && typeof options.body === 'string') {
                try {
                    const bodyData = new URLSearchParams(options.body);
                    
                    // Check for currency parameters and double them
                    let modified = false;
                    const currencies = ['silver', 'gold', 'ac'];
                    
                    currencies.forEach(currency => {
                        if (bodyData.has(currency)) {
                            const currentValue = parseInt(bodyData.get(currency));
                            if (currentValue > 0) {
                                const doubledValue = currentValue * 2;
                                bodyData.set(currency, doubledValue.toString());
                                modified = true;
                                console.log(`Doubled ${currency} from ${currentValue} to ${doubledValue}`);
                            }
                        }
                    });
                    
                    if (modified) {
                        options.body = bodyData.toString();
                    }
                } catch (e) {
                    console.log('Error processing fetch body:', e);
                }
            }
            
            return originalFetch.apply(this, args);
        };
        
        // Intercept XMLHttpRequest requests
        XMLHttpRequest.prototype.send = function(body) {
            if (body && typeof body === 'string') {
                try {
                    const bodyData = new URLSearchParams(body);
                    let modified = false;
                    const currencies = ['silver', 'gold', 'ac'];
                    
                    currencies.forEach(currency => {
                        if (bodyData.has(currency)) {
                            const currentValue = parseInt(bodyData.get(currency));
                            if (currentValue > 0) {
                                const doubledValue = currentValue * 2;
                                bodyData.set(currency, doubledValue.toString());
                                modified = true;
                                console.log(`Doubled ${currency} from ${currentValue} to ${doubledValue}`);
                            }
                        }
                    });
                    
                    if (modified) {
                        body = bodyData.toString();
                    }
                } catch (e) {
                    console.log('Error processing XHR body:', e);
                }
            }
            
            return originalXHRSend.call(this, body);
        };
    }
    
    // Function to observe DOM for currency inputs and double their values
    function observeCurrencyInputs() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Look for currency input fields
                        const inputs = node.querySelectorAll ? node.querySelectorAll('input[name*="silver"], input[name*="gold"], input[name*="ac"]') : [];
                        
                        inputs.forEach(input => {
                            const currentValue = parseInt(input.value);
                            if (currentValue > 0 && !input.hasAttribute('data-doubled')) {
                                const doubledValue = currentValue * 2;
                                input.value = doubledValue;
                                input.setAttribute('data-doubled', 'true');
                                
                                // Trigger change event to update any dependent calculations
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                
                                console.log(`Doubled input ${input.name} from ${currentValue} to ${doubledValue}`);
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Wait for DOM to be ready and then start intercepting
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            interceptCurrencyRequests();
            observeCurrencyInputs();
        });
    } else {
        interceptCurrencyRequests();
        observeCurrencyInputs();
    }
    
    console.log('FarmRPG Currency Doubler loaded successfully!');
})();
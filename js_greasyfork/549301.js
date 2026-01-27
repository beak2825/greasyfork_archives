// ==UserScript==
// @name         DuckDuckGo AI
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Some auto clicks on DDG AI page
// @author       CKMz17
// @match        https://duckduckgo.com/?q=DuckDuckGo&ia=chat
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549301/DuckDuckGo%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/549301/DuckDuckGo%20AI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const existingElement = document.querySelector(selector);
            if (existingElement) {
                return resolve(existingElement);
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    clearTimeout(timer);
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms`));
            }, timeout);
        });
    }

    async function clickIfExists(selector, expectedText = null)
    {
        try
        {
            const element = await waitForElement(selector);
            if (!element) return;

            if (expectedText === null)
            {
            	if ((element.querySelector && element.querySelector('svg')) || (element.textContent && element.textContent.trim()))
                {
                    element.click();
                }
            }
            else if ((element.textContent || '').includes(expectedText))
            {
                element.click();
            }
            }
        catch (error)
        {
            console.log(`Error clicking on element with selector "${selector}": ${error.message}`);
        }
    }
    async function runAutomation() {
        try {
            await clickIfExists('button.ffON2NH02oMAcqyoh2UU.vcOFkrrvuSYp7xsAur2Y.dkPsZgoVlwHrgASCd797.VVwKmb7llplcxyVXzHz9', "Agree and Continue");
            await clickIfExists('button.XkSxBJ8ofSQsZmGZs6qx.ffON2NH02oMAcqyoh2UU.ffON2NH02oMAcqyoh2UU.vcOFkrrvuSYp7xsAur2Y', null);
            await clickIfExists('button.AHrsI58GK_lguBKwmM47.ffON2NH02oMAcqyoh2UU.J6kopNnJfLRnTk4tGjvG.ti6bNKm33LKnBm2IskyD', "4o-mini");
            const radioInput = await waitForElement('#gpt-5-mini');
            const label = radioInput.closest('li').querySelector('label');
            if (label && label.textContent.includes("GPT-5 mini")) {
                radioInput.click();
            }
            await clickIfExists('button.ffON2NH02oMAcqyoh2UU.vcOFkrrvuSYp7xsAur2Y.dkPsZgoVlwHrgASCd797.VVwKmb7llplcxyVXzHz9', "Start New Chat");
        } catch (error) {
            console.log("An error occurred during automation: " + error.message);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAutomation);
    } else {
        runAutomation();
    }
})();
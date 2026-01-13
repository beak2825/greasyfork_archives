// ==UserScript==
// @name         AliExpress Promo Code Automator (Left Side)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Repeatedly clicks the Apply button, syncs inputs, and auto-confirms "Yes I'm sure" dialogs.
// @author       Hegy
// @license      MIT
// @match        https://www.aliexpress.com/p/trade/confirm.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562389/AliExpress%20Promo%20Code%20Automator%20%28Left%20Side%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562389/AliExpress%20Promo%20Code%20Automator%20%28Left%20Side%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createUI() {
        // --- Main Container ---
        const container = document.createElement('div');

        // --- UPDATED POSITIONING ---
        container.style.position = 'fixed';
        container.style.top = '90px';
        container.style.left = '20px';
        container.style.zIndex = '999999';
        container.style.backgroundColor = '#ffffff';
        container.style.border = '2px solid #ff4747';
        container.style.borderRadius = '8px';
        container.style.padding = '15px';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '13px';
        container.style.width = '180px';

        // --- Helper to create labeled inputs ---
        function createLabeledInput(labelText, defaultValue, inputId, inputType = 'number') {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.justifyContent = 'space-between';
            wrapper.style.alignItems = 'center';

            const label = document.createElement('span');
            label.innerText = labelText;
            label.style.fontWeight = 'bold';
            label.style.color = '#333';
            label.style.fontSize = '12px';

            const input = document.createElement('input');
            input.type = inputType;
            input.value = defaultValue;
            input.id = inputId;
            input.style.width = inputType === 'number' ? '60px' : '90px';
            input.style.padding = '4px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '4px';
            input.style.textAlign = inputType === 'number' ? 'center' : 'left';

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            return { wrapper, input };
        }

        // 1. Promo Code Input
        const promoObj = createLabeledInput('Promo:', '', 'hegy-promo-code', 'text');
        container.appendChild(promoObj.wrapper);
        const promoInput = promoObj.input;

        // 2. Counter Input
        const counterObj = createLabeledInput('Count:', '1000', 'hegy-counter', 'number');
        container.appendChild(counterObj.wrapper);
        const counterInput = counterObj.input;

        // 3. Pause Input
        const pauseObj = createLabeledInput('Pause s:', '3', 'hegy-pause', 'number');
        container.appendChild(pauseObj.wrapper);
        const pauseInput = pauseObj.input;

        // 4. Action Button
        const applyBtn = document.createElement('button');
        applyBtn.innerText = 'Apply Code';
        applyBtn.style.backgroundColor = '#ff4747';
        applyBtn.style.color = 'white';
        applyBtn.style.border = 'none';
        applyBtn.style.padding = '8px';
        applyBtn.style.cursor = 'pointer';
        applyBtn.style.borderRadius = '4px';
        applyBtn.style.fontWeight = 'bold';
        applyBtn.style.marginTop = '5px';
        applyBtn.style.transition = 'background 0.2s';

        applyBtn.onmouseover = () => applyBtn.style.backgroundColor = '#d63b3b';
        applyBtn.onmouseout = () => applyBtn.style.backgroundColor = '#ff4747';

        container.appendChild(applyBtn);
        document.body.appendChild(container);

        // --- Logic ---
        let isRunning = false;
        let timerId = null;

        function setNativeValue(element, value) {
            const lastValue = element.value;
            element.value = value;
            const event = new Event('input', { bubbles: true });
            const tracker = element._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            element.dispatchEvent(event);
        }

        function getConfirmButton() {
            return document.evaluate(
                "//button[span[text()=\"Yes I'm sure\"]]",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
        }

        applyBtn.addEventListener('click', function() {
            if (isRunning) {
                stopLoop();
                return;
            }

            isRunning = true;
            applyBtn.innerText = 'Stop';
            applyBtn.style.backgroundColor = '#333';

            counterInput.disabled = true;
            pauseInput.disabled = true;
            promoInput.disabled = true;

            function clickLoop() {
                if (!isRunning) return;

                // Priority: Check for Confirmation Modal
                const confirmBtn = getConfirmButton();
                if (confirmBtn) {
                    console.log('Confirmation detected. Clicking "Yes I\'m sure"...');
                    confirmBtn.click();
                    timerId = setTimeout(clickLoop, 1000); // Wait 1s and retry loop
                    return;
                }

                let currentCount = parseInt(counterInput.value, 10);
                let pauseSeconds = parseFloat(pauseInput.value) || 0;
                let delayMs = pauseSeconds * 1000;
                if (delayMs < 100) delayMs = 100;

                if (currentCount > 0) {
                    const pageInput = document.querySelector('.pl-promoCode-input');
                    const pageBtn = document.querySelector('.pl-promoCode-input-button');

                    if (pageBtn && pageInput) {

                        // Sync Logic
                        const myPromoVal = promoInput.value.trim();
                        const pagePromoVal = pageInput.value.trim();

                        if (myPromoVal === '' && pagePromoVal !== '') {
                            promoInput.value = pagePromoVal;
                        } else if (myPromoVal !== '') {
                            if (pagePromoVal !== myPromoVal) {
                                setNativeValue(pageInput, myPromoVal);
                            }
                        }

                        // Click Apply
                        pageBtn.click();
                        console.log(`Clicked apply. Remaining: ${currentCount - 1}`);

                        counterInput.value = currentCount - 1;
                        timerId = setTimeout(clickLoop, delayMs);
                    } else {
                        console.warn('Elements not found.');
                        stopLoop();
                        alert('Promo Code section not found. Please expand it.');
                    }
                } else {
                    stopLoop();
                }
            }

            function stopLoop() {
                isRunning = false;
                clearTimeout(timerId);
                applyBtn.innerText = 'Apply Code';
                applyBtn.style.backgroundColor = '#ff4747';
                counterInput.disabled = false;
                pauseInput.disabled = false;
                promoInput.disabled = false;
            }

            clickLoop();
        });
    }

    setTimeout(createUI, 1500);

})();
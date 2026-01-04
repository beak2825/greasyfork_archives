// ==UserScript==
// @name         PixVerse Free Points Ultimate
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automatically claims free points by completing referral process
// @author       You
// @match        https://app.pixverse.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553213/PixVerse%20Free%20Points%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/553213/PixVerse%20Free%20Points%20Ultimate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REFERRAL_CODE = "Q72A9KT0";
    let currentStep = GM_getValue('currentStep', 0);
    let isScriptActive = GM_getValue('isScriptActive', true);
    let executionCount = 0;
    let checkInterval;
    let referralInputAttempts = 0;
    const MAX_REFERRAL_ATTEMPTS = 15;

    // Create simple control panel
    function createControlPanel() {
        if (document.getElementById('pixverse-control-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'pixverse-control-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1a1a1a;
            border: 2px solid #333;
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: white;
            min-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        panel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 5px;">
                PixVerse Free Points v3.0
            </div>
            <div style="margin-bottom: 10px;">
                Status: <span id="script-status">${isScriptActive ? 'ACTIVE' : 'PAUSED'}</span>
            </div>
            <div style="margin-bottom: 10px;">
                Step: <span id="current-step">${currentStep}/4</span>
            </div>
            <div style="margin-bottom: 10px;">
                Checks: <span id="execution-count">0</span>
            </div>
            <div style="margin-bottom: 10px;">
                Referral Attempts: <span id="referral-attempts">0/${MAX_REFERRAL_ATTEMPTS}</span>
            </div>
            <div style="margin-bottom: 10px; font-size: 10px;" id="current-method">Method: None</div>
            <button id="toggle-script" style="width: 100%; padding: 8px; margin-bottom: 8px; background: ${isScriptActive ? '#ff4444' : '#4CAF50'}; color: white; border: none; border-radius: 5px; cursor: pointer;">
                ${isScriptActive ? 'PAUSE' : 'START'}
            </button>
            <button id="reset-script" style="width: 100%; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                RESET
            </button>
            <div style="margin-top: 10px; font-size: 10px; color: #888;">
                Ultimate Input Methods
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('toggle-script').addEventListener('click', toggleScript);
        document.getElementById('reset-script').addEventListener('click', resetScript);

        // Make draggable
        makeDraggable(panel);
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = element.querySelector('div:first-child');
        
        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function updatePanel(methodName = '') {
        const statusEl = document.getElementById('script-status');
        const stepEl = document.getElementById('current-step');
        const countEl = document.getElementById('execution-count');
        const attemptsEl = document.getElementById('referral-attempts');
        const methodEl = document.getElementById('current-method');
        const toggleBtn = document.getElementById('toggle-script');

        if (statusEl) {
            statusEl.textContent = isScriptActive ? 'ACTIVE' : 'PAUSED';
            statusEl.style.color = isScriptActive ? '#4CAF50' : '#ff4444';
        }
        if (stepEl) stepEl.textContent = `${currentStep}/4`;
        if (countEl) countEl.textContent = executionCount;
        if (attemptsEl) attemptsEl.textContent = `${referralInputAttempts}/${MAX_REFERRAL_ATTEMPTS}`;
        if (methodEl) methodEl.textContent = `Method: ${methodName}`;
        if (toggleBtn) {
            toggleBtn.textContent = isScriptActive ? 'PAUSE' : 'START';
            toggleBtn.style.background = isScriptActive ? '#ff4444' : '#4CAF50';
        }
    }

    function toggleScript() {
        isScriptActive = !isScriptActive;
        GM_setValue('isScriptActive', isScriptActive);
        updatePanel();
        
        if (isScriptActive) {
            startChecking();
        } else {
            stopChecking();
        }
    }

    function resetScript() {
        currentStep = 0;
        executionCount = 0;
        referralInputAttempts = 0;
        GM_setValue('currentStep', 0);
        updatePanel();
        if (isScriptActive) {
            startChecking();
        }
    }

    function startChecking() {
        stopChecking();
        checkInterval = setInterval(mainWorker, 2000);
    }

    function stopChecking() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

    function findElement(selectors, textContent = null, elementType = null) {
        for (let selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (let el of elements) {
                if (isElementVisible(el)) {
                    if (!textContent || el.textContent.includes(textContent)) {
                        return el;
                    }
                }
            }
        }

        if (textContent) {
            const allElements = elementType ? document.querySelectorAll(elementType) : document.querySelectorAll('*');
            for (let el of allElements) {
                if (isElementVisible(el) && el.textContent.includes(textContent)) {
                    return el;
                }
            }
        }

        return null;
    }

    function isElementVisible(el) {
        return el && 
               el.offsetParent !== null && 
               el.getBoundingClientRect().width > 0 && 
               el.getBoundingClientRect().height > 0 &&
               el.style.display !== 'none' &&
               el.style.visibility !== 'hidden' &&
               el.style.opacity !== '0';
    }

    function clickElement(el) {
        if (el && isElementVisible(el)) {
            el.click();
            return true;
        }
        return false;
    }

    // Step 0: Find and click "Earn Credits"
    function step0() {
        console.log('Step 0: Looking for Earn Credits button...');
        
        const earnButtons = [
            findElement(['button'], 'Earn Credits', 'button'),
            findElement(['div', 'span', 'a'], 'Earn Credits'),
            document.querySelector('[class*="earn"]'),
            document.querySelector('[class*="credit"]'),
            document.querySelector('[class*="task"]')
        ];

        for (let button of earnButtons) {
            if (button && clickElement(button)) {
                console.log('✓ Earn Credits clicked');
                currentStep = 1;
                GM_setValue('currentStep', 1);
                return true;
            }
        }

        return false;
    }

    // Step 1: Find and click the LAST "Start" button at the BOTTOM of the page
    function step1() {
        console.log('Step 1: Looking for LAST Start button at the BOTTOM...');

        const allButtons = Array.from(document.querySelectorAll('button'));
        
        const startButtons = allButtons.filter(button => {
            if (!isElementVisible(button)) return false;
            
            const text = button.textContent.trim();
            return text === 'Start' || text === 'START' || text.includes('Start');
        });

        if (startButtons.length === 0) {
            console.log('No Start buttons found');
            return false;
        }

        console.log(`Found ${startButtons.length} Start buttons`);

        startButtons.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectB.bottom - rectA.bottom;
        });

        const lowestStartButton = startButtons[0];
        
        if (lowestStartButton) {
            console.log('Clicking the LOWEST Start button on the page');
            
            if (clickElement(lowestStartButton)) {
                console.log('✓ LAST Start button clicked (lowest on page)');
                currentStep = 2;
                GM_setValue('currentStep', 2);
                return true;
            }
        }

        return false;
    }

    // ========== INPUT METHODS ==========
    
    // Method 1: Direct property setting with all possible events
    function method1_directProperty(input) {
        console.log('🔄 Method 1: Direct property with all events');
        updatePanel('1: Direct Property');
        
        input.focus();
        input.value = REFERRAL_CODE;
        
        // Trigger every possible event
        const events = [
            'focus', 'click', 'input', 'change', 'keydown', 'keypress', 'keyup', 
            'blur', 'select', 'paste', 'cut', 'copy', 'compositionstart', 
            'compositionupdate', 'compositionend'
        ];
        
        events.forEach(eventType => {
            input.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
        });
        
        // Force React if detected
        const reactKeys = Object.keys(input).filter(key => key.startsWith('__react'));
        reactKeys.forEach(key => {
            const props = input[key];
            if (props && props.onChange) props.onChange({ target: input });
            if (props && props.onInput) props.onInput({ target: input });
        });
        
        return new Promise(resolve => {
            setTimeout(() => resolve(input.value === REFERRAL_CODE), 300);
        });
    }

    // Method 2: Native input value descriptor (bypass React)
    function method2_nativeDescriptor(input) {
        console.log('🔄 Method 2: Native value descriptor');
        updatePanel('2: Native Descriptor');
        
        const nativeInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        
        input.focus();
        input.select();
        
        if (nativeInputValue && nativeInputValue.set) {
            nativeInputValue.set.call(input, REFERRAL_CODE);
        } else {
            input.value = REFERRAL_CODE;
        }
        
        input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
        
        return new Promise(resolve => {
            setTimeout(() => resolve(input.value === REFERRAL_CODE), 300);
        });
    }

    // Method 3: Simulate actual keyboard typing
    function method3_keyboardTyping(input) {
        console.log('🔄 Method 3: Keyboard typing simulation');
        updatePanel('3: Keyboard Typing');
        
        return new Promise(resolve => {
            input.focus();
            input.value = '';
            
            let currentIndex = 0;
            
            function typeNextChar() {
                if (currentIndex < REFERRAL_CODE.length) {
                    const char = REFERRAL_CODE[currentIndex];
                    
                    // Simulate key events for this character
                    const keyEventOptions = { 
                        bubbles: true, 
                        cancelable: true, 
                        key: char, 
                        code: `Key${char.toUpperCase()}`,
                        charCode: char.charCodeAt(0),
                        keyCode: char.charCodeAt(0)
                    };
                    
                    input.dispatchEvent(new KeyboardEvent('keydown', keyEventOptions));
                    input.dispatchEvent(new KeyboardEvent('keypress', keyEventOptions));
                    
                    // Add the character
                    input.value += char;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    input.dispatchEvent(new KeyboardEvent('keyup', keyEventOptions));
                    
                    currentIndex++;
                    setTimeout(typeNextChar, 80 + Math.random() * 70);
                } else {
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true }));
                    setTimeout(() => resolve(input.value === REFERRAL_CODE), 200);
                }
            }
            
            typeNextChar();
        });
    }

    // Method 4: Clipboard paste simulation
    function method4_clipboardPaste(input) {
        console.log('🔄 Method 4: Clipboard paste simulation');
        updatePanel('4: Clipboard Paste');
        
        input.focus();
        input.select();
        
        // Simulate paste event with clipboard data
        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: new DataTransfer()
        });
        pasteEvent.clipboardData.setData('text/plain', REFERRAL_CODE);
        
        input.dispatchEvent(pasteEvent);
        input.value = REFERRAL_CODE;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        return new Promise(resolve => {
            setTimeout(() => resolve(input.value === REFERRAL_CODE), 300);
        });
    }

    // Method 5: Form submission approach
    function method5_formApproach(input) {
        console.log('🔄 Method 5: Form submission approach');
        updatePanel('5: Form Approach');
        
        // Find the form and set value
        const form = input.closest('form');
        input.value = REFERRAL_CODE;
        
        // Trigger all form-related events
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        if (form) {
            form.dispatchEvent(new Event('input', { bubbles: true }));
            form.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        return new Promise(resolve => {
            setTimeout(() => resolve(input.value === REFERRAL_CODE), 400);
        });
    }

    // Method 6: Mutation Observer approach
    function method6_mutationObserver(input) {
        console.log('🔄 Method 6: Mutation Observer approach');
        updatePanel('6: Mutation Observer');
        
        return new Promise(resolve => {
            let valueChanged = false;
            
            const observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                        valueChanged = true;
                    }
                }
            });
            
            observer.observe(input, { 
                attributes: true, 
                attributeFilter: ['value'],
                childList: false, 
                characterData: false 
            });
            
            input.focus();
            input.value = REFERRAL_CODE;
            
            // Multiple event triggers
            ['input', 'change', 'blur'].forEach(eventType => {
                input.dispatchEvent(new Event(eventType, { bubbles: true }));
            });
            
            setTimeout(() => {
                observer.disconnect();
                resolve(input.value === REFERRAL_CODE || valueChanged);
            }, 500);
        });
    }

    // Method 7: Set timeout repeated setting
    function method7_repeatedSetting(input) {
        console.log('🔄 Method 7: Repeated setting approach');
        updatePanel('7: Repeated Setting');
        
        return new Promise(resolve => {
            let attempts = 0;
            const maxAttempts = 5;
            
            function setValue() {
                input.focus();
                input.value = REFERRAL_CODE;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                
                attempts++;
                
                if (input.value === REFERRAL_CODE || attempts >= maxAttempts) {
                    resolve(input.value === REFERRAL_CODE);
                } else {
                    setTimeout(setValue, 100);
                }
            }
            
            setValue();
        });
    }

    // Method 8: Nuclear option - all methods combined
    function method8_nuclearOption(input) {
        console.log('🔄 Method 8: Nuclear option - ALL methods');
        updatePanel('8: Nuclear Option');
        
        return new Promise(resolve => {
            // Method 1
            input.value = REFERRAL_CODE;
            
            // Method 2  
            const nativeInputValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
            if (nativeInputValue && nativeInputValue.set) {
                nativeInputValue.set.call(input, REFERRAL_CODE);
            }
            
            // Method 3 - events
            ['focus', 'input', 'change', 'blur'].forEach(eventType => {
                input.dispatchEvent(new Event(eventType, { bubbles: true }));
            });
            
            // Method 4 - React
            const reactKeys = Object.keys(input).filter(key => key.startsWith('__react'));
            reactKeys.forEach(key => {
                const props = input[key];
                if (props && props.onChange) props.onChange({ target: input, currentTarget: input });
            });
            
            // Method 5 - wait and verify
            setTimeout(() => {
                if (input.value !== REFERRAL_CODE) {
                    // Last resort - set again
                    input.value = REFERRAL_CODE;
                }
                setTimeout(() => resolve(input.value === REFERRAL_CODE), 200);
            }, 300);
        });
    }

    // Step 2: Find referral input and try ALL methods
    async function step2() {
        console.log('Step 2: Looking for referral input...');

        if (referralInputAttempts >= MAX_REFERRAL_ATTEMPTS) {
            console.log('Max referral attempts reached, moving to confirm');
            currentStep = 3;
            GM_setValue('currentStep', 3);
            return true;
        }

        const inputSelectors = [
            'input[placeholder*="referral"]',
            'input[placeholder*="Referral"]',
            'input[placeholder*="code"]',
            'input[placeholder*="Code"]',
            'input[maxlength="8"]',
            'input[type="text"]',
            'input'
        ];

        let referralInput = null;
        for (let selector of inputSelectors) {
            const input = document.querySelector(selector);
            if (input && isElementVisible(input)) {
                referralInput = input;
                break;
            }
        }

        if (!referralInput) {
            console.log('No referral input found');
            referralInputAttempts++;
            updatePanel();
            return false;
        }

        console.log('✓ Referral input found');
        referralInputAttempts++;
        
        const methods = [
            method1_directProperty,
            method2_nativeDescriptor, 
            method3_keyboardTyping,
            method4_clipboardPaste,
            method5_formApproach,
            method6_mutationObserver,
            method7_repeatedSetting,
            method8_nuclearOption
        ];

        const methodIndex = (referralInputAttempts - 1) % methods.length;
        const method = methods[methodIndex];

        try {
            console.log(`Attempt ${referralInputAttempts}, Method ${methodIndex + 1}/8`);
            
            const success = await method(referralInput);
            
            console.log(`Method ${methodIndex + 1} result:`, success);
            console.log('Current input value:', referralInput.value);
            
            if (success) {
                console.log('🎉 SUCCESS! Referral code entered correctly');
                console.log('Final verification:', referralInput.value === REFERRAL_CODE);
                
                // Wait a bit and verify it sticks
                setTimeout(() => {
                    if (referralInput.value === REFERRAL_CODE) {
                        referralInputAttempts = 0;
                        currentStep = 3;
                        GM_setValue('currentStep', 3);
                        console.log('✓ Moving to confirm step');
                        updatePanel();
                    } else {
                        console.log('❌ Code disappeared after entry');
                    }
                }, 1000);
                
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.log('Method error:', error);
            return false;
        }
    }

    // Step 3: Find and click Confirm
    function step3() {
        console.log('Step 3: Looking for Confirm button...');

        const allButtons = Array.from(document.querySelectorAll('button'));
        
        const confirmButtons = allButtons.filter(button => {
            if (!isElementVisible(button)) return false;
            
            const text = button.textContent.trim();
            return text === 'Confirm' || text === 'CONFIRM' || text.includes('Confirm');
        });

        if (confirmButtons.length === 0) {
            console.log('No Confirm buttons found');
            return false;
        }

        console.log(`Found ${confirmButtons.length} Confirm buttons`);

        confirmButtons.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            return rectB.bottom - rectA.bottom;
        });

        const lowestConfirmButton = confirmButtons[0];
        
        if (lowestConfirmButton && clickElement(lowestConfirmButton)) {
            console.log('✓ LAST Confirm button clicked (lowest on page)');
            currentStep = 4;
            GM_setValue('currentStep', 4);
            return true;
        }

        return false;
    }

    async function mainWorker() {
        if (!isScriptActive) return;
        
        executionCount++;
        updatePanel();

        console.log(`=== Check #${executionCount}, Step ${currentStep} ===`);

        switch(currentStep) {
            case 0:
                step0();
                break;
            case 1:
                step1();
                break;
            case 2:
                await step2();
                break;
            case 3:
                step3();
                break;
            case 4:
                console.log('🎉 Script completed!');
                stopChecking();
                break;
        }

        if (executionCount > 150) {
            console.log('Safety limit reached, resetting...');
            resetScript();
        }
    }

    // Initialize
    function init() {
        console.log('PixVerse Free Points ULTIMATE script initialized');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(initializeScript, 2000);
            });
        } else {
            setTimeout(initializeScript, 2000);
        }
    }

    function initializeScript() {
        createControlPanel();
        updatePanel();
        
        if (isScriptActive) {
            startChecking();
        }

        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log('Page changed, resetting script...');
                setTimeout(() => {
                    currentStep = 0;
                    referralInputAttempts = 0;
                    GM_setValue('currentStep', 0);
                    executionCount = 0;
                    updatePanel();
                    if (isScriptActive) {
                        startChecking();
                    }
                }, 3000);
            }
        });

        observer.observe(document, { subtree: true, childList: true });
    }

    init();

})();
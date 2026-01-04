// ==UserScript==
// @name         GCN Training Auto-Navigation + Auto-Answer (Random Answers)
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Auto-navigate slides & auto-answer assessments in GCN Training with single-line debug overlay and random answer selection
// @author       Cole Mistretta
// @match        https://site.gcntraining.com/user-admin/dashboard.html
// @match        https://site.gcntraining.com/t*/*
// @license GNU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548653/GCN%20Training%20Auto-Navigation%20%2B%20Auto-Answer%20%28Random%20Answers%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548653/GCN%20Training%20Auto-Navigation%20%2B%20Auto-Answer%20%28Random%20Answers%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ///////////////////////
    // Debug Panel Setup //
    ///////////////////////
    const panel = document.createElement('div');
    panel.id = "gcn-debug-panel";
    panel.innerHTML = `<div id="gcn-debug-text">GCN Auto-Navigation started.</div>`;
    document.body.appendChild(panel);

    const styles = document.createElement('style');
    styles.textContent = `
      #gcn-debug-panel {
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 300px;
        background: rgba(0,0,0,0.85);
        color: #00ffcc;
        font-family: monospace;
        font-size: 12px;
        border-radius: 8px;
        padding: 8px;
        z-index: 99999;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,255,200,0.5);
      }
    `;
    document.head.appendChild(styles);

    function setDebug(text) {
        document.getElementById("gcn-debug-text").textContent = text;
        console.log(text);
    }

    //////////////////////////
    // Helper Functions     //
    //////////////////////////
    function clickNextStartButton() {
        // Check if we're on the dashboard
        if (!window.location.href.includes('dashboard.html')) {
            return false;
        }

        // FIRST PRIORITY: Look for Continue buttons (partially completed tutorials)
        const continueButtons = document.querySelectorAll('form.ud-continue button.ud-button');

        if (continueButtons.length > 0) {
            const firstContinueButton = continueButtons[0];
            const form = firstContinueButton.closest('form');
            const tutorialTitle = form ? form.querySelector('.tut-title')?.textContent : 'Unknown';

            setDebug(`Found ${continueButtons.length} tutorials to continue. Prioritizing: ${tutorialTitle}`);

            // Click the continue button
            firstContinueButton.click();

            return true;
        }

        // SECOND PRIORITY: Look for Start buttons (new tutorials) only if no Continue buttons
        const startButtons = document.querySelectorAll('form.ud-start button.ud-button');

        if (startButtons.length > 0) {
            const firstStartButton = startButtons[0];
            const form = firstStartButton.closest('form');
            const tutorialTitle = form ? form.querySelector('.tut-title')?.textContent : 'Unknown';

            setDebug(`No Continue buttons found. Found ${startButtons.length} tutorials to start. Starting: ${tutorialTitle}`);

            // Click the start button
            firstStartButton.click();

            return true;
        }

        setDebug("No Continue or Start buttons found on dashboard");
        return false;
    }

    function clickStartTutorialButton() {
        // Check if we're on a start page (pattern: /*/start)
        if (!window.location.pathname.endsWith('/start')) {
            return false;
        }

        // Look for the start tutorial button with multiple selector patterns
        const startTutorialSelectors = [
            'a.start-button img[alt="Start Tutorial"]',
            'a.start-button',
            'a[href*="/t"] img[alt="Start Tutorial"]',
            'a[href*="/t"]',
            '.start-button',
            'img[alt="Start Tutorial"]'
        ];

        let startButton = null;
        let usedSelector = "";

        for (const selector of startTutorialSelectors) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) { // Check if element is visible
                startButton = element;
                usedSelector = selector;
                break;
            }
        }

        if (startButton) {
            setDebug(`Start Tutorial button found with selector: ${usedSelector}, clicking...`);

            // If we found an img, click its parent link
            if (startButton.tagName === 'IMG') {
                const parentLink = startButton.closest('a');
                if (parentLink) {
                    parentLink.click();
                } else {
                    startButton.click();
                }
            } else {
                startButton.click();
            }

            setDebug("Start Tutorial button clicked, waiting for tutorial to load...");
            return true;
        }

        setDebug("Start Tutorial button not found on start page");
        return false;
    }

    function selectRandomAnswer() {
        // Try multiple selector patterns for radio buttons
        const selectorPatterns = [
            ".tut-slides-selectors input[type=radio][name='ans']",
            "input[type=radio][name='ans']",
            ".tut-slides-selectors input[type=radio]",
            "input[type=radio]"
        ];

        let answers = [];
        for (const pattern of selectorPatterns) {
            answers = document.querySelectorAll(pattern);
            if (answers.length > 0) {
                setDebug(`Found ${answers.length} answers using pattern: ${pattern}`);
                break;
            }
        }

        if (answers.length === 0) {
            setDebug("No radio button answers found");
            return false;
        }

        // Check if an answer is already selected
        const alreadySelected = Array.from(answers).find(answer => answer.checked);
        if (alreadySelected) {
            const answerLabel = alreadySelected.nextElementSibling?.textContent || alreadySelected.value;
            setDebug(`Answer already selected: ${answerLabel} (${alreadySelected.value})`);
            return true;
        }

        // Randomly select an answer - FORCE CLICK IT!
        const randomIndex = Math.floor(Math.random() * answers.length);
        const chosen = answers[randomIndex];

        // Get the answer label for better debugging
        const answerLabel = chosen.nextElementSibling?.textContent || chosen.value;

        setDebug(`Attempting to select answer: ${answerLabel} (${chosen.value})`);

        // FORCE the radio button selection using multiple aggressive methods
        try {
            // Method 1: Direct property setting
            chosen.checked = true;

            // Method 2: Focus and click
            chosen.focus();
            chosen.click();

            // Method 3: Simulate mouse events
            chosen.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            chosen.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            chosen.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            // Method 4: Form events
            chosen.dispatchEvent(new Event("change", { bubbles: true }));
            chosen.dispatchEvent(new Event("input", { bubbles: true }));

            // Method 5: Try clicking the label too
            const label = chosen.nextElementSibling;
            if (label && label.tagName === 'LABEL') {
                label.click();
            }

            // Verify the selection worked
            setTimeout(() => {
                if (chosen.checked) {
                    setDebug(`SUCCESS: Answer ${answerLabel} is now selected!`);
                } else {
                    setDebug(`FAILED: Answer ${answerLabel} was not selected - trying alternative method`);
                    // Try one more aggressive approach
                    const labelElement = document.querySelector(`label[for="${chosen.id}"]`);
                    if (labelElement) {
                        labelElement.click();
                        setDebug(`Tried clicking label for ${chosen.id}`);
                    }
                }
            }, 100);

            return true;
        } catch (error) {
            setDebug(`Error selecting answer: ${error.message}`);
            return false;
        }
    }

    //////////////////////////
    // Auto Navigation Core //
    //////////////////////////
    function tryAdvance() {
        // FIRST: Check if we're on dashboard and need to start a tutorial
        if (window.location.href.includes('dashboard.html')) {
            const startedTutorial = clickNextStartButton();
            if (startedTutorial) {
                setDebug("Started tutorial from dashboard, waiting for page load...");
                return;
            }
        }

        // SECOND: Check if we're on a start page and need to click Start Tutorial
        if (window.location.pathname.endsWith('/start')) {
            const clickedStartTutorial = clickStartTutorialButton();
            if (clickedStartTutorial) {
                setDebug("Clicked Start Tutorial button, waiting for tutorial to load...");
                return;
            }
        }

        // THIRD: Look for next button (highest priority for tutorial navigation)
        const nextBtnSelectors = [
            "span.tut-slides-next img.complete-tutorial", // Submit button at end
            "span.tut-slides-next img.next-active",
            "button.tut-slides-next img.next-active",
            "span.tut-slides-next",
            "button.tut-slides-next",
            ".tut-slides-next",
            "span[class*='next'] img.next-active",
            "button[class*='next'] img.next-active",
            "img.complete-tutorial", // Direct submit button
            "img.next-active",
            ".next-active",
            ".complete-tutorial"
        ];

        let nextBtn = null;
        let usedSelector = "";

        for (const selector of nextBtnSelectors) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) { // Check if element is visible
                nextBtn = element;
                usedSelector = selector;
                break;
            }
        }

        if (nextBtn) {
            // Special handling for submit/complete tutorial buttons
            const isSubmitButton = nextBtn.classList?.contains('complete-tutorial') ||
                                 nextBtn.alt === 'Submit' ||
                                 usedSelector.includes('complete-tutorial');

            if (isSubmitButton) {
                setDebug(`Submit/Complete button found with selector: ${usedSelector}, clicking with enhanced method...`);

                // Enhanced clicking for submit buttons
                try {
                    // Method 1: Direct click
                    nextBtn.click();

                    // Method 2: Parent click
                    const parent = nextBtn.closest('span, button');
                    if (parent) {
                        parent.click();
                    }

                    // Method 3: Mouse events
                    nextBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    nextBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    nextBtn.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                    // Method 4: Focus and click
                    if (parent) {
                        parent.focus();
                        parent.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    }

                    setDebug("Submit button clicked with multiple methods - tutorial should complete");
                } catch (error) {
                    setDebug(`Error clicking submit button: ${error.message}`);
                }
            } else {
                setDebug(`Next button found with selector: ${usedSelector}, clicking...`);

                // Regular next button handling
                if (nextBtn.tagName === 'IMG') {
                    const parent = nextBtn.closest('span, button');
                    if (parent) {
                        parent.click();
                    } else {
                        nextBtn.click();
                    }
                } else {
                    nextBtn.click();
                }
            }

            setTimeout(() => setDebug("Button clicked, waiting..."), 1000);
            return; // Exit early if we clicked next button
        }

        // FOURTH: Only check for questions if no next button was found
        const question = document.querySelector(".question-title");
        if (question) {
            setDebug("Question detected, no next button available yet");

            // IMMEDIATELY try to select an answer when we find a question
            const answerSelected = selectRandomAnswer();

            if (answerSelected) {
                // Now look for submit button after selecting answer
                const submitBtn = document.querySelector("button.submit-answer");

                if (!submitBtn) {
                    setDebug("Answer selected, but submit button not found, waiting...");
                    return;
                }

                if (submitBtn.disabled) {
                    setDebug("Answer selected, but submit button disabled, waiting...");
                    return;
                }

                setDebug("Answer selected, submitting in 1.5 seconds...");

                // Wait longer to ensure the selection is fully registered
                setTimeout(() => {
                    const currentSubmitBtn = document.querySelector("button.submit-answer");
                    if (currentSubmitBtn && !currentSubmitBtn.disabled) {
                        currentSubmitBtn.click();
                        setDebug("Answer submitted – waiting for next button to appear...");
                    } else {
                        setDebug("Submit button not available after selection, will retry...");
                    }
                }, 1500);
            } else {
                setDebug("Could not select answer, checking for other question types...");
            }
        } else {
            setDebug("No dashboard start buttons, no start tutorial button, no next button, no questions found - waiting...");
        }
    }

    //////////////////////////
    // Main Loop //
    //////////////////////////
    setDebug("GCN Auto-Navigation started.");
    setInterval(tryAdvance, 2000);

})();

// ==UserScript==
// @name         Mathswatch AutoSolver
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically fills and submits answers for Mathswatch questions using pre-stored answers (client-side only)
// @author       Anonymous
// @match        https://*.mathswatch.co.uk/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549065/Mathswatch%20AutoSolver.user.js
// @updateURL https://update.greasyfork.org/scripts/549065/Mathswatch%20AutoSolver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===========================
    // === Precomputed Answers ===
    // ===========================
    // Add questions exactly as they appear on Mathswatch.
    const answers = {
        "1+1": "2",
        "2*2": "4",
        "5-3": "2"
        // Add more questions here
    };

    // ===========================
    // === Main Function ===
    // ===========================
    function autoFillAndSubmit() {
        // Detect the input field for the answer
        const inputField = document.querySelector('input[type="text"]');
        if (!inputField) return;

        // Detect the question text element
        const questionElement = document.querySelector('.question, .question-text');
        if (!questionElement) return;

        const questionText = questionElement.innerText.trim();

        // Fill in the answer if available
        if (answers[questionText]) {
            if (inputField.value !== answers[questionText]) {
                inputField.value = answers[questionText];
                console.log(`[AutoSolver] Filled answer for: "${questionText}"`);

                // Attempt to auto-submit
                const submitButton = document.querySelector('button[type="submit"], .submit-button');
                if (submitButton) {
                    submitButton.click();
                    console.log(`[AutoSolver] Submitted answer for: "${questionText}"`);
                }
            }
        }
    }

    // ===========================
    // === Continuous Monitoring ===
    // ===========================
    // Check every 500ms for new questions
    setInterval(autoFillAndSubmit, 500);

})();

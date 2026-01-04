// ==UserScript==
// @name         Auto Fill Fudan Course Evaluation Questionnaire
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically fills the questionnaire with "Strongly Agree" for most questions, "Strongly Disagree" for reverse-scored ones, "无" for open-ended, and first option for the last dynamic question.
// @author       Grok
// @match        https://ce.fudan.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555081/Auto%20Fill%20Fudan%20Course%20Evaluation%20Questionnaire.user.js
// @updateURL https://update.greasyfork.org/scripts/555081/Auto%20Fill%20Fudan%20Course%20Evaluation%20Questionnaire.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoFill() {
        // Check if the form is loaded by looking for the submit button or questions
        const submitButton = document.querySelector('.index__submit--jiKIA');
        if (!submitButton) {
            // If not loaded, retry after 1 second
            setTimeout(autoFill, 1000);
            return;
        }

        // Get all question containers
        const questions = document.querySelectorAll('.index__subjectItem--XWS1b');

        questions.forEach((question, idx) => {
            // Get the question title text to identify reverse-scored
            const titleElem = question.querySelector('.index__title--aRIbI');
            if (!titleElem) return;

            const titleText = titleElem.innerText.trim();

            // Handle radio buttons (Likert scales)
            const radios = question.querySelectorAll('input[type="radio"]');
            if (radios.length > 0) {
                if (titleText.includes('反向评分')) {
                    // Select the last option (Strongly Disagree) for reverse-scored
                    radios[radios.length - 1].click();
                } else {
                    // Select the first option (Strongly Agree or equivalent) for others
                    radios[0].click();
                }
            }

            // Handle open-ended textareas (fill with "无")
            const textareas = question.querySelectorAll('textarea');
            textareas.forEach(ta => {
                ta.value = '无';
            });
        });

        // Handle the last dynamic multi-select question (checkboxes)
        const checkboxes = document.querySelectorAll('.ant-checkbox-input');
        if (checkboxes.length > 0) {
            // Select the first checkbox
            checkboxes[0].click();

            // Wait briefly for any conditional textarea to appear and fill it
            setTimeout(() => {
                const allTextareas = document.querySelectorAll('textarea');
                if (allTextareas.length > 0) {
                    // Fill the last one or any new one with "无"
                    allTextareas.forEach(ta => {
                        if (ta.value === '') ta.value = '无';
                    });
                }
            }, 500);  // Short delay to allow DOM update
        }

        // Optional: Auto-submit if desired (uncomment if needed)
        // submitButton.click();
    }

    // Run the function after page load, and retry if needed
    window.addEventListener('load', () => {
        setTimeout(autoFill, 2000);  // Initial delay for React to render
    });
})();
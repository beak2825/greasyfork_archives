// ==UserScript==
// @name         Focus on Force Exam Keyboard Controls
// @namespace    https://focusonforce.com/
// @version      1.0
// @description  Configurable keyboard shortcuts for answering questions and navigating Topic Exams on Focus on Force
// @match        https://focusonforce.com/exams/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561298/Focus%20on%20Force%20Exam%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/561298/Focus%20on%20Force%20Exam%20Keyboard%20Controls.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const KEY_CONFIG = { // Maping button or answer number to Keyboard's key
        CHECK: ['Enter', ' '], // Check button
        FINISH: ['\\'], // Finish button

        ANSWER_1: ['1', 'u'],
        ANSWER_2: ['2', 'i'],
        ANSWER_3: ['3', 'o'],
        ANSWER_4: ['4', 'p'],
        ANSWER_5: ['5', '['],
        ANSWER_6: ['6', ']']
    };

    const KEY_TO_ACTION = Object.entries(KEY_CONFIG).reduce((acc, [action, keys]) => {
        keys.forEach(key => acc[key] = action);
        return acc;
    }, {});

    document.addEventListener('keydown', function (e) {
        const action = KEY_TO_ACTION[e.key];
        if (!action) return;

        // CHECK
        if (action === 'CHECK') {
            const checkButton = document.querySelector(
                'input.wdm_validate[name="wdm_validate"]'
            );
            if (checkButton && !checkButton.disabled) {
                checkButton.click();
            }
            return;
        }

        // FINISH
        if (action === 'FINISH') {
            const finishButton = document.querySelector(
                'input.wpProQuiz_button[name="endQuizSummary"]'
            );
            if (finishButton) {
                const parent = finishButton.closest('div.wpProQuiz_checkPage');
                if (parent && getComputedStyle(parent).display !== 'none') {
                    finishButton.click();
                }
            }
            return;
        }

        // ANSWER_X
        if (action.startsWith('ANSWER_')) {
            const answerIndex = parseInt(action.split('_')[1], 10) - 1;

            //Without the filter, it will answer ALL question at once
            const visibleQuestions = Array.from(
                document.querySelectorAll('li.wpProQuiz_listItem')
            ).filter(li => getComputedStyle(li).display !== 'none');

            visibleQuestions.forEach(li => {
                const options = li.querySelectorAll(
                    '.wpProQuiz_questionListItem input:not([disabled])'
                );
                if (answerIndex < options.length) {
                    options[answerIndex].click();
                }
            });
        }
    });

})();

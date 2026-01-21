// ==UserScript==
// @name         TTRS Auto Answer (Template)
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  Automatically selects answers on TTRS-style quizzes
// @author       You
// @match        *://*.ttrs.example.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Delay so the page can load fully
    setTimeout(() => {
        autoAnswer();
    }, 1000);

    function autoAnswer() {
        console.log('[AutoAnswer] Running...');

        /*
         EXAMPLES — ONLY ONE SHOULD BE USED
         Uncomment the one that matches what you see in DevTools
        */

        // 1. Correct answer has a class like "correct"
        // const correct = document.querySelector('.correct');

        // 2. Correct answer uses data attribute
        // const correct = document.querySelector('[data-correct="true"]');

        // 3. Radio button already marked internally
        // const correct = document.querySelector('input[type="radio"][value="correct"]');

        // 4. Green-colored answer
        // const answers = [...document.querySelectorAll('.answer')];
        // const correct = answers.find(a =>
        //     getComputedStyle(a).color === 'rgb(0, 128, 0)'
        // );

        if (!correct) {
            console.log('[AutoAnswer] No correct answer found');
            return;
        }

        correct.click();
        console.log('[AutoAnswer] Answer clicked');

        // Optional: auto-submit
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.click();
            console.log('[AutoAnswer] Submitted');
        }
    }
})();

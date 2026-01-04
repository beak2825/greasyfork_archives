// ==UserScript==
// @name         zyBooks Auto Show Answers
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Automatically clicks all "Show answer" buttons on zyBooks chapter pages
// @author       GooglyBlox
// @match        https://learn.zybooks.com/zybook/*/chapter/*/section/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552590/zyBooks%20Auto%20Show%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/552590/zyBooks%20Auto%20Show%20Answers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickShowAnswerButtons() {
        const buttons = document.querySelectorAll('button.show-answer-button');

        if (buttons.length === 0) {
            return;
        }

        let index = 0;

        function clickNext() {
            if (index < buttons.length) {
                const button = buttons[index];
                if (button.offsetParent !== null) {
                    button.click();
                    setTimeout(() => {
                        button.click();
                    }, 300);
                }
                index++;
                setTimeout(clickNext, 600);
            }
        }

        clickNext();
    }

    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                const hasShowAnswerButton = Array.from(mutation.addedNodes).some(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        return node.querySelector && node.querySelector('button.show-answer-button');
                    }
                    return false;
                });

                if (hasShowAnswerButton) {
                    clickShowAnswerButtons();
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', clickShowAnswerButtons);
    } else {
        clickShowAnswerButtons();
    }
})();
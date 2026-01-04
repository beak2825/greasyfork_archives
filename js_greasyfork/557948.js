// ==UserScript==
// @name         Rosiminc Nonogram Cafe Timer
// @namespace    https://github.com/palharesf/
// @version      1.0
// @description  Add a timer to RosimInc's Nonogram Café
// @author       palharesf
// @license      MIT
// @match        https://rosiminc.github.io/sg-nonograms/*
// @grant        none
//
// Changelog:
// v1.0 - Initial release
// @downloadURL https://update.greasyfork.org/scripts/557948/Rosiminc%20Nonogram%20Cafe%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/557948/Rosiminc%20Nonogram%20Cafe%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timerInterval = null;
    let startTime = null;
    let elapsedTime = 0;
    let timerStarted = false;

    // Create timer element
    const timerDiv = document.createElement('div');
    timerDiv.id = 'nonogram-timer';
    // Get the page background color
    const bgColor = window.getComputedStyle(document.body).backgroundColor;
    
    // Wait for buttons to load and copy their styles
    function applyButtonStyles() {
        const undoButton = document.querySelector('button');
        if (undoButton) {
            const buttonStyles = window.getComputedStyle(undoButton);
            timerDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: ${bgColor};
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-family: ${buttonStyles.fontFamily};
                font-size: 24px;
                font-weight: ${buttonStyles.fontWeight};
                z-index: 10000;
                user-select: none;
            `;
        }
    }
    
    // Apply styles immediately and also after a short delay
    applyButtonStyles();
    setTimeout(applyButtonStyles, 500);
    timerDiv.textContent = '00:00';
    document.body.appendChild(timerDiv);

    // Time formatting function
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Timer update function
    function updateTimer() {
        elapsedTime = Date.now() - startTime;
        timerDiv.textContent = formatTime(elapsedTime);
    }

    // Timer start/stop functions
    function startTimer() {
        if (!timerStarted) {
            timerStarted = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 100);
        }
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    // Listen for clicks on the canvas (game board)
    document.addEventListener('click', function(e) {
        // Check if click is on canvas element (the game board)
        if (e.target.tagName === 'CANVAS' && !timerStarted) {
            startTimer();
        }
    }, true);

    // Monitor for completion (msgDiv visibility)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.id === 'msgDiv' || (node.nodeType === 1 && node.querySelector && node.querySelector('#msgDiv'))) {
                    const msgDiv = node.id === 'msgDiv' ? node : node.querySelector('#msgDiv');
                    if (msgDiv && msgDiv.style.display !== 'none') {
                        stopTimer();
                    }
                }
            });
            
            if (mutation.type === 'attributes' && mutation.target.id === 'msgDiv') {
                const msgDiv = mutation.target;
                if (msgDiv.style.display !== 'none' && window.getComputedStyle(msgDiv).display !== 'none') {
                    stopTimer();
                }
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Check if msgDiv already exists on page load
    setTimeout(() => {
        const msgDiv = document.getElementById('msgDiv');
        if (msgDiv && window.getComputedStyle(msgDiv).display !== 'none') {
            stopTimer();
        }
    }, 500);
})();
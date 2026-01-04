// ==UserScript==
// @name         check how long ur alive for
// @namespace    http://tampermonkey.net/
// @version      6.7
// @description  simply check how long your alive for (without having to die)
// @author       11nm1 on discord
// @match        *://arras.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554628/check%20how%20long%20ur%20alive%20for.user.js
// @updateURL https://update.greasyfork.org/scripts/554628/check%20how%20long%20ur%20alive%20for.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timerInterval = null;
    let startTime = null;
    let timerElement = null;

    function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    function createTimerUI() {
        if (timerElement && document.body.contains(timerElement)) {
            return;
        }
        timerElement = document.createElement('div');
        timerElement.id = 'arras-connection-timer';
        Object.assign(timerElement.style, {
            position: 'fixed',
            bottom: '20px',
            right: '220px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ffffff',
            padding: '10px 15px',
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            fontWeight: 'bold',
            zIndex: '9999',
            textAlign: 'center',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        });

        const titleElement = document.createElement('div');
        titleElement.textContent = 'Alive:';
        titleElement.style.fontSize = '12px';
        titleElement.style.marginBottom = '5px';
        titleElement.style.opacity = '0.8';
        timerElement.appendChild(titleElement);

        const timeDisplay = document.createElement('div');
        timeDisplay.id = 'timer-display';
        timerElement.appendChild(timeDisplay);

        document.body.appendChild(timerElement);
    }

    function startTimer() {
        if (timerInterval) return;
        startTime = Date.now();
        createTimerUI();

        timerInterval = setInterval(() => {
            if (timerElement && document.body.contains(timerElement)) {
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                const display = document.getElementById('timer-display');
                if (display) {
                    display.textContent = formatTime(elapsedSeconds);
                }
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }, 1000);
    }

    function stopAndResetTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (timerElement && document.body.contains(timerElement)) {
            document.body.removeChild(timerElement);
        }
        timerElement = null;
        startTime = null;
    }

    const ctxProto = CanvasRenderingContext2D.prototype;
    const originalStrokeText = ctxProto.strokeText;
    const originalFillText = ctxProto.fillText;

    function createHook(originalFunc) {
        return function(text, ...args) {
            if (typeof text === "string") {
                if (text.includes('You have spawned! Welcome to the game.')) {
                    if (!timerInterval) {
                        startTimer();
                    }
                } else if (text.includes('Your Score:')) {
                    if (timerInterval) {
                        stopAndResetTimer();
                    }
                }
            }
            return originalFunc.apply(this, [text, ...args]);
        };
    }

    ctxProto.strokeText = createHook(originalStrokeText);
    ctxProto.fillText = createHook(originalFillText);

})();
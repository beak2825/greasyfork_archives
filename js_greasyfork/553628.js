// ==UserScript==
// @name         Reboxlinks skipper Auto-Clicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto skip
// @author       Shiva
// @match        *://reboxlinks.xyz/*
// @match        *://*.reboxlinks.xyz/*
// @match        *://marathivacancy.com/*
// @match        *://*.marathivacancy.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/553628/Reboxlinks%20skipper%20Auto-Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/553628/Reboxlinks%20skipper%20Auto-Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== TIMEHOOKER-STYLE TIMER MANIPULATION ====================

    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    const originalSetInterval = win.setInterval;
    win.setInterval = function(callback, delay, ...args) {
        const newDelay = Math.min(delay, 50);  // Even faster - 50ms max
        return originalSetInterval.call(win, callback, newDelay, ...args);
    };

    const originalSetTimeout = win.setTimeout;
    win.setTimeout = function(callback, delay, ...args) {
        const newDelay = Math.min(delay, 50);  // Even faster - 50ms max
        return originalSetTimeout.call(win, callback, newDelay, ...args);
    };

    const originalDateNow = Date.now;
    let timeOffset = 0;
    Date.now = function() {
        return originalDateNow() + timeOffset;
    };

    setInterval(() => {
        timeOffset += 950;  // 20x speed
    }, 50);

    // ==================== AUTO-CLICKER LOGIC ====================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAutoClicker);
    } else {
        setTimeout(initAutoClicker, 100);
    }

    function initAutoClicker() {
        const CONFIG = {
            checkInterval: 100,    // Check every 100ms - FAST
            clickDelay: 0,         // NO DELAY - INSTANT CLICK
            maxWaitTime: 120000,
            showLogs: false,
            enableTimerBypass: true
        };

        let processedButtons = [];
        let intervalId = null;
        let isScriptStopped = false;
        let isOnStep4 = false;
        let tp98TimerFinished = false;
        const currentSite = window.location.hostname;

        function logClick(buttonText) {
            console.log(`%c✓ ${buttonText}`, 'color: #4CAF50; font-weight: bold; font-size: 13px');
        }

        function checkTP98TimerFinished() {
            try {
                const tpText = document.getElementById('tp-text');
                if (tpText) {
                    const text = (tpText.textContent || tpText.innerText || '').toLowerCase();
                    const style = window.getComputedStyle(tpText);
                    if (text.includes('you may continue') && style.display !== 'none') {
                        return true;
                    }
                }

                const tp98Link = document.getElementById('tp98');
                if (tp98Link) {
                    const style = window.getComputedStyle(tp98Link);
                    if (style.display === 'block') {
                        const button = tp98Link.querySelector('button.tp-btn.tp-blue');
                        if (button) {
                            const btnStyle = button.style.pointerEvents || 'auto';
                            if (btnStyle === 'auto') {
                                return true;
                            }
                        }
                    }
                }
            } catch (e) {
                // Silently fail
            }
            return false;
        }

        function checkForStep4() {
            try {
                const pageText = document.body?.innerText || document.body?.textContent || '';

                const step4Patterns = [
                    /step\s*4\s*\/\s*4/i,
                    /step\s*4\s*of\s*4/i,
                    /You are currently on step 4\/4/i,
                    /You are currently on step 4 of 4/i
                ];

                for (let pattern of step4Patterns) {
                    if (pattern.test(pageText)) return true;
                }

                const stepElements = document.querySelectorAll('[class*="step"], [id*="step"], .progress, .stepper');
                for (let el of stepElements) {
                    const text = el.textContent || el.innerText || '';
                    for (let pattern of step4Patterns) {
                        if (pattern.test(text)) return true;
                    }
                }
            } catch (e) {
                // Silently fail
            }
            return false;
        }

        function stopScript(reason = 'Completed') {
            if (isScriptStopped) return;

            isScriptStopped = true;

            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            updateBadge('stopped', reason);
        }

        function wasProcessed(button) {
            return processedButtons.some(b => b === button);
        }

        function markProcessed(button) {
            processedButtons.push(button);
        }

        function isInsideTP98Link(button) {
            try {
                let parent = button.parentElement;
                while (parent) {
                    if (parent.id === 'tp98' && parent.tagName === 'A') {
                        return true;
                    }
                    parent = parent.parentElement;
                }
            } catch (e) {
                // Silently fail
            }
            return false;
        }

        function enableButton(button) {
            if (!button) return;

            try {
                button.disabled = false;
                button.removeAttribute('disabled');
                button.style.pointerEvents = 'auto';
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                button.classList.remove('disabled');
            } catch (e) {
                // Silently fail
            }
        }

        function isVisible(button) {
            if (!button) return false;

            try {
                const rect = button.getBoundingClientRect();
                const style = window.getComputedStyle(button);
                return (
                    rect.width > 0 &&
                    rect.height > 0 &&
                    style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    style.opacity !== '0'
                );
            } catch (e) {
                return false;
            }
        }

        function tryClick(button, name) {
            if (!button || wasProcessed(button) || isScriptStopped) return false;

            try {
                // Smart tp98 handling
                if (isInsideTP98Link(button)) {
                    if (!tp98TimerFinished) {
                        return false;
                    }
                }

                // Skip Continue on step 4/4
                if (isOnStep4) {
                    const text = button.textContent.toLowerCase().trim();
                    if (text === 'continue' || text.includes('continue')) {
                        markProcessed(button);
                        return false;
                    }
                }

                if (!isVisible(button)) {
                    return false;
                }

                const text = button.textContent.trim();
                enableButton(button);

                // INSTANT CLICK - NO DELAY
                try {
                    button.click();

                    try {
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        button.dispatchEvent(clickEvent);
                    } catch (e) {
                        // Silently fail
                    }

                    markProcessed(button);
                    logClick(text);
                } catch(e) {
                    // Silently fail
                }

                return true;
            } catch (e) {
                return false;
            }
        }

        function speedUpTimers() {
            if (!CONFIG.enableTimerBypass || isOnStep4) {
                return;
            }

            try {
                const timerElements = document.querySelectorAll(
                    '[id*="timer"], [class*="timer"], [id*="countdown"], [class*="countdown"], ' +
                    '[id*="wait"], [class*="wait"], .time, #time'
                );

                timerElements.forEach(el => {
                    try {
                        const text = el.textContent || '';
                        if (text.match(/\d+/)) {
                            el.textContent = '0';  // Set to 0 instantly
                            el.style.opacity = '0';
                            el.style.pointerEvents = 'none';
                        }
                    } catch (e) {
                        // Silently fail
                    }
                });
            } catch (e) {
                // Silently fail
            }
        }

        function checkForButtons() {
            try {
                const wasTP98Finished = tp98TimerFinished;
                tp98TimerFinished = checkTP98TimerFinished();

                const wasOnStep4 = isOnStep4;
                isOnStep4 = checkForStep4();

                if (isOnStep4 && !wasOnStep4) {
                    updateBadge('step4');
                }

                if (isScriptStopped) return;

                speedUpTimers();

                const allButtons = document.querySelectorAll('button, input[type="button"], input[type="submit"]');
                allButtons.forEach(btn => {
                    enableButton(btn);
                });

                // Priority checks - INSTANT
                const btn6 = document.getElementById('btn6');
                if (btn6 && !wasProcessed(btn6)) {
                    if (tryClick(btn6, 'btn6')) return;
                }

                const tpButtons = document.querySelectorAll('button.tp-btn:not(.processed)');
                for (let btn of tpButtons) {
                    if (!wasProcessed(btn)) {
                        if (tryClick(btn, 'tp-btn')) return;
                    }
                }

                const tpBlueButtons = document.querySelectorAll('button.tp-blue:not(.processed)');
                for (let btn of tpBlueButtons) {
                    if (!wasProcessed(btn)) {
                        if (tryClick(btn, 'tp-blue')) return;
                    }
                }

                for (let btn of allButtons) {
                    const text = btn.textContent?.toLowerCase().trim() || '';

                    if ((text.includes('continue') ||
                         text.includes('get link') ||
                         text.includes('unlock') ||
                         text.includes('proceed') ||
                         text.includes('verify') ||
                         text.includes('next')) &&
                        !wasProcessed(btn)) {

                        if (tryClick(btn, 'action-btn')) return;
                    }
                }
            } catch (e) {
                // Silently fail
            }
        }

        function updateBadge(state = 'running', reason = '') {
            try {
                const badge = document.getElementById('auto-clicker-badge');
                if (!badge) return;

                let bgColor, text;

                switch(state) {
                    case 'running':
                        bgColor = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        text = `⚡ ${processedButtons.length}`;
                        break;
                    case 'step4':
                        bgColor = '#FF9800';
                        text = '⚠️ Step 4/4';
                        break;
                    case 'stopped':
                        bgColor = '#F44336';
                        text = `🛑`;
                        break;
                    case 'complete':
                        bgColor = '#4CAF50';
                        text = `✓`;
                        break;
                }

                badge.innerHTML = `
                    <div style="
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        background: ${bgColor};
                        color: white;
                        padding: 8px 14px;
                        border-radius: 20px;
                        font-family: 'Segoe UI', Arial, sans-serif;
                        font-size: 11px;
                        font-weight: 600;
                        z-index: 9999999;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    ">
                        ${text}
                    </div>
                `;
            } catch (e) {
                // Silently fail
            }
        }

        function createIndicator() {
            try {
                const existing = document.getElementById('auto-clicker-badge');
                if (existing) existing.remove();

                const indicator = document.createElement('div');
                indicator.id = 'auto-clicker-badge';
                document.body.appendChild(indicator);

                updateBadge('running');
            } catch (e) {
                setTimeout(createIndicator, 500);
            }
        }

        function start() {
            if (checkForStep4()) {
                isOnStep4 = true;
            }

            setTimeout(createIndicator, 500);

            setTimeout(() => {
                checkForButtons();
                if (!isOnStep4) updateBadge('running');

                intervalId = setInterval(() => {
                    checkForButtons();
                    if (!isOnStep4 && !isScriptStopped) updateBadge('running');
                }, CONFIG.checkInterval);  // Checks every 100ms now

                setTimeout(() => {
                    if (!isScriptStopped) {
                        stopScript('Time limit');
                        updateBadge('complete');
                    }
                }, CONFIG.maxWaitTime);

            }, 500);  // Reduced startup delay
        }

        if (document.readyState === 'complete') {
            start();
        } else {
            window.addEventListener('load', start);
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !isScriptStopped) {
                checkForButtons();
            }
        });
    }

})();

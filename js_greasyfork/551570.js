// ==UserScript==
// @name         Parimango Task Timer (Blink Background Negative)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @author       Mostofa Tanim Anik
// @description  20s countdown with styled preview, resets on task change, background blinks when negative. Developed by Mostofa Tanim Anik
// @match        https://www.parimango.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551570/Parimango%20Task%20Timer%20%28Blink%20Background%20Negative%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551570/Parimango%20Task%20Timer%20%28Blink%20Background%20Negative%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let countdown = 30;
    let intervalId = null;
    let lastTaskNumber = null;
    let debounceTimeout = null;
    const POLL_MS = 1000;
    const OBS_DEBOUNCE_MS = 200;

    function createTimerElement() {
        let el = document.getElementById('tm-task-timer');
        if (el) return el;

        el = document.createElement('div');
        el.id = 'tm-task-timer';
        Object.assign(el.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: '#111',
            color: '#fff',
            fontSize: '18px',
            fontWeight: '600',
            padding: '6px 10px',
            borderRadius: '2px',
            zIndex: '2147483647',
         //   boxShadow: '0 3px 10px rgba(0,0,0,.5)',
            fontFamily: 'monospace',
            textAlign: 'center',
            minWidth: '120px',
            transition: 'background 0.3s ease'
        });
        document.body.appendChild(el);
        return el;
    }

    function updateTimerUI() {
        const el = createTimerElement();
        el.textContent = `⏱ ${countdown}s`;

        if (countdown >= 8) {
            el.style.background = '#111';
            el.style.color = 'lime';
            el.style.animation = '';
        } else if (countdown >= 0 && countdown < 8) {
            el.style.background = '#222';
            el.style.color = 'orange';
            el.style.animation = '';
        } else {
            el.style.color = '#fff';
            el.style.animation = 'tmBlinkBg 1s infinite';
        }
    }

    // background blinking animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tmBlinkBg {
            0% { background: #800; }
            50% { background: #f00; }
            100% { background: #800; }
        }
    `;
    document.head.appendChild(style);

    function startTimerOnce() {
        if (intervalId) return;
        updateTimerUI();
        intervalId = setInterval(() => {
            countdown--;
            updateTimerUI();
        }, 1000);
    }

    function resetTimerToDefault() {
        countdown = 30;
        updateTimerUI();
        if (!intervalId) startTimerOnce();
    }

    function findTasksBadgeNode() {
        const xpath = "//*[contains(normalize-space(.), 'Tasks Completed:')]";
        const res = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return res.singleNodeValue || null;
    }

    function readTasksCompletedNumber() {
        const node = findTasksBadgeNode();
        if (!node) return null;
        const txt = node.textContent || '';
        const m = txt.match(/Tasks\s*Completed\s*:\s*(\d+)/i);
        return m ? parseInt(m[1], 10) : null;
    }

    function checkBadgeAndResetIfNeeded() {
        createTimerElement();
        const num = readTasksCompletedNumber();
        if (num === null) return;
        if (lastTaskNumber === null) {
            lastTaskNumber = num;
            return;
        }
        if (num !== lastTaskNumber) {
            lastTaskNumber = num;
            resetTimerToDefault();
        }
    }

    function setupObservers() {
        setInterval(checkBadgeAndResetIfNeeded, POLL_MS);
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(checkBadgeAndResetIfNeeded, OBS_DEBOUNCE_MS);
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function init() {
        createTimerElement();
        lastTaskNumber = readTasksCompletedNumber();
        startTimerOnce();
        setupObservers();
        setInterval(() => {
            if (!document.getElementById('tm-task-timer')) createTimerElement();
        }, 3000);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
        setTimeout(() => { if (!intervalId) init(); }, 3000);
    }
})();

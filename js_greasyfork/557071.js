// ==UserScript==
// @name         Ticket Alert - Notify on "Open"
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show popup + sound when "empty" appears on page
// @author       KLElisa
// @match        https://metsa.service-now.com/*
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557071/Ticket%20Alert%20-%20Notify%20on%20%22Open%22.user.js
// @updateURL https://update.greasyfork.org/scripts/557071/Ticket%20Alert%20-%20Notify%20on%20%22Open%22.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const TARGET_WORD = '(empty)';
    let notified = false;
    let observer = null;
    let debounceTimer = null;

    function playSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 880;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
            osc.stop(ctx.currentTime + 0.6);
        } catch {
            const audio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=');
            audio.play().catch(() => {});
        }
    }

    function notifyOnce() {
        if (notified) return;
        notified = true;
        if (observer) observer.disconnect();

        GM_notification({
            title: 'New Metsä ServiceNow Ticket Alert',
            text: `Detected "${TARGET_WORD}" on the page.`,
            timeout: 10000,
            onclick: () => window.focus()
        });

        playSound();
    }

    function containsTarget() {
        const body = document.body;
        if (!body) return false;
        return body.innerText.includes(TARGET_WORD);
    }

    function debouncedCheck() {
        if (notified) return;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (!notified && containsTarget()) {
                notifyOnce();
            }
        }, 150);
    }

    function start() {
        debouncedCheck();
        observer = new MutationObserver(debouncedCheck);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();


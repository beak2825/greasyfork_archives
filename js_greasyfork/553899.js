// ==UserScript==
// @name         Waze Checker Block Auto-Reload
// @version      1.0.0
// @description  Blocks automatic page reloads in Waze Checker when auto-stop is enabled.
// @author       FalconTech
// @match        https://checker.waze.uz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=labtool.pl
// @namespace    https://greasyfork.org/users/205544
// @run-at       document-start
// @grant        none
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/553899/Waze%20Checker%20Block%20Auto-Reload.user.js
// @updateURL https://update.greasyfork.org/scripts/553899/Waze%20Checker%20Block%20Auto-Reload.meta.js
// ==/UserScript==

/* Changelog:
 *  1.0.0 - New script
 */

(function() {
    'use strict';

    const STOP_STORAGE_KEY = 'wazeStopEnabled';
    let stopTimerId = null;

    const isRefreshEnabled = () => localStorage.getItem(STOP_STORAGE_KEY) !== '0';
    const setRefreshEnabled = (on) => localStorage.setItem(STOP_STORAGE_KEY, on ? '1' : '0');

    const cancelAutoStop = () => {
        if (stopTimerId !== null) {
            clearTimeout(stopTimerId);
            stopTimerId = null;
        }
    };

    const triggerAutoStop = () => {
        stopTimerId = null;
        window.stop();
    };

    const scheduleAutoStop = () => {
        cancelAutoStop();
        if (isRefreshEnabled()) return;
        stopTimerId = window.setTimeout(triggerAutoStop, 5000);
    };

    scheduleAutoStop();

    function renderStopToggle() {
        if (document.getElementById('waze-stop-toggle')) return;

        const ul = document.querySelector('ul.navbar-nav.me-auto');
        if (!ul) return;

        const li = document.createElement('li');
        li.className = 'nav-item mx-1';

        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = '#';
        a.id = 'waze-stop-toggle';
        a.innerHTML = `<i class="fas fa-sync me-1"></i>Auto-refresh: <b class="status"></b>`;

        const statusEl = a.querySelector('.status');
        const applyStatus = () => {
            const on = isRefreshEnabled();
            statusEl.textContent = on ? 'ON' : 'OFF';
            statusEl.classList.toggle('text-success', on);
            statusEl.classList.toggle('text-danger', !on);
        };
        applyStatus();

        a.addEventListener('click', (e) => {
            e.preventDefault();
            const wasOn = isRefreshEnabled();
            const nowOn = !wasOn;
            setRefreshEnabled(nowOn);
            applyStatus();
            if (nowOn) {
                // OFF -> ON: reload page
                cancelAutoStop();
                location.reload();
            } else {
                // ON -> OFF: hold meta-refresh
                scheduleAutoStop();
            }
        });

        li.appendChild(a);
        ul.appendChild(li);
    }

    renderStopToggle();
    document.addEventListener('DOMContentLoaded', renderStopToggle);

    const navObserver = new MutationObserver(() => {
        if (document.getElementById('waze-stop-toggle')) {
            navObserver.disconnect();
            return;
        }
        renderStopToggle();
    });
    navObserver.observe(document.documentElement, { childList: true, subtree: true });

})();

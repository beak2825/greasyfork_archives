// ==UserScript==
// @name         CyTube EST Start Times (24-Hour Limit)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Show EST start time for CyTube playlist entries totaling up to 24 hours, anchored to synced start time via mediaUpdate WebSocket event. Optimized for performance and scrollability.
// @author       Rosh
// @match        *://*.cytu.be/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555912/CyTube%20EST%20Start%20Times%20%2824-Hour%20Limit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555912/CyTube%20EST%20Start%20Times%20%2824-Hour%20Limit%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TIMEZONE = 'America/New_York';
    const MAX_SECONDS = 24 * 3600; // 24 hours
    let lockedStartTime = null;
    let updateScheduled = false;

    function parseTimeToSeconds(timeStr) {
        const parts = timeStr.split(':').map(Number);
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        return 0;
    }

    function formatESTTime(offsetSeconds) {
        const base = lockedStartTime || new Date();
        const future = new Date(base.getTime() + offsetSeconds * 1000);
        return future.toLocaleTimeString('en-US', {
            timeZone: TIMEZONE,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    function updateESTTimes() {
        try {
            const rows = Array.from(document.querySelectorAll('#queue .queue_entry'));
            let cumulativeSeconds = 0;

            for (const row of rows) {
                if (cumulativeSeconds >= MAX_SECONDS) break;

                const timeEl = row.querySelector('.qe_time');
                if (!timeEl) continue;

                const timeMatch = timeEl.textContent.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
                if (!timeMatch) continue;

                const duration = parseTimeToSeconds(timeMatch[1]);

                let estEl = row.querySelector('.qe_est');
                if (!estEl) {
                    estEl = document.createElement('span');
                    estEl.className = 'qe_est';
                    estEl.style.display = 'block';
                    estEl.style.fontSize = '11px';
                    estEl.style.color = '#ccc';
                    estEl.style.marginTop = '2px';
                    estEl.style.marginLeft = '4px';
                    timeEl.insertAdjacentElement('afterend', estEl);
                }

                estEl.textContent = `⏰ EST: ${formatESTTime(cumulativeSeconds)}`;
                cumulativeSeconds += duration;
            }
        } catch (err) {
            console.error('EST script error:', err);
        }
    }

    function scheduleUpdate() {
        if (!updateScheduled) {
            updateScheduled = true;
            setTimeout(() => {
                updateESTTimes();
                updateScheduled = false;
            }, 500);
        }
    }

    function waitForQueueAndInit() {
        const queue = document.getElementById('queue');
        if (!queue || queue.querySelectorAll('.queue_entry').length === 0) {
            setTimeout(waitForQueueAndInit, 500);
            return;
        }

        updateESTTimes();

        const observer = new MutationObserver(() => {
            scheduleUpdate();
        });

        observer.observe(queue, {
            childList: true,
            subtree: false
        });

        setInterval(scheduleUpdate, 10000); // fallback refresh
    }

    function hookWebSocketStartTime() {
        const socket = window.socket;
        if (!socket || !socket.on) {
            setTimeout(hookWebSocketStartTime, 500);
            return;
        }

        socket.on('mediaUpdate', data => {
            if (data && typeof data.currentTime === 'number') {
                const now = new Date();
                lockedStartTime = new Date(now.getTime() - data.currentTime * 1000);
                scheduleUpdate();
            }
        });
    }

    waitForQueueAndInit();
    hookWebSocketStartTime();
})();
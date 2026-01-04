// ==UserScript==
// @name         Sportlogiq: Live Event Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dynamically highlights events in the list as the video plays or scrubs.
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554198/Sportlogiq%3A%20Live%20Event%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/554198/Sportlogiq%3A%20Live%20Event%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Стиль для підсвічування ---
    // Ви можете змінити колір `background-color` на будь-який інший
    GM_addStyle(`
        tr.live-highlight {
            background-color: rgba(52, 152, 219, 0.4) !important;
            transition: background-color 0.1s linear;
        }
    `);

    const LiveHighlighter = {
        videoElement: null,
        eventTableBody: null,
        eventTimeMap: new Map(), 
        lastHighlightedFrame: -1,
        fps: 30, 

        init: function() {
            const readyCheck = setInterval(() => {
                this.videoElement = document.getElementById('game-video');
                this.eventTableBody = document.querySelector('#game-events tbody');

                if (this.videoElement && this.eventTableBody) {
                    clearInterval(readyCheck);
                    this.run();
                }
            }, 500);
        },

        run: function() {
            this.initialScan(); 
            this.observeNewEvents(); 

            
            this.videoElement.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
        },

        smpteToFrames: function(ts) {
            try {
                const parts = ts.split(':').map(Number);
                if (parts.length < 4 || parts.some(isNaN)) return -1;
                return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * this.fps + parts[3];
            } catch (e) {
                return -1;
            }
        },

        parseRow: function(row) {
            const timeCell = row.querySelector('td.video-time');
            if (!timeCell) return;

            const timecode = timeCell.textContent.trim();
            const frame = this.smpteToFrames(timecode);
            if (frame === -1) return;

            if (!this.eventTimeMap.has(frame)) {
                this.eventTimeMap.set(frame, []);
            }
            this.eventTimeMap.get(frame).push(row);
        },

        initialScan: function() {
            const allRows = this.eventTableBody.querySelectorAll('tr');
            allRows.forEach(row => this.parseRow(row));
        },

        observeNewEvents: function() {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                             const rows = node.tagName === 'TR' ? [node] : node.querySelectorAll('tr');
                             rows.forEach(row => this.parseRow(row));
                        }
                    });
                });
            });
            observer.observe(this.eventTableBody, { childList: true, subtree: true });
        },

        onTimeUpdate: function() {
            const currentTime = this.videoElement.currentTime;
            const currentFrame = Math.floor(currentTime * this.fps);

            if (currentFrame === this.lastHighlightedFrame) {
                return;
            }

            if (this.eventTimeMap.has(this.lastHighlightedFrame)) {
                this.eventTimeMap.get(this.lastHighlightedFrame).forEach(row => {
                    row.classList.remove('live-highlight');
                });
            }

            if (this.eventTimeMap.has(currentFrame)) {
                this.eventTimeMap.get(currentFrame).forEach(row => {
                    row.classList.add('live-highlight');
                });
            }

            this.lastHighlightedFrame = currentFrame;
        }
    };

    LiveHighlighter.init();

})();
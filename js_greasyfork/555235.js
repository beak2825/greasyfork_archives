// ==UserScript==
// @name         CyTube UI Enhancer (v2.1.0)
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  Stable: Rounded UI, username appending, duration highlights, sticky navbar, and persistent styling for CyTube queue entries and layout containers.
// @author       You
// @match        https://cytu.be/r/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555235/CyTube%20UI%20Enhancer%20%28v210%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555235/CyTube%20UI%20Enhancer%20%28v210%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        li.queue_entry {
            border-radius: 12px !important;
            padding: 8px 12px !important;
            margin-bottom: 6px !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.1);
        }
        li.queue_entry[data-duration="short"] {
            background-color: rgba(255, 255, 255, 0.05) !important;
        }
        li.queue_entry[data-duration="medium"] {
            background-color: rgba(255, 255, 0, 0.1) !important;
        }
        li.queue_entry[data-duration="long"] {
            background-color: rgba(0, 200, 255, 0.1) !important;
        }
        li.queue_entry[data-duration="movie"] {
            background-color: rgba(255, 0, 100, 0.1) !important;
        }
        .qe_time {
            border-radius: 6px;
            padding: 2px 6px;
            background-color: rgba(255, 255, 255, 0.2);
        }
        li.queue_entry .btn-group {
            display: flex !important;
            gap: 4px;
        }

        /* Rounded UI Enhancements */
        #chatline {
            border-radius: 10px !important;
            padding: 6px 10px !important;
            border: 1px solid #ccc !important;
        }
        #chatwrap {
            border-radius: 12px !important;
            padding: 10px !important;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0,0,0,0.1);
        }
        #userlist {
            border-radius: 12px !important;
            padding: 8px !important;
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(0,0,0,0.1);
        }
        #userlist .userlist_item {
            border-radius: 8px;
            padding: 6px 10px;
            margin-bottom: 4px;
            font-size: 11px;
            line-height: 1.4;
            max-width: 100%;
            overflow: visible;
            white-space: normal;
            word-break: break-word;
        }
        .navbar {
            border-radius: 12px !important;
            padding: 6px 12px !important;
            background-color: rgba(255,255,255,0.05) !important;
            border: 1px solid rgba(0,0,0,0.1) !important;
            position: fixed !important;
            top: 0;
            left: 0;
            right: 0;
            z-index: 9999;
        }
        body {
            padding-top: 60px !important;
        }
    `);

    function styleEntry(entry) {
        if (!entry || entry.dataset.durationStyled === 'true') return;

        const timeSpan = entry.querySelector('.qe_time');
        if (!timeSpan) return;

        const parts = timeSpan.textContent.trim().split(':').map(Number);
        const totalSeconds = parts.length === 3
            ? parts[0] * 3600 + parts[1] * 60 + parts[2]
            : parts[0] * 60 + parts[1];

        if (totalSeconds < 60) {
            timeSpan.textContent += ' ⏱️';
            entry.setAttribute('data-duration', 'short');
        } else if (totalSeconds < 600) {
            timeSpan.textContent += ' 🍿';
            entry.setAttribute('data-duration', 'medium');
        } else if (totalSeconds < 1800) {
            timeSpan.textContent += ' 📺';
            entry.setAttribute('data-duration', 'long');
        } else if (totalSeconds >= 3600) {
            timeSpan.textContent += ' 🎥';
            entry.setAttribute('data-duration', 'movie');
        }

        const btnGroup = entry.querySelector('.btn-group');
        if (btnGroup) {
            btnGroup.style.display = 'flex';
            btnGroup.style.gap = '4px';
        }

        const titleAttr = entry.getAttribute('title');
        const match = titleAttr && titleAttr.match(/Added by:\s*(.+)/);
        if (match) {
            const username = match[1];
            const titleAnchor = entry.querySelector('.qe_title');
            if (titleAnchor && !titleAnchor.dataset.usernameAppended) {
                const userSpan = document.createElement('span');
                userSpan.textContent = ` [${username}]`;
                userSpan.style.marginLeft = '6px';
                userSpan.style.fontStyle = 'italic';
                titleAnchor.parentNode.insertBefore(userSpan, titleAnchor.nextSibling);
                titleAnchor.dataset.usernameAppended = 'true';
            }
        }

        entry.dataset.durationStyled = 'true';
    }

    function styleAllQueueEntries() {
        document.querySelectorAll('li.queue_entry').forEach(styleEntry);
    }

    function observeQueue(queue) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('li.queue_entry')) {
                        styleEntry(node);
                    } else if (node.nodeType === 1) {
                        node.querySelectorAll?.('li.queue_entry')?.forEach(styleEntry);
                    }
                });
            });
        });
        observer.observe(queue, { childList: true, subtree: true });
    }

    function waitForQueueAndInit() {
        const queue = document.querySelector('#queue');
        if (queue) {
            styleAllQueueEntries();
            observeQueue(queue);
            setInterval(styleAllQueueEntries, 2000);
        } else {
            setTimeout(waitForQueueAndInit, 500);
        }
    }

    waitForQueueAndInit();
})();
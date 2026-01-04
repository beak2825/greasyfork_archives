// ==UserScript==
// @name         CyTube UI Enhancer (v1.9.1)
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  Rounded UI, username appending, duration highlights, sticky navbar, and cross-patterned chatwrap coloring for CyTube interface enhancements.
// @author       You
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554620/CyTube%20UI%20Enhancer%20%28v191%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554620/CyTube%20UI%20Enhancer%20%28v191%29.meta.js
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

        .qe_time {
            border-radius: 6px;
            padding: 2px 6px;
            background-color: rgba(255, 255, 255, 0.2);
        }

        .btn-group .btn {
            border-radius: 6px !important;
            margin: 2px;
        }

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

        #messagebuffer div strong {
            font-weight: bold;
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

    function appendUsernames() {
        document.querySelectorAll('li.queue_entry').forEach(entry => {
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
        });
    }

    function highlightDurations() {
        document.querySelectorAll('li.queue_entry').forEach(entry => {
            if (entry.dataset.durationStyled === 'true') return;

            const timeSpan = entry.querySelector('.qe_time');
            if (!timeSpan) return;

            const parts = timeSpan.textContent.trim().split(':').map(Number);
            const totalSeconds = parts.length === 3
                ? parts[0] * 3600 + parts[1] * 60 + parts[2]
                : parts[0] * 60 + parts[1];

            if (totalSeconds < 60) {
                timeSpan.textContent += ' ⏱️';
                entry.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            } else if (totalSeconds < 600) {
                timeSpan.textContent += ' 🍿';
                entry.style.backgroundColor = 'rgba(255, 255, 0, 0.1)';
            } else if (totalSeconds < 1800) {
                timeSpan.textContent += ' 📺';
                entry.style.backgroundColor = 'rgba(0, 200, 255, 0.1)';
            } else if (totalSeconds >= 3600) {
                timeSpan.textContent += ' 🎥';
                entry.style.backgroundColor = 'rgba(255, 0, 100, 0.1)';
            }

            entry.dataset.durationStyled = 'true';
        });
    }

    function colorChatNames() {
        const usedKeys = new Set();

        document.querySelectorAll('#messagebuffer div strong').forEach(strong => {
            const name = strong.textContent.trim();
            if (!name || strong.dataset.colorStyled === 'true') return;

            const first = name.charCodeAt(0) || 65;
            const second = name.charCodeAt(1) || 65;

            let hue = (first - 65) * 15;
            let sat = 50 + ((second - 65) % 50);
            let light = 40 + ((second + first) % 30);

            hue = hue % 360;

            const key = `${first}-${second}`;
            while (usedKeys.has(key)) {
                hue = (hue + 37) % 360;
                sat = (sat + 13) % 100;
                light = (light + 7) % 100;
            }
            usedKeys.add(key);

            strong.style.color = `hsl(${hue}, ${sat}%, ${light}%)`;
            strong.dataset.colorStyled = 'true';
        });
    }

    const observer = new MutationObserver(() => {
        appendUsernames();
        highlightDurations();
        colorChatNames();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    appendUsernames();
    highlightDurations();
    colorChatNames();

    // Periodic refresh every 30 seconds
    setInterval(() => {
        appendUsernames();
        highlightDurations();
    }, 30000);
})();
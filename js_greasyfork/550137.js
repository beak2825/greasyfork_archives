// ==UserScript==
// @name         Torn - Pickpocketing - Cyclist Monitor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Highlights the keyword and alerts with sound and notification.
// @author       zstorm [2268511]
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        GM_notification
// @grant        window.focus
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/550137/Torn%20-%20Pickpocketing%20-%20Cyclist%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/550137/Torn%20-%20Pickpocketing%20-%20Cyclist%20Monitor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keyword = "Cyclist";

    const notificationTitle = `Found a ${keyword}`;
    const notificationMessage = `"${keyword}" has been detected!`;
    const notificationTimeout = 2000;
    let keywordFound = false;
    let observerPaused = false;

    console.log(`Monitoring keyword: "${keyword}"`);

    // Beep sound
    function playBeep() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }

    // Show notification
    function sendChromeNotification() {
        GM_notification({
            title: notificationTitle,
            text: notificationMessage,
            timeout: notificationTimeout,
            onclick: () => window.focus()
        });
    } 
    
    // Highlight keyword without triggering infinite loops
    function highlightKeyword() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let found = false;

        while (walker.nextNode()) {
            const node = walker.currentNode;

            if (!node.nodeValue.includes(keyword)) continue;
            if (node.parentNode.tagName === 'MARK') continue;

            const span = document.createElement('mark');
            span.style.backgroundColor = 'red';
            span.style.color = 'black';

            const parts = node.nodeValue.split(new RegExp(`(${keyword})`, 'gi'));

            parts.forEach(part => {
                if (part.toLowerCase() === keyword.toLowerCase()) {
                    const mark = span.cloneNode();
                    mark.textContent = part;
                    node.parentNode.insertBefore(mark, node);
                } else {
                    node.parentNode.insertBefore(document.createTextNode(part), node);
                }
            });

            node.parentNode.removeChild(node);
            found = true;
        }

        return found;
    }

    // Debounced observer logic
    let observerTimeout;
    const observer = new MutationObserver(() => {
        if (observerPaused) return;

        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            observerPaused = true; // prevent loop
            const found = highlightKeyword();
            if (found && !keywordFound) {
                playBeep();
                sendChromeNotification();
                console.log(`"1 ${keyword}" found.`);
                keywordFound = true;                
            }

            // Re-enable observer after short delay
            setTimeout(() => {
                observerPaused = false;
            }, 500); // adjust if needed

        }, 300); // debounce time
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            highlightKeyword();
        }, 500);
    });

})();

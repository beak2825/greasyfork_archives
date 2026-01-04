// ==UserScript==
// @name         History Spammer GUI (Universal)
// @namespace    http://tampermonkey.net/
// @version      1.300000001
// @description  GUI for spamming history with current URL on any site (shows current URL, prompts only for count)
// @author       Iron web10
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550854/History%20Spammer%20GUI%20%28Universal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550854/History%20Spammer%20GUI%20%28Universal%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent duplicate UI if script is injected multiple times
    if (window.__iw10_history_spammer_installed) return;
    window.__iw10_history_spammer_installed = true;

    // Create the menu container
    const menuContainer = document.createElement('div');
    Object.assign(menuContainer.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '300px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '10px',
        borderRadius: '6px',
        zIndex: '2147483647', // very high z-index to avoid being hidden
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box'
    });

    const title = document.createElement('div');
    title.innerText = 'History Spammer | Iron web10';
    Object.assign(title.style, { fontSize: '14px', margin: '0 0 8px 0', fontWeight: '600' });
    menuContainer.appendChild(title);

    // Show current URL (updates live)
    const urlDisplay = document.createElement('div');
    urlDisplay.innerText = 'URL: ' + window.location.href;
    Object.assign(urlDisplay.style, { fontSize: '12px', wordBreak: 'break-all', margin: '0 0 8px 0' });
    menuContainer.appendChild(urlDisplay);

    // small helper line
    const hint = document.createElement('div');
    hint.innerText = 'Click "Spam History" → enter count';
    hint.style.fontSize = '11px';
    hint.style.opacity = '0.85';
    menuContainer.appendChild(hint);

    // Spam history function — prompts only for count
    function spamHistory() {
        // ensure using the current URL (in case page changed)
        const currentUrl = window.location.href;
        urlDisplay.innerText = 'URL: ' + currentUrl;

        const raw = prompt("How many times do you want this page to show up in your history?");
        if (raw === null) return; // user cancelled
        const num = parseInt(raw, 10);
        if (isNaN(num) || num <= 0) {
            return alert("Invalid number!");
        }

        // Safety: warn for huge numbers to avoid freezing the tab
        const SOFT_LIMIT = 500;
        if (num > SOFT_LIMIT) {
            const ok = confirm(`You asked to push ${num} entries. This may cause the tab to become unresponsive. Continue?`);
            if (!ok) return;
        }

        // push entries into history; keep behavior minimal to avoid breaking anything else
        try {
            for (let i = 1; i <= num; i++) {
                // pushState with a short string for intermediate entries, final entry uses the actual URL
                history.pushState(null, '', i === num ? currentUrl : i.toString());
            }
            alert(`Flooding successful! ${currentUrl} is now in your history ${num} times.`);
        } catch (e) {
            console.error('History push failed:', e);
            alert('Failed to push to history. See console for details.');
        }
    }

    // Create button
    const spamButton = document.createElement('button');
    spamButton.textContent = 'Spam History';
    Object.assign(spamButton.style, {
        width: '100%',
        padding: '8px',
        marginTop: '8px',
        cursor: 'pointer',
        backgroundColor: '#666',
        color: '#fff',
        border: 'none',
        borderRadius: '4px'
    });
    spamButton.onclick = spamHistory;
    menuContainer.appendChild(spamButton);

    // Add a hide/show toggle
    const toggle = document.createElement('button');
    toggle.textContent = 'Hide';
    Object.assign(toggle.style, {
        float: 'right',
        marginTop: '-34px',
        marginRight: '-6px',
        background: 'transparent',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px'
    });
    let hidden = false;
    toggle.onclick = () => {
        hidden = !hidden;
        if (hidden) {
            // collapse to a small bar
            menuContainer.style.width = '110px';
            urlDisplay.style.display = 'none';
            spamButton.style.display = 'none';
            hint.style.display = 'none';
            toggle.textContent = 'Show';
            title.innerText = 'History Spammer';
        } else {
            menuContainer.style.width = '300px';
            urlDisplay.style.display = '';
            spamButton.style.display = '';
            hint.style.display = '';
            toggle.textContent = 'Hide';
            title.innerText = 'History Spammer | Iron web10';
        }
    };
    menuContainer.appendChild(toggle);

    // Append menu to the page
    document.body.appendChild(menuContainer);

    // Keep the displayed URL updated when SPA frameworks change location (common on many sites)
    const updateUrlDisplay = () => urlDisplay.innerText = 'URL: ' + window.location.href;
    // intercept pushState/replaceState to update the display
    (function() {
        const _push = history.pushState;
        history.pushState = function() {
            const ret = _push.apply(this, arguments);
            updateUrlDisplay();
            return ret;
        };
        const _replace = history.replaceState;
        history.replaceState = function() {
            const ret = _replace.apply(this, arguments);
            updateUrlDisplay();
            return ret;
        };
        window.addEventListener('popstate', updateUrlDisplay);
    })();

    // As a fallback, observe URL changes (some sites change content without touching history API)
    let lastHref = location.href;
    setInterval(() => {
        if (location.href !== lastHref) {
            lastHref = location.href;
            updateUrlDisplay();
        }
    }, 800);

})();

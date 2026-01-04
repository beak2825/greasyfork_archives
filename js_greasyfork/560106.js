// ==UserScript==
// @name         SPA/MPA Detector
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Detects if the current website is SPA or MPA. Floating panel with status, log, reset, close, and toggle. Hides on modals/captchas.
// @author       Amr Fateem
// @license MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560106/SPAMPA%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/560106/SPAMPA%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Hide if inside cross-origin iframe (e.g., Google reCAPTCHA, login modals)
    try {
        if (window.self !== window.top && window.location.hostname !== window.parent.location.hostname) {
            return; // Do not run/inject anything in cross-origin iframes
        }
    } catch (e) {
        return; // Same-origin policy error means cross-origin iframe → hide
    }

    let isSPA = false;
    let eventsLog = [];
    let lastHref = location.href;
    const domain = location.hostname;

    // Load persisted state
    const stored = GM_getValue(domain, null);
    if (stored) {
        isSPA = stored.isSPA || false;
        eventsLog = stored.eventsLog || [];
        eventsLog.push('Loaded previous detection state');
    }

    // Initial framework detection
    function detectFrameworks() {
        const frameworks = {
            React: !!window.React || !!window.ReactDOM || !!document.querySelector('[data-reactroot], [data-reactid]'),
            Vue: !!window.Vue,
            Angular: !!window.angular || !!window.ng,
            Svelte: !!document.querySelector('[svelte]'),
            WixThunderbolt: !!window.thunderboltVersion || !!window.wixBiSession
        };
        const detected = Object.keys(frameworks).filter(k => frameworks[k]);
        if (detected.length > 0) {
            isSPA = true;
            eventsLog.push(`Potential SPA frameworks detected: ${detected.join(', ')}`);
        }
    }
    detectFrameworks();

    // Monkey-patch History API
    if (typeof history.pushState === 'function') {
        const origPush = history.pushState;
        history.pushState = function(...args) {
            isSPA = true;
            eventsLog.push('History.pushState called');
            return origPush.apply(this, args);
        };
    }
    if (typeof history.replaceState === 'function') {
        const origReplace = history.replaceState;
        history.replaceState = function(...args) {
            isSPA = true;
            eventsLog.push('History.replaceState called');
            return origReplace.apply(this, args);
        };
    }

    // Events
    window.addEventListener('popstate', () => {
        isSPA = true;
        eventsLog.push('popstate event triggered');
    });
    window.addEventListener('hashchange', () => {
        isSPA = true;
        eventsLog.push('hashchange event triggered');
    });

    // URL polling
    setInterval(() => {
        if (location.href !== lastHref) {
            isSPA = true;
            eventsLog.push('URL changed without full reload');
            lastHref = location.href;
        }
    }, 300);

    // Save state periodically
    setInterval(() => {
        GM_setValue(domain, { isSPA, eventsLog });
    }, 2000);

    // Create main panel
    const panel = document.createElement('div');
    panel.id = 'spa-mpa-panel';
    panel.style.cssText = `
        position: fixed; bottom: 60px; right: 20px; width: 280px; max-height: 400px;
        background: white; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        padding: 10px; font-family: Arial, sans-serif; font-size: 13px; z-index: 999999;
        overflow: hidden; display: flex; flex-direction: column; transition: opacity 0.3s;
    `;

    // Close button
    const closeBtn = document.createElement('div');
    closeBtn.textContent = '×';
    closeBtn.style.cssText = `
        position: absolute; top: 5px; right: 8px; font-size: 20px; cursor: pointer;
        width: 20px; height: 20px; text-align: center; line-height: 20px;
        color: #999; border-radius: 50%;
    `;
    closeBtn.title = 'Close panel (click toggle button to reopen)';
    closeBtn.onclick = () => { panel.style.display = 'none'; toggleBtn.style.display = 'block'; };

    const header = document.createElement('div');
    header.innerHTML = '<strong>SPA/MPA Detector</strong>';
    header.style.marginBottom = '8px';

    const status = document.createElement('div');
    status.id = 'spa-mpa-status';
    status.style.fontWeight = 'bold';
    status.style.marginBottom = '10px';

    const logContainer = document.createElement('div');
    logContainer.id = 'spa-mpa-log';
    logContainer.style.flex = '1';
    logContainer.style.overflowY = 'auto';
    logContainer.style.border = '1px solid #eee';
    logContainer.style.padding = '5px';
    logContainer.style.fontSize = '12px';
    logContainer.style.background = '#f9f9f9';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Detection';
    resetBtn.style.marginTop = '8px';
    resetBtn.onclick = () => {
        isSPA = false;
        eventsLog = ['Detection reset manually'];
        GM_setValue(domain, { isSPA: false, eventsLog });
        updateUI();
    };

    panel.appendChild(closeBtn);
    panel.appendChild(header);
    panel.appendChild(status);
    panel.appendChild(logContainer);
    panel.appendChild(resetBtn);

    // Toggle button (hidden initially)
    const toggleBtn = document.createElement('div');
    toggleBtn.textContent = 'SPA?';
    toggleBtn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
        background: #007bff; color: white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        text-align: center; line-height: 50px; font-size: 14px; font-weight: bold; cursor: pointer;
        z-index: 999999; display: none;
    `;
    toggleBtn.onclick = () => {
        panel.style.display = 'flex';
        toggleBtn.style.display = 'none';
    };

    document.body.appendChild(panel);
    document.body.appendChild(toggleBtn);

    // Update UI function
    function updateUI() {
        let type = isSPA ? 'SPA (Single Page Application)' : 'MPA (Multi Page Application)';
        let confidence = eventsLog.length > 2 ? 'High confidence' : (eventsLog.length === 0 ? 'No navigation yet' : 'Medium confidence');

        if (eventsLog.some(l => l.includes('frameworks')) && !isSPA) {
            type = 'Hybrid (Frameworks detected but MPA navigation)';
        }

        status.textContent = `${type} — ${confidence}`;

        logContainer.innerHTML = eventsLog.map(l => `<div>${l}</div>`).join('') || '<div>No events logged yet.</div>';
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    updateUI();
    setInterval(updateUI, 1000);

    // Optional: Toggle with ESC key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (panel.style.display !== 'none') {
                panel.style.display = 'none';
                toggleBtn.style.display = 'block';
            }
        }
    });

})();
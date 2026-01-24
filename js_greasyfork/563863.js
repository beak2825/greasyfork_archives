// ==UserScript==
// @name         Deadshot.io Ping and Server Display
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display ping for deadshot.io
// @author       You
// @match        https://deadshot.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563863/Deadshotio%20Ping%20and%20Server%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/563863/Deadshotio%20Ping%20and%20Server%20Display.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // CSS for the overlay - matching the first paste exactly
    const statsCSS = `
    #dsOverlayStats {
        position: fixed;
        top: 3px;
        left: 3px;
        background: rgba(0, 0, 0, 0.6);
        padding: 8px 12px;
        border-radius: 6px;
        color: #fff;
        z-index: 99999;
        white-space: nowrap;
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.5;
        pointer-events: none;
        user-select: none;
    }
    #dsOverlayStats .server {
        color: #39FF14;
        font-weight: bold;
    }
    #dsOverlayStats .ping {
        color: #fe01b1;
    }
    #dsOverlayStats .ping.good {
        color: #39FF14;
    }
    #dsOverlayStats .ping.medium {
        color: #ffaa00;
    }
    #dsOverlayStats .ping.bad {
        color: #ff3333;
    }`;

    // Inject styles
    const style = document.createElement('style');
    style.textContent = statsCSS;
    document.head.appendChild(style);

    // Create overlay for stats
    const overlayStats = document.createElement('div');
    overlayStats.id = 'dsOverlayStats';
    overlayStats.innerHTML = 'Loading stats...';
    document.body.appendChild(overlayStats);

    let ping = 0;
    let currentServerCode = 'au';

    const regionToServer = {
        'North America': 'na',
        'Europe': 'eu',
        'Asia': 'as',
        'South India': 'in',
        'South America': 'sa',
        'Australia': 'au'
    };

    const serverUrls = {
        'na': 'https://na_rp.deadshot.io/rp',
        'eu': 'https://eu_rp.deadshot.io/rp',
        'as': 'https://as_rp.deadshot.io/rp',
        'in': 'https://in_rp.deadshot.io/rp',
        'sa': 'https://sa_rp.deadshot.io/rp',
        'au': 'https://au_rp.deadshot.io/rp'
    };

    // Function to get current server based on region from local storage
    function getCurrentServer() {
        try {
            const settings = JSON.parse(localStorage.getItem('settings')) || {};
            const region = settings.region;
            return regionToServer[region] || 'au';
        } catch {
            return 'au';
        }
    }

    // Function to update ping
    async function updatePing() {
        currentServerCode = getCurrentServer();
        const start = performance.now();
        try {
            await fetch(serverUrls[currentServerCode], {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            ping = Math.round((performance.now() - start) / 2);
        } catch {
            ping = -1;
        }
    }

    // Function to update the overlay with stats
    function updateStatsDisplay() {
        const pingClass = ping === -1 ? 'bad' :
                         ping < 50 ? 'good' :
                         ping < 100 ? 'medium' : 'bad';
        const pingText = ping === -1 ? 'offline' : `${String(ping).padStart(2, '0')}ms`;

        overlayStats.innerHTML = `
            <div>Server: <span class="server">${currentServerCode.toUpperCase()}</span></div>
            <div>Ping: <span class="ping ${pingClass}">${pingText}</span></div>
        `;
    }

    // Update stats every 0.5 second
    setInterval(() => {
        updatePing().then(updateStatsDisplay);
    }, 500);
})();
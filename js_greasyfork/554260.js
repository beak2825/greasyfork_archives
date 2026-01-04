// ==UserScript==
// @name         Zed.City Raid Monitor
// @namespace    https://swervelord.dev/
// @version      1.0
// @description  Monitor raids and alert when they need more members (only when you're eligible)
// @author       swervelord
// @match        https://www.zed.city/*
// @match        https://zed.city/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554260/ZedCity%20Raid%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/554260/ZedCity%20Raid%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const RAIDS_API_URL = 'https://api.zed.city/getRaids';
    const STATS_API_URL = 'https://api.zed.city/getStats';
    const CHECK_INTERVAL = 60000; // 60 seconds

    // Create GUI container
    function createGUI() {
        const container = document.createElement('div');
        container.id = 'raid-monitor-gui';
        container.style.cssText = `
            position: fixed;
            top: 140px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            min-width: 280px;
            max-width: 350px;
            font-family: Arial, sans-serif;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(container);
        return container;
    }

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        #raid-monitor-gui .raid-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        #raid-monitor-gui .raid-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        #raid-monitor-gui .raid-info {
            font-size: 13px;
            margin-bottom: 5px;
            opacity: 0.9;
        }
        #raid-monitor-gui .join-btn {
            background: #48bb78;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            width: 100%;
            margin-top: 10px;
            transition: background 0.2s;
        }
        #raid-monitor-gui .join-btn:hover {
            background: #38a169;
        }
        #raid-monitor-gui .header {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 10px;
        }
        #raid-monitor-gui .worker-list {
            font-size: 12px;
            margin-top: 5px;
            opacity: 0.8;
        }
        #raid-monitor-gui .status-badge {
            display: inline-block;
            background: rgba(72, 187, 120, 0.3);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            margin-top: 8px;
        }
    `;
    document.head.appendChild(style);

    // Check if user is eligible (not on cooldown)
    async function checkEligibility() {
        try {
            const response = await fetch(STATS_API_URL);
            const data = await response.json();

            // User is eligible if raid_cooldown is 0 or less
            return data.raid_cooldown <= 0;
        } catch (error) {
            console.error('Raid Monitor - Stats Check Error:', error);
            return false; // Assume not eligible if error
        }
    }

    // Check raids and update GUI
    async function checkRaids() {
        try {
            // First check if user is eligible
            const isEligible = await checkEligibility();

            if (!isEligible) {
                // Remove GUI if user is on cooldown
                const existingGUI = document.getElementById('raid-monitor-gui');
                if (existingGUI) {
                    existingGUI.remove();
                }
                console.log('Raid Monitor: On cooldown, not eligible for raids');
                return;
            }

            // User is eligible, now check for raids needing members
            const response = await fetch(RAIDS_API_URL);
            const data = await response.json();

            // Find raids that need more members
            const raidsNeedingMembers = [];

            if (data.activeRaids) {
                for (const [raidId, raid] of Object.entries(data.activeRaids)) {
                    const maxWorkers = raid.vars.max_workers;
                    const currentWorkers = raid.workers ? raid.workers.length : 0;

                    // Check if raid has workers and needs more
                    if (currentWorkers > 0 && currentWorkers < maxWorkers) {
                        raidsNeedingMembers.push({
                            id: raidId,
                            name: raid.name,
                            currentWorkers: currentWorkers,
                            maxWorkers: maxWorkers,
                            workers: raid.workers
                        });
                    }
                }
            }

            // Update or remove GUI based on raids
            const existingGUI = document.getElementById('raid-monitor-gui');

            if (raidsNeedingMembers.length > 0) {
                let container = existingGUI || createGUI();

                let html = '<div class="header">🚨 Raids Need Members!</div>';

                raidsNeedingMembers.forEach(raid => {
                    const workerNames = raid.workers.map(w => w.username).join(', ');
                    html += `
                        <div class="raid-item">
                            <div class="raid-title">${raid.name}</div>
                            <div class="raid-info">👥 ${raid.currentWorkers}/${raid.maxWorkers} members</div>
                            <div class="worker-list">Current: ${workerNames}</div>
                        </div>
                    `;
                });

                html += '<div class="status-badge">✓ You are eligible to join</div>';
                html += '<button class="join-btn" onclick="window.location.href=\'https://www.zed.city/raids\'">Join Raid</button>';

                container.innerHTML = html;
                console.log(`Raid Monitor: ${raidsNeedingMembers.length} raid(s) need members and you're eligible!`);
            } else if (existingGUI) {
                // Remove GUI if no raids need members
                existingGUI.remove();
                console.log('Raid Monitor: No raids currently need members');
            }

        } catch (error) {
            console.error('Raid Monitor Error:', error);
        }
    }

    // Initial check
    checkRaids();

    // Check every minute
    setInterval(checkRaids, CHECK_INTERVAL);

    console.log('Zed.City Raid Monitor Active - Checking every 60 seconds');
    console.log('Monitoring both raid availability and your eligibility status');
})();
// ==UserScript==
// @name         Torn Crime Role Prioritizer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Reorder crime roles by priority and show priority tooltips
// @author       You
// @match        https://www.torn.com/factions.php?step=your&type=1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562149/Torn%20Crime%20Role%20Prioritizer.user.js
// @updateURL https://update.greasyfork.org/scripts/562149/Torn%20Crime%20Role%20Prioritizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Embedded CSV data
    const csvData = `crime_name,role_name,priority,weight
Mob Mentality,Looter #1,1,34
Mob Mentality,Looter #2,2,26
Mob Mentality,Looter #3,3,23
Mob Mentality,Looter #4,4,17
Cash Me If You Can,Thief #1,1,50
Cash Me If You Can,Lookout,2,28
Cash Me If You Can,Thief #2,3,22
Smoke And Wing Mirrors,Car Thief,1,51
Smoke And Wing Mirrors,Impersonator,2,27
Smoke And Wing Mirrors,Hustler #2,3,13
Smoke And Wing Mirrors,Hustler #1,4,9
Market Forces,Enforcer,1,29
Market Forces,Negotiator,2,27
Market Forces,Muscle,3,23
Market Forces,Lookout,4,16
Market Forces,Arsonist,5,5
Gaslight The Way,Imitator #3,1,41
Gaslight The Way,Imitator #2,2,27
Gaslight The Way,Looter #3,3,13
Gaslight The Way,Imitator #1,4,10
Gaslight The Way,Looter #1,5,10
Gaslight The Way,Looter #2,6,0
Snow Blind,Hustler,1,48
Snow Blind,Impersonator,2,36
Snow Blind,Muscle #1,3,8
Snow Blind,Muscle #2,4,8
Stage Fright,Sniper,1,46
Stage Fright,Muscle #1,2,20
Stage Fright,Enforcer,3,16
Stage Fright,Muscle #3,4,9
Stage Fright,Lookout,5,6
Stage Fright,Muscle #2,6,3
No Reserve,Techie,1,38
No Reserve,Engineer,2,31
No Reserve,Car Thief,3,31
Counter Offer,Robber,1,36
Counter Offer,Engineer,2,28
Counter Offer,Picklock,3,17
Counter Offer,Hacker,4,12
Counter Offer,Looter,5,7
Leave No Trace,Impersonator,1,37
Leave No Trace,Negotiator,2,34
Leave No Trace,Techie,3,29
Bidding War,Robber #3,1,32
Bidding War,Robber #2,2,22
Bidding War,Bomber #2,3,18
Bidding War,Driver,4,13
Bidding War,Bomber #1,5,8
Bidding War,Robber #1,6,7
Honey Trap,Muscle #2,1,42
Honey Trap,Muscle #1,2,31
Honey Trap,Enforcer,3,27
Blast From The Past,Muscle,1,34
Blast From The Past,Engineer,2,24
Blast From The Past,Bomber,3,16
Blast From The Past,Picklock #1,4,11
Blast From The Past,Hacker,5,12
Blast From The Past,Picklock #2,6,3
Clinical Precision,Imitator,1,43
Clinical Precision,Cleaner,2,22
Clinical Precision,Cat Burglar,3,19
Clinical Precision,Assassin,4,16
Break The Bank,Muscle #3,1,32
Break The Bank,Thief #2,2,29
Break The Bank,Muscle #1,3,14
Break The Bank,Robber,4,13
Break The Bank,Muscle #2,5,10
Break The Bank,Thief #1,6,3
Stacking The Deck,Impersonator,1,48
Stacking The Deck,Hacker,2,26
Stacking The Deck,Cat Burglar,3,23
Stacking The Deck,Driver,4,3
Ace In The Hole,Hacker,1,28
Ace In The Hole,Imitator,2,21
Ace In The Hole,Muscle #2,3,25
Ace In The Hole,Muscle #1,4,18
Ace In The Hole,Driver,5,8
Guardian Ángels,Hustler,1,42
Guardian Ángels,Engineer,2,31
Guardian Ángels,Enforcer,3,27
Sneaky Git Grab,Pickpocket,1,51
Sneaky Git Grab,Imitator,2,18
Sneaky Git Grab,Techie,3,17
Sneaky Git Grab,Hacker,4,14
Manifest Cruelty,Reviver,1,46
Manifest Cruelty,Interrogator,2,24
Manifest Cruelty,Hacker,3,16
Manifest Cruelty,Cat Burglar,4,14
Gone Fission,Hijacker,1,25
Gone Fission,Imitator,2,25
Gone Fission,Bomber,3,18
Gone Fission,Pickpocket,4,17
Gone Fission,Engineer,5,15
Crane Reaction,Sniper,1,41
Crane Reaction,Lookout,2,17
Crane Reaction,Bomber,3,16
Crane Reaction,Muscle #1,4,10
Crane Reaction,Muscle #2,5,8
Crane Reaction,Engineer,6,8`;

    // Parse CSV into a lookup structure
    const crimePriorities = {};

    function parseCSV() {
        const lines = csvData.trim().split('\n');
        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length < 4) continue;

            const crimeName = parts[0].trim();
            const roleName = parts[1].trim();
            const priority = parseInt(parts[2].trim());
            const weight = parseInt(parts[3].trim());

            if (!crimePriorities[crimeName]) {
                crimePriorities[crimeName] = {};
            }

            // Store both priority and weight
            crimePriorities[crimeName][roleName] = {
                priority: priority,
                weight: weight
            };
        }
    }

    // Function to normalize role names (remove numbers for matching)
    function normalizeRoleName(name) {
        // Remove trailing " #1", " #2", etc.
        return name.replace(/\s*#\d+$/, '').trim();
    }

    // Function to get role priority
    function getRolePriority(crimeName, roleName) {
        // Try exact match first
        if (crimePriorities[crimeName]) {
            return findRoleInCrime(crimePriorities[crimeName], roleName);
        }

        // Try case-insensitive match
        const lowerCrimeName = crimeName.toLowerCase();
        for (const crime in crimePriorities) {
            if (crime.toLowerCase() === lowerCrimeName) {
                return findRoleInCrime(crimePriorities[crime], roleName);
            }
        }

        return null;
    }

    // Helper function to find role within a crime's data
    function findRoleInCrime(crimeData, roleName) {
        // Try exact match first
        if (crimeData[roleName]) {
            return crimeData[roleName];
        }

        // Try normalized match (without #1, #2, etc.)
        const normalizedRole = normalizeRoleName(roleName);
        for (const role in crimeData) {
            if (normalizeRoleName(role) === normalizedRole) {
                return crimeData[role];
            }
        }

        return null;
    }

    // Function to add CSS for tooltips
    function addTooltipStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .crime-priority-tooltip {
                position: relative;
            }

            .crime-priority-tooltip::after {
                content: attr(data-priority);
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.9);
                color: #fff;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s;
                margin-bottom: 5px;
                z-index: 1000;
            }

            .crime-priority-tooltip:hover::after {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    // Add visual indicator banner
    function addDebugBanner() {
        const existingBanner = document.getElementById('crime-prioritizer-banner');
        if (existingBanner) existingBanner.remove();

        const banner = document.createElement('div');
        banner.id = 'crime-prioritizer-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 0 0 8px 8px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-size: 14px;
        `;
        banner.textContent = '🎯 Crime Prioritizer Active';
        document.body.appendChild(banner);

        // Remove after 3 seconds
        setTimeout(() => banner.remove(), 3000);
    }

    // Main function to process crimes
    function processCrimes() {
        console.log('[Crime Prioritizer] Starting to process crimes...');

        // Find all crime containers
        const crimeContainers = document.querySelectorAll('.contentLayer___IYFdz .scenario___cQfFm');
        console.log(`[Crime Prioritizer] Found ${crimeContainers.length} crime containers`);

        let processedCount = 0;

        crimeContainers.forEach(container => {
            // Get crime name
            const crimeNameElement = container.querySelector('.panelTitle___aoGuV');
            if (!crimeNameElement) {
                console.log('[Crime Prioritizer] No crime name found in container');
                return;
            }

            const crimeName = crimeNameElement.textContent.trim();
            console.log(`[Crime Prioritizer] Processing crime: "${crimeName}"`);

            // The roles wrapper is a SIBLING of the scenario container, not a child!
            // Look for the next sibling with the wrapper___g3mPt class
            let rolesWrapper = container.parentElement.querySelector('.wrapper___g3mPt');

            if (!rolesWrapper) {
                // Try alternative: look for sibling with wrapper class that's not the scenario wrapper
                const parent = container.parentElement;
                const siblings = parent.querySelectorAll('[class*="wrapper"]');
                for (const sibling of siblings) {
                    if (sibling.className.includes('g3mPt') || sibling.querySelector('[class*="Lpz_D"]')) {
                        rolesWrapper = sibling;
                        break;
                    }
                }
            }

            if (!rolesWrapper) {
                console.log(`[Crime Prioritizer] No roles wrapper found for "${crimeName}"`);
                console.log('[Crime Prioritizer] Parent element:', container.parentElement);
                console.log('[Crime Prioritizer] Parent children:', container.parentElement.children);
                return;
            }

            console.log(`[Crime Prioritizer] Found roles wrapper for "${crimeName}"`);

            // Get all role slots
            const roleSlots = Array.from(rolesWrapper.querySelectorAll('.wrapper___Lpz_D'));
            console.log(`[Crime Prioritizer] Found ${roleSlots.length} role slots for "${crimeName}"`);

            // Create array with role data
            const roleData = roleSlots.map(slot => {
                const titleElement = slot.querySelector('.title___UqFNy');
                if (!titleElement) return null;

                const roleName = titleElement.textContent.trim();
                const priorityInfo = getRolePriority(crimeName, roleName);

                console.log(`[Crime Prioritizer]   - Role: "${roleName}", Priority: ${priorityInfo ? priorityInfo.priority : 'NOT FOUND'}, Weight: ${priorityInfo ? priorityInfo.weight : 'N/A'}`);

                return {
                    element: slot,
                    roleName: roleName,
                    priority: priorityInfo ? priorityInfo.priority : 999,
                    weight: priorityInfo ? priorityInfo.weight : 0
                };
            }).filter(item => item !== null);

            // Sort by priority (lower number = higher priority)
            const originalOrder = roleData.map(r => r.roleName).join(', ');
            roleData.sort((a, b) => a.priority - b.priority);
            const newOrder = roleData.map(r => r.roleName).join(', ');

            console.log(`[Crime Prioritizer] Original order: ${originalOrder}`);
            console.log(`[Crime Prioritizer] New order: ${newOrder}`);

            // Reorder elements in DOM
            roleData.forEach(item => {
                rolesWrapper.appendChild(item.element);

                // Add tooltip to join button
                const joinButton = item.element.querySelector('.joinButton___Ikoyy, button[type="button"].torn-btn');
                if (joinButton && item.weight > 0) {
                    joinButton.classList.add('crime-priority-tooltip');
                    joinButton.setAttribute('data-priority', `Priority: ${item.weight}%`);
                    console.log(`[Crime Prioritizer]   - Added tooltip to "${item.roleName}" with ${item.weight}%`);
                }

                // Add visual border to indicate processed
                item.element.style.borderLeft = '3px solid #667eea';
            });

            processedCount++;
        });

        console.log(`[Crime Prioritizer] Finished processing ${processedCount} crimes`);

        if (processedCount > 0) {
            addDebugBanner();
        }
    }

    // Debounce function to prevent too many rapid calls
    let processTimeout = null;
    function debouncedProcess() {
        if (processTimeout) clearTimeout(processTimeout);
        processTimeout = setTimeout(() => {
            processCrimes();
        }, 500);
    }

    // Initialize
    function init() {
        console.log('[Crime Prioritizer] Script initialized!');
        console.log('[Crime Prioritizer] Current URL:', window.location.href);
        console.log('[Crime Prioritizer] Parsing CSV data...');
        parseCSV();
        console.log(`[Crime Prioritizer] Loaded ${Object.keys(crimePriorities).length} crimes`);

        addTooltipStyles();

        // Wait for page to load
        if (document.readyState === 'loading') {
            console.log('[Crime Prioritizer] Waiting for DOM to load...');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[Crime Prioritizer] DOM loaded, processing crimes...');
                setTimeout(processCrimes, 1000); // Wait 1 second for content to render
            });
        } else {
            console.log('[Crime Prioritizer] DOM already loaded, processing crimes...');
            setTimeout(processCrimes, 1000); // Wait 1 second for content to render
        }

        // Listen for clicks on the recruiting tab
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a');
            if (target && target.textContent.includes('Recruiting')) {
                console.log('[Crime Prioritizer] Recruiting tab clicked, will reprocess...');
                setTimeout(processCrimes, 1000);
            }
        });

        // Re-run when content changes (for SPA navigation)
        let lastProcessedContent = '';
        const observer = new MutationObserver((mutations) => {
            // Look for crime containers
            const crimeContainers = document.querySelectorAll('.contentLayer___IYFdz .scenario___cQfFm');
            if (crimeContainers.length > 0) {
                // Create a hash of the current content to avoid reprocessing the same content
                const currentContent = Array.from(crimeContainers).map(c => {
                    const title = c.querySelector('.panelTitle___aoGuV');
                    return title ? title.textContent : '';
                }).join('|');

                if (currentContent && currentContent !== lastProcessedContent) {
                    console.log('[Crime Prioritizer] Detected content change, reprocessing...');
                    lastProcessedContent = currentContent;
                    debouncedProcess();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[Crime Prioritizer] MutationObserver attached');

        // Also add a manual trigger - press Ctrl+Shift+P to reprocess
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                console.log('[Crime Prioritizer] Manual trigger activated!');
                processCrimes();
            }
        });
        console.log('[Crime Prioritizer] Manual trigger: Press Ctrl+Shift+P to reprocess');
    }

    init();
})();
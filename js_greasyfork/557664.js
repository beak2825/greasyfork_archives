// ==UserScript==
// @name         Torn OC Role Evaluator
// @version      1.14
// @description  Evaluate OC roles based on influence and success chance (fix for finished OCs)
// @author       underko[3362751]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/502635/1422102/waitForKeyElements-CoeJoder-fork.js
// @license      MIT
// @namespace https://greasyfork.org/users/1494305
// @downloadURL https://update.greasyfork.org/scripts/557664/Torn%20OC%20Role%20Evaluator.user.js
// @updateURL https://update.greasyfork.org/scripts/557664/Torn%20OC%20Role%20Evaluator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const influenceThresholds = {
        high: { good: 75, ok: 60 },
        medium: { good: 60, ok: 45 },
        low: { good: 40, ok: 30 }
    };

    const ocRoleInfluence = {
        "Pet Project": [
            { role: "Kidnapper",   influence: 41.14 },
            { role: "Muscle",      influence: 26.83 },
            { role: "Picklock",    influence: 32.03 }
        ],
        "Mob Mentality": [
            { role: "Looter #1",   influence: 34.83 },
            { role: "Looter #2",   influence: 25.97 },
            { role: "Looter #3",   influence: 19.87 },
            { role: "Looter #4",   influence: 19.33 }
        ],
        "Cash Me if You Can": [
            { role: "Thief #1",    influence: 46.67 },
            { role: "Thief #2",    influence: 21.87 },
            { role: "Lookout",     influence: 31.46 }
        ],
        "Best of the Lot": [
            { role: "Picklock",    influence: 23.65 },
            { role: "Car Thief",   influence: 21.06 },
            { role: "Muscle",      influence: 36.43 },
            { role: "Imitator",    influence: 18.85 }
        ],
        "Market Forces": [
            { role: "Enforcer",    influence: 27.56 },
            { role: "Negotiator",  influence: 25.59 },
            { role: "Lookout",     influence: 19.05 },
            { role: "Arsonist",    influence:  4.12 },
            { role: "Muscle",      influence: 23.68 }
        ],
        "Smoke and Wing Mirrors": [
            { role: "Car Thief",   influence: 48.20 },
            { role: "Imitator",    influence: 26.30 },
            { role: "Hustler #1",  influence:  7.70 },
            { role: "Hustler #2",  influence: 17.81 }
        ],
        "Gaslight the Way": [
            { role: "Imitator #1", influence:  7.54 },
            { role: "Imitator #2", influence: 34.85 },
            { role: "Imitator #3", influence: 40.25 },
            { role: "Looter #1",   influence:  7.54 },
            { role: "Looter #2",   influence:  0.00 },
            { role: "Looter #3",   influence:  9.83 }
        ],
        "Stage Fright": [
            { role: "Enforcer",    influence: 16.89 },
            { role: "Muscle #1",   influence: 21.92 },
            { role: "Muscle #2",   influence:  2.09 },
            { role: "Muscle #3",   influence:  9.49 },
            { role: "Lookout",     influence:  7.68 },
            { role: "Sniper",      influence: 41.92 }
        ],
        "Snow Blind": [
            { role: "Hustler",     influence: 51.40 },
            { role: "Imitator",    influence: 30.44 },
            { role: "Muscle #1",   influence:  9.08 },
            { role: "Muscle #2",   influence:  9.08 }
        ],
        "Leave No Trace": [
            { role: "Techie",      influence: 24.40 },
            { role: "Negotiator",  influence: 29.07 },
            { role: "Imitator",    influence: 46.54 }
        ],
        "No Reserve": [
            { role: "Car Thief",   influence: 30.86 },
            { role: "Techie",      influence: 37.88 },
            { role: "Engineer",    influence: 31.27 }
        ],
        "Counter Offer": [
            { role: "Robber",      influence: 33.29 },
            { role: "Looter",      influence:  4.69 },
            { role: "Hacker",      influence: 16.72 },
            { role: "Picklock",    influence: 17.10 },
            { role: "Engineer",    influence: 28.21 }
        ],
        "Guardian Ángels": [
            { role: "Enforcer",    influence: 28.34 },
            { role: "Hustler",     influence: 37.72 },
            { role: "Engineer",    influence: 33.93 }
        ],
        "Honey Trap": [
            { role: "Enforcer",    influence: 20.21 },
            { role: "Muscle #1",   influence: 34.32 },
            { role: "Muscle #2",   influence: 45.47 }
        ],
        "Bidding War": [
            { role: "Robber #1",   influence:  6.82 },
            { role: "Driver",      influence: 21.93 },
            { role: "Robber #2",   influence: 19.63 },
            { role: "Robber #3",   influence: 25.65 },
            { role: "Bomber #1",   influence: 10.96 },
            { role: "Bomber #2",   influence: 15.00 }
        ],
        "Sneaky Git Grab": [
            { role: "Imitator",    influence: 12.48 },
            { role: "Pickpocket",  influence: 43.77 },
            { role: "Hacker",      influence: 23.11 },
            { role: "Techie",      influence: 20.64 }
        ],
        "Blast from the Past": [
            { role: "Picklock #1", influence:  9.81 },
            { role: "Hacker",      influence:  6.18 },
            { role: "Engineer",    influence: 25.29 },
            { role: "Bomber",      influence: 20.40 },
            { role: "Muscle",      influence: 36.75 },
            { role: "Picklock #2", influence:  1.56 }
        ],
        "Break the Bank": [
            { role: "Robber",      influence: 10.84 },
            { role: "Muscle #1",   influence: 10.27 },
            { role: "Muscle #2",   influence:  7.78 },
            { role: "Thief #1",    influence:  3.55 },
            { role: "Muscle #3",   influence: 33.54 },
            { role: "Thief #2",    influence: 34.03 }
        ],
        "Stacking the Deck": [
            { role: "Cat Burglar", influence: 31.99 },
            { role: "Driver",      influence:  3.86 },
            { role: "Hacker",      influence: 25.64 },
            { role: "Imitator",    influence: 38.52 }
        ],
        "Clinical Precision": [
            { role: "Imitator",    influence: 41.51 },
            { role: "Cat Burglar", influence: 22.21 },
            { role: "Assassin",    influence: 14.56 },
            { role: "Cleaner",     influence: 21.71 }
        ],
        "Ace in the Hole": [
            { role: "Imitator",    influence: 13.73 },
            { role: "Muscle #1",   influence: 18.55 },
            { role: "Muscle #2",   influence: 18.88 },
            { role: "Hacker",      influence: 37.49 },
            { role: "Driver",      influence: 11.35 }
        ]
    };

    const PROCESSED_ATTR = 'data-oc-evaluated';

    // Build a lookup for inferring crime from roles
    function buildRoleSignatures() {
        const signatures = {};
        for (const [crimeName, roles] of Object.entries(ocRoleInfluence)) {
            // Create a signature from sorted role names
            const sig = roles.map(r => r.role).sort().join('|');
            signatures[sig] = crimeName;
        }
        return signatures;
    }

    const roleSignatures = buildRoleSignatures();

    function inferCrimeFromRoles(roleNames) {
        const sortedRoles = [...roleNames].sort().join('|');
        
        // Exact match
        if (roleSignatures[sortedRoles]) {
            return roleSignatures[sortedRoles];
        }

        // Partial match - find best match
        let bestMatch = null;
        let bestScore = 0;

        for (const [crimeName, roles] of Object.entries(ocRoleInfluence)) {
            const crimeRoles = roles.map(r => r.role);
            let matches = 0;
            for (const role of roleNames) {
                if (crimeRoles.includes(role)) matches++;
            }
            const score = matches / Math.max(roleNames.length, crimeRoles.length);
            if (score > bestScore && score >= 0.5) {
                bestScore = score;
                bestMatch = crimeName;
            }
        }

        return bestMatch;
    }

    function classifyOcRoleInfluence(ocName, roleName, successChance) {
        const roleData = ocRoleInfluence[ocName]?.find(r => r.role === roleName);
        const influence = roleData ? roleData.influence : null;

        if (influence === null) {
            return { evaluation: 'unknown', influence: null };
        }

        let thresholds;
        if (influence >= 30) thresholds = influenceThresholds.high;
        else if (influence >= 10) thresholds = influenceThresholds.medium;
        else thresholds = influenceThresholds.low;

        if (successChance >= thresholds.good) return { evaluation: 'good', influence };
        if (successChance >= thresholds.ok) return { evaluation: 'ok', influence };
        return { evaluation: 'bad', influence };
    }

    function findCrimeTitleFromElement(element) {
        // Strategy 1: Look up the DOM tree (up to 30 levels)
        let parent = element;
        let depth = 0;
        while (parent && depth < 30) {
            // Check for panel title in this element
            const titleEl = parent.querySelector('[class*="panelTitle"]');
            if (titleEl) {
                return titleEl.textContent.trim();
            }

            // Check siblings
            if (parent.previousElementSibling) {
                const sibTitleEl = parent.previousElementSibling.querySelector('[class*="panelTitle"]');
                if (sibTitleEl) {
                    return sibTitleEl.textContent.trim();
                }
                // Check if sibling itself is the title
                if (parent.previousElementSibling.className?.includes('panelTitle')) {
                    return parent.previousElementSibling.textContent.trim();
                }
            }

            parent = parent.parentElement;
            depth++;
        }

        return null;
    }

    function findCrimeWrapper(slotHeader) {
        // Find the wrapper that contains all the roles for this crime
        let element = slotHeader.parentElement;
        let depth = 0;

        while (element && depth < 15) {
            // Look for wrapper with notOpening or similar class patterns
            const className = element.className || '';
            if (className.includes('wrapper') && 
                (className.includes('notOpening') || 
                 className.includes('Opening') ||
                 className.includes('crime'))) {
                return element;
            }

            // Check if this element contains multiple slotHeaders
            const headers = element.querySelectorAll('[class*="slotHeader"]');
            if (headers.length > 1) {
                return element;
            }

            element = element.parentElement;
            depth++;
        }

        return slotHeader.parentElement?.parentElement;
    }

    function processSlotHeader(slotHeader) {
        if (slotHeader.hasAttribute(PROCESSED_ATTR)) return;

        // Find role title
        const roleEl = slotHeader.querySelector('[class*="title"]');
        if (!roleEl) return;

        const roleName = roleEl.textContent.trim();

        // Find success chance
        const successEl = slotHeader.querySelector('[class*="successChance"]');
        if (!successEl) return;

        const originalText = successEl.textContent.trim();
        if (originalText.includes('/')) {
            slotHeader.setAttribute(PROCESSED_ATTR, 'true');
            return;
        }

        const chance = parseInt(originalText, 10);
        if (isNaN(chance)) return;

        // Try to find crime title
        let crimeTitle = findCrimeTitleFromElement(slotHeader);

        // If no title found, try to infer from all roles in the same crime wrapper
        if (!crimeTitle) {
            const crimeWrapper = findCrimeWrapper(slotHeader);
            if (crimeWrapper) {
                const allRoleEls = crimeWrapper.querySelectorAll('[class*="title"]');
                const roleNames = [];
                allRoleEls.forEach(el => {
                    const text = el.textContent.trim();
                    // Filter out non-role titles (check if it looks like a role name)
                    if (text && !text.includes(' ') || text.includes('#')) {
                        roleNames.push(text);
                    }
                });

                if (roleNames.length > 0) {
                    crimeTitle = inferCrimeFromRoles(roleNames);
                    if (crimeTitle) {
                        console.log('[OC Evaluator] Inferred crime:', crimeTitle, 'from roles:', roleNames);
                    }
                }
            }
        }

        if (!crimeTitle) {
            console.log('[OC Evaluator] Could not determine crime for role:', roleName);
            return;
        }

        const evaluation = classifyOcRoleInfluence(crimeTitle, roleName, chance);

        if (evaluation.influence !== null) {
            successEl.textContent = `${chance}/${Math.round(evaluation.influence)}`;
        }

        switch (evaluation.evaluation) {
            case 'good':
                slotHeader.style.backgroundColor = '#239b56';
                break;
            case 'ok':
                slotHeader.style.backgroundColor = '#ca6f1e';
                break;
            case 'bad':
                slotHeader.style.backgroundColor = '#a93226';
                break;
        }

        slotHeader.setAttribute(PROCESSED_ATTR, 'true');
    }

    function processAllCrimes() {
        // Find all slot headers
        const allSlotHeaders = document.querySelectorAll('[class*="slotHeader"]');
        allSlotHeaders.forEach(slotHeader => {
            try {
                processSlotHeader(slotHeader);
            } catch (e) {
                console.error('[OC Evaluator] Error processing slot:', e);
            }
        });
    }

    function setupMutationObserver(root) {
        if (root.hasAttribute('data-oc-observer-attached')) return;
        root.setAttribute('data-oc-observer-attached', 'true');

        const observer = new MutationObserver(() => {
            clearTimeout(window.ocEvalTimeout);
            window.ocEvalTimeout = setTimeout(processAllCrimes, 150);
        });

        observer.observe(root, { childList: true, subtree: true });
        console.log('[OC Evaluator] Observer attached to:', root.id || root.className);
    }

    function init() {
        // Set up observer on the crimes root or body
        const root = document.querySelector("#faction-crimes-root") || 
                     document.querySelector('[class*="crimes"]') ||
                     document.body;
        
        setupMutationObserver(root);
        processAllCrimes();
    }

    // Use waitForKeyElements for initial load
    waitForKeyElements("#faction-crimes-root", (root) => {
        console.log('[OC Evaluator] Found faction-crimes-root');
        setupMutationObserver(root);
        processAllCrimes();
    });

    // Also set up observers on slot headers directly as they appear
    waitForKeyElements('[class*="slotHeader"]', (slotHeader) => {
        setTimeout(() => processSlotHeader(slotHeader), 100);
    });

    // Fallback initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', () => setTimeout(init, 500));

    // Polling fallback
    setInterval(processAllCrimes, 2000);

    // Handle tab clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('[class*="tab"]') || e.target.closest('button')) {
            setTimeout(processAllCrimes, 300);
            setTimeout(processAllCrimes, 800);
        }
    }, true);

    console.log('[OC Evaluator] Script loaded v1.13');
})();
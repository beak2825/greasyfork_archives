// ==UserScript==
// @name         DSS: Torn Crime Role Prioritiser
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Reorder crime roles by priority and show priority tooltips
// @author       Dsuttz [1561637]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562151/DSS%3A%20Torn%20Crime%20Role%20Prioritiser.user.js
// @updateURL https://update.greasyfork.org/scripts/562151/DSS%3A%20Torn%20Crime%20Role%20Prioritiser.meta.js
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

            crimePriorities[crimeName][roleName] = {
                priority: priority,
                weight: weight
            };
        }
    }

    function normalizeRoleName(name) {
        return name.replace(/\s*#\d+$/, '').trim();
    }

    function getRolePriority(crimeName, roleName) {
        if (crimePriorities[crimeName]) {
            return findRoleInCrime(crimePriorities[crimeName], roleName);
        }

        const lowerCrimeName = crimeName.toLowerCase();
        for (const crime in crimePriorities) {
            if (crime.toLowerCase() === lowerCrimeName) {
                return findRoleInCrime(crimePriorities[crime], roleName);
            }
        }

        return null;
    }

    function findRoleInCrime(crimeData, roleName) {
        if (crimeData[roleName]) {
            return crimeData[roleName];
        }

        const normalizedRole = normalizeRoleName(roleName);
        for (const role in crimeData) {
            if (normalizeRoleName(role) === normalizedRole) {
                return crimeData[role];
            }
        }

        return null;
    }

    function getPriorityColor(normalizedPriority) {
        if (normalizedPriority <= 0.5) {
            const t = normalizedPriority * 2;
            const r = 139 + (255 - 139) * t;
            const g = 0 + (165 - 0) * t;
            const b = 0;
            return `rgb(${Math.round(r)}, ${Math.round(g)}, ${b})`;
        } else {
            const t = (normalizedPriority - 0.5) * 2;
            const r = 255 + (144 - 255) * t;
            const g = 165 + (238 - 165) * t;
            const b = 0 + (144 - 0) * t;
            return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
        }
    }

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

    function processCrimes(retryCount = 0) {
        if (!window.location.hash.includes('tab=crimes')) {
            return;
        }

        const crimeContainers = document.querySelectorAll('.contentLayer___IYFdz .scenario___cQfFm');

        if (crimeContainers.length === 0 && retryCount < 5) {
            setTimeout(() => processCrimes(retryCount + 1), 300);
            return;
        }

        crimeContainers.forEach(container => {
            const crimeNameElement = container.querySelector('.panelTitle___aoGuV');
            if (!crimeNameElement) return;

            const crimeName = crimeNameElement.textContent.trim();

            let rolesWrapper = container.parentElement.querySelector('.wrapper___g3mPt');

            if (!rolesWrapper) {
                const parent = container.parentElement;
                const siblings = parent.querySelectorAll('[class*="wrapper"]');
                for (const sibling of siblings) {
                    if (sibling.className.includes('g3mPt') || sibling.querySelector('[class*="Lpz_D"]')) {
                        rolesWrapper = sibling;
                        break;
                    }
                }
            }

            if (!rolesWrapper) return;

            const roleSlots = Array.from(rolesWrapper.querySelectorAll('.wrapper___Lpz_D'));

            const roleData = roleSlots.map(slot => {
                const titleElement = slot.querySelector('.title___UqFNy');
                if (!titleElement) return null;

                const roleName = titleElement.textContent.trim();
                const priorityInfo = getRolePriority(crimeName, roleName);

                return {
                    element: slot,
                    roleName: roleName,
                    priority: priorityInfo ? priorityInfo.priority : 999,
                    weight: priorityInfo ? priorityInfo.weight : 0
                };
            }).filter(item => item !== null);

            roleData.sort((a, b) => a.priority - b.priority);

            const maxPriority = Math.max(...roleData.map(r => r.priority));

            roleData.forEach(item => {
                rolesWrapper.appendChild(item.element);

                const joinButton = item.element.querySelector('.joinButton___Ikoyy, button[type="button"].torn-btn');
                if (joinButton && item.weight > 0) {
                    joinButton.classList.add('crime-priority-tooltip');
                    joinButton.setAttribute('data-priority', `Priority: ${item.weight}%`);
                }

                if (item.priority !== 999) {
                    const normalizedPriority = (item.priority - 1) / (maxPriority - 1);
                    const color = getPriorityColor(normalizedPriority);
                    item.element.style.borderLeft = `4px solid ${color}`;
                }
            });
        });
    }

    let processTimeout = null;
    function debouncedProcess() {
        if (processTimeout) clearTimeout(processTimeout);
        processTimeout = setTimeout(() => {
            processCrimes();
        }, 100);
    }

    function init() {
        parseCSV();
        addTooltipStyles();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', processCrimes);
        } else {
            processCrimes();
        }

        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, a, div, span');
            if (target) {
                const textContent = target.textContent || '';
                const parentText = target.parentElement?.textContent || '';

                if (textContent.includes('CRIMES') ||
                    parentText.includes('CRIMES') ||
                    textContent.includes('Recruiting') ||
                    textContent.includes('Planning') ||
                    textContent.includes('Completed')) {
                    setTimeout(processCrimes, 500);
                }
            }
        }, true);

        window.addEventListener('hashchange', () => {
            setTimeout(processCrimes, 500);
        });

        let lastProcessedContent = '';
        const observer = new MutationObserver((mutations) => {
            const crimeContainers = document.querySelectorAll('.contentLayer___IYFdz .scenario___cQfFm');
            if (crimeContainers.length > 0) {
                const currentContent = Array.from(crimeContainers).map(c => {
                    const title = c.querySelector('.panelTitle___aoGuV');
                    return title ? title.textContent : '';
                }).join('|');

                if (currentContent && currentContent !== lastProcessedContent) {
                    lastProcessedContent = currentContent;
                    debouncedProcess();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                processCrimes();
            }
        });
    }

    init();
})();
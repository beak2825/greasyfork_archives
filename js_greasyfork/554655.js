// ==UserScript==
// @name         WWW Guild Panel Sorter
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds sorting functionality and activity highlighting to MWI Guild Panel
// @author       WekizZ
// @match        https://*.milkywayidle.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554655/WWW%20Guild%20Panel%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/554655/WWW%20Guild%20Panel%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPlayerName() {
        const nameElement = document.querySelector('.CharacterName_name__1amXp');
        if (nameElement) {
            return nameElement.getAttribute('data-name') || nameElement.textContent.trim();
        }
        return null;
    }

    function parseValue(str) {
        if (!str) return 0;
        str = str.replace(/,/g, '');
        if (str.includes('K')) {
            return parseFloat(str) * 1000;
        }
        return parseFloat(str);
    }

    function parseActivityDays(activityText) {
        if (!activityText) return 0;
        const match = activityText.match(/(\d+)d/);
        return match ? parseInt(match[1]) : 0;
    }

    function getActivityValue(cell) {
        const useElement = cell.querySelector('use');
        if (useElement) {
            const href = useElement.getAttribute('href');
            if (href) {
                const activity = href.split('#').pop();

                const activityOrder = {
                    'combat': 1,
                    'woodcutting': 2,
                    'mining': 3,
                    'fishing': 4,
                    'cooking': 5,
                    'smithing': 6,
                    'crafting': 7,
                    'cheesesmithing': 8,
                    'farming': 9,
                    'construction': 10,
                    'magic': 11,
                    'thieving': 12,
                    'fletching': 13,
                    'runecrafting': 14,
                    'archeology': 15
                };

                return activityOrder[activity] || 0;
            }
        }

        const inactiveDiv = cell.querySelector('.GuildPanel_inactive__1iIXS');
        if (inactiveDiv) {
            return 1000 + parseActivityDays(inactiveDiv.textContent);
        }

        return 999;
    }

    function addRowHighlighting() {
        const tbody = document.querySelector('.GuildPanel_membersTable__1NwIX tbody');
        if (!tbody) return;

        const playerName = getPlayerName();

        const rows = tbody.getElementsByTagName('tr');
        Array.from(rows).forEach(row => {
            const nameCell = row.querySelector('td:first-child');
            const isPlayerRow = nameCell && nameCell.textContent.trim() === playerName;

            const activityCell = row.querySelector('.GuildPanel_activity__9vshh');
            if (!activityCell) return;

            row.classList.remove('highlight-yellow', 'highlight-orange', 'highlight-red', 'highlight-self');

            if (isPlayerRow) {
                row.classList.add('highlight-self');
            } else {
                const activityDiv = activityCell.querySelector('.GuildPanel_inactive__1iIXS');
                if (activityDiv) {
                    const days = parseActivityDays(activityDiv.textContent);
                    if (days >= 7) {
                        row.classList.add('highlight-red');
                    } else if (days >= 3) {
                        row.classList.add('highlight-orange');
                    } else if (days >= 1) {
                        row.classList.add('highlight-yellow');
                    }
                }
            }
        });
    }

    function addSortingButtons() {
        const table = document.querySelector('.GuildPanel_membersTable__1NwIX');
        if (!table) return;

        const headers = table.querySelectorAll('thead th');
        headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.style.userSelect = 'none';
            if (!header.getAttribute('data-sort-direction')) {
                header.setAttribute('data-sort-direction', 'none');
                if (index === 2) {
                    header.setAttribute('data-sort-by', 'total');
                }
                header.addEventListener('click', () => sortTable(index));
            }
        });
    }

    function sortTable(columnIndex) {
        const table = document.querySelector('.GuildPanel_membersTable__1NwIX');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.getElementsByTagName('tr'));
        const header = table.querySelector('thead').getElementsByTagName('th')[columnIndex];
        const currentDirection = header.getAttribute('data-sort-direction');
        let newDirection;

        if (columnIndex === 2) {
            const currentSortBy = header.getAttribute('data-sort-by');
            if (currentDirection === 'none') {
                newDirection = 'desc';
                header.setAttribute('data-sort-by', 'total');
            } else if (currentDirection === 'desc' && currentSortBy === 'total') {
                newDirection = 'asc';
                header.setAttribute('data-sort-by', 'total');
            } else if (currentDirection === 'asc' && currentSortBy === 'total') {
                newDirection = 'desc';
                header.setAttribute('data-sort-by', 'daily');
            } else if (currentDirection === 'desc' && currentSortBy === 'daily') {
                newDirection = 'asc';
                header.setAttribute('data-sort-by', 'daily');
            } else {
                newDirection = 'desc';
                header.setAttribute('data-sort-by', 'total');
            }
        } else {
            newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        }

        table.querySelectorAll('th').forEach(th => th.setAttribute('data-sort-direction', 'none'));
        header.setAttribute('data-sort-direction', newDirection);

        rows.sort((a, b) => {
            let aVal, bVal;

            if (columnIndex === 0) {
                aVal = a.querySelector('td:nth-child(1)').textContent.trim();
                bVal = b.querySelector('td:nth-child(1)').textContent.trim();
            } else if (columnIndex === 1) {
                aVal = a.querySelector('td:nth-child(2)').textContent.trim();
                bVal = b.querySelector('td:nth-child(2)').textContent.trim();
                const roleOrder = {'Leader': 0, 'General': 1, 'Officer': 2, 'Member': 3};
                return (roleOrder[aVal] - roleOrder[bVal]) * (newDirection === 'asc' ? 1 : -1);
            } else if (columnIndex === 2) {
                const sortByDaily = header.getAttribute('data-sort-by') === 'daily';
                
                if (sortByDaily) {
                    aVal = parseValue(a.querySelector('td:nth-child(3) div:last-child').textContent.trim());
                    bVal = parseValue(b.querySelector('td:nth-child(3) div:last-child').textContent.trim());
                } else {
                    aVal = parseValue(a.querySelector('td:nth-child(3) div:first-child').textContent.trim());
                    bVal = parseValue(b.querySelector('td:nth-child(3) div:first-child').textContent.trim());
                }
            } else if (columnIndex === 3) {
                const aCell = a.querySelector('td:nth-child(4)');
                const bCell = b.querySelector('td:nth-child(4)');

                aVal = getActivityValue(aCell);
                bVal = getActivityValue(bCell);

                if (aVal === bVal && aVal < 999) {
                    const aUse = aCell.querySelector('use');
                    const bUse = bCell.querySelector('use');
                    if (aUse && bUse) {
                        const aActivity = aUse.getAttribute('href').split('#').pop();
                        const bActivity = bUse.getAttribute('href').split('#').pop();
                        return aActivity.localeCompare(bActivity) * (newDirection === 'asc' ? 1 : -1);
                    }
                }
            } else if (columnIndex === 4) {
                aVal = a.querySelector('td:nth-child(5) div').textContent.trim();
                bVal = b.querySelector('td:nth-child(5) div').textContent.trim();
                const statusOrder = {'Online': 0, 'Hidden': 1, 'Offline': 2};
                return (statusOrder[aVal] - statusOrder[bVal]) * (newDirection === 'asc' ? 1 : -1);
            }

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return aVal.localeCompare(bVal) * (newDirection === 'asc' ? 1 : -1);
            }

            if (aVal < bVal) return newDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return newDirection === 'asc' ? 1 : -1;
            return 0;
        });

        rows.forEach(row => tbody.appendChild(row));
    }

    const style = document.createElement('style');
    style.textContent = `
        th[data-sort-direction]:after {
            content: ' ⇅';
            opacity: 0.3;
        }
        th[data-sort-direction="asc"]:after {
            content: ' ↑';
            opacity: 1;
        }
        th[data-sort-direction="desc"]:after {
            content: ' ↓';
            opacity: 1;
        }
        .highlight-yellow {
            background-color: rgba(255, 255, 0, 0.1) !important;
        }
        .highlight-orange {
            background-color: rgba(255, 165, 0, 0.15) !important;
        }
        .highlight-red {
            background-color: rgba(255, 0, 0, 0.15) !important;
        }
        .highlight-self {
            background-color: rgba(0, 255, 0, 0.15) !important;
        }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver((mutations) => {
        if (document.querySelector('.GuildPanel_membersTable__1NwIX')) {
            addSortingButtons();
            addRowHighlighting();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addSortingButtons();
    addRowHighlighting();
})();
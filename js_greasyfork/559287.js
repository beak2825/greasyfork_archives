// ==UserScript==
// @name        All Custom Bookmarks
// @namespace   http://tampermonkey.net/
// @version     1.4
// @description Adds custom tables for social clubs, a stalk list, and Turkish Asians to the bookmarks page.
// @author      You
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/Bookmarks
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/559287/All%20Custom%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/559287/All%20Custom%20Bookmarks.meta.js
// ==/UserScript==

(function() {
    'use strict';

// === EDIT THIS SECTION FOR SOCIAL CLUBS ===
// Just add/remove entries from this array. IDs will be assigned automatically.
const customSocialClubs = [
    { name: "ꃋᴖꃋ", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7478' },
    { name: 'KEIJI', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7251' },
    { name: 'つー', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7359' },
    { name: 'BAEK', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/6803' },
    { name: 'OUCHI!', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7315' },
    { name: '유휴 마을', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/6057' },
    { name: '505', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/6778' },
    { name: 'Dragons ランドリー', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/6314' },
    { name: '一期一会', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7476' },
    { name: 'lainybaby ⭐', url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7370' },
    { name: "yokai's dance", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7348' },
    { name: "moon ムーン ⭐", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/5898' },
    { name: "chameleons ⭐", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7252' },
    { name: "stalk list", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7253' },
    { name: "turkish asians", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7256' },
    { name: "OLALA", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7257' },
    { name: "BINNS", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7266' },
    { name: "solo asians", url: '/World/Popmundo.aspx/SocialClub/AchievementPoints/7265' },

];

    // === EDIT THIS SECTION FOR THE STALK LIST ===
    // The key is the character's ID.
    const customStalkList = {
        '2699715': { name: 'Lolita Winterbourn', url: '/World/Popmundo.aspx/Character/2699715' },
        '3107170': { name: 'Aliyah Li', url: '/World/Popmundo.aspx/Character/3107170' },
        '3108138': { name: 'XinJie Diamantis', url: '/World/Popmundo.aspx/Character/3108138' },
        '3574901': { name: 'Mickey Slater', url: '/World/Popmundo.aspx/Character/3574901' },
        '3166293': { name: 'Kiyoko Diamantis', url: '/World/Popmundo.aspx/Character/3166293' },
        '3618632': { name: 'Anna Garipoğlu', url: '/World/Popmundo.aspx/Character/3618632' },

        // Add more IDs and names here.
    };

    // === UPDATED SECTION FOR TURKISH ASIANS ===
    const customTurkishAsians = {
        '2913778': { name: 'Chae-Rin Choi', url: '/World/Popmundo.aspx/Character/2913778' },
        '3610148': { name: 'Chiyuki Mikkelsen', url: '/World/Popmundo.aspx/Character/3610148' },
        '1912560': { name: 'Mei Moon-Dragon', url: '/World/Popmundo.aspx/Character/1912560' },
        '3610205': { name: 'Uma Sugihara', url: '/World/Popmundo.aspx/Character/3610205' },
        '3549968': { name: 'Nana Moon', url: '/World/Popmundo.aspx/Character/3549968' },
        '3537089': { name: 'Vita Matsuzawa', url: '/World/Popmundo.aspx/Character/3537089' },

        // Add more IDs and names here.
    };

    // === NEW SECTION FOR OLALA ===
    const customOlala = {
        '3425107': { name: 'Haskell Curry', url: '/World/Popmundo.aspx/Character/3425107' },
        '3614055': { name: 'James Satanás', url: '/World/Popmundo.aspx/Character/3614055' },
        '3559444': { name: 'Nuri Öyken', url: '/World/Popmundo.aspx/Character/3559444' },
        '1488072': { name: 'Thraex Weisdorf', url: '/World/Popmundo.aspx/Character/1488072' },
        '1815938': { name: 'Steve Harris', url: '/World/Popmundo.aspx/Character/1815938' },
        '3571403': { name: 'Derrick Belfort', url: '/World/Popmundo.aspx/Character/3571403' },
    };

    // === NEW SECTION FOR BINNS ===
    const customBinns = {
        '3576410': { name: 'Jay Lynx Jun', url: '/World/Popmundo.aspx/Character/3576410' },
        '3556385': { name: 'Lucas Sky', url: '/World/Popmundo.aspx/Character/3556385' },
        '3617745': { name: 'Taiki Ikeda 💤', url: '/World/Popmundo.aspx/Character/3617745' },
        '3542726': { name: 'Mika Park', url: '/World/Popmundo.aspx/Character/3542726' },
    };

    // === NEW SECTION FOR SOLOsians ===
    const customSolosians = {
        '3555838': { name: 'Devon Xue', url: '/World/Popmundo.aspx/Character/3555838' },
        '3613373': { name: 'Toshimitsu Uesugi', url: '/World/Popmundo.aspx/Character/3613373' },
    };

    /**
     * Creates and inserts a new table with the provided data and title.
     * @param {string} title The title for the table header.
     * @param {object} data The object containing the bookmarks to add.
     * @param {HTMLElement} insertionPoint The HTML element to insert the new table after.
     */
    function insertCustomTable(title, data, insertionPoint) {
        if (!data || Object.keys(data).length === 0) {
            return;
        }
        // Check if the table already exists to prevent duplicates.
        if (document.querySelector(`table.data[data-title="${title}"]`)) {
            return;
        }

        const newTable = document.createElement('table');
        newTable.className = 'data';
        newTable.setAttribute('data-title', title); // Custom attribute to prevent duplicates.

        const tbody = document.createElement('tbody');
        newTable.appendChild(tbody);

        // Create the table header.
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>${title}</th>
            <th class="width30"></th>
            <th class="width10 right">Actions</th>
        `;
        tbody.appendChild(headerRow);

        let counter = 0;
        for (const id in data) {
            const info = data[id];

            const newRow = document.createElement('tr');
            const rowClass = (counter % 2 === 0) ? 'odd' : 'even';
            newRow.className = rowClass;

            const firstCell = document.createElement('td');
            const link = document.createElement('a');
            link.href = info.url;
            link.textContent = info.name;
            firstCell.appendChild(link);
            newRow.appendChild(firstCell);

            const secondCell = document.createElement('td');
            newRow.appendChild(secondCell);

            const thirdCell = document.createElement('td');
            thirdCell.className = 'right';
            newRow.appendChild(thirdCell); // Corrected this line

            tbody.appendChild(newRow);
            counter++;
        }

        insertionPoint.after(newTable);
    }

    // Main function to run when the page is ready.
    function runScript() {
        const artistsTableHeader = Array.from(document.querySelectorAll('th')).find(th => th.textContent.trim() === 'Artists & Criminal Crews');

        if (!artistsTableHeader) {
            return;
        }

        let lastInsertedTable = artistsTableHeader.closest('table');
        if (!lastInsertedTable) {
            return;
        }

        // Insert Social Clubs table.
        insertCustomTable('Social Clubs', customSocialClubs, lastInsertedTable);
        const socialClubsTable = lastInsertedTable.nextElementSibling;
        if (socialClubsTable) {
            lastInsertedTable = socialClubsTable;
        }

        // Insert Stalk List table.
        insertCustomTable('Stalk List', customStalkList, lastInsertedTable);
        const stalkListTable = lastInsertedTable.nextElementSibling;
        if (stalkListTable) {
            lastInsertedTable = stalkListTable;
        }

        // Insert Turkish Asians table.
        insertCustomTable('Turkish Asians', customTurkishAsians, lastInsertedTable);
        const turkishAsiansTable = lastInsertedTable.nextElementSibling;
        if (turkishAsiansTable) {
            lastInsertedTable = turkishAsiansTable;
        }

        // Insert OLALA table.
        insertCustomTable('OLALA', customOlala, lastInsertedTable);
        const olalaTable = lastInsertedTable.nextElementSibling;
        if (olalaTable) {
            lastInsertedTable = olalaTable;
        }

        // Insert BINNS table.
        insertCustomTable('BINNS', customBinns, lastInsertedTable);
        const binnsTable = lastInsertedTable.nextElementSibling;
        if (binnsTable) {
            lastInsertedTable = binnsTable;
        }

        // Insert SOLOsians table.
        insertCustomTable('SOLOsians', customSolosians, lastInsertedTable);
    }

    // Use a MutationObserver to ensure the script runs after the content loads.
    const observer = new MutationObserver((mutations, obs) => {
        const artistsTableHeader = Array.from(document.querySelectorAll('th')).find(th => th.textContent.trim() === 'Artists & Criminal Crews');
        if (artistsTableHeader) {
            runScript();
            obs.disconnect();
        }
    });

    // Start observing the body for changes.
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
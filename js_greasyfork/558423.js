// ==UserScript==
// @name         Elim Reveal
// @description  Shows the Team a Player belongs to
// @version      1.1.1
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @namespace https://greasyfork.org/users/1279378
// @downloadURL https://update.greasyfork.org/scripts/558423/Elim%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/558423/Elim%20Reveal.meta.js
// ==/UserScript==

'use strict';

const teamPics = {
    'Metalheads': 'metalheads-dark',
    'Village Idiots': 'village-idiots-dark',
    'Pink Power': 'pink-power-dark',
    'Pacifists': 'pacifists-dark',
    'Lumberjacks': 'lumberjacks-dark',
    'Team Cupcake': 'team-cupcake-dark',
    'Punchbags': 'punchbags-dark',
    'Breakfast Club': 'breakfast-club-dark',
    'Murder Hornets': 'murder-hornets-dark',
    'Terror Bytes': 'terror-bytes-dark',
    'Peasants': 'peasants-dark',
    'Total Bankers': 'total-bankers-dark'
};

let apiKey = GM_getValue('apiKey');
if (!apiKey) {
    apiKey = prompt("Enter ApiKey");
    GM_setValue('apiKey', apiKey);
}

const resolveTeamPic = teamName =>
    `https://www.torn.com/images/v2/competition/elimination/team-icons/${teamPics[teamName] || 'default'}.svg`;

const fetchPlayerCompetitionData = async userId => {
    try {
        const res = await fetch(`https://api.torn.com/v2/user/${userId}/competition`, {
            headers: { 'accept': 'application/json', 'Authorization': `ApiKey ${apiKey}` }
        });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error('Fetch failed:', err);
        GM_setValue('apiKey', '');
        apiKey = '';
        alert('API request failed. Your API key has been cleared, please enter it again.');
        throw err;
    }
};


const pages = [
    {
        check: () => location.pathname.startsWith('/factions.php'),
        selector: 'div.honorWrap___BHau4 a[href*="profiles.php"] > div.honor-text-wrap'
    },
    {
        check: () => location.pathname.startsWith('/page.php') && location.search.includes('sid=UserList'),
        selector: 'a.user.name > div.honor-text-wrap'
    }
];

setTimeout(() => {
    const pageConfig = pages.find(p => p.check());
    if (!pageConfig) return;

    document.querySelectorAll(pageConfig.selector).forEach(honorWrap => {
        if (honorWrap.dataset.elimInserted) return;

        const profileLink = honorWrap.closest('a[href*="profiles.php"]');
        const playerId = profileLink?.href.match(/XID=(\d+)/)?.[1];
        if (!playerId) return;

        fetchPlayerCompetitionData(playerId).then(data => {
            const teamName = data?.competition?.team;
            if (!teamName) return;

            const elimDiv = document.createElement('div');
            elimDiv.className = 'imgWrap___Elim';
            Object.assign(elimDiv.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                pointerEvents: 'none',
                zIndex: '1000',
                backgroundColor: '#191919',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
                width: '24px',
                height: '24px',
                padding: '2px'
            });

            const img = document.createElement('img');
            img.src = resolveTeamPic(teamName);
            Object.assign(img.style, {
                width: '20px',
                height: '20px',
                objectFit: 'contain'
            });

            elimDiv.appendChild(img);
            honorWrap.style.position = 'relative';
            if (teamPics[teamName]){
            honorWrap.appendChild(elimDiv);
            }

            honorWrap.dataset.elimInserted = '1';
        });
    });
}, 1000);

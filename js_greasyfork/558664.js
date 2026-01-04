// ==UserScript==
// @name         Lazy Shady
// @namespace    http://tampermonkey.net/
// @version      2025-12-10
// @description  Lazy
// @author       Elvay [3095345]
// @match        https://www.torn.com/*
// @run-at       document-idle
// @match        https://www.torn.com/page.php?sid=events
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558664/Lazy%20Shady.user.js
// @updateURL https://update.greasyfork.org/scripts/558664/Lazy%20Shady.meta.js
// ==/UserScript==

(function() {
    const base = "https://www.torn.com/images/v2/competition/elimination/team-icons/";

    const teams = [
        { name: "Breakfast Club",  file: "breakfast-club-dark",  id: 36 },
        { name: "Metalheads",      file: "metalheads-dark",      id: 68 },
        { name: "Murder Hornets",  file: "murder-hornets-dark",  id: 47 },
        { name: "Total Bankers",   file: "total-bankers-dark",   id: 52 },
        { name: "Punchbags",       file: "punchbags-dark",       id: 34 },
        { name: "Team Cupcake",    file: "team-cupcake-dark",    id: 33 },
        { name: "Terror Bytes",    file: "terror-bytes-dark",    id: 49 },
        { name: "Pink Power",      file: "pink-power-dark",      id: 1  },
        { name: "Peasants",        file: "peasants-dark",        id: 50 },
        { name: "Pacifists",       file: "pacifists-dark",       id: 14 },
        { name: "Lumberjacks",     file: "lumberjacks-dark",     id: 32 },
        { name: "Village Idiots",  file: "village-idiots-dark",  id: 69 }
    ];

    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.top = '50%';
    box.style.right = '20px';
    box.style.transform = 'translateY(-50%)';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.gap = '8px';
    box.style.zIndex = '99999';

    teams.forEach(t => {
        const a = document.createElement('a');
        a.href = `https://www.torn.com/page.php?sid=competition#/team/${t.id}`;
        a.style.display = 'flex';
        a.style.alignItems = 'center';
        a.style.gap = '6px';
        a.style.padding = '6px 10px';
        a.style.background = '#222';
        a.style.color = '#fff';
        a.style.textDecoration = 'none';
        a.style.borderRadius = '6px';
        a.style.fontSize = '12px';
        a.style.whiteSpace = 'nowrap';

        const img = document.createElement('img');
        img.src = `${base}${t.file}.svg`;
        img.style.width = '18px';
        img.style.height = '18px';

        a.appendChild(img);
        a.appendChild(document.createTextNode(t.name));
        box.appendChild(a);
    });

    document.body.appendChild(box);
})();
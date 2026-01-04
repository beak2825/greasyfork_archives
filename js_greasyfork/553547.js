// ==UserScript==
// @name         Perplexity Chat + Code Color Control - Verbeterd contrast en zichtbaarheid
// @namespace    https://greasyfork.org/users/yourname
// @version      7.1
// @description  Verander zowel chattekstkleur als kleur van codeblokken op Perplexity.ai met betere contrast en zichtbare knop
// @match        https://www.perplexity.ai/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553547/Perplexity%20Chat%20%2B%20Code%20Color%20Control%20-%20Verbeterd%20contrast%20en%20zichtbaarheid.user.js
// @updateURL https://update.greasyfork.org/scripts/553547/Perplexity%20Chat%20%2B%20Code%20Color%20Control%20-%20Verbeterd%20contrast%20en%20zichtbaarheid.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    console.log("Script gestart na pagina laden");

    // Beschikbare normale HTML-kleuren
    const colorList = [
        "black", "gray", "dimgray", "silver", "white",
        "red", "firebrick", "crimson", "tomato", "salmon",
        "orange", "coral", "darkorange", "gold", "goldenrod",
        "yellow", "khaki", "ivory", "beige", "lemonchiffon",
        "green", "lime", "forestgreen", "seagreen", "olive",
        "teal", "aqua", "turquoise", "lightseagreen", "mediumaquamarine",
        "blue", "dodgerblue", "royalblue", "skyblue", "deepskyblue",
        "navy", "indigo", "purple", "violet", "deeppink",
        "plum", "orchid", "magenta", "brown", "sienna",
        "tan", "chocolate", "peru", "burlywood", "rosybrown"
    ];

    // Functie om chat + codekleur te veranderen met hoog contrast achtergrond
    function applyAllTextColor(color) {
        GM_addStyle(`
            /* AI chat-tekst */
            .prose, .text-base, .text-sm, .leading-relaxed,
            [data-testid*="message"], [class*="flex items-start"] p {
                color: ${color} !important;
                text-shadow: 0 0 3px rgba(0,0,0,0.7) !important;
                transition: color 0.3s ease;
            }

            /* Codeblokken en binnenin code-tags */
            pre, code, .code, .highlight, .hljs, span[class*="token"] {
                color: ${color} !important;
                text-shadow: 0 0 4px rgba(0,0,0,0.9) !important;
                background: rgba(10,10,10,0.95) !important;
                border-radius: 6px;
                padding: 3px 6px;
                transition: color 0.3s ease, background 0.3s ease;
            }
        `);
        localStorage.setItem('chatCodeColor', color);
        console.log("Kleur toegepast:", color);
    }

    // Herstel vorige kleur
    const saved = localStorage.getItem('chatCodeColor') || 'white';
    applyAllTextColor(saved);

    // Hoofdknop (🎨)
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = "🎨";
    Object.assign(toggleBtn.style, {
        position: 'fixed',
        bottom: '18px',
        right: '18px',
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: 'rgba(35,35,35,0.85)',
        color: '#fff',
        cursor: 'pointer',
        border: '1px solid #666',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        fontSize: '18px',
        zIndex: '9999',
        transition: 'transform 0.25s ease'
    });
    toggleBtn.onmouseover = () => toggleBtn.style.transform = 'scale(1.15)';
    toggleBtn.onmouseout  = () => toggleBtn.style.transform = 'scale(1)';
    document.body.appendChild(toggleBtn);
    console.log("Knop toegevoegd aan body");

    // Paneel met kleuropties
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        bottom: '65px',
        right: '20px',
        background: 'rgba(20,20,20,0.9)',
        padding: '6px',
        borderRadius: '8px',
        display: 'none',
        flexWrap: 'wrap',
        gap: '5px',
        width: '180px',
        maxHeight: '220px',
        overflowY: 'auto',
        boxShadow: '0 0 10px rgba(0,0,0,0.6)',
        border: '1px solid #555',
        zIndex: '9999'
    });

    // Voeg knoppen toe voor kleur keuze
    colorList.forEach(color => {
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            background: color,
            width: '22px',
            height: '22px',
            borderRadius: '4px',
            border: '1px solid #222',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
        });
        btn.title = color;
        btn.onmouseover = () => btn.style.transform = 'scale(1.25)';
        btn.onmouseout  = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => {
            applyAllTextColor(color);
            panel.style.display = 'none';
        };
        panel.appendChild(btn);
    });
    document.body.appendChild(panel);
    console.log("Kleurpaneel toegevoegd");

    // Toon/verberg het paneel bij klik
    toggleBtn.onclick = () => {
        panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    };

    // Observeer voor dynamische chat updates en zet kleur altijd juist
    const observer = new MutationObserver(() => {
        const color = localStorage.getItem('chatCodeColor');
        if (color) applyAllTextColor(color);
    });
    observer.observe(document.body, { childList: true, subtree: true });
});
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-10-24
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
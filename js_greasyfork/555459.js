// ==UserScript==
// @name         Torn Gym - Highlight Highest Steadfast (PDA Compatible, Overlay Fix + Shadow Overlay)
// @namespace    https://www.torn.com/
// @version      1.0
// @description  Highlights gym stat(s) with highest steadfast value via API (works on PDA) with overlay fix for shadows
// @match        https://www.torn.com/gym.php*
// @match        https://www.torn.com/pda.php*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555459/Torn%20Gym%20-%20Highlight%20Highest%20Steadfast%20%28PDA%20Compatible%2C%20Overlay%20Fix%20%2B%20Shadow%20Overlay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555459/Torn%20Gym%20-%20Highlight%20Highest%20Steadfast%20%28PDA%20Compatible%2C%20Overlay%20Fix%20%2B%20Shadow%20Overlay%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'BSLhkrAUYJagRWwD'; // replace with your API key
    const API_URL = `https://api.torn.com/user/?selections=perks&key=${API_KEY}`;
    const STATS = ["strength", "defense", "speed", "dexterity"];

    // Inject overlay CSS
    const style = document.createElement('style');
    style.textContent = `
        .steadfast-overlay {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none;
            z-index: 1000;
            border-radius: 10px;
            box-shadow: 0 0 15px 3px rgba(0,204,102,0.6);
            outline: 3px solid #00cc66;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            transform: scale(1.03);
        }
        .steadfast-wrapper {
            position: relative;
        }
    `;
    document.head.appendChild(style);

    function fetchJson(url) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: resp => {
                        try { resolve(JSON.parse(resp.responseText)); }
                        catch (e) { reject(e); }
                    },
                    onerror: reject
                });
            } else {
                fetch(url).then(r => r.json()).then(resolve).catch(reject);
            }
        });
    }

    function parseSteadfast(perksData) {
        const allPerks = [
            ...(perksData.faction_perks || []),
            ...(perksData.education_perks || []),
            ...(perksData.job_perks || []),
            ...(perksData.property_perks || []),
            ...(perksData.merit_perks || []),
            ...(perksData.enhancer_perks || []),
            ...(perksData.book_perks || []),
            ...(perksData.stock_perks || [])
        ];

        const steadfast = {};
        for (const stat of STATS) {
            const regex = new RegExp(`\\+\\s*(\\d+(?:\\.\\d+)?)%\\s*${stat}\\s+gym\\s+gains`, 'i');
            const match = allPerks.find(p => regex.test(p));
            steadfast[stat] = match ? parseFloat(match.match(regex)[1]) : 0;
        }
        return steadfast;
    }

    function highlightStats(steadfast) {
        const maxValue = Math.max(...Object.values(steadfast));
        const bestStats = Object.keys(steadfast).filter(s => steadfast[s] === maxValue);

        const listItems = document.querySelectorAll(
            'li[class*="strength__"], li[class*="defense__"], li[class*="speed__"], li[class*="dexterity__"]'
        );

        listItems.forEach(li => {
            // Remove previous overlay if exists
            const existingOverlay = li.querySelector('.steadfast-overlay');
            if (existingOverlay) existingOverlay.remove();

            // Reset wrapper
            li.classList.remove('steadfast-wrapper');

            const h3 = li.querySelector('h3');
            if (!h3) return;
            let name = h3.textContent.trim().toLowerCase();

            if (name === 'str') name = 'strength';
            if (name === 'dex') name = 'dexterity';
            if (name === 'spd') name = 'speed';
            if (name === 'def') name = 'defense';

            if (bestStats.includes(name)) {
                // Wrap li content for overlay isolation
                li.classList.add('steadfast-wrapper');

                const overlay = document.createElement('div');
                overlay.className = 'steadfast-overlay';
                li.appendChild(overlay);
            }
        });
    }

    async function runHighlight() {
        try {
            const data = await fetchJson(API_URL);
            const steadfast = parseSteadfast(data);
            highlightStats(steadfast);
            console.log('Steadfast values:', steadfast);
        } catch (e) {
            console.error('Failed to fetch steadfast values:', e);
        }
    }

    const observer = new MutationObserver(runHighlight);
    observer.observe(document.body, { childList: true, subtree: true });

    runHighlight();
})();

// ==UserScript==
// @name         Torn Utilities + More Legible Names (Nova Edition)
// @namespace    nova.torn.utilities.combo
// @version      3.1
// @description  Combines Torn Utilities (Last Action + Faction Inactivity) with clearer, larger player name text on honor bars.
// @author       Nova & GingerBeardMan & TheFoxMan
// @match        https://www.torn.com/*
// @grant        none
// @license      Apache 2.0 + GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/554129/Torn%20Utilities%20%2B%20More%20Legible%20Names%20%28Nova%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554129/Torn%20Utilities%20%2B%20More%20Legible%20Names%20%28Nova%20Edition%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //////////////////////////////////////////////////////////////////////
    // PART 1 — TORN UTILITIES: LAST ACTION + FACTION INACTIVITY
    //////////////////////////////////////////////////////////////////////

    const APIKEY_STORAGE = 'tornApiKey';
    const activityHighlights = [
        [1, 1, '#FFFFFF40'],
        [2, 4, '#ff990060'],
        [5, 6, '#FF000060'],
        [7, 999, '#cc00ff60']
    ];

    const { fetch: origFetch } = window;

    function isDarkMode() {
        return document.documentElement.classList.contains('dark-mode')
            || document.body.classList.contains('dark-mode')
            || window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function convert(seconds) {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(' ');
    }

    async function getApiKey() {
        let key = localStorage.getItem(APIKEY_STORAGE);
        if (!key) {
            key = prompt('Enter your Torn API key (Display or Faction permission only):');
            if (key) localStorage.setItem(APIKEY_STORAGE, key);
        }
        return key;
    }

    // Mini-profile monitor (always active)
    window.fetch = async (...args) => {
        const [url] = args;
        const response = await origFetch(...args);

        if (typeof url === 'string' && url.includes('page.php?sid=UserMiniProfile')) {
            response.clone().json().then(body => {
                const seconds = body?.user?.lastAction?.seconds;
                if (seconds !== undefined) insertMiniProfile(seconds);
            }).catch(console.error);
        }

        return response;
    };

    function insertMiniProfile(seconds) {
        const root = $('#profile-mini-root');
        const icons = $('.icons', root);
        if (icons.length > 0) {
            $('.laction', root).remove();
            const textColor = isDarkMode() ? '#ccc' : '#333';
            const text = convert(seconds);
            const html = `
                <p class='laction'
                   style='font-size:11px;
                          color:${textColor};
                          float:right;
                          margin:2px 5px 0 0;
                          font-family:"Verdana", "Arial", sans-serif;'>
                    Last Action: ${text}
                </p>`;
            icons.append(html);
        } else {
            setTimeout(insertMiniProfile, 300, seconds);
        }
    }

    function defineFindHelpers() {
        if (!document.find)
            Object.defineProperties(Document.prototype, {
                find: { value: document.querySelector, enumerable: false },
                findAll: { value: document.querySelectorAll, enumerable: false }
            });

        if (!Element.prototype.find)
            Object.defineProperties(Element.prototype, {
                find: { value: Element.prototype.querySelector, enumerable: false },
                findAll: { value: Element.prototype.querySelectorAll, enumerable: false }
            });
    }

    defineFindHelpers();

    function waitFor(sel, parent = document) {
        return new Promise(resolve => {
            const check = setInterval(() => {
                const el = parent.find(sel);
                if (el) {
                    clearInterval(check);
                    resolve(el);
                }
            }, 400);
        });
    }

    async function showFactionLastAction() {
        await waitFor('.faction-info-wrap .members-list .table-body');

        const key = await getApiKey();
        const factionID = document.find('#view-wars')?.parentElement?.getAttribute('href')?.match(/\d+/)?.[0];
        const apiUrl = `https://api.torn.com/faction/${factionID || ''}?selections=basic&key=${key}`;
        const data = await (await fetch(apiUrl)).json();

        document.findAll('.faction-info-wrap .members-list .table-body > li').forEach(row => {
            const profileID = parseInt(row.find("a[href*='profiles.php']").getAttribute("href").split("XID=")[1]);
            const member = data.members?.[profileID];
            if (!member) return;

            const rel = member.last_action.relative;
            const ts = member.last_action.timestamp;
            const days = Math.floor((Date.now() / 1000 - ts) / 86400);

            let color;
            activityHighlights.forEach(rule => {
                if (rule[0] <= days && days <= rule[1]) color = rule[2];
            });

            row.setAttribute('data-last-action', rel);
            if (color) row.style.backgroundColor = color;
        });
    }

    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .faction-info-wrap .members-list .table-body > li::after {
                display: block;
                content: attr(data-last-action);
                font-size: 11px;
                color: ${isDarkMode() ? '#bbb' : '#444'};
                margin-left: 8px;
            }
        </style>`);

    function monitorFactionPage() {
        if (window.location.href.includes('factions.php')) {
            showFactionLastAction();
        }
    }

    let lastURL = location.href;
    new MutationObserver(() => {
        const currentURL = location.href;
        if (currentURL !== lastURL) {
            lastURL = currentURL;
            monitorFactionPage();
        }
    }).observe(document, { subtree: true, childList: true });

    setInterval(() => {
        if (document.querySelector('.faction-info-wrap .members-list .table-body')) {
            showFactionLastAction();
        }
    }, 15000);

    console.log('%c[Torn Utilities]', 'color:#4CAF50', 'Loaded');

    //////////////////////////////////////////////////////////////////////
    // PART 2 — TORN: MORE LEGIBLE PLAYER NAMES
    //////////////////////////////////////////////////////////////////////

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.textContent = `
        .custom-honor-text {
            font-family: 'Manrope', sans-serif !important;
            font-weight: 700 !important;
            font-size: 12px !important;
            color: white !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            pointer-events: none !important;
            position: absolute !important;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: 100% !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            z-index: 10 !important;
        }
        .honor-text-svg { display: none !important; }
        .outline-black { text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000 !important; }
        .outline-blue { text-shadow: -1px -1px 0 #310AF5, 1px -1px 0 #310AF5, -1px 1px 0 #310AF5, 1px 1px 0 #310AF5 !important; }
        .outline-red { text-shadow: -1px -1px 0 #ff4d4d, 1px -1px 0 #ff4d4d, -1px 1px 0 #ff4d4d, 1px 1px 0 #ff4d4d !important; }
        .outline-green { text-shadow: -1px -1px 0 #3B9932, 1px -1px 0 #3B9932, -1px 1px 0 #3B9932, 1px 1px 0 #3B9932 !important; }
        .outline-orange { text-shadow: -1px -1px 0 #ff9c40, 1px -1px 0 #ff9c40, -1px 1px 0 #ff9c40, 1px 1px 0 #ff9c40 !important; }
        .outline-purple { text-shadow: -1px -1px 0 #c080ff, 1px -1px 0 #c080ff, -1px 1px 0 #c080ff, 1px 1px 0 #c080ff !important; }
    `;
    document.head.appendChild(style);

    function getOutlineClass(wrap) {
        if (wrap.classList.contains('admin')) return 'outline-red';
        if (wrap.classList.contains('officer')) return 'outline-green';
        if (wrap.classList.contains('moderator')) return 'outline-orange';
        if (wrap.classList.contains('helper')) return 'outline-purple';
        if (wrap.classList.contains('blue')) return 'outline-blue';
        return 'outline-black';
    }

    function replaceHonorText() {
        document.querySelectorAll('.honor-text-wrap').forEach(wrap => {
            const sprite = wrap.querySelector('.honor-text-svg');
            const existing = wrap.querySelector('.custom-honor-text');
            if (sprite) sprite.style.display = 'none';
            if (existing) return;
            const text = wrap.getAttribute('data-title') || wrap.getAttribute('aria-label') || wrap.innerText || '';
            const cleaned = text.trim().toUpperCase();
            if (!cleaned) return;
            const div = document.createElement('div');
            div.className = `custom-honor-text ${getOutlineClass(wrap)}`;
            div.textContent = cleaned;
            wrap.appendChild(div);
        });
    }

    replaceHonorText();
    new MutationObserver(replaceHonorText).observe(document.body, { childList: true, subtree: true });

    console.log('%c[Legible Names]', 'color:#1E90FF', 'Loaded');
})();

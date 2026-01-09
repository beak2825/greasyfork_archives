// ==UserScript==
// @name         Torn Profile Link Formatter 2.0
// @namespace    Torn.com
// @version      1.6.30
// @description  Adds a copy button next to user names on profile, faction, and ranked war pages for easy sharing.
// @author       SuperGogu[3580072] - modified by
// @match        https://www.torn.com/profiles.php?XID=*
// @match        https://www.torn.com/factions.php*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/557226/Torn%20Profile%20Link%20Formatter%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/557226/Torn%20Profile%20Link%20Formatter%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const debug = false; // Set to true for verbose logging

    // --- Add Styles for the UI ---
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(`
            .gnsc-copy-container { display: inline-flex; align-items: center; vertical-align: middle; gap: 5px; margin-left: 10px; }
            .gnsc-btn { background-color: #333; color: #DDD; border: 1px solid #555; border-radius: 5px; padding: 3px 8px; text-decoration: none; font-size: 12px; line-height: 1.5; font-weight: bold; cursor: pointer; white-space: nowrap; }
            .gnsc-btn:hover { background-color: #444; }
            .gnsc-list-btn { margin-left: 3px; cursor: pointer; font-size: 14px; display: inline-block; vertical-align: middle; width: 18px; text-align: center; }
            .gnsc-faction-copy-btn { margin-left: 8px; cursor: pointer; font-size: 14px; vertical-align: middle; }
            .buttons-list .gnsc-list-btn { padding: 4px; font-size: 16px; height: 34px; line-height: 26px; } /* Mini profile button style */

/* War rank: place 📄 next to Level and keep it clickable */
.gnsc-war-rank li.enemy .level { position: relative !important; overflow: visible !important; }
.gnsc-war-rank li.enemy .level .gnsc-list-btn {
    display: inline-block !important;
    margin-left: 3px !important;
    z-index: 2147483647 !important;
    pointer-events: auto !important;
    cursor: pointer !important;
    background: rgba(0,0,0,0.25);
    border-radius: 4px;
}

/* War view: place 📄 next to Level (war/<id>) and keep it clickable */
.gnsc-war-view li.enemy .level { position: relative !important; overflow: visible !important; }
.gnsc-war-view li.enemy .level .gnsc-list-btn {
    display: inline-block !important;
    margin-left: 3px !important;
    z-index: 2147483647 !important;
    pointer-events: auto !important;
    cursor: pointer !important;
    background: rgba(0,0,0,0.25);
    border-radius: 4px;
}

/* Enemy faction profile (factions.php?step=profile&ID=...) members list: place 📄 next to Level */
.gnsc-faction-enemy li.table-row .table-cell.lvl { position: relative !important; overflow: visible !important; }
.gnsc-faction-enemy li.table-row .table-cell.lvl .gnsc-list-btn {
    display: inline-block !important;
    margin-left: 3px !important;
    z-index: 2147483647 !important;
    pointer-events: auto !important;
    cursor: pointer !important;
    background: rgba(0,0,0,0.25);
    border-radius: 4px;
}

`);
    }

    // --- Page Initialization Logic ---

function setPageFlags() {
    const h = window.location.hash || '';
    const isRank = h.includes('/war/rank');
    const isChain = h.includes('/war/chain');
    const isWarView = !isRank && !isChain && /\/war\/\d+/.test(h);
    const params = new URLSearchParams(window.location.search);
    const isEnemyFactionProfile = window.location.pathname.includes('factions.php') && params.get('step') === 'profile' && params.has('ID') && !/\/war\//.test(h);
    document.documentElement.classList.toggle('gnsc-war-rank', isRank);
    document.documentElement.classList.toggle('gnsc-war-view', isWarView);
    document.documentElement.classList.toggle('gnsc-faction-enemy', isEnemyFactionProfile);
}


    function initProfilePage() {
        const nameElement = document.querySelector('#skip-to-content');
        const infoTable = document.querySelector('.basic-information .info-table');
        const alreadyInjected = document.querySelector('.gnsc-copy-container');
        if (nameElement && infoTable && infoTable.children.length > 5 && !alreadyInjected) {
            mainProfile(nameElement, infoTable);
            return true;
        }
        return false;
    }

    function initFactionPage() {
        const memberLists = document.querySelectorAll('.members-list, .enemy-list, .your-faction');
        if (memberLists.length > 0) {
            memberLists.forEach(list => injectButtonsIntoList(list));
            return true;
        }
        return false;
    }

    function initRankedWarPage() {
        const factionNames = document.querySelectorAll('.faction-names .name___PlMCO');
        factionNames.forEach(nameDiv => {
            if (!nameDiv.querySelector('.gnsc-faction-copy-btn')) {
                const button = document.createElement('span');
                button.className = 'gnsc-faction-copy-btn';
                button.textContent = '🔗';
                button.title = 'Copy Faction Link';
                button.addEventListener('click', (e) => handleFactionCopyClick(e, button, nameDiv.classList.contains('left')));
                nameDiv.querySelector('.text___chra_').appendChild(button);
            }
        });
    }

function initChainAttackList() {
    const chainLists = document.querySelectorAll('.chain-attacks-list');
    if (!chainLists.length) return;

    chainLists.forEach(list => {
        const rows = list.querySelectorAll('li');
        rows.forEach(row => {
            const leftPlayer  = row.querySelector('.player.left-player');
            const rightPlayer = row.querySelector('.player.right-player');
            const arrow       = row.querySelector('.arrow');

            if (!leftPlayer || !rightPlayer || !arrow) return;

            if (row.querySelector('.gnsc-chain-copy-btn')) return;

            const memberElement = rightPlayer.querySelector('.member') || rightPlayer;
            const nameLink = memberElement.querySelector('a[href*="profiles.php"]');
            if (!nameLink) return;

            const button = document.createElement('span');
            button.className = 'gnsc-list-btn gnsc-chain-copy-btn';
            button.textContent = '📄';
            button.title = 'Copy target';

            button.addEventListener('click', (e) => {
                handleListCopyClick(e, button, memberElement);
            });

            if (!arrow.style.position) {
                arrow.style.position = 'relative';
            }
            button.style.position = 'absolute';
            button.style.top = '50%';
            button.style.left = '50%';
            button.style.transform = 'translate(-50%, -50%)';
            button.style.fontSize = '12px';
            button.style.lineHeight = '1';
            button.style.cursor = 'pointer';
            button.style.zIndex = '5';

            arrow.appendChild(button);
        });
    });
}



    function initMiniProfile() {
        const miniProfile = document.querySelector('.profile-mini-_wrapper___Arw8R:not(.gnsc-injected), .mini-profile-wrapper:not(.gnsc-injected)');
        if (miniProfile) {
            miniProfile.classList.add('gnsc-injected');
            let attempts = 0;
            const maxAttempts = 25; // Try for 5 seconds
            const interval = setInterval(() => {
                const buttonContainer = miniProfile.querySelector('.buttons-list');
                const nameLink = miniProfile.querySelector('a[href*="profiles.php?XID="]');
                if (buttonContainer && nameLink && !buttonContainer.querySelector('.gnsc-list-btn')) {
                    clearInterval(interval);
                    const button = document.createElement('span');
                    button.className = 'gnsc-list-btn';
                    button.textContent = '📄';
                    button.title = 'Copy Formatted Link';
                    button.addEventListener('click', (e) => handleListCopyClick(e, button, miniProfile));
                    buttonContainer.insertAdjacentElement('beforeend', button);
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                }
                attempts++;
            }, 200);
        }
    }
    function injectButtonsIntoList(listElement) {
        const members = listElement.querySelectorAll('li.member, li.table-row, li.enemy, li.your');
        const hash = window.location.hash || '';
        const isWarRank = hash.includes('/war/rank');
        const isWarChain = hash.includes('/war/chain');
        const isWarView = !isWarRank && !isWarChain && /\/war\/\d+/.test(hash);
        const params = new URLSearchParams(window.location.search);
        const isEnemyFactionProfile = window.location.pathname.includes('factions.php') && params.get('step') === 'profile' && params.has('ID') && !/\/war\//.test(hash);

        members.forEach(member => {
            const existingBtn = member.querySelector('.gnsc-list-btn');

            const nameLink = member.querySelector('a[href*="profiles.php"]');
            if (!nameLink) return;

            const pickTargetContainer = () => {
                if (isWarRank || isWarView) {
                    return member.querySelector('.level.left, .level');
                }
                if (isEnemyFactionProfile) {
                    return member.querySelector('.table-cell.lvl, .table-cell.lvlCol___kf6Ag, .lvlCol___kf6Ag, .table-cell[class*="lvlCol___"]');
                }
                return null;
            };

            const targetContainer = pickTargetContainer();

            if (existingBtn) {
                if (targetContainer && !targetContainer.contains(existingBtn)) {
                    targetContainer.appendChild(existingBtn);
                }
                return;
            }

            const button = document.createElement('span');
            button.className = 'gnsc-list-btn';
            button.textContent = '📄';
            button.title = 'Copy Formatted Link';
            button.addEventListener('click', (e) => handleListCopyClick(e, button, member));

            if (targetContainer) {
                targetContainer.appendChild(button);
                return;
            }

            nameLink.insertAdjacentElement('afterend', button);
        });
    }

    // --- Profile Page Specific Functions ---


    function getProfileBattleStatsFromBsp() {
        // BSP (or similar) injected table: first header cell "TBS", first data row first cell is the label we want (e.g., 103m / 7.1b / 608k)
        const tables = document.querySelectorAll('table');
        for (const t of tables) {
            const th0 = t.querySelector('th');
            if (!th0) continue;
            const th0Text = (th0.textContent || '').trim().toUpperCase();
            if (th0Text !== 'TBS') continue;

            const rows = t.querySelectorAll('tr');
            if (rows.length < 2) continue;
            const firstDataTd = rows[1].querySelector('td');
            const v = (firstDataTd?.textContent || '').trim();
            if (v) return v;
        }
        return null;
    }

function mainProfile(nameElement, infoTable) {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('XID');
        if (!userId) return;

        const cleanedName = nameElement.textContent.replace("'s Profile", "").split(' [')[0].trim();
        const battleStats = getProfileBattleStatsFromBsp();

        const userInfo = {
            id: userId,
            name: cleanedName,
            profileUrl: `https://www.torn.com/profiles.php?XID=${userId}`,
            attackUrl: `https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${userId}`,
            battleStats: battleStats
        };

        createUI(nameElement, userInfo);
    }

    function createUI(targetElement, userInfo) {
        const container = document.createElement('div');
        container.className = 'gnsc-copy-container';

        const copyButton = document.createElement('a');
        copyButton.href = "#";
        copyButton.className = 'gnsc-btn';
        copyButton.innerHTML = '<span>Copy</span>';
        copyButton.addEventListener('click', (e) => handleCopyClick(e, copyButton, userInfo));

        container.appendChild(copyButton);
        targetElement.insertAdjacentElement('afterend', container);
    }



    function handleCopyClick(e, button, userInfo) {
        e.preventDefault();

        const linkedName = `<a href="${userInfo.profileUrl}">${userInfo.name} [${userInfo.id}]</a>`;
        const attackLink = `<a href="${userInfo.attackUrl}">Attack</a>`;

        const parts = [linkedName];
        if (userInfo.battleStats) parts.push(userInfo.battleStats);
        parts.push(attackLink);

        const htmlToCopy = parts.join(' - ');
        // Keep the plain-text payload as HTML anchors too (matches the user's working workflow).
        copyToClipboard({ html: htmlToCopy, text: htmlToCopy });

        button.innerHTML = '<span>Copied!</span>';
        button.style.backgroundColor = '#2a633a';
        setTimeout(() => { button.innerHTML = '<span>Copy</span>'; button.style.backgroundColor = ''; }, 2000);
    }

    async function handleListCopyClick(e, button, memberElement) {
        e.preventDefault();
        e.stopPropagation();

        const nameLink = memberElement.querySelector('a[href*="profiles.php"]');
        if (!nameLink) return;

        const href = nameLink.getAttribute('href') || nameLink.href || '';
        const idMatch = href.match(/XID=(\d+)/) || (nameLink.href || '').match(/XID=(\d+)/);
        if (!idMatch) return;
        const id = idMatch[1];

        let battleStats = null;
        const injectedStatsEl = memberElement.querySelector('.iconStats');
        if (injectedStatsEl) {
            const v = (injectedStatsEl.textContent || '').trim();
            if (v) battleStats = v;
        }

        const extractNameFromHonorSvg = (el) => {
            if (!el) return '';
            const direct = (el.textContent || '').trim();
            if (direct) return direct;
            const chars = Array.from(el.querySelectorAll('[data-char]'))
                .map(n => (n.getAttribute('data-char') || '').trim())
                .join('');
            return (chars || '').trim();
        };

        const sanitizeName = (name) => {
            let n = (name || '').replace(/\s+/g, ' ').trim();
            if (!n) return '';
            n = n.replace(new RegExp(`\\s*\\[${id}\\]\\s*$`), '').trim();
            n = n.replace(/\s*\[\d+\]\s*$/, '').trim();
            return n;
        };

        const extractDisplayName = () => {
            const plain = nameLink.querySelector('.honor-text:not(.honor-text-svg)');
            let n = sanitizeName(plain ? plain.textContent : '');
            if (n) return n;

            const svg = nameLink.querySelector('.honor-text-svg');
            n = sanitizeName(extractNameFromHonorSvg(svg));
            if (n) return n;

            for (const attr of ['data-placeholder', 'title', 'aria-label']) {
                const v = nameLink.getAttribute(attr);
                n = sanitizeName(v);
                if (n) return n;
            }

            const clone = nameLink.cloneNode(true);
            clone.querySelectorAll('.iconStats, .TDup_ColoredStatsInjectionDiv, svg, img').forEach(n => n.remove());
            n = sanitizeName(clone.textContent);
            if (n) return n;

            n = sanitizeName(nameLink.textContent);
            return n;
        };

        let displayName = extractDisplayName();
        if (battleStats && /^[0-9.]+[kmbt]$/i.test(battleStats) && displayName && displayName.toLowerCase().startsWith(battleStats.toLowerCase())) {
            const rest = displayName.slice(battleStats.length);
            if (rest && /[a-z]/i.test(rest[0])) displayName = rest;
        }
        if (!displayName) displayName = 'User';

        const linkedName = `<a href="https://www.torn.com/profiles.php?XID=${id}">${displayName} [${id}]</a>`;
        const attackLink = `<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${id}">Attack</a>`;

        const parts = [linkedName];
        if (battleStats) parts.push(battleStats);
        parts.push(attackLink);

        const htmlToCopy = parts.join(' - ');
        copyToClipboard({ html: htmlToCopy, text: htmlToCopy });

        button.textContent = '✅';
        button.title = 'Copied!';
        setTimeout(() => {
            button.textContent = '📄';
            button.title = 'Copy Formatted Link';
        }, 1200);
    }

    function handleFactionCopyClick(e, button, isLeftFaction) {
        e.preventDefault();
        e.stopPropagation();

        const warInfo = document.querySelector('.faction-war-info');
        if (!warInfo) {
            button.textContent = '❓';
            button.title = 'Could not find faction info container.';
            setTimeout(() => { button.textContent = '🔗'; button.title = 'Copy Faction Link'; }, 2000);
            return;
        }

        const factionLinks = warInfo.querySelectorAll('a[href*="factions.php?step=profile&ID="]');
        if (factionLinks.length < 2) {
            button.textContent = '❓';
            button.title = 'Could not find faction links.';
            setTimeout(() => { button.textContent = '🔗'; button.title = 'Copy Faction Link'; }, 2000);
            return;
        }

        const targetFactionLink = isLeftFaction ? factionLinks[0] : factionLinks[1];
        const factionIdMatch = targetFactionLink.href.match(/ID=(\d+)/);
        if (!factionIdMatch) {
            button.textContent = '❓';
            button.title = 'Could not parse faction ID.';
            setTimeout(() => { button.textContent = '🔗'; button.title = 'Copy Faction Link'; }, 2000);
            return;
        }

        const factionId = factionIdMatch[1];
        const factionName = targetFactionLink.textContent.trim() || 'Faction';
        const factionUrl = `https://www.torn.com/factions.php?step=profile&ID=${factionId}`;
        const htmlToCopy = `<a href="${factionUrl}">${factionName} [${factionId}]</a>`;

        copyToClipboard({ html: htmlToCopy });

        button.textContent = '✅';
        button.title = 'Copied Faction Link';
        setTimeout(() => { button.textContent = '🔗'; button.title = 'Copy Faction Link'; }, 1500);
    }

    // --- Utility Functions ---



    ;

    function copyToClipboard(payload) {
    const isObj = payload && typeof payload === 'object';
    const html = isObj && typeof payload.html === 'string' ? payload.html : null;
    const text = isObj && typeof payload.text === 'string' ? payload.text : (typeof payload === 'string' ? payload : '');

    // If caller didn't provide a dedicated plain-text version, default to the HTML string.
    // This keeps <a href="...">...</a> in the clipboard for places that render it.
    const plain = (text && text.trim()) ? text : (html || '');

    const fallbackText = () => {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.style.position = 'fixed';
        tempTextarea.style.left = '-9999px';
        tempTextarea.value = plain;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            if (debug) console.error('Torn Profile Link Formatter: Clipboard fallback failed.', err);
        }
        document.body.removeChild(tempTextarea);
    };

    const fallbackHtmlSelection = () => {
        const temp = document.createElement('div');
        temp.contentEditable = 'true';
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        temp.style.top = '0';
        temp.style.opacity = '0';
        temp.innerHTML = html || '';
        document.body.appendChild(temp);

        const sel = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(temp);
        sel.removeAllRanges();
        sel.addRange(range);

        try {
            document.execCommand('copy');
        } catch (err) {
            if (debug) console.error('Torn Profile Link Formatter: HTML selection copy failed.', err);
            // last resort
            fallbackText();
        }

        sel.removeAllRanges();
        document.body.removeChild(temp);
    };

    (async () => {
        // 1) Best: native clipboard with both text/html and text/plain
        try {
            if (navigator.clipboard && navigator.clipboard.write && typeof ClipboardItem !== 'undefined') {
                const parts = { 'text/plain': new Blob([plain], { type: 'text/plain' }) };
                if (html) parts['text/html'] = new Blob([html], { type: 'text/html' });
                await navigator.clipboard.write([new ClipboardItem(parts)]);
                return;
            }
        } catch (err) {
            if (debug) console.error('Torn Profile Link Formatter: ClipboardItem write failed.', err);
        }

        // 2) Tampermonkey API
        try {
            if (typeof GM_setClipboard === 'function') {
                if (html) {
                    try { GM_setClipboard(html, { type: 'html' }); } catch (_) {}
                }
                GM_setClipboard(plain, { type: 'text' });
                return;
            }
        } catch (err) {
            if (debug) console.error('Torn Profile Link Formatter: GM_setClipboard failed.', err);
        }

        // 3) ExecCommand selection (keeps HTML in many rich editors)
        if (html) {
            fallbackHtmlSelection();
            return;
        }

        // 4) Last resort: plain text
        fallbackText();
    })();
}


    // --- Script Entry Point ---
    const observer = new MutationObserver(() => {
        setPageFlags();
        if (window.location.href.includes('profiles.php')) {
            initProfilePage();
        } else if (window.location.href.includes('factions.php')) {
            initFactionPage();
            initRankedWarPage();
        }
        initMiniProfile();
        initChainAttackList(); // <--- nou

    });

    observer.observe(document.body, { childList: true, subtree: true });


})();

// ==UserScript==
// @name         GGn Mining Stats
// @description  Adds a button to the userlog page to calculate personal mining drops statistics.
// @namespace    https://greasyfork.org/en/users/1466117
// @version      1.0.9
// @match        https://gazellegames.net/user.php?action=userlog*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         https://gazellegames.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/557818/GGn%20Mining%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/557818/GGn%20Mining%20Stats.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Configuration: Show ores with 0 quantity in IRC copy (false = hide, true = show)
    const SHOW_ZERO_QUANTITY_ORES_IRC = false;
    // Configuration: Use abbreviated ore names (false = full names, true = abbreviated)
    const USE_ABBREVIATED_ORE_NAMES = false;

    const userLink = document.querySelector('h2 a.username');
    if (!userLink) return;
    const href = userLink.getAttribute('href');
    const userId = new URL(href, window.location.href).searchParams.get('id');
    if (!userId) return;
    const header = document.querySelector('h2');
    if (!header) return;
    const btn = document.createElement('input');
    btn.type = 'button';
    btn.value = 'Mining Stats';
    btn.name = 'btnMiningStats';
    btn.style.marginLeft = '8px';
    btn.style.display = 'inline-block';
    btn.addEventListener('click', async () => {
        let apiKey = GM_getValue('mining_stats_api_key');
        let needsRetry = false;
        do {
            try {
                if (!apiKey) {
                    apiKey = prompt('Enter your API key (requires "User" permissions):');
                    if (!apiKey) return;
                    GM_setValue('mining_stats_api_key', apiKey);
                }
                console.log('[Mining Stats] Fetching data...');
                const [logData, userData] = await Promise.all([
                    fetchData(`https://gazellegames.net/api.php?request=userlog&limit=-1&search=as an irc reward.`, apiKey),
                    fetchData(`https://gazellegames.net/api.php?request=user&id=${userId}`, apiKey)
                ]);
                const drops = logData?.response || [];
                const flameEntries = drops.filter(e => e.message.toLowerCase().includes('flame'));
                const flameCounts = flameEntries.reduce((acc, entry) => {
                    const msg = entry.message.toLowerCase();
                    ['nayru', 'din', 'farore'].forEach(flame => {
                        if (msg.includes(`${flame}'s flame`)) acc[flame]++;
                    });
                    return acc;
                }, { nayru: 0, din: 0, farore: 0 });

                // Calculate Ore and Staff Cards
                const oreEntries = drops.filter(e => {
                    const msg = e.message.toLowerCase();
                    return msg.includes('ore') || msg.includes('bronze alloy mix');
                });
                const staffCardEntries = drops.filter(e => e.message.toLowerCase().includes('staff card'));
                const clayEntries = drops.filter(e => e.message.toLowerCase().includes('lump of clay'));
                const sandEntries = drops.filter(e => e.message.toLowerCase().includes('pile of sand'));

                // Calculate ore counts by type
                const oreCounts = oreEntries.reduce((acc, entry) => {
                    const msg = entry.message;

                    // Bronze Alloy Mix is always singular: "a Bronze Alloy Mix"
                    const bronzeAlloyMatch = msg.match(/a Bronze Alloy Mix/i);

                    // Other ores can be plural: "a Iron ore" or "2 Iron ores"
                    const ironMatch = msg.match(/(\d+)\s+Iron ores?|a Iron ore|Iron Ore/i);
                    const goldMatch = msg.match(/(\d+)\s+Gold ores?|a Gold ore|Gold Ore/i);
                    const mithrilMatch = msg.match(/(\d+)\s+Mithril ores?|a Mithril ore|Mithril Ore/i);
                    const adamantiumMatch = msg.match(/(\d+)\s+Adamantium ores?|a Adamantium ore|Adamantium Ore/i);

                    if (bronzeAlloyMatch) acc.bronze += 1;
                    if (ironMatch) acc.iron += ironMatch[1] ? parseInt(ironMatch[1]) : 1;
                    if (goldMatch) acc.gold += goldMatch[1] ? parseInt(goldMatch[1]) : 1;
                    if (mithrilMatch) acc.mithril += mithrilMatch[1] ? parseInt(mithrilMatch[1]) : 1;
                    if (adamantiumMatch) acc.adamantium += adamantiumMatch[1] ? parseInt(adamantiumMatch[1]) : 1;

                    return acc;
                }, { bronze: 0, iron: 0, gold: 0, mithril: 0, adamantium: 0 });

                // Calculate clay counts: "Lump of Clay" or "2 Lump of Clays"
                const clayCount = clayEntries.reduce((acc, entry) => {
                    const msg = entry.message;
                    const match = msg.match(/(\d+)\s+Lump of Clays?|a Lump of Clay/i);
                    if (match) {
                        acc += match[1] ? parseInt(match[1]) : 1;
                    }
                    return acc;
                }, 0);

                // Calculate sand counts: "Pile of Sand" or "2 Pile of Sands"
                const sandCount = sandEntries.reduce((acc, entry) => {
                    const msg = entry.message;
                    const match = msg.match(/(\d+)\s+Pile of Sands?|a Pile of Sand/i);
                    if (match) {
                        acc += match[1] ? parseInt(match[1]) : 1;
                    }
                    return acc;
                }, 0);

                // Calculate staff card counts
                const staffCardCount = staffCardEntries.reduce((acc, entry) => {
                    const msg = entry.message;
                    const match = msg.match(/(\d+)\s+Random Staff Cards?|a Random Staff Card/i);
                    if (match) {
                        acc += match[1] ? parseInt(match[1]) : 1;
                    }
                    return acc;
                }, 0);

                const actualLines = userData?.response?.community?.ircActualLines ?? 0;
                const totalMines = drops.length;
                const totalFlames = flameEntries.length;
                const totalOre = oreCounts.bronze + oreCounts.iron + oreCounts.gold + oreCounts.mithril + oreCounts.adamantium;
                const totalStaffCards = staffCardCount;
                const linesPerMine = (actualLines / (totalMines || 1)).toFixed(2);
                const linesPerFlame = (actualLines / (totalFlames || 1)).toFixed(2);

                // Helper function to get ore name (abbreviated or full)
                const getOreName = (oreName) => {
                    if (!USE_ABBREVIATED_ORE_NAMES) return oreName;
                    if (oreName === 'Adamantium') return 'Ada';
                    if (oreName === 'Mithril') return 'Mith';
                    return oreName;
                };

                // IRC format with ore breakdown (hide zero quantities for IRC only)
                const oreBreakdownParts = [];
                if (oreCounts.bronze > 0 || SHOW_ZERO_QUANTITY_ORES_IRC) oreBreakdownParts.push(`\x0307${getOreName('Bronze')}\x03 [ ${oreCounts.bronze} ]`);
                if (oreCounts.iron > 0 || SHOW_ZERO_QUANTITY_ORES_IRC) oreBreakdownParts.push(`\x0314${getOreName('Iron')}\x03 [ ${oreCounts.iron} ]`);
                if (oreCounts.gold > 0 || SHOW_ZERO_QUANTITY_ORES_IRC) oreBreakdownParts.push(`\x0308${getOreName('Gold')}\x03 [ ${oreCounts.gold} ]`);
                if (oreCounts.mithril > 0 || SHOW_ZERO_QUANTITY_ORES_IRC) oreBreakdownParts.push(`\x0311${getOreName('Mithril')}\x03 [ ${oreCounts.mithril} ]`);
                if (oreCounts.adamantium > 0 || SHOW_ZERO_QUANTITY_ORES_IRC) oreBreakdownParts.push(`\x0305${getOreName('Adamantium')}\x03 [ ${oreCounts.adamantium} ]`);

                const statsTextIRCWithOres = `Total Mines [ ${totalMines} ] • \x0310Nayru\x03 [ ${flameCounts.nayru} ] • \x0304Din\x03 [ ${flameCounts.din} ] • \x0303Farore\x03 [ ${flameCounts.farore} ] • Clay [ ${clayCount} ] • Sand [ ${sandCount} ] • ${oreBreakdownParts.join(' • ')} • Total Ore [ ${totalOre} ] • Staff Cards [ ${totalStaffCards} ] • Lines/Mine [ ${linesPerMine} ] • Lines/Flame [ ${linesPerFlame} ]`;

                // Plain text with ore breakdown (always show all ores)
                const oreBreakdownPlainParts = [
                    `${getOreName('Bronze')}: ${oreCounts.bronze}`,
                    `${getOreName('Iron')}: ${oreCounts.iron}`,
                    `${getOreName('Gold')}: ${oreCounts.gold}`,
                    `${getOreName('Mithril')}: ${oreCounts.mithril}`,
                    `${getOreName('Adamantium')}: ${oreCounts.adamantium}`
                ];

                const statsTextPlainWithOres = `Mines: ${totalMines} | Flames: ${totalFlames} | Nayru: ${flameCounts.nayru}, Din: ${flameCounts.din}, Farore: ${flameCounts.farore} | Clay: ${clayCount} | Sand: ${sandCount} | ${oreBreakdownPlainParts.join(', ')} | Total Ore: ${totalOre} | Staff Cards: ${totalStaffCards} | Lines/Mine: ${linesPerMine} | Lines/Flame: ${linesPerFlame}`;

                // Display HTML with ore breakdown (always show all ores)
                let statsDisplayHTML = statsTextPlainWithOres
                .replace(/\s*\|\s*/g, '<br>')
                .replace(/\bNayru\b/g, '<span style="color: #5599ff;">Nayru</span>')
                .replace(/\bDin\b/g, '<span style="color: #ff4444;">Din</span>')
                .replace(/\bFarore\b/g, '<span style="color: #44ff44;">Farore</span>')
                .replace(/\bBronze\b/g, '<span style="color: #cd7f32;">Bronze</span>')
                .replace(/\bIron\b/g, '<span style="color: #c0c0c0;">Iron</span>')
                .replace(/\bGold\b/g, '<span style="color: #ffd700;">Gold</span>')
                .replace(/\bMithril\b|Mith\b/g, '<span style="color: #00ffff;">$&</span>')
                .replace(/\bAdamantium\b|Ada\b/g, '<span style="color: #cc5500;">$&</span>');

                const copyBtnIRC = document.createElement('input');
                copyBtnIRC.type = 'submit';
                copyBtnIRC.value = 'Copy for IRC';
                copyBtnIRC.style.marginTop = '10px';
                copyBtnIRC.onclick = async (e) => {
                    e.preventDefault();
                    try {
                        await navigator.clipboard.writeText(statsTextIRCWithOres);
                        const originalText = copyBtnIRC.value;
                        copyBtnIRC.value = 'Copied!';
                        setTimeout(() => {
                            copyBtnIRC.value = originalText;
                            modal.remove();
                        }, 1000);
                    } catch (err) {
                        alert('Failed to copy to clipboard');
                    }
                };

                const copyBtnPlain = document.createElement('input');
                copyBtnPlain.type = 'submit';
                copyBtnPlain.value = 'Copy Plain Text';
                copyBtnPlain.style.marginTop = '10px';
                copyBtnPlain.style.marginLeft = '8px';
                copyBtnPlain.onclick = async (e) => {
                    e.preventDefault();
                    try {
                        await navigator.clipboard.writeText(statsTextPlainWithOres);
                        const originalText = copyBtnPlain.value;
                        copyBtnPlain.value = 'Copied!';
                        setTimeout(() => {
                            copyBtnPlain.value = originalText;
                            modal.remove();
                        }, 1000);
                    } catch (err) {
                        alert('Failed to copy to clipboard');
                    }
                };

                const container = document.createElement('div');
                container.innerHTML = `<div style="white-space: pre-wrap;">Mining Stats:<br>${statsDisplayHTML}</div>`;
                container.appendChild(copyBtnIRC);
                container.appendChild(copyBtnPlain);

                const modal = document.createElement('div');
                Object.assign(modal.style, {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: '#1a1a1a',
                    border: '2px solid white',
                    padding: '20px',
                    zIndex: '10000',
                    color: 'white',
                    maxWidth: '500px'
                });

                const closeBtn = document.createElement('input');
                closeBtn.type = 'submit';
                closeBtn.value = 'Close';
                closeBtn.style.marginLeft = '10px';
                closeBtn.onclick = (e) => {
                    e.preventDefault();
                    modal.remove();
                };

                container.appendChild(closeBtn);
                modal.appendChild(container);
                document.body.appendChild(modal);

                needsRetry = false;
            } catch (error) {
                console.error('[Mining Stats] Error:', error);
                if ([401, 403].includes(error.status)) {
                    GM_setValue('mining_stats_api_key', '');
                    apiKey = null;
                    needsRetry = confirm(`API Error: ${error.status === 401 ? 'Invalid key' : 'No permissions'}. Retry?`);
                } else {
                    alert(`Error: ${error.message}`);
                    needsRetry = false;
                }
            }
        } while (needsRetry);
    });
    async function fetchData(url, apiKey) {
        const response = await fetch(url, { headers: { 'X-API-Key': apiKey } });
        if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status });
        const data = await response.json();
        if (data?.status !== 'success') throw new Error(data?.error || 'API request failed');
        return data;
    }

    const searchBox = document.querySelectorAll('#user .thin .center form table td input[type="text"]')[0]
    const searchBtn = document.querySelector('input[type="submit"][value="Search log"]');

    if (searchBox && searchBtn) {
        btn.type = 'button';
        btn.style.marginLeft = '8px';
        btn.style.display = 'inline-block';

        searchBtn.insertAdjacentElement('afterend', btn);

        requestAnimationFrame(() => {
            const btnWidth = btn.offsetWidth + 12;
            const currentWidth = searchBox.offsetWidth;
            searchBox.style.width = (currentWidth - btnWidth) + 'px';
        });
    }


})();
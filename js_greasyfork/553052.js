// ==UserScript==
// @name         Fantasy BasketNews Player Stats Modal
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds a draggable stats modal when player link appears on Fantasy BasketNews
// @match        https://fantasy.basketnews.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553052/Fantasy%20BasketNews%20Player%20Stats%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/553052/Fantasy%20BasketNews%20Player%20Stats%20Modal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastInterceptedRequest = null;
    let isHistoryLoading = false;
    const statsCache = {};
    const modalCache = {};

    // Add ESC key listener to click specific element
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const xpath = '/html/body/div[1]/div[1]/div/div[1]/button';
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const element = result.singleNodeValue;

            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    const clickEvent = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    element.dispatchEvent(clickEvent);
                }
            }
        }
    });

    // Inject styles for spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes tm-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .tm-spinner {
            animation: tm-spin 1s linear infinite;
            width: 1.2em;
            height: 1.2em;
            vertical-align: middle;
        }
    `;
    document.head.appendChild(style);

    const SPINNER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tm-spinner"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;

    function setGlobalLoading(loading) {
        isHistoryLoading = loading;
        document.querySelectorAll('.tm-history-btn').forEach(btn => {
            if (loading) {
                if (!btn.dataset.originalText) btn.dataset.originalText = btn.textContent;
                btn.innerHTML = SPINNER_SVG;
                btn.disabled = true;
                btn.style.cursor = 'wait';
            } else {
                if (btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
                btn.disabled = false;
                btn.style.cursor = 'pointer';
            }
        });
    }

    const playerLinkSelector = 'a[href*="basketnews.lt/zaidejai/"]';

    const observer1 = new MutationObserver(() => {

        const links = document.querySelectorAll(playerLinkSelector);
        links.forEach(link => {
            if (!link.dataset.statsButtonAdded) {
                addStatsButton(link);
                link.dataset.statsButtonAdded = 'true';
            }
        });
    });

    observer1.observe(document.body, { childList: true, subtree: true });

    // Also add for existing links on page load
    document.querySelectorAll(playerLinkSelector).forEach(link => {
        if (!link.dataset.statsButtonAdded) {
            addStatsButton(link);
            link.dataset.statsButtonAdded = 'true';
        }
    });

    function addStatsButton(link) {
        const btn = document.createElement('button');
        btn.textContent = 'Show Stats';
        btn.style.marginLeft = '10px';
        btn.style.padding = '4px 8px';
        btn.style.border = '1px solid #ccc';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.background = '#222';
        btn.style.color = '#fff';
        btn.style.fontSize = '12px';
        btn.style.transition = '0.2s';

        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#444';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#222';
        });

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const url = link.href;

            if (modalCache[url]) {
                showModal(modalCache[url]);
                return;
            }

            showModal('Loading stats...');
            try {
                const resp = await fetch(url);
                const html = await resp.text();

                // Parse full HTML safely
                const template = document.createElement('template');
                template.innerHTML = html;

                // Get the stats table
                const stats = template.content.querySelector('div.stats-table.stats-table-games');
                if (!stats) {
                    showModal('<p>⚠️ Stats not found on player page.</p>');
                    return;
                }

                // Fix all relative links
                stats.querySelectorAll('a[href]').forEach(a => {
                    if (a.href.startsWith('/')) { // relative link
                        a.href = 'https://www.basketnews.lt' + a.getAttribute('href');
                    }
                });

                // Insert HTML of stats table into modal
                modalCache[url] = stats.outerHTML;
                showModal(stats.outerHTML); // pass as HTML string
            } catch (err) {
                showModal(`<p>❌ Error loading stats: ${err.message}</p>`);
            }
        });

        const historyBtn = document.createElement('button');
        historyBtn.textContent = 'Load history';
        historyBtn.classList.add('tm-history-btn');

        if (isHistoryLoading) {
            historyBtn.dataset.originalText = historyBtn.textContent;
            historyBtn.innerHTML = SPINNER_SVG;
            historyBtn.disabled = true;
            historyBtn.style.cursor = 'wait';
        }
        historyBtn.style.marginLeft = '10px';
        historyBtn.style.padding = '4px 8px';
        historyBtn.style.border = '1px solid #ccc';
        historyBtn.style.borderRadius = '5px';
        historyBtn.style.cursor = 'pointer';
        historyBtn.style.background = '#222';
        historyBtn.style.color = '#fff';
        historyBtn.style.fontSize = '12px';
        historyBtn.style.transition = '0.2s';

        historyBtn.addEventListener('mouseenter', () => {
            historyBtn.style.background = '#444';
        });
        historyBtn.addEventListener('mouseleave', () => {
            historyBtn.style.background = '#222';
        });

        historyBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (lastInterceptedRequest) {
                await runHistoryLoop(lastInterceptedRequest);
            } else {
                alert("No request captured yet. Please click on a player to capture request data.");
            }
        });

        link.parentElement?.insertBefore(historyBtn, link.parentElement.firstChild);
        link.parentElement?.insertBefore(btn, link.parentElement.firstChild);
    }

    function showModal(content) {
        let modal = document.getElementById('statsModal');

        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'statsModal';
        modal.style.position = 'fixed';
        modal.style.top = '100px';
        modal.style.left = '100px';
        modal.style.width = '1200px';
        modal.style.maxHeight = '70vh';
        modal.style.overflowY = 'auto';
        modal.style.background = '#111';
        modal.style.color = '#fff';
        modal.style.border = '2px solid #666';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
        modal.style.zIndex = '1000';

        const title = document.createElement('div');
        title.textContent = 'Player Stats';
        title.style.cursor = 'move';
        title.style.padding = '10px';
        title.style.background = '#222';
        title.style.borderBottom = '1px solid #444';
        title.style.fontWeight = 'bold';
        title.style.display = 'flex';
        title.style.justifyContent = 'space-between';
        title.style.alignItems = 'center';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.background = 'transparent';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#fff';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.marginLeft = '10px';

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.remove();
        });

        title.appendChild(closeBtn);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = content;
        contentDiv.style.padding = '10px';

        modal.appendChild(title);
        modal.appendChild(contentDiv);
        document.body.appendChild(modal);

        makeDraggable(modal, title);
    }

    function makeDraggable(element, handle) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return; // prevent close button drag
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            handle.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                handle.style.cursor = 'move';
            }
        });
    }


    // Observe the body for new elements
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue; // skip non-elements

                // Find any descendant div with justify-center
                const target = node.matches?.('div.items-center') ? node : node.querySelector('div.items-center');
                if (target) {
                    target.classList.remove('items-center');
                    console.log('[TM] Removed items-center from:', target);
                }
            }
        }
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });

    // Also remove from existing elements immediately
    document.querySelectorAll('div.items-center').forEach(el => {
        el.classList.remove('items-center');
        console.log('[TM] Removed items-center from existing:', el);
    });


    // Function to create your custom div
    function createCustomDiv() {
        const div = document.createElement('div');
        div.id = 'tm-custom-div';
        div.style.position = 'absolute';
        div.style.top = '1rem';
        div.style.right = '1rem';
        div.style.background = 'rgba(0,0,0,0.8)';
        div.style.color = 'white';
        div.style.padding = '0.5rem 1rem';
        div.style.borderRadius = '8px';
        div.style.zIndex = '-1';
        div.innerText = 'My Custom Data';
        return div;
    }

    // Observe body for modal opening
    const modalObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;

                // Check if this is the modal overlay
                if (node.matches('body > div.top-0.left-0.right-0.w-full.h-full.overflow-y-auto')) {
                    // Add custom div
                    const customDiv = createCustomDiv();
                    node.appendChild(customDiv);
                    console.log('[TM] Custom div added');

                    // Observe this modal for removal
                    const removeObserver = new MutationObserver((mutations) => {
                        if (!document.body.contains(node)) {
                            console.log('[TM] Modal closed, removing custom div');
                            removeObserver.disconnect();
                        }
                    });
                    removeObserver.observe(document.body, { childList: true, subtree: true });
                }
            }
        }
    });

    modalObserver.observe(document.body, { childList: true, subtree: true });


    // Hook fetch to intercept GraphQL requests
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        // Only intercept the specific GraphQL request
        if (typeof input === 'string' && input.includes('/backend/graphql')) {
            try {
                const bodyText = init?.body || '';
                if (bodyText.includes('"operationName":"playerInfoRecordFromClient"')) {
                    const payload = JSON.parse(bodyText);
                    console.log('[TM] Original request intercepted:', payload);
                    lastInterceptedRequest = { input, init, payload };
                    console.log('[TM] Request saved. Click "Load history" to run.');
                    setTimeout(() => runHistoryLoop(lastInterceptedRequest), 100);
                }
            } catch (e) {
                console.error('[TM] Error intercepting GraphQL request:', e);
            }
        }

        // Continue original fetch
        return originalFetch.apply(this, arguments);
    };

    async function runHistoryLoop({ input, init, payload }) {
        const cacheVars = { ...payload.variables };
        delete cacheVars.fantasyRound;
        const cacheKey = JSON.stringify(cacheVars);

        if (statsCache[cacheKey]) {
            console.log('[TM] Using cached history for', cacheKey);
            renderFantasyPointsTable(statsCache[cacheKey]);
            return;
        }

        setGlobalLoading(true);
        try {
        const results = [];
        const max_round = document.querySelector('div.absolute.top-\\[3\\.75rem\\]')?.querySelectorAll(':scope > div').length || 30;

        console.log('[TM] Starting history loop. Max round:', max_round);

        // Try incremental fantasyRound
        for (let round = 0; round < max_round; round++) {
            payload.variables.fantasyRound = round;

            const resp = await originalFetch(input, {
                ...init,
                body: JSON.stringify(payload)
            });

            const data = await resp.clone().json();

            const pts = data?.data?.playerRecordFromClient?.fantasy_pts ?? "";

            var originalGameAt = data?.data?.playerRecordFromClient?.team?.team?.games[0].originalGameAt ?? "-";
            originalGameAt = originalGameAt.substring(5,10).replace('-','-') + ' ' + originalGameAt.substring(11,16);

            const ownteam = data?.data?.playerRecordFromClient?.team?.team?.translation?.shortName ?? "";

            const team1 = data?.data?.playerRecordFromClient?.team?.team?.games[0]?.team1?.team?.translation?.shortName ?? "";

            const teampts1 = data?.data?.playerRecordFromClient?.team?.team?.games[0]?.team1?.points ?? "";

            const teampts2 = data?.data?.playerRecordFromClient?.team?.team?.games[0]?.team2?.points ?? "";

            const team2 = data?.data?.playerRecordFromClient?.team?.team?.games[0]?.team2?.team?.translation?.shortName ?? "";

            const price = data?.data?.playerRecordFromClient?.fantasyPrice ?? "";

            var mins = data?.data?.playerRecordFromClient?.stats?.s_time;
            mins = isNaN(mins) ? "" : (mins / 60).toFixed(1);

            const points = data?.data?.playerRecordFromClient?.stats?.s_pts ?? "";

            const s_orb = data?.data?.playerRecordFromClient?.stats?.s_orb ?? "";

            const s_drb = data?.data?.playerRecordFromClient?.stats?.s_drb ?? "";

            const s_ast = data?.data?.playerRecordFromClient?.stats?.s_ast ?? "";

            const s_eff = data?.data?.playerRecordFromClient?.stats?.s_eff ?? "";

            const win = ownteam == team1 ? teampts1 > teampts2 : teampts1 < teampts2;

            var popul = data?.data?.playerRecordFromClient?.popularity?.ownedRatio;
            popul = isNaN(popul) ? "" : ((popul * 100).toFixed(1)) + "%";

            console.log(`[TM] Round ${round}: fantasy_pts =`, pts);

            // Save results
            results.push({
                round: round + 1,
                originalGameAt: originalGameAt,
                team1: team1,
                teampts1: teampts1,
                teampts2: teampts2,
                team2: team2,
                price: price,
                mins: mins,
                points: points,
                s_orb: s_orb,
                s_drb: s_drb,
                s_ast: s_ast,
                s_eff: s_eff,
                popul: popul,
                fantasy_pts: pts,
                win: win
            });
        }

        console.log('[TM] All results:', results);
        statsCache[cacheKey] = results;
        renderFantasyPointsTable(results);
        } finally {
            setGlobalLoading(false);
        }
    }

    function rendertd(row, content, color = null){
            color = color ?? '#fff';
            const tdRound = document.createElement('td');
            tdRound.innerText = content;
            tdRound.style.border = '1px solid #fff';
            tdRound.style.setProperty('color', color, 'important');
            tdRound.style.padding = '4px 8px';
            tdRound.style.textAlign = 'center';
            row.appendChild(tdRound);
    }

    function formatNumber(num) {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
        if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
        return num.toString();
    }
    function renderFantasyPointsTable(data) {
        const container = document.querySelector('#tm-custom-div');
        if (!container) {
            console.warn('[TM] Container #tm-custom-div not found');
            return;
        }

        // --- CONSTANTS ---
        const COLOR_WIN = "#4caf50";  // Green (Text)
        const COLOR_LOSS = "#e57373"; // Red (Text)
        const COLOR_NEUTRAL = "#aaa"; // Grey
        const BAR_MAX_WIDTH = 50;     // Max pixels for the bar

        // --- BAR COLORS (4 Tiers) ---
        const COLOR_BAR_TIER_1 = "#ef5350"; // Red
        const COLOR_BAR_TIER_2 = "#ffa726"; // Orange
        const COLOR_BAR_TIER_3 = "#ffee58"; // Yellow
        const COLOR_BAR_TIER_4 = "#66bb6a"; // Green
        // -----------------

        container.innerHTML = '';

        // --- HELPERS ---
        const getVal = (item, prop) => {
            let val = item[prop];
            if (val === "" || val === null || val === undefined) return null;
            if (typeof val === 'string' && val.includes('%')) {
                val = val.replace('%', '');
            }
            return Number(val);
        };

        const getRebVal = (item) => {
            if(item.s_orb === "" || item.s_drb === "") return 0;
            return Number(item.s_orb) + Number(item.s_drb);
        };

        const createColoredCell = (row, text, color) => {
            const td = document.createElement('td');
            td.innerText = text;
            td.style.border = '1px solid #fff';
            td.style.padding = '4px 8px';
            td.style.textAlign = 'center';
            if (color) td.style.setProperty('color', color, 'important');
            row.appendChild(td);
        };

        // --- PRE-CALCULATIONS FOR GRAPH ---
        const validScores = data
            .map(item => getVal(item, 'fantasy_pts'))
            .filter(val => val !== null);

        const minScore = validScores.length ? Math.min(...validScores) : 0;
        const maxScore = validScores.length ? Math.max(...validScores) : 0;
        const scoreRange = maxScore - minScore;

        // --- IDENTIFY UPCOMING MATCHUPS ---
        let lastPlayedIndex = -1;
        for (let i = data.length - 1; i >= 0; i--) {
            if (getVal(data[i], 'fantasy_pts') !== null) {
                lastPlayedIndex = i;
                break;
            }
        }

        const upcomingMatchups = new Set();
        for (let i = lastPlayedIndex + 1; i < data.length; i++) {
            upcomingMatchups.add([data[i].team1, data[i].team2].sort().join('|'));
        }

        // --- TABLE SETUP ---
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.color = 'white';
        table.style.fontFamily = 'sans-serif';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Rnd', 'Date', 'Team1', 'Score', 'Team2', 'Price', 'Mins', 'Pts', 'Reb', 'Ast', 'Eff', 'Pop', 'FPts', 'Avg5', 'Graph'];

        headers.forEach(text => {
            const th = document.createElement('th');
            th.innerText = text;
            th.style.border = '1px solid #fff';
            th.style.padding = '4px 8px';
            th.style.backgroundColor = '#111';
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        // --- ROW GENERATION ---
        let validGamesSoFar = [];

        data.forEach((item, index) => {
            const rowColor = item.win ? COLOR_WIN : COLOR_LOSS;
            const row = document.createElement('tr');

            // Highlight previous games against upcoming opponents
            if (index <= lastPlayedIndex) {
                const currentMatchup = [item.team1, item.team2].sort().join('|');
                if (upcomingMatchups.has(currentMatchup)) {
                    row.style.backgroundColor = '#2F4F4F'; // Highlight color
                }
            }

            const currentFPts = getVal(item, 'fantasy_pts');

            if (currentFPts !== null) {
                validGamesSoFar.push(currentFPts);
            }

            rendertd(row, item.round);
            rendertd(row, item.originalGameAt);
            rendertd(row, item.team1);
            rendertd(row, item.teampts1 === "0" ? "" : (item.teampts1 + ":" + item.teampts2), rowColor);
            rendertd(row, item.team2);
            rendertd(row, formatNumber(item.price));
            rendertd(row, item.mins);
            rendertd(row, item.points);
            rendertd(row, (item.s_orb === "" ? "" : (item.s_orb + "/" + item.s_drb + " ")) + (item.s_orb === "" ? "" : (Number(item.s_orb) + Number(item.s_drb))));
            rendertd(row, item.s_ast);
            rendertd(row, item.s_eff);
            rendertd(row, item.popul);
            rendertd(row, item.fantasy_pts, rowColor);

            // 1. Running Avg
            if (currentFPts !== null) {
                const last5 = validGamesSoFar.slice(-5);
                const avg = last5.reduce((a, b) => a + b, 0) / last5.length;
                rendertd(row, avg.toFixed(1));
            } else {
                rendertd(row, "");
            }

            // 2. Graph Column (4-Color Logic)
            const graphTd = document.createElement('td');
            graphTd.style.border = '1px solid #fff';
            graphTd.style.padding = '4px 8px';
            graphTd.style.verticalAlign = 'middle';

            if (currentFPts !== null) {
                let width = 0;
                if (scoreRange > 0) {
                    width = ((currentFPts - minScore) / scoreRange) * BAR_MAX_WIDTH;
                } else if (maxScore > 0) {
                    width = BAR_MAX_WIDTH;
                }

                if (width < 1) width = 1;

                const bar = document.createElement('div');
                bar.style.height = '6px';
                bar.style.width = width + 'px';

                // --- 4 COLOR LOGIC ---
                // Thresholds: 12.5, 25, 37.5 (since max is 50)
                if (width <= 12.5) {
                    bar.style.backgroundColor = COLOR_BAR_TIER_1; // Red
                } else if (width <= 25) {
                    bar.style.backgroundColor = COLOR_BAR_TIER_2; // Orange
                } else if (width <= 37.5) {
                    bar.style.backgroundColor = COLOR_BAR_TIER_3; // Yellow
                } else {
                    bar.style.backgroundColor = COLOR_BAR_TIER_4; // Green
                }
                // ---------------------

                bar.style.display = 'inline-block';
                bar.style.borderRadius = '2px';

                graphTd.appendChild(bar);
            }
            row.appendChild(graphTd);

            tbody.appendChild(row);
        });

        // --- SUMMARY & DIFF ROWS ---
        const validData = data.filter(item => getVal(item, 'fantasy_pts') !== null);

        const calculateAvg = (dataSet, getter) => {
            if (dataSet.length === 0) return 0;
            return dataSet.reduce((acc, curr) => acc + getter(curr), 0) / dataSet.length;
        };

        const renderSummaryRow = (label, dataSet, color) => {
            if (dataSet.length === 0) return;
            const row = document.createElement('tr');
            row.style.fontWeight = "bold";
            row.style.backgroundColor = "#333";

            rendertd(row, "");
            rendertd(row, label);
            rendertd(row, "");
            rendertd(row, "");
            rendertd(row, "");

            rendertd(row, formatNumber(Math.round(calculateAvg(dataSet, i => getVal(i, 'price')))));
            rendertd(row, calculateAvg(dataSet, i => getVal(i, 'mins')).toFixed(1));
            rendertd(row, calculateAvg(dataSet, i => getVal(i, 'points')).toFixed(1));
            rendertd(row, calculateAvg(dataSet, i => getRebVal(i)).toFixed(1));
            rendertd(row, calculateAvg(dataSet, i => getVal(i, 's_ast')).toFixed(1));
            rendertd(row, calculateAvg(dataSet, i => getVal(i, 's_eff')).toFixed(1));
            rendertd(row, calculateAvg(dataSet, i => getVal(i, 'popul')).toFixed(1) + "%");
            createColoredCell(row, calculateAvg(dataSet, i => getVal(i, 'fantasy_pts')).toFixed(1), color);

            rendertd(row, "");
            rendertd(row, "");

            tbody.appendChild(row);
        };

        const renderDifferenceRow = (totalData, recentData) => {
            if (totalData.length === 0 || recentData.length === 0) return;
            const row = document.createElement('tr');
            row.style.fontWeight = "bold";
            row.style.backgroundColor = "#222";

            rendertd(row, "");
            rendertd(row, "Diff");
            rendertd(row, "");
            rendertd(row, "");
            rendertd(row, "");

            const renderDiffCell = (getter, isPercent = false, isInteger = false) => {
                const avgTotal = calculateAvg(totalData, getter);
                const avgRecent = calculateAvg(recentData, getter);
                const diff = avgRecent - avgTotal;
                let color = COLOR_NEUTRAL;
                if (diff > 0) color = COLOR_WIN;
                if (diff < 0) color = COLOR_LOSS;

                const sign = diff > 0 ? "+" : "";
                const valueStr = isInteger ? Math.round(diff) : diff.toFixed(1);
                createColoredCell(row, sign + (isInteger ? formatNumber(valueStr) : valueStr) + (isPercent ? "%" : ""), color);
            };

            renderDiffCell(i => getVal(i, 'price'), false, true);
            renderDiffCell(i => getVal(i, 'mins'));
            renderDiffCell(i => getVal(i, 'points'));
            renderDiffCell(i => getRebVal(i));
            renderDiffCell(i => getVal(i, 's_ast'));
            renderDiffCell(i => getVal(i, 's_eff'));
            renderDiffCell(i => getVal(i, 'popul'), true);
            renderDiffCell(i => getVal(i, 'fantasy_pts'));

            rendertd(row, "");
            rendertd(row, "");

            tbody.appendChild(row);
        };

        const last5Data = validData.slice(-5);
        renderSummaryRow("Average", validData, "#2196f3");
        renderSummaryRow("Avg. Last 5", last5Data, "#ff9800");
        renderDifferenceRow(validData, last5Data);

        table.appendChild(tbody);
        container.appendChild(table);
    }

})();

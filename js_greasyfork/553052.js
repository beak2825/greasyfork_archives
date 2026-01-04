// ==UserScript==
// @name         Fantasy BasketNews Player Stats Modal
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a draggable stats modal when player link appears on Fantasy BasketNews
// @match        https://fantasy.basketnews.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553052/Fantasy%20BasketNews%20Player%20Stats%20Modal.user.js
// @updateURL https://update.greasyfork.org/scripts/553052/Fantasy%20BasketNews%20Player%20Stats%20Modal.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
                showModal(stats.outerHTML); // pass as HTML string
            } catch (err) {
                showModal(`<p>❌ Error loading stats: ${err.message}</p>`);
            }
        });


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
        modal.style.zIndex = '9999';

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
        div.style.zIndex = '1000';
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

                    const results = [];

                    const max_round = document.querySelector('div.absolute.top-\\[3\\.75rem\\]').querySelectorAll(':scope > div').length;

                    // Try incremental fantasyRound
                    for (let round = 0; round < max_round; round++) { // max 100 to avoid infinite loop
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

                        // Stop when fantasy_pts is null
                        //if (pts === null && round > 10) break;
                    }

                    console.log('[TM] All results:', results);
                    renderFantasyPointsTable(results);
                }
            } catch (e) {
                console.error('[TM] Error intercepting GraphQL request:', e);
            }
        }

        // Continue original fetch
        return originalFetch.apply(this, arguments);
    };

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

        // Clear previous content
        container.innerHTML = '';

        // Create table
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.color = 'white';
        table.style.fontFamily = 'sans-serif';

        // Header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Rnd', 'Date', 'Team1','Score','Team2','Price','Mins', 'Pts', 'Reb', 'Ast', 'Eff', 'Pop', 'FPts'].forEach(text => {
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

        // Body
        const tbody = document.createElement('tbody');
        data.forEach(item => {
            const rowColor = item.win ? "#4caf50" : "#e57373";

            const row = document.createElement('tr');

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

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        container.appendChild(table);
    }

})();

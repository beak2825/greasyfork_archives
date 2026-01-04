// ==UserScript==
// @name        [GC] - Popout Shop Wiz + SDB
// @namespace   http://tampermonkey.net/
// @match       https://www.grundos.cafe/*
// @exclude     https://www.grundos.cafe/itemview/*
// @license     MIT
// @version     0.1.1
// @author      Cupkait, Mana (edits)
// @icon        https://i.imgur.com/4Hm2e6z.png
// @grant       GM.getValue
// @grant       GM.setValue
// @require     https://update.greasyfork.org/scripts/512407/1582200/GC%20-%20Virtupets%20API%20library.js

// @description   Shop Wiz searches default to appearing in a pop-out window within your current page instead of having to go between new tabs or windows. Note: Reviewed and greenlit via staff ticket #5830. Additional SDB/name highlighting feature concept greenlit via staff ticket #6310.

// @downloadURL https://update.greasyfork.org/scripts/549687/%5BGC%5D%20-%20Popout%20Shop%20Wiz%20%2B%20SDB.user.js
// @updateURL https://update.greasyfork.org/scripts/549687/%5BGC%5D%20-%20Popout%20Shop%20Wiz%20%2B%20SDB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'shopWizPopoutState';
    const currentUser = $('#user-info-username').text();

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js';
    script.onload = init;
    document.head.appendChild(script);

    function init() {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
            x: 100,
            y: 100,
            width: 300,
            height: 250,
            open: false
        };

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Shop Wiz';
        Object.assign(toggleBtn.style, {
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            zIndex: '9999',
            padding: '8px 12px',
            borderRadius: '8px',
            background: '#444',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        });
        document.body.appendChild(toggleBtn);


        const popout = document.createElement('div');
        Object.assign(popout.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: `${saved.width}px`,
            height: `${saved.height}px`,
            background: 'var(--bgcolor)',
            border: '2px solid #333',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            zIndex: '9998',
            resize: 'none',
            overflow: 'auto',
            transform: `translate(${saved.x}px, ${saved.y}px)`,
            display: saved.open ? 'block' : 'none'
        });
        popout.dataset.x = saved.x;
        popout.dataset.y = saved.y;

        const header = document.createElement('div');
        Object.assign(header.style, {
            background: 'var(--grid_head)',
            color: 'var(--color)',
            padding: '5px 5px',
            cursor: 'move',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });

        const title = document.createElement('span');
        title.innerHTML = `Shop Wizard`;

        const countSpan = document.createElement('span');
        countSpan.style.marginLeft = '8px';
        countSpan.style.fontSize = '90%';
        countSpan.style.opacity = '0.7';
        title.appendChild(countSpan);

        const minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '—';
        Object.assign(minimizeBtn.style, {
            background: 'none',
            color: 'var(--color)',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer'
        });

        header.appendChild(title);
        header.appendChild(minimizeBtn);
        popout.appendChild(header);

        const inputContainer = document.createElement('div');
        inputContainer.style.padding = '8px';
        inputContainer.style.display = 'flex';
        inputContainer.style.gap = '5px';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Search for an exact item...';
        input.style.flex = '1';
        input.style.padding = '5px';
        input.style.border = '1px solid #aaa';
        input.style.borderRadius = '4px';


        const goBtn = document.createElement('button');
        goBtn.textContent = 'Go';
        goBtn.style.padding = '5px 10px';
        goBtn.style.border = '1px solid #333';
        goBtn.style.background = '#eee';
        goBtn.style.cursor = 'pointer';


        inputContainer.appendChild(input);
        inputContainer.appendChild(goBtn);
        popout.appendChild(inputContainer);

        const content = document.createElement('div');
        content.innerHTML = '<p>Results will display here when you search for an item.</p>';
        content.style.padding = '0px 10px';
        popout.appendChild(content);

        document.body.appendChild(popout);

        toggleBtn.addEventListener('click', () => {
            const isOpen = popout.style.display === 'none';
            popout.style.display = isOpen ? 'block' : 'none';
            title.innerHTML = `Shop Wizard`;
            title.appendChild(countSpan);
            saveState({ open: isOpen });
        });


        minimizeBtn.addEventListener('click', () => {
            popout.style.display = 'none';
            saveState({ open: false });
        });

        let lastSearchTerm = '';
        let lastSearchTime = 0;
        let searchTimeout = null;

        async function handleSearch() {
            const term = input.value.trim();
            if (!term) return;

            if (term === lastSearchTerm) return;

            const now = Date.now();
            const timeSinceLastSearch = now - lastSearchTime;

            if (timeSinceLastSearch < 1000) {
                if (searchTimeout) clearTimeout(searchTimeout);

                content.innerHTML = '<p style="text-align:center;">You\'re quick! One second while I catch up...</p>';

                searchTimeout = setTimeout(() => {
                    performSearch(term);
                }, 1000 - timeSinceLastSearch);
            } else {
                performSearch(term);
            }
        }

        async function performSearch(term) {
            lastSearchTerm = term;
            lastSearchTime = Date.now();

            const encoded = encodeURIComponent(term).replace(/%20/g, '+');
            const url = `https://www.grundos.cafe/market/wizard/?submit=Search&area=0&search_method=1&query=${encoded}`;

            try {
                const res = await fetch(url);
                const text = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const searchCountNode = doc.querySelector('main .center:not(#shopBar) .smallfont');
                if (searchCountNode) {
                    countSpan.textContent = `(${searchCountNode.textContent.trim()})`;
                } else {
                    countSpan.textContent = '';
                }

                const searchTerm = doc.querySelector("#page_content > main > div:nth-child(5) > p.mt-1 > strong")?.textContent?.trim() || '';
                const resultsGrid = doc.querySelector('.sw_results');

                const termLabel = document.createElement('p');
                termLabel.classList.add('smallfont');
                termLabel.style.fontWeight = 'bold';
                termLabel.style.textAlign = 'center';
                termLabel.style.margin = '2px 2px 10px 2px';
                termLabel.textContent = `${searchTerm || '(unknown)'}`;

                // If SW search term matches current SDB term
                if (term === lastSDBTerm) {
                    content.appendChild(termLabel);
                }
                // If SW search term doesn't match, or if no SDB searches yet
                else {
                    content.innerHTML = '';
                    lastSDBTerm = '';
                    content.appendChild(termLabel);
                }

                if (!resultsGrid) {
                    const noResult = document.createElement('p');
                    noResult.textContent = 'Hmmm... no results. Did you spell it right?';
                    content.appendChild(noResult);
                    return;
                }

                const resultsRaw = resultsGrid.querySelectorAll('.data');
                const rawData = [];
                for (let i = 0; i < resultsRaw.length;) {
                    const seller = resultsRaw[i].innerText;
                    const link = resultsRaw[i].innerHTML;
                    const stock = parseInt(resultsRaw[i + 2].innerText, 10);
                    const price = parseInt(resultsRaw[i + 3].innerText.replace(/[^\d]/g, ''), 10);
                    rawData.push({ seller, link, stock, price });
                    i += 4;
                }

                if (rawData.length > 0) {
                    const table = document.createElement('table');
                    table.style.borderCollapse = 'collapse';
                    table.style.width = '100%';

                    const headerRow = document.createElement('tr');
                    ['Seller', 'Stock', 'Price'].forEach(text => {
                        const th = document.createElement('th');
                        th.textContent = text;
                        th.style.borderBottom = '1px solid #ccc';
                        th.style.padding = '4px';
                        headerRow.appendChild(th);
                    });
                    table.appendChild(headerRow);

                    rawData.forEach(row => {
                        const tr = document.createElement('tr');

                        const sellerCell = document.createElement('td');
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = row.link;
                        const anchor = tempDiv.querySelector('a');

                        if (anchor) {
                            const link = anchor.href;
                            const name = anchor.textContent;

                            if (name === currentUser) {
                                tr.style.backgroundColor = 'var(--grid_head)';
                            }

                            const newLink = document.createElement('a');
                            newLink.href = link;
                            newLink.textContent = name;
                            newLink.style.color = 'var(--link_color)';
                            newLink.style.textDecoration = 'bold';
                            newLink.addEventListener('click', (e) => {
                                e.preventDefault();
                                const win = window.open(link, '_blank');
                                if (win) win.focus();
                            });

                            sellerCell.appendChild(newLink);
                        } else {
                            sellerCell.textContent = row.seller;
                        }
                        sellerCell.style.padding = '4px';

                        const stockCell = document.createElement('td');
                        stockCell.textContent = row.stock;
                        stockCell.style.padding = '4px';

                        const priceCell = document.createElement('td');
                        priceCell.textContent = row.price.toLocaleString();
                        priceCell.style.padding = '4px';

                        tr.appendChild(sellerCell);
                        tr.appendChild(stockCell);
                        tr.appendChild(priceCell);
                        table.appendChild(tr);
                    });

                    content.appendChild(table);
                } else {
                    const noMatch = document.createElement('p');
                    noMatch.textContent = 'No matching items found.';
                    content.appendChild(noMatch);
                }

                sendShopWizardPrices(doc);

            } catch (err) {
                console.error('Fetch or parse error:', err);
                content.innerHTML = '<p style="color:red;">Error fetching results.</p>';
            }
        }

        let lastSDBTerm = '';
        let lastSDBTime = 0;
        let sdbTimeout = null;

        async function handleSDB(term) {

            if (term === lastSDBTerm) return;

            const now = Date.now();
            const timeSinceLastSDB = now - lastSDBTime;

            if (timeSinceLastSDB < 1000) {
                if (sdbTimeout) clearTimeout(sdbTimeout);

                content.innerHTML = '<p style="text-align:center;">You\'re quick! One second while I catch up...</p>';

                sdbTimeout = setTimeout(() => {
                    performSDB(term);
                }, 1000 - timeSinceLastSDB);
            } else {
                performSDB(term);
            }
        }

        async function performSDB(term) {
            lastSDBTerm = term;
            lastSDBTime = Date.now();

            const encoded = encodeURIComponent(term).replace(/%20/g, '+');
            // console.log(encoded);
            const url = `https://www.grundos.cafe/safetydeposit/?page=1&query=${encoded}&exact=1`;

            try {
                const res = await fetch(url);
                const text = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const resultsGrid = doc.querySelector('.market_grid');

                if (!resultsGrid) {
                    const noResult = document.createElement('p');
                    noResult.textContent = 'Hmmm... no results. Did you spell it right?';
                    content.appendChild(noResult);
                    return;
                }

                const resultsRaw = resultsGrid.querySelectorAll('.data');
                const rawData = [];
                /*
                    Row:
                    Fave | Name | Piccy | Qty | Type | Description | Rm
                */

                let itemQty = 0;
                if (resultsRaw.length >= 3) {
                    itemQty = resultsRaw[3].innerText;
                }

                const sdbLabel = document.createElement('p');
                sdbLabel.style.textAlign = 'center';
                sdbLabel.innerHTML = `<a href="${url}" target="_blank">'${term}' in SDB</a>: <b>${itemQty}</b>`;

                // If SDB search term matches current Shop Wizard search
                if (term === lastSearchTerm) {
                    content.prepend(sdbLabel);
                }
                // If SDB search term doesn't match, or if no Shop Wiz searches yet
                else {
                    content.innerHTML = '';
                    input.value = '';
                    lastSearchTerm = '';
                    content.appendChild(sdbLabel);
                }


            } catch (err) {
                console.error('Fetch or parse error:', err);
                content.innerHTML = '<p style="color:red;">Error fetching results.</p>';
            }
        }


        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        goBtn.addEventListener('click', handleSearch);

        document.addEventListener('click', function (e) {
            // console.log(e);
            const swImg = e.target.closest('.search-helper-sw');
            if (!swImg) return;

            const anchor = swImg.closest('a');
            if (!anchor || !anchor.href.includes('/market/wizard/')) return;

            e.preventDefault();

            try {
                const url = new URL(anchor.href, location.origin);
                const query = url.searchParams.get('query');
                if (query) {
                    const decoded = decodeURIComponent(query);
                    input.value = decoded;

                    if (popout.style.display === 'none') {
                        popout.style.display = 'block';
                        saveState({ open: true });
                    }

                    input.focus();
                    handleSearch();
                }
            } catch (err) {
                console.error('Failed to extract query from Shop Wizard link:', err);
            }
        }, true);

        document.addEventListener('click', function (e) {

            const sdbImg = e.target.closest('.search-helper-sdb');
            if (!sdbImg) return;

            const anchor = sdbImg.closest('a');
            if (!anchor || !anchor.href.includes('/safetydeposit/')) return;

            e.preventDefault();

            // console.log(anchor);

            try {
                const url = new URL(anchor.href, location.origin);
                const query = url.searchParams.get('query');
                // console.log(query);
                if (query) {
                    const decoded = decodeURIComponent(query);
                    // console.log(decoded);
                    if (popout.style.display === 'none') {
                        popout.style.display = 'block';
                        saveState({ open: true });
                    }

                    handleSDB(decoded);
                }
            } catch (err) {
                console.error('Failed to extract query from SDB link:', err);
            }
        }, true);

        interact(popout)
            .draggable({
                allowFrom: 'div',
                listeners: {
                    move(event) {
                        const target = event.target;
                        const x = (parseFloat(target.dataset.x) || 0) + event.dx;
                        const y = (parseFloat(target.dataset.y) || 0) + event.dy;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.dataset.x = x;
                        target.dataset.y = y;
                        saveState({ x, y });
                    }
                }
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move(event) {
                        let { x, y } = event.target.dataset;
                        x = parseFloat(x) || 0;
                        y = parseFloat(y) || 0;

                        Object.assign(event.target.style, {
                            width: `${event.rect.width}px`,
                            height: `${event.rect.height}px`,
                            transform: `translate(${x + event.deltaRect.left}px, ${y + event.deltaRect.top}px)`
                        });

                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        event.target.dataset.x = x;
                        event.target.dataset.y = y;

                        saveState({
                            x,
                            y,
                            width: event.rect.width,
                            height: event.rect.height
                        });
                    }
                }
            });

        function saveState(partialUpdate = {}) {
            const current = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            const updated = { ...current, ...partialUpdate };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    }
})();
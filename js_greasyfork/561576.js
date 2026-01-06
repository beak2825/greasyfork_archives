// ==UserScript==
// @name        [GC] - AIO Shop Wiz
// @namespace   https://greasyfork.org/
// @match       https://www.grundos.cafe/*
// @exclude     https://www.grundos.cafe/itemview/*
// @license     MIT
// @version     1
// @author      Cupkait, arithmancer
// @icon        https://i.imgur.com/4Hm2e6z.png
// @grant       none
// @require     https://update.greasyfork.org/scripts/512407/1582200/GC%20-%20Virtupets%20API%20library.js

// @description For use when you have a .wiz grid-area in your sidebar CSS. Shop Wiz searches default to appearing in your AIO sidebar.

// @downloadURL https://update.greasyfork.org/scripts/561576/%5BGC%5D%20-%20AIO%20Shop%20Wiz.user.js
// @updateURL https://update.greasyfork.org/scripts/561576/%5BGC%5D%20-%20AIO%20Shop%20Wiz.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'shopWizPopoutState';

  init();

  function init() {
    const sidebar = document.getElementById('aio_sidebar');
    if (!sidebar) return;

    const ua = navigator.userAgent || '';
    const isMobileFirefox = /Android/i.test(ua) && /Firefox/i.test(ua);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      x: 100,
      y: 100,
      width: 300,
      height: 250,
      open: false
    };

    const popout = document.createElement('div');
    popout.classList.add('aio-section', 'wiz');
    Object.assign(popout.style, {
      width: `100%`,
      background: 'rgba(24, 16, 34, 0.9)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    });

    const header = document.createElement('div');
    header.classList.add('aio-section-header');
    header.textContent = 'Shop Wizard';

    const title = document.createElement('span');

    const countSpan = document.createElement('span');
    countSpan.style.marginLeft = '8px';
    countSpan.style.fontSize = '90%';
    countSpan.style.opacity = '0.7';

    popout.appendChild(header);

    const inputContainer = document.createElement('div');
    inputContainer.style.padding = '8px';
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '5px';
    inputContainer.style.marginTop = '5px';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search for an exact item...';
    input.style.flex = '1';
    input.style.padding = '5px';
    input.style.border = '1px solid #aaa';
    input.style.borderRadius = '4px';
    // Prevent mobile browsers (esp. Firefox Android) from auto-zooming on focus
    // by ensuring the input font-size is >= 16px and using a search input mode.
    input.style.fontSize = '16px';
    input.setAttribute('inputmode', 'search');
    input.setAttribute('enterkeyhint', 'search');
    input.autocapitalize = 'off';
    input.autocomplete = 'off';
    input.style.width = '100%';
    input.style.color = 'black';


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
    content.innerHTML = '<p style="margin-top:5px">Search results...</p>';
    content.style.maxHeight = '300px';
    content.style.overflowY = 'auto';
    popout.appendChild(content);

    sidebar.appendChild(popout);

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

        content.innerHTML = '';
        content.appendChild(termLabel);

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

            // Your target name to highlight, Replace your name below
            const targetName = 'arithmancer';

            if(row.seller.includes(targetName)) {
              // Highlight cell if target name is found
              sellerCell.style.backgroundColor = 'yellow';
            }

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

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    });

    goBtn.addEventListener('click', handleSearch);

    document.addEventListener('click', function (e) {
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

          if (!isMobileFirefox) {
            input.focus();
          } else {
            // Avoid auto-zoom and keyboard pop on Mobile Firefox
            // by not focusing automatically.
            input.blur();
          }
          handleSearch();
        }
      } catch (err) {
        console.error('Failed to extract query from Shop Wizard link:', err);
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

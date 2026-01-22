// ==UserScript==
// @name             Neopets: itemdb info in shop
// @namespace        kmtxcxjx
// @version          1.0.1
// @description      Adds ItemDB info to the Neopets market page
// @match            https://www.neopets.com/market.phtml*
// @grant            GM.xmlHttpRequest
// @connect          itemdb.com.br
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/563510/Neopets%3A%20itemdb%20info%20in%20shop.user.js
// @updateURL https://update.greasyfork.org/scripts/563510/Neopets%3A%20itemdb%20info%20in%20shop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Only run if &type=your is present
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') !== 'your') return;

    const form = document.querySelector('form[action="process_market.phtml"]');
    if (!form) return;

    const table = form.querySelector('table');
    if (!table) return;

    const tbody = table.querySelector('tbody');
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll('tr'));
    if (rows.length < 3) return;

    const headerRow = rows[0];
    const footerRow = rows[rows.length - 1];
    const itemRows = rows.slice(1, -1);

    const ids = [];
    const rowToId = new Map();

    itemRows.forEach(tr => {
        const tds = tr.querySelectorAll('td');
        if (!tds.length) return;

        const lastTd = tds[tds.length - 1];
        const control = lastTd.querySelector('select[name], input[name]');
        if (!control) return;

        const match = control.name.match(/\[(\d+)\]/);
        if (!match) return;

        const id = match[1];
        ids.push(id);
        rowToId.set(tr, id);
    });

    if (!ids.length) return;

    function rarityColor(rarity) {
        return rarity === 99 ? 'green'
            : rarity === 500 ? 'gold'
            : rarity === 180 ? '#666666'
            : rarity < 75 ? '#dda713'
            : rarity >= 75 && rarity < 101 ? '#7ba515'
            : rarity >= 101 && rarity <= 104 ? '#aa4455'
            : rarity >= 105 && rarity < 111 ? 'orange'
            : rarity >= 111 ? 'red'
            : '#000';
    }

    GM.xmlHttpRequest({
        method: 'POST',
        url: 'https://itemdb.com.br/api/v1/items/many',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ item_id: ids }),
        onload: function (response) {
            let data;
            try {
                data = JSON.parse(response.responseText);
            } catch {
                return;
            }

            function insertTd(tr, td) {
                const tds = tr.querySelectorAll('td');
                if (tds.length >= 5) {
                    tr.insertBefore(td, tds[4]);
                } else {
                    tr.appendChild(td);
                }
            }

            // Header
            const headerTd = document.createElement('td');
            headerTd.setAttribute('bgcolor', '#dddd77');
            headerTd.setAttribute('align', 'center');

            const img = document.createElement('img');
            img.src = 'https://images.neopets.com/themes/h5/basic/images/v3/quickstock-icon.svg';
            img.width = 20;
            img.style.verticalAlign = 'middle';

            const label = document.createElement('b');
            label.textContent = ' itemdb';

            headerTd.appendChild(img);
            headerTd.appendChild(label);
            insertTd(headerRow, headerTd);

            // Body rows
            itemRows.forEach(tr => {
                const td = document.createElement('td');
                td.setAttribute('bgcolor', '#ffffcc');
                td.setAttribute('align', 'center');

                const id = rowToId.get(tr);
                const item = data?.[id];

                let first = true;

                if (item && typeof item.rarity === 'number') {
                    const raritySpan = document.createElement('span');
                    raritySpan.textContent = `r${item.rarity}`;
                    raritySpan.style.fontWeight = 'bold';
                    raritySpan.style.color = rarityColor(item.rarity);

                    td.appendChild(raritySpan);
                    first = false;
                }

                if (item?.saleStatus?.status && item.saleStatus.status !== 'regular') {
                    if (!first) td.appendChild(document.createElement('br'));

                    const span = document.createElement('span');
                    span.style.fontWeight = 'bold';

                    if (item.saleStatus.status === 'ets') {
                        span.textContent = '[ETS]';
                        span.style.color = 'green';
                    } else if (item.saleStatus.status === 'hts') {
                        span.textContent = '[HTS]';
                        span.style.color = 'red';
                    }

                    td.appendChild(span);
                    first = false;
                }

                if (item?.slug) {
                    if (!first) td.appendChild(document.createElement('br'));

                    const a = document.createElement('a');
                    a.href = `https://itemdb.com.br/item/${item.slug}`;
                    a.target = '_blank';
                    a.textContent = item.price?.value
                        ? `${item.price.value.toLocaleString()} NP`
                        : '??? NP';

                    td.appendChild(a);
                }

                insertTd(tr, td);
            });

            // Footer: increase colspan only
            const footerTd = footerRow.querySelector('td');
            if (footerTd) {
                const colspan = parseInt(footerTd.getAttribute('colspan') || '1', 10);
                footerTd.setAttribute('colspan', colspan + 1);
            }
        }
    });
})();
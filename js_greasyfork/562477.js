// ==UserScript==
// @name             itemDB prices on JellyNeo
// @namespace        kmtxcxjx
// @version          1.1.3
// @description      Makes itemDB prices show up on JellyNeo pages
// @match            *://items.jellyneo.net/*
// @grant            GM.xmlHttpRequest
// @connect          itemdb.com.br
// @run-at           document-end
// @icon             https://images.neopets.com/themes/h5/basic/images/v3/quickstock-icon.svg
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/562477/itemDB%20prices%20on%20JellyNeo.user.js
// @updateURL https://update.greasyfork.org/scripts/562477/itemDB%20prices%20on%20JellyNeo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Helpers ---
    function slugify(name) {
        return name
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .toLowerCase().trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/-{2,}/g, '-');
    }

    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' NP';
    }

    function createPriceLink(slug, priceText) {
        const span = document.createElement('span');
        span.className = 'text-small';

        const a = document.createElement('a');
        a.className = 'price-history-link';
        a.href = `https://itemdb.com.br/item/${slug}`;

        const img = document.createElement('img');
        img.src = 'https://images.neopets.com/themes/h5/basic/images/v3/quickstock-icon.svg';
        img.width = 20;
        img.style.verticalAlign = 'middle';

        a.appendChild(img);
        a.appendChild(document.createTextNode(' ' + priceText));
        span.appendChild(a);

        return span;
    }

    // --- Item page branch ---
    if (/^https?:\/\/items\.jellyneo\.net\/item\//.test(location.href)) {
        const h1 = document.querySelector('h1');
        if (!h1) return;

        const name = h1.textContent.trim();
        const slug = slugify(name);

        GM.xmlHttpRequest({
            method: 'GET',
            url: `https://itemdb.com.br/api/v1/items/${slug}`,
            headers: { 'Accept': 'application/json' },
            onload: res => {
                try {
                    const data = JSON.parse(res.responseText);
                    if (!data || data.type !== 'np' || !data.price?.value) return;

                    const priceText = formatNumber(data.price.value);
                    const priceLink = createPriceLink(slug, priceText);

                    const wishlistBtn = document.querySelector('button[data-reveal-id="add-to-wishlist-modal"]');
                    if (wishlistBtn) {
                        const br = document.createElement('br'); // always add linebreak
                        wishlistBtn.insertAdjacentElement('afterend', br);
                        br.insertAdjacentElement('afterend', priceLink);
                    }
                } catch {}
            }
        });
        return; // done, item page handled
    }

    // --- List page branch ---
    const itemsByName = new Map();
    const containerOriginalOrder = [];

    document.querySelectorAll('a.no-link-icon').forEach(iconLink => {
        const container = iconLink.closest('li, p');
        if (!container) return;

        const anchors = container.querySelectorAll('a');
        if (anchors.length < 2) return;

        const name = anchors[1].textContent.trim();
        if (!name) return;

        const slug = slugify(name);

        if (!itemsByName.has(name)) itemsByName.set(name, []);
        itemsByName.get(name).push({ container, slug });
        containerOriginalOrder.push(container);
    });

    const names = [...itemsByName.keys()];
    if (!names.length) return;

    GM.xmlHttpRequest({
        method: 'POST',
        url: 'https://itemdb.com.br/api/v1/items/many',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ name: names }),
        onload: res => {
            if (res.status !== 200) return;

            let data;
            try { data = JSON.parse(res.responseText); } catch { return; }

            // Insert prices
            for (const [name, entries] of itemsByName.entries()) {
                const item = data[name];
                const priceValue = item?.type === 'np' && item.price?.value ? item.price.value : null;
                const priceText = priceValue ? formatNumber(priceValue) : null;

                entries.forEach(({ container, slug }) => {
                    if (container.querySelector('a[href*="/item/' + slug + '"]')) return;

                    const label = container.querySelector('label');
                    const refNode = label || null;
                    const prevNode = refNode ? refNode.previousSibling : container.lastChild;

                    if (!prevNode || prevNode.nodeName !== 'BR') {
                        const br = document.createElement('br');
                        if (refNode) container.insertBefore(br, refNode);
                        else container.appendChild(br);
                    }

                    if (priceText) {
                        const priceLink = createPriceLink(slug, priceText);
                        if (refNode) container.insertBefore(priceLink, refNode);
                        else container.appendChild(priceLink);
                    }

                    container.dataset.itemdbPrice = priceValue ?? '';
                });
            }

            // --- Sorting button ---
            const urlParams = new URLSearchParams(window.location.search);
            // Check if at least one item has a valid price
            const hasAnyPrices = containerOriginalOrder.some(c => c.dataset.itemdbPrice);
            let shouldAddSortButton = hasAnyPrices && (urlParams.get('order_by') === '4' || urlParams.get('sort') === '5');
            // Fallback: check if "Sort By: Price" exists in the sort dropdown
            if (!shouldAddSortButton) {
                const sortDiv = document.querySelector('div#wishlists-sort-dropdown-btn');
                if (sortDiv && sortDiv.textContent.includes('Sort By: Price')) {
                    shouldAddSortButton = hasAnyPrices && true;
                }
            }
            if (!shouldAddSortButton) return;

            const descending = urlParams.get('sort_dir') === 'desc';

            const sortBtn = document.createElement('button');
            sortBtn.textContent = 'Sort by ItemDB Price';
            sortBtn.style.marginRight = '8px';
            sortBtn.className = 'button tiny';

            sortBtn.addEventListener('click', () => {
                const liContainers = [];
                const divContainers = [];

                containerOriginalOrder.forEach(c => {
                    if (c.tagName === 'LI') liContainers.push(c);
                    else if (c.tagName === 'P') divContainers.push(c.parentElement);
                });

                function sortContainers(containers, isDiv = false) {
                    containers.sort((a, b) => {
                        const elA = isDiv ? a.querySelector('p') : a;
                        const elB = isDiv ? b.querySelector('p') : b;

                        const priceA = parseInt(elA.dataset.itemdbPrice) || null;
                        const priceB = parseInt(elB.dataset.itemdbPrice) || null;

                        if (priceA !== null && priceB !== null) return descending ? priceB - priceA : priceA - priceB;
                        if (priceA === null && priceB !== null) return 1;
                        if (priceA !== null && priceB === null) return -1;
                        return 0;
                    });
                }

                sortContainers(liContainers);
                sortContainers(divContainers, true);

                const liParent = liContainers[0]?.parentElement;
                if (liParent) liContainers.forEach(c => liParent.appendChild(c));

                const divParent = divContainers[0]?.parentElement;
                if (divParent) divContainers.forEach(c => divParent.appendChild(c));

                // Deactivate button after sorting
                sortBtn.disabled = true;
                sortBtn.textContent = 'Sorted by ItemDB price ✔️';
            });

            const targetDiv = document.querySelector('div#wishlists-sort-dropdown-btn');
            if (targetDiv) targetDiv.parentNode.insertBefore(sortBtn, targetDiv);
            else {
                const printLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'Print');
                if (printLink) printLink.parentNode.insertBefore(sortBtn, printLink);
            }
        }
    });
})();

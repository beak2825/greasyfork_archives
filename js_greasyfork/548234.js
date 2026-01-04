// ==UserScript==
// @name         ors
// @namespace    http://tampermonkey.net/
// @version      1
// @description  extract products from ors portal
// @author       You
// @match        https://www.orsnasco.com/storefrontCommerce/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=orsnasco.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548234/ors.user.js
// @updateURL https://update.greasyfork.org/scripts/548234/ors.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const products = [];
    const startTime = performance.now();

    const container = document.querySelector('.col-sm-2.refine');
    const button = document.createElement('button');

    button.textContent = 'Download';
    button.classList.add('download-button');

    // Insert at the top if there are children
    if (container.firstElementChild) {
        container.insertBefore(button, container.firstElementChild);
    } else {
        container.appendChild(button);
    }

    // Apply styles
    button.style.padding = '2px 4px';
    button.style.border = '1px solid grey';
    button.style.color = 'black';
    button.style.backgroundColor = 'lightgrey';
    button.style.cursor = 'pointer';
    button.style.width = '100%';
    button.style.fontSize = '10px';

    // Create progress bars
    const overallBar = document.createElement('div');
    const pageBar = document.createElement('div');
    overallBar.style.height = '6px';
    overallBar.style.background = '#e0e0e0';
    overallBar.style.marginTop = '2px';
    overallBar.style.borderRadius = '3px';
    overallBar.style.overflow = 'hidden';
    overallBar.style.position = 'relative';
    overallBar.style.display = 'none';

    pageBar.style.height = '6px';
    pageBar.style.background = '#e0e0e0';
    pageBar.style.marginTop = '2px';
    pageBar.style.borderRadius = '3px';
    pageBar.style.overflow = 'hidden';
    pageBar.style.position = 'relative';
    pageBar.style.display = 'none';

    // Inner bars
    const overallInner = document.createElement('div');
    overallInner.style.height = '100%';
    overallInner.style.width = '0%';
    overallInner.style.background = '#2196f3';
    overallInner.style.transition = 'width 0.2s';

    const pageInner = document.createElement('div');
    pageInner.style.height = '100%';
    pageInner.style.width = '0%';
    pageInner.style.background = '#90ee90';
    pageInner.style.transition = 'width 0.2s';

    overallBar.appendChild(overallInner);
    pageBar.appendChild(pageInner);

    // Insert progress bars below button
    container.insertBefore(overallBar, button.nextSibling);
    container.insertBefore(pageBar, overallBar.nextSibling);

    // IndexedDB helpers
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ors-products-db', 1);
            request.onupgradeneeded = function (event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('products')) {
                    db.createObjectStore('products', { keyPath: 'ID' });
                }
            };
            request.onsuccess = function (event) {
                resolve(event.target.result);
            };
            request.onerror = function (event) {
                reject(event.target.error);
            };
        });
    }

    function getProduct(db, id) {
        return new Promise((resolve) => {
            const tx = db.transaction('products', 'readonly');
            const store = tx.objectStore('products');
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(null);
        });
    }

    function setProduct(db, product) {
        return new Promise((resolve) => {
            const tx = db.transaction('products', 'readwrite');
            const store = tx.objectStore('products');
            store.put(product);
            tx.oncomplete = () => resolve();
            tx.onerror = () => resolve();
        });
    }

    button.addEventListener('click', async () => {
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Preparing...';
        button.style.background = 'lightgrey';
        overallInner.style.width = '0%';
        pageInner.style.width = '0%';

        // Show progress bars
        overallBar.style.display = '';
        pageBar.style.display = '';

        const db = await openDB();

        const currentUrl = new URL(document.querySelector('.itemListNavPagination > a').href)
        const totalItem = Number(document.querySelector(".numberOfShowingResults").innerText.split(" ").at(-2));
        const totalPages = Math.ceil(totalItem / 100);

        currentUrl.searchParams.set('currentPage', 1)
        currentUrl.searchParams.set('totalElements', totalItem)
        currentUrl.searchParams.set('elementsPerPage', 100)

        let overallCount = 0;

        for (let i = 1; i <= totalPages; i++) {
            button.textContent = `Downloading... (Page ${i}/${totalPages})`;
            currentUrl.searchParams.set('pageClicked', i)

            const webPageHtml = await fetch(currentUrl.href).then(r => r.text());
            const webpage = new DOMParser().parseFromString(webPageHtml, "text/html");

            const productIds = webpage.querySelector("input[name=itemOrder]").value.split(";").slice(0, -1)
            const totalItemsOnPage = productIds.length;

            const batchCount = 50;
            // Process productIds in batches of 5
            for (let j = 0; j < productIds.length; j += batchCount) {
                const itemsDone = Math.min(j + batchCount, totalItemsOnPage);
                const percentPage = Math.round((itemsDone / totalItemsOnPage) * 100);

                overallCount += Math.min(batchCount, totalItemsOnPage - j);
                const percentOverall = Math.round((overallCount / totalItem) * 100);

                // Update progress bars
                overallInner.style.width = percentOverall + '%';
                pageInner.style.width = percentPage + '%';

                const batch = productIds.slice(j, j + batchCount);
                const productDetails = await Promise.all(batch.map(async (id) => {
                    // Try to get product from indexedDB
                    const cached = await getProduct(db, id);
                    if (cached) return cached;

                    // Fetch if not cached
                    const response = await fetch("https://www.orsnasco.com/storefrontCommerce/itemDetail.do?item-id=" + id)
                        .then(r => r.text());

                    const page = new DOMParser().parseFromString(response, "text/html");

                    const product = {
                        'ID': id,
                        'ITEM #': page.querySelector("td.detail__item-no")?.innerText,
                        'TITLE': page.querySelector("td.text.detail__desc")?.innerText || "N/A",
                        'BRAND': page.querySelector("td.text.detail__manufac")?.innerText || "N/A",
                        'UPC': page.querySelector("td.detail__upc")?.innerText || "N/A",
                        'QTY': page.querySelector("td.text.detail__avail")?.innerText || "N/A",
                        'LIST PRICE': page.querySelector("td.detail__lprice")?.innerText || "N/A",
                        'SELLING PRICE': page.querySelector("td.detail__pricesell")?.innerText || "N/A"
                    };

                    // Ignore products with null ITEM #
                    if (product['ITEM #'] == null) return null;

                    await setProduct(db, product);
                    return product;
                }));

                // Only push products that are not null
                products.push(...productDetails.filter(p => p !== null));
            }
            // Reset page progress bar for next page
            pageInner.style.width = '0%';
        }

        const endTime = performance.now();
        const totalTimeSeconds = ((endTime - startTime) / 1000).toFixed(2);
        console.log(`Total time took: ${totalTimeSeconds} seconds`);

        button.textContent = 'Exporting...';
        button.style.background = 'lightgrey';
        if (typeof XLSX === 'undefined') {
            const script = document.createElement('script');
            script.src = "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
            script.onload = () => exportToExcel(products);
            document.body.appendChild(script);
        } else {
            exportToExcel(products);
        }

        overallInner.style.width = '100%';
        pageInner.style.width = '100%';
        button.textContent = originalText;
        button.style.background = 'lightgrey';
        button.disabled = false;

        // Hide progress bars after export
        setTimeout(() => {
            overallBar.style.display = 'none';
            pageBar.style.display = 'none';
        }, 1200);
    })


    function exportToExcel(data) {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "ors-products.xlsx");
    }
})();
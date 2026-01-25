// ==UserScript==
// @name             Neopets: itemdb info in Igloo Garage Sale
// @namespace        kmtxcxjx
// @version          1.1
// @description      Adds ItemDB info to the Igloo Garage Sale page
// @match            *://www.neopets.com/winter/igloo.phtml*
// @grant            GM.xmlHttpRequest
// @connect          itemdb.com.br
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/563732/Neopets%3A%20itemdb%20info%20in%20Igloo%20Garage%20Sale.user.js
// @updateURL https://update.greasyfork.org/scripts/563732/Neopets%3A%20itemdb%20info%20in%20Igloo%20Garage%20Sale.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const igsShop = document.querySelector('#IGSShop');
    if (!igsShop) return;

    const container = igsShop.querySelector('.h5-container');
    if (!container) return;

    const divs = Array.from(container.querySelectorAll('div.h5-flex.igs-item'));
    if (divs.length === 0) return;

    const ids = divs.map(div => parseInt(div.id)).filter(id => !isNaN(id));
    if (ids.length === 0) return;

    GM.xmlHttpRequest({
        method: 'POST',
        url: 'https://itemdb.com.br/api/v1/items/many',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ item_id: ids }),
        onload: function(response) {
            let data;
            try {
                data = JSON.parse(response.responseText);
            } catch {
                return;
            }
            let maxKey = null;
            let maxVal = -1;

            for (const k in data) {
                const v = data[k].price?.value;
                if (v > maxVal) {
                    maxVal = v;
                    maxKey = k;
                }
            }

            if (maxKey) data[maxKey].highest = true;

            divs.forEach(div => {
                const id = parseInt(div.id);
                const itemData = data[id] || data[id.toString()];
                if (!itemData) return;

                const ps = div.querySelectorAll('p');
                const lastP = ps[ps.length - 1];
                if (!lastP) return;

                const newP = document.createElement('p');
                const link = document.createElement('a');
                link.href = `https://itemdb.com.br/item/${itemData.slug}`;
                link.target = '_blank';

                const img = document.createElement('img');
                img.src = 'https://images.neopets.com/themes/h5/basic/images/v3/quickstock-icon.svg';
                img.width = 20;
                img.style.verticalAlign = 'middle';
                link.appendChild(img);

                let priceText = "??? NP";
                if (itemData.status === "no trade") {
                    priceText = "No trade";
                } else if (itemData.price.value != null) {
                    priceText = itemData.price.value.toLocaleString() + " NP";
                }

                const spanText = document.createTextNode(' ' + priceText);
                link.appendChild(spanText);

                const costMatch = lastP.textContent.match(/\d+/);
                const originalCost = costMatch ? parseInt(costMatch[0]) : 0;

                if (itemData.price.value != null && itemData.status !== "no trade") {
                    if (itemData.price.value > originalCost) {
                        link.style.color = 'green';
                    } else if (itemData.price.value < originalCost) {
                        link.style.color = 'red';
                    } else {
                        link.style.color = 'black';
                    }
                }

                newP.appendChild(link);
                div.appendChild(newP);

                if (originalCost && itemData.price.value != null && itemData.status !== "no trade") {
                    if (itemData.price.value > 100000) {
                        div.style.border = '4px solid green';
                    } else if (itemData.price.value > 40000) {
                        div.style.border = '3px solid green';
                    } else if (itemData.price.value > 20000) {
                        div.style.border = '2px solid green';
                    } else if (itemData.price.value > 10000) {
                        div.style.border = '1px solid green';
                    }
                }
                if (itemData.highest) {
                    div.style.border = '4px solid blue';
                }
            });
        }
    });
})();

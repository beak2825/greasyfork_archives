// ==UserScript==
// @name         Neopets Trading Post Price Checker
// @version      1.0
// @description  Fetches itemdb prices for TP lots and displays a total lot value.
// @author       Logan Bell
// @match        *://www.neopets.com/island/tradingpost.phtml*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      itemdb.com.br
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      @MIT
// @namespace https://greasyfork.org/users/1544075
// @downloadURL https://update.greasyfork.org/scripts/560127/Neopets%20Trading%20Post%20Price%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/560127/Neopets%20Trading%20Post%20Price%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = window.jQuery.noConflict(true);
    const API_URL = "https://itemdb.com.br/api/v1/items/many";

    GM_addStyle(`
        .tp-itemdb-price {
            display: block;
            font-size: 11px;
            color: #006600 !important;
            font-weight: bold;
            margin-top: 2px;
            text-decoration: none;
            text-align: center;
            width: 100%;
        }
        .tp-itemdb-price:hover { text-decoration: underline; }

        .tp-lot-total-value {
            background: #f0f4f7;
            border: 1px solid #d1dce4;
            border-radius: 8px;
            padding: 8px;
            margin: 10px 12px;
            text-align: center;
            font-family: "Museo Sans", Arial, sans-serif;
        }
        .tp-total-label { font-size: 12px; color: #555; font-weight: bold; text-transform: uppercase; }
        .tp-total-amount { font-size: 16px; color: #006600; font-weight: 900; display: block; }
    `);

    function processPopupItems() {
        const $popup = $('.tp-popup:visible');
        if (!$popup.length) return;

        const itemElements = $popup.find('.tp-grid-item, .flex.flex-col.items-center');
        const itemsToFetch = [];
        let totalValue = 0;
        let pendingRequests = 0;

        itemElements.each(function() {
            const $el = $(this);
            if ($el.hasClass('price-checked') || $el.find('.tp-itemdb-price').length > 0) return;

            const nameText = $el.find('p.text-center, .tp-grid-item-name').first().text().trim();
            // Look for quantity badge (item-count class)
            const qtyText = $el.find('.item-count').text().trim();
            const qty = parseInt(qtyText) || 1;

            if (nameText && nameText.length > 1) {
                $el.addClass('price-checked');
                itemsToFetch.push({ name: nameText, element: $el, qty: qty });
            }
        });

        if (itemsToFetch.length === 0) return;

        const names = itemsToFetch.map(i => i.name);
        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ name: names }),
            onload: function(response) {
                try {
                    const apiData = JSON.parse(response.responseText);
                    itemsToFetch.forEach(item => {
                        const info = apiData[item.name];
                        let priceDisplay = "Unknown";
                        let numericPrice = 0;
                        let slug = "";

                        if (info) {
                            slug = info.slug || "";
                            if (info.price && info.price.value) {
                                numericPrice = info.price.value;
                                priceDisplay = numericPrice.toLocaleString() + " NP";
                                totalValue += (numericPrice * item.qty);
                            } else if (info.isNC) {
                                priceDisplay = "NC Item";
                            }
                        }

                        const linkUrl = slug
                            ? `https://itemdb.com.br/item/${slug}`
                            : `https://itemdb.com.br/items?q=${encodeURIComponent(item.name)}`;

                        item.element.append($(`<a href="${linkUrl}" target="_blank" class="tp-itemdb-price">${priceDisplay}</a>`));
                    });

                    updateTotalDisplay($popup, totalValue);
                } catch (e) { console.error("TP Price Checker Error:", e); }
            }
        });
    }

    function updateTotalDisplay($popup, addition) {
        let $totalContainer = $popup.find('.tp-lot-total-value');
        if (!$totalContainer.length) {
            // Inject above the wishlist section
            $totalContainer = $(`
                <div class="tp-lot-total-value">
                    <span class="tp-total-label">Estimated Lot Value</span>
                    <span class="tp-total-amount">0 NP</span>
                </div>
            `);
            $popup.find('.bg-white').after($totalContainer);
        }

        // Update existing total
        const currentTotal = parseInt($totalContainer.find('.tp-total-amount').text().replace(/[^0-9]/g, '')) || 0;
        const newTotal = currentTotal + addition;
        $totalContainer.find('.tp-total-amount').text(newTotal.toLocaleString() + " NP");
    }

    const observer = new MutationObserver((mutations) => {
        if ($('.tp-popup:visible').length) {
            clearTimeout(window.tpPriceTimer);
            window.tpPriceTimer = setTimeout(processPopupItems, 300);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    $(document).ready(processPopupItems);
})();
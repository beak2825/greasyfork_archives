// ==UserScript==
// @name         Skeb Price Sorter with Currency Conversion
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Adds a option to sort skeb users by price with currency conversion.
// @author       Zappo edited by Kafkell
// @match        https://*.skeb.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skeb.jp
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_listValues
// @grant        GM.listValues
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553711/Skeb%20Price%20Sorter%20with%20Currency%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/553711/Skeb%20Price%20Sorter%20with%20Currency%20Conversion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var token = localStorage.getItem('token');
    var exchangeRates = {
        usd: null,
        ntd: null,
        lastUpdated: null
    };
    var currencySettings = {
        showUSD: true,
        showNTD: true,
        customCurrencies: []
    };

    function loadCurrencySettings() {
        GM.getValue('sph_currency_settings').then(settings => {
            if (settings) {
                currencySettings = {...currencySettings, ...settings};
                console.log("Loaded currency settings:", currencySettings);
            }
        });
    }

    function saveCurrencySettings() {
        GM.setValue('sph_currency_settings', currencySettings);
    }

    function fetchExchangeRates(callback) {
        const primaryUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json';
        const fallbackUrl = 'https://latest.currency-api.pages.dev/v1/currencies/jpy.json';

        function tryFetch(url, isFallback = false) {
            GM.xmlHttpRequest({
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            var data = JSON.parse(response.responseText);
                            if (data.jpy) {
                                exchangeRates = {
                                    usd: data.jpy.usd,
                                    ntd: data.jpy.twd,
                                    lastUpdated: new Date().toISOString()
                                };
                                currencySettings.customCurrencies.forEach(currency => {
                                    if (data.jpy[currency.code]) {
                                        exchangeRates[currency.code] = data.jpy[currency.code];
                                    }
                                });
                                console.log("Exchange rates updated:", exchangeRates);
                                GM.setValue('sph_exchange_rates', exchangeRates);
                                if (callback) callback(exchangeRates);
                                return;
                            }
                        } catch (error) {
                            console.log('Parse exchange rate error: ' + error);
                        }
                    }
                    if (!isFallback) {
                        console.log("Primary exchange rate API failed, trying fallback...");
                        tryFetch(fallbackUrl, true);
                    } else {
                        console.log("All exchange rate APIs failed");
                        GM.getValue('sph_exchange_rates').then(cachedRates => {
                            if (cachedRates) {
                                exchangeRates = cachedRates;
                                console.log("Using cached exchange rates:", exchangeRates);
                                if (callback) callback(exchangeRates);
                            } else if (callback) {
                                callback(null);
                            }
                        });
                    }
                },
                onerror: function() {
                    if (!isFallback) {
                        console.log("Primary exchange rate API error, trying fallback...");
                        tryFetch(fallbackUrl, true);
                    } else {
                        console.log("All exchange rate APIs failed");
                        GM.getValue('sph_exchange_rates').then(cachedRates => {
                            if (cachedRates) {
                                exchangeRates = cachedRates;
                                console.log("Using cached exchange rates:", exchangeRates);
                                if (callback) callback(exchangeRates);
                            } else if (callback) {
                                callback(null);
                            }
                        });
                    }
                }
            });
        }

        GM.getValue('sph_exchange_rates').then(cachedRates => {
            if (cachedRates && isRateRecent(cachedRates.lastUpdated)) {
                exchangeRates = cachedRates;
                console.log("Using recent cached exchange rates:", exchangeRates);
                if (callback) callback(exchangeRates);
            } else {
                console.log("Fetching fresh exchange rates...");
                tryFetch(primaryUrl);
            }
        });
    }

    function isRateRecent(timestamp) {
        if (!timestamp) return false;
        const lastUpdate = new Date(timestamp);
        const now = new Date();
        const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
        return hoursDiff < 24;
    }

    function formatCurrency(amount, rate, currencyCode) {
        if (!rate) return '';
        const converted = amount * rate;
        return `${converted.toFixed(2)} ${currencyCode}`;
    }

    function formatPriceDisplay(price) {
        let display = `<div style="color: #ff0000; font-size: 1em; font-weight: bold; margin-bottom: 3px;">${price.toLocaleString()} JPY</div>`;
        const parts = [];

        if (currencySettings.showUSD && exchangeRates.usd) {
            parts.push(formatCurrency(price, exchangeRates.usd, 'USD'));
        }
        if (currencySettings.showNTD && exchangeRates.ntd) {
            parts.push(formatCurrency(price, exchangeRates.ntd, 'NTD'));
        }

        currencySettings.customCurrencies.forEach(currency => {
            if (exchangeRates[currency.code]) {
                parts.push(formatCurrency(price, exchangeRates[currency.code], currency.code.toUpperCase()));
            }
        });

        if (parts.length > 0) {
            display += `<div style="font-size: 1em; color: #333; line-height: 1.2;">${parts.join(' | ')}</div>`;
        }

        return display;
    }

    function has_price(element) {
        return element.querySelector('.sph-price');
    }

    function get_price_uncached(user, callback) {
        GM.xmlHttpRequest({
            url: 'https://skeb.jp/api/users/' + user,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            onload: function(response) {
                try {
                    var data = JSON.parse(response.responseText);
                    var price = data.skills.filter(skill => skill.genre === 'art')[0].default_amount;
                    response.context(price);
                    GM.setValue(user, price).then(() => console.log("saving price for " + user), () => console.log("failed to save price for " + user));
                } catch (error) {
                    console.log('Fetch price error: ' + error);
                    console.log(response.responseText);
                }
            },
            context: callback
        });
    }

    function get_price(user, element, callback) {
        if (has_price(element)) {
            return;
        }
        GM.getValue(user).then(value => {
          if (value !== null && value !== undefined) {
              console.log("using cached price " + value + " for " + user);
              callback(value);
          } else {
              get_price_uncached(user, callback);
          }
        }, () => {
            get_price_uncached(user, callback);
        });
    }

    function add_price_to_user_list(element, price) {
        var price_element = document.createElement('div');

        price_element.innerHTML = formatPriceDisplay(price);
        price_element.classList.add('title', 'is-7', 'sph-price');
        price_element.style.marginTop = '-10px';
        price_element.style.marginBottom = '-5px';
        price_element.style.minHeight = 'auto';
        price_element.style.height = 'auto';
        price_element.style.padding = '2px';
        price_element.setAttribute('data-price', price);

        const imageContainer = element.querySelector('.image');
        if (imageContainer && imageContainer.parentNode) {
            imageContainer.parentNode.insertBefore(price_element, imageContainer.nextSibling);
        } else {
            element.querySelector('.title').parentElement.querySelector('.image').append(price_element);
        }
    }

    function add_price_to_profile_table(element, price) {
        var price_row = document.createElement('tr');
        price_row.classList.add('sph-price');

        var price_td1 = document.createElement('td');
        price_td1.innerHTML = '<strong style="color: #ff0000;">Artwork (past price)</strong>';
        price_row.append(price_td1);

        var price_td2 = document.createElement('td');
        price_td2.innerHTML = formatPriceDisplay(price);
        price_td2.style.lineHeight = '1.3';
        price_td2.setAttribute('data-price', price);

        price_row.append(price_td2);
        element.querySelector('table tbody').prepend(price_row);
    }

    function add_conversion_to_recommended_amount() {
        if (!window.location.pathname.startsWith('/@')) {
            return;
        }

        const rows = document.querySelectorAll('table.table.is-fullwidth.is-narrow tr');
        rows.forEach(row => {
            const tds = row.querySelectorAll('td');
            if (tds.length >= 2 && tds[0].textContent.includes('Recommended amount')) {
                const amountText = tds[1].textContent.trim();
                const match = amountText.match(/JPY\s*([\d,]+)/);
                if (match) {
                    const price = parseInt(match[1].replace(/,/g, ''));
                    if (!tds[1].querySelector('.sph-conversion')) {
                        const conversionDiv = document.createElement('div');
                        conversionDiv.classList.add('sph-conversion');
                        conversionDiv.style.fontSize = '0.9em';
                        conversionDiv.style.color = '#ff0000';
                        conversionDiv.style.marginTop = '3px';
                        conversionDiv.style.fontWeight = 'bold';

                        const parts = [];
                        if (currencySettings.showUSD && exchangeRates.usd) {
                            parts.push(formatCurrency(price, exchangeRates.usd, 'USD'));
                        }
                        if (currencySettings.showNTD && exchangeRates.ntd) {
                            parts.push(formatCurrency(price, exchangeRates.ntd, 'NTD'));
                        }

                        currencySettings.customCurrencies.forEach(currency => {
                            if (exchangeRates[currency.code]) {
                                parts.push(formatCurrency(price, exchangeRates[currency.code], currency.code.toUpperCase()));
                            }
                        });

                        if (parts.length > 0) {
                            conversionDiv.textContent = parts.join(' | ');
                            tds[1].appendChild(conversionDiv);
                        }
                    }
                }
            }
        });
    }

    function get_for_all() {
        Array.from(document.querySelectorAll("a[href^='/@'][aria-label]"))
            .filter(el => !has_price(el))
            .forEach(el => get_price(el.href.substring(el.href.indexOf('@') + 1), el, price => add_price_to_user_list(el, price)));
    }

    function get_current_user_price(table) {
        var user_name = window.location.pathname.replace('/@', '');
        get_price(user_name, table, price => add_price_to_profile_table(table, price));
    }

    function get_element_price(element) {
        try {
            const priceElement = element.querySelector('.sph-price');
            if (priceElement && priceElement.getAttribute('data-price')) {
                return parseInt(priceElement.getAttribute('data-price'));
            }
            var priceText = element.querySelector('.sph-price').textContent;
            var match = priceText.match(/([\d,]+)\s*JPY/);
            if (match) {
                return parseInt(match[1].replace(/,/g, ''));
            }
            return Infinity;
        } catch (error) {
            console.log('Error getting price for element:', error);
            return Infinity;
        }
    }

    function sort_users() {
        var element = document.querySelector('.columns.has-cards');
        if (!element) {
            console.log('No .columns.has-cards element found');
            return;
        }

        const children = Array.from(element.children);
        console.log('Found', children.length, 'elements to sort');

        children.forEach((el, i) => el.style.order = '');

        const sorted = children.sort((a, b) => {
            const priceA = get_element_price(a);
            const priceB = get_element_price(b);
            console.log('Sorting:', priceA, 'vs', priceB);
            return priceA - priceB;
        });

        sorted.forEach((el, i) => {
            el.style.order = i;
            console.log('Order', i, ':', get_element_price(el));
        });

        console.log('Sorting completed');
    }

    function create_button(text, action) {
        var button = document.createElement('button');
        button.classList.add('button', 'is-primary', 'is-fullwidth', 'sph-buttom');
        button.textContent = text;
        button.onclick = action;
        return button;
    }

    function clear_cache() {
        GM.listValues().then(keys => {
            console.log(keys);
            keys.forEach(key => {
                if (key !== 'sph_exchange_rates' && key !== 'sph_currency_settings') {
                    GM.deleteValue(key);
                }
            });
        });
    }

    function refresh_exchange_rates() {
        fetchExchangeRates(function(rates) {
            if (rates) {
                document.querySelectorAll('.sph-price').forEach(element => {
                    let price = element.getAttribute('data-price');
                    if (!price) {
                        const priceMatch = element.textContent.match(/([\d,]+)\s*JPY/);
                        if (priceMatch) {
                            price = parseInt(priceMatch[1].replace(/,/g, ''));
                        }
                    }

                    if (price) {
                        const parent = element.parentElement;
                        element.remove();

                        if (parent.classList && parent.classList.contains('card-content')) {
                            const userCard = parent.querySelector("a[href^='/@'][aria-label]");
                            if (userCard) {
                                add_price_to_user_list(userCard, parseInt(price));
                            }
                        } else if (parent.nodeName === 'TD') {
                            add_price_to_profile_table(parent.parentElement.parentElement, parseInt(price));
                        }
                    }
                });

                add_conversion_to_recommended_amount();

                alert('Exchange rates updated successfully!');
            } else {
                alert('Failed to update exchange rates. Using cached values if available.');
            }
        });
    }

    function showCurrencySettings() {
        const modal = document.createElement('div');
        modal.className = 'modal is-active';
        modal.innerHTML = `
            <div class="modal-background"></div>
            <div class="modal-card" style="max-width: 500px;">
                <header class="modal-card-head">
                    <p class="modal-card-title">Currency Display Settings</p>
                    <button class="delete" aria-label="close"></button>
                </header>
                <section class="modal-card-body">
                    <div class="field">
                        <label class="checkbox" style="display: block; margin-bottom: 15px;">
                            <input type="checkbox" id="sph-show-usd" ${currencySettings.showUSD ? 'checked' : ''}>
                            Show USD
                        </label>
                        <label class="checkbox" style="display: block; margin-bottom: 15px;">
                            <input type="checkbox" id="sph-show-ntd" ${currencySettings.showNTD ? 'checked' : ''}>
                            Show NTD
                        </label>
                    </div>

                    <div class="field">
                        <label class="label" style="font-size: 1em; margin-top: 20px; margin-bottom: 10px;">Add Custom Currencies</label>
                        <div class="field has-addons">
                            <div class="control is-expanded">
                                <input class="input" type="text" id="sph-new-currency" placeholder="Currency code (e.g., eur, gbp, cad)" style="font-size: 0.9em;">
                            </div>
                            <div class="control">
                                <button class="button is-info" id="sph-add-currency">Add</button>
                            </div>
                        </div>
                        <p class="help">Enter 3-letter currency codes supported by the exchange API</p>
                    </div>

                    <div id="sph-custom-currencies-list" style="margin-top: 15px; max-height: 200px; overflow-y: auto;">
                        ${currencySettings.customCurrencies.map(currency => `
                            <div class="field is-grouped is-grouped-multiline" style="margin-bottom: 10px;">
                                <div class="control">
                                    <div class="tags has-addons">
                                        <span class="tag is-medium is-info">${currency.code.toUpperCase()}</span>
                                        <a class="tag is-medium is-delete remove-currency" data-code="${currency.code}"></a>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="notification is-info is-light" style="margin-top: 20px;">
                        <p style="font-size: 0.9em;"><strong>Preview:</strong><br>
                        <span style="color: #ff0000; font-size: 1em; font-weight: bold;">12,000 JPY</span><br>
                        <span style="font-size: 1em; color: #333;">78.25 USD | 2,415.60 NTD</span></p>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" id="sph-save-settings">Save Settings</button>
                    <button class="button" id="sph-cancel-settings">Cancel</button>
                </footer>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.delete').addEventListener('click', removeModal);
        modal.querySelector('.modal-background').addEventListener('click', removeModal);
        modal.querySelector('#sph-cancel-settings').addEventListener('click', removeModal);

        modal.querySelector('#sph-add-currency').addEventListener('click', function() {
            const newCurrency = document.getElementById('sph-new-currency').value.trim().toLowerCase();
            if (newCurrency && newCurrency.length === 3) {
                if (!currencySettings.customCurrencies.some(c => c.code === newCurrency)) {
                    currencySettings.customCurrencies.push({ code: newCurrency });
                    updateCustomCurrenciesList();
                    document.getElementById('sph-new-currency').value = '';
                } else {
                    alert('Currency already added!');
                }
            } else {
                alert('Please enter a valid 3-letter currency code');
            }
        });

        function updateCustomCurrenciesList() {
            const list = modal.querySelector('#sph-custom-currencies-list');
            list.innerHTML = currencySettings.customCurrencies.map(currency => `
                <div class="field is-grouped is-grouped-multiline" style="margin-bottom: 10px;">
                    <div class="control">
                        <div class="tags has-addons">
                            <span class="tag is-medium is-info">${currency.code.toUpperCase()}</span>
                            <a class="tag is-medium is-delete remove-currency" data-code="${currency.code}"></a>
                        </div>
                    </div>
                </div>
            `).join('');

            list.querySelectorAll('.remove-currency').forEach(btn => {
                btn.addEventListener('click', function() {
                    const code = this.getAttribute('data-code');
                    currencySettings.customCurrencies = currencySettings.customCurrencies.filter(c => c.code !== code);
                    updateCustomCurrenciesList();
                });
            });
        }

        updateCustomCurrenciesList();

        modal.querySelector('#sph-save-settings').addEventListener('click', function() {
            currencySettings.showUSD = document.getElementById('sph-show-usd').checked;
            currencySettings.showNTD = document.getElementById('sph-show-ntd').checked;
            saveCurrencySettings();
            removeModal();
            refresh_exchange_rates();
        });

        function removeModal() {
            modal.remove();
        }
    }

    function add_sort_buttons() {
        var element = document.querySelector('.creatorSort');
        if (!element || element.parentElement.querySelector('.sph-buttom')) {
            return;
        }
        element.parentElement.append(create_button('Get prices', get_for_all));
        element.parentElement.append(create_button('Sort users', sort_users));
        element.parentElement.append(create_button('Clear cache', clear_cache));
        element.parentElement.append(create_button('Refresh rates', refresh_exchange_rates));
        element.parentElement.append(create_button('Currency settings', showCurrencySettings));
    }

    function add_past_price_button() {
        if (!window.location.pathname.startsWith('/@')) {
            return;
        }
        var button = Array.from(document.querySelectorAll('.button'))
            .filter(el => el.textContent === 'Notify on seeking started' || el.textContent === 'Notification reserved')
            .filter(el => !el.parentElement.querySelector('.sph-buttom'));
        if (!button.length) {
            return;
        }
        button = button[0];
        button.parentElement.append(create_button('Get past price', () => get_current_user_price(button.parentElement.parentElement.parentElement)));
    }

    function add_button() {
        add_sort_buttons();
        add_past_price_button();
        setTimeout(add_conversion_to_recommended_amount, 1000);
    }

    function add_observer() {
        var body = document.body;
        var observer = new MutationObserver(mutations => add_button());
        observer.observe(body, {childList: true, subtree: true});
    }

    loadCurrencySettings();
    fetchExchangeRates();
    add_observer();
})();

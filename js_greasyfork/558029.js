// ==UserScript==
// @name         SA - Waga gabarytowa na karcie zamówienia
// @namespace    https://premiumtechpanel.sellasist.pl/
// @version      1.0
// @author       Dawid Wróbel
// @description  Pokazuje wagę gabarytową produktów na karcie zamówienia w SellAsist dla DHL, DPD, InPost Kurier i UPS
// @match        https://premiumtechpanel.sellasist.pl/admin/orders/edit/*
// @grant        none
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/558029/SA%20-%20Waga%20gabarytowa%20na%20karcie%20zam%C3%B3wienia.user.js
// @updateURL https://update.greasyfork.org/scripts/558029/SA%20-%20Waga%20gabarytowa%20na%20karcie%20zam%C3%B3wienia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const COURIER_DIVISORS = {
        'DHL': 5000,
        'DPD': 6000,
        'InPost Kurier': 6000,
        'UPS': 5000
    };
    const productCache = {};
    let orderProductCount = 0;
    let processedProductCount = 0;
    const orderTotals = {
        realWeightTotal: 0,
        realWeightHasAny: false,
        realWeightMissingAny: false,
        courier: {}
    };

    function init() {
        const products = document.querySelectorAll('.c-order-product.js-admin-order-product');
        if (!products.length) {
            console.log('[VM Gabaryt] Nie znaleziono produktów na karcie zamówienia');
            return;
        }

        orderProductCount = products.length;
        processedProductCount = 0;

        products.forEach(processOrderProduct);
    }

    function processOrderProduct(orderProductEl) {
        const productId = orderProductEl.getAttribute('data-id');
        if (!productId) return;

        if (orderProductEl.dataset.gabarytProcessed === '1') return;
        orderProductEl.dataset.gabarytProcessed = '1';

        const quantity = getQuantity(orderProductEl);
        const infoContainer = getInfoContainer(orderProductEl);
        if (!infoContainer) return;

        addInfoLine(infoContainer, 'Waga gabarytowa', 'ładowanie danych z karty produktu...');

        getProductData(productId)
            .then(data => {
                infoContainer.innerHTML = '';

                if (!data || !data.length || !data.width || !data.height) {
                    addInfoLine(infoContainer, 'Waga gabarytowa', 'brak jednostkowych wymiarów opakowania na karcie produktu');
                    return;
                }

                const { length, width, height, weight } = data;
                const dimsText = `${length}×${width}×${height} cm`;
                const baseVolumeCm3PerItem = length * width * height;
                const baseVolumeCm3Total = baseVolumeCm3PerItem * quantity;
                const realTotal = (typeof weight === 'number' && !isNaN(weight))
                    ? weight * quantity
                    : null;

                addToOrderTotals(baseVolumeCm3Total, weight, quantity);

                addInfoLine(infoContainer, 'Wymiary jednostkowe', `${dimsText}`);
                addInfoLine(infoContainer, 'Ilość', `${quantity} szt.`);

                if (realTotal !== null) {
                    addInfoLine(
                        infoContainer,
                        'Waga rzeczywista',
                        `${realTotal.toFixed(3)} kg (${weight.toFixed(3)} kg/szt.)`
                    );
                } else {
                    addInfoLine(infoContainer, 'Waga rzeczywista', 'brak wagi na karcie produktu');
                }

                const courierLines = [];

                Object.entries(COURIER_DIVISORS).forEach(([name, divisor]) => {
                    const volumetricKg = baseVolumeCm3Total / divisor;
                    courierLines.push(`${name}: ${volumetricKg.toFixed(3)} kg`);
                });

                addInfoLine(
                    infoContainer,
                    'Waga gabarytowa (wg przewoźników)',
                    courierLines.join(' | ')
                );
            })
            .catch(err => {
                console.error('[VM Gabaryt] Błąd pobierania danych produktu', productId, err);
                infoContainer.innerHTML = '';
                addInfoLine(infoContainer, 'Waga gabarytowa', 'błąd pobierania karty produktu (sprawdź konsolę)');
            })
            .finally(() => {
                onProductFinished();
            });
    }

    function onProductFinished() {
        processedProductCount++;
        if (processedProductCount === orderProductCount) {
            renderOrderTotals();
        }
    }

    function addToOrderTotals(baseVolumeCm3Total, weight, quantity) {
        Object.entries(COURIER_DIVISORS).forEach(([name, divisor]) => {
            const volumetricKg = baseVolumeCm3Total / divisor;
            orderTotals.courier[name] = (orderTotals.courier[name] || 0) + volumetricKg;
        });

        if (typeof weight === 'number' && !isNaN(weight)) {
            orderTotals.realWeightHasAny = true;
            orderTotals.realWeightTotal += weight * quantity;
        } else {
            orderTotals.realWeightMissingAny = true;
        }
    }

    function renderOrderTotals() {
        if (orderProductCount <= 1) return;

        const courierNames = Object.keys(orderTotals.courier);
        if (!courierNames.length) return;

        const container = getOrderTotalsContainer();
        container.innerHTML = '';

        const title = document.createElement('div');
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '4px';
        title.textContent = 'Waga gabarytowa CAŁEGO zamówienia:';
        container.appendChild(title);

        if (orderTotals.realWeightHasAny) {
            const realRow = document.createElement('div');
            let text = `Waga rzeczywista: ${orderTotals.realWeightTotal.toFixed(3)} kg`;
            if (orderTotals.realWeightMissingAny) {
                text += ' (nie wszystkie produkty mają podaną wagę – wartość minimalna)';
            }
            realRow.textContent = text;
            container.appendChild(realRow);
        }

        courierNames.forEach(name => {
            const row = document.createElement('div');
            row.textContent = `${name}: ${orderTotals.courier[name].toFixed(3)} kg`;
            container.appendChild(row);
        });
    }

    function getOrderTotalsContainer() {
        let container = document.querySelector('[data-gabaryt-order-container]');
        if (container) return container;

        container = document.createElement('div');
        container.setAttribute('data-gabaryt-order-container', '1');
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '4px';
        container.style.padding = '6px 8px';
        container.style.marginBottom = '10px';
        container.style.fontSize = '12px';
        container.style.background = '#f9f9f9';

        const firstProduct = document.querySelector('.c-order-product.js-admin-order-product');
        if (firstProduct && firstProduct.parentElement) {
            firstProduct.parentElement.parentElement.insertBefore(container, firstProduct.parentElement);
        } else {
            const mainForm = document.querySelector('form');
            if (mainForm) {
                mainForm.insertBefore(container, mainForm.firstChild);
            } else {
                document.body.insertBefore(container, document.body.firstChild);
            }
        }

        return container;
    }

    function getQuantity(orderProductEl) {
        const quantityCell = orderProductEl.querySelector(
            '.c-order-product__data-column.quantity .c-order-product__data-column-value'
        );
        if (!quantityCell) return 1;

        const text = quantityCell.textContent.trim();
        const num = parseFloat(text.replace(',', '.'));
        return isNaN(num) ? 1 : num;
    }

    function getInfoContainer(orderProductEl) {
        let container = orderProductEl.querySelector('[data-gabaryt-container]');
        if (container) return container;

        let parent = orderProductEl.querySelector('.c-order-product__data-cells');
        if (!parent) {
            parent = document.createElement('div');
            parent.className = 'c-order-product__data-cells';
            const mainData = orderProductEl.querySelector('.c-order-product__main-data');
            if (mainData && mainData.parentElement) {
                mainData.parentElement.appendChild(parent);
            } else {
                orderProductEl.appendChild(parent);
            }
        }

        container = document.createElement('div');
        container.setAttribute('data-gabaryt-container', '1');
        container.style.marginTop = '4px';
        container.style.fontSize = '12px';
        container.style.lineHeight = '1.4';
        container.style.color = '#333';

        parent.appendChild(container);
        return container;
    }

    function addInfoLine(container, label, text) {
        const row = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = label + ': ';
        row.appendChild(strong);
        row.appendChild(document.createTextNode(text));
        container.appendChild(row);
    }

    function getProductData(productId) {
        if (productCache[productId]) {
            return Promise.resolve(productCache[productId]);
        }

        const base = location.origin;
        const url = `${base}/admin/catalog_products/edit/${productId}`;

        return fetch(url, { credentials: 'same-origin' })
            .then(resp => {
                if (!resp.ok) {
                    throw new Error(`HTTP ${resp.status}`);
                }
                return resp.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                const lengthInput = doc.querySelector('input[name="packages[normal][length]"]');
                const widthInput  = doc.querySelector('input[name="packages[normal][width]"]');
                const heightInput = doc.querySelector('input[name="packages[normal][height]"]');
                const weightInput = doc.querySelector('#weight');

                const length = lengthInput ? parseFloat((lengthInput.value || '').replace(',', '.')) : null;
                const width  = widthInput  ? parseFloat((widthInput.value  || '').replace(',', '.')) : null;
                const height = heightInput ? parseFloat((heightInput.value || '').replace(',', '.')) : null;
                const weight = weightInput ? parseFloat((weightInput.value || '').replace(',', '.')) : null;

                const data = { length, width, height, weight };
                productCache[productId] = data;
                return data;
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
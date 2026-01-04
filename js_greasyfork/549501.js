// ==UserScript==
// @name         FunPay: MLBB цены с/без наценки
// @namespace    FunPay: MLBB цены с/без наценки
// @version      1.0
// @description  Показывает цену с/без наценки для MLBB и автоматически поднимает предложения на Funpay
// @author       Maesta_Nequitia
// @match        https://funpay.com/lots/366/
// @match        https://funpay.com/users/*/
// @match        https://funpay.com/lots/366/trade
// @grant        GM_addStyle
// @icon         https://funpay.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549501/FunPay%3A%20MLBB%20%D1%86%D0%B5%D0%BD%D1%8B%20%D1%81%D0%B1%D0%B5%D0%B7%20%D0%BD%D0%B0%D1%86%D0%B5%D0%BD%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/549501/FunPay%3A%20MLBB%20%D1%86%D0%B5%D0%BD%D1%8B%20%D1%81%D0%B1%D0%B5%D0%B7%20%D0%BD%D0%B0%D1%86%D0%B5%D0%BD%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const markupRate = 1.181264; // 18,13% наценка

    const isLotPage = url === 'https://funpay.com/lots/366/';
    const isUserPage = url.match(/^https:\/\/funpay\.com\/users\/\d+\/$/);
    const isTradePage = url === 'https://funpay.com/lots/366/trade';

    /** ------------------------
     * Funpay Price Tools
     * ------------------------ */
    if (isLotPage || isUserPage || isTradePage) {
        if (isUserPage) {
            const targetBlock = document.querySelector('.offer-list-title-container h3 a[href="https://funpay.com/lots/366/"]');
            if (targetBlock) runPriceTools();
            else console.log('Нужный блок не найден — скрипт не выполняется.');
        } else {
            runPriceTools();
        }

        function runPriceTools() {
            function calculateOriginalPrice(price) {
                return Math.round(price / markupRate);
            }
            function calculatePriceWithMarkup(price) {
                return Math.round(price * markupRate);
            }

            const priceElements = document.querySelectorAll('.tc-price');
            priceElements.forEach((element) => {
                const price = parseFloat(element.getAttribute('data-s'));
                if (!isNaN(price)) {
                    let displayPrice = isTradePage
                        ? calculatePriceWithMarkup(price)
                        : calculateOriginalPrice(price);

                    const priceElement = document.createElement('div');
                    priceElement.style.color = 'red';
                    priceElement.style.fontSize = '0.9em';
                    priceElement.style.marginTop = '4px';
                    priceElement.textContent = `${displayPrice} ₽`;

                    element.appendChild(priceElement);
                }
            });

            // Автосортировка по цене
            const button = document.querySelector('.tc-price.sort');
            if (button) button.click();

            // Автонажатие "Продажа" только для /lots/366/
            if (isLotPage) {
                window.addEventListener('load', () => {
                    const saleButton = document.querySelector('button[value="Продажа"]');
                    if (saleButton) saleButton.click();
                });
            }
        }
    }

})();

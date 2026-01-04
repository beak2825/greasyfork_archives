// ==UserScript==
// @name         chaynikam.info enhancer
// @namespace    https://www.chaynikam.info
// @version      v2
// @description  enhances font size and adds the difference amount (in percent) on the comparison page of chaynikam.info (benchmark.best) website
// @author       marshallovski
// @match        https://www.chaynikam.info/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaynikam.info
// @grant        none
// @license MIT
// @name:uk покращувач chaynikam.info
// @description:uk збільшує розмір шрифту результатів порівняння та додає різницю (у відсотках) на сторінці порівняння сайту chaynikam.info (benchmark.best)
// @downloadURL https://update.greasyfork.org/scripts/559124/chaynikaminfo%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/559124/chaynikaminfo%20enhancer.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    console.log('[chaynikam.info fontEnhancer]: ready!');

    async function calculateGPUDifference() {
        const percentItems = document.querySelectorAll('.sp_ratper');

        if (percentItems.length === 2) {
            const num1 = percentItems[0].textContent;
            const num2 = percentItems[1].textContent;

            const difference = Math.abs(num1 - num2);

            return difference;
        } else return;
    }

    async function calculateCPUDifference(firstItem, secondItem) {
        const num1 = firstItem.textContent;
        const num2 = secondItem.textContent;

        const difference = Math.abs(num1 - num2);

        return difference;
    }

    const pagePath = location.pathname.slice(1);

    if (pagePath === 'gpu_comparison.html') {
        const ratingContainer = document.querySelector('#tabrating');
        ratingContainer.style.fontSize = '18px';

        // fixing the size of the rating values
        const ratingBar = document.querySelectorAll('.anagr');

        ratingBar.forEach(i => {
            // setting font enhancements for each points item
            i.parentNode.style.fontSize = '18px';
            i.parentNode.style.lineHeight = '10px';

            // setting font enhancements for each percent item (rough, but it works)
            i.nextElementSibling.nextElementSibling.nextElementSibling.style.fontSize = '18px';
            i.nextElementSibling.nextElementSibling.nextElementSibling.style.lineHeight = '20px';
        });

        const difference = await calculateGPUDifference();

        if (difference) {
            const differencePercentContainer = document.createElement('h4');
            differencePercentContainer.style.textAlign = 'center';
            differencePercentContainer.textContent = `Difference: ${difference.toFixed(1)}%`;

            document.getElementById('ratdivob').append(differencePercentContainer);
        }

    } else if (pagePath === 'cpu_comparison.html') {
        const ratingContainer = document.querySelector('#rating');

        // fixing the size of the rating values
        const ratingBar = document.querySelectorAll('div#rating table tbody tr td div');

        ratingBar.forEach(i => {
            // setting font enhancements for each points item
            i.parentNode.style.fontFamily = 'sans-serif';
            i.parentNode.style.fontSize = '18px';
            i.parentNode.style.lineHeight = '16px';

            // rating percent
            const ratingPercent = i.nextElementSibling.nextElementSibling;
            ratingPercent.style.fontSize = '14px';
            ratingPercent.style.lineHeight = '1em';
            ratingPercent.style.color = '#838485';
        });

        const ratingPercentItems = document.querySelectorAll('div#rating table tbody tr td span');
        if (ratingPercentItems.length === 2) {
            const clean = s => s.replace(/[()%]/g, '');
            const a = { textContent: clean(ratingPercentItems[0].textContent) };
            const b = { textContent: clean(ratingPercentItems[1].textContent) };
            const difference = await calculateCPUDifference(a, b);

            const differencePercentContainer = document.createElement('h4');
            differencePercentContainer.style.textAlign = 'center';
            differencePercentContainer.style.fontSize = '18px';
            differencePercentContainer.style.fontStyle = 'normal';
            differencePercentContainer.textContent = `Difference: ${difference.toFixed(1)}%`;

            ratingContainer.append(differencePercentContainer);
        }
    }
})();
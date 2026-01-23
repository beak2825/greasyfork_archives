// ==UserScript==
// @name         Sales Extract or Enter Price and Convert to Bangladeshi Taka Words (Uppercase)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Extract value, auto-format price with two zeros (.00), and convert to words
// @author       You
// @match        https://salsabeelcars.site/index.php/sales_manager/car_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563616/Sales%20Extract%20or%20Enter%20Price%20and%20Convert%20to%20Bangladeshi%20Taka%20Words%20%28Uppercase%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563616/Sales%20Extract%20or%20Enter%20Price%20and%20Convert%20to%20Bangladeshi%20Taka%20Words%20%28Uppercase%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Converts a numeric value into Bangladeshi Taka word format.
     */
    function convertToWords(num) {
        const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        function convertChunk(n) {
            let word = '';
            if (n < 10) {
                word = ones[n];
            } else if (n < 20) {
                if (n === 10) {
                    word = 'Ten';
                } else {
                    word = teens[n - 11];
                }
            } else if (n < 100) {
                word = tens[Math.floor(n / 10) - 1];
                if (n % 10 !== 0) {
                    word += '-' + ones[n % 10];
                }
            } else if (n < 1000) {
                word = ones[Math.floor(n / 100)] + ' Hundred';
                let remainder = n % 100;
                if (remainder !== 0) {
                    word += ' ' + convertChunk(remainder);
                }
            }
            return word;
        }

        function addUnit(word, unit) {
            if (word !== '') {
                return word + ' ' + unit;
            }
            return '';
        }

        let result = '';
        let croreChunk = Math.floor(num / 10000000);
        num = num % 10000000;

        let lakhChunk = Math.floor(num / 100000);
        num = num % 100000;

        let thousandChunk = Math.floor(num / 1000);
        num = num % 1000;

        let hundredChunk = Math.floor(num / 100);
        num = num % 100;

        let chunks = [];

        if (croreChunk > 0) chunks.push(addUnit(convertChunk(croreChunk), 'Crore'));
        if (lakhChunk > 0) chunks.push(addUnit(convertChunk(lakhChunk), 'Lakh'));
        if (thousandChunk > 0) chunks.push(addUnit(convertChunk(thousandChunk), 'Thousand'));
        if (hundredChunk > 0) chunks.push(addUnit(convertChunk(hundredChunk), 'Hundred'));

        if (num > 0) {
            chunks.push(convertChunk(num));
        } else if (chunks.length === 0) {
            chunks.push('Zero');
        }

        result = chunks.join(' ').trim() + ' Only';
        return result.toUpperCase();
    }

    /**
     * Logic to update price format and trigger word conversion
     */
    function updatePriceAndWords(autoInput = true, forceDecimal = false) {
        const sourceInput = document.querySelector('input[value="16200000"][readonly]');
        const priceInput = document.querySelector('input[name="price"]');
        const inWordInput = document.querySelector('input[name="in_word"]');

        if (priceInput && inWordInput) {
            // 1. Pull from source if requested
            if (autoInput && sourceInput) {
                priceInput.value = sourceInput.value;
            }

            // 2. Clean the value and parse
            let cleanValue = priceInput.value.replace(/,/g, '');
            let numericValue = parseFloat(cleanValue);

            if (!isNaN(numericValue)) {
                // 3. If we need to force the ".00" display in the Price input field
                if (forceDecimal) {
                    priceInput.value = numericValue.toFixed(2);
                }

                // 4. Update the words (using the integer part for Taka Words)
                inWordInput.value = convertToWords(Math.floor(numericValue));
            } else {
                inWordInput.value = '';
            }
        }
    }

    // Initialize listeners
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Initial run with decimal formatting
            updatePriceAndWords(true, true);

            const priceInput = document.querySelector('input[name="price"]');
            if (priceInput) {
                // While typing: update words immediately
                priceInput.addEventListener('input', () => updatePriceAndWords(false, false));
                
                // When leaving the field: add the ".00" if missing
                priceInput.addEventListener('blur', () => updatePriceAndWords(false, true));
            }

            const sourceInput = document.querySelector('input[value="16200000"][readonly]');
            if (sourceInput) {
                sourceInput.addEventListener('change', () => updatePriceAndWords(true, true));
            }
        }, 500);
    });

})();
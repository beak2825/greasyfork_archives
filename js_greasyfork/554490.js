// ==UserScript==
// @name         Amazon Address Autofill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autofill Amazon shipping address form
// @author       You
// @match        https://www.amazon.*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554490/Amazon%20Address%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/554490/Amazon%20Address%20Autofill.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const autofillAmazonAddress = () => {
        // Define your address info here
        const addressInfo = {
            fullName: "$username",
            phoneNumber: "$phone_number",
            streetAddress: "$address",
            city: "$city",
            province: "$province",
            area: "$area",
            addressType: "Home (7am-9pm, all days)" // Possible values: "Home", "Office", etc.
        };

        const fillField = (selector, value) => {
            const el = document.querySelector(selector);
            if (el) {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };


        // Fill fields (adjust selectors if needed)
        fillField('#address-ui-widgets-enterAddressFullName', addressInfo.fullName);
        fillField('#address-ui-widgets-enterAddressPhoneNumber', addressInfo.phoneNumber);
        fillField('#address-ui-widgets-enterAddressLine1', addressInfo.streetAddress);
        fillField('#address-ui-widgets-enterAddressCity', addressInfo.city);
        fillField('#address-ui-widgets-enterAddressDistrictOrCounty', addressInfo.area);
        fillField('#address-ui-widgets-enterAddressStateOrRegion', addressInfo.province); // <-- Province as input

                //clickFirstCitySuggestion(addressInfo.city);
        // selectProvince(addressInfo.province);
             //   clickFirstCitySuggestion(addressInfo.city);

        selectAddressTypeRadio(addressInfo.addressType);
    };


    const selectAddressTypeRadio = (typeText) => {
        const spans = document.querySelectorAll('span.a-label.a-radio-label');
        for (let span of spans) {
            if (span.textContent.trim().toLowerCase().includes(typeText.toLowerCase())) {
                const radioContainer = span.closest('label');
                if (radioContainer) {
                    radioContainer.click();
                    break;
                }
            }
        }
    };

    // Wait until the form is loaded
    // Observe DOM changes to trigger autofill when form is inserted
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                const form = document.querySelector('#address-ui-widgets-enterAddressFullName');
                if (form) {
                    observer.disconnect(); // Stop observing once form is found
                    setTimeout(autofillAmazonAddress, 200); // Small delay to ensure other elements load
                    break;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

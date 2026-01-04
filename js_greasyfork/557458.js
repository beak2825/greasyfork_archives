// ==UserScript==
// @name         Stop and Shop & Giant Coupon Clip
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  (Copied by Chris Wilkie from Chris Alves script for Giant) Easily clip all visible coupons on the Giant grocery store website. https://github.com/Chrisae9/monkeyscripts/blob/main/giant-coupon-clipper/giant-coupon-clipper.js
// @author       Chris Wilkie & Chris Alves
// @match        https://giantfood.com/savings/coupons/browse
// @match        https://stopandshop.com/savings/coupons/browse
// @icon         https://www.google.com/s2/favicons?sz=64&domain=giantfood.com
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557458/Stop%20and%20Shop%20%20Giant%20Coupon%20Clip.user.js
// @updateURL https://update.greasyfork.org/scripts/557458/Stop%20and%20Shop%20%20Giant%20Coupon%20Clip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to clip coupons
    async function clipCoupons() {
        async function wait(seconds) {
            await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
        }

        const buttons = document.querySelectorAll('.select-none');
        for (const button of buttons) {
            button.click();
            await wait(1);
        }
    }

    // Create a new button element
    var button = document.createElement('button');

    // Set the button text
    button.innerHTML = 'Clip Visible Coupons';

    // Set a class to the button for styling
    button.className = 'customButton';

    // Append the button to the body
    document.body.appendChild(button);

    // Add an event listener to the button
    button.addEventListener('click', clipCoupons);

    // Inject styles into the document head
    GM_addStyle(`
        .customButton {
            position: fixed;
            bottom: 10px;
            left: 10px;
            z-index: 1000;
            background-color: purple;
            color: white;
            padding: 20px;
            font-size: 20px;
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            opacity: 0.5;  /* Set default opacity to 0.5 */
            transition: opacity 0.3s ease-in-out;  /* Add transition */
        }

        .customButton:hover {
            opacity: 1;  /* Make button opaque on hover */
        }
    `);

})();

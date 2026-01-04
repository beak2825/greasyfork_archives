// ==UserScript==
// @name         Vault OOS Hider
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically hides OOS products
// @author       Term
// @match        https://theabcvault.com/shop/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theabcvault.com
// @grant        none
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/555543/Vault%20OOS%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/555543/Vault%20OOS%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $ = window.jQuery.noConflict(true);

    async function waitForProducts(selector, callback) {
        const checkExist = setInterval(() => {
            if ($(selector).length > 0 && $(selector).find('li.product').length > 0) {
                clearInterval(checkExist);
                callback();
            }
        }, 500);
    }

    async function hideOOS() {
        await delay(500);

        const $products = $('ul.productGrid li.product');

        $products.each(function() {
            const $this = $(this);
            const $btn = $this.find('.button.form-action-addToCart');

            const disabledAttr = $btn.attr('disabled');
            const isDisabled = $btn.is(':disabled') ||
                  $btn.hasClass('disabled-button') ||
                  (disabledAttr !== undefined && disabledAttr !== "false" && disabledAttr !== "0");

            if (isDisabled) {
                $this.hide();
            }
        });
    }

    function delay(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }

    $(window).on('load', function() {
        waitForProducts('ul.productGrid', hideOOS);
    });
})();

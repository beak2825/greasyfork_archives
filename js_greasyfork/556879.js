// ==UserScript==
// @name         Amenitiz - Negative charges
// @namespace    http://amenitiz.io
// @version      1.0
// @description  Allows negative charges
// @author       Laurent Chervet
// @license      MIT
// @match        https://*.amenitiz.io/fr/admin/calendar
// @match        https://*.amenitiz.io/fr/admin/clients/show*
// @match        https://*.amenitiz.io/admin/invoice/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556879/Amenitiz%20-%20Negative%20charges.user.js
// @updateURL https://update.greasyfork.org/scripts/556879/Amenitiz%20-%20Negative%20charges.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('ℹ️ Init Amenitiz - Negative charges')

    function scripty_negativeCharges_applyPatch(element) {
        element.classList.add('j-skip-verification')
        element.removeAttribute('min')
    }

    const scripty_negativeCharges_observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode instanceof Element) {
                    if (addedNode.classList.contains('row-input-new-charge') || addedNode.classList.contains('td-form-container')) {
                        let scripty_negativeCharges_charge = addedNode.querySelector('#charge_price')
                        if (scripty_negativeCharges_charge) {
                            scripty_negativeCharges_applyPatch(scripty_negativeCharges_charge)
                        }
                    }
                }
            })
        })
    })

    let scripty_negativeCharges_container = document.querySelector('.booking-manager__sidepanel')
    if (scripty_negativeCharges_container) {
        scripty_negativeCharges_observer.observe(scripty_negativeCharges_container, {childList: true, subtree: true})
    }

    scripty_negativeCharges_container = document.querySelector('#extra_price_per_product')
    if (scripty_negativeCharges_container) {
        scripty_negativeCharges_applyPatch(scripty_negativeCharges_container)
    }

    scripty_negativeCharges_container = document.querySelector('#extra_price_per_adult')
    if (scripty_negativeCharges_container) {
        scripty_negativeCharges_applyPatch(scripty_negativeCharges_container)
    }

    scripty_negativeCharges_container = document.querySelector('#extra_price_per_children')
    if (scripty_negativeCharges_container) {
        scripty_negativeCharges_applyPatch(scripty_negativeCharges_container)
    }

    scripty_negativeCharges_container = document.querySelector('#extra_percentage_to_apply')
    if (scripty_negativeCharges_container) {
        scripty_negativeCharges_applyPatch(scripty_negativeCharges_container)
    }
})();
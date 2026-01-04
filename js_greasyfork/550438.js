// ==UserScript==
// @name          Infopanel for new UI
// @author        Tirion
// @namespace     http://userstyles.org
// @description   Updating text to dark for new UI on Horse Reality
// @license       MIT
// @include       *horsereality.com/horses/*
// @grant         GM_addStyle
// @run-at        document-start
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/550438/Infopanel%20for%20new%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/550438/Infopanel%20for%20new%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {
        try {
            var horseShadowRoot = document.getElementsByTagName('horsereality-horse')[0].shadowRoot;
            var summaryPadding = ' padding: 0.2rem 0.5rem;';

            horseShadowRoot.querySelector('#summary-info').style = "background-color: #ffffffc0; color:#081b28;" + summaryPadding;
            horseShadowRoot.querySelector('#sex-age-breed-and-owner').style = "display: inline-flex; flex-direction: column";
            horseShadowRoot.querySelector('#name').style = "filter: none;" + summaryPadding;
            horseShadowRoot.querySelector('#summary-info').children[1].style = "filter: none;" + summaryPadding;
            horseShadowRoot.querySelector('#breeder').style = "filter: none;" + summaryPadding;
            horseShadowRoot.querySelector('#sex').style = "filter: none; border: none; background: none;" + summaryPadding;
            horseShadowRoot.querySelector('#age').style = "filter: none; border: none; background: none;" + summaryPadding;
            horseShadowRoot.querySelector('#breed').style = "filter: none; border: none; background: none;" + summaryPadding;
            horseShadowRoot.querySelector('#owner').style = "filter: none; border: none; background: none; display: unset;" + summaryPadding;

        } catch (e) {};
    }, 300);
})();
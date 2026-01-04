// ==UserScript==
// @name             Remove the subscription banner on articles from LeMonde.fr
// @name:fr          Supprimer la bannière d’abonnement sur les articles de LeMonde.fr
// @description      Mask the paywall elements of LeMonde
// @description:fr   Masquer les éléments paywall de LeMonde
// @namespace        http://tampermonkey.net/
// @version          1.0
// @author           MERCRED
// @license          MIT
// @match            https://www.lemonde.fr/*
// @icon             https://www.google.com/s2/favicons?domain=lemonde.fr
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/550782/Remove%20the%20subscription%20banner%20on%20articles%20from%20LeMondefr.user.js
// @updateURL https://update.greasyfork.org/scripts/550782/Remove%20the%20subscription%20banner%20on%20articles%20from%20LeMondefr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {

        const elements = document.querySelectorAll('.lmd-paywall');
        if (elements.length > 0) {
            elements.forEach(el => {
                el.style.setProperty('display', 'none', 'important');
            });
        }
    }
    init();
})();
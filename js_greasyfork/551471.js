// ==UserScript==
// @name         LNB Calendar – Přepis href na API URL
// @namespace    lukasmalec-scripts
// @version      1.2
// @description  Přepisuje href v kalendáři LNB na API endpoint s fixtureId
// @author       LM
// @license      MIT
// @match        https://lnb.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551471/LNB%20Calendar%20%E2%80%93%20P%C5%99epis%20href%20na%20API%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/551471/LNB%20Calendar%20%E2%80%93%20P%C5%99epis%20href%20na%20API%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rewriteLinks(root = document) {
        root.querySelectorAll('a[href*="mid="]').forEach(a => {
            let href = a.getAttribute('href');
            let match = href.match(/mid=([^&]+)/);
            if (match) {
                let id = match[1];
                let newHref = `https://eapi.web.prod.cloud.atriumsports.com/v1/embed/12/fixture_detail?fixtureId=${id}`;
                if (a.getAttribute('href') !== newHref) {
                    a.setAttribute('href', newHref);
                    a.setAttribute('target', '_blank');
                }
            }
        });
    }

    // přepiš hned po loadu
    rewriteLinks();

    // hlídej i dynamické načítání obsahu
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // element
                    rewriteLinks(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();

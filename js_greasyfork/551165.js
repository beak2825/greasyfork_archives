// ==UserScript==
// @name         Fixture Link Přepis (Austria + LNBP + EASL)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Přepis href na API URL podle fixtureId (Austria, LNBP, EASL)
// @author       LM
// @license      MIT
// @match        https://www.basketballaustria.at/*
// @match        https://www.lnbp.mx/*
// @match        https://www.easl.basketball/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551165/Fixture%20Link%20P%C5%99epis%20%28Austria%20%2B%20LNBP%20%2B%20EASL%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551165/Fixture%20Link%20P%C5%99epis%20%28Austria%20%2B%20LNBP%20%2B%20EASL%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getEmbedId() {
        if (location.hostname.includes("basketballaustria.at")) return 236;
        if (location.hostname.includes("lnbp.mx")) return 14;
        if (location.hostname.includes("easl.basketball")) return 122;
        return null;
    }

    // Pomocná funkce – projde všechny shadow rooty
    function queryAllDeep(selector, root = document) {
        let elements = Array.from(root.querySelectorAll(selector));

        // Najdi všechny shadow rooty
        const traverse = (node) => {
            if (node.shadowRoot) {
                elements = elements.concat(Array.from(node.shadowRoot.querySelectorAll(selector)));
                node.shadowRoot.querySelectorAll('*').forEach(traverse);
            }
        };
        root.querySelectorAll('*').forEach(traverse);

        return elements;
    }

    function rewriteLinks() {
        const embedId = getEmbedId();
        if (!embedId) return;

        const links = queryAllDeep('a[data-sw-fixture-link-fixture-id]');
        links.forEach(link => {
            const fixtureId = link.getAttribute('data-sw-fixture-link-fixture-id');
            if (fixtureId) {
                const newHref = `https://eapi.web.prod.cloud.atriumsports.com/v1/embed/${embedId}/fixture_detail?fixtureId=${fixtureId}`;
                if (link.getAttribute('href') !== newHref) {
                    link.setAttribute('href', newHref);
                    link.setAttribute('target', '_blank');
                    console.log('✅ Přepsán odkaz:', newHref);
                }
            }
        });
    }

    // Pravidelné přepisování, protože EASL načítá zápasy dynamicky
    const interval = setInterval(rewriteLinks, 2000);
    setTimeout(() => clearInterval(interval), 60000); // zastav po 60s

    // Navíc reaguj na změny DOMu
    const observer = new MutationObserver(rewriteLinks);
    observer.observe(document.body, { childList: true, subtree: true });

})();

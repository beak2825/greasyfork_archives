// ==UserScript==
// @name         NationStates Results (mwq.dds.nl) No JS Fixer
// @version      1.0
// @description  Fetch result pages, strip JS checks, and render clean HTML
// @author       yodaluca23
// @license      MIT
// @match        *://www.mwq.dds.nl/ns/results/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/554212/NationStates%20Results%20%28mwqddsnl%29%20No%20JS%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/554212/NationStates%20Results%20%28mwqddsnl%29%20No%20JS%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = location.href;

    fetch(url, { mode: "cors" })
        .then(r => r.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Remove <script> tags
            doc.querySelectorAll("script").forEach(s => s.remove());

            // Remove inline event handlers like onload, onclick, etc.
            doc.querySelectorAll("*").forEach(el => {
                [...el.attributes].forEach(attr => {
                    if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
                });
            });

            // Replace current document with cleaned HTML
            const cleaned = "<!doctype html>\n" + doc.documentElement.outerHTML;
            document.open();
            document.write(cleaned);
            document.close();
        })
        .catch(err => {
            console.error("Userscript failed:", err);
        });
})();

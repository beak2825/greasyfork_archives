// ==UserScript==
// @name         olx-remove-promoted
// @version      1.0
// @description  Removes promoted posts.
// @author       NameUserAnEnter
// @match        *://www.olx.pl/*
// @match        *://www.olx.ro/*
// @match        *://www.olx.ua/*
// @match        *://www.olx.bg/*
// @match        *://www.olx.pt/*
// @match        *://www.olx.com.pk/*
// @grant        none
// @namespace https://greasyfork.org/users/1556283
// @downloadURL https://update.greasyfork.org/scripts/561465/olx-remove-promoted.user.js
// @updateURL https://update.greasyfork.org/scripts/561465/olx-remove-promoted.meta.js
// ==/UserScript==

function removePromotedByClass() {
    const sections = document.getElementsByClassName("css-_70a3faba");
    while (sections.length) {
        sections[0].remove();
    }
}

function removePromotedByText() {
    document.querySelectorAll("section").forEach(section => {
        if (section.textContent.toLowerCase().includes("promoted")) {
            section.remove();
        }
    });
}

function cleanup() {
    removePromotedByClass();
    removePromotedByText();
}

setInterval(cleanup, 300);
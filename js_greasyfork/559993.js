// ==UserScript==
// @name         Neopets - Lottery Tickets Buy Button Relocator
// @namespace    https://neopets.com/
// @author       Kaero
// @version      2025.11.25
// @description  Move "Buy a Ticket" section above "Tickets for the Next Draw" on Neopets Lottery page so the button stops moving further down the page.
// @match        https://www.neopets.com/games/lottery.phtml
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559993/Neopets%20-%20Lottery%20Tickets%20Buy%20Button%20Relocator.user.js
// @updateURL https://update.greasyfork.org/scripts/559993/Neopets%20-%20Lottery%20Tickets%20Buy%20Button%20Relocator.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Use the FORM (unique and reliable) as the anchor
    const form = document.querySelector("form[action='process_lottery.phtml']");
    if (!form) return;

    const td = form.closest("td");
    if (!td) return;

    const nodes = [...td.childNodes];

    // Locate the Buy-a-Ticket header (scan backward from the form)
    let startIndex = nodes.indexOf(form);
    while (startIndex > 0) {
        const n = nodes[startIndex];
        if (n.querySelector && n.querySelector("b") &&
            n.querySelector("b").textContent.trim().startsWith("Buy a Ticket")) {
            break;
        }
        startIndex--;
    }

    // Locate Past Winners header (scan forward)
    let endIndex = nodes.indexOf(form);
    while (endIndex < nodes.length) {
        const n = nodes[endIndex];
        if (n.querySelector && n.querySelector("b") &&
            n.querySelector("b").textContent.trim().startsWith("Past Winners")) {
            break;
        }
        endIndex++;
    }

    if (startIndex < 0 || endIndex < 0) return;

    // Extract Buy-a-Ticket section
    const fragment = document.createDocumentFragment();
    for (let i = startIndex; i < endIndex; i++) {
        fragment.appendChild(nodes[i]);
    }

    // Find Tickets-for-the-Next-Draw header
    const nextDrawHeader = [...document.querySelectorAll("b")]
        .find(b => b.textContent.trim().startsWith("Tickets for the Next Draw"));

    if (!nextDrawHeader) return;

    // Insert before it
    nextDrawHeader.parentNode.insertBefore(fragment, nextDrawHeader);
})();
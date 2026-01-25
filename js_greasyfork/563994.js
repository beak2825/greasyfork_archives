// ==UserScript==
// @name         Custom 1001albumsgenerator
// @namespace    https://1001albumsgenerator.com
// @version      2026-01-25
// @description  Dont show rating/distribution on page load. Hover to show.
// @author       Doni
// @match        https://1001albumsgenerator.com/albums/*/*
// @icon         https://1001albumsgenerator.com/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563994/Custom%201001albumsgenerator.user.js
// @updateURL https://update.greasyfork.org/scripts/563994/Custom%201001albumsgenerator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Toogle rating on hover
    const ratingEl = document.querySelector(".stat-item .stat-value:nth-child(1)");
    ratingEl.style.width = "120px"
    const rating = ratingEl.textContent;

    ratingEl.textContent = "Hidden";

    ratingEl.addEventListener("mouseenter", function(a) {
        ratingEl.textContent = rating;
    });

    ratingEl.addEventListener("mouseleave", function(a) {
        ratingEl.textContent = "Hidden";
    });

    // Toogle distribution on hover
    const distributionEl = document.querySelector(".rating-dist");
    const distributionHtml = distributionEl.innerHTML;
    const hiddenSpanHtml = "<span style='font-size: 32px; font-weight: 700; font-famliy: var(--font-stack)'>Hidden</span>";

    distributionEl.innerHTML = hiddenSpanHtml;

    distributionEl.addEventListener("mouseenter", function(a) {
        distributionEl.innerHTML = distributionHtml;
    });

    distributionEl.addEventListener("mouseleave", function(a) {
        distributionEl.innerHTML = hiddenSpanHtml;
    });
})();
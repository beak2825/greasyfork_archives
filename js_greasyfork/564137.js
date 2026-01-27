// ==UserScript==
// @name         Steam Header Reviews Button
// @namespace    https://github.com/palharesf/
// @version      1.0
// @description  Adds a Reviews button to the Steam global header
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @run-at       document-end
// @grant        none
// @author       palharesf
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564137/Steam%20Header%20Reviews%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/564137/Steam%20Header%20Reviews%20Button.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addReviewsButton() {
    const nav = document.querySelector("#global_header .supernav_container");
    if (!nav) return;

    // Avoid duplicate insertion
    if (nav.querySelector(".menuitem.steam-reviews-button")) return;

    const reviewsLink = document.createElement("a");
    reviewsLink.className = "menuitem steam-reviews-button";
    reviewsLink.textContent = "REVIEWS";
    reviewsLink.href = "https://steamcommunity.com/my/reviews/";
    reviewsLink.style.cursor = "pointer";

    // Insert before SUPPORT (optional, adjust if desired)
    const supportLink = Array.from(nav.children).find(
      (el) => el.textContent.trim() === "SUPPORT",
    );

    if (supportLink) {
      nav.insertBefore(reviewsLink, supportLink);
    } else {
      nav.appendChild(reviewsLink);
    }
  }

  // Steam sometimes loads header late
  const observer = new MutationObserver(() => {
    if (document.querySelector("#global_header .supernav_container")) {
      addReviewsButton();
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();

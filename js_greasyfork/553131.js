// ==UserScript==
// @name         IMDB - Open Reviews in New Tab
// @version      0.0.1
// @description  Restores the functionality of opening reviews in a new tab on IMDB movie pages.
// @author       You
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/553131/IMDB%20-%20Open%20Reviews%20in%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/553131/IMDB%20-%20Open%20Reviews%20in%20New%20Tab.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const id = window.location.pathname.split("/").at(-2);
  if (!id.startsWith("tt")) return;

  console.log("Running IMDB - Open Reviews in New Tab script");

  const reviewsAnchor = document.querySelector(
    "section[data-testid='UserReviews'] a.ipc-title-link-wrapper"
  );
  if (reviewsAnchor) {
    reviewsAnchor.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.open(window.location.origin + `/title/${id}/reviews`, "_blank");
      },
      { capture: true }
    );
  } else {
    console.error("Reviews anchor not found");
  }

  const nextData = document.getElementById("__NEXT_DATA__");
  if (!nextData) {
    console.error("__NEXT_DATA__ not found");
    return;
  }

  const nextDataJson = JSON.parse(nextData.innerText);
  const reviews =
    nextDataJson?.props?.pageProps?.mainColumnData?.featuredReviews?.edges;
  if (!reviews || reviews.length === 0) {
    console.error("No featured reviews found in __NEXT_DATA__");
    return;
  }

  document
    .querySelectorAll(
      "div[data-testid='user-reviews-summary-featured-review-card']"
    )
    .forEach((card, i) => {
      card.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          window.open(
            window.location.origin +
              `/title/${id}/reviews/?featured=${reviews[i].node.id}`
          );
        },
        { capture: true }
      );
    });
})();
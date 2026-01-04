// ==UserScript==
// @name             [PS] Add Rating
// @namespace        https://github.com/ikelax/userscripts
// @match            https://play.pokemonshowdown.com/*
// @grant            none
// @version          0.1.0
// @author           Alexander Ikonomou
// @description      Adds in battles, the rating of the player below its sprite.
// @license          MIT
// @supportURL       https://github.com/ikelax/userscripts/issues
// @copyright        2025, Alexander Ikonomou (https://github.com/ikelax)
// @homepageURL      https://github.com/ikelax/userscripts
// @homepage         https://github.com/ikelax/userscripts
// @contributionURL  https://github.com/ikelax/userscripts
// @collaborator     ikelax
// @icon             https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @downloadURL https://update.greasyfork.org/scripts/556668/%5BPS%5D%20Add%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/556668/%5BPS%5D%20Add%20Rating.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function addRating(trainer) {
    let trainersprite = trainer.querySelector(`div.trainersprite`);
    let rating = document.createElement("strong");
    rating.innerText = trainersprite.title || "Rating: None";
    rating.id = "rating";
    trainersprite.parentNode.insertBefore(rating, trainersprite.nextSibling);
  }

  function watchForElement(selector, onAppear) {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);

      if (!document.querySelector(`${selector} > strong#rating`)) {
        onAppear(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  watchForElement("div.trainer-far", (trainer) => addRating(trainer));

  watchForElement("div.trainer-near", (trainer) => addRating(trainer));
})();

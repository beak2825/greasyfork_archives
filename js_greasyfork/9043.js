// ==UserScript==
// @name        IMDB Score Hider
// @author      Assil Ksiksi
// @namespace   http://assil.me
// @version     0.4
// @match       https://www.imdb.com/*
// @match       https://www.imdb.com/
// @description Hides all TV and movie scores from IMDB.
// @copyright   2012+, Assil Ksiksi
// @downloadURL https://update.greasyfork.org/scripts/9043/IMDB%20Score%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/9043/IMDB%20Score%20Hider.meta.js
// ==/UserScript==

const titleRatingSelector = 'div[data-testid=hero-rating-bar__aggregate-rating]';
const ipcRatingSelector = 'span.ipc-rating-star';
const listRatingSelector = '.imdbRating';

function hideElement(e, toggle) {
  if (e === null) {
    return
  }
  if (toggle && e.style.display == 'none') {
    e.style.display = 'block'
  } else {
    e.style.display = 'none'
  }
}

function hideIpcRatings(toggle) {
  document.querySelectorAll(ipcRatingSelector).forEach(function(e) {
    hideElement(e, toggle);
  });
}

// Hide ratings for elements that are loaded into the DOM dynamically.
// https://stackoverflow.com/a/45271114
var observer = new MutationObserver(function(mutations) {
  hideIpcRatings(false);
});
observer.observe(document, {attributes: false, childList: true, characterData: false, subtree: true});

function hideRatings(toggle) {
  // Hide main IMDB rating for current title.
  hideElement(document.querySelector(titleRatingSelector), toggle);

  // Hide ratings in featured cards on homepage & movie pages.
  hideIpcRatings(toggle);

  // Hide ratings on list/table pages.
  document.querySelectorAll(listRatingSelector).forEach(function(e) {
    hideElement(e, toggle);
  });
}

// If the movie title is clicked, toggle ratings manually.
const movieTitleElem = document.querySelector('h1[data-testid=hero-title-block__title]');
if (movieTitleElem !== null) {
  movieTitleElem.addEventListener('click', function(e) {
    hideRatings(true);
  });
}

// Hide ratings immediately.
hideRatings(false);

// Hide ratings again on page load.
window.addEventListener('load', function() {
  console.log('Hiding ratings on load...');
  hideRatings(false);
});

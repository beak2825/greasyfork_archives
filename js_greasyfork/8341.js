// ==UserScript==
// @name            Google Calendar Openstreetmap Links
// @include         https://www.google.com/calendar/render?&pli=1#h
// @version         1.1
// @description:en  Automatically replaces the "Map" link in the google calendar overview with openstreetmap links.
// @grant           none
// @namespace https://greasyfork.org/users/9466
// @description Automatically replaces the "Map" link in the google calendar overview with openstreetmap links.
// @downloadURL https://update.greasyfork.org/scripts/8341/Google%20Calendar%20Openstreetmap%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/8341/Google%20Calendar%20Openstreetmap%20Links.meta.js
// ==/UserScript==
window.addEventListener('load', function () {
  var target = document.querySelector('.bubble');
  console.log(target);
  var pattern = re = new RegExp('.*&q=(.+)&.*')
  var replacement = 'https://openstreetmap.org/search?query=$1'
  // create an observer instance
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      googleMapsLink = target.querySelector('a[href^=\'https://maps.google\']');
      if (googleMapsLink) {
        googleMapsLink.attributes.href.textContent = googleMapsLink.attributes.href.textContent.replace(pattern, replacement);
      }
    });
  });
  // configuration of the observer:
  var config = {
    attributes: true,
    childList: false,
    characterData: false
  };
  // pass in the target node, as well as the observer options
  observer.observe(target, config);
}, false);

// ==UserScript==
// @name            Hide Google Drive Labels
// @namespace       hide-google-drive-labels
// @author          Gene Wood
// @description     Hide Google Drive labels
// @version         2025-12-01.1
// @match           *://drive.google.com/drive/*
// @run-at          document-start
// @license         MPL-2.0
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/557588/Hide%20Google%20Drive%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/557588/Hide%20Google%20Drive%20Labels.meta.js
// ==/UserScript==
(function() {
  'use strict';
  window.addEventListener('load', function() {

    var hideLabelsButton = document.createElement('div');
    hideLabelsButton.innerHTML = `<div data-tooltip="Hide Labels"><div area-label="Hide Labels"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 20.550781 3.675781 C 20.550781 3.449219 20.476562 3.300781 20.324219 3.148438 C 20.175781 3 20.023438 2.925781 19.800781 2.925781 C 19.574219 2.925781 19.425781 3 19.273438 3.148438 L 17.25 5.175781 C 15.75 4.425781 14.023438 3.976562 12 3.75 C 8.25 4.125 5.25 5.476562 3.148438 7.875 C 1.050781 10.273438 0 11.625 0 12 C 0 12.375 1.125 13.726562 3.148438 16.125 C 3.675781 16.726562 4.199219 17.25 4.875 17.699219 L 2.851562 19.800781 C 2.699219 19.949219 2.625 20.101562 2.625 20.324219 C 2.625 20.550781 2.699219 20.699219 2.851562 20.851562 C 3 21 3.148438 21.074219 3.375 21.074219 C 3.601562 21.074219 3.75 21 3.898438 20.851562 L 20.398438 4.199219 C 20.476562 4.050781 20.550781 3.898438 20.550781 3.675781 Z M 5.398438 16.050781 C 3.601562 14.398438 2.398438 13.050781 1.800781 12 C 2.476562 10.875 3.675781 9.523438 5.398438 7.949219 C 7.125 6.375 9.375 5.398438 12 5.25 C 13.5 5.324219 14.925781 5.699219 16.125 6.300781 L 14.851562 7.574219 C 14.023438 7.050781 13.125 6.75 12 6.75 C 10.5 6.75 9.300781 7.273438 8.25 8.25 C 7.199219 9.226562 6.75 10.5 6.75 12 C 6.75 13.125 7.050781 14.101562 7.574219 14.925781 L 6 16.574219 C 5.773438 16.425781 5.550781 16.199219 5.398438 16.050781 Z M 8.699219 13.800781 C 8.398438 13.273438 8.25 12.675781 8.25 12 C 8.25 10.949219 8.625 10.050781 9.375 9.375 C 10.125 8.699219 10.949219 8.25 12 8.25 C 12.675781 8.25 13.273438 8.398438 13.726562 8.699219 Z M 20.851562 7.875 C 20.550781 7.5 20.175781 7.199219 19.875 6.898438 L 18.75 8.023438 C 20.476562 9.601562 21.675781 10.949219 22.273438 12 C 21.601562 13.125 20.398438 14.476562 18.675781 16.050781 C 16.949219 17.625 14.625 18.601562 12 18.75 C 10.800781 18.675781 9.675781 18.449219 8.699219 18.074219 L 7.574219 19.199219 C 8.925781 19.726562 10.351562 20.101562 12 20.25 C 15.75 19.875 18.75 18.523438 20.851562 16.125 C 22.949219 13.726562 24 12.375 24 12 C 24 11.625 22.875 10.273438 20.851562 7.875 Z M 20.851562 7.875 "/><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 12 15.75 C 11.699219 15.75 11.398438 15.675781 11.101562 15.601562 L 9.898438 16.800781 C 10.574219 17.101562 11.25 17.25 12 17.25 C 13.5 17.25 14.699219 16.726562 15.75 15.75 C 16.726562 14.773438 17.25 13.5 17.25 12 C 17.25 11.25 17.101562 10.5 16.800781 9.898438 L 15.601562 11.101562 C 15.675781 11.398438 15.75 11.699219 15.75 12 C 15.75 13.050781 15.375 13.949219 14.625 14.625 C 13.875 15.300781 13.050781 15.75 12 15.75 Z M 12 15.75 "/></g></svg></div></div>`;

    hideLabelsButton.setAttribute('id', 'hideGoogleDriveLabelsButton');
    hideLabelsButton.setAttribute('class', 'gb_te gb_se');
    const supportButton = document.querySelector('div[data-tooltip="Support"]').parentNode;
    supportButton.parentNode.insertBefore(hideLabelsButton, supportButton);

    document.getElementById("hideGoogleDriveLabelsButton").addEventListener (
        "click", HideGoogleDriveLabels, false
    );

    function HideGoogleDriveLabels(eventObject) {
      const listItems = document.querySelectorAll('div[aria-label^="Label applied"]');
      listItems.forEach(item => {
        item.style.setProperty("display", "none");
      });
    }

    const listItems = document.querySelectorAll('div[aria-label^="Label applied"]');
    listItems.forEach(item => {
      // item.remove();
      item.style.setProperty("display", "none");
    });
    setTimeout(() => {
      const listItems = document.querySelectorAll('div[aria-label^="Label applied"]');
      listItems.forEach(item => {
        // item.remove();
        item.style.setProperty("display", "none");
      });
    }, 2000);
  }, false);
})();
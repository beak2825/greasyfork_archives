// ==UserScript==
// @name         scoreboard destroy
// @namespace    http://tampermonkey.net3
// @version      2025-10-12
// @description  Make the red team think that you have all your services down
// @author       You
// @match        https://scoreboard.plinko.horse/overview
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plinko.horse
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553236/scoreboard%20destroy.user.js
// @updateURL https://update.greasyfork.org/scripts/553236/scoreboard%20destroy.meta.js
// ==/UserScript==


function fake_down() {


    // Image replacement happens 85% of the time
    if (Math.random() < 0.85) {
        const allImages = document.querySelectorAll('img');

        // Loop through the images and replace a section of the URL
        allImages.forEach(image => {
          // Get the current src and replace the old path with the new one
            if (Math.random() < 0.80) {
          const oldSrc = image.src;
          const newSrc = oldSrc.replace('/assets/services/up.png', '/assets/services/down.png');
          image.src = newSrc;
            }
        });
    }

    // Class replacement and percentage setting happens 100% of the time
    replaceClassGlobally('bg-warning', 'bg-danger');
    replaceClassGlobally('bg-success', 'bg-danger');

    const messageElements = document.getElementsByClassName("bg-danger");

    for (let i = 0; i < messageElements.length; i++) {
        // Set random percentage between 1-15% for each element
        const randomPercentage = Math.floor(Math.random() * 15) + 1;
        messageElements[i].innerText = randomPercentage + "%";
    }
}

fake_down();

function replaceClassGlobally(oldClass, newClass) {
  // Get all elements that have the 'oldClass'
  const elementsToUpdate = document.querySelectorAll(`.${oldClass}`);

  // Iterate through the NodeList and replace the class on each element
  elementsToUpdate.forEach(element => {
    element.classList.replace(oldClass, newClass);
  });
}
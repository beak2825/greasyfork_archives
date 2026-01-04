// ==UserScript==
// @name         Random Target Finder
// @version      1.1
// @namespace    http://tampermonkey.net/
// @description  Adds a button to the top of the page that opens a new tab with an easy target.
// @author       Omanpx [1906686] & Hwa modified
// @license      MIT
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/552097/Random%20Target%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/552097/Random%20Target%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define requirements
    // These are user ID ranges that will be targeted
    const minID = 3_500_000;
    const maxID = 3_970_000;
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // Create a button element
    const button = document.createElement('button');
    button.innerHTML = 'Chain';
    button.style.position = 'fixed';
    //button.style.top = '10px';
    //button.style.right = '10px';
    button.style.top = '27%'; // Adjusted to center vertically
    button.style.right = '0%'; // Center horizontally
    //button.style.transform = 'translate(-50%, -50%)'; // Center the button properly
    button.style.zIndex = '9999';

    // Add CSS styles for a green background
    button.style.backgroundColor = 'green';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '6px';
    button.style.borderRadius = '6px';
    button.style.cursor = 'pointer';

    // Add a click event listener to open Google in a new tab
    button.addEventListener('click', function() {
        let randID = getRandomNumber(minID,maxID);
        // Uncomment one of the lines below, depending on what you prefer
        //let profileLink = `https://www.torn.com/profiles.php?XID=${randID}`; // Profile link
        let profileLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${randID}`; // Attack link

        // Comment this line and uncomment the one below it if you want the profile to open in a new tab
        window.location.href = profileLink;
        //window.open(profileLink, '_blank');
    });
    // Add the button to the page
    document.body.appendChild(button);
})();
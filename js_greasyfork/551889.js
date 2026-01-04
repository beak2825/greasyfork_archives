// ==UserScript==
// @name         FunnyJunk Thumbs Up Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to click all thumbs-up buttons.
// @author       You
// @match        https://*.funnyjunk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551889/FunnyJunk%20Thumbs%20Up%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/551889/FunnyJunk%20Thumbs%20Up%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your existing recursive function
    function clickNextThumb() {
        const thumbs = document.querySelectorAll('.thUp');
        const visibleThumbs = Array.from(thumbs).filter(el => el.offsetParent !== null);

        if (visibleThumbs.length > 0) {
            visibleThumbs[0].click();
            setTimeout(clickNextThumb, 90);
        } else {
            console.log("No more thumbs-up buttons to click.");
        }
    }

    // Create the button
    const thumbButton = document.createElement('button');
    thumbButton.innerText = 'Thumbs Up All!';
    thumbButton.style.position = 'fixed';
    thumbButton.style.top = '10px';
    thumbButton.style.right = '10px';
    thumbButton.style.zIndex = '9999';
    thumbButton.style.backgroundColor = '#4CAF50';
    thumbButton.style.color = 'white';
    thumbButton.style.padding = '10px';
    thumbButton.style.border = 'none';
    thumbButton.style.cursor = 'pointer';

    // Add an event listener to the button
    thumbButton.addEventListener('click', clickNextThumb);

    // Append the button to the body of the page
    document.body.appendChild(thumbButton);
})();
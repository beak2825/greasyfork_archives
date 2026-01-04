// ==UserScript==
// @name         Duck Surprise
// @namespace  https://greasyfork.org/users/yourname
// @version      1.9.1
// @description  Plays a duck sound and shows a walking duck if URL query is ?q=duck
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556839/Duck%20Surprise.user.js
// @updateURL https://update.greasyfork.org/scripts/556839/Duck%20Surprise.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the 'q' query parameter from URL
    var url = new URL(window.location.href);
    var query = url.searchParams.get('q');

    if (query && query.toLowerCase() === 'duck') {
        // Create and play the audio
        var audioUrl = 'https://drive.google.com/uc?export=download&id=1u9n_SO6itk8gxWnl14w_3H-73A1pvq8x';
        var audioEl = document.createElement('audio');
        audioEl.src = audioUrl;
        audioEl.loop = true;
        audioEl.volume = 0.5;
        audioEl.style.display = 'none';
        document.body.appendChild(audioEl);
        audioEl.play().catch(function(error) {
            console.error("Autoplay Blocked:", error);
        });

        // Add the duck image after 5 seconds
        setTimeout(function() {
            // Add keyframes style
            var style = document.createElement('style');
            style.innerHTML = '@keyframes duckWalk {0% {left:-100px;} 100% {left:100%;}}';
            document.head.appendChild(style);

            // Add the duck image
            var duck = document.createElement('img');
            duck.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Cartoon_steamer_duck_walking_animation.gif';
            duck.id = 'walkingDuck';
            duck.style.cssText = 'position:fixed;bottom:0;width:100px;z-index:999999;pointer-events:none;animation:duckWalk 15s linear infinite;';
            document.body.appendChild(duck);
        }, 5000);
    }
})();

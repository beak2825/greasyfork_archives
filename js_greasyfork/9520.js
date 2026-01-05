// ==UserScript==
// @name            Load GIFs before playing
// @namespace       https://greasyfork.org/en/users/321-joesimmons
// @description     Hides a GIF until it's fully loaded
// @include         http://*
// @include         https://*
// @exclude         http://*.gif
// @exclude         https://*.gif
// @exclude         http://*.gif?*
// @exclude         https://*.gif?*
// @copyright       JoeSimmons
// @author          JoeSimmons
// @version         1.0.0
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9520/Load%20GIFs%20before%20playing.user.js
// @updateURL https://update.greasyfork.org/scripts/9520/Load%20GIFs%20before%20playing.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var gifs = document.querySelectorAll('img[src$=".gif"]'), gif, i;

    function unhide(elem) {
        elem.target.style.visibility = 'visible';
    }

    for (i = 0; i < gifs.length; i += 1) {
        gif = gifs[i];

        // skip ones that are hidden already
        if (gif.style.visiblity === 'hidden' || gif.style.display === 'none') {
            continue;
        }

        // temporarily hide the GIF
        gif.style.visibility = 'hidden';

        // set it to un-hide when it's fully loaded
        gif.addEventListener('load', unhide, false);
    }
}());
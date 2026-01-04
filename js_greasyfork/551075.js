// ==UserScript==
// @name        Show all contributions decorrespondent.nl pages
// @namespace   https://greasyfork.org/users/1047370
// @description Clicks buttons like 'Lees meer' on decorrespondent.nl, to see all comments in all threads.
// @include     https://decorrespondent.nl/*
// @match       https://decorrespondent.nl/*
// @version     0.2
// @author      Marnix Klooster <marnix.klooster@gmail.com>
// @copyright   public domain
// @license     public domain
// @homepage    https://greasyfork.org/scripts/551075
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/551075/Show%20all%20contributions%20decorrespondentnl%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/551075/Show%20all%20contributions%20decorrespondentnl%20pages.meta.js
// ==/UserScript==

(function() {
    var theInterval = null;
    var lastClickedButton = null;

    function start() {
        if (theInterval) {
            console.log(`SOMETHING WENT WRONG.  Ignoring this call to start().`);
            return;
        }

        theInterval = setInterval(function() {
            // click any 'Leer meer' etc. button in sight...
            for (const button of document.querySelectorAll(
                [
                    '.Comment__expandButton',
                    '.CommentsListExpand',
                    '.Contributions__commentExpand',
                ].join(','))) {
                console.log(`Clicking the button marked "${button.innerText}"...`);
                button.click();
            }
        }, 1000);
    }

    start();
})();
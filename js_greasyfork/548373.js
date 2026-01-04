// ==UserScript==
// @name         NowWatching2Top
// @namespace    https://github.com/CommandLime
// @version      2025-09-04
// @description  to hell with your carousels, netflix
// @author       The Crungler
// @match        https://www.netflix.com/browse
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/548373/NowWatching2Top.user.js
// @updateURL https://update.greasyfork.org/scripts/548373/NowWatching2Top.meta.js
// ==/UserScript==

;(function () {
    "use strict"
    window.addEventListener(
        "load",
        function () {
            console.log("NOW RUNNING: NowWatching2Top")
            var testvar;
            function netClicks() {

                try {
                    //check if the stuff (in this case, your "List") you want has been loaded yet
                    testvar = document.querySelectorAll("[data-list-context='queue']")[0];
                    testvar.innerText.length;
                    //move "List" to the top row
                    document
                        .getElementsByClassName("lolomoRow")[0]
                        .before(document.querySelectorAll("[data-list-context='queue']")[0])
                    //now move "Continue Watching" to the top row
                    document
                        .getElementsByClassName("lolomoRow")[0]
                        .before(
                        document.querySelectorAll(
                            "[data-list-context='continueWatching']"
                        )[0]
                    )
                } catch(err) {
                    //if List doesn't work then we come down here. wait a second and try again. i keep forgetting how promises work so i lifted this from MDN (better than vibecoding right?): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#chaining
                    console.log("NW2T:OOPS! not ready yet.")
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            // Other things to do before completion of the promise
                            console.log("NW2T: did this work")
                            // The fulfillment value of the promise
                            netClicks();
                        }, 1000)
                    })
                }
            }
            //let's run!
            netClicks();
            //just in case, create a new button to add to the top so you can click manually if it doens't show up.
            var newLi = document.createElement("li")
            newLi.innerText = "[click to bring up your stuff]"
            newLi.className = "navigation-tab"
            newLi.id = "netClix"

            newLi.addEventListener(
                "click",
                function (event) {
                    netClicks()
                },
                false
            )
            document
                .getElementsByClassName("tabbed-primary-navigation")[0]
                .append(newLi)

            console.log("NW2T: script run! hopefully!")
        },
        false
    )
})()

// ==UserScript==
// @name         Coconut Shy Keyboard Controls
// @namespace    zooops
// @version      1.0
// @description  Adds simple keybinds for Coconut Shy
// @author       mox & Z
// @match        https://www.grundos.cafe/halloween/coconutshy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556218/Coconut%20Shy%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/556218/Coconut%20Shy%20Keyboard%20Controls.meta.js
// ==/UserScript==

// code by mox for a larger project that's on hold, but with the release of the coconut shy avatar, I've decided to publish it standalone for now!
// (if you read the code you'll notice that it's meant to work for TYS too, but it's not working for that one and ngl I don't know how to debug it)

window.addEventListener("keydown", (event) => {
    if(event.target.matches("input[type='text']")) {return;} //if entering text in a text box, don't record keydown event
    let arrowKeyCount = 0;
    let digitKeyCount = 0; //initialize some useful variables
    var canvas = document.querySelector("canvas"); //see if there's a canvas-type element on the page (e.g. strtest, coconutshy)
    switch (event.code) {
        case "Space":
            event.preventDefault(); //falls through so Space can be used like Enter
        case "Enter": //falls through so either Enter key can be used interchangeably
        case "NumpadEnter":
            if (location.pathname.match(/coconutshy|strtest/)) {
                if (canvas) {
                    var clientRect = canvas.getBoundingClientRect();
                    var pX = clientRect.left;
                    var pY = clientRect.top;
                    var clickEvent;
                    if (location.pathname.match(/coconutshy/)) {
                        pX += 250; pY += 330;
                    } else if (location.pathname.match(/strtest/)) {
                        pX += 150; pY += 160;
                        clickEvent = new MouseEvent("mousemove",{
                            clientX: pX, clientY: pY, bubbles: true });
                        canvas.dispatchEvent(clickEvent);
                    }
                    clickEvent = new MouseEvent("mousedown",{
                        clientX: pX, clientY: pY, bubbles: true, buttons: 1 });
                    canvas.dispatchEvent(clickEvent);
                }
                if (document.querySelector('#modal-body[style="padding: 10px;"]')) {location.reload();}
            } break;
    }
 });
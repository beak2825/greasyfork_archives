// ==UserScript==
// @name         Infinite Worlds tweaks
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Keeps the story illustrations onscreen ("s" to swap images, "e" to edit images) and adds arrow key navigation to community worlds
// @author       HiEv
// @license      MIT
// @match        https://infiniteworlds.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=infiniteworlds.app
// @grant        none
// @require      http://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/557581/Infinite%20Worlds%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/557581/Infinite%20Worlds%20tweaks.meta.js
// ==/UserScript==

/*
	global $
*/

(function() {
	'use strict';

    setTimeout(() => {
        $(document).on("keyup", function (event) { // Keyboard handler
            if (($("input:focus").length === 0) && ($("textarea:focus").length === 0) && ($("div[contenteditable='true']:focus").length == 0)) {
                if (event.key === "ArrowRight") { // Community Worlds navigate next
                    let links = $("i.left.fa-angle-right");
                    for (let i = links.length - 1; i >= 0; i--) {
                        // console.log(i + " = " + (!$(links[i]).parent().is(".anvil-role-disabled-link") && !$(links[i]).parent().is("button")) + " (" + $(links[i]).parent().is(".anvil-role-disabled-link") + "/" + $(links[i]).parent().is("button") + ")");
                        if (!$(links[i]).parent().is(".anvil-role-disabled-link") && !$(links[i]).parent().is("button")) {
                            // console.log($(links[i]).parent());
                            $(links[i]).parent().click();
                            break;
                        }
                    }
                }
                if (event.key === "ArrowLeft") { // Community Worlds navigate previous
                    let links = $("i.left.fa-angle-left");
                    for (let i = links.length - 1; i >= 0; i--) {
                        // console.log(i + " = " + (!$(links[i]).parent().is(".anvil-role-disabled-link") && !$(links[i]).parent().is("button")) + " (" + $(links[i]).parent().is(".anvil-role-disabled-link") + "/" + $(links[i]).parent().is("button") + ")");
                        if (!$(links[i]).parent().is(".anvil-role-disabled-link") && !$(links[i]).parent().is("button")) {
                            // console.log($(links[i]).parent());
                            $(links[i]).parent().click();
                            break;
                        }
                    }
                }
                if (event.key === "e") { // Open the edit dialog
                    if ($("div.modal.alert-modal").length == 0) {
                        let links = $('[title="View/modify image instructions"] button');
                        if (links.length >= 1) {
                            links[0].click();
                        }
                    } else { // Close the edit dialog
                        $("button.close").click();
                    }
                }
                if (event.key === "s") { // Swap image
                    let links = $('button').children("i.fa-rotate");
                    if (links.length >= 1) {
                        $(links[0]).parent().click();
                    }
                }
            }
            // else { console.log("Focus is on input."); }
        });
    }, 500);

    $('html > head').append($('<style>img { transition: margin-top 0.5s ease-out; }</style>'));
    setInterval(() => { // Reposition the illustration image
        for (let i = 0; i < $(".anvil-spacing-above-small > img").length; i++) {
            let img = $(".anvil-spacing-above-small > img")[i];
            if ($(img).height() > 400) {
                if (Math.abs(Math.max(0, $("html").scrollTop() - 234) - parseFloat($(img).css("margin-top"))) >= 4) {
                    $(img).css("margin-top", Math.max(0, $("html").scrollTop() - 234));
                }
                break;
            }
        }
    }, 300);
})();
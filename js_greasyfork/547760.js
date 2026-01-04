// ==UserScript==
// @name         Flight Rising: Morphology Widget
// @namespace    https://github.com/dragonjpg
// @version      1.0.1
// @description  adds a share button that generates a widget of the morphology's image with descriptive alt text that links to the morphology parameters in the workshop. utilizes FR's existing "frCopyToClipboard" function
// @author       dragon.jpg
// @license      MIT
// @match        https://www1.flightrising.com/scrying/predict*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flightrising.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547760/Flight%20Rising%3A%20Morphology%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/547760/Flight%20Rising%3A%20Morphology%20Widget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector("#morphology-image-link")) {

        // make our button
        const quickButton = document.createElement("div");
        quickButton.id = "quick-bbc-link";
        quickButton.setAttribute("role","button");
        quickButton.setAttribute("tabindex","0");
        quickButton.style = "cursor: pointer;display: block;float: right;position: relative;margin-right: 3px;";
        // we're just gonna use the morphology image button but make it look different by adding the link symbol over the picture icon with a pseudoelement
        // im lazy and adding the css inline
        quickButton.innerHTML = `<style>
        #quick-bbc-link::before {
        content: ''; height: 21px; width: 21px; position: absolute; z-index: 2;
        background: url('https://www1.flightrising.com/static/layout/scryer/link.png');
        background-size: cover; bottom: -5px; right: -5px; pointer-events: none;
        } #quick-bbc-link::after { content: ''; width: 180px; height: auto; line-height: 130%;
        color: var(--text, #000); background: var(--tooltip-bg, #fff); border-radius: 10px;
        font-size: inherit; position: absolute; border:1px solid var(--borders, #888);box-shadow:rgba(0, 0, 0, 0.5) 1px 1px 6px;
        top: 100%; left: calc(50% - 100px); padding: 8px; box-sizing: border-box; z-index: 2; }
        #quick-bbc-link::after { display: none; content: 'Copy a BBCode Image Widget that links to these exact morphology parameters.'; }
        #quick-bbc-link:hover::after, #quick-bbc-link:focus::after { display: block; }
        #quick-bbc-link.copied-msg::after { content: 'Copied to clipboard!'; } </style>
        <img src="/static/layout/scryer/image.png" alt="Copy a BBCode Image Widget that links to these exact morphology parameters.">`;

        // add new button after the morphology image copy button, which means it'll be the leftmost button
        document.querySelector("#morphology-image-link-tooltip").after(quickButton);

        // click event
        quickButton.addEventListener("click",function (e) {
            // get the info we need from the other two buttons + the alt text from the dragon image itself
            var url = document.querySelector("#morphology-link").getAttribute("href");
            var image = document.querySelector("#morphology-image-link").getAttribute("href");
            var alt = document.querySelector("#dragon-image img").getAttribute("alt");

            var bbcode = `[url=${url}][img alt="${alt}"]${image}[/img][/url]`;

            // copy the string to the clipboard using FR's existing function that the two original buttons use ;)
            if (frCopyToClipboard(bbcode)) {
                e.preventDefault();
                this.classList.add("copied-msg");
            }
        });
        // tab navigation support
        quickButton.addEventListener("keyup",function (e) {
                if (e.key === "Enter") {
                    // get the info we need from the other two buttons + the alt text from the dragon image itself
                    var url = document.querySelector("#morphology-link").getAttribute("href");
                    var image = document.querySelector("#morphology-image-link").getAttribute("href");
                    var alt = document.querySelector("#dragon-image img").getAttribute("alt");

                    var bbcode = `[url=${url}][img alt="${alt}"]${image}[/img][/url]`;

                    // copy the string to the clipboard using FR's existing function that the two original buttons use ;)
                    if (frCopyToClipboard(bbcode)) {
                        e.preventDefault();
                        this.classList.add("copied-msg");
                        this.focus();
                    }
               }
           });
        // remove text when mousing out or focusing elsewhere w/ tab
        ['mouseleave', 'mouseenter', 'focusout'].forEach(function(event) {
            quickButton.addEventListener(event,function (e) {
                this.classList.remove("copied-msg");
                this.blur();
           });
        });

    }
})();

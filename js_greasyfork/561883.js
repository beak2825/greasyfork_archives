// ==UserScript==
// @name         Go to individual by ID
// @namespace    https://github.com/nate-kean/
// @version      2026.1.27
// @description  Add an input box to the top of the screen that lets you go straight to a profile using their ID.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561883/Go%20to%20individual%20by%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/561883/Go%20to%20individual%20by%20ID.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-navbar-id-box-css">
            #nates-navbar-id-box {
                border: none;
                outline: none;
                order: unset;
                width: 8rem;
                padding-left: 1rem;
                margin-right: 10px;
                font-size: 1.1em;
                color: white;
                order: -1;  /* cringe hack to keep my own My Interactions button from getting ahead */
                background: hsla(0, 0%, 100%, .25);
                border-radius: 4px;
                height: 40px;
                margin-bottom: 12px;
                margin-top: 12px;

                &:focus-within {
                    border-top: 1px solid hsla(0, 0%, 100%, .2);
                    border-bottom: 1px solid hsla(0, 0%, 100%, .2);
                }

                &::placeholder {
                    color: white;
                    opacity: 0.5;
                    &:focus {
                        opacity: 1;
                    }
                }
            }
        </style>
    `);

    const box = document.createElement("input");
    box.id = "nates-navbar-id-box";
    box.type = "number";
    box.placeholder = "Enter ID";
    box.addEventListener("keyup", (evt) => {
        if (evt.key !== "Enter") return;
        window.location.href = `/members/view/${box.value}`;
    });
    document.querySelector("header .desktop-icons").prepend(box);
})();
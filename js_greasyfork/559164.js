// ==UserScript==
// @name         Youtube Shorts to Watch Button
// @namespace    erc2nd_yt_shorts_to_watch
// @version      2025-12-09
// @description  Creates a button that will open a new tab with the current shorts video open in the regular YT viewing mode
// @author       erc2nd
// @match        https://www.youtube.com/shorts/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559164/Youtube%20Shorts%20to%20Watch%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/559164/Youtube%20Shorts%20to%20Watch%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

        const pm = document.getElementById("page-manager");
        const btn = document.createElement("button");
        btn.classList.add("yt-spec-button-shape-next",
                          "yt-spec-button-shape-next--tonal",
                          "yt-spec-button-shape-next--mono",
                          "yt-spec-button-shape-next--size-l",
                          "yt-spec-button-shape-next--icon-button");
        // btn.style.margin = "5vh 5vw 0 0";
        btn.textContent = "W";
        btn.addEventListener('click', ()=>{
            window.open(window.location.href.replace("shorts", "watch"), "_blank");
        });
        pm.appendChild(btn);

})();
// ==UserScript==
// @name         Terrorbytes – Elimination Icon
// @namespace    https://torn.com/
// @version      1.5
// @match        https://www.torn.com/*
// @grant        none
// @description  Elims icon
// @downloadURL https://update.greasyfork.org/scripts/558524/Terrorbytes%20%E2%80%93%20Elimination%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/558524/Terrorbytes%20%E2%80%93%20Elimination%20Icon.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const ICON_URL = "https://www.torn.com/images/v2/competition/elimination/team-icons/terror-bytes-dark.svg";
    const LINK_URL = "https://www.torn.com/page.php?sid=competition";

    function injectIcon() {
        const ul = document.querySelector("ul.status-icons, ul[class*='status-icons']");
        if (!ul) return;

        if (document.getElementById("custom-comp-icon")) return;

        const li = document.createElement("li");
        li.id = "custom-comp-icon";

        // Bigger icon (adjust size here)
        li.style.backgroundImage = `url("${ICON_URL}")`;
        li.style.backgroundSize = "22px 22px";   // <<< make bigger here
        li.style.backgroundRepeat = "no-repeat";
        li.style.backgroundPosition = "center";

        const a = document.createElement("a");
        a.href = LINK_URL;
        a.title = "Competition";
        a.classList.add("noOnline");

        li.appendChild(a);
        ul.appendChild(li);
    }

    // Remove green dot
    const style = document.createElement("style");
    style.textContent = `
        .status-icons li a.noOnline:after {
            display: none !important;
            content: none !important;
        }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver(injectIcon);
    observer.observe(document.body, { childList: true, subtree: true });

    injectIcon();
})();

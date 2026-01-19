// ==UserScript==
// @name         Google search result open in new tab
// @version      1.40
// @description  Open the google search result in a new tab, support desktop and mobile 谷歌搜尋結果會開新分頁，支持電腦和手機
// @author       </j0tsarup>
// @match        https://www.google.com/search?*
// @match        https://www.google.com.*/search?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/563246/Google%20search%20result%20open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/563246/Google%20search%20result%20open%20in%20new%20tab.meta.js
// ==/UserScript==

(function () {
    "use strict";

    document.body.addEventListener(
        "click",
        function (event) {
            const link = event.target.closest("a");

            if (link && link.href) {
                const isInResultsArea =
                    link.closest("#search") || link.closest("#main");

                const containsH3 = link.querySelector("h3");
                const containsMobileHeading = link.querySelector(
                    'div[role="heading"][aria-level="3"]'
                );

                const isResultLink =
                    isInResultsArea && (containsH3 || containsMobileHeading);

                if (isResultLink && link.href.startsWith("http")) {
                    if (link.pathname === "/search") {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();
                    window.open(link.href, "_blank");
                }
            }
        },
        true
    );
})();

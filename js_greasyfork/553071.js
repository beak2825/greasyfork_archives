// ==UserScript==
// @name         Do you really want to Google it?
// @namespace    https://github.com/PenguinCabinet
// @version      v0.0.1
// @description  Display confirmation when searching on Google.
// @author       PenguinCabinet
// @license      MIT
// @match        https://www.google.com/search?q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553071/Do%20you%20really%20want%20to%20Google%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/553071/Do%20you%20really%20want%20to%20Google%20it.meta.js
// ==/UserScript==

(function () {

    const url = new URL(location.href);

    if (url.searchParams.get("start") == null) {
        const body = document.getElementsByTagName("body")[0];
        body.style.filter = "blur(8px)";

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (window.confirm(`本当に、\"${url.searchParams.get("q")}\"をGoogle検索しますか？`)) {
                    body.style.filter = "";
                }
                else {
                    location.href = "https://www.google.com/";
                }

            });
        });
    }
    // Your code here...
})();
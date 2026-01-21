// ==UserScript==
// @name         Mass Contact message title: use all space
// @namespace    https://github.com/nate-kean/
// @version      2026.1.20.1
// @description  Grow the text in the Message Title column to the entire width it has.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/massContact*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562585/Mass%20Contact%20message%20title%3A%20use%20all%20space.user.js
// @updateURL https://update.greasyfork.org/scripts/562585/Mass%20Contact%20message%20title%3A%20use%20all%20space.meta.js
// ==/UserScript==

(function() {
    document.head.insertAdjacentHTML("beforeend", `
        <style id="jrc-message-title-width-fix">
            .jrc-mtwf-wrapper {
                position: relative;
                vertical-align: middle;
                height: 14pt;
            }

            .jrc-mtwf-wrapper-inner {
                position: absolute;
                overflow: hidden;
                white-space: nowrap;
                width: 100%;
                text-overflow: ellipsis;
            }
        </style>
    `);

    function go () {
        for (const a of document.querySelectorAll("#massContact-table td.mc-message-title > a")) {
            a.textContent = a.getAttribute("data-original-title");
            $(a).tooltip("disable");
            const wrapper = document.createElement("div");
            wrapper.classList.add("jrc-mtwf-wrapper");
            const inner = document.createElement("div");
            inner.classList.add("jrc-mtwf-wrapper-inner");
            wrapper.appendChild(inner);
            a.before(wrapper);
            inner.appendChild(a);
        }
    }

    const spinner = document.querySelector("#massContact-table_processing");

    function onMutation() {
        if (spinner.style.display !== "none") return;
        go();
    }


    const observer = new MutationObserver(onMutation);
    observer.observe(spinner, {
        subtree: false,
        childList: false,
        attributes: true,
        attributeFilter: ["style"],
    });
})();
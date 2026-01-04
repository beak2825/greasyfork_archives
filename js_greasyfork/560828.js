// ==UserScript==
// @name         View: add check for missing family
// @namespace    https://github.com/nate-kean/
// @version      2025.12.30
// @description  If a profile is not associated with a family, add a suggestion to go to the Family tab and fix it.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560828/View%3A%20add%20check%20for%20missing%20family.user.js
// @updateURL https://update.greasyfork.org/scripts/560828/View%3A%20add%20check%20for%20missing%20family.meta.js
// ==/UserScript==

(function() {
    if (document.querySelector(".family-panel") !== null) return;
    const components = window.location.href.split("/");
    components[components.length - 2] = "family";
    const familyURL = components.join("/");
    const a = document.createElement("a");
    a.href = familyURL;
    a.setAttribute("class", "panel panel-default info-panel family-panel");
    a.insertAdjacentHTML("afterbegin", `
        <div class="panel-heading">Family</div>
        <div class="panel-body">
            <div class="container noPad">
                <div class="col-sm-8 noPad family-item-details" style="width: 100%; text-align: center; font-size: 14px">
                    <div style="padding-bottom: 15px; color: #676767; opacity: 0.5">
                        No family to display
                    </div>
                    <span style="margin-bottom: 1.5rem; display: block">
                        Go to Family
                    </span>
                </div>
            </div>
        </div>
    `);
    document.querySelector(".right-container").prepend(a);
})();

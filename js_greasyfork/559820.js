// ==UserScript==
// @name         DGA Digital ID Helper
// @namespace    iFantz7E.DgaDigitalIdHelper
// @version      0.4
// @description  Improve DGA Digital ID
// @author       7-elephant
// @match        https://connect.egov.go.th/Account/Login*
// @match        https://connect.dga.or.th/Account/Login*
// @icon         https://connect.egov.go.th/favicon.ico
// @grant        none
// @run-at       document-start
// @license      GPL-3.0-only
// @copyright    2025, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/559820/DGA%20Digital%20ID%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/559820/DGA%20Digital%20ID%20Helper.meta.js
// ==/UserScript==

// Since 22 Dev 2025
// https://greasyfork.org/en/scripts/559820-dga-digital-id-helper

(function () {
    "use strict";
    function attachOnReady(callback) {
        document.addEventListener("DOMContentLoaded", function (e) {
            callback();
        });
    }

    function main() {
        let eleText = document.querySelector("#MaskedInput");
        if (eleText) {
            if (eleText.type == "text") {
                eleText.type = "password";
            }
        }
        let eleToggle = document.querySelector("#ToggleMask");
        if (eleToggle) {
            eleToggle.addEventListener("click", function () {
                let eleText = document.querySelector("#MaskedInput");
                if (eleText) {
                    if (eleText.type == "password") {
                        eleText.type = "text";
                    }
                }
            });
        }

        setTimeout(function () {
            let eleButton = document.querySelector("#mdlAnnouncementStyle button.cancel");
            if (eleButton) {
                eleButton.click();
            }
        }, 1000);
    }

    attachOnReady(main);
})();

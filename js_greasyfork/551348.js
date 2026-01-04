// ==UserScript==
// @name         Connect Card Upload Download Template
// @namespace    https://github.com/nate-kean/
// @version      2025-10-02
// @description  Add a pop-up next to the Form view modals for Connect Cards, that gives you the information formatted exactly how we want to so you can copy and paste it directly into your Word document.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/forms
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551348/Connect%20Card%20Upload%20Download%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/551348/Connect%20Card%20Upload%20Download%20Template.meta.js
// ==/UserScript==

(async function() {
    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function waitForElement(selector, pollingRateMs=100, parent=document) {
        let el;
        while (true) {
            el = parent.querySelector(selector);
            if (el) return el;
            await delay(pollingRateMs);
        }
    }

    async function elementGone(selector, pollingRateMs=100, parent=document) {
        let el;
        while (true) {
            el = parent.querySelector(selector);
            if (!el) return;
            await delay(pollingRateMs);
        }
    }

    document.head.insertAdjacentHTML("beforeend", `
        <style id="nates-connect-card-helper-css">
            #nates-connect-card-helper {
                position: absolute;
                top: 6rem;
                right: 1rem;
                width: 23vw;
                height: 80vh;
                background-color: #fff;
                padding: 1.5rem;
                box-shadow: 0 20px 50px 0 rgba(52,52,52,.13) !important;
            }
            #nates-connect-card-helper > img {
                max-width: 100%;
                max-height: 80%;
            }
            #nates-connect-card-helper > button {
                float: right;
            }
        </style>
    `);

    while (true) {
        const modal = await waitForElement(".modal-dialog");
        const detail = modal.querySelector("h3.modal-title > span > span.info");
        while (detail.textContent === "") {
            await delay(10);
        }
        let popup = null;
        if (detail.textContent === "Connect Card Upload") {
            // Gather information
            const firstName = modal.querySelector("input[data-qa='field-person-name-input-first-name']").value;
            const lastName = modal.querySelector("input[data-qa='field-person-name-input-last-name']").value;
            const fileURL = modal.querySelector("a.file-upload-link").href;
            const memo = modal.querySelector("textarea[data-qa='field-memo-textarea']").textContent || "(no desc)";

            // Add popup
            popup = document.createElement("div");
            popup.id = "nates-connect-card-helper";
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "X";
            closeBtn.addEventListener("click", () => {
                popup.remove();
            });
            popup.appendChild(closeBtn);
            const img = document.createElement("img");
            img.src = fileURL;
            popup.appendChild(img);
            const desc = document.createElement("p");
            desc.textContent = `${firstName} ${lastName} - ${memo}`;
            popup.appendChild(desc);
            document.body.appendChild(popup);
        }
        await elementGone(".modal-dialog");
        popup?.remove();
    }
})();

// ==UserScript==
// @name         Connect Card Upload Viewer
// @namespace    https://github.com/nate-kean/
// @version      2025.11.24
// @description  Add a pop-up next to the Form view modals for Connect Cards, that lets you zoom into the photos.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/forms
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.min.js
// @downloadURL https://update.greasyfork.org/scripts/556779/Connect%20Card%20Upload%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/556779/Connect%20Card%20Upload%20Viewer.meta.js
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
        <style id="nates-connect-card-viewer-css">
            #nates-connect-card-viewer {
                position: absolute;
                top: 6rem;
                right: 1rem;
                width: 23vw;
                height: 80vh;
                background-color: #fff;
                padding: 1.5rem;
                box-shadow: 0 20px 50px 0 rgba(52,52,52,.13) !important;
                overflow-y: auto;

                & img {
                    max-width: 100%;
                    max-height: 80%;
                    cursor: zoom-in;
                }

                & button {
                    float: right;
                }
            }
        </style>
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.min.css"
            integrity="sha512-vRbASHFS0JiM4xwX/iqr9mrD/pXGnOP2CLdmXSSNAjLdgQVFyt4qI+BIoUW7/81uSuKRj0cWv3Dov8vVQOTHLw=="
            crossorigin="anonymous" referrerpolicy="no-referrer"
        />
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
            const fileURLs = modal.querySelectorAll("a.file-upload-link");
            const memos = modal.querySelectorAll("textarea[data-qa='field-memo-textarea']");

            // Add popup
            popup = document.createElement("div");
            popup.id = "nates-connect-card-viewer";
            const closeBtn = document.createElement("button");
            closeBtn.textContent = "X";
            closeBtn.addEventListener("click", () => {
                popup.remove();
            });
            popup.appendChild(closeBtn);
            for (let i = 0; i < fileURLs.length; i++) {
                const img = document.createElement("img");
                img.src = fileURLs[i].href;
                new Viewer(img);
                popup.appendChild(img);
                const desc = document.createElement("p");
                desc.textContent = `${firstName} ${lastName} - ${memos[i].textContent || "(no desc)"}`;
                popup.appendChild(desc);
            }
            document.body.appendChild(popup);
        }
        await elementGone(".modal-dialog");
        popup?.remove();
    }
})();

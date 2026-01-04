// ==UserScript==
// @name         View Individual: View image attachments in page
// @namespace    https://github.com/nate-kean/
// @version      2025.11.9
// @description  If an attachment on a profile is an image, add a viewer to it so you don't have to download it.
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @match        https://jamesriver.fellowshiponego.com/members/edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.min.js
// @downloadURL https://update.greasyfork.org/scripts/554653/View%20Individual%3A%20View%20image%20attachments%20in%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/554653/View%20Individual%3A%20View%20image%20attachments%20in%20page.meta.js
// ==/UserScript==

(function() {
    const extensions = ["jpeg", "jpg", "png", "gif", "bmp", "webp"];
    const selector = `
        #memberDocumentsList a.fileDownloadLink,
        #memberEditDocumentsList a.fileDownloadLink
    `;

    document.head.insertAdjacentHTML("beforeend", `
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.11.7/viewer.min.css"
            integrity="sha512-vRbASHFS0JiM4xwX/iqr9mrD/pXGnOP2CLdmXSSNAjLdgQVFyt4qI+BIoUW7/81uSuKRj0cWv3Dov8vVQOTHLw=="
            crossorigin="anonymous" referrerpolicy="no-referrer"
        />
    `);

    for (const a of document.querySelectorAll(selector)) {
        const ext = a.textContent.trim().split(".").at(-1);
        if (!extensions.includes(ext)) continue;

        const icon = a.querySelector("i");
        icon.classList.remove("glyphicon-cloud-download");
        icon.classList.add("glyphicon-search");

        a.addEventListener("click", evt => {
            evt.preventDefault();
            let img = a.querySelector("img");
            if (img === null) {
                img = document.createElement("img");
                img.src = a.href;
                img.setAttribute("style", "display: none;");
                a.appendChild(img);
                a.viewer = new Viewer(img);
            }
            a.viewer.show(true);
        });
    }
})();

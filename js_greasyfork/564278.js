// ==UserScript==
// @name         Navbar: add missing avatar to profile button
// @namespace    https://github.com/nate-kean/
// @version      2026.1.28
// @description  None
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564278/Navbar%3A%20add%20missing%20avatar%20to%20profile%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/564278/Navbar%3A%20add%20missing%20avatar%20to%20profile%20button.meta.js
// ==/UserScript==

(function() {
    const holder = document.querySelector(".profile-icon-click-handler.profile-icon");
    const img = document.createElement("img");
    // Hide it until we delete the initials element, to prevent it from showing up under the profile entry.
    img.style.visibility = "hidden";
    img.style.maxWidth = "100%";
    img.addEventListener("error", (event) => {
        // Account does not have a picture (or some other error occurred),
        // so roll back the changes and keep the initials.
        img.remove();
        return true;
    });
    img.addEventListener("load", (event) => {
        // Success! Go ahead and remove the initials.
        // Cursed shenanigans just to remove the text from something without
        // deleting everything inside of it
        // https://stackoverflow.com/a/34700627
        const iter = document.createNodeIterator(holder, NodeFilter.SHOW_TEXT);
        let textNode;
        while (textNode = iter.nextNode()) {
            textNode.remove();
        }
        img.style.visibility = "";
    });
    const ownUserID = document.querySelector(".profile-menu-item").href.split("/").at(-1);
    img.classList.add("img-circle");
    img.src = `/upload/jamesriver/profilePictures/${ownUserID}_thumb.jpg`;
    holder.appendChild(img);
})();
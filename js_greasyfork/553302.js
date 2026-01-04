// ==UserScript==
// @name         Fill in profile pictures in the Family Section
// @namespace    https://github.com/nate-kean/
// @version      20251106
// @description  None
// @author       Nate Kean
// @match        https://jamesriver.fellowshiponego.com/members/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fellowshiponego.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553302/Fill%20in%20profile%20pictures%20in%20the%20Family%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/553302/Fill%20in%20profile%20pictures%20in%20the%20Family%20Section.meta.js
// ==/UserScript==

(function() {
    for (const initial of document.querySelectorAll(".family-panel div.user-initials")) {
        const pictureLink = document.createElement("a");
        const holder = initial.parentNode;
        const entry = holder.parentNode;
        const link = entry.querySelector(`
            div.family-item-details > p:first-of-type > a,
            div:nth-child(3) > p:first-of-type > a
        `).href;
        pictureLink.href = link;
        const picture = document.createElement("img");
        // Hide it until we delete the initials element, to prevent it from showing up under the profile entry.
        picture.setAttribute("style", "visibility: hidden");
        picture.addEventListener("error", (event) => {
            // Account does not have a picture (or some other error occurred),
            // so roll back the changes and keep the initials.
            pictureLink.remove();
            return true;
        });
        picture.addEventListener("load", (event) => {
            // Success! Go ahead and remove the old initials element.
            initial.remove();
            picture.removeAttribute("style");
        });
        const uid = link.split("/").splice(-1)[0];
        picture.src = `/upload/jamesriver/profilePictures/${uid}_thumb.jpg`;
        picture.classList.add("user-picture", "img-circle");
        pictureLink.appendChild(picture);
        holder.appendChild(pictureLink);
    }
})();
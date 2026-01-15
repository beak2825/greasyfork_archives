// ==UserScript==
// @name         Reddit remove avatars
// @name:de      Entferne Reddit Profilbilder
// @version      1.0
// @description  Remove the reddit avatars for easier reading.
// @description:de Entfernt alle Profilbilder aus den Kommentaren auf Reddit.
// @author       Drados
// @match        https://www.reddit.com/r/*
// @license      GPL-3.0 license
// @grant        GM_addStyle
// @run-at document-idle
// @namespace https://greasyfork.org/users/1559751
// @downloadURL https://update.greasyfork.org/scripts/562496/Reddit%20remove%20avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/562496/Reddit%20remove%20avatars.meta.js
// ==/UserScript==


// this prevents usernames from being cut off
GM_addStyle ( `
.overflow-hidden {
    overflow: unset !important;
}
` );


function removeCommentAvatarDivs() {
  const e = document.querySelectorAll('div[slot="commentAvatar"]');
  e.forEach(div => div.remove());
}

// move usernamse to the left
function updateMargin() {
    const e = document.querySelectorAll('.author-name-meta');
    e.forEach(element => {
        element.style.marginLeft = '-1.5rem'; // changing this to -2 will look better but the collapsed comment button will overlap
    });
}

const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            updateMargin();
            removeCommentAvatarDivs();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

// ==UserScript==
// @name        Flickr Add Refer Comment v.2
// @namespace   https://greasyfork.org/fr/users/8-decembre
// @author      decembre
// @description Auto comment the place where you come from
// @icon        https://external-content.duckduckgo.com/ip3/blog.flickr.net.ico
// @version     2.00
// @include     https://*flickr.com/photos/*/*
// @exclude     https://*flickr.com/photos/*/*#preview
// @exclude     https://*flickr.com/photos/organize*
// @downloadURL https://update.greasyfork.org/scripts/561469/Flickr%20Add%20Refer%20Comment%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/561469/Flickr%20Add%20Refer%20Comment%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRefererUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const referer = document.referrer;
    console.log('referer:', referer);
    if (referer) {
        return referer;
    }
    console.log('Referer URL not found');
    return '';
}

    function getRefererText(url) {
    const urlPath = new URL(url);
    if (urlPath.pathname.match(/photostream/)) {
        return 'Photostream';
    } else if (urlPath.pathname.match(/pool/)) {
        return 'Pool (your shots in it)';
    } else if (urlPath.pathname.match(/album/)) {
        return 'Album';
    } else if (urlPath.pathname.match(/gallery|galleries/)) {
        return 'Gallery';
    } else if (urlPath.pathname.match(/people/)) {
        return 'Contact';
    } else if (urlPath.pathname.match(/notifications/)) {
        return 'Notification';
    } else if (urlPath.pathname.match(/admin/)) {
        return 'Pool Pending';
    } else if (urlPath.search.includes('sort=interestingness')) {
        return 'interestingness';
    } else if (urlPath.pathname.match(/faves|favorites/)) {
        return 'Favorites';
    } else if (urlPath.hostname === 'www.flickr.com' && urlPath.pathname === '/') {
        return 'Feeds';
    } else {
        return 'Unknown';
    }
}
   function addButton() {
    const refererUrl = getRefererUrl();
    const refererText = getRefererText(refererUrl);
    const buttonContainer = document.querySelector('.fluid.html-photo-page-scrappy-view body .photo-comments.with-emoji-picker .add-comment-section .add-comment-view .buttons.comment-buttons.always-expanded');
    if (buttonContainer) {
        const button = document.createElement('button');
        button.textContent = `Seen in: ${refererText}`;
        button.className = 'action comment-button no-outline refer';
        button.onclick = () => {
            const textArea = document.querySelector('textarea[placeholder]');
            if (textArea) {
                textArea.value += `\nSeen in ${refererText}: ${refererUrl}`;
            }
        };
        buttonContainer.appendChild(button);
        console.log('Button added');
    } else {
        console.log('Button container not found');
    }
}



    const observer = new MutationObserver((mutations) => {
        console.log('Mutation observed');
        const addCommentView = document.querySelector('.add-comment-view');
        if (addCommentView) {
            observer.disconnect();
            setTimeout(() => {
                addButton();
            }, 1000); // wait for 1 second
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
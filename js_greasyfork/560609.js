// ==UserScript==
// @name         Add download original artwork button for images
// @version      1.0
// @namespace    AnotherBubblebath
// @description  Adds the original artwork button, which detects if an image link is valid or not.
// @author       AnotherBubblebath
// @license      MIT
// @match        https://soundcloud.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/560609/Add%20download%20original%20artwork%20button%20for%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/560609/Add%20download%20original%20artwork%20button%20for%20images.meta.js
// ==/UserScript==

'use strict';

function isValidUrl(link) {
    try {
        new URL(link);
        return true;
    } catch (e) {
        return false;
    }
}

function validateImageUrl(url) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: 'HEAD',
            url: url,
            onload: function(response) {
                console.log('Checking ' + url);
                resolve(response.status !== 403 && response.status < 400);
            },
            onerror: function() {
                console.log('Error checking ' + url);
                resolve(false);
            },
            ontimeout: function() {
                console.log('Timeout checking ' + url);
                resolve(false);
            },
            timeout: 5000
        });
    });
}

const artworkObserver = new MutationObserver(async (images) => {
    if (document.querySelector('.listenArtworkWrapper')) {
        const wrapperElement = document.querySelector('.listenArtworkWrapper');
        if (wrapperElement.querySelector('span')) {
            console.log("image got");
            let spanStyle = wrapperElement.querySelector('span').style.backgroundImage;
            let imageLink = spanStyle.substring(spanStyle.indexOf("(")+2,spanStyle.length-2);
            let originalImageNoFile = imageLink.substring(0,imageLink.length-12) + "original";
            let imageFile = "";
            if (await validateImageUrl(originalImageNoFile + ".jpg")) {
                console.log(".jpg");
                imageFile = originalImageNoFile + ".jpg";
            } else if (await validateImageUrl(originalImageNoFile + ".png")) {
                console.log(".png");
                imageFile = originalImageNoFile + ".png";
            } else if (await validateImageUrl(originalImageNoFile + ".gif")) {
                console.log(".gif");
                imageFile = originalImageNoFile + ".gif";
            } else {
                console.log("last resort .jpg");
                imageFile = originalImageNoFile + ".jpg";
            }
            const imageButton = document.createElement("button");
            imageButton.innerHTML = "Download Original";
            imageButton.type = "button";
            imageButton.id = "downloadImageButton";
            imageButton.style.backgroundColor = "rgb(39, 39, 39)";
            imageButton.style.borderStyle = "none";
            imageButton.style.justifyContents = "center";

            imageButton.addEventListener("click", function() {
                const imageTab = window.open(imageFile, '_blank');
                if (imageTab) {
                    imageTab.focus();
                }
            });

            const heroArtworkElement = document.querySelector('.listenArtworkWrapper');
            if (heroArtworkElement) {
                if(document.querySelector("#downloadImageButton") === null) {

                    heroArtworkElement.after(imageButton);
                    const heroArtworkParentElement = document.querySelector('.fullHero__artwork');
                    heroArtworkParentElement.style.display = "flex";
                    heroArtworkParentElement.style.alignItems = "center";
                    heroArtworkParentElement.style.flexDirection = "column";
                }
            }
        }
    }
});

artworkObserver.observe(document.body, { childList: true});
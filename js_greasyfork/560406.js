// ==UserScript==
// @name         Tinder Something
// @namespace    http://tampermonkey.net/
// @version      2024-11-23
// @description  Tinder photo downloader!
// @author       You
// @match        https://tinder.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/560406/Tinder%20Something.user.js
// @updateURL https://update.greasyfork.org/scripts/560406/Tinder%20Something.meta.js
// ==/UserScript==


(function() {
    'use strict';

    async function downloadImage(
    imageSrc,
     nameOfDownload = 'tinder-pic.png',
    ) {

        const r = await GM.xmlHttpRequest({ url: imageSrc, responseType: 'blob' }).catch(e => console.error(e));

        const blobImage = r.response;
        const href = URL.createObjectURL(blobImage);

        const anchorElement = document.createElement('a');
        anchorElement.href = href;
        anchorElement.download = nameOfDownload;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
    }


    function createPreviewButton() {
        const button = document.createElement('div');
        button.textContent = 'Pobierz fotkę';
        button.style.position = 'relative';
        //button.style.top = '400px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        button.style.color = '#fff';
        button.style.borderRadius = '10px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.fontSize = '14px';
        button.style.textAlign = 'center';
        button.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        document.querySelectorAll('[aria-label="Pasek nawigacji"]')[0].appendChild(button);
        console.log("test");

        button.addEventListener('click', () => {
            var imageCards = $("div.StretchedBox[aria-hidden='false'] div.keen-slider__slide[aria-hidden='false'] div.StretchedBox")
            var image;
            if (imageCards.length == 0)  {
                imageCards = $("div.keen-slider__slide[aria-hidden='false'] div.profileCard__slider__imgShadow div.profileCard__slider__img")
            }
            imageCards = imageCards[0].style.backgroundImage
            image = imageCards.substr(5,imageCards.length-7)
            //window.open(image);
            downloadImage(image);
        })
    }

    // Create the preview button
    window.addEventListener('load', function() {
        setTimeout(createPreviewButton, 2000)
    }, false);
})();
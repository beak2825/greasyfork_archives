// ==UserScript==
// @name         Torn Chat Link Embedder - YouTube & Multi-Link
// @version      1.0
// @description  Embeds images, videos, and YouTube links into Torn chat
// @author       dingus
// @match        *.torn.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1338514
// @downloadURL https://update.greasyfork.org/scripts/563081/Torn%20Chat%20Link%20Embedder%20-%20YouTube%20%20Multi-Link.user.js
// @updateURL https://update.greasyfork.org/scripts/563081/Torn%20Chat%20Link%20Embedder%20-%20YouTube%20%20Multi-Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.gifv'];
    const videoExtensions = ['.mp4', '.webm', '.ogg'];

    function getYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    function createEmbed(url) {
        const cleanUrl = url.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]$/, "");
        const lowerUrl = cleanUrl.toLowerCase();

        const ytId = getYouTubeId(cleanUrl);
        if (ytId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${ytId}`;
            iframe.className = "tm-embed-content";
            iframe.width = "100%";
            iframe.height = "200";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.style.marginTop = "8px";
            iframe.style.borderRadius = "4px";
            return iframe;
        }

        if (imageExtensions.some(ext => lowerUrl.endsWith(ext))) {
            const img = document.createElement('img');
            img.src = cleanUrl;
            img.className = "tm-embed-content";
            img.style.maxWidth = '100%';
            img.style.maxHeight = '250px';
            img.style.display = 'block';
            img.style.marginTop = '8px';
            img.style.borderRadius = '4px';
            img.style.border = '1px solid #444';
            return img;
        }

        if (videoExtensions.some(ext => lowerUrl.endsWith(ext))) {
            const video = document.createElement('video');
            video.src = cleanUrl;
            video.className = "tm-embed-content";
            video.controls = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '250px';
            video.style.display = 'block';
            video.style.marginTop = '8px';
            return video;
        }

        return null;
    }

    function scanAndEmbed() {
        const messageSpans = document.querySelectorAll('.message___pRfWR span.root___Xw4jI');

        messageSpans.forEach(span => {
            const text = span.textContent;
            const matches = text.match(urlRegex);

            if (matches) {
                const existingEmbeds = span.querySelectorAll('.tm-embed-content');

                if (existingEmbeds.length === 0) {
                    matches.forEach(url => {
                        const embedElement = createEmbed(url);
                        if (embedElement) {
                            span.appendChild(embedElement);
                        }
                    });
                }
            }
        });
    }

    const observer = new MutationObserver(() => {
        scanAndEmbed();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(scanAndEmbed, 2000);
    scanAndEmbed();

})();
// ==UserScript==
// @name         Large Thumbnail images on xxxclub.to
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Make Large Thumbnail images on xxxclub.to
// @author       Wei Zong + edit
// @match        *://xxxclub.to/*
// @match        *://xxxwebdlxxx.org/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559847/Large%20Thumbnail%20images%20on%20xxxclubto.user.js
// @updateURL https://update.greasyfork.org/scripts/559847/Large%20Thumbnail%20images%20on%20xxxclubto.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // --- original xxxclub link → image replacement ---

    const links = document.querySelectorAll("a.js-modal-url");
    links.forEach((link) => {
        const href = link.href;
        const urlMatch = href.match(
            /https:\/\/([^\/]+)\/[a-z]-1\/(\d{4}\/\d{2}\/\d{2}\/[a-z0-9]+)\.jpeg\.html/
        );
        if (urlMatch) {
            const domain = urlMatch[1];
            const path = urlMatch[2];
            const imgSrc = `https://${domain}/1/${path}.jpeg`;
            const imgElement = document.createElement("img");
            imgElement.src = imgSrc;
            imgElement.dataset.original = imgSrc;
            imgElement.classList.add("img-responsive", "descrimg", "lazy");
            imgElement.style.display = "block";
            link.parentNode.replaceChild(imgElement, link);
        }
    });

    // --- normalize image URLs ---

    const imgs = document.querySelectorAll("img");

    const replaceUrl1 = (url) => url.replace("/1s/", "/1/");
    const replaceUrl2 = (url) => url.replace(".th.jpg", ".jpg");
    const replaceUrl3 = (url) => url.replace(".md.jpg", ".jpg");

    const replaceUrl4 = (url) => {
        if (url.includes("/upload/small/")) {
            return url.replace("/upload/small/", "/upload/big/");
        }
        return url;
    };

    imgs.forEach((img) => {
        if (img.src.includes("/1s/")) {
            img.src = replaceUrl1(img.src);
        }
        if (img.dataset.original && img.dataset.original.includes("/1s/")) {
            img.dataset.original = replaceUrl1(img.dataset.original);
        }
        if (img.src.includes(".th.jpg")) {
            img.src = replaceUrl2(img.src);
        }
        if (img.dataset.original && img.dataset.original.includes(".th.jpg")) {
            img.dataset.original = replaceUrl2(img.dataset.original);
        }
        if (img.src.includes(".md.jpg")) {
            img.src = replaceUrl3(img.src);
        }
        if (img.dataset.original && img.dataset.original.includes(".md.jpg")) {
            img.dataset.original = replaceUrl3(img.dataset.original);
        }

        if (img.src.includes("/upload/small/")) {
            img.src = replaceUrl4(img.src);
        }
        if (img.dataset.original && img.dataset.original.includes("/upload/small/")) {
            img.dataset.original = replaceUrl4(img.dataset.original);
        }
    });

    // --- HUGE thumbnails on xxxclub.to/torrents/* (≈6.5x, 80%) ---

    if (location.hostname.includes("xxxclub.to") &&
        location.pathname.startsWith("/torrents/")) {

        document.querySelectorAll("img.img-thumbnail").forEach(img => {
            img.style.maxWidth = "";
            img.style.maxHeight = "";
            img.style.width = "";
            img.style.height = "";
        });

        if (typeof GM_addStyle === "function") {
            GM_addStyle(`
                img.img-thumbnail {
                    width: 975px !important;
                    max-width: 975px !important;
                    max-height: 1300px !important;
                    height: auto !important;
                }
            `);
        }
    }

    // --- HUGE thumbnails on xxxwebdlxxx.org (≈6.5x, 80%, SHARP) ---

    if (location.hostname.includes("xxxwebdlxxx.org")) {

        document.querySelectorAll("img.img-thumbnail").forEach(img => {
            img.style.maxWidth = "";
            img.style.maxHeight = "";
            img.style.width = "";
            img.style.height = "";
        });

        if (typeof GM_addStyle === "function") {
            GM_addStyle(`
                img.img-thumbnail {
                    width: 975px !important;
                    max-width: 975px !important;
                    max-height: 1300px !important;
                    height: auto !important;
                }
            `);
        }
    }
})();

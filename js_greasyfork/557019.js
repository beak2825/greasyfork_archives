// ==UserScript==
// @name         Hentaicity Thumbnail → Full Image Replacer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  BLAAAAAAAAAAAAAAAAAH
// @author       Word
// @match        https://www.hentaicity.com/gallery/my-sister-2-brother-savagely-rams-his-hentai-sister-s-asshole-4NNjwZKq8RH.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaicity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557019/Hentaicity%20Thumbnail%20%E2%86%92%20Full%20Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/557019/Hentaicity%20Thumbnail%20%E2%86%92%20Full%20Image%20Replacer.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const THUMBNAIL_URL_PATTERN =
        /https:\/\/cdn1\.images\.hentaicity\.com\/galleries\/[^\/]+\/[^\/]+\/[^\/]+-t\.jpg/;

    function convertThumbnailToFullSize(url) {
        return url.replace("-t.jpg", ".jpg");
    }

    function processNode(node) {
        if (node.tagName === "IMG") {
            if (THUMBNAIL_URL_PATTERN.test(node.src)) {
                node.src = convertThumbnailToFullSize(node.src);
            }
        }

        if (node.tagName === "A") {
            if (THUMBNAIL_URL_PATTERN.test(node.href)) {
                node.href = convertThumbnailToFullSize(node.href);
            }
        }

        const images =
            node.querySelectorAll?.("img") ?? [];
        const links =
            node.querySelectorAll?.("a") ?? [];

        for (const image of images) {
            if (THUMBNAIL_URL_PATTERN.test(image.src)) {
                image.src = convertThumbnailToFullSize(image.src);
            }
        }

        for (const link of links) {
            if (THUMBNAIL_URL_PATTERN.test(link.href)) {
                link.href = convertThumbnailToFullSize(link.href);
            }
        }
    }

    processNode(document.body);

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    processNode(addedNode);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

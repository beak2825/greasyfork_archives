// ==UserScript==
// @name         Google Maps Image Downloader
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  الحصول على رابط الصورة في خرائط Google
// @match        https://www.google.com/maps/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562705/Google%20Maps%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/562705/Google%20Maps%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentImageUrl = null;

    // تلتقط أحدث صورة معروضة
    function updateCurrentImage() {
        const imgs = [...document.querySelectorAll('img[src*="googleusercontent.com"]')];

        if (!imgs.length) return;

        // Google Maps يعرض عدة صور، عادةً الصورة الأكبر هي الصورة الحالية
        let largestImg = imgs[0];
        let maxSize = 0;

        imgs.forEach(img => {
            const size = img.naturalWidth * img.naturalHeight;
            if (size > maxSize) {
                maxSize = size;
                largestImg = img;
            }
        });

        currentImageUrl = largestImg.src;
    }

    // زر فتح الصورة الأصلية
    function createButton() {
        if (document.getElementById("gm-full-image-btn")) return;

        const btn = document.createElement("button");
        btn.id = "gm-full-image-btn";
        btn.innerText = "فتح الصورة";
        btn.style.position = "fixed";
        btn.style.top = "20px";
        btn.style.left = "20px";
        btn.style.zIndex = "9999999";
        btn.style.padding = "10px 15px";
        btn.style.background = "#34A853";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.cursor = "pointer";

        btn.onclick = () => {
            updateCurrentImage(); // ← أهم نقطة
            if (!currentImageUrl) return alert("لم يتم العثور على صورة.");

            const fullUrl = currentImageUrl.replace(/=w\d+.*/, "=w0");
            window.open(fullUrl, "_blank");
        };

        document.body.appendChild(btn);
    }

    // راقب الصور وتعرّف على الصورة الحالية باستمرار
    function observeImages() {
        const observer = new MutationObserver(() => {
            updateCurrentImage();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["src"]
        });
    }

    window.addEventListener("load", () => {
        createButton();
        observeImages();

        // تحديث أولي
        setTimeout(updateCurrentImage, 2000);
    });

})();


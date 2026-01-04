// ==UserScript==
// @name         JAVLibrary + MissAV HD Full Width + Single Column
// @namespace    https://example.com
// @version      4.1
// @description  HD full-width thumbnails + single-column layout for JAVLibrary and MissAV (infinite scroll only for JAVLibrary)
// @match        https://www.javlibrary.com/*
// @match        https://missav.ws/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557855/JAVLibrary%20%2B%20MissAV%20HD%20Full%20Width%20%2B%20Single%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/557855/JAVLibrary%20%2B%20MissAV%20HD%20Full%20Width%20%2B%20Single%20Column.meta.js
// ==/UserScript==

(function() {

    /* ============================================================
     * GLOBAL CSS (MissAV + JAVLibrary)
     * ============================================================ */
    function injectStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
            /* ===== JAVLibrary layout ===== */
            .videos {
                display: flex !important;
                flex-direction: column !important;
                gap: 18px !important;
                width: 100% !important;
                max-width: 100% !important;
            }

            .video {
                width: 100% !important;
            }

            .video img {
                width: 100% !important;
                height: auto !important;
                object-fit: cover !important;
                border-radius: 10px !important;
            }

            .video .title {
                font-size: 18px !important;
                line-height: 1.4 !important;
                margin-top: 6px !important;
            }

            /* ===== MissAV layout (single column waterfall) ===== */

            /* The container */
            .grid {
                display: flex !important;
                flex-direction: column !important;
                gap: 18px !important;
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 auto !important;
            }

            /* Each card */
            .grid > div {
                width: 100% !important;
                max-width: 100% !important;
                overflow: hidden !important;
                border-radius: 10px !important;
            }

            /* Thumbnails */
            .grid img {
                width: 100% !important;
                height: auto !important;
                display: block !important;
                object-fit: cover !important;
                border-radius: 10px !important;
            }
            /* ===== JAVLibrary FULL IMAGE FIX ===== */

            /* Remove fixed-height preview boxes */
            .video,
            .video a,
            .video .preview,
            .video .photo,
            .video .thumb {
                height: auto !important;
                max-height: none !important;
                aspect-ratio: auto !important;
                overflow: visible !important;
            }
            
            /* Remove fake aspect ratio padding */
            .video a {
                padding-top: 0 !important;
            }
            
            /* Ensure image is not cropped */
            .video img {
                position: static !important;
                width: 100% !important;
                height: auto !important;
                object-fit: contain !important;
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    }

    injectStyles();


    /* ============================================================
     * JAVLibrary: convert thumbnails to high-res
     * ============================================================ */
    function upgradeImages(container=document) {
        container.querySelectorAll(".video img").forEach(img => {
            const src = img.src;

            if (src.includes("ps.jpg") || src.includes("pt.jpg")) {
                img.src = src.replace(/ps\.jpg|pt\.jpg/gi, "pl.jpg");
            }
        });
    }

    if (location.hostname.includes("javlibrary")) {
        upgradeImages();
    }


    /* ============================================================
     * JAVLibrary infinite scroll
     * ============================================================ */
    async function fetchPage(url) {
        try {
            const res = await fetch(url);
            return await res.text();
        } catch (e) {
            console.warn("Fetch failed:", url, e);
            return null;
        }
    }

    let loading = false;

    async function loadNextPage() {
        if (loading) return;
        loading = true;

        let nextBtn = document.querySelector(".page.next");
        if (!nextBtn) return;

        let url = nextBtn.href;
        console.log("[JAVLibrary] Load:", url);

        let html = await fetchPage(url);
        if (!html) return;

        let doc = new DOMParser().parseFromString(html, "text/html");
        let items = doc.querySelectorAll(".video");

        if (items.length === 0) return;

        let container = document.querySelector(".videos");
        if (!container) return;

        items.forEach(el => container.appendChild(el));

        upgradeImages(container);

        let newNext = doc.querySelector(".page.next");
        if (newNext) {
            nextBtn.href = newNext.href;
        } else {
            nextBtn.remove();
        }

        loading = false;
    }

    function onScroll() {
        if (!location.hostname.includes("javlibrary")) return;
        if (loading) return;

        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500) {
            loadNextPage();
        }
    }

    window.addEventListener("scroll", onScroll);


    /* ============================================================
     * MutationObserver: re-upgrade JAVLibrary images if added
     * ============================================================ */
    if (location.hostname.includes("javlibrary")) {
        const observer = new MutationObserver(() => {
            upgradeImages();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    console.log("[Userscript] HD layout enabled on:", location.hostname);

})();

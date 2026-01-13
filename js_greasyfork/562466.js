// ==UserScript==
// @name         4d4y Image Enhancer
// @namespace    http://tampermonkey.net/
// @version      2026-01-12
// @description  Hi-PDA 大图爽爽看
// @author       屋大维 + ChatGPT
// @match        *://www.4d4y.com/*
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/lightgallery.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/plugins/thumbnail/lg-thumbnail.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/plugins/zoom/lg-zoom.umd.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562466/4d4y%20Image%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/562466/4d4y%20Image%20Enhancer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const LG_CSS_URL =
        "https://cdn.jsdelivr.net/npm/lightgallery@2.7.2/css/lightgallery-bundle.min.css";
    const LG_ROOT_ID = "codex-lightgallery-root";
    const ENHANCED_CLASS = "codex-enhanced-image";

    let galleryInstance = null;
    let galleryItems = [];
    let galleryImages = [];
    let galleryIndexBySrc = new Map();
    let rebuildTimer = null;
    let closeListenerBound = false;
    let slideListenerBound = false;
    let closeFallbackBound = false;
    let keyHandlerBound = false;
    let nativeKeyHandlersBound = false;
    let nativeKeyHandlers = null;

    function ensureGalleryCss() {
        if (document.getElementById("codex-lightgallery-css")) {
            return;
        }
        const link = document.createElement("link");
        link.id = "codex-lightgallery-css";
        link.rel = "stylesheet";
        link.href = LG_CSS_URL;
        document.head.appendChild(link);
    }

    function getGalleryRoot() {
        let root = document.getElementById(LG_ROOT_ID);
        if (!root) {
            root = document.createElement("div");
            root.id = LG_ROOT_ID;
            root.style.display = "none";
            document.body.appendChild(root);
        }
        return root;
    }

    function isGalleryOpen() {
        return (
            document.body.classList.contains("lg-on") ||
            document.documentElement.classList.contains("lg-on")
        );
    }

    function handleArrowKey(event) {
        if (!isGalleryOpen()) {
            return false;
        }
        const key = event.key;
        const keyCode = event.keyCode || event.which;
        const isArrow =
            key === "ArrowLeft" ||
            key === "ArrowRight" ||
            keyCode === 37 ||
            keyCode === 39;
        if (!isArrow) {
            return false;
        }
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.returnValue = false;
        if (galleryInstance) {
            if (key === "ArrowLeft" || keyCode === 37) {
                galleryInstance.goToPrevSlide();
            } else {
                galleryInstance.goToNextSlide();
            }
        }
        return true;
    }

    function ensureKeyHandler() {
        if (keyHandlerBound) {
            return;
        }
        const handler = (event) => {
            handleArrowKey(event);
        };
        document.addEventListener("keydown", handler, true);
        document.addEventListener("keyup", handler, true);
        document.addEventListener("keypress", handler, true);
        window.addEventListener("keydown", handler, true);
        window.addEventListener("keyup", handler, true);
        window.addEventListener("keypress", handler, true);
        keyHandlerBound = true;
    }

    function ensureNativeKeyHandlers() {
        if (nativeKeyHandlersBound) {
            return;
        }
        nativeKeyHandlers = {
            documentKeydown: document.onkeydown,
            documentKeyup: document.onkeyup,
            documentKeypress: document.onkeypress,
            windowKeydown: window.onkeydown,
            windowKeyup: window.onkeyup,
            windowKeypress: window.onkeypress,
        };
        const nativeHandler = (event) => {
            if (handleArrowKey(event)) {
                return false;
            }
            return true;
        };
        document.onkeydown = nativeHandler;
        document.onkeyup = nativeHandler;
        document.onkeypress = nativeHandler;
        window.onkeydown = nativeHandler;
        window.onkeyup = nativeHandler;
        window.onkeypress = nativeHandler;
        nativeKeyHandlersBound = true;
    }

    function restoreNativeKeyHandlers() {
        if (!nativeKeyHandlersBound || !nativeKeyHandlers) {
            return;
        }
        document.onkeydown = nativeKeyHandlers.documentKeydown || null;
        document.onkeyup = nativeKeyHandlers.documentKeyup || null;
        document.onkeypress = nativeKeyHandlers.documentKeypress || null;
        window.onkeydown = nativeKeyHandlers.windowKeydown || null;
        window.onkeyup = nativeKeyHandlers.windowKeyup || null;
        window.onkeypress = nativeKeyHandlers.windowKeypress || null;
        nativeKeyHandlersBound = false;
    }

    function ensureCloseHandler() {
        if (closeListenerBound) {
            return;
        }
        const root = getGalleryRoot();
        root.addEventListener("lgAfterClose", () => {
            restoreNativeKeyHandlers();
        });
        closeListenerBound = true;
    }

    function ensureSlideHandler() {
        if (slideListenerBound) {
            return;
        }
        const root = getGalleryRoot();
        root.addEventListener("lgAfterSlide", () => { });
        slideListenerBound = true;
    }

    function ensureCloseFallback() {
        if (closeFallbackBound) {
            return;
        }
        document.addEventListener("lgAfterClose", () => { });
        closeFallbackBound = true;
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function rebuildGallery() {
        if (typeof window.lightGallery !== "function") {
            return;
        }

        const images = Array.from(
            document.querySelectorAll(`img.${ENHANCED_CLASS}`)
        );

        if (!images.length) {
            return;
        }

        const uniqueImages = [];
        const uniqueItems = [];
        const indexBySrc = new Map();

        images.forEach((img) => {
            const src = img.src;
            if (indexBySrc.has(src)) {
                return;
            }
            const index = uniqueImages.length;
            uniqueImages.push(img);
            uniqueItems.push({
                src,
                thumb: src,
                subHtml: img.alt ? `<div>${escapeHtml(img.alt)}</div>` : "",
            });
            indexBySrc.set(src, index);
        });

        galleryImages = uniqueImages;
        galleryItems = uniqueItems;
        galleryIndexBySrc = indexBySrc;

        if (galleryInstance) {
            galleryInstance.destroy(true);
        }

        galleryInstance = window.lightGallery(getGalleryRoot(), {
            dynamic: true,
            dynamicEl: galleryItems,
            plugins: [
                ...(window.lgThumbnail ? [window.lgThumbnail] : []),
                ...(window.lgZoom ? [window.lgZoom] : []),
            ],
            thumbnail: true,
            zoom: true,
            download: false,
            escKey: true,
            closable: true,
            showCloseIcon: true,
            counter: true,
            mode: "lg-fade",
            cssEasing: "linear",
            speed: 120,
        });
        ensureCloseHandler();
        ensureSlideHandler();
        ensureCloseFallback();
        ensureKeyHandler();
        ensureNativeKeyHandlers();
    }

    function scheduleRebuild() {
        if (rebuildTimer) {
            window.clearTimeout(rebuildTimer);
        }
        rebuildTimer = window.setTimeout(() => {
            rebuildTimer = null;
            rebuildGallery();
        }, 150);
    }

    function replaceImages() {
        const images = document.querySelectorAll("img");
        let changed = false;

        images.forEach((img) => {
            let src = img.src;

            if (
                src.toLowerCase().endsWith(".thumb.jpg") ||
                src.toLowerCase().endsWith(".thumb.png")
            ) {
                let newSrc = src.replace(/\.thumb\.(jpg|png)$/i, "");
                if (img.src !== newSrc) {
                    img.src = newSrc;
                    changed = true;
                }

                // 限制最大宽度和最大高度
                img.style.maxWidth = "min(600px, 50vw)";
                img.style.maxHeight = "min(800px, 90vh)";
                img.style.height = "auto";
                img.style.width = "auto";

                if (!img.classList.contains(ENHANCED_CLASS)) {
                    img.classList.add(ENHANCED_CLASS);
                    changed = true;
                }

                if (img.onclick) {
                    img.onclick = null;
                    changed = true;
                }
                if (img.getAttribute("onclick")) {
                    img.removeAttribute("onclick");
                    changed = true;
                }

                if (!img.dataset.lgBound) {
                    img.dataset.lgBound = "1";
                    img.style.cursor = "zoom-in";
                    img.addEventListener("click", (event) => {
                        event.preventDefault();
                        const index =
                            galleryIndexBySrc.get(img.src) ??
                            galleryImages.indexOf(img);
                        if (!galleryInstance || index === -1) {
                            rebuildGallery();
                        }
                        const freshIndex =
                            galleryIndexBySrc.get(img.src) ??
                            galleryImages.indexOf(img);
                        if (galleryInstance && freshIndex !== -1) {
                            galleryInstance.openGallery(freshIndex);
                        }
                    });
                }
            }
        });

        if (changed) {
            scheduleRebuild();
        }
    }

    const observer = new MutationObserver(() => {
        replaceImages();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    ensureGalleryCss();
    window.addEventListener("load", replaceImages);
})();

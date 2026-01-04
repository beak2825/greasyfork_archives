// ==UserScript==
// @name         Ultra FPS Booster (Brutal Mode)
// @namespace    ultra-fps-booster
// @version      1.0.0
// @description  Aggressively strips effects, ads, and clutter to free CPU/GPU and make browser games more responsive.
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559413/Ultra%20FPS%20Booster%20%28Brutal%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559413/Ultra%20FPS%20Booster%20%28Brutal%20Mode%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // -------------------------------
    // 1. Inject brutal performance CSS
    // -------------------------------

    function injectPerformanceCSS() {
        try {
            const css = `
                /* Kill most animations and transitions */
                * {
                    animation: none !important;
                    transition: none !important;
                }

                /* Remove heavy visual effects */
                * {
                    box-shadow: none !important;
                    text-shadow: none !important;
                    filter: none !important;
                    backdrop-filter: none !important;
                }

                /* Simplify backgrounds */
                body, html {
                    background-image: none !important;
                }

                /* Don't touch <canvas> and <video> contents directly */
                canvas, video {
                    image-rendering: auto !important;
                }
            `;

            const style = document.createElement("style");
            style.id = "ultra-fps-booster-style";
            style.type = "text/css";
            style.appendChild(document.createTextNode(css));
            document.documentElement.appendChild(style);
        } catch (e) {
            // fail silently; script must stay cheap
        }
    }

    // Run as early as possible
    if (document.readyState === "loading") {
        injectPerformanceCSS();
    } else {
        injectPerformanceCSS();
    }

    // -------------------------------
    // 2. Stop autoplay media
    // -------------------------------

    function stopMediaAutoplay(root) {
        const media = (root || document).querySelectorAll("video, audio");
        media.forEach(el => {
            try {
                el.autoplay = false;
                el.loop = false;
                el.muted = true; // reduce CPU if audio decoding is heavy
                if (!el.paused) el.pause();
            } catch (e) {}
        });
    }

    // initial pass
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => stopMediaAutoplay(document), { once: true });
    } else {
        stopMediaAutoplay(document);
    }

    // watch for new media (cheap observer)
    const mediaObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (!m.addedNodes || !m.addedNodes.length) continue;
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches && (node.matches("video") || node.matches("audio"))) {
                    stopMediaAutoplay(node);
                } else if (node.querySelectorAll) {
                    stopMediaAutoplay(node);
                }
            });
        }
    });

    mediaObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // -------------------------------
    // 3. Remove obvious ads/embeds
    // -------------------------------

    const AD_SELECTOR = [
        '[id*="ad"]',
        '[class*="ad"]',
        '[id*="ads"]',
        '[class*="ads"]',
        '[id*="sponsor"]',
        '[class*="sponsor"]',
        '[id*="promo"]',
        '[class*="promo"]',
        '[id*="banner"]',
        '[class*="banner"]',
        'iframe[src*="doubleclick"]',
        'iframe[src*="googlesyndication"]',
        'iframe[src*="adservice"]',
        'iframe[src*="taboola"]',
        'iframe[src*="outbrain"]'
    ].join(",");

    function nukeAds(root) {
        const base = root || document;
        try {
            const ads = base.querySelectorAll(AD_SELECTOR);
            ads.forEach(el => {
                // Avoid killing <body> or <html> by accident
                if (el === document.body || el === document.documentElement) return;
                if (el.closest("body")) {
                    el.remove();
                }
            });
        } catch (e) {}
    }

    function nukeIframes(root) {
        const base = root || document;
        try {
            const iframes = base.querySelectorAll("iframe");
            iframes.forEach(iframe => {
                const src = (iframe.getAttribute("src") || "").toLowerCase();
                // Keep same-origin or blank iframes (often required), kill obvious third-party junk
                const isThirdParty =
                    src.startsWith("http") &&
                    !location.hostname.includes(new URL(src, location.href).hostname);
                if (isThirdParty && iframe.closest("body")) {
                    iframe.remove();
                }
            });
        } catch (e) {}
    }

    function initialClean() {
        nukeAds(document);
        nukeIframes(document);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialClean, { once: true });
    } else {
        initialClean();
    }

    const cleanObserver = new MutationObserver(mutations => {
        let shouldClean = false;
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length) {
                shouldClean = true;
                break;
            }
        }
        if (!shouldClean) return;

        // Throttle lightly by using requestIdleCallback / setTimeout
        if (typeof window.requestIdleCallback === "function") {
            requestIdleCallback(() => {
                nukeAds(document);
                nukeIframes(document);
            }, { timeout: 500 });
        } else {
            setTimeout(() => {
                nukeAds(document);
                nukeIframes(document);
            }, 200);
        }
    });

    cleanObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // -------------------------------
    // 4. Game focus: emphasize large canvas
    // -------------------------------

    function focusLargestCanvas() {
        try {
            const canvases = Array.from(document.querySelectorAll("canvas"));
            if (!canvases.length) return;

            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const viewportArea = vw * vh;

            let best = null;
            let bestArea = 0;

            canvases.forEach(c => {
                const rect = c.getBoundingClientRect();
                const area = rect.width * rect.height;
                if (area > bestArea) {
                    bestArea = area;
                    best = c;
                }
            });

            // Only treat as a "game canvas" if it’s reasonably large
            if (!best || bestArea < viewportArea * 0.25) return;

            const gameCanvas = best;
            const gameContainer = gameCanvas.closest("body") || document.body;

            // Hide non-essential siblings to reduce layout and paint
            Array.from(gameContainer.children).forEach(child => {
                if (child === gameCanvas || child.contains(gameCanvas)) return;
                // Don't hide <script> or <style> tags, just visual stuff
                if (child.tagName === "SCRIPT" || child.tagName === "STYLE") return;
                child.style.setProperty("display", "none", "important");
            });

            // Make the canvas fill available space without being too fancy
            const wrapper = document.createElement("div");
            wrapper.style.position = "fixed";
            wrapper.style.inset = "0";
            wrapper.style.margin = "0";
            wrapper.style.padding = "0";
            wrapper.style.background = "#000";
            wrapper.style.zIndex = "2147483647"; // top

            gameCanvas.style.display = "block";
            gameCanvas.style.margin = "auto";
            gameCanvas.style.maxWidth = "100%";
            gameCanvas.style.maxHeight = "100%";

            // Insert wrapper
            if (!gameCanvas.parentElement) return;
            gameCanvas.parentElement.insertBefore(wrapper, gameCanvas);
            wrapper.appendChild(gameCanvas);
        } catch (e) {}
    }

    function tryFocusGame() {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            focusLargestCanvas();
        } else {
            document.addEventListener("DOMContentLoaded", () => focusLargestCanvas(), { once: true });
        }
    }

    // Delay slightly so layout is somewhat stable
    setTimeout(tryFocusGame, 1000);

})();

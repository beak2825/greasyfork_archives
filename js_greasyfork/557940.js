// ==UserScript==
// @name         Fix Mangapark Image Loading Issue
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  Auto-loads images from the main host to bypass CDN issues. Click "PICK" to manually change servers.
// @match        https://mangapark.io/title/*-ch-*
// @match        https://mangapark.io/title/*-chapter-*
// @match        https://mangapark.io/title/*-oneshot
// @match        https://mangapark.io/title/*-oneshot
// @match        https://mangapark.io/title/*-prologue
// @match        https://mangapark.net/title/*-ch-*
// @match        https://mangapark.net/title/*-chapter-*
// @match        https://mangapark.net/title/*-oneshot
// @match        https://mangapark.net/title/*-prologue
// @match        https://mangapark.net/title/*-volume-*
// @match        https://mangapark.to/title/*-ch-*
// @match        https://mangapark.to/title/*-chapter-*
// @match        https://mangapark.to/title/*-oneshot
// @match        https://mangapark.to/title/*-prologue
// @match        https://mangapark.to/title/*-volume-*
// @match        https://mpark.to/title/*-ch-*
// @match        https://mpark.to/title/*-chapter-*
// @match        https://mpark.to/title/*-oneshot
// @match        https://mpark.to/title/*-prologue
// @match        https://mpark.to/title/*-volume-*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557940/Fix%20Mangapark%20Image%20Loading%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/557940/Fix%20Mangapark%20Image%20Loading%20Issue.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent script from running multiple times
    if (window.__mpFixInitialized) return;
    window.__mpFixInitialized = true;

    // Configuration
    const CONFIG = {
        CDN_SERVERS: [
            "s01", "s02", "s03", "s04",
            "s05", "s06", "s07", "s08", "s09", "s10"
        ],
        BUTTON_TEXT: "PICK",
        BUTTON_POSITION: {
            top: "20px",
            right: "70px"
        }
    };

    // Regex to detect the problematic CDN subdomains (s00-s10)
    const SUBDOMAIN_REGEX = /(https?:)?\/\/s(\d{2})\./i;

    let pickerMode = false;
    let currentHover = null;

    /**
     * Generates a "Fixed" URL using the current page's host.
     * This mimics the logic of the working script you provided.
     */
    function getMainHostUrl(originalSrc) {
        try {
            const url = new URL(originalSrc);
            // Replace the CDN host with the current page's host
            return `https://${window.location.host}${url.pathname}`;
        } catch (e) {
            return originalSrc;
        }
    }

    /**
     * Check if a URL is a candidate for fixing (s00-s10 pattern)
     */
    function isSupportedImage(url) {
        return SUBDOMAIN_REGEX.test(url);
    }

    /**
     * Get next CDN server (fallback logic)
     */
    function getNextCDN(currentSrc, retryCount) {
        const match = currentSrc.match(SUBDOMAIN_REGEX);
        if (!match) return currentSrc;

        const currentServerNum = match[2]; // e.g., "04"
        let currentIndex = parseInt(currentServerNum, 10) - 1;
        if (currentIndex < 0 || currentIndex > 9) currentIndex = 0;

        const nextIndex = (currentIndex + 1 + retryCount) % CONFIG.CDN_SERVERS.length;
        return CONFIG.CDN_SERVERS[nextIndex]; // Returns "s05"
    }

    /**
     * Handle image loading errors.
     * Strategy 1: Try Main Host (if not already tried).
     * Strategy 2: Fallback to cycling CDNs.
     */
    function handleImageError(img) {
        const retryCount = Number(img.dataset.retryCount || "0");
        const originalSrc = img.src;

        if (!isSupportedImage(originalSrc) && !img.dataset.isMainHost) {
            // If we can't handle it, give up
            return;
        }

        // Step 1: If we haven't tried the Main Host fix yet, DO IT.
        if (!img.dataset.triedMainHost) {
            const newSrc = getMainHostUrl(originalSrc);
            if (newSrc !== originalSrc) {
                console.warn(`[MainHost Fix] Replacing: ${originalSrc.substring(0, 50)}...`);
                img.dataset.triedMainHost = "true";
                img.dataset.isMainHost = "true";
                img.src = '';
                setTimeout(() => { img.src = newSrc; }, 100);
                return;
            }
        }

        // Step 2: If Main Host failed or wasn't applicable, cycle CDNs
        if (retryCount < 9) {
            const nextServerPrefix = getNextCDN(originalSrc, retryCount);
            const newSrc = originalSrc.replace(SUBDOMAIN_REGEX, (match, protocol, oldNum) => {
                return (protocol || 'https:') + '//' + nextServerPrefix + '.';
            });

            console.warn(`[CDN Cycle] Attempt ${retryCount + 1}: ${nextServerPrefix}`);
            img.dataset.retryCount = String(retryCount + 1);
            img.src = '';
            setTimeout(() => { img.src = newSrc; }, 100);
        } else {
            console.error(`✗ All retries exhausted for: ${originalSrc}`);
            img.dataset.failed = "true";
            img.style.border = "2px solid red";
            img.title = "Failed to load from all sources";
        }
    }

    /**
     * Set up error handling
     */
    function setupImageErrorHandler(img) {
        if (img.dataset.mpHandlerAttached) return;
        img.dataset.mpHandlerAttached = "true";

        img.addEventListener('error', () => handleImageError(img));
        img.addEventListener('load', () => {
            delete img.dataset.failed;
            if (!img.dataset.isMainHost) {
                // If it loaded successfully from a CDN, we keep it.
                // If it loaded from Main Host, we keep it.
            }
        });
    }

    /**
     * Initializes a single image element.
     * Now performs proactive fixing based on the working script logic.
     */
    function initializeImage(img) {
        // Only process images matching the bad CDN pattern
        if (!isSupportedImage(img.src)) return;

        if (img.dataset.mpFixed) return;

        console.log(`[AutoFix] Found target: ${img.src.substring(0, 50)}...`);

        // --- PROACTIVE FIX LOGIC (From the working script) ---
        // Immediately replace the CDN URL with the Main Host URL.
        const newSrc = getMainHostUrl(img.src);

        if (img.src !== newSrc) {
            console.log(`[AutoFix] Switching to Main Host: ${newSrc.substring(0, 50)}...`);
            img.src = newSrc;
            img.dataset.isMainHost = "true"; // Mark it so we know it's the "fixed" version
        }
        // ------------------------------------------------------

        setupImageErrorHandler(img);
        img.dataset.mpFixed = "true";
    }

    /**
     * Find and initialize all images already present.
     */
    function initializeExistingImages() {
        const allImages = document.querySelectorAll('img[src]');
        allImages.forEach(img => {
            if (isSupportedImage(img.src)) {
                initializeImage(img);
            }
        });
    }

    /**
     * Observe the DOM for lazy-loaded images
     */
    function observeForChanges() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'IMG' && isSupportedImage(node.src)) {
                                initializeImage(node);
                            } else if (node.querySelectorAll) {
                                const images = node.querySelectorAll('img');
                                images.forEach(img => {
                                    if (isSupportedImage(img.src)) initializeImage(img);
                                });
                            }
                        }
                    }
                }
            }
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // --- Picker Mode Functions ---

    function enablePickerMode() {
        pickerMode = true;
        document.body.style.cursor = "crosshair";
    }

    function disablePickerMode() {
        pickerMode = false;
        document.body.style.cursor = "default";
        if (currentHover) {
            currentHover.style.outline = "";
            currentHover = null;
        }
    }

    function togglePicker() {
        pickerMode ? disablePickerMode() : enablePickerMode();
    }

    function highlight(img) {
        if (currentHover && currentHover !== img) currentHover.style.outline = "";
        currentHover = img;
        img.style.outline = "3px solid #ff5500";
    }

    function unhighlight(img) {
        img.style.outline = "";
        if (currentHover === img) currentHover = null;
    }

    function changeImagePrefix(img) {
        const original = img.src;

        // Check if it matches our regex
        const match = original.match(SUBDOMAIN_REGEX);
        const isMainHost = img.dataset.isMainHost === "true";

        let currentVal = "";
        if (isMainHost) {
            currentVal = "Main Host (Auto-Fixed)";
        } else if (match) {
            currentVal = match[0]; // e.g. "//s04."
        } else {
            alert("URL does not match a fixable pattern.");
            return;
        }

        // Prompt user for input
        // We allow: "s01".."s10", or empty to reset to Main Host
        const input = prompt(`Current: ${currentVal}\n\nEnter new server (e.g. s05) or leave empty for Main Host fix:`);

        if (input === null) return; // Cancelled

        let newSrc = "";

        if (input.trim() === "") {
            // User wants Main Host Fix
            newSrc = getMainHostUrl(original);
            img.dataset.isMainHost = "true";
        } else {
            // User wants specific Server
            const serverName = input.trim().toLowerCase();
            // Basic validation
            if (!/^s\d{2}$/.test(serverName)) {
                alert("Invalid format. Use s01, s05, etc.");
                return;
            }

            // If currently on Main Host, we don't have the original CDN URL structure handy easily
            // unless we saved it. For now, if on Main Host, we can't easily switch back to a specific
            // CDN server without knowing the original CDN domain (mpypl, mpqsc, etc).
            // However, usually the pathname is enough if we assume a domain, but the domains vary.

            if (isMainHost) {
                alert("Cannot switch to specific server from Main Host fix easily (original CDN domain unknown). Refresh the page to try CDNs.");
                return;
            }

            const protocol = match[1] || 'https:';
            newSrc = original.replace(SUBDOMAIN_REGEX, `${protocol}//${serverName}.`);
            img.dataset.isMainHost = "";
        }

        img.src = newSrc;
        img.dataset.retryCount = "0"; // Reset retry counter
        console.log("Manual update:", original, "->", img.src);
        disablePickerMode();
    }

    function bindPickerEvents() {
        document.addEventListener("mouseover", e => {
            if (!pickerMode || e.target.tagName !== "IMG") return;
            // Highlight any image, even if not strictly supported, to allow inspection
            highlight(e.target);
        });

        document.addEventListener("mouseout", e => {
            if (!pickerMode || e.target.tagName !== "IMG") return;
            unhighlight(e.target);
        });

        document.addEventListener("click", e => {
            if (!pickerMode || e.target.tagName !== "IMG") return;
            e.preventDefault();
            e.stopPropagation();
            changeImagePrefix(e.target);
            disablePickerMode();
        }, true);
    }

    function createPickerButton() {
        if (!document.body) return;
        if (document.getElementById('mp-fix-btn')) return;

        const btn = document.createElement("button");
        btn.id = 'mp-fix-btn';
        btn.textContent = CONFIG.BUTTON_TEXT;
        btn.style.cssText = `
            position: fixed;
            top: ${CONFIG.BUTTON_POSITION.top};
            right: ${CONFIG.BUTTON_POSITION.right};
            z-index: 9999;
            padding: 8px 12px;
            background: #66ccff;
            border: 1px solid #333;
            cursor: pointer;
            font-weight: bold;
        `;
        btn.onclick = togglePicker;
        document.body.appendChild(btn);
    }

    // Main initialization flow
    function main() {
        if (!document.body) {
            setTimeout(main, 100);
            return;
        }

        initializeExistingImages();
        observeForChanges();
        bindPickerEvents();
        createPickerButton();
    }

    // Start the script
    main();

})();
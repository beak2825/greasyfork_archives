// ==UserScript==
// @name         Grok Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  The image downloader for Grok.com. Features: Hybrid Shift-Zoom (Instant/Delayed), Native UI integration, High-Performance Async Metadata injection (prevents UI freeze), Universal Scroll Fix, and "Emerald" status indicators.
// @author       You
// @match        https://grok.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grok.com
// @require      https://unpkg.com/piexifjs@1.0.6/piexif.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559610/Grok%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/559610/Grok%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * ==================================================================================
     * SECTION 1: CONFIGURATION & GLOBAL STATE
     * ==================================================================================
     * Keeps track of the script's active state to manage interactions between
     * the Zoom Overlay, Keyboard shortcuts, and Mouse movements.
     */
    const STATE = {
        isZoomModeActive: false, // Is the "Shift" mode currently active?
        shiftTimer: null,        // Timer for the 1-second delay when typing
        isUiHidden: false,       // Toggle state for F2 (Hide UI)
        mouseX: 0,               // Current mouse X coordinate (tracked globally)
        mouseY: 0,               // Current mouse Y coordinate (tracked globally)
        currentZoomSource: null, // The HTML element currently being zoomed
        hideTimeout: null,       // Timer for hysteresis (smooth hiding) of zoom
        downloadedUrls: new Set()// Cache of downloaded URLs to prevent duplicate processing
    };

    /**
     * NATIVE GROK BUTTON CLASSES
     * Copied directly from the website's source to ensure 100% visual consistency.
     * Contains Tailwind CSS classes for shape, color, hover states, and transitions.
     */
    const NATIVE_BTN_CLASS = "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-100 [&_svg]:shrink-0 select-none rounded-full overflow-hidden h-10 w-10 p-2 bg-black/25 hover:bg-white/10 border border-white/15 border-opacity-10";

    /**
     * ==================================================================================
     * SECTION 2: CSS STYLES & ANIMATIONS
     * ==================================================================================
     * Injected directly into the document head.
     * Strategy: Use CSS for hover states (performance) instead of JS event listeners.
     */
    const style = document.createElement('style');
    style.innerHTML = `
        /* --- CONTAINER VISIBILITY --- */
        /* By default, custom buttons are invisible to avoid visual clutter. */
        .grok-btn-container {
            opacity: 0;
            transition: opacity 0.1s ease-out; /* Fast transition for responsiveness */
            pointer-events: none; /* Prevent clicks when invisible */
        }
        /* Show buttons ONLY when hovering over the image card. GPU accelerated. */
        [role="listitem"]:hover .grok-btn-container {
            opacity: 1 !important;
            pointer-events: auto;
        }
        /* F2 Toggle: Completely remove buttons from layout */
        .grok-hide-ui .grok-btn-container { display: none !important; }

        /* --- ANIMATIONS --- */
        /* "Mechanical" click effect: rapid shrink and color pulse */
        .grok-btn-click { animation: simpleClick 0.2s ease-out forwards; }
        @keyframes simpleClick {
            0% { transform: scale(1); }
            50% { transform: scale(0.85); border-color: #4ade80; } /* Flash Green border */
            100% { transform: scale(1); }
        }

        /* "Ice Glow" zoom effect: slight pulsation when zoom opens */
        .grok-zoom-anim { animation: zoomIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @keyframes zoomIn {
            0% { transform: scale(1); }
            50% { transform: scale(0.96); }
            100% { transform: scale(1); }
        }

        /* --- EMERALD DESIGN SYSTEM (Downloaded State) --- */
        
        /* 1. Permanent Badge (Bottom-Right Corner) */
        .grok-native-badge {
            position: absolute; bottom: 0.5rem; right: 0.5rem; z-index: 20;
            display: inline-flex; align-items: center; justify-content: center;
            width: 2.5rem; height: 2.5rem; border-radius: 9999px; padding: 0.5rem;
            pointer-events: none; transition: opacity 0.1s; opacity: 1;
            
            /* Emerald Style: Dark Green Translucent Background */
            background-color: rgba(2, 44, 34, 0.75) !important; 
            border: 1px solid rgba(74, 222, 128, 0.4) !important;
            color: #4ade80 !important; /* Bright Green Icon */
            box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important;
        }
        /* Hide badge on hover so it doesn't overlap with action buttons */
        [role="listitem"]:hover .grok-native-badge { opacity: 0; }
        
        /* 2. Menu Button State (When downloaded) */
        .grok-downloaded-state {
            background-color: rgba(2, 44, 34, 0.75) !important;
            border: 1px solid rgba(74, 222, 128, 0.4) !important;
            color: #4ade80 !important;
            opacity: 1 !important;
        }
        .grok-downloaded-state:hover {
            background-color: rgba(6, 78, 59, 0.85) !important;
            border-color: rgba(74, 222, 128, 0.6) !important;
        }
    `;
    document.head.appendChild(style);

    /**
     * ==================================================================================
     * SECTION 3: DOM HELPERS & IMAGE DETECTION
     * ==================================================================================
     */

    /**
     * Finds the most relevant image within a container (Masonry Item).
     * Filters out small icons (avatars) based on width.
     */
    const findBestImage = (container) => {
        if (!container) return null;
        const imgs = container.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i];
            // Filter: Ignore images smaller than 50px (likely avatars or UI icons)
            if (img.naturalWidth > 50 || img.width > 50) return img;
        }
        return imgs[0] || null; // Fallback
    };

    /**
     * Returns the image element currently under the mouse cursor.
     * Uses the globally tracked mouseX/Y coordinates.
     */
    const getImageUnderCursor = (e) => {
        // Optimization: Use event target if available (faster than elementsFromPoint)
        if (e && e.target) {
            const item = e.target.closest('[role="listitem"]');
            if (item) return { item, img: findBestImage(item) };
        }
        // Fallback for keydown events where target is not the image
        const elements = document.elementsFromPoint(STATE.mouseX, STATE.mouseY);
        for (let i = 0; i < elements.length; i++) {
            const item = elements[i].closest('[role="listitem"]');
            if (item) return { item, img: findBestImage(item) };
        }
        return null;
    };

    /**
     * Checks if the user is currently typing in an input field.
     * Used to prevent Shift-Zoom from triggering while typing text.
     */
    const isTyping = () => {
        const el = document.activeElement;
        return (el && (
            el.tagName === 'INPUT' || 
            el.tagName === 'TEXTAREA' || 
            el.isContentEditable || 
            el.getAttribute('contenteditable') === 'true'
        ));
    };

    /**
     * ==================================================================================
     * SECTION 4: METADATA ENGINE (PERFORMANCE OPTIMIZED)
     * ==================================================================================
     */

    const generateFilename = () => {
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        return `Grok Image - ${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}.jpg`;
    };

    /**
     * Encodes string to Windows-1251 byte array.
     * Essential for FastStone Image Viewer compatibility in the COM segment.
     * Replaces unsupported characters (emojis) with '?'.
     */
    const toWin1251 = (str) => {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code < 128) bytes.push(code); // ASCII
            else if (code >= 0x0410 && code <= 0x044F) bytes.push(code - 0x0350); // Cyrillic range
            else if (code === 0x0401) bytes.push(0xA8); // Yo
            else if (code === 0x0451) bytes.push(0xB8); // yo
            else bytes.push(63); // '?' for unknown
        }
        return new Uint8Array(bytes);
    };

    /**
     * Injects Metadata into the JPG Blob.
     * Strategy:
     * 1. EXIF (XPComment): Encoded in UTF-16LE. Supports Emojis & Russian. (For Windows Explorer)
     * 2. COM Segment: Encoded in Win1251. (For FastStone Image Viewer)
     * 
     * PERFORMANCE NOTE: Uses `fetch()` to convert Base64 to Blob/ArrayBuffer.
     * This offloads processing to the browser's C++ engine, avoiding JS loop freezes.
     */
    const injectMetadata = async (base64String, prompt) => {
        const cleanPrompt = prompt ? prompt.trim() : "";
        const exifObj = { "0th": {}, "Exif": {}, "GPS": {}, "1st": {}, "thumbnail": null };

        if (cleanPrompt) {
            // 1. Prepare XPComment (UTF-16LE)
            const xpBytes = [];
            for (let i = 0; i < cleanPrompt.length; i++) {
                const code = cleanPrompt.charCodeAt(i);
                xpBytes.push(code & 0xFF, (code >> 8) & 0xFF);
            }
            xpBytes.push(0, 0); // Null terminator
            exifObj['0th'][0x9C9C] = xpBytes; // 0x9C9C is XPComment tag
            
            // Optional: ImageDescription (standard UTF-8)
            try { exifObj['0th'][piexif.ImageIFD.ImageDescription] = unescape(encodeURIComponent(cleanPrompt)); } catch (e) {}
        }

        // Insert EXIF into Base64 string
        let newBase64 = base64String;
        try { 
            newBase64 = piexif.insert(piexif.dump(exifObj), base64String); 
        } catch (e) { 
            // Fallback: If EXIF fails, download original
            const res = await fetch(base64String);
            return await res.blob();
        }

        // ASYNC CONVERSION: Base64 string -> ArrayBuffer
        // This is the key optimization to prevent UI lag on large images.
        const res = await fetch(newBase64);
        const arrayBuffer = await res.arrayBuffer();
        const fileBytes = new Uint8Array(arrayBuffer);

        if (!cleanPrompt) return new Blob([fileBytes], { type: 'image/jpeg' });

        // 2. Prepare COM Segment (Win1251)
        const commentBytes = toWin1251(cleanPrompt);
        const totalLen = 2 + commentBytes.length;
        const comSegment = new Uint8Array(4 + commentBytes.length);
        comSegment[0] = 0xFF;
        comSegment[1] = 0xFE; // COM Marker
        comSegment[2] = (totalLen >> 8) & 0xFF;
        comSegment[3] = totalLen & 0xFF;
        comSegment.set(commentBytes, 4);

        // Splice COM segment into the binary data (after SOI marker)
        const finalBytes = new Uint8Array(fileBytes.length + comSegment.length);
        finalBytes[0] = 0xFF;
        finalBytes[1] = 0xD8; // SOI Marker
        finalBytes.set(comSegment, 2);
        finalBytes.set(fileBytes.subarray(2), 2 + comSegment.length);

        return new Blob([finalBytes], { type: 'image/jpeg' });
    };

    /**
     * Downloads the image helper function.
     * Fetches the image blob, converts to DataURL, injects metadata, returns Blob.
     */
    const createProcessedImage = async (imgSrc, prompt) => {
        try {
            let base64Data = "";
            if (imgSrc.startsWith('data:')) {
                base64Data = imgSrc;
            } else {
                const resp = await fetch(imgSrc);
                const blob = await resp.blob();
                base64Data = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            }
            return await injectMetadata(base64Data, prompt);
        } catch (e) {
            console.error("DL Error", e);
            const r = await fetch(imgSrc); // Fallback to raw download
            return await r.blob();
        }
    };

    // Scrapes the prompt text from the Masonry Section
    const getPromptForSection = (section) => {
        if (!section) return "";
        // Cache mechanism: if we already found the prompt, use it.
        if (section.dataset.promptFrozen) return section.dataset.promptText;
        
        const promptDiv = section.querySelector('div');
        let prompt = promptDiv?.innerText?.trim() || '';
        
        // Sometimes prompt is in a textarea (when editing)
        if (!prompt) {
            const textArea = promptDiv?.querySelector('textarea');
            prompt = textArea?.textContent?.trim() || '';
        }
        
        if (prompt) {
            section.dataset.promptFrozen = 'true';
            section.dataset.promptText = prompt;
        }
        return prompt;
    };

    /**
     * ==================================================================================
     * SECTION 5: UI & ZOOM LOGIC
     * ==================================================================================
     */

    // Updates the visual state of the card (Green Checkmark)
    const updateCardAsDownloaded = (item, imgUrl) => {
        const SVG_CHECK = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="size-4"><polyline points="20 6 9 17 4 12"/></svg>`;
        if (imgUrl) STATE.downloadedUrls.add(imgUrl);

        // 1. Update the Download Button in the hover menu
        const dlBtn = item.querySelector('.grok-dl-btn');
        if (dlBtn) {
            if (!dlBtn.classList.contains('grok-downloaded-state')) {
                dlBtn.classList.add('grok-downloaded-state'); 
                dlBtn.innerHTML = SVG_CHECK;
            }
        }

        // 2. Add the Permanent Badge (bottom-right)
        if (!item.querySelector('.grok-native-badge')) {
            const badge = document.createElement('div');
            badge.className = 'grok-native-badge';
            badge.innerHTML = SVG_CHECK;
            
            // Ensure positioning context
            const computedStyle = window.getComputedStyle(item);
            if (computedStyle.position === 'static') item.style.position = 'relative';
            item.appendChild(badge);
        }
    };

    // Creates the Fullscreen Zoom Overlay
    const createZoomOverlay = () => {
        const overlay = document.createElement('div');
        overlay.id = 'grok-turbo-zoom';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            display: none; align-items: center; justify-content: center;
            z-index: 20000; pointer-events: none;
        `;
        const img = document.createElement('img');
        img.style.cssText = `
            display: block; width: auto; height: auto;
            max-width: 98vw; max-height: 98vh;
            object-fit: contain; border-radius: 4px;
            box-shadow: 0 0 40px rgba(0,0,0,1);
            transform-origin: center center;
            will-change: transform;
        `;
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        return { overlay, img };
    };
    const { overlay: zoomOverlay, img: zoomImage } = createZoomOverlay();

    const showZoom = (src, item) => {
        if (STATE.hideTimeout) {
            clearTimeout(STATE.hideTimeout);
            STATE.hideTimeout = null;
        }
        if (zoomImage.src !== src) zoomImage.src = src;
        zoomOverlay.style.display = 'flex';
        STATE.currentZoomSource = item;
    };

    const hideZoom = (instant = false) => {
        if (instant) {
            // Immediate close (e.g., releasing Shift)
            if (STATE.hideTimeout) clearTimeout(STATE.hideTimeout);
            zoomOverlay.style.display = 'none';
            STATE.currentZoomSource = null;
        } else {
            // Hysteresis delay (e.g., moving mouse between images)
            if (STATE.hideTimeout) return;
            STATE.hideTimeout = setTimeout(() => {
                zoomOverlay.style.display = 'none';
                STATE.currentZoomSource = null;
                STATE.hideTimeout = null;
            }, 150);
        }
    };

    // Main Download Trigger
    const performDownload = async (item, fromZoom = false) => {
        const bestImg = findBestImage(item);
        if (!bestImg) return;

        // Visual Feedback: Zoom squeeze effect
        if (fromZoom) {
            zoomImage.classList.remove('grok-zoom-anim');
            void zoomImage.offsetWidth;
            zoomImage.classList.add('grok-zoom-anim');
            setTimeout(() => { zoomImage.classList.remove('grok-zoom-anim'); }, 300);
        }

        // Visual Feedback: Button click animation
        const dlBtn = item.querySelector('.grok-dl-btn');
        if (dlBtn) {
            dlBtn.classList.remove('grok-btn-click');
            void dlBtn.offsetWidth;
            dlBtn.classList.add('grok-btn-click');
        }

        // Yield to UI thread to allow animation to render before heavy processing
        await new Promise(r => setTimeout(r, 0));

        const section = item.closest('[id^="imagine-masonry-section-"]');
        const prompt = getPromptForSection(section);

        try {
            const finalBlob = await createProcessedImage(bestImg.src, prompt);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(finalBlob);
            link.download = generateFilename();
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            updateCardAsDownloaded(item, bestImg.src);
        } catch (e) {
            console.error("Download Failed", e);
        }
    };

    /**
     * ==================================================================================
     * SECTION 6: EVENT LISTENERS & SCROLL FIX
     * ==================================================================================
     */

    // Helper: Find the actual scrollable container (since window scroll might be disabled)
    const findScrollParent = (node) => {
        if (!node) return null;
        if (node === document.body || node === document.documentElement) return window;
        const overflowY = window.getComputedStyle(node).overflowY;
        const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
        if (isScrollable && node.scrollHeight > node.clientHeight) return node;
        return findScrollParent(node.parentElement);
    };

    // SCROLL FIX: Solves the issue where Shift+Wheel causes horizontal scroll.
    document.addEventListener('wheel', (e) => {
        if (!STATE.isZoomModeActive) return;
        
        // 1. Stop default horizontal scrolling
        e.preventDefault();
        e.stopImmediatePropagation();

        // 2. Get scroll amount (Shift swaps X and Y axes in browsers)
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        if (delta === 0) return;

        // 3. Manually scroll the correct container vertically
        const scrollTarget = findScrollParent(e.target);
        if (scrollTarget === window) {
            window.scrollBy({ top: delta, behavior: 'auto' });
        } else if (scrollTarget) {
            scrollTarget.scrollTop += delta;
        }
    }, { passive: false, capture: true }); // Capture phase to intercept early

    // Updates zoom when mouse moves (Shift mode)
    const updateZoomKeyMode = (e) => {
        if (!STATE.isZoomModeActive) return;
        
        const target = getImageUnderCursor(e);
        if (target && target.img) {
            // Ignore tiny data-uri placeholders
            if (target.img.src.length < 100 && target.img.src.startsWith('data:')) return;
            showZoom(target.img.src, target.item);
        } else {
            hideZoom(false); // Smooth hide
        }
    };

    document.addEventListener('mousemove', (e) => {
        STATE.mouseX = e.clientX;
        STATE.mouseY = e.clientY;
        if (STATE.isZoomModeActive) updateZoomKeyMode(e);
    });

    document.addEventListener('keydown', (e) => {
        // Spacebar Logic
        if (e.code === 'Space') {
            // If Zoom is active (either via Shift or Eye Button hover)
            if (zoomOverlay.style.display !== 'none' && STATE.currentZoomSource) {
                e.preventDefault(); // Stop scrolling/typing space
                e.stopImmediatePropagation();
                e.stopPropagation();
                performDownload(STATE.currentZoomSource, true);
                return;
            }
        }

        // Shift Logic
        if (e.key === 'Shift') {
            if (e.repeat) return; // Ignore auto-repeat

            if (!isTyping()) {
                // NOT Typing: Instant activation
                STATE.isZoomModeActive = true;
                const mockEvent = { target: document.elementFromPoint(STATE.mouseX, STATE.mouseY) };
                updateZoomKeyMode(mockEvent);
            } else {
                // Typing: Delay activation by 1s (Protection against accidental triggers)
                STATE.shiftTimer = setTimeout(() => {
                    STATE.isZoomModeActive = true;
                    const mockEvent = { target: document.elementFromPoint(STATE.mouseX, STATE.mouseY) };
                    updateZoomKeyMode(mockEvent);
                }, 1000);
            }
        }

        // F2 Logic (Hide UI)
        if (e.code === 'F2') {
            e.preventDefault();
            STATE.isUiHidden = !STATE.isUiHidden;
            document.body.classList.toggle('grok-hide-ui', STATE.isUiHidden);
        }
    }, true);

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') {
            if (STATE.shiftTimer) {
                clearTimeout(STATE.shiftTimer);
                STATE.shiftTimer = null;
            }
            STATE.isZoomModeActive = false;
            hideZoom(true); // Instant hide on release
        }
    });

    window.addEventListener('blur', () => {
        if (STATE.shiftTimer) clearTimeout(STATE.shiftTimer);
        STATE.isZoomModeActive = false;
        hideZoom(true);
    });

    /**
     * ==================================================================================
     * SECTION 7: DOM OBSERVER (INFINITE SCROLL)
     * ==================================================================================
     */
    let observerTimeout;
    const observerCallback = () => {
        if (observerTimeout) return;
        observerTimeout = requestAnimationFrame(() => {
            processItems();
            observerTimeout = null;
        });
    };

    const processItems = () => {
        const items = document.querySelectorAll('[id^="imagine-masonry-section-"] [role="listitem"]');

        items.forEach(item => {
            // Check if already processed
            if (item.dataset.grokScriptProcessed) {
                // Only check if we need to update "Downloaded" status
                const bestImg = findBestImage(item);
                if (bestImg && STATE.downloadedUrls.has(bestImg.src)) {
                    if (!item.querySelector('.grok-native-badge')) {
                        updateCardAsDownloaded(item, null);
                    }
                }
                return;
            }

            const buttonContainer = item.querySelector('.absolute.bottom-2.right-2.flex.flex-row.gap-2');
            if (!buttonContainer) return;

            item.dataset.grokScriptProcessed = 'true';
            buttonContainer.classList.add('grok-btn-container'); // Add class for CSS hover logic

            // 1. Create Zoom Button (Eye)
            const zoomBtn = document.createElement('button');
            zoomBtn.className = NATIVE_BTN_CLASS;
            zoomBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 text-white"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
            
            let eyeHoverTimer = null;
            zoomBtn.onmouseenter = () => {
                // Slight delay to prevent flashing when accidentally moving mouse over
                eyeHoverTimer = setTimeout(() => {
                    const bestImg = findBestImage(item);
                    if (bestImg) showZoom(bestImg.src, item);
                }, 120);
            };
            zoomBtn.onmouseleave = () => {
                if (eyeHoverTimer) clearTimeout(eyeHoverTimer);
                if (!STATE.isZoomModeActive) hideZoom(true);
            };

            // 2. Create Download Button
            const dlPhotoBtn = document.createElement('button');
            dlPhotoBtn.className = NATIVE_BTN_CLASS + ' grok-dl-btn';
            dlPhotoBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-4 text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
            
            const img = findBestImage(item);
            if (img && STATE.downloadedUrls.has(img.src)) updateCardAsDownloaded(item, null);

            dlPhotoBtn.onclick = async (e) => {
                e.stopPropagation();
                dlPhotoBtn.blur();
                if (dlPhotoBtn.classList.contains('grok-downloaded-state')) return;
                performDownload(item, false);
            };

            // Insert Buttons: [Download] [Eye] [Original Buttons...]
            buttonContainer.insertBefore(dlPhotoBtn, buttonContainer.firstChild);
            buttonContainer.insertBefore(zoomBtn, dlPhotoBtn);
        });

        // Add prompt listeners to text areas
        document.querySelectorAll('[id^="imagine-masonry-section-"]').forEach(section => {
            if (section.dataset.promptListenerAdded) return;
            section.dataset.promptListenerAdded = 'true';
            const promptDiv = section.querySelector('div');
            if (promptDiv) promptDiv.addEventListener('click', () => {
                getPromptForSection(section);
            });
        });
    };

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });

})();
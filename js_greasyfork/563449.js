// ==UserScript==
// @name         Image Search
// @namespace    https://greasyfork.org/en/users/1462137-piknockyou
// @version      4.4
// @author       Piknockyou (vibe-coded)
// @license      AGPL-3.0
// @description  Single floating button opens image gallery. Click Copyseeker or Yandex icon on each tile to search. Middle-click opens image in new tab. Double-click button to hide temporarily. Supports clipboard images and drag-drop onto button.
// @match        *://*/*
// @match        file:///*
// @icon         https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@latest/color/svg/1F5BC.svg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563449/Image%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/563449/Image%20Search.meta.js
// ==/UserScript==

/*
==================================================================================================
Ultimate Reverse Image Search Toolbox
==================================================================================================

▶ WHAT THIS SCRIPT DOES (in one sentence):
    A tiny floating button that instantly opens a full-screen gallery of ALL images on the current page
    (including hidden/lazy-loaded ones), plus clipboard/dropped images — with one-click or middle-click
    reverse search on Copyseeker.net or Yandex Images.

▶ CORE FEATURES & INTERACTIONS

1. Floating Button (bottom-left corner)
   • Single click          → Open full-screen image picker gallery
   • Double click (<350ms) → Temporarily hide button for 5 seconds (great for screenshots)
   • Hover                 → Button becomes fully visible + slight scale
   • Drag & drop image     → Directly adds it to the gallery (supports files + URLs from other tabs)
   • Green flash           → Confirms successful drop or paste

2. Image Picker Gallery (grid view)
   • Shows every detectable image on the page (including background-images, <picture>, Google Images real URLs, etc.)
   • User-provided images (clipboard / dropped) appear first with special badges
   • Ctrl + V inside gallery → Instantly paste new image from clipboard (adds new tile)
   • Esc → Close gallery

3. Each Image Tile – Click Actions

   ┌─────────────────────────────────────────────────────────────┐
   │  Left-click on tile (anywhere except icons)                 │ → Opens original image in new foreground tab
   │  Middle-click on tile (anywhere except icons)               │ → Opens original image in new background tab
   │                                                             │
   │  Copyseeker icon (bottom-left)                              │
   │    • Left-click    → Search with Copyseeker (foreground tab)│
   │    • Middle-click  → Search with Copyseeker (background tab)│
   │    • Grayed + red slash → Base64/clipboard image → NOT supported by Copyseeker
   │                                                             │
   │  Yandex icon (bottom-right)                                 │
   │    • Left-click    → Search with Yandex (foreground tab)    │
   │    • Middle-click  → Search with Yandex (background tab)    │
   │    • Works with BOTH real URLs and base64/clipboard images  │
   └─────────────────────────────────────────────────────────────┘

4. Smart Image Detection
   • Extracts REAL image URLs on Google Images (bypasses encrypted-tbn0 base64 thumbnails)
   • Handles lazy-loaded images (data-src, data-lazy-src, etc.)
   • Background images via CSS
   • <picture><source>, <svg><image>, video posters
   • Deep iframe/frame support (where allowed)

5. Clipboard & Paste Support
   • When gallery is open → Ctrl+V pastes image directly into gallery
   • When gallery is closed → clipboard image is auto-detected on button click
   • Works in Firefox, Chrome, Edge (modern Clipboard API)

6. Drag & Drop Support
   • Drop image file → adds to gallery
   • Drop image from another browser tab → extracts URL or blob
   • Visual feedback (button grows + glows blue)

7. Automatic Injection on Target Sites
   • Copyseeker.net → Auto-fills the URL field and clicks search (if launched via this script)
   • Yandex Images    → For base64/clipboard images: auto-clicks camera → uploads file automatically

▶ LIMITATIONS & KNOWN BEHAVIORS

   Copyseeker.net
      ✗ Does NOT accept base64/dataURL images → tile will show red prohibition icon
      ✓ Only works with real HTTP/HTTPS image URLs

   Yandex Images
      ✓ Accepts everything: real URLs, base64, clipboard, dropped files
      ✓ Automatic upload for base64 images when opened via this script

   Google Images
      ✓ Always tries to extract the original full-resolution URL (not the thumbnail)
      ✓ Works even on the new infinite-scroll layout

   Sites with heavy anti-scraping / shadow DOM (e.g. Twitter/X, some CDNs)
      → May not detect all images (best effort)

==================================================================================================
*/

(function () {
    'use strict';

    const HIDE_DURATION = 5000;
    let overlayOpen = false;

    // User-provided images (clipboard + drag-drop)
    let clipboardImageDataUrl = null;
    let droppedImageDataUrl = null;

    // Reference to the floating button and overlay for external access
    let floatingBtn = null;
    let currentOverlay = null;
    let currentCloseOverlayFn = null;

    // === HELPERS ===

    function isBase64Url(url) {
        return url && typeof url === 'string' && url.startsWith('data:');
    }

    function blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read blob'));
            reader.readAsDataURL(blob);
        });
    }

    // Clipboard images are handled via Ctrl+V paste only (no auto-read to avoid permission prompts)
    async function readClipboardImage() {
        return null;
    }

    function flashButtonSuccess() {
        if (!floatingBtn || !floatingBtn.flash) return;
        floatingBtn.flash();
    }

    function isGoogleImages() {
        return window.location.hostname.includes('google.') &&
               (window.location.pathname.includes('/search') ||
                window.location.pathname.includes('/images'));
    }

    // Extract real image URL from Google Images - returns the actual URL, not base64
    function extractGoogleImageUrl(imgElement) {
        if (!imgElement) return null;

        const dataAttrs = ['data-src', 'data-iurl', 'data-origin'];
        for (const attr of dataAttrs) {
            const val = imgElement.getAttribute(attr);
            if (val && val.startsWith('http')) return val;
        }

        let parent = imgElement.parentElement;
        for (let i = 0; i < 10 && parent; i++) {
            if (parent.tagName === 'A') {
                const href = parent.href;
                if (href && href.includes('imgurl=')) {
                    const match = href.match(/imgurl=([^&]+)/);
                    if (match) return decodeURIComponent(match[1]);
                }
            }

            for (const attr of dataAttrs) {
                const val = parent.getAttribute(attr);
                if (val && val.startsWith('http')) return val;
            }

            const tbnid = parent.getAttribute('data-tbnid') || parent.getAttribute('data-id');
            if (tbnid) {
                const nearbyLinks = parent.querySelectorAll('a[href*="imgurl="]');
                for (const link of nearbyLinks) {
                    const match = link.href.match(/imgurl=([^&]+)/);
                    if (match) return decodeURIComponent(match[1]);
                }
            }

            parent = parent.parentElement;
        }

        const imgId = imgElement.id || imgElement.getAttribute('data-iid');
        if (imgId) {
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                if (script.textContent && script.textContent.includes(imgId)) {
                    const urlMatch = script.textContent.match(/"(https?:\/\/[^"]+(?:\.jpg|\.jpeg|\.png|\.gif|\.webp)[^"]*)"/gi);
                    if (urlMatch) {
                        for (const match of urlMatch) {
                            const url = match.replace(/"/g, '');
                            if (!url.includes('google.com') && !url.includes('gstatic.com')) {
                                return url;
                            }
                        }
                    }
                }
            }
        }

        const sidePanel = document.querySelector('[data-ow], [jsname="CGzTgf"]');
        if (sidePanel) {
            const fullImg = sidePanel.querySelector('img[src^="http"]');
            if (fullImg && !fullImg.src.includes('encrypted-tbn')) {
                return fullImg.src;
            }
        }

        return null;
    }

    // For Google Images: Try to find the real URL from embedded JSON data
    function findRealUrlInGoogleScripts(base64Src) {
        if (!isGoogleImages()) return null;

        try {
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                const text = script.textContent;
                if (!text || text.length < 100) continue;

                // Look for arrays that might contain both the base64 and real URL
                // Google often stores [base64, width, height, realUrl] or similar patterns
                const urlPattern = /"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp|bmp)[^"]*)"/gi;
                let match;
                const urls = [];

                while ((match = urlPattern.exec(text)) !== null) {
                    const url = match[1];
                    if (!url.includes('encrypted-tbn') &&
                        !url.includes('gstatic.com') &&
                        !url.includes('google.com/url') &&
                        !url.includes('googleusercontent') &&
                        url.startsWith('http')) {
                        urls.push(url);
                    }
                }

                if (urls.length > 0) {
                    // Return the first valid URL found
                    return urls[0];
                }
            }
        } catch (e) {
            console.log('[Image Search] Error searching Google scripts:', e);
        }

        return null;
    }

    // Get image URLs - for Google Images, always try to get real URL instead of base64
    function getImageUrls(imgElement) {
        if (!imgElement) return { display: '', search: '' };

        let displayUrl = '';
        let searchUrl = '';

        try {
            if (imgElement.srcset) {
                const sources = imgElement.srcset.split(',').map(src => src.trim().split(' '));
                const highResSource = sources.reduce((best, current) => {
                    const descriptor = current[1] || '1x';
                    const bestDescriptor = best[1] || '1x';
                    return parseFloat(descriptor) > parseFloat(bestDescriptor) ? current : best;
                }, sources[0]);
                displayUrl = highResSource[0];
            } else {
                displayUrl = imgElement.src;
            }

            searchUrl = displayUrl;

            // For Google Images: If we have base64, try to find the real URL
            if (isGoogleImages()) {
                const realUrl = extractGoogleImageUrl(imgElement);
                if (realUrl && realUrl.startsWith('http')) {
                    // Use real URL for BOTH display and search on Google Images
                    displayUrl = realUrl;
                    searchUrl = realUrl;
                    return { display: displayUrl, search: searchUrl };
                }
            }

            // For other sites: If base64, try to find a real URL
            if (isBase64Url(displayUrl)) {
                const attrs = ['data-src', 'data-iurl', 'data-origin', 'data-lazy-src'];
                for (const attr of attrs) {
                    const val = imgElement.getAttribute(attr);
                    if (val && val.startsWith('http')) {
                        searchUrl = val;
                        displayUrl = val; // Also update display URL if we found a real one
                        break;
                    }
                }
            }

        } catch (e) {
            displayUrl = imgElement.src || '';
            searchUrl = displayUrl;
        }

        return { display: displayUrl, search: searchUrl };
    }

    function triggerCopyseekerSearch(url) {
        if (!url) return;

        if (isBase64Url(url)) {
            console.warn('[Image Search] Copyseeker does not support base64 images');
            return;
        }

        try {
            GM_setValue("cs_image_url", url);
            GM_openInTab("https://copyseeker.net", { active: true });
        } catch (e) {
            console.error('[Image Search] Copyseeker search failed:', e);
        }
    }

    function triggerCopyseekerSearchSilent(url) {
        if (!url) return;

        if (isBase64Url(url)) {
            console.warn('[Image Search] Copyseeker does not support base64 images');
            return;
        }

        try {
            GM_setValue("cs_image_url", url);
            GM_openInTab("https://copyseeker.net", { active: false });
        } catch (e) {
            console.error('[Image Search] Copyseeker search failed:', e);
        }
    }

    function triggerYandexSearch(url) {
        if (!url) return;

        if (isBase64Url(url)) {
            console.log('[Image Search] Base64 image - opening Yandex with upload');
            GM_setValue("yandex_image_base64", url);
            GM_openInTab("https://yandex.com/images/", { active: true });
        } else {
            try {
                const yandexUrl = `https://yandex.com/images/search?url=${encodeURIComponent(url)}&rpt=imageview`;
                GM_openInTab(yandexUrl, { active: true });
            } catch (e) {
                console.error('[Image Search] Yandex search failed:', e);
            }
        }
    }

    function triggerYandexSearchSilent(url) {
        if (!url) return;

        if (isBase64Url(url)) {
            console.log('[Image Search] Base64 image - opening Yandex with upload (silent)');
            GM_setValue("yandex_image_base64", url);
            GM_openInTab("https://yandex.com/images/", { active: false });
        } else {
            try {
                const yandexUrl = `https://yandex.com/images/search?url=${encodeURIComponent(url)}&rpt=imageview`;
                GM_openInTab(yandexUrl, { active: false });
            } catch (e) {
                console.error('[Image Search] Yandex search failed:', e);
            }
        }
    }

    function collectAllImages(doc, imageMap = new Map()) {
        const addImage = (displayUrl, searchUrl, element) => {
            if (!displayUrl || typeof displayUrl !== 'string') return;

            if (displayUrl.startsWith('//')) displayUrl = window.location.protocol + displayUrl;
            if (searchUrl && searchUrl.startsWith('//')) searchUrl = window.location.protocol + searchUrl;

            // Skip base64 images on Google Images if we can't find a real URL
            // They're not useful for searching anyway
            if (isGoogleImages() && isBase64Url(displayUrl) && isBase64Url(searchUrl)) {
                return;
            }

            if (displayUrl.startsWith('http') || displayUrl.startsWith('data:')) {
                if (!imageMap.has(displayUrl)) {
                    imageMap.set(displayUrl, {
                        display: displayUrl,
                        search: searchUrl || displayUrl,
                        element: element
                    });
                }
            }
        };

        try {
            doc.querySelectorAll('img').forEach(img => {
                const urls = getImageUrls(img);
                if (urls.display) {
                    addImage(urls.display, urls.search, img);
                }
            });

            doc.querySelectorAll('picture source').forEach(source => {
                if (source.srcset) {
                    source.srcset.split(',').forEach(part => {
                        const url = part.trim().split(' ')[0];
                        addImage(url, url, source);
                    });
                }
            });

            doc.querySelectorAll('svg image').forEach(img => {
                const url = img.getAttribute('href') || img.getAttribute('xlink:href');
                addImage(url, url, img);
            });

            doc.querySelectorAll('video[poster]').forEach(video => {
                addImage(video.poster, video.poster, video);
            });

            doc.querySelectorAll('*').forEach(el => {
                try {
                    const style = window.getComputedStyle(el);
                    if (style.backgroundImage && style.backgroundImage !== 'none') {
                        const match = style.backgroundImage.match(/url\(["']?(.*?)["']?\)/i);
                        if (match) addImage(match[1], match[1], el);
                    }
                } catch (e) {}
            });

            // Google Images specific: Extract URLs from page scripts
            if (isGoogleImages()) {
                extractGoogleImagesFromScripts(doc, imageMap);
            }

            doc.querySelectorAll('iframe, frame').forEach(frame => {
                try {
                    const frameDoc = frame.contentDocument || frame.contentWindow.document;
                    if (frameDoc) collectAllImages(frameDoc, imageMap);
                } catch (e) {}
            });
        } catch (e) {
            console.error('[Image Search] collectAllImages error:', e);
        }

        return imageMap;
    }

    function extractGoogleImagesFromScripts(doc, imageMap) {
        try {
            const scripts = doc.querySelectorAll('script');

            for (const script of scripts) {
                const text = script.textContent;
                if (!text || text.length < 100) continue;

                const urlPattern = /\["(https?:\/\/[^"]+\.(?:jpg|jpeg|png|gif|webp|bmp)[^"]*)"/gi;
                let match;

                while ((match = urlPattern.exec(text)) !== null) {
                    const url = match[1];
                    if (!url.includes('encrypted-tbn') &&
                        !url.includes('gstatic.com') &&
                        !url.includes('google.com/url') &&
                        !url.includes('googleusercontent')) {
                        if (!imageMap.has(url)) {
                            imageMap.set(url, {
                                display: url,
                                search: url,
                                element: null
                            });
                        }
                    }
                }
            }
        } catch (e) {
            console.error('[Image Search] extractGoogleImagesFromScripts error:', e);
        }
    }

    // Add a pasted image tile to the overlay
    function addPastedImageToOverlay(dataUrl) {
        if (!currentOverlay || !overlayOpen) return;

        // Check if this image is already in the overlay
        const existingTiles = currentOverlay.querySelectorAll('[data-image-url]');
        for (const tile of existingTiles) {
            if (tile.getAttribute('data-image-url') === dataUrl) {
                console.log('[Image Search] Image already in picker');
                // Flash the existing tile
                tile.style.transition = 'all 0.3s';
                tile.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.8)';
                setTimeout(() => {
                    tile.style.boxShadow = '';
                }, 500);
                return;
            }
        }

        // Create new tile and insert at the beginning
        const tile = createImageTile(dataUrl, dataUrl, '📋 Pasted', currentCloseOverlayFn, true);
        tile.setAttribute('data-image-url', dataUrl);

        // Insert at the beginning of the overlay
        if (currentOverlay.firstChild) {
            currentOverlay.insertBefore(tile, currentOverlay.firstChild);
        } else {
            currentOverlay.appendChild(tile);
        }

        // Flash effect to show it was added
        tile.style.transition = 'all 0.3s';
        tile.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.8)';
        setTimeout(() => {
            tile.style.boxShadow = '0 0 15px rgba(0, 170, 255, 0.3)';
        }, 500);

        console.log('[Image Search] Pasted image added to picker');
    }

    // === CREATE IMAGE TILE (unified for all images) ===
    function createImageTile(imageUrl, searchUrl, label, closeOverlayFn, isUserProvided = false) {
        const isBase64 = isBase64Url(searchUrl);
        const copyseekerDisabled = isBase64;

        const container = document.createElement('div');
        container.setAttribute('data-image-url', imageUrl);
        Object.assign(container.style, {
            position: 'relative',
            background: isUserProvided ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : '#222',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: isUserProvided ? '2px solid #00aaff' : (isBase64 ? '2px solid #664400' : '2px solid #444'),
            borderRadius: isUserProvided ? '8px' : '4px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            boxShadow: isUserProvided ? '0 0 15px rgba(0, 170, 255, 0.3)' : 'none'
        });

        // Label badge for user-provided images
        if (isUserProvided && label) {
            const badge = document.createElement('div');
            Object.assign(badge.style, {
                position: 'absolute',
                top: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #00aaff, #00ff88)',
                color: '#000',
                padding: '3px 10px',
                borderRadius: '10px',
                fontSize: '10px',
                fontWeight: 'bold',
                zIndex: '10',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                whiteSpace: 'nowrap'
            });
            badge.textContent = label;
            container.appendChild(badge);
        }

        // Base64 indicator
        if (isBase64) {
            const warning = document.createElement('div');
            warning.title = 'Base64 image - Yandex only (Copyseeker not supported)';
            Object.assign(warning.style, {
                position: 'absolute',
                top: isUserProvided ? '28px' : '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(255, 150, 0, 0.9)',
                color: '#000',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '9px',
                fontWeight: 'bold',
                zIndex: '5',
                whiteSpace: 'nowrap'
            });
            warning.textContent = 'BASE64 - Yandex Only';
            container.appendChild(warning);
        }

        // Thumbnail - use a wrapper to allow context menu on the image
        const imgWrapper = document.createElement('a');
        imgWrapper.href = imageUrl;
        imgWrapper.target = '_blank';
        imgWrapper.style.display = 'contents'; // Makes wrapper invisible but functional
        imgWrapper.onclick = (e) => e.preventDefault(); // Prevent left-click navigation

        const img = document.createElement('img');
        img.src = imageUrl;
        Object.assign(img.style, {
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            display: 'block'
        });
        imgWrapper.appendChild(img);
        container.appendChild(imgWrapper);

        // Copyseeker icon (bottom-left)
        const csIcon = document.createElement('div');
        Object.assign(csIcon.style, {
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            width: '28px',
            height: '28px',
            background: copyseekerDisabled ? '#666' : '#fff',
            borderRadius: '4px',
            padding: '3px',
            opacity: '0',
            transition: 'opacity 0.2s, transform 0.1s',
            cursor: copyseekerDisabled ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            zIndex: '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
        });

        if (copyseekerDisabled) {
            csIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#cc0000" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
            `;
            csIcon.title = "⛔ Copyseeker does not support base64/clipboard/dropped images";
        } else {
            const csImg = document.createElement('img');
            csImg.src = "https://www.google.com/s2/favicons?sz=32&domain=copyseeker.net";
            csImg.style.width = '22px';
            csImg.style.height = '22px';
            csIcon.appendChild(csImg);
            csIcon.title = "Left-click: Search with Copyseeker\nMiddle-click: Search silently";
        }

        csIcon.onmouseenter = () => {
            if (!copyseekerDisabled) {
                csIcon.style.transform = 'scale(1.15)';
            }
        };
        csIcon.onmouseleave = () => {
            csIcon.style.transform = 'scale(1)';
        };

        if (!copyseekerDisabled) {
            csIcon.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                closeOverlayFn();
                triggerCopyseekerSearch(searchUrl);
            };
            csIcon.addEventListener('mousedown', (e) => {
                if (e.button === 1) {
                    e.preventDefault();
                    e.stopPropagation();
                    triggerCopyseekerSearchSilent(searchUrl);
                }
            });
        } else {
            csIcon.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
            };
        }
        container.appendChild(csIcon);

        // Yandex icon (bottom-right)
        const yxIcon = document.createElement('div');
        Object.assign(yxIcon.style, {
            position: 'absolute',
            bottom: '5px',
            right: '5px',
            width: '28px',
            height: '28px',
            background: '#fff',
            borderRadius: '4px',
            padding: '3px',
            opacity: '0',
            transition: 'opacity 0.2s, transform 0.1s',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
            zIndex: '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box'
        });

        const yxImg = document.createElement('img');
        yxImg.src = "https://www.google.com/s2/favicons?sz=32&domain=yandex.com";
        yxImg.style.width = '22px';
        yxImg.style.height = '22px';
        yxIcon.appendChild(yxImg);
        yxIcon.title = "Left-click: Search with Yandex\nMiddle-click: Search silently";

        yxIcon.onmouseenter = () => { yxIcon.style.transform = 'scale(1.15)'; };
        yxIcon.onmouseleave = () => { yxIcon.style.transform = 'scale(1)'; };

        yxIcon.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            closeOverlayFn();
            triggerYandexSearch(searchUrl);
        };
        yxIcon.addEventListener('mousedown', (e) => {
            if (e.button === 1) {
                e.preventDefault();
                e.stopPropagation();
                triggerYandexSearchSilent(searchUrl);
            }
        });
        container.appendChild(yxIcon);

        // Hover effects
        container.onmouseenter = () => {
            if (isUserProvided) {
                container.style.borderColor = '#00ff88';
                container.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
            } else {
                container.style.borderColor = isBase64 ? '#ffaa00' : '#00aaff';
                container.style.boxShadow = isBase64 ?
                    '0 0 10px rgba(255,170,0,0.6)' :
                    '0 0 10px rgba(0,170,255,0.6)';
            }
            csIcon.style.opacity = '1';
            yxIcon.style.opacity = '1';
        };
        container.onmouseleave = () => {
            if (isUserProvided) {
                container.style.borderColor = '#00aaff';
                container.style.boxShadow = '0 0 15px rgba(0, 170, 255, 0.3)';
            } else {
                container.style.borderColor = isBase64 ? '#664400' : '#444';
                container.style.boxShadow = 'none';
            }
            csIcon.style.opacity = '0';
            yxIcon.style.opacity = '0';
        };

        // Track if we already handled this click to prevent double-firing
        let middleClickHandled = false;

        // Middle-click on container (not on icons) opens image in new tab silently
        container.addEventListener('mousedown', (e) => {
            if (e.button === 1) {
                if (csIcon.contains(e.target) || yxIcon.contains(e.target)) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                if (!middleClickHandled) {
                    middleClickHandled = true;
                    GM_openInTab(imageUrl, { active: false });
                    // Reset after a short delay
                    setTimeout(() => { middleClickHandled = false; }, 100);
                }
            }
        });

        // Prevent middle-click from firing again on mouseup or auxclick
        container.addEventListener('auxclick', (e) => {
            if (e.button === 1) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // Left-click on container (not on icons) opens image in new tab focused
        container.addEventListener('click', (e) => {
            if (csIcon.contains(e.target) || yxIcon.contains(e.target)) {
                return;
            }
            // Check if it's actually a left click (button 0)
            if (e.button === 0) {
                e.preventDefault();
                e.stopPropagation();
                GM_openInTab(imageUrl, { active: true });
            }
        });

        return container;
    }

    // === IMAGE PICKER ===
    async function showImagePicker() {
        if (overlayOpen) return;
        overlayOpen = true;

        // Try to read clipboard image
        try {
            clipboardImageDataUrl = await readClipboardImage();
            if (clipboardImageDataUrl) {
                console.log('[Image Search] Clipboard image loaded successfully');
            }
        } catch (e) {
            console.log('[Image Search] Clipboard read error:', e);
            clipboardImageDataUrl = null;
        }

        let imageMap = new Map();
        try {
            imageMap = collectAllImages(document);
        } catch (e) {
            imageMap = new Map();
        }

        let images = Array.from(imageMap.values());

        // Sort: prioritize non-base64 images
        images.sort((a, b) => {
            const aIsBase64 = isBase64Url(a.search);
            const bIsBase64 = isBase64Url(b.search);
            if (aIsBase64 && !bIsBase64) return 1;
            if (!aIsBase64 && bIsBase64) return -1;
            return 0;
        });

        // Fallback
        if (!images.length) {
            const firstImg = document.querySelector('img');
            if (firstImg) {
                const urls = getImageUrls(firstImg);
                if (urls.display) {
                    images = [{ display: urls.display, search: urls.search }];
                }
            }
        }

        const hasUserImages = droppedImageDataUrl || clipboardImageDataUrl;
        if (!images.length && !hasUserImages) {
            console.log('[Image Search] No images found');
            overlayOpen = false;
            return;
        }

        const overlay = document.createElement('div');
        currentOverlay = overlay;
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            zIndex: '999999',
            overflow: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gridAutoRows: '150px',
            padding: '10px',
            gap: '5px',
            boxSizing: 'border-box'
        });

        // Add hint for Ctrl+V
        const hint = document.createElement('div');
        Object.assign(hint.style, {
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 170, 255, 0.8)',
            color: '#fff',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: '1000000',
            pointerEvents: 'none',
            opacity: '0.8'
        });
        hint.textContent = '💡 Press Ctrl+V to paste image from clipboard';
        overlay.appendChild(hint);

        // Fade out hint after 5 seconds
        setTimeout(() => {
            hint.style.transition = 'opacity 1s';
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 1000);
        }, 5000);

        function closeOverlay() {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            overlayOpen = false;
            currentOverlay = null;
            currentCloseOverlayFn = null;
            document.removeEventListener('keydown', keyHandler, true);
            document.removeEventListener('paste', pasteHandler, true);

            droppedImageDataUrl = null;
        }

        currentCloseOverlayFn = closeOverlay;

        // Handle Escape and Ctrl+V
        async function keyHandler(ev) {
            if (ev.key === 'Escape') {
                ev.preventDefault();
                ev.stopPropagation();
                closeOverlay();
            }
        }

        // Handle paste events (Ctrl+V)
        async function pasteHandler(ev) {
            if (!overlayOpen) return;

            const items = ev.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    ev.preventDefault();
                    ev.stopPropagation();

                    const blob = item.getAsFile();
                    if (blob) {
                        try {
                            const dataUrl = await blobToDataUrl(blob);
                            addPastedImageToOverlay(dataUrl);
                        } catch (err) {
                            console.error('[Image Search] Failed to process pasted image:', err);
                        }
                    }
                    return;
                }
            }

            // Also check files
            const files = ev.clipboardData?.files;
            if (files && files.length > 0) {
                for (const file of files) {
                    if (file.type.startsWith('image/')) {
                        ev.preventDefault();
                        ev.stopPropagation();

                        try {
                            const dataUrl = await blobToDataUrl(file);
                            addPastedImageToOverlay(dataUrl);
                        } catch (err) {
                            console.error('[Image Search] Failed to process pasted file:', err);
                        }
                        return;
                    }
                }
            }
        }

        document.addEventListener('keydown', keyHandler, true);
        document.addEventListener('paste', pasteHandler, true);

        // Click on overlay background closes it
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });

        // === ADD USER-PROVIDED IMAGES AT THE BEGINNING (TOP-LEFT) ===
        if (droppedImageDataUrl) {
            const tile = createImageTile(droppedImageDataUrl, droppedImageDataUrl, '📁 Dropped', closeOverlay, true);
            overlay.appendChild(tile);
        }

        if (clipboardImageDataUrl) {
            const tile = createImageTile(clipboardImageDataUrl, clipboardImageDataUrl, '📋 Clipboard', closeOverlay, true);
            overlay.appendChild(tile);
        }

        // === ADD PAGE IMAGES ===
        images.forEach((imageData) => {
            const tile = createImageTile(imageData.display, imageData.search, null, closeOverlay, false);
            overlay.appendChild(tile);
        });

        document.body.appendChild(overlay);
    }

    // === COPYSEEKER AUTO-PASTE ===
    if (window.location.hostname.includes("copyseeker.net")) {
        window.addEventListener("load", function () {
            let imageUrl = '';
            try {
                imageUrl = GM_getValue("cs_image_url", "");
            } catch (e) {
                return;
            }
            if (!imageUrl) return;

            if (isBase64Url(imageUrl)) {
                console.log('[Image Search] Copyseeker: Ignoring base64 image');
                try { GM_setValue("cs_image_url", ""); } catch (e) {}
                return;
            }

            let tries = 0;
            const maxTries = 30;

            function pasteAndCheck() {
                const input = document.getElementById("url");
                const button = document.querySelector(".search-button");

                if (!input || !button) {
                    if (tries++ < maxTries) return setTimeout(pasteAndCheck, 100);
                    return;
                }

                if (input.value !== imageUrl) {
                    try { GM_setValue("cs_image_url", ""); } catch (e) {}
                    const nativeSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLInputElement.prototype, "value"
                    ).set;
                    nativeSetter.call(input, imageUrl);
                    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
                }

                setTimeout(() => {
                    if (input.value === imageUrl) {
                        ["mousedown", "mouseup", "click"].forEach(type =>
                            button.dispatchEvent(new MouseEvent(type, { bubbles: true }))
                        );
                    } else if (tries++ < maxTries) {
                        setTimeout(pasteAndCheck, 100);
                    }
                }, 200);
            }
            pasteAndCheck();
        });
    }

    // === YANDEX AUTO-UPLOAD FOR BASE64 IMAGES ===
    if (window.location.hostname.includes("yandex.com") && window.location.pathname.includes("/images")) {
        window.addEventListener("load", function () {
            let base64Image = '';
            try {
                base64Image = GM_getValue("yandex_image_base64", "");
            } catch (e) {
                return;
            }
            if (!base64Image || !base64Image.startsWith('data:image')) return;

            try { GM_setValue("yandex_image_base64", ""); } catch (e) {}

            console.log('[Image Search] Yandex: Attempting to upload base64 image');

            let tries = 0;
            const maxTries = 50;

            function tryUpload() {
                // Look for camera/upload button with multiple selectors
                const cameraButton = document.querySelector('[data-bem*="image-search"]') ||
                                    document.querySelector('.input__cbir-button') ||
                                    document.querySelector('[class*="cbir"]') ||
                                    document.querySelector('button[class*="camera"]') ||
                                    document.querySelector('.input__button_type_cbir') ||
                                    document.querySelector('[class*="ImageSearchButton"]') ||
                                    document.querySelector('button[aria-label*="image"]') ||
                                    document.querySelector('button[aria-label*="Image"]') ||
                                    document.querySelector('.search3__button_type_camera');

                if (cameraButton) {
                    console.log('[Image Search] Found camera button, clicking...');
                    cameraButton.click();

                    setTimeout(() => {
                        attemptFileUpload();
                    }, 800);
                } else if (tries++ < maxTries) {
                    setTimeout(tryUpload, 200);
                } else {
                    console.log('[Image Search] Camera button not found, trying direct upload');
                    attemptFileUpload();
                }
            }

            function attemptFileUpload() {
                // Convert base64 to File
                const byteString = atob(base64Image.split(',')[1]);
                const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeType });
                const file = new File([blob], 'image.' + (mimeType.split('/')[1] || 'png'), { type: mimeType });

                // Find file input - try multiple selectors
                let fileInput = document.querySelector('input[type="file"][accept*="image"]') ||
                               document.querySelector('input[type="file"]');

                // If not found, look in the entire document including shadow DOMs
                if (!fileInput) {
                    const allInputs = document.querySelectorAll('input[type="file"]');
                    for (const input of allInputs) {
                        fileInput = input;
                        break;
                    }
                }

                if (fileInput) {
                    console.log('[Image Search] Found file input, uploading...');

                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;

                    // Trigger all possible events
                    ['input', 'change'].forEach(eventType => {
                        fileInput.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
                    });

                    console.log('[Image Search] File uploaded to Yandex');
                } else {
                    console.log('[Image Search] No file input found, trying drag-drop simulation');
                    tryDragDropUpload(file);
                }
            }

            function tryDragDropUpload(file) {
                // Try to find a drop zone
                const dropZone = document.querySelector('[class*="drop"]') ||
                                document.querySelector('[class*="upload"]') ||
                                document.querySelector('.cbir-panel') ||
                                document.body;

                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                const dropEvent = new DragEvent('drop', {
                    bubbles: true,
                    cancelable: true,
                    dataTransfer: dataTransfer
                });

                dropZone.dispatchEvent(dropEvent);
                console.log('[Image Search] Attempted drag-drop upload on Yandex');
            }

            setTimeout(tryUpload, 500);
        });
    }

    // === SINGLE FLOATING BUTTON ===
    function addFloatingButton() {
        if (!document.body) return;

        //================================================================================
        // BUTTON CONFIGURATION
        //================================================================================

        const CONFIG = {
            button: {
                size: 24,

                iconStyle: {
                    shadow: {
                        enabled: true,
                        blur: 2,
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    background: {
                        enabled: true,
                        color: 'rgba(128, 128, 128, 0.25)',
                        borderRadius: '50%'
                    }
                },

                position: {
                    vertical: 'bottom',
                    horizontal: 'left',
                    offsetX: 1,
                    offsetY: 1
                },

                opacity: {
                    default: 0.15,
                    hover: 1
                },

                scale: {
                    default: 1,
                    hover: 1.1,
                    dragHover: 1.5
                },

                transition: 'opacity 0.3s, transform 0.2s, background 0.3s, box-shadow 0.3s',
                zIndex: 2147483647
            },

            colors: {
                dragHover: {
                    background: 'rgba(0, 170, 255, 0.9)',
                    boxShadow: '0 0 25px rgba(0, 170, 255, 0.8)'
                },
                success: {
                    background: 'rgba(0, 255, 136, 0.9)',
                    boxShadow: '0 0 15px rgba(0, 255, 136, 0.8)'
                }
            },

            timing: {
                doubleClickThreshold: 350,
                singleClickDelay: 300,
                hideTemporarilyDuration: 5000,
                feedbackDuration: 500
            }
        };

        //================================================================================
        // SVG NAMESPACE
        //================================================================================

        const SVG_NS = 'http://www.w3.org/2000/svg';

        function createSvgElement(tag, attributes = {}) {
            const el = document.createElementNS(SVG_NS, tag);
            for (const [key, value] of Object.entries(attributes)) {
                el.setAttribute(key, value);
            }
            return el;
        }

        //================================================================================
        // STYLES FOR SHADOW DOM
        //================================================================================

        function getStyles() {
            const cfg = CONFIG.button;
            const pos = cfg.position;
            const iconSize = cfg.size - 4;

            return `
                :host {
                    all: initial;
                }

                * {
                    box-sizing: border-box;
                    user-select: none !important;
                    -webkit-user-select: none !important;
                }

                .is-container {
                    position: fixed;
                    ${pos.vertical}: ${pos.offsetY}px;
                    ${pos.horizontal}: ${pos.offsetX}px;
                    z-index: ${cfg.zIndex};
                    pointer-events: auto;
                }

                .is-container.hidden {
                    display: none !important;
                }

                .is-btn {
                    position: relative;
                    width: ${cfg.size}px;
                    height: ${cfg.size}px;
                    background: transparent;
                    border: none;
                    border-radius: 0;
                    cursor: pointer;
                    opacity: ${cfg.opacity.default};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: ${cfg.transition};
                    padding: 0;
                    margin: 0;
                    transform: scale(${cfg.scale.default});
                    pointer-events: auto;
                    touch-action: manipulation;
                }

                .is-btn.hover {
                    opacity: ${cfg.opacity.hover};
                    transform: scale(${cfg.scale.hover});
                }

                .is-btn.drag-hover {
                    opacity: ${cfg.opacity.hover};
                    transform: scale(${cfg.scale.dragHover});
                    background: ${CONFIG.colors.dragHover.background};
                    box-shadow: ${CONFIG.colors.dragHover.boxShadow};
                }

                .is-btn.success {
                    opacity: ${cfg.opacity.hover};
                    background: ${CONFIG.colors.success.background};
                    box-shadow: ${CONFIG.colors.success.boxShadow};
                }

                .is-icon-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: ${cfg.size}px;
                    height: ${cfg.size}px;
                    border-radius: ${cfg.iconStyle.background.enabled ? cfg.iconStyle.background.borderRadius : '0'};
                    background-color: ${cfg.iconStyle.background.enabled ? cfg.iconStyle.background.color : 'transparent'};
                    pointer-events: none;
                }

                .is-icon {
                    width: ${iconSize}px;
                    height: ${iconSize}px;
                    display: block;
                    pointer-events: none;
                    ${cfg.iconStyle.shadow.enabled ? `
                        filter: drop-shadow(0 0 ${cfg.iconStyle.shadow.blur}px ${cfg.iconStyle.shadow.color})
                                drop-shadow(0 0 ${cfg.iconStyle.shadow.blur * 0.5}px ${cfg.iconStyle.shadow.color});
                    ` : ''}
                }

                /* Custom tooltip - no cursor flicker, smart positioning */
                .is-btn::after {
                    content: attr(data-tooltip);
                    position: absolute;

                    /* Horizontal: appear on opposite side of screen edge */
                    ${pos.horizontal === 'right' ? 'right' : 'left'}: ${cfg.size + 8}px;

                    /* Vertical: anchor to opposite of screen edge */
                    ${pos.vertical === 'bottom' ? 'bottom' : 'top'}: 0;

                    background: rgba(30, 30, 30, 0.95);
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: 12px;
                    line-height: 1.5;
                    white-space: pre;
                    width: max-content;
                    pointer-events: none;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.15s ease, visibility 0.15s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    z-index: ${cfg.zIndex + 1};
                }

                .is-btn.hover::after {
                    opacity: 1;
                    visibility: visible;
                }
            `;
        }

        //================================================================================
        // CREATE SHADOW DOM HOST
        //================================================================================

        const shadowHost = document.createElement('div');
        shadowHost.id = 'image-search-host';
        Object.assign(shadowHost.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0',
            height: '0',
            overflow: 'visible',
            zIndex: CONFIG.button.zIndex.toString(),
            pointerEvents: 'none',
            userSelect: 'none',
            webkitUserSelect: 'none'
        });

        const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

        // Add styles
        const style = document.createElement('style');
        style.textContent = getStyles();
        shadowRoot.appendChild(style);

        //================================================================================
        // CREATE CONTAINER AND BUTTON
        //================================================================================

        const container = document.createElement('div');
        container.className = 'is-container';

        const btn = document.createElement('div');
        btn.className = 'is-btn';
        btn.setAttribute('data-tooltip', [
            '𝗜𝗺𝗮𝗴𝗲 𝗦𝗲𝗮𝗿𝗰𝗵',
            '• Click: Show page images + clipboard',
            '• Drop image here: Add to gallery',
            '• Double-click: Hide temporarily',
            '• Ctrl+V in picker: Paste image'
        ].join('\n'));

        // Create icon container
        const iconContainer = document.createElement('div');
        iconContainer.className = 'is-icon-container';

        // Create SVG icon using createElementNS
        const iconSvg = createSvgElement('svg', {
            'class': 'is-icon',
            'viewBox': '0 0 24 24',
            'fill': 'none',
            'stroke': '#555',
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        });

        // Create SVG elements properly
        const rect = createSvgElement('rect', {
            'x': '3',
            'y': '3',
            'width': '18',
            'height': '18',
            'rx': '2',
            'ry': '2'
        });

        const circle = createSvgElement('circle', {
            'cx': '8.5',
            'cy': '8.5',
            'r': '1.5'
        });

        const polyline = createSvgElement('polyline', {
            'points': '21 15 16 10 5 21'
        });

        iconSvg.appendChild(rect);
        iconSvg.appendChild(circle);
        iconSvg.appendChild(polyline);

        iconContainer.appendChild(iconSvg);
        btn.appendChild(iconContainer);
        container.appendChild(btn);
        shadowRoot.appendChild(container);

        //================================================================================
        // STATE MANAGEMENT HELPERS
        //================================================================================

        let isHovering = false;
        let cachedRect = null;

        function setButtonState(state) {
            btn.classList.remove('hover', 'drag-hover', 'success');
            if (state && state !== 'default') {
                btn.classList.add(state);
            }
        }

        function setHover(val) {
            if (isHovering === val) return;
            isHovering = val;
            if (val) {
                if (!btn.classList.contains('drag-hover') && !btn.classList.contains('success')) {
                    setButtonState('hover');
                }
            } else {
                if (!btn.classList.contains('drag-hover') && !btn.classList.contains('success')) {
                    setButtonState('default');
                }
            }
        }

        // Robust coordinate check to fix "stuck" highlight on sites like Instagram
        function onDocumentMouseMove(e) {
            if (!cachedRect) return;
            const x = e.clientX, y = e.clientY, t = 2;
            if (x < cachedRect.left - t || x > cachedRect.right + t ||
                y < cachedRect.top - t || y > cachedRect.bottom + t) {
                setHover(false);
                stopHoverTracking();
            }
        }

        function startHoverTracking() {
            cachedRect = btn.getBoundingClientRect();
            document.addEventListener('mousemove', onDocumentMouseMove, { capture: true, passive: true });
        }

        function stopHoverTracking() {
            cachedRect = null;
            document.removeEventListener('mousemove', onDocumentMouseMove, { capture: true });
        }

        function applySuccessWithTimeout() {
            setButtonState('success');
            setTimeout(() => {
                setButtonState('default');
            }, CONFIG.timing.feedbackDuration);
        }

        // Store reference for external access (flashButtonSuccess)
        floatingBtn = {
            element: btn,
            container: container,
            flash: function() {
                applySuccessWithTimeout();
            }
        };

        //================================================================================
        // EVENT HANDLERS
        //================================================================================

        let lastClickTime = 0;
        let hideTimeout = null;

        // Hover events (Pure Event-Based: Zero timers, robust cross-site)
        btn.addEventListener('mouseenter', () => {
            setHover(true);
            startHoverTracking();
        });

        btn.addEventListener('mouseleave', () => {
            setHover(false);
            stopHoverTracking();
        });

        // Pointerleave fallback for modern touch/hybrid support
        btn.addEventListener('pointerleave', () => {
            setHover(false);
            stopHoverTracking();
        });

        // Click events
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            const now = Date.now();
            const timeSinceLastClick = now - lastClickTime;
            lastClickTime = now;

            // Double-click: hide temporarily
            if (timeSinceLastClick < CONFIG.timing.doubleClickThreshold) {
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }

                container.classList.add('hidden');

                if (hideTimeout) clearTimeout(hideTimeout);
                hideTimeout = setTimeout(() => {
                    container.classList.remove('hidden');
                    setButtonState('default');
                }, CONFIG.timing.hideTemporarilyDuration);

                return;
            }

            // Single click (delayed to check for double-click)
            setTimeout(() => {
                if (Date.now() - lastClickTime >= CONFIG.timing.singleClickDelay) {
                    showImagePicker().catch(err => console.error('[Image Search] Error:', err));
                }
            }, CONFIG.timing.singleClickDelay);
        });

        //================================================================================
        // DRAG-DROP SUPPORT
        //================================================================================

        let dragEnterCounter = 0;

        btn.addEventListener('dragenter', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragEnterCounter++;
            if (dragEnterCounter === 1) {
                setButtonState('drag-hover');
            }
        });

        btn.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
        });

        btn.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragEnterCounter--;
            if (dragEnterCounter <= 0) {
                dragEnterCounter = 0;
                setButtonState('default');
            }
        });

        btn.addEventListener('drop', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragEnterCounter = 0;

            console.log('[Image Search] Drop event received');

            const files = e.dataTransfer.files;
            const items = e.dataTransfer.items;

            let imageBlob = null;
            let imageUrl = null;

            if (files && files.length > 0) {
                console.log('[Image Search] Files found:', files.length);
                for (const file of files) {
                    console.log('[Image Search] File type:', file.type);
                    if (file.type.startsWith('image/')) {
                        imageBlob = file;
                        break;
                    }
                }
            }

            if (!imageBlob && items && items.length > 0) {
                console.log('[Image Search] Items found:', items.length);
                for (const item of items) {
                    console.log('[Image Search] Item type:', item.type, 'kind:', item.kind);
                    if (item.type.startsWith('image/') && item.kind === 'file') {
                        imageBlob = item.getAsFile();
                        if (imageBlob) break;
                    }
                }
            }

            if (!imageBlob) {
                const draggedUrl = e.dataTransfer.getData('text/uri-list') ||
                                  e.dataTransfer.getData('text/plain') ||
                                  e.dataTransfer.getData('text/html');

                console.log('[Image Search] Dragged URL/text:', draggedUrl);

                if (draggedUrl) {
                    let extractedUrl = draggedUrl;
                    const imgMatch = draggedUrl.match(/<img[^>]+src=["']([^"']+)["']/i);
                    if (imgMatch) {
                        extractedUrl = imgMatch[1];
                    }

                    if (extractedUrl.startsWith('http') || extractedUrl.startsWith('data:image')) {
                        if (/\.(jpg|jpeg|png|gif|webp|bmp|svg|avif)(\?|#|$)/i.test(extractedUrl) ||
                            extractedUrl.startsWith('data:image') ||
                            /^https?:\/\/.*\/(.*\.(jpg|jpeg|png|gif|webp|bmp|svg|avif))/i.test(extractedUrl)) {
                            imageUrl = extractedUrl;
                            console.log('[Image Search] Image URL extracted:', imageUrl);
                        } else {
                            imageUrl = extractedUrl;
                            console.log('[Image Search] URL accepted (no extension):', imageUrl);
                        }
                    }
                }
            }

            if (imageBlob) {
                try {
                    droppedImageDataUrl = await blobToDataUrl(imageBlob);
                    console.log('[Image Search] Image blob converted to data URL');
                    applySuccessWithTimeout();
                    await showImagePicker();
                } catch (err) {
                    console.error('[Image Search] Failed to process dropped image blob:', err);
                    setButtonState('default');
                }
            } else if (imageUrl) {
                droppedImageDataUrl = imageUrl;
                console.log('[Image Search] Image URL stored directly');
                applySuccessWithTimeout();
                await showImagePicker();
            } else {
                console.log('[Image Search] No valid image found in drop data');
                setButtonState('default');
            }
        });

        //================================================================================
        // CLEANUP
        //================================================================================

        window.addEventListener('beforeunload', () => {
            stopHoverTracking();
        });

        //================================================================================
        // APPEND TO DOM
        //================================================================================

        document.body.appendChild(shadowHost);
        console.log('[Image Search] Button created (Shadow DOM)');
    }

    // Initialize
    if (document.body) {
        addFloatingButton();
    } else {
        document.addEventListener('DOMContentLoaded', addFloatingButton);
    }
})();
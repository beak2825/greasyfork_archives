// ==UserScript==
// @name         Creative Fabrica Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.3 - 2025-12-11 14:30 - Modal auto-closes after clicking download/view buttons
// @description  Remove annoying banner and add favorite/download buttons to previews
// @author       Emily
// @match        https://www.creativefabrica.com/*
// @match        https://*.creativefabrica.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558672/Creative%20Fabrica%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/558672/Creative%20Fabrica%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // PART 1: MURDER THE BANNER (AGGRESSIVE MODE)
    // ============================================

    // JavaScript banner assassin - actively hunts and destroys banners
    function destroyBanners() {
        let bannersKilled = 0;

        // Strategy 1: Kill elements containing banner images
        const bannerImages = document.querySelectorAll('img[src*="CF_homepage_banner"], img[src*="banner"], img[alt*="Banner"], img[alt="Studio AI"]');
        bannerImages.forEach(img => {
            // Kill the image and its parent containers
            let parent = img.parentElement;
            let depth = 0;
            while (parent && depth < 5) {
                // If parent has banner-like characteristics, kill it
                const rect = parent.getBoundingClientRect();
                if (rect.height > 100 && rect.height < 500 && rect.width > 500) {
                    parent.remove();
                    bannersKilled++;
                    return;
                }
                parent = parent.parentElement;
                depth++;
            }
            // If we didn't find a good parent, just kill the image
            img.remove();
            bannersKilled++;
        });

        // Strategy 2: Kill variant renderer spans that contain promotional content
        const variantSpans = document.querySelectorAll('span[data-rendering-id], span[id*="rid-"]');
        variantSpans.forEach(span => {
            const text = span.textContent.toLowerCase();
            // Check for promotional keywords
            if (text.includes('trial') ||
                text.includes('upgrade') ||
                text.includes('million+') ||
                text.includes('studio ai') ||
                text.includes('creative assets')) {

                // Check if it's banner-sized
                const rect = span.getBoundingClientRect();
                if (rect.height > 80 && rect.width > 400) {
                    span.remove();
                    bannersKilled++;
                }
            }
        });

        // Strategy 3: Kill picture elements with absolute positioning (common banner pattern)
        const absolutePictures = document.querySelectorAll('picture.absolute, picture[class*="inset"]');
        absolutePictures.forEach(pic => {
            const rect = pic.getBoundingClientRect();
            if (rect.height > 100 && rect.height < 500) {
                pic.remove();
                bannersKilled++;
            }
        });

        // Strategy 4: Kill divs with bg-cover that are banner-sized
        const bgCoverDivs = document.querySelectorAll('div[class*="bg-cover"], div[class*="bg-center"]');
        bgCoverDivs.forEach(div => {
            const rect = div.getBoundingClientRect();
            // Banner-like dimensions
            if (rect.height > 100 && rect.height < 500 && rect.width > 500) {
                const hasPromoText = div.textContent.toLowerCase().includes('trial') ||
                                   div.textContent.toLowerCase().includes('upgrade') ||
                                   div.textContent.toLowerCase().includes('million');
                if (hasPromoText) {
                    div.remove();
                    bannersKilled++;
                }
            }
        });

        if (bannersKilled > 0) {
            console.log(`Destroyed ${bannersKilled} banner element(s)`);
        }
    }

    // CSS fallback - belt and suspenders approach
    GM_addStyle(`
        /* Hide the banner - targeting multiple possible containers */
        div.relative.flex.flex-col.justify-between[class*="gap"][class*="overflow-hidden"][class*="bg-cover"],
        div[class*="banner"],
        div[id*="banner"],
        span[id^="r1d-"] > span[class*="yearly-extend-other"],
        picture.absolute.inset-0 {
            display: none !important;
        }

        /* If there's a parent container that creates space for the banner, collapse it */
        div:has(> picture.absolute.inset-0) {
            display: none !important;
        }

        /* Hide the homepage banner with "12 Million+ Creative Assets" */
        img[alt="Creative Fabrica Homepage Banner"],
        img[src*="CF_homepage_banner"],
        div:has(> img[alt="Creative Fabrica Homepage Banner"]),
        div:has(> img[src*="CF_homepage_banner"]),
        span[data-rendering-id]:has(img[alt*="Homepage Banner"]),
        span.inline-static-variant-element:has(img[alt*="Homepage Banner"]),
        span[id*="rid-"]:has(div.relative.flex-col) {
            display: none !important;
        }

        /* Hide the "Studio AI" trial banner */
        img[alt="Studio AI"],
        div:has(> img[alt="Studio AI"]),
        div.bg-primary-100:has(img[alt="Studio AI"]),
        div:has(h2:contains("Start your free AI Studio trial")),
        span[data-rendering-id*="rid-"]:has(img[alt="Studio AI"]) {
            display: none !important;
        }

        /* Custom button styling for our new buttons */
        .cf-custom-btn {
            position: absolute;
            top: 8px;
            padding: 8px 14px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            z-index: 100;
            transition: all 0.2s ease, transform 0.1s ease;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            gap: 4px;
            white-space: nowrap;
        }

        .cf-custom-btn:hover {
            background: rgba(0, 0, 0, 0.95);
            border-color: rgba(255, 255, 255, 0.7);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .cf-custom-btn:active {
            transform: translateY(0) scale(0.95);
        }

        .cf-favorite-btn {
            right: 8px;
        }

        .cf-favorite-btn.is-favorited {
            background: rgba(239, 68, 68, 0.8);
            border-color: rgba(255, 255, 255, 0.5);
        }

        .cf-favorite-btn.is-favorited:hover {
            background: rgba(220, 38, 38, 0.95);
        }

        .cf-download-btn {
            right: 8px;
            top: 48px;
        }

        /* Only show buttons on hover of the parent item container */
        .cf-item-container .cf-custom-btn {
            opacity: 0;
            pointer-events: none;
        }

        .cf-item-container:hover .cf-custom-btn {
            opacity: 1;
            pointer-events: auto;
        }

        /* If item is already favorited (has green checkmark), make sure we can detect it */
        .cf-item-container[data-favorited="true"] .cf-favorite-btn {
            background: rgba(239, 68, 68, 0.8);
        }

        /* Modal overlay styles */
        .cf-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: transparent;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 20px;
            pointer-events: none;
        }

        .cf-modal-overlay.cf-modal-visible {
            opacity: 1;
            pointer-events: auto;
        }

        .cf-modal-container {
            position: relative;
            width: 500px;
            max-width: 90%;
            max-height: 70vh;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }

        .cf-modal-overlay.cf-modal-visible .cf-modal-container {
            transform: scale(1);
        }

        .cf-modal-header {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 10;
            padding: 12px;
        }

        .cf-modal-close {
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 24px;
            font-weight: bold;
            line-height: 1;
            transition: all 0.2s ease;
        }

        .cf-modal-close:hover {
            background: rgba(239, 68, 68, 0.9);
            border-color: rgba(255, 255, 255, 0.6);
            transform: rotate(90deg);
        }

        .cf-modal-content {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .cf-modal-product-image {
            width: 100%;
            max-height: 250px;
            object-fit: contain;
            border-radius: 8px;
            background: #f5f5f5;
        }

        .cf-modal-product-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin: 0;
            line-height: 1.3;
        }

        .cf-modal-product-desc {
            font-size: 13px;
            color: #666;
            line-height: 1.4;
            display: none;
        }

        .cf-modal-actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .cf-modal-actions button,
        .cf-modal-actions a {
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .cf-modal-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            color: #666;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
        }

        .cf-modal-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top-color: #333;
            border-radius: 50%;
            animation: cf-spin 1s linear infinite;
        }

        @keyframes cf-spin {
            to { transform: rotate(360deg); }
        }
    `);

    // ============================================
    // PART 2: MODAL FOR PRODUCT PREVIEW
    // ============================================

    let currentModal = null;

    async function showProductModal(url) {
        // Close existing modal if any
        if (currentModal) {
            closeProductModal();
        }

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'cf-modal-overlay';

        // Create modal container
        const container = document.createElement('div');
        container.className = 'cf-modal-container';

        // Create close button
        const header = document.createElement('div');
        header.className = 'cf-modal-header';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'cf-modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.title = 'Close (ESC)';

        header.appendChild(closeBtn);
        container.appendChild(header);

        // Create loading indicator
        const loading = document.createElement('div');
        loading.className = 'cf-modal-loading';
        loading.innerHTML = '<div class="cf-modal-spinner"></div><div>Fetching product...</div>';
        container.appendChild(loading);

        // Create content container
        const content = document.createElement('div');
        content.className = 'cf-modal-content';
        content.style.display = 'none';
        container.appendChild(content);

        overlay.appendChild(container);
        document.body.appendChild(overlay);

        // Trigger animation
        requestAnimationFrame(() => {
            overlay.classList.add('cf-modal-visible');
        });

        // Close handler
        const closeModal = () => {
            overlay.classList.remove('cf-modal-visible');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                currentModal = null;
            }, 300);
        };

        closeBtn.onclick = closeModal;

        // Close on ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Close when clicking outside
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        };

        container.onclick = (e) => {
            e.stopPropagation();
        };

        currentModal = overlay;

        // Fetch and parse the product page
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract product information
            const productImage = doc.querySelector('img[src*="creativefabrica"], img[class*="product"], img[alt]');
            // Be more specific - h1 is usually the actual product name
            const productTitle = doc.querySelector('h1') || doc.querySelector('[class*="product-title"]');
            const productDesc = doc.querySelector('[class*="description"], [class*="excerpt"], p');

            // Find download button (exclude social media share buttons)
            const downloadButtons = doc.querySelectorAll(
                'a[href*="download"], ' +
                'button[class*="download"], ' +
                'a[class*="download"]'
            );

            // Filter out Pinterest, Facebook, Twitter, etc.
            let downloadButton = null;
            for (const btn of downloadButtons) {
                const href = btn.href || btn.getAttribute('href') || '';
                // Skip social media share buttons
                if (!href.includes('pinterest.com') &&
                    !href.includes('facebook.com') &&
                    !href.includes('twitter.com') &&
                    !href.includes('linkedin.com')) {
                    downloadButton = btn;
                    break;
                }
            }

            // Build modal content
            let contentHTML = '';

            if (productImage) {
                const imgSrc = productImage.src || productImage.getAttribute('data-src');
                if (imgSrc) {
                    contentHTML += `<img src="${imgSrc}" class="cf-modal-product-image" alt="Product" />`;
                }
            }

            if (productTitle) {
                contentHTML += `<h2 class="cf-modal-product-title">${productTitle.textContent.trim()}</h2>`;
            }

            if (productDesc && productDesc.textContent.trim().length > 0) {
                const descText = productDesc.textContent.trim().substring(0, 200);
                contentHTML += `<p class="cf-modal-product-desc">${descText}...</p>`;
            }

            // Add action buttons
            contentHTML += '<div class="cf-modal-actions">';

            if (downloadButton) {
                const downloadHref = downloadButton.href || downloadButton.getAttribute('href');
                if (downloadHref) {
                    contentHTML += `<a href="${downloadHref}" target="_blank" style="background: #10b981; color: white; border: none;">⬇️ Download</a>`;
                }
            }

            contentHTML += `<a href="${url}" target="_blank" style="background: #6366f1; color: white; border: none;">🔗 View Full Page</a>`;
            contentHTML += '</div>';

            content.innerHTML = contentHTML;

            // Add click handlers to close modal when clicking action buttons
            const actionButtons = content.querySelectorAll('.cf-modal-actions a');
            actionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Close modal after a brief delay to let the link open
                    setTimeout(closeModal, 100);
                });
            });

            // Show content, hide loading
            loading.style.display = 'none';
            content.style.display = 'flex';

        } catch (error) {
            console.error('Error loading product page:', error);
            loading.innerHTML = `
                <div style="color: #ef4444; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">❌</div>
                    <div>Failed to load product</div>
                    <a href="${url}" target="_blank" style="display: inline-block; margin-top: 12px; padding: 8px 16px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px;">Open in New Tab</a>
                </div>
            `;
        }
    }

    function closeProductModal() {
        if (currentModal) {
            currentModal.classList.remove('cf-modal-visible');
            setTimeout(() => {
                if (currentModal.parentNode) {
                    currentModal.parentNode.removeChild(currentModal);
                }
                currentModal = null;
            }, 300);
        }
    }

    // ============================================
    // PART 3: ADD BUTTONS TO PREVIEW IMAGES
    // ============================================

    function addButtonsToItem(itemElement) {
        // Skip if we've already processed this item
        if (itemElement.classList.contains('cf-processed')) {
            return;
        }
        itemElement.classList.add('cf-processed', 'cf-item-container');

        // Make sure the item has relative positioning for absolute button placement
        if (getComputedStyle(itemElement).position === 'static') {
            itemElement.style.position = 'relative';
        }

        // Check if item is already favorited (solid heart vs outline heart)
        // Look for heart icon and determine if it's filled
        const heartElement = itemElement.querySelector(
            'svg[class*="heart"], ' +
            'path[d*="M20.84"], ' +
            '[class*="favorite"] svg, ' +
            '[aria-label*="favorite"] svg'
        );

        let isFavorited = false;
        if (heartElement) {
            // Check if the heart is filled (multiple detection methods)
            const parent = heartElement.closest('button, a, div');
            const computedStyle = window.getComputedStyle(heartElement);
            const hasFill = heartElement.getAttribute('fill') && heartElement.getAttribute('fill') !== 'none';
            const hasFilledClass = heartElement.className.toString().match(/fill|solid|active|favorited/i);
            const hasRedColor = computedStyle.fill?.includes('rgb(255') || computedStyle.color?.includes('rgb(255');

            isFavorited = !!(hasFill || hasFilledClass || hasRedColor);
        }

        if (isFavorited) {
            itemElement.setAttribute('data-favorited', 'true');
        }

        // Get the item's link for navigation
        // If this element itself is a link, use it directly
        let itemUrl = null;
        if (itemElement.tagName === 'A' && itemElement.href &&
            (itemElement.href.includes('/product/') || itemElement.href.includes('/design/') || itemElement.href.includes('/graphic/'))) {
            itemUrl = itemElement.href;
        } else {
            // Otherwise, find the first product link within this item
            const itemLink = itemElement.querySelector('a[href*="/product/"], a[href*="/design/"], a[href*="/graphic/"]');
            itemUrl = itemLink ? itemLink.href : null;
        }

        // Click-to-preview functionality
        if (itemUrl) {
            // Show modal on click
            itemElement.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default navigation
                e.stopPropagation(); // Stop event from bubbling
                showProductModal(itemUrl);
            });

            // Add visual feedback - cursor pointer on hover
            itemElement.style.cursor = 'pointer';
        }

        // REMOVED: Favorite/Download buttons on cards (click modal replaced this functionality)
        // The click modal provides a cleaner UX without cluttering the cards with buttons
    }

    // Function to find and process item containers
    function processItems() {
        // Creative Fabrica uses various selectors for item cards depending on the view
        // Let's be comprehensive and catch everything
        // IMPORTANT: Only select the <a> links themselves, not parent containers
        // This prevents multiple nested elements from all triggering hover events
        const selectors = [
            // Product links with images (most specific - use these!)
            'a[href*="/product/"]:has(img)',
            'a[href*="/design/"]:has(img)',
            'a[href*="/graphic/"]:has(img)'
        ].join(', ');

        const items = document.querySelectorAll(selectors);

        let processedCount = 0;
        let skippedCount = 0;

        items.forEach(item => {
            // Make sure this element contains an image (final validation)
            // Accept any image, including lazy-loaded ones
            const hasImage = item.querySelector('img');
            const alreadyProcessed = item.classList.contains('cf-processed');

            if (!hasImage) {
                skippedCount++;
            } else if (alreadyProcessed) {
                skippedCount++;
            } else {
                addButtonsToItem(item);
                processedCount++;
            }
        });
    }

    // Watch for dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        destroyBanners(); // Kill banners on every DOM change
        processItems();
    });

    // Start observing when DOM is ready
    function init() {
        destroyBanners(); // Initial banner destruction
        processItems();

        // Observe the whole document for new items
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run banner destroyer immediately (before DOM is even ready)
    destroyBanners();

    // Run when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also run on any navigation changes (for SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            destroyBanners(); // Kill banners on navigation
            setTimeout(processItems, 500);
        }
    }).observe(document, {subtree: true, childList: true});

    // Nuclear option: Run banner destroyer every 2 seconds
    setInterval(destroyBanners, 2000);

    console.log('Creative Fabrica Enhancer loaded! Banner assassin is active, buttons will appear on item hover.');
})();

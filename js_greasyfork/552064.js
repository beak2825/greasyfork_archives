// ==UserScript==
// @name         Shopify Product Variant Downloader
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Image downloader, row-click-to-copy, animations, and image hover previews. (Updated for multi-store compatibility)
// @author       Zandriegbz
// @match        https://admin.shopify.com/store/*/products/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopify.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552064/Shopify%20Product%20Variant%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/552064/Shopify%20Product%20Variant%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Style for all features ---
    const enhancedStyles = `
        /* For the image hover preview */
        .variant-image-preview { position: fixed; display: none; max-width: 350px; max-height: 350px; border: 2px solid #ccc; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 10001; pointer-events: none; object-fit: contain; background-color: white; border-radius: 5px; }

        /* Copy hint and animation */
        .copy-hint-text { color: #6d7175; font-size: 12px; margin-left: 10px; font-style: italic; display: none; pointer-events: none; }
        tr.Polaris-IndexTable__TableRow:hover .copy-hint-text { display: inline; }
        @keyframes flash-highlight-animation { 0% { background-color: #e6e6ff; } 100% { background-color: transparent; } }
        .row-copied-highlight { animation: flash-highlight-animation 0.8s ease-out forwards; }

        /* "Copied" message overlay */
        .copied-message-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(28, 30, 32, 0.9); color: white; padding: 8px 16px; border-radius: 6px; font-size: 14px; z-index: 10; pointer-events: none; animation: fadeInOut 3s ease-in-out forwards; }
        @keyframes fadeInOut { 0% { opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }

        /* Download button styles */
        #download-all-variants-btn .Polaris-Button__Icon { display: inline-flex; align-items: center; margin-right: 6px; }
        @keyframes downloading-animation { 0% { transform: translateY(0); } 50% { transform: translateY(2px); } 100% { transform: translateY(0); } }
        #download-all-variants-btn.is-downloading .Polaris-Button__Icon { animation: downloading-animation 1s ease-in-out infinite; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = enhancedStyles;
    document.head.appendChild(styleSheet);


    // =========================================================
    // MODIFIED HELPER FUNCTIONS FOR MULTI-STORE COMPATIBILITY
    // =========================================================

    function getVariantNameFromRow(rowElement) {
        // FIX: Removed brittle 'td._VariantCell_vp04i_1' selector.
        // This now finds the variant name button structure anywhere inside the row.
        const variantTextElement = rowElement.querySelector('span._PlainButton_261hc_15 > button > span.Polaris-Text--root.Polaris-Text--bodyMd.Polaris-Text--regular');
        return variantTextElement ? variantTextElement.textContent.trim() : null;
    }

    /**
     * NEW: Gathers all variant image data from the page to avoid code duplication.
     * @returns {Array<{name: string, url: string}>} An array of objects with variant names and image URLs.
     */
    function getVariantImageData() {
        console.log('[DIAGNOSTIC] Starting image data collection...');

        const rows = document.querySelectorAll('tr.Polaris-IndexTable__TableRow:not(.Polaris-IndexTable__TableRow--child)');
        console.log(`[DIAGNOSTIC] Found ${rows.length} variant rows`);

        const results = [];

        rows.forEach((row, index) => {
            const name = getVariantNameFromRow(row);
            console.log(`[DIAGNOSTIC] Row ${index + 1}: Variant name = "${name}"`);

            // Try multiple selectors to find images
            const selectors = [
                '.Polaris-Thumbnail img',
                'img[src*="cdn.shopify.com"]',
                'img[src*="shopify"]',
                'img',
                '[class*="Thumbnail"] img',
                '[class*="Image"] img'
            ];

            let imageUrl = null;
            let usedSelector = null;

            for (const selector of selectors) {
                const imgElement = row.querySelector(selector);
                if (imgElement && imgElement.src) {
                    imageUrl = imgElement.src;
                    usedSelector = selector;
                    break;
                }
            }

            console.log(`[DIAGNOSTIC] Row ${index + 1}: Image URL = "${imageUrl}" (using selector: ${usedSelector})`);

            if (name && imageUrl) {
                results.push({ name, url: imageUrl });
            }
        });

        console.log(`[DIAGNOSTIC] Final results:`, results);
        return results.filter(img => img.name && img.url);
    }

    /**
     * NEW: Downloads all variant images as individual files.
     * @param {HTMLButtonElement} button - The button that was clicked.
     */
    async function downloadAllImagesIndividually(button) {
        const buttonTextSpan = button.querySelector('.Polaris-Button__Text');
        const originalText = buttonTextSpan.textContent;
        const imagesToDownload = getVariantImageData();

        if (imagesToDownload.length === 0) {
            alert('No variant images found to download.');
            return;
        }

        const userConfirmed = confirm(`Found ${imagesToDownload.length} images.\n\nImages will be downloaded using their variant name as the filename (e.g., "Red.png").\n\nDo you want to proceed?`);
        if (!userConfirmed) return;

        button.disabled = true;
        button.classList.add('is-downloading');

        for (let i = 0; i < imagesToDownload.length; i++) {
            const imageInfo = imagesToDownload[i];
            buttonTextSpan.textContent = `Downloading ${i + 1}/${imagesToDownload.length}...`;

            try {
                // Filename is just the variant name
                const extension = imageInfo.url.split('.').pop().split('?')[0] || 'png';
                const filename = `${imageInfo.name}.${extension}`;

                console.log(`[DOWNLOAD] Downloading: ${filename}`);
                await downloadImageWithCustomName(imageInfo.url, filename);
                await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between downloads
            } catch (error) {
                console.error(`[DOWNLOAD] Failed to download ${imageInfo.name}:`, error);
            }
        }

        console.log('[DOWNLOAD] All downloads completed successfully.');
        buttonTextSpan.textContent = 'Complete!';

        setTimeout(() => {
            buttonTextSpan.textContent = originalText;
            button.disabled = false;
            button.classList.remove('is-downloading');
        }, 3000);
    }

    /**
     * Downloads an image with a custom filename (helper for organized downloads)
     */
    async function downloadImageWithCustomName(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const blob = await response.blob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error(`Failed to download ${filename}:`, error);
            throw error;
        }
    }

    /**
     * [MODIFIED] Adds hover listeners to thumbnails using robust selectors.
     */
    function addHoverListenersToThumbnails() {
        // Target the button that contains the thumbnail image directly.
        const thumbnailButtons = document.querySelectorAll('.Polaris-Thumbnail');
        thumbnailButtons.forEach(thumbContainer => {
            const imgElement = thumbContainer.querySelector('img');
            // We attach the listener to the parent button if it exists, or the container itself.
            const hoverTarget = thumbContainer.closest('button') || thumbContainer;

            if (!imgElement || hoverTarget.dataset.hoverListenersAttached) return;
            hoverTarget.dataset.hoverListenersAttached = 'true';

            hoverTarget.addEventListener('mousemove', e => {
                if (previewElement && previewElement.style.display !== 'none') {
                    const offsetX = 15, offsetY = 15;
                    let newX = e.clientX + offsetX, newY = e.clientY + offsetY;
                    const pWidth = previewElement.offsetWidth || 350, pHeight = previewElement.offsetHeight || 350;
                    if (newX + pWidth > window.innerWidth) newX = e.clientX - pWidth - offsetX;
                    if (newY + pHeight > window.innerHeight) newY = e.clientY - pHeight - offsetY;
                    previewElement.style.left = `${newX < 0 ? 0 : newX}px`;
                    previewElement.style.top = `${newY < 0 ? 0 : newY}px`;
                }
            });
            hoverTarget.addEventListener('mouseenter', () => {
                previewElement.src = imgElement.src;
                previewElement.style.display = 'block';
            });
            hoverTarget.addEventListener('mouseleave', () => {
                previewElement.style.display = 'none';
            });
        });
    }

     /**
     * [MODIFIED] Enhances variant rows for click-to-copy using robust selectors.
     */
    function enhanceVariantRows() {
        const variantRows = document.querySelectorAll('tr.Polaris-IndexTable__TableRow:not(.Polaris-IndexTable__TableRow--child)');
        variantRows.forEach(rowElement => {
            if (rowElement.dataset.enhanced === 'true') return;
            rowElement.dataset.enhanced = 'true';

            // FIX: Find elements based on reliable structure, not the 'td' class.
            const variantNameSpan = rowElement.querySelector('span._PlainButton_261hc_15 > button > span.Polaris-Text--root.Polaris-Text--bodyMd.Polaris-Text--regular');
            if (variantNameSpan) {
                const variantCell = variantNameSpan.closest('td');
                if (variantCell) {
                    // Set up relative positioning for the "Copied" message overlay
                    const innerContainer = variantCell.querySelector('.Polaris-InlineStack');
                    if (innerContainer) {
                        innerContainer.style.position = 'relative';
                    }
                    // Add the "(Click to copy)" hint if it doesn't exist
                    if (!variantNameSpan.parentElement.querySelector('.copy-hint-text')) {
                        const hint = document.createElement('span');
                        hint.textContent = '(Click to copy)';
                        hint.className = 'copy-hint-text';
                        variantNameSpan.after(hint);
                    }
                }
            }

            rowElement.addEventListener('click', (event) => {
                // Prevent copy action if clicking on an interactive element like a button, link, or input
                if (event.target.closest('button, a, input, label')) return;
                event.stopImmediatePropagation();
                event.preventDefault();
                const variantName = getVariantNameFromRow(rowElement);
                triggerCopyFeedback(variantName, rowElement);
            }, { capture: true });
        });
    }

    // --- UNCHANGED HELPER FUNCTIONS & INITIALIZATION ---
    let previewElement = null;
    function showCopiedMessage(rowElement) {
        // FIX: Instead of searching for the brittle 'td' class, find the reliable variant button first,
        // then traverse up the DOM to its parent 'td'.
        const variantButton = rowElement.querySelector('span._PlainButton_261hc_15 > button');
        const variantCell = variantButton ? variantButton.closest('td') : null;
        if (!variantCell) return;

        const existingMessage = variantCell.querySelector('.copied-message-overlay');
        if (existingMessage) existingMessage.remove();
        const messageDiv = document.createElement('div');
        messageDiv.textContent = 'Variant name copied';
        messageDiv.className = 'copied-message-overlay';

        // Ensure we append to a valid container within the cell
        const innerContainer = variantCell.querySelector('.Polaris-InlineStack');
        if (innerContainer) {
            innerContainer.style.position = 'relative'; // Ensure positioning context
            innerContainer.appendChild(messageDiv);
        } else if (variantCell.firstChild) {
            variantCell.firstChild.appendChild(messageDiv);
        }
    }
    function triggerCopyFeedback(text, rowElement) { if (!text || !rowElement) return; navigator.clipboard.writeText(text).then(() => { console.log(`Copied "${text}"`); rowElement.classList.remove('row-copied-highlight'); void rowElement.offsetWidth; rowElement.classList.add('row-copied-highlight'); showCopiedMessage(rowElement); }).catch(err => console.error('Failed to copy text: ', err)); }
    async function downloadImage(url, filename) { try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const blob = await response.blob(); const extension = url.split('.').pop().split('?')[0]; const finalFilename = `${filename}.${extension}`; const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = finalFilename; link.click(); URL.revokeObjectURL(link.href); } catch (error) { console.error(`Failed to download ${filename}:`, error); } }
    /**
     * Creates and places a single download button for variant images.
     */
    function createAndPlaceDownloadButton() {
        if (document.getElementById('download-buttons-container')) return;

        const targetContainer = document.querySelector('._TableActions_uz4l4_1 > .Polaris-InlineStack');
        if (!targetContainer) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'download-buttons-container';
        buttonContainer.style.display = 'inline-flex';

        const svgIcon = `<span class="Polaris-Button__Icon"><span class="Polaris-Icon"><svg viewBox="0 0 20 20" focusable="false" aria-hidden="true"><path d="M17.707 9.293a1 1 0 0 0-1.414 0l-4.293 4.293v-9.586a1 1 0 1 0-2 0v9.586l-4.293-4.293a1 1 0 0 0-1.414 1.414l6 6a1 1 0 0 0 1.414 0l6-6a1 1 0 0 0 0-1.414Z"></path></svg></span></span>`;

        // Create Download Button
        const downloadButton = document.createElement('button');
        downloadButton.id = 'download-all-variants-btn';
        downloadButton.className = 'Polaris-Button Polaris-Button--pressable Polaris-Button--variantPrimary Polaris-Button--sizeMedium Polaris-Button--textAlignLeft';
        downloadButton.type = 'button';
        downloadButton.innerHTML = `${svgIcon}<span class="Polaris-Button__Text">Download variants</span>`;
        downloadButton.onclick = () => downloadAllImagesIndividually(downloadButton);
        downloadButton.style.minWidth = '150px';

        buttonContainer.appendChild(downloadButton);
        targetContainer.appendChild(buttonContainer);
    }
    function createPreviewElement() { if (!previewElement) { previewElement = document.createElement('img'); previewElement.className = 'variant-image-preview'; document.body.appendChild(previewElement); } }

    function runAllEnhancements() {
        createAndPlaceDownloadButton();
        addHoverListenersToThumbnails();
        enhanceVariantRows();
    }
    const observer = new MutationObserver(runAllEnhancements);
    observer.observe(document.body, { childList: true, subtree: true });
    createPreviewElement();
    setTimeout(runAllEnhancements, 1500);

})();
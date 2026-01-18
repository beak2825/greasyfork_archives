// ==UserScript==
// @name         FrostFall
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  One-click tool to combine multiple Tweet photos into one continuous image.
// @author       blackjack
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563148/FrostFall.user.js
// @updateURL https://update.greasyfork.org/scripts/563148/FrostFall.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Styles
    const styles = `
.tic-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 9999px;
    transition-duration: 0.2s;
    cursor: pointer;
    margin-left: 8px;
}

.tic-btn:hover {
    background-color: rgba(29, 155, 240, 0.1);
}

.tic-btn svg {
    color: rgb(83, 100, 113);
    fill: currentColor;
    width: 20px;
    height: 20px;
}

.tic-btn:hover svg {
    color: rgb(29, 155, 240);
}

.tic-loading {
    opacity: 0.5;
    pointer-events: none;
}

/* Modal Overlay */
.tic-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    animation: tic-fade-in 0.2s forwards;
}

@keyframes tic-fade-in {
    to { opacity: 1; }
}

/* Modal Content Container */
.tic-modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* The Combined Image */
.tic-modal-image {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    border-radius: 4px;
}

/* Close Button (Top Right) */
.tic-modal-close {
    position: absolute;
    top: -40px;
    right: -40px;
    color: white;
    font-size: 30px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 10px;
    line-height: 1;
}

.tic-modal-close:hover {
    color: #1d9bf0;
}

/* Action Bar (Download Button) */
.tic-modal-actions {
    margin-top: 15px;
}

.tic-btn-download {
    background-color: #1d9bf0;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 9999px;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tic-btn-download:hover {
    background-color: #1a8cd8;
}
    `;

    GM_addStyle(styles);

    // Watch for DOM changes to inject buttons
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                injectButtons();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function injectButtons() {
        // Find all tweet actions groups (comment, retweet, like, share)
        // Selector: [role="group"] is the action bar
        const groups = document.querySelectorAll('div[role="group"]:not(.tic-processed)');

        groups.forEach(group => {
            // Find the article to ensure we are in a tweet
            const article = group.closest('article[data-testid="tweet"]');
            if (!article) return;

            // Mark group as processed
            group.classList.add('tic-processed');

            // Create button
            const btn = createBtn();
            btn.onclick = (e) => handleCombine(e, article);

            // Append to the group. 
            // Twitter uses flexbox. We likely want to insert it at the end or near the share button.
            // The last element is usually the "Share" or "Views" button.
            group.appendChild(btn);
        });
    }

    function createBtn() {
        const div = document.createElement('div');
        // Mimic Twitter's action buttons structure usually: 
        // div (hover circle) -> svg
        div.className = 'tic-btn css-1dbjc4n r-18u37iz r-1h0z5md'; // specific twitch classes might help layout but safe to just use custom css
        div.setAttribute('role', 'button');
        div.setAttribute('aria-label', 'Combine Images');
        div.setAttribute('title', 'Combine Images');

        // Icon: Stacked images style (Snowflake logic from update)
        // Actually, let's use the Snowflake SVG since that's the current brand
        // Or keep the original stacked icon? User asked for Snowflake logo but for the extension icon.
        // Usually extension icon != in-app button icon, but consistency is good.
        // Let's use a Snowflake SVG path here to match the "FrostFall" branding.
        div.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2">
            <g><path d="M12 2L14.4 7.2L20 8.8L15.6 12.2L17.2 17.6L12 14.4L6.8 17.6L8.4 12.2L4 8.8L9.6 7.2L12 2Z"></path>
            <path d="M21 16v-2l-8-5-8 5v2h16zm2-8H1v11c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8zm-2 11H3v-2l8-5 8 5v2zM5 8h14V6H5v2z"></path></g>
        </svg>
        `;
        // Wait, the path above is a mix of star and stack. Let's stick to the original "Stacked Images" icon for clarity of function, 
        // or use the Snowflake if the user explicitly wants the button to be a snowflake.
        // User request "Change plugin logo to snowflake" -> implied extension icon.
        // But for the button, a snowflake might be confusing? 
        // Let's stick to the stack icon used in content.js for now as it represents "Combine".
        // Reverting to the code from content.js
        div.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2">
            <g><path d="M21 16v-2l-8-5-8 5v2h16zm2-8H1v11c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8zm-2 11H3v-2l8-5 8 5v2zM5 8h14V6H5v2z"></path></g>
        </svg>
        `;
        return div;
    }

    async function handleCombine(e, article) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;

        try {
            // Loading state
            btn.classList.add('tic-loading');
            // Simple spinner or text
            btn.innerHTML = '<span style="font-size:12px">...</span>';

            const images = getTweetImages(article);

            if (images.length === 0) {
                alert('No images found in this tweet!');
                return;
            }

            const blobs = await Promise.all(images.map(url => fetchImage(url)));
            const bitmaps = await Promise.all(blobs.map(blob => createImageBitmap(blob)));

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate dimensions
            let totalHeight = 0;
            let maxWidth = 0;

            bitmaps.forEach(bmp => {
                totalHeight += bmp.height;
                maxWidth = Math.max(maxWidth, bmp.width);
            });

            canvas.width = maxWidth;
            canvas.height = totalHeight;

            // Draw with center alignment
            let currentY = 0;
            bitmaps.forEach(bmp => {
                const x = (maxWidth - bmp.width) / 2;
                ctx.drawImage(bmp, x, currentY);
                currentY += bmp.height;
            });

            // Show Preview instead of auto-download
            canvas.toBlob((blob) => {
                showPreviewModal(blob);
            }, 'image/png');

        } catch (err) {
            console.error('Error combining images:', err);
            alert('Failed to combine images. See console for details.');
        } finally {
            btn.classList.remove('tic-loading');
            btn.innerHTML = originalContent;
        }
    }

    function showPreviewModal(blob) {
        const url = URL.createObjectURL(blob);

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.className = 'tic-modal-overlay';

        // HTML Structure
        overlay.innerHTML = `
            <div class="tic-modal-content">
                <button class="tic-modal-close" aria-label="Close">×</button>
                <img src="${url}" class="tic-modal-image" alt="Combined Image">
                <div class="tic-modal-actions">
                    <button class="tic-btn-download">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 16v-2l-8-5-8 5v2h16zm2-8H1v11c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8zm-2 11H3v-2l8-5 8 5v2zM5 8h14V6H5v2z"></path></svg>
                        Download Image
                    </button>
                </div>
            </div>
        `;

        // Event Listeners
        const closeBtn = overlay.querySelector('.tic-modal-close');
        const downloadBtn = overlay.querySelector('.tic-btn-download');
        const img = overlay.querySelector('.tic-modal-image');

        // Close on Escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal(overlay, url, escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Close on X
        closeBtn.onclick = () => closeModal(overlay, url, escHandler);

        // Close on clicking background (but not image/content)
        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal(overlay, url, escHandler);
        };

        // Download Handler
        downloadBtn.onclick = () => {
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            a.download = `frostfall-${timestamp}.png`;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        document.body.appendChild(overlay);
    }

    function closeModal(overlay, url, escHandler) {
        // Remove Esc listener
        if (escHandler) {
            document.removeEventListener('keydown', escHandler);
        }

        // Remove DOM
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        // Cleanup URL object
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    function getTweetImages(article) {
        // Select images that look like media
        const imgs = Array.from(article.querySelectorAll('img[src*="pbs.twimg.com/media"]'));

        return imgs.filter(img => {
            // Check if image is within this specific tweet's context
            const closestTweet = img.closest('[data-testid="tweet"]');
            if (closestTweet !== article) return false;

            // Exclude images inside Quote Tweets or Cards
            if (img.closest('div[role="link"]')) return false;

            return true;
        }).map(img => {
            // Get high res URL
            const url = new URL(img.src);
            // Replace name=small/medium with name=large or orig
            if (url.searchParams.has('name')) {
                url.searchParams.set('name', 'orig');
            }
            return url.toString();
        });
    }

    async function fetchImage(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        return response.blob();
    }

    // Initial Run
    injectButtons();

})();

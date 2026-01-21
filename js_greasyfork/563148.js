// ==UserScript==
// @name         FrostFall
// @namespace    http://tampermonkey.net/
// @version      1.1
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
        const groups = document.querySelectorAll('div[role="group"]:not(.tic-processed)');

        groups.forEach(group => {
            const article = group.closest('article[data-testid="tweet"]');
            if (!article) return;

            group.classList.add('tic-processed');

            const btn = createBtn();
            btn.onclick = (e) => handleCombine(e, article);

            group.appendChild(btn);
        });
    }

    function createBtn() {
        const div = document.createElement('div');
        div.className = 'tic-btn css-1dbjc4n r-18u37iz r-1h0z5md';
        div.setAttribute('role', 'button');
        div.setAttribute('aria-label', 'Combine Images');
        div.setAttribute('title', 'Combine Images');

        // Icon: Snowflake style (FrostFall theme)
        div.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-18jsvk2">
            <g>
                <path d="M21 11h-3.64l1.88-2.61c.45-.63.3-1.51-.33-1.96-.63-.45-1.51-.3-1.96.33L15.2 9.2V6c0-.77-.63-1.4-1.4-1.4-.77 0-1.4.63-1.4 1.4v3.2l-1.75-2.43c-.45-.63-1.33-.78-1.96-.33-.63.45-.78 1.33-.33 1.96L10.24 11H6.6c-.77 0-1.4.63-1.4 1.4 0 .77.63 1.4 1.4 1.4h3.64l-1.88 2.61c-.45.63-.3 1.51.33 1.96.26.19.56.28.85.28.43 0 .86-.2 1.11-.56l1.75-2.43V19c0 .77.63 1.4 1.4 1.4.77 0 1.4-.63 1.4-1.4v-3.2l1.75 2.43c.25.35.68.56 1.11.56.29 0 .59-.09.85-.28.63-.45.78-1.33.33-1.96L17.36 14H21c.77 0 1.4-.63 1.4-1.4 0-.77-.63-1.4-1.4-1.4z"></path>
            </g>
        </svg>
        `;
        return div;
    }

    async function handleCombine(e, article) {
        e.stopPropagation();
        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;

        try {
            btn.classList.add('tic-loading');
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

            let totalHeight = 0;
            let maxWidth = 0;

            bitmaps.forEach(bmp => {
                totalHeight += bmp.height;
                maxWidth = Math.max(maxWidth, bmp.width);
            });

            canvas.width = maxWidth;
            canvas.height = totalHeight;

            let currentY = 0;
            bitmaps.forEach(bmp => {
                const x = (maxWidth - bmp.width) / 2;
                ctx.drawImage(bmp, x, currentY);
                currentY += bmp.height;
            });

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

        const overlay = document.createElement('div');
        overlay.className = 'tic-modal-overlay';

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

        const closeBtn = overlay.querySelector('.tic-modal-close');
        const downloadBtn = overlay.querySelector('.tic-btn-download');
        const img = overlay.querySelector('.tic-modal-image');

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal(overlay, url, escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        closeBtn.onclick = () => closeModal(overlay, url, escHandler);

        overlay.onclick = (e) => {
            if (e.target === overlay) closeModal(overlay, url, escHandler);
        };

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
        if (escHandler) {
            document.removeEventListener('keydown', escHandler);
        }

        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }

        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    function getTweetImages(article) {
        const imgs = Array.from(article.querySelectorAll('img[src*="pbs.twimg.com/media"]'));

        return imgs.filter(img => {
            const closestTweet = img.closest('[data-testid="tweet"]');
            if (closestTweet !== article) return false;
            if (img.closest('div[role="link"]')) return false;
            return true;
        }).map(img => {
            const url = new URL(img.src);
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

    injectButtons();
})();


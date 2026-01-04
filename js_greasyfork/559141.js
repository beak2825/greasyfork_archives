// ==UserScript==
// @name         8chan.moe Gallery Enhancement (4chan X style)
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0
// @description  Enhance 8chan gallery with video support, thumbnails sidebar, and 4chan X controls
// @author       Claud+Anon
// @match        https://8chan.moe/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559141/8chanmoe%20Gallery%20Enhancement%20%284chan%20X%20style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559141/8chanmoe%20Gallery%20Enhancement%20%284chan%20X%20style%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const GalleryX = {
        files: [],
        currentIndex: 0,
        isOpen: false,
        slideshowInterval: null,

        init() {
            this.addStyles();
            setTimeout(() => {
                this.collectMedia();
                this.hijackGalleryButton();
            }, 1000);
        },

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #galleryXPanel {
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    display: flex;
                    flex-direction: row;
                    background: rgba(0,0,0,0.95);
                    z-index: 10000;
                }

                .gx-viewport {
                    display: flex;
                    align-items: stretch;
                    flex-direction: row;
                    flex: 1 1 auto;
                    overflow: hidden;
                }

                .gx-thumbnails {
                    flex: 0 0 150px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    text-align: center;
                    background: rgba(0,0,0,.5);
                    border-left: 1px solid #222;
                }

                .gx-thumb {
                    flex: 0 0 auto;
                    padding: 3px;
                    line-height: 0;
                    transition: background .2s linear;
                    cursor: pointer;
                }

                .gx-thumb img,
                .gx-thumb video {
                    max-width: 125px;
                    max-height: 125px;
                    height: auto;
                    width: auto;
                    pointer-events: none;
                }

                .gx-thumb.gx-highlight {
                    background: rgba(0, 190, 255, 0.8);
                }

                .gx-image-container {
                    flex: 1 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: auto;
                    position: relative;
                }

                .gx-image-container img,
                .gx-image-container video {
                    object-fit: contain;
                    height: 100vh;
                    max-height: calc(100vh - 0px);
                    max-width: 1600px;
                }

                .gx-prev, .gx-next {
                    flex: 0 0 40px;
                    position: relative;
                    cursor: pointer;
                    opacity: 0.7;
                    background-color: rgba(0, 0, 0, 0.3);
                    border: 1px solid #222;
                    transition: opacity 0.2s;
                }

                .gx-prev:hover, .gx-next:hover {
                    opacity: 1;
                }

                .gx-prev::after, .gx-next::after {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    display: inline-block;
                    border-top: 15px solid transparent;
                    border-bottom: 15px solid transparent;
                    content: "";
                }

                .gx-prev::after {
                    border-right: 15px solid #fff;
                    left: 10px;
                }

                .gx-next::after {
                    border-left: 15px solid #fff;
                    right: 10px;
                }

				.gx-controls {
					position: fixed;
					top: 0px;
					right: 170px;
					background: #0000;
					padding: 1px 10px;
					border-radius: 0px;
					z-index: 10001;
					display: flex;
					gap: 5px;
					align-items: center;
				}

				.gx-controls button {
					background: #00000070;
					border: none;
					padding: 6px 6px;
					cursor: pointer;
					border-radius: 0px;
					font-size: 10px;
				}

                .gx-controls button:hover {
                    background: #444;
                }

                .gx-labels {
                    position: fixed;
                    bottom: 20px;
                    right: 170px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    z-index: 10001;
                }

                .gx-name, .gx-count {
                    background: rgba(0,0,0,0.8);
                    border-radius: 3px;
                    padding: 5px 10px;
                    margin-top: 5px;
                    color: #fff;
                    font-size: 13px;
                }

                .gx-name {
                    max-width: 400px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
    /* Simple fix: Timeline spans full width, buttons get proper spacing */
video::-webkit-media-controls-panel {
    background: transparent !important;
    background-image: none !important;
    height: 40px !important;
    position: absolute !important;
    width: 100% !important;
    opacity: 0.9 !important;
    transition: opacity 0.3s ease-out !important;
    z-index: 9999 !important;
    border-radius: 0 !important;
}

    /* Background styles */
video::-webkit-media-controls-enclosure {
    background: transparent !important;
    width: 100% !important;
    height: 40px !important;
    position: absolute !important;
    left: 0 !important;
    right: 0 !important;
    opacity: 0.9 !important;
    transition: opacity 0.3s ease-out !important;
    z-index: 9999 !important;
    overflow: visible !important;
    margin: 0 !important;
    padding: 0 !important;
}

video::-webkit-media-controls-overlay-enclosure,
video::-webkit-media-controls-overlay-play-button {
    background: transparent !important;
    background-image: none !important;
    z-index: 9999 !important;
}

/* Timeline: Full width at bottom, thin strip */
video::-webkit-media-controls-timeline {
    background: linear-gradient(to right,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.1) 100%) !important;
    height: 3px !important;
    width: 100% !important;
    border-radius: 0 !important;
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* Make timeline clickable area bigger without visual change */
video::-webkit-media-controls-timeline::-webkit-slider-runnable-track {
    height: 8px !important;
    margin-top: -2px !important;
}

video::-webkit-media-controls-timeline::-webkit-slider-thumb {
    background: #ffffffe6 !important;
    border-radius: 50% !important;
    width: 12px !important;
    height: 12px !important;
    opacity: 1 !important;
}



/* Remove rounded edges only - keep default sizing and alignment */
video::-webkit-media-controls-play-button,
video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-fullscreen-button,
video::-webkit-media-controls-volume-slider {
    border-radius: 0 !important;
    -webkit-border-radius: 0 !important;
}

video::-webkit-media-controls-current-time-display,
video::-webkit-media-controls-time-remaining-display {
    color: rgba(255, 255, 255, 0.9) !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    font-size: 12px !important;
    margin: 0 5px !important;
}

video::-webkit-media-controls-play-button:hover,
video::-webkit-media-controls-mute-button:hover,
video::-webkit-media-controls-fullscreen-button:hover,
video::-webkit-media-controls-volume-slider:hover {
    opacity: 1 !important;
}

/* Fullscreen same approach */
video:fullscreen::-webkit-media-controls-panel,
video:-webkit-full-screen::-webkit-media-controls-panel {
    height: 40px !important;
    position: absolute !important;
    width: 100% !important;
    background: transparent !important;
    opacity: 0.9 !important;
    transition: opacity 0.3s ease-out !important;
    z-index: 9999 !important;
}

video:fullscreen::-webkit-media-controls-enclosure,
video:-webkit-full-screen::-webkit-media-controls-enclosure {
    width: 100% !important;
    height: 40px !important;
    position: absolute !important;
    background: transparent !important;
    opacity: 0.9 !important;
    z-index: 9999 !important;
    overflow: visible !important;
}

video:fullscreen::-webkit-media-controls-timeline,
video:-webkit-full-screen::-webkit-media-controls-timeline {
    background: linear-gradient(to right,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.1) 100%) !important;
    height: 3px !important;
    width: 100% !important;
    border-radius: 0 !important;
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    margin: 0 !important;
}

video:hover::-webkit-media-controls-panel,
video:hover::-webkit-media-controls-enclosure,
video:active::-webkit-media-controls-panel,
video:active::-webkit-media-controls-enclosure,
video:focus::-webkit-media-controls-panel,
video:focus::-webkit-media-controls-enclosure {
    opacity: 0.9 !important;
}            `;
            document.head.appendChild(style);
        },

        collectMedia() {
            this.files = [];
            const links = document.querySelectorAll('.imgLink');

            links.forEach(link => {
                const mime = link.dataset.filemime || '';
                const href = link.href;

                if (mime.indexOf('image/') > -1 || mime.indexOf('video/') > -1) {
                    // Get original filename
                    const nameLink = link.parentElement.querySelector('.originalNameLink');
                    const originalName = nameLink ? nameLink.textContent.trim() : href.split('/').pop();

                    // Get thumbnail
                    const thumb = link.querySelector('img');
                    const thumbSrc = thumb ? thumb.src : null;

                    this.files.push({
                        url: href,
                        mime: mime,
                        isVideo: mime.indexOf('video/') > -1,
                        originalName: originalName,
                        thumbSrc: thumbSrc
                    });
                }
            });
        },

        hijackGalleryButton() {
            const galleryLink = document.getElementById('galleryLink');
            if (!galleryLink) return;

            galleryLink.onclick = (e) => {
                e.preventDefault();
                if (this.files.length === 0) {
                    alert('No images/videos to display');
                    return;
                }
                this.openGallery();
            };
        },

        openGallery() {
            this.isOpen = true;
            this.createGalleryUI();
            this.displayMedia(this.currentIndex);
            this.setupKeyboard();
        },

        createGalleryUI() {
            const panel = document.createElement('div');
            panel.id = 'galleryXPanel';

            // Create viewport
            const viewport = document.createElement('div');
            viewport.className = 'gx-viewport';

            // Previous button
            const prevBtn = document.createElement('div');
            prevBtn.className = 'gx-prev';
            prevBtn.onclick = () => this.navigate(-1);
            viewport.appendChild(prevBtn);

            // Image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'gx-image-container';
            imageContainer.id = 'gxImageContainer';
            viewport.appendChild(imageContainer);

            // Next button
            const nextBtn = document.createElement('div');
            nextBtn.className = 'gx-next';
            nextBtn.onclick = () => this.navigate(1);
            viewport.appendChild(nextBtn);

            // Thumbnails sidebar
            const thumbnails = document.createElement('div');
            thumbnails.className = 'gx-thumbnails';
            thumbnails.id = 'gxThumbnails';
            this.files.forEach((file, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'gx-thumb';
                thumb.dataset.index = index;

                if (file.isVideo) {
                    const video = document.createElement('video');
                    video.src = file.url;
                    video.muted = true;
                    thumb.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = file.thumbSrc || file.url;
                    thumb.appendChild(img);
                }

                thumb.onclick = () => this.displayMedia(index);
                thumbnails.appendChild(thumb);
            });
            viewport.appendChild(thumbnails);

            panel.appendChild(viewport);

            // Controls
            const controls = document.createElement('div');
            controls.className = 'gx-controls';
            controls.innerHTML = `
                <button id="gxClose">Close (Esc)</button>
                <button id="gxDownload">Download</button>
                <button id="gxSlideshow">Slideshow</button>
            `;
            panel.appendChild(controls);

            // Labels
            const labels = document.createElement('div');
            labels.className = 'gx-labels';
            labels.innerHTML = `
                <div class="gx-count" id="gxCount"></div>
                <div class="gx-name" id="gxName"></div>
            `;
            panel.appendChild(labels);

            document.body.appendChild(panel);

            // Event listeners
            document.getElementById('gxClose').onclick = () => this.closeGallery();
            document.getElementById('gxDownload').onclick = () => this.downloadCurrent();
            document.getElementById('gxSlideshow').onclick = () => this.toggleSlideshow();
        },

        displayMedia(index) {
            if (index < 0) index = 0;
            if (index >= this.files.length) index = this.files.length - 1;

            this.currentIndex = index;
            const file = this.files[index];
            const container = document.getElementById('gxImageContainer');

            // Clear previous media
            container.innerHTML = '';

            // Create appropriate element
            let media;
            if (file.isVideo) {
                media = document.createElement('video');
                media.controls = true;
                media.autoplay = true;
                media.loop = true;
                media.src = file.url;
            } else {
                media = document.createElement('img');
                media.src = file.url;
            }

            container.appendChild(media);

            // Update thumbnail highlight
            document.querySelectorAll('.gx-thumb').forEach(thumb => {
                thumb.classList.remove('gx-highlight');
            });
            const currentThumb = document.querySelector(`.gx-thumb[data-index="${index}"]`);
            if (currentThumb) {
                currentThumb.classList.add('gx-highlight');
                currentThumb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }

            // Update labels
            document.getElementById('gxCount').textContent = `${index + 1} / ${this.files.length}`;
            document.getElementById('gxName').textContent = file.originalName;
            document.getElementById('gxName').title = file.originalName;

            // Preload adjacent
            this.preloadAdjacent(index);
        },

        preloadAdjacent(index) {
            if (index > 0 && !this.files[index - 1].isVideo) {
                const prev = new Image();
                prev.src = this.files[index - 1].url;
            }
            if (index < this.files.length - 1 && !this.files[index + 1].isVideo) {
                const next = new Image();
                next.src = this.files[index + 1].url;
            }
        },

        navigate(direction) {
            let newIndex = this.currentIndex + direction;
            if (newIndex < 0) newIndex = this.files.length - 1;
            if (newIndex >= this.files.length) newIndex = 0;
            this.displayMedia(newIndex);
        },

        setupKeyboard() {
            this.keyHandler = (e) => {
                if (!this.isOpen) return;

                switch(e.key) {
                    case 'Escape':
                        this.closeGallery();
                        break;
                    case 'ArrowLeft':
                        this.navigate(-1);
                        e.preventDefault();
                        break;
                    case 'ArrowRight':
                        this.navigate(1);
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        this.navigate(-10);
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        this.navigate(10);
                        e.preventDefault();
                        break;
                    case 'Home':
                        this.displayMedia(0);
                        e.preventDefault();
                        break;
                    case 'End':
                        this.displayMedia(this.files.length - 1);
                        e.preventDefault();
                        break;
                    case 'Delete':
                        this.removeCurrentFromGallery();
                        e.preventDefault();
                        break;
                }
            };

            document.addEventListener('keydown', this.keyHandler);
        },

        removeCurrentFromGallery() {
            const thumbToRemove = document.querySelector(`.gx-thumb[data-index="${this.currentIndex}"]`);
            if (thumbToRemove) thumbToRemove.remove();

            this.files.splice(this.currentIndex, 1);

            if (this.files.length === 0) {
                this.closeGallery();
                return;
            }

            if (this.currentIndex >= this.files.length) {
                this.currentIndex = this.files.length - 1;
            }

            // Re-index remaining thumbnails
            document.querySelectorAll('.gx-thumb').forEach((thumb, idx) => {
                thumb.dataset.index = idx;
            });

            this.displayMedia(this.currentIndex);
        },

        downloadCurrent() {
            const file = this.files[this.currentIndex];
            const a = document.createElement('a');
            a.href = file.url;
            a.download = file.originalName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },

        toggleSlideshow() {
            const btn = document.getElementById('gxSlideshow');
            if (this.slideshowInterval) {
                clearInterval(this.slideshowInterval);
                this.slideshowInterval = null;
                btn.textContent = 'Slideshow';
            } else {
                btn.textContent = 'Stop Slideshow';
                this.slideshowInterval = setInterval(() => {
                    this.navigate(1);
                }, 3000);
            }
        },

        closeGallery() {
            this.isOpen = false;
            const panel = document.getElementById('galleryXPanel');
            if (panel) panel.remove();

            if (this.slideshowInterval) {
                clearInterval(this.slideshowInterval);
                this.slideshowInterval = null;
            }

            if (this.keyHandler) {
                document.removeEventListener('keydown', this.keyHandler);
            }
        }
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GalleryX.init());
    } else {
        GalleryX.init();
    }

    // Re-collect media when new content loads
    const observer = new MutationObserver(() => {
        if (!GalleryX.isOpen) {
            GalleryX.collectMedia();
        }
    });

    setTimeout(() => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 2000);

})();
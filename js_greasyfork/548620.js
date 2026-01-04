// ==UserScript==
// @name         WhoresHub Fullwidth Scroll/Grid Gallery
// @namespace    Violentmonkey Scripts
// @match        https://www.whoreshub.com/albums/*
// @version      1.2
// @author       Nimby345
// @description  fixes side scroll snapping to the current picture and adds a gallery view toggle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548620/WhoresHub%20Fullwidth%20ScrollGrid%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/548620/WhoresHub%20Fullwidth%20ScrollGrid%20Gallery.meta.js
// ==/UserScript==

    (function() {
        'use strict';

        function enableGalleryToggle() {
            const galleryThumbs = document.querySelector('.gallery-thumbs');
            const thumbsWrapper = galleryThumbs?.querySelector('.swiper-wrapper');
            if (!galleryThumbs || !thumbsWrapper) return;

            // --- Wrap gallery in scrollable box ---
            if (!document.querySelector('#thumbsScrollWrapper')) {
                const wrapper = document.createElement('div');
                wrapper.id = 'thumbsScrollWrapper';
                wrapper.style.maxHeight = '400px'; // adjust height as needed
                wrapper.style.overflowY = 'auto';
                wrapper.style.overflowX = 'hidden';
                wrapper.style.padding = '0 5px';
                galleryThumbs.parentNode.insertBefore(wrapper, galleryThumbs);
                wrapper.appendChild(galleryThumbs);
            }

            const scrollWrapper = document.querySelector('#thumbsScrollWrapper');

            // --- Inject full-width CSS ---
            const style = document.createElement('style');
            style.textContent = `
                .container { max-width: 100% !important; padding: 0 !important; }
                .gallery-top, .gallery-thumbs { width: 100% !important; max-width: 100% !important; margin: 0 !important; }
                .swiper-wrapper { width: 100% !important; }
                .swiper-slide img { width: 100% !important; object-fit: contain; }
            `;
            document.head.appendChild(style);

            // Prevent duplicate toggle button
            if (document.querySelector('#galleryToggleBtn')) return;

            // --- Create toggle button ---
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'galleryToggleBtn';
            toggleBtn.textContent = 'Toggle Grid View';
            toggleBtn.style.position = 'fixed';
            toggleBtn.style.top = '50%';
            toggleBtn.style.right = '10px';
            toggleBtn.style.zIndex = 9999;
            toggleBtn.style.padding = '6px 12px';
            toggleBtn.style.background = '#000';
            toggleBtn.style.color = '#fff';
            toggleBtn.style.border = 'none';
            toggleBtn.style.cursor = 'pointer';
            toggleBtn.style.transform = 'translateY(-50%)';
            document.body.appendChild(toggleBtn);

            let isGrid = false;

            toggleBtn.addEventListener('click', () => {
                isGrid = !isGrid;

                if (isGrid) {
                    // --- Grid mode ---
                    thumbsWrapper.style.display = 'grid';
                    thumbsWrapper.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
                    thumbsWrapper.style.gridGap = '5px';
                    thumbsWrapper.style.transform = 'none';
                    thumbsWrapper.querySelectorAll('.swiper-slide').forEach(slide => {
                        slide.style.width = '100%';
                        slide.style.margin = '0';
                    });
                    // Enable scroll inside scrollWrapper
                    scrollWrapper.style.overflowY = 'auto';
                    scrollWrapper.style.overflowX = 'hidden';
                } else {
                    // --- Side-scroll mode ---
                    thumbsWrapper.style.display = '';
                    thumbsWrapper.style.gridTemplateColumns = '';
                    thumbsWrapper.style.gridGap = '';
                    thumbsWrapper.style.transform = '';
                    thumbsWrapper.querySelectorAll('.swiper-slide').forEach(slide => {
                        slide.style.width = '';
                        slide.style.margin = '';

                    });
                    scrollWrapper.style.overflowY = '';
                    scrollWrapper.style.overflowX = '';
                                    // Re-enable free scrolling without snapping
                if (galleryThumbs.swiper) {
                    galleryThumbs.swiper.params.freeMode = true;
                    galleryThumbs.swiper.update();
                }
                }
            });
        }

        // --- Wait for gallery to load ---
        const observer = new MutationObserver(() => {
            if (document.querySelector('.gallery-thumbs .swiper-slide img')) {
                enableGalleryToggle();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

    })();


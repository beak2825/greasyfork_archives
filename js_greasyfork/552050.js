// ==UserScript==
// @name         4chan Gallery Viewer
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Creates a gallery from .fileThumb elements with hover preview and popup viewer.
// @match        https://boards.4chan.org/*
// @grant        GM_addStyle
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/552050/4chan%20Gallery%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/552050/4chan%20Gallery%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!window.location.pathname.includes('thread'))return;

    // Create gallery button
    const btn = document.createElement('button');
    btn.textContent = 'Open Gallery View';
    btn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:10000;padding:10px 20px;background:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;font-size:14px;';
    document.body.appendChild(btn);
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '× Close';
    closeBtn.style.cssText = 'display:none;position:fixed;top:10px;right:10px;z-index:10009;padding:10px 20px;background:#f44336;color:white;border:none;border-radius:5px;cursor:pointer;font-size:16px;';
    document.body.appendChild(closeBtn);

    btn.addEventListener('click', createGallery);
    document.addEventListener("keydown", function(event) {
        // Check if Ctrl (or Cmd on Mac) and the "g" key are pressed
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "g") {
            event.preventDefault(); // Prevent browser default (like "find next" in some browsers)
            createGallery();
        }
    });
    // Helper function to check if element is visible in viewport

    let isElementVisible = (el, partiallyVisible = true) => {
        const { top, left, bottom, right } = el.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return partiallyVisible
            ? ((top > 0 && top < innerHeight) ||
               (bottom > 0 && bottom < innerHeight)) &&
            ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
        : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    };

    function createGallery() {
        // Get all fileThumb elements
        const thumbs = document.querySelectorAll('.fileThumb');
        if (thumbs.length === 0) {
            alert('No .fileThumb elements found on this page!');
            return;
        }

        // Find the first visible thumbnail in viewport
        let firstVisibleIndex = 0;
        for (let i = 0; i < thumbs.length; i++) {
            if (isElementVisible(thumbs[i])) {
                firstVisibleIndex = i;
                break;
            }
        }

        // Create gallery overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;display:flex;';
        closeBtn.style.display = "block";
        btn.style.display = "none";

        // Create close button
        closeBtn.addEventListener('click', () => {
            overlay.remove();
            btn.style.display = "block";
            closeBtn.style.display = "none";
        });
        overlay.appendChild(closeBtn);

        // Create left sidebar for thumbnails
        const sidebar = document.createElement('div');
        sidebar.style.cssText = 'width:25vw;height:100%;overflow-y:auto;background:#111;padding:0px 0px 0px 70px;box-sizing:border-box;border-left:1px solid #fff;padding-top:60px;';

        // Create right preview area
        const previewArea = document.createElement('div');
        previewArea.style.cssText = 'width:85vw;height:100%;display:flex;align-items:center;justify-content:center;background:#000;position:relative;';

        const previewPlaceholder = document.createElement('div');
        previewPlaceholder.textContent = 'Hover over a thumbnail to preview';
        previewPlaceholder.style.cssText = 'color:#666;font-size:24px;text-align:center;';
        previewArea.appendChild(previewPlaceholder);

        let currentPreview = null;
        let currentPreviewIndex = -1;
        let galleryItems = []; // Store references to gallery items
        let isHoveringPreview = false;

        // Process each thumb
        thumbs.forEach((elem, idx) => {
            const item = document.createElement('div');

            let imgSrc = '';
            let isVideo = false;
            let videoSrc = '';

            const video = /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(elem.getAttribute('href'));
            const img = elem.querySelector('img');
            item.style.cssText = 'width:75%;position:relative;cursor:pointer;background:#222;margin-bottom:10px;transition:transform 0.2s;';
            if(video)item.style.width = "50%";
            if(video)item.style.margin = "0 auto";

            if (video) {
                isVideo = true;
                videoSrc = elem.getAttribute('href')
                imgSrc = img ? img.getAttribute('src') : '';
            } else if (img) {
                imgSrc = elem.getAttribute('href') || '';
                if(/\ds\./.test(imgSrc))imgSrc = imgSrc.replace('s.','.');
            }

            // Create thumbnail
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.style.cssText = 'width:100%;height:auto;display:block;';
            thumb.alt = 'Thumbnail ' + idx + (isVideo ? "Video" : "Image");

            if (isVideo) {
                const playIcon = document.createElement('div');
                playIcon.classList.add("playButton");
                playIcon.textContent = '▶';
                playIcon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;color:white;pointer-events:none;text-shadow:0 0 10px black;';
                item.appendChild(playIcon);
            }

            item.appendChild(thumb);

            // Hover effect - scale thumbnail and scroll main page
            item.addEventListener('mouseenter', () => {
                if(item.classList.contains("scaled"))return;
                document.querySelectorAll('.scaled').forEach(e=> {
                    e.classList.remove("scaled");
                    e.style.transform = "scale(1)";
                    if(e.querySelector(".playButton"))e.querySelector(".playButton").style.color = "white";
                });
                item.style.transform = 'scale(1.1)';
                item.classList.add("scaled");
                if(item.querySelector(".playButton"))item.querySelector(".playButton").style.color = "red";

                currentPreviewIndex = idx;

                // Scroll main page to the original image position
                elem.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Remove placeholder
                if (previewPlaceholder.parentNode) {
                    previewPlaceholder.remove();
                }

                // Remove previous preview
                if (currentPreview) {
                    currentPreview.remove();
                }

                // Create new preview
                currentPreview = document.createElement('div');
                currentPreview.style.cssText = 'max-width:95%;max-height:95%;display:flex;align-items:center;justify-content:center;';

                // Track hover state on preview
                currentPreview.addEventListener('mouseenter', () => {
                    isHoveringPreview = true;
                });
                currentPreview.addEventListener('mouseleave', () => {
                    isHoveringPreview = false;
                });

                if (isVideo && videoSrc) {
                    const previewVideo = document.createElement('video');
                    previewVideo.src = videoSrc;
                    previewVideo.autoplay = true;
                    previewVideo.loop = true;
                    previewVideo.muted = false;
                    previewVideo.controls = true;
                    previewVideo.style.cssText = 'max-width:100%;max-height:95vh;';
                    currentPreview.appendChild(previewVideo);
                } else {
                    const previewImg = document.createElement('img');
                    previewImg.src = imgSrc;
                    previewImg.style.cssText = 'max-width:100%;max-height:95vh;object-fit:contain;';
                    currentPreview.appendChild(previewImg);
                }

                previewArea.appendChild(currentPreview);
            });

            item.addEventListener('mouseleave', () => {
                //item.style.transform = 'scale(1)';
            });

            // Click to open fullscreen popup
            item.addEventListener('click', () => {
                const popup = document.createElement('div');
                popup.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.98);z-index:10003;display:flex;align-items:center;justify-content:center;';

                const closePopup = document.createElement('button');
                closePopup.textContent = '×';
                closePopup.style.cssText = 'position:absolute;top:20px;right:20px;font-size:40px;color:white;background:none;border:none;cursor:pointer;';
                closePopup.addEventListener('click', () => popup.remove());
                popup.appendChild(closePopup);

                if (isVideo && videoSrc) {
                    const popupVideo = document.createElement('video');
                    popupVideo.src = videoSrc;
                    popupVideo.controls = true;
                    popupVideo.autoplay = true;
                    popupVideo.style.cssText = 'max-width:90%;max-height:90%;';
                    popup.appendChild(popupVideo);
                } else {
                    const popupImg = document.createElement('img');
                    popupImg.src = imgSrc;
                    popupImg.style.cssText = 'max-width:90%;max-height:90%;object-fit:contain;';
                    popup.appendChild(popupImg);
                }

                popup.addEventListener('click', (e) => {
                    if (e.target === popup || e.target === closePopup) popup.remove();
                });

                document.body.appendChild(popup);
            });

            sidebar.appendChild(item);
            galleryItems.push(item); // Store reference to gallery item
        });
        // Replace this section in the wheel event listener:

        // Add wheel event listener to previewArea for scroll-to-change
        let time = 0;
        previewArea.addEventListener('wheel', (e) => {
            // Only change image if not hovering over the preview itself
            if (/*!isHoveringPreview &&*/ currentPreviewIndex !== -1) {
                let nowTime = Date.now();
                if(nowTime - time < 100)return;
                time = nowTime;
                e.preventDefault();

                let newIndex;
                if (e.deltaY > 0) {
                    // Scrolling down - next image
                    newIndex = currentPreviewIndex + 1;
                    if (newIndex >= galleryItems.length) newIndex = 0; // Loop to start
                } else {
                    // Scrolling up - previous image
                    newIndex = currentPreviewIndex - 1;
                    if (newIndex < 0) newIndex = galleryItems.length - 1; // Loop to end
                }

                // Trigger mouseenter on the new gallery item - FIXED VERSION
                galleryItems[newIndex].dispatchEvent(new MouseEvent('mouseenter', {
                    bubbles: true,
                    cancelable: true
                }));

                // Scroll to the item in sidebar
                galleryItems[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, { passive: false });


        overlay.appendChild(previewArea);
        overlay.appendChild(sidebar);
        document.body.appendChild(overlay);

        // Scroll sidebar to the first visible item
        if (galleryItems[firstVisibleIndex]) {
            setTimeout(() => {
                galleryItems[firstVisibleIndex].style.transform = "translate(3ch, 3mm)";
                galleryItems[firstVisibleIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                galleryItems[firstVisibleIndex].dispatchEvent(new MouseEvent('mouseenter', {
                    bubbles: true,
                    cancelable: true
                }));
            }, 100);
        }
    }
})();

// ==UserScript==
// @name         Warosu media grid and hover
// @namespace    warosu-filter
// @version      1.4
// @description  Grid view thumbnails show video icon + duration, hover shows full video with dynamic playbar, download link opens media in new tab and is right-clickable
// @match        https://warosu.org/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/554593/Warosu%20media%20grid%20and%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/554593/Warosu%20media%20grid%20and%20hover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let gridView = false;
    let observer = null;
    let gridContainer = null;
    let preview = null;

    // --- Control button ---
    const gridBtn = document.createElement('button');
    gridBtn.textContent = 'Grid View: OFF';
    Object.assign(gridBtn.style, {
        position: 'fixed', top: '10px', right: '10px', zIndex: '99999',
        padding: '6px 10px', background: '#444', color: 'white',
        border: '1px solid #888', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
    });
    document.body.appendChild(gridBtn);

    // --- Preview overlay ---
    preview = document.createElement('div');
    Object.assign(preview.style, {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        display: 'none', justifyContent: 'center', alignItems: 'center',
        background: 'transparent', zIndex: '99999', pointerEvents: 'none'
    });
    document.body.appendChild(preview);

    // --- Hover preview function ---
    function attachHover(wrapper, media) {
        wrapper.addEventListener('mouseenter', () => {
            preview.innerHTML = '';
            const src = media.tagName.toLowerCase() === 'img'
                ? (media.closest('a')?.href || media.src)
                : (media.currentSrc || media.src);

            const isVideo = media.tagName.toLowerCase() === 'video' || src.match(/\.(webm|mp4)$/i);
            const element = document.createElement(isVideo ? 'video' : 'img');

            if (isVideo) {
                element.src = src;
                element.autoplay = true;
                element.muted = true;
                element.loop = true;
                element.playsInline = true;
            } else {
                element.src = src;
            }

            Object.assign(element.style, {
                maxWidth: '100vw', maxHeight: '100vh',
                objectFit: 'contain', borderRadius: '6px'
            });

            const container = document.createElement('div');
            Object.assign(container.style, {
                position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
                width: '100%', height: '100%'
            });
            container.appendChild(element);
            preview.appendChild(container);
            preview.style.display = 'flex';

            if (isVideo) {
                // Playbar
                const playbarContainer = document.createElement('div');
                Object.assign(playbarContainer.style, {
                    position: 'absolute', bottom: '20px', height: '8px',
                    background: 'rgba(0,0,0,0.2)', borderRadius: '3px',
                });
                container.appendChild(playbarContainer);

                const playbarFill = document.createElement('div');
                Object.assign(playbarFill.style, { width: '0%', height: '100%', background: 'lime', borderRadius: '3px' });
                playbarContainer.appendChild(playbarFill);

                const timeLabel = document.createElement('div');
                Object.assign(timeLabel.style, {
                    position: 'absolute', bottom: '30px', right: '10px',
                    padding: '2px 4px', fontSize: '12px', color: 'white',
                    background: 'rgba(0,0,0,0.6)', borderRadius: '3px', pointerEvents: 'none'
                });
                container.appendChild(timeLabel);

                function updatePlaybar() {
                    playbarContainer.style.width = element.clientWidth + 'px';
                    playbarContainer.style.left = element.offsetLeft + 'px';
                }

                element.addEventListener('loadedmetadata', () => {
                    updatePlaybar();
                    timeLabel.textContent = `0 / ${Math.floor(element.duration)}s`;
                });

                element.addEventListener('timeupdate', () => {
                    if (element.duration > 0) {
                        const pct = (element.currentTime / element.duration) * 100;
                        playbarFill.style.width = pct + '%';
                        timeLabel.textContent = `${Math.floor(element.currentTime)} / ${Math.floor(element.duration)}s`;
                    }
                });

                window.addEventListener('resize', updatePlaybar);
            }
        });

        wrapper.addEventListener('mouseleave', () => {
            preview.style.display = 'none';
            preview.innerHTML = '';
        });
    }

    // --- Grid View ---
    function buildGrid() {
        if (gridContainer) gridContainer.remove();
        gridContainer = document.createElement('div');
        Object.assign(gridContainer.style, {
            position: 'fixed', top: '50px', left: '0',
            width: '100%', height: 'calc(100% - 60px)',
            background: '#111', display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '10px', padding: '10px', overflowY: 'scroll',
            zIndex: '99998'
        });

        const mediaElems = document.querySelectorAll('img.thumb, video');
        mediaElems.forEach(media => {
            const post = media.closest('.post, table, div');
            if (!post) return;

            const mediaBlock = document.createElement('div');
            mediaBlock.style.display = 'flex';
            mediaBlock.style.flexDirection = 'column';
            mediaBlock.style.alignItems = 'center';
            mediaBlock.style.background = '#222';
            mediaBlock.style.borderRadius = '6px';
            mediaBlock.style.padding = '4px';
            mediaBlock.style.boxSizing = 'border-box';
            mediaBlock.style.minHeight = '180px';

            const thumbWrapper = document.createElement('a');
            thumbWrapper.href = '#';
            thumbWrapper.style.display = 'flex';
            thumbWrapper.style.justifyContent = 'center';
            thumbWrapper.style.alignItems = 'center';
            thumbWrapper.style.width = '100%';
            thumbWrapper.style.cursor = 'pointer';
            thumbWrapper.style.position = 'relative';

            const clone = media.cloneNode(true);
            Object.assign(clone.style, { maxWidth: '100%', maxHeight: '160px', objectFit: 'contain', display: 'block' });
            thumbWrapper.appendChild(clone);

            thumbWrapper.addEventListener('click', e => {
                e.preventDefault();
                post.scrollIntoView({ behavior: 'smooth', block: 'center' });
                gridView = false;
                gridContainer.remove();
                gridBtn.textContent = 'Grid View: OFF';
                gridBtn.style.background = '#444';
            });

            attachHover(thumbWrapper, media);

            // --- Add video icon + duration overlay for grid ---
            const isVideo = media.tagName.toLowerCase() === 'video' || (media.closest('a')?.href || '').match(/\.(webm|mp4)$/i);
            if (isVideo) {
                const icon = document.createElement('div');
                icon.textContent = '▶';
                Object.assign(icon.style, {
                    position: 'absolute', top: '2px', right: '2px',
                    fontSize: '12px', color: 'white', background: 'rgba(0,0,0,0.6)',
                    borderRadius: '3px', padding: '1px 3px', pointerEvents: 'none'
                });
                thumbWrapper.appendChild(icon);

                const tempVideo = document.createElement('video');
                tempVideo.preload = 'metadata';
                tempVideo.src = media.tagName.toLowerCase() === 'video' ? media.currentSrc || media.src : media.closest('a')?.href;
                tempVideo.addEventListener('loadedmetadata', () => {
                    const durationLabel = document.createElement('div');
                    durationLabel.textContent = Math.floor(tempVideo.duration) + 's';
                    Object.assign(durationLabel.style, {
                        position: 'absolute', top: '2px', left: '2px',
                        fontSize: '12px', color: 'white', background: 'rgba(0,0,0,0.6)',
                        borderRadius: '3px', padding: '1px 3px', pointerEvents: 'none'
                    });
                    thumbWrapper.appendChild(durationLabel);
                });
            }

            // --- Add download link for both images and videos ---
            const downloadLink = document.createElement('a');
            downloadLink.textContent = 'Download';
            downloadLink.href = media.tagName.toLowerCase() === 'video' ? media.currentSrc || media.src : media.closest('a')?.href || media.src;
            downloadLink.target = '_blank';
            downloadLink.style.cssText = `
                margin-top: 4px;
                padding: 2px 6px;
                font-size: 12px;
                background: #0f0;
                border: 1px solid #000;
                border-radius: 3px;
                display: inline-block;
                text-decoration: none;
                color: black;
                text-align: center;
            `;
            // STOP event propagation so right-click works
            downloadLink.addEventListener('click', e => e.stopPropagation());
            downloadLink.addEventListener('mousedown', e => e.stopPropagation());

            mediaBlock.appendChild(thumbWrapper);
            mediaBlock.appendChild(downloadLink);
            gridContainer.appendChild(mediaBlock);
        });

        document.body.appendChild(gridContainer);
    }

    gridBtn.addEventListener('click', () => {
        gridView = !gridView;
        gridBtn.textContent = gridView ? 'Grid View: ON' : 'Grid View: OFF';
        gridBtn.style.background = gridView ? '#2a7' : '#444';

        if (gridView) buildGrid();
        else if (gridContainer) gridContainer.remove();
    });

    // --- Attach hover to all posts ---
    function addHoverToPosts() {
        const mediaElems = document.querySelectorAll('.comment img, .comment video');
        mediaElems.forEach(media => {
            if (media.dataset.hoverAttached) return;
            media.dataset.hoverAttached = 'true';
            media.style.cursor = 'pointer';
            attachHover(media, media);
        });
    }

    addHoverToPosts();

    if (!observer) {
        observer = new MutationObserver(() => addHoverToPosts());
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();

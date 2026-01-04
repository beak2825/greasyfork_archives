// ==UserScript==
// @name        Universal Picture-in-Picture
// @description PiP button on video hover + keyboard shortcut (Alt+P)
// @author      TropicalFrog3
// @license     MIT
// @match       *://*/*
// @include     *
// @version     1.0.0
// @grant       none
// @run-at      document-idle
// @noframes    false
// @namespace https://greasyfork.org/users/1295772
// @downloadURL https://update.greasyfork.org/scripts/560554/Universal%20Picture-in-Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/560554/Universal%20Picture-in-Picture.meta.js
// ==/UserScript==

(() => {
    console.log('[PiP] Script loaded on:', window.location.hostname);

    const pipBtn = document.createElement('button');
    let currentVideo = null;
    let hideTimeout = null;
    let isVisible = false;

    let isDragging = false;
    let dragStartX, dragStartY;
    let customOffset = JSON.parse(localStorage.getItem('pipBtnOffset')) || null;

    const scoreVideo = (video) => {
        const rect = video.getBoundingClientRect();
        if (rect.width < 100 || rect.height < 100) return -999;
        let score = rect.width * rect.height;
        if (video.duration > 60) score += 10000;
        const adIndicators = ['ad-', 'ads-', 'advertisement', 'sponsor', 'preroll'];
        const videoStr = (video.className + video.id).toLowerCase();
        if (adIndicators.some(ad => videoStr.includes(ad))) return -999;
        return score;
    };

    const getBestVideo = () => {
        const videos = [...document.querySelectorAll('video')];
        if (!videos.length) return null;
        return videos.reduce((best, v) => scoreVideo(v) > scoreVideo(best) ? v : best);
    };

    const createPipIcon = () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'white');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z');

        svg.appendChild(path);
        return svg;
    };

    const createExitIcon = () => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '20');
        svg.setAttribute('height', '20');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'white');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z');

        svg.appendChild(path);
        return svg;
    };

    const setButtonIcon = (isExit) => {
        pipBtn.textContent = '';
        pipBtn.appendChild(isExit ? createExitIcon() : createPipIcon());
        pipBtn.title = isExit ? 'Exit PiP (Alt+P)' : 'Picture-in-Picture (Alt+P)';
    };

    const initButton = () => {
        setButtonIcon(false);
        pipBtn.id = 'universal-pip-btn';

        pipBtn.addEventListener('mouseenter', () => {
            console.log('[PiP] Button mouseenter - pausing timer');
            clearTimeout(hideTimeout);
        });
        pipBtn.addEventListener('mouseleave', () => {
            if (!isDragging) {
                console.log('[PiP] Button mouseleave - starting 3s timer');
                startHideTimer();
            }
        });
        pipBtn.addEventListener('click', (e) => {
            if (!isDragging) togglePip(e);
        });

        pipBtn.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);

        pipBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            customOffset = null;
            localStorage.removeItem('pipBtnOffset');
            console.log('[PiP] Position reset to default');
            if (currentVideo) {
                const rect = currentVideo.getBoundingClientRect();
                pipBtn.style.top = (rect.top + 12) + 'px';
                pipBtn.style.right = (window.innerWidth - rect.right + 12) + 'px';
            }
        });

        document.body.appendChild(pipBtn);
        applyHiddenStyle();
    };

    const applyHiddenStyle = () => {
        pipBtn.style.cssText = `
            position: fixed;
            z-index: 2147483647;
            padding: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: grab;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            transition: opacity 0.3s ease-out;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        `;
    };

    const togglePip = async (e) => {
        if (e) { e.stopPropagation(); e.preventDefault(); }
        const video = currentVideo || getBestVideo();
        if (!video) return console.log('[PiP] No video found');
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                video.removeAttribute('disablePictureInPicture');
                video.disablePictureInPicture = false;
                await video.requestPictureInPicture();
            }
        } catch (err) {
            console.error('[PiP] Failed:', err);
        }
    };

    const startHideTimer = () => {
        clearTimeout(hideTimeout);
        hideTimeout = setTimeout(() => {
            console.log('[PiP] Timer fired - hiding button');
            hideButton();
        }, 3000);
    };

    const hideButton = () => {
        console.log('[PiP] hideButton called');
        isVisible = false;
        pipBtn.style.opacity = '0';
        setTimeout(() => {
            if (!isVisible) {
                pipBtn.style.visibility = 'hidden';
                pipBtn.style.pointerEvents = 'none';
            }
        }, 300);
    };

    const onDragStart = (e) => {
        isDragging = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        pipBtn.style.cursor = 'grabbing';
        clearTimeout(hideTimeout);
    };

    const onDragMove = (e) => {
        if (dragStartX === undefined) return;

        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;

        if (!isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            isDragging = true;
        }

        if (isDragging && currentVideo) {
            const rect = currentVideo.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            pipBtn.style.top = (rect.top + offsetY) + 'px';
            pipBtn.style.right = (window.innerWidth - rect.left - offsetX - pipBtn.offsetWidth) + 'px';

            customOffset = {
                xPercent: offsetX / rect.width,
                yPercent: offsetY / rect.height
            };
        }
    };

    const onDragEnd = () => {
        if (isDragging && customOffset) {
            localStorage.setItem('pipBtnOffset', JSON.stringify(customOffset));
            console.log('[PiP] Position saved:', customOffset);
        }
        dragStartX = undefined;
        dragStartY = undefined;
        pipBtn.style.cursor = 'grab';

        setTimeout(() => { isDragging = false; }, 10);
        startHideTimer();
    };

    const getButtonPosition = (rect) => {
        if (customOffset) {
            const offsetX = customOffset.xPercent * rect.width;
            const offsetY = customOffset.yPercent * rect.height;
            return {
                top: rect.top + offsetY,
                right: window.innerWidth - rect.left - offsetX - pipBtn.offsetWidth
            };
        }
        return {
            top: rect.top + 12,
            right: window.innerWidth - rect.right + 12
        };
    };

    const showButton = (video) => {
        if (!video || scoreVideo(video) < 0) return;

        const wasHidden = !isVisible;
        currentVideo = video;
        isVisible = true;

        const rect = video.getBoundingClientRect();
        const pos = getButtonPosition(rect);

        pipBtn.style.top = pos.top + 'px';
        pipBtn.style.right = pos.right + 'px';
        pipBtn.style.opacity = '1';
        pipBtn.style.visibility = 'visible';
        pipBtn.style.pointerEvents = 'auto';

        if (wasHidden) {
            console.log('[PiP] Button shown - starting 3s hide timer');
            startHideTimer();
        }
    };

    const handleMouseMove = (e) => {
        const videos = document.querySelectorAll('video');
        for (const video of videos) {
            const rect = video.getBoundingClientRect();
            if (rect.width < 50 || rect.height < 50) continue;

            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                showButton(video);
                return;
            }
        }
    };

    const handleScroll = () => {
        if (currentVideo && isVisible && !isDragging) {
            const rect = currentVideo.getBoundingClientRect();
            const pos = getButtonPosition(rect);
            pipBtn.style.top = pos.top + 'px';
            pipBtn.style.right = pos.right + 'px';
        }
    };

    const handleKeydown = (e) => {
        if (e.altKey && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            togglePip();
        }
    };

    document.addEventListener('enterpictureinpicture', () => {
        setButtonIcon(true);
    });
    document.addEventListener('leavepictureinpicture', () => {
        setButtonIcon(false);
    });

    const init = () => {
        try {
            if (document.getElementById('universal-pip-btn')) {
                console.log('[PiP] Already initialized');
                return;
            }

            console.log('[PiP] Running initButton...');
            initButton();
            console.log('[PiP] initButton done, adding event listeners...');

            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
            window.addEventListener('scroll', handleScroll, { passive: true });
            document.addEventListener('keydown', handleKeydown);

            console.log('[PiP] Event listeners added');

            const checkVideos = () => {
                const videos = document.querySelectorAll('video');
                console.log('[PiP] Found', videos.length, 'video(s)');
                videos.forEach((v, i) => {
                    const rect = v.getBoundingClientRect();
                    console.log(`[PiP] Video ${i}: ${rect.width}x${rect.height}, duration: ${v.duration}`);
                });
            };

            checkVideos();
            setTimeout(checkVideos, 2000);

            console.log('[Universal PiP] Ready - hover over video or press Alt+P');
        } catch (err) {
            console.error('[PiP] Init error:', err);
        }
    };

    const tryInit = () => {
        if (document.body) {
            console.log('[PiP] document.body exists, initializing...');
            init();
        } else {
            console.log('[PiP] Waiting for document.body...');
            document.addEventListener('DOMContentLoaded', init);
        }
    };

    tryInit();

    setTimeout(() => {
        if (!document.getElementById('universal-pip-btn')) {
            console.log('[PiP] Delayed init attempt...');
            init();
        }
    }, 1000);

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[PiP] URL changed, re-checking...');
            setTimeout(() => {
                const videos = document.querySelectorAll('video');
                console.log('[PiP] After navigation:', videos.length, 'video(s)');
            }, 1000);
        }
    }).observe(document.documentElement, { subtree: true, childList: true });
})();

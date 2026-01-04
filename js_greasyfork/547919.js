// ==UserScript==
// @name                    YouTube - Miniplayer
// @name:fr                 YouTube - Lecteur réduit
// @name:es                 YouTube - Minirreproductor
// @name:de                 YouTube - Miniplayer
// @name:it                 YouTube - Miniplayer
// @name:zh-CN              YouTube - Miniplayer
// @namespace               https://gist.github.com/4lrick/5a54e121bdc9056a7551529669d65ae6
// @version                 1.1
// @description             Shows a mini player when you scroll past the video.
// @description:fr          Affiche un lecteur réduit quand vous faites défiler sous la vidéo.
// @description:es          Muestra un minirreproductor al desplazarte más allá del video.
// @description:de          Zeigt einen Miniplayer, sobald Sie am Video vorbeiscrollen.
// @description:it          Mostra un miniplayer quando scorri oltre il video.
// @description:zh-CN       在滚动越过视频时显示迷你播放器。
// @author                  4lrick
// @match                   https://www.youtube.com/*
// @icon                    https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant                   none
// @license                 GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/547919/YouTube%20-%20Miniplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/547919/YouTube%20-%20Miniplayer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CFG = {
        rawVideoSelector: '.html5-video-container',
        mainPlayerSelector: '#movie_player',
        miniPlayerClass: 'mpu-mini-player',
        widthPx: 480,
        scrollThreshold: 300,
        autohideDelayMs: 2000,
        transitionDurationMs: 300,
    };

    function injectStyle() {
        if (document.getElementById('mpu-style')) return;
        const style = document.createElement('style');
        style.id = 'mpu-style';
        style.textContent = `
        /* Mini player container */
        .${CFG.miniPlayerClass} {
            position: fixed !important;
            width: ${CFG.widthPx}px !important;
            height: ${Math.round(CFG.widthPx * 9 / 16)}px !important;
            right: 16px !important;
            bottom: 16px !important;
            background: #000;
            overflow: hidden !important;
            border-radius: 12px !important;
            opacity: 0;
            transform: scale(0.8) !important;
            transition: opacity ${CFG.transitionDurationMs}ms ease, transform ${CFG.transitionDurationMs}ms ease !important;
            user-select: none;
        }
        .${CFG.miniPlayerClass}.visible {
            opacity: 1;
            transform: scale(1) !important;
        }

        /* Ensure the video fills the mini player */
        .${CFG.miniPlayerClass} ${CFG.rawVideoSelector},
        .${CFG.miniPlayerClass} video.html5-main-video {
            width: 100% !important;
            height: 100% !important;
            left: 0 !important;
        }
        .${CFG.miniPlayerClass} ${CFG.rawVideoSelector} {
            position: static !important;
        }

        /* Controls bar */
        .${CFG.miniPlayerClass} .mpu-controls {
            position: absolute !important;
            left: 0; right: 0; bottom: 0;
            display: flex; align-items: center; gap: 8px;
            color: #fff; font: 12px/1.2 system-ui, sans-serif;
            user-select: none; pointer-events: auto;
            padding: 4px;
        }

        /* Bottom buttons */
        .${CFG.miniPlayerClass} .mpu-btn {
            cursor: pointer;
        }
        .${CFG.miniPlayerClass} .mpu-btn-play,
        .${CFG.miniPlayerClass} .mpu-btn-fullscreen {
            background: transparent; border: none;
            display: flex;
        }
        .${CFG.miniPlayerClass} .mpu-btn-play::before {
            content: '';
            width: 28px; height: 28px;
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M12,26 L18.5,22 L18.5,14 L12,10 Z M18.5,22 L25,18 L25,18 L18.5,14 Z" fill="%23fff"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
        }
        .${CFG.miniPlayerClass} .mpu-btn-play.playing::before {
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M12,26 L16,26 L16,10 L12,10 Z M21,26 L25,26 L25,10 L21,10 Z" fill="%23fff"/></svg>');
        }
        .${CFG.miniPlayerClass} .mpu-btn-fullscreen { margin-left: auto; }
        .${CFG.miniPlayerClass} .mpu-btn-fullscreen::before {
            content: '';
            width: 28px; height: 28px;
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M10,16 h2 v-4 h4 v-2 h-6 v6 z" fill="%23fff"/><path d="M20,10 v2 h4 v4 h2 v-6 h-6 z" fill="%23fff"/><path d="M24,24 h-4 v2 h6 v-6 h-2 v4 z" fill="%23fff"/><path d="M12,20 h-2 v6 h6 v-2 h-4 v-4 z" fill="%23fff"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
        }
        .${CFG.miniPlayerClass} .mpu-btn-fullscreen.fullscreen::before {
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M14,14 h-4 v2 h6 v-6 h-2 v4 z" fill="%23fff"/><path d="M22,14 v-4 h-2 v6 h6 v-2 h-4 z" fill="%23fff"/><path d="M20,26 h2 v-4 h4 v-2 h-6 v6 z" fill="%23fff"/><path d="M10,22 h4 v4 h2 v-6 h-6 v2 z" fill="%23fff"/></svg>');
        }

        /* Top buttons */
        .${CFG.miniPlayerClass} .mpu-btn-top {
            position: absolute; top: 0 !important;
            background: transparent; border: none;
            display: flex;
            padding: 8px;
        }
        .${CFG.miniPlayerClass} .mpu-btn-close { right: 0; }
        .${CFG.miniPlayerClass} .mpu-btn-scroll-up::before {
            content: '';
            width: 24px; height: 24px;
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g transform="translate(12,12) scale(-1,1) translate(-12,-12)"><path d="M19,19 L5,19 L5,5 L12,5 L12,3 L5,3 C3.89,3 3,3.9 3,5 L3,19 C3,20.1 3.89,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,12 L19,12 L19,19 Z M14,3 L14,5 L17.59,5 L7.76,14.83 L9.17,16.24 L19,6.41 L19,10 L21,10 L21,3 L14,3 Z" fill="%23fff"/></g></svg>');
            background-size: contain;
            background-repeat: no-repeat;
        }
        .${CFG.miniPlayerClass} .mpu-btn-close::before {
            content: '';
            width: 24px; height: 24px;
            background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="%23fff"/></svg>');
            background-size: contain;
            background-repeat: no-repeat;
        }

        /* Autohide behavior */
        .${CFG.miniPlayerClass} .mpu-controls,
        .${CFG.miniPlayerClass} .mpu-btn-top,
        .${CFG.miniPlayerClass} .mpu-progress-container,
        .${CFG.miniPlayerClass} .ytp-gradient { transition: opacity 150ms ease; }

        .${CFG.miniPlayerClass}.ytp-autohide .mpu-controls,
        .${CFG.miniPlayerClass}.ytp-autohide .mpu-btn-top,
        .${CFG.miniPlayerClass}.ytp-autohide .mpu-progress-container,
        .${CFG.miniPlayerClass}.ytp-autohide .ytp-gradient {
            opacity: 0; pointer-events: none;
        }

        /* Progress bar */
        .${CFG.miniPlayerClass} .mpu-progress-container {
        position: absolute; left: 8px; right: 8px; bottom: 40px;
        }
        @-moz-document url-prefix() {
            .${CFG.miniPlayerClass} .mpu-progress-container {
            bottom: 30px;
            }
        }

        .${CFG.miniPlayerClass} .mpu-slider {
            --bar-h: 4px;
            --thumb: 13px;
            --fill: 0%;

            --accent: var(--yt-spec-static-brand-red, #f03);
            --accent2: #ff2791;
            --track-bg: rgba(255,255,255,0.2);
            --fill-gradient: linear-gradient(to right, var(--accent) 80%, var(--accent2) 100%);

            -webkit-appearance: none;
            width: -webkit-fill-available;
            width: -moz-available;
            cursor: pointer;
            background: none;
        }
        .${CFG.miniPlayerClass} .mpu-slider:hover { --bar-h: 6px; }

        .${CFG.miniPlayerClass} .mpu-slider::-webkit-slider-runnable-track {
            height: var(--bar-h);
            background:
            var(--fill-gradient) 0 50% / var(--fill) var(--bar-h) no-repeat,
            linear-gradient(var(--track-bg), var(--track-bg)) 0 50% / 100% var(--bar-h) no-repeat;
        }
        .${CFG.miniPlayerClass} .mpu-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: var(--thumb); height: var(--thumb);
            border-radius: 50%;
            background: var(--accent);
            margin-top: calc((var(--bar-h) - var(--thumb)) / 2);
        }

        .${CFG.miniPlayerClass} .mpu-slider::-moz-range-track {
            height: var(--bar-h);
            background: var(--track-bg);
        }
        .${CFG.miniPlayerClass} .mpu-slider::-moz-range-progress {
            height: var(--bar-h);
            background: var(--fill-gradient);
        }
        .${CFG.miniPlayerClass} .mpu-slider::-moz-range-thumb {
            width: var(--thumb); height: var(--thumb);
            border: 0; border-radius: 50%;
            background: var(--accent);
        }

        /* Gradient behind controls */
        .${CFG.miniPlayerClass} .ytp-gradient {
            position: absolute; left: 0; right: 0;
            height: 64px; pointer-events: none;
            background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
        }

    `;
        document.head.appendChild(style);
    }

    let rawVideo;
    let miniPlayer;
    let playerInitialLocation = null;
    let controls = null;
    let isPlayerHidden = false;
    let autohideTimer = null;
    let observer = null;
    let loopStarted = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartLeft = 0;
    let dragStartTop = 0;

    function restoreFromMiniPlayer() {
        if (!rawVideo) return;
        if (!playerInitialLocation) return;
        const parent = playerInitialLocation.parentNode;
        if (!parent) return;
        parent.insertBefore(rawVideo, playerInitialLocation);
        if (miniPlayer) {
            miniPlayer.classList.remove('visible');
            setTimeout(() => {
                miniPlayer.remove();
                miniPlayer = null;
                controls = null;
            }, CFG.transitionDurationMs);
        }
        playerInitialLocation = null;
    }

    function attachAutohideListeners() {
        miniPlayer.addEventListener('mousemove', showControlsNow);
        miniPlayer.addEventListener('mouseenter', showControlsNow);
        miniPlayer.addEventListener('touchstart', showControlsNow, { passive: true });
        miniPlayer.addEventListener('focusin', showControlsNow);
        miniPlayer.addEventListener('mouseleave', scheduleAutohide);
    }

    function attachFullscreenListener() {
        if (!controls) return;
        const { fullscreenBtn } = controls;
        function onFullscreenChange() {
            if (document.fullscreenElement) {
                fullscreenBtn.classList.add('fullscreen');
                fullscreenBtn.title = 'Exit full screen';
            } else {
                fullscreenBtn.classList.remove('fullscreen');
                fullscreenBtn.title = 'Full screen';
            }
        }
        document.addEventListener('fullscreenchange', onFullscreenChange);
    }

    function updatePlayIcon() {
        if (!controls) return;
        const video = getVideo();
        const isPlaying = video && !video.paused;
        if (isPlaying) {
            controls.playBtn.classList.add('playing');
            controls.playBtn.title = 'Pause';
        } else {
            controls.playBtn.classList.remove('playing');
            controls.playBtn.title = 'Play';
        }
    }

    function attachVideoListeners() {
        const video = getVideo();
        if (!video) return;
        video.addEventListener('play', updatePlayIcon);
        video.addEventListener('pause', updatePlayIcon);
        video.addEventListener('timeupdate', () => { updateBars(); updateTime(); });
        updatePlayIcon();
        updateBars();
        updateTime();
    }

    function formatTime(t) {
        if (!isFinite(t) || t < 0) return '--:--';
        const s = Math.floor(t % 60).toString().padStart(2, '0');
        const m = Math.floor((t / 60) % 60).toString();
        const h = Math.floor(t / 3600);
        return h > 0 ? `${h}:${m.padStart(2, '0')}:${s}` : `${m}:${s}`;
    }

    function updateTime() {
        if (!controls) return;
        const { time } = controls;
        const video = getVideo();
        if (video) {
            time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        } else {
            time.textContent = '--:-- / --:--';
        }
    }

    function isLive() {
        const mainPlayer = document.querySelector(CFG.mainPlayerSelector);
        if (!mainPlayer) return false;
        const timeDisplay = mainPlayer.querySelector('.ytp-time-display');
        return !!(timeDisplay && timeDisplay.classList.contains('ytp-live'));
    }

    function updateBars() {
        if (!controls) return;
        const { progressBar } = controls;
        const video = getVideo();
        if (!video) return;
        let progressFraction = Math.max(0, Math.min(1, video.currentTime / video.duration));
        progressBar.slider.value = progressFraction;
        progressBar.slider.style.setProperty('--fill', `${progressFraction * 100}%`);
    }

    function attachControlListeners() {
        if (!controls) return;
        const { playBtn, fullscreenBtn, scrollUpBtn, closeBtn, progressBar } = controls;

        function onPlayClick() {
            const video = getVideo();
            if (!video) return;
            if (video.paused) video.play(); else video.pause();
            showControlsNow();
        }

        function onFullscreenClick() {
            if (document.fullscreenElement) document.exitFullscreen();
            else displayMiniPlayer().requestFullscreen();
            showControlsNow();
        }

        function onUpClick() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showControlsNow();
        }

        function onCloseClick() {
            isPlayerHidden = true;
            toggleMiniPlayer(false);
        }

        function onProgressInput(event) {
            const newProgressFraction = parseFloat(event.target.value);
            const video = getVideo();
            if (!video) return;
            video.currentTime = newProgressFraction * video.duration;
            updateBars();
            updateTime();
            showControlsNow();
        }

        playBtn.addEventListener('click', onPlayClick);
        fullscreenBtn.addEventListener('click', onFullscreenClick);
        scrollUpBtn.addEventListener('click', onUpClick);
        closeBtn.addEventListener('click', onCloseClick);
        progressBar.slider.addEventListener('input', onProgressInput);
    }

    function createGradient(position = 'bottom') {
        const gradient = document.createElement('div');
        gradient.className = 'ytp-gradient';
        if (position === 'top') {
            gradient.style.top = '-20px';
            gradient.style.transform = 'rotate(180deg)';
        } else {
            gradient.style.bottom = '-5px';
        }
        return gradient;
    }

    function createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'mpu-progress-container';

        const slider = document.createElement('input');
        slider.className = 'mpu-slider';
        slider.type = 'range';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.001';
        slider.value = '0';

        progressContainer.appendChild(slider);

        return {
            progressContainer,
            slider
        };
    }

    function createButton(type, text) {
        const btn = document.createElement('button');
        let className = `mpu-btn mpu-btn-${type}`;

        if (type === 'scroll-up' || type === 'close') {
            className += ' mpu-btn-top';
        }

        btn.className = className;
        btn.title = text;
        return btn;
    }

    function displayControls() {
        if (controls && controls.root && miniPlayer && miniPlayer.contains(controls.root)) return controls;

        const mainPlayer = document.querySelector(CFG.mainPlayerSelector);
        if (!mainPlayer) return null;

        const bottomGradient = createGradient('bottom');
        const topGradient = createGradient('top');
        miniPlayer.appendChild(bottomGradient);
        miniPlayer.appendChild(topGradient);

        const controlsRoot = document.createElement('div');
        controlsRoot.className = 'mpu-controls';

        const playBtn = createButton('play', 'Play/Pause');
        const fullscreenBtn = createButton('fullscreen', 'Full screen');
        const scrollUpBtn = createButton('scroll-up', 'Scroll to top');
        const closeBtn = createButton('close', 'Close');

        const time = document.createElement('span');
        time.textContent = '--:-- / --:--';

        controlsRoot.append(playBtn, time, fullscreenBtn);
        miniPlayer.appendChild(controlsRoot);

        const progressBar = createProgressBar();
        miniPlayer.appendChild(progressBar.progressContainer);

        miniPlayer.appendChild(scrollUpBtn);
        miniPlayer.appendChild(closeBtn);
        controls = { root: controlsRoot, playBtn, fullscreenBtn, time, scrollUpBtn, closeBtn, progressBar, bottomGradient, topGradient };
        return controls;
    }

    function onTimestampClickPreserveScroll(event) {
        if (isPlayerHidden) return;
        const anchor = event.target?.closest('a[href]');
        if (!anchor?.closest('#comments, ytd-comments')) return;

        const text = anchor.textContent?.trim();
        if (!text) return;

        const parts = text.split(':').map(p => parseInt(p, 10));
        if (parts.some(n => isNaN(n))) return;

        let seconds;
        if (parts.length === 2) {
            seconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else {
            return;
        }

        const videoElement = rawVideo?.querySelector('video');
        if (!videoElement?.duration) return;

        event.preventDefault();
        event.stopPropagation();

        videoElement.currentTime = Math.max(0, Math.min(videoElement.duration, seconds));
        showControlsNow();
    }

    function clearAutohideTimer() {
        if (autohideTimer) {
            clearTimeout(autohideTimer); autohideTimer = null;
        }
    }

    function scheduleAutohide() {
        clearAutohideTimer();
        autohideTimer = setTimeout(() => {
            if (miniPlayer) miniPlayer.classList.add('ytp-autohide');
        }, CFG.autohideDelayMs);
    }

    function showControlsNow() {
        miniPlayer.classList.remove('ytp-autohide');
        scheduleAutohide();
    }

    function getVideo() {
        return rawVideo ? rawVideo.querySelector('video') : null;
    }

    function onMiniPlayerBackgroundClick(event) {
        if (event.button !== 0) return;

        const mouseMovement = Math.abs(event.clientX - dragStartX) + Math.abs(event.clientY - dragStartY);
        if (mouseMovement > 1) return;

        const target = event.target;
        if (!target) return;
        if (isTargetInteractive(target)) return;
        const videoElement = getVideo();
        if (!videoElement) return;
        if (videoElement.paused) videoElement.play(); else videoElement.pause();
        showControlsNow();
    }

    function handleDragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
    }

    function handleDragMove(event) {
        if (!isDragging) return;

        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;

        const newLeft = Math.max(0, Math.min(window.innerWidth - CFG.widthPx, dragStartLeft + deltaX));
        const newTop = Math.max(0, Math.min(window.innerHeight - Math.round(CFG.widthPx * 9 / 16), dragStartTop + deltaY));

        miniPlayer.style.left = newLeft + 'px';
        miniPlayer.style.top = newTop + 'px';
    }

    function isTargetInteractive(target) {
        if (!target || !target.closest) return false;
        return !!(
            target.closest('.mpu-progress-container') ||
            target.closest('button')
        );
    }

    function handleDragStart(event) {
        if (event.button !== 0 || isTargetInteractive(event.target) || document.fullscreenElement === miniPlayer) return;

        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;

        const rect = miniPlayer.getBoundingClientRect();
        dragStartLeft = rect.left;
        dragStartTop = rect.top;

        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);

        event.preventDefault();
    }

    function displayMiniPlayer() {
        if (miniPlayer && document.body.contains(miniPlayer)) return miniPlayer;
        miniPlayer = document.createElement('div');
        miniPlayer.className = CFG.miniPlayerClass;
        document.body.appendChild(miniPlayer);
        miniPlayer.addEventListener('mousedown', handleDragStart);
        miniPlayer.addEventListener('click', onMiniPlayerBackgroundClick);
        document.addEventListener('click', onTimestampClickPreserveScroll, true);

        requestAnimationFrame(() => {
            miniPlayer.classList.add('visible');
        });

        return miniPlayer;
    }

    function moveToMiniPlayer() {
        if (!rawVideo || !window.location.pathname.includes('watch')) return;

        const mainPlayer = document.querySelector(CFG.mainPlayerSelector);
        const activeVideo = mainPlayer ? mainPlayer.querySelector(CFG.rawVideoSelector) : null;
        const offlineSlate = mainPlayer ? mainPlayer.querySelector('.ytp-offline-slate') : null;
        if (!activeVideo || (offlineSlate && offlineSlate.style.display !== 'none')) return;
        if (isLive()) return;

        rawVideo = activeVideo;

        playerInitialLocation = rawVideo.nextSibling;
        displayMiniPlayer().appendChild(rawVideo);
        displayControls();
        attachControlListeners();
        attachVideoListeners();
        attachFullscreenListener();
        attachAutohideListeners();
        showControlsNow();
    }

    function toggleMiniPlayer(enabled) {
        if (!rawVideo) return;

        if (enabled) {
            moveToMiniPlayer();
        } else {
            restoreFromMiniPlayer();
        }
    }

    function handleVisibility(inView) {
        if (!inView) isPlayerHidden = false;
        if (isPlayerHidden && inView) return;
        toggleMiniPlayer(inView);
    }

    function tick() {
        if (!rawVideo) return;

        handleVisibility(window.scrollY > CFG.scrollThreshold);
        requestAnimationFrame(tick);
    }

    function checkVideoExists() {
        const mainPlayer = document.querySelector(CFG.mainPlayerSelector);
        const inWatchPage = window.location.pathname.includes('watch');
        const foundVideo = mainPlayer ? mainPlayer.querySelector(CFG.rawVideoSelector) : null;
        const newVideo = (inWatchPage && foundVideo) ? foundVideo : null;
        if (rawVideo !== newVideo) {
            rawVideo = newVideo;
        }
        if (!rawVideo) return;
        if (!loopStarted) {
            loopStarted = true;
            if (observer) observer.disconnect();
            tick();
        }
    }

    function init() {
        injectStyle();
        if (observer) observer.disconnect();
        observer = new MutationObserver(checkVideoExists);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();

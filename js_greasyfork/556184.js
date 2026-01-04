// ==UserScript==
// @name         chimo-chimo-loop
// @name:zh-CN   chimo-chimo-loop
// @namespace    https://github.com/ryu-dayo/chimo-chimo-loop
// @version      1.0.0
// @description  Adds Picture-in-Picture (PiP) and loop controls to supported HTML5 video players.
// @description:zh-CN  为支持的网站的视频播放器添加画中画（PiP）和循环播放按钮。
// @author       ryu-dayo
// @match        https://www.douyin.com/*
// @match        https://www.instagram.com/*
// @match        https://www.threads.com/*
// @match        https://www.xiaohongshu.com/*
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556184/chimo-chimo-loop.user.js
// @updateURL https://update.greasyfork.org/scripts/556184/chimo-chimo-loop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inline base64-encoded SVG icons
    const icons = {
        enterPip: 'data:image/svg+xml,%3Csvg%20width%3D%22101%22%20height%3D%2282%22%20viewBox%3D%220%200%20101%2082%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.4512%2063.2813H68.2129C76.5625%2063.2813%2080.6641%2059.2285%2080.6641%2051.0254V12.2559C80.6641%204.0527%2076.5625%200%2068.2129%200H12.4512C4.10158%200%200%204.0527%200%2012.2559V51.0254C0%2059.2285%204.10158%2063.2813%2012.4512%2063.2813ZM7.03128%2050.6348V12.6465C7.03128%208.9356%209.03318%207.0313%2012.5489%207.0313H68.1153C71.6309%207.0313%2073.6328%208.9356%2073.6328%2012.6465V50.6348C73.6328%2054.3457%2071.6309%2056.25%2068.1153%2056.25H12.5489C9.03318%2056.25%207.03128%2054.3457%207.03128%2050.6348Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M30.957%2016.8457C30.8105%2015.625%2029.1991%2014.209%2027.6366%2015.8692L23.4374%2019.9707L17.5781%2014.1113C16.5527%2013.0371%2014.8437%2013.0371%2013.8183%2014.1113C12.7441%2015.1367%2012.7441%2016.8457%2013.8183%2017.8711L19.6777%2023.7305L15.5761%2027.9297C13.9159%2029.4922%2015.332%2031.1035%2016.5527%2031.25L30.664%2033.3984C31.3476%2033.4961%2032.0312%2033.252%2032.5195%2032.8125C32.9589%2032.3242%2033.2031%2031.6406%2033.1054%2030.957L30.957%2016.8457Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M50.4883%2081.6407H87.6953C95.9964%2081.6407%20100.146%2077.5879%20100.146%2069.3848V44.7754C100.146%2036.6211%2095.9964%2032.5195%2087.6953%2032.5195H50.4883C42.1875%2032.5195%2038.0371%2036.5723%2038.0371%2044.7754V69.3848C38.0371%2077.5879%2042.1875%2081.6407%2050.4883%2081.6407Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
        exitPip: 'data:image/svg+xml,%3Csvg%20width%3D%22101%22%20height%3D%2282%22%20viewBox%3D%220%200%20101%2082%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12.4512%2063.2813H68.2129C76.5625%2063.2813%2080.6641%2059.2285%2080.6641%2051.0254V12.2559C80.6641%204.0527%2076.5625%200%2068.2129%200H12.4512C4.10158%200%200%204.0527%200%2012.2559V51.0254C0%2059.2285%204.10158%2063.2813%2012.4512%2063.2813ZM7.03128%2050.6348V12.6465C7.03128%208.9356%209.03318%207.0313%2012.5489%207.0313H68.1153C71.6309%207.0313%2073.6328%208.9356%2073.6328%2012.6465V50.6348C73.6328%2054.3457%2071.6309%2056.25%2068.1153%2056.25H12.5489C9.03318%2056.25%207.03128%2054.3457%207.03128%2050.6348Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M15.1366%2029.8827C15.2831%2031.1034%2016.9433%2032.4706%2018.5058%2030.8593L22.6562%2026.7577L28.5644%2032.6171C29.5898%2033.6425%2031.2988%2033.6425%2032.3241%2032.6171C33.3495%2031.5917%2033.3495%2029.8827%2032.3241%2028.8573L26.4648%2022.9491L30.5663%2018.7987C32.1777%2017.2362%2030.8105%2015.5761%2029.5409%2015.4296L15.4784%2013.33C14.746%2013.2323%2014.1113%2013.4765%2013.623%2013.9159C13.1835%2014.4042%2012.9394%2015.0878%2013.037%2015.7714L15.1366%2029.8827Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M50.4883%2081.6407H87.6953C95.9964%2081.6407%20100.146%2077.5879%20100.146%2069.3848V44.7754C100.146%2036.6211%2095.9964%2032.5195%2087.6953%2032.5195H50.4883C42.1875%2032.5195%2038.0371%2036.5723%2038.0371%2044.7754V69.3848C38.0371%2077.5879%2042.1875%2081.6407%2050.4883%2081.6407Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
        enableLoop: 'data:image/svg+xml,%3Csvg%20width%3D%2299%22%20height%3D%2266%22%20viewBox%3D%220%200%2099%2066%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M28.1739%2065.8691H70.6543C87.6953%2065.8691%2098.8284%2054.834%2098.8284%2037.7441C98.8284%2020.6543%2087.6953%209.47259%2070.6543%209.47259H62.2559C60.3028%209.47259%2058.7403%2011.084%2058.7403%2012.9883C58.7403%2014.9414%2060.3028%2016.5527%2062.2559%2016.5527H70.6543C83.252%2016.5527%2091.7964%2025.1465%2091.7964%2037.7441C91.7964%2050.3418%2083.252%2058.8379%2070.6543%2058.8379H28.1739C15.5274%2058.8379%207.03128%2050.3418%207.03128%2037.7441C7.03128%2025.1465%2015.5274%2016.5527%2028.1739%2016.5527H33.3496C33.1055%2015.332%2032.959%2014.0625%2032.959%2012.7441C32.959%2011.6699%2033.0567%2010.5957%2033.252%209.52149L28.1739%209.47259C11.0352%209.32619%200%2020.6543%200%2037.7441C0%2054.834%2011.0352%2065.8691%2028.1739%2065.8691Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M51.3672%2025.4394C58.4473%2025.4394%2064.1114%2019.7266%2064.1114%2012.6953C64.1114%205.6641%2058.4473%200%2051.3672%200C44.336%200%2038.6719%205.6641%2038.6719%2012.6953C38.6719%2019.7266%2044.336%2025.4394%2051.3672%2025.4394ZM51.3672%2018.6035C48.0957%2018.6035%2045.5078%2015.9668%2045.5078%2012.6953C45.5078%209.375%2048.0957%206.8359%2051.3672%206.8359C54.7364%206.8359%2057.2754%209.375%2057.2754%2012.6953C57.2754%2015.9668%2054.7364%2018.6035%2051.3672%2018.6035Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
        disableLoop: 'data:image/svg+xml,%3Csvg%20width%3D%2299%22%20height%3D%2266%22%20viewBox%3D%220%200%2099%2066%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M28.1739%2065.8691H70.6543C87.6953%2065.8691%2098.8284%2054.834%2098.8284%2037.7441C98.8284%2020.6543%2087.6953%209.47259%2070.6543%209.47259H62.2559C60.3028%209.47259%2058.7403%2011.084%2058.7403%2012.9883C58.7403%2014.9414%2060.3028%2016.5527%2062.2559%2016.5527H70.6543C83.252%2016.5527%2091.7964%2025.1465%2091.7964%2037.7441C91.7964%2050.3418%2083.252%2058.8379%2070.6543%2058.8379H28.1739C15.5274%2058.8379%207.03128%2050.3418%207.03128%2037.7441C7.03128%2025.1465%2015.5274%2016.5527%2028.1739%2016.5527H33.3496C33.1055%2015.332%2032.959%2014.0625%2032.959%2012.7441C32.959%2011.6699%2033.0567%2010.5957%2033.252%209.52149L28.1739%209.47259C11.0352%209.32619%200%2020.6543%200%2037.7441C0%2054.834%2011.0352%2065.8691%2028.1739%2065.8691Z%22%20fill%3D%22black%22%2F%3E%3Cpath%20d%3D%22M51.3672%2025.4394C58.4473%2025.4394%2064.1114%2019.7266%2064.1114%2012.6953C64.1114%205.6641%2058.4473%200%2051.3672%200C44.336%200%2038.6719%205.6641%2038.6719%2012.6953C38.6719%2019.7266%2044.336%2025.4394%2051.3672%2025.4394Z%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E',
    };

    const CONTROL_BTN_SIZE = 16;

    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

    // === Model ===
    class VideoManager {
        constructor() {
            this.currentVideo = null;
            this.layoutObserver = null;
            this.ui = new UIController();
        }

        shouldSwitchVideo(newVideo) {
            const old = this.currentVideo;
            if (!old) return true;
            if (old === newVideo) return false;
            if (!old.isConnected) return true;

            const o = old.getBoundingClientRect();
            const n = newVideo.getBoundingClientRect();

            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dNew = Math.hypot(n.left + n.width / 2 - cx, n.top + n.height / 2 - cy);
            const dOld = Math.hypot(o.left + o.width / 2 - cx, o.top + o.height / 2 - cy);
            if (dNew < dOld) return true;

            if (!old.paused) {
                if (o.width * o.height > n.width * n.height) return false;
            }
            return true;
        }

        handleVideoActivation(video) {
            if (!video) return;

            if (!this.shouldSwitchVideo(video)) return;

            if (this.currentVideo) {
                this.detach('switch');
            }
            this.attach(video);
        }

        attach(video) {
            this.currentVideo = video;

            this.cleanupObserver();
            this.observeVideoLayout(video);

            this.ui.attach(video);
        }

        detach(reason) {
            if (!this.currentVideo) return;

            this.cleanupObserver();
            this.ui.detach(reason);
            this.currentVideo = null;
        }

        observeVideoLayout(video) {
            this.layoutObserver = new ResizeObserver(() => {
                if (this.currentVideo === video) {
                    this.ui.reposition();
                }
            });
            this.layoutObserver.observe(video);
        }

        cleanupObserver() {
            if (this.layoutObserver) {
                this.layoutObserver.disconnect();
                this.layoutObserver = null;
            }
        }
    }

    // === UI ===
    class UIController {
        constructor() {
            this.controlsBar = null;
            this.boundVideo = null;
            this.hideTimeout = null;
            this.pollingInterval = null;

            this.pipBtn = null;
            this.loopBtn = null;

            this._boundGlobalHandler = this.throttle(this.handleGlobalPointer.bind(this), 400);
            this._boundReposition = this.reposition.bind(this);
        }

        throttle(func, limit) {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => { inThrottle = false; }, limit);
                }
            };
        }

        ensureUI() {
            if (!this.controlsBar) {
                this.injectStyle();
                this.controlsBar = this.buildControlsBar();
                document.body.appendChild(this.controlsBar);
            }
        }

        attach(video) {
            this.ensureUI();
            this.boundVideo = video;

            this.pipBtn?.setVideo(video);
            this.loopBtn?.setVideo(video);

            window.addEventListener('pointermove', this._boundGlobalHandler, { passive: true });

            this.reposition();
            this.showAndTimer();
        }

        detach(reason) {
            if (this.boundVideo) {
                window.removeEventListener('pointermove', this._boundGlobalHandler);
                this.stopPolling();
            }
            this.boundVideo = null;
            this.stopTimer();
            this.hide();
        }

        reposition() {
            if (!this.boundVideo || !this.controlsBar) return;

            const rect = this.boundVideo.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            this.controlsBar.style.transform = `translate(${rect.left + 6}px, ${rect.top + 6}px)`;
        }

        handleGlobalPointer(e) {
            if (!this.boundVideo) return;

            const rect = this.boundVideo.getBoundingClientRect();
            const isOverVideo = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );
            const isOverControls = this.controlsBar.contains(e.target);
            if (isOverVideo || isOverControls) {
                this.showAndTimer();
            }
        }

        showAndTimer() {
            this.show();
            this.startHideTimer(3000);
            this.startPolling(500);
        }

        startHideTimer(timeout) {
            this.stopTimer();
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, timeout);
        }

        startPolling(duration) {
            this.stopPolling();
            const startTime = performance.now();

            const poll = (now) => {
                this.reposition();
                if (now - startTime < duration) {
                    this.pollingInterval = requestAnimationFrame(poll);
                }
            };
            this.pollingInterval = requestAnimationFrame(poll);
        }

        stopPolling() {
            if (this.pollingInterval) {
                cancelAnimationFrame(this.pollingInterval);
                this.pollingInterval = null;
            }
        }

        stopTimer() {
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = null;
            }
        }

        show() {
            if (!this.controlsBar) return;
            this.controlsBar.classList.replace('hidden', 'visible');
        }

        hide() {
            if (!this.controlsBar) return;
            this.controlsBar.classList.replace('visible', 'hidden');
        }

        updateAllStyles() {
            if (!this.boundVideo || !this.controlsBar) return;
            this.pipBtn?.update();
            this.loopBtn?.update();
        }

        injectStyle() {
            if (document.getElementById('ccl-style')) return;
            const style = document.createElement('style');
            style.id = 'ccl-style';
            style.textContent = `
            .ccl-bar {
            position: fixed;
            top: 6px;
            left: 6px;
            z-index: 999;
            display: inline-flex;
            will-change: z-index;
            cursor: default;
            height: 31px;
            }

            .ccl-bg, .ccl-bg > div {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 8px;
            pointer-events: none;
            }

            .ccl-bg > .blur {
            background-color: rgba(0, 0, 0, 0.55);
            backdrop-filter: saturate(180%) blur(17.5px);
            -webkit-backdrop-filter: saturate(180%) blur(17.5px);
            }

            .ccl-bg > .tint {
            background-color: rgba(255, 255, 255, 0.14);
            mix-blend-mode: lighten;
            }

            .pip-button, .loop-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border-width: 0;
            background-color: transparent !important;
            appearance: none;
            transition: opacity 0.1s linear;
            }

            .pip-button { --icon: url('${icons.enterPip}'); }
            .pip-button[data-active="true"] { --icon: url('${icons.exitPip}'); }
            .loop-button { --icon: url('${icons.enableLoop}'); }
            .loop-button[data-active="true"] { --icon: url('${icons.disableLoop}'); }

            .ccl-icon {
            background-color: rgba(255, 255, 255, 1);
            mix-blend-mode: plus-lighter;
            mask-size: 100% 100%;
            mask-repeat: no-repeat;
            mask-image: var(--icon);
            -webkit-mask-image: var(--icon);
            transition: transform 150ms;
            will-change: transform;
            pointer-events: none;
            }

            .pip-button:active picture,
            .loop-button:active picture {
            transform: scale(0.89);
            }

            .ccl-container {
            display: flex;
            gap: 16px;
            justify-content: center;
            align-items: center;
            padding: 0 16px;
            }

            .ccl-bar.hidden {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            }

            .ccl-bar.visible {
            opacity: 1;
            pointer-events: auto;
            transition: opacity 0.3s ease;
            }
            `;
            document.head.appendChild(style);
        };

        // Glassmorphic background (blur and tint) for the control bar
        buildBackgroundTint() {
            const backgroundTint = document.createElement('div');
            backgroundTint.classList.add('ccl-bg');

            const blur = document.createElement('div');
            blur.classList.add('blur');

            const tint = document.createElement('div');
            tint.classList.add('tint');

            backgroundTint.append(blur, tint);
            return backgroundTint;
        };

        createButton({ className, onClick }) {
            const picture = document.createElement('picture');
            picture.classList.add('ccl-icon');
            picture.style.width = `${CONTROL_BTN_SIZE}px`;
            picture.style.height = `${CONTROL_BTN_SIZE}px`;

            const button = document.createElement('button');
            button.classList.add(className);
            button.style.pointerEvents = 'auto';

            button.append(picture);
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick?.();
            });

            return button;
        };

        // Ensure PiP attributes and iframe permissions are set
        ensurePipEnabled(video) {
            if (!video) return false;
            try {
                // Remove disablepictureinpicture attribute if present
                if (video.hasAttribute('disablepictureinpicture')) {
                    video.removeAttribute('disablepictureinpicture');
                }
                // Set disablePictureInPicture property to false if supported
                if ('disablePictureInPicture' in video) {
                    try { video.disablePictureInPicture = false; } catch (_) { }
                }
                // Ensure iframe allows picture-in-picture if inside an iframe
                const frame = window.frameElement;
                if (frame && frame.tagName === 'IFRAME') {
                    const allow = frame.getAttribute('allow') || '';
                    if (!/picture-in-picture/.test(allow)) {
                        frame.setAttribute('allow', (allow ? allow + ';' : '') + 'picture-in-picture');
                    }
                }
                return true;
            } catch (e) {
                console.warn('[chimo] Failed to ensure PiP enabled:', e);
                return false;
            }
        };

        createPipButton() {
            let currentVideo = null;
            if (!document.pictureInPictureEnabled) return null;

            const updatePipButton = () => {
                if (!currentVideo) return;
                const isInPip = document.pictureInPictureElement === currentVideo;
                btn.setAttribute('data-active', isInPip);
            };

            const togglePip = () => {
                if (!currentVideo) {
                    console.log("[chimo-chimo-loop]Video not found");
                    return;
                }
                this.ensurePipEnabled(currentVideo)

                const supportsSafariPip = typeof currentVideo.webkitSetPresentationMode === 'function';
                if (isSafari && supportsSafariPip) {
                    const mode = currentVideo.webkitPresentationMode;
                    currentVideo.webkitSetPresentationMode(mode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
                } else {
                    if (document.pictureInPictureElement === currentVideo) {
                        document.exitPictureInPicture().catch(err => console.warn(err));
                        console.log("[chimo-chimo-loop]Exit PiP");

                    } else {
                        currentVideo.requestPictureInPicture().catch(err => console.warn(err));
                        console.log("[chimo-chimo-loop]Request PiP");
                    }
                }
            };

            const btn = this.createButton({ className: 'pip-button', onClick: togglePip });

            return {
                element: btn,
                setVideo: (newVideo) => {
                    currentVideo = newVideo;
                    updatePipButton();
                },
                update: updatePipButton
            };
        };

        createLoopButton() {
            let currentVideo = null;

            // Update loop icon to reflect current loop state
            const updateLoopButton = () => {
                if (!currentVideo) return;
                btn.setAttribute('data-active', !!currentVideo.loop);
            };

            const toggleLoop = () => {
                if (!currentVideo) {
                    console.log("[chimo-chimo-loop]Video not found");
                    return;
                }

                currentVideo.loop = !currentVideo.loop;
                updateLoopButton();
            };

            const btn = this.createButton({ className: 'loop-button', onClick: toggleLoop });

            return {
                element: btn,
                setVideo: (newVideo) => {
                    currentVideo = newVideo;
                    updateLoopButton();
                },
                update: updateLoopButton
            };
        };

        buildButtonsContainer() {
            const container = document.createElement('div');
            container.classList.add('ccl-container');

            this.pipBtn = this.createPipButton();
            this.loopBtn = this.createLoopButton();

            if (this.pipBtn) container.append(this.pipBtn.element);
            if (this.loopBtn) container.append(this.loopBtn.element);

            return container;
        };

        buildControlsBar() {
            const bg = this.buildBackgroundTint();
            const container = this.buildButtonsContainer();

            // Root element for the control bar
            const controlsBar = document.createElement('div');
            controlsBar.classList.add('hidden', 'ccl-bar');

            controlsBar.append(bg, container);
            return controlsBar;
        };
    }

    // === Observers ===
    const observeVideoDom = () => {
        const observer = new MutationObserver(() => {
            const v = videoManager.currentVideo;
            if (v && !v.isConnected) {
                videoManager.detach('removed');
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // === Global events ===
    const setupGlobalEvents = () => {
        document.addEventListener('play', (e) => {
            const video = e.target;
            if (!(video instanceof HTMLVideoElement)) return;
            videoManager.handleVideoActivation(video);
        }, true);

        document.addEventListener('pause', (e) => {
            if (e.target === videoManager.currentVideo) {
                videoManager.ui.hide();
            }
        }, true);

        document.addEventListener('scroll', () => videoManager.ui.reposition(), { passive: true, capture: true });
        window.addEventListener('resize', () => videoManager.ui.reposition(), { passive: true });

        const handlePipChange = () => {
            videoManager.ui.updateAllStyles();
        };

        document.addEventListener("enterpictureinpicture", handlePipChange, true);
        document.addEventListener("leavepictureinpicture", handlePipChange, true);
        document.addEventListener("webkitpresentationmodechanged", handlePipChange, true);
    };

    // === Main ===
    const main = () => {
        setupGlobalEvents();
        observeVideoDom();

        const v = document.querySelector('video');
        if (v) videoManager.handleVideoActivation(v);
    };

    const videoManager = new VideoManager();
    main();
})();

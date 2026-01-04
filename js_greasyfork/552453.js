// ==UserScript==
// @name         DX_喇叭按钮滚轮调音_MAX
// @namespace    http://tampermonkey.net/
// @version      2.6.3
// @description  在喇叭/音量按钮上使用滚轮调节音量 - Steam特殊静音逻辑，轻量级ID管理器优化
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552453/DX_%E5%96%87%E5%8F%AD%E6%8C%89%E9%92%AE%E6%BB%9A%E8%BD%AE%E8%B0%83%E9%9F%B3_MAX.user.js
// @updateURL https://update.greasyfork.org/scripts/552453/DX_%E5%96%87%E5%8F%AD%E6%8C%89%E9%92%AE%E6%BB%9A%E8%BD%AE%E8%B0%83%E9%9F%B3_MAX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self || window.__SPEAKER_WHEEL_INITIALIZED__) return;
    window.__SPEAKER_WHEEL_INITIALIZED__ = true;

    // 轻量级ID管理器 - 替换原有复杂实现
    const LightweightIdManager = {
        buttonVideoMap: new WeakMap(), // 自动内存管理

        bindButtonToVideo(button, video) {
            this.buttonVideoMap.set(button, video);

            // 为视频分配唯一ID（用于调试和备用查找）
            if (!video.dataset.speakerVideoId) {
                video.dataset.speakerVideoId = `max_video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }
            button.dataset.boundVideoId = video.dataset.speakerVideoId;
        },

        getVideoByButton(button) {
            // 1. WeakMap直接获取（主要方式）
            const cachedVideo = this.buttonVideoMap.get(button);
            if (cachedVideo && document.contains(cachedVideo)) {
                return cachedVideo;
            }

            // 2. ID查找（备用，针对动态内容）
            const videoId = button.dataset.boundVideoId;
            if (videoId) {
                const video = document.querySelector(`video[data-speaker-video-id="${videoId}"]`);
                if (video) {
                    this.buttonVideoMap.set(button, video);
                    return video;
                }
            }

            // 3. 邻近度查找（MAX版特色，保持复杂场景支持）
            return this.findVideoByProximity(button);
        },

        // 保留MAX版的智能视频查找算法
        findVideoByProximity(button) {
            const allVideos = Array.from(document.querySelectorAll('video')).filter(v => v.offsetParent !== null);
            if (allVideos.length === 0) return null;

            const buttonRect = button.getBoundingClientRect();
            const videosWithDistance = allVideos.map(video => {
                const videoRect = video.getBoundingClientRect();
                const center1 = {
                    x: buttonRect.left + buttonRect.width / 2,
                    y: buttonRect.top + buttonRect.height / 2
                };
                const center2 = {
                    x: videoRect.left + videoRect.width / 2,
                    y: videoRect.top + videoRect.height / 2
                };
                const distance = Math.sqrt(
                    Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2)
                );
                return { video, distance };
            }).sort((a, b) => a.distance - b.distance);

            return videosWithDistance[0]?.video || null;
        }
    };

    // 模式定义
    const MODES = {
        1: { id: 1, name: "保守模式", allVideos: false, universal: false, desc: "🎬关 + 🌐关 - 只处理已知平台的已知按钮" },
        2: { id: 2, name: "主流平台增强", allVideos: false, universal: true, desc: "🎬关 + 🌐开 - 只处理主流平台，但按钮识别更强" },
        3: { id: 3, name: "精准视频模式", allVideos: true, universal: false, desc: "🎬开 + 🌐关 - 只处理视频，但需要已知的音量按钮" },
        4: { id: 4, name: "全能模式", allVideos: true, universal: true, desc: "🎬开 + 🌐开 - 最大兼容性，任何网站都能用" }
    };

    // 配置管理
    const ConfigManager = {
        getSiteConfig() {
            const siteSettings = GM_getValue('SpeakerWheelSiteSettings', {});
            const hostname = location.hostname;
            const siteConfig = siteSettings[hostname] || {};
            const currentMode = siteConfig.mode || 1;
            const modeConfig = MODES[currentMode];

            return {
                step: GM_getValue('SpeakerWheelStepVolume', 5),
                mode: currentMode,
                allVideos: modeConfig.allVideos,
                universal: modeConfig.universal,
                showDisplay: siteConfig.showVolumeDisplay ?? true,
                enabled: siteConfig.enabled ?? true
            };
        },

        saveSiteConfig(config) {
            const siteSettings = GM_getValue('SpeakerWheelSiteSettings', {});
            const hostname = location.hostname;
            siteSettings[hostname] = {
                mode: config.mode,
                showVolumeDisplay: config.showDisplay,
                enabled: config.enabled
            };
            GM_setValue('SpeakerWheelSiteSettings', siteSettings);
        }
    };

    const CONFIG = ConfigManager.getSiteConfig();

    // 平台检测
    const PLATFORM = (() => {
        const host = location.hostname;
        if (/youtube\.com|youtu\.be/.test(host)) return "YOUTUBE";
        if (/bilibili\.com/.test(host)) return "BILIBILI";
        if (/twitch\.tv/.test(host)) return "TWITCH";
        if (/steam(community|powered)\.com/.test(host)) return "STEAM";
        if (/netflix\.com/.test(host)) return "NETFLIX";
        return "GENERIC";
    })();

    const IS_STEAM = PLATFORM === 'STEAM';
    const IS_YOUTUBE = PLATFORM === 'YOUTUBE';

    // 选择器配置
    const PLATFORM_SELECTORS = {
        STEAM: [
            'svg._1CpOAgPPD7f_fGI4HaYX6C',
            'svg.SVGIcon_Volume',
            'svg.SVGIcon_Button.SVGIcon_Volume',
            'svg[class*="volume" i]',
            'svg[class*="Volume" i]',
            '[class*="volume" i] svg',
            '[class*="Volume" i] svg',
            'button svg.SVGIcon_Volume',
            'button svg[class*="Volume" i]',
            'button svg[class*="volume" i]',
            'svg:has(.Speaker)',
            'svg:has(.SoundWaves)',
            'svg:has(path[class*="SoundWaves"])',
            'svg:has(path[class*="SoundX"])'
        ],
        YOUTUBE: ['.ytp-mute-button', '.ytp-volume-panel'],
        BILIBILI: ['.bpx-player-ctrl-volume', '.bpx-player-ctrl-mute'],
        TWITCH: ['[data-a-target="player-volume-button"]'],
        NETFLIX: ['[data-uia="volume-slider"]', '[data-uia="audio-toggle"]'],
        GENERIC: [
            '[class*="volume"]', '[class*="sound"]', '[class*="mute"]',
            '.volume-icon', '.mute-btn', '.volume-btn', '.mute-icon',
            'button[aria-label*="volume"]', 'button[title*="volume"]',
            'button[aria-label*="mute"]', 'button[title*="mute"]'
        ]
    };

    // 状态管理
    const state = {
        display: null,
        target: null,
        lastTarget: null,
        volume: 50,
        overSpeaker: false,
        overDisplay: false,
        dragging: false,
        position: null,
        timeout: null,
        locked: false,
        scrollListenersAdded: false
    };

    // 工具函数
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    const clampVolume = vol => Math.round(clamp(vol, 0, 100));
    const clampPos = (val, size) => clamp(val, 20 + size / 2, window.innerWidth - (20 + size / 2));

    // 视频查找 - 使用轻量级ID管理器
    const findActiveVideo = (button) => {
        const allVideos = Array.from(document.querySelectorAll('video')).filter(v => v.offsetParent !== null);
        if (allVideos.length === 0) return null;

        if (IS_STEAM && button) {
            // 使用轻量级ID管理器查找
            const video = LightweightIdManager.getVideoByButton(button);
            if (video) return video;

            // 备用：查找正在播放的视频
            const playingVideo = allVideos.find(v => !v.paused);
            if (playingVideo) return playingVideo;

            // 备用：查找可见的大视频
            const visibleVideo = allVideos.find(v => v.offsetWidth > 300 && v.offsetHeight > 150);
            if (visibleVideo) return visibleVideo;

            // 查找任何可见的视频
            return allVideos.find(v => v.offsetParent !== null) || allVideos[0];
        }

        // 通用逻辑
        const playingVideo = allVideos.find(v => !v.paused && v.readyState > 0);
        if (playingVideo) return playingVideo;

        const visibleVideo = allVideos.find(v => v.offsetWidth > 100 && v.offsetHeight > 50);
        if (visibleVideo) return visibleVideo;

        if (CONFIG.allVideos) return allVideos[0];

        return null;
    };

    const getVideoElement = (button) => {
        if (!button) return findActiveVideo();

        const video = LightweightIdManager.getVideoByButton(button);
        if (video) return video;

        const foundVideo = findActiveVideo(button);
        if (foundVideo && button) {
            LightweightIdManager.bindButtonToVideo(button, foundVideo);
        }
        return foundVideo;
    };

    // 音量控制 - Steam平台特殊逻辑
    const getVolume = (video) => {
        if (!video) return state.volume;

        if (IS_YOUTUBE) {
            const player = video.closest('#movie_player') || document.querySelector('.html5-video-player');
            if (player?.isMuted?.()) return 0;
            const platformVolume = player?.getVolume?.();
            if (platformVolume !== undefined) return platformVolume;
        }

        return video.muted ? 0 : Math.round(video.volume * 100);
    };

    const setVolume = (video, volume, isWheel = false) => {
        const clampedVolume = clampVolume(volume);
        state.volume = clampedVolume;

        if (!video) return clampedVolume;

        // Steam平台特殊处理
        if (IS_STEAM) {
            if (isWheel && video.muted && clampedVolume > 0) {
                video.muted = false;
            }
            video.volume = clampedVolume / 100;

            if (!isWheel) {
                video.muted = clampedVolume === 0;
            }
            return clampedVolume;
        }

        // 其他平台逻辑
        if (clampedVolume === 0) {
            video.muted = true;
        } else {
            video.muted = false;
            video.volume = clampedVolume / 100;
            if (IS_YOUTUBE) {
                const player = video.closest('#movie_player') || document.querySelector('.html5-video-player');
                player?.unMute?.();
                player?.setVolume?.(clampedVolume);
            }
        }

        video.dispatchEvent(new Event('volumechange', { bubbles: true }));
        return clampedVolume;
    };

    // 滚动监听管理
    const addScrollListeners = () => {
        if (!state.scrollListenersAdded) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            document.addEventListener('scroll', handleScroll, { passive: true });
            state.scrollListenersAdded = true;
        }
    };

    const removeScrollListeners = () => {
        if (state.scrollListenersAdded) {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('scroll', handleScroll);
            state.scrollListenersAdded = false;
        }
    };

    // 显示控制
    const handleScroll = () => {
        if (state.display && state.display.style.display !== 'none') {
            hideDisplay();
        }
    };

    const getDisplayPosition = (target) => {
        try {
            const rect = target?.getBoundingClientRect();
            if (!rect?.width || rect.top < -50) return getDefaultPosition();

            const x = clampPos(rect.left + rect.width / 2, 60);
            const y = clampPos(rect.top - 100, 180);
            return { x, y };
        } catch {
            return getDefaultPosition();
        }
    };

    const getDefaultPosition = () => ({
        x: clampPos(window.innerWidth / 2, 60),
        y: clampPos(window.innerHeight / 3, 180)
    });

    const clearHide = () => {
        clearTimeout(state.timeout);
        state.timeout = null;
    };

    const scheduleHide = () => {
        clearHide();
        if (!state.overSpeaker && !state.overDisplay && !state.dragging) {
            state.timeout = setTimeout(hideDisplay, 1000);
        }
    };

	const hideDisplay = () => {
		if (state.display) {
			state.display.style.display = 'none';
			removeScrollListeners(); // 隐藏时移除滚动监听
			Object.assign(state, {
				target: null,
				lastTarget: null,
				overSpeaker: false,
				overDisplay: false,
				locked: false,
				dragging: false,
				position: null
			});
			clearHide();
		}
	};

    // 核心功能
    const isSameButton = (button1, button2) => button1 && button2 && (button1 === button2 || button1.isSameNode(button2));

	const wheelHandler = (e) => {
		const button = e.currentTarget;
		// 确保鼠标仍在按钮上
		if (state.overSpeaker && button) {
			e.preventDefault();
			e.stopPropagation();
			const video = getVideoElement(button);
			if (video) {
				adjustVolume(-Math.sign(e.deltaY) * CONFIG.step, button, true);
			}
		}
	};

    // 音量调整功能
	const adjustVolume = (delta, target = null, isWheel = false) => {
		const video = getVideoElement(target);
		if (!video) return;

		const currentVol = getVolume(video);
		const newVolume = setVolume(video, currentVol + delta, true);
		showVolume(newVolume, target || state.target, isWheel);  // 传递 isWheel 参数
	};

    // UI 管理
    const updateUI = (volume, bar, text, handle) => {
        const percent = Math.round(volume);
        if (text) text.textContent = `${percent}%`;
        if (bar) bar.style.height = `${percent}%`;
        if (handle) handle.style.top = `${100 - percent}%`;
    };

	const showVolume = (vol, target, isWheel = false) => {
		if (!CONFIG.showDisplay || (!state.overSpeaker && !isWheel && !state.dragging)) return;

		const display = createDisplay();
		const { bar, text, handle } = display.elements;

		updateUI(vol, bar, text, handle);
		display.style.display = 'flex';
		
		// 显示时添加滚动监听
		addScrollListeners();

		const isNewButton = !isSameButton(target, state.lastTarget);

		// 恢复滚轮操作的位置保持逻辑
		if (isWheel && state.position) {
			applyPosition(display, state.position);
		} else if (target && (!state.locked || isNewButton)) {
			state.target = target;
			state.lastTarget = target;
			state.position = getDisplayPosition(target);
			state.locked = true;
			applyPosition(display, state.position);
		} else if (state.position) {
			applyPosition(display, state.position);
		} else {
			state.position = getDefaultPosition();
			state.locked = true;
			applyPosition(display, state.position);
		}

		display.style.opacity = '1';
		clearHide();

		if (isNewButton && !isWheel) {
			display.style.opacity = '0';
			setTimeout(() => { display.style.opacity = '1'; }, 10);
		}
	};

    const applyPosition = (display, pos) => {
        display.style.left = `${pos.x}px`;
        display.style.top = `${pos.y}px`;
        display.style.transform = 'translate(-50%, -50%)';
    };

    const createDisplay = () => {
        if (state.display) return state.display;

        const display = document.createElement('div');
        display.id = 'speaker-wheel-volume-display';

        const text = document.createElement('div');
        const bar = document.createElement('div');
        const slider = document.createElement('div');
        const handle = document.createElement('div');
        const container = document.createElement('div');

        // 样式设置
        const styles = {
            display: {
                position: 'fixed', zIndex: '2147483647', padding: '15px 5px',
                background: 'rgba(40, 40, 40, 0.95)', borderRadius: '5px',
                opacity: '0', transition: 'opacity 0.3s ease', pointerEvents: 'auto',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)', display: 'none', flexDirection: 'column',
                alignItems: 'center', gap: '12px', userSelect: 'none'
            },
            text: {
                color: '#fff', fontSize: '12px', fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold', textAlign: 'center', minWidth: '40px', pointerEvents: 'none'
            },
            container: {
                width: '8px', height: '120px', background: 'rgba(80, 80, 80, 0.8)',
                borderRadius: '5px', border: '1px solid rgba(255,255,255,0.1)',
                position: 'relative', overflow: 'hidden', pointerEvents: 'none'
            },
            bar: {
                position: 'absolute', bottom: '0', left: '0', width: '100%', height: '0%',
                background: '#fff', borderRadius: '2px', transition: 'height 0.1s ease', pointerEvents: 'none'
            },
            slider: {
                position: 'absolute', left: '0', width: '100%', height: '100%',
                cursor: 'pointer', zIndex: '3', pointerEvents: 'auto'
            },
            handle: {
                position: 'absolute', left: '0', width: '100%', height: '4px',
                background: '#ff4444', borderRadius: '2px', transition: 'top 0.05s ease', pointerEvents: 'none'
            }
        };

        Object.assign(display.style, styles.display);
        Object.assign(text.style, styles.text);
        Object.assign(container.style, styles.container);
        Object.assign(bar.style, styles.bar);
        Object.assign(slider.style, styles.slider);
        Object.assign(handle.style, styles.handle);

        // 组装
        slider.appendChild(handle);
        container.append(bar, slider);
        display.append(text, container);
        document.body.appendChild(display);

        // 事件处理
        display.addEventListener('mouseenter', () => {
            state.overDisplay = state.locked = true;
            clearHide();
        });

        display.addEventListener('mouseleave', () => {
            state.overDisplay = false;
            scheduleHide();
        });

        // 滑块拖动
        let dragging = false;
        const updateFromMouse = (y) => {
            const rect = slider.getBoundingClientRect();
            const percent = clamp((rect.bottom - y) / rect.height, 0, 1);
            const volume = Math.round(percent * 100);

            const video = getVideoElement(state.target);
            setVolume(video, volume, false);
            updateUI(volume, bar, text, handle);
        };

        slider.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            dragging = state.dragging = state.locked = true;
            updateFromMouse(e.clientY);

            const move = (e) => dragging && updateFromMouse(e.clientY);
            const up = () => {
                dragging = state.dragging = false;
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
                scheduleHide();
            };

            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        });

        display.addEventListener('wheel', wheelHandler, { capture: true, passive: false });

        state.display = display;
        display.elements = { text, bar, handle };
        return state.display;
    };

    // 平台初始化
    const getSelectors = () => {
        const platformSelectors = [
            ...PLATFORM_SELECTORS.BILIBILI,
            ...PLATFORM_SELECTORS.YOUTUBE,
            ...PLATFORM_SELECTORS.TWITCH,
            ...PLATFORM_SELECTORS.NETFLIX,
            ...PLATFORM_SELECTORS.STEAM
        ];

        return CONFIG.universal ?
            [...new Set([...platformSelectors, ...PLATFORM_SELECTORS.GENERIC])] :
            [...new Set(platformSelectors)];
    };

    // 增强的元素事件绑定
    const bindElementEvents = (el) => {
        if (el.dataset.bound) return;
        el.dataset.bound = 'true';

        // 使用轻量级ID管理器建立绑定
        const video = getVideoElement(el);
        if (video) {
            LightweightIdManager.bindButtonToVideo(el, video);
        }

        el.addEventListener('mouseenter', (e) => {
            state.overSpeaker = true;
            clearHide();
            if (CONFIG.showDisplay) {
                const video = getVideoElement(e.currentTarget);
                if (video) {
                    const isNewButton = !isSameButton(e.currentTarget, state.lastTarget);
                    showVolume(getVolume(video), e.currentTarget);

                    if (isNewButton && state.display) {
                        const newPosition = getDisplayPosition(e.currentTarget);
                        applyPosition(state.display, newPosition);
                        state.position = newPosition;
                    }
                }
            }
        });

        el.addEventListener('mouseleave', () => {
            state.overSpeaker = false;
            scheduleHide();
        });

        el.addEventListener('wheel', wheelHandler, { capture: true, passive: false });

        if (!el.style.cursor) {
            el.style.cursor = 'ns-resize';
            el.title = '使用鼠标滚轮调节音量';
        }
    };

    // Steam平台特殊处理 - 优化版本
    let steamInitialized = false;
    const initSteamVolume = () => {
        if (steamInitialized) return;

        // Steam特定绑定函数
        const bindSteamElements = () => {
            // 尝试所有Steam选择器
            PLATFORM_SELECTORS.STEAM.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        if (!el.dataset.bound) {
                            bindElementEvents(el);

                            // Steam特定点击处理
                            if (!el.dataset.steamClickBound) {
                                el.dataset.steamClickBound = 'true';

                                el.addEventListener('click', (e) => {
                                    // 让Steam原生处理点击静音功能
                                    setTimeout(() => {
                                        const video = getVideoElement(e.currentTarget);
                                        if (video) {
                                            setTimeout(() => {
                                                const currentVolume = getVolume(video);
                                                showVolume(currentVolume, e.currentTarget);
                                            }, 100);
                                        }
                                    }, 50);
                                });
                            }
                        }
                    });
                } catch (e) {}
            });

            // 额外的父级按钮选择器
            const parentSelectors = [
                'button:has(svg.SVGIcon_Volume)',
                'button:has(svg[class*="Volume" i])',
                'button:has(svg:has(.Speaker))',
                'button:has(svg:has(.SoundWaves))',
                'button:has(svg._1CpOAgPPD7f_fGI4HaYX6C)'
            ];

            parentSelectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        bindElementEvents(el);
                    });
                } catch (e) {}
            });
        };

        // 初始绑定
        bindSteamElements();

        // DOM变化监听
        const observer = new MutationObserver((mutations) => {
            let shouldRebind = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            if (node.matches && (
                                node.matches('svg.SVGIcon_Volume') ||
                                node.matches('svg[class*="Volume" i]') ||
                                node.matches('svg._1CpOAgPPD7f_fGI4HaYX6C') ||
                                node.matches('button:has(svg.SVGIcon_Volume)') ||
                                (node.querySelector && (
                                    node.querySelector('svg.SVGIcon_Volume') ||
                                    node.querySelector('svg[class*="Volume" i]') ||
                                    node.querySelector('svg._1CpOAgPPD7f_fGI4HaYX6C')
                                ))
                            )) {
                                shouldRebind = true;
                            }
                        }
                    });
                }
            });

            if (shouldRebind) {
                bindSteamElements();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        steamInitialized = true;
    };

    const setupEvents = () => {
        const uniqueSelectors = getSelectors();
        uniqueSelectors.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(bindElementEvents);
            } catch {}
        });

        const video = getVideoElement();
        if (video && !video.dataset.listener) {
            video.addEventListener('volumechange', () => {
                if (!state.dragging) {
                    const volume = getVolume(video);
                    showVolume(volume, state.target);
                }
            });
            video.dataset.listener = 'true';
        }
    };

    // 菜单命令
    const switchMode = () => {
        const nextMode = CONFIG.mode % 4 + 1;
        const modeConfig = MODES[nextMode];

        CONFIG.mode = nextMode;
        CONFIG.allVideos = modeConfig.allVideos;
        CONFIG.universal = modeConfig.universal;

        ConfigManager.saveSiteConfig(CONFIG);
        alert(`🎬 视频检测加强 / 🌐 音频检测追加\n\n已切换到: ${modeConfig.name}\n${modeConfig.desc}\n\n页面将刷新以应用更改`);
        location.reload();
    };

    const registerMenuCommands = () => {
        GM_registerMenuCommand(
            `🚀 本站脚本开关${CONFIG.enabled ? ' ✅' : ' ❌'}`,
            () => {
                CONFIG.enabled = !CONFIG.enabled;
                ConfigManager.saveSiteConfig(CONFIG);
                alert(`脚本已${CONFIG.enabled ? '启用' : '禁用'}\n页面将刷新`);
                location.reload();
            }
        );

        if (!CONFIG.enabled) return;

        const currentMode = MODES[CONFIG.mode];
        const nextModeId = CONFIG.mode % 4 + 1;
        const nextMode = MODES[nextModeId];

        GM_registerMenuCommand(`🔄 ${currentMode.name} → ${nextMode.name}`, switchMode);

        GM_registerMenuCommand('🔊 设置音量步进', () => {
            const newVal = prompt('设置音量调整步进 (%)', CONFIG.step);
            if (newVal && !isNaN(newVal)) {
                GM_setValue('SpeakerWheelStepVolume', parseFloat(newVal));
                alert('设置已保存');
                location.reload();
            }
        });

        GM_registerMenuCommand(
            `👁️ 音量滑块${CONFIG.showDisplay ? ' ✅' : ' ❌'}`,
            () => {
                CONFIG.showDisplay = !CONFIG.showDisplay;
                ConfigManager.saveSiteConfig(CONFIG);
                location.reload();
            }
        );
    };

    // 主初始化
    const init = () => {
        // 全局事件绑定（只绑定一次）
        document.addEventListener('mousedown', (e) => {
            if (!e.target.closest('#speaker-wheel-volume-display') && !state.overSpeaker) {
                hideDisplay();
            }
        });

        // 移除了全局滚动监听，改为动态管理
        // window.addEventListener('scroll', handleScroll, { passive: true });
        // document.addEventListener('scroll', handleScroll, { passive: true });

        registerMenuCommands();
        if (!CONFIG.enabled) return;

        if (IS_STEAM) {
            const tryInit = () => {
                initSteamVolume();
            };
            tryInit();
        } else {
            const observer = new MutationObserver(() => {
                setupEvents();
            });

            setTimeout(() => {
                setupEvents();
                observer.observe(document.body, { childList: true, subtree: true });
            }, 300);
        }
    };

    // 启动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();
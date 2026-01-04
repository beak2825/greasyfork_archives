// ==UserScript==
// @name         DX_快捷键 DX_(Video) shortcut key
// @namespace    http://tampermonkey.net/
// @version      1.2.9
// @description:zh-CN 完整的视频快捷键功能模块，支持多平台视频控制
// @match        *://www.youtube.com/*
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @match        *://www.twitch.tv/*
// @match        *://store.steampowered.com/*
// @match        *://vimeo.com/*
// @match        *://www.dailymotion.com/*
// @match        *://player.vimeo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @description 完整的视频快捷键功能模块，支持多平台视频控制
// @downloadURL https://update.greasyfork.org/scripts/552454/DX_%E5%BF%AB%E6%8D%B7%E9%94%AE%20DX_%28Video%29%20shortcut%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/552454/DX_%E5%BF%AB%E6%8D%B7%E9%94%AE%20DX_%28Video%29%20shortcut%20key.meta.js
// ==/UserScript==

// 仅在顶层窗口运行，避免在 iframe 中重复初始化
if (window.top !== window.self) return;
(function() {
    'use strict';

    // ==================== 基础配置 ====================
    const PLATFORM = (() => {
        const { hostname } = location;
        if (hostname.includes('youtube') || hostname.includes('youtu.be')) return "YOUTUBE";
        if (hostname.includes('bilibili')) return "BILIBILI";
        if (hostname.includes('twitch')) return "TWITCH";
        if (hostname.includes('steam')) return "STEAM";
        return "GENERIC";
    })();

    const CONFIG_STORAGE_KEY = 'ScrollVolumeDxConfig';
    const DEFAULT_CONFIG = {
        stepTime: 5,
        stepTimeLong: 30,
        stepVolume: 10,
        key7Function: ['YOUTUBE', 'BILIBILI'].includes(PLATFORM) ? 4 : 1,
        key9Function: ['YOUTUBE', 'BILIBILI'].includes(PLATFORM) ? 4 : 1,
        modifierKey: 5,
        fineVolumeStep: 1,
    };

    // ==================== 配置管理器 ====================
    class ConfigManager {
        get() {
            const savedConfig = GM_getValue(CONFIG_STORAGE_KEY, {});
            const domainId = this.getDomainId();
            const domainConfig = savedConfig[domainId] || {};

            const config = { ...DEFAULT_CONFIG };
            Object.keys(config).forEach(key => {
                if (key in domainConfig) {
                    config[key] = this.validateConfig(key, domainConfig[key]);
                }
            });

            return config;
        }

        set(newConfig) {
            const savedConfig = GM_getValue(CONFIG_STORAGE_KEY, {});
            const domainId = this.getDomainId();
            savedConfig[domainId] = { ...newConfig };
            GM_setValue(CONFIG_STORAGE_KEY, savedConfig);
        }

        getDomainId() {
            return location.hostname.split('.').slice(-2).join('_');
        }

        validateConfig(key, value) {
            const validators = {
                stepTime: (v) => Math.max(1, Math.min(300, v)),
                stepTimeLong: (v) => Math.max(1, Math.min(3600, v)),
                stepVolume: (v) => Math.max(1, Math.min(50, v)),
                key7Function: (v) => Math.max(1, Math.min(4, v)),
                key9Function: (v) => Math.max(1, Math.min(4, v)),
                modifierKey: (v) => Math.max(1, Math.min(5, v)),
                fineVolumeStep: (v) => Math.max(1, Math.min(10, v))
            };
            return validators[key] ? validators[key](value) : value;
        }
    }

    const configManager = new ConfigManager();
    const getConfig = () => configManager.get();

    // ==================== 菜单系统 ====================
    const t = {
        menuStep: '⚙️ 设置步进',
        menuLongStep: '⏱️ 设置长步进',
        menuVolumeStep: '🔊 设置音量步进',
        menuModifier: '🎚️ 设置修饰键微调',
        menuKeyFunc: '🎛️ 设置按键7/9功能',
        promptStep: '设置快进/快退 (秒)',
        promptLongStep: '设置长跳转 (秒)',
        promptVolume: '设置音量幅度 (%)',
        modifierOptions: {
            1: '1. Alt 键',
            2: '2. Ctrl 键',
            3: '3. Shift 键',
            4: '4. Meta 键 (⌘)',
            5: '5. 关闭此功能'
        },
        keyFuncOptions: {
            1: '1. 长步进',
            2: '2. 上一页/下一页',
            3: '3. 上/下一个视频',
            4: '4. 平台原生功能'
        },
        saveAlert: '设置已保存，需刷新页面后生效'
    };

    const registerMenuCommands = () => {
        GM_registerMenuCommand(t.menuStep, () => {
            const newVal = prompt(t.promptStep, getConfig().stepTime);
            if (newVal && !isNaN(newVal)) {
                const config = { ...getConfig() };
                config.stepTime = parseFloat(newVal);
                configManager.set(config);
            }
        });

        GM_registerMenuCommand(t.menuLongStep, () => {
            const newVal = prompt(t.promptLongStep, getConfig().stepTimeLong);
            if (newVal && !isNaN(newVal)) {
                const config = { ...getConfig() };
                config.stepTimeLong = parseFloat(newVal);
                configManager.set(config);
            }
        });

        GM_registerMenuCommand(t.menuVolumeStep, () => {
            const newVal = prompt(t.promptVolume, getConfig().stepVolume);
            if (newVal && !isNaN(newVal)) {
                const config = { ...getConfig() };
                config.stepVolume = parseFloat(newVal);
                configManager.set(config);
            }
        });

        GM_registerMenuCommand(t.menuModifier, () => {
            const options = t.modifierOptions;
            const choice = prompt(
                `${t.menuModifier}\n${Object.values(options).join('\n')}`,
                getConfig().modifierKey
            );
            if (choice && options[choice]) {
                const config = { ...getConfig() };
                config.modifierKey = parseInt(choice);
                configManager.set(config);
                alert(t.saveAlert);
            }
        });

        GM_registerMenuCommand(t.menuKeyFunc, () => {
            const baseOptions = { ...t.keyFuncOptions };
            if (!['YOUTUBE', 'BILIBILI'].includes(PLATFORM)) delete baseOptions[4];

            const config = { ...getConfig() };

            const choice7 = prompt(`${t.menuKeyFunc}\n${Object.values(baseOptions).join('\n')}`, config.key7Function);
            if (choice7 && baseOptions[choice7]) config.key7Function = parseInt(choice7);

            const choice9 = prompt(`${t.menuKeyFunc}\n${Object.values(baseOptions).join('\n')}`, config.key9Function);
            if (choice9 && baseOptions[choice9]) config.key9Function = parseInt(choice9);

            configManager.set(config);
        });
    };

    // ==================== 输入检测 ====================
    const isInputElement = (element) => {
        if (!element?.tagName) return false;

        const tagName = element.tagName.toLowerCase();
        const type = element.type?.toLowerCase() || '';

        // 基本输入元素检测
        if (['input', 'textarea', 'select'].includes(tagName)) {
            if (tagName === 'input' && !['button', 'submit', 'reset', 'checkbox', 'radio'].includes(type)) {
                return true;
            }
            return tagName !== 'input';
        }

        // 可编辑元素检测
        if (element.isContentEditable) return true;

        return false;
    };

    // ==================== 视频管理器 ====================
    class VideoManager {
        constructor() {
            this.cachedVideo = null;
            this.videoElements = [];
            this.currentVideoIndex = 0;
            this.updateVideoElements();

            // 监听DOM变化
            new MutationObserver(() => {
                this.updateVideoElements();
            }).observe(document.body, { childList: true, subtree: true });
        }

        updateVideoElements() {
            const videos = document.querySelectorAll('video');
            this.videoElements = Array.from(videos).filter(video =>
                video.offsetParent !== null && video.readyState > 0 && !video.error
            );
        }

        getVideoElement() {
            // 优先使用缓存的视频
            if (this.cachedVideo && document.contains(this.cachedVideo) && !this.cachedVideo.error) {
                return this.cachedVideo;
            }

            // 平台特定查找
            let video = null;
            switch (PLATFORM) {
                case 'YOUTUBE':
                    video = document.querySelector('video');
                    break;
                case 'BILIBILI':
                    video = document.querySelector('.bpx-player-video-wrap video, video');
                    break;
                case 'TWITCH':
                    video = document.querySelector('.video-ref video, video');
                    break;
                case 'STEAM':
                    video = this.videoElements[0];
                    break;
                default:
                    video = document.querySelector('video');
            }

            // 备用查找：iframe中的视频
            if (!video) {
                video = this.findVideoInIframes();
            }

            this.cachedVideo = video;
            return video;
        }

        findVideoInIframes() {
            const iframes = document.querySelectorAll('iframe');
            for (let i = 0; i < iframes.length; i++) {
                try {
                    const iframe = iframes[i];
                    if (iframe.offsetParent === null) continue;

                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    const video = iframeDoc?.querySelector('video');
                    if (video && video.readyState > 0) return video;
                } catch (error) {
                    // iframe访问错误，忽略
                }
            }
            return null;
        }

        switchToNextVideo() {
            if (this.videoElements.length < 2) return null;

            this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videoElements.length;
            this.cachedVideo = this.videoElements[this.currentVideoIndex];
            return this.cachedVideo;
        }

        switchToPrevVideo() {
            if (this.videoElements.length < 2) return null;

            this.currentVideoIndex = (this.currentVideoIndex - 1 + this.videoElements.length) % this.videoElements.length;
            this.cachedVideo = this.videoElements[this.currentVideoIndex];
            return this.cachedVideo;
        }
    }

	// ==================== 反馈显示 ====================
	class VolumeDisplay {
		constructor() {
			this.element = null;
			this.hideTimer = null;
			this.currentVideo = null;
			this.isVisible = false;
			this.lastScrollX = window.scrollX;
			this.lastScrollY = window.scrollY;
			this.create();
		}

		create() {
			if (this.element) return;

			this.element = document.createElement('div');
			this.element.id = 'dx-volume-display';
			Object.assign(this.element.style, {
				position: 'fixed',
				zIndex: 2147483647,
				minWidth: '90px',
				height: '50px',
				lineHeight: '50px',
				textAlign: 'center',
				borderRadius: '4px',
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				color: '#fff',
				fontSize: '24px',
				fontFamily: 'Arial, sans-serif',
				opacity: '0',
				transition: 'opacity 0.3s',
				pointerEvents: 'none'
			});
			document.body.appendChild(this.element);
		}

		show(text) {
			if (!this.element) return;

			// 没有视频时不显示
			this.currentVideo = videoManager.getVideoElement();
			if (!this.currentVideo) return;

			this.element.textContent = text;
			this.updatePosition();
			this.startScrollTracking();
			this.setAutoHide();
			
			this.isVisible = true;
			this.element.style.opacity = '1';
		}

		updatePosition() {
			if (!this.currentVideo) return;

			try {
				const rect = this.currentVideo.getBoundingClientRect();
				const viewportWidth = window.innerWidth;
				const viewportHeight = window.innerHeight;

				// 计算可见区域
				const visibleLeft = Math.max(rect.left, 0);
				const visibleTop = Math.max(rect.top, 0);
				const visibleRight = Math.min(rect.right, viewportWidth);
				const visibleBottom = Math.min(rect.bottom, viewportHeight);

				const visibleWidth = visibleRight - visibleLeft;
				const visibleHeight = visibleBottom - visibleTop;

				// 判断是否应该在屏幕中间显示
				const shouldShowAtCenter = 
					visibleWidth <= 0 || 
					visibleHeight <= 0 ||
					(visibleWidth / rect.width) < 0.5 || 
					(visibleHeight / rect.height) < 0.5;

				if (shouldShowAtCenter) {
					this.showAtCenter();
				} else {
					this.showOverVideo(visibleLeft, visibleTop, visibleWidth, visibleHeight);
				}
			} catch (error) {
				// 出错 → 不显示
				return;
			}
		}

		showOverVideo(left, top, width, height) {
			const centerX = left + width / 2;
			const centerY = top + height / 2;

			this.element.style.left = `${centerX}px`;
			this.element.style.top = `${centerY}px`;
			this.element.style.transform = 'translate(-50%, -50%)';
		}

		showAtCenter() {
			this.element.style.left = '50%';
			this.element.style.top = '50%';
			this.element.style.transform = 'translate(-50%, -50%)';
		}

		startScrollTracking() {
			// 保存当前滚动位置
			this.lastScrollX = window.scrollX;
			this.lastScrollY = window.scrollY;
			
			// 添加滚动监听
			window.addEventListener('scroll', this.handleScroll, { passive: true });
			window.addEventListener('resize', this.handleScroll, { passive: true });
		}

		stopScrollTracking() {
			window.removeEventListener('scroll', this.handleScroll);
			window.removeEventListener('resize', this.handleScroll);
		}

		handleScroll = () => {
			if (!this.isVisible) return;
			
			// 检查滚动是否真的发生了
			const currentScrollX = window.scrollX;
			const currentScrollY = window.scrollY;
			
			if (currentScrollX !== this.lastScrollX || currentScrollY !== this.lastScrollY) {
				this.updatePosition();
				this.lastScrollX = currentScrollX;
				this.lastScrollY = currentScrollY;
			}
		}

		setAutoHide() {
			// 清除之前的定时器
			clearTimeout(this.hideTimer);
			
			// 设置新的定时器，1200毫秒后隐藏
			this.hideTimer = setTimeout(() => {
				if (this.element) {
					this.element.style.opacity = '0';
					this.isVisible = false;
					this.stopScrollTracking();
					this.currentVideo = null;
				}
			}, 1200);
		}

		showVolume(vol) {
			this.show(`${Math.round(vol)}%`);
		}

		showPlaybackRate(rate) {
			this.show(`${rate.toFixed(2)}x`);
		}

		showEnhancedFeedback(text) {
			this.show(text);
		}
	}

    // ==================== 平台功能 ====================
    const clampVolume = (vol) => Math.max(0, Math.min(100, Math.round(vol)));

    const commonAdjustVolume = (video, delta) => {
        const config = getConfig();
        const isFineAdjust = Math.abs(delta) === config.fineVolumeStep;
        const actualDelta = isFineAdjust ? delta : (delta > 0 ? config.stepVolume : -config.stepVolume);

        const newVolume = clampVolume((video.volume * 100) + actualDelta);
        video.volume = newVolume / 100;

        return newVolume;
    };

    const toggleNativeFullscreen = (video) => {
        if (!video) return;
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                const elementToFullscreen = video.parentElement || video;
                elementToFullscreen.requestFullscreen?.() || video.requestFullscreen?.();
            }
        } catch (error) {
            // 全屏错误，忽略
        }
    };

    const simulateKeyPress = (key) => {
        try {
            document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        } catch (error) {
            // 按键模拟错误，忽略
        }
    };

    // ==================== B站28键处理 ====================
    const setupBilibiliKeyOverride = () => {
        if (PLATFORM !== 'BILIBILI') return;

        const waitForBilibiliPlayer = () => {
            const playerContainer = document.querySelector('.bpx-player-video-wrap, .bilibili-player-video');
            if (playerContainer) {
                playerContainer.addEventListener('keydown', (e) => {
                    if (e.code.includes('Numpad')) {
                        e.stopPropagation();
                    }
                }, true);
            }
        };

        waitForBilibiliPlayer();

        new MutationObserver(waitForBilibiliPlayer).observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // ==================== 按键处理器 ====================
    class KeyEventHandler {
        checkCustomModifier(e, config) {
            if (config.modifierKey === 5) return false;

            const modifierKeys = ['altKey', 'ctrlKey', 'shiftKey', 'metaKey'];
            const requiredModifier = modifierKeys[config.modifierKey - 1];

            const otherModifiers = modifierKeys.filter((_, index) => index !== config.modifierKey - 1);
            const hasOtherModifiers = otherModifiers.some(mod => e[mod]);

            return e[requiredModifier] && !hasOtherModifiers;
        }

        handleSpecialKeys(e, config) {
            const video = videoManager.getVideoElement();

            if (e.code === 'Numpad7') {
                switch (config.key7Function) {
                    case 1:
                        video && (video.currentTime -= config.stepTimeLong);
                        break;
                    case 2:
                        history.back();
                        break;
                    case 3:
                        const prevVideo = videoManager.switchToPrevVideo();
                        if (prevVideo) prevVideo.play();
                        break;
                    case 4:
                        if (PLATFORM === 'YOUTUBE') {
                            document.querySelector('.ytp-prev-button')?.click();
                        } else if (PLATFORM === 'BILIBILI') {
                            document.querySelector('.bpx-player-ctrl-prev')?.click();
                        } else if (PLATFORM === 'TWITCH') {
                            simulateKeyPress('ArrowLeft');
                        }
                        break;
                }
                return true;
            }

            if (e.code === 'Numpad9') {
                switch (config.key9Function) {
                    case 1:
                        video && (video.currentTime += config.stepTimeLong);
                        break;
                    case 2:
                        history.forward();
                        break;
                    case 3:
                        const nextVideo = videoManager.switchToNextVideo();
                        if (nextVideo) nextVideo.play();
                        break;
                    case 4:
                        if (PLATFORM === 'YOUTUBE') {
                            document.querySelector('.ytp-next-button')?.click();
                        } else if (PLATFORM === 'BILIBILI') {
                            document.querySelector('.bpx-player-ctrl-next')?.click();
                        } else if (PLATFORM === 'TWITCH') {
                            simulateKeyPress('ArrowRight');
                        }
                        break;
                }
                return true;
            }

            return false;
        }

        adjustPlaybackRate(changeValue) {
            const video = videoManager.getVideoElement();
            if (!video) return;

            const newRate = Math.max(0.1, Math.min(16, video.playbackRate + changeValue));
            video.playbackRate = parseFloat(newRate.toFixed(1));
            volumeDisplay.showPlaybackRate(newRate);
        }

        togglePlaybackRate() {
            const video = videoManager.getVideoElement();
            if (!video) return;

            if (video.playbackRate === 1.0) {
                video.playbackRate = 2.0;
                volumeDisplay.showEnhancedFeedback('速率 2.0x');
            } else {
                video.playbackRate = 1.0;
                volumeDisplay.showEnhancedFeedback('速率 1.0x (默认)');
            }
        }

        handleCommonKeys(e, config) {
            const video = videoManager.getVideoElement();

            const actions = {
                'Numpad5': () => {
                    if (video) video[video.paused ? 'play' : 'pause']();
                },
                'NumpadEnter': () => {
                    if (PLATFORM === 'YOUTUBE') {
                        document.querySelector('.ytp-fullscreen-button')?.click();
                    } else if (PLATFORM === 'BILIBILI') {
                        document.querySelector('.bpx-player-ctrl-full')?.click();
                    } else if (PLATFORM === 'TWITCH') {
                        document.querySelector('[data-a-target="player-fullscreen-button"]')?.click();
                    } else {
                        toggleNativeFullscreen(video);
                    }
                    volumeDisplay.showEnhancedFeedback('⛶ 全屏切换');
                },
                'Numpad0': () => this.togglePlaybackRate(),
                'Numpad1': () => this.adjustPlaybackRate(-0.1),
                'Numpad3': () => this.adjustPlaybackRate(0.1),
                'Numpad8': () => {
                    if (video) {
                        if (PLATFORM === 'YOUTUBE') {
                            const ytPlayer = document.querySelector('#movie_player');
                            if (ytPlayer?.getVolume) {
                                const currentVol = ytPlayer.getVolume();
                                const newVol = clampVolume(currentVol + config.stepVolume);
                                ytPlayer.setVolume(newVol);
                                video.volume = newVol / 100;
                                volumeDisplay.showVolume(newVol);
                            } else {
                                const newVol = commonAdjustVolume(video, config.stepVolume);
                                volumeDisplay.showVolume(newVol);
                            }
                        } else {
                            const newVol = commonAdjustVolume(video, config.stepVolume);
                            volumeDisplay.showVolume(newVol);
                        }
                    }
                },
                'Numpad2': () => {
                    if (video) {
                        if (PLATFORM === 'YOUTUBE') {
                            const ytPlayer = document.querySelector('#movie_player');
                            if (ytPlayer?.getVolume) {
                                const currentVol = ytPlayer.getVolume();
                                const newVol = clampVolume(currentVol - config.stepVolume);
                                ytPlayer.setVolume(newVol);
                                video.volume = newVol / 100;
                                volumeDisplay.showVolume(newVol);
                            } else {
                                const newVol = commonAdjustVolume(video, -config.stepVolume);
                                volumeDisplay.showVolume(newVol);
                            }
                        } else {
                            const newVol = commonAdjustVolume(video, -config.stepVolume);
                            volumeDisplay.showVolume(newVol);
                        }
                    }
                },
                'Numpad4': () => {
                    if (video) {
                        video.currentTime -= config.stepTime;
                        volumeDisplay.showEnhancedFeedback(`-${config.stepTime}s`);
                    }
                },
                'Numpad6': () => {
                    if (video) {
                        video.currentTime += config.stepTime;
                        volumeDisplay.showEnhancedFeedback(`+${config.stepTime}s`);
                    }
                }
            };

            if (actions[e.code]) {
                actions[e.code]();
                return true;
            }

            return false;
        }

		handleKeyEvent = (e) => {
			// 输入检测
			if (isInputElement(e.target)) {
				if (!['ArrowUp', 'ArrowDown'].includes(e.code)) return;
			}

			const config = getConfig();

			// 修饰键检测
			if (this.checkCustomModifier(e, config)) {
				const video = videoManager.getVideoElement();
				if (e.code === 'Numpad8') {
					const newVol = commonAdjustVolume(video, config.fineVolumeStep);
					volumeDisplay.showVolume(newVol); // 添加反馈显示
					e.preventDefault();
					e.stopImmediatePropagation();
				} else if (e.code === 'Numpad2') {
					const newVol = commonAdjustVolume(video, -config.fineVolumeStep);
					volumeDisplay.showVolume(newVol); // 添加反馈显示
					e.preventDefault();
					e.stopImmediatePropagation();

				}
				return;
			}

			// 新增：如果按下了多个修饰键，直接返回，不执行任何功能
			const modifierKeys = ['altKey', 'ctrlKey', 'shiftKey', 'metaKey'];
			const pressedModifiers = modifierKeys.filter(mod => e[mod]);
			if (pressedModifiers.length > 1) {
				return; // 按下了多个修饰键，直接返回
			}

			// 处理特殊按键
			if (this.handleSpecialKeys(e, config)) {
				e.preventDefault();
				e.stopImmediatePropagation();
				return;
			}

			// 处理通用按键
			if (this.handleCommonKeys(e, config)) {
				e.preventDefault();
				e.stopImmediatePropagation();
			}
		}
    }

    // ==================== 全局初始化 ====================
    const videoManager = new VideoManager();
    const volumeDisplay = new VolumeDisplay();
    const keyEventHandler = new KeyEventHandler();

    const init = () => {
        registerMenuCommands();

        if (PLATFORM === 'BILIBILI') setupBilibiliKeyOverride();

        document.addEventListener('keydown', keyEventHandler.handleKeyEvent, {
            capture: true,
            passive: false
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// ==UserScript==
// @name         全局视频控制栏 - 简洁版
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  提供悬浮控制栏，支持点击播放暂停、单击快进快退、长按持续加速等操作
// @author       Your Name
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553573/%E5%85%A8%E5%B1%80%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E6%A0%8F%20-%20%E7%AE%80%E6%B4%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/553573/%E5%85%A8%E5%B1%80%E8%A7%86%E9%A2%91%E6%8E%A7%E5%88%B6%E6%A0%8F%20-%20%E7%AE%80%E6%B4%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================
    // 配置常量
    // ================================
    const CONFIG = {
        // 长按持续加速设置
        HOLD_SEEK_INITIAL_DELAY: 400,
        HOLD_SEEK_REPEAT_INTERVAL: 100,
        HOLD_SEEK_ACCELERATION: 1.5,
        HOLD_SEEK_MAX_SPEED: 20,
        HOLD_SEEK_INITIAL_SPEED: 2,

        // 亮度设置
        BRIGHTNESS_MIN: 0.2,
        BRIGHTNESS_MAX: 2.0,
        BRIGHTNESS_STEP: 0.1,

        // 音量设置
        VOLUME_MIN: 0.0,
        VOLUME_MAX: 1.0,
        VOLUME_STEP: 0.05,

        // 界面设置
        HINT_FADE_DELAY: 1200,
        OVERLAY_CLASS: 'tm-mobile-overlay',
        CONTROL_BAR_CLASS: 'tm-mobile-control-bar',
        CONTROL_BUTTON_CLASS: 'tm-mobile-control-button',
        CONTROL_HINT_CLASS: 'tm-mobile-control-hint',

        // 强制覆盖设置
        FORCE_OVERLAY_ZINDEX: '2147483647'
    };

    const DEFAULT_SETTINGS = Object.freeze({
        enableGestures: true,
        enableHints: true,
        enableHoldSeek: true,
        forceOverlay: true,
        doubleTapStep: 10
    });

    // ================================
    // 工具函数
    // ================================
    const Utils = {
        // 数值限制
        clamp(val, min, max) {
            return Math.min(Math.max(val, min), max);
        },

        // 视频跳转
        seekVideo(video, delta) {
            const target = Math.min(
                Math.max(video.currentTime + delta, 0),
                Number.isFinite(video.duration) ? video.duration : Number.MAX_SAFE_INTEGER
            );
            video.currentTime = target;
            return target;
        },

        // 亮度控制
        getBrightness(video) {
            return Number(video.dataset.tmBrightness || '1');
        },

        setBrightness(video, value) {
            video.dataset.tmBrightness = value.toString();
            this.applyBrightness(video, value);
        },

        applyBrightness(video, value) {
            const base = (video.dataset.tmOriginalFilter || '').trim();
            const parts = [];
            if (base) parts.push(base);
            parts.push(`brightness(${value.toFixed(2)})`);
            video.style.filter = parts.join(' ');
        },

        // 音量控制
        setVolume(video, value) {
            video.volume = this.clamp(value, CONFIG.VOLUME_MIN, CONFIG.VOLUME_MAX);
            if (video.volume > 0 && video.muted) video.muted = false;
        },

        // 获取播放器容器 - 增强版
        getPlayerContainer(video) {
            // 尝试多种选择器来找到播放器容器
            const selectors = [
                'video',
                '.video-player',
                '.player',
                '.video-container',
                '.vp-player',
                '.bpx-player-container',
                '.bilibili-player',
                '.ytp-chrome-bottom',
                '.html5-video-player',
                '[data-player]',
                '[class*="player"]',
                '[class*="video"]',
                'div:has(> video)'
            ];
            
            for (const selector of selectors) {
                const container = video.closest(selector);
                if (container && container !== video && container instanceof HTMLElement) {
                    return container;
                }
            }
            
            // 如果没找到合适的容器，返回视频的直接父元素
            return video.parentElement;
        },

        // 时间格式化
        formatTime(seconds) {
            if (!Number.isFinite(seconds) || seconds < 0) {
                return '--:--';
            }
            const whole = Math.floor(seconds);
            const mins = Math.floor(whole / 60);
            const secs = whole % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },

        formatTimeLabel(current, duration) {
            const currentText = this.formatTime(current);
            if (!Number.isFinite(duration) || duration <= 0) {
                return currentText;
            }
            return `${currentText} / ${this.formatTime(duration)}`;
        },

        // 禁用原生控制栏的指针事件
        disableNativeControls(video) {
            // 查找并禁用常见的播放器控制栏
            const controlSelectors = [
                '.ytp-chrome-controls',
                '.bpx-player-control',
                '.control-bar',
                '.video-controls',
                '.player-controls',
                '[class*="control"]'
            ];
            
            controlSelectors.forEach(selector => {
                const controls = video.parentElement?.querySelectorAll(selector);
                controls?.forEach(control => {
                    if (control instanceof HTMLElement) {
                        control.style.pointerEvents = 'none';
                        control.style.zIndex = '1';
                    }
                });
            });
        }
    };

    // ================================
    // 设置管理器
    // ================================
    class SettingsManager {
        constructor() {
            this.settings = {
                enableGestures: GM_getValue('enableGestures', DEFAULT_SETTINGS.enableGestures),
                enableHints: GM_getValue('enableHints', DEFAULT_SETTINGS.enableHints),
                enableHoldSeek: GM_getValue('enableHoldSeek', DEFAULT_SETTINGS.enableHoldSeek),
                forceOverlay: GM_getValue('forceOverlay', DEFAULT_SETTINGS.forceOverlay),
                doubleTapStep: GM_getValue('doubleTapStep', DEFAULT_SETTINGS.doubleTapStep)
            };
        }

        updateSetting(key, value) {
            this.settings[key] = value;
            GM_setValue(key, value);
        }

        registerMenuCommands() {
            GM_registerMenuCommand('📱 开关控制栏', () => {
                this.toggleSetting('enableGestures');
            });
            
            GM_registerMenuCommand('⏩ 开关长按加速', () => {
                this.toggleSetting('enableHoldSeek');
            });

            GM_registerMenuCommand('🛡️ 开关置顶浮层', () => {
                this.toggleSetting('forceOverlay');
            });

            GM_registerMenuCommand('💡 开关提示信息', () => {
                this.toggleSetting('enableHints');
            });

            GM_registerMenuCommand('⏭️ 设置快进快退秒数', () => {
                this.promptNumericSetting({
                    key: 'doubleTapStep',
                    title: '请输入每次快进/快退的秒数 (1 - 120)',
                    min: 1,
                    max: 120,
                    step: 1,
                    decimals: 0,
                    unit: 's'
                });
            });

            GM_registerMenuCommand('♻️ 重置所有设置', () => {
                this.resetSettings();
            });
        }

        toggleSetting(key) {
            const newValue = !this.settings[key];
            this.updateSetting(key, newValue);
            const names = {
                enableGestures: '控制栏',
                enableHoldSeek: '长按加速',
                forceOverlay: '置顶浮层',
                enableHints: '提示信息'
            };
            const label = names[key] || key;
            alert(`${label} ${newValue ? '已开启' : '已关闭'}`);
        }

        promptNumericSetting({ key, title, min, max, step = 1, decimals = 2, unit = '' }) {
            const current = this.settings[key];
            const message = `${title}\n当前值: ${current}${unit}`;
            const input = window.prompt(message, current);
            if (input === null) return;

            let value = Number(input);
            if (!Number.isFinite(value)) {
                alert('请输入有效的数字');
                return;
            }

            if (step > 0) {
                value = Math.round(value / step) * step;
            }

            value = Utils.clamp(value, min, max);
            const formatted = decimals >= 0 ? Number(value.toFixed(decimals)) : value;

            this.updateSetting(key, formatted);
            alert(`${title} 已设置为 ${formatted}${unit}`);
        }

        resetSettings() {
            Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
                this.updateSetting(key, value);
            });
            alert('所有设置已重置为默认值');
        }
    }

    // ================================
    // 长按持续加速管理器
    // ================================
    class HoldSeekManager {
        constructor(settingsManager) {
            this.settingsManager = settingsManager;
            this.repeatTimers = new WeakMap();
            this.holdStates = new WeakMap();
            this.speeds = new WeakMap();
        }

        // 开始长按持续加速
        startHoldSeek(video, direction, onProgress) {
            if (!this.settingsManager.settings.enableHoldSeek) return;
            this.stopHoldSeek(video);

            let speed = CONFIG.HOLD_SEEK_INITIAL_SPEED;
            let lastTime = Date.now();

            const performSeek = () => {
                const now = Date.now();
                const deltaTime = (now - lastTime) / 1000; // 转换为秒
                const seekAmount = direction * speed * deltaTime;
                const target = Utils.seekVideo(video, seekAmount);
                lastTime = now;

                // 持续加速
                speed = Math.min(speed * CONFIG.HOLD_SEEK_ACCELERATION, CONFIG.HOLD_SEEK_MAX_SPEED);
                this.speeds.set(video, speed);

                onProgress(seekAmount, speed, target);
            };

            const intervalId = setInterval(performSeek, CONFIG.HOLD_SEEK_REPEAT_INTERVAL);
            this.repeatTimers.set(video, intervalId);
            this.speeds.set(video, speed);

            console.log(`🎬 开始持续加速: ${direction > 0 ? '快进' : '快退'}, 初始速度: ${speed}x`);
        }

        stopHoldSeek(video) {
            const timer = this.repeatTimers.get(video);
            if (timer) {
                clearInterval(timer);
                this.repeatTimers.delete(video);
                this.speeds.delete(video);
                console.log('🎬 停止持续加速');
            }
        }

        isHolding(video) {
            return this.repeatTimers.has(video);
        }

        getCurrentSpeed(video) {
            return this.speeds.get(video) || 0;
        }
    }

    // ================================
    // 手势管理器
    // ================================
    class GestureManager {
        constructor(holdManager, settingsManager) {
            this.holdManager = holdManager;
            this.settingsManager = settingsManager;
            this.bound = new WeakSet();
        }

        ensure(video) {
            if (this.bound.has(video)) return;
            this.bound.add(video);

            if (!this.settingsManager.settings.enableGestures) return;

            const container = Utils.getPlayerContainer(video);
            let overlayHost = container instanceof HTMLElement ? container : video.parentElement;

            if (!overlayHost) {
                console.warn('未找到合适的覆盖层容器，使用视频元素本身');
                overlayHost = video;
            }

            this.forceContainerStyle(overlayHost);

            const { overlay, hint, controlBar } = this.buildOverlay();

            this.attachOverlay(overlayHost, overlay);
            this.initBrightness(video);
            this.initControls(video, hint, controlBar);

            if (this.settingsManager.settings.forceOverlay) {
                Utils.disableNativeControls(video);
            }

            console.log('🎬 视频控制栏已绑定:', video);
        }

        forceContainerStyle(container) {
            if (!this.settingsManager.settings.forceOverlay) return;

            Object.assign(container.style, {
                position: 'relative',
                zIndex: 'auto'
            });
        }

        buildOverlay() {
            const overlay = document.createElement('div');
            overlay.className = CONFIG.OVERLAY_CLASS;

            Object.assign(overlay.style, {
                position: 'absolute',
                inset: '0',
                zIndex: CONFIG.FORCE_OVERLAY_ZINDEX,
                pointerEvents: 'none'
            });

            const hint = document.createElement('div');
            hint.className = CONFIG.CONTROL_HINT_CLASS;

            Object.assign(hint.style, {
                position: 'absolute',
                top: '12%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '10px 16px',
                borderRadius: '16px',
                background: 'rgba(30,30,30,0.75)',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '500',
                boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(10px)',
                opacity: '0',
                transition: 'opacity 0.2s ease',
                pointerEvents: 'none',
                textAlign: 'center',
                minWidth: '120px',
                whiteSpace: 'pre-line'
            });

            const controlBar = document.createElement('div');
            controlBar.className = CONFIG.CONTROL_BAR_CLASS;

            Object.assign(controlBar.style, {
                position: 'absolute',
                left: '50%',
                bottom: '24px',
                transform: 'translate(-50%, 12px)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '22px',
                background: 'rgba(18,18,18,0.72)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.35)',
                pointerEvents: 'auto',
                backdropFilter: 'blur(12px)',
                opacity: '0',
                transition: 'opacity 0.25s ease, transform 0.25s ease'
            });

            overlay.append(hint, controlBar);
            return { overlay, hint, controlBar };
        }

        attachOverlay(target, overlay) {
            if (!(target instanceof HTMLElement)) return;

            const existingOverlay = target.querySelector(`.${CONFIG.OVERLAY_CLASS}`);
            if (existingOverlay) {
                existingOverlay.remove();
            }

            const style = getComputedStyle(target);
            if (style.position === 'static') {
                if (!target.dataset.tmGestureOriginalPosition) {
                    target.dataset.tmGestureOriginalPosition = target.style.position || '';
                }
                target.style.position = 'relative';
            }

            target.appendChild(overlay);
        }

        initBrightness(video) {
            if (!video.dataset.tmOriginalFilterCaptured) {
                video.dataset.tmOriginalFilterCaptured = '1';
                video.dataset.tmOriginalFilter = video.style.filter || '';
                if (!video.dataset.tmBrightness) {
                    video.dataset.tmBrightness = '1';
                }
                Utils.applyBrightness(video, Number(video.dataset.tmBrightness));
            }
        }

        makeHintHandler(hint) {
            return (text) => {
                if (!this.settingsManager.settings.enableHints) return;

                hint.textContent = text;
                hint.style.opacity = '1';

                clearTimeout(hint.hideTimer);
                hint.hideTimer = setTimeout(() => {
                    hint.style.opacity = '0';
                }, CONFIG.HINT_FADE_DELAY);
            };
        }

        initControls(video, hint, controlBar) {
            const showHint = this.makeHintHandler(hint);
            controlBar.replaceChildren();

            const visibility = this.createVisibilityController(controlBar);
            visibility.hideImmediate();

            const { backButton, playButton, forwardButton } = this.createControlButtons(video, controlBar, showHint);
            this.updatePlayButtonIcon(playButton, video);

            const focusControls = () => visibility.showTemporarily();
            ['pointerdown', 'pointermove', 'touchstart', 'click', 'keydown'].forEach(evt => {
                video.addEventListener(evt, focusControls, { passive: true });
            });

            const updateIcon = () => this.updatePlayButtonIcon(playButton, video);
            video.addEventListener('play', updateIcon);
            video.addEventListener('pause', updateIcon);
        }

        createVisibilityController(controlBar) {
            let hideTimer = null;
            const SHOW_DURATION = 2500;

            const show = () => {
                controlBar.style.opacity = '1';
                controlBar.style.transform = 'translate(-50%, 0)';
            };

            const hide = () => {
                controlBar.style.opacity = '0';
                controlBar.style.transform = 'translate(-50%, 12px)';
            };

            const hideImmediate = () => {
                clearTimeout(hideTimer);
                controlBar.style.transition = 'none';
                hide();
                requestAnimationFrame(() => {
                    controlBar.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                });
            };

            const showTemporarily = () => {
                show();
                clearTimeout(hideTimer);
                hideTimer = setTimeout(() => {
                    hide();
                }, SHOW_DURATION);
            };

            controlBar.addEventListener('pointerenter', () => {
                clearTimeout(hideTimer);
                show();
            });

            controlBar.addEventListener('pointerleave', () => {
                hideTimer = setTimeout(() => {
                    hide();
                }, SHOW_DURATION);
            });

            return { showTemporarily, hideImmediate };
        }

        createControlButtons(video, container, showHint) {
            const backButton = this.createControlButton('⏪', '点击后退，按住持续快退');
            const playButton = this.createControlButton(video.paused ? '▶️' : '⏸', '播放 / 暂停');
            const forwardButton = this.createControlButton('⏩', '点击快进，按住持续快进');

            container.append(backButton, playButton, forwardButton);

            this.setupSeekButton(video, backButton, -1, showHint);
            this.setupPlayButton(video, playButton, showHint);
            this.setupSeekButton(video, forwardButton, 1, showHint);

            return { backButton, playButton, forwardButton };
        }

        createControlButton(label, title) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = CONFIG.CONTROL_BUTTON_CLASS;
            button.textContent = label;
            if (title) button.title = title;

            Object.assign(button.style, {
                border: 'none',
                outline: 'none',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: '20px',
                width: '52px',
                height: '52px',
                borderRadius: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease, transform 0.2s ease',
                userSelect: 'none',
                touchAction: 'manipulation',
                fontFamily: 'inherit'
            });

            return button;
        }

        setButtonPressed(button, pressed) {
            if (!button) return;
            button.style.background = pressed ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)';
            button.style.transform = pressed ? 'scale(0.95)' : 'scale(1)';
        }

        getSeekStep() {
            const configured = this.settingsManager.settings.doubleTapStep;
            if (Number.isFinite(configured) && configured > 0) {
                return configured;
            }
            return DEFAULT_SETTINGS.doubleTapStep;
        }

        setupPlayButton(video, button, showHint) {
            this.setButtonPressed(button, false);

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePlayback(video, showHint);
            });

            const reset = () => this.setButtonPressed(button, false);

            button.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                this.setButtonPressed(button, true);
            });
            button.addEventListener('pointerup', reset);
            button.addEventListener('pointerleave', reset);
            button.addEventListener('pointercancel', reset);
        }

        showPlaybackHint(video, showHint, state) {
            if (!showHint) return;
            const label = Utils.formatTimeLabel(video.currentTime, video.duration);
            if (state === 'play') {
                showHint(`▶️ 播放\n${label}`);
            } else {
                showHint(`⏸ 暂停\n${label}`);
            }
        }

        updatePlayButtonIcon(button, video) {
            if (!button) return;
            button.textContent = video.paused ? '▶️' : '⏸';
        }

        setupSeekButton(video, button, direction, showHint) {
            const state = {
                pointerId: null,
                holdTimer: null,
                holding: false
            };

            const clearHoldTimer = () => {
                if (state.holdTimer) {
                    clearTimeout(state.holdTimer);
                    state.holdTimer = null;
                }
            };

            const stopHold = (withMessage) => {
                if (!state.holding) {
                    this.holdManager.stopHoldSeek(video);
                    return;
                }

                const peak = this.holdManager.getCurrentSpeed(video) || 0;
                this.holdManager.stopHoldSeek(video);
                state.holding = false;

                if (withMessage) {
                    const label = Utils.formatTimeLabel(video.currentTime, video.duration);
                    const suffix = peak > 0 ? `\n最高速度: ${peak.toFixed(1)}x` : '';
                    showHint(`✅ ${direction > 0 ? '快进结束' : '快退结束'}${suffix}\n${label}`);
                }
            };

            const startHold = () => {
                if (!this.settingsManager.settings.enableHoldSeek) return;
                state.holding = true;
                const dirTxt = direction > 0 ? '快进' : '快退';
                showHint(`⏩ ${dirTxt}中...\n${Utils.formatTimeLabel(video.currentTime, video.duration)}`);
                this.holdManager.startHoldSeek(video, direction, (seekAmount, speed, target) => {
                    const label = Utils.formatTimeLabel(target, video.duration);
                    showHint(`⏩ ${dirTxt} ${speed.toFixed(1)}x\n${label}`);
                });
            };

            const finish = (e, canceled) => {
                if (state.pointerId === null || e.pointerId !== state.pointerId) return;

                clearHoldTimer();

                if (!state.holding && !canceled) {
                    const step = this.getSeekStep();
                    const delta = direction * step;
                    const target = Utils.seekVideo(video, delta);
                    const label = Utils.formatTimeLabel(target, video.duration);
                    const icon = direction > 0 ? '▶▶' : '◀◀';
                    const action = direction > 0 ? '快进' : '快退';
                    showHint(`${icon} ${action} ${Math.abs(delta)}s\n${label}`);
                }

                stopHold(!canceled);
                this.setButtonPressed(button, false);

                try {
                    button.releasePointerCapture(e.pointerId);
                } catch (_) {}

                state.pointerId = null;
            };

            button.addEventListener('pointerdown', (e) => {
                if (e.pointerType === 'mouse' && e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();

                if (state.pointerId !== null) return;

                state.pointerId = e.pointerId;
                this.setButtonPressed(button, true);

                clearHoldTimer();
                if (this.settingsManager.settings.enableHoldSeek) {
                    state.holdTimer = setTimeout(() => {
                        state.holdTimer = null;
                        startHold();
                    }, CONFIG.HOLD_SEEK_INITIAL_DELAY);
                }

                try {
                    button.setPointerCapture(e.pointerId);
                } catch (_) {}
            }, { passive: false });

            button.addEventListener('pointerup', (e) => finish(e, false), { passive: false });
            button.addEventListener('pointercancel', (e) => finish(e, true), { passive: false });
            button.addEventListener('pointerleave', (e) => finish(e, true), { passive: false });
        }

        togglePlayback(video, showHint) {
            if (video.paused) {
                const result = video.play();
                if (result && typeof result.then === 'function') {
                    result.then(() => {
                        this.showPlaybackHint(video, showHint, 'play');
                    }).catch(() => {
                        video.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    });
                } else {
                    this.showPlaybackHint(video, showHint, 'play');
                }
            } else {
                video.pause();
                this.showPlaybackHint(video, showHint, 'pause');
            }
        }

        scan(root = document) {
            root.querySelectorAll('video').forEach(v => this.ensure(v));
        }
    }

    // ================================
    // 初始化脚本
    // ================================
    function initialize() {
        const settingsManager = new SettingsManager();
        const holdManager = new HoldSeekManager(settingsManager);
        const gestureManager = new GestureManager(holdManager, settingsManager);

        // 注册菜单命令
        settingsManager.registerMenuCommands();

        // 监听DOM变化
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'VIDEO') {
                        setTimeout(() => gestureManager.ensure(node), 100);
                    } else {
                        gestureManager.scan(node);
                    }
                });
            }
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 初始扫描
        setTimeout(() => {
            gestureManager.scan();
            console.log('🎬 全局视频控制栏脚本已加载 - 简洁版 v3.0');
            console.log('📱 功能说明:');
            console.log('   ⏯️ 单击播放键: 播放/暂停');
            console.log('   ⏩ 单击快进/快退: 按设置秒数跳转');
            console.log('   ⏱️ 长按快进/快退: 持续加速跳转');
            console.log('   💡 控制栏提示: 显示当前时间与操作状态');
        }, 1000);
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();

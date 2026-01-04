
// ==UserScript==
// @name         B站终极声道控制Pro
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  整合版：声道控制+自动切换+镜像同步
// @author       QAQ
// @match        https://www.bilibili.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550150/B%E7%AB%99%E7%BB%88%E6%9E%81%E5%A3%B0%E9%81%93%E6%8E%A7%E5%88%B6Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/550150/B%E7%AB%99%E7%BB%88%E6%9E%81%E5%A3%B0%E9%81%93%E6%8E%A7%E5%88%B6Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 增强配置
    const CONFIG = {
        MODES: {
            ORIGINAL: { id: 0, name: '原声', icon: '🔊', color: '#00a1d6' },
            SWAPPED:  { id: 1, name: '镜像', icon: '🔄', color: '#ff6050' }
        },
        SYNC: {
            INTERVAL: 250,      // 同步频率
            TIMEOUT: 3000       // 同步超时
        },
        AUDIO: {
            SAMPLE_RATE: 48000  // 专业音频采样率
        }
    };

    // 全局状态
    let state = {
        currentMode: GM_getValue('audioMode', CONFIG.MODES.ORIGINAL.id),
        autoSwitch: {
            enabled: false,
            interval: GM_getValue('autoInterval', 5)
        },
        mirror: {
            window: null,
            isMaster: true,
            syncTimer: null
        }
    };

    let audioNodes = new WeakMap();

    // 专业级样式
    GM_addStyle(`
        .bpx-audio-pro-panel {
            position: fixed;
            left: 20px;
            bottom: 100px;
            z-index: 2147483647;
            background: rgba(16,18,20,0.98);
            border-radius: 12px;
            padding: 16px;
            width: 300px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255,255,255,0.15);
            font-family: system-ui, sans-serif;
        }
        .mode-section {
            margin-bottom: 16px;
        }
        .mode-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }
        .mode-btn {
            padding: 12px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .mode-btn.active {
            background: var(--active-color);
            box-shadow: 0 4px 16px var(--active-glow);
        }
        .auto-control {
            margin: 12px 0;
        }
        .time-input {
            width: 100%;
            padding: 10px;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            color: white;
            margin-bottom: 8px;
        }
        .toggle-btn {
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            border: none;
            color: white;
            cursor: pointer;
            transition: opacity 0.2s;
        }
        .auto-active {
            background: linear-gradient(135deg, #00c853 0%, #009624 100%);
        }
        .auto-inactive {
            background: linear-gradient(135deg, #ff6050 0%, #ff3b30 100%);
        }
        .mirror-control {
            margin-top: 12px;
            background: linear-gradient(135deg, #6200ea 0%, #3700b3 100%);
        }
    `);

    // 主初始化
    function initCoreSystem() {
        checkInstanceType();
        injectControlPanel();
        setupAudioSystem();
        setupStateSync();
        registerMenuCommands();
    }

    // 实例类型检测
    function checkInstanceType() {
        const urlParams = new URLSearchParams(window.location.search);
        state.mirror.isMaster = !urlParams.has('mirror');
        if (!state.mirror.isMaster) document.title = `[镜像] ${document.title}`;
    }

    // 注入控制面板
    function injectControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'bpx-audio-pro-panel';
        panel.innerHTML = `
            <div class="mode-section">
                <div class="mode-grid">
                    ${Object.values(CONFIG.MODES).map(mode => `
                        <button class="mode-btn"
                                data-mode="${mode.id}"
                                style="--active-color: ${mode.color};
                                       --active-glow: ${mode.color}40">
                            ${mode.icon} ${mode.name}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="auto-control">
                <input type="number" class="time-input"
                       placeholder="自动切换间隔（秒）" min="1"
                       value="${state.autoSwitch.interval}">
                <button class="toggle-btn ${state.autoSwitch.enabled ? 'auto-active' : 'auto-inactive'}">
                    ${state.autoSwitch.enabled ? '停止自动切换' : '启动自动切换'}
                </button>
            </div>
            ${state.mirror.isMaster ?
                '<button class="toggle-btn mirror-control">${state.mirror.window ? "关闭镜像" : "启动镜像窗口"}</button>' :
                '<div class="mirror-status">镜像模式已激活</div>'
            }
        `;

        const container = document.querySelector('.bpx-player-container') || document.body;
        container.prepend(panel);
        bindPanelEvents(panel);
        updateUIState();
    }

    // 事件绑定
    function bindPanelEvents(panel) {
        // 模式切换
        panel.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => handleModeChange(parseInt(btn.dataset.mode)));
        });

        // 自动切换
        const autoBtn = panel.querySelector('.toggle-btn:not(.mirror-control)');
        autoBtn.addEventListener('click', toggleAutoSwitch);

        // 镜像控制
        const mirrorBtn = panel.querySelector('.mirror-control');
        if (mirrorBtn) {
            mirrorBtn.addEventListener('click', handleMirrorOperation);
        }

        // 输入验证
        panel.querySelector('.time-input').addEventListener('input', function(e) {
            this.value = Math.max(1, parseInt(this.value) || 5);
        });
    }

    // 处理模式切换
    function handleModeChange(modeId) {
        const newMode = Object.values(CONFIG.MODES).find(m => m.id === modeId);
        state.currentMode = newMode;
        applyAudioSettings();
        GM_setValue('audioMode', modeId);
        updateUIState();

        if (state.mirror.window) {
            state.mirror.window.postMessage({
                type: 'modeChange',
                modeId
            }, '*');
        }
    }

    // 自动切换控制
    function toggleAutoSwitch() {
        state.autoSwitch.enabled = !state.autoSwitch.enabled;
        this.classList.toggle('auto-active');
        this.classList.toggle('auto-inactive');
        this.textContent = state.autoSwitch.enabled ? '停止自动切换' : '启动自动切换';

        if (state.autoSwitch.enabled) {
            const interval = parseInt(document.querySelector('.time-input').value) * 1000;
            state.autoSwitch.timer = setInterval(() => {
                const newModeId = (state.currentMode.id + 1) % 2;
                handleModeChange(newModeId);
            }, interval);
        } else {
            clearInterval(state.autoSwitch.timer);
        }
        GM_setValue('autoInterval', document.querySelector('.time-input').value);
    }

    // 镜像窗口管理
    function handleMirrorOperation() {
        const btn = this;
        btn.disabled = true;
        btn.textContent = '初始化中...';

        if (state.mirror.window) {
            state.mirror.window.close();
            state.mirror.window = null;
            btn.textContent = '启动镜像窗口';
            btn.disabled = false;
            return;
        }

        const success = createMirrorWindow();
        if (success) {
            btn.textContent = '同步中...';
            handleModeChange(CONFIG.MODES.SWAPPED.id);
        } else {
            GM_notification({
                title: '镜像创建失败',
                text: '请允许弹出窗口',
                highlight: true
            });
            btn.textContent = '启动镜像窗口';
        }
        btn.disabled = false;
    }

    // 创建镜像窗口
    function createMirrorWindow() {
        try {
            const video = document.querySelector('video');
            if (!video) return false;

            const mirrorUrl = window.location.href.replace(/#.*$/, '') + '?mirror=1';
            state.mirror.window = window.open(mirrorUrl, '_blank', `
                width=${window.innerWidth},
                height=${window.innerHeight},
                location=no,
                menubar=no,
                toolbar=no
            `);

            setupMasterSync(video);
            return true;
        } catch (e) {
            console.error('镜像创建失败:', e);
            return false;
        }
    }

    // 主窗口同步逻辑
    function setupMasterSync(video) {
        let lastUpdate = 0;

        const syncHandler = () => {
            const currentTime = Date.now();
            if (currentTime - lastUpdate < CONFIG.SYNC.INTERVAL) return;

            GM_setValue('syncPacket', {
                time: video.currentTime,
                paused: video.paused,
                rate: video.playbackRate,
                timestamp: currentTime
            });
            lastUpdate = currentTime;
        };

        video.addEventListener('timeupdate', syncHandler);
        video.addEventListener('ratechange', syncHandler);
        video.addEventListener('play', syncHandler);
        video.addEventListener('pause', syncHandler);
    }

    // 状态同步系统
    function setupStateSync() {
        if (!state.mirror.isMaster) {
            state.mirror.syncTimer = setInterval(() => {
                const packet = GM_getValue('syncPacket');
                if (!packet || packet.timestamp <= (video.lastSync || 0)) return;

                const video = document.querySelector('video');
                if (video) {
                    video.lastSync = packet.timestamp;
                    video.currentTime = packet.time;
                    video.playbackRate = packet.rate;
                    packet.paused ? video.pause() : video.play();
                }
            }, CONFIG.SYNC.INTERVAL);
        }

        // 跨窗口通信
        window.addEventListener('message', (e) => {
            if (e.data.type === 'modeChange') {
                handleModeChange(e.data.modeId);
            }
        });
    }

    // 音频系统
    function setupAudioSystem() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') initAudioContext(node);
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始化现有视频
        document.querySelectorAll('video').forEach(initAudioContext);
    }

    // 初始化音频处理
    function initAudioContext(video) {
        if (audioNodes.has(video)) return;

        try {
            const ctx = new AudioContext({ sampleRate: CONFIG.AUDIO.SAMPLE_RATE });
            const source = ctx.createMediaElementSource(video);
            const splitter = ctx.createChannelSplitter(2);
            const merger = ctx.createChannelMerger(2);

            source.connect(splitter);
            updateAudioRouting(splitter, merger);
            merger.connect(ctx.destination);

            audioNodes.set(video, { splitter, merger });

            // 自动恢复上下文
            video.addEventListener('play', () => ctx.resume());
            video.addEventListener('volumechange', () => {
                if (!state.mirror.isMaster) video.muted = true;
            });
        } catch (error) {
            console.error('音频初始化失败:', error);
        }
    }

    // 更新音频路由
    function updateAudioRouting(splitter, merger) {
        splitter.disconnect();
        if (state.currentMode.id === CONFIG.MODES.SWAPPED.id) {
            splitter.connect(merger, 0, 1);
            splitter.connect(merger, 1, 0);
        } else {
            splitter.connect(merger, 0, 0);
            splitter.connect(merger, 1, 1);
        }
    }

    // 应用音频设置
    function applyAudioSettings() {
        document.querySelectorAll('video').forEach(video => {
            const nodes = audioNodes.get(video);
            if (nodes) updateAudioRouting(nodes.splitter, nodes.merger);
        });
    }

    // 更新UI状态
    function updateUIState() {
        document.querySelectorAll('.mode-btn').forEach(btn => {
            const isActive = parseInt(btn.dataset.mode) === state.currentMode.id;
            btn.classList.toggle('active', isActive);
        });

        const mirrorBtn = document.querySelector('.mirror-control');
        if (mirrorBtn) {
            mirrorBtn.textContent = state.mirror.window ? "关闭镜像" : "启动镜像窗口";
        }
    }

    // 注册菜单命令
    function registerMenuCommands() {
        GM_registerMenuCommand('⚙️ 打开/关闭控制台', () => {
            const panel = document.querySelector('.bpx-audio-pro-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 清理资源
    window.addEventListener('beforeunload', () => {
        clearInterval(state.autoSwitch.timer);
        clearInterval(state.mirror.syncTimer);
        GM_setValue('syncPacket', null);
        if (state.mirror.window) state.mirror.window.close();
    });

    // 启动系统
    if (document.readyState === 'complete') {
        initCoreSystem();
    } else {
        window.addEventListener('load', initCoreSystem);
    }
})();

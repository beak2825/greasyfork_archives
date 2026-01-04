// ==UserScript==
// @name         轻量级画中画扩展
// @version      2.0.3
// @description  轻量级全局顶置画中画功能，支持大多数视频网站和直播平台
// @author       嘉友友
// @match        *://*/*
// @license      GPL-3.0
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE5IDdINVYxN0gxM1YxNUg3VjlIMTdWMTFIMTlWN1oiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTE1IDEzVjE3SDE5VjEzSDE1WiIgZmlsbD0iIzAwMDAwMCIvPgo8L3N2Zz4K
// @namespace https://greasyfork.org/users/1336389
// @downloadURL https://update.greasyfork.org/scripts/550738/%E8%BD%BB%E9%87%8F%E7%BA%A7%E7%94%BB%E4%B8%AD%E7%94%BB%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/550738/%E8%BD%BB%E9%87%8F%E7%BA%A7%E7%94%BB%E4%B8%AD%E7%94%BB%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 模块1：配置与状态
    // ==========================================
    const CONFIG = {
        STORAGE_KEY: 'pip_button_global_position',
        DEFAULT_POSITION: { right: -30, top: 100, side: 'right' }, // 默认吸附在右侧
        HIDE_DELAY: 2000,
        MIN_VIDEO_SIZE: 50
    };

    const State = {
        floatingButton: null,
        styleElement: null,
        isDragging: false,
        isVisible: false, // 按钮是否处于"弹出"状态
        hideTimeout: null,
        hasRemoteVideo: false,
        currentNotification: null
    };

    // ==========================================
    // 模块2：跨窗口通信桥 (核心)
    // ==========================================
    const MessageBridge = {
        init() {
            window.addEventListener('message', (event) => {
                const data = event.data;
                if (!data || !data.type || !data.type.startsWith('GM_PIP_')) return;

                if (window === window.top) {
                    // 主窗口：接收子窗口的视频状态
                    if (data.type === 'GM_PIP_FOUND_VIDEO') {
                        State.hasRemoteVideo = true;
                        UIController.init();
                    } else if (data.type === 'GM_PIP_LOST_VIDEO') {
                        State.hasRemoteVideo = false;
                        setTimeout(() => {
                            if (!State.hasRemoteVideo && !VideoDetector.hasLocalVideo()) {
                                UIController.destroy();
                            }
                        }, 500);
                    }
                } else {
                    // 子窗口：接收主窗口的切换命令
                    if (data.type === 'GM_PIP_DO_TOGGLE') {
                        const video = VideoDetector.getCurrentVideo();
                        if (video) PipController.toggle(video);
                    }
                }
            });
        },
        reportVideoStatus(found) {
            if (window.top !== window) {
                window.top.postMessage({ type: found ? 'GM_PIP_FOUND_VIDEO' : 'GM_PIP_LOST_VIDEO' }, '*');
            }
        },
        broadcastToggle() {
            // 优先本地
            const localVideo = VideoDetector.getCurrentVideo();
            if (localVideo) {
                PipController.toggle(localVideo);
                return;
            }
            // 广播给 Iframe
            document.querySelectorAll('iframe').forEach(iframe => {
                iframe.contentWindow.postMessage({ type: 'GM_PIP_DO_TOGGLE' }, '*');
            });
        }
    };

    // ==========================================
    // 模块3：UI 控制器 (恢复动画逻辑)
    // ==========================================
    const UIController = {
        init() {
            if (window !== window.top) return;
            if (State.floatingButton) return;

            this.injectStyles();
            State.floatingButton = this.createButton();
            document.body.appendChild(State.floatingButton);

            // 初始化位置
            this.applyStoredPosition();
        },

        destroy() {
            if (State.floatingButton) {
                State.floatingButton.remove();
                State.floatingButton = null;
            }
            if (State.styleElement) {
                State.styleElement.remove();
                State.styleElement = null;
            }
        },

        injectStyles() {
            if (State.styleElement) return;
            State.styleElement = document.createElement('style');
            State.styleElement.textContent = `
                #floating-pip-button {
                    position: fixed;
                    z-index: 2147483647;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 46px;
                    height: 46px;
                    font-size: 20px;
                    cursor: move;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    user-select: none;
                    backdrop-filter: blur(4px);
                    transition: opacity 0.3s ease, transform 0.3s ease, right 0.3s ease, left 0.3s ease;
                    opacity: 0.6;
                    transform: scale(0.8);
                    font-family: system-ui, -apple-system, sans-serif;
                }
                #floating-pip-button:hover {
                    opacity: 1;
                    transform: scale(1);
                }
                #pip-msg {
                    animation: pipSlideDown 0.3s ease;
                }
                @keyframes pipSlideDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `;
            document.head.appendChild(State.styleElement);
        },

        createButton() {
            const btn = document.createElement('button');
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/></svg>';
            btn.title = '画中画 (Ctrl/Alt + P)\n右键重置位置';
            btn.id = 'floating-pip-button';

            // 事件绑定
            btn.addEventListener('mouseenter', () => this.show());
            btn.addEventListener('mouseleave', () => this.scheduleHide());

            btn.addEventListener('click', (e) => {
                if (!State.isDragging) MessageBridge.broadcastToggle();
            });

            btn.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                PositionManager.reset();
                this.applyStoredPosition();
                NotificationManager.show('位置已重置');
            });

            this.setupDrag(btn);
            return btn;
        },

        // 弹出按钮（完全显示）
        show() {
            if (!State.floatingButton || State.isVisible) return;
            clearTimeout(State.hideTimeout);

            const btn = State.floatingButton;
            const pos = PositionManager.load();

            // 弹出时，稍微离开边缘一点点，方便点击
            if (pos.side === 'right') {
                btn.style.right = '10px';
                btn.style.left = 'auto';
            } else {
                btn.style.left = '10px';
                btn.style.right = 'auto';
            }

            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
            State.isVisible = true;
        },

        // 缩回边缘（吸附隐藏）
        hide() {
            if (!State.floatingButton || State.isDragging) return;

            const btn = State.floatingButton;
            const pos = PositionManager.load(); // 加载保存的"吸附"位置

            // 应用吸附位置 (例如 right: -30px)
            if (pos.side === 'right') {
                btn.style.right = (pos.right || -30) + 'px';
                btn.style.left = 'auto';
            } else {
                btn.style.left = (pos.left || -30) + 'px';
                btn.style.right = 'auto';
            }

            btn.style.opacity = '0.6';
            btn.style.transform = 'scale(0.8)';
            State.isVisible = false;
        },

        scheduleHide() {
            clearTimeout(State.hideTimeout);
            State.hideTimeout = setTimeout(() => this.hide(), CONFIG.HIDE_DELAY);
        },

        applyStoredPosition() {
            const pos = PositionManager.load();
            const btn = State.floatingButton;
            btn.style.top = pos.top + 'px';

            // 初始状态直接应用吸附效果
            if (pos.side === 'right') {
                btn.style.right = (pos.right || -30) + 'px';
                btn.style.left = 'auto';
            } else {
                btn.style.left = (pos.left || -30) + 'px';
                btn.style.right = 'auto';
            }

            // 初始也调用一次 hide 确保样式正确
            this.hide();
        },

        setupDrag(btn) {
            let startX, startY, initialLeft, initialTop;

            const move = (e) => {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                    State.isDragging = true;
                    btn.style.transition = 'none'; // 拖拽时移除过渡，防止迟滞
                    btn.style.opacity = '1';
                    btn.style.transform = 'scale(1)';
                }

                if (State.isDragging) {
                    btn.style.left = (initialLeft + dx) + 'px';
                    btn.style.top = (initialTop + dy) + 'px';
                    btn.style.right = 'auto';
                }
            };

            const stop = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', stop);

                if (State.isDragging) {
                    State.isDragging = false;
                    btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease, right 0.3s ease, left 0.3s ease';
                    this.snapToEdge(btn); // 拖拽结束，计算吸附
                }
            };

            btn.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                startX = e.clientX;
                startY = e.clientY;
                const rect = btn.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', stop);
                e.preventDefault();
            });
        },

        // 计算吸附位置并保存
        snapToEdge(btn) {
            const rect = btn.getBoundingClientRect();
            const winWidth = window.innerWidth;
            const isRight = (rect.left + rect.width/2) > winWidth/2;

            // 限制纵向边界
            const newTop = Math.max(10, Math.min(rect.top, window.innerHeight - 60));

            const pos = {
                top: newTop,
                side: isRight ? 'right' : 'left'
            };

            // 设置吸附参数 (缩进屏幕 30px)
            if (isRight) {
                pos.right = -30;
                btn.style.right = '-30px';
                btn.style.left = 'auto';
            } else {
                pos.left = -30;
                btn.style.left = '-30px';
                btn.style.right = 'auto';
            }
            btn.style.top = newTop + 'px';

            // 保存位置
            PositionManager.save(pos);

            // 更新状态
            State.isVisible = false;
            btn.style.opacity = '0.6';
            btn.style.transform = 'scale(0.8)';
        }
    };

    // ==========================================
    // 模块4：位置存储
    // ==========================================
    const PositionManager = {
        save(pos) {
            try {
                const data = JSON.stringify(pos);
                if (typeof GM_setValue !== 'undefined') GM_setValue(CONFIG.STORAGE_KEY, data);
                else localStorage.setItem(CONFIG.STORAGE_KEY, data);
            } catch(e){}
        },
        load() {
            try {
                let s = typeof GM_getValue !== 'undefined' ? GM_getValue(CONFIG.STORAGE_KEY) : localStorage.getItem(CONFIG.STORAGE_KEY);
                if (s) return JSON.parse(s);
            } catch(e){}
            return CONFIG.DEFAULT_POSITION;
        },
        reset() {
            try {
                if (typeof GM_deleteValue !== 'undefined') GM_deleteValue(CONFIG.STORAGE_KEY);
                else localStorage.removeItem(CONFIG.STORAGE_KEY);
            } catch(e){}
        }
    };

    // ==========================================
    // 模块5：视频检测与 Iframe 修复
    // ==========================================
    const IframeManager = {
        init() {
            if (window !== window.top) return;
            this.fixExistingIframes();
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'IFRAME') this.fixSingleIframe(node);
                    });
                });
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        },
        fixExistingIframes() {
            document.querySelectorAll('iframe').forEach(iframe => this.fixSingleIframe(iframe));
        },
        fixSingleIframe(iframe) {
            try {
                const allow = iframe.getAttribute('allow') || '';
                if (allow.includes('picture-in-picture')) return;
                const newIframe = iframe.cloneNode();
                newIframe.setAttribute('allow', (allow ? allow + '; ' : '') + 'picture-in-picture');
                if (iframe.parentNode) iframe.parentNode.replaceChild(newIframe, iframe);
            } catch (e) {}
        }
    };

    const ShadowDomUtils = {
        getAllVideos(root = document) {
            let videos = [];
            videos.push(...Array.from(root.querySelectorAll('video')));
            const allElements = root.querySelectorAll('*');
            for (let i = 0; i < allElements.length; i++) {
                if (allElements[i].shadowRoot) {
                    videos.push(...this.getAllVideos(allElements[i].shadowRoot));
                }
            }
            return videos;
        }
    };

    const VideoDetector = {
        _cachedVideos: [],
        _lastCheck: 0,
        hasLocalVideo() { return this.getAllVideos().length > 0; },
        getAllVideos() {
            const now = performance.now();
            if (now - this._lastCheck < 1000 && this._cachedVideos.length > 0) return this._cachedVideos;
            const all = ShadowDomUtils.getAllVideos(document);
            this._cachedVideos = all.filter(v => {
                if (!v.isConnected) return false;
                const rect = v.getBoundingClientRect();
                return rect.width >= CONFIG.MIN_VIDEO_SIZE || rect.height >= CONFIG.MIN_VIDEO_SIZE;
            });
            this._lastCheck = now;
            return this._cachedVideos;
        },
        getCurrentVideo() {
            const videos = this.getAllVideos();
            if (videos.length === 0) return null;
            for (const v of videos) {
                if (!v.paused && !v.ended && v.readyState > 2) return v;
            }
            return videos[0];
        }
    };

    const PipController = {
        async toggle(video) {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    if (video.disablePictureInPicture) video.disablePictureInPicture = false;
                    await video.requestPictureInPicture();
                }
            } catch (err) {
                NotificationManager.show('画中画失败: ' + err.message);
            }
        }
    };

    const NotificationManager = {
        show(msg) {
            if (window !== window.top) return;
            let box = document.getElementById('pip-msg');
            if (!box) {
                box = document.createElement('div');
                box.id = 'pip-msg';
                Object.assign(box.style, {
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '8px 16px',
                    borderRadius: '4px', zIndex: '2147483647', fontSize: '14px', pointerEvents: 'none', transition: 'opacity 0.3s'
                });
                document.body.appendChild(box);
            }
            box.textContent = msg;
            box.style.opacity = '1';
            clearTimeout(State.currentNotification);
            State.currentNotification = setTimeout(() => box.style.opacity = '0', 3000);
        }
    };

    // ==========================================
    // 启动
    // ==========================================
    const start = () => {
        MessageBridge.init();
        IframeManager.init();

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'p' && (e.ctrlKey || e.altKey)) {
                e.preventDefault();
                MessageBridge.broadcastToggle();
            }
        });

        const checkLoop = () => {
            const hasLocal = VideoDetector.hasLocalVideo();
            if (window === window.top) {
                if (hasLocal || State.hasRemoteVideo) UIController.init();
                else UIController.destroy();
            } else {
                MessageBridge.reportVideoStatus(hasLocal);
            }
        };

        setInterval(checkLoop, 1500);
        checkLoop();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

})();

// ==UserScript==
// @name         夸克网盘音频播放器
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  在文件列表特定单元格添加播放按钮，支持格式过滤与精准定位
// @author       xkloveme
// @match        https://pan.quark.cn/*
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561332/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561332/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 安全获取全局 store 对象
    const getStore = () => {
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.store) {
            return unsafeWindow.store;
        }
        if (typeof window !== 'undefined' && window.store) {
            return window.store;
        }
        return null;
    };

    // 支持的音频格式列表
    const AUDIO_EXT_REGEX = /\.(mp3|wav|ogg|m4a|aac|flac|weba|mp4)$/i;

    // 注入 CSS 样式
    function injectStyles() {
        const styleId = 'quark-audio-player-style';
        if (document.getElementById(styleId)) return;

        const css = `
            @keyframes slideInUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes soundBars {
                0% { height: 4px; }
                50% { height: 16px; }
                100% { height: 4px; }
            }

            .quark-player-container {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 380px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(12px);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.6);
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                animation: slideInUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                transition: all 0.3s ease;
            }

            .quark-player-container:hover {
                box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
                transform: translateY(-2px);
            }

            .quark-player-header {
                display: flex;
                align-items: center;
                gap: 16px;
                position: relative;
            }

            .quark-player-cover {
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #1677ff, #69b1ff);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
                flex-shrink: 0;
            }

            .quark-player-info {
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .quark-player-title {
                font-size: 15px;
                font-weight: 600;
                color: #1f1f1f;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .quark-player-status {
                font-size: 12px;
                color: #8c8c8c;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .quark-visualizer {
                display: flex;
                align-items: center;
                gap: 3px;
                height: 16px;
            }

            .quark-bar {
                width: 3px;
                background: #1677ff;
                border-radius: 2px;
                animation: soundBars 0s infinite ease-in-out;
            }

            .quark-player-container.playing .quark-bar {
                animation-duration: 0.8s;
            }

            .quark-player-container.playing .quark-bar:nth-child(1) { animation-delay: 0.0s; }
            .quark-player-container.playing .quark-bar:nth-child(2) { animation-delay: 0.2s; }
            .quark-player-container.playing .quark-bar:nth-child(3) { animation-delay: 0.4s; }
            .quark-player-container.playing .quark-bar:nth-child(4) { animation-delay: 0.1s; }

            .quark-player-close {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                background: #f0f0f0;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #999;
                font-size: 14px;
                transition: all 0.2s;
                opacity: 0;
                transform: scale(0.8);
            }

            .quark-player-container:hover .quark-player-close {
                opacity: 1;
                transform: scale(1);
            }

            .quark-player-close:hover {
                background: #ff4d4f;
                color: white;
            }

            .quark-player-audio {
                width: 100%;
                height: 36px;
                border-radius: 8px;
                outline: none;
            }

            /* 适配 Webkit 浏览器原生 Audio 控件 */
            .quark-player-audio::-webkit-media-controls-panel {
                background: #f5f5f5;
            }

            .quark-player-audio::-webkit-media-controls-enclosure {
                border-radius: 8px;
            }
        `;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = css;
        document.head.appendChild(style);
    }

    // 创建播放器弹窗 UI
    function createAudioPlayer(url, fileName, onEnded) {
        injectStyles(); // 确保样式已注入

        const oldPlayer = document.getElementById('quark-custom-audio-player');
        if (oldPlayer) oldPlayer.remove();

        const container = document.createElement('div');
        container.id = 'quark-custom-audio-player';
        container.className = 'quark-player-container playing'; // 默认 playing 状态，因为 autoplay

        // HTML 结构
        container.innerHTML = `
            <div class="quark-player-close">×</div>
            <div class="quark-player-header">
                <div class="quark-player-cover">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                </div>
                <div class="quark-player-info">
                    <div class="quark-player-title" title="${fileName}">${fileName}</div>
                    <div class="quark-player-status">
                        <div class="quark-visualizer">
                            <div class="quark-bar"></div>
                            <div class="quark-bar"></div>
                            <div class="quark-bar"></div>
                            <div class="quark-bar"></div>
                        </div>
                        <span class="status-text">正在播放</span>
                    </div>
                </div>
            </div>
        `;

        const audio = document.createElement('audio');
        audio.className = 'quark-player-audio';
        audio.controls = true;
        audio.autoplay = true;
        audio.src = url;

        // 绑定事件
        const updateStatus = (isPlaying) => {
            const statusText = container.querySelector('.status-text');
            if (isPlaying) {
                container.classList.add('playing');
                statusText.innerText = '正在播放';
            } else {
                container.classList.remove('playing');
                statusText.innerText = '已暂停';
            }
        };

        audio.onplay = () => updateStatus(true);
        audio.onpause = () => updateStatus(false);

        if (onEnded) {
            audio.onended = () => {
                updateStatus(false);
                onEnded();
            };
        }

        audio.onerror = () => {
            container.classList.remove('playing');
            const statusText = container.querySelector('.status-text');
            statusText.innerText = '播放失败';
            statusText.style.color = '#ff4d4f';
        };

        const closeBtn = container.querySelector('.quark-player-close');
        closeBtn.onclick = () => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            setTimeout(() => container.remove(), 300);
        };

        container.appendChild(audio);
        document.body.appendChild(container);
    }

    // 核心功能：获取链接并播放
    async function handlePlay(fid, fileName, btnElement) {
        const store = getStore();

        if (!store) {
            alert('无法获取夸克网盘接口 (window.store)，请刷新页面后重试。');
            return;
        }

        const originalText = btnElement.innerText;

        // 自动播放下一首
        const playNext = () => {
            const currentRow = btnElement.closest('.ant-table-row');
            if (!currentRow) return;

            let nextRow = currentRow.nextElementSibling;
            while (nextRow) {
                const nextBtn = nextRow.querySelector('.quark-audio-play-btn');
                if (nextBtn) {
                    // 模拟点击触发下一首播放
                    nextBtn.click();
                    return;
                }
                nextRow = nextRow.nextElementSibling;
            }
        };

        try {
            btnElement.innerText = '⌛';
            btnElement.style.opacity = '0.7';

            const result = await store.dispatch.file.fetchDownloadFileInfo({
                fileInfos: [{ fid: fid }]
            });

            btnElement.innerText = originalText;
            btnElement.style.opacity = '1';

            if (result && result.fileInfos && result.fileInfos.length > 0) {
                const fileInfo = result.fileInfos[0];
                if (fileInfo.download_url) {
                    createAudioPlayer(fileInfo.download_url, fileName, playNext);
                } else {
                    alert('未找到下载链接，文件可能已被删除或没有权限。');
                }
            }
        } catch (error) {
            console.error('获取播放链接失败:', error);
            btnElement.innerText = '❌';
            setTimeout(() => { btnElement.innerText = originalText; }, 2000);
        }
    }

    // 向表格行添加按钮
    function addPlayButtons() {
        const rows = document.querySelectorAll('.ant-table-row.ant-table-row-level-0.ant-dropdown-trigger');

        rows.forEach(row => {
            if (row.dataset.hasPlayBtn === 'true') return;

            // 1. 校验是否为音频文件（使用你指定的 class 结构）
            const nameElement = row.querySelector('.filename-text.editable-cell');
            if (!nameElement) return;

            const fileName = nameElement.getAttribute('title');
            if (!fileName) return;

            // 如果不是音频，标记已处理并跳过
            if (!AUDIO_EXT_REGEX.test(fileName)) {
                row.dataset.hasPlayBtn = 'true';
                return;
            }

            const fid = row.getAttribute('data-row-key');
            if (!fid) return;

            // 2. 【关键修改】查找目标 td 单元格
            const targetTd = row.querySelector('td.td-file.td-file-sort');

            // 如果找不到目标单元格（防御性编程），则不操作
            if (!targetTd) return;

            // 3. 创建按钮
            const btn = document.createElement('button');
            btn.className = 'quark-audio-play-btn';
            btn.innerText = '▶';
            btn.title = `播放 ${fileName}`;
            // 样式优化：定位到 td 内部右侧
            btn.style.cssText = `
                position: absolute;
                right: 180px; /* 预留位置给官方的悬浮操作按钮 */
                top: 50%;
                transform: translateY(-50%);
                padding: 4px 10px;
                background: #1677ff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                z-index: 100; /* 确保在图层上方 */
                line-height: 1.5;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.2s;
            `;

            btn.onclick = (e) => {
                e.stopPropagation();
                handlePlay(fid, fileName, btn);
            };

            btn.onmouseenter = () => { btn.style.background = '#4096ff'; btn.style.transform = 'translateY(-50%) scale(1.1)'; };
            btn.onmouseleave = () => { btn.style.background = '#1677ff'; btn.style.transform = 'translateY(-50%) scale(1)'; };

            // 4. 确保 td 具有定位属性，以便按钮绝对定位
            // 获取计算样式，避免覆盖已有的 relative/absolute
            const tdStyle = window.getComputedStyle(targetTd);
            if (tdStyle.position === 'static') {
                targetTd.style.position = 'relative';
            }

            // 5. 插入到 td 中
            targetTd.appendChild(btn);

            // 标记完成
            row.dataset.hasPlayBtn = 'true';
        });
    }

    // 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
        addPlayButtons();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(addPlayButtons, 1000);

})();
// ==UserScript==
// @name         夸克网盘播放音频
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  在文件列表特定单元格添加播放按钮，支持格式过滤与精准定位
// @author       Gemini 3 Pro
// @match        https://pan.quark.cn/*
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556478/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%92%AD%E6%94%BE%E9%9F%B3%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/556478/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E6%92%AD%E6%94%BE%E9%9F%B3%E9%A2%91.meta.js
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

    // 创建播放器弹窗 UI
    function createAudioPlayer(url, fileName) {
        const oldPlayer = document.getElementById('quark-custom-audio-player');
        if (oldPlayer) oldPlayer.remove();

        const container = document.createElement('div');
        container.id = 'quark-custom-audio-player';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            min-width: 320px;
            border: 1px solid #eee;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        `;

        const title = document.createElement('div');
        title.innerText = `正在播放: ${fileName}`;
        title.style.cssText = 'font-size: 14px; font-weight: 600; color: #333; word-break: break-all; padding-right: 20px;';

        const audio = document.createElement('audio');
        audio.controls = true;
        audio.autoplay = true;
        audio.src = url;
        audio.style.width = '100%';
        
        audio.onerror = () => {
            title.innerText = `播放失败: 格式不支持或链接过期 (${fileName})`;
            title.style.color = '#ff4d4f';
        };

        const closeBtn = document.createElement('div');
        closeBtn.innerText = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 20px;
            color: #999;
            line-height: 1;
        `;
        closeBtn.onclick = () => container.remove();
        closeBtn.onmouseenter = () => closeBtn.style.color = '#333';
        closeBtn.onmouseleave = () => closeBtn.style.color = '#999';

        container.appendChild(closeBtn);
        container.appendChild(title);
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
                    createAudioPlayer(fileInfo.download_url, fileName);
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
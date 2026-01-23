// ==UserScript==
// @name         B站AI字幕笔记助手 (Bilibili AI Subtitle Note Assistant)
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  实时记录B站视频AI字幕，自动合并断句，支持历史记录回溯等，辅助高效制作视频笔记。
// @author       Lepturus
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563599/B%E7%AB%99AI%E5%AD%97%E5%B9%95%E7%AC%94%E8%AE%B0%E5%8A%A9%E6%89%8B%20%28Bilibili%20AI%20Subtitle%20Note%20Assistant%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563599/B%E7%AB%99AI%E5%AD%97%E5%B9%95%E7%AC%94%E8%AE%B0%E5%8A%A9%E6%89%8B%20%28Bilibili%20AI%20Subtitle%20Note%20Assistant%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        :root {
          --primary-color: #00a1d6; /* B站蓝 */
          --text-color: #333;
          --bg-color: rgba(255, 255, 255, 0.9);
          --border-radius: 6px;
          --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .copyTEXT, .custom-backup-element {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-color);
          transition: all 0.2s ease;
        }
        
        .copyTEXT:hover {
          background-color: rgba(0, 161, 214, 0.05);
          border-radius: 4px;
        }
        
        .search-link-container a {
          display: inline-block;
          margin: 2px 5px 2px 0;
          padding: 4px 8px;
          background: var(--bg-color);
          border: 1px solid #e0e0e0;
          border-radius: var(--border-radius);
          text-decoration: none;
          color: #666;
          font-size: 12px;
          transition: all 0.2s ease;
        }
        
        .search-link-container a:hover {
          background: #f5f5f5;
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-1px);
          box-shadow: var(--shadow);
        }
        
        .copyTEXT[data-copied="true"] {
          background-color: #e8f5e9 !important;
          color: #2e7d32 !important;
          transform: scale(1.02);
        }
        #download-subs-btn, .bili-history-btn  {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 4px 12px;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: background-color 0.2s ease, transform 0.2s ease;
          }
  
          #download-subs-btn:hover, .bili-history-btn:hover {
            background-color: #007bb5; /* A slightly darker blue */
            transform: translateY(-1px);
          }
          
          .bili-history-modal {
              position: fixed;
              right: 20px; /* Initial position */
              top: 20%;
              width: 320px;
              height: 60vh;
              background: rgba(255, 255, 255, 0.98);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
              border-radius: 8px;
              z-index: 100000;
              display: none;
              flex-direction: column;
              border: 1px solid #eee;
              font-family: sans-serif;
              /* 设置变换原点为左上角，确保缩放时位置计算可控 */
              transform-origin: 0 0; 
              will-change: transform, left, top;
          }
          .bili-history-header {
              padding: 12px;
              border-bottom: 1px solid #eee;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #fafafa;
              border-radius: 8px 8px 0 0;
              font-weight: bold;
              color: #333;
          }
          .bili-history-body {
              flex: 1;
              overflow-y: auto;
              padding: 10px;
              scroll-behavior: smooth;
          }
          .bili-history-item {
              margin-bottom: 10px;
              display: flex;
              gap: 8px;
              padding: 4px;
              border-radius: 4px;
          }
          .bili-history-item:hover {
              background: #f5f5f5;
          }
          .bili-history-time {
              color: var(--primary-color);
              cursor: pointer;
              font-family: monospace;
              font-size: 12px;
              flex-shrink: 0;
              margin-top: 2px;
          }
          .bili-history-time:hover {
              text-decoration: underline;
          }
          .bili-history-content {
              display: flex;
              flex-direction: column;
              font-size: 13px;
              line-height: 1.4;
              word-break: break-word;
          }
          .bili-history-trans {
              color: #888;
              font-size: 12px;
              margin-top: 2px;
          }
          .bili-footer-btn {
              font-size: 11px;
              padding: 4px 8px;
              cursor: pointer;
              background: #f0f0f0;
              border: none;
              border-radius: 4px;
              color: #666;
          }
          .bili-footer-btn:hover {
              background: #e0e0e0;
              color: #333;
          }
          .bili-search-container {
              position: relative;
              display: inline-block;
              margin-right: 12px;
              vertical-align: middle;
              padding-bottom: 10px; 
              margin-bottom: -10px;
               
          }
          .bili-search-menu {
              display: none;
              position: absolute;
              top: 100%;
              left: 0;
              background: #fff;
              border: 1px solid #e3e5e7;
              border-radius: 4px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              z-index: 1000;
              min-width: 100px;
              padding: 4px 0;
              margin-top: 0;
          }
         .bili-search-menu::before {
              content: '';
              position: absolute;
              top: -10px;
              left: 0;
              width: 100%;
              height: 10px;
          }
          .bili-search-container:hover .bili-search-menu {
              display: block;
          }
          .bili-search-item {
              display: block;
              padding: 6px 12px;
              color: #333;
              text-decoration: none;
              font-size: 12px;
              transition: all 0.2s;
              white-space: nowrap;
          }
          .bili-search-item:hover {
              background-color: #f1f2f3;
              color: var(--primary-color);
          }
           .bili-hide-time .bili-history-time {
              display: none !important;
          }
          .bili-sub-visual-hidden {
              opacity: 0 !important;
              visibility: hidden !important;
              pointer-events: none !important;
          }
          .bili-resize-handle {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 15px;
              height: 15px;
              cursor: nwse-resize; /* 鼠标样式：斜向调整 */
              z-index: 10;
              background: linear-gradient(135deg, transparent 50%, var(--primary-color) 50%); /* 三角形外观 */
              border-bottom-right-radius: 8px; /* 贴合圆角 */
              opacity: 0.6;
              transition: opacity 0.2s;
          }
          .bili-resize-handle:hover {
              opacity: 1;
          }
          .bili-sub-visual-hidden {
              opacity: 0 !important;
              visibility: hidden !important;
              pointer-events: none !important; /* 让鼠标穿透，不挡操作 */
          }
          .bili-history-footer {
              padding: 10px;
              border-top: 1px solid #eee;
              display: flex;
              justify-content: space-between; /* space-between might not be enough for 5 buttons, switching to gap */
              gap: 5px;
              flex-wrap: wrap;
              background: #fff;
              border-radius: 0 0 8px 8px;
          }
          `);

    function copy(e, isHTML = true) {
        let obj = document.createElement('textarea');
        document.body.appendChild(obj);
        obj.value = isHTML ? e.innerText : e.innerHTML;
        obj.select();
        document.execCommand('copy', false);
        obj.remove();
    }

    function formatTime(seconds) {
        let m = Math.floor(seconds / 60);
        let s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function downloadSubtitles() {
        const videoTitleElement = document.querySelector('h1.video-title');
        const fileName = videoTitleElement
            ? videoTitleElement.textContent.trim().replace(/[\\/:*?"<>|]/g, '_') + '_字幕.txt'
            : 'Bilibili_Subtitles.txt';
        let allSubtitlesText = [];

        const aiSubtitles = document.querySelectorAll('[class*="_Text_"]');
        aiSubtitles.forEach(sub => allSubtitlesText.push(sub.innerText));

        const liveSubtitles = document.querySelectorAll('[class*="bili-subtitle-x-subtitle-panel-text"]');
        liveSubtitles.forEach(sub => allSubtitlesText.push(sub.innerText));

        if (allSubtitlesText.length === 0) {
            alert('未找到可下载的字幕内容。请确保字幕已加载。');
            return;
        }
        const fullText = allSubtitlesText.join('\n');
        const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Global storage for Bilibili History
    window.biliSubtitleHistory = window.biliSubtitleHistory || [];
    window.biliObserverInit = false;
    window.biliSubObserver = null;
    window.biliAutoScroll = true;
    function Bilibili() {
        let b_title = document.querySelector('h1');
        let b_infos = document.querySelector('.tag-panel');
        let b_up = document.querySelector('.up-detail-top');

        // 1. Download Button Logic (Keep in Subtitle Tips area)
        const tipsElements = document.querySelector('[class*="_Tips_"]');
        if (tipsElements && !document.getElementById('download-subs-btn')) {
            const parentContainer = tipsElements;
            const downloadBtn = document.createElement('button');
            downloadBtn.id = 'download-subs-btn';
            downloadBtn.textContent = '下载全部字幕';
            downloadBtn.title = '将当前所有已加载的字幕下载为 .txt 文件';
            downloadBtn.addEventListener('click', downloadSubtitles);
            parentContainer.appendChild(downloadBtn);
        }

        // 2. History Button Logic (Move to Left of AI Assistant)
        // Try to find the AI Assistant element
        const aiAssistantSpan = document.querySelector('.video-ai-assistant-info');

        // Only proceed if AI element exists and button hasn't been added yet
        if (aiAssistantSpan && !document.getElementById('bili-history-btn')) {
            // Find the proper container (toolbar item) to insert before
            // Bilibili toolbar items usually have class like 'video-toolbar-item' or 'video-toolbar-left-item'
            const aiContainer = aiAssistantSpan.closest('.video-toolbar-item, .video-toolbar-left-item, .video-toolbar-right-item') || aiAssistantSpan.parentElement;

            if (aiContainer) {
                const searchContainer = document.createElement('div');
                searchContainer.className = 'bili-search-container';
                searchContainer.id = 'bili-search-container'; // Prevent duplicates
                // Search Trigger Button (Style matches history button)
                const searchBtn = document.createElement('button');
                searchBtn.textContent = '🔍 一键搜索';
                searchBtn.style.cssText = `
               background-color: transparent;
               color: var(--text-color);
               border: 1px solid #e3e5e7;
               padding: 4px 10px;
               border-radius: 4px;
               cursor: pointer;
               font-size: 13px;
               height: 30px;
               line-height: 20px;
               transition: all 0.2s;
               width: 100%;
               text-align: left;
           `;
                // Hover effects handled by CSS on container, but JS specific for btn
                searchBtn.onmouseover = function () { this.style.color = 'var(--primary-color)'; this.style.borderColor = 'var(--primary-color)'; };
                searchBtn.onmouseout = function () { this.style.color = 'var(--text-color)'; this.style.borderColor = '#e3e5e7'; };
                // Search Menu
                const searchMenu = document.createElement('div');
                searchMenu.className = 'bili-search-menu';

                // Engine Configuration (Clean & Extensible)
                const engines = [
                    { name: "百度搜索", url: "https://www.baidu.com/s?wd=" },
                    { name: "谷歌搜索", url: "https://www.google.com/search?q=" },
                    { name: "必应搜索", url: "https://www.bing.com/search?q=" },
                    { name: "YouTube", url: "https://www.youtube.com/results?search_query=" }
                ];

                engines.forEach(eng => {
                    const link = document.createElement('a');
                    link.className = 'bili-search-item';
                    link.textContent = eng.name;
                    link.target = '_blank';
                    link.setAttribute('data-base-url', eng.url);
                    link.href = 'javascript:void(0);';
                    searchMenu.appendChild(link);
                });
                searchContainer.appendChild(searchBtn);
                searchContainer.appendChild(searchMenu);
                searchContainer.addEventListener('mouseenter', () => {
                    const title = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : "";
                    const links = searchMenu.querySelectorAll('.bili-search-item');
                    links.forEach(link => {
                        const baseUrl = link.getAttribute('data-base-url');
                        if (baseUrl && title) {
                            link.href = baseUrl + encodeURIComponent(title);
                            link.onclick = null;
                        } else {
                            link.href = 'javascript:void(0);';
                            link.onclick = () => alert("未找到视频标题");
                        }
                    });
                });
                const historyBtn = document.createElement('button');
                historyBtn.id = 'bili-history-btn';
                historyBtn.className = 'bili-history-btn';
                historyBtn.textContent = '📜 记录AI字幕';
                historyBtn.title = '实时记录并查看已播放的AI字幕历史';
                // Adjust style to fit toolbar
                historyBtn.style.cssText = `
                background-color: transparent;
                color: var(--text-color);
                border: 1px solid #e3e5e7;
                padding: 4px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                margin-right: 12px;
                vertical-align: middle;
                display: inline-block;
                height: 30px;
                line-height: 20px;
                transition: all 0.2s;
            `;
                historyBtn.onmouseover = function () { this.style.color = 'var(--primary-color)'; this.style.borderColor = 'var(--primary-color)'; };
                historyBtn.onmouseout = function () { this.style.color = 'var(--text-color)'; this.style.borderColor = '#e3e5e7'; };

                // Create History Modal (Hidden by default)
                const modal = document.createElement('div');
                modal.className = 'bili-history-modal';
                // Modal CSS is defined in GM_addStyle
                modal.innerHTML = `
            <div class="bili-history-header" style="cursor: move; user-select: none;">
                <span>AI字幕记录</span>
                <span style="cursor:pointer;font-size:18px" onclick="this.parentElement.parentElement.style.display='none'">×</span>
            </div>
            <div class="bili-history-body" id="bili-history-list">
                <div style="text-align:center;color:#999;margin-top:20px;font-size:12px">
                    正在监听字幕流...<br>播放视频以开始记录
                </div>
            </div>
            <div class="bili-history-footer">
                <button class="bili-footer-btn" id="bili-hist-toggle-sub" title="切换B站播放器字幕开关">字幕</button>
                <button class="bili-footer-btn" id="bili-hist-toggle-time" title="显示/隐藏历史记录的时间轴">时间</button>
                <button class="bili-footer-btn" id="bili-hist-auto-scroll" title="字幕更新时自动滚动到底部" style="color:var(--primary-color)">滚动</button>
                <button class="bili-footer-btn" id="bili-hist-copy">复制</button>
                <button class="bili-footer-btn" id="bili-hist-copy-pure">纯净复制</button>
                <button class="bili-footer-btn" id="bili-hist-clear">清空</button>
            </div>
             <div class="bili-resize-handle" title="拖动缩放(等比例)"></div>
        `;
                document.body.appendChild(modal);

                // Button Click Event
                historyBtn.onclick = () => {
                    const isVisible = modal.style.display === 'flex';
                    modal.style.display = isVisible ? 'none' : 'flex';

                    // Reset position if off-screen (optional safety)
                    if (!isVisible) {
                        if (parseInt(modal.style.top) < 0) modal.style.top = '20px';
                        renderHistory();
                    }
                };

                // Insert before AI Assistant Container
                aiContainer.parentNode.insertBefore(searchContainer, aiContainer);
                aiContainer.parentNode.insertBefore(historyBtn, aiContainer);

                // Helper for Copy Feedback
                const handleCopyFeedback = (btn, text) => {
                    const originalText = btn.textContent;
                    copy({ innerText: text });
                    btn.textContent = "✓";
                    btn.style.color = "#2e7d32";
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.color = "";
                    }, 1500);
                };
                // Toggle Time Button Logic
                document.getElementById('bili-hist-toggle-time').onclick = function () {
                    const list = document.getElementById('bili-history-list');
                    list.classList.toggle('bili-hide-time');
                    this.style.color = list.classList.contains('bili-hide-time') ? 'var(--primary-color)' : '';
                };
                // Auto Scroll Logic (Smart Detection)
                const scrollBtn = document.getElementById('bili-hist-auto-scroll');
                const historyList = document.getElementById('bili-history-list');

                // 1. Button Click: Toggle State
                scrollBtn.onclick = function () {
                    window.biliAutoScroll = !window.biliAutoScroll;
                    if (window.biliAutoScroll) {
                        historyList.scrollTop = historyList.scrollHeight; // Immediately scroll to bottom
                        this.style.color = 'var(--primary-color)';
                    } else {
                        this.style.color = '';
                    }
                };

                // 2. User Scroll Detection
                historyList.onscroll = function () {
                    // Calculate if user is near the bottom (tolerance 20px)
                    const isBottom = this.scrollHeight - this.scrollTop - this.clientHeight < 20;

                    if (isBottom) {
                        // If user scrolls to bottom manually, re-enable auto scroll
                        if (!window.biliAutoScroll) {
                            window.biliAutoScroll = true;
                            scrollBtn.style.color = 'var(--primary-color)';
                        }
                    } else {
                        // If user scrolls up (away from bottom), disable auto scroll to allow reading
                        if (window.biliAutoScroll) {
                            window.biliAutoScroll = false;
                            scrollBtn.style.color = '';
                        }
                    }
                };

                // Toggle Subtitle Logic
                document.getElementById('bili-hist-toggle-sub').onclick = function () {
                    const subContainer = document.querySelector('.bili-subtitle-x-subtitle-panel-wrap');
                    const closeSub = document.querySelector('.bpx-player-ctrl-subtitle-close-switch');
                    const aiSub = document.querySelector('div[data-lan="ai-zh"]');
                    const btn = this;

                    // 1. 核心前提：必须要保证 B站原生字幕是【开启】状态
                    // 检查原生开关是否处于"关闭"状态 (通常有 bpx-state-active 类名表示关闭)
                    const isNativeClosed = closeSub && closeSub.classList.contains('bpx-state-active');
                    
                    if (isNativeClosed) {
                        // 如果原生是关的，先强制打开它，否则拿不到数据
                        if (aiSub) aiSub.click();
                        else if (closeSub) closeSub.click();
                        
                        // 稍微延迟一下，确保字幕元素加载出来后再隐藏
                        setTimeout(() => {
                           const wrapper = document.querySelector('.bili-subtitle-x-subtitle-panel-wrap');
                           if(wrapper) {
                               wrapper.classList.add('bili-sub-visual-hidden');
                               updateBtnState(true);
                           }
                        }, 200);
                        return; 
                    }

                    // 2. 如果原生已经是开的，则只切换"视觉隐藏"
                    if (subContainer) {
                        const isHidden = subContainer.classList.toggle('bili-sub-visual-hidden');
                        updateBtnState(isHidden);
                    } else {
                        // 可能是视频刚加载还没出字幕
                        alert("未检测到字幕流，请先确保视频正在播放且有AI字幕");
                    }

                    function updateBtnState(hidden) {
                        if (hidden) {
                            btn.textContent = "字幕(隐)";
                            btn.style.color = '#999';
                            btn.title = "当前：视觉隐藏（后台仍在记录笔记）";
                        } else {
                            btn.textContent = "字幕(显)";
                            btn.style.color = 'var(--primary-color)';
                            btn.title = "当前：正常显示";
                        }
                    }
                };
                // History Modal Actions
                document.getElementById('bili-hist-copy').onclick = function () {
                    const text = window.biliSubtitleHistory.map(i => `${i.timeStr} ${i.origin}${i.trans ? '\n' + i.trans : ''}`).join('\n\n');
                    handleCopyFeedback(this, text);
                };

                // Copy Pure Text (No Time)
                document.getElementById('bili-hist-copy-pure').onclick = function () {
                    const text = window.biliSubtitleHistory.map(i => `${i.origin}${i.trans ? '\n' + i.trans : ''}`).join('\n\n');
                    handleCopyFeedback(this, text);
                };
                document.getElementById('bili-hist-clear').onclick = function () {
                    window.biliSubtitleHistory = [];
                    renderHistory();

                    // 添加临时视觉反馈
                    const btn = this;
                    const originalText = btn.textContent;
                    btn.textContent = "✓ 已清空";
                    btn.style.color = "#2e7d32";
                    btn.style.borderColor = "#2e7d32";
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.color = "";
                        btn.style.borderColor = "";
                    }, 1000);
                };

                // Draggable Logic
                const header = modal.querySelector('.bili-history-header');
                let isDragging = false;
                let startX, startY, initialLeft, initialTop;

                header.onmousedown = (e) => {
                    isDragging = true;
                    startX = e.clientX;
                    startY = e.clientY;
                    // Get computed style for initial position
                    const rect = modal.getBoundingClientRect();
                    initialLeft = rect.left;
                    initialTop = rect.top;

                    // Clear 'right' and set explicit 'left' to allow movement
                    modal.style.right = 'auto';
                    modal.style.left = initialLeft + 'px';
                    modal.style.top = initialTop + 'px';
                    modal.style.margin = '0'; // Remove any margins that might interfere
                };

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    e.preventDefault(); // Prevent selecting text while dragging
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;
                    modal.style.left = `${initialLeft + dx}px`;
                    modal.style.top = `${initialTop + dy}px`;
                });

                document.addEventListener('mouseup', () => {
                    isDragging = false;
                });
                
                const resizeHandle = modal.querySelector('.bili-resize-handle');
                let isResizing = false;
                let startResizeX, startScale;
                let currentScale = 1;

                resizeHandle.onmousedown = (e) => {
                    e.stopPropagation(); 
                    e.preventDefault();
                    isResizing = true;
                    startResizeX = e.clientX;
                    startScale = currentScale;
                    
                    document.body.style.cursor = 'nwse-resize'; 
                };

                document.addEventListener('mousemove', (e) => {
                    if (!isResizing) return;
                    e.preventDefault();
                    
                    // 计算鼠标横向移动了多少像素
                    const deltaX = e.clientX - startResizeX;
                    
                    // 核心算法：
                    // 模态框原始宽度为 320px
                    // 新的比例 = 旧比例 + (移动距离 / 320)
                    // 这样移动 320px 就会增加 1倍大小，手感比较自然
                    let newScale = startScale + (deltaX / 320);

                    // 限制缩放范围：最小 0.7 倍，最大 2.0 倍
                    newScale = Math.min(Math.max(newScale, 0.7), 2.0);

                    currentScale = newScale;
                    modal.style.transform = `scale(${newScale})`;
                });

                document.addEventListener('mouseup', () => {
                    if (isResizing) {
                        isResizing = false;
                        document.body.style.cursor = ''; 
                    }
                });
            }
        }


        // Helper: Render History List
        function renderHistory() {
            const list = document.getElementById('bili-history-list');
            if (!list || window.biliSubtitleHistory.length === 0) return;

            list.innerHTML = '';
            if (window.biliSubtitleHistory.length === 0) {
                list.innerHTML = '<div style="text-align:center;color:#999;margin-top:20px;font-size:12px">已清空<br>等待下一句字幕...</div>';
                return;
            }
            window.biliSubtitleHistory.forEach(item => {
                const row = document.createElement('div');
                row.className = 'bili-history-item';
                row.innerHTML = `
                <div class="bili-history-time" title="点击跳转" data-time="${item.seconds}">${item.timeStr}</div>
                <div class="bili-history-content">
                    <span class="bili-history-origin">${item.origin}</span>
                    ${item.trans ? `<span class="bili-history-trans">${item.trans}</span>` : ''}
                </div>
            `;
                // Click to seek
                row.querySelector('.bili-history-time').onclick = function () {
                    const video = document.querySelector('video');
                    if (video) video.currentTime = parseFloat(this.getAttribute('data-time'));
                };
                list.appendChild(row);
            });
            if (window.biliAutoScroll) {
                list.scrollTop = list.scrollHeight;
            }
        }

        // 3. Observer Logic (Run Once)
        if (!window.biliObserverInit) {
            window.biliObserverInit = true;

            const findAndObserve = () => {
                const video = document.querySelector('video');
                // Target the wrapper that contains both major and minor groups (New Bilibili Structure)
                const subContainer = document.querySelector('.bili-subtitle-x-subtitle-panel-wrap');

                if (subContainer && video) {
                    console.log("Subtitle Recorder: Observer attached.");

                    window.biliSubObserver = new MutationObserver(() => {
                        // Locate active text nodes
                        const majorNode = subContainer.querySelector('.bili-subtitle-x-subtitle-panel-major-group .bili-subtitle-x-subtitle-panel-text');
                        const minorNode = subContainer.querySelector('.bili-subtitle-x-subtitle-panel-minor-group .bili-subtitle-x-subtitle-panel-text');

                        if (!majorNode && !minorNode) return;

                        let origin = majorNode ? majorNode.textContent.trim() : "";
                        let trans = minorNode ? minorNode.textContent.trim() : "";

                        // Fallback for simple structure
                        if (!origin && !trans) {
                            const singleNode = subContainer.querySelector('.bili-subtitle-x-subtitle-panel-text');
                            if (singleNode) origin = singleNode.textContent.trim();
                        }

                        if (!origin && !trans) return;
                        if (origin === "字幕样式测试") return;
                        // Smart Deduplication
                        const lastItem = window.biliSubtitleHistory[window.biliSubtitleHistory.length - 1];
                        const currentTime = video.currentTime;

                        // Rule 1: Exact match -> Ignore
                        if (lastItem && lastItem.origin === origin && lastItem.trans === trans) return;
                        // 判定是否为原有句子的“延伸/修正” (例如 "Hello" -> "Hello World")
                        const isOriginExtension = lastItem && origin.startsWith(lastItem.origin);
                        
                        // 判定是否为翻译的“延伸” (例如 "你好" -> "你好世界")，且长度必须增加才算延伸，完全相等不算
                        const isTransExtension = lastItem && trans && lastItem.trans && trans.startsWith(lastItem.trans) && trans.length > lastItem.trans.length;

                        // Rule 2: ASR Correction (覆盖)
                        // 条件：时间很近 (<1s) 且 (英文变长了 OR 中文变长了)
                        const isASRCorrection = lastItem && Math.abs(currentTime - lastItem.seconds) < 1.0 && 
                                                (isOriginExtension || isTransExtension);

                        // Rule 3: Merge Split Sentences (追加)
                        // 条件：翻译完全一样，时间在5秒内，且英文完全不包含旧英文（说明是新的一段话，而不是ASR修正）
                        const isSplitMerge = lastItem && trans && lastItem.trans === trans &&
                            Math.abs(currentTime - lastItem.seconds) < 5.0 &&
                            !isOriginExtension;

                        if (isASRCorrection) {
                            lastItem.origin = origin;
                            if (trans) lastItem.trans = trans;
                            renderHistory();
                        } else if (isSplitMerge) {
                            lastItem.origin += " " + origin;
                            renderHistory();

                        } else {
                            // Rule 3: New Sentence -> Push
                            window.biliSubtitleHistory.push({
                                seconds: currentTime,
                                timeStr: formatTime(currentTime),
                                origin: origin,
                                trans: trans
                            });
                            renderHistory();
                        }
                    });
                    window.biliSubObserver.observe(subContainer, { childList: true, subtree: true, characterData: true });
                } else {
                    setTimeout(findAndObserve, 2000);
                }
            };
            findAndObserve();
        }

        // 4. Existing Metadata & Copy Logic
        document.getElementsByTagName("img").forEach((ele) => { ele.src = ele.src.replace(/@.*\.avif/g, "") });

        // AI Summary Handling
        let aiSummaryElements = document.querySelectorAll('[class*="_Summary_"]');
        if (aiSummaryElements.length > 0) {
            aiSummaryElements.forEach((summaryElement) => {
                if (!summaryElement.classList.contains('bli_copyTEXT')) {
                    summaryElement.classList.add('bli_copyTEXT');
                    summaryElement.style.cursor = 'pointer';
                    summaryElement.title = '点击复制内容';
                }
            });
        }

        // Subtitle Copy Handling
        let subtitleElements = document.querySelectorAll('[class*="_Text_"]');
        if (subtitleElements.length > 0) {
            subtitleElements.forEach((subElement) => {
                if (!subElement.classList.contains('bli_copyTEXT')) {
                    subElement.classList.add('bli_copyTEXT');
                    subElement.style.cursor = 'pointer';
                    subElement.title = '点击复制字幕';
                }
            });
        }

        // Live Subtitle Copy Handling
        let liveSubtitleElements = document.querySelectorAll('[class*="bili-subtitle-x-subtitle-panel-text"]');
        if (liveSubtitleElements.length > 0) {
            liveSubtitleElements.forEach((liveSubElement) => {
                if (!liveSubElement.classList.contains('bli_copyTEXT')) {
                    liveSubElement.classList.add('bli_copyTEXT');
                    liveSubElement.style.cursor = 'pointer';
                    let dataType = liveSubElement.getAttribute('data-type');
                    liveSubElement.title = dataType === '0' ? '点击复制中文字幕' : (dataType === '1' ? '点击复制英文字幕' : '点击复制字幕');
                }
            });
        }

        // Info Panel Backup
        if (b_infos) {
            let bilibili_url = document.createElement("div");
            let bilibili_title = document.createElement("div");
            bilibili_url.classList.add("bli_copyTEXT", "custom-backup-element");
            bilibili_title.classList.add("bli_copyTEXT", "custom-backup-element");

            // Re-apply style here to ensure persistence
            const styleProps = `padding: 8px 12px; background: var(--bg-color); border-radius: var(--border-radius); border-left: 3px solid var(--primary-color);`;
            bilibili_title.style.cssText = styleProps + "margin-bottom: 8px;";
            bilibili_url.style.cssText = styleProps;

            bilibili_title.innerHTML = '' + b_title.textContent;
            let bilibili_up = b_up.querySelector('a');
            let url_parse = new URL(window.location.href);
            let bilibili_date;
            if (document.querySelector('.pubdate-text')) {
                bilibili_date = document.querySelector('.pubdate-text').innerHTML.trim();
            } else {
                bilibili_date = document.querySelector('.pubdate-ip-text') ? document.querySelector('.pubdate-ip-text').innerHTML.trim().split(' ')[0] : "";
            }

            let dt = new Date(bilibili_date);
            // Handle valid dates
            if (!isNaN(dt.getTime())) {
                bilibili_date = dt.getFullYear() + "." + (dt.getMonth() + 1);
            }

            bilibili_url.innerHTML = 'Bilibili链接：' + url_parse.protocol + "//" + url_parse.hostname + url_parse.pathname + "   BY:" + (bilibili_up ? bilibili_up.outerHTML : "Unknown") + "   " + bilibili_date;

            let kws = document.getElementsByClassName("bli_copyTEXT");
            for (let i = 0; i < kws.length; i++) {
                kws[i].onclick = function () {
                    const btn = this; 
                    let originalHTML = btn.innerHTML; 
                    let originalBG = btn.style.backgroundColor;
                    
                    copy(btn); 
                    
                    btn.innerHTML = "✓ 已复制";
                    btn.style.backgroundColor = "#e8f5e9";
                    btn.style.color = "#2e7d32";
                    
                    window.setTimeout(function () {
                        if (btn) { // 安全检查
                            btn.innerHTML = originalHTML;
                            btn.style.backgroundColor = originalBG;
                            btn.style.color = "";
                        }
                    }, 1000);
                }
            }

            if (!b_infos.lastElementChild.classList.contains('bli_copyTEXT')) {
                b_infos.appendChild(document.createElement("br"));
                b_infos.appendChild(document.createElement("br"));
                b_infos.appendChild(bilibili_title);
                b_infos.appendChild(bilibili_url);
            }
        }
    }


    if (/bilibili/.test(document.URL)) {
        let lastUrl = window.location.href; // last URL as Bli collection URL changes
        setInterval(function () {
            let currentUrl = window.location.href; // current URL
            Bilibili();

            if (currentUrl !== lastUrl) {
                console.log("Detected navigation, resetting observer...");

                try {
                    const tagPanel = document.querySelector('.tag-panel');
                    if (tagPanel) {
                        let count = 0;
                        while (tagPanel.lastElementChild && (tagPanel.lastElementChild.classList.contains('custom-backup-element') || tagPanel.lastElementChild.tagName === 'BR')) {
                            tagPanel.lastElementChild.remove();
                            if (++count > 6) break;
                        }
                    }
                } catch (e) { console.error("Error clearing info panel:", e); }

                if (window.biliSubObserver) {
                    window.biliSubObserver.disconnect();
                    window.biliSubObserver = null;
                }
                window.biliObserverInit = false; // 重置初始化标记，允许 Bilibili() 重新执行 findAndObserve

                lastUrl = currentUrl;
            }
        },
            1500);

    }
})();
// ==UserScript==
// @name         Bluesky HLS Link Sniffer & Downloader (Timebar)
// @namespace    https://github.com/YFTree
// @version      0.1
// @description  在 Bluesky 视频播放器时间旁边添加下载按钮，自动捕获 HLS 播放列表链接 (.m3u8)。
// @author       YFTree
// @match        https://bsky.app/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @compatible   firefox
// @compatible   chrome
// @compatible   opera safari edge
// @compatible   safari
// @compatible   edge
// @downloadURL https://update.greasyfork.org/scripts/556931/Bluesky%20HLS%20Link%20Sniffer%20%20Downloader%20%28Timebar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556931/Bluesky%20HLS%20Link%20Sniffer%20%20Downloader%20%28Timebar%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hlsMasterUrl = null;
    
    // 定位时间显示元素
    const TIME_DISPLAY_SELECTOR = 'div[dir="auto"].css-146c3p1[style*="font-variant: no-contextual tabular-nums;"]';

    // 劫持 XMLHttpRequest 的 open 方法，捕获 .m3u8 链接
    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        const urlStr = String(url); 

        // 检查是否为 Bluesky 视频的 HLS 播放列表
        if (urlStr.includes('video.bsky.app') && urlStr.endsWith('.m3u8')) {
            if (!hlsMasterUrl) {
                hlsMasterUrl = urlStr;
                console.log("HLS 链接已捕获:", urlStr);
            }
        }
        
        return originalXhrOpen.apply(this, arguments);
    };
    
    // 创建下载按钮并插入到时间旁边
    function createDownloadButton() {
        const timeDisplay = document.querySelector(TIME_DISPLAY_SELECTOR);
        
        if (!timeDisplay) {
            return;
        }

        const controlsBar = timeDisplay.parentElement;

        if (!controlsBar || controlsBar.querySelector('#hls-download-btn')) {
            return;
        }

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'hls-download-btn';
        downloadBtn.textContent = '📥'; 
        downloadBtn.title = '获取 HLS 下载链接 (.m3u8)';
        downloadBtn.style.cssText = `
            padding: 4px; 
            border-radius: 999px;
            transition: opacity 0.1s;
            background: none; 
            border: none;
            color: white; 
            font-size: 16px; 
            cursor: pointer;
            line-height: 1; 
            margin-right: 4px; 
            margin-left: -4px; 
            opacity: 0.8;
        `;
        
        downloadBtn.onmouseover = () => downloadBtn.style.opacity = '1';
        downloadBtn.onmouseout = () => downloadBtn.style.opacity = '0.8';
        
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (hlsMasterUrl) {
                window.open(hlsMasterUrl, '_blank');
                alert("HLS 主播放列表链接已在新窗口打开。请使用专业下载工具（如 yt-dlp）解析此链接进行下载。");
            } else {
                alert("HLS 链接尚未捕获。请点击播放视频并等待几秒钟。");
            }
        });

        // 插入按钮到正确位置
        const flexSpacer = controlsBar.querySelector('div[style*="flex: 1 1 0%;"]');
        if (flexSpacer) {
            controlsBar.insertBefore(downloadBtn, flexSpacer.nextSibling); 
        } else {
            controlsBar.insertBefore(downloadBtn, timeDisplay);
        }
    }
    
    // 观察 DOM 变化，部署按钮
    const observer = new MutationObserver(() => {
        if (document.querySelector(TIME_DISPLAY_SELECTOR)) {
            createDownloadButton();
        }
    });

    if (document.body) {
         observer.observe(document.body, { childList: true, subtree: true });
    } else {
         document.addEventListener('DOMContentLoaded', () => {
             observer.observe(document.body, { childList: true, subtree: true });
         });
    }

})();
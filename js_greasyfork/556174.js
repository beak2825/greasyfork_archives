// ==UserScript==
// @name         视频下载器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  捕捉浏览器页面中的视频，支持webm转mp4格式并下载
// @author       You
// @match        *://*/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/ffmpeg.wasm@0.10.1/dist/ffmpeg.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556174/%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/556174/%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 视频捕捉函数
    function captureVideos() {
        const videos = [];
        const videoElements = document.querySelectorAll('video');
        
        videoElements.forEach((video, index) => {
            let videoUrl = '';
            
            // 直接获取src属性
            if (video.src && video.src !== '') {
                videoUrl = video.src;
            } 
            // 从source元素获取
            else {
                const sources = video.querySelectorAll('source');
                if (sources.length > 0) {
                    videoUrl = sources[0].src;
                }
            }
            
            // 处理blob URL
            if (videoUrl.startsWith('blob:')) {
                // 尝试从网络请求中获取原始URL
                // 这部分可能需要更复杂的处理
                console.log('发现blob URL，需要特殊处理:', videoUrl);
            }
            
            if (videoUrl) {
                videos.push({
                    id: index,
                    url: videoUrl,
                    type: getVideoType(videoUrl),
                    element: video
                });
            }
        });
        
        return videos;
    }
    
    // 获取视频类型
    function getVideoType(url) {
        if (url.includes('.mp4') || url.includes('video/mp4')) return 'mp4';
        if (url.includes('.webm') || url.includes('video/webm')) return 'webm';
        if (url.includes('.m3u8') || url.includes('application/x-mpegURL')) return 'm3u8';
        if (url.includes('.flv') || url.includes('video/x-flv')) return 'flv';
        return 'unknown';
    }
    
    // 视频格式转换函数
    async function convertVideo(videoUrl, fromType, toType = 'mp4') {
        if (fromType === toType) {
            // 如果格式已经是目标格式，直接返回原始URL
            return videoUrl;
        }
        
        if (fromType !== 'webm' || toType !== 'mp4') {
            // 目前只支持webm转mp4
            console.log('目前只支持webm转mp4格式');
            return videoUrl;
        }
        
        try {
            // 初始化FFmpeg
            const { createFFmpeg, fetchFile } = FFmpeg;
            const ffmpeg = createFFmpeg({
                log: true,
                corePath: 'https://cdn.jsdelivr.net/npm/ffmpeg.wasm@0.10.1/dist/ffmpeg-core.js'
            });
            
            await ffmpeg.load();
            
            // 下载视频文件
            const inputFileName = `input.${fromType}`;
            const outputFileName = `output.${toType}`;
            
            // 从URL获取视频数据
            const response = await fetch(videoUrl);
            const arrayBuffer = await response.arrayBuffer();
            
            // 写入到FFmpeg文件系统
            ffmpeg.FS('writeFile', inputFileName, new Uint8Array(arrayBuffer));
            
            // 执行转换命令
            await ffmpeg.run('-i', inputFileName, outputFileName);
            
            // 获取转换后的文件数据
            const data = ffmpeg.FS('readFile', outputFileName);
            
            // 创建Blob URL
            const blob = new Blob([data.buffer], { type: `video/${toType}` });
            const convertedUrl = URL.createObjectURL(blob);
            
            // 清理资源
            ffmpeg.FS('unlink', inputFileName);
            ffmpeg.FS('unlink', outputFileName);
            
            return convertedUrl;
        } catch (error) {
            console.error('视频转换失败:', error);
            return videoUrl; // 转换失败时返回原始URL
        }
    }
    
    // 视频下载函数
    function downloadVideo(videoUrl, fileName = '', fileType = 'mp4') {
        // 生成默认文件名
        if (!fileName) {
            const timestamp = new Date().getTime();
            fileName = `video_${timestamp}.${fileType}`;
        }
        
        // 添加文件扩展名
        if (!fileName.includes('.')) {
            fileName += `.${fileType}`;
        }
        
        try {
            // 使用GM_download下载
            GM_download({
                url: videoUrl,
                name: fileName,
                saveAs: true, // 显示保存对话框
                onload: function() {
                    console.log('视频下载完成:', fileName);
                },
                onerror: function(error) {
                    console.error('视频下载失败:', error);
                    // 如果GM_download失败，尝试使用原生下载
                    fallbackDownload(videoUrl, fileName);
                }
            });
        } catch (error) {
            console.error('GM_download失败:', error);
            // 回退到原生下载
            fallbackDownload(videoUrl, fileName);
        }
    }
    
    // 原生下载回退函数
    function fallbackDownload(videoUrl, fileName) {
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 对于blob URL，需要清理
        if (videoUrl.startsWith('blob:')) {
            setTimeout(() => {
                URL.revokeObjectURL(videoUrl);
            }, 1000);
        }
    }
    
    // 完整的视频下载流程
    async function processAndDownload(video, convertToMp4 = true) {
        let videoUrl = video.url;
        let fileType = video.type;
        
        // 如果需要转换为mp4且当前不是mp4格式
        if (convertToMp4 && video.type !== 'mp4') {
            console.log('正在转换视频格式...');
            const convertedUrl = await convertVideo(video.url, video.type, 'mp4');
            videoUrl = convertedUrl;
            fileType = 'mp4';
        }
        
        // 下载视频
        console.log('开始下载视频...');
        downloadVideo(videoUrl, '', fileType);
    }
    
    // 创建用户界面
    function createUI() {
        // 检查界面是否已存在
        if (document.getElementById('video-downloader-ui')) {
            return;
        }
        
        // 创建UI容器
        const container = document.createElement('div');
        container.id = 'video-downloader-ui';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            font-family: Arial, sans-serif;
            overflow-y: auto;
        `;
        
        // 创建标题
        const title = document.createElement('h3');
        title.textContent = '视频下载器';
        title.style.cssText = `
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #333;
        `;
        container.appendChild(title);
        
        // 创建捕捉按钮
        const captureBtn = document.createElement('button');
        captureBtn.textContent = '捕捉视频';
        captureBtn.id = 'capture-videos-btn';
        captureBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        `;
        container.appendChild(captureBtn);
        
        // 创建自动转换选项
        const convertOption = document.createElement('div');
        convertOption.style.cssText = `
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        `;
        
        const convertCheckbox = document.createElement('input');
        convertCheckbox.type = 'checkbox';
        convertCheckbox.id = 'auto-convert-checkbox';
        convertCheckbox.checked = true;
        convertCheckbox.style.marginRight = '8px';
        
        const convertLabel = document.createElement('label');
        convertLabel.htmlFor = 'auto-convert-checkbox';
        convertLabel.textContent = '自动转换为MP4格式';
        convertLabel.style.fontSize = '14px';
        
        convertOption.appendChild(convertCheckbox);
        convertOption.appendChild(convertLabel);
        container.appendChild(convertOption);
        
        // 创建视频列表容器
        const videoList = document.createElement('div');
        videoList.id = 'video-list';
        videoList.style.cssText = `
            max-height: 300px;
            overflow-y: auto;
        `;
        container.appendChild(videoList);
        
        // 添加到页面
        document.body.appendChild(container);
        
        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        `;
        
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
        });
        container.appendChild(closeBtn);
        
        // 绑定捕捉按钮事件
        captureBtn.addEventListener('click', () => {
            const videos = captureVideos();
            displayVideos(videos);
        });
    }
    
    // 显示视频列表
    function displayVideos(videos) {
        const videoList = document.getElementById('video-list');
        videoList.innerHTML = '';
        
        if (videos.length === 0) {
            videoList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">未找到视频</p>';
            return;
        }
        
        videos.forEach((video, index) => {
            const videoItem = document.createElement('div');
            videoItem.style.cssText = `
                background: #f9f9f9;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 4px;
                border: 1px solid #eee;
            `;
            
            // 视频信息
            const videoInfo = document.createElement('div');
            videoInfo.style.cssText = `
                font-size: 12px;
                margin-bottom: 8px;
                color: #666;
                word-break: break-all;
            `;
            
            const videoUrlShort = video.url.length > 50 ? video.url.substring(0, 50) + '...' : video.url;
            videoInfo.innerHTML = `
                <p>视频 ${index + 1}</p>
                <p>格式: ${video.type}</p>
                <p>URL: ${videoUrlShort}</p>
            `;
            
            // 下载按钮容器
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 5px;
            `;
            
            // 原始下载按钮
            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = '下载';
            downloadBtn.style.cssText = `
                flex: 1;
                padding: 6px;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
            
            downloadBtn.addEventListener('click', () => {
                processAndDownload(video, false);
            });
            
            // 转换下载按钮
            const convertDownloadBtn = document.createElement('button');
            convertDownloadBtn.textContent = '转换下载';
            convertDownloadBtn.style.cssText = `
                flex: 1;
                padding: 6px;
                background: #FF9800;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
            
            convertDownloadBtn.addEventListener('click', () => {
                processAndDownload(video, true);
            });
            
            // 添加按钮
            buttonContainer.appendChild(downloadBtn);
            buttonContainer.appendChild(convertDownloadBtn);
            
            // 添加到视频项
            videoItem.appendChild(videoInfo);
            videoItem.appendChild(buttonContainer);
            
            // 添加到列表
            videoList.appendChild(videoItem);
        });
    }
    
    // 脚本加载完成后执行
    window.addEventListener('load', () => {
        // 延迟创建UI，确保页面已完全加载
        setTimeout(createUI, 1000);
    });

})();
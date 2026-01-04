// ==UserScript==
// @name flyvedio
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  为页面视频添加快进、快退、暂停控制按钮
// @author       You
// @match        https://japaneseasmr.com/*
// @match        https://asmr.one/work/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558345/flyvedio.user.js
// @updateURL https://update.greasyfork.org/scripts/558345/flyvedio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置项
    let skipSeconds = 10; // 默认快进/快退秒数

    // 样式
    const styles = `
        #asmr-link-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 999999;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        #asmr-link-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        #download-link-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 999999;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
            transition: all 0.3s;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        #download-link-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
        }

        #video-controller {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 8px 12px;
            border-radius: 10px;
            z-index: 999999;
            display: flex;
            gap: 8px;
            align-items: center;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        #video-controller button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 5px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 20px;
            transition: all 0.3s;
            line-height: 1;
            min-width: auto;
        }

        #video-controller button:hover {
            background: #45a049;
            transform: scale(1.05);
        }

        #video-controller button.pause {
            background: #f44336;
        }

        #video-controller button.pause:hover {
            background: #da190b;
        }

        #video-controller button.fullscreen {
            background: #2196F3;
        }

        #video-controller button.fullscreen:hover {
            background: #0b7dda;
        }

        #video-controller input {
            width: 40px;
            padding: 5px;
            border: none;
            border-radius: 5px;
            text-align: center;
            font-size: 14px;
        }

        #video-controller label {
            color: white;
            font-size: 14px;
            margin-left: 5px;
        }

        #video-controller .video-info {
            color: white;
            font-size: 12px;
            margin-left: 5px;
        }
    `;

    // 添加样式到页面
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 提取 RJ 编号
    function extractRJName() {
        const strongElement = document.querySelector('#work_title_jp strong');
        if (!strongElement) return null;

        const text = strongElement.textContent;
        // 查找最后一个 [] 中的内容
        const matches = text.match(/\[([^\]]+)\]/g);
        if (!matches || matches.length === 0) return null;

        // 获取最后一个匹配项，并去除方括号
        const lastMatch = matches[matches.length - 1];
        return lastMatch.slice(1, -1);
    }

    // 创建 ASMR 链接按钮（用于 japaneseasmr.com）
    function createAsmrLinkButton() {
        // 检查是否已存在按钮
        if (document.getElementById('asmr-link-btn')) return;

        const rjName = extractRJName();
        if (!rjName) {
            console.log('未找到 RJ 编号');
            return;
        }

        const button = document.createElement('a');
        button.id = 'asmr-link-btn';
        button.href = `https://asmr.one/work/${rjName}`;
        button.target = '_blank';
        button.innerHTML = `🔗`;
        document.body.appendChild(button);

        console.log(`已创建 ASMR 链接按钮: ${rjName}`);
    }

    // 从 asmr.one URL 提取 RJ 编号
    function extractRJFromAsmrOne() {
        const match = window.location.pathname.match(/\/work\/(RJ\d+)/);
        return match ? match[1] : null;
    }

    // 创建下载按钮（用于 asmr.one）
    function createDownloadButton() {
        // 检查是否已存在按钮
        if (document.getElementById('download-link-btn')) return;

        const rjNumber = extractRJFromAsmrOne();
        if (!rjNumber) {
            console.log('未能从 URL 提取 RJ 编号');
            return;
        }

        const button = document.createElement('a');
        button.id = 'download-link-btn';
        button.href = `http://192.168.0.108:51733/asmr/library/${rjNumber}`;
        button.target = '_blank';
        button.innerHTML = `⬇️`;
        document.body.appendChild(button);

        console.log(`已创建下载按钮: ${rjNumber}`);
    }

    // 查找视频元素
    function findVideos() {
        return document.querySelectorAll('video');
    }

    // 创建控制面板
    function createController(video) {
        // 检查是否已存在控制器
        if (document.getElementById('video-controller')) {
            return;
        }

        const controller = document.createElement('div');
        controller.id = 'video-controller';

        controller.innerHTML = `
            <button id="rewind-btn" title="快退 ${skipSeconds}秒">⏪</button>
            <button id="play-pause-btn" class="pause" title="暂停">⏸️</button>
            <button id="forward-btn" title="快进 ${skipSeconds}秒">⏩</button>
            <button id="fullscreen-btn" class="fullscreen" title="横屏全屏">🔄</button>
            <input type="number" id="skip-input" value="${skipSeconds}" min="1" max="60" title="调整秒数">
            <span class="video-info" id="current-time">00:00</span>
        `;

        document.body.appendChild(controller);

        // 绑定事件
        const rewindBtn = document.getElementById('rewind-btn');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const forwardBtn = document.getElementById('forward-btn');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const skipInput = document.getElementById('skip-input');

        // 快退
        rewindBtn.addEventListener('click', () => {
            video.currentTime = Math.max(0, video.currentTime - skipSeconds);
        });

        // 播放/暂停
        playPauseBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseBtn.textContent = '⏸️';
                playPauseBtn.title = '暂停';
                playPauseBtn.classList.add('pause');
            } else {
                video.pause();
                playPauseBtn.textContent = '▶️';
                playPauseBtn.title = '播放';
                playPauseBtn.classList.remove('pause');
            }
        });

        // 快进
        forwardBtn.addEventListener('click', () => {
            video.currentTime = Math.min(video.duration, video.currentTime + skipSeconds);
        });

        // 横屏全屏
        fullscreenBtn.addEventListener('click', async () => {
            try {
                // 尝试进入全屏
                if (video.requestFullscreen) {
                    await video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    await video.webkitRequestFullscreen();
                } else if (video.mozRequestFullScreen) {
                    await video.mozRequestFullScreen();
                } else if (video.msRequestFullscreen) {
                    await video.msRequestFullscreen();
                }

                // 尝试锁定屏幕方向为横屏
                if (screen.orientation && screen.orientation.lock) {
                    try {
                        await screen.orientation.lock('landscape');
                    } catch (err) {
                        console.log('无法锁定屏幕方向:', err);
                    }
                }
            } catch (err) {
                console.error('全屏失败:', err);
                alert('全屏失败，请手动旋转屏幕');
            }
        });

        // 修改秒数
        skipInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if (value > 0 && value <= 60) {
                skipSeconds = value;
                rewindBtn.title = `快退 ${skipSeconds}秒`;
                forwardBtn.title = `快进 ${skipSeconds}秒`;
            }
        });

        // 更新时间显示
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        video.addEventListener('timeupdate', () => {
            document.getElementById('current-time').textContent = formatTime(video.currentTime);
        });

        // 监听视频播放状态变化
        video.addEventListener('play', () => {
            playPauseBtn.textContent = '⏸️';
            playPauseBtn.title = '暂停';
            playPauseBtn.classList.add('pause');
        });

        video.addEventListener('pause', () => {
            playPauseBtn.textContent = '▶️';
            playPauseBtn.title = '播放';
            playPauseBtn.classList.remove('pause');
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // 避免在输入框中触发
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - skipSeconds);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime = Math.min(video.duration, video.currentTime + skipSeconds);
                    break;
                case ' ':
                    e.preventDefault();
                    if (video.paused) {
                        video.play();
                    } else {
                        video.pause();
                    }
                    break;
            }
        });
    }

    // 初始化
    function init() {
        const hostname = window.location.hostname;

        // 根据不同网站执行不同逻辑
        if (hostname === 'japaneseasmr.com') {
            // japaneseasmr.com: 创建 ASMR 链接按钮和视频控制器
            createAsmrLinkButton();

            const videos = findVideos();
            if (videos.length > 0) {
                createController(videos[0]);
                console.log(`找到 ${videos.length} 个视频元素，已创建控制器`);
            }
        } else if (hostname === 'asmr.one') {
            // asmr.one: 创建下载按钮
            createDownloadButton();
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听动态加载的视频（仅限 japaneseasmr.com）
    const observer = new MutationObserver((mutations) => {
        // 只在 japaneseasmr.com 上监听视频
        if (window.location.hostname !== 'japaneseasmr.com') return;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const videos = findVideos();
                if (videos.length > 0 && !document.getElementById('video-controller')) {
                    createController(videos[0]);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

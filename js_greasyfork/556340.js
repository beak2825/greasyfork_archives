// ==UserScript==
// @name         StripChat 视频显示切换
// @namespace    Mopanda Scripts
// @version      1.0.3
// @description  切换视频列表单列显示、隐藏覆盖层、显示视频控制条
// @author       Mopanda
// @match        https://zh.stripchat.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556340/StripChat%20%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BA%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/556340/StripChat%20%E8%A7%86%E9%A2%91%E6%98%BE%E7%A4%BA%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 注入核心CSS样式到head
    function injectStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .change .user-videos-page__video-list {
                grid-template-columns: repeat(1, minmax(250px, 850px)) !important;
            }
            .change .videos-list-item-v2 .content-wrapper--blured,
            .change .videos-list-item-v2 .trailer.blured{
                filter: blur(0px);
            }
            .change .media-access-overlay--cover.viewer,
            .change .media-access-overlay--lock {
                display: none !important;
            }
            /* 优化按钮样式，避免被网站样式覆盖 */
            #showVideo {
                margin-left: 12px !important;
                padding: 6px 16px !important;
                background-color: #ff4d4f !important;
                color: #fff !important;
                border: none !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 14px !important;
            }
            #showVideo:hover {
                opacity: 0.9 !important;
                transform: none !important;
                box-shadow: none !important;
            }
            /* 确保视频控制条不被遮挡 */
            .videos-list-v2 video {
                z-index: 1 !important;
            }
        `;
        (document.head || document.body).appendChild(style);
    }

    // 2. 给所有video标签添加controls属性（支持动态加载的视频）
    function addVideoControls() {
        // 查找.videos-list-v2下所有video标签
        const videoList = document.querySelector('.videos-list-v2');
        if (!videoList) return;

        const videos = videoList.querySelectorAll('video:not([controls])');
        videos.forEach(video => {
            video.setAttribute('controls', 'controls');
            // 可选：设置控制条显示样式（部分浏览器默认隐藏，hover显示）
            video.style.controls = 'controls';
        });
    }

    // 3. 添加切换按钮
    function addToggleButton() {
        const userVideosPage = document.querySelector('.user-videos-page');
        if (!userVideosPage) return;

        const titleElement = userVideosPage.querySelector('.user-media-page-header__title');
        if (!titleElement) return;

        if (document.getElementById('showVideo')) return;

        const button = document.createElement('button');
        button.className = 'btn btn-v2-money';
        button.id = 'showVideo';
        button.type = 'button';
        button.textContent = '显示视频';

        button.addEventListener('click', toggleChangeClass);
        titleElement.appendChild(button);
    }

    // 4. 切换change类名+同步处理视频控制条
    function toggleChangeClass() {
        const videoList = document.querySelector('.videos-list-v2');
        if (!videoList) {
            alert('未找到视频列表元素');
            return;
        }

        // 切换change类
        videoList.classList.toggle('change');
        // 切换时重新检查视频控制条（确保新增视频也有controls）
        addVideoControls();

        // 操作反馈
        const isAdded = videoList.classList.contains('change');
        console.log(isAdded
            ? '已切换为单列显示，覆盖层已隐藏，视频控制条已显示'
            : '已恢复原布局（视频控制条保持显示）');
    }

    // 5. 监听DOM动态加载（适配SPA+动态视频）
    function initObserver() {
        // 初始执行：添加按钮+视频控制条
        addToggleButton();
        addVideoControls();

        // 监听DOM变化，处理动态加载的元素
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                addToggleButton(); // 尝试添加按钮
                addVideoControls(); // 尝试给新视频添加controls
            });
        });

        // 监听body下所有子元素变化（覆盖深层DOM和动态视频）
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 页面卸载时停止监听
        window.addEventListener('unload', () => {
            observer.disconnect();
        });
    }

    // 初始化执行
    injectStyle();
    initObserver();
})();
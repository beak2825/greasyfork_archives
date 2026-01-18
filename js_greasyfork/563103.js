// ==UserScript==
// @name         Emby收藏按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在Emby视频页面添加收藏按钮
// @author       Damon
// @match        http://192.168.123.202:8096/web/index.html*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563103/Emby%E6%94%B6%E8%97%8F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/563103/Emby%E6%94%B6%E8%97%8F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // const url = `http://192.168.123.202:8096/emby/Users/e1bca16aaf23497e8b8f33cdee760e48/FavoriteItems/${itemId}?X-Emby-Client=Emby+Web&X-Emby-Device-Name=Chrome+Windows&X-Emby-Device-Id=eb7e48ba-387b-4c1a-8b02-e47cda4a351d&X-Emby-Client-Version=4.9.1.4&X-Emby-Token=49305c8ae7304a168e30f70aac9c88bc&X-Emby-Language=zh-cn`;
    // f12获取收藏请求，将对应的配置参数替换
    // ========== 全局配置参数 ==========
    // Emby服务器基础URL
    const BASE_URL = 'http://192.168.123.202:8096';

    // 用户ID和认证信息
    const USER_ID = 'e1bca16aaf23497e8b8f33cdee760e48';
    const AUTH_TOKEN = '49305c8ae7304a168e30f70aac9c88bc';

    // 设备信息参数
    const DEVICE_PARAMS = {
        'X-Emby-Client': 'Emby Web',
        'X-Emby-Device-Name': 'Chrome Windows',
        'X-Emby-Device-Id': 'eb7e48ba-387b-4c1a-8b02-e47cda4a351d',
        'X-Emby-Client-Version': '4.9.1.4',
        'X-Emby-Token': AUTH_TOKEN,
        'X-Emby-Language': 'zh-cn'
    };

    // ========== 工具函数 ==========

    /**
     * 构建完整的API URL
     * @param {string} endpoint - API端点路径
     * @returns {string} 完整的URL
     */
    function buildApiUrl(endpoint) {
        const params = new URLSearchParams(DEVICE_PARAMS).toString();
        return `${BASE_URL}${endpoint}?${params}`;
    }

    /**
     * 检查当前页面是否为视频OSD页面
     * @returns {boolean}
     */
    function isVideoOSDPage() {
        return window.location.hash.includes('videoosd');
    }

    /**
     * 从当前页面获取ITEM_ID
     * @returns {string|null} 视频ID
     */
    function getItemId() {
        /** TODO:
          1. 获取item id，收藏状态
          2. 收藏状态，取消收藏状态
          3. 取消收藏请求
        */
        const videoElement = document.querySelector('.htmlvideoplayer');
        if (!videoElement || !videoElement.src) return null;

        const match = videoElement.src.match(/\/(\d+)\/original\.mp4/);
        return match ? match[1] : null;
    }

    /**
     * 发送收藏/取消收藏请求
     * @param {string} itemId - 视频ID
     */
    function toggleFavorite(itemId) {
        if (!itemId) {
            showNotification('无法获取视频ID', 'error');
            return;
        }

        // 构建收藏API URL
        const endpoint = `/emby/Users/${USER_ID}/FavoriteItems/${itemId}`;
        const url = buildApiUrl(endpoint);

        // TODO: 需要先检查当前收藏状态，再决定是收藏还是取消收藏
        // 目前只实现收藏功能
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.IsFavorite === true) {
                showNotification('收藏成功！', 'success');
            }
        })
    }

    /**
     * 显示通知
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型: 'success'或'error'
     */
    function showNotification(message, type) {
        // 移除已有的通知
        const existingNotification = document.getElementById('custom-notification');
        if (existingNotification) existingNotification.remove();

        // 创建通知元素
        const notification = document.createElement('div');
        notification.id = 'custom-notification';
        notification.textContent = message;

        // 设置通知样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            borderRadius: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: '10000',
            fontSize: '14px',
            fontWeight: '500',
            animation: 'slideIn 0.3s ease-out',
            minWidth: '200px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
        });

        // 添加到页面
        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * 创建收藏按钮
     */
    function createFavoriteButton() {
        // 检查是否已存在按钮
        if (document.getElementById('custom-favorite-button')) return;

        const button = document.createElement('button');
        button.id = 'custom-favorite-button';
        button.innerHTML = '❤️';
        button.title = '收藏';

        // 设置按钮样式
        Object.assign(button.style, {
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: '9999',
            width: '50px',
            height: '50px',
            fontSize: '24px',
            background: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid #fff',
            borderRadius: '50%',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
        });

        // 添加悬停效果
        button.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 0, 0, 0.7)';
            this.style.transform = 'translateY(-50%) scale(1.1)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0, 0, 0, 0.7)';
            this.style.transform = 'translateY(-50%) scale(1)';
        });

        // 点击事件
        button.addEventListener('click', function() {
            const itemId = getItemId();
            if (itemId) toggleFavorite(itemId);
        });

        // 添加到页面
        document.body.appendChild(button);

        // 存储按钮引用
        window.customFavoriteButton = button;
    }

    /**
     * 移除收藏按钮
     */
    function removeFavoriteButton() {
        const button = document.getElementById('custom-favorite-button');
        if (button) button.remove();
    }

    /**
     * 主函数：检查页面并管理按钮
     */
    function manageFavoriteButton() {
        if (isVideoOSDPage()) {
            // 等待页面内容加载
            setTimeout(() => {
                const itemId = getItemId();
                if (itemId) {
                    createFavoriteButton();
                } else {
                    // 如果没获取到ID，延迟重试
                    setTimeout(() => {
                        if (getItemId()) createFavoriteButton();
                    }, 1000);
                }
            }, 500);
        } else {
            removeFavoriteButton();
        }
    }

    // ========== 初始化 ==========

    // 页面加载时执行
    if (isVideoOSDPage()) manageFavoriteButton();

    // 监听hash变化（Emby是单页面应用）
    let lastHash = window.location.hash;
    const observer = new MutationObserver(() => {
        if (window.location.hash !== lastHash) {
            lastHash = window.location.hash;
            setTimeout(manageFavoriteButton, 300);
        }
    });

    // 开始观察
    observer.observe(document, {
        subtree: true,
        childList: true
    });

    // 添加全局样式
    const style = document.createElement('style');
    style.textContent = `
        #custom-favorite-button.favorited {
            background: rgba(255, 0, 0, 0.9) !important;
            border-color: #ff4444 !important;
        }

        #custom-favorite-button.favorited:after {
            content: '✓';
            position: absolute;
            font-size: 16px;
            color: white;
            bottom: -5px;
            right: -5px;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
})();
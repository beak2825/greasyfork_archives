// ==UserScript==
// @name         91Porn增强工具箱
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  91Porn视频下载+广告屏蔽+页面清理三合一工具
// @author       🥚🥚🥚🥚
// @match        https://91porn.com/*
// @match        http://91porn.com/*
// @icon         https://91porn.com/images/logo.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555975/91Porn%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/555975/91Porn%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================================
    // 功能1: 视频广告屏蔽
    // ================================
    function initAdBlocker() {
        console.log('初始化广告屏蔽功能...');

        // 保存原始registerPlugin方法
        const originalRegisterPlugin = window.videojs && window.videojs.registerPlugin;

        // 更早地重写registerPlugin方法
        if (window.videojs) {
            window.videojs.registerPlugin = function(name, plugin) {
                if (name === 'preroll') {
                    console.log('广告插件已被完全屏蔽');
                    return function() {
                        // 空函数，不执行任何操作
                    };
                }
                return originalRegisterPlugin.call(this, name, plugin);
            };
        } else {
            // 如果videojs尚未加载，设置拦截器
            Object.defineProperty(window, 'videojs', {
                set: function(value) {
                    const originalRegisterPlugin = value.registerPlugin;
                    value.registerPlugin = function(name, plugin) {
                        if (name === 'preroll') {
                            console.log('广告插件已被完全屏蔽');
                            return function() {};
                        }
                        return originalRegisterPlugin.call(this, name, plugin);
                    };
                    Object.defineProperty(window, 'videojs', {
                        value: value,
                        writable: false
                    });
                },
                configurable: true
            });
        }

        // 监听DOM变化移除广告元素
        const adObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (node.classList && (
                                node.classList.contains('vjs-preroll') ||
                                node.classList.contains('preroll-skip-button') ||
                                node.classList.contains('pre-countdown')
                            )) {
                                node.remove();
                                console.log('检测到并移除了广告元素');
                            }

                            const adElements = node.querySelectorAll ? node.querySelectorAll('.vjs-preroll, .preroll-skip-button, .pre-countdown') : [];
                            adElements.forEach(function(adElement) {
                                adElement.remove();
                            });
                        }
                    });
                }
            });
        });

        adObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 页面加载完成后清理残留广告
        window.addEventListener('load', function() {
            document.querySelectorAll('.vjs-preroll, .preroll-skip-button, .pre-countdown').forEach(function(element) {
                element.remove();
            });
            adObserver.disconnect();
        });
    }

    // ================================
    // 功能2: 视频下载功能
    // ================================
    function initDownloadFeature() {
        console.log('初始化视频下载功能...');

        function getMP4SourceFromPlayer() {
            const player = document.getElementById('player_one_html5_api');
            if (!player) {
                console.log('未找到播放器元素');
                return null;
            }

            const mp4Source = player.querySelector('source[type="video/mp4"]');
            if (mp4Source) {
                console.log('找到MP4视频源:', mp4Source.src);
                return mp4Source;
            } else {
                const parent = player.parentElement;
                const siblingSource = parent ? parent.querySelector('source[type="video/mp4"]') : null;
                if (siblingSource) {
                    console.log('在播放器同级找到MP4视频源:', siblingSource.src);
                    return siblingSource;
                }
                return null;
            }
        }

        function createFloatingButton() {
            const mp4Source = getMP4SourceFromPlayer();
            if (!mp4Source || !mp4Source.src) {
                console.log('未找到有效的MP4视频源');
                return;
            }

            const button = document.createElement('button');
            button.innerHTML = '🎬 下载视频';
            button.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(255, 255, 255, 0.95);
                color: #2c3e50;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                padding: 14px 22px;
                font-size: 13px;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                letter-spacing: 0.3px;
                text-transform: uppercase;
            `;

            // 悬停效果
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
                this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
            });

            button.addEventListener('click', function() {
                window.location.href = mp4Source.src;
            });

            document.body.appendChild(button);
            console.log('悬浮下载按钮已创建');
        }

        function getFourthFloatMenu() {
            const floatMenus = document.querySelectorAll('.floatmenu');
            return floatMenus.length >= 4 ? floatMenus[3] : null;
        }

        function createDownloadLink() {
            const mp4Source = getMP4SourceFromPlayer();
            const fourthFloatMenu = getFourthFloatMenu();

            if (!mp4Source || !mp4Source.src || !fourthFloatMenu) {
                return;
            }

            fourthFloatMenu.innerHTML = '';
            const downloadLink = document.createElement('a');
            downloadLink.href = mp4Source.src;
            downloadLink.textContent = '下载此视频';

            fourthFloatMenu.appendChild(downloadLink);
            console.log('下载链接已添加到菜单');
        }

        function initDownload() {
            createDownloadLink();
            createFloatingButton();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDownload);
        } else {
            initDownload();
        }

        // 延迟重试
        setTimeout(() => {
            if (!document.querySelector('.floatmenu:nth-child(4) a')) {
                initDownload();
            }
        }, 3000);
    }

    // ================================
    // 功能3: 页面清理功能
    // ================================
    function initPageCleaner() {
        console.log('初始化页面清理功能...');

        function cleanPage() {
            // 清理图片：只保留thumb图片
            const images = document.querySelectorAll('img');
            let thumbKept = 0;
            let imagesRemoved = 0;

            images.forEach(img => {
                const src = img.src.toLowerCase();
                if (src.includes('thumb')||src.includes('logo')||src.includes('captcha')) {
                    thumbKept++;
                } else {
                    img.remove();
                    imagesRemoved++;
                }
            });

            // 清理iframe
            const iframes = document.querySelectorAll('iframe');
            let iframesRemoved = iframes.length;
            iframes.forEach(iframe => iframe.remove());

            console.log(`页面清理: 保留${thumbKept}缩略图, 删除${imagesRemoved}其他图片, 删除${iframesRemoved}iframe`);
        }

        // 监听新元素
        const cleanObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'IMG' && !node.src.toLowerCase().includes('thumb')) {
                            node.remove();
                        } else if (node.tagName === 'IFRAME') {
                            node.remove();
                        } else {
                            const nonThumbImages = node.querySelectorAll('img');
                            nonThumbImages.forEach(img => {
                                if (!img.src.toLowerCase().includes('thumb')) {
                                    img.remove();
                                }
                            });
                            const childIframes = node.querySelectorAll('iframe');
                            childIframes.forEach(iframe => iframe.remove());
                        }
                    }
                });
            });
        });

        // 立即执行清理
        cleanPage();
        cleanObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定期清理
        setInterval(cleanPage, 5000);
    }

    // ================================
    // 主初始化函数
    // ================================
    function main() {
        console.log('91Porn增强工具箱启动...');

        // 按顺序初始化各功能
        initAdBlocker();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initDownloadFeature();
                initPageCleaner();
            });
        } else {
            setTimeout(() => {
                initDownloadFeature();
                initPageCleaner();
            }, 1000);
        }
    }

    // 启动脚本
    main();

})();
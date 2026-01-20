// ==UserScript==
// @name         115随机视频访问
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  在115网盘筛选视频后，从所有页面中随机访问一个视频
// @author       Your Name
// @match        https://115.com/*
// @icon         https://115.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      115.com
// @connect      webapi.115.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563342/115%E9%9A%8F%E6%9C%BA%E8%A7%86%E9%A2%91%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/563342/115%E9%9A%8F%E6%9C%BA%E8%A7%86%E9%A2%91%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #random-video-btn {
            position: fixed;
            bottom: 100px;
            right: 30px;
            z-index: 9999;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }
        #random-video-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        #random-video-btn:active {
            transform: translateY(0);
        }
        #random-video-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            box-shadow: none;
        }
    `);

    // 创建按钮
    function createButton() {
        const btn = document.createElement('button');
        btn.id = 'random-video-btn';
        btn.textContent = '🎲 随机视频';
        btn.onclick = randomAccessVideo;
        document.body.appendChild(btn);
        return btn;
    }

    // 从URL中获取当前的cid
    function getCurrentCid() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('cid') || '0';
    }

    // 从URL中获取当前的offset
    function getCurrentOffset() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('offset') || '0';
    }

    // 获取视频总数
    function getTotalVideoCount() {
        return new Promise((resolve, reject) => {
            const cid = getCurrentCid();
            const limit = 1; // 只需要获取总数，不需要实际数据

            // 构建API URL - 只获取视频文件 (type=4)
            const apiUrl = `https://webapi.115.com/files?aid=1&cid=${cid}&offset=0&limit=${limit}&type=4&show_dir=1&fc_mix=0&natsort=1&count_folders=1&format=json&custom_order=0`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.state) {
                            // count 字段包含总的视频数量
                            resolve(data.count || 0);
                        } else {
                            reject('无法获取视频总数');
                        }
                    } catch (e) {
                        reject('解析响应失败: ' + e.message);
                    }
                },
                onerror: function(error) {
                    reject('请求失败: ' + error);
                }
            });
        });
    }

    // 获取指定页面的视频列表
    function getVideosAtOffset(offset, limit = 20) {
        return new Promise((resolve, reject) => {
            const cid = getCurrentCid();

            // 构建API URL - 只获取视频文件 (type=4)
            const apiUrl = `https://webapi.115.com/files?aid=1&cid=${cid}&offset=${offset}&limit=${limit}&type=4&show_dir=1&fc_mix=0&natsort=1&count_folders=1&format=json&custom_order=0`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.state && data.data && data.data.length > 0) {
                            resolve(data.data);
                        } else {
                            reject('没有找到视频文件');
                        }
                    } catch (e) {
                        reject('解析响应失败: ' + e.message);
                    }
                },
                onerror: function(error) {
                    reject('请求失败: ' + error);
                }
            });
        });
    }

    // 获取视频播放地址
    function getVideoUrl(pickcode) {
        return new Promise((resolve, reject) => {
            const apiUrl = `https://webapi.115.com/files/video?pickcode=${pickcode}&share_id=0&local=1`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.video_url) {
                            resolve(data.video_url);
                        } else {
                            reject('无法获取视频地址');
                        }
                    } catch (e) {
                        reject('解析视频地址失败: ' + e.message);
                    }
                },
                onerror: function(error) {
                    reject('请求视频地址失败: ' + error);
                }
            });
        });
    }

    // 随机访问视频
    async function randomAccessVideo() {
        const btn = document.getElementById('random-video-btn');
        btn.disabled = true;
        btn.textContent = '⏳ 获取总数...';

        try {
            // 获取视频总数
            const totalCount = await getTotalVideoCount();
            console.log('视频总数:', totalCount);

            if (totalCount === 0) {
                alert('当前文件夹没有视频文件');
                return;
            }

            // 随机选择一个视频的索引（0 到 totalCount-1）
            const randomVideoIndex = Math.floor(Math.random() * totalCount);
            console.log('随机选择的视频索引:', randomVideoIndex);

            // 计算该视频所在的页面offset（每页20个）
            const pageSize = 20;
            const randomOffset = Math.floor(randomVideoIndex / pageSize) * pageSize;
            console.log('视频所在页面的offset:', randomOffset);

            btn.textContent = '⏳ 加载视频...';

            // 获取该页面的视频列表
            const videos = await getVideosAtOffset(randomOffset, pageSize);

            if (videos.length === 0) {
                alert('无法获取视频列表');
                return;
            }

            // 计算在该页面中的索引
            const indexInPage = randomVideoIndex % pageSize;
            // 确保索引不超出实际视频数量
            const actualIndex = Math.min(indexInPage, videos.length - 1);
            const selectedVideo = videos[actualIndex];

            console.log('随机选中的视频:', selectedVideo);
            console.log('视频名称:', selectedVideo.n);

            // 方式1: 使用pickcode跳转到115vod播放
            if (selectedVideo.pc) {
                const playUrl = `https://115vod.com/?pickcode=${selectedVideo.pc}&share_id=0`;
                window.open(playUrl, '_blank');
            }
            // 方式2: 跳转到文件所在文件夹并定位到该文件
            else if (selectedVideo.fid) {
                const fileUrl = `https://115.com/?cid=${selectedVideo.cid}&offset=0&mode=wangpan`;
                window.open(fileUrl, '_blank');
            }
            else {
                alert('无法打开视频: 缺少必要的参数');
            }

        } catch (error) {
            console.error('随机访问视频失败:', error);
            alert('随机访问视频失败: ' + error);
        } finally {
            btn.disabled = false;
            btn.textContent = '🎲 随机视频';
        }
    }

    // 检查是否在文件列表页面
    function isFileListPage() {
        const pathname = window.location.pathname;
        const search = window.location.search;
        const hash = window.location.hash;

        console.log('[115随机视频] 当前路径:', pathname);
        console.log('[115随机视频] 查询参数:', search);
        console.log('[115随机视频] Hash:', hash);

        // 115网盘可能使用hash路由或普通路由
        // 检查是否在文件列表页面（包含cid参数或在根路径）
        const hasCid = search.includes('cid') || hash.includes('cid');
        const isRoot = pathname === '/' || pathname === '';

        const result = isRoot || hasCid;
        console.log('[115随机视频] 是否显示按钮:', result);

        return result;
    }

    // 初始化
    function init() {
        console.log('[115随机视频] 脚本开始初始化...');
        console.log('[115随机视频] 当前URL:', window.location.href);

        // 等待页面加载完成
        if (document.readyState === 'loading') {
            console.log('[115随机视频] 页面加载中，等待DOMContentLoaded...');
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('[115随机视频] 页面已加载完成');

        // 延迟创建按钮，确保页面DOM已经准备好
        setTimeout(() => {
            // 只在文件列表页面显示按钮
            if (isFileListPage()) {
                console.log('[115随机视频] 创建按钮...');
                createButton();
                console.log('[115随机视频] 按钮已创建');
            } else {
                console.log('[115随机视频] 不在文件列表页面，不创建按钮');
            }
        }, 1000);

        // 监听URL变化（SPA应用）
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                console.log('[115随机视频] URL变化:', lastUrl, '->', url);
                lastUrl = url;
                const existingBtn = document.getElementById('random-video-btn');
                if (isFileListPage()) {
                    if (!existingBtn) {
                        console.log('[115随机视频] URL变化后创建按钮');
                        createButton();
                    }
                } else {
                    if (existingBtn) {
                        console.log('[115随机视频] URL变化后移除按钮');
                        existingBtn.remove();
                    }
                }
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // 立即执行初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

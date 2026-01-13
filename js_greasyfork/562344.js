
// ==UserScript==
// @name         一键统计B站收藏夹时长
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  B站收藏夹时长统计脚本，基于 @吊打洛杉矶柠檬 的脚本，移除了手动输入收藏夹 ID 和 Cookies 的交互，实现一键获取时长。
// @author       冷萃编译器
// @homepage     https://greasyfork.org/zh-CN/scripts/562344
// @match        https://www.bilibili.com/medialist/detail/*
// @match        https://space.bilibili.com/*/favlist*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      bilibili.com
// @supportURL https://github.com/krwu/scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/562344/%E4%B8%80%E9%94%AE%E7%BB%9F%E8%AE%A1B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/562344/%E4%B8%80%E9%94%AE%E7%BB%9F%E8%AE%A1B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractFavId() {
        const favUrl = window.location.href;
        let targetId = null;
        const url = new URL(favUrl);
        if (url.pathname.startsWith('/medialist/detail/ml')) {
            const match = url.pathname.match(/\/medialist\/detail\/ml(\d+)/);
            if (match) {
                targetId = match[1];
            }
        } else if (url.pathname.includes('/favlist')) {
            targetId = url.searchParams.get('fid');
        }
        return targetId;
    }
    async function getFavListDuration() {
       const mediaId = extractFavId();

       if (!mediaId) {
           alert('无法提取收藏夹ID');
           return;
       }

        const pageSize = 20;
        let totalSeconds = 0;
        let videoCount = 0;
        let currentPage = 1;
        let hasMore = true;

        try {
            while (hasMore) {
                const data = await fetchFavList(mediaId, currentPage, pageSize);

                data.medias.forEach(item => {
                    if (item.duration) {
                        totalSeconds += item.duration;
                        videoCount++;
                    }
                });

                hasMore = data.has_more && data.medias.length === pageSize;
                currentPage++;

                if (currentPage > 50) {
                    break;
                }
            }

            showResult(totalSeconds, videoCount);
        } catch (error) {
            console.error('统计错误:', error);
            GM_notification({
                title: '统计失败',
                text: error.message || '请确保已登录B站并有权访问此收藏夹',
                timeout: 5000
            });
        }
    }

    async function fetchFavList(mediaId, page, pageSize) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.bilibili.com/x/v3/fav/resource/list?media_id=${mediaId}&pn=${page}&ps=${pageSize}`,
                onload: function(response) {
                    const data = JSON.parse(response.responseText);
                    if (data.code !== 0) {
                        reject(new Error(data.message || 'API请求失败'));
                        return;
                    }
                    if (!data.data || !data.data.medias) {
                        reject(new Error('无效的API响应结构'));
                        return;
                    }
                    resolve(data.data);
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败'));
                }
            });
        });
    }

    function showResult(totalSeconds, videoCount) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const message = `共 ${videoCount} 个视频\n总时长: ${hours}小时 ${minutes}分钟 ${seconds}秒`;

        GM_notification({
            title: '统计完成',
            text: message,
            timeout: 8000
        });

        alert(message);
        console.log('统计结果:', message);
    }

    // 添加界面按钮
    function addUIButton() {
        const btn = document.createElement('button');
        btn.textContent = '统计收藏时长';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#fb7299';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';

        btn.addEventListener('click', getFavListDuration);
        document.body.appendChild(btn);
    }

    // 页面加载完成后添加按钮
    window.addEventListener('load', addUIButton);
})();

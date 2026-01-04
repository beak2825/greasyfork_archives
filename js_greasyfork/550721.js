// ==UserScript==
// @name         视频播放量统计
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  统计B站空间当前月份视频的总播放量
// @author       无夏不春风orz
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550721/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/550721/%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%87%8F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('B站空间视频播放量统计脚本已加载');

    // 拦截fetch请求
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (typeof url === 'string' && url.includes('api.bilibili.com/x/space/wbi/arc/search')) {
            //console.log('拦截到fetch请求:', url);
            return originalFetch.apply(this, arguments)
                .then(response => {
                    if (!response.ok) return response;
                    return response.clone().json().then(data => {
                        //console.log('fetch响应数据:', data);
                        if (data.code === 0 && data.data?.list?.vlist) {
                            processVideoData(data.data.list.vlist);
                        }
                        return new Response(JSON.stringify(data), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    }).catch(err => {
                        console.error('解析fetch响应出错:', err);
                        return response;
                    });
                });
        }
        return originalFetch.apply(this, arguments);
    };

    async function checkVideoTags(bvid) {
        try {
            const response = await fetch(`https://api.bilibili.com/x/tag/archive/tags?bvid=${bvid}`);
            if (!response.ok) {
                console.log(`获取视频 ${bvid} 标签失败: HTTP ${response.status}`);
                return false;
            }
            const data = await response.json();
            if (data.code === 0 && data.data) {
                console.log(`视频 ${bvid} 标签:`, data.data.map(tag => tag.tag_name).join(', '));
                const hasValidTag = data.data.some(tag =>
                                                   tag.tag_name && (
                    tag.tag_name.includes('主播') ||
                    tag.tag_name.includes('直播') ||
                    tag.tag_name.includes('直播切片')
                )
                                                  );
                return hasValidTag;
            } else {
                console.log(`获取视频 ${bvid} 标签失败:`, data.message);
                return false;
            }
        } catch (error) {
            console.error(`获取视频 ${bvid} 标签出错:`, error);
            return false;
        }
    }

    // 处理视频数据并计算当前月份播放量
    async function processVideoData(vlist) {
        console.log('开始处理视频数据，数量:', vlist.length);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        let totalPlay = 0;
        let count = 0;

        for (const video of vlist) {
            if (video.created && video.play > 500) {
                const videoDate = new Date(video.created * 1000);
                const videoYear = videoDate.getFullYear();
                const videoMonth = videoDate.getMonth() + 1;

                if (videoYear === currentYear && videoMonth === currentMonth) {
                    if(await checkVideoTags(video.bvid)){
                        totalPlay += video.play || 0;
                        count++;
                        console.log(`${video.bvid}: ${video.title}, 播放量: ${video.play}, 发布时间: ${videoDate.toLocaleString()}`);
                    }
                }
            }
        }

        if (count > 0) {
            console.log(`统计完成: 本月视频 ${count} 个，总播放量 ${totalPlay}`);
            showStats(totalPlay, count);
        } else {
            console.log('当前月份没有视频数据');
            showNoDataMessage();
        }
    }

    // 显示无数据提示
    function showNoDataMessage() {
        const statsDiv = getOrCreateStatsDiv();
        statsDiv.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>本月视频统计</strong></div>
            <div>当前月份没有发布视频</div>
        `;
    }

    // 获取或创建统计面板
    function getOrCreateStatsDiv() {
        let statsDiv = document.getElementById('bili-video-stats');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'bili-video-stats';
            statsDiv.style.position = 'fixed';
            statsDiv.style.top = '100px';
            statsDiv.style.left = '20px';
            statsDiv.style.backgroundColor = 'rgba(251, 114, 153, 0.9)';
            statsDiv.style.color = 'white';
            statsDiv.style.padding = '15px';
            statsDiv.style.borderRadius = '8px';
            statsDiv.style.zIndex = '9999';
            statsDiv.style.fontFamily = '"Microsoft YaHei", sans-serif';
            statsDiv.style.fontSize = '14px';
            statsDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            statsDiv.style.border = '1px solid #ff8fab';
            statsDiv.style.minWidth = '200px';

            // 添加关闭按钮
            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '5px';
            closeBtn.style.right = '10px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.fontSize = '16px';
            closeBtn.addEventListener('click', () => {
                statsDiv.style.display = 'none';
            });

            statsDiv.appendChild(closeBtn);
            document.body.appendChild(statsDiv);
        } else {
            statsDiv.style.display = 'block';
        }
        return statsDiv;
    }

    // 在页面上显示统计结果
    function showStats(totalPlay, videoCount) {
        const statsDiv = getOrCreateStatsDiv();
        const now = new Date();
        const monthName = now.toLocaleString('zh-CN', { month: 'long' });

        statsDiv.innerHTML = `
            <div style="margin-bottom: 10px; font-size: 16px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 5px;">
                <span style="color: #fffacd;">📊 本月视频统计</span>
            </div>
            <div style="margin-bottom: 8px;"><span style="display: inline-block; width: 80px;">统计月份:</span> <strong>${now.getFullYear()}年${monthName}</strong></div>
            <div style="margin-bottom: 8px;"><span style="display: inline-block; width: 80px;">视频数量:</span> <strong style="color: #ffeb3b;">${videoCount}个</strong></div>
            <div style="margin-bottom: 8px;"><span style="display: inline-block; width: 80px;">总播放量:</span> <strong style="color: #ffeb3b;">${totalPlay.toLocaleString()}</strong></div>
            <div style="margin-top: 10px; font-size: 12px; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 5px;">
                点击右上角×关闭
            </div>
        `;

        // 重新添加关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '×';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '10px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '16px';
        closeBtn.addEventListener('click', () => {
            statsDiv.style.display = 'none';
        });

        statsDiv.appendChild(closeBtn);
    }
})();
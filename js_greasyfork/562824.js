// ==UserScript==
// @name         愚公搬cern
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  提取唯一YouTube链接并显示播放器、标题、播放量、点赞量、发布时间和作者订阅数，添加复制按钮
// @author       丰
// @match        https://cern1.cc/cern/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      youtube.com
// @connect      i.ytimg.com
// @connect      www.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/562824/%E6%84%9A%E5%85%AC%E6%90%ACcern.user.js
// @updateURL https://update.greasyfork.org/scripts/562824/%E6%84%9A%E5%85%AC%E6%90%ACcern.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DIALOG_SELECTOR = '.el-dialog';
    const CARD_BODY_SELECTOR = '.el-card__body';
    const VIDEO_LINK_SELECTOR = `${CARD_BODY_SELECTOR} a[href*="youtube.com"]`;
    const YOUTUBE_API_KEY = 'AIzaSyBX7YiD9hL6V5_uoG-5dVvoZ6mdNTvLWIM';

    // 样式变量
    const COLORS = {
        primary: '#FF0000',
        primaryLight: '#FF5252',
        text: '#333333',
        textLight: '#666666',
        border: '#EEEEEE',
        background: '#FFFFFF',
        hover: '#F8F8F8',
        success: '#4CAF50',
        info: '#2196F3'
    };

    // 创建全局样式
    const style = document.createElement('style');
    style.textContent  = `
        .yt-info-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            max-height: 70vh;
            overflow-y: auto;
            background: ${COLORS.background};
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            z-index: 99999;
            padding: 0;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            border: 1px solid ${COLORS.border};
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease-out;
        }

        .yt-info-panel.visible  {
            transform: translateY(0);
            opacity: 1;
        }

        .yt-info-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid ${COLORS.border};
            background-color: ${COLORS.background};
            position: sticky;
            top: 0;
            z-index: 1;
            border-radius: 12px 12px 0 0;
        }

        .yt-info-title {
            margin: 0;
            font-size: 16px;
            color: ${COLORS.primary};
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .yt-info-title svg {
            width: 20px;
            height: 20px;
            fill: ${COLORS.primary};
        }

        .yt-info-close {
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            margin: 0;
            color: ${COLORS.textLight};
            transition: color 0.2s;
            line-height: 1;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .yt-info-close:hover {
            color: ${COLORS.primary};
            background-color: rgba(255, 0, 0, 0.1);
        }

        .yt-info-content {
            padding: 8px;
        }

        .yt-loading {
            text-align: center;
            padding: 30px 20px;
            color: ${COLORS.textLight};
            font-size: 14px;
        }

        .yt-error {
            text-align: center;
            padding: 30px 20px;
            color: ${COLORS.textLight};
            font-size: 14px;
        }

        .yt-video-card {
            margin-bottom: 12px;
            padding: 16px;
            border: 1px solid ${COLORS.border};
            border-radius: 10px;
            background-color: ${COLORS.background};
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }

        .yt-video-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .yt-video-title {
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 15px;
            color: ${COLORS.text};
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.4;
        }

        .yt-video-player-container {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%;
            margin-bottom: 12px;
            border-radius: 6px;
            overflow: hidden;
            background-color: #f5f5f5;
        }

        .yt-video-player {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
        }

        .yt-video-author-container {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: ${COLORS.textLight};
            margin-bottom: 8px;
            flex-wrap: wrap;
        }

        .yt-video-author {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .yt-video-subscribers {
            display: flex;
            align-items: center;
            gap: 6px;
            color: ${COLORS.primaryLight};
        }

        .yt-video-stats {
            display: flex;
            gap: 12px;
            margin-bottom: 14px;
            flex-wrap: wrap;
        }

        .yt-video-stat {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 13px;
            color: ${COLORS.textLight};
        }

        .yt-video-stat svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        .yt-video-views {
            color: ${COLORS.text};
        }

        .yt-video-likes {
            color: ${COLORS.success};
        }

        .yt-video-date {
            color: ${COLORS.info};
        }

        .yt-video-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .yt-watch-btn {
            color: ${COLORS.primary};
            text-decoration: none;
            font-size: 13px;
            padding: 6px 14px;
            border: 1px solid ${COLORS.primary};
            border-radius: 6px;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .yt-watch-btn:hover {
            background-color: ${COLORS.primary};
            color: white;
        }

        .yt-watch-btn svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        .yt-copy-btn {
            margin-left: 10px;
            padding: 6px 14px;
            background: ${COLORS.primary};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .yt-copy-btn:hover {
            background: ${COLORS.primaryLight};
        }

        .yt-copy-btn svg {
            width: 14px;
            height: 14px;
            fill: currentColor;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .yt-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 0, 0, 0.3);
            border-top-color: ${COLORS.primary};
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            vertical-align: middle;
        }

        @media (max-width: 480px) {
            .yt-info-panel {
                width: calc(100% - 40px);
                max-height: 60vh;
                bottom: 10px;
                right: 10px;
            }
        }
    `;
    document.head.appendChild(style);

    // SVG图标
    const youtubeIconSVG = `<svg viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>`;
    const copyIconSVG = `<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
    const playIconSVG = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
    const viewsIconSVG = `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
    const likesIconSVG = `<svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>`;
    const dateIconSVG = `<svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>`;
    const subscribersIconSVG = `<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`;

    // 全局变量
    let panelInstance = null;
    let currentPlayingVideoId = null;
    let processedVideoIds = new Set();
    let currentDialog = null;
    let dialogObserver = null;
    let mainObserver = null;

    // 复制按钮事件监听
document.addEventListener('click', async function(e) {
    const copyButton = e.target.closest('.yt-copy-btn');
    if (!copyButton) return;

    e.preventDefault();

    // 获取原始YouTube链接
    const originalLink = copyButton.getAttribute('data-clipboard-text');

    // 1. 获取Cmp ID
    let cmpId = '';
    const cmpIdRows = document.querySelectorAll('tr');
    for (const tr of cmpIdRows) {
        if (tr.textContent.includes('Cmp id')) {
            const nextRow = tr.nextElementSibling;
            if (nextRow) {
                const cmpIdCell = nextRow.querySelector('td');
                if (cmpIdCell) {
                    cmpId = cmpIdCell.textContent.trim();
                    break;
                }
            }
        }
    }

    // 2. 获取落地页链接
    let landingPageUrl = '';
    const landingPageTitles = document.querySelectorAll('.cmp-info-title');
    for (const title of landingPageTitles) {
        if (title.textContent.includes('落地页链接')) {
            const container = title.closest('.el-col');
            if (container) {
                const linkElement = container.querySelector('a.el-link');
                if (linkElement) {
                    landingPageUrl = linkElement.getAttribute('href') || linkElement.textContent.trim();
                    break;
                }
            }
        }
    }

    // 3. 创建无边框表格（文本居中）
    const htmlContent = `
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <td style="padding: 4px; text-align: center;">${escapeHtml(originalLink)}</td>
                <td style="padding: 4px; text-align: center;">${escapeHtml(cmpId)}</td>
                <td style="padding: 4px; text-align: center;">${escapeHtml(landingPageUrl)}</td>
            </tr>
        </table>
    `;

    const plainText = `${originalLink}\t${cmpId}\t${landingPageUrl}`;

    // 4. 执行复制
    try {
        // 现代浏览器方式
        if (navigator.clipboard && window.ClipboardItem) {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([htmlContent], { type: 'text/html' }),
                    'text/plain': new Blob([plainText], { type: 'text/plain' })
                })
            ]);
        }
        // 传统浏览器方式
        else {
            const tempEl = document.createElement('div');
            tempEl.style.position = 'fixed';
            tempEl.style.left = '-9999px';
            tempEl.innerHTML = htmlContent;
            document.body.appendChild(tempEl);

            const range = document.createRange();
            range.selectNode(tempEl);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');

            document.body.removeChild(tempEl);
            window.getSelection().removeAllRanges();
        }

        // 显示成功反馈
        copyButton.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> 已复制!`;
        setTimeout(() => {
            copyButton.innerHTML = `${copyIconSVG} 复制链接`;
        }, 2000);
    } catch (error) {
        console.error('复制失败:', error);
        copyButton.innerHTML = '复制失败';
        setTimeout(() => {
            copyButton.innerHTML = `${copyIconSVG} 复制链接`;
        }, 2000);
    }
});

// HTML转义函数
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// 提取视频ID函数
function extractVideoId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 辅助函数：显示成功反馈
function showSuccessFeedback(button) {
    button.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> 已复制!`;
    setTimeout(() => {
        button.innerHTML = `${copyIconSVG} 复制链接`;
    }, 2000);
}

// 辅助函数：HTML转义
function escapeHtml(str) {
    return String(str).replace(/[&<>"'`=\/]/g, function(s) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#x60;',
            '=': '&#x3D;',
            '/': '&#x2F;'
        }[s];
    });
}

// 辅助函数：提取视频ID
function extractVideoId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// 辅助函数：从URL提取视频ID
function extractVideoId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

    // 创建控制面板
    function getControlPanel() {
        if (panelInstance) return panelInstance;

        const panel = document.createElement('div');
        panel.className  = 'yt-info-panel';
        panel.id  = 'youtube-info-panel';

        const header = document.createElement('div');
        header.className  = 'yt-info-header';

        const title = document.createElement('h3');
        title.className  = 'yt-info-title';
        title.innerHTML  = `${youtubeIconSVG} YouTube视频信息`;

        const closeBtn = document.createElement('button');
        closeBtn.className  = 'yt-info-close';
        closeBtn.innerHTML  = '&times;';
        closeBtn.onclick  = () => {
            panel.classList.remove('visible');
            setTimeout(() => {
                panel.style.display  = 'none';
            }, 300);
        };

        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        const content = document.createElement('div');
        content.className  = 'yt-info-content';
        content.id  = 'youtube-info-content';
        panel.appendChild(content);

        document.body.appendChild(panel);

        setTimeout(() => {
            panel.classList.add('visible');
        }, 10);

        panelInstance = panel;
        return panel;
    }

    // 获取视频基本信息
    function fetchVideoInfo(videoId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve({
                            title: data.title,
                            thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
                            author: data.author_name,
                            authorUrl: data.author_url
                        });
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    // 获取视频统计数据
    function fetchVideoStatistics(videoId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.items  && data.items.length  > 0) {
                            const stats = data.items[0].statistics;
                            const snippet = data.items[0].snippet;
                            const channelId = snippet.channelId;
                            const publishedAt = snippet.publishedAt;

                            resolve({
                                viewCount: formatNumber(stats.viewCount),
                                likeCount: formatNumber(stats.likeCount),
                                channelId: channelId,
                                publishedAt: publishedAt
                            });
                        } else {
                            resolve({
                                viewCount: "N/A",
                                likeCount: "N/A",
                                channelId: null,
                                publishedAt: null
                            });
                        }
                    } catch (e) {
                        console.error(' 解析统计数据时出错:', e);
                        resolve({
                            viewCount: "N/A",
                            likeCount: "N/A",
                            channelId: null,
                            publishedAt: null
                        });
                    }
                },
                onerror: function(error) {
                    console.error(' 获取统计数据时出错:', error);
                    resolve({
                        viewCount: "N/A",
                        likeCount: "N/A",
                        channelId: null,
                        publishedAt: null
                    });
                }
            });
        });
    }

    // 获取频道订阅数
    function fetchChannelSubscribers(channelId) {
        return new Promise((resolve) => {
            if (!channelId) {
                resolve("N/A");
                return;
            }

            GM_xmlhttpRequest({
                method: "GET",
                url: `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.items  && data.items.length  > 0) {
                            const subs = data.items[0].statistics.subscriberCount;
                            resolve(formatNumber(subs));
                        } else {
                            resolve("N/A");
                        }
                    } catch (e) {
                        console.error(' 解析频道数据时出错:', e);
                        resolve("N/A");
                    }
                },
                onerror: function(error) {
                    console.error(' 获取频道数据时出错:', error);
                    resolve("N/A");
                }
            });
        });
    }

    // 格式化日期
    function formatDate(dateString) {
        if (!dateString) return "N/A";

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffTime = Math.abs(now  - date);
            const diffDays = Math.ceil(diffTime  / (1000 * 60 * 60 * 24));

            if (diffDays < 1) {
                return "今天发布";
            } else if (diffDays < 7) {
                return `${diffDays}天前发布`;
            } else if (diffDays < 30) {
                const weeks = Math.floor(diffDays  / 7);
                return `${weeks}周前发布`;
            } else if (diffDays < 365) {
                const months = Math.floor(diffDays  / 30);
                return `${months}个月前发布`;
            } else {
                const years = Math.floor(diffDays  / 365);
                return `${years}年前发布`;
            }
        } catch (e) {
            console.error(' 格式化日期时出错:', e);
            return "N/A";
        }
    }

    // 格式化数字显示
    function formatNumber(num) {
        if (!num || num === "N/A") return num;

        num = parseInt(num);
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 获取唯一的YouTube视频ID
    function getUniqueVideoIds(links) {
        const uniqueIds = new Map();
        links.forEach(link  => {
            const videoId = extractVideoId(link);
            if (videoId && !uniqueIds.has(videoId))  {
                uniqueIds.set(videoId,  link);
            }
        });
        return uniqueIds;
    }

    // 提取视频ID
    function extractVideoId(url) {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // 创建复制按钮
    function createCopyButton(link) {
        const button = document.createElement('button');
        button.className  = 'yt-copy-btn';
        button.setAttribute('data-clipboard-text',  link);
        button.innerHTML  = `${copyIconSVG} 复制链接`;
        return button;
    }

    // 显示视频卡片
    async function displayVideoCards(panel, videoIds) {
        const content = panel.querySelector('#youtube-info-content');
        content.innerHTML  = `<div class="yt-loading"><div class="yt-spinner"></div><div style="margin-top:8px;">正在加载视频信息...</div></div>`;

        try {
            const fragment = document.createDocumentFragment();
            let successCount = 0;

            for (const [videoId, originalUrl] of videoIds) {
                try {
                    const [basicInfo, stats] = await Promise.all([
                        fetchVideoInfo(videoId),
                        fetchVideoStatistics(videoId)
                    ]);

                    const subscribers = await fetchChannelSubscribers(stats.channelId);

                    const card = createVideoCard({
                        ...basicInfo,
                        ...stats,
                        subscribers,
                        videoId
                    }, originalUrl);

                    fragment.appendChild(card);
                    successCount++;
                } catch (error) {
                    console.error(` 获取视频 ${videoId} 信息失败:`, error);
                }
            }

            content.innerHTML  = '';
            if (successCount > 0) {
                content.appendChild(fragment);
            } else {
                content.innerHTML  = '<div class="yt-error">无法获取视频信息<br><small>请确保您已连接到YouTube</small></div>';
            }
        } catch (error) {
            console.error(' 获取视频信息时出错:', error);
            content.innerHTML  = '<div class="yt-error">获取视频信息时出错<br><small>请刷新页面重试</small></div>';
        }
    }

    // 创建视频卡片
    function createVideoCard(videoInfo, originalUrl) {
        const card = document.createElement('div');
        card.className  = 'yt-video-card';

        const title = document.createElement('div');
        title.className  = 'yt-video-title';
        title.textContent  = videoInfo.title;

        const playerContainer = document.createElement('div');
        playerContainer.className  = 'yt-video-player-container';

        const player = document.createElement('iframe');
        player.className  = 'yt-video-player';
        player.src  = `https://www.youtube.com/embed/${videoInfo.videoId}?enablejsapi=1&rel=0&modestbranding=1`;
        player.allow  = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        player.allowFullscreen  = true;
        player.frameBorder  = '0';

        playerContainer.appendChild(player);

        const authorContainer = document.createElement('div');
        authorContainer.className  = 'yt-video-author-container';

        const author = document.createElement('span');
        author.className  = 'yt-video-author';
        author.innerHTML  = `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg> 作者: ${videoInfo.author}`;

        const subscribers = document.createElement('span');
        subscribers.className  = 'yt-video-subscribers';
        subscribers.innerHTML  = `<svg viewBox="0 0 24 24" width="14" height="14"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> ${videoInfo.subscribers  || 'N/A'} 订阅者`;

        authorContainer.appendChild(author);
        authorContainer.appendChild(document.createTextNode('  | '));
        authorContainer.appendChild(subscribers);

        const stats = document.createElement('div');
        stats.className  = 'yt-video-stats';

        const views = document.createElement('div');
        views.className  = 'yt-video-stat yt-video-views';
        views.innerHTML  = `${viewsIconSVG} ${videoInfo.viewCount  || 'N/A'} 次观看`;

        const likes = document.createElement('div');
        likes.className  = 'yt-video-stat yt-video-likes';
        likes.innerHTML  = `${likesIconSVG} ${videoInfo.likeCount  || 'N/A'} 个赞`;

        const date = document.createElement('div');
        date.className  = 'yt-video-stat yt-video-date';
        date.innerHTML  = `${dateIconSVG} ${formatDate(videoInfo.publishedAt)}`;

        stats.appendChild(views);
        stats.appendChild(likes);
        stats.appendChild(date);

        const actions = document.createElement('div');
        actions.className  = 'yt-video-actions';

        const watchBtn = document.createElement('a');
        watchBtn.className  = 'yt-watch-btn';
        watchBtn.href  = originalUrl;
        watchBtn.target  = '_blank';
        watchBtn.rel  = 'noopener noreferrer';
        watchBtn.innerHTML  = `${playIconSVG} 点我跳转`;

        const copyBtn = createCopyButton(originalUrl);

        actions.appendChild(watchBtn);
        actions.appendChild(copyBtn);

        card.appendChild(title);
        card.appendChild(playerContainer);
        card.appendChild(authorContainer);
        card.appendChild(stats);
        card.appendChild(actions);

        return card;
    }

    // 检查dialog是否发生变化
    function handleDialogChange(dialog) {
        if (!dialog || dialog === currentDialog) return false;

        // 新的dialog出现，重置缓存
        processedVideoIds.clear();
        currentDialog = dialog;
        console.log(' 检测到新的dialog，已重置视频ID缓存');
        return true;
    }

    // 主处理函数
    async function processYouTubeLinks() {
        const dialog = document.querySelector(DIALOG_SELECTOR);
        if (!dialog) return;

        // 检查dialog是否变化
        const isNewDialog = handleDialogChange(dialog);

        const links = Array.from(dialog.querySelectorAll(VIDEO_LINK_SELECTOR))
            .map(link => link.href)
            .filter(href => href.includes('youtube.com/watch'));

        console.log(' 获取到的链接元素:', links);

        const uniqueVideoIds = getUniqueVideoIds(links);
        if (uniqueVideoIds.size  === 0) return;

        // 如果是新dialog或者有新的视频ID才处理
        const newVideoIds = Array.from(uniqueVideoIds).filter(([videoId])  => {
            if (processedVideoIds.has(videoId))  {
                console.log(` 跳过已处理的视频ID: ${videoId}`);
                return false;
            }
            processedVideoIds.add(videoId);
            return true;
        });

        if (newVideoIds.length  === 0 && !isNewDialog) {
            console.log(' 没有新的唯一视频ID需要处理');
            return;
        }

        const panel = getControlPanel();
        panel.style.display  = 'block';
        panel.classList.add('visible');
        await displayVideoCards(panel, newVideoIds.length  > 0 ? newVideoIds : Array.from(uniqueVideoIds));
    }

    // 设置dialog观察者
    function setupDialogObserver(dialog) {
        if (dialogObserver) dialogObserver.disconnect();

        dialogObserver = new MutationObserver((mutations) => {
            const links = Array.from(dialog.querySelectorAll(VIDEO_LINK_SELECTOR))
                .map(link => link.href)
                .filter(href => href.includes('youtube.com/watch'));

            console.log(' 检测到的链接元素数量:', links.length);

            if (links.length  > 0) {
                processYouTubeLinks();
            }
        });

        dialogObserver.observe(dialog,  {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    // 初始化主观察者
    function initMainObserver() {
        if (mainObserver) mainObserver.disconnect();

        mainObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation  => {
                const hasDialog = Array.from(mutation.addedNodes).some(node  =>
                    node.nodeType  === Node.ELEMENT_NODE &&
                    (node.matches(DIALOG_SELECTOR)  || node.querySelector(DIALOG_SELECTOR))
                );

                if (hasDialog) {
                    const dialog = document.querySelector(DIALOG_SELECTOR);
                    if (dialog) {
                        setupDialogObserver(dialog);
                        processYouTubeLinks();
                    }
                }
            });
        });

        mainObserver.observe(document.body,  {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        initMainObserver();

        // 初始检查
        const dialog = document.querySelector(DIALOG_SELECTOR);
        if (dialog) {
            setupDialogObserver(dialog);
            setTimeout(() => processYouTubeLinks(), 500);
        }
    }

    // 启动脚本
    init();
})();
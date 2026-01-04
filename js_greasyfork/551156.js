// ==UserScript==
// @name         爱发电图片批量下载器
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  自动滚动收集爱发电公开帖子图片/媒体链接，等加载完保存JSON并下载（仅限公开内容，遵守网站条款）
// @author       vifdi (by Grok4 Fast)
// @match        https://afdian.com/*
// @match        https://afdian.net/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551156/%E7%88%B1%E5%8F%91%E7%94%B5%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551156/%E7%88%B1%E5%8F%91%E7%94%B5%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

/**
 * 爱发电图片批量下载
 * 
 * 用途：辅助用户在爱发电网站自动滚动加载公开帖子，收集图片/音频/视频链接，保存为JSON文档，并下载到自定义文件夹。
 * 仅支持公开内容（有权限的帖子），不绕过付费墙。
 * 
 * 警告：
 * - 此脚本仅供个人学习/使用，严禁用于商业或非法目的。
 * - 使用前确保遵守爱发电服务条款（https://afdian.net/terms），勿滥用导致账号封禁。
 * - 作者不承担任何法律/道德责任。
 * 
 * MIT License: https://opensource.org/licenses/MIT
 */

(function() {
    'use strict';
    
    // 创建浮动按钮
    let floatButton = document.createElement("button");
    floatButton.textContent = "启动自动收集";
    floatButton.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; z-index: 9999;
        padding: 10px 20px; font-size: 1rem; color: #fff; background: #007bff;
        border: none; border-radius: 5px; cursor: pointer;
    `;
    document.body.appendChild(floatButton);

    let autoScrolling = false;
    let lastXHRTime = Date.now();
    let allLinks = []; // 全收集：[{title, pics: [{url, filename}]}]
    let uniquePosts = new Set(); // 去重post_id
    let totalPics = 0;
    let hasMore = true;
    let scrollCheck = 0;
    let rootFolder = ''; // 自定义根文件夹

    floatButton.addEventListener('click', function() {
        if (!autoScrolling) {
            // 弹出输入框自定义根文件夹
            rootFolder = prompt("输入根文件夹名 (默认: afdian_public_dump):", "afdian_public_dump") || "afdian_public_dump";
            rootFolder = rootFolder.replace(/[/\\:*?"<>|]/g, '_'); // 转义非法字符

            this.textContent = "停止收集";
            this.style.background = "#28a745"; // 绿色运行中
            autoScrolling = true;
            allLinks = [];
            uniquePosts.clear();
            totalPics = 0;
            hasMore = true;
            scrollCheck = 0;
            autoScroll();
        } else {
            this.textContent = "启动自动收集";
            this.style.background = "#007bff";
            autoScrolling = false;
        }
    });

    function autoScroll() {
        if (autoScrolling) {
            const prevHeight = document.body.scrollHeight;
            // 渐进滚动：模拟用户行为，避免检测
            window.scrollTo(0, document.body.scrollHeight);
            setTimeout(() => {
                if (document.body.scrollHeight === prevHeight && Date.now() - lastXHRTime > 4000 && !hasMore) {
                    scrollCheck++;
                    if (scrollCheck >= 3) { // 稳定3次=全加载
                        console.log("全公开帖子加载完成，开始保存JSON+下载");
                        saveAndDownloadAll();
                        autoScrolling = false;
                        floatButton.textContent = "收集完成";
                        return;
                    }
                } else {
                    scrollCheck = 0;
                }
                setTimeout(autoScroll, 1500); // 1.5s间隔，平衡速度与安全
            }, 800);
        }
    }

    // 双重劫持XHR+Fetch
    function detectRequests() {
        // XHR
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener('load', function() {
                if (this.responseURL && this.responseURL.includes("/api/post/get-list")) {
                    lastXHRTime = Date.now();
                    try {
                        const responseData = JSON.parse(this.responseText);
                        hasMore = responseData.data?.has_more || false;
                        handleResponseData(responseData);
                    } catch (e) {
                        console.error("XHR解析失败: ", e);
                    }
                }
            });
            return originalXHROpen.apply(this, arguments);
        };

        // Fetch
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then(response => {
                const url = args[0];
                if (url && url.includes("/api/post/get-list")) {
                    lastXHRTime = Date.now();
                    return response.clone().text().then(text => {
                        try {
                            const responseData = JSON.parse(text);
                            hasMore = responseData.data?.has_more || false;
                            handleResponseData(responseData);
                        } catch (e) {
                            console.error("Fetch解析失败: ", e);
                        }
                        return response;
                    });
                }
                return response;
            });
        };
    }

    function handleResponseData(data) {
        const list = data.data?.list || [];
        list.forEach((item) => {
            const postId = item.post_id;
            // 开源合法：只处理有权限的公开帖
            if (item.has_right_errMsg !== null || uniquePosts.has(postId)) return;
            uniquePosts.add(postId);

            // 无title用content作为文件夹名（截取50字符）
            let title = item.title || (item.content ? item.content.substring(0, 50) : `post_${postId}`);
            title = title.replace(/[/\\:*?"<>|]/g, '_');

            const pics = item.pics || [];
            console.log(`收集公开帖子: ${title}, ${pics.length} 张图片`);

            allLinks.push({
                title,
                pics: pics.map((url, idx) => {
                    const ext = url.split('.').pop().split('?')[0] || 'jpg';
                    return { url, filename: `${title}_${idx + 1}.${ext}` };
                })
            });
            totalPics += pics.length;

            // 支持audio/video
            if (item.audio) allLinks[allLinks.length - 1].audio = { url: item.audio, filename: `${title}_audio.mp3` };
            if (item.video) allLinks[allLinks.length - 1].video = { url: item.video, filename: `${title}_video.mp4` };
        });
        floatButton.textContent = `收集中: ${totalPics} 张 (剩余: ${hasMore ? '有' : '无'})`;
    }

    function saveAndDownloadAll() {
        try {
            // 保存JSON到根
            const jsonData = JSON.stringify(allLinks, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const blobUrl = URL.createObjectURL(blob);
            GM_download({
                url: blobUrl,
                name: `${rootFolder}/afdian_public_links.json`,
                saveAs: false
            });
            console.log(`JSON文档保存完成 (根: ${rootFolder})`);

            // 批量下载到根/子文件夹
            allLinks.forEach(post => {
                const subFolder = `${rootFolder}/${post.title}`;
                post.pics?.forEach(pic => {
                    GM_download({
                        url: pic.url,
                        name: `${subFolder}/${pic.filename}`,
                        saveAs: false
                    });
                });
                if (post.audio) {
                    GM_download({
                        url: post.audio.url,
                        name: `${subFolder}/${post.audio.filename}`,
                        saveAs: false
                    });
                }
                if (post.video) {
                    GM_download({
                        url: post.video.url,
                        name: `${subFolder}/${post.video.filename}`,
                        saveAs: false
                    });
                }
            });
            console.log(`批量下载启动: ${totalPics} 张图片 + 其他 (仅公开内容)`);
        } catch (e) {
            console.error("下载过程出错: ", e);
            alert("下载出错，请检查控制台");
        }
    }

    detectRequests();
    console.log("爱发电图片批量下载 加载完成 - 仅公开内容，遵守条款");
})();
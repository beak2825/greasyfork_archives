// ==UserScript==
// @name         Bangumi-topic-ShareCard
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  使用 GreasyFork 认可的 JSDelivr 源，支持 AI 标签、链接展示
// @author       Bangumi_0809_Mewtw0
// @match        *://bgm.tv/group/topic/*
// @match        *://bangumi.tv/group/topic/*
// @match        *://chii.in/group/topic/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559776/Bangumi-topic-ShareCard.user.js
// @updateURL https://update.greasyfork.org/scripts/559776/Bangumi-topic-ShareCard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区 =================
    const AI_CONFIG = {
        apiUrl: "在此处填入你的_API_URL",
        apiKey: "在此处填入你的_API_KEY",
        model: "gpt-3.5-turbo",
    };
    // =========================================

    // 用于存储当前活动的overlay元素
    let currentOverlay = null;

    const style = document.createElement('style');
    style.innerHTML = `
        #bgm-share-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); display: none; justify-content: center;
            align-items: center; z-index: 100000;
            cursor: pointer; /* 添加指针样式提示可点击 */
        }

        /* 添加关闭按钮 */
        .close-overlay-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100001;
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
        }

        .close-overlay-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
        }

        .share-card {
            width: 420px; background: rgba(40, 40, 40, 0.85); border-radius: 20px; overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            box-shadow: 0 25px 60px rgba(0,0,0,0.5);
            /* 毛玻璃核心样式 */
            background: rgba(40, 40, 40, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px); /* Safari 支持 */
            cursor: default; /* 卡片本身恢复默认光标 */
        }

        .card-top-bar { height: 0px; background: #F09199; }

        .card-header {
            padding: 25px 25px 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            text-align: left;
            /* 添加以下确保居中更准确 */
            position: relative;
            /* 毛玻璃核心样式 */
            background: rgba(40, 40, 40, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backup-filter: blur(10px); /* Safari 支持 */
            border-bottom: 1px solid #fff; /* 添加白色实线分界线 */
        }

        .avatar-img {
            width: 54px;
            height: 54px;
            border-radius: 12px;
            background: #eee;
            background-size: cover;
            background-position: center;
            border: 1px solid #f0f0f0;
            flex-shrink: 0;
            /* 确保自身垂直居中 */
            position: relative;
            top: 0;
            transform: translateY(0);
        }

        .user-meta {
            text-align: left;
            /* 使用flex让内部元素垂直居中 */
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 54px; /* 与头像同高 */
            padding: 0; /* 移除内边距 */
        }

        .user-meta .name {
            display: block;
            font-weight: bold;
            color: #F09199;
            font-size: 17px;
            line-height: 1.2;
            margin: 0; /* 清除默认margin */
            padding: 0;
        }

        .user-meta .time {
            font-size: 12px;
            color: #aaa;
            margin-top: 4px;
            display: block;
            padding: 0;
        }


        .card-body { padding: 15px 25px 25px; text-align: left;

        /* 毛玻璃核心样式 */
        background: rgba(40, 40, 40, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px); /* Safari 支持 */
        }
        .main-title { font-size: 20px; color: #fff; margin: 0 0 15px 0; line-height: 1.5; font-weight: 800; }

        .content-box {
            background: #262626;
            padding: 20px;
            border-radius: 12px;
            position: relative; /* 为伪元素定位做准备 */
        }

        .content-box.hover-visible,
        .content-box:hover {
            /* 移除之前的边框效果 */
        }

        .content-box.hover-visible::after,
        .content-box:hover::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 1px solid #F09199;
            border-radius: 12px;
            pointer-events: none; /* 确保伪元素不干扰鼠标事件 */
            z-index: 1;
        }

        .content-text { font-size: 14px; color: #fff; line-height: 1.8; margin: 0; white-space: pre-wrap; word-break: break-all; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
        .tag-item { background: #FEEFF0; color: #F09199; font-size: 3px; padding: 6px 12px; border-radius: 20px; font-weight: Bold; border: 1px solid #F0919944; }
        .card-footer { background: rgba(40, 40, 40, 0.85); padding: 20px 25px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #fff; }
        .qr-img { width: 55px; height: 55px; background: rgba(40, 40, 40, 0.85); }
        #loading-info { position: fixed; top: 55%; left: 50%; transform: translateX(-50%); color: #fff; font-size: 14px; z-index: 100001; }
        .copy-success {
            position: fixed; top: 20px; right: 20px; background: #4CAF50;
            color: white; padding: 12px 20px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100002;
            font-size: 14px; font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // 全局点击事件监听器
    function setupGlobalClickHandler() {
        document.addEventListener('click', function(event) {
            // 如果当前没有活动的overlay，直接返回
            if (!currentOverlay || currentOverlay.style.display !== 'flex') {
                return;
            }

            // 检查点击的是否是overlay本身（而不是卡片内容）
            if (event.target === currentOverlay ||
                event.target.classList.contains('close-overlay-btn')) {
                removeOverlay();
            }
        });

        // ESC键也可以关闭overlay
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && currentOverlay && currentOverlay.style.display === 'flex') {
                removeOverlay();
            }
        });
    }

    // 移除overlay的函数
    function removeOverlay() {
        if (currentOverlay) {
            currentOverlay.remove();
            currentOverlay = null;
        }
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function fetchAsBase64(url) {
        return new Promise((resolve) => {
            if (!url) { resolve(""); return; }
            const finalUrl = url.startsWith('//') ? 'https:' + url : url;
            GM_xmlhttpRequest({
                method: "GET", url: finalUrl, responseType: "blob",
                onload: (res) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(res.response);
                },
                onerror: () => resolve("")
            });
        });
    }

    function showCopySuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'copy-success';
        successDiv.textContent = '✓ 图片已复制到剪贴板！';
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 1000);
    }

    function fallbackDownload(canvas, overlay) {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Bangumi分享卡片_${new Date().getTime()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 显示下载提示
        const downloadDiv = document.createElement('div');
        downloadDiv.className = 'copy-success';
        downloadDiv.textContent = '✓ 图片已保存到本地！';
        downloadDiv.style.background = '#2196F3';
        document.body.appendChild(downloadDiv);

        // 10秒后移除提示
        setTimeout(() => {
            downloadDiv.remove();
        }, 1000);
    }

    async function getAITags(title, content) {
        if (!AI_CONFIG.apiKey || AI_CONFIG.apiKey.includes("填入")) return ["话题", "讨论", "Bangumi"];
        return new Promise((resolve) => {
            const prompt = `根据标题和内容生成3个短标签，只要标签名，空格隔开。内容：${title} ${content.substring(0, 150)}`;
            GM_xmlhttpRequest({
                method: "POST", url: AI_CONFIG.apiUrl,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${AI_CONFIG.apiKey}` },
                data: JSON.stringify({ model: AI_CONFIG.model, messages: [{ role: "user", content: prompt }], temperature: 0.5 }),
                onload: (res) => {
                    try {
                        const tags = JSON.parse(res.responseText).choices[0].message.content.trim().split(/\s+/).slice(0, 3);
                        resolve(tags);
                    } catch (e) { resolve(["话题", "讨论", "Bangumi"]); }
                },
                onerror: () => resolve(["话题", "讨论", "Bangumi"])
            });
        });
    }

    async function createShareImage() {
        if (typeof html2canvas === 'undefined') {
            alert("截图库加载失败，请刷新页面或检查网络。");
            return;
        }

        const loading = document.createElement('div');
        loading.innerHTML = '<div id="bgm-share-overlay" style="display:flex"><div id="loading-info">AI 正在提炼标签...</div></div>';
        document.body.appendChild(loading);

        const idNode = getElementByXpath("/html/body/div[1]/div[2]/div[1]/div[1]/div[2]/div[2]/strong/a");
        const username = idNode ? idNode.innerText.trim() : "未知用户";
        const timeNode = getElementByXpath("/html/body/div[1]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/small");
        let postTime = timeNode ? (timeNode.innerText.match(/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}/)?.[0] || "未知时间") : "未知时间";

        const h1Node = document.querySelector('#pageHeader h1') || document.querySelector('h1');
        let pureTitle = "";
        if (h1Node) h1Node.childNodes.forEach(n => { if (n.nodeType === 3) pureTitle += n.textContent; });
        pureTitle = pureTitle.replace(/[»\n]/g, '').trim() || "分享话题";

        const masterPost = document.querySelector('.postTopic') || document.querySelector('[id^="post_"]');
        let fullContent = (masterPost?.querySelector('.topic_content') || masterPost?.querySelector('.inner'))?.innerText?.trim() || "";
        let displayContent = fullContent.length > 300 ? fullContent.substring(0, 300) + "..." : fullContent;

        const avatarBox = masterPost?.querySelector('.avatarSize48');
        let avatarUrl = avatarBox ? window.getComputedStyle(avatarBox).backgroundImage.replace(/url\(["']?([^"']+)["']?\)/, '$1') : "";

        const currentFullUrl = window.location.origin + window.location.pathname;
        const displayUrl = currentFullUrl.replace(/^https?:\/\//, '');

        const [tags, base64Avatar, base64QR] = await Promise.all([
            getAITags(pureTitle, fullContent),
            fetchAsBase64(avatarUrl),
            fetchAsBase64(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentFullUrl)}&color=F09199&bgcolor=262626`)
        ]);

        const tagsHtml = tags.map(tag => `<span class="tag-item">#${tag}</span>`).join('');
        loading.remove();

        const overlay = document.createElement('div');
        overlay.id = 'bgm-share-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <button class="close-overlay-btn" title="关闭">×</button>
            <div id="capture-area" style="padding: 2px; background: transparent;">
                <div class="share-card">
                    <div class="card-top-bar"></div>
                    <div class="card-header">
                        <img class="avatar-img" src="${base64Avatar}">
                        <div class="user-meta">
                            <span class="name">${username}</span>
                            <span class="time">${postTime}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h1 class="main-title">${pureTitle}</h1>
                        <div class="content-box"><p class="content-text">${displayContent}</p></div>
                        <div class="tags-container">${tagsHtml}</div>
                    </div>
                    <div class="card-footer">
                        <div style="text-align:left">
                            <div style="font-size:14px; font-weight:bold; color:#f09199">Bangumi 番组计划</div>
                            <div style="font-size:10px; color:#fff; margin-top:2px;">${displayUrl}</div>
                        </div>
                        <img class="qr-img" src="${base64QR}">
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // 设置当前活动的overlay
        currentOverlay = overlay;

        setTimeout(async () => {
            const captureArea = document.querySelector('#capture-area');
            if (!captureArea) return;

            // 添加 hover 类用于截图
            const contentBox = captureArea.querySelector('.content-box');
            if (contentBox) {
                contentBox.classList.add('hover-visible');
            }

            // 等待样式应用
            await new Promise(resolve => setTimeout(resolve, 50));

            const canvas = await html2canvas(captureArea, {
                scale: 2,
                backgroundColor: null,  // 改为透明背景
                useCORS: true,
                logging: false
            });

            // 截图完成后移除 hover 类
            if (contentBox) {
                contentBox.classList.remove('hover-visible');
            }

            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);

                    showCopySuccess();

                } catch (err) {
                    console.log('使用Clipboard API复制失败，尝试备选方案:', err);
                    fallbackDownload(canvas, overlay);
                }
            }, 'image/png');
        }, 800);
    }

    function insertButton() {
        const containerXpath = "/html/body/div[1]/div[2]/div[1]/div[1]/div[2]/div[2]/div[2]";
        const container = getElementByXpath(containerXpath);
        if (container && !document.getElementById('gen-card-btn')) {
            const btn = document.createElement('a');
            btn.id = 'gen-card-btn';
            btn.href = "javascript:void(0);";
            btn.className = 'chiiBtn';
            btn.style.backgroundColor = "transparent";
            btn.style.color = "#F09199";
            btn.style.marginLeft = "10px";
            btn.style.marginBottom = "-10px";
            btn.style.padding = "1px 10px";
            btn.style.borderRadius = "16px";
            btn.style.display = "inline-block";
            btn.style.verticalAlign = "middle";
            btn.innerHTML = '<span>生成分享卡片</span>';
            container.appendChild(btn);
            btn.addEventListener('click', createShareImage);
        }
    }

    // 初始化全局事件监听器
    setupGlobalClickHandler();

    // 等待页面加载完成后插入按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertButton);
    } else {
        setTimeout(insertButton, 500);
    }
})();
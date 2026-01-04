// ==UserScript==
// @name         Bangumi 分享卡片
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  使用 GreasyFork 认可的 JSDelivr 源，支持 AI 标签、链接展示
// @author       Chang ji
// @match        *://bgm.tv/group/topic/*
// @match        *://bangumi.tv/group/topic/*
// @match        *://chii.in/group/topic/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559721/Bangumi%20%E5%88%86%E4%BA%AB%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/559721/Bangumi%20%E5%88%86%E4%BA%AB%E5%8D%A1%E7%89%87.meta.js
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

    const style = document.createElement('style');
    style.innerHTML = `
        #bgm-share-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.85); display: none; justify-content: center;
            align-items: center; z-index: 100000;
        }
        .share-card {
            width: 420px; background: #fff; border-radius: 20px; overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }
        .card-top-bar { height: 6px; background: #F09199; }
        .card-header { padding: 25px 25px 15px; display: flex; align-items: center; gap: 15px; text-align: left; }
        .avatar-img { width: 54px; height: 54px; border-radius: 12px; background: #eee; background-size: cover; background-position: center; border: 1px solid #f0f0f0; flex-shrink: 0; }
        .user-meta { text-align: left; }
        .user-meta .name { display: block; font-weight: bold; color: #F09199; font-size: 17px; line-height: 1.2; }
        .user-meta .time { font-size: 12px; color: #aaa; margin-top: 4px; display: block; }
        .card-body { padding: 0 25px 25px; text-align: left; }
        .main-title { font-size: 20px; color: #111; margin: 0 0 15px 0; line-height: 1.5; font-weight: 800; }
        .content-box { background: #fdfafb; padding: 18px; border-radius: 12px; border-left: 5px solid #F09199; }
        .content-text { font-size: 14px; color: #333; line-height: 1.8; margin: 0; white-space: pre-wrap; word-break: break-all; }
        .tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 15px; }
        .tag-item { background: #FEEFF0; color: #F09199; font-size: 11px; padding: 4px 12px; border-radius: 20px; font-weight: bold; border: 1px solid #F0919944; }
        .card-footer { background: #f9f9f9; padding: 20px 25px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; }
        .qr-img { width: 55px; height: 55px; background: #fff; }
        #loading-info { position: fixed; top: 55%; left: 50%; transform: translateX(-50%); color: #fff; font-size: 14px; z-index: 100001; }
    `;
    document.head.appendChild(style);

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
            fetchAsBase64(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentFullUrl)}`)
        ]);

        const tagsHtml = tags.map(tag => `<span class="tag-item"># ${tag}</span>`).join('');
        loading.remove();

        const overlay = document.createElement('div');
        overlay.id = 'bgm-share-overlay';
        overlay.style.display = 'flex';
        overlay.innerHTML = `
            <div id="capture-area" style="padding: 30px; background: transparent;">
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
                            <div style="font-size:14px; font-weight:bold; color:#555">Bangumi 番组计划</div>
                            <div style="font-size:10px; color:#aaa; margin-top:2px;">${displayUrl}</div>
                        </div>
                        <img class="qr-img" src="${base64QR}">
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        setTimeout(async () => {
            const canvas = await html2canvas(document.querySelector('#capture-area'), { scale: 2, backgroundColor: null, useCORS: true });
            const link = document.createElement('a');
            link.download = `BGM_Share_${username}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            overlay.remove();
        }, 800);
    }

    const insertButton = () => {
        const containerXpath = "/html/body/div[1]/div[2]/div[1]/div[1]/div[2]/div[2]/div[2]";
        const container = getElementByXpath(containerXpath);
        if (container && !document.getElementById('gen-card-btn')) {
            const btn = document.createElement('a');
            btn.id = 'gen-card-btn';
            btn.href = "javascript:void(0);";
            btn.className = 'chiiBtn';
            btn.style.backgroundColor = "#F09199";
            btn.style.color = "#fff";
            btn.style.marginLeft = "10px";
            btn.style.padding = "2px 10px";
            btn.style.borderRadius = "4px";
            btn.style.display = "inline-block";
            btn.style.verticalAlign = "middle";
            btn.innerHTML = '<span>生成分享卡片</span>';
            container.appendChild(btn);
            btn.addEventListener('click', createShareImage);
        }
    };

    setTimeout(insertButton, 500);
})();
// ==UserScript==
// @name         Discourse 原生 Markdown 复制
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  修复脚本图标不显示问题 + 更新按钮 SVG + 优化域名匹配。强制将复制按钮放在“点赞”按钮的左边！
// @author       You & LeonShaw (Remixed)
// @match        *://*/*
// @match        https://meta.discourse.org/t/*
// @match        https://qingju.me/t/*
// @match        https://idcflare.com/t/*
// @match        https://nodeloc.cc/t/*
// @match        https://meta.appinn.net/t/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIHY3LjEuMCBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIENvcHlyaWdodCAyMDI2IEZvbnRpY29ucywgSW5jLi0tPjxwYXRoIGQ9Ik01OTMuOCA1OS4xbC01NDcuNiAwQzIwLjcgNTkuMSAwIDc5LjggMCAxMDUuMkwwIDQwNi43YzAgMjUuNSAyMC43IDQ2LjIgNDYuMiA0Ni4ybDU0Ny43IDBjMjUuNSAwIDQ2LjItMjAuNyA0Ni4xLTQ2LjFsMC0zMDEuNmMwLTI1LjQtMjAuNy00Ni4xLTQ2LjItNDYuMXpNMzM4LjUgMzYwLjZsLTYxLjUgMCAwLTEyMC02MS41IDc2LjktNjEuNS03Ni45IDAgMTIwLTYxLjcgMCAwLTIwOS4yIDYxLjUgMCA2MS41IDc2LjkgNjEuNS03Ni45IDYxLjUgMCAwIDIwOS4yIC4yIDB6bTEzNS4zIDMuMWwtOTIuMy0xMDcuNyA2MS41IDAgMC0xMDQuNiA2MS41IDAgMCAxMDQuNiA2MS41IDAtOTIuMiAxMDcuN3oiLz48L3N2Zz4=
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563018/Discourse%20%E5%8E%9F%E7%94%9F%20Markdown%20%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/563018/Discourse%20%E5%8E%9F%E7%94%9F%20Markdown%20%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 0. 检测是否为 Discourse
    const isDiscourse = document.querySelector('meta[name="generator"][content*="Discourse"]') || window.Discourse;
    if (!isDiscourse) return;

    console.log('✅ [Discourse Copy] 脚本启动...');

    // 1. API 核心逻辑
    async function fetchRawContent(topicId, postNumber) {
        return new Promise((resolve, reject) => {
            const url = `${window.location.origin}/raw/${topicId}/${postNumber}`;
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) resolve(response.responseText);
                    else reject(`HTTP ${response.status}`);
                },
                onerror: reject
            });
        });
    }

    function fixUploadLinks(rawText) {
        const baseUrl = window.location.origin;
        return rawText.replace(/upload:\/\/([a-zA-Z0-9\-_.～]+)/g, `${baseUrl}/uploads/short-url/$1`);
    }

    async function processAndCopy(postElement, postNumber) {
        let topicId = postElement.getAttribute('data-topic-id');
        if (!topicId) {
            const match = window.location.pathname.match(/\/t\/[^\/]+\/(\d+)/);
            if (match) topicId = match[1];
        }

        if (!topicId || !postNumber) {
            showToast("❌ 无法获取帖子信息", "error");
            return;
        }

        // 楼主链接去尾逻辑
        let postLink = `${window.location.origin}/t/${topicId}`;
        if (postNumber !== '1') {
            postLink += `/${postNumber}`;
        }
        const sourceAttribution = `\n\n转载自：${postLink}`;

        showToast("⏳ 正在请求源码...", "info", 10000);

        try {
            let raw = await fetchRawContent(topicId, postNumber);
            raw = fixUploadLinks(raw);
            const mainTitle = document.querySelector('.fancy-title')?.innerText.trim() || "Untitled";

            let finalContent = postNumber !== '1'
                ? `> Re: ${mainTitle} (Floor ${postNumber})\n\n${raw}`
                : `# ${mainTitle}\n\n${raw}`;

            finalContent += sourceAttribution;

            GM_setClipboard(finalContent, 'text');
            showToast(`✅ 已复制 Floor ${postNumber}`);
        } catch (e) {
            console.error(e);
            showToast(`❌ 错误: ${e}`, "error");
        }
    }

    // 2. 界面注入逻辑
    // 更新了 SVG 代码：使用了您提供的 path，viewBox 改为 1024 1024，并去除了 fill 颜色，由 CSS 控制
    const COPY_SVG_PATH = `<svg class="fa d-icon svg-icon" viewBox="0 0 1024 1024" width="16" height="16" style="pointer-events: none; fill: #888;">
        <path d="M895.318 192 128.682 192C93.008 192 64 220.968 64 256.616l0 510.698C64 802.986 93.008 832 128.682 832l766.636 0C930.992 832 960 802.986 960 767.312L960 256.616C960 220.968 930.992 192 895.318 192zM568.046 704l-112.096 0 0-192-84.08 107.756L287.826 512l0 192L175.738 704 175.738 320l112.088 0 84.044 135.96 84.08-135.96 112.096 0L568.046 704 568.046 704zM735.36 704l-139.27-192 84 0 0-192 112.086 0 0 192 84.054 0-140.906 192L735.36 704z"></path>
    </svg>`;

    function addCopyButtonToPost(node) {
        let actions = node.querySelector('.actions');
        if (!actions) {
            const nav = node.querySelector('nav.post-controls');
            if (nav) actions = nav.querySelector('.actions');
        }

        if (!actions || actions.querySelector('.discourse-universal-copy-btn')) return;

        const topicPost = actions.closest('.topic-post');
        if (!topicPost) return;

        const article = topicPost.querySelector('article');
        if (!article) return;

        let postNumber = article.getAttribute('data-post-number');
        if (!postNumber && article.id && article.id.startsWith('post_')) {
            postNumber = article.id.split('_')[1];
        }

        if (!postNumber) return;

        const btn = document.createElement('button');
        btn.className = 'widget-button btn no-text btn-icon icon btn-flat discourse-universal-copy-btn';
        btn.title = '复制原生 Markdown';
        btn.innerHTML = COPY_SVG_PATH;

        btn.style.cssText = `
            display: inline-flex !important;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
            visibility: visible !important;
            opacity: 1 !important;
        `;

        btn.onmouseenter = () => btn.querySelector('svg').style.fill = '#00aeff';
        btn.onmouseleave = () => btn.querySelector('svg').style.fill = '#888';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            processAndCopy(topicPost, postNumber);
        });

        // === 核心定位：点赞按钮之前 ===
        const likeButtonShim = actions.querySelector('.discourse-reactions-actions-button-shim');
        const likeButton = actions.querySelector('.reaction-button') || actions.querySelector('.like');

        if (likeButtonShim) {
            actions.insertBefore(btn, likeButtonShim);
        } else if (likeButton) {
             actions.insertBefore(btn, likeButton);
        } else {
            actions.prepend(btn);
        }
    }

    // 3. 巡逻机制
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.classList.contains('topic-post')) addCopyButtonToPost(node);
                    node.querySelectorAll && node.querySelectorAll('.topic-post').forEach(addCopyButtonToPost);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(() => {
        document.querySelectorAll('.topic-post').forEach(addCopyButtonToPost);
    }, 1000);

    // Toast
    function showToast(message, type = 'success', duration = 2000) {
        const existing = document.querySelector('.discourse-copy-toast');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'discourse-copy-toast';
        toast.textContent = message;
        const bgColor = type === 'error' ? '#d73a49' : (type === 'info' ? '#00aeff' : '#28a745');
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: bgColor, color: 'white', padding: '10px 20px',
            borderRadius: '5px', zIndex: '99999', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontSize: '14px', fontWeight: 'bold', transition: 'opacity 0.3s'
        });
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, duration);
    }

})();
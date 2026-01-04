// ==UserScript==
// @name         Discord 消息图片批量下载 One-Click pic download
// @namespace    https://greasyfork.org/zh-CN/users/1449730-%E4%BC%8A%E5%A2%A8
// @version      1.1
// @description  在 Discord 消息旁添加一个按钮，一键下载该条消息中的所有图片。
// @author       伊墨墨
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557205/Discord%20%E6%B6%88%E6%81%AF%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20One-Click%20pic%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/557205/Discord%20%E6%B6%88%E6%81%AF%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%20One-Click%20pic%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * ================= 配置区域 =================
     */
    const CONFIG = {
        // 原始链接特征 (适配 class="...-originalLink")
        SELECTOR_IMG_LINK: 'a[class*="originalLink"]',
        // 消息容器特征 (适配 class="...-messageListItem")
        SELECTOR_MSG_ITEM: 'li[class*="messageListItem"]',
        // 按钮组容器特征 (适配 class="...-buttonsInner")
        SELECTOR_BUTTON_GROUP: 'div[class*="buttonsInner"]',
        // 复制样式的参考按钮 (通常是转发或回复按钮)
        SELECTOR_REF_BUTTON: 'div[role="button"][aria-label]',
        // 按钮类名标记，防止重复添加
        BTN_CLASS_MARKER: 'discord-img-downloader-btn'
    };

    // 下载图标 SVG (简约风格)
    const DOWNLOAD_ICON_SVG = `
        <svg aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    `;

    /**
     * 工具：通过 Blob 下载文件
     */
    function downloadFile(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(link.href), 10000); // 释放内存
            })
            .catch(err => console.error('[Discord Downloader] Download failed:', err));
    }

    /**
     * 核心逻辑：解析链接并下载
     */
    function handleDownload(messageElement) {
        const links = messageElement.querySelectorAll(CONFIG.SELECTOR_IMG_LINK);
        if (!links || links.length === 0) return;

        console.log(`[Discord Downloader] Found ${links.length} images.`);

        links.forEach((link, index) => {
            // Discord 的原始链接通常在 href 中，或者在 data-role="img" 附近
            const rawUrl = link.href;
            let filename = "unknown.jpg";

            // 尝试从 URL 提取文件名
            try {
                const urlObj = new URL(rawUrl);
                const pathname = urlObj.pathname;
                filename = pathname.substring(pathname.lastIndexOf('/') + 1);
                // 清理可能存在的参数干扰
                if (filename.includes('?')) filename = filename.split('?')[0];
            } catch (e) {
                filename = `discord_img_${Date.now()}_${index}.jpg`;
            }

            // 错峰下载，避免浏览器短时间发起过多请求导致卡顿
            setTimeout(() => {
                downloadFile(rawUrl, filename);
            }, index * 250);
        });
    }

    /**
     * UI 逻辑：注入按钮
     */
    function injectButton(buttonGroup, messageElement) {
        if (buttonGroup.querySelector(`.${CONFIG.BTN_CLASS_MARKER}`)) return;

        // 尝试获取原生按钮的样式，以保持一致性
        const referenceBtn = buttonGroup.querySelector(CONFIG.SELECTOR_REF_BUTTON);
        let btnClass = '';
        let iconClass = '';

        if (referenceBtn) {
            btnClass = referenceBtn.className;
            // 新版 Discord 很多图标直接是 SVG，且类名包含 "icon"
            const refIcon = referenceBtn.querySelector('[class*="icon"]');
            if (refIcon) {
                // 如果是 SVG，直接取 class，如果是 div 包裹的，也取 class
                iconClass = refIcon.getAttribute('class') || '';
            }
        }

        // 创建按钮容器
        const myBtn = document.createElement('div');
        // 如果找不到参考样式，给一些基础样式防止只有文字
        myBtn.className = btnClass ? `${btnClass} ${CONFIG.BTN_CLASS_MARKER}` : `${CONFIG.BTN_CLASS_MARKER}`;
        if (!btnClass) {
            myBtn.style.display = 'flex';
            myBtn.style.alignItems = 'center';
            myBtn.style.justifyContent = 'center';
            myBtn.style.padding = '4px';
            myBtn.style.color = 'var(--interactive-normal)';
        }
        
        myBtn.setAttribute('role', 'button');
        myBtn.setAttribute('aria-label', '下载所有图片');
        myBtn.setAttribute('tabindex', '0');
        myBtn.style.cursor = 'pointer';

        // 准备 SVG 内容
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = DOWNLOAD_ICON_SVG;
        const svg = tempDiv.querySelector('svg');

        if(svg) {
            svg.style.width = "20px";
            svg.style.height = "20px";
            // 如果获取到了原生图标的类名，应用到我们的 SVG 上以保持颜色一致
            if (iconClass) {
                svg.setAttribute('class', iconClass); 
                // 移除原 SVG 可能自带的 fill/stroke，让 CSS 类接管颜色（通常是 currentColor）
                // 这里的 SVG 默认用了 currentColor，所以应该能自动适配主题
            }
            myBtn.appendChild(svg);
        } else {
            myBtn.innerText = "⬇️"; // Fallback
        }

        // 事件监听
        myBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDownload(messageElement);
        });
        
        // 鼠标悬停变色效果（如果 CSS 类没生效的话）
        myBtn.addEventListener('mouseenter', () => {
            myBtn.style.color = 'var(--interactive-hover)';
        });
        myBtn.addEventListener('mouseleave', () => {
            myBtn.style.color = btnClass ? '' : 'var(--interactive-normal)';
        });

        // 插入到工具栏最前方
        buttonGroup.insertBefore(myBtn, buttonGroup.firstChild);
    }

    /**
     * 扫描页面逻辑
     */
    function processMessages() {
        // 使用更新后的选择器
        const messages = document.querySelectorAll(CONFIG.SELECTOR_MSG_ITEM);
        messages.forEach(msg => {
            // 只有包含图片的原始链接时才添加按钮
            if (!msg.querySelector(CONFIG.SELECTOR_IMG_LINK)) return;

            const btnGroup = msg.querySelector(CONFIG.SELECTOR_BUTTON_GROUP);
            if (btnGroup) {
               injectButton(btnGroup, msg);
            }
        });
    }

    // 观察者模式：监听 DOM 变化以处理新加载的消息
    const observer = new MutationObserver((mutations) => {
        // 简单防抖：只有添加了节点才处理
        const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0);
        if (hasAddedNodes) {
            processMessages();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始运行
    setTimeout(processMessages, 1500);

})();
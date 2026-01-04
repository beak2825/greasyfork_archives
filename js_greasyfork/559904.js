// ==UserScript==
// @name         bigquant量化研报PDF下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为bigquant研报页面添加PDF原文下载按钮
// @author       doubao
// @match        https://bigquant.com/square/paper
// @icon         https://www.bigquant.com/favicon.ico
// @grant        GM_download
// @connect      bigquant.com
// @downloadURL https://update.greasyfork.org/scripts/559904/bigquant%E9%87%8F%E5%8C%96%E7%A0%94%E6%8A%A5PDF%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/559904/bigquant%E9%87%8F%E5%8C%96%E7%A0%94%E6%8A%A5PDF%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 下载链接前缀
    const DOWNLOAD_BASE_URL = 'https://bigquant.com/bigapis/file/v1/paperresearch/';
    // 下载链接后缀
    const DOWNLOAD_SUFFIX = '/document';

    // 样式：美化下载按钮
    const buttonStyle = `
        padding: 4px 8px;
        margin-left: 8px;
        background: #409eff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
    `;
    const buttonHoverStyle = `
        background: #66b1ff;
    `;

    /**
     * 提取URL中的UUID
     * @param {string} url - 研报详情页URL
     * @returns {string|null} UUID
     */
    function extractUUID(url) {
        const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
        const match = url.match(uuidRegex);
        return match ? match[0] : null;
    }

    /**
     * 创建下载按钮
     * @param {string} uuid - 研报UUID
     * @returns {HTMLButtonElement} 下载按钮
     */
    function createDownloadButton(uuid) {
        const button = document.createElement('button');
        button.textContent = '下载PDF';
        button.style = buttonStyle;
        button.dataset.uuid = uuid;

        // 鼠标悬停样式
        button.addEventListener('mouseover', () => {
            button.style = buttonStyle + buttonHoverStyle;
        });
        button.addEventListener('mouseout', () => {
            button.style = buttonStyle;
        });

        // 点击下载
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const downloadUrl = DOWNLOAD_BASE_URL + uuid + DOWNLOAD_SUFFIX;
            try {
                // 使用GM_download下载（需要油猴授权）
                GM_download({
                    url: downloadUrl,
                    name: `研报_${uuid}.pdf`,
                    saveAs: true
                });
            } catch (err) {
                // 备用方案：新开标签页
                window.open(downloadUrl, '_blank');
                alert('自动下载失败，已为您打开下载页面');
            }
        });

        return button;
    }

    /**
     * 为研报条目添加下载按钮
     */
    function addDownloadButtons() {
        // 定位研报链接元素（根据页面实际结构调整选择器）
        const paperLinks = document.querySelectorAll('a[href*="/square/paper/"]');
        paperLinks.forEach(link => {
            // 避免重复添加按钮
            if (link.nextElementSibling?.classList.contains('paper-download-btn')) return;

            const uuid = extractUUID(link.href);
            if (!uuid) return;

            const button = createDownloadButton(uuid);
            button.classList.add('paper-download-btn');
            // 将按钮插入到链接后方
            link.parentNode.insertBefore(button, link.nextSibling);
        });
    }

    // 初始化执行
    addDownloadButtons();

    // 监听DOM变化，处理动态加载的研报
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                addDownloadButtons();
            }
        });
    });

    // 启动观察者（监听页面主体内容变化）
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
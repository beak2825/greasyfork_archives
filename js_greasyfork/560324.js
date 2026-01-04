// ==UserScript==
// @name         VS Code Extension Downloader
// @namespace    https://github.com/liu-dejin
// @version      0.1
// @description  VS Code 插件市场直接下载 .vsix 文件（最新版/历史版本）
// @author       liu-dejin
// @match        https://marketplace.visualstudio.com/items*
// @icon         https://code.visualstudio.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560324/VS%20Code%20Extension%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560324/VS%20Code%20Extension%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入样式
    const style = document.createElement('style');
    style.textContent = `
        .vscode-download-btn {
            display: inline-block;
            margin-left: 8px;
            padding: 2px 6px;
            background-color: #0078d4;
            color: #ffffff !important;
            text-decoration: none !important;
            border-radius: 2px;
            font-size: 11px;
            line-height: 14px;
            border: 1px solid #0078d4;
            cursor: pointer;
            vertical-align: middle;
            font-family: "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        .vscode-download-btn:hover {
            background-color: #005a9e;
            border-color: #005a9e;
            color: #ffffff !important;
        }
    `;
    document.head.appendChild(style);

    // 获取插件信息
    function getExtensionDetails() {
        const params = new URLSearchParams(window.location.search);
        const itemName = params.get('itemName');
        if (!itemName) return null;

        const parts = itemName.split('.');
        if (parts.length < 2) return null;

        return { publisher: parts[0], name: parts[1] };
    }

    // 生成下载 URL
    function generateDownloadUrl(publisher, name, version) {
        return `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${name}/${version}/vspackage`;
    }

    // 获取页面上的最新版本号
    function getLatestVersion(details) {
        let version = null;
        const allElements = document.querySelectorAll('div, td, span, h3, h4');
        
        for (const el of allElements) {
            if (el.textContent.trim() === 'Version' && el.children.length === 0) {
                // 表格布局
                if (el.tagName === 'TD') {
                    const nextTd = el.nextElementSibling;
                    if (nextTd && /^\d+\.\d+\.\d+/.test(nextTd.textContent.trim())) {
                        version = nextTd.textContent.trim();
                        break;
                    }
                }
                
                // 兄弟元素布局
                const sibling = el.nextElementSibling;
                if (sibling && /^\d+\.\d+\.\d+/.test(sibling.textContent.trim())) {
                    version = sibling.textContent.trim();
                    break;
                }

                // 父元素的兄弟元素布局
                if (el.parentElement && el.parentElement.nextElementSibling) {
                    const uncle = el.parentElement.nextElementSibling;
                    const match = uncle.textContent.trim().match(/(\d+\.\d+\.\d+(\.\d+)?)/);
                    if (match) {
                        version = match[0];
                        break;
                    }
                }
            }
        }

        if (version) {
            return {
                version: version,
                url: generateDownloadUrl(details.publisher, details.name, version)
            };
        }
        return null;
    }

    // 添加最新版下载按钮
    function addLatestButton(details) {
        if (document.querySelector('.vscode-latest-download-btn')) return;

        const installBtn = Array.from(document.querySelectorAll('a, button')).find(el => 
            el.textContent.trim() === 'Install' || 
            (el.className && typeof el.className === 'string' && el.className.toLowerCase().includes('install'))
        );
        if (!installBtn) return;

        const troubleLink = Array.from(document.querySelectorAll('a')).find(el => 
            el.textContent.includes('Trouble Installing')
        );
        const targetContainer = troubleLink ? troubleLink.parentElement : installBtn.parentElement;
        
        const result = getLatestVersion(details);
        if (!result) return;

        const btn = document.createElement('a');
        btn.className = 'vscode-latest-download-btn';
        btn.textContent = `最新版 v${result.version}`;
        btn.href = result.url;
        btn.target = '_blank';
        btn.style.cssText = `
            display: inline-block;
            margin-left: 15px;
            color: #C0392B !important; 
            font-weight: bold;
            text-decoration: none !important;
            font-size: 14px;
            vertical-align: middle;
            border: 1px solid #C0392B;
            padding: 4px 10px;
            border-radius: 4px;
        `;
        btn.title = '直接下载最新版 .vsix 文件';

        if (troubleLink) {
            troubleLink.parentNode.insertBefore(btn, troubleLink.nextSibling);
        } else {
            targetContainer.appendChild(btn);
        }
    }

    // 处理页面逻辑
    function processPage() {
        const details = getExtensionDetails();
        if (!details) return;

        addLatestButton(details);

        // 处理版本历史列表
        const cells = document.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell.querySelector('a') || cell.querySelector('.vscode-download-link-processed')) return;

            const text = cell.textContent.trim();
            if (/^\d+\.\d+\.\d+(\.\d+)?$/.test(text) && text.length < 20) {
                const row = cell.closest('tr');
                if (!row) return;

                const downloadUrl = generateDownloadUrl(details.publisher, details.name, text);
                const link = document.createElement('a');
                
                link.href = downloadUrl;
                link.textContent = text;
                link.target = '_blank';
                link.title = `点击下载 v${text}`;
                link.style.cssText = `
                    color: #0078d4;
                    text-decoration: none;
                    font-weight: bold;
                    cursor: pointer;
                `;
                link.onclick = (e) => e.stopPropagation();

                cell.textContent = '';
                cell.appendChild(link);
                link.classList.add('vscode-download-link-processed');
            }
        });
    }

    // 初始化与监听
    processPage();

    const observer = new MutationObserver(() => processPage());
    observer.observe(document.body, { childList: true, subtree: true });

    setInterval(processPage, 2000);

})();

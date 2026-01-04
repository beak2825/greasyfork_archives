// ==UserScript==
// @name         EMA PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动识别并下载EMA网站上的PDF文件
// @author       You
// @license      MIT
// @match        https://www.ema.europa.eu/*
// @match        https://clinicaldata.ema.europa.eu/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/560920/EMA%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/560920/EMA%20PDF%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // PDF链接的共同特征
    const PDF_BASE_URL = 'https://clinicaldata.ema.europa.eu/documents/';
    const PDF_EXTENSION = '.pdf';
    
    // 存储已处理的链接，避免重复处理
    const processedLinks = new Set();

    // 下载PDF文件
    function downloadPDF(url) {
        if (!url || !url.includes(PDF_EXTENSION)) {
            console.error('Invalid PDF URL:', url);
            return;
        }
        
        // 从URL中提取文件名
        let fileName = url.split('/').pop().split('?')[0];
        
        // 确保文件名以.pdf结尾
        if (!fileName.endsWith(PDF_EXTENSION)) {
            fileName += PDF_EXTENSION;
        }
        
        console.log('Downloading PDF:', fileName, 'from', url);
        
        try {
            // 使用GM_download下载文件
            GM_download({
                url: url,
                name: fileName,
                saveAs: true,
                onerror: function(error) {
                    console.error('Download error:', error);
                    alert('下载失败: ' + error.error);
                },
                onload: function() {
                    console.log('Download completed:', fileName);
                }
            });
        } catch (error) {
            console.error('GM_download error:', error);
            alert('下载失败: ' + error.message);
        }
    }

    // 查找页面中的所有PDF链接，包括iframe中的
    function findAllPDFLinks() {
        const allLinks = [];
        
        // 查找当前页面中的链接
        const pageLinks = document.querySelectorAll('a[href]');
        pageLinks.forEach(link => {
            if (link.href.includes(PDF_BASE_URL) && link.href.includes(PDF_EXTENSION)) {
                allLinks.push(link);
            }
        });
        
        // 查找iframe中的链接
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeLinks = iframeDoc.querySelectorAll('a[href]');
                iframeLinks.forEach(link => {
                    if (link.href.includes(PDF_BASE_URL) && link.href.includes(PDF_EXTENSION)) {
                        allLinks.push(link);
                    }
                });
            } catch (error) {
                // 跨域iframe无法访问，忽略
            }
        });
        
        return allLinks;
    }

    // 处理PDF链接，添加下载功能
    function processPDFLinks() {
        const links = findAllPDFLinks();
        let newLinksCount = 0;
        
        links.forEach(link => {
            const linkUrl = link.href;
            if (!processedLinks.has(linkUrl)) {
                processedLinks.add(linkUrl);
                newLinksCount++;
                
                // 为链接添加下载功能
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    downloadPDF(this.href);
                });
                
                // 添加视觉提示
                link.style.color = '#00ff00';
                link.style.fontWeight = 'bold';
                link.title = '点击下载PDF';
                
                // 在链接旁边添加一个下载图标
                const downloadIcon = document.createElement('span');
                downloadIcon.textContent = ' 📥';
                downloadIcon.style.cursor = 'pointer';
                downloadIcon.title = '下载PDF';
                downloadIcon.addEventListener('click', function(e) {
                    e.stopPropagation();
                    downloadPDF(linkUrl);
                });
                link.appendChild(downloadIcon);
            }
        });
        
        if (newLinksCount > 0) {
            console.log('Found', newLinksCount, 'new PDF links, total processed:', processedLinks.size);
        }
    }
    
    // 创建下载按钮
    function createDownloadButton() {
        const button = document.createElement('button');
        button.textContent = '下载当前页面所有PDF';
        button.id = 'ema-pdf-download-btn';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        
        button.addEventListener('click', function() {
            const links = findAllPDFLinks();
            const pdfUrls = [...new Set(links.map(link => link.href))];
            
            if (pdfUrls.length === 0) {
                alert('未找到PDF文件');
                return;
            }
            
            if (confirm(`找到 ${pdfUrls.length} 个PDF文件，是否全部下载？`)) {
                pdfUrls.forEach(url => {
                    downloadPDF(url);
                });
            }
        });
        
        return button;
    }
    
    // 添加CSS样式
    GM_addStyle(`
        /* 下载按钮样式 */
        #ema-pdf-download-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        
        #ema-pdf-download-btn:hover {
            background-color: #45a049;
        }
        
        /* PDF链接样式 */
        a[href*="${PDF_BASE_URL}"][href*="${PDF_EXTENSION}"] {
            color: #00ff00 !important;
            font-weight: bold !important;
        }
    `);

    // 初始化函数
    function init() {
        // 添加上下载按钮
        const existingButton = document.getElementById('ema-pdf-download-btn');
        if (!existingButton) {
            const button = createDownloadButton();
            document.body.appendChild(button);
        }
        
        // 处理初始页面中的链接
        processPDFLinks();
    }

    // 监听页面加载完成
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // 监听页面动态内容变化
    const observer = new MutationObserver(function(mutations) {
        let hasNewContent = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                hasNewContent = true;
            }
        });
        
        if (hasNewContent) {
            processPDFLinks();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 检查当前页面URL是否为PDF链接
    if (window.location.href.includes(PDF_BASE_URL) && window.location.href.includes(PDF_EXTENSION)) {
        // 延迟下载，给页面足够时间加载
        setTimeout(() => {
            downloadPDF(window.location.href);
        }, 1000);
    }

})();
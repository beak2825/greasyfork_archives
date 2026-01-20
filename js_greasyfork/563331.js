// ==UserScript==
// @name         EMA PDF Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动识别并下载EMA网站上的PDF文件
// @author       longlong
// @license      MIT
// @match        https://www.ema.europa.eu/*
// @match        https://clinicaldata.ema.europa.eu/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563331/EMA%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/563331/EMA%20PDF%20Downloader.meta.js
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

    // 从JavaScript代码中提取PDF URL
    function extractPdfFromJs() {
        const pdfUrls = [];
        
        // 遍历所有script标签
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const content = script.textContent;
            if (content) {
                // 查找包含PDF_BASE_URL和PDF_EXTENSION的URL
                const regex = new RegExp(PDF_BASE_URL + '[^"\']*' + PDF_EXTENSION + '[^"\']*', 'g');
                const matches = content.match(regex);
                if (matches) {
                    matches.forEach(match => {
                        // 清理URL，移除可能的引号和其他字符
                        const cleanUrl = match.replace(/["\']/g, '');
                        pdfUrls.push(cleanUrl);
                    });
                }
            }
        });
        
        return [...new Set(pdfUrls)];
    }
    
    // 从WebViewer配置中提取PDF URL
    function extractPdfFromWebViewer() {
        const pdfUrls = [];
        
        // 查找包含WebViewer配置的script标签
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const content = script.textContent;
            if (content && content.includes('WebViewer')) {
                // 查找initialDoc配置
                const initialDocRegex = /initialDoc:\s*["\']([^"\']+)["\']/;
                const match = content.match(initialDocRegex);
                if (match && match[1] && match[1].includes(PDF_EXTENSION)) {
                    pdfUrls.push(match[1]);
                }
            }
        });
        
        return [...new Set(pdfUrls)];
    }
    
    // 查找页面中的所有PDF链接，包括iframe、JavaScript代码和WebViewer配置
    function findAllPDFLinks() {
        const allLinks = [];
        const processedUrls = new Set();
        
        // 1. 查找当前页面中的<a>标签链接
        const pageLinks = document.querySelectorAll('a[href]');
        pageLinks.forEach(link => {
            const href = link.href;
            if (href.includes(PDF_BASE_URL) && href.includes(PDF_EXTENSION) && !processedUrls.has(href)) {
                processedUrls.add(href);
                allLinks.push(link);
            }
        });
        
        // 2. 从JavaScript代码中提取PDF URL
        const jsPdfUrls = extractPdfFromJs();
        jsPdfUrls.forEach(url => {
            if (!processedUrls.has(url)) {
                processedUrls.add(url);
                allLinks.push({ href: url });
            }
        });
        
        // 3. 从WebViewer配置中提取PDF URL
        const webViewerPdfUrls = extractPdfFromWebViewer();
        webViewerPdfUrls.forEach(url => {
            if (!processedUrls.has(url)) {
                processedUrls.add(url);
                allLinks.push({ href: url });
            }
        });
        
        // 4. 查找iframe中的链接
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeLinks = iframeDoc.querySelectorAll('a[href]');
                iframeLinks.forEach(link => {
                    const href = link.href;
                    if (href.includes(PDF_BASE_URL) && href.includes(PDF_EXTENSION) && !processedUrls.has(href)) {
                        processedUrls.add(href);
                        allLinks.push(link);
                    }
                });
                
                // 尝试从iframe的src中提取PDF URL
                const iframeSrc = iframe.src;
                if (iframeSrc && iframeSrc.includes(PDF_BASE_URL) && iframeSrc.includes(PDF_EXTENSION) && !processedUrls.has(iframeSrc)) {
                    processedUrls.add(iframeSrc);
                    allLinks.push({ href: iframeSrc });
                }
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
                
                // 只对实际的DOM元素添加事件监听器和视觉样式
                if (link instanceof HTMLElement) {
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
            }
        });
        
        if (newLinksCount > 0) {
            console.log('Found', newLinksCount, 'new PDF links, total processed:', processedLinks.size);
        }
    }
    
    // 添加CSS样式
    GM_addStyle(`
        /* PDF链接样式 */
        a[href*="${PDF_BASE_URL}"][href*="${PDF_EXTENSION}"] {
            color: #00ff00 !important;
            font-weight: bold !important;
        }
        
        /* 下载按钮样式 */
        #ema-pdf-download-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            padding: 12px 24px;
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
    `);

    // 创建下载按钮
    function createDownloadButton() {
        // 检查是否已存在按钮
        if (document.getElementById('ema-pdf-download-btn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'ema-pdf-download-btn';
        button.textContent = '下载PDF';
        
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
        
        document.body.appendChild(button);
    }

    // 初始化函数
    function init() {
        // 处理初始页面中的链接
        processPDFLinks();
        // 创建下载按钮
        createDownloadButton();
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

// ==UserScript==
// @name         超星学习通PDF下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动检测超星学习通中的PDF文件并添加下载按钮
// @author       Hungry Shark
// @match        https://mooc1.chaoxing.com/*
// @match        https://*.chaoxing.com/*
// @icon         https://s1.chu0.com/src/img/png/df/df6f0a1cb5834e1499253980756986ce.png?e=2051020800&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:A8wAfloBVYeZ5nxCWRV3GRyerd8=
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      mooc1.chaoxing.com
// @connect      cldisk.com
// @connect      s3.cldisk.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555424/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9APDF%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/555424/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9APDF%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储检测到的PDF信息
    let pdfInfo = null;
    let checkInterval = null;

    // 创建下载按钮
    function createDownloadButton() {
        // 如果按钮已存在，先移除
        const existingButton = document.getElementById('pdf-download-btn');
        if (existingButton) {
            existingButton.remove();
        }

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'pdf-download-btn';
        downloadBtn.innerHTML = '📥 下载PDF';
        downloadBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        downloadBtn.addEventListener('mouseenter', function() {
            this.style.background = '#45a049';
            this.style.transform = 'scale(1.05)';
        });

        downloadBtn.addEventListener('mouseleave', function() {
            this.style.background = '#4CAF50';
            this.style.transform = 'scale(1)';
        });

        downloadBtn.addEventListener('click', downloadPDF);
        document.body.appendChild(downloadBtn);
    }

    // 下载PDF文件
    function downloadPDF() {
        if (!pdfInfo || !pdfInfo.pdf) {
            alert('未找到PDF文件链接');
            return;
        }

        const filename = pdfInfo.filename || 'download.pdf';
        const pdfFilename = filename.replace(/\.[^/.]+$/, "") + '.pdf';

        try {
            // 使用GM_download下载文件
            GM_download({
                url: pdfInfo.pdf,
                name: pdfFilename,
                onload: function() {
                    console.log('PDF下载成功:', pdfFilename);
                    showNotification('PDF下载成功！', 'success');
                },
                onerror: function(error) {
                    console.error('PDF下载失败:', error);
                    showNotification('PDF下载失败，请重试', 'error');

                    // 如果GM_download失败，尝试使用备用方法
                    fallbackDownload(pdfInfo.pdf, pdfFilename);
                }
            });
        } catch (e) {
            console.error('GM_download错误:', e);
            // 使用备用下载方法
            fallbackDownload(pdfInfo.pdf, pdfFilename);
        }
    }

    // 备用下载方法
    function fallbackDownload(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showNotification('正在打开PDF下载链接...', 'info');
    }

    // 显示通知
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10001;
            padding: 10px 15px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 监听XMLHttpRequest请求
    function interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...args]);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            this.addEventListener('load', function() {
                if (this._url && this._url.includes('/ananas/status/') && this.status === 200) {
                    try {
                        const response = JSON.parse(this.responseText);
                        if (response.pdf && response.status === 'success') {
                            console.log('检测到PDF文件:', response);
                            pdfInfo = response;
                            createDownloadButton();
                        }
                    } catch (e) {
                        console.log('解析响应失败:', e);
                    }
                }
            });
            return originalSend.apply(this, args);
        };
    }

    // 监听Fetch请求
    function interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then(response => {
                const url = args[0];
                if (typeof url === 'string' && url.includes('/ananas/status/')) {
                    response.clone().json().then(data => {
                        if (data.pdf && data.status === 'success') {
                            console.log('检测到PDF文件(Fetch):', data);
                            pdfInfo = data;
                            createDownloadButton();
                        }
                    }).catch(() => {});
                }
                return response;
            });
        };
    }

    // 定期检查页面中是否包含PDF链接
    function checkForPDFLinks() {
        // 检查iframe中的内容
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const links = iframeDoc.querySelectorAll('a[href*=".pdf"], embed[src*=".pdf"]');
                if (links.length > 0 && !pdfInfo) {
                    links.forEach(link => {
                        const pdfUrl = link.href || link.src;
                        if (pdfUrl.includes('.pdf')) {
                            pdfInfo = {
                                pdf: pdfUrl,
                                filename: pdfUrl.split('/').pop() || 'document.pdf'
                            };
                            createDownloadButton();
                        }
                    });
                }
            } catch (e) {
                // 跨域限制，无法访问iframe内容
            }
        });

        // 检查直接嵌入的PDF
        const embedPDF = document.querySelector('embed[type="application/pdf"]');
        if (embedPDF && embedPDF.src && !pdfInfo) {
            pdfInfo = {
                pdf: embedPDF.src,
                filename: 'embedded.pdf'
            };
            createDownloadButton();
        }
    }

    // 初始化
    function init() {
        console.log('超星学习通PDF下载器已启动');

        // 拦截XHR请求
        interceptXHR();

        // 拦截Fetch请求
        interceptFetch();

        // 定期检查PDF链接
        checkInterval = setInterval(checkForPDFLinks, 2000);

        // 初始检查
        setTimeout(checkForPDFLinks, 1000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 清理定时器
    window.addEventListener('beforeunload', function() {
        if (checkInterval) {
            clearInterval(checkInterval);
        }
    });

})();
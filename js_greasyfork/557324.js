// ==UserScript==
// @name         虫虫钢琴一键下载PDF
// @namespace    ququ.taozhiyu.gitee.io
// @version      0.6.1
// @description  一键下载虫虫钢琴谱PDF，无需登录（修复自动打印bug），点击按钮即可下载。
// @author       Linlelest
// @match        *://www.gangqinpu.com/cchtml/*.htm
// @match        *://www.gangqinpu.com/sheetplayer/web.html?*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557324/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BDPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/557324/%E8%99%AB%E8%99%AB%E9%92%A2%E7%90%B4%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BDPDF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 如果是sheetplayer/web.html页面，绕过referrer检测并准备打印
    if (window.location.pathname === '/sheetplayer/web.html') {
        // 绕过referrer检测
        !document.referrer && (location.href += "");
        
        // 隐藏打印按钮
        GM_addStyle(`
            .print {
                display: none !important;
            }
            body {
                margin: 0 !important;
                padding: 0 !important;
            }
        `);
        
        // 页面加载完成后，等待用户触发打印
        window.addEventListener('load', function() {
            // 等待用户通过外部脚本触发打印
            // 这里不主动调用window.print()，而是等待外部指令
        });
        
        return;
    }
    
    // 创建下载按钮
    function createDownloadButton() {
        // 检查按钮是否已存在
        if (document.getElementById('ququ-download-btn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'ququ-download-btn';
        button.textContent = '一键下载PDF';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '99999';
        button.style.padding = '12px 20px';
        button.style.backgroundColor = '#e74c3c';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        button.style.transition = 'all 0.3s ease';
        
        // 悬停效果
        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#c0392b';
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#e74c3c';
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('click', downloadPDF);
        
        document.body.appendChild(button);
    }
    
    // 下载PDF函数
    function downloadPDF() {
        // 显示操作提示
        alert('即将打开乐谱预览页面，打印对话框将自动弹出\n请在打印对话框中选择"另存为PDF"并点击保存');
        
        // 获取乐谱数据URL
        const iframe = document.getElementById('ai-score');
        if (!iframe) {
            alert('无法找到乐谱数据，请刷新页面后重试');
            return;
        }
        
        // 从iframe的src中提取url参数
        const iframeSrc = iframe.src;
        const urlParam = iframeSrc.match(/url=([^&]+)/);
        if (!urlParam || !urlParam[1]) {
            alert('无法提取乐谱数据URL');
            return;
        }
        
        // 构造sheetplayer URL，设置为五线谱模式(jianpuMode=0)
        const sheetPlayerUrl = `/sheetplayer/web.html?jianpuMode=0&url=${encodeURIComponent(urlParam[1])}`;
        
        // 打开新窗口
        const newWindow = window.open(sheetPlayerUrl, '_blank', 'width=800,height=600');
        
        // 在新窗口完全加载后触发打印
        if (newWindow) {
            newWindow.addEventListener('load', function() {
                // 延迟一段时间确保页面内容完全加载
                setTimeout(() => {
                    newWindow.print();
                }, 1000);
            });
        }
    }
    
    // 添加CSS样式
    GM_addStyle(`
        #ququ-download-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            padding: 12px 20px;
            background-color: #e74c3c;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        }
        
        #ququ-download-btn:hover {
            background-color: #c0392b;
            transform: translateY(-2px);
        }
    `);
    
    // 等待页面加载完成
    window.addEventListener('load', function() {
        createDownloadButton();
        
        // 监听DOM变化，以防页面动态加载
        const observer = new MutationObserver(() => {
            createDownloadButton();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();
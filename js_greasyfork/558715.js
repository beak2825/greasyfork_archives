// ==UserScript==
// @name         arXiv论文下载自动重命名
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  使用Blob流下载，支持 macOS/Windows
// @author       fleey
// @match        *://arxiv.org/abs/*
// @match        *://arxiv.org/search/*
// @match        *://arxiv.org/list/*
// @icon         https://arxiv.org/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      arxiv.org
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/558715/arXiv%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/558715/arXiv%E8%AE%BA%E6%96%87%E4%B8%8B%E8%BD%BD%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 工具函数 ---

    function sanitizeFilename(title, time) {
        // 1. 去除标题前缀 ("Title:") 和多余空格
        var safeTitle = title.replace(/^Title:\s*/i, '').replace(/\s+/g, ' ').trim();

        // 2. 字符替换表 (macOS/Windows 通用安全字符)
        var replacements = {
            ':': ' -',
            '：': '-',
            '?': '',
            '？': '',
            '"': "'",
            '“': "'",
            '”': "'",
            '/': '_',
            '\\': '_',
            '*': '',
            '|': '-',
            '<': '(',
            '>': ')'
        };

        // 3. 执行替换
        safeTitle = safeTitle.split('').map(function(char) {
            return replacements[char] !== undefined ? replacements[char] : char;
        }).join('');

        safeTitle = safeTitle.replace(/\s+/g, ' ').trim();

        return '[' + time + '] ' + safeTitle + '.pdf';
    }

    /**
     * 核心下载函数：使用 Blob 数据流
     * 这种方式可以绕过浏览器的跨域文件名限制，强制重命名
     */
    function downloadWithBlob(url, filename, btnElement) {
        console.log('开始请求 Blob 数据:', url);

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onload: function(response) {
                if (response.status === 200) {
                    console.log('数据获取成功，正在生成文件...');
                    
                    var blob = response.response;
                    var blobUrl = window.URL.createObjectURL(blob);
                    
                    var a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = blobUrl;
                    a.download = filename;
                    
                    document.body.appendChild(a);
                    a.click();
                    
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(blobUrl);

                    if (btnElement) {
                        btnElement.textContent = "✔ 下载成功";
                        setTimeout(function() { btnElement.textContent = "⬇ PDF(Auto-Rename)"; }, 3000);
                        btnElement.style.opacity = "1";
                    }
                } else {
                    console.error('下载失败，状态码:', response.status);
                    alert('下载失败，服务器返回错误。');
                    if (btnElement) btnElement.textContent = "❌ 失败";
                }
            },
            onerror: function(err) {
                console.error('网络请求错误:', err);
                alert('网络请求失败，请检查网络或控制台。');
                if (btnElement) btnElement.textContent = "❌ 网络错误";
            },
            onprogress: function(progress) {
                if (btnElement && progress.total > 0) {
                    var percent = Math.round((progress.loaded / progress.total) * 100);
                    btnElement.textContent = "⏳ " + percent + "%";
                }
            }
        });
    }

    function createDownloadBtn(url, filename, container, isList) {
        if (!container) return;
        if (container.querySelector('.custom-dl-btn')) return;

        var btn = document.createElement("a");
        btn.textContent = "⬇ PDF(Auto-Rename)";
        btn.className = "custom-dl-btn";
        
        btn.style.cssText = `
            display: inline-block;
            background-color: #b31b1b;
            color: white;
            padding: 2px 8px;
            margin-left: 8px;
            border-radius: 4px;
            font-size: 12px;
            text-decoration: none;
            cursor: pointer;
            font-family: sans-serif;
            user-select: none;
        `;

        if (isList) btn.style.marginTop = "5px";

        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 防止重复点击
            if (btn.textContent.includes("⏳")) return;

            btn.textContent = "⏳ 0%";
            btn.style.opacity = "0.7";
            
            downloadWithBlob(url, filename, btn);
        };

        container.appendChild(btn);
    }

    // --- 页面处理逻辑 ---

    function handleAbsPage() {
        // 标题选择器
        var titleEl = document.querySelector("#abs > h1.title");
        // 日期选择器：从 .dateline 中提取
        var dateEl = document.querySelector("#abs > .dateline"); 
        
        var downloadLinkEl = document.querySelector('a[href^="/pdf/"]');
        var extraServiceEl = document.querySelector(".extra-services .full-text");

        if (titleEl && downloadLinkEl && extraServiceEl) {
            var title = titleEl.textContent.replace(/^Title:\s*/, '').trim();
            
            // 优先从页面显示的提交日期提取年份，例如 "[Submitted on 4 Dec 2025]"
            var year = "Paper";
            if (dateEl) {
                var dateMatch = dateEl.textContent.match(/\d{4}/);
                if (dateMatch) {
                    year = dateMatch[0]; // 得到 2025
                }
            }
            
            // 如果没找到日期，回退到从 URL ID 提取 (2512 -> 2025)
            if (year === "Paper") {
                 var arxivId = window.location.pathname.split('/').pop();
                 var idMain = arxivId.split('v')[0];
                 if (idMain.indexOf('.') !== -1) {
                     year = '20' + idMain.split('.')[0].slice(0, 2);
                 }
            }
            
            var filename = sanitizeFilename(title, year);
            var pdfUrl = downloadLinkEl.href;
            if (!pdfUrl.endsWith('.pdf')) pdfUrl += '.pdf';
            
            createDownloadBtn(pdfUrl, filename, extraServiceEl, false);
        }
    }

    // 2. 搜索页处理
    function handleSearchPage() {
        var items = document.querySelectorAll("li.arxiv-result");
        items.forEach(function(item) {
            var titleEl = item.querySelector(".title");
            var dateEl = item.querySelector(".is-size-7");
            var pdfLinkEl = item.querySelector('a[href^="/pdf/"]');
            var linkContainer = item.querySelector(".is-marginless");

            if (titleEl && dateEl && pdfLinkEl && linkContainer) {
                var title = titleEl.textContent.trim();
                var year = "xxxx";
                var dateMatch = dateEl.textContent.match(/\d{4}/);
                if (dateMatch) year = dateMatch[0];

                var filename = sanitizeFilename(title, year);
                var pdfUrl = pdfLinkEl.href;
                if (!pdfUrl.endsWith('.pdf')) pdfUrl += '.pdf';

                createDownloadBtn(pdfUrl, filename, linkContainer, false);
            }
        });
    }

    // 3. 列表页处理
    function handleListPage() {
        var items = document.querySelectorAll(".list-identifier");
        items.forEach(function(item) {
            try {
                var titleEl = null;
                if (item.parentNode && item.parentNode.nextElementSibling) {
                     titleEl = item.parentNode.nextElementSibling.querySelector('.list-title');
                }
                var pdfLinkEl = item.querySelector('a[title="Download PDF"]');
                
                if (titleEl && pdfLinkEl) {
                    var title = titleEl.innerText.replace(/^Title:\s*/, '').trim();
                    var pdfUrl = pdfLinkEl.href + '.pdf';
                    
                    var idPart = pdfUrl.split('/').pop().split('v')[0].split('.')[0];
                    var year = "xxxx";
                    if (idPart.length >= 4 && !isNaN(idPart)) {
                        year = '20' + idPart.slice(0, 2);
                    }
                    
                    var filename = sanitizeFilename(title, year);
                    createDownloadBtn(pdfUrl, filename, item, true);
                }
            } catch (e) {
                console.warn('List item error:', e);
            }
        });
    }

    // --- 主入口 ---
    var path = window.location.pathname;
    setTimeout(function() {
        if (path.indexOf('/abs/') !== -1) {
            handleAbsPage();
        } else if (path.indexOf('/search/') !== -1) {
            handleSearchPage();
        } else if (path.indexOf('/list/') !== -1) {
            handleListPage();
        }
    }, 500);

})();
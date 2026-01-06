// ==UserScript==
// @name         论坛列表自动显示图片
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @author       Cantona
// @license      MIT
// @description  在论坛列表页自动显示帖子缩略图和附件下载按钮,手动点击翻页
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @run-at       document-end
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/561308/%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/561308/%E8%AE%BA%E5%9D%9B%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const config = {
        maxImagesPerThread: 3,
        thumbnailWidth: 150,
        autoLoad: true,
        loadDelay: 100,
        maxConcurrent: 5,
        showAttachments: true
    };
    
    function getDefaultDomains() {
        return [];
    }
    
    function getAllowedDomains() {
        const saved = GM_getValue('allowedDomains', '');
        if (saved) {
            return saved.split('\n').map(d => d.trim()).filter(d => d.length > 0);
        }
        return getDefaultDomains();
    }
    
    function saveAllowedDomains(domains) {
        GM_setValue('allowedDomains', domains.join('\n'));
    }
    
    function extractMainDomain(hostname) {
        hostname = hostname.split(':')[0];
        const parts = hostname.split('.');
        
        if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
            return hostname;
        }
        
        if (parts.length <= 2) {
            return hostname;
        }
        
        const commonSubdomains = ['www', 'web', 'mail', 'ftp', 'blog', 'shop', 'forum', 'm', 'mobile'];
        
        if (parts.length >= 3) {
            const specialTLDs = ['co.uk', 'com.cn', 'net.cn', 'org.cn', 'gov.cn', 'ac.uk', 'co.jp'];
            const lastTwo = parts.slice(-2).join('.');
            
            if (specialTLDs.includes(lastTwo)) {
                return parts.slice(-3).join('.');
            }
            
            if (commonSubdomains.includes(parts[0].toLowerCase())) {
                return parts.slice(1).join('.');
            }
        }
        
        return parts.slice(-2).join('.');
    }
    
    function isAllowedDomain() {
        const currentDomain = window.location.hostname;
        const allowedDomains = getAllowedDomains();
        return allowedDomains.some(domain => {
            if (domain.startsWith('*.')) {
                const baseDomain = domain.substring(2);
                return currentDomain.endsWith(baseDomain);
            }
            return currentDomain === domain || currentDomain.endsWith('.' + domain);
        });
    }
    
    function createSettingsPanel() {
        const currentDomain = window.location.hostname;
        const mainDomain = extractMainDomain(currentDomain);
        const allowedDomains = getAllowedDomains();
        
        const panel = document.createElement('div');
        panel.id = 'settingsPanel';
        panel.style.display = 'none';
        panel.innerHTML = `
            <div class="settings-header">
                <span>域名管理</span>
                <button class="settings-close" id="closeSettings">×</button>
            </div>
            
            <div class="settings-body">
                <div class="settings-section">
                    <label>当前域名</label>
                    <div class="current-domain-display">${currentDomain}</div>
                    <div class="suggest-domain">建议添加: ${mainDomain}</div>
                </div>
                
                <div class="settings-section">
                    <label>添加域名</label>
                    <div class="input-row">
                        <input type="text" id="domainInput" placeholder="example.com 或 *.example.com">
                        <button class="btn-add" id="addDomainBtn">添加</button>
                    </div>
                    <div class="quick-buttons">
                        <button class="btn-quick" id="addMainBtn">添加主域名</button>
                        <button class="btn-quick" id="addFullBtn">添加完整域名</button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <label>已配置域名 (<span id="domainCount">0</span>)</label>
                    <div id="domainsList" class="domains-list"></div>
                </div>
                
                <div id="alertBox" class="alert-box"></div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        let domains = [...allowedDomains];
        
        function renderDomains() {
            const container = document.getElementById('domainsList');
            const countEl = document.getElementById('domainCount');
            
            countEl.textContent = domains.length;
            
            if (domains.length === 0) {
                container.innerHTML = '<div class="empty-msg">暂无配置</div>';
                return;
            }
            
            container.innerHTML = domains.map((domain, index) => `
                <div class="domain-row">
                    <span class="domain-name">${domain}</span>
                    <button class="btn-del" data-index="${index}">删除</button>
                </div>
            `).join('');
            
            container.querySelectorAll('.btn-del').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    if (confirm('确定删除 "' + domains[index] + '" ?')) {
                        domains.splice(index, 1);
                        saveAllowedDomains(domains);
                        renderDomains();
                        showAlert('已删除');
                    }
                });
            });
        }
        
        function showAlert(message) {
            const alertBox = document.getElementById('alertBox');
            alertBox.textContent = message;
            alertBox.style.display = 'block';
            setTimeout(() => {
                alertBox.style.display = 'none';
            }, 2000);
        }
        
        function addDomain(domain) {
            if (!domain) {
                alert('请输入域名');
                return;
            }
            if (domains.includes(domain)) {
                alert('域名已存在');
                return;
            }
            domains.push(domain);
            saveAllowedDomains(domains);
            renderDomains();
            document.getElementById('domainInput').value = '';
            showAlert('添加成功');
        }
        
        document.getElementById('closeSettings').addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        document.getElementById('addDomainBtn').addEventListener('click', () => {
            addDomain(document.getElementById('domainInput').value.trim());
        });
        
        document.getElementById('domainInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addDomain(e.target.value.trim());
            }
        });
        
        document.getElementById('addMainBtn').addEventListener('click', () => {
            addDomain(mainDomain);
        });
        
        document.getElementById('addFullBtn').addEventListener('click', () => {
            addDomain(currentDomain);
        });
        
        renderDomains();
        
        return panel;
    }
    
    function showSettings() {
        let panel = document.getElementById('settingsPanel');
        if (!panel) {
            panel = createSettingsPanel();
        }
        panel.style.display = 'block';
    }
    
    function addCurrentDomain() {
        const currentDomain = window.location.hostname;
        const mainDomain = extractMainDomain(currentDomain);
        const allowedDomains = getAllowedDomains();
        
        if (allowedDomains.includes(mainDomain)) {
            alert('主域名已在白名单中:' + mainDomain);
            return;
        }
        
        if (confirm(`添加主域名到白名单?\n\n${mainDomain}\n\n将匹配所有子域名`)) {
            allowedDomains.push(mainDomain);
            saveAllowedDomains(allowedDomains);
            alert('已添加,请刷新页面');
        }
    }
    
    GM_registerMenuCommand('⚙️ 域名管理', showSettings);
    GM_registerMenuCommand('➕ 快速添加当前域名', addCurrentDomain);
    
    let isAutoLoading = false;
    let observer = null;
    let observerLoadTimer = null;
    let currentPage = 1;
    let isLoadingNextPage = false;
    
    function isAllContentLoaded() {
        const loadingElements = document.querySelectorAll(
            '.thread-loading, .attachment-loading-btn'
        );
        const processingThreads = document.querySelectorAll(
            'tbody[data-images-loaded="processing"]'
        );
        
        return loadingElements.length === 0 && processingThreads.length === 0;
    }
    
    GM_addStyle(`
        #settingsPanel {
            position: fixed;
            top: 60px;
            right: 20px;
            width: 340px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            font-size: 14px;
        }
        
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-bottom: 1px solid #eee;
            background: #fafafa;
            border-radius: 8px 8px 0 0;
        }
        
        .settings-header span {
            font-weight: 600;
            color: #333;
        }
        
        .settings-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            line-height: 1;
            padding: 0;
        }
        
        .settings-close:hover {
            background: #eee;
            color: #333;
        }
        
        .settings-body {
            padding: 16px;
            max-height: 500px;
            overflow-y: auto;
        }
        
        .settings-section {
            margin-bottom: 16px;
        }
        
        .settings-section label {
            display: block;
            margin-bottom: 8px;
            color: #666;
            font-size: 13px;
        }
        
        .current-domain-display {
            padding: 8px 10px;
            background: #f5f5f5;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            color: #333;
            margin-bottom: 6px;
        }
        
        .suggest-domain {
            font-size: 12px;
            color: #999;
            padding-left: 10px;
        }
        
        .input-row {
            display: flex;
            gap: 8px;
            margin-bottom: 8px;
        }
        
        .input-row input {
            flex: 1;
            padding: 7px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 13px;
        }
        
        .input-row input:focus {
            outline: none;
            border-color: #999;
        }
        
        .btn-add {
            padding: 7px 16px;
            background: #555;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
        }
        
        .btn-add:hover {
            background: #333;
        }
        
        .quick-buttons {
            display: flex;
            gap: 6px;
        }
        
        .btn-quick {
            flex: 1;
            padding: 6px 8px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            color: #666;
        }
        
        .btn-quick:hover {
            background: #eee;
            border-color: #ccc;
        }
        
        .domains-list {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #eee;
            border-radius: 4px;
            background: #fafafa;
        }
        
        .domain-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            border-bottom: 1px solid #eee;
        }
        
        .domain-row:last-child {
            border-bottom: none;
        }
        
        .domain-row:hover {
            background: #f5f5f5;
        }
        
        .domain-name {
            font-family: monospace;
            font-size: 12px;
            color: #333;
            flex: 1;
        }
        
        .btn-del {
            padding: 4px 10px;
            background: none;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            color: #999;
        }
        
        .btn-del:hover {
            border-color: #f56565;
            color: #f56565;
            background: #fff5f5;
        }
        
        .empty-msg {
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 12px;
        }
        
        .alert-box {
            display: none;
            padding: 8px 12px;
            background: #e8f5e9;
            border: 1px solid #c8e6c9;
            border-radius: 4px;
            color: #2e7d32;
            font-size: 12px;
            margin-top: 12px;
        }
        
        .thread-images-preview {
            margin: 5px 0 8px 0;
            padding: 10px;
            background: #f8f9fa;
            border-radius: 4px;
            border-left: 3px solid #999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .thread-images-row {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        }
        
        .thread-buttons-row {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            align-items: center;
            padding-top: 4px;
            border-top: 1px solid rgba(0,0,0,0.05);
        }
        
        .thread-thumbnail {
            width: ${config.thumbnailWidth}px;
            height: ${config.thumbnailWidth * 0.67}px;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        
        .thread-thumbnail:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .thread-loading {
            font-size: 12px;
            color: #999;
            padding: 5px 10px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        
        .thread-loading::after {
            content: '...';
            animation: dots 1.5s steps(4, end) infinite;
        }
        
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }
        
        .image-count-badge {
            font-size: 11px;
            color: #666;
            padding: 4px 10px;
            background: #eee;
            border-radius: 12px;
            font-weight: 500;
        }
        
        .thread-action-btn {
            font-size: 11px;
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
            display: inline-block;
            font-weight: 500;
            border: 1px solid;
        }
        
        .view-all-btn {
            color: #555;
            background: white;
            border-color: #ddd;
        }
        
        .view-all-btn:hover {
            background: #555;
            color: white;
            border-color: #555;
        }
        
        .attachment-download-btn {
            color: #16a34a;
            background: white;
            border-color: #86efac;
        }
        
        .attachment-download-btn:hover {
            background: #16a34a;
            color: white;
        }
        
        .magnet-link-btn {
            color: #7c3aed;
            background: white;
            border-color: #c4b5fd;
        }
        
        .magnet-link-btn:hover {
            background: #7c3aed;
            color: white;
        }
        
        .attachment-loading-btn {
            font-size: 11px;
            color: #999;
            padding: 4px 12px;
            background: white;
            border: 1px solid #eee;
            border-radius: 4px;
            display: inline-block;
        }
        
        .fullsize-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: none;
            align-items: center;
            justify-content: center;
        }
        
        .fullsize-overlay.active {
            display: flex;
        }
        
        .fullsize-image {
            max-width: 90%;
            max-height: 90vh;
            border-radius: 4px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            cursor: zoom-out;
        }
        
        .fullsize-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            border-radius: 50%;
            color: white;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        
        .fullsize-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: rotate(90deg);
        }
        
        .page-separator {
            margin: 30px auto;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            text-align: center;
            font-size: 13px;
            color: #666;
            font-weight: 500;
            border: 1px solid #eee;
            max-width: 200px;
        }
        
        .images-control-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        .control-btn {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
            white-space: nowrap;
        }
        
        .control-btn:hover:not(:disabled) {
            background: #f0f0f0;
            color: #333;
            border-color: #ccc;
        }
        
        .control-btn.danger:hover:not(:disabled) {
            color: #e53e3e;
            border-color: #e53e3e;
            background: #fff5f5;
        }
        
        .control-btn:disabled {
            background: #fafafa;
            color: #ccc;
            cursor: not-allowed;
        }
        
        .control-btn.loading {
            color: #ff9800;
            border-color: #ffb74d;
        }
        
        .control-btn.next-page {
            background: #16a34a;
            color: white;
            border-color: #16a34a;
            font-weight: 600;
        }
        
        .control-btn.next-page:hover:not(:disabled) {
            background: #15803d;
            border-color: #15803d;
        }
        
        .page-info {
            padding: 8px 12px;
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 12px;
            color: #666;
        }
        
        .loading-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 13px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: none;
        }
        
        .loading-toast.active {
            display: block;
            animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translate(-50%, -10px);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
    `);
    
    if (!isAllowedDomain()) {
        console.log('[图片预览] 当前域名不在白名单中');
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'fullsize-overlay';
    overlay.innerHTML = '<button class="fullsize-close">×</button><img class="fullsize-image" />';
    document.body.appendChild(overlay);
    
    const fullsizeImg = overlay.querySelector('.fullsize-image');
    const closeBtn = overlay.querySelector('.fullsize-close');
    
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === fullsizeImg) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    const loadingToast = document.createElement('div');
    loadingToast.className = 'loading-toast';
    document.body.appendChild(loadingToast);
    
    function showLoadingToast(text = '正在加载...') {
        loadingToast.textContent = text;
        loadingToast.classList.add('active');
    }
    
    function hideLoadingToast() {
        loadingToast.classList.remove('active');
    }
    
    function showFullsizeImage(imgUrl) {
        fullsizeImg.src = imgUrl;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function getCurrentPageNum() {
        const pageLink = document.querySelector('.pg strong, .pgt strong');
        return pageLink ? parseInt(pageLink.textContent) : 1;
    }
    
    function findNextPageUrl() {
        const selectors = [
            'a.nxt',
            'a[href*="page="]',
            '.pg a:last-child',
            '.pgt a:last-child'
        ];
        
        for (const selector of selectors) {
            const link = document.querySelector(selector);
            if (link && link.href && !link.classList.contains('disabled')) {
                const text = link.textContent.trim();
                if (text.includes('下一页') || text.includes('下页') || text === '>') {
                    return link.href;
                }
            }
        }
        
        const currentUrl = window.location.href;
        const pageMatch = currentUrl.match(/[?&]page=(\d+)/);
        if (pageMatch) {
            const nextPage = parseInt(pageMatch[1]) + 1;
            return currentUrl.replace(/([?&]page=)\d+/, '$1' + nextPage);
        }
        
        return null;
    }
    
    function getThreadList() {
        const threads = [];
        const threadElements = document.querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]');
        
        threadElements.forEach(el => {
            if (el.dataset.imagesLoaded) return;
            
            const titleLink = el.querySelector('a.s.xst');
            if (!titleLink) return;
            
            threads.push({
                id: el.id.replace(/[^0-9]/g, ''),
                url: titleLink.href,
                title: titleLink.textContent.trim(),
                element: el,
                titleCell: el.querySelector('th.new, th.common')
            });
        });
        
        return threads;
    }
    
    function loadThreadImages(thread) {
        thread.element.dataset.imagesLoaded = 'processing';
        
        if (thread.element.querySelector('.thread-images-preview')) return;
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'thread-images-preview';
        loadingDiv.innerHTML = '<span class="thread-loading">加载中</span>';
        
        const titleCell = thread.titleCell;
        if (!titleCell) return;
        
        const titleLink = titleCell.querySelector('a.s.xst');
        if (titleLink && titleLink.parentNode) {
            titleLink.parentNode.insertBefore(loadingDiv, titleLink.nextSibling);
        }
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: thread.url,
            timeout: 10000,
            onload: function(response) {
                thread.element.dataset.imagesLoaded = 'done';
                if (response.status === 200) {
                    parseAndDisplayImages(response.responseText, thread, loadingDiv);
                } else {
                    loadingDiv.innerHTML = '<span style="color: #999; font-size: 11px;">加载失败</span>';
                }
            },
            onerror: function() {
                thread.element.dataset.imagesLoaded = 'error';
                loadingDiv.innerHTML = '<span style="color: #999; font-size: 11px;">网络错误</span>';
            },
            ontimeout: function() {
                thread.element.dataset.imagesLoaded = 'timeout';
                loadingDiv.innerHTML = '<span style="color: #999; font-size: 11px;">超时</span>';
            }
        });
    }
    
    function parseAndDisplayImages(html, thread, container) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const postContent = doc.querySelector('.t_f, .pcb, .message');
        
        if (!postContent) {
            container.style.display = 'none';
            return;
        }
        
        const images = [];
        postContent.querySelectorAll('img').forEach(img => {
            let imgUrl = img.getAttribute('file') || 
                        img.getAttribute('zoomfile') || 
                        img.getAttribute('src') || 
                        img.getAttribute('data-original');
            
            if (imgUrl && !imgUrl.startsWith('http')) {
                if (imgUrl.startsWith('//')) {
                    imgUrl = 'http:' + imgUrl;
                } else if (imgUrl.startsWith('/')) {
                    imgUrl = new URL(imgUrl, thread.url).href;
                }
            }
            
            if (imgUrl && 
                !imgUrl.includes('static/image/smiley') && 
                !imgUrl.includes('images/smilies') &&
                imgUrl.match(/\.(jpg|jpeg|png|webp|bmp)/i)) {
                images.push(imgUrl);
            }
        });
        
        // 修复: 磁力链接提取 - 移除"复制代码"等干扰文字
        const magnetLinks = [];
        const codeBlocks = doc.querySelectorAll('.blockcode, [class*="code"]');
        codeBlocks.forEach(block => {
            // 克隆节点以避免修改原始DOM
            const clonedBlock = block.cloneNode(true);
            // 移除所有可能包含"复制代码"等文字的按钮和操作元素
            clonedBlock.querySelectorAll('button, em, i, .copy-btn, [onclick]').forEach(el => el.remove());
            
            const text = clonedBlock.textContent || clonedBlock.innerText;
            // 更严格的正则表达式,只匹配标准磁力链接
            const magnetRegex = /magnet:\?xt=urn:btih:[A-Z0-9]{32,40}(?:&[^\s&]*)?/gi;
            const matches = text.match(magnetRegex);
            if (matches) {
                matches.forEach(magnet => {
                    // 清理磁力链接,移除可能混入的中文和特殊字符
                    let cleanMagnet = magnet.trim();
                    // 移除URL中可能的中文编码干扰
                    cleanMagnet = cleanMagnet.replace(/%E[0-9A-F]{1}%[0-9A-F]{2}%[0-9A-F]{2}/gi, '');
                    // 确保是有效的磁力链接且未重复
                    if (cleanMagnet.startsWith('magnet:?xt=urn:btih:') && !magnetLinks.includes(cleanMagnet)) {
                        magnetLinks.push(cleanMagnet);
                    }
                });
            }
        });
        
        // 修复: 附件提取 - 直接构建下载链接
        const attachments = [];
        if (config.showAttachments) {
            const attachList = doc.querySelectorAll('.pattl, dl.tattl, .attnm');
            const processedAids = new Set();
            
            attachList.forEach(attach => {
                const nameLink = attach.querySelector('a[id^="aid"], a[href*="forum.php?mod=attachment"]');
                
                if (nameLink) {
                    const attachName = nameLink.textContent.trim();
                    
                    // 跳过图片格式
                    if (attachName.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
                        return;
                    }
                    
                    const aidMatch = nameLink.href.match(/aid=([^&]+)/);
                    const aid = aidMatch ? aidMatch[1] : null;
                    
                    if (aid && processedAids.has(aid)) {
                        return;
                    }
                    
                    if (aid) {
                        processedAids.add(aid);
                        
                        // 直接构建下载链接,无需二次请求
                        const baseUrl = new URL(thread.url).origin;
                        const directDownloadUrl = `${baseUrl}/forum.php?mod=attachment&aid=${aid}`;
                        
                        attachments.push({
                            name: attachName,
                            url: directDownloadUrl,
                            aid: aid
                        });
                    }
                }
            });
        }
        
        if (images.length === 0 && attachments.length === 0 && magnetLinks.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        displayThumbnailsAndAttachments(images, attachments, magnetLinks, thread, container);
    }
    
    function displayThumbnailsAndAttachments(images, attachments, magnetLinks, thread, container) {
        container.innerHTML = '';
        
        const imagesRow = document.createElement('div');
        imagesRow.className = 'thread-images-row';
        
        const buttonsRow = document.createElement('div');
        buttonsRow.className = 'thread-buttons-row';
        
        if (images.length > 0) {
            const displayCount = Math.min(images.length, config.maxImagesPerThread);
            
            for (let i = 0; i < displayCount; i++) {
                const img = document.createElement('img');
                img.src = images[i];
                img.className = 'thread-thumbnail';
                img.loading = 'lazy';
                
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showFullsizeImage(images[i]);
                });
                
                img.onerror = function() {
                    this.style.display = 'none';
                };
                
                imagesRow.appendChild(img);
            }
            
            if (images.length > displayCount) {
                const badge = document.createElement('span');
                badge.className = 'image-count-badge';
                badge.textContent = `+${images.length - displayCount}`;
                imagesRow.appendChild(badge);
            }
            
            if (images.length > 1) {
                const viewBtn = document.createElement('button');
                viewBtn.className = 'thread-action-btn view-all-btn';
                viewBtn.textContent = `全部 (${images.length})`;
                viewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(thread.url, '_blank');
                });
                buttonsRow.appendChild(viewBtn);
            }
        }
        
        if (magnetLinks.length > 0) {
            magnetLinks.forEach((magnet, index) => {
                const magnetBtn = document.createElement('a');
                magnetBtn.className = 'thread-action-btn magnet-link-btn';
                magnetBtn.textContent = magnetLinks.length > 1 ? `磁力${index + 1}` : '磁力';
                magnetBtn.href = magnet;
                magnetBtn.title = magnet;
                
                magnetBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    GM_setClipboard(magnet, 'text');
                    
                    const originalText = magnetBtn.textContent;
                    magnetBtn.textContent = '已复制';
                    setTimeout(() => {
                        magnetBtn.textContent = originalText;
                    }, 1500);
                    
                    window.open(magnet, '_blank');
                });
                
                buttonsRow.appendChild(magnetBtn);
            });
        }
        
        // 修复: 附件按钮直接使用下载链接
        if (attachments.length > 0) {
            attachments.forEach((attach, index) => {
                const downloadBtn = document.createElement('a');
                downloadBtn.href = attach.url;
                downloadBtn.target = '_blank';
                downloadBtn.download = attach.name;
                downloadBtn.className = 'thread-action-btn attachment-download-btn';
                downloadBtn.textContent = attachments.length > 1 ? `附件 ${index + 1}` : '下载附件';
                downloadBtn.title = attach.name;
                
                downloadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                
                buttonsRow.appendChild(downloadBtn);
            });
        }
        
        if (imagesRow.children.length > 0) {
            container.appendChild(imagesRow);
        }
        
        if (buttonsRow.children.length > 0) {
            container.appendChild(buttonsRow);
        }
        
        if (container.children.length === 0) {
            container.style.display = 'none';
        }
    }
    
    async function loadAllThreadsImages(showToast = true) {
        if (isAutoLoading) return;
        
        const threads = getThreadList();
        if (threads.length === 0) return;
        
        isAutoLoading = true;
        
        if (showToast) {
            showLoadingToast(`加载 ${threads.length} 个帖子...`);
        }
        
        const loadBtn = document.getElementById('loadAllImages');
        if (loadBtn) {
            loadBtn.disabled = true;
            loadBtn.textContent = '加载中...';
        }
        
        for (let i = 0; i < threads.length; i += config.maxConcurrent) {
            const batch = threads.slice(i, i + config.maxConcurrent);
            await Promise.all(batch.map(thread => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        loadThreadImages(thread);
                        resolve();
                    }, config.loadDelay);
                });
            }));
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (showToast) {
            setTimeout(() => hideLoadingToast(), 1000);
        }
        
        if (loadBtn) {
            loadBtn.disabled = false;
            loadBtn.textContent = '重新加载';
        }
        
        isAutoLoading = false;
        updatePageInfo();
    }
    
    function startThreadObserver() {
        if (observer) observer.disconnect();
        const root = document.body;
        if (!root) return;
        observer = new MutationObserver((mutations) => {
            const hasNewThreads = mutations.some(m => {
                return Array.from(m.addedNodes).some(node => {
                    if (node.nodeType !== 1) return false;
                    if (node.matches && node.matches('tbody[id^="normalthread_"], tbody[id^="stickthread_"]')) return true;
                    if (node.querySelector && node.querySelector('tbody[id^="normalthread_"], tbody[id^="stickthread_"]')) return true;
                    return false;
                });
            });
            if (!hasNewThreads) return;
            if (observerLoadTimer) clearTimeout(observerLoadTimer);
            observerLoadTimer = setTimeout(() => {
                loadAllThreadsImages(false);
            }, 200);
        });
        observer.observe(root, { childList: true, subtree: true });
    }
    
    function updatePageInfo() {
        const pageInfoEl = document.getElementById('pageInfo');
        if (pageInfoEl) {
            const totalThreads = document.querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]').length;
            const loadedThreads = document.querySelectorAll('tbody[data-images-loaded="done"]').length;
            pageInfoEl.innerHTML = `第${currentPage}页 ${loadedThreads}/${totalThreads}`;
        }
    }
    
    async function loadNextPage() {
        if (isLoadingNextPage) return;
        
        const nextPageUrl = findNextPageUrl();
        if (!nextPageUrl) {
            console.log('[翻页] 已到最后一页');
            return;
        }
        
        isLoadingNextPage = true;
        currentPage++;
        
        console.log(`[翻页] 加载第 ${currentPage} 页`);
        showLoadingToast(`加载第 ${currentPage} 页...`);
        
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: nextPageUrl,
                    timeout: 15000,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: reject
                });
            });
            
            if (response.status === 200) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                
                const threadList = doc.querySelector('#threadlisttableid, #threadlist');
                if (threadList) {
                    const separator = document.createElement('div');
                    separator.className = 'page-separator';
                    separator.textContent = `第 ${currentPage} 页`;
                    
                    const currentThreadList = document.querySelector('#threadlisttableid, #threadlist');
                    if (currentThreadList) {
                        currentThreadList.appendChild(separator);
                        
                        const newThreads = threadList.querySelectorAll('tbody[id^="normalthread_"], tbody[id^="stickthread_"]');
                        newThreads.forEach(thread => {
                            const clonedThread = thread.cloneNode(true);
                            delete clonedThread.dataset.imagesLoaded;
                            currentThreadList.appendChild(clonedThread);
                        });
                        
                        console.log(`[翻页] 插入 ${newThreads.length} 个新帖子`);
                        
                        setTimeout(() => {
                            separator.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                        
                        setTimeout(() => {
                            loadAllThreadsImages(false);
                        }, 500);
                    }
                }
            }
            
            hideLoadingToast();
        } catch (error) {
            console.error('[翻页] 失败:', error);
            hideLoadingToast();
        } finally {
            isLoadingNextPage = false;
        }
    }
    
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.className = 'images-control-panel';
        
        panel.innerHTML = `
            <button class="control-btn" id="loadAllImages">重新加载</button>
            <button class="control-btn danger" id="hideAllImages">隐藏图片</button>
            <button class="control-btn next-page" id="nextPageBtn">下一页</button>
            <div class="page-info" id="pageInfo">第 ${currentPage} 页</div>
        `;
        
        document.body.appendChild(panel);
        
        document.getElementById('loadAllImages').addEventListener('click', () => {
            loadAllThreadsImages(true);
        });
        
        document.getElementById('hideAllImages').addEventListener('click', () => {
            document.querySelectorAll('.thread-images-preview').forEach(el => el.remove());
            document.querySelectorAll('tbody[data-images-loaded]').forEach(el => {
                delete el.dataset.imagesLoaded;
            });
            updatePageInfo();
        });
        
        document.getElementById('nextPageBtn').addEventListener('click', () => {
            loadNextPage();
        });
    }
    
    function init() {
        if (!document.querySelector('#threadlisttableid, #threadlist, #waterfall')) {
            console.log('[图片预览] 不在列表页');
            return;
        }
        
        console.log('[图片预览+手动翻页] 已启动');
        
        createControlPanel();
        startThreadObserver();
        
        if (config.autoLoad) {
            setTimeout(() => {
                loadAllThreadsImages(true);
            }, 1000);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();

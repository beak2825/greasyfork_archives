// ==UserScript==
// @name         98助手
// @namespace    duang_duang
// @version      2.2.0
// @description  98tang 隐藏已访问链接，支持拖拽UI、隐藏/透明度/显示切换，TXT附件预览
// @author       q
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/560198/98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560198/98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置
    const DB_NAME = '98tang_visited_db';
    const STORE_NAME = 'visited_links';
    const DB_VERSION = 1;
    const STORAGE_KEY_POS = '98tang_ui_pos';
    const STORAGE_KEY_MODE = '98tang_ui_mode'; // 'opacity', 'hidden', 'show'
    const STORAGE_KEY_MINIMIZED = '98tang_ui_minimized';

    // UI 相关变量
    const panelId = 'visited-link-panel';
    const visitedClass = 'visited-item';
    let currentMode = localStorage.getItem(STORAGE_KEY_MODE) || 'opacity';
    let hiddenCount = 0;

    // IndexDB 工具类
    const dbTools = {
        db: null,
        init: function () {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onerror = (event) => {
                    console.error("Database error: " + event.target.errorCode);
                    reject(event);
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: "id" });
                    }
                };

                request.onsuccess = (event) => {
                    this.db = event.target.result;
                    resolve(this.db);
                };
            });
        },
        add: function (id) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not initialized");
                const transaction = this.db.transaction([STORE_NAME], "readwrite");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put({ id: id, timestamp: new Date().getTime() });

                request.onsuccess = () => resolve(true);
                request.onerror = () => resolve(false); // 忽略错误
            });
        },
        has: function (id) {
            return new Promise((resolve, reject) => {
                if (!this.db) return reject("DB not initialized");
                const transaction = this.db.transaction([STORE_NAME], "readonly");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(id);

                request.onsuccess = () => resolve(!!request.result);
                request.onerror = () => resolve(false);
            });
        }
    };

    // UI 工具类
    const uiTools = {
        updateCount: function () {
            const el = document.getElementById('visited-count');
            if (el) el.innerText = hiddenCount;
        },
        applyMode: function (mode) {
            currentMode = mode;
            localStorage.setItem(STORAGE_KEY_MODE, mode);

            // 移除所有旧模式类
            const classes = document.body.classList;
            for (let i = classes.length - 1; i >= 0; i--) {
                if (classes[i].startsWith('mode-')) {
                    classes.remove(classes[i]);
                }
            }
            document.body.classList.add('mode-' + mode);
        },
        initStyle: function () {
            const style = document.createElement('style');
            style.innerHTML = `
                /* 模式样式 */
                body.mode-hidden .${visitedClass} { display: none !important; }
                body.mode-opacity .${visitedClass} { opacity: 0.3; }
                body.mode-show .${visitedClass} { /* 正常显示 */ }
                body.mode-strikethrough .${visitedClass} a { text-decoration: line-through !important; }
                body.mode-opacity-strike .${visitedClass} { opacity: 0.4; }
                body.mode-opacity-strike .${visitedClass} a { text-decoration: line-through !important; }
                body.mode-yellow .${visitedClass} a { color: #aaaa00 !important; }

                /* 面板样式 */
                #${panelId} {
                    position: fixed;
                    z-index: 999999;
                    background: rgba(0, 0, 0, 0.75);
                    color: white;
                    padding: 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: sans-serif;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    user-select: none;
                    width: 110px;
                    backdrop-filter: blur(2px);
                    transition: width 0.2s, background 0.2s;
                }
                #${panelId}.minimized {
                    width: auto;
                    padding: 4px 8px;
                    background: rgba(0, 0, 0, 0.5);
                }
                #${panelId}.minimized .panel-content {
                    display: none;
                }
                #${panelId} .panel-header {
                    cursor: move;
                    font-weight: bold;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #${panelId}:not(.minimized) .panel-header {
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    padding-bottom: 4px;
                    margin-bottom: 4px;
                }
                #${panelId} .toggle-btn {
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 1;
                    opacity: 0.7;
                    padding: 0 2px;
                }
                #${panelId} .toggle-btn:hover {
                    opacity: 1;
                    color: #4CAF50;
                }
                #${panelId} select {
                    background: #333;
                    color: white;
                    border: 1px solid #555;
                    border-radius: 3px;
                    padding: 2px;
                    width: 100%;
                    font-size: 11px;
                    margin-bottom: 2px;
                    cursor: pointer;
                }
                #${panelId} .stat-row {
                    font-size: 10px;
                    color: #ccc;
                    text-align: right;
                }

                /* TXT预览相关样式 */
                .txt-preview-btn-wrapper {
                    margin-top: 5px;
                    margin-bottom: 5px;
                }
                .txt-preview-btn {
                    display: inline-block;
                    cursor: pointer;
                    color: #1a73e8;
                    font-size: 12px;
                    text-decoration: underline;
                    white-space: nowrap;
                }
                .txt-preview-btn:hover {
                    color: #d93025;
                }
                .txt-preview-box {
                    position: absolute;
                    z-index: 99999;
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    min-width: 300px;
                    max-width: 800px;
                    max-height: 500px;
                    display: flex;
                    flex-direction: column;
                }
                .txt-preview-header {
                    padding: 5px 10px;
                    background-color: #f1f1f1;
                    border-bottom: 1px solid #ddd;
                    border-radius: 4px 4px 0 0;
                    text-align: right;
                    flex-shrink: 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .txt-preview-title {
                    font-size: 12px;
                    color: #666;
                    font-weight: bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    flex: 1;
                    min-width: 0;
                }
                .txt-preview-copy {
                    cursor: pointer;
                    color: #fff;
                    background-color: #1a73e8;
                    font-size: 12px;
                    margin-right: 10px;
                    border: 1px solid #1a73e8;
                    border-radius: 4px;
                    padding: 4px 12px;
                    white-space: nowrap;
                    flex-shrink: 0;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    transition: all 0.2s;
                    font-weight: 500;
                }
                .txt-preview-copy:hover {
                    background-color: #1557b0;
                    border-color: #1557b0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                }
                .txt-preview-copy:active {
                    transform: translateY(1px);
                    box-shadow: none;
                }
                .txt-preview-close {
                    cursor: pointer;
                    color: #888;
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 1;
                    padding: 0 5px;
                }
                .txt-preview-close:hover {
                    color: #333;
                    background-color: #e0e0e0;
                    border-radius: 3px;
                }
                .txt-preview-content {
                    padding: 10px;
                    overflow-y: auto;
                    flex-grow: 1;
                    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
                    white-space: pre-wrap;
                    word-break: break-all;
                    font-size: 13px;
                    line-height: 1.5;
                    color: #333;
                }
                .tattl {
                    height: 72px;
                }
            `;
            document.head.appendChild(style);
        },
        initPanel: function () {
            if (document.getElementById(panelId)) return;

            const div = document.createElement('div');
            div.id = panelId;

            // 恢复位置
            const savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY_POS) || '{"top": "20px", "left": "20px"}');
            div.style.top = savedPos.top;
            div.style.left = savedPos.left;

            // 恢复折叠状态
            const isMinimized = localStorage.getItem(STORAGE_KEY_MINIMIZED) === 'true';
            if (isMinimized) div.classList.add('minimized');

            div.innerHTML = `
                <div class="panel-header" title="双击折叠/展开">
                    <span>98助手</span>
                    <span class="toggle-btn" title="折叠/展开">${isMinimized ? '+' : '-'}</span>
                </div>
                <div class="panel-content">
                    <div>
                        <select id="mode-select">
                            <option value="opacity">透明</option>
                            <option value="hidden">隐藏</option>
                            <option value="strikethrough">删除线</option>
                            <option value="opacity-strike">透明+线</option>
                            <option value="yellow">变黄</option>
                            <option value="show">显示</option>
                        </select>
                    </div>
                    <div class="stat-row">
                        已阅: <span id="visited-count">0</span>
                    </div>
                </div>
            `;
            document.body.appendChild(div);

            // 绑定事件
            const select = div.querySelector('#mode-select');
            select.value = currentMode;
            select.addEventListener('change', (e) => {
                this.applyMode(e.target.value);
            });

            // 折叠逻辑
            const toggleBtn = div.querySelector('.toggle-btn');
            const header = div.querySelector('.panel-header');

            const toggleMin = () => {
                div.classList.toggle('minimized');
                const isMin = div.classList.contains('minimized');
                toggleBtn.innerText = isMin ? '+' : '-';
                localStorage.setItem(STORAGE_KEY_MINIMIZED, isMin);
            };

            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止触发拖拽
                toggleMin();
            });

            header.addEventListener('dblclick', toggleMin);

            // 初始化当前模式
            this.applyMode(currentMode);
            this.makeDraggable(div);
        },
        makeDraggable: function (element) {
            const header = element.querySelector('.panel-header');
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('toggle-btn')) return;

                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = element.getBoundingClientRect();
                initialLeft = rect.left;
                initialTop = rect.top;

                header.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                const newLeft = initialLeft + dx;
                const newTop = initialTop + dy;

                element.style.left = `${newLeft}px`;
                element.style.top = `${newTop}px`;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    header.style.cursor = 'move';
                    // 保存位置
                    localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({
                        top: element.style.top,
                        left: element.style.left
                    }));
                }
            });
        }
    };

    // TXT预览工具类
    const txtPreviewTools = {
        init: function() {
            // 查找所有附件链接
            const links = document.querySelectorAll('a[href*="mod=attachment"]');

            links.forEach(link => {
                // 检查是否已经处理过
                if (link.dataset.hasPreviewBtn) return;

                // 获取文件名
                let fileName = link.innerText.trim();
                if (!fileName && link.querySelector('span')) {
                    fileName = link.querySelector('span').innerText.trim();
                }

                // 检查是否是 txt 文件
                if (fileName && fileName.toLowerCase().endsWith('.txt')) {
                    console.log('98助手 TXT预览: 发现TXT附件:', fileName);
                    this.addPreviewButton(link, fileName);
                    link.dataset.hasPreviewBtn = 'true';
                }
            });
        },

        addPreviewButton: function(linkElement, fileName) {
            const self = this;
            const btn = document.createElement('span');
            btn.className = 'txt-preview-btn';
            btn.innerText = '[预览内容]';
            btn.title = '点击预览 TXT 内容';

            btn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.togglePreview(linkElement, btn, fileName);
            };

            // 创建包裹容器 div
            const wrapper = document.createElement('div');
            wrapper.className = 'txt-preview-btn-wrapper';
            wrapper.appendChild(btn);

            // 尝试插入到 linkElement 父元素的后面
            const parent = linkElement.parentNode;

            if (parent && parent.parentNode) {
                parent.parentNode.insertBefore(wrapper, parent.nextSibling);
            } else if (parent) {
                parent.appendChild(wrapper);
            }
        },

        togglePreview: function(linkElement, btn, fileName) {
            // 检查按钮上是否已经挂载了预览框引用
            if (btn._previewBox && document.body.contains(btn._previewBox)) {
                // 如果存在且在 DOM 中，则移除（关闭）
                btn._previewBox.remove();
                btn._previewBox = null;
                btn.innerText = '[预览内容]';
            } else {
                // 如果不存在，则创建并加载
                btn.innerText = '[加载中...]';
                this.fetchAndShow(linkElement.href, btn, fileName);
            }
        },

        fetchAndShow: function(url, btn, fileName) {
            const self = this;
            console.log('98助手 TXT预览: 正在获取:', url);

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "arraybuffer",
                timeout: 20000,
                anonymous: false,
                headers: {
                    "Referer": window.location.href,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
                },
                onload: function(response) {
                    console.log('98助手 TXT预览: 响应状态:', response.status);

                    if (response.status >= 200 && response.status < 300) {
                        const buffer = response.response;
                        if (!buffer) {
                            btn.innerText = '[预览失败: 空内容]';
                            return;
                        }

                        let text = '';

                        // 智能解码
                        try {
                            const utf8Decoder = new TextDecoder('utf-8', { fatal: true });
                            text = utf8Decoder.decode(buffer);
                        } catch (e) {
                            try {
                                const gbkDecoder = new TextDecoder('gbk');
                                text = gbkDecoder.decode(buffer);
                            } catch (e2) {
                                text = "解码失败: " + e2.message;
                            }
                        }

                        // BOM 处理
                        if (text.charCodeAt(0) === 0xFEFF) {
                            text = text.slice(1);
                        }

                        // HTML 错误页检测
                        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html') || text.includes('alert_error') || text.includes('alert_info')) {
                            try {
                                let parser = new DOMParser();
                                let doc = parser.parseFromString(text, "text/html");
                                let errorMsg = doc.querySelector('.alert_error, .alert_info, .alert_btnleft, #messagetext');
                                if (errorMsg) {
                                    text = "无法预览：\n" + errorMsg.innerText.trim();
                                } else {
                                    let title = doc.querySelector('title');
                                    let titleText = title ? title.innerText : '未知页面';
                                    text = "无法预览：返回的是网页。\n标题：" + titleText + "\n\n预览片段：\n" + text.substring(0, 200) + "...";
                                }
                            } catch (e) {
                                text = "无法预览：返回内容解析失败。\n" + text.substring(0, 200);
                            }
                        }

                        self.showBox(text, btn, fileName);
                    } else {
                        btn.innerText = '[预览失败]';
                        alert('加载失败，状态码：' + response.status + '\n请检查是否需要登录或权限。');
                    }
                },
                onerror: function(err) {
                    btn.innerText = '[预览失败]';
                    console.error('98助手 TXT预览: 网络错误', err);
                    alert('请求出错，请查看控制台');
                },
                ontimeout: function() {
                    btn.innerText = '[预览失败]';
                    alert('请求超时，请重试');
                }
            });
        },

        showBox: function(content, btn, fileName) {
            const self = this;
            btn.innerText = '[关闭预览]';

            // 容器
            const box = document.createElement('div');
            box.className = 'txt-preview-box';

            // 顶部栏
            const header = document.createElement('div');
            header.className = 'txt-preview-header';

            // 左侧包裹（复制按钮+标题）
            const headerLeft = document.createElement('div');
            headerLeft.style.display = 'flex';
            headerLeft.style.alignItems = 'center';
            headerLeft.style.flex = '1';
            headerLeft.style.minWidth = '0';

            // 复制按钮
            const copyBtn = document.createElement('span');
            copyBtn.className = 'txt-preview-copy';
            copyBtn.innerText = '复制全部';
            copyBtn.title = '复制当前预览内容';
            copyBtn.onclick = function() {
                const textToCopy = content;
                const originalText = copyBtn.innerText;

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        success();
                    }).catch(() => {
                        fallback();
                    });
                } else {
                    fallback();
                }

                function success() {
                    copyBtn.innerText = '已复制';
                    copyBtn.style.backgroundColor = '#4CAF50';
                    copyBtn.style.borderColor = '#4CAF50';
                    setTimeout(() => {
                        copyBtn.innerText = originalText;
                        copyBtn.style.backgroundColor = '';
                        copyBtn.style.borderColor = '';
                    }, 2000);
                }

                function fallback() {
                    const textArea = document.createElement("textarea");
                    textArea.value = textToCopy;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-9999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        if(document.execCommand('copy')) {
                            success();
                        } else {
                            fail();
                        }
                    } catch (err) {
                        fail();
                    }
                    document.body.removeChild(textArea);
                }

                function fail() {
                    copyBtn.innerText = '失败';
                    setTimeout(() => copyBtn.innerText = originalText, 2000);
                }
            };

            // 标题
            const titleSpan = document.createElement('span');
            titleSpan.className = 'txt-preview-title';
            titleSpan.innerText = fileName || '文本预览';
            titleSpan.title = fileName || '文本预览';

            headerLeft.appendChild(copyBtn);
            headerLeft.appendChild(titleSpan);

            // 关闭按钮
            const closeBtn = document.createElement('span');
            closeBtn.className = 'txt-preview-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.title = '关闭';
            closeBtn.onclick = function() {
                box.remove();
                btn._previewBox = null;
                btn.innerText = '[预览内容]';
            };

            header.appendChild(headerLeft);
            header.appendChild(closeBtn);

            // 内容区域
            const contentDiv = document.createElement('div');
            contentDiv.className = 'txt-preview-content';
            contentDiv.innerText = content;

            box.appendChild(header);
            box.appendChild(contentDiv);

            // 插入到 body
            document.body.appendChild(box);

            // 挂载引用
            btn._previewBox = box;

            // 计算位置
            this.updateBoxPosition(btn, box);
        },

        updateBoxPosition: function(btn, box) {
            const rect = btn.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            let top = rect.bottom + scrollTop + 5;
            let left = rect.left + scrollLeft;

            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

            if (left + 400 > viewportWidth) {
                left = Math.max(10, viewportWidth - 420);
            }

            box.style.top = top + 'px';
            box.style.left = left + 'px';
        }
    };

    // 业务逻辑
    const core = {
        getIdByUrl: (url, key, regex) => {
            try {
                let uri = new URL(url);
                if (uri.href.indexOf(key) > -1) {
                    const match = uri.href.match(regex);
                    if (match) {
                        return match[1];
                    }
                }
            } catch (e) {
                // 忽略无效URL
            }
            return null;
        },
        getId: function (url) {
            if (!url) {
                url = document.URL;
            }
            var id = this.getIdByUrl(url, "tid=", /tid=(\d+)/);
            return id;
        },
        // 处理单个帖子元素（可能是 tr 或 tbody）
        processItem: async function(item) {
            // 避免重复处理
            if (item.dataset.processed) return;

            let a = item.querySelector("a.xst") || item.querySelector("a.z") || (item.querySelectorAll("a")[1]);

            // 排除一些非帖子链接
            if (!a || a.href.indexOf("tid=") === -1) return;

            item.dataset.processed = "true";
            let id = this.getId(a.href);

            if (id) {
                // 绑定点击事件
                a.addEventListener("mousedown", (e) => {
                    // 只处理左键(0)和中键(1)
                    if (e.button !== 0 && e.button !== 1) return;

                    dbTools.add(id);

                    // 延迟执行隐藏逻辑
                    setTimeout(() => {
                        this.applyVisitedState(item);
                        hiddenCount++;
                        uiTools.updateCount();
                    }, 1000);
                });

                // 检查是否已读
                const hasVisited = await dbTools.has(id);
                if (hasVisited) {
                    this.applyVisitedState(item);
                    hiddenCount++;
                    uiTools.updateCount();
                }
            }
        },

        // 应用已读状态（隐藏/变色等）
        applyVisitedState: function(item) {
            // 1. 标记当前元素 (通常是 tr 或 tbody)
            item.classList.add(visitedClass);

            // 2. 如果当前元素在 tbody 中，也标记 tbody (适配部分 Discuz 结构)
            if (item.tagName === 'TR' && item.parentElement.tagName === 'TBODY') {
                item.parentElement.classList.add(visitedClass);
            }

            // 3. 查找并处理关联的预览图 (imagePreviewTbody)
            // 预览图通常紧跟在帖子 tbody 后面，或者在 tr 后面
            let nextEl = item.nextElementSibling || (item.parentElement ? item.parentElement.nextElementSibling : null);

            // 辅助函数：检查是否是预览图容器
            const isPreview = (el) => el && el.id === 'imagePreviewTbody';

            if (isPreview(nextEl)) {
                nextEl.classList.add(visitedClass);
            } else {
                // 如果当前没有预览图，可能是 AJAX 还没加载，需要监听父容器
                const parent = item.parentElement?.parentElement || item.parentElement; // table 或 tbody
                if (parent) {
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            mutation.addedNodes.forEach((node) => {
                                if (node.nodeType === 1 && isPreview(node)) {
                                    // 检查这个新插入的预览图是否属于当前帖子
                                    // 通常通过位置判断：它是 item 的下一个兄弟
                                    if (node === item.nextElementSibling || (item.parentElement && node === item.parentElement.nextElementSibling)) {
                                        node.classList.add(visitedClass);
                                        observer.disconnect(); // 找到后停止监听
                                    }
                                }
                            });
                        });
                    });
                    observer.observe(parent, { childList: true });
                }
            }
        },

        // 隐藏列表中的已读项
        hideVisited: async function () {
            // 如果是详情页，不执行隐藏，但要记录ID，同时初始化TXT预览
            if (document.URL.indexOf("mod=viewthread") > -1 || document.URL.indexOf("tid=") > -1) {
                let id = this.getId(document.URL);
                if (id) {
                    await dbTools.add(id);
                    console.log("已记录当前页面 ID:", id);
                }
                // 详情页也需要样式（用于TXT预览）
                uiTools.initStyle();
                // 初始化TXT预览
                txtPreviewTools.init();
                // 监听动态加载的附件
                const postContainer = document.querySelector("#postlist") || document.body;
                const txtObserver = new MutationObserver(() => {
                    txtPreviewTools.init();
                });
                txtObserver.observe(postContainer, { childList: true, subtree: true });
                return;
            }

            // 列表页才初始化完整面板
            uiTools.initStyle();
            uiTools.initPanel();

            // 列表页处理逻辑
            if (document.URL.indexOf("forum.php") > -1) {
                // 1. 处理静态存在的帖子
                const processAll = () => {
                    // 兼容 tbody 和 tr 两种结构
                    // Discuz 默认列表通常是 table > tbody[id^="normalthread_"] > tr
                    // 瀑布流模式是 li
                    const items = document.querySelectorAll("tbody[id^='normalthread_'] tr, table tr th.common, #waterfall li");
                    items.forEach(item => this.processItem(item));
                };

                processAll();

                // 2. 监听整个列表容器，处理 AJAX 加载的新帖子 (翻页/自动加载)
                const listContainer = document.querySelector("#threadlisttableid") || document.querySelector("#waterfall");
                if (listContainer) {
                    const listObserver = new MutationObserver((mutations) => {
                        // 简单粗暴：有变化就重新扫描一遍，processItem 内部有防重机制
                        processAll();
                    });
                    listObserver.observe(listContainer, { childList: true, subtree: true });
                }
            }
        },
        start: async function () {
            await dbTools.init();
            await this.hideVisited();
            console.log("98助手 v2.2.0 启动完成 (已访问隐藏 + TXT预览)");
        }
    };

    // 启动
    setTimeout(() => {
        // 检查标题是否包含“98堂”
        if (document.title.indexOf("98堂") === -1) {
             console.log("标题不包含98堂，插件不运行");
             return;
        }
        core.start();
    }, 500);

})();
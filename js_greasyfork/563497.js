// ==UserScript==
// @name         生意参谋全貌数据自动获取(含图片报表)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动翻页获取生意参谋全部数据，并生成包含图片的可视化HTML报表
// @author       Antigravity
// @match        *://sycm.taobao.com/*
// @license
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563497/%E7%94%9F%E6%84%8F%E5%8F%82%E8%B0%8B%E5%85%A8%E8%B2%8C%E6%95%B0%E6%8D%AE%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%28%E5%90%AB%E5%9B%BE%E7%89%87%E6%8A%A5%E8%A1%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563497/%E7%94%9F%E6%84%8F%E5%8F%82%E8%B0%8B%E5%85%A8%E8%B2%8C%E6%95%B0%E6%8D%AE%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%28%E5%90%AB%E5%9B%BE%E7%89%87%E6%8A%A5%E8%A1%A8%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置项
    const CONFIG = {
        maxPages: 15, // 最大抓取页数
        nextBtnSelector: '.ant-pagination-next', // 下一页按钮
        tableSelector: '.ant-table-wrapper', // 表格容器
        rowSelector: '.ant-table-row', // 行选择器
        // 排除的列文字 (比如 "操作")
        excludeColumns: ['操作']
    };

    let collectedData = [];
    let isProcessing = false;

    // ────────────────────────────
    // IndexedDB 历史记录管理 (解决大数据存储问题)
    // ────────────────────────────
    const DB_NAME = 'SycmScraperDB_v2';
    const DB_VERSION = 1;

    const DB = {
        open: () => {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('history')) {
                        db.createObjectStore('history', { keyPath: 'id' });
                    }
                };
            });
        },
        add: async (item) => {
            const db = await DB.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('history', 'readwrite');
                const store = tx.objectStore('history');
                const request = store.add(item);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        },
        // 获取所有记录的元数据 (不含详细 data)
        getAllMeta: async () => {
            const db = await DB.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('history', 'readonly');
                const store = tx.objectStore('history');
                const request = store.openCursor(null, 'prev'); // 倒序
                const results = [];
                request.onsuccess = (e) => {
                    const cursor = e.target.result;
                    if (cursor) {
                        const { id, time, count } = cursor.value;
                        results.push({ id, time, count });
                        if (results.length < 20) { // 限制列表显示最近 20 条
                            cursor.continue();
                        } else {
                            resolve(results);
                        }
                    } else {
                        resolve(results);
                    }
                };
                request.onerror = () => reject(request.error);
            });
        },
        get: async (id) => {
            const db = await DB.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('history', 'readonly');
                const store = tx.objectStore('history');
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        },
        cleanup: async (limit = 10) => {
            const db = await DB.open();
            return new Promise((resolve, reject) => {
                const tx = db.transaction('history', 'readwrite');
                const store = tx.objectStore('history');
                // 获取所有 Key (默认升序，即时间旧->新)
                const keyReq = store.getAllKeys();
                keyReq.onsuccess = () => {
                    const keys = keyReq.result;
                    if (keys.length > limit) {
                        const keysToDelete = keys.slice(0, keys.length - limit);
                        let deletedCount = 0;
                        keysToDelete.forEach(k => {
                            store.delete(k);
                            deletedCount++;
                        });
                        console.log(`清理了 ${deletedCount} 条旧记录`);
                    }
                    resolve();
                };
                keyReq.onerror = () => reject(keyReq.error);
            });
        }
    };

    async function saveToHistory(data) {
        if (!data || data.length === 0) return;
        try {
            const newItem = {
                id: Date.now(),
                time: new Date().toLocaleString(),
                count: data.length,
                data: data
            };
            await DB.add(newItem);
            await DB.cleanup(10); // 保留最近 10 条
            updateHistoryUI();
        } catch (e) {
            console.error('保存历史记录失败:', e);
            alert('保存历史记录失败 (Into DB): ' + e.message);
        }
    }

    async function loadHistoryItem(id) {
        try {
            updateStatus('正在从数据库加载...', 0.5);
            const item = await DB.get(id);
            if (item) {
                collectedData = item.data;
                updateStatus(`已加载历史数据: ${item.time} (${item.count}条)`, 1);
                document.getElementById('sycm-result-area').style.display = 'block';
            } else {
                alert('未找到该记录');
            }
        } catch (e) {
            console.error(e);
            alert('读取记录失败');
        }
    }


    // 创建UI界面
    function createUI() {
        // 移除旧元素避免重复
        const existingPanel = document.getElementById('sycm-panel');
        if (existingPanel) {
            existingPanel.style.display = 'block'; // 重新显示
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'sycm-panel';
        panel.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 2147483647;
            background: white;
            padding: 16px;
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            width: 220px;
            text-align: left;
            user-select: none;
        `;
        // header 部分添加 cursor: move
        panel.innerHTML = `
            <div id="sycm-drag-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #f0f0f0;padding-bottom:8px;cursor:move;">
                <h3 style="margin:0;font-size:16px;font-weight:600;color:#333;">📊 数据全貌采集</h3>
                <span id="sycm-close" style="cursor:pointer;color:#999;font-size:18px;">&times;</span>
            </div>
            
            <div style="margin-bottom:12px;">
                <label style="font-size:13px;color:#666;">采集页数:</label>
                <input type="number" id="sycm-max-pages" value="${CONFIG.maxPages}" min="1" style="
                    width:60px;
                    margin-left:8px;
                    border:1px solid #d9d9d9;
                    border-radius:4px;
                    padding:4px;
                ">
            </div>

            <div id="sycm-progress-bar" style="
                width: 100%;
                height: 6px;
                background: #f5f5f5;
                border-radius: 3px;
                margin-bottom: 8px;
                overflow: hidden;
                display: none;
            ">
                <div id="sycm-progress-inner" style="
                    width: 0%;
                    height: 100%;
                    background: #1890ff;
                    transition: width 0.3s ease;
                "></div>
            </div>

            <div id="sycm-status" style="margin-bottom:12px;color:#888;font-size:12px;">准备就绪</div>
            
            <button id="sycm-start-btn" style="
                background: #1890ff;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-weight: 500;
                transition: all 0.3s;
            ">开始一键采集</button>

            <div id="sycm-result-area" style="display:none; margin-top:10px; border-top:1px solid #f0f0f0; padding-top:10px;">
                <button id="sycm-view-report" style="
                    background: #52c41a;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                    margin-bottom: 8px;
                ">打开独立报表窗口</button>
                
                <button id="sycm-export-csv" style="
                    background: #fff;
                    color: #555;
                    border: 1px solid #d9d9d9;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                ">仅导出 CSV</button>
            </div>

            <!-- 历史记录区域 -->
            <div style="margin-top:12px; border-top:1px solid #f0f0f0; padding-top:8px;">
                <button id="sycm-history-btn" style="background:#f5f5f5; border:1px solid #d9d9d9; color:#666; width:100%; padding:6px; border-radius:4px; cursor:pointer; font-size:12px;">📂 查看最近历史记录</button>
                <div id="sycm-history-list" style="display:none; margin-top:8px; max-height:150px; overflow-y:auto; background:#fafafa; border:1px solid #eee; border-radius:4px;"></div>
            </div>
        `;
        document.body.appendChild(panel);

        // 绑定事件
        document.getElementById('sycm-start-btn').onclick = startScraping;
        document.getElementById('sycm-view-report').onclick = generateAndOpenReport;
        document.getElementById('sycm-export-csv').onclick = exportCSV;
        document.getElementById('sycm-close').onclick = () => panel.style.display = 'none';

        // 历史记录开关
        const historyBtn = document.getElementById('sycm-history-btn');
        const historyList = document.getElementById('sycm-history-list');
        historyBtn.onclick = () => {
            const isVisible = historyList.style.display === 'block';
            historyList.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) updateHistoryUI();
        };

        updateHistoryUI();

        // 鼠标悬停效果
        const btns = panel.querySelectorAll('button');
        btns.forEach(btn => {
            btn.onmouseover = () => { if (!btn.disabled) btn.style.opacity = '0.8'; };
            btn.onmouseout = () => { if (!btn.disabled) btn.style.opacity = '1'; };
        });

        // ────────────────────────────
        // 拖拽功能实现
        // ────────────────────────────
        const header = document.getElementById('sycm-drag-header');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        header.addEventListener("mousedown", dragStart);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("mousemove", drag);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                // 避免关闭按钮触发拖拽
                if (e.target.id === 'sycm-close') return;
                isDragging = true;
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, panel);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    function updateStatus(text, progress = 0) {
        const el = document.getElementById('sycm-status');
        const bar = document.getElementById('sycm-progress-inner');
        const barContainer = document.getElementById('sycm-progress-bar');

        if (el) el.innerText = text;
        if (progress > 0) {
            barContainer.style.display = 'block';
            bar.style.width = `${progress * 100}%`;
        }
    }

    async function updateHistoryUI() {
        const list = document.getElementById('sycm-history-list');
        if (!list) return;

        try {
            const history = await DB.getAllMeta();
            if (history.length === 0) {
                list.innerHTML = '<div style="padding:8px;color:#999;text-align:center;">暂无记录</div>';
                return;
            }

            let html = '';
            history.forEach(item => {
                html += `
                    <div class="history-item" data-id="${item.id}" style="padding:6px 8px; border-bottom:1px solid #eee; cursor:pointer; font-size:12px; display:flex; justify-content:space-between;">
                        <span style="color:#1890ff;">${item.time.split(' ')[0]}</span>
                        <span>${item.count}条</span>
                    </div>
                `;
            });
            list.innerHTML = html;

            list.querySelectorAll('.history-item').forEach(el => {
                el.onclick = () => {
                    loadHistoryItem(parseInt(el.dataset.id));
                    list.style.display = 'none'; // 加载后关闭列表
                };
                el.onmouseover = () => el.style.background = '#e6f7ff';
                el.onmouseout = () => el.style.background = 'transparent';
            });
        } catch (e) {
            console.error('更新历史记录界面失败:', e);
            list.innerHTML = '<div style="padding:8px;color:#f5222d;text-align:center;">读取历史记录失败</div>';
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ────────────────────────────
    // 核心采集逻辑
    // ────────────────────────────
    async function startScraping() {
        if (isProcessing) return;
        isProcessing = true;
        collectedData = [];

        const maxPages = parseInt(document.getElementById('sycm-max-pages').value) || 15;
        const btn = document.getElementById('sycm-start-btn');
        const resultArea = document.getElementById('sycm-result-area');

        btn.disabled = true;
        btn.innerText = '采集中...';
        btn.style.background = '#ccc';
        resultArea.style.display = 'none';

        try {
            for (let i = 1; i <= maxPages; i++) {
                updateStatus(`正在获取第 ${i} / ${maxPages} 页数据...`, (i - 1) / maxPages);

                // 1. 等待列表加载 (简单的检查)
                await sleep(1000);

                // 2. 抓取数据
                const pageData = scrapeCurrentPage();
                if (pageData.length === 0) {
                    console.warn(`第 ${i} 页数据为空`);
                }
                collectedData.push(...pageData);

                // 3. 翻页
                if (i < maxPages) {
                    const hasNext = await clickNextPage();
                    if (!hasNext) {
                        updateStatus(`已到达最后一页 (第 ${i} 页)`);
                        break;
                    }
                    // 翻页后等待加载
                    await sleep(3000);
                }
            }

            updateStatus(`采集完成! 共 ${collectedData.length} 条数据`, 1);
            await saveToHistory(collectedData); // 保存到历史
            resultArea.style.display = 'block';

        } catch (e) {
            console.error(e);
            updateStatus(`出错: ${e.message}`);
        } finally {
            isProcessing = false;
            btn.disabled = false;
            btn.innerText = '重新采集';
            btn.style.background = '#1890ff';
        }
    }

    // 抓取单页数据 (保留图片链接)
    function scrapeCurrentPage() {
        const rows = document.querySelectorAll(CONFIG.rowSelector);
        const headers = [];

        // 获取表头
        const thead = document.querySelector('.ant-table-thead');
        if (thead) {
            thead.querySelectorAll('th').forEach(th => {
                headers.push(th.innerText.replace(/[\r\n]/g, '').trim());
            });
        }

        const data = [];
        rows.forEach(row => {
            const rowObj = {};
            const cells = row.querySelectorAll('td');

            cells.forEach((cell, index) => {
                let header = headers[index] || `Temp_${index}`;

                // 如果是排除的列，跳过
                if (CONFIG.excludeColumns.includes(header)) return;

                // 提取图片
                const imgTag = cell.querySelector('img');
                let imgUrl = '';
                if (imgTag) {
                    // 优先取 src，有些图片可能是懒加载 data-src
                    imgUrl = imgTag.getAttribute('src') || imgTag.getAttribute('data-src') || '';
                    if (imgUrl && imgUrl.startsWith('//')) {
                        imgUrl = 'https:' + imgUrl;
                    }
                    // 尝试获取高清大图 (去除 _36x36.jpg 后缀)
                    // 例如: .../abc.jpg_36x36.jpg -> .../abc.jpg
                    // imgUrl = imgUrl.replace(/_\d+x\d+\.(jpg|png|webp)$/i, '');
                    // 注意：保留原图可能图片过大，这里看需求，暂时保留原样或者适当处理
                }

                // 提取链接 (新增)
                let linkUrl = '';
                const linkTag = cell.querySelector('a');
                if (linkTag && linkTag.href && !linkTag.href.includes('javascript:')) {
                    linkUrl = linkTag.href;
                }

                // 提取文本
                let text = cell.innerText.replace(/[\r\n]+/g, ' ').trim();

                // 如果该单元格有图片，保存结构化对象
                // 否则保存纯文本
                if (imgUrl) {
                    rowObj[header] = {
                        type: 'mixed',
                        text: text,
                        text: text,
                        img: imgUrl,
                        url: linkUrl
                    };
                } else {
                    rowObj[header] = {
                        type: 'text',
                        text: text
                    };
                }
            });

            if (Object.keys(rowObj).length > 0) {
                data.push(rowObj);
            }
        });

        return data;
    }

    // 点击下一页
    async function clickNextPage() {
        const nextBtn = document.querySelector(CONFIG.nextBtnSelector);
        if (!nextBtn) return false;

        // 检查disabled状态
        if (nextBtn.getAttribute('aria-disabled') === 'true' ||
            nextBtn.disabled ||
            nextBtn.classList.contains('ant-pagination-disabled')) {
            return false;
        }

        nextBtn.click();
        return true;
    }

    // ────────────────────────────
    // 导出功能
    // ────────────────────────────

    // 生成并打开 独立HTML报表窗口
    function generateAndOpenReport() {
        if (!collectedData || collectedData.length === 0) {
            alert('暂无数据');
            return;
        }

        const headers = Object.keys(collectedData[0]);
        const dateStr = new Date().toLocaleString();

        let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>生意参谋数据全貌 - ${dateStr}</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
    <style>
        :root { --primary-color: #1890ff; --bg-color: #f0f2f5; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 0; margin: 0; background: var(--bg-color); height: 100vh; display: flex; flex-direction: column; }
        
        /* 顶部导航栏 */
        .header { background: #fff; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,21,41,.08); z-index: 10; flex-shrink: 0; }
        .brand { font-size: 20px; font-weight: 600; color: #001529; display: flex; align-items: center; }
        .brand span { margin-left: 8px; }
        .header-actions button { margin-left: 12px; cursor: pointer; padding: 6px 16px; border-radius: 4px; border: 1px solid #d9d9d9; background: #fff; transition: all 0.3s; }
        .header-actions .btn-primary { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
        .header-actions .btn-primary:hover { background: #40a9ff; border-color: #40a9ff; }
        
        /* 主内容区域 - 独立滚动 */
        .main-content { flex: 1; overflow: auto; padding: 24px; }
        .card { background: #fff; border-radius: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); padding: 24px; min-width: 1000px; }
        
        .info-bar { margin-bottom: 16px; color: #666; font-size: 14px; display: flex; justify-content: space-between; align-items: center; background: #fafafa; padding: 12px; border-radius: 4px; border: 1px solid #f0f0f0; }

        /* 筛选栏 */
        .filter-bar { display: flex; gap: 12px; margin-bottom: 16px; background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #eee; }
        .filter-input { padding: 6px 12px; border: 1px solid #d9d9d9; border-radius: 4px; width: 200px; font-size: 14px; transition: all 0.3s; }
        .filter-input:focus { border-color: #1890ff; outline: none; box-shadow: 0 0 0 2px rgba(24,144,255,0.2); }

        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; table-layout: fixed; }
        th { background: #fafafa; color: #555; font-weight: 600; padding: 12px 10px; text-align: left; border-bottom: 1px solid #e8e8e8; position: sticky; top: 0; z-index: 2; box-shadow: 0 1px 0 #e8e8e8; }
        td { padding: 12px 10px; border-bottom: 1px solid #e8e8e8; color: #333; vertical-align: middle; word-wrap: break-word; }
        tr:hover { background: #e6f7ff; }
        
        /* 图片样式 */
        /* 图片样式 */
        .cell-img { width: 48px; height: 48px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; display: block; cursor: zoom-in; }
        .cell-content { display: flex; align-items: center; }
        
        .img-wrapper { position: relative; display: inline-block; margin-right: 12px; }
        .img-wrapper:hover .copy-btn { display: block; }
        .copy-btn {
            display: none;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(0,0,0,0.6);
            color: white;
            border: none;
            font-size: 10px;
            padding: 2px 0;
            text-align: center;
            cursor: pointer;
            z-index: 5;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
        }
        .copy-btn:hover { background: rgba(0,0,0,0.8); }
        
        /* 榜单控件样式 */
        .rank-btn { padding: 4px 8px; font-size: 12px; border: 1px solid #d9d9d9; background: #fff; border-radius: 3px; cursor: pointer; margin-right: 4px; }
        .rank-btn.active { background: #e6f7ff; color: #1890ff; border-color: #1890ff; }
        .rank-btn:hover { color: #40a9ff; border-color: #40a9ff; }
        
        /* 预览浮层 */
        #preview-popup { position: fixed; z-index: 10000; background: #fff; padding: 4px; border-radius: 4px; box-shadow: 0 6px 16px rgba(0,0,0,0.12); border: 1px solid #f0f0f0; display: none; pointer-events: none; }
        #preview-popup img { max-width: 800px; max-height: 800px; display: block; border-radius: 2px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        /* 标签页导航 */
        .tabs { display: flex; padding: 0 24px; background: #fff; border-bottom: 1px solid #f0f0f0; margin-top: 1px; }
        .tab-item { padding: 16px 24px; cursor: pointer; color: #666; font-weight: 500; border-bottom: 2px solid transparent; transition: all 0.3s; }
        .tab-item:hover { color: #1890ff; }
        .tab-item.active { color: #1890ff; border-bottom-color: #1890ff; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">
            <svg viewBox="0 0 1024 1024" width="24" height="24" style="fill:#1890ff"><path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zM338 736H206V384h132v352zm278 0H484V288h132v448zm278 0H762V480h132v256z"/></svg>
            <span>生意参谋 - 数据洞察中心</span>
        </div>
        <div class="header-actions">
           <span style="margin-right:15px;color:#888;font-size:13px;">${dateStr}</span>
           <button onclick="window.print()">打印报表</button>
           <button class="btn-primary" id="save-btn">保存为HTML</button>
        </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
        <div class="tab-item active" onclick="switchTab('view-products', this)">📊 商品明细分析</div>
        <div class="tab-item" onclick="switchTab('view-shop-rank', this)">🏆 店铺上榜分析</div>
        <div class="tab-item" onclick="switchTab('view-dashboard', this)">🚀 动态数据大屏</div>
    </div>

    <div class="main-content">
        <!-- 视图1: 商品明细 -->
        <div id="view-products" class="tab-content">
            <div class="card">
            <div class="info-bar">
                <span><strong>数据统计：</strong> 共采集 ${collectedData.length} 条商品/数据记录</span>
                <span>来源：生意参谋 (Sycm)</span>
            </div>
            
            <div class="filter-bar" style="flex-wrap: wrap; align-items:center;">
                <input type="text" id="filter-title" class="filter-input" placeholder="🔍 筛选 商品标题 / 名称...">
                <input type="text" id="filter-shop" class="filter-input" placeholder="🏪 筛选 店铺名称...">
                
                <div id="shop-rank-controls" style="display:none; border-left:1px solid #eee; padding-left:12px; margin-left:12px; align-items:center;">
                    <span style="font-weight:600; color:#555; font-size:13px; margin-right:8px;">🏆 店铺榜单:</span>
                    <button class="rank-btn" onclick="applyShopRank(10)">Top 10</button>
                    <button class="rank-btn" onclick="applyShopRank(20)">Top 20</button>
                    <input type="number" id="rank-custom-val" placeholder="N" style="width:40px; padding:4px; border:1px solid #d9d9d9; border-radius:3px; font-size:12px; margin-right:4px;">
                    <button class="rank-btn" onclick="applyShopRank(document.getElementById('rank-custom-val').value)">Go</button>
                    <button class="rank-btn" onclick="applyShopRank(0)">全部</button>
                    <span id="shop-stat-info" style="font-size:12px; color:#888; margin-left:8px;"></span>
                </div>
            </div>

            <table id="data-table">
                <thead>
                    <tr>
                        <th style="width: 50px;">NO.</th>
                        ${headers.map(h => `<th style="${h.length > 10 ? 'width:200px' : ''}">${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        collectedData.forEach((row, index) => {
            html += `<tr><td>${index + 1}</td>`;
            headers.forEach(header => {
                const cell = row[header];
                if (!cell) {
                    html += `<td>-</td>`;
                    return;
                }

                if (cell.type === 'mixed' && cell.img) {
                    const largeImg = cell.img.replace(/_\d+x\d+\.(jpg|png|webp|jpeg)$/i, '');
                    // 构建内容HTML，存在链接则包裹a标签
                    const contentHtml = `
                        <div class="cell-content">
                            <div class="img-wrapper">
                                <img src="${cell.img}" class="cell-img" loading="lazy" data-large-src="${largeImg}">
                                <button class="copy-btn" onclick="event.preventDefault(); event.stopPropagation(); copyImage('${largeImg}')">复制图片</button>
                            </div>
                            <span class="text-only" style="${cell.url ? 'text-decoration:underline;color:#1890ff;' : ''}">${cell.text}</span>
                        </div>
                    `;

                    if (cell.url) {
                        html += `<td><a href="${cell.url}" target="_blank" style="text-decoration:none; color:inherit; display:block;">${contentHtml}</a></td>`;
                    } else {
                        html += `<td>${contentHtml}</td>`;
                    }
                } else {
                    html += `<td class="text-only">${cell.text}</td>`;
                }
            });
            html += `</tr>`;
        });

        html += `
                </tbody>
            </table>
            </div>
        </div>

        <!-- 视图2: 店铺榜单 -->
        <div id="view-shop-rank" class="tab-content" style="display:none;">
            <div class="card">
                <div class="info-bar">
                    <span><strong>店铺分析：</strong> 按照每家店铺上榜的商品数量进行排名</span>
                </div>
                <table id="shop-rank-table">
                    <thead>
                        <tr>
                            <th style="width:80px;">排名</th>
                            <th>店铺名称</th>
                            <th style="width:150px;">上榜商品数</th>
                            <th style="width:200px;">占比 (总数: ${collectedData.length})</th>
                            <th style="width:120px;">操作</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        
        <!-- 视图3: 动态大屏 -->
        <div id="view-dashboard" class="tab-content" style="display:none; padding-bottom: 50px;">
            <!-- 图表行 1 -->
            <div class="card" style="margin-bottom: 24px;">
                <div class="info-bar">
                    <span><strong>📈 店铺上榜数量排名 (Top 30)</strong> - 可缩放查看</span>
                </div>
                <div id="chart-shop-bar" style="width: 100%; height: 500px;"></div>
            </div>

            <!-- 图表行 2 -->
             <div class="card">
                <div class="info-bar">
                    <span><strong>🍰 头部店铺市场占比 (Top 10 vs 其他)</strong></span>
                </div>
                <div id="chart-shop-pie" style="width: 100%; height: 500px;"></div>
            </div>
        </div>
    </div>

    <!-- 图片预览 -->
    <div id="preview-popup"><img src="" id="preview-img"></div>

    <script>
        // 1. 图片交互
        (function() {
            const popup = document.getElementById('preview-popup');
            const previewImg = document.getElementById('preview-img');
            const offset = 20;

            document.body.addEventListener('mouseover', function(e) {
                if (e.target.classList.contains('cell-img')) {
                    const largeSrc = e.target.getAttribute('data-large-src');
                    if (largeSrc) {
                        previewImg.src = largeSrc;
                        popup.style.display = 'block';
                        movePopup(e);
                    }
                }
            });

            document.body.addEventListener('mouseout', function(e) {
                if (e.target.classList.contains('cell-img')) {
                    popup.style.display = 'none';
                    previewImg.src = '';
                }
            });

            document.body.addEventListener('mousemove', movePopup);

            function movePopup(e) {
                if (popup.style.display === 'block') {
                    const offset = 20;
                    const pRect = popup.getBoundingClientRect();
                    const winW = window.innerWidth;
                    const winH = window.innerHeight;

                    let left = e.clientX + offset;
                    let top = e.clientY + offset;

                    // 水平方向自适应：如果右侧超出，则显示在鼠标左侧
                    if (left + pRect.width > winW - 10) {
                        left = e.clientX - pRect.width - offset;
                    }
                    // 防止左侧溢出
                    if (left < 10) left = 10;

                    // 垂直方向自适应：如果底部超出，则显示在鼠标上方
                    if (top + pRect.height > winH - 10) {
                        top = e.clientY - pRect.height - offset;
                    }
                    
                    // 如果上方也超出（比如图片特别大，或者鼠标在屏幕中间但图片比剩余空间还大）
                    // 尝试居中或者吸顶
                    if (top < 10) {
                         top = 10; // 简单吸顶，如果图片实在太高，可能需要缩放，但在CSS里已经限制了max-height
                    }

                    popup.style.top = top + 'px';
                    popup.style.left = left + 'px';
                }
            }
        })();

        // 2. 筛选与榜单功能
        let applyShopRank = null; // 全局暴露给HTML调用

        (function() {
            const titleInput = document.getElementById('filter-title');
            const shopInput = document.getElementById('filter-shop');
            const table = document.getElementById('data-table');
            const tbody = table.querySelector('tbody');
            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());

            // 智能识别列索引
            const titleColIndices = [];
            const shopColIndices = [];

            headers.forEach((h, i) => {
                if (h.match(/商品|标题|名称|Title|Name/i)) titleColIndices.push(i);
                if (h.match(/店铺|卖家|Shop|Seller/i)) shopColIndices.push(i);
            });
            
            // 榜单数据状态
            let activeTopShops = null; // null represents all
            let sortedShopNames = [];

            // 初始化店铺统计
            if (shopColIndices.length > 0) {
                const shopIdx = shopColIndices[0];
                const shopCounts = {};
                const rows = tbody.querySelectorAll('tr');
                
                rows.forEach(row => {
                    const cell = row.querySelectorAll('td')[shopIdx];
                    if (cell) {
                        const name = cell.innerText.trim();
                        if (name && name !== '-') {
                            shopCounts[name] = (shopCounts[name] || 0) + 1;
                        }
                    }
                });

                // 排序: 上榜数量多 -> 少
                sortedShopNames = Object.keys(shopCounts).sort((a, b) => shopCounts[b] - shopCounts[a]);
                
                // 显示榜单控件 (商品页面)
                if (sortedShopNames.length > 0) {
                    document.getElementById('shop-rank-controls').style.display = 'flex';
                    document.getElementById('shop-stat-info').innerText = \`(共 \${sortedShopNames.length} 家店铺)\`;

                    // 渲染店铺榜单表格 (店铺页面)
                    const shopTbody = document.querySelector('#shop-rank-table tbody');
                    let shopHtml = '';
                    sortedShopNames.forEach((shop, idx) => {
                        const count = shopCounts[shop];
                        const percent = ((count / ${collectedData.length}) * 100).toFixed(1);
                        // 进度条颜色
                        const color = idx < 3 ? '#ff4d4f' : '#1890ff';
                        
                        shopHtml += \`
                            <tr>
                                <td><span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:\${idx < 3 ? '#333' : '#f0f0f0'};color:\${idx < 3 ? '#fff' : '#666'};border-radius:4px;font-weight:bold;">\${idx + 1}</span></td>
                                <td style="font-weight:500;">
                                    <a href="javascript:;" onclick="viewShopDetails('\${shop}')" style="color:#1890ff;text-decoration:none;cursor:pointer;">\${shop}</a>
                                </td>
                                <td style="font-size:16px;font-weight:bold;">\${count}</td>
                                <td>
                                    <div style="display:flex;align-items:center;">
                                        <div style="flex:1;height:8px;background:#f5f5f5;border-radius:4px;overflow:hidden;margin-right:8px;">
                                            <div style="width:\${percent}%;height:100%;background:\${color};"></div>
                                        </div>
                                        <span style="font-size:12px;color:#999;">\${percent}%</span>
                                    </div>
                                </td>
                                <td>
                                    <button onclick="viewShopDetails('\${shop}')" style="font-size:12px;color:#1890ff;border:1px solid #1890ff;background:#fff;padding:4px 12px;border-radius:4px;cursor:pointer;">查看商品</button>
                                </td>
                            </tr>
                        \`;
                    });
                    shopTbody.innerHTML = shopHtml;
                }
            }
            
            // 核心筛选函数
            function filterRows() {
                const titleVal = titleInput.value.toLowerCase().trim();
                const shopVal = shopInput.value.toLowerCase().trim();
                const rows = tbody.querySelectorAll('tr');

                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    let show = true;

                    // 1. 榜单筛选 (优先级最高)
                    if (activeTopShops) {
                        let isTopShop = false;
                        if (shopColIndices.length > 0) {
                            const name = cells[shopColIndices[0]].innerText.trim();
                            if (activeTopShops.includes(name)) isTopShop = true;
                        }
                        if (!isTopShop) show = false;
                    }

                    // 2. 标题输入筛选
                    if (show && titleVal) {
                        let match = false;
                        const indices = titleColIndices.length > 0 ? titleColIndices : Array.from(cells).map((_, i) => i);
                        for (let i of indices) {
                            if (cells[i] && cells[i].innerText.toLowerCase().includes(titleVal)) {
                                match = true;
                                break;
                            }
                        }
                        if (!match) show = false;
                    }

                    // 3. 店铺输入筛选
                    if (show && shopVal) {
                        let match = false;
                        const indices = shopColIndices.length > 0 ? shopColIndices : Array.from(cells).map((_, i) => i);
                         for (let i of indices) {
                            if (cells[i] && cells[i].innerText.toLowerCase().includes(shopVal)) {
                                match = true;
                                break;
                            }
                        }
                        if (!match) show = false;
                    }

                    row.style.display = show ? '' : 'none';
                });
            }

            // 暴露榜单点击函数
            applyShopRank = function(n) {
                n = parseInt(n);
                if (!n || n <= 0) {
                    activeTopShops = null;
                    document.getElementById('shop-stat-info').innerText = \`(显示全部 \${sortedShopNames.length} 家)\`;
                } else {
                    activeTopShops = sortedShopNames.slice(0, n);
                    document.getElementById('shop-stat-info').innerText = \`(显示 Top \${n}，共 \${activeTopShops.length} 家)\`;
                    
                    // 自动填充 top 店铺到输入框提示用户（可选，这里仅做提示）
                    // 暂时不锁定输入框，允许叠加筛选
                }
                
                // 高亮按钮状态
                const btns = document.querySelectorAll('.rank-btn');
                btns.forEach(btn => btn.classList.remove('active'));
                
                // 执行筛选
                filterRows();
            };

            titleInput.addEventListener('input', filterRows);
            shopInput.addEventListener('input', filterRows);
        })();

        // 3. 标签页切换 & 视图跳转
        function switchTab(viewId, tabEl) {
            // 切换 Tab 样式
            document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
            if(tabEl) tabEl.classList.add('active');
            
            // 切换内容显示
            document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
            const target = document.getElementById(viewId);
            target.style.display = 'block';
            
            // 如果切换到大屏，触发图表重绘 (解决隐藏div导致图表尺寸不对的问题)
            if (viewId === 'view-dashboard' && window.updateDashboardCharts) {
                setTimeout(window.updateDashboardCharts, 100);
            }
        }
        
        // 4. 动态图表初始化
        (function() {
            let myChartBar = null;
            let myChartPie = null;

            // 暴露更新函数
            window.updateDashboardCharts = function() {
                if(myChartBar) myChartBar.resize();
                if(myChartPie) myChartPie.resize();
            };

            // 监听窗口大小改变
            window.addEventListener('resize', window.updateDashboardCharts);

            // 延时初始化 (等待数据计算完成)
            setTimeout(initCharts, 800);

            function initCharts() {
                // 确保有数据 (依赖于 sortShopNames 逻辑，这里重新计算一次以防万一或直接使用 global data)
                // 为了安全，我们基于 collectedData 现算
                const data = ${JSON.stringify(collectedData)}; // 注入原始数据 (注意：如果数据过大可能会导致HTML很大，但这是最稳妥的方式)
                // 重新统计
                const shopCounts = {};
                let shopIdx = -1;
                
                // 寻找店铺列
                if(data.length > 0) {
                     const headers = Object.keys(data[0]);
                     shopIdx = headers.findIndex(h => h.match(/店铺|卖家|Shop|Seller/i));
                     if(shopIdx === -1) return; // 没找到店铺列

                     const shopKey = headers[shopIdx];
                     data.forEach(row => {
                         const cell = row[shopKey];
                         if(cell && cell.text && cell.text !== '-') {
                             shopCounts[cell.text] = (shopCounts[cell.text] || 0) + 1;
                         }
                     });
                } else {
                    return;
                }

                // 排序
                const sortedShops = Object.keys(shopCounts).sort((a,b) => shopCounts[b] - shopCounts[a]);
                
                // 1. 柱状图数据 (Top 30)
                const top30 = sortedShops.slice(0, 30);
                const xData = top30;
                const yData = top30.map(s => shopCounts[s]);

                if(document.getElementById('chart-shop-bar')) {
                    myChartBar = echarts.init(document.getElementById('chart-shop-bar'));
                    myChartBar.setOption({
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                        grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
                        dataZoom: [{ type: 'inside' }, { type: 'slider' }],
                        xAxis: { 
                            type: 'category', 
                            data: xData, 
                            axisLabel: { interval: 0, rotate: 45, overflow: 'break' } 
                        },
                        yAxis: { type: 'value', name: '上榜商品数' },
                        series: [{
                            name: '商品数',
                            type: 'bar',
                            data: yData,
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: '#1890ff' },
                                    { offset: 0.5, color: '#40a9ff' },
                                    { offset: 1, color: '#e6f7ff' }
                                ])
                            },
                            label: { show: true, position: 'top' }
                        }]
                    });
                    
                    // 点击柱状图跳转
                    myChartBar.on('click', function(params) {
                        if(params.name) {
                            window.viewShopDetails(params.name);
                        }
                    });
                }

                // 2. 饼图数据 (Top 10 + Others)
                const top10 = sortedShops.slice(0, 10);
                const top10Count = top10.reduce((acc, curr) => acc + shopCounts[curr], 0);
                const totalCount = data.length; // 或 sortedShops 总和
                const otherCount = totalCount - top10Count;

                const pieData = top10.map(s => ({ value: shopCounts[s], name: s }));
                if(otherCount > 0) {
                    pieData.push({ value: otherCount, name: '其他店铺合计', itemStyle: { color: '#eee' } });
                }

                if(document.getElementById('chart-shop-pie')) {
                    myChartPie = echarts.init(document.getElementById('chart-shop-pie'));
                    myChartPie.setOption({
                        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
                        legend: { bottom: '5%', left: 'center' },
                        series: [{
                            name: '店铺占比',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: { show: false, position: 'center' },
                            emphasis: {
                                label: { show: true, fontSize: 20, fontWeight: 'bold' }
                            },
                            labelLine: { show: false },
                            data: pieData
                        }]
                    });
                    
                     // 点击饼图跳转
                    myChartPie.on('click', function(params) {
                        if(params.name && params.name !== '其他店铺合计') {
                            window.viewShopDetails(params.name);
                        }
                    });
                }
            }
        })();
        
        // 从榜单跳转到明细
        window.viewShopDetails = function(shopName) {
            // 1. 切换回商品 Tab
            const productTab = document.querySelectorAll('.tab-item')[0];
            switchTab('view-products', productTab);
            
            // 2. 自动填入筛选并触发
            const shopInput = document.getElementById('filter-shop');
            shopInput.value = shopName;
            
            // 创建 input 事件触发筛选逻辑
            const event = new Event('input', { bubbles: true });
            shopInput.dispatchEvent(event);
        };

        // 3. 自保存功能
        document.getElementById('save-btn').onclick = function() {
            const htmlContent = document.documentElement.outerHTML;
            const blob = new Blob([htmlContent], {type: 'text/html'});
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'Sycm_Report_' + Date.now() + '.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // 4. 复制功能
        // 4. 复制功能 (图片 Blob -> 失败降级为 ULR)
        window.copyImage = async function(url) {
             const toast = document.createElement('div');
             toast.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.8); color:#fff; padding:12px 24px; border-radius:4px; z-index:20000; font-size:14px; text-align:center; box-shadow:0 4px 12px rgba(0,0,0,0.3);';
             document.body.appendChild(toast);

             const showMsg = (msg, duration = 2000) => {
                 toast.innerText = msg;
                 setTimeout(() => toast.remove(), duration);
             };

             // 降级方案：复制链接
             const copyUrlFallback = (originalUrl) => {
                 navigator.clipboard.writeText(originalUrl).then(() => {
                     showMsg('⚠️ 无法直接复制图片(浏览器限制)\n已自动为您复制图片链接');
                 }).catch(() => {
                     showMsg('❌ 复制失败，请手动右键图片复制');
                 });
             };

             try {
                if (!navigator.clipboard || !navigator.clipboard.write) {
                    throw new Error('Clipboard API not supported');
                }

                toast.innerText = '⏳ 正在获取图片...';
                
                // 尝试直接 Fetch Blob
                const response = await fetch(url, { mode: 'cors' });
                if (!response.ok) throw new Error('Fetch failed');
                
                const blob = await response.blob();
                
                // 只有 PNG 格式在剪贴板支持最广泛，尝试转换（如果 fetch 的不是 png）
                // 但通常直接写入 blob 即可，如果浏览器支持
                // 为了保险，构建 ClipboardItem
                const mimeType = blob.type;
                const item = new ClipboardItem({ [mimeType]: blob });
                
                await navigator.clipboard.write([item]);
                showMsg('✅ 图片已复制！\n可在微信/钉钉/文档中直接粘贴');

             } catch (err) {
                 console.error('Copy Image Failed:', err);
                 // 失败后自动执行降级
                 copyUrlFallback(url);
             }
        };
    </script>
</body>
</html>
        `;

        // 使用 Blob URL 打开新窗口
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    // 仅导出 CSV
    function exportCSV() {
        if (!collectedData || collectedData.length === 0) {
            alert('暂无数据');
            return;
        }

        const headers = Object.keys(collectedData[0]);
        let csvContent = headers.join(',') + '\n';

        collectedData.forEach(row => {
            const rowStr = headers.map(header => {
                const cell = row[header];
                let text = cell ? cell.text : '';
                // 如果有图片，把图片链接加到文本后面方便查看
                if (cell && cell.type === 'mixed' && cell.img) {
                    text += ` [${cell.img}]`;
                }

                // 处理CSV特殊字符
                if (String(text).match(/[,"\n]/)) {
                    text = `"${String(text).replace(/"/g, '""')}"`;
                }
                return text;
            }).join(',');
            csvContent += rowStr + '\n';
        });

        downloadFile('\uFEFF' + csvContent, `Sycm_Data_${Date.now()}.csv`, 'text/csv;charset=utf-8');
    }

    // 通用下载函数
    function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 初始化
    window.addEventListener('load', () => {
        // 延时加载UI，确保页面结构稳定
        setTimeout(createUI, 2500);
    });

})();

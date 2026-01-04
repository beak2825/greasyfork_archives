// ==UserScript==
// @name         動畫瘋评分显示增强
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  自用, 动画疯评分获取, 支持按需获取、排序、导出、暂停/继续/停止，并拥有独特的“动态声纳”高亮特效。
// @author       pixelpulse
// @match        https://ani.gamer.com.tw/*
// @connect      ani.gamer.com.tw
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551950/%E5%8B%95%E7%95%AB%E7%98%8B%E8%AF%84%E5%88%86%E6%98%BE%E7%A4%BA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/551950/%E5%8B%95%E7%95%AB%E7%98%8B%E8%AF%84%E5%88%86%E6%98%BE%E7%A4%BA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
// 本脚本仅供个人学习和技术交流使用，请勿用于商业目的。所有数据的版权归原作者和知乎所有。因使用本脚本产生的一切后果由使用者自行承担。
/*
 * =================================================================================================
 * 【重要声明及使用条款 / Important Disclaimer and Terms of Use】
 *
 * 1. **脚本目的 (Purpose of the Script):**
 * 本脚本（動畫瘋评分显示增强）仅为个人学习和技术交流目的而开发。其核心功能是为用户提供评分聚合显示、
 * 排序及索引导出等辅助功能，旨在改善个人在浏览动画列表时的信息筛选效率。本脚本非官方出品，与
 * 動畫瘋（ani.gamer.com.tw）没有任何关联。
 *
 * 2. **数据与版权 (Data and Copyright):**
 * 本脚本处理及显示的所有内容（包括但不限于评分、标题、链接、图片）的版权、数据权及其他所有权，均归属于
 * 動畫瘋平台及其内容提供方所有。本脚本尊重并承认上述所有权。
 *
 * 3. **关于网络请求的说明 (Note on Network Requests):**
 * 为获取单部动画的评分，本脚本会模拟用户浏览行为，向動畫瘋服务器发送必要的网络请求。作者已采取
 * 【请求延迟、随机间隔、数据缓存】等技术手段，旨在最大程度上减少请求频率、降低服务器负载，以负责任的
 * 方式实现功能。请勿修改相关参数以进行不当的、高频率的请求。
 *
 * 4. **【特别条款】关于“導出為表格”功能 (SPECIAL CLAUSE regarding "Export to CSV" feature):**
 * a. **性质界定 (Definition of Nature):** 本功能导出的数据仅包含【排名、评分、名称、链接】等核心元数据。
 * 其性质是为用户个人备份或分析创建内容的“索引”或“目录”，并非内容本身的完整复制。
 * b. **使用限制 (Usage Restrictions):** 用户承诺，通过本功能导出的文件将严格用于【个人、非商业性】
 * 用途（如个人资料整理、观影记录）。
 * c. **严禁行为 (Prohibited Actions):** 【严禁】将导出的数据用于任何商业目的、进行二次分发、公开展示，
 * 或用于构建与動畫瘋存在竞争关系的产品或服务。
 *
 * 5. **风险与责任 (Risk and Liability):**
 * 本脚本按“原样”提供，作者不对其功能的完整性、准确性、稳定性或永久可用性作任何保证。用户因使用本脚本
 * 而产生的任何直接或间接后果，包括但不限于数据错误、账户风险或与動畫瘋《用户协议》可能产生的冲突，
 * 【均由用户本人承担全部责任】。作者对此不承担任何法律或经济责任。
 *
 * 6. **接受条款 (Acceptance of Terms):**
 * 一旦您选择安装并使用本脚本，即表示您已完整阅读、充分理解并同意遵守以上所有条款。如果您不同意
 * 任何条款，请立即停止使用并卸载本脚本。
 *
 * 请在遵守相关法律法规及動畫瘋平台规定的前提下，合理、负责地使用本脚本。
 * =================================================================================================
 */
(function () {
    'use strict';

    // --- 全局CSS样式注入 ---
    // 使用 GM_addStyle 在页面加载时一次性注入所有需要的CSS，包括UI、弹窗和动画效果。
    GM_addStyle(`
        /* 排序结果弹窗的半透明黑色背景遮罩层 */
        .anime-sorter-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 9998; display: flex; align-items: center; justify-content: center; }
        /* 弹窗主体内容框 */
        .anime-sorter-content { background-color: #fff; color: #121212; border-radius: 8px; width: 80%; max-width: 800px; height: 80%; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
        /* 弹窗头部 */
        .anime-sorter-header { padding: 12px 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .anime-sorter-title { font-size: 16px; font-weight: 600; }
        /* 弹窗关闭按钮 */
        .anime-sorter-close { font-size: 24px; font-weight: bold; cursor: pointer; border: none; background: none; padding: 0 8px; margin-left: auto; } /* margin-left: auto 确保关闭按钮在最右侧 */
        /* 弹窗可滚动的内容区域 */
        .anime-sorter-body { overflow-y: auto; padding: 8px 16px; text-align: center; }
        /* 排序结果的每一行 */
        .sorted-item { display: flex; align-items: center; padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: left;}
        /* 新增：排名列样式 */
        .sorted-item-rank { font-size: 14px; font-weight: bold; color: #6c757d; flex-shrink: 0; width: 60px; text-align: center; }
        .sorted-item-score { font-size: 14px; font-weight: bold; color: #1772F6; flex-shrink: 0; width: 90px; }
        .sorted-item-details { flex-grow: 1; min-width: 0; }
        .sorted-item-title { font-size: 15px; color: #121212; text-decoration: none; display: block; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sorted-item-title:hover { color: #0084ff; }
        .sorted-item-actions { margin-top: 5px; }
        .sorted-item-button { font-size: 12px; padding: 3px 8px; margin-right: 8px; border: 1px solid #ccc; border-radius: 3px; background: #f9f9f9; cursor: pointer; text-decoration: none; color: #333; }
        .sorted-item-button:hover { background: #eee; border-color: #bbb; }
        /* 新增：导出按钮特殊样式 */
        #export-csv-btn { background-color: #28a745; color: white; border-color: #28a745; }

        /* “数字色彩闪烁”动画的关键帧 */
        @keyframes digital-flicker { 0% { border-color: #00FFFF; } 25% { border-color: #FF00FF; } 50% { border-color: #FFFF00; } 75% { border-color: #00FF00; } 100% { border-color: #FF4500; } }
        /* “声纳扩散”动画的关键帧 */
        @keyframes sonar-pulse { 0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0.85; } 100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0; } }
        /* 持久锁定的蓝色边框类 */
        .persistent-highlight { outline: 3px solid #007aff !important; box-shadow: 0 0 10px #007aff !important; z-index: 9999 !important; }
        /* 动态声纳/定位标线 的容器样式 */
        .highlight-reticle { position: absolute; top: 50%; left: 50%; width: 1px; height: 1px; transform: translate(-50%, -50%); pointer-events: none; z-index: 5; }
        /* 使用伪元素::before和::after创建两个同心圆，并应用动画 */
        .highlight-reticle::before, .highlight-reticle::after { content: ''; position: absolute; left: 0; top: 0; width: 200px; height: 200px; margin-left: -100px; margin-top: -100px; border-radius: 50%; border: 12px solid; opacity: 0.5; animation-name: digital-flicker, sonar-pulse; animation-duration: 1.5s, 2s; animation-iteration-count: infinite, infinite; animation-timing-function: linear, ease-out; }
        /* 让第二个圆延迟开始，形成扩散的视觉差 */
        .highlight-reticle::after { animation-delay: 1s; }
    `);

    // --- 全局配置与状态管理 ---
    let RATING_THRESHOLD = 4.5;
    const BASE_DELAY_MS = 500;
    const RANDOM_DELAY_MS = 1000;
    const CACHE_PREFIX = 'anime_rating_'; // 用于【评分性能缓存】
    const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;
    const SORT_DATA_SESSION_KEY = 'anime_sort_data'; // 用于【排序功能数据】

    let processingQueue = [], isPaused = false, isStopped = false, totalQueueCount = 0;
    let currentlyHighlightedElement = null, highlightedOverlayElement = null;
    let controlContainer, startButton, pauseResumeButton, stopButton, progressIndicator, sortButton, buttonGroup;

    // --- 核心处理逻辑 ---

    /**
     * @description 任务队列的“引擎”，负责从队列中取出一个任务并处理。
     */
    function processQueue() {
        if (isPaused || isStopped) return;
        if (processingQueue.length === 0) { resetUI(); return; }
        updateProgress();
        const card = processingQueue.shift();
        processAnimeCard(card);
    }

    /**
     * @description 处理单个动漫卡片的函数：获取评分、注入DOM、存入缓存。
     * @param {HTMLElement} card - 需要处理的动漫卡片<a>元素。
     */
    function processAnimeCard(card) {
        if (card.classList.contains('rating-processed')) { setTimeout(processQueue, 50); return; }
        card.classList.add('rating-processed');
        const animeLink = card.href;
        if (!animeLink) { setTimeout(processQueue, 50); return; }
        const snMatch = animeLink.match(/sn=(\d+)/);
        if (!snMatch) { setTimeout(processQueue, 50); return; }
        const animeSN = snMatch[1];
        const cachedData = getFromCache(animeSN);
        if (cachedData) {
            injectRating(card, cachedData.value);
            const delay = BASE_DELAY_MS / 2 + Math.random() * RANDOM_DELAY_MS / 2;
            setTimeout(processQueue, delay);
            return;
        }
        GM_xmlhttpRequest({
            method: "GET", url: animeLink, headers: { "User-Agent": navigator.userAgent, "Referer": window.location.href },
            onload: function (response) {
                let rating = 'Error';
                if (response.status >= 200 && response.status < 400) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const ratingElement = doc.querySelector('.score-overall-number');
                    rating = ratingElement ? parseFloat(ratingElement.textContent).toFixed(1) : 'N/A';
                    saveToCache(animeSN, rating);
                }
                injectRating(card, rating);
                const delay = BASE_DELAY_MS + Math.random() * RANDOM_DELAY_MS;
                setTimeout(processQueue, delay);
            },
            onerror: function () {
                injectRating(card, 'Error');
                const delay = BASE_DELAY_MS + Math.random() * RANDOM_DELAY_MS;
                setTimeout(processQueue, delay);
            }
        });
    }

    // --- UI 控制与事件处理 ---

    /**
     * @description 创建并初始化所有控制按钮和面板。
     */
    function createControls() {
        controlContainer = document.createElement('div');
        controlContainer.style.position = 'fixed'; controlContainer.style.bottom = '20px'; controlContainer.style.left = '20px';
        controlContainer.style.zIndex = '9999'; controlContainer.style.display = 'flex'; controlContainer.style.flexDirection = 'column';
        controlContainer.style.alignItems = 'flex-start'; controlContainer.style.gap = '10px';
        buttonGroup = document.createElement('div');
        buttonGroup.style.display = 'flex'; buttonGroup.style.flexDirection = 'column'; buttonGroup.style.gap = '8px';
        const createButton = (id, text, onClick) => {
            const button = document.createElement('button');
            button.id = id; button.textContent = text;
            button.style.padding = '8px 12px'; button.style.fontSize = '14px'; button.style.color = 'white';
            button.style.border = 'none'; button.style.borderRadius = '5px'; button.style.cursor = 'pointer';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; button.style.width = '100px';
            button.addEventListener('click', onClick);
            return button;
        };
        sortButton = createButton('sortBtn', '排序', handleSort);
        sortButton.style.backgroundColor = '#6f42c1';
        startButton = createButton('startBtn', '获取评分', promptAndFetch);
        startButton.style.backgroundColor = '#00a0d8';
        pauseResumeButton = createButton('pauseResumeBtn', '暂停', handlePauseResume);
        pauseResumeButton.style.backgroundColor = '#ffc107';
        stopButton = createButton('stopBtn', '停止', handleStop);
        stopButton.style.backgroundColor = '#dc3545';
        const processControls = document.createElement('div');
        processControls.style.display = 'flex'; processControls.style.gap = '8px';
        processControls.append(pauseResumeButton, stopButton);
        progressIndicator = document.createElement('span');
        progressIndicator.style.color = 'black'; progressIndicator.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        progressIndicator.style.padding = '5px 10px'; progressIndicator.style.borderRadius = '5px'; progressIndicator.style.fontSize = '14px';
        buttonGroup.append(sortButton, startButton);
        controlContainer.append(buttonGroup, processControls, progressIndicator);
        document.body.appendChild(controlContainer);
        resetUI();
    }

    /**
     * @description 重置UI到初始状态（“待命”状态）。
     */
    function resetUI() {
        buttonGroup.style.display = 'flex';
        startButton.style.display = 'inline-block';
        sortButton.disabled = false;
        sortButton.style.opacity = '1';
        pauseResumeButton.style.display = 'none';
        stopButton.style.display = 'none';
        progressIndicator.style.display = 'none';
        pauseResumeButton.textContent = '暂停';
        pauseResumeButton.style.backgroundColor = '#ffc107';
    }

    /**
     * @description 设置UI到“处理中”状态。
     */
    function setProcessingUI() {
        buttonGroup.style.display = 'flex';
        startButton.style.display = 'none';
        sortButton.disabled = true;
        sortButton.style.opacity = '0.5';
        pauseResumeButton.style.display = 'inline-block';
        stopButton.style.display = 'inline-block';
        progressIndicator.style.display = 'inline-block';
    }

    /**
     * @description 更新进度指示器的文本。
     */
    function updateProgress() {
        const processedCount = totalQueueCount - processingQueue.length;
        progressIndicator.textContent = `处理中: ${processedCount} / ${totalQueueCount}`;
    }

    /**
     * @description “获取评分”按钮的点击事件处理函数，负责弹出询问框。
     */
    function promptAndFetch() {
        clearCurrentHighlight();
        const userInput = prompt('需要高亮≥?分的动漫?', RATING_THRESHOLD);
        if (userInput === null) return;
        const newThreshold = parseFloat(userInput);
        if (!isNaN(newThreshold)) { RATING_THRESHOLD = newThreshold; }
        startProcessing();
    }

    /**
     * @description 初始化任务队列并开始处理。
     */
    function startProcessing() {
        if (getSortData().length > 0) {
            if (confirm('是否要清除之前的排序数据并重新开始?')) {
                setSortData([]);
            }
        }
        isStopped = false; isPaused = false;
        const animeCards = document.querySelectorAll('a.anime-card-block:not(.rating-processed), a.theme-list-main:not(.rating-processed)');
        processingQueue = Array.from(animeCards);
        totalQueueCount = processingQueue.length;
        if (totalQueueCount === 0) {
            alert('当前页面已无未获取评分的动漫。');
            resetUI();
            return;
        }
        setProcessingUI();
        processQueue();
    }

    /**
     * @description “暂停/继续”按钮的点击事件处理函数。
     */
    function handlePauseResume() {
        clearCurrentHighlight();
        isPaused = !isPaused;
        if (isPaused) {
            pauseResumeButton.textContent = '继续';
            pauseResumeButton.style.backgroundColor = '#28a745';
            sortButton.disabled = false;
            sortButton.style.opacity = '1';
        } else {
            pauseResumeButton.textContent = '暂停';
            pauseResumeButton.style.backgroundColor = '#ffc107';
            sortButton.disabled = true;
            sortButton.style.opacity = '0.5';
            processQueue();
        }
    }

    /**
     * @description “停止”按钮的点击事件处理函数。
     */
    function handleStop() {
        clearCurrentHighlight();
        isStopped = true;
        processingQueue = [];
        resetUI();
    }

    // --- 排序、弹窗与导出模块 ---

    /**
     * @description “排序”按钮的点击事件处理函数。
     */
    function handleSort() {
        clearCurrentHighlight();
        const storedData = getSortData().filter(item => !isNaN(item.score));
        if (storedData.length === 0) {
            displaySortModal([]);
            return;
        }
        const dataWithElements = storedData.map(item => {
            const urlQuery = item.url.split('?')[1];
            const element = urlQuery ? document.querySelector(`a[href$="?${urlQuery}"]`) : null;
            return { ...item, element };
        }).filter(item => item.element);
        if (dataWithElements.length === 0) {
            alert('排序数据中的项目均未在当前页面找到。可能需要重新获取评分。');
            return;
        }
        const sorted = dataWithElements.sort((a, b) => b.score - a.score);
        displaySortModal(sorted);
    }

    /**
     * @description 关闭并移除排序结果弹窗。
     */
    function closeSortModal() {
        const modal = document.getElementById('anime-sorter-modal');
        if (modal) { document.body.removeChild(modal); }
    }

    /**
     * @description 在弹窗中动态生成并显示排序结果。
     * @param {Array} sortedItems - 已排序的、且附加了DOM元素引用的项目数据。
     */
    function displaySortModal(sortedItems) {
        closeSortModal();
        const overlay = document.createElement('div');
        overlay.id = 'anime-sorter-modal';
        overlay.className = 'anime-sorter-overlay';

        let modalHtml = `<div class="anime-sorter-content"><div class="anime-sorter-header"><span class="anime-sorter-title">评分排序结果</span><button id="export-csv-btn" class="sorted-item-button">導出為表格</button><button class="anime-sorter-close">&times;</button></div><div class="anime-sorter-body">`;
        if (sortedItems.length === 0) {
            modalHtml += `<p style="padding: 20px;">暂无数据。请先点击【获取评分】按钮来收集动漫评分。</p>`;
        } else {
            sortedItems.forEach((item, index) => {
                modalHtml += `<div class="sorted-item"><div class="sorted-item-rank">#${index + 1}</div><div class="sorted-item-score">★ ${item.scoreText}</div><div class="sorted-item-details"><a class="sorted-item-title" href="${item.url}" target="_blank" title="${item.name.replace(/"/g, '&quot;')}">${item.name}</a><div class="sorted-item-actions"><a href="${item.url}" target="_blank" class="sorted-item-button">新窗口打开</a><button class="sorted-item-button locate-btn" data-item-index="${index}">定位</button></div></div></div>`;
            });
        }
        modalHtml += `</div></div>`;
        overlay.innerHTML = modalHtml;
        document.body.appendChild(overlay);

        if (sortedItems.length > 0) {
            overlay.querySelector('#export-csv-btn').addEventListener('click', () => {
                exportToCsv(sortedItems);
            });
        }

        overlay.querySelectorAll('.locate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemIndex = parseInt(btn.dataset.itemIndex, 10);
                const item = sortedItems[itemIndex];
                if (!item || !item.element) { alert('定位失败，无法找到对应的DOM元素。'); return; }
                closeSortModal();
                performVisualLock(item.element);
            });
        });

        overlay.querySelector('.anime-sorter-close').addEventListener('click', closeSortModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSortModal(); });
    }

    /**
     * @description 将排序结果导出为CSV文件并触发下载。
     * @param {Array} data - 已排序的动漫数据数组。
     */
    function exportToCsv(data) {
        let csvContent = '"排名","评分","名称","链接"\n';
        data.forEach((item, index) => {
            const rank = index + 1;
            const score = item.scoreText;
            const name = `"${item.name.replace(/"/g, '""')}"`;
            const url = item.url;
            csvContent += `${rank},${score},${name},${url}\n`;
        });
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "動畫瘋評分排序.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- 视觉锁定与高亮清除功能 ---

    /**
     * @description 清除当前所有的高亮效果（蓝框和声纳）。
     */
    function clearCurrentHighlight() {
        if (currentlyHighlightedElement) {
            currentlyHighlightedElement.classList.remove('persistent-highlight');
        }
        if (highlightedOverlayElement) {
            highlightedOverlayElement.remove();
        }
        currentlyHighlightedElement = null;
        highlightedOverlayElement = null;
    }

    /**
     * @description 对指定元素执行“蓝框 + 动态声纳”的视觉锁定效果。
     * @param {HTMLElement} element - 要高亮的目标卡片元素。
     */
    function performVisualLock(element) {
        clearCurrentHighlight();
        currentlyHighlightedElement = element;
        element.classList.add('persistent-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const reticle = document.createElement('div');
        reticle.className = 'highlight-reticle';
        const injectionTarget = element.classList.contains('theme-list-main') ? element.querySelector('.theme-img-block') : element;
        if (injectionTarget) {
            injectionTarget.style.position = 'relative';
            injectionTarget.appendChild(reticle);
            highlightedOverlayElement = reticle;
        }
    }

    // --- 辅助函数 ---

    /**
     * @description 将评分标签注入DOM，并将数据存入排序库。
     */
    function injectRating(card, rating) {
        const nameElement = card.querySelector('.anime-name_for-marquee') || card.querySelector('.theme-name') || card.querySelector('.anime-name');
        const animeName = nameElement ? nameElement.textContent.trim() : '未知名称';
        const numericRating = parseFloat(rating);
        if (!isNaN(numericRating)) {
            let storedData = getSortData();
            if (!storedData.some(item => item.url === card.href)) {
                storedData.push({ name: animeName, score: numericRating, scoreText: rating, url: card.href });
                setSortData(storedData);
            }
        }
        const injectionTarget = card.classList.contains('theme-list-main') ? card.querySelector('.theme-img-block') : card;
        if (!injectionTarget) return;
        const ratingDiv = document.createElement('div');
        ratingDiv.style.position = 'absolute'; ratingDiv.style.top = '5px'; ratingDiv.style.right = '5px';
        ratingDiv.style.padding = '2px 6px'; ratingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        ratingDiv.style.color = 'white'; ratingDiv.style.fontSize = '14px'; ratingDiv.style.fontWeight = 'bold';
        ratingDiv.style.borderRadius = '4px'; ratingDiv.style.zIndex = '10';
        ratingDiv.textContent = `★ ${rating}`;
        if (!isNaN(numericRating) && numericRating >= RATING_THRESHOLD) {
            const highlightTarget = card.classList.contains('theme-list-main') ? card.parentElement : card;
            highlightTarget.style.outline = '3px solid #FFD700';
            ratingDiv.style.color = '#FFD700';
        }
        injectionTarget.style.position = 'relative';
        injectionTarget.appendChild(ratingDiv);
    }

    /**
     * @description 将【单个评分】存入localStorage，用于加速下次加载显示，有有效期。
     */
    function saveToCache(key, value) {
        const item = { value, timestamp: new Date().getTime() };
        localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    }

    /**
     * @description 从localStorage读取【单个评分】的有效缓存。
     */
    function getFromCache(key) {
        const itemStr = localStorage.getItem(CACHE_PREFIX + key);
        if (!itemStr) return null;
        const item = JSON.parse(itemStr);
        if (new Date().getTime() - item.timestamp > CACHE_EXPIRATION_MS) {
            localStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return item;
    }

    /**
     * @description 从sessionStorage获取【用于排序】的所有动漫数据。
     */
    function getSortData() { return JSON.parse(sessionStorage.getItem(SORT_DATA_SESSION_KEY) || '[]'); }

    /**
     * @description 将【用于排序】的所有动漫数据写入sessionStorage。
     */
    function setSortData(data) { sessionStorage.setItem(SORT_DATA_SESSION_KEY, JSON.stringify(data)); }

    // --- 脚本入口 ---

    // 当页面完全加载后，执行createControls函数来创建UI。
    window.addEventListener('load', createControls);

})();
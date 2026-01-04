// ==UserScript==
// @name         电商详情页照片视频打包工具（淘宝、天猫、1688）
// @namespace    taobao&tmall&1688 pictures downloader
// @version      0.9.2
// @description  启动时自动点击第一张主图以加载视频，修复切换后视频丢失问题，保留评论区自动滚动功能。
// @author       MZJ
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://detail.1688.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://unpkg.com/pizzip@3.1.5/dist/pizzip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/561294/%E7%94%B5%E5%95%86%E8%AF%A6%E6%83%85%E9%A1%B5%E7%85%A7%E7%89%87%E8%A7%86%E9%A2%91%E6%89%93%E5%8C%85%E5%B7%A5%E5%85%B7%EF%BC%88%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%811688%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/561294/%E7%94%B5%E5%95%86%E8%AF%A6%E6%83%85%E9%A1%B5%E7%85%A7%E7%89%87%E8%A7%86%E9%A2%91%E6%89%93%E5%8C%85%E5%B7%A5%E5%85%B7%EF%BC%88%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%811688%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 全局状态 ---
    const STATE = {
        mainList: [],
        commentList: [],
        mediaList: [],
        selectedIndices: new Set(),
        isDirectDownload: false,
        isMinimized: false,
        fetchComments: false
    };

    // --- CSS 样式 (保持 V0.9.1 不变) ---
    GM_addStyle(`
        .start-button {
            position: fixed; top: 100px; right: 20px;
            background-color: #ff5000; color: white;
            border: none; padding: 12px 24px; border-radius: 8px;
            cursor: pointer; z-index: 999999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-weight: bold; font-family: sans-serif;
        }
        .start-button:hover { background-color: #ff3000; }

        .minimized-ball {
            position: fixed; bottom: 100px; right: 30px;
            width: 50px; height: 50px; border-radius: 50%;
            background: #ff5000; color: white;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; cursor: pointer; z-index: 999999;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            display: none; border: 2px solid white;
        }
        .minimized-ball:hover { transform: scale(1.1); }

        .selection-popup {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #fdfdfd; width: 90%; height: 90%;
            z-index: 1000000; border-radius: 8px;
            box-shadow: 0 0 50px rgba(0,0,0,0.5);
            display: flex; flex-direction: column;
            padding: 15px; box-sizing: border-box;
            user-select: none;
        }
        .popup-header { display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; }

        .win-controls button {
            margin-left: 10px; padding: 4px 12px; border: none; border-radius: 4px;
            cursor: pointer; color: white; font-size: 12px;
        }
        .btn-min { background: #f0ad4e; }
        .btn-close { background: #d9534f; }

        .grid-container {
            flex: 1; overflow-y: auto; display: grid;
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 12px; padding: 10px; position: relative;
            background: #f5f5f5; border-radius: 4px;
        }
        .media-card {
            position: relative; aspect-ratio: 1; border: 3px solid transparent;
            cursor: pointer; overflow: hidden; background: #fff; border-radius: 4px;
            transition: transform 0.1s;
        }
        .media-card:hover { transform: scale(1.02); }
        .media-card img, .media-card video { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        .media-card.selected { border-color: #ff5000; background: #fff0e6; }
        .media-card.selected::after {
            content: '✔'; position: absolute; top: 5px; right: 5px;
            background: #ff5000; color: white; width: 24px; height: 24px;
            border-radius: 50%; text-align: center; line-height: 24px;
            font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .action-icon {
            position: absolute; bottom: 5px; right: 5px;
            width: 24px; height: 24px; border-radius: 50%;
            background: rgba(0,0,0,0.6); color: white;
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; cursor: pointer; z-index: 10;
        }
        .action-icon:hover { background: #000; }

        .video-overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
            pointer-events: none;
        }
        .video-icon {
            font-size: 40px; color: white; text-shadow: 0 2px 10px rgba(0,0,0,0.5);
            border: 2px solid white; border-radius: 50%; width: 60px; height: 60px;
            text-align: center; line-height: 55px; background: rgba(0,0,0,0.2);
        }

        .comment-badge {
            position: absolute; top: 5px; left: 5px;
            background: rgba(0,0,0,0.5); color: #fff; font-size: 10px;
            padding: 2px 4px; border-radius: 4px; pointer-events: none;
        }

        .drag-selection-box {
            position: absolute; border: 1px solid #1890ff; background: rgba(24, 144, 255, 0.2);
            pointer-events: none; z-index: 1000010; display: none;
        }
        .control-bar { margin-top: 15px; display: flex; gap: 15px; justify-content: flex-end; align-items: center; }
        .tips { margin-right: auto; color: #666; font-size: 12px; }
        .btn { padding: 10px 25px; cursor: pointer; border: none; border-radius: 4px; color: white; font-weight: bold; }
        .btn-dl { background: #ff5000; }

        .preview-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 2000000;
            display: none; flex-direction: column; align-items: center; justify-content: center;
        }
        .preview-content { max-width: 90%; max-height: 85%; border: 2px solid #fff; }
        .preview-close {
            position: absolute; top: 20px; right: 30px;
            color: white; font-size: 40px; cursor: pointer; user-select: none;
        }

        .mode-label { display: flex; align-items: center; gap: 5px; cursor: pointer; font-size: 14px; color: #333; margin-left: 10px; }

        .status-toast {
            position: fixed; top: 10px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.7); color: #fff; padding: 5px 15px;
            border-radius: 20px; z-index: 9999999; font-size: 12px; pointer-events: none;
            display: none;
        }

        .msg-toast {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.85); color: white; padding: 15px 30px;
            border-radius: 8px; z-index: 1000001; pointer-events: none; font-size: 16px;
        }
    `);

    // --- 启动逻辑 ---
    const btn = document.createElement('button');
    btn.className = 'start-button';
    btn.innerText = '📦 资源抓取';
    document.body.appendChild(btn);

    const minBall = document.createElement('div');
    minBall.className = 'minimized-ball';
    minBall.innerHTML = '📂';
    minBall.title = '点击恢复窗口';
    document.body.appendChild(minBall);

    const statusToast = document.createElement('div');
    statusToast.className = 'status-toast';
    document.body.appendChild(statusToast);

    function updateStatus(text) {
        statusToast.innerText = text;
        statusToast.style.display = 'block';
    }
    function hideStatus() { statusToast.style.display = 'none'; }

    btn.onclick = async () => {
        if (STATE.mediaList.length > 0 && STATE.isMinimized) {
            restoreWindow();
            return;
        }

        // --- 核心改动：强制切换到第一张主图 ---
        showToast('正在重置主图以加载视频...');
        try {
            // 使用你提供的类名寻找第一张缩略图
            const firstThumb = document.querySelector('.thumbnailPic--QasTmWDm');
            // 备用选择器，防止类名变化
            const fallbackThumb = document.querySelector('.thumbnails--v976to2t .thumbnail--TxeB1sWz img');

            const target = firstThumb || fallbackThumb;

            if (target) {
                // 模拟点击
                target.click();
                // 模拟鼠标悬停 (有些旧版淘宝是hover触发)
                target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                console.log('已触发第一张主图点击/悬停');
            } else {
                console.log('未找到缩略图，跳过重置步骤');
            }
        } catch (e) {
            console.error('主图重置失败', e);
        }

        // 等待视频播放器渲染
        await sleep(800);

        showToast('正在执行全域扫描...');
        await autoScrollBody();
        STATE.mainList = scanMainResources();
        STATE.commentList = [];
        updateMergedList();

        if (STATE.mediaList.length === 0) {
            showToast('⚠️ 未找到有效资源');
        } else {
            showSelectionUI();
        }
    };

    minBall.onclick = restoreWindow;

    function minimizeWindow() {
        const popup = document.querySelector('.selection-popup');
        if (popup) { popup.style.display = 'none'; minBall.style.display = 'flex'; STATE.isMinimized = true; }
    }

    function restoreWindow() {
        const popup = document.querySelector('.selection-popup');
        if (popup) { popup.style.display = 'flex'; minBall.style.display = 'none'; STATE.isMinimized = false; }
        else { showSelectionUI(); }
    }

    function updateMergedList() {
        if (STATE.fetchComments) {
            STATE.mediaList = [...STATE.mainList, ...STATE.commentList];
        } else {
            STATE.mediaList = [...STATE.mainList];
        }
    }

    async function autoScrollBody() {
        return new Promise(resolve => {
            let totalHeight = 0, distance = 600;
            let timer = setInterval(() => {
                window.scrollBy(0, distance); totalHeight += distance;
                if (totalHeight >= document.body.scrollHeight) {
                    clearInterval(timer); window.scrollTo(0, 0); setTimeout(resolve, 800);
                }
            }, 80);
        });
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const cleanTaobaoUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('//')) url = 'https:' + url;
        url = url.replace(/(\.(?:jpg|jpeg|png|gif))_.+$/i, '$1');
        return url;
    };

    // --- 1. 主资源扫描 ---
    function scanMainResources() {
        const uniqueUrls = new Set();
        const results = [];

        // 暴力正则兜底
        try {
            const fullHtml = document.documentElement.outerHTML;
            const videoRegex = /https?:\\?\/\\?\/[^"']+\.(cloudvideocdn\.taobao\.com|cloud\.video\.taobao\.com)[^"']+\.mp4/g;
            const matches = fullHtml.match(videoRegex);
            if (matches) {
                matches.forEach(rawUrl => {
                    let vUrl = rawUrl.replace(/\\/g, '');
                    if (!uniqueUrls.has(vUrl)) {
                        uniqueUrls.add(vUrl);
                        results.unshift({ url: vUrl, type: 'video' });
                    }
                });
            }
        } catch (e) { console.error('视频扫描错误', e); }

        const selectors = [
            '#mainPicImageEl', '#videox-video-el', '.mainPicVideo--z7b6kr8y',
            '.thumbnailPic--QasTmWDm', '.mainPicWrap--Ns5WQiHr',
            '#imageTextInfo-container', '#J_DivItemDesc',
            '.descV8-container', '.descV8-singleImage'
        ];
        const garbage = [
            '#J_GuessYouLike', '.recommend', '.p-guess', '.ald-sku',
            '#J_MoreItem', '[class*="recommendsWrap"]', '[class*="shopHeader"]',
            '[class*="askAnswerWrap"]', '[class*="bottomPlaceholder"]',
            '.Comments--eCO6Uz4o'
        ];
        const isGarbage = (el) => garbage.some(sel => el.closest(sel));

        selectors.forEach(sel => {
            const els = sel.startsWith('#') ? [document.querySelector(sel)] : document.querySelectorAll(`[class*="${sel.substring(1)}"]`);
            els.forEach(el => {
                if (!el || isGarbage(el)) return;
                const add = (u, t) => {
                    const c = cleanTaobaoUrl(u);
                    if (c && !uniqueUrls.has(c) && !c.includes('blank.gif')) { uniqueUrls.add(c); results.push({url:c, type:t}); }
                };
                if (el.tagName === 'IMG') add(el.getAttribute('src'), 'image');
                else el.querySelectorAll('img').forEach(img => add(img.getAttribute('data-src') || img.src, 'image'));

                // 此时因为已经重置了主图，Video 标签应该存在
                if (el.tagName === 'VIDEO') add(el.src, 'video');
                else el.querySelectorAll('video').forEach(v => add(v.src, 'video'));
            });
        });

        if (results.length < 5) {
             document.querySelectorAll('img').forEach(img => {
                 if (!isGarbage(img) && img.width > 200) {
                     const c = cleanTaobaoUrl(img.getAttribute('data-src') || img.src);
                     if (c && !uniqueUrls.has(c)) { uniqueUrls.add(c); results.push({ url: c, type: 'image' }); }
                 }
             });
        }
        return results;
    }

    // --- 2. 评论区自动化 (滚轮模拟) ---
    async function automateCommentFetching() {
        updateStatus('正在寻找"查看全部"...');
        const showAllBtn = document.querySelector('.ShowButton--fMu7HZNs');
        if (showAllBtn) {
            showAllBtn.click();
            await sleep(1500);
        }

        updateStatus('正在切换"图/视频"...');
        const filters = Array.from(document.querySelectorAll('.imprItem--fTAkDWa5'));
        const picFilter = filters.find(el => el.textContent.includes('图/视频'));
        if (picFilter) {
            picFilter.click();
            await sleep(1500);
        }

        // 定位滚动容器
        updateStatus('正在定位滚动区域...');
        const drawer = document.querySelector('[class*="Drawer--"]');
        const root = drawer || document.body;
        const allDivs = root.querySelectorAll('div');
        let candidates = [];

        for (let div of allDivs) {
            const style = window.getComputedStyle(div);
            const isScrollable = style.overflowY === 'auto' || style.overflowY === 'scroll';
            if (isScrollable && div.scrollHeight > div.clientHeight) {
                candidates.push(div);
            }
        }
        if (candidates.length === 0) {
             for (let div of allDivs) {
                if (div.scrollHeight > div.clientHeight + 100 && div.clientHeight > 300) {
                    candidates.push(div);
                }
            }
        }
        candidates.sort((a, b) => b.clientHeight - a.clientHeight);
        const commentContainer = candidates[0];

        if (commentContainer) {
            const originalBorder = commentContainer.style.border;
            commentContainer.style.border = "3px solid red"; // 调试红框
            updateStatus('开始滚动加载...');

            let lastScrollTop = -1;
            let noChangeCount = 0;
            const MAX_NO_CHANGE = 10;

            while (true) {
                lastScrollTop = commentContainer.scrollTop;
                // 模拟滚轮
                commentContainer.dispatchEvent(new WheelEvent('wheel', { deltaY: 500, bubbles: true, cancelable: true }));
                commentContainer.scrollTop += 500;

                await sleep(200);

                if (Math.abs(commentContainer.scrollTop - lastScrollTop) < 2) {
                    noChangeCount++;
                    updateStatus(`加载中... (${noChangeCount})`);
                    commentContainer.scrollBy(0, -50);
                    await sleep(100);
                    commentContainer.scrollBy(0, 50);
                    if (noChangeCount >= MAX_NO_CHANGE) break;
                } else {
                    noChangeCount = 0;
                    updateStatus(`已加载高度: ${commentContainer.scrollTop}px`);
                }
            }

            commentContainer.style.border = originalBorder;
            updateStatus('评论加载完成');
            await sleep(1000);
        } else {
            console.warn("未找到评论滚动容器");
            updateStatus('未找到滚动区');
        }

        hideStatus();
        return scanCommentsNow();
    }

    function scanCommentsNow() {
        const uniqueUrls = new Set();
        const results = [];
        const photoWrappers = document.querySelectorAll(`[class*="photo--"]`); // 模糊匹配所有评论图

        photoWrappers.forEach(wrapper => {
            const img = wrapper.querySelector('img');
            if (img) {
                const src = cleanTaobaoUrl(img.getAttribute('src') || img.getAttribute('data-src'));
                if (src && !uniqueUrls.has(src)) {
                    uniqueUrls.add(src);
                    const isVideo = wrapper.querySelector('[class*="playerIcon"]');
                    results.push({
                        url: src,
                        type: 'image',
                        isComment: true,
                        isCommentVideo: !!isVideo
                    });
                }
            }
        });
        console.log(`评论区扫描完成: ${results.length} 个`);
        return results;
    }

    // --- UI 交互 ---
    function showSelectionUI() {
        document.querySelector('.selection-popup')?.remove();
        minBall.style.display = 'none';

        const popup = document.createElement('div');
        popup.className = 'selection-popup';

        const header = document.createElement('div');
        header.className = 'popup-header';
        const title = document.createElement('h3');
        title.innerText = `资源列表 (${STATE.mediaList.length})`;
        header.appendChild(title);

        const controls = document.createElement('div');
        controls.className = 'win-controls';
        const minBtn = document.createElement('button');
        minBtn.className = 'btn-min'; minBtn.innerText = '一 最小化'; minBtn.onclick = minimizeWindow;
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn-close'; closeBtn.innerText = '✕ 关闭';
        closeBtn.onclick = () => { popup.remove(); STATE.mediaList = []; STATE.mainList = []; STATE.commentList = []; STATE.selectedIndices.clear(); STATE.isMinimized = false; };
        controls.append(minBtn, closeBtn);
        header.appendChild(controls);

        const grid = document.createElement('div');
        grid.className = 'grid-container';

        function renderGrid() {
            grid.innerHTML = '';
            title.innerText = `资源列表 (${STATE.mediaList.length})`;
            let lastSelectedIndex = -1;
            const cardElements = [];

            STATE.mediaList.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'media-card';
                if (STATE.selectedIndices.has(index)) card.classList.add('selected');

                let innerHTML = '';
                if (item.type === 'video') {
                    innerHTML = `<video src="${item.url}#t=0.1" preload="metadata"></video><div class="video-overlay"><div class="video-icon">▶</div></div>`;
                } else {
                    innerHTML = `<img src="${item.url}">`;
                }
                if (item.isComment) {
                    innerHTML += `<div class="comment-badge">${item.isCommentVideo ? '评论视频(封面)' : '评论图'}</div>`;
                }
                innerHTML += `<div class="action-icon" title="预览">👁</div>`;
                card.innerHTML = innerHTML;

                const triggerPreview = (e) => { e.stopPropagation(); showPreview(item.url, item.type); };
                card.querySelector('.action-icon').onmousedown = triggerPreview;
                card.ondblclick = triggerPreview;

                card.onmousedown = (e) => {
                    if (e.target.classList.contains('action-icon')) return;
                    if (e.button === 0) {
                        if (e.shiftKey && lastSelectedIndex !== -1) {
                            const start = Math.min(lastSelectedIndex, index);
                            const end = Math.max(lastSelectedIndex, index);
                            for (let i = start; i <= end; i++) {
                                STATE.selectedIndices.add(i);
                                cardElements[i].classList.add('selected');
                            }
                        } else if (e.ctrlKey || e.metaKey) {
                            toggleSelection(index, card);
                        } else {
                            toggleSelection(index, card);
                            lastSelectedIndex = index;
                        }
                        updateDownloadBtn();
                    }
                };
                grid.appendChild(card);
                cardElements.push(card);
            });
            setupDragSelection(grid, cardElements, updateDownloadBtn);
            updateDownloadBtn();
        }

        function toggleSelection(index, card) {
            if (STATE.selectedIndices.has(index)) { STATE.selectedIndices.delete(index); card.classList.remove('selected'); }
            else { STATE.selectedIndices.add(index); card.classList.add('selected'); }
        }

        const bar = document.createElement('div');
        bar.className = 'control-bar';
        const tips = document.createElement('div');
        tips.className = 'tips';
        tips.innerHTML = '<b>双击预览</b> | 框选批量';

        const dlModeLabel = document.createElement('label');
        dlModeLabel.className = 'mode-label';
        const dlModeCheck = document.createElement('input');
        dlModeCheck.type = 'checkbox';
        dlModeCheck.checked = STATE.isDirectDownload;
        dlModeCheck.onchange = (e) => { STATE.isDirectDownload = e.target.checked; };
        dlModeLabel.append(dlModeCheck, document.createTextNode(" 直接下载"));

        const commentModeLabel = document.createElement('label');
        commentModeLabel.className = 'mode-label';
        const commentCheck = document.createElement('input');
        commentCheck.type = 'checkbox';
        commentCheck.checked = STATE.fetchComments;

        commentCheck.onchange = async (e) => {
            STATE.fetchComments = e.target.checked;
            if (STATE.fetchComments) {
                STATE.commentList = await automateCommentFetching();
            } else {
                STATE.commentList = [];
            }
            STATE.selectedIndices.clear();
            updateMergedList();
            renderGrid();
        };
        commentModeLabel.append(commentCheck, document.createTextNode(" 包含评论图(自动展开)"));

        const dlBtn = document.createElement('button');
        dlBtn.className = 'btn btn-dl';

        function updateDownloadBtn() { dlBtn.innerText = `下载选中 (${STATE.selectedIndices.size})`; }
        dlBtn.onclick = handleDownload;

        bar.append(tips, commentModeLabel, dlModeLabel, dlBtn);
        popup.append(header, grid, bar);
        document.body.appendChild(popup);

        renderGrid();
    }

    function showPreview(url, type) {
        document.querySelector('.preview-modal')?.remove();
        const modal = document.createElement('div');
        modal.className = 'preview-modal';
        modal.style.display = 'flex';
        const closeBtn = document.createElement('div');
        closeBtn.className = 'preview-close'; closeBtn.innerHTML = '×';
        closeBtn.onclick = () => modal.remove();
        let content;
        if (type === 'video') {
            content = document.createElement('video'); content.src = url; content.controls = true; content.autoplay = true;
        } else {
            content = document.createElement('img'); content.src = url;
        }
        content.className = 'preview-content';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        modal.append(content, closeBtn); document.body.appendChild(modal);
    }

    function setupDragSelection(container, elements, callback) {
        const box = document.createElement('div');
        box.className = 'drag-selection-box';
        container.appendChild(box);
        let isDragging = false, startX, startY;
        container.addEventListener('mousedown', (e) => {
            if (e.target !== container) return;
            isDragging = true;
            const rect = container.getBoundingClientRect();
            startX = e.clientX - rect.left + container.scrollLeft;
            startY = e.clientY - rect.top + container.scrollTop;
            box.style.display = 'block';
        });
        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const cx = e.clientX - rect.left + container.scrollLeft;
            const cy = e.clientY - rect.top + container.scrollTop;
            const w = Math.abs(cx - startX), h = Math.abs(cy - startY);
            const l = Math.min(cx, startX), t = Math.min(cy, startY);
            box.style.left = l+'px'; box.style.top = t+'px'; box.style.width = w+'px'; box.style.height = h+'px';
            elements.forEach((card, i) => {
                const cR = card.getBoundingClientRect();
                const gR = container.getBoundingClientRect();
                const cL = cR.left - gR.left + container.scrollLeft;
                const cT = cR.top - gR.top + container.scrollTop;
                if (l < cL + cR.width && l + w > cL && t < cT + cR.height && t + h > cT) {
                    STATE.selectedIndices.add(i);
                    card.classList.add('selected');
                }
            });
            callback();
        });
        document.addEventListener('mouseup', () => { isDragging = false; box.style.display = 'none'; });
    }

    async function handleDownload() {
        const urls = Array.from(STATE.selectedIndices).map(i => STATE.mediaList[i].url);
        const types = Array.from(STATE.selectedIndices).map(i => STATE.mediaList[i].type);
        if (urls.length === 0) return alert('请至少选择一张图片');

        if (STATE.isDirectDownload) {
            showToast('开始直接下载...');
            for (let i = 0; i < urls.length; i++) {
                try {
                    const blob = await ajaxDownload(urls[i]);
                    const ext = urls[i].includes('.mp4') ? 'mp4' : 'jpg';
                    saveAs(blob, `file_${i}.${ext}`);
                } catch(e) {}
                await new Promise(r => setTimeout(r, 200));
            }
            showToast('直接下载任务已下发');
        } else {
            const zip = new PizZip();
            let successCount = 0;
            showToast('开始打包...');
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                const ext = url.includes('.mp4') ? 'mp4' : 'jpg';
                const name = `${types[i]}_${String(i+1).padStart(3, '0')}.${ext}`;
                try {
                    const data = await ajaxDownload(url);
                    if (data) { zip.file(name, data); successCount++; }
                } catch (e) {}
                if (i % 3 === 0) showToast(`打包进度: ${i+1}/${urls.length}`);
            }
            if (successCount === 0) return alert('下载失败');
            showToast('正在生成 ZIP...');
            const content = zip.generate({ type: 'blob' });
            saveAs(content, `${document.title.substring(0, 20)}_素材包.zip`);
            showToast('下载完成!');
        }
    }

    function ajaxDownload(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: url, responseType: STATE.isDirectDownload ? 'blob' : 'arraybuffer',
                headers: { 'Referer': window.location.href },
                onload: (res) => res.status === 200 ? resolve(res.response) : reject(),
                onerror: reject
            });
        });
    }

    function showToast(msg) {
        let toast = document.querySelector('.msg-toast');
        if (!toast) { toast = document.createElement('div'); toast.className = 'msg-toast'; document.body.appendChild(toast); }
        toast.innerText = msg; toast.style.display = 'block';
        clearTimeout(toast.timer); toast.timer = setTimeout(() => { toast.style.display = 'none'; }, 2000);
    }
})();
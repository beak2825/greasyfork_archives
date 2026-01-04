// ==UserScript==
// @name         猎聘自动全能助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  全能猎头辅助工具：1.【自动寻猎】自动搜索关键词、自动批量打招呼、自动选职位、自动处理限制；2.【简历下载】批量下载简历（Word格式）、自动翻页、去重过滤。内置随机延迟防封控，支持悬浮窗随意拖动。
// @author       Duke.Tom
// @match        https://*.liepin.com/*
// @icon         https://www.liepin.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557283/%E7%8C%8E%E8%81%98%E8%87%AA%E5%8A%A8%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557283/%E7%8C%8E%E8%81%98%E8%87%AA%E5%8A%A8%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // ⚙️ 配置与存储
    // ============================================================

    const SEARCH_QUEUE_KEY = 'gemini_search_keywords_queue';
    const CONTACTED_ID_KEY = 'gemini_contacted_ids_v1';
    const DOWNLOADED_ID_KEY = 'gemini_downloaded_ids_v1';

    let jobMatchKeyword = "";
    let maxContactLimit = 10;

    // --- 选择器配置 ---

    // 1. 通用
    const SEL_CLOSE_BTN = '.closeBtn--I_u6B';
    const SEL_ID_INPUT = 'input[name="resumelistcheckbox"]';

    // 2. 搜索页面 (精准定位主搜框)
    const SEL_SEARCH_INPUT = 'input.searchInput--KgDn1[placeholder*="搜职位/公司/行业等"]';
    const SEL_SEARCH_BTN_CANDIDATE = 'button.ant-lpt-btn-primary';
    const SEL_SEARCH_CARD_NAME = '.nest-resume-personal-name';
    const SEL_IM_BTN = '.xpath-open-im-btn';

    // 3. 职位选择弹窗 (【关键修复】限制在modal内部查找，防止误触主搜框)
    const SEL_JOB_SEARCH_INPUT = '.ant-lpt-modal-content input.ant-lpt-input';

    const SEL_JOB_LIST_ITEM = 'li.active--nJIZF';
    const SEL_JOB_LIST_ITEM_FALLBACK = 'div[class*="jobListWrap"] li';
    const SEL_JOB_CONFIRM_BTN = '.ant-lpt-modal-footer button.ant-lpt-btn-primary';

    // 4. 下载页面
    const SEL_DL_CARD = '.new-apply-card-content';
    const SEL_DL_SAVE_BTN = '.xpath-resume-save-btn';
    const SEL_DL_WORD_FMT = '.ant-lpt-teno-tag-checkable';
    const SEL_DL_CONFIRM = '.ant-lpt-btn-primary';
    const SEL_DL_NEXT_PAGE = 'li.ant-im-pagination-next button';

    let isPaused = false;

    // ============================================================
    // 🛠️ 工具函数
    // ============================================================

    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function randomSleep(min, max) {
        const ms = getRandomInt(min, max);
        console.log(`⏳ [系统] 随机等待 ${(ms/1000).toFixed(1)} 秒...`);
        return new Promise(r => setTimeout(r, ms));
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    function setReactInputValue(input, value) {
        if (!input) return;
        const lastValue = input.value;
        input.value = value;
        const event = new Event('input', { bubbles: true });
        const tracker = input._valueTracker;
        if (tracker) { tracker.setValue(lastValue); }
        input.dispatchEvent(event);
    }

    function findButtonByText(text, parent = document) {
        const btns = parent.querySelectorAll('button');
        for (let btn of btns) {
            if (btn.innerText.includes(text)) return btn;
        }
        return null;
    }

    async function checkPauseState(btnId) {
        if (isPaused) {
            const btn = document.getElementById(btnId);
            if(btn) { btn.innerText = '▶️ 继续'; btn.style.background = '#4CAF50'; }
            console.log('⏸️ 脚本已暂停...');
            while (isPaused) await sleep(1000);
            console.log('▶️ 脚本恢复运行');
            if(btn) { btn.innerText = '⏸️ 暂停'; btn.style.background = '#FF9800'; }
        }
    }

    function getStoredList(key) { const str = localStorage.getItem(key); return str ? JSON.parse(str) : []; }
    function addToStoredList(key, id) { if(!id) return; const list = getStoredList(key); if(!list.includes(id)) { list.push(id); localStorage.setItem(key, JSON.stringify(list)); } }
    function isStored(key, id) { return id ? getStoredList(key).includes(id) : false; }

    // ============================================================
    // 🕵️ 模块一：自动寻猎
    // ============================================================

    function getSearchQueue() { return getStoredList(SEARCH_QUEUE_KEY); }
    function setSearchQueue(list) { localStorage.setItem(SEARCH_QUEUE_KEY, JSON.stringify(list)); updateSearchUI(); }

    // 1. 执行搜索 (精准锁定顶部框)
    async function performSearch(keyword) {
        const input = document.querySelector(SEL_SEARCH_INPUT);
        if (!input) {
            console.error('❌ 未找到主搜索框 (placeholder匹配失败)');
            alert('未找到主搜索框！脚本停止。');
            return false;
        }

        console.log('🧹 清空主搜索框...');
        input.focus();
        setReactInputValue(input, '');
        await sleep(300);

        console.log(`🔍 输入新关键词: ${keyword}`);
        setReactInputValue(input, keyword);
        await sleep(500);

        const searchBtn = findButtonByText('搜索');
        if (searchBtn) {
            searchBtn.click();

            // 【关键修复】点击搜索后，强制让输入框失去焦点，防止下拉菜单残留
            input.blur();

            console.log('👆 已点击搜索，等待加载...');
            await randomSleep(3000, 5000);
            return true;
        } else {
            alert('未找到“搜索”按钮！');
            return false;
        }
    }

    // 2. 处理职位选择弹窗
    async function handleJobSelectionModal() {
        // 【关键修复】只在弹窗内部查找输入框
        const jobInput = document.querySelector(SEL_JOB_SEARCH_INPUT);

        // 如果没找到弹窗内的输入框，说明弹窗没出来，直接返回
        if (!jobInput) return false;

        console.log('💬 检测到“职位选择”弹窗，开始处理...');

        if (jobMatchKeyword) {
            setReactInputValue(jobInput, '');
            await sleep(200);
            setReactInputValue(jobInput, jobMatchKeyword);
            await randomSleep(1500, 2000);
        }

        let firstJob = document.querySelector(SEL_JOB_LIST_ITEM) || document.querySelector(SEL_JOB_LIST_ITEM_FALLBACK);
        if (firstJob) {
            firstJob.click();
            await sleep(800);
        }

        const confirmBtn = document.querySelector(SEL_JOB_CONFIRM_BTN);
        if (confirmBtn) {
            confirmBtn.click();
            console.log('✅ 确认职位');
            await randomSleep(1500, 2500);
        }
        return true;
    }

    async function handleSuccessModal() {
        const closeBtn = findButtonByText('关闭');
        if (closeBtn) {
            console.log('✅ 关闭成功提示窗');
            closeBtn.click();
            await sleep(1000);
            return true;
        }
        return false;
    }

    async function closeDetailModal() {
        console.log('❎ 关闭详情页');
        const closeBtn = document.querySelector(SEL_CLOSE_BTN);
        if (closeBtn) {
            closeBtn.click();
        } else {
            document.body.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));
        }
        await sleep(1000);
    }

    // 3. 批量处理当前页 (循环点人，绝不重搜)
    async function processCurrentPageContacts(currentCount) {
        const cards = document.querySelectorAll(SEL_SEARCH_CARD_NAME);
        if (cards.length === 0) { console.warn('⚠️ 本页无候选人'); return currentCount; }

        console.log(`📋 本页共 ${cards.length} 人`);

        for (let i = 0; i < cards.length; i++) {
            if (currentCount >= maxContactLimit) {
                console.log(`🛑 已达限制 (${maxContactLimit}人)，本词结束。`);
                return currentCount;
            }

            await checkPauseState('gemini-hunt-pause-btn');

            const card = cards[i];
            let container = card.closest('div.list-item') || card.closest('tr') || card.parentElement.parentElement;
            let idInput = container ? container.querySelector(SEL_ID_INPUT) : null;
            let candidateId = idInput ? idInput.value : null;

            if (candidateId && isStored(CONTACTED_ID_KEY, candidateId)) {
                console.log(`⏭️ 跳过已沟通 (ID: ${candidateId})`);
                card.style.opacity = '0.5';
                continue;
            }

            console.log(`👉 [${currentCount + 1}/${maxContactLimit}] 联系第 ${i+1} 位...`);

            try {
                card.click();
                await randomSleep(2000, 4000);

                const imBtn = document.querySelector(SEL_IM_BTN);
                if (imBtn) {
                    imBtn.click();

                    if (candidateId) addToStoredList(CONTACTED_ID_KEY, candidateId);
                    currentCount++;
                    await randomSleep(1500, 2500);

                    // 处理可能的弹窗
                    await handleJobSelectionModal();
                    await handleSuccessModal();
                } else {
                    console.warn('❌ 未找到沟通按钮');
                }

                await closeDetailModal();
                await randomSleep(2000, 3000);

            } catch (e) {
                console.error(e);
                await closeDetailModal();
            }
        }
        return currentCount;
    }

    // 4. 主循环
    async function startAutoHunt() {
        const queue = getSearchQueue();
        if (queue.length === 0) { alert('请先保存关键词！'); return; }

        const jobKwInput = document.getElementById('hunt-job-keyword');
        jobMatchKeyword = jobKwInput ? jobKwInput.value.trim() : "";

        const limitInput = document.getElementById('hunt-limit-count');
        maxContactLimit = limitInput ? parseInt(limitInput.value) : 10;

        if (!confirm(`🚀 自动寻猎启动\n\n关键词：${queue.length} 个\n每词限制：${maxContactLimit} 人\n职位匹配：${jobMatchKeyword || "默认"}\n\n是否继续？`)) return;

        const pBtn = document.getElementById('gemini-hunt-pause-btn');
        if(pBtn) pBtn.style.display = 'block';

        while (queue.length > 0) {
            const keyword = queue[0];

            console.clear();
            console.log(`🏁 === 处理关键词: ${keyword} ===`);

            // 搜一次
            const success = await performSearch(keyword);
            if (!success) break;

            // 批量沟通
            await processCurrentPageContacts(0);

            // 下一个词
            queue.shift();
            setSearchQueue(queue);
            console.log(`✅ 关键词 [${keyword}] 完成，休息中...`);
            await randomSleep(3000, 5000);
        }
        alert('🎉 任务全部完成！');
        if(pBtn) pBtn.style.display = 'none';
    }

    // --- UI 构建 (悬浮窗) ---
    // ... (UI部分保持 v8.0 的高级悬浮窗样式) ...
    function makeDraggable(panel, header) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        header.style.cursor = 'move';
        header.style.userSelect = 'none';
        header.addEventListener('mousedown', (e) => {
            if(e.target.tagName === 'BUTTON') return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
            panel.style.left = `${initialLeft}px`;
            panel.style.top = `${initialTop}px`;
            panel.style.opacity = '0.9';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = `${initialLeft + (e.clientX - startX)}px`;
            panel.style.top = `${initialTop + (e.clientY - startY)}px`;
        });
        document.addEventListener('mouseup', () => { isDragging = false; panel.style.opacity = '1'; });
    }

    function createSmartPanel(id, title, initialHTML, isSearchPanel = true) {
        if (document.getElementById(id)) return document.getElementById(id);
        const panel = document.createElement('div');
        panel.id = id;
        panel.style.cssText = `position: fixed; z-index: 99999; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); border: 1px solid #ddd; width: 240px; overflow: hidden; font-family: sans-serif;`;
        if (isSearchPanel) { panel.style.top = '80px'; panel.style.right = '20px'; } else { panel.style.bottom = '20px'; panel.style.right = '20px'; }
        const header = document.createElement('div');
        header.style.cssText = `background: #1976D2; color: white; padding: 10px 15px; font-size: 14px; font-weight: bold; display: flex; justify-content: space-between; align-items: center;`;
        const titleSpan = document.createElement('span'); titleSpan.innerText = title;
        const minBtn = document.createElement('button'); minBtn.innerText = '➖';
        minBtn.style.cssText = `background: transparent; border: none; color: white; cursor: pointer; font-size: 14px; padding: 0 5px;`;
        header.appendChild(titleSpan); header.appendChild(minBtn); panel.appendChild(header);
        const body = document.createElement('div'); body.id = `${id}-body`; body.style.padding = '15px'; body.style.display = 'block'; body.innerHTML = initialHTML;
        panel.appendChild(body);
        document.body.appendChild(panel);
        makeDraggable(panel, header);
        let isMin = false;
        minBtn.onclick = () => {
            isMin = !isMin;
            if (isMin) { body.style.display = 'none'; minBtn.innerText = '⬜'; panel.style.width = 'auto'; }
            else { body.style.display = 'block'; minBtn.innerText = '➖'; panel.style.width = '240px'; }
        };
        return body;
    }

    function createHuntPanel() {
        if (document.getElementById('gemini-hunt-panel')) return;

        const htmlContent = `
            <label style="font-size:12px; font-weight:bold; display:block; margin-bottom:5px;">1. 搜人关键词 (一行一个):</label>
            <textarea id="hunt-keywords" placeholder="射频\n硬件" style="width:100%; height:60px; margin-bottom:5px; font-size:12px; border:1px solid #ccc; border-radius:4px;"></textarea>
            <div style="display:flex; gap:5px; margin-bottom:10px;">
                <button id="btn-save-kw" style="flex:1; background:#2196F3; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer;">📥 保存</button>
                <button id="btn-clear-kw" style="flex:1; background:#f44336; color:white; border:none; padding:5px; border-radius:4px; cursor:pointer;">🗑️ 清空</button>
            </div>

            <label style="font-size:12px; font-weight:bold; display:block; margin-bottom:5px;">2. 职位匹配词 (可选):</label>
            <input id="hunt-job-keyword" type="text" placeholder="例如：仿真" style="width:100%; margin-bottom:10px; padding:5px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box; font-size:12px;">

            <label style="font-size:12px; font-weight:bold; display:block; margin-bottom:5px;">3. 限制数量 (每词):</label>
            <input id="hunt-limit-count" type="number" value="10" style="width:100%; margin-bottom:10px; padding:5px; border:1px solid #ccc; border-radius:4px; box-sizing: border-box; font-size:12px;">

            <div id="hunt-status" style="font-size:12px; color:#666; margin-bottom:8px;">待搜: 0 个词</div>

            <button id="gemini-hunt-pause-btn" style="width:100%; background:#FF9800; color:white; border:none; padding:8px; border-radius:4px; margin-bottom:5px; display:none; cursor:pointer;">⏸️ 暂停</button>
            <button id="btn-start-hunt" style="width:100%; background:#4CAF50; color:white; border:none; padding:10px; border-radius:4px; cursor:pointer; font-weight:bold;">🚀 开始自动寻猎</button>
        `;

        createSmartPanel('gemini-hunt-panel', '🐯 AI 全自动猎头', htmlContent, true);

        document.getElementById('btn-save-kw').onclick = () => {
            const txt = document.getElementById('hunt-keywords').value;
            const kws = txt.split('\n').map(s=>s.trim()).filter(s=>s);
            setSearchQueue(kws);
            document.getElementById('hunt-keywords').value = '';
            alert(`已保存 ${kws.length} 个关键词`);
        };
        document.getElementById('btn-clear-kw').onclick = () => { setSearchQueue([]); };
        document.getElementById('btn-start-hunt').onclick = startAutoHunt;
        document.getElementById('gemini-hunt-pause-btn').onclick = () => { isPaused = !isPaused; };
        updateSearchUI();
    }

    function updateSearchUI() {
        const q = getSearchQueue();
        const el = document.getElementById('hunt-status');
        if(el) el.innerText = `待搜: ${q.length} 个词`;
    }

    // ============================================================
    // 📥 模块二：简历下载 (v3.2 逻辑)
    // ============================================================

    async function startDownload() {
        if (!confirm('开始【自动下载】简历？\n请允许浏览器下载。')) return;
        const pBtn = document.getElementById('dl-pause-btn');
        if(pBtn) pBtn.style.display = 'block';

        let page = 1;
        while(true) {
            await checkPauseState('dl-pause-btn');
            const cards = document.querySelectorAll(SEL_DL_CARD);
            console.log(`📥 下载第 ${page} 页...`);

            for(let i=0; i<cards.length; i++) {
                await checkPauseState('dl-pause-btn');
                const card = cards[i];
                const idInput = card.querySelector(SEL_ID_INPUT);
                const id = idInput ? idInput.value : null;

                if (id && isStored(DOWNLOADED_ID_KEY, id)) { card.style.opacity = '0.3'; continue; }

                try {
                    card.click();
                    await randomSleep(3000, 5000);
                    const saveBtn = document.querySelector(SEL_DL_SAVE_BTN);
                    if(saveBtn) {
                        saveBtn.click();
                        await randomSleep(1500, 3000);
                        document.querySelector(SEL_DL_WORD_FMT)?.click();
                        await randomSleep(1000, 2000);
                        const confBtns = document.querySelectorAll(SEL_DL_CONFIRM);
                        if(confBtns.length>0) {
                            confBtns[confBtns.length-1].click();
                            if(id) addToStoredList(DOWNLOADED_ID_KEY, id);
                        }
                    }
                    await randomSleep(2000, 4000);
                    document.querySelector(SEL_CLOSE_BTN)?.click();
                    await randomSleep(3000, 5000);
                } catch(e) { console.error(e); }
            }

            const dis = document.querySelector('li.ant-im-pagination-next.ant-im-pagination-disabled');
            if(dis) { alert('下载完成！'); break; }
            const next = document.querySelector(SEL_DL_NEXT_PAGE);
            if(next) { next.click(); page++; await randomSleep(6000, 10000); } else { break; }
        }
    }

    function createDownloadPanel() {
        if(document.getElementById('gemini-dl-panel')) return;

        const htmlContent = `
            <div style="display:flex; flex-direction:column; gap:5px;">
                <button id="btn-start-dl" style="background:#1976D2; color:white; border:none; padding:12px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:14px;">🚀 智能下载简历</button>
                <button id="dl-pause-btn" style="background:#FF9800; color:white; border:none; padding:10px; border-radius:4px; cursor:pointer; display:none;">⏸️ 暂停</button>
                <button id="btn-clear-dl" style="background:#d32f2f; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer; font-size:12px; margin-top:5px;">🗑️ 清除下载记忆</button>
            </div>
        `;

        createSmartPanel('gemini-dl-panel', '📥 智能下载助手', htmlContent, false);

        document.getElementById('btn-clear-dl').onclick = () => { if(confirm('清空下载历史？')) localStorage.removeItem(DOWNLOADED_ID_KEY); };
        document.getElementById('dl-pause-btn').onclick = () => { isPaused = !isPaused; };
        document.getElementById('btn-start-dl').onclick = startDownload;
    }

    // ============================================================
    // 🚦 启动逻辑
    // ============================================================

    setInterval(() => {
        if (location.href.includes('/search')) createHuntPanel();
        if (location.href.includes('/chat/im') && document.querySelector(SEL_DL_CARD)) createDownloadPanel();
    }, 1500);

})();
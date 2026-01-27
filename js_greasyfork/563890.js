// ==UserScript==
// @name         小红书搜索下拉词采集器
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  采集小红书搜索下拉推荐词 + 笔记数据,支持批量词根、自动追加 a-z/0-9 穷举采集
// @author       dami16z
// @match        https://www.xiaohongshu.com/*
// @match        https://edith.xiaohongshu.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      edith.xiaohongshu.com
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563890/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%90%9C%E7%B4%A2%E4%B8%8B%E6%8B%89%E8%AF%8D%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563890/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%90%9C%E7%B4%A2%E4%B8%8B%E6%8B%89%E8%AF%8D%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const CONFIG = {
        debug: true,
        minDelay: 600,
        maxDelay: 1200,
        timeout: 3000,
        suffixes: ['', ' ', ...'0123456789abcdefghijklmnopqrstuvwxyz'.split('')],
        notesPerKeyword: 100,
        pageSize: 20
    };

    // 状态
    const state = {
        isRunning: false,
        mode: 'keywords',
        results: new Map(),
        notesData: [],
        currentSuffixIndex: 0,
        currentKeywordIndex: 0,
        keywords: [],
        coreKeyword: '',
        pendingResolve: null,
        uiVisible: false,
        searchId: ''
    };

    // --- 网络拦截器 ---
    (function() {
        const originalXHR = window.XMLHttpRequest;
        const originalOpen = originalXHR.prototype.open;
        const originalSend = originalXHR.prototype.send;

        originalXHR.prototype.open = function(method, url) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, arguments);
        };

        originalXHR.prototype.send = function() {
            const xhr = this;

            xhr.addEventListener('readystatechange', function() {
                if (xhr.readyState === 4 && xhr._url) {
                    if (xhr._url.includes('/search/recommend')) {
                        if (CONFIG.debug) console.log('[XHS] ✅ XHR拦截推荐:', xhr._url);
                        try {
                            const response = JSON.parse(xhr.responseText);
                            processRecommendResponse(response);
                        } catch (e) {
                            if (CONFIG.debug) console.error('[XHS] ❌ 解析失败:', e);
                        }
                    }
                    if (xhr._url.includes('/search/notes')) {
                        if (CONFIG.debug) console.log('[XHS] ✅ XHR拦截笔记:', xhr._url);
                        try {
                            const response = JSON.parse(xhr.responseText);
                            processNotesResponse(response);
                        } catch (e) {
                            if (CONFIG.debug) console.error('[XHS] ❌ 笔记解析失败:', e);
                        }
                    }
                }
            });

            return originalSend.apply(this, arguments);
        };

        window.XMLHttpRequest = originalXHR;
    })();

    (function() {
        const originalFetch = window.fetch;

        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            try {
                const url = (args[0] instanceof Request) ? args[0].url : args[0];

                if (url && typeof url === 'string') {
                    if (url.includes('/search/recommend')) {
                        if (CONFIG.debug) console.log('[XHS] ✅ Fetch拦截推荐:', url);
                        const clone = response.clone();
                        clone.json().then(data => {
                            processRecommendResponse(data);
                        }).catch(e => {
                            if (CONFIG.debug) console.warn('[XHS] ⚠️ 解析失败:', e);
                        });
                    }
                    if (url.includes('/search/notes')) {
                        if (CONFIG.debug) console.log('[XHS] ✅ Fetch拦截笔记:', url);
                        const clone = response.clone();
                        clone.json().then(data => {
                            processNotesResponse(data);
                        }).catch(e => {
                            if (CONFIG.debug) console.warn('[XHS] ⚠️ 笔记解析失败:', e);
                        });
                    }
                }
            } catch (e) {
                if (CONFIG.debug) console.error('[XHS] ❌ Fetch拦截错误:', e);
            }

            return response;
        };
    })();

    // --- 处理下拉推荐响应 ---
    function processRecommendResponse(data) {
        if (!state.isRunning || state.mode !== 'keywords') {
            return;
        }

        if (!data || !data.data || !data.data.sug_items) {
            if (CONFIG.debug) console.warn('[XHS] ⚠️ 数据格式不符:', data);
            return;
        }

        const items = data.data.sug_items;
        let newCount = 0;

        items.forEach(item => {
            const text = item.text;
            if (text && !state.results.has(text)) {
                state.results.set(text, {
                    keyword: text,
                    type: item.type || item.search_type || '未知',
                    source: state.coreKeyword + CONFIG.suffixes[state.currentSuffixIndex]
                });
                newCount++;
            }
        });

        if (CONFIG.debug) {
            console.log(`[XHS] 🎉 新增 ${newCount} 个关键词, 总计 ${state.results.size} 个`);
        }

        updateUI();
        resolveWaiting(true);
    }

    // --- 处理笔记搜索响应 ---
    function processNotesResponse(data) {
        if (!state.isRunning || state.mode !== 'notes') {
            return;
        }

        if (!data || !data.data || !data.data.items) {
            if (CONFIG.debug) console.warn('[XHS] ⚠️ 笔记数据格式不符:', data);
            resolveWaiting(false);
            return;
        }

        const items = data.data.items;
        let newCount = 0;

        items.forEach(item => {
            if (item.note_card) {
                const note = item.note_card;
                const noteData = {
                    id: item.id,
                    keyword: state.coreKeyword,
                    title: note.display_title || '无标题',
                    author: note.user?.nickname || '未知',
                    userId: note.user?.user_id || '',
                    publishTime: note.corner_tag_info?.[0]?.text || '未知',
                    likedCount: note.interact_info?.liked_count || '0',
                    collectedCount: note.interact_info?.collected_count || '0',
                    commentCount: note.interact_info?.comment_count || '0',
                    sharedCount: note.interact_info?.shared_count || '0',
                    type: note.type || 'normal',
                    cover: note.cover?.url_default || '',
                    xsecToken: item.xsec_token || ''
                };

                const exists = state.notesData.some(n => n.id === noteData.id);
                if (!exists) {
                    state.notesData.push(noteData);
                    newCount++;
                }
            }
        });

        if (CONFIG.debug) {
            console.log(`[XHS] 🎉 新增 ${newCount} 条笔记, 总计 ${state.notesData.length} 条`);
        }

        updateUI();
        resolveWaiting(true);
    }

    // --- 采集关键词 ---
    async function startKeywordsCollection() {
        const input = document.querySelector('#search-input');
        if (!input) {
            alert('❌ 未找到搜索框,请刷新页面');
            return;
        }

        const keywordsText = document.getElementById('xhs-collector-input').value.trim();
        if (!keywordsText) {
            alert('请输入至少一个关键词');
            return;
        }

        state.keywords = keywordsText.split('\n')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        if (state.keywords.length === 0) {
            alert('请输入有效的关键词');
            return;
        }

        state.isRunning = true;
        state.mode = 'keywords';
        state.results.clear();
        state.currentKeywordIndex = 0;
        updateUI();
        toggleControls(true);

        console.log(`[XHS] 🚀 开始批量采集关键词: ${state.keywords.length} 个词根`);

        for (let kwIdx = 0; kwIdx < state.keywords.length; kwIdx++) {
            if (!state.isRunning) break;

            state.currentKeywordIndex = kwIdx;
            const keyword = state.keywords[kwIdx];
            state.coreKeyword = keyword;

            for (let i = 0; i < CONFIG.suffixes.length; i++) {
                if (!state.isRunning) break;

                state.currentSuffixIndex = i;
                const suffix = CONFIG.suffixes[i];
                const fullQuery = keyword + suffix;

                updateStatus(`🔍 [${kwIdx + 1}/${state.keywords.length}] "${keyword}" + "${suffix}" (${i + 1}/${CONFIG.suffixes.length})`);

                setInputValue(input, '');
                await sleep(100);
                setInputValue(input, fullQuery);

                input.focus();
                input.click();
                triggerAllEvents(input);

                await waitForResponse();
                await sleep(randomDelay());
            }

            if (kwIdx < state.keywords.length - 1) {
                await sleep(1000);
            }
        }

        state.isRunning = false;
        toggleControls(false);

        const total = state.results.size;
        updateStatus(`✅ 完成! 共采集 ${state.keywords.length} 个词根, ${total} 个关键词`);
        console.log(`[XHS] ✨ 批量采集完成! ${total} 个关键词`);
    }

    // --- 采集笔记 ---
    async function startNotesCollection() {
        const input = document.querySelector('#search-input');
        if (!input) {
            alert('❌ 未找到搜索框,请刷新页面');
            return;
        }

        const keywordsText = document.getElementById('xhs-collector-input').value.trim();
        if (!keywordsText) {
            alert('请输入至少一个关键词');
            return;
        }

        state.keywords = keywordsText.split('\n')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        if (state.keywords.length === 0) {
            alert('请输入有效的关键词');
            return;
        }

        state.isRunning = true;
        state.mode = 'notes';
        state.notesData = [];
        state.currentKeywordIndex = 0;
        updateUI();
        toggleControls(true);

        console.log(`[XHS] 🚀 开始批量采集笔记: ${state.keywords.length} 个关键词`);

        for (let kwIdx = 0; kwIdx < state.keywords.length; kwIdx++) {
            if (!state.isRunning) break;

            state.currentKeywordIndex = kwIdx;
            const keyword = state.keywords[kwIdx];
            state.coreKeyword = keyword;

            updateStatus(`🔍 [${kwIdx + 1}/${state.keywords.length}] "${keyword}" - 正在搜索...`);

            setInputValue(input, keyword);
            input.focus();
            input.click();
            triggerAllEvents(input);
            await sleep(500);

            pressEnter(input);

            await waitForResponse();
            await sleep(1000);

            updateStatus(`🔍 [${kwIdx + 1}/${state.keywords.length}] "${keyword}" - 正在切换到"最多评论"...`);
            await sortByComments();

            await waitForResponse();
            await sleep(randomDelay());

            const targetCount = CONFIG.notesPerKeyword;
            let capturedCount = state.notesData.filter(n => n.keyword === keyword).length;
            let noNewDataCount = 0;

            while (capturedCount < targetCount && state.isRunning) {
                updateStatus(`🔍 [${kwIdx + 1}/${state.keywords.length}] "${keyword}" - 已采集 ${capturedCount}/${targetCount} 条 - 滚动加载中...`);

                const prevLen = state.notesData.length;
                window.scrollTo(0, document.body.scrollHeight);

                const success = await waitForResponse();
                if (!success) {
                     noNewDataCount++;
                } else {
                     const newLen = state.notesData.length;
                     if (newLen === prevLen) {
                         noNewDataCount++;
                     } else {
                         noNewDataCount = 0;
                     }
                }

                if (noNewDataCount >= 3) {
                    console.log('[XHS] ⚠️ 似乎没有更多数据了');
                    break;
                }

                capturedCount = state.notesData.filter(n => n.keyword === keyword).length;
                await sleep(randomDelay());
            }

            if (kwIdx < state.keywords.length - 1) {
                await sleep(1500);
            }
        }

        state.isRunning = false;
        toggleControls(false);

        const total = state.notesData.length;
        updateStatus(`✅ 完成! 共采集 ${state.keywords.length} 个关键词, ${total} 条笔记`);
        console.log(`[XHS] ✨ 笔记采集完成! ${total} 条笔记`);
    }

    function waitForResponse() {
        return new Promise(resolve => {
            state.pendingResolve = resolve;
            state.pendingTimeout = setTimeout(() => {
                if (state.pendingResolve === resolve) {
                    state.pendingResolve = null;
                    state.pendingTimeout = null;
                    resolve(false);
                }
            }, CONFIG.timeout);
        });
    }

    function resolveWaiting(success) {
        if (state.pendingResolve) {
            clearTimeout(state.pendingTimeout);
            state.pendingResolve(success);
            state.pendingResolve = null;
            state.pendingTimeout = null;
        }
    }

    function stopCollection() {
        state.isRunning = false;
        resolveWaiting(false);
        updateStatus('⏸️ 已停止');
        toggleControls(false);
    }

    // --- 输入模拟 ---
    function setInputValue(element, value) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
        ).set;
        nativeInputValueSetter.call(element, value);
    }

    function triggerAllEvents(element) {
        const events = [
            new Event('input', { bubbles: true }),
            new Event('change', { bubbles: true }),
            new InputEvent('input', { bubbles: true, cancelable: true }),
            new KeyboardEvent('keydown', { key: 'a', bubbles: true }),
            new KeyboardEvent('keyup', { key: 'a', bubbles: true }),
            new Event('blur', { bubbles: true }),
            new Event('focus', { bubbles: true })
        ];
        events.forEach(event => element.dispatchEvent(event));
    }

    function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function randomDelay() {
        return Math.floor(Math.random() * (CONFIG.maxDelay - CONFIG.minDelay + 1)) + CONFIG.minDelay;
    }

    // --- 模拟操作辅助函数 ---
    function pressEnter(element) {
        const keyInfo = { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true, cancelable: true };
        element.dispatchEvent(new KeyboardEvent('keydown', keyInfo));
        element.dispatchEvent(new KeyboardEvent('keypress', keyInfo));
        element.dispatchEvent(new KeyboardEvent('keyup', keyInfo));
    }

    async function sortByComments() {
        const filterBtn = document.querySelector('.filter');
        if (!filterBtn) {
            if (CONFIG.debug) console.warn('[XHS] ⚠️ 未找到筛选按钮 (.filter)');
            return;
        }

        filterBtn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        await sleep(300);
        filterBtn.click();
        await sleep(500);

        const candidates = Array.from(document.querySelectorAll('li, div, span'));
        let target = null;

        for (const el of candidates) {
            if (el.textContent && el.textContent.includes('最多评论') && el.offsetParent !== null) {
                target = el;
                break;
            }
        }

        if (target) {
            if (CONFIG.debug) console.log('[XHS] ✅ 点击排序选项:', target.textContent);
            target.click();
        } else {
            if (CONFIG.debug) console.warn('[XHS] ⚠️ 未找到 "最多评论" 选项');
        }
    }

    // --- UI 界面 ---
    function createUI() {
        if (window.location.hostname !== 'www.xiaohongshu.com') {
            return;
        }

        const floatBtn = document.createElement('div');
        floatBtn.id = 'xhs-float-btn';
        floatBtn.innerHTML = '🔍';
        floatBtn.title = '打开小红书采集器';
        floatBtn.onclick = () => togglePanel(true);
        floatBtn.style.display = 'flex';
        document.body.appendChild(floatBtn);

        const container = document.createElement('div');
        container.id = 'xhs-collector-panel';
        container.classList.add('hidden');
        container.innerHTML = `
            <div style="margin-bottom: 12px; font-weight: 600; font-size: 17px; display: flex; justify-content: space-between; align-items: center; color: #1d1d1f;">
                <span>🔍 小红书采集器</span>
                <button id="xhs-btn-close" style="border: none; background: none; cursor: pointer; font-size: 22px; color: #86868b; line-height: 1; padding: 0; width: 24px; height: 24px;">×</button>
            </div>

            <div class="xhs-tabs">
                <button class="xhs-tab active" data-tab="keywords">
                    <span class="tab-icon">🔤</span>
                    <span>关键词</span>
                </button>
                <button class="xhs-tab" data-tab="notes">
                    <span class="tab-icon">📝</span>
                    <span>笔记</span>
                </button>
            </div>

            <div style="margin-bottom: 12px;">
                <label style="display: block; margin-bottom: 6px; font-size: 13px; color: #86868b; font-weight: 500;">
                    输入关键词 (每行一个)
                </label>
                <textarea id="xhs-collector-input" placeholder="示例:&#10;OOTD&#10;穿搭&#10;美妆"
                   style="width: 100%; height: 90px; padding: 10px; border: 1px solid #d2d2d7; border-radius: 10px; font-size: 14px; box-sizing: border-box; resize: vertical; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif; transition: border-color 0.2s;"></textarea>
            </div>

            <div class="xhs-btn-group">
                <button id="xhs-btn-start-keywords" class="xhs-btn primary">
                    <span class="btn-icon">▶️</span>
                    <span>采集关键词</span>
                </button>
                <button id="xhs-btn-start-notes" class="xhs-btn primary" style="display:none;">
                    <span class="btn-icon">▶️</span>
                    <span>采集笔记</span>
                </button>
                <button id="xhs-btn-stop" class="xhs-btn danger" style="display:none;">
                    <span class="btn-icon">⏹️</span>
                    <span>停止</span>
                </button>
            </div>

            <div class="xhs-btn-group" style="margin-top: 6px;">
                <button id="xhs-btn-copy" class="xhs-btn secondary">
                    <span class="btn-icon">📋</span>
                    <span>复制</span>
                </button>
                <button id="xhs-btn-csv" class="xhs-btn secondary">
                    <span class="btn-icon">💾</span>
                    <span>导出</span>
                </button>
                <button id="xhs-btn-clear" class="xhs-btn secondary">
                    <span class="btn-icon">🗑️</span>
                    <span>清空</span>
                </button>
            </div>

            <div id="xhs-status" style="margin: 12px 0; font-size: 12px; color: #86868b; padding: 8px 10px; background: #f5f5f7; border-radius: 8px; border-left: 3px solid #0071e3;">
                💡 就绪 - 支持批量采集关键词和笔记数据
            </div>

            <div style="font-size: 12px; color: #86868b; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
                <span>结果数: <b id="xhs-count" style="color: #0071e3; font-weight: 600;">0</b></span>
                <span id="xhs-loading" style="display:none;">⏳ 采集中...</span>
            </div>
            <textarea id="xhs-result-area" readonly placeholder="采集结果将显示在这里...&#10;&#10;📌 使用提示:&#10;• 关键词模式: 采集搜索下拉推荐词&#10;• 笔记模式: 采集笔记详细数据&#10;• 支持每行输入一个词根进行批量采集"></textarea>

            <div style="margin-top: 10px; font-size: 11px; color: #86868b; text-align: center;">
                <details>
                    <summary style="cursor: pointer; padding: 6px; border-radius: 6px; transition: background 0.2s;">⚙️ 高级设置</summary>
                    <div style="margin-top: 10px; text-align: left; padding: 10px; background: #f5f5f7; border-radius: 8px;">
                        <label style="display: block; margin-bottom: 6px; cursor: pointer;">
                            <input type="checkbox" id="xhs-debug-mode" ${CONFIG.debug ? 'checked' : ''}> 调试模式(控制台日志)
                        </label>
                        <label style="display: block; margin-bottom: 6px;">
                            每个关键词采集笔记数:
                            <input type="number" id="xhs-notes-count" value="${CONFIG.notesPerKeyword}" min="20" max="200" step="20"
                                   style="width: 60px; margin-left: 6px; padding: 2px 6px; border: 1px solid #d2d2d7; border-radius: 4px;">
                        </label>
                        <div style="margin-top: 6px; font-size: 10px; color: #86868b;">
                            延迟: ${CONFIG.minDelay}-${CONFIG.maxDelay}ms | 超时: ${CONFIG.timeout}ms<br>
                            后缀: 空格 + a-z + 0-9 (共 ${CONFIG.suffixes.length} 个)
                        </div>
                    </div>
                </details>
            </div>
        `;

        document.body.appendChild(container);

        GM_addStyle(`
            #xhs-float-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%);
                border-radius: 50%;
                box-shadow: 0 8px 24px rgba(0,113,227,0.3);
                display: none;
                align-items: center;
                justify-content: center;
                font-size: 28px;
                cursor: pointer;
                z-index: 99998;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                user-select: none;
            }
            #xhs-float-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 32px rgba(0,113,227,0.4);
            }
            #xhs-float-btn:active {
                transform: scale(0.95);
            }
            #xhs-collector-panel {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 380px;
                max-height: 90vh;
                overflow-y: auto;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.1);
                padding: 18px;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
                display: block;
            }
            #xhs-collector-panel.hidden {
                display: none;
            }
            #xhs-collector-input:focus,
            #xhs-result-area:focus {
                outline: none;
                border-color: #0071e3;
                box-shadow: 0 0 0 3px rgba(0,113,227,0.1);
            }
            .xhs-tabs {
                display: flex;
                gap: 6px;
                margin-bottom: 12px;
                padding: 4px;
                background: #f5f5f7;
                border-radius: 10px;
            }
            .xhs-tab {
                flex: 1;
                padding: 8px 12px;
                border: none;
                background: transparent;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                color: #1d1d1f;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .xhs-tab:hover {
                background: rgba(0,0,0,0.05);
            }
            .xhs-tab.active {
                background: white;
                color: #0071e3;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            .tab-icon {
                font-size: 16px;
            }
            #xhs-result-area {
                width: 100%;
                height: 220px;
                border: 1px solid #d2d2d7;
                border-radius: 10px;
                resize: vertical;
                font-size: 12px;
                padding: 10px;
                line-height: 1.6;
                font-family: "SF Mono", Menlo, Monaco, Consolas, monospace;
                box-sizing: border-box;
                transition: border-color 0.2s;
            }
            .xhs-btn-group {
                display: flex;
                gap: 6px;
            }
            .xhs-btn {
                padding: 10px 14px;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                flex: 1;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .xhs-btn.primary {
                background: #0071e3;
                color: white;
                box-shadow: 0 2px 8px rgba(0,113,227,0.3);
            }
            .xhs-btn.primary:hover {
                background: #0077ed;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0,113,227,0.4);
            }
            .xhs-btn.danger {
                background: #6e6e73;
                color: white;
            }
            .xhs-btn.danger:hover {
                background: #86868b;
            }
            .xhs-btn.secondary {
                background: #f5f5f7;
                color: #1d1d1f;
            }
            .xhs-btn.secondary:hover {
                background: #e8e8ed;
            }
            .xhs-btn:active {
                transform: scale(0.98);
            }
            .btn-icon {
                font-size: 14px;
            }
            #xhs-loading {
                animation: pulse 1.5s ease-in-out infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            details summary {
                user-select: none;
            }
            details summary:hover {
                background: #f5f5f7;
            }
            input[type="checkbox"] {
                cursor: pointer;
            }
            input[type="number"] {
                font-family: inherit;
            }
        `);

        document.querySelectorAll('.xhs-tab').forEach(tab => {
            tab.onclick = () => switchTab(tab.dataset.tab);
        });

        document.getElementById('xhs-btn-start-keywords').onclick = startKeywordsCollection;
        document.getElementById('xhs-btn-start-notes').onclick = startNotesCollection;
        document.getElementById('xhs-btn-stop').onclick = stopCollection;
        document.getElementById('xhs-btn-copy').onclick = copyResults;
        document.getElementById('xhs-btn-csv').onclick = exportCSV;
        document.getElementById('xhs-btn-clear').onclick = clearResults;
        document.getElementById('xhs-btn-close').onclick = () => togglePanel(false);
        document.getElementById('xhs-debug-mode').onchange = (e) => {
            CONFIG.debug = e.target.checked;
            console.log('[XHS] 调试模式:', CONFIG.debug ? '开启' : '关闭');
        };
        document.getElementById('xhs-notes-count').onchange = (e) => {
            const val = parseInt(e.target.value);
            if (val >= 20 && val <= 200) {
                CONFIG.notesPerKeyword = val;
                console.log('[XHS] 每关键词笔记数:', val);
            }
        };

        console.log('[XHS] ✅ 采集器已加载 - 支持批量采集关键词和笔记');
    }

    function switchTab(tabName) {
        document.querySelectorAll('.xhs-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        const isKeywords = tabName === 'keywords';
        document.getElementById('xhs-btn-start-keywords').style.display = isKeywords ? 'flex' : 'none';
        document.getElementById('xhs-btn-start-notes').style.display = isKeywords ? 'none' : 'flex';

        const statusEl = document.getElementById('xhs-status');
        if (isKeywords) {
            statusEl.innerHTML = '💡 就绪 - 采集搜索下拉推荐关键词';
        } else {
            statusEl.innerHTML = '💡 就绪 - 采集笔记数据(点赞/评论/收藏等)';
        }

        if (!state.isRunning) {
            updateUI();
        }
    }

    function togglePanel(show) {
        const panel = document.getElementById('xhs-collector-panel');
        const floatBtn = document.getElementById('xhs-float-btn');

        if (show) {
            panel.classList.remove('hidden');
            floatBtn.style.display = 'none';
            state.uiVisible = true;
        } else {
            panel.classList.add('hidden');
            floatBtn.style.display = 'flex';
            state.uiVisible = false;
        }
    }

    function toggleControls(active) {
        const currentTab = document.querySelector('.xhs-tab.active')?.dataset.tab || 'keywords';
        const startBtn = currentTab === 'keywords' ?
            document.getElementById('xhs-btn-start-keywords') :
            document.getElementById('xhs-btn-start-notes');

        startBtn.style.display = active ? 'none' : 'flex';
        document.getElementById('xhs-btn-stop').style.display = active ? 'flex' : 'none';
        document.getElementById('xhs-loading').style.display = active ? 'inline' : 'none';
        document.getElementById('xhs-collector-input').disabled = active;
    }

    function updateStatus(msg) {
        document.getElementById('xhs-status').innerHTML = msg;
    }

    function updateUI() {
        const currentTab = document.querySelector('.xhs-tab.active')?.dataset.tab || 'keywords';

        if (currentTab === 'keywords') {
            const list = Array.from(state.results.values());
            document.getElementById('xhs-count').textContent = list.length;
            document.getElementById('xhs-result-area').value = list.map(item => item.keyword).join('\n');
        } else {
            document.getElementById('xhs-count').textContent = state.notesData.length;
            const preview = state.notesData.map(note =>
                `${note.title} | 👍${note.likedCount} 💬${note.commentCount} ⭐${note.collectedCount}`
            ).join('\n');
            document.getElementById('xhs-result-area').value = preview;
        }
    }

    function copyResults() {
        const text = document.getElementById('xhs-result-area').value;
        if (!text) {
            alert('📭 没有可复制的内容');
            return;
        }
        GM_setClipboard(text);
        updateStatus('✅ 已复制到剪贴板!');
        setTimeout(() => {
            const currentTab = document.querySelector('.xhs-tab.active')?.dataset.tab || 'keywords';
            switchTab(currentTab);
        }, 2000);
    }

    function exportCSV() {
        const currentTab = document.querySelector('.xhs-tab.active')?.dataset.tab || 'keywords';

        if (currentTab === 'keywords') {
            if (state.results.size === 0) {
                alert('📭 没有可导出的数据');
                return;
            }

            const bom = '\uFEFF';
            let csv = bom + '关键词,类型,来源词\n';
            state.results.forEach(item => {
                csv += `"${item.keyword}","${item.type}","${item.source}"\n`;
            });

            downloadFile(csv, `小红书关键词_${timestamp()}.csv`);
        } else {
            if (state.notesData.length === 0) {
                alert('📭 没有可导出的数据');
                return;
            }

            const bom = '\uFEFF';
            let csv = bom + 'ID,关键词,标题,作者,用户ID,发布时间,点赞数,收藏数,评论数,分享数,类型,笔记链接\n';
            state.notesData.forEach(note => {
                const noteLink = `https://www.xiaohongshu.com/explore/${note.id}?xsec_token=${note.xsecToken}&xsec_source=pc_search`;
                csv += `"${note.id}","${note.keyword}","${note.title}","${note.author}","${note.userId}","${note.publishTime}","${note.likedCount}","${note.collectedCount}","${note.commentCount}","${note.sharedCount}","${note.type}","${noteLink}"\n`;
            });

            downloadFile(csv, `小红书笔记_${timestamp()}.csv`);
        }

        updateStatus('✅ CSV文件已下载!');
        setTimeout(() => {
            const currentTab = document.querySelector('.xhs-tab.active')?.dataset.tab || 'keywords';
            switchTab(currentTab);
        }, 2000);
    }

    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function timestamp() {
        return new Date().toISOString().slice(0,19).replace(/[:-]/g, '').replace('T', '_');
    }

    function clearResults() {
        const currentTab = document.querySelector('.xhs-tab.active')?.dataset.tab || 'keywords';
        const hasData = currentTab === 'keywords' ? state.results.size > 0 : state.notesData.length > 0;

        if (!hasData) return;

        if (confirm('确定要清空所有结果吗?')) {
            if (currentTab === 'keywords') {
                state.results.clear();
            } else {
                state.notesData = [];
            }
            updateUI();
            updateStatus('🗑️ 已清空');
            setTimeout(() => switchTab(currentTab), 2000);
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();
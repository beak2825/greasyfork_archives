// ==UserScript==
// @name         NodeSeek 用户画像生成器
// @name:zh-CN   NodeSeek 用户画像生成器
// @name:en      NodeSeek User Profiler
// @namespace    https://github.com/tunecc/NodeSeek-User-Profiler
// @version      3.4
// @description  自动爬取NodeSeek用户的评论导出Markdown/CSV、生成符合 NodeSeek 生态的 AI 分析指令。
// @description:en  Automatically crawl NodeSeek users' comments, export them as Markdown/CSV, and generate AI analysis commands that comply with the NodeSeek ecosystem.
// @author       Tune
// @author       Tune
// @homepage     https://github.com/tunecc/NodeSeek-User-Profiler
// @source       https://github.com/tunecc/NodeSeek-User-Profiler
// @license      MIT
// @match        https://www.nodeseek.com/space/*
// @match        https://nodeseek.com/space/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559093/NodeSeek%20%E7%94%A8%E6%88%B7%E7%94%BB%E5%83%8F%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/559093/NodeSeek%20%E7%94%A8%E6%88%B7%E7%94%BB%E5%83%8F%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const CONFIG = {
        API_CONCURRENCY: 3,   // 🚀 API阶段并发数 (保持高速)
        DEEP_CONCURRENCY: 1,  // 🛡️ 深挖阶段并发数 (强制单线程，最安全)
        API_DELAY: 100,       // API 请求间隔 (ms)
        DEEP_DELAY: 100,      // 深挖 请求间隔 (ms)
        COOLING_DELAY: 5200,  // 🧊 触发限速后的冷却时间
        PER_PAGE_FLOOR: 10    // 硬编码：每页10楼
    };

    // 状态管理
    let state = {
        isRunning: false,
        phase: 1,             // 1=API, 2=深挖
        processedPages: 0,
        maxPage: 10,
        totalItems: 0,
        deepMode: false,
        deepProgress: 0,
        currentPostId: 0,
        currentPage: 0
    };
    let allReplies = [];
    let replyMap = new Map();

    // --- 1. 样式注入 ---
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --ns-bg: rgba(255, 255, 255, 0.92);
                --ns-border: rgba(0, 0, 0, 0.08);
                --ns-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                --ns-primary: linear-gradient(135deg, #007AFF, #00C6FF);
                --ns-success: linear-gradient(135deg, #34C759, #30D158);
                --ns-orange: linear-gradient(135deg, #FF9500, #FFB340);
                --ns-purple: linear-gradient(135deg, #AF52DE, #BF5AF2);
                --ns-danger: linear-gradient(135deg, #FF3B30, #FF453A);
            }
            .ns-panel {
                position: fixed; top: 100px; right: 20px; width: 300px;
                background: var(--ns-bg); backdrop-filter: saturate(180%) blur(25px);
                border: 1px solid var(--ns-border); border-radius: 20px;
                box-shadow: var(--ns-shadow); font-family: -apple-system, sans-serif;
                padding: 24px; z-index: 99999; animation: ns-pop 0.4s cubic-bezier(0.19, 1, 0.22, 1);
            }
            @keyframes ns-pop { from { opacity:0; transform:scale(0.9) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            
            .ns-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .ns-title { font-size: 18px; font-weight: 700; color: #1d1d1f; letter-spacing: -0.5px; }
            .ns-close { cursor: pointer; opacity: 0.4; transition: 0.2s; font-size: 18px; }
            .ns-close:hover { opacity: 1; transform: rotate(90deg); }
            
            .ns-input-wrap { display: flex; align-items: center; justify-content: space-between; background: #fff; border-radius: 12px; padding: 10px 14px; margin-bottom: 10px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
            .ns-input { border: none; outline: none; font-size: 16px; font-weight: 600; width: 60px; text-align: center; color: #007AFF; }
            .ns-label-row { display: flex; align-items: center; gap: 6px; font-size: 14px; color: #333; font-weight: 500; }

            .ns-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
            .ns-stat { background: #fff; padding: 12px; border-radius: 14px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04); }
            .ns-stat-label { font-size: 11px; color: #86868b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-weight: 600; }
            .ns-stat-val { font-size: 15px; font-weight: 800; letter-spacing: -0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            
            .ns-progress-track { height: 6px; background: rgba(0,0,0,0.06); border-radius: 3px; overflow: hidden; margin: 20px 0 10px 0; }
            .ns-progress-fill { height: 100%; background: var(--ns-primary); width: 0%; transition: width 0.3s; }
            
            .ns-btn { width: 100%; border: none; padding: 14px; border-radius: 14px; color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: transform 0.1s, opacity 0.2s; box-shadow: 0 8px 20px rgba(0,0,0,0.12); margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .ns-btn:active { transform: scale(0.96); }
            .ns-btn:hover { opacity: 0.95; }
            .ns-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(100%); }
            .ns-btn-start { background: var(--ns-success); }
            .ns-btn-stop { background: var(--ns-danger); }
            .ns-btn-md { background: var(--ns-orange); box-shadow: 0 4px 15px rgba(255, 149, 0, 0.25); }
            .ns-btn-copy { background: var(--ns-primary); box-shadow: 0 4px 15px rgba(0, 122, 255, 0.25); }
            .ns-btn-csv { background: var(--ns-purple); box-shadow: 0 4px 15px rgba(175, 82, 222, 0.25); }
            .ns-btn-clear { background: var(--ns-danger); margin-top: 5px; box-shadow: 0 4px 15px rgba(255, 59, 48, 0.25); }
            .ns-actions { display: flex; flex-direction: column; gap: 2px; }
            
            .ns-toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 30px; border-radius: 16px; box-shadow: 0 10px 40px rgba(102, 126, 234, 0.5); z-index: 20000; font-size: 15px; font-weight: bold; text-align: center; line-height: 1.5; white-space: pre-line; animation: nsFadeIn 0.3s ease-out; max-width: 80%; }
            @keyframes nsFadeIn { from { opacity:0; transform: translate(-50%, -40%); } to { opacity:1; transform: translate(-50%, -50%); } }

            .ns-switch { position: relative; display: inline-block; width: 44px; height: 26px; }
            .ns-switch input { opacity: 0; width: 0; height: 0; }
            .ns-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e5e5ea; transition: .4s; border-radius: 34px; }
            .ns-slider:before { position: absolute; content: ""; height: 22px; width: 22px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
            input:checked + .ns-slider { background-color: #34C759; }
            input:checked + .ns-slider:before { transform: translateX(18px); }
            
            .ns-help-icon { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; background: #86868b; color: white; font-size: 12px; font-weight: bold; margin-left: 6px; cursor: pointer; opacity: 0.6; transition: 0.2s; }
            .ns-help-icon:hover { opacity: 1; transform: scale(1.1); background: #007AFF; }
        `;
        document.head.appendChild(style);
    }

    // --- 2. 入口按钮 ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            injectStyles();
            initBtn();
        }, 1000);
    });

    function initBtn() {
        if (document.getElementById('ns-entry-btn')) return;
        const btn = document.createElement('div');
        btn.id = 'ns-entry-btn';
        btn.innerHTML = '📊';
        btn.style.cssText = `
            position: fixed; bottom: 80px; right: 20px; width: 52px; height: 52px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border-radius: 50%; text-align: center; line-height: 52px;
            cursor: pointer; z-index: 99998; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            font-size: 24px; transition: transform 0.2s; user-select: none;
        `;
        btn.onmouseover = () => btn.style.transform = 'scale(1.1) rotate(5deg)';
        btn.onmouseout = () => btn.style.transform = 'scale(1) rotate(0deg)';
        btn.onclick = () => {
            if (!window.location.hash.includes('/comments')) {
                const baseUrl = window.location.href.split('#')[0];
                if(confirm('请先进入【回复列表】页面。\n点击确定跳转...')) {
                    window.location.href = baseUrl + '#/comments/1';
                    setTimeout(() => location.reload(), 100);
                }
                return;
            }
            createControlPanel();
        };
        document.body.appendChild(btn);
    }

    // --- 3. 控制面板 ---
    function createControlPanel() {
        if (document.getElementById('ns-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'ns-panel';
        panel.className = 'ns-panel';
        panel.innerHTML = `
            <div class="ns-header">
                <div class="ns-title">成分分析器</div>
                <div class="ns-close" id="ns-close">✕</div>
            </div>

            <div id="ns-config">
                <div class="ns-input-wrap">
                    <div class="ns-label-row">
                        📅 采集页数
                    </div>
                    <input type="number" id="ns-pages" class="ns-input" value="10" min="1">
                </div>
                
                <div class="ns-input-wrap">
                    <div class="ns-label-row">
                        🕵️ 深挖模式
                        <div class="ns-help-icon" id="ns-help-tip">?</div>
                    </div>
                    <label class="ns-switch">
                        <input type="checkbox" id="ns-deep-mode">
                        <span class="ns-slider"></span>
                    </label>
                </div>
            </div>

            <div class="ns-grid">
                <div class="ns-stat">
                    <div class="ns-stat-label">当前进度</div>
                    <div class="ns-stat-val" style="color:#007AFF;" id="ns-page-txt">待机</div>
                </div>
                <div class="ns-stat">
                    <div class="ns-stat-label">已采集</div>
                    <div class="ns-stat-val" style="color:#34C759" id="ns-count">${allReplies.length}</div>
                </div>
            </div>

            <div class="ns-progress-track">
                <div class="ns-progress-fill" id="ns-bar"></div>
            </div>
            
            <div style="text-align:center; font-size:12px; color:#86868b; margin-bottom:15px;" id="ns-status-txt">
                准备就绪
            </div>

            <div id="btn-start-area">
                <button class="ns-btn ns-btn-start" id="ns-start">▶ 开始采集</button>
            </div>
            <div id="btn-stop-area" style="display:none">
                <button class="ns-btn ns-btn-stop" id="ns-stop">⏹ 停止采集</button>
            </div>

            <div class="ns-actions">
                <button class="ns-btn ns-btn-md" id="ns-md">📥 导出 MD</button>
                <button class="ns-btn ns-btn-copy" id="ns-copy">📄 复制 Markdown</button>
                <button class="ns-btn ns-btn-csv" id="ns-csv">📊 导出 CSV</button>
            </div>
            
            <button class="ns-btn ns-btn-clear" id="ns-clear">🗑️ 清空数据</button>
        `;
        document.body.appendChild(panel);

        document.getElementById('ns-close').onclick = () => panel.remove();
        document.getElementById('ns-start').onclick = startExtraction;
        document.getElementById('ns-stop').onclick = stopExtraction;
        document.getElementById('ns-md').onclick = exportToMarkdown;
        document.getElementById('ns-csv').onclick = exportToCSV;
        document.getElementById('ns-copy').onclick = copyToClipboard;
        document.getElementById('ns-clear').onclick = clearData;
        
        document.getElementById('ns-help-tip').onclick = () => {
            showToast(`💡 深挖模式说明\n\n1. 自动获取被截断的长回复完整内容\n2. 默认急速模式 (150ms/次)，触发限速后自动冷却 (5.2s)\n3. 如果间隔设置的低，能在F12控制台看到too many requests \n`, 6000);
        };

        const realMax = detectTotalPages();
        if (realMax > 1) {
            document.getElementById('ns-pages').value = realMax;
            updateStatus(`已自动检测到 ${realMax} 页数据`);
        }
    }

    // --- 4. 核心提取逻辑 ---

    function detectTotalPages() {
        const pagination = document.querySelector('div[role="navigation"][aria-label="pagination"]');
        if (!pagination) return 1;
        let max = 1;
        const links = pagination.querySelectorAll('.pager-pos');
        links.forEach(el => {
            const txt = el.innerText.trim().replace(/\.\./g, '');
            const num = parseInt(txt);
            if (!isNaN(num) && num > max) max = num;
        });
        return max;
    }

    async function startExtraction() {
        const uidMatch = window.location.href.match(/\/space\/(\d+)/);
        if (!uidMatch) return showToast("❌ 请在用户空间页面使用");
        const uid = uidMatch[1];
        
        const inputPages = parseInt(document.getElementById('ns-pages').value) || 10;
        const isDeep = document.getElementById('ns-deep-mode').checked; 
        
        state.isRunning = true;
        state.phase = 1; // 🟢 1: API阶段
        state.processedPages = 0;
        state.maxPage = inputPages;
        state.deepMode = isDeep;
        state.deepProgress = 0;
        state.deepTotal = 0; 
        state.currentPostId = 0;
        state.currentPage = 0;
        allReplies = [];
        replyMap.clear();
        
        toggleUI(true);
        updateStatus("🚀 正在建立 API 连接...");

        const tasks = [];
        for (let i = 1; i <= inputPages; i++) tasks.push(i);

        const apiWorker = async () => {
            while (tasks.length > 0 && state.isRunning) {
                const page = tasks.shift();
                try {
                    updateStatus(`⚡ 正在API请求第 ${page} 页...`);
                    const res = await fetch(`/api/content/list-comments?uid=${uid}&page=${page}`);
                    const json = await res.json();
                    
                    if (json && json.comments && json.comments.length > 0) {
                        const newItems = json.comments.map(item => {
                            let text = item.text || "无内容";
                            
                            // 🟢 严格智能判断：仅匹配 " ..." (空格+三个点)
                            const isTruncated = text.endsWith(" ...");
                            
                            // 如果开启深挖模式，且内容被截断，则 isFull=false (需要挖)
                            // 否则 isFull=true (不需要挖，直接用)
                            const needDig = state.deepMode && isTruncated;

                            return {
                                page: page,
                                post_id: item.post_id,
                                floor_id: item.floor_id,
                                title: item.title || "无标题",
                                content: text, 
                                isFull: !needDig, // 取反：不需要挖 = 它是完整的
                                url: `https://www.nodeseek.com/post-${item.post_id}-1#${item.floor_id}`
                            };
                        });
                        
                        newItems.forEach(item => {
                            allReplies.push(item);
                            replyMap.set(`${item.post_id}-${item.floor_id}`, item);
                        });
                        
                        state.totalItems = allReplies.length;
                    } else {
                        if (json.comments && json.comments.length === 0) tasks.length = 0; 
                    }

                    state.processedPages++;
                    updateUI();
                    
                    await sleep(CONFIG.API_DELAY);

                } catch (e) {
                    console.error(`Page ${page} Error:`, e);
                    await sleep(1000);
                }
            }
        };

        const threads = [];
        for (let i = 0; i < CONFIG.API_CONCURRENCY; i++) threads.push(apiWorker());
        await Promise.all(threads);

        if (state.isRunning && allReplies.length > 0 && state.deepMode) {
            await startDeepScanning();
        } else {
            finish();
        }
    }

    async function startDeepScanning() {
        state.phase = 2; // 🟢 2: 深挖阶段
        
        // 🟢 过滤出真正需要深挖的任务
        const deepTasks = allReplies.filter(item => !item.isFull);
        state.deepTotal = deepTasks.length; 
        state.deepProgress = 0;
        
        if (state.deepTotal === 0) {
            updateStatus("✨ 没有需要深挖的内容，跳过...");
            await sleep(500);
            finish();
            return;
        }

        updateUI(); 
        updateStatus(`🔍 智能深挖：${state.deepTotal} 条截断内容...`);
        
        const deepWorker = async () => {
            while (deepTasks.length > 0 && state.isRunning) {
                const item = deepTasks.shift();
                
                try {
                    let targetPage = Math.ceil(item.floor_id / CONFIG.PER_PAGE_FLOOR);
                    if (targetPage < 1) targetPage = 1;
                    
                    state.currentPostId = item.post_id;
                    state.currentPage = targetPage;
                    updateUI(); 
                    
                    updateStatus(`📥 正在深挖: 帖子${item.post_id} (剩${deepTasks.length})`);
                    
                    const res = await fetch(`/post-${item.post_id}-${targetPage}`);
                    
                    // 🚨 防封关键逻辑：检测 403/429
                    if (res.status === 429 || res.status === 403) {
                        updateStatus(`🚨 触发限速 (${res.status})，冷却 ${CONFIG.COOLING_DELAY}ms...`);
                        await sleep(CONFIG.COOLING_DELAY);
                        deepTasks.unshift(item); // 失败重试
                        continue;
                    }

                    if (res.status === 200) {
                        const text = await res.text();
                        const doc = new DOMParser().parseFromString(text, 'text/html');
                        
                        const floorLinks = doc.querySelectorAll('.floor-link');
                        
                        floorLinks.forEach(link => {
                            const currentFloorId = parseInt(link.innerText.replace('#', ''));
                            const mapKey = `${item.post_id}-${currentFloorId}`;
                            const targetItem = replyMap.get(mapKey);
                            
                            // 只有那些被标记为不完整的目标才需要更新
                            if (targetItem && !targetItem.isFull) {
                                const container = link.closest('.content-item') || link.closest('.post-item') || link.closest('li');
                                if (container) {
                                    const contentEl = container.querySelector('.post-content');
                                    if (contentEl) {
                                        const cleanEl = contentEl.cloneNode(true);
                                        const quotes = cleanEl.querySelectorAll('blockquote');
                                        quotes.forEach(q => {
                                            const qt = q.innerText.replace(/\n/g, ' ').trim();
                                            const mark = document.createTextNode(` (引用上下文: ${qt}) `);
                                            q.parentNode.replaceChild(mark, q);
                                        });
                                        
                                        targetItem.content = cleanEl.innerText.trim();
                                        targetItem.isFull = true;
                                    }
                                }
                            }
                        });
                        
                        state.deepProgress++;
                        updateUI();
                    }
                    
                    await sleep(CONFIG.DEEP_DELAY);
                    
                } catch (e) {
                    console.error(`Fetch failed: ${item.post_id}`, e);
                    await sleep(1000);
                }
            }
        };
        
        const dThreads = [];
        for (let i = 0; i < CONFIG.DEEP_CONCURRENCY; i++) dThreads.push(deepWorker());
        await Promise.all(dThreads);
        
        finish();
    }

    function stopExtraction() {
        state.isRunning = false;
        updateStatus("⏹ 已停止");
        toggleUI(false);
    }

    function finish() {
        state.isRunning = false;
        toggleUI(false);
        updateStatus("✨ 采集完成");
        showToast(`✅ 采集完成\n共 ${allReplies.length} 条数据`);
    }

    // --- 5. 导出逻辑 ---

    function generatePrompt() {
        const uid = window.location.href.match(/\/space\/(\d+)/)?.[1] || 'User';
        const date = new Date().toLocaleString();
        const modeText = state.deepMode ? "完整内容版" : "API摘要版";

        let md = `> ⚠️ **本内容为AI生成** \n\n`;
        md += `# NodeSeek 用户画像分析任务 (${modeText})\n\n`;
        md += `## 📋 任务说明\n你是一位专业的用户行为分析师，精通 **NodeSeek (一个以VPS、服务器、网络技术和羊毛信息为主的垂直社区)** 的文化与黑话。请根据下方提供的用户回复数据，深入分析该用户的完整人物画像。\n\n`;
        
        // 🟢 核心修改：根据模式动态切换“注意事项”
        if (state.deepMode) {
            // 深挖模式的提示
            md += `> **注意**：\n`;
            md += `> 1. 内容中被标记为 \`(引用上下文: ...)\` 的部分是被回复对象的原话，仅供参考语境，**不代表用户本人的观点**。\n`;
            md += `> 2. 所有回复均已通过爬虫抓取完整内容，无截断。\n\n`;
        } else {
            // API模式的提示
            md += `> **注意**：\n`;
            md += `> 部分长回复可能因为 NodeSeek API 列表限制而显示为**截断状态**（通常以 ... 结尾）。请严格基于现有的内容片段进行分析，**无需臆测缺失部分**。\n\n`;
        }

        md += `## 👤 分析对象\n- **用户ID**: ${uid}\n- **来源**: NodeSeek\n- **回复总数**: ${allReplies.length}\n- **数据提取时间**: ${date}\n\n`;
        md += `## 💬 完整回复记录\n\n`;

        const groupedMap = new Map();
        allReplies.forEach(item => {
            if (!groupedMap.has(item.title)) {
                groupedMap.set(item.title, { page: item.page, replies: [] });
            }
            if (!groupedMap.get(item.title).replies.includes(item.content)) {
                groupedMap.get(item.title).replies.push(item.content);
            }
        });

        let index = 1;
        for (const [title, data] of groupedMap) {
            md += `### 主题 #${index}\n**所在页码**: ${data.page}\n**帖子标题**: ${title}\n**回复内容**:\n`;
            data.replies.forEach(content => md += `> ${content.replace(/\n/g, '\n> ')}\n\n`);
            md += `---\n`;
            index++;
        }

        md += `
---

## 🎯 分析任务要求

请基于以上所有回复数据，从以下维度深入分析该用户，并生成一份详细的**量化用户画像报告**。

**重要**: 每个维度必须按照给定的评分标准打分，不能凭主观感觉！必须深度结合 NodeSeek 社区特色（MJJ文化、VPS折腾、羊毛党等）。

---

## 📊 评分标准与分析维度

### 1. 技术能力评估 💻 (1-10分)
**评分标准**:
- **1-3分 (小白/伸手党)**: 不懂Linux，常问基础问题(如"怎么SSH" "怎么搭梯子")，找一键脚本，对网络线路(CN2/9929)无概念，只会用面板(宝塔/1Panel)。
- **4-6分 (进阶玩家/MJJ)**: 会玩Docker，懂科学上网原理，能自行搭建简单服务(图床/探针)，了解线路差异，会基本的Linux命令。
- **7-8分 (运维/折腾党)**: 熟悉Linux底层，懂网络架构(BGP/ASN)，能手写脚本，玩软路由/虚拟化(PVE/ESXi)，会优化线路，折腾内网穿透/IPv6。
- **9-10分 (硬核大佬/开发者)**: 开发过知名开源项目，IDC从业者，能进行逆向工程，对核心网/路由表有深刻理解，发布原创技术教程。

**量化指标**:
- 技术关键词: (Docker, Python, Go, BGP, ASN, K8s, 软路由, 编译, 逆向, Shell)
- 是否发布过原创教程/脚本: 是/否

### 2. 消费能力评估 💰 (1-10分)
**评分标准**:
- **1-3分 (白嫖/挂逼/丐帮)**: 只关注免费鸡(Free Tier)、0元购、Bug价，极其价格敏感，为了几块钱纠结，常参与抽奖。
- **4-6分 (性价比党)**: 关注高性价比年付机(如10-30刀/年)，偶尔收二手传家宝，预算适中，追求极致性价比。
- **7-8分 (氪金玩家/抚摸党)**: 常买一线大厂(DMIT, 搬瓦工GIA, 斯巴达, 瓦工)，不屑于灵车，拥有多台高配独服，设备"吃灰"也买，追求线路质量。
- **9-10分 (富哥/老板)**: 拥有自己的ASN，托管大量设备，甚至自己开IDC，交易金额巨大，对价格不敏感。

**分析要点**:
- 关注的价格区间 (1元鸡 vs 杜甫)
- 交易行为 (收/出/溢价收)
- 对"灵车"(跑路风险高的商家)的态度

### 3. 专业深度评估 🎓 (1-10分)
**评分标准**:
- **1-3分**: 泛泛而谈，缺乏专业见解，只有情绪化表达。
- **4-6分**: 能列出简单的参数，知道基本的测试工具(YABS/融合怪)，但不够深入。
- **7-8分**: 能深入分析线路质量(丢包率/抖动/路由跳数)，了解硬件性能瓶颈，能给出专业的选购建议。
- **9-10分**: 行业专家，对IDC市场格局、网络协议、硬件架构有深刻见解，能预判商家跑路风险。

**分析要点**:
- 发言是否带有测试数据/截图
- 是否能纠正他人的错误观点

### 4. 社交活跃度 👥 (1-10分)
**评分标准**:
- **1-3分 (潜水党)**: 几乎不发帖，只看不回，或者只回"分母"抽奖。
- **4-6分 (普通用户)**: 偶尔回复感兴趣的话题，参与度一般。
- **7-8分 (活跃分子)**: 经常出没于各个板块，热衷于"吃瓜"、讨论，回复速度快。
- **9-10分 (水王/KOL)**: 社区熟脸，发帖量巨大，无处不在，也是社区熟脸，发帖量巨大。

**量化指标**:
- 平均回复长度
- 是否热衷于"抢楼"或"前排"

---

### 5. 兴趣广度评估 🎮 (1-10分)
**评分标准**:
- **1-3分**: 仅关注VPS/服务器单一领域。
- **4-6分**: 关注VPS以及周边的(域名/SSL/面板)话题。
- **7-8分**: 涉猎广泛，包括加密货币、数码产品、羊毛福利、甚至生活情感。
- **9-10分**: 百科全书，从服务器到修电脑，从炒币到炒股，无所不知。

**量化指标**:
- 跨板块回复的比例

---

### 6. 情绪稳定性 🧩 (1-10分)
**评分标准**:
- **1-3分 (暴躁老哥)**: 容易破防，喜欢对线，攻击性强，经常使用侮辱性词汇。
- **4-6分 (普通)**: 偶尔会有情绪化表达，大部分时间正常。
- **7-8分 (理性)**: 就事论事，不卑不亢，即使面对争论也能保持冷静。
- **9-10分 (圣人)**: 极其友善，乐于助人，面对小白问题也不厌其烦，从不引战。

---

### 7. 生活品质指数 🌟 (1-10分)
**评分标准**:
- **1-3分**: 经常抱怨生活，为了极小的羊毛花费大量时间，生活焦虑。
- **4-6分**: 普通打工人状态，偶尔分享生活琐事。
- **7-8分**: 偶尔晒出高价值物品(NAS/MacBook/软路由)，生活富足。
- **9-10分**: 财富自由，讨论移民、海外置业、高端生活方式。

---

### 8. 影响力指数 🏆 (1-10分)
**评分标准**:
- **1-3分**: 透明人，无人认识。
- **4-6分**: 熟脸，ID有一定辨识度。
- **7-8分**: 在某个领域(如脚本开发/线路分析)有话语权，被他人@请教。
- **9-10分**: 社区大佬，一呼百应，发布的帖子通常是热门。

---
### 9. 学习成长力 📈 (1-10分)
**评分标准**:
- **1-3分**: 固步自封，只做伸手党，不愿意学习新知识。
- **4-6分**: 遇到问题会尝试搜索，能照着教程做。
- **7-8分**: 经常分享新的技术发现，热衷于尝试新软件/新架构。
- **9-10分**: 技术引领者，将外部的新技术引入社区，编写文档。

---

### 10. 真实度/可信度 🎭 (1-10分)
**评分标准**:
- **1-3分 (骗子/小号)**: 注册时间短，专门发广告/诈骗信息，或者只在交易区活跃且无信用背书。
- **4-6分 (普通)**: 正常用户，无不良记录。
- **7-8分 (信用良好)**: 交易记录良好，发言真实可信。
- **9-10分 (权威认证)**: 论坛元老，知名开发者，或经过验证的商家代表。

---

### 11. 社区角色定位 🏷️ (关键)
请判断该用户在 NodeSeek 生态中的角色：
- **普通 MJJ**: 大多数用户的状态，折腾VPS，偶尔灌水，寻找性价比。
- **技术大牛**: 社区的技术支柱，发布脚本/教程。
- **商家/客服**: IDC 代表，发布促销信息，处理工单。
- **Affman (推广员)**: 发言主要目的是为了发带有返利链接(Aff)的推广内容，极力吹捧某些商家。
- **黄牛 (倒狗)**: 活跃于交易区，低价收传家宝，高价卖出，以赚差价为生。
- **羊毛党**: 哪里有免费/便宜去哪里，热衷于抽奖、领币。
- **乐子人**: 喜欢看热闹，发表情包，阴阳怪气，不嫌事大。

---

### 12. 交易信誉与风险 🛡️
**分析要点**:
- **交易风格**: 爽快/磨叽/斤斤计较/先款/中介。
- **历史记录**: 是否有被挂人(争议)记录？
- **潜在风险**: 是否频繁更换账号？是否只在特定时间段活跃？
- **特殊身份**: 是否为 **Affman** (推广员) 或 **黄牛** (倒狗)？

---

### 13. 生活地域推断 🏠
**不评分，仅推断**
**分析要点**:
- **居住城市**: _____ (根据讨论的宽带运营商、提及的地点、时区推断)
- **证据强度**: 强/中/弱
- **可能的活动范围**: _____

---

### 14. 欺诈风险指数 🚩 
**评分标准**:
- **1-3分 (安全)**: 信用极高，长期活跃的大佬/商家，有大量历史交易记录且无争议。
- **4-6分 (普通)**: 普通用户，无不良记录，交易需谨慎但基本安全。
- **7-8分 (高危预警)**: 风险较高，可能是买号/新号，或者有过激言论，建议走中介。
- **9-10分 (极高风险)**: 骗子特征明显（如：只出不收、价格离谱、催促交易、私聊交易），建议立即拉黑。

**分析要点**:
- 账号注册时间与活跃度是否匹配
- 是否有“急出”、“先款”等高风险关键词
- 历史回复中是否有被挂(争议)记录

---

## 📋 综合评价

### 综合画像卡片

| 维度 | 评分 | 等级 | 关键特征 |
|------|------|------|---------|
| 技术能力 | __/10 | 专家/进阶/小白 | _____ |
| 消费能力 | __/10 | 富哥/中产/挂逼 | _____ |
| 活跃度 | __/10 | 水王/活跃/潜水 | _____ |
| 交易风险 | __/10 | 高/中/低 | _____ |
| 真实度 | __/10 | 真实/存疑/小号 | _____ |
| 欺诈指数 | __/10 | 高危/中/低/安全 | _____ |

### 用户画像总结 (300字以内)
[用简练的语言描述该用户的整体特征，例如："一位典型的挂逼MJJ，热衷于收集各种免费资源和灵车VPS，对技术一知半解但热衷于凑热闹..." 或 "一位潜伏在论坛的Linux运维大佬，偶尔分享高质量脚本，对Affman深恶痛绝..."]

### 核心标签 🏷️
\`#标签1\` \`#标签2\` \`#标签3\` \`#标签4\` \`#标签5\`

### 核心洞察 💡 (原版复刻)
**优势特征**（最突出的3个方面）:
1. _____
2. _____
3. _____

**潜在需求**（可能感兴趣的3个方向）:
1. _____
2. _____
3. _____

**性格特质**（MBTI参考）:
- 可能的性格类型: _____
- 主要性格特征: _____

---

## 📋 输出格式要求

1. **严格按照评分标准打分**，不得凭感觉评分
2. **必须列出量化指标的具体数值**
3. **每个评分必须有具体的证据支撑**（需引用具体回复内容或楼层，例如："如回复#3所示..."）
4. **填写综合评价表格**
5. **生成200-300字的用户画像总结**
6. **给出3-5个标签**
7. **不用重新输出评分标准，只给出要求的结果**

---

## ⚡ 开始分析

请开始你的专业量化分析，注意：

✅ **量化优先**: 先统计量化指标，再基于数据打分  
✅ **证据支撑**: 每个结论都要引用具体回复作为证据  
✅ **客观准确**: 基于实际数据，不要过度臆测  
✅ **标准一致**: 严格按照评分标准，不得凭主观感觉  

---

*本文档由 NodeSeek 用户回复提取器自动生成* *提取时间: ${date}* *数据量: ${allReplies.length} 条回复*
`;
        return md;
    }

    function exportToMarkdown() {
        if (allReplies.length === 0) return showToast('没有数据可导出');
        const md = generatePrompt();
        const uid = window.location.href.match(/\/space\/(\d+)/)?.[1] || 'User';
        download(md, `nodeseek_${uid}_analysis.md`, 'text/markdown');
        showToast(`✅ 成功导出 MD\n文件名: nodeseek_${uid}_analysis.md\n回复数: ${allReplies.length} 条`);
    }

    function exportToCSV() {
        if (allReplies.length === 0) return showToast('没有数据可导出');
        const headers = ['页码', '帖子标题', '回复内容'];
        let csv = '\uFEFF' + headers.join(',') + '\n';
        allReplies.forEach(r => {
            csv += `${r.page},"${(r.title||'').replace(/"/g,'""')}","${(r.content||'').replace(/"/g,'""')}"\n`;
        });
        download(csv, 'nodeseek_replies.csv', 'text/csv');
        showToast(`✅ 成功导出 CSV\n共 ${allReplies.length} 条`);
    }

    async function copyToClipboard() {
        if (allReplies.length === 0) return showToast('没有数据可复制');
        try {
            const md = generatePrompt();
            await navigator.clipboard.writeText(md);
            showToast(`✅ 复制成功！\n${allReplies.length} 条回复已存入剪贴板`);
        } catch(e) {
            alert('复制失败，请手动导出');
        }
    }

    function clearData() {
        if(confirm('确定清空所有数据吗？')) {
            allReplies = [];
            state.processedPages = 0;
            state.deepProgress = 0;
            updateUI();
            showToast('🗑️ 数据已清空');
        }
    }

    // --- 辅助函数 ---

    function updateUI() {
        const elCount = document.getElementById('ns-count');
        const elPage = document.getElementById('ns-page-txt');
        const elBar = document.getElementById('ns-bar');
        
        if (elCount) elCount.innerText = allReplies.length;
        
        if (elPage) {
            // 🟢 如果当前是深挖阶段 (Phase 2)
            if (state.deepMode && state.phase === 2) {
                // 显示为：深挖(P5) 20 / 100
                elPage.innerText = `深挖(P${state.currentPage || '-'}) ${state.deepProgress} / ${state.deepTotal}`; // 🟢 修复显示：分母为实际需挖数
                elPage.style.color = '#AF52DE'; // 紫色
                
                if (elBar) {
                    const pct = Math.min(100, (state.deepProgress / state.deepTotal) * 100); // 🟢 修复进度条
                    elBar.style.width = `${pct}%`;
                    elBar.style.background = 'linear-gradient(135deg, #AF52DE, #BF5AF2)'; 
                }
            } else {
                // 🟢 否则显示 API 进度
                elPage.innerText = `API ${state.processedPages} / ${state.maxPage}`;
                elPage.style.color = '#007AFF'; // 蓝色
                
                if (elBar && state.maxPage > 0) {
                    const pct = Math.min(100, (state.processedPages / state.maxPage) * 100);
                    elBar.style.width = `${pct}%`;
                    elBar.style.background = 'var(--ns-primary)'; 
                }
            }
        }
    }

    function toggleUI(running) {
        const startArea = document.getElementById('btn-start-area');
        const stopArea = document.getElementById('btn-stop-area');
        const config = document.getElementById('ns-config');
        
        if(startArea) startArea.style.display = running ? 'none' : 'block';
        if(stopArea) stopArea.style.display = running ? 'block' : 'none';
        if(config) {
            document.getElementById('ns-pages').disabled = running;
            document.getElementById('ns-deep-mode').disabled = running;
        }
    }

    function updateStatus(text) {
        const el = document.getElementById('ns-status-txt');
        if(el) el.innerText = text;
    }

    function showToast(msg, duration = 2500) {
        const t = document.createElement('div');
        t.className = 'ns-toast';
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), duration);
    }
    
    function download(content, filename, type) {
        const blob = new Blob([content], {type});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

})();
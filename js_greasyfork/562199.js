// ==UserScript==
// @name          超星API自动答题 
// @namespace     ERRORawa
// @version        3.4.2
// @description    修复豆包API，全自动连续答题，美化UI
// @author        ERROR
// @match        *://*/*
// @connect      api.siliconflow.cn
// @connect      ark.cn-beijing.volces.com
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         unsafeWindow
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/562199/%E8%B6%85%E6%98%9FAPI%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/562199/%E8%B6%85%E6%98%9FAPI%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================================================================
    // 🟢 1. 配置区域
    // =========================================================================
    const CONFIG = {
        siliconflow: {
            apiKey: "sk-eyvnzconzkcpndkcjnvmkqtzgjwiakwuokpzwdqytvdsftrq",
            endpoint: "https://api.siliconflow.cn/v1/chat/completions"
        },
        doubao: {
            apiKey: "11456a91-5b81-4cfd-b463-0fac65813857",
            endpoint: "https://ark.cn-beijing.volces.com/api/v3/responses"  // 使用 responses 端点支持联网
        },
        nextDelay: 2000,      // 跳转延迟
        pageLoadDelay: 2000   // 页面加载后等待时间
    };

    const MODELS = {
        siliconflow: [
            { name: "GLM-4.7 (Pro)", id: "Pro/zai-org/GLM-4.7" },
            { name: "DeepSeek-V3.2", id: "deepseek-ai/DeepSeek-V3.2" },
            { name: "GLM-4.6V", id: "zai-org/GLM-4.6V" }
        ],
        doubao: [
            { name: "Doubao-Seed", id: "doubao-seed-1-8-251228" },
            { name: "DeepSeek-V3.2", id: "deepseek-v3-2-251201" }
        ]
    };

    const win = unsafeWindow || window;

    // =========================================================================
    // 🛡️ 2. 防切屏
    // =========================================================================
    function antiCheat() {
        try {
            win.checkRemainTime = function () { };
            win.exitCount = function () { };
            win.fireCheckRemainTime = function () { };
            win.exitCountAndExitTip = function () { };
            win.onblur = null;
            win.onmouseout = null;
            win.onvisibilitychange = null;
            document.onvisibilitychange = null;
            if (win.top !== win) win.top.onblur = null;
            document.querySelectorAll(".mask_div").forEach(m => m.remove());
            if (document.head.querySelector("title")) document.head.querySelector("title").innerText = "考试";
            if (win.jsBridge) win.jsBridge.postNotification('CLIENT_TOOLBAR_TITLE', { 'webTitle': "考试" });
        } catch (e) { }
    }
    setInterval(antiCheat, 1000);

    // =========================================================================
    // 🔧 3. UI (美化版)
    // =========================================================================
    // =========================================================================
    // 🔧 3. UI (美化版)
    // =========================================================================
    // =========================================================================
    // 🔧 3. UI (美化版)
    // =========================================================================
    // 使用 localStorage 替代 GM_setValue 以确保跨页状态持久化 (兼容 Chromext)
    const STATE = {
        get provider() { return localStorage.getItem('tm_provider') || 'doubao'; },
        set provider(v) { localStorage.setItem('tm_provider', v); },

        get mode() { return localStorage.getItem('tm_mode') || 'auto'; },
        set mode(v) { localStorage.setItem('tm_mode', v); },

        get autoMode() { return localStorage.getItem('tm_isAuto') === 'true'; },
        set autoMode(v) { localStorage.setItem('tm_isAuto', v); },

        modelIndex: {
            siliconflow: parseInt(localStorage.getItem('tm_idx_silicon') || 0),
            doubao: parseInt(localStorage.getItem('tm_idx_doubao') || 0)
        },
        isRunning: false
    };

    // 如果处于自动模式，页面加载后自动启动 (延迟执行，确保页面加载完毕)
    if (STATE.autoMode) {
        log("🚀 正在恢复全自动答题...", "info");
        setTimeout(() => {
            const ui = document.getElementById('ai-dash');
            if (ui) ui.style.display = 'flex';

            // 再次检查题目是否加载
            const qCheck = document.querySelector(".tit") || document.querySelector(".questionWrap");
            if (qCheck) {
                log(`⏳ ${CONFIG.pageLoadDelay / 1000}秒后开始...`, "sys");
                runAI();
            } else {
                log("⚠️ 未检测到题目，尝试延迟启动...", "err");
                setTimeout(runAI, CONFIG.pageLoadDelay + 2000);
            }
        }, CONFIG.pageLoadDelay);
    }

    GM_addStyle(`
        #ai-dash {
            position: fixed; top: 50px; right: 15px; width: 340px; height: 480px;
            background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
            color: #fff; z-index: 9999999;
            border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
            display: none; flex-direction: column;
            font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(102, 126, 234, 0.15);
            backdrop-filter: blur(10px);
        }
        .ai-head { 
            padding: 14px 18px; 
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
            font-weight: 600; font-size: 15px; 
            border-radius: 16px 16px 0 0;
        }
        .ai-head span:first-child { 
            background: linear-gradient(90deg, #667eea, #764ba2);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .ai-close {
            width: 28px; height: 28px; border-radius: 50%;
            background: rgba(255,255,255,0.1); border: none; color: #888;
            cursor: pointer; font-size: 14px; transition: all 0.2s;
            display: flex; align-items: center; justify-content: center;
        }
        .ai-close:hover { background: rgba(239, 68, 68, 0.3); color: #f55; }
        
        .ai-body { 
            padding: 14px 18px; flex-shrink: 0; 
            border-bottom: 1px solid rgba(255,255,255,0.05);
            background: rgba(0,0,0,0.2);
        }
        .ai-sel { 
            width: 100%; padding: 10px 14px; 
            background: rgba(255,255,255,0.05); color: white; 
            border: 1px solid rgba(255,255,255,0.1); 
            margin-bottom: 10px; border-radius: 10px; 
            font-size: 13px; cursor: pointer; 
            transition: all 0.2s; appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
            background-repeat: no-repeat; background-position: right 12px center;
        }
        .ai-sel:hover { border-color: rgba(102, 126, 234, 0.5); }
        .ai-sel:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2); }
        .ai-sel option { background: #1a1a2e; color: white; }
        
        #ai-logs { 
            flex: 1; background: rgba(0,0,0,0.3); padding: 14px; overflow-y: auto; 
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace; 
            color: #a0a0a0; font-size: 12px; line-height: 1.6;
            border-radius: 0 0 16px 16px;
        }
        #ai-logs::-webkit-scrollbar { width: 5px; }
        #ai-logs::-webkit-scrollbar-track { background: transparent; }
        #ai-logs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        
        .log-item { 
            padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03);
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; } }
        
        .log-sys { color: #888; }
        .log-ans { 
            color: #10b981; font-weight: 600;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
            padding: 10px 12px; border-radius: 10px; margin: 5px 0;
            border-left: 3px solid #10b981;
        }
        .log-think { 
            color: #a78bfa; font-style: italic;
            background: rgba(167, 139, 250, 0.08);
            border-left: 3px solid #a78bfa; 
            padding: 8px 12px; margin: 5px 0; border-radius: 0 8px 8px 0;
            max-height: 120px; overflow-y: auto; font-size: 11px;
        }
        .log-err { 
            color: #f87171;
            background: rgba(239, 68, 68, 0.1);
            padding: 8px 12px; border-radius: 8px; margin: 5px 0;
        }
        .log-info { color: #60a5fa; }
        
        .status-badge {
            display: inline-block; padding: 3px 10px; border-radius: 20px;
            font-size: 11px; font-weight: 500; margin-left: 8px;
        }
        .status-running { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-idle { background: rgba(156, 163, 175, 0.2); color: #9ca3af; }
    `);

    const ui = document.createElement('div');
    ui.id = 'ai-dash';
    ui.innerHTML = `
        <div class="ai-head">
            <span>🤖 AI 答题助手</span>
            <button class="ai-close" id="ai-close">✕</button>
        </div>
        <div class="ai-body">
            <select id="prov" class="ai-sel" onchange="window.setProv(this.value)">
                <option value="doubao">🔥 豆包 (Doubao)</option>
                <option value="siliconflow">⚡ 硅基流动 (SiliconFlow)</option>
            </select>
            <select id="mod" class="ai-sel" onchange="window.setMod(this.value)"></select>
            <select id="mode" class="ai-sel" onchange="window.setMode(this.value)">
                <option value="auto">🚀 全自动模式</option>
                <option value="semi">🎯 半自动模式</option>
            </select>
        </div>
        <div id="ai-logs">
            <div class="log-item log-sys">⏳ 等待开始... 点击题目文字启动</div>
        </div>
    `;
    document.body.appendChild(ui);

    // 日志写入函数
    function log(html, type = "sys") {
        const box = document.getElementById('ai-logs');
        if (!box) return;

        const el = document.createElement('div');
        el.className = `log-item log-${type}`;

        const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (type === 'sys' || type === 'info') {
            el.innerHTML = `<span style="color:#555;font-size:10px;">[${time}]</span> ${html}`;
        } else {
            el.innerHTML = html;
        }

        box.appendChild(el);
        box.scrollTop = box.scrollHeight;
    }

    function render() {
        const s = document.getElementById('mod'); s.innerHTML = '';
        MODELS[STATE.provider].forEach((m, i) => {
            const o = document.createElement('option'); o.value = i; o.text = m.name;
            if (i == STATE.modelIndex[STATE.provider]) o.selected = true; s.add(o);
        });
        document.getElementById('prov').value = STATE.provider;
        document.getElementById('mode').value = STATE.mode;
    }

    win.setProv = (v) => { STATE.provider = v; render(); };
    win.setMod = (v) => {
        if (STATE.provider === 'siliconflow') localStorage.setItem('tm_idx_silicon', v);
        else localStorage.setItem('tm_idx_doubao', v);
        STATE.modelIndex[STATE.provider] = v;
    };
    win.setMode = (v) => { STATE.mode = v; };
    document.getElementById('ai-close').onclick = () => {
        ui.style.display = 'none';
        STATE.autoMode = false; // 关闭自动模式
    };
    render();

    // =========================================================================
    // 🚀 4. 绑定逻辑
    // =========================================================================
    function bindElements() {
        // 绑定倒计时 -> 呼出面板
        const tBtn = document.querySelector(".countDown") || document.querySelector("#timer");
        if (tBtn && !tBtn.getAttribute("data-ai-bound")) {
            tBtn.setAttribute("data-ai-bound", "true");
            tBtn.style.cursor = "pointer";
            tBtn.onclick = function (e) { e.stopPropagation(); ui.style.display = 'flex'; };
        }

        // 绑定标题 -> 运行
        const triggers = document.querySelectorAll(".tit, .type_tit, .client_title");
        triggers.forEach(el => {
            if (el.getAttribute("data-ai-bound") !== "true") {
                el.setAttribute("data-ai-bound", "true");
                el.style.cursor = "pointer";
                el.onclick = function (e) {
                    e.stopPropagation(); e.preventDefault();
                    if (document.getElementById('ai-dash').style.display === 'none') {
                        document.getElementById('ai-dash').style.display = 'flex';
                    }
                    STATE.autoMode = true;  // 启动自动模式 (触发setter保存)
                    runAI();
                };
            }
        });
    }
    setInterval(bindElements, 1000);

    // =========================================================================
    // 🧠 5. 核心运行
    // =========================================================================
    function runAI() {
        if (STATE.isRunning) return;
        STATE.isRunning = true;

        // 清空旧日志
        const logBox = document.getElementById('ai-logs');
        logBox.innerHTML = '';
        log('⚡ 正在分析题目...', 'info');

        // 1. 获取题目
        let qDom = document.querySelector(".pad30") || document.querySelector(".questionWrap") || document.querySelector(".answerCon") || document.querySelector(".answerMain");
        let qText = qDom ? qDom.innerText : "";

        if (!qText || qText.length < 2) {
            STATE.isRunning = false;
            log("❌ 未找到题目内容", "err");
            return;
        }

        log(`📝 题目获取成功 (${qText.length}字)`);

        // 2. 构造 Prompt
        let systemPrompt = `你是一个答题助手。请直接返回JSON格式。
格式：{"answer": ["A", "B"]} 或 {"answer": ["true"]} 或 {"answer": ["内容"]}
不要输出Markdown代码块。`;

        const prov = STATE.provider;
        const conf = CONFIG[prov];
        const mId = MODELS[prov][STATE.modelIndex[prov]].id;

        log(`🔗 使用: ${prov} / ${mId}`);

        // 3. 构造请求体 - 区分不同API格式
        let payload;

        if (prov === 'doubao') {
            // 豆包使用 responses API + 联网搜索
            payload = {
                model: mId,
                input: [
                    { role: "user", content: systemPrompt + "\n\n题目：\n" + qText }
                ],
                tools: [
                    { type: "web_search", max_keyword: 3 }
                ]
            };
        } else {
            // 硅基流动使用标准 chat/completions
            payload = {
                model: mId,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "题目：\n" + qText }
                ],
                stream: false
            };
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: conf.endpoint,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${conf.apiKey}`
            },
            data: JSON.stringify(payload),
            timeout: 30000,
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.error) {
                        log(`❌ API错误: ${data.error.message || data.error.code}`, "err");
                        STATE.isRunning = false;
                        return;
                    }

                    // =================================================================
                    // 🧩 通用响应解析逻辑 (超级清洗版)
                    // =================================================================
                    let content = "";
                    let thinkParts = [];

                    // A. 豆包 (Doubao) 解析路径
                    if (prov === 'doubao' && data.output && Array.isArray(data.output)) {
                        for (const item of data.output) {
                            // 收集思考过程
                            if (item.type === "reasoning" && item.summary) {
                                for (const s of item.summary) {
                                    if (s.type === "summary_text" && s.text) thinkParts.push(s.text);
                                }
                            }
                            // 收集回复内容 (优先找包含 answer 的段落)
                            if (item.type === "message" && item.content) {
                                for (const c of item.content) {
                                    if (c.type === "output_text" && c.text) {
                                        // 如果之前的 content 没有 answer 或者是空的，就更新为当前的
                                        if (!content || (c.text.includes("answer") && !content.includes("answer"))) {
                                            content = c.text;
                                        } else if (c.text.includes("answer")) {
                                            // 这是一个更像答案的片段，覆盖旧的
                                            content = c.text;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // B. 硅基流动 / 标准 OpenAI 解析路径
                    else if (data.choices && data.choices[0]) {
                        content = data.choices[0].message.content || "";
                        if (data.choices[0].message.reasoning_content) {
                            thinkParts.push(data.choices[0].message.reasoning_content);
                        }
                    }

                    // 合并思考过程
                    const think = thinkParts.join('\n\n');

                    // =================================================================
                    // 🧹 内容清洗与 JSON 提取 (核心修复)
                    // =================================================================
                    if (!content) {
                        log(`⚠️ API返回内容为空`, "err");
                        log(`原始数据片段: ${JSON.stringify(data).substring(0, 200)}`, "sys");
                        STATE.isRunning = false;
                        return;
                    }

                    // 1. 显示思考过程 (UI优化)
                    if (think) {
                        const thinkPreview = think.length > 150 ? think.substring(0, 150) + '...' : think;
                        log(`<div class="log-think">💭 <b>思考过程:</b><br>${thinkPreview.replace(/\n/g, '<br>')}</div>`);
                    }

                    // 2. 强力清洗内容
                    let cleanContent = content;

                    // 去除硅基流动的 box 标记
                    cleanContent = cleanContent.replace(/<\|begin_of_box\|>/g, "").replace(/<\|end_of_box\|>/g, "");
                    // 去除 markdown 代码块
                    cleanContent = cleanContent.replace(/```json/gi, "").replace(/```/g, "").trim();

                    // 调试日志：显示清洗后的文本开头
                    log(`📦 <b>AI回复:</b> ${cleanContent.substring(0, 100)}${cleanContent.length > 100 ? '...' : ''}`, 'sys');

                    // 3. 尝试解析
                    let result = null;
                    try {
                        // 方式一：直接解析
                        result = JSON.parse(cleanContent);
                    } catch (e) {
                        // 方式二：正则提取 (针对混杂了其他文本的情况)
                        try {
                            const match = cleanContent.match(/\{[\s\S]*"answer"[\s\S]*\}/);
                            if (match) {
                                result = JSON.parse(match[0]);
                                log("🔧 已通过正则提取JSON", "info");
                            }
                        } catch (e2) { }
                    }

                    // 4. 处理结果
                    if (result && result.answer) {
                        let ansArr = Array.isArray(result.answer) ? result.answer : [result.answer];

                        // UI 美化：显示大号答案
                        log(`<div style="margin-top:10px; padding:10px; background:rgba(16, 185, 129, 0.2); border-left:4px solid #10b981; border-radius:4px;">
                                <div style="font-size:12px; opacity:0.8;">✅ 最终答案</div>
                                <div style="font-size:20px; font-weight:bold; color:#10b981;">${ansArr.join('  ')}</div>
                             </div>`);

                        fillAnswerJson(ansArr);

                        // 自动跳转
                        if (STATE.mode === 'auto' && STATE.autoMode) {
                            log(`⏳ ${CONFIG.nextDelay / 1000}s后自动下一题...`, 'info');
                            STATE.isRunning = false;
                            setTimeout(() => { goToNextQuestion(); }, CONFIG.nextDelay);
                            return;
                        }
                    } else {
                        log("⚠️ 无法提取有效答案", "err");
                        log(`<div style="font-size:10px; color:#666;">原文: ${cleanContent}</div>`, "sys");
                    }
                } catch (e) {
                    log(`❌ 处理响应出错: ${e.message}`, "err");
                }
                STATE.isRunning = false;
            },
            onerror: function (err) {
                log("❌ 网络错误", "err");
                STATE.isRunning = false;
            },
            ontimeout: function () {
                log("❌ 请求超时", "err");
                STATE.isRunning = false;
            }
        });
    }

    // =========================================================================
    // ⏩ 下一题 + 自动继续
    // =========================================================================
    function goToNextQuestion() {
        // 检查是否是最后一题
        const isLast = document.querySelectorAll(".lastQuestion");
        if (isLast.length > 0) {
            log("🏁 已是最后一题，自动答题结束", 'info');
            STATE.autoMode = false;
            return;
        }

        let btn = document.querySelector(".next") ||
            document.getElementById("nextQuestion") ||
            document.querySelector(".turnPage .next");

        if (btn) {
            log("➡️ 跳转下一题...", 'info');
            btn.click();

            // 等待页面加载后自动继续答题
            if (STATE.mode === 'auto' && STATE.autoMode) {
                setTimeout(() => {
                    log("🔄 自动继续答题...", 'info');
                    runAI();
                }, CONFIG.pageLoadDelay);
            }
        } else {
            log("⚠️ 未找到下一题按钮", "err");
            STATE.autoMode = false;
        }
    }

    // =========================================================================
    // 🖊️ 填答逻辑
    // =========================================================================
    function fillAnswerJson(answers) {
        if (!answers || answers.length === 0) return;

        const titEl = document.querySelector(".tit");
        let typeStr = titEl ? titEl.innerText : "";

        const $ = win.$ || win.jQuery;

        try {
            if (typeStr.includes("单选题")) {
                let ans = answers[0].toUpperCase().trim();
                let index = ans.charCodeAt(0) - 65;

                if ($ && $(".radioList").length > index) {
                    $(".radioList").eq(index).addClass("answer");
                    $(".answer").tap();
                } else {
                    let allOpts = document.querySelectorAll(".radioList");
                    if (allOpts[index]) {
                        allOpts[index].classList.add("answer");
                        allOpts[index].click();
                    }
                }
            } else if (typeStr.includes("多选题")) {
                answers.forEach(ans => {
                    let key = ans.toUpperCase().trim();
                    let index = key.charCodeAt(0) - 65;
                    if ($ && $(".radioList").length > index) {
                        $(".radioList").eq(index).addClass("answer");
                    } else {
                        let allOpts = document.querySelectorAll(".radioList");
                        if (allOpts[index]) allOpts[index].classList.add("answer");
                    }
                });
                if ($ && $(".answer").length > 0) {
                    $(".answer").tap();
                } else {
                    document.querySelectorAll(".answer").forEach(el => el.click());
                }
            } else if (typeStr.includes("判断题")) {
                let val = answers[0].toLowerCase().trim();
                if ($ && $(`[name='${val}']`).length > 0) {
                    $(`[name='${val}']`).tap();
                } else {
                    let el = document.querySelector(`[name='${val}']`) ||
                        document.querySelector(`input[value='${val}']`);
                    if (el) el.click();
                }
            } else if (typeStr.includes("填空题")) {
                const answerCon = document.querySelector(".answerCon");
                if (answerCon) {
                    const iframes = answerCon.querySelectorAll("iframe");
                    answers.forEach((ans, i) => {
                        if (iframes[i] && iframes[i].contentDocument) {
                            let p = iframes[i].contentDocument.querySelector("p");
                            if (p) p.innerText = ans;
                        }
                    });
                }
            } else if (typeStr.includes("简答题")) {
                const answerCon = document.querySelector(".answerCon");
                if (answerCon) {
                    const frame = answerCon.querySelector("iframe");
                    if (frame && frame.contentDocument) {
                        let p = frame.contentDocument.querySelector("p");
                        if (p) p.innerText = answers.join('\n');
                    }
                }
            }
        } catch (e) {
            log(`⚠️ 填答出错: ${e.message}`, 'err');
        }
    }

})();
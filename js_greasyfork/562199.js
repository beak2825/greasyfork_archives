// ==UserScript==
// @name          超星API自动答题
// @namespace     ERRORawa
// @version        3.5.1
// @description    移除模式选择，通过点击题目触发；支持流式响应与智能重试；修复防切屏
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

    const win = unsafeWindow || window;

    // =========================================================================
    // �️ 0. 防切屏 & 改标题 (恢复)
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
            // 改标题
            if (document.head.querySelector("title")) document.head.querySelector("title").innerText = "考试";
            if (win.jsBridge) win.jsBridge.postNotification('CLIENT_TOOLBAR_TITLE', { 'webTitle': "考试" });
        } catch (e) { }
    }
    setInterval(antiCheat, 1000);

    // =========================================================================
    // �🟢 1. 配置区域
    // =========================================================================
    const CONFIG = {
        siliconflow: {
            apiKey: "sk-eyvnzconzkcpndkcjnvmkqtzgjwiakwuokpzwdqytvdsftrq",
            endpoint: "https://api.siliconflow.cn/v1/chat/completions"
        },
        doubao: {
            apiKey: "11456a91-5b81-4cfd-b463-0fac65813857",
            endpoint: "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
        },
        timeout: 15000,
        maxRetries: 2
    };

    const MODELS = {
        siliconflow: [
            { name: "DeepSeek-V3.2", id: "deepseek-ai/DeepSeek-V3.2" },
            { name: "GLM-4.6V", id: "zai-org/GLM-4.6V" }
        ],
        doubao: [
            { name: "Doubao-Seed", id: "doubao-seed-1-8-251228" },
            { name: "DeepSeek-V3.2", id: "deepseek-v3-2-251201" }
        ]
    };

    // =========================================================================
    // 🔧 2. UI
    // =========================================================================
    const STATE = {
        get provider() { return localStorage.getItem('tm_provider') || 'doubao'; },
        set provider(v) { localStorage.setItem('tm_provider', v); },
        modelIndex: {
            siliconflow: parseInt(localStorage.getItem('tm_idx_silicon') || 0),
            doubao: parseInt(localStorage.getItem('tm_idx_doubao') || 0)
        },
        isRunning: false
    };

    GM_addStyle(`
        #ai-dash {
            position: fixed; top: 50px; right: 15px; width: 320px;
            background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
            color: #fff; z-index: 9999999;
            border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
            display: none; flex-direction: column;
            font-size: 13px; font-family: sans-serif;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            backdrop-filter: blur(10px);
        }
        .ai-head { 
            padding: 12px 16px; 
            background: rgba(255,255,255,0.05);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-between; align-items: center;
            font-weight: bold;
        }
        .ai-body { padding: 12px 16px; }
        .ai-sel { 
            width: 100%; padding: 8px; margin-bottom: 8px;
            background: rgba(0,0,0,0.3); color: white; border: 1px solid rgba(255,255,255,0.2); 
            border-radius: 6px; outline: none;
        }
        #ai-logs { 
            padding: 12px; max-height: 300px; overflow-y: auto; 
            font-family: monospace; font-size: 11px; color: #ccc;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .log-item { margin-bottom: 4px; line-height: 1.4; word-break: break-all; }
        .log-sys { color: #666; }
        .log-err { color: #ff6b6b; }
        .log-info { color: #4dabf7; }
        .log-succ { color: #69db7c; font-weight: bold; }
        .log-stream { color: #ffdda0; font-style: italic; }
    `);

    const ui = document.createElement('div');
    ui.id = 'ai-dash';
    ui.innerHTML = `
        <div class="ai-head">
            <span>🤖 答题设置</span>
            <span style="cursor:pointer" onclick="document.getElementById('ai-dash').style.display='none'">✕</span>
        </div>
        <div class="ai-body">
            <select id="prov" class="ai-sel" onchange="window.setProv(this.value)">
                <option value="doubao">🔥 豆包 (Doubao)</option>
                <option value="siliconflow">⚡ 硅基流动 (SiliconFlow)</option>
            </select>
            <select id="mod" class="ai-sel" onchange="window.setMod(this.value)"></select>
            <div style="font-size:11px; color:#888; margin-top:5px;">
                💡 点击题目文字即可触发答题<br>
                ⏳ 自动重试: 开启 (Max: ${CONFIG.maxRetries})
            </div>
        </div>
        <div id="ai-logs"><div>等待指令...</div></div>
    `;
    document.body.appendChild(ui);

    function log(msg, type = 'sys') {
        const box = document.getElementById('ai-logs');
        if (!box) return;
        const div = document.createElement('div');
        div.className = `log-item log-${type}`;
        div.innerHTML = msg;
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
    }

    function render() {
        const s = document.getElementById('mod'); s.innerHTML = '';
        MODELS[STATE.provider].forEach((m, i) => {
            const o = document.createElement('option'); o.value = i; o.text = m.name;
            if (i === STATE.modelIndex[STATE.provider]) o.selected = true;
            s.add(o);
        });
        document.getElementById('prov').value = STATE.provider;
    }

    win.setProv = (v) => { STATE.provider = v; render(); };
    win.setMod = (v) => {
        if (STATE.provider === 'siliconflow') localStorage.setItem('tm_idx_silicon', v);
        else localStorage.setItem('tm_idx_doubao', v);
        STATE.modelIndex[STATE.provider] = parseInt(v);
    };
    render();

    // =========================================================================
    // 🔗 3. 绑定 (严格复原)
    // =========================================================================
    function bindElements() {
        // 1. 绑定倒计时 -> 呼出设置面板
        const tBtn = document.querySelector(".countDown") || document.querySelector("#timer");
        if (tBtn && !tBtn.dataset.bound) {
            tBtn.dataset.bound = "true";
            tBtn.style.cursor = "pointer";
            tBtn.title = "点击打开 AI 设置";
            tBtn.onclick = (e) => { e.stopPropagation(); ui.style.display = 'flex'; };
        }

        // 2. 绑定题目 -> 触发 AI 答题
        const triggers = document.querySelectorAll(".tit, .type_tit, .client_title");
        triggers.forEach(el => {
            if (!el.dataset.bound) {
                el.dataset.bound = "true";
                el.style.cursor = "pointer";
                el.title = "点击立即分析";
                el.innerHTML += " <span style='font-size:10px;color:#10b981;border:1px solid #10b981;padding:0 2px;border-radius:3px;'>AI</span>";
                el.onclick = (e) => {
                    e.stopPropagation(); e.preventDefault();
                    runAI();
                };
            }
        });
    }
    setInterval(bindElements, 1000);

    // =========================================================================
    // 🧠 4. AI 核心
    // =========================================================================
    async function runAI(retryCount = 0) {
        if (STATE.isRunning) return;
        STATE.isRunning = true;

        document.getElementById('ai-logs').innerHTML = '';
        if (retryCount > 0) log(`🔄 正在重试 (${retryCount}/${CONFIG.maxRetries})...`, 'info');
        else log("⚡ 正在获取题目...", 'info');

        // 恢复更全面的题目获取选择器
        let qDom = document.querySelector(".pad30") || document.querySelector(".questionWrap") || document.querySelector(".answerCon") || document.querySelector(".answerMain") || document.querySelector(".sub-content");
        let qText = qDom ? qDom.innerText : "";

        if (!qText || qText.length < 2) {
            log("❌ 未找到题目", "err");
            STATE.isRunning = false;
            return;
        }

        log(`📝 题目: ${qText.substring(0, 15)}...`, 'sys');

        const prov = STATE.provider;
        const mId = MODELS[prov][STATE.modelIndex[prov]].id;
        const systemPrompt = `你是一个答题助手。直接返回JSON格式答案。不需要Markdown，不需要解释。
格式：{"answer": ["A", "B"]} 或 {"answer": ["true"]} 或 {"answer": ["答案内容"]}。`;

        let payload = {
            model: mId,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "题目：\n" + qText }
            ],
            stream: true,
            max_tokens: 512
        };

        let lastUpdate = 0;

        GM_xmlhttpRequest({
            method: "POST",
            url: CONFIG[prov].endpoint,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${CONFIG[prov].apiKey}`
            },
            data: JSON.stringify(payload),
            timeout: CONFIG.timeout,
            responseType: 'text',
            onreadystatechange: function (res) {
                if (res.readyState === 3 && res.status === 200) {
                    const now = Date.now();
                    if (now - lastUpdate > 500) {
                        log(`🌊 接收数据流... (${res.responseText.length} bytes)`, 'log-stream');
                        lastUpdate = now;
                    }
                }
            },
            onload: function (res) {
                if (res.status !== 200) {
                    handleError(`HTTP ${res.status}: ${res.responseText.substring(0, 50)}`);
                    return;
                }

                const lines = res.responseText.split('\n');
                let finalContent = "";

                for (let line of lines) {
                    line = line.trim();
                    if (line.startsWith('data: ')) {
                        let jsonStr = line.substring(6);
                        if (jsonStr === '[DONE]') break;
                        try {
                            let json = JSON.parse(jsonStr);
                            if (json.choices && json.choices[0].delta && json.choices[0].delta.content) {
                                finalContent += json.choices[0].delta.content;
                            } else if (json.choices && json.choices[0].message && json.choices[0].message.content) {
                                finalContent += json.choices[0].message.content;
                            }
                        } catch (e) { }
                    } else if (line.startsWith('{')) {
                        try {
                            let json = JSON.parse(line);
                            if (json.choices && json.choices[0].message.content) {
                                finalContent = json.choices[0].message.content;
                            }
                        } catch (e) { }
                    }
                }

                if (!finalContent) {
                    try {
                        const direct = JSON.parse(res.responseText);
                        if (direct.choices && direct.choices[0].message) finalContent = direct.choices[0].message.content;
                    } catch (e) { }
                }

                parseAndFill(finalContent);
                STATE.isRunning = false;
            },
            onerror: function (e) { handleError("网络错误"); },
            ontimeout: function () { handleError("请求超时"); }
        });

        function handleError(msg) {
            log(`❌ ${msg || '未知错误'}`, 'err');
            STATE.isRunning = false;
            if (retryCount < CONFIG.maxRetries) {
                setTimeout(() => runAI(retryCount + 1), 2000);
            } else {
                log("⏭️ 重试失败，请手动操作", 'err');
            }
        }

        function parseAndFill(text) {
            if (!text) {
                handleError("未提取到有效内容");
                return;
            }

            let clean = text
                .replace(/<\|begin_of_box\|>/g, "")
                .replace(/<\|end_of_box\|>/g, "")
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

            try {
                let json = null;
                try {
                    json = JSON.parse(clean);
                } catch (e) {
                    const match = clean.match(/\{[\s\S]*"answer"[\s\S]*\}/);
                    if (match) json = JSON.parse(match[0]);
                }

                if (json && json.answer) {
                    const ans = Array.isArray(json.answer) ? json.answer : [json.answer];
                    log(`✅ 答案: ${ans.join(", ")}`, 'log-succ');
                    fillAnswer(ans);
                } else {
                    handleError("非标准JSON格式");
                }
            } catch (e) {
                handleError("JSON解析失败");
            }
        }
    }

    // =========================================================================
    // 🖊️ 5. 填答逻辑
    // =========================================================================
    function fillAnswer(answers) {
        if (!answers || !answers.length) return;
        const $ = win.$ || win.jQuery;
        const typeStr = (document.querySelector(".tit") || {}).innerText || "";

        try {
            if (typeStr.includes("单选题") || typeStr.includes("多选题")) {
                answers.forEach(a => {
                    const idx = a.toUpperCase().charCodeAt(0) - 65;
                    const opts = document.querySelectorAll(".radioList, .singleoption");
                    if (opts[idx]) {
                        if ($ && $(opts[idx]).length) $(opts[idx]).click();
                        else opts[idx].click();
                        opts[idx].classList.add("answer");
                    }
                });
                if ($ && $(".answer").length) $(".answer").tap();
            }
            else if (typeStr.includes("判断题")) {
                const val = answers[0].toLowerCase();
                let el = document.querySelector(`[name='${val}']`) || document.querySelector(`input[value='${val}']`);
                if (el) el.click();
                else if ($ && $(`[name='${val}']`).length) $(`[name='${val}']`).tap();
            }
            else if (typeStr.includes("填空") || typeStr.includes("简答")) {
                const iframes = document.querySelectorAll("iframe");
                answers.forEach((ans, i) => {
                    if (iframes[i] && iframes[i].contentDocument) {
                        const p = iframes[i].contentDocument.querySelector("p");
                        if (p) p.innerText = ans;
                    }
                });
            }
        } catch (e) {
            log(`填答异常: ${e.message}`, 'err');
        }
    }

})();
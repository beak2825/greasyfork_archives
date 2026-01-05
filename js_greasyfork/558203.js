// ==UserScript==
// @name          Gemini Agent Connector (Smart-Clean v16.3)
// @namespace     http://tampermonkey.net/
// @version       16.3
// @description   最终完美版：智能算法清理提示词 + 格式自适应 + 全自动闭环
// @author        You
// @match         https://gemini.google.com/*
// @connect       127.0.0.1
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/558203/Gemini%20Agent%20Connector%20%28Smart-Clean%20v163%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558203/Gemini%20Agent%20Connector%20%28Smart-Clean%20v163%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区 =================
    const BASE_URL = "http://127.0.0.1:12345";
    // ★★★ 你的 Quicker 动作 ID ★★★
    const SERVER_ACTION_ID = "62d29d84-b811-4d2a-afdb-afec68fdc44a";

    // ================= 状态管理 =================
    let isServiceOnline = false;
    let checkInterval = null;
    let isAgentEnabled = false;

    // 指令防抖缓存 (60秒)
    const executedHashes = new Set();
    // DOM 元素处理记录
    const processedNodes = new WeakSet();

    // ================= 样式注入 =================
    function injectSafeCSS() {
        const cssContent = `
            .agent-wrapper { display: flex; align-items: center; margin-left: 10px; padding: 0 8px; border-left: 1px solid #ccc; height: 32px; gap: 8px; }
            .agent-config-btn { cursor: pointer; font-size: 16px; padding: 4px; border-radius: 50%; opacity: 0.6; transition: 0.2s; user-select: none; }
            .agent-config-btn:hover { background-color: #eee; opacity: 1; }
            .agent-text { font-size: 12px; font-weight: 500; color: #5f6368; display: flex; align-items: center; gap: 4px; }
            .status-dot { width: 8px; height: 8px; border-radius: 50%; background-color: #ccc; transition: 0.3s; }
            .status-dot.online { background-color: #34a853; box-shadow: 0 0 4px #34a853; }
            .status-dot.loading { background-color: #fbbc04; animation: blink 1s infinite; }
            @keyframes blink { 50% { opacity: 0.5; } }

            .tgl-switch { position: relative; display: inline-block; width: 32px; height: 18px; }
            .tgl-switch input { opacity: 0; width: 0; height: 0; }
            .tgl-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #dadce0; transition: .4s; border-radius: 34px; }
            .tgl-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .tgl-slider { background-color: #1a73e8; }
            input:checked + .tgl-slider:before { transform: translateX(14px); }

            /* 按钮样式 */
            .run-code-btn { display: none; align-items: center; margin-top: 8px; padding: 6px 12px; background-color: #e6f4ea; color: #137333; border: 1px solid #ceead6; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; user-select: none; z-index: 5; }
            body.agent-mode .run-code-btn { display: inline-flex; }
            .run-code-btn:hover { background-color: #dceed3; }
            .run-code-btn.running { background-color: #fef7e0; color: #b06000; cursor: wait; pointer-events: none; }
            .run-code-btn.success { background-color: #188038; color: white; border-color: #188038; }
            .run-code-btn.error { background-color: #fce8e6; color: #c5221f; border-color: #fad2cf; }
            .run-code-btn.history-item { filter: grayscale(0.5); opacity: 0.8; }

            /* 配置模态框样式 */
            .agent-modal-mask { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; justify-content: center; align-items: center; }
            .agent-modal { background: white; width: 600px; max-height: 80%; overflow-y: auto; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-family: sans-serif; }
            .agent-section-header { margin-top: 15px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #eee; font-weight: bold; }
            .agent-option-item { display: flex; align-items: center; margin-bottom: 10px; }
            .agent-option-text { margin-left: 10px; }
            .agent-save-btn { background: #1a73e8; color: white; border: none; padding: 8px 20px; border-radius: 18px; cursor: pointer; float: right; margin-top: 10px; }
            .agent-textarea { width: 98%; min-height: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-family: Consolas, monospace; font-size: 12px; resize: vertical; }
        `;
        try { const sheet = new CSSStyleSheet(); sheet.replaceSync(cssContent); document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet]; }
        catch (e) { const style = document.createElement('style'); style.textContent = cssContent; (document.head || document.documentElement).appendChild(style); }
    }

    // ================= 辅助函数 =================
    const CAPABILITIES = {
        open_app: { label: "🖥️ 打开应用", prompt: `\n- action: "open_app"\n  params: { "target": "程序路径" }` },
        open_url: { label: "🌐 打开网址", prompt: `\n- action: "open_url"\n  params: { "url": "https://..." }` },
        read_file: { label: "📂 读取文件", prompt: `\n- action: "read_file"\n  params: { "path": "完整路径" }` },
        write_file: { label: "💾 写入文件", prompt: `\n- action: "write_file"\n  params: { "path": "路径", "content": "内容" }` },
        copy: { label: "📋 剪贴板", prompt: `\n- action: "copy"\n  params: { "text": "内容" }` },
        execute_command: { label: "C:\\ 执行命令", prompt: `\n- action: "execute_command"\n  params: { "command": "系统命令", "args": "参数 (可选)" }` }
    };

    const DEFAULT_CONFIG = {
        abilities: Object.keys(CAPABILITIES).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
        prompt_template: `你现在是一个 Quicker 自动化执行助手。
已启用能力: [<<ABILITIES_LIST>>]
请根据需求生成 JSON 指令，不要解释，只输出 JSON 代码块。
支持格式:<<ABILITIES_PROMPTS>>
示例:
\`\`\`json
{
  "action": "open_url",
  "params": { "url": "https://www.bilibili.com" }
}
\`\`\``
    };

    function loadConfig() {
        const s = localStorage.getItem("gemini_agent_config_v2");
        const loaded = s ? JSON.parse(s) : DEFAULT_CONFIG;
        if (!loaded.abilities) loaded.abilities = DEFAULT_CONFIG.abilities;
        if (!loaded.prompt_template) loaded.prompt_template = DEFAULT_CONFIG.prompt_template;
        return loaded;
    }
    function saveConfig(c) { localStorage.setItem("gemini_agent_config_v2", JSON.stringify(c)); }

    function generateSystemPrompt() {
        const config = loadConfig();
        let prompts = [], list = [];
        for (const [key, enabled] of Object.entries(config.abilities)) {
            if (enabled && CAPABILITIES[key]) {
                prompts.push(CAPABILITIES[key].prompt);
                list.push(CAPABILITIES[key].label);
            }
        }
        let finalPrompt = config.prompt_template;
        finalPrompt = finalPrompt.replace("<<ABILITIES_LIST>>", list.join(', '));
        finalPrompt = finalPrompt.replace("<<ABILITIES_PROMPTS>>", prompts.join(''));
        return finalPrompt;
    }

    function simpleHash(str) {
        let hash = 0; for (let i = 0; i < str.length; i++) { hash = (hash << 5) - hash + str.charCodeAt(i); hash |= 0; }
        return hash.toString();
    }

    // ================= 核心：输入框操作 =================

    function findSendButton() {
        const selectors = [
            'button[aria-label="发送消息"]', 'button[aria-label="Send message"]',
            'button[aria-label="发送"]', 'button[aria-label="Send"]', 'button[aria-label="Submit"]'
        ];
        for (const sel of selectors) {
            const btn = document.querySelector(sel);
            if (btn && !btn.disabled) return btn;
        }
        const inputArea = document.querySelector('.ql-editor')?.closest('div.input-area') || document.querySelector('rich-textarea');
        if (inputArea) {
            const buttons = inputArea.querySelectorAll('button');
            for (let i = buttons.length - 1; i >= 0; i--) {
                const btn = buttons[i];
                if (!btn.disabled && btn.offsetParent !== null) return btn;
            }
        }
        return null;
    }

    // 注入提示词（防重复 + 归一化检查）
    function injectPromptAtStart(promptText) {
        const ed = document.querySelector('.ql-editor') || document.querySelector('div[contenteditable="true"]');
        if (!ed) return;

        const normalize = s => s.replace(/\s/g, '');
        // 只有当开头完全没有这段提示词时，才注入
        if (normalize(ed.textContent).includes(normalize(promptText.substring(0, 30)))) return;

        ed.focus();
        const range = document.createRange();
        range.selectNodeContents(ed);
        range.collapse(true); // 折叠到开头

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        document.execCommand('insertText', false, promptText + "\n\n");
        setTimeout(() => ed.dispatchEvent(new Event('input', { bubbles: true })), 50);
    }

    // ★★★ 智能清理算法 ★★★
    function removePromptFromInput() {
        const ed = document.querySelector('.ql-editor') || document.querySelector('div[contenteditable="true"]');
        if (!ed) return;

        const systemPrompt = generateSystemPrompt();
        const rawContent = ed.textContent;

        // 1. 严格匹配 (优先)
        if (rawContent.includes(systemPrompt)) {
            ed.textContent = rawContent.replace(systemPrompt, '').trimStart();
            ed.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("[Agent] 严格清理成功");
            return;
        }

        // 2. 智能骨架匹配 (解决浏览器吞掉换行符的问题)
        // 目标：找到 rawContent 中提示词结束的那个索引位置

        const cleanPrompt = systemPrompt.replace(/\s/g, ''); // 提示词的“骨架”
        let builtClean = "";
        let splitIndex = 0;

        // 逐字扫描输入框内容
        for (let i = 0; i < rawContent.length; i++) {
            const char = rawContent[i];
            // 只收集非空白字符
            if (!/\s/.test(char)) {
                builtClean += char;
            }
            // 每次收集都检查是否凑齐了提示词骨架
            if (builtClean === cleanPrompt) {
                splitIndex = i + 1; // 找到了！就在这里断开
                break;
            }
            // 优化：如果扫描长度已经远超提示词长度还不对，就放弃，防止死循环
            if (i > systemPrompt.length + 100) break;
        }

        if (splitIndex > 0) {
            console.log("[Agent] 智能清理成功，截断位置:", splitIndex);
            const userContent = rawContent.substring(splitIndex).trimStart();
            ed.textContent = userContent;
            ed.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.log("[Agent] 未检测到提示词，保持原样");
        }
    }

    // 回填结果
    function fillGeminiInput(text, autoSubmit = false) {
        const ed = document.querySelector('.ql-editor') || document.querySelector('div[contenteditable="true"]');
        if (ed) {
            ed.focus();
            const s = document.execCommand('insertText', false, text);
            if (!s) { ed.textContent = text; }

            setTimeout(() => {
                ed.dispatchEvent(new Event('input', { bubbles: true }));
                if (autoSubmit) {
                    setTimeout(() => {
                        const sendBtn = findSendButton();
                        if (sendBtn) {
                            console.log("[Agent] 自动发送...");
                            sendBtn.click();
                        }
                    }, 500);
                }
            }, 50);
        }
    }

    // ================= 初始化 =================
    function init() {
        injectSafeCSS();
        markHistoryBlocks();
        const loop = setInterval(() => {
            const anchors = ['toolbox-drawer', 'uploader', '.leading-actions-wrapper > :last-child'];
            let foundAnchor = null;
            for (const sel of anchors) { const el = document.querySelector(sel); if (el && el.parentNode) { foundAnchor = el; break; } }
            if (foundAnchor && !document.getElementById('agent-control-wrapper')) createControlPanel(foundAnchor);
        }, 1000);

        const observer = new MutationObserver((mutations) => {
            const relevantChange = mutations.some(mutation =>
                (mutation.type === 'childList' && Array.from(mutation.addedNodes).some(node =>
                    node.matches?.('model-response') || node.matches?.('pre') || node.querySelector?.('model-response') || node.querySelector?.('pre')
                ))
            );
            if (relevantChange) processNewResponses();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function markHistoryBlocks() {
        const blocks = document.querySelectorAll('pre, model-response');
        blocks.forEach(el => { el.dataset.agentHistory = "true"; });
        console.log(`[Agent] 已标记 ${blocks.length} 个历史区块。`);
    }

    // ================= 服务启停 =================
    function startService() {
        isAgentEnabled = true;
        document.body.classList.add('agent-mode');
        const dot = document.querySelector('.status-dot'); if(dot) dot.className = 'status-dot loading';

        console.log("[Agent] 正在唤醒...");
        window.location.assign(`quicker:runaction:${SERVER_ACTION_ID}`);

        let attempts = 0; clearInterval(checkInterval);
        checkInterval = setInterval(() => {
            attempts++;
            GM_xmlhttpRequest({
                method: "GET", url: `${BASE_URL}/ping`, timeout: 1000,
                onload: function(res) {
                    if (res.status === 200 && res.responseText === "pong") {
                        isServiceOnline = true; clearInterval(checkInterval); updateUIStatus(true);
                        // 启动时注入提示词
                        injectPromptAtStart(generateSystemPrompt());
                    }
                },
                onerror: function() {}
            });
            if (attempts > 30) { clearInterval(checkInterval); updateUIStatus(false); toggleSwitch(false); alert("连接超时或服务未启动"); }
        }, 1000);
    }

    function stopService() {
        isAgentEnabled = false;
        document.body.classList.remove('agent-mode'); isServiceOnline = false; clearInterval(checkInterval); updateUIStatus(false);
        GM_xmlhttpRequest({ method: "POST", url: `${BASE_URL}/shutdown`, timeout: 500, onerror: () => {} });

        // ★★★ 关闭时执行清理 ★★★
        removePromptFromInput();
    }

    function toggleSwitch(state) {
        const chk = document.getElementById('agent-mode-checkbox');
        if(chk) {
            chk.checked = state;
            if(!state) stopService(); else startService();
        }
    }

    function updateUIStatus(online) {
        const dot = document.querySelector('.status-dot'); const text = document.querySelector('.agent-status-text');
        if(dot) dot.className = online?'status-dot online':'status-dot'; if(text) text.textContent = online?'Agent Online':'Agent';
    }

    function createControlPanel(anchorNode) {
        const wrapper = document.createElement('div'); wrapper.id = 'agent-control-wrapper'; wrapper.className = 'agent-wrapper';
        const configBtn = document.createElement('div'); configBtn.className = 'agent-config-btn'; configBtn.textContent = '⚙️'; configBtn.onclick = showConfigModal;
        const textGroup = document.createElement('div'); textGroup.className = 'agent-text';
        const dot = document.createElement('div'); dot.className = 'status-dot';
        const span = document.createElement('span'); span.className = 'agent-status-text'; span.textContent = 'Agent';
        textGroup.append(dot, span);
        const lbl = document.createElement('label'); lbl.className = 'tgl-switch';
        const chk = document.createElement('input'); chk.type = 'checkbox'; chk.id = 'agent-mode-checkbox';
        chk.checked = false;
        const sld = document.createElement('span'); sld.className = 'tgl-slider';
        lbl.append(chk, sld);
        wrapper.append(configBtn, textGroup, lbl);
        anchorNode.parentNode.insertBefore(wrapper, anchorNode.nextSibling);
        chk.addEventListener('change', (e) => { if (e.target.checked) startService(); else stopService(); });
    }

    // ================= 执行逻辑 =================
    function processNewResponses() {
        if (!isServiceOnline || !isAgentEnabled) return;

        const allResponses = document.querySelectorAll('model-response');
        if (allResponses.length === 0) return;

        const latestResp = allResponses[allResponses.length - 1];
        if (processedNodes.has(latestResp)) return;

        const codeBlocks = latestResp.querySelectorAll('pre');

        if (codeBlocks.length > 0) {
            const latestCodeBlock = codeBlocks[codeBlocks.length - 1];
            if (processedNodes.has(latestCodeBlock)) return;

            const contentSnapshot = latestCodeBlock.textContent.trim();
            if (contentSnapshot.length < 10) return;

            setTimeout(() => {
                if (latestCodeBlock.textContent.trim() === contentSnapshot) {
                    createRunButton(contentSnapshot, latestCodeBlock, 'after');
                    processedNodes.add(latestCodeBlock);
                    processedNodes.add(latestResp);
                }
            }, 500);

        } else if (latestResp.textContent.includes('"action"')) {
            const contentSnapshot = latestResp.textContent.trim();
            if (contentSnapshot.length < 30) return;
            setTimeout(() => {
                if (latestResp.textContent.trim() === contentSnapshot) {
                    createRunButton(contentSnapshot, latestResp, 'append');
                    processedNodes.add(latestResp);
                }
            }, 500);
        }
    }

    function createRunButton(content, targetNode, position) {
        let raw = content.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        const m = raw.match(/\{[\s\S]*\}/); if (m) raw = m[0];
        let isValid = false; try { const j = JSON.parse(raw); if(j.action) isValid = true; } catch(e){}
        if (!isValid) return;

        const btn = document.createElement('div'); btn.className = 'run-code-btn'; btn.textContent = '▶️ 运行 Agent';

        const isHistory = targetNode.closest('[data-agent-history="true"]') || targetNode.dataset.agentHistory === "true";
        if (isHistory) {
            btn.classList.add('history-item');
            btn.dataset.autoRun = "skipped";
        }

        if (position === 'after' && targetNode.parentNode) targetNode.parentNode.insertBefore(btn, targetNode.nextSibling);
        else if (position === 'append') targetNode.appendChild(btn);

        btn.onclick = () => { if (!isServiceOnline) return alert("请先开启 Agent 开关"); execute(raw, btn); };

        if (isServiceOnline && isAgentEnabled && !isHistory) {
            const hash = simpleHash(raw);
            if (!executedHashes.has(hash) && !btn.dataset.autoRun) {
                btn.dataset.autoRun = "true";
                executedHashes.add(hash);
                setTimeout(() => executedHashes.delete(hash), 60000);

                console.log("[Agent] 触发自动执行...");
                setTimeout(() => btn.click(), 800);
            }
        }
    }

    function execute(payload, btn) {
        if(btn.classList.contains('running')) return;
        btn.className = 'run-code-btn running'; btn.textContent = '⏳ 执行中...';

        GM_xmlhttpRequest({
            method: "POST", url: `${BASE_URL}/execute_quicker`,
            headers: { "Content-Type": "application/json" },
            timeout: 60000,
            data: JSON.stringify({ action_name: "AgentReceiver", payload: payload }),
            onload: function(res) {
                try {
                    const d = JSON.parse(res.responseText);
                    const resultText = d.result || JSON.stringify(d);

                    if (d.status === "success") {
                        fillGeminiInput(`[系统通知] 执行成功。\n信息：${resultText}`, true);
                        btn.className = 'run-code-btn success'; btn.textContent = '✅ 已执行';
                    } else {
                        fillGeminiInput(`[系统通知] 执行失败。\n原因：${resultText}`, true);
                        btn.className = 'run-code-btn error'; btn.textContent = '❌ 失败';
                    }
                } catch (e) {
                    btn.className = 'run-code-btn error'; btn.textContent = '⚠️ 解析失败';
                }
            },
            onerror: () => {
                btn.className = 'run-code-btn error'; btn.textContent = '❌ 断开';
                stopService(); toggleSwitch(false);
            }
        });
    }

    // ================= 配置弹窗 (Safe DOM) =================
    function showConfigModal() {
        const old = document.querySelector('.agent-modal-mask'); if (old) old.remove();
        const mask = document.createElement('div'); mask.className = 'agent-modal-mask';
        const modal = document.createElement('div'); modal.className = 'agent-modal';
        const cfg = loadConfig();

        const h3_abi = document.createElement('h3'); h3_abi.textContent = "Agent 能力配置"; modal.appendChild(h3_abi);
        const section_abi = document.createElement('div'); section_abi.className = 'agent-ability-list';
        for (const [k, v] of Object.entries(CAPABILITIES)) {
            const item = document.createElement('div'); item.className = 'agent-option-item';
            const input = document.createElement('input'); input.type = 'checkbox'; input.checked = cfg.abilities[k] !== false; input.dataset.key = k;
            const txt = document.createElement('div'); txt.className = 'agent-option-text'; txt.textContent = v.label;
            item.append(input, txt); section_abi.appendChild(item);
        }
        modal.appendChild(section_abi);

        const h3_prompt = document.createElement('h3'); h3_prompt.className = 'agent-section-header'; h3_prompt.textContent = "系统提示词模板"; modal.appendChild(h3_prompt);

        const p_info = document.createElement('p');
        p_info.style.fontSize = "13px"; p_info.style.color = "#555"; p_info.style.marginBottom = "8px";
        p_info.appendChild(document.createTextNode("使用 "));
        const b1 = document.createElement('b'); b1.textContent = "<<ABILITIES_LIST>>"; p_info.appendChild(b1);
        p_info.appendChild(document.createTextNode(" 插入已启用的工具名称列表。使用 "));
        const b2 = document.createElement('b'); b2.textContent = "<<ABILITIES_PROMPTS>>"; p_info.appendChild(b2);
        p_info.appendChild(document.createTextNode(" 插入工具的 JSON 格式说明。"));
        modal.appendChild(p_info);

        const textarea = document.createElement('textarea'); textarea.className = 'agent-textarea'; textarea.value = cfg.prompt_template; textarea.id = 'agent-prompt-config';
        modal.appendChild(textarea);

        const btn = document.createElement('button'); btn.className = 'agent-save-btn'; btn.textContent = "保存";
        btn.onclick = () => {
            const newCfg = { abilities: {}, prompt_template: textarea.value };
            section_abi.querySelectorAll('input[type="checkbox"]').forEach(c => newCfg.abilities[c.dataset.key] = c.checked);
            saveConfig(newCfg);
            mask.remove();
            if (isServiceOnline) injectPromptAtStart(generateSystemPrompt());
        };
        modal.appendChild(btn);
        mask.appendChild(modal);
        document.body.appendChild(mask);
        mask.onclick = (e) => { if (e.target === mask) mask.remove(); };
    }

    init();
})();
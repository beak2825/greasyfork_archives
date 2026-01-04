// ==UserScript==
// @name         优课联盟deepseek刷课插件
// @namespace    http://tampermonkey.net/
// @version      1.2025.12
// @description  集成 DeepSeek API 进行自动答题、自动播放视频。优化逻辑：播放完视频后自动寻找下一个视频，非视频/非测验的章节自动跳过。
// @author       DeepSeek User
// @match        *://*.uooc.net.cn/*
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.org.cn/*
// @match        *://*.xueyinonline.com/*
// @match        *://*.zhihuishu.com/*
// @connect      api.deepseek.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556259/%E4%BC%98%E8%AF%BE%E8%81%94%E7%9B%9Fdeepseek%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/556259/%E4%BC%98%E8%AF%BE%E8%81%94%E7%9B%9Fdeepseek%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isTop = (window.self === window.top);

    function isLearningPage() {
        const href = window.location.href;
        if (href.includes('uooc.net.cn') && !href.includes('/home/learn/')) return false;
        if (href.includes('chaoxing.com') && !href.includes('/mycourse/') && !href.includes('/knowledge/')) return false;
        return /learn|course|study|video|content/i.test(href);
    }

    if (isTop && !isLearningPage()) return;

    // ========================================
    // 1. UI 面板
    // ========================================
    if (isTop) {
        GM_addStyle(`
            #ds-panel {
                position: fixed; top: 120px; right: 20px; z-index: 999999;
                background: rgba(23, 28, 38, 0.96); color: #e0f2fe;
                padding: 0; border-radius: 12px; font-size: 13px; width: 260px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08);
                font-family: "PingFang SC", system-ui, sans-serif;
                transition: opacity 0.4s ease, transform 0.4s ease;
                backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
                user-select: none; opacity: 0; transform: translateY(10px);
                animation: ds-fade-in 0.8s ease-out forwards;
            }
            @keyframes ds-fade-in { to { opacity: 1; transform: translateY(0); } }

            .ds-header {
                padding: 14px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                display: flex; justify-content: space-between; align-items: center;
                cursor: move; background: linear-gradient(to right, rgba(255,255,255,0.02), transparent);
                border-radius: 12px 12px 0 0;
            }
            .ds-title { font-weight: 700; color: #38bdf8; font-size: 14px; letter-spacing: 0.5px; }

            .ds-content { padding: 18px; }
            .ds-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .ds-label { color: #94a3b8; font-size: 12px; font-weight: 500; }
            .ds-val-container { text-align: right; display: flex; align-items: center; justify-content: flex-end; gap: 6px; }
            .ds-val { font-weight: 600; color: #f1f5f9; font-family: "Menlo", monospace; font-size: 13px; }
            .ds-unit { font-size: 11px; color: #64748b; }

            .st-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 0; }
            .st-work { background: #34d399; box-shadow: 0 0 8px rgba(52, 211, 153, 0.6); animation: breathe 3s infinite; }
            .st-wait { background: #fbbf24; }
            .st-stop { background: #ef4444; }
            @keyframes breathe { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

            #ds-toggle-btn {
                width: 100%; padding: 10px 0; border: none; border-radius: 8px;
                font-weight: 600; font-size: 13px; cursor: pointer;
                transition: all 0.2s; color: #fff;
                background: linear-gradient(135deg, #3b82f6, #2563eb);
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); margin-top: 8px;
            }
            #ds-toggle-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
            #ds-toggle-btn.paused { background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }

            .ds-log-box {
                margin-top: 16px; background: rgba(0, 0, 0, 0.2);
                border-radius: 8px; padding: 10px; border: 1px solid rgba(255, 255, 255, 0.05);
                transition: background 0.3s;
            }
            .ds-log-box:hover { background: rgba(0, 0, 0, 0.3); }
            .ds-log-label {
                font-size: 10px; color: #64748b; margin-bottom: 6px;
                text-transform: uppercase; letter-spacing: 1px; font-weight: 700;
                cursor: pointer; display: flex; justify-content: space-between;
            }
            #ds-log {
                color: #cbd5e1; font-size: 11px; line-height: 1.6; font-family: "Menlo", monospace;
                height: 45px; overflow-y: auto; user-select: text !important; cursor: text;
                transition: height 0.4s ease;
            }
            .ds-log-box.expanded #ds-log { height: 200px; }
            #ds-log::-webkit-scrollbar { width: 3px; }
            #ds-log::-webkit-scrollbar-thumb { background: #475569; border-radius: 2px; }
        `);

        const panelHTML = `
            <div id="ds-panel">
                <div class="ds-header">
                    <span class="ds-title">优课联盟DS插件(跳过版)</span>
                </div>
                <div class="ds-content">
                    <div class="ds-row">
                        <span class="ds-label">运行状态</span>
                        <div class="ds-val-container">
                            <span id="ds-dot" class="st-dot st-wait"></span>
                            <span id="ds-status" class="ds-val" style="color:#fbbf24">等待启动...</span>
                        </div>
                    </div>
                    <div class="ds-row">
                        <span class="ds-label">本节消费</span>
                        <div class="ds-val-container">
                            <span id="ds-cost" class="ds-val">0.000</span>
                            <span class="ds-unit">元</span>
                        </div>
                    </div>

                    <button id="ds-toggle-btn">⏸️ 暂停接管</button>

                    <div class="ds-log-box" id="ds-log-box" title="点击展开/收起日志">
                        <div class="ds-log-label">
                            <span>运行日志 (可复制)</span>
                            <span class="ds-log-icon">▼</span>
                        </div>
                        <div id="ds-log">系统就绪...<br>非视频章节将自动跳过...</div>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('ds-panel')) {
            const div = document.createElement('div');
            div.innerHTML = panelHTML;
            document.body.appendChild(div.firstElementChild);
        }

        const panel = document.getElementById('ds-panel');
        const header = panel.querySelector('.ds-header');
        const logBox = document.getElementById('ds-log-box');

        logBox.addEventListener('click', (e) => {
            if (window.getSelection().toString().length === 0) {
                logBox.classList.toggle('expanded');
            }
        });

        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', () => isDragging = false);
    }

    // --- 状态变量 ---
    let isPaused = false;
    let isManualMode = false;
    let forceBacktrack = false;
    let noTaskTimer = 0;

    const UI = {
        el: (id) => isTop ? document.getElementById(id) : null,

        update: function(status, msg) {
            if (!isTop) { console.log(`[DS_Sub] ${status} - ${msg}`); return; }

            const statusEl = this.el('ds-status');
            const dotEl = this.el('ds-dot');
            const logEl = this.el('ds-log');

            if (status && statusEl) {
                statusEl.innerText = status;
                if (isPaused) {
                    statusEl.style.color = "#f87171";
                    dotEl.className = "st-dot st-stop";
                } else if (isManualMode) {
                    statusEl.style.color = "#fbbf24";
                    dotEl.className = "st-dot st-wait";
                } else {
                    if (['挂视频中', '答题中', '智能检索中', '填入中'].includes(status)) {
                        statusEl.style.color = "#34d399";
                        dotEl.className = "st-dot st-work";
                    } else {
                        statusEl.style.color = "#94a3b8";
                        dotEl.className = "st-dot st-wait";
                    }
                }
            }

            if (msg && logEl) {
                const time = new Date().toLocaleTimeString('zh-CN', { hour12: false });
                let color = '#94a3b8';
                if (msg.includes('答题') || msg.includes('填入')) color = '#34d399';
                if (msg.includes('跳转') || msg.includes('进入')) color = '#60a5fa';
                if (msg.includes('跳过')) color = '#fbbf24';
                if (msg.includes('错误') || msg.includes('暂停')) color = '#f87171';

                logEl.insertAdjacentHTML('beforeend', `<div style="color:${color}"><span style="opacity:0.4;font-size:10px;margin-right:6px">[${time}]</span>${msg}</div>`);
                if (logEl.children.length > 60) logEl.removeChild(logEl.firstElementChild);
                logEl.scrollTop = logEl.scrollHeight;
            }
        },

        updateCost: (cost, limit) => {
            if (isTop) {
                const el = document.getElementById('ds-cost');
                if(el) el.innerText = cost.toFixed(3);
            }
        },

        togglePause: function() {
            if (isManualMode) {
                isManualMode = false;
                noTaskTimer = 0;
                this.update('恢复', '用户强制恢复接管');
            }
            isPaused = !isPaused;
            if (isTop) {
                const btn = this.el('ds-toggle-btn');
                btn.innerHTML = isPaused ? "▶️ 恢复接管" : "⏸️ 暂停接管";
                btn.className = isPaused ? "paused" : "";
            }
            if (!isPaused) playNextUnfinishedVideo();
        }
    };

    if (isTop) {
        document.getElementById('ds-toggle-btn').addEventListener('click', () => UI.togglePause());
    }

    const COST_PER_1K_TOKENS = 0.002;
    function checkBudget() {
        let total = GM_getValue('DS_TOTAL_COST', 0);
        let limit = GM_getValue('DS_BUDGET_LIMIT', 10.0);
        UI.updateCost(total, limit);
        return total < limit;
    }
    function addCost(tokens) {
        let total = GM_getValue('DS_TOTAL_COST', 0);
        total += (tokens / 1000) * COST_PER_1K_TOKENS;
        GM_setValue('DS_TOTAL_COST', total);
        checkBudget();
    }
    function getApiKey() {
        let key = GM_getValue('DEEPSEEK_API_KEY', '');
        if (!key && isTop) {
            setTimeout(() => {
                let k = prompt('【DeepSeek】请输入API Key (sk-开头):');
                if (k) { GM_setValue('DEEPSEEK_API_KEY', k); location.reload(); }
            }, 1500);
        }
        return key;
    }
    if (isTop) {
        GM_registerMenuCommand("💰 设置限额", () => {
            let v = prompt("限额(元):", GM_getValue('DS_BUDGET_LIMIT', 10));
            if (v) GM_setValue('DS_BUDGET_LIMIT', parseFloat(v));
        });
        GM_registerMenuCommand("⚙️ 修改API Key", () => {
            let k = prompt('API Key:', GM_getValue('DEEPSEEK_API_KEY', ''));
            if (k) GM_setValue('DEEPSEEK_API_KEY', k);
        });
    }

    function callDeepSeekAPI(promptText, systemPrompt) {
        return new Promise((resolve) => {
            if (isPaused || isManualMode || !checkBudget()) return resolve(null);
            const apiKey = getApiKey();
            if (!apiKey) return resolve(null);

            UI.update('答题中', '请求 DeepSeek API...');
            GM_xmlhttpRequest({
                method: "POST", url: "https://api.deepseek.com/chat/completions",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
                data: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: promptText }],
                    temperature: 0.1
                }),
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.usage) addCost(data.usage.total_tokens);
                        resolve(data.choices[0].message.content.trim().replace(/[`'"]/g, ""));
                    } catch (e) { resolve(null); }
                },
                onerror: () => resolve(null)
            });
        });
    }

    new MutationObserver((mutations) => {
        mutations.forEach((m) => m.addedNodes.forEach((n) => {
            if (n.tagName === 'VIDEO') muteVideo(n);
            if (n.querySelectorAll) n.querySelectorAll('video').forEach(muteVideo);
        }));
    }).observe(document.body, { childList: true, subtree: true });

    function muteVideo(v) { v.muted = true; v.volume = 0; v.playbackRate = 2.0; }

    let isWorking = false;

    function getQuestionText(qBlock) {
        let text = "";
        let contentDiv = qBlock.querySelector('.content, .subject-description');
        if (contentDiv) text = contentDiv.innerText.trim();
        if (!text) {
            let dt = qBlock.querySelector('dt, .question-title');
            if (dt) text = dt.innerText.trim();
        }
        if (!text || text.length < 5) {
            let clone = qBlock.cloneNode(true);
            clone.querySelectorAll('input, textarea, button, .option').forEach(el => el.remove());
            text = clone.innerText.trim();
        }
        return text.replace(/^[\d\.]+\s*/, '').replace(/第\d+空[:：]?/g, '').replace(/\s+/g, ' ');
    }

    function getContextType(qBlock) {
        const section = qBlock.closest('.queItems, .question-block');
        let txt = section ? (section.querySelector('h2, h3') || section).innerText : "";
        if (txt.includes('多选')) return 'multiple_choice';
        if (txt.includes('单选')) return 'single_choice';
        if (txt.includes('判断')) return 'judgment';
        if (txt.includes('填空')) return 'blank';
        if (txt.includes('简答') || txt.includes('主观')) return 'subjective';
        return null;
    }

    async function autoSolveQuiz(questions) {
        if (isPaused || isManualMode) return;

        let scoreEl = document.querySelector('.score, .mark, .total-score, span.fl_right');
        let hasScore = scoreEl && (scoreEl.innerText.includes('得分') || scoreEl.innerText.includes('分'));
        let hasAnswer = Array.from(document.querySelectorAll('.answerBox-title, .pingyu, .grade-detail')).some(el =>
            el.innerText.includes('你的答案') || el.innerText.includes('教师评语') || el.innerText.includes('评分')
        );
        if (hasScore || hasAnswer) {
            UI.update('跳过', '检测到已完成/有分数，跳过不耗费API');
            setTimeout(() => playNextUnfinishedVideo(), 2000);
            return;
        }

        if (isTop) {
            let conf = confirm(`🤖 发现 ${questions.length} 道测验题！\n\n⚠️ 确认要开始调用 DeepSeek 答题吗？\n(将消耗 API 额度)\n\n[确定] -> 开始答题\n[取消] -> 暂停，手动处理`);
            if (!conf) {
                UI.togglePause();
                UI.update('等待用户手动操作中', '用户取消自动答题，等待手动操作');
                return;
            }
        }

        isWorking = true;
        UI.update('答题中', `正在处理 ${questions.length} 道题目`);

        for (let i = 0; i < questions.length; i++) {
            if (isPaused || isManualMode || !checkBudget()) { isWorking = false; return; }
            const qBlock = questions[i];

            const hasAnswerInput = Array.from(qBlock.querySelectorAll('input[type="radio"], input[type="checkbox"]')).some(el => el.checked) ||
                                   Array.from(qBlock.querySelectorAll('textarea, input[type="text"], iframe, div[contenteditable="true"]')).some(el => {
                                        if (el.tagName === 'IFRAME') return el.contentDocument?.body?.innerText?.trim().length > 0;
                                        if (el.isContentEditable) return el.innerText.trim().length > 0;
                                        return el.value.trim().length > 0;
                                   });

            if (hasAnswerInput) {
                UI.update('答题中', `第${i+1}题已作答，跳过`);
                continue;
            }

            let qText = getQuestionText(qBlock);
            let type = getContextType(qBlock);
            let options = [];

            const radios = Array.from(qBlock.querySelectorAll('input[type="radio"]'));
            const checks = Array.from(qBlock.querySelectorAll('input[type="checkbox"]'));
            const texts = Array.from(qBlock.querySelectorAll('textarea, input[type="text"], iframe, div[contenteditable="true"]'));

            if (!type) {
                if (texts.length > 0) type = 'subjective';
                else if (checks.length) type = 'multiple_choice';
                else if (radios.length) type = 'single_choice';
            }

            if (type === 'multiple_choice') checks.forEach(c => options.push(c.parentElement.innerText.trim()));
            else if (['single_choice','judgment'].includes(type)) radios.forEach(r => options.push(r.parentElement.innerText.trim()));

            await new Promise(r => setTimeout(r, 1500));
            let sys = "你是一个全能学霸。请根据题目直接输出答案。";
            let user = `题型:${type}\n题目:${qText}\n选项:${options.join(',')}\n输出:直接输出答案`;
            if (type === 'blank') {
                 user = `题型:填空题\n题目:${qText}\n要求:请直接输出每个空的答案，不要包含(1)(2)等序号。如果有多个空，请严格使用 "###" 分隔。\n例如: 答案1###答案2\n注意: 不要包含题目中已有的末尾字符(如"处"、"度"等)`;
            } else if (type === 'subjective') {
                 user = `题型:问答/论述题\n题目:${qText}\n要求:请直接输出一段简洁、准确的回答，不要任何多余解释。`;
            }

            let ans = await callDeepSeekAPI(user, sys);
            if (!ans) continue;

            UI.update('答题中', `填入题目${i+1}: ${ans}`);
            try {
                if (['single_choice', 'multiple_choice', 'judgment'].includes(type)) {
                    let inputs = (type === 'multiple_choice') ? checks : radios;
                    if (!inputs.length && type==='multiple_choice') inputs = radios;

                    let cleanAns = ans.toUpperCase().replace(/[^A-Z]/g, "");
                    const trueK = ['正确','对','T','√','A'];

                    for (let input of inputs) {
                        let label = input.parentElement.innerText.trim();
                        let isMatch = false;
                        if (type === 'judgment') {
                             let aiTrue = trueK.some(k=>ans.includes(k));
                             let opTrue = trueK.some(k=>label.includes(k));
                             if (aiTrue === opTrue) isMatch = true;
                        } else {
                            let char = label.charAt(0).toUpperCase();
                            if (/[A-Z]/.test(char) && cleanAns.includes(char)) isMatch = true;
                        }
                        if (isMatch && !input.checked) input.click();
                    }
                } else {
                    let parts = ans.split('###');
                    if (parts.length < texts.length && ans.includes('|')) parts = ans.split('|');

                    texts.forEach((el, idx) => {
                        let val = (parts[idx] || parts[parts.length-1] || ans).trim();
                        if (val.includes("请提供")) val = "AI无法识别";

                        if (type === 'blank') {
                            let suffix = "";
                            let next = el.nextSibling;
                            if (next && next.nodeType === 3) suffix = next.textContent.trim();
                            if (suffix.length > 0 && suffix.length < 4) {
                                if (val.endsWith(suffix)) val = val.slice(0, -suffix.length);
                                else if (val.endsWith(suffix.charAt(0))) val = val.slice(0, -1);
                            }
                        }

                        if (el.tagName === 'IFRAME') {
                             try {
                                 let doc = el.contentDocument || el.contentWindow.document;
                                 if (doc && doc.body) {
                                     doc.body.focus();
                                     if (doc.execCommand) {
                                         doc.execCommand('selectAll', false, null);
                                         doc.execCommand('insertHTML', false, val);
                                     } else {
                                         doc.body.innerHTML = val;
                                     }
                                     ['input', 'change', 'blur', 'focusout'].forEach(evt => {
                                         doc.body.dispatchEvent(new Event(evt, {bubbles:true}));
                                     });
                                     el.dispatchEvent(new Event('input', {bubbles:true}));
                                 }
                             } catch(e) { console.error("Iframe fill error", e); }
                        }
                        else if (el.isContentEditable) {
                             el.focus(); el.innerHTML = val;
                             el.dispatchEvent(new Event('input', {bubbles:true}));
                             el.dispatchEvent(new Event('blur', {bubbles:true}));
                        } else {
                             el.value = val;
                             el.dispatchEvent(new Event('input', {bubbles:true}));
                             el.dispatchEvent(new Event('change', {bubbles:true}));
                        }
                    });
                }
                qBlock.setAttribute('data-answered', 'true');
                qBlock.style.border = "2px solid #34d399";
            } catch(e) {}
        }
        isWorking = false;
        isManualMode = true;
        UI.update('等待用户手动操作中', '答题完毕，请手动提交！');
        if (isTop) alert("🤖 答题完毕！\n\n脚本已暂停。\n请检查并手动点击【提交】。\n\n👉 提交成功或离开当前页面后，脚本会自动检测状态并恢复接管。");
    }

    function findAction() {
        let qs = Array.from(document.querySelectorAll('.queContainer, .question-block, .ti-item'));
        if (!qs.length) {
            let items = Array.from(document.querySelectorAll('.queItems'));
            if (items.length && !items[0].querySelector('.queContainer')) qs = items;
        }
        if (qs.length) {
            let activeQs = qs.filter(q => {
                let inputs = q.querySelectorAll('input, textarea, iframe, div[contenteditable="true"]');
                if (inputs.length === 0) return false;
                let editable = Array.from(inputs).some(el => {
                    if (el.tagName === 'IFRAME') return true;
                    if (el.isContentEditable) return true;
                    return !el.disabled && !el.readOnly;
                });
                return editable;
            });
            if (activeQs.length === 0) return null;

            let undone = activeQs.some(q => q.getAttribute('data-answered') !== 'true');
            if (undone) return { type: 'quiz', elements: activeQs };
            return { type: 'quiz', elements: activeQs };
        }

        const btnSels = ['button', 'input[type="button"]', 'input[type="submit"]', '.ans-job-icon', '.u-btn'];
        const keys = ['开始', '进入', '测验', '考试', 'Start', 'Quiz', '重做'];
        for (let sel of btnSels) {
            let btns = Array.from(document.querySelectorAll(sel));
            for (let btn of btns) {
                if (btn.offsetParent && keys.some(k => btn.innerText.includes(k))) return { type: 'button', el: btn };
            }
        }

        let iframes = document.querySelectorAll('iframe');
        for (let i = 0; i < iframes.length; i++) {
            try {
                let doc = iframes[i].contentDocument || iframes[i].contentWindow.document;
                if (!doc) continue;
                let iQs = Array.from(doc.querySelectorAll('.queContainer, .question-block'));
                if (iQs.length) return { type: 'quiz', elements: iQs };

                let iBtns = Array.from(doc.querySelectorAll(btnSels.join(',')));
                for (let btn of iBtns) {
                    if (btn.offsetParent && keys.some(k => btn.innerText.includes(k))) return { type: 'button', el: btn };
                }
            } catch(e){}
        }
        return null;
    }

    // ========================================
    // 核心修改区域：优化后的自动跳转逻辑
    // ========================================
    function playNextUnfinishedVideo() {
        if (isPaused || isWorking || isManualMode) return;
        if (!checkBudget()) return;

        // 1. 先看看当前页面有没有题没做（做题优先级最高）
        let action = findAction();
        if (action) {
            noTaskTimer = 0;
            if (action.type === 'quiz') {
                autoSolveQuiz(action.elements);
            } else {
                UI.update('智能检索中', `点击入口: ${action.el.innerText}`);
                action.el.click();
                isWorking = true;
                setTimeout(() => isWorking = false, 3000);
            }
            return;
        }

        // 2. 检查闯关锁定
        let lockTips = Array.from(document.querySelectorAll('.unfoldInfo, .tips, div'));
        let isLocked = lockTips.some(el => el.innerText.includes('闯关') || el.innerText.includes('完成之前') && el.offsetParent);

        if (isLocked) {
            isManualMode = true;
            UI.update('等待用户手动操作中', '⛔ 闯关锁定，请手动选择任务');
            if (isTop) alert("⚠️ 检测到闯关模式限制！\n\n请手动点击目录中【第一个未完成】的任务。\n\n进入任务页面后，脚本将自动接管。");
            return;
        }

        // 3. 获取目录并寻找下一项
        let allItems = document.querySelectorAll('.basic, .chapter-item, .catalog-item, .ncells .ncell, .level-two, .level-three, .level-four');
        let activeItem = document.querySelector('.basic.active, .chapter-item.active, .catalog-item.active');
        let startIndex = activeItem ? Array.from(allItems).indexOf(activeItem) + 1 : 0;

        let foundTarget = false;

        for (let i = startIndex; i < allItems.length; i++) {
            let item = allItems[i];
            let isCompleted = item.classList.contains('complete') ||
                              item.querySelector('.icon-check') ||
                              item.querySelector('.ans-job-finished') ||
                              item.classList.contains('finished') ||
                              item.querySelector('[class*="green"]');

            if (isCompleted) continue;

            let text = item.innerText.replace(/\s/g, "");

            // 【修改1】扩充跳过列表，包含常见的非视频非做题内容
            if (['附件', 'PPT', '文档', 'PDF', '阅读', '资料', '讨论', '图文', '前言', '导言', '目标', '通知', '公告'].some(k => text.includes(k))) {
                continue;
            }

            // 【修改2】严格判定：只有明确是视频或测验，才算作"目标"
            // 注意：容器(章节标题)始终允许点击展开
            let isVideo = text.includes('视频') || item.querySelector('.icon-video');
            let isQuiz = text.includes('测验') || text.includes('作业') || text.includes('考试');

            let isContainer = item.classList.contains('chapter') ||
                              item.classList.contains('catalog-title') ||
                              item.querySelector('.catalog-title') ||
                              text.includes('章') || text.includes('节') ||
                              /^\d+(\.\d+)+/.test(text);

            // 如果既不是视频，也不是测验，也不是目录容器，直接跳过
            if (!isVideo && !isQuiz && !isContainer) {
                continue;
            }

            if (isVideo || isQuiz) {
                console.log(`➡️ 跳转目标: ${text}`);
                UI.update('智能检索中', `进入: ${text.substring(0, 15)}`);
                item.click();
                isWorking = true;
                noTaskTimer = 0;
                foundTarget = true;
                // 防止点击过快，稍微等一下
                setTimeout(() => isWorking = false, 5000);
                return;
            }

            if (isContainer) {
                let isOpen = item.classList.contains('open') || item.querySelector('.open') || item.nextElementSibling?.style.display === 'block';
                if (!isOpen) {
                    console.log(`📂 展开目录: ${text}`);
                    UI.update('智能检索中', `展开目录: ${text.substring(0,15)}`);
                    item.click();
                    isWorking = true;
                    noTaskTimer = 0;
                    foundTarget = true;
                    setTimeout(() => isWorking = false, 2000);
                    return;
                }
                continue;
            }
        }

        if (!foundTarget && !isWorking && !isPaused) {
            noTaskTimer += 4;
            let timeLeft = 30 - noTaskTimer;
            if (timeLeft > 0) {
                UI.update('智能检索中', `检索中... ${timeLeft}s 后提示人工`);
            } else {
                isManualMode = true;
                UI.update('等待用户手动操作中', '🔴 未找到后续视频或测验');
                if (isTop) alert("⚠️ 未检测到后续任务，已暂停。\n\n可能是课程已结束，或者后续全是PPT/文档。\n请手动检查。");
            }
        }
    }

    function mainLoop() {
        let video = document.querySelector('video');
        let hasQuiz = document.querySelector('.queContainer') || document.querySelector('iframe')?.contentDocument?.querySelector('.queContainer');

        if (isManualMode) {
             if (video && !video.paused) {
                 isManualMode = false; noTaskTimer = 0;
                 UI.update('挂视频中', '🟢 视频播放中，恢复接管');
             }
             else if (hasQuiz && !hasQuiz.getAttribute('data-answered')) {
                 isManualMode = false; noTaskTimer = 0;
                 UI.update('智能检索中', '🟢 检测到新测验，恢复接管');
             }
        }

        if (isPaused || isManualMode) return;

        if (video) {
            if (!video.muted || video.volume > 0) { video.muted = true; video.volume = 0; }
            if (video.playbackRate !== 2) { video.playbackRate = 2; }

            if (video.ended) {
                UI.update('智能检索中', '播放结束，跳过非视频项...');
                playNextUnfinishedVideo();
            } else if (video.paused && !isWorking) {
                UI.update('挂视频中', '视频自动恢复');
                video.play().catch(()=>{});
            } else {
                let progress = (video.currentTime/video.duration*100).toFixed(1);
                if(progress % 5 === 0) UI.update('挂视频中', `进度 ${progress}%`);
                noTaskTimer = 0;
            }
        } else {
            // 如果当前页面没有视频，尝试寻找下一个
            // 这里会因为 playNextUnfinishedVideo 的新逻辑而自动跳过纯文本页
            playNextUnfinishedVideo();
        }
    }

    setInterval(mainLoop, 4000);
    console.log("=== 插件启动 ===");

})();
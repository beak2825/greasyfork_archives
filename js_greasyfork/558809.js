// ==UserScript==
// @name         UOOC 优课联盟助手 - 全能版 (自动刷课/测验AI/讨论区)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  【作者：afdsafg】优课联盟(UOOC)全能辅助工具：1. 视频自动刷课（倍速/静音/连播/防暂停）；2. 视频中途弹题秒杀；3. 章节测验AI助手（支持DeepSeek/ChatGPT等多模型并发会诊/一键复制题目）；4. 讨论区自动复读刷屏。一站式解决刷课烦恼。
// @author       afdsafg
// @match        *://*.uooc.net.cn/*
// @match        *://*.uooconline.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558809/UOOC%20%E4%BC%98%E8%AF%BE%E8%81%94%E7%9B%9F%E5%8A%A9%E6%89%8B%20-%20%E5%85%A8%E8%83%BD%E7%89%88%20%28%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%B5%8B%E9%AA%8CAI%E8%AE%A8%E8%AE%BA%E5%8C%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558809/UOOC%20%E4%BC%98%E8%AF%BE%E8%81%94%E7%9B%9F%E5%8A%A9%E6%89%8B%20-%20%E5%85%A8%E8%83%BD%E7%89%88%20%28%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E6%B5%8B%E9%AA%8CAI%E8%AE%A8%E8%AE%BA%E5%8C%BA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 核心调度中心
    // ==========================================
    if (window.self === window.top) {
        // --- 主窗口环境 ---
        initVideoHelper();      // 模块A: 视频刷课 & 弹题
        initDiscussionHelper(); // 模块B: 讨论区自动回复
    } else {
        // --- Iframe 环境 ---
        initQuizHelper();       // 模块C: 章节测验 AI 助手
    }


    // ==========================================
    // 模块A：视频刷课 + 悬浮球 + 弹题秒杀
    // ==========================================
    function initVideoHelper() {
        console.log("[UOOC全能助手] 视频模块加载...");

        // 1. 注入视频面板样式
        const css = `
            #uooc-video-panel { position:fixed; top:100px; right:50px; width:220px; background:#2c3e50; color:#fff; z-index:99999; border-radius:6px; font-size:12px; box-shadow:0 4px 15px rgba(0,0,0,0.5); display:flex; flex-direction:column; }
            #uooc-drag-bar { padding:8px; background:#34495e; cursor:move; border-radius:6px 6px 0 0; display:flex; justify-content:space-between; align-items:center; user-select:none; }
            #uooc-min-ball { position:fixed; top:100px; right:50px; width:45px; height:45px; background:#34495e; border-radius:50%; z-index:99999; display:none; align-items:center; justify-content:center; cursor:move; box-shadow:0 4px 15px rgba(0,0,0,0.5); font-size:20px; user-select:none; border:2px solid #ecf0f1; }
            .uooc-row { display:block; margin-bottom:5px; cursor:pointer; }
            .uooc-row input { vertical-align:middle; margin-right:5px; }
        `;
        GM_addStyle(css);

        // 2. 创建 UI
        const div = document.createElement('div');
        div.innerHTML = `
            <div id="uooc-video-panel" style="display:none;"> <div id="uooc-drag-bar">
                    <span>🤖 全能控制台</span>
                    <span id="uooc-min-btn" style="cursor:pointer; padding:0 5px;">➖</span>
                </div>
                <div id="uooc-content" style="padding:10px;">
                    <label class="uooc-row"><input type="checkbox" id="cb-rate" checked> 2倍速 + 静音</label>
                    <label class="uooc-row"><input type="checkbox" id="cb-auto" checked> 自动连播</label>
                    <label class="uooc-row" style="color:#f1c40f;"><input type="checkbox" id="cb-pop-quiz" checked> 自动答视频弹题</label>
                    <label class="uooc-row" style="color:#e74c3c;"><input type="checkbox" id="cb-quiz-alert" checked> 章节测验提醒</label>
                    <div id="uooc-log" style="margin-top:8px; height:80px; background:#222; color:#0f0; overflow-y:auto; padding:5px; border-radius:4px; font-family:monospace;">系统就绪...</div>
                </div>
            </div>
            <div id="uooc-min-ball" title="点击展开">🤖</div>
        `;
        document.body.appendChild(div);

        const panel = document.getElementById('uooc-video-panel');
        const ball = document.getElementById('uooc-min-ball');
        const minBtn = document.getElementById('uooc-min-btn');
        const dragBar = document.getElementById('uooc-drag-bar');

        // 默认显示大面板
        panel.style.display = 'flex';

        // 拖拽逻辑
        function makeDraggable(trigger, target, partner) {
            let isDragging = false, startX, startY, initLeft, initTop, hasMoved = false;
            trigger.addEventListener('mousedown', e => { isDragging=true; hasMoved=false; startX=e.clientX; startY=e.clientY; initLeft=target.offsetLeft; initTop=target.offsetTop; });
            document.addEventListener('mousemove', e => {
                if (isDragging) {
                    if (Math.abs(e.clientX - startX) > 3) hasMoved = true;
                    target.style.left = initLeft + (e.clientX - startX) + 'px'; target.style.top = initTop + (e.clientY - startY) + 'px';
                    if(partner) { partner.style.left = target.style.left; partner.style.top = target.style.top; }
                }
            });
            document.addEventListener('mouseup', () => { isDragging = false; });
            return () => hasMoved;
        }
        makeDraggable(dragBar, panel, ball);
        const checkBallMoved = makeDraggable(ball, ball, panel);

        minBtn.onclick = () => { panel.style.display = 'none'; ball.style.display = 'flex'; };
        ball.onclick = () => { if (!checkBallMoved()) { ball.style.display = 'none'; panel.style.display = 'flex'; } };

        function log(msg) {
            const el=document.getElementById('uooc-log');
            if(el){el.innerHTML+=`<div>>${msg}</div>`;el.scrollTop=el.scrollHeight;}
        }

        // --- 核心循环 (只在有视频的页面生效) ---
        setInterval(() => {
            let video = document.querySelector('video');

            // 只有当前页面有视频标签时，才执行视频逻辑
            if(!video) return;

            // 1. 弹题处理
            if(document.getElementById('cb-pop-quiz').checked) autoAnswerPopQuiz();

            // 2. 视频控制
            if(document.getElementById('cb-rate').checked) {
                if(video.playbackRate !== 2.0) video.playbackRate = 2.0;
                if(!video.muted) video.muted = true;
            }
            if(video.paused && !video.ended) video.play().catch(()=>{});

            // 3. 监听结束
            if(!video.getAttribute('hooked')) {
                video.addEventListener('ended', () => {
                    if(document.getElementById('cb-auto').checked) { log("播放结束, 找下一集"); findNext(); }
                });
                video.setAttribute('hooked', 'true');
                log("捕获到视频对象");
            }
        }, 2000);

        // 自动答视频内弹题
        function autoAnswerPopQuiz() {
            let quizLayer = document.querySelector('#quizLayer');
            if (!quizLayer || quizLayer.style.display === 'none') return;
            log("⚡ 检测到弹题，正在秒杀...");
            try {
                let videoDiv = document.querySelector('div[uooc-video]');
                if (!videoDiv) return;
                let sourceData = JSON.parse(videoDiv.getAttribute('source'));
                let quizList = sourceData.quiz;
                let questionEl = document.querySelector('.smallTest-view .ti-q-c');
                if (!questionEl) return;
                let currentQuestionHTML = questionEl.innerHTML;
                let targetQuiz = quizList.find(q => q.question === currentQuestionHTML);
                if (targetQuiz) {
                    let correctAnswers = [];
                    try { correctAnswers = eval(targetQuiz.answer); } catch(e) { correctAnswers = targetQuiz.answer; }
                    if (!Array.isArray(correctAnswers)) correctAnswers = [correctAnswers];
                    let optionsContainer = quizLayer.querySelector('div.ti-alist');
                    if (optionsContainer) {
                        correctAnswers.forEach(ans => {
                            let index = ans.charCodeAt(0) - 65;
                            if(optionsContainer.children[index]) optionsContainer.children[index].click();
                        });
                        setTimeout(() => {
                            let submitBtn = quizLayer.querySelector('button');
                            if (submitBtn) { submitBtn.click(); log("✅ 弹题已自动提交"); }
                        }, 500);
                    }
                }
            } catch (err) { console.error(err); }
        }

        // 自动下一集
        function findNext() {
            let all = document.querySelectorAll('.basic');
            let activeIdx = -1;
            for(let i=0; i<all.length; i++) { if(all[i].classList.contains('active') && all[i].querySelector('.taskpoint')) { activeIdx=i; break; } }
            if(activeIdx===-1) for(let i=0; i<all.length; i++) if(all[i].classList.contains('active')) activeIdx=i;

            if(activeIdx!==-1 && activeIdx+1<all.length) {
                let next = all[activeIdx+1];
                next.scrollIntoView({block:"center"});

                let isTask = next.querySelector('.taskpoint');
                let isVideo = next.querySelector('.icon-video');

                if(isVideo) {
                    log("跳转下一集..."); setTimeout(()=>next.click(), 1500);
                } else if(!isTask) {
                    log("展开目录..."); next.click(); setTimeout(findNext, 2000);
                } else {
                    log("⚠️ 遇到测验/作业！");
                    setTimeout(() => {
                        next.click();
                        if(document.getElementById('cb-quiz-alert').checked) alertUser("遇到测验，请使用AI助手！");
                    }, 1500);
                }
            }
        }

        function alertUser(msg) {
            try { let u = new SpeechSynthesisUtterance(msg); window.speechSynthesis.speak(u); } catch(e){}
            log(msg);
        }
    }


    // ==========================================
    // 模块B：讨论区自动回复助手 (从独立脚本合并)
    // ==========================================
    function initDiscussionHelper() {
        console.log("[UOOC全能助手] 讨论区模块监听中...");

        let autoTimer = null;
        let isRunning = false;

        // 监听 DOM 变化，等待讨论框出现
        const observer = new MutationObserver((mutations) => {
            const editorArea = document.querySelector('.replay-editor');
            if (editorArea && !document.getElementById('uooc-auto-reply-panel')) {
                console.log("[UOOC全能助手] 检测到讨论区，注入控制面板");
                addControlPanel(editorArea);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        function addControlPanel(targetElement) {
            const panel = document.createElement('div');
            panel.id = 'uooc-auto-reply-panel';
            panel.style.cssText = `margin-top: 15px; padding: 15px; background: #f9f9f9; border: 1px dashed #0B99FF; border-radius: 5px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;`;

            panel.innerHTML = `
                <div style="flex: 1; min-width: 200px;">
                    <label style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;">自动回复内容:</label>
                    <input type="text" id="auto-reply-text" placeholder="输入要重复发送的内容..." style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                </div>
                <div style="width: 100px;">
                    <label style="font-size: 12px; color: #666; display: block; margin-bottom: 5px;">频率 (秒):</label>
                    <input type="number" id="auto-reply-interval" value="10" min="3" style="width: 100%; padding: 5px; border: 1px solid #ddd; border-radius: 3px;">
                </div>
                <div style="margin-top: 18px;">
                    <button id="auto-reply-toggle" style="padding: 6px 15px; background: #ccc; color: white; border: none; border-radius: 3px; cursor: pointer;">开启刷屏</button>
                </div>
                <div id="auto-reply-status" style="width: 100%; font-size: 12px; color: #ff0000;"></div>
            `;

            targetElement.appendChild(panel);
            document.getElementById('auto-reply-toggle').addEventListener('click', toggleAutoReply);
        }

        function toggleAutoReply() {
            const btn = document.getElementById('auto-reply-toggle');
            const textInput = document.getElementById('auto-reply-text');
            const intervalInput = document.getElementById('auto-reply-interval');
            const statusDiv = document.getElementById('auto-reply-status');

            if (isRunning) {
                clearInterval(autoTimer);
                isRunning = false;
                btn.innerText = "开启刷屏";
                btn.style.background = "#ccc";
                textInput.disabled = false;
                intervalInput.disabled = false;
                statusDiv.innerText = "已停止。";
            } else {
                const content = textInput.value;
                const interval = parseInt(intervalInput.value);
                if (!content) { alert("请输入内容！"); return; }
                if (interval < 3) { alert("间隔不能太短！"); return; }

                isRunning = true;
                btn.innerText = "停止刷屏";
                btn.style.background = "#ff4d4f";
                textInput.disabled = true;
                intervalInput.disabled = true;
                statusDiv.innerText = `运行中... 每 ${interval} 秒发送一次`;

                doReplyAction(content);
                autoTimer = setInterval(() => { doReplyAction(content); }, interval * 1000);
            }
        }

        function doReplyAction(content) {
            const textarea = document.querySelector('.replay-editor-area textarea');
            const submitBtn = document.querySelector('.replay-editor-btn');
            if (textarea && submitBtn) {
                textarea.value = content;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                setTimeout(() => {
                    submitBtn.click();
                    const statusDiv = document.getElementById('auto-reply-status');
                    if(statusDiv) statusDiv.innerText = `已发送: ${new Date().toLocaleTimeString()}`;
                }, 200);
            }
        }
    }


    // ==========================================
    // 模块C：章节测验 AI 助手 (Iframe)
    // ==========================================
    function initQuizHelper() {
        console.log("[UOOC全能助手] AI测验模块启动");
        let apiConfigs = GM_getValue('ai_configs_v2', [{ name: "DeepSeek", url: "https://api.deepseek.com/chat/completions", key: "", model: "deepseek-chat" }]);

        const css = `
            #uooc-ai-panel { position:fixed; top:20px; left:20px; width:360px; background:#fff; border:1px solid #ddd; z-index:999999; box-shadow:0 0 20px rgba(0,0,0,0.2); font-family:'Segoe UI', sans-serif; border-radius:8px; display:flex; flex-direction:column; max-height:85vh; }
            #uooc-ai-header { padding:12px; background:#2980b9; color:white; font-weight:bold; cursor:move; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center; user-select:none; }
            #uooc-ai-body { padding:10px; overflow-y:auto; flex:1; background:#f5f6fa; }
            #uooc-ai-ball { position:fixed; top:20px; left:20px; width:45px; height:45px; background:#2980b9; border-radius:50%; z-index:99999; display:none; align-items:center; justify-content:center; cursor:move; box-shadow:0 4px 15px rgba(0,0,0,0.3); color:white; font-weight:bold; user-select:none; border:2px solid white; }
            .ai-btn { width:100%; padding:10px; background:#2980b9; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; transition:0.2s; margin-bottom:10px; }
            .btn-group { display:flex; gap:10px; margin-bottom:10px; }
            .btn-group .ai-btn { margin-bottom:0; flex:1; }
            #ai-results-grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap:8px; margin-top:10px; }
            .ai-result-card { background:#fff; border-radius:6px; padding:8px; text-align:center; border:1px solid #dcdde1; box-shadow:0 2px 5px rgba(0,0,0,0.05); }
            .ai-name { font-size:11px; color:#7f8c8d; margin-bottom:5px; font-weight:bold; border-bottom:1px solid #eee; padding-bottom:3px;}
            .ai-ans { font-size:16px; font-weight:bold; color:#2c3e50; line-height:1.4; word-break: break-all; }
            #ai-config-area { display:none; background:#fff; padding:10px; border-radius:4px; border:1px solid #ddd; margin-bottom:10px; }
            .cfg-item { border-bottom:1px dashed #eee; padding-bottom:8px; margin-bottom:8px; }
            .cfg-input { width:100%; padding:4px; margin:2px 0; border:1px solid #ddd; border-radius:3px; font-size:11px; box-sizing:border-box; }
            .cfg-actions { display:flex; justify-content:space-between; margin-top:5px; align-items:center; }
            .btn-xs { padding:2px 8px; font-size:10px; cursor:pointer; border:1px solid #ddd; background:#fff; border-radius:3px; }
            .btn-del { color: red; border-color: #ffcccc; }
        `;
        GM_addStyle(css);

        const div = document.createElement('div');
        div.innerHTML = `
            <div id="uooc-ai-panel">
                <div id="uooc-ai-header">
                    <span>🏥 AI 答题助手</span>
                    <div><span id="ai-toggle-config" style="font-size:18px; cursor:pointer; margin-right:10px;">⚙️</span><span id="ai-min-btn" style="cursor:pointer;">➖</span></div>
                </div>
                <div id="uooc-ai-body">
                    <div id="ai-config-area"><div id="cfg-list"></div><button id="btn-add-cfg" class="btn-xs" style="width:100%;background:#2ecc71;color:white;padding:6px;margin-top:5px;">+ API</button><button id="btn-save-cfg" class="ai-btn" style="margin-top:10px; background:#27ae60;">💾 保存</button></div>
                    <div id="ai-status" style="font-size:12px; color:#666; margin-bottom:5px; text-align:center;">准备就绪</div>
                    <div class="btn-group"><button id="btn-copy" class="ai-btn" style="background:#27ae60;">📋 复制题目</button><button id="btn-run" class="ai-btn">⚡ AI 会诊</button></div>
                    <div id="ai-results-grid"></div>
                </div>
            </div>
            <div id="uooc-ai-ball" title="点击展开">AI</div>
        `;
        document.body.appendChild(div);

        const panel = document.getElementById('uooc-ai-panel');
        const ball = document.getElementById('uooc-ai-ball');
        const header = document.getElementById('uooc-ai-header');

        function makeDraggable(trigger, target, partner) {
            let isDragging = false, startX, startY, initLeft, initTop, hasMoved = false;
            trigger.addEventListener('mousedown', e => { isDragging=true; hasMoved=false; startX=e.clientX; startY=e.clientY; initLeft=target.offsetLeft; initTop=target.offsetTop; });
            document.addEventListener('mousemove', e => {
                if (isDragging) {
                    if (Math.abs(e.clientX - startX) > 3) hasMoved = true;
                    const l = initLeft + (e.clientX - startX) + 'px';
                    const t = initTop + (e.clientY - startY) + 'px';
                    target.style.left = l; target.style.top = t;
                    if(partner) { partner.style.left = l; partner.style.top = t; }
                }
            });
            document.addEventListener('mouseup', () => isDragging=false);
            return () => hasMoved;
        }
        makeDraggable(header, panel, ball);
        const checkBallMoved = makeDraggable(ball, ball, panel);

        document.getElementById('ai-min-btn').onclick = () => { panel.style.display='none'; ball.style.display='flex'; };
        ball.onclick = () => { if(!checkBallMoved()) { ball.style.display='none'; panel.style.display='flex'; } };

        // 配置与答题逻辑
        const configArea = document.getElementById('ai-config-area');
        const cfgList = document.getElementById('cfg-list');
        function renderConfigs() {
            cfgList.innerHTML = '';
            apiConfigs.forEach((cfg, index) => {
                const item = document.createElement('div');
                item.className = 'cfg-item';
                const headerDiv = document.createElement('div');
                headerDiv.className = 'cfg-actions';
                headerDiv.innerHTML = `<span style="font-size:11px;font-weight:bold;">模型 #${index + 1}</span>`;
                if (apiConfigs.length > 0) {
                    const delBtn = document.createElement('button');
                    delBtn.className = 'btn-xs btn-del'; delBtn.innerText = '删除';
                    delBtn.onclick = function() { if(confirm('确定删除?')) { apiConfigs.splice(index, 1); renderConfigs(); } };
                    headerDiv.appendChild(delBtn);
                }
                item.appendChild(headerDiv);
                const inputsDiv = document.createElement('div');
                inputsDiv.innerHTML = `<input type="text" class="cfg-input name" value="${cfg.name}" placeholder="名称"><input type="text" class="cfg-input url" value="${cfg.url}" placeholder="URL"><input type="password" class="cfg-input key" value="${cfg.key}" placeholder="Key"><input type="text" class="cfg-input model" value="${cfg.model}" placeholder="Model">`;
                item.appendChild(inputsDiv);
                cfgList.appendChild(item);
            });
        }
        document.getElementById('ai-toggle-config').onclick = () => { if(configArea.style.display==='none'||!configArea.style.display){ renderConfigs(); configArea.style.display='block'; } else { configArea.style.display='none'; } };
        document.getElementById('btn-add-cfg').onclick = () => { apiConfigs.push({name:"New AI",url:"",key:"",model:""}); renderConfigs(); };
        document.getElementById('btn-save-cfg').onclick = () => {
            apiConfigs = [];
            cfgList.querySelectorAll('.cfg-item').forEach(item => { apiConfigs.push({ name: item.querySelector('.name').value, url: item.querySelector('.url').value, key: item.querySelector('.key').value, model: item.querySelector('.model').value }); });
            GM_setValue('ai_configs_v2', apiConfigs); alert("保存成功"); configArea.style.display='none';
        };
        function extractQuestionsText() {
            let textBuffer = [];
            let questions = document.querySelectorAll('.queContainer');
            if(questions.length === 0) return document.body.innerText.replace(/\s+/g, ' ').substring(0, 5000);
            questions.forEach((q, idx) => {
                let indexText = q.querySelector('.index') ? q.querySelector('.index').innerText.trim() : "";
                let bodyText = q.querySelector('.ti-q-c') ? q.querySelector('.ti-q-c').innerText.trim() : "";
                let optionsText = "";
                q.querySelectorAll('.ti-a').forEach(opt => {
                    let label = opt.querySelector('.ti-a-i') ? opt.querySelector('.ti-a-i').innerText.trim() : "";
                    let val = opt.querySelector('.ti-a-c') ? opt.querySelector('.ti-a-c').innerText.trim() : "";
                    optionsText += `\n${label} ${val}`;
                });
                textBuffer.push(`${indexText} ${bodyText}${optionsText}`);
            });
            return textBuffer.join('\n\n----------------\n\n');
        }
        const statusDiv = document.getElementById('ai-status');
        document.getElementById('btn-copy').onclick = () => {
            const fullText = extractQuestionsText();
            if(fullText.length < 10) { statusDiv.innerText = "提取失败(太短)"; return; }
            GM_setClipboard(fullText); statusDiv.innerText = "✅ 已复制到剪贴板";
        };
        const resultGrid = document.getElementById('ai-results-grid');
        document.getElementById('btn-run').onclick = async () => {
            const validConfigs = apiConfigs.filter(c => c.key && c.url);
            if (validConfigs.length === 0) { alert("请配置API"); return; }
            let contentText = extractQuestionsText();
            if(contentText.length < 10) { statusDiv.innerText = "❌ 没提取到题目"; return; }
            statusDiv.innerText = `请求 ${validConfigs.length} 个模型中...`; resultGrid.innerHTML = '';
            validConfigs.forEach((cfg, idx) => {
                const card = document.createElement('div'); card.className = 'ai-result-card'; card.id = `card-${idx}`;
                card.innerHTML = `<div class="ai-name">${cfg.name}</div><div class="ai-ans" style="color:#999;">...</div>`; resultGrid.appendChild(card);
            });
            const promises = validConfigs.map((cfg, idx) => callSingleAI(cfg, contentText, idx));
            await Promise.allSettled(promises); statusDiv.innerText = "✅ 完成";
        };
        function callSingleAI(cfg, question, idx) {
            return new Promise((resolve, reject) => {
                const systemPrompt = `你是一个做题助手。用户发给你试题。请识别【每一道题】，并按顺序输出答案。格式要求：1. 请用逗号分隔每个答案（例如：A, B, √, C）。2. 不要输出解释。3. 只要答案。`;
                GM_xmlhttpRequest({
                    method: "POST", url: cfg.url, headers: { "Content-Type": "application/json", "Authorization": "Bearer " + cfg.key },
                    data: JSON.stringify({ model: cfg.model, messages: [ { role: "system", content: systemPrompt }, { role: "user", content: "试题：\n" + question } ], temperature: 0.1 }),
                    onload: function(response) {
                        const cardAns = document.querySelector(`#card-${idx} .ai-ans`);
                        if (response.status === 200) { try { const resJson = JSON.parse(response.responseText); let rawAns = resJson.choices[0].message.content.trim(); rawAns = rawAns.replace(/[。.]/g, ''); cardAns.innerText = rawAns; cardAns.style.color = "#e74c3c"; resolve(); } catch (e) { cardAns.innerText = "解析错"; reject(e); } } else { cardAns.innerText = "Err " + response.status; reject("Status " + response.status); }
                    }, onerror: function(err) { document.querySelector(`#card-${idx} .ai-ans`).innerText = "网路错"; reject(err); }
                });
            });
        }
    }

})();
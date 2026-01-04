// ==UserScript==
// @name         知行实验室答题助手
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  一键秒杀 mhlabs.cloudrange.cn 上的幻灯片与考试题目
// @author       LEN5010
// @match        *://mhlabs.cloudrange.cn/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559768/%E7%9F%A5%E8%A1%8C%E5%AE%9E%E9%AA%8C%E5%AE%A4%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/559768/%E7%9F%A5%E8%A1%8C%E5%AE%9E%E9%AA%8C%E5%AE%A4%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        bgImage: 'len5010.github.io/img/fll2.jpg',
        title: '知行实验室答题助手'
    };

    if (window.self === window.top) {
        initCustomStyle();
        initUI();
    }

    // 所有窗口（包括iframe）都监听消息
    window.addEventListener('message', function(event) {
        // 收到幻灯片破解指令
        if (event.data && event.data.action === 'CR_HACK_SLIDES') {
            runSlideSolver();
        }
        // 收到考试破解指令
        if (event.data && event.data.action === 'CR_HACK_EXAM') {
            runExamSolver();
        }
    });

    function runSlideSolver() {
        // 这里的 window 指的是 iframe (story.html)
        // parent 指的是父页面 (mhlabs.cloudrange.cn)
        console.log("[Slide] 正在尝试调用 parent.viewEnd()...");
        
        try {
            if (parent && typeof parent.viewEnd === 'function') {
                parent.viewEnd();
                console.log("[Slide] 调用成功！");
                // 只有确实调用成功了才提示，避免每个iframe都弹窗
                alert("已执行结束指令(parent.viewEnd)，请检查状态。");
            } 
        } catch (e) {
            console.error("[Slide] 调用出错:", e);
        }
    }

    async function runExamSolver() {
        function findComponent() {
            let root = document.getElementById('app') || document.querySelector('body > div');
            if (!root || !root.__vue__) return null;
            function traverse(vueInstance) {
                if (vueInstance.answerRecord) return vueInstance;
                for (let child of vueInstance.$children) {
                    let found = traverse(child);
                    if (found) return found;
                }
                return null;
            }
            return traverse(root.__vue__);
        }

        const sleep = (min, max) => new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1) + min)));

        var target = findComponent();
        if (!target) {
            // 只有在非幻灯片页面才提示找不到组件
            if (document.querySelector('.question-content') || document.querySelector('.exam-page')) {
                 alert("未找到考试组件，请确保进入了答题页面！");
            }
            return;
        }

        updateStatus("正在分析题目数据...", true);
        var details = target.answerRecord.details;
        var trainRecordId = target.trainRecordId;

        function getCombinations(options) {
            var result = [];
            var f = function(prefix, options) {
                for (var i = 0; i < options.length; i++) {
                    result.push(prefix.concat(options[i]));
                    f(prefix.concat(options[i]), options.slice(i + 1));
                }
            }
            f([], options);
            return result.sort((a, b) => a.length - b.length);
        }

        for (let i = 0; i < details.length; i++) {
            let item = details[i];
            if (item.answerFlag === '0') continue;

            updateStatus(`正在破解第 ${i+1}/${details.length} 题...`, true);
            let qType = item.question.choiceType;

            if (qType === "2") {
                if (item.answerFlag !== '0') {
                    item.answerOptionIds = "1";
                    try { 
                        await target.submitQuestion(item, false); 
                        target.typeover = false; 
                    } catch(e) {}
                    await sleep(500, 800);
                }

                let realAnswer = null;
                try {
                    let res = await target.$api.train.act.getQuestionPaper({ trainRecordId: trainRecordId });
                    if (res && res.data && res.data.details) {
                        let freshQuestion = res.data.details.find(d => d.id === item.id);
                        if (freshQuestion && freshQuestion.question) {
                            realAnswer = freshQuestion.question.questionAnswer;
                        }
                    }
                } catch(e) {}

                if (realAnswer) {
                    item.answerOptionIds = realAnswer;
                    try { 
                        await target.submitQuestion(item, false); 
                        target.typeover = false; 
                    } catch(e) {}
                    await sleep(300, 500);
                }
                continue;
            }

            if (!item.options || item.options.length === 0) continue;

            let combinations = [];
            if (qType === "1") {
                let combos = getCombinations(item.options);
                combinations = combos.map(combo => ({ ids: combo.map(opt => opt.id) }));
            } else {
                combinations = item.options.map(opt => ({ ids: opt.id }));
            }

            for (let attempt of combinations) {
                item.answerOptionIds = attempt.ids;
                try { 
                    await target.submitQuestion(item, false); 
                    target.typeover = false; 
                } catch (e) {
                    await sleep(500, 1000);
                }
                
                await sleep(200, 400); 

                if (item.answerFlag === '0') break;
            }
            await sleep(100, 200);
        }

        try { target.calculateTypeover(); } catch(e){}
        updateStatus("考试破解完成", true);
        
        let leftCount = details.filter(d => d.answerFlag !== '0').length;
        if (leftCount > 0) {
            alert(`破解完成，但仍有 ${leftCount} 道题未正确，请再次点击按钮补漏。`);
        } else {
            alert("所有题目破解完成！")
        }
    }

    function initCustomStyle() {
        const css = `
            #cr-hack-panel {
                position: fixed;
                top: 100px;
                right: 100px;
                width: 240px;
                z-index: 999999;
                background-color: #0d0000;
                background-image: ${CONFIG.bgImage ? `url("${CONFIG.bgImage}")` : 'none'};
                background-size: cover;
                background-position: center;
                border: 1px solid #4a0000;
                border-radius: 0; 
                box-shadow: 0 5px 15px rgba(0,0,0,0.6);
                font-family: "Microsoft YaHei", sans-serif;
                height: auto;
            }
            #cr-panel-overlay {
                background: rgba(0, 0, 0, 0.3); 
                padding: 10px;
                display: flex;
                flex-direction: column;
            }
            #cr-header {
                margin: -10px -10px 12px -10px;
                padding: 8px;
                background: rgba(40, 0, 0, 0.8);
                color: #cc9999;
                font-size: 13px;
                font-weight: bold;
                text-align: center;
                cursor: move;
                border-bottom: 1px solid #5c0000;
                user-select: none;
                letter-spacing: 1px;
            }
            .cr-btn {
                display: block;
                width: 130px;
                margin: 0 auto 8px auto;
                padding: 7px 0;
                border: 1px solid #5c0000;
                border-radius: 0;
                background: rgba(60, 10, 10, 0.85); 
                color: #dcb4b4;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
                backdrop-filter: blur(2px);
            }
            .cr-btn:hover {
                background: rgba(100, 20, 20, 0.95);
                border-color: #8a0a0a;
                color: #fff;
            }
            #cr-status {
                margin-top: 4px;
                font-size: 11px;
                color: rgba(255, 200, 200, 0.5);
                text-align: center;
            }
            .status-active {
                color: #ff3333 !important;
            }
        `;

        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    }

    function initUI() {
        const div = document.createElement('div');
        div.id = 'cr-hack-panel';
        div.innerHTML = `
            <div id="cr-panel-overlay">
                <div id="cr-header">${CONFIG.title}</div>
                <button id="btn-slides" class="cr-btn">秒杀幻灯片</button>
                <button id="btn-exam" class="cr-btn">解决考试题</button>
                <div id="cr-status">喜欢的话给我点个star吧:github.com/LEN5010/ZLA</div>
            </div>
        `;
        document.body.appendChild(div);

        const header = document.getElementById('cr-header');
        const panel = document.getElementById('cr-hack-panel');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = panel.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            
            panel.style.right = 'auto';
            panel.style.left = initialLeft + 'px';
            panel.style.top = initialTop + 'px';
            
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            panel.style.left = `${initialLeft + dx}px`;
            panel.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
        });

        document.getElementById('btn-slides').onclick = () => {
            updateStatus("正在广播幻灯片指令...", true);
            broadcastMessage('CR_HACK_SLIDES');
        };

        document.getElementById('btn-exam').onclick = () => {
            updateStatus("正在运行考试破解...", true);
            broadcastMessage('CR_HACK_EXAM');
        };
    }

    function updateStatus(text, active = false) {
        const el = document.getElementById('cr-status');
        if (el) {
            el.innerText = text;
            if (active) el.classList.add('status-active');
            else el.classList.remove('status-active');
        }
    }

    function broadcastMessage(action) {
        const frames = document.getElementsByTagName('iframe');
        for (let i = 0; i < frames.length; i++) {
            try {
                frames[i].contentWindow.postMessage({ action: action }, '*');
            } catch (e) {}
        }
        window.postMessage({ action: action }, '*');
    }

})();

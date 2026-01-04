// ==UserScript==
// @name         iTalent 在线考试自动答题助手
// @namespace    https://yangtaoer.com.cn/
// @version      3.5
// @description  点击上传题库粘贴JSON即可上传，高亮答案保留，显示检测率和解析率，支持窗口最小化和拖动吸附
// @author       yang
// @match        https://*.italent.cn/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      yangtaoer.com.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553528/iTalent%20%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553528/iTalent%20%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

	["visibilitychange","blur","focus","focusin","focusout"].forEach(e=>{
		window.addEventListener(e, e => {
			e.stopImmediatePropagation();
			e.stopPropagation();
			e.preventDefault();
			return false
		},true)
	});

    const CONFIG = {
        apiUrl: 'https://yangtaoer.com.cn/exam/api/parse',
        uploadUrl: 'https://yangtaoer.com.cn/exam/api/upload',
        checkInterval: 1000,
        version: 'v3.5'
    };

    let knownQuestions = new Set();
    let paused = false;
    let cachedResultJson = null;
    let totalQuestions = 0;
    let parsedQuestions = 0;

    window.addEventListener('DOMContentLoaded', () => {
        // === UI面板 ===
        const panel = document.createElement('div');
        panel.id = 'exam-helper-panel';
        panel.innerHTML = `
            <div id="exam-helper-header" style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-weight:bold;font-size:13px;">
                    iTalent考试助手 <span style="color:#ccc;">(${CONFIG.version})</span>
                </div>
                <button id="exam-helper-minimize" style="background:#df741a;color:#fff;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;line-height:14px;">–</button>
            </div>
            <div id="exam-helper-top-line" style="margin-top:4px;">
                <button id="exam-helper-toggle">⏸ 暂停检测</button>
                <button id="exam-helper-clear">🧹 清空标记</button>
                <br/>
                <span id="exam-helper-stats" style="margin-left:8px; font-size:12px;">检测:0，解析:0</span>
            </div>
            <div id="exam-helper-bottom-line" style="margin-top:4px;">
                <button id="exam-helper-upload">📤 上传题库</button>
                <span id="exam-helper-status" style="margin-left:8px; font-size:12px;">状态：未上传</span>
            </div>
        `;
        document.body.appendChild(panel);

        // === 小圆圈 ===
        const miniBtn = document.createElement('div');
        miniBtn.id = 'exam-helper-mini';
        miniBtn.innerText = '+';
        miniBtn.style.display = 'none';
        document.body.appendChild(miniBtn);

        // === 样式 ===
        GM_addStyle(`
            #exam-helper-panel {
                position: fixed;
                top: 80px;
                right: 30px;
                background: rgba(0,0,0,0.75);
                color: #fff;
                padding: 8px 10px;
                border-radius: 8px;
                z-index: 999999;
                font-size: 12px;
                box-shadow: 0 0 8px rgba(0,0,0,0.4);
                cursor: move;
                user-select: none;
            }
            #exam-helper-panel button {
                margin: 1px 3px;
                background: #2e8b57;
                color: white;
                border: none;
                padding: 3px 6px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            #exam-helper-panel button:hover {
                background: #3cb371;
            }
            #exam-helper-mini {
                position: fixed;
                top: 80px;
                right: 30px;
                width: 32px;
                height: 32px;
                background: rgba(0,0,0,0.75);
                color: #fff;
                border-radius: 50%;
                text-align: center;
                line-height: 32px;
                font-size: 20px;
                cursor: pointer;
                z-index: 999999;
                user-select: none;
            }
            .exam-highlight {
                background-color: #38e42c !important;
                position: relative;
            }
            .exam-highlight::after {
                content: "√";
                color: red;
                font-weight: bold;
                margin-left: 3px;
            }
        `);

        const statsEl = document.getElementById('exam-helper-stats');

        // === 拖动逻辑 ===
        function enableDrag(el) {
            let isDragging = false;
            let offsetX, offsetY;

            el.addEventListener('mousedown', e => {
                if (e.target.tagName === 'BUTTON') return;
                isDragging = true;
                offsetX = e.clientX - el.offsetLeft;
                offsetY = e.clientY - el.offsetTop;
                el.style.transition = 'none';
            });

            document.addEventListener('mousemove', e => {
                if (!isDragging) return;
                e.preventDefault();
                el.style.left = (e.clientX - offsetX) + 'px';
                el.style.top = (e.clientY - offsetY) + 'px';
                el.style.right = 'auto';
            });

            document.addEventListener('mouseup', () => {
                if (!isDragging) return;
                isDragging = false;
                snapToEdge(el);
            });
        }

        function snapToEdge(el) {
            const margin = 10;
            const rect = el.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            let left = rect.left;
            let top = rect.top;
            if (left + rect.width / 2 < vw / 2) {
                el.style.left = margin + 'px';
                el.style.right = 'auto';
            } else {
                el.style.left = 'auto';
                el.style.right = margin + 'px';
            }
            if (top < margin) el.style.top = margin + 'px';
            else if (top + rect.height > vh - margin) el.style.top = (vh - rect.height - margin) + 'px';
        }

        enableDrag(panel);
        enableDrag(miniBtn);

        // === 最小化/恢复 ===
        document.getElementById('exam-helper-minimize').onclick = () => {
            panel.style.display = 'none';
            miniBtn.style.display = 'block';
        };
        miniBtn.onclick = () => {
            miniBtn.style.display = 'none';
            panel.style.display = 'block';
        };

        // === UI交互 ===
        document.getElementById('exam-helper-toggle').onclick = () => {
            paused = !paused;
            document.getElementById('exam-helper-toggle').innerText = paused ? '▶ 开始检测' : '⏸ 暂停检测';
        };

        document.getElementById('exam-helper-clear').onclick = () => {
            document.querySelectorAll('.exam-highlight').forEach(e => e.classList.remove('exam-highlight'));
            knownQuestions.clear();
            totalQuestions = 0;
            parsedQuestions = 0;
            updateStats();
            showToast('✅ 已清空标记与缓存');
        };

        document.getElementById('exam-helper-upload').onclick = () => {
            const input = prompt('请粘贴考试结果JSON:');
            if (!input) return showToast('⚠️ 未输入任何内容', 'warn');
            try {
                cachedResultJson = JSON.parse(input);
            } catch (err) {
                console.error('解析JSON失败', err);
                return showToast('❌ JSON格式错误，请检查输入', 'error');
            }

            if (!confirm('确认上传题库吗？')) return;

            showToast('⏳ 正在上传题库...');
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.uploadUrl,
                headers: {'Content-Type':'application/json'},
                data: JSON.stringify(cachedResultJson),
                onload: res => {
                    if(res.status===200){
                        document.getElementById('exam-helper-status').innerText='状态：上传成功';
                        showToast('✅ 上传成功, 提升题库数量: ' + res.responseText);
                    } else {
                        showToast('❌ 上传失败', 'error');
                        document.getElementById('exam-helper-status').innerText='状态：上传失败';
                    }
                },
                onerror: err=>{
                    console.error('上传失败', err);
                    showToast('❌ 上传失败', 'error');
                    document.getElementById('exam-helper-status').innerText='状态：上传失败';
                }
            });
        };

        window.showToast = function(msg, type='info') {
            const div = document.createElement('div');
            div.innerText = msg;
            div.style.position = 'fixed';
            div.style.bottom = '100px';
            div.style.right = '40px';
            div.style.padding = '8px 16px';
            div.style.background = type==='error' ? '#ff4d4f' : type==='warn' ? '#faad14' : '#52c41a';
            div.style.color = '#fff';
            div.style.borderRadius = '6px';
            div.style.fontSize = '12px';
            div.style.zIndex = 999999;
            div.style.boxShadow = '0 0 6px rgba(0,0,0,0.3)';
            document.body.appendChild(div);
            setTimeout(()=>div.remove(), 2200);
        };

        // === 答题逻辑 ===
        function extractQuestions() {
            const titles = Array.from(document.getElementsByClassName('exam-topic-item-title-name'));
            const result = [];
            titles.forEach(el => {
                const text = el.innerText.trim();
                if(text && !knownQuestions.has(text)){
                    knownQuestions.add(text);
                    result.push(text);
                }
            });
            totalQuestions += result.length;
            updateStats();
            return result;
        }

        function highlightAnswer(index, answers){
            const wrapper = document.getElementsByClassName('exam-options-wrapper')[index];
            if(!wrapper) return;
            answers.forEach(ans=>{
                wrapper.childNodes.forEach(node=>{
                    try{
                        const content=node.childNodes[1]?.childNodes[0]?.innerText?.trim();
                        if(content===ans){
                            node.classList.add('exam-highlight');
                        }
                    }catch{}
                });
            });
        }

        function updateStats(){
            const parseRate = totalQuestions>0 ? ((parsedQuestions/totalQuestions)*100).toFixed(1) : 0;
            statsEl.innerText = `检测:${totalQuestions}，解析:${parsedQuestions} (${parseRate}%)`;
        }

        function queryAnswers(questions){
            if(questions.length===0) return;
            GM_xmlhttpRequest({
                method:'POST',
                url:CONFIG.apiUrl,
                headers:{'Content-Type':'application/json'},
                data:JSON.stringify(questions),
                onload: res=>{
                    try{
                        let data = JSON.parse(res.responseText).data||[];
                        parsedQuestions += data.filter(e => e.answer && e.answer.length > 0).length;
                        updateStats();
                        data.forEach((e,i)=> e.answer.length && highlightAnswer(i,e.answer));
                    }catch(err){
                        console.error('❌ 解析接口返回错误',err);
                    }
                },
                onerror: err=>console.error('❌ 查询接口请求失败',err)
            });
        }

        setInterval(()=>{
            if(paused) return;
            const newQuestions= extractQuestions();
            if(newQuestions.length>0) queryAnswers(newQuestions);
        }, CONFIG.checkInterval);

        console.log(`✅ [iTalent 答题助手 ${CONFIG.version}] 已启动`);
    });
})();

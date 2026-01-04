// ==UserScript==
// @name         广西普法考试题库录入
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  仅用来收集题库
// @author       MZJ
// @match        https://gxpf.sft.gxzf.gov.cn/*
// @require      https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560523/%E5%B9%BF%E8%A5%BF%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95%E9%A2%98%E5%BA%93%E5%BD%95%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/560523/%E5%B9%BF%E8%A5%BF%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95%E9%A2%98%E5%BA%93%E5%BD%95%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 核心数据 ===
    let questionBank = { single: {}, multi: {}, judge: {} };
    let isAutoMode = true; // 考试模式下的自动记录开关
    let lastActiveContainer = null;
    let shortcutKey = localStorage.getItem('gxpf_shortcut') || 'F2';

    // 练习模式专用变量
    const isPracticePage = location.href.includes('/portal/exam/wdlx/details');
    let isPracticeAutoRun = false; // 练习模式自动刷题开关
    let practiceInterval = 2; // 默认刷题间隔(秒)
    let practiceTimer = null; // 计时器句柄

    // === UI 初始化 ===
    function initUI() {
        if (document.getElementById('gm-panel')) return;

        const div = document.createElement('div');
        div.id = 'gm-panel';
        div.style.cssText = `
            position: fixed; top: 100px; right: 20px; z-index: 9999;
            background: #fff; border: 1px solid #ccc; padding: 15px;
            border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            width: 220px; font-family: sans-serif; user-select: none;
        `;

        const linkStyle = "color:#409EFF; cursor:pointer; text-decoration:underline; font-weight:bold;";
        const modeTitle = isPracticePage ? '<span style="color:#E6A23C;">[练习攒题模式]</span>' : '[考试录入模式]';

        div.innerHTML = `
            <h4 id="gm-header" style="margin:0 0 10px 0;text-align:center;border-bottom:1px solid #eee;padding-bottom:5px;cursor:move;color:#333;" title="按住此处拖动面板">
                ✥ 题库录入 v2.9<br><small style="font-size:12px;">${modeTitle}</small>
            </h4>

            ${!isPracticePage ? `
            <div style="margin-bottom:10px; font-size:13px; display:flex; justify-content:space-around;">
                <label style="cursor:pointer;"><input type="radio" name="gm-mode" value="auto" checked> 自动模式</label>
                <label style="cursor:pointer;"><input type="radio" name="gm-mode" value="manual"> 手动模式</label>
            </div>` : `
            <div style="margin-bottom:10px; padding:8px; background:#fdf6ec; border-radius:4px; border:1px solid #faecd8;">
                <label style="font-weight:bold; color:#E6A23C; display:block; margin-bottom:5px;">
                    <input type="checkbox" id="gm-practice-auto"> 🚀 开启自动刷题
                </label>
                <div style="font-size:12px; display:flex; align-items:center;">
                    <span>速度(秒/题):</span>
                    <input id="gm-practice-speed" type="number" value="${practiceInterval}" min="1" style="width:50px; margin-left:5px; border:1px solid #ccc; border-radius:3px; padding:2px;">
                </div>
            </div>
            `}

            <div style="font-size:12px;color:#666;margin-bottom:10px;text-align:center;line-height:1.8;">
                <div title="点击查看已录入列表">单选: <span id="count-single" style="${linkStyle}">0</span> 题</div>
                <div title="点击查看已录入列表">多选: <span id="count-multi" style="${linkStyle}">0</span> 题</div>
                <div title="点击查看已录入列表">判断: <span id="count-judge" style="${linkStyle}">0</span> 题</div>
            </div>

            ${!isPracticePage ? `
            <div id="manual-controls" style="display:none; margin-bottom:10px; padding:5px; background:#f0f9eb; border-radius:4px;">
                <button id="btn-manual-save" style="width:100%;margin-bottom:5px;padding:8px;cursor:pointer;background:#409EFF;color:white;border:none;border-radius:4px;">💾 记录当前题</button>
                <div style="font-size:12px; color:#666; text-align:center;">
                    快捷键: <input id="gm-shortcut-input" readonly value="${shortcutKey}" style="width:60px; text-align:center; cursor:pointer; border:1px solid #ccc; border-radius:3px;">
                </div>
            </div>` : ''}

            <button id="btn-export" style="width:100%;padding:8px;cursor:pointer;background:#67C23A;color:white;border:none;border-radius:4px;font-weight:bold;">📤 导出 Excel</button>
            <button id="btn-clear" style="width:100%;margin-top:5px;padding:5px;cursor:pointer;background:#F56C6C;color:white;border:none;border-radius:4px;">🗑️ 清空数据</button>

            <div style="margin-top:10px;font-size:12px;color:#999;">
                * <span style="background:#e1f3d8;color:#67c23a;padding:0 2px;">绿色背景</span> = 录入成功<br>
                ${isPracticePage ? '* 自动刷题将自动清洗答案' : '* 考试提交试卷自动导出'}
            </div>
        `;
        document.body.appendChild(div);

        makeDraggable(div);

        document.getElementById('btn-export').onclick = exportToExcel;
        document.getElementById('btn-clear').onclick = clearData;
        document.getElementById('count-single').onclick = () => showPreviewList('single');
        document.getElementById('count-multi').onclick = () => showPreviewList('multi');
        document.getElementById('count-judge').onclick = () => showPreviewList('judge');

        if (!isPracticePage) {
            document.getElementById('btn-manual-save').onclick = () => {
                if (lastActiveContainer) saveSpecificQuestion(lastActiveContainer, true);
                else showToast('请先点击一道题目的选项！', 'orange');
            };
            const radios = document.getElementsByName('gm-mode');
            radios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    isAutoMode = (e.target.value === 'auto');
                    document.getElementById('manual-controls').style.display = isAutoMode ? 'none' : 'block';
                });
            });
            setupShortcut();
        } else {
            initPracticeObserver();
            const autoChk = document.getElementById('gm-practice-auto');
            autoChk.onchange = (e) => {
                isPracticeAutoRun = e.target.checked;
                if (isPracticeAutoRun) {
                    processPracticeStep();
                } else {
                    clearTimeout(practiceTimer);
                }
            };
            const speedInput = document.getElementById('gm-practice-speed');
            speedInput.onchange = (e) => {
                let val = parseFloat(e.target.value);
                if (val < 0.5) val = 0.5;
                practiceInterval = val;
            };
        }

        loadFromStorage();
        updateCountDisplay();
    }

    // === 练习模式：自动刷题核心逻辑 ===
    function processPracticeStep() {
        if (!isPracticeAutoRun) return;

        const hasAnswer = document.body.innerText.includes('参考答案');
        if (hasAnswer) {
            tryClickNext();
            return;
        }

        const container = document.querySelector('.question-item');
        if (!container) {
            practiceTimer = setTimeout(processPracticeStep, 1000);
            return;
        }

        // === 修复点：加入 .judge-buttons button 选择器，支持点击判断题 ===
        const options = container.querySelectorAll('.el-radio, .el-checkbox, .judge-buttons button');

        if (options.length > 0) {
            // 随机点一个
            const firstOption = options[0];
            // 判断是否需要点击 (判断题按钮没有is-checked类，所以直接点)
            if (!firstOption.classList.contains('is-checked')) {
                firstOption.click();
            }
        }

        setTimeout(() => {
            if (!isPracticeAutoRun) return;
            const btns = document.querySelectorAll('button');
            let confirmBtn = null;
            btns.forEach(btn => {
                if (btn.innerText.includes('确定') && !btn.disabled) {
                    confirmBtn = btn;
                }
            });

            if (confirmBtn) {
                confirmBtn.click();
            } else {
                tryClickNext();
            }
        }, 500);
    }

    function tryClickNext() {
        if (!isPracticeAutoRun) return;
        const btns = document.querySelectorAll('button');
        let nextBtn = null;
        btns.forEach(btn => {
            if (btn.innerText.includes('下一个题') || btn.innerText.includes('下一题')) {
                nextBtn = btn;
            }
        });

        if (nextBtn) {
            nextBtn.click();
            practiceTimer = setTimeout(processPracticeStep, 2000);
        } else {
            console.log('未找到下一题按钮，可能已结束或未加载');
        }
    }

    // === 练习模式：监听答案出现 ===
    function initPracticeObserver() {
        console.log('正在初始化练习模式监听...');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        const text = node.innerText || "";
                        if (text.includes('参考答案')) {
                            handlePracticeAnswerReveal(node);
                        }
                        else if (node.querySelector) {
                            const answerEl = node.querySelector('font') || node;
                            if (answerEl.innerText && answerEl.innerText.includes('参考答案')) {
                                handlePracticeAnswerReveal(answerEl);
                            }
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handlePracticeAnswerReveal(node) {
        let fullText = node.innerText;
        if (fullText.includes('题目解析')) {
            fullText = fullText.split('题目解析')[0];
        }

        let rawAnswer = fullText.split(/：|:/)[1] || '';
        if (!rawAnswer) return;

        const cleanAnswer = rawAnswer.replace(/\s+/g, '').replace(/[、,，]/g, '').trim();
        console.log(`捕捉到参考答案: ${cleanAnswer}`);

        const container = document.querySelector('.question-item');
        if (container) {
            saveSpecificQuestion(container, true, cleanAnswer);
            if (isPracticeAutoRun) {
                console.log(`已记录，${practiceInterval}秒后进入下一题...`);
                clearTimeout(practiceTimer);
                practiceTimer = setTimeout(() => {
                    tryClickNext();
                }, practiceInterval * 1000);
            }
        }
    }

    // === 通用逻辑 ===
    function makeDraggable(element) {
        const header = document.getElementById('gm-header');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        header.onmousedown = (e) => {
            isDragging = true;
            header.style.cursor = 'grabbing';
            const rect = element.getBoundingClientRect();
            element.style.right = 'auto';
            element.style.left = rect.left + 'px';
            element.style.top = rect.top + 'px';
            initialLeft = rect.left;
            initialTop = rect.top;
            startX = e.clientX;
            startY = e.clientY;
        };
        document.onmousemove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            element.style.left = (initialLeft + e.clientX - startX) + 'px';
            element.style.top = (initialTop + e.clientY - startY) + 'px';
        };
        document.onmouseup = () => { isDragging = false; header.style.cursor = 'move'; };
    }

    function setupShortcut() {
        const input = document.getElementById('gm-shortcut-input');
        input.onclick = function() { this.value = '按键...'; this.style.borderColor = '#409EFF'; };
        input.onkeydown = function(e) {
            e.preventDefault(); e.stopPropagation();
            if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;
            let keys = [];
            if (e.ctrlKey) keys.push('Ctrl');
            if (e.altKey) keys.push('Alt');
            if (e.shiftKey) keys.push('Shift');
            keys.push(e.key.toUpperCase());
            const keyName = keys.join('+');
            this.value = keyName;
            shortcutKey = keyName;
            localStorage.setItem('gxpf_shortcut', keyName);
            this.blur();
            this.style.borderColor = '#ccc';
            showToast(`快捷键已更新: ${keyName}`);
        };
        document.addEventListener('keydown', (e) => {
            if (isAutoMode || isPracticePage) return;
            let keys = [];
            if (e.ctrlKey) keys.push('Ctrl');
            if (e.altKey) keys.push('Alt');
            if (e.shiftKey) keys.push('Shift');
            if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) keys.push(e.key.toUpperCase());
            if (keys.join('+') === shortcutKey) { e.preventDefault(); document.getElementById('btn-manual-save').click(); }
        });
    }

    document.addEventListener('click', function(e) {
        const submitBtn = e.target.closest('button.el-button--large') || e.target.closest('button.el-button--success');
        if (submitBtn) {
            const btnText = submitBtn.innerText.trim();
            if (btnText.includes('提交试卷') || btnText.includes('提交练习')) {
                console.log('监测到提交操作，准备导出...');
                setTimeout(() => { exportToExcel(); }, 200);
            }
        }

        if (isPracticePage) return;

        const qContainer = e.target.closest('.question-item');
        if (!qContainer) return;
        lastActiveContainer = qContainer;
        if (isAutoMode) setTimeout(() => { saveSpecificQuestion(qContainer); }, 300);
    }, true);

    // === 核心录入逻辑 ===
    function saveSpecificQuestion(container, isTriggered = false, overrideAnswer = null) {
        try {
            const typeEl = container.querySelector('.question-type');
            if (!typeEl) return;
            const typeText = typeEl.innerText;

            let type = '';
            if (typeText.includes('单选题')) type = 'single';
            else if (typeText.includes('多选题')) type = 'multi';
            else if (typeText.includes('判断题')) type = 'judge';
            else return;

            const stemEl = container.querySelector('.question-text');
            if (!stemEl) return;

            const fullText = stemEl.innerText.trim();
            const indexMatch = fullText.match(/^(\d+)[\.\、]/);
            const qIndex = indexMatch ? indexMatch[1] : null;
            const stem = fullText.replace(/^\d+[\.\、]\s*/, '').trim();

            let success = false;

            if (overrideAnswer) {
                if (type === 'single') success = saveSingle(container, stem, qIndex, overrideAnswer);
                if (type === 'multi') success = saveMulti(container, stem, qIndex, overrideAnswer);
                if (type === 'judge') success = saveJudge(container, stem, qIndex, overrideAnswer);
            } else {
                if (type === 'single') success = saveSingle(container, stem, qIndex);
                if (type === 'multi') success = saveMulti(container, stem, qIndex);
                if (type === 'judge') success = saveJudge(container, stem, qIndex);
            }

            if (success) {
                saveToStorage();
                updateCountDisplay();
                stemEl.style.backgroundColor = '#e1f3d8';
                stemEl.style.borderLeft = '5px solid #67C23A';
                stemEl.style.paddingLeft = '5px';
                if (isTriggered && !overrideAnswer) showToast("✅ 已保存");
                if (overrideAnswer) showToast(`✅ 答案捕获: ${overrideAnswer}`);
            } else if (isTriggered && !overrideAnswer) {
                showToast("未选中答案", "orange");
            }

        } catch (err) {
            console.error('录入失败', err);
        }
    }

    function saveSingle(container, stem, index, forceAns = null) {
        const optionsMap = { 'A': '', 'B': '', 'C': '', 'D': '' };
        let answer = forceAns || '';
        const labels = container.querySelectorAll('.el-radio');
        labels.forEach(label => {
            const input = label.querySelector('input');
            const textDiv = label.querySelector('.el-radio__label div');
            if (input && textDiv) {
                const val = input.value;
                optionsMap[val] = cleanText(textDiv.innerText);
                if (!forceAns && (label.classList.contains('is-checked') || input.checked)) answer = val;
            }
        });
        if (!answer) return false;
        questionBank.single[stem] = {
            stem: stem, index: index, A: optionsMap.A, B: optionsMap.B, C: optionsMap.C, D: optionsMap.D, answer: answer
        };
        return true;
    }

    function saveMulti(container, stem, index, forceAns = null) {
        const optionsMap = { 'A': '', 'B': '', 'C': '', 'D': '', 'E': '', 'F': '', 'G': '', 'H': '' };
        let answers = forceAns ? forceAns.split('') : [];

        const labels = container.querySelectorAll('.el-checkbox');
        labels.forEach(label => {
            const input = label.querySelector('input');
            const textDiv = label.querySelector('.el-checkbox__label div');
            if (input && textDiv) {
                const val = input.value;
                optionsMap[val] = cleanText(textDiv.innerText);
                if (!forceAns && (label.classList.contains('is-checked') || input.checked)) answers.push(val);
            }
        });
        if (answers.length === 0) return false;
        const finalAns = forceAns || answers.sort().join('');

        questionBank.multi[stem] = {
            stem: stem, index: index,
            A: optionsMap.A, B: optionsMap.B, C: optionsMap.C, D: optionsMap.D, E: optionsMap.E, F: optionsMap.F, G: optionsMap.G, H: optionsMap.H,
            answer: finalAns
        };
        return true;
    }

    function saveJudge(container, stem, index, forceAns = null) {
        let answer = forceAns || '';
        // 如果是手动模式，尝试从按钮样式读取
        if (!forceAns) {
            const btns = container.querySelectorAll('.judge-buttons button');
            btns.forEach(btn => {
                const cls = btn.className;
                const isSelected = cls.includes('success') || cls.includes('warning') || cls.includes('danger') || cls.includes('primary') || cls.includes('is-active') || cls.includes('is-checked');
                if (isSelected) {
                    const text = btn.innerText;
                    if (text.includes('对')) answer = '对';
                    if (text.includes('错')) answer = '错';
                }
            });
        }
        if (!answer) return false;
        questionBank.judge[stem] = { stem: stem, index: index, answer: answer };
        return true;
    }

    function cleanText(text) { return text ? text.replace(/^\s*[A-Z]、/, '').trim() : ''; }

    function updateCountDisplay() {
        document.getElementById('count-single').innerText = Object.keys(questionBank.single).length;
        document.getElementById('count-multi').innerText = Object.keys(questionBank.multi).length;
        document.getElementById('count-judge').innerText = Object.keys(questionBank.judge).length;
    }

    function showToast(msg, color) {
        const toast = document.createElement('div');
        toast.innerText = msg;
        toast.style.cssText = `
            position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
            background: ${color || 'rgba(0,0,0,0.8)'}; color: white; padding: 10px 20px;
            border-radius: 5px; z-index: 10001; transition: opacity 0.5s; pointer-events: none; font-size: 14px;
        `;
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 1500);
    }

    function showPreviewList(type) {
        const dataMap = questionBank[type];
        const list = Object.values(dataMap);
        if (list.length === 0) { alert('暂无数据'); return; }
        const oldModal = document.getElementById('gm-preview-modal');
        if (oldModal) oldModal.remove();
        const modal = document.createElement('div');
        modal.id = 'gm-preview-modal';
        modal.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 450px; max-height: 80vh; background: white; z-index: 10000;
            border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: flex; flex-direction: column; border: 1px solid #ccc;
        `;
        const titleMap = { 'single': '单选题', 'multi': '多选题', 'judge': '判断题' };
        let html = `
            <div style="padding:15px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center; background:#f5f7fa; border-radius:8px 8px 0 0;">
                <strong style="font-size:16px;">${titleMap[type]} (${list.length})</strong>
                <button id="gm-close-preview" style="border:none; background:transparent; font-size:20px; cursor:pointer;">×</button>
            </div>
            <div style="overflow-y:auto; flex:1; padding:10px;">
        `;
        list.sort((a, b) => (parseInt(a.index) || 0) - (parseInt(b.index) || 0));
        list.forEach((item, i) => {
            const idxDisplay = item.index ? `[第${item.index}题]` : `[#${i+1}]`;
            const shortStem = item.stem.length > 22 ? item.stem.substring(0, 22) + '...' : item.stem;
            html += `
                <div class="gm-preview-item" data-index="${item.index || ''}" data-stem="${item.stem.replace(/"/g, '&quot;')}"
                     style="padding:8px; border-bottom:1px solid #f0f0f0; cursor:pointer; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#999; margin-right:5px; font-size:12px;">${idxDisplay}</span>
                    <span style="flex:1;">${shortStem}</span>
                    <span style="color:#67C23A; font-weight:bold; margin-left:10px;">${item.answer}</span>
                </div>
            `;
        });
        html += `</div>`;
        modal.innerHTML = html;
        document.body.appendChild(modal);
        document.getElementById('gm-close-preview').onclick = () => modal.remove();
        const items = modal.querySelectorAll('.gm-preview-item');
        items.forEach(div => {
            div.onmouseover = () => { div.style.background = '#e6f1fc'; };
            div.onmouseout = () => { div.style.background = 'transparent'; };
            div.onclick = function() {
                const qIdx = this.getAttribute('data-index');
                const qStem = this.getAttribute('data-stem');
                if (jumpToQuestion(qIdx, qStem)) modal.remove();
                else alert('跳转失败：未在右侧题号栏找到对应题目，请尝试手动翻页查找。');
            };
        });
    }

    function jumpToQuestion(targetIndex, targetStem) {
        if (targetIndex) {
            const gridBtns = document.querySelectorAll('.question-grid .question-number');
            for (let btn of gridBtns) {
                const btnNum = parseInt(btn.innerText);
                if (btnNum == parseInt(targetIndex)) { btn.click(); setTimeout(() => highlightByStem(targetStem), 300); return true; }
            }
        }
        const result = highlightByStem(targetStem);
        if(!result && !targetIndex) alert('该题未记录题号，且不在当前视图中。');
        return result;
    }

    function highlightByStem(targetStem) {
        const stemEls = document.querySelectorAll('.question-text');
        for (let el of stemEls) {
            const pageStem = el.innerText.replace(/^\d+[\.\、]\s*/, '').trim();
            if (pageStem === targetStem) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const container = el.closest('.question-item');
                if (container) {
                    const originalBorder = container.style.border;
                    container.style.transition = "all 0.3s";
                    container.style.border = "3px solid #F56C6C";
                    container.style.boxShadow = "0 0 15px rgba(245, 108, 108, 0.6)";
                    setTimeout(() => { container.style.border = originalBorder; container.style.boxShadow = "none"; }, 2000);
                }
                return true;
            }
        }
        return false;
    }

    function saveToStorage() { localStorage.setItem('gxpf_v2_data', JSON.stringify(questionBank)); }
    function loadFromStorage() { try { const data = localStorage.getItem('gxpf_v2_data'); if(data) questionBank = JSON.parse(data); } catch(e){} }
    function clearData() { if(confirm('确认清空所有数据？')) { questionBank = { single: {}, multi: {}, judge: {} }; saveToStorage(); updateCountDisplay(); } }

    function exportToExcel() {
        if (!window.XLSX) { alert('导出插件未加载，请刷新页面重试！'); return; }
        const sCount = Object.keys(questionBank.single).length;
        const mCount = Object.keys(questionBank.multi).length;
        const jCount = Object.keys(questionBank.judge).length;
        if (sCount + mCount + jCount === 0) { console.log('数据为空，跳过导出'); return; }
        const wb = XLSX.utils.book_new();
        const sData = [['题目(stem)', 'A选项', 'B选项', 'C选项', 'D选项', '答案(填A/B/C/D)', '备注(可空)']];
        Object.values(questionBank.single).forEach(q => sData.push([q.stem, q.A, q.B, q.C, q.D, q.answer, '']));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sData), "单选题录入");
        const mData = [['题目(stem)', 'A选项', 'B选项', 'C选项', 'D选项', 'E选项(可空)', 'F选项(可空)', 'G选项(可空)', 'H选项(可空)', '答案(如ACD或A,C,D)', '备注(可空)']];
        Object.values(questionBank.multi).forEach(q => mData.push([q.stem, q.A, q.B, q.C, q.D, q.E, q.F, q.G, q.H, q.answer, '']));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(mData), "多选题录入");
        const jData = [['题目(stem)', '答案(填对/错 或 T/F)', '备注(可空)']];
        Object.values(questionBank.judge).forEach(q => jData.push([q.stem, q.answer, '']));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(jData), "判断题录入");
        XLSX.writeFile(wb, `题库导出_${new Date().toISOString().slice(0,10)}.xlsx`);
    }

    window.onload = initUI;
    setTimeout(initUI, 1000);

})();
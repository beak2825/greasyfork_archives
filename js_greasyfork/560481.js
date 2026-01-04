// ==UserScript==
// @name         正保会计网校练习中心自动答题（完美版）for 猪猪
// @version      2025.12.06
// @description  完整的自动答题解决方案
// @author       ameng000
// @match        https://jxjy.chinaacc.com/exam/*
// @match        https://jxjy.chinaacc.com/courseware/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1553320
// @downloadURL https://update.greasyfork.org/scripts/560481/%E6%AD%A3%E4%BF%9D%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%E7%BB%83%E4%B9%A0%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E5%AE%8C%E7%BE%8E%E7%89%88%EF%BC%89for%20%E7%8C%AA%E7%8C%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/560481/%E6%AD%A3%E4%BF%9D%E4%BC%9A%E8%AE%A1%E7%BD%91%E6%A0%A1%E7%BB%83%E4%B9%A0%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%88%E5%AE%8C%E7%BE%8E%E7%89%88%EF%BC%89for%20%E7%8C%AA%E7%8C%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('%c========================================', 'color: #2196F3; font-weight: bold');
    console.log('%c  正保会计网校自动答题脚本已启动  ', 'color: #4CAF50; font-size: 16px; font-weight: bold');
    console.log('%c========================================', 'color: #2196F3; font-weight: bold');

    // 存储管理
    const storage = {
        prefix: 'exam_auto_',
        get(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(this.prefix + key);
                return value || defaultValue;
            } catch (e) {
                console.error('读取失败:', e);
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(this.prefix + key, value);
                console.log(`✓ 保存 [${key}]`);
                return true;
            } catch (e) {
                console.error('保存失败:', e);
                return false;
            }
        }
    };

    // 生成试卷ID
    function getPaperId() {
        const html = document.documentElement.innerHTML;

        // 方法1: 使用ShowNum
        let match = html.match(/var ShowNum = '([^']+)'/);
        if (match && match[1]) {
            return 'paper_' + match[1].replace(/[^0-9,]/g, '').substring(0, 80);
        }

        // 方法2: 使用TIDList1
        match = html.match(/var TIDList1 = '([^']+)'/);
        if (match && match[1]) {
            return 'paper_' + match[1].replace(/[^0-9,]/g, '').substring(0, 80);
        }

        return 'paper_default';
    }

    // 提取所有题目ID
    function getAllQuestionIds() {
        const html = document.documentElement.innerHTML;
        const ids = [];

        // 优先使用ShowNum
        let match = html.match(/var ShowNum = '([^']+)'/);
        if (match) {
            const extracted = match[1].split(',').filter(id => id.trim() && /^\d+$/.test(id.trim()));
            ids.push(...extracted);
        }

        // 备用: 使用TIDList
        if (ids.length === 0) {
            for (let i = 1; i <= 4; i++) {
                match = html.match(new RegExp(`var TIDList${i} = '([^']+)'`));
                if (match) {
                    const extracted = match[1].split(',').filter(id => id.trim() && /^\d+$/.test(id.trim()));
                    ids.push(...extracted);
                }
            }
        }

        console.log(`找到 ${ids.length} 道题:`, ids);
        return ids;
    }

    // 清空所有选项
    function clearAllAnswers() {
        const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        inputs.forEach(input => input.checked = false);
        console.log('✓ 已清空所有选项');
    }

    // 获取题目类型
    function getQuestionType(qid) {
        const inputs = document.querySelectorAll(`input[name='qt${qid}']`);
        if (inputs.length === 0) return null;

        if (inputs[0].type === 'checkbox') return 'multiple';

        if (inputs.length === 2) {
            const values = Array.from(inputs).map(i => i.value);
            if (values.includes('Y') && values.includes('N')) {
                return 'judge';
            }
        }

        return 'single';
    }

    // 随机填充答案
    function randomFillAnswer(qid, type) {
        if (type === 'judge') {
            const answer = Math.random() > 0.5 ? 'Y' : 'N';
            const input = document.querySelector(`input[name='qt${qid}'][value='${answer}']`);
            if (input) input.checked = true;
        } else if (type === 'single') {
            const inputs = document.querySelectorAll(`input[name='qt${qid}']`);
            if (inputs.length > 0) {
                inputs[Math.floor(Math.random() * inputs.length)].checked = true;
            }
        } else if (type === 'multiple') {
            const inputs = document.querySelectorAll(`input[name='qt${qid}']`);
            const count = Math.min(inputs.length, Math.floor(Math.random() * 2) + 2);
            const selected = new Set();
            while (selected.size < count) {
                selected.add(Math.floor(Math.random() * inputs.length));
            }
            selected.forEach(idx => inputs[idx].checked = true);
        }
    }

    // 第一步: 随机填充并提交
    function firstSubmit() {
        console.log('%c===== 第一步: 获取答案 =====', 'color: #FF9800; font-weight: bold');

        clearAllAnswers();
        showMessage('正在随机填充并提交...', 'info');

        const qids = getAllQuestionIds();
        const paperId = getPaperId();

        // 保存试卷信息
        storage.set('current_paper_id', paperId);
        storage.set(paperId + '_question_ids', JSON.stringify(qids));
        storage.set('is_getting_answer', 'true');

        console.log('试卷ID:', paperId);
        console.log('题目数:', qids.length);

        // 随机填充
        qids.forEach(qid => {
            const type = getQuestionType(qid);
            if (type) randomFillAnswer(qid, type);
        });

        setTimeout(() => {
            showMessage('提交中,请等待跳转...', 'info');
            const btn = document.querySelector('#PostBtn');
            if (btn) {
                btn.click();
            } else {
                showMessage('找不到提交按钮', 'error');
            }
        }, 1000);
    }

    // 第二步: 从答案页面解析正确答案
    function parseAnswersFromResultPage() {
        console.log('%c===== 第二步: 解析答案 =====', 'color: #4CAF50; font-weight: bold');

        const paperId = storage.get('current_paper_id');
        if (!paperId) {
            console.error('未找到试卷ID');
            showMessage('错误: 未找到试卷ID', 'error');
            return;
        }

        const qidsJson = storage.get(paperId + '_question_ids', '[]');
        let qids = [];
        try {
            qids = JSON.parse(qidsJson);
        } catch (e) {
            console.error('解析题目列表失败:', e);
            return;
        }

        if (qids.length === 0) {
            console.error('题目列表为空');
            return;
        }

        console.log(`试卷: ${paperId}`);
        console.log(`题数: ${qids.length}`);

        const answers = {};
        let parsed = 0;

        qids.forEach((qid, idx) => {
            console.log(`\n[${idx + 1}/${qids.length}] 题目 ${qid}`);

            // 查找题目锚点
            const anchor = document.querySelector(`a[name='md${qid}']`);
            if (!anchor) {
                console.warn('  ⚠️ 找不到锚点');
                return;
            }

            // 找到容器
            const container = anchor.closest('tr') || anchor.closest('div.showclass');
            if (!container) {
                console.warn('  ⚠️ 找不到容器');
                return;
            }

            const text = container.textContent || container.innerText;

            // 匹配答案: 【正确答案】D 或 【正确答案】AB
            const patterns = [
                /【正确答案】([A-Z]+|对|错)/,
                /正确答案】([A-Z]+|对|错)/,
                /正确答案[：:]([A-Z]+|对|错)/i
            ];

            let found = null;
            for (let pattern of patterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    found = match[1].trim();
                    break;
                }
            }

            if (!found) {
                console.warn('  ⚠️ 未找到答案');
                return;
            }

            // 处理答案
            let answer = found;
            if (answer === '对') {
                answer = 'Y';
                console.log(`  ✓ 判断题: Y (对)`);
            } else if (answer === '错') {
                answer = 'N';
                console.log(`  ✓ 判断题: N (错)`);
            } else if (/^[A-Z]{2,}$/.test(answer)) {
                answer = answer.split('');
                console.log(`  ✓ 多选题: [${answer.join(', ')}]`);
            } else {
                console.log(`  ✓ 单选题: ${answer}`);
            }

            answers[qid] = answer;
            parsed++;
        });

        console.log(`\n解析完成: ${parsed}/${qids.length} 题`);
        console.table(answers);

        if (parsed > 0) {
            const cacheKey = paperId + '_answers';
            storage.set(cacheKey, JSON.stringify(answers));
            storage.set('is_getting_answer', 'false');

            showMessage(`✅ 成功保存 ${parsed}/${qids.length} 题答案!\n\n5秒后自动返回`, 'success');

            addReturnButton();

            setTimeout(() => {
                console.log('返回答题页面...');
                window.history.back();
            }, 5000);
        } else {
            showMessage('未能解析到任何答案', 'error');
            addReturnButton();
        }
    }

    // 第三步: 使用缓存答案填充
    function autoFillWithCache() {
        console.log('%c===== 第三步: 使用答案 =====', 'color: #4CAF50; font-weight: bold');

        const paperId = getPaperId();
        const cacheKey = paperId + '_answers';
        const cached = storage.get(cacheKey);

        console.log(`试卷: ${paperId}`);
        console.log(`缓存: ${cached ? '存在' : '不存在'}`);

        if (!cached || cached === '{}') {
            showMessage('❌ 没有缓存答案\n\n请先"获取正确答案"', 'warning');
            return;
        }

        let answers = {};
        try {
            answers = JSON.parse(cached);
        } catch (e) {
            console.error('解析缓存失败:', e);
            showMessage('缓存数据错误', 'error');
            return;
        }

        if (Object.keys(answers).length === 0) {
            showMessage('缓存为空', 'warning');
            return;
        }

        console.log('缓存答案:', answers);

        clearAllAnswers();

        const qids = getAllQuestionIds();
        let filled = 0;
        let missing = 0;

        qids.forEach(qid => {
            const answer = answers[qid];

            if (!answer) {
                console.warn(`题 ${qid}: 无缓存`);
                missing++;
                return;
            }

            const type = getQuestionType(qid);

            if (type === 'multiple' && Array.isArray(answer)) {
                answer.forEach(opt => {
                    const input = document.querySelector(`input[name='qt${qid}'][value='${opt}']`);
                    if (input) input.checked = true;
                });
                filled++;
                console.log(`题 ${qid}: [${answer.join(',')}]`);
            } else if (typeof answer === 'string') {
                const input = document.querySelector(`input[name='qt${qid}'][value='${answer}']`);
                if (input) {
                    input.checked = true;
                    filled++;
                    console.log(`题 ${qid}: ${answer}`);
                } else {
                    console.error(`题 ${qid}: 找不到选项 ${answer}`);
                }
            }
        });

        console.log(`填充: ${filled}/${qids.length}, 缺失: ${missing}`);

        if (filled > 0) {
            showMessage(`✅ 已填充 ${filled}/${qids.length} 题\n${missing > 0 ? `⚠️ ${missing}题无缓存\n` : ''}\n请检查后手动提交`, 'success');
        } else {
            showMessage('未能填充任何题目', 'error');
        }
    }

    // 添加返回按钮
    function addReturnButton() {
        const btn = document.createElement('button');
        btn.textContent = '🔙 立即返回';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 30px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 99999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        `;
        btn.onclick = () => window.history.back();
        document.body.appendChild(btn);
    }

    // 显示消息
    function showMessage(msg, type = 'info') {
        const colors = {
            success: '#4CAF50',
            info: '#2196F3',
            warning: '#FF9800',
            error: '#F44336'
        };

        const old = document.getElementById('autoAnswerMessage');
        if (old) old.remove();

        const div = document.createElement('div');
        div.id = 'autoAnswerMessage';
        div.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type]};
            color: white;
            padding: 20px 30px;
            border-radius: 8px;
            font-size: 16px;
            z-index: 99999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            text-align: center;
            white-space: pre-line;
            font-weight: bold;
        `;
        div.textContent = msg;
        document.body.appendChild(div);

        if (type !== 'error') {
            setTimeout(() => div.remove(), 8000);
        }
    }

    // 添加控制面板
    function addControlPanel() {
        const paperId = getPaperId();
        const cacheKey = paperId + '_answers';
        const cached = storage.get(cacheKey);

        let cacheCount = 0;
        if (cached && cached !== '{}') {
            try {
                cacheCount = Object.keys(JSON.parse(cached)).length;
            } catch (e) {}
        }

        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            background: white;
            border: 3px solid #2196F3;
            border-radius: 10px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            width: 260px;
        `;

        const qcount = getAllQuestionIds().length;

        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 15px; color: #2196F3; font-size: 18px; text-align: center;">
                🤖 猪猪的自动答题助手
            </div>
            <div style="margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 5px; font-size: 13px;">
                <div>📋 题数: <strong>${qcount}</strong></div>
                <div>💾 缓存: <strong style="color: ${cacheCount > 0 ? '#4CAF50' : '#F44336'}">${cacheCount}</strong> 题</div>
            </div>
            <button id="clearBtn" style="width: 100%; padding: 12px; margin: 6px 0; background: #9C27B0; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">
                🧹 清空表单
            </button>
            <button id="getBtn" style="width: 100%; padding: 14px; margin: 6px 0; background: #FF9800; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: bold;">
                🔍 获取正确答案
            </button>
            <button id="fillBtn" style="width: 100%; padding: 14px; margin: 6px 0; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 15px; font-weight: bold;">
                ✅ 使用缓存答案
            </button>
            <button id="viewBtn" style="width: 100%; padding: 12px; margin: 6px 0; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">
                👁️ 查看缓存
            </button>
            <button id="delBtn" style="width: 100%; padding: 12px; margin: 6px 0; background: #F44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold;">
                🗑️ 清除缓存
            </button>
            <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border-radius: 5px; font-size: 11px; color: #856404; line-height: 1.6;">
                <strong>📖 使用说明:</strong><br>
                1️⃣ 清空表单<br>
                2️⃣ 获取正确答案(自动提交)<br>
                3️⃣ 等待解析(自动返回)<br>
                4️⃣ 使用缓存答案(自动填充)<br>
                5️⃣ 检查后手动提交 ✅
            </div>
        `;

        document.body.appendChild(panel);

        // 事件绑定
        document.getElementById('clearBtn').onclick = () => {
            clearAllAnswers();
            showMessage('✓ 已清空', 'success');
        };

        document.getElementById('getBtn').onclick = () => {
            if (confirm('将随机填充并提交以获取答案\n\n确定继续吗?')) {
                firstSubmit();
            }
        };

        document.getElementById('fillBtn').onclick = () => {
            autoFillWithCache();
        };

        document.getElementById('viewBtn').onclick = () => {
            const data = storage.get(cacheKey);
            if (data && data !== '{}') {
                try {
                    const obj = JSON.parse(data);
                    console.log('%c=== 缓存答案 ===', 'color: #2196F3; font-weight: bold');
                    console.table(obj);
                    showMessage(`已在控制台输出\n共 ${Object.keys(obj).length} 题`, 'info');
                } catch (e) {
                    showMessage('缓存格式错误', 'error');
                }
            } else {
                showMessage('暂无缓存', 'warning');
            }
        };

        document.getElementById('delBtn').onclick = () => {
            if (confirm('确定清除缓存?')) {
                storage.set(cacheKey, '{}');
                showMessage('已清除', 'success');
                setTimeout(() => location.reload(), 1000);
            }
        };
    }

    // 判断页面类型
    function detectPageType() {
        const html = document.body.innerHTML;
        const text = document.body.textContent;

        const hasQuestions = document.querySelector('input[name^="qt"]');
        const hasSubmit = document.querySelector('#PostBtn');
        const hasAnswer = text.includes('正确答案') || text.includes('【正确答案】');

        if (hasQuestions && hasSubmit && !hasAnswer) {
            return 'exam';  // 答题页面
        }

        if (hasAnswer) {
            return 'result';  // 答案页面
        }

        return 'unknown';
    }

    // 初始化
    function init() {
        const pageType = detectPageType();
        console.log('页面类型:', pageType);

        if (pageType === 'exam') {
            console.log('✓ 答题页面');

            // 检查是否从答案页返回
            if (storage.get('is_getting_answer') === 'true') {
                console.log('检测到从答案页返回,清空表单');
                setTimeout(() => {
                    clearAllAnswers();
                    storage.set('is_getting_answer', 'false');
                }, 500);
            }

            addControlPanel();

        } else if (pageType === 'result') {
            console.log('✓ 答案页面');
            showMessage('检测到答案页面\n正在解析...', 'info');

            setTimeout(() => {
                parseAnswersFromResultPage();
            }, 2000);

        } else {
            console.log('⚠️ 未识别的页面');
        }
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }

    

})();

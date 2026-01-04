// ==UserScript==
// @name         PTA题目导出小帮手 
// @version      1.5.1
// @description  导出PTA中的题目到txt文本中，支持判断题、单选题、多选题、填空题。自动识别含代码的题目并提取代码。✅ 支持ID持久化保存。
// @author       摸鱼
// @match        https://pintia.cn/problem-sets/*/exam/problems/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1518138
// @downloadURL https://update.greasyfork.org/scripts/555190/PTA%E9%A2%98%E7%9B%AE%E5%AF%BC%E5%87%BA%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555190/PTA%E9%A2%98%E7%9B%AE%E5%AF%BC%E5%87%BA%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    if (document.getElementById('question-extractor')) {
        console.log('题目提取工具已存在');
        return;
    }

    const toolHTML = `
        <div id="question-extractor" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000;">
            <button id="main-btn" style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(45deg, #ff6b6b, #ffa500); color: white; border: none; font-size: 24px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease;">🔍</button>
            <div id="popup" style="position: absolute; bottom: 70px; right: 0; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); display: none; min-width: 300px;">
                <button id="settings-btn" style="width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;">⚙️ 设置ID</button>
                <div id="type-btns" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <button class="type-btn" data-type="TRUE_OR_FALSE" style="padding: 12px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s ease; font-size: 14px;">判断题</button>
                    <button class="type-btn" data-type="MULTIPLE_CHOICE" style="padding: 12px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s ease; font-size: 14px;">单选题</button>
                    <button class="type-btn" data-type="MULTIPLE_CHOICE_MORE_THAN_ONE_ANSWER" style="padding: 12px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s ease; font-size: 14px;">多选题</button>
                    <button class="type-btn" data-type="FILL_IN_THE_BLANK" style="padding: 12px; border: 2px solid #ddd; border-radius: 8px; background: white; cursor: pointer; transition: all 0.2s ease; font-size: 14px;">填空题</button>
                </div>
            </div>
        </div>

        <div id="settingsModal" style="display: none; position: fixed; z-index: 10001; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div id="modalContent" style="background-color: white; margin: 5% auto; padding: 20px; border-radius: 10px; width: 80%; max-width: 600px; max-height: 80vh; overflow-y: auto;">
                <span id="closeModal" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                <h3>导入或提取题目ID</h3>
                <div id="importStats" style="margin-bottom: 10px; font-size: 14px; min-height: 20px;"></div>
                <textarea id="id-input" placeholder='请粘贴完整的JSON数据（包含problemStatus），或手动输入每行一个 {"id":"...", "problemType":"..."}' style="width: 100%; height: 200px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-family: monospace; font-size: 12px; resize: vertical;"></textarea>
                <br>
                <button id="extractIds" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">📥 提取ID</button>
                <button id="saveIds" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">保存</button>
                <button id="cancelModal" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">取消</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toolHTML);

    // ✅ 新增：从 localStorage 加载已保存的题目
    let allProblems = [];
    try {
        const saved = localStorage.getItem('pta_question_ids');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                allProblems = parsed;
                console.log('✅ 已从 localStorage 加载', allProblems.length, '个题目ID');
            }
        }
    } catch (e) {
        console.warn('⚠️ 读取 localStorage 失败，使用空列表', e);
    }

    // 绑定事件
    document.getElementById('main-btn').addEventListener('click', togglePopup);
    document.getElementById('settings-btn').addEventListener('click', openSettings);
    document.getElementById('closeModal').addEventListener('click', closeSettings);
    document.getElementById('cancelModal').addEventListener('click', closeSettings);
    document.getElementById('saveIds').addEventListener('click', saveIds);
    document.getElementById('extractIds').addEventListener('click', extractIdsFromJson);
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            extractQuestions(this.dataset.type);
        });
    });

    document.addEventListener('click', function (event) {
        const popup = document.getElementById('popup');
        const mainBtn = document.getElementById('main-btn');
        if (event.target !== mainBtn && event.target !== popup && !popup.contains(event.target)) {
            popup.style.display = 'none';
        }
    });

    document.getElementById('settingsModal').addEventListener('click', function (event) {
        if (event.target === this) closeSettings();
    });

    function togglePopup() {
        const popup = document.getElementById('popup');
        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    }

    function openSettings() {
        document.getElementById('settingsModal').style.display = 'block';
        if (allProblems.length > 0) {
            const idText = allProblems.map(p => JSON.stringify(p)).join('\n');
            document.getElementById('id-input').value = idText;
        } else {
            document.getElementById('id-input').value = '';
        }
        document.getElementById('importStats').textContent = '';
    }

    function closeSettings() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    function updateImportStats(success = 0, total = 0, failed = 0) {
        const statsDiv = document.getElementById('importStats');
        if (total > 0) {
            statsDiv.textContent = `📊 尝试解析 ${total} 行，成功 ${success} 个，失败 ${failed} 个`;
            statsDiv.style.color = failed > 0 ? '#e74c3c' : '#27ae60';
        } else {
            statsDiv.textContent = '';
        }
    }

    function saveIds() {
        const input = document.getElementById('id-input').value;
        if (!input.trim()) {
            allProblems = [];
            // ✅ 清空 localStorage
            localStorage.removeItem('pta_question_ids');
            updateImportStats(0, 0, 0);
            alert('ID 列表已清空');
            closeSettings();
            return;
        }

        const lines = input.split(/\r?\n/).map(line => line.trim()).filter(line => line !== '');
        const result = [];
        const errors = [];

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.endsWith(',')) line = line.slice(0, -1);

            try {
                const obj = JSON.parse(line);
                if (obj.id && obj.problemType) {
                    result.push(obj);
                } else {
                    errors.push(`第 ${i + 1} 行：缺少 id 或 problemType 字段`);
                }
            } catch (e) {
                errors.push(`第 ${i + 1} 行：JSON 格式错误`);
            }
        }

        const successCount = result.length;
        const totalCount = lines.length;
        const failCount = errors.length;

        updateImportStats(successCount, totalCount, failCount);

        if (totalCount === 0) {
            alert('未输入任何内容');
        } else if (successCount === 0) {
            alert(`❌ 导入失败：${totalCount} 行均无效，请检查格式`);
        } else if (failCount > 0) {
            console.warn('导入失败的行：', errors);
            alert(`⚠️ 部分导入成功：${successCount} 个成功，${failCount} 个失败（详见控制台）`);
        } else {
            alert(`✅ 全部 ${successCount} 个题目ID 导入成功！`);
        }

        // ✅ 关键：保存到 localStorage
        allProblems = result;
        try {
            localStorage.setItem('pta_question_ids', JSON.stringify(allProblems));
        } catch (e) {
            console.error('❌ 无法保存到 localStorage', e);
            alert('⚠️ 浏览器存储受限，ID 本次有效，刷新后将丢失');
        }

        closeSettings();
    }

    function extractIdsFromJson() {
        const textarea = document.getElementById('id-input');
        const raw = textarea.value.trim();
        if (!raw) {
            alert('请先粘贴完整的JSON数据');
            return;
        }

        let data;
        try {
            data = JSON.parse(raw);
        } catch (e) {
            alert('JSON格式错误，请检查输入是否为有效的JSON对象');
            return;
        }

        let list = [];
        if (data.problemStatus && Array.isArray(data.problemStatus)) {
            list = data.problemStatus;
        } else if (Array.isArray(data)) {
            list = data;
        } else {
            alert('未找到 problemStatus 数组，请确保粘贴的是完整的响应数据');
            return;
        }

        const validTypes = new Set([
            'TRUE_OR_FALSE',
            'MULTIPLE_CHOICE',
            'MULTIPLE_CHOICE_MORE_THAN_ONE_ANSWER',
            'FILL_IN_THE_BLANK'
        ]);

        const extracted = list
            .filter(item => item.id && item.problemType && validTypes.has(item.problemType))
            .map(item => ({ id: item.id, problemType: item.problemType }));

        if (extracted.length === 0) {
            alert('未提取到有效题目（已跳过编程题等无效类型）');
            return;
        }

        const output = extracted.map(p => JSON.stringify(p) + ',').join('\n');
        textarea.value = output;

        alert(`✅ 成功提取 ${extracted.length} 个题目ID！已填入文本框。`);
    }

    function getProblemTypeName(type) {
        const map = {
            'TRUE_OR_FALSE': '判断题',
            'MULTIPLE_CHOICE': '单选题',
            'MULTIPLE_CHOICE_MORE_THAN_ONE_ANSWER': '多选题',
            'FILL_IN_THE_BLANK': '填空题'
        };
        return map[type] || type;
    }

    // ✅ 仅此处修改：增强 extractQuestions 以支持代码提取（原逻辑保留）
    function extractQuestions(problemType) {
    if (allProblems.length === 0) {
        alert('请先设置题目ID');
        openSettings();
        return;
    }

    const filteredIds = allProblems.filter(p => p.problemType === problemType).map(p => p.id);
    if (filteredIds.length === 0) {
        alert(`没有找到类型为 ${getProblemTypeName(problemType)} 的题目ID`);
        return;
    }

    const questions = [];
    let missingCount = 0;

    for (const id of filteredIds) {
        const problemElement = document.getElementById(id);
        if (!problemElement) {
            missingCount++;
            continue;
        }

        // 尝试查找“答案正确”状态
        let isCorrect = false;
        let statusSpan = null;

        // 根据你提供的结构：在 id 所在 div 的同级或子级找状态
        // 通常结构是：#id -> parent -> sibling with status
        // 更可靠的方式：在 #id 的祖先容器中找包含“答案正确”的 span
        const statusCandidates = problemElement.querySelectorAll('span, div');
        for (const candidate of statusCandidates) {
            if (candidate.innerText.trim() === '答案正确') {
                isCorrect = true;
                statusSpan = candidate;
                break;
            }
        }

        let questionText = '';
        let userAnswer = '';

        if (problemType === 'TRUE_OR_FALSE') {
    const xpath = `.//div[2]/div/div/div/p`;
    const result = document.evaluate(xpath, problemElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const elem = result.singleNodeValue;
    if (!elem) { missingCount++; continue; }
    questionText = elem.innerText.trim();

    const codeContainer = elem.parentElement?.querySelector('pre code');
    if (codeContainer) {
        const codeText = codeContainer.innerText.trim();
        questionText = '【题目描述】\n' + questionText + '\n\n【题目代码】\n' + codeText;
    }
    if (questionText && !/[。.!?？！]$/.test(questionText)) questionText += '。';

    // 构造括号内容
    let answerInParentheses = '(这里填正确或错误)';
    if (isCorrect) {
        const optionA = problemElement.querySelector('span:nth-of-type(1) input[type="radio"]');
        const optionB = problemElement.querySelector('span:nth-of-type(2) input[type="radio"]');
        if (optionA?.checked) {
            answerInParentheses = '(正确)';
        } else if (optionB?.checked) {
            answerInParentheses = '(错误)';
        }
    }

    questions.push(questionText + answerInParentheses);
} else if (problemType === 'FILL_IN_THE_BLANK') {
            const xpath = `.//div[2]/div/div/div/div/div/p`;
            const result = document.evaluate(xpath, problemElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const elem = result.singleNodeValue;
            if (!elem) { missingCount++; continue; }
            questionText = elem.innerText.trim();

            const container = elem.closest('div[role="region"]') || elem.parentElement;
            const codeContainer = container?.querySelector('pre code');
            if (codeContainer) {
                const codeText = codeContainer.innerText.trim();
                questionText = '【题目描述】\n' + questionText + '\n\n【题目代码】\n' + codeText;
            }
            questionText = questionText.replace(/【[\s\S]*?】/g, '{}');

            // 填空题一般不显示答案，即使答对也难提取（输入框 value 可能为空）
            // 所以暂不支持自动填答案，仅保留原格式
            questions.push(questionText);

        } else if (problemType === 'MULTIPLE_CHOICE') {
            const qXPath = `.//div[2]/div/div/div/p`;
            const qResult = document.evaluate(qXPath, problemElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const qElem = qResult.singleNodeValue;
            if (!qElem) { missingCount++; continue; }
            questionText = qElem.innerText.trim();

            const codeContainer = qElem.parentElement?.querySelector('pre code');
            if (codeContainer) {
                const codeText = codeContainer.innerText.trim();
                questionText = '【题目描述】\n' + questionText + '\n\n【题目代码】\n' + codeText;
            }

            const options = [];
            let selectedLabel = '';
            for (let i = 1; i <= 4; i++) {
                const optXPath = `.//div[2]/div/span/span[${i}]/label/div/div/div/div/p`;
                const optRes = document.evaluate(optXPath, problemElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const optElem = optRes.singleNodeValue;
                const optText = optElem ? optElem.innerText.trim() : '';
                const letter = String.fromCharCode(64 + i);
                options.push(letter + '. ' + optText);

                // 检查是否选中
                const input = problemElement.querySelector(`span:nth-of-type(${i}) input[type="radio"]`);
                if (isCorrect && input?.checked) {
                    selectedLabel = letter;
                }
            }

            const answerPart = isCorrect && selectedLabel ? `答案：${selectedLabel}` : '答案：';
            questions.push(questionText + '\n' + options.join('\n') + '\n' + answerPart);

        } else if (problemType === 'MULTIPLE_CHOICE_MORE_THAN_ONE_ANSWER') {
    const qXPath = `.//div[2]/div/div/div/p`;
    const qResult = document.evaluate(qXPath, problemElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const qElem = qResult.singleNodeValue;
    if (!qElem) { missingCount++; continue; }
    questionText = qElem.innerText.trim();

    const codeContainer = qElem.parentElement?.querySelector('pre code');
    if (codeContainer) {
        const codeText = codeContainer.innerText.trim();
        questionText = '【题目描述】\n' + questionText + '\n\n【题目代码】\n' + codeText;
    }

    const options = [];
    const selectedLabels = [];

    // 使用 XPath 获取所有选项文本和对应的 checkbox
    for (let i = 1; i <= 4; i++) {
        // 选项文本的 XPath（根据你原来的路径）
        const optXPath = `.//div[2]/div/div[2]/div[2]/label[${i}]/div/div/div/div/div/p`;
        const optRes = document.evaluate(optXPath, problemElement, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const optElem = optRes.singleNodeValue;
        const optText = optElem ? optElem.innerText.trim() : '';
        const letter = String.fromCharCode(64 + i);
        options.push(letter + '. ' + optText);

        // ✅ 用 XPath 获取对应的 checkbox 元素（关键修复！）
        const checkboxXPath = `.//div[2]/div/div[2]/div[2]/label[${i}]//input[@type='checkbox']`;
        const checkboxRes = document.evaluate(
            checkboxXPath,
            problemElement,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );
        const checkbox = checkboxRes.singleNodeValue;

        if (isCorrect && checkbox && checkbox.checked) {
            selectedLabels.push(letter);
        }
    }

    const answerPart = isCorrect && selectedLabels.length > 0
        ? `答案：${selectedLabels.sort().join(', ')}`
        : '答案：';
    questions.push(questionText + '\n' + options.join('\n') + '\n' + answerPart);
}
    }

    if (questions.length === 0) {
        const typeName = getProblemTypeName(problemType);
        alert(`未找到${typeName}内容，请确认题目已加载。`);
        return;
    }

    const content = questions.join('\n\n'); // 用两个换行分隔题目更清晰
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${problemType}_questions.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`✅ 成功提取 ${questions.length} 道${getProblemTypeName(problemType)}，${missingCount} 道未找到。文件已下载。`);
}

    console.log('题目提取工具已加载，点击右下角🔍按钮开始使用');
})();
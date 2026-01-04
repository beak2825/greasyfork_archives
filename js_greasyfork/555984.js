// ==UserScript==
// @name         问卷星智能分析器 - AI脚本生成助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  分析问卷结构并生成AI提示词，用于生成自动答题脚本
// @author       X
// @match        *://*.wjx.cn/*
// @match        *://*.wjx.top/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/555984/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%99%BA%E8%83%BD%E5%88%86%E6%9E%90%E5%99%A8%20-%20AI%E8%84%9A%E6%9C%AC%E7%94%9F%E6%88%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/555984/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%99%BA%E8%83%BD%E5%88%86%E6%9E%90%E5%99%A8%20-%20AI%E8%84%9A%E6%9C%AC%E7%94%9F%E6%88%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 分析问卷结构
    function analyzeQuestionnaire() {
        console.log('🔍 开始分析问卷结构...');

        // 查找题目容器
        const possibleSelectors = [
            '.field.ui-field-contain',
            '.field',
            'div[id^="div"]',
            '.ui-field-contain'
        ];

        let questions = [];
        let usedSelector = '';

        for (const selector of possibleSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                questions = Array.from(elements);
                usedSelector = selector;
                break;
            }
        }

        if (questions.length === 0) {
            alert('❌ 未找到问卷题目！');
            return null;
        }

        // 分析每个题目
        const analysisData = {
            url: window.location.href,
            timestamp: new Date().toLocaleString('zh-CN'),
            totalQuestions: questions.length,
            selector: usedSelector,
            questions: []
        };

        questions.forEach((q, i) => {
            // 获取题目文本
            const questionTextEl = q.querySelector('.topic-title, .field-label, .topichtml, [class*="title"]');
            const questionText = questionTextEl ? questionTextEl.textContent.trim().replace(/\s+/g, ' ') : `题目${i+1}`;

            // 提取题号
            const questionNumber = questionText.match(/^\d+[\.、]/) ? questionText.match(/^\d+/)[0] : (i + 1);

            // 分析题型
            const radios = q.querySelectorAll('input[type="radio"]');
            const checkboxes = q.querySelectorAll('input[type="checkbox"]');
            const textInputs = q.querySelectorAll('input[type="text"]');
            const textareas = q.querySelectorAll('textarea');
            const tbody = q.querySelector('tbody');
            const table = q.querySelector('table');
            const scaleLinks = q.querySelectorAll('.scale-rating a[val], a[val]');

            let questionType = '';
            let options = [];
            let extraInfo = {};

            // 判断题型并提取选项
            // 优先判断量表题（通过<a>标签）
            if (scaleLinks.length > 0 && !table) {
                questionType = 'scale';
                extraInfo.scaleCount = scaleLinks.length;
                extraInfo.selector = '.scale-rating a[val]';
                extraInfo.implementation = 'link_click'; // 标记为链接点击实现
                options = Array.from(scaleLinks).map((link, idx) => ({
                    index: idx,
                    value: link.getAttribute('val'),
                    text: link.textContent.trim()
                }));
            }
            // 矩阵题（表格+<a>标签）
            else if (table && tbody) {
                questionType = 'matrix';
                const rows = tbody.querySelectorAll('tr');

                // 过滤掉表头行
                const dataRows = Array.from(rows).filter(tr => {
                    // 排除表头行
                    if (tr.classList.contains('trlabel')) return false;
                    const links = tr.querySelectorAll('a[val], td a');
                    return links.length > 0;
                });

                extraInfo.totalRows = rows.length;
                extraInfo.dataRows = dataRows.length;
                extraInfo.selector = 'a[val], td a';
                extraInfo.implementation = 'link_click'; // 标记为链接点击实现
                extraInfo.rowFilter = '排除 class="trlabel" 的表头行';

                // 获取第一行的列数作为参考
                if (dataRows.length > 0) {
                    const firstRowLinks = dataRows[0].querySelectorAll('a[val], td a');
                    extraInfo.columns = firstRowLinks.length;

                    // 获取列标签（从表头）
                    const headerRow = rows[0];
                    if (headerRow.classList.contains('trlabel')) {
                        const headerCells = headerRow.querySelectorAll('td');
                        extraInfo.columnLabels = Array.from(headerCells).slice(1).map(cell => cell.textContent.trim());
                    }
                }

                // 提取行标签
                options = dataRows.map((row, idx) => {
                    const label = row.querySelector('td:first-child')?.textContent.trim() || `行${idx+1}`;
                    const links = row.querySelectorAll('a[val], td a');
                    return {
                        index: idx,
                        label: label,
                        optionCount: links.length
                    };
                });
            }
            // 多选题
            else if (checkboxes.length > 0) {
                questionType = 'checkbox';
                extraInfo.implementation = 'mouse_event_simulation'; // 标记为鼠标事件模拟
                extraInfo.clickStrategy = '模拟完整鼠标点击序列（mousedown -> mouseup -> click）';
                extraInfo.verification = '点击后验证checkbox.checked状态，失败则尝试点击父元素';
                options = Array.from(checkboxes).map((cb, idx) => {
                    const label = cb.closest('label')?.textContent.trim() ||
                                 cb.parentElement.querySelector('label')?.textContent.trim() ||
                                 cb.nextElementSibling?.textContent?.trim() ||
                                 `选项${idx+1}`;
                    return {
                        index: idx,
                        text: label,
                        id: cb.id,
                        name: cb.name,
                        value: cb.value
                    };
                });
            }
            // 单选题
            else if (radios.length > 0) {
                questionType = 'radio';
                options = Array.from(radios).map((radio, idx) => {
                    const label = radio.closest('label')?.textContent.trim() ||
                                 radio.parentElement.querySelector('label')?.textContent.trim() ||
                                 `选项${idx+1}`;
                    return {
                        index: idx,
                        text: label,
                        id: radio.id,
                        name: radio.name,
                        value: radio.value
                    };
                });
            }
            // 填空题
            else if (textareas.length > 0 || textInputs.length > 0) {
                questionType = 'text';
                extraInfo.inputType = textareas.length > 0 ? 'textarea' : 'input';
            }
            // 未知题型
            else {
                questionType = 'unknown';
            }

            analysisData.questions.push({
                questionIndex: i,
                questionNumber: questionNumber,
                questionText: questionText,
                questionType: questionType,
                optionCount: options.length,
                options: options,
                extraInfo: extraInfo,
                domInfo: {
                    className: q.className,
                    id: q.id || null
                }
            });
        });

        console.log('✅ 分析完成！', analysisData);
        return analysisData;
    }

    // 生成AI提示词
    function generateAIPrompt(analysisData) {
        if (!analysisData) return '';

        let prompt = `# 问卷星自动填答脚本生成请求

## 问卷信息
- **URL**: ${analysisData.url}
- **分析时间**: ${analysisData.timestamp}
- **题目总数**: ${analysisData.totalQuestions}
- **题目容器选择器**: \`${analysisData.selector}\`

## 题目结构详情

`;

        analysisData.questions.forEach((q) => {
            prompt += `### 题目 ${q.questionNumber}: ${q.questionText}\n`;
            prompt += `- **题型**: ${getQuestionTypeName(q.questionType)}\n`;
            prompt += `- **数组索引**: ${q.questionIndex}\n`;

            if (q.questionType === 'radio') {
                prompt += `- **选项数量**: ${q.optionCount}\n`;
                prompt += `- **选项列表**:\n`;
                q.options.forEach(opt => {
                    prompt += `  ${opt.index}. ${opt.text}\n`;
                });
                prompt += `- **建议答案**: 索引 ${Math.floor(q.optionCount / 2)} (中间选项)\n`;
                prompt += `- **⚠️ 重要实现细节**:\n`;
                prompt += `  - **多重触发机制**: 使用多种方式确保选项被正确选中\n`;
                prompt += `  - **三重保障**: 1) 设置 checked 属性 2) 点击 label 3) 点击 radio 本身\n`;
                prompt += `  - **事件触发**: 触发所有相关事件（click, change, input, blur）\n`;
                prompt += `\n`;
                prompt += `  **示例代码**:\n`;
                prompt += `  \`\`\`javascript\n`;
                prompt += `  function fillRadio(questionDiv, answerIndex) {\n`;
                prompt += `      const radios = questionDiv.querySelectorAll('input[type="radio"]');\n`;
                prompt += `      if (radios.length > answerIndex) {\n`;
                prompt += `          const radio = radios[answerIndex];\n`;
                prompt += `          // 方法1: 直接设置checked\n`;
                prompt += `          radio.checked = true;\n`;
                prompt += `          // 方法2: 点击label\n`;
                prompt += `          const label = radio.closest('label') || radio.parentElement.querySelector('label');\n`;
                prompt += `          if (label) label.click();\n`;
                prompt += `          // 方法3: 点击radio本身\n`;
                prompt += `          radio.click();\n`;
                prompt += `          // 触发所有事件\n`;
                prompt += `          triggerEvents(radio);\n`;
                prompt += `          return true;\n`;
                prompt += `      }\n`;
                prompt += `      return false;\n`;
                prompt += `  }\n`;
                prompt += `  \`\`\`\n`;
            }

            else if (q.questionType === 'checkbox') {
                prompt += `- **选项数量**: ${q.optionCount}\n`;
                prompt += `- **选项列表**:\n`;
                q.options.forEach(opt => {
                    prompt += `  ${opt.index}. ${opt.text}\n`;
                });
                const suggestedCount = Math.min(3, q.optionCount);
                const suggestedIndexes = Array.from({length: suggestedCount}, (_, i) => i);
                prompt += `- **建议答案**: 索引数组 [${suggestedIndexes.join(', ')}] (前${suggestedCount}个选项)\n`;
                prompt += `- **⚠️ 重要实现细节**:\n`;
                prompt += `  - **必须使用模拟真实用户点击**: 使用 MouseEvent 模拟完整的鼠标事件序列\n`;
                prompt += `  - **事件序列**: mousedown → mouseup → click\n`;
                prompt += `  - **验证机制**: 点击后必须检查 checkbox.checked 状态\n`;
                prompt += `  - **失败重试**: 如果checkbox未选中，尝试点击父元素（div/label/li）\n`;
                prompt += `  - **延迟处理**: 每个选项点击后等待150ms，所有选项完成后额外等待500ms\n`;
                prompt += `\n`;
                prompt += `  **示例代码**:\n`;
                prompt += `  \`\`\`javascript\n`;
                prompt += `  async function fillCheckbox(questionDiv, answerIndexes) {\n`;
                prompt += `      const checkboxes = questionDiv.querySelectorAll('input[type="checkbox"]');\n`;
                prompt += `      for (const index of answerIndexes) {\n`;
                prompt += `          const checkbox = checkboxes[index];\n`;
                prompt += `          // 模拟完整鼠标事件\n`;
                prompt += `          ['mousedown', 'mouseup', 'click'].forEach(eventType => {\n`;
                prompt += `              const event = new MouseEvent(eventType, {\n`;
                prompt += `                  view: window, bubbles: true, cancelable: true\n`;
                prompt += `              });\n`;
                prompt += `              checkbox.dispatchEvent(event);\n`;
                prompt += `          });\n`;
                prompt += `          await delay(150);\n`;
                prompt += `          // 验证是否选中\n`;
                prompt += `          if (!checkbox.checked) {\n`;
                prompt += `              const parent = checkbox.closest('div, label, li');\n`;
                prompt += `              if (parent) parent.click();\n`;
                prompt += `          }\n`;
                prompt += `      }\n`;
                prompt += `      await delay(500); // 额外延迟\n`;
                prompt += `  }\n`;
                prompt += `  \`\`\`\n`;
            }

            else if (q.questionType === 'matrix') {
                prompt += `- **矩阵行数**: ${q.extraInfo.dataRows}\n`;
                prompt += `- **每行列数**: ${q.extraInfo.columns}\n`;
                if (q.extraInfo.columnLabels) {
                    prompt += `- **列标签**: ${q.extraInfo.columnLabels.join(', ')}\n`;
                }
                prompt += `- **行标签**:\n`;
                q.options.forEach(opt => {
                    prompt += `  ${opt.index}. ${opt.label} (${opt.optionCount}个选项)\n`;
                });
                const suggestedAnswers = Array(q.extraInfo.dataRows).fill(Math.floor(q.extraInfo.columns / 2));
                prompt += `- **建议答案**: [${suggestedAnswers.join(', ')}] (每行选择中间列)\n`;
                prompt += `- **⚠️ 重要实现细节**:\n`;
                prompt += `  - **选择器**: 使用 \`${q.extraInfo.selector}\` 查找 <a> 标签，不要使用 radio 按钮\n`;
                prompt += `  - **过滤表头**: ${q.extraInfo.rowFilter}\n`;
                prompt += `  - **点击方式**: 直接点击 <a> 标签链接\n`;
                prompt += `  - **行定位**: 先获取所有 tr，过滤后得到有效数据行\n`;
                prompt += `\n`;
                prompt += `  **示例代码**:\n`;
                prompt += `  \`\`\`javascript\n`;
                prompt += `  function fillMatrix(questionDiv, answers) {\n`;
                prompt += `      const tbody = questionDiv.querySelector('tbody');\n`;
                prompt += `      const allRows = Array.from(tbody.querySelectorAll('tr'));\n`;
                prompt += `      // 过滤掉表头行\n`;
                prompt += `      const dataRows = allRows.filter(tr => {\n`;
                prompt += `          if (tr.classList.contains('trlabel')) return false;\n`;
                prompt += `          const links = tr.querySelectorAll('${q.extraInfo.selector}');\n`;
                prompt += `          return links.length > 0;\n`;
                prompt += `      });\n`;
                prompt += `      answers.forEach((answerIndex, rowIndex) => {\n`;
                prompt += `          if (rowIndex < dataRows.length) {\n`;
                prompt += `              const row = dataRows[rowIndex];\n`;
                prompt += `              const links = row.querySelectorAll('${q.extraInfo.selector}');\n`;
                prompt += `              if (links.length > answerIndex) {\n`;
                prompt += `                  links[answerIndex].click();\n`;
                prompt += `                  triggerEvents(links[answerIndex]);\n`;
                prompt += `              }\n`;
                prompt += `          }\n`;
                prompt += `      });\n`;
                prompt += `  }\n`;
                prompt += `  \`\`\`\n`;
            }

            else if (q.questionType === 'scale') {
                prompt += `- **量表选项数**: ${q.extraInfo.scaleCount}\n`;
                prompt += `- **量表选项**:\n`;
                q.options.forEach(opt => {
                    prompt += `  ${opt.index}. ${opt.text} (val="${opt.value}")\n`;
                });
                const midIndex = Math.floor(q.extraInfo.scaleCount / 2);
                prompt += `- **建议答案**: 索引 ${midIndex} (中间值)\n`;
                prompt += `- **⚠️ 重要实现细节**:\n`;
                prompt += `  - **选择器**: 使用 \`${q.extraInfo.selector}\` 查找 <a> 标签\n`;
                prompt += `  - **不要使用 radio**: 量表题不是通过 radio 按钮实现的\n`;
                prompt += `  - **点击方式**: 直接点击 <a> 标签链接\n`;
                prompt += `\n`;
                prompt += `  **示例代码**:\n`;
                prompt += `  \`\`\`javascript\n`;
                prompt += `  function fillScale(questionDiv, value) {\n`;
                prompt += `      const scaleLinks = questionDiv.querySelectorAll('${q.extraInfo.selector}');\n`;
                prompt += `      if (scaleLinks.length > value) {\n`;
                prompt += `          const link = scaleLinks[value];\n`;
                prompt += `          link.click();\n`;
                prompt += `          triggerEvents(link);\n`;
                prompt += `      }\n`;
                prompt += `  }\n`;
                prompt += `  \`\`\`\n`;
            }

            else if (q.questionType === 'text') {
                prompt += `- **输入类型**: ${q.extraInfo.inputType}\n`;
                prompt += `- **建议答案**: "这是一个示例回答" (根据题目含义自定义)\n`;
            }

            prompt += `\n`;
        });

        prompt += `\n## 生成要求

请基于以上问卷结构分析，生成一个完整的Tampermonkey脚本，要求：

### 1. 核心实现细节（必须严格遵守）

#### 工具函数 - 强制触发事件
\`\`\`javascript
function triggerEvents(element) {
    // 触发所有相关DOM事件
    const events = ['click', 'change', 'input', 'blur'];
    events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
    });

    // 触发jQuery事件（问卷星可能使用）
    if (window.jQuery) {
        try {
            window.jQuery(element).trigger('click').trigger('change');
        } catch(e) {}
    }
}
\`\`\`

#### 单选题实现
\`\`\`javascript
function fillRadio(questionDiv, answerIndex) {
    const radios = questionDiv.querySelectorAll('input[type="radio"]');

    if (radios.length > answerIndex) {
        const radio = radios[answerIndex];

        // 方法1: 直接设置checked属性
        radio.checked = true;

        // 方法2: 点击关联的label
        const label = radio.closest('label') || radio.parentElement.querySelector('label');
        if (label) {
            label.click();
        }

        // 方法3: 点击radio本身
        radio.click();

        // 方法4: 强制触发所有事件
        triggerEvents(radio);

        return true;
    }
    return false;
}
\`\`\`

#### 多选题实现
\`\`\`javascript
async function fillCheckbox(questionDiv, answerIndexes) {
    const checkboxes = questionDiv.querySelectorAll('input[type="checkbox"]');
    let successCount = 0;

    for (const index of answerIndexes) {
        if (index >= checkboxes.length) continue;
        const checkbox = checkboxes[index];

        try {
            // 模拟完整鼠标事件序列
            const mouseEvents = ['mousedown', 'mouseup', 'click'];
            for (const eventType of mouseEvents) {
                const event = new MouseEvent(eventType, {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                checkbox.dispatchEvent(event);
            }

            // 等待DOM更新
            await delay(150);

            // 验证是否选中
            if (checkbox.checked) {
                successCount++;
            } else {
                // 失败则尝试点击父元素
                const parent = checkbox.closest('div, label, li');
                if (parent) {
                    parent.click();
                    await delay(100);
                    if (checkbox.checked) successCount++;
                }
            }
        } catch (error) {
            console.error(\`选项 \${index + 1} 点击失败:\`, error);
        }
    }

    await delay(500); // 多选题需要额外延迟
    return successCount > 0;
}
\`\`\`

#### 量表题实现
\`\`\`javascript
function fillScale(questionDiv, value) {
    // 使用 <a> 标签选择器，不要使用 radio
    const scaleLinks = questionDiv.querySelectorAll('.scale-rating a[val]');

    if (scaleLinks.length > value) {
        const link = scaleLinks[value];
        link.click();
        triggerEvents(link);
        return true;
    }
    return false;
}
\`\`\`

#### 矩阵题实现
\`\`\`javascript
function fillMatrix(questionDiv, answers) {
    const tbody = questionDiv.querySelector('tbody');
    if (!tbody) return false;

    const allRows = Array.from(tbody.querySelectorAll('tr'));

    // 过滤掉表头行（class="trlabel"）
    const dataRows = allRows.filter(tr => {
        if (tr.classList.contains('trlabel')) return false;
        const links = tr.querySelectorAll('a[val], td a');
        return links.length > 0;
    });

    let filledCount = 0;
    answers.forEach((answerIndex, rowIndex) => {
        if (rowIndex < dataRows.length && answerIndex !== undefined) {
            const row = dataRows[rowIndex];
            const links = row.querySelectorAll('a[val], td a');

            if (links.length > answerIndex) {
                const link = links[answerIndex];
                link.click();
                triggerEvents(link);
                filledCount++;
            }
        }
    });

    return filledCount > 0;
}
\`\`\`

#### 填空题实现
\`\`\`javascript
function fillText(questionDiv, text) {
    const textarea = questionDiv.querySelector('textarea');
    const input = questionDiv.querySelector('input[type="text"]');
    const target = textarea || input;

    if (target) {
        target.value = text;
        target.focus();
        triggerEvents(target);
        target.blur();
        return true;
    }
    return false;
}
\`\`\`

### 2. 脚本整体结构
- 包含完整的工具函数（delay, randomChoice, randomInt, triggerEvents）
- 包含上述所有填写函数（fillRadio, fillCheckbox, fillMatrix, fillScale, fillText）
- 在主 autoFill() 函数的循环中，根据题目索引调用对应函数
- 添加美观的控制面板UI
- 支持随机答案和自动提交选项

### 3. 答案策略
- 根据上述每道题的"建议答案"设置默认值
- 支持随机模式时，在合理范围内随机选择
- 文本题提供多个备选答案供随机选择

### 4. 用户体验
- 每题间隔 ${500}ms 延迟
- 多选题额外延迟 500ms
- 显示填写进度到控制台
- 完成后弹出提示

### 5. 关键注意事项（必须遵守）
- ✅ **单选题**: 使用三重保障（checked + click label + click radio）+ 强制触发事件
- ✅ **多选题**: 必须使用 MouseEvent 模拟点击，包含验证和重试机制
- ✅ **量表题**: 使用 <a> 标签而非 radio，直接点击链接
- ✅ **矩阵题**: 使用 <a> 标签而非 radio，必须过滤表头行
- ✅ **填空题**: 设置value后触发focus、事件、blur
- ✅ **所有题型**: 都要调用 triggerEvents() 强制触发DOM和jQuery事件
- ✅ **异步操作**: 所有涉及延迟的操作使用 async/await

请生成完整可用的代码，确保符合问卷星的实际DOM结构和事件机制。`;

        return prompt;
    }

    // 题型名称映射
    function getQuestionTypeName(type) {
        const typeMap = {
            'radio': '单选题',
            'checkbox': '多选题',
            'matrix': '矩阵题',
            'scale': '量表题',
            'text': '填空题',
            'unknown': '未知题型'
        };
        return typeMap[type] || type;
    }

    // 显示结果界面
    function showResultUI(analysisData, aiPrompt) {
        // 创建遮罩
        const overlay = document.createElement('div');
        overlay.id = 'analyzer-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 999998;
        `;

        // 创建结果窗口
        const resultWindow = document.createElement('div');
        resultWindow.id = 'analyzer-result';
        resultWindow.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        width: 90%; max-width: 1000px; max-height: 90vh;
                        background: white; border-radius: 15px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                        z-index: 999999; display: flex; flex-direction: column; overflow: hidden;">

                <!-- 头部 -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white; padding: 20px; border-radius: 15px 15px 0 0;">
                    <h2 style="margin: 0 0 10px 0; font-size: 24px;">🤖 AI脚本生成助手</h2>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">
                        已分析 ${analysisData.totalQuestions} 道题目，可将下方内容复制给AI生成脚本
                    </p>
                </div>

                <!-- 统计卡片 -->
                <div style="padding: 20px; background: #f8f9fa;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        ${generateStatCards(analysisData)}
                    </div>
                </div>

                <!-- 内容区 -->
                <div style="flex: 1; overflow-y: auto; padding: 20px;">
                    <!-- 题目预览 -->
                    <div style="margin-bottom: 20px;">
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📋 题目列表预览</h3>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto;">
                            ${generateQuestionList(analysisData)}
                        </div>
                    </div>

                    <!-- AI提示词 -->
                    <div>
                        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; display: flex; align-items: center; justify-content: space-between;">
                            <span>💬 AI提示词（复制给Claude/ChatGPT）</span>
                            <button id="copy-prompt-btn" style="padding: 8px 16px; background: #4CAF50;
                                    color: white; border: none; border-radius: 5px; cursor: pointer;
                                    font-size: 14px; font-weight: bold;">
                                📋 一键复制
                            </button>
                        </h3>
                        <textarea id="ai-prompt-text" readonly style="width: 100%; height: 300px;
                                  padding: 15px; border: 2px solid #ddd; border-radius: 8px;
                                  font-family: 'Courier New', monospace; font-size: 13px;
                                  resize: vertical; background: #fafafa;">${aiPrompt}</textarea>
                    </div>
                </div>

                <!-- 底部操作栏 -->
                <div style="padding: 20px; background: #f8f9fa; border-top: 1px solid #ddd;
                            display: flex; gap: 10px; justify-content: flex-end;">
                    <button id="download-json-btn" style="padding: 10px 20px; background: #2196F3;
                            color: white; border: none; border-radius: 5px; cursor: pointer;
                            font-size: 14px; font-weight: bold;">
                        📥 下载JSON数据
                    </button>
                    <button id="close-result-btn" style="padding: 10px 20px; background: #757575;
                            color: white; border: none; border-radius: 5px; cursor: pointer;
                            font-size: 14px; font-weight: bold;">
                        关闭
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(resultWindow);

        // 绑定事件
        document.getElementById('copy-prompt-btn').onclick = () => {
            const textarea = document.getElementById('ai-prompt-text');
            textarea.select();
            document.execCommand('copy');

            const btn = document.getElementById('copy-prompt-btn');
            const originalText = btn.textContent;
            btn.textContent = '✅ 已复制！';
            btn.style.background = '#4CAF50';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#4CAF50';
            }, 2000);
        };

        document.getElementById('download-json-btn').onclick = () => {
            const blob = new Blob([JSON.stringify(analysisData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `questionnaire_analysis_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        document.getElementById('close-result-btn').onclick = () => {
            document.body.removeChild(resultWindow);
            document.body.removeChild(overlay);
        };

        overlay.onclick = () => {
            document.body.removeChild(resultWindow);
            document.body.removeChild(overlay);
        };
    }

    // 生成统计卡片
    function generateStatCards(data) {
        const stats = {
            '单选题': 0,
            '多选题': 0,
            '矩阵题': 0,
            '量表题': 0,
            '填空题': 0
        };

        data.questions.forEach(q => {
            const typeName = getQuestionTypeName(q.questionType);
            if (stats[typeName] !== undefined) {
                stats[typeName]++;
            }
        });

        return Object.entries(stats)
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => `
                <div style="background: white; padding: 15px; border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #667eea;">${count}</div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">${type}</div>
                </div>
            `).join('');
    }

    // 生成题目列表
    function generateQuestionList(data) {
        return data.questions.map((q, i) => `
            <div style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                <span style="color: #667eea; font-weight: bold;">Q${q.questionNumber}</span>
                <span style="color: #999; margin: 0 8px;">|</span>
                <span style="color: #666;">${getQuestionTypeName(q.questionType)}</span>
                <span style="color: #999; margin: 0 8px;">|</span>
                <span style="color: #333;">${q.questionText.substring(0, 60)}${q.questionText.length > 60 ? '...' : ''}</span>
            </div>
        `).join('');
    }

    // 添加控制面板
    function addControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'analyzer-panel';
        panel.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; z-index: 999999;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 15px; padding: 20px;
                        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                        font-family: Arial, sans-serif; min-width: 200px;">
                <div style="color: white; font-weight: bold; margin-bottom: 15px;
                            font-size: 16px; text-align: center;">
                    🤖 AI脚本生成器
                </div>
                <button id="start-analyze-btn" style="width: 100%; padding: 12px;
                        background: white; color: #667eea; border: none;
                        border-radius: 8px; cursor: pointer; font-size: 14px;
                        font-weight: bold; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        transition: all 0.3s;">
                    🚀 开始分析
                </button>
                <div style="color: rgba(255,255,255,0.8); font-size: 11px;
                            margin-top: 12px; text-align: center;">
                    分析问卷并生成AI提示词
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定事件
        const btn = document.getElementById('start-analyze-btn');
        btn.onmouseover = () => {
            btn.style.transform = 'scale(1.05)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'scale(1)';
        };
        btn.onclick = () => {
            btn.textContent = '⏳ 分析中...';
            btn.style.background = '#FFA726';
            btn.style.color = 'white';

            setTimeout(() => {
                const analysisData = analyzeQuestionnaire();
                if (analysisData) {
                    const aiPrompt = generateAIPrompt(analysisData);
                    showResultUI(analysisData, aiPrompt);

                    btn.textContent = '✅ 分析完成';
                    btn.style.background = '#4CAF50';
                    setTimeout(() => {
                        btn.textContent = '🚀 开始分析';
                        btn.style.background = 'white';
                        btn.style.color = '#667eea';
                    }, 2000);
                } else {
                    btn.textContent = '❌ 分析失败';
                    btn.style.background = '#f44336';
                    setTimeout(() => {
                        btn.textContent = '🚀 开始分析';
                        btn.style.background = 'white';
                        btn.style.color = '#667eea';
                    }, 2000);
                }
            }, 500);
        };

        console.log('✅ 分析器面板已加载');
    }

    // 初始化
    function init() {
        console.log('🤖 问卷星AI脚本生成助手已加载');
        console.log('📍 当前URL:', window.location.href);

        setTimeout(() => {
            addControlPanel();
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
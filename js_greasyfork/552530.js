// ==UserScript==
// @name         课堂派测试AI半自动答题
// @namespace    http://tampermonkey.net/
// @version          2025-10-14
// @license MIT
// @description  autoAnswer from qwen
// @author       Valiant - Qwen3
// @match        *://ketangpai.com/*
// @match        *://www.ketangpai.com/*
// @match        *://*.ketangpai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ketangpai.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552530/%E8%AF%BE%E5%A0%82%E6%B4%BE%E6%B5%8B%E8%AF%95AI%E5%8D%8A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/552530/%E8%AF%BE%E5%A0%82%E6%B4%BE%E6%B5%8B%E8%AF%95AI%E5%8D%8A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
/*
* 使用说明：
* apiKey[必填] 点击设置或者在脚本页面填写
* 点击右下角自动答题开始自动请求当前题目，点击下一题之后自动回答当前题目
* 提示词修改对应的科目，默认是Python编程
*/
(function() {
    'use strict';
// ====== 配置区 ======
const CONFIG = {
// 页面选择器
     subject: 'Python', // 默认值
     subjectOptions: ['Python', 'Java', 'C++', '数学', '英语', '自定义'],
    selectors: {
        judge: {
            title: '.Judge-title',
            content: '.Judge-content',
            radioGroup: '.el-radio'
        },
        single: {
            title: '.SingleChoice-title',
            content: '.SingleChoice-content .content-box',
            radioGroup: '.SingleChoice-radio .el-radio'
        },
        multiple: {
            title: '.Multiplechoice-title',
            content: '.Multiplechoice-content .content-box',
            checkboxGroup: '.Multiplechoice-radio .el-checkbox' // 注意：是 checkbox
        },
        short: {
            title: '.ShortAnswerQuestions-title',
            content: '.ShortAnswerQuestions-content .content-box', // 注意：你提供的 HTML 中 content 在 .content-box
            editor: '.tox-tinymce iframe' // TinyMCE 的 iframe
        }
    }, // 多种题型
// DashScope API 配置
    ai: {
        endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        model: 'qwen-plus',
        apiKey: '111'// 请填入你的 API Key
    },

// 答题规则
    answer: {
        validOptions: ['对', '错']
    }
};
function getSystemPrompt(type, subject) {
    const base = `你是一个${subject}答题助手。`;
    switch (type) {
        case 'judge':
            return base + '题目为判断题，只有两个选项：“对”或“错”。请严格只回答“对”或“错”，不要解释，不要输出其他任何内容。';
        case 'single':
            return base + '题目为单选题，请从 A、B、C、D 中选择唯一正确答案。请严格只回答一个字母（如：A），不要解释，不要输出其他任何内容。';
        case 'multiple':
            return base + '题目为多选题，请从 A、B、C、D 中选择所有正确答案。请严格只回答正确选项的字母，用英文逗号分隔（如：A,B,C），不要解释，不要输出其他任何内容。';
        case 'short':
            return base + '题目为填空题，题干中用"______"表示空格。请直接输出所有空格的答案，用英文逗号分隔（如：sqrt,None,pip list,//,.pyc），不要解释，不要输出其他任何内容。';
        default:
            return base + '请根据题目类型作答。';
    }
}
// ==== 题型判断 ====
function detectQuestionType() {
    if (document.querySelector(CONFIG.selectors.judge.title)) return 'judge';
    if (document.querySelector(CONFIG.selectors.single.title)) return 'single';
    if (document.querySelector(CONFIG.selectors.multiple.title)) return 'multiple';
    if (document.querySelector(CONFIG.selectors.short.title)) return 'short'; // 新增
    return null;
}
// 获取当前题型的选择器
function getCurrentSelectors() {
    const type = detectQuestionType();
    if (type === 'judge') return CONFIG.selectors.judge;
    if (type === 'single') return CONFIG.selectors.single;
    if (type === 'multiple') return CONFIG.selectors.multiple; // 新增
    if (type === 'short') return CONFIG.selectors.short; //
    return null;
}


// 覆盖原有的 getText，支持动态选择器
function getText(selector) {
    const el = document.querySelector(selector);
    return el ? el.innerText.trim() : null;
}

// 覆盖原有的 getAllOptionTexts，支持单选题提取 A/B/C/D
function getAllOptionTexts() {
    const selectors = getCurrentSelectors();
    if (!selectors) return [];

    const type = detectQuestionType();
    let elements;

    if (type === 'multiple') {
        elements = document.querySelectorAll(selectors.checkboxGroup);
    } else {
        elements = document.querySelectorAll(selectors.radioGroup);
    }

    return Array.from(elements).map(el => {
        const label = type === 'multiple'
            ? el.querySelector('.el-checkbox__label')
            : el.querySelector('.el-radio__label');
        if (!label) return '';

        if (type === 'single' || type === 'multiple') {
            const keyEl = label.querySelector('.radio-title > span, .radio-title');
            if (keyEl) {
                let text = keyEl.innerText.trim();
                // 提取 A/B/C/D（兼容 " A. " 或 "A."）
                const match = text.match(/^[\s\u3000]*([A-D])/);
                return match ? match[1] : text;
            }
        }
        return label.innerText.trim(); // fallback（判断题用）
    }).filter(t => t !== '');
}
async function checkMulti(checkboxes, answers) {
    for (const cb of checkboxes) {
        const label = cb.querySelector('.el-checkbox__label');
        const input = cb.querySelector('.el-checkbox__original');
        if (!input || !label) continue;

        const keyEl = label.querySelector('.radio-title') || label;
        const m = keyEl.innerText.trim().match(/^[\s\u3000]*([A-D])/);
        const optionKey = m ? m[1] : '';

        const shouldCheck = answers.includes(optionKey);
        const isChecked = cb.classList.contains('is-checked');

        if (shouldCheck && !isChecked) {
            // 用 label.click() 更贴近组件的受控流程
            (label.click ? label : input).click();

            // 让出一次事件循环，等框架把 v-model/DOM 状态同步完成
            await new Promise(r => setTimeout(r, 1));
        }
    }
}
// 覆盖原有的 selectAnswer，支持按字母或文本匹配
async function selectAnswer(answerText) {
    const type = detectQuestionType();
    const selectors = getCurrentSelectors();
    if (!selectors) return false;

    if (type === 'multiple') {
        // 1. 解析答案（支持 "A,B,C" 或 "ACD"）
        let answers = [];
        if (answerText.includes(',')) {
            answers = answerText.split(',').map(s => s.trim()).filter(s => s);
        } else {
            answers = answerText.split('').filter(c => ['A','B','C','D'].includes(c));
        }
        console.log(answers,"解析答案");

        const checkboxes = document.querySelectorAll(selectors.checkboxGroup);
        console.log("CheckBoxes",checkboxes)
        checkMulti(checkboxes,answers);
    }
    else if (type === 'short'){
            return fillShortAnswer(answerText);
    }
    else {
        // 原有单选/判断逻辑
        const groups = type === 'judge' || type === 'single'
            ? document.querySelectorAll(selectors.radioGroup)
            : [];

        for (const group of groups) {
            const label = group.querySelector('.el-radio__label');
            const input = group.querySelector('.el-radio__original');
            if (!input || !label) continue;

            let matchText = '';
            if (type === 'single') {
                const keyEl = label.querySelector('.radio-title > span');
                matchText = keyEl ? keyEl.innerText.trim().replace(/\.$/, '') : '';
            } else {
                matchText = label.innerText.trim(); // judge
            }

            if (matchText === answerText) {
                selectElRadio(input);
                console.log('✅ 已选择:', answerText);
                return true;
            }
        }
        console.warn('⚠️ 未找到选项:', answerText);
        return false;
    }
}
function fillShortAnswer(answerText) {
    const iframe = document.querySelector(CONFIG.selectors.short.editor);
    if (!iframe) {
        console.warn('⚠️ 未找到填空题编辑器');
        return false;
    }

    try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const body = doc.body;
        if (!body) return false;

        // 清空并填入答案
        body.innerHTML = answerText.replace(/\n/g, '<br>');

        // 触发 TinyMCE 的 change 事件（可选，确保系统识别）
        const event = new Event('input', { bubbles: true });
        body.dispatchEvent(event);

        console.log('✅ 填空题已填入:', answerText);
        return true;
    } catch (e) {
        console.error('❌ 无法访问编辑器 iframe:', e);
        return false;
    }
}
async function getAIAnswer(title, content) {
 const type = detectQuestionType();
    const subject = CONFIG.subject; // 读取当前学科
    const systemPrompt = getSystemPrompt(type, subject); //  动态生成提示词

    let prompt = `${title || ''} ${content || ''}`.trim();

    if (type === 'single') {
        const optionDetails = Array.from(document.querySelectorAll('.SingleChoice-radio .radio-title'))
            .map(el => el.innerText.trim()).join('\n');
        prompt = `${title || ''}\n${content || ''}\n\n选项：\n${optionDetails}`.trim();
    } else if (type === 'multiple') {
        const optionDetails = Array.from(document.querySelectorAll('.Multiplechoice-radio .radio-title'))
            .map(el => el.innerText.trim()).join('\n');
        prompt = `${title || ''}\n${content || ''}\n\n选项：\n${optionDetails}`.trim();
    }
    // 填空题和判断题直接用原始 prompt

    if (!prompt) throw new Error('题目内容为空');

    const response = await fetch(CONFIG.ai.endpoint.trim(), { // 修复 endpoint 多余空格
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CONFIG.ai.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: CONFIG.ai.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            max_tokens: type === 'multiple' || type === 'short' ? 30 : 10
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI 请求失败: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content?.trim();
    if (!aiResponse) throw new Error('AI 未返回有效答案');

    if (type === 'judge') {
        const normalized = aiResponse.replace(/[^\u4e00-\u9fa5]/g, '');
        return normalized === '对' || normalized === '错' ? normalized : (aiResponse.includes('对') ? '对' : '错');
    } else if (type === 'single') {
        const match = aiResponse.match(/^[A-D]/);
        return match ? match[0] : 'A';
    } else if (type === 'multiple') {
        // 标准化为 A,B,C 格式
        let clean = aiResponse.replace(/[^A-D,，]/g, '').replace(/，/g, ',');
        // 提取唯一字母
        const letters = [...new Set(clean.split('').filter(c => ['A','B','C','D'].includes(c)))];
        return letters.join(',');
    }
    else if (type === 'short') {
        // 填空题：直接返回原始答案（AI 应返回逗号分隔的值）
        return aiResponse; // 不做字母提取
    }
}
function showToast(message, type = 'info') {
    // 防止重复弹出（可选）
    const existing = document.getElementById('ai-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'ai-toast';
    toast.textContent = message;

    // 样式：顶部居中，带背景色，自动消失
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10001;
        padding: 12px 24px;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: opacity 0.3s, transform 0.3s;
        max-width: 80%;
        text-align: center;
        background: ${type === 'warn' ? '#E6A23C' : '#409EFF'};
    `;

    document.body.appendChild(toast);

    // 3秒后淡出并移除
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
}
// 修改 autoAnswer，使用动态选择器
async function autoAnswer() {
    try {
        const selectors = getCurrentSelectors();
        if (!selectors) {
            console.warn('⚠️ 未识别题型');
            showToast('⚠️ 未找到题目或题型暂不支持', 'warn');
            return;
        }

// 1. 提取题目
        const title = getText(selectors.title);
        const content = getText(selectors.content);
        const options = getAllOptionTexts();

        console.log('📝 题目:', { title, content, options });

// 2. 请求 AI
        console.log('🤖 正在请求 AI...');
        const aiAnswer = await getAIAnswer(title, content);
        console.log('💡 AI 建议答案:', aiAnswer);

// 3. 自动选择
        const success = selectAnswer(aiAnswer);
        if (success) {
            console.log('✅ 自动答题完成！');
        }
    } catch (error) {
        console.error('❌ 自动答题失败:', error);
    }
}

// ========== 以下函数保持不变（仅微调依赖）==========
function selectElRadio(input) {
    if (!input || input.tagName !== 'INPUT') return;
    const name = input.name;
    if (name) {
        document.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(el => {
            if (el !== input) {
                el.checked = false;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }
    input.checked = true;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
}

// ========== 添加“自动作答 + 设置”按钮（右下角悬浮）==========
function addAutoAnswerButton() {
    if (document.getElementById('auto-answer-container')) return;

    // 容器
    const container = document.createElement('div');
    container.id = 'auto-answer-container';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        gap: 8px;
    `;

    // AI 自动作答按钮
    const btn = document.createElement('button');
    btn.id = 'auto-answer-btn';
    btn.textContent = '🤖 AI 自动作答';
    btn.style.cssText = `
        padding: 10px 16px;
        background: #409EFF;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    btn.onmouseover = () => {
        btn.style.background = '#66b1ff';
        btn.style.transform = 'scale(1.05)';
    };
    btn.onmouseout = () => {
        btn.style.background = '#409EFF';
        btn.style.transform = 'scale(1)';
    };
    btn.onclick = autoAnswer;

    // 齿轮设置按钮
    const gearBtn = document.createElement('button');
    gearBtn.id = 'ai-settings-btn';
    gearBtn.textContent = '⚙️';
    gearBtn.title = '设置 API Key';
    gearBtn.style.cssText = `
        width: 40px;
        height: 40px;
        background: #606266;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: background 0.3s;
    `;
    gearBtn.onmouseover = () => gearBtn.style.background = '#909399';
    gearBtn.onmouseout = () => gearBtn.style.background = '#606266';
    gearBtn.onclick = showApiKeyModal;

    container.appendChild(btn);
    container.appendChild(gearBtn);
    document.body.appendChild(container);
}

// ========== API Key 设置弹窗 ==========
function showApiKeyModal() {
    if (document.getElementById('api-key-modal')) return;

    const overlay = document.createElement('div');
    overlay.id = 'api-key-modal';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 24px;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    `;

    const title = document.createElement('h3');
    title.textContent = '⚙️ AI 设置';
    title.style.marginTop = '0';

    // === API Key 输入 ===
    const keyLabel = document.createElement('label');
    keyLabel.textContent = 'DashScope API Key:';
    keyLabel.style.display = 'block';
    keyLabel.style.marginTop = '16px';

    const keyInput = document.createElement('input');
    keyInput.type = 'password';
    keyInput.placeholder = 'sk-xxxxxxxxxx';
    keyInput.value = CONFIG.ai.apiKey || '';
    keyInput.style.cssText = `
        width: 100%;
        padding: 10px;
        margin: 8px 0;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
    `;

    // === 学科选择 ===
    const subjectLabel = document.createElement('label');
    subjectLabel.textContent = '答题学科:';
    subjectLabel.style.display = 'block';
    subjectLabel.style.marginTop = '16px';

    const subjectSelect = document.createElement('select');
    subjectSelect.style.cssText = `
        width: 100%;
        padding: 10px;
        margin: 8px 0;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
    `;

    // 填充选项
    CONFIG.subjectOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === CONFIG.subject) option.selected = true;
        subjectSelect.appendChild(option);
    });

    // 自定义学科输入框（可选）
    const customSubjectInput = document.createElement('input');
    customSubjectInput.type = 'text';
    customSubjectInput.placeholder = '输入自定义学科（如：数据结构）';
    customSubjectInput.value = CONFIG.subjectOptions.includes(CONFIG.subject) ? '' : CONFIG.subject;
    customSubjectInput.style.cssText = `
        width: 100%;
        padding: 10px;
        margin: 8px 0;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
        display: ${CONFIG.subjectOptions.includes(CONFIG.subject) ? 'none' : 'block'};
    `;

    // 切换自定义输入框显示
    subjectSelect.onchange = () => {
        if (subjectSelect.value === '自定义') {
            customSubjectInput.style.display = 'block';
            customSubjectInput.focus();
        } else {
            customSubjectInput.style.display = 'none';
        }
    };

    // === 提示 ===
    const tip = document.createElement('p');
    tip.innerHTML = '获取 API Key：<a href="https://dashscope.console.aliyun.com/apiKey" target="_blank">DashScope 控制台</a>';
    tip.style.fontSize = '12px';
    tip.style.color = '#606266';
    tip.style.marginTop = '12px';

    // === 按钮 ===
    const btns = document.createElement('div');
    btns.style.textAlign = 'right';
    btns.style.marginTop = '20px';

    const saveBtn = document.createElement('button');
    saveBtn.textContent = '保存';
    saveBtn.style.cssText = `
        padding: 8px 16px;
        background: #409EFF;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 8px;
    `;
    saveBtn.onclick = () => {
        const key = keyInput.value.trim();
        if (!key) {
            alert('⚠️ 请输入 API Key');
            return;
        }
        if (!key.startsWith('sk-')) {
            alert('⚠️ API Key 应以 "sk-" 开头');
            return;
        }

        let subject = subjectSelect.value;
        if (subject === '自定义') {
            const custom = customSubjectInput.value.trim();
            if (!custom) {
                alert('⚠️ 请输入自定义学科名称');
                return;
            }
            subject = custom;
        }

        // 保存到 CONFIG
        CONFIG.ai.apiKey = key;
        CONFIG.subject = subject;

        alert('✅ 设置已保存！');
        document.body.removeChild(overlay);
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = `
        padding: 8px 16px;
        background: #f5f5f5;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        cursor: pointer;
    `;
    cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
    };

    // 组装
    modal.appendChild(title);
    modal.appendChild(keyLabel);
    modal.appendChild(keyInput);
    modal.appendChild(subjectLabel);
    modal.appendChild(subjectSelect);
    modal.appendChild(customSubjectInput);
    modal.appendChild(tip);
    modal.appendChild(btns);
    btns.appendChild(cancelBtn);
    btns.appendChild(saveBtn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    overlay.onclick = (e) => {
        if (e.target === overlay) document.body.removeChild(overlay);
    };
}
// ========== 监听“下一题”按钮 ==========
function observeNextButton() {
    const observer = new MutationObserver(() => {
        const nextBtn = Array.from(document.querySelectorAll('button.el-button--primary'))
            .find(btn => btn.textContent.trim() === '下一题');
        if (nextBtn && !nextBtn._hasListener) {
            nextBtn._hasListener = true;
            const originalClick = nextBtn.onclick;
            nextBtn.onclick = function(e) {
                if (originalClick) originalClick.call(this, e);
                setTimeout(() => {
                    autoAnswer();
                }, 800);
            };
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// ========== 启动 ==========
function main() {
    addAutoAnswerButton();
    observeNextButton();
    console.log('[课堂派AI] userscript loaded');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addAutoAnswerButton();
        });
    }
}
    main();
})();
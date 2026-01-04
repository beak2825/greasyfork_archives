// ==UserScript==
// @name         uooc自动ai答题
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  使用deepseek模型，用于深圳大学uooc自动答题，首次使用需要提供deepseek api。理论上所有openai类型的api都能通过本脚本使用，后续将进行更新
// @author       lyccccy
// @license      CC-BY-NC-SA-4.0
// @match        *://www.uooc.net.cn/exam/*
// @match        *://www.uooc.net.cn/home/learn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/554067/uooc%E8%87%AA%E5%8A%A8ai%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/554067/uooc%E8%87%AA%E5%8A%A8ai%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 第一次手动设置 Key


    async function getAnswerFromAPI(type, question, options) {
        const apiKey = GM_getValue('OPENAI_API_KEY');
        // 拼接 prompt
        const prompt = `你是一个答题助手。题目类型：${type}
        题目：${question}
        选项：${options.join('\n')}
        请返回 JSON 字符串，格式如下：
{
  "answer": ["选项字母..."],
  "explanation": "简短理由"
}
注意：
- "answer" 必须是数组
- 不要包含多余文字`;
        //console.log(prompt)
        // 调用 API
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // 你的 API Key
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // 假设使用 GPT-4o-mini
                messages: [
                    { role: 'system', content: '你是一个答题助手。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0
            })
        });

        const data = await response.json();
        const text = data.choices[0].message.content.trim();

        let jsonAnswer;
        try {
            jsonAnswer = JSON.parse(text); // 解析成对象
        } catch (e) {
            console.error('解析 JSON 失败:', text);
        }

        //console.log(jsonAnswer.answer); // ["A", "C"]
        //console.log(jsonAnswer.explanation);
        return jsonAnswer;
    }

    function selectAnswer(tiEl, answerJson) {
        if (!tiEl || !answerJson) return;

        // 确保 answer 是数组形式，单选也转换成数组
        const answers = Array.isArray(answerJson.answer) ? answerJson.answer : [answerJson.answer];

        // 找到选项
        const optionsContainer = tiEl.querySelector('.ti-alist');
        if (!optionsContainer) return;

        const optionLabels = [...optionsContainer.querySelectorAll('label.ti-a')];

        answers.forEach(ans => {
            // 找到对应 value 的 input
            const input = optionLabels.find(label => label.querySelector('input')?.value === ans)?.querySelector('input');
            if (input && !input.checked) {
                input.click();
                //console.log(`✅ 已选择 ${ans} ：${tiEl.querySelector('.ti-q-c')?.innerText}`);
            }
        });
}

    // 打印一题
    async function printQuestion(tiEl) {
    // 题干
        const qText = tiEl.querySelector('.ti-q-c')?.innerText.trim() || '[无题干]';

        // 选项
        const optionsContainer = tiEl.querySelector('.ti-alist');
        const options = optionsContainer ? [...optionsContainer.querySelectorAll('label.ti-a')] : [];
        // 找到题目类型
        let typeText = '[未找到类型]';
        const queItems = tiEl.closest('.queItems');
        if (queItems) {
            const h2 = queItems.querySelector('h2.queItems-type');
            if (h2) {
                // 只保留“单选题”、“多选题”、“判断题”等文字
                typeText = h2.innerText.replace(/\s*\(.*?\)/, '').trim();
            }
        }
        console.log('========================');
        console.log('题目类型:', typeText);
        console.log('题干:', qText);
        console.log('选项:');

        if (options.length === 0) {
            console.log('  [未找到选项]');
            return;
        }
        const optionsText = options.map(label => {
            const key = label.querySelector('.ti-a-i')?.innerText?.trim().replace('.', '') || '?';
            const text = label.querySelector('.ti-a-c')?.innerText.trim() || '[无内容]';
            return `${key}. ${text}`;
        });
        options.forEach(label => {
            const key = label.querySelector('.ti-a-i')?.innerText?.trim().replace('.', '') || '?';
            const text = label.querySelector('.ti-a-c')?.innerText.trim() || '[无内容]';
            console.log(`  ${key}. ${text}`);
        });
        const answer = await getAnswerFromAPI(typeText, qText, optionsText);
        console.log('模型推荐答案:', answer);
        selectAnswer(tiEl,answer)
}

    // 查找所有单选题并打印
    function processAllSingleChoice() {
        if (document.querySelector('.answerBox')) {
            return}
        const questions = document.querySelectorAll('.ti');
        console.log(`检测到 ${questions.length} 道题：`);
        questions.forEach(printQuestion);
    }

    // 页面加载后运行
    window.addEventListener('load', () => {
        if (!GM_getValue('OPENAI_API_KEY')) {
            const key = prompt('请输入你的apiKey');
            GM_setValue('OPENAI_API_KEY', key);
        }

        const OPENAI_API_KEY = GM_getValue('OPENAI_API_KEY');
        console.log('当前 API Key:', OPENAI_API_KEY);
        setTimeout(processAllSingleChoice, 2000);
    });
})();

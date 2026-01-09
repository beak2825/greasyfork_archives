// ==UserScript==
// @name         学堂在线考试答案自动提取器
// @namespace    http://examination.xuetangx.com/
// @version      1.0
// @description  自动提取考试结果中的题目和答案，生成Markdown格式
// @author       GitHub Copilot
// @grant        none
// @match        https://examination.xuetangx.com/result/*
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/561897/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/561897/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%80%83%E8%AF%95%E7%AD%94%E6%A1%88%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建提取按钮
    function createExtractButton() {
        const button = document.createElement('button');
        button.innerHTML = '提取答案';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 10px 20px;
            background: #007acc;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        button.onclick = extractAnswers;
        document.body.appendChild(button);
    }

    // 提取答案的主函数
    function extractAnswers() {
        const questions = [];
        let questionCounter = 1; // 从第1题开始计数

        // 查找所有题目项
        const subjectItems = document.querySelectorAll('.subject-item');

        subjectItems.forEach((item, index) => {
            const questionData = extractQuestionData(item);
            if (questionData) {
                questionData.number = questionCounter++;
                questions.push(questionData);
            }
        });

        // 生成Markdown内容
        const markdownContent = generateMarkdown(questions);

        // 下载Markdown文件
        downloadMarkdown(markdownContent);
    }

    // 提取单个题目的数据
    function extractQuestionData(item) {
        const questionType = item.querySelector('.item-type');
        const questionBody = item.querySelector('.item-body');
        const questionFooter = item.querySelector('.item-footer');

        if (!questionType || !questionBody) return null;

        const typeText = questionType.textContent.trim();
        let questionTypeCategory = '';

        // 判断题目类型
        if (typeText.includes('单选题')) {
            questionTypeCategory = 'single';
        } else if (typeText.includes('多选题')) {
            questionTypeCategory = 'multiple';
        } else if (typeText.includes('填空题')) {
            questionTypeCategory = 'fill';
        } else if (typeText.includes('判断题')) {
            questionTypeCategory = 'judgment';
        }

        // 提取题干
        let questionText = '';
        if (questionTypeCategory === 'fill') {
            // 填空题的题干在exam-font div中
            const examFontDiv = questionBody.querySelector('.exam-font');
            if (examFontDiv) {
                questionText = examFontDiv.textContent.trim();
            }
        } else {
            const questionH4 = questionBody.querySelector('h4');
            if (questionH4) {
                questionText = questionH4.textContent.trim();
            }
        }

        // 提取正确答案
        let correctAnswer = '';
        const answerDiv = questionFooter.querySelector('.item-footer--header');
        if (answerDiv) {
            const answerText = answerDiv.textContent.trim();
            if (answerText.includes('正确答案：')) {
                correctAnswer = answerText.replace('正确答案：', '').trim();
            }
        }

        // 提取选项（如果有的话）
        const options = [];
        const optionElements = questionBody.querySelectorAll('ul li');
        optionElements.forEach((li, index) => {
            const label = li.querySelector('label');
            if (label) {
                let optionText = '';

                // 特殊处理判断题的选项
                if (questionTypeCategory === 'judgment') {
                    // 判断题的选项是固定的：第一个是"正确"，第二个是"错误"
                    optionText = index === 0 ? '正确' : '错误';
                } else {
                    // 其他题型的选项正常提取
                    optionText = label.textContent.trim();
                }

                const hasCheckmark = li.querySelector('.dot-success') !== null;
                options.push({
                    text: optionText,
                    isCorrect: hasCheckmark
                });
            }
        });

        // 对于填空题，提取具体的填空答案
        let fillAnswers = [];
        if (questionTypeCategory === 'fill') {
            fillAnswers = parseFillAnswers(item);
        }

        return {
            type: questionTypeCategory,
            text: questionText,
            answer: correctAnswer,
            options: options,
            fillAnswers: fillAnswers
        };
    }

    // 生成Markdown格式的内容
    function generateMarkdown(questions) {
        let content = '\n## 考试答案提取结果\n\n';

        // 按类型分组
        const groupedQuestions = {
            single: [],
            multiple: [],
            fill: [],
            judgment: []
        };

        questions.forEach(q => {
            if (groupedQuestions[q.type]) {
                groupedQuestions[q.type].push(q);
            }
        });

        // 生成单选题部分
        if (groupedQuestions.single.length > 0) {
            content += `## 单选题 (${groupedQuestions.single[0].number}-${groupedQuestions.single[groupedQuestions.single.length-1].number}题)\n\n`;
            groupedQuestions.single.forEach(q => {
                content += `### 第${q.number}题\n`;
                content += `**题干：** ${q.text}\n`;

                // 显示所有选项
                if (q.options && q.options.length > 0) {
                    content += `**选项：**\n`;
                    q.options.forEach((option, idx) => {
                        const letter = String.fromCharCode(65 + idx); // A, B, C, D...
                        const marker = option.isCorrect ? ' ✓' : '';
                        content += `${letter}. ${option.text}${marker}\n`;
                    });
                }

                content += `**正确答案：** ${q.answer}\n\n`;
            });
        }

        // 生成多选题部分
        if (groupedQuestions.multiple.length > 0) {
            content += `## 多选题 (${groupedQuestions.multiple[0].number}-${groupedQuestions.multiple[groupedQuestions.multiple.length-1].number}题)\n\n`;
            groupedQuestions.multiple.forEach(q => {
                content += `### 第${q.number}题\n`;
                content += `**题干：** ${q.text}\n`;
                const correctOptions = q.options.filter(opt => opt.isCorrect);
                const optionLetters = correctOptions.map(opt => opt.text.charAt(0)).join(',');
                const optionTexts = correctOptions.map(opt => opt.text.substring(1).trim()).join('；');
                content += `**正确答案：** ${optionLetters} (${optionTexts})\n\n`;
            });
        }

        // 生成填空题部分
        if (groupedQuestions.fill.length > 0) {
            content += `## 填空题 (${groupedQuestions.fill[0].number}-${groupedQuestions.fill[groupedQuestions.fill.length-1].number}题)\n\n`;
            groupedQuestions.fill.forEach(q => {
                content += `### 第${q.number}题\n`;
                content += `**题干：** ${q.text}\n`;
                // 使用提取的填空答案
                q.fillAnswers.forEach((answer, idx) => {
                    content += `**填空${idx + 1}：** ${answer}\n`;
                });
                content += '\n';
            });
        }

        // 生成判断题部分
        if (groupedQuestions.judgment.length > 0) {
            content += `## 判断题 (${groupedQuestions.judgment[0].number}-${groupedQuestions.judgment[groupedQuestions.judgment.length-1].number}题)\n\n`;
            groupedQuestions.judgment.forEach(q => {
                content += `### 第${q.number}题\n`;
                content += `**题干：** ${q.text}\n`;

                // 显示判断题选项
                if (q.options && q.options.length > 0) {
                    content += `**选项：**\n`;
                    q.options.forEach((option, idx) => {
                        const marker = option.isCorrect ? ' ✓' : '';
                        content += `${option.text}${marker}\n`;
                    });
                }

                content += `**正确答案：** ${q.answer}\n\n`;
            });
        }

        // 添加汇总信息
        const singleCount = groupedQuestions.single.length;
        const multipleCount = groupedQuestions.multiple.length;
        const fillCount = groupedQuestions.fill.length;
        const judgmentCount = groupedQuestions.judgment.length;

        content += '---\n\n';
        content += `**总分：** ${singleCount * 1 + multipleCount * 2 + fillCount * 4 + judgmentCount * 1}分\n`;
        if (singleCount > 0) content += `**单选题：** ${singleCount}分 (${groupedQuestions.single[0].number}-${groupedQuestions.single[singleCount-1].number}题，每题1分)\n`;
        if (multipleCount > 0) content += `**多选题：** ${multipleCount * 2}分 (${groupedQuestions.multiple[0].number}-${groupedQuestions.multiple[multipleCount-1].number}题，每题2分)\n`;
        if (fillCount > 0) content += `**填空题：** ${fillCount * 4}分 (${groupedQuestions.fill[0].number}-${groupedQuestions.fill[fillCount-1].number}题，每题4分)\n`;
        if (judgmentCount > 0) content += `**判断题：** ${judgmentCount}分 (${groupedQuestions.judgment[0].number}-${groupedQuestions.judgment[judgmentCount-1].number}题，每题1分)\n`;

        return content;
    }

    // 解析填空题答案
    function parseFillAnswers(item) {
        const answers = [];
        // 在题目范围内查找填空答案
        const problemOptions = item.querySelectorAll('.problem-options li');
        problemOptions.forEach(li => {
            const span = li.querySelector('span.exam-font');
            if (span) {
                answers.push(span.textContent.trim());
            }
        });
        return answers;
    }

    // 下载Markdown文件
    function downloadMarkdown(content) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_answers.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('答案已提取并下载为 extracted_answers.md 文件！\n请手动复制内容到考试答案表.md中。');
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createExtractButton);
    } else {
        createExtractButton();
    }
})();
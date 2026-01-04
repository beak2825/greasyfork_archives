// ==UserScript==
// @name         河北高校师资培训随机答题助手
// @namespace    https://aiyvyang.top/
// @version      0.2
// @description  自动随机选择答案（单选、多选、判断题）+ 导出完整试卷PDF
// @author       阳阳
// @license      MIT
// @match        http://hbgs.study.gspxonline.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552096/%E6%B2%B3%E5%8C%97%E9%AB%98%E6%A0%A1%E5%B8%88%E8%B5%84%E5%9F%B9%E8%AE%AD%E9%9A%8F%E6%9C%BA%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552096/%E6%B2%B3%E5%8C%97%E9%AB%98%E6%A0%A1%E5%B8%88%E8%B5%84%E5%9F%B9%E8%AE%AD%E9%9A%8F%E6%9C%BA%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟执行，确保页面加载完成
    setTimeout(() => {
        console.log('开始随机答题...');

        // 获取所有题目
        const questions = document.querySelectorAll('.c-p-practice-question');

        questions.forEach((question, index) => {
            const questionNum = index + 1;
            const typeElement = question.querySelector('.type');
            const typeText = typeElement ? typeElement.textContent.trim() : '';

            console.log(`处理第${questionNum}题: ${typeText}`);

            if (typeText === '单选题' || typeText === '判断题') {
                // 单选题和判断题处理
                handleRadioQuestion(question, questionNum);
            } else if (typeText === '多选题') {
                // 多选题处理
                handleCheckboxQuestion(question, questionNum);
            }
        });

        console.log('随机答题完成！');

    }, 2000); // 延迟2秒执行

    // 处理单选题和判断题
    function handleRadioQuestion(question, num) {
        const radios = question.querySelectorAll('.el-radio');
        if (radios.length === 0) return;

        // 随机选择一个选项
        const randomIndex = Math.floor(Math.random() * radios.length);
        const selectedRadio = radios[randomIndex];

        // 点击选中
        selectedRadio.click();
        console.log(`第${num}题已选择: ${randomIndex + 1}/${radios.length}`);
    }

    // 处理多选题
    function handleCheckboxQuestion(question, num) {
        const checkboxes = question.querySelectorAll('.el-checkbox');
        if (checkboxes.length === 0) return;

        // 随机选择1-4个选项
        const selectCount = Math.floor(Math.random() * checkboxes.length) + 1;
        const selectedIndexes = [];

        while (selectedIndexes.length < selectCount) {
            const randomIndex = Math.floor(Math.random() * checkboxes.length);
            if (!selectedIndexes.includes(randomIndex)) {
                selectedIndexes.push(randomIndex);
            }
        }

        // 点击选中的选项
        selectedIndexes.forEach(idx => {
            checkboxes[idx].click();
        });

        console.log(`第${num}题已选择${selectCount}个选项: ${selectedIndexes.map(i => i+1).join(',')}`);
    }

    // 提取完整试卷数据
    function extractExamData() {
        const questions = document.querySelectorAll('.c-p-practice-question');
        const examData = [];

        questions.forEach((question, index) => {
            const typeElement = question.querySelector('.type');
            const typeText = typeElement ? typeElement.textContent.trim() : '';
            const titleElement = question.querySelector('.title');
            const title = titleElement ? titleElement.textContent.trim() : '';

            const options = [];
            let correctAnswers = [];

            if (typeText === '单选题' || typeText === '判断题') {
                const radios = question.querySelectorAll('.el-radio');
                radios.forEach((radio, idx) => {
                    const label = radio.querySelector('.el-radio__label');
                    const optionText = label ? label.textContent.trim().replace(/✓|✗/g, '').trim() : '';
                    const isCorrect = radio.querySelector('.icon-right') !== null;

                    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D
                    options.push({
                        letter: optionLetter,
                        text: optionText,
                        isCorrect: isCorrect
                    });

                    if (isCorrect) {
                        correctAnswers.push(optionLetter);
                    }
                });
            } else if (typeText === '多选题') {
                const checkboxes = question.querySelectorAll('.el-checkbox');
                checkboxes.forEach((checkbox, idx) => {
                    const label = checkbox.querySelector('.el-checkbox__label');
                    const optionText = label ? label.textContent.trim().replace(/✓|✗/g, '').trim() : '';
                    const isCorrect = checkbox.querySelector('.icon-right') !== null;

                    const optionLetter = String.fromCharCode(65 + idx);
                    options.push({
                        letter: optionLetter,
                        text: optionText,
                        isCorrect: isCorrect
                    });

                    if (isCorrect) {
                        correctAnswers.push(optionLetter);
                    }
                });
            }

            examData.push({
                num: index + 1,
                type: typeText,
                title: title,
                options: options,
                correctAnswers: correctAnswers
            });
        });

        return examData;
    }

    // 生成PDF预览页面
    function generatePDFPreview() {
        const examData = extractExamData();

        if (examData.length === 0) {
            alert('未找到题目数据！');
            return;
        }

        // 获取试卷标题
        const titleElement = document.querySelector('.topbar .title');
        const examTitle = titleElement ? titleElement.textContent.trim() : '试卷';
        const pdfTitle = `${examTitle}-试卷答案`;

        // 创建新窗口
        const printWindow = window.open('', '_blank');

        // 生成HTML内容
        let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${pdfTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: "Microsoft YaHei", Arial, sans-serif;
            padding: 30px;
            line-height: 1.8;
            color: #333;
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #2c3e50;
            font-size: 24px;
        }
        .question {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        .question-header {
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
            font-size: 16px;
        }
        .question-title {
            margin-bottom: 12px;
            padding-left: 20px;
            font-size: 15px;
        }
        .options {
            padding-left: 40px;
        }
        .option {
            margin: 8px 0;
            font-size: 14px;
        }
        .correct {
            color: #27ae60;
            font-weight: bold;
        }
        .answer {
            margin-top: 10px;
            padding: 8px 15px;
            background: #e8f5e9;
            border-left: 4px solid #27ae60;
            font-weight: bold;
            color: #27ae60;
            margin-left: 20px;
        }
        .type-badge {
            display: inline-block;
            padding: 2px 8px;
            background: #3498db;
            color: white;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 10px;
        }
        @media print {
            body {
                padding: 20px;
            }
            .no-print {
                display: none;
            }
        }
        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .print-btn:hover {
            background: #2980b9;
        }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">🖨️ 打印/保存PDF</button>
    <h1>${pdfTitle}</h1>
`;

        examData.forEach(q => {
            htmlContent += `
    <div class="question">
        <div class="question-header">
            ${String(q.num).padStart(2, '0')}. <span class="type-badge">${q.type}</span>
        </div>
        <div class="question-title">${q.title}</div>
        <div class="options">
`;

            q.options.forEach(opt => {
                const className = opt.isCorrect ? 'option correct' : 'option';
                htmlContent += `            <div class="${className}">${opt.letter}. ${opt.text}</div>\n`;
            });

            htmlContent += `        </div>
        <div class="answer">正确答案：${q.correctAnswers.join('、')}</div>
    </div>
`;
        });

        htmlContent += `
</body>
</html>
`;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    }

    // 添加快捷操作按钮
    function addControlButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // 随机答题按钮
        const randomBtn = createButton('🎲 随机答题', () => {
            location.reload();
        });

        // 清空答案按钮
        const clearBtn = createButton('🔄 清空答案', clearAllAnswers);

        // 导出PDF按钮
        const exportBtn = createButton('📄 导出试卷PDF', generatePDFPreview);

        // 交卷按钮（自动点击页面上的交卷按钮）
        const submitBtn = createButton('✅ 提交答卷', () => {
            const submitButton = document.querySelector('.btn-save');
            if (submitButton) {
                submitButton.click();
            } else {
                alert('未找到交卷按钮！');
            }
        });

        buttonContainer.appendChild(randomBtn);
        buttonContainer.appendChild(clearBtn);
        buttonContainer.appendChild(exportBtn);
        buttonContainer.appendChild(submitBtn);
        document.body.appendChild(buttonContainer);
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            padding: 10px 15px;
            background: #409EFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            white-space: nowrap;
            transition: background 0.3s;
        `;
        btn.onclick = onClick;
        return btn;
    }

    function clearAllAnswers() {
        // 清除所有选中的单选
        document.querySelectorAll('.el-radio.is-checked').forEach(radio => {
            radio.click();
        });

        // 清除所有选中的多选
        document.querySelectorAll('.el-checkbox.is-checked').forEach(checkbox => {
            checkbox.click();
        });

        console.log('已清空所有答案');
    }

    // 页面加载完成后添加控制按钮
    setTimeout(addControlButtons, 2500);

})();
// ==UserScript==
// @name         文明答题助手
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  智能匹配随机题库答案
// @author       YourName
// @match        https://*.wjx.top/*
// @match        https://*.wjx.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553439/%E6%96%87%E6%98%8E%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/553439/%E6%96%87%E6%98%8E%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .answer-helper {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            width: 350px;
            max-height: 80vh;
            overflow-y: auto;
        }
        .helper-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
        }
        .helper-btn {
            display: block;
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        .helper-btn:hover {
            background: #2980b9;
        }
        .highlight-correct {
            background-color: #d4edda !important;
            border: 2px solid #28a745 !important;
        }
        .answer-status {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
        }
        .status-success {
            background: #d4edda;
            color: #155724;
        }
        .status-error {
            background: #f8d7da;
            color: #721c24;
        }
        .question-list {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ddd;
            padding: 5px;
            margin-top: 10px;
            font-size: 12px;
        }
        .question-item {
            margin-bottom: 5px;
            padding: 3px;
            border-bottom: 1px solid #eee;
        }
    `);

    // 完整的题库答案映射（基于题目内容）
    const questionAnswerMap = [
        // 单选题
        {
            keywords: ["垃圾分为", "可回收物", "厨余垃圾", "有害垃圾"],
            answer: "3", // C.其他垃圾
            type: "single"
        },
                {
        keywords: ["赣州市文明行为促进条例", "吸烟", "电子烟", "遵守", "规定"],
    answer: ["2"],
    type: "single"
               },
        {
    keywords: ["文明城市创建", "工作", "坚持", "第一标准"],
    answer: ["1"],
    type: "single"
},
        {
            keywords: ["社会主义核心价值观", "内容"],
            answer: "4", // D.以上都是
            type: "single"
        },
        {
            keywords: ["理论武装工作", "关键环节", "飞入寻常百姓家"],
            answer: "2", // B.理论宣讲
            type: "single"
        },
        {
            keywords: ["道德的基础", "根本", "社会赖以生存"],
            answer: "1", // A.诚信
            type: "single"
        },
        {
            keywords: ["公共场所", "基本道德行为"],
            answer: "3", // C.尊老爱幼
            type: "single"
        },
        {
    keywords: ["文明行为促进", "共同责任"],
    answer: ["4"],
    type: "single"
        },
        {
            keywords: ["第一标准", "群众满意"],
            answer: "1", // A.群众满意
            type: "single"
        },
        {
            keywords: ["公民道德宣传日", "几月几日"],
            answer: "3", // C.9月20日
            type: "single"
        },
        {
            keywords: ["文明上网", "做法正确"],
            answer: "4", // D.传播网络正能量
            type: "single"
        },
        {
            keywords: ["共同责任", "全社会"],
            answer: "4", // D.全社会
            type: "single"
        },
        {
            keywords: ["外来游客", "问路"],
            answer: "3", // C.热情友善，耐心指路
            type: "single"
        },
        {
            keywords: ["公民道德基本规范", "正确表述"],
            answer: "2", // B.爱国守法、明礼诚信、团结友善、勤俭自强、敬业奉献
            type: "single"
        },
        {
            keywords: ["窗口工作人员", "做法正确"],
            answer: "4", // D.办理业务时面带微笑
            type: "single"
        },
        {
            keywords: ["政务服务便民热线", "号码"],
            answer: "3", // C.12345
            type: "single"
        },
        {
            keywords: ["健康文明", "绿色环保", "值得提倡"],
            answer: "1", // A.用餐实行分餐制、使用公筷公勺
            type: "single"
        },

        // 多选题
        {
            keywords: ["文明养犬", "做法正确"],
            answer: ["1", "2", "3"], // A,B,C
            type: "multi"
        },
        {
            keywords: ["文明餐桌", "做到"],
            answer: ["1", "2", "3", "4"], // A,B,C,D
            type: "multi"
        },
        {
            keywords: ["厚德赣州", "十大文明风尚"],
            answer: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], // A-J
            type: "multi"
        },
        {
            keywords: ["文明旅游", "做到"],
            answer: ["1", "2", "3", "4"], // A,B,C,D
            type: "multi"
        },
        {
            keywords: ["文明行为促进条例", "重点治理"],
            answer: ["1", "2", "3", "4"], // A,B,C,D
            type: "multi"
        },
        {
            keywords: ["文明社区", "共同做到"],
            answer: ["1", "2", "3"], // A,B,C
            type: "multi"
        },
        {
            keywords: ["图书馆", "博物馆", "电影院", "文明礼仪"],
            answer: ["1", "2", "3", "4"], // A,B,C,D
            type: "multi"
        },
        {
            keywords: ["文明观演", "做到"],
            answer: ["1", "2", "3"], // A,B,C
            type: "multi"
        },
        {
            keywords: ["思想道德建设", "主要内容"],
            answer: ["1", "2", "3", "4"], // A,B,C,D
            type: "multi"
        },
        {
            keywords: ["文明交通", "做到"],
            answer: ["1", "2", "3", "4"], // A,B,C,D
            type: "multi"
        },
        {
            keywords: ["文明上网", "做到", "遵纪守法", "传播先进文化"],
            answer: ["1", "2", "3", "4", "5", "6"], // A,B,C,D,E,F
            type: "multi"
        },
        {
            keywords: ["诚信文化", "做到"],
            answer: ["1", "2", "3"], // A,B,C (守诺、践约、无欺)
            type: "multi"
        },
        {
            keywords: ["文明乡风", "做到"],
            answer: ["2", "3", "4"], // B,C,D (婚事新办、丧事简办、节俭办席)
            type: "multi"
        },
        {
            keywords: ["文明健康生活方式", "规范"],
            answer: ["1", "2", "3", "4", "5", "6", "7"], // A,B,C,D,E,F,G (全部选项)
            type: "multi"
        },
        {
            keywords: ["邻里关系", "做法正确"],
            answer: ["1", "2", "3", "4"], // A,B,C,D (全部选项)
            type: "multi"
        }

    ];

    // 创建控制面板
    const createControlPanel = () => {
        const panel = document.createElement('div');
        panel.className = 'answer-helper';
        panel.innerHTML = `
            <div class="helper-title">文明答题助手 v9.0</div>
            <button id="fillPersonalInfo" class="helper-btn">填写个人信息</button>
            <button id="analyzeQuestions" class="helper-btn">智能分析题目</button>
            <button id="fillAllAnswers" class="helper-btn">智能填写答案</button>
            <button id="highlightCorrect" class="helper-btn">高亮正确答案</button>
            <button id="showMatchDetails" class="helper-btn">显示匹配详情</button>
            <button id="resetAnswers" class="helper-btn">重置所有答案</button>
            <div id="questionList" class="question-list" style="display:none;"></div>
            <div id="answerStatus" class="answer-status"></div>
        `;
        document.body.appendChild(panel);

        // 添加事件监听器
        document.getElementById('fillPersonalInfo').addEventListener('click', fillPersonalInfo);
        document.getElementById('analyzeQuestions').addEventListener('click', analyzeQuestions);
        document.getElementById('fillAllAnswers').addEventListener('click', fillAllAnswers);
        document.getElementById('highlightCorrect').addEventListener('click', highlightCorrectAnswers);
        document.getElementById('showMatchDetails').addEventListener('click', showMatchDetails);
        document.getElementById('resetAnswers').addEventListener('click', resetAllAnswers);
    };

    // 显示状态信息
    const showStatus = (message, isSuccess = true) => {
        const statusEl = document.getElementById('answerStatus');
        statusEl.textContent = message;
        statusEl.className = `answer-status ${isSuccess ? 'status-success' : 'status-error'}`;
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'answer-status';
        }, 5000);
    };

    // 填写个人信息
    const fillPersonalInfo = () => {
        try {
            // 填写姓名
            const nameInput = document.getElementById('q1');
            if (nameInput) nameInput.value = '张则灵';

            // 填写手机号码
            const phoneInput = document.getElementById('q2');
            if (phoneInput) phoneInput.value = '13803588082';

            // 选择赣州经开区 - 修复Select2选择问题
            selectAreaOption();

            showStatus('个人信息已填写！');
        } catch (error) {
            showStatus('填写个人信息失败: ' + error.message, false);
        }
    };

    // 选择区域选项 - 修复Select2选择问题
    const selectAreaOption = () => {
        // 方法1: 直接设置select的value
        const areaSelect = document.getElementById('q3');
        if (areaSelect) {
            areaSelect.value = '5';

            // 触发change事件
            const event = new Event('change', { bubbles: true });
            areaSelect.dispatchEvent(event);
        }

        // 方法2: 如果方法1不行，尝试点击Select2选项
        setTimeout(() => {
            const select2Container = document.querySelector('.select2-container');
            if (select2Container) {
                select2Container.click();

                setTimeout(() => {
                    const options = document.querySelectorAll('.select2-results__option');
                    for (let option of options) {
                        if (option.textContent.includes('赣州经开区')) {
                            option.click();
                            break;
                        }
                    }
                }, 500);
            }
        }, 100);
    };

    // 获取所有题目（排除个人信息题目）
    const getAllQuestions = () => {
        const questions = [];
        const questionElements = document.querySelectorAll('.field');

        questionElements.forEach((element, index) => {
            const questionText = element.querySelector('.topichtml')?.textContent.trim() || '';

            // 跳过个人信息题目(q1-q3)
            if (questionText && !isPersonalInfoQuestion(questionText)) {
                const isMulti = element.querySelector('input[type="checkbox"]') !== null;
                const questionId = element.id.replace('div', 'q');

                questions.push({
                    element: element,
                    text: questionText,
                    id: questionId,
                    type: isMulti ? 'multi' : 'single',
                    index: index + 1
                });
            }
        });

        return questions;
    };

    // 判断是否为个人信息题目
    const isPersonalInfoQuestion = (questionText) => {
        const personalInfoKeywords = ['姓名', '手机号码', '电话', '地区', '区域', '单位', '部门'];
        return personalInfoKeywords.some(keyword => questionText.includes(keyword));
    };

    // 智能匹配题目
    const findAnswerForQuestion = (question) => {
        let bestMatch = null;
        let highestScore = 0;

        for (const rule of questionAnswerMap) {
            // 首先检查题目类型是否匹配
            if ((rule.type === 'single' && question.type !== 'single') ||
                (rule.type === 'multi' && question.type !== 'multi')) {
                continue;
            }

            let score = 0;

            // 计算关键词匹配分数
            for (const keyword of rule.keywords) {
                if (question.text.includes(keyword)) {
                    score += 1;
                }
            }

            // 如果匹配分数高于当前最佳匹配
            if (score > highestScore) {
                highestScore = score;
                bestMatch = rule;
            }
        }

        // 只有当匹配到足够多的关键词时才返回结果
        return highestScore >= 2 ? bestMatch : null;
    };

    // 分析题目
    const analyzeQuestions = () => {
        const questionListEl = document.getElementById('questionList');
        questionListEl.innerHTML = '';
        questionListEl.style.display = 'block';

        const questions = getAllQuestions();
        let matchedCount = 0;

        questions.forEach(question => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';

            const matchResult = findAnswerForQuestion(question);

            if (matchResult) {
                matchedCount++;
                const matchedKeywords = matchResult.keywords.filter(k => question.text.includes(k));
                questionItem.innerHTML = `
                    <strong>题目 ${question.index} (${question.type}):</strong><br>
                    ${question.text.substring(0, 50)}...<br>
                    <span style="color:green">✓ 已匹配 (${matchedKeywords.length}/${matchResult.keywords.length})</span><br>
                    <span style="font-size:10px">答案: ${Array.isArray(matchResult.answer) ? matchResult.answer.join(',') : matchResult.answer}</span>
                `;
            } else {
                questionItem.innerHTML = `
                    <strong>题目 ${question.index} (${question.type}):</strong><br>
                    ${question.text.substring(0, 50)}...<br>
                    <span style="color:red">✗ 未匹配</span><br>
                    <span style="font-size:10px">关键词: ${extractKeywords(question.text).join(', ')}</span>
                `;
            }

            questionListEl.appendChild(questionItem);
        });

        showStatus(`分析完成: ${matchedCount}/${questions.length} 道题目已匹配`);

        // 记录未匹配的题目
        const unmatched = questions.filter(q => !findAnswerForQuestion(q));
        if (unmatched.length > 0) {
            console.log("未匹配的题目:", unmatched.map(q => ({
                text: q.text,
                type: q.type,
                keywords: extractKeywords(q.text)
            })));
        }
    };

    // 提取关键词用于调试
    const extractKeywords = (text) => {
        // 提取2-4个字符的中文短语作为关键词
        const chinesePhrases = text.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
        return [...new Set(chinesePhrases)].slice(0, 8); // 去重并取前8个
    };

    // 智能填写所有答案
    const fillAllAnswers = () => {
        // 先填写个人信息
        fillPersonalInfo();

        // 等待个人信息填写完成
        setTimeout(() => {
            const questions = getAllQuestions();
            let filledCount = 0;
            let matchDetails = [];

            questions.forEach(question => {
                const matchResult = findAnswerForQuestion(question);

                if (matchResult) {
                    let questionFilled = 0;

                    if (matchResult.type === "single") {
                        // 单选题 - 修复点击问题
                        const radio = document.getElementById(`${question.id}_${matchResult.answer}`);
                        if (radio) {
                            // 找到对应的a标签并点击
                            const aTag = radio.nextElementSibling;
                            if (aTag && aTag.classList.contains('jqradio')) {
                                aTag.click();
                                questionFilled = 1;
                            }
                        }
                    } else {
                        // 多选题 - 修复点击问题
                        matchResult.answer.forEach(value => {
                            const checkbox = document.getElementById(`${question.id}_${value}`);
                            if (checkbox) {
                                // 找到对应的a标签并点击
                                const aTag = checkbox.nextElementSibling;
                                if (aTag && aTag.classList.contains('jqcheck')) {
                                    aTag.click();
                                    questionFilled++;
                                }
                            }
                        });
                    }

                    filledCount += questionFilled;
                    matchDetails.push({
                        question: question.text.substring(0, 30) + '...',
                        matched: true,
                        filled: questionFilled
                    });
                } else {
                    matchDetails.push({
                        question: question.text.substring(0, 30) + '...',
                        matched: false,
                        filled: 0
                    });
                }
            });

            const matchedQuestions = questions.filter(q => findAnswerForQuestion(q)).length;
            showStatus(`成功填写了 ${filledCount} 个选项，${matchedQuestions}/${questions.length} 道题目匹配成功`);

            // 显示详细匹配结果
            if (matchedQuestions < questions.length) {
                setTimeout(() => {
                    const unmatchedCount = questions.length - matchedQuestions;
                    showStatus(`注意: 有 ${unmatchedCount} 道题目未匹配，请使用分析功能查看详情`, false);
                }, 2000);
            }
        }, 1000);
    };

    // 高亮正确答案
    const highlightCorrectAnswers = () => {
        // 先清除所有高亮
        document.querySelectorAll('.highlight-correct').forEach(el => {
            el.classList.remove('highlight-correct');
        });

        const questions = getAllQuestions();
        let highlightedCount = 0;

        questions.forEach(question => {
            const matchResult = findAnswerForQuestion(question);

            if (matchResult) {
                if (matchResult.type === "single") {
                    // 单选题
                    const radio = document.getElementById(`${question.id}_${matchResult.answer}`);
                    if (radio) {
                        const label = radio.closest('.ui-radio');
                        if (label) {
                            label.classList.add('highlight-correct');
                            highlightedCount++;
                        }
                    }
                } else {
                    // 多选题
                    matchResult.answer.forEach(value => {
                        const checkbox = document.getElementById(`${question.id}_${value}`);
                        if (checkbox) {
                            const label = checkbox.closest('.ui-checkbox');
                            if (label) {
                                label.classList.add('highlight-correct');
                                highlightedCount++;
                            }
                        }
                    });
                }
            }
        });

        showStatus(`高亮了 ${highlightedCount} 个正确答案`);
    };

    // 显示匹配详情
    const showMatchDetails = () => {
        const questions = getAllQuestions();
        let result = "题目匹配详情：\n\n";

        questions.forEach(question => {
            const matchResult = findAnswerForQuestion(question);

            result += `题目 ${question.index} (${question.type}):\n`;
            result += `内容: ${question.text}\n`;

            if (matchResult) {
                let answerText = '';
                if (Array.isArray(matchResult.answer)) {
                    matchResult.answer.forEach(value => {
                        const option = document.querySelector(`#${question.id}_${value} + .label`);
                        if (option) answerText += `  ${option.textContent.trim()}\n`;
                    });
                } else {
                    const option = document.querySelector(`#${question.id}_${matchResult.answer} + .label`);
                    if (option) answerText = option.textContent.trim();
                }

                result += `状态: 已匹配\n`;
                result += `匹配关键词: ${matchResult.keywords.join(', ')}\n`;
                result += `答案:\n${answerText}\n`;
            } else {
                result += `状态: 未匹配\n`;
                result += `提取关键词: ${extractKeywords(question.text).join(', ')}\n`;
            }
            result += "─".repeat(50) + "\n\n";
        });

        const matchedCount = questions.filter(q => findAnswerForQuestion(q)).length;
        result += `总结: ${matchedCount}/${questions.length} 道题目匹配成功`;

        alert(result);
    };

    // 重置所有答案
    const resetAllAnswers = () => {
        // 重置个人信息
        document.getElementById('q1').value = '';
        document.getElementById('q2').value = '';

        // 重置区域选择
        const areaSelect = document.getElementById('q3');
        if (areaSelect) {
            areaSelect.value = '-2'; // 请选择
            const event = new Event('change', { bubbles: true });
            areaSelect.dispatchEvent(event);
        }

        // 重置单选题 - 点击a标签
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            const aTag = radio.nextElementSibling;
            if (aTag && aTag.classList.contains('jqchecked')) {
                aTag.click();
            }
        });

        // 重置多选题 - 点击a标签
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            const aTag = checkbox.nextElementSibling;
            if (aTag && aTag.classList.contains('jqchecked')) {
                aTag.click();
            }
        });

        // 清除高亮
        document.querySelectorAll('.highlight-correct').forEach(el => {
            el.classList.remove('highlight-correct');
        });

        // 隐藏题目列表
        document.getElementById('questionList').style.display = 'none';

        showStatus('所有答案已重置');
    };

    // 初始化脚本
    const init = () => {
        // 检查是否在答题页面
        const hasQuestions = document.querySelector('.fieldset') ||
                           document.querySelector('input[type="radio"]') ||
                           document.querySelector('input[type="checkbox"]');

        if (hasQuestions) {
            createControlPanel();
            showStatus('答题助手v9.0已加载，修复了选择问题和多选题填写');
        } else {
            // 如果不在答题页面，每2秒检查一次
            setTimeout(init, 2000);
        }
    };

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
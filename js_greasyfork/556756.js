// ==UserScript==
// @name         长江雨课堂习题助手增强版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  长江雨课堂习题辅助工具 - 增强版
// @author       YourName
// @match        *://changjiang.yuketang.cn/*
// @match        *://*.yuketang.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556756/%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82%E4%B9%A0%E9%A2%98%E5%8A%A9%E6%89%8B%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/556756/%E9%95%BF%E6%B1%9F%E9%9B%A8%E8%AF%BE%E5%A0%82%E4%B9%A0%E9%A2%98%E5%8A%A9%E6%89%8B%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const config = {
        autoAnswer: false,
        showAnswer: true,
        saveAnswers: true,
        useOnlineSearch: true, // 是否使用在线搜索
        similarityThreshold: 0.7 // 相似度阈值
    };

    // 题目类型常量
    const QUESTION_TYPES = {
        SINGLE_CHOICE: 'single_choice',    // 单选题
        MULTIPLE_CHOICE: 'multiple_choice', // 多选题
        JUDGMENT: 'judgment',               // 判断题
        FILL_BLANK: 'fill_blank'           // 填空题
    };

    // 创建界面
    function createUI() {
        // ... 之前的UI代码保持不变 ...
    }

    // 获取答案的主函数
    function getAnswer(questionText, questionElement) {
        console.log('正在查找答案:', questionText);
        
        // 1. 首先尝试从本地存储中精确匹配
        const exactAnswer = getExactMatchAnswer(questionText);
        if (exactAnswer) {
            console.log('从本地存储找到精确答案:', exactAnswer);
            return exactAnswer;
        }

        // 2. 尝试从本地存储中模糊匹配
        const fuzzyAnswer = getFuzzyMatchAnswer(questionText);
        if (fuzzyAnswer) {
            console.log('从本地存储找到模糊匹配答案:', fuzzyAnswer);
            return fuzzyAnswer;
        }

        // 3. 尝试智能分析题目
        const analyzedAnswer = analyzeQuestion(questionText, questionElement);
        if (analyzedAnswer) {
            console.log('智能分析得到答案:', analyzedAnswer);
            // 保存分析结果到本地
            if (config.saveAnswers) {
                saveAnswerToDatabase(questionText, analyzedAnswer);
            }
            return analyzedAnswer;
        }

        // 4. 如果允许在线搜索，尝试搜索答案
        if (config.useOnlineSearch) {
            const searchAnswer = searchAnswerOnline(questionText);
            if (searchAnswer) {
                console.log('在线搜索得到答案:', searchAnswer);
                return searchAnswer;
            }
        }

        console.log('未找到答案');
        return null;
    }

    // 精确匹配答案
    function getExactMatchAnswer(questionText) {
        const savedAnswers = GM_getValue('answer_database', {});
        const normalizedQuestion = normalizeText(questionText);
        
        // 直接匹配
        if (savedAnswers[normalizedQuestion]) {
            return savedAnswers[normalizedQuestion];
        }
        
        // 关键词匹配
        const keywords = extractKeywords(normalizedQuestion);
        for (const [key, value] of Object.entries(savedAnswers)) {
            const keyKeywords = extractKeywords(key);
            const matchCount = keywords.filter(kw => 
                keyKeywords.some(k => k.includes(kw) || kw.includes(k))
            ).length;
            
            if (matchCount >= Math.min(keywords.length, keyKeywords.length) * 0.8) {
                return value;
            }
        }
        
        return null;
    }

    // 模糊匹配答案
    function getFuzzyMatchAnswer(questionText) {
        const savedAnswers = GM_getValue('answer_database', {});
        const normalizedQuestion = normalizeText(questionText);
        
        let bestMatch = null;
        let bestSimilarity = 0;
        
        for (const [key, value] of Object.entries(savedAnswers)) {
            const similarity = calculateSimilarity(normalizedQuestion, key);
            if (similarity > bestSimilarity && similarity >= config.similarityThreshold) {
                bestSimilarity = similarity;
                bestMatch = value;
            }
        }
        
        return bestMatch;
    }

    // 智能分析题目
    function analyzeQuestion(questionText, questionElement) {
        const questionType = detectQuestionType(questionText, questionElement);
        console.log('检测到题目类型:', questionType);
        
        switch (questionType) {
            case QUESTION_TYPES.SINGLE_CHOICE:
                return analyzeSingleChoice(questionText, questionElement);
            case QUESTION_TYPES.MULTIPLE_CHOICE:
                return analyzeMultipleChoice(questionText, questionElement);
            case QUESTION_TYPES.JUDGMENT:
                return analyzeJudgmentQuestion(questionText);
            case QUESTION_TYPES.FILL_BLANK:
                return analyzeFillBlank(questionText);
            default:
                return analyzeByKeywords(questionText, questionElement);
        }
    }

    // 检测题目类型
    function detectQuestionType(questionText, questionElement) {
        const text = questionText.toLowerCase();
        
        if (text.includes('多选') || text.includes('不定项') || 
            (questionElement && questionElement.find('input[type="checkbox"]').length > 0)) {
            return QUESTION_TYPES.MULTIPLE_CHOICE;
        }
        
        if (text.includes('判断') || text.includes('是否正确') || 
            text.includes('下列说法正确的是')) {
            return QUESTION_TYPES.JUDGMENT;
        }
        
        if (text.includes('填空') || text.includes('____') || 
            text.includes('（）')) {
            return QUESTION_TYPES.FILL_BLANK;
        }
        
        // 默认为单选题
        return QUESTION_TYPES.SINGLE_CHOICE;
    }

    // 分析单选题
    function analyzeSingleChoice(questionText, questionElement) {
        const options = extractOptions(questionElement);
        if (!options || options.length === 0) return null;
        
        // 策略1: 查找绝对化词汇
        const absoluteWords = ['总是', '永远', '一定', '必须', '所有', '每一个', '完全'];
        const hasAbsoluteWords = options.some(opt => 
            absoluteWords.some(word => opt.text.includes(word))
        );
        if (hasAbsoluteWords) {
            // 包含绝对化词汇的选项通常是错误的
            const nonAbsoluteOptions = options.filter(opt => 
                !absoluteWords.some(word => opt.text.includes(word))
            );
            if (nonAbsoluteOptions.length === 1) {
                return nonAbsoluteOptions[0].key;
            }
        }
        
        // 策略2: 查找最长的选项（通常包含更多细节，可能是正确答案）
        const longestOption = options.reduce((longest, current) => 
            current.text.length > longest.text.length ? current : longest
        );
        
        // 策略3: 查找包含特定关键词的选项
        const positiveWords = ['正确', '合适', '适当', '合理', '最佳'];
        for (const option of options) {
            if (positiveWords.some(word => option.text.includes(word))) {
                return option.key;
            }
        }
        
        return longestOption.key;
    }

    // 分析多选题
    function analyzeMultipleChoice(questionText, questionElement) {
        const options = extractOptions(questionElement);
        if (!options || options.length === 0) return null;
        
        const answers = [];
        
        // 多选题策略：通常有2-4个正确答案
        // 排除明显错误的选项，选择合理的选项
        
        const wrongIndicators = ['以上都不是', '都不对', '全部错误'];
        const correctIndicators = ['以上都是', '全部正确', '都对'];
        
        // 检查"以上都是"类选项
        const allCorrectOption = options.find(opt => 
            correctIndicators.some(indicator => opt.text.includes(indicator))
        );
        if (allCorrectOption) {
            return options.map(opt => opt.key).join(',');
        }
        
        // 排除错误选项，选择剩下的
        const validOptions = options.filter(opt => 
            !wrongIndicators.some(indicator => opt.text.includes(indicator))
        );
        
        // 通常多选题正确答案数量在2-4个之间
        const answerCount = Math.min(4, Math.max(2, Math.floor(validOptions.length * 0.6)));
        
        // 选择看起来最合理的选项
        for (let i = 0; i < answerCount && i < validOptions.length; i++) {
            answers.push(validOptions[i].key);
        }
        
        return answers.join(',');
    }

    // 分析判断题
    function analyzeJudgmentQuestion(questionText) {
        const text = questionText.toLowerCase();
        
        // 关键词分析
        const correctIndicators = ['正确', '是', '对', '可以', '能够', '应该'];
        const wrongIndicators = ['错误', '不是', '不对', '不能', '不可以', '不应该'];
        
        const correctCount = correctIndicators.filter(word => text.includes(word)).length;
        const wrongCount = wrongIndicators.filter(word => text.includes(word)).length;
        
        if (correctCount > wrongCount) {
            return '正确';
        } else if (wrongCount > correctCount) {
            return '错误';
        }
        
        // 默认返回正确（统计上正确的概率稍高）
        return '正确';
    }

    // 分析填空题
    function analyzeFillBlank(questionText) {
        // 填空题比较难自动回答，这里提供一些常见模式的匹配
        const commonPatterns = {
            '中华人民共和国成立于': '1949年',
            '水的化学式是': 'H2O',
            '光速是': '3×10^8 m/s',
            'π的值约等于': '3.14',
            '中国的首都是': '北京'
        };
        
        for (const [pattern, answer] of Object.entries(commonPatterns)) {
            if (questionText.includes(pattern)) {
                return answer;
            }
        }
        
        return '需要人工填写';
    }

    // 基于关键词分析
    function analyzeByKeywords(questionText, questionElement) {
        // 这里可以添加更多专业领域的关键词匹配
        const keywordAnswers = {
            'python': 'Python是一种编程语言',
            'java': 'Java是一种面向对象的编程语言',
            'html': 'HTML是超文本标记语言',
            'css': 'CSS是层叠样式表',
            'javascript': 'JavaScript是一种脚本语言'
            // 可以继续添加更多关键词映射
        };
        
        for (const [keyword, answer] of Object.entries(keywordAnswers)) {
            if (questionText.toLowerCase().includes(keyword.toLowerCase())) {
                return answer;
            }
        }
        
        return null;
    }

    // 在线搜索答案
    function searchAnswerOnline(questionText) {
        // 这里可以实现调用搜索引擎API或在线题库
        // 注意：实际使用时需要遵守相关网站的使用条款
        
        // 示例：使用模拟的搜索功能
        console.log('正在在线搜索:', questionText);
        
        // 在实际使用中，你可以调用：
        // 1. 百度搜索API
        // 2. 第三方题库API
        // 3. 或者其他教育资源API
        
        return null; // 返回null表示需要手动实现
    }

    // 工具函数
    function normalizeText(text) {
        return text.replace(/\s+/g, ' ')
                  .replace(/[（）()【】\[\]]/g, '')
                  .trim()
                  .toLowerCase();
    }

    function extractKeywords(text) {
        // 去除停用词，提取关键词
        const stopWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
        return text.split(' ')
                  .filter(word => word.length > 1 && !stopWords.includes(word))
                  .slice(0, 5); // 取前5个关键词
    }

    function calculateSimilarity(str1, str2) {
        // 简单的文本相似度计算（Jaccard相似度）
        const set1 = new Set(str1.split(''));
        const set2 = new Set(str2.split(''));
        
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return intersection.size / union.size;
    }

    function extractOptions(questionElement) {
        if (!questionElement) return null;
        
        const options = [];
        // 根据实际页面结构调整选择器
        const optionElements = questionElement.find('.option-item, .option, [class*="option"]');
        
        optionElements.each(function(index) {
            const option = $(this);
            const key = String.fromCharCode(65 + index); // A, B, C, D...
            const text = option.text().trim();
            options.push({ key, text });
        });
        
        return options;
    }

    function saveAnswerToDatabase(question, answer) {
        const database = GM_getValue('answer_database', {});
        const normalizedQuestion = normalizeText(question);
        database[normalizedQuestion] = answer;
        GM_setValue('answer_database', database);
    }

    // 其他函数（showAnswers, autoAnswer等）保持不变，但需要更新调用getAnswer的方式
    function showAnswers() {
        const questions = $('.question-item');
        
        questions.each(function(index) {
            const question = $(this);
            const questionText = question.find('.question-text').text();
            
            // 传递question元素给getAnswer
            const answer = getAnswer(questionText, question);
            
            if (answer) {
                // 移除之前可能存在的答案提示
                question.find('.yt-answer-hint').remove();
                question.append(`<div class="yt-answer-hint">建议答案: ${answer}</div>`);
            }
        });
        
        updateStatus('答案已显示');
    }

    // 选择选项的函数也需要相应更新
    function selectOption(question, answer) {
        const answers = answer.split(',');
        const options = question.find('.option-item input, .option input');
        
        answers.forEach(ans => {
            const optionIndex = ans.charCodeAt(0) - 65; // A->0, B->1, etc.
            if (options.length > optionIndex) {
                const option = options.eq(optionIndex);
                if (option.attr('type') === 'checkbox') {
                    // 多选题
                    option.prop('checked', true);
                } else {
                    // 单选题
                    option.prop('checked', true);
                }
                // 触发change事件以确保页面检测到选择
                option.trigger('change');
            }
        });
    }

    // 页面加载完成后初始化
    function init() {
        // ... 初始化代码保持不变 ...
    }

    // 启动脚本
    init();
})();
// ==UserScript==
// @name         随机刷题弹窗
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  弹窗随机刷题，自动识别单选/多选/判断题，提交后显示结果和正确答案
// @author       17630583910@163.com
// @match        https://xue.leqeegroup.com/*
// @grant        none
// @license      There are licenses for that.
// @downloadURL https://update.greasyfork.org/scripts/558689/%E9%9A%8F%E6%9C%BA%E5%88%B7%E9%A2%98%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/558689/%E9%9A%8F%E6%9C%BA%E5%88%B7%E9%A2%98%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!location.hash.startsWith('#/exam/detail/')) return;

    let globalBtnAdded = false;
    let randomBtnAdded = false;
    let currentModal = null;
    let allQuestions = [];

    // ========== 初始化题目列表 ==========
    const collectQuestions = () => {
        allQuestions = Array.from(document.querySelectorAll('[id^="question_"]'));
    };

    // ========== 工具函数 ==========
    const showToast = (text, color = '#409eff') => {
        let toast = document.getElementById('tm-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'tm-toast';
            toast.style.cssText = `
                position: fixed;
                top: 60px;
                right: 20px;
                z-index: 99999;
                padding: 10px 16px;
                background: ${color};
                color: white;
                border-radius: 4px;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                opacity: 0;
                transition: opacity 0.3s;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = text;
        toast.style.backgroundColor = color;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 2000);
    };

    // ========== 创建弹窗 ==========
    const createModal = (questionEl) => {
        if (currentModal) currentModal.remove();

        const correctAnswer = questionEl.querySelector('.flex[style*="color: rgb(215, 58, 48)"] > div:last-child')?.textContent.trim();
        if (!correctAnswer) {
            showToast('无法获取正确答案', '#F56565');
            return;
        }

        // 判断题型
        const options = Array.from(questionEl.querySelectorAll('.question-option'));
        const optionTexts = options.map(opt => {
            const inner = opt.querySelector('.flex-1');
            return inner ? inner.textContent.trim() : '';
        });

        let isJudgment = false;
        let isMultiSelect = false;

        if (optionTexts.length === 2 && optionTexts.includes('正确') && optionTexts.includes('错误')) {
            isJudgment = true;
        } else {
            isMultiSelect = /^[A-Z]+$/.test(correctAnswer) && correctAnswer.length > 1;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow-y: auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-size: 14px;
            line-height: 1.6;
        `;

        // 题干
        const titleDivs = Array.from(questionEl.querySelectorAll('.question-title > div'));
        let titleText = '';
        if (titleDivs.length >= 2) {
            titleText = titleDivs[0].textContent + ' ' + titleDivs[1].textContent;
        }
        const titleEl = document.createElement('div');
        titleEl.innerHTML = `<strong>${titleText}</strong>`;
        content.appendChild(titleEl);

        // 克隆选项
        const optionsContainer = questionEl.querySelector('.arco-space.arco-space-vertical.w-full');
        if (!optionsContainer) {
            content.innerHTML = '<p>选项加载失败</p>';
            modal.appendChild(content);
            document.body.appendChild(modal);
            return;
        }

        const clonedOptions = optionsContainer.cloneNode(true);
        const clonedOptionItems = Array.from(clonedOptions.querySelectorAll('.question-option'));
        clonedOptionItems.forEach((opt) => {
            opt.style.cursor = 'pointer';
            opt.style.padding = '8px';
            opt.style.border = '1px solid #ddd';
            opt.style.borderRadius = '4px';
            opt.style.margin = '6px 0';
            if (isMultiSelect) {
                opt.addEventListener('click', () => {
                    const selected = opt.dataset.selected === 'true';
                    opt.style.backgroundColor = selected ? '' : '#e6f4ff';
                    opt.style.borderColor = selected ? '#ddd' : '#409eff';
                    opt.dataset.selected = !selected;
                });
            } else {
                opt.addEventListener('click', () => {
                    clonedOptionItems.forEach(o => {
                        o.style.backgroundColor = '';
                        o.style.borderColor = '#ddd';
                        delete o.dataset.selected;
                    });
                    opt.style.backgroundColor = '#409eff';
                    opt.style.borderColor = '#409eff';
                    opt.dataset.selected = 'true';
                });
            }
        });
        content.appendChild(clonedOptions);

        // 按钮区域
        const buttonArea = document.createElement('div');
        buttonArea.style.marginTop = '16px';
        buttonArea.style.display = 'flex';
        buttonArea.style.gap = '12px';
        buttonArea.style.flexWrap = 'wrap';

        // 随机抽题按钮
        const randomDrawBtn = document.createElement('button');
        randomDrawBtn.textContent = '🔄 随机抽题';
        randomDrawBtn.style.cssText = `
            padding: 6px 12px;
            background-color: #e6a23c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        `;
        randomDrawBtn.addEventListener('click', () => {
            if (allQuestions.length === 0) {
                collectQuestions();
            }
            const newQ = allQuestions[Math.floor(Math.random() * allQuestions.length)];
            if (newQ) createModal(newQ);
        });

        // 提交按钮
        const submitBtn = document.createElement('button');
        submitBtn.textContent = '✅ 提交答案';
        submitBtn.style.cssText = `
            padding: 6px 12px;
            background-color: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
        `;

        // 结果显示区域（初始隐藏）
        const resultDiv = document.createElement('div');
        resultDiv.style.marginLeft = '12px';
        resultDiv.style.fontSize = '13px';
        resultDiv.style.display = 'none';

        submitBtn.addEventListener('click', () => {
            const selectedOpts = clonedOptionItems.filter(opt => opt.dataset.selected === 'true');
            if (selectedOpts.length === 0) {
                showToast('请选择选项', '#F56565');
                return;
            }

            let userAnswer = '';
            if (isJudgment) {
                userAnswer = selectedOpts[0].querySelector('.flex-1')?.textContent.trim() || '';
            } else {
                userAnswer = selectedOpts.map(opt => {
                    const label = opt.querySelector('.shrink-0');
                    if (label) {
                        return label.textContent.trim().replace(/\s*&nbsp;.*$/, '').replace(/\.$/, '');
                    }
                    return '';
                }).join('');
            }

            let isCorrect = false;
            if (isJudgment) {
                isCorrect = userAnswer === correctAnswer;
            } else if (isMultiSelect) {
                const userSorted = userAnswer.split('').sort().join('');
                const correctSorted = correctAnswer.split('').sort().join('');
                isCorrect = userSorted === correctSorted;
            } else {
                isCorrect = userAnswer === correctAnswer;
            }

            resultDiv.textContent = `${isCorrect ? '✅ 正确' : '❌ 错误'}｜正确答案：${correctAnswer}`;
            resultDiv.style.color = isCorrect ? '#67C23A' : '#F56565';
            resultDiv.style.display = 'inline-block';
        });

        buttonArea.appendChild(randomDrawBtn);
        buttonArea.appendChild(submitBtn);
        buttonArea.appendChild(resultDiv);
        content.appendChild(buttonArea);

        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
        `;
        closeBtn.onclick = () => modal.remove();
        content.appendChild(closeBtn);

        modal.appendChild(content);
        document.body.appendChild(modal);
        currentModal = modal;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    };

    // ========== 创建按钮 ==========
    const createGlobalButton = () => {
        if (globalBtnAdded) return;
        const headerRight = document.querySelector('.exam-header-right');
        if (!headerRight) return;

        const btn = document.createElement('button');
        btn.textContent = '显示全部答案';
        btn.style.cssText = `
            margin-left: 8px;
            padding: 4px 10px;
            background-color: #67c23a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            vertical-align: middle;
        `;
        headerRight.appendChild(btn);
        globalBtnAdded = true;

        let allVisible = false;
        btn.addEventListener('click', () => {
            const answers = document.querySelectorAll('.flex[style*="color: rgb(215, 58, 48)"] > div:last-child');
            answers.forEach(el => el.style.display = allVisible ? 'none' : '');
            btn.textContent = allVisible ? '显示全部答案' : '隐藏全部答案';
            allVisible = !allVisible;
        });
    };

    const createRandomButton = () => {
        if (randomBtnAdded) return;
        const headerRight = document.querySelector('.exam-header-right');
        if (!headerRight) return;

        const btn = document.createElement('button');
        btn.textContent = '随机刷题';
        btn.style.cssText = `
            margin-left: 8px;
            padding: 4px 10px;
            background-color: #e6a23c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            vertical-align: middle;
        `;
        headerRight.appendChild(btn);
        randomBtnAdded = true;

        btn.addEventListener('click', () => {
            collectQuestions();
            if (allQuestions.length === 0) {
                showToast('未找到题目', '#F56565');
                return;
            }
            const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];
            createModal(q);
        });
    };

    const initQuestionButtons = () => {
        document.querySelectorAll('[id^="question_"]').forEach(container => {
            if (container.dataset.answerBtnAdded) return;
            container.dataset.answerBtnAdded = 'true';

            const title = container.querySelector('.question-title');
            if (!title) return;

            const lastDiv = title.lastElementChild;
            if (!lastDiv || lastDiv.tagName !== 'DIV') return;

            const answerContent = container.querySelector('.flex[style*="color: rgb(215, 58, 48)"] > div:last-child');
            if (!answerContent) return;

            answerContent.style.display = 'none';

            const btn = document.createElement('button');
            btn.textContent = '显示答案';
            btn.style.cssText = `
                margin-left: 8px;
                padding: 2px 6px;
                background-color: #409eff;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
                vertical-align: middle;
            `;

            btn.addEventListener('click', (e) => {
                const isHidden = answerContent.style.display === 'none';
                answerContent.style.display = isHidden ? '' : 'none';
                btn.textContent = isHidden ? '隐藏答案' : '显示答案';
            });

            lastDiv.appendChild(btn);
        });
    };

    // ========== 初始化 ==========
    const handleLoad = () => {
        createGlobalButton();
        createRandomButton();
        initQuestionButtons();
        collectQuestions();

        const observer = new MutationObserver(() => {
            createGlobalButton();
            createRandomButton();
            initQuestionButtons();
            collectQuestions();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', handleLoad);
    } else {
        handleLoad();
    }

    window.addEventListener('hashchange', () => {
        if (location.hash.startsWith('#/exam/detail/')) {
            globalBtnAdded = false;
            randomBtnAdded = false;
            setTimeout(handleLoad, 300);
        }
    });
})();
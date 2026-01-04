// ==UserScript==
// @name         笔果web端优化(添加历年真题显示)
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  显示历年真题
// @author       散修-诡衍真人
// @license      MIT
// @match        https://www.biguotk.com/learning_center-2-real_paper-1.html
// @match        *://www.biguotk.com/web/topic/answer_page*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=biguotk.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552872/%E7%AC%94%E6%9E%9Cweb%E7%AB%AF%E4%BC%98%E5%8C%96%28%E6%B7%BB%E5%8A%A0%E5%8E%86%E5%B9%B4%E7%9C%9F%E9%A2%98%E6%98%BE%E7%A4%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552872/%E7%AC%94%E6%9E%9Cweb%E7%AB%AF%E4%BC%98%E5%8C%96%28%E6%B7%BB%E5%8A%A0%E5%8E%86%E5%B9%B4%E7%9C%9F%E9%A2%98%E6%98%BE%E7%A4%BA%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // -------------------------- 1. 基础工具函数 --------------------------
    function getUrlParam(key) {
        const url = window.location.href;
        const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`);
        const match = url.substr(1).match(reg);
        return match ? decodeURIComponent(match[2]) : '';
    }

    function getExaminationPaperData() {
        try {
            const storedStr = localStorage.getItem('examination_paper_index');
            return storedStr ? JSON.parse(storedStr) : {};
        } catch (e) {
            window.location.href = "https://www.biguotk.com/learning_center-2-real_paper-1.html";
            console.error('数据解析失败，重置为空对象', e);
            localStorage.removeItem('examination_paper_index');
            return {};
        }
    }

    // -------------------------- 2. 数据提取 --------------------------
    function extractPaperData() {
        const accordionContainer = document.getElementById('accordionExample');
        if (!accordionContainer) return;

        let paperData = getExaminationPaperData();
        const questionList = accordionContainer.querySelectorAll('.question');
        if (questionList.length === 0) return;

        questionList.forEach(question => {
            const subject = question.querySelector('.question_item > div')?.textContent.trim() || '';
            const collapseElem = question.querySelector('.collapse');
            if (!subject || !collapseElem) return;

            collapseElem.querySelectorAll('.question_child_item').forEach(item => {
                const paperName = item.querySelector('div > div:last-child')?.textContent.trim() || '';
                const topicId = item.querySelector('.open.real_question_bank_answer')?.getAttribute('data-topic-id') || '';
                if (paperName && topicId) {
                    paperData[topicId] = { subject, examination_paper: paperName };
                }
            });
        });

        localStorage.setItem('examination_paper_index', JSON.stringify(paperData));
        console.log(`数据提取完成，共${Object.keys(paperData).length}条记录`);
    }

    // -------------------------- 3. 优化：get_relevant_papers() 新增subject字段 --------------------------
    function get_relevant_papers(topic_id) {
        const targetTopicId = String(topic_id);
        const allPapers = getExaminationPaperData();
        const targetSubject = allPapers[targetTopicId]?.subject;

        if (!targetSubject) {
            console.log(`未找到topic_id="${targetTopicId}"对应的科目`);
            return [];
        }

        // 【核心优化】返回的数组对象新增subject字段（同组真题subject一致）
        return Object.keys(allPapers).reduce((arr, paperId) => {
            const paper = allPapers[paperId];
            if (paper.subject === targetSubject) {
                arr.push({
                    topic_id: paperId,
                    examination_paper: paper.examination_paper,
                    subject: paper.subject // 新增：每个对象都包含subject字段
                });
            }
            return arr;
        }, []);
    }

    // -------------------------- 4. 优化：模态框标题动态设置为subject --------------------------
    function openPapersModal(papers) {
        // 移除旧模态框
        const oldModal = document.getElementById('papersModal');
        if (oldModal) oldModal.remove();

        // 按时间降序排序（逻辑不变）
        const sortedPapers = [...papers].sort((a, b) => {
            const aMatch = a.examination_paper.match(/(\d{4})年(\d{1,2})月/);
            const bMatch = b.examination_paper.match(/(\d{4})年(\d{1,2})月/);
            if (!aMatch) return 1;
            if (!bMatch) return -1;

            const aYear = Number(aMatch[1]), aMonth = Number(aMatch[2]);
            const bYear = Number(bMatch[1]), bMonth = Number(bMatch[2]);
            return aYear !== bYear ? bYear - aYear : bMonth - aMonth;
        });

        // 创建模态框容器
        const modal = document.createElement('div');
        modal.id = 'papersModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 9999; display: flex;
            align-items: center; justify-content: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: #fff; width: 90%; max-width: 600px; max-height: 80vh;
            overflow-y: auto; padding: 20px; border-radius: 8px;
        `;

        // 【核心优化】动态标题：有数据则显示subject，无数据则显示默认标题
        const modalHeader = document.createElement('div');
        modalHeader.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;';

        const modalTitle = document.createElement('h3');
        modalTitle.style.margin = '0';
        // 取排序后数组的第一个元素subject（同组真题subject一致）
        modalTitle.textContent = sortedPapers.length > 0
            ? `${sortedPapers[0].subject}`
            : '相关历年真题';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            border: none; background: #f5f5f5; width: 30px; height: 30px;
            border-radius: 50%; font-size: 20px; cursor: pointer;
        `;
        closeBtn.onclick = () => modal.remove();

        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeBtn);

        // 填充真题列表（使用排序后的数组，对象含subject字段）
        const papersList = document.createElement('div');
        papersList.style.cssText = 'display: grid; gap: 10px;';

        if (sortedPapers.length === 0) {
            papersList.innerHTML = '<p style="margin:0; color:#666;">暂无相关真题数据</p>';
        } else {
            sortedPapers.forEach(paper => {
                const paperBtn = document.createElement('button');
                paperBtn.textContent = paper.examination_paper;
                paperBtn.style.cssText = `
                    padding: 10px; text-align: left; border: 1px solid #eee;
                    border-radius: 4px; background: #fff; cursor: pointer;
                    transition: background 0.2s;
                `;
                paperBtn.onmouseover = () => paperBtn.style.background = '#f5f5f5';
                paperBtn.onmouseout = () => paperBtn.style.background = '#fff';
                // 跳转逻辑（不变）
                paperBtn.onclick = () => {
                    const newUrl = window.location.href.replace(
                        /code=(\d+)/,
                        `code=${paper.topic_id}`
                    );
                    window.location.href = newUrl;
                };
                papersList.appendChild(paperBtn);
            });
        }

        modalContent.appendChild(modalHeader);
        modalContent.appendChild(papersList);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 点击遮罩层关闭
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }

    // -------------------------- 5. 添加历年真题按钮 --------------------------
    function addPapersButton() {
        const questionMenu = document.querySelector('.question_menu');
        if (!questionMenu || document.getElementById('papersButton')) return;

        const papersBtn = document.createElement('button');
        papersBtn.id = 'papersButton';
        papersBtn.textContent = '历年真题';
        papersBtn.style.cssText = `
            margin-left: 10px; padding: 6px 12px; border: none;
            background: #409eff; color: #fff; border-radius: 4px;
            cursor: pointer; transition: background 0.2s;
        `;
        papersBtn.onmouseover = () => papersBtn.style.background = '#66b1ff';
        papersBtn.onmouseout = () => papersBtn.style.background = '#409eff';

        papersBtn.onclick = () => {
            const currentTopicId = getUrlParam('code');
            if (!currentTopicId) {
                alert('未从当前页面URL中找到真题ID，请刷新页面重试');
                return;
            }
            const relevantPapers = get_relevant_papers(currentTopicId); // 调用优化后的函数
            openPapersModal(relevantPapers);
        };

        questionMenu.appendChild(papersBtn);
        console.log('“历年真题”按钮已添加到.question_menu');
    }

    // -------------------------- 6. 脚本入口 --------------------------
    extractPaperData();
    addPapersButton();
    window.getExaminationPaperData = getExaminationPaperData;
    window.get_relevant_papers = get_relevant_papers;
})();
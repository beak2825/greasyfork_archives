// ==UserScript==
// @name         郑州大学教师评价自动填写
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动完成教师评价的选择和评语填写
// @author       Chen Guo
// @match        https://jxpj.v.zzu.edu.cn/index.html*
// @icon         https://jxpj.v.zzu.edu.cn/favicon.ico
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561119/%E9%83%91%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/561119/%E9%83%91%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%95%99%E5%B8%88%E8%AF%84%E4%BB%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        .tme-highlight {
            background-color: #e6f7ff !important;
            border: 2px solid #1890ff !important;
            border-radius: 4px;
            padding: 3px;
            transition: all 0.3s;
        }
        .tme-comment-highlight {
            background-color: #f6ffed !important;
            border: 2px solid #52c41a !important;
        }
        #tme-status-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(37, 91, 232, 0.9);
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: 'Microsoft YaHei', sans-serif;
            font-size: 14px;
            max-width: 300px;
        }
        #tme-refresh-btn {
            margin-top: 10px;
            background: white;
            color: #255be8;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
    `);

    // 主函数：检测当前页面并执行相应操作
    function main() {
        console.log('开始执行教师评价自动填写脚本');

        // 创建状态指示器
        createStatusIndicator('正在检测评价页面...');

        // 检查是否在教师评价页面
        if (isEvaluationPage()) {
            console.log('检测到评价页面');
            updateStatus('已检测到评价页面，开始填写');

            // 等待1秒确保所有元素加载完成
            setTimeout(fillEvaluation, 1000);
        } else {
            console.log('当前不是评价页面，等待用户导航');
            updateStatus('请先进入教师评价页面');
        }
    }

    // 检测是否在评价页面
    function isEvaluationPage() {
        // 检查是否有单选题
        const hasQuestions = document.querySelectorAll('.ant-radio-group').length > 0;
        const hasCommentBox = document.querySelector('.index__UEditoTextarea--yga85') ||
                             document.querySelector('textarea[placeholder="请输入您的回答"]');

        return hasQuestions && hasCommentBox;
    }

    // 自动填写评价
    function fillEvaluation() {
        console.log('开始自动填写评价');
        updateStatus('正在进行自动填写...');

        // 1. 选择所有单选题的最后一个选项
        const selectedCount = selectLastOption();

        // 2. 填写评语框
        fillComment();

        // 3. 更新状态
        updateStatus(`自动填写完成！<br>已选择 ${selectedCount} 个"非常同意"选项<br>已填写评语`);

        console.log('自动填写完成');
    }

    // 选择所有单选题的最后一个选项
    function selectLastOption() {
        // 获取所有单选按钮组
        const radioGroups = document.querySelectorAll('.ant-radio-group');

        if (!radioGroups || radioGroups.length === 0) {
            console.log('未找到选择题区域');
            return 0;
        }

        let selectedCount = 0;

        // 遍历每个单选按钮组并选择最后一个选项
        radioGroups.forEach(group => {
            // 获取所有单选按钮
            const radioButtons = group.querySelectorAll('input[type="radio"]');

            // 获取最后一个单选按钮
            const lastOption = radioButtons[radioButtons.length - 1];

            if (lastOption) {
                // 触发点击选择
                lastOption.click();

                // 获取对应的label元素
                const label = findLabelForRadio(lastOption);

                // 添加高亮效果
                if (label) {
                    highlightOption(label);
                }

                selectedCount++;
            }
        });

        console.log(`已为 ${selectedCount} 道题选择最后一个选项`);
        return selectedCount;
    }

    // 查找单选按钮对应的标签
    function findLabelForRadio(radio) {
        const id = radio.id;
        if (id) {
            return document.querySelector(`label[for="${id}"]`);
        }

        // 备用方法：查找父级中的label
        return radio.closest('label');
    }

    // 填写评语内容
    function fillComment() {
        // 尝试多种选择器查找评语框
        let commentBox = document.querySelector('.index__UEditoTextarea--yga85') ||
                         document.querySelector('textarea[placeholder="请输入您的回答"]');

        if (!commentBox) {
            console.log('未找到评语框');
            return;
        }

        // 设置评语内容
        const comment = "最优秀的教师，点赞！";
        commentBox.value = comment;

        // 触发input事件，确保值被识别
        triggerInputEvent(commentBox);

        // 添加高亮效果
        commentBox.classList.add('tme-comment-highlight');

        console.log(`已填写评语: ${comment}`);
    }

    // 高亮显示已选择的选项
    function highlightOption(element) {
        element.classList.add('tme-highlight');

        // 3秒后移除高亮
        setTimeout(() => {
            element.classList.remove('tme-highlight');
        }, 3000);
    }

    // 创建状态提示框
    function createStatusIndicator(initialMessage) {
        // 移除可能存在的旧指示器
        const oldIndicator = document.getElementById('tme-status-indicator');
        if (oldIndicator) oldIndicator.remove();

        // 创建新指示器
        const indicator = document.createElement('div');
        indicator.id = 'tme-status-indicator';
        indicator.innerHTML = `
            <div id="tme-status-message">${initialMessage || '教师评价助手已启用'}</div>
            <button id="tme-refresh-btn">手动触发填写</button>
        `;
        document.body.appendChild(indicator);

        // 添加手动触发按钮事件
        const refreshBtn = document.getElementById('tme-refresh-btn');
        refreshBtn.addEventListener('click', () => {
            updateStatus('手动触发填写...');
            fillEvaluation();
        });
    }

    // 更新状态消息
    function updateStatus(message) {
        const statusMessage = document.getElementById('tme-status-message');
        if (statusMessage) {
            statusMessage.innerHTML = message;
        }
    }

    // 触发输入事件
    function triggerInputEvent(element) {
        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        element.dispatchEvent(event);
    }

    // 初始化脚本
    console.log('教师评价自动填写脚本已加载');
    createStatusIndicator('教师评价助手已启用，等待页面加载...');

    // 页面加载完成后执行主函数
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }

    // 添加MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations) => {
        // 检查是否有新的评价元素出现
        const addedNodes = mutations.flatMap(mutation => Array.from(mutation.addedNodes));
        const hasEvaluationElements = addedNodes.some(node => {
            return node.querySelector &&
                   (node.querySelector('.ant-radio-group') ||
                    node.querySelector('.index__UEditoTextarea--yga85') ||
                    node.querySelector('textarea[placeholder="请输入您的回答"]'));
        });

        if (hasEvaluationElements) {
            console.log('检测到新的评价元素，重新执行脚本');
            setTimeout(fillEvaluation, 1000);
        }
    });

    // 开始观察整个文档
    observer.observe(document, { childList: true, subtree: true });
})();
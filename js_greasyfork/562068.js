// ==UserScript==
// @name         跳转灵珑页面
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2026-01-10
// @description  根据class获取元素，添加按钮并跳转
// @author       Saoword
// @match        https://xxxx:xx/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562068/%E8%B7%B3%E8%BD%AC%E7%81%B5%E7%8F%91%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/562068/%E8%B7%B3%E8%BD%AC%E7%81%B5%E7%8F%91%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 检查当前URL是否包含排除的页面
    const currentUrl = window.location.href;
    const excludedPages = ['design.html', 'workspace.html'];
    const shouldExclude = excludedPages.some(page => currentUrl.includes(page));

    if (shouldExclude) {
        //console.log('当前页面在排除列表中，脚本不执行');
        return; // 直接退出，不执行后续代码
    }

    // 配置部分
    const CONFIG = {
        targetClass: 'u-page-render', // 目标元素的class名
    };

    // 已处理的iframe集合
    const processedIframes = new WeakSet();

    // 添加按钮的核心函数（可用于主页面或iframe）
    function addButtonsToElements(doc, context) {
        const elements = doc.querySelectorAll(`.${CONFIG.targetClass}`);

        if (elements.length > 0) {
            //console.log(`在${context}中找到 ${elements.length} 个目标元素`);
        }

        elements.forEach(element => {
            // 检查是否已经添加过按钮
            if (element.querySelector('.custom-jump-button')) {
                return;
            }

            // 获取元素的属性值
            const id = element.getAttribute('id');
            const applicationid = element.getAttribute('applicationid');
            const pageName = element.__vue__._props.state.pageInfo.name;

            if (!id || !applicationid) {
                //console.warn(`${context} - 元素缺少属性:`, 'id');
                //console.warn(`${context} - 元素缺少属性:`, 'applicationid');
                return;
            }

            // 创建按钮
            const button = doc.createElement('button');
            button.textContent = `跳转 ${pageName} 页面`;
            button.className = 'custom-jump-button';

            button.style.cssText = `
                margin: 5px;
                padding: 8px 16px;
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
                outline: none;
            `;

            // 点击事件
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = `https://cgjbd.nanjing.gov.cn:9080/egova/linglong/workspace.html#/${applicationid}/page-build/page/${id}`
                console.log(`${context} - 跳转到:`, url);
                window.open(url, '_blank');
            });

            // 添加为第一个子元素
            element.insertBefore(button, element.firstChild);
            //console.log(`${context} - 已添加按钮`);
        });
    }

    // 处理主页面
    function processMainPage() {
        console.log('开始处理主页面');
        addButtonsToElements(document, '主页面');

        // 监听主页面DOM变化
        const observer = new MutationObserver(() => {
            addButtonsToElements(document, '主页面');
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    // 初始化
    function init() {
        console.log('脚本初始化');

        // 1. 处理主页面
        processMainPage();

    }

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }


})();
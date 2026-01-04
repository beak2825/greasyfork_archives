// ==UserScript==
// @name         SJTU显示隐藏的选课人数 - 自动监控
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  显示已满课程的隐藏选课人数，支持动态加载
// @author       DoubleMountain
// @match        https://i.sjtu.edu.cn/xsxk/zzxkyzb_cxZzxkYzbIndex.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561326/SJTU%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E7%9A%84%E9%80%89%E8%AF%BE%E4%BA%BA%E6%95%B0%20-%20%E8%87%AA%E5%8A%A8%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/561326/SJTU%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E7%9A%84%E9%80%89%E8%AF%BE%E4%BA%BA%E6%95%B0%20-%20%E8%87%AA%E5%8A%A8%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 主要处理函数
    function processFullCourses() {
        const fullElements = document.querySelectorAll('td.full');
        fullElements.forEach(fullTd => {
            // 如果"已满"是可见的（没有display:none）
            if (fullTd.style.display !== 'none') {
                // 隐藏"已满"标签
                fullTd.style.display = 'none';
                // 找到相邻的rsxx元素
                const rsxxTd = fullTd.nextElementSibling;
                if (rsxxTd && rsxxTd.classList.contains('rsxx')) {
                    // 获取当前的人数信息
                    const jxbrs = rsxxTd.querySelector('.jxbrs');
                    const jxbrl = rsxxTd.querySelector('.jxbrl');
                    if (jxbrs && jxbrl) {
                        // 保存原始的数字
                        const currentNum = jxbrs.textContent;
                        const totalNum = jxbrl.textContent;
                        // 如果还没有被处理过（避免重复处理）
                        if (!rsxxTd.getAttribute('data-processed')) {
                            // 替换内容：显示"已满"并保留人数信息
                            rsxxTd.innerHTML = `已满<br><font class="jxbrs">${currentNum}</font>/<font class="jxbrl">${totalNum}</font>`;
                            // 确保rsxx元素可见
                            rsxxTd.style.display = '';
                            // 标记为已处理
                            rsxxTd.setAttribute('data-processed', 'true');
                        }
                    }
                }
            }
        });
    }
    // 初始执行一次
    processFullCourses();
    // 创建 MutationObserver 监控 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        let shouldProcess = false;
        // 检查是否有新的节点添加或属性变化
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldProcess = true;
            }
            // 如果有 class 变化，也可能需要重新处理
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                shouldProcess = true;
            }
        });
        if (shouldProcess) {
            // 延迟一小段时间执行，确保 DOM 已完全更新
            setTimeout(processFullCourses, 100);
        }
    });
    // 开始监控整个文档的变化
    observer.observe(document.body, {
        childList: true,// 监控子节点的添加/删除
        subtree: true,// 监控所有后代节点
        attributes: true,// 监控属性变化
        attributeFilter: ['class', 'style']// 只监控 class 和 style 属性
    });
    console.log('选课人数显示脚本已启动（支持动态加载）');
})();
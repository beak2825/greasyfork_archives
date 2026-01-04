// ==UserScript==
// @name         DMHY 列表优化器 - 隐藏DBD制作组
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在DMHY网站上自动检测并隐藏“DBD制作组”发布的资源行，优化浏览体验。支持动态加载内容。
// @author       Atail
// @license MIT
// @match        *://*.dmhy.org/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/557290/DMHY%20%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96%E5%99%A8%20-%20%E9%9A%90%E8%97%8FDBD%E5%88%B6%E4%BD%9C%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/557290/DMHY%20%E5%88%97%E8%A1%A8%E4%BC%98%E5%8C%96%E5%99%A8%20-%20%E9%9A%90%E8%97%8FDBD%E5%88%B6%E4%BD%9C%E7%BB%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置项 ---
    const TEAM_HREF_SUFFIX = '/topics/list/team_id/805';
    const TEAM_NAME = 'DBD制作组';

    /**
     * 核心处理函数：扫描并隐藏符合条件的行
     * @param {Node} scope - 在哪个DOM节点下进行扫描，默认为整个文档
     */
    function hideMatchedRows(scope = document) {
        // 使用高效的选择器直接定位到可能包含目标链接的<a>标签
        // 这比遍历所有tr性能更好，因为它大大缩小了检查范围
        const potentialLinks = scope.querySelectorAll(`td.title span.tag a[href="${TEAM_HREF_SUFFIX}"]`);

        potentialLinks.forEach(link => {
            // 确认链接文本是否也匹配，并进行前后空格清理以增加健壮性
            if (link.textContent.trim() === TEAM_NAME) {
                // link.closest('tr') 是一个现代且高效的方法，用于查找最近的父级<tr>元素
                const rowToHide = link.closest('tr');
                if (rowToHide) {
                    // 直接设置display为none来隐藏，这是最简单直接的方式
                    rowToHide.style.display = 'none';
                    // console.log('已隐藏行:', rowToHide); // 调试时可以取消注释
                }
            }
        });
    }

    // --- 脚本主体 ---

    // 1. 针对初始页面加载：等待DOM构建完毕后，立即执行一次扫描
    // 使用 document-body 或 DOMContentLoaded 确保 #topic_list 存在
    const targetTable = document.getElementById('topic_list');
    if (targetTable) {
        // 初始执行
        hideMatchedRows(targetTable);

        // 2. 针对动态内容（如翻页、搜索等）设置观察者
        const tbody = targetTable.querySelector('tbody');
        if (tbody) {
            const observer = new MutationObserver((mutationsList) => {
                // 遍历所有发生的DOM变化
                for (const mutation of mutationsList) {
                    // 我们只关心新添加的节点（通常是新的<tr>）
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 对每个新增的节点（可能是tr或包含tr的片段）进行扫描
                        mutation.addedNodes.forEach(newNode => {
                            // 确保我们处理的是元素节点
                            if (newNode.nodeType === Node.ELEMENT_NODE) {
                                // 如果新节点本身就是tr，直接检查它
                                if (newNode.matches('tr')) {
                                    hideMatchedRows(newNode);
                                } else {
                                    // 否则，检查新节点内部是否包含我们关心的内容
                                    // 这能处理一次性插入多行的情况
                                    hideMatchedRows(newNode);
                                }
                            }
                        });
                        // console.log('检测到列表更新，已重新扫描。'); // 调试时可以取消注释
                        break; // 只要检测到一次内容添加就重新扫描，无需重复处理
                    }
                }
            });

            // 配置观察者：监视目标tbody的子节点变化
            const config = { childList: true };

            // 启动观察者
            observer.observe(tbody, config);

            console.log('DMHY 列表优化器已启动，正在监视列表变化...');
        }
    }
})();

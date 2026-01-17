// ==UserScript==
// @name         力扣讨论区题目链接增强
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在力扣讨论区文章中，将题目编号转换为可点击的超链接，并根据完成状态显示不同颜色（绿色=已完成，蓝色=未完成）
// @author       You
// @match        https://leetcode.cn/discuss/*
// @match        https://leetcode.cn/circle/*
// @match        https://leetcode-cn.com/circle/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/562962/%E5%8A%9B%E6%89%A3%E8%AE%A8%E8%AE%BA%E5%8C%BA%E9%A2%98%E7%9B%AE%E9%93%BE%E6%8E%A5%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/562962/%E5%8A%9B%E6%89%A3%E8%AE%A8%E8%AE%BA%E5%8C%BA%E9%A2%98%E7%9B%AE%E9%93%BE%E6%8E%A5%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[LC-Linker] 脚本启动 v2.1...');

    // 缓存有效期：两个月（60天）
    const CACHE_DURATION = 60 * 24 * 60 * 60 * 1000;

    // 添加样式
    GM_addStyle(`
        .lc-problem-link {
            text-decoration: none;
            font-weight: bold;
            transition: opacity 0.2s;
            cursor: pointer;
        }
        .lc-problem-link:hover {
            opacity: 0.8;
            text-decoration: underline;
        }
        .lc-problem-solved {
            color: #2db55d !important;
        }
        .lc-problem-unsolved {
            color: #007aff !important;
        }
    `);

    // 题目映射表 { frontendQuestionId: { titleSlug, status } }
    let questionMap = {};

    // 从缓存加载数据
    function loadFromCache() {
        const cacheTime = GM_getValue('lc_cache_time', 0);
        const cachedData = GM_getValue('lc_question_map', null);

        if (cachedData && (Date.now() - cacheTime) < CACHE_DURATION) {
            console.log('[LC-Linker] 使用缓存数据，缓存时间:', new Date(cacheTime).toLocaleString());
            questionMap = cachedData;
            return true;
        }

        console.log('[LC-Linker] 缓存已过期或不存在');
        return false;
    }

    // 保存数据到缓存
    function saveToCache() {
        GM_setValue('lc_question_map', questionMap);
        GM_setValue('lc_cache_time', Date.now());
        console.log('[LC-Linker] 数据已缓存');
    }

    // 获取所有题目信息（包含slug和完成状态）- 使用分页
    async function fetchAllQuestions() {
        console.log('[LC-Linker] 开始从API获取题目信息...');

        const batchSize = 100;
        let skip = 0;
        let total = 0;
        let fetched = 0;

        try {
            // 先获取总数
            const firstResponse = await fetch('https://leetcode.cn/graphql/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                        problemsetQuestionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
                            total
                            questions {
                                frontendQuestionId
                                titleSlug
                                status
                            }
                        }
                    }`,
                    variables: {
                        categorySlug: "",
                        limit: batchSize,
                        skip: 0,
                        filters: {}
                    }
                })
            });

            const firstData = await firstResponse.json();

            if (!firstData.data || !firstData.data.problemsetQuestionList) {
                console.error('[LC-Linker] API返回数据格式错误:', firstData);
                return false;
            }

            total = firstData.data.problemsetQuestionList.total;
            console.log('[LC-Linker] 总题目数:', total);

            // 处理第一批
            firstData.data.problemsetQuestionList.questions.forEach(q => {
                questionMap[q.frontendQuestionId] = {
                    titleSlug: q.titleSlug,
                    status: q.status
                };
            });
            fetched += firstData.data.problemsetQuestionList.questions.length;
            skip = batchSize;

            // 分页获取剩余题目
            while (fetched < total) {
                console.log(`[LC-Linker] 获取中... ${fetched}/${total}`);

                const response = await fetch('https://leetcode.cn/graphql/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                            problemsetQuestionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
                                questions {
                                    frontendQuestionId
                                    titleSlug
                                    status
                                }
                            }
                        }`,
                        variables: {
                            categorySlug: "",
                            limit: batchSize,
                            skip: skip,
                            filters: {}
                        }
                    })
                });

                const data = await response.json();

                if (data.data && data.data.problemsetQuestionList && data.data.problemsetQuestionList.questions) {
                    const questions = data.data.problemsetQuestionList.questions;
                    questions.forEach(q => {
                        questionMap[q.frontendQuestionId] = {
                            titleSlug: q.titleSlug,
                            status: q.status
                        };
                    });
                    fetched += questions.length;
                    skip += batchSize;

                    if (questions.length < batchSize) {
                        break;
                    }
                } else {
                    console.error('[LC-Linker] 分页获取失败:', data);
                    break;
                }
            }

            console.log('[LC-Linker] 获取成功，共', Object.keys(questionMap).length, '道题目');

            // 保存到缓存
            saveToCache();

            return true;
        } catch (e) {
            console.error('[LC-Linker] 获取题目信息失败:', e);
            return false;
        }
    }

    // 处理表格中的题目编号
    function processTableCells() {
        console.log('[LC-Linker] 开始处理表格...');

        const cells = document.querySelectorAll('table tbody tr td:nth-child(2)');
        console.log('[LC-Linker] 找到', cells.length, '个单元格');

        cells.forEach(cell => {
            if (cell.dataset.lcProcessed) return;

            const text = cell.innerText;
            const parts = text.split(/([、,，\s]+)/);

            const newHtml = parts.map(part => {
                if (/^\d+$/.test(part) && questionMap[part]) {
                    const q = questionMap[part];
                    const colorClass = q.status === 'AC' ? 'lc-problem-solved' : 'lc-problem-unsolved';
                    return `<a href="https://leetcode.cn/problems/${q.titleSlug}/" target="_blank" class="lc-problem-link ${colorClass}">${part}</a>`;
                }
                return part;
            }).join('');

            cell.innerHTML = newHtml;
            cell.dataset.lcProcessed = 'true';
        });

        console.log('[LC-Linker] 表格处理完成');
    }

    // 等待表格出现
    function waitForTable(timeout = 10000) {
        return new Promise((resolve) => {
            const table = document.querySelector('table');
            if (table) {
                resolve(table);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const table = document.querySelector('table');
                if (table) {
                    obs.disconnect();
                    resolve(table);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // 主函数
    async function main() {
        console.log('[LC-Linker] 等待页面加载...');

        const table = await waitForTable();

        if (!table) {
            console.log('[LC-Linker] 页面中没有找到表格，脚本停止');
            return;
        }

        console.log('[LC-Linker] 找到表格，开始处理');

        // 优先从缓存加载
        let success = loadFromCache();

        // 如果缓存无效，从API获取
        if (!success) {
            success = await fetchAllQuestions();
        }

        if (!success || Object.keys(questionMap).length === 0) {
            console.log('[LC-Linker] 获取题目信息失败，脚本停止');
            return;
        }

        // 处理表格
        processTableCells();

        // 监听DOM变化
        const observer = new MutationObserver((mutations) => {
            let hasNewContent = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'TABLE' || (node.querySelector && node.querySelector('table'))) {
                            hasNewContent = true;
                        }
                    }
                });
            });

            if (hasNewContent) {
                console.log('[LC-Linker] 检测到新内容，重新处理...');
                processTableCells();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[LC-Linker] 脚本初始化完成');
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();

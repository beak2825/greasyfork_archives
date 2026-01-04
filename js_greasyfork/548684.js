// ==UserScript==
// @name         DBD-RawsBanHelper
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  过滤动漫花园、末日动漫、Nyaa和蜜柑计划中的DBD-Raws、TOC和731学院内容，并修复行颜色问题
// @description:zh-CN  2.7更新内容：修改TOC相关实现，并将731学院添加进过滤列表
// @author       Fuck DBD-Raws
// @license      MIT
// @match        *://*.dmhy.org/*
// @match        *://*.acgnx.se/*
// @match        *://nyaa.land/*
// @match        *://nyaa.si/*
// @match        *://mikanani.me/*
// @match        *://mikanani.kas.pub/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548684/DBD-RawsBanHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/548684/DBD-RawsBanHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('DBD-RawsBanHelper: 脚本开始执行');

    // 配置参数
    const config = {
        targetKeywords: ['DBD-Raws', 'DBD制作组', 'DBD製作組','DBD转发','DBD轉發','DBD-SUB','DBD字幕组','DBD字幕組','DBD代发','DBD代發','DBD代传','DBD代傳','DBD转载','DBD轉載','DBD自购','DBD自購','DBD&','&DBD','[DBD]',
                        '我的英雄学院','我的英雄學院','Boku no Hero Academia','Boku No Hero Academia','My Hero Academia','My.Hero.Academia','Boku.no.Hero.Academia','Boku.No.Hero.Academia','My_Hero_Academia','Boku_no_Hero_Academia','僕のヒーローアカデミア',
                        'TOC'], // 要过滤的关键词列表
        filterClass: 'filtered', // 用于标记已过滤元素的类名
    };

    // 全局变量用于存储通知的定时器
    let hasExecutedStaticFilter = false; // 标记静态页面是否已执行过滤
    let frameObservers = new Map(); // 存储各个frame的Observer实例

    // 过滤731学院
    function filter731() {
        const bullshits = document.querySelectorAll('[title~=我的英雄学院]');
        bullshits.forEach(bullshit => {
            if (window.location.href.includes('/Home/Search')) {
                bullshit.parentNode.parentNode.parentNode.parentNode.remove();
            } else {
                bullshit.parentNode.parentNode.parentNode.remove();
            }
        });
    }

    // 检查文本是否包含任何目标关键词，并返回匹配到的关键词
    function containsTargetText(text) {
        const matchedKeywords = [];
        config.targetKeywords.forEach(keyword => {
            if (text.includes(keyword)) {
                matchedKeywords.push(keyword);
            }
        });
        return matchedKeywords.length > 0 ? matchedKeywords : false;
    }

    // 检查是否为蜜柑计划网站
    function isMikananiSite() {
        return window.location.hostname.includes('mikanani') ||
               window.location.hostname.includes('mikanime');
    }

    // 检查是否为蜜柑计划列表模式
    function isMikananiClassicMode() {
        return window.location.href.includes('/Home/Classic');
    }

    // 检查是否为动态加载页面（仅主页和订阅）
    function isDynamicPage() {
        return window.location.hostname === 'mikanani.kas.pub' || window.location.href.includes('/Home/MyBangumi') && !window.location.href.includes('/Home/Classic');
    }

    // 等待页面加载完成
    window.addEventListener('load', function() {
        console.log('DBD-RawsBanHelper: 页面加载完成，开始初始化');

        // 延迟执行以确保所有内容都已加载
        setTimeout(() => {
            if (isDynamicPage()) {
                console.log('DBD-RawsBanHelper: 检测到动态加载页面，设置观察器');
                setupDynamicPageObserver();
            } else {
                console.log('DBD-RawsBanHelper: 检测到静态页面，执行一次过滤');
                filterContent();
                hasExecutedStaticFilter = true;
            }
        }, 1000);
    });

    // 设置动态页面观察器
    function setupDynamicPageObserver() {
        // 先执行一次初始过滤
        filterContent();

        // 设置点击事件监听器来监听新的frame加载
        setupClickListeners();

        // 观察已存在的frame
        observeExistingFrames();

        // 设置全局观察器来监听新frame的添加
        setupGlobalObserver();
    }

    // 设置点击事件监听器
    function setupClickListeners() {
        // 监听an-box animated中的li标签点击
        document.addEventListener('click', function(e) {
            const liElement = e.target.closest('.an-box.animated li');
            if (liElement) {
                console.log('DBD-RawsBanHelper: 检测到an-box animated中的li标签点击');

                // 设置一个延迟来等待可能的frame加载，然后开始观察
                setTimeout(() => {
                    observeExistingFrames();
                }, 100);
            }
        });
    }

    // 观察已存在的frame
    function observeExistingFrames() {
        const frames = document.querySelectorAll('.row.an-res-row-frame');
        console.log(`DBD-RawsBanHelper: 找到 ${frames.length} 个frame元素`);

        filter731();

        frames.forEach((frame, index) => {
            if (!frameObservers.has(frame)) {
                observeFrameContent(frame);
            }
        });
    }

    // 观察单个frame的内容变化
    function observeFrameContent(frame) {
        // 如果已经在这个frame上设置了观察器，则跳过
        if (frameObservers.has(frame)) {
            return;
        }

        // 先立即执行一次过滤
        filterFrameContent(frame);

        // 创建MutationObserver来监听frame内部的内容变化
        const observer = new MutationObserver(function(mutations) {
            let shouldFilter = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 检查是否有新的子元素添加
                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) { // Element node
                                // 检查是否添加了包含资源信息的元素
                                if (node.classList && (
                                    node.classList.contains('sk-col') ||
                                    node.classList.contains('tag-res-name') ||
                                    node.classList.contains('anime-res-block') ||
                                    node.tagName.toLowerCase() === 'li' ||
                                    node.tagName.toLowerCase() === 'div'
                                )) {
                                    shouldFilter = true;
                                } else if (node.querySelectorAll) {
                                    // 检查子元素中是否包含资源相关元素
                                    const resourceElements = node.querySelectorAll('.sk-col, .tag-res-name, .anime-res-block, li, div');
                                    if (resourceElements.length > 0) {
                                        shouldFilter = true;
                                    }
                                }
                            }
                        });
                    }
                }
            });

            if (shouldFilter) {
                console.clear();
                console.log('DBD-RawsBanHelper: 检测到frame内容变化，执行过滤');
                // 使用防抖机制，避免频繁过滤
                clearTimeout(frame.filterTimeout);
                frame.filterTimeout = setTimeout(() => {
                    filterFrameContent(frame);
                }, 100);
            }
        });

        // 开始观察frame内部的变化
        observer.observe(frame, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // 存储观察器实例
        frameObservers.set(frame, observer);
    }

    // 设置全局观察器来监听新frame的添加
    function setupGlobalObserver() {
        const globalObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            // 检查是否添加了新的frame
                            if (node.classList && node.classList.contains('row') && node.classList.contains('an-res-row-frame')) {
                                console.log('DBD-RawsBanHelper: 检测到新frame添加');
                                // 给新frame一点时间加载内容
                                setTimeout(() => {
                                    observeFrameContent(node);
                                }, 200);
                            }

                            filter731();

                            // 检查子元素中是否包含新的frame
                            const newFrames = node.querySelectorAll ? node.querySelectorAll('.row.an-res-row-frame') : [];
                            newFrames.forEach(newFrame => {
                                console.log('DBD-RawsBanHelper: 检测到子元素中的新frame');
                                setTimeout(() => {
                                    observeFrameContent(newFrame);
                                }, 200);
                            });
                        }
                    });
                }
            });
        });

        globalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('DBD-RawsBanHelper: 全局观察器已启动');
    }

    // 过滤单个frame的内容
    function filterFrameContent(frame) {
        let removedCount = 0;
        let matchedKeywords = new Set();
        // 查找frame中的所有资源元素
        const resourceElements = frame.querySelectorAll('div.sk-col.tag-res-name');

        resourceElements.forEach(element => {
            // 检查元素是否已经被过滤
            if (element.classList.contains(config.filterClass)) {
                return;
            }
            const keywords = containsTargetText(element.textContent);
            if (keywords) {
                keywords.forEach(keyword => matchedKeywords.add(keyword));
                if (element.innerHTML == keywords) {
                    element.parentNode.remove();
                }
                removedCount++;
            }
        });

        if (removedCount > 0) {
            const keywordsText = Array.from(matchedKeywords).join('、');
            console.log(`DBD-RawsBanHelper: 在当前frame中过滤了 ${removedCount} 个资源，匹配关键词: ${keywordsText}`);
        }

        return { removedCount, matchedKeywords: Array.from(matchedKeywords) };
    }

        // 重新着色动漫花园表格行
    function recolorDmhyTableRows() {
        const rows = document.querySelectorAll('tbody tr:not(.' + config.filterClass + ')');

        rows.forEach((row, index) => {
            // 清空现有的颜色类
            row.classList.remove('even', 'odd');

            // 添加新的颜色类
            if (index % 2 === 0) {
                row.classList.add('odd');
            } else {
                row.classList.add('even');
            }
        });
        console.log('DBD-RawsBanHelper: 执行重新渲染行色');
    }

    // 重新着色末日动漫表格行
    function recolorAcgnxTableRows() {
        const rows = document.querySelectorAll('tbody tr:not(.' + config.filterClass + ')');

        rows.forEach((row, index) => {
            // 移除现有的颜色类
            row.classList.remove('alt1', 'alt2');

            // 添加新的颜色类
            if (index % 2 === 0) {
                row.classList.add('alt1');
            } else {
                row.classList.add('alt2');
            }
        });
        console.log('DBD-RawsBanHelper: 执行重新渲染行色');
    }

    // 主过滤函数
    function filterContent() {
        // 对于静态页面，确保只执行一次
        if (!isDynamicPage() && hasExecutedStaticFilter) {
            console.log('DBD-RawsBanHelper: 静态页面已执行过过滤，跳过本次执行');
            return { removedCount: 0, matchedKeywords: [] };
        }

        console.log('DBD-RawsBanHelper: 开始执行内容过滤');
        let rowsRemoved = 0;
        let matchedKeywords = new Set();

        // 根据网站结构选择不同的处理方式
        if (window.location.hostname.includes('dmhy.org')) {
            console.log('DBD-RawsBanHelper: 处理动漫花园网站');
            const result = filterDmhyContent();
            rowsRemoved = result.removedCount;
            result.matchedKeywords.forEach(keyword => matchedKeywords.add(keyword));
        } else if (window.location.hostname.includes('acgnx.se')) {
            console.log('DBD-RawsBanHelper: 处理末日动漫网站');
            const result = filterAcgnxContent();
            rowsRemoved = result.removedCount;
            result.matchedKeywords.forEach(keyword => matchedKeywords.add(keyword));
        } else if (window.location.hostname.includes('nyaa')) {
            console.log('DBD-RawsBanHelper: 处理Nyaa网站');
            const result = filterNyaaContent();
            rowsRemoved = result.removedCount;
            result.matchedKeywords.forEach(keyword => matchedKeywords.add(keyword));
        } else if (isMikananiSite()) {
            console.log('DBD-RawsBanHelper: 处理蜜柑计划网站');
            const result = filterMikananiContent();
            rowsRemoved = result.removedCount;
            result.matchedKeywords.forEach(keyword => matchedKeywords.add(keyword));
        }

        // 显示过滤通知
        if (rowsRemoved > 0) {
            const keywordsText = Array.from(matchedKeywords).join('、');
            console.log(`DBD-RawsBanHelper: 过滤完成，共移除 ${rowsRemoved} 个资源，匹配关键词: ${keywordsText}`);
        } else if (rowsRemoved === 0) {
            console.log('DBD-RawsBanHelper: 未找到需要过滤的内容');
        }

        // 标记静态页面已执行
        if (!isDynamicPage()) {
            hasExecutedStaticFilter = true;
        }

        return { removedCount: rowsRemoved, matchedKeywords: Array.from(matchedKeywords) };
    }

    // 过滤动漫花园内容
    function filterDmhyContent() {
        let removedCount = 0;
        let matchedKeywords = new Set();

        const rows = document.querySelectorAll('tr');
        if (rows.length > 5) {
            rows.forEach((row, index) => {
                const keywords = containsTargetText(row.textContent);
                if (keywords && !row.classList.contains(config.filterClass)) {
                    keywords.forEach(keyword => matchedKeywords.add(keyword));
                    row.parentNode.removeChild(row);
                    removedCount++;
                }
            });
        }
        recolorDmhyTableRows();
        console.log(`DBD-RawsBanHelper: 动漫花园 - 移除了 ${removedCount} 行`);
        return { removedCount, matchedKeywords: Array.from(matchedKeywords) };
    }

    // 过滤末日动漫内容
    function filterAcgnxContent() {
        let removedCount = 0;
        let matchedKeywords = new Set();

        const elements = document.querySelectorAll('tr');
        if (elements.length > 5) {
            elements.forEach((element, index) => {
                const keywords = containsTargetText(element.textContent);
                if (keywords && !element.classList.contains(config.filterClass)) {
                    keywords.forEach(keyword => matchedKeywords.add(keyword));
                    element.parentNode.removeChild(element);
                    removedCount++;
                 }
            });
        }
        recolorAcgnxTableRows();
        console.log(`DBD-RawsBanHelper: 末日动漫 - 移除了 ${removedCount} 行`);
        return { removedCount, matchedKeywords: Array.from(matchedKeywords) };
    }

    // 过滤Nyaa内容
    function filterNyaaContent() {
        let removedCount = 0;
        let matchedKeywords = new Set();

        const rows = document.querySelectorAll('tr');
        if (rows.length > 0) {
            rows.forEach((row, index) => {
                const keywords = containsTargetText(row.textContent);
                if (keywords && !row.classList.contains(config.filterClass)) {
                    keywords.forEach(keyword => matchedKeywords.add(keyword));
                    row.parentNode.removeChild(row);
                    removedCount++;
                }
            });
        }

        console.log(`DBD-RawsBanHelper: Nyaa - 移除了 ${removedCount} 行`);
        return { removedCount, matchedKeywords: Array.from(matchedKeywords) };
    }

    // 过滤蜜柑计划内容
    function filterMikananiContent() {
        let removedCount = 0;
        let matchedKeywords = new Set();

        // 处理列表模式
        if (isMikananiClassicMode()) {
            console.log('DBD-RawsBanHelper: 检测到蜜柑计划列表模式');
            const result = filterMikananiClassicMode();
            removedCount = result.removedCount;
            result.matchedKeywords.forEach(keyword => matchedKeywords.add(keyword));
        } else {
            // 处理普通模式
            const result = filterMikananiNormalMode();
            removedCount = result.removedCount;
            result.matchedKeywords.forEach(keyword => matchedKeywords.add(keyword));
        }

        console.log(`DBD-RawsBanHelper: 蜜柑计划 - 移除了 ${removedCount} 行`);
        return { removedCount, matchedKeywords: Array.from(matchedKeywords) };
    }

    // 过滤蜜柑计划列表模式内容
    function filterMikananiClassicMode() {
        let removedCount = 0;
        let matchedKeywords = new Set();

        //查找所有包含magnet-link-wrap的tr行
        const rows = document.querySelectorAll('tr');

        rows.forEach(row => {
            const magnetLink = row.querySelector('a.magnet-link-wrap');
            if (magnetLink) {
                const keywords = containsTargetText(magnetLink.textContent);
                if (keywords) {
                    keywords.forEach(keyword => matchedKeywords.add(keyword));
                    row.parentNode.removeChild(row);
                    removedCount++;
                }
            }
        });
        return { removedCount, matchedKeywords: Array.from(matchedKeywords) };
    }

    // 过滤蜜柑计划普通模式内容
    function filterMikananiNormalMode() {
        let removedCount = 0;
        let matchedKeywords = new Set();

        // 1. 过滤主内容表格行
        const allRows = document.querySelectorAll('tr[data-itemindex]');
        const rowsToRemove = [];

        allRows.forEach(row => {
            const keywords = containsTargetText(row.textContent);
            if (keywords && !row.classList.contains(config.filterClass)) {
                keywords.forEach(keyword => matchedKeywords.add(keyword));
                rowsToRemove.push(row);
            }
        });

        rowsToRemove.forEach(row => {
            row.parentNode.removeChild(row);
            removedCount++;
        });

        // 重新排序剩余的行的data-itemindex
        if (removedCount > 0) {
            reindexMikananiTable();
        }

        // 2. 过滤"相关字幕组"列表（搜索页面）
        const subtitleGroups = document.querySelectorAll('.leftbar-nav');
        subtitleGroups.forEach(container => {
            const items = container.querySelectorAll('a, span, li, div');
            items.forEach(item => {
                const keywords = containsTargetText(item.textContent);
                if (keywords && !item.classList.contains(config.filterClass)) {
                    keywords.forEach(keyword => matchedKeywords.add(keyword));
                    item.parentNode.removeChild(item);
                    removedCount++;
                }
            });
        });

        const targetDiv = document.getElementById('575');
        if (targetDiv) {
            const nextTable = targetDiv.nextElementSibling;
            if (nextTable && nextTable.tagName === 'TABLE') {
                nextTable.remove();
            }
            targetDiv.remove();
        }
        return { removedCount, matchedKeywords: Array.from(matchedKeywords) };
    }

    // 重新索引蜜柑计划表格的data-itemindex
    function reindexMikananiTable() {
        const allRows = document.querySelectorAll('tr[data-itemindex]');
        const sortedRows = Array.from(allRows).sort((a, b) => {
            const indexA = parseInt(a.getAttribute('data-itemindex'));
            const indexB = parseInt(b.getAttribute('data-itemindex'));
            return indexA - indexB;
        });

        sortedRows.forEach((row, index) => {
            row.setAttribute('data-itemindex', index + 1);
        });
    }

    console.log('DBD-RawsBanHelper: 脚本初始化完成');
})();
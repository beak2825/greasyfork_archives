// ==UserScript==
// @name         超链接关键词精准屏蔽器（高性能版）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  精准屏蔽包含特定关键词的超链接，优化性能避免卡顿
// @author       ChatGPT
// @match        *://*/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559446/%E8%B6%85%E9%93%BE%E6%8E%A5%E5%85%B3%E9%94%AE%E8%AF%8D%E7%B2%BE%E5%87%86%E5%B1%8F%E8%94%BD%E5%99%A8%EF%BC%88%E9%AB%98%E6%80%A7%E8%83%BD%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/559446/%E8%B6%85%E9%93%BE%E6%8E%A5%E5%85%B3%E9%94%AE%E8%AF%8D%E7%B2%BE%E5%87%86%E5%B1%8F%E8%94%BD%E5%99%A8%EF%BC%88%E9%AB%98%E6%80%A7%E8%83%BD%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 预设关键词列表（可自定义修改）
    const keywords = [
        "伪娘", "扶她", "性转", "正太", "雌堕", "男娘",
        "ai润色", "ai创作", "ai续", "ai辅助", "ai仿写", 
        "未完结", "翻译"
    ];
    
    // 性能优化配置
    const config = {
        debounceDelay: 100, // 防抖延迟(ms)
        maxProcessingTime: 50, // 单次处理最大时间(ms)
        batchSize: 20, // 批量处理数量
        observeChanges: true // 是否监听DOM变化
    };
    
    // 状态标记
    let isProcessing = false;
    let processedLinks = new Set();
    let observer = null;
    
    // 构建高性能正则表达式
    function buildKeywordRegex() {
        // 简繁体映射（精简版）
        const tradMap = {
            '伪': '偽', '娘': '娘', '扶': '扶', '她': '她',
            '性': '性', '转': '轉', '正': '正', '太': '太',
            '雌': '雌', '堕': '墮', '男': '男', '润': '潤',
            '色': '色', '创': '創', '作': '作', '续': '續',
            '辅': '輔', '助': '助', '仿': '仿', '写': '寫',
            '未': '未', '完': '完', '结': '結', '翻': '翻', '译': '譯'
        };
        
        // 生成正则表达式模式
        const patterns = keywords.map(keyword => {
            // 简繁体转换
            let tradKeyword = '';
            for (let char of keyword) {
                tradKeyword += tradMap[char] || char;
            }
            
            // 构建模糊匹配模式（允许非字母数字字符分隔）
            const chars = keyword.split('');
            const tradChars = tradKeyword.split('');
            
            // 生成匹配模式：字符间允许特殊字符，但保持顺序
            const pattern = `(${chars.join('[\\W_]*')}|${tradChars.join('[\\W_]*')})`;
            return pattern;
        });
        
        // 合并所有模式，使用单词边界确保完整匹配
        const fullPattern = `\\b(?:${patterns.join('|')})\\b`;
        
        try {
            return new RegExp(fullPattern, 'i');
        } catch (e) {
            console.error('正则表达式构建失败:', e);
            return null;
        }
    }
    
    // 创建关键词匹配器
    const keywordRegex = buildKeywordRegex();
    if (!keywordRegex) {
        console.error('关键词屏蔽器: 正则表达式初始化失败');
        return;
    }
    
    // 精准关键词检测
    function containsKeyword(text) {
        if (!text || typeof text !== 'string') return false;
        return keywordRegex.test(text);
    }
    
    // 高效处理单个链接
    function processLink(link) {
        if (processedLinks.has(link) || !link.textContent) return false;
        
        const linkText = link.textContent.trim();
        
        if (containsKeyword(linkText)) {
            // 标记为已处理
            processedLinks.add(link);
            
            // 保存原始内容
            const originalHtml = link.innerHTML;
            const originalHref = link.href;
            
            // 应用屏蔽样式
            link.style.cssText = `
                color: red !important;
                font-weight: bold !important;
                text-decoration: line-through !important;
                cursor: not-allowed !important;
            `;
            
            // 设置标题提示
            link.title = `已屏蔽 - 原始内容: ${linkText}`;
            
            // 添加鼠标事件
            link.addEventListener('mouseover', function() {
                this.style.color = 'green !important';
                this.style.textDecoration = 'underline !important';
            });
            
            link.addEventListener('mouseout', function() {
                this.style.color = 'red !important';
                this.style.textDecoration = 'line-through !important';
            });
            
            // 阻止点击
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
            
            // 添加屏蔽标记属性
            link.setAttribute('data-filtered', 'true');
            
            return true;
        }
        
        return false;
    }
    
    // 批量处理链接（性能优化）
    function processLinksBatch(links, startIndex = 0) {
        const startTime = performance.now();
        let processedCount = 0;
        let blockedCount = 0;
        
        for (let i = startIndex; i < Math.min(links.length, startIndex + config.batchSize); i++) {
            if (performance.now() - startTime > config.maxProcessingTime) {
                // 超时，安排下一批处理
                setTimeout(() => processLinksBatch(links, i), config.debounceDelay);
                break;
            }
            
            if (processLink(links[i])) {
                blockedCount++;
            }
            processedCount++;
        }
        
        return { processedCount, blockedCount };
    }
    
    // 主处理函数（防抖优化）
    function processPage() {
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            const links = document.querySelectorAll('a:not([data-filtered])');
            let totalProcessed = 0;
            let totalBlocked = 0;
            
            // 分批处理避免阻塞
            for (let i = 0; i < links.length; i += config.batchSize) {
                const batchLinks = Array.from(links).slice(i, i + config.batchSize);
                const result = processLinksBatch(batchLinks);
                totalProcessed += result.processedCount;
                totalBlocked += result.blockedCount;
            }
            
            if (totalBlocked > 0) {
                console.log(`关键词屏蔽器: 处理 ${totalProcessed} 个链接，屏蔽 ${totalBlocked} 个`);
            }
        } catch (error) {
            console.error('关键词屏蔽器处理错误:', error);
        } finally {
            isProcessing = false;
        }
    }
    
    // 防抖函数
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // 优化后的DOM变化监听
    function setupMutationObserver() {
        if (!config.observeChanges) return;
        
        const debouncedProcess = debounce(processPage, config.debounceDelay);
        
        observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // 检查新增节点是否包含链接
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'A' || 
                                (node.querySelector && node.querySelector('a'))) {
                                shouldProcess = true;
                                break;
                            }
                        }
                    }
                }
                
                if (shouldProcess) break;
            }
            
            if (shouldProcess) {
                debouncedProcess();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }
    
    // 初始化函数
    function init() {
        console.log('关键词屏蔽器: 初始化开始');
        
        // 页面加载完成后处理
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(processPage, 100);
                setupMutationObserver();
            });
        } else {
            setTimeout(processPage, 100);
            setupMutationObserver();
        }
        
        // 监听页面可见性变化，避免后台时不必要的处理
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(processPage, 500);
            }
        });
    }
    
    // 启动脚本
    init();
})();
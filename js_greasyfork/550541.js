// ==UserScript==
// @name         豆瓣全文无跳转展开
// @namespace    https://github.com/yourname/douban-fulltext
// @version      3.9.0
// @description  ✨ 终极场景化控制！动态流智能展开，图书/影视/同城页直接跳转，"提醒"中的链接纯净跳转。
// @author       MA GUANG + Qwen3-Max + Claude Sonnet 4
// @license      MIT
// @match        *://www.douban.com/
// @match        *://www.douban.com/?*
// @match        *://www.douban.com/people/*
// @match        *://www.douban.com/people/*?*
// @match        *://www.douban.com/group/*
// @match        *://www.douban.com/topic/*
// @match        *://www.douban.com/note/*
// @match        *://book.douban.com/annotation/*
// @match        *://book.douban.com/review/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.douban.com
// @connect      book.douban.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/550541/%E8%B1%86%E7%93%A3%E5%85%A8%E6%96%87%E6%97%A0%E8%B7%B3%E8%BD%AC%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/550541/%E8%B1%86%E7%93%A3%E5%85%A8%E6%96%87%E6%97%A0%E8%B7%B3%E8%BD%AC%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义配置区域
    const DEFAULT_CONFIG = {
        charLimit: 1500, // 字数阈值，小于该数字后自动展开，超过该数字后跳转到新页面，可自行修改
        imageLimit: 4,   // 图片数量阈值，小于该数字后自动展开，超过该数字后跳转到新页面，可自行修改
    };

    // 获取配置
    function getConfig(key) {
        return GM_getValue(key, DEFAULT_CONFIG[key]);
    }

    // 样式注入
    GM_addStyle(`
        .douban-fulltext-loading {
            display: inline-block;
            padding: 2px 6px;
            color: #666;
            font-size: 12px;
            background: #f5f5f5;
            border-radius: 12px;
            margin-left: 5px;
            vertical-align: middle;
            animation: loading 1.4s infinite linear;
        }
        @keyframes loading {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
        }

        .douban-fulltext-threshold-info {
            display: inline-block;
            padding: 4px 8px;
            color: #e74c3c;
            font-size: 11px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 12px;
            margin-left: 5px;
            vertical-align: middle;
            font-weight: bold;
            white-space: nowrap;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .douban-fulltext-error {
            display: inline-block;
            color: #e51c23;
            font-size: 12px;
            margin-left: 5px;
            cursor: pointer;
            text-decoration: underline;
            vertical-align: middle;
        }

        .douban-fulltext-success {
            color: #4CAF50;
            font-size: 12px;
            margin-left: 5px;
            vertical-align: middle;
        }
    `);

    /**
     * 精准统计正文内容字数
     */
    function countDoubanBodyTextChars(contentElement) {
        if (!contentElement) return 0;

        const clonedElement = contentElement.cloneNode(true);

        // 移除无关元素
        const elementsToRemove = [
            '.ft', '.note-ft', '.desc', '.info', '.meta',
            '.actions', '.footer', '.copyright', '.author',
            '.date', '.source', '.tags', '.category',
            '.aside', '.sidebar', '.related', '.recommend',
            '.comments', '.comment', '.reply'
        ];

        elementsToRemove.forEach(selector => {
            clonedElement.querySelectorAll(selector).forEach(el => {
                el.remove();
            });
        });

        // 获取并清理文本
        let textContent = clonedElement.textContent || '';

        // 移除特定干扰文本
        textContent = textContent.replace(/\d+人阅读/g, '');
        textContent = textContent.replace(/表示其中内容是对原文的摘抄/g, '');
        textContent = textContent.replace(/说明 · · · · · ·/g, '');
        textContent = textContent.replace(/引自.*$/gm, '');
        textContent = textContent.replace(/来自 豆瓣App/g, '');

        const cleanText = textContent
            .replace(/\s+/g, ' ')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .trim();

        return cleanText.length;
    }

    /**
     * 安全替换内容
     */
    function safeReplaceContent(originalContainer, newContent, loadingElement, fullTextLink) {
        try {
            if (!newContent || !newContent.textContent || newContent.textContent.trim().length < 10) {
                throw new Error('新内容无效或过短');
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'douban-fulltext-container';

            const clonedContent = newContent.cloneNode(true);

            // 修复图片
            clonedContent.querySelectorAll('img[data-origin]').forEach(img => {
                if (!img.src || img.src.includes('placeholder')) {
                    img.src = img.dataset.origin;
                }
            });

            originalContainer.innerHTML = '';
            originalContainer.appendChild(wrapper);
            wrapper.appendChild(clonedContent);

            const success = document.createElement('span');
            success.className = 'douban-fulltext-success';
            success.textContent = '✓ 已展开';

            if (loadingElement && loadingElement.parentNode) {
                loadingElement.parentNode.replaceChild(success, loadingElement);
            }

            if (fullTextLink && fullTextLink.parentNode) {
                fullTextLink.parentNode.removeChild(fullTextLink);
            }

            return true;
        } catch (error) {
            console.error('安全替换失败:', error);
            return false;
        }
    }

    /**
     * 检查内容是否符合阈值条件
     */
    function checkContentThresholds(contentElement) {
        const charLimit = getConfig('charLimit');
        const imageLimit = getConfig('imageLimit');

        const charCount = countDoubanBodyTextChars(contentElement);

        const images = contentElement.querySelectorAll('img:not([src*="icon"]):not([src*="avatar"]):not([src*="placeholder"])');
        const imageCount = images.length;

        const exceedsCharLimit = charCount > charLimit;
        const exceedsImageLimit = imageCount > imageLimit;

        return {
            charCount,
            imageCount,
            exceedsCharLimit,
            exceedsImageLimit,
            shouldOpenInNewPage: exceedsCharLimit || exceedsImageLimit
        };
    }

    /**
     * 🚀 核心函数：判断链接是否应直接跳转
     * 在动态流中，以下链接应直接跳转，不做任何分析：
     * 1. 图书主页面 (book.douban.com/subject/)
     * 2. 影视主页面 (movie.douban.com/subject/)
     * 3. 同城活动页面 (www.douban.com/location/)
     */
    function shouldDirectJump(fullUrl) {
        return (
            fullUrl.includes('book.douban.com/subject/') ||
            fullUrl.includes('movie.douban.com/subject/') ||
            fullUrl.includes('www.douban.com/location/')
        );
    }

    /**
     * 🚫 终极修复：“提醒”弹窗链接纯净跳转
     * 1. 为链接添加特殊标记
     * 2. 克隆新元素以清除所有原有事件
     */
    function handleReminderLinks() {
        // 选择提醒弹窗中的所有链接
        const reminderLinks = document.querySelectorAll('#top-nav-notimenu a[href]');

        reminderLinks.forEach(link => {
            // 跳过已处理的链接
            if (link.dataset.reminderProcessed) return;
            link.dataset.reminderProcessed = 'true';

            // 🚩 标记这是“提醒”中的链接
            link.dataset.reminderLink = 'true';

            // 🚫 核心修复：克隆新元素，彻底清除原有事件监听器
            const newLink = link.cloneNode(true);
            newLink.dataset.reminderLink = 'true'; // 新元素也要标记

            // 替换旧链接
            link.parentNode.replaceChild(newLink, link);

            // 为新链接添加纯净的直接跳转事件
            newLink.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ 在“提醒”中检测到链接，纯净直接跳转:', this.href);
                window.open(this.href, '_blank');
            });
        });
    }

    /**
     * 处理动态流中的"全文"链接
     */
    function processFeedFullTextLink(link) {
        // 🚫 核心修复：如果是“提醒”中的链接，直接跳过，不处理
        if (link.dataset.reminderLink === 'true') {
            console.log('🚫 跳过“提醒”中的链接:', link.href);
            return;
        }

        if (link.dataset.fulltextProcessed) return;
        link.dataset.fulltextProcessed = 'true';

        const isFullTextLink =
            link.textContent.includes('全文') ||
            link.textContent.includes('展开') ||
            link.textContent.includes('...') ||
            link.href.includes('_dtcc=1');

        if (!isFullTextLink) return;

        const fullUrl = link.href;

        // 🚀 场景1：如果是图书/影视/同城页面，直接跳转
        if (shouldDirectJump(fullUrl)) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚀 在动态流中检测到特殊页面，直接跳转:', fullUrl);
                window.open(fullUrl, '_blank');
            });
            return;
        }

        // 🚀 场景2：其他链接，进行字数统计和阈值判断
        let contentContainer = null;

        if (window.location.hostname === 'www.douban.com' && window.location.pathname.includes('/note/')) {
            contentContainer = link.closest('.note-content, .content, .obligate, #link-report, .article-content');
        } else {
            contentContainer = link.closest('.content, .brief, .status-content, .topic-content, .obligate, .note-content, .status-text, .topic-reply-content, .article-content');
        }

        if (!contentContainer) {
            console.warn('无法找到合适的内容容器');
            return;
        }

        const originalContent = contentContainer.innerHTML;

        link.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            const loading = document.createElement('span');
            loading.className = 'douban-fulltext-loading';
            loading.textContent = '分析中...';
            this.parentNode.insertBefore(loading, this);

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: fullUrl,
                        headers: {
                            'Referer': window.location.href,
                            'Accept': 'text/html,application/xhtml+xml'
                        },
                        timeout: 8000,
                        onload: resolve,
                        onerror: reject,
                        ontimeout: () => reject(new Error('请求超时'))
                    });
                });

                if (response.status !== 200) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');

                let fullContent = null;

                if (fullUrl.includes('/annotation/') || fullUrl.includes('/review/')) {
                    fullContent = doc.querySelector('.note > .content') ||
                                 doc.querySelector('.note-content') ||
                                 doc.querySelector('.content');
                } else if (fullUrl.includes('/note/')) {
                    fullContent = doc.querySelector('#link-report') ||
                                 doc.querySelector('.note-content') ||
                                 doc.querySelector('.content');
                } else if (fullUrl.includes('/topic/')) {
                    fullContent = doc.querySelector('.topic-content .content') ||
                                 doc.querySelector('.topic-content') ||
                                 doc.querySelector('.content');
                } else {
                    fullContent = doc.querySelector('.content, .brief, .status-content, .topic-content, .obligate');
                }

                if (!fullContent) {
                    throw new Error('无法提取有效内容');
                }

                // 检查阈值
                const thresholdInfo = checkContentThresholds(fullContent);

                if (thresholdInfo.shouldOpenInNewPage) {
                    loading.textContent = '';

                    // 单行提示
                    const thresholdInfoSpan = document.createElement('span');
                    thresholdInfoSpan.className = 'douban-fulltext-threshold-info';
                    thresholdInfoSpan.textContent = `内容过多(${thresholdInfo.charCount}字/${thresholdInfo.imageCount}图)，新页打开`;

                    loading.parentNode.replaceChild(thresholdInfoSpan, loading);

                    setTimeout(() => {
                        window.open(fullUrl, '_blank');
                    }, 2000);

                    return;
                }

                // 在当前页面展开
                loading.textContent = '展开中...';
                const success = safeReplaceContent(contentContainer, fullContent, loading, this);

                if (!success) {
                    throw new Error('内容替换失败');
                }

            } catch (error) {
                console.error('展开全文失败:', error.message);

                // 恢复原始内容
                contentContainer.innerHTML = originalContent;

                if (loading.parentNode) {
                    loading.textContent = '';
                    const errorDiv = document.createElement('span');
                    errorDiv.className = 'douban-fulltext-error';
                    errorDiv.textContent = '加载失败，点击查看原文';
                    errorDiv.onclick = () => {
                        window.open(fullUrl, '_blank');
                    };
                    loading.parentNode.replaceChild(errorDiv, loading);
                }
            }
        });
    }

    /**
     * 扫描并处理页面中的所有"全文"链接
     */
    function handleFullTextLinks() {
        // 处理“提醒”弹窗中的链接
        handleReminderLinks();

        // 处理动态流中的"全文"链接
        document.querySelectorAll('a[href*="_dtcc=1"], a[href*="/topic/"], a[href*="/note/"], a[href*="/annotation/"], a[href*="/review/"]').forEach(link => {
            processFeedFullTextLink(link);
        });
    }

    // 初始化
    setTimeout(handleFullTextLinks, 1500);

    const observer = new MutationObserver(function(mutations) {
        clearTimeout(observer.debounceTimer);
        observer.debounceTimer = setTimeout(handleFullTextLinks, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('豆瓣全文无跳转展开脚本已启动');
})();
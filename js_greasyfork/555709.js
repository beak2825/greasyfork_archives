// ==UserScript==
// @name         New Oriental TestGTS TOEFL Toolbox
// @namespace    https://blog.wynn.moe/
// @version      1.2
// @description  适用于新东方TestGTS平台TOEFL模考的工具
// @author       Wynn Zeng
// @license      MIT
// @match        https://www.testgts.com/toeflMockBrowse/*
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555709/New%20Oriental%20TestGTS%20TOEFL%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/555709/New%20Oriental%20TestGTS%20TOEFL%20Toolbox.meta.js
// ==/UserScript==

/* jshint esversion: 11 */
(function() {
    'use strict';

    // ========================================
    // Constants and Configuration
    // ========================================
    const CONFIG = {
        STORAGE_KEY: 'gtsMockExtractedContent',
        STORAGE_IDS_KEY: 'gtsMockProcessedIds',
        INIT_DELAY: 100,
        DEBOUNCE_DELAY: 300,
        SELECTORS: {
            gtsWrapper: '.gts-wrapper',
            subView: '.sub-view',
            material: '.material',
            activeListItem: 'ul.num-list li.active',
            materialContent: '.mCSB_container .en, .mCSB_container .ui-accordion-content',
            question: '.question',
            mCSBContainer: '.mCSB_container',
            answerListItems: '.gts-question-options li, .gts-question-multiple li, li .checked',
            cleanupSelectors: ['.ui-widget-overlay', '.ui-widget-content']
        }
    };

    // ========================================
    // Utility Functions
    // ========================================

    /**
     * Sleep utility with promise
     */
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Debounce function to prevent rapid clicks
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Cache for DOM queries
     */
    class DOMCache {
        constructor() {
            this.cache = new Map();
            this.setupMutationObserver();
        }

        get(selector, context = document) {
            const key = `${selector}_${context.nodeName}`;
            if (!this.cache.has(key)) {
                const element = context.querySelector(selector);
                if (element) {
                    this.cache.set(key, element);
                }
                return element;
            }
            return this.cache.get(key);
        }

        getAll(selector, context = document) {
            const key = `all_${selector}_${context.nodeName}`;
            if (!this.cache.has(key)) {
                const elements = Array.from(context.querySelectorAll(selector));
                this.cache.set(key, elements);
                return elements;
            }
            return this.cache.get(key);
        }

        clear() {
            this.cache.clear();
        }

        setupMutationObserver() {
            // Clear cache when DOM changes significantly
            const observer = new MutationObserver(debounce(() => {
                this.clear();
            }, 500));

            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }
    }

    const domCache = new DOMCache();

    /**
     * Optimized User Agent modification
     */
    function modifyUserAgent() {
        const requiredTokens = ['Chrome', 'Safari'];
        let newUA = navigator.userAgent;

        requiredTokens.forEach(token => {
            if (!newUA.includes(token)) {
                newUA += ` ${token}`;
            }
        });

        Object.defineProperty(navigator, 'userAgent', {
            get: () => newUA,
            configurable: true
        });
    }

    /**
     * Optimized DOM cleanup with batch removal
     */
    function cleanupDOM() {
        const fragment = document.createDocumentFragment();
        let removedCount = 0;

        CONFIG.SELECTORS.cleanupSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el?.parentNode) {
                    el.parentNode.removeChild(el);
                    removedCount++;
                }
            });
        });

        if (removedCount > 0) {
            console.log(`Cleaned up ${removedCount} DOM elements`);
        }
    }

    /**
     * Generate unique question ID from URL parameters
     */
    function getUniqueQuestionId() {
        const urlParams = new URLSearchParams(window.location.search);
        return Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('|') || 'NO_PARAMS_FOUND';
    }

    /**
     * Optimized text cleaning using regex
     */
    function cleanExtractedText(text) {
        return text
            .replace(/[\r\n]{2,}/g, '\n')
            .replace(/\s{4,}/g, ' ')
            .trim();
    }

    /**
     * Get modified list item text with answer marking
     */
    function getModifiedLiText(liElement) {
        const text = liElement.textContent.trim();
        const hasChecked = liElement.querySelector('.checked');
        const marker = ' （正确答案）';

        return hasChecked && !text.includes(marker) ? text + marker : text;
    }

    // ========================================
    // Content Extraction
    // ========================================

    /**
     * Extract material content (optimized)
     */
    function extractMaterialContent(gtsWrapper) {
        const content = [];
        const activeListItem = domCache.get(CONFIG.SELECTORS.activeListItem, gtsWrapper);

        if (activeListItem?.textContent.trim() === '1') {
            const materialElement = domCache.get(CONFIG.SELECTORS.material, gtsWrapper);
            if (materialElement) {
                const contentElements = domCache.getAll(
                    CONFIG.SELECTORS.materialContent,
                    materialElement
                );

                contentElements.forEach((element, index) => {
                    const text = element.textContent.trim();
                    const title = element.classList.contains('en')
                        ? `[English Text (EN) ${index + 1}]`
                        : `[Accordion Content ${index + 1}]`;

                    content.push(`${title}:\n${text}\n---`);
                });
            }
        }

        return content;
    }

    /**
     * Extract answer options (optimized)
     */
    function extractAnswerOptions(subView) {
        const answerOptions = new Set(); // Use Set to avoid duplicates
        const questions = domCache.get(CONFIG.SELECTORS.question, subView);

        if (!questions) return [];

        const QmCSB = domCache.get(CONFIG.SELECTORS.mCSBContainer, questions);
        if (!QmCSB) return [];

        const allAnswerListItems = domCache.getAll('li', QmCSB);

        allAnswerListItems.forEach(li => {
            const isRelevant = li.closest('.gts-question-options') ||
                             li.closest('.gts-question-multiple') ||
                             li.querySelector('.checked');

            if (isRelevant) {
                answerOptions.add(getModifiedLiText(li));
            }
        });

        return Array.from(answerOptions);
    }

    /**
     * Main content extraction function (optimized)
     */
    function extractAndProcessContent() {
        const gtsWrapper = domCache.get(CONFIG.SELECTORS.gtsWrapper);

        if (!gtsWrapper) {
            console.error('Error: .gts-wrapper not found.');
            return '';
        }

        const extractedContent = [];
        const firstSubView = domCache.get(CONFIG.SELECTORS.subView, gtsWrapper);

        if (!firstSubView) {
            return '';
        }

        // Extract material content
        const materialContent = extractMaterialContent(gtsWrapper);
        extractedContent.push(...materialContent);

        // Extract question context
        const materialElement = domCache.get(CONFIG.SELECTORS.material, gtsWrapper);
        let cleanSubViewText = firstSubView.textContent;

        if (materialElement) {
            cleanSubViewText = cleanSubViewText.replace(materialElement.textContent, ' ');
        }

        extractedContent.push(`[Question and Context]:\n${cleanSubViewText.trim()}\n---`);

        // Extract answer options
        const answerOptions = extractAnswerOptions(firstSubView);
        if (answerOptions.length > 0) {
            extractedContent.push(`[Answer Options with Marking]:\n${answerOptions.join('\n')}\n---`);
        }

        return cleanExtractedText(extractedContent.join('\n'));
    }

    // ========================================
    // Storage Management
    // ========================================

    /**
     * Storage manager with caching
     */
    class StorageManager {
        constructor() {
            this.cache = {
                content: null,
                ids: null
            };
        }

        getContent() {
            if (this.cache.content === null) {
                this.cache.content = JSON.parse(
                    localStorage.getItem(CONFIG.STORAGE_KEY) || '[]'
                );
            }
            return this.cache.content;
        }

        getProcessedIds() {
            if (this.cache.ids === null) {
                this.cache.ids = new Set(
                    JSON.parse(localStorage.getItem(CONFIG.STORAGE_IDS_KEY) || '[]')
                );
            }
            return this.cache.ids;
        }

        addContent(content, questionId) {
            if (!content) return false;

            const processedIds = this.getProcessedIds();

            if (processedIds.has(questionId)) {
                alert(`🚫 警告：该题目内容已添加，无需重复添加！\n\n当前已收集题目数: ${processedIds.size}`);
                return false;
            }

            const storedData = this.getContent();
            storedData.push(content);

            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(storedData));
            this.cache.content = storedData;

            processedIds.add(questionId);
            localStorage.setItem(CONFIG.STORAGE_IDS_KEY, JSON.stringify([...processedIds]));
            this.cache.ids = processedIds;

            alert(`✅ 内容已添加！当前已收集 ${storedData.length} 道题目的内容。`);
            return true;
        }

        exportAndClear() {
            const storedData = this.getContent();

            if (storedData.length === 0) {
                alert('⚠️ 本地存储中没有要导出的内容。');
                return;
            }

            const formattedOutput = storedData.join('\n\n======================================\n\n');
            const count = storedData.length;

            const blob = new Blob([formattedOutput], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            // Try to open in new window
            const exportWindow = window.open(url, '_blank', 'width=800,height=600');

            // Clear storage
            localStorage.removeItem(CONFIG.STORAGE_KEY);
            localStorage.removeItem(CONFIG.STORAGE_IDS_KEY);
            this.cache.content = null;
            this.cache.ids = null;
            
            if (exportWindow) {
                const checkClosedInterval = setInterval(() => {
                    if (exportWindow.closed) {
                        clearInterval(checkClosedInterval);
                        console.log("GTS Toolbox: 导出窗口已关闭。");
                        alert(`✅ 已成功导出 ${count} 道题目内容，并清空了本地存储。`);
                        URL.revokeObjectURL(url);
                    }
                }, 500);
            } else {
                URL.revokeObjectURL(url);

                if (typeof GM_download === 'function') {
                    const filename = `GTS_Mock_Data_${new Date().toISOString().slice(0, 10)}.txt`;
                    GM_download({
                        url: url,
                        name: filename,
                        saveAs: true
                    });
                } else {
                    console.warn("Pop-up blocked. Manual copy required.");
                }
            }
        }
    }

    const storage = new StorageManager();

    // ========================================
    // UI Initialization
    // ========================================

    /**
     * Optimized UI initialization with event delegation
     */
    function initializeUI() {
        // Inject styles once
        const styles = `
            .gts-floating-button {
                position: fixed;
                right: 20px;
                z-index: 10000;
                padding: 10px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s, transform 0.1s;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
            }
            .gts-floating-button:hover {
                transform: scale(1.05);
            }
            .gts-floating-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            #gts-add-content-btn {
                top: 20px;
                background-color: #4CAF50;
                color: white;
            }
            #gts-export-data-btn {
                top: 80px;
                background-color: #2196F3;
                color: white;
            }
        `;

        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(styles);
        } else {
            const styleElement = document.createElement('style');
            styleElement.textContent = styles;
            document.head.append(styleElement);
        }

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'gts-button-container';

        // Add Content Button
        const addBtn = createButton('gts-add-content-btn', '➕ Add Content', debounce(async () => {
            addBtn.disabled = true;
            const originalText = addBtn.textContent;
            addBtn.textContent = '⏳ Processing...';

            try {
                const content = extractAndProcessContent();
                const questionId = getUniqueQuestionId();
                storage.addContent(content, questionId);
            } catch (e) {
                alert(`❌ 添加内容时发生错误：${e.message}`);
                console.error(e);
            } finally {
                addBtn.textContent = originalText;
                addBtn.disabled = false;
            }
        }, CONFIG.DEBOUNCE_DELAY));

        // Export Data Button
        const exportBtn = createButton('gts-export-data-btn', '📤 Export Data', debounce(() => {
            storage.exportAndClear();
        }, CONFIG.DEBOUNCE_DELAY));

        buttonContainer.append(addBtn, exportBtn);
        document.body.append(buttonContainer);
    }

    /**
     * Helper to create buttons
     */
    function createButton(id, text, onClick) {
        const button = document.createElement('button');
        button.id = id;
        button.className = 'gts-floating-button';
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    // ========================================
    // Main Execution
    // ========================================

    async function main() {
        modifyUserAgent();
        await sleep(CONFIG.INIT_DELAY);
        cleanupDOM();
        initializeUI();
        console.log('✅ GTS TOEFL Toolbox initialized successfully');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();
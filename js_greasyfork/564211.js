// ==UserScript==
// @name         Chrome Translator API Helper
// @namespace    https://github.com/jun4rui/
// @supportURL   https://github.com/jun4rui/FreshRSS_CN_JS/issues
// @homepageURL  https://github.com/jun4rui/FreshRSS_CN_JS
// @version      1.0
// @description  使用 Chrome 内置 Translator API 进行英译中，记得修改下面的match作为你FreshRSS的网址
// @author       jun4rui君思睿
// @license MIT
// @match        http://192.168.50.144:90/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/564211/Chrome%20Translator%20API%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/564211/Chrome%20Translator%20API%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 翻译实例池
    const translatorPool = [];
    const MAX_POOL_SIZE = 3;
    
    // 检查浏览器是否支持 Translator API
    function isTranslatorSupported() {
        return 'Translator' in window || ('translation' in window && 'createTranslator' in window.translation);
    }

    // 初始化翻译实例池
    async function initializeTranslatorPool() {
        if (translatorPool.length > 0) {
            return translatorPool; // 如果池中已有实例，直接返回
        }
        
        if (!isTranslatorSupported()) {
            console.error('Translator API is not supported in this browser');
            return [];
        }

        try {
            // 创建3个翻译实例
            for (let i = 0; i < MAX_POOL_SIZE; i++) {
                let translator = null;
                
                if ('Translator' in window && 'create' in window.Translator) {
                    // 新版本 API (Chrome 138+)
                    translator = await window.Translator.create({
                        sourceLanguage: 'en',
                        targetLanguage: 'zh'
                    });
                } else if ('translation' in window && 'createTranslator' in window.translation) {
                    // 旧版本 API
                    translator = await window.translation.createTranslator({
                        sourceLanguage: 'en',
                        targetLanguage: 'zh'
                    });
                } else {
                    console.error('Unable to create translator instance');
                    continue;
                }
                
                // 添加状态信息
                translatorPool.push({
                    instance: translator,
                    busy: false,
                    id: i
                });
            }
            
            console.log(`%c${translatorPool.length} Translator instances initialized successfully`, 'color: blue; font-weight: bold;');
            return translatorPool;
        } catch (error) {
            console.error('Failed to initialize translator pool:', error);
            return [];
        }
    }

    // 从池中获取空闲的翻译实例
    function getAvailableTranslator() {
        for (let i = 0; i < translatorPool.length; i++) {
            if (!translatorPool[i].busy) {
                translatorPool[i].busy = true; // 标记为忙碌
                return translatorPool[i];
            }
        }
        return null; // 没有可用实例
    }
    
    // 释放翻译实例
    function releaseTranslator(translatorObj) {
        for (let i = 0; i < translatorPool.length; i++) {
            if (translatorPool[i].id === translatorObj.id) {
                translatorPool[i].busy = false; // 标记为空闲
                break;
            }
        }
    }

    // 使用实例池翻译文本，将英文翻译成中文
    async function translateToChinese(text) {
        if (!text || typeof text !== 'string') {
            console.warn('Invalid input for translation:', text);
            return text;
        }

        // 确保翻译实例池已初始化
        if (translatorPool.length === 0) {
            await initializeTranslatorPool();
            if (translatorPool.length === 0) {
                return text; // 如果初始化失败，返回原文本
            }
        }

        // 获取一个可用的翻译实例，如果没有则等待
        let translatorObj;
        while (!(translatorObj = getAvailableTranslator())) {
            // 等待100毫秒后重试
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`%cUsing translator instance ${translatorObj.id}`, 'color: green; font-weight: bold;');

        try {
            // 使用获取到的实例执行翻译
            const translatedText = await translatorObj.instance.translate(text);
            return translatedText;
        } catch (error) {
            console.error('Translation failed:', error);
            return text; // 如果翻译失败，返回原文本
        } finally {
            // 释放实例
            releaseTranslator(translatorObj);
            console.log(`%cReleased translator instance ${translatorObj.id}`, 'color: red; font-weight: bold;');
        }
    }

    // 提供一个全局函数供其他脚本调用
    window.translateToChinese = translateToChinese;
    window.initializeTranslatorPool = initializeTranslatorPool;

    // 检查元素是否在视口内
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // 翻译指定元素中的文本
    async function translateElements() {
        // 查找 id="stream" 下面 class="flux" 下面 class="item titleAuthorSummaryDate" 的元素
        const streamElement = document.getElementById('stream');
        if (!streamElement) {
            console.log('Element with id "stream" not found');
            return;
        }

        // 获取所有匹配的元素，排除已翻译的元素
        const allTargetElements = streamElement.querySelectorAll('.flux .item.titleAuthorSummaryDate:not([data-translated])');
        
        // 过滤出在视口内的元素
        const visibleElements = [];
        for (let element of allTargetElements) {
            if (isElementInViewport(element)) {
                visibleElements.push(element);
            }
        }
        
        if (visibleElements.length === 0) {
            console.log('No visible untranslated elements with class "item titleAuthorSummaryDate" found inside #stream .flux');
            return;
        }

        console.log(`Found ${visibleElements.length} visible target elements to translate`);
        
        // 遍历每个可见元素并翻译其中的文本
        for (let element of visibleElements) {
            // 获取元素中的所有文本节点
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeValue.trim() !== '') {
                    textNodes.push(node);
                }
            }

            // 创建翻译任务数组
            const translationPromises = textNodes.map(async (textNode) => {
                const originalText = textNode.nodeValue;
                console.log(`Translating text: "${originalText}"`);
                const translatedText = await translateToChinese(originalText);
                
                // 只有当翻译结果与原文不同时才更新
                if (translatedText && translatedText !== originalText) {
                    textNode.nodeValue = translatedText;
                    console.log(`Translated to: "${translatedText}"`);
                }
                
                return { textNode, originalText, translatedText };
            });
            
            // 并发执行所有翻译任务
            await Promise.all(translationPromises);
            
            // 为已翻译的元素添加标记，避免重复翻译
            element.setAttribute('data-translated', 'true');
        }
    }

    // MutationObserver 监听动态内容加载
    let observer = null;
    
    function startObserving() {
        const streamElement = document.getElementById('stream');
        if (!streamElement) {
            console.log('Element with id "stream" not found, cannot start observing');
            return;
        }

        // 创建观察器实例
        observer = new MutationObserver(function(mutationsList) {
            let shouldTranslate = false;
            
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 检查新增的节点
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新增节点本身是否符合条件
                            if (node.classList && 
                                node.classList.contains('item') && 
                                node.classList.contains('titleAuthorSummaryDate') &&
                                !node.hasAttribute('data-translated')) {
                                shouldTranslate = true;
                            }
                            
                            // 检查新增节点的后代元素
                            const descendantItems = node.querySelectorAll && node.querySelectorAll('.flux .item.titleAuthorSummaryDate:not([data-translated])');
                            if (descendantItems && descendantItems.length > 0) {
                                shouldTranslate = true;
                            }
                        }
                    });
                }
            }
            
            if (shouldTranslate) {
                // 延迟执行，确保DOM完全更新
                setTimeout(translateElements, 100);
            }
        });

        // 开始观察
        observer.observe(streamElement, {
            childList: true,
            subtree: true
        });
        
        console.log('Started observing for new elements');
    }
    
    // 监听滚动事件，翻译新进入视口的元素
    let scrollTimeout = null;
    function handleScroll() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // 防抖处理，避免频繁触发
        scrollTimeout = setTimeout(() => {
            translateElements();
        }, 200);
    }
    
    // 开始监听滚动事件
    function startScrollListening() {
        window.addEventListener('scroll', handleScroll, { passive: true });
        console.log('Started listening for scroll events');
    }

    // 提供翻译目标元素的全局函数
    window.translateStreamElements = translateElements;
    window.startObserving = startObserving;

    // 检查是否已在当前窗口上下文中执行
    if (window.translatorScriptHasRun) {
        console.log('Translator API Helper already running in this context');
        // 如果脚本已经在运行，但可能需要重新开始观察
        if (typeof startObserving === 'function') {
            startObserving();
        }
        return;
    }
    
    // 设置执行标志
    window.translatorScriptHasRun = true;
    
    // 输出初始加载信息
    console.log('Translator API Helper loaded successfully');
    
    // 初始化并开始观察
    startObserving();
    startScrollListening();
    
    // 执行初次翻译
    setTimeout(translateElements, 500);
})();
// ==UserScript==
// @name         YouTube直播聊天自动翻译
// @namespace    http://tampermonkey.net/
// @version      1.52
// @description  在YouTube直播聊天中翻译span id="message"中的内容，支持文本消息和支付消息
// @license MIT
// @author       xlxz
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @connect      translate.google.cn
// @downloadURL https://update.greasyfork.org/scripts/555903/YouTube%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/555903/YouTube%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 可调参数 Begin ====================
    // --- 批量翻译相关 ---
    // 【核心参数】高优先级消息（新消息）批量大小 (建议范围 10-50，降低以应对高负载)
    const PRIORITY_BATCH_SIZE = 15; // <<<--- 请在此处调整新消息批量大小 (后续) ---
    // 首次翻译时的批量大小
    const FIRST_TRANSLATION_BATCH_SIZE = 8; // <<<--- 请在此处调整首次翻译批量大小 ---

    // 低优先级消息（历史消息）批量大小
    const NORMAL_BATCH_SIZE = 20; // <<<--- 请在此处调整历史消息批量大小 ---

    // 批量处理间隔（毫秒）
    const BATCH_PROCESS_INTERVAL = 200; // <<<--- 请在此处调整批量处理间隔 (后续) ---
    // 首次翻译时的处理间隔
    const FIRST_TRANSLATION_INTERVAL = 100; // <<<--- 请在此处调整首次翻译处理间隔 ---

    // --- 请求频率相关 ---
    // API请求间的最小延迟（毫秒），用于控制频率
    const REQUEST_DELAY_MS = 300; // <<<--- 请在此处调整请求间最小延迟 (后续) ---
    // 首次翻译时的请求延迟
    const FIRST_TRANSLATION_REQUEST_DELAY = 150; // <<<--- 请在此处调整首次翻译请求延迟 ---

    // 最大并发请求数
    const MAX_CONCURRENT_REQUESTS = 1; // <<<--- 请在此处调整最大并发请求数 (后续) ---
    // 首次翻译时的最大并发数
    const FIRST_TRANSLATION_MAX_CONCURRENT = 1; // <<<--- 请在此处调整首次翻译最大并发数 ---

    // 记录最近N次请求时间戳，用于平滑频率控制
    const REQUEST_HISTORY_SIZE = 5; // 增加历史记录大小，更好地平滑频率

    // --- 队列管理相关 ---
    // 高优先级队列最大长度 (限制队列大小，防止积压)
    const PRIORITY_QUEUE_MAX_SIZE = 80; // <<<--- 请在此处调整优先队列最大长度 ---

    // 低优先级队列最大长度
    const NORMAL_QUEUE_MAX_SIZE = 150; // <<<--- 请在此处调整普通队列最大长度 ---

    // --- 单条消息处理相关 ---
    // YouTube单条消息字符上限估计值 (用于估算批处理总字符数)
    const ESTIMATED_MAX_MESSAGE_CHARS = 200;

    // ==================== 可调参数 End ====================


    // 翻译API配置
    const TRANSLATE_API = {
        google: {
            url: 'https://translate.googleapis.com/translate_a/single',
            params: (text, from = 'auto', to = 'zh-CN') => ({
                client: 'gtx',
                sl: from,
                tl: to,
                dt: 't',
                q: encodeURIComponent(text) // 注意：encodeURIComponent 是必需的
            })
        }
    };


    // 翻译服务类 - 优化处理高负载
    class TranslationService {
        constructor() {
            this.activeRequests = 0; // 当前活跃请求数
            this.requestTimestamps = []; // 记录最近请求的时间戳
            this.isFirstTranslation = true; // 标记是否为首次翻译
        }

        /**
         * 批量翻译函数 - 使用特殊分隔符确保正确分割
         * @param {Array<{id: string, text: string}>} items 包含唯一ID和待翻译文本的对象数组
         * @param {string} from 源语言
         * @param {string} to 目标语言
         * @returns {Promise<Object>} Promise对象，resolve后返回一个以item.id为键，翻译结果为值的对象
         */
        async translateBatch(items, from = 'auto', to = 'zh-CN') {
            if (!items || items.length === 0) {
                return {};
            }

            // 等待直到允许发起新请求
            await this.waitIfNeeded();

            // 生成唯一的分隔符，确保它不会出现在待翻译文本中
            const separator = `\n---#2025#_${Date.now()}_${Math.random().toString(36).substr(2, 9)}---\n`;
            const combinedText = items.map(item => item.text).join(separator);
            this.recordRequestTime(); // 记录本次请求时间

            return new Promise((resolve, reject) => {
                const params = TRANSLATE_API.google.params(combinedText, from, to);
                const queryString = Object.keys(params)
                    .map(key => `${key}=${params[key]}`)
                    .join('&');

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${TRANSLATE_API.google.url}?${queryString}`,
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data && data[0] && Array.isArray(data[0])) {
                                // 正确解析API响应：提取每个翻译单元的文本
                                let fullTranslatedText = '';
                                for (const item of data[0]) {
                                    if (item && item[0]) { // 确保item存在且第一个元素存在
                                        fullTranslatedText += item[0];
                                    }
                                }

                                // 使用之前生成的分隔符来分割翻译结果
                                const translatedParts = fullTranslatedText.split(separator);

                                // 将分割后的结果与原始项目ID关联
                                const results = {};
                                for (let i = 0; i < items.length && i < translatedParts.length; i++) {
                                    results[items[i].id] = translatedParts[i].trim(); // 去除可能的前后空格
                                }

                                // 检查翻译结果数量是否与请求项数量匹配
                                if (items.length !== translatedParts.length) {
                                    console.warn(`翻译结果数量不匹配: 请求 ${items.length} 条, 实际返回 ${translatedParts.length} 条`);
                                    // 如果数量不匹配，尝试更保守的处理方式
                                    for (let i = 0; i < items.length && i < translatedParts.length; i++) {
                                        results[items[i].id] = translatedParts[i].trim();
                                    }
                                    // 对于未匹配的项，返回原文
                                    for (let i = translatedParts.length; i < items.length; i++) {
                                        results[items[i].id] = items[i].text;
                                    }
                                }

                                // 增加对翻译结果的验证，移除可能的分割错误
                                for (const key in results) {
                                    results[key] = this.validateAndCleanResult(results[key]);
                                }

                                resolve(results);
                            } else {
                                console.warn('翻译API返回格式异常，返回原文:', combinedText);
                                const fallbackResults = {};
                                items.forEach(item => fallbackResults[item.id] = item.text);
                                resolve(fallbackResults);
                            }
                        } catch (e) {
                            console.error('解析翻译结果失败:', e);
                            const fallbackResults = {};
                            items.forEach(item => fallbackResults[item.id] = `[翻译失败: ${item.text}]`);
                            resolve(fallbackResults);
                        }
                    },
                    onerror: (error) => {
                        console.error('翻译请求失败:', error);
                        const fallbackResults = {};
                        items.forEach(item => fallbackResults[item.id] = `[翻译失败: ${item.text}]`);
                        resolve(fallbackResults); // 即使失败也resolve，避免阻塞
                    },
                    timeout: 15000, // 增加超时时间
                    ontimeout: () => {
                        console.warn('翻译请求超时');
                        const fallbackResults = {};
                        items.forEach(item => fallbackResults[item.id] = `[翻译超时: ${item.text}]`);
                        resolve(fallbackResults);
                    }
                });
            });
        }

        /**
         * 验证和清理翻译结果，移除可能的分割错误
         * @param {string} result 翻译结果
         * @returns {string} 清理后的翻译结果
         */
        validateAndCleanResult(result) {
            // 检查结果中是否包含分隔符模式（表明分割失败）
            if (result.includes('---#2025#_')) {
                // 如果结果中包含分隔符，说明可能是多个消息的翻译被错误地合并了
                // 只返回第一个消息的翻译部分
                const firstMessageEnd = result.indexOf('---#2025#_');
                if (firstMessageEnd > 0) {
                    return result.substring(0, firstMessageEnd).trim();
                } else {
                    // 如果分隔符在开头，尝试查找分隔符模式
                    const separatorPattern = /---#2025#_\d+_[a-zA-Z0-9]+---/;
                    const match = separatorPattern.exec(result);
                    if (match) {
                        return result.substring(0, match.index).trim();
                    }
                }
            }

            // 检查结果中是否包含其他分隔符模式（如旧版本的分隔符）
            if (result.includes('---SPLU')) {
                const firstMessageEnd = result.indexOf('---SPLU');
                if (firstMessageEnd > 0) {
                    return result.substring(0, firstMessageEnd).trim();
                }
            }

            // 检查是否包含常见的分隔符模式
            const separatorPatterns = [
                /---#2025#_\d+_[a-zA-Z0-9]+---/,
                /---SPLITTER_\d+_[a-zA-Z0-9]+---/,
                /___SPLITTER_\d+_[a-zA-Z0-9]+___/
            ];

            for (const pattern of separatorPatterns) {
                const match = pattern.exec(result);
                if (match) {
                    return result.substring(0, match.index).trim();
                }
            }

            return result;
        }


        // 控制请求频率的核心方法
        async waitIfNeeded() {
            const now = Date.now();
            // 根据是否为首次翻译选择不同的参数
            const delayMs = this.isFirstTranslation ? FIRST_TRANSLATION_REQUEST_DELAY : REQUEST_DELAY_MS;
            const historySize = REQUEST_HISTORY_SIZE;

            // 清理过期的时间戳 (例如，只保留最近 historySize * delayMs 时间内的)
            this.requestTimestamps = this.requestTimestamps.filter(ts => now - ts < historySize * delayMs);

            if (this.requestTimestamps.length >= historySize) {
                const oldestTs = this.requestTimestamps[0]; // 获取最早的请求时间
                const timeSinceOldest = now - oldestTs;
                const minRequiredInterval = historySize * delayMs;

                if (timeSinceOldest < minRequiredInterval) {
                    const delayNeeded = minRequiredInterval - timeSinceOldest;
                    console.log(`[速率控制] 等待 ${delayNeeded} ms`);
                    await new Promise(resolve => setTimeout(resolve, delayNeeded));
                }
            }
            // 注意：这里不立即记录时间戳，而是在实际发出请求后记录 (在 googleTranslate 或 translateBatch 中)
        }

        recordRequestTime() {
             this.requestTimestamps.push(Date.now());
             // 首次翻译请求后，标记为非首次
             if (this.isFirstTranslation) {
                 this.isFirstTranslation = false;
             }
        }

        // 简化的检测逻辑：只跳过纯中文内容 (去除常见标点和特殊字符后)
        isPureChinese(text) {
            // 移除常见的非中文字符（如@用户名、数字、基本标点、链接、表情等）
            const cleanedText = text.replace(/[@#\w\d\s`~!@#$%^&*()_\-+=\[\]{}|;':",./<>?\\（）【】；：‘’“”—…《》「」『』、·]/g, '').trim();

            // 检查是否只包含中文字符（基本汉字+中文标点）
            const chineseOnlyRegex = /^[\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+$/;

            // 同时检查是否包含日文字符 (假名)
            const hasKana = /[\u3040-\u309f\u30a0-\u30ff]/.test(cleanedText);

            return cleanedText.length > 0 && chineseOnlyRegex.test(cleanedText) && !hasKana;
        }

        // 检测文本是否应该被翻译
        shouldTranslate(text) {
            // 如果是纯中文，不翻译
            if (this.isPureChinese(text)) {
                return false;
            }
            return true; // 其他情况均翻译
        }
    }


    // 聊天监控器类 - 优化处理高负载
    class ChatMonitor {
        constructor() {
            this.translationService = new TranslationService();
            this.chatContainer = null;
            this.observer = null;

            // --- 批量处理队列 ---
            this.priorityBatchQueue = []; // 高优先级 (新消息)
            this.normalBatchQueue = [];   // 低优先级 (历史消息)

            // --- 批量处理状态 ---
            this.isProcessingPriorityBatch = false;
            this.isProcessingNormalBatch = false;

            // --- 首次翻译状态 ---
            this.isFirstTranslationProcessed = false; // 标记首次翻译是否已处理
            this.firstTranslationTimeoutId = null; // 用于首次翻译的超时处理

            // 添加消息ID映射，用于防止翻译错位
            this.messageIdMap = new Map(); // 存储消息ID到DOM元素的映射

            this.init();
        }

        init() {
            this.tryInitialize();
        }

        tryInitialize() {
            if (this.waitForChatContainer()) {
                this.startMonitoring();
            } else {
                setTimeout(() => this.tryInitialize(), 1000);
            }
        }

        waitForChatContainer() {
            // 多种选择器尝试找到聊天容器
            const selectors = [
                '#chat-messages',
                '#items.style-scope.yt-live-chat-item-list-renderer',
                'yt-live-chat-item-list-renderer',
                '.yt-live-chat-item-list-renderer'
            ];

            for (const selector of selectors) {
                const container = document.querySelector(selector);
                if (container) {
                    this.chatContainer = container;
                    return true;
                }
            }
            return false;
        }

        startMonitoring() {
            // 使用观察器来监控聊天区域的新消息
            this.observer = new MutationObserver((mutations) => {
                this.handleMutations(mutations);
            });

            const config = {
                childList: true,
                subtree: true
            };
            this.observer.observe(this.chatContainer, config);

            console.log('YouTube直播聊天翻译监控已启动 (高负载优化版)');

            // 加载历史消息
            setTimeout(() => {
                this.loadHistoricalMessages();
            }, 500);

            // 启动批量处理循环
            this.startBatchProcessingLoop();
        }

        loadHistoricalMessages() {
            console.log('开始加载历史消息...');
            const textMessageElements = Array.from(
                this.chatContainer.querySelectorAll('yt-live-chat-text-message-renderer')
            );
            const paidMessageElements = Array.from(
                this.chatContainer.querySelectorAll('yt-live-chat-paid-message-renderer')
            );
            const allMessageElements = [...textMessageElements, ...paidMessageElements];

            // 逆序处理，从最新的消息开始
            const reversedElements = allMessageElements.reverse();

            console.log(`发现 ${reversedElements.length} 条历史消息，加入历史消息队列...`);

            reversedElements.forEach(element => {
                const messageInfo = this.extractMessageInfo(element);
                if (messageInfo && this.translationService.shouldTranslate(messageInfo.text)) {
                     // 限制历史消息队列长度
                     if (this.normalBatchQueue.length < NORMAL_QUEUE_MAX_SIZE) {
                         this.normalBatchQueue.push(messageInfo); // 直接推入信息对象
                         // 添加到ID映射中
                         this.messageIdMap.set(messageInfo.id, messageInfo.element);
                     } else {
                         console.warn('历史消息队列已满，丢弃旧消息');
                     }
                }
            });
            console.log('历史消息已加载到队列');
        }

        // 提取消息信息 - 返回包含DOM引用的对象
        extractMessageInfo(element) {
            if (!element) return null;
            const messageSpanOrDiv = element.querySelector('span#message') || element.querySelector('div#message');
            if (!messageSpanOrDiv) return null;

            const text = (messageSpanOrDiv.textContent || messageSpanOrDiv.innerText).trim();
            if (!text) return null;

            // 检查是否已存在翻译元素，避免重复翻译
            if (element.querySelector('.youtube-chat-translation')) {
                return null; // 已存在翻译，跳过
            }

            // 生成唯一ID (基于元素引用的哈希或使用随机ID并存储在元素上)
            const uniqueId = `msg_${element.tagName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            return {
                id: uniqueId,
                element: element, // 保存DOM元素引用
                textElement: messageSpanOrDiv, // 保存文本元素引用
                text: text
            };
        }

        // 处理 DOM 变化，主要是新消息
        handleMutations(mutations) {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                             this.processAddedNode(node);
                        }
                    });
                }
            });
        }

        // 处理新增的节点
        processAddedNode(node) {
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            const elementsToCheck = [];
            if (node.matches('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer')) {
                 elementsToCheck.push(node);
            } else {
                 elementsToCheck.push(...node.querySelectorAll('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer'));
            }

            elementsToCheck.forEach(element => {
                 const messageInfo = this.extractMessageInfo(element);
                 if (messageInfo) { // 即使不需要翻译也加入队列，因为可能需要检查是否已翻译
                      // 限制新消息队列长度
                      if (this.priorityBatchQueue.length < PRIORITY_QUEUE_MAX_SIZE) {
                          this.priorityBatchQueue.push(messageInfo); // 加入高优先级队列
                          // 添加到ID映射中
                          this.messageIdMap.set(messageInfo.id, messageInfo.element);
                      } else {
                          console.warn('新消息队列已满，丢弃旧消息');
                          // 可选：丢弃队列中最旧的10%的消息，而不是一个，以减少频繁操作
                          const dropCount = Math.floor(PRIORITY_QUEUE_MAX_SIZE * 0.1);
                          this.priorityBatchQueue.splice(0, dropCount);
                          this.priorityBatchQueue.push(messageInfo);
                          // 同时从ID映射中移除丢弃的消息
                          for (let i = 0; i < dropCount; i++) {
                              const droppedMsg = this.priorityBatchQueue[i];
                              if (droppedMsg) {
                                  this.messageIdMap.delete(droppedMsg.id);
                              }
                          }
                          this.messageIdMap.set(messageInfo.id, messageInfo.element);
                      }
                 }
            });
        }

        // 启动批量处理循环
        startBatchProcessingLoop() {
             // 启动主处理循环
             setInterval(() => {
                  // 触发优先级批次处理
                  if (!this.isProcessingPriorityBatch && this.priorityBatchQueue.length > 0) {
                       // 检查是否为首次翻译
                       if (!this.isFirstTranslationProcessed) {
                            // 首次翻译：使用独立参数，处理更小的批次，更短的间隔
                            this.processFirstBatchPriority();
                       } else {
                            // 后续翻译：使用默认参数
                            this.processBatchPriority();
                       }
                  }
                  // 触发普通批次处理 (当没有优先级任务时)
                  if (!this.isProcessingNormalBatch && this.normalBatchQueue.length > 0 && !this.isProcessingPriorityBatch) {
                       this.processBatchNormal();
                  }
             }, BATCH_PROCESS_INTERVAL); // 使用可调参数 (后续)
        }

        // 处理首次翻译批次 (新消息) - 使用独立参数
        async processFirstBatchPriority() {
             if (this.isProcessingPriorityBatch) return;

             // 使用首次翻译的参数
             const batchSize = FIRST_TRANSLATION_BATCH_SIZE;
             const processInterval = FIRST_TRANSLATION_INTERVAL;

             // 从队列头部取出一批 (需要实时过滤)
             let batchItems = [];
             const itemsToProcess = this.priorityBatchQueue.splice(0, batchSize); // 先取出
             for (const item of itemsToProcess) {
                 // 再次检查是否需要翻译和是否已存在翻译
                 if (this.translationService.shouldTranslate(item.text) && item.element.isConnected && !item.element.querySelector('.youtube-chat-translation')) {
                     batchItems.push(item);
                 }
             }

             if (batchItems.length === 0) {
                 // 如果筛选后没有需要翻译的，将原items放回队列头部
                 this.priorityBatchQueue.unshift(...itemsToProcess);
                 return;
             }

             this.isProcessingPriorityBatch = true;
             batchItems = batchItems.slice(0, batchSize); // 再次确保大小

             console.log(`[首次翻译] 开始处理 ${batchItems.length} 条新消息...`);
             const itemsForTranslation = batchItems.map(item => ({ id: item.id, text: item.text }));

             try {
                  const translations = await this.translationService.translateBatch(itemsForTranslation);
                  // 应用翻译结果
                  batchItems.forEach(batchItem => {
                      const translatedText = translations[batchItem.id];
                      if (translatedText && translatedText !== batchItem.text && !translatedText.startsWith('[翻译失败') && !translatedText.startsWith('[翻译超时')) {
                           this.applyTranslation(batchItem.element, translatedText);
                      }
                  });
             } catch (error) {
                  console.error('[首次翻译] 新消息批量翻译出错:', error);
                  // 出错时可以选择重新放入队列或标记错误，这里简单忽略
             } finally {
                  this.isProcessingPriorityBatch = false;
                  // 标记首次翻译已处理
                  this.isFirstTranslationProcessed = true;
                  // 清理可能的超时ID
                  if (this.firstTranslationTimeoutId) {
                      clearTimeout(this.firstTranslationTimeoutId);
                      this.firstTranslationTimeoutId = null;
                  }
             }
        }

        // 处理后续翻译批次 (新消息) - 使用默认参数
        async processBatchPriority() {
             if (this.isProcessingPriorityBatch) return;

             // 使用默认参数
             const batchSize = PRIORITY_BATCH_SIZE;
             const processInterval = BATCH_PROCESS_INTERVAL;

             // 从队列头部取出一批 (需要实时过滤)
             let batchItems = [];
             const itemsToProcess = this.priorityBatchQueue.splice(0, batchSize); // 先取出
             for (const item of itemsToProcess) {
                 // 再次检查是否需要翻译和是否已存在翻译
                 if (this.translationService.shouldTranslate(item.text) && item.element.isConnected && !item.element.querySelector('.youtube-chat-translation')) {
                     batchItems.push(item);
                 }
             }

             if (batchItems.length === 0) {
                 // 如果筛选后没有需要翻译的，将原items放回队列头部
                 this.priorityBatchQueue.unshift(...itemsToProcess);
                 return;
             }

             this.isProcessingPriorityBatch = true;
             batchItems = batchItems.slice(0, batchSize); // 再次确保大小

             console.log(`[后续翻译] 开始处理 ${batchItems.length} 条新消息...`);
             const itemsForTranslation = batchItems.map(item => ({ id: item.id, text: item.text }));

             try {
                  const translations = await this.translationService.translateBatch(itemsForTranslation);
                  // 应用翻译结果
                  batchItems.forEach(batchItem => {
                      const translatedText = translations[batchItem.id];
                      if (translatedText && translatedText !== batchItem.text && !translatedText.startsWith('[翻译失败') && !translatedText.startsWith('[翻译超时')) {
                           this.applyTranslation(batchItem.element, translatedText);
                      }
                  });
             } catch (error) {
                  console.error('[后续翻译] 新消息批量翻译出错:', error);
                  // 出错时可以选择重新放入队列或标记错误，这里简单忽略
             }

             this.isProcessingPriorityBatch = false;
        }

        // 处理低优先级批次 (历史消息)
        async processBatchNormal() {
             if (this.isProcessingNormalBatch) return;

             // 从队列尾部取出一批 (需要实时过滤)
             let batchItems = [];
             const startIndex = Math.max(0, this.normalBatchQueue.length - NORMAL_BATCH_SIZE); // 使用可调参数
             const itemsToProcess = this.normalBatchQueue.splice(startIndex, NORMAL_BATCH_SIZE);

             for (const item of itemsToProcess) {
                 // 再次检查是否需要翻译和是否已存在翻译
                 if (this.translationService.shouldTranslate(item.text) && item.element.isConnected && !item.element.querySelector('.youtube-chat-translation')) {
                     batchItems.push(item);
                 }
             }

             if (batchItems.length === 0) {
                 // 如果筛选后没有需要翻译的，将原items放回队列尾部
                 this.normalBatchQueue.push(...itemsToProcess);
                 return;
             }

             this.isProcessingNormalBatch = true;
             batchItems = batchItems.slice(0, NORMAL_BATCH_SIZE); // 再次确保大小

             console.log(`[批量处理] 开始处理 ${batchItems.length} 条历史消息...`);
             const itemsForTranslation = batchItems.map(item => ({ id: item.id, text: item.text }));

             try {
                  const translations = await this.translationService.translateBatch(itemsForTranslation);
                  // 应用翻译结果
                  batchItems.forEach(batchItem => {
                      const translatedText = translations[batchItem.id];
                      if (translatedText && translatedText !== batchItem.text && !translatedText.startsWith('[翻译失败') && !translatedText.startsWith('[翻译超时')) {
                           this.applyTranslation(batchItem.element, translatedText);
                      }
                  });
             } catch (error) {
                  console.error('[批量处理] 历史消息批量翻译出错:', error);
                  // 出错时可以选择重新放入队列或标记错误，这里简单忽略
             }

             this.isProcessingNormalBatch = false;
        }

        // 应用翻译结果到DOM
        applyTranslation(originalElement, translatedText) {
            // 再次检查是否已存在翻译元素，防止竞态
            if (originalElement.querySelector('.youtube-chat-translation')) {
                 return;
            }

            const translationElement = this.createTranslationElement(translatedText);
            originalElement.appendChild(translationElement);
            console.log(`•[已添加翻译]: "${translatedText}"`);
        }

        // 创建翻译显示元素
        createTranslationElement(translatedText) {
            const div = document.createElement('div');
            div.className = 'youtube-chat-translation';
            div.style.cssText = `
                font-size: 85%;
                color: #4CAF50;
                margin-top: 2px;
                padding: 2px 4px;
                background-color: rgba(76, 175, 80, 0.1);
//                border-left: 2px solid #4CAF50;
//                border-radius: 2px;
                line-height: 1.2;
//                font-style: italic;
                clear: both;
            `;
            div.textContent = `• ${translatedText}`;
            return div;
        }

        cleanup() {
            if (this.observer) {
                this.observer.disconnect();
            }
            if (this.firstTranslationTimeoutId) {
                clearTimeout(this.firstTranslationTimeoutId);
            }
            // 清空ID映射
            this.messageIdMap.clear();
        }
    }

    // 页面内容变化监控器
    class PageMonitor {
        constructor() {
            this.chatMonitor = null;
            this.init();
        }

        init() {
            this.checkAndInitialize();
            this.startUrlMonitoring();
        }

        checkAndInitialize() {
            // 简化检查逻辑
            if (window.location.pathname.includes('/live') || window.location.search.includes('livechat')) {
                if (!this.chatMonitor) {
                    console.log("检测到直播页面，启动聊天监控...");
                    this.chatMonitor = new ChatMonitor();
                }
            } else {
                if (this.chatMonitor) {
                    console.log("离开直播页面，停止聊天监控...");
                    this.chatMonitor.cleanup();
                    this.chatMonitor = null;
                }
            }
        }

        startUrlMonitoring() {
            // 监听URL变化 (适用于 SPA)
            let lastUrl = location.href;
            new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(() => this.checkAndInitialize(), 1000); // 稍微延迟以确保DOM更新
                }
            }).observe(document, { subtree: true, childList: true });

            // 监听 popstate (浏览器前进/后退)
            window.addEventListener('popstate', () => {
                setTimeout(() => this.checkAndInitialize(), 1000);
            });

            // 监听页面可见性变化
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    setTimeout(() => this.checkAndInitialize(), 500);
                }
            });
        }
    }

    // 初始化脚本
    function initialize() {
        new PageMonitor();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
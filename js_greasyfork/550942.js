// ==UserScript==
// @name         Cute-ify All Web Pages (V7.8.2 "Viewport Aware")
// @namespace    http://tampermonkey.net/
// @version      7.8.2
// @description  The 100% complete, unabridged version of the Cache-First architecture. Now only processes visible elements in the viewport.
// @author       Bytebender
// @match        *://*/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @connect      *
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/550942/Cute-ify%20All%20Web%20Pages%20%28V782%20%22Viewport%20Aware%22%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550942/Cute-ify%20All%20Web%20Pages%20%28V782%20%22Viewport%20Aware%22%29.meta.js
// ==/UserScript==


// 可能可以解决并发问题 // @require      https://raw.githubusercontent.com/Tampermonkey/utils/refs/heads/main/requires/gh_2215_make_GM_xhr_more_parallel_again.js
(function() {
    'use strict';

    console.log('[Cuteify] Script execution started.');

    // --- ⚙️ 用户配置区 START ---
    const config = {
        scanInterval: 2000,
        batchSize: 10,
        processShadowDOM: true,
        enableDebugLogging: true,

        apiKey: 'sk-3P5P8odkGLoPlNPj0QGBCgw8m083aaI8706HTNYXhujTk405',
        baseUrl: 'https://elysia.h-e.top/v1',
        model: 'gpt-4.1-mini',
        prompt: `你是一个文本风格转换专家。用户会提供一段XML，里面包含多个被 <text><![CDATA[...]]></text> 包裹的字符串。
请将每一个字符串都转换成一种略微可爱、俏皮、活泼的风格。你必须保持其核心意思不变。
你的回复必须是一个格式完全正确的XML，且结构与输入完全相同。每一个翻译后的文本都必须同样被 <text><![CDATA[...]]></text> 包裹。
输入的 <text> 元素数量必须与输出的 <text> 元素数量严格相等。除了这个XML结构，不要包含任何其他说明或标记。`,
        maxConcurrency: 1,
        minLengthToProcess: 10,
    };
    // --- ⚙️ 用户配置区 END ---

    const CACHE_PREFIX = 'cutify_cache_';
    const STATE_ATTR = 'data-cutify-state';
    const logger = { log: (...args) => config.enableDebugLogging && console.log('[Cuteify]', ...args), error: (...args) => console.error('[Cuteify]', ...args), };

    let currentBatch = [];
    let activeRequests = 0;

    async function findAndCollectWorkItems(rootNode) {
        const attributesToProcess = ['placeholder', 'title', 'alt'];
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (currentBatch.length >= config.batchSize) { dispatchBatch(); }

            const element = node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
            if (!element || element.hasAttribute(STATE_ATTR) || !isVisible(element)) { continue; }

            if (node.nodeType === Node.TEXT_NODE) {
                const parentTag = element.tagName;
                if (parentTag && parentTag !== 'SCRIPT' && parentTag !== 'STYLE' && parentTag !== 'NOSCRIPT' && parentTag !== 'TEXTAREA' && !element.isContentEditable) {
                    const text = node.nodeValue.trim();
                    if (text.length >= config.minLengthToProcess) {
                        const cachedText = await getFromCache(text);
                        if (cachedText) {
                            applyChange({ type: 'text', element: node }, cachedText, 'done');
                        } else {
                            currentBatch.push({ type: 'text', element: node, originalText: text });
                            element.setAttribute(STATE_ATTR, 'queued');
                        }
                    }
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                for (const attr of attributesToProcess) {
                    if (node.hasAttribute(attr)) {
                        const text = node.getAttribute(attr).trim();
                        if (text.length >= config.minLengthToProcess) {
                            const cachedText = await getFromCache(text);
                            if (cachedText) {
                                applyChange({ type: 'attribute', element: node, attr: attr }, cachedText, 'done');
                            } else {
                                currentBatch.push({ type: 'attribute', element: node, attr: attr, originalText: text });
                                node.setAttribute(STATE_ATTR, 'queued');
                            }
                            break;
                        }
                    }
                }
            }
        }
    }

    async function scanAndDispatch() {
        try {
            await findAndCollectWorkItems(document.body);
            if (config.processShadowDOM) {
                const hosts = document.querySelectorAll('*');
                for (const host of hosts) {
                    if (host.shadowRoot) {
                        await findAndCollectWorkItems(host.shadowRoot);
                    }
                }
            }
            if (currentBatch.length > 0) {
                dispatchBatch();
            }
        } catch (e) {
            logger.error("Error during scanAndDispatch:", e);
        }
    }

    function dispatchBatch() {
        const batchToProcess = [...currentBatch];
        currentBatch = [];
        if (batchToProcess.length === 0) return;

        if (activeRequests >= config.maxConcurrency) {
            logger.log(`Concurrency limit (${config.maxConcurrency}) reached. Discarding batch of ${batchToProcess.length} items. They will be retried on next scan.`);
            batchToProcess.forEach(item => {
                const el = item.type === 'text' ? item.element.parentNode : item.element;
                if (el) { el.removeAttribute(STATE_ATTR); }
            });
            return;
        }

        logger.log(`Dispatching a batch of ${batchToProcess.length} items. Active requests: ${activeRequests + 1}/${config.maxConcurrency}`);

        activeRequests++;
        processBatch(batchToProcess).finally(() => {
            activeRequests--;
            logger.log(`A batch finished. Active requests: ${activeRequests}/${config.maxConcurrency}`);
        });
    }

    async function processBatch(batch) {
        batch.forEach(item => {
            const el = item.type === 'text' ? item.element.parentNode : item.element;
            if (el && el.getAttribute(STATE_ATTR) === 'queued') {
                el.setAttribute(STATE_ATTR, 'processing');
            }
        });

        try {
            const uniqueTextsToFetch = [...new Set(batch.map(item => item.originalText))];
            const cuteTexts = await cuteifyBatch(uniqueTextsToFetch);

            const translationMap = new Map();
            uniqueTextsToFetch.forEach((text, i) => translationMap.set(text, cuteTexts[i]));

            const finalizationTasks = batch.map(async (item) => {
                const cuteText = translationMap.get(item.originalText);
                if (cuteText) {
                    await saveToCache(item.originalText, cuteText);
                    applyChange(item, cuteText, 'done');
                } else {
                    applyChange(item, item.originalText, null);
                }
            });
            await Promise.all(finalizationTasks);
        } catch (error) {
            logger.error(`Failed to process a batch:`, error, 'Reverting items to "pending".');
            batch.forEach(item => applyChange(item, item.originalText, null));
        }
    }

    function cuteifyBatch(texts) {
        return new Promise((resolve, reject) => {
            const xmlPayload = '<texts>' + texts.map(t => `<text><![CDATA[${t}]]></text>`).join('') + '</texts>';
            const payload = { model: config.model, messages: [{ role: "system", content: config.prompt },{ role: "user", content: xmlPayload }], temperature: 0.7, stream: false, };
            const requestDetails = { method: "POST", url: `${config.baseUrl}/chat/completions`, headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` }, data: JSON.stringify(payload), timeout: 20000 };
            logger.log("Sending XML batch request with", texts.length, "items.");
            GM_xmlhttpRequest({
                ...requestDetails,
                onload: (response) => {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const content = JSON.parse(response.responseText).choices[0].message.content;
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(content, "text/xml");
                            if (xmlDoc.getElementsByTagName("parsererror").length > 0) { throw new Error(`AI returned malformed XML: ${xmlDoc.getElementsByTagName("parsererror")[0].innerText}`); }
                            const cuteTextNodes = xmlDoc.querySelectorAll("text");
                            if (cuteTextNodes.length === texts.length) {
                                const cuteTextsArray = Array.from(cuteTextNodes).map(node => node.textContent);
                                resolve(cuteTextsArray);
                            } else { reject(`XML response format invalid: text count mismatch. Expected ${texts.length}, got ${cuteTextNodes.length}`); }
                        } catch (e) { reject(`Response parsing failed: ${e.message}`); }
                    } else { reject(`API request failed, status: ${response.status}`); }
                },
                onerror: (error) => reject(`Network request error: ${JSON.stringify(error)}`),
                ontimeout: () => reject("Request timed out after 60 seconds.")
            });
        });
    }

    /**
     * MODIFIED: This function now checks if an element is truly visible within the browser's viewport.
     * @param {Element} el The element to check.
     * @returns {boolean} True if the element is visible on screen, false otherwise.
     */
    function isVisible(el) {
        if (!el || el.nodeType !== Node.ELEMENT_NODE || !el.isConnected) {
            return false;
        }

        // Use getBoundingClientRect to get geometry and position info.
        // If width or height is 0, it's not visible (this also covers display: none).
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
            return false;
        }

        // Check CSS properties that can hide an element without affecting its dimensions.
        const style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }

        // Finally, check if the element is at least partially within the viewport's bounds.
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

        const isInViewport = (
            rect.top < viewportHeight &&
            rect.bottom > 0 &&
            rect.left < viewportWidth &&
            rect.right > 0
        );

        return isInViewport;
    }


    async function clearCache() {
        logger.log('Starting cache clearing process...');
        const allKeys = await GM.listValues();
        const tasks = allKeys.filter(key => key.startsWith(CACHE_PREFIX)).map(key => GM.deleteValue(key));
        await Promise.all(tasks);
        document.querySelectorAll(`[${STATE_ATTR}]`).forEach(el => el.removeAttribute(STATE_ATTR));
        const clearedCount = tasks.length;
        logger.log(`Cache clearing complete. ${clearedCount} items removed. All state marks reset.`);
        alert(`可爱化缓存已清除！删除了 ${clearedCount} 个项目。\n页面将重新扫描所有文本。`);
        scanAndDispatch();
    }
    GM_registerMenuCommand('清除可爱化缓存 (Clear Cute-ify Cache)', clearCache);

    function applyChange(item, newText, state) {
        try {
            const element = item.type === 'text' ? item.element.parentNode : item.element;
            if (!element || !element.isConnected) return;
            if (item.type === 'text') { item.element.nodeValue = ` ${newText} `; }
            else if (item.type === 'attribute') { element.setAttribute(item.attr, newText); }
            if (state) { element.setAttribute(STATE_ATTR, state); }
            else { element.removeAttribute(STATE_ATTR); }
        } catch (e) { /* Ignore */ }
    }

    function preflightCheck() {
        if (!config.apiKey || config.apiKey.includes('sk-xxxxx')) {
            logger.error("FATAL ERROR: API Key is not configured!");
            return false;
        }
        return true;
    }

    async function getFromCache(key) {
        return await GM.getValue(CACHE_PREFIX + key, null);
    }
    async function saveToCache(key, value) {
        await GM.setValue(CACHE_PREFIX + key, value);
    }

    let scanIntervalId = null;
    let mutationObserver = null;

    function main() {
        if (!preflightCheck()) return;
        logger.log(`V7.8.2 "Viewport Aware" is running! Instant translations for cached text. (b^-^)b`);

        // Add scroll and resize event listeners to re-scan when the viewport changes
        let debounceTimer;
        const debouncedScan = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(scanAndDispatch, 100); // 100ms debounce
        };
        window.addEventListener('scroll', debouncedScan, { passive: true });
        window.addEventListener('resize', debouncedScan, { passive: true });


        scanAndDispatch();

        scanIntervalId = setInterval(scanAndDispatch, config.scanInterval);
        mutationObserver = new MutationObserver(debouncedScan);
        mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();

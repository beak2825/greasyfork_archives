// ==UserScript==
// @name         STV Realtime Translator (Optimized)
// @namespace    http://tampermonkey.net/
// @version      3.1.4
// @description  Dịch tự động các trang web có chứa tiếng Trung, tương thích với SillyTavern và các trang có iframe. OPTIMIZED VERSION với Error Handling, XSS Protection, và Retry Logic.
// @author       BQY
// @match        http://*/*
// @connect      comic.sangtacvietcdn.xyz
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/553815/STV%20Realtime%20Translator%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553815/STV%20Realtime%20Translator%20%28Optimized%29.meta.js
// ==/UserScript==

function main() {
    'use strict';

    // --- START CONFIGURATION ---
    const setting = {
        enable: GM_getValue('enable', true),
        stvserver: GM_getValue('stvserver', "comic.sangtacvietcdn.xyz/tsm.php?cdn="),
        namedata: GM_getValue('namedata', ""),
        excludes: GM_getValue('excludes', ""),
        render: GM_getValue('render', true),
        debug: GM_getValue('debug', false),
        maxRetries: GM_getValue('maxRetries', 2),
        translateOnlyReasoning: GM_getValue('translateOnlyReasoning', false)
    };
    // --- END CONFIGURATION ---

    let namedata = setting.namedata;
    let namedatacache = null;

    // ===== OPTIMIZATION: Translation Cache =====
    const translationCache = new Map();
    const CACHE_MAX_SIZE = 1000;
    const BATCH_SIZE = 100; // Process max 100 items per request
    const DEBOUNCE_TIME = 1000; // Increased from 500ms to 1000ms
    const INITIAL_DELAY = 500;
    const LOCK_TIMEOUT = 500;
    const FALLBACK_TIMEOUT = 10000;

    // ===== Debug Logger =====
    function debugLog(...args) {
        if (setting.debug) {
            console.log('[STV Translator]', ...args);
        }
    }

    // ===== HTML Sanitizer =====
    function sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html; // Use textContent instead of innerHTML to prevent XSS
        return div.innerHTML;
    }

    // ===== Validate Server Response =====
    function validateResponse(response) {
        if (!response || typeof response !== 'string') {
            debugLog('Invalid response: not a string');
            return false;
        }
        // Check if response contains the expected delimiter
        if (!response.includes('=|==|=') && response.length > 0) {
            debugLog('Warning: Response does not contain expected delimiter');
        }
        return true;
    }

    function replaceName(text) {
        let t = text;
        if (namedatacache) {
            for (let i = 0; i < namedatacache.length; i++) {
                t = t.replace(namedatacache[i][0], namedatacache[i][1]);
            }
            return t;
        }
        namedatacache = [];
        const n = namedata.split("\n");

        // Tạo mảng các cặp tên với thông tin độ dài
        const namePairs = [];
        for (let i = 0; i < n.length; i++) {
            const m = n[i].trim().split("=");
            if (m[0] && m[1]) {
                namePairs.push({
                    chinese: m[0],
                    translation: m[1],
                    length: m[0].length
                });
            }
        }

        // Sắp xếp theo độ dài tiếng Trung giảm dần (dài nhất trước)
        namePairs.sort((a, b) => b.length - a.length);

        // Xử lý thay thế theo thứ tự đã sắp xếp
        for (let i = 0; i < namePairs.length; i++) {
            const pair = namePairs[i];
            // Thêm lookahead và lookbehind để kiểm tra có ký tự Trung/Nhật/Hàn trước/sau không
            // Nếu có, thêm khoảng trắng để tách các tên riêng
            const chineseCharPattern = '[\\u3400-\\u9FBF\\u3040-\\u309F\\u30A0-\\u30FF\\uAC00-\\uD7AF]';
            // Pattern với lookahead: nếu sau replacement có ký tự CJK, thêm space
            const r = new RegExp(pair.chinese + '(?=' + chineseCharPattern + ')', "g");
            namedatacache.push([r, pair.translation + ' ']);
            t = t.replace(r, pair.translation + ' ');

            // Pattern thông thường (không có CJK phía sau)
            const r2 = new RegExp(pair.chinese, "g");
            namedatacache.push([r2, pair.translation]);
            t = t.replace(r2, pair.translation);
        }
        return t;
    }

    // ===== OPTIMIZATION: Cache Management =====
    function getCachedTranslation(text) {
        return translationCache.get(text);
    }

    function setCachedTranslation(text, translation) {
        if (translationCache.size >= CACHE_MAX_SIZE) {
            // Remove oldest entry
            const firstKey = translationCache.keys().next().value;
            translationCache.delete(firstKey);
        }
        translationCache.set(text, translation);
    }

    let realtimeTranslateLock = false;
    const chineseRegex = /[\u3400-\u9FBF]/;
    const observedIframes = new WeakSet();

    // ===== OPTIMIZATION: IntersectionObserver for Lazy Loading =====
    let intersectionObserver = null;
    const visibleNodes = new Set();

    function initIntersectionObserver() {
        if (intersectionObserver) return;

        intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    visibleNodes.add(entry.target);
                } else {
                    visibleNodes.delete(entry.target);
                }
            });
        }, {
            rootMargin: '100px' // Load 100px before element becomes visible
        });
    }

    function recurTraver(doc, arr, tarr, isInsideMesText = false) {
        if (!doc) return;

        // Target only SillyTavern message containers
        let messageContainers;
        if (setting.translateOnlyReasoning) {
            // Chỉ dịch mes_text trong reasoning messages
            messageContainers = doc.querySelectorAll('.mes.reasoning.last_mes .mes_text');
        } else {
            // Dịch tất cả mes_text như cũ
            messageContainers = doc.querySelectorAll('.mes .mes_text');
        }

        if (messageContainers.length > 0) {
            // If we are in SillyTavern, only translate messages within .mes .mes_text
            messageContainers.forEach(container => {
                const walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
                let node;
                while(node = walker.nextNode()) {
                    // ===== OPTIMIZATION: Skip already translated nodes =====
                    if (node.parentElement.tagName !== "SCRIPT" &&
                        node.parentElement.tagName !== "STYLE" &&
                        !node.parentElement.hasAttribute('data-stv-translated')) {
                         if (chineseRegex.test(node.textContent)) {
                            // ===== OPTIMIZATION: Check cache first =====
                            const cachedTranslation = getCachedTranslation(node.textContent);
                            if (cachedTranslation) {
                                node.orgn = node.textContent;
                                node.translatedText = cachedTranslation;
                                node.textContent = setting.render ? cachedTranslation : node.textContent;
                                node.parentElement.setAttribute('data-stv-translated', 'true');
                                if (!node.parentElement.popable) {
                                    node.parentElement.addEventListener("mouseenter", poporgn);
                                    node.parentElement.popable = true;
                                }
                                continue; // Skip adding to translation queue
                            }

                            if (node.textContent.trim().includes('<')) { // Check for encoded HTML
                                const tempDiv = document.createElement('div');
                                // Use textContent to safely set content, preventing XSS
                                tempDiv.textContent = node.textContent;
                                // Then parse it as HTML in a controlled way
                                const safeContent = sanitizeHTML(node.textContent);
                                tempDiv.innerHTML = safeContent;
                                arr.push({ _isHtmlWrapper: true, originalNode: node, replacementNode: tempDiv });
                                tarr.push('<!-- HTML_WRAPPER_START -->');
                                recurTraver(tempDiv, arr, tarr, true);
                                arr.push({ _isHtmlWrapper: false });
                                tarr.push('<!-- HTML_WRAPPER_END -->');
                            } else {
                                arr.push(node);
                                tarr.push(node.textContent);
                            }
                        }
                    }
                }

                // Traverse iframes INSIDE .mes .mes_text containers
                const iframes = container.getElementsByTagName('iframe');
                for (const iframe of iframes) {
                    try {
                        if (iframe.contentDocument) {
                            recurTraverIframeContent(iframe.contentDocument, arr, tarr);
                            if (iframe.contentDocument.body && !observedIframes.has(iframe)) {
                                const iframeObserver = new MutationObserver(() => {
                                    if (iframeObserver.debounce) clearTimeout(iframeObserver.debounce);
                                    iframeObserver.debounce = setTimeout(() => realtimeTranslate(false), DEBOUNCE_TIME);
                                });
                                iframeObserver.observe(iframe.contentDocument.body, { childList: true, subtree: true, characterData: true });
                                observedIframes.add(iframe);
                            }
                        }
                    } catch (e) {
                        // Cross-origin iframe, cannot access
                    }
                }
            });
        } else if (isInsideMesText) {
            // This is called from within a .mes .mes_text context (e.g., HTML wrapper)
            // Translate all content in this doc
            if (!doc.body) return;
            const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while(node = walker.nextNode()) {
                if (node.parentElement.tagName !== "SCRIPT" &&
                    node.parentElement.tagName !== "STYLE" &&
                    !node.parentElement.hasAttribute('data-stv-translated')) {
                     if (chineseRegex.test(node.textContent)) {
                        const cachedTranslation = getCachedTranslation(node.textContent);
                        if (cachedTranslation) {
                            node.orgn = node.textContent;
                            node.translatedText = cachedTranslation;
                            node.textContent = setting.render ? cachedTranslation : node.textContent;
                            node.parentElement.setAttribute('data-stv-translated', 'true');
                            if (!node.parentElement.popable) {
                                node.parentElement.addEventListener("mouseenter", poporgn);
                                node.parentElement.popable = true;
                            }
                            continue;
                        }

                        if (node.textContent.trim().includes('<')) {
                            const tempDiv = document.createElement('div');
                            // Use textContent to safely set content, preventing XSS
                            tempDiv.textContent = node.textContent;
                            // Then parse it as HTML in a controlled way
                            const safeContent = sanitizeHTML(node.textContent);
                            tempDiv.innerHTML = safeContent;
                            arr.push({ _isHtmlWrapper: true, originalNode: node, replacementNode: tempDiv });
                            tarr.push('<!-- HTML_WRAPPER_START -->');
                            recurTraver(tempDiv, arr, tarr, true);
                            arr.push({ _isHtmlWrapper: false });
                            tarr.push('<!-- HTML_WRAPPER_END -->');
                        } else {
                            arr.push(node);
                            tarr.push(node.textContent);
                        }
                    }
                }
            }
        }
    }

    function recurTraverIframeContent(doc, arr, tarr) {
        if (!doc || !doc.body) return;

        // Translate all content in iframe (since iframe is inside .mes .mes_text)
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.parentElement.tagName !== "SCRIPT" &&
                node.parentElement.tagName !== "STYLE" &&
                !node.parentElement.hasAttribute('data-stv-translated')) {
                 if (chineseRegex.test(node.textContent)) {
                    const cachedTranslation = getCachedTranslation(node.textContent);
                    if (cachedTranslation) {
                        node.orgn = node.textContent;
                        node.translatedText = cachedTranslation;
                        node.textContent = setting.render ? cachedTranslation : node.textContent;
                        node.parentElement.setAttribute('data-stv-translated', 'true');
                        if (!node.parentElement.popable) {
                            node.parentElement.addEventListener("mouseenter", poporgn);
                            node.parentElement.popable = true;
                        }
                        continue;
                    }

                    arr.push(node);
                    tarr.push(node.textContent);
                }
            }
        }

        // Recursively handle nested iframes
        const nestedIframes = doc.getElementsByTagName('iframe');
        for (const iframe of nestedIframes) {
            try {
                if (iframe.contentDocument) {
                    recurTraverIframeContent(iframe.contentDocument, arr, tarr);
                    if (iframe.contentDocument.body && !observedIframes.has(iframe)) {
                        const iframeObserver = new MutationObserver(() => {
                            if (iframeObserver.debounce) clearTimeout(iframeObserver.debounce);
                            iframeObserver.debounce = setTimeout(() => realtimeTranslate(false), DEBOUNCE_TIME);
                        });
                        iframeObserver.observe(iframe.contentDocument.body, { childList: true, subtree: true, characterData: true });
                        observedIframes.add(iframe);
                    }
                }
            } catch (e) {
                // Cross-origin iframe, cannot access
            }
        }
    }

    function translatePlaceholder(arr, tarr) {
        // Only translate placeholders/titles that are within .mes .mes_text containers
        let messageContainers;
        if (setting.translateOnlyReasoning) {
            messageContainers = document.querySelectorAll('.mes.reasoning.last_mes .mes_text');
        } else {
            messageContainers = document.querySelectorAll('.mes .mes_text');
        }

        if (messageContainers.length === 0) return; // No SillyTavern messages, skip

        messageContainers.forEach(container => {
            const listNode = container.querySelectorAll("input[type=\"submit\"], [placeholder], [title]");
            for (let i = 0; i < listNode.length; i++) {
                // ===== OPTIMIZATION: Skip already translated elements =====
                if (listNode[i].hasAttribute('data-stv-placeholder-translated')) continue;

                let flag = false;
                let nodeid = 0;
                if (listNode[i].type === "submit" && listNode[i].value.match(chineseRegex)) {
                    // Check cache
                    const cachedTranslation = getCachedTranslation(listNode[i].value);
                    if (cachedTranslation) {
                        listNode[i].value = cachedTranslation;
                        listNode[i].setAttribute('data-stv-placeholder-translated', 'true');
                        continue;
                    }
                    if (!flag) { flag = true; arr.push(listNode[i]); nodeid = arr.length - 1; }
                    tarr.push(nodeid + "<obj>btnval<obj>" + listNode[i].value);
                }
                if (listNode[i].placeholder && listNode[i].placeholder.match(chineseRegex)) {
                    const cachedTranslation = getCachedTranslation(listNode[i].placeholder);
                    if (cachedTranslation) {
                        listNode[i].placeholder = cachedTranslation;
                        listNode[i].setAttribute('data-stv-placeholder-translated', 'true');
                        continue;
                    }
                    if (!flag) { flag = true; arr.push(listNode[i]); nodeid = arr.length - 1; }
                    tarr.push(nodeid + "<obj>plchd<obj>" + listNode[i].placeholder);
                }
                if (listNode[i].title && listNode[i].title.match(chineseRegex)) {
                    const cachedTranslation = getCachedTranslation(listNode[i].title);
                    if (cachedTranslation) {
                        listNode[i].title = cachedTranslation;
                        listNode[i].setAttribute('data-stv-placeholder-translated', 'true');
                        continue;
                    }
                    if (!flag) { flag = true; arr.push(listNode[i]); nodeid = arr.length - 1; }
                    tarr.push(nodeid + "<obj>title<obj>" + listNode[i].title);
                }
                if (flag) {
                    listNode[i].setAttribute('data-stv-placeholder-translated', 'true');
                }
            }
        });
    }

    function poporgn() {
        let t = "";
        for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i].nodeType === 3) { t += this.childNodes[i].orgn || ""; }
        }
        this.setAttribute("title", t);
    }

    // ===== OPTIMIZATION: Batch Processing with Retry =====
    function processBatch(nodes, texts, startIndex, endIndex, retryCount = 0) {
        return new Promise((resolve) => {
            const batchNodes = nodes.slice(startIndex, endIndex);
            const batchTexts = texts.slice(startIndex, endIndex);

            if (batchTexts.length === 0) {
                resolve();
                return;
            }

            const transtext2 = batchTexts.join("=|==|=");
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://" + setting.stvserver,
                headers: { "Content-type": "application/x-www-form-urlencoded" },
                data: "sajax=trans&content=" + encodeURIComponent(replaceName(transtext2)),
                onload: function(response) {
                    if (response.status === 200) {
                        if (!validateResponse(response.responseText)) {
                            debugLog('Invalid response received, retrying...');
                            if (retryCount < setting.maxRetries) {
                                setTimeout(() => {
                                    processBatch(nodes, texts, startIndex, endIndex, retryCount + 1).then(resolve);
                                }, 1000 * (retryCount + 1)); // Exponential backoff
                                return;
                            } else {
                                debugLog('Max retries reached, skipping batch');
                                resolve();
                                return;
                            }
                        }
                        const translateds = response.responseText.split("=|==|=");
                        let translatedsIndex = 0;
                        for (let i = 0; i < batchNodes.length; i++) {
                            const nodeInfo = batchNodes[i];
                            if (nodeInfo._isHtmlWrapper) {
                                if (nodeInfo.originalNode.parentElement) {
                                    nodeInfo.replacementNode.setAttribute('data-stv-translated', 'true');
                                    nodeInfo.originalNode.parentElement.replaceChild(nodeInfo.replacementNode, nodeInfo.originalNode);
                                }
                                translatedsIndex++;
                                continue;
                            }
                            if (batchTexts[i] === '<!-- HTML_WRAPPER_END -->') {
                                translatedsIndex++;
                                continue;
                            }
                            const translatedText = translateds[translatedsIndex];
                            if (translatedText) {
                                // ===== OPTIMIZATION: Cache the translation =====
                                setCachedTranslation(batchTexts[i], translatedText);

                                nodeInfo.orgn = batchTexts[i];
                                nodeInfo.translatedText = translatedText;
                                if (setting.render) {
                                    nodeInfo.textContent = translatedText;
                                } else {
                                    if (nodeInfo.orgn) {
                                        nodeInfo.textContent = nodeInfo.orgn;
                                    } else {
                                        nodeInfo.textContent = translatedText;
                                    }
                                }
                                if (nodeInfo.parentElement) {
                                    nodeInfo.parentElement.setAttribute('data-stv-translated', 'true');
                                    if (!nodeInfo.parentElement.popable) {
                                        nodeInfo.parentElement.addEventListener("mouseenter", poporgn);
                                        nodeInfo.parentElement.popable = true;
                                    }
                                }
                            }
                            translatedsIndex++;
                        }
                    }
                    resolve();
                },
                onerror: function(error) {
                    debugLog('Request error:', error);
                    if (retryCount < setting.maxRetries) {
                        debugLog(`Retrying batch (${retryCount + 1}/${setting.maxRetries})...`);
                        setTimeout(() => {
                            processBatch(nodes, texts, startIndex, endIndex, retryCount + 1).then(resolve);
                        }, 1000 * (retryCount + 1)); // Exponential backoff
                    } else {
                        console.error('STV Translator: Không thể kết nối đến server dịch sau', setting.maxRetries, 'lần thử');
                        resolve();
                    }
                }
            });
        });
    }

    async function realtimeTranslate(btn) {
        if (!btn && (realtimeTranslateLock || !setting.enable)) return;
        realtimeTranslateLock = true;
        setTimeout(() => { realtimeTranslateLock = false; }, LOCK_TIMEOUT);

        // ===== OPTIMIZATION: Do NOT clear markers unless forced =====
        if (btn) {
            // Xóa markers trong document chính
            const processedElements = document.querySelectorAll('[data-stv-translated], [data-stv-placeholder-translated]');
            processedElements.forEach(el => {
                el.removeAttribute('data-stv-translated');
                el.removeAttribute('data-stv-placeholder-translated');
            });

            // Xóa markers trong iframes
            const iframes = document.getElementsByTagName('iframe');
            for (const iframe of iframes) {
                try {
                    if (iframe.contentDocument) {
                        const iframeElements = iframe.contentDocument.querySelectorAll('[data-stv-translated], [data-stv-placeholder-translated]');
                        iframeElements.forEach(el => {
                            el.removeAttribute('data-stv-translated');
                            el.removeAttribute('data-stv-placeholder-translated');
                        });
                    }
                } catch (e) {
                    // Cross-origin iframe, cannot access
                }
            }
        }

        const totranslist = [];
        const transtext = [];
        recurTraver(document, totranslist, transtext);
        // REMOVED: Do not translate document title - only translate content in .mes .mes_text

        // ===== OPTIMIZATION: Batch processing =====
        if (totranslist.length > 0) {
            const numBatches = Math.ceil(totranslist.length / BATCH_SIZE);
            for (let i = 0; i < numBatches; i++) {
                const startIndex = i * BATCH_SIZE;
                const endIndex = Math.min((i + 1) * BATCH_SIZE, totranslist.length);
                await processBatch(totranslist, transtext, startIndex, endIndex);
            }

        }

        // ===== OPTIMIZATION: Combine placeholder translation with main translation =====
        const totranslist2 = [];
        const transtext3 = [];
        translatePlaceholder(totranslist2, transtext3);
        if (totranslist2.length > 0) {
            const transtext4 = transtext3.join("=|==|=");
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://" + setting.stvserver,
                headers: { "Content-type": "application/x-www-form-urlencoded" },
                data: "sajax=trans&content=" + encodeURIComponent(replaceName(transtext4)),
                onload: function(response) {
                    if (response.status === 200) {
                        if (!validateResponse(response.responseText)) {
                            debugLog('Invalid placeholder response');
                            return;
                        }
                        const translateds = response.responseText.split("=|==|=");
                        for (let i = 0; i < translateds.length; i++) {
                            const obj = translateds[i].split("<obj>");
                            if (obj.length === 3) {
                                const node = totranslist2[obj[0]];
                                const originalText = obj[1] === "title" ? node.title :
                                                    obj[1] === "btnval" ? node.value :
                                                    node.placeholder;
                                // ===== OPTIMIZATION: Cache placeholder translations =====
                                setCachedTranslation(originalText, obj[2]);

                                if (obj[1] === "title") node.title = obj[2];
                                else if (obj[1] === "btnval") node.value = obj[2];
                                else if (obj[1] === "plchd") node.placeholder = obj[2];
                            }
                        }
                    }
                },
                onerror: function(error) {
                    debugLog('Placeholder translation error:', error);
                    console.error('STV Translator: Lỗi khi dịch placeholder/title');
                }
            });
        }
    }

    // ===== TRANSLATE SINGLE MESSAGE FEATURE =====
    function translateSingleMessage(mesTextElement) {
        if (!mesTextElement) return;

        // Mark as being translated
        if (mesTextElement.hasAttribute('data-stv-translating')) {
            debugLog('Message is already being translated');
            return;
        }
        mesTextElement.setAttribute('data-stv-translating', 'true');

        const totranslist = [];
        const transtext = [];

        // Collect text nodes from this mes_text element only
        const walker = document.createTreeWalker(mesTextElement, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while(node = walker.nextNode()) {
            if (node.parentElement.tagName !== "SCRIPT" &&
                node.parentElement.tagName !== "STYLE" &&
                !node.parentElement.hasAttribute('data-stv-translated')) {
                if (chineseRegex.test(node.textContent)) {
                    // Check cache first
                    const cachedTranslation = getCachedTranslation(node.textContent);
                    if (cachedTranslation) {
                        node.orgn = node.textContent;
                        node.translatedText = cachedTranslation;
                        node.textContent = setting.render ? cachedTranslation : node.textContent;
                        node.parentElement.setAttribute('data-stv-translated', 'true');
                        if (!node.parentElement.popable) {
                            node.parentElement.addEventListener("mouseenter", poporgn);
                            node.parentElement.popable = true;
                        }
                        continue;
                    }

                    totranslist.push(node);
                    transtext.push(node.textContent);
                }
            }
        }

        // Translate iframes inside this mes_text
        const iframes = mesTextElement.getElementsByTagName('iframe');
        for (const iframe of iframes) {
            try {
                if (iframe.contentDocument) {
                    recurTraverIframeContent(iframe.contentDocument, totranslist, transtext);
                }
            } catch (e) {
                debugLog('Cannot access iframe:', e);
            }
        }

        // Process translation if there are items to translate
        if (totranslist.length > 0) {
            debugLog(`Translating single message: ${totranslist.length} items`);

            processBatch(totranslist, transtext, 0, Math.min(totranslist.length, BATCH_SIZE))
                .then(() => {
                    mesTextElement.removeAttribute('data-stv-translating');
                    debugLog('Single message translation completed');
                })
                .catch((err) => {
                    mesTextElement.removeAttribute('data-stv-translating');
                    debugLog('Single message translation error:', err);
                });
        } else {
            mesTextElement.removeAttribute('data-stv-translating');
            debugLog('No Chinese text found in this message');
        }
    }

    function addTranslateButtonListener() {
        // Use event delegation to handle dynamically added buttons
        document.body.addEventListener('click', function(event) {
            const target = event.target;

            // Check if clicked element is the translate button
            if (target.classList.contains('mes_translate') ||
                target.closest('.mes_translate')) {

                const translateBtn = target.classList.contains('mes_translate') ?
                    target : target.closest('.mes_translate');

                // Find the parent mes_block
                const mesBlock = translateBtn.closest('.mes_block');
                if (!mesBlock) {
                    debugLog('Cannot find .mes_block parent');
                    return;
                }

                // Find the mes_text within this mes_block
                const mesText = mesBlock.querySelector('.mes_text');
                if (!mesText) {
                    debugLog('Cannot find .mes_text in this message');
                    return;
                }

                debugLog('Translate button clicked for a single message');

                // Remove translation markers to force re-translation
                const processedElements = mesText.querySelectorAll('[data-stv-translated]');
                processedElements.forEach(el => {
                    el.removeAttribute('data-stv-translated');
                });

                // Translate this message only
                translateSingleMessage(mesText);

                // Visual feedback
                translateBtn.style.color = '#22d3ee';
                translateBtn.style.textShadow = '0 0 5px #22d3ee';
                setTimeout(() => {
                    translateBtn.style.color = '';
                    translateBtn.style.textShadow = '';
                }, 500);

                event.stopPropagation();
                event.preventDefault();
            }
        }, true); // Use capture phase to catch event early
    }

    function startScript() {
        if (!setting.enable) return;
        initIntersectionObserver(); // ===== OPTIMIZATION: Init observer =====
        setTimeout(realtimeTranslate, INITIAL_DELAY);
        const observer = new MutationObserver(() => {
            if (observer.debounce) clearTimeout(observer.debounce);
            observer.debounce = setTimeout(realtimeTranslate, DEBOUNCE_TIME); // ===== OPTIMIZATION: Increased debounce =====
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (observer.debounce) clearTimeout(observer.debounce);
            if (intersectionObserver) intersectionObserver.disconnect();
        });
    }

    window.showStvTranslatorSettings = function() {
        const dialogId = 'stv-translator-settings-dialog';
        if (document.getElementById(dialogId)) document.getElementById(dialogId).remove();
        const dialog = document.createElement('div');
        dialog.id = dialogId;
        dialog.innerHTML = `
            <style>
                body, body * {
                  user-select: text !important;
                }
                .stv-dialog-backdrop {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); z-index: 10000;
                    display: flex; justify-content: center; align-items: center;
                }
                .stv-dialog-content {
                    background: white; padding: 20px; border: 1px solid #ccc;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2); font-family: sans-serif; color: black;
                    width: 500px; max-width: 90%; box-sizing: border-box;
                    max-height: 90vh; overflow-y: auto;
                }
                .stv-dialog-content textarea {
                    width: 100%; box-sizing: border-box; background-color: #333; color: #eee; border: 1px solid #555;
                }
                .stv-dialog-buttons {
                    display: flex; justify-content: space-between; align-items: center; margin-top: 15px; flex-wrap: wrap; gap: 10px;
                }
                .stv-dialog-buttons .stv-dialog-right-buttons {
                    display: flex; gap: 10px;
                }
                .stv-dialog-buttons button {
                    padding: 8px 12px; border: none; cursor: pointer; flex-grow: 1;
                }
                #stv-translator-manual-add-name {
                     background-color: #4CAF50; color: white;
                }
                #stv-translator-clear-cache {
                     background-color: #ff9800; color: white;
                }

                @media (max-width: 600px) {
                    .stv-dialog-backdrop {
                        align-items: flex-start;
                        padding-top: 10px;
                    }
                    .stv-dialog-buttons {
                        flex-direction: column; align-items: stretch;
                    }
                    .stv-dialog-buttons .stv-dialog-right-buttons {
                         display: flex; flex-direction: row; justify-content: space-between;
                    }
                }
            </style>
            <div class="stv-dialog-backdrop" onclick="if (event.target === this) { this.parentElement.remove(); }">
                <div class="stv-dialog-content">
                    <h3>Cài đặt STV Translator (Optimized v3.1)</h3>
                    <label><input type="checkbox" id="stv-translator-enable" ${setting.enable ? 'checked' : ''}> Bật dịch tự động</label>
                    <hr>
                    <label><input type="checkbox" id="stv-translator-only-reasoning" ${setting.translateOnlyReasoning ? 'checked' : ''}> 🧠 Chỉ dịch Reasoning Messages</label>
                    <hr>
                    <p style="font-size: 12px; color: #555;">📊 Cache: ${translationCache.size} mục</p>
                    <hr>
                    <label><input type="checkbox" id="stv-translator-debug" ${setting.debug ? 'checked' : ''}> Bật chế độ Debug (hiện logs)</label>
                    <hr>
                    <label for="stv-translator-max-retries">Số lần thử lại khi lỗi (0-5):</label><br>
                    <input type="number" id="stv-translator-max-retries" min="0" max="5" value="${setting.maxRetries}" style="width: 100%; padding: 5px; box-sizing: border-box; background-color: #333; color: #eee; border: 1px solid #555;">
                    <hr>
                    <label for="stv-translator-namedata">Tên riêng (mỗi dòng một cặp, ví dụ: 迈克=Mike):</label><br>
                    <textarea id="stv-translator-namedata" rows="5">${setting.namedata}</textarea>
                    <hr>
                    <label for="stv-translator-excludes">Loại trừ trang (hỗ trợ wildcard *, regex /pattern/):</label><br>
                    <textarea id="stv-translator-excludes" rows="3" placeholder="google.com&#10;*.example.com&#10;/test.*\.org/">${setting.excludes}</textarea>
                    <p style="font-size: 11px; color: #666; margin-top: 5px;">Ví dụ: google.com, *.ads.com, /^test.*\.org$/</p>
                    <hr>
                    <div class="stv-dialog-buttons">
                        <button id="stv-translator-manual-add-name">Thêm Tên Thủ công</button>
                        <button id="stv-translator-clear-cache">Xóa Cache</button>
                        <div class="stv-dialog-right-buttons">
                           <button id="stv-translator-save-settings">Lưu & Tải lại</button>
                           <button id="stv-translator-close-settings">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        document.getElementById('stv-translator-save-settings').onclick = async () => {
            await GM_setValue('enable', document.getElementById('stv-translator-enable').checked);
            await GM_setValue('translateOnlyReasoning', document.getElementById('stv-translator-only-reasoning').checked);
            await GM_setValue('debug', document.getElementById('stv-translator-debug').checked);
            const maxRetries = parseInt(document.getElementById('stv-translator-max-retries').value);
            await GM_setValue('maxRetries', Math.max(0, Math.min(5, maxRetries)));
            await GM_setValue('namedata', document.getElementById('stv-translator-namedata').value);
            await GM_setValue('excludes', document.getElementById('stv-translator-excludes').value);
            alert('Đã lưu cài đặt. Trang sẽ được tải lại.');
            location.reload();
        };
        document.getElementById('stv-translator-close-settings').onclick = () => dialog.remove();
        document.getElementById('stv-translator-manual-add-name').onclick = () => showManualAddNameDialog();
        // ===== OPTIMIZATION: Clear cache button =====
        document.getElementById('stv-translator-clear-cache').onclick = () => {
            translationCache.clear();
            alert('Đã xóa cache dịch. Trang sẽ được tải lại.');
            location.reload();
        };
    }

    async function addNameToData(name) {
        let olddata = await GM_getValue('namedata', "");
        const parts = name.split('=');
        const newChineseName = parts[0].trim();
        let found = false;

        if (olddata) {
            let lines = olddata.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const lineParts = lines[i].split('=');
                const existingChineseName = lineParts[0].trim();
                if (existingChineseName === newChineseName) {
                    lines[i] = name; // Replace the existing line
                    found = true;
                    break;
                }
            }
            if (found) {
                olddata = lines.join('\n');
            } else {
                olddata += "\n" + name;
            }
        } else {
            olddata = name;
        }

        await GM_setValue('namedata', olddata);
        setting.namedata = olddata;
        namedata = olddata; // Cập nhật biến namedata
        namedatacache = null; // Invalidate cache

        // Xóa cache dịch và bản dịch cũ trong node
        translationCache.clear();
        clearOldTranslations();

        // Update the textarea in the settings dialog if it's open
        const namedataTextarea = document.getElementById('stv-translator-namedata');
        if (namedataTextarea) {
            namedataTextarea.value = olddata;
        }
    }

    function clearOldTranslations() {
        // Xóa bản dịch cũ khỏi tất cả các node
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.orgn || node.translatedText) {
                delete node.orgn;
                delete node.translatedText;
            }
        }

        // Xóa markers
        const processedElements = document.querySelectorAll('[data-stv-translated], [data-stv-placeholder-translated]');
        processedElements.forEach(el => {
            el.removeAttribute('data-stv-translated');
            el.removeAttribute('data-stv-placeholder-translated');
        });
    }

    function showManualAddNameDialog() {
       const dialogId = 'stv-translator-manual-add-dialog';
       if (document.getElementById(dialogId)) document.getElementById(dialogId).remove();

       const dialog = document.createElement('div');
       dialog.id = dialogId;
       dialog.innerHTML = `
           <style>
               #${dialogId} .stv-manual-add-dialog {
                   position: fixed;
                   top: 50%;
                   left: 50%;
                   transform: translate(-50%, -50%);
                   background: white;
                   padding: 20px;
                   border: 1px solid #ccc;
                   z-index: 10003;
                   box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                   font-family: sans-serif;
                   color: black;
                   width: 450px;
                   max-width: 90%;
                   max-height: 80vh;
                   overflow-y: auto;
               }
               #${dialogId} .name-pair-container {
                   border: 1px solid #ddd;
                   padding: 10px;
                   margin-bottom: 10px;
                   background: #f9f9f9;
                   border-radius: 4px;
               }
               #${dialogId} .name-pair-row {
                   display: flex;
                   align-items: center;
                   gap: 10px;
                   margin-bottom: 8px;
               }
               #${dialogId} .name-pair-row input {
                   flex: 1;
                   padding: 6px;
                   border: 1px solid #555;
                   background-color: #333;
                   color: #eee;
                   border-radius: 3px;
               }
               #${dialogId} .remove-pair-btn {
                   background: #e74c3c;
                   color: white;
                   border: none;
                   padding: 6px 12px;
                   cursor: pointer;
                   border-radius: 3px;
                   font-size: 14px;
               }
               #${dialogId} .add-pair-btn {
                   background: #27ae60;
                   color: white;
                   border: none;
                   padding: 10px 15px;
                   cursor: pointer;
                   border-radius: 3px;
                   margin-bottom: 15px;
                   width: 100%;
                   font-size: 14px;
                   font-weight: bold;
               }
               #${dialogId} .name-pair-row label {
                   width: 90px;
                   color: #333;
                   font-size: 13px;
               }
               @media (max-width: 600px) {
                   #${dialogId} .stv-manual-add-dialog {
                       top: 10px;
                       left: 5%;
                       width: 90%;
                       transform: none;
                   }
               }
           </style>
           <div class="stv-manual-add-dialog">
               <h4>Thêm Tên (Thủ công)</h4>
               <button class="add-pair-btn" id="add-name-pair-btn">+ Thêm mục mới</button>
               <div id="name-pairs-container"></div>
               <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px;">
                   <button id="stv-translator-manual-save-name" style="padding: 10px; background: #3498db; color: white; border: none; cursor: pointer; border-radius: 3px;">Lưu & Dịch lại</button>
                   <button id="stv-translator-manual-close" style="padding: 10px; background: #95a5a6; color: white; border: none; cursor: pointer; border-radius: 3px;">Đóng</button>
               </div>
           </div>
           <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); z-index: 10002;" onclick="this.parentElement.remove()"></div>
       `;
       document.body.appendChild(dialog);

       const container = document.getElementById('name-pairs-container');
       let pairCount = 0;

       function addNamePair(chineseVal = '', translationVal = '') {
           pairCount++;
           const pairDiv = document.createElement('div');
           pairDiv.className = 'name-pair-container';
           pairDiv.dataset.pairId = pairCount;
           pairDiv.innerHTML = `
               <div class="name-pair-row">
                   <label>Tiếng Trung:</label>
                   <input type="text" class="chinese-input" placeholder="例如: 迈克" value="${chineseVal}">
               </div>
               <div class="name-pair-row">
                   <label>Bản dịch:</label>
                   <input type="text" class="translation-input" placeholder="例如: Mike" value="${translationVal}">
                   <button class="remove-pair-btn">✕</button>
               </div>
           `;
           container.appendChild(pairDiv);

           pairDiv.querySelector('.remove-pair-btn').onclick = () => {
               pairDiv.remove();
           };

           // Focus vào ô đầu tiên của cặp mới thêm
           if (!chineseVal) {
               pairDiv.querySelector('.chinese-input').focus();
           }
       }

       // Thêm 1 cặp mặc định
       addNamePair();

       document.getElementById('add-name-pair-btn').onclick = () => {
           addNamePair();
       };

       document.getElementById('stv-translator-manual-save-name').onclick = async () => {
           const pairs = container.querySelectorAll('.name-pair-container');
           const namesToAdd = [];

           for (const pair of pairs) {
               const chinese = pair.querySelector('.chinese-input').value.trim();
               const translation = pair.querySelector('.translation-input').value.trim();

               if (chinese && translation) {
                   namesToAdd.push(`${chinese}=${translation}`);
               } else if (chinese || translation) {
                   alert("Vui lòng điền đầy đủ cả Tiếng Trung và Bản dịch cho tất cả các mục, hoặc xóa mục trống.");
                   return;
               }
           }

           if (namesToAdd.length === 0) {
               alert("Vui lòng thêm ít nhất một cặp tên.");
               return;
           }

           // Thêm tất cả các tên vào namedata
           for (const name of namesToAdd) {
               await addNameToData(name);
           }

           dialog.remove();
           realtimeTranslate(true); // Force re-translation
       };

       document.getElementById('stv-translator-manual-close').onclick = () => dialog.remove();
    }

    function toggleAllTranslations(doc = document, render) {
        if (!doc || !doc.body) return;

        // Traverse và toggle text nodes
        const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.orgn && node.translatedText) {
                if (render) {
                    node.textContent = node.translatedText;
                } else {
                    node.textContent = node.orgn; // Khôi phục text gốc
                }
            }
        }

        // Xóa markers khi toggle để cho phép dịch lại
        const processedElements = doc.querySelectorAll('[data-stv-translated], [data-stv-placeholder-translated]');
        processedElements.forEach(el => {
            el.removeAttribute('data-stv-translated');
            el.removeAttribute('data-stv-placeholder-translated');
        });

        // Khi bật render: Xóa cache và dịch lại, NHƯNG GIỮ LẠI node.orgn và node.translatedText
        if (render) {
            translationCache.clear(); // Xóa cache để dịch lại
            // KHÔNG xóa node.orgn và node.translatedText để có thể toggle lại
            realtimeTranslate(true); // Force re-translation
        }

        // Traverse into iframes
        const iframes = doc.getElementsByTagName('iframe');
        for (const iframe of iframes) {
            try {
                if (iframe.contentDocument) {
                    toggleAllTranslations(iframe.contentDocument, render);
                }
            } catch (e) {
                // Cross-origin iframe, cannot access
            }
        }
    }

    function initialize() {
        if (setting.enable) {
            const pageDomain = location.hostname;
            const excludes = setting.excludes.split("\n").map(e => e.trim()).filter(e => e.length > 0);
            // Support both exact match and regex patterns
            const isExcluded = excludes.some(pattern => {
                if (pattern.startsWith('/') && pattern.endsWith('/')) {
                    // Regex pattern
                    try {
                        const regex = new RegExp(pattern.slice(1, -1));
                        return regex.test(pageDomain);
                    } catch (e) {
                        debugLog('Invalid regex pattern:', pattern);
                        return false;
                    }
                } else if (pattern.includes('*')) {
                    // Wildcard pattern
                    const regexPattern = pattern.replace(/\*/g, '.*').replace(/\?/g, '.');
                    try {
                        const regex = new RegExp('^' + regexPattern + '$');
                        return regex.test(pageDomain);
                    } catch (e) {
                        debugLog('Invalid wildcard pattern:', pattern);
                        return false;
                    }
                } else {
                    // Exact match
                    return pattern === pageDomain;
                }
            });

            if (isExcluded) {
                setting.enable = false;
                debugLog("Page excluded from auto translation: " + pageDomain);
            }
        }
        namedatacache = null;
        GM_registerMenuCommand('Cài đặt Dịch thuật', window.showStvTranslatorSettings);
        addToggleToSillyTavernMenu();
        startScript();
        debugLog("STV Realtime Translator (Optimized v3.1) initialized.");
        debugLog("⚡ Optimizations: Cache, Batch Processing, Error Handling, XSS Protection, Retry Logic");
    }

   function addToggleToSillyTavernMenu() {
       const menuObserver = new MutationObserver((mutations, observer) => {
           const renderToggleButton = Array.from(document.querySelectorAll('.list-group-item span')).find(span => span.textContent.includes('前端渲染'));
           if (renderToggleButton && !document.getElementById('stv-translator-toggle-button')) {
               const parentMenuItem = renderToggleButton.closest('.list-group-item');
               if (parentMenuItem) {
                   const newMenuItem = parentMenuItem.cloneNode(true);
                   newMenuItem.id = 'stv-translator-toggle-button';
                   const newMenuItemSpan = newMenuItem.querySelector('span');
                   const newMenuItemIcon = newMenuItem.querySelector('i');

                   if (newMenuItemIcon) {
                       newMenuItemIcon.className = 'fa-solid fa-language';
                   }

                   const updateText = () => {
                       newMenuItemSpan.textContent = `Bật/Tắt Dịch (${setting.render ? 'Bật' : 'Tắt'})`;
                   };

                   updateText();

                   newMenuItem.addEventListener('click', (e) => {
                       e.stopPropagation();
                       setting.render = !setting.render;
                       GM_setValue('render', setting.render);
                       updateText();
                       toggleAllTranslations(document, setting.render);
                   });

                   const addNameMenuItem = parentMenuItem.cloneNode(true);
                   addNameMenuItem.id = 'stv-translator-add-name-button';
                   const addNameMenuItemSpan = addNameMenuItem.querySelector('span');
                   const addNameMenuItemIcon = addNameMenuItem.querySelector('i');

                   if (addNameMenuItemIcon) {
                       addNameMenuItemIcon.className = 'fa-solid fa-plus';
                   }
                   if (addNameMenuItemSpan) {
                       addNameMenuItemSpan.textContent = 'Thêm Tên';
                   }

                   addNameMenuItem.addEventListener('click', (e) => {
                       e.stopPropagation();
                       showManualAddNameDialog();
                   });

                   parentMenuItem.insertAdjacentElement('afterend', addNameMenuItem);
                   parentMenuItem.insertAdjacentElement('afterend', newMenuItem);
                   observer.disconnect(); // Stop observing once the buttons are added
               }
           }
       });

       menuObserver.observe(document.body, {
           childList: true,
           subtree: true
       });
   }

    // Add translate button listener
    addTranslateButtonListener();

    initialize();
}

// Logic to delay execution until SillyTavern is likely ready
function waitForSillyTavern() {
    let isInitialized = false;
    const initOnce = () => {
        if (isInitialized) return;
        isInitialized = true;
        console.log('SillyTavern UI detected. Initializing STV Translator.');
        main();
    };

    if (document.getElementById('chat') || document.getElementById('app')) {
        initOnce();
        return;
    }

    const observer = new MutationObserver((mutationsList, obs) => {
        if (document.getElementById('chat') || document.getElementById('app')) {
            initOnce();
            obs.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('STV Translator is waiting for SillyTavern UI...');
    setTimeout(() => {
        if (!isInitialized) {
            console.log('SillyTavern UI not detected, initializing anyway...');
            initOnce(); // Fallback
        }
    }, 10000);
}

waitForSillyTavern();
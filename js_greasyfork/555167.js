// ==UserScript==
// @name         Docker 中文化插件
// @namespace    https://github.com/XiaoLFeng/docker-chinese
// @description  中文化 Docker、Docker Hub 和 Docker Docs 网站的界面菜单及内容
// @copyright    2025, XiaoLFeng (https://github.com/XiaoLFeng)
// @icon         https://www.docker.com/favicon.ico
// @version      1.1.0
// @author       筱锋
// @license      MIT
// @match        https://hub.docker.com/*
// @match        https://docs.docker.com/*
// @match        https://www.docker.com/*
// @require      https://update.greasyfork.org/scripts/555069/1691491/Docker%20%E4%B8%AD%E6%96%87%E5%8C%96%E8%AF%8D%E5%BA%93.js
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_unregisterMenuCommand
// @supportURL   https://github.com/XiaoLFeng/docker-chinese/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555167/Docker%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555167/Docker%20%E4%B8%AD%E6%96%87%E5%8C%96%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function (window, document) {
    'use strict';

    // ==================== 初始化配置 ====================
    if (!window.I18N) {
        console.error('[Docker 中文化] 统一词库未加载，无法继续执行');
        return;
    }

    const lang = resolveLangKey('zh-CN');
    const langPack = window.I18N[lang] || {};
    const langConf = langPack.conf || createDefaultConf();
    const enable_RegExp = GM_getValue("enable_RegExp", 1);
    const enable_MouseInteraction = GM_getValue("enable_MouseInteraction", 1); // 鼠标监听开关，默认开启

    // 常量定义
    const APPLIED_ATTR = 'data-docker-cn';
    const APPLIED_SELECTOR_ATTR = 'data-docker-cn-selector';

    // 全局状态
    let currentPage = getPage();
    const translationCache = new Map();

    // ==================== 工具函数 ====================

    /**
     * 节流函数
     */
    function throttle(func, delay) {
        let lastCall = 0;
        let timer = null;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            } else {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    lastCall = Date.now();
                    func.apply(this, args);
                }, delay);
            }
        };
    }

    /**
     * 防抖函数
     */
    function debounce(func, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    }

    /**
     * 解析语言键
     */
    function resolveLangKey(preferred) {
        const candidates = [
            preferred,
            preferred?.replace('-', '_'),
            preferred?.split(/[-_]/)[0],
            'zh'
        ].filter(Boolean);

        for (const key of candidates) {
            if (window.I18N?.[key]) return key;
        }
        return Object.keys(window.I18N || {})[0] || 'zh';
    }

    /**
     * 创建默认配置
     */
    function createDefaultConf() {
        return {
            reIgnoreId: /^$/,
            reIgnoreClass: /(?!)/,
            reIgnoreTag: ['SCRIPT', 'STYLE', 'SVG', 'PATH', 'USE', 'SYMBOL', 'G', 'RECT', 'CIRCLE', 'POLYGON', 'ELLIPSE', 'POLYLINE', 'LINE', 'DEFS', 'MARKER', 'MASK', 'PATTERN', 'LINEARGRADIENT', 'RADIALGRADIENT', 'STOP', 'TEXT', 'TSPAN'],
            reIgnoreItemprop: /^$/
        };
    }

    /**
     * 获取当前页面类型
     */
    function getPage() {
        const { hostname, pathname } = location;

        // 路径规则：从长到短排序，避免短路径提前匹配
        const pageMap = {
            'hub.docker.com': [
                ['/repository/', 'dockerhub_repo'],      // 仓库页面（包括设置）
                ['/repositories/', 'dockerhub_repositories'], // 仓库列表
                ['/_/', 'dockerhub_official'],           // 官方镜像
                ['/tags/', 'dockerhub_tags'],            // 标签页
                ['/layers/', 'dockerhub_layers'],        // 层信息页
                ['/search', 'dockerhub_home'],           // 搜索页
                ['/hardened-images/', 'dockerhub_hardened'], // 加固镜像页
                ['/billing', 'dockerhub_billing'],    // 计费页面
                ['/usage/', 'dockerhub_usage'],        // 使用情况页面
                ['/u/', 'dockerhub_user'],              // 用户主页
            ],
            'docs.docker.com': [
                ['/engine/', 'dockerdocs_engine'],
                ['/compose/', 'dockerdocs_compose'],
            ],
            'www.docker.com': [
                ['/products/', 'docker_products'],
                ['/pricing/', 'docker_pricing'],
                ['/resources/', 'docker_resources'],
                ['/blog/', 'docker_blog'],
            ]
        };

        const defaultPages = {
            'hub.docker.com': 'dockerhub',
            'docs.docker.com': 'dockerdocs_other',
            'www.docker.com': 'docker_other'
        };

        const rules = pageMap[hostname];
        if (rules) {
            // 精确匹配首页
            if (pathname === '/') {
                const homePages = {
                    'hub.docker.com': 'dockerhub_home',
                    'docs.docker.com': 'dockerdocs_home',
                    'www.docker.com': 'docker_home'
                };
                return homePages[hostname] || defaultPages[hostname];
            }

            // 按规则匹配
            for (const [path, page] of rules) {
                if (pathname.startsWith(path)) {
                    return page;
                }
            }
        }

        return defaultPages[hostname] || 'docker_public';
    }

    /**
     * 构建回退查询链
     */
    function buildFallbackChain(page) {
        const chain = [page];
        const prefix = page.split('_')[0];
        if (prefix !== page) chain.push(prefix);
        chain.push('public');
        return chain;
    }

    /**
     * 检查是否为中文内容
     * 策略：包含2个以上中文字符且占比超过15%，或者占比超过40%
     */
    function isChinese(text) {
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
        if (!chineseChars) return false;

        const ratio = chineseChars.length / text.length;
        // 宽松策略：包含2+中文字符且占比>15%，或占比>40%
        // 这样可以识别 "搜索 Docker Hub"（2个中文，14.3%占比）等混合文本
        return (chineseChars.length >= 2 && ratio > 0.12) || ratio > 0.4;
    }

    /**
     * 转义正则表达式特殊字符
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 计算文本中的中文占比
     */
    function getChineseRatio(text) {
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
        return chineseChars ? chineseChars.length / text.length : 0;
    }

    /**
     * 检查节点是否应该被忽略
     */
    function shouldIgnoreNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.hasAttribute?.(APPLIED_ATTR)) return true;

            const id = node.id || '';
            const className = (node.className || '').toString();
            const tag = node.tagName?.toUpperCase() || '';
            const itemprop = node.getAttribute?.('itemprop') || '';

            return (
                (id && langConf.reIgnoreId.test(id)) ||
                (className && langConf.reIgnoreClass.test(className)) ||
                (tag && langConf.reIgnoreTag.includes(tag)) ||
                (itemprop && langConf.reIgnoreItemprop.test(itemprop))
            );
        }
        return false;
    }

    // ==================== 翻译核心 ====================

    /**
     * 统一查询引擎
     */
    function searchInDict(key, fallbackChain) {
        for (const pageName of fallbackChain) {
            const pack = langPack[pageName];
            if (!pack) continue;

            // 1. 正则匹配（最高优先级，用于动态内容）
            if (enable_RegExp && Array.isArray(pack.regexp)) {
                for (const [pattern, replacement] of pack.regexp) {
                    const result = key.replace(pattern, replacement);
                    if (result !== key) return result;
                }
            }

            // 2. 精确匹配（第二优先级，效率高且准确，忽略大小写）
            if (pack.exact) {
                // 先尝试精确匹配（区分大小写）
                if (pack.exact[key]) return pack.exact[key];

                // 如果精确匹配失败，尝试不区分大小写的匹配
                const lowerKey = key.toLowerCase();
                for (const [dictKey, translation] of Object.entries(pack.exact)) {
                    if (dictKey.toLowerCase() === lowerKey) {
                        return translation;
                    }
                }
            }

            // 3. 片段匹配（最低优先级，全局替换 + 中文占比验证）
            if (key.length > 30 || key.split(/\s+/).length > 5) {
                if (pack.fragments) {
                    let result = key;
                    let hasReplaced = false;

                    // 遍历所有片段，全局替换每一个匹配的片段
                    for (const [fragment, translation] of Object.entries(pack.fragments)) {
                        if (result.includes(fragment)) {
                            // 使用全局替换，替换所有匹配项
                            const regex = new RegExp(escapeRegExp(fragment), 'g');
                            result = result.replace(regex, translation);
                            hasReplaced = true;
                        }
                    }

                    if (hasReplaced) {
                        // 验证：替换后的文本中文占比必须 > 10%
                        const chineseRatio = getChineseRatio(result);
                        if (chineseRatio > 0.1) {
                            return result;
                        }
                        // 如果中文占比太低，说明翻译不完整，返回 false
                        console.debug(`[Docker 中文化] 片段替换后中文占比过低 (${(chineseRatio * 100).toFixed(1)}%): "${key.substring(0, 50)}..."`);
                    }
                }
            }
        }
        return false;
    }

    /**
     * 翻译文本（带缓存）
     */
    function translateText(text) {
        if (typeof text !== 'string') return false;

        const key = text.trim().replace(/\xa0|[\s]+/g, ' ');
        if (!key || /^[\s\u200b-\u200d\ufeff]*$/.test(key) || isChinese(key)) {
            return false;
        }

        // 查询缓存
        if (translationCache.has(key)) {
            return translationCache.get(key);
        }

        // 查询词库
        const fallbackChain = buildFallbackChain(currentPage);
        const result = searchInDict(key, fallbackChain);

        // 缓存结果
        translationCache.set(key, result);

        // 调试：记录翻译失败的文本（排除纯数字、纯符号等无意义内容）
        if (!result && key.length >= 3 && key.length <= 100 && /[a-zA-Z]{3,}/.test(key)) {
            console.debug(`[Docker 中文化] 未翻译: "${key}" (页面: ${currentPage}, 回退链: ${fallbackChain.join(' > ')})`);
        }

        return result && result !== key ? text.replace(text.trim(), result) : false;
    }

    /**
     * 翻译元素
     * @returns {boolean} 是否成功翻译
     */
    function transElement(el, field, isAttr = false) {
        const text = isAttr ? el.getAttribute(field) : el[field];
        const translated = translateText(text);

        if (translated) {
            isAttr ? el.setAttribute(field, translated) : (el[field] = translated);
            return true; // 翻译成功
        }
        return false; // 翻译失败或无需翻译
    }

    /**
     * 翻译页面标题
     */
    function transTitle() {
        const titlePack = langPack.title;
        if (!titlePack) return;

        const key = document.title;
        let result = titlePack.exact?.[key];

        if (!result && Array.isArray(titlePack.regexp)) {
            for (const [pattern, replacement] of titlePack.regexp) {
                const replaced = key.replace(pattern, replacement);
                if (replaced !== key) {
                    result = replaced;
                    break;
                }
            }
        }

        if (result) document.title = result;
    }

    // ==================== DOM 遍历 ====================

    /**
     * 翻译元素属性
     * @returns {boolean} 是否有任何属性被成功翻译
     */
    function transElementAttrs(node) {
        let hasTranslated = false;

        const attrMap = {
            INPUT: { button: ['data-confirm', 'value'], submit: ['data-confirm', 'value'], reset: ['data-confirm', 'value'], default: ['placeholder'] },
            TEXTAREA: { default: ['placeholder'] },
            BUTTON: { default: ['aria-label', 'title', 'data-confirm', 'data-disable-with'] },
            OPTGROUP: { default: ['label'] }
        };

        const tag = node.tagName;
        const type = node.type || 'default';
        const attrs = attrMap[tag]?.[type] || attrMap[tag]?.default;

        if (attrs) {
            attrs.forEach(attr => {
                if (node.hasAttribute(attr)) {
                    if (transElement(node, attr, true)) {
                        hasTranslated = true;
                    }
                }
            });
        } else if (node.getAttribute?.('aria-label')) {
            if (transElement(node, 'aria-label', true)) {
                hasTranslated = true;
            }
        } else if (node.hasAttribute?.('title')) {
            if (transElement(node, 'title', true)) {
                hasTranslated = true;
            }
        }

        return hasTranslated;
    }

    /**
     * 补充翻译：对元素中剩余的文本节点进行 exact 和 fragments 匹配
     * @param {Element} element - 要补充翻译的元素
     * @returns {boolean} 是否有文本被翻译
     */
    function supplementaryTranslation(element) {
        if (!element) return false;

        let hasTranslated = false;
        const fallbackChain = buildFallbackChain(currentPage);

        // 遍历所有文本节点
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    // 只处理有实际内容的文本节点
                    if (!node.textContent || node.textContent.trim().length === 0) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 跳过已经是中文的节点
                    if (isChinese(node.textContent)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    // 检查父元素链，确保不在 SVG 或其他不应翻译的元素内部
                    let parent = node.parentElement;
                    while (parent) {
                        const tagName = parent.tagName?.toUpperCase();
                        const ignoreTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'SVG', 'NOSCRIPT'];
                        if (ignoreTags.includes(tagName)) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        parent = parent.parentElement;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let textNode;
        while (textNode = walker.nextNode()) {
            const originalText = textNode.textContent.trim().replace(/\xa0|[\s]+/g, ' ');
            if (!originalText) continue;

            let nodeTranslated = false; // 跟踪当前节点是否被翻译

            // 尝试 exact 匹配
            for (const pageName of fallbackChain) {
                const pack = langPack[pageName];
                if (!pack || !pack.exact) continue;

                const translation = pack.exact[originalText];
                if (translation) {
                    textNode.textContent = textNode.textContent.replace(textNode.textContent.trim(), translation);
                    hasTranslated = true;
                    nodeTranslated = true;
                    console.debug(`[Docker 中文化] 二次翻译 (exact): "${originalText}" → "${translation}"`);
                    break; // 找到翻译后停止查找
                }
            }

            // 如果 exact 没有匹配，尝试 fragments（仅对较长文本）
            if (!nodeTranslated && (originalText.length > 30 || originalText.split(/\s+/).length > 5)) {
                for (const pageName of fallbackChain) {
                    const pack = langPack[pageName];
                    if (!pack || !pack.fragments) continue;

                    let result = originalText;
                    let fragmentMatched = false;

                    for (const [fragment, translation] of Object.entries(pack.fragments)) {
                        if (result.includes(fragment)) {
                            const regex = new RegExp(escapeRegExp(fragment), 'g');
                            result = result.replace(regex, translation);
                            fragmentMatched = true;
                        }
                    }

                    if (fragmentMatched) {
                        const chineseRatio = getChineseRatio(result);
                        if (chineseRatio > 0.1) {
                            textNode.textContent = textNode.textContent.replace(textNode.textContent.trim(), result);
                            hasTranslated = true;
                            console.debug(`[Docker 中文化] 二次翻译 (fragments): "${originalText.substring(0, 30)}..." → "${result.substring(0, 30)}..."`);
                            break;
                        }
                    }
                }
            }
        }

        return hasTranslated;
    }

    /**
     * 尝试对包含子元素的父元素进行整体正则翻译
     * @param {Element} element - 要翻译的元素
     * @returns {boolean} 是否翻译成功
     */
    function tryRegexpTranslation(element) {
        // 严格的元素类型检查：排除不应该翻译的标签
        const tagName = element.tagName?.toUpperCase();
        const ignoreTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'INPUT', 'NOSCRIPT', 'SVG'];
        if (ignoreTags.includes(tagName)) return false;

        // 只处理包含子元素的元素
        const hasChildElements = Array.from(element.childNodes).some(
            child => child.nodeType === Node.ELEMENT_NODE
        );
        if (!hasChildElements) return false;

        // 提取完整的文本内容
        const originalText = element.textContent?.trim();

        // 安全检查：
        // 1. 文本不能为空
        // 2. 不能已经是中文
        // 3. 文本长度不能太长（避免翻译大段代码）
        // 4. 文本长度不能太短（至少要有实际内容）
        if (!originalText || isChinese(originalText) || originalText.length > 200 || originalText.length < 5) {
            return false;
        }

        // 检查是否包含大量特殊字符（可能是代码）
        const specialCharsRatio = (originalText.match(/[{}()\[\];:,<>\/\\+=*&|^%$#@!~`]/g) || []).length / originalText.length;
        if (specialCharsRatio > 0.3) return false; // 如果特殊字符超过30%，可能是代码

        // 使用占位符策略：将子元素替换为占位符，翻译后再恢复
        const childElements = [];
        let hasUnsupportedChild = false;
        let placeholderIndex = 0;
        let textWithPlaceholders = '';

        // 遍历所有子节点，构建带占位符的文本
        Array.from(element.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                // 保留文本节点内容
                textWithPlaceholders += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const childTag = child.tagName?.toUpperCase();

                // 检查是否是禁止翻译的标签
                const forbiddenTags = ['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'SVG', 'NOSCRIPT', 'INPUT', 'SELECT', 'BUTTON'];
                if (forbiddenTags.includes(childTag)) {
                    hasUnsupportedChild = true;
                    return;
                }

                // 纯格式化标签：如果只包含文本且没有特殊属性，提取文本而不用占位符
                const pureFormatTags = ['STRONG', 'B', 'EM', 'I', 'U', 'MARK', 'SMALL'];
                // 需要保护的标签（有属性或特殊功能）：使用占位符
                const protectedTags = ['A', 'SPAN'];

                if (pureFormatTags.includes(childTag)) {
                    // 检查是否有特殊属性（class、id、style 等）
                    const hasSpecialAttrs = child.attributes.length > 0;
                    // 检查是否有非文本子节点（嵌套元素）
                    const hasNestedElements = Array.from(child.childNodes).some(n => n.nodeType === Node.ELEMENT_NODE);

                    if (!hasSpecialAttrs && !hasNestedElements) {
                        // 纯文本格式标签，提取文本并记录位置信息
                        const textContent = child.textContent;
                        const startPos = textWithPlaceholders.length;  // 记录起始位置
                        textWithPlaceholders += textContent;
                        const endPos = textWithPlaceholders.length;    // 记录结束位置

                        // 记录格式信息以便恢复
                        childElements.push({
                            type: 'format',
                            tag: childTag.toLowerCase(),
                            text: textContent,
                            startPos: startPos,
                            endPos: endPos,
                            html: child.outerHTML
                        });
                    } else {
                        // 有属性或嵌套，使用占位符保护
                        const placeholder = `__PLACEHOLDER_${placeholderIndex}__`;
                        placeholderIndex++;

                        childElements.push({
                            type: 'placeholder',
                            placeholder: placeholder,
                            html: child.outerHTML
                        });

                        textWithPlaceholders += placeholder;
                    }
                } else if (protectedTags.includes(childTag)) {
                    // 需要保护的标签（如链接、span），使用占位符
                    const placeholder = `__PLACEHOLDER_${placeholderIndex}__`;
                    placeholderIndex++;

                    childElements.push({
                        type: 'placeholder',
                        placeholder: placeholder,
                        html: child.outerHTML
                    });

                    textWithPlaceholders += placeholder;
                } else {
                    // 其他标签标记为不支持
                    hasUnsupportedChild = true;
                }
            }
        });

        // 如果包含不支持的子元素，放弃整体翻译
        if (hasUnsupportedChild) return false;

        // 如果没有需要保留的子元素，不进行整体翻译
        if (childElements.length === 0) return false;

        const textToTranslate = textWithPlaceholders.trim();

        // 尝试用正则表达式翻译（翻译带占位符的文本）
        const fallbackChain = buildFallbackChain(currentPage);
        for (const pageName of fallbackChain) {
            const pack = langPack[pageName];
            if (!pack || !enable_RegExp || !Array.isArray(pack.regexp)) continue;

            for (const [pattern, replacement] of pack.regexp) {
                const translatedText = textToTranslate.replace(pattern, replacement);
                if (translatedText !== textToTranslate) {
                    // 正则匹配成功，现在需要恢复占位符
                    let newHTML = translatedText;

                    // 恢复占位符为实际的 HTML
                    childElements.forEach(child => {
                        if (child.type === 'placeholder') {
                            // 占位符类型：直接替换
                            newHTML = newHTML.replace(child.placeholder, child.html);
                        }
                        // format 类型不处理，让 supplementaryTranslation 去翻译格式标签内的内容
                    });

                    // 应用翻译结果
                    element.innerHTML = newHTML;
                    console.debug(`[Docker 中文化] 正则整体翻译: "${originalText.substring(0, 50)}..." → "${translatedText.substring(0, 50)}..."`);

                    // 二次翻译：对翻译后的元素中剩余的英文文本节点进行 exact 匹配
                    // 这里会处理格式标签内的文本
                    supplementaryTranslation(element);

                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 遍历并翻译节点
     * @returns {boolean} 当前节点或其子节点是否有翻译成功
     */
    function traverseNode(node) {
        if (!node || shouldIgnoreNode(node)) return false;

        let hasTranslated = false;

        if (node.nodeType === Node.ELEMENT_NODE) {
            // 翻译属性
            if (transElementAttrs(node)) {
                hasTranslated = true;
            }

            // 尝试对包含子元素的元素进行整体正则翻译
            if (tryRegexpTranslation(node)) {
                hasTranslated = true;
                // 正则翻译成功后，标记元素并直接返回，不再遍历子节点
                node.setAttribute?.(APPLIED_ATTR, 'true');
                return true;
            }

            // 遍历子节点
            const useTreeWalker = node.childNodes.length > 10;
            if (useTreeWalker && document.createTreeWalker) {
                const walker = document.createTreeWalker(
                    node,
                    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                    {
                        acceptNode: n => {
                            if (n.nodeType === Node.ELEMENT_NODE) {
                                if (n.hasAttribute?.(APPLIED_ATTR)) return NodeFilter.FILTER_REJECT;
                                if (langConf.reIgnoreTag.includes(n.tagName?.toUpperCase())) {
                                    return NodeFilter.FILTER_REJECT;
                                }
                            }
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }
                );

                let current;
                while (current = walker.nextNode()) {
                    if (current !== node && traverseNode(current)) {
                        hasTranslated = true;
                    }
                }
            } else {
                Array.from(node.childNodes).forEach(child => {
                    if (traverseNode(child)) {
                        hasTranslated = true;
                    }
                });
            }

            // 只在有翻译成功时才标记
            if (hasTranslated) {
                node.setAttribute?.(APPLIED_ATTR, 'true');
            }

        } else if (node.nodeType === Node.TEXT_NODE && node.length > 0 && node.length <= 500) {
            if (transElement(node, 'data')) {
                hasTranslated = true;
            }
        }

        return hasTranslated;
    }

    // ==================== 选择器翻译 ====================

    /**
     * 应用选择器翻译
     */
    function applySelectorTrans(el, translation, originalText) {
        if (!el || el.hasAttribute?.(APPLIED_SELECTOR_ATTR)) return;

        const tagMap = {
            INPUT: (e) => {
                if (e.hasAttribute('placeholder')) e.placeholder = translation;
                else if (['button', 'submit', 'reset'].includes(e.type)) e.value = translation;
            },
            TEXTAREA: (e) => e.hasAttribute('placeholder') && (e.placeholder = translation),
            OPTGROUP: (e) => e.label = translation
        };

        if (tagMap[el.tagName]) {
            tagMap[el.tagName](el);
        } else if (originalText) {
            // 对于 :contains() 选择器，只替换匹配的文本节点，保留子元素
            replaceTextInNode(el, originalText, translation);
        } else {
            // 普通选择器，直接替换 textContent
            el.textContent = translation;
        }

        el.setAttribute?.(APPLIED_SELECTOR_ATTR, 'true');
    }

    /**
     * 在节点中替换文本，保留子元素
     */
    function replaceTextInNode(node, searchText, replaceText) {
        // 遍历所有子节点
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null
        );

        const textNodes = [];
        let currentNode;
        while (currentNode = walker.nextNode()) {
            if (currentNode.textContent.includes(searchText)) {
                textNodes.push(currentNode);
            }
        }

        // 替换找到的文本节点
        textNodes.forEach(textNode => {
            textNode.textContent = textNode.textContent.replace(searchText, replaceText);
        });
    }

    /**
     * 通过选择器翻译
     */
    function transBySelector() {
        const fallbackChain = buildFallbackChain(currentPage);
        const selectors = [];

        for (const pageName of fallbackChain) {
            const pack = langPack[pageName];
            if (pack?.selector) selectors.push(...pack.selector);
        }

        selectors.forEach(([selector, translation]) => {
            if (!selector || typeof translation !== 'string') return;

            try {
                const containsMatch = selector.match(/^(.*):contains\((['"])(.+?)\2\)$/);
                if (containsMatch) {
                    const [, base, , needle] = containsMatch;
                    document.querySelectorAll(base.trim()).forEach(el => {
                        if (el.textContent?.includes(needle)) {
                            // 传递原始文本，用于精确替换
                            applySelectorTrans(el, translation, needle);
                        }
                    });
                } else {
                    document.querySelectorAll(selector).forEach(el => {
                        applySelectorTrans(el, translation);
                    });
                }
            } catch (err) {
                console.warn('[Docker 中文化] 选择器解析失败:', selector, err);
            }
        });
    }


    // ==================== 监听器 ====================

    /**
     * 监听页面变化
     */
    function watchUpdate() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        if (!MutationObserver || !document.body) return;

        let previousURL = location.href;

        // URL 变化处理
        const handleURLChange = debounce(() => {
            currentPage = getPage();
            console.log(`[Docker 中文化] 页面切换: ${currentPage}`);

            // 清空缓存和旧标记
            translationCache.clear();
            document.querySelectorAll(`[${APPLIED_ATTR}]`)
                .forEach(el => el.removeAttribute(APPLIED_ATTR));

            // 重新翻译
            transTitle();
            transBySelector();
            if (document.body) traverseNode(document.body);
        }, 300);

        // DOM 变化处理
        const handleMutations = throttle(mutations => {
            mutations
                .filter(m => m.addedNodes.length > 0 || m.type === 'attributes' || m.type === 'characterData')
                .forEach(m => {
                    const target = m.target;

                    // 对于文本节点的变化，移除父元素的标记以允许重新翻译
                    if (m.type === 'characterData' && target.parentElement) {
                        target.parentElement.removeAttribute?.(APPLIED_ATTR);
                    }

                    if (target.nodeType === Node.ELEMENT_NODE) {
                        const tag = target.tagName;
                        if (['SCRIPT', 'STYLE', 'svg'].includes(tag)) return;

                        // 属性变化时，移除标记
                        if (m.type === 'attributes') {
                            target.removeAttribute?.(APPLIED_ATTR);
                        }
                    }

                    traverseNode(target);
                });
        }, 100);

        // 创建观察器
        const observer = new MutationObserver(mutations => {
            const currentURL = location.href;
            if (currentURL !== previousURL) {
                previousURL = currentURL;
                handleURLChange();
            }
            handleMutations(mutations);
        });

        observer.observe(document.body, {
            characterData: true,
            characterDataOldValue: true,
            subtree: true,
            childList: true,
            attributeFilter: ['value', 'placeholder', 'aria-label', 'title', 'data-confirm']
        });
    }

    /**
     * 监听鼠标交互，按需翻译
     */
    function watchMouseInteraction() {
        if (!document.body) return;

        // 处理鼠标交互事件
        const handleInteraction = throttle((event) => {
            const target = event.target;
            if (!target || target.nodeType !== Node.ELEMENT_NODE) return;

            // 检查目标元素及其父元素链
            let current = target;
            let depth = 0;
            const maxDepth = 5; // 最多向上查找5层

            while (current && depth < maxDepth) {
                // 如果元素没有被标记，说明还没翻译过
                if (!current.hasAttribute?.(APPLIED_ATTR) && !shouldIgnoreNode(current)) {
                    // 尝试翻译该元素
                    const translated = traverseNode(current);
                    if (translated) {
                        console.debug(`[Docker 中文化] 鼠标交互触发翻译: ${current.tagName}`, current);
                    }
                    break; // 翻译完成后停止向上查找
                }
                current = current.parentElement;
                depth++;
            }
        }, 200);

        // 监听点击事件
        document.body.addEventListener('click', handleInteraction, true);

        // 监听鼠标悬浮事件
        document.body.addEventListener('mouseover', handleInteraction, true);

        console.log('[Docker 中文化] 鼠标交互监听已启动');
    }

    // ==================== 菜单命令 ====================

    function registerMenuCommand() {
        if (typeof GM_registerMenuCommand !== 'function') return;

        let menuId;
        let regexpEnabled = enable_RegExp;

        const toggleRegExp = () => {
            regexpEnabled = !regexpEnabled;
            GM_setValue("enable_RegExp", regexpEnabled);

            if (typeof GM_notification === 'function') {
                GM_notification(`已${regexpEnabled ? '开启' : '关闭'}正则功能`);
            }

            if (regexpEnabled) location.reload();

            if (typeof GM_unregisterMenuCommand === 'function' && menuId) {
                GM_unregisterMenuCommand(menuId);
            }
            menuId = GM_registerMenuCommand(
                `${regexpEnabled ? '关闭' : '开启'}正则功能`,
                toggleRegExp
            );
        };

        menuId = GM_registerMenuCommand(
            `${regexpEnabled ? '关闭' : '开启'}正则功能`,
            toggleRegExp
        );
    }

    // ==================== 初始化 ====================

    function init() {
        console.log(`[Docker 中文化] 开始翻译, 页面类型: ${currentPage}`);

        transTitle();

        // 立即执行一次翻译
        if (document.body) {
            traverseNode(document.body);
        }

        transBySelector();

        // 再延迟一次，处理慢速加载的内容
        setTimeout(() => {
            console.log('[Docker 中文化] 延迟翻译(0)');
            if (document.body) {
                document.querySelectorAll(`[${APPLIED_ATTR}]`)
                    .forEach(el => el.removeAttribute(APPLIED_ATTR));
                traverseNode(document.body);
            }
        }, 500);
        setTimeout(() => {
            console.log('[Docker 中文化] 延迟翻译(1)');
            if (document.body) {
                document.querySelectorAll(`[${APPLIED_ATTR}]`)
                    .forEach(el => el.removeAttribute(APPLIED_ATTR));
                traverseNode(document.body);
            }
        }, 2000);

        watchUpdate();
        watchMouseInteraction();
    }

    // ==================== 执行 ====================

    /**
     * 等待页面完全加载后再初始化
     */
    function safeInit() {
        registerMenuCommand();

        // 检查 document.readyState
        if (document.readyState === 'loading') {
            // DOM 还在加载，等待 DOMContentLoaded
            document.addEventListener('DOMContentLoaded', () => {
                console.log('[Docker 中文化] DOMContentLoaded 触发，开始初始化');
                init();
            });
        } else if (document.readyState === 'interactive') {
            // DOM 已解析，但子资源还在加载
            // 对于 SPA，最好等 load 事件，并等待浏览器空闲或给予缓冲时间
            window.addEventListener('load', () => {
                console.log('[Docker 中文化] window.load 触发，等待 SPA 初始化');

                // 优先使用 requestIdleCallback，等待浏览器空闲
                if (typeof requestIdleCallback === 'function') {
                    requestIdleCallback(() => {
                        console.log('[Docker 中文化] 浏览器空闲，开始初始化');
                        init();
                    }, { timeout: 1000 }); // 最多等待 1000ms
                } else {
                    // 降级方案：使用延迟确保 SPA 已渲染
                    setTimeout(() => {
                        console.log('[Docker 中文化] 延迟后开始初始化');
                        init();
                    }, 300);
                }
            });
        } else {
            // document.readyState === 'complete'
            // 页面完全加载完成，但 SPA 可能还在初始化
            console.log('[Docker 中文化] 页面已完全加载，等待 SPA 就绪');

            // 给 SPA 一点时间完成初始化和渲染
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(() => {
                    console.log('[Docker 中文化] 浏览器空闲，开始初始化');
                    init();
                }, { timeout: 500 }); // 最多等待 500ms
            } else {
                setTimeout(() => {
                    console.log('[Docker 中文化] 延迟后开始初始化');
                    init();
                }, 200);
            }
        }
    }

    safeInit();

})(window, document);

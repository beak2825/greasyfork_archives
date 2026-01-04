// ==UserScript==
// @name         [Chat] Template Text Folders [20251205] v1.1.0
// @namespace    https://github.com/0-V-linuxdo/Chat_Template_Text_Folders
// @description  在AI页面上添加预设文本文件夹和按钮，提升输入效率。
//
// @version      [20251205] v1.1.0
// @update-log   Improved Gemini Business input support and deep editable detection for shadow DOM editors.
//
// @match        https://chatgpt.com/*
// @match        https://chat01.ai/*
//
// @match        https://claude.*/*
// @match        https://*.fuclaude.com/*
//
// @match        https://gemini.google.com/*
// @match        https://aistudio.google.com/*
// @match        https://business.gemini.google/*
//
// @match        https://copilot.microsoft.com/*
//
// @match        https://grok.com/*
// @match        https://grok.dairoot.cn/*
//
// @match        https://chat.deepseek.com/*
// @match        https://chat.z.ai/*
// @match        https://chat.qwen.ai/*
// @match        https://anuneko.com/*
//
// @match        https://chat.mistral.ai/*
//
// @match        https://*.perplexity.ai/*
//
// @match        https://lmarena.ai/*
// @match        https://poe.com/*
// @match        https://kagi.com/assistant*
// @match        https://app.chathub.gg/*
// @match        https://monica.im/*
//
// @match        https://setapp.typingcloud.com/*
//
// @match        https://linux.do/discourse-ai/ai-bot/*
//
// @match        https://cursor.com/*
//
// @match        https://www.notion.so/*
//
// @grant        none
// @require      https://update.greasyfork.org/scripts/554157/1686169/%5BChat%5D%20Template%20Text%20Folders%20%5B20251016%5Dconfigjs.js
// @icon         https://raw.githubusercontent.com/0-V-linuxdo/Chat_Template_Text_Folders/main/Icon.svg
// @downloadURL https://update.greasyfork.org/scripts/552640/%5BChat%5D%20Template%20Text%20Folders%20%5B20251205%5D%20v110.user.js
// @updateURL https://update.greasyfork.org/scripts/552640/%5BChat%5D%20Template%20Text%20Folders%20%5B20251205%5D%20v110.meta.js
// ==/UserScript==

/* ===================== IMPORTANT · NOTICE · START =====================
 *
 * 1. [编辑指引 | Edit Guidance]
 *    • ⚠️ 这是一个自动生成的文件：请在 `src/modules` 目录下的模块中进行修改，然后运行 `npm run build` 在 `dist/` 目录下重新生成。
 *    • ⚠️ This project bundles auto-generated artifacts. Make changes inside the modules under `src/modules`, then run `npm run build` to regenerate everything under `dist/`.
 *
 * ----------------------------------------------------------------------
 *
 * 2. [安全提示 | Safety Reminder]
 *    • ✅ 必须使用 `setTrustedHTML`，不得使用 `innerHTML`。
 *    • ✅ Always call `setTrustedHTML`; never rely on `innerHTML`.
 *
 * ====================== IMPORTANT · NOTICE · END ======================
 */

/* -------------------------------------------------------------------------- *
 * Module 01 · Runtime services (globals, utilities, config bootstrapping)
 * -------------------------------------------------------------------------- */

(function () {
    'use strict';

    console.log("🎉 [Chat] Template Text Folders [20251205] v1.0.0 🎉");

    let trustedHTMLPolicy = null;
    const resolveTrustedTypes = () => {
        if (trustedHTMLPolicy) {
            return trustedHTMLPolicy;
        }
        const globalObj = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
        const trustedTypesAPI = globalObj && globalObj.trustedTypes ? globalObj.trustedTypes : null;
        if (!trustedTypesAPI) {
            return null;
        }
        try {
            trustedHTMLPolicy = trustedTypesAPI.createPolicy('chat_template_text_folders_policy', {
                createHTML: (input) => input
            });
        } catch (error) {
            console.warn('[Chat] Template Text Folders Trusted Types policy creation failed', error);
            trustedHTMLPolicy = null;
        }
        return trustedHTMLPolicy;
    };

    // Trusted Types: always call this helper instead of element.innerHTML to keep every injection compatible with strict hosts.
    const setTrustedHTML = (element, html) => {
        if (!element) {
            return;
        }
        const value = typeof html === 'string' ? html : (html == null ? '' : String(html));
        const policy = resolveTrustedTypes();
        if (policy) {
            element.innerHTML = policy.createHTML(value);
        } else {
            element.innerHTML = value;
        }
    };

    const UI_HOST_ID = 'cttf-ui-host';
    let latestThemeValues = null;
    let uiShadowRoot = null;
    let uiMainLayer = null;
    let uiOverlayLayer = null;

    const getLocaleBridge = () => {
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow.CTTFLocaleConfig) {
            return unsafeWindow.CTTFLocaleConfig;
        }
        if (typeof window !== 'undefined' && window.CTTFLocaleConfig) {
            return window.CTTFLocaleConfig;
        }
        return null;
    };

    const applyReplacementsFallback = (text, replacements) => {
        if (!text || !replacements) {
            return text;
        }
        let result = text;
        Object.entries(replacements).forEach(([key, value]) => {
            const safeValue = value == null ? '' : String(value);
            result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), safeValue);
        });
        return result;
    };

    const t = (sourceText, replacements, overrideLocale) => {
        const localeConfig = getLocaleBridge();
        if (localeConfig && typeof localeConfig.translate === 'function') {
            try {
                return localeConfig.translate(sourceText, replacements, overrideLocale);
            } catch (error) {
                console.warn('[Chat] Template Text Folders i18n translate error:', error);
            }
        }
        return applyReplacementsFallback(sourceText, replacements);
    };

    const isNonChineseLocale = () => {
        const localeConfig = getLocaleBridge();
        if (!localeConfig || typeof localeConfig.getLocale !== 'function') {
            return false;
        }
        const locale = localeConfig.getLocale();
        return locale ? !/^zh(?:-|$)/i.test(locale) : false;
    };

    const LOCALIZABLE_ATTRIBUTES = ['title', 'placeholder', 'aria-label', 'aria-description', 'aria-describedby', 'data-tooltip'];
    const LANGUAGE_PREFERENCE_STORAGE_KEY = 'cttf-language-preference';

    let translationsCache = null;
    let reverseTranslationsCache = {};

    const normalizeLocaleKey = (locale) => {
        if (!locale) {
            return 'en';
        }
        const lower = locale.toLowerCase();
        if (lower.startsWith('zh')) {
            return 'zh';
        }
        return 'en';
    };

    const getTranslationsCache = () => {
        if (translationsCache) {
            return translationsCache;
        }
        const localeConfig = getLocaleBridge();
        if (!localeConfig || typeof localeConfig.getTranslations !== 'function') {
            return null;
        }
        try {
            translationsCache = localeConfig.getTranslations();
            reverseTranslationsCache = {};
            return translationsCache;
        } catch (error) {
            console.warn('[Chat] Template Text Folders] Failed to obtain translations map:', error);
            translationsCache = null;
            return null;
        }
    };

    const resolveI18nKey = (rawValue, locale) => {
        if (!rawValue) {
            return null;
        }
        const cache = getTranslationsCache();
        if (!cache) {
            return null;
        }
        const normalizedLocale = normalizeLocaleKey(locale);
        const trimmedValue = rawValue.trim();
        if (!trimmedValue) {
            return null;
        }

        if (normalizedLocale === 'zh') {
            const zhDict = cache.zh || {};
            if (Object.prototype.hasOwnProperty.call(zhDict, trimmedValue)) {
                return trimmedValue;
            }
        }

        const ensureReverseIndex = (loc) => {
            if (!reverseTranslationsCache[loc]) {
                const dict = cache[loc] || {};
                const reverseMap = {};
                Object.entries(dict).forEach(([key, value]) => {
                    if (typeof value === 'string' && value.trim()) {
                        reverseMap[value] = key;
                    }
                });
                reverseTranslationsCache[loc] = reverseMap;
            }
            return reverseTranslationsCache[loc];
        };

        const reverseForLocale = ensureReverseIndex(normalizedLocale);
        if (reverseForLocale && reverseForLocale[trimmedValue]) {
            return reverseForLocale[trimmedValue];
        }

        const zhDict = cache.zh || {};
        if (Object.prototype.hasOwnProperty.call(zhDict, trimmedValue)) {
            return trimmedValue;
        }

        return null;
    };

    const localizeElement = (root) => {
        if (!root) {
            return root;
        }

        const getCurrentLocale = () => {
            const localeConfig = getLocaleBridge();
            if (!localeConfig || typeof localeConfig.getLocale !== 'function') {
                return null;
            }
            return localeConfig.getLocale();
        };

        const locale = getCurrentLocale();
        const normalizedLocaleKey = normalizeLocaleKey(locale || '');
        const isChineseLocale = normalizedLocaleKey === 'zh';

        const translateTextNode = (node) => {
            const original = node.nodeValue;
            if (!original) {
                return;
            }
            const storedOriginal = node.__cttfLocaleOriginal ?? original;
            if (node.__cttfLocaleOriginal == null) {
                node.__cttfLocaleOriginal = original;
            }
            const trimmed = storedOriginal.trim();
            if (!trimmed) {
                return;
            }
            let translationKey = node.__cttfLocaleKey || null;
            if (!translationKey) {
                translationKey = resolveI18nKey(trimmed, locale);
                if (translationKey) {
                    node.__cttfLocaleKey = translationKey;
                }
            }
            const sourceText = translationKey || trimmed;
            const startIdx = storedOriginal.indexOf(trimmed);
            const prefix = startIdx >= 0 ? storedOriginal.slice(0, startIdx) : '';
            const suffix = startIdx >= 0 ? storedOriginal.slice(startIdx + trimmed.length) : '';

            if (isChineseLocale) {
                const target = `${prefix}${sourceText}${suffix}`;
                if (node.nodeValue !== target) {
                    node.nodeValue = target;
                }
                return;
            }

            const translated = t(sourceText);
            const targetContent = translated === sourceText ? sourceText : translated;
            const target = `${prefix}${targetContent}${suffix}`;
            if (node.nodeValue !== target) {
                node.nodeValue = target;
            }
        };

        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root);
            return root;
        }

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let currentNode = walker.nextNode();
        while (currentNode) {
            translateTextNode(currentNode);
            currentNode = walker.nextNode();
        }

        const elements = root.nodeType === Node.ELEMENT_NODE
            ? [root, ...root.querySelectorAll('*')]
            : root.querySelectorAll ? Array.from(root.querySelectorAll('*')) : [];

        elements.forEach((el) => {
            if (!el.__cttfAttrOriginals) {
                el.__cttfAttrOriginals = {};
            }
            LOCALIZABLE_ATTRIBUTES.forEach((attr) => {
                if (!el.hasAttribute(attr)) {
                    return;
                }
                const value = el.getAttribute(attr);
                if (!value) {
                    return;
                }
                if (!el.__cttfAttrOriginals[attr]) {
                    el.__cttfAttrOriginals[attr] = value;
                }
                if (!el.__cttfAttrKeys) {
                    el.__cttfAttrKeys = {};
                }
                const originalValue = el.__cttfAttrOriginals[attr];
                let attrKey = el.__cttfAttrKeys[attr] || null;
                if (!attrKey) {
                    attrKey = resolveI18nKey(originalValue, locale);
                    if (attrKey) {
                        el.__cttfAttrKeys[attr] = attrKey;
                    }
                }
                const sourceValue = attrKey || originalValue;
                if (isChineseLocale) {
                    if (value !== sourceValue) {
                        el.setAttribute(attr, sourceValue);
                    }
                    return;
                }
                const translated = t(sourceValue);
                if (translated !== sourceValue) {
                    el.setAttribute(attr, translated);
                } else if (value !== sourceValue) {
                    el.setAttribute(attr, sourceValue);
                }
            });
        });

        return root;
    };

    let localizationObserver = null;
    let localizationScheduled = false;
    const scheduleLocalization = () => {
        if (localizationScheduled) {
            return;
        }
        localizationScheduled = true;
        requestAnimationFrame(() => {
            localizationScheduled = false;
            if (uiShadowRoot) {
                localizeElement(uiShadowRoot);
            }
        });
    };

    const ensureLocalizationObserver = () => {
        if (!uiShadowRoot || localizationObserver) {
            return;
        }
        localizationObserver = new MutationObserver(() => scheduleLocalization());
        localizationObserver.observe(uiShadowRoot, { childList: true, subtree: true, attributes: true, characterData: true });
        scheduleLocalization();
    };

    let localizationRetryCount = 0;
    const trySetupLocalizationLater = () => {
        if (localizationObserver || localizationRetryCount > 10) {
            return;
        }
        if (!getLocaleBridge()) {
            localizationRetryCount += 1;
            setTimeout(trySetupLocalizationLater, 600);
            return;
        }
        ensureLocalizationObserver();
    };

    const readLanguagePreference = () => {
        try {
            const stored = localStorage.getItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
            if (stored === 'zh' || stored === 'en' || stored === 'auto') {
                return stored;
            }
        } catch (error) {
            console.warn('[Chat] Template Text Folders] Failed to read language preference:', error);
        }
        return null;
    };

    const writeLanguagePreference = (preference) => {
        try {
            if (!preference) {
                localStorage.removeItem(LANGUAGE_PREFERENCE_STORAGE_KEY);
            } else {
                localStorage.setItem(LANGUAGE_PREFERENCE_STORAGE_KEY, preference);
            }
        } catch (error) {
            console.warn('[Chat] Template Text Folders] Failed to persist language preference:', error);
        }
    };

    const applyLanguagePreference = (preference, options = {}) => {
        const localeConfig = getLocaleBridge();
        if (!localeConfig || typeof localeConfig.setLocale !== 'function') {
            console.warn('[Chat] Template Text Folders] Locale bridge unavailable, cannot apply language preference.');
            return null;
        }

        const normalizedPreference = preference === 'zh' || preference === 'en' ? preference : 'auto';
        let targetLocale = normalizedPreference;

        if (normalizedPreference === 'auto') {
            if (typeof localeConfig.detectBrowserLocale === 'function') {
                targetLocale = localeConfig.detectBrowserLocale();
            } else {
                targetLocale = 'en';
            }
        }

        if (!targetLocale) {
            targetLocale = 'en';
        }

        const appliedLocale = localeConfig.setLocale(targetLocale);

        if (!options.skipSave) {
            writeLanguagePreference(normalizedPreference);
        }

        translationsCache = null;
        reverseTranslationsCache = {};

        scheduleLocalization();
        ensureLocalizationObserver();
        if (uiShadowRoot) {
            localizeElement(uiShadowRoot);
        }

        if (typeof options.onApplied === 'function') {
            try {
                options.onApplied(normalizedPreference, appliedLocale);
            } catch (_) {
                // 忽略回调中的错误，避免影响主流程
            }
        }

        return { preference: normalizedPreference, locale: appliedLocale };
    };

    const initializeLanguagePreference = () => {
        const localeConfig = getLocaleBridge();
        if (!localeConfig) {
            setTimeout(initializeLanguagePreference, 200);
            return;
        }
        const storedPreference = readLanguagePreference();
        applyLanguagePreference(storedPreference || 'auto', { skipSave: true });
    };

    initializeLanguagePreference();

    const ensureUIRoot = () => {
        if (uiShadowRoot && uiShadowRoot.host && uiShadowRoot.host.isConnected) {
            return uiShadowRoot;
        }

        if (!document.body) {
            return null;
        }

        let hostElement = document.getElementById(UI_HOST_ID);
        if (!hostElement) {
            hostElement = document.createElement('div');
            hostElement.id = UI_HOST_ID;
            document.body.appendChild(hostElement);
        }

        uiShadowRoot = hostElement.shadowRoot;
        if (!uiShadowRoot) {
            uiShadowRoot = hostElement.attachShadow({ mode: 'open' });
            const baseStyle = document.createElement('style');
            baseStyle.textContent = `
                :host {
                    all: initial;
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 1000;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                :host *, :host *::before, :host *::after {
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .cttf-dialog,
                .cttf-dialog * {
                    scrollbar-width: thin;
                    scrollbar-color: var(--cttf-scrollbar-thumb, rgba(120, 120, 120, 0.6)) transparent;
                }
                .cttf-dialog::-webkit-scrollbar,
                .cttf-dialog *::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                    background: transparent;
                }
                .cttf-dialog::-webkit-scrollbar-track,
                .cttf-dialog *::-webkit-scrollbar-track {
                    background: transparent;
                    border: none;
                    margin: 0;
                }
                .cttf-dialog::-webkit-scrollbar-thumb,
                .cttf-dialog *::-webkit-scrollbar-thumb {
                    background-color: var(--cttf-scrollbar-thumb, rgba(120, 120, 120, 0.6));
                    border-radius: 999px;
                    border: none;
                }
                .cttf-dialog::-webkit-scrollbar-corner,
                .cttf-dialog *::-webkit-scrollbar-corner {
                    background: transparent;
                }
                .cttf-dialog::-webkit-scrollbar-button,
                .cttf-dialog *::-webkit-scrollbar-button {
                    display: none;
                }
                .cttf-scrollable {
                    scrollbar-width: thin;
                    scrollbar-color: var(--cttf-scrollbar-thumb, rgba(120, 120, 120, 0.6)) transparent;
                }
                .cttf-scrollable::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                    background: transparent;
                }
                .cttf-scrollable::-webkit-scrollbar-track {
                    background: transparent;
                    border: none;
                    margin: 0;
                }
                .cttf-scrollable::-webkit-scrollbar-thumb {
                    background-color: var(--cttf-scrollbar-thumb, rgba(120, 120, 120, 0.6));
                    border-radius: 999px;
                    border: none;
                }
                .cttf-scrollable::-webkit-scrollbar-corner {
                    background: transparent;
                }
                .cttf-scrollable::-webkit-scrollbar-button {
                    display: none;
                }
                .hide-scrollbar {
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .cttf-dialog input,
                .cttf-dialog textarea,
                .cttf-dialog select {
                    color: var(--input-text-color, var(--text-color, #333333));
                    background-color: var(--input-bg, var(--dialog-bg, #ffffff));
                    border-color: var(--input-border-color, var(--border-color, #d1d5db));
                }
                .cttf-dialog input::placeholder,
                .cttf-dialog textarea::placeholder,
                .cttf-dialog input::-webkit-input-placeholder,
                .cttf-dialog textarea::-webkit-input-placeholder {
                    color: var(--input-placeholder-color, var(--input-text-color, rgba(107, 114, 128, 0.75)));
                }
            `;
            uiShadowRoot.appendChild(baseStyle);
        }

        if (!uiMainLayer || !uiMainLayer.isConnected) {
            uiMainLayer = uiShadowRoot.getElementById('cttf-main-layer');
            if (!uiMainLayer) {
                uiMainLayer = document.createElement('div');
                uiMainLayer.id = 'cttf-main-layer';
                uiMainLayer.style.position = 'fixed';
                uiMainLayer.style.inset = '0';
                uiMainLayer.style.pointerEvents = 'none';
                uiShadowRoot.appendChild(uiMainLayer);
            }
        }

        if (!uiOverlayLayer || !uiOverlayLayer.isConnected) {
            uiOverlayLayer = uiShadowRoot.getElementById('cttf-overlay-layer');
            if (!uiOverlayLayer) {
                uiOverlayLayer = document.createElement('div');
                uiOverlayLayer.id = 'cttf-overlay-layer';
                uiOverlayLayer.style.position = 'fixed';
                uiOverlayLayer.style.inset = '0';
                uiOverlayLayer.style.pointerEvents = 'none';
                uiOverlayLayer.style.zIndex = '20000';
                uiShadowRoot.appendChild(uiOverlayLayer);
            }
        }

        if (latestThemeValues && hostElement) {
            Object.entries(latestThemeValues).forEach(([key, value]) => {
                hostElement.style.setProperty(toCSSVariableName(key), value);
            });
        }

        ensureLocalizationObserver();
        trySetupLocalizationLater();

        return uiShadowRoot;
    };

    const getShadowRoot = () => ensureUIRoot();

    const getMainLayer = () => {
        const root = ensureUIRoot();
        return root ? uiMainLayer : null;
    };

    const getOverlayLayer = () => {
        const root = ensureUIRoot();
        return root ? uiOverlayLayer : null;
    };

    const appendToMainLayer = (node) => {
        const container = getMainLayer();
        const appended = container ? container.appendChild(node) : document.body.appendChild(node);
        localizeElement(appended);
        scheduleLocalization();
        return appended;
    };

    const appendToOverlayLayer = (node) => {
        const container = getOverlayLayer();
        const appended = container ? container.appendChild(node) : document.body.appendChild(node);
        localizeElement(appended);
        scheduleLocalization();
        return appended;
    };

    const queryUI = (selector) => {
        const root = getShadowRoot();
        return root ? root.querySelector(selector) : document.querySelector(selector);
    };

    const toCSSVariableName = (key) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

    /**
     * 自动根据内容调整 textarea 高度，确保上下内边距空间充足。
     * @param {HTMLTextAreaElement} textarea
     * @param {{minRows?: number, maxRows?: number}} options
     */
    const autoResizeTextarea = (textarea, options = {}) => {
        if (!textarea) return;
        const { minRows = 1, maxRows = 5 } = options;
        textarea.style.height = 'auto';
        const styles = window.getComputedStyle(textarea);
        const lineHeight = parseFloat(styles.lineHeight) || (parseFloat(styles.fontSize) * 1.2) || 20;
        const paddingTop = parseFloat(styles.paddingTop) || 0;
        const paddingBottom = parseFloat(styles.paddingBottom) || 0;
        const borderTop = parseFloat(styles.borderTopWidth) || 0;
        const borderBottom = parseFloat(styles.borderBottomWidth) || 0;
        const minHeight = (lineHeight * minRows) + paddingTop + paddingBottom + borderTop + borderBottom;
        const maxHeight = (lineHeight * maxRows) + paddingTop + paddingBottom + borderTop + borderBottom;
        let targetHeight = textarea.scrollHeight;
        if (targetHeight < minHeight) {
            targetHeight = minHeight;
        } else if (targetHeight > maxHeight) {
            targetHeight = maxHeight;
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
        textarea.style.minHeight = `${minHeight}px`;
        textarea.style.maxHeight = `${maxHeight}px`;
        textarea.style.height = `${targetHeight}px`;
    };

    const SVG_NS = 'http://www.w3.org/2000/svg';

    const createAutoFaviconIcon = () => {
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 32 32');
        svg.setAttribute('data-name', 'Layer 1');
        svg.setAttribute('id', 'Layer_1');
        svg.setAttribute('fill', '#000000');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.style.width = '18px';
        svg.style.height = '18px';
        svg.style.display = 'block';

        const segments = [
            { d: 'M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16', fill: '#00ac47' },
            { d: 'M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16', fill: '#4285f4' },
            { d: 'M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z', fill: '#ffba00' },
            { d: 'M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z', fill: '#ea4435' },
            { d: 'M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z', fill: '#4285f4' }
        ];

        segments.forEach(({ d, fill }) => {
            const path = document.createElementNS(SVG_NS, 'path');
            path.setAttribute('d', d);
            path.setAttribute('fill', fill);
            svg.appendChild(path);
        });

        return svg;
    };

    // 用于统一创建 overlay + dialog，样式与默认逻辑保持一致
    // 复用时只需传入自定义的内容与回调，外观也可统一
    function createUnifiedDialog(options) {
        const {
            title = t('弹窗标题'),
            width = '400px',
            maxHeight = '80vh',
            onClose = null, // 关闭时的回调
            closeOnOverlayClick = true
        } = options;

        // 创建overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'var(--overlay-bg, rgba(0,0,0,0.5))';
        overlay.style.backdropFilter = 'blur(2px)';
        overlay.style.zIndex = '12000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';

        // 创建dialog
        const dialog = document.createElement('div');
        dialog.classList.add('cttf-dialog');
        dialog.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
        dialog.style.color = 'var(--text-color, #333333)';
        dialog.style.borderRadius = '4px';
        dialog.style.padding = '24px';
        dialog.style.boxShadow = '0 8px 24px var(--shadow-color, rgba(0,0,0,0.1))';
        dialog.style.border = '1px solid var(--border-color, #e5e7eb)';
        dialog.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        dialog.style.width = width;
        dialog.style.maxWidth = '95vw';
        dialog.style.maxHeight = maxHeight;
        dialog.style.overflowY = 'auto';
        dialog.style.transform = 'scale(0.95)';

        // 标题
        const titleEl = document.createElement('h2');
        titleEl.textContent = t(title);
        titleEl.style.margin = '0';
        titleEl.style.marginBottom = '12px';
        titleEl.style.fontSize = '18px';
        titleEl.style.fontWeight = '600';
        dialog.appendChild(titleEl);

        // 向overlay添加dialog
        overlay.appendChild(dialog);

        // 将 overlay 挂载到 Shadow DOM 覆盖层
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);

        // 入场动画
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        if (closeOnOverlayClick) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    if (onClose) onClose();
                    overlay.remove();
                }
            });
        } else {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });
        }

        return { overlay, dialog };
    }

    // 主题样式配置（使用CSS变量）
    const applyThemeToHost = (themeValues) => {
        const root = ensureUIRoot();
        const host = root ? root.host : null;
        if (!host) {
            return;
        }
        Object.entries(themeValues).forEach(([key, value]) => {
            host.style.setProperty(toCSSVariableName(key), value);
        });
    };

    const setCSSVariables = (currentTheme) => {
        latestThemeValues = currentTheme;
        const apply = () => applyThemeToHost(currentTheme);

        if (document.body) {
            apply();
        } else {
            window.addEventListener('DOMContentLoaded', apply, { once: true });
        }
    };

    const theme = {
        light: {
            folderBg: 'rgba(255, 255, 255, 0.8)',
            dialogBg: '#ffffff',
            textColor: '#333333',
            borderColor: '#e5e7eb',
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            buttonBg: '#f3f4f6',
            buttonHoverBg: '#e5e7eb',
            clearIconColor: '#333333',
            dangerColor: '#ef4444',
            successColor: '#22c55e',
            addColor: '#fd7e14',
            primaryColor: '#3B82F6',
            infoColor: '#6366F1',
            cancelColor: '#6B7280',
            overlayBg: 'rgba(0, 0, 0, 0.5)',
            tabBg: '#f3f4f6',
            tabActiveBg: '#3B82F6',
            tabHoverBg: '#e5e7eb',
            tabBorder: '#e5e7eb',
            inputTextColor: '#1f2937',
            inputPlaceholderColor: '#9ca3af',
            inputBg: '#ffffff',
            inputBorderColor: '#d1d5db'
        },
        dark: {
            folderBg: 'rgba(17, 17, 17, 0.85)',
            dialogBg: '#111111',
            textColor: '#e5e7eb',
            borderColor: '#2a2a2a',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            buttonBg: '#1f1f1f',
            buttonHoverBg: '#2c2c2c',
            clearIconColor: '#ffffff',
            dangerColor: '#dc2626',
            successColor: '#16a34a',
            addColor: '#fd7e14',
            primaryColor: '#2563EB',
            infoColor: '#4F46E5',
            cancelColor: '#3f3f46',
            overlayBg: 'rgba(0, 0, 0, 0.7)',
            tabBg: '#1f1f1f',
            tabActiveBg: '#2563EB',
            tabHoverBg: '#2c2c2c',
            tabBorder: '#2a2a2a',
            inputTextColor: '#f9fafb',
            inputPlaceholderColor: 'rgba(255, 255, 255, 0.7)',
            inputBg: '#1f1f1f',
            inputBorderColor: '#3f3f46'
        }
    };

    const isDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
    const getCurrentTheme = () => isDarkMode() ? theme.dark : theme.light;

    setCSSVariables(getCurrentTheme());

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--overlay-bg, rgba(0, 0, 0, 0.5))',
            backdropFilter: 'blur(2px)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background-color 0.3s ease, opacity 0.3s ease'
        },
        dialog: {
            position: 'relative',
            backgroundColor: 'var(--dialog-bg, #ffffff)',
            color: 'var(--text-color, #333333)',
            borderRadius: '4px',
            padding: '24px',
            boxShadow: '0 8px 24px var(--shadow-color, rgba(0,0,0,0.1))',
            border: '1px solid var(--border-color, #e5e7eb)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflow: 'auto'
        },
        button: {
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, color 0.2s ease',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: 'var(--button-bg, #f3f4f6)',
            color: 'var(--text-color, #333333)'
        }
    };

    // 默认按钮
    const userProvidedButtons = {
        "Review": {
            type: "template",
            text: "You are a code review expert:\n\n{clipboard}\n\nProvide constructive feedback and improvements.\n",
            color: "#E6E0FF",
            textColor: "#333333",
            autoSubmit: false // 新增字段
        },
        // ... (其他默认按钮保持不变)
        "解释": {
            type: "template",
            text: "Explain the following code concisely:\n\n{clipboard}\n\nFocus on key functionality and purpose.\n",
            color: "#ffebcc",
            textColor: "#333333",
            autoSubmit: false // 新增字段
        }
    };

    // 默认工具按钮
    const defaultToolButtons = {
        "剪切": {
            type: "tool",
            action: "cut",
            color: "#FFC1CC",
            textColor: "#333333"
        },
        "复制": {
            type: "tool",
            action: "copy",
            color: "#C1FFD7",
            textColor: "#333333"
        },
        "粘贴": {
            type: "tool",
            action: "paste",
            color: "#C1D8FF",
            textColor: "#333333"
        },
        "清空": {
            type: "tool",
            action: "clear",
            color: "#FFD1C1",
            textColor: "#333333"
        }
    };
    const TOOL_DEFAULT_ICONS = {
        cut: '✂️',
        copy: '📋',
        paste: '📥',
        clear: '✖️'
    };

    const generateDomainFavicon = (domain) => {
        if (!domain) return '';
        const trimmed = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(trimmed)}&sz=32`;
    };

    const createFaviconElement = (faviconUrl, label, fallbackEmoji = '🌐', options = {}) => {
        const { withBackground = true, size = 32 } = options || {};
        const normalizedSize = Math.max(16, Math.min(48, Number(size) || 32));
        const contentSize = Math.max(12, normalizedSize - 4);
        const emojiFontSize = Math.max(10, normalizedSize - 10);
        const borderRadius = Math.round(normalizedSize / 4);

        const wrapper = document.createElement('div');
        wrapper.style.width = `${normalizedSize}px`;
        wrapper.style.height = `${normalizedSize}px`;
        wrapper.style.borderRadius = `${borderRadius}px`;
        wrapper.style.overflow = 'hidden';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.backgroundColor = withBackground ? 'rgba(148, 163, 184, 0.15)' : 'transparent';
        wrapper.style.flexShrink = '0';

        if (faviconUrl) {
            const img = document.createElement('img');
            img.src = faviconUrl;
            img.alt = label || 'site icon';
            img.style.width = `${contentSize}px`;
            img.style.height = `${contentSize}px`;
            img.style.objectFit = 'cover';
            img.referrerPolicy = 'no-referrer';
            img.loading = 'lazy';
            img.onerror = () => {
                setTrustedHTML(wrapper, '');
                const emoji = document.createElement('span');
                emoji.textContent = fallbackEmoji;
                emoji.style.fontSize = `${emojiFontSize}px`;
                wrapper.appendChild(emoji);
            };
            wrapper.appendChild(img);
        } else {
            const emoji = document.createElement('span');
            emoji.textContent = fallbackEmoji;
            emoji.style.fontSize = `${emojiFontSize}px`;
            wrapper.appendChild(emoji);
        }

        return wrapper;
    };

    // 默认配置
    const defaultConfig = {
        folders: {
            "默认": {
                color: "#3B82F6",
                textColor: "#ffffff",
                hidden: false, // 新增隐藏状态字段
                buttons: userProvidedButtons
            },
            "🖱️": {
                color: "#FFD700", // 金色，可根据需求调整
                textColor: "#ffffff",
                hidden: false, // 新增隐藏状态字段
                buttons: defaultToolButtons
            }
        },
        folderOrder: ["默认", "🖱️"],
        domainAutoSubmitSettings: [
            {
                domain: "chatgpt.com",
                name: "ChatGPT",
                method: "模拟点击提交按钮",
                favicon: generateDomainFavicon("chatgpt.com")
            },
            {
                domain: "chathub.gg",
                name: "ChatHub",
                method: "Enter",
                favicon: generateDomainFavicon("chathub.gg")
            }
        ],
        /**
         * domainStyleSettings: 数组，每个元素结构示例：
         * {
         *   domain: "chatgpt.com",
         *   name: "ChatGPT自定义样式",
         *   height: 90,
         *   cssCode: ".some-class { color: red; }"
         * }
         */
        domainStyleSettings: [],
        showFolderIcons: false
    };

    defaultConfig.buttonBarHeight = 40;
    defaultConfig.buttonBarBottomSpacing = 0;

    let buttonConfig = JSON.parse(localStorage.getItem('chatGPTButtonFoldersConfig')) || JSON.parse(JSON.stringify(defaultConfig));

    let configAdjusted = false;

    if (!Array.isArray(buttonConfig.domainStyleSettings)) {
        buttonConfig.domainStyleSettings = [];
        configAdjusted = true;
    }

    if (typeof buttonConfig.buttonBarHeight !== 'number') {
        buttonConfig.buttonBarHeight = defaultConfig.buttonBarHeight;
        configAdjusted = true;
    }

    if (typeof buttonConfig.buttonBarBottomSpacing !== 'number') {
        buttonConfig.buttonBarBottomSpacing = defaultConfig.buttonBarBottomSpacing;
        configAdjusted = true;
    }
    const clampedBottomSpacing = Math.max(-200, Math.min(200, Number(buttonConfig.buttonBarBottomSpacing) || 0));
    if (buttonConfig.buttonBarBottomSpacing !== clampedBottomSpacing) {
        buttonConfig.buttonBarBottomSpacing = clampedBottomSpacing;
        configAdjusted = true;
    }

    if (typeof buttonConfig.showFolderIcons !== 'boolean') {
        buttonConfig.showFolderIcons = false;
        configAdjusted = true;
    }

    if (configAdjusted) {
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
    }

    // 若本地无此字段，则初始化
    if (!buttonConfig.domainAutoSubmitSettings) {
        buttonConfig.domainAutoSubmitSettings = JSON.parse(
            JSON.stringify(defaultConfig.domainAutoSubmitSettings)
        );
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
    }

    // 确保所有按钮都有'type'字段
    const ensureButtonTypes = () => {
        let updated = false;
        Object.entries(buttonConfig.folders).forEach(([folderName, folderConfig]) => {
            // 确保文件夹有hidden字段
            if (typeof folderConfig.hidden !== 'boolean') {
                folderConfig.hidden = false;
                updated = true;
            }

            Object.entries(folderConfig.buttons).forEach(([btnName, btnConfig]) => {
                if (!btnConfig.type) {
                    if (folderName === "🖱️") {
                        btnConfig.type = "tool";
                        updated = true;
                    } else {
                        btnConfig.type = "template";
                        updated = true;
                    }
                }
                // 确保 'autoSubmit' 字段存在，对于模板按钮
                if (btnConfig.type === "template" && typeof btnConfig.autoSubmit !== 'boolean') {
                    btnConfig.autoSubmit = false;
                    updated = true;
                }
                if (btnConfig.type === "template" && typeof btnConfig.favicon !== 'string') {
                    btnConfig.favicon = '';
                    updated = true;
                }
            });
        });
        if (updated) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log(t("✅ 已确保所有按钮具有'type'、'autoSubmit'、'favicon'配置，以及文件夹具有'hidden'字段。"));
        }
    };

    const ensureDomainMetadata = () => {
        let updated = false;
        (buttonConfig.domainAutoSubmitSettings || []).forEach(rule => {
            if (!rule.favicon) {
                rule.favicon = generateDomainFavicon(rule.domain);
                updated = true;
            }
        });
        (buttonConfig.domainStyleSettings || []).forEach(item => {
            if (!item.favicon) {
                item.favicon = generateDomainFavicon(item.domain);
                updated = true;
            }
            if (typeof item.bottomSpacing !== 'number') {
                item.bottomSpacing = buttonConfig.buttonBarBottomSpacing;
                updated = true;
            } else {
                const clamped = Math.max(-200, Math.min(200, Number(item.bottomSpacing) || 0));
                if (clamped !== item.bottomSpacing) {
                    item.bottomSpacing = clamped;
                    updated = true;
                }
            }
        });
        if (updated) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log(t('✅ 已为自动化与样式配置补全 favicon 信息。'));
        }
    };

    ensureButtonTypes();
    ensureDomainMetadata();

    // 确保工具文件夹存在并包含必要的工具按钮
    const ensureToolFolder = () => {
        const toolFolderName = "🖱️";
        if (!buttonConfig.folders[toolFolderName]) {
            buttonConfig.folders[toolFolderName] = {
                color: "#FFD700",
                textColor: "#ffffff",
                buttons: defaultToolButtons
            };
            buttonConfig.folderOrder.push(toolFolderName);
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log(t('✅ 工具文件夹 "{{folderName}}" 已添加到配置中。', { folderName: toolFolderName }));
        } else {
            // 确保工具按钮存在
            Object.entries(defaultToolButtons).forEach(([btnName, btnCfg]) => {
                if (!buttonConfig.folders[toolFolderName].buttons[btnName]) {
                    buttonConfig.folders[toolFolderName].buttons[btnName] = btnCfg;
                    console.log(t('✅ 工具按钮 "{{buttonName}}" 已添加到文件夹 "{{folderName}}"。', {
                        buttonName: btnName,
                        folderName: toolFolderName
                    }));
                }
            });
        }
    };
    ensureToolFolder();

    // 变量：防止重复提交
    let isSubmitting = false;
    // 占位函数，避免在真正实现前调用报错
    let applyDomainStyles = () => {};
    let updateButtonBarLayout = () => {};

    const isEditableElement = (node) => {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return false;
        const tag = node.tagName ? node.tagName.toLowerCase() : '';
        return tag === 'textarea' || node.isContentEditable;
    };

    const getDeepActiveElement = (root = document) => {
        const active = root && root.activeElement ? root.activeElement : null;
        if (active && active.shadowRoot && active.shadowRoot.activeElement) {
            return getDeepActiveElement(active.shadowRoot);
        }
        return active;
    };

    const findEditableDescendant = (root) => {
        if (!root) return null;
        if (isEditableElement(root)) return root;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let node = walker.nextNode();
        while (node) {
            if (isEditableElement(node)) {
                return node;
            }
            if (node.shadowRoot) {
                const nested = findEditableDescendant(node.shadowRoot);
                if (nested) return nested;
            }
            node = walker.nextNode();
        }
        return null;
    };

    const getFocusedEditableElement = () => {
        const activeElement = getDeepActiveElement();
        if (isEditableElement(activeElement)) {
            return activeElement;
        }
        if (activeElement && activeElement.shadowRoot) {
            const shadowEditable = findEditableDescendant(activeElement.shadowRoot);
            if (shadowEditable) return shadowEditable;
        }
        if (activeElement) {
            const childEditable = findEditableDescendant(activeElement);
            if (childEditable) return childEditable;
        }
        const selection = typeof window !== 'undefined' ? window.getSelection() : null;
        const anchorElement = selection && selection.anchorNode ? selection.anchorNode.parentElement : null;
        if (isEditableElement(anchorElement)) {
            return anchorElement;
        }
        return null;
    };

    const getAllTextareas = (root = document) => {
        let textareas = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);
        let node = walker.nextNode();
        while (node) {
            if (isEditableElement(node)) {
                textareas.push(node);
            }
            if (node.shadowRoot) {
                textareas = textareas.concat(getAllTextareas(node.shadowRoot));
            }
            node = walker.nextNode();
        }
        return textareas;
    };

    /**
     * 增强版插入文本到textarea或contenteditable元素中，支持现代编辑器
     * @param {HTMLElement} target - 目标元素
     * @param {string} finalText - 要插入的文本
     * @param {boolean} replaceAll - 是否替换全部内容
     */
    const insertTextSmart = (target, finalText, replaceAll = false) => {
        const normalizedText = finalText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        if (target.tagName.toLowerCase() === 'textarea') {
            // 处理textarea - 保持原有逻辑
            if (replaceAll) {
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(target, normalizedText);
                target.selectionStart = target.selectionEnd = normalizedText.length;
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertReplacementText',
                    data: normalizedText,
                });
                target.dispatchEvent(inputEvent);
            } else {
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(target, target.value.substring(0, start) + normalizedText + target.value.substring(end));
                target.selectionStart = target.selectionEnd = start + normalizedText.length;
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: normalizedText,
                });
                target.dispatchEvent(inputEvent);
            }
            target.focus();
        } else if (target.isContentEditable) {
            // 增强的contenteditable处理
            insertIntoContentEditable(target, normalizedText, replaceAll);
        }
    };

    /**
     * 专门处理contenteditable元素的文本插入
     * @param {HTMLElement} target - contenteditable元素
     * @param {string} text - 要插入的文本
     * @param {boolean} replaceAll - 是否替换全部内容
     */
    const insertIntoContentEditable = (target, text, replaceAll) => {
        // 检测编辑器类型
        const editorType = detectEditorType(target);

        target.focus();

        if (replaceAll) {
            // 替换全部内容
            clearContentEditable(target, editorType);
        }

        // 插入文本
        insertTextIntoEditor(target, text, editorType);

        // 触发事件和调整高度
        triggerEditorEvents(target, text, replaceAll);
        adjustEditorHeight(target, editorType);
    };

    /**
     * 检测编辑器类型
     * @param {HTMLElement} target
     * @returns {string} 编辑器类型
     */
    const detectEditorType = (target) => {
        // 检测ProseMirror
        if (target.classList.contains('ProseMirror') ||
            target.closest('.ProseMirror') ||
            target.querySelector('.ProseMirror-trailingBreak')) {
            return 'prosemirror';
        }

        // Gemini / Quill 编辑器
        if (target.classList.contains('ql-editor') ||
            target.closest('.ql-editor')) {
            return 'quill';
        }

        // 检测其他特殊编辑器
        if (target.hasAttribute('data-placeholder') ||
            target.querySelector('[data-placeholder]')) {
            return 'modern';
        }

        // 默认简单contenteditable
        return 'simple';
    };

    /**
     * 清空contenteditable内容
     * @param {HTMLElement} target
     * @param {string} editorType
     */
    const clearContentEditable = (target, editorType) => {
        if (editorType === 'prosemirror') {
            // ProseMirror需要保持基本结构
            const firstP = target.querySelector('p');
            if (firstP) {
                setTrustedHTML(firstP, '<br class="ProseMirror-trailingBreak">');
                // 删除其他段落
                const otherPs = target.querySelectorAll('p:not(:first-child)');
                otherPs.forEach(p => p.remove());
            } else {
                setTrustedHTML(target, '<p><br class="ProseMirror-trailingBreak"></p>');
            }
        } else if (editorType === 'quill') {
            setTrustedHTML(target, '<p><br></p>');
            target.classList.remove('ql-blank');
        } else {
            setTrustedHTML(target, '');
        }
    };

    /**
     * 向编辑器插入文本
     * @param {HTMLElement} target
     * @param {string} text
     * @param {string} editorType
     */
    const insertTextIntoEditor = (target, text, editorType) => {
        const selection = window.getSelection();

        if (editorType === 'prosemirror') {
            insertIntoProseMirror(target, text, selection);
        } else if (editorType === 'quill') {
            insertIntoQuillEditor(target, text, selection);
        } else {
            insertIntoSimpleEditor(target, text, selection);
        }

        // 确保光标位置正确
        const range = document.createRange();
        range.selectNodeContents(target);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    /**
     * 向ProseMirror编辑器插入文本
     * @param {HTMLElement} target
     * @param {string} text
     * @param {Selection} selection
     */
    const insertIntoProseMirror = (target, text, selection) => {
        const lines = text.split('\n');
        let currentP = target.querySelector('p');

        if (!currentP) {
            currentP = document.createElement('p');
            target.appendChild(currentP);
        }

        // 清除现有内容但保持结构
        const trailingBreak = currentP.querySelector('.ProseMirror-trailingBreak');
        if (trailingBreak) {
            trailingBreak.remove();
        }

        lines.forEach((line, index) => {
            if (index > 0) {
                // 创建新段落
                currentP = document.createElement('p');
                target.appendChild(currentP);
            }

            if (line.trim() === '') {
                // 空行需要br
                const br = document.createElement('br');
                br.className = 'ProseMirror-trailingBreak';
                currentP.appendChild(br);
            } else {
                // 有内容的行
                currentP.appendChild(document.createTextNode(line));
                if (index === lines.length - 1) {
                    // 最后一行添加trailing break
                    const br = document.createElement('br');
                    br.className = 'ProseMirror-trailingBreak';
                    currentP.appendChild(br);
                }
            }
        });

        // 移除is-empty类
        target.classList.remove('is-empty', 'is-editor-empty');
        target.querySelectorAll('p').forEach(p => {
            p.classList.remove('is-empty', 'is-editor-empty');
        });
    };

    /**
     * 向 Quill 编辑器（Gemini 输入框）插入文本
     * @param {HTMLElement} target
     * @param {string} text
     * @param {Selection} selection
     */
    const insertIntoQuillEditor = (target, text, selection) => {
        const createFragment = () => {
            const fragment = document.createDocumentFragment();
            const lines = text.split('\n');
            if (lines.length === 0) {
                lines.push('');
            }
            lines.forEach(line => {
                const p = document.createElement('p');
                if (line === '') {
                    p.appendChild(document.createElement('br'));
                } else {
                    p.appendChild(document.createTextNode(line));
                }
                fragment.appendChild(p);
            });
            return fragment;
        };

        const hasValidSelection = selection &&
            selection.rangeCount > 0 &&
            target.contains(selection.getRangeAt(0).startContainer) &&
            target.contains(selection.getRangeAt(0).endContainer);

        if (hasValidSelection) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(createFragment());
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            const isEmpty = target.classList.contains('ql-blank') || !target.textContent.trim();
            if (isEmpty) {
                setTrustedHTML(target, '');
            }
            target.appendChild(createFragment());
        }

        target.classList.remove('ql-blank');
    };

    /**
     * 向简单编辑器插入文本
     * @param {HTMLElement} target
     * @param {string} text
     * @param {Selection} selection
     */
    const insertIntoSimpleEditor = (target, text, selection) => {
        const lines = text.split('\n');
        const fragment = document.createDocumentFragment();

        lines.forEach((line, index) => {
            if (line === '') {
                fragment.appendChild(document.createElement('br'));
            } else {
                fragment.appendChild(document.createTextNode(line));
            }

            if (index < lines.length - 1) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        // 使用Selection API插入
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(fragment);
            range.collapse(false);
        } else {
            target.appendChild(fragment);
        }
    };

    /**
     * 触发编辑器事件
     * @param {HTMLElement} target
     * @param {string} text
     * @param {boolean} replaceAll
     */
    const triggerEditorEvents = (target, text, replaceAll) => {
        // 触发多种事件确保兼容性
        const events = [
            new InputEvent('beforeinput', {
                bubbles: true,
                cancelable: true,
                inputType: replaceAll ? 'insertReplacementText' : 'insertText',
                data: text
            }),
            new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: replaceAll ? 'insertReplacementText' : 'insertText',
                data: text
            }),
            new Event('change', { bubbles: true }),
            new KeyboardEvent('keyup', { bubbles: true }),
            new Event('blur', { bubbles: true }),
            new Event('focus', { bubbles: true })
        ];

        events.forEach(event => {
            try {
                target.dispatchEvent(event);
            } catch (e) {
                console.warn('事件触发失败:', e);
            }
        });

        // 特殊处理：触发compositionend事件（某些框架需要）
        try {
            const compositionEvent = new CompositionEvent('compositionend', {
                bubbles: true,
                data: text
            });
            target.dispatchEvent(compositionEvent);
        } catch (e) {
            // CompositionEvent可能不被支持，忽略错误
        }
    };

    /**
     * 调整编辑器高度
     * @param {HTMLElement} target
     * @param {string} editorType
     */
    const adjustEditorHeight = (target, editorType) => {
        // 查找可能需要调整的容器
        const containers = [
            target,
            target.parentElement,
            target.closest('[style*="height"]'),
            target.closest('[style*="max-height"]'),
            target.closest('.overflow-hidden'),
            target.closest('[style*="overflow"]')
        ].filter(Boolean);

        containers.forEach(container => {
            try {
                // 移除可能阻止显示的样式
                if (container.style.height && container.style.height !== 'auto') {
                    const currentHeight = parseInt(container.style.height);
                    if (currentHeight < 100) { // 只调整明显过小的高度
                        container.style.height = 'auto';
                        container.style.minHeight = currentHeight + 'px';
                    }
                }

                // 确保显示滚动条
                if (container.style.overflowY === 'hidden') {
                    container.style.overflowY = 'auto';
                }

                // 对于特定的编辑器容器，强制最小高度
                if (editorType === 'prosemirror' && container === target) {
                    container.style.minHeight = '3rem';
                }

            } catch (e) {
                console.warn('高度调整失败:', e);
            }
        });

        // 触发resize事件
        setTimeout(() => {
            try {
                window.dispatchEvent(new Event('resize'));
                target.dispatchEvent(new Event('resize'));
            } catch (e) {
                console.warn('resize事件触发失败:', e);
            }
        }, 100);
    };

    /**
   * 轮询检测输入框内容是否与预期文本一致。
   * @param {HTMLElement} element - 要检测的textarea或contenteditable元素。
   * @param {string} expectedText - 期望出现的文本。
   * @param {number} interval - 轮询时间间隔（毫秒）。
   * @param {number} maxWait - 最大等待时长（毫秒），超时后reject。
   * @returns {Promise<void>} - 匹配成功resolve，否则reject。
   */
    async function waitForContentMatch(element, expectedText, interval = 100, maxWait = 3000) {
        return new Promise((resolve, reject) => {
            let elapsed = 0;
            const timer = setInterval(() => {
                elapsed += interval;
                const currentVal = (element.tagName.toLowerCase() === 'textarea')
                    ? element.value
                    : element.innerText; // contenteditable时用innerText

                if (currentVal === expectedText) {
                    clearInterval(timer);
                    resolve();
                } else if (elapsed >= maxWait) {
                    clearInterval(timer);
                    reject(new Error("waitForContentMatch: 超时，输入框内容未能匹配预期文本"));
                }
            }, interval);
        });
    }

    // 定义等待提交按钮的函数
    const waitForSubmitButton = async (maxAttempts = 10, delay = 300) => {
        for (let i = 0; i < maxAttempts; i++) {
            const submitButton = document.querySelector('button[type="submit"], button[data-testid="send-button"]');
            if (submitButton && !submitButton.disabled && submitButton.offsetParent !== null) {
                return submitButton;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return null;
    };

    // 定义等待时间和尝试次数
    const SUBMIT_WAIT_MAX_ATTEMPTS = 10;
    const SUBMIT_WAIT_DELAY = 300; // 毫秒

    const waitForElementBySelector = async (selector, maxAttempts = SUBMIT_WAIT_MAX_ATTEMPTS, delay = SUBMIT_WAIT_DELAY) => {
        if (!selector) return null;
        for (let i = 0; i < maxAttempts; i++) {
            let element = null;
            try {
                element = document.querySelector(selector);
            } catch (error) {
                console.warn(t('⚠️ 自定义选择器 "{{selector}}" 解析失败:', { selector }), error);
                return null;
            }

            if (element) {
                const isDisabled = typeof element.disabled === 'boolean' && element.disabled;
                if (!isDisabled) {
                    return element;
                }
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        return null;
    };

    function simulateEnterKey() {
        const eventInit = {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13
        };
        const keyboardEvent = new KeyboardEvent('keydown', eventInit);
        document.activeElement.dispatchEvent(keyboardEvent);
    }

    function simulateCmdEnterKey() {
        const eventInit = {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            metaKey: true
        };
        const keyboardEvent = new KeyboardEvent('keydown', eventInit);
        document.activeElement.dispatchEvent(keyboardEvent);
    }

    function simulateCtrlEnterKey() {
        const eventInit = {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
            ctrlKey: true
        };
        const keyboardEvent = new KeyboardEvent('keydown', eventInit);
        document.activeElement.dispatchEvent(keyboardEvent);
    }
    // 定义多种提交方式
    const submitForm = async () => {
        if (isSubmitting) {
            console.warn(t('⚠️ 提交正在进行中，跳过重复提交。'));
            return false;
        }
        isSubmitting = true;
        try {
              const domainRules = buttonConfig.domainAutoSubmitSettings || [];
              const currentURL = window.location.href;
              const matchedRule = domainRules.find(rule => currentURL.includes(rule.domain));

              if (matchedRule) {
                  console.log(t('🔎 检测到本域名匹配的自动提交规则：'), matchedRule);
                  switch (matchedRule.method) {
                      case "Enter": {
                          simulateEnterKey();
                          isSubmitting = false;
                          return true;
                      }
                      case "Cmd+Enter": {
                          const variant = matchedRule.methodAdvanced && matchedRule.methodAdvanced.variant === 'ctrl'
                              ? 'ctrl'
                              : 'cmd';
                          if (variant === 'ctrl') {
                              simulateCtrlEnterKey();
                              console.log(t('✅ 已根据自动化规则，触发 Ctrl + Enter 提交。'));
                          } else {
                              simulateCmdEnterKey();
                              console.log(t('✅ 已根据自动化规则，触发 Cmd + Enter 提交。'));
                          }
                          isSubmitting = false;
                          return true;
                      }
                      case "模拟点击提交按钮": {
                          const advanced = matchedRule.methodAdvanced || {};
                          const selector = typeof advanced.selector === 'string' ? advanced.selector.trim() : '';
                          if (advanced.variant === 'selector' && selector) {
                              const customButton = await waitForElementBySelector(selector, SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
                              if (customButton) {
                                  customButton.click();
                                  console.log(t('✅ 已根据自动化规则，自定义选择器 "{{selector}}" 提交。', { selector }));
                                  isSubmitting = false;
                                  return true;
                              }
                              console.warn(t('⚠️ 自定义选择器 "{{selector}}" 未匹配到提交按钮，尝试默认规则。', { selector }));
                          }
                          const submitButton = await waitForSubmitButton(SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
                          if (submitButton) {
                              submitButton.click();
                              console.log(t('✅ 已根据自动化规则，模拟点击提交按钮。'));
                              isSubmitting = false;
                              return true;
                          } else {
                              console.warn(t('⚠️ 未找到提交按钮，进入fallback...'));
                          }
                          break;
                      }
                      default:
                          console.warn(t('⚠️ 未知自动提交方式，进入fallback...'));
                          break;
                  }
            }
            // 1. 尝试键盘快捷键提交
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const submitKeys = isMac ? ['Enter', 'Meta+Enter'] : ['Enter', 'Control+Enter'];
            for (const keyCombo of submitKeys) {
                const [key, modifier] = keyCombo.split('+');
                const eventInit = {
                    bubbles: true,
                    cancelable: true,
                    key: key,
                    code: key,
                    keyCode: key.charCodeAt(0),
                    which: key.charCodeAt(0),
                };
                if (modifier === 'Meta') eventInit.metaKey = true;
                if (modifier === 'Control') eventInit.ctrlKey = true;
                const keyboardEvent = new KeyboardEvent('keydown', eventInit);
                document.activeElement.dispatchEvent(keyboardEvent);
                console.log(t('尝试通过键盘快捷键提交表单：{{combo}}', { combo: keyCombo }));
                // 等待短暂时间，查看是否提交成功
                await new Promise(resolve => setTimeout(resolve, 500));
                // 检查是否页面已提交（可以通过某种标识来确认）
                // 这里假设页面会有某种变化，如URL变化或特定元素出现
                // 由于具体实现不同，这里仅提供日志
            }

            // 2. 尝试点击提交按钮
            const submitButton = await waitForSubmitButton(SUBMIT_WAIT_MAX_ATTEMPTS, SUBMIT_WAIT_DELAY);
            if (submitButton) {
                submitButton.click();
                console.log(t('✅ 自动提交已通过点击提交按钮触发。'));
                return true;
            } else {
                console.warn(t('⚠️ 未找到提交按钮，尝试其他提交方式。'));
            }

            // 3. 尝试调用JavaScript提交函数
            // 需要知道具体的提交函数名称，这里假设为 `submitForm`
            // 根据实际情况调整函数名称
            try {
                if (typeof submitForm === 'function') {
                    submitForm();
                    console.log(t('✅ 自动提交已通过调用JavaScript函数触发。'));
                    return true;
                } else {
                    console.warn(t("⚠️ 未找到名为 'submitForm' 的提交函数。"));
                }
            } catch (error) {
                console.error("调用JavaScript提交函数失败:", error);
            }

            // 4. 确保事件监听器触发
            // 重新触发 'submit' 事件
            try {
                const form = document.querySelector('form');
                if (form) {
                    const submitEvent = new Event('submit', {
                        bubbles: true,
                        cancelable: true
                    });
                    form.dispatchEvent(submitEvent);
                    console.log(t("✅ 自动提交已通过触发 'submit' 事件触发。"));
                    return true;
                } else {
                    console.warn(t("⚠️ 未找到表单元素，无法触发 'submit' 事件。"));
                }
            } catch (error) {
                console.error("触发 'submit' 事件失败:", error);
            }

            console.warn(t('⚠️ 所有自动提交方式均未成功。'));
            return false;
        } finally {
            isSubmitting = false;
        }
    };





    // Toolbar-specific interactions are implemented in src/modules/02-toolbar.js
    let createCustomButton = (name, config, folderName) => {
        console.warn('createCustomButton is not initialized yet.');
        return document.createElement('button');
    };
/* -------------------------------------------------------------------------- *
 * Module 02 · Toolbar UI (folder buttons, popovers, quick input tools)
 * -------------------------------------------------------------------------- */

    const formatButtonDisplayLabel = (label) => {
        if (typeof label !== 'string') {
            return '';
        }
        const firstSpaceIndex = label.indexOf(' ');
        if (firstSpaceIndex > 0 && firstSpaceIndex < label.length - 1) {
            const leadingSegment = label.slice(0, firstSpaceIndex);
            const remainingText = label.slice(firstSpaceIndex + 1);

            // 如果前缀没有字母或数字（通常是emoji/符号），且长度不超过4，则将首个空格替换为不换行空格
            const hasAlphaNumeric = /[0-9A-Za-z\u4E00-\u9FFF]/.test(leadingSegment);
            if (!hasAlphaNumeric && leadingSegment.length <= 4 && remainingText.trim().length > 0) {
                return `${leadingSegment}\u00A0${remainingText}`;
            }
        }
        return label;
    };

    const extractButtonIconParts = (label) => {
        if (typeof label !== 'string') {
            return { iconSymbol: '', textLabel: '' };
        }

        const trimmedStart = label.trimStart();
        if (!trimmedStart) {
            return { iconSymbol: '', textLabel: '' };
        }

        const firstSpaceIndex = trimmedStart.indexOf(' ');
        if (firstSpaceIndex > 0) {
            const leadingSegment = trimmedStart.slice(0, firstSpaceIndex);
            const remaining = trimmedStart.slice(firstSpaceIndex + 1).trimStart();
            const hasAlphaNumeric = /[0-9A-Za-z\u4E00-\u9FFF]/.test(leadingSegment);
            if (!hasAlphaNumeric) {
                return {
                    iconSymbol: leadingSegment,
                    textLabel: remaining || trimmedStart
                };
            }
        }

        const charUnits = Array.from(trimmedStart);
        const firstChar = charUnits[0] || '';
        if (firstChar && !/[0-9A-Za-z\u4E00-\u9FFF]/.test(firstChar)) {
            const remaining = trimmedStart.slice(firstChar.length).trimStart();
            return {
                iconSymbol: firstChar,
                textLabel: remaining || trimmedStart
            };
        }

        return {
            iconSymbol: '',
            textLabel: trimmedStart
        };
    };

    const createCustomButtonElement = (name, config) => {
        const button = document.createElement('button');
        const { iconSymbol, textLabel } = extractButtonIconParts(name);
        const labelForDisplay = textLabel || name || '';
        const displayLabel = formatButtonDisplayLabel(labelForDisplay);
        let fallbackSymbolSource = iconSymbol || (Array.from(labelForDisplay.trim())[0] || '🔖');
        if (config.type === 'tool' && TOOL_DEFAULT_ICONS[config.action]) {
            fallbackSymbolSource = TOOL_DEFAULT_ICONS[config.action];
        }
        button.textContent = '';
        button.setAttribute('data-original-label', name);
        button.type = 'button';
        button.style.backgroundColor = config.color;
        button.style.color = config.textColor || '#333333';
        button.style.border = '1px solid rgba(0,0,0,0.1)';
        button.style.borderRadius = '4px';
        button.style.padding = '6px 12px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.transition = 'all 0.2s ease';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        button.style.marginBottom = '6px';
        button.style.width = 'fit-content';
        button.style.textAlign = 'left';
        button.style.display = 'block';

        const contentWrapper = document.createElement('span');
        contentWrapper.style.display = 'inline-flex';
        contentWrapper.style.alignItems = 'center';
        contentWrapper.style.gap = '8px';

        const iconWrapper = document.createElement('span');
        iconWrapper.style.display = 'inline-flex';
        iconWrapper.style.alignItems = 'center';
        iconWrapper.style.justifyContent = 'center';
        iconWrapper.style.width = '18px';
        iconWrapper.style.height = '18px';
        iconWrapper.style.flexShrink = '0';
        iconWrapper.style.borderRadius = '4px';
        iconWrapper.style.overflow = 'hidden';

        const createFallbackIcon = (symbol) => {
            const fallbackSpan = document.createElement('span');
            fallbackSpan.textContent = symbol;
            fallbackSpan.style.fontSize = '14px';
            fallbackSpan.style.lineHeight = '1';
            fallbackSpan.style.display = 'inline-flex';
            fallbackSpan.style.alignItems = 'center';
            fallbackSpan.style.justifyContent = 'center';
            return fallbackSpan;
        };

        const faviconUrl = (config && typeof config.favicon === 'string') ? config.favicon.trim() : '';
        if (faviconUrl) {
            const img = document.createElement('img');
            img.src = faviconUrl;
            img.alt = (labelForDisplay || name || '').trim() || 'icon';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.loading = 'lazy';
            img.referrerPolicy = 'no-referrer';
            img.decoding = 'async';
            img.onerror = () => {
                iconWrapper.textContent = '';
                iconWrapper.appendChild(createFallbackIcon(fallbackSymbolSource));
            };
            iconWrapper.appendChild(img);
        } else {
            iconWrapper.appendChild(createFallbackIcon(fallbackSymbolSource));
        }

        const textSpan = document.createElement('span');
        textSpan.textContent = displayLabel;
        textSpan.style.display = 'inline-flex';
        textSpan.style.alignItems = 'center';

        contentWrapper.appendChild(iconWrapper);
        contentWrapper.appendChild(textSpan);
        button.appendChild(contentWrapper);
        // 鼠标悬停显示按钮模板文本
        button.title = config.text || '';
        // 确保嵌套元素不会拦截点击或拖拽事件
        contentWrapper.style.pointerEvents = 'none';
        textSpan.style.pointerEvents = 'none';
        iconWrapper.style.pointerEvents = 'none';
        return button;
    };

    const currentlyOpenFolder = {
        name: null,
        element: null
    };

    const showTemporaryFeedback = (element, message) => {
        const feedback = document.createElement('span');
        feedback.textContent = message;
        feedback.style.position = 'absolute';
        feedback.style.bottom = '10px';
        feedback.style.right = '10px';
        feedback.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        feedback.style.color = '#fff';
        feedback.style.padding = '4px 8px';
        feedback.style.borderRadius = '4px';
        feedback.style.zIndex = '10001';
        element.parentElement.appendChild(feedback);
        setTimeout(() => {
            feedback.remove();
        }, 1500);
    };

    const handleCut = (element) => {
        let text = '';
        if (element.tagName.toLowerCase() === 'textarea') {
            text = element.value;
            insertTextSmart(element, '', true);
        } else {
            const textContent = [];
            const childNodes = Array.from(element.childNodes);
            childNodes.forEach((node, index) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    textContent.push(node.textContent);
                } else if (node.nodeName === 'BR') {
                    textContent.push('\n');
                } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                    if (index > -1) textContent.push('\n');
                    textContent.push(node.textContent);
                }
            });
            text = textContent.join('');
            insertTextSmart(element, '', true);
        }
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log(t('✅ 已剪切输入框内容到剪贴板。'));
                showTemporaryFeedback(element, '剪切成功');
            }).catch(err => {
                console.error("剪切失败:", err);
                alert(t('剪切失败，请检查浏览器权限。'));
            });
        }
    };

    const handleCopy = (element) => {
        let text = '';
        if (element.tagName.toLowerCase() === 'textarea') {
            text = element.value;
        } else {
            const textContent = [];
            const childNodes = Array.from(element.childNodes);
            childNodes.forEach((node, index) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    textContent.push(node.textContent);
                } else if (node.nodeName === 'BR') {
                    textContent.push('\n');
                } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                    if (index > -1) textContent.push('\n');
                    textContent.push(node.textContent);
                }
            });
            text = textContent.join('');
        }
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                console.log(t('✅ 已复制输入框内容到剪贴板。'));
                showTemporaryFeedback(element, '复制成功');
            }).catch(err => {
                console.error("复制失败:", err);
                alert(t('复制失败，请检查浏览器权限。'));
            });
        }
    };

    const handlePaste = async (element) => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            insertTextSmart(element, clipboardText);
            console.log(t('✅ 已粘贴剪贴板内容到输入框。'));
            showTemporaryFeedback(element, '粘贴成功');
        } catch (err) {
            console.error("粘贴失败:", err);
            alert(t('粘贴失败，请检查浏览器权限。'));
        }
    };

    const handleClear = (element) => {
        insertTextSmart(element, '', true);
        console.log(t('✅ 输入框内容已清空。'));
        showTemporaryFeedback(element, '清空成功');
    };

    createCustomButton = (name, config, folderName) => {
        const button = createCustomButtonElement(name, config, folderName);
        button.setAttribute('draggable', 'true');
        button.setAttribute('data-button-name', name);
        button.setAttribute('data-folder-name', folderName);

        button.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                buttonName: name,
                sourceFolder: folderName,
                config: config
            }));
            e.currentTarget.style.opacity = '0.5';
        });

        button.addEventListener('dragend', (e) => {
            e.currentTarget.style.opacity = '1';
        });

        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const focusedElement = getFocusedEditableElement();
            if (isEditableElement(focusedElement)) {
                setTimeout(() => focusedElement && focusedElement.focus(), 0);
            }
        });

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        });

        button.addEventListener('click', async (e) => {
            e.preventDefault();
            if (config.type === "template") {
                const focusedElement = getFocusedEditableElement();
                if (!isEditableElement(focusedElement)) {
                    console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                    return;
                }

                const needsClipboard = config.text.includes('{clipboard}') || config.text.includes('{{inputboard}|{clipboard}}');

                let clipboardText = '';
                if (needsClipboard) {
                    try {
                        clipboardText = await navigator.clipboard.readText();
                    } catch (err) {
                        console.error("无法访问剪贴板内容:", err);
                        alert(t('无法访问剪贴板内容。请检查浏览器权限。'));
                        return;
                    }
                }

                let inputBoxText = '';
                if (focusedElement.tagName.toLowerCase() === 'textarea') {
                    inputBoxText = focusedElement.value;
                } else {
                    const childNodes = Array.from(focusedElement.childNodes);
                    const textParts = [];
                    let lastWasBr = false;
                    childNodes.forEach((node, index) => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            if (node.textContent.trim() === '') {
                                if (!lastWasBr && index > 0) {
                                    textParts.push('\n');
                                }
                            } else {
                                textParts.push(node.textContent);
                                lastWasBr = false;
                            }
                        } else if (node.nodeName === 'BR') {
                            textParts.push('\n');
                            lastWasBr = true;
                        } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                            if (node.textContent.trim() === '') {
                                textParts.push('\n');
                            } else {
                                if (textParts.length > 0) {
                                    textParts.push('\n');
                                }
                                textParts.push(node.textContent);
                            }
                            lastWasBr = false;
                        }
                    });
                    inputBoxText = textParts.join('');
                }

                const selectionText = window.getSelection().toString();
                let finalText = config.text;

                const variableMap = {
                    '{{inputboard}|{clipboard}}': inputBoxText.trim() || clipboardText,
                    '{clipboard}': clipboardText,
                    '{inputboard}': inputBoxText,
                    '{selection}': selectionText
                };

                const replacementOrder = [
                    '{{inputboard}|{clipboard}}',
                    '{clipboard}',
                    '{inputboard}',
                    '{selection}'
                ];

                const placeholderMap = new Map();
                let placeholderCounter = 0;

                replacementOrder.forEach(variable => {
                    if (finalText.includes(variable)) {
                        const placeholder = `__SAFE_PLACEHOLDER_${placeholderCounter++}__`;
                        placeholderMap.set(placeholder, variableMap[variable]);
                        finalText = finalText.split(variable).join(placeholder);
                    }
                });

                placeholderMap.forEach((value, placeholder) => {
                    finalText = finalText.split(placeholder).join(value);
                });

                finalText = finalText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

                const containsInputboard = config.text.includes("{inputboard}") ||
                    config.text.includes("{{inputboard}|{clipboard}}");

                if (containsInputboard) {
                    insertTextSmart(focusedElement, finalText, true);
                    console.log(t('✅ 使用 {inputboard} 变量，输入框内容已被替换。'));
                } else {
                    insertTextSmart(focusedElement, finalText, false);
                    console.log(t('✅ 插入了预设文本。'));
                }

                if (config.autoSubmit) {
                    try {
                        await waitForContentMatch(focusedElement, finalText, 100, 3000);
                        await new Promise(resolve => setTimeout(resolve, 500));
                        const success = await submitForm();
                        if (success) {
                            console.log(t('✅ 自动提交成功（已确认内容替换完成）。'));
                        } else {
                            console.warn(t('⚠️ 自动提交失败。'));
                        }
                    } catch (error) {
                        console.error("自动提交前检测文本匹配超时或错误:", error);
                    }
                }

            } else if (config.type === "tool") {
                const focusedElement = getFocusedEditableElement();
                if (!isEditableElement(focusedElement)) {
                    console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                    return;
                }
                switch (config.action) {
                    case "cut":
                        handleCut(focusedElement);
                        break;
                    case "copy":
                        handleCopy(focusedElement);
                        break;
                    case "paste":
                        handlePaste(focusedElement);
                        break;
                    case "clear":
                        handleClear(focusedElement);
                        break;
                    default:
                        console.warn(t('未知的工具按钮动作: {{action}}', { action: config.action }));
                }
            }

            if (currentlyOpenFolder.name === folderName && currentlyOpenFolder.element) {
                currentlyOpenFolder.element.style.display = 'none';
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(t('✅ 弹窗 "{{folderName}}" 已立即关闭。', { folderName }));
            } else {
                console.warn(t('⚠️ 弹窗 "{{folderName}}" 未被识别为当前打开的弹窗。', { folderName }));
            }
        });

        return button;
    };

    const createFolderButton = (folderName, folderConfig) => {
        const folderButton = document.createElement('button');
        folderButton.innerText = folderName;
        folderButton.type = 'button';
        folderButton.style.backgroundColor = folderConfig.color;
        folderButton.style.color = folderConfig.textColor || '#ffffff';
        folderButton.style.border = 'none';
        folderButton.style.borderRadius = '4px';
        folderButton.style.padding = '6px 12px';
        folderButton.style.cursor = 'pointer';
        folderButton.style.fontSize = '14px';
        folderButton.style.fontWeight = '500';
        folderButton.style.transition = 'all 0.2s ease';
        folderButton.style.position = 'relative';
        folderButton.style.display = 'inline-flex';
        folderButton.style.alignItems = 'center';
        folderButton.style.whiteSpace = 'nowrap';
        folderButton.style.zIndex = '99';
        folderButton.classList.add('folder-button');
        folderButton.setAttribute('data-folder', folderName);

        folderButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        folderButton.addEventListener('mouseleave', () => {
            folderButton.style.transform = 'scale(1)';
            folderButton.style.boxShadow = 'none';
        });

        const buttonListContainer = document.createElement('div');
        buttonListContainer.style.position = 'fixed';
        buttonListContainer.style.display = 'none';
        buttonListContainer.style.flexDirection = 'column';
        buttonListContainer.style.backgroundColor = 'var(--folder-bg, rgba(255, 255, 255, 0.8))';
        buttonListContainer.style.backdropFilter = 'blur(5px)';
        buttonListContainer.style.border = `1px solid var(--border-color, #e5e7eb)`;
        buttonListContainer.style.borderRadius = '8px';
        buttonListContainer.style.padding = '10px';
        buttonListContainer.style.paddingBottom = '2.5px';
        buttonListContainer.style.boxShadow = `0 4px 12px var(--shadow-color, rgba(0,0,0,0.1))`;
        buttonListContainer.style.zIndex = '100';
        buttonListContainer.style.maxHeight = '800px';
        buttonListContainer.style.overflowY = 'auto';
        buttonListContainer.style.transition = 'all 0.3s ease';
        buttonListContainer.classList.add('button-list');
        buttonListContainer.setAttribute('data-folder-list', folderName);
        buttonListContainer.style.pointerEvents = 'auto';

        Object.entries(folderConfig.buttons).forEach(([name, config]) => {
            const customButton = createCustomButton(name, config, folderName);
            buttonListContainer.appendChild(customButton);
        });

        folderButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Toggle popup visibility
            if (currentlyOpenFolder.name === folderName) {
                // 如果当前文件夹已经打开，则关闭它
                buttonListContainer.style.display = 'none';
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(t('🔒 弹窗 "{{folderName}}" 已关闭。', { folderName }));
            } else {
                // 关闭其他文件夹的弹窗
                if (currentlyOpenFolder.element) {
                    currentlyOpenFolder.element.style.display = 'none';
                    console.log(t('🔒 弹窗 "{{folderName}}" 已关闭。', { folderName: currentlyOpenFolder.name }));
                }
                // 打开当前文件夹的弹窗
                buttonListContainer.style.display = 'flex';
                currentlyOpenFolder.name = folderName;
                currentlyOpenFolder.element = buttonListContainer;
                console.log(t('🔓 弹窗 "{{folderName}}" 已打开。', { folderName }));
                // 动态定位弹窗位置
                const rect = folderButton.getBoundingClientRect();
                buttonListContainer.style.bottom = `40px`;
                buttonListContainer.style.left = `${rect.left + window.scrollX - 20}px`;
                console.log(t('📍 弹窗位置设置为 Bottom: 40px, Left: {{left}}px', {
                    left: Math.round(rect.left + window.scrollX - 20)
                }));
            }
        });

        document.addEventListener('click', (e) => {
            const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
            const clickedInsideButton = path.includes(folderButton);
            const clickedInsideList = path.includes(buttonListContainer);
            if (!clickedInsideButton && !clickedInsideList) {
                // 点击了其他地方，关闭弹窗
                if (buttonListContainer.style.display !== 'none') {
                    buttonListContainer.style.display = 'none';
                    if (currentlyOpenFolder.name === folderName) {
                        currentlyOpenFolder.name = null;
                        currentlyOpenFolder.element = null;
                        console.log(t('🔒 弹窗 "{{folderName}}" 已关闭（点击外部区域）。', { folderName }));
                    }
                }
            }
        });

        appendToMainLayer(buttonListContainer);
        return folderButton;
    };

    const toggleFolder = (folderName, state) => {
        const buttonList = queryUI(`.button-list[data-folder-list="${folderName}"]`);
        if (!buttonList) {
            console.warn(t('⚠️ 未找到与文件夹 "{{folderName}}" 关联的弹窗。', { folderName }));
            return;
        }
        if (state) {
            // 打开当前文件夹的弹窗
            buttonList.style.display = 'flex';
            currentlyOpenFolder.name = folderName;
            currentlyOpenFolder.element = buttonList;
            console.log(t('🔓 弹窗 "{{folderName}}" 已打开（toggleFolder）。', { folderName }));
        } else {
            // 关闭当前文件夹的弹窗
            buttonList.style.display = 'none';
            if (currentlyOpenFolder.name === folderName) {
                currentlyOpenFolder.name = null;
                currentlyOpenFolder.element = null;
                console.log(t('🔒 弹窗 "{{folderName}}" 已关闭（toggleFolder）。', { folderName }));
            }
        }
        // 关闭其他文件夹的弹窗
        const root = getShadowRoot();
        const allButtonLists = root ? Array.from(root.querySelectorAll('.button-list')) : [];
        allButtonLists.forEach(bl => {
            if (bl.getAttribute('data-folder-list') !== folderName) {
                bl.style.display = 'none';
                const fname = bl.getAttribute('data-folder-list');
                if (currentlyOpenFolder.name === fname) {
                    currentlyOpenFolder.name = null;
                    currentlyOpenFolder.element = null;
                    console.log(t('🔒 弹窗 "{{folderName}}" 已关闭（toggleFolder 关闭其他弹窗）。', { folderName: fname }));
                }
            }
        });
    };

    const closeExistingOverlay = (overlay) => {
        if (overlay && overlay.parentElement) {
            // 添加关闭动画
            overlay.style.opacity = '0';

            // 立即标记为已关闭，避免重复操作
            overlay.setAttribute('data-closing', 'true');

            // 延时移除DOM元素，确保动画完成
            setTimeout(() => {
                if (overlay.parentElement && overlay.getAttribute('data-closing') === 'true') {
                    overlay.parentElement.removeChild(overlay);
                    console.log(t('🔒 弹窗已关闭并从DOM中移除'));
                }
            }, 300);
        } else {
            console.warn(t('⚠️ 尝试关闭不存在的弹窗'));
        }
    };

    let currentConfirmOverlay = null;
    let currentSettingsOverlay = null;
    let isSettingsFolderPanelCollapsed = false;
    let settingsDialogMainContainer = null;
    let currentStyleOverlay = null;

    const showDeleteFolderConfirmDialog = (folderName, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const folderConfig = buttonConfig.folders[folderName];
        if (!folderConfig) {
            alert(t('文件夹 "{{folderName}}" 不存在。', { folderName }));
            return;
        }
        // 构建文件夹内自定义按钮的垂直预览列表
        let buttonsPreviewHTML = '';
        Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
            buttonsPreviewHTML += `
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <button style="
                        background-color: ${btnCfg.color};
                        color: ${btnCfg.textColor};
                        border: 1px solid rgba(0,0,0,0.1);
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: default;
                        font-size: 12px;
                        box-shadow: none;
                        margin-right: 8px;
                    " disabled>${btnName}</button>
                    <span style="font-size: 12px; color: var(--text-color);">${btnName}</span>
                </div>
            `;
        });

        const overlay = document.createElement('div');
        overlay.classList.add('confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('confirm-dialog', 'cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 20px 24px 16px 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;
        const deleteFolderTitle = t('🗑️ 确认删除文件夹 "{{folderName}}"？', { folderName });
        const irreversibleNotice = t('❗️ 注意：此操作无法撤销！');
        const deleteFolderWarning = t('（删除文件夹将同时删除其中的所有自定义按钮！）');
        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteFolderTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleNotice}<br/>${deleteFolderWarning}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <!-- 将文件夹按钮预览和文字标签放在一行 -->
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>${t('1️⃣ 文件夹按钮外观：')}</strong>
                    <button style="
                        background-color: ${folderConfig.color};
                        color: ${folderConfig.textColor};
                        border: none;
                        border-radius:4px;
                        padding:6px 12px;
                        cursor: default;
                        font-size:14px;
                        font-weight:500;
                        box-shadow: none;
                    " disabled>${folderName}</button>
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('按钮名称：')} ${folderName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('背景颜色：')} <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('文字颜色：')} <span style="display:inline-block;width:16px;height:16px;background:${folderConfig.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${folderConfig.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>${t('2️⃣ 文件夹内，全部自定义按钮：')}</strong></p>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${buttonsPreviewHTML}
                </div>
            </div>
            <div style="
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelDeleteFolder" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t('取消')}</button>
                <button id="confirmDeleteFolder" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius: 4px;
                ">${t('删除')}</button>
            </div>
        `);
        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#cancelDeleteFolder').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#confirmDeleteFolder').addEventListener('click', () => {
            delete buttonConfig.folders[folderName];
            const idx = buttonConfig.folderOrder.indexOf(folderName);
            if (idx > -1) buttonConfig.folderOrder.splice(idx, 1);
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(t('🗑️ 文件夹 "{{folderName}}" 已删除。', { folderName }));
            // 更新按钮栏
            updateButtonContainer();
        });
    };

    // 修改 删除按钮确认对话框，增加显示按钮名称、颜色信息及样式预览
    const showDeleteButtonConfirmDialog = (folderName, btnName, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const btnCfg = buttonConfig.folders[folderName].buttons[btnName];
        if (!btnCfg) {
            alert(t('按钮 "{{buttonName}}" 不存在于文件夹 "{{folderName}}" 中。', {
                buttonName: btnName,
                folderName
            }));
            return;
        }
        const overlay = document.createElement('div');
        overlay.classList.add('confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('confirm-dialog', 'cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 20px 24px 16px 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;
        const deleteButtonTitle = t('🗑️ 确认删除按钮 "{{buttonName}}"？', { buttonName: btnName });
        const irreversibleShort = t('❗️ 注意：此操作无法撤销！');
        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteButtonTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleShort}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 8px; border-radius:4px;">
                <p style="margin:4px 0; display: flex; align-items: center; gap: 8px; color: var(--text-color, #333333);">
                    <strong>${t('1️⃣ 自定义按钮外观：')}</strong>
                    <button style="
                        background-color: ${btnCfg.color};
                        color: ${btnCfg.textColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 12px;
                        box-shadow: none;
                    " disabled>${btnName}</button>
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('按钮名称：')} ${btnName}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('按钮背景颜色：')} <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.color};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.color}
                </p>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333);">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('按钮文字颜色：')} <span style="display:inline-block;width:16px;height:16px;background:${btnCfg.textColor};border:1px solid #333;vertical-align:middle;margin-right:4px;"></span>${btnCfg.textColor}
                </p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid var(--border-color, #e5e7eb);">
                <p style="margin:4px 0; color: var(--text-color, #333333);"><strong>${t('2️⃣ 按钮对应的文本模板：')}</strong></p>
                <textarea readonly style="
                    width:100%;
                    height:150px;
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border:1px solid var(--border-color, #e5e7eb);
                    border-radius:4px;
                    resize: vertical;
                ">${btnCfg.text || ''}</textarea>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelDeleteButton" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t('取消')}</button>
                <button id="confirmDeleteButton" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t('删除')}</button>
            </div>
        `);
        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#cancelDeleteButton').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#confirmDeleteButton').addEventListener('click', () => {
            delete buttonConfig.folders[folderName].buttons[btnName];
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(t('🗑️ 按钮 "{{buttonName}}" 已删除。', { buttonName: btnName }));
            // 更新按钮栏
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    const showButtonEditDialog = (folderName, btnName = '', btnConfig = {}, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        // 禁止编辑/删除工具文件夹中的工具按钮
        if (folderName === "🖱️" && btnConfig.type === "tool") {
            alert(t('工具文件夹中的工具按钮无法编辑或删除。'));
            return;
        }
        const isEdit = btnName !== '';

        // Create overlay and dialog containers
        const overlay = document.createElement('div');
        overlay.classList.add('edit-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('edit-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 500px;
            max-width: 90vw;
        `;

        const initialName = btnName || '';
        const initialColor = btnConfig.color || '#FFC1CC';
        const initialTextColor = btnConfig.textColor || '#333333';
        const initialAutoSubmit = btnConfig.autoSubmit || false; // 新增字段
        const initialFavicon = typeof btnConfig.favicon === 'string' ? btnConfig.favicon : '';

        // 预览部分
        const buttonHeaderText = isEdit ? t('✏️ 编辑按钮：') : t('🆕 新建按钮：');
        const previewSection = `
            <div style="
                margin: -24px -24px 20px -24px;
                padding: 16px 24px;
                background-color: var(--button-bg, #f3f4f6);
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                border-radius: 4px 4px 0 0;
                display: flex;
                align-items: center;
                gap: 16px;
            ">
                <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-color, #333333);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    ${buttonHeaderText}
                </div>
                <div id="buttonPreview" style="
                    display: inline-flex;
                    padding: 4px;
                    border-radius: 4px;
                    background-color: var(--dialog-bg, #ffffff);
                ">
                    <button id="previewButton" style="
                        background-color: ${initialColor};
                        color: ${initialTextColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    ">${initialName || t('预览按钮')}</button>
                </div>
            </div>
        `;

        // Tab content for text template
        const textTemplateTab = `
        <div id="textTemplateTab" class="tab-content" style="display: block;">
            <div style="
                width: 100%;
                padding: 12px;
                border-radius: 4px;
                border: 1px solid var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                ">
                    <label style="
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                        white-space: nowrap;
                    ">${t('插入变量：')}</label>
                    <div id="quickInsertButtons" style="
                        display: flex;
                        gap: 8px;
                        flex-wrap: wrap;
                    ">
                        <button type="button" data-insert="{inputboard}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">📝 ${t('输入框')}</button>
                        <button type="button" data-insert="{clipboard}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('📋 剪贴板')}</button>
                        <button type="button" data-insert="{selection}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('🔍 选中')}</button>
                        <button type="button" data-insert="{{inputboard}|{clipboard}}" style="
                            ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                            background-color: var(--primary-color, #3B82F6);
                            color: white;
                            border-radius: 4px;
                            font-size: 12px;
                            padding: 4px 8px;
                            transition: all 0.2s ease;
                            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        ">${t('🔄 输入框/剪贴板')}</button>
                    </div>
                </div>
                <textarea id="buttonText" style="
                    width: 100%;
                    height: 150px;
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid var(--border-color, #e5e7eb);
                    background-color: var(--dialog-bg, #ffffff);
                    color: var(--text-color, #333333);
                    resize: vertical;
                ">${btnConfig.text || ''}</textarea>
            </div>
        </div>`;

        // Tab content for style settings
        const styleSettingsTab = `
            <div id="styleSettingsTab" class="tab-content" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('按钮名称：')}</label>
                    <input type="text" id="buttonName" value="${btnName}" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        background-color: var(--button-bg, #f3f4f6);
                        color: var(--text-color, #333333);
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('按钮图标：')}</label>
                    <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <div id="buttonFaviconPreview" style="
                            width: 40px;
                            height: 40px;
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: transparent;
                            flex-shrink: 0;
                        "></div>
                        <div style="flex: 1 1 auto; display: flex; flex-direction: column;">
                            <textarea id="buttonFaviconInput" rows="1" style="
                                width: 100%;
                                padding: 10px 12px;
                                border: 1px solid var(--border-color, #d1d5db);
                                border-radius: 6px;
                                background-color: var(--dialog-bg, #ffffff);
                                box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);
                                transition: border-color 0.2s ease, box-shadow 0.2s ease;
                                outline: none;
                                font-size: 14px;
                                line-height: 1.5;
                                resize: vertical;
                                overflow-y: hidden;
                            " placeholder="${t('支持 https:// 链接或 data: URL')}">${initialFavicon}</textarea>
                            <div style="
                                margin-top: 6px;
                                font-size: 12px;
                                color: var(--muted-text-color, #6b7280);
                            ">${t('留空时将根据按钮名称中的符号展示默认图标。')}</div>
                        </div>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('按钮背景颜色：')}</label>
                    <input type="color" id="buttonColor" value="${btnConfig.color || '#FFC1CC'}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
                <div style="margin-bottom: 0px;">
                    <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: var(--text-color, #333333);">${t('按钮文字颜色：')}</label>
                    <input type="color" id="buttonTextColor" value="${btnConfig.textColor || '#333333'}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
            </div>
        `;

        // 新增的提交设置子标签页
        const submitSettingsTab = `
            <div id="submitSettingsTab" class="tab-content" style="display: none;">
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                        cursor: pointer;
                        gap: 6px;
                    ">
                        <input type="checkbox" id="autoSubmitCheckbox" style="cursor: pointer;" ${initialAutoSubmit ? 'checked' : ''}>
                        ${t('自动提交 (在填充后自动提交内容)')}
                    </label>
                </div>
            </div>
        `;

        // Tab navigation
        const tabNavigation = `
            <div style="
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
            ">
                <button class="tab-button active" data-tab="textTemplateTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--primary-color, #3B82F6);
                    color: white;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('文本模板')}</button>
                <button class="tab-button" data-tab="styleSettingsTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('样式设置')}</button>
                <button class="tab-button" data-tab="submitSettingsTab" style="
                    ${Object.entries(styles.button).map(([k,v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('提交设置')}</button>
            </div>
        `;

        // Footer buttons
        const footerButtons = `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color, #e5e7eb);
            ">
                <button id="cancelButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t('取消')}</button>
                <button id="saveButtonEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">${t('确认')}</button>
            </div>
        `;

        // Combine all sections
        setTrustedHTML(dialog, `
            ${previewSection}
            ${tabNavigation}
            ${textTemplateTab}
            ${styleSettingsTab}
            ${submitSettingsTab}
            ${footerButtons}
        `);

        // Add tab switching functionality
        const setupTabs = () => {
            const tabButtons = dialog.querySelectorAll('.tab-button');
            const tabContents = dialog.querySelectorAll('.tab-content');
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabId = button.dataset.tab;
                    // Update button styles
                    tabButtons.forEach(btn => {
                        if (btn === button) {
                            btn.style.backgroundColor = 'var(--primary-color, #3B82F6)';
                            btn.style.color = 'white';
                            btn.style.borderBottom = '2px solid var(--primary-color, #3B82F6)';
                        } else {
                            btn.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
                            btn.style.color = 'var(--text-color, #333333)';
                            btn.style.borderBottom = '2px solid transparent';
                        }
                    });
                    // Show/hide content
                    tabContents.forEach(content => {
                        content.style.display = content.id === tabId ? 'block' : 'none';
                    });
                });
            });
        };

        // Rest of the existing dialog setup code...
        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // Setup tabs
        setupTabs();

        // Setup preview updates
        const setupPreviewUpdates = () => {
            const previewButton = dialog.querySelector('#previewButton');
            const buttonNameInput = dialog.querySelector('#buttonName');
            const buttonColorInput = dialog.querySelector('#buttonColor');
            const buttonTextColorInput = dialog.querySelector('#buttonTextColor');
            const autoSubmitCheckbox = dialog.querySelector('#autoSubmitCheckbox'); // 新增引用
            const buttonFaviconInput = dialog.querySelector('#buttonFaviconInput');
            const buttonFaviconPreview = dialog.querySelector('#buttonFaviconPreview');

            const updateFaviconPreview = () => {
                if (!buttonFaviconPreview) return;
                const currentName = buttonNameInput?.value.trim() || initialName || '';
                const faviconValue = buttonFaviconInput?.value.trim() || '';
                const { iconSymbol } = extractButtonIconParts(currentName);
                const fallbackSymbol = iconSymbol || (Array.from(currentName.trim())[0] || '🔖');
                const previewElement = createFaviconElement(
                    faviconValue,
                    currentName,
                    fallbackSymbol,
                    { withBackground: false }
                );
                setTrustedHTML(buttonFaviconPreview, '');
                buttonFaviconPreview.appendChild(previewElement);
            };

            buttonNameInput?.addEventListener('input', (e) => {
                previewButton.textContent = e.target.value || t('预览按钮');
                updateFaviconPreview();
            });

            buttonColorInput?.addEventListener('input', (e) => {
                previewButton.style.backgroundColor = e.target.value;
            });

            buttonTextColorInput?.addEventListener('input', (e) => {
                previewButton.style.color = e.target.value;
            });

            // 监听“自动提交”开关变化
            autoSubmitCheckbox?.addEventListener('change', (e) => {
                console.log(t('✅ 自动提交开关已设置为 {{state}}', { state: e.target.checked }));
            });

            if (buttonFaviconInput) {
                autoResizeTextarea(buttonFaviconInput, { minRows: 1, maxRows: 4 });
                buttonFaviconInput.addEventListener('input', () => {
                    autoResizeTextarea(buttonFaviconInput, { minRows: 1, maxRows: 4 });
                    updateFaviconPreview();
                });
            }

            updateFaviconPreview();
        };
        setupPreviewUpdates();

        // Setup quick insert buttons
        const setupQuickInsert = () => {
            const buttonText = dialog.querySelector('#buttonText');
            const quickInsertButtons = dialog.querySelector('#quickInsertButtons');
            quickInsertButtons?.addEventListener('click', (e) => {
                const button = e.target.closest('button[data-insert]');
                if (!button) return;
                e.preventDefault();
                const insertText = button.dataset.insert;
                const start = buttonText.selectionStart;
                const end = buttonText.selectionEnd;
                buttonText.value = buttonText.value.substring(0, start) +
                                   insertText +
                                   buttonText.value.substring(end);
                buttonText.selectionStart = buttonText.selectionEnd = start + insertText.length;
                buttonText.focus();
            });
            quickInsertButtons?.addEventListener('mousedown', (e) => {
                if (e.target.closest('button[data-insert]')) {
                    e.preventDefault();
                }
            });
        };
        setupQuickInsert();

        // Animation effect
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // Setup buttons
        dialog.querySelector('#cancelButtonEdit')?.addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#saveButtonEdit')?.addEventListener('click', () => {
            const newBtnName = dialog.querySelector('#buttonName').value.trim();
            const newBtnColor = dialog.querySelector('#buttonColor').value;
            const newBtnTextColor = dialog.querySelector('#buttonTextColor').value;
            const newBtnText = dialog.querySelector('#buttonText').value.trim();
            const autoSubmit = dialog.querySelector('#autoSubmitCheckbox')?.checked || false; // 获取自动提交状态
            const newBtnFavicon = (dialog.querySelector('#buttonFaviconInput')?.value || '').trim();

            if (!newBtnName) {
                alert(t('请输入按钮名称！'));
                return;
            }

            if (!isValidColor(newBtnColor) || !isValidColor(newBtnTextColor)) {
                alert(t('请选择有效的颜色！'));
                return;
            }

            if (newBtnName !== btnName && buttonConfig.folders[folderName].buttons[newBtnName]) {
                alert(t('按钮名称已存在！'));
                return;
            }

            // Get all buttons order
            const currentButtons = { ...buttonConfig.folders[folderName].buttons };

            if (btnConfig.type === "tool") {
                // 工具按钮不允许更改类型和动作
                buttonConfig.folders[folderName].buttons[newBtnName] = {
                    type: "tool",
                    action: btnConfig.action,
                    color: newBtnColor,
                    textColor: newBtnTextColor
                };
            } else {
                // 处理模板按钮
                // Handle button rename
                if (btnName && newBtnName !== btnName) {
                    const newButtons = {};
                    Object.keys(currentButtons).forEach(key => {
                        if (key === btnName) {
                            newButtons[newBtnName] = {
                                text: newBtnText,
                                color: newBtnColor,
                                textColor: newBtnTextColor,
                                type: "template",
                                autoSubmit: autoSubmit,
                                favicon: newBtnFavicon
                            };
                        } else {
                            newButtons[key] = currentButtons[key];
                        }
                    });
                    buttonConfig.folders[folderName].buttons = newButtons;
                } else {
                    // Update existing button
                    if (btnName) {
                        buttonConfig.folders[folderName].buttons[btnName] = {
                            text: newBtnText,
                            color: newBtnColor,
                            textColor: newBtnTextColor,
                            type: "template",
                            autoSubmit: autoSubmit,
                            favicon: newBtnFavicon
                        };
                    } else {
                        // Create new button
                        buttonConfig.folders[folderName].buttons[newBtnName] = {
                            text: newBtnText,
                            color: newBtnColor,
                            textColor: newBtnTextColor,
                            type: "template",
                            autoSubmit: autoSubmit,
                            favicon: newBtnFavicon
                        };
                    }
                }
            }

            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn();
            console.log(t('✅ 按钮 "{{buttonName}}" 已保存。', { buttonName: newBtnName }));
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    function isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }

    const showFolderEditDialog = (folderName = '', folderConfig = {}, rerenderFn) => {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }
        const isNew = !folderName;
        const overlay = document.createElement('div');
        overlay.classList.add('folder-edit-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('folder-edit-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 500px;
            max-width: 90vw;
        `;

        const initialName = folderName || '';
        const initialColor = folderConfig.color || '#3B82F6';
        const initialTextColor = folderConfig.textColor || '#ffffff';

        // 预览部分
        const folderHeaderText = isNew ? t('🆕 新建文件夹：') : t('✏️ 编辑文件夹：');
        const previewSection = `
            <div style="
                margin: -24px -24px 20px -24px;
                padding: 16px 24px;
                background-color: var(--button-bg, #f3f4f6);
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                border-radius: 4px 4px 0 0;
                display: flex;
                align-items: center;
                gap: 16px;
            ">
                <div style="
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--text-color, #333333);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    ${folderHeaderText}
                </div>
                <div id="folderPreview" style="
                    display: inline-flex;
                    padding: 4px;
                    border-radius: 4px;
                    background-color: var(--dialog-bg, #ffffff);
                ">
                    <button id="previewButton" style="
                        background-color: ${initialColor};
                        color: ${initialTextColor};
                        border: none;
                        border-radius: 4px;
                        padding: 6px 12px;
                        cursor: default;
                        font-size: 14px;
                        transition: all 0.2s ease;
                    ">${initialName || t('预览文件夹')}</button>
                </div>
            </div>
        `;

        // 设置部分
        const settingsSection = `
            <div style="
                display:flex;
                flex-direction:column;
                gap:20px;
                margin-bottom:20px;
            ">
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">${t('文件夹名称：')}</label>
                    <input type="text" id="folderNameInput" value="${initialName}" style="
                        width: 100%;
                        padding: 8px;
                        border-radius: 4px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        background-color: var(--button-bg, #f3f4f6);
                        color: var(--text-color, #333333);
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">${t('按钮背景颜色：')}</label>
                    <input type="color" id="folderColorInput" value="${initialColor}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
                <div style="margin-bottom: 0px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-color, #333333);
                    ">${t('按钮文字颜色：')}</label>
                    <input type="color" id="folderTextColorInput" value="${initialTextColor}" style="
                        width: 100px;
                        height: 40px;
                        border: 1px solid var(--border-color, #e5e7eb);
                        border-radius: 4px;
                        cursor: pointer;
                        background-color: var(--button-bg, #f3f4f6);
                    ">
                </div>
            </div>
        `;

        // 底部按钮
        const footerButtons = `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--border-color, #e5e7eb);
            ">
                <button id="cancelFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius: 4px;
                ">${t('取消')}</button>
                <button id="saveFolderEdit" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--success-color, #22c55e);
                    color: white;
                    border-radius: 4px;
                ">${t('确认')}</button>
            </div>
        `;

        // Combine all sections
        setTrustedHTML(dialog, `
            ${previewSection}
            ${settingsSection}
            ${footerButtons}
        `);

        // 添加事件监听器
        const setupPreviewUpdates = () => {
            const previewButton = dialog.querySelector('#previewButton');
            const folderNameInput = dialog.querySelector('#folderNameInput');
            const folderColorInput = dialog.querySelector('#folderColorInput');
            const folderTextColorInput = dialog.querySelector('#folderTextColorInput');

            folderNameInput?.addEventListener('input', (e) => {
                previewButton.textContent = e.target.value || t('预览文件夹');
            });

            folderColorInput?.addEventListener('input', (e) => {
                previewButton.style.backgroundColor = e.target.value;
            });

            folderTextColorInput?.addEventListener('input', (e) => {
                previewButton.style.color = e.target.value;
            });
        };
        setupPreviewUpdates();

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // Animation effect
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // Setup buttons
        dialog.querySelector('#cancelFolderEdit').addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        // 在showFolderEditDialog函数的保存按钮点击事件中
        dialog.querySelector('#saveFolderEdit').addEventListener('click', () => {
            const newFolderName = dialog.querySelector('#folderNameInput').value.trim();
            const newColor = dialog.querySelector('#folderColorInput').value;
            const newTextColor = dialog.querySelector('#folderTextColorInput').value;

            if (!newFolderName) {
                alert(t('请输入文件夹名称'));
                return;
            }

            if (isNew && buttonConfig.folders[newFolderName]) {
                alert(t('该文件夹已存在！'));
                return;
            }

            if (!isNew && newFolderName !== folderName && buttonConfig.folders[newFolderName]) {
                alert(t('该文件夹已存在！'));
                return;
            }

            if (!isNew && newFolderName !== folderName) {
                const oldButtons = buttonConfig.folders[folderName].buttons;
                buttonConfig.folders[newFolderName] = {
                    ...buttonConfig.folders[folderName],
                    color: newColor,
                    textColor: newTextColor,
                    buttons: { ...oldButtons }
                };
                delete buttonConfig.folders[folderName];
                const idx = buttonConfig.folderOrder.indexOf(folderName);
                if (idx > -1) {
                    buttonConfig.folderOrder[idx] = newFolderName;
                }
            } else {
                buttonConfig.folders[newFolderName] = buttonConfig.folders[newFolderName] || { buttons: {} };
                buttonConfig.folders[newFolderName].color = newColor;
                buttonConfig.folders[newFolderName].textColor = newTextColor;

                // 确保新建文件夹有hidden字段且默认为false
                if (typeof buttonConfig.folders[newFolderName].hidden !== 'boolean') {
                    buttonConfig.folders[newFolderName].hidden = false;
                }

                // 在isNew分支中把新建的文件夹名加入folderOrder
                if (isNew) {
                    buttonConfig.folderOrder.push(newFolderName);
                }
            }

            // 确保所有按钮都有'type'字段和'autoSubmit'字段
            Object.entries(buttonConfig.folders).forEach(([folderName, folderCfg]) => {
                Object.entries(folderCfg.buttons).forEach(([btnName, btnCfg]) => {
                    if (!btnCfg.type) {
                        if (folderName === "🖱️") {
                            btnCfg.type = "tool";
                        } else {
                            btnCfg.type = "template";
                        }
                    }
                    if (btnCfg.type === "template" && typeof btnCfg.autoSubmit !== 'boolean') {
                        btnCfg.autoSubmit = false;
                    }
                });
            });

            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (rerenderFn) rerenderFn(newFolderName);
            console.log(t('✅ 文件夹 "{{folderName}}" 已保存。', { folderName: newFolderName }));
            updateButtonContainer();
            updateCounters(); // 更新所有计数器
        });
    };

    const createSettingsButton = () => {
        const button = document.createElement('button');
        button.innerText = '⚙️';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.addEventListener('click', showUnifiedSettingsDialog);
        return button;
    };

    const createCutButton = () => {
        const button = document.createElement('button');
        button.innerText = '✂️';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = t('剪切输入框内容');
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = getFocusedEditableElement();
            if (!isEditableElement(focusedElement)) {
                console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                return;
            }
            let text = '';
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                text = focusedElement.value;
                // 清空textarea内容
                const nativeSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
                nativeSetter.call(focusedElement, '');
                const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'deleteContent'
                });
                focusedElement.dispatchEvent(inputEvent);
            } else {
                // 处理contenteditable元素
                const childNodes = Array.from(focusedElement.childNodes);
                const textParts = [];
                childNodes.forEach((node, index) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        textParts.push(node.textContent);
                    } else if (node.nodeName === 'BR') {
                        textParts.push('\n');
                    } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                        if (index > -1) textParts.push('\n');
                        textParts.push(node.textContent);
                    }
                });
                text = textParts.join('');
                // 清空contenteditable内容
                setTrustedHTML(focusedElement, '');
            }
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log(t('✅ 已剪切输入框内容到剪贴板。'));
                    showTemporaryFeedback(focusedElement, '剪切成功');
                }).catch(err => {
                    console.error("剪切失败:", err);
                    alert(t('剪切失败，请检查浏览器权限。'));
                });
            }
            // 确保输入框保持焦点
            focusedElement.focus();
            // 如果是textarea，还需要设置光标位置到开始处
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                focusedElement.selectionStart = focusedElement.selectionEnd = 0;
            }
            console.log(t('✅ 输入框内容已清空。'));
            showTemporaryFeedback(focusedElement, '清空成功');
        });
        return button;
    };

    const createCopyButton = () => {
        const button = document.createElement('button');
        button.innerText = '🅲';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = t('复制输入框内容');
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = getFocusedEditableElement();
            if (!isEditableElement(focusedElement)) {
                console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                return;
            }
            let text = '';
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                text = focusedElement.value;
            } else {
                const textContent = [];
                const childNodes = Array.from(focusedElement.childNodes);
                childNodes.forEach((node, index) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        textContent.push(node.textContent);
                    } else if (node.nodeName === 'BR') {
                        textContent.push('\n');
                    } else if (node.nodeName === 'P' || node.nodeName === 'DIV') {
                        if (index > -1) textContent.push('\n');
                        textContent.push(node.textContent);
                    }
                });
                text = textContent.join('');
            }
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    console.log(t('✅ 已复制输入框内容到剪贴板。'));
                    showTemporaryFeedback(focusedElement, '复制成功');
                }).catch(err => {
                    console.error("复制失败:", err);
                    alert(t('复制失败，请检查浏览器权限。'));
                });
            }
            // 确保输入框保持焦点
            focusedElement.focus();
        });
        return button;
    };

    const createPasteButton = () => {
        const button = document.createElement('button');
        button.innerText = '🆅';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--text-color, #333333)';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = t('粘贴剪切板内容');
        // 阻止mousedown默认行为以维持输入框焦点
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const focusedElement = getFocusedEditableElement();
            if (!isEditableElement(focusedElement)) {
                console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                return;
            }
            try {
                const clipboardText = await navigator.clipboard.readText();
                // 使用现有的insertTextSmart函数插入文本
                insertTextSmart(focusedElement, clipboardText);
                // 添加视觉反馈
                const originalText = button.innerText;
                button.innerText = '✓';
                button.style.backgroundColor = 'var(--success-color, #22c55e)';
                button.style.color = 'white';
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
                    button.style.color = 'var(--text-color, #333333)';
                }, 1000);
                    console.log(t('✅ 已粘贴剪贴板内容到输入框。'));
            } catch (err) {
                console.error("访问剪切板失败:", err);
                alert(t('粘贴失败，请检查浏览器权限。'));
            }
            // 确保输入框保持焦点
            focusedElement.focus();
        });
        return button;
    };

    const createClearButton = () => {
        const button = document.createElement('button');
        button.textContent = '✖';
        button.type = 'button';
        button.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
        button.style.color = 'var(--clear-icon-color, var(--text-color, #333333))';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.style.marginLeft = '10px';
        button.title = t('清空输入框');
        // 添加mousedown事件处理器来阻止焦点切换
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            const focusedElement = getFocusedEditableElement();
            if (!isEditableElement(focusedElement)) {
                console.warn(t('当前未聚焦到有效的 textarea 或 contenteditable 元素。'));
                return;
            }
            // 使用现有的insertTextSmart函数清空内容
            insertTextSmart(focusedElement, '', true);
            // 确保立即重新聚焦
            focusedElement.focus();
            // 如果是textarea，还需要设置光标位置到开始处
            if (focusedElement.tagName.toLowerCase() === 'textarea') {
                focusedElement.selectionStart = focusedElement.selectionEnd = 0;
            }
            console.log(t('✅ 输入框内容已清空。'));
            showTemporaryFeedback(focusedElement, '清空成功');
        });
        return button;
    };

    // 新增的配置设置按钮和弹窗
    const createConfigSettingsButton = () => {
        const button = document.createElement('button');
        button.innerText = t('🛠️ 脚本配置');
        button.type = 'button';
        button.style.backgroundColor = 'var(--info-color, #4F46E5)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.padding = '5px 10px';
        button.style.cursor = 'pointer';
        button.style.fontSize = '14px';
        button.addEventListener('click', showConfigSettingsDialog);
        return button;
    };

    const createButtonContainer = () => {
        const root = getShadowRoot();
        let existingContainer = root ? root.querySelector('.folder-buttons-container') : null;
        if (existingContainer) {
            updateButtonContainer();
            return existingContainer;
        }
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('folder-buttons-container');
        buttonContainer.style.pointerEvents = 'auto';

        buttonContainer.style.position = 'fixed';
        buttonContainer.style.right = '0px';
        buttonContainer.style.width = '100%';
        buttonContainer.style.zIndex = '1000';

        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'nowrap';
        buttonContainer.style.overflowX = 'auto';
        buttonContainer.style.overflowY = 'hidden';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '0px';
        buttonContainer.style.height = buttonConfig.buttonBarHeight + 'px';

        buttonContainer.style.scrollbarWidth = 'none';
        buttonContainer.style.msOverflowStyle = 'none';
        buttonContainer.classList.add('hide-scrollbar');

        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.padding = '6px 15px';

        buttonContainer.style.backgroundColor = 'transparent';
        buttonContainer.style.boxShadow = 'none';
        buttonContainer.style.borderRadius = '4px';

        buttonConfig.folderOrder.forEach((name) => {
            const config = buttonConfig.folders[name];
            if (config && !config.hidden) {
                const folderButton = createFolderButton(name, config);
                buttonContainer.appendChild(folderButton);
            }
        });

        buttonContainer.appendChild(createSettingsButton());
        buttonContainer.appendChild(createClearButton());

        buttonContainer.dataset.barPaddingY = '6';
        applyBarBottomSpacing(
            buttonContainer,
            buttonConfig.buttonBarBottomSpacing,
            buttonConfig.buttonBarBottomSpacing
        );

        return buttonContainer;
    };

    const updateButtonContainer = () => {
        const root = getShadowRoot();
        let existingContainer = root ? root.querySelector('.folder-buttons-container') : null;
        if (existingContainer) {
            const settingsButton = existingContainer.querySelector('button:nth-last-child(2)');
            const clearButton = existingContainer.querySelector('button:last-child');

            setTrustedHTML(existingContainer, '');

            buttonConfig.folderOrder.forEach((name) => {
                const config = buttonConfig.folders[name];
                if (config && !config.hidden) {
                    const folderButton = createFolderButton(name, config);
                    existingContainer.appendChild(folderButton);
                }
            });

            if (settingsButton) existingContainer.appendChild(settingsButton);
            if (clearButton) existingContainer.appendChild(clearButton);

            console.log(t('✅ 按钮栏已更新（已过滤隐藏文件夹）。'));
        } else {
            console.warn(t('⚠️ 未找到按钮容器，无法更新按钮栏。'));
        }
        try {
            applyDomainStyles();
        } catch (err) {
            console.warn(t('应用域名样式失败:'), err);
        }
    };

    const attachButtonsToTextarea = (textarea) => {
        let buttonContainer = queryUI('.folder-buttons-container');
        if (!buttonContainer) {
            buttonContainer = createButtonContainer();
            appendToMainLayer(buttonContainer);
            try { applyDomainStyles(); } catch (_) {}
            console.log(t('✅ 按钮容器已固定到窗口底部。'));
        } else {
            console.log(t('ℹ️ 按钮容器已存在，跳过附加。'));
        }
        textarea.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    };

    let attachTimeout;
    const attachButtons = () => {
        if (attachTimeout) clearTimeout(attachTimeout);
        attachTimeout = setTimeout(() => {
            const textareas = getAllTextareas();
            console.log(t('🔍 扫描到 {{count}} 个 textarea 或 contenteditable 元素。', {
                count: textareas.length
            }));
            if (textareas.length === 0) {
                console.warn(t('⚠️ 未找到任何 textarea 或 contenteditable 元素。'));
                return;
            }
            attachButtonsToTextarea(textareas[textareas.length - 1]);
            console.log(t('✅ 按钮已附加到最新的 textarea 或 contenteditable 元素。'));
        }, 300);
    };

    const observeShadowRoots = (node) => {
        if (node.shadowRoot) {
            const shadowObserver = new MutationObserver(() => {
                attachButtons();
            });
            shadowObserver.observe(node.shadowRoot, {
                childList: true,
                subtree: true,
            });
            node.shadowRoot.querySelectorAll('*').forEach(child => observeShadowRoots(child));
        }
    };
/* -------------------------------------------------------------------------- *
 * Module 03 · Settings panel, configuration flows, folder management helpers
 * -------------------------------------------------------------------------- */

    const extractTemplateVariables = (text = '') => {
        if (typeof text !== 'string' || !text.includes('{')) {
            return [];
        }

        const matches = new Set();
        const fallbackMatches = text.match(/\{\{[A-Za-z0-9_-]+\}\|\{[A-Za-z0-9_-]+\}\}/g) || [];
        fallbackMatches.forEach(match => matches.add(match));

        let sanitized = text;
        fallbackMatches.forEach(match => {
            sanitized = sanitized.split(match).join(' ');
        });

        const singleMatches = sanitized.match(/\{[A-Za-z0-9_-]+\}/g) || [];
        singleMatches.forEach(match => matches.add(match));

        return Array.from(matches);
    };

    let selectedFolderName = buttonConfig.folderOrder[0] || null; // 在设置面板中使用
    let folderListContainer, buttonListContainer; // 在渲染函数中定义

    const renderFolderList = () => {
        if (!folderListContainer) return;
        setTrustedHTML(folderListContainer, '');
        const foldersArray = buttonConfig.folderOrder.map(fname => [fname, buttonConfig.folders[fname]]).filter(([f,c])=>c);
        foldersArray.forEach(([fname, fconfig]) => {
            const folderItem = document.createElement('div');
            folderItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                border-radius: 4px;
                margin: 4px 0;
                background-color: ${selectedFolderName === fname ? (isDarkMode() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.1)') : 'transparent'};
                cursor: move;
                direction: ltr;
                min-height: 36px;
            `;
            folderItem.classList.add('folder-item');
            folderItem.setAttribute('draggable', 'true');
            folderItem.setAttribute('data-folder', fname);

        const { container: leftInfo, folderPreview } = (function createFolderPreview(fname, fconfig) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            container.style.gap = '10px';
            container.style.flex = '1';
            container.style.minWidth = '0';
            container.style.paddingRight = '8px';

            const showIcons = buttonConfig && buttonConfig.showFolderIcons === true;
            const { iconSymbol, textLabel } = extractButtonIconParts(fname);
            const normalizedLabel = (textLabel || fname || '').trim();
            const fallbackLabel = normalizedLabel || fname || t('预览文件夹');
            const fallbackSymbol = iconSymbol || (Array.from(fallbackLabel)[0] || '📁');

            const previewButton = document.createElement('button');
            previewButton.type = 'button';
            previewButton.setAttribute('data-folder-preview', fname);
            previewButton.title = fname;
            previewButton.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                border-radius: 4px;
                background-color: transparent;
                border: none;
                cursor: grab;
                flex-shrink: 1;
                min-width: 0;
                max-width: 100%;
                margin: 0 8px 0 0;
            `;

            const pill = document.createElement('span');
            pill.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: ${showIcons ? '6px' : '0'};
                background: ${fconfig.color || 'var(--primary-color, #3B82F6)'};
                color: ${fconfig.textColor || '#ffffff'};
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 14px;
                font-weight: ${selectedFolderName === fname ? '600' : '500'};
                min-width: 0;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                pointer-events: none;
                transition: all 0.2s ease;
            `;

            if (showIcons) {
                const iconSpan = document.createElement('span');
                iconSpan.style.display = 'inline-flex';
                iconSpan.style.alignItems = 'center';
                iconSpan.style.justifyContent = 'center';
                iconSpan.style.fontSize = '14px';
                iconSpan.style.lineHeight = '1';
                iconSpan.textContent = fallbackSymbol;
                pill.appendChild(iconSpan);
            }

            const textSpan = document.createElement('span');
            textSpan.style.display = 'inline-flex';
            textSpan.style.alignItems = 'center';
            textSpan.style.justifyContent = 'center';
            textSpan.style.pointerEvents = 'none';

            let textContent = showIcons ? normalizedLabel : (fname || normalizedLabel);
            if (!showIcons && iconSymbol && !fname.includes(iconSymbol)) {
                textContent = `${iconSymbol} ${textContent || ''}`.trim();
            }
            if (!showIcons && !textContent) {
                textContent = fallbackLabel;
            }
            if (textContent) {
                textSpan.textContent = textContent;
                pill.appendChild(textSpan);
            }

            previewButton.appendChild(pill);

            // Ensure the preview keeps the requested button style while remaining draggable/selectable
            previewButton.style.whiteSpace = 'nowrap';
            previewButton.style.alignSelf = 'flex-start';

            container.appendChild(previewButton);
            return { container, folderPreview: previewButton };
        })(fname, fconfig);

            const rightBtns = document.createElement('div');
            rightBtns.style.display = 'flex';
            rightBtns.style.gap = '4px'; // 增加按钮间的间距
            rightBtns.style.alignItems = 'center';
            rightBtns.style.width = '130px'; // 与标签栏保持一致的宽度
            rightBtns.style.justifyContent = 'flex-start'; // 改为左对齐
            rightBtns.style.paddingLeft = '8px'; // 添加左侧padding与标签栏对齐
            rightBtns.style.paddingRight = '12px'; // 添加右侧padding

            // 创建隐藏状态勾选框容器
            const hiddenCheckboxContainer = document.createElement('div');
            hiddenCheckboxContainer.style.display = 'flex';
            hiddenCheckboxContainer.style.alignItems = 'center';
            hiddenCheckboxContainer.style.justifyContent = 'center';
            hiddenCheckboxContainer.style.width = '36px'; // 与标签栏"显示"列宽度一致
            hiddenCheckboxContainer.style.marginRight = '4px'; // 添加右边距
            hiddenCheckboxContainer.style.padding = '2px';
            hiddenCheckboxContainer.style.borderRadius = '3px';
            hiddenCheckboxContainer.style.cursor = 'pointer';
            hiddenCheckboxContainer.title = t('勾选后该文件夹将在主界面显示');

            const hiddenCheckbox = document.createElement('input');
            hiddenCheckbox.type = 'checkbox';
            hiddenCheckbox.checked = !fconfig.hidden; // 勾选表示显示
            hiddenCheckbox.style.cursor = 'pointer';
            hiddenCheckbox.style.accentColor = 'var(--primary-color, #3B82F6)';
            hiddenCheckbox.style.margin = '0';
            hiddenCheckbox.style.transform = 'scale(1.1)'; // 稍微放大勾选框以便操作

            // 删除了checkboxText元素，不再显示"显示"文字

            // 关键修复：先添加change事件监听器到checkbox
            hiddenCheckbox.addEventListener('change', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
                const newHiddenState = !hiddenCheckbox.checked;
                fconfig.hidden = newHiddenState;
                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                console.log(t('✅ 文件夹 "{{folderName}}" 的隐藏状态已设置为 {{state}}', {
                    folderName: fname,
                    state: fconfig.hidden
                }));
                updateButtonContainer();
            });

            // 为checkbox添加click事件，确保优先处理
            hiddenCheckbox.addEventListener('click', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();
            });

            // 容器点击事件，点击容器时切换checkbox状态
            hiddenCheckboxContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                e.stopImmediatePropagation();

                // 如果点击的不是checkbox本身，则手动切换checkbox状态
                if (e.target !== hiddenCheckbox) {
                    hiddenCheckbox.checked = !hiddenCheckbox.checked;
                    // 手动触发change事件
                    const changeEvent = new Event('change', { bubbles: false });
                    hiddenCheckbox.dispatchEvent(changeEvent);
                }
            });

            hiddenCheckboxContainer.appendChild(hiddenCheckbox);
            // 不再添加checkboxText


            // 创建编辑按钮
            const editFolderBtn = document.createElement('button');
            editFolderBtn.textContent = '✏️';
            editFolderBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: var(--primary-color, #3B82F6);
                width: 36px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 4px;
            `;
            editFolderBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showFolderEditDialog(fname, fconfig, (newFolderName) => {
                    selectedFolderName = newFolderName;
                    renderFolderList();
                    renderButtonList();
                });
            });

            const deleteFolderBtn = document.createElement('button');
            deleteFolderBtn.textContent = '🗑️';
            deleteFolderBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                font-size: 14px;
                color: var(--danger-color, #ef4444);
                width: 36px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            deleteFolderBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteFolderConfirmDialog(fname, () => {
                    const allFolders = buttonConfig.folderOrder;
                    selectedFolderName = allFolders[0] || null;
                    renderFolderList();
                    renderButtonList();
                    updateCounters(); // 更新所有计数器
                });
            });

            rightBtns.appendChild(hiddenCheckboxContainer);
            rightBtns.appendChild(editFolderBtn);
            rightBtns.appendChild(deleteFolderBtn);

            folderItem.appendChild(leftInfo);
            folderItem.appendChild(rightBtns);

            // 修改folderItem的点击事件，排除右侧按钮区域
            folderItem.addEventListener('click', (e) => {
                // 如果点击的是右侧按钮区域，不触发文件夹选择
                if (rightBtns.contains(e.target)) {
                    return;
                }
                selectedFolderName = fname;
                renderFolderList();
                renderButtonList();
            });

            folderItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', fname);
                folderItem.style.opacity = '0.5';
            });

            folderItem.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            folderItem.addEventListener('dragenter', () => {
                folderItem.style.border = `2px solid var(--primary-color, #3B82F6)`;
            });

            folderItem.addEventListener('dragleave', () => {
                folderItem.style.border = 'none';
            });

            folderItem.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedFolder = e.dataTransfer.getData('text/plain');
                if (draggedFolder && draggedFolder !== fname) {
                    const draggedIndex = buttonConfig.folderOrder.indexOf(draggedFolder);
                    const targetIndex = buttonConfig.folderOrder.indexOf(fname);
                    if (draggedIndex > -1 && targetIndex > -1) {
                        const [removed] = buttonConfig.folderOrder.splice(draggedIndex, 1);
                        buttonConfig.folderOrder.splice(targetIndex, 0, removed);
                        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                        renderFolderList();
                        renderButtonList();
                        console.log(t('🔄 文件夹顺序已更新：{{draggedFolder}} 移动到 {{targetFolder}} 前。', {
                            draggedFolder,
                            targetFolder: fname
                        }));
                        // 更新按钮栏
                        updateButtonContainer();
                    }
                }
                // Check if a button is being dropped onto this folder
                const buttonData = e.dataTransfer.getData('application/json');
                if (buttonData) {
                    try {
                        const { buttonName: draggedBtnName, sourceFolder } = JSON.parse(buttonData);
                        if (draggedBtnName && sourceFolder && sourceFolder !== fname) {
                            // Move the button from sourceFolder to fname
                            const button = buttonConfig.folders[sourceFolder].buttons[draggedBtnName];
                            if (button) {
                                // Remove from source
                                delete buttonConfig.folders[sourceFolder].buttons[draggedBtnName];
                                // Add to target
                                buttonConfig.folders[fname].buttons[draggedBtnName] = button;
                                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                                renderFolderList();
                                renderButtonList();
                                console.log(t('🔄 按钮 "{{buttonName}}" 已从 "{{sourceFolder}}" 移动到 "{{targetFolder}}"。', {
                                    buttonName: draggedBtnName,
                                    sourceFolder,
                                    targetFolder: fname
                                }));
                                // Update button container
                                updateButtonContainer();
                            }
                        }
                    } catch (error) {
                        console.error("解析拖放数据失败:", error);
                    }
                }
                folderItem.style.border = 'none';
            });

            folderItem.addEventListener('dragend', () => {
                folderItem.style.opacity = '1';
            });

        folderListContainer.appendChild(folderItem);
    });

    localizeElement(folderListContainer);
    scheduleLocalization();
    };

    // 升级：更新所有计数显示的函数
    const updateCounters = () => {
        // 计算统计数据
        const totalFolders = Object.keys(buttonConfig.folders).length;
        const totalButtons = Object.values(buttonConfig.folders).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons).length;
        }, 0);

        // 更新文件夹总数计数
        const folderCountBadge = queryUI('#folderCountBadge');
        if (folderCountBadge) {
            folderCountBadge.textContent = totalFolders.toString();
            folderCountBadge.title = t('共有 {{count}} 个文件夹', { count: totalFolders });
        }

        // 更新按钮总数计数
        const totalButtonCountBadge = queryUI('#totalButtonCountBadge');
        if (totalButtonCountBadge) {
            totalButtonCountBadge.textContent = totalButtons.toString();
            totalButtonCountBadge.title = t('所有文件夹共有 {{count}} 个按钮', { count: totalButtons });
        }

        // 更新当前文件夹按钮数计数
        if (selectedFolderName && buttonConfig.folders[selectedFolderName]) {
            const currentFolderButtonCount = Object.keys(buttonConfig.folders[selectedFolderName].buttons).length;
            const currentFolderBadge = queryUI('#currentFolderButtonCount');
            if (currentFolderBadge) {
                currentFolderBadge.textContent = currentFolderButtonCount.toString();
                currentFolderBadge.title = t('"{{folderName}}" 文件夹有 {{count}} 个按钮', {
                    folderName: selectedFolderName,
                    count: currentFolderButtonCount
                });
            }
        }

        console.log(t('📊 计数器已更新: {{folderCount}}个文件夹, {{buttonCount}}个按钮总数', {
            folderCount: totalFolders,
            buttonCount: totalButtons
        }));
    };

    const renderButtonList = () => {
        if (!buttonListContainer) return;
        setTrustedHTML(buttonListContainer, '');
        if (!selectedFolderName) return;
        const currentFolderConfig = buttonConfig.folders[selectedFolderName];
        if (!currentFolderConfig) return;

    const rightHeader = document.createElement('div');
    rightHeader.style.display = 'flex';
    rightHeader.style.justifyContent = 'space-between';
    rightHeader.style.alignItems = 'center';
    rightHeader.style.marginBottom = '8px';

    const folderNameLabel = document.createElement('h3');
    folderNameLabel.style.display = 'flex';
    folderNameLabel.style.alignItems = 'center';
    folderNameLabel.style.gap = '10px';
    folderNameLabel.style.margin = '0';

    const folderNameText = document.createElement('span');
    setTrustedHTML(folderNameText, `➤ <strong>${selectedFolderName}</strong>`);

    const buttonCountBadge = document.createElement('span');
    buttonCountBadge.id = 'currentFolderButtonCount';
    buttonCountBadge.style.cssText = `
        background-color: var(--info-color, #6366F1);
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 11px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        cursor: help;
        transition: all 0.2s ease;
    `;

    // 计算当前文件夹的按钮数量
    const buttonCount = Object.keys(currentFolderConfig.buttons).length;
    buttonCountBadge.textContent = buttonCount.toString();
    buttonCountBadge.title = t('"{{folderName}}" 文件夹有 {{count}} 个按钮', {
        folderName: selectedFolderName,
        count: buttonCount
    });

    // 添加hover效果
    buttonCountBadge.addEventListener('mouseenter', () => {
        buttonCountBadge.style.transform = 'scale(1.15)';
        buttonCountBadge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
    });
    buttonCountBadge.addEventListener('mouseleave', () => {
        buttonCountBadge.style.transform = 'scale(1)';
        buttonCountBadge.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    });

    folderNameLabel.appendChild(folderNameText);
    folderNameLabel.appendChild(buttonCountBadge);

    const addNewButtonBtn = document.createElement('button');
    Object.assign(addNewButtonBtn.style, styles.button, {
        backgroundColor: 'var(--add-color, #fd7e14)',
        color: 'white',
        borderRadius: '4px'
    });
    addNewButtonBtn.textContent = t('+ 新建按钮');
    addNewButtonBtn.addEventListener('click', () => {
        showButtonEditDialog(selectedFolderName, '', {}, () => {
            renderButtonList();
        });
    });

    rightHeader.appendChild(folderNameLabel);
    rightHeader.appendChild(addNewButtonBtn);

    buttonListContainer.appendChild(rightHeader);

    // 新增：创建包含标签栏和内容的容器，滚动条将出现在此容器右侧
    const contentWithHeaderContainer = document.createElement('div');
    contentWithHeaderContainer.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 4px;
    `;

    // 创建按钮列表标签栏 - 固定在滚动容器顶部
    const buttonHeaderBar = document.createElement('div');
    buttonHeaderBar.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 8px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        border-radius: 4px 4px 0 0;
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        position: sticky;
        top: 0;
        z-index: 2;
        flex-shrink: 0;
    `;

    const leftButtonHeaderLabel = document.createElement('div');
    leftButtonHeaderLabel.textContent = t('按钮预览');
    leftButtonHeaderLabel.style.flex = '1';
    leftButtonHeaderLabel.style.textAlign = 'left';
    leftButtonHeaderLabel.style.paddingLeft = 'calc(8px + 1em)';

    const rightButtonHeaderLabels = document.createElement('div');
    rightButtonHeaderLabels.style.display = 'flex';
    rightButtonHeaderLabels.style.gap = '4px';
    rightButtonHeaderLabels.style.alignItems = 'center';
    rightButtonHeaderLabels.style.width = '240px';
    rightButtonHeaderLabels.style.paddingLeft = '8px';
    rightButtonHeaderLabels.style.paddingRight = '12px';

    const variableLabel = document.createElement('div');
    variableLabel.textContent = t('变量');
    variableLabel.style.width = '110px';
    variableLabel.style.textAlign = 'center';
    variableLabel.style.fontSize = '12px';
    variableLabel.style.marginLeft = '-1em';
    const autoSubmitLabel = document.createElement('div');
    autoSubmitLabel.textContent = t('自动提交');
    autoSubmitLabel.style.width = '64px';
    autoSubmitLabel.style.textAlign = 'center';
    autoSubmitLabel.style.fontSize = '12px';
    autoSubmitLabel.style.marginLeft = 'calc(-0.5em)';

    const editButtonLabel = document.createElement('div');
    editButtonLabel.textContent = t('修改');
    editButtonLabel.style.width = '40px';
    editButtonLabel.style.textAlign = 'center';
    editButtonLabel.style.fontSize = '12px';

    const deleteButtonLabel = document.createElement('div');
    deleteButtonLabel.textContent = t('删除');
    deleteButtonLabel.style.width = '36px';
    deleteButtonLabel.style.textAlign = 'center';
    deleteButtonLabel.style.fontSize = '12px';

    rightButtonHeaderLabels.appendChild(variableLabel);
    rightButtonHeaderLabels.appendChild(autoSubmitLabel);
    rightButtonHeaderLabels.appendChild(editButtonLabel);
    rightButtonHeaderLabels.appendChild(deleteButtonLabel);

    buttonHeaderBar.appendChild(leftButtonHeaderLabel);
    buttonHeaderBar.appendChild(rightButtonHeaderLabels);

    // 修改：内容区域不再需要自己的滚动条和边框
    const btnScrollArea = document.createElement('div');
    btnScrollArea.style.cssText = `
        flex: 1;
        padding: 8px;
        overflow-y: visible;
        min-height: 0;
    `;

    const currentFolderButtons = Object.entries(currentFolderConfig.buttons);
    const createButtonPreview = (btnName, btnCfg) => {
        const btnEl = createCustomButtonElement(btnName, btnCfg);
        btnEl.style.marginBottom = '0px';
        btnEl.style.marginRight = '8px';
        btnEl.style.cursor = 'grab';
        btnEl.style.flexShrink = '1';
        btnEl.style.minWidth = '0';
        btnEl.style.maxWidth = '100%';
        btnEl.style.whiteSpace = 'normal';
        btnEl.style.wordBreak = 'break-word';
        btnEl.style.overflow = 'visible';
        btnEl.style.lineHeight = '1.4';
        btnEl.style.overflowWrap = 'anywhere';
        btnEl.style.display = 'inline-flex';
        btnEl.style.flexWrap = 'wrap';
        btnEl.style.alignItems = 'center';
        btnEl.style.justifyContent = 'flex-start';
        btnEl.style.columnGap = '6px';
        btnEl.style.rowGap = '2px';
        btnEl.style.alignSelf = 'flex-start';
        return btnEl;
    };

    currentFolderButtons.forEach(([btnName, cfg]) => {
        const btnItem = document.createElement('div');
        btnItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            padding: 4px;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px;
            background-color: var(--button-bg, #f3f4f6);
            cursor: move;
            width: 100%;
            box-sizing: border-box;
            overflow: visible;
        `;
        btnItem.setAttribute('draggable', 'true');
        btnItem.setAttribute('data-button-name', btnName);

        const leftPart = document.createElement('div');
        leftPart.style.display = 'flex';
        leftPart.style.alignItems = 'flex-start';
        leftPart.style.gap = '8px';
        leftPart.style.flex = '1';
        leftPart.style.minWidth = '0';
        leftPart.style.overflow = 'visible';

        const previewWrapper = document.createElement('div');
        previewWrapper.style.display = 'flex';
        previewWrapper.style.alignItems = 'flex-start';
        previewWrapper.style.flex = '1 1 auto';
        previewWrapper.style.maxWidth = '100%';
        previewWrapper.style.minWidth = '0';
        previewWrapper.style.overflow = 'visible';
        previewWrapper.style.alignSelf = 'flex-start';

        const btnPreview = createButtonPreview(btnName, cfg);
        previewWrapper.appendChild(btnPreview);
        leftPart.appendChild(previewWrapper);

        const opsDiv = document.createElement('div');
        opsDiv.style.display = 'flex';
        opsDiv.style.gap = '4px';
        opsDiv.style.alignItems = 'center';
        opsDiv.style.width = '240px';
        opsDiv.style.paddingLeft = '8px';
        opsDiv.style.paddingRight = '12px';
        opsDiv.style.flexShrink = '0';

        const variableInfoContainer = document.createElement('div');
        variableInfoContainer.style.display = 'flex';
        variableInfoContainer.style.alignItems = 'center';
        variableInfoContainer.style.justifyContent = 'center';
        variableInfoContainer.style.flexDirection = 'column';
        variableInfoContainer.style.width = '110px';
        variableInfoContainer.style.fontSize = '12px';
        variableInfoContainer.style.lineHeight = '1.2';
        variableInfoContainer.style.wordBreak = 'break-word';
        variableInfoContainer.style.textAlign = 'center';
        variableInfoContainer.style.color = 'var(--text-color, #333333)';

        if (cfg.type === 'template') {
            const variablesUsed = extractTemplateVariables(cfg.text || '');
            if (variablesUsed.length > 0) {
                const displayText = variablesUsed.join(isNonChineseLocale() ? ', ' : '、');
                variableInfoContainer.textContent = displayText;
                variableInfoContainer.title = t('模板变量: {{variable}}', { variable: displayText });
            } else {
                variableInfoContainer.textContent = t('无');
                variableInfoContainer.title = t('未使用模板变量');
            }
        } else {
            variableInfoContainer.textContent = '—';
            variableInfoContainer.title = t('工具按钮不使用模板变量');
        }

        // 创建"自动提交"开关容器
        const autoSubmitContainer = document.createElement('div');
        autoSubmitContainer.style.display = 'flex';
        autoSubmitContainer.style.alignItems = 'center';
        autoSubmitContainer.style.justifyContent = 'center';
        autoSubmitContainer.style.width = '60px';

        const autoSubmitCheckbox = document.createElement('input');
        autoSubmitCheckbox.type = 'checkbox';
        autoSubmitCheckbox.checked = cfg.autoSubmit || false;
        autoSubmitCheckbox.style.cursor = 'pointer';
        autoSubmitCheckbox.style.accentColor = 'var(--primary-color, #3B82F6)';
        autoSubmitCheckbox.style.margin = '0';
        autoSubmitCheckbox.style.transform = 'scale(1.1)';
        autoSubmitCheckbox.addEventListener('change', () => {
            cfg.autoSubmit = autoSubmitCheckbox.checked;
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
            console.log(t('✅ 按钮 "{{buttonName}}" 的自动提交已设置为 {{state}}', {
                buttonName: btnName,
                state: autoSubmitCheckbox.checked
            }));
        });

        autoSubmitContainer.appendChild(autoSubmitCheckbox);

        // 创建编辑按钮
        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️';
        editBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            color: var(--primary-color, #3B82F6);
            font-size: 14px;
            width: 36px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showButtonEditDialog(selectedFolderName, btnName, cfg, () => {
                renderButtonList();
            });
        });

        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.cssText = `
            background: none;
            border: none;
            cursor: pointer;
            color: var(--danger-color, #ef4444);
            font-size: 14px;
            width: 36px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showDeleteButtonConfirmDialog(selectedFolderName, btnName, () => {
                renderButtonList();
            });
        });

        opsDiv.appendChild(variableInfoContainer);
        opsDiv.appendChild(autoSubmitContainer);
        opsDiv.appendChild(editBtn);
        opsDiv.appendChild(deleteBtn);

        btnItem.appendChild(leftPart);
        btnItem.appendChild(opsDiv);

        btnItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify({
                buttonName: btnName,
                sourceFolder: selectedFolderName
            }));
            btnItem.style.opacity = '0.5';
        });

        btnItem.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        btnItem.addEventListener('dragenter', () => {
            btnItem.style.border = `2px solid var(--primary-color, #3B82F6)`;
        });

        btnItem.addEventListener('dragleave', () => {
            btnItem.style.border = `1px solid var(--border-color, #e5e7eb)`;
        });

        btnItem.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const { buttonName: draggedBtnName } = data;
            if (draggedBtnName && draggedBtnName !== btnName) {
                const buttonsKeys = Object.keys(buttonConfig.folders[selectedFolderName].buttons);
                const draggedIndex = buttonsKeys.indexOf(draggedBtnName);
                const targetIndex = buttonsKeys.indexOf(btnName);
                if (draggedIndex > -1 && targetIndex > -1) {
                    const reordered = [...buttonsKeys];
                    reordered.splice(draggedIndex, 1);
                    reordered.splice(targetIndex, 0, draggedBtnName);
                    const newOrderedMap = {};
                    reordered.forEach(k => {
                        newOrderedMap[k] = buttonConfig.folders[selectedFolderName].buttons[k];
                    });
                    buttonConfig.folders[selectedFolderName].buttons = newOrderedMap;
                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                    renderButtonList();
                    console.log(t('🔄 按钮顺序已更新：{{buttonName}} 移动到 {{targetName}} 前。', {
                        buttonName: draggedBtnName,
                        targetName: btnName
                    }));
                    // 更新按钮栏
                    updateButtonContainer();
                }
            }
            btnItem.style.border = `1px solid var(--border-color, #e5e7eb)`;
        });

        btnItem.addEventListener('dragend', () => {
            btnItem.style.opacity = '1';
        });

        btnScrollArea.appendChild(btnItem);
    });

    // 修改：将标签栏和内容区域添加到新的容器中
    contentWithHeaderContainer.appendChild(buttonHeaderBar);
    contentWithHeaderContainer.appendChild(btnScrollArea);

    // 修改：将新容器添加到主容器中
    buttonListContainer.appendChild(contentWithHeaderContainer);

    localizeElement(buttonListContainer);
    scheduleLocalization();
};

    function updateButtonBarHeight(newHeight) {
        const clamped = Math.min(150, Math.max(50, newHeight)); // 限制范围
        buttonConfig.buttonBarHeight = clamped;
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

        // 更新容器高度
        const container = queryUI('.folder-buttons-container');
        if (container) {
            container.style.height = clamped + 'px';
            try {
                updateButtonBarLayout(container, clamped);
            } catch (err) {
                console.warn('更新按钮栏布局失败:', err);
            }
        }
        console.log(`${t('🔧 按钮栏高度已更新为')} ${clamped} px`);
        try {
            applyDomainStyles();
        } catch (err) {
            console.warn(t('应用域名样式失败:'), err);
        }
    }

    const showUnifiedSettingsDialog = () => {
        if (settingsDialogMainContainer) {
            settingsDialogMainContainer.style.minHeight = '';
            settingsDialogMainContainer = null;
        }
        if (currentSettingsOverlay) {
            closeExistingOverlay(currentSettingsOverlay);
            currentSettingsOverlay = null;
        }
        const overlay = document.createElement('div');
        overlay.classList.add('settings-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 11000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('settings-dialog');
        dialog.classList.add('cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 920px;
            max-width: 95vw;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '16px';

        const title = document.createElement('h2');
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.gap = '12px';
        title.style.margin = '0';
        title.style.fontSize = '20px';
        title.style.fontWeight = '600';

        const titleText = document.createElement('span');
        titleText.textContent = t('⚙️ 设置面板');

        const collapseToggleBtn = document.createElement('button');
        collapseToggleBtn.type = 'button';
        collapseToggleBtn.style.cssText = `
            background-color: transparent;
            color: var(--text-color, #333333);
            border: none;
            border-radius: 4px;
            padding: 4px;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;
        collapseToggleBtn.title = t('折叠左侧设置区域');
        collapseToggleBtn.setAttribute('aria-label', collapseToggleBtn.title);
        const collapseToggleSVG = `<svg fill="currentColor" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 7.7148 49.5742 L 48.2852 49.5742 C 53.1836 49.5742 55.6446 47.1367 55.6446 42.3086 L 55.6446 13.6914 C 55.6446 8.8633 53.1836 6.4258 48.2852 6.4258 L 7.7148 6.4258 C 2.8398 6.4258 .3554 8.8398 .3554 13.6914 L .3554 42.3086 C .3554 47.1602 2.8398 49.5742 7.7148 49.5742 Z M 7.7851 45.8008 C 5.4413 45.8008 4.1288 44.5586 4.1288 42.1211 L 4.1288 13.8789 C 4.1288 11.4414 5.4413 10.1992 7.7851 10.1992 L 18.2148 10.1992 L 18.2148 45.8008 Z M 48.2147 10.1992 C 50.5350 10.1992 51.8708 11.4414 51.8708 13.8789 L 51.8708 42.1211 C 51.8708 44.5586 50.5350 45.8008 48.2147 45.8008 L 21.8944 45.8008 L 21.8944 10.1992 Z M 13.7148 18.8945 C 14.4179 18.8945 15.0507 18.2617 15.0507 17.5820 C 15.0507 16.8789 14.4179 16.2696 13.7148 16.2696 L 8.6757 16.2696 C 7.9726 16.2696 7.3632 16.8789 7.3632 17.5820 C 7.3632 18.2617 7.9726 18.8945 8.6757 18.8945 Z M 13.7148 24.9649 C 14.4179 24.9649 15.0507 24.3320 15.0507 23.6289 C 15.0507 22.9258 14.4179 22.3398 13.7148 22.3398 L 8.6757 22.3398 C 7.9726 22.3398 7.3632 22.9258 7.3632 23.6289 C 7.3632 24.3320 7.9726 24.9649 8.6757 24.9649 Z M 13.7148 31.0118 C 14.4179 31.0118 15.0507 30.4258 15.0507 29.7227 C 15.0507 29.0196 14.4179 28.4102 13.7148 28.4102 L 8.6757 28.4102 C 7.9726 28.4102 7.3632 29.0196 7.3632 29.7227 C 7.3632 30.4258 7.9726 31.0118 8.6757 31.0118 Z"></path></g></svg>`;
        setTrustedHTML(collapseToggleBtn, collapseToggleSVG);
        collapseToggleBtn.style.flex = '0 0 auto';
        collapseToggleBtn.style.flexShrink = '0';
        collapseToggleBtn.style.width = '28px';
        collapseToggleBtn.style.height = '28px';
        collapseToggleBtn.style.minWidth = '28px';
        collapseToggleBtn.style.minHeight = '28px';
        collapseToggleBtn.style.maxWidth = '28px';
        collapseToggleBtn.style.maxHeight = '28px';
        collapseToggleBtn.style.padding = '0';
        collapseToggleBtn.style.lineHeight = '0';
        collapseToggleBtn.style.boxSizing = 'border-box';
        collapseToggleBtn.style.aspectRatio = '1 / 1';
        const collapseToggleIcon = collapseToggleBtn.querySelector('svg');
        if (collapseToggleIcon) {
            collapseToggleIcon.style.width = '16px';
            collapseToggleIcon.style.height = '16px';
            collapseToggleIcon.style.display = 'block';
            collapseToggleIcon.style.flex = '0 0 auto';
        }

        // 计数器容器
        const countersContainer = document.createElement('div');
        countersContainer.style.display = 'flex';
        countersContainer.style.gap = '8px';
        countersContainer.style.alignItems = 'center';

        // 文件夹总数计数器（圆形）
        const folderCountBadge = document.createElement('span');
        folderCountBadge.id = 'folderCountBadge';
        folderCountBadge.style.cssText = `
            background-color: var(--primary-color, #3B82F6);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: help;
            transition: all 0.2s ease;
        `;

        // 按钮总数计数器（圆形）
        const totalButtonCountBadge = document.createElement('span');
        totalButtonCountBadge.id = 'totalButtonCountBadge';
        totalButtonCountBadge.style.cssText = `
            background-color: var(--success-color, #22c55e);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            cursor: help;
            transition: all 0.2s ease;
        `;

        // 计算初始数据
        const totalFolders = Object.keys(buttonConfig.folders).length;
        const totalButtons = Object.values(buttonConfig.folders).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons).length;
        }, 0);

        // 设置计数和提示
        folderCountBadge.textContent = totalFolders.toString();
        folderCountBadge.title = t('共有 {{count}} 个文件夹', { count: totalFolders });

        totalButtonCountBadge.textContent = totalButtons.toString();
        totalButtonCountBadge.title = t('所有文件夹共有 {{count}} 个按钮', { count: totalButtons });

        // 添加hover效果
        [folderCountBadge, totalButtonCountBadge].forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'scale(1.1)';
                badge.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
            });
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1)';
                badge.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
        });

        countersContainer.appendChild(folderCountBadge);
        countersContainer.appendChild(totalButtonCountBadge);

        title.appendChild(collapseToggleBtn);
        title.appendChild(titleText);
        title.appendChild(countersContainer);

        const headerBtnsWrapper = document.createElement('div');
        headerBtnsWrapper.style.display = 'flex';
        headerBtnsWrapper.style.gap = '10px';

        // 新建自动化按钮
        const automationBtn = document.createElement('button');
        automationBtn.innerText = t('⚡ 自动化');
        automationBtn.type = 'button';
        automationBtn.style.backgroundColor = 'var(--info-color, #4F46E5)';
        automationBtn.style.color = 'white';
        automationBtn.style.border = 'none';
        automationBtn.style.borderRadius = '4px';
        automationBtn.style.padding = '5px 10px';
        automationBtn.style.cursor = 'pointer';
        automationBtn.style.fontSize = '14px';
        automationBtn.addEventListener('click', () => {
            showAutomationSettingsDialog();
        });
        headerBtnsWrapper.appendChild(automationBtn);

        // 样式管理按钮
        const styleMgmtBtn = document.createElement('button');
        styleMgmtBtn.innerText = t('🎨 网站样式');
        styleMgmtBtn.type = 'button';
        styleMgmtBtn.style.backgroundColor = 'var(--info-color, #4F46E5)';
        styleMgmtBtn.style.color = 'white';
        styleMgmtBtn.style.border = 'none';
        styleMgmtBtn.style.borderRadius = '4px';
        styleMgmtBtn.style.padding = '5px 10px';
        styleMgmtBtn.style.cursor = 'pointer';
        styleMgmtBtn.style.fontSize = '14px';
        styleMgmtBtn.addEventListener('click', () => {
            showStyleSettingsDialog();
        });
        headerBtnsWrapper.appendChild(styleMgmtBtn);

        // 原有创建脚本配置按钮
        const openConfigBtn = createConfigSettingsButton();
        headerBtnsWrapper.appendChild(openConfigBtn);

        // 原有保存关闭按钮
        const saveSettingsBtn = document.createElement('button');
        Object.assign(saveSettingsBtn.style, styles.button, {
            backgroundColor: 'var(--success-color, #22c55e)',
            color: 'white',
            borderRadius: '4px'
        });
        saveSettingsBtn.textContent = t('💾 关闭并保存');
        saveSettingsBtn.addEventListener('click', () => {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

            // 关闭所有相关弹窗
            if (currentConfigOverlay) {
                closeExistingOverlay(currentConfigOverlay);
                currentConfigOverlay = null;
            }

            if (settingsDialogMainContainer) {
                settingsDialogMainContainer.style.minHeight = '';
                settingsDialogMainContainer = null;
            }

            closeExistingOverlay(overlay);
            currentSettingsOverlay = null;
            attachButtons();
        console.log(t('✅ 设置已保存并关闭设置面板。'));
            updateButtonContainer();
        });
        headerBtnsWrapper.appendChild(saveSettingsBtn);

        header.appendChild(title);
        header.appendChild(headerBtnsWrapper);

        const mainContainer = document.createElement('div');
        mainContainer.style.display = 'flex';
        mainContainer.style.flex = '1';
        mainContainer.style.overflow = 'hidden';
        mainContainer.style.flexWrap = 'nowrap';
        mainContainer.style.overflowX = 'auto';
        mainContainer.style.borderTop = `1px solid var(--border-color, #e5e7eb)`;
        settingsDialogMainContainer = mainContainer;

        const folderPanel = document.createElement('div');
        folderPanel.style.display = 'flex';
        folderPanel.style.flexDirection = 'column';
        folderPanel.style.width = '280px';
        folderPanel.style.minWidth = '280px';
        folderPanel.style.marginRight = '12px';
        folderPanel.style.overflowY = 'auto';
        folderPanel.style.padding = '2px 8px 4px 2px';

        // 新增：创建文件夹列表标签栏
        const folderHeaderBar = document.createElement('div');
        folderHeaderBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px 4px 0 0;
            margin: 0 0 -1px 0;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color, #333333);
            border-bottom: 1px solid var(--border-color, #e5e7eb);
            position: sticky;
            top: 0;
            z-index: 1;
        `;

        const leftHeaderLabel = document.createElement('div');
        leftHeaderLabel.textContent = t('文件夹名称');
        leftHeaderLabel.style.flex = '1';
        leftHeaderLabel.style.textAlign = 'left';
        leftHeaderLabel.style.paddingLeft = 'calc(8px + 1em)';

        const rightHeaderLabels = document.createElement('div');
        rightHeaderLabels.style.display = 'flex';
        rightHeaderLabels.style.gap = '0px';
        rightHeaderLabels.style.alignItems = 'center';
        rightHeaderLabels.style.width = '140px'; // 增加宽度以提供更多间距
        rightHeaderLabels.style.paddingLeft = '8px'; // 添加左侧padding，向左移动标签
        rightHeaderLabels.style.paddingRight = '12px'; // 增加右侧间距

        const showLabel = document.createElement('div');
        showLabel.textContent = t('显示');
        showLabel.style.width = '36px'; // 稍微减小宽度
        showLabel.style.textAlign = 'center';
        showLabel.style.fontSize = '12px';
        showLabel.style.marginRight = '4px'; // 添加右边距

        const editLabel = document.createElement('div');
        editLabel.textContent = t('修改');
        editLabel.style.width = '36px'; // 稍微减小宽度
        editLabel.style.textAlign = 'center';
        editLabel.style.fontSize = '12px';
        editLabel.style.marginRight = '4px'; // 添加右边距

        const deleteLabel = document.createElement('div');
        deleteLabel.textContent = t('删除');
        deleteLabel.style.width = '36px'; // 稍微减小宽度
        deleteLabel.style.textAlign = 'center';
        deleteLabel.style.fontSize = '12px';

        rightHeaderLabels.appendChild(showLabel);
        rightHeaderLabels.appendChild(editLabel);
        rightHeaderLabels.appendChild(deleteLabel);

        folderHeaderBar.appendChild(leftHeaderLabel);
        folderHeaderBar.appendChild(rightHeaderLabels);

        folderListContainer = document.createElement('div');
        folderListContainer.style.flex = '1';
        folderListContainer.style.overflowY = 'auto';
        folderListContainer.style.padding = '8px';
        folderListContainer.style.direction = 'rtl';
        folderListContainer.style.border = '1px solid var(--border-color, #e5e7eb)';
        folderListContainer.style.borderTop = 'none';
        folderListContainer.style.borderRadius = '0 0 4px 4px';

        const folderAddContainer = document.createElement('div');
        folderAddContainer.style.padding = '8px';
        folderAddContainer.style.display = 'flex';
        folderAddContainer.style.justifyContent = 'center';

        const addNewFolderBtn = document.createElement('button');
        Object.assign(addNewFolderBtn.style, styles.button, {
            backgroundColor: 'var(--add-color, #fd7e14)',
            color: 'white',
            borderRadius: '4px'
        });
        addNewFolderBtn.textContent = t('+ 新建文件夹');
        addNewFolderBtn.addEventListener('click', () => {
            showFolderEditDialog('', {}, (newFolderName) => {
                selectedFolderName = newFolderName;
                renderFolderList();
                renderButtonList();
                console.log(t('🆕 新建文件夹 "{{folderName}}" 已添加。', { folderName: newFolderName }));
            });
        });
        folderAddContainer.appendChild(addNewFolderBtn);

        folderPanel.appendChild(folderHeaderBar);
        folderPanel.appendChild(folderListContainer);
        folderPanel.appendChild(folderAddContainer);

        buttonListContainer = document.createElement('div');
        buttonListContainer.style.flex = '1';
        buttonListContainer.style.overflowY = 'auto';
        buttonListContainer.style.display = 'flex';
        buttonListContainer.style.flexDirection = 'column';
        buttonListContainer.style.padding = '8px 8px 4px 8px';
        buttonListContainer.style.minWidth = '520px'; // 加宽右侧区域以提供更多内容空间

        const updateFolderPanelVisibility = () => {
            const container = settingsDialogMainContainer || mainContainer;
            if (isSettingsFolderPanelCollapsed) {
                if (container) {
                    const currentHeight = container.offsetHeight;
                    if (currentHeight > 0) {
                        container.style.minHeight = `${currentHeight}px`;
                    } else {
                        window.requestAnimationFrame(() => {
                            if (!isSettingsFolderPanelCollapsed) return;
                            const activeContainer = settingsDialogMainContainer || container;
                            if (!activeContainer) return;
                            const measuredHeight = activeContainer.offsetHeight;
                            if (measuredHeight > 0) {
                                activeContainer.style.minHeight = `${measuredHeight}px`;
                            }
                        });
                    }
                }
                folderPanel.style.display = 'none';
                collapseToggleBtn.title = t('展开左侧设置区域');
                collapseToggleBtn.setAttribute('aria-label', t('展开左侧设置区域'));
            } else {
                folderPanel.style.display = 'flex';
                collapseToggleBtn.title = t('折叠左侧设置区域');
                collapseToggleBtn.setAttribute('aria-label', t('折叠左侧设置区域'));
                if (container) {
                    container.style.minHeight = '';
                }
            }
        };

        collapseToggleBtn.addEventListener('click', () => {
            isSettingsFolderPanelCollapsed = !isSettingsFolderPanelCollapsed;
            updateFolderPanelVisibility();
        });

        updateFolderPanelVisibility();

        renderFolderList();
        renderButtonList();

        mainContainer.appendChild(folderPanel);
        mainContainer.appendChild(buttonListContainer);

        const footer = document.createElement('div');
        footer.style.display = 'none';
        dialog.appendChild(header);
        dialog.appendChild(mainContainer);
        dialog.appendChild(footer);

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentSettingsOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);
    };
/* -------------------------------------------------------------------------- *
 * Module 04 · Script config (脚本配置)
 * -------------------------------------------------------------------------- */

    let currentDiffOverlay = null;
    let currentConfigOverlay = null;

    function exportConfig() {
        const date = new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        const fileName = `[Chat] Template Text Folders「${yyyy}-${mm}-${dd}」「${hh}：${minutes}：${ss}」.json`;
        const dataStr = JSON.stringify(buttonConfig, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        console.log(t('📤 配置已导出。'));
    }

    function showImportDiffPreview(currentConfig, importedConfig) {
        if (currentDiffOverlay) {
            closeExistingOverlay(currentDiffOverlay);
            currentDiffOverlay = null;
        }

        const overlay = document.createElement('div');
        overlay.classList.add('import-diff-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.55));
            backdrop-filter: blur(3px);
            z-index: 14000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('import-diff-dialog');
        dialog.classList.add('cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 6px;
            padding: 8px 18px 16px;
            box-shadow: 0 18px 36px var(--shadow-color, rgba(15, 23, 42, 0.35));
            border: 1px solid var(--border-color, #e5e7eb);
            width: 960px;
            max-width: 96vw;
            max-height: 82vh;
            display: flex;
            flex-direction: column;
            transform: scale(0.95);
            transition: transform 0.3s ease;
            overflow: hidden;
        `;

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentDiffOverlay = overlay;

        const cleanupFns = [];
        const cleanup = () => {
            while (cleanupFns.length) {
                const fn = cleanupFns.pop();
                try {
                    fn();
                } catch (error) {
                    console.warn('[Chat] Template Text Folders diff preview cleanup failed:', error);
                }
            }
        };

        const closeDiffOverlay = () => {
            if (overlay) {
                overlay.__cttfCloseDiff = null;
            }
            if (!overlay || !overlay.isConnected) {
                currentDiffOverlay = null;
                cleanup();
                return;
            }
            dialog.style.transform = 'scale(0.95)';
            closeExistingOverlay(overlay);
            currentDiffOverlay = null;
            cleanup();
        };
        overlay.__cttfCloseDiff = closeDiffOverlay;

        const onKeydown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                closeDiffOverlay();
            }
        };
        document.addEventListener('keydown', onKeydown);
        cleanupFns.push(() => document.removeEventListener('keydown', onKeydown));

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            margin-bottom: 6px;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 18px;
            font-weight: 600;
            color: var(--text-color, #333333);
        `;
        title.textContent = t('🔍 配置差异预览');

        const headerActions = document.createElement('div');
        headerActions.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.style.cssText = `
            background-color: transparent;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-color, #333333);
            transition: background-color 0.2s ease;
        `;
        closeBtn.textContent = '✕';
        closeBtn.setAttribute('aria-label', t('关闭'));
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = 'rgba(148, 163, 184, 0.2)';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });
        closeBtn.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            closeDiffOverlay();
        });

        headerActions.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(headerActions);
        dialog.appendChild(header);

        const overlayClickHandler = (event) => {
            if (event.target === overlay) {
                event.stopPropagation();
                event.preventDefault();
            }
        };
        overlay.addEventListener('click', overlayClickHandler);
        cleanupFns.push(() => overlay.removeEventListener('click', overlayClickHandler));

        dialog.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        const safeClone = (value) => {
            if (value == null) return value;
            try {
                return JSON.parse(JSON.stringify(value));
            } catch (error) {
                console.warn('[Chat] Template Text Folders diff preview clone failed:', error);
                return value;
            }
        };

        const normalizeConfig = (config) => {
            const safe = (config && typeof config === 'object') ? config : {};
            const folders = safe.folders && typeof safe.folders === 'object' ? safeClone(safe.folders) || {} : {};
            const folderOrder = Array.isArray(safe.folderOrder) ? [...safe.folderOrder] : Object.keys(folders);
            return { folders, folderOrder };
        };

        const toComparable = (value) => {
            if (value === null || typeof value !== 'object') {
                return value;
            }
            if (Array.isArray(value)) {
                return value.map((item) => toComparable(item));
            }
            const sorted = {};
            Object.keys(value).sort().forEach((key) => {
                sorted[key] = toComparable(value[key]);
            });
            return sorted;
        };

        const deepEqual = (a, b) => {
            if (a === b) return true;
            try {
                return JSON.stringify(toComparable(a)) === JSON.stringify(toComparable(b));
            } catch (error) {
                console.warn('[Chat] Template Text Folders diff preview compare failed:', error);
                return false;
            }
        };

        const createBadge = (label, variant = 'neutral') => {
            const badge = document.createElement('span');
            badge.textContent = label;
            badge.style.cssText = `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 4px 10px;
                border-radius: 999px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.01em;
                white-space: nowrap;
            `;
            const variants = {
                added: {
                    background: 'rgba(34, 197, 94, 0.15)',
                    color: 'var(--success-color, #22c55e)',
                    border: '1px solid rgba(34, 197, 94, 0.3)'
                },
                removed: {
                    background: 'rgba(248, 113, 113, 0.15)',
                    color: 'var(--danger-color, #f87171)',
                    border: '1px solid rgba(248, 113, 113, 0.3)'
                },
                changed: {
                    background: 'rgba(59, 130, 246, 0.14)',
                    color: 'var(--info-color, #4F46E5)',
                    border: '1px solid rgba(59, 130, 246, 0.28)'
                },
                neutral: {
                    background: 'var(--button-bg, #f3f4f6)',
                    color: 'var(--text-color, #333333)',
                    border: '1px solid var(--border-color, #e5e7eb)'
                }
            };
            const style = variants[variant] || variants.neutral;
            badge.style.background = style.background;
            badge.style.color = style.color;
            badge.style.border = style.border;
            return badge;
        };

        const statusVariantMap = {
            added: 'added',
            removed: 'removed',
            changed: 'changed',
            unchanged: 'neutral'
        };

        const statusTextMap = {
            added: '新增',
            removed: '移除',
            changed: '变更'
        };

        const folderCountLabelMap = {
            added: '+{{count}}',
            removed: '移除文件夹 {{count}} 个',
            changed: '修改：{{count}}'
        };

        const buttonCountLabelMap = {
            added: '+{{count}}',
            removed: '-{{count}}',
            changed: '修改：{{count}}'
        };

        const normalizeButtonNameForDiff = (value) => {
            if (value == null) return '';
            const str = typeof value === 'string' ? value : String(value);
            const normalized = typeof str.normalize === 'function' ? str.normalize('NFKC') : str;
            return normalized.replace(/\s+/g, ' ').trim();
        };

        const computeButtonDiffs = (currentFolderConfig, importedFolderConfig) => {
            const result = [];
            const currentButtons = currentFolderConfig && currentFolderConfig.buttons && typeof currentFolderConfig.buttons === 'object'
                ? currentFolderConfig.buttons
                : {};
            const importedButtons = importedFolderConfig && importedFolderConfig.buttons && typeof importedFolderConfig.buttons === 'object'
                ? importedFolderConfig.buttons
                : {};
            const currentOrder = Object.keys(currentButtons);
            const importedOrder = Object.keys(importedButtons);

            const importedBuckets = new Map();
            importedOrder.forEach((btnName) => {
                const normalized = normalizeButtonNameForDiff(btnName);
                if (!importedBuckets.has(normalized)) {
                    importedBuckets.set(normalized, []);
                }
                importedBuckets.get(normalized).push(btnName);
            });

            const usedImportedNames = new Set();

            currentOrder.forEach((btnName) => {
                const normalized = normalizeButtonNameForDiff(btnName);
                const bucket = importedBuckets.get(normalized) || [];
                const matchedName = bucket.find((candidate) => !usedImportedNames.has(candidate)) || null;
                if (matchedName) {
                    usedImportedNames.add(matchedName);
                }
                const currentBtn = currentButtons[btnName] || null;
                const importedBtn = matchedName ? (importedButtons[matchedName] || null) : null;
                const fieldsChanged = [];
                if (currentBtn && importedBtn) {
                    const keys = new Set([
                        ...Object.keys(currentBtn),
                        ...Object.keys(importedBtn)
                    ]);
                    keys.forEach((key) => {
                        if (!deepEqual(currentBtn[key], importedBtn[key])) {
                            fieldsChanged.push(key);
                        }
                    });
                }
                const orderChanged = currentBtn && importedBtn
                    ? currentOrder.indexOf(btnName) !== importedOrder.indexOf(matchedName)
                    : false;
                const trimmedCurrent = typeof btnName === 'string' ? btnName.trim() : btnName;
                const trimmedImported = typeof matchedName === 'string' ? matchedName.trim() : matchedName;
                const renamed = Boolean(currentBtn && importedBtn && trimmedCurrent !== trimmedImported);
                let status = 'unchanged';
                if (!importedBtn) {
                    status = 'removed';
                } else if (fieldsChanged.length || orderChanged || renamed) {
                    status = 'changed';
                }
                result.push({
                    id: normalized || btnName,
                    name: btnName,
                    currentName: btnName,
                    importedName: matchedName,
                    current: currentBtn,
                    imported: importedBtn,
                    fieldsChanged,
                    orderChanged,
                    renamed,
                    status
                });
            });

            importedOrder.forEach((btnName) => {
                if (usedImportedNames.has(btnName)) {
                    return;
                }
                const normalized = normalizeButtonNameForDiff(btnName);
                const importedBtn = importedButtons[btnName] || null;
                result.push({
                    id: normalized || btnName,
                    name: btnName,
                    currentName: null,
                    importedName: btnName,
                    current: null,
                    imported: importedBtn,
                    fieldsChanged: [],
                    orderChanged: false,
                    renamed: false,
                    status: 'added'
                });
            });

            return {
                list: result,
                currentOrder,
                importedOrder
            };
        };

        const current = normalizeConfig(currentConfig);
        const next = normalizeConfig(importedConfig);

        const allFolderNames = [];
        const pushFolderName = (name) => {
            if (!name || typeof name !== 'string') return;
            if (!allFolderNames.includes(name)) {
                allFolderNames.push(name);
            }
        };
        current.folderOrder.forEach(pushFolderName);
        next.folderOrder.forEach(pushFolderName);
        Object.keys(current.folders).forEach(pushFolderName);
        Object.keys(next.folders).forEach(pushFolderName);

        const folderDiffs = [];
        const summary = {
            folder: { added: 0, removed: 0, changed: 0 },
            button: { added: 0, removed: 0, changed: 0 }
        };

        allFolderNames.forEach((folderName) => {
            const currentFolder = current.folders[folderName] || null;
            const importedFolder = next.folders[folderName] || null;
            const currentIndex = current.folderOrder.indexOf(folderName);
            const importedIndex = next.folderOrder.indexOf(folderName);
            const metaChanges = [];
            if (currentFolder && importedFolder) {
                ['color', 'textColor', 'hidden'].forEach((key) => {
                    if (!deepEqual(currentFolder[key], importedFolder[key])) {
                        metaChanges.push(key);
                    }
                });
            }
            const { list: buttonDiffs, currentOrder, importedOrder } = computeButtonDiffs(currentFolder, importedFolder);
            const buttonCounts = {
                added: buttonDiffs.filter((item) => item.status === 'added').length,
                removed: buttonDiffs.filter((item) => item.status === 'removed').length,
                changed: buttonDiffs.filter((item) => item.status === 'changed').length
            };
            summary.button.added += buttonCounts.added;
            summary.button.removed += buttonCounts.removed;
            summary.button.changed += buttonCounts.changed;

            const hasOrderChange = currentFolder && importedFolder && currentIndex !== importedIndex;

            let status = 'unchanged';
            if (!currentFolder) {
                status = 'added';
                summary.folder.added += 1;
            } else if (!importedFolder) {
                status = 'removed';
                summary.folder.removed += 1;
            } else if (metaChanges.length || hasOrderChange || buttonCounts.added || buttonCounts.removed || buttonCounts.changed) {
                status = 'changed';
                summary.folder.changed += 1;
            }

            folderDiffs.push({
                name: folderName,
                current: currentFolder,
                imported: importedFolder,
                currentIndex,
                importedIndex,
                metaChanges,
                hasOrderChange,
                buttonDiffs,
                buttonOrder: {
                    current: currentOrder,
                    imported: importedOrder
                },
                buttonCounts,
                status
            });
        });

        const folderDiffMap = new Map(folderDiffs.map((item) => [item.name, item]));
        let selectedFolderName = (folderDiffs.find((item) => item.status !== 'unchanged') || folderDiffs[0] || {}).name || null;

        const folderPanelWidth = 260;
        const layoutGap = 16;

        const summaryBar = document.createElement('div');
        const applySummaryGridLayout = () => {
            summaryBar.style.display = 'grid';
            summaryBar.style.gridTemplateColumns = `${folderPanelWidth}px ${layoutGap}px 1fr`;
            summaryBar.style.alignItems = 'center';
            summaryBar.style.columnGap = '0';
            summaryBar.style.rowGap = '8px';
            summaryBar.style.marginBottom = '8px';
        };
        applySummaryGridLayout();

        const summaryGroupStyle = `
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
        `;

        const folderSummary = document.createElement('div');
        folderSummary.style.cssText = summaryGroupStyle;
        folderSummary.style.gridColumn = '1 / 2';

        const buttonSummary = document.createElement('div');
        buttonSummary.style.cssText = summaryGroupStyle;
        buttonSummary.style.gridColumn = '3 / 4';

        summaryBar.appendChild(folderSummary);
        summaryBar.appendChild(buttonSummary);

        setTrustedHTML(folderSummary, '');
        setTrustedHTML(buttonSummary, '');

        let folderBadgeCount = 0;
        let buttonBadgeCount = 0;

        ['added', 'removed', 'changed'].forEach((key) => {
            const count = summary.folder[key];
            if (count > 0) {
                folderSummary.appendChild(createBadge(t(folderCountLabelMap[key], { count }), statusVariantMap[key]));
                folderBadgeCount += 1;
            }
        });

        ['added', 'removed', 'changed'].forEach((key) => {
            const count = summary.button[key];
            if (count > 0) {
                buttonSummary.appendChild(createBadge(t(buttonCountLabelMap[key], { count }), statusVariantMap[key]));
                buttonBadgeCount += 1;
            }
        });

        if (!folderBadgeCount && !buttonBadgeCount) {
            // Trusted Types: always clear via setTrustedHTML, never innerHTML, to stay compatible with strict hosts (e.g. Google).
            setTrustedHTML(summaryBar, '');
            summaryBar.style.display = 'flex';
            summaryBar.style.flexWrap = 'wrap';
            summaryBar.style.alignItems = 'center';
            summaryBar.style.justifyContent = 'center';
            summaryBar.style.gap = '8px';
            summaryBar.style.marginBottom = '8px';
            const noDiff = document.createElement('span');
            noDiff.textContent = t('暂无差异，导入配置的结构与当前一致。');
            noDiff.style.color = 'var(--muted-text-color, #6b7280)';
            noDiff.style.fontSize = '13px';
            summaryBar.appendChild(noDiff);
        } else {
            applySummaryGridLayout();
            let spacer = summaryBar.querySelector('.cttf-summary-spacer');
            if (!spacer) {
                spacer = document.createElement('div');
                spacer.className = 'cttf-summary-spacer';
                spacer.style.gridColumn = '2 / 3';
                summaryBar.appendChild(spacer);
            }
            folderSummary.style.display = folderBadgeCount ? 'flex' : 'none';
            buttonSummary.style.display = buttonBadgeCount ? 'flex' : 'none';
        }

        dialog.appendChild(summaryBar);

        const layoutContainer = document.createElement('div');
        layoutContainer.style.cssText = `
            display: flex;
            gap: 16px;
            flex: 1;
            min-height: 0;
        `;
        dialog.appendChild(layoutContainer);

        const folderPanel = document.createElement('div');
        folderPanel.style.cssText = `
            flex: 0 0 260px;
            display: flex;
            flex-direction: column;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 6px;
            overflow: hidden;
        `;
        layoutContainer.appendChild(folderPanel);

        const folderPanelHeader = document.createElement('div');
        folderPanelHeader.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 8px;
            background-color: var(--button-bg, #f3f4f6);
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 4px 4px 0 0;
            margin: 0 0 -1px 0;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color, #333333);
            position: sticky;
            top: 0;
            z-index: 1;
        `;
        folderPanelHeader.textContent = t('文件夹');
        folderPanel.appendChild(folderPanelHeader);

        const folderList = document.createElement('div');
        folderList.style.cssText = `
            flex: 1;
            overflow: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
        folderList.classList.add('cttf-scrollable');
        folderList.style.direction = 'rtl';
        folderPanel.appendChild(folderList);

        const detailPanel = document.createElement('div');
        detailPanel.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--border-color, #e5e7eb);
            border-radius: 6px;
            background-color: var(--dialog-bg, #ffffff);
            overflow: hidden;
        `;
        layoutContainer.appendChild(detailPanel);

        const renderFolderList = () => {
            setTrustedHTML(folderList, '');
            if (!folderDiffs.length) {
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    padding: 16px;
                    font-size: 13px;
                    color: var(--muted-text-color, #6b7280);
                    text-align: center;
                    border: 1px dashed var(--border-color, #e5e7eb);
                    border-radius: 6px;
                `;
                placeholder.textContent = t('暂无差异，导入配置的结构与当前一致。');
                folderList.appendChild(placeholder);
                return;
            }

            folderDiffs.forEach((item) => {
                const folderButton = document.createElement('button');
                folderButton.type = 'button';
                folderButton.dataset.folder = item.name;
                folderButton.style.cssText = `
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    padding: 10px 12px;
                    border-radius: 6px;
                    border: 1px solid ${selectedFolderName === item.name ? 'var(--primary-color, #3B82F6)' : 'var(--border-color, #e5e7eb)'};
                    background-color: ${selectedFolderName === item.name ? 'rgba(79, 70, 229, 0.08)' : 'var(--dialog-bg, #ffffff)'};
                    cursor: pointer;
                    transition: background-color 0.2s ease, border-color 0.2s ease;
                    color: var(--text-color, #333333);
                `;
                folderButton.style.direction = 'ltr';
                folderButton.addEventListener('click', () => {
                    selectedFolderName = item.name;
                    renderFolderList();
                    renderFolderDetail();
                });

                const left = document.createElement('div');
                left.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    min-width: 0;
                `;

                const nameEl = document.createElement('span');
                nameEl.textContent = item.name;
                nameEl.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    justify-content: flex-start;
                    flex: 0 1 auto;
                    font-size: 14px;
                    font-weight: ${item.status !== 'unchanged' ? '600' : '500'};
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding: 4px 10px;
                    border-radius: 4px;
                    border: none;
                    min-width: 0;
                    max-width: 100%;
                    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
                    background-color: rgba(148, 163, 184, 0.25);
                    pointer-events: none;
                `;

                let folderBackground = '#64748b';
                if (item.current && item.imported) {
                    if (deepEqual(item.current.color, item.imported.color)) {
                        folderBackground = item.current.color || folderBackground;
                    } else {
                        const currentColor = item.current.color || folderBackground;
                        const importedColor = item.imported.color || folderBackground;
                        folderBackground = `linear-gradient(90deg, ${currentColor} 0%, ${currentColor} 50%, ${importedColor} 50%, ${importedColor} 100%)`;
                    }
                } else if (item.imported) {
                    folderBackground = item.imported.color || folderBackground;
                } else if (item.current) {
                    folderBackground = item.current.color || folderBackground;
                }
                nameEl.style.background = folderBackground;

                const resolvedTextColor = (item.current && item.current.textColor)
                    || (item.imported && item.imported.textColor)
                    || 'var(--text-color, #333333)';
                nameEl.style.color = resolvedTextColor;

                left.appendChild(nameEl);

                const right = document.createElement('div');
                right.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    flex-shrink: 0;
                `;

                if (item.status !== 'unchanged') {
                    const statusVariant = statusVariantMap[item.status];
                    let statusLabel = t(statusTextMap[item.status]);
                    if (item.status === 'changed') {
                        const detailLabels = [];
                        if (item.hasOrderChange) {
                            detailLabels.push(t('顺序'));
                        }
                        if (item.metaChanges.length) {
                            detailLabels.push(t('设置'));
                        }
                        if (detailLabels.length) {
                            const separator = isNonChineseLocale() ? ', ' : '、';
                            const colon = isNonChineseLocale() ? ': ' : '：';
                            statusLabel = `${statusLabel}${colon}${detailLabels.join(separator)}`;
                        }
                    }
                    right.appendChild(createBadge(statusLabel, statusVariant));
                }

                const buttonHiglight = item.status !== 'unchanged' || item.hasOrderChange || item.metaChanges.length;
                if (buttonHiglight) {
                    folderButton.setAttribute('data-diff', 'true');
                }

                folderButton.appendChild(left);
                folderButton.appendChild(right);
                folderList.appendChild(folderButton);
            });
        };

        const renderFolderDetail = () => {
            setTrustedHTML(detailPanel, '');
            if (!selectedFolderName) {
                const emptyState = document.createElement('div');
                emptyState.style.cssText = `
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: var(--muted-text-color, #6b7280);
                    padding: 24px;
                    text-align: center;
                `;
                emptyState.textContent = folderDiffs.length
                    ? t('请选择左侧文件夹查看差异')
                    : t('暂无差异，导入配置的结构与当前一致。');
                detailPanel.appendChild(emptyState);
                return;
            }

            const folderData = folderDiffMap.get(selectedFolderName);
            if (!folderData) {
                const missingState = document.createElement('div');
                missingState.style.cssText = `
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: var(--muted-text-color, #6b7280);
                    padding: 24px;
                    text-align: center;
                `;
                missingState.textContent = t('暂无差异，导入配置的结构与当前一致。');
                detailPanel.appendChild(missingState);
                return;
            }

            const detailHeader = document.createElement('div');
            detailHeader.style.cssText = `
                padding: 16px 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                flex-wrap: wrap;
            `;

            const headerLeft = document.createElement('div');
            headerLeft.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                font-weight: 600;
            `;
            headerLeft.textContent = selectedFolderName;

            const headerBadges = document.createElement('div');
            headerBadges.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            `;

            // 避免与左侧列表重复提示，仅保留按钮数量类徽标
            ['added', 'removed', 'changed'].forEach((key) => {
                const count = folderData.buttonCounts[key];
                if (count > 0) {
                    headerBadges.appendChild(createBadge(t(buttonCountLabelMap[key], { count }), statusVariantMap[key]));
                }
            });

            detailHeader.appendChild(headerLeft);
            detailHeader.appendChild(headerBadges);
            detailPanel.appendChild(detailHeader);

            if (!folderData.current) {
                const info = document.createElement('div');
                info.style.cssText = `
                    padding: 12px 20px;
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    font-size: 13px;
                    color: var(--success-color, #22c55e);
                    background-color: rgba(34, 197, 94, 0.12);
                `;
                info.textContent = t('导入后将新增此文件夹');
                detailPanel.appendChild(info);
            } else if (!folderData.imported) {
                const info = document.createElement('div');
                info.style.cssText = `
                    padding: 12px 20px;
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    font-size: 13px;
                    color: var(--danger-color, #f87171);
                    background-color: rgba(248, 113, 113, 0.12);
                `;
                info.textContent = t('导入后将移除此文件夹');
                detailPanel.appendChild(info);
            }

            const columnsContainer = document.createElement('div');
            columnsContainer.style.cssText = `
                flex: 1;
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 16px;
                padding: 20px;
                min-height: 0;
            `;
            detailPanel.appendChild(columnsContainer);

            const buttonDiffMap = new Map();
            folderData.buttonDiffs.forEach((item) => {
                if (item.currentName) {
                    buttonDiffMap.set(item.currentName, item);
                }
                if (item.importedName) {
                    buttonDiffMap.set(item.importedName, item);
                }
                if (!item.currentName && !item.importedName) {
                    buttonDiffMap.set(item.name || item.id, item);
                }
            });

            const createColumn = (label, buttons, order, side) => {
                const column = document.createElement('div');
                column.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 6px;
                    overflow: hidden;
                    background-color: var(--button-bg, #f3f4f6);
                `;

                const columnHeader = document.createElement('div');
                columnHeader.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 8px;
                    background-color: var(--button-bg, #f3f4f6);
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 4px 4px 0 0;
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--text-color, #333333);
                    position: sticky;
                    top: 0;
                    z-index: 1;
                `;
                columnHeader.textContent = label;
                column.appendChild(columnHeader);

                const list = document.createElement('div');
                list.style.cssText = `
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    padding: 10px;
                    overflow: auto;
                `;
                list.classList.add('cttf-scrollable');
                column.appendChild(list);

                if (!order.length) {
                    const empty = document.createElement('div');
                    empty.style.cssText = `
                        padding: 20px;
                        font-size: 13px;
                        color: var(--muted-text-color, #6b7280);
                        text-align: center;
                    `;
                    empty.textContent = side === 'current'
                        ? t('当前配置中无此文件夹。')
                        : t('导入配置中无此文件夹。');
                    list.appendChild(empty);
                    return column;
                }

                order.forEach((btnName) => {
                    const diffInfo = buttonDiffMap.get(btnName);
                    const btnConfig = buttons[btnName];
                    const highlightStatus = diffInfo ? diffInfo.status : 'unchanged';
                    const backgroundColor = (() => {
                        if (!diffInfo || highlightStatus === 'unchanged') {
                            return 'var(--dialog-bg, #ffffff)';
                        }
                        if (highlightStatus === 'added' && side === 'imported') {
                            return 'rgba(34, 197, 94, 0.12)';
                        }
                        if (highlightStatus === 'removed' && side === 'current') {
                            return 'rgba(248, 113, 113, 0.12)';
                        }
                        if (highlightStatus === 'changed') {
                            return 'rgba(59, 130, 246, 0.12)';
                        }
                        return 'var(--dialog-bg, #ffffff)';
                    })();
                    const borderColor = (() => {
                        if (!diffInfo || highlightStatus === 'unchanged') {
                            return 'var(--border-color, #e5e7eb)';
                        }
                        if (highlightStatus === 'added' && side === 'imported') {
                            return 'rgba(34, 197, 94, 0.5)';
                        }
                        if (highlightStatus === 'removed' && side === 'current') {
                            return 'rgba(248, 113, 113, 0.5)';
                        }
                        if (highlightStatus === 'changed') {
                            return 'rgba(59, 130, 246, 0.4)';
                        }
                        return 'var(--border-color, #e5e7eb)';
                    })();

                    const item = document.createElement('div');
                    item.style.cssText = `
                        border: 1px solid ${borderColor};
                        border-radius: 6px;
                        padding: 6px 8px;
                        display: flex;
                        flex-direction: column;
                        gap: 3px;
                        background-color: ${backgroundColor};
                    `;

                    const row = document.createElement('div');
                    row.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 4px;
                    `;

                    const rowLeft = document.createElement('div');
                    rowLeft.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        min-width: 0;
                    `;
                    const previewButton = createCustomButtonElement(btnName, btnConfig || {});
                    previewButton.style.marginBottom = '0';
                    previewButton.style.marginRight = '0';
                    previewButton.style.cursor = 'default';
                    previewButton.style.flexShrink = '1';
                    previewButton.style.minWidth = '0';
                    previewButton.style.maxWidth = '100%';
                    previewButton.style.whiteSpace = 'normal';
                    previewButton.style.wordBreak = 'break-word';
                    previewButton.style.overflow = 'visible';
                    previewButton.style.lineHeight = '1.4';
                    previewButton.style.overflowWrap = 'anywhere';
                    previewButton.style.display = 'inline-flex';
                    previewButton.style.flexWrap = 'wrap';
                    previewButton.style.alignItems = 'center';
                    previewButton.style.justifyContent = 'flex-start';
                    previewButton.style.columnGap = '6px';
                    previewButton.style.rowGap = '2px';
                    previewButton.style.pointerEvents = 'none';
                    previewButton.setAttribute('tabindex', '-1');
                    previewButton.setAttribute('aria-hidden', 'true');

                    const fallbackTextColor = 'var(--text-color, #333333)';
                    if (!btnConfig || !btnConfig.textColor) {
                        previewButton.style.color = fallbackTextColor;
                    }
                    if (!btnConfig || !btnConfig.color) {
                        previewButton.style.backgroundColor = 'rgba(148, 163, 184, 0.25)';
                        previewButton.style.border = '1px solid rgba(100, 116, 139, 0.35)';
                    }

                    rowLeft.appendChild(previewButton);

                    const rowRight = document.createElement('div');
                    rowRight.style.cssText = `
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        flex-shrink: 0;
                    `;
                        if (diffInfo && diffInfo.status !== 'unchanged') {
                            const statusVariant = statusVariantMap[diffInfo.status] || 'neutral';
                            let badgeLabel = t(statusTextMap[diffInfo.status]);
                            if (diffInfo.status === 'changed') {
                                const changeTypeParts = [];
                                if (diffInfo.renamed) {
                                    changeTypeParts.push(t('重命名'));
                                }
                                if (diffInfo.fieldsChanged.length) {
                                    changeTypeParts.push(t('字段'));
                                }
                                if (diffInfo.orderChanged) {
                                    changeTypeParts.push(t('顺序'));
                                }
                                if (changeTypeParts.length) {
                                    const typesText = changeTypeParts.join(isNonChineseLocale() ? ', ' : '、');
                                    badgeLabel = t('变更：{{types}}', { types: typesText });
                                }
                            }
                            rowRight.appendChild(createBadge(badgeLabel, statusVariant));
                        }

                    row.appendChild(rowLeft);
                    row.appendChild(rowRight);
                    item.appendChild(row);

                    if (diffInfo && diffInfo.fieldsChanged.length) {
                        const fieldsInfo = document.createElement('div');
                        fieldsInfo.style.cssText = `
                            font-size: 12px;
                            color: var(--muted-text-color, #6b7280);
                        `;
                        fieldsInfo.textContent = t('变更字段：{{fields}}', { fields: diffInfo.fieldsChanged.join(', ') });
                        item.appendChild(fieldsInfo);
                    }

                    list.appendChild(item);
                });

                return column;
            };

            const currentButtons = folderData.current && folderData.current.buttons ? folderData.current.buttons : {};
            const importedButtons = folderData.imported && folderData.imported.buttons ? folderData.imported.buttons : {};

            columnsContainer.appendChild(createColumn(t('当前配置'), currentButtons, folderData.buttonOrder.current || [], 'current'));
            columnsContainer.appendChild(createColumn(t('导入配置'), importedButtons, folderData.buttonOrder.imported || [], 'imported'));
        };

        renderFolderList();
        renderFolderDetail();

        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);
    }

    // 新增：显示导入配置预览确认对话框
    function showImportConfirmDialog(importedConfig, onConfirm, onCancel) {
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }

        // 计算导入配置的统计信息
        const importFolderCount = Object.keys(importedConfig.folders || {}).length;
        const importButtonCount = Object.values(importedConfig.folders || {}).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons || {}).length;
        }, 0);

        // 计算当前配置的统计信息
        const currentFolderCount = Object.keys(buttonConfig.folders).length;
        const currentButtonCount = Object.values(buttonConfig.folders).reduce((sum, folder) => {
            return sum + Object.keys(folder.buttons).length;
        }, 0);

        const overlay = document.createElement('div');
        overlay.classList.add('import-confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 13000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('import-confirm-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 480px;
            max-width: 90vw;
            transform: scale(0.95);
            position: relative;
            z-index: 13001;
        `;

        setTrustedHTML(dialog, `
            <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
            ">
                <h3 style="
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: var(--info-color, #4F46E5);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    ${t('📥 确认导入配置')}
                </h3>
            </div>

            <div style="
                background-color: var(--button-bg, #f3f4f6);
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 20px;
                border: 1px solid var(--border-color, #e5e7eb);
            ">
                <h4 style="
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-color, #333333);
                ">${t('📊 配置对比')}</h4>

                <div style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 12px;
                ">
                    <div style="
                        background-color: var(--dialog-bg, #ffffff);
                        padding: 12px;
                        border-radius: 6px;
                        border: 1px solid var(--border-color, #e5e7eb);
                    ">
                        <div style="
                            font-size: 12px;
                            color: var(--text-color, #666);
                            margin-bottom: 8px;
                            font-weight: 500;
                        ">${t('当前配置')}</div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="
                                background-color: var(--primary-color, #3B82F6);
                                color: white;
                                border-radius: 50%;
                                width: 18px;
                                height: 18px;
                                font-size: 10px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">${currentFolderCount}</span>
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('个文件夹')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="
                                background-color: var(--success-color, #22c55e);
                                color: white;
                                border-radius: 50%;
                                width: 18px;
                                height: 18px;
                                font-size: 10px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">${currentButtonCount}</span>
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('个按钮')}</span>
                        </div>
                    </div>

                    <div style="
                        background-color: var(--dialog-bg, #ffffff);
                        padding: 12px;
                        border-radius: 6px;
                        border: 1px solid var(--info-color, #4F46E5);
                        position: relative;
                    ">
                        <div style="
                            font-size: 12px;
                            color: var(--info-color, #4F46E5);
                            margin-bottom: 8px;
                            font-weight: 600;
                        ">${t('导入配置')}</div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <span style="
                                background-color: var(--primary-color, #3B82F6);
                                color: white;
                                border-radius: 50%;
                                width: 18px;
                                height: 18px;
                                font-size: 10px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">${importFolderCount}</span>
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('个文件夹')}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="
                                background-color: var(--success-color, #22c55e);
                                color: white;
                                border-radius: 50%;
                                width: 18px;
                                height: 18px;
                                font-size: 10px;
                                font-weight: 600;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">${importButtonCount}</span>
                            <span style="font-size: 13px; color: var(--text-color, #333);">${t('个按钮')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style="
                background-color: #fef3c7;
                border: 1px solid #fbbf24;
                border-radius: 6px;
                padding: 12px;
                margin-bottom: 20px;
            ">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #92400e;
                    font-size: 13px;
                ">
                    <span style="font-size: 16px;">⚠️</span>
                    <strong>${t('注意：导入配置将完全替换当前配置，此操作无法撤销！')}</strong>
                </div>
            </div>

            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
            ">
                <button id="previewImportDiff" style="
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 6px;
                    padding: 8px 16px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                ">${t('查看差异')}</button>
                <div style="display: flex; gap: 12px;">
                    <button id="cancelImport" style="
                        background-color: var(--cancel-color, #6B7280);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        padding: 8px 16px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    ">${t('取消')}</button>
                    <button id="confirmImport" style="
                        background-color: var(--info-color, #4F46E5);
                        color: white;
                        border: none;
                        border-radius: 6px;
                        padding: 8px 16px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        transition: all 0.2s ease;
                    ">${t('确认导入')}</button>
                </div>
            </div>
        `);

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        // 按钮事件
        const previewDiffBtn = dialog.querySelector('#previewImportDiff');
        if (previewDiffBtn) {
            previewDiffBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                try {
                    showImportDiffPreview(buttonConfig, importedConfig);
                } catch (error) {
                    console.error('[Chat] Template Text Folders 打开配置差异预览失败:', error);
                }
            });
        }

        dialog.querySelector('#cancelImport').addEventListener('click', () => {
            if (currentDiffOverlay) {
                if (typeof currentDiffOverlay.__cttfCloseDiff === 'function') {
                    currentDiffOverlay.__cttfCloseDiff();
                } else {
                    closeExistingOverlay(currentDiffOverlay);
                    currentDiffOverlay = null;
                }
            }
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
            if (onCancel) onCancel();
        });

        dialog.querySelector('#confirmImport').addEventListener('click', () => {
            if (currentDiffOverlay) {
                if (typeof currentDiffOverlay.__cttfCloseDiff === 'function') {
                    currentDiffOverlay.__cttfCloseDiff();
                } else {
                    closeExistingOverlay(currentDiffOverlay);
                    currentDiffOverlay = null;
                }
            }
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;

            // 添加短暂延时，确保弹窗关闭动画完成后再执行导入
            setTimeout(() => {
                if (onConfirm) {
                    onConfirm();
                }
            }, 100);
        });

        // 点击外部忽略
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                e.stopPropagation();
                e.preventDefault();
            }
        });
    }

    function importConfig(rerenderFn) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const importedConfig = JSON.parse(evt.target.result);
                    if (importedConfig && typeof importedConfig === 'object') {
                        if (!importedConfig.folders || !importedConfig.folderOrder) {
                            alert(t('导入的配置文件无效！缺少必要字段。'));
                            return;
                        }

                        // 显示预览确认对话框
                        showImportConfirmDialog(
                            importedConfig,
                            () => {
                                // 用户确认导入
                                try {
                                    // 替换现有配置
                                    buttonConfig = importedConfig;

                                    if (typeof buttonConfig.showFolderIcons !== 'boolean') {
                                        buttonConfig.showFolderIcons = false;
                                    }

                                    // 确保所有按钮都有'type'字段和'autoSubmit'字段
                                    Object.entries(buttonConfig.folders).forEach(([folderName, folderConfig]) => {
                                        // 确保文件夹有hidden字段
                                        if (typeof folderConfig.hidden !== 'boolean') {
                                            folderConfig.hidden = false;
                                        }

                                        Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
                                            if (!btnCfg.type) {
                                                if (folderName === "🖱️") {
                                                    btnCfg.type = "tool";
                                                } else {
                                                    btnCfg.type = "template";
                                                }
                                            }
                                            if (btnCfg.type === "template" && typeof btnCfg.autoSubmit !== 'boolean') {
                                                btnCfg.autoSubmit = false;
                                            }
                                        });
                                    });

                                    // 保存配置
                                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

                                    // 重新渲染设置面板（如果打开）
                                    if (rerenderFn) {
                                        // 重置选中的文件夹为第一个
                                        selectedFolderName = buttonConfig.folderOrder[0] || null;
                                        rerenderFn();
                                    }

                                    console.log(t('📥 配置已成功导入。'));

                                    // 更新按钮栏
                                    updateButtonContainer();
                                    // 应用新配置下的域名样式
                                    try { applyDomainStyles(); } catch (_) {}

                                    // 立即更新所有计数器
                                    setTimeout(() => {
                                        updateCounters();
                                        console.log(t('📊 导入后计数器已更新。'));

                                        // 延时执行回调函数，确保所有渲染完成
                                        setTimeout(() => {
                                            if (rerenderFn) {
                                                rerenderFn();
                                            }
                                        }, 150);
                                    }, 100);

                                } catch (error) {
                                    console.error('导入配置时发生错误:', error);
                                    alert(t('导入配置时发生错误，请检查文件格式。'));
                                }
                            },
                            () => {
                                // 用户取消导入
                                console.log(t('❌ 用户取消了配置导入。'));
                            }
                        );

                    } else {
                        alert(t('导入的配置文件内容无效！'));
                    }
                } catch (error) {
                    console.error('解析配置文件失败:', error);
                    alert(t('导入的配置文件解析失败！请确认文件格式正确。'));
                }
            };
            reader.readAsText(file);
        });
        input.click();
    }

    // 新增的单独配置设置弹窗
    const showConfigSettingsDialog = () => {
        if (currentConfigOverlay) {
            closeExistingOverlay(currentConfigOverlay);
        }
        const overlay = document.createElement('div');
        overlay.classList.add('config-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 12000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('config-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 400px;
            max-width: 90vw;
        `;

        const configTitle = t('🛠️ 脚本配置');
        const rowLabelStyle = 'display:inline-flex;min-width:130px;justify-content:flex-start;margin-right:12px;color: var(--text-color, #333333);';
        const tabNavigation = `
            <div style="
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                border-bottom: 1px solid var(--border-color, #e5e7eb);
            ">
                <button class="tab-button active" data-tab="appearanceTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(';')};
                    background-color: var(--primary-color, #3B82F6);
                    color: white;
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('外观')}</button>
                <button class="tab-button" data-tab="configTab" style="
                    ${Object.entries(styles.button).map(([k, v]) => `${k}:${v}`).join(';')};
                    background-color: var(--button-bg, #f3f4f6);
                    color: var(--text-color, #333333);
                    border-radius: 4px 4px 0 0;
                    border-bottom: 2px solid transparent;
                ">${t('配置')}</button>
            </div>
        `;
        const appearanceTab = `
            <div id="appearanceTab" class="tab-content" style="display: block;">
                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:20px;
                    margin-bottom:20px;
                ">
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}">${t('语言')}：</span>
                        <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                            <button class="config-lang-btn" data-lang="auto" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            ">${t('自动')}</button>
                            <button class="config-lang-btn" data-lang="zh" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            ">${t('中文')}</button>
                            <button class="config-lang-btn" data-lang="en" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                                color: var(--input-text-color, var(--text-color, #333333));
                                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                                border-radius: 999px;
                                padding: 6px 14px;
                            ">${t('English')}</button>
                        </div>
                    </div>
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}">${t('文件夹图标：')}</span>
                        <div class="cttf-switch-wrapper">
                            <label class="cttf-switch">
                                <input id="folderIconToggleInput" type="checkbox" />
                                <span class="cttf-switch-slider"></span>
                            </label>
                            <span id="folderIconToggleText" style="
                                font-size: 13px;
                                color: var(--text-color, #333333);
                                font-weight: 500;
                                min-width: 38px;
                            ">${t('显示')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const configTab = `
            <div id="configTab" class="tab-content" style="display: none;">
                <div style="
                    display:flex;
                    flex-direction:column;
                    gap:20px;
                    margin-bottom:0;
                ">
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                        padding-bottom:16px;
                        border-bottom:1px solid var(--border-color, #e5e7eb);
                    ">
                        <span style="${rowLabelStyle}">${t('恢复默认设置：')}</span>
                        <button id="resetSettingsBtn" style="
                            ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                            background-color: var(--cancel-color, #6B7280);
                            color: white;
                            border-radius:4px;
                        ">${t('↩️ 重置')}</button>
                    </div>
                    <div style="
                        display:flex;
                        flex-direction:row;
                        align-items:center;
                    ">
                        <span style="${rowLabelStyle}">${t('配置导入导出：')}</span>
                        <div style="display:flex;gap:8px;">
                            <button id="importConfigBtn" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--add-color, #fd7e14);
                                color: white;
                                border-radius:4px;
                            ">${t('📥 导入')}</button>
                            <button id="exportConfigBtn" style="
                                ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                                background-color: var(--success-color, #22c55e);
                                color: white;
                                border-radius:4px;
                            ">${t('📤 导出')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        setTrustedHTML(dialog, `
            <h3 style="margin:0 0 20px 0;font-size:18px;font-weight:600; color: var(--text-color, #333333);">${configTitle}</h3>
            ${tabNavigation}
            ${appearanceTab}
            ${configTab}
        `);

        const setupTabs = () => {
            const tabButtons = dialog.querySelectorAll('.tab-button');
            const tabContents = dialog.querySelectorAll('.tab-content');
            const activateTab = (targetId) => {
                tabButtons.forEach((btn) => {
                    const isActive = btn.dataset.tab === targetId;
                    btn.classList.toggle('active', isActive);
                    btn.style.backgroundColor = isActive
                        ? 'var(--primary-color, #3B82F6)'
                        : 'var(--button-bg, #f3f4f6)';
                    btn.style.color = isActive ? 'white' : 'var(--text-color, #333333)';
                    btn.style.borderBottom = isActive
                        ? '2px solid var(--primary-color, #3B82F6)'
                        : '2px solid transparent';
                });
                tabContents.forEach((content) => {
                    content.style.display = content.id === targetId ? 'block' : 'none';
                });
            };
            tabButtons.forEach((button) => {
                button.addEventListener('click', () => {
                    const targetId = button.dataset.tab;
                    if (targetId) {
                        activateTab(targetId);
                    }
                });
            });
            activateTab('appearanceTab');
        };
        setupTabs();

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfigOverlay = overlay;

        const langBtnStyle = document.createElement('style');
        langBtnStyle.textContent = `
            .config-lang-btn {
                background-color: var(--input-bg, var(--button-bg, #f3f4f6));
                color: var(--input-text-color, var(--text-color, #333333));
                border: 1px solid var(--input-border-color, var(--border-color, #d1d5db));
                transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
            }
            .config-lang-btn:hover {
                border-color: var(--primary-color, #3B82F6);
                box-shadow: 0 0 0 1px var(--primary-color, #3B82F6) inset;
            }
            .config-lang-btn.active {
                background-color: var(--primary-color, #3B82F6) !important;
                color: #ffffff !important;
                border-color: var(--primary-color, #3B82F6) !important;
                box-shadow: 0 0 0 1px var(--primary-color, #3B82F6) inset;
            }
            .cttf-switch-wrapper {
                display: inline-flex;
                align-items: center;
                gap: 10px;
            }
            .cttf-switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }
            .cttf-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .cttf-switch-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(148, 163, 184, 0.35);
                border-radius: 999px;
                transition: background-color 0.25s ease, box-shadow 0.25s ease;
            }
            .cttf-switch-slider::before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                top: 2px;
                background-color: #ffffff;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
                transition: transform 0.25s ease;
            }
            .cttf-switch input:checked + .cttf-switch-slider {
                background-color: #22c55e;
            }
            .cttf-switch input:checked + .cttf-switch-slider::before {
                transform: translateX(24px);
            }
            .cttf-switch input:focus-visible + .cttf-switch-slider {
                box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.35);
            }
        `;
        dialog.appendChild(langBtnStyle);

        const langButtons = Array.from(dialog.querySelectorAll('.config-lang-btn'));
        const updateLanguageButtonState = (preference) => {
            langButtons.forEach((btn) => {
                const isActive = btn.dataset.lang === preference;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        };

        updateLanguageButtonState(readLanguagePreference() || 'auto');

        langButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const selectedPreference = btn.dataset.lang || 'auto';
                const result = applyLanguagePreference(selectedPreference);
                updateLanguageButtonState(result ? result.preference : selectedPreference);
            });
        });

        const folderIconToggleInput = dialog.querySelector('#folderIconToggleInput');
        const folderIconToggleText = dialog.querySelector('#folderIconToggleText');
        const folderIconToggleSlider = dialog.querySelector('.cttf-switch-slider');
        const folderIconToggleWrapper = dialog.querySelector('.cttf-switch-wrapper');
        const updateFolderIconToggleState = () => {
            if (!folderIconToggleInput) {
                return;
            }
        const enabled = buttonConfig.showFolderIcons === true;
            folderIconToggleInput.checked = enabled;
            folderIconToggleInput.setAttribute('aria-checked', enabled ? 'true' : 'false');
            if (folderIconToggleText) {
                folderIconToggleText.textContent = enabled ? t('显示') : t('隐藏');
                folderIconToggleText.style.color = enabled
                    ? 'var(--success-color, #22c55e)'
                    : 'var(--muted-text-color, #6b7280)';
            }
            const tooltipTarget = folderIconToggleWrapper || folderIconToggleSlider;
            if (tooltipTarget) {
                tooltipTarget.title = enabled
                    ? t('点击后隐藏文件夹图标')
                    : t('点击后显示文件夹图标');
            }
        };

        if (folderIconToggleInput) {
            updateFolderIconToggleState();
            folderIconToggleInput.addEventListener('change', () => {
                const enabled = folderIconToggleInput.checked;
                buttonConfig.showFolderIcons = enabled;
                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                updateFolderIconToggleState();
                console.log(t('🖼️ 文件夹图标显示已切换为 {{state}}', {
                    state: enabled ? t('显示') : t('隐藏')
                }));
                if (currentSettingsOverlay) {
                    renderFolderList();
                }
                updateButtonContainer();
            });
        }

        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeExistingOverlay(overlay);
                if (currentConfigOverlay === overlay) {
                    currentConfigOverlay = null;
                }
                console.log(t('✅ 脚本配置弹窗已通过点击外部关闭'));
            }
        });

        // 动画效果
        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#importConfigBtn').addEventListener('click', () => {
            importConfig(() => {
                // 重新渲染主设置面板
                if (currentSettingsOverlay) {
                    selectedFolderName = buttonConfig.folderOrder[0] || null;
                    renderFolderList();
                    renderButtonList();
                    // 确保计数器也被更新
                    setTimeout(() => {
                        updateCounters();
                    }, 50);
                }

                // 导入成功后关闭脚本配置弹窗
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log(t('✅ 脚本配置弹窗已自动关闭'));
                }
            });
        });

        dialog.querySelector('#exportConfigBtn').addEventListener('click', () => {
            exportConfig();
            // 导出完成后关闭脚本配置弹窗
            setTimeout(() => {
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log(t('✅ 脚本配置弹窗已在导出后关闭'));
                }
            }, 500); // 给导出操作一些时间完成
        });

        dialog.querySelector('#resetSettingsBtn').addEventListener('click', () => {
        if (confirm(t('确认重置所有配置为默认设置吗？'))) {
                // 先关闭脚本配置弹窗，提升用户体验
                if (currentConfigOverlay) {
                    closeExistingOverlay(currentConfigOverlay);
                    currentConfigOverlay = null;
                    console.log(t('✅ 脚本配置弹窗已在重置前关闭'));
                }

                // 执行配置重置
                buttonConfig = JSON.parse(JSON.stringify(defaultConfig));
                // 重置folderOrder
                buttonConfig.folderOrder = Object.keys(buttonConfig.folders);
                // 确保所有按钮都有'type'字段和'autoSubmit'字段
                Object.entries(buttonConfig.folders).forEach(([folderName, folderConfig]) => {
                    Object.entries(folderConfig.buttons).forEach(([btnName, btnCfg]) => {
                        if (!btnCfg.type) {
                            if (folderName === "🖱️") {
                                btnCfg.type = "tool";
                            } else {
                                btnCfg.type = "template";
                            }
                        }
                        if (btnCfg.type === "template" && typeof btnCfg.autoSubmit !== 'boolean') {
                            btnCfg.autoSubmit = false;
                        }
                    });
                });
                localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));

                // 重新渲染设置面板（如果还打开着）
                if (currentSettingsOverlay) {
                    selectedFolderName = buttonConfig.folderOrder[0] || null;
                    renderFolderList();
                    renderButtonList();
                }

                console.log(t('🔄 配置已重置为默认设置。'));

                // 更新按钮栏
                updateButtonContainer();
                // 重置后应用默认/匹配样式
                try { applyDomainStyles(); } catch (_) {}

                // 立即更新计数器
                setTimeout(() => {
                    updateCounters();
                    console.log(t('📊 重置后计数器已更新。'));

                    // 在所有更新完成后显示成功提示
                    setTimeout(() => {
                        alert(t('已重置为默认配置'));
                    }, 50);
                }, 100);
            }
        });
    };
/* -------------------------------------------------------------------------- *
 * Module 05 · Automation rules dialogs and submission helpers
 * -------------------------------------------------------------------------- */

let currentAutomationOverlay = null;
/**
 *
 * 弹窗：自动化设置，显示所有 domainAutoSubmitSettings，并可删除、点击添加
 */
function showAutomationSettingsDialog() {
    // 若已存在则先关闭
    if (currentAutomationOverlay) {
        closeExistingOverlay(currentAutomationOverlay);
    }

    // 使用 createUnifiedDialog 统一创建 overlay + dialog
    const { overlay, dialog } = createUnifiedDialog({
        title: t('⚡ 自动化设置'),
        width: '750px',  // 保留你想要的宽度
        onClose: () => {
            currentAutomationOverlay = null;
        },
        closeOnOverlayClick: false
    });
    currentAutomationOverlay = overlay;

    // 这里是新写法：在 dialog 里 appendChild 内部内容
    // 注意，createUnifiedDialog 已经注入了 overlay 与动画

    // 1) 构建内容区, 并插入到 dialog
    const infoDiv = document.createElement('div');
    infoDiv.style.textAlign = 'right';
    infoDiv.style.marginBottom = '10px';

    // 原先的 "关闭并保存" 按钮
    const closeAutomationBtn = document.createElement('button');
    closeAutomationBtn.id = 'closeAutomationBtn';
    closeAutomationBtn.textContent = t('💾 关闭并保存');
    closeAutomationBtn.style.cssText = `
        background-color: var(--success-color, #22c55e);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        position: absolute; /* 若想固定在右上角，可再自行定位 */
        top: 20px;
        right: 20px;
    `;
    closeAutomationBtn.addEventListener('click', () => {
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        closeExistingOverlay(overlay);
        currentAutomationOverlay = null;
    });
    infoDiv.appendChild(closeAutomationBtn);
    dialog.appendChild(infoDiv);

    // 2) 列表容器 + 渲染 domainAutoSubmitSettings
    const listContainer = document.createElement('div');
    listContainer.style.cssText = `
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--dialog-bg, #ffffff);
        max-height: 320px;
    `;

    const listHeader = document.createElement('div');
    listHeader.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        flex-shrink: 0;
    `;

    const headerColumns = [
        { label: '图标', flex: '0 0 32px', justify: 'center' },
        { label: '网站｜网址', flex: '1 1 0%', justify: 'flex-start', paddingLeft: '8px' },
        { label: '提交方式', flex: '0 0 120px', justify: 'center' },
        { label: '修改', flex: '0 0 40px', justify: 'center' },
        { label: '删除', flex: '0 0 40px', justify: 'center' }
    ];

    headerColumns.forEach(({ label, flex, justify, paddingLeft }) => {
        const column = document.createElement('div');
        column.textContent = label;
        column.style.display = 'flex';
        column.style.alignItems = 'center';
        column.style.justifyContent = justify;
        column.style.flex = flex;
        column.style.fontSize = '12px';
        column.style.fontWeight = '600';
        if (paddingLeft) {
            column.style.paddingLeft = paddingLeft;
        }
        listHeader.appendChild(column);
    });

    const listBody = document.createElement('div');
    listBody.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        overflow-y: auto;
        max-height: 260px;
    `;
    listBody.classList.add('hide-scrollbar');

    listContainer.appendChild(listHeader);
    listContainer.appendChild(listBody);
    dialog.appendChild(listContainer);

    const keyboardMethodPattern = /(enter|shift|caps|ctrl|control|cmd|meta|option|alt|space|tab|esc|escape|delete|backspace|home|end|page ?up|page ?down|arrow|up|down|left|right)/i;

    const createKeyCapElement = (label) => {
        const keyEl = document.createElement('span');
        keyEl.textContent = label;
        keyEl.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 28px;
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: linear-gradient(180deg, rgba(17,17,17,0.95), rgba(45,45,45,0.95));
            box-shadow: inset 0 -1px 0 rgba(255,255,255,0.12), 0 2px 4px rgba(0,0,0,0.45);
            font-size: 12px;
            font-weight: 600;
            color: #ffffff;
            font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            line-height: 1.2;
            white-space: nowrap;
        `;
        return keyEl;
    };

    const createMethodDisplay = (rawMethod) => {
        const methodValue = (rawMethod || '').trim();
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.gap = '6px';
        container.style.flexWrap = 'wrap';
        container.style.maxWidth = '100%';
        container.style.fontSize = '12px';
        container.style.fontWeight = '600';

        if (!methodValue) {
            const placeholder = document.createElement('span');
            placeholder.textContent = '-';
            placeholder.style.color = 'var(--muted-text-color, #6b7280)';
            placeholder.style.fontWeight = '500';
            container.appendChild(placeholder);
            return container;
        }

        if (methodValue === '模拟点击提交按钮') {
            const clickBadge = document.createElement('span');
            clickBadge.textContent = t('模拟点击');
            clickBadge.style.cssText = `
                padding: 4px 12px;
                border-radius: 20px;
                background: linear-gradient(180deg, rgba(253,224,71,0.85), rgba(251,191,36,0.9));
                border: 1px solid rgba(217,119,6,0.4);
                box-shadow: inset 0 -1px 0 rgba(217,119,6,0.35), 0 1px 2px rgba(217,119,6,0.25);
                color: rgba(120,53,15,0.95);
                font-weight: 700;
                font-size: 12px;
                letter-spacing: 0.02em;
                white-space: nowrap;
            `;
            container.appendChild(clickBadge);
            return container;
        }

        const shouldUseKeyStyle = keyboardMethodPattern.test(methodValue) || methodValue.includes('+') || methodValue.includes('/');

        if (!shouldUseKeyStyle) {
            const pill = document.createElement('span');
            pill.textContent = methodValue;
            pill.style.cssText = `
                padding: 4px 10px;
                background-color: rgba(59,130,246,0.12);
                color: var(--primary-color, #3B82F6);
                border-radius: 999px;
                white-space: nowrap;
            `;
            container.appendChild(pill);
            return container;
        }

        const combos = methodValue.split('/').map(segment => segment.trim()).filter(Boolean);
        combos.forEach((combo, comboIdx) => {
            if (comboIdx > 0) {
                const divider = document.createElement('span');
                divider.textContent = '/';
                divider.style.color = 'var(--muted-text-color, #6b7280)';
                divider.style.fontSize = '11px';
                divider.style.fontWeight = '600';
                container.appendChild(divider);
            }

            const comboWrapper = document.createElement('div');
            comboWrapper.style.display = 'flex';
            comboWrapper.style.alignItems = 'center';
            comboWrapper.style.justifyContent = 'center';
            comboWrapper.style.gap = '4px';

            const keys = combo.split('+').map(part => part.trim()).filter(Boolean);
            if (!keys.length) {
                keys.push(combo);
            }

            keys.forEach((keyLabel, keyIdx) => {
                if (keyIdx > 0) {
                    const plusSign = document.createElement('span');
                    plusSign.textContent = '+';
                    plusSign.style.color = 'var(--muted-text-color, #6b7280)';
                    plusSign.style.fontSize = '11px';
                    plusSign.style.fontWeight = '600';
                    comboWrapper.appendChild(plusSign);
                }
                comboWrapper.appendChild(createKeyCapElement(keyLabel));
            });

            container.appendChild(comboWrapper);
        });

        return container;
    };

    const showAutomationRuleDeleteConfirmDialog = (rule, onConfirm) => {
        if (!rule) {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            return;
        }
        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }

        const overlay = document.createElement('div');
        overlay.classList.add('confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 13000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('confirm-dialog', 'cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 420px;
            max-width: 90vw;
        `;

        const ruleName = rule.name || rule.domain || t('未命名规则');
        const ruleDomain = rule.domain || t('（未指定网址）');
        const faviconUrl = rule.favicon || generateDomainFavicon(rule.domain);
        const deleteAutomationTitle = t('🗑️ 确认删除自动化规则 "{{ruleName}}"？', { ruleName });
        const irreversibleNoticeAutomation = t('❗️ 注意：此操作无法撤销！');

        setTrustedHTML(dialog, `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: var(--danger-color, #ef4444);">
                ${deleteAutomationTitle}
            </h3>
            <p style="margin: 8px 0; color: var(--text-color, #333333);">${irreversibleNoticeAutomation}</p>
            <div style="margin: 16px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 12px; border-radius:6px; background-color: var(--button-bg, #f3f4f6);">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                    <div style="
                        width:32px;
                        height:32px;
                        border-radius:8px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        overflow:hidden;
                        flex-shrink:0;
                    ">
                        <img src="${faviconUrl}" alt="${ruleName}" style="width:24px; height:24px; object-fit:contain;" referrerpolicy="no-referrer">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <span style="font-size:14px; font-weight:600; color: var(--text-color, #333333);">${ruleName}</span>
                        <span style="font-size:12px; color: var(--muted-text-color, #6b7280);">${ruleDomain}</span>
                    </div>
                </div>
                <p style="margin:4px 0; position:relative; padding-left:12px; color: var(--text-color, #333333); display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span style="position:absolute; left:0; top:50%; transform:translateY(-50%); width:4px; height:4px; background-color: var(--text-color, #333333); border-radius:50%;"></span>
                    ${t('自动提交方式：')}<span class="cttf-automation-method-container"></span>
                </p>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
            ">
                <button id="cancelAutomationRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t('取消')}</button>
                <button id="confirmAutomationRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t('删除')}</button>
            </div>
        `);

        const methodPlaceholder = dialog.querySelector('.cttf-automation-method-container');
        if (methodPlaceholder) {
            const methodDisplay = createMethodDisplay(rule.method);
            methodDisplay.style.justifyContent = 'flex-start';
            methodPlaceholder.replaceWith(methodDisplay);
        }

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        const cancelBtn = dialog.querySelector('#cancelAutomationRuleDelete');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                closeExistingOverlay(overlay);
                currentConfirmOverlay = null;
            });
        }

        const confirmBtn = dialog.querySelector('#confirmAutomationRuleDelete');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (typeof onConfirm === 'function') {
                    onConfirm();
                }
                closeExistingOverlay(overlay);
                currentConfirmOverlay = null;
            });
        }
    };

    function renderDomainRules() {
        setTrustedHTML(listBody, '');
        const rules = buttonConfig.domainAutoSubmitSettings;
        let metadataPatched = false;

        if (!rules.length) {
            const emptyState = document.createElement('div');
            emptyState.textContent = t('暂无自动化规则，点击下方“+ 新建”开始配置。');
            emptyState.style.cssText = `
                padding: 18px;
                border-radius: 6px;
                border: 1px dashed var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
                color: var(--muted-text-color, #6b7280);
                font-size: 13px;
                text-align: center;
            `;
            listBody.appendChild(emptyState);
            return;
        }

        rules.forEach((rule, idx) => {
            const item = document.createElement('div');
            item.style.cssText = `
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 6px;
                background-color: var(--button-bg, #f3f4f6);
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            `;
            item.addEventListener('mouseenter', () => {
                item.style.borderColor = 'var(--primary-color, #3B82F6)';
                item.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.borderColor = 'var(--border-color, #e5e7eb)';
                item.style.boxShadow = 'none';
            });

            const faviconUrl = rule.favicon || generateDomainFavicon(rule.domain);
            if (!rule.favicon && rule.domain) {
                rule.favicon = faviconUrl;
                metadataPatched = true;
            }
            const faviconBadge = createFaviconElement(faviconUrl, rule.name || rule.domain, '🌐', { withBackground: false, size: 26 });
            faviconBadge.title = rule.domain || '';

            const iconColumn = document.createElement('div');
            iconColumn.style.display = 'flex';
            iconColumn.style.alignItems = 'center';
            iconColumn.style.justifyContent = 'center';
            iconColumn.style.flex = '0 0 30px';
            iconColumn.appendChild(faviconBadge);

            const infoColumn = document.createElement('div');
            infoColumn.style.display = 'flex';
            infoColumn.style.flexDirection = 'column';
            infoColumn.style.gap = '4px';
            infoColumn.style.minWidth = '0';
            infoColumn.style.flex = '1 1 0%';

            const nameEl = document.createElement('span');
            nameEl.textContent = rule.name || rule.domain || t('未命名规则');
            nameEl.style.fontWeight = '600';
            nameEl.style.fontSize = '14px';
            nameEl.style.color = 'var(--text-color, #1f2937)';

            const domainEl = document.createElement('span');
            domainEl.textContent = rule.domain || '';
            domainEl.style.fontSize = '12px';
            domainEl.style.color = 'var(--muted-text-color, #6b7280)';
            domainEl.style.whiteSpace = 'nowrap';
            domainEl.style.overflow = 'hidden';
            domainEl.style.textOverflow = 'ellipsis';
            domainEl.style.maxWidth = '260px';
            domainEl.title = rule.domain || '';

            infoColumn.appendChild(nameEl);
            infoColumn.appendChild(domainEl);

            const methodDisplay = createMethodDisplay(rule.method || '-');

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--primary-color, #3B82F6);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            editBtn.addEventListener('mouseenter', () => {
                editBtn.style.backgroundColor = 'rgba(59,130,246,0.12)';
            });
            editBtn.addEventListener('mouseleave', () => {
                editBtn.style.backgroundColor = 'transparent';
            });
            editBtn.addEventListener('click', () => {
                const ruleToEdit = buttonConfig.domainAutoSubmitSettings[idx];
                showDomainRuleEditorDialog(ruleToEdit, (newData) => {
                    buttonConfig.domainAutoSubmitSettings[idx] = newData;
                    renderDomainRules();
                });
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--danger-color, #ef4444);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.backgroundColor = 'rgba(239,68,68,0.12)';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.backgroundColor = 'transparent';
            });
            deleteBtn.addEventListener('click', () => {
                const ruleToDelete = buttonConfig.domainAutoSubmitSettings[idx];
                showAutomationRuleDeleteConfirmDialog(ruleToDelete, () => {
                    buttonConfig.domainAutoSubmitSettings.splice(idx, 1);
                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                    renderDomainRules();
                });
            });

            const methodColumn = document.createElement('div');
            methodColumn.style.display = 'flex';
            methodColumn.style.alignItems = 'center';
            methodColumn.style.justifyContent = 'center';
            methodColumn.style.flex = '0 0 120px';
            methodColumn.appendChild(methodDisplay);

            const editColumn = document.createElement('div');
            editColumn.style.display = 'flex';
            editColumn.style.alignItems = 'center';
            editColumn.style.justifyContent = 'center';
            editColumn.style.flex = '0 0 40px';
            editColumn.appendChild(editBtn);

            const deleteColumn = document.createElement('div');
            deleteColumn.style.display = 'flex';
            deleteColumn.style.alignItems = 'center';
            deleteColumn.style.justifyContent = 'center';
            deleteColumn.style.flex = '0 0 40px';
            deleteColumn.appendChild(deleteBtn);

            item.appendChild(iconColumn);
            item.appendChild(infoColumn);
            item.appendChild(methodColumn);
            item.appendChild(editColumn);
            item.appendChild(deleteColumn);
            listBody.appendChild(item);
        });
        if (metadataPatched) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        }
    }
    renderDomainRules();

    // 3) 新建按钮
    const addDiv = document.createElement('div');
    addDiv.style.marginTop = '12px';
    addDiv.style.textAlign = 'left';

    const addBtn = document.createElement('button');
    addBtn.textContent = t('+ 新建');
    addBtn.style.cssText = `
        background-color: var(--add-color, #fd7e14);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
    `;
    addBtn.addEventListener('click', () => {
        showDomainRuleEditorDialog({}, (newData) => {
            buttonConfig.domainAutoSubmitSettings.push(newData);
            renderDomainRules();
        });
    });
    addDiv.appendChild(addBtn);
    dialog.appendChild(addDiv);

}


function showStyleSettingsDialog() {
    // 若已存在则关闭
    if (currentStyleOverlay) {
        closeExistingOverlay(currentStyleOverlay);
    }

    // 使用统一弹窗
    const { overlay, dialog } = createUnifiedDialog({
        title: '🎨 网站样式',
        width: '750px',
        onClose: () => {
            currentStyleOverlay = null;
        },
        closeOnOverlayClick: false
    });
    currentStyleOverlay = overlay;

    // 说明文字
    const desc = document.createElement('p');
    desc.textContent = t('您可根据不同网址，自定义按钮栏高度和注入CSS样式。');
    dialog.appendChild(desc);

    // 列表容器
    const styleListContainer = document.createElement('div');
    styleListContainer.style.cssText = `
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: var(--dialog-bg, #ffffff);
        max-height: 320px;
        margin-bottom: 12px;
    `;

    const styleHeader = document.createElement('div');
    styleHeader.style.cssText = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        background-color: var(--button-bg, #f3f4f6);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color, #333333);
        flex-shrink: 0;
    `;

    const headerColumns = [
        { label: '图标', flex: '0 0 32px', textAlign: 'center' },
        { label: '网站｜网址', flex: '0.7 1 0%', textAlign: 'left', paddingLeft: '4px' },
        { label: '自定义css', flex: '3 1 0%', textAlign: 'center' },
        { label: '高度｜底部', flex: '0 0 110px', textAlign: 'center' },
        { label: '修改', flex: '0 0 40px', textAlign: 'center' },
        { label: '删除', flex: '0 0 40px', textAlign: 'center' }
    ];
    headerColumns.forEach((col) => {
        const column = document.createElement('div');
        column.textContent = col.label;
        column.style.display = 'flex';
        column.style.alignItems = 'center';
        column.style.justifyContent = col.textAlign === 'right' ? 'flex-end'
            : col.textAlign === 'center' ? 'center'
                : 'flex-start';
        column.style.textAlign = col.textAlign;
        column.style.flex = col.flex;
        column.style.fontSize = '12px';
        column.style.fontWeight = '600';
        if (col.paddingLeft) {
            column.style.paddingLeft = col.paddingLeft;
        }
        styleHeader.appendChild(column);
    });

    const styleListBody = document.createElement('div');
    styleListBody.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
        overflow-y: auto;
        max-height: 260px;
    `;
    styleListBody.classList.add('hide-scrollbar');

    styleListContainer.appendChild(styleHeader);
    styleListContainer.appendChild(styleListBody);
    dialog.appendChild(styleListContainer);

    const showStyleRuleDeleteConfirmDialog = (styleItem, onConfirm) => {
        if (!styleItem) {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            return;
        }

        if (currentConfirmOverlay) {
            closeExistingOverlay(currentConfirmOverlay);
        }

        const overlay = document.createElement('div');
        overlay.classList.add('confirm-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--overlay-bg, rgba(0, 0, 0, 0.5));
            backdrop-filter: blur(2px);
            z-index: 13000;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const dialog = document.createElement('div');
        dialog.classList.add('confirm-dialog', 'cttf-dialog');
        dialog.style.cssText = `
            background-color: var(--dialog-bg, #ffffff);
            color: var(--text-color, #333333);
            border-radius: 4px;
            padding: 24px;
            box-shadow: 0 8px 24px var(--shadow-color, rgba(0,0,0,0.1));
            border: 1px solid var(--border-color, #e5e7eb);
            transition: transform 0.3s ease, opacity 0.3s ease;
            width: 420px;
            max-width: 90vw;
        `;

        const resolvedStyleName = styleItem.name || styleItem.domain || t('未命名样式');
        const resolvedStyleDomain = styleItem.domain || t('（未指定网址）');
        const styleHeight = styleItem.height ? `${styleItem.height}px` : t('默认高度');
        const rawStyleBottomSpacing = (typeof styleItem.bottomSpacing === 'number') ? styleItem.bottomSpacing : buttonConfig.buttonBarBottomSpacing;
        const clampedStyleBottomSpacing = Math.max(-200, Math.min(200, Number(rawStyleBottomSpacing) || 0));
        const styleBottomSpacing = `${clampedStyleBottomSpacing}px`;
        const faviconUrl = styleItem.favicon || generateDomainFavicon(styleItem.domain);
        const cssRaw = (styleItem.cssCode || '').trim();
        const cssContent = cssRaw || t('（未配置自定义 CSS）');
        const cssLineCount = cssContent.split('\n').length;
        const cssTextareaHeight = Math.min(Math.max(cssLineCount, 6), 24) * 18;
        const escapeHtml = (str = '') => String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        const safeStyleName = escapeHtml(resolvedStyleName);
        const safeStyleDomain = escapeHtml(resolvedStyleDomain);
        const styleDeleteTitle = escapeHtml(t('确认删除样式 "{{styleName}}"？', { styleName: resolvedStyleName }));
        const irreversibleNoticeStyle = t('❗️ 注意：此操作无法撤销！');
        const spacingTitle = escapeHtml(t('按钮栏距页面底部的间距'));

        setTrustedHTML(dialog, `
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:4px;">
                <h3 style="margin:0; font-size:18px; font-weight:700; color: var(--danger-color, #ef4444); display:flex; align-items:center; gap:8px;">
                    <span aria-hidden="true">🗑️</span>
                    <span>${styleDeleteTitle}</span>
                </h3>
                <p style="margin:0; color: var(--text-color, #333333); font-size:13px;">${irreversibleNoticeStyle}</p>
            </div>
            <div style="margin: 0 0 22px 0; border: 1px solid var(--border-color, #e5e7eb); padding: 18px; border-radius:8px; background-color: var(--button-bg, #f3f4f6); display:flex; flex-direction:column; gap:16px;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                    <div style="
                        width:32px;
                        height:32px;
                        border-radius:8px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        overflow:hidden;
                        flex-shrink:0;
                    ">
                        <img src="${faviconUrl}" alt="${safeStyleName}" style="width:24px; height:24px; object-fit:contain;" referrerpolicy="no-referrer">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px; min-width:0;">
                        <span style="font-size:14px; font-weight:600; color: var(--text-color, #333333);">${safeStyleName}</span>
                        <span style="font-size:12px; color: var(--muted-text-color, #6b7280); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:220px;" title="${safeStyleDomain}">${safeStyleDomain}</span>
                    </div>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:12px; font-weight:600; color: var(--muted-text-color, #6b7280); white-space:nowrap;">${t('按钮栏高度')}</span>
                        <span style="
                            padding:6px 12px;
                            background-color: rgba(16,185,129,0.16);
                            color: var(--success-color, #22c55e);
                            border-radius:999px;
                            font-size:12px;
                            font-weight:600;
                            white-space:nowrap;
                        ">${escapeHtml(styleHeight)}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:12px; font-weight:600; color: var(--muted-text-color, #6b7280); white-space:nowrap;">${t('距页面底部')}</span>
                        <span style="
                            padding:6px 12px;
                            background-color: rgba(59,130,246,0.16);
                            color: var(--primary-color, #3B82F6);
                            border-radius:999px;
                            font-size:12px;
                            font-weight:600;
                            white-space:nowrap;
                        " title="${spacingTitle}">${escapeHtml(styleBottomSpacing)}</span>
                    </div>
                </div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <label style="font-size:13px; font-weight:600; color: var(--text-color, #333333); display:flex; align-items:center; gap:6px;">
                            <span aria-hidden="true">🧶</span>
                        <span>${t('自定义 CSS')}</span>
                        </label>
                    <textarea readonly style="
                        width:100%;
                        min-height:${cssTextareaHeight}px;
                        max-height:360px;
                        background-color: var(--input-bg, var(--dialog-bg, #ffffff));
                        color: var(--input-text-color, var(--text-color, #333333));
                        border:1px solid var(--input-border-color, var(--border-color, #d1d5db));
                        border-radius:6px;
                        padding:12px;
                        font-size:13px;
                        line-height:1.6;
                        resize:vertical;
                        font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
                        box-shadow: inset 0 1px 2px rgba(15,23,42,0.08);
                        white-space:pre-wrap;
                        word-break:break-word;
                        overflow-wrap:break-word;
                    ">${escapeHtml(cssContent)}</textarea>
                </div>
            </div>
            <div style="
                display:flex;
                justify-content: flex-end;
                gap: 12px;
                border-top:1px solid var(--border-color, #e5e7eb);
                padding-top:16px;
                margin-top:4px;
            ">
                <button id="cancelStyleRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--cancel-color, #6B7280);
                    color: white;
                    border-radius:4px;
                ">${t('取消')}</button>
                <button id="confirmStyleRuleDelete" style="
                    ${Object.entries(styles.button).map(([key, value]) => `${key}:${value}`).join(';')};
                    background-color: var(--danger-color, #ef4444);
                    color: white;
                    border-radius:4px;
                ">${t('删除')}</button>
            </div>
        `);

        overlay.appendChild(dialog);
        overlay.style.pointerEvents = 'auto';
        appendToOverlayLayer(overlay);
        currentConfirmOverlay = overlay;

        setTimeout(() => {
            overlay.style.opacity = '1';
            dialog.style.transform = 'scale(1)';
        }, 10);

        dialog.querySelector('#cancelStyleRuleDelete')?.addEventListener('click', () => {
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });

        dialog.querySelector('#confirmStyleRuleDelete')?.addEventListener('click', () => {
            if (typeof onConfirm === 'function') {
                onConfirm();
            }
            closeExistingOverlay(overlay);
            currentConfirmOverlay = null;
        });
    };

    function renderDomainStyles() {
        setTrustedHTML(styleListBody, '');
        const styles = buttonConfig.domainStyleSettings;
        let metadataPatched = false;

        if (!styles.length) {
            const emptyState = document.createElement('div');
            emptyState.textContent = t('尚未配置任何样式，点击下方“+ 新建”添加。');
            emptyState.style.cssText = `
                padding: 18px;
                border-radius: 6px;
                border: 1px dashed var(--border-color, #e5e7eb);
                background-color: var(--button-bg, #f3f4f6);
                color: var(--muted-text-color, #6b7280);
                font-size: 13px;
                text-align: center;
            `;
            styleListBody.appendChild(emptyState);
            return;
        }

        styles.forEach((item, idx) => {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex;
                justify-content: flex-start;
                align-items: center;
                gap: 8px;
                padding: 8px 10px;
                border: 1px solid var(--border-color, #e5e7eb);
                border-radius: 6px;
                background-color: var(--button-bg, #f3f4f6);
                transition: border-color 0.2s ease, box-shadow 0.2s ease;
            `;
            row.addEventListener('mouseenter', () => {
                row.style.borderColor = 'var(--info-color, #6366F1)';
                row.style.boxShadow = '0 3px 8px rgba(0,0,0,0.1)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.borderColor = 'var(--border-color, #e5e7eb)';
                row.style.boxShadow = 'none';
            });

            const faviconUrl = item.favicon || generateDomainFavicon(item.domain);
            if (!item.favicon && item.domain) {
                item.favicon = faviconUrl;
                metadataPatched = true;
            }
            const faviconBadge = createFaviconElement(faviconUrl, item.name || item.domain, '🎨', { withBackground: false, size: 26 });
            faviconBadge.title = item.domain || t('自定义样式');

            const iconColumn = document.createElement('div');
            iconColumn.style.display = 'flex';
            iconColumn.style.alignItems = 'center';
            iconColumn.style.justifyContent = 'center';
            iconColumn.style.flex = '0 0 30px';
            iconColumn.appendChild(faviconBadge);

            const siteColumn = document.createElement('div');
            siteColumn.style.display = 'flex';
            siteColumn.style.flexDirection = 'column';
            siteColumn.style.gap = '4px';
            siteColumn.style.minWidth = '100px';
            siteColumn.style.flex = '0.7 1 0%';

            const nameEl = document.createElement('span');
            nameEl.textContent = item.name || t('未命名样式');
            nameEl.style.fontWeight = '600';
            nameEl.style.fontSize = '14px';
            nameEl.style.color = 'var(--text-color, #1f2937)';

            const domainEl = document.createElement('span');
            domainEl.textContent = item.domain || t('未设置域名');
            domainEl.style.fontSize = '12px';
            domainEl.style.color = 'var(--muted-text-color, #6b7280)';
            domainEl.style.whiteSpace = 'nowrap';
            domainEl.style.overflow = 'hidden';
            domainEl.style.textOverflow = 'ellipsis';
            domainEl.style.maxWidth = '100%';

            const cssSnippet = (item.cssCode || '').replace(/\s+/g, ' ').trim();
            const snippetText = cssSnippet
                ? (cssSnippet.length > 80 ? `${cssSnippet.slice(0, 80)}…` : cssSnippet)
                : t('无自定义CSS');

            const cssPreview = document.createElement('code');
            cssPreview.textContent = snippetText;
            cssPreview.style.cssText = `
                display: block;
                width: 100%;
                font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                font-size: 12px;
                color: var(--muted-text-color, #6b7280);
                background-color: rgba(17,24,39,0.04);
                border-radius: 4px;
                padding: 4px 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            `;
            cssPreview.title = item.cssCode || '无自定义CSS';

            siteColumn.appendChild(nameEl);
            siteColumn.appendChild(domainEl);

            const cssColumn = document.createElement('div');
            cssColumn.style.cssText = `
                flex: 3 1 0%;
                min-width: 0;
                max-width: 100%;
                display: flex;
                align-items: center;
                padding-right: 12px;
            `;
            cssColumn.appendChild(cssPreview);

        const heightColumn = document.createElement('div');
        heightColumn.style.display = 'flex';
        heightColumn.style.alignItems = 'center';
        heightColumn.style.justifyContent = 'center';
        heightColumn.style.flex = '0 0 110px';
        heightColumn.style.gap = '6px';
        heightColumn.style.flexWrap = 'wrap';

        const heightBadge = document.createElement('span');
        heightBadge.textContent = item.height ? `${item.height}px` : t('默认高度');
        heightBadge.style.cssText = `
            padding: 4px 10px;
            background-color: rgba(16,185,129,0.12);
            color: var(--success-color, #22c55e);
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        `;

        const bottomSpacingValue = (typeof item.bottomSpacing === 'number') ? item.bottomSpacing : buttonConfig.buttonBarBottomSpacing;
        const clampedBottomSpacingValue = Math.max(-200, Math.min(200, Number(bottomSpacingValue) || 0));
        const bottomBadge = document.createElement('span');
        bottomBadge.textContent = `${clampedBottomSpacingValue}px`;
        bottomBadge.title = t('按钮栏距页面底部间距');
        bottomBadge.style.cssText = `
            padding: 4px 10px;
            background-color: rgba(59,130,246,0.12);
            color: var(--primary-color, #3B82F6);
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            white-space: nowrap;
        `;

            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️';
            editBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--primary-color, #3B82F6);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            editBtn.addEventListener('mouseenter', () => {
                editBtn.style.backgroundColor = 'rgba(59,130,246,0.12)';
            });
            editBtn.addEventListener('mouseleave', () => {
                editBtn.style.backgroundColor = 'transparent';
            });
            editBtn.addEventListener('click', () => {
                showEditDomainStyleDialog(idx);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                cursor: pointer;
                color: var(--danger-color, #ef4444);
                font-size: 14px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                transition: background-color 0.2s ease;
            `;
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.backgroundColor = 'rgba(239,68,68,0.12)';
            });
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.backgroundColor = 'transparent';
            });
            deleteBtn.addEventListener('click', () => {
                const styleToDelete = buttonConfig.domainStyleSettings[idx];
                showStyleRuleDeleteConfirmDialog(styleToDelete, () => {
                    buttonConfig.domainStyleSettings.splice(idx, 1);
                    localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
                    renderDomainStyles();
                    // 删除后应用默认/其他匹配样式
                    try { applyDomainStyles(); } catch (_) {}
                });
            });

        heightColumn.appendChild(heightBadge);
        heightColumn.appendChild(bottomBadge);

            const editColumn = document.createElement('div');
            editColumn.style.display = 'flex';
            editColumn.style.alignItems = 'center';
            editColumn.style.justifyContent = 'center';
            editColumn.style.flex = '0 0 40px';
            editColumn.appendChild(editBtn);

            const deleteColumn = document.createElement('div');
            deleteColumn.style.display = 'flex';
            deleteColumn.style.alignItems = 'center';
            deleteColumn.style.justifyContent = 'center';
            deleteColumn.style.flex = '0 0 40px';
            deleteColumn.appendChild(deleteBtn);

            row.appendChild(iconColumn);
            row.appendChild(siteColumn);
            row.appendChild(cssColumn);
            row.appendChild(heightColumn);
            row.appendChild(editColumn);
            row.appendChild(deleteColumn);
            styleListBody.appendChild(row);
        });
        if (metadataPatched) {
            localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        }
    }
    renderDomainStyles();

    // 新建
    const addStyleBtn = document.createElement('button');
    addStyleBtn.textContent = t('+ 新建');
    addStyleBtn.style.cssText = `
        background-color: var(--add-color, #fd7e14);
        color: #fff;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        margin-bottom: 12px;
    `;
    addStyleBtn.addEventListener('click', () => {
        showEditDomainStyleDialog(); // 新建
    });
    dialog.appendChild(addStyleBtn);

    // 右上角关闭并保存
    const closeSaveBtn = document.createElement('button');
    closeSaveBtn.textContent = t('💾 关闭并保存');
    closeSaveBtn.style.cssText = `
        background-color: var(--success-color, #22c55e);
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        cursor: pointer;
        position: absolute;
        top: 20px;
        right: 20px;
    `;
    closeSaveBtn.addEventListener('click', () => {
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        // 关闭前应用一次，确保当前页面即时生效
        try { applyDomainStyles(); } catch (_) {}
        closeExistingOverlay(overlay);
        currentStyleOverlay = null;
    });
    dialog.style.position = 'relative';
    dialog.appendChild(closeSaveBtn);

}
/* -------------------------------------------------------------------------- *
 * Module 06 · Domain-specific style configuration & runtime helpers
 * -------------------------------------------------------------------------- */

    // Domain style helpers shared across modules --------------------------------

    const clampBarSpacingValue = (value, fallback = 0) => {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return Math.max(-200, Math.min(200, parsed));
        }
        const fallbackParsed = Number(fallback);
        if (Number.isFinite(fallbackParsed)) {
            return Math.max(-200, Math.min(200, fallbackParsed));
        }
        return 0;
    };

    const applyBarBottomSpacing = (container, spacing, fallbackSpacing = 0) => {
        if (!container) return 0;
        const desiredSpacing = clampBarSpacingValue(spacing, fallbackSpacing);
        const paddingY = Number(container.dataset.barPaddingY) || 0;
        const adjustedBottom = desiredSpacing - paddingY;
        container.style.transform = 'translateY(0)';
        container.style.bottom = `${adjustedBottom}px`;
        container.dataset.barBottomSpacing = String(desiredSpacing);
        return desiredSpacing;
    };

    // 根据目标高度调整底部按钮栏的布局和内部按钮尺寸
    updateButtonBarLayout = (container, targetHeight) => {
        if (!container) return;
        const numericHeight = Number(targetHeight);
        if (!Number.isFinite(numericHeight) || numericHeight <= 0) return;

        const barHeight = Math.max(32, Math.round(numericHeight));
        const scale = Math.max(0.6, Math.min(2.5, barHeight / 40));

        const paddingYBase = Math.round(6 * scale);
        const paddingYMax = Math.max(4, Math.floor((barHeight - 24) / 2));
        const paddingY = Math.min(Math.max(4, Math.min(20, paddingYBase)), paddingYMax);
        const paddingX = Math.max(12, Math.min(48, Math.round(15 * scale)));
        const gapSize = Math.max(6, Math.min(28, Math.round(10 * scale)));

        container.style.padding = `${paddingY}px ${paddingX}px`;
        container.style.gap = `${gapSize}px`;

        const innerHeight = Math.max(20, barHeight - paddingY * 2);
        const fontSize = Math.max(12, Math.min(22, Math.round(14 * scale)));
        let verticalPadding = Math.max(4, Math.min(18, Math.round(6 * scale)));
        const maxVerticalPadding = Math.max(4, Math.floor((innerHeight - fontSize) / 2));
        if (verticalPadding > maxVerticalPadding) {
            verticalPadding = Math.max(4, maxVerticalPadding);
        }
        const horizontalPadding = Math.max(12, Math.min(56, Math.round(12 * scale)));
        const borderRadius = Math.max(4, Math.min(20, Math.round(4 * scale)));
        const lineHeight = Math.max(fontSize + 2, innerHeight - verticalPadding * 2);

        const buttons = Array.from(container.children).filter(node => node.tagName === 'BUTTON');
        buttons.forEach(btn => {
            btn.style.minHeight = `${innerHeight}px`;
            btn.style.height = `${innerHeight}px`;
            btn.style.padding = `${verticalPadding}px ${horizontalPadding}px`;
            btn.style.fontSize = `${fontSize}px`;
            btn.style.borderRadius = `${borderRadius}px`;
            btn.style.lineHeight = `${lineHeight}px`;
            if (!btn.style.display) btn.style.display = 'inline-flex';
            if (!btn.style.alignItems) btn.style.alignItems = 'center';
        });

        container.dataset.barHeight = String(barHeight);
        container.dataset.barPaddingY = String(verticalPadding);
    };

    // 应用当前域名样式（高度 + 自定义 CSS），可在多处复用
    applyDomainStyles = () => {
        try {
            const container = queryUI('.folder-buttons-container');
            const currentHost = window.location.hostname || '';
            if (!container) return;

            const fallbackSpacing = clampBarSpacingValue(
                typeof buttonConfig.buttonBarBottomSpacing === 'number'
                    ? buttonConfig.buttonBarBottomSpacing
                    : (defaultConfig && typeof defaultConfig.buttonBarBottomSpacing === 'number'
                        ? defaultConfig.buttonBarBottomSpacing
                        : 0)
            );

            // 清理当前域名下已注入的旧样式，避免重复叠加
            try {
                document.querySelectorAll('style[data-domain-style]').forEach(el => {
                    const d = el.getAttribute('data-domain-style') || '';
                    if (d && currentHost.includes(d)) {
                        el.remove();
                    }
                });
            } catch (e) {
                console.warn('清理旧样式失败:', e);
            }

            const matchedStyle = (buttonConfig.domainStyleSettings || []).find(s => s && currentHost.includes(s.domain));
            if (matchedStyle) {
                const clamped = Math.min(200, Math.max(20, matchedStyle.height || buttonConfig.buttonBarHeight || (defaultConfig && defaultConfig.buttonBarHeight) || 40));
                container.style.height = clamped + 'px';
                updateButtonBarLayout(container, clamped);
                console.log(t('✅ 已根据 {{name}} 设置按钮栏高度：{{height}}px', {
                    name: matchedStyle.name,
                    height: clamped
                }));
                applyBarBottomSpacing(container, matchedStyle.bottomSpacing, fallbackSpacing);

                if (matchedStyle.cssCode) {
                    const styleEl = document.createElement('style');
                    styleEl.setAttribute('data-domain-style', matchedStyle.domain);
                    styleEl.textContent = matchedStyle.cssCode;
                    document.head.appendChild(styleEl);
                    console.log(t('✅ 已注入自定义CSS至 <head> 来自：{{name}}', { name: matchedStyle.name }));
                }
            } else {
                const fallback = (buttonConfig && typeof buttonConfig.buttonBarHeight === 'number')
                    ? buttonConfig.buttonBarHeight
                    : (defaultConfig && defaultConfig.buttonBarHeight) || 40;
                const clampedDefault = Math.min(200, Math.max(20, fallback));
                container.style.height = clampedDefault + 'px';
                updateButtonBarLayout(container, clampedDefault);
                console.log(t('ℹ️ 未匹配到样式规则，使用默认按钮栏高度：{{height}}px', {
                    height: clampedDefault
                }));
                applyBarBottomSpacing(container, fallbackSpacing, fallbackSpacing);
            }
        } catch (err) {
            console.warn(t('应用域名样式时出现问题:'), err);
        }
    };

    /**
     * 新建/编辑域名样式对话框
     * @param {number} index - 可选，若存在则为编辑，否则新建
     */
let currentAddDomainOverlay = null; // 保持原有声明
function showEditDomainStyleDialog(index) {
    if (currentAddDomainOverlay) {
        closeExistingOverlay(currentAddDomainOverlay);
    }
    const isEdit = typeof index === 'number';
    const styleItem = isEdit
        ? { ...buttonConfig.domainStyleSettings[index] }
        : {
            domain: window.location.hostname,
            name: document.title || t('新样式'),
            height: 40,
            bottomSpacing: buttonConfig.buttonBarBottomSpacing,
            cssCode: '',
            favicon: generateDomainFavicon(window.location.hostname)
        };
    const presetStyleDomain = styleItem.domain || '';
    if (!styleItem.favicon) {
        styleItem.favicon = generateDomainFavicon(presetStyleDomain);
    }
    if (typeof styleItem.bottomSpacing !== 'number') {
        styleItem.bottomSpacing = buttonConfig.buttonBarBottomSpacing;
    }

    const { overlay, dialog } = createUnifiedDialog({
        title: isEdit ? t('✏️ 编辑自定义样式') : t('🆕 新建自定义样式'),
        width: '480px',
        onClose: () => {
            currentAddDomainOverlay = null;
        },
        closeOnOverlayClick: false
    });
    currentAddDomainOverlay = overlay;

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '16px';
    container.style.marginBottom = '16px';
    container.style.padding = '16px';
    container.style.borderRadius = '6px';
    container.style.border = '1px solid var(--border-color, #e5e7eb)';
    container.style.backgroundColor = 'var(--button-bg, #f3f4f6)';

    const tabsHeader = document.createElement('div');
    tabsHeader.style.display = 'flex';
    tabsHeader.style.gap = '8px';
    tabsHeader.style.flexWrap = 'wrap';

    const tabConfig = [
        { id: 'basic', label: '基础信息' },
        { id: 'layout', label: '布局设置' },
        { id: 'css', label: '自定义 CSS' }
    ];

    const tabButtons = [];
    const tabPanels = new Map();

    const tabsBody = document.createElement('div');
    tabsBody.style.position = 'relative';

    tabConfig.forEach(({ id, label }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.tabId = id;
        button.textContent = label;
        button.style.padding = '8px 14px';
        button.style.borderRadius = '20px';
        button.style.border = '1px solid var(--border-color, #d1d5db)';
        button.style.backgroundColor = 'transparent';
        button.style.color = 'var(--muted-text-color, #6b7280)';
        button.style.cursor = 'pointer';
        button.style.fontSize = '13px';
        button.style.fontWeight = '500';
        button.addEventListener('click', () => setActiveTab(id));
        tabButtons.push(button);
        tabsHeader.appendChild(button);

        const panel = document.createElement('div');
        panel.dataset.tabId = id;
        panel.style.display = 'none';
        panel.style.flexDirection = 'column';
        panel.style.gap = '12px';
        tabPanels.set(id, panel);
        tabsBody.appendChild(panel);
    });

    container.appendChild(tabsHeader);
    container.appendChild(tabsBody);

    function setActiveTab(targetId) {
        tabButtons.forEach((button) => {
            const isActive = button.dataset.tabId === targetId;
            button.style.backgroundColor = isActive ? 'var(--dialog-bg, #ffffff)' : 'transparent';
            button.style.color = isActive ? 'var(--text-color, #1f2937)' : 'var(--muted-text-color, #6b7280)';
            button.style.fontWeight = isActive ? '600' : '500';
            button.style.boxShadow = isActive ? '0 2px 6px rgba(15, 23, 42, 0.08)' : 'none';
        });
        tabPanels.forEach((panel, panelId) => {
            panel.style.display = panelId === targetId ? 'flex' : 'none';
        });
    }

    setActiveTab('basic');

    const nameLabel = document.createElement('label');
    nameLabel.textContent = t('备注名称：');
    nameLabel.style.display = 'flex';
    nameLabel.style.flexDirection = 'column';
    nameLabel.style.gap = '6px';
    nameLabel.style.fontSize = '13px';
    nameLabel.style.fontWeight = '600';
    nameLabel.style.color = 'var(--text-color, #1f2937)';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = styleItem.name || '';
    nameInput.style.width = '100%';
    nameInput.style.height = '40px';
    nameInput.style.padding = '0 12px';
    nameInput.style.border = '1px solid var(--border-color, #d1d5db)';
    nameInput.style.borderRadius = '6px';
    nameInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    nameInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    nameInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    nameInput.style.outline = 'none';
    nameInput.style.fontSize = '14px';
    nameLabel.appendChild(nameInput);
    tabPanels.get('basic').appendChild(nameLabel);

    const domainLabel = document.createElement('label');
    domainLabel.textContent = t('网址：');
    domainLabel.style.display = 'flex';
    domainLabel.style.flexDirection = 'column';
    domainLabel.style.gap = '6px';
    domainLabel.style.fontSize = '13px';
    domainLabel.style.fontWeight = '600';
    domainLabel.style.color = 'var(--text-color, #1f2937)';
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.value = styleItem.domain || '';
    domainInput.style.width = '100%';
    domainInput.style.height = '40px';
    domainInput.style.padding = '0 12px';
    domainInput.style.border = '1px solid var(--border-color, #d1d5db)';
    domainInput.style.borderRadius = '6px';
    domainInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    domainInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    domainInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    domainInput.style.outline = 'none';
    domainInput.style.fontSize = '14px';
    domainLabel.appendChild(domainInput);
    tabPanels.get('basic').appendChild(domainLabel);

    const faviconLabel2 = document.createElement('label');
    faviconLabel2.textContent = t('站点图标：');
    faviconLabel2.style.display = 'flex';
    faviconLabel2.style.flexDirection = 'column';
    faviconLabel2.style.gap = '6px';
    faviconLabel2.style.fontSize = '13px';
    faviconLabel2.style.fontWeight = '600';
    faviconLabel2.style.color = 'var(--text-color, #1f2937)';

    const faviconFieldWrapper2 = document.createElement('div');
    faviconFieldWrapper2.style.display = 'flex';
    faviconFieldWrapper2.style.alignItems = 'flex-start';
    faviconFieldWrapper2.style.gap = '12px';

    const faviconPreviewHolder2 = document.createElement('div');
    faviconPreviewHolder2.style.width = '40px';
    faviconPreviewHolder2.style.height = '40px';
    faviconPreviewHolder2.style.borderRadius = '10px';
    faviconPreviewHolder2.style.display = 'flex';
    faviconPreviewHolder2.style.alignItems = 'center';
    faviconPreviewHolder2.style.justifyContent = 'center';
    faviconPreviewHolder2.style.backgroundColor = 'transparent';
    faviconPreviewHolder2.style.flexShrink = '0';

    const faviconControls2 = document.createElement('div');
    faviconControls2.style.display = 'flex';
    faviconControls2.style.flexDirection = 'column';
    faviconControls2.style.gap = '8px';
    faviconControls2.style.flex = '1';

    const faviconInput2 = document.createElement('textarea');
    faviconInput2.rows = 1;
    faviconInput2.style.flex = '1 1 auto';
    faviconInput2.style.padding = '10px 12px';
    faviconInput2.style.border = '1px solid var(--border-color, #d1d5db)';
    faviconInput2.style.borderRadius = '6px';
    faviconInput2.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    faviconInput2.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    faviconInput2.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    faviconInput2.style.outline = 'none';
    faviconInput2.style.fontSize = '14px';
    faviconInput2.style.lineHeight = '1.5';
    faviconInput2.style.resize = 'vertical';
    faviconInput2.style.overflowY = 'hidden';
    faviconInput2.placeholder = t('可填写自定义图标地址');
    faviconInput2.value = styleItem.favicon || '';
    const resizeFaviconTextarea2 = () => autoResizeTextarea(faviconInput2, { minRows: 1, maxRows: 4 });

    const faviconActionsRow2 = document.createElement('div');
    faviconActionsRow2.style.display = 'flex';
    faviconActionsRow2.style.alignItems = 'center';
    faviconActionsRow2.style.gap = '8px';
    faviconActionsRow2.style.flexWrap = 'nowrap';
    faviconActionsRow2.style.fontSize = '12px';
    faviconActionsRow2.style.color = 'var(--muted-text-color, #6b7280)';
    faviconActionsRow2.style.justifyContent = 'flex-start';

    const faviconHelp2 = document.createElement('span');
    faviconHelp2.textContent = t('留空时系统将使用该网址的默认 Favicon。');
    faviconHelp2.style.flex = '1';
    faviconHelp2.style.minWidth = '0';
    faviconHelp2.style.marginRight = '12px';

    const autoFaviconBtn2 = document.createElement('button');
    autoFaviconBtn2.type = 'button';
    autoFaviconBtn2.setAttribute('aria-label', t('自动获取站点图标'));
    autoFaviconBtn2.title = t('自动获取站点图标');
    autoFaviconBtn2.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    autoFaviconBtn2.style.color = '#fff';
    autoFaviconBtn2.style.border = '1px solid var(--border-color, #d1d5db)';
    autoFaviconBtn2.style.borderRadius = '50%';
    autoFaviconBtn2.style.width = '32px';
    autoFaviconBtn2.style.height = '32px';
    autoFaviconBtn2.style.display = 'flex';
    autoFaviconBtn2.style.alignItems = 'center';
    autoFaviconBtn2.style.justifyContent = 'center';
    autoFaviconBtn2.style.cursor = 'pointer';
    autoFaviconBtn2.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.16)';
    autoFaviconBtn2.style.flexShrink = '0';
    autoFaviconBtn2.style.padding = '0';

    const autoFaviconIcon2 = createAutoFaviconIcon();
    autoFaviconBtn2.appendChild(autoFaviconIcon2);

    faviconActionsRow2.appendChild(faviconHelp2);
    faviconActionsRow2.appendChild(autoFaviconBtn2);

    faviconControls2.appendChild(faviconInput2);
    faviconControls2.appendChild(faviconActionsRow2);

    faviconFieldWrapper2.appendChild(faviconPreviewHolder2);
    faviconFieldWrapper2.appendChild(faviconControls2);

    faviconLabel2.appendChild(faviconFieldWrapper2);
    tabPanels.get('basic').appendChild(faviconLabel2);

    let faviconManuallyEdited2 = false;
    const updateStyleFaviconPreview = () => {
        const imgUrl = faviconInput2.value.trim() || generateDomainFavicon(domainInput.value.trim());
        setTrustedHTML(faviconPreviewHolder2, '');
        faviconPreviewHolder2.appendChild(
            createFaviconElement(
                imgUrl,
                nameInput.value.trim() || domainInput.value.trim() || '样式',
                '🎨',
                { withBackground: false }
            )
        );
    };
    updateStyleFaviconPreview();
    resizeFaviconTextarea2();
    requestAnimationFrame(resizeFaviconTextarea2);

    const getStyleFallbackFavicon = () => generateDomainFavicon(domainInput.value.trim());

    autoFaviconBtn2.addEventListener('click', () => {
        const autoUrl = getStyleFallbackFavicon();
        faviconInput2.value = autoUrl;
        faviconManuallyEdited2 = false;
        updateStyleFaviconPreview();
        resizeFaviconTextarea2();
    });

    domainInput.addEventListener('input', () => {
        if (!faviconManuallyEdited2) {
            faviconInput2.value = getStyleFallbackFavicon();
        }
        updateStyleFaviconPreview();
        resizeFaviconTextarea2();
    });

    faviconInput2.addEventListener('input', () => {
        faviconManuallyEdited2 = true;
        updateStyleFaviconPreview();
        resizeFaviconTextarea2();
    });
    nameInput.addEventListener('input', updateStyleFaviconPreview);

    const heightLabel = document.createElement('label');
    heightLabel.textContent = t('按钮栏高度 (px)：');
    heightLabel.style.display = 'flex';
    heightLabel.style.flexDirection = 'column';
    heightLabel.style.gap = '6px';
    heightLabel.style.fontSize = '13px';
    heightLabel.style.fontWeight = '600';
    heightLabel.style.color = 'var(--text-color, #1f2937)';
    const heightInput = document.createElement('input');
    heightInput.type = 'number';
    heightInput.min = '20';
    heightInput.max = '200';
    heightInput.step = '1';
    heightInput.value = styleItem.height;
    heightInput.style.width = '100%';
    heightInput.style.height = '40px';
    heightInput.style.padding = '0 12px';
    heightInput.style.border = '1px solid var(--border-color, #d1d5db)';
    heightInput.style.borderRadius = '6px';
    heightInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    heightInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    heightInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    heightInput.style.outline = 'none';
    heightInput.style.fontSize = '14px';
    heightLabel.appendChild(heightInput);
    tabPanels.get('layout').appendChild(heightLabel);

    const bottomSpacingLabel = document.createElement('label');
    bottomSpacingLabel.textContent = t('按钮距页面底部间距 (px)：');
    bottomSpacingLabel.style.display = 'flex';
    bottomSpacingLabel.style.flexDirection = 'column';
    bottomSpacingLabel.style.gap = '6px';
    bottomSpacingLabel.style.fontSize = '13px';
    bottomSpacingLabel.style.fontWeight = '600';
    bottomSpacingLabel.style.color = 'var(--text-color, #1f2937)';
    const bottomSpacingInput = document.createElement('input');
    bottomSpacingInput.type = 'number';
    bottomSpacingInput.min = '-200';
    bottomSpacingInput.max = '200';
    bottomSpacingInput.step = '1';
    bottomSpacingInput.value = styleItem.bottomSpacing ?? buttonConfig.buttonBarBottomSpacing ?? 0;
    bottomSpacingInput.style.width = '100%';
    bottomSpacingInput.style.height = '40px';
    bottomSpacingInput.style.padding = '0 12px';
    bottomSpacingInput.style.border = '1px solid var(--border-color, #d1d5db)';
    bottomSpacingInput.style.borderRadius = '6px';
    bottomSpacingInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    bottomSpacingInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    bottomSpacingInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    bottomSpacingInput.style.outline = 'none';
    bottomSpacingInput.style.fontSize = '14px';
    bottomSpacingLabel.appendChild(bottomSpacingInput);
    tabPanels.get('layout').appendChild(bottomSpacingLabel);

    const cssLabel = document.createElement('label');
    cssLabel.textContent = t('自定义 CSS：');
    cssLabel.style.display = 'flex';
    cssLabel.style.flexDirection = 'column';
    cssLabel.style.gap = '6px';
    cssLabel.style.fontSize = '13px';
    cssLabel.style.fontWeight = '600';
    cssLabel.style.color = 'var(--text-color, #1f2937)';
    const cssTextarea = document.createElement('textarea');
    cssTextarea.value = styleItem.cssCode || '';
    cssTextarea.style.width = '100%';
    cssTextarea.style.minHeight = '120px';
    cssTextarea.style.padding = '12px';
    cssTextarea.style.border = '1px solid var(--border-color, #d1d5db)';
    cssTextarea.style.borderRadius = '6px';
    cssTextarea.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    cssTextarea.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    cssTextarea.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    cssTextarea.style.outline = 'none';
    cssTextarea.style.resize = 'vertical';
    cssTextarea.style.fontSize = '13px';
    cssTextarea.style.lineHeight = '1.5';
    cssLabel.appendChild(cssTextarea);
    tabPanels.get('css').appendChild(cssLabel);

    dialog.appendChild(container);

    const footer2 = document.createElement('div');
    footer2.style.display = 'flex';
    footer2.style.justifyContent = 'space-between';
    footer2.style.alignItems = 'center';
    footer2.style.gap = '12px';
    footer2.style.marginTop = '20px';
    footer2.style.paddingTop = '20px';
    footer2.style.borderTop = '1px solid var(--border-color, #e5e7eb)';

    const cancelBtn2 = document.createElement('button');
    cancelBtn2.textContent = t('取消');
    cancelBtn2.style.backgroundColor = 'var(--cancel-color, #6B7280)';
    cancelBtn2.style.color = '#fff';
    cancelBtn2.style.border = 'none';
    cancelBtn2.style.borderRadius = '4px';
    cancelBtn2.style.padding = '8px 16px';
    cancelBtn2.style.fontSize = '14px';
    cancelBtn2.style.cursor = 'pointer';
    cancelBtn2.addEventListener('click', () => {
        closeExistingOverlay(overlay);
        currentAddDomainOverlay = null;
    });
    footer2.appendChild(cancelBtn2);

    const saveBtn2 = document.createElement('button');
    saveBtn2.textContent = isEdit ? t('保存') : t('创建');
    saveBtn2.style.backgroundColor = 'var(--success-color,#22c55e)';
    saveBtn2.style.color = '#fff';
    saveBtn2.style.border = 'none';
    saveBtn2.style.borderRadius = '4px';
    saveBtn2.style.padding = '8px 16px';
    saveBtn2.style.fontSize = '14px';
    saveBtn2.style.cursor = 'pointer';
    saveBtn2.addEventListener('click', () => {
        const sanitizedDomain = domainInput.value.trim();
        const updatedItem = {
            domain: sanitizedDomain,
            name: nameInput.value.trim() || '未命名样式',
            height: parseInt(heightInput.value, 10) || 40,
            bottomSpacing: (() => {
                const parsed = Number(bottomSpacingInput.value);
                if (Number.isFinite(parsed)) {
                    return Math.max(-200, Math.min(200, parsed));
                }
                return buttonConfig.buttonBarBottomSpacing;
            })(),
            cssCode: cssTextarea.value,
            favicon: faviconInput2.value.trim() || generateDomainFavicon(sanitizedDomain)
        };
        if (isEdit) {
            buttonConfig.domainStyleSettings[index] = updatedItem;
        } else {
            buttonConfig.domainStyleSettings.push(updatedItem);
        }
        localStorage.setItem('chatGPTButtonFoldersConfig', JSON.stringify(buttonConfig));
        // 保存后立即生效
        try { applyDomainStyles(); } catch (_) {}
        closeExistingOverlay(overlay);
        currentAddDomainOverlay = null;
        showStyleSettingsDialog(); // 刷新列表
    });
    footer2.appendChild(saveBtn2);

    dialog.appendChild(footer2);
}


// =============== [新增] showDomainRuleEditorDialog 统一新建/编辑弹窗 ===============
function showDomainRuleEditorDialog(ruleData, onSave) {
    // ruleData 若为空对象，则视为新建，否则编辑
    // 统一使用 createUnifiedDialog
    const isEdit = !!ruleData && ruleData.domain;
    const presetDomain = isEdit ? (ruleData.domain || '') : (window.location.hostname || '');
    const presetFavicon = (isEdit && ruleData.favicon) ? ruleData.favicon : generateDomainFavicon(presetDomain);

    const { overlay, dialog } = createUnifiedDialog({
        title: isEdit ? t('✏️ 编辑自动化规则') : t('🆕 新建新网址规则'),
        width: '480px',
        onClose: () => {
            // 关闭时的回调可写在此
        },
        closeOnOverlayClick: false
    });

    function createAutoSubmitMethodConfigUI(initialMethod = 'Enter', initialAdvanced = null) {
        const methodSection = document.createElement('div');
        methodSection.style.display = 'flex';
        methodSection.style.flexDirection = 'column';
        methodSection.style.gap = '8px';

        const titleRow = document.createElement('div');
        titleRow.style.display = 'flex';
        titleRow.style.alignItems = 'center';
        titleRow.style.justifyContent = 'space-between';

        const methodTitle = document.createElement('div');
        methodTitle.textContent = t('自动提交方式:');
        methodTitle.style.fontSize = '13px';
        methodTitle.style.fontWeight = '600';
        methodTitle.style.color = 'var(--text-color, #1f2937)';
        titleRow.appendChild(methodTitle);

        const expandButton = document.createElement('button');
        expandButton.type = 'button';
        expandButton.title = t('展开/折叠高级选项');
        expandButton.textContent = '▼';
        expandButton.style.width = '28px';
        expandButton.style.height = '28px';
        expandButton.style.padding = '0';
        expandButton.style.display = 'flex';
        expandButton.style.alignItems = 'center';
        expandButton.style.justifyContent = 'center';
        expandButton.style.border = '1px solid transparent';
        expandButton.style.borderRadius = '4px';
        expandButton.style.background = 'transparent';
        expandButton.style.cursor = 'pointer';
        expandButton.style.transition = 'background-color 0.2s ease, border-color 0.2s ease';
        expandButton.addEventListener('mouseenter', () => {
            expandButton.style.backgroundColor = 'var(--button-bg, #f3f4f6)';
            expandButton.style.borderColor = 'var(--border-color, #d1d5db)';
        });
        expandButton.addEventListener('mouseleave', () => {
            expandButton.style.backgroundColor = 'transparent';
            expandButton.style.borderColor = 'transparent';
        });
        titleRow.appendChild(expandButton);
        methodSection.appendChild(titleRow);

        const methodOptionsWrapper = document.createElement('div');
        methodOptionsWrapper.style.display = 'flex';
        methodOptionsWrapper.style.flexWrap = 'wrap';
        methodOptionsWrapper.style.gap = '15px';
        methodSection.appendChild(methodOptionsWrapper);

        const advancedContainer = document.createElement('div');
        advancedContainer.style.display = 'none';
        advancedContainer.style.flexDirection = 'column';
        advancedContainer.style.gap = '10px';
        advancedContainer.style.marginTop = '8px';
        advancedContainer.style.padding = '12px';
        advancedContainer.style.borderRadius = '6px';
        advancedContainer.style.border = '1px solid var(--border-color, #d1d5db)';
        advancedContainer.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
        advancedContainer.style.boxShadow = 'inset 0 1px 2px rgba(15, 23, 42, 0.04)';
        advancedContainer.style.transition = 'opacity 0.2s ease';
        advancedContainer.style.opacity = '0';
        methodSection.appendChild(advancedContainer);

        const methodOptions = [
            { value: 'Enter', text: 'Enter' },
            { value: 'Cmd+Enter', text: 'Cmd+Enter' },
            { value: '模拟点击提交按钮', text: '模拟点击提交按钮' }
        ];

        const methodRadioName = `autoSubmitMethod_${Math.random().toString(36).slice(2, 8)}`;
        const uniqueSuffix = Math.random().toString(36).slice(2, 8);

        const getDefaultAdvancedForMethod = (method) => {
            if (method === 'Cmd+Enter') {
                return { variant: 'cmd' };
            }
            if (method === '模拟点击提交按钮') {
                return { variant: 'default', selector: '' };
            }
            return null;
        };

        const normalizeAdvancedForMethod = (method, advanced) => {
            const defaults = getDefaultAdvancedForMethod(method);
            if (!defaults) return null;
            const normalized = { ...defaults };
            if (advanced && typeof advanced === 'object') {
                if (method === 'Cmd+Enter') {
                    if (advanced.variant && ['cmd', 'ctrl'].includes(advanced.variant)) {
                        normalized.variant = advanced.variant;
                    }
                } else if (method === '模拟点击提交按钮') {
                    if (advanced.variant && ['default', 'selector'].includes(advanced.variant)) {
                        normalized.variant = advanced.variant;
                    }
                    if (advanced.selector && typeof advanced.selector === 'string') {
                        normalized.selector = advanced.selector;
                    }
                }
            }
            if (method === '模拟点击提交按钮' && normalized.variant !== 'selector') {
                normalized.selector = '';
            }
            return normalized;
        };

        let selectedMethod = initialMethod || methodOptions[0].value;
        if (!methodOptions.some(option => option.value === selectedMethod)) {
            methodOptions.push({ value: selectedMethod, text: selectedMethod });
        }

        let advancedState = normalizeAdvancedForMethod(selectedMethod, initialAdvanced);

        const shouldExpandInitially = () => {
            if (!advancedState) return false;
            if (selectedMethod === 'Cmd+Enter') {
                return advancedState.variant === 'ctrl';
            }
            if (selectedMethod === '模拟点击提交按钮') {
                return advancedState.variant === 'selector' && advancedState.selector;
            }
            return false;
        };

        let isExpanded = shouldExpandInitially();

        const renderAdvancedContent = () => {
            setTrustedHTML(advancedContainer, '');
            if (!isExpanded) {
                advancedContainer.style.display = 'none';
                advancedContainer.style.opacity = '0';
                return;
            }

            advancedContainer.style.display = 'flex';
            advancedContainer.style.opacity = '1';

            const advancedTitle = document.createElement('div');
            advancedTitle.textContent = t('高级选项:');
            advancedTitle.style.fontSize = '12px';
            advancedTitle.style.fontWeight = '600';
            advancedTitle.style.opacity = '0.75';
            advancedContainer.appendChild(advancedTitle);

            if (selectedMethod === 'Enter') {
                const tip = document.createElement('div');
                tip.textContent = t('Enter 提交方式没有额外配置。');
                tip.style.fontSize = '12px';
                tip.style.color = 'var(--muted-text-color, #6b7280)';
                advancedContainer.appendChild(tip);
                return;
            }

            if (selectedMethod === 'Cmd+Enter') {
                const variants = [
                    { value: 'cmd', label: 'Cmd + Enter', desc: '使用 macOS / Meta 键组合模拟提交' },
                    { value: 'ctrl', label: 'Ctrl + Enter', desc: '使用 Windows / Linux 控制键组合模拟提交' }
                ];
                const variantGroup = document.createElement('div');
                variantGroup.style.display = 'flex';
                variantGroup.style.flexDirection = 'column';
                variantGroup.style.gap = '8px';

                const variantRadioName = `autoSubmitCmdVariant_${uniqueSuffix}`;
                variants.forEach(variant => {
                    const label = document.createElement('label');
                    label.style.display = 'flex';
                    label.style.alignItems = 'flex-start';
                    label.style.gap = '8px';
                    label.style.cursor = 'pointer';

                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = variantRadioName;
                    radio.value = variant.value;
                    radio.checked = advancedState?.variant === variant.value;
                    radio.style.marginTop = '2px';
                    radio.style.cursor = 'pointer';
                    radio.addEventListener('change', () => {
                        if (radio.checked) {
                            advancedState = { variant: variant.value };
                        }
                    });

                    const textContainer = document.createElement('div');
                    textContainer.style.display = 'flex';
                    textContainer.style.flexDirection = 'column';
                    textContainer.style.gap = '2px';

                    const labelText = document.createElement('span');
                    labelText.textContent = variant.label;
                    labelText.style.fontSize = '13px';
                    labelText.style.fontWeight = '600';

                    const descText = document.createElement('span');
                    descText.textContent = variant.desc;
                    descText.style.fontSize = '12px';
                    descText.style.opacity = '0.75';

                    textContainer.appendChild(labelText);
                    textContainer.appendChild(descText);
                    label.appendChild(radio);
                    label.appendChild(textContainer);
                    variantGroup.appendChild(label);
                });

                advancedContainer.appendChild(variantGroup);
                return;
            }

            if (selectedMethod === '模拟点击提交按钮') {
                const variants = [
                    { value: 'default', label: '默认方法', desc: '自动匹配常见的提交按钮进行点击。' },
                    { value: 'selector', label: '自定义 CSS 选择器', desc: '使用自定义选择器定位需要点击的提交按钮。' }
                ];

                const variantGroup = document.createElement('div');
                variantGroup.style.display = 'flex';
                variantGroup.style.flexDirection = 'column';
                variantGroup.style.gap = '8px';

                const variantRadioName = `autoSubmitClickVariant_${uniqueSuffix}`;
                variants.forEach(variant => {
                    const label = document.createElement('label');
                    label.style.display = 'flex';
                    label.style.alignItems = 'flex-start';
                    label.style.gap = '8px';
                    label.style.cursor = 'pointer';

                    const radio = document.createElement('input');
                    radio.type = 'radio';
                    radio.name = variantRadioName;
                    radio.value = variant.value;
                    radio.checked = advancedState?.variant === variant.value;
                    radio.style.marginTop = '2px';
                    radio.style.cursor = 'pointer';
                    radio.addEventListener('change', () => {
                        if (radio.checked) {
                            advancedState = normalizeAdvancedForMethod(selectedMethod, { variant: variant.value, selector: advancedState?.selector || '' });
                            renderAdvancedContent();
                        }
                    });

                    const textContainer = document.createElement('div');
                    textContainer.style.display = 'flex';
                    textContainer.style.flexDirection = 'column';
                    textContainer.style.gap = '2px';

                    const labelText = document.createElement('span');
                    labelText.textContent = variant.label;
                    labelText.style.fontSize = '13px';
                    labelText.style.fontWeight = '600';

                    const descText = document.createElement('span');
                    descText.textContent = variant.desc;
                    descText.style.fontSize = '12px';
                    descText.style.opacity = '0.75';

                    textContainer.appendChild(labelText);
                    textContainer.appendChild(descText);
                    label.appendChild(radio);
                    label.appendChild(textContainer);
                    variantGroup.appendChild(label);
                });

                advancedContainer.appendChild(variantGroup);

                if (advancedState?.variant === 'selector') {
                    const selectorInput = document.createElement('input');
                    selectorInput.type = 'text';
                    selectorInput.placeholder = t('如：button.send-btn 或 form button[type="submit"]');
                    selectorInput.value = advancedState.selector || '';
                    selectorInput.style.width = '100%';
                    selectorInput.style.height = '40px';
                    selectorInput.style.padding = '0 12px';
                    selectorInput.style.border = '1px solid var(--border-color, #d1d5db)';
                    selectorInput.style.borderRadius = '6px';
                    selectorInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
                    selectorInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
                    selectorInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
                    selectorInput.style.outline = 'none';
                    selectorInput.style.fontSize = '14px';
                    selectorInput.addEventListener('input', () => {
                        advancedState = normalizeAdvancedForMethod(selectedMethod, {
                            variant: 'selector',
                            selector: selectorInput.value
                        });
                    });
                    advancedContainer.appendChild(selectorInput);

                    const hint = document.createElement('div');
                    hint.textContent = t('请输入能唯一定位提交按钮的 CSS 选择器。');
                    hint.style.fontSize = '12px';
                    hint.style.color = 'var(--muted-text-color, #6b7280)';
                    advancedContainer.appendChild(hint);
                }
                return;
            }

            const tip = document.createElement('div');
            tip.textContent = t('当前提交方式没有可配置的高级选项。');
            tip.style.fontSize = '12px';
            tip.style.color = 'var(--muted-text-color, #6b7280)';
            advancedContainer.appendChild(tip);
        };

        methodOptions.forEach(option => {
            const radioLabel = document.createElement('label');
            radioLabel.style.display = 'inline-flex';
            radioLabel.style.alignItems = 'center';
            radioLabel.style.cursor = 'pointer';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = methodRadioName;
            radio.value = option.value;
            radio.checked = selectedMethod === option.value;
            radio.style.marginRight = '6px';
            radio.style.cursor = 'pointer';
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    selectedMethod = option.value;
                    advancedState = normalizeAdvancedForMethod(selectedMethod, null);
                    renderAdvancedContent();
                }
            });

            radioLabel.appendChild(radio);
            radioLabel.appendChild(document.createTextNode(option.text));
            methodOptionsWrapper.appendChild(radioLabel);
        });

        expandButton.addEventListener('click', () => {
            isExpanded = !isExpanded;
            expandButton.textContent = isExpanded ? '▲' : '▼';
            expandButton.setAttribute('aria-expanded', String(isExpanded));
            renderAdvancedContent();
        });

        expandButton.setAttribute('aria-expanded', String(isExpanded));
        expandButton.textContent = isExpanded ? '▲' : '▼';
        renderAdvancedContent();

        return {
            container: methodSection,
            getConfig: () => {
                const normalized = normalizeAdvancedForMethod(selectedMethod, advancedState);
                let advancedForSave = null;
                if (selectedMethod === 'Cmd+Enter' && normalized && normalized.variant && normalized.variant !== 'cmd') {
                    advancedForSave = { variant: normalized.variant };
                } else if (selectedMethod === '模拟点击提交按钮' && normalized) {
                    if (normalized.variant === 'selector') {
                        advancedForSave = {
                            variant: 'selector',
                            selector: typeof normalized.selector === 'string' ? normalized.selector : ''
                        };
                    } else if (normalized.variant !== 'default') {
                        advancedForSave = { variant: normalized.variant };
                    }
                }
                return {
                    method: selectedMethod,
                    advanced: advancedForSave
                };
            }
        };
    }

    // 创建表单容器
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.marginBottom = '16px';
    container.style.padding = '16px';
    container.style.borderRadius = '6px';
    container.style.border = '1px solid var(--border-color, #e5e7eb)';
    container.style.backgroundColor = 'var(--button-bg, #f3f4f6)';

    // 网址
    const domainLabel = document.createElement('label');
    domainLabel.textContent = t('网址：');
    domainLabel.style.display = 'flex';
    domainLabel.style.flexDirection = 'column';
    domainLabel.style.gap = '6px';
    domainLabel.style.fontSize = '13px';
    domainLabel.style.fontWeight = '600';
    domainLabel.style.color = 'var(--text-color, #1f2937)';
    const domainInput = document.createElement('input');
    domainInput.type = 'text';
    domainInput.style.width = '100%';
    domainInput.style.height = '40px';
    domainInput.style.padding = '0 12px';
    domainInput.style.border = '1px solid var(--border-color, #d1d5db)';
    domainInput.style.borderRadius = '6px';
   domainInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    domainInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    domainInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    domainInput.style.outline = 'none';
    domainInput.style.fontSize = '14px';
    domainInput.value = presetDomain;
    domainLabel.appendChild(domainInput);
    container.appendChild(domainLabel);

    let nameInputRef = null;

    // 备注名称
    const nameLabel = document.createElement('label');
    nameLabel.textContent = t('备注名称：');
    nameLabel.style.display = 'flex';
    nameLabel.style.flexDirection = 'column';
    nameLabel.style.gap = '6px';
    nameLabel.style.fontSize = '13px';
    nameLabel.style.fontWeight = '600';
    nameLabel.style.color = 'var(--text-color, #1f2937)';
    nameInputRef = document.createElement('input');
    nameInputRef.type = 'text';
    nameInputRef.style.width = '100%';
    nameInputRef.style.height = '40px';
    nameInputRef.style.padding = '0 12px';
    nameInputRef.style.border = '1px solid var(--border-color, #d1d5db)';
    nameInputRef.style.borderRadius = '6px';
    nameInputRef.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    nameInputRef.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    nameInputRef.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    nameInputRef.style.outline = 'none';
    nameInputRef.style.fontSize = '14px';
    nameInputRef.value = isEdit ? (ruleData.name || '') : (document.title || t('新网址规则'));
    nameLabel.appendChild(nameInputRef);
    container.appendChild(nameLabel);

    // favicon
    const faviconLabel = document.createElement('label');
    faviconLabel.textContent = t('站点图标：');
    faviconLabel.style.display = 'flex';
    faviconLabel.style.flexDirection = 'column';
    faviconLabel.style.gap = '6px';
    faviconLabel.style.fontSize = '13px';
    faviconLabel.style.fontWeight = '600';
    faviconLabel.style.color = 'var(--text-color, #1f2937)';

    const faviconFieldWrapper = document.createElement('div');
    faviconFieldWrapper.style.display = 'flex';
    faviconFieldWrapper.style.alignItems = 'flex-start';
    faviconFieldWrapper.style.gap = '12px';

    const faviconPreviewHolder = document.createElement('div');
    faviconPreviewHolder.style.width = '40px';
    faviconPreviewHolder.style.height = '40px';
    faviconPreviewHolder.style.borderRadius = '10px';
    faviconPreviewHolder.style.display = 'flex';
    faviconPreviewHolder.style.alignItems = 'center';
    faviconPreviewHolder.style.justifyContent = 'center';
    faviconPreviewHolder.style.backgroundColor = 'transparent';
    faviconPreviewHolder.style.flexShrink = '0';

    const faviconControls = document.createElement('div');
    faviconControls.style.display = 'flex';
    faviconControls.style.flexDirection = 'column';
    faviconControls.style.gap = '8px';
    faviconControls.style.flex = '1';

    const faviconInput = document.createElement('textarea');
    faviconInput.rows = 1;
    faviconInput.style.flex = '1 1 auto';
    faviconInput.style.padding = '10px 12px';
    faviconInput.style.border = '1px solid var(--border-color, #d1d5db)';
    faviconInput.style.borderRadius = '6px';
    faviconInput.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    faviconInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.03)';
    faviconInput.style.transition = 'border-color 0.2s ease, box-shadow 0.2s ease';
    faviconInput.style.outline = 'none';
    faviconInput.style.fontSize = '14px';
    faviconInput.style.lineHeight = '1.5';
    faviconInput.style.resize = 'vertical';
    faviconInput.style.overflowY = 'hidden';
    faviconInput.placeholder = t('支持 https:// 链接或 data: URL');
    faviconInput.value = presetFavicon || '';
    const resizeFaviconTextarea = () => autoResizeTextarea(faviconInput, { minRows: 1, maxRows: 4 });

    const faviconActionsRow = document.createElement('div');
    faviconActionsRow.style.display = 'flex';
    faviconActionsRow.style.alignItems = 'center';
    faviconActionsRow.style.gap = '8px';
    faviconActionsRow.style.flexWrap = 'nowrap';
    faviconActionsRow.style.fontSize = '12px';
    faviconActionsRow.style.color = 'var(--muted-text-color, #6b7280)';
    faviconActionsRow.style.justifyContent = 'flex-start';

    const faviconHelp = document.createElement('span');
    faviconHelp.textContent = t('留空时将自动根据网址生成 Google Favicon。');
    faviconHelp.style.flex = '1';
    faviconHelp.style.minWidth = '0';
    faviconHelp.style.marginRight = '12px';

    const autoFaviconBtn = document.createElement('button');
    autoFaviconBtn.type = 'button';
    autoFaviconBtn.setAttribute('aria-label', t('自动获取站点图标'));
    autoFaviconBtn.title = t('自动获取站点图标');
    autoFaviconBtn.style.backgroundColor = 'var(--dialog-bg, #ffffff)';
    autoFaviconBtn.style.border = '1px solid var(--border-color, #d1d5db)';
    autoFaviconBtn.style.borderRadius = '50%';
    autoFaviconBtn.style.width = '32px';
    autoFaviconBtn.style.height = '32px';
    autoFaviconBtn.style.display = 'flex';
    autoFaviconBtn.style.alignItems = 'center';
    autoFaviconBtn.style.justifyContent = 'center';
    autoFaviconBtn.style.cursor = 'pointer';
    autoFaviconBtn.style.boxShadow = '0 2px 6px rgba(59, 130, 246, 0.16)';
    autoFaviconBtn.style.flexShrink = '0';
    autoFaviconBtn.style.padding = '0';

    const autoFaviconIcon = createAutoFaviconIcon();
    autoFaviconBtn.appendChild(autoFaviconIcon);

    faviconActionsRow.appendChild(faviconHelp);
    faviconActionsRow.appendChild(autoFaviconBtn);

    faviconControls.appendChild(faviconInput);
    faviconControls.appendChild(faviconActionsRow);

    faviconFieldWrapper.appendChild(faviconPreviewHolder);
    faviconFieldWrapper.appendChild(faviconControls);

    faviconLabel.appendChild(faviconFieldWrapper);
    container.appendChild(faviconLabel);

    let faviconManuallyEdited = false;
    const updateFaviconPreview = () => {
        const currentFavicon = faviconInput.value.trim();
        setTrustedHTML(faviconPreviewHolder, '');
        faviconPreviewHolder.appendChild(
            createFaviconElement(
                currentFavicon || generateDomainFavicon(domainInput.value.trim()),
                (nameInputRef ? nameInputRef.value.trim() : '') || domainInput.value.trim() || t('自动化'),
                '⚡',
                { withBackground: false }
            )
        );
    };

    const getFallbackFavicon = () => generateDomainFavicon(domainInput.value.trim());

    autoFaviconBtn.addEventListener('click', () => {
        const autoUrl = getFallbackFavicon();
        faviconInput.value = autoUrl;
        faviconManuallyEdited = false;
        updateFaviconPreview();
        resizeFaviconTextarea();
    });

    domainInput.addEventListener('input', () => {
        if (!faviconManuallyEdited) {
            faviconInput.value = getFallbackFavicon();
        }
        updateFaviconPreview();
        resizeFaviconTextarea();
    });

    faviconInput.addEventListener('input', () => {
        faviconManuallyEdited = true;
        updateFaviconPreview();
        resizeFaviconTextarea();
    });

    nameInputRef.addEventListener('input', updateFaviconPreview);

    updateFaviconPreview();
    resizeFaviconTextarea();
    requestAnimationFrame(resizeFaviconTextarea);

    const methodConfigUI = createAutoSubmitMethodConfigUI(
        (isEdit && ruleData.method) ? ruleData.method : 'Enter',
        isEdit ? ruleData.methodAdvanced : null
    );
    container.appendChild(methodConfigUI.container);

    // 确认 & 取消 按钮
    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'space-between';
    btnRow.style.alignItems = 'center';
    btnRow.style.gap = '12px';
    btnRow.style.marginTop = '20px';
    btnRow.style.paddingTop = '20px';
    btnRow.style.borderTop = '1px solid var(--border-color, #e5e7eb)';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = t('取消');
    cancelBtn.style.backgroundColor = 'var(--cancel-color,#6B7280)';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.border = 'none';
    cancelBtn.style.borderRadius = '4px';
    cancelBtn.style.padding = '8px 16px';
    cancelBtn.style.fontSize = '14px';
    cancelBtn.style.cursor = 'pointer';
    cancelBtn.addEventListener('click', () => {
        overlay.remove();
    });

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = t('确认');
    confirmBtn.style.backgroundColor = 'var(--success-color,#22c55e)';
    confirmBtn.style.color = '#fff';
    confirmBtn.style.border = 'none';
    confirmBtn.style.borderRadius = '4px';
    confirmBtn.style.padding = '8px 16px';
    confirmBtn.style.fontSize = '14px';
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.addEventListener('click', () => {
        const sanitizedDomain = domainInput.value.trim();
        const sanitizedName = nameInputRef.value.trim();
        const methodConfig = methodConfigUI.getConfig();
        const methodAdvanced = methodConfig.advanced;
        const newData = {
            domain: sanitizedDomain,
            name: sanitizedName,
            method: methodConfig.method,
            favicon: faviconInput.value.trim() || generateDomainFavicon(sanitizedDomain)
        };

        if(!newData.domain || !newData.name) {
            alert(t('请输入网址和备注名称！'));
            return;
        }

        if (methodConfig.method === '模拟点击提交按钮' && methodAdvanced && methodAdvanced.variant === 'selector') {
            const trimmedSelector = methodAdvanced.selector ? methodAdvanced.selector.trim() : '';
            if (!trimmedSelector) {
                alert(t('请输入有效的 CSS 选择器！'));
                return;
            }
            try {
                document.querySelector(trimmedSelector);
            } catch (err) {
                alert(t('CSS 选择器语法错误，请检查后再试！'));
                return;
            }
            methodAdvanced.selector = trimmedSelector;
        }

        if (methodAdvanced) {
            newData.methodAdvanced = methodAdvanced;
        }

        // 回调保存
        if(onSave) onSave(newData);
        // 关闭
        overlay.remove();
    });

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);

    // 组装
    dialog.appendChild(container);
    dialog.appendChild(btnRow);

}

function isValidDomainInput(str) {
    // 简易：包含'.' 不含空格 即视为有效
    if (str.includes(' ')) return false;
    if (!str.includes('.')) return false;
    return true;
}
/* -------------------------------------------------------------------------- *
 * Module 07 · Initialization workflow and runtime observers
 * -------------------------------------------------------------------------- */

    const initialize = () => {
        attachButtons();
        const observer = new MutationObserver((mutations) => {
            let triggered = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            observeShadowRoots(node);
                            triggered = true;
                        }
                    });
                }
            });
            if (triggered) {
                attachButtons();
                console.log(t('🔔 DOM 发生变化，尝试重新附加按钮。'));
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        console.log(t('🔔 MutationObserver 已启动，监听 DOM 变化。'));

        // 先尝试一次；再延迟一次，保证容器创建完成后也能生效
        try { applyDomainStyles(); } catch (_) {}
        setTimeout(() => { try { applyDomainStyles(); } catch (_) {} }, 350);
    };

    window.addEventListener('load', () => {
        console.log(t('⏳ 页面已完全加载，开始初始化脚本。'));
        initialize();
    });

    // 动态更新样式以适应主题变化
    const updateStylesOnThemeChange = () => {
        // Since we're using CSS variables, the styles are updated automatically
        // Just update the button container to apply new styles
        updateButtonContainer();
        // 重新应用一次域名样式，防止主题切换后高度或注入样式丢失
        try { applyDomainStyles(); } catch (_) {}
    };

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        setCSSVariables(getCurrentTheme());
        updateStylesOnThemeChange();
        console.log(t('🌓 主题模式已切换，样式已更新。'));
    });

    // Initial setting of CSS variables
    setCSSVariables(getCurrentTheme());
})();

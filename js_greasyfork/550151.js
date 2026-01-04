// ==UserScript==
// @name         Auto lang attr
// @name:zh-CN   自动 lang 属性
// @namespace    auto.lang.attr
// @version      1.0
// @description       Automatically detect page language and add lang attribute to html tag, helps browser display proper fonts and typography
// @description:zh-CN 自动监测页面语言并给 html 元素添加 lang 标签，有助于浏览器正确显示字体和排版
// @author       o
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550151/Auto%20lang%20attr.user.js
// @updateURL https://update.greasyfork.org/scripts/550151/Auto%20lang%20attr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Whitelist management
    const WHITELIST_KEY = 'lang_attr_whitelist';
    let whitelist = GM_getValue(WHITELIST_KEY, []);
    let menuCommandId = null;

    // Get current domain
    const currentDomain = window.location.hostname;

    // Check if current domain is in whitelist
    const isWhitelisted = whitelist.includes(currentDomain);

    // Register menu command
    function registerMenuCommand() {
        if (menuCommandId !== null) {
            GM_unregisterMenuCommand(menuCommandId);
        }

        const commandText = isWhitelisted ?
            `Enable for ${currentDomain}` :
            `Disable for ${currentDomain}`;

        menuCommandId = GM_registerMenuCommand(commandText, toggleWhitelist);
    }

    // Toggle domain in whitelist
    function toggleWhitelist() {
        if (isWhitelisted) {
            // Remove from whitelist
            whitelist = whitelist.filter(domain => domain !== currentDomain);
        } else {
            // Add to whitelist
            whitelist.push(currentDomain);
        }

        GM_setValue(WHITELIST_KEY, whitelist);
        window.location.reload(); // Reload to apply changes
    }

    // Register the menu command
    registerMenuCommand();

    // If whitelisted and enabled, skip processing
    if (isWhitelisted) {
        return;
    }

    // Check if html tag already has lang attribute
    const htmlElement = document.documentElement;
    if (htmlElement.hasAttribute('lang')) {
        return; // Exit if lang attribute already exists
    }

    // Function to detect language from text content
    function detectLanguage(text) {
        // Common language patterns (simplified detection)
        const languagePatterns = {
            'en': /\b(the|and|to|of|a|in|that|is|for|it)\b/gi,
            'es': /\b(el|la|los|las|de|que|y|en|a|un)\b/gi,
            'fr': /\b(le|la|les|de|et|à|en|des|un|une)\b/gi,
            'de': /\b(der|die|das|und|in|zu|den|von|mit|sich)\b/gi,
            'pt': /\b(o|a|os|as|de|e|em|um|uma|que)\b/gi,
            'it': /\b(il|lo|la|i|gli|le|di|e|a|in)\b/gi,
            'ru': /\b(и|в|не|на|я|что|с|а|он|к)\b/gi,
            'zh': /[\u4e00-\u9fff]/g, // Chinese characters
            'ja': /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/g, // Hiragana, Katakana, Kanji
            'ko': /[\uac00-\ud7af\u1100-\u11ff]/g, // Hangul syllables and jamo
            'ar': /[\u0600-\u06FF]/g, // Arabic script
            'hi': /[\u0900-\u097F]/g // Devanagari script (Hindi)
        };

        let maxCount = 0;
        let detectedLang = 'en'; // Default to English

        // Count occurrences of language patterns
        for (const [lang, pattern] of Object.entries(languagePatterns)) {
            const matches = text.match(pattern);
            const count = matches ? matches.length : 0;

            if (count > maxCount) {
                maxCount = count;
                detectedLang = lang;
            }
        }

        // If no strong pattern matches found, use more sophisticated detection
        if (maxCount < 3) {
            // Try to detect from meta tags
            const metaLang = document.querySelector('meta[http-equiv="content-language"], meta[name="language"]');
            if (metaLang && metaLang.content) {
                return metaLang.content.split('-')[0]; // Get primary language code
            }

            // Try to detect from charset or other hints
            const charset = document.characterSet || document.charset;
            if (charset && charset.toLowerCase().includes('utf')) {
                // For UTF pages, we might need more context
                // Check for specific language indicators in the page
                const bodyText = document.body.textContent.toLowerCase();
                if (bodyText.includes('的') || bodyText.includes('是')) return 'zh';
                if (bodyText.includes('は') || bodyText.includes('です')) return 'ja';
                if (bodyText.includes('입니다') || bodyScript.includes('는')) return 'ko';
            }
        }

        return detectedLang;
    }

    // Get text content from the page (limit to first 5000 chars for performance)
    const pageText = document.body.textContent.substring(0, 5000);

    if (pageText.trim().length > 100) { // Only detect if there's sufficient text
        const detectedLanguage = detectLanguage(pageText.toLowerCase());

        // Set the lang attribute
        htmlElement.setAttribute('lang', detectedLanguage);

        console.log(`Language detected: ${detectedLanguage}, lang attribute added to html tag`);
    }
})();
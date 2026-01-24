// ==UserScript==
// @name         Greasyfork – Auto-Translator (v19)
// @namespace    http://tampermonkey.net/
// @version      19
// @description  Translates ANY foreign language on Greasyfork to your chosen language (20+ languages supported)
// @author       Solomon
// @match        https://greasyfork.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      translate.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/555224/Greasyfork%20%E2%80%93%20Auto-Translator%20%28v19%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555224/Greasyfork%20%E2%80%93%20Auto-Translator%20%28v19%29.meta.js
// ==/UserScript==

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 CHANGELOG
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Previous Features (Preserved):
 * ✅ Auto-translate foreign content on page load
 * ✅ 20+ supported languages
 * ✅ Smart language detection
 * ✅ Draggable control panel
 * ✅ Restore original text
 * ✅ Translation badges
 * ✅ Language preference saved
 *
 * 🆕 NEW in v18:
 * 🐛 Fixed language selector text color (now black, was invisible white)
 *
 * 🆕 NEW in v19:
 * 🐛 Fixed: Restore now STOPS auto-translate (won't re-translate after restore)
 * 🐛 Fixed: Better Korean text detection (handles mixed brackets/special chars)
 * ✨ Added: Citrus GFork theme compatibility (thanks decembre!)
 * ✨ Added: Toggle to enable/disable auto-translate from panel
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════════

    const CONFIG = {
        debug: false,                 // Console logging
        minTextLength: 5,             // Minimum text length to translate (reduced for short titles)
        translationDelay: 250,        // Delay between translations (ms)
        maxConcurrent: 3,             // Max concurrent translation requests
        retryAttempts: 2,             // Retry failed translations
        retryDelay: 1000              // Delay before retry (ms)
    };

    // 🌍 Supported target languages
    const LANGUAGES = {
        en: { name: 'English', flag: '🇺🇸' },
        es: { name: 'Spanish', flag: '🇪🇸' },
        fr: { name: 'French', flag: '🇫🇷' },
        de: { name: 'German', flag: '🇩🇪' },
        it: { name: 'Italian', flag: '🇮🇹' },
        pt: { name: 'Portuguese', flag: '🇵🇹' },
        ru: { name: 'Russian', flag: '🇷🇺' },
        zh: { name: 'Chinese', flag: '🇨🇳' },
        ja: { name: 'Japanese', flag: '🇯🇵' },
        ko: { name: 'Korean', flag: '🇰🇷' },
        ar: { name: 'Arabic', flag: '🇸🇦' },
        hi: { name: 'Hindi', flag: '🇮🇳' },
        tr: { name: 'Turkish', flag: '🇹🇷' },
        pl: { name: 'Polish', flag: '🇵🇱' },
        nl: { name: 'Dutch', flag: '🇳🇱' },
        vi: { name: 'Vietnamese', flag: '🇻🇳' },
        th: { name: 'Thai', flag: '🇹🇭' },
        id: { name: 'Indonesian', flag: '🇮🇩' },
        he: { name: 'Hebrew', flag: '🇮🇱' },
        uk: { name: 'Ukrainian', flag: '🇺🇦' }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 📊 STATE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    const state = {
        processedElements: new WeakSet(),
        translationCount: 0,
        targetLanguage: GM_getValue('targetLanguage', 'en'),
        autoTranslate: GM_getValue('autoTranslate', true),  // 🆕 v19: Saveable auto-translate
        isTranslating: false,
        wasRestored: false,  // 🆕 v19: Track if restore was clicked
        translationQueue: [],
        activeRequests: 0
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎨 STYLES (with Citrus GFork compatibility)
    // ═══════════════════════════════════════════════════════════════════════════

    GM_addStyle(`
        /* Translation Badge - Citrus compatible */
        .gf-translation-badge {
            display: inline-block;
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white !important;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            margin-left: 6px;
            font-weight: bold;
            vertical-align: middle;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        /* Formatted Text - Citrus compatible */
        .gf-formatted-text {
            line-height: 1.6 !important;
            font-size: 14px !important;
        }
        .gf-formatted-text .gf-item {
            display: block !important;
            margin: 8px 0 !important;
            line-height: 1.6 !important;
        }
        .gf-formatted-text .gf-item strong {
            color: #2e7d32 !important;
            font-weight: 600 !important;
        }

        /* Control Panel - Citrus compatible with !important overrides */
        #gf-translator-panel {
            position: fixed;
            background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%) !important;
            border: 2px solid #4caf50 !important;
            border-radius: 12px !important;
            padding: 12px !important;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
            z-index: 999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
            min-width: 220px;
            max-width: 240px;
            cursor: move;
            user-select: none;
            transition: box-shadow 0.3s ease;
            color: #333333 !important;
        }
        #gf-translator-panel.dragging { cursor: grabbing !important; }
        #gf-translator-panel:hover { box-shadow: 0 12px 35px rgba(0,0,0,0.2) !important; }
        #gf-translator-panel.minimized { min-width: 140px; padding: 8px !important; }

        /* Panel Header - Citrus compatible */
        .gf-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid #4caf50 !important;
        }
        .gf-panel-title {
            font-weight: bold;
            color: #2e7d32 !important;
            font-size: 14px;
            flex: 1;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .gf-panel-controls { display: flex; gap: 4px; }
        .gf-panel-btn {
            width: 22px;
            height: 22px;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            background: #f0f0f0 !important;
            color: #333 !important;
        }
        .gf-panel-btn:hover { transform: scale(1.1); }
        .gf-minimize-btn { background: #FFC107 !important; color: white !important; }
        .gf-minimize-btn:hover { background: #FFB300 !important; }
        .gf-close-btn { background: #f44336 !important; color: white !important; }
        .gf-close-btn:hover { background: #e53935 !important; }

        /* Panel Content */
        .gf-panel-content { display: block; }
        .gf-panel-content.hidden { display: none; }

        /* Language Selector - v18 fix + Citrus compatible */
        .gf-lang-selector {
            width: 100%;
            padding: 8px 10px;
            border: 2px solid #e0e0e0 !important;
            border-radius: 6px !important;
            font-size: 12px;
            margin-bottom: 10px;
            background: #ffffff !important;
            color: #333333 !important;
            cursor: pointer;
            transition: border-color 0.2s;
            font-family: inherit;
        }
        .gf-lang-selector option {
            color: #333333 !important;
            background: #ffffff !important;
        }
        .gf-lang-selector:hover { border-color: #4caf50 !important; }
        .gf-lang-selector:focus {
            outline: none;
            border-color: #4caf50 !important;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        /* Stats Box - Citrus compatible */
        .gf-stat-box {
            margin-bottom: 10px;
            font-size: 12px;
            color: #555 !important;
            background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%) !important;
            padding: 10px;
            border-radius: 8px !important;
            text-align: center;
            border: 1px solid #c8e6c9 !important;
        }
        .gf-stat-count {
            font-size: 24px;
            font-weight: bold;
            color: #2e7d32 !important;
            display: block;
            line-height: 1;
            margin-bottom: 4px;
        }
        .gf-stat-label {
            font-size: 10px;
            color: #666 !important;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* 🆕 v19: Auto-translate toggle row */
        .gf-toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            margin-bottom: 10px;
            background: #f5f5f5 !important;
            border-radius: 6px !important;
            font-size: 12px;
            color: #333 !important;
        }
        .gf-toggle-label {
            font-weight: 500;
        }
        .gf-toggle-switch {
            position: relative;
            width: 40px;
            height: 22px;
            background: #ccc !important;
            border-radius: 11px !important;
            cursor: pointer;
            transition: background 0.2s ease;
        }
        .gf-toggle-switch.on {
            background: #4caf50 !important;
        }
        .gf-toggle-switch::after {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            width: 18px;
            height: 18px;
            background: white !important;
            border-radius: 50% !important;
            transition: left 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .gf-toggle-switch.on::after {
            left: 20px;
        }

        /* Buttons - Citrus compatible */
        .gf-btn {
            width: 100%;
            padding: 10px;
            border: none !important;
            border-radius: 6px !important;
            cursor: pointer;
            font-weight: 600;
            font-size: 12px;
            margin-bottom: 6px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }
        .gf-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .gf-btn:active { transform: translateY(0); }
        .gf-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
        }
        .gf-btn-primary {
            background: linear-gradient(135deg, #4caf50 0%, #43a047 100%) !important;
            color: white !important;
        }
        .gf-btn-primary:hover { background: linear-gradient(135deg, #43a047 0%, #388e3c 100%) !important; }
        .gf-btn-secondary {
            background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
            color: white !important;
        }
        .gf-btn-secondary:hover { background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%) !important; }
        .gf-btn-tertiary {
            background: #f5f5f5 !important;
            color: #333 !important;
            border: 1px solid #ddd !important;
        }
        .gf-btn-tertiary:hover { background: #eeeeee !important; }

        /* Status Bar - Citrus compatible */
        #gf-status-bar {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50 0%, #43a047 100%) !important;
            color: white !important;
            padding: 12px 20px;
            border-radius: 8px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
            z-index: 999998 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease;
        }
        @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        /* Detected language badge */
        .gf-detected-lang {
            font-size: 9px;
            background: rgba(255,255,255,0.2) !important;
            padding: 1px 4px;
            border-radius: 2px !important;
            margin-left: 4px;
            color: white !important;
        }
    `);

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔧 UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    function debugLog(...args) {
        if (CONFIG.debug) console.log('🌐 [v19]', ...args);
    }

    function showStatus(message, duration = 3000) {
        let statusBar = document.getElementById('gf-status-bar');
        if (!statusBar) {
            statusBar = document.createElement('div');
            statusBar.id = 'gf-status-bar';
            document.body.appendChild(statusBar);
        }
        statusBar.innerHTML = message;
        statusBar.style.display = 'flex';
        if (duration > 0) {
            setTimeout(() => {
                statusBar.style.display = 'none';
            }, duration);
        }
    }

    function hideStatus() {
        const statusBar = document.getElementById('gf-status-bar');
        if (statusBar) statusBar.style.display = 'none';
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔍 LANGUAGE DETECTION (v19: Improved Korean detection)
    // ═══════════════════════════════════════════════════════════════════════════

    function isTargetLanguageText(text, targetLang) {
        // Language-specific character patterns
        const langPatterns = {
            en: /^[a-zA-Z\s\d\.,;:!?()\-"'@#$%&*+=\[\]{}|\\/<>~`]+$/,
            es: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ¿¡\s\d\.,;:!?()\-"']+$/,
            fr: /^[a-zA-ZàâäéèêëïîôùûüÿçœæÀÂÄÉÈÊËÏÎÔÙÛÜŸÇŒÆ\s\d\.,;:!?()\-"']+$/,
            de: /^[a-zA-ZäöüßÄÖÜ\s\d\.,;:!?()\-"']+$/,
            it: /^[a-zA-ZàèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ\s\d\.,;:!?()\-"']+$/,
            pt: /^[a-zA-ZáàâãéêíóôõúüçÁÀÂÃÉÊÍÓÔÕÚÜÇ\s\d\.,;:!?()\-"']+$/,
            ru: /[\u0400-\u04FF]/,
            zh: /[\u4e00-\u9fff\u3400-\u4dbf]/,
            ja: /[\u3040-\u30ff\u4e00-\u9fff]/,
            ko: /[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f]/,  // 🆕 v19: Added more Korean ranges
            ar: /[\u0600-\u06ff\u0750-\u077f]/,
            he: /[\u0590-\u05ff]/,
            th: /[\u0e00-\u0e7f]/,
            vi: /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i,
            tr: /[çğıöşüÇĞİÖŞÜ]/,
            pl: /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/,
            nl: /^[a-zA-Z\s\d\.,;:!?()\-"']+$/,
            uk: /[\u0400-\u04FF]/,
            hi: /[\u0900-\u097F]/,
            id: /^[a-zA-Z\s\d\.,;:!?()\-"']+$/
        };

        const pattern = langPatterns[targetLang];
        if (!pattern) return false;

        // For script-based languages, check if text CONTAINS those characters
        if (['ru', 'zh', 'ja', 'ko', 'ar', 'he', 'th', 'uk', 'hi'].includes(targetLang)) {
            return pattern.test(text);
        }

        return pattern.test(text);
    }

    /**
     * 🆕 v19: Improved detection for foreign text
     * Now handles Korean and other scripts mixed with brackets/special chars
     */
    function containsForeignScript(text) {
        // Check for various non-Latin scripts
        const foreignPatterns = [
            /[\u0400-\u04FF]/,           // Cyrillic (Russian, Ukrainian)
            /[\u4e00-\u9fff]/,           // CJK (Chinese, Japanese Kanji)
            /[\u3040-\u30ff]/,           // Japanese Hiragana/Katakana
            /[\uac00-\ud7af]/,           // Korean Hangul syllables
            /[\u1100-\u11ff]/,           // Korean Jamo
            /[\u3130-\u318f]/,           // Korean compatibility Jamo
            /[\u0600-\u06ff]/,           // Arabic
            /[\u0590-\u05ff]/,           // Hebrew
            /[\u0e00-\u0e7f]/,           // Thai
            /[\u0900-\u097F]/,           // Hindi/Devanagari
        ];

        return foreignPatterns.some(pattern => pattern.test(text));
    }

    function shouldTranslate(text) {
        if (!text || text.length < CONFIG.minTextLength) return false;

        const cleanText = text.trim();
        const targetLang = state.targetLanguage;

        // 🆕 v19: Check if contains foreign script (more reliable than checking if NOT target lang)
        if (containsForeignScript(cleanText)) {
            // If target is one of these scripts, check if it matches
            if (['ru', 'zh', 'ja', 'ko', 'ar', 'he', 'th', 'uk', 'hi'].includes(targetLang)) {
                if (isTargetLanguageText(cleanText, targetLang)) {
                    debugLog('⏭️ Skipping - already in target script:', targetLang);
                    return false;
                }
            }
            debugLog('✅ Will translate (foreign script detected):', cleanText.substring(0, 50) + '...');
            return true;
        }

        // For Latin-based target languages, check if already in that language
        if (isTargetLanguageText(cleanText, targetLang)) {
            debugLog('⏭️ Skipping - already in target language:', targetLang);
            return false;
        }

        // Check if text contains meaningful content
        const hasLetters = /[a-zA-Z\u0080-\uffff]/.test(cleanText);
        if (!hasLetters) {
            debugLog('⏭️ Skipping - no translatable content');
            return false;
        }

        debugLog('✅ Will translate:', cleanText.substring(0, 50) + '...');
        return true;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🌐 TRANSLATION API
    // ═══════════════════════════════════════════════════════════════════════════

    async function translateText(text, attempt = 1) {
        const targetLang = state.targetLanguage;

        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&dt=ld&q=${encodeURIComponent(text.trim())}`;

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    },
                    timeout: 15000,
                    onload: (response) => {
                        try {
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                if (data && data[0]) {
                                    let result = '';
                                    let detectedLang = data[2] || 'unknown';

                                    data[0].forEach(item => {
                                        if (item && item[0]) result += item[0];
                                    });

                                    if (result && result !== text) {
                                        debugLog(`✅ Translated from ${detectedLang}:`, result.substring(0, 50));
                                        resolve({ text: result, detectedLang });
                                    } else {
                                        resolve({ text, detectedLang: null });
                                    }
                                } else {
                                    resolve({ text, detectedLang: null });
                                }
                            } else if (attempt < CONFIG.retryAttempts) {
                                debugLog(`⚠️ Retry ${attempt}/${CONFIG.retryAttempts}...`);
                                setTimeout(() => {
                                    translateText(text, attempt + 1).then(resolve);
                                }, CONFIG.retryDelay);
                            } else {
                                resolve({ text, detectedLang: null });
                            }
                        } catch (e) {
                            debugLog('❌ Parse error:', e);
                            resolve({ text, detectedLang: null });
                        }
                    },
                    onerror: (error) => {
                        debugLog('❌ Request error:', error);
                        if (attempt < CONFIG.retryAttempts) {
                            setTimeout(() => {
                                translateText(text, attempt + 1).then(resolve);
                            }, CONFIG.retryDelay);
                        } else {
                            resolve({ text, detectedLang: null });
                        }
                    },
                    ontimeout: () => {
                        debugLog('❌ Timeout');
                        resolve({ text, detectedLang: null });
                    }
                });
            });
        } catch (error) {
            debugLog('❌ Exception:', error);
            return { text, detectedLang: null };
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 📝 TEXT FORMATTING & REPLACEMENT
    // ═══════════════════════════════════════════════════════════════════════════

    function createNaturalFormat(translatedText) {
        const parts = translatedText.split(/(?=\d+\.\s)/);
        let html = '<div class="gf-formatted-text">';

        parts.forEach(part => {
            part = part.trim();
            if (!part) return;

            if (/^\d+\.\s/.test(part)) {
                const match = part.match(/^(\d+\.\s)(.+)/s);
                if (match) {
                    html += `<span class="gf-item"><strong>${match[1]}</strong>${match[2].trim()}</span>`;
                }
            } else {
                html += `<span class="gf-item">${part}</span>`;
            }
        });

        html += '</div>';
        return html;
    }

    function replaceWithNaturalFormat(element, translatedText, detectedLang = null) {
        if (!element.hasAttribute('data-original-html')) {
            element.setAttribute('data-original-html', element.innerHTML);
        }

        const formattedHTML = createNaturalFormat(translatedText);
        element.innerHTML = formattedHTML;

        state.translationCount++;
        updateCounter();
    }

    function replaceElementText(element, translatedText, detectedLang = null, showBadge = true) {
        if (!element.hasAttribute('data-original-text')) {
            element.setAttribute('data-original-text', element.textContent);
        }

        element.textContent = translatedText;

        if (showBadge) {
            const badge = document.createElement('span');
            badge.className = 'gf-translation-badge';
            badge.innerHTML = '🌐';
            if (detectedLang) {
                badge.innerHTML += `<span class="gf-detected-lang">${detectedLang}</span>`;
            }
            element.appendChild(badge);
        }

        state.translationCount++;
        updateCounter();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🔄 TRANSLATION PROCESSORS
    // ═══════════════════════════════════════════════════════════════════════════

    async function processScriptTitles() {
        const scriptLinks = document.querySelectorAll('h2 a.script-link, .script-list article h2 a');
        let count = 0;

        for (const link of scriptLinks) {
            if (state.processedElements.has(link)) continue;

            const titleText = link.textContent.trim();
            if (shouldTranslate(titleText)) {
                state.processedElements.add(link);

                const result = await translateText(titleText);
                if (result.text !== titleText) {
                    replaceElementText(link, result.text, result.detectedLang, true);
                    count++;
                }

                await sleep(CONFIG.translationDelay);
            }
        }

        return count;
    }

    async function processDescriptionSpans() {
        const descriptionSpans = document.querySelectorAll('span.script-description, span.description, .script-list article .script-description');
        let count = 0;

        for (const span of descriptionSpans) {
            if (state.processedElements.has(span)) continue;

            const spanText = span.textContent.trim();
            if (spanText.length > 20 && shouldTranslate(spanText)) {
                state.processedElements.add(span);

                showStatus(`🌐 Translating ${count + 1}...`, 0);

                const result = await translateText(spanText);
                if (result.text !== spanText) {
                    replaceWithNaturalFormat(span, result.text, result.detectedLang);
                    count++;
                }

                await sleep(CONFIG.translationDelay);
            }
        }

        return count;
    }

    async function processDetailPageHeaders() {
        const headers = document.querySelectorAll('header h2, #script-info h2, .script-show-header h2');
        let count = 0;

        for (const header of headers) {
            if (state.processedElements.has(header)) continue;

            const headerText = header.textContent.trim();
            if (shouldTranslate(headerText)) {
                state.processedElements.add(header);

                const result = await translateText(headerText);
                if (result.text !== headerText) {
                    replaceElementText(header, result.text, result.detectedLang, true);
                    count++;
                }

                await sleep(CONFIG.translationDelay);
            }
        }

        return count;
    }

    async function processDetailPageDescriptions() {
        const descriptions = document.querySelectorAll('#script-description, p.script-description, .script-description');
        let count = 0;

        for (const desc of descriptions) {
            if (state.processedElements.has(desc)) continue;

            const descText = desc.textContent.trim();
            if (descText.length > 20 && shouldTranslate(descText)) {
                state.processedElements.add(desc);

                const result = await translateText(descText);
                if (result.text !== descText) {
                    replaceWithNaturalFormat(desc, result.text, result.detectedLang);
                    count++;
                }

                await sleep(CONFIG.translationDelay);
            }
        }

        return count;
    }

    async function processAdditionalInfo() {
        const additionalInfo = document.querySelector('#additional-info, .additional-info');
        if (!additionalInfo) return 0;

        let count = 0;
        const elements = additionalInfo.querySelectorAll('p, li, dd');

        for (const element of elements) {
            if (state.processedElements.has(element)) continue;

            const text = element.textContent.trim();
            if (text.length < 20) continue;

            if (shouldTranslate(text)) {
                state.processedElements.add(element);

                showStatus(`🌐 Translating additional info...`, 0);

                const result = await translateText(text);
                if (result.text !== text) {
                    replaceWithNaturalFormat(element, result.text, result.detectedLang);
                    count++;
                }

                await sleep(CONFIG.translationDelay);
            }
        }

        return count;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎛️ CONTROL PANEL
    // ═══════════════════════════════════════════════════════════════════════════

    function updateCounter() {
        const counter = document.getElementById('gf-translation-count');
        if (counter) counter.textContent = state.translationCount;
    }

    function createLanguageSelector() {
        let options = '';
        for (const [code, info] of Object.entries(LANGUAGES)) {
            const selected = code === state.targetLanguage ? 'selected' : '';
            options += `<option value="${code}" ${selected}>${info.flag} ${info.name}</option>`;
        }
        return options;
    }

    /**
     * 🆕 v19: Restore function now sets wasRestored flag to prevent auto-translate
     */
    function restoreOriginalText() {
        // Set flag to prevent auto-translate
        state.wasRestored = true;

        // Restore elements with data-original-text
        document.querySelectorAll('[data-original-text]').forEach(el => {
            el.textContent = el.getAttribute('data-original-text');
            el.removeAttribute('data-original-text');
        });

        // Restore elements with data-original-html
        document.querySelectorAll('[data-original-html]').forEach(el => {
            el.innerHTML = el.getAttribute('data-original-html');
            el.removeAttribute('data-original-html');
        });

        // Remove badges
        document.querySelectorAll('.gf-translation-badge').forEach(badge => badge.remove());

        // Reset state
        state.processedElements = new WeakSet();
        state.translationCount = 0;
        updateCounter();

        showStatus('🔄 Restored! Click "Translate" to translate again.', 3000);
    }

    function makeDraggable(element) {
        let isDragging = false, offsetX = 0, offsetY = 0;

        const savedX = GM_getValue('panelX', null);
        const savedY = GM_getValue('panelY', null);

        if (savedX !== null && savedY !== null) {
            element.style.left = savedX + 'px';
            element.style.top = savedY + 'px';
            element.style.right = 'auto';
        } else {
            element.style.right = '15px';
            element.style.top = '15px';
        }

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.closest('button') || e.target.closest('select') || e.target.closest('.gf-toggle-switch')) return;

            isDragging = true;
            element.classList.add('dragging');
            const rect = element.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            const rect = element.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - rect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - rect.height));

            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            element.classList.remove('dragging');

            const rect = element.getBoundingClientRect();
            GM_setValue('panelX', rect.left);
            GM_setValue('panelY', rect.top);
        });
    }

    function addControlPanel() {
        if (document.getElementById('gf-translator-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'gf-translator-panel';

        panel.innerHTML = `
            <div class="gf-panel-header">
                <div class="gf-panel-title">
                    🌐 <span>v19</span>
                </div>
                <div class="gf-panel-controls">
                    <button class="gf-panel-btn gf-minimize-btn" id="gf-minimize-btn" title="Minimize">−</button>
                    <button class="gf-panel-btn gf-close-btn" id="gf-close-btn" title="Close">✕</button>
                </div>
            </div>
            <div class="gf-panel-content" id="gf-panel-content">
                <select class="gf-lang-selector" id="gf-lang-selector" title="Select target language">
                    ${createLanguageSelector()}
                </select>

                <!-- 🆕 v19: Auto-translate toggle -->
                <div class="gf-toggle-row">
                    <span class="gf-toggle-label">Auto-Translate</span>
                    <div class="gf-toggle-switch ${state.autoTranslate ? 'on' : ''}" id="gf-auto-toggle" title="Toggle auto-translate on page load"></div>
                </div>

                <div class="gf-stat-box">
                    <span class="gf-stat-count" id="gf-translation-count">0</span>
                    <span class="gf-stat-label">Translated</span>
                </div>
                <button id="gf-translate-btn" class="gf-btn gf-btn-primary">
                    🌐 Translate
                </button>
                <button id="gf-restore-btn" class="gf-btn gf-btn-secondary">
                    🔄 Restore
                </button>
                <button id="gf-close-btn-bottom" class="gf-btn gf-btn-tertiary">
                    ✕ Close Panel
                </button>
            </div>
        `;

        document.body.appendChild(panel);
        makeDraggable(panel);

        // Event Listeners
        document.getElementById('gf-lang-selector').addEventListener('change', (e) => {
            state.targetLanguage = e.target.value;
            GM_setValue('targetLanguage', state.targetLanguage);
            showStatus(`🌐 Language set to ${LANGUAGES[state.targetLanguage].flag} ${LANGUAGES[state.targetLanguage].name}`, 2000);
        });

        // 🆕 v19: Auto-translate toggle
        document.getElementById('gf-auto-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            state.autoTranslate = !state.autoTranslate;
            GM_setValue('autoTranslate', state.autoTranslate);
            e.target.classList.toggle('on', state.autoTranslate);
            showStatus(`Auto-translate ${state.autoTranslate ? 'enabled ✅' : 'disabled ❌'}`, 2000);
        });

        document.getElementById('gf-minimize-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const content = document.getElementById('gf-panel-content');
            const btn = e.target;

            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                panel.classList.remove('minimized');
                btn.textContent = '−';
            } else {
                content.classList.add('hidden');
                panel.classList.add('minimized');
                btn.textContent = '□';
            }
        });

        document.getElementById('gf-translate-btn').addEventListener('click', async () => {
            if (state.isTranslating) return;
            state.wasRestored = false;  // 🆕 v19: Reset flag when manually translating
            await runTranslation();
        });

        document.getElementById('gf-restore-btn').addEventListener('click', restoreOriginalText);

        document.getElementById('gf-close-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        });

        document.getElementById('gf-close-btn-bottom').addEventListener('click', () => {
            panel.style.display = 'none';
        });

        updateCounter();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🚀 MAIN TRANSLATION RUNNER
    // ═══════════════════════════════════════════════════════════════════════════

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function runTranslation() {
        if (state.isTranslating) return;
        state.isTranslating = true;

        const btn = document.getElementById('gf-translate-btn');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳ Translating...';
        }

        showStatus('🌐 Starting translation...', 0);

        const isDetailPage = document.querySelector('#script-info, .script-show-container');
        let total = 0;

        try {
            if (isDetailPage) {
                total += await processDetailPageHeaders();
                total += await processDetailPageDescriptions();
                total += await processAdditionalInfo();
            } else {
                total += await processScriptTitles();
                total += await processDescriptionSpans();
            }

            const langInfo = LANGUAGES[state.targetLanguage];
            showStatus(`✅ Done! ${total} items translated to ${langInfo.flag} ${langInfo.name}`, 4000);
        } catch (error) {
            debugLog('❌ Translation error:', error);
            showStatus('❌ Translation error occurred', 3000);
        }

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🌐 Translate';
        }

        state.isTranslating = false;
        return total;
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // 🎬 INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════

    async function init() {
        const langInfo = LANGUAGES[state.targetLanguage];
        console.log(`🌐 Greasyfork Auto-Translator v19 loaded! Target: ${langInfo.flag} ${langInfo.name}`);

        // Wait for page to settle
        await sleep(1000);

        // Add control panel
        addControlPanel();

        // 🆕 v19: Only auto-translate if enabled AND not restored
        if (state.autoTranslate && !state.wasRestored) {
            await sleep(500);
            await runTranslation();
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

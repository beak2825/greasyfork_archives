// ==UserScript==
// @name         Greasyfork – Auto-Translator (v16)
// @namespace    http://tampermonkey.net/
// @version      16
// @description  Translates non-Latin languages (Chinese, Japanese, Korean, etc) but SKIPS Spanish and other Latin languages
// @author       Your Name
// @match        https://greasyfork.org/*/scripts*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      translate.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/555224/Greasyfork%20%E2%80%93%20Auto-Translator%20%28v16%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555224/Greasyfork%20%E2%80%93%20Auto-Translator%20%28v16%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🌐 Greasyfork Auto-Translator v16 loaded!');

    const CONFIG = {
        autoTranslate: true,
        debug: true
    };

    const processedElements = new WeakSet();
    let translationCount = 0;

    GM_addStyle(`
        .gf-translation-badge {
            display: inline-block;
            background: #4caf50;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 9px;
            margin-left: 6px;
            font-weight: bold;
            vertical-align: middle;
        }

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

        #gf-translator-panel {
            position: fixed;
            background: white;
            border: 2px solid #4caf50;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 999999;
            font-family: Arial, sans-serif;
            min-width: 200px;
            max-width: 220px;
            cursor: move;
            user-select: none;
        }
        #gf-translator-panel.dragging { cursor: grabbing !important; }
        #gf-translator-panel:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
        #gf-translator-panel.minimized { min-width: 160px; padding: 8px; }

        .gf-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 2px solid #4caf50;
        }
        .gf-panel-title { font-weight: bold; color: #2e7d32; font-size: 14px; flex: 1; }
        .gf-panel-controls { display: flex; gap: 4px; }
        .gf-panel-btn {
            width: 20px; height: 20px; border: none; border-radius: 3px; cursor: pointer;
            font-size: 12px; display: flex; align-items: center; justify-content: center;
            transition: all 0.2s; background: #f0f0f0;
        }
        .gf-panel-btn:hover { transform: scale(1.1); }
        .gf-minimize-btn { background: #FFC107; color: white; }
        .gf-minimize-btn:hover { background: #FFB300; }
        .gf-close-btn { background: #f44336; color: white; }
        .gf-close-btn:hover { background: #e53935; }
        .gf-panel-content { display: block; }
        .gf-panel-content.hidden { display: none; }
        .gf-stat-box {
            margin-bottom: 8px; font-size: 11px; color: #555;
            background: #f1f8f4; padding: 6px; border-radius: 4px; text-align: center;
        }
        .gf-btn {
            width: 100%; padding: 7px; border: none; border-radius: 4px;
            cursor: pointer; font-weight: bold; font-size: 11px; margin-bottom: 5px;
            transition: all 0.2s;
        }
        .gf-btn:hover { transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0,0,0,0.2); }
        .gf-btn-primary { background-color: #4caf50; color: white; }
        .gf-btn-primary:hover { background-color: #45a049; }
        .gf-btn-tertiary { background-color: #2196F3; color: white; }
        .gf-btn-tertiary:hover { background-color: #1976D2; }
        .gf-btn-danger { background-color: #f44336; color: white; font-size: 10px; padding: 6px; }
        .gf-btn-danger:hover { background-color: #e53935; }

        #gf-status-bar {
            position: fixed; bottom: 10px; right: 10px; background: #4caf50;
            color: white; padding: 10px 15px; border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3); z-index: 999998;
            font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;
        }
    `);

    function debugLog(...args) {
        if (CONFIG.debug) console.log('🌐 [v16]', ...args);
    }

    function showStatus(message, duration = 3000) {
        let statusBar = document.getElementById('gf-status-bar');
        if (!statusBar) {
            statusBar = document.createElement('div');
            statusBar.id = 'gf-status-bar';
            document.body.appendChild(statusBar);
        }
        statusBar.textContent = message;
        statusBar.style.display = 'block';
        setTimeout(() => statusBar.style.display = 'none', duration);
    }

    function hasNonLatinCharacters(text) {
        // Only detect NON-LATIN scripts: Chinese, Japanese, Korean, Cyrillic, Arabic, Thai, etc.
        // This EXCLUDES Spanish, French, Portuguese, Italian, German, etc.
        const nonLatinPattern = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u0400-\u04ff\u0600-\u06ff\u0e00-\u0e7f]/;
        return nonLatinPattern.test(text);
    }

    function isSpanishOrLatinLanguage(text) {
        // Check if text is primarily Spanish/Portuguese/French/Italian (uses Latin alphabet)
        // These languages don't have special characters outside basic Latin + accents
        const latinOnly = /^[a-zA-ZÀ-ÿ\s\d\.,;:!?¿¡()\-"']+$/;
        return latinOnly.test(text);
    }

    function shouldTranslate(text) {
        // Skip if it's English
        const isEnglish = /^[a-zA-Z\s\d\.,;:!?()\-"']+$/.test(text);
        if (isEnglish) {
            debugLog('⏭️ Skipping English text');
            return false;
        }

        // Skip if it's Spanish or other Latin languages (has accents but no non-Latin characters)
        if (isSpanishOrLatinLanguage(text)) {
            debugLog('⏭️ Skipping Spanish/Latin language text');
            return false;
        }

        // Only translate if it has non-Latin characters (Chinese, Japanese, Korean, etc.)
        if (hasNonLatinCharacters(text)) {
            debugLog('✅ Will translate non-Latin text');
            return true;
        }

        return false;
    }

    async function translateText(text) {
        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text.trim())}`;
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    onload: (response) => {
                        try {
                            if (response.status === 200) {
                                const data = JSON.parse(response.responseText);
                                if (data && data[0]) {
                                    let result = '';
                                    data[0].forEach(item => { if (item[0]) result += item[0]; });
                                    resolve(result || text);
                                } else resolve(text);
                            } else resolve(text);
                        } catch (e) { resolve(text); }
                    },
                    onerror: () => resolve(text),
                    timeout: 15000
                });
            });
        } catch (error) {
            return text;
        }
    }

    function createNaturalFormat(translatedText) {
        const parts = translatedText.split(/(?=\d+\.\s)/);

        let html = '<div class="gf-formatted-text">';

        parts.forEach(part => {
            part = part.trim();
            if (!part) return;

            if (/^\d+\.\s/.test(part)) {
                const match = part.match(/^(\d+\.\s)(.+)/s);
                if (match) {
                    const num = match[1];
                    const content = match[2].trim();
                    html += `<span class="gf-item"><strong>${num}</strong>${content} </span>`;
                }
            } else {
                html += `<span class="gf-item">${part} </span>`;
            }
        });

        html += '</div>';
        return html;
    }

    function replaceWithNaturalFormat(element, translatedText) {
        if (!element.hasAttribute('data-original-html')) {
            element.setAttribute('data-original-html', element.innerHTML);
        }

        const formattedHTML = createNaturalFormat(translatedText);
        element.innerHTML = formattedHTML;

        translationCount++;
    }

    function replaceElementText(element, translatedText, showBadge = true) {
        if (!element.hasAttribute('data-original-text')) {
            element.setAttribute('data-original-text', element.textContent);
        }
        element.textContent = translatedText;
        if (showBadge) {
            const badge = document.createElement('span');
            badge.className = 'gf-translation-badge';
            badge.textContent = '🌐';
            element.appendChild(badge);
        }
        translationCount++;
    }

    async function processScriptTitles() {
        const scriptLinks = document.querySelectorAll('h2 a.script-link');
        let count = 0;
        for (const link of scriptLinks) {
            if (processedElements.has(link)) continue;
            const titleText = link.textContent.trim();

            if (shouldTranslate(titleText)) {
                processedElements.add(link);
                count++;
                const translated = await translateText(titleText);
                if (translated && translated !== titleText) {
                    replaceElementText(link, translated, true);
                }
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        return count;
    }

    async function processDescriptionSpans() {
        const descriptionSpans = document.querySelectorAll('span.script-description, span.description');
        let count = 0;
        for (const span of descriptionSpans) {
            if (processedElements.has(span)) continue;
            const spanText = span.textContent.trim();

            if (spanText.length > 20 && shouldTranslate(spanText)) {
                processedElements.add(span);
                count++;
                showStatus(`🌐 ${count}...`, 800);
                const translated = await translateText(spanText);
                if (translated && translated !== spanText) {
                    replaceWithNaturalFormat(span, translated);
                }
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }
        return count;
    }

    async function processDetailPageHeaders() {
        const headers = document.querySelectorAll('header h2, #script-info h2');
        let count = 0;
        for (const header of headers) {
            if (processedElements.has(header)) continue;
            const headerText = header.textContent.trim();

            if (shouldTranslate(headerText)) {
                processedElements.add(header);
                count++;
                const translated = await translateText(headerText);
                if (translated && translated !== headerText) {
                    replaceElementText(header, translated, true);
                }
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }
        return count;
    }

    async function processDetailPageDescriptions() {
        const descriptions = document.querySelectorAll('#script-description, p.script-description');
        let count = 0;
        for (const desc of descriptions) {
            if (processedElements.has(desc)) continue;
            const descText = desc.textContent.trim();

            if (descText.length > 20 && shouldTranslate(descText)) {
                processedElements.add(desc);
                count++;
                const translated = await translateText(descText);
                if (translated && translated !== descText) {
                    replaceWithNaturalFormat(desc, translated);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        return count;
    }

    async function processAdditionalInfo() {
        const additionalInfo = document.querySelector('#additional-info');
        if (!additionalInfo) return 0;

        let count = 0;
        const elements = additionalInfo.querySelectorAll('p');

        for (const element of elements) {
            if (processedElements.has(element)) continue;
            const text = element.textContent.trim();
            if (text.length < 20) continue;

            // Check for non-Latin characters (not just ratio)
            if (shouldTranslate(text)) {
                processedElements.add(element);
                count++;
                showStatus(`🌐 ${count}...`, 800);
                const translated = await translateText(text);
                if (translated && translated !== text) {
                    replaceWithNaturalFormat(element, translated);
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        return count;
    }

    function restoreOriginalText() {
        location.reload();
    }

    function makeDraggable(element) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        const savedX = GM_getValue('panelX', null), savedY = GM_getValue('panelY', null);
        if (savedX !== null && savedY !== null) {
            element.style.left = savedX + 'px';
            element.style.top = savedY + 'px';
        } else {
            element.style.right = '10px';
            element.style.top = '10px';
        }

        element.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
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
            let newX = e.clientX - offsetX, newY = e.clientY - offsetY;
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

    function updateCounter() {
        const counter = document.getElementById('translation-count');
        if (counter) counter.textContent = translationCount;
    }

    function addControlPanel() {
        if (document.getElementById('gf-translator-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'gf-translator-panel';
        panel.innerHTML = `
            <div class="gf-panel-header">
                <div class="gf-panel-title">🌐 v16</div>
                <div class="gf-panel-controls">
                    <button class="gf-panel-btn gf-minimize-btn" id="gf-minimize-btn">−</button>
                    <button class="gf-panel-btn gf-close-btn" id="gf-close-btn-x">✕</button>
                </div>
            </div>
            <div class="gf-panel-content" id="gf-panel-content">
                <div class="gf-stat-box">
                    ✅ <strong id="translation-count">0</strong>
                    <div style="font-size: 9px; margin-top: 2px;">No Spanish</div>
                </div>
                <button id="translateNowBtn" class="gf-btn gf-btn-primary">🌐 Translate</button>
                <button id="restoreBtn" class="gf-btn gf-btn-tertiary">🔄 Restore</button>
                <button id="closeBtn" class="gf-btn gf-btn-danger">✕ Close</button>
            </div>
        `;
        document.body.appendChild(panel);
        makeDraggable(panel);

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

        document.getElementById('translateNowBtn').addEventListener('click', async () => {
            const btn = document.getElementById('translateNowBtn');
            btn.disabled = true;
            btn.textContent = '⏳';
            const isDetailPage = document.querySelector('#script-info');
            let total = 0;
            if (isDetailPage) {
                total += await processDetailPageHeaders();
                total += await processDetailPageDescriptions();
                total += await processAdditionalInfo();
            } else {
                total += await processScriptTitles();
                total += await processDescriptionSpans();
            }
            updateCounter();
            btn.disabled = false;
            btn.textContent = '🌐 Translate';
            showStatus(`✅ ${total}!`, 3000);
        });

        document.getElementById('restoreBtn').addEventListener('click', restoreOriginalText);
        document.getElementById('gf-close-btn-x').addEventListener('click', (e) => {
            e.stopPropagation();
            panel.style.display = 'none';
        });
        document.getElementById('closeBtn').addEventListener('click', () => panel.style.display = 'none');
        updateCounter();
    }

    async function init() {
        debugLog('🚀 v16 - Skips Spanish');
        await new Promise(resolve => setTimeout(resolve, 1500));
        addControlPanel();

        if (CONFIG.autoTranslate) {
            showStatus('🌐 Translating...', 2000);
            const isDetailPage = document.querySelector('#script-info');
            let total = 0;
            if (isDetailPage) {
                total += await processDetailPageHeaders();
                total += await processDetailPageDescriptions();
                total += await processAdditionalInfo();
            } else {
                total += await processScriptTitles();
                total += await processDescriptionSpans();
            }
            if (total > 0) showStatus(`✅ Done! ${total}`, 4000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
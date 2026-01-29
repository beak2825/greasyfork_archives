// ==UserScript==
// @name         BlueSky Post Translate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Translation for Bluesky posts without leaving the page.
// @author       icealtria
// @match        https://bsky.app/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564305/BlueSky%20Post%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/564305/BlueSky%20Post%20Translate.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Script loaded successfully！');

    const supportedLanguages = {
        'zh-CN': '中文',
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'ja': '日本語'
    };

    function detectDefaultLanguage() {
        const browserLanguage = navigator.language || navigator.languages[0];
        console.log(`Detected browser language：${browserLanguage}`);
        return supportedLanguages[browserLanguage] ? browserLanguage : 'zh-CN';
    }

    let userLanguage = localStorage.getItem('bsky-translate-language') || detectDefaultLanguage();

    async function translateText(text, targetLang = 'zh-CN') {
        const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error：${response.status}`);
            }
            const result = await response.json();
            return result[0].map(segment => segment[0]).join('');
        } catch (error) {
            console.error(`Translation failed：${error.message || 'Unable to connect to the translation service. Please try again later'}`);
            throw error;
        }
    }

    function ensureTranslationContainer(postTextDiv) {
        // Try to find if we already injected our wrapper
        let wrapper = postTextDiv.querySelector('.bsky-translation-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'bsky-translation-wrapper';
            wrapper.style.marginTop = '8px';
            wrapper.style.marginBottom = '8px';
            wrapper.style.fontFamily = 'InterVariable, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

            // 1. Container for Controls
            const controls = document.createElement('div');
            controls.style.display = 'flex';
            controls.style.alignItems = 'center';
            controls.style.gap = '10px';

            // Clickable Translation Link
            const linkText = document.createElement('span');
            linkText.className = 'link-text';
            linkText.textContent = 'Show translation';
            linkText.style.color = 'rgb(16, 131, 254)';
            linkText.style.cursor = 'pointer';
            linkText.style.fontSize = '15px';
            linkText.style.fontWeight = '500';

            // Language Selector
            const selector = document.createElement('select');
            selector.className = 'language-selector';
            selector.style.border = 'none';
            selector.style.background = 'transparent';
            selector.style.color = 'rgb(16, 131, 254)';
            selector.style.fontSize = '13px';
            selector.style.cursor = 'pointer';
            selector.style.outline = 'none';

            for (const [code, name] of Object.entries(supportedLanguages)) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = name;
                if (code === userLanguage) option.selected = true;
                selector.appendChild(option);
            }

            selector.addEventListener('change', (event) => {
                userLanguage = event.target.value;
                localStorage.setItem('bsky-translate-language', userLanguage);
                const translationDiv = wrapper.querySelector('.translated-text');
                translationDiv.dataset.translated = 'false';
                translationDiv.style.display = 'none';
                linkText.textContent = 'Show translation';
            });

            linkText.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                doTranslate(postTextDiv, wrapper);
            };

            controls.appendChild(linkText);
            controls.appendChild(selector);

            // 2. Translation Result Div
            const translationDiv = document.createElement('div');
            translationDiv.className = 'translated-text';
            translationDiv.style.color = 'rgb(0, 0, 0)';
            translationDiv.style.marginTop = '8px';
            translationDiv.style.display = 'none';
            translationDiv.style.fontSize = '16.9px';
            translationDiv.style.lineHeight = '22px';
            translationDiv.style.borderLeft = '2px solid rgb(16, 131, 254)';
            translationDiv.style.paddingLeft = '10px';
            translationDiv.style.marginBottom = '12px';

            wrapper.appendChild(controls);
            wrapper.appendChild(translationDiv);

            // Insertion Logic: Find the best place (below tags, above text)
            // Tags usually reside in a div with flex-flow: wrap or gap at the start
            const tagsDiv = postTextDiv.querySelector('div[style*="wrap"]');
            if (tagsDiv && tagsDiv.parentElement === postTextDiv) {
                tagsDiv.after(wrapper);
            } else {
                postTextDiv.prepend(wrapper);
            }
        }
        return wrapper;
    }

    async function doTranslate(postTextDiv, wrapper) {
        const linkText = wrapper.querySelector('.link-text');
        const translationDiv = wrapper.querySelector('.translated-text');

        // Toggle logic
        if (translationDiv.dataset.translated === 'true') {
            if (translationDiv.style.display === 'none') {
                translationDiv.style.display = 'block';
                linkText.textContent = 'Hide translation';
            } else {
                translationDiv.style.display = 'none';
                linkText.textContent = 'Show translation';
            }
            return;
        }

        // Clone and clean text
        const clone = postTextDiv.cloneNode(true);
        clone.querySelectorAll('button').forEach(el => el.remove());
        clone.querySelectorAll('[role="link"]').forEach(el => el.remove());
        clone.querySelectorAll('.translated-text').forEach(el => el.remove());
        clone.querySelectorAll('.language-selector').forEach(el => el.remove());
        clone.querySelectorAll('.bsky-translation-wrapper').forEach(el => el.remove());

        const textToTranslate = clone.textContent.trim();
        if (!textToTranslate) {
            console.error('No text to translate.');
            return;
        }

        linkText.textContent = 'Translating...';
        try {
            const translatedText = await translateText(textToTranslate, userLanguage);
            translationDiv.textContent = translatedText;
            translationDiv.style.display = 'block';
            translationDiv.dataset.translated = 'true';
            linkText.textContent = 'Hide translation';
        } catch (error) {
            linkText.textContent = 'Translation failed';
            console.error(error);
        }
    }

    function bindTranslateButtons() {
        const translateButtons = document.querySelectorAll('a[href*="https://translate.google.com"]');
        
        translateButtons.forEach(button => {
            if (!button.dataset.bound) {
                button.dataset.bound = true;

                const parentElement = button.parentElement.parentElement;
                const postTextDiv = parentElement ? parentElement.previousElementSibling : null;
                if (!postTextDiv) return;

                // Ensure the top UI exists
                const wrapper = ensureTranslationContainer(postTextDiv);

                // Bind click to the original bottom button too
                button.addEventListener('click', async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    doTranslate(postTextDiv, wrapper);
                });
            }
        });
    }

    bindTranslateButtons();

    const observer = new MutationObserver(() => {
        bindTranslateButtons();
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
})();

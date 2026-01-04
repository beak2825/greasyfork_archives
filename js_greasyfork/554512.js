// ==UserScript==
// @name         X.com Gemini Translator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Supercharge your X.com experience by replacing the default translator with the advanced Google Gemini AI. Get more accurate translations and a button that appears on *every* tweet.
// @author       ospx
// @license      MIT
// @match        https://x.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      localhost
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/554512/Xcom%20Gemini%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/554512/Xcom%20Gemini%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ... (весь ваш код до GeminiAPI остается без изменений) ...

    const C = {
        SETTINGS_ICON_CLASS: 'gemini-settings-icon',
        BUTTON_ID: 'gemini-translate-button',
        TEXT_PROCESSED_ATTR: 'data-gemini-text-hooked',
        MODAL_ID: 'gemini-settings-modal',
        BACKDROP_ID: 'gemini-settings-backdrop',
        TWEET_TEXT_SELECTOR: '[data-testid="tweetText"]',
        TOAST_ID: 'gemini-toast'
    };

    const L10N = {
        ru: {
            settings_title: 'Настройки Gemini Переводчика',
            api_key_label: 'API Key',
            api_host_label: 'API Host',
            model_label: 'Модель',
            target_lang_label: 'Язык перевода',
            interface_lang_label: 'Язык интерфейса',
            system_prompt_label: 'Системный промт',
            save_button: 'Сохранить',
            close_button: 'Закрыть',
            settings_saved: 'Настройки сохранены!',
            translate_button: 'Перевести пост',
            show_original_button: 'Показать оригинал',
            loading_text: 'Перевод...',
            error_network: 'Ошибка сети при обращении к API',
            error_api_response: 'Ошибка ответа Gemini API',
            settings_tooltip: 'Настройки переводчика'
        },
        en: {
            settings_title: 'Gemini Translator Settings',
            api_key_label: 'API Key',
            api_host_label: 'API Host',
            model_label: 'Model',
            target_lang_label: 'Target Language',
            interface_lang_label: 'Interface Language',
            system_prompt_label: 'System Prompt',
            save_button: 'Save',
            close_button: 'Close',
            settings_saved: 'Settings saved!',
            translate_button: 'Translate post',
            show_original_button: 'Show original',
            loading_text: 'Translating...',
            error_network: 'Network error while accessing API',
            error_api_response: 'Gemini API response error',
            settings_tooltip: 'Translator settings'
        },
        uk: {
            settings_title: 'Налаштування Gemini Перекладача',
            api_key_label: 'API Key',
            api_host_label: 'API Host',
            model_label: 'Модель',
            target_lang_label: 'Мова перекладу',
            interface_lang_label: 'Мова інтерфейсу',
            system_prompt_label: 'Системний промт',
            save_button: 'Зберегти',
            close_button: 'Закрити',
            settings_saved: 'Налаштування збережено!',
            translate_button: 'Перекласти пост',
            show_original_button: 'Показати оригінал',
            loading_text: 'Переклад...',
            error_network: 'Помилка мережі при зверненні до API',
            error_api_response: 'Помилка відповіді Gemini API',
            settings_tooltip: 'Налаштування перекладача'
        }
    };

    function t(key) {
        const lang = ConfigManager.get().interfaceLanguage || 'ru';
        return L10N[lang]?.[key] || L10N['en']?.[key] || `[${key}]`;
    }


    const ConfigManager = {
        defaults: {
            apiHost: 'https://generativelanguage.googleapis.com',
            apiKey: '',
            targetLanguage: 'English',
            interfaceLanguage: 'en',
            model: 'gemini-1.5-flash',
            systemPrompt: `You are an expert translator. Your sole task is to accurately translate the provided text while strictly preserving all formatting details.

Rules:
1. **Mirror formatting preservation:** Always maintain special characters (>, *, -, #, quotes), line breaks, and paragraphs. The translation structure must completely mirror the original.
2. **Translation only:** Never add any comments, explanations, or introductory phrases.
3. **Clean output:** Return only the translated text.`
        },

        config: {},

        load() {
            const stored = GM_getValue('geminiTranslatorSettings', null);
            this.config = stored ? { ...this.defaults, ...JSON.parse(stored) } : { ...this.defaults };

            if (!stored) {
                const browserLang = navigator.language.split('-')[0];
                if (L10N[browserLang]) {
                    this.config.interfaceLanguage = browserLang;
                }
            }
        },

        save(newConfig) {
            this.config = { ...this.config, ...newConfig };
            GM_setValue('geminiTranslatorSettings', JSON.stringify(this.config));
        },

        get() {
            return this.config;
        }
    };


    const UIManager = {
        createModal() {
            const oldModal = document.getElementById(C.MODAL_ID);
            if (oldModal) oldModal.remove();

            const modalHTML = `
                <div id="${C.BACKDROP_ID}"></div>
                <div id="gemini-settings-container" style='font-family: "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;'>
                    <div id="gemini-modal-header">
                        <button id="gemini-modal-close-btn" aria-label="${t('close_button')}">✕</button>
                        <h2>${t('settings_title')}</h2>
                    </div>
                    <div id="gemini-modal-body">
                        <div class="gt-setting">
                            <label for="gt-api-key">${t('api_key_label')}</label>
                            <input type="text" id="gt-api-key">
                        </div>
                        <div class="gt-setting">
                            <label for="gt-api-host">${t('api_host_label')}</label>
                            <input type="text" id="gt-api-host">
                        </div>
                        <div class="gt-setting">
                            <label for="gt-model">${t('model_label')}</label>
                            <input type="text" id="gt-model">
                        </div>
                        <div class="gt-setting">
                            <label for="gt-target-lang">${t('target_lang_label')}</label>
                            <input type="text" id="gt-target-lang">
                        </div>
                        <div class="gt-setting">
                            <label for="gt-interface-lang">${t('interface_lang_label')}</label>
                            <select id="gt-interface-lang">
                                <option value="ru">Русский</option>
                                <option value="en">English</option>
                                <option value="uk">Українська</option>
                            </select>
                        </div>
                        <div class="gt-setting">
                            <label for="gt-system-prompt">${t('system_prompt_label')}</label>
                            <textarea id="gt-system-prompt" rows="10"></textarea>
                        </div>
                    </div>
                    <div id="gemini-modal-footer">
                        <button id="gt-save-btn">${t('save_button')}</button>
                    </div>
                </div>
            `;

            const modalWrapper = document.createElement('div');
            modalWrapper.id = C.MODAL_ID;
            modalWrapper.innerHTML = modalHTML;
            document.body.appendChild(modalWrapper);

            this.injectStyles();
            this.attachModalHandlers();
        },

        injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #${C.BACKDROP_ID} {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background-color: rgba(0, 0, 0, 0.65); z-index: 9998;
                }
                #gemini-settings-container {
                    display: flex; flex-direction: column; position: fixed;
                    top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background-color: #000000; border-radius: 16px;
                    width: 90vw; max-width: 600px; height: 90vh; max-height: 650px;
                    z-index: 9999;
                    box-shadow: rgb(22 24 28 / 50%) 0px 0px 15px, rgb(22 24 28 / 50%) 0px 0px 3px 1px;
                }
                #gemini-modal-header {
                    display: flex; align-items: center; padding: 12px 16px;
                    border-bottom: 1px solid rgb(56, 68, 77); flex-shrink: 0;
                }
                #gemini-modal-header h2 {
                    font-size: 20px; font-weight: bold; margin: 0; margin-left: 20px;
                    color: rgb(231, 233, 234);
                }
                #gemini-modal-close-btn {
                    background: none; border: none; cursor: pointer; font-size: 20px;
                    color: rgb(231, 233, 234); padding: 8px; border-radius: 9999px;
                    display: flex; align-items: center; justify-content: center;
                }
                #gemini-modal-close-btn:hover { background-color: rgba(239, 243, 244, 0.1); }
                #gemini-modal-body { padding: 16px; overflow-y: auto; }
                .gt-setting { position: relative; margin-bottom: 24px; }
                .gt-setting label {
                    position: absolute; top: 12px; left: 12px;
                    font-size: 13px; color: rgb(113, 118, 123);
                }
                .gt-setting input, .gt-setting textarea, .gt-setting select {
                    width: calc(100% - 24px); padding: 12px; padding-top: 32px;
                    background-color: transparent; border: 1px solid rgb(56, 68, 77);
                    color: rgb(231, 233, 234); border-radius: 4px; font-size: 17px;
                    transition: all 0.2s ease-in-out;
                }
                .gt-setting textarea { padding-top: 32px; }
                .gt-setting input:focus, .gt-setting textarea:focus, .gt-setting select:focus {
                    border-color: rgb(29, 155, 240);
                    box-shadow: 0 0 0 1px rgb(29, 155, 240);
                    background-color: black; outline: none;
                }
                #gemini-modal-footer {
                    padding: 16px; text-align: right;
                    border-top: 1px solid rgb(56, 68, 77); flex-shrink: 0;
                }
                #gt-save-btn {
                    background-color: rgb(239, 243, 244); color: rgb(15, 20, 25);
                    padding: 10px 24px; border: none; border-radius: 9999px;
                    cursor: pointer; font-size: 15px; font-weight: bold;
                    transition: background-color 0.2s;
                }
                #gt-save-btn:hover { background-color: rgb(215, 219, 220); }

                #${C.TOAST_ID} {
                    position: fixed; bottom: 20px; right: 20px; z-index: 10000;
                    background-color: rgb(29, 155, 240); color: white;
                    padding: 12px 24px; border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    font-family: "TwitterChirp", sans-serif;
                    font-size: 15px; opacity: 0; transition: opacity 0.3s;
                }
                #${C.TOAST_ID}.show { opacity: 1; }
                #${C.TOAST_ID}.error { background-color: rgb(244, 33, 46); }
            `;
            document.getElementById(C.MODAL_ID).appendChild(style);
        },

        attachModalHandlers() {
            const closeModal = () => {
                document.getElementById(C.MODAL_ID).style.display = 'none';
            };

            document.getElementById('gemini-modal-close-btn').onclick = closeModal;
            document.getElementById(C.BACKDROP_ID).onclick = closeModal;
            document.getElementById('gt-save-btn').onclick = () => {
                const newConfig = {
                    apiHost: document.getElementById('gt-api-host').value,
                    apiKey: document.getElementById('gt-api-key').value,
                    model: document.getElementById('gt-model').value,
                    targetLanguage: document.getElementById('gt-target-lang').value,
                    interfaceLanguage: document.getElementById('gt-interface-lang').value,
                    systemPrompt: document.getElementById('gt-system-prompt').value
                };
                ConfigManager.save(newConfig);
                this.showToast(t('settings_saved'));
                closeModal();
            };
        },

        openModal() {
            const modal = document.getElementById(C.MODAL_ID);
            if (!modal) {
                this.createModal();
            }

            const config = ConfigManager.get();
            document.getElementById('gt-api-host').value = config.apiHost;
            document.getElementById('gt-api-key').value = config.apiKey;
            document.getElementById('gt-model').value = config.model;
            document.getElementById('gt-target-lang').value = config.targetLanguage;
            document.getElementById('gt-interface-lang').value = config.interfaceLanguage;
            document.getElementById('gt-system-prompt').value = config.systemPrompt;

            document.getElementById(C.MODAL_ID).style.display = 'block';
        },

        showToast(message, isError = false) {
            let toast = document.getElementById(C.TOAST_ID);
            if (!toast) {
                toast = document.createElement('div');
                toast.id = C.TOAST_ID;
                document.body.appendChild(toast);
            }

            toast.textContent = message;
            toast.className = isError ? 'error' : '';

            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        },

        createTranslateButton() {
            const container = document.createElement('div');
            container.style.cssText = 'display: flex; align-items: center; cursor: pointer; margin-top: 4px;';

            const icon = document.createElement('span');
            icon.textContent = '⚙️';
            icon.className = C.SETTINGS_ICON_CLASS;
            icon.title = t('settings_tooltip');
            icon.style.marginRight = '8px';

            const button = document.createElement('button');
            button.id = C.BUTTON_ID;
            button.setAttribute('style',
                'color: rgb(29, 155, 240); background-color: transparent; border: none; ' +
                'padding: 0; cursor: pointer; font-family: "TwitterChirp", -apple-system, ' +
                'BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; ' +
                'font-size: 13px; font-weight: 400; line-height: 16px;'
            );

            const buttonSpan = document.createElement('span');
            buttonSpan.textContent = t('translate_button');
            button.appendChild(buttonSpan);

            container.appendChild(icon);
            container.appendChild(button);

            return container;
        }
    };


    // ==========================================================
    // ===== ИЗМЕНЕНИЕ ЗДЕСЬ =====================================
    // ==========================================================
    const GeminiAPI = {
        translate(text) {
            return new Promise((resolve, reject) => {
                const config = ConfigManager.get();
                const url = `${config.apiHost}/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

                // --- ИСПРАВЛЕНИЕ ---
                // Создаем динамический системный промт, который включает язык перевода
                const finalSystemPrompt = `Translate the following text into **${config.targetLanguage}**.\n\n${config.systemPrompt}`;

                const systemInstruction = {
                    parts: [{ text: finalSystemPrompt }] // Используем новый, динамический промт
                };

                const generationConfig = {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            translatedText: { type: "STRING" }
                        }
                    }
                };

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: url,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({
                        system_instruction: systemInstruction,
                        contents: [{ parts: [{ text: text }] }],
                        generationConfig: generationConfig
                    }),
                    onload: (response) => {
                        try {
                            const result = JSON.parse(response.responseText);
                            const structuredJsonString = result.candidates[0].content.parts[0].text;
                            const structuredData = JSON.parse(structuredJsonString);
                            resolve(structuredData.translatedText.trim());
                        } catch (e) {
                            console.error('Gemini API Error:', e, response.responseText);
                            reject(new Error(t('error_api_response')));
                        }
                    },
                    onerror: (error) => {
                        console.error('Network Error:', error);
                        reject(new Error(t('error_network')));
                    }
                });
            });
        }
    };
    // ==========================================================
    // ===== КОНЕЦ ИЗМЕНЕНИЯ =====================================
    // ==========================================================


    const DOMObserver = {
        observer: null,

        init(callback) {
            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return;

                        const textElements = node.querySelectorAll(
                            `${C.TWEET_TEXT_SELECTOR}:not([${C.TEXT_PROCESSED_ATTR}])`
                        );

                        textElements.forEach(callback);
                    });
                });
            });

            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    function processNewTweet(textElement) {
        textElement.setAttribute(C.TEXT_PROCESSED_ATTR, 'true');

        const oldButton = textElement.nextElementSibling;
        if (oldButton?.tagName === 'BUTTON') {
            oldButton.remove();
        }

        const buttonContainer = UIManager.createTranslateButton();
        textElement.after(buttonContainer);
    }

    function handleClick(event) {
        const target = event.target;

        if (target.classList.contains(C.SETTINGS_ICON_CLASS)) {
            event.preventDefault();
            event.stopPropagation();
            UIManager.openModal();
            return;
        }

        const button = target.closest(`#${C.BUTTON_ID}`);
        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        const postElement = button.closest('article');
        const textElement = postElement?.querySelector(C.TWEET_TEXT_SELECTOR);
        const buttonSpan = button.querySelector('span');

        if (!postElement || !textElement || !buttonSpan) return;

        if (!button.dataset.originalText) {
            button.dataset.originalText = buttonSpan.textContent;
        }

        const originalButtonText = button.dataset.originalText;
        const currentButtonText = buttonSpan.textContent;

        if (currentButtonText === t('translate_button') || currentButtonText === originalButtonText) {
            if (!textElement.dataset.originalText) {
                textElement.dataset.originalText = textElement.innerText;
            }

            if (textElement.dataset.translatedText) {
                textElement.innerText = textElement.dataset.translatedText;
                buttonSpan.textContent = t('show_original_button');
                return;
            }

            buttonSpan.textContent = t('loading_text');

            GeminiAPI.translate(textElement.dataset.originalText)
                .then(translatedText => {
                    textElement.dataset.translatedText = translatedText;
                    textElement.innerText = translatedText;
                    buttonSpan.textContent = t('show_original_button');
                })
                .catch(error => {
                    UIManager.showToast(error.message, true);
                    buttonSpan.textContent = originalButtonText;
                });
        }
        else if (currentButtonText === t('show_original_button')) {
            if (textElement.dataset.originalText) {
                textElement.innerText = textElement.dataset.originalText;
                buttonSpan.textContent = t('translate_button');
            }
        }
    }

    function main() {
        ConfigManager.load();
        UIManager.createModal();
        document.getElementById(C.MODAL_ID).style.display = 'none';

        DOMObserver.init(processNewTweet);
        document.body.addEventListener('click', handleClick, true);
    }

    main();

})();
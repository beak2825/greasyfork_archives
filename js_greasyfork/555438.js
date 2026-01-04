// ==UserScript==
// @name         Translate Comments on HDRezka (Google+Libre)
// @namespace    http://tampermonkey.net/
// @version      2.7.7
// @description  Добавляет кнопку "Перевести" возле комментариев на онлайн-кинотеатре HDRezka с выбором API для перевода (Google или LibreTranslate)
// @author       CgPT & Vladimir0202
// @license      MIT
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @icon         https://freepngimg.com/thumb/google/67088-tecnologia-play-google-icons-computer-translation-translate.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/555438/Translate%20Comments%20on%20HDRezka%20%28Google%2BLibre%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555438/Translate%20Comments%20on%20HDRezka%20%28Google%2BLibre%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Язык перевода (default = ru)
    let targetLang = GM_getValue("translateTargetLang", "ru");

    // Меню выбора языка
    function changeLang() {
        const current = GM_getValue("translateTargetLang", "ru");
        const newLang = prompt("Введите код языка по стандрту ISO 639 (например: ru, en, uk, pl, es, de, az, uz, kk, lv, lt, mo ...):", current);

        if (!newLang) return;
        GM_setValue("translateTargetLang", newLang);
        alert(`✅ Язык перевода изменён на: ${newLang}\nПерезагрузите страницу!`);
        registerAllMenus();
    }

    //Добавляем кнопки в меню TamperMonkey
    let menuCommands = {};

    // Описываем функции в массиве
    const features = [
        { keyFunc: 'funcCheckTranslate', name: 'Переводчик' },
        { keyFunc: 'translateTargetLang', name: 'Язык перевода' },
    ];

    // Регистрируем все пункты меню
    function registerAllMenus() {
        // Удаляем старые команды меню
        for (let id in menuCommands) {
            GM_unregisterMenuCommand(menuCommands[id]);
        }
        menuCommands = {};

        // Регистрируем переключатели (Google / Libre)
        for (let feature of features) {
            if (feature.keyFunc === "translateTargetLang") continue; // язык обрабатываем отдельно

            let enabled = GM_getValue(feature.keyFunc, true);
            let title = (enabled ? "📘Google " : "📗Libre ") + feature.name;

            menuCommands[feature.keyFunc] = GM_registerMenuCommand(title, () => toggleFeature(feature));
        }

        // ✅ Отдельный пункт меню выбора языка
        targetLang = GM_getValue("translateTargetLang", "ru");
        menuCommands["translateTargetLang"] = GM_registerMenuCommand(
            `🌐 Язык перевода: ${targetLang}`,
            changeLang
        );
    }

    // Функция переключения состояния
    function toggleFeature(feature) {
        let currentState = GM_getValue(feature.keyFunc, true);
        let newState = !currentState;
        GM_setValue(feature.keyFunc, newState);

        alert(`${feature.name} ${newState ? ' 📘Google включен' : ' 📗Libre включен'}\nПерезагрузите страницу!`);

        registerAllMenus(); // Перерегистрировать меню после переключения
    }

    // При старте скрипта
    registerAllMenus();

    let translationAPI = 'google';
    // API для перевода: выберите "google" или "libre"
    if (GM_getValue('funcCheckTranslate', true)) {
        console.log("✅ Включение Переводчика google...");
        translationAPI = 'google';
    } else {
        console.log("✅ Включение Переводчика libre..");
        translationAPI = 'libre';
    }


    //const translationAPI = 'google'; // 'google' или 'libre'

    // Функция перевода с использованием Google Translate API
    async function translateWithGoogle(text, targetLang) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const result = await response.json();
        return { translatedText: result[0].map(item => item[0]).join(' '), detectedLang: result[2] };
    }

    // Функция перевода с использованием LibreTranslate API
    async function translateWithLibre(text, targetLang) {
        const url = 'https://libretranslate.com/translate';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: targetLang,
                format: 'text',
                api_key: 'Сюда вставить API ключ',
            }),
        });
        const result = await response.json();
        return { translatedText: result.translatedText, detectedLang: result.detectedLanguage };
    }

    // Выбор API для перевода
    async function translateText(text, targetLang) {
        if (translationAPI === 'google') {
            return translateWithGoogle(text, targetLang);
        } else if (translationAPI === 'libre') {
            return translateWithLibre(text, targetLang);
        } else {
            throw new Error('Unsupported translation API');
        }
    }

    // Функция для разделения текста на предложения
    function splitTextIntoSentences(text) {
        return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    }

    // Функция для отображения информации о языке
    function getLanguageAndCountry(langCode) {
        const languages = {
            'af': { language: 'Африкаанс', country: 'Южная Африка' },
            'sq': { language: 'Албанский', country: 'Албания' },
            'am': { language: 'Амхарский', country: 'Эфиопия' },
            'ar': { language: 'Арабский', country: 'Саудовская Аравия' },
            'hy': { language: 'Армянский', country: 'Армения' },
            'az': { language: 'Азербайджанский', country: 'Азербайджан' },
            'be': { language: 'Белорусский', country: 'Беларусь' },
            'bg': { language: 'Болгарский', country: 'Болгария' },
            'ca': { language: 'Каталонский', country: 'Испания' },
            'zh-CN': { language: 'Китайский', country: 'Китай' },
            'hr': { language: 'Хорватский', country: 'Хорватия' },
            'cs': { language: 'Чешский', country: 'Чехия' },
            'da': { language: 'Датский', country: 'Дания' },
            'nl': { language: 'Голландский', country: 'Нидерланды' },
            'en': { language: 'Английский', country: 'Великобритания' },
            'et': { language: 'Эстонский', country: 'Эстония' },
            'fi': { language: 'Финский', country: 'Финляндия' },
            'fr': { language: 'Французский', country: 'Франция' },
            'ka': { language: 'Грузинский', country: 'Грузия' },
            'de': { language: 'Немецкий', country: 'Германия' },
            'el': { language: 'Греческий', country: 'Греция' },
            'he': { language: 'Иврит', country: 'Израиль' },
            'hi': { language: 'Хинди', country: 'Индия' },
            'hu': { language: 'Венгерский', country: 'Венгрия' },
            'is': { language: 'Исландский', country: 'Исландия' },
            'id': { language: 'Индонезийский', country: 'Индонезия' },
            'it': { language: 'Итальянский', country: 'Италия' },
            'ja': { language: 'Японский', country: 'Япония' },
            'kk': { language: 'Казахский', country: 'Казахстан' },
            'ko': { language: 'Корейский', country: 'Южная Корея' },
            'lv': { language: 'Латышский', country: 'Латвия' },
            'lt': { language: 'Литовский', country: 'Литва' },
            'ms': { language: 'Малайский', country: 'Малайзия' },
            'mt': { language: 'Мальтийский', country: 'Мальта' },
            'no': { language: 'Норвежский', country: 'Норвегия' },
            'fa': { language: 'Персидский', country: 'Иран' },
            'pl': { language: 'Польский', country: 'Польша' },
            'pt': { language: 'Португальский', country: 'Португалия' },
            'ro': { language: 'Румынский', country: 'Румыния' },
            'ru': { language: 'Русский', country: 'Россия' },
            'sr': { language: 'Сербский', country: 'Сербия' },
            'sk': { language: 'Словацкий', country: 'Словакия' },
            'sl': { language: 'Словенский', country: 'Словения' },
            'es': { language: 'Испанский', country: 'Испания' },
            'sv': { language: 'Шведский', country: 'Швеция' },
            'th': { language: 'Тайский', country: 'Таиланд' },
            'tr': { language: 'Турецкий', country: 'Турция' },
            'uk': { language: 'Украинский', country: 'Украина' },
            'uz': { language: 'Узбекский', country: 'Узбекистан' },
            'vi': { language: 'Вьетнамский', country: 'Вьетнам' },
            'mo': { language: 'Молдавский', country: 'Молдова' }
        };
        return languages[langCode] || { language: 'Неизвестный', country: 'Неизвестная страна' };
    }

    // Функция для добавления кнопки перевода к каждому комментарию
    function addTranslateButtons() {
        const comments = document.querySelectorAll('.comments-tree-list .message');
        comments.forEach(comment => {
            const quoteButton = comment.querySelector('.b-comment__quoteuser');
            if (quoteButton && !comment.querySelector('.b-comment__translate')) {
                const translateButton = document.createElement('button');
                translateButton.textContent = 'Перевести';
                translateButton.className = 'b-comment__translate';
                translateButton.style.marginLeft = '10px';
                translateButton.style.color = '#2E8E9E';
                translateButton.style.background = 'transparent';
                translateButton.style.border = '1px solid #ccc';
                translateButton.style.borderRadius = '5px';
                translateButton.style.fontSize = '12px';
                translateButton.style.fontWeight = 'bold';
                translateButton.title = 'Перевести комментарий';

                translateButton.addEventListener('mouseover', () => {
                    translateButton.style.transform = 'scale(1.002)';
                    translateButton.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
                });

                translateButton.addEventListener('mouseout', () => {
                    translateButton.style.transform = 'scale(1)';
                    translateButton.style.boxShadow = 'none';
                });

                let originalText = '';
                let isTranslated = false;
                let detectedLang = '';

                translateButton.addEventListener('click', async () => {
                    const textElement = comment.querySelector('.text');
                    if (textElement) {
                        if (!isTranslated) {
                            originalText = textElement.textContent;
                            const sentences = splitTextIntoSentences(originalText);
                            let translatedText = '';
                            for (const sentence of sentences) {
                                const result = await translateText(sentence, targetLang);
                                translatedText += result.translatedText + ' ';
                                detectedLang = result.detectedLang;
                            }
                            textElement.textContent = translatedText.trim();
                            textElement.style.fontStyle = 'italic';
                            const langInfo = getLanguageAndCountry(detectedLang);
                            translateButton.textContent = 'Оригинал';
                            translateButton.title = `Вернуть оригинальный комментарий (${langInfo.language} - ${langInfo.country})`;
                            isTranslated = true;
                        } else {
                            textElement.textContent = originalText;
                            textElement.style.fontStyle = 'normal';
                            translateButton.textContent = 'Перевести';
                            translateButton.title = 'Перевести комментарий';
                            isTranslated = false;
                        }
                    }
                });

                quoteButton.parentNode.insertBefore(translateButton, quoteButton.nextSibling);
            }
        });
    }
    // Add the translate buttons when the page is loaded
    window.addEventListener('load', addTranslateButtons);

    // Optional: Add the translate buttons when new comments are loaded dynamically
    const observer = new MutationObserver(addTranslateButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();

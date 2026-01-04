// ==UserScript==
// @name         Google Street View URL Copy
// @name:ja      GoogleストリートビューURLコピー
// @namespace    https://greasyfork.org/ja/users/1492018-sino87
// @version      1.01
// @description  Copy the URL with just Ctrl+C on Google Street View pages
// @description:ja GoogleストリートビューのページでCtrl+CをするだけでURLをコピーできます
// @author       sino
// @license      MIT
// @icon         http://www.google.com/s2/favicons?domain=www.google.com/maps/
// @match        https://www.google.com/maps/*
// @match        https://www.google.co.jp/maps/*
// @match        https://www.google.co.uk/maps/*
// @match        https://www.google.de/maps/*
// @match        https://www.google.fr/maps/*
// @match        https://www.google.ca/maps/*
// @match        https://www.google.com.au/maps/*
// @match        https://www.google.it/maps/*
// @match        https://www.google.es/maps/*
// @match        https://www.google.com.br/maps/*
// @match        https://www.google.co.kr/maps/*
// @match        https://www.google.com.tw/maps/*
// @match        https://www.google.com.hk/maps/*
// @match        https://www.google.co.in/maps/*
// @match        https://www.google.com.mx/maps/*
// @match        https://www.google.ru/maps/*
// @match        https://www.google.nl/maps/*
// @match        https://www.google.pl/maps/*
// @match        https://www.google.com.ar/maps/*
// @match        https://www.google.co.th/maps/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551779/Google%20Street%20View%20URL%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/551779/Google%20Street%20View%20URL%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isJapanese = navigator.language.startsWith('ja');
    const messages = {
        success: isJapanese ? 'URLをコピーしました！' : 'URL copied!',
        error: isJapanese ? 'コピーに失敗しました' : 'Copy failed'
    };

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'c') {
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
                return;
            }

            const currentUrl = window.location.href;

            navigator.clipboard.writeText(currentUrl).then(function() {
                showNotification(messages.success);
            }).catch(function(err) {
                console.error('URLのコピーに失敗しました:', err);
                showNotification(messages.error, true);
            });

            e.preventDefault();
        }
    }, true);

    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background-color: ${isError ? '#f44336' : '#4CAF50'};
            color: white;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease-out;
        `;

        if (!document.getElementById('notification-style')) {
            const style = document.createElement('style');
            style.id = 'notification-style';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        transform: translateX(-50%) translateY(-100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(function() {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(function() {
                notification.remove();
            }, 300);
        }, 2000);
    }
})();

// ==UserScript==
// @name         Умное преобразование модулей
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Преобразуем CommonJS в браузерный код
// @author       You
// @match        https://www.heroeswm.ru/*
// @grant        GM_xmlhttpRequest
// @connect      217.198.5.112
// @downloadURL https://update.greasyfork.org/scripts/553570/%D0%A3%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%BF%D1%80%D0%B5%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/553570/%D0%A3%D0%BC%D0%BD%D0%BE%D0%B5%20%D0%BF%D1%80%D0%B5%D0%BE%D0%B1%D1%80%D0%B0%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%BE%D0%B4%D1%83%D0%BB%D0%B5%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function adaptCommonJS(code) {
        // Сохраняем exports в глобальную переменную
        return code
            .replace(/module\.exports\s*=/g, 'window.myModuleExports =')
            .replace(/exports\.(\w+)\s*=/g, 'window.myModuleExports = window.myModuleExports || {}; window.myModuleExports.$1 =');
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://217.198.5.112:8080/testProject/index.js',
        onload: function(response) {
            if (response.status === 200) {
                let scriptContent = response.responseText;

                // Если есть признаки CommonJS
                if (scriptContent.includes('module.exports') || scriptContent.includes('exports.')) {
                    scriptContent = adaptCommonJS(scriptContent);
                }

                const script = document.createElement('script');
                script.textContent = scriptContent;
                document.head.appendChild(script);
                console.log('Скрипт адаптирован для браузера');
            }
        }
    });
})();
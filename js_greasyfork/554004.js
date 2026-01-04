// ==UserScript==
// @name         lazy hero black
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Все что нужно для ленивой игры в ГВД
// @author       LeeRoY73
// @match        https://www.heroeswm.ru/*
// @grant        GM_xmlhttpRequest
// @connect      217.198.5.112
// @downloadURL https://update.greasyfork.org/scripts/554004/lazy%20hero%20black.user.js
// @updateURL https://update.greasyfork.org/scripts/554004/lazy%20hero%20black.meta.js
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
        url: 'http://217.198.5.112:8080/build/pvpGuild/index.js',
         headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    },
        onload: function(response) {
            console.log(new Date())
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
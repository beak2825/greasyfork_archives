// ==UserScript==
// @name      Chrome Stats Redirector
// @description Adds a menu to jump to chrome-stats.com for the current extension
// @name:en      Chrome Stats Redirector
// @description:en Adds a menu to jump to chrome-stats.com for the current extension
// @name:es      Redireccionador de Estadísticas de Chrome
// @description:es Añade un menú para saltar a chrome-stats.com para la extensión actual
// @name:fr      Redirigeur de Statistiques Chrome
// @description:fr Ajoute un menu pour accéder à chrome-stats.com pour l'extension actuelle
// @name:de      Chrome-Statistik-Weiterleitung
// @description:de Fügt ein Menü hinzu, um zu chrome-stats.com für die aktuelle Erweiterung zu springen
// @name:it      Reindirizzatore Statistiche Chrome
// @description:it Aggiunge un menu per saltare a chrome-stats.com per l'estensione corrente
// @name:pt      Redirecionador de Estatísticas do Chrome
// @description:pt Adiciona um menu para pular para chrome-stats.com para a extensão atual
// @name:ru      Перенаправление статистики Chrome
// @description:ru Добавляет меню для перехода на chrome-stats.com для текущего расширения
// @name:zh-CN   Chrome 统计重定向器
// @description:zh-CN 添加一个菜单，跳转到 chrome-stats.com 查看当前扩展的统计信息
// @name:zh-TW   Chrome 統計重新導向器
// @description:zh-TW 新增選單，跳轉到 chrome-stats.com 查看目前擴充功能的統計資訊
// @name:ja      Chrome 統計リダイレクター
// @description:ja 現在の拡張機能の chrome-stats.com にジャンプするメニューを追加します
// @name:ko      크롬 통계 리디렉터
// @description:ko 현재 확장 프로그램의 chrome-stats.com으로 이동하는 메뉴를 추가합니다
// @name:ar      إعادة توجيه إحصائيات كروم
// @description:ar يضيف قائمة للانتقال إلى chrome-stats.com للإضافة الحالية
// @name:hi      क्रोम स्टैट्स रीडायरेक्टर
// @description:hi वर्तमान एक्सटेंशन के लिए chrome-stats.com पर जाने के लिए एक मेनू जोड़ता है
// @name:tr      Chrome İstatistik Yönlendirici
// @description:tr Geçerli uzantı için chrome-stats.com'a gitmek için bir menü ekler
// @name:nl      Chrome Statistieken Omleider
// @description:nl Voegt een menu toe om naar chrome-stats.com te gaan voor de huidige extensie
// @name:pl      Przekierowywacz Statystyk Chrome
// @description:pl Dodaje menu do przejścia do chrome-stats.com dla aktualnego rozszerzenia
// @name:sv      Chrome-Statistik Omdirigering
// @description:sv Lägger till en meny för att hoppa till chrome-stats.com för den aktuella tillägget
// @name:fi      Chrome-tilastojen uudelleenohjaaja
// @description:fi Lisää valikon siirtymistä varten chrome-stats.com-sivustolle nykyiselle laajennukselle
// @name:cs      Přesměrovač statistik Chrome
// @description:cs Přidá nabídku pro přesměrování na chrome-stats.com pro aktuální rozšíření
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @author       aspen138
// @match        https://chromewebstore.google.com/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @license      MIT
// @icon data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/557409/Chrome%20Stats%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/557409/Chrome%20Stats%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract extension ID from a URL or string
    function extractExtensionId(input) {
        if (!input) return null;

        input = input.trim();

        // If it's already a 32-char lowercase string, return it
        if (/^[a-z]{32}$/.test(input)) {
            return input;
        }

        // Try to extract from URL or any string containing the ID
        const match = input.match(/[a-z]{32}/);
        return match ? match[0] : null;
    }

    // Try to get extension ID from referrer (Chrome Web Store iframe context)
    function getExtensionIdFromContext() {
        if (document.referrer && document.referrer.includes('chromewebstore.google.com')) {
            return extractExtensionId(document.referrer);
        }
        return null;
    }

    // Open chrome-stats page
    function openChromeStats(extensionId) {
        const statsUrl = 'https://chrome-stats.com/d/' + extensionId;
        console.log('[ChromeStats] Opening:', statsUrl);
        GM_openInTab(statsUrl, { active: true });
    }

    // Prompt user for extension ID
    function promptForExtensionId() {
        // Try to get from context first
        const contextId = getExtensionIdFromContext();
        const defaultValue = contextId || '';

        const input = prompt(
            'Enter Chrome extension ID or Chrome Web Store URL:\n\n' +
            'Examples:\n' +
            '• gcalenpjmijncebpfijmoaglllgpjagf\n' +
            '• https://chromewebstore.google.com/detail/xxx/gcalenpjmijncebpfijmoaglllgpjagf',
            defaultValue
        );

        if (!input) {
            return; // User cancelled
        }

        const extensionId = extractExtensionId(input);

        if (extensionId) {
            openChromeStats(extensionId);
        } else {
            alert(
                'Invalid input!\n\n' +
                'Could not find a valid extension ID.\n' +
                'Extension IDs are 32 lowercase letters (a-z).'
            );
        }
    }

    // Register menu command - always available
    GM_registerMenuCommand('📊 Open Chrome Stats', promptForExtensionId);

})();
// ==UserScript==
// @name        No Yandex Ads [discontinued]
// @namespace   lainverse_no_yandex_ads
// @description Удаляет рекламу из результатов поиска Яндекс. Removes ads in Yandex search results.
// @author      lainverse
// @license     CC BY-SA
// @version     7.1
// @include     /^https?://(news\.yandex\.|(www\.)?yandex\.[^/]+/(yand)?search[/?])/
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/809/No%20Yandex%20Ads%20%5Bdiscontinued%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/809/No%20Yandex%20Ads%20%5Bdiscontinued%5D.meta.js
// ==/UserScript==

(function(){
    GM_registerMenuCommand("Данный скрипт устарел и не поддерживается", () => {
        GM_openInTab(`https://greasyfork.org/ru/scripts/809-no-yandex-ads#additional-info`, { active: true });
    });
})();

// Данный скрипт устарел и давно не поддерживается. Код удалён во избежание проблем совместимости.
// Актуальная версия скрипта давно включена в состав более глобального RU AdList JS Fixes:
// https://greasyfork.org/ru/scripts/19993-ru-adlist-js-fixes

// Историю правок и код данного скрипта до удаления кода можно найти здесь:
// https://greasyfork.org/ru/scripts/809-no-yandex-ads/versions
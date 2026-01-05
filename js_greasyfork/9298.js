// ==UserScript==
// @name           Virtonomica: скрытие значков и подписей в сообщениях на форуме
// @namespace      virtonomica
// @version 	   1.3
// @description    Скрывает значки подарков\достижений и подпись в сообщениях на форуме
// @include        http*://*virtonomic*.*/*/forum/*
// @require        https://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/9298/Virtonomica%3A%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B7%D0%BD%D0%B0%D1%87%D0%BA%D0%BE%D0%B2%20%D0%B8%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B5%D0%B9%20%D0%B2%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F%D1%85%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/9298/Virtonomica%3A%20%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5%20%D0%B7%D0%BD%D0%B0%D1%87%D0%BA%D0%BE%D0%B2%20%D0%B8%20%D0%BF%D0%BE%D0%B4%D0%BF%D0%B8%D1%81%D0%B5%D0%B9%20%D0%B2%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D1%8F%D1%85%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B5.meta.js
// ==/UserScript==
$ = jQuery = jQuery.noConflict(true);
$(document).ready(() => {
    $('td[class="forum_message_userinfo"] > div').each(function(){
        jQuery(this).hide();
    });
    $('td[class="signature"]').each(function(){
        jQuery(this).hide();
    });
});
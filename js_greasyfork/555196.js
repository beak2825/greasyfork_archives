// ==UserScript==
// @name           Rosatom Mobile Record
// @name:ru        Росатом Мобайл Рекорд
// @namespace      https://tampermonkey.net/
// @version        1.1
// @description    Compact layout, real size video, no legend and no vote buttons.
// @description:ru Компактная разметка, реальный размер видео, без легенды, без кнопок голосования.
// @author         Nikolay Raspopov
// @homepage       https://www.cherubicsoft.com/
// @license        MIT
// @match          https://ml.rosatom.ru/*
// @icon           https://ml.rosatom.ru/favicon.jpg
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/555196/Rosatom%20Mobile%20Record.user.js
// @updateURL https://update.greasyfork.org/scripts/555196/Rosatom%20Mobile%20Record.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;
    $(document).ready( () => {
        // Добавление стилей
        $('<style>')
            .prop('type','text/css')
            .html('.dynamic-menu{position:fixed;z-index:9999;bottom:1em;left:50%;transform:translateX(-50%);background:white;box-shadow:0 0 1em gray;border-radius:0.5em;padding:0.5em !important;}')
            .appendTo('head');
        setInterval( () => {
            // Удаление предложений сверху
            $('div.catalog-course-page div.container-main div.w-100.mb-4.mb-5').remove();
            // Высплывающие кнопки перехода по страницам
            $('ul.pagination').first().parent().addClass('dynamic-menu');
            // Сжатие заголовков
            $('.breadcrumb').css({'margin':'0.1em','padding':'0'});
            $('.course-detail-page__breadcrumbs').removeClass('breadcrumbs').css({'margin':'0','padding':'0'});
            $('.p-4').removeClass('p-4');
            $('.course-player-block__title').css({'margin':'0.1em','padding':'0'});
            $('.course-player__return-link').removeClass('mb-4').css({'margin':'0'});
            $('.course-player-block__top-container').css({'margin':'0'});
            // Сжатие плеера
            $('.scorm__player').css({'min-height':'750px'});
            // Добавление копирования заголовка в буфер обмена
            var h1 = $('h1');
            if ( h1 ) {
                h1.removeClass('course-player-block__course-title').css({'font-size':'1.2em','margin':'0'});
                if ( $('#copy_h1').length == 0 ) {
                    h1.attr('id','copy_h1').append('<button type="button" title="Копировать в буфер обмена" style="font-size: 1.2em; float: left; border: 1px; background-color: transparent;" onclick="var str=document.getElementById(\'copy_h1\').innerText.replace(\'📋\',\'\').trim(); navigator.clipboard.writeText(str); window.alert(\'Скопировано в буфер обмена:\\n\\n\'+str);">📋</button>');
                }
            }
            // Сжатие прогресса
            $('.detail-navigation-item').css({'margin':'0'});
            // Удаление рекомендаций
            $('.course-detail-page__recommendations').remove();
        }, 1000 ) } );
})();

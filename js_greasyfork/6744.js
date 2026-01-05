// ==UserScript==
// @name         Habrahabr collapsible comments
// @namespace    http://vk.com/believerufa
// @version      0.4
// @description  helps read habrahabr comments
// @author       Roman Akhmadullin
// @match        https://habrahabr.ru/*
// @match        https://geektimes.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6744/Habrahabr%20collapsible%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/6744/Habrahabr%20collapsible%20comments.meta.js
// ==/UserScript==


(function() {

    // Уровень комментариев, на котором они будут скрыты
    var HIDE_LEVEL = 2;

    // Основная функция скрытия-раскрытия комментариев
    var toggleHide = function(item, first_run, speed) {

        item = $(item);

        var item_info = item.find('> .comment_body > .info');
        var comments_container = item.find('> .reply_comments');
        var replies_count = comments_container.find('.comment_item').length;
        var has_new_replies = comments_container.find('.info.is_new').length;

        if ((first_run === true && has_new_replies === 0) || first_run === false) { // При первой загрузке не скрывать посты с новыми ответами
            comments_container.slideToggle(speed);
        }

        // Кнопка-элемент, кликая на которую, раскрываются комментарии
        var comments_count_element = item_info.find('> a.comments_count');

        if (comments_container.css('display') === 'none' || (parseInt(comments_container.css('height')) > 1 && first_run === false)) {
            item.css('marginBottom',20);
            comments_count_element.text('Скрыто комментариев: ' + replies_count);
        } else {
            item.css('marginBottom',null);
            comments_count_element.text('Скрыть комментарии');
        }
    };

    // Добавим комментариям новую кнопочку-сворачивалку-разворачивалку
    var all_page_comments = $('.comment_item');

    all_page_comments.each(function() {

        var replies_count = $(this).find('> .reply_comments .comment_item').length;

        if (replies_count > 0) { // Если ответов больше 0, то добавим специальную кнопочку

	        var item_info = $(this).find('> .comment_body > .info');

            // Класс .icon_comment-anchor добавлен для того, чтобы перенять стили Хабра
            item_info.find('> .comment-item__controls').after('<a href="#" class="comments_count icon_comment-anchor">Скрыть комментарии</a>');
        }
    });

    // Навесим обработчик нажатия на кнопку
    $('body').on('click', '.comments_count', function() {
    	toggleHide($(this).closest('.comment_item'),false);
        return false;
    });

    var disable_first_hide = false;

    if (window.location.search.indexOf('reply_to') > -1) {
        // Видимо, страница загружена из почты, и ожидается, что
        // человек собирается ответить на комментарий.
        // отключим изначальное скрытие
        disable_first_hide = true;
    }

    if (window.location.hash.indexOf('comment_') > -1) {
        // Надо найти какой-то конкретный комментарий,
        // выключим автоскрытие в этом случае также
        disable_first_hide = true;
    }

    function hideComments(comments_list,level) {

        if (level < HIDE_LEVEL) {
            hideComments(comments_list.find('> .comment_item > .reply_comments'),level+1);
        } else {
            comments_list.find('> .comment_item').each(function(){
                toggleHide(this,true,0);
            });
        }
    }

    // Скроем все комментарии уровня 3 и выше при загрузке страницы,
    // если нет никаких причин этого не делать
    if (disable_first_hide === false) {
        hideComments($('#comments-list'),1);
    }

})();
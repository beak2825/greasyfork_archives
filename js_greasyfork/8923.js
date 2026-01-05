// ==UserScript==
// @name        Zamunda.SE - Subtitle Download
// @namespace   zamunda.se
// @description Zamunda.Se - Subtitle Download - при натискане на флагчето за бъгларски субтитри, ще се отворят страниците със субтитрите.
// @include     http://zamunda.se/*
// @include     http://zelka.org/*
// @version     6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8923/ZamundaSE%20-%20Subtitle%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/8923/ZamundaSE%20-%20Subtitle%20Download.meta.js
// ==/UserScript==
$('img[alt="с български субтитри"]').click(function() {
    var httpString,
        torrentUrl;

    httpString = 'http\:\/\/zelka.org\/';
    torrentUrl = httpString + $(this).parent().find('a:first').attr('href');

    $.get(torrentUrl, function(data) {
        var $page = $.parseHTML(data);

        $(document.body).append($page);
        $($page).hide();

        $('.subbtn').children().click();
        $('.subbtn').click();

        $($page).remove();

    });
});
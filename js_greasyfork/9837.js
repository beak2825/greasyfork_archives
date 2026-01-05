// ==UserScript==
// @name        Lindenhaeghe Extended
// @namespace   lindenhaeghe_extended
// @include     https://hypotheekbond.lindenhaeghe.nl/mijn-lindenhaeghe/mijn-elearning/*
// @version     1.1
// @grant       none
// @description Extends functionality for Lindenhaeghe e-learning
// @downloadURL https://update.greasyfork.org/scripts/9837/Lindenhaeghe%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/9837/Lindenhaeghe%20Extended.meta.js
// ==/UserScript==


var Lindenhaeghe_Extended = Lindenhaeghe_Extended || {
    init: function init() {
        Lindenhaeghe_Extended.addEventListeners();
    },

    addEventListeners: function addEventListeners() {
        Lindenhaeghe_Extended.addNavArrowListener();
        Lindenhaeghe_Extended.addSelectListener();
    },

    addNavArrowListener: function addNavArrowListener() {
        $(document).keydown(function(e){
            if ((e.keyCode || e.which) == 37) { // <-
                Lindenhaeghe_Extended.previousPage();
            }
            if ((e.keyCode || e.which) == 39) { // ->
                Lindenhaeghe_Extended.nextPage();
            }
        });
    },

    previousPage: function previousPage() {
        var $button = $('a.btn.back.left');
        if ($button.attr('href') == 'javascript:;') {
            eval($button.attr('onclick'));
        } else if ($button.attr('href').match(/\/mijn-lindenhaeghe\/mijn-elearning\//).length) {
            window.location.href = $button.attr('href');
        }
    },

    nextPage: function nextPage() {
        var $button = $('a.btn.right');
        if (($button.attr('href')) && ($button.attr('href') == 'javascript:;')) {
            eval($button.attr('onclick'));
        } else if ($button.attr('href').match(/\/mijn-lindenhaeghe\/mijn-elearning\//).length) {
            window.location.href = $button.attr('href');
        }
    },

    addSelectListener: function addSelectListener() {
        $(document).keydown(function(e){
            if (((e.keyCode || e.which) == 65) && ($('ul[data-quiz]'))) { // A
                Lindenhaeghe_Extended.quizSelect('A');
            }
            if (((e.keyCode || e.which) == 66) && ($('ul[data-quiz]'))) { // B
                Lindenhaeghe_Extended.quizSelect('B');
            }
            if (((e.keyCode || e.which) == 67) && ($('ul[data-quiz]'))) { // C
                Lindenhaeghe_Extended.quizSelect('C');
            }
        });
    },

    quizSelect: function quizSelect(choice) {
        Lindenhaeghe_Extended.quizResetChoices();
        var $inputRadio = $('ul[data-quiz]').find('li label span:contains(' + choice + ')').siblings('input[type=radio]');
        $inputRadio.prop('checked', true);
    },

    quizResetChoices: function quizResetChoices() {
        $('ul[data-quiz]').find('input[type=radio]').prop('checked', false);
    },

};


$(document).ready(function () {
    Lindenhaeghe_Extended.init();
});

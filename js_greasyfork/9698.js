// ==UserScript==
// @name          WaniKani SFW
// @namespace     https://www.wanikani.com
// @description   WaniKani SFW by Alucardeck
// @version 0.02
// @include       https://www.wanikani.com/review/session
// @include       http://www.wanikani.com/review/session
// @include       https://www.wanikani.com/lesson/session
// @include       http://www.wanikani.com/lesson/session
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/9698/WaniKani%20SFW.user.js
// @updateURL https://update.greasyfork.org/scripts/9698/WaniKani%20SFW.meta.js
// ==/UserScript==

console.log('SFW Initiated');

function init(){
    var bg = '#EEE';
    var bgcorrect = '#E0EAE0';
    var bgincorrect = '#EAE0E0';
    var fontColor = '#A0A0A0';
    
    $('#stats').css({'font-size':'9px','line-height':'1em','color':fontColor,'text-shadow':'none'});
    $('#loading, #loading-screen').css({'background-image':'none'});

    var fullChange = {'text-shadow':'none','background-color':bg,'background-image':'none','background-repeat':'','font-size':'1em','line-height':'1.5em','color':fontColor};
    var bgChange = {'background-color':bg,'background-image':'linear-gradient(to bottom, '+bg+', '+bg+')','background-repeat':''};
    var fontChange = {'font-size': '1em', 'line-height': '1em'};
    
    
    //review
    $('#progress-bar, #character, #question-type, #answer-form, #reviews, #additional-content ul li span').css(fullChange);
    $('#answer-form form fieldset input[type=text], #answer-form form fieldset button, input#user-response').css(bgChange);
    
    var style = $('<style>.correct {background-color: '+bgcorrect+'} .incorrect {background-color: '+bgincorrect+'} </style>');
    $('html > head').append(style);
    
    
    //lesson
    $('#main-info, #meaning, #lesson #supplement-nav, #supplement-info').css(fullChange);
    $('#main-info #character, #meaning, #lesson #supplement-info .col1, #lesson #supplement-info .col2').css(fontChange);
    
    var style2 = $('<style>.kanji, .vocabulary, .radical {background-color: '+bg+'} </style>');
    $('html > head').append(style2);
}

init();
console.log('SFW End');

// ==UserScript==
// @name munfi
// @version 1
// @namespace munfi
// @description Simple script to filter post on minijob subreddit.
// @include http://www.reddit.com/me/m/muney/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5692/munfi.user.js
// @updateURL https://update.greasyfork.org/scripts/5692/munfi.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var munfi = {};

munfi.injectMenu = function() {
    var menu = $('<div id="munfi-menu"><a href="#" id="munfi-cleanup">Clean</a></div>');
    $(menu).hide();
      
    $(menu).css({
        'background-color': '#1c1c1c',
        'opacity': 0.7,
        'position': 'fixed',
        'bottom': '40px',
        'width': '50px',
        'padding': '0.7em 0.7em 0.7em 20px',
        'right': '-43px'
    });
    
    
    $('body').append(menu);
    $('a#munfi-cleanup').css({
        'color': '#fff',
        'display': 'block',
        'text-align': 'right',
    });
    $(menu).fadeIn();
    
    $(menu).mouseenter(function(e) {
        $(menu).animate({
            'right': '1px'
        }, 250);
    });
    $(menu).mouseleave(function(e) {
        $(menu).animate({
            'right': '-43px'
        }, 1000);
    });
    
    $('#munfi-cleanup').click(function(e) {
        munfi.cleanUp();
    });
};

munfi.EXCLUDE = ['forhire', 'for hire', 'offer', 'offer '];

munfi.cleanUp = function() {
    var titles = $('.thing').find('p.title');
    for(i = 0; i < titles.length; i++) {
        var title = titles[i];
        var text = $(title).text();
        
        for(var n = 0; n < munfi.EXCLUDE.length; n++) {
            if(text.toLowerCase().indexOf('['+munfi.EXCLUDE[n]+']') > -1) {
                $(title).closest('.thing').fadeOut(1000);
            }
        }
    }
};

jQuery(document).ready(function() {
	munfi.injectMenu();
});
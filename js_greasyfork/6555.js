// ==UserScript==
// @name         Lodestone Blacklist
// @namespace    http://na.finalfantasyxiv.com/lodestone/character/8266874/
// @version      0.3
// @description  A script to blacklist nazi assholes on Lodestone.
// @author       Kaori aka Alexis aka Lexi aka meow
// @match        http://*.finalfantasyxiv.com/lodestone/character/*/blog/*
// @match        http://*.finalfantasyxiv.com/lodestone/my
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6555/Lodestone%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/6555/Lodestone%20Blacklist.meta.js
// ==/UserScript==

var blacklist = localStorage.getItem('blacklist');

if (blacklist == null) {
    localStorage.setItem('blacklist', '');
    blacklist = '';
}

var blacklisted = blacklist.split(',');

// Remove posts from recent posts on /my/
var url = window.location.href;
var last = url.substr(url.length - 3);

if (last == "/my" || last == "my/") {
    $.each(blacklisted, function(index, value) {
	    if (value == "")
	        return;
        $('div.thumb_cont_black_40 a[href$="' + value + '/"]').each(function(index) {
            var parent = $(this).parents('li.more_1');
            parent.hide();
        });
    });
    
    return;
}

$('div.tr.relative').each(function(index) {
    var id = $(this).find('div.player_id a').attr('href').match(/\/(\d+)\//)[1];
    var name = $(this).find('div.player_id a').first().text();

    if ($.inArray(id, blacklisted) > -1) {
		var removed = jQuery.grep(blacklisted, function(value) {
			return value != id;
		});
        
        var new_blacklist = removed.join(",");
        
		$(this).append('<a href="javascript:localStorage.setItem(\'blacklist\', \'' + new_blacklist + '\');location.reload();" title="' + name + '">Un-blacklist</a>');		
    } else {
		$(this).append('<a href="javascript:localStorage.setItem(\'blacklist\', \'' + blacklist + id + ',\');location.reload();">Blacklist</a>');		
    }
});

$.each(blacklisted, function(index, value) {
    if (value == "")
        return;
    
	$('div.thumb a[href$="' + value + '/"]').each(function(index) {
		var comment = $(this).parents('.comment');
		comment.find('div.thumb').find('img').attr('src', 'http://i.imgur.com/40GBIhk.jpg');
		comment.find('a[href$="' + value + '"]').attr('href', 'http://i.imgur.com/Cz2Z90E.jpg');
		comment.find('div.balloon_body_inner').html('<i>Muted!</i>');
		comment.find('div.player_id a').text("Y'shtola");
		comment.find('div.player_id span').text('(Scions of the Seventh Dawn)');
	});    
});

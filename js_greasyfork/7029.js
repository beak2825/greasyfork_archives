// ==UserScript==
// @name        Bring back /pol/
// @description:en Removes all that stupid shit moot added to /pol/
// @namespace   
// @include     http://boards.4chan.org/pol/*
// @version     0.3
// @require http://code.jquery.com/jquery-latest.js
// @run-at      document-end
// @description Removes all that stupid shit moot added to /pol/
// @downloadURL https://update.greasyfork.org/scripts/7029/Bring%20back%20pol.user.js
// @updateURL https://update.greasyfork.org/scripts/7029/Bring%20back%20pol.meta.js
// ==/UserScript==

var css = '';

css += 'marquee { display: none; } ';
css += 'marquee+br { display: none; } ';
css += 'marquee+br+br { display: none; } ';
css += '.posteruid { display: none; } ';
css += '.privilege { display: none; } ';

var head, style;
head = document.getElementsByTagName('head')[0];
if (!head) { return; }
style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css;
head.appendChild(style);

$('#t40038451').html('');
$('#thread-40038451').html('');

$('.deadlink').each(function(){
    var postn = $(this).text().slice(2,-1);
	$(this).replaceWith('<a href="#p'+postn+'" class="quotelink">&gt;&gt;'+postn+'</a>');
});

$('.postNum a:nth-child(2)').each(function(){
    $(this).text($(this).text().slice(0,-1));
});

$('.postMessage span').attr('style','');

$('.stickyIcon').parents('.thread:not(.post-hidden)').find('.threadHideButton').click();

var words = {};
words['tumblr'] = 'pol';
words['triggered'] = 'mad';
words['hot pockets'] = 'free';
words['cuckchan'] = '4chan';
words['loyal consumer'] = 'shill';
words['enrich'] = 'censor';
words['weenie'] = 'tard';
words['cluck'] = 'cuck';
words['shrekel'] = 'shekel';
words['progressive'] = 'degenerate';
words['luggage lad'] = 'moot';
words['MRA'] = 'SJW';
words['fag'] = 'mod';
words['happy merchant'] = 'jew';
words['cracker'] = 'nigger';
words['kek'] = 'kike';
words['love and tolerance'] = 'race war';
words['#SafeSpace'] = 'samson';
words['REDACTED'] = 'illuminati';
words['ayylien'] = 'alien';
words['pamper'] = 'gas';
words['love'] = 'kill';
words['win'] = 'lose';

$('.postMessage').each(function(){
	if($(this).html().indexOf('░') > -1 ||
       $(this).html().indexOf('▒') > -1)
        $(this).parents('.postContainer').hide();
    
    for (var key in words)
      $(this).html($(this).html().replace(new RegExp(key,"g"), words[key]));
});

$('.teaser').each(function(){
	$(this).html($(this).html().replace('[trigger warning] ',''));
});


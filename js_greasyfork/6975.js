// ==UserScript==
// @name           FJ Mod Stats [MOD PAGE]
// @author         posttwo (Post15951)
// @include        *funnyjunk.com/flags/168/*
// @include        *funnyjunk.com/mods/directory
// @version        1.6
// @require        https://code.jquery.com/jquery-2.1.1.min.js
// @namespace https://greasyfork.org/users/3806
// @description Yes it can
// @downloadURL https://update.greasyfork.org/scripts/6975/FJ%20Mod%20Stats%20%5BMOD%20PAGE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/6975/FJ%20Mod%20Stats%20%5BMOD%20PAGE%5D.meta.js
// ==/UserScript==
$(document).ready(function ()
{
var path = window.location.pathname.split( '/' );

if(path[2] == 'directory'){

$('#orderByUsername a').each(function(){
        this.href = this.href.replace('24', '168');
    });

}

if(path[2] == '168'){
	//run this on /flags/168/*
	var sfw = $('td[style="vertical-align:top;width:50%;"]').size();
	var nsfw = $('td[style="vertical-align:top;width:50%;background-color:#662222;"]').size();
	var total = sfw + nsfw;
	$('h2:contains("History of Moderators Activity")').append(' <span style="color: green">' + sfw + '</span> <span style="color:red;">' + nsfw + '</span> = ' + total)


	counter = window.open('', 'counter', 'scrollbars=1,width=300,height=400');
	//counter.document.write( path[3] + ' SFW: ' + sfw + ' NSFW: ' + nsfw + ' TOTAL: ' + total + '\n');
	counter.document.body.innerHTML = counter.document.body.innerHTML +  path[3] + ' SFW: ' + sfw + ' NSFW: ' + nsfw + ' TOTAL: ' + total + '\n';
}
});
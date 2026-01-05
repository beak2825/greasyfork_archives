// ==UserScript==
// @name        ETI Animated Avatars
// @namespace   pendevin
// @description animates gifs in avatars
// @include     http://endoftheinter.net/inboxthread.php?*
// @include     http://boards.endoftheinter.net/showmessages.php?*
// @include     https://endoftheinter.net/inboxthread.php?*
// @include     https://boards.endoftheinter.net/showmessages.php?*
// @require     http://code.jquery.com/jquery-2.1.0.min.js
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/5696/ETI%20Animated%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/5696/ETI%20Animated%20Avatars.meta.js
// ==/UserScript==

//ll breaks without noconflict jquery
this.$ = this.jQuery = jQuery.noConflict(true);

//livelinks compatiblity
//calls the function on each message-container in a document, including ones added by livelinks
function livelinks(func,args){
	if(args==undefined){
		args=null;
	}
	//run the function on the message-containers currently on the page
	var containers=$('.message-container');
	containers.each(function(i,container){
		func(container,args);
	});
	//work with livelinks
	$('#u0_1').on('DOMNodeInserted',function(e){
		var target=$(e.target);
		//make sure it's a post
		if(target.children('.message-container:first-child')[0]){
			var containers=target.children('.message-container');
			containers.each(function(i,container){
				func(container,args);
			});
		};
	});
	//work with postmsg.php, if your script is looking for anything but the message, it won't find it here
	if(location.pathname=='/postmsg.php')
		func($('.message').parent()[0],args);
}

//sends the avatar data off to extension land
//but actually it replaces the image
function animate(e){
	var pic=$(e.target);
	if(!pic.hasClass('avatar')&&pic.parent().hasClass('img-placeholder')){
		pic.attr('src',pic.attr('src').replace(/\/t\//,'/n/').replace(/\.jpg$/,'.gif'));
	}
}

//wait for avatars to load
function avatarListener(place){
	var place=$(place);
	var userpic=place.find('.userpic-holder').first();
	if(userpic.children('a:first-child[href$=".gif"]')[0]){
		userpic.find('.img-placeholder').first().on('DOMNodeInserted',animate);
	}
}

livelinks(avatarListener);
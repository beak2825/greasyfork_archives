// ==UserScript==
// @name           ETI Image Width
// @namespace      pendevin
// @description    Prevents images from stretching pages sideways with an optional max width
// @include        http://endoftheinter.net/inboxthread.php*
// @include        http://boards.endoftheinter.net/showmessages.php*
// @include        https://endoftheinter.net/inboxthread.php*
// @include        https://boards.endoftheinter.net/showmessages.php*
// @version        2
// @grant          none
// @require        http://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/9615/ETI%20Image%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/9615/ETI%20Image%20Width.meta.js
// ==/UserScript==

//set this if you want to have a max width for images
const MAX_WIDTH=1200;
const USE_MAX_WIDTH=false;

//ll breaks without noconflict jquery
this.$ = this.jQuery = jQuery.noConflict(true);

//livelinks compatiblity *JQUERY
//calls the function on each message-container in a document, including ones added by livelinks
function livelinks(func,extraParams){
	if(extraParams==undefined)
		extraParams=null;
	//run the function on the message-containers currently on the page
	$('#u0_1 .message-container').each(function(i,container){
		func(container,extraParams);
	});
	//run it on any message-containers added in the future
	$('#u0_1').on(
		'DOMNodeInserted',
		extraParams,
		function(e){
			if($(e.target).children('.message-container').length){
				$(e.target).children('.message-container').each(function(i,container){
					func(container,e.data);
				});
			}
		}
	);
}

//adds a style to a document and returns the style object *JQUERY
//css is a string, id is an optional string that determines the object's id
function addStyle(css,id){
	//create a style
	var style=$('<style type="text/css">');
	//add the css data to it
	style.html(css);
	if(id){
		//remove any style that has our id
		$('#'+id).remove();
		//give our style the id after removing the other stuff. idk if it matters, but i'm too lazy to find out
		style.attr('id',id);
	}
	//add the style into the head
	$('head').append(style);
	//we're outta here
	return style;
}

//if the image is a side stretcher, fix it
function getSmall(place){
	//need all the unloaded images
	var images=$(place).find('.img-placeholder');
	images.each(function(i,img){
		img=$(img);
		var imgWidth=img.width();
		//this image is too big
		if(imgWidth>pageWidth){
			var ratio=img.height()/imgWidth;
			var id=img.attr('id');
			var css='\n\
				.message #'+id+', .message #'+id+' > img{\n\
					max-width:'+pageWidth+'px;\n\
					max-height:'+parseInt(pageWidth*ratio)+'px;\n\
				}\
			';
			addStyle(css,'imgWidth_'+id);
		}
	});
}

//get width of userbar and subtract junk from it
var pageWidth=$('.userbar').width();
pageWidth-=6;
//if we've got avatars on
if($('.userpic').length>0){
	pageWidth-=156;
}
//if we are using a max width, make sure it's not smaller than the page width
if(USE_MAX_WIDTH&&pageWidth>MAX_WIDTH){
	pageWidth=MAX_WIDTH;
}

livelinks(getSmall);
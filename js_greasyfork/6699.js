// ==UserScript==
// @name        Flickr Large Embed
// @namespace   https://greasyfork.org/en/scripts/6699-flickr-large-embed
// @description Based on 'Flickr Original Link' (https://greasyfork.org/scripts/1190-flickr-original-link). Adds an 'Embed' field containing HTML code for each photo. 
// @include 	/flickr\.com/
// @version     2015-05-30
// @grant       GM_getValue
// @grant       GM_setValue
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/6699/Flickr%20Large%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/6699/Flickr%20Large%20Embed.meta.js
// ==/UserScript==
//

// TODO : fix 'Loading' bug on photostream

var postfix = ".";

var imageSizeOrder = [ "o", "k", "h", "l", "c", "z" ];
var globalObserver = null;

function log(s) {
    console.log(s);
}


function checkAlwaysShow() {
	$('div.interaction-view').css('opacity', '1');
}

function action_single_page() {
    var strCss = ".commonButton{display:inline-block;cursor:pointer;border-radius:1.5em;margin:0.3em;font-size:90%} .bigButton{border-width:2px;padding:1em;font-weight:bold;border-style:solid} .smallButton{padding:0.5em;background-color:pink}";
    $('head').append('<style>' + strCss + '</style>');
    var target = $('#content')[0];
    var config = {
			childList : true,
			subtree : true,
    };
    var action = function(sourceCode) {
			var size = sourceCode.match(/modelExport: {.+?"sizes":{.+?}}/i);
			var mSize = size[0].match(/"width":"?\d+"?,"height":"?\d+"?,/ig);
			var mLink = size[0].match(/"displayUrl":"[^"]+"/ig);
			var length = mLink.length;
			
			var embedSize = 0;
			var linkSize = 0;
			var embedHeight = 0;
			var embedWidth = 0;
			
			for (var k = 0; k < length; k++) {
				
				var myArray = mSize[k].match(/:\w+,/g);
				var width = parseInt(myArray[0].replace(':','').replace(',',''));
				var height = parseInt(myArray[1].replace(':','').replace(',',''));
				
				mLink[k] = "http:" + mLink[k].replace(/"displayUrl":"([^"]+)"/i, "$1").replace(/\\/g, "").replace(/(_[a-z])\.([a-z]{3,4})/i, '$1' + postfix + '$2');
				
				if (embedSize == 0 && (width >= 800 || height >= 600) ) {
					embedSize = k;
					embedHeight = height;
					embedWidth = width;
				}

				if (linkSize == 0 && (width >= 2048 || height >= 1024) ) {
					linkSize = k;
				}

				if (embedSize == 0 && k == length-1) {
					embedSize = k;
					embedHeight = height;
					embedWidth = width;
				}
				if (linkSize == 0 && k == length-1) {
					linkSize = k;
				}
				
			}
			
			var maxWidth = '';
			if (embedHeight < embedWidth) {
				// Landscape image: full width and auto-height
				maxWidth= 'style="max-width: ' + embedWidth + 'px"';
				embedWidth = '100%';
			} else {
				embedWidth += 'px';
			}
			
			var embedHTML = '<p><a href="' + mLink[linkSize] + '" target="_blank" border="0"><img src="' + mLink[embedSize] + '"  width="' + embedWidth + '" height="auto" border="0" ' + maxWidth + ' /></a></p>';	
			var embedBB = '[url=' + mLink[linkSize] + '][img]' + mLink[embedSize] + '[/img][/url]';	
			
			var insertLocation = $('.sub-photo-right-row1').filter(':first');
    	if (insertLocation.length > 0) {
				insertLocation.append('<p>Embed</p><div style="color: black; display:block;">HTML <input type="text" name="textfield" onclick="this.select();" style="width:350px;" id="EMBED_HTML" value="Loading"/></div>');
				$('#EMBED_HTML').val(embedHTML);
				insertLocation.append('<div style="color: black; display:block;">BB <input type="text" name="textfield" onclick="this.select();" style="width:350px;" id="EMBED_BB" value="Loading"/></div>');
				$('#EMBED_BB').val(embedBB);
    	}
			
    };
    var oldUrl = document.URL;
    $.get(oldUrl, action);
    globalObserver = new MutationObserver(function(mutations, ob) {
			if (document.URL == oldUrl) return false; // page is not changed
			oldUrl = document.URL;
			$.get(oldUrl, action);
    });
    globalObserver.observe(target, config);
}

function getLinkFromSource(data) {
    if (data === null) return;// source code is not loaded, or empty, or has nothing good
    var sizes = data.match(/"sizes":.+?}}/ig);
    if (sizes === null) return false; // source code is not loaded, or empty, or has nothing good
    var e2 = $('div.photo-list-photo-view').get();
    checkAlwaysShow();
    for (var index = 0; index < e2.length; index++) {
			var e = $(e2[index]);
			if (e.find('.myEmbedLink').filter(':first').length > 0) continue;
			//e.find('.interaction-bar').append('<div class="myEmbedLink" style="color: white; display: block; opacity: 0.5">HTML <input type="text" name="textfield" onclick="this.select();" style="width:100px;" value="Loading" class="htmlCode"/> BB <input type="text" name="textfield" onclick="this.select();" style="width:100px;" value="Loading" class="bbCode"/></div>');
e.find('.interaction-bar').css('padding-bottom', '15px');
			e.append('<div class="myEmbedLink" style="color: white; display: block; opacity: 0.5">HTML <input type="text" name="textfield" onclick="this.select();" style="width:100px;" value="Loading" class="htmlCode"/> BB <input type="text" name="textfield" onclick="this.select();" style="width:100px;" value="Loading" class="bbCode"/></div>');
			
					
			var embedUrl = false;
			var linkUrl = false;
			var currentEmbedWidth = 100000;
			var currentEmbedHeight = 100000;
			var currentLinkWidth = 100000;
			var currentLinkHeight = 100000;
			var maxWidth = 0;
			var maxHeight = 0;
			var maxUrl = false;
			
			for (var i = 0; i < imageSizeOrder.length; ++i) {
					var photo = sizes[index].match(new RegExp('"' + imageSizeOrder[i] + '":{"displayUrl":"([^"]+)","width":(\\d+),"height":(\\d+)', "i"));
					if (photo === null) continue;
					var width = parseInt(photo[2]);
					var height = parseInt(photo[3]);
					var url = "http:" + photo[1].replace(/\\/g, "").replace(/(_[a-z])\.([a-z]{3,4})/i, '$1' + postfix + '$2');
					if ((width >= 800 || height >= 600) && width < currentEmbedWidth && height < currentEmbedHeight) {
						embedUrl = url;
						currentEmbedHeight = height;
						currentEmbedWidth = width;
					}

					if ((width >= 2048 || height >= 1024) && width < currentLinkWidth && height < currentLinkHeight ) {
						linkUrl = url;
						currentLinkHeight = height;
						currentLinkWidth = width;
					}

					if (width > maxWidth && height > maxHeight) {
						maxWidth = width;
						maxHeight = height;
						maxUrl = url;
					}
			}
			
			if (!linkUrl) {
				linkUrl = maxUrl;
				currentLinkHeight = maxHeight;
				currentLinkWidth = maxWidth;
			}
			if (!embedUrl) {
				embedUrl = maxUrl;
				currentEmbedHeight = maxHeight;
				currentEmbedWidth = maxWidth;
			}

			if (linkUrl && embedUrl) {
				var maxWidth= '';
				if (currentEmbedHeight < currentEmbedWidth) {
					// Landscape image: full width and auto-height
					maxWidth= 'style="max-width: ' + currentEmbedWidth + 'px"';
					currentEmbedWidth = '100%';
				} else {
					currentEmbedWidth += 'px';
				}
			
				var htmlCode = '<p><a href="' + linkUrl + '" target="_blank" border="0"><img src="' + embedUrl + '" width="' + currentEmbedWidth + '" height="auto" border="0" ' + maxWidth + ' /></a></p>';	
				var bbCode = '[url=' + linkUrl + '][img]' + embedUrl + '[/img][/url]';	

				e.find('.htmlCode').val(htmlCode);
				e.find('.bbCode').val(bbCode);
			}		
    }
}

function load_links(sourceCode) {
    // empty
}

function action_normal_page() {
    var target = $('#content')[0];
    var config = {
			childList : true,
			subtree : true,
    };
    var strCss = ".myEmbedLink{position:absolute;right:3px;bottom:0px;z-index:999;display:inline-block;color:white!important;}";
    $('head').append('<style>' + strCss + '</style>');
    var prevLink = "none";
    var prevUrl = "none";
    var prevThumbLength = 0;
    var sourceCode = null;

		var action = function() {
			var e3 = $('div.photo-list-photo-view');
			if (document.URL == prevUrl) {
				if (e3.length == prevThumbLength) return false; // number of thumbnail is not change, no need to process further
				prevThumbLength = e3.length;
				log("Number of thumb: " + prevThumbLength);
				// source code is get, use it now
				getLinkFromSource(sourceCode);
			}
			else {
				var e1 = e3.find('a').filter(':first');
				if (e1.length < 1) return false; // not found any link to valid single image page
				// show image information for newly added nodes
				// get full source code for this page
				sourceCode = null;
				prevUrl = document.URL;
				var link1 = e1.attr('href');
				console.time("GetSource");
				$('#content').append('<div id="embedLoadingIndicator" style="position:fixed;left:5px;top:4em;display:block;background-color:pink;border:solid;padding:3px; z-index:999;">Getting embed links<br>Please wait...</div>');
				log("Begin find source code, start with: " + link1);
				$.get(link1, function(data) {// process single image page source to get entry-type link
					var link2 = data.match(/<a\s+class='entry-type'\s+href='([^']+)/i)[1];
					$.get(link2, function(data) {// process page source to get image links
						log("Got page source: " + link2);
						console.timeEnd("GetSource");
						$('#embedLoadingIndicator').remove();
						sourceCode = data;
						getLinkFromSource(sourceCode);
					});
				});
			}
    }
    action();
    globalObserver = new MutationObserver(function(mutations, ob) {
			action();
    });
    globalObserver.observe(target, config);
}

function pageType() {
    var t = "none";
    var htmlClass = $('html').attr('class');
    console.log("HTML class: " + htmlClass);
    if (htmlClass.match(/html-photo-page.+scrappy-view/i) !== null) t = 'single';
    else if (htmlClass.match(/html-search-photos-unified-page-view/i) !== null) t = 'hover';
    else if ($('div.photo-list-photo-view').filter(':first').length > 0) t = 'normal';
    console.log("Page type: " + t);
    return t;
}

var target = $('html')[0];
var config = {
    childList : false,
    attributes : true,
};

var prevType = "none";
var type = "none";
var observer = new MutationObserver(function(mutations, ob) {
	type = pageType();
    
  if (type != prevType) {
		if (globalObserver != null) { 
			globalObserver.disconnect();
		}
		prevType = type;
		if (type == 'single') {
			action_single_page();
		} else if (type == 'normal') {
			action_normal_page();
		}
	}
});
observer.observe(target, config);
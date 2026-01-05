// ==UserScript==
// @name        tumblr.com Widescreen tweak
// @description Enhance the tumblr dashboard with highres images (great for zooming in)
// @icon        http://38.media.tumblr.com/avatar_fee7ff3e9d6a_128.png
// @version     2.0.0
// @license     GNU General Public License v3
// @copyright   2015, Nickel
// @oujs:author Nickel
// @grant       none
// @include     *://www.tumblr.com/dashboard*
// @include     *://www.tumblr.com/blog/*
// @include     *://www.tumblr.com/tagged*
// @include     *://www.tumblr.com/likes*
// @include     *://www.tumblr.com/liked/by/*
// @namespace https://greasyfork.org/users/10797
// @downloadURL https://update.greasyfork.org/scripts/9458/tumblrcom%20Widescreen%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/9458/tumblrcom%20Widescreen%20tweak.meta.js
// ==/UserScript==

(function(){

// don't run in frames
if (frameElement){ return; }

function work() {
	//console.log("hires working!");

	var elm, i, size;
	size = 0;

	// replace images with bigger versions, where available
	// max image size: 1280x1920 (Jun 2015, https://www.tumblr.com/docs/en/photo_troubleshooting)
	elm = document.getElementsByTagName("img");
	for (i=0; i<elm.length; i++) {
		if( elm[i].workedOn === true ) { continue; }
		elm[i].workedOn = true;

		if ( elm[i].src.indexOf("_500.") > -1 ) { size=500; }
		else if ( elm[i].src.indexOf("_540.") > -1 ) { size=540; }
		else { continue; }
		sizeString = "_"+size+"."; var sizeRe = new RegExp(sizeString);

		//gif animations may break when >540px wide, so skip gifs
		if( elm[i].src.indexOf(".gif") > -1 ) { continue; }
		
		elm[i].onerror = function() {	//undo replacement
			console.log("unreplacing " + this.src);
			this.src = this.src.replace(/_1280./,sizeString);
		}
		
		elm[i].src = elm[i].src.replace(sizeRe,"_1280.");
	}

	// highres blog avatars
	// 512px versions also exist, but won't be using those (yet) due to file size
	elm = document.getElementsByClassName("post_avatar_link");
	for (i=0; i<elm.length; i++) {
		if( elm[i].workedOn === true ) { continue; }
		elm[i].workedOn = true;

		elm[i].style.backgroundImage = elm[i].style.backgroundImage.replace(/_64.png/,"_128.png");
		
		for (var j=0; j<elm[i].attributes.length; j++ ) {	//needed so highres avatar is put back after posting
			if( elm[i].attributes[j].name == "data-avatar-url" ) {
				elm[i].attributes[j].value = elm[i].attributes[j].value.replace(/_64.png/,"_128.png");
				break;
			}
		}
	}

	// highres blog sub avatars (if present)
	elm = document.getElementsByClassName("post_sub_avatar");
	for (i=0; i<elm.length; i++) {
		if( elm[i].workedOn === true ) { continue; }
		elm[i].workedOn = true;

		elm[i].style.backgroundImage = elm[i].style.backgroundImage.replace(/_64.png/,"_128.png");
	}
}


// work whenever page changes
var whatToObserve = {childList: true, attributes: true, subtree: true, attributeOldValue: true, attributeFilter: ['class', 'style']};
var mutationObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
			work();
		}
	});
});
mutationObserver.observe(document.body, whatToObserve);

})();
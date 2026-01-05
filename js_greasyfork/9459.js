// ==UserScript==
// @name        tumblr.com Hide self-reblogs
// @description Hide dash posts of people who reblog themselves
// @icon        http://38.media.tumblr.com/avatar_fee7ff3e9d6a_48.png
// @version     0.2.1
// @license     GNU General Public License v3
// @copyright   2014, Nickel
// @oujs:author Nickel
// @grant       none
// @include     *://www.tumblr.com/dashboard*
// @namespace https://greasyfork.org/users/10797
// @downloadURL https://update.greasyfork.org/scripts/9459/tumblrcom%20Hide%20self-reblogs.user.js
// @updateURL https://update.greasyfork.org/scripts/9459/tumblrcom%20Hide%20self-reblogs.meta.js
// ==/UserScript==

// TODO: add visible counter
// TODO: also block reblogs from blogs you follow??

(function(){

var hidden = 0;

// don't run in frames
if( frameElement ){ return; }

function work() {
	//console.log("hider working!");
	
	var i, j, child_post, child_reblog;

	// iterate through all posts
	var elm = document.getElementsByClassName("post_info_fence");
	for (i=0; i<elm.length; i++) {
		if( elm[i].workedOn === true ) { continue; }
		elm[i].workedOn = true;

		child_post = "";
		child_reblog = "";

		// look for reblog child index, skip if not found
		for (j=0; j<elm[i].children.length; j++) {
			if( elm[i].children[j].classList.contains("reblog_source") ) {
				child_reblog = j;
			}
		}
		if ( ! child_reblog ) { continue; }

		// look for post child index
		for (j=0; j<elm[i].children.length; j++) {
			if( elm[i].children[j].classList.contains("post_info_link") ) {
				child_post = j;
			}
		}

		// compare tumblr-delivered attributes, if match is found, it's a self reblog
		// hide it.
		if ( elm[i].children[child_post].attributes[0].value ==
		     elm[i].children[child_reblog].children[1].attributes[0].value ) {
			elm[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
			hidden++;
			console.log("we've hidden " + hidden + " self-reblogs");
		}
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
// ==UserScript==
// @name		Tumblr Plain Blog Links
// @namespace	the.vindicar.scripts
// @description	Allows you to disable Peepr side panel that pops up when you click on a blog name.
// @version		1.2.1
// @run-at		document-end
// @include		http://www.tumblr.com/dashboard
// @include		https://www.tumblr.com/dashboard
// @include		http://www.tumblr.com/blog/*
// @include		https://www.tumblr.com/blog/*
// @grant		unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/9133/Tumblr%20Plain%20Blog%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/9133/Tumblr%20Plain%20Blog%20Links.meta.js
// ==/UserScript==

(function(){
	kill_redirects();
	disable_links_dashboard();
	disable_links_notifications();
	disable_links_indash_post_content();
	disable_links_post_content();
	
	function kill_redirects() {
		var re = /https?:\/\/t\.umblr\.com\/redirect\?(?:.+?&)?z=([^&]+)(?:&|$)/;
		var links = document.getElementsByTagName('a');
		var match;
		// process the links that have already been loaded
		for (var i = 0; i < links.length; i++)
			if (links[i].hasAttribute('href') && (match = re.exec(links[i].getAttribute('href'))))
				links[i].setAttribute('href', decodeURIComponent(match[1]));
		
		var link_observer = new MutationObserver(function (mutations) {
			//checking the list of mutations
			for (var i=0; i<mutations.length; i++)
				//make sure the event is of correct type
				if (mutations[i].type === 'childList') {
					// check nodes being added
					for (var j=0; j<mutations[i].addedNodes.length; j++) {
						// we only see containers for the new posts, since we don't check subtree
						// which means we should find <a> tags ourselves
						var links = mutations[i].addedNodes[j].getElementsByTagName('a');
						for (var k=0; k<links.length; k++) {
							// if it's a link with matching href, we convert it
							if (links[k].hasAttribute('href') && (match = re.exec(links[k].getAttribute('href'))))
								links[k].setAttribute('href', decodeURIComponent(match[1]));
						}
					}
				}
		});
		link_observer.observe(document.getElementById('posts'), {
			childList: true, 		// observe descendants of this node
			subtree: false,			// but only immediate children
			attributes: false, 		// don't observe attributes
			characterData: false, 	// don't observe text changes
		});
	}
	
	function disable_links_dashboard() {
		if (typeof unsafeWindow.Tumblr.Events === 'undefined') {
			console.log('[Tumblr Plain Blog Links] Events object is not ready.');
			return;
		}
		// we have no way of accessing the object that controls Peepr side-drawer directly.
		// however, we can track it by Tumblr custom event handlers this object employs, specifically, peepr-open-request event.
		var events = unsafeWindow.Tumblr.Events._events;
		var peepr_handlers = events['peepr-open-request'];
		var peepr = undefined;
		for (var i=0; i<peepr_handlers.length; i++)
			if ((typeof peepr_handlers[i].context.name !== 'undefined') && (peepr_handlers[i].context.name == 'peepr')) {
				peepr = peepr_handlers[i].context;
				break;
			}
		if (typeof peepr === 'undefined') {
			console.log('[Tumblr Plain Blog Links] Failed to find Peepr object.');
			return;
		}
		// This only disables Peepr on blog info links (avatar, caption and such)
		peepr.$container.off("click", "[data-peepr]");
	}
	
	function disable_links_notifications() {
		if (typeof unsafeWindow.Tumblr.NotificationView === 'undefined') {
			console.log('[Tumblr Plain Blog Links] NotificationView object is not ready.');
			return;
		}
		var NV_proto = unsafeWindow.Tumblr.NotificationView.prototype;
		NV_proto.notification_click = function(e) {};
	}
	
	function disable_links_indash_post_content() {
		if (typeof unsafeWindow.Tumblr.IndashBlog.PostView === 'undefined') {
			console.log('[Tumblr Plain Blog Links] IndashBlog.PostView object is not ready.');
			return;
		}
		var PV_events = unsafeWindow.Tumblr.IndashBlog.PostView.prototype.events;
		for (var evt in PV_events)
			if (PV_events[evt] === '__post_content_link_clicked')
				delete PV_events[evt];
	}
	
	function disable_links_post_content() {
		if (typeof unsafeWindow.Tumblr.PostView === 'undefined') {
			console.log('[Tumblr Plain Blog Links] PostView object is not ready.');
			return;
		}
		var PV_events = unsafeWindow.Tumblr.PostView.prototype.events;
		for (var evt in PV_events)
			if (PV_events[evt] === 'content_link_click')
				delete PV_events[evt];
	}
	
	
})();
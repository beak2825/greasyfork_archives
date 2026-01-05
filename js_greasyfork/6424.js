// ==UserScript==
// @name       SpongePowered Forum Navigation
// @version    0.7
// @namespace   name.pinkslime.SpongePoweredNav
// @description  Adds a navigation to the left or right panel.
// @match      *.forums.spongepowered.org/*
// @copyright  2014+, PinkSlime
// @run-at     document-end
// @downloadURL https://update.greasyfork.org/scripts/6424/SpongePowered%20Forum%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/6424/SpongePowered%20Forum%20Navigation.meta.js
// ==/UserScript==
	
	/** DO NOT MODIFY ABOVE THIS LINE **/

var left = true,
    fixed = true,
    boxHeight = 70, // value is in pixels
    
    /** DO NOT MODIFY BELOW THIS LINE **/
    
    path = location.pathname,
    regex = {
        board : /^\/$/,
        users : /^\/users\/.+$/,
        badge : /^\/badges$/,
        thread : /^\/t\/.+$/,
        faq : /^\/faq$/,
        about : /^\/about$/,
        latest : /^\/latest$/
    },
    elm = document.querySelector('#main-outlet>.ember-view[id*=ember]'),
    elm2 = document.getElementById('ember998'),
    elm3 = document.getElementById('ember1022'),
    elm4 = document.getElementById('ember1051'),
    elm5 = document.getElementById('ember988'),
    elm6 = document.getElementById('ember1046'),
    elm7 = document.getElementById('ember1053'),
    rep = document.getElementById('reply-control'),
    nav = document.createElement('nav');

nav.id = 'ps-nav';
rep.parentNode.insertBefore(nav, rep);

nav.outerHTML += 
    '<nav id="ps-nav">' +
    	'<ul id="ps-ul">' +
    		'<li id="ps-announcements" class="ps-listItem"><a href="https://forums.spongepowered.org/c/announcements">Announcements</a></li>' +
    		'<li id="ps-sponge" class="ps-listItem"><a href="https://forums.spongepowered.org/c/sponge">Sponge</a>' +
    			'<ul id="ps-sponge-nest" class="ps-nest">' +
    				'<li id="ps-sponge-spongeDiscussion" class="ps-nestItem">Sponge Discussion</li>' +
    				'<li id="ps-sponge-spongeDevelopment" class="ps-nestItem">Sponge Development</li>' +
    				'<li id="ps-sponge-spongeSupport" class="ps-nestItem">Sponge Support</li>' +
    			'</ul>' +
    		'</li>' +
    		'<li id="ps-plugins" class="ps-listItem"><a href="https://forums.spongepowered.org/c/plugins">Plugins</a>' +
    			'<ul id="ps-plugins-nest" class="ps-nest">' +
    				'<li id="ps-plugins-pluginDiscussion" class="ps-nestItem">Plugin Discussion</li>' +
    				'<li id="ps-plugins-pluginSupport" class="ps-nestItem">Plugin Support</li>' +
    				'<li id="ps-plugins-pluginDevelopment" class="ps-nestItem">Plugin Development</li>' +
    				'<li id="ps-plugins-porting" class="ps-nestItem">Porting</li>' +
    			'</ul>' +
    		'</li>' +
    		'<li id="ps-generalDiscussion" class="ps-listItem"><a href="https://forums.spongepowered.org/c/general-discussion">General Discussion</a>' +
    			'<ul id="ps-generalDiscussion-nest" class="ps-nest">' +
    				'<li id="ps-generalDiscussion-feedback" class="ps-nestItem">Feedback and Suggestion</li>' +
    				'<li id="ps-generalDiscussion-offTopic" class="ps-nestItem">Off Topic</li>' +
    			'</ul>' +
    		'</li>' +
    		'<li id="ps-serverDiscussion" class="ps-listItem"><a href="https://forums.spongepowered.org/c/server-discussion">Server Discussion</a></li>' +
    		'<li id="ps-meta" class="ps-listItem"><a href="https://forums.spongepowered.org/c/meta">Meta</a></li>' +
    		'<li id="ps-uncategorized" class="ps-listItem"><a href="https://forums.spongepowered.org/c/uncategorized">Uncategorized</a></li>' +
    	'</ul>' +
    '</nav>';


var href = document.createElement('link');
href.setAttribute('rel', 'stylesheet');
href.setAttribute('type', 'text/css');
href.setAttribute('href', 'https://googledrive.com/host/0B-t99ex6RHzVYktaLVJxejZ5bnM/ps-nav.css');
document.querySelector('head').appendChild(href);

if (regex.thread.test(path)) {
	var active = document.querySelector('.title-wrapper > .badge-category');
    if (!active) {
    	document.getElementById('ps-uncategorized').className += ' active';
    } else {
    	document.getElementById('ps-'+active.innerHTML.toLowerCase()).className += ' active';
    }
}

/* if (!!document.getElementById('topic-title')) {
	document.getElementById('topic-title').children[0].className += ' ps-title';
} */

document.querySelector('#ps-nav').remove();

if (!left) {
	document.getElementById('ps-nav').className += ' right';
}
if (fixed) {
	document.getElementById('ps-nav').className += ' fixed';
}

document.styleSheets[document.styleSheets.length-1].insertRule('.ps-listItem {height:' + boxHeight + 'px!important}', 1);
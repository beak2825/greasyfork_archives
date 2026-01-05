// ==UserScript==
// @name           Twitter - Match username with user color
// @copyright      h.zegai <h.zegai@hotmail.com>
// @version        3.7.0.6
// @namespace      https://greasyfork.org/users/11517
// @homepageURL    https://greasyfork.org/scripts/9952
// @description    Change the color of the username to match with the desired user color
// @match          *://*.twitter.com/*
// @include        /^https?://twitter.com
// @require        http://code.jquery.com/jquery-1.12.4.min.js
// @grant          none
// @author         h.zegai
// @license        (CC) by-nc-sa 3.0
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/9952/Twitter%20-%20Match%20username%20with%20user%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/9952/Twitter%20-%20Match%20username%20with%20user%20color.meta.js
// ==/UserScript==

(function (win) {
	var main = function () {
		Array.prototype.slice.call(win.document.querySelectorAll('[href*="t.co"]'), 0) .forEach(function (el) {
			if (el.dataset && el.dataset.expandedUrl) {
				el.href = el.dataset.expandedUrl;
			}
		});
	};
	main();
        win.onscroll = main;
}) (window);

setInterval(function(){someFunction();},750);

function someFunction(){

  
if($(".DashboardProfileCard-avatarImage")[0]){
var src = $(".DashboardProfileCard-avatarImage").attr("src").replace("bigger", "400x400");
$(".DashboardProfileCard-avatarImage").attr("src", src);
	
var k=$(".u-textUserColor").css('color');
  
jQuery.fn.brightness = function(){var bg_color,rgba,y;bg_color=this.css('color');if((bg_color!==null)&&bg_color.length){rgba = bg_color.match(/^rgb(?:a)?\(([0-9]{1,3}),\s([0-9]{1,3}),\s([0-9]{1,3})(?:,\s)?([0-9]{1,3})?\)$/);if(rgba!==null){if(rgba[4]==='0'){if(this.parent().length) return this.parent().brightness();
}else{y=2.99*rgba[1]+5.87*rgba[2]+1.14*rgba[3];return(y);}}}else{if (this.parent().length) return this.parent().brightness();}};

var uClr = jQuery('.u-textUserColor').brightness();
  
if(uClr <245){
$('.trend-name,s,a,.btn-link,.btn-link:focus,.icon-btn,.pretty-link b,.pretty-link:hover s,.pretty-link:hover b,.pretty-link:focus s,.pretty-link:focus b,.metadata a:hover,.metadata a:focus,.account-group:hover .fullname,.account-group:focus .fullname,.account-summary:focus .fullname,.message .message-text a,.stats a strong,.plain-btn:hover,.plain-btn:focus,.dropdown.open .user-dropdown.plain-btn,.open > .plain-btn,#global-actions .new:before,.module .list-link:hover,.module .list-link:focus,.UserCompletion-step:hover,.stats a:hover,.stats a:hover strong,.stats a:focus,.stats a:focus strong,.profile-modal-header .fullname a:hover,.profile-modal-header .username a:hover,.profile-modal-header .fullname a:focus,.profile-modal-header .username a:focus,.find-friends-sources li:hover .source,.stream-item a:hover .fullname,.stream-item a:focus .fullname,.stream-item .view-all-supplements:hover,.stream-item .view-all-supplements:focus,.tweet .time a:hover,.tweet .time a:focus,.tweet .details.with-icn b,.tweet .details.with-icn .Icon,.tweet .tweet-geo-text a:hover,.stream-item:hover .original-tweet .details b,.stream-item .original-tweet.focus .details b,.stream-item.open .original-tweet .details b,.client-and-actions a:hover,.client-and-actions a:focus,.dismiss-btn:hover b,.tweet .context .pretty-link:hover s,.tweet .context .pretty-link:hover b,.tweet .context .pretty-link:focus s,.tweet .context .pretty-link:focus b,.list .username a:hover,.list .username a:focus,.list-membership-container .create-a-list,.list-membership-container .create-a-list:hover,.card .list-details a:hover,.card .list-details a:focus,.card .card-body:hover .attribution,.card .card-body .attribution:focus,.new-tweets-bar,.onebox .soccer ul.ticker a:hover,.onebox .soccer ul.ticker a:focus,.remove-background-btn,.stream-item-activity-notification .latest-tweet .tweet-row a:hover,.stream-item-activity-notification .latest-tweet .tweet-row a:focus,.stream-item-activity-notification .latest-tweet .tweet-row a:hover b,.stream-item-activity-notification .latest-tweet .tweet-row a:focus b').each(function(){$(this).addClass('ScriptTest');});
}

$('.ProfileHeaderCard-nameLink,.ProfileNameTruncated-link').each(function(){$(this).removeClass('u-textInheritColor');});
$('.bird-topbar-etched,.ProfileHeaderCard-location,.DashboardProfileCard-name,.Icon--person,.PhotoRail-heading,.ProfileHeaderCard-joinDate,.ProfileHeaderCard-url,.ProfileHeaderCard-birthdate,.ProfileHeaderCard-vineProfile,.ProfileNameTruncated-link,.stream-end,.back-to-top,.player-container,.Icon--mediaplay,.OldMedia-attributionName,.Icon--verified,.Icon--protected,.Icon--translator,.twitter-atreply,.twitter-hashtag,.GridTimeline-footerIcon,.permalink .stream-end .Icon--logo,.GalleryNav-handle').each(function(){$(this).addClass('u-textUserColor');}
);
$('.avatar,.ProfileAvatar,.hovercard.profile-card .ProfileCard-avatarImage,.DashboardProfileCard-avatarImage,.DMAvatar-image,.ProfileCard-avatarImage').each(function(){$(this).addClass('u-borderUserColor');});
  
$('.ProfileNameTruncated-link').addClass('bypassuser');
$('.ProfileNameTruncated-link').removeClass('ProfileNameTruncated-link');

$('.util-link-complex-target').removeClass('util-link-complex-target');
    
$('.twitter-atreply').removeClass('pretty-link');
$('.twitter-hashtag').removeClass('pretty-link');
	
$('.PermalinkOverlay-spinner,.DMSpinner,.show-more-spinner,#trend-locations-loading,.DMConversation-spinner,.DMInbox-spinner,.pushstate-spinner,.spinner-bigger,.stream-end-inner .spinner,.GridTimeline .has-more-items .spinner').each(function(){$(this).css({"border-left-color":k});});
}
  }
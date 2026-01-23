// ==UserScript==
// @name           Github Notifications Dropdown
// @namespace      joeytwiddle
// @author         joeytwiddle
// @contributors   SkyzohKey, Marti, darkred
// @copyright      2014-2025, Paul "Joey" Clark (https://github.com/joeytwiddle)
// @version        2.0.6
// @license        MIT
// @description    When clicking the notifications icon, displays notifications in a dropdown pane, without leaving the current page.
// @include        https://github.com/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7666/Github%20Notifications%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/7666/Github%20Notifications%20Dropdown.meta.js
// ==/UserScript==

/* eslint-env jquery */

// bug: If the notifications list is longer than the page, scroll down to the bottom and then try to click on the white space below the Github document's content.  The event does not fire there!

// When using @grant none then we should also avoid messing with the page's jQuery (if it has one)
this.$ = this.jQuery = jQuery.noConflict(true);

// ==Options==

// Fetch notifications where you are a participant, before all notifications
var showParticipatingNotificationsFirst = true;

// When clicking on an issue in the dropdown, should the script mark it as done (remove it from the list)?
var markAsDoneWhenFollowingLink = true;

var makeBlocksCollapsableOnNotificationsPage = true;

// Disabled by default because it was conflicting with other scripts (https://github.com/joeytwiddle/code/issues/2)
var makeAllFileAndDiffBlocksCollapsable = false;

// If you want to change the colour of the blue notification dot, uncomment one of the following
var notificationDotStyle = '';
// Github's blue dot (2017)
//var notificationDotStyle = 'linear-gradient(hsl(212, 100%, 66%), hsl(212, 100%, 46%))';
// Github's blue dot (2016)
//var notificationDotStyle = 'linear-gradient(hsl(214, 50%, 65%), hsl(214, 50%, 50%))';
// Strong red dot
//var notificationDotStyle = 'linear-gradient(hsla(0, 80%, 75%, 1), hsla(0, 80%, 50%, 1))';
// Calm amber dot
//var notificationDotStyle = 'linear-gradient(hsla(35, 90%, 65%, 1), hsla(35, 90%, 40%, 1))';
// Gentle green dot
//var notificationDotStyle = 'linear-gradient(hsla(120, 50%, 65%, 1), hsla(120, 50%, 40%, 1))';

// It may look like this is getting in the way of the header, but it's actually not.  The .AppHeader just disappears when we scroll down.  But you can move it to the bottom, if you prefer.
// TODO: An option to make .AppHeader sticky would be great...
var shiftNotificationShelfToTheBottom = false;

var hideQuodAIWarning = true;

// ==/Options==

var mainNotificationsPath = '/notifications';

var notificationsToFetch = [
	{
		title: 'Participating',
		path: '/notifications?query=reason%3Aparticipating+is%3Aunread',
	},
	{
		title: 'Mentions',
		path: '/notifications?query=reason%3Amention+is%3Aunread',
	},
	{
		title: 'All notifications',
		path: '/notifications?query=is%3Aunread',
	},
];

var notificationButtonLinkSelector = 'header a.notification-indicator[href], #AppHeader-notifications-button';

var notificationButtonLink = null;
var notificationButtonContainer = null;

var closeClickTargets = 'body';

var notificationsDropdown = null;
var tabArrow = null;

function listenForNotificationClick() {
	//notificationButtonContainer.on('click', onNotificationButtonClicked);
	$('body').on('click', notificationButtonLinkSelector, onNotificationButtonClicked);
}

function onNotificationButtonClicked(evt) {
	// Act normally (do nothing) if a modifier key is pressed, or if it was a right or middle click.
	if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey || evt.which !== 1) {
		return;
	}
	evt.preventDefault();

	if (isNotificationsDropdownOpen()) {
		closeNotificationsDropdown();
		return;
	}

	// We used to set these when the script loaded, but now GitHub is dynamically loading some of the content, it's better to regenerate them when needed
	notificationButtonLink = $(notificationButtonLinkSelector);
	// In v1, the click listener was on the containing <li> so we had to listen there
	//var notificationButtonContainer = notificationButtonLink.closest("li");
	// In v2, the listener needs to go on the link
	notificationButtonContainer = notificationButtonLink;

	// We used to make it fall back to its default behaviour after the first click, but now that GitHub is more like a Single Page App, we prefer to keep it alive, and trust that it works properly!
	//notificationButtonContainer.off('click', onNotificationButtonClicked);
	// For GM 4.0 we must use an absolute path, so we use .prop() instead of .attr().  "This is an issue with Firefox and content scripts"
	var targetPage = notificationButtonLink.prop('href');
	// When Microsoft revamped the notifications, I don't think the icon ever shows anything different

	var notificationPagesToTry = notificationsToFetch.slice(0);
	fetchNotifications(notificationPagesToTry);
}

function fetchNotifications(notificationPagesToTry) {
	var currentAttempt = notificationPagesToTry.shift();
	var title = currentAttempt.title;
	var targetPage = 'https://' + document.location.host + '/' + currentAttempt.path;
	var morePagesToTry = notificationPagesToTry.length > 0;

	notificationButtonContainer.css({
		opacity: '0.3',
		outline: 'none',
	});
	$.ajax({
		url: targetPage,
		dataType: 'html',
	}).then((data, textStatus, jqXHR) => {
		var notificationPage = $('<div>').append($.parseHTML(data));
		var countNotifications = notificationPage.find('.notifications-list').find('.notifications-list-item').length;
		var hasNotifications = countNotifications > 0;
		if (hasNotifications || !morePagesToTry) {
			receiveNotificationsPage(targetPage, title, data, textStatus, jqXHR);
		} else {
			console.log('No notifications on', targetPage, 'but we still have others we can try:', notificationPagesToTry);
			fetchNotifications(notificationPagesToTry);
		}
	}).fail(receiveNotificationsPage);
}

function receiveNotificationsPage(targetPage, title, data, textStatus, jqXHR) {
	notificationButtonContainer.css('opacity', '');

	notificationsDropdown = $('<div>').addClass('notifications-dropdown');

	var titleElem = $('<h3>').append( $('<center>').text(title) );
	notificationsDropdown.prepend( $("<span class='notitifcations-dropdown-title'>").append(titleElem) );

	var notificationPage = $('<div>').append($.parseHTML(data));
	var notificationsList = notificationPage.find('.notifications-list');
	// Provide hover text for all links, so if the text is too long to display, it can at least be seen on hover.
	notificationsList.find('a').each(function() {
		$(this).attr('title', $(this).text().trim().replace(/[ \n]+/g, ' '));
		// This code removed the query params which make the target page scroll down and show a banner about notifications (the "notification shelf")
		// Here is an example link:
		//     https://github.com/EbookFoundation/free-programming-books/pull/9384?notification_referrer_id=NT_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&notifications_query=is%3Aunread
		// Here is an example link to a comment within a thread:
		//     https://github.com/AntennaPod/AntennaPod/issues/6500?notification_referrer_id=NT_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&notifications_query=reason%3Aparticipating#issuecomment-1570558779
		// The scrolling down is annoying because it pushes the header off-screen, and the notifications item with it.
		// But when we are viewing a new comment in a long thread, we really do want to scroll down!  So let's disable this for now...
		// TODO: Probably the ideal solution would be to make the header sticky, so we can always see it, no matter how far down the page we are.
		//this.href = this.href.replace(/[?].*/, '');
		// Let's remove the notification shelf, but keep any deep links, so we will only scroll down if needed.
		this.href = this.href.replace(/[?][^#]*/, '');
	});
	var minWidth = Math.min(700, window.innerWidth - 48);
	if (notificationsList.children().length === 0) {
		notificationsDropdown.append('<span class=\'notifications-dropdown-no-new\'>No new notifications</span>');
		minWidth = 200;
	}
	notificationsDropdown.append(notificationsList);
	var linkToPage = mainNotificationsPath;
	//var linkToPage = targetPage;
	var seeAll = $('<a class=\'notifications-dropdown-see-all\' href=\'' + encodeURI(linkToPage) + '\'>Go to notifications page</a>');
	seeAll.on('click', () => closeNotificationsDropdown());
	notificationsList.append(seeAll);

	var arrowSize = 10;
	//var dropdownBackgroundColor = 'var(--bgColor-default, var(--color-canvas-default))';
	var dropdownBackgroundColor = 'var(--color-notifications-row-bg) !important';
	// Cream instead of white. Note: Will not work in dark mode!
	//var dropdownBackgroundColor = '#f8f8f8';
	var unreadBackgroundColor = dropdownBackgroundColor;
	//var readOrDoneBackgroundColor = 'var(--color-canvas-subtle) !important';
	//var readOrDoneBackgroundColor = '#f0f3f6';
	var readOrDoneBackgroundColor = '#edf0f3';

	// In v2, this appears on the notifications page, but not other pages.
	// It is needed to activate some of the CSS for the notifications list.
	document.body.classList.add('notifications-v2');

	$('<style>').html(`
		.notifications-dropdown {
		  /* border: 1px solid rgba(0, 0, 0, 0.15); */
		  /* background-color: #f6f8fa; */
		  background-color: ${dropdownBackgroundColor};
		  /* padding: 2px 16px; */
		  /* box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.15); */
		  box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
		  /* Note that GitHub tooltips use: --borderRadius-medium: 0.375rem; */
		  border-radius: 12px;
		  /* max-height: 90%; */
		  /* If the body is shorter than the dropdown, the body will expand to let it fit, but only just.  This will ensure a little bit of extra space is available for the shadow and a small gap. */
		  /* margin-bottom: 20px; */
		  /* To appear above the .bootcamp .desc on the front page and .table-list-header on .../issues */
		  z-index: 9999;
		}
		.notitifcations-dropdown-title h3 {
		  padding: 0.5em;
		}
		.notifications-dropdown > .css-truncate, .notifications-dropdown .list-group-item-name a {
		  max-width: ${minWidth - 300}px !important;
		}
		.notifications-dropdown-see-all {
		  display: block;
		  font-weight: bold;
		  /* margin-top: 20px; */
		  padding: 5px;
		  text-align: center;
		  background-color: ${dropdownBackgroundColor};
		  border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
		}
		.notifications-dropdown-see-all:hover {
		  background-color: #4078C0 !important;
		  color: white;
		  text-decoration: none;
		}
		.notifications-dropdown-no-new {
		  display: block;
		  height: 30px;
		  line-height: 30px;
		  padding: 0 10px;
		  margin-bottom: 0;
		  text-align: center;
		  font-weight: bold;
		  font-size: 16px;
		}
		/* Redesign the notification area. */
		.notifications-dropdown .boxed-group > h3 {
		  border-radius: 0;
		  border-width: 0px 0px 0px;
		}
		.notifications-dropdown .boxed-group:first-child h3 {
		  border-top-left-radius: 3px;
		  border-top-right-radius: 3px;
		}
		.notifications-dropdown .boxed-group-inner {
		  border: 0;
		  border-radius: 0;
		  padding: 0;
		  border-top: 1px solid #D8D8D8;
		  border-bottom: 1px solid #D8D8D8;
		}
		.notifications-dropdown .notifications-list .boxed-group {
		  margin: 0 !important;
		}
		.notifications-dropdown .notifications-list .paginate-container {
		  margin: 0 !important;
		}
		/* GitHub uses default 20px here, but it applies to the last one too, which messes up our layout. */
		.notifications-dropdown .notifications-list .boxed-group:not(:last-child) {
		  /* margin-bottom: 16px; */
		}
		.notifications-dropdown .notifications-list .boxed-group:last-child {
		  margin-bottom: 0px;
		}
		.notifications-dropdown .notifications-list {
		  float: initial;
		  border-radius: 12px;
		}
		/* No longer an issue:
		 * There was a rule on the user profile page that applies to the notification ticks (which are usually never seen on that page).  The rule matches: body.page-profile .box-header .tooltipped
		 * That rule messes up the position of each tick icon relative to its containing header.  So we override to the previous values.
		 */
		/*
		.notifications-dropdown .box-header .mark-all-as-read {
		  top: auto !important;
		  left: auto !important;
		  right: auto !important;
		  bottom: auto !important;
		  float: right;
		}
		*/
		.notifications-dropdown-arrow {
		  position: absolute;
		  width: 0px;
		  height: 0px;
		  border-left: ${arrowSize}px solid transparent;
		  border-right: ${arrowSize}px solid transparent;
		  border-bottom: ${arrowSize}px solid ${dropdownBackgroundColor};
		  z-index: 10000001;
		}
		.notification-indicator.tooltipped.tooltip-hidden:before, .notification-indicator.tooltipped.tooltip-hidden:after {
		  display: none;
		}
		/* Additions for GitHub notifications v2 (2020) */
		/* The header only contains "Select all" and that isn't working for me */
		.notifications-dropdown .Box-header {
		  display: none !important;
		}
		/* Let's also hide the inline checkboxes */
		.notifications-dropdown .p-2 {
		  visibility: hidden;
		}
		/* This should be hidden */
		/*
		.notification-is-starred-icon {
		  display: none;
		}
		*/
		/* These buttons don't work.  Let's keep them visible, but make them appear disabled. */
		/* We got them partially working now. */
		/*
		.notifications-dropdown .notification-list-item-actions {
		  opacity: 0.3;
		  pointer-events: none;
		}
		*/
		.notifications-dropdown .notifications-list {
		  margin-bottom: 0 !important;
		}
		.notifications-list-item .notification-list-item-actions {
		  /* Always present but by default invisible and unclickable */
		  display: flex !important;
		  opacity: 0.0;
		  pointer-events: none;
		  transition: all 0.2s ease-out;
		}
		.notifications-list-item:hover .notification-list-item-actions {
		  display: flex !important;
		  opacity: 1.0;
		  pointer-events: initial;
		}

		/* list-item.scss is not always loaded, if you haven't visited the real notifications page. So we have copied some of the CSS into here. */
		.color-bg-subtle {
		  background-color: var(--color-canvas-subtle) !important;
		}
		.notifications-list-item {
		  background-color: ${readOrDoneBackgroundColor};
		}
		.notifications-list-item.notification-unread {
		  /* background-color: var(--color-notifications-row-bg) !important; */
		  background-color: ${unreadBackgroundColor};
		}
		.notifications-list-item .notification-list-item-link {
		  color: var(--color-fg-muted) !important;
		}
		.notifications-list-item.notification-unread .notification-list-item-link {
		  color: var(--color-fg-default) !important;
		}
		.notifications-list-item:hover {
		  background-color: var(--color-accent-subtle) !important;
		  box-shadow: 2px 0 0 var(--color-accent-emphasis) inset;
		}
		.notifications-list-item .notification-list-item-unread-indicator {
		  width: 8px;
		  height: 8px;
		  background: none;
		  background-color: rgba(0, 0, 0, 0);
		}
		.notifications-list-item.notification-unread .notification-list-item-unread-indicator {
		  background-color: var(--color-accent-emphasis);
		}
		.notifications-list-item:hover .notification-list-item-hide-on-hover {
		  visibility: hidden !important;
		}
	`).appendTo('body');

	notificationButtonLink.addClass('tooltip-hidden');

	notificationsDropdown.css({
		'position': 'absolute', // Must be set before we can read width accurately
		'min-width': minWidth + 'px',
		'max-width': '900px',
		//overflow: "auto",
	}).appendTo('body'); // Done sooner so we can get its width
	var topOfDropdown = notificationButtonContainer.offset().top + notificationButtonContainer.innerHeight() + 4;
	var leftOfDropdown = notificationButtonContainer.offset().left + notificationButtonContainer.innerWidth() / 2 - notificationsDropdown.innerWidth() / 2;
	leftOfDropdown = Math.min(leftOfDropdown, window.innerWidth - 12 - notificationsDropdown.innerWidth() - 20);
	leftOfDropdown = Math.max(leftOfDropdown, 0);
	notificationsDropdown.css({
		top: topOfDropdown + 'px',
		left: leftOfDropdown + 'px',
		//"max-height": "calc(100% - "+(topOfDropdown+8)+"px)",
	});

	// This little white wedge should lead from the notification button to the title of the dropdown, +1 pixel lower in order to overlap the top border.
	tabArrow = $('<div>').addClass('notifications-dropdown-arrow').css({
		left: (notificationButtonContainer.offset().left + notificationButtonContainer.innerWidth() / 2 - arrowSize) + 'px',
		top: (topOfDropdown - arrowSize + 1) + 'px',
	}).appendTo('body');

	// I don't think this works any longer
	makeNotificationBlocksCollapsable(notificationsDropdown);

	listenForClicksOnLinks(notificationsDropdown);

	showActionButtons(notificationsDropdown);
	listenForMarkAsReadClick(notificationsDropdown);

	listenForCloseNotificationDropdown();
}

function listenForCloseNotificationDropdown() {
	$(closeClickTargets).on('click', considerClosingNotificiationDropdown);
}

function considerClosingNotificiationDropdown(evt) {
	if ($(evt.target).closest('.notifications-dropdown').length) {
		// A click inside the dropdown doesn't count!
	} else if ($(evt.target).closest(notificationButtonLinkSelector).length) {
		// We let onNotificationButtonClicked() handle clicks on the bell icon
	} else {
		evt.preventDefault();
		closeNotificationsDropdown();
		// We don't need to re-add this now, because we no longer remove it
		//listenForNotificationClick();
	}
}

function closeNotificationsDropdown() {
	$(closeClickTargets).off('click', considerClosingNotificiationDropdown);
	notificationsDropdown.remove();
	tabArrow.remove();
	notificationButtonContainer.css({
		'background-color': '',
		'background-image': '',
	});
	notificationButtonLink.removeClass('tooltip-hidden');
	notificationsDropdown = null;
}

function isNotificationsDropdownOpen() {
	return notificationsDropdown != null;
}

// I'm guessing this is no longer around, since the notifications we display are no longer grouped by repo
function listenForMarkAsReadClick(parentElement) {
	$('.mark-all-as-read', parentElement).click(function() {
		// Always collapse the repo's notifications block when the mark-as-read tick icon is clicked.
		var $divToCollapse = $(this).closest('.js-notifications-browser').find('.boxed-group-inner.notifications');
		collapseBlock($divToCollapse);
	});
}

function makeNotificationBlocksCollapsable(parentElement) {
	makeBlocksCollapsable(parentElement, '.js-notifications-browser > h3', '.boxed-group-inner.notifications');
}

function makeFileAndDiffBlocksCollapsable(parentElement) {
	// The headers used to be: .file.js-details-container > .meta but they changed to .file-header early in 2015
	// .data.highlight.blob-wrapper is the content box for the content or a file diff
	// .render-wrapper is the container for github's image diff viewers (2-up, swipe, onion skin)
	makeBlocksCollapsable(parentElement, '.file-header', '.data.highlight , .render-wrapper');
}

// When an element matching headerSelector is clicked, the next sibling bodySelector will be collapsed or expanded (toggled).
function makeBlocksCollapsable(parentElement, headerSelector, bodySelector) {
	$(headerSelector, parentElement).click(function(evt) {
		// Act normally (do nothing) if a modifier key is pressed, or if it was a right or middle click.
		if (evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey || evt.which !== 1) {
			return;
		}
		// The parent of the header is usually a `div.file`
		var $divToCollapse = $(this).parent().find(bodySelector);
		var wasHidden = $divToCollapse.hasClass('ghndd-collapsed');
		var hideContent = !wasHidden;
		if (hideContent) {
			collapseBlock($divToCollapse);
		} else {
			expandBlock($divToCollapse);
		}
	}).css({ cursor: 'pointer' });
}

// Under the new styling, while the top border is placed on the header, the bottom border is placed on the box.  (This is the case for notifications, but not for file/diff boxes.)
// If we hide the box entirely, we will lose the bottom border.
// So our plan is to rollup the box, hide its children, and then show the box again.
function collapseBlock($divToCollapse) {
	$divToCollapse.addClass('ghndd-collapsed');
	$divToCollapse.slideUp(150, function() {
		$divToCollapse.children().hide();
		$divToCollapse.slideDown(1);
	});
}
function expandBlock($divToCollapse) {
	$divToCollapse.removeClass('ghndd-collapsed');
	$divToCollapse.slideUp(1, function() {
		$divToCollapse.children().show();
		$divToCollapse.slideDown(150);
	});
}

function textNode(text) {
	return document.createTextNode(text);
}

function showActionButtons(notificationsDropdown) {
	// Now done by CSS on hover
	//$('.notification-list-item-actions.d-none', notificationsDropdown).removeClass('d-none');
}

function listenForClicksOnLinks(notificationsDropdown) {
	$('a.notification-list-item-link', notificationsDropdown).on('click', function(evt) {
		if (markAsDoneWhenFollowingLink) {
			// When a link is clicked, also  mark it as done
			// li.js-notification-action.notification-action-mark-archived form button
			// button[title="Done"]
			var $buttonToClick = $(this).closest('.notifications-list-item').find('button[title="Done"]');
			//console.log('This link was clicked:', this);
			//console.log('So I will click this button:', $buttonToClick);
			// Hopefully the mark-as-read request will fire, as well as the browser following the clicked link
			$buttonToClick.click();
			markNotificationAsRead(this);
			//evt.preventDefault();
			// Go ahead and allow the link to be clicked
		}

		// Because following the link can now happen without a page refresh, the notifcations popup will stay open, which looks odd.
		// So let's hide the notifications dropdown.
		// But not if it was a ctrl-click or right-click!
		var wasCustomClick = evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey || evt.which !== 1;
		if (!wasCustomClick) {
			setTimeout(() => closeNotificationsDropdown(), 250);
		}
	});
}

function listenForActionClicks() {
	$('body').on('click', '.notifications-dropdown .notifications-list .js-notification-action button', function(evt) {
		var $button = $(this);
		var $form = $button.closest('form');

		$.ajax({
			type: $form.attr('method') || 'POST',
			url: $form.attr('action'),
			data: $form.serialize(),
			//or your custom data either as object {foo: "bar", ...} or foo=bar&...
			success: function(response) {
				if ($form.attr('data-status') === 'archived') {
					markNotificationAsRead($form);
				} else {
					// We don't know what action to take
				}
			},
		});

		// Disable the button, now that it has been used
		//if ($button.attr('title') === "Done") {
		//    $button.css({ opacity: 0.5, pointerEvents: 'none' });
		//}

		evt.preventDefault();

		//markNotificationAsRead($form);
	});
}

function markNotificationAsRead(elemSomewhereInsideNotification) {
	var $notificationDiv = $(elemSomewhereInsideNotification).closest('.notifications-list-item');
	/*
	// We don't hide it, we just grey it out
	$notificationDiv.css({
		opacity: 0.5,
		// Apart from this, we also get some free grey from the container behind, when we set the opacity
		backgroundColor: '#f6f8fa !important',
	});
	$notificationDiv.find('.notification-list-item-unread-indicator').hide();
	*/
	$notificationDiv.removeClass('notification-unread');
}

// Init
listenForNotificationClick();

// Optional: If we are on the notifications page, add our rollup feature there too!
if (makeBlocksCollapsableOnNotificationsPage) {
	makeNotificationBlocksCollapsable(document.body);
}

// Optional: Also add the rollup feature for individual files on diff pages.
if (makeAllFileAndDiffBlocksCollapsable) {
	// TODO: This should be run on-demand, in case we reached a file or diff page via pushState().
	// Delay added because sometimes only 11 files were visible, but more were visible if we waited longer.
	setTimeout(function() {
		makeFileAndDiffBlocksCollapsable(document.body);
	}, 2000);
}

if (typeof notificationDotStyle !== 'undefined' && notificationDotStyle) {
	$('<style>').html(`
		.notification-indicator .mail-status.unread {
			background-image: ${notificationDotStyle};
		}
	`).appendTo('body');
}

// Mitigations for v2
if (document.location.pathname === mainNotificationsPath) {
	// Inform the user if the list of repositories has (likely) been truncated
	var reposList = $('.js-notification-sidebar-repositories ul.filter-list');
	var reposInList = $('.js-notification-sidebar-repositories ul.filter-list > li');
	if (reposInList.length === 25) {
		reposList.append(
			jQuery('<li>')
				.html('<center><b>Some repositories may not be shown</b></center>')
				.css({
					background: '#fafabb',
					padding: '4px',
				})
		);
	}
}

listenForActionClicks();

if (shiftNotificationShelfToTheBottom) {
	GM_addStyle(`
		.notification-shelf {
		  position: fixed !important;
		  top: revert !important;
		  bottom: 0 !important;
		  width: 100% !important;
		}
	`);
}

if (hideQuodAIWarning) {
	setTimeout(() => {
		var quodContainer = jQuery('#toci-container');
		if (quodContainer[0] && quodContainer[0].textContent.match(/This file is currently not supported/)) {
			// We cannot .hide() it because its own CSS overrides ours
			// So we remove it
			quodContainer.remove();
			// But removing it breaks the layout, so we adjust that CSS as well!
			// This doesn't quite match GitHub's default behaviour (which uses a max-width and large margins) but it will do for now.
			GM_addStyle(`
				#toci-wrapper {
					display: grid;
					grid-template-columns: 100%;
				}
			`);
		}
	}, 4000);
}

// ==UserScript==
// @name         DeviantTidy
// @namespace    devianttidy
// @description  Performs a variety of functions on DeviantArt pages to improve its look and usability. For full details, see http://www.deviantart.com/deviation/45622809/
// @version      4.7.9
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAYUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFY3HCoAAAAHdFJOUwCZo3dSLcKUGtMdAAABDElEQVRIx82UPQvCQBBELyanrQmIrUbFNmhhKyLYBkVsrUzrt3/fI6PJKS6DFxBfu8Pdy2YSpT7RuOXslcQCgY4YyBBIpbmP+UE8gCpMEEjEAOY3RRRO7gptoqCZgof5WQxsENgyhSlRuIoH1CorDKsq1BG4uCuwtgWYH90VKhc+YIWnCo/CN1nh0y8LH+yeZEXhV2OQWmYlpvCjOKdrL6fEvPRumDOwzQqMgo9AlFhmJUZhiQOi1PoUXxUQ6NnLKbgyhTNT2DKF6ZtCmyjoDwoe1hjnCnr+hrlBr4H6Ox4NEecaT9aT/79YTksMYP2R+GN5rl9WwA19ptB0VwiJQsAUvJAozH6lkLgo3AEb5uB/u0ZRNAAAAABJRU5ErkJggg==
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @match        *://*.deviantart.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/5681/DeviantTidy.user.js
// @updateURL https://update.greasyfork.org/scripts/5681/DeviantTidy.meta.js
// ==/UserScript==


(function () {
	"use strict";

	// Create a DOM element (tag, [properties,] children)
	var $E = function() {
		if (arguments.length === 0) {return;}

		function applyObj(to, obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					if (typeof obj[prop] === 'object') {
						applyObj(to[prop], obj[prop]);
					}
					else {
						to[prop] = obj[prop];
					}
				}
			}
		}

		var elm = document.createElement(arguments[0]);

		[arguments[1], arguments[2]].forEach(function(arg, idx, ary) {
			if (typeof arg === 'object') {
				if (arg instanceof Array) {
					arg.forEach(function(append, idx, ary) {
						elm.appendChild((typeof append === 'string') ? document.createTextNode(append) : append);
					});
				}
				else {
					for (var prop in arg) {
						if (arg.hasOwnProperty(prop)) {
							if (prop === 'events') {
								var events = arg[prop];
								for (var evt in events) {
									if (events.hasOwnProperty(evt)) {
										elm.addEventListener(evt.replace(/^on/, ''), events[evt], false);
									}
								}
							}
							else {
								if (typeof arg[prop] === 'object') {
									applyObj(elm[prop], arg[prop]);
								}
								else {
									elm[prop] = arg[prop];
								}
							}
						}
					}
				}
			}
		});
		return elm;
	};


	// Determines whether we're within a dynamically-created deviation page
	var inDynamicPage = function() {return $('.minibrowse-container').size() > 0;};


	// Gets the logged-in user name, or '' if not logged in
	var getUsername = function() {var d = unsafeWindow.deviantART.deviant; return d && d.loggedIn ? d.username : '';};


	// The DeviantTidy-specific modal interface
	var devianttidydialog = {
		node: null,
		body: null,
		timer: null,

		open: function(header, content, autoClose) {
			// Reset timer and set a new one if requested.
			clearTimeout(this.timer);
			if (autoClose) {
				this.timer = window.setTimeout(this.close.bind(this), autoClose);
			}

			// If dialog is open, close it and start a new one
			this.close();

			if (typeof header !== 'string') {return;}
			if (typeof content === 'string') {
				content = [$E('div', {className: 'ppp c'}, [content])];
			}

			this.body = $E('div', {className: 'ppp dialog-body'}, content);
			this.node = this.createPopup(header);
			devianttidy.body.appendChild(this.node);
			this.resizePopup();
			window.addEventListener('resize', this.resizePopup.bind(this));
			$('#devianttidy-dialog-close').focus();
		},

		createPopup: function(header) {
			return $E('div', {className:'devianttidy-dialog', style:{display:'none'}}, [
				$E('div', [
					$E('div', {className:'gr-box gr-genericbox'}, [
						$E('i', {className:'gr1'}, [$E('i')]),
						$E('i', {className:'gr2'}, [$E('i')]),
						$E('i', {className:'gr3'}, [$E('i')]),
						$E('div', {className:'gr-top'}, [
							$E('i', {className:'tri'}),
							$E('div', {className:'gr'}, [
								$E('h2', [
									$E('a', {href:devianttidy.homepage, title:"DeviantTidy Homepage"}, [
										$E('img', {className:'dialog-icon', src:devianttidyicons.dt})
									]),
									header
								]),
								$E('a', {className: 'dialog-close', id: 'devianttidy-dialog-close', href: '#', events: {click: this.close.bind(this)}}, [
									$E('img', {src: devianttidyicons.close})
								])
							])
						]),
						$E('div', {className:'gr-body'}, [this.body]),
						$E('i', {className:'gr3 gb'}),
						$E('i', {className:'gr2 gb'}),
						$E('i', {className:'gr1 gb gb1'})
					])
				])
			]);
		},

		resizePopup: function() {
			var maxPanelHeight = 900;
			var minWindowHeight = 250;

			// Set maximum body height given window height
			var ih = window.innerHeight;
			var h = ih && ih > minWindowHeight ? (ih < maxPanelHeight ? ih : maxPanelHeight) : minWindowHeight;
			this.body.style.maxHeight = (h * 0.9 - 60) + 'px';

			// Set vertical alignment, given popup height
			var gr = this.node.childNodes[0];
			gr.style.marginTop = (gr.offsetHeight ? -gr.offsetHeight / 2 : -minWindowHeight) + 'px';
		},

		close: function() {
			if (this.node) {
				var oldNode = this.node;
				this.node = null;
				$(oldNode).remove();
			}
		}
	};


	// Embedded image data for interface.
	var devianttidyicons = {
		dt: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFo/HAsAAAAPdFJOUwCZXpUNjuBQP3bQ8rTENrPZbCIAAABeSURBVAjXY2AAgfW/wBQD+/9PEAbv/wQIo/+/AoRx/huE5vv/E8Lg+Z8CYdT/nwAkWf/////bSVCCQRvI+OksGMAgD2QkKBs3MCCB0lAHMM1iKAS1UdAEwnAWBFsEAB1/HZSV1TDqAAAAAElFTkSuQmCC',
		close: 'data:image/gif;base64,R0lGODlhDwAPAJEAAP///9vg2kdSS////yH5BAUUAAMALAAAAAAPAA8AAAIrnC2Zx6O/GJxnWpRAUAEox2lCt1mjJpoJqa5oabHsp6TnB7ZC1TZqw8MdCgA7',
		down: 'data:image/gif;base64,R0lGODlhDwAPAKIAAP///9zh29vg2trf2UhTTEdSS0ZRSv///yH5BAEHAAcALAAAAAAPAA8AAAMyeKrVvfC4+SC962pFNJVeWAABYQpAdw0kgQrqSgICFTds/d3FgB28DUcUMdkIkcUtkgAAOw==',
		up: 'data:image/gif;base64,R0lGODlhDwAPAJEAAP///9vg2kdSS////yH5BAEHAAMALAAAAAAPAA8AAAIknC2Zx6O/GJxnWgQDnQFoq3QiKIyj5YUAyTps9EYu2dANpjQFADs='
	};

	// Quickly generate buttons using DA's button theme
	var makeButton = function(label, primary, clickEvent) {
		return $E('button', {className: primary ? 'smbutton smbutton-green' : 'smbutton', events: {click: clickEvent}}, [
			$E('span', [label])
		]);
	};

	// Compiled, minified CSS from devianttidy.less
	var devianttidycss = "body.dt-limit-width{margin-left:auto!important;margin-right:auto!important}body.dt-limit-width.dt-limit-width.l1{max-width:1200px!important}body.dt-limit-width.dt-limit-width.l2{max-width:1400px!important}body.dt-limit-width.dt-limit-width.l3{max-width:1600px!important}#artist-comments hr,#output hr:not([class]),.devianttidy-dialog hr,.previewcontainer hr,.thought .body hr{display:block!important;border:1px solid transparent!important;border-top-color:#9DB1B0!important;border-bottom-color:#E9EFE8!important}.mc-ctrl,.mcb-note-box,.mcbox>.ch-ctrl,div.mcbox-inner-preview{border-radius:0!important}#output a.a,#output div.alink a{text-decoration:none!important}#output a.a:hover,#output div.alink a:hover{text-decoration:underline!important}#output a.a:visited{opacity:.7}body>div.drag-and-collect{display:none!important}.smbutton-blue:focus{outline:#000 dotted 1px!important}#overhead-collect.dt-top-nav-fixed{position:fixed!important;z-index:151!important}:not(.oh-eax)>#oh-mainmenu #more7-main.dt-hide-nav-labels>a:hover{min-width:8em!important}:not(.oh-eax)>#oh-mainmenu #more7-main.dt-hide-nav-labels>a:not(:hover){font-size:0!important;padding-right:0!important}:not(.oh-eax)>#oh-mainmenu #more7-main.dt-hide-nav-labels>a:not(:hover)>sup{display:none!important}body.dt-hide-core-ad #oh-menu-upgrade{display:none!important}.friendmachine .controls{padding-left:5px!important}.friendmachine .friendmachine>.readout>dl>dd.f{line-height:18px!important}.friendmachine .friendmachine>.readout>dl{margin-bottom:8px!important}textarea{font-size:12px!important;font-family:verdana,sans-serif}select{border:1px solid #ccc}.bubbleview>div.policy-page,.text.text-ii,p.critique-recommendation{width:auto!important;max-width:100%!important}table.zebra,table.zebra tr,table.zebra tr>*{border-collapse:collapse!important}#deviantlist td{padding:0 3px!important}#deviantlist tbody tr:hover td,#deviantlist tr.even:hover td{background:#DEE8E5}#tblGroups td.c input,#tblGroups+form td.c input{width:80px!important}body .cc-avatar{margin-top:1px!important}.ccomment{margin-bottom:8px!important}.cc-signature{float:none!important;font-size:90%;overflow-y:auto!important;max-height:15em!important;padding-bottom:1px!important}body.dt-scroll-comments .ctext .text-ii{overflow-y:auto!important;padding-bottom:1px}body.dt-scroll-comments.s1 .ctext .text-ii{max-height:17em!important}body.dt-scroll-comments.s2 .ctext .text-ii{max-height:34em!important}.dt-floating-comment{border:1px solid rgba(255,255,255,.5);background:rgba(211,223,209,.8);z-index:101!important;display:block!important;position:fixed!important;bottom:0!important;left:0;right:0;padding:15px 20px 0!important}.dev-view-about{z-index:101!important}div.talk-post div.pager-holder,div.talk-post div.pager2,div.talk-post textarea{height:150px}.talk-tower div.nest{padding-left:12px!important;margin-bottom:8px!important;border-left:solid 1px transparent!important}.talk-tower div.nest:hover{border-color:#a6b2a6!important}#deviant ul.list[style^=border-top]{border:none!important;margin-top:0!important;padding-top:0!important}body.dt-hide-group-box #gruze-main #gmi-GroupMemberZone{display:none!important}#any-joinrequest-module>.gr-configform{padding-left:0!important}.submit_to_groups .second_option>textarea{margin-left:0!important}#gmi-GMRoleEditor #gmi-BPPDropDown>div[style]{padding-left:30px!important}.frame-button.submit,body.dt-hide-morelikethis .mlt-link{display:none!important}body.dt-collapse-sidebar #deviant td.gruze-sidebar:not(:hover){width:15px!important}body.dt-collapse-sidebar #deviant td.gruze-sidebar:not(:hover)>*{display:none!important}body.dt-collapse-sidebar #browse2:not(.shopModuleBrowse) #browse-sidebar:not(:hover){max-width:15px!important}body.dt-collapse-sidebar #browse2:not(.shopModuleBrowse) #browse-sidebar:not(:hover)>*{display:none!important}body.dt-collapse-sidebar td+.gruze-sidebar:not(:hover){width:15px!important}body.dt-collapse-sidebar td+.gruze-sidebar:not(:hover)>*{display:none!important}body.editmode #modalspace>.modal{width:700px!important;margin-left:-350px!important}body.editmode #modalspace>.modal #dnd_deck_container,body.editmode #modalspace>.modal #dnd_deck_picker,body.editmode #modalspace>.modal>form{width:auto!important}body.editmode #modalspace>.modal input[type=text]{width:100%!important}body.editmode #modalspace>.modal textarea.css,body.editmode #modalspace>.modal textarea.text{height:250px!important}span.shadow>a.lit,span.shadow>span.blogthumb>div{font-size:86%!important;font-family:arial,sans-serif!important}span.shadow>a.lit>q>strong{display:none!important}.gr-shoutbox div.pp>dl.shouts dd,.gr-shoutbox div.pp>dl.shouts dt{padding-left:20px!important}.gr-shoutbox div.h.p{width:auto!important;padding-right:85px!important;position:relative!important}.gr-shoutbox div.h.p dt{display:none!important}.gr-shoutbox dl.shouts .timestamp{font-size:80%!important;opacity:.7!important}.gr-shoutbox dl.shouts input[type=text]{width:100%!important}.gr-shoutbox dl.shouts input[type=submit]{position:absolute!important;right:6px!important;width:55px!important;top:5px!important}.dd-heading{margin:0!important}#deviation_critiques div.critique,div.critique_feedback{width:auto!important;margin-right:135px!important}body.dt-hide-share-buttons #gmi-ResourceViewShare{display:none!important}.ile_edit_in_muroimport{margin-top:0!important}.ile_edit_in_muroimport>span.button-title,body.dt-hide-sidebar-thumbs .deviation-mlt-preview .stream,body.dt-hide-sidebar-thumbs h3>span.tiny-avatar{display:none!important}body.dt-hide-sidebar-thumbs h3.group_featured_title,body.dt-hide-sidebar-thumbs h3.more-from-da-title{background:0 0!important;padding-left:0!important}.dev-meta-producttabs>#printtabscontainer:not(:hover) #print-button{border-radius:5px!important;border-bottom:solid 1px #9ead98}.dev-meta-producttabs>#printtabscontainer:not(:hover)>#buy-tabs{display:none!important}.print-submit-help-bubble{display:none!important}#pointsdownload_widget:not(:hover)>.pdw_details{display:none!important}#pointsdownload_widget:not(:hover) #pdw_button_download{border-radius:5px!important}div.group_featured_list{position:relative!important;padding:32px 0 0!important;min-height:35px;max-height:285px;overflow-y:auto;overflow-x:hidden}.not-in-group{text-align:center;margin-top:1em}.submit_to_groups_button{display:inline!important}.submit_to_groups_link{margin:0!important}#groups_links{position:absolute!important;top:0!important;padding:0!important}#all_groups{float:right!important;padding:4px 0 0 1em!important}.dev-metainfo-copy-control{clear:both;margin-top:0!important}.dev-metainfo-copy-control br{display:none!important}.dev-metainfo-copy-control strong{display:inline-block;min-width:96px}.dev-view-about-content{display:block!important;opacity:1!important}body.dt-hide-forum-icons #thread #reply form table table,body.dt-hide-forum-icons #thread .forum img:not([src*='/lock.']):not([src*='/sticky.']),body.dt-hide-forum-icons .mcbox-preview-forum .mcb-icon>img{display:none}#thread .forum br{display:none}#thread .forum .d-started-by a[title],#thread .forum span[title]{margin-left:10px;opacity:.5}#thread .forum .d-latest-reply,#thread .forum .d-started-by{white-space:nowrap}#thread .forum tr.thread td{padding-top:3px!important;padding-bottom:3px!important}#help-container .mglist,div[style*='rgb(222, 233, 229)']{background:0 0!important;padding:0 0 8px!important}.mglist li{padding-bottom:0!important}#messages h2.mczone-title{margin-right:0!important}#messages .mczone{border-bottom:none!important}#messages .messages-menu div.header img{display:none!important}#messages .messages-folder-zone a.maybedrop{background-position:0 -450px!important}#messages .no-folder-notice{font-size:90%!important}#messages .mczone-empty,#messages .talkmessage a.h+img,#messages .talkmessage div.h+a.h{display:none!important}.talkmessage table,.talkmessage td{width:100%!important}.talkmessage>table>*>*>td:first-child{width:0!important}div.message-simulator{padding:0!important}div.mcbox-inner-full-comment div.mcb-whoicon{top:0!important}div.mcbox-sel>div>span.mcx{top:4px!important;right:4px!important}div.mcbox-sel>div>span.mcdx{top:4px!important;right:22px!important}div.mcbox-sel-thumb>div>span.mcdx,div.mcbox-sel-thumb>div>span.mcx{margin-right:-2px!important}.talkmessage .mcb-body{width:auto!important}.talkmessage-taller{min-height:102px!important}body.dt-scroll-comments .talkmessage .mcb-body{overflow-y:auto!important}body.dt-scroll-comments.s1 .talkmessage .mcb-body{max-height:10em!important}body.dt-scroll-comments.s2 .talkmessage .mcb-body{max-height:20em!important}.mcbox-leech{margin-top:-4px!important;margin-left:0!important;border-left:none!important}.mcbox-leech.mcbox-sel{margin-left:-1px!important}.mcbox-full .mcbox-inner{margin-bottom:5px!important}.talk-post .inputs{padding:4px 0!important}.mcbox-inner-full-stack .talkmessage-comment.al{width:90%!important;min-height:0!important;padding:4px 6px!important}.mcbox-inner-full-stack a.ts-lnk{color:inherit!important}.popup2-mcbox-comment{width:500px!important;height:auto!important;min-height:150px;max-height:270px}#messages .mcb-tab{margin-top:25px!important}#deviantART-v7 #messages .mcb-tab>a{padding:0!important}#messages .mcb-tab>a>.tabtext{border-radius:0!important}#notes .left-column{width:40%!important}#notes .right-column{width:59%!important}#notes li{padding-top:3px!important;padding-bottom:3px!important}body.dt-scroll-comments #notes:not(.note-modal) .previewcontainer{height:auto!important}body.dt-scroll-comments.s1 #notes:not(.note-modal) .previewcontainer{max-height:20em!important}body.dt-scroll-comments.s2 #notes:not(.note-modal) .previewcontainer{max-height:40em!important}#solid-gone .altview+.sleekadbubble,#solid-gone .sleekadbubble+.altview,#solid-gone>img[src*=fella],#solid-gone>img[src*=fella]+div{display:none}#solid-gone div.altview{margin-left:auto!important;margin-right:auto!important}#solid-gone input[style='width: 120px']{width:180px!important}#solid-gone #forgot-container{margin-left:0;width:auto}.devianttidy-dialog{display:block!important;position:fixed!important;top:0;left:0;bottom:0;right:0;background:rgba(0,0,0,.5);z-index:200!important;padding:2em}.devianttidy-dialog>div{position:absolute;left:50%;top:50%;margin-left:-30em!important;width:60em}.devianttidy-dialog a{color:#3B5A4A!important}.devianttidy-dialog .dialog-icon{padding-right:.3em}.devianttidy-dialog .dialog-close{position:absolute;top:2px;right:6px;cursor:pointer;padding:4px}.devianttidy-dialog .dialog-close>img{margin:0}.devianttidy-dialog .dialog-body{margin:8px!important;overflow-y:auto}.devianttidy-dialog .dialog-category{margin-top:.5em;font-weight:700}.devianttidy-dialog .dialog-control{position:relative;margin-left:26px}.devianttidy-dialog .dialog-control input{position:absolute;left:-18px;margin-top:0}.devianttidy-dialog .dialog-control select{position:absolute;right:0;margin-top:-4px;border:1px solid #ccc}.devianttidy-dialog .hint{font-size:90%;color:#676}.devianttidy-dialog .dialog-buttons{margin-top:1em}.devianttidy-dialog .dialog-buttons button{margin:0 .3em}";

	// Bundle up these utility methods into a single container object that can be passed to other scripts
	var devianttidyutils = {
		$: $,
		$E: $E,
		inDynamicPage: inDynamicPage,
		getUsername: getUsername,
		devianttidyicons: devianttidyicons,
		devianttidydialog: devianttidydialog
	};

	// The DeviantTidy application
	var devianttidy = {
		version: '4.7.9',
		debug: false,
		homepage: 'https://www.deviantart.com/deviation/45622809/',
		body: null,
		
		changelist: [
			"Updated: DeviantTidy will look for updates using HTTPS because DA now officially supports it.",
			"Fixed: Options link moved from the page footer to the user menu on the top navigation.",
			"Fixed: Modal dialogs will resize if the window is resized after they're opened."
		],

		log: function(message, alertme) {
			if (!this.debug) {return;}
			console.log(message);
			if (alertme) {
				alert("DeviantTidy Debug Message:\n\n" + message);
			}
		},

		preload: function() {
			GM_addStyle(devianttidycss);
		},

		start: function() {
			if (document.readyState !== "interactive") {
				return;
			}

			// Add the CSS again as a workaround for Firefox 55.
			// Internal changes may have broken GM_addStyle during preload.
			GM_addStyle(devianttidycss);
			
			this.body = $('body')[0];

			if (!Function.prototype.bind) {
				alert("DeviantTidy requires an up-to-date browser in order to function."); return;
			}
			if (unsafeWindow.devianttidy) {
				this.log("Another instance of DeviantTidy has already loaded!"); return;
			}

			// Allow this application and its utilities to be accessed by other scripts through unsafeWindow
			unsafeWindow.devianttidy = this;
			unsafeWindow.devianttidyutils = devianttidyutils;

			// Fresh update?
			if (GM_getValue('version') !== this.version) {
				GM_setValue('version', this.version);

				devianttidydialog.open('DeviantTidy ' + this.version + ' Installed', [
					$E('div', {className: 'pp'}, [
						"You can view all available options by clicking 'DeviantTidy Options' under the user menu on the header navigation. ",
						$E('a', {href: "#", className: 'a', events: {click: devianttidy.preferences}}, ["Configure DeviantTidy right now"]),
						"."
					]),
					$E('hr'),
					$E('div', {className: 'pp'}, this.changelist.map(function(c){return $E('div', [c]);})),
					$E('hr'),
					$E('div', {className: 'pp'}, ["You will not see this message again.	 Close this panel to continue browsing."]),
					$E('div', {className: 'pp c'}, [makeButton("Cheers!", true, function() {devianttidydialog.close();})])
				]);
			}

			// Run through all options
			this.dispatch();

			// Silently look for updates every 2 days - alert user if new version is available
			if (location.href.indexOf('http://my.deviantart') === 0 || location.href.indexOf('http://www.deviantart') === 0) {
				var now = new Date();
				var last = GM_getValue('last_updated', 0);
				if (!last || Date.parse(last).valueOf() < now - 48 * 3600 * 1000) {
					this.update(true);
				}
			}

			// Add Greasemonkey menu item
			GM_registerMenuCommand("DeviantTidy Options", this.preferences);

			// Add the Options link to the header nav
			$('#oh-menu-deviant li.oh-menu-list-item .i8').closest('li').after(
				$E('li', {className: 'oh-menu-list-item'}, [
					$E('a', {id: 'devianttidy-options-link', className: 'mi iconset-messages', href: '#', events: {click: this.preferences}}, [
						$E('i', {className: 'i8'}),
						'DeviantTidy Options'
					])
				])
			);
		},

		preferences: function() {
			var controls = [];

			// Generate options controls
			for (var o in devianttidy.options) {
				// Options without descriptions are hidden functions, but their preferences can be set manually
				var option = devianttidy.options[o];

				if (option.category) {
					controls.push($E('div', {className: 'p dialog-category'}, [option.category]));
				}

				if (option.description) {
					var control;
					var control_id = 'devianttidy-control-' + o;
					var description = [option.description, $E('b', [(option.custom ? ' (add-on)' : '')])];

					if (option.choices) {
						// If a list of choices is provided, the options form a drop-down list
						var selections = [];

						for (var c in option.choices) {
							selections.push($E('option', {value: c}, [option.choices[c]]));
						}

						selections[option.pref !== undefined ? option.pref : option.initial].selected = true;

						control = [
							$E('select', {id: control_id, name: o, events: {change: function() {devianttidy.options[this.name].pref = this.value;}}}, selections),
							$E('label', {htmlFor: control_id}, description)
						];
					}
					else {
						// Otherwise, use a checkbox
						control = [
							$E('input', {type: 'checkbox', id: control_id, name: o, checked: option.pref, events: {change: function() {devianttidy.options[this.name].pref = this.checked ? 1 : 0;}}}),
							$E('label', {htmlFor: control_id}, description)
						];
					}

					if (option.hint) {
						control.push($E('div', {className: 'hint'}, [option.hint]));
					}

					controls.push($E('div', {className: 'p dialog-control'}, control));
				}
			}

			devianttidydialog.open("DeviantTidy Options", [
				$E('div', {className: 'p r'}, [
					$E('a', {href: devianttidy.homepage}, ["DeviantTidy"]),
					" version " + devianttidy.version + ". ",
					$E('a', {href: "#", events: {click: function() {devianttidy.update();}}}, ["Check for updates"])
				]),
				$E('div', {className: 'p'}, controls),
				$E('div', {className: 'dialog-buttons c'}, [
					makeButton("Save & Reload", true, function() {devianttidy.save(); devianttidy.reload();}),
					makeButton("Reset", false, function() {devianttidy.reset();}),
					makeButton("Cancel", false, function() {devianttidydialog.close();})
				])
			]);

			return false;
		},

		load: function() {
			for (var o in this.options) {
				this.options[o].pref = parseInt(GM_getValue("options." + o, this.options[o].initial));
			}
		},

		save: function() {
			for (var o in this.options) {
				GM_setValue("options." + o, this.options[o].pref);
			}
		},

		reset: function() {
			if (confirm("This will reset all DeviantTidy options to their default values, and then reload the page.")) {
				for (var o in this.options) {
					this.options[o].pref = this.options[o].initial;
				}
				this.save();
				this.reload();
			}
		},

		dispatch: function() {
			this.load();

			var dispatch_start = new Date();
			var dispatch_log = [];
			var dispatch_count = 0;
			var dispatch_fails = 0;

			for (var o in this.options) {
				var option = this.options[o];

				// A lazy option should only run when the pref is not 0.
				// If dispatcher is run again, don't repeat functions that were already run.
				if ((option.lazy && option.pref === 0) || option.dispatched) {
					continue;
				}

				try {
					var dispatch_time = new Date();
					var dispatch_result = option.method(option.pref);
					dispatch_log.push("	 + " + o + ": " + dispatch_result + " (" + (new Date() - dispatch_time) + "ms)");
				}
				catch (e) {
					dispatch_fails++;
					dispatch_log.push("	 ! " + o + ": FAILED (" + e.message + " - line " + e.lineNumber + ")");
				}

				option.dispatched = true;
				dispatch_count++;
			}

			if(this.debug) {
				var elapsed = new Date() - dispatch_start;
				this.log("Dispatched " + dispatch_count + " function(s) in " + elapsed + "ms.\n" + dispatch_log.join("\n"));

				if (dispatch_fails > 0) {
					this.log(dispatch_fails + " dispatch method(s) failed. Check the Error Console for details.", true);
				}
			}
		},

		reload: function() {
			devianttidydialog.open('Reloading...', "Reloading page.	 Please wait...");
			location.reload();
		},

		update: function(quiet) {
			this.log("Looking for updates...");
			GM_setValue('last_updated', new Date().toString());

			if (!quiet) {
				devianttidydialog.open('Looking for Updates...', "Checking for a new version of DeviantTidy. Please wait...");
			}

			var update_error = function(jqXHR, message) {
				if (!quiet) {
					devianttidydialog.open('Error', [
						$E('div', {className: 'ppp c'}, [
							"Unable to get the version information from ",
							$E('a', {href: devianttidy.homepage}, [devianttidy.homepage]),
							".	Please try visiting the page yourself to check for updates."
						]),
						$E('div', {className: 'ppp c'}, [
							(typeof message === "string") ? message : "No error details available."
						])
					]);
				}
			};

			var update_success = function(html) {
				var version_text = html.match(/<b><\/b><b><i>version ([\d.]+)<\/i><\/b><b><\/b>/i);
				if (!version_text) {
					update_error(null, "Couldn't find version number string on the page.");
					return;
				}

				var message;
				var version_number = version_text[1];

				if (version_number === devianttidy.version) {
					devianttidy.log("No newer version available.");
					if (quiet) {return;}
					message = ["Your version of DeviantTidy is up to date!"];
				}
				else {
					message = [$E('b', ["DeviantTidy " + version_number + " is available. "])];
					message.push($E('a', {href: devianttidy.homepage}, ["Go to the DeviantTidy homepage"]));
					message.push(" to update your style and script.");
				}
				devianttidydialog.open('Update Status', [$E('div', {className: 'ppp c'}, message)]);
			};

			GM_xmlhttpRequest({
				method: "GET",
				url: devianttidy.homepage,
				onload: function(response) {
					if (response.status === 200) {update_success(response.responseText);}
					else {update_error(null, "Response code: " + response.status);}
				},
				onerror: update_error
			});
		},

		extend: function(object) {
			// Use this function to add your own options to DeviantTidy.
			// Review the example add-on in the project source for documentation.
			if (typeof object.name !== 'string' || typeof object.method !== 'function' || typeof object.description !== 'string') {
				this.log("Attempt to extend with a malformed add-on");
				this.log(object);
				alert("DeviantTidy doesn't like the structure of the option you tried to add.\n" +
					"Please check that you set the required parameters and that their types are correct.");
				return;
			}
			else if (this.options[object.name]) {
				this.log("Attempt to extend resulted in a name-clash.");
				alert("The DeviantTidy option '" + object.name + "' already exists.	 You cannot extend it.");
				return;
			}

			if (typeof object.initial === 'undefined') {
				object.initial = 1;
			}
			object.custom = true;
			this.options[object.name] = object;
			this.log("Extended with custom function '" + object.name + "'");

			// We must delegate this to a timeout because executing it under unsafeWindow will
			// result in access violations when calling GM functions
			window.setTimeout(function() {devianttidy.dispatch();}, 1);
		},

		options: {
			'hide_forum_icons': {
				category: "Hidden Elements",
				description: "Hide forum thread icons",
				initial: 1,
				lazy: true,
				method: function(pref) {
					$(devianttidy.body).addClass("dt-hide-forum-icons");
					return true;
				}
			},
			'hide_nav_labels': {
				description: "Hide text labels on the sticky navigation bar until I hover over them",
				initial: 0,
				lazy: true,
				method: function(pref) {
					$('#more7-main').addClass("dt-hide-nav-labels");
					return true;
				}
			},
			'no_group_box': {
				description: "Hide the blue 'Contribute' box at the top of all group pages",
				initial: 0,
				lazy: true,
				method: function(pref) {
					$(devianttidy.body).addClass('dt-hide-group-box');
					return true;
				}
			},
			'no_share_buttons': {
				description: "Hide the social sharing buttons on deviation pages",
				initial: 0,
				lazy: true,
				method: function(pref) {
					$(devianttidy.body).addClass('dt-hide-share-buttons');
					return true;
				}
			},
			'hide_morelikethis': {
				description: "Hide the 'More like this' links on gallery thumbnails",
				initial: 0,
				lazy: true,
				method: function(pref) {
					$(devianttidy.body).addClass('dt-hide-morelikethis');
					return true;
				}
			},
			'hide_core_ad': {
				description: "Hide the 'Upgrade to CORE' ad in the header",
				initial: 0,
				lazy: true,
				method: function(pref) {
					$(devianttidy.body).addClass('dt-hide-core-ad');
					return true;
				}
			},
			'hide_sidebar_thumbs': {
				description: "Hide 'More from...' thumbnails in the deviation page sidebar",
				initial: 1,
				lazy: true,
				method: function(pref) {
					$(devianttidy.body).addClass('dt-hide-sidebar-thumbs');
					return true;
				}
			},
			'collapse_sidebar': {
				category: "UI Tweaks",
				description: "Collapse the folders/categories sidebar on galleries and browse pages",
				hint: "The sidebar will be invisible until you mouse-over the left edge of the page.",
				initial: 0,
				lazy: true,
				method: function(pref) {
					$(devianttidy.body).addClass('dt-collapse-sidebar');
					return true;
				}
			},
			'top_nav_fixed': {
				description: "Fix the navigation bar to always be visible at the top of the screen",
				initial: 0,
				lazy: true,
				method: function(pref) {
					$('#overhead-collect').addClass('dt-top-nav-fixed');
					return true;
				}
			},
			'scroll_comments': {
				description: "Add scrollbars to long comments and notes",
				initial: 2,
				lazy: true,
				choices: ["Disabled", "Small (approx 15 lines)", "Large (approx 30 lines)"],
				method: function(pref) {
					$(devianttidy.body).addClass("dt-scroll-comments s" + pref);
					return true;
				}
			},
			'limit_width': {
				description: "Limit the maximum width of pages on wide screens",
				initial: 0,
				lazy: true,
				choices: ["No limit", "1200 pixels", "1400 pixels", "1600 pixels"],
				method: function(pref) {
					$(devianttidy.body).addClass("dt-limit-width l" + pref);
					return true;
				}
			},
			'short_titles': {
				category: "Page Titles",
				description: "Shorten page titles by removing DeviantArt prefixes and suffixes",
				hint: "For instance, a window or tab named 'Spyed on DeviantArt' will be shortened to 'Spyed'.",
				initial: 1,
				lazy: true,
				method: function(pref) {
					document.title = document.title.replace(/^(DeviantArt): where ART meets application!$|^DeviantArt: | on DeviantArt$| DeviantArt( \w+)$| - DeviantArt$/i, '$1$2');
					return true;
				}
			},
			'message_center_title': {
				description: "Show message count in the Notification Center page title",
				initial: 1,
				lazy: true,
				method: function(pref) {
					if (window.location.href.indexOf('//www.deviantart.com/notifications/') < 0) {return -1;}
					var msgs = 0;
					var m;
					$("#overhead .oh-keep > a > span, #oh-menu-split > a > span").each(function() {
						m = parseInt($(this).text().replace(',', ''), 10);
						if (!isNaN(m)) {msgs += m;}
					});
					if (msgs) {
						document.title = msgs + " Notification" + (msgs === 1 ? "" : "s");
					}
					return msgs;
				}
			},
			'note_title': {
				description: "Show the subject of the selected note in the page title",
				initial: 1,
				lazy: true,
				method: function(pref) {
					if (window.location.href.indexOf('//www.deviantart.com/notifications/notes/') < 0) {return -1;}

					var mutationHandler = function () {
						var subjectElement = notesBlock.find('.mcb-title');
						if (subjectElement.size() === 1) {
							document.title = subjectElement.text() + " - Notes";
						}
					};

					var notesBlock = $('.notes-right');
					new MutationObserver (mutationHandler).observe(notesBlock[0], { childList: true, subtree: true });
					mutationHandler();
					return true;
				}
			},
			'strip_outgoing_links': {
				category: "Extra Features",
				description: "Strip DeviantArt redirects from external links",
				initial: 1,
				choices: ["No", "Yes", "Prompt"],
				lazy: true,
				method: function(pref) {
					var prefix = /https?:\/\/www.deviantart.com\/users\/outgoing\?(.+)/i;

					// Check every link that gets focus and apply rules based on its href.
					$(devianttidy.body).on('focus', 'a.external', function(evt) {
						var link = $(this);
						var href = link.attr('href');
						if (href) {
							var matches = prefix.exec(href);
							if (matches.length == 2) {
								link.attr('href', matches[1]);
								link.addClass('dt-external-link');
							}
						}
					});

					// If prompt mode is on, add a click listener to external links.
					if (pref === 2) {
						$(devianttidy.body).on('click', 'a.dt-external-link', function(evt) {
							var href = $(this).attr('href');
							var msg = "This external link redirects to:\n\n" + href + "\n\n" + "Press OK to follow.";
							return confirm(msg);
						});
					}

					return true;
				}
			},
			'redirect_on_login': {
				description: "Redirect to a specific page after logging in",
				initial: 0,
				lazy: true,
				choices: ["Disabled", "Notification Center", "Channels", "My Profile Page"],
				method: function(pref) {
					var username = getUsername();
					var username_old = GM_getValue('username', username);
					GM_setValue('username', username);

					if (!username || username_old === username) {return -2;}

					var redirects = {
						1: {url: 'http://www.deviantart.com/notifications/', name: 'Notification Center'},
						2: {url: 'http://www.deviantart.com/channels/', name: 'Channels'},
						3: {url: 'http://' + username.toLowerCase() + '.deviantart.com/', name: 'your profile page'}
					};

					var url = redirects[pref].url;
					if (location.href.indexOf(url) === 0) {return -1;}

					devianttidydialog.open("Logged In", "Going to " + redirects[pref].name + "...");
					location.href = url;
					return true;
				}
			},
			'disable_dnd': {
				description: "Disable drag-and-drop thumbnail collecting",
				hint: "Note that while drag-and-drop is disabled, you will be unable to perform actions like selecting and moving items in your notifications or gallery.",
				initial: 0,
				lazy: true,
				method: function(pref) {
					if (unsafeWindow.DDD) {return delete unsafeWindow.DDD;}
					return false;
				}
			},
			'floating_comment_key': {
				description: "Shortcut key for the Floating Comment feature (ALT + SHIFT + ...)",
				initial: 2,
				choices: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
				lazy: false,
				method: function(pref) {
					var comment_toggle = function() {
						try {
							var form = $('form[id="cooler-comment-submit"]:last')[0];
							var textarea = $(form).find('.writer,textarea')[0];

							if (!form || !textarea) {
								devianttidydialog.open("Unavailable", [$E('p', {className: 'p c'}, ["No comment box found."])], 1500);
								return false;
							}

							devianttidydialog.close();
							if (form.className.indexOf('dt-floating-comment') >= 0) {
								form.className = form.className.substr(0, form.className.length - 20);
								textarea.blur();
							}
							else {
								form.className += ' dt-floating-comment';
								textarea.focus();
								textarea.click();
							}

							return false;
						}
						catch (e) {
							devianttidy.log("Error getting floating comment box: " + e.message, true);
						}
					};

					// Make an invisible link with access key C to listen for this keystroke.
					devianttidy.body.appendChild($E('a', {
						id: 'dt-floating-comment-link',
						href: '#',
						style: {display: 'none'},
						accessKey: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')[pref],
						events: {click: comment_toggle}
					}));

					return 1;
				}
			},
			'keyboard_browsing': {
				description: "Use left/right arrow keys to browse galleries and notifications",
				initial: 1,
				lazy: true,
				method: function(pref) {
					window.addEventListener('keyup', function(e) {
						// Respond only to keystrokes without modifiers.
						if (e.ctrlKey || e.shiftKey || e.altKey) {return;}

						// Determines whether we're within a dynamically-created deviation page.
						// If viewing a deviation, don't override deviation key listeners.
						if (inDynamicPage()) {return;}

						var evt = e || window.event;
						var target = evt.target;

						while (target.nodeType === 3 && target.parentNode !== null) {
							target = target.parentNode;
						}

						var node = target.nodeName;
						if (node === 'TEXTAREA' || node === 'SELECT' || target.hasAttribute('contenteditable')) {
							return;
						}
						else if (node === 'INPUT') {
							// On browse pages, the search box is always focused on load.
							// Continue anyway if the search box is empty, or if its value is
							// exactly equal to the current search criteria.
							if (target.name !== 'q') {return;}
							var urldecode = function(str) {
								return decodeURIComponent((str+'').replace(/\+/g, '%20'));
							};
							if (target.value && !urldecode(location.href).match('q=' + target.value + "($|&)")) {return;}
						}

						var find;

						switch (evt.keyCode) {
							case 37: find = ".shadow a.l:eq(0), .pagination li.prev a"; break;
							case 39: find = ".shadow a.r:eq(0), .pagination li.next a, .pagination .load_more"; break;
							default: return;
						}

						var link = $(find);
						if (!link.length) {
							devianttidy.log("No link found ", true);
							return;
						}

						link[0].click();
					}, true);

					return true;
				}
			}
		}
	};

	devianttidy.preload();
	document.onreadystatechange = devianttidy.start.bind(devianttidy);
}());

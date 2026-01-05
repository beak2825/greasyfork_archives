// ==UserScript==
// @name           Google Domain Blocker
// @namespace      http://jobson.us
// @description    Blocks irrelevant and spam domains.
// @license        http://creativecommons.org/licenses/by-nc-sa/3.0/
// @version        2013.09.08
// @include        *://*.google.*/*
// @exclude        *tbm=shop*
// @exclude        *://plus.*
// @exclude        *://mail.*
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant          GM_addStyle
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/6429/Google%20Domain%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/6429/Google%20Domain%20Blocker.meta.js
// ==/UserScript==

var console = console || $.noop;

var g = {
	mobserver: null,
	update: {
		localVer: GM_info.script.version,
		remoteVer: null,
		downloadURL: GM_info.scriptMetaStr.match(/.+@downloadURL\s+(.+)/)[1],
		lastCheck: 0,
		now: new Date().getTime()
	},
	prefs: {
		blEnable:      true,
		blDisplay:     true,
		blRegex:       false,
		blMalware:     true,
		blNews:        false,
		blRelated:     false,
		blPrefShow:    false,
		blPosition: {
			right: 5,
			top: ($('#mngb').height()+2)
		}
	},
	blacklist: [],
	hiddenText: '<li class="hidtxt"><span class="domain">xxx</span> blacklisted</li>',
	init: function() {
		g.checkForUpdate();
		g.loadPrefs();
		g.eventListeners();
		g.addStyles();
		g.blacklist = g.getBlacklist();
		g.makeBlacklistControls();
		g.searchDIV;
		g.urlUnFuck();

		if (g.prefs.blPrefShow===true) {
			$('div#blTop').show();
		}
//		Debug: Empty Blacklist
//		GM_setValue('blacklist','');
		
		if (g.prefs.blEnable===true) {
			g.mutationObservation();
			//setTimeout(g.events.hideResults,1000);
		}
		
		if (g.prefs.blDisplay===false) {
			GM_addStyle('div#ires ol li.hidtxt { display: none; }');
		}
	},

	mutationObservation: function() {
		g.mobserver = new MutationObserver(function(mutations) {
			//console.log(mutations);
			g.events.hideResults();
			g.mobserver.disconnect();
		});

		var config = { attributes: false, childList: true, characterData: true, subtree: true };

		g.mobserver.observe(document.querySelector('body'),config);
	},

	checkForUpdate: function() {
		g.update.remoteVer = GM_getValue('remoteVer') || g.update.localVer;
		g.update.lastCheck = parseInt(GM_getValue('lastCheck'),10) || 0;

		if (g.update.now - g.update.lastCheck > 1296000000) {
			// Last update older than 15 days
			// 1296000000 = 15 days in ms
			GM_xmlhttpRequest({
				method: "GET",
				url: g.update.downloadURL,
				onload: function(response) {
					g.update.remoteVer = response.responseText.match(/@version\s+(.+)/)[1];
					g.update.lastCheck = g.update.now;
					GM_setValue('remoteVer',g.update.remoteVer);
					GM_setValue('lastCheck',g.update.lastCheck.toString());
					g.checkForUpdate();
				}
			});

			return;
		} else if (g.update.remoteVer !== g.update.localVer) {
			// remote different from local
			var tmp,remoteVerDate,localVerDate;
			
			tmp = g.update.remoteVer.split('.');
			remoteVerDate = new Date(tmp[0],tmp[1],tmp[2]).getTime();
			tmp = g.update.localVer.split('.');
			localVerDate = new Date(tmp[0],tmp[1],tmp[2]).getTime();

			if (localVerDate < remoteVerDate) {
				// Local version is older than remote version prompt for get new version
				$('#gbx3').append('<div id="blUpdateMe"><strong>'+ GM_info.script.name +'</strong> Update Available<div>');
				$('#blUpdateMe').on('click',function() {
					window.location.href = g.update.downloadURL;
				});

			}
			return;
		}
	},

	events: {
		hideResults: function() {
			if (g.prefs.blRelated) {
				$('div#extrares').replaceWith(g.hiddenText.replace(/xxx/,'related'))
			}
			// Hide ads
			$('#tvcap').remove();
			$('#bottomads').remove();
			$('.ads-container').remove();
			// Hide the results using the blacklist.
			$('li.g').each(function() {
				// Old results
				if ($(this).is(":visible") === false) return;
				
				if ($(this).hasClass('psli') === true) return;


				var cite = $(this).find('cite');
				var domain = $(cite).text().replace(/^https:\/\//,'').split(' ')[0].split('/')[0];

				// Malware check based on blMalware pref.
				if (g.prefs.blMalware === true && /This site may harm your computer./.test($(this).parent().parent().find('a[onmousedown]').html()) === true) {
					g.events.hideThis(cite,'malware');
					return;
				}

				// News Display Check based on blNews pref
				if (g.prefs.blNews === true && ($(this).parents('li.g').attr('id') === 'newsbox' || $(this).attr('id') === 'newsbox')) {
					g.events.hideThis(cite,'news');
					return;
				}

				var h = false;
				$.each(g.blacklist,function(i,key) {
					if (/^\/.+\/$/.test(key)) {
						// Regular expression
						var re = new RegExp(key.replace(/\//g,''),'i');
						if (re.test(domain)) {
							h = true;
						}
					} else if (key.toLowerCase() === domain.toLowerCase()) {
						h = true;
					}
				});

				// If hide is true hide this item.
				if (h===true) {
					g.events.hideThis(cite,domain);
				}
			});
			$('div#res ol#rso li.g').on('mouseenter',g.events.serpMouseOver);
		},

		serpMouseOver: function() {
			if ($(this).find('.blLink').length > 0) return;
			if ($(this).attr('id')) return;
			if ($(this).siblings().height() > ($(this).height() * 3)) return;
			if ($(this).find('.vspib').length > 0) return;
			if ($(this).hasClass('obcontainer')) return;

			$(this).append($('<div class="rotated"><span class="blLink">Blacklist\u00a0Domain</span></div>').on('click',g.events.blacklistThisDomain));
		},

		serpMouseLeave: function() {
			$(this).find('div.rotated').remove();
		},

		showHideBlacklist: function() {
			$('div#blTop').toggle();
		},

		blacklistThisDomain: function() {
			// Blacklist this domain, show the confirmation
			$(this).parents('li.g').find('div.cover').remove();

			$(this).parents('li').append(
				$('<div class="cover"><div class="blConfirm">Confirm:\u00a0<span class="blyes">Yes</span>\u00a0/\u00a0<span class="blno">No</span></div></div>').height($(this).parents('li').height()).width($(this).parents('li').width())
			);
			$('span.blyes,span.blno').on('click',g.events.confirmation);
		},

		confirmation: function() {
			// Shows confirmation for adding a domain to the list
			if ($(this).hasClass('blyes')) {
				var domain = $(this).parents('li.g').find('cite:first').text().replace(/^https:\/\//,'').replace(/[\/\s].+/,'').replace(/\/$/,'');
							
				if (g.prefs.blRegex===true) {
					var tld = '';
					var re;
					$.each(g.tld,function() {
						if (tld!='') return;
						re = new RegExp('(.+)'+ this.replace(/\./g,'\\.') +'$','i');
						if(re.test(domain)) {
							tld = this.toString();
						}
					});
					domain = '/([a-z0-9\\.]+)*'+ (domain.replace(re,'$1').split('.').pop()) + tld.replace(/\./g,'\\.') +'$/';
				}
							
				domain = $.trim(domain);
				g.events.addToBlackList(domain);
			}

			$(this).parents('div.cover').remove();
		},

		manualAdd: function(ev) {
			// manually add a domain to the blacklist
			if ($('input#blAddBox').val() === '') return;
			
			// I'm lazy, so I'm using the same function for keypress and a click
			if(ev.keyCode != 13 && $(this).attr('id')== 'blAddBox') return;

			g.events.addToBlackList($('input#blAddBox').val());
			$('input#blAddBox').val('');
		},

		removeFromBlackList: function() {
			// Removes an entry from the blacklist
			var domain = $(this).parent().find('span.domain').text();
			g.blacklist = g.blacklist.remove(domain);
			g.events.saveBlacklist();
			// Show the results first, stop duplication errors.
			g.events.showResults();
			g.events.hideResults();
			g.buildList();
		},

		togglePref: function(ev) {
			var pref = $(this).parent().attr('id');
			if ($(this).hasClass('blOn')) {
				$(this).removeClass('blOn');
				$(this).addClass('blOff');
				g.prefs[pref] = false;
			} else {
				$(this).removeClass('blOff');
				$(this).addClass('blOn');
				g.prefs[pref] = true;
			}
			GM_setValue(pref,g.prefs[pref]);
			
			g.events.doPref(pref);
		},

		doPref: function(pref) {
			switch (pref) {
				case 'blEnable':
					window.location.reload()
					break;
				case 'blDisplay':
					if (g.prefs[pref]===false) {
						GM_addStyle('div#ires ol li.hidtxt { display: none; }');
					} else {
						GM_addStyle('div#ires ol li.hidtxt { display: block; }');
					}
					break;
				case 'blRegex':
					// Regex only happens when user clicks Blacklist Domain
					break;
				default: break;
			}
		},

		selectText: function() {
			// For some reason in GM 0.9.6 an exception is thrown here.
			try {
				$('textarea#blPortBox').select();
			} catch(er) {}
		},
		export: function() {
			$('#blPortBox').val(JSON.stringify(g.blacklist));
			$('textarea#blPortBox').on('click',g.events.selectText);
		},
		import: function() {
			$('textarea#blPortBox').off('click');

			$.each(JSON.parse($('#blPortBox').val()),function() {
				g.events.addToBlackList(this.toString());
			});
			
			$('#blPortBox').val('');
		},
		saveBlacklist: function() {
			// Saves g.blacklist to greasemonkey blacklist
			GM_setValue('blacklist',g.blacklist.join(','));
		},
		addToBlackList: function(domain) {
			// Adds an entry to the blacklist
			g.blacklist.push(domain);
			g.blacklist = g.blacklist.uniq().sort();
//			g.blacklist = $.unique(g.blacklist).sort();
			g.events.saveBlacklist();
			// Show the results first, stop duplication errors.
			g.events.showResults();
			g.events.hideResults();
			g.buildList();
		},

		hideThis: function(cite,domain) {
			domain = domain || '';
			if ($(cite).parents('li.g').prev().hasClass('hidtxt')) {
				// Return if this domain is already blocked
				return;
			} else {
				$(cite).parents('li.g').before(g.hiddenText.replace(/xxx/,domain));
				$(cite).parents('li.g').hide();				
			}

		},
		showResults: function() {
			// Shows all results
			$('li.hidtxt').remove();
			$('li.g').show();
		}
	},

	loadPrefs: function() {
		// Debug: unset all prefs.
//		GM_deleteValue('blEnable');
//		GM_deleteValue('blRegex');
//		GM_deleteValue('blDisplay');
//		GM_deleteValue('blMalware');
//		GM_deleteValue('blNews');
//		GM_deleteValue('blRelated');
//		GM_deleteValue('blPrefShow');

		// If pref is undefined, set it as default otherwise use the set value
		g.prefs.blEnable   = GM_getValue('blEnable')   || g.prefs.blEnable;
		g.prefs.blDisplay  = GM_getValue('blDisplay')  || g.prefs.blDisplay;
		g.prefs.blRegex    = GM_getValue('blRegex')    || g.prefs.blRegex;
		g.prefs.blMalware  = GM_getValue('blMalware')  || g.prefs.blMalware;
		g.prefs.blNews     = GM_getValue('blNews')     || g.prefs.blNews;
		g.prefs.blRelated  = GM_getValue('blRelated')  || g.prefs.blRelated;
		g.prefs.blPrefShow = GM_getValue('blPrefShow') || g.prefs.blPrefShow;
	},

	eventListeners: function() {
		// OnHashChange hide results
		$(window).hashchange(function() {
			setTimeout(g.events.hideResults,1000);
		});

		// SERP item mouse over
		$('div#res ol#rso li.g').on('mouseenter',g.events.serpMouseOver);
		$('div#res ol#rso li.g').on('mouseleave',g.events.serpMouseLeave);
	},
	
	addStyles: function() {
		// Adds styles to the DOM
		GM_addStyle("div.vspib { right: -10px !important; opacity: 0.5; }");

		GM_addStyle("div#blTop { background-color: white; z-index: 999; position: absolute; top: "+ (g.prefs.blPosition.top) +"px; right: "+ (g.prefs.blPosition.right) +"px; border: 1px solid black; width: 300px; padding: 0;  }");

		GM_addStyle("li.hidtxt { color: gray; font-size: 0.60em; margin: 2px 0; }");
		GM_addStyle("li.hidtxt span.domain { text-decoration: line-through; }");

		GM_addStyle("li.domainEntry { list-style: none; margin: 2px 0; padding: 1px 0 1px 0; }");
		GM_addStyle("li.domainEntry span.domain { margin-left: 20px; }");

		GM_addStyle("div.ex { clear: none; position: absolute; cursor: pointer; background: transparent url("+ g.roundClose +") 0 0 no-repeat; height: 16px; width: 16px; } ");

		GM_addStyle("span.blLink { color: FireBrick; cursor: pointer; font-size: 0.75em; } ");
		GM_addStyle("span.blLink:hover { text-decoration: underline; } ");
		
		GM_addStyle("div#blULContainer { cursor: default; height: 300px; overflow: auto; margin: 5px; position: relative;z-index: 2; background-color: #fff; }");
		GM_addStyle("div#blForm { margin-top: 5px; padding: 5px; }");


		GM_addStyle("div.blText { background-color: white; background-color: #C9D7F1; color: black; padding: 3px; text-align: center; font-weight: bold; cursor: move; -moz-user-select: none; }");
		GM_addStyle("div#blClose { position: absolute; height: 16px; width: 16px; top: 2px; right: 3px; cursor: pointer; background: transparent url("+ g.squareClose +") 0 0 no-repeat; }");
		
		GM_addStyle("input#blAddBox { width: 180px; }");
		GM_addStyle("input#blAddBtn { width: 40px; }");
		GM_addStyle("div#blPrefContainer { cursor: default; background-color: white; margin: 5px; z-index: 2; }");
		GM_addStyle("ul#blPrefList li { list-style: none; margin: 0; padding: 1px 0 10px 0; }");
		
		GM_addStyle("div#blPortContainer { cursor: default; background-color: white; margin: 5px; z-index: 2; text-align: center; }");
		GM_addStyle("div#blPortContainer button { font-size: 12px; }");
		GM_addStyle("div#blPortContainer textarea#blPortBox { width: 250px; height: 100px; font-family: courier new; font-size: 10px; }");


		GM_addStyle("span.blOn { float: right; width: 68px; height: 28px; overflow: hidden; cursor: pointer; background: transparent url("+ g.onoffData +") 0 0 no-repeat; }");
		GM_addStyle("span.blOff { float: right; width: 68px; height: 28px; overflow: hidden; cursor: pointer; background: transparent url("+ g.onoffData +") -68px 0 no-repeat; }");
		GM_addStyle("span.blDesc { font-size: 0.75em; }");
		
		GM_addStyle("div#blUpdated { margin: 3px; text-align: center; }");

		GM_addStyle("li.g { position: relative; background-color: transparent; }");
		GM_addStyle("div.rotated { background-color: transparent; -moz-transform: rotate(-90deg); -webkit-transform: rotate(-90deg); position: absolute; top: 30px; left: -46px; padding-bottom: 5px; padding-top: 5px; }");
		GM_addStyle("div.cover { background-color: transparent; top: 0; left: 0; position: absolute; text-align: center; background-image: url("+ g.transPNG +"); background-repeat: repeat-x repeat-y;  }");
		GM_addStyle("div.cover div.blConfirm { text-align: left; color: white; background-color: transparent; padding: 10px; font-weight: bold; }");
        GM_addStyle("div.blConfirm span.blyes { color: #0E774A; cursor: pointer; }");
        GM_addStyle("div.blConfirm span.blno  { color: #D13B3B; cursor: pointer; }");

        GM_addStyle("div#blUpdateMe { color: white; position: absolute; top: 0; right: 10px; font-size: 12px; z-index:100; cursor: pointer; }");

	},

	getBlacklist: function() {
		// Gets the blacklist from greasemonkey
		// Debug: for clearing out the blacklist
		// GM_setValue('blacklist','');
		// End debug
		return (GM_getValue('blacklist') ? GM_getValue('blacklist').split(',') : [] );
	},

	makeBlacklistControls: function() {
		// Makes the controls for this script
		
		// Adds an option to show the blacklist into the greasemonkey menu
		GM_registerMenuCommand("Toggle Google Blacklist",g.events.showHideBlacklist);
		
		$('body').append('<div id="blTop"><div class="blText">Your Blacklist<div id="blClose"></div></div><div id="blULContainer"><ul id="blacklist"></ul></div><div id="blForm"></div></div>');

		$('div#blClose').on('click',g.events.showHideBlacklist);
				
		$('div#blForm').append('<input type="text" id="blAddBox" /><input type="button" value="add" id="blAddBtn" />');
		$('div#blForm').append('<br/><span class="blDesc">Regular expressions are supported, do not use i or g flags.');

		// Events
		$('input#blAddBox').on('keyup',g.events.manualAdd);
		$('input#blAddBtn').on('click',g.events.manualAdd);
		
		// Preferences
		
		var prefTxt = '<span class="blPref blOn"></span>';
		$('#blTop').append('<div class="blText">Preferences</div>');
		$('#blTop').append('<div id="blPrefContainer"><ul id="blPrefList"></ul></div>');

		$('#blPrefList').append('<li id="blEnable">Blacklist Enabled'+ prefTxt +'<br/><span class="blDesc">Toggles this userscript. This will reload the page..</span></li>');		
		$('#blPrefList').append('<li id="blDisplay">Display Messages'+ prefTxt +'<br/><span class="blDesc">Shows "<span class="domain">domain</span> blacklisted" in SERP.</span></li>');
		$('#blPrefList').append('<li id="blRegex">RegEx Blocker'+ prefTxt +'<br/><span class="blDesc">Use regex to block full domain name.</span></li>');
		$('#blPrefList').append('<li id="blMalware">Auto Block Malware'+ prefTxt +'<br/><span class="blDesc">Auto-block sites listed as malware.</span></li>');
		$('#blPrefList').append('<li id="blNews">Blacklist News'+ prefTxt +'<br/><span class="blDesc">Blacklists google news widget.</span></li>');
		$('#blPrefList').append('<li id="blRelated">Blacklist Related'+ prefTxt +'<br/><span class="blDesc">Blacklists related results.</span></li>');
		$('#blPrefList').append('<li id="blPrefShow">Show Preferences'+ prefTxt +'<br/><span class="blDesc">Leaves prefs open for debugging.</span></li>');
				
		$.each(g.prefs, function(id) {
			if (this==false) {
				$('li#'+ id +' span.blPref').removeClass('blOn');
				$('li#'+ id +' span.blPref').addClass('blOff');
			}
		});

		// Preference Toggle Events
		$('span.blPref').on('click',g.events.togglePref);

		// Import/Export
		
		$('#blTop').append('<div class="blText">Import/Export</div>');
		$('#blTop').append('<div id="blPortContainer"></div>');
		$('#blPortContainer').append('<button id="blImport">Import</button>&nbsp;<button id="blExport">Export</button>');
		$('#blPortContainer').append('<br/>');
		$('#blPortContainer').append('<textarea id="blPortBox"></textarea>');

		// Import/Export Events
		$('button#blImport').on('click',g.events.import);
		$('button#blExport').on('click',g.events.export);

		$('div#blTop').hide();
				
		g.buildList();
	},

	buildList: function() {
		$('li.domainEntry').remove();
		
		if (g.blacklist.length==0) {
			$('ul#blacklist').append('<li class="domainEntry"><i>No entries in your list.</i></li>');
			$('ul#blacklist').append('<li class="domainEntry"><i>Click "Blacklist Domain" in the SERP or add a domain below.</i></li>');
		} else {		
			$.each(g.blacklist,function(i,key) {
				$('ul#blacklist').append('<li class="domainEntry"><div class="ex"></div><span class="domain">'+ key +'</span></li>');
				$('div.ex').on('click',g.events.removeFromBlackList);
			});
		}
	},

	urlUnFuck: function() {
		$('a[onmousedown]').each(function(){
			if (/return rwt/.test($(this).attr('onmousedown').toSource()) === false) return;
			$(this).replaceWith($('<a href="'+ $(this).attr('href') +'">'+ $(this).html() +'</a>'));
		});
	},

	// Image from: http://www.webstuffshare.com/2010/03/stylize-your-own-checkboxes/
	onoffData: 'data:image/png;base64,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',
	
	// Square Close 16x16
	squareClose: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKRSURBVHjafFNNSxtRFD1jJokT0XzYFEVTYtClJQqithTbtZv+hCoIrsTgpisxXXRRqG3pUtAu/QndWaGFfsaIlZqiUaRpMNrERJM0yUym540voC764Lx598295368exVwDQP3NeBFMxB2Um4iFFxdJlEnqkQJiJeByGfgnTJE4y63e+3x8jJC/f3QSyWYdaqa5lUGRYFis0HVNCS3tvB0chJH+fwD5R6wH11aCvr9flSzWRjVqmWsXPPeILE5HHC0tyOTyeDJ1NSB2goEvW43Cru70CsVGFLXJlNphF6/dK/mcvAFAhC2apvIaX8fOr07OzowPDuLVCyG76ursDciYNhD09Nweb1Yn58ncxPOdR0tgkxstVQKSrmMmjizBl2DgzAYTZx1sbtcuDMzg7bOThQOD2HSu0ilSn2XINCEh3QaKvOu8edHehiJRnFrdBQ66+ENBuHu7kaeUX5ZWICdDkQaldNTaA0CPZmEy+Oxci6T5H0kgruLiwiNjVkp5FifT3Nz0IpFOOUT10jQ3CAwNjeh9vZCbW21iljY28M5o/L19V0QJBKoU3bwLAjqZ2eokdQiEFsLC6Ls7IDNgTNGMrK2ZhmfxONoYwqh8XHg+BiJiQn4qCOIRP7COZ6zBDFih/jq8Zj5jQ1TLPF9S3k9HDaruZx1l1pZMb9RL0F8IJ6JV37FbZv4RSSpLFaRxhs0/imJt3mvk0RAyCnp9CWh6rJZxHM6GfLRwAAq/AYoN8t/Zcrpnh7Ymd7Nax2qFoCDP+yoGxTcosJUVi51ImSuBqtuCvCclTinre02kOflQ5tkNOTE/b2YOgtlKReJE+KA+EH85kRaMzMDPPJynP2AR/vPOBuS6AhgLIi8Bt78E2AAIgs1EDs3QMgAAAAASUVORK5CYII=',
	
	// Round Close 16x16
	roundClose: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEtQTFRF4ktG/Pz8+J+quJyQ3NTU9djb58bH59rXiVMn7MzVh2lZ+cfE6Mq22Jub7eTku1FPp3xr4Lm3fBMT8mddujMyzXh2nyEJ5isI////62JIbAAAAKZJREFUeNosj1dyBEEIQ5k8u3ZnELr/SU13WR+EV4ICYegxBdSeWQuZTS1dV4uUJ8ilpHZ/rs/dSskBTJMd7ef+PVJSozwoRh6tHaQVNDGMPXZZUDaDiUIWCe0mUOlwGYncuI/h6BO4lGko4u49Rtx1Gkh1xysVrtGNsU2CKmd35zbcBxkTpzAsHv0KqPP0L/xf+Ob1XO0Lodf1XOisb+9vPWf9J8AAjDQSeN44sCcAAAAASUVORK5CYII=',

	// Transparent PNG
	transPNG: 'data:image/png;base64,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',
	
	// TLD List
	tld: ['.areo','.asia','.biz','.cat','.com','.coop','.edu','.gov','.info','.int','.jobs','.mil','.mobi','.museum','.name','.net','.org','.pro','.tel','.travel','.xxx','.com.ac','.net.ac','.gov.ac','.org.ac','.mil.ac','.ac','.ad','.co.ae','.net.ae','.gov.ae','.ac.ae','.sch.ae','.org.ae','.mil.ae','.pro.ae','.name.ae','.ae','.af','.com.ag','.org.ag','.net.ag','.co.ag','.nom.ag','.ag','.off.ai','.com.ai','.net.ai','.org.ai','.ai','.com.al','.edu.al','.gov.al','.mil.al','.net.al','.org.al','.al','.com.am','.net.am','.org.am','.am','.an','.ed.ao','.gv.ao','.og.ao','.co.ao','.pb.ao','.it.ao','.ao','.aq','.com.ar','.edu.ar','.gob.ar','.gov.ar','.int.ar','.mil.ar','.net.ar','.org.ar','.tur.ar','.ar','.as','.gv.at','.ac.at','.co.at','.or.at','.at','.com.au','.net.au','.org.au','.edu.au','.gov.au','.csiro.au','.asn.au','.id.au','.au','.aw','.ax','.com.az','.net.az','.int.az','.gov.az','.org.az','.edu.az','.info.az','.pp.az','.mil.az','.name.az','.pro.az','.biz.az','.az','.web.ba','.org.ba','.net.ba','.edu.ba','.gov.ba','.mil.ba','.unsa.ba','.untz.ba','.unmo.ba','.unbi.ba','.unze.ba','.co.ba','.com.ba','.rs.ba','.ba','.co.bb','.com.bb','.net.bb','.org.bb','.gov.bb','.edu.bb','.info.bb','.store.bb','.tv.bb','.biz.bb','.bb','.com.bd','.edu.bd','.ac.bd','.net.bd','.gov.bd','.org.bd','.mil.bd','.bd','.be','.bf','.bg','.com.bh','.info.bh','.cc.bh','.edu.bh','.biz.bh','.net.bh','.org.bh','.gov.bh','.bh','.bi','.gouv.bj','.mil.bj','.edu.bj','.gov.bj','.asso.bj','.com.bj','.bj','.bm','.com.bn','.edu.bn','.gov.bn','.net.bn','.org.bn','.bn','.com.bo','.net.bo','.org.bo','.tv.bo','.mil.bo','.int.bo','.gob.bo','.gov.bo','.edu.bo','.bo','.adm.br','.adv.br','.agr.br','.am.br','.arq.br','.art.br','.ato.br','.b.br','.bio.br','.blog.br','.bmd.br','.cim.br','.cng.br','.cnt.br','.com.br','.coop.br','.ecn.br','.edu.br','.eng.br','.esp.br','.etc.br','.eti.br','.far.br','.flog.br','.fm.br','.fnd.br','.fot.br','.fst.br','.g12.br','.ggf.br','.gov.br','.imb.br','.ind.br','.inf.br','.jor.br','.jus.br','.lel.br','.mat.br','.med.br','.mil.br','.mus.br','.net.br','.nom.br','.not.br','.ntr.br','.odo.br','.org.br','.ppg.br','.pro.br','.psc.br','.psi.br','.qsl.br','.radio.br','.rec.br','.slg.br','.srv.br','.taxi.br','.teo.br','.tmp.br','.trd.br','.tur.br','.tv.br','.vet.br','.vlog.br','.wiki.br','.zlg.br','.br','.com.bs','.net.bs','.org.bs','.edu.bs','.gov.bs','.bs','.bt','.bv','.co.bw','.org.bw','.bw','.by','.com.bz','.edu.bz','.gov.bz','.net.bz','.org.bz','.bz','.ab.ca','.bc.ca','.mb.ca','.nb.ca','.nf.ca','.nl.ca','.ns.ca','.nt.ca','.nu.ca','.on.ca','.pe.ca','.qc.ca','.sk.ca','.yk.ca','.ca','.cc','.cd','.cf','.cg','.ch','.ci','.co.ck','.org.ck','.edu.ck','.gov.ck','.net.ck','.gen.ck','.biz.ck','.info.ck','.ck','.cl','.cm','.ac.cn','.com.cn','.edu.cn','.gov.cn','.mil.cn','.net.cn','.org.cn','.ah.cn','.bj.cn','.cq.cn','.fj.cn','.gd.cn','.gs.cn','.gz.cn','.gx.cn','.ha.cn','.hb.cn','.he.cn','.hi.cn','.hk.cn','.hl.cn','.hn.cn','.jl.cn','.js.cn','.jx.cn','.ln.cn','.mo.cn','.nm.cn','.nx.cn','.qh.cn','.sc.cn','.sd.cn','.sh.cn','.sn.cn','.sx.cn','.tj.cn','.tw.cn','.xj.cn','.xz.cn','.yn.cn','.zj.cn','.cn','.com.co','.org.co','.edu.co','.gov.co','.net.co','.mil.co','.nom.co','.co','.ac.cr','.co.cr','.ed.cr','.fi.cr','.go.cr','.or.cr','.sa.cr','.cr','.cu','.cv','.cx','.ac.cy','.net.cy','.gov.cy','.org.cy','.pro.cy','.name.cy','.ekloges.cy','.tm.cy','.ltd.cy','.biz.cy','.press.cy','.parliament.cy','.com.cy','.cy','.cz','.de','.dj','.dk','.dm','.art.do','.com.do','.edu.do','.gob.do','.gov.do','.mil.do','.net.do','.org.do','.sld.do','.web.do','.do','.com.dz','.org.dz','.net.dz','.gov.dz','.edu.dz','.asso.dz','.pol.dz','.art.dz','.dz','.com.ec','.info.ec','.net.ec','.fin.ec','.med.ec','.pro.ec','.org.ec','.edu.ec','.gob.ec','.gov.ec','.mil.ec','.ec','.ee','.com.eg','.edu.eg','.eun.eg','.gov.eg','.mil.eg','.name.eg','.net.eg','.org.eg','.sci.eg','.eg','.com.er','.edu.er','.gov.er','.mil.er','.net.er','.org.er','.ind.er','.er','.com.es','.nom.es','.org.es','.gob.es','.edu.es','.es','.com.et','.gov.et','.org.et','.edu.et','.net.et','.biz.et','.name.et','.info.et','.et','.europa.eu','.eu','.fi','.ac.fj','.biz.fj','.com.fj','.info.fj','.mil.fj','.name.fj','.net.fj','.org.fj','.pro.fj','.fj','.co.fk','.org.fk','.gov.fk','.ac.fk','.nom.fk','.net.fk','.fk','.fm','.fo','.tm.fr','.asso.fr','.nom.fr','.prd.fr','.presse.fr','.com.fr','.gouv.fr','.fr','.ga','.gb','.gd','.ge','.gf','.co.gg','.net.gg','.org.gg','.gg','.com.gh','.edu.gh','.gov.gh','.org.gh','.mil.gh','.gh','.gi','.gl','.gm','.com.gn','.ac.gn','.gov.gn','.org.gn','.net.gn','.gn','.com.gp','.net.gp','.mobi.gp','.edu.gp','.asso.gp','.org.gp','.gp','.gq','.co.gr','.com.gr','.edu.gr','.net.gr','.org.gr','.gov.gr','.mil.gr','.mod.gr','.sch.gr','.gr','.gs','.com.gt','.edu.gt','.net.gt','.gob.gt','.org.gt','.mil.gt','.ind.gt','.gt','.com.gu','.net.gu','.gov.gu','.org.gu','.edu.gu','.gu','.gw','.gy','.com.hk','.edu.hk','.gov.hk','.idv.hk','.net.hk','.org.hk','.hk','.hm','.hn','.hr','.ht','.co.hu','.gov.hu','.edu.hu','.hu','.ac.id','.co.id','.net.id','.or.id','.web.id','.sch.id','.mil.id','.go.id','.id','.ie','.ac.il','.co.il','.org.il','.net.il','.k12.il','.gov.il','.muni.il','.idf.il','.il','.im','.co.in','.firm.in','.net.in','.org.in','.gen.in','.ind.in','.ac.in','.edu.in','.res.in','.ernet.in','.gov.in','.mil.in','.in','.io','.gov.iq','.edu.iq','.com.iq','.mil.iq','.org.iq','.net.iq','.iq','.ac.ir','.co.ir','.gov.ir','.id.ir','.net.ir','.org.ir','.sch.ir','.ir','.is','.gov.it','.edu.it','.it','.co.je','.net.je','.org.je','.je','.com.jm','.net.jm','.org.jm','.edu.jm','.gov.jm','.mil.jm','.jm','.com.jo','.net.jo','.gov.jo','.edu.jo','.org.jo','.mil.jo','.name.jo','.sch.jo','.jo','.ac.jp','.ad.jp','.co.jp','.ed.jp','.go.jp','.gr.jp','.lg.jp','.ne.jp','.or.jp','.jp','.co.ke','.or.ke','.ne.ke','.go.ke','.ac.ke','.sc.ke','.me.ke','.mobi.ke','.info.ke','.ke','.kg','.per.kh','.com.kh','.edu.kh','.gov.kh','.mil.kh','.net.kh','.org.kh','.kh','.biz.ki','.net.ki','.info.ki','.org.ki','.gov.ki','.edu.ki','.mob.ki','.tel.ki','.ki','.com.km','.coop.km','.asso.km','.nom.km','.presse.km','.tm.km','.medecin.km','.notaires.km','.pharmaciens.km','.veterinaire.km','.edu.km','.gouv.km','.mil.km','.km','.net.kn','.org.kn','.edu.kn','.gov.kn','.kn','.com.kp','.gov.kp','.kp','.co.kr','.ne.kr','.or.kr','.re.kr','.pe.kr','.go.kr','.mil.kr','.ac.kr','.hs.kr','.ms.kr','.es.kr','.sc.kr','.kg.kr','.kr','.edu.kw','.com.kw','.net.kw','.org.kw','.gov.kw','.kw','.com.ky','.org.ky','.net.ky','.edu.ky','.gov.ky','.ky','.com.kz','.edu.kz','.gov.kz','.mil.kz','.net.kz','.org.kz','.kz','.la','.com.lb','.edu.lb','.gov.lb','.net.lb','.org.lb','.lb','.lc','.li','.gov.lk','.sch.lk','.net.lk','.int.lk','.com.lk','.org.lk','.edu.lk','.ngo.lk','.soc.lk','.web.lk','.ltd.lk','.assn.lk','.grp.lk','.hotel.lk','.lk','.com.lr','.edu.lr','.gov.lr','.org.lr','.net.lr','.lr','.ls','.lt','.lu','.com.lv','.edu.lv','.gov.lv','.org.lv','.mil.lv','.id.lv','.net.lv','.asn.lv','.conf.lv','.lv','.com.ly','.net.ly','.gov.ly','.plc.ly','.edu.ly','.sch.ly','.med.ly','.org.ly','.id.ly','.ly','.net.ma','.ac.ma','.org.ma','.gov.ma','.press.ma','.co.ma','.ma','.tm.mc','.asso.mc','.mc','.md','co.me','net.me','org.me','edu.me','ac.me','gov.me','its.me','priv.me','.me','.org.mg','.nom.mg','.gov.mg','.prd.mg','.tm.mg','.edu.mg','.mil.mg','.com.mg','.in.mg','.mg','.mh','.com.mk','.org.mk','.net.mk','.edu.mk','.gov.mk','.inf.mk','.name.mk','.pro.mk','.mk','.com.ml','.net.ml','.org.ml','.edu.ml','.gov.ml','.presse.ml','.ml','.net.mm','.com.mm','.org.mm','.gov.mm','.mm','.gov.mn','.edu.mn','.org.mn','.mn','.com.mo','.edu.mo','.gov.mo','.net.mo','.org.mo','.mo','.gov.mp','.org.mp','.co.mp','.mp','.mq','.mr','.ms','.com.mt','.org.mt','.net.mt','.edu.mt','.gov.mt','.mt','.com.mu','.net.mu','.org.mu','.gov.mu','.ac.mu','.oc.mu','.or.mu','.mu','.aero.mv','.biz.mv','.com.mv','.coop.mv','.edu.mv','.gov.mv','.info.mv','.int.mv','.mil.mv','.museum.mv','.name.mv','.net.mv','.org.mv','.pro.mv','.mv','.ac.mw','.co.mw','.com.mw','.coop.mw','.edu.mw','.gov.mw','.int.mw','.museum.mw','.net.mw','.org.mw','.mw','.mx','.com.my','.net.my','.org.my','.gov.my','.edu.my','.sch.my','.mil.my','.name.my','.my','.ac.mz','.co.mz','.org.mz','.gov.mz','.edu.mz','.mz','.co.na','.com.na','.na','.asso.nc','.nc','.ne','.com.nf','.net.nf','.arts.nf','.store.nf','.web.nf','.firm.nf','.info.nf','.other.nf','.per.nf','.rec.nf','.nf','.com.ng','.org.ng','.gov.ng','.edu.ng','.net.ng','.sch.ng','.name.ng','.mobi.ng','.biz.ng','.mil.ng','.ng','.gob.ni','.co.ni','.com.ni','.ac.ni','.edu.ni','.org.ni','.nom.ni','.net.ni','.mil.ni','.ni','.gob.nl','.co.nl','.ac.nl','.org.nl','.nom.nl','.net.nl','.mil.nl','.nl','.priv.no','.no','.com.np','.edu.np','.gov.np','.mil.np','.net.np','.org.np','.np','.edu.nr','.gov.nr','.biz.nr','.info.nr','.net.nr','.org.nr','.com.nr','.nr','.nu','.ac.nz','.co.nz','.geek.nz','.gen.nz','.maori.nz','.net.nz','.org.nz','.school.nz','.cri.nz','.govt.nz','.iwi.nz','.parliament.nz','.mil.nz','.health.nz','.nz','.com.om','.co.om','.edu.om','.ac.om','.sch.om','.gov.om','.net.om','.org.om','.mil.om','.museum.om','.biz.om','.pro.om','.med.om','.om','.net.pa','.com.pa','.ac.pa','.sld.pa','.gob.pa','.edu.pa','.org.pa','.abo.pa','.ing.pa','.med.pa','.nom.pa','.pa','.edu.pe','.gob.pe','.nom.pe','.mil.pe','.sld.pe','.org.pe','.com.pe','.net.pe','.pe','.com.pf','.pf','.com.pg','.net.pg','.ac.pg','.gov.pg','.mil.pg','.org.pg','.pg','.ph','.com.pk','.net.pk','.edu.pk','.org.pk','.fam.pk','.biz.pk','.web.pk','.gov.pk','.gob.pk','.gok.pk','.gon.pk','.gop.pk','.gos.pk','.pk','.com.pl','.biz.pl','.net.pl','.art.pl','.edu.pl','.org.pl','.ngo.pl','.gov.pl','.info.pl','.mil.pl','.waw.pl','.warszawa.pl','.wroc.pl','.wroclaw.pl','.krakow.pl','.katowice.pl','.poznan.pl','.lodz.pl','.gda.pl','.gdansk.pl','.slupsk.pl','.radom.pl','.szczecin.pl','.lublin.pl','.bialystok.pl','.olsztyn.pl','.bydgoszcz.pl','.torun.pl','.gorzow.pl','.zgora.pl','.pl','.pm','.pn','.pr','.biz.pr','.com.pr','.edu.pr','.gov.pr','.info.pr','.isla.pr','.name.pr','.net.pr','.org.pr','.pro.pr','.est.pr','.prof.pr','.ac.pr','.pr','.com.ps','.net.ps','.org.ps','.edu.ps','.gov.ps','.plo.ps','.sec.ps','.ps','.com.pt','.edu.pt','.gov.pt','.int.pt','.net.pt','.nome.pt','.org.pt','.publ.pt','.pt','.co.pw','.ne.pw','.or.pw','.ed.pw','.go.pw','.belau.pw','.pw','.org.py','.edu.py','.mil.py','.gov.py','.net.py','.com.py','.coop.py','.py','.com.qa','.net.qa','.org.qa','.gov.qa','.edu.qa','.mil.qa','.qa','.asso.re','.nom.re','.com.re','.re','.arts.ro','.com.ro','.firm.ro','.info.ro','.nom.ro','.nt.ro','.org.ro','.rec.ro','.store.ro','.tm.ro','.www.ro','.ro','.co.rs','.org.rs','.edu.rs','.ac.rs','.gov.rs','.in.rs','.rs','.ac.ru','.com.ru','.edu.ru','.gov.ru','.int.ru','.mil.ru','.net.ru','.org.ru','.pp.ru','.ru','.gov.rw','.net.rw','.edu.rw','.ac.rw','.com.rw','.co.rw','.int.rw','.mil.rw','.gouv.rw','.rw','.com.sa','.edu.sa','.sch.sa','.med.sa','.gov.sa','.net.sa','.org.sa','.pub.sa','.sa','.com.sb','.net.sb','.edu.sb','.org.sb','.gov.sb','.sb','.com.sc','.net.sc','.edu.sc','.gov.sc','.org.sc','.sc','.com.sd','.net.sd','.org.sd','.edu.sd','.med.sd','.tv.sd','.gov.sd','.info.sd','.sd','.se','.com.sg','.net.sg','.org.sg','.gov.sg','.edu.sg','.per.sg','.idn.sg','.sg','.co.sh','.com.sh','.org.sh','.gov.sh','.edu.sh','.net.sh','.nom.sh','.sh','.si','.sj','.sk','.com.sl','.net.sl','.org.sl','.edu.sl','.gov.sl','.sl','.sm','.art.sn','.com.sn','.edu.sn','.gouv.sn','.org.sn','.perso.sn','.univ.sn','.sn','.so','.sr','.nic.st','.gov.st','.saotome.st','.principe.st','.consulado.st','.embaixada.st','.org.st','.edu.st','.net.st','.com.st','.store.st','.mil.st','.co.st','.st','.su','.edu.sv','.gob.sv','.com.sv','.org.sv','.red.sv','.sv','.edu.sy','.gov.sy','.net.sy','.mil.sy','.com.sy','.org.sy','.news.sy','.sy','.co.sz','.ac.sz','.org.sz','.sz','.tc','.td','.eu.tf','.us.tf','.net.tf','.edu.tf','.tf','.tg','.ac.th','.co.th','.in.th','.go.th','.mi.th','.or.th','.net.th','.th','.ac.tj','.aero.tj','.biz.tj','.co.tj','.com.tj','.coop.tj','.dyn.tj','.edu.tj','.go.tj','.gov.tj','.info.tj','.int.tj','.mil.tj','.name.tj','.museum.tj','.my.tj','.name.tj','.net.tj','.nic.tj','.org.tj','.per.tj','.pro.tj','.test.tj','.web.tj','.tj','.tk','.tl','.tm','.com.tn','.ens.tn','.fin.tn','.gov.tn','.ind.tn','.intl.tn','.nat.tn','.net.tn','.org.tn','.info.tn','.perso.tn','.tourism.tn','.edunet.tn','.rnrt.tn','.rns.tn','.rnu.tn','.mincom.tn','.agrinet.tn','.defense.tn','.tn','.edu.to','.to','.tp','.nc.tr','.com.tr','.gen.tr','.org.tr','.biz.tr','.info.tr','.av.tr','.dr.tr','.pol.tr','.bel.tr','.tsk.tr','.bbs.tr','.k12.tr','.edu.tr','.name.tr','.net.tr','.gov.tr','.web.tr','.tel.tr','.tv.tr','.tr','.co.tt','.com.tt','.org.tt','.net.tt','.biz.tt','.info.tt','.pro.tt','.int.tt','.coop.tt','.jobs.tt','.mobi.tt','.travel.tt','.museum.tt','.aero.tt','.cat.tt','.tel.tt','.name.tt','.tt','.tv','.edu.tw','.gov.tw','.mil.tw','.com.tw','.net.tw','.org.tw','.idv.tw','.game.tw','.ebiz.tw','.club.tw','.tw','.co.tz','.ac.tz','.go.tz','.or.tz','.ne.tz','.tz','.com.ua','.edu.ua','.gov.ua','.net.ua','.org.ua','.co.ua','.biz.ua','.in.ua','.me.ua','.pp.ua','.ua','.co.ug','.ac.ug','.sc.ug','.go.ug','.ne.ug','.or.ug','.org.ug','.ug','.ac.uk','.co.uk','.gov.uk','.ltd.uk','.me.uk','.mod.uk','.net.uk','.nhs.uk','.org.uk','.parliament.uk','.plc.uk','.police.uk','.soc.uk','.cym.uk','.scot.uk','.bl.uk','.british-library.uk','.icnet.uk','.jet.uk','.nls.uk','.parliament.uk','.nhs.uk','.mod.uk','.govt.uk','.orgn.uk','.lea.uk','.mil.uk','.nel.uk','.sch.uk','.nic.uk','.uk','.dni.us','.fed.us','.isa.us','.kids.us','.nsn.us','.us','.com.uy','.edu.uy','.gub.uy','.net.uy','.mil.uy','.org.uy','.uy','.co.uz','.com.uz','.org.uz','.uz','.va','.vc','.com.ve','.net.ve','.org.ve','.info.ve','.co.ve','.web.ve','.gob.ve','.edu.ve','.mil.ve','.tec.ve','.ve','.vg','.co.vi','.org.vi','.com.vi','.net.vi','.k12.vi','.vi','.com.vn','.biz.vn','.edu.vn','.gov.vn','.net.vn','.org.vn','.int.vn','.ac.vn','.pro.vn','.info.vn','.health.vn','.name.vn','.vn','.vu','.wf','.org.ws','.gov.ws','.edu.ws','.ws','.com.ye','.co.ye','.ltd.ye','.me.ye','.net.ye','.org.ye','.plc.ye','.gov.ye','.ye','.yt','.agric.za','.cybernet.za','.grondar.za','.iaccess.za','.inca.za','.nis.za','.olivetti.za','.pix.za','.ac.za','.city.za','.co.za','.edu.za','.gov.za','.law.za','.mil.za','.nom.za','.org.za','.school.za','.alt.za','.net.work.za','.ngo.za','.tm.za','.web.za','.bourse.za','.za','.ac.zm','.co.zm','.com.zm','.edu.zm','.gov.zm','.net.zm','.org.zm','.sch.zm','.zm','.ac.zw','.org.zw','.zw','.cym','.eng','.gb','.sco','.bzh','.cymru','.cwl','.wales','.eus','.gal','.ker','.lli','.quebec','.scot','.sic','.nai','.kids','.mail','.web','.med','.eco','.post','.shop','.sport','.wine']

};

setTimeout(g.init,500);

//var x = [1,2,3,3,3,3,3,4,9,1,2,3,4,5,5,5,5];
//console.log($.unique(x).sort());


Array.prototype.uniq = function() {
	var old = this;
	var uniq = [];
	$.each(old,function(i,key) {
		if (uniq.indexOf(key) === -1) uniq.push(key);
	});
	return uniq;
};

Array.prototype.remove = function(word) {
	var old = this;
	var out = [];
	$.each(old,function(i,key) {
		if (key===word) return;
		out.push(key);
	});
	return out;
};

/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);

// ==UserScript==
// @name        AN old items
// @namespace   http://audionews.org
// @include     http://audionews.org/tracker.php*
// @include     https://audionews.org/tracker.php*
// @description	Disables re-registered and old items from being shown in the list
// @run-at      document-end
// @version     1.8
// @downloadURL https://update.greasyfork.org/scripts/6756/AN%20old%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/6756/AN%20old%20items.meta.js
// ==/UserScript==

var w = (typeof unsafeWindow === "undefined") ? window : unsafeWindow;
// var log = (typeof GM_log !== "undefined") ? GM_log : w.console.log;
// var log = w.console.log;
var $, jQuery;
$ = jQuery = w.jQuery;

var pref = { };


var months = 9;
// var monthsThorough = 0.5;

// Polyfill & GM sandbox workaround
// @grant       GM_getValue
// @grant       GM_setValue
if (true || typeof GM_getValue !== "function") {
	var GM_setValue = function ( cookieName, cookieValue, lifeTime ) {
		if( !cookieName ) { return; }
		if( lifeTime == "delete" ) { lifeTime = -10; } else { lifeTime = 31536000 * 2; }
		document.cookie = escape( cookieName ) + "=" + escape( getRecoverableString( cookieValue ) ) +
			";expires=" + ( new Date( ( new Date() ).getTime() + ( 1000 * lifeTime ) ) ).toGMTString() + ";path=/";
	};

	var GM_getValue = function ( cookieName, oDefault ) {
		var cookieJar = document.cookie.split( "; " );
		for( var x = 0; x < cookieJar.length; x++ ) {
			var oneCookie = cookieJar[x].split( "=" );
			if( oneCookie[0] == escape( cookieName ) ) {
				try {
					/* jshint -W061 */
					eval('var footm = '+unescape( oneCookie[1] ));
				} catch(e) { return oDefault; }
				return footm;
			}
		}
		return oDefault;
	};

	var GM_deleteValue = function ( oKey ) {
		GM_setValue( oKey, '', 'delete' );
	};

	var basicObPropNameValStr = /^\w+$/;
	var cleanStrFromAr = new Array(/\\/g,/'/g,/"/g,/\r/g,/\n/g,/\f/g,/\t/g,new RegExp('-'+'->','g'),new RegExp('<!-'+'-','g'),/\//g), cleanStrToAr = new Array('\\\\','\\\'','\\\"','\\r','\\n','\\f','\\t','-\'+\'->','<!-\'+\'-','\\\/');

	getRecoverableString = function (oVar,notFirst) {
		var oType = typeof(oVar);
		if( ( oType == 'null' ) || ( oType == 'object' && !oVar ) ) {
			//most browsers say that the typeof for null is 'object', but unlike a real
			//object, it will not have any overall value
			return 'null';
		}
		if( oType == 'undefined' ) { return 'window.uDfXZ0_d'; }
		if( oType == 'object' ) {
			//Safari throws errors when comparing non-objects with window/document/etc
			if( oVar == window ) { return 'window'; }
			if( oVar == document ) { return 'document'; }
			if( oVar == document.body ) { return 'document.body'; }
			if( oVar == document.documentElement ) { return 'document.documentElement'; }
		}
		if( oVar.nodeType && ( oVar.childNodes || oVar.ownerElement ) ) { return '{error:\'DOM node\'}'; }
		if( !notFirst ) {
			Object.prototype.toRecoverableString = function (oBn) {
				if( this.tempLockIgnoreMe ) { return '{\'LoopBack\'}'; }
				this.tempLockIgnoreMe = true;
				var retVal = '{', sepChar = '', j;
				for( var i in this ) {
					if( i == 'toRecoverableString' || i == 'tempLockIgnoreMe' || i == 'prototype' || i == 'constructor' ) { continue; }
					if( oBn && ( i == 'index' || i == 'input' || i == 'length' || i == 'toRecoverableObString' ) ) { continue; }
					j = this[i];
					if( !i.match(basicObPropNameValStr) ) {
						//for some reason, you cannot use unescape when defining peoperty names inline
						for( var x = 0; x < cleanStrFromAr.length; x++ ) {
							i = i.replace(cleanStrFromAr[x],cleanStrToAr[x]);
						}
						i = '\''+i+'\'';
					} else if( window.ActiveXObject && navigator.userAgent.indexOf('Mac') + 1 && !navigator.__ice_version && window.ScriptEngine && ScriptEngine() == 'JScript' && i.match(/^\d+$/) ) {
						//IE mac does not allow numerical property names to be used unless they are quoted
						i = '\''+i+'\'';
					}
					retVal += sepChar+i+':'+getRecoverableString(j,true);
					sepChar = ',';
				}
				retVal += '}';
				this.tempLockIgnoreMe = false;
				return retVal;
			};
			Array.prototype.toRecoverableObString = Object.prototype.toRecoverableString;
			Array.prototype.toRecoverableString = function () {
				var i;
				if( this.tempLock ) { return '[\'LoopBack\']'; }
				if( !this.length ) {
					var oCountProp = 0;
					for( i in this ) { if( i != 'toRecoverableString' && i != 'toRecoverableObString' && i != 'tempLockIgnoreMe' && i != 'prototype' && i != 'constructor' && i != 'index' && i != 'input' && i != 'length' ) { oCountProp++; } }
					if( oCountProp ) { return this.toRecoverableObString(true); }
				}
				this.tempLock = true;
				var retVal = '[';
				for( i = 0; i < this.length; i++ ) {
					retVal += (i?',':'')+getRecoverableString(this[i],true);
				}
				retVal += ']';
				delete this.tempLock;
				return retVal;
			};
			Boolean.prototype.toRecoverableString = function () {
				return ''+this+'';
			};
			Date.prototype.toRecoverableString = function () {
				return 'new Date('+this.getTime()+')';
			};
			Function.prototype.toRecoverableString = function () {
				return this.toString().replace(/^\s+|\s+$/g,'').replace(/^function\s*\w*\([^\)]*\)\s*\{\s*\[native\s+code\]\s*\}$/i,'function () {[\'native code\'];}');
			};
			Number.prototype.toRecoverableString = function () {
				if( isNaN(this) ) { return 'Number.NaN'; }
				if( this == Number.POSITIVE_INFINITY ) { return 'Number.POSITIVE_INFINITY'; }
				if( this == Number.NEGATIVE_INFINITY ) { return 'Number.NEGATIVE_INFINITY'; }
				return ''+this+'';
			};
			RegExp.prototype.toRecoverableString = function () {
				return '\/'+this.source+'\/'+(this.global?'g':'')+(this.ignoreCase?'i':'');
			};
			String.prototype.toRecoverableString = function () {
				var oTmp = escape(this);
				if( oTmp == this ) { return '\''+this+'\''; }
				return 'unescape(\''+oTmp+'\')';
			};
		}
		if( !oVar.toRecoverableString ) { return '{error:\'internal object\'}'; }
		var oTmp = oVar.toRecoverableString();
		if( !notFirst ) {
			//prevent it from changing for...in loops that the page may be using
			delete Object.prototype.toRecoverableString;
			delete Array.prototype.toRecoverableObString;
			delete Array.prototype.toRecoverableString;
			delete Boolean.prototype.toRecoverableString;
			delete Date.prototype.toRecoverableString;
			delete Function.prototype.toRecoverableString;
			delete Number.prototype.toRecoverableString;
			delete RegExp.prototype.toRecoverableString;
			delete String.prototype.toRecoverableString;
		}
		return oTmp;
	};
}

if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}

$.extend({
	urlParams: function(url) {
		return url.replace(/^(?:[^\?]*|)\?([^\#]*)(?:\#.*|)/,'$1').split("&").map(function (n) {
			return n = n.split("="), this[n[0]] = n[1], this;
		}.bind({}))[0];
	},
	htmlDecode: function (str) {
		if (str) return $('<div />').html(str).text();
	}
});

(function () {
	if (!w.user || !w.user.set) {
		return;
	}

	// secure the cookie
	w._setCookie = w.setCookie;
	w.setCookie = function (name, value, days, path, domain, secure) {
		w._setCookie(name, value, 3 * 365, path, domain, secure);
	};
	// log("setCookie", w.setCookie);

	// w.user._set = w.user.set;
	// w.user.set = function (opt, val, days, reload) {
	// 	return this._set(opt, val, 365 * 3, reload);
	// };

	if (!GM_getValue("olditems_flag_reloaded") && !user.opt_js.tr_t_t) {
		GM_setValue("olditems_flag_reloaded", true);
		w.user.set("tr_t_t", 1);

		// no reload loop
		var tr_t_t; 
		try{
			tr_t_t = JSON.parse(decodeURIComponent(w.getCookie("opt_js"))).tr_t_t;
		} catch(e) { }

		// log("tr_t_t", tr_t_t);
		if (tr_t_t) {
			w.location.reload();
		}
	} else {
		GM_setValue("olditems_flag_reloaded", false);
	}
})();

$(function () {
	$("#ajax-topics label:contains('show time of') :checkbox")
	.attr("onclick", "user.set('tr_t_t', 1)")
	.prop("checked", true)
	.prop("disabled", true);

	var easyMode = true; // !!$(".tr_tm").css({ display: "none" }).length;

	var form = $("form[name=post]");

	form.submit(function () {
		var searchText = $(this).find("input[name=nm]").val();
		$(this).attr("action", $(this).attr("action").replace(/^([^#?]*)(?:\?nm=[^#]*|\??)/i, "$1?nm=" + encodeURIComponent(searchText)));
	});

	var searchText = $.urlParams(w.location.href).nm;

	oldItemsMenu(!!searchText, easyMode);

	// console.log(pref);

	if (searchText) {
		searchText = decodeURIComponent(searchText);

		if (!form.find("input[name=nm]").val())
			form.find("input[name=nm]").val(searchText);

		$(".bottom_info .nav a").attr('href', function(i, href) {
			return href.replace(/\?search_id/, "?nm=" + encodeURIComponent(searchText) + "&search_id");
		});
	} else {
		$("#tor-tbl tbody").css({ "background-color": "#efefef" });

		var style = pref.translucent ?
			$('<style>.oldItem { opacity: 0.15; }</style>') :
			$('<style>.oldItem { display: none; }</style>');
		style.appendTo("html > head");

/*		var releaseIndex = $("#tor-tbl thead th:contains(Release)").index();
		var addedIndex = $("#tor-tbl thead th:contains(Added)").index();
*/		var releaseIndex = $("#tor-tbl thead th:contains(DATE)").index();

		$("#tor-tbl tbody tr[id]").each(function () {
/*			
			if (easyMode) {
				var createdText = $(this).find(".tr_tm").contents();
				createdText = (createdText[0] && createdText[0].data) ? createdText[0].data.trim() : '';

				var addedText = $("#tor-tbl tbody tr[id]:first").find("td:eq(" + addedIndex +") p").map(function() {
					return $(this).text().trim();
				});

				if (createdText && ($.inArray(createdText, addedText) < 0)) {
					console.debug(createdText, addedText);
					console.debug("easyMode", $(this));
					$(this).addClass("oldItem");
					return;
				}
			}
*/

			var release = $(this).find("td:eq(" + releaseIndex +")").text()
			.replace(/^[\s\S]*?\[(\d{2})-(\d{2})-(\d{4})\][\s\S]*$/i, "$3/$1/$2");
			// .replace(/^[\s\S]*?\[(\d{2}).(\d{2}).(\d{4})\][\s\S]*$/i, "$3/$2/$1");

			// var added = $(this).find("td:eq(" + addedIndex +")").text()
			// .replace(/^[\s\S]*?(\d{1,2})-([a-z]{3})-(?:\d{2}(\d{2})|(\d{2}))\][\s\S]*$/i, "$1 $2, 20$3$4");
			var added = $(this).find(".tr_tm").contents();
			added = (added[0] && added[0].data)	? added[0].data.trim() : '';			
			added = added.replace(/^[\s\S]*?(\d{1,2})-([a-z]{3})-(?:\d{2}(\d{2})|(\d{2}))[\s\S]*$/i, "$1 $2, 20$3$4");

			// console.debug($(this), release, added);

			release = Date.parse(release);
			added = Date.parse(added);

			var date = release || added;
			var now = Date.now();

			// console.debug($(this), release, added, now, (now - date) > (months * 30 * 24 * 60 * 60 * 1000));

			// if (!added) {
			// 	return;
			// }

			if (date && ((now - date) > (months * 30 * 24 * 60 * 60 * 1000))) {
				$(this).addClass("oldItem");
			}

			/* // filter out elder torrents
			if (release && ((added - release) > (months * 30 * 24 * 60 * 60 * 1000))) {
				$(this).addClass("oldItem");
			// then newer ones
			} else if (pref.thorough && (!release || ((added - release) > (monthsThorough * 30 * 24 * 60 * 60 * 1000)))) {
				var href = $(this).find(".tLink").attr('href');
				$.get(
					href,
					$.proxy(
						function(data) {
							// log(this);

							// this through proxy
							var item = this.item;
							var added = this.added;
							var release = $(data).find("[title='Post link']:first").text();

							if (release) {
								// won't match on yesterday/today
								release = release.replace(/^[\s\S]*?(\d{1,2})-([a-z]{3})-(?:\d{2}(\d{2})|(\d{2}))[\s\S]*$/i, "$1 $2, 20$3$4");
								release = Date.parse(release);

								if (release && ((added - release) > (monthsThorough * 30 * 24 * 60 * 60 * 1000))) {
									$(item).addClass("oldItem");
								}

							} else {
								// log([ "no release date", this.href ]);
							}
						},
						{ item: this, href: href, added: added }
					)
				);
			}*/

		});
	}
});

function oldItemsMenu(isSearch, isEasyMode) {
	/* jshint multistr:true */
	$("#dls-menu").after($(' \
	<div class="menu-sub" id="oldItems-menu"> \
		<div class="menu-a"> \
			<a href="#" class="med"><input type="checkbox" name="translucent" /> Translucent old items</a> \
			<!--<a id="oldItemsThorough" href="#" class="med"><input type="checkbox" name="thorough" /> Thorough mode (caution!)</a>--> \
		</div> \
	</div> \
	 '));

	$("#oldItems-menu a :checkbox").each(function () {
		var name = $(this).attr("name");
		if (name) {
			var value = !!GM_getValue("olditems_pref_" + name, false);
			$(this).prop("checked", value);
			pref[name] = value;
			// log([ $(this), name, value ]);
		}
	});

	$(".topmenu .tRight")
	.prepend($('<span> &#xB7; </span>'))
	.prepend($('<span id="oldItems"><a class="menu-oldItems" href="#oldItems-menu">Old items</a> <a class="menu-oldItems" href="#oldItems-menu">&#x25BC;</a></span>'));

	// main.js start
	$('a.menu-oldItems')
	.click(function (e) {
			e.preventDefault();
			Menu.clicked($(this));
			return false;
	})
	.hover(
		function () {
			Menu.hovered($(this));
			return false;
		},
		function () {
			Menu.unhovered($(this));
			return false;
		}
	);

	$('#oldItems-menu')
	.mousedown(function (e) {
			e.stopPropagation();
	})
	.find('a').click(function (e) {
		Menu.hide(e);
	});
	// main.js end

	$("#oldItems-menu a").click(function (e) {
		var checkbox = $(this).find(":checkbox");
		var name = checkbox.attr("name");
		var value = $(e.target).is(":checkbox") ? checkbox.prop("checked") : !checkbox.prop("checked");
		checkbox.prop("checked", value);
		GM_setValue("olditems_pref_" + name, value);
		// log([ "menu item", $(this), name, value ]);
	});

	if (isSearch) {
		$("#oldItems").css({ opacity: 0.5 });
		$("#oldItems-menu .menu-a").prepend(
			$('<p style="padding:4px"><b>Search mode active<b></p>')
		);
	}/* else if (isEasyMode) {
		$("#oldItemsThorough").css({ opacity: 0.5 });
	}*/
}

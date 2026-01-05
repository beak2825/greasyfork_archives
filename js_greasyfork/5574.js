// ==UserScript==
// @name			Ikariam Core
// @description		Framework for Ikariam userscript developers.
// @namespace		IkariamCore
// @author			Tobbe
// @version			3.2.1
// @license			MIT License
//
// @name:de			Ikariam Core
// @description:de	Framework für Ikariam Benutzerscript Entwickler.
//
// @exclude			*
// 
// @connect			greasyfork.org
// 
// @grant			unsafeWindow
// @grant			GM_setValue
// @grant			GM.setValue
// @grant			GM_getValue
// @grant			GM.getValue
// @grant			GM_deleteValue
// @grant			GM.deleteValue
// @grant			GM_listValues
// @grant			GM.listValues
// @grant			GM_getResourceText
// @grant			GM.getResourceText
// @grant			GM_xmlhttpRequest
// @grant			GM.xmlHttpRequest
// ==/UserScript==

// Add some functions to the String and Array prototype, namespaced by "IC".
(function() {
	// "Internal" function to add functions to native objects with the usage of an namespace.
	var _addNamespacedFunctions = function(io_parent, is_namespaceName, io_functionsToAdd) {
		var lo_functionStorage = {};
		
		var lf_createGetter = function(is_functionName) {
			return function() {
				return function() {
					return io_functionsToAdd[is_functionName].apply(go_self, arguments);
				};
			};
		};
		
		for(var ls_functionName in io_functionsToAdd) {
			if(io_functionsToAdd.hasOwnProperty(ls_functionName)) {
				Object.defineProperty(lo_functionStorage, ls_functionName, { get: lf_createGetter(ls_functionName) });
			}
		}
		
		Object.defineProperty(io_parent.prototype, is_namespaceName, {
			get: function() {
				go_self = this;
				return lo_functionStorage;
			}
		});
	};
	
	/**
	 * Additional methods for processing strings.
	 * 
	 * @external	"String.IC"
	 */
	_addNamespacedFunctions(String, 'IC', {
		/**
		 * Replaces characters or whitespaces at the beginning of a string.
		 * 
		 * @function external:"String.IC".ltrim
		 * 
		 * @param	{?String}	[is_toRemove=whitespaces]
		 *   A string containing the characters to remove.
		 *
		 * @return	{String}
		 *   The trimmed string.
		 */
		ltrim: function(is_toRemove) {
			return !!is_toRemove ? this.replace(new RegExp('^[' + is_toRemove + ']+'), '') : this.replace(/^\s+/, '');
		},
		/**
		 * Replaces characters or whitespaces at the end of a string.
		 *
		 * @function external:"String.IC".rtrim
		 * 
		 * @param	{?String}	[is_toRemove=whitespaces]
		 *   A string containing the characters to remove.
		 *
		 * @return	{String}
		 *   The trimmed string.
		 */
		rtrim: function(is_toRemove) {
			return !!is_toRemove ? this.replace(new RegExp('[' + is_toRemove + ']+$'), '') : this.replace(/\s+$/, '');
		},
		/**
		 * Replaces characters or whitespaces at the beginning and end of a string.
		 *
		 * @function external:"String.IC".trim
		 * 
		 * @param	{?String}	[is_toRemove=whitespaces]
		 *   A string containing the characters to remove.
		 *
		 * @return	{String}
		 *   The trimmed string.
		 */
		trim: function(is_toRemove) {
			return this.IC.ltrim(is_toRemove).IC.rtrim(is_toRemove);
		},
		/**
		 * Encodes HTML-special characters in a string.
		 *
		 * @function external:"String.IC".encodeHTML
		 * 
		 * @return	{String}
		 *   The encoded string.
		 */
		encodeHTML: function() {
			// Set the characters to encode.
			var lo_characters = {
				'&':	'&amp;',
				'"':	'&quot;',
				'\'':	'&apos;',
				'<':	'&lt;',
				'>':	'&gt;'
			};
			
			return this.replace(/([\&"'<>])/g, function(is_string, is_symbol) { return lo_characters[is_symbol]; });
		},
		/**
		 * Decodes HTML-special characters in a string.
		 *
		 * @function external:"String.IC".decodeHTML
		 * 
		 * @return	{String}
		 *   The decoded string.
		 */
		decodeHTML: function() {
			// Set the characters to decode.
			var lo_characters = {
				'&amp;':	'&',
				'&quot;':	'"',
				'&apos;':	'\'',
				'&lt;':		'<',
				'&gt;':		'>'
			};
			
			return this.replace(/(&quot;|&apos;|&lt;|&gt;|&amp;)/g, function(is_string, is_symbol) { return lo_characters[is_symbol]; });
		},
		/**
		 * Repeats a string a specified number of times.
		 * 
		 * @function external:"String.IC".repeat
		 * 
		 * @param	{int}	ii_nr
		 *   The number of times to repeat the string.
		 * 
		 * @return	{String}
		 *   The repeated string.
		 */
		repeat: function(ii_nr) {
			var rs_repeated = this;
			
			for(var i = 1; i < ii_nr; i++) {
				rs_repeated += this;
			}
			
			return rs_repeated;
		}
	});
	
	/**
	 * Additional methods for processing arrays.
	 * 
	 * @external	"Array.IC"
	 */
	_addNamespacedFunctions(Array, 'IC', {
		/**
		 * Inserts an element at a specified position into an array.
		 * 
		 * @function external:"Array.IC".insert
		 * 
		 * @param	{*}		im_item
		 *   The item which should be inserted.
		 * @param	{?int}	[ii_index=this.length]
		 *   The position where the element should be added. If not set, the element will be added at the end.
		 */
		insert: function(im_item, ii_index) {
			var li_maxIndex = this.length;
			
			// Get the index to insert.
			var li_index = !ii_index && ii_index != 0 ? li_maxIndex : ii_index;
			li_index = Math.max(li_index, 0);			// No negative index.
			li_index = Math.min(li_index, li_maxIndex);	// No index bigger than the array length.
			
			this.splice(li_index, 0, im_item);
		},
		/**
		 * Deletes an element at a specified position from an array.
		 * 
		 * @function external:"Array.IC".remove
		 * 
		 * @param	{int}	ii_index
		 *   The position of the element which should be deleted.
		 */
		remove: function(ii_index) {
			if(ii_index >= 0 && ii_index < this.length) {
				this.splice(ii_index, 1);
			}
		}
	});
	
	/**
	 * Additional methods for processing dates.
	 * 
	 * @external	"Date.IC"
	 */
	_addNamespacedFunctions(Date, 'IC', {
		/**
		 * Formats a date / time.
		 * 
		 * @example
		 *   (new Date()).IC.format('yyyy-MM-dd HH:mm:ss.SSS');
		 * 
		 * @function external:"Date.IC".format
		 * 
		 * @param	{String}	is_pattern
		 *   The pattern for the output.<br>
		 *   <br>
		 *   Options:<br>
		 *   <pre>  yyyy year, four digits
		 *   yy   year, two digits
		 *   MM   month, leading 0
		 *   M    month, no leading 0
		 *   dd   day, leading 0
		 *   d    day, no leading 0
		 *   hh   hour, 1-12, leading 0
		 *   h    hour, 1-12, no leading 0
		 *   HH   hour, 0-23, leading 0
		 *   H    hour, 0-23, no leading 0
		 *   mm   minute, leading 0
		 *   m    minute, no leading 0
		 *   ss   seconds, leading 0
		 *   s    seconds, no leading 0
		 *   SSS  milliseconds, leading 0
		 *   S    milliseconds, no leading 0
		 *   a    AM / PM</pre>
		 */
		format: function(is_pattern) {
			var lo_possibleOptions = {
				'yyyy':	this.getFullYear(),		// year, four digits
				'yy':	this.getYear() % 100,	// year, two digits
				'MM':	this.getMonth() + 1,	// month, leading 0
				'M':	this.getMonth() + 1,	// month, no leading 0
				'dd':	this.getDate(),			// day, leading 0
				'd':	this.getDate(),			// day, no leading 0
				'hh':	this.getHours() + 1,	// hour, 1-12, leading 0
				'h':	this.getHours() + 1,	// hour, 1-12, no leading 0
				'HH':	this.getHours(),		// hour, 0-23, leading 0
				'H':	this.getHours(),		// hour, 0-23, no leading 0
				'mm':	this.getMinutes(),		// minute, leading 0
				'm':	this.getMinutes(),		// minute, no leading 0
				'ss':	this.getSeconds(),		// seconds, leading 0
				's':	this.getSeconds(),		// seconds, no leading 0
				'SSS':	this.getMilliseconds(),	// milliseconds, ledaing 0
				'S':	this.getMilliseconds(),	// milliseconds, no leading 0
				'a':	'AM'					// AM / PM
			};
			
			if(lo_possibleOptions.MM < 10)	lo_possibleOptions.MM = '0' + lo_possibleOptions.MM;
			if(lo_possibleOptions.dd < 10)	lo_possibleOptions.dd = '0' + lo_possibleOptions.dd;
			if(lo_possibleOptions.h > 12)	lo_possibleOptions.hh = lo_possibleOptions.h = lo_possibleOptions.h - 12;
			if(lo_possibleOptions.hh < 10)	lo_possibleOptions.hh = '0' + lo_possibleOptions.hh;
			if(lo_possibleOptions.HH < 10)	lo_possibleOptions.HH = '0' + lo_possibleOptions.HH;
			if(lo_possibleOptions.mm < 10)	lo_possibleOptions.mm = '0' + lo_possibleOptions.mm;
			if(lo_possibleOptions.ss < 10)	lo_possibleOptions.ss = '0' + lo_possibleOptions.ss;
			if(lo_possibleOptions.S < 100)	lo_possibleOptions.SSS = '0' + lo_possibleOptions.SSS;
			if(lo_possibleOptions.S < 10)	lo_possibleOptions.SSS = '0' + lo_possibleOptions.SSS;
			if(lo_possibleOptions.H > 11)	lo_possibleOptions.a = 'PM';
			
			var rs_pattern = is_pattern;
			
			for(var ls_option in lo_possibleOptions) {
				rs_pattern = rs_pattern.replace(new RegExp('(' + ls_option + ')', 'g'), lo_possibleOptions[ls_option]);
			}
			
			return rs_pattern;
		}
	});
})();

/**
 * Instantiate a new set of core functions.<br>
 * {@link https://greasyfork.org/scripts/5574-ikariam-core Script on Greasy Fork}<br>
 * {@link https://github.com/IkaScripts/IkariamCore Script on GitHub}
 * 
 * @version	3.2.1
 * @author	Tobbe	<ikascripts@tobbexiv.de>
 * 
 * @global
 * 
 * @class
 * @classdesc	Framework for Ikariam userscript developers.
 * 
 * @param	{String}	is_scriptVersion
 *   The version of the script using Ikariam Core.
 * @param	{int}		ii_scriptId
 *   The id of the script using Ikariam Core.
 * @param	{String}	is_scriptName
 *   The name of the script using Ikariam Core.
 * @param	{String}	is_scriptAuthor
 *   The author of the script using Ikariam Core.
 * @param	{boolean}	ib_debug
 *   If debugging is enabled.
 */
function IkariamCore(is_scriptVersion, ii_scriptId, is_scriptName, is_scriptAuthor, ib_debug) {
	/**
	 * Storage for accessing <code>this</code> as reference to IkariamCore in subfunctions. Do <b>NOT</b> delete!
	 * 
	 * @private
	 * @inner
	 * 
	 * @type	IkariamCore
	 */
	var go_self = this;
	
	/**
	 * Storage for information on the script using Ikariam Core.
	 * 
	 * @private
	 * @inner
	 * 
	 * @type Object
	 * 
	 * @property	{String}	version	- The script version.
	 * @property	{int}		id		- The script id.
	 * @property	{String}	name	- The script name.
	 * @property	{String}	author	- The script author.
	 */
	var go_script = {
		version:	is_scriptVersion,
		id:			ii_scriptId,
		name:		is_scriptName,
		author:		is_scriptAuthor
	};
	
	/**
	 * General settings like debugging switched on / off.
	 * 
	 * @private
	 * @inner
	 * 
	 * @type Object
	 * 
	 * @property	{boolean}	debug	- If debugging is enabled.
	 */
	var go_settings = {
		debug:	ib_debug
	};
	
	/**
	 * A reference to <code>window</code> / <code>unsafeWindow</code>.
	 * 
	 * @instance
	 * 
	 * @type	window
	 */
	this.win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
	
	/**
	 * Reference to <code>window.ikariam</code>.
	 * 
	 * @instance
	 * 
	 * @type	Object
	 */
	this.ika = this.win.ikariam;
	
	/**
	 * Debugging console.<br>
	 * Available commands:<br>
	 * <code>assert, clear, count, debug, dir, dirxml, error, exception, group, groupCollapsed, groupEnd,
	 * info, log, logTimeStamp, profile, profileEnd, table, time, timeEnd, timeStamp, trace, warn</code><br>
	 * <br>
	 * The console is deactivated by the Ikariam page but with the script {@link https://greasyfork.org/de/scripts/6310-rescue-console Rescue Console} you can use it.
	 * 
	 * @instance
	 * 
	 * @type	console
	 */
	this.con = (function() {
		// Wrapper for console functions.
		var lo_consoleWrapper = {};
		
		// Set the console to the "rescued" debugConsole.
		var lo_originalConsole = go_self.win.debugConsole;
		
		// Define all console tags.
		var la_tags = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception',
						'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'logTimeStamp', 'profile',
						'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
		
		var lo_counters	= {};
		var lo_timers	= {};
		
		// Define the backup functions.
		var lo_selfDefinedFunctions = {
			assert: function(im_toCheck, im_toLog) {
				if(im_toCheck === false || im_toCheck === 0 || im_toCheck === null || im_toCheck === undefined) {
					go_self.con.error(im_toLog || 'Assertion Failure');
				}
			},
			count: function(is_name) {
				if(!lo_counters[is_name] === true)
					lo_counters[is_name] = 0;
				
				lo_counters[is_name]++;
				
				go_self.con.log(is_name + ': ' + lo_counters[is_name]);
			},
			debug: function() {
				go_self.con.log.apply(arguments);
			},
			error: function() {
				go_self.con.log.apply(arguments);
			},
			exception: function() {
				go_self.con.log.apply(arguments);
			},
			info: function() {
				go_self.con.log.apply(arguments);
			},
			logTimeStamp: function(iv_name) {
				go_self.con.log((new Date()).IC.format('HH:mm:ss.SSS') + ' ' + iv_name);
			},
			time: function(is_name) {
				go_self.con.info(is_name + ': timer started');
				lo_timers[is_name] = new Date();
			},
			timeEnd: function(is_name) {
				var ld_now = new Date();
				var li_timeElapsed = ld_now.getMilliseconds() - lo_timers[is_name].getMilliseconds();
				
				delete	lo_timers[is_name];
				
				go_self.con.info(is_name + ': ' + li_timeElapsed + 'ms');
			},
			warn: function() {
				go_self.con.log.apply(arguments);
			}
		};
		
		for(var i = 0; i < la_tags.length; i++) {
			var ls_key = la_tags[i];
			
			if(go_settings.debug) {
				// If available in console: use console; else: use backup function if available.
				if(lo_originalConsole[ls_key]) {
					lo_consoleWrapper[ls_key] = lo_originalConsole[ls_key];
				} else if(lo_selfDefinedFunctions[ls_key]) {
					lo_consoleWrapper[ls_key] = lo_selfDefinedFunctions[ls_key];
				}
			}
			
			// If the function is not set yet, set it to an empty function.
			if(!lo_consoleWrapper[ls_key]) {
				lo_consoleWrapper[ls_key] = function() { return; };
			}
		}
		
		return lo_consoleWrapper;
	})();

	this.con.groupCollapsed('IkariamCore initalization ...');
	
	/**
	 * Instantiate a new set of myGM functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Functions for cross-browser compatibility of the GM_* functions.<br>Also there are some new functionalities implemented.
	 */
	function myGM() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Storage for style sheets which will be added by the script.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object.<String, Element>
		 */
		var _go_styleSheets = {};
		
		/**
		 * Storage for notification id for possibility to identify a notification popup.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	int
		 */
		var _gi_notificationId = 0;
		
		/**
		 * If the GM_ functions <code>GM_setValue</code>, <code>GM_getValue</code>, <code>GM_deleteValue</code> and <code>GM_listValues</code> can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseGmStorage = !(typeof GM_getValue == 'undefined')
									&& !(typeof GM_setValue == 'undefined')
									&& !(typeof GM_deleteValue == 'undefined')
									&& !(typeof GM_listValues == 'undefined');
		
		/**
		 * If the GM. functions <code>GM.setValue</code>, <code>GM.getValue</code>, <code>GM.deleteValue</code> and <code>GM.listValues</code> can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseGmStorageNew = !(typeof GM == 'undefined')
									&& !(typeof GM.getValue == 'undefined')
									&& !(typeof GM.setValue == 'undefined')
									&& !(typeof GM.deleteValue == 'undefined')
									&& !(typeof GM.listValues == 'undefined');
		
		/**
		 * If the GM_ function <code>GM_getResourceText</code> can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseGmRessource = !(typeof GM_getResourceText == 'undefined');
		
		/**
		 * If the GM_ function <code>GM_xmlhttpRequest</code> can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseGmXhr = !(typeof GM_xmlhttpRequest == 'undefined');
		
		/**
		 * If the GM. function <code>GM.xmlhttpRequest</code> can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseGmXhrNew = !(typeof GM == 'undefined') && !(typeof GM.xmlHttpRequest == 'undefined');
		
		/**
		 * If the local storage can be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		var _gb_canUseLocalStorage = !!go_self.win.localStorage;
		
		/**
		 * The domain for storing cookies.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	String
		 */
		var _gs_cookieDomain = 'ikariam.gameforge.com';
		
		/**
		 * Create the header for a notification panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}		ii_id
		 *   The id of the notification.
		 * @param	{Element}	ie_panel
		 *   The panel of the notification.
		 * @param	{String}	is_headerText
		 *   The text for the header.
		 * @param	{IkariamCore~myGM~ConfirmAbortWithoutInput}	if_closePanel
		 *   The function to close the notification panel.
		 */
		var _createNotificationPanelHeader = function(ii_id, ie_panel, is_headerText, if_closePanel) {
			var le_wrapper		= go_self.myGM.addElement('div', ie_panel, { 'id': 'notificationPanelHeader' + ii_id, 'class': 'notificationPanelHeader' }, true);
			var le_left			= go_self.myGM.addElement('div', le_wrapper, { 'id': 'notificationPanelHeaderL' + ii_id, 'class': 'notificationPanelHeaderL' }, true);
			var le_right		= go_self.myGM.addElement('div', le_left, { 'id': 'notificationPanelHeaderR' + ii_id, 'class': 'notificationPanelHeaderR' }, true);
			var le_center		= go_self.myGM.addElement('div', le_right, { 'id': 'notificationPanelHeaderM' + ii_id, 'class': 'notificationPanelHeaderM', 'innerHTML': is_headerText }, true);
			go_self.myGM.addElement('div', le_center, { 'id': 'notificationPanelClose' + ii_id, 'class': 'notificationPanelClose', 'click': if_closePanel }, true);
		};
		
		/**
		 * Create the header for a notification.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}		ii_id
		 *   The id of the notification.
		 * @param	{Element}	ie_panel
		 *   The panel of the notification.
		 * @param	{IkariamCore~myGM~NotificationBodyOptions}	io_options
		 *   Options for the body.<br>
		 * @param	{IkariamCore~myGM~NotificationBodyText}	io_texts
		 *   The texts for the body.
		 */
		var _createNotificationPanelBody = function(ii_id, ie_panel, io_options, io_texts) {
			var le_wrapper	= go_self.myGM.addElement('div', ie_panel, { 'id': 'notificationPanelBody' + ii_id, 'class': 'notificationPanelBody' }, true);
			var le_left		= go_self.myGM.addElement('div', le_wrapper, { 'id': 'notificationPanelBodyL' + ii_id, 'class': 'notificationPanelBodyL' }, true);
			var le_right	= go_self.myGM.addElement('div', le_left, { 'id': 'notificationPanelBodyR' + ii_id, 'class': 'notificationPanelBodyR' }, true);
			var le_center	= go_self.myGM.addElement('div', le_right, { 'id': 'notificationPanelBodyM' + ii_id, 'class': 'notificationPanelBodyM' }, true);
			var ls_bodyType = 'div';
			var re_body;
			
			var lo_generalOptions = {};
			
			if(io_options.textarea === true) {
				ls_bodyType = 'textarea';
				
				if(io_options.readonly === true)
					lo_generalOptions['readonly'] = 'readonly';
				
				if(io_options.autoselect === true)
					lo_generalOptions['focus'] = function() { this.select(); };
			}
			
			if(!!io_texts.body === true) {
				re_body = go_self.myGM.addElement(ls_bodyType, le_center, go_self.myGM.merge({
					'id':			'notificationPanelBodyMContent' + ii_id,
					'class':		'notificationPanelBodyMContent',
					'innerHTML':	io_texts.body
				}, lo_generalOptions), true);
			} else {
				go_self.myGM.addElement('div', le_center, { 'id': 'notificationPanelBodyMTop' + ii_id, 'class': 'notificationPanelBodyMTop', 'innerHTML': io_texts.top }, true);
				re_body = go_self.myGM.addElement(ls_bodyType, le_center, go_self.myGM.merge({
					'id':			'notificationPanelBodyMBottom' + ii_id,
					'class':		'notificationPanelBodyMBottom',
					'innerHTML':	io_texts.bottom
				}, lo_generalOptions), true);
			}
			
			if(io_options.textarea !== true)
				re_body = null;
			
			go_self.myGM.addElement('div', le_center, { 'id': 'notificationPanelBodyPlaceholder' + ii_id, 'class': 'notificationPanelBodyPlaceholder' }, true);
			
			return re_body;
		};
		
		/**
		 * Create the footer for a notification panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}		ii_id
		 *   The id of the notification.
		 * @param	{Element}	ie_panel
		 *   The panel of the notification.
		 */
		var _createNotificationPanelFooter = function(ii_id, ie_panel) {
			var le_wrapper		= go_self.myGM.addElement('div', ie_panel, { 'id': 'notificationPanelFooter' + ii_id, 'class': 'notificationPanelFooter' }, true);
			var le_left			= go_self.myGM.addElement('div', le_wrapper, { 'id': 'notificationPanelFooterL' + ii_id, 'class': 'notificationPanelFooterL' }, true);
			var le_right		= go_self.myGM.addElement('div', le_left, { 'id': 'notificationPanelFooterR' + ii_id, 'class': 'notificationPanelFooterR' }, true);
			go_self.myGM.addElement('div', le_right, {
				'id':			'notificationPanelFooterM' + ii_id,
				'class':		'notificationPanelFooterM',
				'innerHTML':	go_script.name + ' v' + go_script.version
			}, true);
		};
		
		/**
		 * Create the buttons for a notification panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}		ii_id
		 *   The id of the notification.
		 * @param	{Element}	ie_panel
		 *   The panel of the notification.
		 * @param	{Element}	ie_body
		 *   The body of the notification.
		 * @param	{IkariamCore~myGM~NotificationButtonsText}	io_texts
		 *   The texts for the buttons.
		 * @param	{IkariamCore~myGM~NotificationButtonCallbacks}	io_callbacks
		 *   The callbacks for the buttons.
		 */
		var _createNotificationPanelButtons = function(ii_id, ie_panel, ie_body, io_texts, io_callbacks) {
			var le_wrapper	= go_self.myGM.addElement('div', ie_panel, {
				'id':		'notificationPanelButtonWrapper' + ii_id,
				'class':	'notificationPanelButtonWrapper'
			}, true);
			
			var lf_confirm;
			if(!!io_callbacks.confirm === true)
				lf_confirm = function() { io_callbacks.close(); io_callbacks.confirm(ie_body); };
			else
				lf_confirm = io_callbacks.close;
			
			go_self.myGM.addElement('input', le_wrapper, {
				'id':		'notificationPanelConfirm' + ii_id,
				'classes':	['notificationPanelButton', 'notificationPanelButtonConfirm'],
				'type':		'button',
				'value':	io_texts.confirm ? io_texts.confirm : go_self.Language.$('core.notification.button.confirm'),
				'click':	lf_confirm
			}, true);
			
			if(!!io_callbacks.abort === true) {
				go_self.myGM.addElement('input', le_wrapper, {
					'id':		'notificationPanelAbort' + ii_id,
					'classes':	['notificationPanelButton', 'notificationPanelButtonAbort'],
					'type':		'button',
					'value':	io_texts.abort ? io_texts.abort : go_self.Language.$('core.notification.button.abort'),
					'click':	function() { io_callbacks.close(); io_callbacks.abort(ie_body); }
				}, true);
			}
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Script identifying prefix.
		 * 
		 * @instance
		 * @readonly
		 * @name	 prefix
		 * @memberof IkariamCore~myGM
		 * 
		 * @type	{String}
		 */
		Object.defineProperty(this, 'prefix', { get: function() {
			return 'script' + go_script.id;
		} });
		
		/**
		 * Returns if the script is already executed on this page.
		 * 
		 * @instance
		 * @readonly
		 * @name	 alreadyExecuted
		 * @memberof IkariamCore~myGM
		 *
		 * @type	{boolean}
		 */
		Object.defineProperty(this, 'alreadyExecuted', { get: function() {
			if(this.$('#' + this.prefix + 'alreadyExecuted'))
				return true;
		
			// Add the hint, that the script was already executed.
			this.addElement('input', this.$('body'), { 'id': 'alreadyExecuted', 'type': 'hidden' });
			return false;
		} });
		
		/**
		 * Store a value specified by a key.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_key
		 *   The key of the value.
		 * @param	{*}			im_value
		 *   The value to store.
		 * 
		 * @return	{Promise}
		 *   A promise which resolves once the value is stored.
		 */
		this.setValue = function(is_key, im_value) {
			// Stringify the value to store also arrays.
			var ls_toStore = JSON.stringify(im_value);
			var ro_promise = null;
			
			// If the use of GM_setValue is possible, use it.
			if(_gb_canUseGmStorage) {
				GM_setValue(is_key, ls_toStore);
				
			// If the use of GM.setValue is possible, use it.
			} else if(_gb_canUseGmStorageNew) {
				ro_promise = GM.setValue(is_key, ls_toStore);
				
			// Otherwise use the local storage if possible.
			} else if(_gb_canUseLocalStorage) {
				go_self.win.localStorage.setItem(this.prefix + is_key, ls_toStore);
	
			// Otherwise use cookies.
			} else {
				var ls_data	= escape(this.prefix + is_key) + '=' + escape(ls_toStore);
				var ls_expire	= 'expires=' + (new Date(2020, 0, 1, 0, 0, 0, 0)).toGMTString();
				var ls_path	= 'path=/';
				var ls_domain	= 'domain=' + _gs_cookieDomain;
	
				go_self.win.document.cookie = ls_data + ';' + ls_expire + ';' + ls_path + ';' + ls_domain;
			}
			
			if(ro_promise == null) {
				ro_promise = Promise.resolve();
			}
	
			// Return the promise.
			return ro_promise;
		};
	
		/**
		 * Get a value and return it.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_key
		 *   The key of the value.
		 * @param	{*}			im_defaultValue
		 *   The value which is set if the value is not set.
		 *
		 * @return	{Promise}
		 *   A Promise which resolves to the stored value.
		 */
		this.getValue = function(is_key, im_defaultValue) {
			// Put the default value to JSON.
			var ls_value = JSON.stringify(im_defaultValue);
			var lo_promise = null;
	
			// If the use of GM_getValue is possible, use it.
			if(_gb_canUseGmStorage) {
				ls_value = GM_getValue(is_key, ls_value);
				
				// If the use of GM.getValue is possible, use it.
			} else if(_gb_canUseGmStorageNew) {
				lo_promise = GM.getValue(is_key, ls_value);
	
			// Otherwise use the local storage if possible.
			} else if(_gb_canUseLocalStorage) {
				var ls_storageValue = go_self.win.localStorage.getItem(this.prefix + is_key);
	
				if(ls_storageValue) {
					ls_value = ls_storageValue;
				}
	
			// Otherwise use cookies.
			} else {
				var la_allCookies = document.cookie.split("; ");
	
				for(var i = 0; i < la_allCookies.length; i++) {
					var la_oneCookie = la_allCookies[i].split("=");
	
					if(la_oneCookie[0] == escape(this.prefix + is_key)) {
						ls_value = unescape(la_oneCookie[1]);
						break;
					}
				}
			}
			
			if(lo_promise == null) {
				lo_promise = Promise.resolve(ls_value);
			}
			
			// Return the value (parsed for the correct return type).
			return lo_promise.then(function(is_stringifiedValue) { return JSON.parse(is_stringifiedValue); });
		};
	
		/**
		 * Delete a value specified by a key.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_key
		 *   The key of the value.
		 * 
		 * @return	{Promise}
		 *   A promise which resolves once the value is deleted.
		 */
		this.deleteValue = function(is_key) {
			var ro_promise = null;
			
			// If the use of GM_deleteValue is possible, use it.
			if(_gb_canUseGmStorage) {
				GM_deleteValue(is_key);
				
			// If the use of GM.deleteValue is possible, use it.
			} else if(_gb_canUseGmStorageNew) {
				ro_promise = GM.deleteValue(is_key);
	
			// Otherwise use the local storage if possible.
			} else if(_gb_canUseLocalStorage) {
				go_self.win.localStorage.removeItem(this.prefix + is_key);
	
			// Otherwise use cookies.
			} else {
				var ls_data	= escape(this.prefix + is_key) + '=';
				var ls_expire	= 'expires=' + (new Date(2000, 0, 1, 0, 0, 0, 0)).toGMTString();
				var ls_path	= 'path=/';
				var ls_domain	= 'domain=' + _gs_cookieDomain;
	
				go_self.win.document.cookie = ls_data + ';' + ls_expire + ';' + ls_path + ';' + ls_domain;
			}
			
			if(ro_promise == null) {
				ro_promise = Promise.resolve();
			}
	
			// Return the promise.
			return ro_promise;
		};
	
		/**
		 * Returns an array with the keys of all values stored by the script.
		 * 
		 * @instance
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves to the array with all keys.
		 */
		this.listValues = function() {
			// Create an array for the storage of the values keys.
			var la_key = new Array();
			var ro_promise = null;
	
			// If the use of GM_listValues is possible, use it.
			if(_gb_canUseGmStorage) {
				la_key = GM_listValues();
				
			// If the use of GM.listValues is possible, use it.
			} else if(_gb_canUseGmStorageNew) {
				ro_promise = GM.listValues();
	
			// Otherwise use the local storage if possible.
			} else if(_gb_canUseLocalStorage) {
				for(var i = 0; i < go_self.win.localStorage.length; i++) {
					var ls_keyName = go_self.win.localStorage.key(i);
	
					if(ls_keyName.indexOf(this.prefix) != -1) {
						la_key.push(ls_keyName.replace(this.prefix, ''));
					}
				}
	
			// Otherwise use cookies.
			} else {
				var la_allCookies = document.cookie.split("; ");
	
				for(var i = 0; i < la_allCookies.length; i++) {
					var ls_keyName = unescape(la_allCookies[i].split("=")[0]);
	
					if(ls_keyName.indexOf(this.prefix) != -1) {
						la_key.push(ls_keyName.replace(this.prefix, ''));
					}
				}
			}

			if(ro_promise == null) {
				ro_promise = Promise.resolve(la_key);
			}
	
			// Return the promise.
			return ro_promise;
		};
	
		/**
		 * Adds a style element to the head of the page and return it.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_styleRules
		 *   The style rules to be set.
		 * @param	{?String}	[is_id=stylesheet not stored]
		 *   An id for the style set, to have the possibility to delete it.
		 * @param	{?boolean}	[ib_overwrite=false]
		 *   If a style with id should overwrite an existing style.
		 *
		 * @return	{boolean}
		 *    If the stylesheet was stored with the id.
		 */
		this.addStyle = function(is_styleRules, is_id, ib_overwrite) {
			var rb_storedWithId = false;
	
			if(ib_overwrite && ib_overwrite == true)
				this.removeStyle(is_id);
	
			if(!is_id || (is_id && !_go_styleSheets[is_id])) {
				var le_style = this.addElement('style', document.head, { 'type': 'text/css', 'innerHTML': is_styleRules });
	
				if(is_id) {
					_go_styleSheets[is_id] = le_style;
					rb_storedWithId = true;
				}
			}
	
			return rb_storedWithId;
		};
	
		/**
		 * Removes a style element set by the script.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_id
		 *   The id of the stylesheet to delete.
		 *
		 * @return	{boolean}
		 *    If the stylesheet could be deleted.
		 */
		this.removeStyle = function(is_id) {
			var rb_removed = false;
	
			if(is_id && _go_styleSheets[is_id]) {
				document.head.removeChild(_go_styleSheets[is_id]);
	
				delete	_go_styleSheets[is_id];
	
				rb_removed = true;
			}
	
			return rb_removed;
		};
		
		/**
		 * Makes a cross-site XMLHttpRequest.
		 * 
		 * @instance
		 * 
		 * @param	{Object}	io_args
		 *   The arguments the request needs. (specified here: {@link http://wiki.greasespot.net/GM_xmlhttpRequest GM_xmlhttpRequest})
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves to the response text (in case of an synchronous request) or a boolean false / JSON string indicating an error.
		 */
		this.xhr = function(io_args) {
			var ro_promise;
			
			// Whether the link fetches json data
			var lb_isJSON = (io_args.url.search(/\.json$/i) != -1);
	
			// Check if all required data is given.
			if(!io_args.method || !io_args.url || !io_args.onload) {
				ro_promise = Promise.resolve(false);
	
			// If the use of GM_xmlhttpRequest is possible, use it.
			} else if(_gb_canUseGmXhr) {
				var lm_response = GM_xmlhttpRequest(io_args);
				ro_promise = Promise.resolve(lm_response.responseText);
				
			// If the use of GM.xmlHttpRequest is possible, use it.
			} else if(_gb_canUseGmXhrNew) {
				/*
				 * GM 4.0 does not return a promise for the GM.xmlHttpRequest => synchronous requests will fail, asynchronous requests don't care at all.
				 */
				ro_promise = new Promise(function(resolve, reject) {
					var lb_synchronous = !!io_args.synchronous;
					delete io_args.synchronous;
					
					var lf_originalOnload = io_args.onload;
					io_args.onload = function(im_result) {
						// In the synchronous call case: resolve in callback.
						if(lb_synchronous === true) {
							resolve(im_result);
						} else {
							lf_originalOnload(im_result);
						}
					};

					var lo_responseObject = GM.xmlHttpRequest(io_args);
					
					// In the asynchronous call case: resolve directly.
					if(lb_synchronous === false) {
						resolve(lo_responseObject);
					}
				}).then(function(io_response) {
					return io_response && io_response.responseText ? io_response.responseText : '';
				});
				

			// Otherwise show a hint for the missing possibility to fetch the data.
			} else {
				// Otherwise if it is JSON.
				if(lb_isJSON) {
					io_args.onload('{ "is_error": true }');
					ro_promise = Promise.resolve('{ "is_error": true }');
	
				// Otherwise.
				} else {
					ro_promise = Promise.resolve(false);
				}
			}
	
			// Return the responseText.
			return ro_promise;
		};
		
		/**
		 * Returns the content of a resource parsed with JSON.parse.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_name
		 *   The name of the resource to parse.
		 * @param	{String}	is_xhrUrl
		 *   The resource to fetch the resource file from if the use of <code>GM_getResourceText</code> is not possible.
		 *   
		 * @return	{Object}
		 *   A Promise which resolves to the parsed resource.
		 */
		this.getResourceParsed = function(is_name, is_xhrUrl) {
			var lo_promise;
	
			// Function for safer parsing.
			var lf_safeParse = function(is_key, im_value) {
				// If the value is a function, return just the string, so it is not executable.
				if(typeof im_value === 'function' || Object.prototype.toString.apply(im_value) === '[object function]') {
					return im_value.toString();
				}

				return im_value;
			};
	
			// If the use of the default GM_getRessourceText is possible, use it.
			if(_gb_canUseGmRessource) {
				lo_promise = Promise.resolve(GM_getResourceText(is_name));
	
			// Otherwise perform a xmlHttpRequest (and cache the response).
			} else {
				var ls_key = 'core_cachedResource_' + is_name;
				lo_promise = go_self.myGM.getValue(ls_key, null).then(function(io_cached) {
					if(io_cached && io_cached.forScriptVersion == go_script.version) {
						return io_cached.resourceContent;
					}
					
					return go_self.myGM.xhr({
						method:			'GET',
						url:			is_xhrUrl,
						headers:		{ 'User-agent': navigator.userAgent, 'Accept': 'text/html' },
						synchronous:	true,
						onload:			function(im_response) { return false; }
					}).then(function(is_responseText) {
						// Cache the response.
						go_self.myGM.setValue(ls_key, {
							forScriptVersion:	go_script.version,
							resourceContent:	is_responseText,
						});
						return is_responseText;
					});
				});
			}
	
			return lo_promise.then(function(is_responseText) { return JSON.parse(is_responseText, lf_safeParse); });
		};
		
		/**
		 * Gets the first matching child element by a (css) query and returns it.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_query
		 *   The query for the element.
		 * @param	{?Element}	[ie_parent=document]
		 *   The parent element.
		 *
		 * @return	{Element}
		 *   The element.
		 */
		this.$ = function(is_query, ie_parent) {
			return this.$$(is_query, ie_parent)[0];
		};
	
		/**
		 * Gets all matching child elements by a (css) query and returns them.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_query
		 *   The query for the elements.
		 * @param	{?Element}	[ie_parent=document]
		 *   The parent element.
		 *
		 * @return	{Array.<Element>}
		 *   The elements.
		 */
		this.$$ = function(is_query, ie_parent) {
			var le_parent = ie_parent || document;
			
			// Return the elements as array, not as element list.
			return Array.prototype.slice.call(le_parent.querySelectorAll(is_query));
		};
		
		/**
		 * Returns the value of the selected option of a select field.
		 *
		 * @param	{String}	is_id
		 *   The last part of the id of the element.
		 * @param	{?boolean}	[ib_hasNoPrefix=false]
		 *   If the id has no prefix.
		 * @param	{?boolean}	[ib_addNoSelect=false]
		 *   If there should be no "Select" at the end of the id.
		 *
		 * @return	{String}
		 *   The value.
		 */
		this.getSelectValue = function(is_id, ib_hasNoPrefix, ib_addNoSelect) {
			var le_select = this.$('#' + (ib_hasNoPrefix ? '' : this.prefix) + is_id + (ib_addNoSelect ? '' : 'Select'));
	
			return le_select.options[le_select.selectedIndex].value;
		};
		
		/**
		 * Returns the value of the selected radio button of a radio button group.
		 *
		 * @param	{String}	is_name
		 *   The last part of the name of the element.
		 * @param	{?boolean}	[ib_hasNoPrefix=false]
		 *   If the name has no prefix.
		 *
		 * @return	{String}
		 *   The value.
		 */
		this.getRadioValue = function(is_name, ib_hasNoPrefix) {
			var le_radios	= this.$$('input[name="' + (ib_hasNoPrefix ? '' : this.prefix) + is_name + '"]');
			var rs_value	= '';
			
			for(var i = 0; i < le_radios.length; i++) {
				if(le_radios[i].checked) {
					rs_value = le_radios[i].value;
					break;
				}
			}
			
			return rs_value;
		};
		
		/**
		 * Creates a new element and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{String}				is_type
		 *   The type of the new element.
		 * @param	{Element}				ie_parent
		 *   The parent of the new element.
		 * @param	{?IkariamCore~myGM~NewElementOptions}	[io_options]
		 *   Options for the new element like id, class(es), style, type etc.
		 * @param	{?(boolean|IkariamCore~myGM~HasPrefix)}	[im_hasPrefix={id: true, classes: false}]
		 *   If a prefix should be used.
		 * @param	{?Element}				[ie_nextSibling=end of parent]
		 *   The next sibling of the element.
		 *
		 * @return	{Element}
		 *   The new element.
		 */
		this.addElement = function(is_type, ie_parent, io_options, im_hasPrefix, ie_nextSibling) {
			var re_newElement = document.createElement(is_type);
			
			if(!!io_options === true) {
				this.forEach(io_options, function(is_key, im_property) {
					var ls_prefix = '';
					
					if('id' === is_key && !(im_hasPrefix === false || (im_hasPrefix && im_hasPrefix.id === false))) {
						ls_prefix = go_self.myGM.prefix;
					}
					
					if('class' === is_key) {
						if(im_hasPrefix === true || (im_hasPrefix && im_hasPrefix.classes === true))
							ls_prefix = go_self.myGM.prefix;
						
						if(im_property !== '')
							re_newElement.classList.add(ls_prefix + im_property);
						
						return;
					}
					
					if('classes' === is_key) {
						if(im_hasPrefix === true || (im_hasPrefix && im_hasPrefix.classes === true))
							ls_prefix = go_self.myGM.prefix;
						
						for(var i = 0; i < im_property.length; i++) {
							if(im_property[i] != '')
								re_newElement.classList.add(ls_prefix + im_property[i]);
						}
						
						return;
					}
					
					if('style' === is_key) {
						for(var i = 0; i < im_property.length; i++) {
							re_newElement.style[im_property[i][0]] = im_property[i][1];
						}
						
						return;
					}
					
					if('click' === is_key || 'focus' === is_key) {
						re_newElement.addEventListener(is_key, im_property, false);
						
						return;
					}
					
					if('innerHTML' === is_key) {
						re_newElement[is_key] = im_property;
						
						return;
					}
					
					re_newElement.setAttribute(is_key, ls_prefix + im_property);
				});
			}
	
			ie_parent.insertBefore(re_newElement, ie_nextSibling);
	
			return re_newElement;
		};
		
		/**
		 * Removes an element from its parent.
		 * 
		 * @instance
		 * 
		 * @param	{(Element|Array.<Element>)}	im_toRemove
		 *   The element to remove.
		 */
		this.removeElement = function(im_toRemove) {
			if(!!im_toRemove === false)
				return;
			
			var la_toRemove = im_toRemove;
			
			if(Array.isArray(im_toRemove) === false)
				la_toRemove = [im_toRemove];
			
			for(var i = 0; i < la_toRemove.length; i++) {
				la_toRemove[i].parentNode.removeChild(la_toRemove[i]);
			}
		};
		
		/**
		 * Creates new checkboxes and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{Element}	ie_parent
		 *   The parent of the new checkboxes.
		 * @param	{Array.<IkariamCore~myGM~NewCheckboxData>}	ia_cbData
		 *   The data of the checkboxes.
		 */
		this.addCheckboxes = function(ie_parent, ia_cbData) {
			for(var i = 0; i < ia_cbData.length; i++) {
				var le_wrapper = this.addElement('div', ie_parent, { 'class': 'cbWrapper' });
				
				var ls_label = typeof ia_cbData[i].label == 'string' ? ia_cbData[i].label : go_self.Language.$(ia_cbData[i].label.id);
				var la_options = {
					'id':		ia_cbData[i]['id'] + 'Cb',
					'class':	'checkbox',
					'type':		'checkbox',
					'title':	ls_label
				};
				
				if(!!ia_cbData[i]['checked'] === true)
					la_options['checked'] = 'checked';
				
				this.addElement('input', le_wrapper, la_options);
			}
		};
		
		/**
		 * Creates a new radio button group and adds it to a parent table.
		 * 
		 * @instance
		 * 
		 * @param	{Element}		ie_parentTable
		 *   The parent table of the new select field.
		 * @param	{String}		is_name
		 *   The last part of the name of the radio button group.
		 * @param	{(String|int)}	im_checked
		 *   The value of the selected option.
		 * @param	{Array.<IkariamCore~myGM~ValueAndLabel>}	ia_options
		 *   An array with the names an values of the options.
		 * @param	{String}		is_labelText
		 *   The text of the select label.
		 */
		this.addRadios = function(ie_parentTable, is_name, im_checked, ia_options, is_labelText) {
			var le_row			= this.addElement('tr', ie_parentTable);
			var le_labelCell	= this.addElement('td', le_row, { 'class': 'vertical_top' });
			var le_radioCell	= this.addElement('td', le_row, { 'class': 'left' });
			
			var ls_labelText = typeof is_labelText == 'string' ? is_labelText : go_self.Language.$(is_labelText.id);
			this.addElement('span', le_labelCell, { 'innerHTML': ls_labelText });
			
			for(var i = 0; i < ia_options.length; i++) {
				var le_wrapper = this.addElement('div', le_radioCell, { 'class': 'radioWrapper' });
				
				var ls_optionLabel = typeof ia_options[i].label == 'string' ? ia_options[i].label : go_self.Language.$(ia_options[i].label.id);
				this.addElement('input', le_wrapper, {
					'class':	'checkbox',
					'type':		'radio',
					'name':		this.prefix + is_name,
					'value':	ia_options[i].value,
					'title':	ls_optionLabel,
					'checked':	ia_options[i].value == im_checked ? 'checked' : ''
				});
			}
		};
		
		/**
		 * Creates a new select field and adds it to a parent table.
		 * 
		 * @instance
		 * 
		 * @param	{Element}		ie_parentTable
		 *   The parent table of the new select field.
		 * @param	{String}		is_id
		 *   The last part of the id of the select field.
		 * @param	{(String|int)}	im_selected
		 *   The value of the selected option.
		 * @param	{Array.<IkariamCore~myGM~ValueAndLabel>}	ia_options
		 *   An array with the names an values of the options.
		 * @param	{String}		is_labelText
		 *   The text of the select label.
		 */
		this.addSelect = function(ie_parentTable, is_id, im_selected, ia_options, is_labelText) {
			var le_row			= this.addElement('tr', ie_parentTable);
			var le_labelCell	= this.addElement('td', le_row);
			var le_selectCell	= this.addElement('td', le_row, { 'class': 'left' });
			
			var ls_labelText = typeof is_labelText == 'string' ? is_labelText : go_self.Language.$(is_labelText.id);
			this.addElement('span', le_labelCell, { 'innerHTML': ls_labelText });
			
			var le_wrapper = this.addElement('div', le_selectCell, {
				'id':		is_id + 'SelectContainer',
				'classes':	['select_container', 'size175'],
				'style':	[['position', 'relative']]
			});
			var le_select = this.addElement('select', le_wrapper, { 'id': is_id + 'Select', 'class': 'dropdown' });
			
			for(var i = 0; i < ia_options.length; i++) {
				var ls_optionLabel = typeof ia_options[i].label == 'string' ? ia_options[i].label : go_self.Language.$(ia_options[i].label.id);
				var le_option = this.addElement('option', le_select, { 'value': ia_options[i].value, 'innerHTML': ls_optionLabel });
				
				if(le_option.value == im_selected) {
					le_option.selected = 'selected';
				}
			}
		};
	
		/**
		 * Creates a button and adds it to a parent.
		 * 
		 * @instance
		 * 
		 * @param	{Element}	ie_parent
		 *   The parent element.
		 * @param	{String}	is_value
		 *   The value of the button.
		 * @param	{function}	if_callback
		 *   A callback which should be called when the user clicks on the button.
		 * @param	{boolean}	[ib_parentIsWrapper=false]
		 *   If the element provided as parent is also the button wrapper.
		 */
		this.addButton = function(ie_parent, is_value, if_callback, ib_parentIsWrapper) {
			var le_buttonWrapper = ie_parent;
			
			if(ib_parentIsWrapper !== true)
				le_buttonWrapper = this.addElement('div', ie_parent, { 'class': 'centerButton' });

			var ls_value = typeof is_value == 'string' ? is_value : go_self.Language.$(is_value.id);
			var re_button = this.addElement('input', le_buttonWrapper, {
				'class':	'button',
				'type':		'button',
				'value':	ls_value,
				'click':	if_callback
			});
			
			return re_button;
		};
		
		/**
		 * Shows a notification to the user. You can either create a notification field or an input / output field. If the
		 * field should be an input field, the field is given to the callbacks as parameter. The abort button is only shown
		 * if the abort callback is set. It is also possible to have two body parts or just one body part. This functionality
		 * is set by the notification text.
		 * 
		 * @instance
		 * 
		 * @param	{IkariamCore~myGM~NotificationText}	im_text
		 *   The notification texts.
		 * @param	{?IkariamCore~myGM~NotificationCallbacks}	[im_callback]
		 *   The callbacks for confirm and abort.
		 * @param	{IkariamCore~myGM~NotificationBodyOptions}		[io_options]
		 *   Options for the body.
		 * 
		 * @return	{int}
		 *   The notification id.
		 */
		this.notification = function(im_text, im_callback, io_options) {
			_gi_notificationId++;
			var lo_options = io_options || {};
			
			// Set a local notification id to be able to have more than 1 notification panels.
			var ri_notificationId = _gi_notificationId;
			
			// Function to close the notification panel.
			var lf_closePanel = function() {
				go_self.myGM.removeElement([
					go_self.myGM.$('#' + go_self.myGM.prefix + 'notificationBackground' + ri_notificationId),
					go_self.myGM.$('#' + go_self.myGM.prefix + 'notificationPanelContainer' + ri_notificationId)
				]);
			};
			
			// Create the background and the container.
			this.addElement('div', document.body, { 'id': 'notificationBackground' + ri_notificationId, 'class': 'notificationBackground' }, true);
			var le_panelContainer	= this.addElement('div', document.body, { 'id': 'notificationPanelContainer' + ri_notificationId, 'class': 'notificationPanelContainer' }, true);
			var le_panel			= this.addElement('div', le_panelContainer, { 'id': 'notificationPanel' + ri_notificationId, 'class': 'notificationPanel' }, true);
	
			// Create the notification panel header.
			var ls_headerText = im_text.header ? im_text.header : go_self.Language.$('core.notification.header');
			_createNotificationPanelHeader(ri_notificationId, le_panel, ls_headerText, lf_closePanel);
			
			// Create the notification panel body.
			var lo_bodyTexts = {
				body:	im_text.body,
				top:	im_text.bodyTop ? im_text.bodyTop : '',
				bottom:	im_text.bodyBottom ? im_text.bodyBottom : ''
			};
			var le_body = _createNotificationPanelBody(ri_notificationId, le_panel, lo_options, lo_bodyTexts);
			
			// Create the notification panel footer.
			_createNotificationPanelFooter(ri_notificationId, le_panel);
			
			// Create the buttons.
			var lo_buttonTexts = {
				confirm:	im_text.confirm ? im_text.confirm : null,
				abort:		im_text.abort ? im_text.abort : null
			};
			var lo_buttonCallbacks = {
				close:		lf_closePanel,
				confirm:	im_callback && im_callback.confirm ? im_callback.confirm : null,
				abort:		im_callback && im_callback.abort ? im_callback.abort : null
			};
			_createNotificationPanelButtons(ri_notificationId, le_panel, le_body, lo_buttonTexts, lo_buttonCallbacks);
			
			return ri_notificationId;
		};
		
		/**
		 * Toogle the show / hide Button image and title.
		 * 
		 * @instance
		 * 
		 * @param  {Element}	ie_button
		 *   The button to toggle.
		 */
		this.toggleShowHideButton = function(ie_button) {
			ie_button.classList.toggle('minimizeImg');
			ie_button.classList.toggle('maximizeImg');
			
			ie_button.title = (ie_button.title == go_self.Language.$('general.fold')) ? go_self.Language.$('general.expand') : go_self.Language.$('general.fold');
		};
		
		/**
		 * Runs a callback on every property of an object which is not in the prototype.
		 * 
		 * @instance
		 * 
		 * @param	{Object}	io_object
		 *   The Object where forEach should be used.
		 * @param	{IkariamCore~myGM~ForEachCallback}	if_callback
		 *   The callback which should be called.
		 */
		this.forEach = function(io_object, if_callback) {
			for(var ls_key in io_object) {
				if(Object.prototype.hasOwnProperty.call(io_object, ls_key)) {
					if_callback(ls_key, io_object[ls_key]);
				}
			}
		};
		
		/**
		 * Merges objects.
		 * 
		 * @instance
		 * 
		 * @param	{...Object}	arguments
		 *   All objects to merge into each other.
		 * 
		 * @return	{Object}
		 *   The merged object.
		 */
		this.merge = function() {
			var ro_merged = {};
			
			for(var i = 0; i < arguments.length; i++) {
				go_self.myGM.forEach(arguments[i], function(is_key, im_value) {
					if(typeof ro_merged[is_key] === 'object' && typeof im_value === 'object')
						go_self.myGM.merge(ro_merged[is_key], im_value);
					else
						ro_merged[is_key] = im_value;
				});
			}
			
			return ro_merged;
		};
		
		/*--------------------*
		 * Set some settings. *
		 *--------------------*/
		
		// Set the notification style.
		this.addStyle(
				"." + this.prefix + "notificationBackground					{ z-index: 1000000000000; position: fixed; visibility: visible; top: 0px; left: 0px; width: 100%; height: 100%; padding: 0; background-color: #000; opacity: .7; } \
				 ." + this.prefix + "notificationPanelContainer				{ z-index: 1000000000001; position: fixed; visibility: visible; top: 100px; left: 50%; width: 500px; height: 370px; margin-left: -250px; padding: 0; text-align: left; color: #542C0F; font: 12px Arial,Helvetica,sans-serif; } \
				 ." + this.prefix + "notificationPanel						{ position: relative; top: 0px; left: 0px; background-color: transparent; border: 0 none; overflow: hidden; } \
				 ." + this.prefix + "notificationPanelHeader				{ height: 39px; background: none repeat scroll 0 0 transparent; font-weight: bold; line-height: 2; white-space: nowrap; } \
				 ." + this.prefix + "notificationPanelHeaderL				{ height: 39px; background-image: url('skin/layout/notes_top_left.png'); background-position: left top; background-repeat: no-repeat; } \
				 ." + this.prefix + "notificationPanelHeaderR				{ height: 39px; background-image: url('skin/layout/notes_top_right.png'); background-position: right top; background-repeat: no-repeat; } \
				 ." + this.prefix + "notificationPanelHeaderM				{ height: 39px; margin: 0 14px 0 38px; padding: 12px 0 0; background-image: url('skin/layout/notes_top.png'); background-position: left top; background-repeat: repeat-x; color: #811709; line-height: 1.34em; } \
				 ." + this.prefix + "notificationPanelBody					{ max-height: 311px; height: 100%; background: none repeat scroll 0 0 transparent; } \
				 ." + this.prefix + "notificationPanelBodyL					{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; } \
				 ." + this.prefix + "notificationPanelBodyR					{ height: 100%; background-image: url('skin/layout/notes_right.png'); background-position: right top; background-repeat: repeat-y; } \
				 ." + this.prefix + "notificationPanelBodyM					{ height: 100%; background-color: #F7E7C5; background-image: none;  margin: 0 6px; padding: 0 10px; font-size: 14px; } \
				 ." + this.prefix + "notificationPanelBodyMTop				{ max-height: 100px; line-height: 2; } \
				 ." + this.prefix + "notificationPanelBodyMTop b			{ line-height: 3.5; font-size:110%; } \
				 ." + this.prefix + "notificationPanelBodyM a				{ color: #811709; font-weight: bold; } \
				 ." + this.prefix + "notificationPanelBodyM h2				{ font-weight: bold; } \
				 ." + this.prefix + "notificationPanelBodyMContent			{ max-height: 270px; padding: 10px; background-color: #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 ." + this.prefix + "notificationPanelBodyMBottom			{ max-height: 170px; padding: 10px; background-color: #FFF7E1; border: 1px dotted #C0C0C0; font: 14px Arial,Helvetica,sans-serif; color: #000000; border-collapse: separate; overflow-y:auto; } \
				 textarea." + this.prefix + "notificationPanelBodyMContent	{ height: 270px; width: 445px; resize: none; } \
				 textarea." + this.prefix + "notificationPanelBodyMBottom	{ height: 170px; width: 445px; resize: none; } \
				 ." + this.prefix + "notificationPanelBodyPlaceholder		{ height: 20px; } \
				 ." + this.prefix + "notificationPanelFooter				{ height: 20px; background: none repeat scroll 0 0 transparent; } \
				 ." + this.prefix + "notificationPanelFooterL				{ height: 100%; background-image: url('skin/layout/notes_left.png'); background-position: left top; background-repeat: repeat-y; border: 0 none; } \
				 ." + this.prefix + "notificationPanelFooterR				{ height: 21px; background-image: url('skin/layout/notes_br.png'); background-position: right bottom; background-repeat: no-repeat; } \
				 ." + this.prefix + "notificationPanelFooterM				{ background-color: #F7E7C5; border-bottom: 3px solid #D2A860; border-left: 2px solid #D2A860; margin: 0 23px 0 3px; padding: 3px 0 2px 3px; font-size: 77%; } \
				 ." + this.prefix + "notificationPanelClose					{ cursor: pointer; position: absolute; top: 12px; right: 8px; width: 17px; height: 17px; background-image: url('skin/layout/notes_close.png'); } \
				 ." + this.prefix + "notificationPanelButtonWrapper			{ bottom: -4px; position: absolute; margin: 10px auto; width: 100%; text-align: center; } \
				 ." + this.prefix + "notificationPanelButton				{ background: url('skin/input/button.png') repeat-x scroll 0 0 #ECCF8E; border-color: #C9A584 #5D4C2F #5D4C2F #C9A584; border-style: double; border-width: 3px; cursor: pointer; display: inline; font-weight: bold; margin: 0px 5px; padding: 2px 10px; text-align: center; font-size: 12px; width: 100px; } \
				 ." + this.prefix + "notificationPanelButton:hover			{ color: #B3713F; } \
				 ." + this.prefix + "notificationPanelButton:active			{ border-color: #5D4C2F #C9A584 #C9A584 #5D4C2F; border-style: double; border-width: 3px; padding: 3px 10px 1px; } \
				 ." + this.prefix + "notificationPanelButtonConfirm			{  } \
				 ." + this.prefix + "notificationPanelButtonAbort			{  }",
				'notification', true
			);
		
		// Add the buttons for toggle buttons used styles.
		this.addStyle(
				".minimizeImg, .maximizeImg		{ background: url('skin/interface/window_control_sprite.png') no-repeat scroll 0 0 transparent; cursor: pointer; display: block; height: 18px; width: 18px; } \
				 .minimizeImg					{ background-position: -144px 0; } \
				 .minimizeImg:hover				{ background-position: -144px -19px; } \
				 .maximizeImg					{ background-position: -126px 0; } \
				 .maximizeImg:hover				{ background-position: -126px -19px; }",
				'toggleShowHideButton', true
			);
		
		// Fixe the tab scroll to prevent the scroll left / right button to have a widht more than 40px.
		this.addStyle(
				"#container .tabmenu .tab													{ width: unset; } \
				 #container .tabmenu .tab.tabPrevPage, #container .tabmenu .tab.tabNextPage	{ width: 40px; }",
				'fixTabScroll', true
			);
		
		/*---------------------------------------------------------------------*
		 * Types for documentation purposes (e.g. callback functions, objects) *
		 *---------------------------------------------------------------------*/
		
		/**
		 * Confirm / abort callback for a notification with an input text field.
		 * 
		 * @callback	IkariamCore~myGM~ConfirmAbortWithInput
		 * 
		 * @param	{Element}	textarea
		 *   The textarea element which contains the user input.
		 */
		
		/**
		 * Confirm / abort callback for a notification without an input text field.
		 * 
		 * @callback	IkariamCore~myGM~ConfirmAbortWithoutInput
		 */
		
		/**
		 * Callbacks to confirm / abort a notification.
		 * 
		 * @typedef	IkariamCore~myGM~NotificationCallbacks
		 * 
		 * @property	{?(IkariamCore~myGM~ConfirmAbortWithInput|IkariamCore~myGM~ConfirmAbortWithoutInput)}	[confirm=close panel]	- The callback for the confirm button.
		 * @property	{?(IkariamCore~myGM~ConfirmAbortWithInput|IkariamCore~myGM~ConfirmAbortWithoutInput)}	[abort=close panel]	- The callback for the abort button.
		 */
		
		/**
		 * Callbacks for the buttons of the notification panel.
		 * 
		 * @typedef	IkariamCore~myGM~NotificationButtonCallbacks
		 * 
		 * @private
		 * @inner
		 * 
		 * @mixes	IkariamCore~myGM~NotificationCallbacks
		 * 
		 * @property	{IkariamCore~myGM~ConfirmAbortWithoutInput}		close	- The callback to close the panel.
		 */
		
		/**
		 * Options for the notification body.
		 * 
		 * @typedef	{Object}	IkariamCore~myGM~NotificationBodyOptions
		 * 
		 * @property	{boolean}	[textarea=false]	- If the body should be a textarea.
		 * @property	{boolean}	[readonly=false]	- If the textarea is readonly. Only used if textarea=true.
		 * @property	{boolean}	[autofocus=false]	- If the textarea content is autoselected on click. Only used if textarea=true.
		 */
		
		/**
		 * Text for the notification body. Either body or top AND bottom must be specified.
		 * 
		 * @typedef	{Object}	IkariamCore~myGM~NotificationBodyText
		 * 
		 * @property	{?String}	[body]		- Text if there is only one text in the body.
		 * @property	{?String}	[top]		- Upper text if the body is splitted.
		 * @property	{?String}	[bottom]	- Lower text if the body is splitted.
		 */
		
		/**
		 * Text for the notification panel buttons.
		 * 
		 * @typedef	{Object}	IkariamCore~myGM~NotificationButtonsText
		 * 
		 * @property	{?String}	[confirm=core.notification.button.confirm]	- Text for the confirm button.
		 * @property	{?String}	[abort=core.notification.button.abort]		- Text for the abort button.
		 */
		
		/**
		 * Texts for the notification panel.
		 * 
		 * @typedef	IkariamCore~myGM~NotificationText
		 * 
		 * @mixes	IkariamCore~myGM~NotificationBodyText
		 * @mixes	IkariamCore~myGM~NotificationButtonsText
		 * 
		 * @property	{?String}	[header=core.notification.header]	- The notification panel header.
		 */
		
		/**
		 * CSS Styles for an element.<br>
		 * Structure of the array: <code>[ [ &lt;styleName&gt;, &lt;styleValue&gt; ] ]</code>
		 * 
		 * @typedef	{Array.<Array.<String>>}	IkariamCore~myGM~CssStyles
		 */
		
		/**
		 * Options for a new element.
		 * 
		 * @typedef	{Object}	IkariamCore~myGM~NewElementOptions
		 * 
		 * @property	{String}	[id]		- The id of the element.
		 * @property	{String}	[class]		- A single class of the element.
		 * @property	{String[]}	[classes]	- Multiple classes for the element.
		 * @property	{IkariamCore~myGM~CssStyles}	[style]	- Styles for the element.
		 * @property	{function}	[click]		- An onclick callback.
		 * @property	{function}	[focus]		- An onfocus callback.
		 * @property	{String}	[*]			- All other element options.
		 */
		
		/**
		 * Define if id and classes should have a prefix.
		 * 
		 * @typedef	{Object}	IkariamCore~myGM~HasPrefix
		 * 
		 * @property	{boolean}	[id=true]		- If the id should have a prefix.
		 * @property	{boolean}	[classes=false]	- If the classes should have a prefix.
		 */
		
		/**
		 * Data for a new checkbox.
		 * 
		 * @typedef	{Object}	IkariamCore~myGM~NewCheckboxData
		 * 
		 * @property	{String}	id		- The id of the checkbox.
		 * @property	{String}	label	- The label of the checkbox.
		 * @property	{boolean}	checked	- If the checkbox is checked.
		 */

		/**
		 * Data set consisting of value and label.
		 * 
		 * @typedef	{Object}	IkariamCore~myGM~ValueAndLabel
		 * 
		 * @property	{(String|int)}	value	- The value of the data set.
		 * @property	{String}		label	- The label of the data set.
		 */
		
		/**
		 * Callback for a forEach iteration on an object.
		 * 
		 * @callback	IkariamCore~myGM~ForEachCallback
		 * 
		 * @param	{String}	propertyKey
		 *   The key of the property of the object.
		 * @param	{*}			propertyValue
		 *   The value of the property.
		 */
	}
	
	/**
	 * myGM for cross-browser compatibility of the GM_* functions. (use myGM.* instead of GM_*)<br>
	 * Also there are general used functions stored.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~myGM
	 */
	this.myGM = new myGM();
	
	go_self.con.logTimeStamp('IkariamCore.myGM created');
	
	/**
	 * Instantiate a new set of localization functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Functions for localizing the script.
	 */
	function Language() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Whether the Language module was initialized.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */
		_gb_initialized = false;
		
		/**
		 * Mapping for countries where the used language is the same, but the url is different (e.g. us -> USA and en -> Great Britain)
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object.<String, String>
		 */
		var _go_codeMapping = {
			ar: 'es',
			br: 'pt',
			mx: 'es',
			us: 'en'
		};
		
		/**
		 * Default Ikariam language code for this server.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default	en
		 * 
		 * @type	String
		 */
		var _gs_ikaCode = (function() {
			var rs_uri = top.location.host.match(/^s[0-9]+-([a-zA-Z]+)\.ikariam\.gameforge\.com$/)[1];
			
			if(!!_go_codeMapping[rs_uri] === true)
				rs_uri = _go_codeMapping[rs_uri];
			
			if(!rs_uri === true)
				rs_uri = 'en';
			
			return rs_uri;
		})();
		
		/**
		 * Default language code - code of language registered as default.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default	en
		 * 
		 * @type	String
		 */
		var _gs_defaultCode = 'en';
		
		/**
		 * Used language code.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default	en
		 * 
		 * @type	String
		 */
		var _gs_usedCode = _gs_defaultCode;
		
		/**
		 * Used language texts. Used if a translation is requested.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	json
		 */
		var _go_usedText = {};
		
		/**
		 * Default language text. To be used if the used language is not available.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	json
		 */
		var _go_defaultText = {};
		
		/**
		 * All languages which are registered with their storage type (resource, in-script-object).
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object.<String, Array.<IkariamCore~Language~LanguageSettings>>
		 */
		var _go_registeredLangs = {};
		
		/**
		 * "Translation" of all possible language codes to the corresponding language.
		 * 
		 * @TODO	Translate when required!
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object.<String, String>
		 */
		var _go_codeTranslation = {
			ae: 'Arabic',		// ... Arabic
			bg: 'Bulgarian',	// ... Bulgarian
			cz: 'Czech',		// ... Czech
			de: 'Deutsch',		// German
			dk: 'Danish',		// ... Danish
			en: 'English',		// English
			es: 'Español',		// Spanish
			fi: 'Finish',		// ... Finish
			fr: 'Français',		// French
			gr: 'Ελληνικά',		// Greek
			hu: 'Hungarian',	// ... Hungarian
			il: 'Hebrew',		// ... Hebrew
			it: 'Italiano',		// Italian
			lt: 'Lithuanian',	// ... Lithuanian
			lv: 'Latviešu',		// Latvian
			nl: 'Nederlands',	// Dutch
			no: 'Norwegian',	// ... Norwegian
			pl: 'Polski',		// Polish
			pt: 'Portugese',	// ... Portugese
			ro: 'Romanian',		// ... Romanian
			rs: 'Serbian',		// ... Serbian
			ru: 'Русский',		// Russian
			se: 'Svenska',		// Swedisch
			si: 'Slovene',		// ... Slovene
			sk: 'Slovak',		// ... Slovak
			tr: 'Türkçe',		// Turkish
			tw: 'Chinese',		// ... Chinese
		};
		
		/**
		 * Initialize the core language files.
		 * 
		 * @private
		 * @inner
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the languages are set.
		 */
		var _initialize = async function() {
			var la_language = [
				{ code: 'de', settings: {"settings": {"kiloSep":".","decSep":",","ltr":true}}, translations: {"core": {"update": {"notPossible": {"header": "Keine Aktualisierung möglich","text": "Es ist nicht möglich, nach Aktualisierungen für %$1 zu suchen. Bitte prüfe selbst auf Aktualisierungen für das Script. Die Momentan installierte Version ist %$2. Diese Nachricht wird in vier Wochen wieder angezeigt."},"possible": {"header": "Aktualisierung verfügbar","text": "Es ist eine Aktualisierung für %$1 verfügbar.<br>Zur Zeit ist Version %$2 installiert. Die neueste Version ist %$3.","history": "Versionshistorie","noHistory": "Keine Versionshistorie verfügbar.","type": {"feature": "Neuerung(en)","change": "Änderung(en)","bugfix": "Bugfix(e)","language": "Sprache(n)","core": "Ikariam Core","other": "Sonstige"},"button": {"install": "Installieren","hide": "Verbergen"}},"noNewExists": {"header": "Keine Aktualisierung verfügbar","text": "Es ist keine Aktualisierung für %$1 verfügbar. Die neueste Version %$2 ist installiert."}},"notification": {"header": "Informationen","button": {"confirm": "OK","abort": "Abbrechen"}},"optionPanel": {"save": "Einstellungen speichern!","section": {"update": {"title": "Aktualisierungen","label": {"interval": {"description": "In folgenden Zeitabständen nach Aktualisierungen suchen:","option": {"never": "Nie","hour": "1 Stunde","hour12": "12 Stunden","day": "1 Tag","day3": "3 Tage","week": "1 Woche","week2": "2 Wochen","week4": "4 Wochen"}},"notifyLevel": {"description": "Benachrichtige über neue Versionen bis zu diesem Level:","option": {"all": "Alle Versionen","major": "Hauptversionen (x)","minor": "Nebenversionen (x.x)","patch": "Revisionen (x.x.x)"}},"manual": "Nach Aktualisierungen für \"%$1\" suchen!"}},"optionPanelOptions": {"title": "Optionsfenster","label": {"import": "Optionen importieren","export": "Optionen exportieren","reset": "Optionen zurücksetzen","importNotification": {"header": "Importieren","explanation": "Füge das JSON zum importieren in das Feld unten ein und klicke \"OK\". Die Optionen werden dann importiert. Bitte sorge dafür, dass kein Zeichen fehlt, da sonst der Import nicht funktionieren wird."},"exportNotification": {"header": "Exportieren","explanation": "Bitte kopiere das JSON unten. Du kannst es danach auf jedem beliebigen PC importieren, um die Optionen dort zu erhalten. Bitte sorge dafür, dass kein Zeichen fehlt, da sonst der Import nicht funktionieren wird."},"importError": {"header": "Fehler beim importieren!","explanation": "Während dem importieren der Optionen trat ein Fehler auf. Es scheint, dass das JSON fehlerhaft ist. Bitte validiere es (beispielsweise mit <a href=\"http://jsonlint.com/\" target=\"_blank\">JSONLint</a>)."},"resetNotification": {"header": "Optionen zurücksetzen","explanation": "Bist du dir sicher, dass du alle Optionen auf ihren Standardwert zurücksetzen möchtest?"}}}}}},"general": {"successful": "Dein Befehl wurde ausgeführt.","error": "Es gab einen Fehler in deiner Anfrage!","fold": "Einklappen","expand": "Ausklappen","ctrl": "Strg","alt": "Alt","shift": "Umschalt","yes": "Ja","no": "Nein"}} },
				{ code: 'gr', settings: {"settings": {"kiloSep":",","decSep":".","ltr":true}}, translations: {"core": {"update": {"notPossible": {"header": "Καμιά διαθέσιμη Ενημέρωση","text": "Δεν είναι δυνατός ο έλεγχος ενημερώσεων για τον κώδικα %$1. Ελέγξτε χειροκίνητα για Ενημερώσεις για τον κώδικα. Η πραγματικά εγκατεστημένη έκδοση είναι η %$2. Αυτό το μήνυμα θα εμφανιστεί ξανά σε 4 εβδομάδες."},"possible": {"header": "Διαθέσιμη Ενημέρωση","text": "Υπάρχει μια διαθέσιμη ενημέρωση για τον κώδικα %$1.<br>Προς το παρόν, υπάρχει εγκατεστημένη η έκδοση %$2. Η νεότερη ΄έκδοση είναι η %$3.","history": "Ιστορικό Έκδοσης","noHistory": "Κανένα ιστορικό έκδοσης διαθέσιμο.","type": {"feature": "Χαρακτηριστικό(ά)","change": "Αλλαγή(ές)","bugfix": "Διόρθωση(εις) σφάλματος(ων)","language": "Γλώσσα(ες)","core": "Πυρήνας Ikariam","other": "Άλλο"},"button": {"install": "Εγκατάσταση","hide": "Απόκρυψη"}},"noNewExists": {"header": "Καμιά διαθέσιμη Ενημέρωση","text": "Δεν υπάρχει καμιά νέα έκδοση διαθέσιμη για τον κώδικα %$1. Η νεότερη έκδοση %$2 είναι εγκατεστημένη."}},"notification": {"header": "Ειδοποίηση κώδικα","button": {"confirm": "Εντάξει","abort": "Παραίτηση"}},"optionPanel": {"save": "Αποθήκευση ρυθμίσεων!","section": {"update": {"title": "Ενημέρωση","label": {"interval": {"description": "Χρόνος επανάληψης για ενημερώσεις:","option": {"never": "Ποτέ","hour": "1 ώρα","hour12": "12 ώρες","day": "1 ημέρα","day3": "3 ημέρες","week": "1 εβδομάδα","week2": "2 εβδομάδες","week4": "4 εβδομάδες"}},"notifyLevel": {"description": "Ειδοποίηση για νέες εκδόσεις μέχρι αυτό το επίπεδο:","option": {"all": "Όλες οι εκδόσεις","major": "Βασική (x)","minor": "Δευτερεύουσα (x.x)","patch": "Διόρθωση (x.x.x)"}},"manual": "Αναζήτηση για ενημερώσεις για «%$1»!"}},"optionPanelOptions": {"title": "Πίνακας Επιλογών","label": {"import": "Εισαγωγή των επιλογών του κώδικα","export": "Εξαγωγή των επιλογών κώδικα","reset": "Επαναφορά των επιλογών κώδικα","importNotification": {"header": "Εισαγωγή","explanation": "Εισάγετε το JSON σας για εισαγωγή στην περιοχή παρακάτω και πατήστε Εντάξει. Οι επιλογές θα εισαχθούν μετά. Σιγουρέψτε ότι κανένας χαρακτήρας δεν λείπει. Διαφορετικά, η εισαγωγή δεν θα λειτουργήσει."},"exportNotification": {"header": "Εξαγωγή","explanation": "Αντιγράψτε το JSON παρακάτω. Μπορείτε να το εισάγετε σε οποιοδήποτε υπολογιστή για να μεταφέρετε τις επιλογές εκεί. Σιγουρέψτε ότι κανένας χαρακτήρας δεν λείπει. Διαφορετικά η εισαγωγή δεν θα λειτουργήσει."},"importError": {"header": "Σφάλμα εισαγωγής!","explanation": "Υπήρξε κάποιο σφάλμα κατά την εισαγωγή των επιλογών. Φαίνεται ότι το JSON είναι κατεστραμένο. Please Επικυρώστε το (π.χ. με το <a href=\"http://jsonlint.com/\" target=\"_blank\">JSONLint</a>)."},"resetNotification": {"header": "Επαναφορά επιλογών","explanation": "Θέλετε, σίγουρα, να επαναφέρετε όλες τις επιλογές του κώδικα στην προεπιλεγμένη τιμή;"}}}}}},"general": {"successful": "Η εντολή σας έχει δρομολογηθεί.","error": "Υπήρξε ένα σφάλμα στο αίτημα σας.","fold": "Δίπλωμα","expand": "Επέκταση","ctrl": "Ctrl","alt": "Alt","shift": "Shift","yes": "Ναι","no": "Όχι"}} },
				{ code: 'en', settings: {"settings": {"kiloSep":",","decSep":".","ltr":true}}, translations: {"core": {"update": {"notPossible": {"header":"No Update possible","text":"It is not possible to check for updates for %$1. Please check manually for Updates for the script. The actual installed version is %$2. This message will appear again in four weeks."},"possible": {"header":"Update available","text":"There is an update for %$1 available.<br>At the moment there is version %$2 installed. The newest version is %$3.","history":"Version History","noHistory":"No version history available.","type": {"feature":"Feature(s)","change":"Change(s)","bugfix":"Bugfix(es)","language":"Language(s)","core":"Ikariam Core","other":"Other"},"button": {"install":"Install","hide":"Hide"}},"noNewExists": {"header":"No Update available","text":"There is no new version for %$1 available. The newest version %$2 is installed."}},"notification": {"header":"Script notification","button": {"confirm":"OK","abort":"Abort"}},"optionPanel": {"save":"Save settings!","section": {"update": {"title":"Update","label": {"interval": {"description": "Interval to search for updates:","option": {"never":"Never","hour":"1 hour","hour12":"12 hours","day":"1 day","day3":"3 days","week":"1 week","week2":"2 weeks","week4":"4 weeks"}},"notifyLevel": {"description": "Notify on new script versions up to this level:","option": {"all":"All Versions","major":"Major (x)","minor":"Minor (x.x)","patch":"Patch (x.x.x)"}},"manual":"Search for updates for \"%$1\"!"}},"optionPanelOptions": {"title":"Option Panel","label": {"import":"Import the script options","export":"Export the script options","reset":"Reset the script options","importNotification": {"header":"Import","explanation":"Put your JSON to import in the area below and click OK. The options will be imported then. Please ensure that no character is missing. Otherwise the import will not work."},"exportNotification": {"header":"Export","explanation":"Please copy the JSON below. You can import it on any computer to get the options there. Please ensure that no character is missing. Otherwise the import will not work."},"importError": {"header":"Import error!","explanation":"There was an error while importing the options. It seems that the JSON is broken. Please validate it (e.g. with <a href=\"http://jsonlint.com/\" target=\"_blank\">JSONLint</a>)."},"resetNotification": {"header":"Reset options","explanation":"Are you sure to reset all script options to their default value?"}}}}}},"general": {"successful":"Your order has been carried out.","error":"There was an error in your request.","fold":"Fold","expand":"Expand","ctrl":"Ctrl","alt":"Alt","shift":"Shift","yes":"Yes","no":"No"}} },
				{ code: 'fr', settings: {"settings": {"kiloSep":",","decSep":".","ltr":true}}, translations: {"core": {"update": {"notPossible": {"header": "Pas de Mettre de jour possible","text": ""},"possible": {"header": "Update utilisable","text": "","history": "","noHistory": "","type": {"feature": "","change": "","bugfix": "","language": "langue(s)","core": "","other": "autre"},"button": {"install": "","hide": ""}},"noNewExists": {"header": "Pas de Mettre de jour utilisable","text": ""}},"notification": {"header": "","button": {"confirm": "OK","abort": "Abandon"}},"optionPanel": {"save": "","section": {"update": {"title": "Mettre de Jour","label": {"interval": {"description": "","option": {"never": "Jamais","hour": "1 heure","hour12": "12 heures","day": "1 jour","day3": "3 jour","week": "1 semaine","week2": "2 semaines","week4": "4 semaines"}},"notifyLevel": {"description": "","option": {"all": "","major": "","minor": "","patch": ""}},"manual": ""}},"optionPanelOptions": {"title": "","label": {"import": "","export": "","reset": "","importNotification": {"header": "","explanation": ""},"exportNotification": {"header": "","explanation": ""},"importError": {"header": "","explanation": ""},"resetNotification": {"header": "","explanation": ""}}}}}},"general": {"successful": "","error": "","fold": "","expand": "","ctrl": "Ctrl","alt": "Alt","shift": "","yes": "Oui","no": "Non"}} },
				{ code: 'it', settings: {"settings": {"kiloSep":",","decSep":".","ltr":true}}, translations: {"core": {"update": {"notPossible": {"header": "niente da aggiornare","text": "Non è possibile verificare la disponibilità di aggiornamenti per %$1. Si prega di controllare manualmente gli aggiornamenti per lo script. La versione attuale installata è %$2. Questo messaggio apparirà di nuovo in quattro settimane."},"possible": {"header": "Aggiornamento disponibile","text": "C'è un aggiornamento per %$1 disponibile. <br> Al momento è la versione %$2 installato. L'ultima versione è %$3.","history": "Cronologia delle versioni","noHistory": "","type": {"feature": "","change": "Cambiamenti","bugfix": "","language": "lingue","core": "Ikariam Core","other": "altri"},"button": {"install": "installare","hide": "nascondere"}},"noNewExists": {"header": "Nessun aggiornamento disponibile","text": "Non ci sono nuova versione disponibile per %$1. La nuova versione %$2 è installato."}},"notification": {"header": "Informazioni degli script","button": {"confirm": "OK","abort": "abortire"}},"optionPanel": {"save": "Salva impostazioni!","section": {"update": {"title": "Aggiornamenti","label": {"interval": {"description": "Intervallo per la ricerca di aggiornamenti:","option": {"never": "mai","hour": "1 ora","hour12": "12 ore","day": "1 giorno","day3": "3 giorni","week": "1 settimana","week2": "2 settimane","week4": "4 settimane"}},"notifyLevel": {"description": "Notifica nuove versioni di script fino a questo livello:","option": {"all": "tutte le versioni","major": "Versione principale (x)","minor": "Versioni minori (x.x)","patch": ""}},"manual": "Cerca aggiornamenti per \"%$1\"!"}},"optionPanelOptions": {"title": "Finestra delle opzioni","label": {"import": "Importare le opzioni di script","export": "le opzioni di esportazione degli script","reset": "Aggiorna le opzioni di script","importNotification": {"header": "importazione","explanation": "Metti il JSON importare nella zona sotto e fare clic su OK. Le opzioni saranno importati poi. Fate attenzione che non manca di carattere. In caso contrario, l'importazione non funziona."},"exportNotification": {"header": "esportazione","explanation": "Si prega di copiare il JSON sotto. È possibile importare su qualsiasi computer per ottenere le opzioni lì. Assicurarsi fatto nessun personaggio manca. In caso contrario, l'importazione non funziona."},"importError": {"header": "","explanation": "Si è verificato un errore durante l'importazione delle opzioni. Sembra che il JSON è rotto. Si prega di confermare che (ad esempio con  <a href=\"http://jsonlint.com/\" target=\"_blank\">JSONLint</a>)."},"resetNotification": {"header": "Azzera opzioni","explanation": "Sei sicuro di voler ripristinare tutte le opzioni di script per il loro valore di default?"}}}}}},"general": {"successful": "Tuo ordine è stato effettuato","error": "C'è stato un errore nella tua richiesta.","fold": "","expand": "","ctrl": "","alt": "","shift": "","yes": "sì","no": "No"}} },
				{ code: 'lv', settings: {"settings": {"kiloSep":",","decSep":".","ltr":true}}, translations: {"core": {"update": {"notPossible": {"header": "Nav iespējams atjaunināt","text": "Nav iespējams pārbaudīt atjauninājumu pieejamību %$1. Lūdzu, pārbaudiet manuāli skripta atjauninājumus. Pašlaik ir uzstādīta versija %$2. Šis paziņojums atkal parādīsies pēc četrām nedēļām."},"possible": {"header": "Ir pieejams atjauninājums","text": "Ir pieejams %$1 atjauninājums.<br>Pašlaik ir uzstādīta versija %$2. Jaunākā versija ir %$3.","history": "Versijas vēsture:","noHistory": "","type": {"feature": "Jaunumi","change": "Izmaiņas","bugfix": "Kļūdu labojumi","language": "Valodas","core": "Ikariam Core","other": "Citi"},"button": {"install": "Instalēt","hide": "Paslēpt"}},"noNewExists": {"header": "Nav pieejams atjauninājums","text": "Nav pieejama jauna versija %$1. Jaunākā versija %$2 ir jau uzstādīta."}},"notification": {"header": "Skripta paziņojumi","button": {"confirm": "OK","abort": "Atcelt"}},"optionPanel": {"save": "Saglabāt iestatījumus!","section": {"update": {"title": "Atjauninājumi","label": {"interval": {"description": "Intervāls starp atjauninājumu meklēšanu:","option": {"never": "Nekad","hour": "1 stunda","hour12": "12 stundas","day": "1 diena","day3": "3 dienas","week": "1 nedēļa","week2": "2 nedēļas","week4": "4 nedēļas"}},"notifyLevel": {"description": "","option": {"all": "Visas versijas","major": "","minor": "","patch": ""}},"manual": "Meklēt atjauninājumus \"%$1\"!"}},"optionPanelOptions": {"title": "Opcijas","label": {"import": "Importēt skripta opcijas","export": "Eksportēt skripta opcijas","reset": "Atiestatīt skripta opcijas","importNotification": {"header": "Importēt","explanation": ""},"exportNotification": {"header": "Eksportēt","explanation": ""},"importError": {"header": "Importēšanas kļūda!","explanation": ""},"resetNotification": {"header": "Atstatīšanas opcijas","explanation": ""}}}}}},"general": {"successful": "Jūsu rīkojums ir izpildīts.","error": "Jūsu veiktajā pieprasījumā radās kļūda.","fold": "Samazināt","expand": "Paplašināt","ctrl": "Ctrl","alt": "Alt","shift": "Shift","yes": "Jā","no": "Nē"}} },
				{ code: 'ru', settings: {"settings": {"kiloSep":",","decSep":".","ltr":true}}, translations: {"core": {"update": {"notPossible": {"header": "У Вас последняя версия скрипта","text": "Невозможно проверить наличие обновлений для %$1. Пожалуйста, проверьте наличие обновлений для скрипта вручную. У Вас установлена версия %$2. Это сообщение появится снова в течение четырех недель."},"possible": {"header": "Доступно обновление","text": "Существует обновления для версии %$1.<br>На данный момент установлена версия %$2. Новейшая версия - %$3.","history": "История версий","noHistory": "Нет истории версий.","type": {"feature": "Особенность(и)","change": "Изменение(я)","bugfix": "Исправление(я)","language": "Язык(и)","core": "Ikariam Core","other": "Другое"},"button": {"install": "Установить","hide": "Скрыть"}},"noNewExists": {"header": "Нет доступных обновлений","text": "У Вас последняя версия скрипта %$1. Новейшая версия - %$2 уже установлена."}},"notification": {"header": "Уведомление скрипта","button": {"confirm": "OK","abort": "Отменить"}},"optionPanel": {"save": "Сохранить настройки!","section": {"update": {"title": "Обновить","label": {"interval": {"description": "Интервал поиска обновлений:","option": {"never": "Никогда","hour": "1 час","hour12": "12 часов","day": "1 день","day3": "3 дня","week": "1 неделя","week2": "2 недели","week4": "4 недели"}},"notifyLevel": {"description": "Уведомлять о новых версиях скрипта до этого уровня:","option": {"all": "Все версии","major": "Мажорная версия (x)","minor": "Минорная версия (x.x)","patch": "Патч или заплатка (x.x.x)"}},"manual": "Поиск обновлений для \"%$1\"!"}},"optionPanelOptions": {"title": "Панель настроек","label": {"import": "Импорт настроек скрипта","export": "Экспорт настроек скрипта","reset": "Сброс настройки скрипта","importNotification": {"header": "Импорт","explanation": "Для импорта настроек скопируйте содержание JSON файла-импорта в поле ниже и нажмите кнопку ОК. Пожалуйста, проверьте, что бы ни один символ не был пропущен. В противном случае импорт работать не будет."},"exportNotification": {"header": "Экспорт","explanation": "Пожалуйста, скопируйте текст из поля ниже в JSON файл-импорта. Вы можете импортировать его на любом компьютере, чтобы восстановить Ваши настройки. Пожалуйста, проверьте, что бы ни один символ не был пропущен. В противном случае импорт работать не будет."},"importError": {"header": "Ошибка импорта","explanation": "Во время импорта настроек произошла ошибка. Возможно JSON файл-импорта поврежден. Пожалуйста, проверьте его (например, с помощью <a href=\"http://jsonlint.com/\" target=\"_blank\">JSONLint</a>)."},"resetNotification": {"header": "Сброс настроек","explanation": "Вы уверены, что хотите сбросить настройки скрипта к их значению по умолчанию?"}}}}}},"general": {"successful": "Ваш приказ был выполнен.","error": "Ошибка в запросе.","fold": "Свернуть","expand": "Развернуть","ctrl": "Ctrl","alt": "Alt","shift": "Shift","yes": "Да","no": "Нет"}} },
				{ code: 'tr', settings: {"settings": {"kiloSep":",","decSep":".","ltr":true}}, translations: {"core": {"update": {"notPossible": {"header": "","text": ""},"possible": {"header": "Güncelleştirme mevcut","text": "","history": "Sürüm Geçmişi","noHistory": "Versiyon geçmişi bulunmamakta.","type": {"feature": "Özellik(ler)","change": "Değişiklik(ler)","bugfix": "","language": "Dil(ler)","core": "","other": "Diğer"},"button": {"install": "Kur","hide": "Gizle"}},"noNewExists": {"header": "","text": "Versiyon %$1 için yeni sürüm bulunmamaktadır. En yeni sürüm %$2 yüklendi."}},"notification": {"header": "","button": {"confirm": "ONAY","abort": "İptal et"}},"optionPanel": {"save": "Ayarları kaydet!","section": {"update": {"title": "Güncelle","label": {"interval": {"description": "","option": {"never": "","hour": "1 saat","hour12": "12 saat","day": "1 gün","day3": "3 gün","week": "1 hafta","week2": "2 hafta","week4": "4 hafta"}},"notifyLevel": {"description": "","option": {"all": "Tüm Versiyonlar","major": "","minor": "","patch": "Yama (x.x.x)"}},"manual": "\"%$1\" için güncelleştirmeleri ara!"}},"optionPanelOptions": {"title": "Ayarlar Paneli","label": {"import": "","export": "","reset": "","importNotification": {"header": "İçe aktar","explanation": ""},"exportNotification": {"header": "Dışa aktar","explanation": ""},"importError": {"header": "İçe aktarım hatası!","explanation": ""},"resetNotification": {"header": "","explanation": ""}}}}}},"general": {"successful": "","error": "İsteğiniz gerçekleştirilirken bir hata meydana geldi.","fold": "","expand": "Genişlet","ctrl": "Ctrl","alt": "","shift": "","yes": "Evet","no": "Hayır"}} }
			];
			for(var i = 0; i < la_language.length; i++) {
				await _addLanguageText(la_language[i].code, la_language[i].translations);
				await _addLanguageText(la_language[i].code, la_language[i].settings);
			}
			
			_gb_initialized = true;
		};
		
		/**
		 * Set the default language text for the script.
		 * 
		 * @private
		 * @inner
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the default text is set.
		 */
		var _setDefaultText = async function() {
			var lo_merged = await _mergeTexts(_gs_defaultCode);
			
			if(lo_merged.is_empty === true || lo_merged.not_set === true)
				_go_defaultText = {};
			else
				_go_defaultText = lo_merged;
		};
		
		/**
		 * Set the chosen language text for the script.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	is_languageCode
		 *   The code of the last selected language.
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the language text is set.
		 */
		var _setText = async function(is_languageCode) {
			if(is_languageCode === _gs_defaultCode)
				await _setDefaultText();
			
			if(!!_go_registeredLangs[_gs_ikaCode] === true)
				_gs_usedCode = _gs_ikaCode;
			
			if(is_languageCode === _gs_usedCode) {
				var lo_merged = await _mergeTexts(is_languageCode);
				
				if(lo_merged.is_empty === true || lo_merged.not_set === true)
					_go_usedText = _go_defaultText;
				else
					_go_usedText = lo_merged;
			}
		};
		
		/**
		 * Merges the texts for a given language.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	is_languageCode
		 *   The code of the language to merge.
		 *   
		 * @return	{Promise}
		 *   A Promise which resolves to the merged texts.
		 */
		var _mergeTexts = async function(is_languageCode) {
			var ro_merged = {};
			
			if(!!_go_registeredLangs[is_languageCode] === true) {
				var lb_initial = true;
				
				for(var i = 0; i < _go_registeredLangs[is_languageCode].length; i++) {
					var lo_element = _go_registeredLangs[is_languageCode][i];
					
					if(lo_element.type === 'resource') {
						var lo_resource = await go_self.myGM.getResourceParsed(lo_element.data.name, lo_element.data.url);
						
						if(!lo_resource.is_error === true) {
							ro_merged = go_self.myGM.merge(ro_merged, lo_resource);
							lb_initial = false;
						}
					} else if(lo_element.type === 'json') {
						ro_merged = go_self.myGM.merge(ro_merged, lo_element.data);
						lb_initial = false;
					}
				}
				
				if(lb_initial === true)
					ro_merged = { is_empty: true };
			} else {
				ro_merged = { not_set: true };
			}
			
			return ro_merged;
		};
		
		/**
		 * Return a string which is defined by its placeholder. If the string contains variables defined with %$nr,
		 * they are replaced with the content of the array at this index.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}		is_name
		 *   The name of the placeholder.
		 * @param	{?Array.<*>}	[ia_variables]
		 *   An array containing variables to replace the placeholders in the language string.
		 * @param	{?boolean}		[ib_useDefault=false]
		 *   If the default language should be used instead of the selected.
		 * 
		 * @return	{String}
		 *   The text.
		 */
		var _getText = function(is_name, ia_variables, ib_useDefault) {
			// Set the text to the placeholder.
			var rs_text = is_name;
	
			// Split the placeholder.
			var la_parts = is_name.split('.');
	
			if(!!la_parts === true) {
				// Set ls_text to the "next level".
				var ls_text = _go_usedText ? _go_usedText[la_parts[0]] : null;
				
				if(ib_useDefault === true)
					ls_text = _go_defaultText ? _go_defaultText[la_parts[0]] : null;
	
				// Loop over all parts.
				for(var i = 1; i < la_parts.length; i++) {
					// If the "next level" exists, set txt to it.
					if(ls_text && typeof ls_text[la_parts[i]] != 'undefined') {
						ls_text = ls_text[la_parts[i]];
					} else {
						ls_text = rs_text;
						break;
					}
				}
	
				// If the text type is not an object, a function or undefined.
				if(typeof ls_text != 'object' && typeof ls_text != 'function' && typeof ls_text != 'undefined')
					rs_text = ls_text + '';
				
				if(!!ia_variables === true && Array.isArray(ia_variables) === true) {
					for(var i = 0; i < ia_variables.length; i++) {
						var lr_regex = new RegExp('%\\$' + (i + 1), 'g');
						rs_text = rs_text.replace(lr_regex, ia_variables[i] + '');
					}
				}
			}
			
			if(ib_useDefault === true) {
				return rs_text;
			}
			
			if(rs_text == is_name || rs_text == "") {
				go_self.con.info('Language.getText: No translation available for "' + is_name + '" in language ' + go_self.Language.usedLanguageCode);
				rs_text = _getText(is_name, ia_variables, true);
			}
			
			return rs_text;
		};
		
		/**
		 * Registers a new language without resource usage.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	is_languageCode
		 *   The code of the language.
		 * @param	{json}		io_json
		 *   JSON with the language data.
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the language text is added.
		 */
		var _addLanguageText = async function(is_languageCode, io_json) {
			if(!_go_registeredLangs[is_languageCode] === true)
				_go_registeredLangs[is_languageCode] = [];
			
			_go_registeredLangs[is_languageCode].push({
				type:	'json',
				data:	io_json
			});
			
			await _setText(is_languageCode);
		};
		
		/**
		 * Registers a new language resource.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	is_languageCode
		 *   Code of the language.
		 * @param	{String}	is_resourceName
		 *   Name of the resource.
		 * @param	{String}	is_resourceURL
		 *   URL, if resources are not supported.
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the language resource is set.
		 */
		var _registerLanguageResource = async function(is_languageCode, is_resourceName, is_resourceURL) {
			if(!_go_registeredLangs[is_languageCode] === true)
				_go_registeredLangs[is_languageCode] = [];
			
			_go_registeredLangs[is_languageCode].push({
				type:	'resource',
				data:	{ name: is_resourceName, url: is_resourceURL }
			});
			
			await _setText(is_languageCode);
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Code of the used language.
		 * 
		 * @instance
		 * @readonly
		 * @name	 usedLanguageCode
		 * @memberof IkariamCore~Language
		 * 
		 * @type	{String}
		 */
		Object.defineProperty(this, 'usedLanguageCode', { get: function() {
			return _gs_usedCode;
		} });
		
		/**
		 * Name of the used language.
		 * 
		 * @instance
		 * @readonly
		 * @name	 usedLanguageName
		 * @memberof IkariamCore~Language
		 * 
		 * @type	{String}
		 */
		Object.defineProperty(this, 'usedLanguageName', { get: function() {
			return _go_codeTranslation[_gs_usedCode];
		} });
		
		/**
		 * Set the default language.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_languageCode
		 * 	 The code of the default language.
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the default language is set.
		 */
		this.setDefaultLanguage = async function(is_languageCode) {
			if(_gb_initialized === false) {
				await _initialize();
			}
			
			_gs_defaultCode = is_languageCode;
			
			await _setDefaultText();
		};
		
		/**
		 * Registers a new language without resource usage.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_languageCode
		 *   The code of the language.
		 * @param	{json}		io_json
		 *   JSON with the language data.
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the language text is added.
		 */
		this.addLanguageText = async function(is_languageCode, io_json) {
			if(_gb_initialized === false) {
				await _initialize();
			}
			
			await _addLanguageText(is_languageCode, io_json, false);
		};
		
		/**
		 * Registers a new language resource.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_languageCode
		 *   Code of the language.
		 * @param	{String}	is_resourceName
		 *   Name of the resource.
		 * @param	{String}	is_resourceURL
		 *   URL, if resources are not supported.
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the language resource is set.
		 */
		this.registerLanguageResource = async function(is_languageCode, is_resourceName, is_resourceURL) {
			if(_gb_initialized === false) {
				await _initialize();
			}
			
			await _registerLanguageResource(is_languageCode, is_resourceName, is_resourceURL, false);
		};
		
		/**
		 * Return a string which is defined by its placeholder. If the string contains variables defined with %$nr,
		 * they are replaced with the content of the array at this index.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_name
		 *   The name of the placeholder.
		 * @param	{?Array.<*>}	[ia_variables]
		 *   An array containing variables to replace the placeholders in the language string.
		 * 
		 * @return	{String}
		 *   The text.
		 */
		this.getText = function(is_name, ia_variables) {
			return _getText(is_name, ia_variables);
		};
		
		/**
		 * Synonymous function for {@link IkariamCore~Language#getText}.<br>
		 * 
		 * @instance
		 * 
		 * @see		IkariamCore~Language#getText
		 * 
		 * @param	{String}		is_name
		 *   The name of the placeholder.
		 * @param	{?Array.<*>}	[ia_variables]
		 *   An array containing variables to replace the placeholders in the language string.
		 *
		 * @return	{String}
		 *   The text.
		 */
		this.$ = function(is_name, ia_variables) {
			return this.getText(is_name, ia_variables);
		};
		
		/*---------------------------------------------------------------------*
		 * Types for documentation purposes (e.g. callback functions, objects) *
		 *---------------------------------------------------------------------*/
		
		/**
		 * Storage for language settings.
		 * 
		 * @callback	IkariamCore~Language~LanguageSettings
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	type
		 *   The type of the language resources. Currently supported: resource, json
		 * @param	{({name: String, url: String}|json)}	data
		 *   The data required to fetch the translations of this language.
		 */
	}
	
	/**
	 * Functions for localization of the script.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Language
	 */
	this.Language = new Language();
	
	this.con.logTimeStamp('IkariamCore.Language created');
	
	/**
	 * Instantiate a new set of Ikariam specific functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Ikariam specific functions.
	 */
	function Ikariam() {
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Name of the shown view (world, island, town).
		 * 
		 * @instance
		 * @readonly
		 * @name	 view
		 * @memberof IkariamCore~Ikariam
		 * 
		 * @type	{String}
		 */
		Object.defineProperty(this, 'view', { get: function() {
			var ls_viewId = go_self.myGM.$('body').id;
			
			if(ls_viewId == 'worldmap_iso')
				return 'world';
			
			if(ls_viewId == 'island')
				return 'island';
			
			if(ls_viewId == 'city')
				return 'town';
			
			return '';
		} });
		
		/**
		 * All possible view names.
		 * 
		 * @instance
		 * @readonly
		 * @name	 viewNames
		 * @memberof IkariamCore~Ikariam
		 * 
		 * @type	{Array.<String>}
		 */
		Object.defineProperty(this, 'viewNames', { get: function() {
			return ['world', 'island', 'town'];
		} });
		
		/**
		 * All possible resource names.
		 * 
		 * @instance
		 * @readonly
		 * @name	 resourceNames
		 * @memberof IkariamCore~Ikariam
		 * 
		 * @type	{Array.<String>}
		 */
		Object.defineProperty(this, 'resourceNames', { get: function() {
			return ['wood', 'wine', 'marble', 'glass', 'sulfur'];
		} });
		
		/**
		 * Code consisting of server id and country code.<br>
		 * Structure: <code>&lt;country-code&gt;_&lt;server-id&gt;</code>
		 * 
		 * @instance
		 * @readonly
		 * @name	 serverCode
		 * @memberof IkariamCore~Ikariam
		 * 
		 * @type	{String}
		 */
		Object.defineProperty(this, 'serverCode', { get: function() {
			var la_code = top.location.host.match(/^s([0-9]+)-([a-zA-Z]+)\.ikariam\.gameforge\.com$/);
			
			if(!!la_code)
				return la_code[2] + '_' + la_code[1];
			
			return 'undefined';
		} });
		
		/**
		 * Code consisting of player id, server id and country code.<br>
		 * Structure: <code>&lt;country-code&gt;_&lt;server-id&gt;_&lt;player-id&gt;</code>
		 * 
		 * @instance
		 * @readonly
		 * @name	 playerCode
		 * @memberof IkariamCore~Ikariam
		 * 
		 * @type	{String}
		 */
		Object.defineProperty(this, 'playerCode', { get: function() {
			var ls_serverCode	= this.serverCode;
			var ls_playerId		= go_self.ika.getModel().avatarId;
			
			if(ls_serverCode !== 'undefined')
				return ls_serverCode + '_' + ls_playerId;
			
			return 'undefined';
		} });
		
		/**
		 * Parses a string number to an int value.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_text
		 *   The number to format.
		 *
		 * @return	{int}
		 *   The formatted value.
		 */
		this.getInt = function(is_text) {
			var ls_text = is_text + '';
			return parseInt(ls_text.replace(/(\.|,)/g, ''));
		};
		
		/**
		 * Formats a number to the format which is used in Ikariam.
		 *
		 * @param	{int}			ii_number
		 *   The number to format.
		 * @param	{?(boolean|Object.<String, boolean>)}	[im_addColor={ positive: false, negative: true }]
		 *   If the number should be colored.
		 * @param	{?boolean}		[ib_usePlusSign=false]
		 *   If a plus sign should be used for positive numbers.
		 * 
		 * @return	{String}
		 *   The formated number.
		 */
		this.formatToIkaNumber = function(ii_number, im_addColor, ib_usePlusSign) {
			var rs_text = ii_number + '';
	
			// Set a seperator every 3 digits from the end.
			rs_text = rs_text.replace(/(\d)(?=(\d{3})+\b)/g, '$1' + go_self.Language.$('settings.kiloSep'));
	
			if(ii_number < 0 && !(im_addColor == false || (im_addColor && im_addColor.negative == false))) {
				rs_text = '<span class="red bold">' + rs_text + '</span>';
			}
	
			if(ii_number > 0) {
				rs_text = (ib_usePlusSign ? '+' : '') + rs_text;
	
				if(!!(im_addColor == true || (im_addColor && im_addColor.positive == true))) {
					rs_text = '<span class="green bold">' + rs_text + '</span>';
				}
			}
	
			return rs_text;
		};
		
		/**
		 * Shows a hint to the user.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_located
		 *   The location of the hint.<br>
		 *   Possible values: <code>cityAdvisor</code>, <code>militaryAdvisor</code>, <code>researchAdvisor</code>, <code>diplomacyAdvisor</code>, <code>clickedElement</code>, <code>committedElement</code>
		 * @param	{String}	is_type
		 *   The type of the hint.<br>
		 *   Possible values: <code>confirm</code>, <code>error</code>, <code>neutral</code>, <code>followMouse</code>
		 * @param	{String}	is_text
		 *   The hint text.
		 * @param	{?String}	[is_bindTo=null]
		 *   The JQuery selector of the element the tooltip should be bound to (only used if location = committedElement).
		 * @param	{?boolean}	[ib_hasAutoWidth=false]
		 *   If the message has auto width (only used if type = followMouse).
		 */
		this.showTooltip = function(is_located, is_type, is_text, is_bindTo, ib_hasAutoWidth) {
			// Get the message location.
			var li_location = -1;
			switch(is_located) {
				case 'cityAdvisor':
					li_location = 1;
				  break;
	
				case 'militaryAdvisor':
					li_location = 2;
				  break;
	
				case 'researchAdvisor':
					li_location = 3;
				  break;
	
				case 'diplomacyAdvisor':
					li_location = 4;
				  break;
	
				case 'clickedElement':
					li_location = 5;
				  break;
	
				case 'committedElement':
					li_location = 6;
				  break;
			}
	
			// Get the message type.
			var li_type = -1;
			switch(is_type) {
				case 'confirm':
					li_type = 10;
				  break;
	
				case 'error':
					li_type = 11;
				  break;
	
				case 'neutral':
					li_type = 12;
				  break;
	
				case 'followMouse':
					li_type = 13;
				  break;
			}
			
			go_self.ika.controller.tooltipController.bindBubbleTip(li_location, li_type, is_text, null, is_bindTo, ib_hasAutoWidth);
		};
		
		/**
		 * Creates new checkboxes in Ikariam style and adds them to a parent.
		 * 
		 * @instance
		 * 
		 * @see	IkariamCore~myGM#addCheckboxes
		 * 
		 * @param	{Element}	ie_parent
		 *   The parent of the new checkboxes.
		 * @param	{Array.<IkariamCore~myGM~NewCheckboxData>}	ia_cbData
		 *   An array containing the data of each checkbox.
		 */
		this.addCheckboxes = function(ie_parent, ia_cbData) {
			go_self.myGM.addCheckboxes(ie_parent, ia_cbData);
			
			// Replace the checkboxes for better appearance.
			go_self.ika.controller.replaceCheckboxes();
		};
		
		/**
		 * Creates a new radio button group in ikariam style and adds it to a parent table.
		 * 
		 * @instance
		 * 
		 * @see	IkariamCore~myGM#addRadios
		 * 
		 * @param	{Element}		ie_parentTable
		 *   The parent table of the new select field.
		 * @param	{String}		is_name
		 *   The last part of the name of the radio button group.
		 * @param	{(String|int)}	im_checked
		 *   The value of the selected option.
		 * @param	{Array.<IkariamCore~myGM~ValueAndLabel>}	ia_options
		 *   An array with the names an values of the options.
		 * @param	{String}		is_labelText
		 *   The text of the select label.
		 */
		this.addRadios = function(ie_parentTable, is_name, im_checked, ia_options, is_labelText) {
			go_self.myGM.addRadios(ie_parentTable, is_name, im_checked, ia_options, is_labelText);
			
			// Replace the radiobuttons for better appearance.
			go_self.ika.controller.replaceCheckboxes();
		};
		
		/**
		 * Creates a new select field in ikariam style and adds it to a parent table.
		 * 
		 * @instance
		 * 
		 * @see	IkariamCore~myGM#addSelect
		 * 
		 * @param	{Element}		ie_parentTable
		 *   The parent table of the new select field.
		 * @param	{String}		is_id
		 *   The last part of the id of the select field.
		 * @param	{(String|int)}	im_selected
		 *   The value of the selected option.
		 * @param	{Array.<IkariamCore~myGM~ValueAndLabel>}	ia_options
		 *   An array with the names an values of the options.
		 * @param	{String}		is_labelText
		 *   The text of the select label.
		 */
		this.addSelect = function(ie_parentTable, is_id, im_selected, ia_options, is_labelText) {
			go_self.myGM.addSelect(ie_parentTable, is_id, im_selected, ia_options, is_labelText);
			
			// Replace the dropdown for better appearance.
			go_self.ika.controller.replaceDropdownMenus();
		};
	}
	
	/**
	 * Ikariam specific functions like converting a number from Ikariam format to int.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Ikariam
	 */
	this.Ikariam = new Ikariam();
	
	this.con.logTimeStamp('IkariamCore.Ikariam created');
	
	/**
	 * Instantiate the handler.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Handler for callbacks for processing DOM modification events.
	 */
	function Observer() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Storage for MutationObserver.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	MutationObserver
		 */ 
		var _go_MutationObserver = MutationObserver || WebKitMutationObserver;
		
		/**
		 * If the MutationObserver can be used or if an workaround must be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	boolean
		 */ 
		var _gb_canUseObserver = !!_go_MutationObserver;
		
		/**
		 * List to store the created observers.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object.<String, MutationObserver>
		 */
		var _go_observerList = {};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Adds a new observer for DOM modification events. If it is possible use MutationObservers. More about the 
		 * Mutation observer can be found here: {@link https://developer.mozilla.org/en-US/docs/DOM/MutationObserver Mutation Observer on MDN}.<br>
		 * If it's not possible to use a MutationObserver a DOMSubtreeModified or DOMAttrModified event listener is used.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id to store the observer.
		 * @param	{element}		ie_target
		 *   The target to observe.
		 * @param	{Array.<*>}		io_options
		 *   Options for the observer. All possible options can be found here: {@link https://developer.mozilla.org/en-US/docs/DOM/MutationObserver#MutationObserverInit MutationObserver on MDN}
		 * @param	{IkariamCore~Observer~MutationCallback}		if_callback
		 *   The callback for the mutation observer.<br>
		 * @param	{IkariamCore~Observer~NoMutationCallback}	if_noMutationObserverCallback
		 *   The callback if the use of the mutation observer is not possible and DOMAttrModified / DOMSubtreeModified is used instead.<br>
		 */
		this.add = function(is_id, ie_target, io_options, if_callback, if_noMutationObserverCallback) {
			var lo_observer;
			
			if(!!ie_target) {
				// If the MutationObserver can be used, do so.
				if(_gb_canUseObserver) {
					lo_observer = new _go_MutationObserver(if_callback);
					lo_observer.observe(ie_target, io_options);
					
					if(!_go_observerList[is_id]) {
						_go_observerList[is_id] = lo_observer;
					} else {
						go_self.con.warn('Observer.add: Id "' + is_id + '" already used for observer, please choose another one!');
					}
				
				// Otherwise use the event listener.
				} else {
					if(io_options.attributes) {
						ie_target.addEventListener('DOMAttrModified', if_noMutationObserverCallback, false);
					}
					
					if(io_options.characterData || io_options.childList || io_options.subtree) {
						ie_target.addEventListener('DOMSubtreeModified', if_noMutationObserverCallback, false);
					}
				}
			} else {
				go_self.con.warn('Observer.add: Observer target not defined! id: ' + is_id);
			}
		};
		
		/**
		 * Removes the observer given by the id. If the use of MutationObserver is not possible, this function can not be used.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_id
		 *   The id of the observer to remove.
		 */
		this.remove = function(is_id) {
			// If the observer is set.
			if(_gb_canUseObserver && _go_observerList[is_id]) {
				var lo_observer = _go_observerList[is_id];
				lo_observer.disconnect();
				
				delete _go_observerList[is_id];
			} else if(!_gb_canUseObserver) {
				go_self.con.warn('Observer.remove: It is not possible to use MutationObservers so Observer.remove can not be used.');
			}
		};
		
		/*---------------------------------------------------------------------*
		 * Types for documentation purposes (e.g. callback functions, objects) *
		 *---------------------------------------------------------------------*/
		
		/**
		 * The callback for the mutation observer.
		 * 
		 * @callback	IkariamCore~Observer~MutationCallback
		 * 
		 * @param	{MutationRecord}	mutations
		 *   The mutations which occurred.
		 */
		
		/**
		 * The callback if no mutation observer could be used.
		 * 
		 * @callback	IkariamCore~Observer~NoMutationCallback
		 */
	}
		
	/**
	 * Handler for callbacks after modification of DOM elements.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Observer
	 */
	this.Observer = new Observer();
	
	this.con.logTimeStamp('IkariamCore.Observer created');
	
	/**
	 * Instantiate a new set of refresh functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Handles functions that should run on Ikariam popups and after actualizations of the page data.
	 */
	function RefreshHandler() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Storage for the actualization callbacks.<br>
		 * Architecture:<br>
		 * <pre>_go_callbacks = {
		 *     popupId: {
		 *         callbackId: callback
		 *     }
		 * }</pre>
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object.<String, Object.<String, function>>
		 */
		var _go_callbacks = {};
		
		/**
		 * Handles the call of the callback functions for the actualization.
		 * 
		 * @private
		 * @inner
		 */
		var _handleActualisation = function() {
			// Run the callbacks for every reload.
			if(_go_callbacks['*']) {
				go_self.myGM.forEach(_go_callbacks['*'], function(is_key, if_callback) {
					if_callback();
				});
			}
			
			// If the script was already executed on this popup.
			var lb_isAlreadyExecutedPopup	= !!go_self.myGM.$('#' + go_self.myGM.prefix + 'alreadyExecutedPopup');
			var le_popup					= go_self.myGM.$('.templateView');
	
			if(le_popup && !lb_isAlreadyExecutedPopup) {
				// Run the callbacks for every popup opening.
				if(_go_callbacks['%']) {
					go_self.myGM.forEach(_go_callbacks['%'], function(is_key, if_callback) {
						if_callback();
					});
				}
				
				go_self.myGM.addElement('input', go_self.myGM.$('.mainContent', le_popup), { 'id': 'alreadyExecutedPopup', 'type': 'hidden' });
				
				var ls_popupId = le_popup ? le_popup.id.replace('_c', '') : '';
				
				if(_go_callbacks[ls_popupId]) {
					go_self.myGM.forEach(_go_callbacks[ls_popupId], function(is_key, if_callback) {
						if_callback();
					});
				}
			}
		};
		
		/**
		 * Callback for MutationObserver for calling the popup handler.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{MutationRecord}	la_mutations
		 *   All recorded mutations.
		 */
		var _callback = function(la_mutations) {
			la_mutations.forEach(function(io_mutation) {
				if(io_mutation.target.getAttribute('style').search(/display: none/i) != -1) {
					// Timeout to have access to GM_ funtions.
					setTimeout(_handleActualisation, 0);
				}
			});
		};
		
		/**
		 * Callback for calling the popup handler if the MutationObserver could not be used.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Event}	io_event
		 *   The called event.
		 */
		var _callbackNoMutationObserver = function(io_event) {
			if(io_event.attrChange == MutationEvent.MODIFICATION) {
				if(io_event.attrName.IC.trim() == 'style' && io_event.newValue.search(/display: none/i) != -1) {
					// Timeout to have access to GM_ funtions.
					setTimeout(_handleActualisation, 0);
				}
			}
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Add a new popup handler.
		 * 
		 * @instance
		 * 
		 * @param	{(String|Array.<String>)}	im_popupId
		 *   The id(s) of the popup(s) where the callback should be called (without '_c' at the end).<br>
		 *   Set to '*' for calling at every actualization, not just popups. Set to '%' for calling on every popup.
		 * @param	{String}	is_callbackId
		 *   The id of the callback. This must be unique for a popup.
		 * @param	{function}	if_callback
		 *   The callback which should be called.</code>
		 */
		this.add = function(im_popupId, is_callbackId, if_callback) {
			if(Array.isArray(im_popupId) === true) {
				for(var i = 0; i < im_popupId.length; i++) {
					this.add(im_popupId[i], is_callbackId, if_callback);
				}
				
				return;
			}
			
			if(!_go_callbacks[im_popupId]) {
				_go_callbacks[im_popupId] = {};
			}
			
			if(!_go_callbacks[im_popupId][is_callbackId]) {
				_go_callbacks[im_popupId][is_callbackId] = if_callback;
			} else {
				go_self.con.warn('RefreshHandler.add: Id set "' + im_popupId + '|' + is_callbackId + '" already used for observer, please choose another one!');
			}
		};
		
		/**
		 * Removes a popup handler.
		 * 
		 * @instance
		 * 
		 * @param	{(String|Array.<String>)}	im_popupId
		 *   The id(s) of the popup(s) where the callback was called (without '_c' at the end).
		 *   Set to '*' for callbacks on every actualisation, not just popups. Set to '%' for callbacks on every popup.
		 * @param	{String}	is_callbackId
		 *   The id of the callback. This must be unique for a popup.
		 */
		this.remove = function(im_popupId, is_callbackId) {
			if(Array.isArray(im_popupId) === true) {
				for(var i = 0; i < im_popupId.length; i++) {
					this.remove(im_popupId[i], is_callbackId);
				}
				
				return;
			}
			
			if(_go_callbacks[im_popupId] && _go_callbacks[im_popupId][is_callbackId]) {
				delete	_go_callbacks[im_popupId][is_callbackId];
			}
		};
		
		/*----------------------------------------------------*
		 * Register the observer and handle popups on startup *
		 *----------------------------------------------------*/
		
		// Add the observer for the popups.
		go_self.Observer.add('actualisationHandler', go_self.myGM.$('#loadingPreview'), { attributes: true, attributeFilter: ['style'] }, _callback, _callbackNoMutationObserver);
		
		// Execute the handler on popups which are shown on startup.
		setTimeout(_handleActualisation, 1000);
	}
	
	/**
	 * Handler for functions that should run on Ikariam popups.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~RefreshHandler
	 */
	this.RefreshHandler = new RefreshHandler();
	
	this.con.logTimeStamp('IkariamCore.RefreshHandler created');
	
	/**
	 * Instantiate a new set of options / settings functions.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Handles options the user can set, provides a "panel" for them to change them.
	 */
	function Options() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Enum for the level of specificity an option can have.
		 * 
		 * @private
		 * @inner
		 * @readonly
		 * 
		 * @enum	{IkariamCore~Options~SpecificityLevelEnum}
		 */
		var _gec_SpecificityLevel = Object.freeze({
			GLOBAL:	'1',
			SERVER:	'2',
			PLAYER:	'3'
		});
		
		/**
		 * Storage for option wrapper visibility.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Array.<boolean>
		 */
		var _go_optionWrapperVisibility = {};
		
		/**
		 * Storage for option wrappers.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object
		 */
		var _go_wrapper = {};
		
		/**
		 * Storage for option wrapper order. (Order in which the wrappers are shown)
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Array.<String>
		 */
		var _ga_wrapperOrder = new Array();
		
		/**
		 * Storage for the saved options. Gets filled on startup.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object
		 */
		var _go_savedOptions = null;
		
		/**
		 * Storage for the options.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	Object
		 */
		var _go_options = {};
		
		/**
		 * Storage for the id of the next <code>&lt;hr&gt;</code> element to create.
		 * 
		 * @private
		 * @inner
		 * 
		 * @type	int
		 */
		var _gi_lineId = 0;
		
		/**
		 * Returns the prefix string for a level of specificity.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{int}	ii_specificityLevel
		 *   The specificity level (One of values of {@link IkariamCore~Options~SpecificityLevelEnum})
		 *   
		 * @return	{String}
		 *   The prefix for this level of specificity.
		 */
		var _getSpecificityPrefix = function(ii_specificityLevel) {
			var rv_specificityPrefix = '';
			
			switch(ii_specificityLevel) {
				case _gec_SpecificityLevel.GLOBAL:
					rv_specificityPrefix = '';
				  break;
				
				case _gec_SpecificityLevel.SERVER:
					rv_specificityPrefix = go_self.Ikariam.serverCode;
				  break;
				
				case _gec_SpecificityLevel.PLAYER:
					rv_specificityPrefix = go_self.Ikariam.playerCode;
				  break;
			}
			
			return rv_specificityPrefix;
		};
		
		/**
		 * Add a element to a wrapper. ("generic function")
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}		is_type
		 *   The type of the element. Used for replacement - only elements with same type can be replaced.
		 * @param	{String}		is_id
		 *   The id of the element.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper for the element.
		 * @param	{(String|int)}	im_table
		 *   The id of the table in the wrapper where the element should be added.
		 * @param	{IkariamCore~Options~CreateCallback}	if_create
		 *   Callback to create the element.
		 * @param	{IkariamCore~Options~AddElementOptions}	io_options
		 *   Options for the element.
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the element is added.
		 */
		var _addElement = async function(is_type, is_id, is_wrapperId, im_table, if_create, io_options) {
			if(_go_savedOptions === null) {
				_go_savedOptions = await go_self.myGM.getValue('optionPanel_options', {});
			}
			
			if(_go_wrapper[is_wrapperId]) {
				if(_go_wrapper[is_wrapperId].elements[is_id] && io_options.replace !== true) {
					go_self.con.warn('Options.addElement: Element with id "' + is_id + '" already defined. Wrapper id: ' + is_wrapperId);
				} else if(io_options.replace === true && _go_wrapper[is_wrapperId].elements[is_id] && _go_wrapper[is_wrapperId].elements[is_id].type === is_type) {
					go_self.con.warn('Options.addElement: Element with id "' + is_id + '" not replaced. ' +
							'Different type (old: ' + _go_wrapper[is_wrapperId].elements[is_id].type + ', new: ' + is_type + '). Wrapper id: ' + is_wrapperId);
				} else {
					var lo_options = io_options;
					
					if(lo_options.replace === true && !_go_wrapper[is_wrapperId].elements[is_id]) {
						delete lo_options.replace;
						go_self.con.info('Options.addElement: Element with id "' + is_id + '" not existant. Element was created instead of replaced. Wrapper id: ' + is_wrapperId);
					}
					
					var lo_newElement = { table: im_table + '', create: if_create, specificity: (!!lo_options.specificity === true ? lo_options.specificity : _gec_SpecificityLevel.GLOBAL) };
					if(lo_options.replace === true)
						lo_newElement.specificity = _go_wrapper[is_wrapperId].elements[is_id].specificity;
					
					var ls_specificityPrefix = _getSpecificityPrefix(lo_newElement.specificity);
					
					if(!!lo_options.createOptions === true)
						lo_newElement.options = lo_options.createOptions;
					
					if(lo_options.defaultValue !== undefined) {
						lo_newElement.defaultValue	= lo_options.defaultValue;
						
						if(_go_savedOptions[is_wrapperId] && (_go_savedOptions[is_wrapperId][is_id] || _go_savedOptions[is_wrapperId][is_id] === false)) {
							_go_options[is_wrapperId][is_id] = _go_savedOptions[is_wrapperId][is_id];
							
							if(ls_specificityPrefix.length > 0 && !_go_options[is_wrapperId][is_id][ls_specificityPrefix] && _go_options[is_wrapperId][is_id][ls_specificityPrefix] !== false) {
								_go_options[is_wrapperId][is_id][ls_specificityPrefix] = lo_options.defaultValue;
							}
						} else {
							if(ls_specificityPrefix.length > 0) {
								_go_options[is_wrapperId][is_id] = {};
								_go_options[is_wrapperId][is_id][ls_specificityPrefix] = lo_options.defaultValue;
							} else {
								_go_options[is_wrapperId][is_id] = lo_options.defaultValue;
							}
						}
					}
					
					if(!!lo_options.saveCallback === true)
						lo_newElement.save	= lo_options.saveCallback;
					
					if(!!lo_options.changeCallback === true) {
						lo_newElement.changeCallback = lo_options.changeCallback;
						
						// Run the callback also when registering.
						setTimeout(function() {
							var lm_value = _go_options[is_wrapperId][is_id];
							if(ls_specificityPrefix.length > 0)
								lm_value = lm_value[ls_specificityPrefix];
							lo_options.changeCallback(lm_value, lm_value);
						}, 0);
					}
					
					_go_wrapper[is_wrapperId].elements[is_id] = lo_newElement;
					
					if(lo_options.replace !== true) {
						_go_wrapper[is_wrapperId].elementOrder.IC.insert(is_id, lo_options.position);
					}
				}
			} else {
				go_self.con.warn('Options.addElement: Wrapper with id "' + is_wrapperId + '" not defined. Element id: ' + is_id);
			}
		};
		
		/**
		 * Save the content of <code>_go_options</code>.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{boolean}	showNoSuccessHint
		 *   If the success hint should not be shown.
		 */
		var _saveOptions = function(ib_showNoSuccessHint) {
			go_self.myGM.setValue('optionPanel_options', _go_options).then(function() {
				_go_savedOptions = _go_options;
				
				if(!ib_showNoSuccessHint === true) {
					go_self.Ikariam.showTooltip('cityAdvisor', 'confirm', go_self.Language.$('general.successful'));
				}
			});
		};
		
		/**
		 * Store the actual value of each option to <code>_option</code> and call <code>_saveOptions</code>.
		 * 
		 * @private
		 * @inner
		 */
		var _savePanelOptions = function() {
			// Store the value of each option element.
			go_self.myGM.forEach(_go_wrapper, function(is_wrapperId, io_wrapper) {
				go_self.myGM.forEach(io_wrapper.elements, function(is_elementId, io_element) {
					if(io_element.save) {
						var ls_specificityPrefix	= _getSpecificityPrefix(io_element.specificity);
						var lm_oldValue				= _go_options[is_wrapperId][is_elementId];
						var lm_newValue				= io_element.save(is_wrapperId + is_elementId);
						
						if(ls_specificityPrefix.length > 0) {
							lm_oldValue														= lm_oldValue[ls_specificityPrefix];
							_go_options[is_wrapperId][is_elementId][ls_specificityPrefix]	= lm_newValue;
						} else {
							_go_options[is_wrapperId][is_elementId] = lm_newValue;
						}
						
						if(lm_newValue != lm_oldValue && io_element.changeCallback) {
							setTimeout(function() { io_element.changeCallback(lm_newValue, lm_oldValue); }, 0);
						}
					}
				});
			});
			
			_saveOptions();
		};
		
		/**
		 * Initializes the options tab for the script and adds the scroll function to the tab menu.
		 * 
		 * @private
		 * @inner
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves to the options tab for the script.
		 */
		var _initializeOptionsTab = async function() {
			var re_tabScriptOptions = go_self.myGM.$('#tab_options' + go_self.myGM.prefix);
			
			if(!re_tabScriptOptions) {
				go_self.myGM.addStyle(
						"#tab_options" + go_self.myGM.prefix + " hr								{ margin: 0; } \
						 #tab_options" + go_self.myGM.prefix + " .scriptTextArea				{ resize: none; width: calc(100% - 2px); height: 75px; } \
						 #tab_options" + go_self.myGM.prefix + " .scriptTextField				{ width: 173px;	} \
						 #tab_options" + go_self.myGM.prefix + " .cbWrapper						{ margin: 0 0 0 10px; } \
						 #tab_options" + go_self.myGM.prefix + " .radioWrapper:not(:last-child)	{ margin-bottom: 2px; }",
					'scriptOptionsTab', true);
				
				var le_tabmenu			= go_self.myGM.$('#tabMenu');
				var le_nextPageLink		= go_self.myGM.$('.tabNextPage', le_tabmenu);
				var la_pagerInformation	= le_nextPageLink.getAttribute('onclick').match(/switchPage\(([0-9]*), this, ([0-9]*)\)/);
				var li_pageNumber		= go_self.Ikariam.getInt(la_pagerInformation[1]);
				var li_offset			= go_self.Ikariam.getInt(la_pagerInformation[2]);
				var li_newIndex			= go_self.myGM.$$('.tab[index]', le_tabmenu).length + 1;
				var li_newPageNumber	= Math.ceil(li_newIndex / li_offset);
				if(li_pageNumber < li_newPageNumber)
					le_nextPageLink.classList.remove('invisible');
				
				var la_tabClasses = ['tab'];
				if(li_pageNumber !== li_newPageNumber)
					la_tabClasses.push('invisible');
				
				go_self.myGM.addElement('li', le_tabmenu, {
					'id':			'js_tab_options' + go_self.myGM.prefix,
					'classes':		la_tabClasses,
					'index':		li_newIndex,
					'innerHTML':	'<b class="tab_options' + go_self.myGM.prefix + '">' + go_script.name + '</b>',
					'onclick':		"$('#js_tab_options" + go_self.myGM.prefix + "').removeClass('selected'); switchTab('tab_options" + go_self.myGM.prefix + "');"
				}, false, le_nextPageLink);
				
				re_tabScriptOptions	= go_self.myGM.addElement('div', go_self.myGM.$('#tabMenu').parentNode, {
					'id':		'tab_options' + go_self.myGM.prefix, 
					'style':	[['display', 'none']]
				}, false);
			}
			
			_go_optionWrapperVisibility = await go_self.myGM.getValue('optionPanel_optionWrapperVisibility', _go_optionWrapperVisibility);
			
			return re_tabScriptOptions;
		};
		
		/**
		 * Add a wrapper for options elements to the script option tab.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_tab
		 *   The tab to add the wrapper to.
		 * @param	{String}	is_id
		 *   The id of the wrapper.
		 * @param	{String}	is_headerText
		 *   The text for the wrapper header.
		 * 
		 * @return	{Element}
		 *   The wrapper.
		 */
		var _createOptionsWrapper = function(ie_tab, is_id, is_headerText) {
			/*
			 * Function to toggle the visibility of an wrapper.
			 */
			var lf_toggle = async function() {
				go_self.myGM.toggleShowHideButton(this);
				
				go_self.myGM.$('.content', this.parentNode.parentNode).classList.toggle('invisible');
				
				var ls_optionId = this.parentNode.parentNode.id.replace(go_self.myGM.prefix, '');
				_go_optionWrapperVisibility[ls_optionId] = !_go_optionWrapperVisibility[ls_optionId];
				await go_self.myGM.setValue('optionPanel_optionWrapperVisibility', _go_optionWrapperVisibility);
	
				// Adjust the size of the Scrollbar.
				go_self.ika.controller.adjustSizes();
			};
			
			var ls_headerText = typeof is_headerText == 'string' ? is_headerText : go_self.Language.$(is_headerText.id);
			
			var lb_showContent		= !!_go_optionWrapperVisibility[is_id];
			var le_optionsWrapper	= go_self.myGM.addElement('div', ie_tab, {'id': is_id, 'class': 'contentBox01h' });
			var le_optionsHeader	= go_self.myGM.addElement('h3', le_optionsWrapper, { 'class': 'header', 'innerHTML': ls_headerText });
			go_self.myGM.addElement('div', le_optionsHeader, {
				'class':	lb_showContent ? 'minimizeImg' : 'maximizeImg',
				'style':	[['cssFloat', 'left']],
				'title':	lb_showContent ? go_self.Language.$('general.fold') : go_self.Language.$('general.expand'),
				'click':	lf_toggle
			});
			
			var re_optionsWrapperContent = go_self.myGM.addElement('div', le_optionsWrapper, { 'classes': lb_showContent ? ['content'] : ['content', 'invisible'] });
			go_self.myGM.addElement('div', le_optionsWrapper, { 'class': 'footer' });
			
			return re_optionsWrapperContent;
		};
		
		/**
		 * Show the option script tab.
		 * 
		 * @private
		 * @inner
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the option panel is shown.
		 */
		var _showOptionPanel = async function() {
			var le_tab = await _initializeOptionsTab();
			
			for(var i = 0; i < _ga_wrapperOrder.length; i++) {
				var ls_wrapperId		= _ga_wrapperOrder[i];
				var lo_wrapperOptions	= _go_wrapper[ls_wrapperId];
				var le_wrapper 			= _createOptionsWrapper(le_tab, ls_wrapperId, lo_wrapperOptions.headerText);
				var lo_tables			= {};
				
				for(var j = 0; j < lo_wrapperOptions.elementOrder.length; j++) {
					var ls_elementId		= lo_wrapperOptions.elementOrder[j];
					var lo_elementOptions	= lo_wrapperOptions.elements[ls_elementId];
					
					if(!lo_tables[lo_elementOptions.table]) {
						var le_table						= go_self.myGM.addElement('table', le_wrapper, { 'classes': ['moduleContent', 'table01'] });
						lo_tables[lo_elementOptions.table]	= go_self.myGM.addElement('tbody', le_table);
					}
					
					var ls_specificityPrefix	= _getSpecificityPrefix(lo_elementOptions.specificity);
					var lo_options				= lo_elementOptions.options ? lo_elementOptions.options : null;
					var lm_value				= (_go_options[ls_wrapperId] && (_go_options[ls_wrapperId][ls_elementId] || _go_options[ls_wrapperId][ls_elementId] == false)) ? _go_options[ls_wrapperId][ls_elementId] : null;
					
					if(ls_specificityPrefix.length > 0)
						lm_value = lm_value[ls_specificityPrefix];
					
					lo_elementOptions.create(lo_tables[lo_elementOptions.table], ls_wrapperId + ls_elementId, lm_value, lo_options);
				}
				
				go_self.myGM.addButton(le_wrapper, go_self.Language.$('core.optionPanel.save'), function() { setTimeout(_savePanelOptions, 0); });
			}
		};
		
		/**
		 * Show the notification for exporting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _exportOptionsShowNotification = function() {
			var ls_options = JSON.stringify(_go_options);
			
			var lo_notificationText = {
				header:		go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.exportNotification.header'),
				bodyTop:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.exportNotification.explanation'),
				bodyBottom:	ls_options
			};
			
			go_self.myGM.notification(lo_notificationText, null, { textarea: true, readonly: true, autoselect: true });
		};
		
		/**
		 * Callback for importing the options.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_textarea
		 *   The textarea with the options string to import.
		 */
		var _importOptionsCallback = function(ie_textarea) {
			var ls_options = ie_textarea.value;
			
			if(ls_options) {
				// Function for safer parsing.
				var lf_safeParse = function(is_key, im_value) {
					if(typeof im_value === 'function' || Object.prototype.toString.apply(im_value) === '[object function]') {
						return im_value.toString();
					}
	
					return im_value;
				};
				
				try {
					var lo_parsed = JSON.parse(ls_options, lf_safeParse);
					
					// Store the values in the script.
					go_self.myGM.forEach(lo_parsed, function(is_wrapperKey, io_elements) {
						go_self.myGM.forEach(io_elements, function(is_elementKey, im_setting) {
							if(_go_options[is_wrapperKey] && (_go_options[is_wrapperKey][is_elementKey] || _go_options[is_wrapperKey][is_elementKey] == false) && Array.isArray(im_setting) === false) {
								if(typeof im_setting !== 'object') {
									_go_options[is_wrapperKey][is_elementKey] = im_setting;
								} else if(_getSpecificityPrefix(_go_wrapper[is_wrapperKey].elements[is_elementKey].specificity).length > 0) {
									go_self.myGM.forEach(im_setting, function(is_serverKey, im_serverSetting) {
										if(Array.isArray(im_serverSetting) === false && typeof im_serverSetting !== 'object')
											_go_options[is_wrapperKey][is_elementKey] = im_setting;
									});
								}
							}
						});
					});
					
					_saveOptions();
				} catch(lo_error) {
					var lo_notificationText = {
						header:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.importError.header'),
						body:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.importError.explanation')
					};
					
					go_self.con.error(lo_error);
					go_self.myGM.notification(lo_notificationText);
				}
			}
		};
		
		/**
		 * Show the notification for importing the options.
		 * 
		 * @private
		 * @inner
		 */
		var _importOptionsShowNotification = function() {
			var lo_notificationText = {
				header:		go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.importNotification.header'),
				bodyTop:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.importNotification.explanation')
			};
	
			var lo_notificationCallback = {
				confirm:	_importOptionsCallback
			};
			
			go_self.myGM.notification(lo_notificationText, lo_notificationCallback, { textarea: true });
		};
		
		/**
		 * Callback for resetting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _resetOptionsCallback = function() {
			_go_options = {};
			
			// Store the default values.
			go_self.myGM.forEach(_go_wrapper, function(is_wrapperKey, io_wrapper) {
				_go_options[is_wrapperKey] = {};
				
				go_self.myGM.forEach(io_wrapper.elements, function(is_elementKey, io_element) {
					if(io_element.defaultValue || io_element.defaultValue == false) {
						var ls_specificityPrefix = _getSpecificityPrefix(io_element.specificity);
						
						if(ls_specificityPrefix.length > 0) {
							_go_options[is_wrapperKey][is_elementKey] = {};
							_go_options[is_wrapperKey][is_elementKey][ls_specificityPrefix] = io_element.defaultValue;
						} else {
							_go_options[is_wrapperKey][is_elementKey] = io_element.defaultValue;
						}
					}
				});
			});
			
			_saveOptions();
		};
		
		/**
		 * Show the notification for resetting the options.
		 * 
		 * @private
		 * @inner
		 */
		var _resetOptionsShowNotification = function() {
			var lo_notificationText = {
				header:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.resetNotification.header'),
				body:	go_self.Language.$('core.optionPanel.section.optionPanelOptions.label.resetNotification.explanation')
			};
	
			var lo_notificationCallback = {
				confirm:	_resetOptionsCallback,
				abort:		function() { return; }
			};
			
			go_self.myGM.notification(lo_notificationText, lo_notificationCallback);
		};
		
		/**
		 * Create the export options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_parent
		 *   Parent element for the link.
		 */
		var _exportOptions = function(ie_parent) {
			this.myGM.addElement('a', ie_parent, {
				'href':			'javascript:;',
				'innerHTML':	this.Language.$('core.optionPanel.section.optionPanelOptions.label.export'),
				'click':		_exportOptionsShowNotification
			});
		};
		
		/**
		 * Create the import options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_parent
		 *   Parent element for the link.
		 */
		var _importOptions = function(ie_parent) {
			this.myGM.addElement('a', ie_parent, {
				'href':			'javascript:;',
				'innerHTML':	this.Language.$('core.optionPanel.section.optionPanelOptions.label.import'),
				'click':		_importOptionsShowNotification
			});
		};
		
		/**
		 * Create the reset options link.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}	ie_parent
		 *   Parent element for the link.
		 */
		var _resetOptions = function(ie_parent) {
			this.myGM.addElement('a', ie_parent, {
				'href':			'javascript:;',
				'innerHTML':	this.Language.$('core.optionPanel.section.optionPanelOptions.label.reset'),
				'click':		_resetOptionsShowNotification
			});
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Enum for the level of specificity an option can have.
		 * 
		 * @instance
		 * @readonly
		 * @name	 SpecificityLevel
		 * @memberof IkariamCore~Options
		 * 
		 * @enum	{IkariamCore~Options~SpecificityLevelEnum}
		 */
		Object.defineProperty(this, 'SpecificityLevel', { get: function() {
			return _gec_SpecificityLevel;
		} });
		
		/**
		 * Add a wrapper to the list.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_id
		 *   The id of the wrapper.
		 * @param	{String}	is_headerText
		 *   The text for the wrapper header.
		 * @param	{int}		ii_position
		 *   The position of the wrapper on the options tab. (optional)
		 */
		this.addWrapper = function(is_id, is_headerText, ii_position) {
			if(_go_wrapper[is_id]) {
				go_self.con.warn('Options.addWrapper: Wrapper with id "' + is_id + '" defined two times.');
			} else {
				_go_wrapper[is_id]	= { headerText: is_headerText, elements: {}, elementOrder: new Array() };
				_go_options[is_id]	= {};
				_ga_wrapperOrder.IC.insert(is_id, ii_position);
			}
		};
		
		/**
		 * Add a new checkbox to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the checkbox.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the checkbox belongs to.
		 * @param	{boolean}		ib_defaultChecked
		 *   If the checkbox is checked by default.
		 * @param	{String}		im_label
		 *   The text for the label.
		 * @param	{IkariamCore~Options~DefaultElementOptions}	io_options
		 *   Options for the checkbox.
		 */
		this.addCheckbox = function(is_id, is_wrapperId, im_block, ib_defaultChecked, is_label, io_options) {
			/*
			 * Function to save the checkbox value.
			 */
			var lf_save = function(is_elementId) {
				return go_self.myGM.$('#' + go_self.myGM.prefix + is_elementId + 'Cb').checked;
			};
			
			/*
			 * Function to create the checkbox.
			 */
			var lf_create = function(ie_parentTable, is_elementId, ib_value, io_createOptions) {
				var le_row		= go_self.myGM.addElement('tr', ie_parentTable);
				var le_parent	= go_self.myGM.addElement('td', le_row, { 'colSpan': '2', 'class': 'left' });
				
				go_self.Ikariam.addCheckboxes(le_parent, [{ id: is_elementId, label: io_createOptions.label, checked: ib_value }]);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label },
				defaultValue:	ib_defaultChecked,
				specificity:	io_options.specificity,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('checkbox', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		/**
		 * Add a new set of radio buttons to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the checkbox.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the checkbox belongs to.
		 * @param	{(String|int)}	im_defaultChecked
		 *   The value selected by default.
		 * @param	{String}		is_label
		 *   The text for the label.<br>
		 * @param	{IkariamCore~myGM~ValueAndLabel}			im_radioValues
		 *   An array with the names an values of the options.
		 * @param	{IkariamCore~Options~DefaultElementOptions}	io_options
		 *   Options for the radio buttons.
		 */
		this.addRadios = function(is_id, is_wrapperId, im_block, im_defaultChecked, is_label, im_radioValues, io_options) {
			/*
			 * Function to save the radiobutton value.
			 */
			var lf_save = function(is_elementId) {
				return go_self.myGM.getRadioValue(is_elementId);
			};
			
			/*
			 * Function to create the radiobuttons.
			 */
			var lf_create = function(ie_parentTable, is_elementId, im_value, io_createOptions) {
				go_self.Ikariam.addRadios(ie_parentTable, is_elementId, im_value, io_createOptions.options, io_createOptions.label);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label, options: im_radioValues },
				defaultValue:	im_defaultChecked,
				specificity:	io_options.specificity,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('radio', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add a new select field to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the select field.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the select field belongs to.
		 * @param	{(String|int)}	im_defaultSelected
		 *   The value of the option selected by default.
		 * @param	{String}		is_label
		 *   The text for the label.
		 * @param	{IkariamCore~myGM~ValueAndLabel}			im_selectOptions
		 *   An array with the labels and values of the options.
		 * @param	{IkariamCore~Options~DefaultElementOptions}	io_options
		 *   Options for the select field.
		 */
		this.addSelect = function(is_id, is_wrapperId, im_block, im_defaultSelected, is_label, im_selectOptions, io_options) {
			/*
			 * Function to save the select value.
			 */
			var lf_save = function(is_elementId) {
				return go_self.myGM.getSelectValue(is_elementId);
			};
			
			/*
			 * Function to create the select.
			 */
			var lf_create = function(ie_parentTable, is_elementId, im_value, io_createOptions) {
				go_self.Ikariam.addSelect(ie_parentTable, is_elementId, im_value, io_createOptions.options, io_createOptions.label);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label, options: im_selectOptions },
				defaultValue:	im_defaultSelected,
				specificity:	io_options.specificity,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('select', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add a new textfield to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the textfield.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the textfield belongs to.
		 * @param	{String}		is_defaultValue
		 *   Default value of the textfield.
		 * @param	{String}		is_label
		 *   The text for the label.
		 * @param	{IkariamCore~Options~TextFieldOptions}		io_options
		 *   Options for the textfield.
		 */
		this.addTextField = function(is_id, is_wrapperId, im_block, is_defaultValue, is_label, io_options) {
			/*
			 * Function to save the textfield value.
			 */
			var lf_save = function(is_elementId) {
				return go_self.myGM.$('#' + go_self.myGM.prefix + is_elementId + 'TextField').value;
			};
			
			/*
			 * Function to create the textfield.
			 */
			var lf_create = function(ie_parentTable, is_elementId, is_value, io_createOptions) {
				var le_row				= go_self.myGM.addElement('tr', ie_parentTable);
				var le_labelCell		= go_self.myGM.addElement('td', le_row);
				var le_textFieldCell	= go_self.myGM.addElement('td', le_row, { 'class': 'left' });
				
				var ls_label = typeof io_createOptions.label == 'string' ? io_createOptions.label : go_self.Language.$(io_createOptions.label.id);

				go_self.myGM.addElement('span', le_labelCell, { 'innerHTML': ls_label });
				
				var lo_options = {
					'id':		is_elementId + 'TextField',
					'classes':	['textfield', 'scriptTextField'],
					'type':		'text',
					'value':	is_value
				};
				
				if(!!io_createOptions.maxlength === true)
					lo_options['maxLength'] = io_createOptions.maxLength + '';
					
				if(!!io_createOptions.style === true)
					lo_options['style'] = io_createOptions.style;
				
				go_self.myGM.addElement('input', le_textFieldCell, lo_options);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label, maxLength: io_options.maxLength, style: io_options.style },
				defaultValue:	is_defaultValue,
				specificity:	io_options.specificity,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('textfield', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add a new textarea to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the textarea.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the textarea belongs to.
		 * @param	{String}		is_defaultValue
		 *   Default value of the textarea.
		 * @param	{String}		is_label
		 *   The text for the label.
		 * @param	{IkariamCore~Options~TextAreaOptions}	io_options
		 *   Options for the textarea.
		 */
		this.addTextArea = function(is_id, is_wrapperId, im_block, is_defaultValue, is_label, io_options) {
			/*
			 * Function to save the textarea value.
			 */
			var lf_save = function(ls_elementId) {
				return go_self.myGM.$('#' + go_self.myGM.prefix + ls_elementId + 'TextArea').value;
			};
			
			/*
			 * Function to create the textarea.
			 */
			var lf_create = function(ie_parentTable, is_elementId, is_value, io_createOptions) {
				var ls_label = typeof io_createOptions.label == 'string' ? io_createOptions.label : go_self.Language.$(io_createOptions.label.id);
				
				var le_labelRow		= go_self.myGM.addElement('tr', ie_parentTable);
				var le_labelCell	= go_self.myGM.addElement('td', le_labelRow, { 'colSpan': '2', 'class': 'left' });
				go_self.myGM.addElement('p', le_labelCell, { 'innerHTML': ls_label });
				
				var le_textAreaRow		= go_self.myGM.addElement('tr', ie_parentTable);
				var le_textAreaCell		= go_self.myGM.addElement('td', le_textAreaRow, { 'colSpan': '2', 'class': 'left' });
				
				var lo_options = {
					'id':			is_elementId + 'TextArea',
					'classes':		['textfield', 'scriptTextArea'],
					'innerHTML':	is_value
				};
				
				if(!!io_createOptions.style === true)
					lo_options['style'] = io_createOptions.style;
				
				go_self.myGM.addElement('textarea', le_textAreaCell, lo_options);
			};
			
			var lo_options = {
				createOptions:	{ label: is_label, style: io_options.style },
				defaultValue:	is_defaultValue,
				specificity:	io_options.specificity,
				saveCallback:	lf_save,
				changeCallback:	io_options.changeCallback,
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('textarea', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add HTML content to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}		is_id
		 *   The id of the HTML content.
		 * @param	{String}		is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}	im_block
		 *   The block of the wrapper, the HTML content belongs to.
		 * @param	{IkariamCore~Options~HtmlOptions}	io_options
		 *   Options for the html code.
		 */
		this.addHTML = function(is_id, is_wrapperId, im_block, io_options) {
			/*
			 * Function to create the html.
			 */
			var lf_create = function(ie_parentTable, is_elementId, im_value, io_createOptions) {
				var le_htmlRow	= go_self.myGM.addElement('tr', ie_parentTable);
				
				var lo_options = {
					'colSpan':	'2',
					'class':	'center'
				};
				
				if(!!io_createOptions.html === true)
					lo_options['innerHTML'] = io_createOptions.html;
					
				var le_htmlCell	= go_self.myGM.addElement('td', le_htmlRow, lo_options);
				
				if(!!io_createOptions.callback === true)
					io_createOptions.callback.call(io_createOptions.thisReference, le_htmlCell);
			};
			
			var lo_options = {
				createOptions:	{ html: io_options.html, callback: io_options.callback, thisReference: io_options.thisReference },
				position:		io_options.position,
				replace:		io_options.replace
			};
			
			_addElement('html', is_id, is_wrapperId, im_block, lf_create, lo_options);
		};
		
		
		/**
		 * Add a new horizontal line to the options tab.
		 * 
		 * @instance
		 * 
		 * @param	{String}			is_wrapperId
		 *   The id of the wrapper.
		 * @param	{(String|int)}		im_block
		 *   The block of the wrapper, the horizontal line belongs to.
		 * @param	{int}				ii_position
		 *   The position of the horizontal line in the wrapper. (optional)
		 *   
		 * @return	{String}
		 *   The id of the horizontal line.
		 */
		this.addLine = function(is_wrapperId, im_block, ii_position) {
			/*
			 * Function to create the horizontal line.
			 */
			var lf_create = function(ie_parentTable, is_elementId, im_value, io_options) {
				var le_row		= go_self.myGM.addElement('tr', ie_parentTable);
				var le_lineCell	= go_self.myGM.addElement('td', le_row, { 'colSpan': '2', 'class': 'left' });
				
				go_self.myGM.addElement('hr', le_lineCell);
			};
			
			var rs_id		= 'hr' + _gi_lineId;
			var lo_options	= {
				position:		ii_position
			};
			
			_addElement('line', rs_id, is_wrapperId, im_block, lf_create, lo_options);
			_gi_lineId++;
			
			return rs_id;
		};
		
		
		/**
		 * Deletes an wrapper with all option elements contained in it.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_id
		 *   Id of the wrapper to delete.
		 */
		this.deleteWrapper = function(is_id) {
			if(!_go_wrapper[is_id]) {
				go_self.con.info('Options.deleteWrapper: Wrapper with id "' + is_id + '" does not exist.');
			} else {
				delete _go_wrapper[is_id];
				delete _go_options[is_id];
				
				var li_position = -1;
				
				for(var i = 0; i < _ga_wrapperOrder.length; i++) {
					if(_ga_wrapperOrder[i] == is_id) {
						li_position = i;
						break;
					}
				}
				
				_ga_wrapperOrder.IC.remove(li_position);
			}
		};
		
		
		/**
		 * Deletes an option element.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_wrapperId
		 *   The id of the wrapper containing the element.
		 * @param	{String}	is_elementId
		 *   The id of the element to delete.
		 */
		this.deleteElement = function(is_wrapperId, is_elementId) {
			if(!(_go_wrapper[is_wrapperId] && _go_wrapper[is_wrapperId].elements[is_elementId])) {
				go_self.con.info('Options.deleteElement: Element with id "' + is_wrapperId + '_' + is_elementId + '" does not exist.');
			} else {
				delete _go_wrapper[is_wrapperId].elements[is_elementId];
				delete _go_options[is_wrapperId][is_elementId];
				
				var li_position = -1;
				
				for(var i = 0; i < _go_wrapper[is_wrapperId].elementOrder.length; i++) {
					if(_go_wrapper[is_wrapperId].elementOrder[i] == is_elementId) {
						li_position = i;
						break;
					}
				}
				
				_go_wrapper[is_wrapperId].elementOrder.IC.remove(li_position);
			}
		};
		
		/**
		 * Get the stored value of an option.
		 * 
		 * @instance
		 * 
		 * @param	{String}	is_wrapperId
		 *   Id of the wrapper of the option element.
		 * @param	{String}	is_optionId
		 *   Id of the option element.
		 * 
		 * @return	{(String|int|boolean)}
		 *   The stored value.
		 */
		this.getOption = function(is_wrapperId, is_optionId) {
			var ls_specificityPrefix = '';
			if(_go_wrapper[is_wrapperId] && _go_wrapper[is_wrapperId].elements[is_optionId])
				ls_specificityPrefix = _getSpecificityPrefix(_go_wrapper[is_wrapperId].elements[is_optionId].specificity);
				
			if(_go_options[is_wrapperId] && (_go_options[is_wrapperId][is_optionId] || _go_options[is_wrapperId][is_optionId] == false)) {
				if(ls_specificityPrefix.length > 0)
					return _go_options[is_wrapperId][is_optionId][ls_specificityPrefix];
				
				return _go_options[is_wrapperId][is_optionId];
			}
			
			go_self.con.warn('Options.getOption: Option with id "' + is_wrapperId + '_' + is_optionId + '" not defined.');
			return null;
		};
		
		/**
		 * Set the stored value of an option.
		 * 
		 * @instance
		 * 
		 * @param	{String}				is_wrapperId
		 *   Id of the wrapper of the option element.
		 * @param	{String}				is_optionId
		 *   Id of the option element.
		 * @param	{(String|int|boolean)}	im_value
		 *   The value to store.
		 */
		this.setOption = function(is_wrapperId, is_optionId, im_value) {
			var ls_specificityPrefix = _getSpecificityPrefix(_go_wrapper[is_wrapperId].elements[is_optionId].specificity);
			
			if(_go_options[is_wrapperId] && (_go_options[is_wrapperId][is_optionId] || _go_options[is_wrapperId][is_optionId] == false)) {
				if(ls_specificityPrefix.length > 0)
					_go_options[is_wrapperId][is_optionId][ls_specificityPrefix] = im_value;
				else
					_go_options[is_wrapperId][is_optionId] = im_value;
			} else {
				go_self.con.warn('Options.setOption: Option with id "' + is_wrapperId + '_' + is_optionId + '" not yet defined. Value "' + im_value + '" not stored.');
			}
			
			_saveOptions(true);
		};
		
		/*----------------------------------------*
		 * Register the show option panel handler *
		 *----------------------------------------*/
		
		// Register the option handler to show the options in the option panel.
		go_self.RefreshHandler.add(['options', 'optionsAccount', 'optionsNotification', 'optionsIPSharing'], 'showOptionPanel', _showOptionPanel);
		
		/*-------------------------------*
		 * Add the option panel options. *
		 *-------------------------------*/
		
		this.addWrapper('optionPanelOptions', { id: 'core.optionPanel.section.optionPanelOptions.title' });
		this.addHTML('exportOptions', 'optionPanelOptions', 'links', { thisReference: go_self, callback: _exportOptions });
		this.addHTML('importOptions', 'optionPanelOptions', 'links', { thisReference: go_self, callback: _importOptions });
		this.addHTML('resetOptions', 'optionPanelOptions', 'links', { thisReference: go_self, callback: _resetOptions });
		
		/*---------------------------------------------------------------------*
		 * Types for documentation purposes (e.g. callback functions, objects) *
		 *---------------------------------------------------------------------*/
		
		/**
		 * Callback to get the value of an option from the element.
		 * 
		 * @callback	IkariamCore~Options~GetOption
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	elementId
		 *   The id of the element which option should be retrieved.
		 * 
		 * @return	{(String|int|boolean)}
		 *   The value of the option.
		 */
		
		/**
		 * Options for the generic <code>_addElement</code> function.
		 * 
		 * @typedef	IkariamCore~Options~AddElementOptions
		 * 
		 * @private
		 * @inner
		 * 
		 * @mixes	IkariamCore~Options~DefaultElementOptions
		 * 
		 * @property	{?*}								[createOptions]	- Options to pass to the create element function.
		 * @property	{?(String|int|boolean)}				[defaultValue]	- Default value of the option. Needed to enable loading of stored option!
		 * @property	{?IkariamCore~Options~GetOption}	[saveCallback]	- Callback to get the value of an option from the element.
		 */
		
		/**
		 * Callback to create an option element.
		 * 
		 * @callback	IkariamCore~Options~CreateCallback
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Element}				parentTable
		 *   The parent table of the option element.
		 * @param	{String}				elementId
		 *   The id of the option element.
		 * @param	{(String|int|boolean)}	value
		 *   The value of the option element.
		 * @param	{*}						options
		 *   Options needed to create this option element.
		 */
		
		/**
		 * Callback if the value of an option is changed.
		 * 
		 * @callback	IkariamCore~Options~ChangeCallback
		 * 
		 * @param	{(String|int|boolean)}	newValue
		 *   The new value of the option.
		 * @param	{(String|int|boolean)}	oldValue
		 *   The old value of the option.
		 */
		
		/**
		 * Default options for elements.
		 * 
		 * @typedef	{Object}	IkariamCore~Options~DefaultElementOptions
		 * 
		 * @property	{?int}									[specificity=IkariamCore.SpecificityLevel.GLOBAL]	- If the option should be stored globally or for for each server / player specific. Not changable during replacement! Possible values: {@link IkariamCore~Options~SpecificityLevelEnum}
		 * @property	{?IkariamCore~Options~ChangeCallback}	[changeCallback]									- Callback if the value of an option is changed.
		 * @property	{?int}									[position=array.length]								- Position of the element in the element array. Not changable during replacement!
		 * @property	{?boolean}								[replace=false]										- Replace the element with the same name if it has the same type.
		 */
		
		/**
		 * Options for text fields.
		 * 
		 * @typedef	{Object}	IkariamCore~Options~TextFieldOptions
		 * 
		 * @mixes	IkariamCore~Options~DefaultElementOptions
		 * 
		 * @property	{?int}							[maxLength]	- The maximum length of the input text.
		 * @property	{?IkariamCore~myGM~CssStyles}	[style]		- Special styles to be applied to the element.
		 */
		
		/**
		 * Options for text areas.
		 * 
		 * @typedef	{Object}	IkariamCore~Options~TextAreaOptions
		 * 
		 * @mixes	IkariamCore~Options~DefaultElementOptions
		 * 
		 * @property	{?IkariamCore~myGM~CssStyles}	[style]	- Special styles to be applied to the element.
		 */
		
		/**
		 * Callback to run after setting the HTML string. Can also be used to create the HTML content.
		 * 
		 * @callback	IkariamCore~Options~HtmlCreateCallback
		 * 
		 * @param	{Element}	parent
		 *   The parent element of the custom html.
		 */
		
		/**
		 * Options for custom html.
		 * 
		 * @typedef	{Object}	IkariamCore~Options~HtmlOptions
		 * 
		 * @property	{?String}									[html]					- HTML string to add to the wrapper.
		 * @property	{?IkariamCore~Options~HtmlCreateCallback}	[callback]				- Callback to run after setting the HTML string. Can also be used to create the HTML content.
		 * @property	{?*}										[thisReference]			- Reference to an object which should be referenced by <code>this</code> in the callback as it is not possible to use some objects. (e.g. go_self)
		 * @property	{?int}										[position=array.length]	- Position of the element in the element array. Not changable during replacement!
		 * @property	{?boolean}									[replace=false]			- Replace the element with the same name if it has the same type.
		 */
		
		/**
		 * Enum for the level of specificity an option can have.
		 * 
		 * @typedef	{Enum}	IkariamCore~Options~SpecificityLevelEnum
		 * 
		 * @property	{int}	GLOBAL - option is globally set.
		 * @property	{int}	SERVER - option is set for each server specifically.
		 * @property	{int}	PLAYER - option is set for each player specifically.
		 */
	}
	
	/**
	 * Handler for options the user can set / change.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Options
	 */
	this.Options = new Options();
	
	this.con.logTimeStamp('IkariamCore.Options created');
	
	/**
	 * Instantiate a new set of updating functions and start an initial update check.
	 * 
	 * @inner
	 * 
	 * @class
	 * @classdesc	Functions for checking for updates for the script.
	 */
	function Updater() {
		/*--------------------------------------------*
		 * Private variables, functions and settings. *
		 *--------------------------------------------*/
		
		/**
		 * Stores if the update check was started by the user.
		 * 
		 * @private
		 * @inner
		 * 
		 * @default false
		 * 
		 * @type	boolean
		 */ 
		var _gb_manualUpdate = false;
		
		/**
		 * Types for entries in update history. Translations have to be provided as translation
		 * in <code>core.update.possible.type.typeName</code><br>
		 * Default values which are always set:<br>
		 * "release" => release date<br>
		 * "other" => entries which type is unknown
		 * 
		 * @private
		 * @inner
		 * 
		 * @default ['feature', 'change', 'bugfix', 'language', 'core']
		 * 
		 * @type	Array.<String>
		 */ 
		var _ga_updateHistoryEntryTypes = ['feature', 'change', 'bugfix', 'language', 'core'];
	
		/**
		 * Compares two versions and returns if there is a new version.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	is_versionOld
		 *   The old version number.
		 * @param	{String}	is_versionNew
		 *   The new version number.
		 * @param	{?int}		[ii_maxPartsToCompare=infinite]
		 *   The number of parts to compare at most.
		 *
		 * @return	{boolean}
		 *   If a new version is available.
		 */
		var _newerVersion = function(is_versionOld, is_versionNew, ii_maxPartsToCompare) {
			var rb_newVersion = false;
	
			is_versionOld += '';
			is_versionNew += '';
	
			var la_versionOldParts = is_versionOld.split('.');
			var la_versionNewParts = is_versionNew.split('.');
	
			var li_biggerNumberOfParts = la_versionOldParts.length > la_versionNewParts.length ? la_versionOldParts.length : la_versionNewParts.length;
	
			if(!ii_maxPartsToCompare || ii_maxPartsToCompare < 1) {
				ii_maxPartsToCompare = li_biggerNumberOfParts + 1;
			}
	
			for(var i = 0; i < li_biggerNumberOfParts; i++) {
				var li_versionPartOld = parseInt(la_versionOldParts[i] || 0);
				var li_versionPartNew = parseInt(la_versionNewParts[i] || 0);
	
				if(li_versionPartOld < li_versionPartNew) {
					rb_newVersion = true;
					break;
				} else if(li_versionPartOld > li_versionPartNew || i == ii_maxPartsToCompare - 1) {
					rb_newVersion = false;
					break;
				}
			}
	
			return rb_newVersion;
		};
		
		/**
		 * Extract the update history from the metadata.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Object.<String, Array.<String>>}	io_metadata
		 *   Array with the formatted metadata.
		 *
		 * @return	{Object.<String, Object.<String, Array.<String>>>}
		 *   The extracted update history.<br>
		 *   Structure: <code>{ &lt;version&gt;: { &lt;type&gt;: [ &lt;notes&gt; ] }}</code>
		 */
		var _extractUpdateHistory = function(io_metadata) {
			var ro_updateHistory = {};
	
			for(var i = 0; i < io_metadata['history'].length; i++) {
				// Get the information from the update history data.
				var la_history_entry = io_metadata['history'][i].match(/^(\S+)\s+(\S+)\s+(.*)$/);
				
				var ls_version		= la_history_entry[1];
				var ls_type			= la_history_entry[2];
				var ls_type_trimmed	= ls_type.IC.trim(':').toLowerCase();
				var ls_info			= la_history_entry[3];
	
				if(!ro_updateHistory[ls_version]) {
					ro_updateHistory[ls_version] = {};
				}
				
				if(ls_type_trimmed == 'release') {
					ro_updateHistory[ls_version]['release'] = ls_info;
				} else if(_ga_updateHistoryEntryTypes.indexOf(ls_type_trimmed) > -1) {
					if(!ro_updateHistory[ls_version][ls_type_trimmed]) {
						ro_updateHistory[ls_version][ls_type_trimmed] = new Array(ls_info);
					} else {
						ro_updateHistory[ls_version][ls_type_trimmed].push(ls_info);
					}
				} else {
					if(!ro_updateHistory[ls_version]['other']) {
						ro_updateHistory[ls_version]['other'] = new Array(ls_type + " " + ls_info);
					} else {
						ro_updateHistory[ls_version]['other'].push(ls_type + " " + ls_info);
					}
				}
			}
	
			// Return the update history.
			return ro_updateHistory;
		};
		
		/**
		 * Format the update history using some HTML codes.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Object.<String, Object.<String, Array.<String>>>}	io_updateHistory
		 *   The update history.<br>
		 *   Structure: <code>{ &lt;version&gt;: { &lt;type&gt;: [ &lt;notes&gt; ] }}</code>
		 *
		 * @return	{String}
		 *   The formated update history.
		 */
		var _formatUpdateHistory = function(io_updateHistory) {
			var rs_formattedUpdateHistory = '';
			
			for(var ls_version in io_updateHistory) {
				if(Object.prototype.hasOwnProperty.call(io_updateHistory, ls_version)) {
					rs_formattedUpdateHistory += '<h2>v' + ls_version + '</h2><span class="smallFont">' + io_updateHistory[ls_version]['release'] + '</span></small><br><table class="' + go_self.myGM.prefix + 'updateTable"><tbody>';
		
					for(var ls_type in io_updateHistory[ls_version]) {
						if(Object.prototype.hasOwnProperty.call(io_updateHistory[ls_version], ls_type) && ls_type != 'release') {
							rs_formattedUpdateHistory += '<tr><td class="' + go_self.myGM.prefix + 'updateDataType">' + go_self.Language.$('core.update.possible.type.' + ls_type) + '</td><td class="' + go_self.myGM.prefix + 'updateDataInfo"><ul>';
			
							for(var i = 0 ; i < io_updateHistory[ls_version][ls_type].length; i++) {
								rs_formattedUpdateHistory += '<li>' + io_updateHistory[ls_version][ls_type][i] + '</li>';
							}
			
							rs_formattedUpdateHistory += '</ul></td></tr>';
						}
					}
		
					rs_formattedUpdateHistory += '</tbody></table><br>';
				}
			}
			
			if(rs_formattedUpdateHistory.length === 0) {
				rs_formattedUpdateHistory = '<b>' + go_self.Language.$('core.update.possible.noHistory') + '</b>';
			} else {
				rs_formattedUpdateHistory = '<b><u>' + go_self.Language.$('core.update.possible.history') + '</u></b><br><br>' + rs_formattedUpdateHistory;
			}
	
			return rs_formattedUpdateHistory;
		};
		
		/**
		 * Show the update information panel.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{Object.<String, Array.<String>>}	io_metadata
		 *   Array with formatted metadata.
		 */
		var _showUpdateInfo = function(io_metadata) {
			var lo_updateHistory = _extractUpdateHistory(io_metadata);
	
			var lo_notificationText = {
				header:		go_self.Language.$('core.update.possible.header'),
				bodyTop:	go_self.Language.$('core.update.possible.text', ['<a href="https://greasyfork.org/scripts/' + go_script.id + '" target="_blank" >' + go_script.name + '</a>', go_script.version, io_metadata.version]) + '<br>&nbsp;',
				bodyBottom:	_formatUpdateHistory(lo_updateHistory),
				confirm:	go_self.Language.$('core.update.possible.button.install'),
				abort:		go_self.Language.$('core.update.possible.button.hide')
			};
	
			var lo_notificationCallback = {
				confirm:	function() { go_self.win.top.location.href = 'https://greasyfork.org/scripts/' + go_script.id + '/code/' + go_script.id + '.user.js'; },
				abort:		function() { go_self.myGM.setValue('updater_hideUpdate', io_metadata.version + ''); }
			};
	
			go_self.myGM.notification(lo_notificationText, lo_notificationCallback);
		};
	
		/**
		 * Format the given metadata.
		 * 
		 * @private
		 * @inner
		 * 
		 * @param	{String}	is_metadata
		 *   The metadata to format.
		 *
		 * @return	{Object.<String, Array.<String>>}
		 *   The formatted metadata.
		 */
		var _formatMetadata = function(is_metadata) {
			var rs_metadata = new Array();
	
			// Extract the tags from the metadata.
			var ls_innerMetadata = is_metadata.match(/\/\/ ==UserScript==((.|\n|\r)*?)\/\/ ==\/UserScript==/)[0];
	
			if(ls_innerMetadata) {
				// Extract all tags.
				var la_metadata_entries = ls_innerMetadata.match(/\/\/ @(.*?)(\n|\r)/g);
	
				for(var i = 0; i < la_metadata_entries.length; i++) {
					// Extract the data from the tag.
					var la_metadata_entry = la_metadata_entries[i].match(/\/\/ @(.*?)\s+(.*)/);
	
					if(!rs_metadata[la_metadata_entry[1]]) {
						rs_metadata[la_metadata_entry[1]] = new Array(la_metadata_entry[2]);
					} else {
						rs_metadata[la_metadata_entry[1]].push(la_metadata_entry[2]);
					}
				}
			}
	
			return rs_metadata;
		};
		
		/*-------------------------------------------*
		 * Public variables, functions and settings. *
		 *-------------------------------------------*/
		
		/**
		 * Check for updates for the script. Automatically done on every instantiation of {@link IkariamCore}
		 * if the period from the last update is bigger than the check interval.
		 * 
		 * @instance
		 * 
		 * @return	{Promise}
		 *   A Promise which resolves once the update check url is called.
		 */
		this.checkForUpdates = async function() {
			// Send a request to the script hosting server to get the metadata of the script to check if there is a new update.
			var lb_notPossible = await go_self.myGM.xhr({
					method: 'GET',
					url: 'https://greasyfork.org/scripts/' + go_script.id + '/code.meta.js',
					headers: {'User-agent': 'Mozilla/5.0', 'Accept': 'text/html'},
					onload: async function(io_response) {
						var lo_metadata = _formatMetadata(io_response.responseText);
						
						if(_newerVersion(go_script.version, lo_metadata.version, go_self.Options.getOption('updateOptions', 'updateNotifyLevel')) && (await go_self.myGM.getValue('updater_hideUpdate', go_script.version) != lo_metadata.version || _gb_manualUpdate)) {
							_showUpdateInfo(lo_metadata);
						} else if(_gb_manualUpdate)	{
							var lo_notificationText = {
								header:	go_self.Language.$('core.update.noNewExists.header'),
								body:	go_self.Language.$('core.update.noNewExists.text', ['<a href="https://greasyfork.org/scripts/' + go_script.id + '" target="_blank" >' + go_script.name + '</a>', go_script.version])
							};
	
							go_self.myGM.notification(lo_notificationText);
						}
					}
				});
			
			if(lb_notPossible && lb_notPossible == true) {
				go_self.Options.setOption('updateOptions', 'updateInterval', 2419200);

				var lo_notificationText = {
					header:	go_self.Language.$('core.update.notPossible.header'),
					body:	go_self.Language.$('core.update.notPossible.text', ['<a href="https://greasyfork.org/scripts/' + go_script.id + '" target="_blank" >' + go_script.name + '</a>', go_script.version])
				};

				go_self.myGM.notification(lo_notificationText);
			}
		};
		
		/**
		 * Search manually for updates. Forces to search for updates. Even shows a popup if no new update is available.
		 * 
		 * @instance
		 */
		this.doManualUpdate = function() {
			_gb_manualUpdate = true;
			go_self.myGM.setValue('updater_lastUpdateCheck', (new Date()).getTime() + '').then(function() { go_self.Updater.checkForUpdates(); });
		};
		
		/**
		 * Set the possible entries for update history entries. "release" for the release date and "other" 
		 * for all entries which are not known will be stipped as they are default. Translations have to be 
		 * provided as translation in <code>core.update.possible.type.typeName</code>
		 * 
		 * @instance
		 * 
		 * @param	{Array.<String>}	ia_updateHistoryEntryTypes
		 *   The array with the update history entries to set.
		 */
		this.setUpdateHistoryEntryTypes = function(ia_updateHistoryEntryTypes) {
			['release', 'other'].forEach(function(is_toStrip) {
				var li_index = ia_updateHistoryEntryTypes.indexOf('release');
				if(li_index !== -1)
					ia_updateHistoryEntryTypes.IC.remove(li_index);
			});
			
			_ga_updateHistoryEntryTypes = ia_updateHistoryEntryTypes;
		};
		
		/*------------------------*
		 * Add the updater styles *
		 *------------------------*/
		
		go_self.myGM.addStyle(
				"." + go_self.myGM.prefix + "updateTable			{ border-collapse: separate; border-spacing: 2px; } \
				 ." + go_self.myGM.prefix + "updateDataType			{ width: 100px; padding: 5px 0px 5px 5px; border: 1px solid #D2A860; } \
				 ." + go_self.myGM.prefix + "updateDataInfo			{ width: 300px; padding: 5px 5px 5px 20px; border: 1px solid #D2A860; } \
				 ." + go_self.myGM.prefix + "updateDataInfo ul li	{ list-style: disc outside none; }",
				'updater', true
			);
		
		/*----------------------*
		 * Register the options *
		 *----------------------*/
		
		var _ga_updateIntervalOpts = new Array(
				{ value: -1,		label: { id: 'core.optionPanel.section.update.label.interval.option.never' }	},
				{ value: 3600,		label: { id: 'core.optionPanel.section.update.label.interval.option.hour' }		},
				{ value: 43200,		label: { id: 'core.optionPanel.section.update.label.interval.option.hour12' }	},
				{ value: 86400,		label: { id: 'core.optionPanel.section.update.label.interval.option.day' }		},
				{ value: 259200,	label: { id: 'core.optionPanel.section.update.label.interval.option.day3' }		},
				{ value: 604800,	label: { id: 'core.optionPanel.section.update.label.interval.option.week' }		},
				{ value: 1209600,	label: { id: 'core.optionPanel.section.update.label.interval.option.week2' }	},
				{ value: 2419200,	label: { id: 'core.optionPanel.section.update.label.interval.option.week4' }	}
			);
		
		var _ga_updateNotifyLevelOpts = new Array(
				{ value: 0,	label: { id: 'core.optionPanel.section.update.label.notifyLevel.option.all' }	},
				{ value: 1,	label: { id: 'core.optionPanel.section.update.label.notifyLevel.option.major' }	},
				{ value: 2,	label: { id: 'core.optionPanel.section.update.label.notifyLevel.option.minor' }	},
				{ value: 3,	label: { id: 'core.optionPanel.section.update.label.notifyLevel.option.patch' }	}
			);
		
		var _searchUpdates = function(ie_parent) {
			var ls_updateLink = this.Language.$('core.optionPanel.section.update.label.manual', [go_script.name]);
			this.myGM.addElement('a', ie_parent, { 'href': 'javascript:;', 'innerHTML': ls_updateLink, 'click': go_self.Updater.doManualUpdate });
		};
		
		go_self.Options.addWrapper('updateOptions', { id: 'core.optionPanel.section.update.title' }, 1);
		go_self.Options.addSelect('updateInterval', 'updateOptions', 'generalOptions', 3600, { id: 'core.optionPanel.section.update.label.interval.description' }, _ga_updateIntervalOpts, {});
		go_self.Options.addSelect('updateNotifyLevel', 'updateOptions', 'generalOptions', 0, { id: 'core.optionPanel.section.update.label.notifyLevel.description' }, _ga_updateNotifyLevelOpts, {});
		go_self.Options.addHTML('manualUpdateLink', 'updateOptions', 'manualUpdate', { thisReference: go_self, callback: _searchUpdates });
		
		/*-------------------------------------*
		 * Check automatically for new updates *
		 *-------------------------------------*/
		
		setTimeout(async function() {
			var li_lastCheck	= await go_self.myGM.getValue('updater_lastUpdateCheck', 0);
			var li_millis		= (new Date()).getTime();
			var li_diff			= li_millis - li_lastCheck;
			var li_interval		= go_self.Options.getOption('updateOptions', 'updateInterval') * 1000;
			
			// Greasyfork allows updatechecks only every 24 hours.
			li_interval = li_interval < 86400 ? 86400 : li_interval; 
		
			if(li_interval > 0 && li_diff > li_interval) {
				_gb_manualUpdate = false;

				go_self.myGM.setValue('updater_lastUpdateCheck', li_millis + '').then(function () { go_self.Updater.checkForUpdates(); });
			}
		}, 0);
	}
	
	/**
	 * Updater to check for updates.
	 * 
	 * @instance
	 * 
	 * @type	IkariamCore~Updater
	 */
	this.Updater = new Updater();
	
	this.con.logTimeStamp('IkariamCore.Updater created');
	
	this.con.logTimeStamp('IkariamCore display error functions initiated');
	this.con.groupEnd();
}
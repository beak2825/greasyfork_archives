// ==UserScript==
// @name        Tatoeba Markdown Editor (new)
// @namespace   Jakob V. <jakov@gmx.at>
// @description Adds MarkEdit to Tatoeba and parses markdown comments as HTML
// @include     http*://tatoeba.org/*
// @include     http*://*.tatoeba.org/*
// @version     1
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require		   http://code.jquery.com/jquery-1.8.3.js
// @require		   http://code.jquery.com/ui/1.8.24/jquery-ui.js
// @require      https://greasyfork.org/scripts/9431-tatoeba-jquery-ui-css-for-require/code/Tatoeba%20jQuery%20UI%20CSS%20for%20@require.js?version=48895
// @require      https://greasyfork.org/scripts/9546-js-pandoc-for-require/code/js-pandoc%20for%20@require.js?version=48894
// @require		   https://greasyfork.org/scripts/9434-markdown-editor-rehost-for-userscript-integration/code/Markdown%20Editor%20rehost%20for%20userscript%20integration.user.js
// @require      https://greasyfork.org/scripts/9547-diff-match-patch-for-require/code/diff_match_patch-for-require.js?version=48896
// @require https://greasyfork.org/scripts/9431-tatoeba-jquery-ui-css-for-require/code/Tatoeba%20jQuery%20UI%20CSS%20for%20@require.js?version=48895
// @downloadURL https://update.greasyfork.org/scripts/9424/Tatoeba%20Markdown%20Editor%20%28new%29.user.js
// @updateURL https://update.greasyfork.org/scripts/9424/Tatoeba%20Markdown%20Editor%20%28new%29.meta.js
// ==/UserScript==
  

// The MIT License
// 
// Original WMD and Showdwon code copyright (c) 2007 John Fraser
// Toolbar images (c) 2009 Dana Robinson
// MarkEdit jQuery rewrite and modified images (c) 2009 Titus Stone
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
//



  console.log('asdf');

// load and save users using markdown
if(true){
  // define default variables
	default_markdownusers = {
		'jakov': true,
		'Esperantostern': true,
		'sacredceltic': true
	};
	default_markdownusers = JSON.stringify(default_markdownusers);

	// get saved variables
	markdownusers = GM_getValue('markdownusers');
	markdownusers = markdownusers || default_markdownusers;
	markdownusers = JSON.parse(markdownusers);
	console.log('markdownusers: ' + JSON.stringify(markdownusers));
}

// add CSS
if(true){
	var css = resourcevar + "\
	.markedit { clear: both; display: inline-block; } \
	.markedit textarea { width: 100%; } \
	.markedit-toolbar { padding: 0.3em; margin: 0; clear: both; height: 22px; border-radius: 8px 8px 0px 0px; -moz-border-radius: 8px 8px 0px 0px;} \
	.markedit-toolbar .toolbar-group { margin-right: 0.5em; padding: 0 0 0 5px; float: left; } \
	.markedit-toolbar .toggle-group {  } \
	.markedit-toolbar .toggle-group button { font-size: 0.85em; font-weight: bold; padding: 0.15em 0.5em; } \
	.markedit-toolbar .toggle-group button:first-child { -moz-border-radius: 11px 0 0 11px; border-radius: 11px 0 0 11px; } \
	.markedit-toolbar .toggle-group button:last-child { -moz-border-radius: 0 11px 11px 0; border-radius: 0 11px 11px 0; } \
	.markedit-toolbar button { height: 22px; outline: 0; cursor: pointer; } \
	.markedit-toolbar button.icon { width: 22px; background-repeat: no-repeat; margin: 0 5px 0 0; } \
	.markedit .light-bg button.icon { background-image: url(images/wmd-buttons.png); } \
	.markedit .dark-bg button.icon { background-image: url(images/wmd-buttons-dark.png); } \
	.markedit-toolbar button.bold { background-position: 0px 0px; } \
	.markedit-toolbar button.italic { background-position: -20px 0px; } \
	.markedit-toolbar button.link { background-position: -40px 1px; } \
	.markedit-toolbar button.quote { background-position: -60px 0px; } \
	.markedit-toolbar button.code { background-position: -80px 1px; } \
	.markedit-toolbar button.image { background-position: -100px 1px; } \
	.markedit-toolbar button.numberlist { background-position: -120px 0px; } \
	.markedit-toolbar button.bulletlist { background-position: -140px 0px; } \
	.markedit-toolbar button.heading { background-position: -160px 0px; } \
	.markedit-toolbar button.line { background-position: -180px 0px; } \
	.markedit-toolbar button.undo { background-position: -200px 0px; } \
	.markedit-toolbar button.redo { background-position: -220px 0px; } \
	.markedit-toolbar button.help { background-position: -240px 0px; } \
	.markedit-dialog { font-size: 0.75em; } \
	.markedit-dialog input { width: 100%; } \
	.markedit-preview { padding: 15px; } \
	\
	/* Selectmenu */ \
	.ui-selectmenu { display: block; display: inline-block; position: relative; height: 2.2em; vertical-align: middle; text-decoration: none; overflow: hidden; zoom: 1; } \
	.ui-selectmenu-icon { position:absolute; right:6px; margin-top:-8px; top: 50%; } \
	.ui-selectmenu-menu { padding:0; margin:0; position:absolute; top: 0; display: none; z-index: 1005;} /* z-index: 1005 to make selectmenu work with dialog */ \
	.ui-selectmenu-menu	 ul { padding:0; margin:0; list-style:none; position: relative; overflow: auto; overflow-y: auto ; overflow-x: hidden; -webkit-overflow-scrolling: touch;}	\
	.ui-selectmenu-open { display: block; } \
	.ui-selectmenu-menu-popup { margin-top: -1px; } \
	.ui-selectmenu-menu li { padding:0; margin:0; display: block; border-top: 1px dotted transparent; border-bottom: 1px dotted transparent; border-right-width: 0 !important; border-left-width: 0 !important; font-weight: normal !important; } \
	.ui-selectmenu-menu li a,.ui-selectmenu-status { line-height: 1.4em; display: block; padding: .405em 2.1em .405em 1em; outline:none; text-decoration:none; } \
	.ui-selectmenu-menu li.ui-state-disabled a, .ui-state-disabled { cursor: default; } \
	.ui-selectmenu-menu li.ui-selectmenu-hasIcon a, \
	.ui-selectmenu-hasIcon .ui-selectmenu-status { padding-left: 20px; position: relative; margin-left: 5px; } \
	.ui-selectmenu-menu li .ui-icon, .ui-selectmenu-status .ui-icon { position: absolute; top: 1em; margin-top: -8px; left: 0; } \
	.ui-selectmenu-status { line-height: 1.4em; } \
	/*.ui-selectmenu-menu li span,.ui-selectmenu-status span { display:block; margin-bottom: .2em; } */\
	.ui-selectmenu-menu li .ui-selectmenu-item-header { font-weight: bold; } \
	.ui-selectmenu-menu li .ui-selectmenu-item-footer { opacity: .8; } \
	/* for optgroups */ \
	.ui-selectmenu-menu .ui-selectmenu-group { font-size: 1em; } \
	.ui-selectmenu-menu .ui-selectmenu-group .ui-selectmenu-group-label { line-height: 1.4em; display:block; padding: .6em .5em 0; font-weight: bold; } \
	.ui-selectmenu-menu .ui-selectmenu-group ul { margin: 0; padding: 0; } \
	/* IE6 workaround (dotted transparent borders) */ \
	* html .ui-selectmenu-menu li { border-color: pink; filter:chroma(color=pink); width:100%; } \
	* html .ui-selectmenu-menu li a { position: relative } \
	/* IE7 workaround (opacity disabled) */ \
	*+html .ui-state-disabled, *+html .ui-state-disabled a { color: silver; } \
	\
	/* selectmenu Tatoeba */ \
	.ui-selectmenu-status { line-height: 0.7em; } \
	.ui-selectmenu { height: 1.5em;} \
	.ui-selectmenu a { width: auto !important; } \
	.ui-button { padding: 0.1em 0.2em !important; } \
	.ui-button-text { padding: 0.1em 0.2em !important; } \
	.ui-selectmenu-status .languageFlag { float: none; margin: 0; vertical-align: text-bottom; } \
	.ui-selectmenu { height: auto !important; width: auto !important; } \
	.ui-selectmenu-menu li a, .ui-selectmenu-status { padding: 0.3em 1.6em 0.3em 0.8em; } \
	/*.search_bar a { color: #257D0C !important; } \
	.search_bar .select, .search_bar .input { width: auto !important; } \
	.search_bar fieldset { float: left; } */ \
	\
	.markedit .light-bg button.icon { background-image: url('data:image/png;base64,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'); } .markedit .dark-bg button.icon { background-image: url('data:image/png;base64,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'); } \
	\
	textarea, .unparsedmarkdown { font-family: monospace; } \
	\
	pre.unparsedmarkdown { white-space: pre-wrap; } \
	.unparsedmarkdown br { display: none; } \
	.profileDescription .unparsedmarkdown { font-size: 1.3em; } \
	.privateMessage div.body { font-size: 1.1em; } \
	.privateMessage pre.body { font-size: 1.2em; } \
	.sticky .unparsedmarkdown { border: 1px solid grey; } \
	.parsedmarkdown { padding: 15px; } \
	.parsedmarkdown blockquote, .markedit-preview blockquote { border-left: 0.3em solid #BBBBBB; margin:0.5em 0;	padding: 0 1.1em; } \
	.parsedmarkdown > :first-child { margin-top: 0 !important; } \
	.parsedmarkdown > :last-child { margin-bottom: 0 !important; } \
	.parsedmarkdown li { margin: 0.2em 0 !important; } \
	.parsedmarkdown p { margin: 0.2em 0 !important; } \
	#WallContent { /* max-width: 508px;*/ } \
	.parsedmarkdown ul, .parsedmarkdown ol	{ padding-left: 3em; } \
	.parsedmarkdown ul { list-style: disc; } \
	\
	.parsedmarkdown ul, .parsedmarkdown ol	{ padding-left: 3em; } \
	.parsedmarkdown ul { list-style: disc; } \
	\
	#sendMessageForm .markedit textarea, .replyFormDiv .markedit textarea, .markedit textarea { min-width: 388px; margin: 3px 0; } \
	#SentenceCommentSaveForm textarea, #sendMessageForm textarea { width: 508px; } \
	.replyFormDiv textarea { width: 508px; width:100%; } \
	#WallSaveForm textarea { width: 508px; } \
	#PrivateMessageContent { width: 560px; } \
	#PrivateMessageSendForm .input.text { clear:both; display: inline-block; width: 100%; } \
	#PrivateMessageSendForm .input.text label { width:auto; } \
	#PrivateMessageSendForm .input.text input { float: right; width: 455px; } \
	#PrivateMessageSendForm { /* display: table; */ } \
	label:empty { display: none; } \
	 #SentenceCommentSaveForm textarea { width: auto; } \
	.markedit-preview { margin-bottom: 3px; } \
	\
	a[href^='/tags/show_sentences_with_tag/'] { background: none repeat scroll 0 0 #FFE684; border-bottom: 1px solid #DDDDDD; border-radius: 5px 5px 5px 5px; border-right: 1px solid #DDDDDD; padding: 2px 8px; color: #333333 !important; font-size: 1.2em;} \
	\
	a[href^='/user/profile/'] { } \
	a[href^='/sentences/show/'] { } \
	\
	a[href^='/tags/show_sentences_with_tag/']:before { content:'#'; } \
	a[href^='/user/profile/']:before { content:'@'; } \
	a[href^='/sentences/show/']:before { content:'?'; } \
	\
	.comp { padding:2px 8px; line-height:25px; background-color: #FBFFC9; border-bottom: 1px solid #DDDDDD; border-right: 1px solid #DDDDDD; border-radius:3px; } \
	.comp del, .patch del {color:red; background-color: #FFE6E6;} \
	.comp ins, .patch ins {color:green; background-color: #E6FFE6;} \
	.comp .before ins, .patch .before ins {display:none;} \
	.comp .after del, .patch .after del {display:none;} \
	\
	.autocorrect .ui-selectmenu { display: block; } \
	.autocorrect { font-size: 0.8em; margin-bottom: 3px; } \
	.autocorrect .patch { width: auto; width: -moz-available; display: inline-table !important; font-family: monospace; white-space:pre-wrap; } \
	.autocorrect .patch > span { display: table-cell !important; text-align:left;} \
	.autocorrect .patch .gets { font-size: x-large !important; } \
	.dropdown { border: 1px solid red; height: 100%; margin-top: -1px; position: absolute; right: -1px; top: 0; width: 26px; } \
	\
	a { -moz-transition: text-shadow 0.5s ease 0s; text-shadow: none;} \
	a:hover { text-shadow: 0 0 2px #89C140; } \
	\
	.parsedmarkdown table, .markedit-preview table { width: auto; } \
	.parsedmarkdown th, .parsedmarkdown td, .markedit-preview th, .markedit-preview td { border: 1px solid black; } \
	a:hover .markdownmark.solid path { fill: #FB6B10 !important; } \
	a:hover .markdownmark.normal path { fill: #FB6B10 !important; } \
	a:hover .markdownmark.normal rect { stroke: #FB6B10 !important; } \
	";
	GM_addStyle(css);
  }

if(true){
	// diff_match_patch
	// the function that outputs the pretty html for the diffs
	diff_match_patch.prototype.diff_prettyHtml = function (diffs) {
		var html = [];
		var i = 0;
		for (var x = 0; x < diffs.length; x++) {
			var op = diffs[x][0]; // Operation (insert, delete, equal)
			var data = diffs[x][1]; // Text of change.
			var text = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '&para;<BR>');
			switch (op) {
			case DIFF_INSERT:
				html[x] = '<ins>' + text + '</ins>';
				break;
			case DIFF_DELETE:
				html[x] = '<del>' + text + '</del>';
				break;
			case DIFF_EQUAL:
				html[x] = '<span>' + text + '</span>';
				break;
			}
			if (op !== DIFF_DELETE) {
				i += data.length;
			}
		}
		return html.join('');
	};

	// http://stackoverflow.com/questions/8584098/how-to-change-an-element-type-using-jquery
	$.fn.changeElementType = function(newType) {
		var attrs = {};

		$.each(this[0].attributes, function(idx, attr) {
			attrs[attr.nodeName] = attr.nodeValue;
		});
 
		var newelement = $("<" + newType + "/>", attrs).append($(this).contents());
		this.replaceWith(newelement);
		return newelement;
	};

//http://stackoverflow.com/questions/202605/repeat-string-javascript
String.prototype.repeat = function(count) {
	if (count < 1) return '';
	var result = '', pattern = this.valueOf();
	while (count > 0) {
		if (count & 1) result += pattern;
		count >>= 1, pattern += pattern;
	}
	return result;
};

function linum2int(input) { //jakob
	input = input.replace(/[^A-Za-z]/, '');
	output = 0;
	for (i = 0; i < input.length; i++) {
		output = output * 26 + parseInt(input.substr(i, 1), 26 + 10) - 9;
	}
	console.log('linum', output);
	return output;
}

function int2linum(input) { //jakob
	// There's a quicker function that does the same on stackoverflow, but i wrote this one myself and im not sure about the license of the other one
	// http://stackoverflow.com/questions/8603480/how-to-create-a-function-that-converts-a-number-to-a-bijective-hexavigesimal/11506042#11506042
	var zeros = 0;
	var next = input;
	var generation = 0;
	while (next >= 27) {
		next = (next - 1) / 26 - (next - 1) % 26 / 26;
		zeros += next * Math.pow(27, generation);
		generation++;
	}
	output = (input + zeros).toString(27).replace(/./g, function ($0) {
		return '_abcdefghijklmnopqrstuvwxyz'.charAt(parseInt($0, 27));
	});
	return output;
}

function roman2int(input) { //jakob

	romans = {
		'm': 1000,
		'd': 500,
		'c': 100,
		'l': 50,
		'x': 10,
		'v': 5,
		'i': 1
	};
	input = input.replace(/[^A-Za-z]/, '').toLowerCase();
	output = 0;
	highest = false;
	for (i = input.length - 1; i >= 0; i--) {
		num = romans[input.substr(i, 1)] || 0;
		highest = (num > highest ? num : highest);
		output = (num < highest ? (output - num) : (output + num));
	}
	return output;
}

function int2roman(number) {
	// http://www.blackwasp.co.uk/NumberToRoman_2.aspx
	result = "";
	values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
	numerals = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i"];

	for (i = 0; i < 13; i++) {
		while (number >= values[i]) {
			number -= values[i];
			result += numerals[i];
		}
	}
	return result;
}

}

// Tatoeba specific Text-manipulation
if(true){
  
 function tatoebaundo(text) {
		  //console.log(text);

		// undo the link shortening and fix its bugs
		// replace shortened link within inline markdown links or images
		// text = text.replace(/\(<a href="(.*?)">(.*?)<\/a>\)/gi, '\($1\)');
		
// repair markdown forced links <http://example.com>
		text = text.replace(/&lt;<a href="(.*?)%3E">(.*?)&gt;<\/a>;/gim, function($0, $1, $2){ return '<'+unescape($1)+'>';});
		
		// repair link detection errors
		text = text.replace(/<a href="(.*?&amp;)">(.*?)<\/a>;/gim, function($0, $1, $2){ return '<'+unescape($1)+'>';});

// replace shortened link with its URL
	   text = text.replace(/<a href="(.*?)">(.*?)<\/a>/gi, function($0, $1, $2){ return '<'+unescape($1)+'>';});
	   
		// remove forced linebreaks (<br>)
		text = text.replace(/(<br\/*>)+/gim, "");

		// replace shortened link within reference markdown links or images
		text = text.replace(/\[(.*)\]\: <a href="(.*)">(.*)<\/a>/gi, '[$1]: $2');

	
		return text;
	}
  
  

function tatoedown(text) {

		// mimik Tatoeba's HTML denial by displaying angle brackets as they are
		// this will be later reenabled further down, but in the end we maybe don't even want html to be parsed!!!
		text = text.replace(/</gim, "&lt;").replace(/>/gim, "&gt;");

		// reenable html (Tatoeba doesn't allow HTML, so it displays the angle brackets as &lt; and &gt;)
		// however in the end we maybe don't even want html to be parsed!!!
		text = text.replace(/&lt;/gim, "<").replace(/&gt;/gim, ">");

  
		// convert wiki-style headers "== header ==" with markdown style headers
		text = text.replace(/^\s*= (.*?) =\s*$/gim, '# $1 #').replace(/^\s*== (.*?) ==\s*$/gim, '## $1 ##').replace(/^\s*=== (.*) ===\s*$/gim, '### $1 ###').replace(/^\s*==== (.*?) ====\s*$/gim, '#### $1 ####').replace(/^\s*====== (.*?) ======\s*$/gim, '###### $1 ######').replace(/^\s*======= (.*?) =======\s*$/gim, '####### $1 #######');

  
		return text;
	}
}

// Markdown preview
if(true){
	//
	//	$.markeditGetHtml
	//
	$.fn.markeditGetHtml = function () {

		/*
		// Load Showdown if it's not loaded
		if (typeof(MarkEditShowDown) === 'undefined') {
			if (typeof(Attacklab) === 'undefined') {
				throw 'Showdown.js (Attacklab.showdown) must be loaded before MarkEdit.';
			}
			MarkEditShowDown = new Attacklab.showdown.converter();
		}*/

		// Render the preview
		var textarea = MarkEdit.getTextArea(this);
		var text = $(textarea).val();
		if (typeof (text) !== 'undefined') {

			var text = $(this).val();

			var html = Pandoc(tatoedown(tatoebaundo(text)));
			// html = html.replace(/\r/g, '');
			/* //this seems to be unneccessary for Tatoeba purposes
			// Convert newlines to <br/> inside a <p>
			var lineBreakInP = /(<p>(?:[\S\s](?!<\/p>))*)\n([\S\s]*?<\/p>)/g;
			var lineBreaksRemaining = lineBreakInP.exec(html);

			while (lineBreaksRemaining !== null) {
				html = html.replace(lineBreakInP, '$1<br />$2');
				lineBreaksRemaining = lineBreakInP.exec(html);
			}
			*/

			return html;
		} else {
			return '';
		}

	};
  
}

// enable MarkEdit with live preview 
$('#SentenceCommentText, #WallContent, #UserDescription, #PrivateMessageContent').addClass('markedittextarea').markedit({
		'preview': 'below',
		'toolbar': {
			'backgroundMode': 'light',
			'layout': 'bold italic | link quote code image | numberlist bulletlist heading line | cite-sentence',
			'buttons': [{
				// prepare the link toggle button
				// this should toggle between endnote and inline link
				// doesn'T work at all yet
				'id': 'linktoggle',
				'css': 'icon ui-state-default ui-corner-all',
				//ui-icon ui-icon-transferthick-e-w
				'tip': 'click to toggle between endnote style and inline style',
				'click': function () {
					//markedit = $(this).parentsUntil('.markedit').parent();
					//markedit.markeditSetLinkOrImage('http://example.com');
				},
				'mouseover': function () {},
				'mouseout': function () {}
			}, {
				'id': 'cite-sentence',
				'css': 'icon ui-state-default ui-corner-all',
				//ui-icon ui-icon-transferthick-e-w
				'tip': 'cite the main sentence',
				'click': function () {
					//find the textarea
					thetextarea = $('.markedittextarea');
					state = thetextarea.markeditGetState();

					// insert sentence citation (the selection will be the proposed change;
					// if it's empty the whole sentence will be copied)
					state.beforeSelect = state.beforeSelect + '"' + $('.mainSentence .sentenceContent .text').text() + '" --> "';
					state.select = (state.select == "" ? $('.mainSentence .sentenceContent .text').text() : state.select);
					state.afterSelect = '"' + state.afterSelect;

					thetextarea.markeditSetState(state);
				},
				'mouseover': function () {},
				'mouseout': function () {}
			}],
		}
	});

	var profile = (window.location.href.split('/')[4] == 'user' && window.location.href.split('/')[5] == 'profile');

	if (profile == true) {
		user = $('.profileSummary .username').text().trim();
	} else {
		user = '_';
	}

$('.comments .commentText, .wall .message .body, .profileDescription .content, .privateMessage .body').each(function ()
{
		// determine the author of a comment or post
		if (profile == true) {
			author = user;
		} else {
			author = $(this).parentsUntil('li').parent().find('.meta .author:first').text().trim();
		}
		console.log(author);
		text = $(this).html();

		// trim leading and trailing whitespace to avoid interpretation like code-blocks  
		if($(this).is('.commentText')){
			text = text.substring(9, text.length-8);
		}
		else if($(this).parent().is('.root')){
			text = text.substring(16, text.length-14);
		}
		else if($(this).parent().is('.privateMessage')){
			text = text.substring(9, text.length-8);
		}
		else if($(this).parentsUntil('.replies').parent().is('.replies')){
			text = text.substring(17, text.length-12);
		}


		text = text.replace(/<br\/?>/g,'');
		$(this).html(text);
		
		

		// prepare for parsing:
		text = Pandoc(tatoedown(tatoebaundo(text)));

		// old parsing
		// MarkEditShowDown = new Attacklab.showdown.converter();
		// parsedmarkdown = $('<div class="parsedmarkdown"></div>').html(MarkEditShowDown.makeHtml(text));

		// create the new element
		parsedmarkdown = $('<div class="parsedmarkdown"></div>').html(text);
		// copy the CSS classes to the new element
		parsedmarkdown.addClass($(this).attr("class")).hide();
		// hide the new element and put it below the original 
		var pre = $(this);
		pre.after(parsedmarkdown);
		pre = pre.changeElementType("pre");
		pre.addClass('unparsedmarkdown');
		
		// add classes for later control of visibility
		//console.log(markdownusers[author]);
		if (markdownusers[author] == true) {
			pre.addClass('md_force');
			parsedmarkdown.addClass('md_force');
		} else if (markdownusers[author] == false) {
			pre.addClass('md_deny');
			parsedmarkdown.addClass('md_deny');
		} else {
			pre.addClass('md_normal');
			parsedmarkdown.addClass('md_normal');
		}
	});

if(true){
	// This mark was designed by Dustin Curtis, a villain. http://twitter.com/dcurtis
	markdownmark_normal = '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="14" viewBox="0 0 208 128" style="vertical-align: text-bottom;" class="markdownmark normal"> <rect style="fill:none;stroke:white;stroke-width:10" width="198" height="118" x="5" y="5" ry="10" /> <path style="fill:white" d="m 30,98 0,-68 20,0 20,25 20,-25 20,0 0,68 -20,0 0,-39 -20,25 -20,-25 0,39 z" /> <path style="fill:white" d="m 155,98 -30,-33 20,0 0,-35 20,0 0,35 20,0 z" /> </svg>';
	markdownmark_solid = '<?xml version="1.0" encoding="utf-8"?> <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="14" viewBox="0 0 208 128" style="vertical-align: text-bottom;" class="markdownmark solid"> <path d="M 15,0 C 6.7764862,0 0,6.7764862 0,15 l 0,98 c 0,8.22351 6.7764862,15 15,15 l 178,0 c 8.22351,0 15,-6.77649 15,-15 l 0,-98 C 208,6.7764862 201.22351,0 193,0 L 15,0 z m 15,30 20,0 20,25 20,-25 20,0 0,68 -20,0 0,-39 -20,25 -20,-25 0,39 -20,0 0,-68 z m 115,0 20,0 0,35 20,0 -30,33 -30,-33 20,0 0,-35 z" style="fill:white;" /> </svg>';
	
	// create a toggle "button" for switching between "on" and "all off"
	md_button = $('<a class="menuSection" id="md_button"><span class="state"></span>md<span id="mduser"></span></a>');
	md_button.html(markdownmark_normal);
	// add it a list called "menu"
	menu = $('<li id="md"></li>').append(md_button);
	// put it before the user menu in the navigation bar
	$('#user_menu > ul').prepend(menu);
	
		// the toggle function
	md_button.click(function () {
		console.log('md_button click');
		// get saved variables
		markdownusers = GM_getValue('markdownusers');	
		markdownusers = markdownusers || default_markdownusers;
		markdownusers = JSON.parse(markdownusers);
		console.log('markdownusers: ' + JSON.stringify(markdownusers));
		// the '#' variable represents the on or all-off toggle
		// if the current state was "on" switch to "all-off"
		if (markdownusers['#'] == true) {
			console.log('all-off');
			// hide all parsed stuff in "all-off" state
			$('.parsedmarkdown, .markedit-preview').hide();
			$('.unparsedmarkdown').show();
			// update the button
			$('.state').html(markdownmark_solid);
			$('#md_button').html(markdownmark_solid);
			// for saving the state
			markdownusers['#'] = false;
		}
		// if the current state was "all-off", or not set, switch to "on"
		else {
			console.log('on');
			// switch the parsing on according to the current mode
			if (markdownusers['_'] == true) {
				$('.md_force').toggle();
			} else if (markdownusers['_'] == false) {
				$('.md_force, .md_normal, .md_deny').toggle();
			} else {
				$('.md_force, .md_normal').toggle();
			}
			// the preview shows in all modes when state is on
			$('.markedit-preview').show();
			// update the button
			$('.state').html(markdownmark_normal);
			$('#md_button').html(markdownmark_normal);
			// for saving the state
			markdownusers['#'] = true;
		}
		// save the new state
		GM_setValue('markdownusers', JSON.stringify(markdownusers));
	});
	

	// create the mode switcher links
	md_force = $('<li><a id="md_force"><span class="state"></span>force !</a> </li>');
	md_normal = $('<li><a id="md_normal"><span class="state"></span>normal .</a> </li>');
	md_deny = $('<li><a id="md_deny"><span class="state"></span>deny /</a> </li>');

	// create the mode switch list
	list = $('<ul class="sub-menu"></ul>');
	// add the mode switcher links to the mode switch list and put it to the menu
	menu.append(list.append(md_force, md_normal, md_deny));	
	
	
	// switch to "md_force" mode: only contributions by opt-in users will be parsed
	md_force.click(function () {
		console.log('md_force click');
		if (profile == true) {
			markdownusers[author] = true;
		} else {
			markdownusers['_'] = true;
		}
		// save the new mode
		GM_setValue('markdownusers', JSON.stringify(markdownusers));
		$('#md_normal, #md_normal, #md_deny').parent().show();
		$('#md_force').attr('disabled', 'disabled');
		$('#md_normal, #md_deny').removeAttr('disabled');
		$('#mduser').text("!");
		// click twice to unset and reset, so the navigation menu shows the right state
		md_button.click().click();
	});
	// switch to "md_normal" mode: all contributions except the opt-out users will be parsed
	md_normal.click(function () {
		console.log('md_normal click');
		if (profile == true) {
			delete markdownusers[author];
		} else {
			delete markdownusers['_'];
		}
		// save the new mode
		GM_setValue('markdownusers', JSON.stringify(markdownusers));
		$('#md_normal, #md_normal, #md_deny').parent().show();
		$('#md_normal').attr('disabled', 'disabled');
		$('#md_force, #md_deny').removeAttr('disabled');
		$('#mduser').text(".");
		// click twice to unset and reset, so the navigation menu shows the right state
		md_button.click().click();
	});
	// switch to "md_deny" mode: all contributions, even the opt-out users, will be parsed
	md_deny.click(function () {
		console.log('md_deny click');
		if (profile == true) {
			markdownusers[author] = false;
		} else {
			markdownusers['_'] = false;
		}
		// save the new mode
		GM_setValue('markdownusers', JSON.stringify(markdownusers));
		$('#md_normal, #md_normal, #md_deny').parent().show();
		$('#md_deny').attr('disabled', 'disabled');
		$('#md_force, #md_normal').removeAttr('disabled');
		$('#mduser').text("/");
		// click twice to unset and reset, so the navigation menu shows the right state
		md_button.click().click();
	});
	
	

	
}
if(false){

	if (profile == true) {
		if (markdownusers[author] === true) {
			md_force.click();
		} else if (markdownusers[author] === false) {
			md_deny.click();
		} else {
			md_normal.click();
		}
		$('#md_normal, #md_normal, #md_deny, #md_button').css({
			'font-style': 'italic'
		});
	} else {
		if (markdownusers['_'] === true) {
			md_force.click();
		} else if (markdownusers['_'] === false) {
			md_deny.click();
		} else {
			md_normal.click();
		}

	}


}
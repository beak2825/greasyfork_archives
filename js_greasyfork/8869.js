// ==UserScript==
// @name		Evernote Web HTML editor
// @namespace	http://andrealazzarotto.com/
// @version		3.2.4
// @description	This scripts adds a button to edit the HTML code of a note in Evernote Web
// @match		http://www.evernote.com/*Home.action*
// @match		https://www.evernote.com/*Home.action*
// @copyright	2015, Seb Maynard, Andrea Lazzarotto
// @license		Apache License, Version 2.0
// @require		https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/8869/Evernote%20Web%20HTML%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/8869/Evernote%20Web%20HTML%20editor.meta.js
// ==/UserScript==

/*
	This program is a modified version of the Evernote HTML Editor bookmarklet
	created by Seb Maynard and released as open source software under the
	Apache 2.0 license. You can download the original software here:

	https://gist.github.com/sebmaynard/8f9f6b33247ab2f4bc85
	http://seb.so/html-source-editor-for-evernote-web-a-bookmarklet/
*/

/*
	Copyright 2015 Seb Maynard, Andrea Lazzarotto

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

var icon_old = "iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAzUExURUxpcYiIiIiIiExpcYiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiNINviEAAAAQdFJOUwCqZgDdzBEiuzNVRJl3/4jEJrZZAAAAhUlEQVQY05WPwQ7DIAxDDQokAdr5/7+2gVbrusOkWbnwYmwAfiizfqNkj2NVYM/1tvnYN3Rq4/AFWiHNMQSayJIDGUtcg7xmgFHeLmW/XWfWtseSqX80WgL08bDKjD8VP5PoZKKj0DmRQtRt1oEXEqF2QzbGnMirLJQK+4Uiy5erMVIo5QACmwWhG+ikMQAAAABJRU5ErkJggg==";
var icon_new = "iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAMAAAAMs7fIAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAnUExURUxpcQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK/XnHYAAAAMdFJOUwBEuzPMd2aZIt2I7sVV9wMAAABUSURBVBjTpY7bCsAgDEOjzOvy/9+7por6NBg7SmhCWwr8orbThQjkgissrzKGWRhM0luSuHs0uHp8T8k+eNDqp8uoT6OjU24kCpO9kRieYCveE/IBzfcCeIwe7AAAAAAASUVORK5CYII=";

var wrapper, editor;

var theme = GM_getValue("editor_theme", "ace/theme/tomorrow_night");
var size = GM_getValue("editor_size", 16);

var basic_html_formatter = function(code) {
	var block_tags = "p|div|ol|ul|li|pre|blockquote|h[1-6]|table|thead|tbody|tr|td";
	code = code.replace(new RegExp("([^\n])(<[\/]?("+block_tags+")[^>]*>)", "g"), "$1\n$2");
	for (var i = 0; i<2; i++)
		code = code.replace(new RegExp("(<[\/]?("+block_tags+")[^>]*>)([^\n])", "g"), "$1\n$3");
	return code;
};

var getCurrentContent = function() {
	var content = $("#tinymce, #en-note", $("#en-common-editor-iframe, .RichTextArea-entinymce").contents()).first().clone();
	content.find("*").removeAttr("data-mce-style").removeAttr("data-mce-src").removeAttr("data-mce-href");
	return basic_html_formatter(content.html());
};
var setCurrentContent = function(content) {
	if(!$("table:has(input)").first().is(":visible")) // Activate the note editing mode again
		$("iframe.gwt-Frame").first().contents().find("body").click();
	$("#tinymce, #en-note", $("#en-common-editor-iframe, .RichTextArea-entinymce").contents()).first().html(content);
	$(".ennote", $("#en-common-editor-iframe, .RichTextArea-entinymce").contents()).first().html(content);
};
var toolbarTheme = function() {
	var style = {
		'Bright': {
			'text': '#404040',
			'border': '#ececec',
			'background': '#f8f8f8'
		},
		'Dark': {
			'text': '#c0c0c0',
			'border': '#404040',
			'background': '#202020'
		},
	};

	var label = $('#html_theme :selected').parent().attr('label');
	var colors = style[label];
	var toolbar = $("#html_code_toolbar");
	toolbar.find('#left_side input, #left_side select').css({
		'background': colors.background,
		'border': 0,
		'border-bottom': '2px solid ' + colors.border,
		'padding': '.25rem',
		'height': '2rem',
		'box-sizing': 'border-box'
	});
	toolbar.find("#btn_reset").css({
		'border-left': '1px solid ' + colors.border,
		'background': "transparent"
	});
	toolbar.find('*:not(.material-icons)').css({
		'color': colors.text,
		'font-family': 'gotham, helvetica, arial, sans-serif',
		'font-size': '.9rem',
		'outline': 'none'
	});
	toolbar.find('.material-icons').css({
		'color': colors.text,
		'font-size': '1.25rem',
		'vertical-align': 'middle'
	});
	toolbar.find('#html_icons').css('height', '3rem');
	toolbar.find('#btn_submit').css('color', 'white');
	toolbar.find('#left_side > *').css('margin-left', '1rem');
	toolbar.css({
		'border-bottom': '1px solid ' + colors.border,
		'background': colors.background
	});
	toolbar.find('input, select, i.material-icons').css('cursor', 'pointer');
};
var prepareTextArea = function() {
	wrapper = $(
        "<div id='html_code_editor'>" +
            "<div id='html_code_toolbar'>" +
				"<div id='left_side' style='float: left'>" +
					"<select id='html_theme'>" +
						"<optgroup label='Bright'>" +
							"<option value='ace/theme/chrome'>Chrome</option>" +
							"<option value='ace/theme/clouds'>Clouds</option>" +
							"<option value='ace/theme/crimson_editor'>Crimson Editor</option>" +
							"<option value='ace/theme/dawn'>Dawn</option>" +
							"<option value='ace/theme/dreamweaver'>Dreamweaver</option>" +
							"<option value='ace/theme/eclipse'>Eclipse</option>" +
							"<option value='ace/theme/github'>GitHub</option>" +
							"<option value='ace/theme/iplastic'>IPlastic</option>" +
							"<option value='ace/theme/solarized_light'>Solarized Light</option>" +
							"<option value='ace/theme/textmate'>TextMate</option>" +
							"<option value='ace/theme/tomorrow'>Tomorrow</option>" +
							"<option value='ace/theme/xcode'>XCode</option>" +
							"<option value='ace/theme/kuroir'>Kuroir</option>" +
							"<option value='ace/theme/katzenmilch'>KatzenMilch</option>" +
							"<option value='ace/theme/sqlserver'>SQL Server</option>" +
						"</optgroup>" +
						"<optgroup label='Dark'>" +
							"<option value='ace/theme/ambiance'>Ambiance</option>" +
							"<option value='ace/theme/chaos'>Chaos</option>" +
							"<option value='ace/theme/clouds_midnight'>Clouds Midnight</option>" +
							"<option value='ace/theme/cobalt'>Cobalt</option>" +
							"<option value='ace/theme/idle_fingers'>idle Fingers</option>" +
							"<option value='ace/theme/kr_theme'>krTheme</option>" +
							"<option value='ace/theme/merbivore'>Merbivore</option>" +
							"<option value='ace/theme/merbivore_soft'>Merbivore Soft</option>" +
							"<option value='ace/theme/mono_industrial'>Mono Industrial</option>" +
							"<option value='ace/theme/monokai'>Monokai</option>" +
							"<option value='ace/theme/pastel_on_dark'>Pastel on dark</option>" +
							"<option value='ace/theme/solarized_dark'>Solarized Dark</option>" +
							"<option value='ace/theme/terminal'>Terminal</option>" +
							"<option value='ace/theme/tomorrow_night'>Tomorrow Night</option>" +
							"<option value='ace/theme/tomorrow_night_blue'>Tomorrow Night Blue</option>" +
							"<option value='ace/theme/tomorrow_night_bright'>Tomorrow Night Bright</option>" +
							"<option value='ace/theme/tomorrow_night_eighties'>Tomorrow Night 80s</option>" +
							"<option value='ace/theme/twilight'>Twilight</option>" +
							"<option value='ace/theme/vibrant_ink'>Vibrant Ink</option>" +
						"</optgroup>" +
					"</select>" +
					"<span><input type='number' id='html_size' min='8' max='24' style='text-align: right'> px</span>" +
					"<span id='html_icons'>" +
						"<i class='material-icons' id='btn_find'>search</i>&nbsp;" +
						"<i class='material-icons' id='btn_replace'>find_replace</i>" +
					"</span>" +
				"</div>" +
				"<div id='right_side' style='float: right'>" +
					"<a target='_blank' style='margin-right: 2em' href='https://lazza.me/EvernotePremium20USD'>Get Premium for €20/$22 a year</a>" +
					"<input id='btn_reset' type='reset'/>" +
					"<input id='btn_submit' type='submit'/>" +
				"</div>" +
            "</div>" +
        "    <div id='html_code_area' />" +
        "</div>");
	wrapper.css({
		"z-index": "10000",
		"position": "fixed",
		"top": "0",
		"left": "0",
		"right": "0",
		"bottom": "0"
	});
	$("body").append(wrapper);

    $("#html_code_toolbar").css({
        'height': '3rem',
        'line-height': '3rem',
        'box-sizing': 'border-box',
        'border-bottom': '1px solid #404040',
		'background': '#080808'
    });
	$("#html_code_area").css({
		"width": "100%",
		"height": "calc(100% - 3rem)",
		"box-sizing": "border-box",
		"outline": 0
	});
	$("#html_theme").val(theme);
	$("#html_theme").change(function() {
		theme = $("#html_theme").val();
		GM_setValue("editor_theme", theme);
		editor.setTheme(theme);
		toolbarTheme();
	});
	$("#html_size").val(size);
	$("#html_size").change(function() {
		size = $("#html_size").val();
		GM_setValue("editor_size", size);
		editor.setOptions(cloneInto({fontSize: size + "px"}, unsafeWindow));
	});
	$("#right_side input").css({
		"border": 0,
		"background": "transparent",
		"height": "3rem",
		"min-width": "8rem",
		"display": "inline-block",
	});
	$("#btn_submit").css({
		"font-weight": "bold",
		"background": "#2dbe60",
		"color": "white"
	});
	$("#btn_find").click(function() { editor.execCommand("find"); });
	$("#btn_replace").click(function() { editor.execCommand("replace"); });
	toolbarTheme();

	editor = unsafeWindow.ace.edit("html_code_area");
  editor.setTheme(theme);
  editor.getSession().setMode("ace/mode/html");
	editor.setOptions(cloneInto({
		fontSize: size + "px",
		wrap: "free",
		enableBasicAutocompletion: true,
		scrollPastEnd: true,
		showPrintMargin: false,
		enableSnippets: true,
		enableLiveAutocompletion: true
	}, unsafeWindow));

	$("#btn_submit").click(function() {
		setCurrentContent(editor.getValue());
		wrapper.hide();
	});
	$("#btn_reset").click(function() {
		wrapper.hide();
	});

	wrapper.hide();
};

var placeButton = function() {
	// old Evernote Web
	var prev = $("table:has(input)").first().find("td:nth-of-type(9)");
	var code = "<td id='html_edit'></td>";
	var icon = icon_old;
	// new Evernote Web
	if(!prev.length) {
		prev = $("#gwt-debug-FormattingBar-strikeButton").parent();
		code = "<div id='html_edit'></div>";
		icon = icon_new;
	}
	if(!prev.length)
		return false;

	prepareTextArea();
	prev.after(code);
	var btn = $("#html_edit");
	btn.addClass(prev.attr('class'));
	btn.attr("style", prev.attr("style"));
	prev.find("div").first().clone().appendTo(btn);
	btn.find("input").remove();
	btn.find("div").attr("title", "HTML");
	btn.find("div").css("background-image", "url('data:image/png;base64,"+icon+"')");
	btn.click(function() {
		editor.setValue(getCurrentContent(), -1);
		wrapper.show();
	});
	return true;
};

$(document).ready(function() {
	$.getScript("https://cdn.rawgit.com/ajaxorg/ace-builds/v1.2.5/src-min-noconflict/ace.js").done(function(){
		$.getScript("https://cdn.rawgit.com/ajaxorg/ace-builds/v1.2.5/src-min-noconflict/ext-language_tools.js").done(function(){
			// Place the button at the end of the formatting options
			setTimeout(function() {
				if(!placeButton())
					setTimeout(arguments.callee, 400);
			}, 400);
		});
	});

	$('<link/>', {
	   rel: 'stylesheet',
	   href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
	}).appendTo('head');
});
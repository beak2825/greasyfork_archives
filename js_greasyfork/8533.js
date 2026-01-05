// ==UserScript==
// @author       Mobius Evalon
// @name         TrueAchievements improver
// @description  Improves and tinkers with the TrueAchievements website in various ways.
// @version      2.4
// @namespace    mobiusevalon.tibbius.com
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.26.0/js/jquery.tablesorter.min.js
// @include      /^https{0,1}:\/\/\w{0,}\.?trueachievements\.com.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8533/TrueAchievements%20improver.user.js
// @updateURL https://update.greasyfork.org/scripts/8533/TrueAchievements%20improver.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

var chained_functions = {
	"tinker_tokens":function() {
		$("#tinker_output").val(new Date().getTokenizedOutput($("#tinker_input").val()));
	},
	"matrix_preview":function() {
		if(uri() === "customize.aspx") return $("<img/>").attr({
			"src":"https://i.imgur.com/2nlpCY9.png",
			"title":"Sample session matrix",
			"alt":"Sample session matrix"
		})
		.css({
			"display":"block",
			"margin":"0px auto"
		});
	}
};

var help_topics = {
	tai_longdate:
		"<div id='tai_help_date_tokens'><p>The letters here are tokens that expand to date information.  They use the same tokens as <a href='https://php.net/manual/en/function.date.php' target='_blank'>PHP's date() function</a>, if you're familiar with it.</p>"+
		"<table>"+
		"<thead><tr><th>Token</th><th>Info</th></tr></thead>"+
		"<tbody>"+
		"<tr><td>d</td><td>The day of the month with leading zeroes</td></tr>"+
		"<tr><td>D</td><td>The name of the day, three letter abbreviation</td></tr>"+
		"<tr><td>j</td><td>The day of the month, no leading zeroes</td></tr>"+
		"<tr><td>l</td><td>The name of the day, full text</td></tr>"+
		"<tr><td>S</td><td>Ordinal suffix for the day of the month (the 'th' in 5th or the 'st' in 1st)</td></tr>"+
		"<tr><td>F</td><td>The name of the month, full text</td></tr>"+
		"<tr><td>m</td><td>The month number with leading zeroes</td></tr>"+
		"<tr><td>M</td><td>The name of the month, three letter abbreviation</td></tr>"+
		"<tr><td>n</td><td>The month number, no leading zeroes</td></tr>"+
		"<tr><td>Y</td><td>The year, four digits</td></tr>"+
		"<tr><td>y</td><td>The year, two digits</td></tr>"+
		"<tr><td>a</td><td>Lowercase meridiem (am/pm)</td></tr>"+
		"<tr><td>A</td><td>Uppercase meridiem (AM/PM)</td></tr>"+
		"<tr><td>g</td><td>The hour in the 12-hour meridiem rotation, no leading zeroes</td></tr>"+
		"<tr><td>G</td><td>The hour in the 24-hour military notation, no leading zeroes</td></tr>"+
		"<tr><td>h</td><td>The hour in the 12-hour meridiem rotation with leading zeroes</td></tr>"+
		"<tr><td>H</td><td>The hour in the 24-hour military notation with leading zeroes</td></tr>"+
		"<tr><td>i</td><td>Minutes with leading zeroes</td></tr>"+
		"<tr><td>s</td><td>Seconds with leading zeroes</td></tr>"+
		"<tr><td>[ ]</td><td>A proprietary format that 'fuzzies' the tokens inside</td></tr>"+
		"</tbody></table>"+
		"<p>If we assume it is currently Saturday April 30th at 1:15 PM, the token string 'D d M, H:i' would give you 'Sat 30 Apr, 13:15'.  If you use angle brackets you can fuzzy the date again.  For instance, '[D d M], H:i' would give you 'Today, 13:15'.</p>"+
		"<p>All unrecognized letters will be left alone, so you can insert commas or other symbols as you please.</p>"+
		"<p>You can tinker with the tokens in this textbox.  It will output the current date and time information on your system when used.</p>"+
		"<p><input type='text' id='tinker_input'><input type='button' data-action='tinker_tokens' value='->'><input type='text' id='tinker_output' disabled='disabled'></p></div>",
	tai_session_matrix:
		"<img data-dynamic-element='matrix_preview'>"+
		"<p>The achievement matrix exists to help players in a session keep track of each others' progress, especially for the host of such sessions.  The matrix will only appear in sessions that you have joined and that have more than one achievement in the session.</p>"+
		"<p>The matrix will not update until you click the <img src='/images/icons/refresh.png'> button.  This is because the code for the matrix must perform what is known as an XHR to load the complete achievement page for each gamer to update the display, and requiring a button click means you will not spam the TrueAchievements server with requests that you did not want to execute (such as looking at a past session.)</p>"+
		"<p>The achievements that this session was set up for appear along the top of the matrix.  Hovering over them will provide a tooltip with the achievement description, and clicking on one will open a new page for the achievement's solutions.</p>"+
		"<p>Clicking on a gamertag will compare your achievements in this game to theirs, unless you are clicking on your own gamertag in which case your achievement list for this game will be opened.  <span class='applied'>Gamers that are not confirmed appear greyed out.</span>  This happens when the gamer either has a pending application or they are a reserve for the session.</p>"+
		"<p><span class='icon-spacer-16 owned'></span> Gamer has unlocked this achievement.<br><span class='icon-spacer-16 not_owned'></span> Gamer has not unlocked this achievement.<br><span class='icon-spacer-16 unknown'></span> It is not known if the gamer has this achievement.<br>Achievements that are found to be owned by the script cannot be interacted with, but all unearned and unknown cells can be clicked to toggle the display.  This is to help you keep track during the session if you so choose.  Be aware that refreshing the matrix will discard the status of all cells that you have manually toggled.</p>"+
		"<p><img src='/images/icons/smiley-grin.png'> Gamer has 5% or less total poor feedback votes.<br><img src='/images/icons/smiley-neutral.png'> Gamer has between 5.1% and 14.9% poor feedback votes.<br><img src='/images/icons/smiley-mad.png'> Gamer has 15% or greater poor feedback votes.<br>\"Poor\" feedback votes are the sum of all neutral and negative votes.  Hover over the smiley icon to see the complete feedback information.</p>"+
		"<p><img src='/images/icons/gamerscore.png'> Gamer has cheated several games in the past but has not surpassed an arbitrary egregiousness threshold to have all of their achievements removed from the site.<br><img src='/images/icons/stop.png'> Gamer cheats egregiously and TrueAchievements has removed all of their statistics and achievements.  The achievements for these users will never update in the matrix.</p>"
};

var tai_css = "#tai_help_box {background-color: #e3e3e3; color: #000; width: 650px; height: 450px; position: fixed !important; top: 15vh; left: 25vw; z-index: 100; display: none; border-radius: 8px; border: 2px solid #000; overflow-x: hidden; overflow-y: scroll; cursor: move;} "+
    "#tai_help_box h1 {display: block; padding: 0px; margin: 5px 0px; font-size: 125%; text-align: center;} "+
    "#tai_help_box .content {padding: 4px;} "+
    "div.spoiler {border: 1px solid #000 !important; border-radius: 5px !important;} "+
    "div.spoiler span.tai_spoiler_header {display: inline-block; width: 100%; cursor: pointer; font-weight: bold; text-align: center;} "+
    "a.tai_video_url_header {display: block; margin: 0px auto; text-align: center; font-weight: bold;} "+
    "div.Comment img.tai_permalink_icon {float: right !important; width: 16px !important; height: 16px !important; border: none !important; padding: 0px !important; margin: 8px 2px 0px 5px !important;} "+
    "#tai_flag_button {margin-left: 0px !important;} "+
    "#tai_flag_button .droparrow {margin-left: 8px;} "+
    ".tai_pagetitle {margin: 0px !important;} "+
    ".tai_won_options, #tai_filter_buttons_container {margin: 0px 0px 10px 0px !important;} "+
    "#tai_filter_buttons_container a.button {position: relative !important;} "+
    ".tai_won_options td {padding-bottom: 0px !important;} "+
    ".tai_link_label {float: none !important; display: inline-block !important; width: 40px !important; margin: 0px 10px 0px 0px !important;} "+
    ".tai_achievement_ownership_filtered {display: none !important;} "+
    ".tai_warning_panel {cursor: pointer;} "+
    "#btnFlagFilter_Options, #tai_flag_filter {z-index: 100 !important;} "+
    "#menu_click_fallthrough {position: fixed; top: 0px; left: 0px; bottom: 0px; right: 0px; min-width: 100vw; min-height: 100vh; z-index: 75; display: none;} "+
    ".tai_help_button {display: inline-block; margin: 8px 0px 0px 4px; float: left; cursor: pointer;} "+
    "#tai_help_date_tokens table {border: 1px solid #000; margin-bottom: 10px;} "+
    "#tai_help_date_tokens table thead th {font-weight: bold; background-color: #000; color: #cdcdcd;} "+
    "#tai_help_date_tokens table tbody tr td {vertical-align: middle !important;} "+
    "#tai_help_date_tokens table tbody tr td:nth-child(1) {width: 50px !important; text-align: center;} "+
    "#tai_help_date_tokens table tbody tr {border-top: 1px solid #000;} "+
    "#tai_help_date_tokens input[type=text] {width: 125px !important;} "+
    "#tai_help_box #tai_close_help {position: absolute; top: 0px; left: 0px; padding: 3px; font-wight: bold; font-size: 115%;} "+
    ".tai_hide_row {margin-left: 10px; cursor: pointer;} "+
    ".tai_gwg {background-color: #ecf198 !important;} "+
    ".tai_gold {background-color: #98a7f1 !important;} "+
    ".tai_approx {background-color: #f19898 !important;} "+
    ".tablesorter-header {cursor: pointer; min-width: 40px;} "+
    ".tablesorter-headerDesc {background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAAP///////yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7); background-repeat: no-repeat; background-position: right;} "+
    ".tablesorter-headerAsc {background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAAP///////yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7); background-repeat: no-repeat; background-position: right;} "+
    ".asc-arrow-black {background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7); background-repeat: no-repeat; background-position: center; float: none !important; display: inline-block !important;} "+
    ".desc-arrow-black {background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7); background-repeat: no-repeat; background-position: center; float: none !important; display: inline-block !important;} "+
    "#tai_flag_filter li.fp div.achievement-sort .asc-arrow-black, #tai_flag_filter li.fp div.achievement-sort .desc-arrow-black {margin: 0px 0px 0px 15px !important;  border: 1px solid #000; border-radius: 2px; padding: 0px !important; width: 15px !important; height: 15px !important; } "+
    "#tai_achievement_matrix table {margin: 0px auto;} "+
    "#tai_achievement_matrix thead th {padding: 0px 5px 8px 5px;} "+
    "#tai_achievement_matrix td.actions img {display: inline-block; margin-right: 5px; vertical-align: middle;} "+
    "#tai_achievement_matrix td.gamertag .cheater-icon {display: inline-block; margin: 0px 4px; width: 16px; height: 16px; line-height: 16px; text-align: center;} "+
    "#tai_achievement_matrix thead th a {display: inline-block; white-space: nowrap; width: 16px; transform: translate(50%,15%) rotate(45deg); transform-origin: 0% 0%; direction: rtl; unicode-bidi: plaintext;} "+
    "#tai_achievement_matrix tbody td.actions {vertical-align: middle; text-align: right;} "+
    "#tai_achievement_matrix tbody td.gamertag {vertical-align: middle; text-align: right;} "+
    "#tai_achievement_matrix .not_owned, #tai_help_box .not_owned {background-color: #f5c6c6; border: 1px solid #000;} "+
    "#tai_achievement_matrix .owned, #tai_help_box .owned {background-color: #c6f5c6; border: 1px solid #000;} "+
    "#tai_achievement_matrix .unknown, #tai_help_box .unknown {background-color: #c6c6c6; border: 1px solid #000;} "+
    "#tai_achievement_matrix .cheater {text-decoration: line-through;} "+
    "#tai_achievement_matrix .applied, #tai_achievement_matrix .reserve, #tai_help_box .applied {opacity: 0.5;} "+
    "#tai_achievement_matrix .confirmed {} "+
    "#tai_achievement_matrix .status, #tai_achievement_matrix .icon-spacer-16, #tai_help_box .icon-spacer-16 {display: inline-block; width: 16px !important; height: 16px !important; margin-right: 5px; vertical-align: middle;} "+
    "#tai_achievement_matrix .status, #tai_achievement_matrix .icon-spacer-24, #tai_help_box .icon-spacer-24 {display: inline-block; width: 24px !important; height: 24px !important; margin-right: 5px; vertical-align: middle;} "+
    "#tai_achievement_matrix th.functions img {margin-right: 5px; cursor: pointer;} "+
	".tai_game_tile_40px {height: 40px; width: 40px;} "+
	".noscroll {overflow: hidden;} "+
	"#tai_solution_sort {margin: 0px 10px !important; width: auto !important;} "+
	"#tai_sort_dir {cursor: pointer;} "+
	".tai_hide_solution {cursor: pointer;} "+
	".tai_float_bookmark {position: absolute; margin-left: -15px;} "+
	".tai_pagination_wait {position: absolute; right: 0px;} "+
	".tai-hidden-post {border-top: 15px solid #eee; background-color: #f5c6c6;} "+
	".tai-hidden-quote {margin-bottom: 25px; background-color: #f5c6c6; text-align: center; border: 1px solid #c29d9d; border-radius: 5px;} "+
    ".spin-anim {animation-name: spin-anim; animation-duration: 1500ms; animation-iteration-count: infinite; animation-timing-function: linear;} "+
    "@keyframes spin-anim {from {transform:rotate(0deg);} to {transform:rotate(360deg);}} ";

Date.prototype.short_date = true;
Date.prototype.date_time = true;

Date.prototype.getMonthString = function() {
	switch(this.getMonth()) {
		case 0: return "January";
		case 1: return "February";
		case 2: return "March";
		case 3: return "April";
		case 4: return "May";
		case 5: return "June";
		case 6: return "July";
		case 7: return "August";
		case 8: return "September";
		case 9: return "October";
		case 10: return "November";
		case 11: return "December";
	}
};

Date.prototype.getShortMonthString = function() {
	return this.getMonthString().slice(0,3);
};

Date.prototype.getDayString = function() {
	switch(this.getDay()) {
		case 0: return "Sunday";
		case 1: return "Monday";
		case 2: return "Tuesday";
		case 3: return "Wednesday";
		case 4: return "Thursday";
		case 5: return "Friday";
		case 6: return "Saturday";
	}
};

Date.prototype.getShortDayString = function() {
	return this.getDayString().slice(0,3);
};

Date.prototype.getTwoDigitHours = function() {
	return zero_pad(this.getHours(),2);
};

Date.prototype.getTwoDigitMinutes = function() {
	return zero_pad(this.getMinutes(),2);
};

Date.prototype.getTwoDigitSeconds = function() {
	return zero_pad(this.getSeconds(),2);
};

Date.prototype.getTwoDigitDate = function() {
	return zero_pad(this.getDate(),2);
};

Date.prototype.getShortYear = function() {
	return (((""+this.getFullYear()).slice(-2))*1);
};

Date.prototype.getMeridiem = function() {
	return ((this.getHours() > 11) ? "pm" : "am");
};

Date.prototype.getMeridiemHours = function() {
	var h = this.getHours();
	if(h > 12) h -= 12;
	return h;
};

Date.prototype.getTwoDigitMeridiemHours = function() {
	return zero_pad(this.getMeridiemHours(),2);
};

Date.prototype.adjustDate = function(n) {
	this.setDate(this.getDate()+n);
};

Date.prototype.getDateAfterAdjustment = function(n) {
	this.adjustDate(n);
	return this.getDate();
};

Date.prototype.getFuzzyDay = function() {
	var d = new Date();
	if(d.getFullYear() === this.getFullYear() && d.getMonth() === this.getMonth()) {
		if(d.getDate() === this.getDate()) return "Today";
		else if(d.getDateAfterAdjustment(1) === this.getDate()) return "Tomorrow";
		else if(d.getDateAfterAdjustment(-2) === this.getDate()) return "Yesterday";
	}
	return "";
};

Date.prototype.outputLongDate = function() {
	return this.getTokenizedOutput(script_settings.long_date_format);
};

Date.prototype.outputShortDate = function() {
	return this.getTokenizedOutput(script_settings.short_date_format);
};

Date.prototype.outputLongDateTime = function() {
	return (this.outputLongDate()+", "+this.outputTime());
};

Date.prototype.outputShortDateTime = function() {
	return (this.outputShortDate()+", "+this.outputTime());
};

Date.prototype.outputTime = function() {
	return this.getTokenizedOutput(script_settings.time_format);
};

Date.prototype.getTokenizedOutput = function(t) {
	var r = "",
		i = -1;
	while(i++ < t.length) {
		switch(t.charAt(i)) {
			case 'd': {r += this.getTwoDigitDate(); break;}
			case 'D': {r += this.getShortDayString(); break;}
			case 'j': {r += this.getDate(); break;}
			case 'l': {r += this.getDayString(); break;}
			case 'S': {r += this.ordinalSuffix(this.getDate()); break;}
			case 'F': {r += this.getMonthString(); break;}
			case 'm': {r += zero_pad(this.getMonth()+1,2); break;}
			case 'M': {r += this.getShortMonthString(); break;}
			case 'n': {r += (this.getMonth()+1); break;}
			case 'Y': {r += this.getFullYear(); break;}
			case 'y': {r += this.getShortYear(); break;}
			case 'a': {r += this.getMeridiem(); break;}
			case 'A': {r += this.getMeridiem().toUpperCase(); break;}
			case 'g': {r += this.getMeridiemHours(); break;}
			case 'G': {r += this.getHours(); break;}
			case 'h': {r += this.getTwoDigitMeridiemHours(); break;}
			case 'H': {r += this.getTwoDigitHours(); break;}
			case 'i': {r += this.getTwoDigitMinutes(); break;}
			case 's': {r += this.getTwoDigitSeconds(); break;}
			case '[':
				var e = t.indexOf(']',i),
					f = this.getFuzzyDay();
				if(e > i && f.length) {
					r += f;
					i = e;
				}
				break;
			case ']': break;
			default: {r += t.charAt(i); break;}
		}
	}
	return r;
};

Date.prototype.ordinalSuffix = function(n) {
	n = Math.floor(n*1);

	var ord = "th";
	switch(n) {
		case 1: case 21: case 31:
			ord = "st";
			break;
		case 2: case 22:
			ord = "nd";
			break;
		case 3: case 23:
			ord = "rd";
			break;
	}
	return ord;
};

Date.prototype.toString = function() {
	var r = "";
	if(!this.short_date || script_settings.always_long_date) r += this.outputLongDate();
	else r += this.outputShortDate();

	if(this.date_time) r += (", "+this.outputTime());
	return r;
};

Array.prototype.removeItem = function(a) {
	var i = this.indexOf(a);
	if(i > -1) this.splice(i,1);
};

function datetime_master(obj) {
	var date = new Date(),
		short = false,
		time = true;

	if(!obj.hasOwnProperty("hour") || obj.hour === undefined) {obj.hour = "00"; time = false;}
	if(!obj.hasOwnProperty("minute") || obj.minute === undefined) obj.minute = "00";

	if(!obj.hasOwnProperty("year") || obj.year === undefined) {obj.year = date.getFullYear(); short = true;}
	else if(obj.year.length === 2) obj.year = ("20"+obj.year);
	if(!obj.hasOwnProperty("month") || obj.month === undefined) obj.month = date.getShortMonthString();
	if($.type(obj.day) === "string") obj.day = obj.day.toLowerCase();
	if(!obj.hasOwnProperty("day") || obj.day === undefined || obj.day === "today") obj.day = date.getDate();
	else if(obj.day === "yesterday") obj.day = date.getDateAfterAdjustment(-1);
	else if(obj.day === "tomorrow") obj.day = date.getDateAfterAdjustment(+1);

	date = new Date(obj.month+" "+obj.day+" "+obj.year+" "+obj.hour+":"+obj.minute);
	date.short_date = short;
	date.date_time = time;

	return date;
}

function short_datetime_callback() { // mon, jan 1 1900 at 00:00
	var len = arguments.length,
		date = datetime_master({year:arguments[len-5],month:arguments[len-6],day:(arguments[len-7]||arguments[len-8]),hour:arguments[len-4],minute:arguments[len-3]});
	return date.toString();
}

function short_date_callback() { // 1 jan 1900
	var len = arguments.length,
		date = datetime_master({year:arguments[len-3],month:arguments[len-4],day:(arguments[len-5]||arguments[len-6])});
	return date.toString();
}

function zero_pad(a,l) {
	var r = (""+a);
	while(r.length < l) r = ("0"+r);
	return r;
}

function plural(n) {
	n = Math.round(n*1);
	if(n != 1) return "s";
	return "";
}

function uri() {
	if(/\/n\d{3,6}\//i.test(window.location.href)) return "news";
	if(/\/a\d{3,6}\//i.test(window.location.href)) return "solutions";
	if(/\/[^/]+-walkthrough\.htm/i.test(window.location.href)) return "walkthrough.htm";
	var m = window.location.href.match(/\/([\w-]*\.(?:aspx|htm))(?:\?|#|$)/i);
	if(m !== null) return m[1];
	return "";
}

function json_obj(json) {
	var obj;
	if(typeof json === "string") {
		try {obj = JSON.parse(json);}
		catch(e) {console.log("Malformed JSON object.  Error message from JSON library: ["+e.message+"]");}
	}
	return obj;
}

function localstorage_obj(key) {
	var obj = json_obj(localStorage.getItem(key));
	if(typeof obj !== "object") localStorage.removeItem(key);
	return obj;
}

function default_settings() {
	return {
		hide_ads:true,
		normalize_dates:true,
		improve_chat:true,
		session_userlinks_compare:true,
		session_hide_user_statuses:true,
		feed_permalinks:true,
		fix_spoilers:true,
		settings_page_filter:true,
		display_video_links:true,
		short_date_format:"D d M",
		long_date_format:"d M Y",
		time_format:"H:i",
		always_long_date:false,
		solution_list_filters:true,
		achievement_page_improvements:true,
		session_achievement_matrix:true,
		solution_sorting:true,
		walkthrough_bookmarks:true,
		show_all_pages:true,
		block_users:true
	};
}

function store_settings() {
	localStorage.setItem("ta_improver_settings",JSON.stringify({
		hide_ads:checkbox("#tai_hide_ads"),
		normalize_dates:checkbox("#tai_dates"),
		improve_chat:checkbox("#tai_improve_chat"),
		session_userlinks_compare:checkbox("#tai_session_compare"),
		session_hide_user_statuses:checkbox("#tai_user_statuses"),
		feed_permalinks:checkbox("#tai_permalinks"),
		fix_spoilers:checkbox("#tai_spoilers"),
		settings_page_filter:checkbox("#tai_filter"),
		display_video_links:checkbox("#tai_video_links"),
		short_date_format:$("#tai_shortdate").val(),
		long_date_format:$("#tai_longdate").val(),
		time_format:$("#tai_time").val(),
		always_long_date:checkbox("#tai_always_longdate"),
		solution_list_filters:checkbox("#tai_solution_list_filter"),
		achievement_page_improvements:checkbox("#tai_improve_achievement_list"),
		session_achievement_matrix:checkbox("#tai_session_matrix"),
		solution_sorting:checkbox("#tai_sort_solutions"),
		walkthrough_bookmarks:checkbox("#tai_walkthrough_bookmarks"),
		show_all_pages:checkbox("#tai_show_all_pages"),
		block_users:checkbox("#tai_block_users")
	}));
}

function checkbox(id) {
	return ($("#divImprover "+id).prop("checked") === true);
}

function script_setting_display(id,type,value,name,tooltip) {
	var $element;
	if(type === "checkbox") $element = $("<input/>")
		.attr({
			"id":id,
			"type":"checkbox"
		})
		.prop("checked",(value === true)); // fast short circuit.  if the value is boolean and true, the box is checked. all other circumstances evaluate to boolean false (not checked)
	if(type === "textbox") $element = $("<input/>")
		.attr({
			"id":id,
			"type":"text"
		})
		.val(value);

		var $elem = $("<div/>")
			.append(
				$("<label/>")
					.attr({
						"class":"vlargelabel",
						"for":id
					})
					.append(
						$("<img/>")
							.attr({
								"src":"/images/icons/information.png",
								"alt":tooltip,
								"title":tooltip
							})
							.css({
								"width":"16px",
								"height":"16px",
								"margin-right":"4px"
							}),
						$("<span/>").text(name)
					),
				$("<div/>")
					.attr("class","singleline")
					.append($element)
			)
			.after(
				$("<div/>")
				.attr("class","clearboth")
			);
	if(help_topics.hasOwnProperty(id)) {
		$elem.append(
			$("<img/>")
				.attr({
					"class":"tai_help_button",
					"title":"Help",
					"alt":"Help",
					"src":"/images/icons/helper.png"
				})
				.click(function() {
					display_help_topic(id);
				})
		);
	}
	return $elem;
}

function display_help_topic(t) {
	$("#tai_help_box")
		.show()
		.find("div.content").first().html(help_topics[t]);
	$("#tai_help_box").find("*[data-action]").each(function() {
		$(this).click(function() {
			chained_functions[$(this).attr("data-action")]();
		});
	});
	$("#tai_help_box").find("*[data-dynamic-element]").each(function() {
		$(this).replaceWith(chained_functions[$(this).attr("data-dynamic-element")]());
	});
	//$("body").addClass("noscroll");
}

function intersect_arrays(s,t) {
	var r = [];
	if($.type(s) === "array" && $.type(t) === "array") {
		for(var i=0;i<t.length;i++) {
			if(s.indexOf(t[i]) > -1) r.push(t[i]);
		}
	}
	return r;
}

function toggle_panel(parent,child,position) {
	var $parent_elem = $(parent),
		$child_elem = $(child),
		$arrow = $parent_elem.children("span.droparrow").first();
	if($arrow.hasClass("icon-button-arrow-down")) {
		var pos_obj = {};

		$arrow.removeClass("icon-button-arrow-down").addClass("icon-button-arrow-up");
		if(position.x === "left") pos_obj.left = $parent_elem.position().left;
		else pos_obj.left = ($parent_elem.position().left-$child_elem.outerWidth()+$parent_elem.outerWidth());
		if(position.x === "top") pos_obj.top = ($parent_elem.position().top+$parent_elem.outerHeight());
		else pos_obj.top = ($parent_elem.position().top+$parent_elem.outerHeight());

		$("#menu_click_fallthrough").show();
		$child_elem
			.css(pos_obj)
			.show();
	}
	else {
		$arrow.removeClass("icon-button-arrow-up").addClass("icon-button-arrow-down");
		$("#menu_click_fallthrough").hide();
		$child_elem.hide();
	}
}

function prettynum2int(t) {
	if($.type(t) === "string") return(t.replace(/,/g,"")*1);
	if($.type(t) === "number") return t;
	return 0;
}

function table_stripes(t) {
	$(t+" tbody tr").filter(":not([nodrop]):visible:even").removeClass("odd").addClass("even");
	$(t+" tbody tr").filter(":not([nodrop]):visible:odd").removeClass("even").addClass("odd");
}

function achievement_sort() {
	function cb_ta(e) {return prettynum2int($(e).find(".itemright .header").text().match(/([\d,]{1,6}) \([\d,]{1,6}\)$/i)[1]);}
	function cb_gs(e) {return prettynum2int($(e).find(".itemright .header").text().match(/[\d,]{1,6} \(([\d,]{1,6})\)$/i)[1]);}
	function cb_ratio(e) {var r = $(e).find(".itemright .chartlist li").first().text().match(/TA Ratio = ([\d.]{3,7})\)/i); if($.type(r) === "array") return (r[1]*1); else return 0;}
	function cb_gamers(e) {var r = $(e).find(".itemright .chartlist li").first().text().match(/Unlocked by ([\d,]{1,9}) tracked/i); if($.type(r) === "array") return prettynum2int(r[1]); else return 0;}
	function cb_name(e) {return $(e).find(".itemright .header a.mainlink").first().text();}
	function cb_won(e) {var r = $(e).find(".itemright .links").first().text().match(/won this (.+) \|/i); if($.type(r) === "array") return new Date(r[1]).getTime(); else return 0;}

	$("div.tai-achievement-list").each(function() {
		var type = $("#sort-achievements-type").val(),
			$achievement_list = $(this).children();

		$achievement_list.sort(function(a,b) {
			var d = ($("#sort-achievements-dir").hasClass("desc-arrow-black") ? -1 : 1),
				s = 0;

			if(type === "ta") s = (cb_ta(a) > cb_ta(b) ? 1 : -1);
			if(type === "gs") s = (cb_gs(a) > cb_gs(b) ? 1 : -1);
			if(type === "ratio") s = (cb_ratio(a) > cb_ratio(b) ? 1 : -1);
			if(type === "name") s = (cb_name(a) > cb_name(b) ? 1 : -1);
			if(type === "gamers") s = (cb_gamers(a) > cb_gamers(b) ? 1 : -1);
			if(type === "won") s = (cb_won(a) > cb_won(b) ? 1 : -1);

			return (s*d);
		});

		$(this).append($achievement_list);
	});
}

function params2array(p) {
	var r = {},
		q = p.indexOf("?");

	$.each(p.slice(q+1).split("&"),function(k,v) {
		var e = v.split("=");
		r[e[0]] = e[1];
	});

	return r;
}

function append_get_params(url,params) {
	var q = url.indexOf("?"),
		p = params2array(url);

	$.each(params,function(k,v) {
		p[k] = v;
	});

	return (url.slice(0,q)+"?"+$.params(p));
}

function game_info_capsule() {
	function int(i) {
		if($.type(i) === "string") {
			if(i === "no one") i = 0;
			else i = prettynum2int(i);
		}
		if($.type(i) === "number") return Math.floor(i);
		else return 0;
	}

	function rev_plural(n) {
		var r = plural(n);
		if(r) return "";
		else return "s";
	}

	// display the game's ratio and formalize/shorten the element a bit at the same time
	var $score_element = $("#main .itemright p").first(),
		$ownership_element = $("#main .itemright p").eq(1),
		score_data = $score_element.text().match(/maximum of (\d{1,3}) .+ worth ([\d,]{1,6}) \(([\d,]{1,6})\)(?:, and (\d{1,2}) challenges)?$/i),
		ownership_data = $ownership_element.text().match(/^([\d,]{1,7})[^,]+, ([\d,]{1,7}|no one)[^|]+(?:$| \| ([\d,]{1,7}))/i),
		gameid = $("ul#btnGame_Action_Options > li > a").first().attr("href").match(/Postback\('btnBoostGame','(\d{1,5})'\)/i)[1];

	$score_element.empty().text(score_data[1]+" achievements worth "+score_data[2]+" TA ("+score_data[3]+" GS; "+(int(score_data[2])/int(score_data[3])).toFixed(2)+" ratio)");
	if(score_data[4] !== undefined) $score_element.before(
		$("<p/>").text(score_data[4]+" challenge"+plural(score_data[4]))
	);
	if($.type(ownership_data) === "array") {
		$ownership_element.empty().append(
			$("<a/>")
				.attr({
					"href":("/gamegamer.aspx?gameid="+gameid),
					"target":"_blank"
				})
				.text(ownership_data[1]+" own"+rev_plural(ownership_data[1])+" this game"),
			document.createTextNode(", "),
			$("<a/>")
				.attr({
					"href":("/100club.aspx?gameid="+gameid),
					"target":"_blank"
				})
				.text(""+ownership_data[2]+" "+(int(ownership_data[2]) === 1 ? "has" : "have")+" completed it"),
			document.createTextNode(" ("+((int(ownership_data[2])/Math.max(int(ownership_data[1]),1))*100).toFixed(2)+"%)")
		);
		if(ownership_data[3] !== undefined) $ownership_element.after(
			$("<p/>").append(
				$("<a/>")
					.attr({
						"href":("/boostgame.aspx?gameid="+gameid),
						"target":"_blank"
					})
					.text(ownership_data[3]+" want"+rev_plural(ownership_data[3])+" to boost")
			)
		);
	}
}

function ta_pb(cmd,arg) {
	// ta's postback function in a more convenient ajax wrapper.  using this function i can prevent
	// some of the site's unnecessary page refreshing and update the content with ajax instead
	return $.ajax({
		async:true,
		method:"POST",
		url:window.location.href,
		data:{
			"Command":cmd,
			"Argument":arg
		}
	});
}

function show_all() {
	var $pagination = $("ul.pagination").first(),
		$current_page = $("li.current",$pagination),
		$nav_anchor = $("a",$current_page).first(),
		total_pages = ($($pagination).children().length-3),
		page_index = ($($pagination).children().index($current_page)),
		type = ($.type($nav_anchor.attr("onclick")) === "undefined" ? "g" : "p"),
		command = ((type === "p") ? ($nav_anchor.attr("onclick").match(/Postback\('(.+)','.+'\)/i)[1]) : "page"),
		$table = $("table.maintable").first();

	function g(c,i) {
		return $.ajax({
			async:true,
			method:"GET",
			url:window.location.pathname,
			data:(c+"="+i)
		});
	}
	function n(i) {
		function e(p) {
			return $("table.maintable:first tbody tr:not([nodrop]):not(:has(th))",p);
		}
		if(i <= total_pages) {
			if(i !== page_index) {
				var request;
				if(type === "p") request = ta_pb(command,i);
				else if(type === "g") request = g(command,i);
				request.done(function(page) {
					var $new_elements = e(page);
					if(i < page_index) $("tbody",$table).prepend($new_elements);
					else $("tbody",$table).append($new_elements);
					$table.trigger("updateRows",[true]);
					n(++i);
				});
			}
			else n(++i);
		}
		else $(".tai_pagination_wait").remove();
	}

	// just to make sure they wanted this to happen when there are many pages
	if(total_pages < 5 || confirm("Are you sure you want to display all "+total_pages+" pages?")) {
		$("ul.pagination").hide().before(
			$("<span/>").attr("class","fa fa-2x fa-fw fa-spin fa-refresh tai_pagination_wait")
		);
		n(1);
	}
}

function hide_forum_posts() {
	function post_group($group) {
		// because ta puts all pertinent post elements in three separate table rows like a silly
		$group = $group.add($group.eq(0).next()); // message body
		if($group.eq(1).next().hasClass("signature")) $group = $group.add($group.eq(1).next()); // signature
		return $group;
	}

	function text_nodes($e) {
		var $r = $($e).contents().filter(function() {
			return this.nodeType === 3;
		});
		if($r.length) $r.wrap(
			$("<span/>").attr("class","text-node")
		);
		return $("span.text-node",$e);
	}

	function iterate() {
		$("td.author div.userdetails a:first-of-type").each(function() {
			var $group = post_group($(this).closest("tr.posted"));

			if(blocked_users.indexOf($(this).text()) > -1) {
				$group.hide();
				if(!$group.eq(0).prev().hasClass("tai-hidden-post")) {
					$group.eq(0).before(
						$("<tr/>")
							.attr("class","tai-hidden-post")
							.append(
								$("<td/>")
									.attr("colspan","2")
									.append(
										document.createTextNode("Hidden post from "+$(this).text()+" "),
										$("<a/>")
											.text("[Show this post]")
											.click(function() {
												if($(this).text() === "[Show this post]") {
													$(this).text("[Hide this post]");
													post_group($(this).closest(".tai-hidden-post").next()).show();
												}
												else {
													$(this).text("[Show this post]");
													post_group($(this).closest(".tai-hidden-post").next()).hide();
												}
											}),
										document.createTextNode(" "),
										$("<a/>")
											.text("[Unhide "+$(this).text()+"]")
											.click(function() {
												blocked_users.removeItem($("td.author div.userdetails a",$(this).closest(".tai-hidden-post").next()).first().text());
												localStorage.tai_blocked_users = blocked_users.join(",");
												iterate();
											})
									)
							)
					);
				}
			}
			else {
				$group.show();
				$group.eq(0).prev(".tai-hidden-post").remove();
			}
		});
		$("td.message span.quoteby a:first-of-type").each(function() {
			var $quoteby = $(this).closest(".quoteby"),
				$blocked_text = text_nodes($quoteby.next());

			if(blocked_users.indexOf($(this).text()) > -1) {
				$blocked_text.hide();
				$blocked_text.before(
					$("<div/>")
						.attr("class","tai-hidden-quote")
						.text("Hidden writings from "+$(this).text())
				);
			}
			else {
				$blocked_text.show();
				$blocked_text.prev("div.tai-hidden-quote").remove();
			}
		});
	}

	iterate();
}

function dependencies() {
	if(!$("link[rel='stylesheet'][href$='font-awesome.min.css']").length) $("head").append(
		$("<link/>")
			.attr({
				"rel":"stylesheet",
				"href":"https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
			})
	);
	$("head").append(
		$("<style/>")
			.attr("type","text/css")
			.text(tai_css)
	);
}

$(document).ready(function() {
	if(!$("#mnuMyPages").length) return; // don't do anything if the viewer is not logged in

	dependencies();

	$("body").prepend(
		$("<div/>") // this div is a super-simple way to handle off-panel clicks
			.attr("id","menu_click_fallthrough")
			.click(function() {
				$("#tai_filter_buttons_container span.icon-button-arrow-up").parent().click();
			}),
		$("<div/>") // script help box
			.attr("id","tai_help_box")
			.append(
				$("<img/>")
					.attr({
						"src":"/images/icons/cancel.png",
						"id":"tai_close_help",
						"alt":"Close help",
						"title":"Close help"})
					.click(function() {
						$("#tai_help_box").hide();
						//$("body").removeClass("noscroll");
					}),
				$("<h1/>").text("TrueAchievements Improver help"),
				$("<div/>").attr("class","content")
			)
			.draggable()
	);

	// quick and seamless fix for ta's tables.  they do not have their header rows inside of a thead
	// element so this little bit fixes that without hurting anything or even being noticeable, but allows
	// for far better workability later
	$("table.maintable").filter(":not(:has(thead))").each(function() {
		$(this).prepend(
			$("<thead/>").append(
				$("tr[nodrop], tr:has(th)",$(this))
			)
		);
	});

	script_settings = localstorage_obj("ta_improver_settings");
	if(typeof script_settings !== "object") script_settings = default_settings();
	else {
		// make sure new config options exist if the script has been updated
		var defaults = default_settings();
		$.each(defaults,function(k,v) {if(!script_settings.hasOwnProperty(k)) script_settings[k] = v;});
	}

	if(script_settings.hide_ads) {
		$("#topad-wrap, #divTAProHolder, #divGiftProPanel, #divBottomAds, .followuson, .internalad, .rightintergi, .sharepanel").remove();
		$("div#sidebar").children().not(".smallpanel").remove();
	}
	if(script_settings.normalize_dates) {
		$("td.lastpostdate, td.posted div.info, td.time, td.sentdate, div.coveritem, td.ta, div.boostingdate, div.gamingsession h3, div.subcommentinfo, td.lastpost, div.links, #oGamer div.itemright p, td.author div.info").each(function() {
			$(this).html($(this).html().replace(/(?:on )?(?:[A-Z]{1}[a-z]{2,8}, )?(today|yesterday|tomorrow|(?:\d{1,2}) ([A-Z]{1}[a-z]{2,8}) ?(\d{2,4})?) at (\d{2}):(\d{2})/gi,short_datetime_callback));
		});
		$("div.addedby, td.hwr, table.comparison td.green, .maincolumnpanel .itemright h3, #oGamer div.itemright p").each(function() {
			$(this).html($(this).html().replace(/(?:on )?(?:[A-Z]{1}[a-z]{2,8}, )?(today|yesterday|tomorrow|(\d{1,2}) ([A-Z]{1}[a-z]{2,8}) (\d{2,4}))/gi,short_date_callback));
		});
	}
	// fix spoilers
	if(script_settings.fix_spoilers) $("div.spoiler").each(function() {
		$(this).children("a").first().replaceWith(
			$("<span/>")
				.text("SPOILER: click to show content")
				.attr("class","tai_spoiler_header")
				.click(function() {
					var $span_content = $(this).siblings("span.spoiler").first();

					if($span_content.css("display") === "none") {
						$span_content.show();
						$(this).text("SPOILER: click to hide content");
					}
					else {
						$span_content.hide();
						$(this).text("SPOILER: click to show content");
					}
				})
		);
	});
	// give videos a visible external link so script blockers can get around a blank display
	if(script_settings.display_video_links) $("iframe[src*='youtube.com']").each(function() {
		var vurl = $(this).attr("src");
			vurl = ("https://www.youtube.com/watch?v="+vurl.slice(vurl.lastIndexOf("/")+1));
			$(this).parent().before(
				$("<a/>")
					.attr({
						"class":"tai_video_url_header",
						"href":vurl,
						"target":"_blank"
					})
					.text(vurl)
			);
	});
	// friend feed permalinks
	if(script_settings.feed_permalinks) $("#oFriendFeed div.Comment p").each(function() {
		$(this).prepend(
			$("<a/>")
				.attr({
					"href":("?gfcid="+$(this).parent().attr("id").slice(5)),
					"target":"_blank"
				})
				.append(
					$("<img/>")
						.attr({
							"class":"tai_permalink_icon",
							"src":"/images/icons/permalink.png",
							"title":"Permalink",
							"alt":"Permalink"
						})
				)
		);
	});
	// adds the "show all" button to paged tables that will retrieve and display all of the content on
	// the current page
	if(script_settings.show_all_pages) $("ul.pagination").append(
		$("<li/>").append(
			$("<a/>")
				.text("Show all")
				.click(function() {
					show_all();
			})
		)
	);
	if($("table.messageboard").length && script_settings.block_users) {
		blocked_users = localStorage.tai_blocked_users;
		if($.type(blocked_users) === "string") blocked_users = blocked_users.split(",");
		else blocked_users = [];

		$("td.author div.userdetails a:first-of-type").after(
			$("<br/>"),
			$("<span/>")
				.text("[Hide all posts]")
				.css("cursor","pointer")
				.click(function() {
					blocked_users.push($(this).prev().prev().text());
					localStorage.tai_blocked_users = blocked_users.join(",");
					hide_forum_posts();
				})
		);
		hide_forum_posts();
	}

	switch(uri()) {
		case "walkthroughs.aspx":
			if(script_settings.walkthrough_bookmarks) {
				var bookmark_list = localstorage_obj("tai_walkthrough_bookmarks"),
					$bookmark_table = $("<table/>")
						.attr("class","maintable")
						.append(
							$("<thead/>").append(
								$("<tr/>").append(
									$("<th/>").text("Bookmarked walkthrough"),
									$("<th/>").text("Bookmarked page"),
									$("<th/>").text("")
								)
							),
							$("<tbody/>")
					);

				if($.type(bookmark_list) === "object" && Object.keys(bookmark_list).length) {
					$.each(bookmark_list,function(k,v) {
						var v_arr = v.split(",");
						$("tbody",$bookmark_table).append(
							$("<tr/>").append(
								$("<td/>").text(decodeURIComponent(k)),
								$("<td/>").text(v_arr[1]),
								$("<td/>").append(
									$("<a/>")
										.attr({
											"href":append_get_params(v_arr[0],{"bookmark_jump":""}),
											"target":"_blank"
										})
										.append(
											$("<img/>").attr("src","/images/icons/rightarrow.png")
										)
								)
							)
						);
					});
				}
				else $("tbody",$bookmark_table).append(
					$("<tr/>").append(
						$("<td/>")
							.attr("colspan","3")
							.text("No saved bookmarks to display")
					)
				);
				$("h1#oPageTitle").after($bookmark_table);
			}
			break;
		case "walkthrough.htm": case "walkthroughpage.aspx":
			function bookmark_icon() {
				var $bm = $("span.tai_float_bookmark");
				if(!$bm.length) $bm = $("<span/>").attr("class","fa fa-lg fa-bookmark tai_float_bookmark");
				return $bm;
			}

			var walkthrough_name = $("h1#h1GameName").text();
			if(script_settings.walkthrough_bookmarks && walkthrough_name.length) {
				var page_number = $("div.walkthroughpage h2.block").first().text(),
					bookmarks = (localstorage_obj("tai_walkthrough_bookmarks") || {}),
					bookmark,
					title = "";
				walkthrough_name = encodeURIComponent(walkthrough_name.match(/^(.+) Walkthrough/i)[1]);
				page_number = (page_number.length ? page_number.match(/^(\d{1,2})\. /i)[1] : 1);

				if($.type(bookmarks) === "object" && bookmarks.hasOwnProperty(walkthrough_name)) {
					bookmark = bookmarks[walkthrough_name].split(",");
					if((bookmark[1] === page_number)) {
						title = "Jump to the bookmark on this page";
						$("div.walkthroughpage").children("p").eq(bookmark[2]*1)
							.attr("class","tai_bookmark")
							.prepend(
								bookmark_icon()
							);
					}
					else title = ("You have set a bookmark on page "+bookmark[1]+" of this walkthrough");
				}
				else title = "You have not set a bookmark on this walkthrough";

				$("h1#h1GameName").prepend(
					$("<span/>")
						.attr({
							"class":"fa-stack",
							"title":title,
							"id":"tai_bookmark_jump"
						})
						.css("cursor",($.type(bookmark) === "array" ? "pointer" : "auto"))
						.append(
							$("<span/>").attr("class",("fa fa-stack-1x fa-"+($.type(bookmark) === "array" ? "bookmark-o" : "ban"))),
							$("<span/>").attr("class","fa fa-stack-2x fa-square-o")
						)
						.click(function() {
							if($.type(bookmark) === "array") {
								if(bookmark[1] === page_number) { // bookmark is on this page
									$(document).scrollTop($("div.walkthroughpage p.tai_bookmark").offset().top);
								}
								else {
									var $anchor = $(("table.gamertags td.pos:contains('"+bookmark[1]+"')"),$("div.sp-head:contains('Pages In This Walkthrough') + div.panelcontent")).next().children("a").first();
									window.location.href = append_get_params($anchor.attr("href"),{"bookmark_jump":""});
								}
							}
						})
				);
				$("div.walkthroughpage").children("p").click(function() {
					if($(this).hasClass("tai_bookmark")) {
						$(this).removeClass("tai_bookmark");
						$("span.tai_float_bookmark").remove();
						$("#tai_bookmark_jump")
							.attr("title","You have not set a bookmark on this walkthrough")
							.css("cursor","auto")
							.children(".fa-stack-1x").first().removeClass("fa-bookmark-o").addClass("fa-ban");
						bookmark = undefined;
						delete bookmarks[walkthrough_name];
					}
					else {
						$(".tai_bookmark").removeClass("tai_bookmark");
						$(this)
							.attr("class","tai_bookmark")
							.before(
								bookmark_icon()
							);
						$("#tai_bookmark_jump")
							.attr("title","Jump to the bookmark on this page")
							.css("cursor","pointer")
							.children(".fa-stack-1x").first().removeClass("fa-ban").addClass("fa-bookmark-o");
						bookmark = [window.location.href.match(/trueachievements\.com\/(.+)$/i)[1],page_number,$("div.walkthroughpage").children("p").index($(this))];
						bookmarks[walkthrough_name] = bookmark.join(",");
					}
					localStorage.tai_walkthrough_bookmarks = JSON.stringify(bookmarks);
				});

				if(window.location.href.indexOf("bookmark_jump") > -1) $("#tai_bookmark_jump").click();
			}
			break;
		case "news":
			$("table + div.spoiler").prev().css("margin-bottom","0px");
			break;
		case "solutions":
			function date_match(a) {
				if($.type(a) === "array") return new Date(a[1]).getTime();
				else return 0;
			}
			game_info_capsule();
			if(script_settings.solution_sorting) {
				var $solutions = $("div.messageboardholder table.solutions tr.message");
				if($solutions.length > 1) {
					$("table.solutions tbody tr.posted").each(function() {
						var pos_votes = prettynum2int($("td.voting",$(this)).text().match(/([\d,]{1,4}) positive/i)[1]),
							neg_votes = prettynum2int($("td.voting",$(this)).text().match(/([\d,]{1,4}) negative/i)[1]),
							posted = date_match($("td.author div.info",$(this)).text().match(/posted (\d{1,2} \w{3} \d{4}, \d{2}:\d{2})/i)),
							edited = date_match($("td.author div.info",$(this)).text().match(/edited (\d{1,2} \w{3} \d{4}, \d{2}:\d{2})/i)),
							author_ta = $("td.author div.gamerscore",$(this)).text().match(/^([\d,]{1,9})/i),
							game_ta = prettynum2int($("td.author div.info a:first",$(this)).text()),
							won_date = date_match($("td.author div.info span").first().text().match(/achievement won on (.+)$/i));
						if($.type(author_ta) === "array") author_ta = prettynum2int(author_ta[1]);
						else author_ta = 0;

						$("table.solutions").append(
							$("<tbody/>")
								.append(
									$(this),
									$(this).next(),
									$(this).next().next()
								)
								.attr({
									"data-pos-votes":pos_votes,
									"data-neg-votes":neg_votes,
									"data-vote-ratio":(pos_votes/Math.max(1,neg_votes+pos_votes)).toFixed(3),
									"data-vote-diff":(pos_votes-neg_votes),
									"data-post-date":posted,
									"data-edit-date":edited,
									"data-won-date":won_date,
									"data-total-ta":author_ta,
									"data-game-ta":game_ta
								})
						);

						$("td.author",$(this)).first().append(
							$("<div/>")
								.attr("class","tai_hide_solution")
								.text("[ Hide solution text ]")
								.click(function() {
									if($(this).text() === "[ Hide solution text ]") {
										$("td.message",$(this).closest("tbody").children("tr.message")).hide();
										$(this).text("[ Show solution text ]");

									}
									else {
										$("td.message",$(this).closest("tbody").children("tr.message")).show();
										$(this).text("[ Hide solution text ]");

									}
								})
						);
					});
					$("table.solutions tbody").first().remove();
					$("h2#oAchievementHeader")
						.after(
							document.createTextNode("Sort solutions by"),
							$("<select/>")
								.attr("id","tai_solution_sort")
								.append(
									$("<option/>")
										.text("Vote score")
										.attr("value","data-vote-diff"),
									$("<option/>")
										.text("Positive vote ratio")
										.attr("value","data-vote-ratio"),
									$("<option/>")
										.text("Most positive votes")
										.attr("value","data-pos-votes"),
									$("<option/>")
										.text("Post date")
										.attr("value","data-post-date"),
									$("<option/>")
										.text("Edit date")
										.attr("value","data-edit-date"),
									$("<option/>")
										.text("Author's total TA")
										.attr("value","data-total-ta"),
									$("<option/>")
										.text("Author's TA in this game")
										.attr("value","data-game-ta"),
									$("<option/>")
										.text("Achievement earned date")
										.attr("value","data-won-date")
								)
								.change(function() {
									function attr_int(e,a) {
										return ($(e).attr(a)*1);
									}

									var v = $(this).val();
									var d = ($("#tai_sort_dir").children().first().hasClass("fa-caret-up") ? 1 : -1);// ((v === "data-post-date" || v === "data-won-date") ? 1 : -1);

									$("tbody","table.solutions").sort(function(a, b) {
										var ai = attr_int(a,v),
											bi = attr_int(b,v),
											sort = 0;
										if(ai === bi) { // secondary sorts
											if(v !== "data-vote-ratio") {
												ai = attr_int(a,"data-vote-ratio");
												bi = attr_int(b,"data-vote-ratio");
											}
											else {
												ai = attr_int(a,"data-pos-votes");
												bi = attr_int(b,"data-pos-votes");
											}
										}
										sort = (ai > bi ? 1 : -1);
										sort *= d; // reverse sort order when appropriate
										return sort;
									})
									.appendTo("table.solutions");
								}),
							$("<span/>")
								.attr({
									"class":"fa-stack",
									"id":"tai_sort_dir",
									"title":"Change sort direction"
								})
								.append(
									$("<span/>").attr("class","fa fa-lg fa-stack-1x fa-caret-down"),
									$("<span/>").attr("class","fa fa-stack-2x fa-square-o")
								)
								.click(function() {
									$(this).children().first().toggleClass("fa-caret-down fa-caret-up");
									$("select#tai_solution_sort").change();
								})
						);
				}
				$("h2#oAchievementHeader").text($("h2#oAchievementHeader").text().replace("Achievement Guide",($solutions.length+" solution"+plural($solutions.length))));

				// this triggers the default sort of "vote score", which is similar to TA's default of positive votes minus negative votes,
				// but also dual sorts on other dimensions.  for instance, TA's default sort puts +5 -1 above +4 -0 (because it has more votes
				// i guess) while this script will put the solution with the negative vote lower in the list
				$("select#tai_solution_sort").change();
			}
			break;
		case "viewcomment.aspx":
        {
            var hash,
                idx = window.location.href.indexOf("#");
            if(idx > -1) hash = window.location.href.slice(idx);
            if(hash === "#vch") // ta's broken page scrolling anchor for solution comments
            {
                var $comments_container = $("div#vch table.solutions tr.comments").first();
                if($comments_container.length) $(window).scrollTop($comments_container.offset().top);
            }
            else if(!$(hash).length) // if this is true then the url already includes a valid hash scroll command
            {
                var $achievement = $("#main div.achievementpanel[id]").first();
                if($achievement.length) $(window).scrollTop($achievement.offset().top);
            }
            game_info_capsule(); //console.log(hash);
			break;
        }
        case "xbox-sales.aspx":
			$("table#oSalesList")
				.find("thead tr th a").each(function() {
					$(this).replaceWith(document.createTextNode($(this).text()));
				});

			$("table#oSalesList tbody tr").each(function() {
				$(this).children("td").last().append(
					$("<img/>")
						.attr({
							"src":"/images/icons/cancel.png",
							"title":"Hide",
							"alt":"Hide",
							"class":"tai_hide_row"
						})
						.click(function() {
							$(this).closest("tr").hide();
							// entirely cosmetic.  keeps the alternating row colors visibly correct as table rows are hidden
							table_stripes("table#oSalesList");
						})
				);
			});

			$("table#oSalesList tbody tr td:nth-child(4) img[src^='/images/icons/information']").each(function() {
				$(this).parent().attr("title",$(this).attr("title"));
				if($(this).attr("title").indexOf("Games with Gold") > -1) $(this).parent().addClass("tai_gwg");
				else if($(this).attr("title").indexOf("Approximate pricing") > -1) $(this).parent().addClass("tai_approx");
				else if($(this).attr("title").indexOf("Gold Exclusive Sale") > -1) $(this).parent().addClass("tai_gold");
				$(this).remove();
			});
			if($("table#oSalesList tbody tr").length > 25) {
				$("table#oSalesList tbody .bigicon").removeAttr("width height").css({"width":"40px","height":"40px"});
				$("table#oSalesList tbody div[class^='rating-']").css("margin-top","0px");
			}

			$("table#oSalesList").tablesorter({
				headers: {
					0:{sorter:false},
					8:{sorter:false}
				},
				textExtraction: {
					1:function(n,t,c) {return $("a",n).first().text();},
					2:function(n,t,c) {return ($(n).text().slice(0,-1)*1);},
					3:function(n,t,c) {return ($(n).text().match(/^\$(0|\d{1,2}\.\d{2})/i)[1]*1);},
					4:function(n,t,c) {return prettynum2int($(n).text().match(/([\d,]{2,6}) ?\([\d,]{2,6}\)/i)[1]);},
					5:function(n,t,c) {var regex = $(n).text().match(/(\d{1,3})(?:-\d{1,3}|\+)/i); if(regex !== null) return regex[1]; else return 0;},
					6:function(n,t,c) {return $("img",n).length;},
					7:function(n,t,c) {return new Date($(n).text().match(/([^-<]{1,})/i)[1]).getTime();}
				},
				sortAppend: {
					2:[[1,'a']],
					3:[[1,'a']],
					4:[[1,'a']],
					5:[[1,'a']],
					6:[[1,'a']],
					7:[[1,'a']],
				},
				widgets: ["zebra"],
				widgetOptions: {
					zebra: ["odd","even"]
				}
			});
            break;
		case "challenges.htm": case "100club.aspx": case "gamegamer.aspx":
			game_info_capsule();
			break;
		case "achievements.htm":
			function flag_filter() {
				var filter_flags = [],
					join = $("#tai_flag_filter input[name='filter_link']:checked").val();
				$("#tai_flag_filter input[type='checkbox']:checked + div").each(function() {filter_flags.push($(this).attr("class"));});

				$("div.achievementpanel").not(".tai_achievement_ownership_filtered").each(function() {
					var achievement_flags = [];
					$(this).find("span.achievementtypes span").each(function() {
						achievement_flags.push($(this).attr("class"));
					});
					if(!achievement_flags.length) achievement_flags.push("icon-information"); // unflagged achievements
					achievement_flags = intersect_arrays(achievement_flags,filter_flags);

					if(join === "not" && achievement_flags.length === 0) $(this).show();
					else if(join === "or" && achievement_flags.length > 0) $(this).show();
					else if(join === "and" && achievement_flags.length === filter_flags.length) $(this).show();
					else $(this).hide();
				});
			}

			if(script_settings.achievement_page_improvements)
            {
                game_info_capsule();
				// remove default actions on the won status sorting radio buttons so this script can sort instead
                $("#rdoAllAchievements, #rdoWonAchievements, #rdoNotWonAchievements")
                    .attr("onclick","") // all three of these lines are because of old internet explorer versions
                    .prop("onclick",null)
                    .removeAttr("onclick")
                    .click(function() {var earned = ($(this).val() === "rdoAllAchievements" || $(this).val() === "rdoWonAchievements"),
                                           unearned = ($(this).val() === "rdoAllAchievements" || $(this).val() === "rdoNotWonAchievements");
                                       $("div.achievementpanel").each(function() {if((earned && $(this).hasClass("green")) || (unearned && $(this).hasClass("red"))) $(this).removeClass("tai_achievement_ownership_filtered");
                                                                                  else $(this).addClass("tai_achievement_ownership_filtered");
                                                                                  flag_filter();
                                                                                 });
                                      });
                // add the button that toggles the flag filter dropdown
                $("#btnFlagFilter")
                    .attr("onclick","")
                    .prop("onclick",null)
                    .removeAttr("onclick href")
                    .removeClass("shift_down")
                    .before($("<a/>")
                            .attr({"id":"tai_flag_button",
                                   "class":"button menubutton"})
                            .text("Filter")
                            .click(function() {toggle_panel("#tai_flag_button","#tai_flag_filter",
                                                            {x:"left",
                                                             y:"bottom"}
                                                           );
                                              })
                            .append($("<span/>")
                                    .attr("class","droparrow icon-button-arrow-down")
                                   ),
                            $("<ul/>")
                            .attr({"id":"tai_flag_filter",
                                   "class":"menuitems rightaligned filterbutton"})
                            .hide()
                           )
                    .click(function() {toggle_panel("#btnFlagFilter","#btnFlagFilter_Options",
                                                    {x:"right",
                                                     y:"bottom"}
                                                   );
                                      });
                // clone the flag filter section of the existing dropdown, then hide it so it cannot be manipulated in postback
                $("#btnFlagFilter_Options")
                    .find("div.flagfilter").parent().hide()
                    .clone().appendTo("#tai_flag_filter").show()
                    .find("*")
                    .attr("onclick","")
                    .prop("onclick",null)
                    .removeAttr("id name value onclick");
				$("#btnFlagFilter_Options li.fp").children("div").eq(1).hide(); // the script is handling this too
                // fix the check/uncheck all links
                // in the case of a game with either few flags or incomplete flagging, these are not present so i must add them myself
                if(!$("#tai_flag_filter li.fp h5 a").length) $("#tai_flag_filter li.fp h5").append($("<a/>")
                                                                                                   .attr("title","Select all flags")
                                                                                                   .append($("<img/>")
                                                                                                           .attr({"src":"/images/icons/selectall.png",
                                                                                                                  "width":"16",
                                                                                                                  "height":"16",
                                                                                                                  "alt":"Select all flags"})
                                                                                                          ),
                                                                                                   $("<a/>")
                                                                                                   .attr("title","Clear all flags")
                                                                                                   .append($("<img/>")
                                                                                                           .attr({"src":"/images/icons/selectnone.png",
                                                                                                                  "width":"16",
                                                                                                                  "height":"16",
                                                                                                                  "alt":"Clear all flags"})
                                                                                                          )
                                                                                                  );
                // no reason to add all this stuff above when the anchors don't exist, since i have to do this part even if they're already there anyway
                $("#tai_flag_filter a[title='Select all flags']")
                    .removeAttr("href")
                    .attr("id","tai_flags_select_all")
                    .click(function() {$("#tai_flag_filter input[type='checkbox']").prop("checked",true);});
                $("#tai_flag_filter a[title='Clear all flags']")
                    .removeAttr("href")
                    .attr("id","tai_flags_select_none")
                    .click(function() {$("#tai_flag_filter input[type='checkbox']").prop("checked",false);});
                // if there are unflagged achievements, ta puts an "unflagged" filter outside of the main flagging container that
                // does not follow the format of the remaining flags nor does it appear in the same container.  i'm redoing the
                // unflagged achievement flag where i need it in this section
                var $unflagged = $("#tai_flag_filter div.unflagged");
                if($unflagged.length)
                {
                    $("#tai_flag_filter div.flagfilter ul").append($("<li/>")
                                                                   .append($("<input/>")
                                                                           .attr({"type":"checkbox",
                                                                                  "class":"checkbox",
                                                                                  "checked":"checked"}),
                                                                           $("<div/>")
                                                                           .attr("class","icon-information"),
                                                                           $("<b/>")
                                                                           .text($unflagged.text().match(/Unflagged \((\d{1,3})\)/i)[1]),
                                                                           document.createTextNode(" Unflagged")
                                                                          )
                                                                  );
                    $unflagged.remove();
                }
                // i can't do an easy append for the NOT filter because the raw text outside of elements and floating makes it impossible,
                // so i have to clear the entire contents of this div and do it over
                var $link_flags = $("#tai_flag_filter input[type=radio]").parent();
                // i have to do this because the linking flags div is not included on a game with incomplete flagging
                if($link_flags.length) $link_flags.empty();
                else
                {
                    $link_flags = $("<div/>");
                    $("#tai_flag_filter li.fp div.flagfilter").first().after($link_flags);
                }
                $link_flags.append($("<span/>")
                                   .text("Link flags:"),
                                   $("<input/>")
                                   .attr({"type":"radio",
                                          "name":"filter_link",
                                          "id":"tai_link_or",
                                          "checked":"checked",
                                          "value":"or"}),
                                   $("<label/>")
                                   .attr({"class":"tai_link_label",
                                          "for":"tai_link_or"})
                                   .text("OR"),
                                   $("<input/>")
                                   .attr({"type":"radio",
                                          "name":"filter_link",
                                          "id":"tai_link_and",
                                          "value":"and"}),
                                   $("<label/>")
                                   .attr({"class":"tai_link_label",
                                          "for":"tai_link_and"})
                                   .text("AND"),
                                   $("<input/>")
                                   .attr({"type":"radio",
                                          "name":"filter_link",
                                          "id":"tai_link_not",
                                          "value":"not"}),
                                   $("<label/>")
                                   .attr({"class":"tai_link_label",
                                          "for":"tai_link_not"})
                                   .text("NOT")
                                  );
                // add the apply button and the stat sorter
                $("#tai_flag_filter")
                    .append($("<li/>")
                            .attr("class","buttons")
                            .append($("<a/>")
                                    .attr("class","button")
                                    .append($("<span/>")
                                            .attr({"class":"icon-tick",
                                                   "title":"Apply",
                                                   "alt":"Apply"}),
                                            document.createTextNode("Apply")
                                           )
                                    .click(function() {flag_filter();})
                                   )
                           )
                    .prepend($("<li/>")
                            .attr("class","fp")
                            .append($("<h5/>")
                                    .text("Sort"),
                                    $("<div/>")
                                    .attr("class","achievement-sort")
                                    .append($("<select/>")
                                            .attr("id","sort-achievements-type")
                                            .append($("<option/>")
                                                    .text("Date unlocked")
                                                    .attr("value","won"),
													$("<option/>")
                                                    .text("TrueAchievement")
                                                    .attr("value","ta"),
                                                    $("<option/>")
                                                    .text("Gamerscore")
                                                    .attr("value","gs"),
                                                    $("<option/>")
                                                    .text("Ratio")
                                                    .attr("value","ratio"),
                                                    $("<option/>")
                                                    .text("Name")
                                                    .attr("value","name"),
                                                    $("<option/>")
                                                    .text("Gamers")
                                                    .attr("value","gamers")
                                                   )
                                            .change(function() {achievement_sort();}),
                                            $("<span/>")
                                            .attr({"id":"sort-achievements-dir",
                                                   "class":"desc-arrow-black",
                                                   "title":"Descending sort",
                                                   "alt":"Descending sort"})
                                            .click(function() {if($(this).hasClass("desc-arrow-black")) $(this).removeClass("desc-arrow-black").addClass("asc-arrow-black").attr({"title":"Ascending sort","alt":"Ascending sort"});
                                                               else $(this).removeClass("asc-arrow-black").addClass("desc-arrow-black").attr({"title":"Descending sort","alt":"Descending sort"});
                                                               achievement_sort();
                                                              })
                                           )
                                   )
                            );
                // cosmetics
                $("h1.pagetitle").first()
                    .addClass("tai_pagetitle")
                    .insertBefore("#tai_flag_button")
                    .after($("table.achievementwonoptions").first()
                           .addClass("tai_won_options"),
                           $("<div/>")
                           .attr("id","tai_filter_buttons_container")
                           .append($("#tai_flag_button, #tai_flag_filter, #btnFlagFilter, #btnFlagFilter_Options"))
                          );
				$("#main").css("overflow","initial"); // because the setting defined by the TA stylesheet cuts stuff off at the bottom of the page when it's vertically very short
                // make the warning panel for unobtainables et al. clickable and automatically filter the achievements
                var $warning_panel = $("div.warningspanel:contains(achievement)").first();
                if($warning_panel.length)
                {
                    $warning_panel
                        .addClass("tai_warning_panel")
                        .click(function() {var text = $(this).text();

                                           $("#tai_flags_select_none").click();
                                           $("#tai_link_or").click();
                                           // i have to use regex because the name of the PDU flag overlaps with both unobtainable and discontinued if i don't look for the prepended number
                                           if(/\d{1,2} Discontinued/i.test(text)) $("#tai_flag_filter div.flag-discontinued").prev("input[type='checkbox']").prop("checked",true);
                                           if(/\d{1,2} Unobtainable/i.test(text)) $("#tai_flag_filter div.flag-unobtainable").prev("input[type='checkbox']").prop("checked",true);
                                           if(/\d{1,2} Partly Discontinued\/Unobtainable/i.test(text)) $("#tai_flag_filter div.flag-partly-discontinued").prev("input[type='checkbox']").prop("checked",true);

                                           flag_filter();
                                          });
                }
                // need all the achievements to be in containers for sorting
				$("div#main h1.pagetitle, div#main h6[id^='h6DLC_']").each(function() {
					var $achievement_list = $(this).nextUntil("h6[id^='h6DLC_']","div.achievementpanel");
					$achievement_list.first().prev().after(
						$("<div/>")
							.attr("class","tai-achievement-list")
							.append($achievement_list)
					);
				});
            }
            break;
        case "solutions.aspx":
			function filter_solutions(enable,type) {
				$("table#oSolutionList tbody tr:not([nodrop])").each(function() {
					if(!enable) $(this).show();
					else if(type === "votes" && $(this).children().eq(9).text().trim().length) $(this).show();
					else if(type === "neg" && ($(this).children().eq(8).text().trim()*1) > ($(this).children().eq(7).text().trim()*1)) $(this).show();
					else if(type === "none" && ($(this).children().eq(8).text().trim()*1) === 0 && ($(this).children().eq(7).text().trim()*1) === 0) $(this).show();
					else $(this).hide();
				});
			}

			var gamer_id = $("#mnuMyPages a[href*='gamerid=']").first().attr("href").match(/gamerid=(\d{1,8})(?:&|$)/i),
				addr_id = window.location.href.match(/gamerid=(\d{1,8})(?:&|$)/i);
			if($.type(gamer_id) === "array") gamer_id = gamer_id[1];
			if($.type(addr_id) === "array") addr_id = addr_id[1];

			if(gamer_id === addr_id && script_settings.solution_list_filters) {
				$("table#oFilter tbody tr").first().after(
					$("<tr/>").append(
						$("<td/>").append(
							$("<input/>")
								.attr({
									"class":"checkbox",
									"id":"tai_weekly_votes",
									"type":"checkbox"
								}) // these are checkboxes because the filter needs to be able to be turned off by unchecking the active filter.  radio buttons must always have a selected button
								.click(function() {
									$("#tai_negative_votes, #tai_no_votes").prop("checked",false);
									filter_solutions(($(this).prop("checked") === true),"votes");
								}),
							$("<label/>")
								.attr({
									"class":"checkboxcaption",
									"for":"tai_weekly_votes"
								})
								.text("Votes this week")
						),
						$("<td/>").append(
							$("<input/>")
							.attr({
								"class":"checkbox",
								"id":"tai_negative_votes",
								"type":"checkbox"
							})
							.click(function() {
								$("#tai_weekly_votes, #tai_no_votes").prop("checked",false);
								filter_solutions(($(this).prop("checked") === true),"neg");
							}),
							$("<label/>")
							.attr({
								"class":"checkboxcaption",
								"for":"tai_negative_votes"
							})
							.text("Negative vote ratio")
						),
						$("<td/>").append(
							$("<input/>")
							.attr({
								"class":"checkbox",
								"id":"tai_no_votes",
								"type":"checkbox"
							})
							.click(function() {
								$("#tai_weekly_votes, #tai_negative_votes").prop("checked",false);
								filter_solutions(($(this).prop("checked") === true),"none");
							}),
							$("<label/>")
							.attr({
								"class":"checkboxcaption",
								"for":"tai_no_votes"
							})
							.text("No votes")
						)
					)
				);

				$("table#oSolutionList")
					.find("thead tr th a").each(function() {
						$(this).replaceWith(document.createTextNode($(this).text()));
					});

				$("table#oSolutionList thead tr th[colspan]").before($("<th/>")).removeAttr("colspan");

				$("table#oSolutionList").tablesorter({
					headers: {
						0:{sorter:false},
						2:{sorter:false},
						6:{sorter:false},
						10:{sorter:false},
						11:{sorter:false}
					},
					textExtraction: {
						1:function(n,t,c) {return $("a",n).first().text();},
						3:function(n,t,c) {return $("a",n).first().text();},
						5:function(n,t,c) {return $(n).text().slice(1,-1);},
						9:function(n,t,c) {return $(n).text().length;}
					},
					sortAppend: {
						1:[[3,'a']],
						4:[[1,'a']],
						5:[[1,'a']],
						7:[[1,'a']],
						8:[[1,'a']],
						9:[[1,'a']],
					}
				});
            }
            break;
        case "gamingsessionfeedback.aspx":
            $(".gsdisclaimer").remove();
            break;
        case "gamingsession.aspx":
			function chop_id(s) {
				if(typeof s === "string") return s.slice(s.lastIndexOf("=")+1);
				return "";
			}

			var user_id = chop_id($("#mnuMyPages li a[href*='gamerid=']").attr("href"));

			if(user_id.length) { // no sense doing any of this if the user is not logged in, especially considering we can't tell if they're in the session
				var $game_anchor = $("a.mainlink[href*='achievements.htm']").first(),
					game_url = $game_anchor.attr("href"),
					game_name = $game_anchor.text(),
					game_id = "",
					$game_id_link = $("a[href*='gameid=']").first(),
					in_this_session = ($("#oGamingSessionGamerList td.gamer a[href*='gamerid="+user_id+"']").length > 0);

				if($game_id_link.length) game_id = chop_id($game_id_link.attr("href"));
				else { // this link does not appear if you have not unlocked achievements in the game, so now i need to do a synchronous get request
					$.ajax({
						async:false,
						method:"GET",
						url:game_url
					})
					.done(function(page) {
						game_id = chop_id($("a[href*='gameid=']",page).first().attr("href"));
					});
				}

				$(".gsdisclaimer").remove();

				if(script_settings.session_hide_user_statuses) $("span.sitestatus").remove();

				if(script_settings.session_achievement_matrix && in_this_session) { // matrix will not display if the user is not in this session
					if($("#main div.session div.sessionachievements div.friendfeeditem").length > 1) { // i'm sure everyone can keep track of one achievement without a matrix display
						var longest_ach = 0, // so we can move the table down by an appropriate amount later
							$row_filler = $("<tr/>"), // the "unknown" cells that occupy the table by default
							$gamers = $("#oGamingSessionGamerList tbody tr:not([nodrop])"),
							$achievements = $("#main div.session div.sessionachievements div.friendfeeditem"),
							$table = $("<table/>").append(
								$("<thead/>").append(
									$("<tr/>").append(
										$("<th/>")
											.attr({
												"class":"functions",
												"colspan":"2"
											})
											.append(
												$("<img/>")
													.attr({
														"id":"tai_refresh_matrix",
														"title":"Refresh matrix",
														"alt":"Refresh matrix",
														"src":"/images/icons/refresh.png"
													})
													.click(function() {
														if($(this).attr("src") === "/images/icons/refresh.png") {
															$(this)
																.attr({
																	"src":"/images/icons/refreshoff.png",
																	"title":"Refreshing, please wait...",
																	"alt":"Refreshing, please wait..."
																})
																.addClass("spin-anim");
															var $gamers = $("#tai_achievement_matrix tbody tr[data-id][cheater!='egregious']");
															matrix_scans_left = $gamers.length; // not using "var" makes the variable global scope despite being declared in a function

															$.each($gamers,function() {
																var gid = $(this).attr("data-id");
																$.get((game_url+"?gamerid="+gid),function(page) {
																	$.each($("#tai_achievement_matrix thead th[data-id]"),function() {
																		var $ach = $(("#main .achievementpanel#ap"+$(this).attr("data-id")),page);
																		$("#tai_achievement_matrix tr[data-id='"+gid+"'] td").eq($(this).index()+1) // we have one extra table header cell that is not in the list
																			.removeClass("unknown owned not_owned cannot_toggle")
																			.addClass($ach.hasClass("green") ? "owned cannot_toggle" : "not_owned");
																	});
																	if(--matrix_scans_left === 0) $("#tai_refresh_matrix")
																		.attr({
																			"src":"/images/icons/refresh.png",
																			"title":"Refresh matrix",
																			"alt":"Refresh matrix"})
																		.removeClass("spin-anim");
																});
															});
														}
													}),
												$("<img/>")
													.attr({
														"title":"Matrix help",
														"alt":"Matrix help",
														"src":"/images/icons/helper.png"
													})
													.click(function() {
														display_help_topic("tai_session_matrix");
													})
											)
									)
								)
							);

						$achievements.each(function() {
							var $anchor = $(this).find("span a:first-child");
							longest_ach = Math.max(longest_ach,$anchor.outerWidth());

							$table.find("thead tr").append(
								$("<th/>")
									.attr("data-id",$anchor.attr("href").match(/\/a(\d{1,7})\//i)[1])
									.append(
										$("<a/>")
											.attr({
												"href":$anchor.attr("href"),
												"target":"_blank",
												"title":($anchor.text()+" -- "+$(this).find(".achdesc").first().text())
											})
											.text($anchor.text())
									)
							);

							$row_filler.append(
								$("<td/>")
									.attr("class","unknown")
									.click(function() {
										if(!$(this).hasClass("cannot_toggle")) {
											if($(this).hasClass("owned")) $(this).removeClass("owned").addClass("not_owned");
											else $(this).removeClass("not_owned unknown").addClass("owned");
										}
									})
							);
						});
                    	$table.append($("<tbody/>"));

						$gamers.each(function() {
							function cheat_desc($e) {
								if($e.length) {
									if($e.attr("src").indexOf("/images/Gamerscore.png") > -1) return "gamerscore";
									return "egregious";
								}
								return "false";
							}

                        	function cheat_icon() {
								var $element = $("<span/>").attr("class","cheater-icon");
								if(cheater !== "false") {
									$element = $("<a/>")
										.attr({
											"class":"cheater-icon",
											"href":"/cheatpolicy.aspx",
											"target":"_blank"
										})
										.append(
											$("<img/>")
												.attr({
													"src":(cheater === "egregious" ? "/images/icons/stop.png" : "/images/icons/gamerscore.png"),
													"title":(cheater === "egregious" ? (gamer_tag+" has had all of their achievements removed for egregious cheating.  The matrix will not display any information for this gamer.") : (gamer_tag+" has cheated several games in the past, but has not surpassed an arbitrary egregiousness threshold to have tracking removed."))
												})
										);
								}
								return $element;
							}

							function flag_icon($f) {
								if($f.length) return $f.clone().attr("target","_blank");
								else return $("<span/>").attr("class","icon-spacer-24");
							}

            	            function xbl_icon() {
								var title = (gamer_tag+" on Xbox Live");
								return $("<a/>")
									.attr({
										"href":("http://live.xbox.com/en-US/profile/profile.aspx?pp=0&GamerTag="+encodeURIComponent(gamer_tag)),
										"target":"_blank"
									})
									.append(
										$("<img/>")
											.attr({
												"src":"/images/icons/xbox.png",
												"title":title,
												"alt":title
											})
									);
							}

							function pm_icon() {
								if(user_id !== gamer_id) {
									var title = ("Send private message to "+gamer_tag);
									return $("<a/>")
										.attr({
											"href":("/privatemessage.aspx?gamerid="+gamer_id),
											"target":"_blank"
										})
										.append(
											$("<img/>")
												.attr({
													"src":"/images/icons/contactus.png",
													"title":title,
													"alt":title})
										);
								}
								else return $("<span/>").attr("class","icon-spacer-16");
							}

							function feedback_icon() {
								var ratio = (((fb_info[3]*1)+(fb_info[4]*1))/Math.max(fb_info[2]*1,1)),
								title = ("Session feedback: "+fb_info[2]+" positive, "+fb_info[3]+" neutral, "+fb_info[4]+" negative ("+Math.round(ratio*100)+"% poor vote ratio)");
								return $("<a/>")
									.attr({
										"href":("/gamerfeedback.aspx?gamerid="+gamer_id),
										"target":"_blank"
									})
									.append(
										$("<img/>")
											.attr({
												"src":("/images/icons/smiley-"+(ratio >= 0.15 ? "mad" : (ratio <= 0.05  ? "grin" : "neutral"))+".png"),
												"title":title,
												"alt":title
											})
									);
							}

							var $anchor = $(this).find("td:nth-child(3) a:first"),
								gamer_tag = $anchor.text(),
								gamer_id = $anchor.attr("href").match(/gamerid=(\d{1,8})(?:&|$)/i)[1],
								fb_info = $(this).find("td:nth-child(5) a:first").attr("title").match(/score of (\d{1,5}(?:\.\d{2})?) \((\d{1,5}) positive, (\d{1,5}) neutral, (\d{1,5}) negative/i),
								status = $(this).find("td:nth-child(9)").text().toLowerCase(),
								cheater = cheat_desc($(this).find("a.cheatinfo img"));

							$table.append(
								$("<tr/>")
									.attr({
										"data-id":gamer_id,
										"cheater":cheater
									})
									.append(
										$("<td/>")
											.attr("class","actions")
											.append(
												flag_icon($(this).find("td:nth-child(1) a:first")),
												xbl_icon(),
												pm_icon(),
												feedback_icon()
											),
										$("<td/>")
											.attr("class","gamertag "+status)
											.append(
												$("<a/>")
													.attr({
														"href":$anchor.attr("href"),
														"target":"_blank",
														"title":("View "+((user_id === gamer_id) ? "your" : (gamer_tag+"'s"))+" achievements in "+game_name)
													})
													.text(gamer_tag),
												cheat_icon()
											),
										$row_filler.children().clone(true)
									)
							);
						});

						// a 45 degree rotation reduces the cardinal width of the element by about 77%.  since longest_ach contains the display
						// width of the longest achievement's name in pixels, we can reduce that by about 77% to shift the table downward and
						// allow enough room to display the header text
						$("#oGamingSessionGamerListHolder").after(
							$("<div/>")
								.attr("id","tai_achievement_matrix")
								.css("margin-top",Math.floor(longest_ach*0.77))
								.append($table)
						);

						$("h1.block:contains(Intended achievements for this session), div.sessionachievements, h1.block:contains(Gamers in session), #oGamingSessionGamerListHolder").remove();
					}
				}

				if(script_settings.session_userlinks_compare) { // change gamertag links to compare page
					$("#oGamingSessionGamerList td.gamer a[href*='achievements.htm?gamerid='], #tai_achievement_matrix td.gamertag a[href*='achievements.htm?gamerid=']").each(function() {
						var other_id = chop_id($(this).attr("href"));

						if(other_id != user_id) $(this).attr({
							"href":("/comparison.aspx?gameid="+game_id+"&gamerid="+other_id+"&friendid="+user_id),
							"title":("Compare your achievements with "+$(this).text()+" in "+game_name)
						});
					});
				}
			}
            break;
        case "customize.aspx":
            // insert the options for this script on the page
            $("#oOptionPanel")
                .before($("<div/>")
                        .attr("class","buttons")
                        .append($("<a/>")
                                .attr({"class":"button",
                                       "id":"btnSaveTop",
                                       "onclick":"Postback('btnSave_click');return false;"})
                                .append($("<img/>")
                                        .attr({"src":"/images/icons/save.png",
                                               "alt":"Save",
                                               "title":"Save"}),
                                        $("<span/>")
                                        .css("padding-left","4px")
                                        .text("Save")
                                       )
                                .click(function() {store_settings();}), // the jquery click event will fire before the inline onclick event
                                $("<div/>")
                                .attr("class","clearboth")
                               )
                       )
                .prepend($("div.informationpanel"), // because this element is appended out of order due to this script's modifications
                         $("<div/>")
                         .attr({"class":"inputform",
                                "id":"divImprover"})
                         .append($("<div/>")
                                 .attr("class","innerform")
                                 .append($("<h2/>")
                                         .text("TA Improver Script"),
                                         script_setting_display("tai_hide_ads","checkbox",script_settings.hide_ads,"Hide advertisements","This is pretty obvious."),
                                         script_setting_display("tai_dates","checkbox",script_settings.normalize_dates,"Normalize dates","TA has a bad habit of using half a dozen different date formats and further using fuzzy dates by saying something like 'tomorrow' instead of listing a calendar date.  This option sets all dates to the same format."),
                                         script_setting_display("tai_improve_chat","checkbox",script_settings.improve_chat,"Improve chat interface","Rearrange the chat interface to look better and save space."),
                                         script_setting_display("tai_session_compare","checkbox",script_settings.session_userlinks_compare,"Change user session links to compare","When clicking on a gamertag in a session roster table, this option will default the link to compare your achievements with them for that game instead of linking you to their homepage."),
                                         script_setting_display("tai_user_statuses","checkbox",script_settings.session_hide_user_statuses,"Hide user statuses in sessions","User statuses are generally just stretching the size of the table for no good reason, so using this option will hide statuses in the session roster table."),
                                         script_setting_display("tai_permalinks","checkbox",script_settings.feed_permalinks,"Friend feed permalinks","Add a permalink icon to comments on the friend feed for easily linking other people to the conversation."),
                                         script_setting_display("tai_spoilers","checkbox",script_settings.fix_spoilers,"Fix spoiler tags","This option will change spoiler tags so that the header text always remains and can be clicked to collapse the spoiler content again."),
                                         script_setting_display("tai_filter","checkbox",script_settings.settings_page_filter,"Filter settings","Adds a textbox to the top of this page to easily filter out options by search query."),
                                         script_setting_display("tai_video_links","checkbox",script_settings.display_video_links,"Video links","Display a clickable hyperlink of the video URL above it.  Most useful for those running ad/script blockers who block the YouTube domain when it's not first-party."),
                                         script_setting_display("tai_longdate","textbox",script_settings.long_date_format,"Long date format","A 'long date' is one that includes the year.  If the script finds a calendar date with an accompanying year, then it will use this format to reconfigure the output."),
                                         script_setting_display("tai_shortdate","textbox",script_settings.short_date_format,"Short date format","A 'short date' does not include the year.  Any short dates will be reconfigured using this output."),
                                         script_setting_display("tai_time","textbox",script_settings.time_format,"Time format","The format of time output to be used, if the time is included on a calendar date display."),
                                         script_setting_display("tai_always_longdate","checkbox",script_settings.always_long_date,"Always use long date","The script will not differentiate between short dates and long dates and will simply use the long date format in all circumstances."),
                                         script_setting_display("tai_solution_list_filter","checkbox",script_settings.solution_list_filters,"Solution list vote filter","I don't know about everyone else, but I check my solution list at least once a day for vote changes.  Enabling this option will add checkboxes to your list of solutions to filter for solutions with votes cast in the last week and filter for zero or negative vote ratios overall."),
                                         script_setting_display("tai_improve_achievement_list","checkbox",script_settings.achievement_page_improvements,"Improve achievement list","This will reconfigure a game's achievement list page to remove all postback to the site and instead filter achievements without reloading the page.  This option will also add a NOT filter."),
                                         script_setting_display("tai_session_matrix","checkbox",script_settings.session_achievement_matrix,"Session page achievement matrix","A fast and easy reference for session participants to see who has earned which achievements right on the session page.  The matrix will only appear on sessions that you have joined that also have more than one achievement listed."),
										 script_setting_display("tai_sort_solutions","checkbox",script_settings.solution_sorting,"Solution sorting","Sort posted solutions for an achievement by many values, including highest vote ratio, highest total positive votes, oldest, newest, author's total TA score, and author's TA score in that game."),
										 script_setting_display("tai_walkthrough_bookmarks","checkbox",script_settings.walkthrough_bookmarks,"Walkthrough bookmarks","Click a paragraph to save a bookmark in a walkthrough for later.  A bookmark icon will appear to the left of the bookmarked paragraph, and an icon will appear next to the page title that will send you directly to your bookmark when clicked.  This option also adds a list of all current bookmarks on TA's walkthrough hub."),
										 script_setting_display("tai_show_all_pages","checkbox",script_settings.show_all_pages,"Override pagination","Adds a 'Show all' option to the pagination elements on table displays, such as the list of solutions written by you or the list of backward compatible games.  The 'show all' process delays its page requests until the last request has completed so it does not spam the server, but it will still work on any paged table with any number of pages so you'd better be sure you want it to happen if you click the button."),
										 script_setting_display("tai_block_users","checkbox",script_settings.block_users,"Block users","Adds a 'Hide all posts' button to user details on the forum to hide everything they post, including when quoted by others.")
                                        ),
                                 $("<div/>")
                                 .attr("class","clearboth")
                                )
                        );
			$("#btnCancel").remove(); // the cancel button doesn't even do anything
			$("#btnSave").click(function() {store_settings();});
            // this page has become ridiculously bloated so this simple search filter helps quickly narrow relevant options down
			if(script_settings.settings_page_filter) $("div#main h1.pagetitle")
				.css("display","inline-block")
				.after(
					$("<img/>")
						.attr({
							"src":"/images/icons/information.png",
							"alt":"Quickly find relevant options you're looking for by typing search text in the box, then hitting Enter/Return or clicking the Find button.",
							"title":"Quickly find relevant options you're looking for by typing search text in the box, then hitting Enter/Return or clicking the Find button."
						})
						.css("margin-left","8px"),
					$("<input/>")
						.attr({
							"type":"text",
							"id":"filter-text"
						})
						.css({
							"margin-left":"8px",
							"margin-bottom":"-2px"
						})
						.keyup(function(e) {
							if(e.which === 13 || !$(this).val().length) $("#execute-filter").click();
						}),
					$("<input/>")
						.attr({
							"type":"button",
							"value":"Find",
							"class":"button",
							"id":"execute-filter"})
						.css("margin-left","8px")
						.click(function() {
							var q = $("#filter-text").val();
							$("div#oOptionPanel div.inputform div.innerform").each(function() {
								$(this).children("div.filtered-out, div:not([class]), div[class='']").each(function() {
									if(!q.length || $(this).html().toLowerCase().indexOf(q) > -1) $(this).removeClass("filtered-out").show();
									else $(this).addClass("filtered-out").hide();
								});
								if(!q.length || $(this).children("div").not(".clearboth, .filtered-out").length) $(this).parent().show();
								else $(this).parent().hide();
							});
						})
				);
            break;
        case "chat.aspx":
            if(script_settings.improve_chat)
            {
                // this whole section is overriding the default styling of the page when viewing the chatroom to change a whole
                // bunch of things, including:
                // # changing the font of the whole chat interface
                // # extending the height of the userlist to be the same as the chatbox
                // # collapses vertical space to fit the entire chat on one screen without scrolling
                // # extending the width of the input box
                // # giving the timestamp a fixed width
                // # giving the gamertag a fixed width
                // # positioning the buttons we'll be adding after the text input later
                // # preventing long words (spam) from adding horizontal scrolling
                // # moves the clear chat button out of the display box and puts it next to the input box
                // # removes the large footer for the chat guidelines and makes it a tiny button by the input box instead
                // # removes the "TrueAchievements Chat" page header

                // this section moves the clear chat button and creates a new rules button to the right of the input box at the bottom
                $("#btnClearChat")
                    .insertBefore($("#divChatKey"))
                    .after($("<a/>")
                           .attr({"href":"chatpolicy.aspx",
                                  "target":"_blank"})
                           .append($("<img/>")
                                   .attr({"src":"/images/itemflags/MainStoryline.png",
                                          "id":"btnChatRules",
                                          "title":"Chat guidelines",
                                          "alt":"Chat guidelines"})
                                  )
                          );
                $("#divChatKey, #divChatInformation, h1.pagetitle, #footer-wrap").remove();

                $("head").append($("<style/>")
                                 .attr("type","text/css")
                                 .text("div#divChatHolder {font-family: 'Droid Sans Mono',monospace !important} "+
                                       "div#divChatList {width: 175px !important; height: 450px !important;}" +
                                       "div#divChatBody {margin-right: 190px !important; height: 450px !important; overflow-wrap: break-word !important;} "+
                                       "input#txtChatMessage {width: 720px !important;} "+
                                       "span.chattime {display: inline-block !important; width: 65px !important; font-style: normal !important;} "+
                                       "span.gamertag {display: inline-block !important; width: 105px !important;} "+
                                       "a#btnClearChat {position: relative !important; top: -4px !important; right: auto !important; padding-right: 8px !important;} "+
                                       "img#btnChatRules {position: relative !important; top: -4px !important;} "+
                                       "div#main-holder {padding-bottom: 0 !important;} "+
                                       "div#main {padding: 10px 10px 0px 10px !important; min-height: 0 !important;} "+
                                       "div#page-wrap {padding-bottom: 0 !important;} "+
                                       "div#page {min-height: 0 !important;} ")
                            );
            }
            break;
    }
});
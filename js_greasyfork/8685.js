// ==UserScript==
// @name 		rainbow gamevn
// @namespace 	https://greasyfork.org/en/scripts/8685-rainbow-gamevn
// @description This script add color text in gamevn and some xenforo 4r else.
// @run-at      document-end
// @version	    1.2.1
// @grant 	    GM_setValue
// @grant 	    GM_getValue
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @include 	/^https?:\/\/.*.tinhte.vn/(threads|conversations)/*
// @include 	/^https?:\/\/.*.nhattao.com/(threads|conversations)/*
// @include 	/^https?:\/\/.*.gamevn.com/(threads|conversations)/*
// @downloadURL https://update.greasyfork.org/scripts/8685/rainbow%20gamevn.user.js
// @updateURL https://update.greasyfork.org/scripts/8685/rainbow%20gamevn.meta.js
// ==/UserScript==vvvar SIZE = 2;
var COLOR = 'black';
var inDam = 0;
var inNghieng = 0;
var sizeDefault = false;
var colorDefault = false;

var rainbow_fontsize = 'rainbow_fontsize';
var rainbow_fontcolor = 'rainbow_fontcolor';
var rainbow_bold = 'rainbow_bold';
var rainbow_italic = 'rainbow_italic';
var spoiler = 'spoiler';

var optionCSS = "<style>div.rainbow_option_box {display:inline-block;margin-left:5px;margin-right:5px;} div.rainbow_option_area{margin:5px 1px; padding:5px;border-top:1px solid gray;} div.rainbow_button{display:inline-block;margin:3px 3px;padding:3px 4px;background-color:grey;color:white;cursor:pointer}</style>";
$('head').append(optionCSS);
var optionHTML = "<div class='rainbow_option_area' align='center'><div class='rainbow_option_box'>Font size <select id='rainbow_fontsize'><option value='1'>1</option><option value='2'>2 (default)</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select></div><div class='rainbow_option_box'>Color <input type='text' id='rainbow_fontcolor' title='Màu chữ có thể ở dạng tên (vd: black, blue) hoặc mã HEX (vd: #4827F3)' style='width: 6em; padding-left: 5px' /></div><div class='rainbow_option_box'><input type='checkbox' id='rainbow_bold' />Bold</div><div class='rainbow_option_box'><input type='checkbox' id='rainbow_italic' />Italic</div><div class='rainbow_option_box'><input type='checkbox' id='spoiler' />Spoiler</div><div class='rainbow_option_box'><div class='rainbow_button' id='rainbow_btn_save'>Save</div><div class='rainbow_button' id='rainbow_btn_default'>Restore Default</div></div><div align='center' style='margin-top: 5px' id='rainbow_version'>VOZ Rainbow</div></div>";

var quickRep = $('#QuickReply');
var fullRep = $('#ThreadReply');
var Rep = null;
if (quickRep.length>0) {
    Rep = $('#QuickReply');
}else if (fullRep.length>0) {
    Rep = $('#ThreadReply');
}else {Rep = $('form.xenForm.Preview');}
Rep.append(optionHTML);

function loadSetting() {
    SIZE = GM_getValue(rainbow_fontsize, 2);
    COLOR = GM_getValue(rainbow_fontcolor, 'black');
    inDam = GM_getValue(rainbow_bold, 0);
    inNghieng = GM_getValue(rainbow_italic, 0);
    spoil = GM_getValue(spoiler, 0);
    sizeDefault = false;
    colorDefault = false;
    $('#' + rainbow_fontsize).val(SIZE);
    $('#' + rainbow_fontcolor).val(COLOR);
    if (inDam > 0) $('#' + rainbow_bold).attr('checked', 'checked');
    else $('#' + rainbow_bold).removeAttr('checked');
    if (spoil > 0) $('#' + spoiler).attr('checked', 'checked');
    else $('#' + spoiler).removeAttr('checked');
    if (inNghieng > 0) $('#' + rainbow_italic).attr('checked', 'checked');
    else $('#' + rainbow_italic).removeAttr('checked');
    if (SIZE == 2) sizeDefault = true;
    if (COLOR.toLowerCase() == "black" || COLOR.toLowerCase() == "#000000") colorDefault = true;
    console.log('loaded ' + SIZE + ' , ' + COLOR + ' , ' + inDam + ' , ' + inNghieng);
}

function saveSetting() {
    SIZE = $('#' + rainbow_fontsize).val();
    COLOR = $('#' + rainbow_fontcolor).val();
    if (COLOR === '') COLOR = 'black';
    if ($('#' + rainbow_bold).is(':checked')) inDam = 1;
    else inDam = 0;
    if ($('#' + spoiler).is(':checked')) spoil = 1;
    else spoil = 0;
    if ($('#' + rainbow_italic).is(':checked')) inNghieng = 1;
    else inNghieng = 0;
    var r = confirm("Do you want to save these settings?" + "\n\nFont size: " + SIZE + "\nFont color: " + COLOR + "\nBold: " + inDam + "\nItalic: " + inNghieng);
    if (r === true) {
	GM_setValue(rainbow_fontsize, SIZE);
	GM_setValue(rainbow_fontcolor, COLOR);
	GM_setValue(rainbow_bold, inDam);
	GM_setValue(spoiler, spoil);
	GM_setValue(rainbow_italic, inNghieng);
	loadSetting();
    }

}

function loadDefault() {
    var r = confirm("Do you want to restore to default settings?");
    if (r === true) {
	GM_setValue(rainbow_fontsize, 2);
	GM_setValue(rainbow_fontcolor, 'black');
	GM_setValue(rainbow_bold, 0);
	GM_setValue(rainbow_italic, 0);
	GM_setValue(spoiler, 0);
	loadSetting();
    }
}

loadSetting();
$('#rainbow_btn_default').click(loadDefault);
$('#rainbow_btn_save').click(saveSetting);
$('#rainbow_version').html(
	'VOZ Rainbow ' + GM_info.script.version + ' | Author: <b>skyfall</b> @ vozforums.com and edited by <b>Doctor Who</b> @ vozforums.com');
/*
 * hết tùy chọn
 */
var reply = Rep.find("input[type='submit'].button.primary");
reply.click(submit);
var view = Rep.find("input[type='button']");
view.click(submit);
function submit(){
    comment = Rep.find('iframe').contents().find('body');
    var s = appendCode(comment.html());
    comment.empty();
    comment.append(s);
}
$("div.messageInfo.primaryContent > div.messageMeta.ToggleTriggerAnchor > div.privateControls > a.item.control.edit.OverlayTrigger").click(function(){
    setTimeout (function(){var edit = $('form[action*="save-inline"]');
    edit.click(submit_edit);
   }, 4000);
});
function submit_edit(){
    comment = $('form[action*="save-inline"] iframe').contents().find('body');
    var s = appendCode(comment.html());
    comment.empty();
    comment.append(s);
}
function appendCode(s) {
    var bString = "";
    var eString = "";
    if (spoil == 1) {
	bString = "[spoiler]" + bString;
	eString = eString + "[/spoiler]";
    }
    if (inDam == 1) {
	bString = "[b]" + bString;
	eString = eString + "[/b]";
    }
    if (inNghieng == 1) {
	bString = "[i]" + bString;
        
	eString = eString + "[/i]";
    }
    if (!colorDefault) {
	bString = "[color=" + COLOR + "]" + bString;
	eString = eString + "[/color]";
    }
    if (!sizeDefault) {
	bString = "[size=" + SIZE + "]" + bString;
	eString = eString + "[/size]";
    }
    s = s.split('[QUOTE]').join(eString+'[QUOTE]');
    s = s.split('[QUOTE=').join(eString+'[QUOTE=');
    s = s.split('[/QUOTE]').join('[/QUOTE]'+bString);
    
    s = bString + s + eString;

    s = s.split(bString+'<p>'+eString).join('<p>');
    s = s.split(bString+bString).join(bString);
    s = s.split(eString+eString).join(eString);
    return s;
}
// ==UserScript==
// @name        ImageFAQs Beta
// @namespace   FightingGames@gfaqs
// @include     http://www.gamefaqs.com
// @include     http://www.gamefaqs.com*
// @description Converts plain-text image and webm URLs into their embedded form
// @version     1.13b2
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js
// @resource    jqueryuibaseCSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery.ui.base.css
// @resource    jqueryuithemeCSS https://code.jquery.com/ui/1.11.4/themes/cupertino/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/9861/ImageFAQs%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/9861/ImageFAQs%20Beta.meta.js
// ==/UserScript==

/* 
    The MIT License (MIT)

    This greasemonkey script for GameFAQs converts image and webm
    links into their embedded form. It can be considered as a spiritual successor
    to text-to-image for GameFAQs. Many of its features are inspired from appchan x
    by zixaphir at http://zixaphir.github.io/appchan-x/.
    
    Copyright (c) 2015 FightingGames@gamefaqs <adrenalinebionicarm@gmail.com>
    Copyright (c) 2015 FeaturingDante@gamefaqs <featuringDante@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

*/




/*http://stackoverflow.com/questions/5223/length-of-a-javascript-object-that-is-associative-array*/
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


/*https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Whitespace_in_the_DOM*/
/**
 * Throughout, whitespace is defined as one of the characters
 *  "\t" TAB \u0009
 *  "\n" LF  \u000A
 *  "\r" CR  \u000D
 *  " "  SPC \u0020
 *
 * This does not use Javascript's "\s" because that includes non-breaking
 * spaces (and also some other characters).
 */


/**
 * Determine whether a node's text content is entirely whitespace.
 *
 * @param nod  A node implementing the |CharacterData| interface (i.e.,
 *             a |Text|, |Comment|, or |CDATASection| node
 * @return     True if all of the text content of |nod| is whitespace,
 *             otherwise false.
 */
function is_all_ws( nod )
{
  // Use ECMA-262 Edition 3 String and RegExp features
  return !(/[^\t\n\r ]/.test(nod.textContent));
}


/**
 * Determine if a node should be ignored by the iterator functions.
 *
 * @param nod  An object implementing the DOM1 |Node| interface.
 * @return     true if the node is:
 *                1) A |Text| node that is all whitespace
 *                2) A |Comment| node
 *             and otherwise false.
 */

function is_ignorable( nod )
{
  return ( nod.nodeType == 8) || // A comment node
         ( (nod.nodeType == 3) && is_all_ws(nod) ); // a text node, all ws
}

/**
 * Version of |previousSibling| that skips nodes that are entirely
 * whitespace or comments.  (Normally |previousSibling| is a property
 * of all DOM nodes that gives the sibling node, the node that is
 * a child of the same parent, that occurs immediately before the
 * reference node.)
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The closest previous sibling to |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function node_before( sib )
{
  while ((sib = sib.previousSibling)) {
    if (!is_ignorable(sib)) return sib;
  }
  return null;
}

/**
 * Version of |nextSibling| that skips nodes that are entirely
 * whitespace or comments.
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The closest next sibling to |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function node_after( sib )
{
  while ((sib = sib.nextSibling)) {
    if (!is_ignorable(sib)) return sib;
  }
  return null;
}

/**
 * Version of |lastChild| that skips nodes that are entirely
 * whitespace or comments.  (Normally |lastChild| is a property
 * of all DOM nodes that gives the last of the nodes contained
 * directly in the reference node.)
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The last child of |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function last_child( par )
{
  var res=par.lastChild;
  while (res) {
    if (!is_ignorable(res)) return res;
    res = res.previousSibling;
  }
  return null;
}

/**
 * Version of |firstChild| that skips nodes that are entirely
 * whitespace and comments.
 *
 * @param sib  The reference node.
 * @return     Either:
 *               1) The first child of |sib| that is not
 *                  ignorable according to |is_ignorable|, or
 *               2) null if no such node exists.
 */
function first_child( par )
{
  var res=par.firstChild;
  while (res) {
    if (!is_ignorable(res)) return res;
    res = res.nextSibling;
  }
  return null;
}

/**
 * Version of |data| that doesn't include whitespace at the beginning
 * and end and normalizes all whitespace to a single space.  (Normally
 * |data| is a property of text nodes that gives the text of the node.)
 *
 * @param txt  The text node whose data should be returned
 * @return     A string giving the contents of the text node with
 *             whitespace collapsed.
 */
function data_of( txt )
{
  var data = txt.textContent;
  // Use ECMA-262 Edition 3 String and RegExp features
  data = data.replace(/[\t\n\r ]+/g, " ");
  if (data.charAt(0) == " ")
    data = data.substring(1, data.length);
  if (data.charAt(data.length - 1) == " ")
    data = data.substring(0, data.length - 1);
  return data;
}





this.$ = this.jQuery = jQuery.noConflict(true);





/*this top portion of the script handles the settings box and local storage*/

var thumbnailImgWidth = 150;
var thumbnailImgHeight = 150;
var settingsJSON = localStorage.getItem("imagefaqs");        
var settings;       /*key-value array of JSON*/
var sessionSpoilersHotkey;

/*if imageFAQs was freshly installed*/
if (settingsJSON === null)
{
    settings = {
        enable_sigs: false,
        enable_floatingImg: true,
        includeSigWhenExpanding: false,
        blackoutSpoilerSig: false,
        show_imgURLspan: true,
        show_imgResolutionSpan: true,
        show_imgFilesizeSpan: false,
        show_imgGoogle: true,
        show_imgIqdb: true,
        show_blacklistToggle: true,
        show_imgAllResizeToggles: true,
        embed_images_side_by_side: false,
        auto_scroll_when_thumbnail_clicked: true,
        thumbnailWidth: thumbnailImgWidth,
        thumbnailHeight: thumbnailImgHeight,
        expandedWidth: 0,
        expandedHeight: 0,
        imgContainerBackgroundColor: "#DFE6F7",
        isSpoilersMode: false,
        spoilersHotkey: {115: 115},  /*F4*/
        resizeHotkey: {113: 113},  /*F2*/
        blacklistStr: ""
    };
    
    localStorage.setItem("imagefaqs", JSON.stringify(settings));    /*save default settings*/
}
else 
{
    settings = jQuery.parseJSON(settingsJSON);

    if (settings.expandedWidth === undefined)
        settings.expandedWidth = 0;
    
    if (settings.expandedHeight === undefined)
        settings.expandedHeight = 0;
    
    if (settings.show_imgURLspan === undefined)
        settings.show_imgURLspan = true;
    
    if (settings.show_imgResolutionSpan === undefined)
        settings.show_imgResolutionSpan = true;
    
    if (settings.show_imgFilesizeSpan === undefined)
        settings.show_imgFilesizeSpan = true;
    
    if (settings.show_imgGoogle === undefined)
        settings.show_imgGoogle = true;
    
    if (settings.show_imgIqdb === undefined)
        settings.show_imgIqdb = true;
    
    if (settings.show_blacklistToggle === undefined)
        settings.show_blacklistToggle = true;
    
    if (settings.show_imgAllResizeToggles === undefined)
        settings.show_imgAllResizeToggles = true;
    
    if (settings.enable_floatingImg === undefined)
        settings.enable_floatingImg = true;
    
    if (settings.embed_images_side_by_side === undefined)
        settings.embed_images_side_by_side = false;
    
    if (settings.auto_scroll_when_thumbnail_clicked === undefined)
        settings.auto_scroll_when_thumbnail_clicked = true;
    
    if (settings.resizeHotkey === undefined)
        settings.resizeHotkey = {113: 113};
    
    if (settings.includeSigWhenExpanding === undefined)
        settings.includeSigWhenExpanding = false;
    
    if (settings.blackoutSpoilerSig === undefined)
        settings.blackoutSpoilerSig = false;
    
    localStorage.setItem("imagefaqs", JSON.stringify(settings));  
}




function keyCodeToString(keyCode)
{
    keyCode = parseInt(keyCode);
    
    if (keyCode === 16)
    {
        return "shift";
    }
    else if (keyCode === 17)
    {
        return "ctrl";
    }
    else if (keyCode === 18)
    {
        return "alt";
    }
    else if (keyCode >= 112 && keyCode <= 123)       /*F keys*/
    {
        return "F" + (keyCode - 111);
    }
    else
    {
        return String.fromCharCode(keyCode);
    }
}


function keyCodeKVArrayToString(array)
{
    var string = "";
    
    for (var key in array)
    {
        string += keyCodeToString(key) + " ";
    }
    
    return string;
}


function cloneKVArray(KVArray)
{
    var newKVArray = {};
    
    for (var key in KVArray)
    {
        newKVArray[key] = KVArray[key];
    }
    
    return newKVArray;
}



sessionSpoilersHotkey = cloneKVArray(settings.spoilersHotkey);
sessionResizeHotkey = cloneKVArray(settings.resizeHotkey);



/*event where user opens up settings menu*/
$("body").on("click", "#imagefaqs_settings_but", function(event) {

    var popupBox = $("#imagefaqs_settings_popup");
    event.preventDefault();
    
    if (popupBox.length === 0)
    {
        $("body").append(
            "<div id='imagefaqs_settings_popup' title='ImageFAQs Settings. Version "+GM_info.script.version+"'>" +
            
                "Update history: <a target='_blank' href='http://fightinggames.bitbucket.org/imagefaqs/' style='outline: 0'>http://fightinggames.bitbucket.org/imagefaqs/</a>" +
                "<br/>" +
                "Feedback and bug reporting: <a target='_blank' href='http://www.gamefaqs.com/boards/565885-blood-money'>http://www.gamefaqs.com/boards/565885-blood-money</a>" +
                "<br/><br/>" +
                
                "<label><input id='enable_floatingImg' type='checkbox'>Enable floating expanded image upon cursor hover</label>" +
                "<br/><br/>" +
                
                "<label><input id='includeSigWhenExpanding_checkbox' type='checkbox'>Also expand signature images when expanding all images</label>" +
                "<br/>" +
                "<label><input id='blackoutSpoilerSig_checkbox' type='checkbox'>Blackout signature images when in spoilers mode</label>" +
                "<br/><br/>" +
                
                "<label><input id='show_ImgURLspan_checkbox' type='checkbox'>Show image URL</label>" +
                "<br/>" +
                "<label><input id='show_ImgResolutionSpan_checkbox' type='checkbox'>Show image resolution</label>" +
                "<br/>" +
                "<label><input id='show_imgFilesizeSpan_checkbox' type='checkbox'>Show image filesize (Currently slow for Chrome)</label>" +
                "<br/>" +
                "<label><input id='show_imgGoogle_checkbox' type='checkbox'>Show google reverse image search button</label>" +
                "<br/>" +
                "<label><input id='show_imgIqdb_checkbox' type='checkbox'>Show iqdb reverse image search button</label>" +
                "<br/>" +
                "<label><input id='show_blacklistToggle_checkbox' type='checkbox'>Show blacklist toggle button</label>" +
                "<br/>" +
                "<label><input id='show_imgAllResizeToggles_checkbox' type='checkbox'>Show all-resize toggle buttons</label>" +
                "<br/><br/>" +
                
                "<label><input id='embedImagesSideBySide_checkbox' type='checkbox'>Embed images side-by-side</label>" +
                "<br/>" +
                "<label><input id='auto_scroll_when_thumbnail_clicked_checkbox' type='checkbox'>Auto-scroll to top of image when its thumbnail is clicked</label>" +
                "<br/><br/>" +
                
                "<label><input id='thumbnailImgWidth_text' type='text'>Thumbnail max-width (150 default)</label>" +
                "<br/>" +
                "<label><input id='thumbnailImgHeight_text' type='text'>Thumbnail max-height (150 default)</label>" +
                "<br/>" +
                "<label><input id='expandedWidth_text' type='text'>Expanded max-width (0 default)</label>" +
                "<br/>" +
                "<label><input id='expandedHeight_text' type='text'>Expanded max-height (0 default)</label>" +
                "<br/ style='margin-bottom: 5px'>" +
                "<span>Tip: Use 0 to specify no length restriction.</span>" +
                "<br/><br/>" +
                
                "<label><input id='imgContainerBackgroundColor_text' type='text'>Image container background color (#DFE6F7 default)</label>" +
                "<br/ style='margin-bottom: 5px'>" +
                "<span>Tip: Use 0 for no background color</span>" +
                "<br/><br/>" +
                
                "<label>Newline separated list of blacklisted image URLs</label>" +
                "<br/>" +
                "<textarea id='blacklist_text'></textarea>" +
                "<br/ style='margin-bottom: 5px'>" +
                "<span>Tip: You can blacklist an entire domain (e.g. pbsrc.com)</span>" +
                "<br/><br/>" +
                
                "<label><input id='resizeHotkey_text' class='hotkeyInput' type='text'>Toggle image size hotkey (F2 default)</label>" +
                "<br/>" +
                "<label><input id='spoilersHotkey_text' class='hotkeyInput' type='text'>Toggle spoilers hotkey (F4 default)</label>" +
                "<br/ style='margin-bottom: 5px'>" +
                "<span>Tip: At any time, you can toggle spoilers mode. This can be done before or after<br/> entering a topic</span>" +
                "<br/><br/>" +
                
                "<button id='saveImagefaqsSettingsBut' type='button'>Save</button> " +
                "<button id='cancelImagefaqsSettingsBut' type='button'>Cancel</button> " +
                "<span id='responseSpan'>&nbsp;&nbsp;</span>" +     /*for reporting success or failure*/
            "</div>"
        );
        
        popupBox = $("#imagefaqs_settings_popup");
    }

    popupBox.find("#enable_sigs_checkbox").prop("checked", settings.enable_sigs);
    popupBox.find("#enable_floatingImg").prop("checked", settings.enable_floatingImg);
    
    popupBox.find("#includeSigWhenExpanding_checkbox").prop("checked", settings.includeSigWhenExpanding);
    popupBox.find("#blackoutSpoilerSig_checkbox").prop("checked", settings.blackoutSpoilerSig);
    
    popupBox.find("#show_ImgURLspan_checkbox").prop("checked", settings.show_imgURLspan);
    popupBox.find("#show_ImgResolutionSpan_checkbox").prop("checked", settings.show_imgResolutionSpan);
    popupBox.find("#show_imgFilesizeSpan_checkbox").prop("checked", settings.show_imgFilesizeSpan);
    popupBox.find("#show_imgGoogle_checkbox").prop("checked", settings.show_imgGoogle);
    popupBox.find("#show_blacklistToggle_checkbox").prop("checked", settings.show_blacklistToggle);
    popupBox.find("#show_imgIqdb_checkbox").prop("checked", settings.show_imgIqdb);
    popupBox.find("#show_imgAllResizeToggles_checkbox").prop("checked", settings.show_imgAllResizeToggles);
    
    popupBox.find("#embedImagesSideBySide_checkbox").prop("checked", settings.embed_images_side_by_side);
    popupBox.find("#auto_scroll_when_thumbnail_clicked_checkbox").prop("checked", settings.auto_scroll_when_thumbnail_clicked);
    
    popupBox.find("#thumbnailImgWidth_text").val(settings.thumbnailWidth);
    popupBox.find("#thumbnailImgHeight_text").val(settings.thumbnailHeight);
    popupBox.find("#expandedWidth_text").val(settings.expandedWidth);
    popupBox.find("#expandedHeight_text").val(settings.expandedHeight);
    
    popupBox.find("#imgContainerBackgroundColor_text").val(settings.imgContainerBackgroundColor);
    popupBox.find("#resizeHotkey_text").val( keyCodeKVArrayToString(settings.resizeHotkey) );
    popupBox.find("#spoilersHotkey_text").val( keyCodeKVArrayToString(settings.spoilersHotkey) );
    popupBox.find("#blacklist_text").val( settings.blacklistStr );
    $("#imagefaqs_settings_popup").children("#responseSpan").html("&nbsp;");
    
    popupBox.dialog({
        width:'auto'
    });
    
    popupBox.find("#blacklist_text").width(popupBox.width());
});





$("body").on("click", "#saveImagefaqsSettingsBut", function(event) {

    event.preventDefault();
    
    var settingsPopup = $("#imagefaqs_settings_popup");
   
    /*if valid thumbnail dimensions*/
    if (
        !isNaN($("#thumbnailImgWidth_text").val()) && $("#thumbnailImgWidth_text").val() >= 0 &&
        !isNaN($("#thumbnailImgHeight_text").val()) && $("#thumbnailImgHeight_text").val() >= 0)
    {
        settings.thumbnailWidth = $("#thumbnailImgWidth_text").val();
        settings.thumbnailHeight = $("#thumbnailImgHeight_text").val();
    }
    else 
    {
        reportResponseMsgInImagefaqsSettingsPopupBox("Error: Invalid thumbnail dimensions. Use non-negative integers only.", settingsPopup);
        return;
    }
    
    /*if valid expanded dimensions*/
    if (
        !isNaN($("#expandedWidth_text").val()) && $("#expandedWidth_text").val() >= 0 &&
        !isNaN($("#expandedHeight_text").val()) && $("#expandedHeight_text").val() >= 0)
    {
        settings.expandedWidth = $("#expandedWidth_text").val();
        settings.expandedHeight = $("#expandedHeight_text").val();
    }
    else 
    {
        reportResponseMsgInImagefaqsSettingsPopupBox("Error: Invalid expanded dimensions. Use non-negative integers only.", settingsPopup);
        return;
    }
    
    /*if valid image container background color*/
    if (settingsPopup.find("#imgContainerBackgroundColor_text").val().search(/^(#[a-zA-Z0-9]{6})|0$/i) >= 0)
    {
        settings.imgContainerBackgroundColor = settingsPopup.find("#imgContainerBackgroundColor_text").val();
    }
    else 
    {
        reportResponseMsgInImagefaqsSettingsPopupBox("Error: Invalid image container background color.", settingsPopup);
        return;
    }
    
    settings.enable_sigs = settingsPopup.find("#enable_sigs_checkbox").prop("checked");
    settings.enable_floatingImg = settingsPopup.find("#enable_floatingImg").prop("checked");
    
    settings.includeSigWhenExpanding = settingsPopup.find("#includeSigWhenExpanding_checkbox").prop("checked");
    settings.blackoutSpoilerSig = settingsPopup.find("#blackoutSpoilerSig_checkbox").prop("checked");
    
    settings.show_imgURLspan = settingsPopup.find("#show_ImgURLspan_checkbox").prop("checked");
    settings.show_imgResolutionSpan = settingsPopup.find("#show_ImgResolutionSpan_checkbox").prop("checked");
    settings.show_imgFilesizeSpan = settingsPopup.find("#show_imgFilesizeSpan_checkbox").prop("checked");
    settings.show_imgGoogle = settingsPopup.find("#show_imgGoogle_checkbox").prop("checked");
    settings.show_imgIqdb = settingsPopup.find("#show_imgIqdb_checkbox").prop("checked");
    settings.show_blacklistToggle = settingsPopup.find("#show_blacklistToggle_checkbox").prop("checked");
    settings.show_imgAllResizeToggles = settingsPopup.find("#show_imgAllResizeToggles_checkbox").prop("checked");
    
    settings.embed_images_side_by_side = settingsPopup.find("#embedImagesSideBySide_checkbox").prop("checked");
    settings.auto_scroll_when_thumbnail_clicked = settingsPopup.find("#auto_scroll_when_thumbnail_clicked_checkbox").prop("checked");
    
    settings.resizeHotkey = cloneKVArray(sessionResizeHotkey);
    settings.spoilersHotkey = cloneKVArray(sessionSpoilersHotkey);
    settings.blacklistStr = settingsPopup.find("#blacklist_text").val();
    
    localStorage.setItem("imagefaqs", JSON.stringify(settings));
    
    reportResponseMsgInImagefaqsSettingsPopupBox("Settings saved.", settingsPopup);
});



/*
@param msg :: message string to show to the user
@param box :: $("#imagefaqs_settings_popup")
*/
function reportResponseMsgInImagefaqsSettingsPopupBox(msg, box)
{
    var msgBox = box.children("#responseSpan");
    
    msgBox.html(msg);
    msgBox.effect("highlight");
}



$("body").on("click", "#cancelImagefaqsSettingsBut", function(event) {

    event.preventDefault();
    $("#imagefaqs_settings_popup").dialog("close");
});






/*begin main scripting*/
(function(){

var isSpoilersMode = settings.isSpoilersMode;
var enable_floatingImg = settings.enable_floatingImg;

var includeSigWhenExpanding = settings.includeSigWhenExpanding;
var blackoutSpoilerSig = settings.blackoutSpoilerSig;

var show_imgURLspan = settings.show_imgURLspan;
var show_imgResolutionSpan = settings.show_imgResolutionSpan;
var show_imgFilesizeSpan = settings.show_imgFilesizeSpan;
var show_imgGoogle = settings.show_imgGoogle;
var show_imgIqdb = settings.show_imgIqdb;
var show_blacklistToggle = settings.show_blacklistToggle;
var show_imgResizeToggles = settings.show_imgAllResizeToggles;

var embedImagesSideBySide = settings.embed_images_side_by_side;
var autoScrollWhenThumbnailClicked = settings.auto_scroll_when_thumbnail_clicked;

var thumbnailImgWidth = settings.thumbnailWidth;
var thumbnailImgHeight = settings.thumbnailHeight;
var expandedImgWidth = settings.expandedWidth;
var expandedImgHeight = settings.expandedHeight;

var blacklist = settings.blacklistStr.split("\n");    /*array of URLs to block*/
var currentURL;
var pageType;       /* "topic" or "postPreview" or "other" */
var allowImgInSig = settings.enable_sigs;
var floatingImgWidth;
var floatingImgRightOffset = 50;
var floatingImgBorder = 10;
var currentHoveredThumbnail = null;
var imgAnchorTags = [];

var expandedImgHeight_cssVal;
if (expandedImgHeight == 0) 
    expandedImgHeight_cssVal = "";
else 
    expandedImgHeight_cssVal = expandedImgHeight + "px";

var thumbnailImgHeight_cssVal;
if (thumbnailImgHeight == 0)
    thumbnailImgHeight_cssVal = "";
else 
    thumbnailImgHeight_cssVal = thumbnailImgHeight + "px";




var heldDownKeys = {};
$("body").on("keydown", "#imagefaqs_settings_popup #spoilersHotkey_text", function(event){
   
    heldDownKeys[event.which] = event.which;
    sessionSpoilersHotkey = cloneKVArray(heldDownKeys);
    
    $(this).val(
        keyCodeKVArrayToString(sessionSpoilersHotkey)
    );
    
    return false;
});

$("body").on("keydown", "#imagefaqs_settings_popup #resizeHotkey_text", function(event){
   
    heldDownKeys[event.which] = event.which;
    sessionResizeHotkey = cloneKVArray(heldDownKeys);
    
    $(this).val(
        keyCodeKVArrayToString(sessionResizeHotkey)
    );
    
    return false;
});


$("body").on("keyup", "#imagefaqs_settings_popup .hotkeyInput", function(event){
    delete heldDownKeys[event.which];
    return false;
});

$("body").on("keypress", "#imagefaqs_settings_popup .hotkeyInput", function(event){
    event.preventDefault();
});




function toggleSpoilersOnImage(embeddedImg, isEnable)
{
    if (isEnable)
    {
        embeddedImg.addClass("thumbnailImg_spoilersExt");
        embeddedImg.parent().addClass("embeddedImgAnchor_spoilersExt");
    }
    else 
    {
        embeddedImg.removeClass("thumbnailImg_spoilersExt");
        embeddedImg.parent().removeClass("embeddedImgAnchor_spoilersExt");
    }
}




var nextImageSize = "expanded";
$("body").keydown(function(event){

    var key;
    var numMatchingPressedHotkeys;
    var desiredAction = "";
    heldDownKeys[event.which] = event.which;


    /*are every spoilers hotkey pressed?*/
    numMatchingPressedHotkeys = 0;
    for (key in settings.spoilersHotkey)
    {
        if (settings.spoilersHotkey[key] !== heldDownKeys[key])
        {
            break;
        }
        
        numMatchingPressedHotkeys++;
    }
    if (numMatchingPressedHotkeys === Object.size(settings.spoilersHotkey))
    {
        desiredAction = "toggleSpoilersMode";
    }
    
    
    

    /*is every resize hotkey pressed?*/
    if (desiredAction === "")
    {
        numMatchingPressedHotkeys = 0;
        for (key in settings.resizeHotkey)
        {
            if (settings.resizeHotkey[key] !== heldDownKeys[key])
            {
                break;
            }
            numMatchingPressedHotkeys++;
        }
        if (numMatchingPressedHotkeys === Object.size(settings.resizeHotkey))
        {
            
            desiredAction = "toggleImageResize";
        }
    }
    
    
    
    if (desiredAction === "toggleSpoilersMode")
    {
        event.preventDefault();
        
        isSpoilersMode = !isSpoilersMode;

        if (isSpoilersMode)
        {
            if (pageType !== "other")
            {
                /*for every embedded image*/
                $(".embeddedImg.isSpoilers").each(function(index, element) {
            
                    /*if image is in thumbnail mode, add spoilers class*/
                    if ($(this).hasClass("thumbnailImg") && !$(this).closest(".embeddedImgContainer").hasClass("spoilersTagged"))
                        toggleSpoilersOnImage($(this), true);
                });
            }
        
            showNotification("ImageFAQs: Spoilers mode is now on.");
        }
        else 
        {
            if (pageType !== "other")
            {
                /*for every blacken thumbnail*/
                $("img.thumbnailImg_spoilersExt, video.thumbnailImg_spoilersExt").each(function(index, element) {
                    if (!$(this).closest(".embeddedImgContainer").hasClass("spoilersTagged"))
                        toggleSpoilersOnImage($(this), false);
                });
            }
            
            showNotification("ImageFAQs: Spoilers mode is now off.");
        }
        
        settings.isSpoilersMode = isSpoilersMode;
        localStorage.setItem("imagefaqs", JSON.stringify(settings));
    }
    else if (desiredAction === "toggleImageResize")
    {
        if (nextImageSize === "expanded")
        {
            toggleSizesOfImages($(".embeddedImg"), true);
            nextImageSize = "thumbnail";
            showNotification("ImageFAQs: Expanded all images.");
        }
        else 
        {
            toggleSizesOfImages($(".embeddedImg.expandedImg"), false);
            nextImageSize = "expanded";
            showNotification("ImageFAQs: Shrunk all images.");
        }
    }
});




$("body").keyup(function(event){
    delete heldDownKeys[event.which];
});







/*
Display a notification on the bottom-right of the browser. Notification will 
disappear in a few seconds.

@param msg :: string message to display
*/
function showNotification(msg)
{
    var notificationBox = $("#imagefaqs_notificationBox");
    notificationBox.remove();
    
    $("body").append(
        "<div id='imagefaqs_notificationBox'>" +
            "<span style='color: black'>" +
                msg +
            "</span>" +
        "</div>"
    );
    
    notificationBox = $("#imagefaqs_notificationBox");

    notificationBox.css({
        "background-color": "white",
        "position": "absolute",
        "top": ($(window).scrollTop() + $(window).height() - notificationBox.height())+"px",
        "left": ($(window).scrollLeft() + $(window).width() - notificationBox.find("span").width())+"px"
    });

    notificationBox.effect("highlight").delay(1000).fadeOut(500);
}







if (blacklist.length === 1 && blacklist[0] === "")
{
    blacklist = [];
}
else 
{
    /*trim white space*/
    for (var i = 0; i < blacklist.length; i++)
    {
        blacklist[i].trim();
    }
}







function isURLmatchBlacklistedURL(url, blacklistedURL)
{
    blacklistedURL = blacklistedURL.trim();
    
    /*escape everything*/
    var blacklistedURLregex = 
        new RegExp( blacklistedURL.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") );

    if (blacklistedURLregex.exec(url) !== null)
    {
        return true;
    }
    else
    {
        return false;
    }
}


/*
Is the url string in the blacklist?

@url :: string of the url to check 
@blacklist :: array of blacklisted urls

Returns true or false
*/
function isURLinBlacklist(url, blacklist)
{
    for (var i = 0; i < blacklist.length; i++)
    {
        if (isURLmatchBlacklistedURL(url, blacklist[i]))
        {
            return true;
        }
    }
    
    return false;
}








currentURL = window.location.href;
pageType = currentURL.search(/.*gamefaqs\.com\/boards\/.*\/.*/i);               /*gfaqsdep*/
if (currentURL.search(/.*gamefaqs\.com\/boards\/.*\/.*/i) >= 0)                 /*gfaqsdep*/
{
    pageType = "topic";
}
else if (currentURL.search(/.*gamefaqs\.com\/boards\/post/i) >= 0)              /*gfaqsdep*/
{
    pageType = "postPreview";
}
else if (currentURL.search(/.*gamefaqs\.com\/user/i) >= 0)                      /*gfaqsdep*/
{
    /*add settings link*/
    $(".systems").append("<li><a id='imagefaqs_settings_but' href='#'>ImageFAQs Options</a> - Change thumbnail size, enable signature embedding, and more.</li>");
}
else 
{
    pageType = "other";
}




if (pageType === "other")
{
    return;
}



GM_addStyle (GM_getResourceText("jqueryuibaseCSS"));
GM_addStyle (GM_getResourceText("jqueryuithemeCSS"));





GM_addStyle (
    ".embeddedImgContainer {" +
        "background: "+settings.imgContainerBackgroundColor+";" +
    "}" +
    ".embeddedImgAnchor {"+
        "display: inline-block;"+
    "}" +
    ".embeddedImgAnchor_spoilersExt {"+
        "background: black;"+
    "}" +
    ".thumbnailImg {"+
        "display: inline-block;"+ /*prevents parent anchor from stretching horizontally*/
        "vertical-align: bottom;"+ /*eliminates small gap between bottom of image and parent div*/
    "}" +
    ".thumbnailImg_spoilersExt {" +
        "opacity: 0.0;" +
    "}" +
    ".expandedImg {" +
        "display: inline-block;" +
        "vertical-align: bottom;" +
    "}" +
    ".imgMenuButton {" +
        "overflow: hidden;" +
        "position: absolute;" +
        "text-align: center;" +
        "z-index: 90;" +
        "background-color: #99FFCC;" +
        "opacity: 0.5;" +
        "pointer-events: none;" +
    "}" +
    ".imgMenuButton_symbol {" +
        "display: table-cell;" +
        "vertical-align: middle;" +
    "}" +
    ".imgMenuItem {" +
        "display: block;" +
    "}" +
    ".imgMenuItemAnchor {" +
        "display: block;" +
    "}" +
    ".imgMenu {" +
        "background-color: #CCFFFF;" +
        "opacity: 0.9;" +
        "border-style: solid;" +
        "border-width: 1px;" +
    "}" +
    ".ui-widget { " +       /*shrink font size in the settings menu*/
        "font-size:96%;" +
    "}" +
    "#imagefaqs_settings_popup input { " +
        "margin-right: 5px;" +
    "}" +
    "#imagefaqs_settings_popup a { " +
        "color: blue;" +
    "}"
);





$("body").css("position", "relative");
var posts = null;

posts = $("div.msg_body");                  /*gfaqsdep*/




/*for each user post*/
posts.each(function(index, element) {

    var postHtml;
    var unanchoredImgURLMatches;
    var sigStrIdx;
    var anchorTags;
    var idxAfterAnchorTagInPostHtml = 0;
    
    postHtml = $(this).html();
    
    /*if in post preview mode, need to manually parse through the preview message body and 
    replace every plain-text image URL in its anchor form*/
    if (pageType === "postPreview")
    {
        postHtml = postHtml.replace(/https?:\/\/[^<>\s]*?\.(?:png|jpg|gif|jpeg|webm|gifv)[^<>\s]*/ig, "<a href='$&'>$&</a>");
        
        $(this).html(postHtml);
    }
    
    /*get index of sig separator*/
    sigStrIdx = postHtml.indexOf("<br>---<br>");            /*gfaqsdep*/
    
    /*get all anchor tags*/
    anchorTags = $(this).find("a");

    /*filter in anchor tags that refer to images*/
    anchorTags.each(function(index, element) {
        
        var anchorURL = $(this).attr("href");
        var anchorTagStrIdx = postHtml.indexOf(anchorURL + "</a>", idxAfterAnchorTagInPostHtml);
        idxAfterAnchorTagInPostHtml = anchorTagStrIdx + anchorURL.length + 4;
        
        if (anchorURL.search(/https?:\/\/[^<>\s]*?\.(?:png|jpg|gif|jpeg|webm|gifv)/i) >= 0)
        {
            /*if sig exists and anchor is part of sig*/
            if (sigStrIdx !== -1 && anchorTagStrIdx > sigStrIdx)
            {
                if (allowImgInSig)
                    $(this).addClass("withinSig");
                else
                    return;
            }
            
            $(this).addClass("imgAnchor");
            imgAnchorTags.push($(this));
        }
    });
});





var imgAnchorIdx = 0;

/*for each valid image URL anchor tag, replace with template div for embedded image*/
for (var imgAnchor of imgAnchorTags)
{
    var imgURL = imgAnchor.html();
    var imageType = imgURL.split(".").pop();
    var imgWithinSig_class = imgAnchor.hasClass("withinSig") ? "withinSig" : "";
    var imgIsSpoilers_class = !(imgAnchor.hasClass("withinSig") && !blackoutSpoilerSig) ? "isSpoilers" : "";
    var imgSize;
    var imgInfoEleStr;
    var postID;
    var isBlacklisted;
    
    if (imageType === "gifv")
    {
        isBlacklisted = isURLinBlacklist(imgURL, blacklist);
        imgURL = imgURL.replace(/gifv$/i, "webm");
    }  
    
    isBlacklisted = isURLinBlacklist(imgURL, blacklist);
    
    if (pageType === "topic")
    {
        postID = imgAnchor.closest(".msg_body_box").siblings(".msg_infobox").children("a").attr("name");           /*gfaqsdep*/
    }
    else    /*if in post preview mode, need to provide missing message ID*/ 
    {
        imgAnchor.closest("td").addClass("msg_body");                   /*gfaqsdep*/
        imgAnchor.closest(".msg_body").attr("name", 0);                 /*gfaqsdep*/
        postID = 0;
    }
    
    var imgURLspan = "";
    var imgResolutionSpan = "";
    var imgFilesizeSpan = "";
    var imgGoogleReverse = "";
    var imgIQDBreverse = "";
    var imgBlacklistToggle = "";
    var imgCloseAll = "";
    var imgClosePost = "";
    var imgExpandPost = "";
    var imgExpandAll = "";
    
    if (show_imgURLspan && !embedImagesSideBySide)
    {
        imgURLspan = 
            "<span style='margin-right: 5px'>" +
                "<a target='_blank' href="+imgURL+">"+imgURL+"</a>" +
            "</span>";
    }
        
    if (show_imgResolutionSpan && !embedImagesSideBySide)
    {
        imgResolutionSpan = 
            "<span class='imgResolution' style='margin-right: 5px'>" +
            "</span>";
    }
    
    if (show_imgFilesizeSpan && !embedImagesSideBySide)
    {
        imgFilesizeSpan = 
            "<span class='imgFilesize' style='margin-right: 5px'>" +
            "</span>";
    }
    
    if (show_imgGoogle && !embedImagesSideBySide)
    {
        imgGoogleReverse = 
            "<a target='_blank' title='Reverse image search on general images' style='margin-right: 5px' href='https://www.google.com/searchbyimage?image_url="+imgURL+"'>" +
                "google" +
            "</a>";
    }

    if (show_imgIqdb && !embedImagesSideBySide)
    {
        imgIQDBreverse = 
            "<a target='_blank' title='Reverse image search on weeb images' style='margin-right: 5px' href='http://iqdb.org/?url="+imgURL+"'>" +
                "iqdb" +
            "</a>";
    }
        
    if (show_blacklistToggle && !embedImagesSideBySide)
    {
        if (isBlacklisted)
        {
            imgBlacklistToggle =
                "<a class='imgBlacklistToggle' href='#' title='Whitelist image' style='margin-right: 5px'>whitelist</a>"; 
        }
        else 
        {
            imgBlacklistToggle =
                "<a class='imgBlacklistToggle' href='#' title='Blacklist image' style='margin-right: 5px'>blacklist</a>"; 
        }
    }
    
    if (show_imgResizeToggles && !embedImagesSideBySide)
    {
        imgCloseAll =
            "<a class='imgCloseAll' href='#' title='Close all images in page' style='margin-right: 5px'>&lt;&lt;</a>";
        
        imgClosePost =
            "<a class='imgClosePost' href='#' data-postID='"+postID+"' title='Close all images in post' style='margin-right: 5px'>&lt;</a>";
        
        imgExpandPost = 
            "<a class='imgExpandPost' href='#' data-postID='"+postID+"' title='Expand all images in post' style='margin-right: 5px'>&gt;</a>";
        
        imgExpandAll =
            "<a class='imgExpandAll' href='#' title='Expand all images in page' style='margin-right: 5px'>&gt;&gt;</a>";
    }
     
    var optionalBreakAfterImgHeader;
    if ((!show_imgURLspan && !show_imgResolutionSpan && !show_imgFilesizeSpan && !show_imgGoogle && !show_imgIqdb &&
        !show_blacklistToggle && !show_imgResizeToggles) 
            || 
        embedImagesSideBySide)
    {
        optionalBreakAfterImgHeader = "";
    }
    else 
    {
        optionalBreakAfterImgHeader = "<br/>";
    }
    
    imgAnchor.replaceWith(
        "<div class='embeddedImgContainer "+imgWithinSig_class+" "+imgIsSpoilers_class+"' data-postID='"+postID+"'>" +
            imgURLspan +
            imgResolutionSpan +
            imgFilesizeSpan +
            imgGoogleReverse +
            imgIQDBreverse +
            imgBlacklistToggle +
            imgCloseAll + 
            imgClosePost + 
            imgExpandPost +
            imgExpandAll +
            optionalBreakAfterImgHeader +
            "<a class='embeddedImgAnchor' href='" + imgURL + "' data-backup-href='" + imgURL + "' data-idx='"+imgAnchorIdx+"'>" +
            "</a>" +
        "</div>"
    );
    
    var embeddedImgAnchor = $(".embeddedImgAnchor[data-idx='"+imgAnchorIdx+"']");
    var embeddedImgContainer = embeddedImgAnchor.parent();
    
    imgAnchorIdx++;
    
    if (embeddedImgContainer.closest("s").length > 0)
    {
        embeddedImgContainer.addClass("spoilersTagged");
    }
    
    if (isBlacklisted)
    {
        embeddedImgAnchor.hide();
        embeddedImgAnchor.addClass("blacklisted");
        
        if (embedImagesSideBySide)
        {
            embeddedImgContainer.css("max-width", thumbnailImgWidth + "px");
            
            embeddedImgContainer.append(
                "<a target='_blank' class='imgMenuItem' href="+imgURL+">"+imgURL+"</a>" +
                "<div class='imgMenuItem'><a class='imgBlacklistToggle' href='#' title='Whitelist image'>whitelist</a></div>"
            );
        }
    }

    /*keep iterating through the next sibling elements until find an element that's 
    not whitespace*/
    var curNextEleJS = embeddedImgContainer[0].nextSibling;
    while (curNextEleJS !== null &&
           ($(curNextEleJS).is("br") || is_ignorable(curNextEleJS)))
    {
        curNextEleJS = curNextEleJS.nextSibling;
    }
    
    /*now do the same thing, but iterating through the previous siblings*/
    var curPrevEleJS = embeddedImgContainer[0].previousSibling;
    while (curPrevEleJS !== null &&
           is_ignorable(curPrevEleJS))
    {
        curPrevEleJS = curPrevEleJS.previousSibling;
    }
    
    /*remove the next br elements if next non-whitespace sibling is a going-to-be image*/
    
    var curNextEle;
    if (curNextEleJS !== null && $(curNextEleJS).hasClass("imgAnchor"))
    {
        curNextEle = embeddedImgContainer.next();
        while (curNextEle.length !== 0 && curNextEle.is("br"))
        {
            if (curNextEle.next().length === 0)
            {
                curNextEle.remove();
                break;
            }
            else 
            {
                curNextEle = curNextEle.next();
                curNextEle.prev().remove();
            }
        }
    }
    /*if sig separator after image, remove <br> in between*/
    else if (curNextEleJS !== null && curNextEleJS.nodeType === 3 && curNextEleJS.nodeValue === "---")
    {
        curNextEle = embeddedImgContainer.next();
        if (curNextEle.is("br"))
            curNextEle.remove();
    }
    /*if text after image*/
    else if (curNextEleJS !== null && curNextEleJS.nodeType === 3 && curNextEleJS.nodeValue !== "---")
    {
        curNextEle = embeddedImgContainer.next();
        if (curNextEle.is("br"))
            curNextEle.remove();
    }
    
    if (embedImagesSideBySide)
    {
        /*if the next non-whitespace sibling not going to be an image, create a newline to
        set the cursor below this image*/
        if (curNextEleJS !== null && !$(curNextEleJS).hasClass("imgAnchor"))
        {
            $(curNextEleJS).before(
                "<div style='display: block;'></div>"
            );
        }
        
        /*do same with previous non-whitespace sibling*/
        if (curPrevEleJS !== null && !$(curPrevEleJS).hasClass("embeddedImgContainer"))
        {
            $(curPrevEleJS).after(
                "<div style='display: block;'></div>"
            );
        }
       
        /*set container to float*/
        embeddedImgContainer.css("display", "inline-block");
        embeddedImgContainer.css("vertical-align", "top");
        embeddedImgContainer.css("margin-right", "5px");
        embeddedImgContainer.css("margin-bottom", "5px");
    }
    else 
    {
        embeddedImgContainer.css("margin-bottom", "10px");
    }
}



function getFileSize(url, span)
{
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            
            var contentLengthStr = response.responseHeaders.match(/Content-Length: \d+/)[0];
            var fileSizeBytes = parseInt(contentLengthStr.substring(16));
            
            var fileSizeDisplayStr;
            
            if (fileSizeBytes < 1000000)    /*if less than 1.0MB*/
            {
                fileSizeDisplayStr = Math.round(fileSizeBytes / 1000) + "KB";
            }
            else
            {
                fileSizeDisplayStr = (fileSizeBytes / 1000000).toFixed(2) + "MB";
            }

            span.html("("+fileSizeDisplayStr+")");
        }
    });
}



/*for each template div, insert an embedded image*/
$(".embeddedImgContainer").each(function(index, element) {
    
    var curEmbeddedImgContainer = $(this);
    var curEmbeddedImgAnchor = $(this).children(".embeddedImgAnchor");
    var imgResolution = curEmbeddedImgContainer.children(".imgResolution");
    var imgFilesize = curEmbeddedImgContainer.children(".imgFilesize");
    var imgURL = curEmbeddedImgAnchor.attr("href");
    var imgType;    /*e.g. "jpg"*/
    var image = new Image();
    var embeddedImgSpoilersClass;
    
    if ((isSpoilersMode && curEmbeddedImgContainer.hasClass("isSpoilers"))
            || 
        (curEmbeddedImgContainer.hasClass("spoilersTagged"))
        )
    {
        embeddedImgSpoilersClass = "thumbnailImg_spoilersExt";
        curEmbeddedImgAnchor.addClass("embeddedImgAnchor_spoilersExt");
    }
    else 
    {
        embeddedImgSpoilersClass = "";
    }
    
    var postID = curEmbeddedImgContainer.attr("data-postID");         
    
    imageType = imgURL.split(".").pop();
    
    if (imgFilesize.length > 0)
        getFileSize(imgURL, imgFilesize);
    
    /*if not a webm video (i.e. image)*/
    if (imageType.search(/(webm)/i) == -1)
    {
        /*on event that image cannot be loaded, post the error*/
        image.onerror = function() {
            curEmbeddedImgAnchor.html("Image cannot be loaded.");
        };
        
        /*on event that image loaded successfully in memory*/
        $(image).load(function() {
            /*write down image's natural dimensions*/
            
            if (imgResolution.length > 0)
            {
                imgResolution.html(
                    "(" + image.naturalWidth + "x" + image.naturalHeight + ")"
                );
            }
        });
          
        image.src = imgURL;
        
        $(image).addClass("embeddedImg thumbnailImg "+embeddedImgSpoilersClass+"");
        $(image).attr("data-postID", postID);
        $(image).attr("alt", "");
        $(image).attr("display", "none");
        
        curEmbeddedImgAnchor.html(image);
        
        $(image).css("max-width",  getOptimalImgMaxWidth($(image), thumbnailImgWidth) + "px");
        $(image).css("max-height", thumbnailImgHeight_cssVal); 
        
        $(image).attr("display", "");
    }
    else    /*if image is actually a webm file*/
    {
        htmlVideoSrcTag =
            "<video id='embeddedImg_"+index+"' data-postID='"+postID+"' " +
            "class='embeddedImg webmExt thumbnailImg "+embeddedImgSpoilersClass+"' " +
            "style=''>" +
                "<source src='" + imgURL + "' type='video/webm'>" +
            "</video>"; 
          
        curEmbeddedImgAnchor.html(htmlVideoSrcTag);
        
        var video = $("#embeddedImg_"+index);

        video.css("max-width",  getOptimalImgMaxWidth(video, thumbnailImgWidth) + "px");
        video.css("max-height", thumbnailImgHeight_cssVal); 
        
        video.attr("display", "");

        /*when video's metadata has been loaded, record its natural width and resolution*/
        $("#embeddedImg_"+index+"")[0].onloadedmetadata = function() {
            
            var video = this;
            
            if (imgResolution.length > 0)
            {
                imgResolution.html(
                    "(" + video.videoWidth + "x" + video.videoHeight + ")"
                );
            }
        };
        
        $("#embeddedImg_"+index+"")[0].addEventListener('error', function(event) {
            curEmbeddedImgAnchor.html("Video cannot be loaded.");
        }, true);
    }
    
    if (curEmbeddedImgContainer.hasClass("withinSig"))
        curEmbeddedImgContainer.find(".embeddedImg").addClass("withinSig");
    
    if (curEmbeddedImgContainer.hasClass("isSpoilers"))
        curEmbeddedImgContainer.find(".embeddedImg").addClass("isSpoilers");
});


/*
Get the natural width of an embedded image.

@image :: jQuery object with the class "embeddedImg"
*/
function getNatWidthOfEmbeddedImg(image)
{
    if (image.hasClass("webmExt"))
    {
        return image[0].videoWidth;
    }
    else 
    {
        return image[0].naturalWidth;
    }
}



/*
Get the natural width of an embedded image.

@image :: jQuery object with the class "embeddedImg"
*/
function getNatHeightOfEmbeddedImg(image)
{
    if (image.hasClass("webmExt"))
    {
        return image[0].videoHeight;
    }
    else 
    {
        return image[0].naturalHeight;
    }
}





$("body").append(
    "<div class='imgMenuButton' style='display: none'>" +
        "<div class='imgMenuButton_symbol'>" +
            "+" +
        "</div>" +
    "</div>"
);
var imgMenuButton = $("body div.imgMenuButton");


/*
Show a transparent button in the top-right corner of a thumbnail image.

@param thumbnail :: embedded thumbnail image
@param isShow :: true if the button should appear
*/
function showImgMenuButton(thumbnail, isShow)
{   
    if (!show_imgURLspan && !show_imgResolutionSpan && !show_imgFilesizeSpan && !show_imgGoogle && !show_imgIqdb &&
        !show_blacklistToggle && !show_imgResizeToggles) 
    {
        return;
    }

    if (isShow)
    {
        if (imgMenu !== null && 
            thumbnail.parent().attr("data-idx") === imgMenu.attr("data-idx"))
        {
            imgMenuButton.children().html("-");
        }
        else 
        {
            imgMenuButton.children().html("+");
        }
        
        imgMenuButton.css("display", "table");
        imgMenuButton.css("left", (thumbnail.offset().left + thumbnail.width() - 18) + "px");
        imgMenuButton.css("top", thumbnail.offset().top + "px");
        imgMenuButton.css("width", imgMenuButton.height())
    }
    else 
    {
        imgMenuButton.css("display", "none");
    }
}

function isHoverOverImgMenuButton(clickEvent)
{
    if (!show_imgURLspan && !show_imgResolutionSpan && !show_imgFilesizeSpan && !show_imgGoogle && !show_imgIqdb &&
        !show_blacklistToggle && !show_imgResizeToggles) 
    {
        return false;
    }
    
   var isCursorInButton =
        imgMenuButton.css("display") === "table" &&
        clickEvent.pageX > imgMenuButton.offset().left &&
        clickEvent.pageX < imgMenuButton.offset().left + imgMenuButton.width() &&
        clickEvent.pageY > imgMenuButton.offset().top &&
        clickEvent.pageY < imgMenuButton.offset().top + imgMenuButton.height();
    
   return isCursorInButton;
}







var imgMenu = null;
function showImgMenu(image)
{
    var imgURL = image.parent().attr("data-backup-href");
    
    var imgURL_menuItem = "";
    
    var imgResolution_span = "";
    var imgFilesize_span = "";
    var imgResolutionAndFilesize_menuItem = "";
    
    var imgGoogleReverse_menuItem = "";
    var imgIQDBreverse_menuItem = "";
    var imgBlacklistToggle_menuItem = "";
    var imgResizeToggles_menuItem = "";
    
    var postID = image.attr("data-postID");
    
   if (show_imgURLspan)
    {
        imgURL_menuItem = 
            "<div class='imgMenuItem'><span>" +
                "<a target='_blank' class='imgMenuItemAnchor_url' href="+imgURL+">"+imgURL+"</a>" +
            "</span></div>";
    }
        
    if (show_imgResolutionSpan)
    {
        imgResolution_span = 
            "<span class='imgResolution' style='margin-right: 5px'>" +
            "</span>";
    }
    
    if (show_imgFilesizeSpan)
    {
        imgFilesize_span = 
            "<span class='imgFilesize'>" +
            "</span>";
    }
    
    imgResolutionAndFilesize_menuItem = imgResolution_span + imgFilesize_span;
    if (imgResolutionAndFilesize_menuItem !== "")
    {
        imgResolutionAndFilesize_menuItem = 
            "<div class='imgMenuItem'>" +
                imgResolutionAndFilesize_menuItem +
            "</div>";
    }
    
    if (show_imgGoogle)
    {
        imgGoogleReverse_menuItem = 
            "<div class='imgMenuItem'><a target='_blank' class='imgMenuItemAnchor_google' title='Reverse image search on general images' href='https://www.google.com/searchbyimage?image_url="+imgURL+"'>" +
                "google" +
            "</a></div>";
    }

    if (show_imgIqdb)
    {
        imgIQDBreverse_menuItem = 
            "<div class='imgMenuItem'><a target='_blank' class='imgMenuItemAnchor_iqdb' title='Reverse image search on weeb images' href='http://iqdb.org/?url="+imgURL+"'>" +
                "iqdb" +
            "</a></div>";
    }
        
    if (show_blacklistToggle)
    {
        if (isBlacklisted)
        {
            imgBlacklistToggle_menuItem =
                "<div class='imgMenuItem'><a class='imgBlacklistToggle' href='#' title='Whitelist image'>whitelist</a></div>"; 
        }
        else 
        {
            imgBlacklistToggle_menuItem =
                "<div class='imgMenuItem'><a class='imgBlacklistToggle' href='#' title='Blacklist image'>blacklist</a></div>"; 
        }
    }
    
    if (show_imgResizeToggles)
    {
        imgResizeToggles_menuItem =
            "<div class='imgMenuItem'>" +
                "<a class='imgCloseAll' href='#' title='Close all images in page'>&lt;&lt;&nbsp;</a>" +
                "<a class='imgClosePost' href='#' data-postID='"+postID+"' title='Close all images in post'>&lt;&nbsp;</a>" +
                "<a class='imgExpandPost' href='#' data-postID='"+postID+"' title='Expand all images in post'>&gt;&nbsp;</a>" +
                "<a class='imgExpandAll' href='#' title='Expand all images in page'>&gt;&gt;</a>" +
            "</div>";
    }
    
    if (imgMenu !== null)
        imgMenu.remove();
        
    $("body").append(
        "<div class='imgMenu' data-idx='"+image.parent().attr("data-idx")+"' style='display: none; position: absolute; z-index: 90;'>" +
            imgURL_menuItem +
            imgResolutionAndFilesize_menuItem +
            imgGoogleReverse_menuItem +
            imgIQDBreverse_menuItem +
            imgBlacklistToggle_menuItem +
            imgResizeToggles_menuItem +
        "</div>"
    );
    
    imgMenu = $("body > .imgMenu");
    var imgFilesizeSpan = imgMenu.find(".imgFilesize");
    var imgResolutionSpan = imgMenu.find(".imgResolution");
    
    getFileSize(imgURL, imgFilesizeSpan);

    /*if plain image (i.e. not a webm video)*/
    if (! image.hasClass("webmExt"))
    {
        image.load(function() {
            if (imgResolutionSpan.length > 0)
            {
                imgResolutionSpan.html(
                    "(" + image[0].naturalWidth + "x" + image[0].naturalHeight + ")"
                );
            }
        });
        
        /*if image already loaded*/
        if (image[0].naturalWidth !== 0)
        {
            if (imgResolutionSpan.length > 0)
            {
                imgResolutionSpan.html(
                    "(" + image[0].naturalWidth + "x" + image[0].naturalHeight + ")"
                );
            }
        }
    }
    else    /*if webm*/
    {
        /*when video's metadata has been loaded, record its natural width and resolution*/
        image[0].onloadedmetadata = function() {
            
            var video = this;
            
            if (imgResolutionSpan.length > 0)
            {
                imgResolutionSpan.html(
                    "(" + video.videoWidth + "x" + video.videoHeight + ")"
                );
            }
        };
        
        if (image[0].videoWidth !== 0)
        {
            imgResolutionSpan.html(
                "(" + image[0].videoWidth + "x" + image[0].videoHeight + ")"
            );
        }
    }
    
    var img_rightOffset = image.offset().left + image.width();
    var imgMenu_rightOffset = img_rightOffset + imgMenu.width();
    
    /*if imgMenu right offset exceeds beyond window's right offset*/
    if (imgMenu_rightOffset > $(window).scrollLeft() + $(window).width())
        imgMenu.css("left", ($(window).scrollLeft() + $(window).width() - imgMenu.width()) + "px");
    else 
        imgMenu.css("left", img_rightOffset + "px");
    
    imgMenu.css("top", image.offset().top + "px");
    imgMenu.css("display", "inline");
    
    imgMenuButton.children().html("-");
}

function hideImgMenu()
{
    if (imgMenu !== null)
    {
        imgMenu.remove();
        imgMenu = null;
    }
}

function getImageAnchorOfImgMenu()
{
    var imgIdx = $("body > .imgMenu").attr("data-idx");
    
    return $(".embeddedImgAnchor[data-idx='"+imgIdx+"']");
}

function isHovered(jQueryObj)
{
    return !!$(jQueryObj).filter(function() { return $(this).is(":hover"); }).length;
}

$(document).on("click", function(event) {
    
    if (embedImagesSideBySide)
    {
        if (imgMenu !== null &&
            !isHovered(imgMenu) ||
            isHovered($(".imgMenuItemAnchor_url")) ||
            isHovered($(".imgMenuItemAnchor_google")) ||
            isHovered($(".imgMenuItemAnchor_iqdb")) ||
            isHovered($(".imgBlacklistToggle")) ||
            isHovered($(".imgCloseAll")) ||
            isHovered($(".imgClosePost")) ||
            isHovered($(".imgExpandPost"))||
            isHovered($(".imgExpandAll")))
        {
            hideImgMenu();
        }
    }
});




var curFloatingImg = null;
/*if cursor is hovering inside a thumbnail image, display expanded image as floating div
Also show a transparent button to expand the image menu (side-by-side image view only)
*/
$(document).on("mousemove", function(event) {
    
    if (!enable_floatingImg)
        return;
    
    var floatingImgLeft;
    var floatingImgTop;
    var floatingImgWidth;
    var floatingImgHeight;
    var floatingImgStyleStr;
    
    /*if user is hovering over thumbnail, prepare floating image size and position*/
    if (currentHoveredThumbnail !== null)
    {
        floatingImgWidth = parseInt(getNatWidthOfEmbeddedImg(currentHoveredThumbnail));

        floatingImgLeft = event.pageX + floatingImgRightOffset;
        
        /*if right of image exceeds beyond right of window, restrict max width*/
        if (floatingImgLeft + floatingImgWidth > $(window).scrollLeft() + $(window).width() - floatingImgBorder)
        {
            floatingImgWidth = $(window).scrollLeft() + $(window).width() - floatingImgBorder - floatingImgLeft;
        }
        
        if (floatingImgWidth < 0)
            floatingImgWidth = 0;
        
        floatingImgHeight = Math.round(getNatHeightOfEmbeddedImg(currentHoveredThumbnail) * (floatingImgWidth / getNatWidthOfEmbeddedImg(currentHoveredThumbnail)));
        
        floatingImgTop = event.pageY - (floatingImgHeight / 2);
        
        /*if bottom of image exceeds beyond the window, shift top upwards*/
        if (floatingImgTop + floatingImgHeight > $(window).scrollTop() + $(window).height() - floatingImgBorder)
        {
            floatingImgTop = $(window).scrollTop() + $(window).height() - floatingImgBorder - floatingImgHeight;
        }
        
        /*if top of image expands beyond top of window, lower top of image*/
        if (floatingImgTop < $(window).scrollTop() + floatingImgBorder)
        {
            floatingImgTop = $(window).scrollTop() + floatingImgBorder;
        }
        
        /*if bottom of image exceeds beyond the window, restrict max height*/
        if (floatingImgTop + floatingImgHeight > $(window).scrollTop() + $(window).height() - floatingImgBorder)
        {
            floatingImgHeight = $(window).scrollTop() + $(window).height() - floatingImgBorder - floatingImgTop;
        }
        
        if (curFloatingImg !== null &&   
            curFloatingImg.attr("data-idx") !== currentHoveredThumbnail.parent().attr("data-idx"))
        {
            curFloatingImg.attr("data-href", "");
            
            if (curFloatingImg.prop("tagName") === "video")
                curFloatingImg.children("source").attr("src", "");
            else 
                curFloatingImg.attr("src", "");
        }
        
        /*if floating image doesn't exist or doesn't have an image yet...*/
        if (curFloatingImg === null || curFloatingImg.attr("data-href") === "")
        {
            floatingImgStyleStr = 
                "position: absolute;" +
                "left: " + floatingImgLeft + "px;" +
                "top: " + floatingImgTop + "px;" +
                "max-width: " + floatingImgWidth + "px;" +
                "max-height: " + floatingImgHeight + "px;" +
                "z-index: 100;";
            
            imgIdx = currentHoveredThumbnail.parent().attr("data-idx");
            
            /*if webm video*/
            if (currentHoveredThumbnail.hasClass("webmExt"))
            {
                srcURL = currentHoveredThumbnail.children("source").attr("src");
                
                floatingImgSrc = 
                    "<video id='floatingImg' data-idx='"+imgIdx+"' data-href='"+srcURL+"' style='" + floatingImgStyleStr + "'>" +
                        "<source src='"+srcURL+"' type='video/webm'>" +
                    "</video>";
            }
            else 
            {
                srcURL = currentHoveredThumbnail.attr("src");
                
                floatingImgSrc = 
                    "<img id='floatingImg' data-idx='"+imgIdx+"' data-href='"+srcURL+"' style='" + floatingImgStyleStr + "' src='"+srcURL+"'>";
            }
            
            /*create the floating image element if haven't so*/
            if (curFloatingImg === null)
            {
                $("body").append(
                    floatingImgSrc
                );
                
                curFloatingImg = $("body").children("#floatingImg");
            }
            else 
            {
                curFloatingImg.attr("data-href", srcURL);
                curFloatingImg.attr("data-idx", imgIdx);
                curFloatingImg.attr("style", floatingImgStyleStr);
                
                if (curFloatingImg.prop("tagName") === "video")
                    curFloatingImg.children("source").attr("src", srcURL);
                else 
                    curFloatingImg.attr("src", srcURL);
            }

            /*if webm video*/
            if (currentHoveredThumbnail.hasClass("webmExt"))
            {
                var video = curFloatingImg;

                video.attr("loop", "");
                video[0].play();
            }
            
            if (embedImagesSideBySide)
                showImgMenuButton(currentHoveredThumbnail, true);
        }
        else    /*if floating image already exists, update its size and position*/
        {
            $("body").children("#floatingImg").css({
                "left": floatingImgLeft + "px",
                "top": floatingImgTop + "px",
                "max-width": floatingImgWidth + "px",
                "max-height": floatingImgHeight + "px",
            });
        }
    }
    /*if user is not hovering over thumbnail and floating image still exists*/
    else if (currentHoveredThumbnail === null && curFloatingImg !== null)
    {
        if (embedImagesSideBySide)
            showImgMenuButton(currentHoveredThumbnail, false);
        
        curFloatingImg.remove();
        curFloatingImg = null;
    }
});




/*if mouse hovers inside the image, change cursor to pointer*/
$(document).on("mouseover", ".embeddedImg", function(event){
    $("html").css("cursor", "pointer");
    
    if (! $(this).hasClass("expandedImg"))
    {
        currentHoveredThumbnail = $(event.target);
    }
});

/*if mouse hovers outside the image, restore cursor to default graphic*/
$(document).on("mouseout", ".embeddedImg", function(){
    $("html").css("cursor", "default");
    
    currentHoveredThumbnail = null;
});



/*if clicked on the image URL anchor that's surrounding the embedded image, prevent default
behaviour of anchor, unless it's a middle click*/
$("body").on("click", ".embeddedImgAnchor", function(event){
    
    /*left-click*/
    if (event.which === 1)
    {
        
    }
    else 
    {
        $(this).attr("href", $(this).attr("data-backup-href"));
    }
});

$("body").on("mousedown", ".embeddedImgAnchor", function(event){
    
    /*left-click*/
    if (event.which === 1)
    {
        event.preventDefault();
    }
    else 
    {
        $(this).attr("href", $(this).attr("data-backup-href"));
    }
});

/* jshint -W107 */
    
/*toggle image size on left-click*/
$("body").on("click", ".embeddedImg", function(event){
    
    /*left-click*/
    if (event.which === 1)
    {
        if (isHoverOverImgMenuButton(event) && imgMenu === null)
        {
            showImgMenu($(this));
            return false;
        }
        else if (isHoverOverImgMenuButton(event) && imgMenu !== null)
        {
            /*if referring to same thumbnail*/
            if (imgMenu.attr("data-idx") === $(this).parent().attr("data-idx"))
            {
                hideImgMenu();
            }
            else 
            {
                showImgMenu($(this));
            }
            
            showImgMenuButton($(this), true);
            return false;
        }
        else if (imgMenu !== null)
        {
            hideImgMenu();
        }

        showImgMenuButton($(this), false);

        var mouseRelativeY = event.pageY - $(this).offset().top;
        
        /*if expanded webm file, don't shrink to thumbnail if clicked on its controls*/
        if ($(this).hasClass("webmExt") && $(this).hasClass("expandedImg") &&
             (mouseRelativeY > ($(this).height() - 28)))
        {
            $(this).parent().attr("href", "javascript:void(0);");
        }
        else
        {
            toggleEmbeddedImgSize($(this), false);
            
            if (autoScrollWhenThumbnailClicked)
                $(window).scrollTop( $(this).parent().parent().offset().top );
            
            return false;
        }
    }
});






/*
@param isAll :: true if your intention is to expand/shrink all images
*/
function toggleEmbeddedImgSize(embeddedImg, isAll)
{
    /*if blacken and going to be expanded...*/
    if (embeddedImg.hasClass("thumbnailImg") && embeddedImg.hasClass("thumbnailImg_spoilersExt"))
    {
        embeddedImg.removeClass("thumbnailImg_spoilersExt");
        embeddedImg.parent().removeClass("embeddedImgAnchor_spoilersExt");
    }
    /*if going to be shrunk...*/
    else if (embeddedImg.hasClass("expandedImg") 
                &&
             (embeddedImg.closest(".embeddedImgContainer").hasClass("spoilersTagged") || isSpoilersMode))
    {
        embeddedImg.addClass("thumbnailImg_spoilersExt");
        embeddedImg.parent().addClass("embeddedImgAnchor_spoilersExt");
    }
    
    if (!includeSigWhenExpanding && embeddedImg.hasClass("withinSig") && isAll)
    {
    }
    else 
    {
        embeddedImg.toggleClass("thumbnailImg expandedImg");
    }
    
    /*if going to expand image*/
    if (embeddedImg.hasClass("expandedImg"))
    {
        if (!includeSigWhenExpanding && embeddedImg.hasClass("withinSig") && isAll)
        {
            return;
        }
        
        currentHoveredThumbnail = null;
        $("#floatingImg").remove();

        embeddedImg.css("max-width", getOptimalImgMaxWidth(embeddedImg, expandedImgWidth) + "px");
        embeddedImg.css("max-height", expandedImgHeight_cssVal);
        
        /*if webm file, start playing it*/
        if (embeddedImg.hasClass("webmExt"))
        {
            embeddedImg[0].play();
            embeddedImg.attr("controls", "");
        }
    }
    else    /*if shrinking image back to thumbnail*/
    {
        embeddedImg.css("max-width", getOptimalImgMaxWidth(embeddedImg, thumbnailImgWidth) + "px");
        embeddedImg.css("max-height", thumbnailImgHeight_cssVal);
        
        /*if webm file, stop playing it*/
        if (embeddedImg.hasClass("webmExt"))
        {
            embeddedImg[0].pause();
            embeddedImg.removeAttr("controls");
        }
        
        if (embeddedImg.is(":hover")) 
        {
            currentHoveredThumbnail = embeddedImg;
        }
    }
}


/*
Get the optimal max-width for an image.

The width will be one of the following:
    - until the right of the browser windows border
    - until the right of the parent container of the image container
    - until the user-defined width limit

The smallest of the 3 will be chosen.    

@param embeddedImg :: jQuery object of the image
@param userDefinedWidthLimit :: use 0 if no limit

The returned width will be the smaller of the three.
*/
function getOptimalImgMaxWidth(embeddedImg, userDefinedWidthLimit)
{
    var optimalWidth;
    var toContainerWidth;
    var toWindowWidth;
    
    toContainerWidth = 
        embeddedImg.closest(".msg_body, blockquote").width();        /*gfaqsdep*/
        
    toWindowWidth =
        $(window).width() - embeddedImg.closest(".msg_body, blockquote").offset().left;     /*gfaqsdep*/
  
    if (toContainerWidth > toWindowWidth)
        optimalWidth = toWindowWidth;
    else 
        optimalWidth = toContainerWidth;

    /*if no user-defined limit on the width*/
    if (userDefinedWidthLimit == 0)
    {
        return optimalWidth;
    }
    else 
    {
        if (optimalWidth > userDefinedWidthLimit)
            return userDefinedWidthLimit;
        else 
            return optimalWidth;    
    }
}










function toggleSizesOfImages(embeddedImages, isExpanding) {

    embeddedImages.each(function(index, element) {
        if (isExpanding && $(this).hasClass("expandedImg"))
        {
            /*update its max-width*/
            $(this).css("max-width", getOptimalImgMaxWidth($(this)));
        }
        else 
        {
            toggleEmbeddedImgSize($(this), true);
        }
    });
}

$("body").on("click", ".imgCloseAll", function(event) {
    event.preventDefault();
    toggleSizesOfImages($(".embeddedImg.expandedImg"), false);
    
    if (!embedImagesSideBySide)
        $(window).scrollTop( $(this).parent().offset().top );
    else
        $(window).scrollTop( getImageAnchorOfImgMenu().parent().offset().top );
});

$("body").on("click", ".imgClosePost", function(event) {
    
    var postID = $(this).attr("data-postID");
    
    event.preventDefault();
    toggleSizesOfImages($(".embeddedImg[data-postID="+postID+"].expandedImg"), false);

    if (!embedImagesSideBySide)
        $(window).scrollTop( $(this).parent().offset().top );
    else
        $(window).scrollTop( getImageAnchorOfImgMenu().parent().offset().top );
});

$("body").on("click", ".imgExpandPost", function(event) {
    
    var postID = $(this).attr("data-postID");

    event.preventDefault();
    toggleSizesOfImages($(".embeddedImg[data-postID='"+postID+"']"), true);

    if (!embedImagesSideBySide)
        $(window).scrollTop( $(this).parent().offset().top );
    else
        $(window).scrollTop( getImageAnchorOfImgMenu().parent().offset().top );
});

$("body").on("click", ".imgExpandAll", function(event) {
    event.preventDefault();
    toggleSizesOfImages($(".embeddedImg"), true);

    if (!embedImagesSideBySide)
        $(window).scrollTop( $(this).parent().offset().top );
    else
        $(window).scrollTop( getImageAnchorOfImgMenu().parent().offset().top );
});










$("body").on("click", ".imgBlacklistToggle", function(event) {
    
    event.preventDefault();
    
    var imgURL;
    var imgAnchor
    
    if (embedImagesSideBySide)
    {
        if ($(this).html() === "blacklist")
            imgAnchor = getImageAnchorOfImgMenu();
        else 
            imgAnchor = $(this).parent().siblings(".embeddedImgAnchor");
    }
    else 
    {
        imgAnchor = $(this).siblings(".embeddedImgAnchor");
    }
    
    imgURL = imgAnchor.attr("data-backup-href");
    imgURL.trim();
    
    /*if image isn't blacklisted (but going to blacklist)*/
    if (! imgAnchor.hasClass("blacklisted"))
    {
        blacklist.push(imgURL);
        
        /*for every embedded image anchor*/
        $(".embeddedImgAnchor").each(function(index, element) {
            
            /*if has URL that was just blacklisted, hide it*/
            if (isURLmatchBlacklistedURL(imgURL, $(this).attr("data-backup-href")))
            {
                if (!embedImagesSideBySide)
                {
                    $(this).siblings(".imgBlacklistToggle").html("whitelist");
                    $(this).siblings(".imgBlacklistToggle").attr("title", "Whitelist image");
                }
                else 
                {
                    $(this).parent().css("max-width", thumbnailImgWidth + "px");
                    
                    $(this).before(
                        "<a target='_blank' class='imgMenuItem' href="+imgURL+">"+imgURL+"</a>" +
                        "<div class='imgMenuItem'><a class='imgBlacklistToggle' href='#' title='Whitelist image'>whitelist</a></div>"
                    );
                    
                    hideImgMenu();
                }
                
                $(this).addClass("blacklisted");
                $(this).hide();
            }
        });
    }
    else /*if image is blacklisted (but going to whitelist)*/
    {
        /*remove url from blacklist*/        
        var urlIdx = blacklist.indexOf(imgURL);
        if (urlIdx > -1)
        {
            blacklist.splice(urlIdx, 1);
        }
        
        /*for every embedded image anchor*/
        $(".embeddedImgAnchor").each(function(index, element) {

            /*if has URL that was just whitelisted, show it*/
            if ($(this).attr("data-backup-href") === imgURL)
            {
                if (!embedImagesSideBySide)
                {
                    $(this).siblings(".imgBlacklistToggle").html("blacklist");
                    $(this).siblings(".imgBlacklistToggle").attr("title", "Blacklist image");
                }
                else 
                {
                    $(this).siblings("a.imgMenuItem").remove();
                    $(this).siblings("div.imgMenuItem").remove();
                }
                
                $(this).removeClass("blacklisted");
                $(this).show();
            }
        });
    }
    
    settings.blacklistStr = blacklist.join("\n");
    localStorage.setItem("imagefaqs", JSON.stringify(settings));
});



})();   /*end of greasemonkey script*/

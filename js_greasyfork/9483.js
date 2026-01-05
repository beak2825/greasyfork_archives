// ==UserScript==
// @name        ImageFAQs
// @namespace   FightingGames@gfaqs
// @include     http://www.gamefaqs.gamespot.com
// @include     http://www.gamefaqs.gamespot.com*
// @include     https://www.gamefaqs.gamespot.com
// @include     https://www.gamefaqs.gamespot.com*
// @include     http://gamefaqs.gamespot.com
// @include     http://gamefaqs.gamespot.com*
// @include     https://gamefaqs.gamespot.com
// @include     https://gamefaqs.gamespot.com*
// @icon        http://fightinggames.bitbucket.io/imagefaqs/icon.png
// @description Converts image and webm/mp4 URLs into their embedded form
// @license     MIT
// @supportURL  https://gamefaqs.gamespot.com/boards/1063-customfaqs-scripts-and-styles
// @homepageURL https://fightinggames.bitbucket.io/imagefaqs/
// @version     1.22.47
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @require     https://code.jquery.com/ui/1.11.4/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/async/2.0.0/async.min.js
// @resource    jqueryuibaseCSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery.ui.base.css
// @resource    jqueryuithemeCSS https://code.jquery.com/ui/1.11.4/themes/cupertino/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/9483/ImageFAQs.user.js
// @updateURL https://update.greasyfork.org/scripts/9483/ImageFAQs.meta.js
// ==/UserScript==
 
 
/*
    The MIT License (MIT)
 
    This greasemonkey script for GameFAQs converts image and webm/mp4
    links into their embedded form. It can be considered as a spiritual successor
    to text-to-image (TTI) for GameFAQs.
 
    Copyright (c) 2018 FightingGames@gamefaqs <adrenalinebionicarm@gmail.com>
    Copyright (c) 2018 FeaturingDante@gamefaqs <featuringDante@gmail.com>
 
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
 
/*
Debug tips:
 
    - Use `return;` incrementally to see if intermediate output is correct.
    - Use external IDE when editing script:
        - https://stackoverflow.com/questions/49509874/how-can-i-develop-my-userscript-in-my-favourite-ide-and-avoid-copy-pasting-it-to
            - Remember to still include @require and @grant in the tampermonkey script, not just the local script.
*/
 
/*
Reminder:
	GM_addStyle_from_file and GM_addStyle_from_string are currently being used to
  replace GM_addStyle.
 
  Currently checks if imagefaqs has already been loaded after clicking back button
  	See code immediately after print function.
 
  Relying on hacks:
  	// @grant       GM.xmlHttpRequest
    // @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
 
  .embeddedImgAnchor > .embeddedImg (#video)   behave differently between firefox and chrome
    - In firefox, anchor's href is disabled while video is expanded.
      - Left-click does not shrink video, needed [Close Video]
 
    - In chrome:
      - Left-click will shrink video except when using video controls.
 
   May have to delay execution of entire script via setTimeout() to catch 
   particular end-user reported problems.
*/
 
 
const SUPPORT_URL = "https://gamefaqs.gamespot.com/boards/1063-customfaqs-scripts-and-styles";
const HOMEPAGE_URL = "http://fightinggames.bitbucket.io/imagefaqs/";
const USER_URL = "https://gamefaqs.gamespot.com/user";
 
const isDebug = false;
var print = function(msg) {};
if (unsafeWindow.console && isDebug) {
    print = (...args) => unsafeWindow.console.log("ImageFAQs_Debug", ...args)
}
 
if ($("body").find('#imagefaqsLoaded').length !== 0) {
	print('Imagefaqs already loaded. Returning.')
  	return;
}
else 
{
	$("body").append("<div id='imagefaqsLoaded'></div>");
}
 
const isSkipImgurAlbum = true;
 
/*
Get number of keys in a primitive java object
*/
Object.size = function(obj) {
    let size = 0;
    for (const key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};
 
 
/*
Below is a collection of functions to iterate through HTML objects (e.g. step from <b></b> to <img/>)
https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Whitespace_in_the_DOM
*/
 
 
/*
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
 
 
/*
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
 
/*
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
 
/*
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
 
/*
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
 
/*
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
 
/*
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
 
/*End of HTML object iterator functions*/
 
 
 
 
 
 
 
/*Get our own unique jQuery library instance*/
this.$ = this.jQuery = jQuery.noConflict(true);
 
 
 
 
 
 
/*
Display a notification on the bottom-right of the browser.
 
@param msg :: string to put between <span></span>
@param duration :: number of milliseconds to display message before it disappears. Default 1000
*/
function showNotification(msg, duration)
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
        "position": "absolute",
        "background": "white",
        "top": ($(window).scrollTop() + $(window).height() - notificationBox.height())+"px",
        "left": ($(window).scrollLeft() + $(window).width() - notificationBox.find("span").width() - 1)+"px",
    });
 
    // Note: Also look at $(window).scroll(function() { ... which controls scrolling of notification box.
 
    if (duration === undefined)
        duration = 1000;
 
    notificationBox.effect("highlight").delay(duration).fadeOut(500);
}
 
 
 
 
/*This top portion of the script handles the settings box and local storage*/
 
var thumbnailImgWidth = 0;
var thumbnailImgHeight = 150;
var thumbnailImgWidthSig = 0;
var thumbnailImgHeightSig = 75;
var settingsJSON = localStorage.getItem("imagefaqs");
var settings;       /*key-value array of JSON*/
var sessionResizeHotkey;
var sessionHideToggleHotkey;
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;      /*osdep*/
const isTampermonkey = GM_info.scriptHandler === "Tampermonkey";
 
 
function getDefaultSettings() {
    return {
        enable_sigs: true,
        enable_floatingImg: true,
        enable_floatingImg_url: false,
        includeSigWhenExpanding: false,
        hideSigsWhenHideMode: false,
        legacySigDetection: true,
        show_imgURLspan: true,
        show_imgResolutionSpan: true,
        show_imgFilesizeSpan: false,
        show_imgGoogle: true,
        show_imgIqdb: true,
        show_blacklistToggle: true,
        show_imgAllResizeToggles: true,
        show_hideToggle: true,
        show_hideAllToggle: true,
        imgContainerStyle: "sideBySideSig",
        auto_scroll_when_thumbnail_clicked: false,
        thumbnailWidth: thumbnailImgWidth,
        thumbnailHeight: thumbnailImgHeight,
        thumbnailWidthSig: thumbnailImgWidthSig,
        thumbnailHeightSig: thumbnailImgHeightSig,
        expandedWidth: 0,
        expandedHeight: 0,
        imgContainerBackgroundColor: "#DFE6F7",
        isHideMode: false,
        hideToggleHotkey: {115: 115},  /*F4*/
        resizeHotkey: {113: 113},  /*F2*/
        blacklistStr: "",
        loopThumbnailVideo: true,
        loopExpandedVideo: false,
    };
}
 
function setSettingsToDefault() {
    settings = getDefaultSettings();
}
 
 
/*if imageFAQs was freshly installed*/
if (settingsJSON === null)
{
    setSettingsToDefault();
 
    localStorage.setItem("imagefaqs", JSON.stringify(settings));    /*save default settings*/
 
    /*gfaqsdep for URL*/
    showNotification(`ImageFAQs ${GM_info.script.version} has successfully been installed.`+
                     `<br/><br/>Settings can be accessed under 'Message Board Information' `+
                     `at<br/><a target='_blank' href='${USER_URL}'>${USER_URL}</a>`, 10000);
}
else
{
    settings = $.parseJSON(settingsJSON);
 
    //For each default setting, apply it to current settings if current setting isn't set
    var defaultSettings = getDefaultSettings();
    var defaultKeys = Object.keys(defaultSettings);
    defaultKeys.forEach(function (defaultKey) {
        if (settings[defaultKey] === undefined) {
            settings[defaultKey] = defaultSettings[defaultKey];
            localStorage.setItem("imagefaqs", JSON.stringify(settings));
        }
    });
}
 
 
print("ImageFAQs settings from local storage: " + JSON.stringify(settings));
 
 
/*
Convert an ASCII numeric representation of a keyboard character to its full string name
 
e.g. keyCodeToString(16) === "shift"
*/
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
 
 
/*
Convert an array of KV ASCII numeric representation of keyboard characters to its
full string representation
 
e,g, keyCodeKVArrayToString([{68:68},{77:77}]) === "DM"
*/
function keyCodeKVArrayToString(array)
{
    var string = "";
 
    for (var key in array)
    {
        string += keyCodeToString(key) + " ";
    }
 
    return string;
}
 
 
/*
Get a copy of an array of KV's using 1-level deep cloning.
*/
function cloneKVArray(KVArray)
{
    var newKVArray = {};
 
    for (var key in KVArray)
    {
        newKVArray[key] = KVArray[key];
    }
 
    return newKVArray;
}
 
 
 
sessionHideToggleHotkey = cloneKVArray(settings.hideToggleHotkey);
sessionResizeHotkey = cloneKVArray(settings.resizeHotkey);
 
 
 
 
function applySettingsToPopup(settings, settingsPopup)
{
    settingsPopup.find("#enable_sigs_checkbox").prop("checked", settings.enable_sigs);
    settingsPopup.find("#enable_floatingImg").prop("checked", settings.enable_floatingImg);
    settingsPopup.find("#enable_floatingImg_url").prop("checked", settings.enable_floatingImg_url);
 
    settingsPopup.find("#includeSigWhenExpanding_checkbox").prop("checked", settings.includeSigWhenExpanding);
    settingsPopup.find("#hideSigsWhenHideMode_checkbox").prop("checked", settings.hideSigsWhenHideMode);
    settingsPopup.find("#legacySigDetection_checkbox").prop("checked", settings.legacySigDetection);
 
    settingsPopup.find("#loopThumbnailVideo_checkbox").prop("checked", settings.loopThumbnailVideo);
    settingsPopup.find("#loopExpandedVideo_checkbox").prop("checked", settings.loopExpandedVideo);
 
    settingsPopup.find("#show_ImgURLspan_checkbox").prop("checked", settings.show_imgURLspan);
    settingsPopup.find("#show_ImgResolutionSpan_checkbox").prop("checked", settings.show_imgResolutionSpan);
    settingsPopup.find("#show_imgFilesizeSpan_checkbox").prop("checked", settings.show_imgFilesizeSpan);
    settingsPopup.find("#show_imgGoogle_checkbox").prop("checked", settings.show_imgGoogle);
    settingsPopup.find("#show_blacklistToggle_checkbox").prop("checked", settings.show_blacklistToggle);
    settingsPopup.find("#show_imgIqdb_checkbox").prop("checked", settings.show_imgIqdb);
    settingsPopup.find("#show_imgAllResizeToggles_checkbox").prop("checked", settings.show_imgAllResizeToggles);
    settingsPopup.find("#show_hideToggle_checkbox").prop("checked", settings.show_hideToggle);
    settingsPopup.find("#show_hideAllToggle_checkbox").prop("checked", settings.show_hideAllToggle);
 
    settingsPopup.find("input[value="+settings.imgContainerStyle+"]").prop("checked", true);
    settingsPopup.find("#auto_scroll_when_thumbnail_clicked_checkbox").prop("checked", settings.auto_scroll_when_thumbnail_clicked);
 
    settingsPopup.find("#thumbnailImgWidth_text").val(settings.thumbnailWidth);
    settingsPopup.find("#thumbnailImgHeight_text").val(settings.thumbnailHeight);
    settingsPopup.find("#thumbnailImgWidthSig_text").val(settings.thumbnailWidthSig);
    settingsPopup.find("#thumbnailImgHeightSig_text").val(settings.thumbnailHeightSig);
    settingsPopup.find("#expandedWidth_text").val(settings.expandedWidth);
    settingsPopup.find("#expandedHeight_text").val(settings.expandedHeight);
 
    settingsPopup.find("#imgContainerBackgroundColor_color").val(settings.imgContainerBackgroundColor);
    settingsPopup.find("#resizeHotkey_text").val( keyCodeKVArrayToString(settings.resizeHotkey) );
    settingsPopup.find("#hideToggleHotkey_text").val( keyCodeKVArrayToString(settings.hideToggleHotkey) );
    settingsPopup.find("#blacklist_text").val( settings.blacklistStr );
    settingsPopup.children("#responseSpan").html("&nbsp;");
}
 
 
 
 
/*Event where user opens up settings menu*/
$("body").on("click", "#imagefaqs_settings_but", function(event) {
 
    var settingsPopup = $("#imagefaqs_settings_popup");
    event.preventDefault();
 
    if (settingsPopup.length === 0)
    {
        $("body").append(
            "<div id='imagefaqs_settings_popup' title='ImageFAQs Settings. Version "+GM_info.script.version+"'>" +
 
                "Update history: <a target='_blank' href='"+HOMEPAGE_URL+"' style='outline: 0'>"+HOMEPAGE_URL+"</a>" +
                "<br/>" +
                "<span id='feedback_bugreport_info'>" +
                    "Feedback and bug reporting: <a target='_blank' href='"+SUPPORT_URL+"'>"+SUPPORT_URL+"</a>" +
                    "<br/>" +
                "</span>" +
 
                "<fieldset>" +
                    "<legend>Main</legend>" +
                    "<label><input id='enable_floatingImg' type='checkbox'>Enable floating expanded image upon cursor hover over thumbnail</label>" +
                    "<br/>" +
                    "<label><input id='enable_floatingImg_url' type='checkbox'>Enable floating expanded image upon cursor hover over URL</label>" +
                    "<br/>" +
                    "<label><input id='auto_scroll_when_thumbnail_clicked_checkbox' type='checkbox'>Auto-scroll to top of image after toggling visibility or size</label>" +
                "</fieldset>" +
 
                "<fieldset>" +
                    "<legend>Signature-specific</legend>" +
                    "<label><input id='enable_sigs_checkbox' type='checkbox'>Embed signature images</label>" +
                    "<br/>" +
                    "<label><input id='legacySigDetection_checkbox' type='checkbox'>Add legacy signature image detection on older posts</label>" +
                    "<br/>" +
                    "<label><input id='includeSigWhenExpanding_checkbox' type='checkbox'>Affect signature images when expanding and contracting all images</label>" +
                    "<br/>" +
                    "<label><input id='hideSigsWhenHideMode_checkbox' type='checkbox'>Affect signature images when toggling hide mode</label>" +
                "</fieldset>" +
 
                "<fieldset>" +
                    "<legend>Video-specific</legend>" +
                    "<label><input id='loopThumbnailVideo_checkbox' type='checkbox'>Auto-play and loop thumbnail videos (muted)</label>" +
                    "<br/>" +
                    "<label><input id='loopExpandedVideo_checkbox' type='checkbox'>Loop expanded videos</label>" +
                    "<br/>" +
                "</fieldset>" +
 
                "<fieldset>" +
                    "<legend>Image Container Toggles and Information Visibility</legend>" +
                    "<label><input id='show_ImgURLspan_checkbox' type='checkbox'>Show image URL</label>" +
                    "<br/>" +
                    "<label><input id='show_ImgResolutionSpan_checkbox' type='checkbox'>Show image resolution</label>" +
                    "<br/>" +
                    "<label><input id='show_imgFilesizeSpan_checkbox' type='checkbox'>Show image filesize (Warning: Doubles load time)</label>" +
                    "<br/>" +
                    "<label><input id='show_imgGoogle_checkbox' type='checkbox'>Show google reverse image search button</label>" +
                    "<br/>" +
                    "<label><input id='show_imgIqdb_checkbox' type='checkbox'>Show iqdb reverse image search button</label>" +
                    "<br/>" +
                    "<label><input id='show_blacklistToggle_checkbox' type='checkbox'>Show blacklist toggle button</label>" +
                    "<br/>" +
                    "<label><input id='show_imgAllResizeToggles_checkbox' type='checkbox'>Show all-resize toggle buttons</label>" +
                    "<br/>" +
                    "<label><input id='show_hideAllToggle_checkbox' type='checkbox'>Show all-hide/expose toggle buttons</label>" +
                    "<br/>" +
                    "<label><input id='show_hideToggle_checkbox' type='checkbox'>Show individual hide/expose toggle button</label>" +
                "</fieldset>" +
 
                "<fieldset>" +
                    "<legend>Image Container Style</legend>" +
                    "<label><input type='radio' name='imgContainerStyle' value='stacked' checked='checked'>Stacked and Verbose</label>" +
                    "<br>" +
                    "<label><input type='radio' name='imgContainerStyle' value='sideBySide'>Side-By-Side and Succinct</label>" +
                    "<br>" +
                    "<label><input type='radio' name='imgContainerStyle' value='sideBySideSig'>Side-By-Side and Succinct (Signatures Only)</label>" +
                "</fieldset>" +
 
                "<label><input id='thumbnailImgWidth_text' type='text'>Thumbnail Max-Width (0 default)</label>" +
                "<br/>" +
                "<label><input id='thumbnailImgHeight_text' type='text'>Thumbnail Max-Height (150 default)</label>" +
                "<br/>" +
                "<label><input id='thumbnailImgWidthSig_text' type='text'>Signature Thumbnail Max-Width (0 default)</label>" +
                "<br/>" +
                "<label><input id='thumbnailImgHeightSig_text' type='text'>Signature Thumbnail Max-Height (75 default)</label>" +
                "<br/>" +
                "<label><input id='expandedWidth_text' type='text'>Expanded max-width (0 default)</label>" +
                "<br/>" +
                "<label><input id='expandedHeight_text' type='text'>Expanded max-height (0 default)</label>" +
                "<br/ style='margin-bottom: 5px'>" +
                "<span>Tip: Use 0 to specify no length restriction.</span>" +
                "<br/><br/>" +
 
                "<input id='imgContainerBackgroundColor_color' type='color' value='#DFE6F7' size=4 ><label>Image container background color (RGB={223,230,247} default)</label>" +
                "<br/ style='margin-bottom: 5px'>" +
                "<span>Tip: Use RGB={0,0,0} for no background color.</span>" +
                "<br/><br/>" +
 
                "<label>Newline separated list of blacklisted image URLs</label>" +
                "<br/>" +
                "<textarea id='blacklist_text'></textarea>" +
                "<br/ style='margin-bottom: 5px'>" +
                "<span>Tip: You can blacklist an entire domain (e.g. pbsrc.com).</span>" +
                "<br/><br/>" +
 
                "<label><input id='resizeHotkey_text' class='hotkeyInput' type='text'>Toggle image size hotkey (F2 default)</label>" +
                "<br/>" +
                "<label><input id='hideToggleHotkey_text' class='hotkeyInput' type='text'>Toggle hide mode hotkey (F4 default)</label>" +
                "<br/ style='margin-bottom: 5px'>" +
                "<span>Tip: You can disable a hotkey with the backspace.</span>" +
                "<br/><br/>" +
 
                "<button id='saveImagefaqsSettingsBut' type='button'>Save</button> " +
                "<button id='cancelImagefaqsSettingsBut' type='button'>Cancel</button> " +
                "<span id='responseSpan'>&nbsp;&nbsp;</span>" +     /*for reporting success or failure*/
 
                "<button id='defaultSettingsBut' type='button' style='float: right'>Reset Settings</button> " +
            "</div>"
        );
 
        settingsPopup = $("#imagefaqs_settings_popup");
    }
 
    /*Show user's custom settings*/
    applySettingsToPopup(settings, settingsPopup);
 
    settingsPopup.dialog({
        width: 550,
        height: 800     /*adds a scrollbar*/
    });
 
    settingsPopup.find("#blacklist_text").width(settingsPopup.width());
});
 
 
 
 
$("body").on("click", "#defaultSettingsBut", function(event) {
    event.preventDefault();
 
    var settingsPopup = $("#imagefaqs_settings_popup");
 
    setSettingsToDefault();
    applySettingsToPopup(settings, settingsPopup);
 
    localStorage.setItem("imagefaqs", JSON.stringify(settings));
    reportResponseMsgInImagefaqsSettingsPopupBox("Default settings saved.", settingsPopup);
});
 
 
 
/*Event where users clicks on the "Save Settings" button*/
$("body").on("click", "#saveImagefaqsSettingsBut", function(event) {
 
    event.preventDefault();
 
    var settingsPopup = $("#imagefaqs_settings_popup");
 
    /*if valid thumbnail dimensions*/
    if (
        !isNaN($("#thumbnailImgWidth_text").val()) && $("#thumbnailImgWidth_text").val() >= 0 &&
        !isNaN($("#thumbnailImgHeight_text").val()) && $("#thumbnailImgHeight_text").val() >= 0 &&
        !isNaN($("#thumbnailImgWidthSig_text").val()) && $("#thumbnailImgWidthSig_text").val() >= 0 &&
        !isNaN($("#thumbnailImgHeightSig_text").val()) && $("#thumbnailImgHeightSig_text").val() >= 0)
    {
        settings.thumbnailWidth = $("#thumbnailImgWidth_text").val();
        settings.thumbnailHeight = $("#thumbnailImgHeight_text").val();
        settings.thumbnailWidthSig = $("#thumbnailImgWidthSig_text").val();
        settings.thumbnailHeightSig = $("#thumbnailImgHeightSig_text").val();
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
    if (settingsPopup.find("#imgContainerBackgroundColor_color").val().match(/^(#[a-zA-Z0-9]{6})|0$/i))
    {
        settings.imgContainerBackgroundColor = settingsPopup.find("#imgContainerBackgroundColor_color").val();
    }
    else
    {
        reportResponseMsgInImagefaqsSettingsPopupBox("Error: Invalid image container background color.", settingsPopup);
        return;
    }
 
    settings.enable_sigs = settingsPopup.find("#enable_sigs_checkbox").is(":checked");
    settings.enable_floatingImg = settingsPopup.find("#enable_floatingImg").is(":checked");
    settings.enable_floatingImg_url = settingsPopup.find("#enable_floatingImg_url").is(":checked");
 
    settings.loopThumbnailVideo = settingsPopup.find("#loopThumbnailVideo_checkbox").is(":checked");
    settings.loopExpandedVideo = settingsPopup.find("#loopExpandedVideo_checkbox").is(":checked");
 
    settings.includeSigWhenExpanding = settingsPopup.find("#includeSigWhenExpanding_checkbox").is(":checked");
    settings.hideSigsWhenHideMode = settingsPopup.find("#hideSigsWhenHideMode_checkbox").is(":checked");
    settings.legacySigDetection = settingsPopup.find("#legacySigDetection_checkbox").is(":checked");
 
    settings.show_imgURLspan = settingsPopup.find("#show_ImgURLspan_checkbox").is(":checked");
    settings.show_imgResolutionSpan = settingsPopup.find("#show_ImgResolutionSpan_checkbox").is(":checked");
    settings.show_imgFilesizeSpan = settingsPopup.find("#show_imgFilesizeSpan_checkbox").is(":checked");
    settings.show_imgGoogle = settingsPopup.find("#show_imgGoogle_checkbox").is(":checked");
    settings.show_imgIqdb = settingsPopup.find("#show_imgIqdb_checkbox").is(":checked");
    settings.show_blacklistToggle = settingsPopup.find("#show_blacklistToggle_checkbox").is(":checked");
    settings.show_imgAllResizeToggles = settingsPopup.find("#show_imgAllResizeToggles_checkbox").is(":checked");
    settings.show_hideToggle = settingsPopup.find("#show_hideToggle_checkbox").is(":checked");
    settings.show_hideAllToggle = settingsPopup.find("#show_hideAllToggle_checkbox").is(":checked");
 
    settings.imgContainerStyle = settingsPopup.find("input[name=imgContainerStyle]:checked").val();
    settings.auto_scroll_when_thumbnail_clicked = settingsPopup.find("#auto_scroll_when_thumbnail_clicked_checkbox").is(":checked");
 
    settings.resizeHotkey = cloneKVArray(sessionResizeHotkey);
    settings.hideToggleHotkey = cloneKVArray(sessionHideToggleHotkey);
    settings.blacklistStr = settingsPopup.find("#blacklist_text").val();
 
    localStorage.setItem("imagefaqs", JSON.stringify(settings));
 
    reportResponseMsgInImagefaqsSettingsPopupBox("Settings saved.", settingsPopup);
});
 
 
 
/*
Display a notification in the settings window
 
@param msg :: message string to show to the user
@param box :: $("#imagefaqs_settings_popup")
*/
function reportResponseMsgInImagefaqsSettingsPopupBox(msg, box)
{
    var msgBox = box.children("#responseSpan");
 
    msgBox.html(msg);
    msgBox.effect("highlight");
}
 
 
/*Event when users clicks on the "Cancel" button the settings window.*/
$("body").on("click", "#cancelImagefaqsSettingsBut", function(event) {
 
    event.preventDefault();
    $("#imagefaqs_settings_popup").dialog("close");
});
 
 
 
 
 
 
/*Begin main scripting*/
setTimeout(function(){
 
print("Entered main()");
 
var isHideMode = settings.isHideMode;
var enable_floatingImg = settings.enable_floatingImg;
var enable_floatingImg_url = settings.enable_floatingImg_url;
 
var includeSigWhenExpanding = settings.includeSigWhenExpanding;
var hideSigsWhenHideMode = settings.hideSigsWhenHideMode;
var legacySigDetection = settings.legacySigDetection;
 
var loopThumbnailVideo = settings.loopThumbnailVideo;
var loopExpandedVideo = settings.loopExpandedVideo;
 
var isShow = {
    URLSpan: settings.show_imgURLspan,
    resolutionSpan: settings.show_imgResolutionSpan,
    filesizeSpan: settings.show_imgFilesizeSpan,
    googleReverse: settings.show_imgGoogle,
    IQDBreverse: settings.show_imgIqdb,
    blacklistToggle: settings.show_blacklistToggle,
    resizeToggles: settings.show_imgAllResizeToggles,
    hideToggles: settings.show_hideAllToggle,
    hideToggle: settings.show_hideToggle,
};
 
var imgContainerStyle = settings.imgContainerStyle;
var autoScrollWhenThumbnailClicked = settings.auto_scroll_when_thumbnail_clicked;
 
var thumbnailImgWidth = Number(settings.thumbnailWidth);
var thumbnailImgHeight = Number(settings.thumbnailHeight);
var thumbnailImgWidthSig = Number(settings.thumbnailWidthSig);
var thumbnailImgHeightSig = Number(settings.thumbnailHeightSig);
var expandedImgWidth = Number(settings.expandedWidth);
var expandedImgHeight = Number(settings.expandedHeight);
 
var imgContainerBackgroundColor = settings.imgContainerBackgroundColor;
if (imgContainerBackgroundColor === "#000000") {
    imgContainerBackgroundColor = 0;
}
 
var blacklist = settings.blacklistStr.split("\n");    /*array of URLs to block*/
var currentURL;
var pageType;       /* "topic" or "postPreview" or "other" */
var allowImgInSig = settings.enable_sigs;
var floatingImgWidth;
var floatingImgRightOffset = 50;
var floatingImgBorder = 10;
var currentHoveredThumbnail = null;
var imgAnchorTags = [];
 
var expandedImgWidth_css = expandedImgWidth === 0 ? "" : expandedImgWidth+"px";
var expandedImgHeight_css = expandedImgHeight === 0 ? "" : expandedImgHeight+"px";
 
print("Global settings applied");
 
var heldDownKeys = {};
$("body").on("keydown", "#imagefaqs_settings_popup #hideToggleHotkey_text", function(event){
 
    heldDownKeys[event.which] = event.which;
    sessionHideToggleHotkey = cloneKVArray(heldDownKeys);
 
    $(this).val(
        keyCodeKVArrayToString(sessionHideToggleHotkey)
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
 
 
 
/*
Toggle between "display" and "hide" images.
*/
function toggleImageVisiblity(embeddedImgContainers, via)
{
    if (via === "hotkey")
        isHideMode = !isHideMode;
 
    /*If set images to be hidden...*/
    if ((via === "hotkey" && isHideMode) ||
        via === "closeAnchor")
    {
        if (pageType !== "other")
        {
            embeddedImgContainers.each(function(index, element) {
                if ($(this).hasClass("isHidable") && !$(this).hasClass("hiddenx")) {
                    hideMedia($(this), false);
                }
            });
 
            if (via === "hotkey")
                showNotification("ImageFAQs: All images hidden.");
        }
        else
        {
            if (via === "hotkey")
                showNotification("ImageFAQs: Images will be hidden.");
        }
    }
    else
    {
        if (pageType !== "other")
        {
            embeddedImgContainers.each(function(index, element) {
                if ($(this).hasClass("hiddenx")) {
                    showMedia($(this), false);
                }
            });
 
            if (via === "hotkey")
                showNotification("ImageFAQs: All images exposed.");
        }
        else
        {
            if (via === "hotkey")
                showNotification("ImageFAQs: Images will be exposed.");
        }
    }
 
    settings.isHideMode = isHideMode;
    localStorage.setItem("imagefaqs", JSON.stringify(settings));
}
 
 
 
 
 
var nextImageSize = "expanded";
$("body").keydown(function(event){
 
    var key;
    var numMatchingPressedHotkeys;
    var desiredAction = "";
    heldDownKeys[event.which] = event.which;
 
 
    /*if backspace, ignore*/
    if (heldDownKeys[8] === 8)
    {
        return;
    }
 
 
    /*are every hide mode hotkey pressed?*/
    numMatchingPressedHotkeys = 0;
    for (key in settings.hideToggleHotkey)
    {
        if (settings.hideToggleHotkey[key] !== heldDownKeys[key])
        {
            break;
        }
 
        numMatchingPressedHotkeys++;
    }
    if (numMatchingPressedHotkeys === Object.size(settings.hideToggleHotkey) && numMatchingPressedHotkeys > 0)
    {
        desiredAction = "toggleHideMode";
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
        if (numMatchingPressedHotkeys === Object.size(settings.resizeHotkey) && numMatchingPressedHotkeys > 0)
        {
            desiredAction = "toggleImageResize";
        }
    }
 
 
 
    if (desiredAction === "toggleHideMode")
    {
        toggleImageVisiblity($(".embeddedImgContainer"), "hotkey");
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
 
 
 
 
$(window).scroll(function() {
 
    var notificationBoxes = $("body").children("#imagefaqs_notificationBox");
 
    notificationBoxes.each(function(index, element) {
        $(this).css({
            "top": ($(window).scrollTop() + $(window).height() - $(this).height())+"px",
            "left": ($(window).scrollLeft() + $(window).width() - $(this).find("span").width() - 1)+"px"
        });
    });
});
 
 
 
print("Parsing URL")
 
currentURL = window.location.href;
if (currentURL.match(/.*gamefaqs\.gamespot\.com\/boards\/.*\/.*\/.*/i))        /*gfaqsdep*/
{
    pageType = "messageDetails";
}
else if (currentURL.match(/.*gamefaqs\.gamespot\.com\/boards\/.*\/.*/i))                 /*gfaqsdep*/
{
    pageType = "topic";
}
else if (currentURL.match(/.*gamefaqs\.gamespot\.com\/boards\/post/i))              /*gfaqsdep*/
{
    pageType = "postPreview";
}
else if (currentURL.match(/.*gamefaqs\.gamespot\.com\/user[^\/]*$/i))               /*gfaqsdep*/
{
    /*add settings link*/  /*gfaqsdep*/
    $("div.body tbody:eq(1)").append("<tr><td colspan='2'><a id='imagefaqs_settings_but' href='#'>ImageFAQs Options</a> - Change thumbnail size, enable signature embedding, and more.</td></tr>");
}
else
{
    pageType = "other";
    return;
}
 
 
function GM_addStyle_from_file(fileName) {
 
  var head = document.head
    , link = document.createElement("link")
 
  link.type = "text/css"
  link.rel = "stylesheet"
  link.href = fileName
 
  head.appendChild(link)
}
 
function GM_addStyle_from_string(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}
 
var jqueryuibaseCSS = "https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery.ui.base.css"
var jqueryuithemeCSS = "https://code.jquery.com/ui/1.11.4/themes/cupertino/jquery-ui.css"
 
print("GM_addStyle_from_file(jqueryuibaseCSS)")
GM_addStyle_from_file (jqueryuibaseCSS);
print("GM_addStyle_from_file(jqueryuithemeCSS)")
GM_addStyle_from_file (jqueryuithemeCSS);
 
 
 
 
 
print("GM_addStyle_from_string(all)")
GM_addStyle_from_string (
    ".embeddedImgContainer {" +
        "background: "+imgContainerBackgroundColor+";" +
    "}" +
    ".embeddedImgAnchor {"+
        "display: inline-block;"+
    "}" +
    ".thumbnailImg {"+
        "display: inline-block;"+  /*prevents parent anchor from stretching horizontally*/
        "vertical-align: bottom;"+ /*eliminates small gap between bottom of image and parent div*/
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
    "}" +
    ".widget { " +
        "display: inline-block;"+  /*Allows wrapping of widget elements without expanding parent div (i.e. float left),*/
    "}", +                          /*and clears next element to newline (i.e. next element is not floating.*/
    ".imgResolution { " +
        "color: black;" +
    "}"
);
 
 
print("CSS applied");
 
 
 
$("body").css("position", "relative");
var posts = null;
 
posts = $("div.msg_body");                  /*gfaqsdep*/
 
/* gfaqsdep. Remove the direct link icon that accompany each clickable URL */
const embedLinkJDoms = posts.find('.embed_link');
for (let embedLink of embedLinkJDoms) {
    const embedLinkJDom = $(embedLink);
 
    const url = embedLinkJDom.attr('href');
    if (url.match(/(user_image)|(imgur)/)) {
       $(embedLink).remove();
    }
}

/* gfaqsdep. Replace gamefaqs anchors into our anchors. If anchor is accompanied by frame, delete the frame. */
const imgToggleJDoms = posts.find(".click_embed")
for (const imgToggleDom of imgToggleJDoms) {
    const imgToggleJDom = $(imgToggleDom)
    const imgSrc = imgToggleJDom.attr("data-src")

    const isUserSrc = imgSrc.match(/user_image/);
    const isImgurSrc = imgSrc.match(/imgur/);
    const isAlbumSrc = imgSrc.match(/\/a\//);

    if (isUserSrc || (isImgurSrc && !isAlbumSrc)) {
        const embedFrameJDom = imgToggleJDom.next('.embed_frame');
        if (embedFrameJDom.length > 0) {
            embedFrameJDom.remove();
        }

        // next() doesn't work properly after replaceWith(), so call replaceWith() as last step. 
        imgToggleJDom.replaceWith(`<a href="${imgSrc}">EmbedPlaceholder for ${imgSrc}</a>`)
    }
}

/* gfaqsdep */
// We have removed the frames that accompanied the anchors, but there may 
// be standalone frames with no accompanying anchors.
// iframe will be converted into anchor instead. This is required for
// "Always show images and media" mode.
const embedFrameJDoms = posts.find('.embed_frame');       // Get <div> that contain the iframe
for (let embedFrameDom of embedFrameJDoms) {
    const embedFrameJDom = $(embedFrameDom)

    const iframeJDom = embedFrameJDom.children().first();   // Get nested iframe
 
    let isReplaceable = false;
    let imgSrc = iframeJDom.attr('src') || '';
    const iframeClass = iframeJDom.attr('class');

    // Need first condition b/c iframe might match <blockquote>
    if (imgSrc.match(/(gfycat)|(gamefaqs\.gamespot\.com)|(i\.imgur)/))
    {
        isReplaceable = true;
    } else if (iframeClass.match(/imgur-embed-pub/)) {
        isReplaceable = true; 
        const dataID = iframeJDom.attr('data-id');
        imgSrc = `https://imgur.com/${dataID}`;
        if (imgSrc.includes('/a/')) {
            // Album.
            if (isSkipImgurAlbum) {
                // Chrome will always send http referrer which prevents
                // imgur hotlink bypass.
                isReplaceable = false;
            }
        }
    } else if (iframeClass.match(/imgur-embed-iframe-pub-a-/)) {  // Imgur album
        // Example: id="imgur-embed-iframe-pub-a-eFrCukn"   // a- indicates album.
        isReplaceable = true; 
        const dataID = iframeJDom.attr('id');
        const imgurID = dataID.replace('imgur-embed-iframe-pub-a-', '');
        imgSrc = `https://imgur.com/a/${imgurID}`;
 
        if (isSkipImgurAlbum) {
            // Chrome will always send http referrer which prevents
            // imgur hotlink bypass.
            isReplaceable = false;  
        }
    } else if (iframeClass.match(/imgur-embed-iframe-pub/)) {
        isReplaceable = true; 
        // Example: id="imgur-embed-iframe-pub-PE8W5qk"
        const dataID = iframeJDom.attr('id');
        const imgurID = dataID.replace('imgur-embed-iframe-pub-', '');
        imgSrc = `https://imgur.com/${imgurID}`;
    } else {
        // Don't remove (e.g. twitter embed).
    }

    if (isReplaceable) {
        // If there's no .embedPlaceholder above, should convert this iframe into an anchor instead.
        embedFrameJDom.replaceWith(`<a href="${imgSrc}">EmbedPlaceholderForFrame ${imgSrc}<a/>`)
        print('replaced')
    }
}
 
/* gfaqsdep = replace <img> user images with anchors (Always show images, but click-to-show media) */
let imgJDoms = posts.find("img")
for (let imgDom of imgJDoms) {
    let imgJDom = $(imgDom)
    let imgSrc = imgJDom.attr("src");
    if (imgSrc.match(/user_image/)) {
       imgJDom.replaceWith(`<a class='embedPlaceholder' href="${imgSrc}"><a/>`)
    }
}
 
/* gfaqsdep. Special case for <a> that aren't embedded by gamefaqs for some reason. 
   Block must be positioned here after the rest for some reason */
const loneAnchorJDoms = posts.find("a");
for (const aEle of loneAnchorJDoms) {
    const href = $(aEle).attr("href");
    // Match like https://imgur.com/8ROZfAl/embed?ref=https%3A%2F%2Fgamefaqs.
    // gamespot.com%2Fboards%2F2000121-anime-and-manga-other-titles%2F80628412
    // &w=540
    const m = /(https:\/\/imgur\.com\/\w+)\/embed/.exec(href);
    if (m) {
        // Capture like https://imgur.com/8ROZfAl
        const imgurURL = m[1];
 
        $(aEle).replaceWith(
            `<a href="${imgurURL}">EmbedPlaceholderForFrame ${imgurURL}</a>` 
        );
    }
}
 
print("Retrieved posts");
 
 
 
function getMediaTyping(obj)
{
    var url = "";
    if (typeof obj == "string")
    {
        url = obj;
    }
    else
    {
        url = getMediaURL(obj);
    }
 
    var mediaTyping = {
        type: undefined,
        subtype: undefined,
    };
 
    if (url.match(/i\.imgtc\.com\/\w+\.gifm$/))
    {
        mediaTyping.type = "iframe";
        mediaTyping.subtype = "imgtc";
    }
    else if (url.match(/https?:\/\/[^<>\s]*?\.(?:png|jpg|gif|jpeg|webm|gifv|mp4)/i))
    {
        var mediaExt = url.split(".").pop();
        mediaTyping.subtype = mediaExt.match(/png|jpg|gifv|gif|jpeg|webm|mp4/i)[0];
        mediaTyping.type = mediaTyping.subtype.match(/webm|mp4|gifv/i) ? "video" : "image" ;
    }
    else if (url.match(/https?:\/\/gfycat\.com\/\w+$/i))
    {
        /*will be converted to webm later*/
 
        mediaTyping.type = "iframe";
        mediaTyping.subtype = "gfycat";
    }
    else if (url.match(/https?:\/\/(.\.)?imgur\.com\/(a\/)?\w+$/i))
    {
        /*will be converted to webm later*/
 
        mediaTyping.type = "iframe";
        mediaTyping.subtype = "imgur";
    }
    else
    {
        mediaTyping = undefined;
    }
 
    return mediaTyping;
}
 
function getMediaURL(obj)
{
    if (obj.hasClass("embeddedImg"))
    {
        /*original 'href' may be modified to stop anchor events*/
        return obj.closest(".embeddedImgAnchor").attr("data-backup-href");
    }
    else if (obj.hasClass("floatingImg"))
    {
        return obj.embeddedImgRef.closest(".embeddedImgAnchor").attr("data-backup-href");
    }
    else if (obj.hasClass(".embeddedImgContainer"))
    {
        return obj.find(".embeddedImgAnchor").attr("data-backup-href");
    }
    else
    {
        var container = getEmbeddedImgContainer(obj);
        return container.find(".embeddedImgAnchor").attr("data-backup-href");
    }
}
 
 
 
 
 
 
var jsPosts = $.makeArray(posts);
 
/*For each user post, get anchor tags that refer to media*/
async.each(jsPosts, function(jsPost, cb) {
    var jqPost = $(jsPost);
 
    /*if in post preview mode, need to manually parse through the preview message body and
    replace every plain-text image URL in its anchor form
 
    Bug fix: messageDetails already embeds clickable links.*/
    if (pageType === "postPreview")
    {
        var postHtml = jqPost.html();
        postHtml = postHtml.replace(/https?:\/\/[^<>\s]*?\.(?:png|jpg|gif|jpeg|webm|gifv|mp4)[^<>\s]*/ig, "<a href=\"$&\">$&</a>");
 
        jqPost.html(postHtml);
    }
 
    /*get all anchor tags*/
    const jsAnchorTags = $.makeArray(jqPost.find("a"));
 
    jsPost.jsMediaAnchorTags = filterIn_mediaAnchorTags(jsAnchorTags);
 
    markSigAnchorTags(jsPost.jsMediaAnchorTags, jqPost);
 
    if (!allowImgInSig)
        jsPost.jsMediaAnchorTags = removeSigAnchorTags(jsPost.jsMediaAnchorTags);
 
    // Give each anchor tag the post number
    let postID = jqPost.attr("data-msgnum");   /* gfaqsdep */
    let i =0 ;
    for (let jsAnchorTag of jsPost.jsMediaAnchorTags) {
       jsAnchorTag.postID = postID
    }
 
    cb();
});
 
 
function filterIn_mediaAnchorTags(jsAnchorTags) {
    const jsMediaAnchorTags = [];
 
    for (let jsAnchorTag of jsAnchorTags) {
        const jqAnchorTag = $(jsAnchorTag);
        let anchorURL = jqAnchorTag.attr("href");
 
        /* Bug fix: Hidden quote link */
        if (anchorURL == null) {
            continue;
        }
 
        /*Bug fix: Ignore @Username links*/
        if (anchorURL.match(/^\/community\//)) {
            continue;
        }
 
        /*Bug fix: Ignore 'FightingGames posted...' links*/
        if (anchorURL.match(/^\/boards\//)) {
            continue;
        }
 
        if (isTampermonkey) {
            const embedType = jqAnchorTag.attr("data-embed-type");
            if (embedType && embedType.match(/(imgur)|(gfycat)/)) {
                if (jqAnchorTag[0] !== undefined) {
                    if (jqAnchorTag[0].nextSibling !== null && jqAnchorTag[0].nextSibling.nodeType === 3 /*isText?*/)
                        jqAnchorTag[0].nextSibling.nodeValue = "";   // remove "&nbsp;" text
                    if (jqAnchorTag.prev().is('br'))
                        jqAnchorTag.prev().remove();   // remove <br>
                    if (jqAnchorTag.next().next().is('br'))
                        jqAnchorTag.next().next().remove();  // remove <br> that's after the subsequent embedded anchor.
                }
 
                jqAnchorTag.remove();
 
                continue;
            }
            else if (jqAnchorTag.hasClass("embed")) {    // e.g. Twitter URL
                continue;
            }
            else if (jqAnchorTag.prev().hasClass("embed")) {     // e.g. small button
                continue;
            }
        }
 
      	/*Bug fix: Occurs when opening image on same tab and returning. It will reparse URLs that
        have already been rendered */
      /*
      	if (jqAnchorTag.parent().hasClass("widget")) {
          print("Filtered out URL header")
        	cb();
          return;
        }
 
        if (jqAnchorTag.hasClass("embeddedImgAnchor")) {
          print("Filtered out embeddedImgAnchor")
        	cb();
          return;
        }
 
        if (jqAnchorTag.attr('href') == '#') {
          print("Filtered out toggles")
        	cb();
          return;
        }
 
        if (anchorURL.match(/(google\.com\/searchbyimage)|(iqdb\.org\/\?url)/)) {
          	print("Filtered out reverse image search links")
            cb();
            return;
        }
        */
 
        /*In addition, convert URL if needed*/
        anchorURL = standardizeURL(anchorURL);
        jqAnchorTag.attr("href", anchorURL);
        jqAnchorTag.html(anchorURL);        /*bug fix: needed as well with href*/
 
        if (getMediaTyping(anchorURL))
        {
            print("Filtered in " + anchorURL);
            jqAnchorTag.addClass("imgAnchor");
            jsMediaAnchorTags.push(jsAnchorTag);
        }
    }
 
    return jsMediaAnchorTags;
}
 
 
function standardizeURL(url) {
    var standardizeURL = ""
 
    var mediaTyping = getMediaTyping(url);
    if (mediaTyping != undefined && mediaTyping.subtype === "gifv")
    {
        standardizeURL = url.replace(/gifv$/i, "gif");
    }
    else
    {
        standardizeURL = url;
    }
 
    return standardizeURL;
}
 
 
function markSigAnchorTags(jsAnchorTags, jqPost) {
    var postHtml;
    var sigStrIdx;
 
    /*get index of sig separator*/
    if (legacySigDetection)
    {
        postHtml = jqPost.html();
        sigStrIdx = postHtml.indexOf("<br>---<br>");
    }
 
    /*For each anchor tag, addClass('withinSig') if below signature mark*/
    async.each(jsAnchorTags, function(jsAnchorTag, cb) {
        var jqAnchorTag = $(jsAnchorTag);
        var anchorURL = jqAnchorTag.attr('href');
        var anchorTagStrIdx;
 
        if (legacySigDetection)
            anchorTagStrIdx = postHtml.indexOf(anchorURL + "</a>", 0);
 
        /*if anchor is within of sig*/
        if (jqAnchorTag.closest(".sig_text").length ||                                       /*gfaqsdep*/
            legacySigDetection && sigStrIdx !== -1 && anchorTagStrIdx > sigStrIdx)
        {
            jqAnchorTag.addClass("withinSig");
        }
 
        cb();
    });
}
 
function removeSigAnchorTags(jsAnchorTags) {
    var nonSigAnchorTags = [];
 
    async.eachSeries(jsAnchorTags, function(jsAnchorTag, cb) {
        if (!$(jsAnchorTag).hasClass("withinSig"))
            nonSigAnchorTags.push(jsAnchorTag);
        cb();
    });
 
    return nonSigAnchorTags;
}
 
 
/*Merge all media anchor tags from all posts into a single array*/
//async.eachSeries(jsPosts, function(jsPost, cb) {
//    imgAnchorTags = $.merge(imgAnchorTags, jsPost.jsMediaAnchorTags);
//    cb();
//});
imgAnchorTags = []
for (const jsPost of jsPosts) {
   for (const jsTag of jsPost.jsMediaAnchorTags)
       imgAnchorTags.push(jsTag)
}
 
/*For each valid image URL anchor tag, replace with template div for embedded image template*/
var embeddedImgContainers = [];
for (let [imgAnchorIdx, imgAnchor] of imgAnchorTags.entries())
{
    imgAnchor = $(imgAnchor);
    const imgURL = imgAnchor.html();
    const mediaTyping = getMediaTyping(imgURL);
    const imgWithinSig_class = imgAnchor.hasClass("withinSig") ? "withinSig" : "";
    const imgIsHidable_class = allowImgInSig && imgAnchor.hasClass("withinSig") && !hideSigsWhenHideMode ? "" : "isHidable";
    const imgInitiallyBlacklisted_class = "";
    const imgSpoilersTagged_class = imgAnchor.closest("s").length > 0 ? "spoilersTagged" : "";
    var postID;
    var isBlacklisted;
    var imgContainerStyle_attr;

    print("Creating container for " + imgURL);
 
    isBlacklisted = isURLinBlacklist(imgURL, blacklist);
    if (isBlacklisted)
        imgInitiallyBlacklisted_class = "initiallyBlacklisted";
 
    imgContainerStyle_attr = imgContainerStyle;
    if (imgContainerStyle_attr === "sideBySideSig")
    {
        if (imgWithinSig_class === "withinSig")
            imgContainerStyle_attr = "sideBySide";
        else
            imgContainerStyle_attr = "stacked";
    }
 
    if (pageType === "topic")
    {
        postID = imgAnchor[0].postID;
    }
    else    /*if in post preview mode, need to provide missing message ID*/
    {
        imgAnchor.closest("td").addClass("msg_body");                   /*gfaqsdep*/
        imgAnchor.closest(".msg_body").attr("name", 0);                 /*gfaqsdep*/
        postID = 0;
    }
 
    imgAnchor.replaceWith(
        "<div class='embeddedImgContainer "+imgWithinSig_class+" "+imgIsHidable_class+" "+imgInitiallyBlacklisted_class+
        " "+imgSpoilersTagged_class+"' data-postID='"+postID+"' data-style='"+imgContainerStyle_attr+"' data-idx='"+imgAnchorIdx+"'>" +
            "<a class='embeddedImgAnchor' href='" + imgURL + "' data-backup-href='" + imgURL + "'>" +
            "</a>" +
        "</div>"
    );
 
    let embeddedImgContainer = $(".embeddedImgContainer[data-idx='"+imgAnchorIdx+"']");
    embeddedImgContainers.push( embeddedImgContainer );
 
    if (imgContainerStyle_attr == "stacked")
        addDefaultWidgets(embeddedImgContainer);
 
    print("Finished creating container for " + imgURL);
}
 
 
function getPredefinedWidgetStr(widgetClassStr, postID /*only for hideButtons*/)
{
    if (widgetClassStr == "closeMediaButton")
    {
        return "<a class='closeMediaButton widget' target='_blank' href='#' title=''>"+
                    "[Close Media]"+
               "</a>";
    }
    else if (widgetClassStr == "showButton")
    {
      return "<a class='imgHideToggle widget' href='#' title='Show image'>show</a>";
    }
    else if (widgetClassStr == "hideButtons")
    {
      return "<a class='imgHideAll widget' href='#' style='margin-right: 5px' title='Hide all images in page'>--</a>" +
        "<a class='imgHidePost widget' href='#' style='margin-right: 5px' data-postID='"+postID+"' title='Hide all images in post'>-</a>" +
        "<a class='imgShowPost widget' href='#' style='margin-right: 5px' data-postID='"+postID+"' title='Show all images in post'>+</a>" +
        "<a class='imgShowAll widget' href='#' title='Show all images in page'>++</a>";
    }
    else if (widgetClassStr == "whitelistButton")
    {
      return "<a class='imgBlacklistToggle widget' href='#' title='Whitelist image'>whitelist</a>";
    }
}
 
function addDefaultWidgets(container)
{
    let embeddedImgContainer;
    let imgURL = "";
    let postID;
    let isBlacklisted;
    let isSpoilersTagged;
    let isHidable;
 
    let imgWidgets = {
        URLSpan: "",
        resolutionSpan: "",
        filesizeSpan: "",
        googleReverse: "",
        IQDBreverse: "",
        blacklistToggle: "",
        resizeToggles: "",
        hideToggles: "",
        hideToggle: "",
    };
 
    if (container.hasClass("imgMenu"))
        embeddedImgContainer = getEmbeddedImgContainer(container);
    else
        embeddedImgContainer = container;
 
    imgURL = embeddedImgContainer.children(".embeddedImgAnchor").attr("href");
    postID = embeddedImgContainer.attr("data-postID");
    isBlacklisted = embeddedImgContainer.hasClass("blacklisted");
    isSpoilersTagged = embeddedImgContainer.hasClass("spoilersTagged");
    isHidable = embeddedImgContainer.hasClass("isHidable");
    isImgMenu = container.hasClass("imgMenu");
 
    print("Started addDefaultWidgets() for " + imgURL);
 
    imgWidgets.URLSpan =
        "<span class='imgURL widget'>" +
            "<a target='_blank' href="+imgURL+">"+imgURL+"</a>" +
        "</span>";
 
    imgWidgets.resolutionSpan =
        "<span class='imgResolution widget'>" +
            "" +
        "</span>";
 
    imgWidgets.filesizeSpan =
        "<span class='imgFilesize widget'>" +
            "" +
        "</span>";
 
    imgWidgets.googleReverse =
        "<a class='widget' target='_blank' title='Reverse image search on general images' href='https://www.google.com/searchbyimage?image_url="+imgURL+"'>" +
            "google" +
        "</a>";
 
    imgWidgets.IQDBreverse =
        "<a class='widget' target='_blank' title='Reverse image search on weeb images' href='http://iqdb.org/?url="+imgURL+"'>" +
            "iqdb" +
        "</a>";
 
    if (isBlacklisted)
    {
      alert('here');
        imgWidgets.blacklistToggle =
            getPredefinedWidgetStr("whitelistButton");
    }
    else
    {
        imgWidgets.blacklistToggle =
            "<a class='imgBlacklistToggle widget' href='#' title='Blacklist image'>blacklist</a>";
    }
 
    imgWidgets.resizeToggles =
        "<a class='imgCloseAll widget' href='#' style='margin-right: 5px' title='Close all images in page'>&lt;&lt;</a>" +
        "<a class='imgClosePost widget' href='#' style='margin-right: 5px' data-postID='"+postID+"' title='Close all images in post'>&lt;</a>" +
        "<a class='imgExpandPost widget' href='#' style='margin-right: 5px' data-postID='"+postID+"' title='Expand all images in post'>&gt;</a>" +
        "<a class='imgExpandAll widget' href='#' title='Expand all images in page'>&gt;&gt;</a>";
 
    imgWidgets.hideToggles =
        getPredefinedWidgetStr("hideButtons", postID);
 
    /*
    Bug fix: Added !isImgMenu in condition. Otherwise, when revealing a hidden
    spoilered side-by-side image for the first time, its hideToggle widget will
    mistakenly be set to "Show" instead of "Hide"
    */
    if (!isImgMenu && (isBlacklisted || isSpoilersTagged || (isHideMode && isHidable)))
    {
        imgWidgets.hideToggle =
            getPredefinedWidgetStr("showButton");
    }
    else
    {
        imgWidgets.hideToggle =
            "<a class='imgHideToggle widget' href='#' title='Hide image'>hide</a>";
    }
 
    print("Built widget strings in addDefaultWidgets() for " + imgURL);
 
    async.eachOfSeries(imgWidgets, function(widget, widgetName, cb){
 
        /*Bug fix: If 'hide toggle' widget disabled, then there's no way to reveal
        a spoilered image. So, always add 'hide toggle' for spoilered images.*/
        if (isShow[widgetName] || (widgetName == "hideToggle" && isSpoilersTagged))
        {
            //console.log("Adding widget (\""+widgetName+"\") string (\""+widget+"\") in addDefaultWidgets() for " + imgURL);
            setWidget(widget, container);
        }
        cb();
    });
}
 
function setWidget(widgetStr, container, removeClassStr)
{
    let widget;
    let widgets;
 
    /*If adding first widget*/
    if (!removeClassStr && container.children(".widgets").length == 0)
    {
        container.prepend("<div class='widgets'></div>");
    }
    widgets = container.children(".widgets");
 
    if (container.hasClass("embeddedImgContainer"))
    {
        if (removeClassStr)
        {
            widgets.find("." + removeClassStr).remove();
        }
        else
        {
            widgets.append(widgetStr);
 
            /*add leading whitespace to new widget*/
            widget = widgets.children(':last');
            widget.css('margin-right', '5px');
        }
    }
    else if (container.hasClass("imgMenu"))
    {
        if (removeClassStr)
        {
            widgets.find("." + removeClassStr).closest(".imgMenuItem").remove();
        }
        else
        {
            widgetStr = "<div class='imgMenuItem'>" +
                            widgetStr +
                        "</div>";
            widgets.append(widgetStr);
        }
    }
    else
    {
 
    }
 
    /*If removed last widget*/
    if (removeClassStr && widgets.children().length == 0)
    {
        widgets.remove();
    }
}
 
function getWidget(classStr, container)
{
    var widgets = container.children(".widgets");
    return widgets.find("." + classStr);
}
 
function hasWidget(classStr, container)
{
    return container.find(".widgets").find("."+classStr).length > 0;
}
 
function getEmbeddedImgContainer(obj)
{
    var embeddedImgContainer = obj.closest(".embeddedImgContainer");
    if (embeddedImgContainer.length == 0)
    {
        var imgAnchor = getImageAnchorOfImgMenu();
        embeddedImgContainer = imgAnchor.closest(".embeddedImgContainer");
    }
 
    return embeddedImgContainer;
}
 
 
 
/*Optimize positioning of media*/
async.eachSeries(embeddedImgContainers, function(embeddedImgContainer, cb) {
 
    print("Started optimizing media position for " + getMediaURL(embeddedImgContainer));
 
    var imgContainerStyle_attr = embeddedImgContainer.attr('data-style');
 
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
 
    /*at this point, we have two non-whitespace elements surrounding the embeddedImgContainer*/
 
    /*remove the next br elements if next non-whitespace sibling is a going-to-be image*/
 
    var curNextEle;
    if (curNextEleJS !== null && $(curNextEleJS).hasClass("embeddedImgContainer"))
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
    /*if sig separator after image, remove <br> in between*/  /*gfaqsdeplegacy - no br anymore*/
    else if (curNextEleJS !== null && curNextEleJS.nodeType === 3 && curNextEleJS.nodeValue === "---")
    {
        curNextEle = embeddedImgContainer.next();
        if (curNextEle.is("br"))
            curNextEle.remove();
    }
    /*if text after image*/                                   /*gfaqsdeplegacy - no br anymore*/
    else if (curNextEleJS !== null && curNextEleJS.nodeType === 3 && curNextEleJS.nodeValue !== "---")
    {
        curNextEle = embeddedImgContainer.next();
        if (curNextEle.is("br"))
            curNextEle.remove();
    }
 
    if (imgContainerStyle_attr === "sideBySide")
    {
        /*if the next non-whitespace sibling not going to be an image, create a newline to
        set the cursor below this image*/
        if (curNextEleJS !== null && !$(curNextEleJS).hasClass("embeddedImgContainer"))
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
 
    print("Finished optimizing media position for " + getMediaURL(embeddedImgContainer));
 
    cb();
});
 
 
/*for each template div, insert an embedded image*/
async.each(embeddedImgContainers, function(embeddedImgContainer, cb) {
 
    if (isHideMode)
    {
        if (embeddedImgContainer.hasClass("isHidable"))
            hideMedia(embeddedImgContainer, false);
        else
            loadMedia(embeddedImgContainer, false);
    }
    else
    {
        var isBlacklisted = embeddedImgContainer.hasClass("initiallyBlacklisted");
        var isSpoilersTagged = embeddedImgContainer.hasClass("spoilersTagged");
 
        if (isBlacklisted)
            hideMedia(embeddedImgContainer, true);
        else if (isSpoilersTagged)
            hideMedia(embeddedImgContainer, false);
        else
            loadMedia(embeddedImgContainer, false);
    }
 
    cb();
});
 
 
function getMediaSize(media, span)
{
    var url = getEmbeddedImgContainer(media).find(".embeddedImgAnchor").attr('href');
 
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
 
function getMediaResolution(media, span)
{
    if (span.length == 0)
        return;
 
    var mediaTyping = getMediaTyping(media);
 
    if (mediaTyping.type == "video")
    {
        /*when video's metadata has been loaded, record its natural width and resolution*/
        media[0].onloadedmetadata = function() {
            var video = this;
            span.html("(" + video.videoWidth + "x" + video.videoHeight + ")");
        };
 
        /*If video already loaded*/
        if (media[0].videoWidth !== 0)
            span.html("(" + media[0].videoWidth + "x" + media[0].videoHeight + ")");
    }
    else if (mediaTyping.type == "image")
    {
        media.load(function() {
            span.html("(" + media[0].naturalWidth + "x" + media[0].naturalHeight + ")");
        });
 
        /*if image already loaded*/
        if (media[0].naturalWidth !== 0)
        {
            span.html("(" + media[0].naturalWidth + "x" + media[0].naturalHeight + ")");
        }
    }
}
 
function showMedia(mediaContainer, isToWhitelist)
{
    var mediaAnchor = mediaContainer.children(".embeddedImgAnchor");
    var mediaURL = mediaAnchor.attr("data-backup-href");
    var mediaContainerStyle = mediaContainer.attr("data-style");
    var isSpoilersTagged = mediaContainer.hasClass("spoilersTagged");
 
    if (!mediaContainer.hasClass("loaded"))
        loadMedia(mediaContainer);
 
    mediaContainer.removeClass("hiddenx");
 
    if (isToWhitelist)
    {
        /*remove url from blacklist*/
        var urlIdx = blacklist.indexOf(mediaURL);
        if (urlIdx > -1)
        {
            blacklist.splice(urlIdx, 1);
        }
 
        mediaAnchor.removeClass("blacklisted");
 
        if (mediaContainerStyle === "stacked" && isShow.blacklistToggle)
        {
            var imgBlacklistToggle = getWidget("imgBlacklistToggle", mediaContainer);
            imgBlacklistToggle.html("blacklist");
            imgBlacklistToggle.attr("title", "Blacklist image");
        }
 
        settings.blacklistStr = blacklist.join("\n");
        localStorage.setItem("imagefaqs", JSON.stringify(settings));
    }
 
    mediaAnchor.show();
 
    if (mediaContainerStyle === "sideBySide")
    {
        mediaAnchor.siblings("a.imgMenuItem").remove();
        mediaAnchor.siblings("div.imgMenuItem").remove();
 
        mediaAnchor.attr("style", "");
        mediaAnchor.parent().css("max-width", "");
    }
    else
    {
        /*Bug fix: Spoilered images must have hideToggle regardless.*/
        if (isShow.hideToggle || isSpoilersTagged)
        {
            var imgHideToggle = getWidget("imgHideToggle", mediaContainer);
 
            imgHideToggle.html("hide");
            imgHideToggle.attr("title", "Hide image");
        }
    }
}
 
 
 
function hideMedia(mediaContainer, isToBlacklist)
{
    var mediaAnchor = mediaContainer.children(".embeddedImgAnchor");
    var media = mediaAnchor.children(".embeddedImg");
    var mediaURL = mediaAnchor.attr("data-backup-href");
    var postID = mediaContainer.attr("data-postID");
    var mediaContainerStyle = mediaContainer.attr("data-style");
    var isSig = mediaContainer.hasClass("withinSig");
    var isSpoilersTagged = mediaContainer.hasClass("spoilersTagged");
    var mediaThumbnailImgWidth = isSig ? thumbnailImgWidthSig : thumbnailImgWidth;
    var mediaThumbnailImgHeight = isSig ? thumbnailImgHeightSig : thumbnailImgHeight;
    var mediaThumbnailImgWidth_css = mediaThumbnailImgWidth === 0 ? "" : mediaThumbnailImgWidth+"px";
    var mediaThumbnailImgHeight_css = mediaThumbnailImgHeight === 0 ? "" : mediaThumbnailImgHeight+"px";
 
    print("Started hideMedia() for " + mediaURL);
 
    /*shrink image*/
    if (media.hasClass("expandedImg"))
        toggleSizesOfImages(media, false);
 
    mediaContainer.addClass("hiddenx");
    mediaAnchor.hide();
 
    print("Hidden mediaAnchor in hideMedia() for " + mediaURL);
 
    if (isToBlacklist)
    {
        mediaAnchor.addClass("blacklisted");
 
        if (blacklist.indexOf(mediaURL) === -1)
            blacklist.push(mediaURL);
 
        var imgBlacklistToggle = getWidget("imgBlacklistToggle", mediaContainer);
        imgBlacklistToggle.html("blacklist");
        imgBlacklistToggle.attr("title", "Blacklist image");
 
        settings.blacklistStr = blacklist.join("\n");
        localStorage.setItem("imagefaqs", JSON.stringify(settings));
    }
 
    if (mediaContainerStyle === "sideBySide")
    {
        mediaContainer.css("max-width", mediaThumbnailImgWidth_css);
 
        if (isShow.URLSpan)
        {
          mediaContainer.append("<a target='_blank' class='imgMenuItem' href="+mediaURL+">"+mediaURL+"</a>");
          widget = mediaContainer.children(':last');
          widget.css('margin-right', '5px');
          widget.css('display', 'inline');
        }
 
        if (mediaAnchor.hasClass("blacklisted"))
        {
            if (isShow.blacklistToggle)
            {
                mediaContainer.append(
                    "<div class='imgMenuItem'>" +
                      getPredefinedWidgetStr("whitelistButton") +
                    "</div>"
                );
 
                /*add leading whitespace to new widget*/
                widget = mediaContainer.children(':last');
                widget.css('margin-right', '5px');
                widget.css('display', 'inline');
            }
        }
 
        if (isShow.hideAllToggle)
        {
            mediaContainer.append(
                "<div class='imgMenuItem'>" +
                  getPredefinedWidgetStr("hideButtons", postID) +
                "</div>"
            );
 
            /*add leading whitespace to new widget*/
            widget = mediaContainer.children(':last');
            widget.css('margin-right', '5px');
            widget.css('display', 'inline');
        }
 
        /*Bug fix: Hidden images must always have show button.*/
        mediaContainer.append(
            "<div class='imgMenuItem'>" +
              getPredefinedWidgetStr("showButton") +
            "</div>"
        );
 
        /*add leading whitespace to new widget*/
        widget = mediaContainer.children(':last');
        widget.css('margin-right', '5px');
        widget.css('display', 'inline');
 
        /*remove leading whitespace to last widget*/
        widget = mediaContainer.children(':last');
        widget.css('margin-right', '');
 
        hideImgMenu();
    }
    else    /* stacked */
    {
        if (isShow.blacklistToggle && isToBlacklist)
        {
            var imgBlacklistToggle = getWidget("imgBlacklistToggle", mediaContainer);
            imgBlacklistToggle.html("whitelist");
            imgBlacklistToggle.attr("title", "Whitelist image");
        }
    }
 
    if (mediaContainerStyle === "sideBySide")
    {
 
    }
    else
    {
        /*Bug fix: Spoilered images must have hideToggle regardless.*/
        if (isShow.hideToggle || isSpoilersTagged)
        {
            var imgHideToggle = getWidget("imgHideToggle", mediaContainer);
 
            imgHideToggle.html("show");
            imgHideToggle.attr("title", "Show image");
        }
    }
}
 
 
 
 
function loadMedia(mediaContainer)
{
    print("Started loadMedia() for " + getMediaURL(mediaContainer));
 
    getMediaRemoteInfo(mediaContainer, function(mediaInfo) {
        print("Started callback for getMediaRemoteInfo() for " + getMediaURL(mediaContainer));
 
        if (mediaInfo == undefined)
            return;
 
        updateEmbeddedImgContainer(mediaContainer, mediaInfo);
        _loadMedia(mediaContainer);
    });
}
 
function _loadMedia(mediaContainer, mediaInfo)
{
    const mediaAnchor = mediaContainer.children(".embeddedImgAnchor");
    const mediaURL = mediaAnchor.attr("href");
    const mediaTyping = getMediaTyping(mediaURL);
    const mediaResolutionSpan = getWidget("imgResolution", mediaContainer);
    const mediaFilesizeSpan = getWidget("imgFilesize", mediaContainer);
    const mediaIdx = mediaContainer.attr("data-idx");
    const isSig = mediaContainer.hasClass("withinSig");
    const mediaThumbnailImgWidth = isSig ? thumbnailImgWidthSig : thumbnailImgWidth;
    const mediaThumbnailImgHeight = isSig ? thumbnailImgHeightSig : thumbnailImgHeight;
    const mediaThumbnailImgWidth_css = mediaThumbnailImgWidth === 0 ? "" : mediaThumbnailImgWidth+"px";
    const mediaThumbnailImgHeight_css = mediaThumbnailImgHeight === 0 ? "" : mediaThumbnailImgHeight+"px";
 
    print("Started _loadMedia() for " + mediaURL);
 
    var mediaStr = "";
    var media;
 
    mediaStr = createEmbeddedMediaStr({src: mediaURL});
    mediaAnchor.html(mediaStr);
    media = mediaAnchor.find(".embeddedImg");
	bypassHotlink(media);
 
    const styles = {
        "max-width": getOptimalImgMaxWidth_css(media, mediaThumbnailImgWidth),
        "max-height": mediaThumbnailImgHeight_css,
    };
    addStyling(media, styles);
    addEvents(media);
    media.attr("display", "");
 
    if (mediaResolutionSpan.length > 0)
         getMediaResolution(media, mediaResolutionSpan);
 
    if (mediaFilesizeSpan.length > 0)
        getMediaSize(media, mediaFilesizeSpan);
 
    if (mediaContainer.hasClass("withinSig"))
        mediaContainer.find(".embeddedImg").addClass("withinSig");
 
    if (mediaTyping.type == "video" && loopThumbnailVideo)
    {
        media.prop('muted', true);      // Must be done before play() according to chrome 66 auto-play policy
        media[0].play();
        media.prop("loop", true);
    }
 
    mediaContainer.addClass("loaded");
 
    print("Finished _loadMedia() for " + mediaURL);
}
 
function bypassHotlink(media) {
 
	media.prop('referrerPolicy', 'no-referrer');
 
	if (media.is('img')) {
		media.attr('src', media.attr('data-src'));
	}
	else {
		var videoSource = media.find('source');
		videoSource.attr('src', videoSource.attr('data-src'));
	}
}
 
/*
Get an embeddable media element.
 
Param:
    properties [obj] =
        .src = [string]
        .isFloatingImg = (bool)
*/
function createEmbeddedMediaStr(properties) {
    var mediaStr = "";
    const mediaTyping = getMediaTyping(properties.src);
    const src = properties.src;
    var mediaClassStr = "";
 
    if (properties.isFloatingImg === true)
        mediaClassStr = "floatingImg";
    else
        mediaClassStr = "embeddedImg thumbnailImg";
 
    // const imgurMatch = src.match(/imgur\.com\/(\w+)\.mp4/);  // gfaqsdep
    // if (imgurMatch) {
    //     const imgurId = imgurMatch[1];
    //     mediaStr = `<blockquote class="imgur-embed-pub" lang="en" data-id="${imgurId}"><a href="https://imgur.com/${imgurId}">View post on imgur.com</a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>`;
    // }
    if (mediaTyping.type == "image")
    {
        mediaStr = "<img class='"+mediaClassStr+"' alt='' display='none' data-src='"+properties.src+"'></img>";
    }
    else if (mediaTyping.type == "video")
    {
        mediaStr = "<video class='"+mediaClassStr+"' display='none' style=''>"+
                        "<source data-src='"+properties.src+"' type='video/"+mediaTyping.subtype+"'>" +
                   "</video>";
    }
 
    return mediaStr;
}
 
function getMediaRemoteInfo(mediaContainer, cb)
{
    var mediaInfo = {};
 
    var url = mediaContainer.find(".embeddedImgAnchor").attr("href");
    var mediaTyping = getMediaTyping(url);
 
    print("Started getMediaRemoteInfo() for " + url);
 
    /*If gfycat url*/
    if (mediaTyping != undefined && mediaTyping.type == "iframe" && mediaTyping.subtype == "gfycat")
    {
        url = url.match(/\w+$/)[0];
        url = "https://api.gfycat.com/v1/gfycats/" + url;
 
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const rawInfo = JSON.parse(response.responseText);
                if (rawInfo.error)
                {
                    errorEvent(mediaContainer);
                    cb(undefined)
                }
                else
                {
                    mediaInfo.url = rawInfo.gfyItem.webmUrl;
                    cb(mediaInfo);
                }
            },
            onerror: function(response) {
                errorEvent(mediaContainer);
                cb(undefined)
            }
        });
    }
    /*If imgur url*/
    else if (mediaTyping != undefined && mediaTyping.type == "iframe" && mediaTyping.subtype == "imgur")
    {
        const match = url.match(/https?:\/\/(?:.\.)?imgur\.com\/(a\/)?(\w+)$/);
        const isAlbum = url.match(/imgur\.com\/a\/\w+/);  // Workaround for firefox
        const imgurId = match[match.length-1];
 
        const requestUrl = (isAlbum) ? 
            `https://api.imgur.com/3/album/${imgurId}/images`
            :
            `https://api.imgur.com/3/image/${imgurId}`;

        GM.xmlHttpRequest({
            method: "GET",
            url: requestUrl,
            headers: {'Authorization': "Client-ID 05793c686154d2a"},
            onload: async function(response) {
                if (response.status !== 200) 
                {
                    errorEvent(mediaContainer, "Imgur API Key to resolve non-direct link is currently over-capacity.");
                    cb(undefined)  
                    return;
                }
 
                const rawInfo = JSON.parse(response.responseText);
                if (rawInfo.error)
                {
                    errorEvent(mediaContainer);
                    cb(undefined)
                } 
                else if (!rawInfo.success) 
                {
                    errorEvent(mediaContainer, rawInfo.data.error);
                    cb(undefined)
                }
                else
                {
                    if (isAlbum) {
                        mediaInfo.url = rawInfo.data[0].link;
                    } else {
                        mediaInfo.url = rawInfo.data.link;
                    }

                    cb(mediaInfo);
                }
            },
            onerror: function(response) {
                errorEvent(mediaContainer);
                cb(undefined)
            }
        });
    }
    else if (mediaTyping != undefined && mediaTyping.type == "iframe" && mediaTyping.subtype == "imgtc")
    {
        let requestUrl =  url;
 
        GM.xmlHttpRequest({
            method: "GET",
            url: requestUrl,
            headers: {"origin": currentURL},
            onload: function(response) {
                var rawInfo = response.responseText;
                if (rawInfo.error)
                {
                    errorEvent(mediaContainer);
                    cb(undefined)
                }
                else
                {
                  /*
                  <html style="background-color: #212121; float: center;">
                  <center><video controls autoplay muted loop><source src="u2KmIOe.webm" type="video/webm"></video></center>
                  </html>
                  */
 
                  let type = (rawInfo.match(/video\/webm/)) ? 'webm' :
                             (rawInfo.match(/video\/mp4/)) ? 'mp4' :
                             'gif';
 
                  mediaInfo.url = url.replace(/gifm$/i, type);
                  cb(mediaInfo);
                }
            },
            onerror: function(response) {
                errorEvent(mediaContainer);
                cb(undefined)
            }
        });
    }
    else
    {
        cb(mediaInfo);
    }
}
 
function updateEmbeddedImgContainer(mediaContainer, mediaInfo)
{
    if (mediaInfo.url)
    {
        print("Started updateEmbeddedImgContainer() for " + mediaInfo.url);
 
        var mediaAnchor = mediaContainer.find(".embeddedImgAnchor");
        mediaAnchor.attr("href", mediaInfo.url);
        mediaAnchor.attr("data-backup-href", mediaInfo.url);
    }
}
 
 
function addEvents(media) {
    var mediaTyping = getMediaTyping(media);
 
    if (media.hasClass("embeddedImg") && mediaTyping.type == "image")
    {
        media.error(function() {
            errorEvent(media);
        });
    }
    else if (media.hasClass("embeddedImg") && mediaTyping.type == "video")
    {
        /*Assigning events to videos via jquery doesn't work*/
        media[0].addEventListener('error', function(event) {
            errorEvent(media);
        }, true);
    }
}
 
/*
Handle case where media cannot be loaded.
 
Param:
    media :: embeddedImg or embeddedImgContainer
*/
function errorEvent(media, errMsg="Media cannot be loaded")
{
    var embeddedImgContainer = getEmbeddedImgContainer(media);
    var embeddedImgAnchor = embeddedImgContainer.find(".embeddedImgAnchor");
    var mediaResolutionSpan = getWidget("imgResolution", embeddedImgContainer);
    var mediaFilesizeSpan = getWidget("imgFilesize", embeddedImgContainer);
 
    embeddedImgAnchor.html(errMsg);
    mediaResolutionSpan.html("");
    mediaFilesizeSpan.html("");
}
 
 
function addStyling(media, styles) {
    var mediaTyping = getMediaTyping(media);
 
    if (media.hasClass("embeddedImg") && mediaTyping.type.match(/video|image|iframe/i))
    {
        media.css(styles);
    }
    else if (media.hasClass("floatingImg"))
    {
        styles["position"] = "absolute";
        styles["z-index"] = 100;
        media.css(styles);
    }
}
 
 
 
 
/*
Get the natural width of an embedded image.
 
@image :: jQuery object with the class "embeddedImg"
*/
function getNatWidthOfEmbeddedImg(image)
{
    var mediaTyping = getMediaTyping(image);
 
    if (mediaTyping.type == "video")
    {
        return image[0].videoWidth;
    }
    else if (mediaTyping.type == "image")
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
    var mediaTyping = getMediaTyping(image);
 
    if (mediaTyping.type == "video")
    {
        return image[0].videoHeight;
    }
    else if (mediaTyping.type == "image")
    {
        return image[0].naturalHeight;
    }
}
 
 
 
var isShowSome;
async.some(isShow, function(val, cb){
    cb(null, val);
}, function results(err, results) {
    isShowSome = results;
});
 
if (isShowSome)
{
    $("body").append(
        "<div class='imgMenuButton' style='display: none'>" +
            "<div class='imgMenuButton_symbol'>" +
                "+" +
            "</div>" +
        "</div>"
    );
}
 
var imgMenuButton = $("body div.imgMenuButton");
 
 
/*
Show a transparent button in the top-right corner of a thumbnail image.
 
@param thumbnail :: embedded thumbnail image
@param isAppear :: true if the button should appear
*/
function showImgMenuButton(thumbnail, isAppear)
{
    if (imgMenuButton.length == 0)
        return false;
 
    if (isAppear)
    {
        if (imgMenu !== null &&
            getEmbeddedImgContainer(thumbnail).attr("data-idx") === imgMenu.attr("data-idx"))
        {
            imgMenuButton.children().html("-");
        }
        else
        {
            imgMenuButton.children().html("+");
        }
 
        imgMenuButton.css("display", "table");
        imgMenuButton.css("left", (thumbnail.offset().left + thumbnail.width() - 18) + "px");
        imgMenuButton.css("top", thumbnail.offset().top - 1 + "px");
        imgMenuButton.css("width", imgMenuButton.height());
    }
    else
    {
        imgMenuButton.css("display", "none");
    }
}
 
function isHoverOverImgMenuButton(event)
{
    if (imgMenuButton.length == 0)
        return false;
 
    var isCursorInButton =
        imgMenuButton.css("display") === "table" &&
        isHovered(imgMenuButton, event);
 
   return isCursorInButton;
}
 
 
 
 
 
var imgMenu = null;		// can be undefined instead of null
function showImgMenu(image)
{
    if (imgMenu != null) {		// check both null and undefined
      imgMenu.remove();
    }
 
    var idx = getEmbeddedImgContainer(image).attr('data-idx');
 
    imgMenu = $("<div class='imgMenu' data-idx='"+idx+"' style='display: none; position: absolute; z-index: 90;'>" +
        "</div>").appendTo($("body"));
 
    addDefaultWidgets(imgMenu);
 
    /*Handle filesize, resolution, and displaying imgMenu*/
 
    var imgFilesizeSpan = getWidget("imgFilesize", imgMenu);
    var imgResolutionSpan = getWidget("imgResolution", imgMenu);
 
    var imgURL = image.parent().attr("data-backup-href");
 
  	if (isShow['filesizeSpan'])
    	getMediaSize(image, imgFilesizeSpan);
 
  	if (isShow['resolutionSpan'])
    	getMediaResolution(image, imgResolutionSpan);
 
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
    if (imgMenu !== undefined && imgMenu !== null)
    {
        imgMenu.remove();
        imgMenu = null;
    }
}
 
function getImageAnchorOfImgMenu()
{
    var imgIdx = $("body > .imgMenu").attr("data-idx");
 
    return $(".embeddedImgContainer[data-idx='"+imgIdx+"']").find(".embeddedImgAnchor");
}
 
function isHovered(jQueryObj, event)
{
    //return !!$(jQueryObj).filter(function() { return $(this).is(":hover"); }).length;
 
    return (
        event.pageX > jQueryObj.offset().left &&
        event.pageX < jQueryObj.offset().left + jQueryObj.width() &&
        event.pageY > jQueryObj.offset().top &&
        event.pageY < jQueryObj.offset().top + jQueryObj.height()
    );
}
 
function getHoveredThumbnail(event)
{
    var hoveredMedia = undefined;
 
    async.each(embeddedImgContainers, function(embeddedImgContainer, cb) {
        var media = embeddedImgContainer.find(".embeddedImg.thumbnailImg");
 
        if (media.length > 0 && isHovered(media, event))
        {
            hoveredMedia = media;
        }
 
        cb();
    });
 
    return hoveredMedia;
}
 
 
 
$(document).on("click", function(event) {
 
    if (imgMenu)
    {
        var widgets = imgMenu.find(".widget");
        widgets = $.makeArray(widgets);
 
        var isHoveredSomeWidget = false;
        async.some(widgets, function(widget, cb){
            cb(null, isHovered($(widget), event));
        }, function results(err, result){
            isHoveredSomeWidget = result;
        });
 
        var isHoveredImgMenu = isHovered(imgMenu, event);
 
        if (! isHoveredImgMenu || isHoveredSomeWidget) {
          	hideImgMenu();
        }
    }
});
 
 
 
function handleFloatingImage(event)
{
    if (!enable_floatingImg)
        return;
 
    const floatingImgCSS = {
        "left": undefined,
        "top": undefined,
        "max-width": undefined,
        "max-height": undefined,
    };
 
    /*if user is hovering over thumbnail*/
    if (currentHoveredThumbnail !== null)
    {
        /*calculate floating image size and position*/
        floatingImgCSS["max-width"] = parseInt(getNatWidthOfEmbeddedImg(currentHoveredThumbnail));
 
        floatingImgCSS["left"] = event.pageX + floatingImgRightOffset;
 
        /*if right of image exceeds beyond right of window, restrict max width*/
        if (floatingImgCSS["left"] + floatingImgCSS["max-width"] > $(window).scrollLeft() + $(window).width() - floatingImgBorder)
        {
            floatingImgCSS["max-width"] = $(window).scrollLeft() + $(window).width() - floatingImgBorder - floatingImgCSS["left"];
        }
 
        if (floatingImgCSS["max-width"] < 0)
            floatingImgCSS["max-width"] = 0;
 
        floatingImgCSS["max-height"] = Math.round(getNatHeightOfEmbeddedImg(currentHoveredThumbnail) * (floatingImgCSS["max-width"] / getNatWidthOfEmbeddedImg(currentHoveredThumbnail)));
 
        floatingImgCSS["top"] = event.pageY - (floatingImgCSS["max-height"] / 2);
 
        /*if bottom of image exceeds beyond the window, shift top upwards*/
        if (floatingImgCSS["top"] + floatingImgCSS["max-height"] > $(window).scrollTop() + $(window).height() - floatingImgBorder)
        {
            floatingImgCSS["top"] = $(window).scrollTop() + $(window).height() - floatingImgBorder - floatingImgCSS["max-height"];
        }
 
        /*if top of image expands beyond top of window, lower top of image*/
        if (floatingImgCSS["top"] < $(window).scrollTop() + floatingImgBorder)
        {
            floatingImgCSS["top"] = $(window).scrollTop() + floatingImgBorder;
        }
 
        /*if bottom of image exceeds beyond the window, restrict max height*/
        if (floatingImgCSS["top"] + floatingImgCSS["max-height"] > $(window).scrollTop() + $(window).height() - floatingImgBorder)
        {
            floatingImgCSS["max-height"] = $(window).scrollTop() + $(window).height() - floatingImgBorder - floatingImgCSS["top"];
        }
 
        async.eachOf(floatingImgCSS, function(val, key, cb) {
            floatingImgCSS[key] = floatingImgCSS[key] + "px";
            cb();
        });
 
        /* If floating image and current hovered thumbnail isn't the same,
           cut off previous reference to indicate a new floating image
        */
        if (curFloatingImg !== null &&
            getMediaURL(curFloatingImg) != getMediaURL(currentHoveredThumbnail))
        {
            showImgMenuButton(null, false);
            curFloatingImg.remove();
            curFloatingImg = null;
        }
 
        /*if floating image doesn't exist or doesn't have an image yet...*/
        if (curFloatingImg === null)
        {
            const mediaTyping = getMediaTyping(currentHoveredThumbnail);
            const mediaURL = getMediaURL(currentHoveredThumbnail);
            const mediaStr = createEmbeddedMediaStr({src: mediaURL, isFloatingImg: true});
 
            /*create the floating image element*/
            $("body").append(mediaStr);
            curFloatingImg = $("body").children(".floatingImg");
			bypassHotlink(curFloatingImg);
 
            /*bug fix: need to be refreshed if curFloatingImg outdated*/
            curFloatingImg.embeddedImgRef = currentHoveredThumbnail;
 
            /*if webm video*/
            if (mediaTyping.type == "video")
            {
                curFloatingImg[0].play();
                curFloatingImg.prop("loop", true);
                curFloatingImg.prop('muted', false);
            }
 
            if (getEmbeddedImgContainer(currentHoveredThumbnail).attr('data-style') == "sideBySide")
                showImgMenuButton(currentHoveredThumbnail, true);
        }
 
        addStyling(curFloatingImg, floatingImgCSS);
        curFloatingImg.attr("display", "");
    }
    /*if user is not hovering over thumbnail and floating image still exists*/
    else if (currentHoveredThumbnail === null && curFloatingImg !== null)
    {
        showImgMenuButton(null, false);
 
        curFloatingImg.remove();
        curFloatingImg = null;
    }
}
 
 
 
 
var curFloatingImg = null;
 
// For URL hover
var selectedContainer = null;
var isContinueWaitingForImageFromURLHover = false;
var savedEvent = null;
 
 
/*if cursor is hovering inside a thumbnail image, display expanded image as floating div
Also show a transparent button to expand the image menu (side-by-side image view only)
*/
$(document).on("mousemove", function(event) {
    handleFloatingImage(event);
});
 
 
 
 
/*if mouse hovers inside the image, show floating image*/
$(document).on("mouseover", ".embeddedImg", function(event){
    $("html").css("cursor", "pointer");
 
    isContinueWaitingForImageFromURLHover = false;
 
    if (! $(this).hasClass("expandedImg"))
    {
        currentHoveredThumbnail = $(event.target);
        handleFloatingImage(event);
    }
});
 
/*if mouse hovers outside the image, hide floating image*/
$(document).on("mouseout", ".embeddedImg", function(event){
    $("html").css("cursor", "default");
 
    isContinueWaitingForImageFromURLHover = false;
 
    currentHoveredThumbnail = null;
    handleFloatingImage(event);
});
 
 
 
// img ok but width undefined
 
function waitUntilCanShowFloatingImage() {
  if (!isContinueWaitingForImageFromURLHover) {
    return;
  }
 
  if (!selectedContainer.hasClass("loaded")) {
    setTimeout(waitUntilCanShowFloatingImage, 100);
    return;
  }
 
  const img = selectedContainer.find(".embeddedImg");
  const imgWidth = getNatWidthOfEmbeddedImg(img);
 
  if (img.length == 0 || imgWidth == 0) {
    setTimeout(waitUntilCanShowFloatingImage, 100);
  }
  else {
    isContinueWaitingForImageFromURLHover = false;
    selectedContainer = null;
    currentHoveredThumbnail = img;
    handleFloatingImage(savedEvent);
  }
}
 
 
 
/*if mouse hovers inside the image URL, show floating image*/
$(document).on("mouseover", ".imgURL", function(event){
    if (!enable_floatingImg_url)
  		return false;
 
    selectedContainer = getEmbeddedImgContainer($(this));
    const img = selectedContainer.find(".embeddedImg");
 
    if (img.length == 0) {
      showMedia(selectedContainer, false);
      hideMedia(selectedContainer, false);
    }
 
    isContinueWaitingForImageFromURLHover = true;
    savedEvent = event;
    setTimeout(waitUntilCanShowFloatingImage, 1);
});
 
/*if mouse hovers outside the image URL, restore cursor to default graphic*/
$(document).on("mouseout", ".imgURL.widget", function(event){
    if (!enable_floatingImg_url)
  		return false;
 
    isContinueWaitingForImageFromURLHover = false;
    currentHoveredThumbnail = null;
    handleFloatingImage(event);
});
 
 
 
 
 
/*if clicked on the image URL anchor that's surrounding the embedded image, prevent default
behaviour of anchor (e.g. don't click on hyperlink when expanding image), unless it's a middle click
 
FIREFOX: mouseup,mousedown rather than click is only recognized for middle click.
*/
$("body").on("mouseup mousedown click", ".embeddedImgAnchor", function(event){
 
    /*left-click*/
    if (event.which === 1)
    {
        event.preventDefault();
    }
    /*middle-click*/
    else if (event.which === 2)
    {
 
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
            event.stopImmediatePropagation();
          	event.preventDefault();
            showImgMenu($(this));
            return false;
        }
        else if (isHoverOverImgMenuButton(event) && imgMenu !== null)
        {
            /*if referring to same thumbnail*/
            if (imgMenu.attr("data-idx") === getEmbeddedImgContainer($(this)).attr("data-idx"))
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
 
        toggleEmbeddedImgSize($(this), false);
 
        const embeddedImgContainer = getEmbeddedImgContainer($(this));
 
        /*If shrunk image and still hovering over thumbnail*/
        if ($(this).hasClass("thumbnailImg"))
        {
            const hoveredThumbnail = getHoveredThumbnail(event);
            if (hoveredThumbnail)
            {
                if (getEmbeddedImgContainer(hoveredThumbnail).attr('data-style') == "sideBySide")
                {
                    showImgMenuButton(hoveredThumbnail, true);
                }
 
                currentHoveredThumbnail = hoveredThumbnail;
                handleFloatingImage(event);
            }
        }
 
        if (autoScrollWhenThumbnailClicked)
            $(window).scrollTop( embeddedImgContainer.offset().top );
 
        return false;
    }
});
 
 
 
 
 
 
/*
@param isAll :: true if your intention is to expand/shrink all images
*/
function toggleEmbeddedImgSize(embeddedImg, isAll)
{
    const embeddedImgContainer = embeddedImg.closest(".embeddedImgContainer");
    const embeddedImgAnchor = embeddedImg.closest(".embeddedImgAnchor");
    const isSig = embeddedImgContainer.hasClass("withinSig");
    const mediaTyping = getMediaTyping(embeddedImg);
    const thumbnailImgWidth_this = isSig ? thumbnailImgWidthSig : thumbnailImgWidth;
    const thumbnailImgHeight_this = isSig ? thumbnailImgHeightSig : thumbnailImgHeight;
    const thumbnailImgWidth_this_css = thumbnailImgWidth_this === 0 ? "" : thumbnailImgWidth_this+"px";
    const thumbnailImgHeight_this_css = thumbnailImgHeight_this === 0 ? "" : thumbnailImgHeight_this+"px";
 
    /*When resizing all media, don't affect sigs if set*/
    if (!includeSigWhenExpanding && embeddedImg.hasClass("withinSig") && isAll)
    {
        return;
    }
    else
    {
        embeddedImg.toggleClass("thumbnailImg expandedImg");
    }
 
    toggleMediaCloseButton(embeddedImgContainer);
 
    /*if going to expand image*/
    if (embeddedImg.hasClass("expandedImg"))
    {
        $("#floatingImg").remove();
 
        embeddedImg.css("max-width", getOptimalImgMaxWidth_css(embeddedImg, expandedImgWidth));
        embeddedImg.css("max-height", expandedImgHeight_css);
 
        /*if video file, start playing it*/
        if (mediaTyping.type == "video")
        {
            embeddedImg[0].play();
            embeddedImg.prop("controls", true);       /*add controls*/
            embeddedImg.prop('muted', false);       /*unmute*/
 
            if (loopExpandedVideo)
                embeddedImg.attr("loop", "");
 
            /* Prevent URL anchor from doing anything when expanded video is clicked on */
            /* See also: Below case and on.click for .embeddedImgAnchor */
            if (isFirefox)
              embeddedImgAnchor.removeAttr("href");
        }
    }
    else    /*if shrinking image back to thumbnail*/
    {
        embeddedImg.css("max-width", getOptimalImgMaxWidth_css(embeddedImg, thumbnailImgWidth_this));
        embeddedImg.css("max-height", thumbnailImgHeight_this_css);
 
        /*if video file, stop playing it unless specified otherwise*/
        if (mediaTyping.type == "video")
        {
            if (!loopThumbnailVideo)
                embeddedImg[0].pause();
 
            embeddedImg.prop("controls", false);
            embeddedImg.prop("muted", true);
 
            /* Restore URL anchor functionality */
            if (isFirefox) {
              const url = embeddedImgAnchor.attr("data-backup-href");
              embeddedImgAnchor.attr("href", url);
            }
        }
    }
 
    currentHoveredThumbnail = null;
    handleFloatingImage(null);
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
function getOptimalImgMaxWidth_css(embeddedImg, userDefinedWidthLimit)
{
    let rv;
    let optimalWidth;
    let toContainerWidth;
    let toWindowWidth;
 
    if (userDefinedWidthLimit === undefined)
        userDefinedWidthLimit = 0;
 
    toContainerWidth =
        embeddedImg.closest(".msg_body, blockquote").width();        /*gfaqsdep*/
 
    toWindowWidth =
        $(window).width() - embeddedImg.closest(".msg_body, blockquote").offset().left;     /*gfaqsdep*/
 
    if (toContainerWidth > toWindowWidth)
        optimalWidth = toWindowWidth;
    else
        optimalWidth = toContainerWidth;
 
    optimalWidth = Number(optimalWidth);
    userDefinedWidthLimit = Number(userDefinedWidthLimit);
 
    /*if no user-defined limit on the width*/
    if (userDefinedWidthLimit === 0)
    {
        rv = optimalWidth;
    }
    else
    {
        if (optimalWidth > userDefinedWidthLimit)
            rv = userDefinedWidthLimit;
        else
            rv = optimalWidth;
    }
 
    return rv === 0 ? "" : rv + "px";
}
 
 
 
 
 
 
 
 
 
 
function toggleSizesOfImages(embeddedImages, isExpanding) {
 
    embeddedImages.each(function(index, element) {
        if ($(this).closest(".embeddedImgContainer").hasClass("hiddenx")) {
            return false;
        }
 
        if (isExpanding && $(this).hasClass("expandedImg"))
        {
            /*update its max-width*/
            $(this).css("max-width", getOptimalImgMaxWidth_css($(this)));
        }
        else
        {
            toggleEmbeddedImgSize($(this), true);
        }
    });
}
 
function toggleMediaCloseButton(embeddedMediaContainer)
{
    if (! hasWidget("closeMediaButton", embeddedMediaContainer))
    {
        const url = embeddedMediaContainer.find('.embeddedImgAnchor').attr('data-backup-href');
        const mediaTyping = getMediaTyping(url);
        if (mediaTyping && mediaTyping.type == "video")
        {
            const closeMediaButtonStr = getPredefinedWidgetStr("closeMediaButton");
            setWidget(closeMediaButtonStr, embeddedMediaContainer);
        }
    }
    else
    {
        /*remove widget*/
        setWidget(null, embeddedMediaContainer, "closeMediaButton");
    }
}
 
 
 
 
 
$("body").on("click", ".imgCloseAll", function(event) {
    event.preventDefault();
    toggleSizesOfImages($(".embeddedImg.expandedImg"), false);
    nextImageSize = "expanded";
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( getEmbeddedImgContainer($(this)).offset().top );
 
    if (imgMenu)
        hideImgMenu();
});
 
$("body").on("click", ".imgClosePost", function(event) {
    event.preventDefault();
 
    const embeddedImgContainer = getEmbeddedImgContainer($(this));
    const postID = embeddedImgContainer.attr("data-postID");
 
    const postMedia = $(".embeddedImgContainer[data-postID="+postID+"]").find(".embeddedImg.expandedImg");
    toggleSizesOfImages(postMedia, false);
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( embeddedImgContainer.offset().top );
 
    if (imgMenu)
        hideImgMenu();
});
 
$("body").on("click", ".imgExpandPost", function(event) {
    event.preventDefault();
 
    const embeddedImgContainer = getEmbeddedImgContainer($(this));
    const postID = embeddedImgContainer.attr("data-postID");
 
    const postMedia = $(".embeddedImgContainer[data-postID="+postID+"]").find(".embeddedImg");
    toggleSizesOfImages(postMedia, true);
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( embeddedImgContainer.offset().top );
 
    if (imgMenu)
        hideImgMenu();
});
 
$("body").on("click", ".imgExpandAll", function(event) {
    event.preventDefault();
    toggleSizesOfImages($(".embeddedImg"), true);
    nextImageSize = "thumbnail";
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( getEmbeddedImgContainer($(this)).offset().top );
 
    if (imgMenu)
        hideImgMenu();
});
 
 
 
 
 
 
 
 
 
 
$("body").on("click", ".imgBlacklistToggle", function(event) {
 
    event.preventDefault();
 
    let imgURL;
    let imgAnchor;
 
    /*Get embeddedImgContainer and anchor*/
    imgAnchor = getEmbeddedImgContainer($(this)).find('.embeddedImgAnchor');
    imgURL = getMediaURL($(this));
 
    /*if image isn't blacklisted (but going to blacklist)*/
    if (! imgAnchor.hasClass("blacklisted"))
    {
        /*for every embedded image anchor*/
        async.each(embeddedImgContainers, function(curContainer, cb) {
            let curURL = getMediaURL(curContainer);
 
            /*if has URL that was just blacklisted, hide it*/
            if (isURLmatchBlacklistedURL(imgURL, curURL))
            {
                hideMedia(curContainer, true);
            }
 
            cb();
        });
    }
    else /*if image is blacklisted (but going to whitelist)*/
    {
        /*for every embedded image anchor*/
        async.each(embeddedImgContainers, function(curContainer, cb) {
            let curURL = getMediaURL(curContainer);
 
            /*if has URL that was just whitelisted, show it*/
            if (curURL === imgURL)
            {
                showMedia(curContainer, true);
            }
 
            cb();
        });
    }
 
    if (imgMenu)
        hideImgMenu();
});
 
 
 
$("body").on("click", "a.imgHideToggle", function(event) {
 
    event.preventDefault();
 
    const embeddedImgContainer = getEmbeddedImgContainer($(this));
 
    /*if image is going to be hidden*/
    if ($(this).html() === "hide")
    {
        hideMedia(embeddedImgContainer, false);
    }
    else    /*if image is going to be shown*/
    {
        showMedia(embeddedImgContainer, false);
    }
 
    if (imgMenu)
        hideImgMenu();
});
 
 
 
$("body").on("click", "a.imgHideAll", function(event) {
    event.preventDefault();
 
    toggleImageVisiblity($(".embeddedImgContainer"), "closeAnchor");
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( getEmbeddedImgContainer($(this)).offset().top );
 
    if (imgMenu)
        hideImgMenu();
});
$("body").on("click", "a.imgHidePost", function(event) {
    event.preventDefault();
 
    const embeddedImgContainer = getEmbeddedImgContainer($(this));
    const postID = embeddedImgContainer.attr("data-postID");
 
    const postEmbeddedImgContainers = $(".embeddedImgContainer[data-postID="+postID+"]");
    toggleImageVisiblity(postEmbeddedImgContainers, "closeAnchor");
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( embeddedImgContainer.offset().top );
 
    if (imgMenu)
        hideImgMenu();
});
$("body").on("click", "a.imgShowPost", function(event) {
    event.preventDefault();
 
    const embeddedImgContainer = getEmbeddedImgContainer($(this));
    const postID = embeddedImgContainer.attr("data-postID");
 
    const postEmbeddedImgContainers = $(".embeddedImgContainer[data-postID="+postID+"]");
    toggleImageVisiblity(postEmbeddedImgContainers, "showAnchor");
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( embeddedImgContainer.offset().top );
 
    if (imgMenu)
        hideImgMenu();
});
$("body").on("click", "a.imgShowAll", function(event) {
    event.preventDefault();
 
    toggleImageVisiblity($(".embeddedImgContainer"), "showAnchor");
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( getEmbeddedImgContainer($(this)).offset().top );
 
    if (imgMenu)
        hideImgMenu();
});
 
 
 
$("body").on("click", "a.closeMediaButton", function(event) {
    event.preventDefault();
 
    const embeddedMediaContainer = getEmbeddedImgContainer($(this));
    const embeddedImg = embeddedMediaContainer.find(".embeddedImg");
 
    toggleEmbeddedImgSize(embeddedImg, false);
 
    if (autoScrollWhenThumbnailClicked)
        $(window).scrollTop( embeddedMediaContainer.offset().top );
});
 
 

}, 1);
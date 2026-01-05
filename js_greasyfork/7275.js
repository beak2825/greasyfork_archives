// ==UserScript==
// @icon            http://s3.amazonaws.com/uso_ss/icon/177275/large.png?1378512285
// @name            Pinterest Add-Ons
// @version         20160912a
// @description     Changes the look of Pinterest and the way items are posted.
// @include         https://pinterest.com/*
// @include         https://www.pinterest.com/*
// @include         https://pinterest.com/pin/*
// @include         https://www.pinterest.com/pin/*
// @namespace       https://greasyfork.org/scripts/7275-pinterest-add-ons/code/Pinterest%20Add-Ons.user.js
// @license			http://creativecommons.org/licenses/by-nc-sa/3.0/
// @grant			GM_xmlhttpRequest
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js


/* Script Changes */
// 20150303 - Removed orange overlay from UNLINKED Pins
//          - Changed linked pins from gray gradient overlay to orange
//          - Removed the view source add on button from the overlay, Pinterest has added this to the bottom. That's what the orange overlay is showing you. 

// @downloadURL https://update.greasyfork.org/scripts/7275/Pinterest%20Add-Ons.user.js
// @updateURL https://update.greasyfork.org/scripts/7275/Pinterest%20Add-Ons.meta.js
// ==/UserScript==

//Auto scroll to top when page is loaded
$(document).ready(function () {

            $(window).scrollTop(0);
            return false;

        });


// Function to add style
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

/* BoardHeader */
addGlobalStyle(' .BoardHeader h1 {color: #fff;} ');

/* KeyFrames */
addGlobalStyle(' @-webkit-keyframes FadeIn {\
  0%   { opacity: 0; }\
  100% { opacity: 1; }\
}\
@-moz-keyframes FadeIn {\
  0%   { opacity: 0; }\
  100% { opacity: 1; }\
}\
@-o-keyframes FadeIn {\
  0%   { opacity: 0; }\
  100% { opacity: 1; }\
}\
@keyframes FadeIn {\
  0%   { opacity: 0; }\
  100% { opacity: 1; }\
}\
               ');

addGlobalStyle(' @-webkit-keyframes FadeInAlmost {\
  0%   { opacity: 0; }\
  100% { opacity: 1; }\
}\
@-moz-keyframes FadeIn {\
  0%   { opacity: 0; }\
  100% { opacity: 1; }\
}\
@-o-keyframes FadeIn {\
  0%   { opacity: 0; }\
  100% { opacity: 1; }\
}\
@keyframes FadeIn {\
  0%   { opacity: 0; }\
  100% { opacity: 1; }\
}\
               ');

/************************************************************************************************************** MAIN PAGE **************************************************************************************************/

/* Adds BG Fade */ /* I would like to add a button that allows the users to choose their colors */

addGlobalStyle(' .Modal .modalMask, .BoardPickerOld .boardPickerInnerWrapper .boardPickerItem:hover, .App, .Closeup.canClose, .ui-SelectList.compact .item.selected, .PinCreate3 .pinContainer {\
            		background: linear-gradient(45deg, #0072bc 0%,#8dc63f 100%);\
            		    background: #0072bc;\
            		        background: -moz-linear-gradient(45deg, rgba(0, 114, 188, 0.90) 0%,rgba(141, 198, 63, 0.90) 100%);\
        	    	            background: -webkit-gradient(linear, left bottom, right top, color-stop(0%,rgba(0, 114, 188, 0.90), color-stop(100%,rgba(141, 198, 63, 0.90))));\
        		                    background: -webkit-linear-gradient(45deg, rgba(0, 114, 188, 0.90) 0%,rgba(141, 198, 63, 0.90) 100%);\
            		                    background: -o-linear-gradient(45deg, rgba(0, 114, 188, 0.90) 0%,rgba(141, 198, 63, 0.90) 100%);\
            		                        background: -ms-linear-gradient(45deg, rgba(0, 114, 188, 0.90) 0%,rgba(141, 198, 63, 0.90) 100%);\
        	    	                            background: linear-gradient(45deg, rgba(0, 114, 188, 0.90) 0%,rgba(141, 198, 63, 0.90) 100%);\
        		                                    -webkit-animation: FadeInAlmost .15s; /* Safari 4+ */\
        		                                        -moz-animation:    FadeInAlmost .15s; /* Fx 5+ */\
        	                                            	-o-animation:      FadeInAlmost .15s; /* Opera 12+ */\
            	                                            	animation:         FadeInAlmost .15s; /* IE 10+, Fx 29+ */      } ');


addGlobalStyle('\
.Modal .modalMask {opacity: 0.75;}                                                    /* This is the BG behind the pin board. It covers the entire page */ \
.pinWrapper {background-color: #fff; padding: 1px 1px !important;}                    /* Adds a white background to the pinWrapper */ \
.Image.Module.pinUiImage {width: 100% !important;}                                    /* Auto width for images  */ \
 .PinCreate .pinContainer .pinModuleHolder {vertical-align: top !important;}          /* Aligns the image to the top of the pin board */ \
');

/* BoardPickerItem */
addGlobalStyle(' .PinCreate3 .Picker .item.activeItem, .PinCreate3 .Picker .item.selected, .PinCreate3 .Picker .item:hover { color: #ffffff !important; \
                       background: rgb(224,37,45); /* Old browsers */ \
                           background: -moz-linear-gradient(top,  rgba(224,37,45,1) 0%, rgba(174,24,31,1) 100%); /* FF3.6+ */\
                               background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(224,37,45,1)), color-stop(100%,rgba(174,24,31,1))); /* Chrome,Safari4+ */ \
                                   background: -webkit-linear-gradient(top,  rgba(224,37,45,1) 0%,rgba(174,24,31,1) 100%); /* Chrome10+,Safari5.1+ */\
                                       background: -o-linear-gradient(top,  rgba(224,37,45,1) 0%,rgba(174,24,31,1) 100%); /* Opera 11.10+ */\
                                           background: -ms-linear-gradient(top,  rgba(224,37,45,1) 0%,rgba(174,24,31,1) 100%); /* IE10+ */\
                                                   background: linear-gradient(to bottom,  rgba(224,37,45,1) 0%,rgba(174,24,31,1) 100%); /* W3C */\
                       transition: all .2s ease;} ');




/************************************************************************************************************** PINS **************************************************************************************************/

/* This adds the delay when hovering over the pinnable boards on the board picker */
addGlobalStyle(' .PinCreate3 .Picker .item.activeItem, .PinCreate3 .Picker .item.selected, .PinCreate3 .Picker .item:hover {\
color: #fff; \
  -webkit-animation: FadeIn .15s; /* Safari 4+ */\
  -moz-animation:    FadeIn .15s; /* Fx 5+ */\
  -o-animation:      FadeIn .15s; /* Opera 12+ */\
  animation:         FadeIn .15s; /* IE 10+, Fx 29+ */ } ');

addGlobalStyle(' .PinCreate3 .socialShareWrapper {  top: -34px;  background-color: black;  width: 330px;  padding: 10px 0 6px 0;} ');


/* Footer */
addGlobalStyle(' .formFooter {border-radius: 0px 0 20px 20px!important;');

if (document.URL.search('pin/create/*') >= 0) {
    window.resizeTo(780,825);
    addGlobalStyle(' body {overflow-y: hidden;} ');
    addGlobalStyle('.boardPickerInnerWrapper.visible {height: 680px!important; border: 1px solid #000000!important; box-shadow: 2px 5px 10px 5px #000!important; top: 0px!important;  transition: all .3s ease-in-out;} ');
    addGlobalStyle('.mainContainer {padding-top: 15%;}');
    addGlobalStyle('.Module.PinCreate3.noDupWarning {height: 498px!important;}');

addGlobalStyle('.pinModuleHolder {  height: 100%;} ');


}
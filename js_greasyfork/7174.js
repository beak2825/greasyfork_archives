// ==UserScript==
// @name         Locale Changer Xbox.com
// @namespace    Wunderman Production
// @version      0.7
// @description  Added preview toggle
// @author       You
// @match        
// @grant        none
// @include      http://www.xbox.com/*
// @include      https://www.xbox.com/*
// @include      http://store.xbox.com/*
// @include      https://store.xbox.com/*
// @include      http://marketplace.xbox.com/*
// @include      https://marketplace.xbox.com/*
// @include      http://preview-www.xbox.com/*
// @include      https://preview-www.xbox.com/*
// @include      http://preview-marketplace.xbox.com/*
// @include      https://preview-marketplace.xbox.com/*
// @downloadURL https://update.greasyfork.org/scripts/7174/Locale%20Changer%20Xboxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/7174/Locale%20Changer%20Xboxcom.meta.js
// ==/UserScript==


function switchLocale(eLocale){
	var newLocale = eLocale;
    if(newLocale.length > 0){
        
		var currentUrl = window.location.href;
		var currentLocale = currentUrl.match(/(([e][n]|[E][N]|[z][h]|[Z][H]|[k][o]|[K][O])-([a-z]|[A-Z]))\w+/g);

		var newUrl = "http://www.xbox.com/Shell/ChangeLocale?targetLocale=" + newLocale + "&returnUrl=" + currentUrl.replace(currentLocale,newLocale);
        return newUrl.toString();
        
    }
}

function previewThis(){
	var currentUrl = window.location.href;
    return currentUrl.toString().replace('http://www.','http://preview-www.');
}

function liveThis(){
	var currentUrl = window.location.href;
    return currentUrl.toString().replace('http://preview-www.','http://www.');
}

var previewString = "";

if (window.location.href.toString().indexOf("http://preview-www.") >= 0){
    previewString = "<ul><li><span style=\'display: block; margin: 0px auto; text-align: center;\'><b><a href='"+ liveThis() + "'>See Live</a></li></span></li>";
}
else{
    previewString = "<ul><li><span style=\'display: block; margin: 0px auto; text-align: center;\'><b><a href='"+ previewThis() + "'>See Preview</a></li></span></li>";
}

var insertedNav = "<li><a aria-haspopup='true' class='actionable actionBar' href='#'>Locale</a>"
+ previewString
+ "<ul><li><span style=\'display: block; margin: 0px auto; text-align: center;\'><b>ANZ</b></span></li>"
+ "<li><a href='"+ switchLocale('en-AU') + "'>[en-AU] Australia</a></li>"
+ "<li><a href='"+ switchLocale('en-NZ') + "'>[en-NZ] New Zealand</a></li>"
+ "<li><span style=\'display: block; margin: 0px auto; text-align: center;\'><b>ASIA</b></span></li>"
+ "<li><a href='"+ switchLocale('en-SG') + "'>[en-SG] Singapore</a></li>"
+ "<li><a href='"+ switchLocale('en-IN') + "'>[en-IN] India</a></li>"
+ "<li><a href='"+ switchLocale('en-HK') + "'>[en-HK] Hong Kong EN</a></li>"
+ "<li><a href='"+ switchLocale('zh-HK') + "'>[zh-HK] Hong Kong ZH</a></li>"
+ "<li><a href='"+ switchLocale('zh-TW') + "'>[zh-TW] Taiwan</a></li>"
+ "<li><a href='"+ switchLocale('ko-KR') + "'>[ko-KR] Korea</a></li>"
+ "<li><span style=\'display: block; margin: 0px auto; text-align: center;\'><b>GLOBAL</b></span></li>"
+ "<li><a href='"+ switchLocale('en-US') + "'>[en-US] USA</a></li>"
+ "<li><a href='"+ switchLocale('en-GB') + "'>[en-GB] UK</a></li>"
+ "<li><span style=\'display: block; margin: 0px auto; text-align: center;\'><b><input type=\"checkbox\" id=\"chkFloatNav\" checked>Floating Nav</b></span></li>"
+ "</ul></li>";
$(".navigationElements").append(insertedNav);

var injectThis = function () {

jQuery(document).scroll(function() {

jQuery('#shellHeaderContent a').css('font-size','12px'); //make menu font smaller
    if (jQuery(this).scrollTop() > 175 && $("#chkFloatNav").is(':checked')) {
        jQuery('#BodyHeader').css('z-index','9999');
        jQuery('#BodyHeader').css('position','fixed');
        jQuery('#BodyHeader').css('top','0');
        jQuery('#BodyHeader').css('width','100%');
    } 
    else {
        jQuery('#BodyHeader').css('position','static');
    }
});

};

var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + injectThis.toString() + ')();';
document.body.appendChild(script);
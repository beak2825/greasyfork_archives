// ==UserScript==
// @name        CH Re-Box MTurk Favicon
// @description Bring back the orange box/cube favicon for mturk.com.
// @version     1.0c
// @author      clickhappier
// @namespace   clickhappier
// @include     https://*.mturk.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8345/CH%20Re-Box%20MTurk%20Favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/8345/CH%20Re-Box%20MTurk%20Favicon.meta.js
// ==/UserScript==

// In late Feb 2015, MTurk's favicon changed from the Amazon AWS-style orange box/cube
// to the Amazon.com-style 'a' with a smile/arrow.
// Since the login page uses the Amazon.com-style favicon, as do Amazon.com product pages,
// it's now less convenient to tell them apart from MTurk pages in your tabs. 
// So this script brings back the distinctive AWS-style favicon for all MTurk.com pages.
//
// Adapted from 'RTM Favicon Redesigned' by Tyler Sticka circa 2009-2010: http://userscripts-mirror.org/scripts/show/42247


// create the favicon element
var faviconElem = document.createElement('link');
faviconElem.rel = 'shortcut icon';
faviconElem.type = 'image/x-icon';
// 64-bit text-encoded copy of http://aws.amazon.com/favicon.ico file's data:
faviconElem.href = 'data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACev7zAnr++PJ6/v3yev74Anr++AJ6/vnyev71AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnr+8wJ6/vjyev798nr+//J6/v/yev7/8nr++AJ6/vgCev7/8nr+//J6/v7yev758nr+9QAAAAAAAAAAAAAAAAJ6/v/yev7/8nr+//J6/v/yev7/8nr+//J6/vgCev74Anr+//J6/v/yev7/8nr+//J6/v/yev7+8AAAAAAAAAACev7/8nr+//J6/v/yev7/8nr+//J6/v/yev74Anr++AJ6/v/yev7/8nr+//J6/v/yev7/8nr+//AAAAAAAAAAAnr+//J6/v/yev7/8nr+//J6/v/yev7/8nr++AJ6/vgCev7/8nr+//J6/v/yev7/8nr+//J6/v/wAAAAAAAAAAJ6/v/yev7/8nr+//J6/v/yev7/8nr+//J6/vgCev74Anr+//J6/v/yev7/8nr+//J6/v/yev7/8AAAAAAAAAACev7/8nr+//J6/v/yev7/8nr+//J6/v/yev74Anr++AJ6/v/yev7/8nr+//J6/v/yev7/8nr+//AAAAAAAAAAAnr+//J6/v/yev7/8nr+//J6/v/yev7/8nr++AJ6/vgCev7/8nr+//J6/v/yev7/8nr+//J6/v/wAAAAAAAAAAJ6/v/yev7/8nr+//J6/v/yev7/8nr+//J6/vgCev74Anr+//J6/v/yev7/8nr+//J6/v/yev7/8AAAAAAAAAACev7/8nr+//J6/v/yev7/8nr+//J6/vzyev70Anr+9AJ6/vzyev7/8nr+//J6/v/yev7/8nr+//AAAAAAAAAAAnr+//J6/v/yev788nr+9wJ6/vIAyy+CAMsvhwDLL4cAyy+CAnr+8gJ6/vcCev788nr+//J6/v/wAAAAAAAAAAJ6/vcCev7yAMsvggDLL4cAyy+M8Msvj/DLL4/wyy+P8Msvj/DLL4zwyy+HAMsvggJ6/vICev73AAAAAAAAAAAAAAAAAMsviADLL47wyy+P8Msvj/DLL4/wyy+P8Msvj/DLL4/wyy+P8Msvj/DLL47wyy+IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMsvgwDLL4gAyy+L8Msvj/DLL4/wyy+L8MsviADLL4MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPg/AADABwAAgAEAAIABAACAAQAAgAEAAIABAACAAYwBgAEIAIGBAACP8f//+B8AAMADAAD4HwAA//8AAA==';

// add this favicon to the head
headElem = document.getElementsByTagName('head')[0];
headElem.appendChild(faviconElem);

// remove any existing favicons
var headLinks = headElem.getElementsByTagName('link');
for (var i=0; i < headLinks.length; i++) 
{
	if ( headLinks[i].href == faviconElem.href ) 
	{
	    return;
	}
	if ( headLinks[i].rel == "shortcut icon" || headLinks[i].rel == "icon" )
	{
	    headElem.removeChild(headLinks[i]);
	}
}

// force browser to acknowledge change
var shim = document.createElement('iframe');
shim.width = shim.height = 0;
document.body.appendChild(shim);
shim.src = "icon";
document.body.removeChild(shim);

// ==UserScript==
// @name        Facebook Chat Group Chat Painter
// @namespace   userscript.danielrozenberg.com
// @description Paint the title of group chats in different color to make them easier to distinguish
// @include     https://www.facebook.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7721/Facebook%20Chat%20Group%20Chat%20Painter.user.js
// @updateURL https://update.greasyfork.org/scripts/7721/Facebook%20Chat%20Group%20Chat%20Painter.meta.js
// ==/UserScript==


// Add the CSS style to the page
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = ".focusedTab .__fcgcp_group { background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVAQMAAACT2TfVAAAABlBMVEUAAAAAAAClZ7nPAAAAAnRSTlMAKEMmZcIAAAA9SURBVAjXdcmhFYAgFADA4xm0WW2uYXMtm4zGKIxA/IHHYwKunoHuEC7No/oUIadgC/bGWbkLb+bHIPVlT7UWFLs2cSVZAAAAAElFTkSuQmCC) !important; }";
document.head.appendChild(style);

// Define the repainting function and set it to run on interval
function repaintChats() {
  for (elm of document.querySelectorAll('.fbNubFlyout .titlebar:not(.__fcgcp)')) {
    elm.classList.add('__fcgcp');
    if (elm.querySelector('a.titlebarText[href*="/messages/conversation"]')) {
      elm.classList.add('__fcgcp_group');
    }
  }
}

window.setInterval(repaintChats, 100);

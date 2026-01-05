// ==UserScript==
// @name       don't move automatically to the next slide for SlideShare
// @namespace  
// @version    0.1
// @description  don't move automatically to the next slide for slideshare
// @match      http://www.slideshare.net/*
// @downloadURL https://update.greasyfork.org/scripts/8668/don%27t%20move%20automatically%20to%20the%20next%20slide%20for%20SlideShare.user.js
// @updateURL https://update.greasyfork.org/scripts/8668/don%27t%20move%20automatically%20to%20the%20next%20slide%20for%20SlideShare.meta.js
// ==/UserScript==

'use strict';
!function(t){t.parentNode.removeChild(t)}(document.querySelector(".next-container"));

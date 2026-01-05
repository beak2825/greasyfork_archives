// ==UserScript==
// @name         WK FiddleSettings
// @namespace    WKfiddle
// @version      0.2
// @description  enter something useful
// @author       Ethan
// @include      http*://www.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/9278/WK%20FiddleSettings.user.js
// @updateURL https://update.greasyfork.org/scripts/9278/WK%20FiddleSettings.meta.js
// ==/UserScript==

//Some of this code is from wanikani.com © Tofugu LLC & Viet Hoang, Relased under MIT license

//Rewrite Srs animation to fade down on wrong answer
if (typeof Srs !== "undefined")
    Srs.newSrs = function (e,t){var n,r,i,s,o,u;return o=(e.mi||0)+(e.ri||0),o===0?(n=Srs.name(t+1),i="srs-up",s="Your item has leveled up in the spaced repetition system"):(r=t>=5?2*Math.round(o/2):1*Math.round(o/2),n=t-r<1?1:t-r,n=Srs.name(n),i="srs-down",s="Your item has leveled down in the spaced repetition system"),u=$("<div></div>",{"class":"srs"}).appendTo("#question-type"),$("<div></div>",{"class":i+" "+"srs-"+n+" animated fadeIn" + i[4].toUpperCase()+i.substr(5),title:s}).appendTo(u)};

//Fix search bar for consistency in forums
if ($("#main-ico-search i").attr("class") === "icon-comment")
    $("#search-form").attr("action", "/chat/search/posts");

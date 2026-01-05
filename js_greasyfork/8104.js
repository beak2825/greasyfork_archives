// ==UserScript==
// @name         Pantip remove short comments
// @namespace    DollPantipRemoveShotComments
// @version      0.1
// @description  remove all comments with length < 200
// @author       GroupDoll
// @match        http://pantip.com/topic/*
// @downloadURL https://update.greasyfork.org/scripts/8104/Pantip%20remove%20short%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/8104/Pantip%20remove%20short%20comments.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    $('.display-post-story').each(function( index, element ){if($(this).text().length < 200){$(this).parent().parent().parent().parent().remove()}})
    $('.sub-loadmore').each(function( index, element ){if(!$(this).prev().hasClass('section-comment')){$(this).remove()}})
}, false);

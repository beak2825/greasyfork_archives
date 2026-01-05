// ==UserScript==
// @name         Swappa Price Sorter
// @namespace    http://swappa.com/
// @version      0.3
// @description  sorts devices from Swappa by price
// @author       S Mattison (Ayelis)
// @match        https://swappa.com/*
// @match        http://swappa.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/6312/Swappa%20Price%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/6312/Swappa%20Price%20Sorter.meta.js
// ==/UserScript==

$('.row').each(function( index ) {
    var vA, vB, x;
    x = $(this).find('.col-xs-6,.col-xs-12').sort(function(a, b) {
        vA = parseInt($(a).find('.price').text().trim().replace(/\D/g,''));
        vB = parseInt($(b).find('.price').text().trim().replace(/\D/g,''));
        return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    if($(this).children().length == x.length){
        $(this).empty();
        $(this).append(x);
    }
});
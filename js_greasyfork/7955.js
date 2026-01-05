// ==UserScript==
// @name         GNATS
// @namespace    R458
// @version      0.1
// @description  Change the layouts of GNATS
// @author       zhyan
// @include      https://gnats.juniper.net/web/default/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7955/GNATS.user.js
// @updateURL https://update.greasyfork.org/scripts/7955/GNATS.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('#frame1').prependTo('#view_headerContent > div:first');
    $('.banner').remove();
    $('#header').hide();
    document.getElementsByClassName('fixed_chevrons padding_top_35')[0].style.removeProperty('padding-top');
    document.getElementById('header_inner_cover').remove();
    document.getElementsByClassName('fixed_chevrons')[0].style.cssText += 'padding-top: 5px';
    $('#name_0_last-modified').remove();
    $('#name_0_arrival-date').remove();
    $('#div_arrival-date').parent()[0].style.removeProperty('width');
    document.getElementById('link_container').style.paddingBottom = '0px';
    arrd = $('#val_arrival-date').text();
    lrrd = $('#val_last-modified').text();
    arrd = "Arrival    Date" + arrd;
    lrrd =  "Last-Modified" +lrrd;
    $('#val_arrival-date').text(arrd);
    $('#val_last-modified').text(lrrd);
})

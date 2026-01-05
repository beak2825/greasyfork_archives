// ==UserScript==
// @name         Kickass 24h
// @description  Adds top 24h buttons to kickass like the top48h in tpb.
// @namespace    greasyfork.org/users/3926-jguer
// @version      1.0 build 36
// @author       Jguer
// @license      MIT
// @match        *://kickass.to/*
// @match        *://katproxy.com/*
// @match        *://kickasstorrents.im/*
// @match        *://kat.cr/*
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=joaogg3@hotmail.com&item_name=Kickass+24+donation
// @icon         https://raw.githubusercontent.com/Jguer/Kickass-24h/master/resources/large.png
// @require      //ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8459/Kickass%2024h.user.js
// @updateURL https://update.greasyfork.org/scripts/8459/Kickass%2024h.meta.js
// ==/UserScript==

function main()
{
    console.log("Loaded script");
    $('<li>').prependTo('#navigation').append( $('<a>', {href: '/usearch/age:24h/'})).children().append( $('<i class="ka ">g</i>')).append($('<span class="menuItem">top 24h</span>'));
    if(window.location.pathname === '/')
    {
        for(var i = 0; i <= 7; i++)
        {
            var usearch = ["movies","tv","music","games","applications","anime","books","lossless"];

            $('h2').eq(i).children(":first").after('<a class="plain topdaybtn">(24h)</a>');
            $('.topdaybtn').eq(i).attr('href','/usearch/category:'+usearch[i]+'%20age:24h/');

        }
    }
}

$(document).ready(main);

// ==UserScript==
// @id             torec-subfilter
// @name           torec subfilter
// @version        0.2
// @author         Rabin
// @description    Add a text box above the subtitle list which allow one to filter the list.
// @include        http://www.torec.net/sub.asp*
// @require        //code.jquery.com/jquery-1.10.2.js
// @run-at         document-end
// @namespace https://greasyfork.org/users/706
// @downloadURL https://update.greasyfork.org/scripts/787/torec%20subfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/787/torec%20subfilter.meta.js
// ==/UserScript==

if(typeof $ == 'undefined'){ var $ = unsafeWindow.jQuery; }

$( "div[class='sub_dl']" ).prepend('<input id="subfilter" type="text"/>');

// new :<function> to for case insensitive filtering.
$.expr[':'].Contains = function(a,i,m){ return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0; };

$(document).ready(function() {  

    $("#subfilter").change( function () {
        var filter = $(this).val() ; 
        if (filter !== '') {
            $("#download_version").children().show();
            $("#download_version").find("option:not(:Contains("+filter+"))").hide();
        }
        else {
            $("#download_version").children().show();
        }
    }).keyup( function () {
    // fire the above change event after every letter
    $(this).change();
    });

});


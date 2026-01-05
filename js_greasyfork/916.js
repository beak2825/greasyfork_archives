// ==UserScript==
// @name          vBulletin Total Ignore
// @include       */showthread.php*
// @include       */showpost.php*
// @include       */private.php*
// @include       */member.php*
// @version       2.0
// @date          2014-01-27
// @creator       Tjololo
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/710
// @description Remove all mention of ignored people (except thanks)
// @grant     GM_log
// @downloadURL https://update.greasyfork.org/scripts/916/vBulletin%20Total%20Ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/916/vBulletin%20Total%20Ignore.meta.js
// ==/UserScript==

var plonk = (localStorage["plonk"] ? localStorage["plonk"].split(',') : new Array());   
console.log(plonk);

$('li[class*=postbitignored]').each(function() {
    var name = $(this).find(".postbody").find("strong").html();
    if ($.inArray(name,plonk) == -1)
        plonk.push(name);
    localStorage["plonk"] = plonk;
    $(this).hide();
    console.log("Found "+name);
});

$(".bbcode_quote").each(function() {
    var name = $(this).find("strong").html();
    if ($.inArray(name,plonk) > -1){
        console.log("Found quote from "+name);
        $(this).html("Quote from "+name+" hidden");
        $(this).hide();
    }
});

$("#pagination_top").before($("<a></a>").addClass("newcontent_textcontrol").text("Clear totalignore list").click(function() { if(confirm("Clear the totalignore list? It will add each user it finds an ignored stub for.")) localStorage.removeItem("plonk"); }));
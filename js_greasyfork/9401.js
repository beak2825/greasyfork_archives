// ==UserScript==
// @name         Matt Tyner Script
// @version      0.5
// @description  Searches google for the product, finds the amazon URL, extracts the asin, and auto-fills it
// @author       Tjololo, clickhappier
// @match        https://www.mturkcontent.com/dynamic/hit*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/9401/Matt%20Tyner%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/9401/Matt%20Tyner%20Script.meta.js
// ==/UserScript==

var second = false;

var googleAPIPrefix="https://www.google.com/search?q=";

var search_term = $("tr:last td:last").text();
var search_item = $("tr:first td:last").text();

var query = googleAPIPrefix+encodeURIComponent(search_term).replace(/%20/g,"+")+"+site:amazon.com";
var query2 = googleAPIPrefix+encodeURIComponent(search_item).replace(/%20/g,"+")+"+site:amazon.com";

$("tr:last td:last").html("<a href=\""+query+"\">"+search_term+"</a>");
$("tr:first td:last").html("<a href=\""+query2+"\">"+search_item+"</a>");

$('table').parent().append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_button"
    }).click(function() {
        var resultURL = getGoogleResults(query);
    }));

$("#search_button").hide();

$("#search_button").click();

function getASIN(href) {
    var asinMatch;
    asinMatch = href.match(/\/exec\/obidos\/ASIN\/(\w{10})/i);
    if (!asinMatch) { asinMatch = href.match(/\/gp\/product\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/exec\/obidos\/tg\/detail\/\-\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/dp\/(\w{10})/i); }
    if (!asinMatch) { return null; }
    return asinMatch[1];
}

function httpGet(theUrl)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,

        onload: function (xhr,theUrl) {
            r = xhr.responseText;
            var ret="";
            try{
                ret = getUrl(r);
                asin = getASIN(ret);
                console.log(asin);
                if (asin.length > 0){
                    if (!second){
                        $("tr:last").append("<td>"+asin+"</td>").click(function() { $("#amazon_asin").val($("tr:last td:last").text()); });
                        query = query2;
                        second = true;
                        $("#search_button").click();
                    }
                    else
                        $("tr:first").append("<td>"+asin+"</td>").click(function() { $("#amazon_asin").val($("tr:first td:last").text()); });
                    $("#amazon_asin").val(asin);
                }
                else
                    $("#amazon_asin").val("None");

            }
            catch(err){
                if (!second){
                    $("tr:first").append("<td>None</td>");
                    query = query2;
                    second = true;
                    $("#search_button").click();
                }
                else{
                    $("tr:last").append("<td>None</td>");
                    $("#amazon_asin").val("None");
                }
                return r;
            }
        }
    });
}

function getGoogleResults(task){
    console.log("TASK: "+task);
    ret = httpGet(task);
    return ret;
}

function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    el.html(html);
    var element = $("#rso li.g", el).not("#imagebox_bigimages").not(".ads-ad").eq(0);
    var $h3 = $("h3.r", element).eq(0);
    console.log($h3);
    if ($h3.length > 0) {
        console.log($("a", $h3).eq(0));
        url = $("a", $h3).eq(0).attr("href");
        return url;
    }
}/**/
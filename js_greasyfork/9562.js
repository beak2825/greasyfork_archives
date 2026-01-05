// ==UserScript==
// @name         Jared Script SUPER SECRET EDITION
// @version      0.11
// @description  Searches google for the product, finds the amazon URL, extracts the asin, and auto-fills it
// @author       Tjololo
// @match        https://www.mturkcontent.com/dynamic/hit*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/9562/Jared%20Script%20SUPER%20SECRET%20EDITION.user.js
// @updateURL https://update.greasyfork.org/scripts/9562/Jared%20Script%20SUPER%20SECRET%20EDITION.meta.js
// ==/UserScript==

var second = false;
var res1 = "";
var res2 = "";
var captcha = false;

var googleAPIPrefix="https://www.google.com/search?q=site:amazon.com+";

var search_term = $("tr:eq(2) label").text();
var name_brand = $("tr:eq(3) p").text();
if (search_term.indexOf(name_brand) == -1)
    search_term = name_brand + search_term;
var search_item = $("tr:eq(6) td:first").text();

var query = googleAPIPrefix+encodeURIComponent(search_term).replace(/%20/g,"+");
var query2 = googleAPIPrefix+encodeURIComponent(search_item).replace(/%20/g,"+");

$("tr:eq(2) label").html("<a href=\""+query+"\">"+search_term+"</a>");
$("tr:eq(6) td:first").html("<a href=\""+query2+"\">"+search_item+"</a>");

$(".panel.panel-primary").hide();

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
    if (href == "No results")
        return href;
    var asinMatch;
    asinMatch = href.match(/\/exec\/obidos\/ASIN\/(\w{10})/i);
    if (!asinMatch) { asinMatch = href.match(/\/gp\/product\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/exec\/obidos\/tg\/detail\/\-\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/dp\/(\w{10})/i); }
    if (!asinMatch) { asinMatch = href.match(/\/sim\/(\w{10})/i); }
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
                //console.log(ret);
                if (!second)
                    res1 = asin;
                else
                    res2 = asin;
                if (asin.length > 0 && asin != "No results"){
                    if (!second){
                        $("tr:eq(2)").append("<td>"+asin+"</td>").click(function() { $('input[value="found"]').click(); $("#comments").val(""); $("#asin").val($("tr:eq(2) td:last").text()); });
                        query = query2;
                        second = true;
                        $("#search_button").click();
                    }
                    else{
                        if (captcha)
                            second = true;
                        if (res1 == null)
                            $('input[value="found"]').click();
                        $("tr:eq(6)").append("<td>"+asin+"</td>").click(function() { $('input[value="found"]').click(); $("#comments").val(""); $("#asin").val($("tr:eq(6) td:last").text()); });
                        if (res1 == res2)
                            $("#submitButton").click();
                        console.log(res1 == "No results");
                        if (res1 == "No results"){
                            //console.log("Click");
                            $('input[value="Submit"]').click();
                        }
                    }
                    if ($("#asin").val() == "")
                        $("#asin").val(asin);
                }
                else if (asin == "No results"){
                    if (!second){
                        $("tr:eq(2)").append("<td>"+asin+"</td>").click(function() { $('input[name="selection"][value="not_found"][type="radio"]').click(); $("#comments").val("No search results found"); });
                        query = query2;
                        second = true;
                        $("#search_button").click();
                    }
                    else{
                        if (captcha)
                            second = true;
                        $("tr:eq(6)").append("<td>"+asin+"</td>").click(function() { $('input[name="selection"][value="not_found"][type="radio"]').click(); $("#comments").val("No search results found"); });
                        if (res1 == "No results"){
                            $('input[name="selection"][value="not_found"][type="radio"]').click();
                            $("#comments").val("No search results found");
                            console.log("click");
                            $("#submitButton").click();
                        }
                        else if(res1 != null && res1 != "No results" && $("#asin").val() != "" && !captcha)
                            $("#submitButton").click();
                    }
                }

            }
            catch(err){
                console.log(err);
                if (!second){
                    $("tr:eq(2)").append("<td>None</td>");
                    query = query2;
                    second = true;
                    $('input[name="selection"][value="not_found"][type="radio"]').click();
                    $("#comments").val("No exact match found");
                    $("#search_button").click();
                }
                else{
                    if (captcha)
                        second = true;
                    $("tr:eq(6)").append("<td>None</td>");
                    if ($("#asin").val() == ""){
                        $('input[name="selection"][value="not_found"][type="radio"]').click();
                        $("#comments").val("No exact match found");
                    }
                }
                return r;
            }
        }
    });
}

$('input[value="not_found"]').parent().click(function() { $("#comments").val("No exact match found"); });
$('#submitButton').focus();

function getGoogleResults(task){
    console.log("TASK: "+task);
    ret = httpGet(task);
    return ret;
}

function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    el.html(html);
    var check = $("#captcha", el);
    if (check.length > 0){
        alert("Captcha");
        captcha = true;
    }
    else{
      if ($("#rso li.g", el).length == 0)
          return "No results";
      var element = $("#rso li.g", el).not("#imagebox_bigimages").not(".ads-ad").eq(0);
      var $h3 = $("h3.r", element).eq(0);
      console.log($h3);
      if ($h3.length > 0) {
          console.log($("a", $h3).eq(0));
          url = $("a", $h3).eq(0).attr("href");
          return url;
      }
    }
}/**/
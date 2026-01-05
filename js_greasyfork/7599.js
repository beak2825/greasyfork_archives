// ==UserScript==
// @name         OCMP34 About Us Do-er thingy
// @namespace    https://greasyfork.org/en/users/710-tjololo
// @version      0.1
// @description  For the OCMP34's
// @author       Tjololo
// @match        https://*.crowdcomputingsystems.com/mturk-web/public/*
// @require      http://code.jquery.com/jquery-git.js
// @require https://greasyfork.org/scripts/2352-parseuri-license/code/parseuri%20license.js?version=6261
// @grant          GM_xmlhttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7599/OCMP34%20About%20Us%20Do-er%20thingy.user.js
// @updateURL https://update.greasyfork.org/scripts/7599/OCMP34%20About%20Us%20Do-er%20thingy.meta.js
// ==/UserScript==
// ------------------------------------------------------------------------------------

//Set this to whatever "about us" is in whatever language you need
var about_us_translation = "o nama";

//Change this to the number of results you want to see per term (translated, non-translated)
var numResults = 2;

//don't change this, it's used somewhere else.
var query = $('a:visible').eq(2).attr("href");

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(match, number) {
        return args[number] !== undefined ? args[number] : match;
    });
};

$("div.place.bg-dark").parent().append(
	 $("<div></div>", {
        html: "<b>Results</b><br /><table id=\"results_table\"><tr><th style=\"border: 1px solid black\">Click to select</th><th style=\"border: 1px solid black\">Click to open corresponding URL</th></tr></table>",
        id: "results_div"
}));

$("#results_div").parent().append(
    $('<table></table>')
      .append($("<tr></tr>")
      	.append($("<td></td>")
      		.append($("<input type='text' value='"+numResults+"' />")
     			.attr("id", "numResultID")
     			.attr("name", "numResultID")
                    )
                )
              .append($("<td></td>")
                      .attr("id","numResultsButton")
                      .css('border', '3px solid black')
                      .click(function() { reSearch(); })
                      .text("Update")
                      )
              )
    .append($("<tr></tr>")
      	.append($("<td></td>")
      		.append($("<td></td>")
      		.append($("<input type='text' value='"+$('a:visible').eq(2).attr("href")+"' />")
     			.attr("id", "queryID")
     			.attr("name", "queryID")
                    )
                )
              .append($("<td></td>")
                      .attr("id","queryButton")
                      .css('border', '3px solid black')
                      .click(function() { reSearch(); })
                      .text("Search this link")
                      )
              )
            )
    );

function reSearch(){
    numResults = $("#numResultID").val();
    query = $("#queryID").val();
    $("#results_table").html("<tr><th style=\"border: 1px solid black\">Click to select</th><th style=\"border: 1px solid black\">Click to open corresponding URL</th></tr>");
    $("#search_button").click();
}

$("#results_table").css('border', '1px solid black');

//var googleAPIPrefix="https://ajax.googleapis.com/ajax/services/search/web?v=1.0&";
var googleAPIPrefix="https://www.google.com/search?q=";
//var ip = myIP();
//console.log(ip);

function httpGet(theUrl)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,
        
        onload: function (xhr,theUrl) {
            r = xhr.responseText;
            //console.log(r);
            var ret="";
            try{
                //var data = $.parseJSON(xhr.responseText);
                ret = getUrl(r);
                //console.log(taskNumber);
                window.postMessage({magicword: "mumbojumbo", url: ret}, "*");
            }
            catch(err){
                console.log(err);
                console.log(r);
                return r;
            }
        }
    });
}

function getGoogleResults(task){
    var test = $("div.place.bg-dark").find("strong:last").text();
    console.log(test);
    var result = task+" +donors";
    var task2 = googleAPIPrefix + result;
    task = googleAPIPrefix + test + " +donors";
    console.log("TASK: "+task);
    console.log("TASK2: "+task2);
    var ret = [];
    ret.push(httpGet(task2));
    ret.push(httpGet(task));
    return ret;
}

function getUrl(obj){
    //console.log(obj);
    var html = $.parseHTML(obj);
    //var results = obj["responseData"]["results"];
    //var responseNum = getRandomInt(0,3);
    //var finalUrl = results[responseNum]["unescapedUrl"];
    var el = $( '<div></div>' );
    var finalUrl = [];
    el.html(html);
    //var element = $("#rso li.g", el).eq(getRandomInt(0,4));
    
    for (var i = 0; i < numResults; i++){
        var element = $("#rso li.g", el).not("#imagebox_bigimages").eq(i);
        item = [];
        var $h3 = $("h3.r", element).eq(0);
        console.log($h3);
        if ($h3.length > 0) {
            console.log($("a", $h3).eq(0));
            url = $("a", $h3).eq(0).attr("href");
            item.push(url);
        }
        var $h3s = $("div.s", element).eq(0);
        if ($h3s.length > 0) {
            console.log($h3s.text());
            text = $h3s.text();
            item.push(text);
        }
        finalUrl.push(item);
    }
    //console.log(element);
    //console.log("FINAL");
    //console.log(finalUrl);
    return finalUrl;
}

$('a:visible').eq(2).parent().append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_button"
    }).click(function() {
        $link_href = query;
        //console.log("URL: "+$('a:visible').eq(2).attr("href"));
        var resultURL = getGoogleResults($link_href);
        //console.log(resultURL);
    }));

$("#search_button").hide();

$("#search_button").click();

window.addEventListener("message", function(e) {
    if (e.data.magicword === "mumbojumbo") {
        console.log("Message Received");
        console.log(e.data.url);
        for (var i = 0; i < numResults; i++){
            $("#results_table").append($('<tr>')
                                       .append($('<td>')
                                               .text(e.data.url[i][0])
                                               .css('border', '1px solid black')
                                               )
                                       .append($('<td>')
                                               .text(e.data.url[i][1])
                                               .css('border', '1px solid black')
                                               )
                                       );
            $("#results_table tbody").find("tr:last")
            							.find("td:first").click(function () {
                                                   var retval = fillTextbox($(this));
                                                    }
                                                );
            $("#results_table tbody").find("tr:last").find("td:last").click(function () {
                                                   var retval = openPage($(this).parent());
                                                    }
                                                );
        }
        //var html = "<table><tr><td onclick=function() { $(\"input:text:visible:first\").val("+e.data.url[0]+"); }>"+e.data.url[0]+"</td><td>"+e.data.url[1]+"</td></tr></table>";
        //$("#results_div").html($("#results_div").html()+html);
        //$("input:text:visible:first").val(e.data.url);
    }
    else{
        console.log("Also message received");
        console.log(e.data);
    }
}, false);


$(document).ready(function (){
    $('div.place.bg-dark').mouseup(function (e){
       $("#queryID").val(getSelectionText())
       $("#queryButton").click();
   })
});
        
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function fillTextbox(tableCell) {
        $("input.cc-input.text.complete_url.about_us_url.required.answerInput").val(tableCell.text());
    }
function openPage(tableCell) {
    var url = $(tableCell).find("td:first").text();
    window.open(url);
}
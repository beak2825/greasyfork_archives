// ==UserScript==
// @name         OCMP34 requested_script
// @namespace    https://greasyfork.org/en/users/710-tjololo
// @version      0.1
// @description  For the OCMP34's
// @author       Tjololo
// @match        https://ru1434.crowdcomputingsystems.com/mturk-web/*
// @require      http://code.jquery.com/jquery-git.js
// @require https://greasyfork.org/scripts/2352-parseuri-license/code/parseuri%20license.js?version=6261
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/8493/OCMP34%20requested_script.user.js
// @updateURL https://update.greasyfork.org/scripts/8493/OCMP34%20requested_script.meta.js
// ==/UserScript==
// ------------------------------------------------------------------------------------

//Change this to the number of results you want to see per term (translated, non-translated)
var numResults = 2;

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(match, number) {
        return args[number] !== undefined ? args[number] : match;
    });
};

$(".block.question").each(function() {
    var url = $(this).find("a:visible:first").attr("href").replace(/ /g,"+").replace("#","search?");
    var num = $(this).find("div.number b").text();
    $(this).find("div.place").parent().append(
        $('<table></table>')
        .append($("<tr></tr>")
                .append($("<td></td>")
                        .text("Number of results to return")
                        )
                .append($("<td></td>")
                        .append($("<input type='text' value='"+numResults+"' />")
                                .attr("id", "numResultID_"+num)
                                .attr("name", "numResultID_"+num)
                               )
                       )
                .append($("<td></td>")
                        .attr("id","numResultsButton_"+num)
                        .css('border', '3px solid black')
                        .click(function() { reSearch(num); })
                        .text("Update")
                       )
               ));
    $(this).find("div.place.bg-dark").parent().append(
        $("<div></div>", {
            html: "<b>Results</b><br /><table id=\"results_"+num+"\"><tr><th style=\"border: 1px solid black\">Click to select</th><th style=\"border: 1px solid black\">Click to open corresponding URL</th></tr></table>",
            id: "results_"+num
        }));

    $("#results_"+num).css('border', '1px solid black');
    
    $('a:visible').eq(2).parent().append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_"+num
    }).click(function() {
        var resultURL = getGoogleResults(url,num);
        //console.log(resultURL);
    }));

    $("#search_"+num).hide();

    $("#search_"+num).click();

});//end of loop
    
function reSearch(num){
    var number = num;
    numResults = $("#numResultID_"+num).val();
    $("#results_"+num).html("<tr><th style=\"border: 1px solid black\">Click to select</th><th style=\"border: 1px solid black\">Click to open corresponding URL</th></tr>");
    $("#search_"+num).click();
}

function httpGet(theUrl,taskNum)
{
    var url = theUrl;
    var num = taskNum;
    //console.log("url: "+url+" num: "+num);
    GM_xmlhttpRequest({
        method: 'GET',
        synchronous: true,
        url: theUrl,
        overrideMimeType: "text/html",
        onload: function (xhr) {
            r = xhr.responseText;
            var ret="";
            try{
                //var data = $.parseJSON(xhr.responseText);
                ret = getUrl(r);
                //console.log(taskNumber);
                window.postMessage({magicword: "mumbojumbo", url: ret, num:taskNum}, "*");
            }
            catch(err){
                console.log(err);
                console.log(r);
                return r;
            }
        }
    });
}

function getGoogleResults(url,number){
    var ret = httpGet(url,number);
    return ret;
}

function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    var invalid = false;
    el.html(html);
    for (var i = 0; i < numResults; i++){
        var element = $("#rso li.g", el).not("#imagebox_bigimages").eq(i);
        item = [];
        //console.log("hook");
        //console.log(element.text());
        var $h3 = $("h3.r", element).eq(0);
        if ($h3.length > 0) {
            console.log($("a", $h3).eq(0));
            url = $("a", $h3).eq(0).attr("href");
            if (url.indexOf("guidestar") == -1 && url.indexOf("mantra") == -1)
                item.push(url);
            else
            {
                invalid = true;
            }
        }
        var $h3s = $("div.s", element).eq(0);
        if ($h3s.length > 0) {
            console.log($h3s.text());
            text = $h3s.text();
            item.push(text);
        }
        if (invalid)
            item = ["INVALID URL","Please click N/A"];
        finalUrl.push(item);
    }
    return finalUrl;
}

window.addEventListener("message", function(e) {
    if (e.data.magicword === "mumbojumbo") {
        //console.log("Message Received");
        console.log(e.data);
        var num = e.data.num;
        for (var i = 0; i < numResults; i++){
            $("#results_"+num).append($('<tr>')
                                       .append($('<td>')
                                               .text(e.data.url[i][0])
                                               .attr("id","url_"+num+"_"+i)
                                               .css('border', '1px solid black')
                                               )
                                       .append($('<td>')
                                               .text(e.data.url[i][1])
                                               .attr("id","task_"+num+"_"+i)
                                               .css('border', '1px solid black')
                                               )
                                       );
            $("#url_"+num+"_"+i).click(function () {
                                                   var retval = fillTextbox($(this),num);
                                                    }
                                                );
            $("#task_"+num+"_"+i).click(function () {
                                                   var retval = openPage($(this).parent(),num);
                                                    }
                                                );
        }
    }
    else{
        console.log("Also message received");
        console.log(e.data);
    }
}, false);

function fillTextbox(tableCell,num) {
    if (tableCell.text() == "INVALID URL"){
        if (!$("input.optional.cc-input.text.na").eq(num-1).is(":visible"))
            $("input.na-check").eq(num-1).click();
    }
    else
        $("input.cc-input.text.complete_url.organization_homepage_input.required.answerInput").eq(num-1).val(tableCell.text());
}
function openPage(tableCell,num) {
    var url = $(tableCell).find("td:first").text();
    if (url != "INVALID URL")
        window.open(url);
    else{
        if (!$("input.optional.cc-input.text.na").eq(num-1).is(":visible"))
            $("input.na-check").eq(num-1).click();
    }
}
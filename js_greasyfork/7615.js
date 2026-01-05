// ==UserScript==
// @name         Address Finder
// @namespace    https://greasyfork.org/en/users/710-tjololo
// @version      0.6
// @description  For the OCMP50's about us pages
// @author       Tjololo
// @match        https://www.mturkcontent.com/dynamic/hit*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7615/Address%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/7615/Address%20Finder.meta.js
// ==/UserScript==
// ------------------------------------------------------------------------------------

var googleAPIPrefix="https://www.google.com/search?q=";
//var ip = myIP();
//console.log(ip);

var companyName = $("#Writing div.row.col-xs-12.col-md-12 div:nth-child(2) span:first").text();
console.log(companyName);

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

function getGoogleResults(){
    var task = googleAPIPrefix + companyName.replace(/ /g,"+");
    console.log("TASK: "+task);
    var ret = [];
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
    var finalUrl = "";
    el.html(html);
    //var element = $("#rso li.g", el).eq(getRandomInt(0,4));    
    var element = $("#rhs_block div._mr", el).not("#imagebox_bigimages").not("div._mr._Wfc.vk_gy").eq(0);
    console.log(element)
    item = [];
    var $h3 = $("span:last", element).eq(0);
    console.log($h3);
    if ($h3.length > 0) {
        console.log($h3.text());
        url = $h3.text();
        finalUrl = url;
    }

    return finalUrl;
}

$('a:visible:first').parent().append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_button"
    }).click(function() {
        //console.log("URL: "+$('a:visible').eq(2).attr("href"));
        var resultURL = getGoogleResults();
        //console.log(resultURL);
    }));

$("#search_button").hide();

$("#search_button").click();

window.addEventListener("message", function(e) {
    if (e.data.magicword === "mumbojumbo") {
        console.log("Message Received");
        console.log(e.data.url);
        $('textarea[name=WritingTexts]').val(e.data.url);
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
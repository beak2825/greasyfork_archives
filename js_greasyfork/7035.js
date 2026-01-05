// ==UserScript==
// @name         OCMP50 Do-er thingy
// @namespace    https://greasyfork.org/en/users/710-tjololo
// @version      0.1
// @description  For the OCMP50's
// @author       Tjololo
// @match        https://tr-ta.crowdcomputingsystems.com/mturk-web/public/*
// @require      http://code.jquery.com/jquery-git.js
// @require https://greasyfork.org/scripts/2352-parseuri-license/code/parseuri%20license.js?version=6261
// @grant          GM_xmlhttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/7035/OCMP50%20Do-er%20thingy.user.js
// @updateURL https://update.greasyfork.org/scripts/7035/OCMP50%20Do-er%20thingy.meta.js
// ==/UserScript==
// ------------------------------------------------------------------------------------


$("input:radio:first").attr('checked', true);

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function(match, number) {
        return args[number] !== undefined ? args[number] : match;
    });
};

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
    console.log("TASK: "+task);
    //var ret = "temp";
    var ret = httpGet(task);
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
    var element = $("#rso li.g", el).not("#imagebox_bigimages").eq(0);
    var $h3 = $("h3.r", element).eq(0);
    if ($h3.length > 0) {
        console.log($("a", $h3).eq(0));
        url = $("a", $h3).eq(0).attr("href");
        finalUrl = url;
    }
    //console.log(element);
    return finalUrl;
}

$('a:visible').eq(3).append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "button"
    }).click(function() {
        console.log("URL: "+$('a:visible').eq(3).attr("href"));
        var resultURL = getGoogleResults($('a:visible').eq(3).attr("href"));
        console.log(resultURL);
    }));

$("#button").hide();

$("#button").click();

window.addEventListener("message", function(e) {
    if (e.data.magicword === "mumbojumbo") {
        console.log("Message Received");
        console.log(e.data);
        $("input:text:visible:first").val(e.data.url);
    }
    else{
        console.log("Also message received");
        console.log(e.data);
    }
}, false);
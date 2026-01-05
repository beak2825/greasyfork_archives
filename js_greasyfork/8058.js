// ==UserScript==
// @name         Hotel Link Script
// @version      0.2
// @description  Automation of hotel linking hits
// @author       You
// @match        https://s3.amazonaws.com/mturk_bulk/hits*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant		GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/8058/Hotel%20Link%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/8058/Hotel%20Link%20Script.meta.js
// ==/UserScript==

var city = $("tr:nth-child(1) td:nth-child(2)").text().trim();
var name = $("tr:nth-child(2) td:nth-child(2)").text().trim();

var site1 = "hotels.com";
var site2 = "ostrovok.ru";

var googleAPIPrefix="https://www.google.com/search?q=";

function httpGet(theUrl,type)
{
    GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,
        
        onload: function (xhr,theUrl,type) {
            r = xhr.responseText;
            //console.log(r);
            var ret="";
            try{
                //var data = $.parseJSON(xhr.responseText);
                ret = getUrl(r);
                //console.log(taskNumber);
                if (type==1)
                    window.postMessage({magicword: "mumbojumbo", url: ret, type:type}, "*");
                else
                    window.postMessage({magicword: "mumbojumbo", url: ret, type: type}, "*");
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
    var task = googleAPIPrefix+encodeURIComponent(name)+"+"+encodeURIComponent(city)+"+site:"+site1;
    var task2 = googleAPIPrefix+encodeURIComponent(name)+"+"+encodeURIComponent(city)+"+site:"+site2;
    console.log("TASK: "+task);
    console.log("TASK2: "+task2);
    var ret = [];
    ret.push(httpGet(task,1));
    ret.push(httpGet(task2,2));
    return ret;
}

function getUrl(obj){
    //console.log(obj);
    var html = $.parseHTML(obj);
    //var results = obj["responseData"]["results"];
    //var responseNum = getRandomInt(0,3);
    //var finalUrl = results[responseNum]["unescapedUrl"];
    var el = $( '<div></div>' );
    //var finalUrl = [];
    var finalUrl = "";
    el.html(html);
    //var element = $("#rso li.g", el).eq(getRandomInt(0,4));
    var element = $("#rso li.g", el).not("#imagebox_bigimages").eq(0);
    item = [];
    var $h3 = $("h3.r", element).eq(0);
    console.log($h3);
    if ($h3.length > 0) {
        console.log($("a", $h3).eq(0));
        url = $("a", $h3).eq(0).attr("href");
        finalUrl = url;
    }
    //console.log(element);
    //console.log("FINAL");
    //console.log(finalUrl.indexOf(site1));
    if (finalUrl.length > 0 && finalUrl.indexOf(site1) > -1 || finalUrl.indexOf(site2) > -1)
    	return finalUrl;
    else
        return "0";
}

$('table:first').parent().append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_button"
    }).click(function() {
        var resultURL = getGoogleResults();
    }));

$("#search_button").hide();

$("#search_button").click();

window.addEventListener("message", function(e) {
    if (e.data.magicword === "mumbojumbo") {
        console.log("Message Received");
        console.log(e.data.url);
        var urlLink = $("<a></a>",{
            text: "Click here to open found URL",
            href: e.data.url
        });
        console.log(urlLink);
        if (e.data.url.indexOf(site1) > -1){
        	var box = $("input[type=text]").eq(0);
            box.val(e.data.url);            
            box.closest("label").after(urlLink);
        }
        else{
        	var box = $("input[type=text]").eq(1);
            box.val(e.data.url);            
            box.closest("label").after(urlLink);
        }
    }
    else{
        console.log("Also message received");
        console.log(e.data);
    }
}, false);
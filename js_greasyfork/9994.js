// ==UserScript==
// @name         GroceryROI Script
// @version      0.1
// @description  Opens the amazon URL and gets the image for the product
// @author       Tjololo
// @match        https://www.mturkcontent.com/dynamic/hit*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/9994/GroceryROI%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/9994/GroceryROI%20Script.meta.js
// ==/UserScript==

var url = $("fieldset:first b a").attr("href");

var counter = 0;

var pics = [];

var random = Math.floor((Math.random() * 5) + 1)*1000;

$(".panel.panel-primary").hide();

var query = url;

$('fieldset:first').parent().append(
    $("<button></button>", {
        type: "button",
        text: "Search ",
        id: "search_button"
    }).click(function() {
        var resultURL = getGoogleResults(query);
    }));

$("#search_button").hide();

$("#search_button").click();

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
                console.log(ret);
                if (ret.length != 0){
                    $("<img></img>").attr("id", "image").attr("src", ret[counter]).appendTo($("fieldset:first")).click(function() { 
                        counter++;
                        if (counter >= ret.length) {
                            alert("Cycled");
                            counter = 0; 
                        }
                        $("#image").attr("src", ret[counter]); });
                }
            }
            catch(err){
                console.log("err "+err);
            }
            return r;
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
    url = [];
    el.html(html);
    $("input.a-button-input").each(function() { $(this).click(); });
    //console.log($("ul.a-nostyle.a-horizontal.list.maintain-height li img", el));
    $("ul.a-nostyle.a-horizontal.list.maintain-height li.image img", el).each(function() {
        console.log($(this));
        var items = JSON.parse($(this).attr("data-a-dynamic-image"));
        $.each( items, function( key, val ) {
                    url.push(key);
        });
        url.push($(this).attr("data-old-hires"));
    });
    return url;
}/**/
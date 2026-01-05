// ==UserScript==
// @name         Red Planet Hotels Limited Helper
// @version      0.1
// @description  makes place name into image search URL
// @author       You
// @match        https://www.mturkcontent.com/dynamic/hit*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/8954/Red%20Planet%20Hotels%20Limited%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/8954/Red%20Planet%20Hotels%20Limited%20Helper.meta.js
// ==/UserScript==

var urlHead = "https://www.google.com/search?tbm=isch&biw=640&bih=640&q=";

var attraction = $("tr:first td:last").text().replace(/ /g,"+");
var place = $("tr:last td:last").text().replace(" ","+");

var search = attraction+"+"+place;

var url = urlHead+search;

var baseNum = 0;
var count = 0;

var baseObject = "";

$("tr:first td:last").html("<a href=\""+url+"\">"+attraction.replace("+"," ")+"</a> click here to open google image search");

console.log(search);
googleSearch();

$("table:last").append($('<input/>', { type: "button", id: "minus", value: "<- Prev" }));
$("table:last").append($('<input/>', { type: "button", id: "plus", value: "Next ->" }));
$("table:last").append($("<p></p>"));
$('#plus').on('click', function(){
    baseNum++;
    getURL();
});

$('#minus').on('click', function(){
    baseNum--;
    getURL();
});

$("#gps_lat").click(function() {
    $("#gps_lat").val("");
});

$("div.panel.panel-primary").hide();

$("#gps_lat").bind ("input paste", function(e) {
    var val = $("#gps_lat").val();
    console.log(val);
    if (val != ""){
        var parts = val.split(',');
        $("#gps_lat").val(parts[0].trim());
        $("#gps_lon").val(parts[1].trim());
    }
});

var googMapSearch = "https://www.google.com/maps/search/"+search;
$("table:last").append($("<a></a>", { href: googMapSearch}).text("Click here to open google map search"));

function googleSearch() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        synchronous: true,

        onload: function (xhr) {
            r = xhr.responseText;
            try{
                baseObject = r;
                getURL();
            }
            catch(err){
                console.log(err);
                return r;
            }
        }
    });
}

function getURL(){
    obj = baseObject;
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    el.html(html);
    var element = $(".rg_di.rg_el a", el).eq(baseNum);
    console.log(element);
    var finalUrl = element.attr("href");
    finalUrl = finalUrl.replace(/.*imgurl=(.*)&imgrefurl=.*/,"$1");
    $("#web_url").val(finalUrl);
    $("tr:last td:last").html("<a href=\""+finalUrl+"\">"+place.replace("+"," ")+"</a> click to open picture");
}
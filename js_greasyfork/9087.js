// ==UserScript==
// @name         Web Test Helper
// @version      0.3
// @description  Helps with the "get linkedin url" hits from Web Test
// @author       Tjololo
// @match        https://s3.amazonaws.com/mturk_bulk/hits/*
// @require      http://code.jquery.com/jquery-git.js
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/9087/Web%20Test%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/9087/Web%20Test%20Helper.meta.js
// ==/UserScript==

var googleAPIPrefix="https://www.google.com/search?q=";
var regex = /Please search for (.*) in (.*) with (.*) and answer a short survey about their LinkedIn profile/
var text = $('h3:first').text();
var groups = regex.exec(text);

var pageurl = "";

var name = groups[1];
var location = groups[2];
var company = groups[3];

var search_string = encodeURIComponent(name).replace(/%20/g,"+")+"+"+encodeURIComponent(location).replace(/%20/g,"+")+"+"+encodeURIComponent(company).replace(/%20/g,"+")+"+site:linkedin.com";
var search_url = googleAPIPrefix+search_string;

$('h3:first').html("<a href=\""+search_url+"\">"+text+"</a>");

httpGet(search_url);

console.log(search_url);

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
                getUrl(r);
            }
            catch(err){
                console.log(err);
                console.log(r);
                return r;
            }
        }
    });
}

function checkPubUrl(theUrl)
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
                var html = $.parseHTML(r);
                var el = $( '<div></div>' );
                var finalUrl = [];
                el.html(html);
                var element = $("a.view-public-profile", el).eq(0);
                if (element.length > 0)
                    $('#Q3ProfileURL').val(element.text());
                else
                    $('#Q3ProfileURL').val(pageurl);
            }
            catch(err){
                $('#Q3ProfileURL').val(pageurl);
                console.log(err);
                console.log(r);
                return r;
            }
        }
    });
}

function getUrl(obj){
    var html = $.parseHTML(obj);
    var el = $( '<div></div>' );
    var finalUrl = [];
    el.html(html);
    var element = $("#rso li.g", el).not("#imagebox_bigimages").eq(0);
    console.log(element.length);
    if (element.length <= 0){
        $('input[value="No"]').click();
    }
    else{
        item = [];
        var $h3 = $("h3.r", element).eq(0);
        console.log($h3);
        if ($h3.length > 0) {
            console.log($("a", $h3).eq(0));
            url = $("a", $h3).eq(0).attr("href");
            if (url.indexOf("https://www.linkedin.com/") > -1 && url.indexOf("/dir/") == -1){
                $('input[value="Yes"]').click();
                checkPubUrl(url);
                pageurl = decodeURIComponent(url);
            }
        }
    }
}
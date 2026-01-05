// ==UserScript==
// @name        Paidverts Clicker with AdBlock
// @description Earn money without advertising!
// @icon        http://www.paidverts.com/favicon.ico
// @include     http://paidverts.com/member/*
// @include     http://www.paidverts.com/member/*
// @include     https://paidverts.com/member/*
// @include     https://www.paidverts.com/member/*
// @copyright   2014+, TheOttomanSlap
// @homeURL     https://greasyfork.org/scripts/7014-paidverts-clicker-with-adblock
// @namespace   https://openuserjs.org/scripts/TheOttomanSlap/Paidverts_Clicker_with_AdBlock
// @version     1.1
// @author      TheOttomanSlap
// @downloadURL https://update.greasyfork.org/scripts/7014/Paidverts%20Clicker%20with%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/7014/Paidverts%20Clicker%20with%20AdBlock.meta.js
// ==/UserScript==

// (if you dont want to notification sound)  -- Write /* sixty-first line and write */ sixty-sixth line

var click = document.createEvent("HTMLEvents");
click.initEvent("click", true, true);

$("#copy-1").click();
$("#copy-2").click();
$("#copy-3").click();
$(".banners125").remove();
$(".member_top").remove();
$(".frame_bar").remove();
$("#adcopy_response").focus();

if(document.location.href.indexOf("paidverts.com/member/paid_ads.html") > -1){
    document.getElementById('view-1').dispatchEvent(click);
}

if(document.location.href.indexOf("paidverts.com/member/paid_ads_interaction") > -1){
   
    document.getElementById('view_ad').dispatchEvent(click);
    var scrolll = document.getElementById("text-1");
    scrolll.scrollIntoView(true);

    setTimeout(function() {
        document.getElementById('new_ad').dispatchEvent(click);
    }, 38000);  // 38000=38 seconds for click new ad button  

}

if(document.location.href.indexOf("paidverts.com/member/activation_ad.html") > -1){

    document.getElementById('view_ad').dispatchEvent(click);
    var scrolll = document.getElementById("text-1");
    scrolll.scrollIntoView(true);


    setTimeout(function() {
        GM_setValue ("https://www.paidverts.com/member/activation_ad.html", window.location.href);
        var MyURL               = GM_getValue ("https://www.paidverts.com/member/activation_ad.html");
        window.location.href    = MyURL;
    },38000);   // 38000=38 seconds for new activation ad page
}

if(document.location.href.indexOf("/member/paid_ads_view_") > -1){
    $("top_bar").ready(function() {
        
        setTimeout(function() {
            var snd = new Audio("http://soundjax.com/reddo/88877%5EDingLing.mp3");
            snd.play();
        },2000);    // 2000=2 seconds for play notification sound

        setTimeout(function() {
            document.getElementById('button').dispatchEvent(click);
        },31500);   // 31500=31.5 seconds for click confirm button
        
        setTimeout(function() {
            document.getElementById('closeBtn').dispatchEvent(click);
        },33500);   // 33500=33.5 seconds for click close ad button
});  
}
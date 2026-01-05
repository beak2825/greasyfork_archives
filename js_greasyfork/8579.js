// ==UserScript==
// @name         Review progress for today
// @version      1.01
// @description  Adds your review progress for today
// @author       nicael
// @include        *://*.stackexchange.com/review/*
// @include        *://*stackoverflow.com/review/*
// @include        *://*serverfault.com/review/*
// @include        *://*superuser.com/review/*
// @include        *://*askubuntu.com/review/*
// @include        *://*stackapps.com/review/*
// @grant        none
// @namespace https://greasyfork.org/users/9713
// @downloadURL https://update.greasyfork.org/scripts/8579/Review%20progress%20for%20today.user.js
// @updateURL https://update.greasyfork.org/scripts/8579/Review%20progress%20for%20today.meta.js
// ==/UserScript==

setInterval(function(){
    if($("smp").length===0){$("#badge-progress-count").prepend("<tm style='display:none'></tm><smp>...</smp> <div class='meter' style='display:inline-block;width:100px;height:9px;margin-top:1.3px;margin-right:5px;margin-left:5px;'><div style='background-color:#8fc77e;width:0%;' class='prg'></div></div> | ");}
    var sz = 0;$("tm").load(location.href.replace(location.href.split("/")[5], "") + "/stats .review-stats-count:first", function () {
    sz = parseInt($("tm > a").text().replace(/,/, ""));
    sz = sz > 1000 ? 40 : 20;
    $("tm").remove();
    $("smp").load(location.href.replace(location.href.split("/")[5], "") + "/stats .review-stats-count-current-user:first", function() {
        $("smp > td").removeClass("review-stats-count-current-user");
        $("smp > td").css({
            "display": "inline"
        });
        $(".prg").css({
            "width": parseInt($("smp").text())/sz*100 + "%"
        });
        $("smp").text($("smp").text()+" / "+sz);
        
    });
});
},500)
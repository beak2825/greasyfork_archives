// ==UserScript==
// @name         Dev Mini review controller
// @version      0.2
// @description  Adds an ability to see the review queues by hovering "review" link (test edition) 
// @author       nicael
// @include        *://*.stackexchange.com/*
// @include        *://*stackoverflow.com/*
// @include        *://*serverfault.com/*
// @include        *://*superuser.com/*
// @include        *://*askubuntu.com/*
// @include        *://*stackapps.com/*
// @include        *://*mathoverflow.net/*
// @grant        none
// @namespace    https://greasyfork.org/users/9713
// @downloadURL https://update.greasyfork.org/scripts/8710/Dev%20Mini%20review%20controller.user.js
// @updateURL https://update.greasyfork.org/scripts/8710/Dev%20Mini%20review%20controller.meta.js
// ==/UserScript==

$(".topbar-wrapper").append('<div class="topbar-dialog cfr" style="top: 34px; display: none;"><div class="modal-content crd" style="margin-top:-1px;"><ul><li><div><img src="/content/img/progress-dots.gif"></div></li></ul></div></div>');
$(".topbar-menu-links > a[href='/review']").append('&nbsp;<span class="icon-help"><div class="triangle" style=""></div></span><tmp style="display:none"></tmp>')

$("tmp").load("/review .dashboard-num",function(){
    var stats=[];
    $("tmp > .dashboard-num").each(function(){
        stats.push($(this).text());
    });
    
    $("tmp").load("/review .dashboard-title > a",function(){$(".crd>ul>li").remove();
    $("tmp>a").each(function(index){
        if($(this).text()!="Meta Reviews"){
            $(".crd>ul").append('<li><div><span style="display:inline-block;width:15px;text-align:center;margin:2px;color:grey;">'+stats[index]+'</span>&nbsp;<a href="'+$(this).attr("href")+'">'+$(this).text()+'</a></div></li>');
        }else{
            $(".crd>ul").append('<li><div><span style="display:inline-block;width:15px;text-align:center;margin:2px;color:grey;"></span>&nbsp;<a href="'+$(this).attr("href")+'">'+$(this).text()+'</a></div></li>');
        }
    });
});})


$(".topbar-menu-links > a[href='/review']").hover(function(){$(this).addClass("topbar-icon-on").css({"color":"black"});$(".cfr").css({"display":"block"});})
$(".cfr").hover(function(){$(".topbar-menu-links > a[href='/review']").addClass("topbar-icon-on").css({"color":"black"});$(".cfr").css({"display":"block"})})
$(".topbar-menu-links > a[href='/review']").mouseleave(function(){$(this).removeClass("topbar-icon-on").css({"color":"#e0e0e0"});$(".cfr").css({"display":"none"})})
$(".cfr").mouseleave(function(){$(".topbar-menu-links > a[href='/review']").removeClass("topbar-icon-on").css({"color":"#e0e0e0"});$(".cfr").css({"display":"none"})})
// ==UserScript==
// @name         Mini review controller
// @version      1.3
// @description  Adds an ability to see the review queues by hovering "review" link 
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
// @downloadURL https://update.greasyfork.org/scripts/8709/Mini%20review%20controller.user.js
// @updateURL https://update.greasyfork.org/scripts/8709/Mini%20review%20controller.meta.js
// ==/UserScript==


//$(".help-dialog").hover(function(){alert($(this).css("left"))})
$(".topbar-wrapper").append('<div class="topbar-dialog cfr" style="top: 34px; left: 650px; display: none;"><div class="modal-content crd" style="margin-top:-1px;"><ul><li><div><img src="/content/img/progress-dots.gif"></div></li></ul></div></div>');
$(".topbar-menu-links > a[href='/review']:last").append('&nbsp;<span class="icon-help"><div class="triangle" style=""></div></span><tmp style="display:none"></tmp>')

$("tmp").load("/review .dashboard-num",function(){
    var stats=[];
    $("tmp > .dashboard-num").each(function(){
        stats.push($(this).text());
    });
    
    $("tmp").load("/review .dashboard-title > a",function(){$(".crd>ul>li").remove();
    $("tmp>a").each(function(index){
        if($(this).text()!="Meta Reviews"){
            $(".crd>ul").append('<li><div><span style="display:inline-block;width:20px;text-align:center;margin:2px;color:grey;">'+stats[index]+'</span>&nbsp;<a href="'+$(this).attr("href")+'">'+$(this).text()+'</a></div></li>');
        }else{
            $(".crd>ul").append('<li><div><span style="display:inline-block;width:20px;text-align:center;margin:2px;color:grey;"></span>&nbsp;<a href="'+$(this).attr("href")+'">'+$(this).text()+'</a></div></li>');
        }
    });
});})


$(".topbar-menu-links > a[href='/review']:last").hover(function(){$(this).addClass("topbar-icon-on").css({"color":"black"});$(".cfr").css({"display":"block"});})
$(".cfr").hover(function(){$(".topbar-menu-links > a[href='/review']:last").addClass("topbar-icon-on").css({"color":"black"});$(".cfr").css({"display":"block"})})
$(".topbar-menu-links > a[href='/review']:last").mouseleave(function(){$(this).removeClass("topbar-icon-on").css({"color":"#e0e0e0"});$(".cfr").css({"display":"none"})})
$(".cfr").mouseleave(function(){$(".topbar-menu-links > a[href='/review']:last").removeClass("topbar-icon-on").css({"color":"#e0e0e0"});$(".cfr").css({"display":"none"})})
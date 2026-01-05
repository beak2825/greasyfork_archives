// ==UserScript==
// @name         Rep farmer
// @namespace    
// @version      0.1
// @description  effeciently farms rep
// @author       nicael
// @include      http://edx-cs169-1x.stackexchange.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/8760/Rep%20farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/8760/Rep%20farmer.meta.js
// ==/UserScript==

//<div class="message message-error message-dismissable" style="position: absolute; display: block;">
 //   <div class="message-inner"><div title="close this message (or hit Esc)" class="message-close">×
 //   </div><div class="message-text" style="padding-right: 35px;">You last voted on this question 5 mins ago. Your vote is now locked in unless this question is edited.</div></div></div>

$(".network-items").append('<a id="farm-link" class="topbar-icon icon-inbox-mod yes-hover" title="pick a question with >3 answers to be able to farm (click to do it)"></a> <div id="farm-stats" style="display:inline-block;color:white;margin-top:10px;"></div>');

if(location.href.split("/")[3]=="questions"&&location.href.split("/")[4]&&parseInt($("*[itemprop='answerCount']").text())>2){

$("#farm-link").prop('title', 'click to start farming!');
if(localStorage.mod=="true"){
    
    $("#farm-link").addClass("icon-inbox-mod-unread");
    $("#farm-stats").hide().fadeIn(500);
    prepareTimer();
}else{
    $("#farm-stats").hide();
}
if(localStorage.modf=="true"){
    $("#farm-stats").text("switching off");
    $("#farm-link").removeClass("icon-inbox-mod-announcements").addClass("icon-inbox-mod-unread");
    localStorage.modf=false;
    $("#farm-stats").fadeIn(500,switchoffTimer);
}
$("#farm-link").click(function(){
    if(!$(this).hasClass("icon-inbox-mod-unread")||!$(this).hasClass("icon-inbox-mod-announcements")){
        
        $(this).addClass("icon-inbox-mod-unread");
        localStorage.mod=true;
        $("#farm-stats").hide().fadeIn(500);
        prepareTimer();
    }
    
    if($(this).hasClass("icon-inbox-mod-announcements")){
        localStorage.mod=false;
        localStorage.modf=true;
        location.reload();
    }
});


function prepareTimer(){
    $("#farm-stats").text("preparing for launch...");
    var down = document.getElementsByClassName("vote-down-on");
    for(var a=0;a<down.length;a++){
        down[a].click();
    }
    setTimeout(launchTimer,2000);
}

function launchTimer(){
    
    $("#farm-link").removeClass("icon-inbox-mod-unread").addClass("icon-inbox-mod-announcements");
    $("#farm-stats").text("farming");
    var down = document.getElementsByClassName("vote-down-off");
    for(var a=0;a<down.length;a++){
        down[a].click();
    }
    var i = 0;
    var timer = setInterval(function(){
        if(i<down.length){
            down[i].click();
            if($(".message-error > .message-inner > .message-text").length>0){
                alert("question exhausted; pick a new one")
                localStorage.mod=false;
                localStorage.modf=true;
                location.reload();
            }
            i++;
        }else{
            timer=null;
            clearInterval(timer);
            location.reload();
        }
    },1100);
}
function switchoffTimer(){
    $("#farm-stats").text("switching off");
    $("#farm-link").removeClass("icon-inbox-mod-announcements").addClass("icon-inbox-mod-unread");
    $(".vote-down-on").click();
   
    localStorage.mod=false;
    $("#farm-stats").text("timer switched off");
    setTimeout(function(){$("#farm-stats").fadeOut(100,function(){location.reload();});},2000);
}
}else{
    $("#farm-link").click(function(){location.href="/search?q=answers%3A3";})
}
// ==UserScript==
// @name        BlockTMS & AutoTimer
// @description Prevent use form page other than viewing, and adding countdown timers
// @namespace   dnk-tms
// @include     http://10.86.210.8:9000/*
// @version     2.2.7
// @downloadURL https://update.greasyfork.org/scripts/674/BlockTMS%20%20AutoTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/674/BlockTMS%20%20AutoTimer.meta.js
// ==/UserScript==

//http://10.86.210.8:8000/schedule/

window.onload=function(){


$("body").css("cursor", "none");

var blockDiv = document.createElement("div");

blockDiv.style.position="fixed";
blockDiv.style.width="100%";
blockDiv.style.height="100%";
blockDiv.style.background="black";
blockDiv.style.top="0px";
blockDiv.style.left="0px";
blockDiv.style.zIndex="6000";
blockDiv.style.opacity="0.0";

document.getElementsByTagName("body")[0].appendChild(blockDiv);

if(document.URL.substring(0,41)=="http://10.86.210.8:9000/tms/#schedule_pag"){

blockDiv.style.height="83px";

var blockDiv2 = document.createElement("div");

blockDiv2.style.position="fixed";
blockDiv2.style.width="100%";
blockDiv2.style.height="100%";
blockDiv2.style.background="red";
blockDiv2.style.top="110px";
blockDiv2.style.left="0px";
blockDiv2.style.zIndex="6000";
blockDiv2.style.opacity="0.0";

document.getElementsByTagName("body")[0].appendChild(blockDiv2);

setTimeout(function(){
    window.location.reload();},864000000);}

/////////////////////////////////////////////////////////////

if(document.URL.substring(0,48)=="http://10.86.210.8:9000/tms/#monitor_page#medium"){

var time1Device="div.monitor_medium_device[device_id=b94642c1-cbc8-44c5-b3c4-df0277e21df5]";
var time1Add = 15;
var time1Start = new Date();
var time1Running = false;
var time1Paused = false;
var time2Device="div.monitor_medium_device[device_id=90f9f8e3-beae-466f-8a46-f17c61c78644]";
var time2Add = 15;
var time2Start = new Date();
var time2Running = false;
var time2Paused = false;
var time3Device="div.monitor_medium_device[device_id=e3cdf9d3-b75d-4027-bb28-65b4c36a7917]";
var time3Add = 15;
var time3Start = new Date();
var time3Running = false;
var time3Paused = false;
var time4Device="div.monitor_medium_device[device_id=47c14fed-c9e9-4a66-b6f9-3fc391fabf57]";
var time4Add = 15;
var time4Start = new Date();
var time4Running = false;
var time4Paused = false;
var time5Device="div.monitor_medium_device[device_id=25b6f3db-756f-42a4-ac64-2a22691b042b]";
var time5Add = 15;
var time5Start = new Date();
var time5Running = false;
var time5Paused = false;
var timeDiff;
var timeDiffM;
var timeDiffS;
var shouldPause;

function timeRun(){
    var now=new Date();
    var pgt=parseFloat($(time1Device+" div.playback_progress div.playback_progress_bar").parent().width())/100;
    var pg1=parseFloat($(time1Device+" div.playback_progress div.playback_progress_bar").width())/pgt;
    var pg2=parseFloat($(time2Device+" div.playback_progress div.playback_progress_bar").width())/pgt;
    var pg3=parseFloat($(time3Device+" div.playback_progress div.playback_progress_bar").width())/pgt;
    var pg4=parseFloat($(time4Device+" div.playback_progress div.playback_progress_bar").width())/pgt;
    var pg5=parseFloat($(time5Device+" div.playback_progress div.playback_progress_bar").width())/pgt;
    
	if(pg1>30&&pg1<80){
		if($(time1Device).hasClass("pause")||$(time1Device+" div.monitor_live_playlist_wrapper>div:first-child").hasClass("active")||$(time1Device+" div.monitor_live_playlist_wrapper>div.active div.image.content_attributes").hasClass("psa"))shouldPause=true;
		else shouldPause=false;
        if(time1Running){
            timeDiff=(time1Start.getTime()+time1Add*60000-now.getTime())/1000;
            if(timeDiff<0){
                $("div.timeContainer#tc1").css("color", "rgb(178, 0, 75)");
                timeDiff=timeDiff*-1+1;}
            timeDiffM=Math.floor(timeDiff/60);
            timeDiffS=Math.floor(timeDiff-timeDiffM*60);
            if(timeDiffS<10)$("div.timeContainer#tc1").html(timeDiffM+":0"+timeDiffS);
            else $("div.timeContainer#tc1").html(timeDiffM+":"+timeDiffS);
	
			if($(time1Device).hasClass("pause"))time1Paused=true;
			else if(!shouldPause&&time1Paused)time1_stop();}
        else if(shouldPause){
			time1_start();}}
    else if(time1Running)time1_stop();    
	
	if(pg2>30&&pg2<80){
		if($(time2Device).hasClass("pause")||$(time2Device+" div.monitor_live_playlist_wrapper>div:first-child").hasClass("active")||$(time2Device+" div.monitor_live_playlist_wrapper>div.active div.image.content_attributes").hasClass("psa"))shouldPause=true;
		else shouldPause=false;
        if(time2Running){
            timeDiff=(time2Start.getTime()+time2Add*60000-now.getTime())/1000;
            if(timeDiff<0){
                $("div.timeContainer#tc2").css("color", "rgb(178, 0, 75)");
                timeDiff=timeDiff*-1+1;}
            timeDiffM=Math.floor(timeDiff/60);
            timeDiffS=Math.floor(timeDiff-timeDiffM*60);
            if(timeDiffS<10)$("div.timeContainer#tc2").html(timeDiffM+":0"+timeDiffS);
            else $("div.timeContainer#tc2").html(timeDiffM+":"+timeDiffS);
	
			if($(time2Device).hasClass("pause"))time2Paused=true;
			else if(!shouldPause&&time2Paused)time2_stop();}
        else if(shouldPause){
			time2_start();}}
    else if(time2Running)time2_stop();
    
	if(pg3>30&&pg3<80){
		if($(time3Device).hasClass("pause")||$(time3Device+" div.monitor_live_playlist_wrapper>div:first-child").hasClass("active")||$(time3Device+" div.monitor_live_playlist_wrapper>div.active div.image.content_attributes").hasClass("psa"))shouldPause=true;
		else shouldPause=false;
        if(time3Running){
            timeDiff=(time3Start.getTime()+time3Add*60000-now.getTime())/1000;
            if(timeDiff<0){
                $("div.timeContainer#tc3").css("color", "rgb(178, 0, 75)");
                timeDiff=timeDiff*-1+1;}
            timeDiffM=Math.floor(timeDiff/60);
            timeDiffS=Math.floor(timeDiff-timeDiffM*60);
            if(timeDiffS<10)$("div.timeContainer#tc3").html(timeDiffM+":0"+timeDiffS);
            else $("div.timeContainer#tc3").html(timeDiffM+":"+timeDiffS);
	
			if($(time3Device).hasClass("pause"))time3Paused=true;
			else if(!shouldPause&&time3Paused)time3_stop();}
        else if(shouldPause){
			time3_start();}}
    else if(time3Running)time3_stop();
    
	if(pg4>30&&pg4<80){
		if($(time4Device).hasClass("pause")||$(time4Device+" div.monitor_live_playlist_wrapper>div:first-child").hasClass("active")||$(time4Device+" div.monitor_live_playlist_wrapper>div.active div.image.content_attributes").hasClass("psa"))shouldPause=true;
		else shouldPause=false;
        if(time4Running){
            timeDiff=(time4Start.getTime()+time4Add*60000-now.getTime())/1000;
            if(timeDiff<0){
                $("div.timeContainer#tc4").css("color", "rgb(178, 0, 75)");
                timeDiff=timeDiff*-1+1;}
            timeDiffM=Math.floor(timeDiff/60);
            timeDiffS=Math.floor(timeDiff-timeDiffM*60);
            if(timeDiffS<10)$("div.timeContainer#tc4").html(timeDiffM+":0"+timeDiffS);
            else $("div.timeContainer#tc4").html(timeDiffM+":"+timeDiffS);
	
			if($(time4Device).hasClass("pause"))time4Paused=true;
			else if(!shouldPause&&time4Paused)time4_stop();}
        else if(shouldPause){
			time4_start();}}
    else if(time4Running)time4_stop();
    
	if(pg5>30&&pg5<80){
		if($(time5Device).hasClass("pause")||$(time5Device+" div.monitor_live_playlist_wrapper>div:first-child").hasClass("active")||$(time5Device+" div.monitor_live_playlist_wrapper>div.active div.image.content_attributes").hasClass("psa"))shouldPause=true;
		else shouldPause=false;
        if(time5Running){
            timeDiff=(time5Start.getTime()+time5Add*60000-now.getTime())/1000;
            if(timeDiff<0){
                $("div.timeContainer#tc5").css("color", "rgb(178, 0, 75)");
                timeDiff=timeDiff*-1+1;}
            timeDiffM=Math.floor(timeDiff/60);
            timeDiffS=Math.floor(timeDiff-timeDiffM*60);
            if(timeDiffS<10)$("div.timeContainer#tc5").html(timeDiffM+":0"+timeDiffS);
            else $("div.timeContainer#tc5").html(timeDiffM+":"+timeDiffS);
	
			if($(time5Device).hasClass("pause"))time5Paused=true;
			else if(!shouldPause&&time5Paused)time5_stop();}
        else if(shouldPause){
			time5_start();}}
    else if(time5Running)time5_stop();
	
	
    setTimeout(function(){timeRun();}, 1000);}

function time1_start(){
    time1Running=true;
    $("div.timeContainer#tc1").css("background-color", "rgba(34,34,34,0.75)");
    $("div.timeContainer#tc1").css("color", "white");
    time1Start=new Date();}

function time1_stop(){
    time1Running=false;
	time1Pause=false;
    $("div.timeContainer#tc1").html("");
    $("div.timeContainer#tc1").css("background-color", "rgba(34,34,34,0.5)");
    $("div.timeContainer#tc1").css("color", "white");}

function time2_start(){
    time2Running=true;
    $("div.timeContainer#tc2").css("background-color", "rgba(34,34,34,0.75)");
    $("div.timeContainer#tc2").css("color", "white");
    time2Start=new Date();}

function time2_stop(){
    time2Running=false;
	time2Pause=false;
    $("div.timeContainer#tc2").html("");
    $("div.timeContainer#tc2").css("background-color", "rgba(34,34,34,0.5)");
    $("div.timeContainer#tc2").css("color", "white");}

function time3_start(){
    time3Running=true;
    $("div.timeContainer#tc3").css("background-color", "rgba(34,34,34,0.75)");
    $("div.timeContainer#tc3").css("color", "white");
    time3Start=new Date();}

function time3_stop(){
    time3Running=false;
	time3Pause=false;
    $("div.timeContainer#tc3").html("");
    $("div.timeContainer#tc3").css("background-color", "rgba(34,34,34,0.5)");
    $("div.timeContainer#tc3").css("color", "white");}

function time4_start(){
    time4Running=true;
    $("div.timeContainer#tc4").css("background-color", "rgba(34,34,34,0.75)");
    $("div.timeContainer#tc4").css("color", "white");
    time4Start=new Date();}

function time4_stop(){
    time4Running=false;
	time4Pause=false;
    $("div.timeContainer#tc4").html("");
    $("div.timeContainer#tc4").css("background-color", "rgba(34,34,34,0.5)");
    $("div.timeContainer#tc4").css("color", "white");}

function time5_start(){
    time5Running=true;
    $("div.timeContainer#tc5").css("background-color", "rgba(34,34,34,0.75)");
    $("div.timeContainer#tc5").css("color", "white");
    time5Start=new Date();}

function time5_stop(){
    time5Running=false;
	time5Pause=false;
    $("div.timeContainer#tc5").html("");
    $("div.timeContainer#tc5").css("background-color", "rgba(34,34,34,0.5)");
    $("div.timeContainer#tc5").css("color", "white");}

var timeDiv1 = document.createElement("div");
timeDiv1.className="timeContainer";
timeDiv1.id="tc1";
document.getElementsByTagName("body")[0].appendChild(timeDiv1);
var timeDiv2 = document.createElement("div");
timeDiv2.className="timeContainer";
timeDiv2.id="tc2";
document.getElementsByTagName("body")[0].appendChild(timeDiv2);
var timeDiv3 = document.createElement("div");
timeDiv3.className="timeContainer";
timeDiv3.id="tc3";
document.getElementsByTagName("body")[0].appendChild(timeDiv3);
var timeDiv4 = document.createElement("div");
timeDiv4.className="timeContainer";
timeDiv4.id="tc4";
document.getElementsByTagName("body")[0].appendChild(timeDiv4);
var timeDiv5 = document.createElement("div");
timeDiv5.className="timeContainer";
timeDiv5.id="tc5";
document.getElementsByTagName("body")[0].appendChild(timeDiv5);

$("div.timeContainer").attr("style", "font-weight: medium; color: white; background-color: rgba(34, 34, 34, 0.5); width: 275px; display: block; position: fixed; z-index: 999; text-align: center; font-size: 50px; height: 120px; padding-top: 50px; text-shadow: 0px 3px 5px rgb(34, 34, 34);");
$("div.timeContainer#tc1").css("left", "6px");
$("div.timeContainer#tc2").css("left", "293px");
$("div.timeContainer#tc3").css("left", "581px");
$("div.timeContainer#tc4").css("left", "6px");
$("div.timeContainer#tc5").css("left", "293px");

$("div.timeContainer#tc1").css("top", "152px");
$("div.timeContainer#tc2").css("top", "152px");
$("div.timeContainer#tc3").css("top", "152px");
$("div.timeContainer#tc4").css("top", "475px");
$("div.timeContainer#tc5").css("top", "475px");


$("div.timeContainer#tc1").html("");
$("div.timeContainer#tc2").html("");
$("div.timeContainer#tc3").html("");
$("div.timeContainer#tc4").html("");
$("div.timeContainer#tc5").html("");

$("body").css("-moz-user-select", "none");
timeRun();
}


$("div#screen_status_bar").css("height", "35px");
$("div#main_section").css("bottom", "35px");

function loadSchedule(){
    if(time1Running==false)$("div.monitor_medium_device[device_id=b94642c1-cbc8-44c5-b3c4-df0277e21df5] div.monitor_medium_device_tabs li[tab=schedule]").trigger("click");
    if(time2Running==false)$("div.monitor_medium_device[device_id=90f9f8e3-beae-466f-8a46-f17c61c78644] div.monitor_medium_device_tabs li[tab=schedule]").trigger("click");
    if(time3Running==false)$("div.monitor_medium_device[device_id=e3cdf9d3-b75d-4027-bb28-65b4c36a7917] div.monitor_medium_device_tabs li[tab=schedule]").trigger("click");
    if(time4Running==false)$("div.monitor_medium_device[device_id=47c14fed-c9e9-4a66-b6f9-3fc391fabf57] div.monitor_medium_device_tabs li[tab=schedule]").trigger("click");
    if(time5Running==false)$("div.monitor_medium_device[device_id=25b6f3db-756f-42a4-ac64-2a22691b042b] div.monitor_medium_device_tabs li[tab=schedule]").trigger("click");
    setTimeout(function(){loadSchedule();},600000);}
setTimeout(function(){loadSchedule();}, 15000);}
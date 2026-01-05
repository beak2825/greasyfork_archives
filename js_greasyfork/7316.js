// ==UserScript==
// @name         lazyScroller
// @version      1.0
// @description  Keep your hand free from scroll button.
// @namespace    idmresettrial
// @author       idmresettrial
// @run-at       document-end
// @grant        none

// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js

// Website list

// @match        *://*/*

// End list


// @downloadURL https://update.greasyfork.org/scripts/7316/lazyScroller.user.js
// @updateURL https://update.greasyfork.org/scripts/7316/lazyScroller.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

// Do not run on frames or iframes
if (window.top !== window.self) {
  return;
}

red = "#f84848"; green = "#7abf16"; blue = "#3e68b3";
color = blue;

transparent = 0.5;

distance = $(window).height()-50;
duration = 250;

wait = 500;
pause = 1000;
var repeat;

direct = "lazySleep";

lazyScroller = '<div id="lazyScroller"><div class="lazyButton" id="lazyUp">↑</div><div class="lazyButton" id="lazyDown">↓</div></div>';

$("body").append(lazyScroller);
$("#lazyScroller").css({"cursor":"default", "position":"fixed", "top":"-100px", "left":"-100px", "margin":"10px", "z-index":"999"});
$(".lazyButton").css({"margin":"2px", "width":"20px", "height":"20px", "font-family":"calibri", "font-size":"12px", "line-height":"20px", "text-align":"center", "background":color, "color":"#FFFFFF"});
$(".lazyButton").fadeTo(0, transparent);

$(window).mousemove(function(e) {
    if (Math.abs(parseInt($("#lazyScroller").css("left"))-e.clientX)>50 || Math.abs(parseInt($("#lazyScroller").css("top"))-e.clientY)>100) {
        $("#lazyScroller").css({"left":e.clientX, "top":e.clientY, "display":"none"});
    } else {   
        $("#lazyScroller").slideDown();
    }
});

$(window).scroll(function() {
    
    if ($(window).scrollTop() === 0) {
        $("#lazyUp").html("→");
    } else if ($(window).scrollTop() === ($(document).height()-$(window).height())) {
        $("#lazyDown").html("←");
    } else {
        $("#lazyUp").html("↑");
        $("#lazyDown").html("↓");
    }
    
});

$("#lazyScroller .lazyButton").mouseover(function() {
    direct = $(this).attr("id");
    $(this).fadeTo(500, 1);
    repeat = setTimeout(function() {go();},wait);
});

$("#lazyScroller .lazyButton").mouseout(function() {
    direct = "lazySleep";
    $(this).fadeTo(500, transparent);
    clearTimeout(repeat);
});

$("#lazyScroller #lazyUp").click(function() {
    if ($(window).scrollTop() === 0) {
        direct = "lazyNext";
    } else {
        direct = "lazyTop";
    }
    go();
});

$("#lazyScroller #lazyDown").click(function() {
    if ($(window).scrollTop() === ($(document).height()-$(window).height())) {
        direct = "lazyBack";
    } else {
        direct = "lazyBottom";
    }
    go();
});

function go()
{
    if (direct === "lazyUp") {
        $("html, body").animate({scrollTop: ($(window).scrollTop()-distance)}, duration);
        repeat = setTimeout(function() {go();},duration+pause);
    } else if (direct === "lazyDown") {
        $("html, body").animate({scrollTop: ($(window).scrollTop()+distance)}, duration);
        repeat = setTimeout(function() {go();},duration+pause);
    } else if (direct === "lazyTop") {
        $("html, body").animate({scrollTop: 0},duration);
    } else if (direct === "lazyBottom") {
        $("html, body").animate({scrollTop: ($(document).height()-$(window).height())},duration);
    } else if (direct === "lazyNext") {
        history.go(+1);
    } else if (direct === "lazyBack") {
        history.go(-1);
    }
}
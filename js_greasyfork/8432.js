// ==UserScript==
// @name        WK Reviews Timer 
// @namespace   http://ausajocs.com/
// @description Adds a timer counter with pause option during the reviews for WankiKani
// @include     *.wanikani.com/review/*
// @include     *.wanikani.com/review
// @version     0.3
// @author 		Delacannon
// @downloadURL https://update.greasyfork.org/scripts/8432/WK%20Reviews%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/8432/WK%20Reviews%20Timer.meta.js
// ==/UserScript==

//http://jsbin.com/gist/4372563?html,css,js,output
var clsStopwatch = function () {

    var startAt = 0; // Time of last start / resume. (0 if not running)
    var lapTime = 0; // Time on the clock when last stopped in milliseconds

    var now = function () {
        return (new Date()).getTime();
    };

    // Public methods
    // Start or resume
    this.start = function () {
        startAt = startAt ? startAt : now();
    };

    // Stop or pause
    this.stop = function () {
        // If running, update elapsed time otherwise keep it
        lapTime = startAt ? lapTime + now() - startAt : lapTime;
        startAt = 0; // Paused
    };

    // Reset
    this.reset = function () {
        lapTime = startAt = 0;
    };

    // Duration
    this.time = function () {
        return lapTime + (startAt ? now() - startAt : 0);
    };
};

var x = new clsStopwatch();
var $time;
var clocktimer;
var state;

function pad(num, size) {
    var s = "0000" + num;
    return s.substr(s.length - size);
}

function formatTime(time) {
    var h = m = s = ms = 0;
    var newTime = '';

    h = Math.floor(time / (60 * 60 * 1000));
    time = time % (60 * 60 * 1000);
    m = Math.floor(time / (60 * 1000));
    time = time % (60 * 1000);
    s = Math.floor(time / 1000);
    ms = time % 1000;

    newTime = pad(h, 2) + ':' + pad(m, 2) + ':' + pad(s, 2);
    return newTime;
}

function show() {
    $time = document.getElementById('time');
    update();
    state = true;
}

function update() {
    $time.innerHTML = formatTime(x.time());
    localStorage.setItem("datimer", $time.innerHTML);
}

function start() {
    clocktimer = setInterval(function () {
    update();
    }, 1);
    x.start();
    state = true;
}

function stop() {
    x.stop();
    clearInterval(clocktimer);
    state = false;
}

if (window.location.pathname == "/review/session") {
    $("#stats").prepend("<a style='cursor:hand;color:white;text-decoration:none' href='#'><i id='pause_clock' class='icon-pause'></a></i><span id='time'></span>");
    show();
    start();
    $("#pause_clock").on("click", function () {
        if (state) {
            $(this).removeClass("icon-pause");
            $(this).addClass("icon-play");
            stop();
        } else {
            $(this).removeClass("icon-play");
            $(this).addClass("icon-pause");
            start();
        }
    });
} else {
    $("#review-stats").append("<div class='pure-g-r' style='background:#fcfcfc;height:32px;margin-top:20px'><div class='pure-u-1' style='display:block;margin-top:-20px'><h2 id='datimer' style='color:#999'></h2></div></div>");
    $("#datimer").html("<i class='icon-time'> " + localStorage.getItem("datimer") + "<span style='font-size:.5em'><span></span></i>");
}
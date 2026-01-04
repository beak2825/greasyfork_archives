// ==UserScript==
// @name         Nono Timer
// @namespace    https://github.com/squall831/Nono-Timer
// @version      1.0.1
// @description  Adds a timer to Rosiminc's Nono Café with some basic functions.
// @author       squall831
// @match        https://rosiminc.github.io/sg-nonograms/*
// @icon         https://cdn.steamgifts.com/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551807/Nono%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/551807/Nono%20Timer.meta.js
// ==/UserScript==


// Declare the variables for the timer display and the container of the timer manual controls.
let nonoTimer = document.createElement("h5");
nonoTimer.id = "display";
nonoTimer.innerHTML = "00:00:00";
document.querySelector("#nonoDiv").appendChild(nonoTimer);
const display = document.getElementById("display");

let timerControls = document.createElement("div");
timerControls.id = "timerControls";
document.querySelector("#msgDiv").insertAdjacentElement("beforebegin", timerControls);

// Next, the general variables for the timer.
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let timeId = 'time' + window.location.search.substr(4);
let savedTime = 0;

// Check if there is a saved time for the current Nono ID and put it on the timer display.
if (localStorage.getItem(timeId) != null) {
    savedTime = parseInt(localStorage.getItem(timeId));

    let hours = Math.floor(savedTime / (1000 * 60 * 60));
    let minutes = Math.floor(savedTime / (1000 * 60) % 60);
    let seconds = Math.floor(savedTime / 1000 % 60);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    display.textContent = `${hours}:${minutes}:${seconds}`;
};

// These are the functions to start, stop, and reset the timer. Update rate is set to each 100ms.
function start(){
    if (document.querySelector("#msgDiv").style.display != 'block') {
        if(!isRunning){
            startTime = Date.now() - elapsedTime - savedTime;
            timer = setInterval(update, 100);
            isRunning = true;
        };
    };
};

function stop(){
    if(isRunning){
        clearInterval(timer);
        elapsedTime = Date.now() - startTime - savedTime;
        isRunning = false;
    }
};

function reset(){
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    display.textContent = "00:00:00";
    localStorage.removeItem(timeId);
    savedTime = 0;
};

// This update function will keep updating the timer display once called ear 250ms and will stop
// automatically once the Nono is solved.
function update(){
    const currentTime = Date.now();

    elapsedTime = currentTime - startTime;
    localStorage.setItem(timeId, elapsedTime);

    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
    let seconds = Math.floor(elapsedTime / 1000 % 60);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    display.textContent = `${hours}:${minutes}:${seconds}`;

    if (document.querySelector("#msgDiv").style.display == 'block') {
	stop();
    }
};

// These are the proper buttons for the timer's  manual start and stop.
let timerStart = document.createElement("button");
timerStart.innerHTML = "Start";
timerStart.type = "button";
timerStart.className = "btn btn-primary";
timerStart.id = "timerStart";
timerStart.addEventListener("click", start);

let timerStop = document.createElement("button");
timerStop.innerHTML = "Stop";
timerStop.type = "button";
timerStop.className = "btn btn-primary";
timerStop.id = "timerStop";
timerStop.addEventListener("click", stop);

// This is the placement of the timer display and buttons on the site.
document.querySelector("#nonoDiv").insertAdjacentElement("afterend", nonoTimer);
document.querySelector("#timerControls").appendChild(timerStart);
document.querySelector("#timerControls").appendChild(timerStop);

// We assing the reset function to the Reset button for the Nono to also reset the timer.
// Also assing the start function once the Nono is clicked.
document.querySelector("#resetBtn").addEventListener("click", reset);
document.querySelector("#nonoDiv").addEventListener("click", start);
document.querySelector("#nonoDiv").addEventListener("contextmenu", start);

// These functions allow for the timer to stop once we change tabs on the browser or use
// another program, and then we resume once we focus the tab again.
window.addEventListener('blur', stop);
window.addEventListener('focus', function() {
    if (display.textContent != "00:00:00") {
        start();
    };
});


// This function allows us to insert custom CSS into the page, using it to style the buttons.
let addRule = (function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector, css) {
        var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
            return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
        }).join(";");
        sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
    };
})(document.createElement("style"));

addRule("#timerControls", {
    "display": "flex",
    "margin-bottom": ".5rem!important",
    "gap": ".3rem!important",
});

addRule("#timerStart", {
    "--bs-btn-bg": "#006600",
    "--bs-btn-border-color": "#006600",
    "--bs-btn-hover-bg": "#084908",
    "--bs-btn-hover-border-color": "#084908",
});

addRule("#timerStop", {
    "--bs-btn-bg": "#c04f15",
    "--bs-btn-border-color": "#c04f15",
    "--bs-btn-hover-bg": "#8c441e",
    "--bs-btn-hover-border-color": "#8c441e",
});

// ==UserScript==
// @name         Youtube Skip 10 Seconds Buttons
// @version      0.4
// @author       Dani
// @description  Adds Buttons to YouTube that skip 10 seconds
// @match        http*://www.youtube.com/*
// @grant        none
// @downloadUrl  https://update.greasyfork.org/scripts/553230/youtube%20skip%2010%20seconds%20buttons.user.js
// @updateUrl    https://update.greasyfork.org/scripts/553230/youtube%20skip%2010%20seconds%20buttons.meta.js
// @namespace https://greasyfork.org/users/1528977
// @downloadURL https://update.greasyfork.org/scripts/553230/Youtube%20Skip%2010%20Seconds%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/553230/Youtube%20Skip%2010%20Seconds%20Buttons.meta.js
// ==/UserScript==

// Content-Security-Policy: require-trusted-types-for 'script'; trusted-types foo;

(function() {
    'use strict';
    attemptButtons();
})();

function attemptButtons(){
    var foundButtonNodes = document.querySelectorAll(".tensecbutt");
    if (foundButtonNodes && foundButtonNodes.length > 0) {
        return;
    } else addButtons();
    if (foundButtonNodes && foundButtonNodes.length > 0) {
        return;
    } else {
        setTimeout(function() {attemptButtons();}, 1000);
    }
}

function addButtons(){
    var divNewLeft = document.createElement("div");
    var spanNewLeft = document.createElement("span");
    var divNewRight = document.createElement("div");
    var spanNewRight = document.createElement("span");
    var buttonNewLeft = document.createElement("button");
    var buttonNewRight = document.createElement("button");

    divNewLeft.classList.add("ytp-time-display");
    divNewLeft.classList.add("notranslate");
    divNewLeft.style.paddingRight = "0";
    spanNewLeft.classList.add("ytp-time-wrapper");
    spanNewLeft.classList.add("ytp-time-wrapper-delhi");
    spanNewLeft.style.paddingLeft = "8px";
    spanNewLeft.style.paddingRight = "8px";
    spanNewLeft.style.borderTopRightRadius = "0";
    spanNewLeft.style.borderBottomRightRadius = "0";
    buttonNewLeft.classList.add("ytp-button");
    buttonNewLeft.classList.add("tensecbutt");
    buttonNewLeft.style.height = "100%";
    buttonNewLeft.style.width = "50px";

    // Create the SVG element
    const svgLeft = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgLeft.setAttribute("height", "100%");
    svgLeft.setAttribute("version", "1.1");
    svgLeft.setAttribute("viewBox", "0 0 36 36");
    svgLeft.setAttribute("width", "100%");
    svgLeft.style.padding = 0;

    // Create the <use> element
    const useLeft = document.createElementNS("http://www.w3.org/2000/svg", "use");
    useLeft.setAttribute("class", "ytp-svg-shadow");

    // Create the group element with transformation
    const g1Left = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g1Left.setAttribute("transform", "translate(-57.467 -180)");

    // Create the inner group element with transformation
    const g2Left = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g2Left.setAttribute("transform", "translate(-1.6386 .64094)");

    // Create the path element
    const pathLeft = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathLeft.setAttribute("d", "m79.104 189.96-8.5052 7.3944 8.5052 7.3944v3.6972l-13.312-11.092 13.312-11.092c1e-6 1.2324 3e-6 2.4658-2e-6 3.0815s-1e-6 0.61571-5e-6 0.61571z");
    pathLeft.setAttribute("fill", "#fff");

    // Create the text element
    const textLeft = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textLeft.setAttribute("transform", "matrix(3.5844 0 0 3.5844 -49.781 -448.67)");
    textLeft.setAttribute("fill", "#ffffff");
    textLeft.setAttribute("font-family", "Arial");
    textLeft.setAttribute("font-size", "10.583px");
    textLeft.setAttribute("letter-spacing", "0px");
    textLeft.setAttribute("word-spacing", "0px");
    textLeft.setAttribute("style", "line-height:6.61458px;shape-inside:url(#rect847);white-space:pre");
    textLeft.setAttribute("xml:space", "preserve");

    // Create the tspan element for the text content
    const tspanLeft = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspanLeft.setAttribute("x", "34.798828");
    tspanLeft.setAttribute("y", "181.48154");

    // Create the nested tspan for the actual number "10"
    const numberTspanLeft = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    numberTspanLeft.setAttribute("fill", "#ffffff");
    numberTspanLeft.setAttribute("font-size", "3.5278px");
    numberTspanLeft.textContent = "10";

    // Append the nested tspan to the main tspan
    tspanLeft.appendChild(numberTspanLeft);

    // Append the tspan to the text element
    textLeft.appendChild(tspanLeft);

    // Append the path and text to the inner group element
    g2Left.appendChild(pathLeft);
    g2Left.appendChild(textLeft);

    // Append the inner group to the outer group
    g1Left.appendChild(g2Left);

    // Append the outer group to the SVG
    svgLeft.appendChild(g1Left);

    // Append the <use> element to the SVG (it can be appended to the final SVG if needed)
    svgLeft.appendChild(useLeft);
    divNewLeft.appendChild(spanNewLeft);
    spanNewLeft.appendChild(buttonNewLeft);
    buttonNewLeft.appendChild(svgLeft);

    divNewRight.classList.add("ytp-time-display");
    divNewRight.classList.add("notranslate");
    divNewRight.style.paddingLeft = "0";
    spanNewRight.classList.add("ytp-time-wrapper");
    spanNewRight.classList.add("ytp-time-wrapper-delhi");
    spanNewRight.style.paddingLeft = "8px";
    spanNewRight.style.paddingRight = "8px";
    spanNewRight.style.borderTopLeftRadius = "0";
    spanNewRight.style.borderBottomLeftRadius = "0";
    buttonNewRight.classList.add("ytp-button");
    buttonNewRight.classList.add("tensecbutt");
    buttonNewRight.style.height = "100%";
    buttonNewRight.style.width = "50px";

    // Create the SVG element
    const svgRight = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgRight.setAttribute("height", "100%");
    svgRight.setAttribute("version", "1.1");
    svgRight.setAttribute("viewBox", "0 0 36 36");
    svgRight.setAttribute("width", "100%");
    svgRight.style.padding = 0;

    // Create the <use> element
    const useRight = document.createElementNS("http://www.w3.org/2000/svg", "use");
    useRight.setAttribute("class", "ytp-svg-shadow");

    // Create the outer group element with transformation
    const g1Right = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g1Right.setAttribute("transform", "translate(-57.467 -180)");

    // Create the inner group element with transformation
    const g2Right = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g2Right.setAttribute("transform", "translate(9.3514)");

    // Create the <path> element
    const pathRight = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathRight.setAttribute("d", "m64.154 190.61 8.5052 7.3944-8.5052 7.3944v3.6972l13.312-11.092-13.312-11.092c-1e-6 1.2324-3e-6 2.4658 2e-6 3.0815s1e-6 0.61571 5e-6 0.61571z");
    pathRight.setAttribute("fill", "#fff");

    // Create the <text> element
    const textRight = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textRight.setAttribute("transform", "matrix(3.5844 0 0 3.5844 -71.344 -448.03)");
    textRight.setAttribute("fill", "#ffffff");
    textRight.setAttribute("font-family", "Arial");
    textRight.setAttribute("font-size", "10.583px");
    textRight.setAttribute("letter-spacing", "0px");
    textRight.setAttribute("word-spacing", "0px");
    textRight.setAttribute("style", "line-height:6.61458px;shape-inside:url(#rect847);white-space:pre");
    textRight.setAttribute("xml:space", "preserve");

    // Create the <tspan> element for the number "10"
    const tspanRight = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspanRight.setAttribute("x", "34.798828");
    tspanRight.setAttribute("y", "181.48154");

    // Create the nested <tspan> for the number "10"
    const numberTspanRight = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    numberTspanRight.setAttribute("fill", "#ffffff");
    numberTspanRight.setAttribute("font-size", "3.5278px");
    numberTspanRight.textContent = "10";

    // Append the nested tspan to the main tspan
    tspanRight.appendChild(numberTspanRight);

    // Append the tspan to the text element
    textRight.appendChild(tspanRight);

    // Append the path and text to the inner group element
    g2Right.appendChild(pathRight);
    g2Right.appendChild(textRight);

    // Append the inner group to the outer group
    g1Right.appendChild(g2Right);

    // Append the outer group to the SVG
    svgRight.appendChild(g1Right);

    // Append the <use> element to the SVG (it can be appended to the final SVG if needed)
    svgRight.appendChild(useRight);

    divNewRight.appendChild(spanNewRight);
    spanNewRight.appendChild(buttonNewRight);
    buttonNewRight.appendChild(svgRight);
    buttonNewLeft.onclick = function () {document.getElementsByClassName("video-stream html5-main-video")[0].currentTime -= 10;};
    buttonNewRight.onclick = function () {document.getElementsByClassName("video-stream html5-main-video")[0].currentTime += 10;};

    let timeDisplay = document.getElementsByClassName("ytp-time-display notranslate")[0];
    if (timeDisplay) {
        let timeNext = timeDisplay.nextSibling;

        timeDisplay.parentNode.insertBefore(divNewLeft, timeNext);
        timeDisplay.parentNode.insertBefore(divNewRight, timeNext);
    }
}


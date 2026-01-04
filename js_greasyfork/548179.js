// ==UserScript==
// @name         Snay.io - BUT ITS CURSED!!!1!1!1!!!!!!
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  different ... well everything!
// @author       SwixSeven
// @match        *://www.snay.io*
// @icon         ////*
// @grant        none
// @license      MIT; https://mit-license.org/
// @downloadURL https://update.greasyfork.org/scripts/548179/Snayio%20-%20BUT%20ITS%20CURSED%21%21%211%211%211%21%21%21%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/548179/Snayio%20-%20BUT%20ITS%20CURSED%21%21%211%211%211%21%21%21%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = `

:root {
    --toastify-color-light: #fff;
    --toastify-color-dark: #121212;
    --toastify-color-info: #3498db;
    --toastify-color-success: #ffffff;
    --toastify-color-warning: #f1c40f;
    --toastify-color-error: #e74c3c;
    --toastify-color-transparent: #ffffffb3;
    --toastify-icon-color-info: var(--toastify-color-info);
    --toastify-icon-color-success: var(--toastify-color-success);
    --toastify-icon-color-warning: var(--toastify-color-warning);
    --toastify-icon-color-error: var(--toastify-color-error);
    --toastify-toast-width: 320px;
    --toastify-toast-background: #fff;
    --toastify-toast-min-height: 64px;
    --toastify-toast-max-height: 800px;
    --toastify-font-family: sans-serif;
    --toastify-z-index: 9999;
    --toastify-text-color-light: #ebff00;
    --toastify-text-color-dark: #ff0000;
    --toastify-text-color-info: #fff400;
    --toastify-text-color-success: #fff;
    --toastify-text-color-warning: #fff;
    --toastify-text-color-error: #00ffe0;
    --toastify-spinner-color: #616;
    --toastify-spinner-color-empty-area: #000000;
    --toastify-color-progress-light: linear-gradient(90deg, #ff0000, #1e00ff, #ff0000, #0014ff, #ff0000, #002bff);
    --toastify-color-progress-dark: #bb86fc;
    --toastify-color-progress-info: var(--toastify-color-info);
    --toastify-color-progress-success: #000000;
    --toastify-color-progress-warning: #ffffff;
    ress-error: var(--toastify-color-error);
}
#overlays, #connecting {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-image: url(./assets/img/background.jpg);
    /* -webkit-box-shadow: inset 0px 0px 1vw 1vw rgba(0, 0, 0, 1); */
    box-shadow: inset 0px 0px 5vw rgb(0 255 114);
    background-size: cover;
    background-position: center;
    z-index: 200;
}
.fade-in {
    animation: fadeOut ease 5s;
}
.side-btn {
    background-color: rgb(255 0 0);
    background-size: 25% 205%;
    background-position: 50% 50%;
    border-radius: 5px;
    width: 182px;
    height: 124px;
    overflow: hidden;
    transition: 5s;
}
element.style {
    font-weight: bold;
    font-size: x-large;
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 0;
    background-color: rgb(255 255 255 / 67%);
}
#nick {
    font-size: 15px;
    padding: 5px;
    border-radius: 25px;
    width: 180px;
    height: 65px;
    margin: 0;
    border: none;
}
.main-form-bg {
    font-size: 30px;
    padding: 5px;
    border-radius: 15px;
    background-color: rgb(225 0 255);
    color: #000000;
    width: 250px;
    height: 35px;
    margin: 0;
}
element.style {
    display: flex
;
    place-content: center;
    width: calc(100% - 2vw);
    margin: 1vw;
    border-radius: 1vw;
    padding: 90px;
    background-color: rgb(81 255 149);
}
.replay-thumbnail {
    aspect-ratio: 6 / 7;
    border: .2vw solid #cf2626;
    border-radius: 1vw;
    box-shadow: 0 0 200px #000000;
    margin: 0;
    object-fit: cover;
    padding: 0;
    transition: box-shadow .25s linear;
    width: 100%;
}
#title {
    background: blue;
    color: #fb0000;
    position: absolute;
    width: 90vmin;
    height: 100vmin;
    left: 50vw;
    top: -1vw;
    transform: translateX(-50%);
}`;
    var elem = document.createElement('style');
    elem.innerText = style;
    document.head.appendChild(elem);
    
})();

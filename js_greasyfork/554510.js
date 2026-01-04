// ==UserScript==
// @name         Open2ch 滞在時間カウンター
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  open2ch livejupiter 板での累計滞在時間を計測
// @match        https://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554510/Open2ch%20%E6%BB%9E%E5%9C%A8%E6%99%82%E9%96%93%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/554510/Open2ch%20%E6%BB%9E%E5%9C%A8%E6%99%82%E9%96%93%E3%82%AB%E3%82%A6%E3%83%B3%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY = "open2ch_livejupiter_time";
    let startTime = Date.now();
    let totalTime = parseInt(localStorage.getItem(KEY) || "0", 10);
    window.addEventListener("beforeunload", () => {
        let now = Date.now();
        let elapsed = Math.floor((now - startTime) / 1000); // 秒
        totalTime += elapsed;
        localStorage.setItem(KEY, totalTime.toString());
    });

    let counter = document.createElement("div");
    counter.style.position = "fixed";
    counter.style.bottom = "10px";
    counter.style.right = "10px";
    counter.style.padding = "5px 10px";
    counter.style.background = "rgba(0,0,0,0.7)";
    counter.style.color = "white";
    counter.style.fontSize = "14px";
    counter.style.zIndex = 9999;
    document.body.appendChild(counter);

    function updateDisplay() {
        let now = Date.now();
        let elapsed = Math.floor((now - startTime) / 1000);
        let displayTime = totalTime + elapsed;

        let h = Math.floor(displayTime / 3600);
        let m = Math.floor((displayTime % 3600) / 60);
        let s = displayTime % 60;

        counter.textContent = `お前が無駄にした時間→: ${h}時間${m}分${s}秒`;
    }

    setInterval(updateDisplay, 1000);
})();
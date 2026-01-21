// ==UserScript==
// @name            Auto refresh Sangtacviet
// @name:vi         Auto refresh Sangtacviet
// @namespace       http://tampermonkey.net/
// @version         1.5
// @icon            https://sangtacviet.vip/favicon.png
// @description     Reload lại page sangtacviet để kiếm điểm kinh nghiệm.
// @description:vi  Reload lại page sangtacviet để kiếm điểm kinh nghiệm.
// @author          FixBug by Cáo
// @match           https://sangtacviet.vip/truyen/*
// @match           http://14.225.254.182/truyen/*
// @match           https://sangtacviet.app/truyen/*
// @noframes
// @connect         self
// @supportURL      https://facebook.com/fixbug
// @run-at          document-idle
// @license MIT2
// @downloadURL https://update.greasyfork.org/scripts/563308/Auto%20refresh%20Sangtacviet.user.js
// @updateURL https://update.greasyfork.org/scripts/563308/Auto%20refresh%20Sangtacviet.meta.js
// ==/UserScript==
(function () {
    'use strict';
 
    // Tạo một div để hiển thị log
    var logDiv = document.createElement('div');
    logDiv.id = 'custom-log';
    logDiv.style.position = 'fixed';
    logDiv.style.top = '0';
    logDiv.style.left = '0';
    logDiv.style.width = '100%';
    logDiv.style.maxHeight = '200px';
    logDiv.style.overflowY = 'auto';
    logDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    logDiv.style.color = 'white';
    logDiv.style.fontSize = '12px';
    logDiv.style.zIndex = '9999';
    logDiv.style.padding = '10px';
    document.body.appendChild(logDiv);
 
    // Hàm ghi log vào div
    function customLog(message) {
        var logMessage = document.createElement('div');
        logMessage.textContent = message;
        logDiv.appendChild(logMessage);
        logDiv.scrollTop = logDiv.scrollHeight;
    }
 
    // Hàm tạo số ngẫu nhiên cho thời gian refresh (3-5 phút)
    var randomFn = function (min, max) {
        min = min || 180000; // 3 phút
        max = max || 300000; // 5 phút
        return Math.floor((Math.random()) * (max - min + 1)) + min;
    };
 
    // Hàm chạy action sau một thời gian delay
    var randomTimeoutFn = function (time, action) {
        var handle = setTimeout(() => {
            action();
            clearTimeout(handle);
        }, time);
    };
 
    // Tự động refresh page
    randomTimeoutFn(2000, () => {
        var waitTime = randomFn();
        customLog("Page sẽ tự động refresh sau " + (waitTime / 1000).toFixed(0) + " giây.");
        randomTimeoutFn(waitTime, () => {
            window.location.reload(1);
        });
    });
})();
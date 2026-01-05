// ==UserScript==
// @name         合集时长
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  优化性能——2025年12月28日
// @author       cxx
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558349/%E5%90%88%E9%9B%86%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/558349/%E5%90%88%E9%9B%86%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function timeStringToSeconds(timeString) {
    const parts = timeString.split(":").map(Number);
    if (parts.length === 3) {
      // 格式为 HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // 格式为 MM:SS
      return parts[0] * 60 + parts[1];
    } else {
      throw new Error("Invalid time format");
    }
  }

  function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // 等待特定元素，然后执行callback
  function waitFor(selector, callback, maxAttempts = 50, interval = 100) {
    let attempts = 0;
    const intervalId = setInterval(() => {
      if (document.querySelector(selector)) {
        console.log(`${selector}已出现。`);
        callback();
        clearInterval(intervalId);
      } else {
        attempts += 1;
        console.log(`第${attempts}次尝试寻找${selector}失败。`);
        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          console.log(`尝试次数超过${maxAttempts}次，停止尝试。`);
        }
      }
    }, interval);
  }

  // 设置：B站刷新时执行fn
  /*function setAutoRefresh(fn) {
    function waitForVue(callBack) {
      var taskId = setInterval(check, 500, callBack);
      var tryTime = 0;
      function check() {
        if (typeof document.querySelector("#app").__vue__ != "undefined") {
          clearInterval(taskId);
          callBack();
        } else {
          tryTime += 1;
          if (tryTime >= 20) throw "尝试20次(10s)后扔未找到vue, 程序退出。";
          console.log("没有找到vue, 等待500ms后重试。");
        }
      }
    }
    function setAfterHooks() {
      document
        .querySelector("#app")
        .__vue__.$router.afterHooks.push(() => fn());
    }
    waitForVue(setAfterHooks);
  }*/

  // 视频页面处理
  function update_video_page() {
    var totalSeconds = 0;
    setTimeout(() => {
      $(".stat-item.duration").each(function () {
        var duration = $(this).text().trim();
        // console.log(duration);
        totalSeconds += timeStringToSeconds(duration);
        console.log(secondsToTime(totalSeconds));
      });

      $(".header-top").append(
        `<span style="color:rgba(200, 208, 218, 0.6);font-size:14px;font-weight:400;">${secondsToTime(
          totalSeconds
        )}</span>`
      );
    }, 2000);
  }

  // 主函数
  function mian1() {
    //setAutoRefresh(update_video_page); //设置好自动刷新
    update_video_page();
  }
  //waitFor(".video-share-info-text", mian1);
  //waitFor(".header-top .continuous-btn", mian1);
  waitFor(".header-top", mian1);
})();

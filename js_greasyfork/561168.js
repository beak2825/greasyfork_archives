// ==UserScript==
// @name           ASOBI STAGE のプレイヤーに1秒進む・1秒戻るボタンを表示
// @name:en        Add "skip 1 second forward/backward" button to ASOBI STAGE player
// @namespace
// @version
// @description    ASOBI STAGE のプレイヤーに1秒進む・1秒戻るボタンを表示します。
// @description:en Adds "skip 1 second forward/backward" button to ASOBI STAGE player.
// @author
// @match          https://asobistage.asobistore.jp/event/*/archive/*
// @grant          none
// @license        MIT
// @version 0.0.1.20260102180233
// @namespace https://greasyfork.org/users/1555291
// @downloadURL https://update.greasyfork.org/scripts/561168/ASOBI%20STAGE%20%E3%81%AE%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%AB1%E7%A7%92%E9%80%B2%E3%82%80%E3%83%BB1%E7%A7%92%E6%88%BB%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561168/ASOBI%20STAGE%20%E3%81%AE%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E3%81%AB1%E7%A7%92%E9%80%B2%E3%82%80%E3%83%BB1%E7%A7%92%E6%88%BB%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(() => {
  'use strict';

  let webpackRequire;
  window.webpackChunk_N_E.push([ [7165], {}, (u) => webpackRequire = u]);
  const videojs = webpackRequire(85215).Z;

  const tryRunning = () => {
    const buttonSkipBackward15 = document.querySelector("button.vjs-skip-backward-15");
    const buttonSkipForward15 = document.querySelector("button.vjs-skip-forward-15");
    if (buttonSkipBackward15 === null || buttonSkipForward15 === null) {
      console.log(buttonSkipBackward15, buttonSkipForward15);
      setTimeout(tryRunning, 200);
      return;
    }
    const player = videojs("vjs_video_3");

    const skipBackwardHtml = `
      <button class="vjs-skip-button vjs-skip-backward-1 vjs-control vjs-button" type="button" title="Skip backward 1 seconds" aria-disabled="false">
        <span class="vjs-icon-placeholder" aria-hidden="true"></span>
        <span class="vjs-control-text" aria-live="polite">Skip backward 1 seconds</span><span class="vjs-skip-forward-1 icon"><span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px">
          <path fill="#FFF" d="M12.05,22.42a9.34,9.34,0,0,1-7.41-15,.8.8,0,1,1,1.27,1,7.61,7.61,0,0,0-1.6,4.7,7.74,7.74,0,1,0,7.74-7.73.8.8,0,1,1,0-1.6,9.34,9.34,0,0,1,0,18.67Z"></path>
          <path fill="#FFF" d="M13,7.45a.76.76,0,0,1-.56-.23L10.37,5.11a.8.8,0,0,1,0-1.13l2.11-2.1a.79.79,0,0,1,1.13,0,.8.8,0,0,1,0,1.13L12.07,4.55l1.54,1.54a.8.8,0,0,1,0,1.13A.78.78,0,0,1,13,7.45Z"></path>
          <!-- <path fill="#FFF" d="M10.29,16.72H8.7V11.66l-1.56.46V10.91l3-1h.15Z"></path> -->
          <path fill="#FFF" d="M13.29,16.72H11.7V11.66l-1.56.46V10.91l3-1h.15Z"></path>
          <!-- <path fill="#FFF" d="M11.87,13.38l.42-3.51h4V11.1H13.58l-.16,1.37a1.61,1.61,0,0,1,.45-.18,2.18,2.18,0,0,1,2.1.53,2.41,2.41,0,0,1,.55,1.69,2.53,2.53,0,0,1-.29,1.2,2.11,2.11,0,0,1-.83.82,2.61,2.61,0,0,1-1.26.28,2.84,2.84,0,0,1-1.2-.26,2.22,2.22,0,0,1-.89-.73,1.75,1.75,0,0,1-.31-1.05h1.59a.86.86,0,0,0,.24.6.73.73,0,0,0,.56.22c.54,0,.8-.39.8-1.18s-.32-1.09-1-1.09a1,1,0,0,0-.83.35Z"></path> -->
        </svg>
      </span></span></button>
    `;
    const skipForwardHtml = `
      <button class="vjs-skip-button vjs-skip-forward-1 vjs-control vjs-button" type="button" aria-disabled="false" title="Skip forward 1 seconds">
        <span class="vjs-icon-placeholder" aria-hidden="true"></span>
        <span class="vjs-control-text" aria-live="polite">Skip forward 1 seconds</span><span class="vjs-skip-button vjs-skip-forward-1 icon"><span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px">
          <path fill="#FFF" d="M11.84,22.42a9.34,9.34,0,1,1,0-18.67.8.8,0,0,1,0,1.6,7.74,7.74,0,1,0,7.73,7.73A7.66,7.66,0,0,0,18,8.38a.81.81,0,0,1,.14-1.13.82.82,0,0,1,1.13.15,9.35,9.35,0,0,1-7.41,15Z"></path>
          <path fill="#FFF" d="M10.84,7.45a.78.78,0,0,1-.57-.23.8.8,0,0,1,0-1.13l1.54-1.54L10.27,3a.8.8,0,0,1,0-1.13.79.79,0,0,1,1.13,0L13.51,4a.8.8,0,0,1,0,1.13L11.4,7.22A.76.76,0,0,1,10.84,7.45Z"></path>
          <!--<path fill="#FFF" d="M10.08,16.72H8.49V11.66l-1.56.46V10.91l3-1h.15Z"></path> -->
          <path fill="#FFF" d="M13.08,16.72H11.49V11.66l-1.56.46V10.91l3-1h.15Z"></path>
          <!-- <path fill="#FFF" d="M11.66,13.38l.42-3.51h4V11.1H13.37l-.16,1.37a1.61,1.61,0,0,1,.45-.18,2.18,2.18,0,0,1,2.1.53,2.41,2.41,0,0,1,.55,1.69,2.53,2.53,0,0,1-.29,1.2,2.11,2.11,0,0,1-.83.82,2.61,2.61,0,0,1-1.26.28,2.84,2.84,0,0,1-1.2-.26,2.22,2.22,0,0,1-.89-.73,1.75,1.75,0,0,1-.31-1.05h1.59a.86.86,0,0,0,.24.6.73.73,0,0,0,.56.22c.54,0,.8-.39.8-1.18s-.32-1.09-1-1.09a1,1,0,0,0-.83.35Z"></path> -->
        </svg>
        </span></span>
      </button>
    `;
    buttonSkipBackward15.insertAdjacentHTML("afterend", skipBackwardHtml);
    buttonSkipForward15.insertAdjacentHTML("beforebegin", skipForwardHtml);
    const buttonSkipBackward = document.querySelector("button.vjs-skip-backward-1");
    const buttonSkipForward = document.querySelector("button.vjs-skip-forward-1");
    buttonSkipBackward.addEventListener("click", () => {
      const skipTime = 1;
      if (!isNaN(player.duration())) {
        var t, n = player.currentTime(),
            i = player.liveTracker,
            a = i && i.isLive() && i.seekableStart();
        // console.log("Current time:", n);
        t = a && n - skipTime <= a ? a : n >= skipTime ? n - skipTime : 0;
        // console.log("Setting time to:", t);
        player.currentTime(t);
      }
    })
    buttonSkipForward.addEventListener("click", () => {
      const skipTime = 1;
      if (!isNaN(player.duration())) {
        var t, n = player.currentTime(),
            i = player.liveTracker,
            a = i && i.isLive() ? i.seekableEnd() : player.duration();
        // console.log("Current time:", n);
        t = n + skipTime <= a ? n + skipTime : a;
        // console.log("Setting time to:", t);
        player.currentTime(t);
      }
    });
  };
  tryRunning();
})();

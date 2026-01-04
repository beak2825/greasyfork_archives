// ==UserScript==
// @name         学习通 防暂停 | 自动播放 | 2倍速 | 自动下一节
// @namespace    http://tampermonkey.net/
// @version      2025.12.25
// @description  学习通：事件级防暂停 + iframe 注入 + 自动播放 + 强制2倍速 + 自动跳下一节
// @author       HowardZhangdqs
// @match        https://*.chaoxing.com/mycourse/studentstudy*
// @match        https://*.chaoxing.com/mooc-ans/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/560158/%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E9%98%B2%E6%9A%82%E5%81%9C%20%7C%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%7C%202%E5%80%8D%E9%80%9F%20%7C%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.user.js
// @updateURL https://update.greasyfork.org/scripts/560158/%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E9%98%B2%E6%9A%82%E5%81%9C%20%7C%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%20%7C%202%E5%80%8D%E9%80%9F%20%7C%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82.meta.js
// ==/UserScript==

(() => {
  "use strict";

  /**********************
   * 配置
   **********************/
  const CONFIG = {
    checkInterval: 1000,
    playbackRate: 2.0,
    finishThreshold: 0.3,
  };

  let lastVideo = null;

  /**********************
   * 防暂停：事件拦截逻辑（可注入 iframe）
   **********************/
  function antiPauseHook() {
    const BLOCK_EVENTS = new Set([
      "mouseout",
      "mouseleave",
      "blur",
      "visibilitychange",
    ]);

    function hook(target) {
      const original = target.addEventListener;
      if (original.__hooked) return;

      function wrapped(type, listener, options) {
        if (BLOCK_EVENTS.has(type)) {
          console.log("[Chaoxing] blocked event:", type);
          return;
        }
        return original.call(this, type, listener, options);
      }

      wrapped.__hooked = true;
      target.addEventListener = wrapped;
    }

    hook(window);
    hook(document);
  }

  /**********************
   * 注入到 iframe（关键）
   **********************/
  function injectIntoIframe(iframe) {
    try {
      const win = iframe.contentWindow;
      if (!win || win.__chaoxing_injected) return;

      win.__chaoxing_injected = true;

      const script = win.document.createElement("script");
      script.textContent = `(${antiPauseHook.toString()})();`;
      win.document.documentElement.appendChild(script);

      console.log("[Chaoxing] anti-pause injected into iframe");
    } catch {}
  }

  /**********************
   * 获取 Chaoxing video
   **********************/
  function getChaoxingVideo() {
    try {
      const outerIframe = document.querySelector("iframe");
      if (!outerIframe) return null;

      injectIntoIframe(outerIframe);

      const doc1 = outerIframe.contentWindow?.document;
      if (!doc1) return null;

      const innerIframe = doc1.querySelector("iframe");
      if (!innerIframe) return null;

      injectIntoIframe(innerIframe);

      const doc2 = innerIframe.contentWindow?.document;
      if (!doc2) return null;

      return doc2.querySelector("#video_html5_api");
    } catch {
      return null;
    }
  }

  /**********************
   * 跳下一节
   **********************/
  function goNext() {
    console.log("[Chaoxing] 视频完成，跳下一节");
    document.querySelector("#prevNextFocusNext")?.click();
  }

  /**********************
   * 绑定 video（只执行一次）
   **********************/
  function bindVideo(video) {
    console.log("[Chaoxing] bind video");

    video.muted = true;
    video.playbackRate = CONFIG.playbackRate;

    video.play().catch(() => {});

    // 防止倍速被改
    video.addEventListener("ratechange", () => {
      if (video.playbackRate !== CONFIG.playbackRate) {
        video.playbackRate = CONFIG.playbackRate;
      }
    });

    // ended
    video.addEventListener("ended", goNext, { once: true });

    // 兜底：接近结尾
    const timeWatcher = () => {
      if (
        video.duration &&
        video.currentTime >= video.duration - CONFIG.finishThreshold
      ) {
        video.removeEventListener("timeupdate", timeWatcher);
        goNext();
      }
    };
    video.addEventListener("timeupdate", timeWatcher);
  }

  /**********************
   * 主循环
   **********************/
  setInterval(() => {
    const video = getChaoxingVideo();
    if (!video) return;

    if (video !== lastVideo) {
      lastVideo = video;
      bindVideo(video);
    }
  }, CONFIG.checkInterval);

  // 顶层先注入一次
  antiPauseHook();

  console.log("[Chaoxing] 学习通脚本已启动");
})();

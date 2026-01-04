// ==UserScript==
// @name         超星学习通 刷资料学习时长
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  刷视频与文档的学习时长
// @author       Gemini
// @match        https://*.chaoxing.com/*/coursedata/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559928/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E5%88%B7%E8%B5%84%E6%96%99%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/559928/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%20%E5%88%B7%E8%B5%84%E6%96%99%E5%AD%A6%E4%B9%A0%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const CONFIG = {
    listSelector: ".rename_title.cdoneLine",
    playBtnSelector: 'div[data-title="点击播放"]',
    videoSelector: "video",
    docContainer: ".fileBox",
    docCloseBtn: ".closePop.fr",
    videoPopClose: ".GroupDele.popMoveDele.YPShowDiv",
  };

  let currentIndex = 0;
  const log = (msg) =>
    console.log(`%c[刷课] ${msg}`, "color: #00bcd4; font-weight: bold;");

  function simulatedClick(el) {
    if (!el) return;
    ["mousedown", "mouseup", "click"].forEach((t) => {
      el.dispatchEvent(
        new MouseEvent(t, { bubbles: true, cancelable: true, view: window })
      );
    });
  }

  function findRecursive(selector, root = document) {
    let el = root.querySelector(selector);
    if (el) return el;
    const iframes = root.querySelectorAll("iframe");
    for (let f of iframes) {
      try {
        const doc = f.contentDocument || f.contentWindow.document;
        el = findRecursive(selector, doc);
        if (el) return el;
      } catch (e) {}
    }
    return null;
  }

  async function startProcess() {
    const items = document.querySelectorAll(CONFIG.listSelector);
    if (currentIndex >= items.length) {
      log("🎉 所有任务已处理完毕");
      return;
    }

    log(`🚀 任务进度: ${currentIndex + 1}/${items.length}`);
    simulatedClick(items[currentIndex]);

    // --- 核心优化：快速并行检测 ---
    let detected = false;
    let checkTimer = setInterval(() => {
      // 1. 检测视频
      const playBtn = findRecursive(CONFIG.playBtnSelector);
      if (playBtn && !detected) {
        detected = true;
        clearInterval(checkTimer);
        log("🎬 检测到视频，立即播放");
        simulatedClick(playBtn);
        monitorVideo();
        return;
      }

      // 2. 检测文档 (.fileBox)
      const docBox = findRecursive(CONFIG.docContainer);
      if (docBox && !detected) {
        detected = true;
        clearInterval(checkTimer);
        log("📄 检测到文档，准备滚动");
        setupAndScrollDoc(docBox);
        return;
      }
    }, 500); // 每0.5秒扫一次，极速响应

    // 3. 超时保护：如果5秒内啥都没找到，换下一个
    setTimeout(() => {
      if (!detected) {
        clearInterval(checkTimer);
        log("⚠️ 未检测到可学内容，跳转下一项");
        next();
      }
    }, 5000);
  }

  function monitorVideo() {
    const timer = setInterval(() => {
      const video = findRecursive(CONFIG.videoSelector);
      if (video && video.ended) {
        clearInterval(timer);
        log("✅ 视频完成");
        const close = findRecursive(CONFIG.videoPopClose);
        if (close) simulatedClick(close);
        next();
      } else if (video && video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    }, 2000);
  }

  function setupAndScrollDoc(el) {
    // 强制样式
    el.style.height = "500px";
    el.style.overflowY = "auto";
    el.style.display = "block";

    let lastY = -1;
    const scrollTimer = setInterval(() => {
      const currentY = el.scrollTop;
      el.scrollTo({ top: currentY + 500, behavior: "smooth" });

      log(`📜 滑动中: ${Math.round(currentY)} / ${el.scrollHeight}`);

      if (
        currentY > 0 &&
        (currentY === lastY ||
          currentY + el.clientHeight >= el.scrollHeight - 20)
      ) {
        clearInterval(scrollTimer);
        log("✅ 文档滑动完成");
        const close = findRecursive(CONFIG.docCloseBtn);
        if (close) simulatedClick(close);
        setTimeout(next, 1500);
      }
      lastY = currentY;
    }, 2000);
  }

  function next() {
    currentIndex++;
    startProcess();
  }

  const btn = document.createElement("button");
  btn.innerText = "开始";
  btn.style.cssText =
    "position:fixed;top:20px;right:20px;z-index:999999;padding:12px;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;";
  btn.onclick = () => {
    btn.disabled = true;
    startProcess();
    btn.style.background = "gray"
  };
  document.body.appendChild(btn);
})();

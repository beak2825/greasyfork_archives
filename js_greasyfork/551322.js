// ==UserScript==
// @name         小红书PC端直播美化脚本
// @namespace    npm/xhs-pc-live-style
// @version      1.0.1
// @author       MAXLZ
// @description  自动点击播放，去除底部按钮，调整视频显示比例
// @license      MIT
// @icon         https://www.xiaohongshu.com/favicon.ico
// @match        https://www.xiaohongshu.com/livestream/dynpath*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551322/%E5%B0%8F%E7%BA%A2%E4%B9%A6PC%E7%AB%AF%E7%9B%B4%E6%92%AD%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/551322/%E5%B0%8F%E7%BA%A2%E4%B9%A6PC%E7%AB%AF%E7%9B%B4%E6%92%AD%E7%BE%8E%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function bootstrap() {
    const title = document.querySelector(".livestream-container .title");
    if (title && title.textContent.includes("直播已结束")) {
      return;
    }
    document.body.style.width = "100%";
    window.addEventListener("load", function() {
      const playerEl = document.querySelector("#playerEl");
      if (!playerEl) {
        return;
      }
      const startDom = playerEl.querySelector(".xgplayer-start");
      const videoDom = playerEl.querySelector("video");
      const bottomButton = document.querySelector(
        ".fixed-bottom-button.live-fixed-bottom-button"
      );
      const poster = playerEl.querySelector(".xgplayer-poster");
      const livestreamContainer = document.querySelector(".livestream-container");
      if (livestreamContainer) {
        const callback = (mutationList) => {
          mutationList.forEach((mutation) => {
            if (mutation.type === "childList") {
              const addedNodes = mutation.addedNodes;
              for (let index = 0; index < addedNodes.length; index++) {
                const node = addedNodes[index];
                if (node instanceof HTMLElement && node.classList.contains("comment-container")) {
                  node.style.height = "500px";
                  node.style.width = "30%";
                  mutationObserver.disconnect();
                }
              }
            }
          });
        };
        const mutationObserver = new MutationObserver(callback);
        mutationObserver.observe(livestreamContainer, {
          attributes: false,
          subtree: false,
          childList: true
        });
      }
      if (videoDom) {
        videoDom.style.objectFit = "contain";
      }
      startDom?.click();
      bottomButton?.remove();
      if (poster) {
        const matches = poster.style.backgroundImage.match(/http(s?).*(?="\))/);
        if (!matches) {
          return;
        }
        const img = matches[0];
        const backgroundPosterId = "backgroundPoster";
        if (!playerEl.querySelector(`#${backgroundPosterId}`)) {
          const backgroundDiv = document.createElement("div");
          backgroundDiv.id = backgroundPosterId;
          backgroundDiv.setAttribute(
            "style",
            `position: absolute; width: 100%; height: 100%; background: center / cover no-repeat url(${img}); filter: blur(30px);`
          );
          playerEl.appendChild(backgroundDiv);
        }
      }
    });
  }
  bootstrap();

})();
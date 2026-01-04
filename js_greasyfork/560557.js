// ==UserScript==
// @name         小红书网页直播界面美化
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  1.自动点击播放，去除底部打开APP按钮。2.调整视频为全屏显示，弹幕区域悬浮在左下
// @author       Ling77 & MAXLZ
// @license      MIT
// @icon         https://www.xiaohongshu.com/favicon.ico
// @match        https://www.xiaohongshu.com/livestream/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560557/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560557/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function bootstrap() {
    const title = document.querySelector(".livestream-container .title");
    if (title && title.textContent.includes("直播已结束")) return;
    document.body.style.width = "100%";
    window.addEventListener("load", function() {
      const playerEl = document.querySelector("#playerEl");
      if (!playerEl) return;
      const startDom = playerEl.querySelector(".xgplayer-start");
      const videoDom = playerEl.querySelector("video");
      startDom?.click();
      const bottomButton = document.querySelector(".fixed-bottom-button.live-fixed-bottom-button");
      const poster = playerEl.querySelector(".xgplayer-poster");
      const livestreamContainer = document.querySelector(".livestream-container");
      if (livestreamContainer) {
        const callback = mutationList => {
          mutationList.forEach(mutation => {
            if (mutation.type === "childList") {
              const addedNodes = mutation.addedNodes;
              for (let index = 0; index < addedNodes.length; index++) {
                const node = addedNodes[index];
                if (node instanceof HTMLElement && node.classList.contains("comment-container")) {
                  // !!! 可修改这里的参数来改变弹幕区域的大小和位置
                  Object.assign(node.style, {
                    height: '60%',
                    width: '30%',
                    position: 'fixed',
                    top: 'auto',
                    bottom: '20px',
                    left: '20px',
                    right: 'auto',
                    zIndex: '9999'
                  });
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
      if (videoDom) videoDom.style.objectFit = "contain";
      bottomButton?.remove();
      if (poster) {
        const matches = poster.style.backgroundImage.match(/http(s?).*(?="\))/);
        if (!matches) return;
        const img = matches[0];
        const backgroundPosterId = "backgroundPoster";
        if (!playerEl.querySelector(`#${backgroundPosterId}`)) {
          const backgroundDiv = document.createElement("div");
          backgroundDiv.id = backgroundPosterId;
          backgroundDiv.setAttribute("style", `position: absolute; width: 100%; height: 100%; background: center / cover no-repeat url(${img}); filter: blur(30px);`);
          playerEl.appendChild(backgroundDiv);
        }
      }
    });
  }
  bootstrap();
})();
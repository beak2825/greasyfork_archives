// ==UserScript==
// @name                屏蔽YouTube AV1 编码
// @description         Block AV1 codec on YouTube, but keep VP9 enabled for hardware decoding
// @namespace           http://tampermonkey.net/
// @version             1.0
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author              Modified from CY Fung's script
// @match               https://www.youtube.com/*
// @match               https://www.youtube.com/embed/*
// @match               https://www.youtube-nocookie.com/embed/*
// @match               https://m.youtube.com/*
// @exclude             https://www.youtube.com/live_chat*
// @exclude             https://www.youtube.com/live_chat_replay*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]* $ /
// @grant               none
// @run-at              document-start
// @license             MIT
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @unwrap
// @allFrames           true
// @inject-into         page
// @downloadURL https://update.greasyfork.org/scripts/564306/%E5%B1%8F%E8%94%BDYouTube%20AV1%20%E7%BC%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/564306/%E5%B1%8F%E8%94%BDYouTube%20AV1%20%E7%BC%96%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.debug("disable-youtube-av1-only", "injected");

  // 只屏蔽 AV1 相关编码，VP9 完全放行
  function typeTest(type) {
    if (typeof type === 'string' && type.startsWith('video/')) {
      // 屏蔽所有 AV1 变体
      if (type.includes('av01') || type.includes('av1')) {
        if (/codecs[\x20-\x7F]+\b(?:av01|av1)\b/.test(type)) {
          return false; // 不支持 AV1
        }
      }
      // 注意：这里 **不处理 vp9 / vp09**，直接返回 undefined 表示交由原生判断
    }
    return undefined; // 交给原始 canPlayType 决定
  }

  function makeModifiedTypeChecker(origChecker, useProbably) {
    return function (type) {
      let res = typeTest(type);
      if (res === undefined) {
        // 未匹配到 AV1，交给浏览器原生判断（VP9/H.264 等照常）
        res = origChecker.apply(this, arguments);
      } else {
        // 明确屏蔽 AV1
        res = useProbably ? (res ? "probably" : "") : res;
      }
      return res;
    };
  }

  // 替换 HTMLVideoElement.prototype.canPlayType
  const videoProto = HTMLVideoElement?.prototype;
  if (videoProto && typeof videoProto.canPlayType === 'function') {
    videoProto.canPlayType = makeModifiedTypeChecker(videoProto.canPlayType, true);
  }

  // 替换 MediaSource.isTypeSupported
  const mse = window.MediaSource;
  if (mse && typeof mse.isTypeSupported === 'function') {
    mse.isTypeSupported = makeModifiedTypeChecker(mse.isTypeSupported);
  }

  // 额外：设置 YouTube 的 AV1 偏好为 480p（即 >480p 不用 AV1）
  try {
    Object.defineProperty(localStorage.constructor.prototype, 'yt-player-av1-pref', {
      get() {
        if (this === localStorage) return '480';
        return this.getItem('yt-player-av1-pref');
      },
      set(nv) {
        this.setItem('yt-player-av1-pref', nv);
        return true;
      },
      enumerable: true,
      configurable: true
    });
    if (localStorage['yt-player-av1-pref'] !== '480') {
      localStorage['yt-player-av1-pref'] = '480';
    }
    console.debug("disable-youtube-av1-only", "Set yt-player-av1-pref = 480");
  } catch (e) {
    console.warn("Failed to set yt-player-av1-pref:", e);
  }

})();
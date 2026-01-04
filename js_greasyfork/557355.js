// ==UserScript==
// @name Display YouTube controller below the video
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description youtubeのコントローラーを動画下に表示する
// @author Me
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/557355/Display%20YouTube%20controller%20below%20the%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/557355/Display%20YouTube%20controller%20below%20the%20video.meta.js
// ==/UserScript==

(function() {
let css = `
    /* 動画コントローラーを動画下に表示する */
    :root {
        --controller-height: 61px;
        --controller-bgcolor: #000;
    }
    ytd-watch-flexy[theater] #full-bleed-container,
    ytd-watch-flexy:not([theater]) #player-container-outer {
        margin-bottom: calc(var(--controller-height) + 10px) !important;
    }
    #movie_player,
    #error-screen {
        z-index: 1;
    }
    #ytd-player,
    .html5-video-player {
        overflow: visible !important;
    }
    html:not([data-cast-api-enabled]) ytd-watch-flexy[theater] #movie_player:not(.ytp-full-bleed-player) > .ytp-chrome-bottom {
        margin-bottom: calc(var(--controller-height) * -1 - 15px) !important;
    }
    html:not([data-cast-api-enabled]) #movie_player:not(.ytp-full-bleed-player) > .ytp-chrome-bottom {
        margin-bottom: calc(var(--controller-height) * -1) !important;
    }
    ytd-watch-flexy[theater] #player-container:not(.ytd-video-preview)::after {
        height: calc(var(--controller-height) + 15px);
    }
    #player-container:not(.ytd-video-preview)::after {
        content: '';
        position: absolute;
        width: 100%;
        height: var(--controller-height);
        background: var(--controller-bgcolor);
    }
 
    /* 再生終了後の動画を非表示 */
    #player-container:has(.ytp-fullscreen-grid[aria-label]:not([style*="display: none"])) #movie_player:not(.ytp-full-bleed-player) video {
        display: none !important;
    }
    /* シークバーのシーンプレビュー横幅をはみ出さない */
    .ytp-fine-scrubbing-container {
        overflow: hidden !important;
    }
    /* ツールチップサムネイルと字幕の表示を下げる */
    html:not([data-cast-api-enabled]) :is(#movie_player:not(.ytp-player-minimized):not(.ytp-full-bleed-player) > .ytp-tooltip,
    div:not(#inline-preview-player) > #ytp-caption-window-container) {
        margin-top: var(--controller-height) !important;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

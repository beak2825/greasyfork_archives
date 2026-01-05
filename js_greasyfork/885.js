// ==UserScript==
// @name        Nico User Ads Hider
// @namespace   http://userscripts.org/users/121129
// @description ニコニ広告による動画への装飾を削除
// @match       *://www.nicovideo.jp/video_top*
// @match       *://www.nicovideo.jp/tag/*
// @match       *://www.nicovideo.jp/search/*
// @match       *://www.nicovideo.jp/ranking*
// @version     12
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/885/Nico%20User%20Ads%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/885/Nico%20User%20Ads%20Hider.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  const css = `
    /* 検索結果 */
    .video [data-nicoad-grade="gold"] .itemThumbWrap::before,
    .video [data-nicoad-grade="silver"] .itemThumbWrap::before {
      all: initial;
    }

    /* 動画TOP */
    /* ランキング */
    [data-nicoad-grade="gold"] .Thumbnail.VideoThumbnail,
    [data-nicoad-grade="silver"] .Thumbnail.VideoThumbnail {
      background: inherit;
    }
    [data-nicoad-grade="silver"] .Thumbnail.VideoThumbnail::after,
    [data-nicoad-grade="gold"] .Thumbnail.VideoThumbnail::after {
      background-image: initial;
    }
    [data-nicoad-grade] .Thumbnail.VideoThumbnail .Thumbnail-image {
      margin: 0px;
      background-size: 100%;
    }
    [data-nicoad-grade="gold"] .NC-NicoadFrame::after,
    [data-nicoad-grade="silver"] .NC-NicoadFrame::after,
    .NC-NicoadFrame_gold::after,
    .NC-NicoadFrame_silver::after {
      display: none;
    }
  `
  const style = document.createElement('style')
  style.id = 'NicoUserAdsHiderStyle'
  style.textContent = css
  document.head.appendChild(style)
})()

// ==UserScript==
// @name         Tokyo-Motion progress thumbnail viewer
// @namespace    tokyo-motion-progressthumb
// @version      1.0
// @description  Show progress thumbnail image on Tokyo-Motion video pages
// @match        https://www.tokyomotion.net/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/560746/Tokyo-Motion%20progress%20thumbnail%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/560746/Tokyo-Motion%20progress%20thumbnail%20viewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // URLから動画IDを抽出
  const match = location.pathname.match(/\/([0-9]{1,})\/?/);
  if (!match) return;

  const id = match[1];

  // 上位ディレクトリ計算（3桁以下にも対応）
  const baseDir = id.length > 3 ? id.slice(0, -3) : '0';

  // 画像URL生成
  const imgUrl =
    `https://cdn.tokyo-motion.net/media/videos/vjsslides/${baseDir}/${id}_progressthumb.jpg`;

  // img要素作成
  const img = document.createElement('img');
  img.src = imgUrl;
  img.alt = 'progress thumbnail';
  img.style.maxWidth = '100%';
  img.style.display = 'block';
  img.style.margin = '10px auto';
  img.style.border = '1px solid #666';

  // 読み込み失敗時は何もしない
  img.onerror = () => img.remove();

  // ページ先頭に挿入
  document.body.prepend(img);
})();

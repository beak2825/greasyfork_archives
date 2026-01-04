// ==UserScript==
// @name         あいもげザ・ワールドちゃん
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  カタログのアニメーションを完全停止
// @match        https://nijiurachan.net/pc/catalog.php*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560497/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B6%E3%83%BB%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/560497/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B6%E3%83%BB%E3%83%AF%E3%83%BC%E3%83%AB%E3%83%89%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 対象となる拡張子かどうか判定
  function isAnimatedCandidate(img) {
    const src = (img.currentSrc || img.src || '').toLowerCase();
    // 簡易判定: 拡張子が .gif .apng .webp のものは全部対象
    // ※本当は非アニメなwebpも含まれますが、ブラウザ側から「アニメかどうか」
    //   を軽く知る方法が無いので、ここは割り切っています
    return /\.(gif|apng|webp)(\?|#|$)/.test(src);
  }

  function freezeImage(img) {
    if (!img || img.dataset._frozen === '1') return;
    if (!isAnimatedCandidate(img)) return;

    // サイズ情報を取得
    const style = window.getComputedStyle(img);
    const widthCSS  = style.width;
    const heightCSS = style.height;

    // naturalWidth/Height は 0 の場合もあるので fallback ありで
    const natW = img.naturalWidth  || parseFloat(widthCSS)  || img.width  || 0;
    const natH = img.naturalHeight || parseFloat(heightCSS) || img.height || 0;
    if (!natW || !natH) {
      // サイズがわからない場合は諦める
      return;
    }

    // キャンバス生成
    const canvas = document.createElement('canvas');
    canvas.width = natW;
    canvas.height = natH;

    // 見た目サイズ（レイアウト）を img と合わせる
    canvas.style.width  = widthCSS;
    canvas.style.height = heightCSS;
    canvas.style.display = style.display;
    canvas.style.objectFit = style.objectFit;
    canvas.style.borderRadius = style.borderRadius;
    canvas.style.margin = style.margin;
    canvas.style.verticalAlign = style.verticalAlign;

    // クラス名・title など最低限の情報もコピー
    canvas.className = img.className + ' frozen-animated-image';
    canvas.title = img.title || img.alt || '';

    const ctx = canvas.getContext('2d');

    try {
      // 1フレームだけ描画（=現在のフレーム）
      ctx.drawImage(img, 0, 0, natW, natH);
    } catch (e) {
      // クロスオリジン等で taint されても drawImage 自体は普通は通るので、
      // ここに来ることはあまり無いはず。失敗したら諦め。
      console.warn('Failed to freeze image:', e);
      return;
    }

    // DOM 差し替え： img を隠して canvas を直前に挿入
    img.style.display = 'none';
    if (img.parentNode) {
      img.parentNode.insertBefore(canvas, img);
    }

    img.dataset._frozen = '1';
  }

  function processImg(img) {
    if (!(img instanceof HTMLImageElement)) return;

    // すでに処理済みなら無視
    if (img.dataset._observed === '1') return;
    img.dataset._observed = '1';

    if (img.complete) {
      freezeImage(img);
    } else {
      img.addEventListener('load', function onLoad() {
        img.removeEventListener('load', onLoad);
        freezeImage(img);
      });
    }
  }

  function scanAllImages() {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(processImg);
  }

  // 初期スキャン
  scanAllImages();

  // 追加されたノードも監視（SPA / 無限スクロール対策）
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue; // Element ノードのみ
        if (node.tagName === 'IMG') {
          processImg(node);
        } else {
          const imgs = node.querySelectorAll && node.querySelectorAll('img');
          imgs && imgs.forEach(processImg);
        }
      }
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true,
  });
})();

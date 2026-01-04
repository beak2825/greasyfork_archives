// ==UserScript==
// @name         Fix_Mizugazo
// @namespace    http://tampermonkey.net/
// @version      2025-12-08-1
// @description  mizugazo の記事内の画像がブラウザ幅いっぱいに拡大されるのを抑制します。
// @author       Not_Leonian
// @match        https://mizugazo.com/archives/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mizugazo.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558299/Fix_Mizugazo.user.js
// @updateURL https://update.greasyfork.org/scripts/558299/Fix_Mizugazo.meta.js
// ==/UserScript==

(() => {
	// 画像をここまでの幅に抑える
	const MAX_IMAGE_WIDTH_PX = 900;
	const STYLE_ID = "tm-mizugazo-image-fix-v2";

	function injectStyle() {
		if (document.getElementById(STYLE_ID)) return;

		const style = document.createElement("style");
		style.id = STYLE_ID;
		style.textContent = `
      /* ==========================================================
         1. 記事中の画像自体の「過剰な拡大」を止める
         ========================================================== */

      /* 投稿用のアップロード画像だけをターゲットにするイメージ */
      img[src*="/wp-content/uploads/"],
      .single_thumbnail > img,
      .wp-block-gallery img {
        width: auto !important;                        /* 元画像サイズを基準に */
        max-width: ${MAX_IMAGE_WIDTH_PX}px !important; /* これ以上には拡大しない */
        height: auto !important;
        object-fit: contain !important;                /* トリミング無効化の保険 */
        display: block !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }

      /* ==========================================================
         2. WordPress ギャラリー (.wp-block-gallery) の
            「タイル＋トリミング」レイアウトを無効化する
         ========================================================== */

      /* ギャラリー全体を普通の縦並びコンテナ扱いに */
      .wp-block-gallery,
      .wp-block-gallery .blocks-gallery-grid,
      .wp-block-gallery .wp-block-gallery__wrapper {
        display: block !important;
      }

      /* 各アイテムを 1 行に 1 枚のブロック画像として扱う */
      .wp-block-gallery .blocks-gallery-item,
      .wp-block-gallery .blocks-gallery-image,
      .wp-block-gallery .wp-block-image {
        width: auto !important;
        margin: 1.5em 0 !important;
      }

      .wp-block-gallery .blocks-gallery-item figure,
      .wp-block-gallery .blocks-gallery-image figure,
      .wp-block-gallery .wp-block-image figure {
        margin: 0 !important;
      }

      /* is-cropped による高さ固定・トリミングを解除 */
      .wp-block-gallery.is-cropped .blocks-gallery-item img,
      .wp-block-gallery.is-cropped .blocks-gallery-image img,
      .wp-block-gallery.is-cropped .wp-block-image img {
        height: auto !important;
      }
    `;
		document.head.appendChild(style);
	}

	// width/height 属性も消しておく（保険）
	function cleanAttributes(root) {
		const selector =
			'img[src*="/wp-content/uploads/"], .single_thumbnail > img, .wp-block-gallery img';
		root.querySelectorAll(selector).forEach((img) => {
			img.removeAttribute("width");
			img.removeAttribute("height");
		});
	}

	function init() {
		injectStyle();
		cleanAttributes(document);

		// lazy load などで後から追加された画像にも適用
		const observer = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.type === "childList" && m.addedNodes.length) {
					m.addedNodes.forEach((node) => {
						if (node.nodeType === 1) {
							cleanAttributes(node);
						}
					});
				}
			}
		});

		observer.observe(document.documentElement, {
			childList: true,
			subtree: true,
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();

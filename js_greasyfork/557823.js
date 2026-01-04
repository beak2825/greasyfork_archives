// ==UserScript==
// @name         AIMG catalog image zoomer
// @name:ja      あいもげカタログ画像拡大
// @namespace    https://nijiurachan.net/pc/catalog.php
// @version      1.5
// @description  カタログの画像/スレ文をホバー時拡大表示
// @author       doridoridoridorin
// @match        https://nijiurachan.net/pc/catalog*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557823/AIMG%20catalog%20image%20zoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/557823/AIMG%20catalog%20image%20zoomer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* === 設定 === */
    const config = {
        scale: 2.0,            // 拡大倍率
        hoverDelay: 250,       // 拡大開始までの待機時間（ミリ秒）
        duration: '0.5s',      // アニメーション時間
        boxShadow: '0 8px 25px rgba(0,0,0,0.5)', // 影
        zIndex: 999999         // 最前面指定
    };

    /* === メニュー登録 === */
    // 設定値の取得（デフォルトはfalse: OFF）
    const showThreadText = GM_getValue('showThreadText', false);

    // メニューコマンドの登録
    GM_registerMenuCommand(`スレ文表示: ${showThreadText ? 'ON' : 'OFF'} (クリックで切替)`, () => {
        GM_setValue('showThreadText', !showThreadText);
        location.reload(); // 設定反映のためリロード
    });

    /* === スタイル定義 === */
    const css = `
        /* 拡大画像の入れ物（aタグ） */
        .tm-popup-wrapper {
            position: fixed;
            z-index: ${config.zIndex};
            display: block;
            text-decoration: none;
            outline: none;
            cursor: pointer; /* クリックできることを示す */

            /* アニメーション設定 */
            transform-origin: center center;
            transition: transform ${config.duration} cubic-bezier(0.175, 0.885, 0.32, 1.275),
                        box-shadow ${config.duration};

            /* 初期状態 */
            transform: scale(1);
            box-shadow: none;

            pointer-events: auto;
        }

        /* 拡大時の状態 */
        .tm-popup-wrapper.is-active {
            transform: scale(${config.scale});
            box-shadow: ${config.boxShadow};
        }

        /* 中身の画像 */
        .tm-popup-img {
            display: block;
            width: 100%;
            height: 100%;
            /* 画像自体のイベントは親のaタグに任せる */
            pointer-events: none;
            backface-visibility: hidden;
        }

        /* スレ文ポップアップ */
        .tm-text-popup {
            position: fixed;
            z-index: ${config.zIndex + 1}; /* 画像より上に表示 */
            display: block;

            /* 装飾 */
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            font-family: sans-serif;
            font-size: 18px;
            line-height: 1.5;
            color: inherit; /* JSで動的に設定 */

            /* サイズ設定（横長） */
            width: max-content;
            max-width: 500px; /* 横に広がりすぎないように制限 */
            min-width: 300px;

            /* アニメーション */
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 0;
            transform: translateY(-10px); /* 少し上から降りてくる演出 */

            pointer-events: none; /* マウスイベント透過（画像ホバー状態を維持するため） */
            box-sizing: border-box;
            border: 1px solid rgba(0,0,0,0.1); /* 薄い境界線 */
        }

        /* スレ文表示時の状態 */
        .tm-text-popup.is-active {
            opacity: 1;
            transform: translateY(0);
        }
    `;

    GM_addStyle(css);

    /* === ロジック部分 === */
    let activePopup = null;
    let activeTextPopup = null; // 追加: スレ文用ポップアップ
    let activeImg = null;
    let hoverTimer = null; // タイマー格納用変数

    // マウスオーバー監視
    document.body.addEventListener('mouseover', function(e) {
        let targetImg = e.target;

        // 対象チェック
        if (targetImg.tagName !== 'IMG' && targetImg.tagName !== 'CANVAS') return;
        const parentLink = targetImg.closest('a');
        if (!parentLink) return;
        const parentTd = parentLink.closest('td');
        if (!parentTd) return;

        // ポップアップ上の操作なら無視
        if (targetImg.classList.contains('tm-popup-img')) return;

        // 既にタイマーが走っていたらリセット（念のため）
        if (hoverTimer) clearTimeout(hoverTimer);

        // 指定時間後に実行するタイマーをセット
        hoverTimer = setTimeout(() => {
            createPopup(targetImg, parentLink);
        }, config.hoverDelay);
    });

    // マウスアウト監視
    document.body.addEventListener('mouseout', function(e) {
        const targetImg = e.target;

        // まだ拡大前の待機中であれば、タイマーをキャンセル（拡大しない）
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }

        // 既にポップアップが出ている場合の処理
        if (activePopup) {
            const leftElement = e.target; // 出ていった要素
            const enteredElement = e.relatedTarget; // 入っていった要素

            // ケース1: 元画像からマウスが外れた時
            if (leftElement === activeImg) {
                // 移動先がポップアップなら消さない（引き継ぎ）
                if (activePopup.contains(enteredElement)) return;
                removePopup();
            }

            // ケース2: ポップアップからマウスが外れた時
            // (aタグ自体から外れた場合を検知)
            if (leftElement === activePopup || leftElement.closest('.tm-popup-wrapper') === activePopup) {
                // 移動先が元の画像なら消さない（戻った場合）
                if (enteredElement === activeImg) return;
                // ポップアップ内部の要素間移動なら消さない
                if (activePopup.contains(enteredElement)) return;

                removePopup();
            }
        }
    });

    // スタイルコピー用
    const stylesToCopy = [
        'borderRadius', 'border', 'padding', 'backgroundColor',
        'objectFit', 'objectPosition'
    ];

    function createPopup(originalImg, originalLink) {
        // 既に表示中のものがあれば消す
        if (activePopup) removePopup();

        activeImg = originalImg;

        // 元の画像の位置とサイズを取得
        const rect = originalImg.getBoundingClientRect();
        // 元の画像のスタイル情報を取得
        const computedStyle = window.getComputedStyle(originalImg);

        // ラッパー(aタグ)を作成
        const wrapper = document.createElement('a');
        wrapper.className = 'tm-popup-wrapper';
        wrapper.href = originalLink.href; // リンク先をコピー
        wrapper.target = originalLink.target; // _blank等の設定もコピー

        // 位置合わせ
        wrapper.style.top = rect.top + 'px';
        wrapper.style.left = rect.left + 'px';
        wrapper.style.width = rect.width + 'px';
        wrapper.style.height = rect.height + 'px';

        // クローン画像要素を作成
        const popup = document.createElement('img');
        popup.className = 'tm-popup-img';
        popup.src = originalImg.src;
        // canvasの場合次要素の画像リンクを取得
        if(originalImg.tagName === 'CANVAS') {
            popup.src = originalImg.nextElementSibling.src
        }

        // 定義したリストに従ってスタイルをコピー
        stylesToCopy.forEach(prop => {
            wrapper.style[prop] = computedStyle[prop];
            popup.style[prop] = computedStyle[prop];
        });
        // はみ出し防止
        wrapper.style.borderRadius = computedStyle.borderRadius;
        popup.style.borderRadius = computedStyle.borderRadius;

        // DOMに追加
        wrapper.appendChild(popup);
        document.body.appendChild(wrapper);
        activePopup = wrapper;

        // === 修正箇所: スレ文表示ONかつdata-textがある場合の処理 ===
        if (showThreadText) {
            const parentTd = originalLink.closest('td');
            if (parentTd) {
                // data-text属性を取得（HTMLタグが含まれる可能性がある）
                const dataText = parentTd.getAttribute('data-text');

                if (dataText) {
                    const textPopup = document.createElement('div');
                    textPopup.className = 'tm-text-popup';
                    textPopup.innerHTML = dataText; // HTMLとして挿入

                    // 上位のtdタグのスタイルをコピーして適用
                    const tdStyle = window.getComputedStyle(parentTd);
                    textPopup.style.color = tdStyle.color;
                    const bgColor = tdStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' ? tdStyle.backgroundColor : 'rgba(255,255,255,0.95)';
                    textPopup.style.backgroundColor = bgColor;

                    // 位置計算のために一旦DOMに追加
                    document.body.appendChild(textPopup);

                    // 拡大後の画像の「見た目上の位置」を計算
                    // scaleで拡大されるため、上下左右にはみ出す量を考慮する
                    const scale = config.scale;
                    const expandedHeight = rect.height * scale;
                    const expandedWidth = rect.width * scale;

                    // 拡大によるはみ出し量(片側)
                    const offsetY = (expandedHeight - rect.height) / 2;
                    const offsetX = (expandedWidth - rect.width) / 2;

                    // 画像の下側に配置 (元の位置 + 高さ + 下方向のはみ出し分 + 余白10px)
                    const topPos = rect.bottom + offsetY + 5;

                    // 画像の左端に合わせる (元の位置 - 左方向のはみ出し分)
                    const leftPos = rect.left - offsetX;

                    textPopup.style.top = topPos + 'px';
                    textPopup.style.left = leftPos + 'px';

                    // 画面右端からはみ出さないように簡易調整
                    const textRect = textPopup.getBoundingClientRect();
                    if (leftPos + textRect.width > window.innerWidth) {
                        textPopup.style.left = (window.innerWidth - textRect.width - 20) + 'px';
                    }

                    activeTextPopup = textPopup;

                    // アニメーション開始
                    requestAnimationFrame(() => {
                        textPopup.classList.add('is-active');
                    });
                }
            }
        }
        // ==========================================

        // 画像のアニメーション開始
        requestAnimationFrame(() => {
            wrapper.classList.add('is-active');
        });
    }

    function removePopup() {
        if (activePopup) {
            activePopup.remove(); // 要素をDOMから削除
            activePopup = null;   // 変数を初期化
            activeImg = null;
        }
        // 追加: スレ文ポップアップの削除
        if (activeTextPopup) {
            activeTextPopup.remove();
            activeTextPopup = null;
        }
    }

})();
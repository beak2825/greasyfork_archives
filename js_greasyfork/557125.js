// ==UserScript==
// @name         CCFOLIA Timer Resize & Auto Position
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  ココフォリアのタイマーをリサイズ可能にし、初期位置をBGMの下に自動調整します
// @author       You
// @match        https://ccfolia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccfolia.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557125/CCFOLIA%20Timer%20Resize%20%20Auto%20Position.user.js
// @updateURL https://update.greasyfork.org/scripts/557125/CCFOLIA%20Timer%20Resize%20%20Auto%20Position.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 設定・定数
     */
    const STORAGE_KEY = 'ccfolia_timer_scale_v5';
    // Chrome/Edge等はzoomプロパティで判定ごとの縮小が可能
    const IS_ZOOM_SUPPORTED = 'zoom' in document.documentElement.style;
    const BGM_MARGIN_BOTTOM = 16; // BGM UIとの間隔(px)

    /**
     * スタイル定義
     * リサイズハンドルの定義（元のデザインを阻害しない）
     */
    const RESIZER_STYLE = `
        #ccfolia-timer-resizer {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 24px;
            height: 24px;
            /* 視覚的なハンドル（右下の斜線グリップ） */
            background: linear-gradient(135deg, transparent 50%, rgba(200,200,200,0.5) 50%, rgba(200,200,200,0.8) 55%, transparent 60%);
            cursor: se-resize;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.2s;
            border-bottom-right-radius: 4px;
            transform-origin: bottom right;
            pointer-events: auto;
        }
        /* 親要素（タイマーパネル）ホバー時のみ表示 */
        div[class*="MuiPaper-elevation5"]:hover #ccfolia-timer-resizer {
            opacity: 1;
        }
    `;

    // スタイルをドキュメントに注入
    const styleEl = document.createElement('style');
    styleEl.innerHTML = RESIZER_STYLE;
    document.head.appendChild(styleEl);

    /**
     * 状態管理変数
     */
    let currentScale = parseFloat(localStorage.getItem(STORAGE_KEY)) || 1.0;
    let rawX = 0;
    let rawY = 0;

    /**
     * タイマー要素を特定する関数
     */
    function findTimerElement() {
        // "MuiPaper-elevation5" を持つ要素の中から、時間表記や再生ボタンを含むものを探す
        const papers = document.querySelectorAll('div[class*="MuiPaper-elevation5"]');
        for (const paper of papers) {
            if (paper.innerText.match(/\d{2}:\d{2}:\d{2}/) || paper.querySelector('svg[data-testid="PlayCircleFilledIcon"]')) {
                return paper;
            }
        }
        return null;
    }

    /**
     * BGM UIの下端座標を取得する関数
     * 音量アイコンを基準に親要素を遡ってパネルの底を探す
     */
    function getBgmBottomPosition() {
        const icon = document.querySelector('svg[data-testid="VolumeOffIcon"]');
        if (!icon) return 0;

        // アイコンから親要素をいくつか遡り、適切なBGMパネル領域の下端を探す
        let target = icon;
        let maxBottom = 0;

        // 5階層程度遡ればコンテナに到達するはず
        for(let i = 0; i < 5; i++) {
            if (!target.parentElement) break;
            target = target.parentElement;

            const rect = target.getBoundingClientRect();
            // 画面全体を覆うような巨大な要素は除外
            if (rect.width > window.innerWidth * 0.8) continue;

            // 最も下にある要素の下端を採用
            if (rect.bottom > maxBottom) {
                maxBottom = rect.bottom;
            }
        }
        return maxBottom;
    }

    /**
     * 座標補正ロジック
     * zoom使用時は座標系も拡大縮小されるため、逆数を掛けて補正する
     */
    function updatePosition(element, x, y) {
        if (!IS_ZOOM_SUPPORTED) return;

        // 拡大率に応じた座標補正
        // 画面上の狙った位置(x,y)に置くには、zoom倍された座標系で (x/scale, y/scale) を指定する
        const fixedX = x * (1 / currentScale);
        const fixedY = y * (1 / currentScale);

        // 無限ループ防止用のフラグ設定
        element.dataset.lastFixedX = fixedX;
        element.dataset.lastFixedY = fixedY;

        element.style.transform = `translate3d(${fixedX}px, ${fixedY}px, 0px)`;
    }

    /**
     * 初期位置調整ロジック
     * BGM UIと重なっている場合のみ移動させる
     */
    function adjustInitialPosition(timerPanel) {
        // 既に調整済みなら何もしない
        if (timerPanel.dataset.positionAdjusted === 'true') return;

        const bgmBottom = getBgmBottomPosition();
        if (bgmBottom === 0) return; // BGM UIが見つからない場合はスキップ

        const timerRect = timerPanel.getBoundingClientRect();

        // 重なり判定 & 初期位置判定
        // タイマーの上端がBGMの下端より上にあり、かつ左上付近(初期位置)にある場合
        const isOverlapping = timerRect.top < bgmBottom;
        const isInitialPosition = Math.abs(timerRect.left) < 50 && Math.abs(timerRect.top) < 100;

        if (isOverlapping || isInitialPosition) {
            // 左端は0、上端はBGMの下端 + マージン
            rawX = 0;
            rawY = bgmBottom + BGM_MARGIN_BOTTOM;

            updatePosition(timerPanel, rawX, rawY);
            timerPanel.dataset.positionAdjusted = 'true';
            console.log('Timer position adjusted to:', rawY);
        }
    }

    /**
     * メイン初期化処理
     */
    function initTimerResizer() {
        const timerPanel = findTimerElement();

        // まだロードされていない場合は待機
        if (!timerPanel) {
            setTimeout(initTimerResizer, 1000);
            return;
        }

        // --- 初期位置調整の実行 ---
        // scale適用前に座標計算用の基準値をセットするため、ここで座標を取得しておく
        if (IS_ZOOM_SUPPORTED && timerPanel.style.transform) {
            const match = timerPanel.style.transform.match(/translate3d\(([^,]+)px,\s*([^,]+)px/);
            if (match) {
                // transformの値はzoom適用後の座標系なので、実画面座標(raw)に換算するには scale を掛ける必要があるが、
                // 初期ロード直後は zoom=1 のはずなのでそのまま取得してよい
                // ただし、この後 adjustInitialPosition で強制的に書き換える可能性がある
                rawX = parseFloat(match[1]);
                rawY = parseFloat(match[2]);
            }
        }

        // BGMの下に移動させる
        adjustInitialPosition(timerPanel);

        // 既にハンドルがある場合は終了
        if (timerPanel.querySelector('#ccfolia-timer-resizer')) return;

        // ハンドル要素の生成
        const resizer = document.createElement('div');
        resizer.id = 'ccfolia-timer-resizer';
        resizer.title = 'ドラッグでサイズ変更';
        timerPanel.appendChild(resizer);

        // --- 初期倍率の適用 ---
        if (IS_ZOOM_SUPPORTED) {
            timerPanel.style.zoom = currentScale;
            resizer.style.transform = `scale(${1 / currentScale})`; // ハンドル自体の大きさは維持

            // 倍率適用後に座標を再適用（adjustInitialPositionで設定されたrawX, rawYを使用）
            updatePosition(timerPanel, rawX, rawY);
        } else {
            // Firefox用フォールバック
            timerPanel.style.transformOrigin = "0 0";
            timerPanel.style.transform = `${timerPanel.style.transform} scale(${currentScale})`;
        }

        // --- ドラッグ操作によるリサイズ処理 ---
        let isResizing = false;
        let startX, startY, startScale;

        const onMouseMove = (e) => {
            if (!isResizing) return;
            const delta = (e.clientX - startX) + (e.clientY - startY);
            const sensitivity = 0.003; // 感度調整
            let newScale = startScale + (delta * sensitivity);

            // 倍率制限 (0.5倍 ~ 3.0倍)
            if (newScale < 0.5) newScale = 0.5;
            if (newScale > 3.0) newScale = 3.0;

            currentScale = newScale;

            if (IS_ZOOM_SUPPORTED) {
                timerPanel.style.zoom = currentScale;
                resizer.style.transform = `scale(${1 / currentScale})`;
                updatePosition(timerPanel, rawX, rawY);
            } else {
                const currentTrans = timerPanel.style.transform.replace(/scale\([^)]+\)/, '').trim();
                timerPanel.style.transform = `${currentTrans} scale(${currentScale})`;
            }
        };

        const onMouseUp = () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                localStorage.setItem(STORAGE_KEY, currentScale); // 設定保存
            }
        };

        resizer.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            e.preventDefault();
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startScale = currentScale;
            document.body.style.cursor = 'se-resize';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // --- 監視処理 (本体ドラッグ移動時の補正) ---
        // ココフォリア本体がタイマーを動かした際、座標が上書きされるのを検知して再補正する
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (!IS_ZOOM_SUPPORTED) return;

                    // 外部要因でzoomが消されていたら再適用
                    if (timerPanel.style.zoom != currentScale) {
                        timerPanel.style.zoom = currentScale;
                    }

                    // transformの変更を検知
                    const currentTransform = timerPanel.style.transform;
                    if (!currentTransform.includes('translate3d')) return;

                    const match = currentTransform.match(/translate3d\(([^,]+)px,\s*([^,]+)px/);
                    if (!match) return;

                    const curX = parseFloat(match[1]);
                    const curY = parseFloat(match[2]);

                    const lastFixedX = parseFloat(timerPanel.dataset.lastFixedX);
                    const lastFixedY = parseFloat(timerPanel.dataset.lastFixedY);

                    // 自身による補正更新ならループ防止のため無視
                    if (Math.abs(curX - lastFixedX) < 0.1 && Math.abs(curY - lastFixedY) < 0.1) {
                        return;
                    }

                    // アプリ本体による座標変更であれば、値を更新して補正適用
                    rawX = curX;
                    rawY = curY;
                    updatePosition(timerPanel, rawX, rawY);
                }
            });
        });

        observer.observe(timerPanel, { attributes: true });
    }

    // DOM監視開始 (ページ遷移やリロードで要素が作り直された場合に対応)
    const bodyObserver = new MutationObserver(() => {
        if (!document.querySelector('#ccfolia-timer-resizer')) {
            if (findTimerElement()) {
                initTimerResizer();
            }
        }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // 初回実行
    initTimerResizer();

})();
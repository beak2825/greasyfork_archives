// ==UserScript==
// @name        あいもげホバー表示ちゃん
// @namespace   Violentmonkey Scripts
// @version     2.2
// @description 画像・動画にマウスをホバーしたときに「保存」「拡大・縮小」ボタンを追加
// @match       https://nijiurachan.net/pc/thread.php?id=*
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557206/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%83%9B%E3%83%90%E3%83%BC%E8%A1%A8%E7%A4%BA%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557206/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%83%9B%E3%83%90%E3%83%BC%E8%A1%A8%E7%A4%BA%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============================================================================================================
    // ユーザーメニューの設定
    // =============================================================================================================

    // ---------------- 拡大率の設定 ----------------
    const ZOOM_CHOICES = [0.6, 0.8, 1.0];
    let ZOOM_RATE = GM_getValue("zoomRate", 1.0);
    let menuIds = [];

    // メニューの処理
    function registerZoomMenu() {

        // 初期化
        menuIds.forEach(id => GM_unregisterMenuCommand(id));
        menuIds = [];

        // 新しい拡大率を登録
        ZOOM_CHOICES.forEach(rate => {
            const percent = Math.round(rate * 100);

            const label = (rate === ZOOM_RATE)
                ? `拡大率: ${percent}% (現在)`
                : `拡大率: ${percent}%`;

            const id = GM_registerMenuCommand(label, () => {
                GM_setValue("zoomRate", rate);
                ZOOM_RATE = rate;

                // 更新
                registerZoomMenu();

                alert(`拡大率を ${percent}% に変更しました`);
            });

            menuIds.push(id);
        });
    }

    // メニューに登録
    registerZoomMenu();

    // -------- 拡大時の自動再生の設定 --------
    let VIDEO_AUTOPLAY = GM_getValue("videoAutoplay", true);
    let videoMenuIds = [];

    function registerVideoAutoplayMenu() {

        // 初期化
        videoMenuIds.forEach(id => GM_unregisterMenuCommand(id));
        videoMenuIds = [];

        const options = [
            { label: "拡大時に動画を自動再生：する", value: true },
            { label: "拡大時に動画を自動再生: しない", value: false }
        ];

        options.forEach(opt => {

            const label = (opt.value === VIDEO_AUTOPLAY)
                ? `${opt.label} (現在)`
                : opt.label;

            const id = GM_registerMenuCommand(label, () => {
                GM_setValue("videoAutoplay", opt.value);
                VIDEO_AUTOPLAY = opt.value;

                // 更新
                registerVideoAutoplayMenu();

                alert(`拡大時に動画を自動再生 ${opt.value ? "する" : "しない"} ように変更しました`);
            });

            videoMenuIds.push(id);
        });
    }

    // 初回登録
    registerVideoAutoplayMenu();

    // =============================================================================================================
    // メインで使う関数や処理
    // =============================================================================================================

    // アスペクト比を維持したまま、横幅だけ画面内に収める
    function computeWidthFittedSize(naturalWidth, zoomRate) {
        // 基本の拡大後の幅
        let targetWidth = naturalWidth * zoomRate;

        // 画面幅の 90% を最大値とする
        const maxWidth = window.innerWidth * 0.8;

        // 最大幅を超える場合だけ縮める
        if (targetWidth > maxWidth) {
            targetWidth = maxWidth;
        }

        console.log("原寸幅:", naturalWidth, "ウィンドウ幅:", window.innerWidth, "拡大後幅:", targetWidth);

        return targetWidth; // 高さは自動で決まる
    }

    // レイアウト用のCSSを追加する
    const addStyle = () => {
        if (document.getElementById("userscript-style")) return;

        const style = document.createElement('style');
        style.id = "userscript-style";
        style.textContent = `
            /* 動画にも画像と同じように margin-left: 20px を追加して位置合わせ
               (デフォルトだとmargin-leftじゃなくてmargin-right: 20pxになっている?) */
            video {
              margin-left: 20px !important;
            }

            .media_wrapper {
                position: relative;
                /* display: inline-block; */
            }

            .media_button {
                position: absolute;
                top: 5px;
                left: 25px;
                opacity: 0;
                transition: opacity 0.3s;
                display: flex;
            }

            /* 画像にホバーしたときのボタンの透過度 */
            .media_wrapper:hover .media_button {
                opacity: 0.5;
            }

            /* ボタンにホバーしたときのボタンの透過度 */
            .media_button:hover {
                opacity: 1 !important;
            }

            .media_btn {
                height: 32px;
                padding: 6px 6px;
                border: 1px solid #888;
                background: #eee;
                font-size: 12px;
                user-select: none;
            }

            .media_btn:hover {
                background: #ccc;
            }
        `;
        document.head.appendChild(style);
    };

    // 保存ボタンの設定
    const createSaveButton = (url) => {
        const btn = document.createElement('button');
        btn.textContent = "保存";
        btn.className = "media_btn";

        // クリック時の処理
        btn.onclick = () => {
            if (!url) return false;
            // 仮のリンクを生成してダウンロードする
            const a = document.createElement('a');
            a.href = url;
            a.download = url.split('/').pop() || 'download';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return false;
        };
        return btn;
    };

    // 画像用の拡大ボタンの設定
    const createImageToggleButton = (img, parentA) => {
        const btn = document.createElement('button');
        btn.textContent = "拡大";
        btn.className = "media_btn";

        // 拡大フラグ
        img.dataset.expanded = "false";

        // クリック時の処理
        btn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isExpanded = img.dataset.expanded === "true";
            if (!img || !parentA) return false;

            // img.srcを入れ替えることで拡大・縮小する
            const tmp = img.src;
            img.src = parentA.href;
            parentA.href = tmp;

            // 原寸読み込み後にサイズ調整
            img.onload = () => {
                // 横幅が画面に収まるように自動調整
                const naturalW = img.naturalWidth;
                const fittedWidth = computeWidthFittedSize(naturalW, ZOOM_RATE);

                if (!isExpanded) {
                    // サムネイルより小さくなるなら拡大しない
                    if (fittedWidth < 250) {
                        img.style.maxWidth = "250px";
                        img.style.maxHeight = "250px";
                        img.dataset.expanded = "false";
                        btn.textContent = "不可";
                        return;
                    }

                    // 拡大処理
                    img.style.maxWidth = fittedWidth + `px`;
                    img.style.maxHeight = "none";
                    img.dataset.expanded = "true";
                    btn.textContent = "縮小";
                } else {
                    // 縮小処理
                    img.style.maxWidth = "250px";
                    img.style.maxHeight = "250px";
                    img.dataset.expanded = "false";
                    btn.textContent = "拡大";
                }
            };
        };
        return btn;
    };

    // 動画用の拡大ボタンの追加
    const createVideoToggleButton = (video) => {
        const btn = document.createElement('button');
        btn.textContent = "拡大";
        btn.className = "media_btn";

        // 拡大フラグ
        video.dataset.expanded = "false";

        // クリック時の動作
        btn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isExpanded = video.dataset.expanded === "true"

            // 横幅が画面内に収まるように自動調整
            const naturalW = video.videoWidth;
            const fittedWidth = computeWidthFittedSize(naturalW, ZOOM_RATE);

            if (!isExpanded) {
                // サムネイルより小さくなるなら拡大しない
                if (fittedWidth < 400) {
                    video.style.maxWidth = "400px";
                    video.style.maxHeight = "300px";
                    video.dataset.expanded = "false";
                    btn.textContent = "不可";
                    return false;
                }
                // 自動再生のフラグが立っていれば再生する
                if (VIDEO_AUTOPLAY) {
                    video.play();
                }

                // 拡大処理
                video.style.maxWidth = fittedWidth + "px";
                video.style.maxHeight = "none";
                video.dataset.expanded = "true";
                btn.textContent = "縮小";
            } else {
                video.dataset.expanded = "false"

                // 縮小時に一時停止する
                video.pause();

                // 縮小処理
                video.style.maxWidth = "400px";
                video.style.maxHeight = "300px";
                btn.textContent = "拡大";
            }
            return false;
        };

        return btn;
    };

    // 画像と動画にレイアウト用のwrapperとボタンを追加
    const wrapMedia = (media) => {
        if (media.dataset.buttonAdded === "true") return;

        const wrapper = document.createElement('div');
        wrapper.className = 'media_wrapper';
        media.parentNode.insertBefore(wrapper, media);
        wrapper.appendChild(media);

        const div = document.createElement('div');
        div.className = 'media_button';

        if (media.tagName.toLowerCase() === "img") {
            const parentA = media.parentElement?.parentElement?.closest('a');
            const originalHref = parentA ? parentA.href : '';

            // 画像クリック → 常に原寸画像を開く
            media.addEventListener("click", (ev) => {
                ev.preventDefault();
                ev.stopPropagation();

                if (originalHref) {
                    window.open(originalHref, "_blank");
                }
            });

            div.appendChild(createSaveButton(originalHref));
            div.appendChild(createImageToggleButton(media, parentA));

        } else if (media.tagName.toLowerCase() === "video") {
            div.appendChild(createSaveButton(media.src));
            div.appendChild(createVideoToggleButton(media));
        }

        wrapper.appendChild(div);

        media.dataset.buttonAdded = "true";
    };

    // 対象となる画像と動画にボタンを追加
    // (あいもげにあぷされたファイルだけ)
    const addButtons = () => {
        document.querySelectorAll('img[src^="/uploads/"]').forEach(wrapMedia);
        document.querySelectorAll('video[src^="/uploads/"]').forEach(wrapMedia);
    };

    // =============================================================================================================
    // メインの処理
    // =============================================================================================================

    addStyle();
    addButtons();

    // ページの動的な変更に対応
    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });

})();

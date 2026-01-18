// ==UserScript==
// @name         あいもげ公式X新着通知
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  あいもげのカタログに公式Xの新着通知を表示します
// @author       Feldschlacht
// @license      MIT
// @match        https://nijiurachan.net/pc/catalog.php*
// @icon         https://nijiurachan.net/assets/images/favicon.ico
// @connect      search.yahoo.co.jp
// @connect      www.dropbox.com
// @connect      dropboxusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/563139/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E5%85%AC%E5%BC%8FX%E6%96%B0%E7%9D%80%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/563139/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E5%85%AC%E5%BC%8FX%E6%96%B0%E7%9D%80%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 設定・定数定義
    // ==========================================
    
    // デバッグモード（trueならデバッグ用機能を表示）
    const DEBUG_MODE = false;

    const CHECK_INTERVAL_MINUTES = 60; // チェック頻度（分）
    
    // 検索クエリ: id:nijiurachan
    const YAHOO_SEARCH_URL = 'https://search.yahoo.co.jp/realtime/search?p=id%3Anijiurachan&ei=UTF-8';
    
    // キャラクター定義 (Dropbox直リンク版)
    const CHARACTERS = [
        {
            id: 'aimoge',
            name: 'あいもげちゃん',
            icon: 'https://www.dropbox.com/scl/fi/61dkn1kla6fzg5azb8ta7/aimoge.webp?rlkey=8djnqnovb0gz1pnc48nveaern&st=9p68otmp&raw=1',
            message: 'ぴゃっ！「」さん！ あいもげ公式Xから新しいポストがあるんですよ…！'
        },
        {
            id: 'burumoge',
            name: 'ぶるもげちゃん',
            icon: 'https://www.dropbox.com/scl/fi/c7ilcmgom9idgy0t6lw51/burumoge.webp?rlkey=cuoxkvkm2rlqild8b5qhrkv28&st=e560mvtp&raw=1',
            message: 'あ、あの…「」様… あいもげ公式Xから新しいポストがあるようです…。'
        },
        {
            id: 'shiran',
            name: '知らん女',
            icon: 'https://www.dropbox.com/scl/fi/4k5jodsyzw11mlxe4ink1/shiran.webp?rlkey=hbxlwdrc3lm5oyy0yxoavdgpv&st=h7yuqso5&raw=1',
            message: 'あいもげ管理者でもない知らん女からのメッセージをお読みください'
        },
        {
            id: 'miimoge',
            name: 'みいもげちゃん',
            icon: 'https://www.dropbox.com/scl/fi/v0bbmyccgfrvzka76677r/miimoge.webp?rlkey=36anxub634oszlmoo2e6y5o4f&st=joli8z79&raw=1',
            message: '「」！ あいもげ公式Xの新しいポストを確認する！'
        },
        {
            id: 'freeza',
            name: 'フリーザ様',
            icon: 'https://www.dropbox.com/scl/fi/vuiifm6ley44aje607e4j/freeza.webp?rlkey=tc7gjks6y0w2w6cxdlijzjs0t&st=b73cgqto&raw=1',
            message: 'た…たのむ…助けてくれ… あいもげ公式Xからのポストを確認しろ――っ!!!!!'
        },
        {
            id: 'oraora',
            name: 'おらおらちゃん',
            icon: 'https://www.dropbox.com/scl/fi/rorur7wk4qnxsysps0ocb/oraora.webp?rlkey=k80tw5hw97evpq1h0uo4bon5f&st=wuky5il8&raw=1',
            message: 'おらおら～っ！ あいもげ公式Xからの新鮮なポストです～！'
        },
        {
            id: 'nemukunai',
            name: '眠くないんぬ',
            icon: 'https://www.dropbox.com/scl/fi/cci5tin6ntalve3zno5v5/nemukunai.webp?rlkey=dryrtwq3312tnsaqkdybdzqhn&st=o1ew0ayf&raw=1',
            message: 'あいもげ公式Xが動いたんぬ。起きて見るんぬ。'
        },
        {
            id: 'kunrin',
            name: 'ｸﾝﾘﾆﾝｻﾝ',
            icon: 'https://www.dropbox.com/scl/fi/6981xk2vdbjx6vg0oygma/kunri.webp?rlkey=68na6v6x3aq8x4a3eirh2uvl0&st=13e39l06&raw=1',
            message: '「」さん、あいもげ公式Xに生まれたばかりのポストがあります。確認してくださいね☆'
        }
    ];

    // ==========================================
    // データ管理（保存/読み込み）
    // ==========================================
    const CONFIG = {
        get lastCheckTime() { return GM_getValue('last_check_time', 0); },
        set lastCheckTime(val) { GM_setValue('last_check_time', val); },

        get lastLatestId() { return GM_getValue('last_tweet_id', ''); },
        set lastLatestId(val) { GM_setValue('last_tweet_id', val); },

        get dismissedId() { return GM_getValue('dismissed_tweet_id', ''); },
        set dismissedId(val) { GM_setValue('dismissed_tweet_id', val); },

        // 常に表示するかどうか
        get alwaysShow() { return GM_getValue('cfg_always_show', false); },
        set alwaysShow(val) { GM_setValue('cfg_always_show', val); },

        // 有効なキャラクターIDリスト (配列)
        get enabledCharIds() {
            const stored = GM_getValue('cfg_enabled_char_ids', null);
            if (!stored) return CHARACTERS.map(c => c.id); // デフォルトは全員
            try {
                return JSON.parse(stored);
            } catch(e) {
                return CHARACTERS.map(c => c.id);
            }
        },
        set enabledCharIds(val) { GM_setValue('cfg_enabled_char_ids', JSON.stringify(val)); },

        // 画像キャッシュの取得と保存
        getImageCache(charId) {
            return GM_getValue('cache_img_' + charId, null);
        },
        setImageCache(charId, base64Data) {
            GM_setValue('cache_img_' + charId, base64Data);
        },
        clearImageCache() {
            CHARACTERS.forEach(c => GM_setValue('cache_img_' + c.id, null));
        }
    };

    // ==========================================
    // メイン処理
    // ==========================================

    // 1. スタイルの注入
    addCustomStyles();

    // 2. メニューコマンド登録
    GM_registerMenuCommand("お気に入りキャラの設定", showSettingsModal);

    // 3. チェック＆表示ロジック
    const now = Date.now();
    const diffMinutes = (now - CONFIG.lastCheckTime) / (1000 * 60);
    const hasData = !!CONFIG.lastLatestId;

    if (DEBUG_MODE) {
        console.log(`[AimogeX] Init: lastCheck=${Math.floor(diffMinutes)}min ago, hasData=${hasData}, alwaysShow=${CONFIG.alwaysShow}`);
    }

    // 「常に表示」がONなら、データがなくてもチェックを試みる（または強制表示する）
    // 通常はチェック時間が経過していればチェック
    if (CONFIG.alwaysShow || !hasData || diffMinutes >= CHECK_INTERVAL_MINUTES) {
        checkYahooRealtime();
    } else {
        // 定期チェック外のタイミングでの表示判定
        const latestId = CONFIG.lastLatestId;
        if (latestId) {
            // 「常に表示」がON または「未読」なら表示
            if (CONFIG.alwaysShow || latestId !== CONFIG.dismissedId) {
                showNotification(latestId);
            }
        }
    }

    // ==========================================
    // 機能関数群
    // ==========================================

    // 画像をキャッシュする関数（バックグラウンド実行）
    function fetchAndCacheImage(charId, url) {
        // 既にキャッシュがあれば何もしない
        if (CONFIG.getImageCache(charId)) return;

        if (DEBUG_MODE) console.log(`[AimogeX] Caching image for ${charId}...`);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: function(response) {
                if (response.status === 200) {
                    const blob = response.response;
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        const base64data = reader.result;
                        CONFIG.setImageCache(charId, base64data);
                        if (DEBUG_MODE) console.log(`[AimogeX] Image cached for ${charId}`);
                    }
                    reader.readAsDataURL(blob);
                }
            }
        });
    }

    // Yahoo!リアルタイム検索を確認
    function checkYahooRealtime() {
        if (DEBUG_MODE) console.log('[AimogeX] Fetching Yahoo Realtime Search...');
        GM_xmlhttpRequest({
            method: "GET",
            url: YAHOO_SEARCH_URL,
            onload: function(response) {
                if (response.status === 200) {
                    const html = response.responseText;
                    // regex: href="..." x.com or twitter.com / nijiurachan / status / digits
                    const match = html.match(/https?:\/\/(?:twitter|x)\.com\/nijiurachan\/status\/(\d+)/);
                    
                    if (match && match[1]) {
                        const newId = match[1];
                        const oldId = CONFIG.lastLatestId;

                        if (DEBUG_MODE) console.log(`[AimogeX] Latest ID found: ${newId} (Old: ${oldId})`);

                        CONFIG.lastCheckTime = Date.now();
                        
                        if (newId !== oldId) {
                            // 新着発見
                            if (DEBUG_MODE) console.log('[AimogeX] New post detected!');
                            CONFIG.lastLatestId = newId;
                            showNotification(newId);
                        } else {
                            // ID同じでも常に表示設定などを確認
                            if (CONFIG.alwaysShow || newId !== CONFIG.dismissedId) {
                                showNotification(newId);
                            } else {
                                if (DEBUG_MODE) console.log('[AimogeX] No new post (dismissed).');
                            }
                        }
                    } else {
                        if (DEBUG_MODE) console.warn('[AimogeX] Tweet ID not found in HTML response.');
                        // ツイートが見つからなかった場合
                        // 「常に表示」がONなら、強制的に表示する
                        if (CONFIG.alwaysShow) {
                            const fallbackId = CONFIG.lastLatestId || 'dummy-always-show-id';
                            showNotification(fallbackId);
                        }
                    }
                } else {
                    console.error('[AimogeX] Yahoo access failed:', response.status);
                }
            },
            onerror: function(err) {
                console.error('[AimogeX] Request error:', err);
            }
        });
    }

    // 通知を表示
    function showNotification(tweetId) {
        const targetNav = document.querySelector('.catalog-nav');
        if (!targetNav) return;
        if (document.getElementById('aimoge-x-notify')) return;

        // キャラクター選出
        const enabledIds = CONFIG.enabledCharIds;
        let availableChars = CHARACTERS.filter(c => enabledIds.includes(c.id));
        
        if (availableChars.length === 0) {
            availableChars = CHARACTERS;
        }

        const charData = availableChars[Math.floor(Math.random() * availableChars.length)];

        // 画像ソースの決定（キャッシュがあればそれを使う、なければURLを使いつつ裏でキャッシュ）
        let imageSrc = CONFIG.getImageCache(charData.id);
        if (!imageSrc) {
            imageSrc = charData.icon; // まだキャッシュがないのでWebURLを使う
            fetchAndCacheImage(charData.id, charData.icon); // 裏でキャッシュ作成開始
        }

        const notifyDiv = document.createElement('div');
        notifyDiv.id = 'aimoge-x-notify';
        
        notifyDiv.innerHTML = `
            <div class="ax-container">
                <div class="ax-icon">
                    <div class="ax-icon-face" style="background-image: url('${imageSrc}');"></div>
                </div>
                <div class="ax-message">
                    <a href="${YAHOO_SEARCH_URL}" target="_blank" rel="noopener noreferrer">
                        <span class="ax-text">${charData.message}</span>
                    </a>
                </div>
                <div class="ax-close" title="閉じる">×</div>
            </div>
        `;

        // 挿入 (catalog-navの後ろ)
        // この時点で高さは確保されるが、CSSで opacity:0 となっているため見えない
        targetNav.insertAdjacentElement('afterend', notifyDiv);

        // 閉じるボタン
        notifyDiv.querySelector('.ax-close').addEventListener('click', function(e) {
            e.stopPropagation();
            // 「常に表示」がOFFの場合のみ、閉じたことを記憶する
            if (!CONFIG.alwaysShow) {
                CONFIG.dismissedId = tweetId;
                if (DEBUG_MODE) console.log(`[AimogeX] Notification dismissed for ID: ${tweetId}`);
            }
            notifyDiv.remove();
        });

        // 画像を表示してフェードインさせる内部関数
        const revealNotification = (imgUrlOrData) => {
            const face = notifyDiv.querySelector('.ax-icon-face');
            if (face) {
                // 画像URLが変わる場合があるので再設定
                face.style.backgroundImage = `url('${imgUrlOrData}')`;
                // 少しだけ待ってからクラス付与（トランジションを確実に発火させるため）
                requestAnimationFrame(() => {
                    notifyDiv.classList.add('ax-visible');
                });
            }
        };

        // 画像がキャッシュ済みなら即表示
        if (imageSrc.startsWith('data:')) {
            revealNotification(imageSrc);
        } else {
            // WebURLの場合も、読み込み完了を待ってからフェードインさせる
            // 裏でImageオブジェクトを作ってロード完了を検知する
            const imgLoader = new Image();
            imgLoader.onload = () => revealNotification(imageSrc);
            imgLoader.onerror = () => revealNotification(imageSrc); // 失敗しても表示はする
            imgLoader.src = imageSrc;
        }
    }

    // 設定モーダル表示
    function showSettingsModal() {
        const existing = document.getElementById('aimoge-x-settings');
        if (existing) existing.remove();

        const enabledIds = CONFIG.enabledCharIds;
        const alwaysShow = CONFIG.alwaysShow;

        const modal = document.createElement('div');
        modal.id = 'aimoge-x-settings';
        
        // キャラクターリスト（チェックボックス）
        let charListHtml = '';
        CHARACTERS.forEach(c => {
            const checked = enabledIds.includes(c.id) ? 'checked' : '';
            charListHtml += `<label class="ax-option"><input type="checkbox" name="ax-char" value="${c.id}" ${checked}> ${c.name}</label>`;
        });

        // デバッグ用HTML生成
        let debugHtml = '';
        if (DEBUG_MODE) {
            debugHtml = `
                <div style="margin-top: 15px; text-align: center; border-top: 1px dashed #ccc; padding-top: 10px; display:flex; gap:5px; justify-content:center;">
                    <button id="ax-debug-clear" style="background:#f55; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-size:12px; cursor:pointer;">
                        [Debug] 既読クリア＆次回強制チェック
                    </button>
                    <button id="ax-debug-cache-clear" style="background:#888; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-size:12px; cursor:pointer;">
                        画像キャッシュ削除
                    </button>
                </div>
            `;
        }

        // レイアウト： キャラ選択(上) -> 常に表示(中) -> ボタン(下) -> デバッグ(最下部)
        modal.innerHTML = `
            <div class="ax-modal-content">
                <h3>お気に入りキャラの設定</h3>

                <div style="font-size:12px; margin-bottom:5px;">有効化されているキャラの中からランダムに登場します</div>
                <div class="ax-options-list">
                    ${charListHtml}
                </div>

                <hr style="margin: 10px 0; border:none; border-top:1px solid #eee;">
                
                <div class="ax-global-setting">
                    <label style="font-weight:bold; cursor:pointer;">
                        <input type="checkbox" id="ax-always-show" ${alwaysShow ? 'checked' : ''}> 常に表示ON
                    </label>
                    <p style="font-size:12px; color:#666; margin:2px 0 0 18px;">
                        チェックすると、新着確認済みでも通知バーを表示し続けます。
                    </p>
                </div>

                <div class="ax-modal-actions">
                    <button id="ax-save-btn">保存</button>
                    <button id="ax-cancel-btn">キャンセル</button>
                </div>
                
                ${debugHtml}
            </div>
        `;

        document.body.appendChild(modal);

        // 保存処理
        document.getElementById('ax-save-btn').onclick = () => {
            // 常に表示設定
            const isAlways = document.getElementById('ax-always-show').checked;
            CONFIG.alwaysShow = isAlways;

            // キャラクター設定
            const checkboxes = modal.querySelectorAll('input[name="ax-char"]:checked');
            const selectedIds = Array.from(checkboxes).map(cb => cb.value);
            
            if (selectedIds.length === 0) {
                CONFIG.enabledCharIds = CHARACTERS.map(c => c.id);
                alert('キャラクターが選択されていません。全員有効として保存しました。');
            } else {
                CONFIG.enabledCharIds = selectedIds;
                
                // 設定完了時の反映処理
                if (isAlways) {
                    const currentNotify = document.getElementById('aimoge-x-notify');
                    if (currentNotify) currentNotify.remove();
                    
                    const idToShow = CONFIG.lastLatestId || 'dummy-always-show-id';
                    showNotification(idToShow);
                }
            }
            
            modal.remove();
        };

        document.getElementById('ax-cancel-btn').onclick = () => {
            modal.remove();
        };

        // デバッグボタン処理
        if (DEBUG_MODE) {
            document.getElementById('ax-debug-clear').onclick = () => {
                CONFIG.dismissedId = ''; // 既読IDをクリア
                CONFIG.lastCheckTime = 0; // チェック時刻を0にリセット（次回即時チェック）
                alert('既読フラグをクリアし、チェック時刻をリセットしました。\nページをリロードすると再確認が実行されます。');
                modal.remove();
            };
            document.getElementById('ax-debug-cache-clear').onclick = () => {
                CONFIG.clearImageCache();
                alert('画像キャッシュを全削除しました。\n次回表示時に再ダウンロードされます。');
                modal.remove();
            };
        }
    }

    // CSSスタイル定義
    function addCustomStyles() {
        const css = `
            /* 通知バー */
            #aimoge-x-notify {
                margin: 5px auto;
                width: fit-content;
                max-width: 95%;
                background-color: #fff0f5;
                border: 2px solid #e6aac3;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                
                /* 初期状態: 透明かつクリック不可（レイアウトだけ確保） */
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            
            /* 表示クラス付与後: 不透明化・クリック可能に */
            #aimoge-x-notify.ax-visible {
                opacity: 1;
                pointer-events: auto;
            }

            .ax-container {
                display: flex;
                align-items: center;
                padding: 2px;
                position: relative;
            }
            .ax-icon-face {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 2px solid #fff;
                margin: 0;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                display: block;
            }
            .ax-message {
                flex-grow: 1;
                font-size: 14px;
                line-height: 1.4;
                padding: 0 4px;
            }
            .ax-message a {
                text-decoration: none;
                color: #800000;
                display: block;
            }
            .ax-message a:hover {
                opacity: 0.7;
            }
            .ax-text {
                font-weight: bold;
                color: #d65c85;
            }
            .ax-close {
                cursor: pointer;
                font-size: 18px;
                color: #999;
                padding: 0 8px 0 0;
                margin: 0;
                font-weight: bold;
            }
            .ax-close:hover {
                color: #f00;
            }

            /* 設定モーダル */
            #aimoge-x-settings {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .ax-modal-content {
                background: #fff;
                padding: 20px;
                border-radius: 8px;
                width: 320px;
                border: 2px solid #0040e0;
            }
            .ax-modal-content h3 {
                margin-top: 0;
                color: #0040e0;
                border-bottom: 1px solid #ccc;
                padding-bottom: 5px;
            }
            .ax-global-setting {
                margin-bottom: 10px;
            }
            .ax-options-list {
                max-height: 250px;
                overflow-y: auto;
                margin: 10px 0;
                display: flex;
                flex-direction: column;
                gap: 6px;
                border: 1px solid #eee;
                padding: 5px;
                border-radius: 4px;
            }
            .ax-option {
                cursor: pointer;
                font-size: 14px;
                display: block;
            }
            .ax-modal-actions {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-top: 15px;
            }
            .ax-modal-actions button {
                padding: 6px 15px;
                cursor: pointer;
            }
            #ax-save-btn {
                background: #0040e0;
                color: white;
                border: none;
                border-radius: 4px;
            }
        `;
        GM_addStyle(css);
    }

})();
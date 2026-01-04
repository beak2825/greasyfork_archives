// ==UserScript==
// @name         あいもげカタログ連結ちゃん
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  aimgimgカタログを左右に連結 + お気に入りワード(全スレ検索・OR検索)
// @match        https://nijiurachan.net/pc/catalog.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      img.2chan.net
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557277/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%AB%E3%82%BF%E3%83%AD%E3%82%B0%E9%80%A3%E7%B5%90%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557277/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%AB%E3%82%BF%E3%83%AD%E3%82%B0%E9%80%A3%E7%B5%90%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SOURCE_ORIGIN   = 'https://img.2chan.net';
    const SOURCE_BASE_B   = 'https://img.2chan.net/b/';
    const FAV_COOKIE_NAME = 'aimg_fav_word';

    const LAYOUT_KEY = 'aimg_layout_mode';
    let layoutMode = 'horizontal'; // デフォルトは横並び

    async function loadLayoutMode() {
        try {
            const v = await GM_getValue(LAYOUT_KEY, 'horizontal');
            if (v === 'horizontal' || v === 'vertical') {
                layoutMode = v;
            }
        } catch (e) {
            // 何かあっても無視して横並びデフォルト
            layoutMode = 'horizontal';
        }
    }

    function setupLayoutMenu() {
        if (typeof GM_registerMenuCommand !== 'function') return;

        GM_registerMenuCommand('レイアウト: 横並び', async () => {
            await GM_setValue(LAYOUT_KEY, 'horizontal');
            location.reload();
        });

        GM_registerMenuCommand('レイアウト: 縦並び', async () => {
            await GM_setValue(LAYOUT_KEY, 'vertical');
            location.reload();
        });
    }

    // ★ 本家カタログの「本文抜粋」文字数
    let catalogSummaryMaxLen = null;


    // ★ お気に入りカラム用スタイル注入
    (function injectFavStyle() {
        const style = document.createElement('style');
        style.textContent = `
        /* ★ 既存：お気に入り行 */
        .aimg-fav-row .aimg-fav-cell {
            background-color: #ffe6f0;
            border: 2px solid #ff66a3;
            width: 104px;
        }
        .aimg-fav-row .aimg-fav-cell img {
            display: block;
            margin: 2px auto;
        }

        .aimg-unified-table td {
            width: 104px !important;
            word-break: break-all !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
        }


       /* カタログ（img & aimg）すべての td を 104px に統一 */
       .aimg-unified-table td {
           width: 104px !important;
       }

        /* URL などの長い文字列でセルが横に広がるのを防止 */
        .aimg-unified-table td {
            word-break: break-all !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
        }



    `;
        document.head.appendChild(style);
    })();



    // cookie ユーティリティ
    function setFavWordCookie(value) {
        const maxAge = 60 * 60 * 24 * 365; // 1年
        document.cookie = `${FAV_COOKIE_NAME}=${encodeURIComponent(value)};path=/;max-age=${maxAge}`;
    }

    function getFavWordCookie() {
        const cookies = document.cookie.split(';');
        for (const c of cookies) {
            const trimmed = c.trim();
            if (trimmed.startsWith(FAV_COOKIE_NAME + '=')) {
                return decodeURIComponent(trimmed.slice(FAV_COOKIE_NAME.length + 1));
            }
        }
        return '';
    }

    // 自サイトのURLから、取得すべき本家URLを決める
    function getSourceUrl() {
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const mode = params.get('mode') || '';
        const sort = params.get('sort') || '';
        const base = 'https://img.2chan.net/b/futaba.php?mode=cat';

        if (mode === 'posted') {
            // 履歴（posted） → sort=9 & guid=on
            return base + '&sort=9&guid=on';
        }
        if (mode === 'viewed')   return base + '&sort=7';
        if (sort === 'created')  return base + '&sort=1';
        if (sort === 'old')      return base + '&sort=2';
        if (sort === 'replies')  return base + '&sort=3';
        if (sort === 'momentum') return base + '&sort=6';
        if (sort === 'soudane')  return base + '&sort=8';


        // 無印カタログ
        return base;
    }

    // 相対URL → 絶対URLに変換
    function toAbsoluteUrl(url) {
        if (!url) return url;

        if (/^https?:\/\//i.test(url)) return url;
        if (/^\/\//.test(url)) return 'https:' + url;

        if (url[0] === '/') {
            return SOURCE_ORIGIN + url;
        }

        return SOURCE_BASE_B + url;
    }

    // 取得した cattable / catbox 内のリンク類を補正
    function fixRelativeLinks(rootNode) {
        if (!rootNode) return;

        rootNode.querySelectorAll('a[href]').forEach(a => {
            a.href = toAbsoluteUrl(a.getAttribute('href'));
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        });

        rootNode.querySelectorAll('img[src]').forEach(img => {
            img.src = toAbsoluteUrl(img.getAttribute('src'));
        });
    }

    // テーブルの先頭にヘッダ行を追加
    function addHeaderRow(table, options) {
        if (!table) return;

        const firstRow = table.querySelector('tr');
        if (!firstRow) return;

        const colSpan = firstRow.children.length || 1;

        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.colSpan = colSpan;
        th.style.color = '#ffffff';
        th.style.padding = '2px 3px';
        th.style.fontWeight = 'bold';
        th.style.fontFamily = 'sans-serif';
        th.style.textAlign = 'left';

        if (options.backgroundColor) {
            th.style.setProperty('background-color', options.backgroundColor, 'important');
        }


        if (options.label === 'img') {
            // 「img スレ立てボタン」
            const labelSpan = document.createElement('span');
            labelSpan.textContent = 'img';
            labelSpan.style.marginRight = '8px';
            th.appendChild(labelSpan);

            const btn = document.createElement('a');
            btn.textContent = 'スレ立て';
            btn.href = 'https://img.2chan.net/b/futaba.htm';
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
            Object.assign(btn.style, {
                display: 'inline-block',
                padding: '2px 8px',
                marginLeft: '0',
                borderRadius: '4px',
                border: '1px solid #ffffff',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '11px',
                backgroundColor: 'rgba(255,255,255,0.1)',
            });
            th.appendChild(btn);

            // お気に入りワード UI
            const sepSpan = document.createElement('span');
            sepSpan.textContent = '　';
            th.appendChild(sepSpan);

            const favLabel = document.createElement('span');
            favLabel.textContent = 'お気に入りワード: ';
            favLabel.style.fontSize = '11px';
            th.appendChild(favLabel);

            const favInput = document.createElement('input');
            favInput.type = 'text';
            favInput.id = 'aimg-fav-input';
            favInput.style.fontSize = '11px';
            favInput.style.width = '140px';
            favInput.style.marginRight = '4px';
            th.appendChild(favInput);

            const favButton = document.createElement('button');
            favButton.type = 'button';
            favButton.id = 'aimg-fav-apply';
            favButton.textContent = '反映';
            favButton.style.fontSize = '11px';
            th.appendChild(favButton);

        } else {
            th.textContent = options.label || '';
        }

        tr.appendChild(th);

        const parent = firstRow.parentNode;
        if (parent.tagName === 'TBODY') {
            parent.insertBefore(tr, firstRow);
        } else {
            table.insertBefore(tr, firstRow);
        }
    }





    // ★ お気に入りワードにマッチするセルをヘッダ直下に挿入
    //    sourceCells: 「全スレッド版カタログ」から取得した td のリスト
    function insertFavoriteRows(destTable, favWord, colCount, sourceCells) {
        // 既存のお気に入り行を削除
        destTable.querySelectorAll('tr.aimg-fav-row').forEach(tr => tr.remove());

        favWord = (favWord || '').trim();
        if (!favWord) return;
        if (!sourceCells || !sourceCells.length) return;

        // OR 検索用に '|' で分割
        const orWords = favWord.split('|').map(s => s.trim()).filter(Boolean);

        const matches = sourceCells.filter(td => {
            const text = td.textContent || '';

            if (orWords.length > 1) {
                // "aaaa|bbbb|cccc" 形式 → OR 検索
                return orWords.some(w => text.includes(w));
            } else {
                // '|' なし（実質1語） → 単純部分一致
                return text.includes(favWord);
            }
        });

        if (!matches.length) return;

        const MAX_DIM = 100; // 横縦どちらか大きい方を 100px に揃える

        const frag = document.createDocumentFragment();
        let currentRow = null;
        let count = 0;

        matches.forEach(td => {
            if (count % colCount === 0) {
                currentRow = document.createElement('tr');
                currentRow.className = 'aimg-fav-row';
                frag.appendChild(currentRow);
            }
            count++;

            const newTd = document.createElement('td');
            newTd.className = 'aimg-fav-cell';   // 背景ピンク・枠ピンク用クラス

            const link  = td.querySelector('a');
            const img   = td.querySelector('img');
            const small = td.querySelector('small');
            const font  = td.querySelector('font[size="2"], .s14');

            if (link && img) {
                const a = document.createElement('a');
                a.href = link.href;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';

                const imgClone = img.cloneNode(true);

                // /b/cat/ → /b/thumb/ に差し替え（画質アップ）
                if (imgClone.src.includes('/b/cat/')) {
                    imgClone.src = imgClone.src.replace('/b/cat/', '/b/thumb/');
                }

                // 元の width / height を取得
                let ow = parseInt(img.getAttribute('width')  || '', 10);
                let oh = parseInt(img.getAttribute('height') || '', 10);

                if (!ow) ow = img.width  || 0;
                if (!oh) oh = img.height || 0;

                if (ow > 0 && oh > 0) {
                    const maxSide = Math.max(ow, oh);
                    const scale = MAX_DIM / maxSide;

                    imgClone.removeAttribute('style');
                    imgClone.width  = Math.round(ow * scale);
                    imgClone.height = Math.round(oh * scale);
                } else {
                    imgClone.removeAttribute('width');
                    imgClone.removeAttribute('height');
                    imgClone.removeAttribute('style');
                }

                a.appendChild(imgClone);
                newTd.appendChild(a);
            }

            // ★ 本文の先頭 n 文字（small）
            if (small) {
                let txt = small.textContent || '';

                if (catalogSummaryMaxLen && txt.length > catalogSummaryMaxLen) {
                    txt = txt.slice(0, catalogSummaryMaxLen);
                    // 必要なら "…" を足す:
                    // txt += '…';
                }

                //newTd.appendChild(document.createElement('br'));
                const s = document.createElement('small');
                s.textContent = txt;
                newTd.appendChild(s);
            }

            // ★ レス数（font size=2）
            if (font) {
                newTd.appendChild(document.createElement('br'));
                const f = document.createElement('font');
                f.size = '2';
                f.innerHTML = font.innerHTML; // 中身そのままコピー（数字＋カッコなど）
                newTd.appendChild(f);
            }

            currentRow.appendChild(newTd);
        });

        // ヘッダ行の直後に挿入
        const headerRow = destTable.querySelector('tr');
        if (!headerRow) return;
        const parent = headerRow.parentNode;
        parent.insertBefore(frag, headerRow.nextSibling);
    }


    function placeSideBySide(leftTable, rightTable) {
        let wrapper = document.getElementById('aimg-merge-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'aimg-merge-wrapper';
        }

        // flex で 2カラム or 2段
        wrapper.style.display = 'flex';

        if (layoutMode === 'vertical') {
            wrapper.style.flexDirection = 'column';
            wrapper.style.gap = '6px';

            // ★ ここがポイント
            wrapper.style.alignItems = 'center';   // 横方向中央寄せ
            wrapper.style.justifyContent = 'flex-start'; // 縦方向は上寄せ
        } else {
            wrapper.style.flexDirection = 'row';
            wrapper.style.gap = '12px';
            wrapper.style.alignItems = 'flex-start';
            wrapper.style.justifyContent = 'center';
        }


        // 左カラム（img）
        const leftCol = document.createElement('div');
        leftCol.className = 'aimg-col aimg-col-left';
        leftCol.style.display = 'block';
        leftCol.style.backgroundColor = isDarkTheme() ? '#001a00' : '#e6ffe6'; // 深緑 : 薄緑


        // 右カラム（aimg）
        const rightCol = document.createElement('div');
        rightCol.className = 'aimg-col aimg-col-right';
        rightCol.style.display = 'block';

        // 右カラム用ヘッダ（aimg）を “右カラムの中” に入れる
        const bar = document.createElement('div');
        bar.id = 'aimg-aimg-headerbar';
        bar.style.boxSizing = 'border-box';
        bar.style.color = '#fff';
        bar.style.padding = '2px 3px';
        bar.style.fontWeight = 'bold';
        bar.style.fontFamily = 'sans-serif';
        bar.style.textAlign = 'left';
        bar.style.backgroundColor = '#003366';
        bar.style.border = '3px solid rgb(255, 255, 255)';   // ★ img table と同等
        bar.style.boxSizing = 'border-box';    // ★ border込みで高さ計算
        bar.textContent = 'aimg';


        // 一旦wrapperを差し込み（wrapperの親は rightTable の親が無難）
        const parent = rightTable.parentNode;
        parent.insertBefore(wrapper, rightTable);

        // 右Tableを元位置から外す（wrapperに入れるため）
        // ※ appendChild すると自動で移動されます

        // 組み立て
        leftCol.appendChild(leftTable);
        rightCol.appendChild(bar);
        rightCol.appendChild(rightTable);

        wrapper.innerHTML = '';
        wrapper.appendChild(leftCol);
        wrapper.appendChild(rightCol);
    }

    function isDarkTheme() {
        try {
            return localStorage.getItem('futaba_theme') === 'dark';
        } catch (e) {
            return false;
        }
    }



    function main() {

        loadLayoutMode();
        setupLayoutMenu();

        const localCatTable = document.querySelector('table#cattable');
        if (!localCatTable) {
            return;
        }

        const SOURCE_URL = getSourceUrl();
        let favSourceCells = null;
        let savedWord = getFavWordCookie();

        GM_xmlhttpRequest({
            method: 'GET',
            url: SOURCE_URL,
            onload: function(response) {
                if (response.status !== 200) {
                    console.warn('あいもげカタログ連結ちゃん: 取得失敗', response.status, SOURCE_URL);
                    return;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const sourceTable = doc.querySelector('table#cattable');
                if (!sourceTable) {
                    console.warn('あいもげカタログ連結ちゃん: ソース側に cattable が見つかりませんでした');
                    return;
                }

                // ★ まず img カタログ（上位だけの通常版）を DOM に出す
                const importedTable = sourceTable.cloneNode(true);
                fixRelativeLinks(importedTable);

                const sampleRow = importedTable.querySelector('tr');
                const colCount = (sampleRow && sampleRow.children.length) || 1;


                // img 側ヘッダ（お気に入りフォーム付き）
                addHeaderRow(importedTable, {
                    label: 'img',
                    backgroundColor: '#005533'
                });

                importedTable.classList.add("aimg-unified-table");

                // ★重要：id="cattable" が衝突してページ側の再配置処理に巻き込まれるので変更
                importedTable.id = 'aimg-img-cattable';
                // もしくは importedTable.removeAttribute('id');

                // 左右に並べる（ここで importedTable が DOM に入る）
                placeSideBySide(importedTable, localCatTable);

                // ★ ここで本家カタログの small テキスト長から n を測る
                const sampleSmall = importedTable.querySelector('td small');
                if (sampleSmall) {
                    const t = sampleSmall.textContent || '';
                    catalogSummaryMaxLen = t.length;
                }

                const favInput  = document.getElementById('aimg-fav-input');
                const favButton = document.getElementById('aimg-fav-apply');

                if (favInput && savedWord) {
                    favInput.value = savedWord;
                }

                // ★ ここから全スレッド版のカタログを取得（お気に入り検索用）
                const FULL_URL = SOURCE_URL.replace(/(mode=cat)/i, '$1&cxyl=999x999x999');

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: FULL_URL,
                    onload: function(res2) {
                        if (res2.status !== 200) {
                            console.warn('全スレ取得失敗', res2.status, FULL_URL);
                            return;
                        }
                        const doc2 = parser.parseFromString(res2.responseText, 'text/html');

                        let container =
                            doc2.querySelector('table#cattable') ||
                            doc2.querySelector('#catbox table')  ||
                            doc2.querySelector('#catbox');

                        if (!container) {
                            console.warn('全スレカタログ用のコンテナが見つかりません');
                            return;
                        }

                        fixRelativeLinks(container);
                        favSourceCells = Array.from(container.querySelectorAll('td'));

                        // 全スレ取得が終わったタイミングで、お気に入りを反映
                        if (favInput && savedWord) {
                            insertFavoriteRows(importedTable, savedWord, colCount, favSourceCells);
                        }
                    },
                    onerror: function(err) {
                        console.error('全スレ取得通信エラー', err);
                    }
                });

                // 「反映」ボタンの挙動
                if (favInput && favButton) {
                    favButton.addEventListener('click', () => {
                        const word = favInput.value || '';
                        setFavWordCookie(word);
                        savedWord = word;

                        if (!favSourceCells) {
                            alert('全スレッド一覧を読み込み中です。少し待ってからもう一度お試しください。');
                            return;
                        }

                        insertFavoriteRows(importedTable, word, colCount, favSourceCells);
                    });
                }
            },
            onerror: function(err) {
                console.error('あいもげカタログ連結ちゃん: 通信エラー', err);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();

// ==UserScript==
// @name         あいもげヘッダー調整
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  ヘッダーの重なり表示を解消します。また、wikiと拡張機能へのリンクを追加します
// @author       Feldschlacht
// @match        https://nijiurachan.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560401/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%83%98%E3%83%83%E3%83%80%E3%83%BC%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/560401/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%83%98%E3%83%83%E3%83%80%E3%83%BC%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. スタイル調整（改行防止と指定の余白設定）
    const style = document.createElement('style');
    style.innerHTML = `
        #hdp {
            display: flex !important;
            flex-direction: column !important;
            height: auto !important;
            padding: 1px 8px 4px 8px !important;
            box-sizing: border-box !important;
            gap: 0px !important;
        }

        .hdp-upper {
            display: flex !important;
            width: 100% !important;
            align-items: center !important;
            justify-content: space-between !important;
        }

        .hdp-lower {
            display: flex !important;
            width: 100% !important;
            justify-content: flex-end !important;
            flex-wrap: wrap !important;
            gap: 0px !important; /* 指定の数値 */
        }

        .donation, #tit, .hdp-right-group {
            flex: 1 1 33.333% !important;
            display: flex !important;
            align-items: center !important;
            position: static !important;
            transform: none !important;
            margin: 0 !important;
        }

        .donation { order: 1 !important; justify-content: flex-start !important; }
        #tit      { order: 2 !important; justify-content: center !important; white-space: nowrap !important; }
        .hdp-right-group {
            order: 3 !important;
            justify-content: flex-end !important;
            white-space: nowrap !important; /* 文字列途中の改行を防止 */
        }

        .donation ul { display: flex !important; list-style: none !important; padding: 0 !important; margin: 0 !important; }

        /* 検索フォーム内の改行を防止 */
        #searchfm {
            display: inline-flex !important;
            align-items: center !important;
            margin: 0 !important;
            white-space: nowrap !important;
        }
        #searchfm input[type="submit"] {
            margin-right: 1px !important; /* 指定の数値 */
        }

        #hml { display: none !important; }

        /* 各リンク（bracketed）も途中で改行させない */
        .bracketed {
            white-space: nowrap !important;
        }
    `;
    document.head.appendChild(style);

    // 2. 構造の組み換え
    const hdp = document.querySelector('#hdp');
    const tit = document.querySelector('#tit');
    const donation = document.querySelector('.donation');
    const hml = document.querySelector('#hml');

    if (hdp && hml) {
        const upperRight = document.createElement('div');
        upperRight.className = 'hdp-right-group';

        const searchFm = hml.querySelector('#searchfm');
        const homeBtn = Array.from(hml.querySelectorAll('.bracketed')).find(el => el.textContent.includes('ホーム'));

        if (searchFm) upperRight.appendChild(searchFm);
        if (homeBtn) upperRight.appendChild(homeBtn);

        const upperContainer = document.createElement('div');
        upperContainer.className = 'hdp-upper';
        upperContainer.appendChild(donation);
        upperContainer.appendChild(tit);
        upperContainer.appendChild(upperRight);

        const lowerContainer = document.createElement('div');
        lowerContainer.className = 'hdp-lower';

        const menuItems = Array.from(hml.querySelectorAll('.bracketed')).filter(el =>
            el.textContent.includes('スマホ版') ||
            el.textContent.includes('過去ログ') ||
            el.textContent.includes('API')
        );

        const wikiLink = document.createElement('span');
        wikiLink.className = 'bracketed';
        wikiLink.innerHTML = '<a href="https://wiki.nijiurachan.net/" target="_blank">📖wiki</a>';

        const extLink = document.createElement('span');
        extLink.className = 'bracketed';
        extLink.innerHTML = '<a href="https://wiki.nijiurachan.net/694d51281396282abd0f3e61" target="_blank">🧩拡張機能</a>';

        const findAndAdd = (text) => {
            const item = menuItems.find(el => el.textContent.includes(text));
            if (item) lowerContainer.appendChild(item);
        };

        findAndAdd('スマホ版');
        findAndAdd('過去ログ');
        lowerContainer.appendChild(wikiLink);
        lowerContainer.appendChild(extLink);
        findAndAdd('API');

        hdp.innerHTML = '';
        hdp.appendChild(upperContainer);
        hdp.appendChild(lowerContainer);
    }
})();
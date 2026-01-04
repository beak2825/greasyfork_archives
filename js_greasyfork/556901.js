// ==UserScript==
// @name         AtCoder Heuristic Duration Labels
// @namespace    https://github.com/isee9129/
// @version      1.0.0
// @description  コンテスト成績表のHeuristicタブで長期・短期を区別できるようにする
// @author       isee
// @match        https://atcoder.jp/users/*/history?contestType=heuristic
// @match        https://atcoder.jp/users/*/history?contestType=heuristic&lang=*
// @grant        none
// @copyright    2025, isee (https://github.com/isee9129/)
// @license      MIT License; https://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/556901/AtCoder%20Heuristic%20Duration%20Labels.user.js
// @updateURL https://update.greasyfork.org/scripts/556901/AtCoder%20Heuristic%20Duration%20Labels.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =======================
    // 設定項目
    // =======================

    // マーク・背景色のON OFF
    const ENABLE_MARK = true;
    const ENABLE_BACKGROUND_S = false;
    const ENABLE_BACKGROUND_L = true;

    // 短期・長期のボーダー(秒)
    const DURATION_BORDER = 86400;

    // コンテスト名の前につけるマーク 'Ⓢ', 'Ⓛ', '🅢', '🅛' など
    const SYMBOL_S = 'Ⓢ';
    const SYMBOL_L = '🅛';

    // 背景色 '#fbeefb'など
    const COLOR_S = '#eefbee';
    const COLOR_L = '#fbeefb';

    // =======================
    // 本体
    // =======================

    // コンテストIDを取得し、短期・長期に分ける
    async function fetchContestIDs() {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // 過剰にアクセスするのを避ける
        await sleep(1000);

        const url = 'https://kenkoooo.com/atcoder/resources/contests.json';
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();

        const S_ID = [];
        const L_ID = [];

        for (const item of data) {
            if (!item.id || typeof item.duration_second !== 'number') continue;
            if (item.duration_second <= DURATION_BORDER) {
                S_ID.push(item.id);
            } else {
                L_ID.push(item.id);
            }
        }

        return { S_ID, L_ID };
    }

    let sSet = new Set();
    let lSet = new Set();

    const MODE_NONE = 0
    const MODE_S = 1;
    const MODE_L = 2;

    function parseDatetime(text) {
        const cleaned = text.replace(/\(.+?\)/, '').replace(/\s+/, ' ');
        return cleaned.replace(' ', 'T');
    }

    function isWeekendSatSun(d) {
        const w = d.getDay();
        return w === 0 || w === 6;
    }

    function isMonday(d) {
        return d.getDay() === 1;
    }

    function getContestId(td) {
        const link = td.querySelector('a[href*="/contests/"]');
        if (!link) return null;
        const href = link.getAttribute('href');
        const m = href.match(/\/contests\/([^\/]+)/);
        return m ? m[1] : null;
    }

    function process() {
        const rows = document.querySelectorAll('#history tbody tr');

        for (const row of rows) {
            const timeEl = row.querySelector('time.fixtime-full');
            if (!timeEl) continue;

            const contestTd = row.children[1];
            if (!contestTd) continue;

            const contestId = getContestId(contestTd);
            if (!contestId) continue;

            const original = timeEl.textContent.trim();
            const iso = parseDatetime(original);
            const dateObj = new Date(iso);

            let mode = MODE_NONE;
            const yyyy = dateObj.getFullYear();
            const hh = dateObj.getHours();
            const mm = dateObj.getMinutes();

            // 長短判定
            if (sSet.has(contestId)) {
                mode = MODE_S;
            } else if (lSet.has(contestId)) {
                mode = MODE_L;
            } else if (yyyy >= 2024) {
                // データにないものは、土日の 19:00 or 23:00 終了なら短期、月曜の 19:00 終了なら長期とする
                if (isWeekendSatSun(dateObj) && (hh === 19 || hh === 23) && mm === 0) {
                    mode = MODE_S;
                } else if (isMonday(dateObj) && hh === 19 && mm === 0) {
                    mode = MODE_L;
                }
            }

            let mark = '';
            let bgcolor = '';

            if (mode === MODE_S) {
                mark = SYMBOL_S;
                bgcolor = COLOR_S;
            } else if (mode === MODE_L) {
                mark = SYMBOL_L;
                bgcolor = COLOR_L;
            }

            // マークを追加
            if (ENABLE_MARK && mode !== MODE_NONE) {
                if (!contestTd.dataset.lsAdded) {
                    const first = contestTd.firstChild;
                    contestTd.insertBefore(document.createTextNode(mark + ' '), first);
                    contestTd.dataset.lsAdded = "1";
                }
            }

            // 背景色を変更
            if (mode === MODE_L && ENABLE_BACKGROUND_L || mode === MODE_S && ENABLE_BACKGROUND_S) {
                row.style.backgroundColor = bgcolor;
            }
        }
    }

    async function main() {
        const { S_ID, L_ID } = await fetchContestIDs();
        sSet = new Set(S_ID);
        lSet = new Set(L_ID);

        process();
    }

    main();
})();

// ==UserScript==
// @name         Yutura Ranking: 開設日 + YouTube直リンク
// @namespace    https://yutura.net/
// @version      0.2.1
// @description  ランキング一覧にチャンネル開設日を表示し、YouTubeへ直リンクを追加する
// @match        https://yutura.net/ranking/*
// @match        https://yutura.net/ranking
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558394/Yutura%20Ranking%3A%20%E9%96%8B%E8%A8%AD%E6%97%A5%20%2B%20YouTube%E7%9B%B4%E3%83%AA%E3%83%B3%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/558394/Yutura%20Ranking%3A%20%E9%96%8B%E8%A8%AD%E6%97%A5%20%2B%20YouTube%E7%9B%B4%E3%83%AA%E3%83%B3%E3%82%AF.meta.js
// ==/UserScript==

(() => {
    'use strict';

    GM_addStyle(`
  .ys-meta {
    font-size: 12px;
    opacity: .75;
    margin-left: 8px;
    display: inline-block;
    white-space: nowrap;
  }
  .ys-ytlink {
    margin-left: 6px;
    font-size: 12px;
    text-decoration: none;
    vertical-align: middle;
    opacity: .9;

    position: relative;
    z-index: 9999;         /* 透明ボタンより前に */
    pointer-events: auto;  /* クリックを必ず拾う */
  }
  .ys-loading {
    font-size: 12px;
    opacity: .6;
  }
    .ys-new-6mo {
    color: #ff4fa3 !important; /* ピンク */
    font-weight: 700;
  }
  .ys-new-1yr {
    color: #ff8a00 !important; /* オレンジ */
    font-weight: 700;
  }

`);

    const CONCURRENCY = 4;
    const CACHE_TTL_DAYS = 3650;
    const CACHE_PREFIX = 'yutura_channel_meta_';

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const cacheKey = (channelId) => `${CACHE_PREFIX}${channelId}`;

    function getCache(channelId) {
        try {
            const raw = localStorage.getItem(cacheKey(channelId));
            if (!raw) return null;
            const data = JSON.parse(raw);
            const ageDays = (Date.now() - data.cachedAt) / (1000 * 60 * 60 * 24);
            if (ageDays > CACHE_TTL_DAYS) return null;
            return data;
        } catch {
            return null;
        }
    }

    function parseLaunchDateJP(text) {
        if (!text) return null;
        // "2021年4月19日（1,695日）" みたいなのから日付部分を抜く
        const m = text.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日/);
        if (!m) return null;
        const y = Number(m[1]);
        const mo = Number(m[2]);
        const d = Number(m[3]);
        return new Date(y, mo - 1, d);
    }

    function applyNewChannelColor(nameEl, launchDateText) {
        const dt = parseLaunchDateJP(launchDateText);
        if (!dt) return;

        const now = new Date();
        const diffDays = (now - dt) / (1000 * 60 * 60 * 24);

        nameEl.classList.remove('ys-new-6mo', 'ys-new-1yr');

        if (diffDays <= 183) {
            nameEl.classList.add('ys-new-6mo'); // 半年以内ピンク
        } else if (diffDays <= 365) {
            nameEl.classList.add('ys-new-1yr'); // 1年以内オレンジ
        }
    }


    function setCache(channelId, payload) {
        try {
            localStorage.setItem(
                cacheKey(channelId),
                JSON.stringify({ ...payload, cachedAt: Date.now() })
            );
        } catch {}
    }

    function extractChannelId(url) {
        const m = url.match(/\/channel\/(\d+)\//);
        return m ? m[1] : null;
    }

    function findLaunchDate(doc) {
        const table = doc.querySelector('#tab-index section.description table');
        const trs = table
        ? [...table.querySelectorAll('tbody tr')]
        : [...doc.querySelectorAll('table tbody tr')];

        for (const tr of trs) {
            const cells = [...tr.querySelectorAll('th, td')].map(x => x.textContent.trim());
            if (cells.length < 2) continue;
            if (cells[0].includes('チャンネル開設日')) {
                return cells[1];
            }
        }
        return null;
    }

    function findYouTubeLink(doc) {
        const a = doc.querySelector('a[href*="youtube.com"], a[href*="youtu.be"]');
        return a ? a.href : null;
    }

    async function fetchChannelMeta(detailUrl) {
        const channelId = extractChannelId(detailUrl);
        if (!channelId) return { channelId: null, launchDate: null, youtubeUrl: null };

        const cached = getCache(channelId);
        if (cached) return cached;

        const res = await fetch(detailUrl, { credentials: 'omit' });
        if (!res.ok) return { channelId, launchDate: null, youtubeUrl: null };

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const launchDate = findLaunchDate(doc);
        const youtubeUrl = findYouTubeLink(doc);

        const payload = { channelId, launchDate, youtubeUrl };
        setCache(channelId, payload);
        return payload;
    }

    function injectIntoRow(detailLinkEl, meta) {
        const li = detailLinkEl.closest('li');
        if (!li) return;

        // 「チャンネルの詳細」リンクがいる右側の箱を基準にする
        const box =
              detailLinkEl.closest('div') ||  // まずはリンク直上のdiv
              li.querySelector('div') ||      // fallbackでも最初の右側div
              li;

        const ps = [...box.querySelectorAll('p')];

        // material-icons や統計の行を除外して「名前行」を特定
        const nameP = ps.find(p => {
            const t = p.textContent.trim();
            if (!t) return false;

            // アイコン行を除外（<i class="material-icons"> が入る行）
            if (p.querySelector('i.material-icons')) return false;

            // 統計っぽい行を除外
            if (/[0-9]+(万)?人/.test(t)) return false;
            if (/回/.test(t)) return false;
            if (/本/.test(t)) return false;

            // 「チャンネルの詳細」自身の行も除外
            if (t.includes('チャンネルの詳細')) return false;

            return true;
        }) || ps[0] || box;  // fallbackは box 内に限定

        // YouTubeリンク（親クリック奪取を回避）
        if (meta.youtubeUrl && !nameP.querySelector('.ys-ytlink')) {
            const ytA = document.createElement('a');
            ytA.href = meta.youtubeUrl;
            ytA.target = '_blank';
            ytA.rel = 'noopener noreferrer';
            ytA.className = 'ys-ytlink';
            ytA.title = 'YouTubeチャンネルへ';
            ytA.textContent = '🔗';

            ytA.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            nameP.appendChild(ytA);
        }

        // 開設日は名前の横にinlineで添える
        if (meta.launchDate && !nameP.querySelector('.ys-meta')) {
            const metaSpan = document.createElement('span');
            metaSpan.className = 'ys-meta';
            metaSpan.textContent = `開設日: ${meta.launchDate}`;
            nameP.appendChild(metaSpan);
        }
        // 追加：開設からの新しさで名前色を変える
        applyNewChannelColor(nameP, meta.launchDate);

    }



    async function run() {
        const detailLinks = [...document.querySelectorAll('a')]
        .filter(a =>
                a.textContent.trim() === 'チャンネルの詳細' &&
                /\/channel\/\d+\//.test(a.getAttribute('href') || '')
               );

        if (detailLinks.length === 0) return;

        // キュー作成
        const queue = detailLinks.map(a => async () => {
            const li = a.closest('li');
            if (li && !li.querySelector('.ys-loading')) {
                const loading = document.createElement('div');
                loading.className = 'ys-loading';
                loading.textContent = '開設日取得中…';
                li.appendChild(loading);
            }

            const detailUrl = new URL(a.getAttribute('href'), location.origin).href;
            const meta = await fetchChannelMeta(detailUrl);
            injectIntoRow(a, meta);

            li?.querySelector('.ys-loading')?.remove();
            await sleep(150);
        });

        // 並列実行
        let i = 0;
        const workers = Array.from({ length: CONCURRENCY }, async () => {
            while (i < queue.length) {
                const task = queue[i++];
                try { await task(); } catch (e) { /* noop */ }
            }
        });
        await Promise.all(workers);
    }

    window.addEventListener('load', run);
})();

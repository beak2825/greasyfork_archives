// ==UserScript==
// @name         Kakuyomu 縦書きリーダー (V2.1)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  カクヨムの縦書き化 F9で設定
// @author       AI
// @match        https://kakuyomu.jp/works/*/episodes/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/560172/Kakuyomu%20%E7%B8%A6%E6%9B%B8%E3%81%8D%E3%83%AA%E3%83%BC%E3%83%80%E3%83%BC%20%28V21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560172/Kakuyomu%20%E7%B8%A6%E6%9B%B8%E3%81%8D%E3%83%AA%E3%83%BC%E3%83%80%E3%83%BC%20%28V21%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSettings = {
        fontSize: 25,
        lineHeight: 1.6,
        fontFamily: 'Meiryo',
        bgColor: '#fcfcfc',
        charCount: 22,
        lineCount: 15,
        tcy: true
    };

    let settings = defaultSettings;
    const STORAGE_KEY = 'kakuyomu_v10_settings';

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) settings = { ...defaultSettings, ...JSON.parse(saved) };
    } catch(e) {}

    let pages = [];
    let currentPageIndex = 0;
    let nextEpisodeUrl = null;
    let prevEpisodeUrl = null;

    const css = `
        #k-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: var(--k-bg-color);
            z-index: 2147483640; display: flex; flex-direction: column;
            font-family: var(--k-font-family), "Yu Mincho", serif; color: #111;
        }
        #k-overlay.hidden { display: none !important; }

        :root {
            --k-bg-color: ${settings.bgColor};
            --k-font-size: ${settings.fontSize}px;
            --k-line-height: ${settings.lineHeight};
            --k-font-family: "${settings.fontFamily}";
        }

        #k-viewport {
            flex: 1; width: 100%; height: 100%;
            position: relative; overflow: hidden;
            display: flex; justify-content: center; align-items: center;
        }

        .k-page {
            writing-mode: vertical-rl; text-orientation: upright;
            display: flex; flex-direction: column; flex-wrap: wrap;
            align-content: center; justify-content: center;
            position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            height: calc(var(--k-font-size) * ${settings.charCount});
            max-height: 90vh; width: auto;
            opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
        }
        .k-page.active { opacity: 1; pointer-events: auto; z-index: 10; }

        .k-line {
            font-size: var(--k-font-size); line-height: var(--k-line-height);
            width: calc(var(--k-font-size) * var(--k-line-height));
            height: 100%; margin: 0; padding: 0;
            letter-spacing: 0.06em; word-break: break-all;
        }
        .k-tcy { text-combine-upright: all; text-orientation: sideways; margin: 0 1px; }

        /* 下段オーバーレイメニュー */
        #k-footer {
            position: fixed; bottom: 20px; left: 50%;
            transform: translateX(-50%) translateY(120px); /* 通常は隠す */
            background: rgba(45, 45, 45, 0.95); color: #fff;
            padding: 10px 25px; border-radius: 40px;
            display: flex; gap: 15px; align-items: center;
            z-index: 2147483647; font-size: 14px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            transition: transform 0.25s ease-out;
        }
        #k-trigger-area {
            position: fixed; bottom: 0; left: 0; width: 100%; height: 80px; z-index: 2147483645;
        }
        /* トリガーエリアまたはフッターにマウスを置いたら表示 */
        #k-trigger-area:hover ~ #k-footer, #k-footer:hover {
            transform: translateX(-50%) translateY(0);
        }

        .k-btn { cursor: pointer; padding: 6px 14px; background: #555; border-radius: 20px; border: 1px solid #777; user-select: none; }
        .k-btn:hover { background: #777; }

        /* 設定パネル・ヘルプ */
        #k-settings {
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 380px; background: #fffdf0; color: #333;
            padding: 25px; border-radius: 12px; box-shadow: 0 10px 60px rgba(0,0,0,0.6);
            display: none; z-index: 2147483647; font-size: 14px;
            max-height: 85vh; overflow-y: auto;
        }
        #k-settings.active { display: block !important; }
        .k-help-box { background: #f0ede0; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 12px; line-height: 1.5; }
        .k-help-title { font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 5px; color: #555; }
        .k-row { margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .k-row input { width: 110px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; text-align: center;}
        code { background: #eee; padding: 1px 4px; border-radius: 3px; font-family: monospace; }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    const overlay = document.createElement('div');
    overlay.id = 'k-overlay';
    overlay.className = 'hidden';

    const viewport = document.createElement('div');
    viewport.id = 'k-viewport';
    overlay.appendChild(viewport);

    const triggerArea = document.createElement('div');
    triggerArea.id = 'k-trigger-area';
    overlay.appendChild(triggerArea);

    const footer = document.createElement('div');
    footer.id = 'k-footer';
    footer.innerHTML = `
        <div class="k-btn" id="k-btn-next">次へ</div>
        <div id="k-page-info" style="font-family:monospace; font-weight:bold; min-width:70px; text-align:center;">- / -</div>
        <div class="k-btn" id="k-btn-prev">前へ</div>
        <div style="width:15px;"></div>
        <div class="k-btn" id="k-btn-set">設定</div>
        <div class="k-btn" id="k-btn-close">閉じる</div>
    `;
    overlay.appendChild(footer);

    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'k-settings';
    settingsPanel.innerHTML = `
        <div class="k-help-box">
            <div class="k-help-title">操作説明</div>
            ・← / ホイール下 : 次の頁<br>
            ・→ / ホイール上 : 前の頁<br>
            ・マウス[進む] : 次の話へ<br>
            ・マウス[戻る] : ブラウザ戻る<br>
            ・F9 : 設定パネル開閉 / リーダー起動
            <div class="k-help-title" style="margin-top:10px;">フォント変更例 (PC内蔵推奨)</div>
            <code>ヒラギノ丸ゴ ProN</code> / <code>メイリオ</code><br>
            <code>游明朝</code> / <code>ＭＳ ゴシック</code>
        </div>
        <div class="k-row"><label>文字サイズ(px)</label><input type="number" id="inp-size"></div>
        <div class="k-row"><label>行間倍率</label><input type="number" step="0.1" id="inp-lh"></div>
        <div class="k-row"><label>1行の文字数</label><input type="number" id="inp-char"></div>
        <div class="k-row"><label>1頁の行数</label><input type="number" id="inp-line"></div>
        <div class="k-row"><label>背景色</label><input type="text" id="inp-bg"></div>
        <div class="k-row"><label>フォント</label><input type="text" id="inp-font"></div>
        <div class="k-row"><label>縦中横</label><input type="checkbox" id="inp-tcy" style="width:auto;"></div>
        <div style="text-align:center; margin-top:10px;"><button id="k-set-done" style="padding:6px 20px; cursor:pointer; border-radius:5px; border:1px solid #999;">完了</button></div>
    `;
    overlay.appendChild(settingsPanel);
    document.body.appendChild(overlay);

    function tokenize(node) {
        const tokens = [];
        if (node.nodeType === Node.TEXT_NODE) {
            const regex = /([0-9]{2,3}|[!]{2}|[?]{2}|[!?]{2})|./g;
            let m;
            while ((m = regex.exec(node.nodeValue)) !== null) {
                if (m[1] && settings.tcy) tokens.push({ type: 'tcy', content: m[1] });
                else if (!m[0].match(/[\n\r]/)) tokens.push({ type: 'char', content: m[0] });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();
            if (tag === 'br') tokens.push({ type: 'br' });
            else if (tag === 'p' || tag === 'div' || tag === 'ruby') {
                for (const child of node.childNodes) tokens.push(...tokenize(child));
                if (tag !== 'ruby') tokens.push({ type: 'br' });
            } else {
                for (const child of node.childNodes) tokens.push(...tokenize(child));
            }
        }
        return tokens;
    }

    function buildPages(tokens) {
        const pagesData = [];
        let curL = []; let curP = []; let cInL = 0;
        const cLine = () => {
            if (curL.length > 0) { curP.push(curL); curL = []; cInL = 0; }
            else if (curP.length > 0) curP.push([{type:'char', content:'　'}]);
        };
        const cPage = () => { if (curP.length > 0) { pagesData.push(curP); curP = []; } };
        for (const t of tokens) {
            if (t.type === 'br') { cLine(); if (curP.length >= settings.lineCount) cPage(); continue; }
            curL.push(t); cInL++;
            if (cInL >= settings.charCount) { cLine(); if (curP.length >= settings.lineCount) cPage(); }
        }
        cLine(); cPage(); return pagesData;
    }

    function render() {
        const body = document.querySelector('.widget-episodeBody');
        if (!body) return;
        const tokens = [];
        const title = document.querySelector('.widget-episodeTitle');
        if (title) { tokens.push(...tokenize(document.createTextNode(title.textContent))); tokens.push({ type: 'br' }, { type: 'br' }); }

        const nextA = document.querySelector('a.test-nav-next-href, #contentMain-readNextEpisode');
        nextEpisodeUrl = nextA ? nextA.href : null;
        const prevA = document.querySelector('a.test-nav-prev-href, #contentMain-readPreviousEpisode');
        prevEpisodeUrl = prevA ? prevA.href : null;

        tokens.push(...tokenize(body));
        pages = buildPages(tokens);
        viewport.innerHTML = '';
        pages.forEach((pageData, idx) => {
            const pDiv = document.createElement('div'); pDiv.className = 'k-page';
            if (idx === currentPageIndex) pDiv.classList.add('active');
            pageData.forEach(line => {
                const lDiv = document.createElement('div'); lDiv.className = 'k-line';
                line.forEach(t => {
                    if (t.type === 'char') lDiv.appendChild(document.createTextNode(t.content));
                    else if (t.type === 'tcy') { const s = document.createElement('span'); s.className='k-tcy'; s.textContent=t.content; lDiv.appendChild(s); }
                    else if (t.type === 'ruby') { const s = document.createElement('span'); s.innerHTML=t.html; lDiv.appendChild(s); }
                });
                pDiv.appendChild(lDiv);
            });
            viewport.appendChild(pDiv);
        });
        updateUI();
    }

    function updateUI() {
        const els = document.querySelectorAll('.k-page');
        if (currentPageIndex >= els.length) currentPageIndex = Math.max(0, els.length - 1);
        els.forEach((el, i) => el.classList.toggle('active', i === currentPageIndex));
        document.getElementById('k-page-info').textContent = `${currentPageIndex + 1} / ${pages.length}`;
    }

    function nextPage() { if (currentPageIndex < pages.length - 1) { currentPageIndex++; updateUI(); } else if (nextEpisodeUrl) location.href = nextEpisodeUrl; }
    function prevPage() { if (currentPageIndex > 0) { currentPageIndex--; updateUI(); } }

    function toggleSettings() {
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden'); document.body.style.overflow = 'hidden'; render();
        } else {
            const p = document.getElementById('k-settings');
            if (!p.classList.contains('active')) {
                document.getElementById('inp-size').value = settings.fontSize;
                document.getElementById('inp-lh').value = settings.lineHeight;
                document.getElementById('inp-char').value = settings.charCount;
                document.getElementById('inp-line').value = settings.lineCount;
                document.getElementById('inp-bg').value = settings.bgColor;
                document.getElementById('inp-font').value = settings.fontFamily;
                document.getElementById('inp-tcy').checked = settings.tcy;
                p.classList.add('active');
            } else { p.classList.remove('active'); }
        }
    }

    // ボタンイベント
    document.getElementById('k-btn-next').onclick = nextPage;
    document.getElementById('k-btn-prev').onclick = prevPage;
    document.getElementById('k-btn-close').onclick = () => { overlay.classList.add('hidden'); document.body.style.overflow = ''; };
    document.getElementById('k-btn-set').onclick = (e) => { e.stopPropagation(); toggleSettings(); };
    document.getElementById('k-set-done').onclick = () => settingsPanel.classList.remove('active');

    settingsPanel.querySelectorAll('input').forEach(el => {
        el.oninput = () => {
            settings.fontSize = parseInt(document.getElementById('inp-size').value) || 25;
            settings.lineHeight = parseFloat(document.getElementById('inp-lh').value) || 1.6;
            settings.charCount = parseInt(document.getElementById('inp-char').value) || 22;
            settings.lineCount = parseInt(document.getElementById('inp-line').value) || 15;
            settings.bgColor = document.getElementById('inp-bg').value;
            settings.fontFamily = document.getElementById('inp-font').value;
            settings.tcy = document.getElementById('inp-tcy').checked;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            const r = document.documentElement.style;
            r.setProperty('--k-bg-color', settings.bgColor);
            r.setProperty('--k-font-size', settings.fontSize + "px");
            r.setProperty('--k-line-height', settings.lineHeight);
            r.setProperty('--k-font-family', `"${settings.fontFamily}"`);
            render();
        };
    });

    // キー/マウス
    window.addEventListener('keydown', (e) => {
        if (e.key === 'F9') { e.preventDefault(); toggleSettings(); return; }
        if (overlay.classList.contains('hidden') || e.target.tagName === 'INPUT') return;
        if (e.key === 'ArrowLeft') nextPage();
        if (e.key === 'ArrowRight') prevPage();
        if (e.key === 'Escape') {
            if (settingsPanel.classList.contains('active')) settingsPanel.classList.remove('active');
            else { overlay.classList.add('hidden'); document.body.style.overflow = ''; }
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (overlay.classList.contains('hidden')) return;
        if (e.button === 4) { e.preventDefault(); if (nextEpisodeUrl) location.href = nextEpisodeUrl; }
    });

    window.addEventListener('wheel', (e) => {
        if (overlay.classList.contains('hidden') || e.target.closest('#k-settings')) return;
        e.preventDefault(); if (e.deltaY > 0) nextPage(); else prevPage();
    }, { passive: false });

    // 自動起動
    const timer = setInterval(() => {
        if (document.querySelector('.widget-episodeBody')) {
            clearInterval(timer); overlay.classList.remove('hidden'); document.body.style.overflow = 'hidden'; render();
        }
    }, 500);
})();
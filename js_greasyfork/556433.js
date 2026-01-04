// ==UserScript==
// @name         YouTube コメント・概要欄 タイムスタンプ右上表示
// @namespace    http://tampermonkey.net/
// @version      0.4.0 (動作不可を直せず一旦終了)
// @description  コメントブロックや概要欄を↗︎にそのまま複製表示。長文スクロール対応。
// @match        https://www.youtube.com/*
// @license MIT
// @grant        none
// @run-at       document-idle
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/556433/YouTube%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%BB%E6%A6%82%E8%A6%81%E6%AC%84%20%E3%82%BF%E3%82%A4%E3%83%A0%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%97%E5%8F%B3%E4%B8%8A%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/556433/YouTube%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%83%BB%E6%A6%82%E8%A6%81%E6%AC%84%20%E3%82%BF%E3%82%A4%E3%83%A0%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%97%E5%8F%B3%E4%B8%8A%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
'use strict';

console.log('[TS Sidebar] Script Loaded');

// -------------------- サイドバー生成 --------------------
let sidebar;
function createSidebar() {
    if (sidebar) return sidebar;

    sidebar = document.createElement('div');
    sidebar.id = 'yt-ts-right-sidebar';
    Object.assign(sidebar.style, {
        position: 'fixed', top: '80px', right: '16px', width: '280px',
        maxHeight: '400px', overflowY: 'auto', zIndex: 9999,
        background: 'rgba(255,255,255,0.97)', border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        padding: '8px', fontSize: '13px', fontFamily: 'sans-serif',
        color: '#000', backdropFilter: 'blur(4px)',
    });

    const title = document.createElement('div');
    title.textContent = '右上タイムスタンプ表示';
    title.style.fontWeight = '600';
    title.style.marginBottom = '6px';
    sidebar.appendChild(title);

    const area = document.createElement('div');
    area.id = 'yt-ts-display-area';
    area.textContent = '待機中…';
    area.style.opacity = '0.8';
    sidebar.appendChild(area);

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '表示リセット';
    Object.assign(resetBtn.style, {
        marginTop: '6px', width: '100%', padding: '4px',
        borderRadius: '4px', cursor: 'pointer',
        border: '1px solid #ccc', background: '#f0f0f0'
    });
    resetBtn.addEventListener('click', () => {
        area.textContent = '待機中…';
    });
    sidebar.appendChild(resetBtn);

    document.body.appendChild(sidebar);
    return sidebar;
}

// -------------------- ★ expander 内の本文抽出（Shadow DOM 対応版） --------------------
function showInSidebarElement(element) {
    createSidebar();
    const area = document.getElementById('yt-ts-display-area');
    area.innerHTML = '';

    function logStep(msg) {
        area.innerHTML = `<div style="opacity:0.8">${msg}</div>`;
    }

    // ★ Shadow DOM 対応：yt-attributed-string の内部抽出
    function extractAttributedText(node) {
        try {
            if (node && node.tagName === 'YT-ATTRIBUTED-STRING') {
                if (node.shadowRoot) {
                    return node.shadowRoot.textContent || '';
                }
            }
        } catch(e){}
        return '';
    }

    // ---① content-text 試行（Shadow DOM 対応） ---
    logStep('① content-text（Shadow DOM）抽出中…');

    const rawContent = element.querySelector('#content-text');
    if (rawContent) {
        const text = extractAttributedText(rawContent);
        if (text.trim() !== '') {
            area.textContent = text;
            return;
        }
    }

    // ---② content-text の textContent を直接読む ---
    logStep('② content-text の textContent 抽出中…');
    if (rawContent) {
        const text = rawContent.textContent.trim();
        if (text !== '') {
            area.textContent = text;
            return;
        }
    }

    // ---③ expander 全体の innerText ---
    logStep('③ expander innerText 抽出中…');
    try {
        const t = element.innerText.trim();
        if (t !== '') {
            area.textContent = t;
            return;
        }
    } catch(e){}

    // ---④ ShadowRoot 全走査 ---
    logStep('④ ShadowRoot 全走査中…');
    try {
        if (element.shadowRoot) {
            const txt = element.shadowRoot.textContent.trim();
            if (txt !== '') {
                area.textContent = txt;
                return;
            }
        }
    } catch(e){}

    // ---⑤ Range 抽出 ---
    logStep('⑤ Range による抽出中…');
    try {
        const range = document.createRange();
        range.selectNodeContents(element);
        const txt = range.toString().trim();
        if (txt !== '') {
            area.textContent = txt;
            return;
        }
    } catch(e){}

    // ---⑥ 最終 fallback: getSelection ---
    logStep('⑥ getSelection 抽出中…');
    try {
        const sel = window.getSelection();
        sel.removeAllRanges();
        const r = document.createRange();
        r.selectNodeContents(element);
        sel.addRange(r);
        const txt = sel.toString().trim();
        sel.removeAllRanges();

        if (txt !== '') {
            area.textContent = txt;
            return;
        }
    } catch(e){}

    area.innerHTML = '<b>すべてのコピー方法に失敗しました。</b>';
}

// -------------------- ボタン生成 --------------------
function createInjectButton(targetParentEl, extractSelector, insertAfterEl) {
    const space = document.createTextNode(' ');
    insertAfterEl.parentNode.insertBefore(space, insertAfterEl.nextSibling);

    const btn = document.createElement('button');
    btn.textContent = '↗︎に表示';
    Object.assign(btn.style, {
        padding: '2px 6px', fontSize: '12px', borderRadius: '4px',
        cursor: 'pointer', border: '1px solid #ccc', background: '#eee',
        marginLeft: '4px'
    });

    btn.addEventListener('click', e => {
        e.stopPropagation();

        createSidebar();
        const area = document.getElementById('yt-ts-display-area');
        area.textContent = '表示処理中…';

        const expander = targetParentEl.querySelector('ytd-expander#expander');
        if (!expander) {
            area.textContent = 'expander が見つかりません';
            return;
        }

        // ★ 強制展開（YouTube 新仕様対応）
        expander.setAttribute('expanded', '');
        const more = expander.querySelector('#more');
        if (more) more.click();

        setTimeout(() => {
            showInSidebarElement(expander);
        }, 500);
    });

    insertAfterEl.parentNode.insertBefore(btn, space.nextSibling);
}

// -------------------- コメント --------------------
function scanComments() {
    const nodes = Array.from(document.querySelectorAll('ytd-comment-thread-renderer'));
    for (const c of nodes) {
        const timeEl = c.querySelector('#published-time-text');
        if (!timeEl || timeEl.dataset.tsProcessed) continue;
        timeEl.dataset.tsProcessed = '1';
        createInjectButton(c, '#expander', timeEl);
    }
}

// -------------------- 概要欄 --------------------
function scanDescription() {
    const info = document.querySelector('yt-formatted-string#info');
    if (!info || info.dataset.tsProcessed) return;
    info.dataset.tsProcessed = '1';

    createInjectButton(
        info.parentElement,
        'ytd-text-inline-expander #expanded',
        info
    );
}

// -------------------- 動的監視 --------------------
const debounced = (fn, ms) => { let t; return () => { clearTimeout(t); t = setTimeout(fn, ms); }; };

function observeDynamic() {
    const target = document.body;
    new MutationObserver(debounced(() => {
        scanComments();
        scanDescription();
    }, 800)).observe(target, { childList: true, subtree: true });
}

// -------------------- 初回実行 --------------------
setTimeout(() => {
    createSidebar();
    scanComments();
    scanDescription();
    observeDynamic();
}, 1500);

})();
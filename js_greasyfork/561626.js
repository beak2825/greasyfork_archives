// ==UserScript==
// @name         Hitomi.la Type Filter Utils
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  定数（TYPE_BUTTONS）と CSSスタイルの定義・注入。
// ==/UserScript==

(function(window) {
    'use strict';

    const TYPE_BUTTONS = [
        { label: 'Doujinshi', value: 'doujinshi', color: '#ffcccc' },
        { label: 'Artist CG', value: 'artistcg',  color: '#ccffff' },
        { label: 'Manga',     value: 'manga',     color: '#ffccff' },
        { label: 'Game CG',   value: 'gamecg',    color: '#ccccff' },
        { label: 'Image Set', value: 'imageset',  color: '#cccccc' },
        { label: 'Anime',     value: 'anime',     color: '#ccffcc' }
    ];
    
    // ★新規追加: レイアウト用アイコン定義
    const LAYOUT_ICONS = {
        list: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
        grid: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
    };

function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
/* 
   ==========================================================================
   【共通設定】
   ========================================================================== 
*/

/* 不要な裏画像などを削除 (全レイアウト共通) */
.dj-img2, .cg-img2, .anime-img2, .dj-img-back, hr.unread { display: none !important; }
.dj-img1, .cg-img1, .anime-img1 { transform: none !important; background-color: transparent; border: none; }

.gallery-content .dj-img1,
.gallery-content .cg-img1,
.gallery-content .anime-img1 {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
}


/* --- リスト表示（デフォルト）時の画像中央寄せ --- */
.gallery-content:not(.layout-grid) .dj-img-cont {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important; /* 上下も中央にする場合 */
}

/* ★追加: PC表示(768px以上)の時だけ、リスト表示の画像コンテナを親要素の下端に移動させる */
@media (min-width: 768px) {
    /* 親要素(カード全体)を配置の基準点にする */
    .gallery-content:not(.layout-grid) > div {
        position: relative !important;
    }

    /* 画像コンテナを絶対配置で「下端」に固定する */
    .gallery-content:not(.layout-grid) .dj-img-cont {
        position: absolute !important;
        bottom: 0 !important;
        top: auto !important; /* 元のCSSによる上部固定を解除 */
    }
}

/* ★追加: スマホ表示(767px以下): 上下位置維持＋左右中央＋画像フィット */
@media (max-width: 767px) {
    /* コンテナ: 位置調整とFlexbox化 */
    .gallery-content:not(.layout-grid) .dj-img-cont {
        width: 100% !important;
        /* --- 位置調整 (上下維持・左右中央) --- */
        float: none !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        right: auto !important;
        margin: 0 !important;
        
        /* --- 画像フィット用 (グリッドから流用) --- */
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
    }

    /* 画像ラッパー: サイズ制限解除と最大化 */
    .gallery-content:not(.layout-grid) .dj-img1,
    .gallery-content:not(.layout-grid) .cg-img1
    .gallery-content:not(.layout-grid) .anime-img1 {
        /* ★重要: 幅の制限を解除 */
        max-width: none !important;
        min-width: 0 !important;

        position: static !important;
        margin: 0 !important;
    }
}

/* ★追加: 画像の絶対配置(position: absolute)を解除してFlexアイテムとして認識させる */
.gallery-content:not(.layout-grid) .dj-img1,
.gallery-content:not(.layout-grid) .cg-img1,
.gallery-content:not(.layout-grid) .anime-img1 {
    position: static !important;
    margin: 0 auto !important;
}

/* 
   ==========================================================================
   【2】Grid Layout (グリッド)
   ========================================================================== 
*/

/* --- グリッド全体の定義 --- */
.gallery-content.layout-grid {
    display: grid !important;
    /* ★変更: CSS変数で列数を制御 (デフォルトは5) */
    grid-template-columns: repeat(var(--grid-cols, 5), 1fr) !important;
    gap: 16px;
}
@media (min-width: 768px) and (max-width: 1024px) { .gallery-content.layout-grid { grid-template-columns: repeat(var(--grid-cols, 4), 1fr) !important; } } 
@media (max-width: 767px) { .gallery-content.layout-grid { grid-template-columns: repeat(var(--grid-cols, 3), 1fr) !important; } } 

/* --- 個別カード --- */
.gallery-content.layout-grid > div {
    width: 100% !important;
    height: auto !important;
    /* display: flex; いらない横並び*/
    flex-direction: column; /* 縦並び */
    overflow: hidden;
    margin: 0 !important;
    padding: 0 !important;
    position: relative !important; /* 位置リセット */
}



/* --- 画像エリア --- */
.gallery-content.layout-grid .dj-img-cont {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 3 / 3;
    margin: 0 !important;
    padding: 0 !important;
    float: none !important;
    /* 画像を中央配置 */
    display: flex !important;
    justify-content: center;
    align-items: center;

    overflow: hidden;
    position: relative !important;
    
    /* ★追加: 元のCSSによる位置ズレ(top)を強制的にリセットして上端にピッタリくっつける */
    top: 0 !important;
    left: 0 !important; /* ← これで横ズレが直ります */
}

.gallery-content.layout-grid .dj-img1,
.gallery-content.layout-grid .cg-img1,
.gallery-content.layout-grid .anime-img1  {
    clip-path: none !important;
    margin: 0 !important;
    object-fit: fill;
    position: static !important;
}

.gallery-content.layout-grid .dj-img1 img,
.gallery-content.layout-grid .cg-img1 img,
.gallery-content.layout-grid .anime-img1 img {
    width: 100% !important;
    height: 100% !important;
    /* 枠の中で比率を保って全体を表示 */
    object-fit: contain !important;
}




/* --- テキストエリア (.dj-content) --- */
/* Hitomiデフォルトの margin-left: 100px 等を解除して表示させる */
.gallery-content.layout-grid .dj-content {
    padding: 0 !important;
    margin: 0 !important;
    float: none !important;
    min-height: 0 !important;
}


/* --- 変更後: 個別表示クラス(.show-local-detail)がない場合のみ隠すように条件を追加 --- */
html:not(.htf-show-grid-details) .gallery-content.layout-grid > div:not(.show-local-detail) table,
html:not(.htf-show-grid-details) .gallery-content.layout-grid > div:not(.show-local-detail) .relatedtags { 
    display: none !important; 
}

/* 詳細表示時のスタイル微調整 (必要に応じて) */
@media (max-width: 767px) {
    .gallery-content.layout-grid td {
        width: 0 !important;
    }
    .gallery-content.layout-grid li,
    .gallery-content.layout-grid a {
        padding: 0 !important;
    }
    .gallery-content.layout-grid .dj-content {
        font-size: 13px;
    }
}

.gallery-content.layout-grid .date { display: none !important; }

/* --- タイトル & 作者名 --- */
/* Hitomiデフォルトの絶対配置やマージンを強制リセット */
.gallery-content.layout-grid h1,
.gallery-content.layout-grid .artist-list {
    position: relative !important; /* staticから変更 */
    margin: 0 !important;
    padding-left: 5px !important; /* 左詰めPadding 5px */
    width: auto !important;
    text-align: left !important; /* 左詰め */
    float: none !important;
    display: block !important;
}

/* タイトル (上) */
.gallery-content.layout-grid h1 {
    line-height: 1.4;
    margin-top: 0 !important;
    overflow: hidden;
}

/* 作者名 (下) */
.gallery-content.layout-grid .artist-list {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.detail-toggle-btn {
    display: none !important;
}

/* --- 新規追加: 個別詳細表示ボタンのスタイル --- */
.gallery-content.layout-grid .detail-toggle-btn {
    display: flex !important;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    width: 28px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    /* 文字と被ったときのために背景色をつける (右端を白くする) */
    //background: linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,1) 30%);
    background: #ffffffcc;
    z-index: 10;
}
.gallery-content.layout-grid .detail-toggle-btn:hover {
    background: #fff; /* ホバー時は完全に白く */
}

/* 矢印アイコン */
.detail-toggle-btn svg {
    width: 20px;
    height: 20px;
    fill: #6b7280;
    transition: transform 0.3s ease;
}
.gallery-content.layout-grid .detail-toggle-btn:hover svg {
    fill: #111;
}

/* 展開時(上向き) */
.show-local-detail .detail-toggle-btn svg {
    transform: rotate(180deg);
}

/* ==========================================================================
   UI Components (Buttons, Modal, etc.)
   ========================================================================== */

/* コンテナを画面いっぱいに広げる */
.container {
    overflow: visible !important; /* Sticky用 */
    max-width: none !important;   /* 幅制限解除 */
}
@media screen and (min-width: 768px) {
    .container {
        width: 99.9% !important;
    }
}

#type-filter-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px auto; max-width: 920px; padding: 0 20px; width: 100%; box-sizing: border-box; position: relative; z-index: 10; }
@media (min-width: 768px) and (max-width: 1024px) { #type-filter-container { gap: 10px; padding: 0 12px; margin: 16px auto; } }
@media (max-width: 767px) { #type-filter-container { gap: 8px; padding: 0 8px; margin: 14px auto; } }
#extra-tools-container { display: flex; justify-content: center; align-items: center; gap: 16px; margin: 0 auto 0 auto; max-width: 920px; padding: 0 20px; width: 100%; box-sizing: border-box; position: relative; z-index: 1001; }
@media (max-width: 767px) { #extra-tools-container { gap: 10px; padding: 0 10px; flex-wrap: wrap; } }
.type-filter-btn { position: relative; height: 80px; border-radius: 16px; display: flex; flex-direction: column; overflow: visible; user-select: none; cursor: pointer; background: white; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); border: 3px solid transparent; min-width: 0; z-index: 1; }
@media (min-width: 768px) and (max-width: 1024px) { .type-filter-btn { height: 72px; border-radius: 14px; border: 2.5px solid transparent; } }
@media (max-width: 767px) { .type-filter-btn { height: 60px; border-radius: 12px; border: 2px solid transparent; } }
.type-filter-btn::before { content: ''; position: absolute; inset: 0; border-radius: 13px; padding: 3px; background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
.type-filter-btn:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12); z-index: 20; }
.type-filter-btn:hover::before { opacity: 1; }
@media (hover: none) and (pointer: coarse) { .type-filter-btn:hover { transform: none; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); } .type-filter-btn:hover::before { opacity: 0; } }
.type-filter-btn.state-include { border-color: #10b981; box-shadow: 0 8px 28px rgba(16, 185, 129, 0.25), 0 0 0 4px rgba(16, 185, 129, 0.1); transform: translateY(-2px); }
.type-filter-btn.state-include::after { content: '✓'; position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 10; }
@media (min-width: 768px) and (max-width: 1024px) { .type-filter-btn.state-include::after { width: 26px; height: 26px; font-size: 15px; top: -7px; right: -7px; } }
@media (max-width: 767px) { .type-filter-btn.state-include::after { width: 20px; height: 20px; font-size: 12px; top: -5px; right: -5px; } }
.type-filter-btn.state-exclude { border-color: #ef4444; box-shadow: 0 8px 28px rgba(239, 68, 68, 0.25), 0 0 0 4px rgba(239, 68, 68, 0.1); transform: translateY(-2px); opacity: 0.65; filter: grayscale(0.3); }
.type-filter-btn.state-exclude::after { content: '✕'; position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 10; }
@media (min-width: 768px) and (max-width: 1024px) { .type-filter-btn.state-exclude::after { width: 26px; height: 26px; font-size: 15px; top: -7px; right: -7px; } }
@media (max-width: 767px) { .type-filter-btn.state-exclude::after { width: 20px; height: 20px; font-size: 12px; top: -5px; right: -5px; } }
@keyframes popIn { 0% { transform: scale(0) rotate(-180deg); opacity: 0; } 50% { transform: scale(1.2) rotate(10deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
.type-filter-btn.state-exclude .btn-label { text-decoration: line-through; text-decoration-color: #ef4444; text-decoration-thickness: 2.5px; opacity: 0.7; }
.btn-content { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; padding: 12px; }
@media (max-width: 767px) { .btn-content { padding: 8px 4px; } }
.color-indicator { position: absolute; left: 12px; width: 6px; height: 36px; border-radius: 3px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }
@media (min-width: 768px) and (max-width: 1024px) { .color-indicator { left: 10px; width: 5px; height: 30px; } }
@media (max-width: 767px) { .color-indicator { left: 6px; width: 4px; height: 24px; } }
.type-filter-btn:hover .color-indicator { height: 42px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); }
@media (hover: none) and (pointer: coarse) { .type-filter-btn:hover .color-indicator { height: 36px; } }
@media (min-width: 768px) and (max-width: 1024px) { .type-filter-btn:hover .color-indicator { height: 34px; } }
@media (max-width: 767px) { .type-filter-btn:hover .color-indicator { height: 24px; } }
.action-area { display: flex; height: 44px; border-top: 1px solid rgba(0, 0, 0, 0.06); background: linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.8)); backdrop-filter: blur(10px); border-radius: 0 0 13px 13px; overflow: hidden; }
@media (min-width: 768px) and (max-width: 1024px) { .action-area { height: 40px; border-radius: 0 0 11px 11px; } }
@media (max-width: 767px) { .action-area { height: 32px; border-radius: 0 0 10px 10px; } }
.click-area { flex: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; gap: 6px; color: rgba(0, 0, 0, 0.45); padding: 8px; min-width: 0; }
@media (min-width: 768px) and (max-width: 1024px) { .click-area { font-size: 11px; gap: 4px; letter-spacing: 0.3px; } }
@media (max-width: 767px) { .click-area { padding: 0; gap: 0; } .click-area span { display: none; } }
.click-area:hover { background: rgba(255, 255, 255, 0.95); color: rgba(0, 0, 0, 0.7); transform: scale(1.05); z-index: 3; }
@media (hover: none) and (pointer: coarse) { .click-area:hover { background: none; color: rgba(0, 0, 0, 0.45); transform: none; } .click-area:active { background: rgba(0, 0, 0, 0.1); transform: scale(0.97); } }
.click-area:active { transform: scale(0.95); }
.click-area.left { border-right: 1px solid rgba(0, 0, 0, 0.06); }
.type-filter-btn.state-include .click-area.left { background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25)); color: #059669; }
.type-filter-btn.state-exclude .click-area.right { background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.25)); color: #dc2626; }
.click-area::before { font-size: 16px; font-weight: 900; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
@media (min-width: 768px) and (max-width: 1024px) { .click-area::before { font-size: 15px; } }
@media (max-width: 767px) { .click-area::before { font-size: 16px; } }
.click-area.left::before { content: '⊕'; }
.click-area.right::before { content: '⊖'; }
.click-area:hover::before { transform: scale(1.3) rotate(90deg); }
@media (hover: none) and (pointer: coarse) { .click-area:hover::before { transform: none; } .click-area:active::before { transform: scale(1.2); } }
.btn-label { display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', sans-serif; font-weight: 700; font-size: 15px; color: rgba(0, 0, 0, 0.85); letter-spacing: 0.5px; transition: all 0.3s; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8); width: 100%; overflow: hidden; text-overflow: ellipsis; }
@media (min-width: 768px) and (max-width: 1024px) { .btn-label { font-size: 14px; letter-spacing: 0.3px; } }
@media (max-width: 767px) { .btn-label { font-size: 14px; letter-spacing: 0; } }
.type-filter-btn:hover .btn-label { transform: scale(1.05); }
@media (hover: none) and (pointer: coarse) { .type-filter-btn:hover .btn-label { transform: none; } }
.type-filter-btn.state-include .btn-label, .type-filter-btn.state-exclude .btn-label { font-weight: 800; }
@media (max-width: 767px) { .type-filter-btn.state-include .btn-label, .type-filter-btn.state-exclude .btn-label { font-weight: 700; } }
.tool-btn { background: #ffffff; color: #4b5563; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 20px; height: 40px; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; white-space: nowrap; transition: all 0.2s ease; flex: 0 1 auto; }
@media (max-width: 767px) { .tool-btn { padding: 0 14px; height: 36px; font-size: 12px; min-width: auto; } }
.tool-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08); }
.tool-btn:active { transform: translateY(0); }
.tool-btn.lang-btn { color: #db2777; border-color: #fbcfe8; background-color: #fdf2f8; }
.tool-btn.lang-btn:hover { background-color: #fce7f3; border-color: #f9a8d4; }
.tool-btn.lang-btn.active { background-color: #ec4899; color: white; border-color: #db2777; box-shadow: 0 2px 6px rgba(236, 72, 153, 0.4); }
.tool-btn.dropdown-btn { color: #4f46e5; border-color: #c7d2fe; background-color: #eef2ff; }
.tool-btn.dropdown-btn:hover { background-color: #e0e7ff; border-color: #a5b4fc; }
.dropdown-wrapper { position: relative; }
.dropdown-content { display: none; position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: white; min-width: 200px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; border: 1px solid #f3f4f6; z-index: 100; max-height: 300px; overflow-y: auto; padding: 6px; }
.dropdown-content.show { display: block; }
.dropdown-item { padding: 10px 14px; font-size: 13px; color: #4b5563; cursor: pointer; border-radius: 6px; margin-bottom: 2px; transition: background 0.2s; }
.dropdown-item:hover { background-color: #f9fafb; }
.dropdown-item.active { background-color: #fee2e2; color: #dc2626; font-weight: bold; }
textarea#query-input { width: 100%; min-height: 44px; height: 44px; padding: 10px 14px; font-size: 15px; border: 2px solid #e5e7eb; border-radius: 10px; resize: none; overflow: hidden; font-family: sans-serif; line-height: 1.5 !important; vertical-align: middle; background-color: #f9fafb; }
textarea#query-input:focus { outline: none; border-color: #667eea; background-color: #ffffff; }
@media (min-width: 481px) { .header-table { display: flex !important; float: none !important; width: 100% !important; max-width: 920px !important; margin: 0 auto 20px auto !important; padding: 0 20px !important; box-sizing: border-box !important; align-items: center !important; flex-wrap: nowrap !important; } .search-input { flex-grow: 1 !important; width: auto !important; margin-right: 8px !important; } #search-button { height: 44px !important; margin: 0 !important; vertical-align: middle !important; cursor: pointer; } }
.external-search-link { display: inline-block; margin-left: 6px; text-decoration: none; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 6px; color: white; background-color: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.2); opacity: 0.9; transition: all 0.2s; vertical-align: middle; line-height: 1.2; }
.external-search-link:hover { opacity: 1; transform: translateY(-1px); background-color: #ffffff; }
.tool-btn.series-filter-btn { color: #059669; border-color: #a7f3d0; background-color: #ecfdf5; }
.tool-btn.series-filter-btn:hover { background-color: #d1fae5; border-color: #6ee7b7; }
.tool-btn.series-filter-btn.active { background-color: #10b981; color: white; border-color: #059669; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
.tool-btn.config-btn { color: #555; border-color: #ddd; background-color: #f9f9f9; padding: 0 12px; }
.tool-btn.config-btn:hover { background-color: #eee; border-color: #ccc; }
#hitomi-filter-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); }
#hitomi-filter-modal { background: white; width: 90%; max-width: 800px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); display: flex; flex-direction: column; max-height: 90vh; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.modal-header { padding: 16px 24px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fdfdfd; }
.modal-title { font-weight: bold; font-size: 18px; color: #333; display: flex; align-items: center; gap: 10px; }
.modal-close { cursor: pointer; font-size: 24px; color: #999; line-height: 1; }
.modal-close:hover { color: #333; }
.modal-body { padding: 24px; overflow-y: auto; flex: 1; }
.modal-section { margin-bottom: 30px; }
.modal-label { display: block; font-weight: bold; margin-bottom: 10px; color: #444; font-size: 15px; border-left: 4px solid #4f46e5; padding-left: 10px; }
.modal-desc { font-size: 12px; color: #666; margin-bottom: 12px; line-height: 1.4; }
.modal-textarea { width: 100%; height: 200px; border: 1px solid #ccc; border-radius: 6px; padding: 10px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
.site-list { display: flex; flex-direction: column; gap: 8px; }
.site-row { transition: transform 0.2s, background-color 0.2s; border: 1px solid transparent; border-radius: 6px; margin-bottom: 4px; background: #fff; display: flex; gap: 8px; align-items: center; }
.site-row.dragging { opacity: 0.8; background: #f0f9ff; border: 1px dashed #4f46e5; z-index: 10; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.site-input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; }
.site-label { width: 80px; flex-shrink: 0; }
.site-url { flex-grow: 1; }
.site-space-select { padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px; width: 80px; flex-shrink: 0; background: #fff; cursor: pointer; }
.btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; cursor: pointer; border: 1px solid #ddd; background: #fff; color: #666; flex-shrink: 0; }
.btn-icon:hover { background: #f3f3f3; color: #333; }
.btn-icon.delete:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
.btn-add-site { margin-top: 10px; width: 100%; padding: 8px; border: 1px dashed #ccc; background: #fafafa; color: #666; cursor: pointer; border-radius: 6px; font-weight: bold; font-size: 13px; }
.btn-add-site:hover { background: #f0f0f0; color: #444; border-color: #bbb; }
@media (max-width: 600px) { .site-row { flex-wrap: wrap; gap: 6px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 4px; } .site-label { width: 100%; flex-basis: 100%; } .site-url { width: 100%; flex-basis: 100%; } .site-space-select { flex-grow: 1; } .btn-icon { margin-left: auto; } }
.modal-footer { padding: 16px 24px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; background: #fdfdfd; }
.btn-modal { padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; border: none; font-size: 14px; }
.btn-cancel { background: #f3f4f6; color: #4b5563; }
.btn-cancel:hover { background: #e5e7eb; }
.btn-save { background: #4f46e5; color: white; }
.btn-save:hover { background: #4338ca; }
.sync-switch-wrapper { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #555; background: #f0fdf4; padding: 6px 12px; border-radius: 20px; border: 1px solid #bbf7d0; }
.sync-switch-wrapper.off { background: #fef2f2; border-color: #fecaca; }
.switch { position: relative; display: inline-block; width: 40px; height: 22px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 22px; }
.slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #10b981; }
input:checked + .slider:before { transform: translateX(18px); }
.drag-handle { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: grab; color: #9ca3af; flex-shrink: 0; }
.drag-handle:active { cursor: grabbing; color: #4b5563; }
.drag-handle svg { display: block; pointer-events: none; }
.sort-arrows { display: none; flex-direction: column; justify-content: center; gap: 2px; margin-right: 4px; }
.sort-btn { width: 32px; height: 15px; display: flex; align-items: center; justify-content: center; background: #f3f4f6; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 10px; color: #555; line-height: 1; }
.sort-btn:hover { background: #e5e7eb; }
.sort-btn:active { background: #d1d5db; }
@media (hover: none) and (pointer: coarse), (max-width: 1024px) { .drag-handle { display: none; } .sort-arrows { display: flex; } .site-row { cursor: default; } }
/* --- レイアウト切替ボタン (固定を解除して元のスタイルへ) --- */
.layout-btn-wrapper {
    position: relative;
    /* top, right, z-index は削除または初期値へ */
    top: auto;
    right: auto;
    z-index: auto;
}
/* --- Sticky配置を有効にするための親要素設定 --- */
/* 親要素に overflow: hidden があると position: sticky が効かないため解除 */
.container {
    overflow: visible !important;
}
/* --- 新しい追従コンテナ (下段) --- */
#sticky-tools-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin: 0 auto; /* 上下のマージンは調整 */
    padding: 10px 20px;
    width: 100%;
    box-sizing: border-box;
    
    /* ★重要: 画面上部に固定する設定 */
    position: sticky;
    top: 0;
    z-index: 999; /* コンテンツより上に表示 */
    
    /* 背景色がないと透けてしまうため設定 */
    background-color: rgb(255 255 255 / 70%);
    backdrop-filter: blur(10px); /* すりガラス効果 */
    
    /* アニメーション用 */
    transition: all 0.3s ease;
}

@media (max-width: 767px) {
    #sticky-tools-container {
        gap: 10px;
        padding: 8px 10px;
    }
}
.layout-trigger-btn { min-width: 50px; padding: 0 10px; }
.layout-dropdown { display: none; position: absolute; top: calc(100% + 8px); right: 0; background: white; min-width: 160px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; border: 1px solid #f3f4f6; z-index: 100; padding: 6px; }
.layout-dropdown.show { display: block; }
.layout-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; color: #4b5563; cursor: pointer; border-radius: 6px; transition: background 0.2s; }
.layout-option:hover { background-color: #f9fafb; }
.layout-option.active { background-color: #e0e7ff; color: #4f46e5; font-weight: bold; }
.layout-option svg { flex-shrink: 0; }

/* --- 既存の style.innerHTML の末尾に追加・置換 --- */

/* グリッド列数選択UI (New Design) */
.grid-col-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
    margin-left: auto; /* 右寄せ */
    padding-left: 8px;
}

/* グレーの縦棒と数値表示 */
.grid-current-val {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 24px;
    font-size: 12px;
    font-weight: bold;
    color: #6b7280;
    border-left: 1px solid #b5b6bb; /* うっすらとした縦棒 */
    cursor: pointer;
    transition: color 0.2s;
}
.layout-option:hover .grid-current-val {
    border-left-color: #9b9da1; /* 親ホバー時に少し濃く */
}
.grid-current-val:hover {
    color: #4f46e5;
    background-color: rgba(0,0,0,0.02);
}

/* サブメニュー (ドロップダウン) */
.grid-submenu {
    display: none;
    position: absolute;
    top: 100%; /* 親の下に表示 */
    right: -15px; /* 親ドロップダウンの右端に合わせる微調整 */
    background: white;
    min-width: 50px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    border-radius: 8px;
    border: 1px solid #f3f4f6;
    z-index: 101;
    padding: 4px;
    flex-direction: column;
    gap: 2px;
}
.grid-submenu.show {
    display: flex;
    animation: fadeIn 0.1s ease;
}

/* サブメニューの各項目 */
.grid-submenu-item {
    display: block;
    padding: 6px 0;
    text-align: center;
    font-size: 12px;
    color: #4b5563;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.2s;
}
.grid-submenu-item:hover {
    background-color: #f3f4f6;
    color: #111;
}
.grid-submenu-item.active {
    background-color: #e0e7ff;
    color: #4f46e5;
    font-weight: bold;
}

/* スマホ (767px以下): 4以上を隠す */
@media (max-width: 767px) {
    .grid-submenu-item[data-val="4"],
    .grid-submenu-item[data-val="5"],
    .grid-submenu-item[data-val="6"],
    .grid-submenu-item[data-val="7"],
    .grid-submenu-item[data-val="8"],
    .grid-submenu-item[data-val="9"],
    .grid-submenu-item[data-val="10"] {
        display: none;
    }
}

/* タブレット (768px ~ 1024px): 6以上を隠す */
@media (min-width: 768px) and (max-width: 1024px) {
    .grid-submenu-item[data-val="6"],
    .grid-submenu-item[data-val="7"],
    .grid-submenu-item[data-val="8"],
    .grid-submenu-item[data-val="9"],
    .grid-submenu-item[data-val="10"] {
        display: none;
    }
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }


/* 作品詳細ページ: プレビューエリアのマージン調整 */
.gallery-preview.lillie {
    margin-top: 40px !important;
}

/* サムネイル画像: 親要素に合わせてリサイズし、はみ出さずに収める */
.thumbnail-container img {
    width: 100% !important;
    height: 100% !important;
    /* ★追加: 元のCSSによるサイズ制限を解除 */
    max-width: none !important;
    max-height: none !important;
    object-fit: contain !important;
}

/* スライダーUIのスタイル */
.thumbnail-slider-wrapper {
    width: 100%;
    max-width: 600px;
    margin: 0 auto 20px auto;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px 20px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    
    /* ★追加: パディングを含めて幅を計算させることで、スマホでの横はみ出しを防ぐ */
    box-sizing: border-box; 
}

.thumbnail-slider-label {
    font-size: 13px;
    font-weight: bold;
    color: #4b5563;
    white-space: nowrap;
}

/* スライダー本体 */
.thumbnail-slider {
    flex: 1;
    cursor: pointer;
    height: 6px;
    -webkit-appearance: none;
    
    /* ★変更: 背景をグラデーションにして中央に目盛り(縦線)を描画 */
    /* 左から49.5%までグレー、49.5%~50.5%を濃いグレー(線)、残りをグレーにする */
    background: linear-gradient(to right, #e5e7eb 0%, #e5e7eb 49.5%, #9ca3af 49.5%, #9ca3af 50.5%, #e5e7eb 50.5%, #e5e7eb 100%);
    
    border-radius: 3px;
    outline: none;
}
.thumbnail-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
}
.thumbnail-slider::-webkit-slider-thumb:hover {
    background: #4338ca;
}

/* --- 強力なブラックリスト用 (完全非表示) --- */
.htf-hidden-strong {
    display: none !important;
}

/* --- Configモーダル: アコーディオンUI --- */
.accordion-item {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 10px;
    overflow: hidden;
}

.accordion-header {
    background-color: #f9fafb;
    padding: 12px 16px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    color: #374151;
    user-select: none;
    transition: background-color 0.2s;
}
.accordion-header:hover {
    background-color: #f3f4f6;
}

/* 展開時のヘッダー色 */
.accordion-item.open .accordion-header {
    background-color: #eef2ff;
    color: #4f46e5;
    border-bottom: 1px solid #e5e7eb;
}

/* 矢印アイコン */
.accordion-arrow {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
    fill: currentColor;
}
.accordion-item.open .accordion-arrow {
    transform: rotate(180deg);
}

/* ★追加: アコーディオンヘッダー内のスイッチ配置用 */
.header-toggle {
    margin-right: 12px;
    display: flex;
    align-items: center;
}

.accordion-content {
    display: none; /* デフォルト非表示 */
    padding: 16px;
    background-color: #fff;
    animation: slideDown 0.2s ease-out;
}
.accordion-item.open .accordion-content {
    display: block; /* 展開時表示 */
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* --- 新規追加: 詳細表示時 (全体ON または 個別ON) はタイトルの折り返しを有効化 --- */
/* 条件: グリッド表示 かつ (全体詳細ON または 個別詳細ON) */
html.htf-show-grid-details .gallery-content.layout-grid h1,
.gallery-content.layout-grid > div.show-local-detail h1 {
    white-space: normal !important; /* 折り返し有効化 */
    overflow: visible !important;   /* 文字が切れないようにする */
    height: auto !important;        /* 高さを自動調整 */
}

        `;
        document.head.appendChild(style);
    }

    // グローバル公開
    window.HitomiFilterUtils = {
        TYPE_BUTTONS,
        LAYOUT_ICONS,
        injectStyles
    };

})(window);
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
        list: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
        compact: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="3" y1="14" x2="21" y2="14"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
        grid: `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
    };

    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
#type-filter-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 20px auto; max-width: 920px; padding: 0 20px; width: 100%; box-sizing: border-box; position: relative; z-index: 10; }
@media (max-width: 768px) { #type-filter-container { gap: 10px; padding: 0 12px; margin: 16px auto; } }
@media (max-width: 480px) { #type-filter-container { gap: 8px; padding: 0 8px; margin: 14px auto; } }
#extra-tools-container { display: flex; justify-content: center; align-items: center; gap: 16px; margin: 0 auto 28px auto; max-width: 920px; padding: 0 20px; width: 100%; box-sizing: border-box; position: relative; z-index: 10; }
@media (max-width: 480px) { #extra-tools-container { gap: 10px; padding: 0 10px; margin-bottom: 20px; flex-wrap: wrap; } }
.type-filter-btn { position: relative; height: 80px; border-radius: 16px; display: flex; flex-direction: column; overflow: visible; user-select: none; cursor: pointer; background: white; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); border: 3px solid transparent; min-width: 0; z-index: 1; }
@media (max-width: 768px) { .type-filter-btn { height: 72px; border-radius: 14px; border: 2.5px solid transparent; } }
@media (max-width: 480px) { .type-filter-btn { height: 60px; border-radius: 12px; border: 2px solid transparent; } }
.type-filter-btn::before { content: ''; position: absolute; inset: 0; border-radius: 13px; padding: 3px; background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
.type-filter-btn:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12); z-index: 20; }
.type-filter-btn:hover::before { opacity: 1; }
@media (hover: none) and (pointer: coarse) { .type-filter-btn:hover { transform: none; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); } .type-filter-btn:hover::before { opacity: 0; } }
.type-filter-btn.state-include { border-color: #10b981; box-shadow: 0 8px 28px rgba(16, 185, 129, 0.25), 0 0 0 4px rgba(16, 185, 129, 0.1); transform: translateY(-2px); }
.type-filter-btn.state-include::after { content: '✓'; position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 16px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 10; }
@media (max-width: 768px) { .type-filter-btn.state-include::after { width: 26px; height: 26px; font-size: 15px; top: -7px; right: -7px; } }
@media (max-width: 480px) { .type-filter-btn.state-include::after { width: 20px; height: 20px; font-size: 12px; top: -5px; right: -5px; } }
.type-filter-btn.state-exclude { border-color: #ef4444; box-shadow: 0 8px 28px rgba(239, 68, 68, 0.25), 0 0 0 4px rgba(239, 68, 68, 0.1); transform: translateY(-2px); opacity: 0.65; filter: grayscale(0.3); }
.type-filter-btn.state-exclude::after { content: '✕'; position: absolute; top: -8px; right: -8px; width: 28px; height: 28px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4); animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); z-index: 10; }
@media (max-width: 768px) { .type-filter-btn.state-exclude::after { width: 26px; height: 26px; font-size: 15px; top: -7px; right: -7px; } }
@media (max-width: 480px) { .type-filter-btn.state-exclude::after { width: 20px; height: 20px; font-size: 12px; top: -5px; right: -5px; } }
@keyframes popIn { 0% { transform: scale(0) rotate(-180deg); opacity: 0; } 50% { transform: scale(1.2) rotate(10deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
.type-filter-btn.state-exclude .btn-label { text-decoration: line-through; text-decoration-color: #ef4444; text-decoration-thickness: 2.5px; opacity: 0.7; }
.btn-content { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; z-index: 2; padding: 12px; }
@media (max-width: 480px) { .btn-content { padding: 8px 4px; } }
.color-indicator { position: absolute; left: 12px; width: 6px; height: 36px; border-radius: 3px; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); }
@media (max-width: 768px) { .color-indicator { left: 10px; width: 5px; height: 30px; } }
@media (max-width: 480px) { .color-indicator { left: 6px; width: 4px; height: 24px; } }
.type-filter-btn:hover .color-indicator { height: 42px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); }
@media (hover: none) and (pointer: coarse) { .type-filter-btn:hover .color-indicator { height: 36px; } }
@media (max-width: 768px) { .type-filter-btn:hover .color-indicator { height: 34px; } }
@media (max-width: 480px) { .type-filter-btn:hover .color-indicator { height: 24px; } }
.action-area { display: flex; height: 44px; border-top: 1px solid rgba(0, 0, 0, 0.06); background: linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.8)); backdrop-filter: blur(10px); border-radius: 0 0 13px 13px; overflow: hidden; }
@media (max-width: 768px) { .action-area { height: 40px; border-radius: 0 0 11px 11px; } }
@media (max-width: 480px) { .action-area { height: 32px; border-radius: 0 0 10px 10px; } }
.click-area { flex: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; gap: 6px; color: rgba(0, 0, 0, 0.45); padding: 8px; min-width: 0; }
@media (max-width: 768px) { .click-area { font-size: 11px; gap: 4px; letter-spacing: 0.3px; } }
@media (max-width: 480px) { .click-area { padding: 0; gap: 0; } .click-area span { display: none; } }
.click-area:hover { background: rgba(255, 255, 255, 0.95); color: rgba(0, 0, 0, 0.7); transform: scale(1.05); z-index: 3; }
@media (hover: none) and (pointer: coarse) { .click-area:hover { background: none; color: rgba(0, 0, 0, 0.45); transform: none; } .click-area:active { background: rgba(0, 0, 0, 0.1); transform: scale(0.97); } }
.click-area:active { transform: scale(0.95); }
.click-area.left { border-right: 1px solid rgba(0, 0, 0, 0.06); }
.type-filter-btn.state-include .click-area.left { background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.25)); color: #059669; }
.type-filter-btn.state-exclude .click-area.right { background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.25)); color: #dc2626; }
.click-area::before { font-size: 16px; font-weight: 900; transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
@media (max-width: 768px) { .click-area::before { font-size: 15px; } }
@media (max-width: 480px) { .click-area::before { font-size: 16px; } }
.click-area.left::before { content: '⊕'; }
.click-area.right::before { content: '⊖'; }
.click-area:hover::before { transform: scale(1.3) rotate(90deg); }
@media (hover: none) and (pointer: coarse) { .click-area:hover::before { transform: none; } .click-area:active::before { transform: scale(1.2); } }
.btn-label { display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', sans-serif; font-weight: 700; font-size: 15px; color: rgba(0, 0, 0, 0.85); letter-spacing: 0.5px; transition: all 0.3s; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8); width: 100%; overflow: hidden; text-overflow: ellipsis; }
@media (max-width: 768px) { .btn-label { font-size: 14px; letter-spacing: 0.3px; } }
@media (max-width: 480px) { .btn-label { font-size: 14px; letter-spacing: 0; } }
.type-filter-btn:hover .btn-label { transform: scale(1.05); }
@media (hover: none) and (pointer: coarse) { .type-filter-btn:hover .btn-label { transform: none; } }
.type-filter-btn.state-include .btn-label, .type-filter-btn.state-exclude .btn-label { font-weight: 800; }
@media (max-width: 480px) { .type-filter-btn.state-include .btn-label, .type-filter-btn.state-exclude .btn-label { font-weight: 700; } }
.tool-btn { background: #ffffff; color: #4b5563; border: 1px solid #e5e7eb; border-radius: 10px; padding: 0 20px; height: 40px; font-size: 13px; font-weight: 700; cursor: pointer; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; white-space: nowrap; transition: all 0.2s ease; flex: 0 1 auto; }
@media (max-width: 480px) { .tool-btn { padding: 0 14px; height: 36px; font-size: 12px; min-width: auto; } }
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
@media (min-width: 481px) { .header-table { display: flex !important; width: 100% !important; max-width: 920px !important; margin: 0 auto 20px auto !important; padding: 0 20px !important; box-sizing: border-box !important; align-items: center !important; flex-wrap: nowrap !important; } .search-input { flex-grow: 1 !important; width: auto !important; margin-right: 8px !important; } #search-button { height: 44px !important; margin: 0 !important; vertical-align: middle !important; cursor: pointer; } }
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
.modal-textarea { width: 100%; height: 100px; border: 1px solid #ccc; border-radius: 6px; padding: 10px; font-family: monospace; font-size: 13px; resize: vertical; box-sizing: border-box; }
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

/* --- レイアウト切替ボタン用 --- */
.layout-btn-wrapper { position: relative; }
.layout-trigger-btn { min-width: 50px; padding: 0 10px; }
.layout-dropdown { display: none; position: absolute; top: calc(100% + 8px); right: 0; background: white; min-width: 160px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-radius: 12px; border: 1px solid #f3f4f6; z-index: 100; padding: 6px; }
.layout-dropdown.show { display: block; }
.layout-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; color: #4b5563; cursor: pointer; border-radius: 6px; transition: background 0.2s; }
.layout-option:hover { background-color: #f9fafb; }
.layout-option.active { background-color: #e0e7ff; color: #4f46e5; font-weight: bold; }
.layout-option svg { flex-shrink: 0; }

/* --- Grid Layout --- */
.gallery-content.layout-grid { display: grid !important; grid-template-columns: repeat(5, 1fr); gap: 15px; padding-bottom: 20px; }
@media (max-width: 1024px) { .gallery-content.layout-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 768px) { .gallery-content.layout-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 480px) { .gallery-content.layout-grid { grid-template-columns: repeat(2, 1fr); } }
.gallery-content.layout-grid > div { width: 100% !important; height: auto !important; min-height: 200px; display: flex; flex-direction: column; border: 1px solid #eee; border-radius: 8px; overflow: hidden; background: #fff; margin: 0 !important; padding: 0 !important; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.gallery-content.layout-grid .dj-img-container { width: 100% !important; height: auto !important; aspect-ratio: 2/3; margin: 0 !important; padding: 0 !important; float: none !important; }
.gallery-content.layout-grid .dj-img1 { width: 100% !important; height: 100% !important; object-fit: cover; }
.gallery-content.layout-grid .dj-content { width: 100% !important; padding: 8px !important; box-sizing: border-box; margin: 0 !important; float: none !important; display: flex; flex-direction: column; gap: 4px; }
.gallery-content.layout-grid h1 { font-size: 13px !important; margin: 0 !important; line-height: 1.3; height: 2.6em; overflow: hidden; }
.gallery-content.layout-grid .artist-list { font-size: 11px !important; margin: 0 !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gallery-content.layout-grid table, .gallery-content.layout-grid .date { display: none !important; }

/* --- Compact Layout --- */
.gallery-content.layout-compact > div { width: 100% !important; height: 110px !important; display: flex !important; flex-direction: row !important; padding: 8px !important; margin-bottom: 8px !important; border: 1px solid #eee; border-radius: 6px; background: #fff; box-sizing: border-box; overflow: hidden; }
.gallery-content.layout-compact .dj-img-container { width: 70px !important; height: 100% !important; margin: 0 10px 0 0 !important; float: none !important; flex-shrink: 0; }
.gallery-content.layout-compact .dj-img1 { width: 100% !important; height: 100% !important; object-fit: cover; border-radius: 4px; }
.gallery-content.layout-compact .dj-content { flex: 1; width: auto !important; margin: 0 !important; padding: 0 !important; float: none !important; display: flex; flex-direction: column; justify-content: space-between; }
.gallery-content.layout-compact h1 { font-size: 14px !important; margin: 0 !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: baseline; gap: 10px; }
.gallery-content.layout-compact h1 a { color: #333; text-decoration: none; }
.gallery-content.layout-compact .artist-list { display: inline-block; font-size: 12px; margin-left: 10px; color: #666; }
.gallery-content.layout-compact table { width: 100%; display: flex; flex-direction: column; gap: 2px; margin: 0 !important; }
.gallery-content.layout-compact tbody, .gallery-content.layout-compact tr { display: contents; }
.gallery-content.layout-compact td { display: inline-block; padding: 0 !important; font-size: 11px; color: #777; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gallery-content.layout-compact td:first-child { display: none; }
.gallery-content.layout-compact .relatedtags { display: block; width: 100%; height: 18px; overflow: hidden; margin-top: 2px; }
.gallery-content.layout-compact .relatedtags ul { display: flex; flex-wrap: wrap; gap: 4px; height: 18px; overflow: hidden; }
.gallery-content.layout-compact .relatedtags li { float: none !important; display: inline-block; }
.gallery-content.layout-compact .relatedtags a { padding: 0 4px; background: #f0f0f0; border-radius: 3px; color: #555; text-decoration: none; }
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
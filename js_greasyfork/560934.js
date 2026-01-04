// ==UserScript==
// @name         115去重
// @namespace    115delete
// @version      1.0
// @description  具备“上帝视角”的副本透视功能。全SVG矢量图标。修复大数精度丢失，优化路径同步逻辑，修复UI卡死问题，新增子目录穿透操作。自动清理剩余唯一文件。修复删除后接口缓存滞后问题，优化黑名单持久化逻辑。新增自定义策略引擎。UI美化与目录构建日志优化。修复UI对齐与模拟逻辑。
// @author       You
// @match        https://115.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560934/115%E5%8E%BB%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/560934/115%E5%8E%BB%E9%87%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top !== window.self) return;

    // ================== SVG 图标定义 (专业版) ==================
    const Icons = {
        folder: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#f8d7da" stroke="#5f6368" stroke-width="1"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#FFD54F" stroke="none"/><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
        file: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#9aa0a6"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
        check: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#1e8e3e"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
        check2: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffffff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
        close: `<svg viewBox="0 0 24 24" width="18" height="18" fill="#5f6368"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
        chevron: `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
        arrowRight: `<svg viewBox="0 0 24 24" width="16" height="16" fill="#5f6368"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`,
        trash: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#d93025"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
        keep: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#137333"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`,
        plus: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#1a73e8"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
        plus2: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#ffffff"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
        play: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d="M8 5v14l11-7z"/></svg>`,
        edit: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#5f6368"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
        delete: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#d93025"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
        up: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#5f6368"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>`,
        down: `<svg viewBox="0 0 24 24" width="14" height="14" fill="#5f6368"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>`
    };

    // ================== 样式定义 (专业版) ==================
    GM_addStyle(`
        /* 基础重置 */
        #dc-root, #dc-modal * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }

        /* 悬浮入口 */
        #dc-entry { position: fixed; top: 10px; right: 160px; z-index: 9999; }
        #dc-entry-btn { background: #1a73e8; color: #fff; border: none; padding: 7px 16px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; box-shadow: 0 2px 6px rgba(0,0,0,0.2); transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
        #dc-entry-btn:hover { background: #1557b0; }

        /* 主弹窗 (修改部分：适配屏幕宽度) */
        #dc-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; backdrop-filter: blur(2px); }
        #dc-panel {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 90vw;            /* 修改：使用视口宽度百分比 */
            max-width: 1450px;      /* 修改：限制最大宽度，防止大屏过宽 */
            min-width: 980px;       /* 修改：限制最小宽度，防止内容挤压 */
            height: 90vh;           /* 修改：高度也稍微适配一下 */
            background: #fff;
            display: flex;
            flex-direction: column;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            border-radius: 8px;
            overflow: hidden;
        }

        /* Header */
        .dc-header { height: 56px; background: #fff; border-bottom: 1px solid #dadce0; display: flex; align-items: center; padding: 0 24px; }
        .dc-brand { font-size: 16px; font-weight: 500; color: #202124; margin-right: 48px; display: flex; align-items: center; gap: 8px; }
        .dc-tabs { display: flex; height: 100%; gap: 8px; }
        .dc-tab { padding: 0 16px; height: 100%; display: flex; align-items: center; cursor: pointer; font-size: 14px; color: #5f6368; border-bottom: 3px solid transparent; transition: 0.2s; font-weight: 500; }
        .dc-tab:hover { color: #202124; background: #f1f3f4; }
        .dc-tab.active { border-bottom-color: #1a73e8; color: #1a73e8; }
        .dc-close { margin-left: auto; cursor: pointer; border: none; background: transparent; display: flex; align-items: center; padding: 8px; border-radius: 50%; }
        .dc-close:hover { background: #f1f3f4; }

        /* Body Layout */
        .dc-body { flex: 1; display: none; padding: 0; overflow: hidden; background: #fff; }
        .dc-body.active { display: flex; }
        .dc-tree-panel { width: 360px; background: #f8f9fa; border-right: 1px solid #dadce0; overflow-y: auto; overflow-x: auto; flex-shrink: 0; /* 防止侧边栏被挤压 */ }
        .dc-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .dc-list-content { flex: 1; overflow-y: auto; background: #fff; }

        /* Toolbar (专业版布局) */
        .dc-toolbar { padding: 12px 24px; border-bottom: 1px solid #dadce0; background: #fff; display: flex; flex-direction: column; gap: 12px; height: auto; min-height: 80px; }
        .dc-toolbar-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .dc-toolbar-group { display: flex; align-items: center; gap: 8px; }
        .dc-label { font-size: 12px; color: #5f6368; font-weight: 500; margin-right: 8px; }

        /* Buttons */
        .dc-btn { padding: 8px 16px; border: 1px solid #dadce0; background: #fff; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; color: #3c4043; transition: 0.1s; }
        .dc-btn:hover { background: #f1f3f4; border-color: #dadce0; }
        .dc-btn.primary { background: #1a73e8; color: #fff; border: none; }
        .dc-btn.primary:hover { background: #1557b0; }
        .dc-btn.danger { background: #d93025; color: #fff; border: none; }
        .dc-btn.danger:hover { background: #b31412; }
        .dc-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .dc-btn-sm { padding: 4px 12px; font-size: 12px; border-radius: 4px; border: 1px solid #dadce0; background: #fff; cursor: pointer; font-weight: 500; color: #3c4043; display: inline-flex; align-items: center; justify-content: center; gap: 4px; vertical-align: middle; line-height: 1.2; height: 30px;}
        .dc-btn-sm:hover { background: #f8f9fa; border-color: #bdc1c6; }
        .dc-btn-sm.primary { background: #1a73e8; color: #fff; border: none; }
        .dc-btn-sm.primary:hover { background: #1557b0; }
        .dc-btn-sm.danger { background: #d93025; color: #fff; border: none; }
        .dc-btn-sm.danger:hover { background: #b31412; }

        /* Tree Node Styles */
        .dc-tree-node { position: relative; width: 100%; }
        .dc-tree-content { display: flex; align-items: center; padding: 6px 12px; cursor: pointer; border-radius: 0 16px 16px 0; margin-right: 12px; font-size: 13px; color: #3c4043; white-space: nowrap; width: fit-content; min-width: 100%; user-select: none;  }
        .dc-tree-content:hover { background: #e8eaed; }
        .dc-tree-content.active { background: #e8f0fe; color: #1967d2; font-weight: 500; }
        .dc-tree-icon { display: flex; align-items: center; margin-right: 8px; }
        .dc-tree-label { flex: 1; white-space: nowrap; }
        .dc-tree-badge { font-size: 11px; background: #f1f3f4; color: #5f6368; padding: 0 6px; border-radius: 4px; margin-left: 8px; font-family: 'Consolas', monospace; min-width: 32px; text-align: center; font-weight: bold; }
        .dc-tree-badge.has-dup { background: #fce8e6; color: #c5221f; }
        .dc-tree-top-bar { padding: 8px 16px; border-bottom: 1px solid #dadce0; display: flex; gap: 8px; background: #fff; position: sticky; z-index: 10;}
        .dc-tree-toggle { width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #5f6368; transition: transform 0.2s; flex-shrink: 0; }
        .dc-tree-toggle:hover { background: #e8eaed; border-radius: 4px; }
        .dc-tree-toggle.collapsed { transform: rotate(0deg); }
        .dc-tree-toggle.expanded { transform: rotate(90deg); }
        .dc-tree-children { display: block; padding-left: 5px; border-left: 1px solid #e0e0e0; margin-left: 5px; }
        .dc-tree-children.collapsed { display: none; }
        .dc-tree-loading-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 0; color: #5f6368; font-size: 13px; }
        .dc-loading-spinner { width: 26px; height: 26px; border: 3px solid #f3f3f3; border-top: 3px solid #1a73e8; border-radius: 50%; animation: dc-spin 0.8s linear infinite; margin-bottom: 12px; }
        @keyframes dc-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .dc-tree-loading-icon { width: 12px; height: 12px; border: 2px solid #ddd; border-top-color: #1a73e8; border-radius: 50%; animation: dc-spin 0.6s linear infinite; display: none; margin-left: 8px; flex-shrink: 0;}
        .dc-tree-content.loading .dc-tree-loading-icon { display: inline-block; }
        .dc-tree-content.master-folder { border-left: 4px solid #1e8e3e !important; background: #e6f4ea !important; }
        .dc-tree-content.master-folder .dc-tree-label { color: #137333; font-weight: bold; }
        .dc-tree-status-dot { width: 8px; height: 8px; border-radius: 50%; margin-left: auto; margin-right: 8px; flex-shrink: 0; }
        .dot-none { background: #dadce0; } .dot-all { background: #d93025; } .dot-keep { background: #1e8e3e; } .dot-mix { background: #f9ab00; }

        /* Progress Bar */
        .dc-progress { height: 3px; background: #e8eaed; width: 100%; }
        .dc-bar { height: 100%; background: #1a73e8; width: 0%; transition: width 0.2s; }

        /* Terminal */
        #dc-terminal { height: 120px; background: #202124; border-top: 1px solid #3c4043; padding: 8px 16px; overflow-y: auto; font-family: 'Consolas', monospace; font-size: 11px; color: #bdc1c6; scroll-behavior: smooth; }
        .log-info { color: #8ab4f8; } .log-success { color: #81c995; } .log-warn { color: #fdd663; } .log-err { color: #f28b82; }
        .live-item { padding: 4px 8px; border-bottom: 1px solid #f1f3f4; font-size:12px; display:flex; justify-content:space-between; }

        /* Tooltip */
        #dc-tooltip { position: fixed; display: none; z-index: 20000; background: rgba(32, 33, 36, 0.95); color: #fff; padding: 12px; border-radius: 8px; font-size: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); pointer-events: none; max-width: 500px; line-height: 1.5; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); }

        /* ========== 列表视图专业版样式 ========== */
        .dc-row-wrapper { border-bottom: 1px solid #f1f3f4; }

        /* 主行 (本目录文件) */
        .dc-row-main {
            display: flex; align-items: center; padding: 8px 16px;
            background: #fff; transition: background 0.1s; cursor: pointer;
            height: 44px;
        }
        .dc-row-main:hover { background: #f8f9fa; }

        /* 展开箭头 */
        .dc-toggle-btn {
            width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
            cursor: pointer; border-radius: 4px; color: #5f6368; transition: transform 0.2s, background 0.2s;
            margin-right: 4px;
        }
        .dc-toggle-btn:hover { background: #f1f3f4; }
        .dc-toggle-btn.expanded { transform: rotate(90deg); }
        .dc-toggle-btn.hidden { visibility: hidden; pointer-events: none; }

        /* 状态徽章 (Keep/Del) */
        .dc-status-badge {
            display: flex; align-items: center; gap: 4px; padding: 2px 8px;
            border-radius: 12px; font-size: 11px; font-weight: 600;
            width: 70px; justify-content: center; margin-right: 12px;
            user-select: none; transition: 0.2s; border: 1px solid transparent;
        }
        .status-keep { background: #e6f4ea; color: #137333; border-color: #ceead6; }
        .status-del  { background: #fce8e6; color: #c5221f; border-color: #fad2cf; }
        .dc-status-badge:hover { filter: brightness(0.95); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

        /* 子列表 (外部副本) */
        .dc-sub-list { display: none; flex-direction: column; background: #fafafa; position: relative; }
        .dc-sub-list.expanded { display: flex; }
        .dc-sub-list::before {
            content: ''; position: absolute; top: 0; bottom: 12px; left: 27px;
            width: 1px; background: #dadce0;
        }

        /* 子行样式 */
        .dc-sub-row {
            display: flex; align-items: center; padding: 6px 16px 6px 48px;
            position: relative; cursor: pointer; height: 36px;
        }
        .dc-sub-row:hover { background: #f1f3f4; }
        .dc-sub-row::before {
            content: ''; position: absolute; left: 27px; top: -18px; bottom: 18px;
            width: 12px; border-left: 1px solid #dadce0; border-bottom: 1px solid #dadce0;
            border-bottom-left-radius: 4px; height: 36px; pointer-events: none;
        }

        /* 文本排版 */
        .file-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
        .file-name { font-size: 13px; color: #202124; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .file-meta { font-size: 11px; color: #5f6368; font-family: 'Consolas', monospace; display: flex; gap: 8px; margin-top: 2px; }

        .path-info { flex: 1; overflow: hidden; display: flex; align-items: center; font-size: 12px; color: #444; }
        .path-text { margin-left: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Segoe UI', sans-serif; color: #5f6368; }
         /* 新增：下拉菜单样式 */
        .dc-dropdown { position: relative; display: inline-block; }
        .dc-dropdown-btn {
            padding: 5px 12px; font-size: 11px; font-weight: 500;
            background: #1a73e8; color: #fff; border: none; border-radius: 4px;
            cursor: pointer; display: flex; align-items: center; gap: 6px;
            transition: background 0.2s;
        }
        .dc-dropdown-btn:hover { background: #1557b0; }

        .dc-dropdown-content {
            display: none; position: absolute; top: 100%;
            background-color: #fff; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            border: 1px solid #dadce0; border-radius: 4px;
            z-index: 99999; /* 极大值，确保浮在所有内容上面 */
            min-width: 180px; margin-top: 0;
        }
        /* 增加一个透明桥梁，防止鼠标快速移动时断触 */
        .dc-dropdown-content::before {
            content: ''; position: absolute; top: -10px; left: 0; width: 100%; height: 10px;
        }

        .dc-dropdown:hover .dc-dropdown-content { display: block; }

        .dc-dropdown-item {
            padding: 10px 16px; font-size: 12px; color: #3c4043;
            cursor: pointer; transition: background 0.1s; border-bottom: 1px solid #f1f3f4;
            display: block; text-align: left;
        }
        .dc-dropdown-item:last-child { border-bottom: none; }
        .dc-dropdown-item:hover { background-color: #e8f0fe; color: #1a73e8; }

        /* 1.5版本新增：链接样式 */
        .dc-link { color: #5f6368; text-decoration: none; transition: color 0.2s; cursor: pointer; }
        .dc-link:hover { color: #1a73e8; text-decoration: underline; }
        .dc-sub-row .path-text a { color: #5f6368; text-decoration: none; }
        .dc-sub-row .path-text a:hover { color: #1a73e8; text-decoration: underline; }

        /* ================== 1.7版本美化：策略管理界面样式 ================== */
        .strat-container { display: flex; flex: 1; height: 100%; overflow: hidden; background: #fff; }
        .strat-sidebar { width: 260px; border-right: 1px solid #dadce0; display: flex; flex-direction: column; background: #f8f9fa; padding: 12px; }
        .strat-list { flex: 1; overflow-y: auto; margin-top: 8px; }
        /* 修复2: 移除过渡动画，防止跳动；使用相对定位以支持绝对定位的子元素 */
        .strat-item { position: relative; padding: 10px 12px; cursor: pointer; border-radius: 6px; font-size: 13px; color: #3c4043; display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; border: 1px solid transparent; min-height: 40px; }
        .strat-item:hover { background: #e8eaed; }
        .strat-item.active { background: #e8f0fe; color: #1967d2; border-color: #d2e3fc; font-weight: 500; }
        /* 修复2: 使用绝对定位固定操作按钮，防止挤压文字导致布局跳动 */
        .strat-item-actions { display: none; position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: rgba(232,234,237,0.9); padding-left: 4px; border-radius: 4px; }
        .strat-item:hover .strat-item-actions { display: flex; gap: 4px; }

        .strat-editor { flex: 1; display: flex; flex-direction: column; background: #fff; overflow: hidden; }
        .strat-header { padding: 16px 24px; border-bottom: 1px solid #dadce0; display: flex; align-items: center; justify-content: space-between; background: #fff; height: 60px; flex-shrink: 0; }
        .strat-title-input { font-size: 15px; padding: 6px 12px; border: 1px solid #dadce0; border-radius: 4px; width: 250px; outline: none; transition: 0.2s; }
        .strat-title-input:focus { border-color: #1a73e8; box-shadow: 0 0 0 2px rgba(26,115,232,0.2); }

        .rule-list { flex: 1; overflow-y: auto; padding: 20px; background: #fff; }
        .rule-row { background: #fff; border: 1px solid #dadce0; border-radius: 8px; padding: 12px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: 0.2s; }
        .rule-row:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-color: #bdc1c6; }
        .rule-drag { cursor: grab; color: #9aa0a6; display: flex; align-items: center; }
        .rule-idx { font-family: 'Consolas', monospace; font-size: 12px; color: #9aa0a6; width: 24px; font-weight: bold; }
        .rule-select { padding: 6px 8px; border: 1px solid #dadce0; border-radius: 4px; font-size: 13px; color: #202124; outline: none; min-width: 140px; background-color: #f8f9fa; }
        .rule-input { padding: 6px 10px; border: 1px solid #dadce0; border-radius: 4px; font-size: 13px; color: #202124; outline: none; flex: 1; }
        .rule-input:focus { border-color: #1a73e8; }
        .rule-actions { display: flex; gap: 4px; margin-left: auto; }
        .rule-btn { width: 28px; height: 28px; border-radius: 4px; border: none; background: transparent; cursor: pointer; color: #5f6368; display: flex; align-items: center; justify-content: center; transition: 0.1s; }
        .rule-btn:hover { background: #f1f3f4; color: #202124; }
        .rule-btn.danger:hover { background: #fce8e6; color: #d93025; }

        .sim-box { height: 180px; border-top: 1px solid #dadce0; background: #f8f9fa; padding: 16px; overflow-y: auto; flex-shrink: 0; font-size: 12px; font-family: 'Consolas', monospace; }
        .sim-result-row { margin-bottom: 4px; display: flex; gap: 8px; }
        .sim-tag { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; min-width: 40px; text-align: center; }
        .sim-win { background: #e6f4ea; color: #137333; }
        .sim-lose { background: #fce8e6; color: #c5221f; }
        .sim-info { color: #5f6368; }
    `);

    // ================== 配置 & DB ==================
    const Config = {
        apiDelayMin: GM_getValue('apiDelayMin', 2000),
        apiDelayMax: GM_getValue('apiDelayMax', 3000),
        batchSize: GM_getValue('batchSize', 1000),
        deleteBatchSize: GM_getValue('deleteBatchSize', 500),
        save: function() {
            GM_setValue('apiDelayMin', this.apiDelayMin);
            GM_setValue('apiDelayMax', this.apiDelayMax);
            GM_setValue('batchSize', this.batchSize);
            GM_setValue('deleteBatchSize', this.deleteBatchSize);
            log("✅ 配置已保存", "success");
            alert("配置已保存");
        }
    };

    // 1.6新增：策略存储管理
    const StrategyStore = {
        getAll: () => GM_getValue('saved_strategies', []),
        saveAll: (list) => GM_setValue('saved_strategies', list),
        add: (strat) => {
            const list = StrategyStore.getAll();
            list.push(strat);
            StrategyStore.saveAll(list);
        },
        update: (strat) => {
            const list = StrategyStore.getAll();
            const idx = list.findIndex(s => s.id === strat.id);
            if(idx >= 0) { list[idx] = strat; StrategyStore.saveAll(list); }
        },
        delete: (id) => {
            const list = StrategyStore.getAll().filter(s => s.id !== id);
            StrategyStore.saveAll(list);
        }
    };

    const DB = {
        name: "115DupGod_DB",
        version: 2, // 【修改】版本号升级为 2
        db: null,
        init: () => new Promise((resolve, reject) => {
            const req = indexedDB.open(DB.name, DB.version);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                // 现有的仓库
                if (!db.objectStoreNames.contains('files')) db.createObjectStore('files', { keyPath: "file_id" });
                if (!db.objectStoreNames.contains('folders')) db.createObjectStore('folders', { keyPath: "cid" });

                // 【新增】创建黑名单仓库 history
                if (!db.objectStoreNames.contains('history')) db.createObjectStore('history', { keyPath: "file_id" });
            };
            req.onsuccess = (e) => {
                DB.db = e.target.result;
                log("IndexedDB 数据库连接成功", "success");
                resolve();
            };
            req.onerror = (e) => { log("IndexedDB 连接失败", "error"); reject(e); };
        }),
        putBatch: (store, items) => new Promise((resolve) => {
            if (!items.length) return resolve();
            const tx = DB.db.transaction([store], "readwrite");
            const os = tx.objectStore(store);
            items.forEach(i => os.put(i));
            tx.oncomplete = resolve;
            tx.onerror = (e) => log(`DB Write Error: ${e.target.error}`, "error");
        }),
        deleteBatch: (store, keys) => new Promise((resolve) => {
            if (!keys.length) return resolve();
            const tx = DB.db.transaction([store], "readwrite");
            const os = tx.objectStore(store);
            keys.forEach(k => os.delete(k));
            tx.oncomplete = resolve;
            tx.onerror = (e) => log(`DB Delete Error: ${e.target.error}`, "error");
        }),
        getAll: (store) => new Promise((resolve) => {
            const tx = DB.db.transaction([store], "readonly");
            tx.objectStore(store).getAll().onsuccess = (e) => resolve(e.target.result);
        }),
        clear: (store) => new Promise((resolve, reject) => {
            if (!DB.db) {
                log("数据库未连接，无法清空", "error");
                return reject("No DB");
            }
            try {
                const tx = DB.db.transaction([store], "readwrite");
                tx.objectStore(store).clear(); // 清空当前 store
                tx.oncomplete = () => resolve();
                tx.onerror = (e) => {
                    log(`清空 ${store} 失败: ${e.target.error}`, "error");
                    reject(e);
                };
            } catch (err) {
                reject(err);
            }
        })
    };

    const state = {
        files: [], folders: {}, groups: {}, folderGroups: {},
        isRunning: false, currentViewCid: null,
        deletedHistory: new Set(), // 【新增】记录本次会话已删除的ID，防止同步时服务器诈尸
        nodeMap: {}, // 【新增】快速索引树节点，用于生成面包屑导航
        editingStrat: null // 1.6新增：当前正在编辑的策略
    };

    // ================== 工具函数 ==================
    function parseJSONSafe(text) {
        if (!text) return null;
        const trimmed = text.trim();
        if (trimmed.startsWith('<')) {
            log("🚫 触发系统限制：服务器返回了 HTML 页面而非数据，请稍后再试或手动过滑块。", "error");
            return { _errorType: 'HTML_ERROR' };
        }
        try {
            const fixedText = trimmed.replace(/:\s*(\d{16,})/g, ':"$1"');
            return JSON.parse(fixedText);
        } catch (e) {
            log("❌ JSON 语法错误: " + e.message, "error");
            return null;
        }
    }

    function log(msg, type = 'normal') {
        const consolePrefix = `[115GodMode] `;
        if(type === 'error') console.error(consolePrefix + msg);
        else if(type === 'warn') console.warn(consolePrefix + msg);
        else console.log(consolePrefix + msg);

        const term = document.getElementById('dc-terminal');
        if(term) {
            const d = document.createElement('div');
            const time = new Date().toLocaleTimeString('en-GB');
            let colorClass = '';
            if(type === 'info') colorClass = 'log-info';
            if(type === 'success') colorClass = 'log-success';
            if(type === 'warn') colorClass = 'log-warn';
            if(type === 'error') colorClass = 'log-err';
            d.innerHTML = `<span style="color:#5f6368">[${time}]</span> <span class="${colorClass}">${msg}</span>`;
            term.appendChild(d);
            term.scrollTop = term.scrollHeight;
        }
    }

    // ================== UI 初始化 ==================
    function initUI() {
        const entry = document.createElement('div');
        entry.id = 'dc-entry';
        entry.innerHTML = `<button id="dc-entry-btn">${Icons.check2} 去重</button>`;
        document.body.appendChild(entry);

        const modal = document.createElement('div');
        modal.id = 'dc-modal';
        modal.innerHTML = `
            <div id="dc-panel">
                <div class="dc-header">
                    <div class="dc-brand">${Icons.folder} 115去重</div>
                    <div class="dc-tabs">
                        <div class="dc-tab active" data-target="tab-data">数据中心</div>
                        <div class="dc-tab" data-target="tab-tree">目录树视图</div>
                        <div class="dc-tab" data-target="tab-strat">策略管理</div>
                        <div class="dc-tab" data-target="tab-settings">参数设置</div>
                        <div class="dc-tab" data-target="tab-exec" style="color:#d93025;">执行删除</div>
                    </div>
                    <button class="dc-close" id="btn-close">${Icons.close}</button>
                </div>
                <div class="dc-progress"><div class="dc-bar" id="p-bar"></div></div>

                <div class="dc-body active" id="tab-data">
                    <div class="dc-tree-panel" style="width:300px;">
                        <div style="padding:16px;">
                            <div style="font-weight:600; margin-bottom:16px; color:#202124;">数据同步</div>
                            <div style="font-size:13px; margin-bottom:8px; color:#5f6368;">文件缓存: <b id="st-files" style="color:#202124;">0</b></div>
                            <div style="font-size:13px; margin-bottom:24px; color:#5f6368;">路径节点: <b id="st-folders" style="color:#202124;">0</b></div>
                            <button class="dc-btn primary" id="btn-sync-files" style="width:100%">A. 同步文件</button>
                            <button class="dc-btn" id="btn-sync-paths" style="width:100%; margin-top:8px;">B. 构建目录树</button>
                            <button class="dc-btn" id="btn-clean-unique" style="width:100%; margin-top:8px; color:#1a73e8;">C. 清理已去重项</button>
                            <button class="dc-btn" id="btn-reset" style="width:100%; margin-top:8px; color:#d93025;">清空缓存</button>
                        </div>
                    </div>
                    <div class="dc-main">
                        <div class="dc-toolbar"><span>数据抓取实时流</span></div>
                        <div id="live-list" class="dc-list-content" style="padding:0; background:#fff;">
                            <div style="padding:40px; color:#bdc1c6; text-align:center;">
                                点击左侧按钮开始同步，此处将显示实时API数据...
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dc-body" id="tab-tree">
                    <div class="dc-tree-panel" id="tree-container">
                        <div style="padding:40px; text-align:center; color:#5f6368;">请先在 [数据中心] 完成同步</div>
                    </div>
                    <div class="dc-main">
                        <!-- Toolbar 初始状态，点击文件夹后会被 showFolderDetails 覆盖 -->
                        <div class="dc-toolbar">
                            <div style="display:flex;align-items:center;">
                                <span style="color:#5f6368;margin-right:8px;">当前目录:</span>
                                <span id="tree-path-view" style="font-weight:600; font-family:'Consolas',monospace;">-</span>
                            </div>
                        </div>
                        <div class="dc-list-content" id="tree-file-list"></div>
                    </div>
                </div>

                <div class="dc-body" id="tab-strat">
                    <div class="strat-container">
                        <div class="strat-sidebar">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                                <span style="font-weight:600;font-size:13px;">我的策略</span>
                                <button class="dc-btn-sm primary" id="btn-add-strat">${Icons.plus2} 新建</button>
                            </div>
                            <div id="strat-list-container" class="strat-list">
                                <!-- 策略列表 -->
                            </div>
                        </div>
                        <div class="strat-editor" id="strat-editor-panel" style="display:none;">
                            <div class="strat-header">
                                <input type="text" id="strat-title-input" class="strat-title-input" placeholder="策略名称">
                                <div style="display:flex;gap:8px;">
                                    <button class="dc-btn-sm" id="btn-add-rule">${Icons.plus} 添加规则</button>
                                    <button class="dc-btn-sm primary" id="btn-sim-strat">${Icons.play} 随机模拟</button>
                                    <button class="dc-btn-sm" id="btn-save-strat">保存策略</button>
                                </div>
                            </div>
                            <div class="rule-list" id="rule-list-container">
                                <!-- 规则编辑器 -->
                            </div>
                            <div class="sim-box" id="sim-box-result">
                                <div style="color:#999;text-align:center;padding-top:40px;">点击 [随机模拟] 测试当前规则对文件的筛选效果</div>
                            </div>
                        </div>
                        <div id="strat-empty-state" style="flex:1;display:flex;align-items:center;justify-content:center;color:#999;">
                            请在左侧选择或新建策略
                        </div>
                    </div>
                </div>

                <div class="dc-body" id="tab-settings">
                    <div class="dc-main" style="padding:40px; align-items:center;">
                        <div style="width:400px; padding:24px; border:1px solid #dadce0; border-radius:8px;">
                            <h3 style="margin-top:0; color:#202124;">API 参数配置</h3>

                            <label style="display:block;margin-top:16px;font-size:12px;color:#5f6368;">数据抓取-最小延迟(ms)</label>
                            <input type="number" id="cfg-min" value="${Config.apiDelayMin}" style="width:100%;padding:6px;border:1px solid #dadce0;border-radius:4px;margin-top:4px;">

                            <label style="display:block;margin-top:16px;font-size:12px;color:#5f6368;">数据抓取-单次拉取数量</label>
                            <input type="number" id="cfg-batch" value="${Config.batchSize}" style="width:100%;padding:6px;border:1px solid #dadce0;border-radius:4px;margin-top:4px;">

                            <!-- 新增：删除批次大小设置 -->
                            <label style="display:block;margin-top:16px;font-size:12px;color:#d93025;font-weight:bold;">批量删除-单次提交数量 (建议50-100)</label>
                            <input type="number" id="cfg-del-batch" value="${Config.deleteBatchSize}" style="width:100%;padding:6px;border:1px solid #d93025;border-radius:4px;margin-top:4px;">

                            <button class="dc-btn primary" id="btn-save-cfg" style="width:100%; margin-top:24px;">保存配置</button>

                            <!-- 新增：专门用于清空黑名单的按钮 -->
                            <button class="dc-btn danger" id="btn-clear-history" style="width:100%; margin-top:24px;">清空已删除记录(黑名单)</button>
                            <div style="font-size:11px; color:#999; margin-top:8px;">* 仅当你需要找回误删文件时使用</div>
                        </div>
                    </div>
                </div>

                <div class="dc-body" id="tab-exec">
                    <div class="dc-main" style="justify-content:center; align-items:center;">
                        <div style="text-align:center; padding:48px; border:1px solid #f28b82; background:#fce8e6; border-radius:8px; width:500px;">
                            <h2 style="color:#c5221f; margin-top:0;">危险操作确认</h2>
                            <p style="font-size:16px; color:#202124;">当前标记为删除的文件总数:</p>
                            <b id="st-del-final" style="font-size:48px; color:#c5221f;">0</b>
                            <div style="margin-top:32px;">
                                <button class="dc-btn danger" id="btn-exec" style="padding:10px 24px; font-size:14px;">确认并开始删除</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="dc-terminal"></div>
                <div id="dc-tooltip"></div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('dc-entry-btn').onclick = async () => {
            document.getElementById('dc-modal').style.display = 'block';
            log("初始化数据库连接...", "info");
            await DB.init();
            refreshStats();
        };
        document.getElementById('btn-close').onclick = () => document.getElementById('dc-modal').style.display = 'none';

        // 【修改点：增强 Tab 切换逻辑，确保统计数据同步】
        document.querySelectorAll('.dc-tab').forEach(t => t.onclick = () => {
            document.querySelectorAll('.dc-tab').forEach(x => x.classList.remove('active'));
            document.querySelectorAll('.dc-body').forEach(x => x.classList.remove('active'));
            t.classList.add('active');
            document.getElementById(t.dataset.target).classList.add('active');

            if(t.dataset.target === 'tab-data') refreshStats(); // 切换回数据中心时刷新统计
            if(t.dataset.target === 'tab-tree') buildAndRenderTree(); // 切换到目录树时重建索引
            if(t.dataset.target === 'tab-strat') renderStratList(); // 1.6新增：切换到策略页刷新列表
            if(t.dataset.target === 'tab-exec') updateFinalCount(); // 切换到删除页时重新计算
        });

        document.getElementById('btn-sync-files').onclick = toggleSyncFiles;
        document.getElementById('btn-sync-paths').onclick = toggleSyncPaths;
        document.getElementById('btn-clean-unique').onclick = cleanUniqueFiles; // 新增绑定
        document.getElementById('btn-reset').onclick = clearDB;
        document.getElementById('btn-exec').onclick = toggleExecute;

        // 新增：清空黑名单绑定
        document.getElementById('btn-clear-history').onclick = async () => {
            if(!confirm("⚠️ 确定要清空【已删除记录(黑名单)】吗？\n\n清空后，如果服务器同步延迟，刚才删除的文件可能会再次出现在列表中。")) return;
            try {
                await DB.clear('history');
                state.deletedHistory = new Set();
                log("🗑️ 黑名单已清空。", "warn");
                alert("黑名单已清空");
            } catch(e) { log("清空黑名单失败:" + e, "error"); }
        };

        document.getElementById('btn-save-cfg').onclick = () => {
            Config.apiDelayMin = parseInt(document.getElementById('cfg-min').value);
            // Config.apiDelayMax = ... (如果没用到可以不管)
            Config.batchSize = parseInt(document.getElementById('cfg-batch').value);

            // 保存删除批次大小
            Config.deleteBatchSize = parseInt(document.getElementById('cfg-del-batch').value);

            Config.save(); // 这里会调用 GM_setValue 保存到油猴存储
        };

        // 1.6新增：策略管理事件绑定
        document.getElementById('btn-add-strat').onclick = () => {
            const newStrat = { id: Date.now(), name: '新策略 ' + new Date().toLocaleTimeString(), rules: [] };
            StrategyStore.add(newStrat);
            renderStratList();
            loadStratEditor(newStrat);
        };
        document.getElementById('btn-save-strat').onclick = () => {
            if(state.editingStrat) {
                state.editingStrat.name = document.getElementById('strat-title-input').value || '未命名策略';
                StrategyStore.update(state.editingStrat);
                renderStratList();
                alert('策略已保存');
            }
        };
        document.getElementById('btn-add-rule').onclick = () => {
            if(state.editingStrat) {
                state.editingStrat.rules.push({ type: 'path_contain', value: '', action: 'prefer' });
                renderRuleList();
            }
        };
        document.getElementById('btn-sim-strat').onclick = simulateStrategy;
    }

    // ================== 1.6新增：策略引擎核心逻辑 ==================

    // 规则定义字典
    const RuleDefs = {
        'path_contain': { name: '路径包含 (文本)', hasInput: true, placeholder: '例如: /Backup/' },
        'path_regex': { name: '路径匹配 (正则)', hasInput: true, placeholder: '例如: ^/Main/.*' },
        'name_contain': { name: '文件名包含', hasInput: true, placeholder: '例如: Copy' },
        'name_regex': { name: '文件名匹配 (正则)', hasInput: true, placeholder: '例如: \\(1\\)' },
        'time_newest': { name: '保留上传时间最新的', hasInput: false },
        'time_oldest': { name: '保留上传时间最早的', hasInput: false },
        'path_shortest': { name: '保留路径最短的', hasInput: false },
        'is_master': { name: '位于当前查看目录内', hasInput: false }
    };

    function StrategyEngine(strategy, filesGroup, currentContextCid) {
        // 1. 初始候选人：全员
        let candidates = [...filesGroup];
        const logTrace = []; // 用于记录筛选过程

        logTrace.push(`初始文件数: ${candidates.length}`);

        // 2. 流水线处理
        for (let i = 0; i < strategy.rules.length; i++) {
            if (candidates.length <= 1) break; // 已决出胜负

            const rule = strategy.rules[i];
            const def = RuleDefs[rule.type];
            if (!def) continue;

            let filtered = [];
            let reason = '';

            // 规则逻辑分支
            if (rule.type === 'path_contain') {
                if(!rule.value) continue;
                // 修复逻辑：去除首尾空格，并转为小写进行比较，提高匹配命中率
                const val = String(rule.value).trim().toLowerCase();
                if(!val) continue;
                filtered = candidates.filter(f => (state.folders[f.parent_id] || '').toLowerCase().includes(val));
                reason = `路径包含 "${rule.value}"`;
            } else if (rule.type === 'path_regex') {
                if(!rule.value) continue;
                try {
                    const re = new RegExp(rule.value);
                    filtered = candidates.filter(f => re.test(state.folders[f.parent_id] || ''));
                    reason = `路径正则 /${rule.value}/`;
                } catch(e) { reason = '正则错误'; }
            } else if (rule.type === 'name_contain') {
                if(!rule.value) continue;
                // 修复逻辑：去除首尾空格，并转为小写进行比较
                const val = String(rule.value).trim().toLowerCase();
                if(!val) continue;
                filtered = candidates.filter(f => (f.file_name || '').toLowerCase().includes(val));
                reason = `文件名包含 "${rule.value}"`;
            } else if (rule.type === 'name_regex') {
                if(!rule.value) continue;
                try {
                    const re = new RegExp(rule.value);
                    filtered = candidates.filter(f => re.test(f.file_name));
                    reason = `文件名正则 /${rule.value}/`;
                } catch(e) { reason = '正则错误'; }
            } else if (rule.type === 'time_newest') {
                const maxTime = Math.max(...candidates.map(f => f.user_utime || 0));
                filtered = candidates.filter(f => (f.user_utime || 0) === maxTime);
                reason = `时间最新`;
            } else if (rule.type === 'time_oldest') {
                const minTime = Math.min(...candidates.map(f => f.user_utime || 0));
                filtered = candidates.filter(f => (f.user_utime || 0) === minTime);
                reason = `时间最早`;
            } else if (rule.type === 'path_shortest') {
                const minLen = Math.min(...candidates.map(f => (state.folders[f.parent_id] || '').length));
                filtered = candidates.filter(f => (state.folders[f.parent_id] || '').length === minLen);
                reason = `路径最短`;
            } else if (rule.type === 'is_master') {
                if(currentContextCid) {
                    filtered = candidates.filter(f => String(f.parent_id) === String(currentContextCid));
                    reason = `位于当前目录`;
                }
            }

            // 容错处理：如果筛选结果为空（所有人都被筛掉了），则该规则失效，全员晋级下一轮
            if (filtered.length === 0) {
                logTrace.push(`[规则${i+1}] ${def.name}: 无匹配项 (跳过)`);
            } else if (filtered.length === candidates.length) {
                logTrace.push(`[规则${i+1}] ${def.name}: 全员命中 (无区分)`);
            } else {
                candidates = filtered;
                logTrace.push(`[规则${i+1}] ${def.name} (${reason}): 剩余 ${candidates.length} 个`);
            }
        }

        // 3. 最终裁决：如果还剩多个，默认取第一个（通常是索引靠前的）
        return { winner: candidates[0], trace: logTrace };
    }

    function renderStratList() {
        const list = StrategyStore.getAll();
        const container = document.getElementById('strat-list-container');
        container.innerHTML = '';
        list.forEach(s => {
            const div = document.createElement('div');
            div.className = 'strat-item ' + (state.editingStrat && state.editingStrat.id === s.id ? 'active' : '');
            div.innerHTML = `
                <span>${s.name}</span>
                <div class="strat-item-actions">
                    <div class="rule-btn" data-action="edit">${Icons.edit}</div>
                    <div class="rule-btn danger" data-action="del">${Icons.delete}</div>
                </div>
            `;
            div.onclick = (e) => {
                if(e.target.closest('.rule-btn')) return;
                loadStratEditor(s);
            };
            div.querySelector('[data-action="edit"]').onclick = () => loadStratEditor(s);
            div.querySelector('[data-action="del"]').onclick = () => {
                if(confirm('确认删除该策略？')) {
                    StrategyStore.delete(s.id);
                    if(state.editingStrat && state.editingStrat.id === s.id) {
                        state.editingStrat = null;
                        document.getElementById('strat-editor-panel').style.display = 'none';
                        document.getElementById('strat-empty-state').style.display = 'flex';
                    }
                    renderStratList();
                }
            };
            container.appendChild(div);
        });
    }

    function loadStratEditor(strat) {
        state.editingStrat = strat;
        document.getElementById('strat-empty-state').style.display = 'none';
        document.getElementById('strat-editor-panel').style.display = 'flex';
        document.getElementById('strat-title-input').value = strat.name;
        document.getElementById('sim-box-result').innerHTML = '<div style="color:#999;text-align:center;padding-top:40px;">点击 [随机模拟] 测试当前规则对文件的筛选效果</div>';
        renderRuleList();
        renderStratList(); // update active class
    }

    function renderRuleList() {
        const container = document.getElementById('rule-list-container');
        container.innerHTML = '';
        state.editingStrat.rules.forEach((rule, idx) => {
            const row = document.createElement('div');
            row.className = 'rule-row';

            const def = RuleDefs[rule.type] || RuleDefs['path_contain'];
            const opts = Object.entries(RuleDefs).map(([k, v]) => `<option value="${k}" ${k === rule.type ? 'selected' : ''}>${v.name}</option>`).join('');

            row.innerHTML = `
                <div class="rule-idx">#${idx+1}</div>
                <select class="rule-select" data-role="type">${opts}</select>
                ${def.hasInput ? `<input type="text" class="rule-input" value="${rule.value || ''}" placeholder="${def.placeholder}" data-role="val">` : '<div style="flex:1"></div>'}
                <div class="rule-actions">
                    <div class="rule-btn" data-role="up" title="上移">${Icons.up}</div>
                    <div class="rule-btn" data-role="down" title="下移">${Icons.down}</div>
                    <div class="rule-btn danger" data-role="del" title="删除">${Icons.delete}</div>
                </div>
            `;

            // 绑定事件
            const sel = row.querySelector('[data-role="type"]');
            sel.onchange = (e) => { rule.type = e.target.value; renderRuleList(); };

            const inp = row.querySelector('[data-role="val"]');
            if(inp) inp.oninput = (e) => { rule.value = e.target.value; };

            row.querySelector('[data-role="up"]').onclick = () => {
                if(idx > 0) {
                    [state.editingStrat.rules[idx], state.editingStrat.rules[idx-1]] = [state.editingStrat.rules[idx-1], state.editingStrat.rules[idx]];
                    renderRuleList();
                }
            };
            row.querySelector('[data-role="down"]').onclick = () => {
                if(idx < state.editingStrat.rules.length - 1) {
                    [state.editingStrat.rules[idx], state.editingStrat.rules[idx+1]] = [state.editingStrat.rules[idx+1], state.editingStrat.rules[idx]];
                    renderRuleList();
                }
            };
            row.querySelector('[data-role="del"]').onclick = () => {
                state.editingStrat.rules.splice(idx, 1);
                renderRuleList();
            };

            container.appendChild(row);
        });
    }

    function simulateStrategy() {
        if(!state.editingStrat || !state.files.length) {
            alert('没有文件数据或未选择策略');
            return;
        }

        const dupGroups = Object.values(state.groups).filter(g => g.length > 1);
        if(!dupGroups.length) {
            alert('当前没有发现重复文件组');
            return;
        }

        // 修改点1：移除打乱顺序，按默认顺序扫描
        // dupGroups.sort(() => Math.random() - 0.5);

        let bestResult = null;
        let bestGroup = null;
        let matchQuality = 0; // 0: 默认兜底, 1: 发生筛选, 2: 命中特定文本规则

        // 修改点2：移除 500 个的数量限制，改为全量扫描循环
        // const limit = Math.min(dupGroups.length, 500);

        for (let i = 0; i < dupGroups.length; i++) {
            const group = dupGroups[i];
            const result = StrategyEngine(state.editingStrat, group, null);

            let quality = 0;
            const traceStr = result.trace.join('||');

            // 判定逻辑1：规则是否产生了筛选效果 (剩余数量 < 初始数量 且 非空)
            if (traceStr.includes('剩余') && !traceStr.includes('无匹配项') && !traceStr.includes('全员命中')) {
                quality = 1;
            }

            // 判定逻辑2：如果是文本类规则(包含/正则)，是否命中了关键词
            // 只有当 trace 中明确出现了匹配成功的日志时，才认为是“完美案例”
            if (state.editingStrat.rules.some(r => (r.type.includes('contain') || r.type.includes('regex')) && r.value)) {
                if ((traceStr.includes('包含') || traceStr.includes('正则')) && !traceStr.includes('无匹配项')) {
                    quality = 2;
                }
            }

            // 更新最佳匹配
            if (quality > matchQuality) {
                matchQuality = quality;
                bestResult = result;
                bestGroup = group;
                // 修改点3：如果找到了符合文本规则的完美匹配(Quality 2)，立即停止扫描，直接展示结果
                if (quality === 2) break;
            }
        }

        // 兜底：如果全盘扫描后连一个能被筛选的组都没找到（Quality 0），就展示第一个组作为示例
        if (!bestGroup) {
            bestGroup = dupGroups[0];
            bestResult = StrategyEngine(state.editingStrat, bestGroup, null);
        }

        const winId = bestResult.winner.file_id;
        const box = document.getElementById('sim-box-result');
        let html = '';

        // 显示日志
        html += `<div style="margin-bottom:12px;padding-bottom:8px;border-bottom:1px dashed #ccc;"><b>执行日志 (示例组):</b><br>${bestResult.trace.join('<br>')}</div>`;

        // 显示文件结果
        bestGroup.forEach(f => {
            const isWin = String(f.file_id) === String(winId);
            const path = state.folders[f.parent_id] || '未知路径';
            const time = new Date(parseInt(f.user_utime) * 1000).toLocaleString();

            html += `
                <div class="sim-result-row" style="opacity:${isWin ? 1 : 0.6}">
                    <div class="sim-tag ${isWin ? 'sim-win' : 'sim-lose'}">${isWin ? '保留' : '删除'}</div>
                    <div style="flex:1">
                        <div style="font-weight:500;">${f.file_name}</div>
                        <div class="sim-info">${path} | ${time}</div>
                    </div>
                </div>
            `;
        });

        // 提示信息更新
        if (matchQuality === 0 && state.editingStrat.rules.some(r => r.value)) {
            html += `<div style="margin-top:10px;color:#d93025;font-weight:bold;">提示：全盘扫描了 ${dupGroups.length} 组重复文件，未找到符合当前文本规则的匹配项。</div>`;
        }

        box.innerHTML = html;
    }

    // 将策略应用到实际操作中
    function applyUserStrategy(stratId, cid) {
        const strat = StrategyStore.getAll().find(s => s.id == stratId);
        if(!strat) return;

        if(!confirm(`确认对 [${cid ? '当前目录' : '全盘'}] 应用策略: "${strat.name}" ?\n\n该策略包含 ${strat.rules.length} 条过滤规则。`)) return;

        // 获取目标文件范围
        let targetFiles = [];
        if(cid) {
             targetFiles = getFilesRecursive(cid);
        } else {
             // 全盘
             Object.values(state.groups).forEach(g => {
                 if(g.length > 1) targetFiles.push(...g);
             });
        }

        if(targetFiles.length === 0) return;

        log(`正在应用策略 "${strat.name}"...`, "info");
        let processedGroups = 0;
        let changeCount = 0;

        // 按组处理
        const processedSha1 = new Set();

        targetFiles.forEach(f => {
            if(processedSha1.has(f.sha1)) return;
            processedSha1.add(f.sha1);

            const group = state.groups[f.sha1];
            if(!group || group.length < 2) return;

            // 运行引擎
            const result = StrategyEngine(strat, group, cid);
            const winnerId = String(result.winner.file_id);

            // 应用结果：winner保留，其他标记删除
            group.forEach(gf => {
                const shouldDel = String(gf.file_id) !== winnerId;
                if(gf._markDel !== shouldDel) {
                    gf._markDel = shouldDel;
                    changeCount++;
                }
            });
            processedGroups++;
        });

        refreshAllTreeVisualsFast();
        if(cid && state.folders[cid]) {
            showFolderDetails(cid, state.folders[cid]);
        }

        log(`策略应用完成。处理了 ${processedGroups} 组副本，更新了 ${changeCount} 个文件的标记状态。`, "success");
    }

    async function refreshStats() {
        // 1. 加载文件和文件夹
        state.files = await DB.getAll('files');
        const foldersArr = await DB.getAll('folders');
        state.folders = {};
        foldersArr.forEach(f => {
            if(f.cid) state.folders[String(f.cid)] = f.full_path;
        });

        // 2. 【新增】加载持久化的黑名单到内存 Set 中
        const historyArr = await DB.getAll('history');
        state.deletedHistory = new Set(historyArr.map(h => String(h.file_id)));

        // 更新UI
        document.getElementById('st-files').innerText = state.files.length;
        document.getElementById('st-folders').innerText = foldersArr.length;

        // 可以在控制台看看黑名单里有多少个
        if(state.deletedHistory.size > 0) {
            log(`已加载历史删除记录(黑名单): ${state.deletedHistory.size} 条`, "info");
        }

        log(`状态刷新: 缓存文件 ${state.files.length}, 文件夹 ${foldersArr.length}`);
    }

    async function cleanUniqueFiles() {
        if(state.files.length === 0) {
            log("列表为空，无需清理", "warn");
            return;
        }

        log("正在扫描无副本文件...", "info");

        // 本地计算分组
        const counts = {};
        state.files.forEach(f => {
            counts[f.sha1] = (counts[f.sha1] || 0) + 1;
        });

        const uniqueIds = [];
        state.files.forEach(f => {
            if(counts[f.sha1] === 1) uniqueIds.push(String(f.file_id));
        });

        if(uniqueIds.length === 0) {
            log("未发现无副本文件 (所有文件都有至少1个重复项)", "success");
            alert("未发现无副本文件");
            return;
        }

        if(!confirm(`扫描到 ${uniqueIds.length} 个文件属于“无副本状态”（即已去重完成）。\n\n是否从列表中清除这些记录？\n(不会删除云端文件，仅清理列表)`)) return;

        await DB.deleteBatch('files', uniqueIds);
        state.files = state.files.filter(f => !uniqueIds.includes(String(f.file_id)));

        refreshStats();
        log(`✨ 清理完成: 移除了 ${uniqueIds.length} 个已去重记录`, "success");
    }

    async function clearDB() {
        if(!confirm("⚠️ 确认清空文件和文件夹缓存？\n(注意：为了防止僵尸文件回归，【已删除黑名单】将保留，不会被清空)")) return;
        state.isRunning = false;
        log("正在停止当前任务并尝试锁定数据库...", "warn");
        await sleep(500);
        try {
            const btn = document.getElementById('btn-reset');
            const originalText = btn.innerText;
            btn.innerText = "清空中...";
            btn.disabled = true;
            log("开始执行物理删除...", "warn");

            // 【关键修改】只清空 files 和 folders，保留 history
            await Promise.all([
                DB.clear('files'),
                DB.clear('folders')
            ]);

            log("✨ 文件缓存已清空 (黑名单已保留)", "success");
            state.files = [];
            state.folders = {};
            state.groups = {};
            state.folderGroups = {};
            // 注意：这里不要清空 state.deletedHistory

            btn.innerText = originalText;
            btn.disabled = false;
            refreshStats();
        } catch (e) {
            log("❌ 清空失败，请尝试刷新网页后再试: " + e.message, "error");
            document.getElementById('btn-reset').disabled = false;
        }
    }

    function renderTreeNode(node, isRoot = false) {
        const div = document.createElement('div');
        div.className = 'dc-tree-node';

        const content = document.createElement('div');
        content.className = 'dc-tree-content';
        const nodePath = node.virtualPath || node.name;
        content.setAttribute('data-node-path', nodePath);
        if (node.cid) content.setAttribute('data-cid', String(node.cid));

        const hasChildren = Object.keys(node.children).length > 0;

        const toggle = document.createElement('div');
        toggle.className = 'dc-tree-toggle collapsed';
        if(hasChildren) {
            toggle.innerHTML = Icons.chevron;
        } else {
            toggle.style.visibility = 'hidden';
        }

        const stats = getRecursiveNodeStats(node);
        const status = getRecursiveStatusColor(stats);
        const statusClass = { 'all': 'dot-all', 'keep': 'dot-keep', 'mix': 'dot-mix', 'none': 'dot-none' }[status];
        const badgeHtml = stats.total > 0 ?
              `<span class="dc-tree-badge ${stats.del > 0 ? 'has-dup' : ''}" title="已标记删除 / 总重复数">${stats.del}/${stats.total}</span>` : '';

        const labelPart = document.createElement('div');
        labelPart.style = "display:flex; align-items:center; flex:1; overflow:hidden;";
        labelPart.innerHTML = `
        <span class="dc-tree-icon">${Icons.folder}</span>
        <span class="dc-tree-label">${node.name}</span>
        ${badgeHtml}
        <div class="dc-tree-status-dot ${statusClass}"></div>
        <span class="dc-tree-loading-icon"></span>
    `;

        content.appendChild(toggle);
        content.appendChild(labelPart);

        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'dc-tree-children collapsed';

        if(isRoot) {
            childrenContainer.classList.remove('collapsed');
            toggle.classList.remove('collapsed');
            toggle.classList.add('expanded');
        }

        const doToggle = () => {
            if (!hasChildren) return;
            content.classList.add('loading');
            setTimeout(() => {
                const isCollapsed = childrenContainer.classList.toggle('collapsed');
                toggle.classList.toggle('collapsed', isCollapsed);
                toggle.classList.toggle('expanded', !isCollapsed);
                content.classList.remove('loading');
            }, 150);
        };

        toggle.onclick = (e) => { e.stopPropagation(); doToggle(); };

        labelPart.onclick = (e) => {
            e.stopPropagation();
            document.querySelectorAll('.dc-tree-content').forEach(el => el.classList.remove('active'));
            content.classList.add('active');

            const cidStr = node.cid ? String(node.cid) : null;

            if(cidStr) {
                const pathToShow = (state.folders[cidStr]) ? state.folders[cidStr] : (node.virtualPath || node.name);
                showFolderDetails(cidStr, pathToShow);
            } else {
                const pathView = document.getElementById('tree-path-view');
                if(pathView) pathView.innerText = node.virtualPath || node.name;
                document.getElementById('tree-file-list').innerHTML = '<div style="padding:40px;text-align:center;color:#999;">此节点仅为虚拟路径，无法操作<br><span style="font-size:12px">请尝试点击其子目录或父目录</span></div>';
            }
        };
        labelPart.ondblclick = (e) => { e.stopPropagation(); doToggle(); };

        div.appendChild(content);
        if(hasChildren) {
            Object.values(node.children).forEach(child => childrenContainer.appendChild(renderTreeNode(child)));
            div.appendChild(childrenContainer);
        }
        return div;
    }

    function buildAndRenderTree(isSilent = false) {
        const container = document.getElementById('tree-container');
        if(state.files.length === 0) {
            container.innerHTML = '<div style="padding:40px; text-align:center; color:#5f6368;">请先在 [数据中心] 完成同步</div>';
            return;
        }

        if (!isSilent) {
            container.innerHTML = `
            <div class="dc-tree-loading-box">
                <div class="dc-loading-spinner"></div>
                <div>正在解析深度目录树...</div>
            </div>
        `;
        }

        const renderTask = () => {
            log("开始构建内存目录树...", "info");
            state.groups = {}; state.folderGroups = {};
            state.files.forEach(f => {
                f._markDel = f._markDel || false;
                const pid = String(f.parent_id);
                if(!state.groups[f.sha1]) state.groups[f.sha1] = [];
                state.groups[f.sha1].push(f);
                if(!state.folderGroups[pid]) state.folderGroups[pid] = [];
                state.folderGroups[pid].push(f);
            });

            const pathMap = {};
            Object.entries(state.folders).forEach(([cid, path]) => {
                if(path) {
                    pathMap[path] = String(cid);
                    if(path.endsWith('/')) pathMap[path.slice(0, -1)] = String(cid);
                }
            });

            pathMap['根目录'] = '0';

            const root = { cid: '0', name: '根目录', children: {}, count: 0, virtualPath: '根目录' };
            state.treeData = root;

            // 重置节点映射索引
            state.nodeMap = {};
            state.nodeMap['0'] = root;

            let virtualCount = 0;

            Object.keys(state.folderGroups).forEach(cid => {
                const pathStr = state.folders[cid] || ("未知路径/" + cid);
                const parts = pathStr.split('/');
                let current = root;
                let currentPathBuilder = "";

                parts.forEach((part, index) => {
                    if(index === 0 && part === '根目录') {
                        currentPathBuilder = "根目录";
                        return;
                    }

                    currentPathBuilder += (currentPathBuilder ? "/" : "") + part;

                    if(!current.children[part]) {
                        let inferredCid = (index === parts.length - 1) ? cid : (pathMap[currentPathBuilder] || null);
                        if (!inferredCid && index < parts.length - 1) virtualCount++;

                        const newNode = {
                            name: part,
                            children: {},
                            cid: inferredCid,
                            count: 0,
                            virtualPath: currentPathBuilder
                        };
                        current.children[part] = newNode;

                        // 建立索引
                        if(inferredCid) state.nodeMap[inferredCid] = newNode;
                    }
                    current = current.children[part];
                });

                current.cid = cid;
                current.count = state.folderGroups[cid].length;
                state.nodeMap[cid] = current;
            });

            if (virtualCount > 0) {
                log(`⚠️ 有 ${virtualCount} 个中间目录缺少 ID，请运行 [B. 构建目录树] 补全。`, "warn");
            }

            container.innerHTML = '';

            // 1.6修改：动态加载用户策略到下拉菜单
            const userStrats = StrategyStore.getAll();
            const stratOptions = userStrats.map(s => `<div class="dc-dropdown-item" data-sid="${s.id}">${s.name}</div>`).join('');

            const header = document.createElement('div');
            header.className = 'dc-tree-top-bar';
            header.innerHTML = `
                <div style="display:flex; flex-direction:column; width:100%;">
                    <div style="display:flex; gap:8px; padding-bottom:8px; border-bottom:1px solid #eee;">
                        <button class="dc-btn" id="tree-btn-expand" style="padding:4px 8px; font-size:11px;">展开</button>
                        <button class="dc-btn" id="tree-btn-collapse" style="padding:4px 8px; font-size:11px;">收起</button>

                        <div class="dc-dropdown">
                            <button class="dc-dropdown-btn">
                               智能策略 <span>▼</span>
                            </button>
                            <div class="dc-dropdown-content">
                                <div class="dc-dropdown-item" id="btn-strat-global-internal">全盘-目录内去重</div>
                                <div class="dc-dropdown-item" id="btn-strat-global-old">全盘-保留最早</div>
                                ${userStrats.length > 0 ? '<div style="border-top:3px solid #eee;"></div>' : ''}
                                ${stratOptions}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(header);

            const treeWrapper = document.createElement('div');
            treeWrapper.style = "padding: 8px 0 40px 0;";
            treeWrapper.appendChild(renderTreeNode(root, true));
            container.appendChild(treeWrapper);

            initTreeStats(root);

            document.getElementById('tree-btn-expand').onclick = () => {
                document.querySelectorAll('.dc-tree-children').forEach(el => el.classList.remove('collapsed'));
                document.querySelectorAll('.dc-tree-toggle').forEach(el => {
                    if(el.style.visibility !== 'hidden') {
                        el.classList.remove('collapsed'); el.classList.add('expanded');
                    }
                });
            };
            document.getElementById('tree-btn-collapse').onclick = () => {
                document.querySelectorAll('.dc-tree-children').forEach(el => {
                    if(!el.parentElement.querySelector('.dc-tree-label').innerText.includes('根目录')) {
                        el.classList.add('collapsed');
                    }
                });
                document.querySelectorAll('.dc-tree-toggle').forEach(el => {
                    if(el.style.visibility !== 'hidden') {
                        el.classList.add('collapsed'); el.classList.remove('expanded');
                    }
                });
            };

            // 【修改点】绑定两个不同的策略事件
            document.getElementById('btn-strat-global-old').onclick = smartMarkKeepOldest;
            document.getElementById('btn-strat-global-internal').onclick = dedupeGlobalInternal;

            // 1.6新增：绑定自定义策略点击事件
            header.querySelectorAll('[data-sid]').forEach(el => {
                el.onclick = () => applyUserStrategy(el.dataset.sid, null);
            });

            log("目录树渲染完成", "success");
        };

        if (isSilent) renderTask();
        else setTimeout(renderTask, 30);
    }

    // ================== 核心功能：右侧列表与操作 ==================
    function showFolderDetails(cid, fullPath) {
        state.currentViewCid = String(cid);

        // --- 格式化工具 ---
        const formatSize = (size) => {
            if (!size) return '0 B';
            const num = parseInt(size);
            if (isNaN(num)) return size;
            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            let i = 0;
            let s = num;
            while (s >= 1024 && i < units.length - 1) {
                s /= 1024;
                i++;
            }
            return s.toFixed(1) + ' ' + units[i];
        };

        const formatDate = (ts) => {
            if (!ts) return '-';
            if (String(ts).includes('-') || String(ts).includes(':')) return ts;
            const date = new Date(parseInt(ts) * 1000);
            return date.getFullYear() + '-' +
                String(date.getMonth()+1).padStart(2,'0') + '-' +
                String(date.getDate()).padStart(2,'0') + ' ' +
                String(date.getHours()).padStart(2,'0') + ':' +
                String(date.getMinutes()).padStart(2,'0');
        };

        // --- 1.5版修改：生成面包屑导航HTML ---
        const generateBreadcrumbHtml = (currentCid) => {
             const node = state.nodeMap && state.nodeMap[currentCid];
             if (!node) {
                 // 降级处理：如果没有树结构，只显示当前目录的单一链接
                 const pathText = state.folders[currentCid] || currentCid || '-';
                 return `<a href="https://115.com/?cid=${currentCid}&offset=0&mode=wangpan" target="_blank" class="dc-link" style="color:#202124; font-weight:600;">${pathText}</a>`;
             }

             // 有树结构，向上追溯
             const chain = [];
             let curr = node;
             while(curr) {
                 chain.unshift({ name: curr.name, cid: curr.cid });
                 curr = curr.parent;
             }

             return chain.map(item => {
                 const cidVal = item.cid || '0';
                 return `<a href="https://115.com/?cid=${cidVal}&offset=0&mode=wangpan" target="_blank" class="dc-link">${item.name}</a>`;
             }).join('<span style="margin:0 4px;color:#dadce0;">/</span>');
        };

        const toolbar = document.querySelector('#tab-tree .dc-toolbar');
        if (toolbar) {
            // 1.6: 动态生成工具栏策略菜单
            const userStrats = StrategyStore.getAll();
            const stratOptions = userStrats.map(s => `<div class="dc-dropdown-item" data-sid="${s.id}">${s.name}</div>`).join('');

            toolbar.innerHTML = `
                <!-- 第一行：当前目录信息 + 基础操作 -->
                <div class="dc-toolbar-row">
                     <div style="display:flex; align-items:center; overflow:hidden;">
                        <span class="dc-label">当前位置:</span>
                        <div style="color:#202124; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:800px;">
                            ${generateBreadcrumbHtml(cid)}
                        </div>
                     </div>
                     <div class="dc-toolbar-group">
                        <button class="dc-btn-sm primary" id="btn-curr-master">以此为准</button>
                        <button class="dc-btn-sm danger" id="btn-curr-clear">内部去重</button>
                     </div>
                </div>
                <!-- 第二行：高级批量操作 -->
                <div class="dc-toolbar-row" style="background:#f8f9fa; padding:6px 10px; border-radius:6px; border:1px solid #f1f3f4;">
                    <div class="dc-toolbar-group">
                        <span class="dc-label" style="color:#1a73e8; font-weight:700;">全树操作</span>
                        <span style="font-size:10px; color:#9aa0a6;">(含所有子目录)</span>
                    </div>
                    <div class="dc-toolbar-group">
                        <button class="dc-btn-sm" id="btn-deep-reset">全保留</button>
                        <button class="dc-btn-sm" id="btn-deep-master" title="保留树内文件，删除外部副本">以此为准</button>
                        <button class="dc-btn-sm danger" id="btn-deep-clear" title="每个文件只保留一份">内部去重</button>
                        <button class="dc-btn-sm danger" id="btn-deep-mark" title="慎用：全部标记删除">全删</button>
                         <!-- 1.6新增：当前目录应用自定义策略 -->
                        <div class="dc-dropdown">
                            <button class="dc-dropdown-btn" style="background:#fff;color:#5f6368;border:1px solid #dadce0;">
                               应用策略 <span>▼</span>
                            </button>
                            <div class="dc-dropdown-content" style="right:0;">
                                ${stratOptions || '<div style="padding:8px;color:#999;font-size:11px;">无自定义策略</div>'}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('btn-curr-master').onclick = () => setAsMaster();
            document.getElementById('btn-curr-clear').onclick = () => clearCurrentFolder();
            document.getElementById('btn-deep-reset').onclick = () => handleDeepOperation(cid, 'reset');
            document.getElementById('btn-deep-master').onclick = () => handleDeepOperation(cid, 'set_master');
            document.getElementById('btn-deep-clear').onclick = () => handleDeepOperation(cid, 'clear_dup');
            document.getElementById('btn-deep-mark').onclick = () => handleDeepOperation(cid, 'mark_del');

            // 1.6新增：绑定工具栏自定义策略
            toolbar.querySelectorAll('[data-sid]').forEach(el => {
                el.onclick = () => applyUserStrategy(el.dataset.sid, cid);
            });
        }

        const list = document.getElementById('tree-file-list');
        list.innerHTML = '';
        const files = state.folderGroups[cid];
        if(!files || files.length === 0) {
            list.innerHTML = `
                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 0; color:#bdc1c6;">
                    <div style="font-size:48px; margin-bottom:16px; opacity:0.3;">${Icons.folder}</div>
                    <div style="font-size:13px;">此目录无重复文件记录</div>
                </div>`;
            return;
        }

        files.forEach(f => {
            const group = state.groups[f.sha1] || [];
            const others = group.filter(x => String(x.file_id) !== String(f.file_id));
            const hasDup = others.length > 0;

            // 【修改点：默认展开】
            let isExpanded = true;
            let subList = null; // 提前声明

            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'dc-row-wrapper';

            const displaySize = f.file_size_str || formatSize(f.file_size);
            const displayTime = f.user_utime_str || formatDate(f.user_utime);

            // ================== 主行 (本目录文件) ==================
            const mainRow = document.createElement('div');
            mainRow.className = 'dc-row-main';

            const getBadgeHtml = (isDel) => {
                return isDel
                    ? `<div class="dc-status-badge status-del">${Icons.trash} 删除</div>`
                : `<div class="dc-status-badge status-keep">${Icons.check} 保留</div>`;
            };

            const renderMain = () => {
                // 根据状态变量动态设置 class
                const arrowClass = 'dc-toggle-btn' + (hasDup ? '' : ' hidden') + (isExpanded ? ' expanded' : '');

                mainRow.innerHTML = `
                    <div class="${arrowClass}">${Icons.arrowRight}</div>
                    ${getBadgeHtml(f._markDel)}
                    <div style="margin-right:12px; display:flex; align-items:center;">${Icons.file}</div>
                    <div class="file-info">
                        <div class="file-name" title="${f.file_name}">${f.file_name}</div>
                        <div class="file-meta">
                            <span>${displayTime}</span>
                            <span style="color:#dadce0;">|</span>
                            <span>${displaySize}</span>
                            <span style="color:#dadce0;">|</span>
                            <span style="font-family:'Consolas', monospace; color:#5f6368; font-size:10px;">${f.sha1}</span>
                        </div>
                    </div>
                `;
            };
            renderMain();

            rowWrapper.appendChild(mainRow);

            // ================== 子列表 (外部副本) ==================
            if (hasDup) {
                subList = document.createElement('div');
                // 【修改点：默认展开的样式】
                subList.className = 'dc-sub-list expanded';

                others.forEach(other => {
                    const subRow = document.createElement('div');
                    subRow.className = 'dc-sub-row';
                    const otherPid = String(other.parent_id);
                    const knownPath = state.folders[otherPid];
                    const subDisplayTime = other.user_utime_str || formatDate(other.user_utime);

                    // 1.5版本修改：优化外部重复文件显示逻辑（带链接）
                    let pathDisplayHtml = "";
                    if (knownPath) {
                        pathDisplayHtml = `<a href="https://115.com/?cid=${otherPid}&offset=0&mode=wangpan" target="_blank" style="color:#f28b82;" title="${knownPath}">${knownPath}</a> <span style="color:#999; margin-left:4px;">/ ${other.file_name}</span>`;
                    } else {
                        pathDisplayHtml = `<a href="https://115.com/?cid=${otherPid}&offset=0&mode=wangpan" target="_blank" style="color:#f28b82;" title="点击跳转父目录">${other.path}</a> <span style="color:#999; margin-left:4px;">/ ${other.file_name}</span>`;
                    }

                    const renderSub = () => {
                        subRow.innerHTML = `
                            ${getBadgeHtml(other._markDel)}
                            <div class="path-info">
                                <span style="display:flex; align-items:center; color:#fbbc04; margin-right:4px;">${Icons.folder}</span>
                                <span class="path-text">${pathDisplayHtml}</span>
                            </div>
                            <div style="font-size:11px; color:#999; margin-left:auto;">${subDisplayTime}</div>
                        `;
                    };
                    renderSub();

                    subRow.onclick = (e) => {
                        // 防止点击链接时触发选中切换
                        if(e.target.tagName === 'A') return;
                        other._markDel = !other._markDel;
                        renderSub();
                        refreshAllTreeVisualsFast();
                    };
                    subList.appendChild(subRow);
                });

                rowWrapper.appendChild(subList);
            }

            // 【修复关键2】将点击事件统一绑定在 mainRow 上，通过 target 判断点击的是箭头还是整行
            mainRow.onclick = (e) => {
                // 如果点击的是折叠箭头
                if(e.target.closest('.dc-toggle-btn')) {
                    e.stopPropagation();
                    if(!hasDup) return;

                    isExpanded = !isExpanded; // 切换状态
                    if(subList) subList.classList.toggle('expanded', isExpanded); // 切换 DOM 显示
                    renderMain(); // 重新渲染主行（为了更新箭头的旋转状态）
                    return;
                }

                // 否则是正常的状态切换
                f._markDel = !f._markDel;
                renderMain();
                refreshAllTreeVisualsFast();
            };

            list.appendChild(rowWrapper);
        });
    }

    // ================== 业务逻辑 ==================

    function clearCurrentFolder() {
        const cid = state.currentViewCid;
        if(!cid) return;
        const files = state.folderGroups[cid];
        let safeCount = 0;
        files.forEach(f => {
            const group = state.groups[f.sha1];
            if(group.length > 1) {
                f._markDel = true;
                let hasOtherKeep = false;
                group.forEach(other => {
                    if(String(other.parent_id) !== cid) {
                        other._markDel = false;
                        hasOtherKeep = true;
                    }
                });
                if(hasOtherKeep) safeCount++;
                else f._markDel = false;
            }
        });
        showFolderDetails(cid, state.folders[cid]);
        refreshAllTreeVisualsFast();
        log(`批量标记: 本目录已标记 ${safeCount} 个重复文件为删除`, "success");
    }

    function getRecursiveNodeStats(node) {
        let total = 0, del = 0;
        if (node.cid && state.folderGroups[node.cid]) {
            const files = state.folderGroups[node.cid];
            total += files.length;
            del += files.filter(f => f._markDel).length;
        }
        if (node.children) {
            Object.values(node.children).forEach(child => {
                const childStats = getRecursiveNodeStats(child);
                total += childStats.total;
                del += childStats.del;
            });
        }
        return { total, del };
    }

    function getRecursiveStatusColor(stats) {
        if (stats.total === 0) return 'none';
        if (stats.del === 0) return 'keep';
        if (stats.del === stats.total) return 'all';
        return 'mix';
    }

    function setAsMaster() {
        const cid = state.currentViewCid;
        if(!cid) return;
        log(`正在执行“主目录”策略：以 [${state.folders[cid]}] 为准，全盘标记副本删除`, "warn");
        const currentFiles = state.folderGroups[cid];
        let markedCount = 0;
        currentFiles.forEach(masterFile => {
            const group = state.groups[masterFile.sha1];
            if (group && group.length > 1) {
                group.forEach(otherFile => {
                    if (String(otherFile.parent_id) !== cid) {
                        if (!otherFile._markDel) {
                            otherFile._markDel = true;
                            markedCount++;
                        }
                    } else {
                        otherFile._markDel = false;
                    }
                });
            }
        });
        showFolderDetails(cid, state.folders[cid]);
        refreshAllTreeVisualsFast();
        log(`策略执行完毕！全盘共计标记了 ${markedCount} 个分身。`, "success");
    }

    function smartMarkKeepOldest() {
        log("执行全局规则：保留每个组中时间最早的文件...", "info");
        let count = 0;
        Object.values(state.groups).forEach(group => {
            if(group.length <= 1) return;
            group.sort((a, b) => (a.user_utime || 0) - (b.user_utime || 0));
            group.forEach((f, idx) => {
                f._markDel = (idx !== 0);
                if(f._markDel) count++;
            });
        });
        refreshAllTreeVisualsFast();

        // 【修改点：刷新右侧 UI】
        if (state.currentViewCid && state.folders[state.currentViewCid]) {
            showFolderDetails(state.currentViewCid, state.folders[state.currentViewCid]);
        }

        log(`全局规则处理完毕，标记了 ${count} 个副本。`, "success");
    }

    // --- 新策略：全盘-目录内部去重 (Global Intra-Directory Dedupe) ---
    function dedupeGlobalInternal() {
        if (state.files.length === 0) {
            alert("请先同步文件数据");
            return;
        }

        if (!confirm("⚠️ [全盘-目录内去重] 策略说明：\n\n将遍历全盘所有文件夹，如果某个文件夹内部有重复文件（SHA1相同），则只保留该文件夹内最早的一个。\n\n此操作不会跨文件夹删除副本。\n\n确定要执行吗？")) return;

        log("正在执行 [全盘-目录内去重] 策略...", "info");

        let totalMarked = 0;
        let processedFolders = 0;

        // 遍历全盘每一个文件夹 (CID)
        Object.keys(state.folderGroups).forEach(cid => {
            const files = state.folderGroups[cid];
            if (!files || files.length < 2) return;

            // 在该文件夹内部，按 SHA1 分组
            const localGroups = {};
            files.forEach(f => {
                if (!localGroups[f.sha1]) localGroups[f.sha1] = [];
                localGroups[f.sha1].push(f);
            });

            // 检查内部重复
            Object.values(localGroups).forEach(group => {
                if (group.length > 1) {
                    // 按时间排序：最早在前
                    group.sort((a, b) => (a.user_utime || 0) - (b.user_utime || 0));

                    // 第 0 个保留，后面的全部标删
                    group.forEach((f, idx) => {
                        const shouldDel = (idx !== 0);
                        if (f._markDel !== shouldDel) {
                            f._markDel = shouldDel;
                            if (shouldDel) totalMarked++;
                        }
                    });
                }
            });
            processedFolders++;
        });

        // 刷新界面
        refreshAllTreeVisualsFast();

        // 【修改点：刷新右侧 UI】
        if (state.currentViewCid && state.folders[state.currentViewCid]) {
            showFolderDetails(state.currentViewCid, state.folders[state.currentViewCid]);
        }

        log(`[全盘-目录内去重] 完成！扫描了 ${processedFolders} 个目录，标记了 ${totalMarked} 个同目录下的冗余文件。`, "success");
    }

    // ================== 新增穿透功能 ==================

    function getFilesRecursive(targetCid) {
        const targetCidStr = String(targetCid);
        let targetNode = null;
        const findNode = (node) => {
            if (String(node.cid) === targetCidStr) return node;
            if (node.children) {
                for (let childName in node.children) {
                    const found = findNode(node.children[childName]);
                    if (found) return found;
                }
            }
            return null;
        };
        targetNode = findNode(state.treeData);
        if (!targetNode) return [];
        let allFiles = [];
        const collect = (node) => {
            if (node.cid && state.folderGroups[String(node.cid)]) {
                allFiles = allFiles.concat(state.folderGroups[String(node.cid)]);
            }
            if (node.children) {
                Object.values(node.children).forEach(child => collect(child));
            }
        };
        collect(targetNode);
        return allFiles;
    }

    function handleDeepOperation(cid, action) {
        if (!cid) return;
        let files = getFilesRecursive(cid); // 获取该目录下所有文件
        if (files.length === 0) {
            alert("当前目录下没有文件");
            return;
        }
        let count = 0;
        const actionName = {
            'reset': '取消标记',
            'mark_del': '全部标记删除',
            'clear_dup': '智能内部去重',
            'set_master': '设为主目录'
        }[action];

        if (!confirm(`⚠️ 确认对 [当前目录及所有子目录] 执行 [${actionName}] ？\n\n涉及文件数: ${files.length} 个`)) return;

        // 【新增优化】如果是“内部去重”，先按时间排序，确保保留的是最早的那一个
        if (action === 'clear_dup') {
            files.sort((a, b) => (a.user_utime || 0) - (b.user_utime || 0));
        }

        // 【新增】用于记录本次操作中已保留的哈希值
        const seenHashes = new Set();

        files.forEach(f => {
            const group = state.groups[f.sha1];
            // 只有当文件确实属于重复文件组（全盘有副本）时才处理
            const isGlobalDup = group && group.length > 1;

            if (action === 'reset') {
                if (f._markDel) { f._markDel = false; count++; }
            }
            else if (action === 'mark_del') {
                // 全部删除逻辑：只要是重复文件，全部标删
                if (isGlobalDup) {
                    if (!f._markDel) { f._markDel = true; count++; }
                }
            }
            else if (action === 'clear_dup') {
                // 【修复核心逻辑】智能内部去重
                if (isGlobalDup) {
                    if (seenHashes.has(f.sha1)) {
                        // 如果之前已经遇到过这个SHA1，说明这是多余的，标记删除
                        if (!f._markDel) { f._markDel = true; count++; }
                    } else {
                        // 如果是第一次遇到这个SHA1，加入记录并保留（取消删除标记）
                        seenHashes.add(f.sha1);
                        if (f._markDel) { f._markDel = false; count++; }
                    }
                }
            }
            else if (action === 'set_master') {
                // 设为主目录逻辑：
                // 1. 本目录下的文件全部保留
                if (f._markDel) { f._markDel = false; } // 这里不算count，因为这算一种“保护”

                // 2. 将全盘其他位置的副本全部标删
                if (isGlobalDup) {
                    group.forEach(other => {
                        // 检查 other 是否在当前递归获取的 files 列表中
                        // 注意：这里需要根据 file_id 判断，因为对象引用可能不同
                        const isInsideTree = files.some(treeFile => String(treeFile.file_id) === String(other.file_id));

                        if (!isInsideTree) {
                            if (!other._markDel) { other._markDel = true; count++; }
                        }
                    });
                }
            }
        });

        refreshAllTreeVisualsFast();

        // 【修改点：刷新右侧 UI】
        if (state.currentViewCid && state.folders[state.currentViewCid]) {
            showFolderDetails(state.currentViewCid, state.folders[state.currentViewCid]);
        }

        log(`[${actionName}] 执行完毕，变动了 ${count} 个标记状态。`, "success");
    }

    // ================== 高性能树刷新逻辑 ==================

    function initTreeStats(node, parent = null) {
        node.parent = parent;
        let ownTotal = 0, ownDel = 0;
        if (node.cid && state.folderGroups[node.cid]) {
            const files = state.folderGroups[node.cid];
            ownTotal = files.length;
            ownDel = files.filter(f => f._markDel).length;
        }
        let childrenTotal = 0, childrenDel = 0;
        if (node.children) {
            Object.values(node.children).forEach(child => {
                const childStats = initTreeStats(child, node);
                childrenTotal += childStats.total;
                childrenDel += childStats.del;
            });
        }
        node._stats = {
            total: ownTotal + childrenTotal,
            del: ownDel + childrenDel
        };
        return node._stats;
    }

    function updateBranchVisuals(cid) {
        if (!cid) return;
        const pathStr = state.folders[String(cid)];
        if (!pathStr) return;
        const parts = pathStr.split('/');
        let node = state.treeData;
        for (let part of parts) {
            if (part === '根目录') continue;
            if (node.children && node.children[part]) node = node.children[part];
            else return;
        }

        while (node) {
            let ownTotal = 0, ownDel = 0;
            if (node.cid && state.folderGroups[node.cid]) {
                const files = state.folderGroups[node.cid];
                ownTotal = files.length;
                ownDel = files.filter(f => f._markDel).length;
            }
            let childrenTotal = 0, childrenDel = 0;
            if (node.children) {
                Object.values(node.children).forEach(child => {
                    if (child._stats) {
                        childrenTotal += child._stats.total;
                        childrenDel += child._stats.del;
                    }
                });
            }
            node._stats = { total: ownTotal + childrenTotal, del: ownDel + childrenDel };

            const nodePath = node.virtualPath || node.name;
            const content = document.querySelector(`.dc-tree-content[data-node-path="${nodePath}"]`);
            if (content) {
                const { total, del } = node._stats;
                let badge = content.querySelector('.dc-tree-badge');
                if (!badge && total > 0) {
                     const label = content.querySelector('.dc-tree-label');
                     if(label) { badge = document.createElement('span'); label.after(badge); }
                }
                if (badge) {
                    if (total > 0) {
                        badge.innerText = `${del}/${total}`;
                        badge.className = `dc-tree-badge ${del > 0 ? 'has-dup' : ''}`;
                        badge.style.display = 'inline-block';
                    } else {
                        badge.style.display = 'none';
                    }
                }
                const dot = content.querySelector('.dc-tree-status-dot');
                if (dot) {
                    let status = 'none';
                    if (total > 0) {
                        if (del === 0) status = 'keep';
                        else if (del === total) status = 'all';
                        else status = 'mix';
                    }
                    const statusClass = { 'all': 'dot-all', 'keep': 'dot-keep', 'mix': 'dot-mix', 'none': 'dot-none' }[status];
                    dot.className = `dc-tree-status-dot ${statusClass}`;
                }
            }
            node = node.parent;
        }
    }

    function refreshAllTreeVisualsFast() {
        initTreeStats(state.treeData);
        const domMap = {};
        document.querySelectorAll('.dc-tree-content').forEach(el => {
            const path = el.getAttribute('data-node-path');
            if(path) domMap[path] = el;
        });
        const traverseAndUpdate = (node) => {
            const path = node.virtualPath || node.name;
            const content = domMap[path];
            if (content && node._stats) {
                const { total, del } = node._stats;
                let badge = content.querySelector('.dc-tree-badge');
                if (!badge && total > 0) {
                     const label = content.querySelector('.dc-tree-label');
                     if(label) { badge = document.createElement('span'); badge.className = 'dc-tree-badge'; label.after(badge); }
                }
                if (badge) {
                    if (total > 0) {
                        badge.innerText = `${del}/${total}`;
                        badge.className = `dc-tree-badge ${del > 0 ? 'has-dup' : ''}`;
                        badge.style.display = 'inline-block';
                    } else {
                        badge.style.display = 'none';
                    }
                }
                const dot = content.querySelector('.dc-tree-status-dot');
                if (dot) {
                    let status = 'none';
                    if (total > 0) {
                        if (del === 0) status = 'keep';
                        else if (del === total) status = 'all';
                        else status = 'mix';
                    }
                    const statusClass = { 'all': 'dot-all', 'keep': 'dot-keep', 'mix': 'dot-mix', 'none': 'dot-none' }[status];
                    dot.className = `dc-tree-status-dot ${statusClass}`;
                }
            }
            if (node.children) Object.values(node.children).forEach(child => traverseAndUpdate(child));
        };
        traverseAndUpdate(state.treeData);
    }

    // ================== API & Sync ==================

    const apiGet = (s, l) => {
        const url = `https://aps.115.com/repeat/repeat_list.php?s=${s}&l=${l}&_=${Date.now()}`;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: x => {
                    const json = parseJSONSafe(x.responseText);
                    resolve(json || { state: false });
                }
            });
        });
    };

    const apiPath = (cid) => {
        const url = `https://webapi.115.com/category/get?cid=${cid}`;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET", url: url,
                onload: x => resolve(parseJSONSafe(x.responseText) || {})
            });
        });
    };

    // 1. 修改删除接口：更换为通用删除接口 (webapi.115.com/rb/delete)
    const apiDel = (files) => {
        const url = `https://webapi.115.com/rb/delete`;
        return new Promise(resolve => {
            // 构建 payload: pid=0 & fid[0]=ID & fid[1]=ID ... & ignore_warn=1
            // 注意：新接口只需要 file_id，不再需要 sha1
            const fidParams = files.map((f, index) =>
                                        `${encodeURIComponent(`fid[${index}]`)}=${encodeURIComponent(f.file_id)}`
                                       ).join('&');

            // 组合最终参数字符串
            const dataStr = `pid=0&${fidParams}&ignore_warn=1`;

            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Host": "webapi.115.com",
                    "Origin": "https://webapi.115.com",
                    "Referer": "https://webapi.115.com/bridge_2.0.html?namespace=Core.DataAccess&api=UDataAPI&_t=v5",
                    "User-Agent": navigator.userAgent,
                    "X-Requested-With": "XMLHttpRequest"
                },
                data: dataStr,
                onload: x => {
                    const res = parseJSONSafe(x.responseText);
                    resolve(res || { state: false, error: "无响应" });
                },
                onerror: () => resolve({ state: false, error: "网络错误" })
            });
        });
    };

    // 2. 新增：查询删除状态接口
    const apiDeleteStatus = () => {
        const url = `https://aps.115.com/repeat/delete_status.php?_=${Date.now()}`;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    "Host": "aps.115.com",
                    "Origin": "https://aps.115.com",
                    "Referer": "https://aps.115.com/bridge_2.0.html?namespace=Core.DataAccess&api=DataAPSAPI&_t=v5",
                    "User-Agent": navigator.userAgent,
                    "X-Requested-With": "XMLHttpRequest"
                },
                onload: x => {
                    const res = parseJSONSafe(x.responseText);
                    resolve(res || { state: false }); // state:false 通常意味着空闲/完成
                },
                onerror: () => resolve({ state: false }) // 出错也当成空闲防止死循环
            });
        });
    };

    const sleep = ms => new Promise(r=>setTimeout(r,ms));

    async function toggleSyncFiles() {
        if(state.isRunning) { state.isRunning = false; return; }
        state.isRunning = true;
        const liveList = document.getElementById('live-list');
        liveList.innerHTML = '';
        log("🚀 开始同步重复文件...", "info");

        try {
            const info = await apiGet(0, 10);
            if (!info.state && info.error) throw new Error(info.error);

            const total = parseInt(info.count || 0);
            let loaded = state.files.length;

            while(loaded < total && state.isRunning) {
                const res = await apiGet(loaded, Config.batchSize);
                if(!res.data || !res.data.length) break;

                const validBatch = [];
                res.data.forEach(item => {
                    // 1. 基础校验
                    if (!item.file_id) return;

                    // 2. 【核心】黑名单校验
                    // 如果这个文件ID在我们的“已删除小本本”上，哪怕接口返回了它，也当它不存在。
                    // 这样就完美解决了“删除后索引未刷新，导致文件诈尸且pid变为0”的问题。
                    if (state.deletedHistory.has(String(item.file_id))) return;

                    // 注意：千万不要在这里过滤 parent_id === '0'
                    // 因为根目录下的正常文件 parent_id 也是 '0'。
                    // 依赖 deletedHistory 才是区分“正常根文件”和“删除后尸体”的唯一可靠手段。

                    item.file_id = String(item.file_id);
                    item.parent_id = String(item.parent_id);

                    validBatch.push(item);
                });

                if (validBatch.length > 0) {
                    await DB.putBatch('files', validBatch);
                }

                // 注意：loaded 必须按 API 返回的原始数量递增，否则会导致分页错位（漏掉后续数据）
                loaded += res.data.length;

                document.getElementById('st-files').innerText = (await DB.getAll('files')).length;
                document.getElementById('p-bar').style.width = (loaded/total*100)+'%';

                if (validBatch.length > 0) {
                    const div = document.createElement('div');
                    div.className = 'live-item';
                    div.innerHTML = `<span>📂 抓取批次 ${loaded}</span> <span style="color:#5f6368">${validBatch[0].file_name}</span>`;
                    liveList.prepend(div);
                    if(liveList.children.length > 20) liveList.lastChild.remove();
                }

                await sleep(Config.apiDelayMin);
            }
            log("文件同步结束", "success");
            await refreshStats();
        } catch(e) { log("同步异常: " + e.message, "error"); }
        state.isRunning = false;
        document.getElementById('btn-sync-files').innerText = "A. 同步文件";
    }

    async function toggleSyncPaths() {
        const btn = document.getElementById('btn-sync-paths');
        if (state.isRunning) { state.isRunning = false; return; }

        state.isRunning = true;
        btn.innerText = "停止解析";
        log("🧩 开始解析目录路径 (Greedy String ID Mode)...", "info");

        // 1.7修改：获取实时日志容器
        const liveList = document.getElementById('live-list');
        liveList.innerHTML = '';

        let errorCount = 0;
        const pids = [...new Set(state.files.map(f => String(f.parent_id)).filter(id => id && id !== "0"))];
        let pending = pids.filter(cid => !state.folders[cid]);

        log(`需解析总数: ${pids.length}, 缺失: ${pending.length}`, "info");

        try {
            for (let i = 0; i < pending.length; i++) {
                if (!state.isRunning) break;

                const cid = String(pending[i]);
                if (state.folders[cid]) {
                  log(`[跳过] cid: ${cid} 已存在数据库`, "info");
                  continue;
                }

                const res = await apiPath(cid);

                if (!res || res._errorType === 'HTML_ERROR' || res.state === false) {
                    errorCount++;
                    const waitTime = errorCount * 5000;
                    log(`⚠️ 请求异常 (第${errorCount}次)，${waitTime/1000}秒后重试...`, "warn");

                    if (errorCount >= 3) {
                        log("🚨 连续多次请求失败，为保护账号已自动关停。请在网页刷新并检查是否需要过滑块验证。", "error");
                        state.isRunning = false;
                        break;
                    }
                    await sleep(waitTime);
                    i--;
                    continue;
                }

                errorCount = 0;

                if (res.paths && res.paths.length > 0) {
                    let parentPath = "";
                    const dbBatch = [];
                    res.paths.forEach((node, idx) => {
                        const nodeId = String(node.file_id);
                        const nodeName = (idx === 0 && nodeId === "0") ? "根目录" : node.file_name;
                        if (idx === 0) {
                            parentPath = nodeName;
                        } else {
                            parentPath += "/" + nodeName;
                        }
                        if (!state.folders[nodeId]) {
                            state.folders[nodeId] = parentPath;
                            dbBatch.push({ cid: nodeId, full_path: parentPath });
                        }
                    });
                    const selfName = res.file_name || res.name;
                    let currentFullPath = "";
                    if (selfName) {
                        currentFullPath = parentPath + "/" + selfName;
                        state.folders[cid] = currentFullPath;
                        dbBatch.push({ cid: cid, full_path: currentFullPath });
                        log(`[解析成功] ${currentFullPath}`, "success");
                    } else {
                        state.folders[cid] = parentPath;
                    }

                    if (dbBatch.length > 0) {
                        await DB.putBatch('folders', dbBatch);
                        log(`[成功添加] cid: ${cid}`, "success");

                        // 1.7修改：向数据流面板输出解析进度
                        if (liveList) {
                            const div = document.createElement('div');
                            div.className = 'live-item';
                            div.innerHTML = `<span>🧩 解析目录</span> <span style="color:#5f6368">${currentFullPath || cid}</span>`;
                            liveList.prepend(div);
                            if(liveList.children.length > 20) liveList.lastChild.remove();
                        }
                    }
                }

                document.getElementById('p-bar').style.width = ((i + 1) / pending.length * 100) + '%';
                document.getElementById('st-folders').innerText = Object.keys(state.folders).length;

                await sleep(Config.apiDelayMin + Math.random() * 500);
            }
        } catch (fatal) {
            log("🔥 致命错误: " + fatal.message, "error");
        } finally {
            state.isRunning = false;
            btn.innerText = "B. 构建目录树";
            log("🏁 路径同步进程结束", "info");
            await refreshStats();
        }
    }

    function updateFinalCount() {
        let c = 0;
        if(state.files) {
            state.files.forEach(f => { if(f._markDel) c++; });
        }
        document.getElementById('st-del-final').innerText = c;
    }

    async function toggleExecute() {
        if(state.isRunning) { state.isRunning = false; return; }

        const btn = document.getElementById('btn-exec');
        // 获取所有缓存文件
        const allFiles = state.files || [];
        // 筛选出标记为删除的文件
        const toDel = allFiles.filter(f => f._markDel);
        const totalCount = toDel.length;

        if(totalCount === 0) { alert("未标记文件"); return; }
        if(!confirm(`⚠️ 安全确认：\n\n即将移入回收站 ${totalCount} 个云端文件。\n本地缓存将同步清理。\n\n确定执行吗？`)) return;

        state.isRunning = true;
        btn.innerText = "停止删除";
        log("❌ 开始执行删除 (通用接口模式)...", "warn");

        try {
            let processedCount = 0;
            let currentIndex = 0;

            while(currentIndex < totalCount) {
                if(!state.isRunning) break;

                // 1. 切片
                const chunk = toDel.slice(currentIndex, currentIndex + Config.deleteBatchSize);
                if (chunk.length === 0) break;

                // 2. 发送请求 (rb/delete)
                const res = await apiDel(chunk);
                log(`删除请求响应：${JSON.stringify(res)}`,"info");

                // --- 分支 A: 成功 ---
                if (res && res.state) {
                    const deletedIds = chunk.map(f => String(f.file_id));
                    const affectedSha1s = new Set(chunk.map(f => f.sha1));

                    // 1. 更新内存黑名单
                    deletedIds.forEach(id => state.deletedHistory.add(id));

                    // 2. 【新增】持久化写入黑名单到数据库 (防止刷新丢失)
                    const historyItems = deletedIds.map(id => ({ file_id: id }));
                    await DB.putBatch('history', historyItems);

                    // 3.1 移除被删文件
                    await DB.deleteBatch('files', deletedIds);
                    state.files = state.files.filter(f => !deletedIds.includes(String(f.file_id)));

                    // 3.2 清理剩下的“光杆司令”（唯一文件）
                    if (affectedSha1s.size > 0) {
                        const checkMap = {};
                        affectedSha1s.forEach(s => checkMap[s] = []);
                        state.files.forEach(f => {
                            if (checkMap[f.sha1]) checkMap[f.sha1].push(f);
                        });
                        const survivorIdsToRemove = [];
                        Object.values(checkMap).forEach(list => {
                            if (list.length === 1) survivorIdsToRemove.push(String(list[0].file_id));
                        });
                        if (survivorIdsToRemove.length > 0) {
                            await DB.deleteBatch('files', survivorIdsToRemove);
                            state.files = state.files.filter(f => !survivorIdsToRemove.includes(String(f.file_id)));
                            log(`🧹 自动清理: ${survivorIdsToRemove.length} 个已完成去重的剩余文件从列表移除`, "info");
                        }
                    }

                    // 4. 进度推进
                    currentIndex += chunk.length;
                    processedCount += chunk.length;

                    updateFinalCount();
                    document.getElementById('p-bar').style.width = (processedCount / totalCount * 100) + '%';
                    log(`✅ 批次处理完毕 (本批 ${chunk.length} 个)`, "success");

                    // 【冷却时间】虽然新接口很快，但为了防止触发风控，建议保留 1.5 秒间隔
                    await sleep(1500);

                }
                // --- 分支 B: 验证码拦截 ---
                else if (res && res._errorType === 'HTML_ERROR') {
                    log("🚫 请求被拦截(可能需要验证码)，脚本已停止。", "error");
                    state.isRunning = false;
                    break;
                }
                // --- 分支 C: 错误重试 ---
                else {
                    const errMsg = res ? (res.error || res.msg || '未知错误') : '请求无响应';
                    log(`❌ 提交失败: ${errMsg}，暂停 5 秒后重试...`, "error");
                    await sleep(5000);
                }
            }
        } catch (e) {
            log("🔥 致命异常: " + e.message, "error");
        } finally {
            state.isRunning = false;
            btn.innerText = "确认并开始删除";
            log("🏁 删除流程结束", "info");
            refreshStats();
        }
    }


    window.onload = initUI;
})();

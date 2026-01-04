// ==UserScript==
// @name         98助学助手
// @namespace    98BAMI
// @author       AI
// @description  在当前页面以漂亮的侧边栏形式阅读帖子内容。支持全参数自定义。智能识别资源链接与解压密码。自动记录已读历史，支持滚动自动标记已读，支持一键显隐已读状态。
// @match        https://www.sehuatang.org/forum*
// @match        https://sehuatang.org/forum*
// @match        https://www.sehuatang.net/forum*
// @match        https://sehuatang.net/forum*
// @exclude      *mod=forumdisplay&fid=95*
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @version      1.0.0
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560929/98%E5%8A%A9%E5%AD%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560929/98%E5%8A%A9%E5%AD%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$(document).ready(function () {
    'use strict';

    // === 1. 基础环境检测 ===
    const $targetTable = $('#threadlisttableid');
    const currentFid = new URLSearchParams(window.location.search).get('fid') || 'misc';
    const isListAvailable = $targetTable.length > 0;

    // === 2. 配置系统 ===
    const defaultConfig = {
        disabledFids: [],
        pageWidth: '98%',
        gridColumns: 1,
        maxPreview: 3,
        imgHeight: 300,
        imgsPerRow: 3,
        imageFit: 'contain',
        requestDelay: 100,
        autoCollapse: 1,
        scanKeywords: "密码,解压,Pass,密碼,提取码",
        fileKeywords: ".zip,.rar,.7z,.tar,.gz,.txt,action=reply",
        readMarkMode: 'scroll', // 'scroll' or 'hover'
        readMarkDelay: 1000,
        dimReadPosts: true,     // 新增：是否让已读帖子变灰
        navPos: { top: '100px', right: '20px' }
    };

    const config = {
        disabledFids: GM_getValue('disabledFids', defaultConfig.disabledFids),
        pageWidth: GM_getValue('pageWidth', defaultConfig.pageWidth),
        gridColumns: GM_getValue('gridColumns', defaultConfig.gridColumns),
        maxPreview: GM_getValue('maxPreview', defaultConfig.maxPreview),
        imgHeight: GM_getValue('imgHeight', defaultConfig.imgHeight),
        imgsPerRow: GM_getValue('imgsPerRow', defaultConfig.imgsPerRow),
        imageFit: GM_getValue('imageFit', defaultConfig.imageFit),
        requestDelay: GM_getValue('requestDelay', defaultConfig.requestDelay),
        autoCollapse: GM_getValue('autoCollapse', defaultConfig.autoCollapse),
        scanKeywords: GM_getValue('scanKeywords', defaultConfig.scanKeywords),
        fileKeywords: GM_getValue('fileKeywords', defaultConfig.fileKeywords),
        readMarkMode: GM_getValue('readMarkMode', defaultConfig.readMarkMode),
        readMarkDelay: GM_getValue('readMarkDelay', defaultConfig.readMarkDelay),
        dimReadPosts: GM_getValue('dimReadPosts', defaultConfig.dimReadPosts),
        navPos: GM_getValue('navPos', defaultConfig.navPos)
    };

    // 如果开启了变灰功能，给body加一个class
    if (config.dimReadPosts) {
        $('body').addClass('enable-read-dimming');
    }

    let readHistory = GM_getValue('readHistory_v2', {});
    const isEnabled = isListAvailable && !config.disabledFids.includes(currentFid);

    $('body').append('<script src="//lib.baomitu.com/jquery.lazyload/1.9.1/jquery.lazyload.min.js" type="text/javascript"></script>');

    // === 3. SVG图标定义 ===
    const SVGS = {
        gear: '<svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12-0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>',
        close: '<svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>',
        left: '<svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/></svg>',
        right: '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/></svg>',
        nav: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z"/></svg>',
        key: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M12.65,10C11.83,7.67 9.61,6 7,6A6,6 0 0,0 1,12A6,6 0 0,0 7,18C9.61,18 11.83,16.33 12.65,14H17V18H21V14H23V10H12.65M7,14A2,2 0 1,1 9,12A2,2 0 0,1 7,14Z"/></svg>',
        cloud: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04Z"/></svg>',
        file: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M13,9V3.5L18.5,9M6,2C4.89,2 4,2.89 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6Z"/></svg>',
        up: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/></svg>',
        down: '<svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z"/></svg>',
    };

    // === 4. CSS ===
    let cssStyles = `
        #settings-float-btn { position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; background: #fff; border-radius: 50%; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9999; transition: transform 0.3s; opacity: 0.8; }
        #settings-float-btn:hover { transform: rotate(90deg); opacity: 1; }
        #settings-float-btn svg { width: 24px; height: 24px; fill: #555; }
        #settings-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 100000; align-items: center; justify-content: center; }
        .settings-card { background: #fff; padding: 25px; border-radius: 12px; width: 520px; max-width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
        .settings-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-on { background: #e6fffa; color: #009688; border: 1px solid #b2f5ea; }
        .status-off { background: #fff5f5; color: #e53e3e; border: 1px solid #fed7d7; }
        .form-section { margin-bottom: 15px; border: 1px solid #f0f0f0; border-radius: 8px; padding: 15px; background: #fafafa; }
        .form-section-title { font-size: 13px; font-weight: bold; color: #555; margin-bottom: 10px; display: block; }
        .form-row { display: flex; gap: 15px; margin-bottom: 10px; }
        .form-group { flex: 1; }
        .form-group label { display: block; margin-bottom: 5px; color: #666; font-size: 12px; }
        .form-group input, .form-group select { width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 13px; }
        .toggle-btn { width: 100%; padding: 10px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .btn-enable { background: #48bb78; color: white; }
        .btn-disable { background: #f56565; color: white; }
        .settings-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
        .actions-right { display: flex; gap: 10px; }
        .btn-save { background: #3182ce; color: white; border: none; padding: 8px 25px; border-radius: 4px; cursor: pointer; }
        .btn-cancel { background: #edf2f7; color: #4a5568; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
        .btn-reset { background: transparent; color: #e53e3e; border: 1px solid #e53e3e; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .btn-reset:hover { background: #fff5f5; }
    `;

    if (isEnabled) {
        cssStyles += `
            #append_parent, .fwinmask, .fwin, .ntcwin { z-index: 20000 !important; }
            .wp, #wp { width: ${config.pageWidth} !important; max-width: 100% !important; min-width: 1000px !important; margin: 0 auto !important; }
            #my-thread-grid { display: grid; gap: 20px; padding: 10px 0 30px 0; width: 100%; box-sizing: border-box; grid-template-columns: repeat(${config.gridColumns}, 1fr); }
            @media (max-width: 1600px) { #my-thread-grid { grid-template-columns: repeat(3, 1fr); } }
            @media (max-width: 1000px) { #my-thread-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 600px)  { #my-thread-grid { grid-template-columns: 1fr; } }
            .res-wrapper { background: #fff; border-radius: 8px; border: 1px solid #eee; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s, opacity 0.3s; display: flex; flex-direction: column; overflow: hidden; height: 100%; position: relative; }
            .res-wrapper:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); border-color: #ccc; z-index: 5; }

            /* --- 已读状态样式优化 --- */
            /* 只有当 body 有 enable-read-dimming 类时，已读帖子才变灰 */
            body.enable-read-dimming .res-wrapper.is-read { opacity: 0.6; filter: grayscale(1); border-color: #f0f0f0; box-shadow: none; }
            body.enable-read-dimming .res-wrapper.is-read:hover { opacity: 1; filter: grayscale(0); transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.1); }

            .res-card-content { padding: 15px; flex: 1; display: flex; flex-direction: column; }
            .res-title-preview { margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #2c3e50; text-decoration: none; display: block; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .res-title-preview:hover { color: #3498db; }
            .res-image-box { display: grid; grid-template-columns: repeat(${config.imgsPerRow}, 1fr); gap: 4px; width: 100%; margin-bottom: auto; }
            .res-image-item { width: 100%; height: ${config.imgHeight}px; object-fit: ${config.imageFit}; background: #f9f9f9; border: 1px solid #eee; border-radius: 4px; cursor: pointer; transition: opacity 0.2s; }
            .res-image-item:hover { opacity: 0.8; border-color: #bbb; }
            .res-footer { background: #fbfbfb; border-top: 1px solid #eee; padding: 10px 15px; font-size: 12px; }
            .res-action-bar { display: flex; gap: 10px; margin-bottom: 10px; }
            .btn-base { flex: 1; border: none; border-radius: 6px; padding: 6px 0; cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; }
            .btn-read { background: #e3f2fd; color: #1565c0; } .btn-read:hover { background: #bbdefb; }
            .btn-copy-all { background: #f0f0f0; color: #555; } .btn-copy-all:hover { background: #e0e0e0; color: #333; }
            .btn-copied { background: #e8f5e9 !important; color: #2e7d32 !important; }
            .res-list { list-style: none; padding: 0; margin: 0; }
            .res-entry { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid #eee; }
            .res-link-text { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #666; font-family: monospace; font-size: 11px; margin-right: 8px; }
            .res-tag { display: inline-block; padding: 1px 6px; border-radius: 10px; font-size: 10px; margin-right: 6px; vertical-align: middle; font-weight: 600; }
            .tag-mag { background: #ffebee; color: #c62828; } .tag-ed2k { background: #e3f2fd; color: #1565c0; }
            .btn-small-copy { background: #fff; border: 1px solid #ddd; color: #888; padding: 1px 6px; border-radius: 4px; cursor: pointer; font-size: 11px; }
            .btn-small-copy:hover { border-color: #999; color: #333; background: #f9f9f9; }
            .grid-placeholder { background: #fff; border-radius: 8px; height: ${parseInt(config.imgHeight) * 2 + 100}px; border: 2px dashed #f0f0f0; display: flex; align-items: center; justify-content: center; color: #ccc; }
            #gallery-modal { display: none; position: fixed; z-index: 2147483647; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.95); user-select: none; }
            .gallery-top-bar { position: absolute; top: 0; left: 0; width: 100%; height: 60px; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; box-sizing: border-box; color: #eee; background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent); z-index: 20002; }
            .gallery-counter { font-size: 16px; font-weight: bold; letter-spacing: 1px; }
            .gallery-close { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; background: rgba(255,255,255,0.1); transition: 0.2s; }
            .gallery-close:hover { background: rgba(255,255,255,0.3); }
            .gallery-close svg { width: 20px; height: 20px; fill: #fff; }
            .gallery-main-area { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding-bottom: 100px; box-sizing: border-box; }
            #gallery-img { max-width: 90%; max-height: 90%; object-fit: contain; opacity: 0; transition: opacity 0.2s; }
            .gallery-loader { position: absolute; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; z-index: 20001; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .gallery-nav-btn { position: absolute; top: 50%; transform: translateY(-50%); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); cursor: pointer; z-index: 20002; transition: all 0.2s; }
            .gallery-nav-btn:hover { background: rgba(255,255,255,0.3); }
            .gallery-nav-btn svg { width: 30px; height: 30px; fill: #fff; }
            #gallery-prev { left: 30px; }
            #gallery-next { right: 30px; }
            .gallery-thumb-bar { position: absolute; bottom: 0; left: 0; width: 100%; height: 100px; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; overflow-x: auto; z-index: 20002; padding: 0 20px; gap: 10px; }
            .gallery-thumb-item { width: 70px; height: 70px; flex-shrink: 0; object-fit: cover; border-radius: 4px; border: 2px solid transparent; cursor: pointer; opacity: 0.5; transition: all 0.2s; }
            .gallery-thumb-item:hover { opacity: 0.8; }
            .gallery-thumb-item.active { border-color: #3498db; opacity: 1; transform: scale(1.1); }

            #read-drawer-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); z-index: 10000; backdrop-filter: blur(4px); }
            #read-drawer { position: fixed; top: 0; right: -900px; width: 850px; height: 100%; background: #fff; z-index: 10001; box-shadow: -10px 0 40px rgba(0,0,0,0.1); transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; }
            #read-drawer.open { right: 0; }
            .drawer-header { padding: 20px 30px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #fff; z-index: 10; position: relative; flex-shrink: 0; }
            .drawer-title { font-size: 20px; font-weight: 700; color: #333; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; margin-right: 20px; }
            .drawer-close-btn { border: none; background: none; font-size: 28px; cursor: pointer; color: #999; display: flex; align-items: center; }
            .drawer-close-btn svg { width: 24px; height: 24px; fill: #666; }
            .drawer-body { flex: 1; overflow-y: auto !important; overflow-x: hidden !important; padding: 30px 40px 100px 30px; position: relative; overscroll-behavior: contain; scroll-behavior: smooth; }
            .drawer-content { width: 100%; box-sizing: border-box; }
            .drawer-content img { max-width: 100% !important; height: auto !important; display: block; margin: 20px 0; border-radius: 8px; background: #fafafa; box-sizing: border-box !important; border: 1px solid transparent !important; }
            .drawer-content a:hover img { border-color: transparent !important; }
            .drawer-loading { text-align: center; padding: 100px; color: #aaa; }

            #drawer-quick-nav { position: fixed; width: 220px; background: rgba(255,255,255,0.98); border: 1px solid rgba(200,200,200,0.5); border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); backdrop-filter: blur(8px); z-index: 10005; overflow: hidden; display: flex; flex-direction: column; transition: opacity 0.3s; pointer-events: auto; }
            .nav-card-header { padding: 12px 15px; background: #f1f5f9; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 800; color: #4a5568; display: flex; align-items: center; gap: 8px; cursor: move; user-select: none; }
            .nav-list { padding: 8px; max-height: 400px; overflow-y: auto; }
            .nav-item { display: flex; align-items: center; padding: 8px 10px; margin-bottom: 4px; background: transparent; border-radius: 6px; cursor: pointer; font-size: 12px; color: #4a5568; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent; }
            .nav-item:hover { background: #f8fafc; transform: translateX(2px); }
            .nav-icon { margin-right: 8px; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
            .nav-icon svg { width: 14px; height: 14px; }
            .nav-item.type-pass { border-left-color: #f56565; } .nav-item.type-pass .nav-icon { color: #f56565; }
            .nav-item.type-file { border-left-color: #4299e1; } .nav-item.type-file .nav-icon { color: #4299e1; }
            .nav-divider { height: 1px; background: #eee; margin: 4px 8px; }

            .highlight-box { display: inline-block; padding: 1px 6px; border-radius: 4px; font-weight: bold; border: 1px dashed; margin: 0 2px; font-size: 0.9em; box-sizing: border-box; }
            .highlight-pass { background: #fff5f5; color: #c53030; border-color: #fc8181; }
            .highlight-file { background: #ebf8ff; color: #2b6cb0; border-color: #63b3ed; }
            .nav-list::-webkit-scrollbar { width: 4px; }
            .nav-list::-webkit-scrollbar-track { background: transparent; }
            .nav-list::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 2px; }
            .blockcode { padding: 5px 40px;border:1px solid #CCC; em { color:#369 !important;cursor:pointer;} }
        `;
    }
    $('head').append(`<style>${cssStyles}</style>`);

    // === 5. DOM 注入 ===
    const toggleBtnHtml = isEnabled
        ? `<button class="toggle-btn btn-disable" id="toggle-forum">在此版块(FID:${currentFid}) 停用脚本</button>`
        : `<button class="toggle-btn btn-enable" id="toggle-forum">在此版块(FID:${currentFid}) 启用脚本</button>`;
    const statusHtml = isEnabled ? `<span class="status-badge status-on">运行中</span>` : `<span class="status-badge status-off">已禁用</span>`;

    $('body').append(`
        <div id="settings-float-btn" title="脚本设置" style="${!isEnabled ? 'filter: grayscale(1);' : ''}">${SVGS.gear}</div>
        <div id="settings-modal">
            <div class="settings-card">
                <div class="settings-header"><h3>浏览助手设置</h3>${statusHtml}</div>
                <div class="form-section" style="text-align: center;">${isListAvailable ? toggleBtnHtml : '<span style="color:#999;font-size:12px;">当前页面无帖子列表</span>'}</div>
                <span class="form-section-title">页面与网格</span>
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-group"><label>页面宽度</label><input type="text" id="cfg-width" value="${config.pageWidth}"></div>
                        <div class="form-group"><label>网格最大列数</label><input type="number" id="cfg-cols" min="3" max="6" value="${config.gridColumns}"></div>
                    </div>
                </div>
                <span class="form-section-title">阅读标记配置</span>
                <div class="form-section">
                     <div class="form-row">
                        <div class="form-group"><label>标记模式</label><select id="cfg-read-mode"><option value="scroll" ${config.readMarkMode==='scroll'?'selected':''}>滚动可视区域自动标记 (推荐)</option><option value="hover" ${config.readMarkMode==='hover'?'selected':''}>鼠标悬停标记</option></select></div>
                        <div class="form-group"><label>已读变灰开关</label><select id="cfg-dim-read"><option value="1" ${config.dimReadPosts?'selected':''}>开启变灰</option><option value="0" ${!config.dimReadPosts?'selected':''}>关闭变灰</option></select></div>
                     </div>
                     <div class="form-group"><label>判定延迟 (毫秒)</label><input type="number" id="cfg-read-delay" value="${config.readMarkDelay}" title="在屏幕或鼠标停留多久后变灰"></div>
                </div>
                <span class="form-section-title">功能配置</span>
                <div class="form-section">
                     <div class="form-group"><label>密码关键词</label><input type="text" id="cfg-keywords" value="${config.scanKeywords}"></div>
                     <div class="form-group"><label>文件关键词</label><input type="text" id="cfg-files" value="${config.fileKeywords}"></div>
                </div>
                <span class="form-section-title">图片显示</span>
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-group"><label>图片高度(px)</label><input type="number" id="cfg-imgheight" value="${config.imgHeight}"></div>
                        <div class="form-group"><label>卡片内列数</label><input type="number" id="cfg-subcols" min="1" max="5" value="${config.imgsPerRow}"></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group"><label>预览数量</label><input type="number" id="cfg-maxprev" value="${config.maxPreview}"></div>
                        <div class="form-group"><label>填充模式</label><select id="cfg-fit"><option value="cover" ${config.imageFit==='cover'?'selected':''}>铺满裁剪</option><option value="contain" ${config.imageFit==='contain'?'selected':''}>完整显示</option></select></div>
                    </div>
                </div>
                <div class="settings-actions">
                    <button class="btn-reset" id="cfg-reset">恢复默认</button>
                    <div class="actions-right">
                        <button class="btn-cancel" id="cfg-cancel">关闭</button>
                        <button class="btn-save" id="cfg-save">保存并刷新</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    if (isEnabled) {
        $('body').append(`
            <div id="read-drawer-overlay"></div>
            <div id="read-drawer">
                <div class="drawer-header"><div class="drawer-title" id="drawer-title-text"></div><button class="drawer-close-btn" id="drawer-close">${SVGS.close}</button></div>
                <div class="drawer-body" id="drawer-body-content"></div>
            </div>
        `);
        $('body').append(`
            <div id="gallery-modal"><div class="gallery-top-bar"><div class="gallery-counter">1 / 1</div><div class="gallery-close" id="gallery-close">${SVGS.close}</div></div><div class="gallery-main-area"><div class="gallery-loader"></div><div id="gallery-prev" class="gallery-nav-btn">${SVGS.left}</div><img id="gallery-img" src=""><div id="gallery-next" class="gallery-nav-btn">${SVGS.right}</div></div><div class="gallery-thumb-bar" id="gallery-thumbs"></div></div>
        `);
    }

    // === 6. 设置交互 ===
    $('#settings-float-btn').click(() => $('#settings-modal').css('display', 'flex'));
    $('#cfg-cancel').click(() => $('#settings-modal').hide());
    $('#settings-modal').click((e) => { if(e.target.id === 'settings-modal') $('#settings-modal').hide(); });
    $('#toggle-forum').click(function() {
        let disabledList = config.disabledFids;
        if (isEnabled) { if (!disabledList.includes(currentFid)) disabledList.push(currentFid); }
        else { disabledList = disabledList.filter(id => id !== currentFid); }
        GM_setValue('disabledFids', disabledList);
        location.reload();
    });
    $('#cfg-save').click(() => {
        GM_setValue('pageWidth', $('#cfg-width').val() || '98%');
        GM_setValue('gridColumns', parseInt($('#cfg-cols').val()) || 1);
        GM_setValue('imgHeight', parseInt($('#cfg-imgheight').val()) || 300);
        GM_setValue('imgsPerRow', parseInt($('#cfg-subcols').val()) || 3);
        GM_setValue('maxPreview', parseInt($('#cfg-maxprev').val()) || 0);
        GM_setValue('imageFit', $('#cfg-fit').val());
        GM_setValue('readMarkMode', $('#cfg-read-mode').val());
        GM_setValue('readMarkDelay', parseInt($('#cfg-read-delay').val()) || 1000);
        GM_setValue('dimReadPosts', $('#cfg-dim-read').val() === '1');
        GM_setValue('scanKeywords', $('#cfg-keywords').val());
        GM_setValue('fileKeywords', $('#cfg-files').val());
        location.reload();
    });
    $('#cfg-reset').click(() => {
        if(confirm('确定要恢复所有默认设置吗？')) {
            const keys = GM_listValues();
            keys.forEach(key => GM_deleteValue(key));
            location.reload();
        }
    });

    if (!isEnabled) return;

    // === 7. Gallery 逻辑 ===
    const $galleryModal = $('#gallery-modal');
    const $galleryImg = $('#gallery-img');
    const $galleryThumbs = $('#gallery-thumbs');
    const $galleryCounter = $('.gallery-counter');
    const $galleryLoader = $('.gallery-loader');
    let currentGalleryImages = [];
    let currentGalleryIndex = 0;
    let isGalleryWheeling = false;

    window.openGallery = function(imgList, startIndex) {
        currentGalleryImages = imgList;
        currentGalleryIndex = startIndex;
        renderThumbnails();
        $galleryModal.fadeIn(200);
        updateGalleryUI();

        $(document).on('keydown.gallery', function(e) {
            if (e.key === "ArrowLeft") changeGalleryImage(-1);
            if (e.key === "ArrowRight") changeGalleryImage(1);
            if (e.key === "Escape") closeGallery();
        });

        $galleryModal.on('wheel.gallery', function(e) {
            e.preventDefault();
            if (isGalleryWheeling) return;
            isGalleryWheeling = true;
            setTimeout(() => { isGalleryWheeling = false; }, 200);
            if (e.originalEvent.deltaY > 0) changeGalleryImage(1);
            else changeGalleryImage(-1);
        });
    };

    function closeGallery() {
        $galleryModal.fadeOut(200);
        $(document).off('keydown.gallery');
        $galleryModal.off('wheel.gallery');
    }
    function changeGalleryImage(step) { let newIndex = currentGalleryIndex + step; if (newIndex >= 0 && newIndex < currentGalleryImages.length) { currentGalleryIndex = newIndex; updateGalleryUI(); } }
    function updateGalleryUI() {
        let src = currentGalleryImages[currentGalleryIndex];
        $galleryImg.css('opacity', 0);
        $galleryLoader.show();
        $galleryImg.attr('src', src);
        $galleryImg.one('load', function() { $galleryLoader.hide(); $(this).css('opacity', 1); });
        setTimeout(() => { if($galleryImg[0].complete) { $galleryLoader.hide(); $galleryImg.css('opacity', 1); } }, 100);
        $galleryCounter.text(`${currentGalleryIndex + 1} / ${currentGalleryImages.length}`);
        $('.gallery-thumb-item').removeClass('active');
        let activeThumb = $(`.gallery-thumb-item[data-idx="${currentGalleryIndex}"]`);
        activeThumb.addClass('active');
        if(activeThumb.length) {
            let container = $galleryThumbs[0];
            let scrollLeft = activeThumb[0].offsetLeft - (container.clientWidth / 2) + (activeThumb[0].clientWidth / 2);
            $galleryThumbs.animate({scrollLeft: scrollLeft}, 200);
        }
        $('#gallery-prev').css('opacity', currentGalleryIndex === 0 ? '0.2' : '1');
        $('#gallery-next').css('opacity', currentGalleryIndex === currentGalleryImages.length - 1 ? '0.2' : '1');
    }
    function renderThumbnails() {
        $galleryThumbs.empty();
        currentGalleryImages.forEach((src, idx) => {
            let $thumb = $(`<img class="gallery-thumb-item" src="${src}" data-idx="${idx}">`);
            $thumb.click(function(e) { e.stopPropagation(); currentGalleryIndex = idx; updateGalleryUI(); });
            $galleryThumbs.append($thumb);
        });
    }
    $('#gallery-close').click(closeGallery);
    $galleryModal.click((e) => { if(e.target.id === 'gallery-modal' || e.target.classList.contains('gallery-main-area')) closeGallery(); });
    $('#gallery-prev').click((e) => { e.stopPropagation(); changeGalleryImage(-1); });
    $('#gallery-next').click((e) => { e.stopPropagation(); changeGalleryImage(1); });

    // === 8. 阅读抽屉与导航逻辑 ===
    const $drawerOverlay = $('#read-drawer-overlay');
    const $drawer = $('#read-drawer');
    const $drawerTitle = $('#drawer-title-text');
    const $drawerBody = $('#drawer-body-content');
    let currentDrawerUrl = '';
    let currentDrawerTitle = '';

    // 防刷新Hook
    function installRobustHooks() {
        const targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        const refreshDrawerContent = () => {
            if ($('#read-drawer').hasClass('open') && currentDrawerUrl) {
                if (targetWindow.hideWindow) { targetWindow.hideWindow('reply'); targetWindow.hideWindow('k_misign'); }
                openDrawer(currentDrawerTitle, currentDrawerUrl);
                return true;
            }
            return false;
        };
        const mySucceedHandleReply = function (locationhref, message, param) {
            if(targetWindow.hideWindow) targetWindow.hideWindow('reply');
            if(targetWindow.showDialog) targetWindow.showDialog(message, 'right', '', null, true, null, '', '', '', 3);
            if (!refreshDrawerContent()) targetWindow.location.href = locationhref;
        };
        const mySucceedHandleFastPost = function (locationhref, message, param) {
            if(targetWindow.hideWindow) targetWindow.hideWindow('reply');
            if(targetWindow.showDialog) targetWindow.showDialog(message, 'right', '', null, true, null, '', '', '', 3);
            if (!refreshDrawerContent()) targetWindow.location.href = locationhref;
        };
        const myReplyReload = function (tid, result, reloadurl) {
            if (!refreshDrawerContent()) targetWindow.location.reload();
        };
        targetWindow.succeedhandle_reply = mySucceedHandleReply;
        targetWindow.succeedhandle_fastpost = mySucceedHandleFastPost;
        targetWindow.replyreload = myReplyReload;
        if (!targetWindow.originalEvalscript) {
            targetWindow.originalEvalscript = targetWindow.evalscript;
            targetWindow.evalscript = function(s) {
                targetWindow.succeedhandle_reply = mySucceedHandleReply;
                targetWindow.succeedhandle_fastpost = mySucceedHandleFastPost;
                targetWindow.replyreload = myReplyReload;
                return targetWindow.originalEvalscript(s);
            };
        }
    }
    installRobustHooks();
    $(document).ajaxComplete(installRobustHooks);

    function openDrawer(title, url) {
        currentDrawerUrl = url;
        currentDrawerTitle = title;
        $drawerTitle.text(title);
        $drawerBody.html('<div class="drawer-loading">正在加载...</div>');

        $('#drawer-quick-nav').remove();

        $drawerOverlay.fadeIn(250);
        $drawer.addClass('open');
        $('body').css('overflow', 'hidden');

        $.ajax({
            url: url, type: 'GET', dataType: 'html',
            success: function(data) {
                try {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(data, "text/html");

                    let scripts = doc.querySelectorAll('script');
                    scripts.forEach(script => script.remove());

                    let allElements = doc.querySelectorAll('*');
                    allElements.forEach(el => {
                        let clickCode = el.getAttribute('onclick');
                        if (clickCode && (clickCode.includes('showWindow') || clickCode.includes('copycode'))) {
                            let match = clickCode.match(/showWindow\s*\(\s*['"]([^'"]+)['"]/);
                            if (match) el.setAttribute('data-sw-key', match[1]);
                        } else {
                            el.removeAttribute('onclick');
                        }
                        el.removeAttribute('onload');
                        el.removeAttribute('onmouseover');
                        el.removeAttribute('onmouseout');
                        el.removeAttribute('onerror');
                        //el.removeAttribute('id');
                    });

                    let content = doc.querySelector(".t_fsz") || doc.querySelector("#postlist div[id^='post_'] .t_f");

                    if (content) {
                        let $tempContent = $(`<div class="drawer-content" style="position:relative;"></div>`);
                        $tempContent.html(content.innerHTML);

                        let galleryImages = [];
                        let $imgs = $tempContent.find('img');
                        $imgs.each(function() {
                            let $this = $(this);
                            let realSrc = $this.attr('zoomfile') || $this.attr('file') || $this.attr('src');
                            if (realSrc && !realSrc.includes('smilies') && !realSrc.includes('none.gif')) {
                                $this.attr('src', realSrc);
                                if (realSrc.startsWith('http') || realSrc.startsWith('//')) {
                                    $this.addClass('gallery-item');
                                    $this.data('gallery-idx', galleryImages.length);
                                    galleryImages.push(realSrc);
                                    $this.css('cursor', 'pointer');
                                }
                            }
                        });
                        $tempContent.on('click', '.gallery-item', function(e) {
                            e.preventDefault(); e.stopPropagation();
                            window.openGallery(galleryImages, $(this).data('gallery-idx'));
                        });

                        scanAndBuildNav($tempContent);
                        $drawerBody.empty().append($tempContent);
                    } else { $drawerBody.html('<div class="drawer-loading">无法解析内容</div>'); }
                } catch (e) { console.error(e); $drawerBody.html('<div class="drawer-loading">解析错误</div>'); }
            },
            error: function() { $drawerBody.html('<div class="drawer-loading">加载失败</div>'); }
        });
    }

    // === 拖动功能函数 ===
    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = el.querySelector(".nav-card-header");
        if (header) header.onmousedown = dragMouseDown;
        else el.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            let newTop = (el.offsetTop - pos2);
            let newLeft = (el.offsetLeft - pos1);
            if(newTop < 0) newTop = 0;
            if(newLeft < 0) newLeft = 0;
            el.style.top = newTop + "px";
            el.style.left = newLeft + "px";
            el.style.right = 'auto';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            config.navPos = { top: el.style.top, left: el.style.left, right: 'auto' };
            GM_setValue('navPos', config.navPos);
        }
    }

    // === 扫描内容并构建可拖动导航栏 ===
    function scanAndBuildNav(container) {
        let navItems = [];
        let count = 0;

        const keywordList = config.scanKeywords.split(/[,，]/).map(k => k.trim()).filter(k => k);
        const fileKeyList = config.fileKeywords.split(/[,，]/).map(k => k.trim()).filter(k => k);
        const keywordsPattern = keywordList.join('|');
        const scanRegex = new RegExp(`(${keywordsPattern})`, 'gi');

        let walker = document.createTreeWalker(container[0], NodeFilter.SHOW_TEXT, null, false);
        let node;
        let nodesToProcess = [];
        while(node = walker.nextNode()) {
            if(node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') continue;
            if (scanRegex.test(node.nodeValue)) nodesToProcess.push(node);
            scanRegex.lastIndex = 0;
        }

        nodesToProcess.forEach(textNode => {
            let val = textNode.nodeValue;
            let match;
            scanRegex.lastIndex = 0;
            if ((match = scanRegex.exec(val)) !== null) {
                let id = `qs-res-${count}`;
                let rawTail = val.substring(match.index + match[0].length);
                let cleanTail = rawTail.replace(/^[:：\s\-—_为is是]+/, '');
                let potentialPass = cleanTail.trim().split(/\s+/, 1)[0];

                if (cleanTail.length > 0 && potentialPass.length > 0 && potentialPass.length < 25) {
                    let span = document.createElement('span');
                    span.className = 'highlight-box highlight-pass';
                    span.textContent = `[密码] ${potentialPass}`;
                    span.id = id;
                    let frag = document.createDocumentFragment();
                    frag.appendChild(document.createTextNode(val.substring(0, match.index)));
                    frag.appendChild(span);
                    frag.appendChild(document.createTextNode(rawTail.substring(rawTail.indexOf(potentialPass) + potentialPass.length)));
                    if(textNode.parentNode) {
                        textNode.parentNode.replaceChild(frag, textNode);
                        navItems.push({id: id, text: `密码: ${potentialPass}`, type: 'type-pass', icon: SVGS.key});
                        count++;
                    }
                }
                else {
                    let nextNode = textNode.nextSibling;
                    while(nextNode && (nextNode.nodeType === 3 && !nextNode.nodeValue.trim())) {
                        nextNode = nextNode.nextSibling;
                    }
                    if (nextNode && nextNode.nodeType === 1) {
                        if (['A', 'STRONG', 'B', 'SPAN', 'FONT', 'U', 'I'].includes(nextNode.tagName)) {
                            let linkText = nextNode.innerText.trim();
                            if(linkText.length > 0 && linkText.length < 50) {
                                $(nextNode).addClass('highlight-box highlight-pass').attr('id', id);
                                navItems.push({id: id, text: `密码: ${linkText.substring(0,15)}`, type: 'type-pass', icon: SVGS.key});
                                count++;
                            }
                        }
                    }
                }
            }
        });

        container.find('a').each(function() {
            let $this = $(this);
            if($this.hasClass('highlight-pass')) return;
            let href = $this.attr('href');
            let text = $this.text().trim();
            if(!href) return;
            if (text === '下载附件' || text === '点击下载' || text === '保存到相册' || text.includes('积分购买')) return;
            if (href.startsWith('javascript')) return;

            let isRes = false;
            let lowerHref = href.toLowerCase();
            for (let key of fileKeyList) {
                if (lowerHref.includes(key.toLowerCase()) || text.toLowerCase().includes(key.toLowerCase())) {
                    isRes = true; break;
                }
            }
            if ((href.includes('aid=') || href.includes('mobile=yes')) && $this.parents('.attnm, .p_att, .t_fsz, .t_f').length) isRes = true;

            if (isRes) {
                let id = `qs-res-${count}`;
                $this.attr('id', id).addClass('highlight-box highlight-file');
                let iconSvg = (lowerHref.includes('pan') || lowerHref.includes('drive')) ? SVGS.cloud : SVGS.file;
                let prefix = (lowerHref.includes('pan') || lowerHref.includes('drive')) ? '[网盘]' : '[附件]';
                navItems.push({id: id, text: `${prefix} ${text.substring(0, 15)}`, type: 'type-file', icon: iconSvg});
                count++;
            }
        });

        let $nav = $(`
            <div id="drawer-quick-nav" style="top:${config.navPos.top}; left:${config.navPos.left||'auto'}; right:${config.navPos.right||'auto'};">
                <div class="nav-card-header">${SVGS.nav} 快速导航</div>
                <div class="nav-list"></div>
            </div>
        `);

        let $list = $nav.find('.nav-list');

        let $btnTop = $(`<a class="nav-item"><span class="nav-icon">${SVGS.up}</span>回到顶部</a>`);
        $btnTop.click(e => { e.stopPropagation(); $drawerBody.scrollTop(0); });
        $list.append($btnTop);

        let $btnBottom = $(`<a class="nav-item"><span class="nav-icon">${SVGS.down}</span>去到底部</a>`);
        $btnBottom.click(e => { e.stopPropagation(); $drawerBody.scrollTop($drawerBody[0].scrollHeight); });
        $list.append($btnBottom);

        if (navItems.length > 0) {
            $list.append('<div class="nav-divider"></div>');
            navItems.forEach(item => {
                let $btn = $(`<a class="nav-item ${item.type}"><span class="nav-icon">${item.icon}</span>${item.text}</a>`);
                $btn.click(function(e) {
                     e.stopPropagation();
                     let target = $drawerBody.find('#' + item.id)[0];
                     if(target) {
                         target.scrollIntoView({block: "center", behavior: "smooth"});
                         $(target).css('transition', 'transform 0.2s').css('transform', 'scale(1.2)');
                         setTimeout(()=>$(target).css('transform', 'scale(1)'), 300);
                     }
                });
                $list.append($btn);
            });
        }

        $('#read-drawer').append($nav);
        makeDraggable($nav[0]);
    }

    function closeDrawer() {
        $drawer.removeClass('open');
        $drawerOverlay.fadeOut(250);
        $('body').css('overflow', '');
        $('#drawer-quick-nav').remove();
    }
    $('#drawer-close, #read-drawer-overlay').click(closeDrawer);

    function copyText(text, btn) {
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(()=>feedback(btn));
        else { let ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); feedback(btn); }
    }
    function feedback(btn) { let $btn = $(btn); let txt = $btn.text(); $btn.text('已复制').addClass('btn-copied'); setTimeout(() => { $btn.text(txt).removeClass('btn-copied'); }, 1500); }
    function extractLinks(html) {
        let links = [];
        let magnets = html.match(/magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}/gi) || [];
        let ed2ks = html.match(/ed2k:\/\/\|file\|[^|]+\|[^|]+\|[^|]+\|/gi) || [];
        [...new Set(magnets)].forEach(m => links.push({type:'magnet', url:m}));
        [...new Set(ed2ks)].forEach(e => links.push({type:'ed2k', url:e}));
        return links;
    }

    // === Intersection Observer for Scroll Detection ===
    let io;
    if (config.readMarkMode === 'scroll' && 'IntersectionObserver' in window) {
        io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                let $el = $(entry.target);
                let timer = $el.data('read-timer');

                if (entry.isIntersecting) {
                    if (!$el.hasClass('is-read') && !timer) {
                        timer = setTimeout(() => {
                            $el.addClass('is-read');
                            let tid = $el.data('tid');
                            if(tid) {
                                readHistory[tid] = Date.now();
                                GM_setValue('readHistory_v2', readHistory);
                            }
                            // 标记完成后清理
                            if(io) io.unobserve(entry.target);
                        }, config.readMarkDelay);
                        $el.data('read-timer', timer);
                    }
                } else {
                    // 如果移出视野但还没触发标记，取消定时器
                    if (timer) {
                        clearTimeout(timer);
                        $el.removeData('read-timer');
                    }
                }
            });
        }, { threshold: 1 }); // 100% 面积可见时触发
    }

    let taskQueue = []; let isProcessing = false;
    function processQueue() {
        if(isProcessing || taskQueue.length === 0) return;
        isProcessing = true;
        let task = taskQueue.shift();
        fetchPreview(task.url, task.container, task.tid, () => {
            setTimeout(() => { isProcessing = false; processQueue(); }, config.requestDelay);
        });
    }

    function fetchPreview(url, container, tid, cb) {
        $.ajax({
            url: url, type: 'GET', dataType: 'html',
            success: function(data) {
                try {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(data, "text/html");
                    doc.querySelectorAll('script').forEach(script => script.remove());

                    let subject = doc.querySelector("#thread_subject");
                    let wrapper = $('<div class="res-wrapper"></div>');
                    wrapper.data('tid', tid); // 绑定TID方便调用

                    // === 已读状态与交互标记 ===
                    if (readHistory[tid]) wrapper.addClass('is-read');

                    // 通用：强制立即标记函数
                    const forceRead = () => {
                        if(!wrapper.hasClass('is-read')) {
                            wrapper.addClass('is-read');
                            readHistory[tid] = Date.now();
                            GM_setValue('readHistory_v2', readHistory);
                        }
                    };

                    // 模式 A: 鼠标悬停
                    if (config.readMarkMode === 'hover') {
                        let readTimer = null;
                        wrapper.hover(
                            function() {
                                if (!wrapper.hasClass('is-read')) {
                                    readTimer = setTimeout(forceRead, config.readMarkDelay);
                                }
                            },
                            function() { if (readTimer) clearTimeout(readTimer); }
                        );
                    }

                    // 交互事件监听：任何点击都算已读
                    wrapper.click(e => e.stopPropagation());

                    let contentDiv = $('<div class="res-card-content"></div>');
                    let titleText = "";
                    if (subject) {
                        let $titleLink = $(`<a class='res-title-preview' href='${url}' target='_blank' title="${subject.innerText}">${subject.innerHTML}</a>`);
                        $titleLink.click(forceRead); // 点击标题算已读
                        contentDiv.append($titleLink);
                        titleText = subject.innerText;
                    }
                    let imgContainer = $('<div class="res-image-box"></div>');
                    let count = 0;
                    let cardImagesList = [];
                    const addImg = (src) => {
                        let img = $(`<img class="res-image-item" src="${src}">`);
                        let currentIndex = count;
                        img.click((e) => { e.preventDefault(); e.stopPropagation(); forceRead(); window.openGallery(cardImagesList, currentIndex); });
                        imgContainer.append(img);
                        count++;
                        cardImagesList.push(src);
                    };
                    let images = doc.querySelectorAll(".zoom");
                    for(let i=0; i<images.length; i++) { if(count>=config.maxPreview) break; let z=images[i].getAttribute("zoomfile"); if(z) addImg(z); }
                    if(count===0) {
                        let nImgs = doc.querySelectorAll(".t_f img");
                        for(let i=0; i<nImgs.length; i++) { if(count>=config.maxPreview) break; let s=nImgs[i].getAttribute("src"); if(s && !s.includes('smilies') && !s.includes('.gif') && s.length>10) addImg(s); }
                    }
                    if(count>0) contentDiv.append(imgContainer);
                    wrapper.append(contentDiv);

                    let contentBox = doc.querySelector(".t_fsz") || doc.body;
                    let links = extractLinks(contentBox.innerHTML);
                    let footer = $('<div class="res-footer"></div>');
                    let actionBar = $('<div class="res-action-bar"></div>');
                    let $readBtn = $(`<button class="btn-base btn-read">阅读内容</button>`);
                    $readBtn.click((e) => { e.preventDefault(); e.stopPropagation(); forceRead(); openDrawer(titleText, url); });
                    actionBar.append($readBtn);
                    if (links.length > 0) {
                        let $copyAllBtn = $(`<button class="btn-base btn-copy-all">复制全部 (${links.length})</button>`);
                        $copyAllBtn.click(function(e){ e.preventDefault(); e.stopPropagation(); forceRead(); copyText(links.map(l=>l.url).join('\n'), this); });
                        actionBar.append($copyAllBtn);
                    }
                    footer.append(actionBar);
                    if (links.length > 0) {
                        let $list = $('<ul class="res-list"></ul>');
                        links.forEach((l, idx) => {
                            let $li = $('<li class="res-entry"></li>');
                            if(idx >= config.autoCollapse) $li.hide();
                            let tagHtml = `<span class="res-tag ${l.type==='magnet'?'tag-mag':'tag-ed2k'}">${l.type==='magnet'?'磁力':'ED2K'}</span>`;
                            $li.append(`<div class="res-link-text" title="${l.url}">${tagHtml}${l.url}</div>`);
                            let $cpBtn = $(`<button class="btn-small-copy">复制</button>`);
                            $cpBtn.click(function(e){ e.preventDefault(); e.stopPropagation(); forceRead(); copyText(l.url, this); });
                            $li.append($cpBtn);
                            $list.append($li);
                        });
                        footer.append($list);
                        if(links.length > config.autoCollapse) {
                             let $expBtn = $(`<div style="text-align:center; margin-top:8px; cursor:pointer; color:#999; font-size:10px;">[▼ 展开剩余]</div>`);
                             $expBtn.click(function(e){ e.preventDefault(); e.stopPropagation(); let hidden = $list.find('li:hidden'); if(hidden.length){ hidden.slideDown(); $(this).text('[▲ 收起]'); } else { $list.find('li').slice(config.autoCollapse).slideUp(); $(this).text(`[▼ 展开剩余]`); } });
                            footer.append($expBtn);
                        }
                    } else { footer.append('<div style="text-align:center; color:#ddd; font-size:11px;">无资源链接</div>'); }
                    wrapper.append(footer);
                    container.replaceWith(wrapper);

                    // 挂载 Scroll Observer
                    if (io && config.readMarkMode === 'scroll') {
                        io.observe(wrapper[0]);
                    }

                } catch(e) { container.text('Error'); }
                cb();
            },
            error: function() { container.text('Failed'); cb(); }
        });
    }

    function processThreadRow(node) {
        let $node = $(node);
        if ($node.hasClass('processed-by-script')) return;
        $node.addClass('processed-by-script');
        let a = $node.find("a").first();
        if (!a.length) a = $node.find('th.new a.xst, th.common a.xst, th.lock a.xst').first();
        if (!a.length) return;
        let href = a.attr("href");
        if (!href) return;
        let reqUrl = href;
        if(href.startsWith('http')) {
             let origin = window.location.origin;
             if(!href.startsWith(origin)) { let u = new URL(href); reqUrl = origin + u.pathname + u.search; }
        }

        // 提取 TID
        let tidMatch = reqUrl.match(/tid=(\d+)/) || reqUrl.match(/thread-(\d+)/);
        let tid = tidMatch ? tidMatch[1] : null;

        if ((reqUrl.includes("mod=viewthread") || reqUrl.includes("tid=") || reqUrl.includes("thread-")) && tid) {
            let $placeholder = $('<div class="grid-placeholder">Loading...</div>');
            $('#my-thread-grid').append($placeholder);
            taskQueue.push({ url: reqUrl, container: $placeholder, tid: tid });
        }
    }

    let $grid = $('<div id="my-thread-grid"></div>');
    $targetTable.before($grid).hide();
    $('.common, .by, .num, .new, .lock').hide();

    $targetTable.find('tbody').each(function() {
        if (this.id && (this.id.startsWith('normalthread_') || this.id.startsWith('stickthread_'))) {
            processThreadRow(this);
        }
    });

    processQueue();

    const observer = new MutationObserver((mutationsList) => {
        let hasNewTasks = false;
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'TBODY') {
                        if (node.id && (node.id.startsWith('normalthread_') || node.id.startsWith('stickthread_'))) {
                            processThreadRow(node);
                            hasNewTasks = true;
                        }
                    }
                });
            }
        }
        if (hasNewTasks && !isProcessing) processQueue();
    });
    observer.observe(document.getElementById('threadlisttableid'), { childList: true });
});
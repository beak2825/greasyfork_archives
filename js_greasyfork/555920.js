// ==UserScript==
// @name         大魔王视频助手<移动版>
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  悬浮播放器、横竖屏识别、拖拽记忆、自动接管、倍速播放、手势控制、M3U8广告过滤、诊断工具。
// @author       bug大魔王
// @match        *://*/*
// @connect      *
// @require      https://unpkg.com/hls.js@1.5.20/dist/hls.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_info
// @run-at       document-start
// @icon         https://i.postimg.cc/Cxxtnwm7/file-00000000037872078ccd248cf86f31d8.png
// @downloadURL https://update.greasyfork.org/scripts/555920/%E5%A4%A7%E9%AD%94%E7%8E%8B%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%3C%E7%A7%BB%E5%8A%A8%E7%89%88%3E.user.js
// @updateURL https://update.greasyfork.org/scripts/555920/%E5%A4%A7%E9%AD%94%E7%8E%8B%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%3C%E7%A7%BB%E5%8A%A8%E7%89%88%3E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONSTANTS = {
        SCRIPT_NAME: '大魔王视频助手',
        SCRIPT_VERSION: '1.2',
        IS_TOP_FRAME: window.self === window.top,
        Hls: window.Hls,
        IDS: { ROOT: 'dmz-host-container', PLAYER: 'dmz-custom-player', SETTINGS_PANEL: 'dmz-settings-panel', PLAYER_STYLES: 'dmz-player-styles' },
        CLASSES: { VIDEO_WRAPPER: 'dmz-video-wrapper', CLOSE_BUTTON: 'dmz-close-button', DRAG_HANDLE: 'dmz-drag-handle', SCREW_EFFECT: 'screw-effect', INDICATOR: 'indicator', SETTINGS_GRID: 'settings-grid', SETTINGS_CARD: 'settings-card', SETTINGS_BTN: 'settings-btn', SWITCH: 'switch', SLIDER: 'slider', VISIBLE: 'visible', HIDDEN: 'hidden' },
        LIMITS: { MAX_M3U8_REDIRECT_DEPTH: 5, MAX_LOG_ENTRIES: 150, LONG_PRESS_DURATION_MS: 400, RETRY_MAX: 3 },
        MESSAGE_TYPES: { M3U8_COMMAND: 'M3U8_PLAYER_COMMAND_V2_FINAL', SANDBOX_URL_FOUND: 'SANDBOX_URL_FOUND_V1', RAW_SIGNAL_FORWARDED: 'RAW_SIGNAL_FORWARDED_V1', ACTION_LOG_FORWARDED: 'ACTION_LOG_FORWARDED_V1', NEUTRALIZE_COMMAND: 'DMZ_NEUTRALIZE_COMMAND_V1', ACTIVATE_AUTOPLAY: 'DMZ_ACTIVATE_AUTOPLAY_V1', QUERY_IS_MAIN_PLAYER: 'DMZ_QUERY_IS_MAIN_PLAYER_V1', IFRAME_TRIGGER_CLICK: 'DMZ_IFRAME_TRIGGER_CLICK_V1', RESTORE_COMMAND: 'DMZ_RESTORE_COMMAND_V1', FORCE_PAUSE_ALL: 'DMZ_FORCE_PAUSE_ALL_V1' },
        LOG_TYPES: { INFO: '🛠️ 系统', MODULE: '📡 模块', CONFIG: '⚙️ 配置', ERROR: '❌ 错误', WARN: '⚠️ 警告', PLAYER: '📺 Ply', PLAYER_REVEAL: '✨ 渲染', HLS: '📽️ HLS', CORE: '🚩 中心', CORE_SLICE: '✂️ 广告过滤', CORE_EXEC: '💥 执行', CORE_IFRAME: '📦 沙箱', CORE_NEUTRALIZE: '🔇 中和', SCAN: '🔍 扫描', SCAN_WARN: '☢️ 注意', HOOK: '⚔️ 劫持', NAV: '🧭 导航', TAKEOVER_SUCCESS: '🪩 接管', TAKEOVER_FAIL: '📛 失败' },
        TAKEOVER_SOURCES: { DOM_HTTP: '页面元素扫描', DOM_ATTR: '页面元素扫描(data-*)', NET_XHR: '网络拦截<XHR>', NET_FETCH: '网络拦截<Fetch>', CROSS_FRAME: 'iFrame信使', DECRYPTION_HOOK_ATOB: '主动解混淆劫持(atob)', DECRYPTION_HOOK_JSON: '主动解混淆劫持(JSON)', DECRYPTION_HOOK_ATTR: '主动解混淆劫持(attr)', PLAYER_HOOK: (name) => `播放器接口劫持(${name})` }
    };
    const ICONS = {
        BRIGHTNESS: '<svg viewBox="0 0 24 24"><path d="M20 15.31L23.31 12 20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>',
        VOLUME_SIDE: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
        BIG_PLAY: '<svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
        BIG_PAUSE: '<svg class="icon-pause" style="display: none;" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
        FORWARD: '<svg class="icon-progress" style="display:none;" viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>',
        REWIND: '<svg class="icon-rewind" style="display:none;" viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6L11 18zM20 6l-8.5 6 8.5 6V6z"/></svg>',
        VOLUME_ON: '<svg class="icon-volume-on" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
        VOLUME_OFF: '<svg class="icon-volume-off" style="display: none;" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
        FS_ENTER: '<svg class="icon-fullscreen-enter" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
        FS_EXIT: '<svg class="icon-fullscreen-exit" style="display: none;" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',
        MORE: '<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
        PIP: '<svg viewBox="0 0 24 24"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/></svg>',
        PLAYBACK_RATE: '<svg viewBox="0 0 24 24"><path d="M10 8v8l6-4-6-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>'
    };
    const CSS = {
        PLAYER: `:host{all:initial;position:fixed!important;background:transparent;overflow:visible;z-index:2147483646!important;display:flex;flex-direction:column;gap:0;padding:0;box-sizing:border-box;pointer-events:none;opacity:0;transition:opacity .3s ease-out;will-change:transform,opacity;backface-visibility:hidden;transform:translateZ(0)}:host(.dmz-visible){opacity:1}:host(.dmz-no-transition){transition:none!important}.${CONSTANTS.CLASSES.VIDEO_WRAPPER}{cursor:pointer;width:100%;flex-grow:1;display:flex;justify-content:center;align-items:center;background:#000;border-radius:20px;position:relative;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,.3);max-height:0;flex-grow:0;-webkit-tap-highlight-color:transparent;pointer-events:auto;transition:max-height 1s cubic-bezier(.4,0,.2,1);will-change:max-height;touch-action:none;transform:translate3d(0,0,0)}#${CONSTANTS.IDS.PLAYER}{width:100%;height:100%;object-fit:contain;background:#000;border-radius:20px;opacity:0;transition:opacity .3s ease;pointer-events:none}.${CONSTANTS.CLASSES.CLOSE_BUTTON}{position:absolute;top:12px;right:12px;background:rgba(0,0,0,.4);color:#fff;width:26px;height:26px;border-radius:50%;display:flex;justify-content:center;align-items:center;font-size:20px;line-height:1;font-weight:700;cursor:pointer;z-index:30;border:1px solid rgba(255,255,255,.1);outline:none;-webkit-tap-highlight-color:transparent;opacity:0;visibility:hidden;pointer-events:none;transition:background .2s ease,transform .2s ease,opacity .3s ease,visibility .3s ease}.${CONSTANTS.CLASSES.VIDEO_WRAPPER}.dmz-controls-visible .${CONSTANTS.CLASSES.CLOSE_BUTTON}{opacity:1;visibility:visible;pointer-events:auto}.${CONSTANTS.CLASSES.CLOSE_BUTTON}:hover{background:rgba(230,50,90,.9);transform:scale(1.1)}.${CONSTANTS.CLASSES.CLOSE_BUTTON}:active{background:rgba(128,128,128,.5)}.dmz-control-button{display:flex;justify-content:center;align-items:center;width:30px;height:30px;background:transparent;border:none;padding:0;cursor:pointer;flex-shrink:0;color:#fff;outline:none;-webkit-tap-highlight-color:transparent;border-radius:50%;transition:background-color .2s ease}.dmz-control-button:active{background:rgba(128,128,128,.4)}.dmz-control-button svg{width:22px;height:22px;fill:currentColor;pointer-events:none}.dmz-big-play-button-container{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center;pointer-events:none;z-index:22;opacity:0;transition:opacity .3s ease}.${CONSTANTS.CLASSES.VIDEO_WRAPPER}.dmz-controls-visible .dmz-big-play-button-container{opacity:1}.dmz-big-play-button{width:64px;height:64px;background:rgba(28,28,30,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:2px solid rgba(255,255,255,.8);border-radius:50%;display:flex;justify-content:center;align-items:center;padding:0;cursor:pointer;pointer-events:auto;color:#fff;outline:none;-webkit-tap-highlight-color:transparent;transition:background .2s ease,transform .2s ease}.dmz-big-play-button:hover{transform:scale(1.1);background:rgba(28,28,30,.7)}.dmz-big-play-button:active{background:rgba(80,80,80,.6);transform:scale(1.05)}.dmz-big-play-button svg{width:32px;height:32px;fill:currentColor}.${CONSTANTS.CLASSES.DRAG_HANDLE}{width:calc(100% - 20px);margin:0 auto;height:18px;flex-shrink:0;cursor:move;display:flex;justify-content:center;align-items:center;position:relative;background:transparent;border-radius:9px;box-shadow:none;-webkit-tap-highlight-color:transparent;overflow:hidden;touch-action:none;pointer-events:auto}.${CONSTANTS.CLASSES.DRAG_HANDLE} .screw-effect{position:absolute;top:0;height:100%;width:calc(50% - 69px);background-image:none}.${CONSTANTS.CLASSES.DRAG_HANDLE} .indicator{width:80px;height:5px;background:#e0e0e0;border-radius:2.5px;box-shadow:0 0 3px rgba(0,0,0,.2);opacity:0;transition:opacity .3s ease,background-color .3s ease}.${CONSTANTS.CLASSES.DRAG_HANDLE}.dmz-indicator-visible .indicator {opacity: 1}@media (prefers-color-scheme: dark) { .${CONSTANTS.CLASSES.DRAG_HANDLE} .indicator { background: #424242; box-shadow: 0 0 3px rgba(0,0,0,.5); } }.dmz-controls-bar{position:absolute;bottom:3px;left:10px;right:10px;width:auto;height:auto;background:rgba(28,28,30,.6);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);border-radius:10px;display:flex;flex-direction:column;align-items:center;padding:2px 10px;box-sizing:border-box;opacity:1;visibility:visible;transition:opacity .3s ease,visibility .3s ease;z-index:25;pointer-events:auto;touch-action:none}.dmz-controls-bar.hidden{opacity:0;visibility:hidden;pointer-events:none}.dmz-time-display{color:#fff;font-size:13px;text-shadow:0 0 3px rgba(0,0,0,.8);margin:0 8px;font-family:sans-serif}.dmz-time-separator{color:#ccc;margin:0 4px;font-size:13px}.dmz-bottom-controls{width:100%;height:32px;display:flex;align-items:center}.dmz-spacer{flex-grow:1}.dmz-progress-container{width:100%;height:15px;display:flex;align-items:center}.dmz-progress-bar{flex-grow:1;height:100%;display:flex;align-items:center;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}.dmz-progress-rail{width:100%;height:4px;background:rgba(255,255,255,.3);position:relative;border-radius:2px}.dmz-progress-buffer{position:absolute;left:0;top:0;height:100%;width:0;background:rgba(255,255,255,.6);border-radius:2px;transition:width .1s linear}.dmz-progress-played{position:absolute;left:0;top:0;height:100%;width:0;background:#38b6ff;border-radius:2px;will-change:width,left;transition:none}.dmz-progress-handle{position:absolute;top:50%;left:0;width:12px;height:12px;background:#fff;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 5px rgba(0,0,0,.5);pointer-events:none;will-change:width,left;transition:none}.dmz-more-menu-container{position:relative}.dmz-more-menu{position:absolute;bottom:calc(100% + 5px);right:0;background:rgba(28,28,30,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:8px;width:180px;z-index:30;list-style:none;margin:0;padding:5px;opacity:0;visibility:hidden;transition:opacity .2s ease,visibility .2s ease;transform-origin:bottom right}.dmz-more-menu.visible{opacity:1;visibility:visible}.dmz-menu-item{display:flex;align-items:center;padding:8px 12px;color:#fff;font-size:14px;cursor:pointer;border-radius:6px}.dmz-menu-item:hover{background:rgba(255,255,255,.1)}.dmz-menu-item.disabled{color:#777;cursor:not-allowed;background:transparent!important}.dmz-menu-item svg{width:20px;height:20px;margin-right:10px;fill:currentColor;pointer-events:none}.dmz-menu-item .dmz-menu-item-label{flex-grow:1;pointer-events:none}.dmz-menu-item .dmz-menu-item-value{color:#aaa;pointer-events:none}.dmz-playback-rates{display:none}.dmz-playback-rates.visible{display:block}.dmz-playback-rates .dmz-menu-item.active{color:#38b6ff;font-weight:700}.dmz-gesture-indicator-wrapper{position:absolute;top:40px;left:50%;transform:translateX(-50%);background:rgba(28,28,30,.7);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#fff;padding:6px 12px;border-radius:18px;font-size:13px;font-family:sans-serif;display:flex;align-items:center;gap:6px;z-index:20;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;pointer-events:none}.dmz-gesture-indicator-wrapper.visible{opacity:1;visibility:visible}.dmz-indicator-icon{display:flex;justify-content:center;align-items:center;width:24px;height:24px;color:#fff}.dmz-indicator-icon svg{width:100%;height:100%;fill:currentColor}.dmz-indicator-text{min-width:120px;text-align:center}.dmz-brightness-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:#000;opacity:0;pointer-events:none;z-index:15;transition:opacity .1s ease}.dmz-side-indicator-container{position:absolute;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;transition:opacity .3s ease;pointer-events:none;z-index:20}.dmz-side-indicator-container.visible{opacity:1}.dmz-side-indicator-container.left{left:30px}.dmz-side-indicator-container.right{right:30px}.dmz-side-indicator-bar-wrapper{width:6px;height:120px;background:rgba(28,28,30,.7);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:3px;display:flex;align-items:flex-end;overflow:hidden;border:1px solid rgba(255,255,255,.15);box-sizing:border-box}.dmz-side-indicator-fill{width:100%;height:0;background:#38b6ff;border-radius:3px}.dmz-side-indicator-fill.transition-active{transition:height .1s linear}.dmz-side-indicator-icon{width:24px;height:24px}.dmz-side-indicator-icon svg{width:100%;height:100%;fill:#fff;filter:drop-shadow(0 0 2px rgba(0,0,0,.5))}`,
        PANEL: `:host{all:initial;box-sizing:border-box;position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);--s-bg:rgba(28,28,34,.95);--s-border:rgba(56,182,255,.5);--s-shadow:rgba(0,0,0,.4);--s-text-main:#e5e5ea;--s-text-title:#fff;--s-text-label:#fff;--s-text-value:#ccc;--s-text-dim:#aaa;--s-card-bg:rgba(40,40,50,.8);--s-card-border:rgba(255,255,255,.1);--s-textarea-bg:#111;--s-input-bg:rgba(20,20,30,.8);--s-input-border:rgba(56,182,255,.5);--s-switch-bg:#58585a;--s-switch-handle:#fff;--s-switch-checked:#34c759;--s-info:#61dafb;--s-nav-btn-bg:rgba(255,255,255,.08);--s-nav-btn-bg-active:var(--s-info)}:host(.visible){display:flex}@media (prefers-color-scheme:light){:host{--s-bg:rgba(252,252,252,.95);--s-border:rgba(0,122,255,.4);--s-shadow:rgba(0,0,0,.15);--s-text-main:#333;--s-text-title:#000;--s-text-label:#111;--s-text-value:#555;--s-text-dim:#666;--s-card-bg:rgba(255,255,255,.8);--s-card-border:rgba(0,0,0,.1);--s-textarea-bg:#f0f0f0;--s-input-bg:rgb(229,229,234);--s-input-border:rgba(0,0,0,.2);--s-switch-bg:#ccc;--s-info:#007aff;--s-nav-btn-bg:rgba(0,0,0,.05)}}.dmz-unified-panel-wrapper{width:90%;max-width:550px;max-height:95%;background:var(--s-bg);border:1px solid var(--s-border);border-radius:12px;box-shadow:0 8px 32px var(--s-shadow);color:var(--s-text-main);display:flex;flex-direction:column;margin-bottom:env(safe-area-inset-bottom,20px)}.dmz-unified-panel-wrapper *{box-sizing:border-box}.panel-header{flex-shrink:0;padding:15px}.dmz-panel-nav{display:flex;justify-content:center;gap:10px;padding:0 15px 15px;border-bottom:1px solid var(--s-card-border)}.dmz-unified-panel-content{flex-grow:1;overflow-y:auto;overscroll-behavior:contain}.dmz-panel-pane{display:none;padding:15px;gap:15px;flex-direction:column}.dmz-panel-pane.active{display:flex}.dmz-unified-panel-footer{display:none;align-items:center;justify-content:flex-end;border-top:1px solid var(--s-card-border);gap:10px;flex-shrink:0;padding:15px;min-height:60px}.dmz-unified-panel-footer.active{display:flex}.title-bar{display:flex;justify-content:space-between;align-items:center}.title-bar h3{margin:0;font-size:18px;color:var(--s-text-title);text-shadow:0 0 5px rgba(56,182,255,.7);font-weight:600}.title-bar .close-btn{background:transparent;border:none;color:rgba(255,82,82,.7);font-size:26px;cursor:pointer;padding:0;font-weight:700;width:30px;height:30px;display:flex;align-items:center;justify-content:center;line-height:1}.title-bar .close-btn:hover{color:rgba(255,82,82,1)}.dmz-nav-btn{flex-grow:1;padding:5px;border-radius:6px;border:none;background:var(--s-nav-btn-bg);color:var(--s-text-dim);font-size:14px;font-weight:600;cursor:pointer;transition:background .2s,color .2s}.dmz-nav-btn.active{background:var(--s-nav-btn-bg-active);color:#fff}.copy-report-btn{display:block;width:100%;margin:0 0 10px;background:rgba(56,182,255,.15);border:1px solid rgba(56,182,255,.3);color:var(--s-info);padding:8px;border-radius:6px;cursor:pointer;font-size:14px;font-weight:600;text-align:center}.copy-report-btn:hover{background:rgba(56,182,255,.3)}.status-banner{padding:10px 15px;border-radius:8px;background:rgba(56,182,255,.15);border:1px solid rgba(56,182,255,.3);display:flex;align-items:center;gap:12px;font-size:16px;font-weight:600}.status-banner-icon{font-size:22px;width:22px;height:22px;display:flex;align-items:center;justify-content:center}.cards-container{display:grid;grid-template-columns:1fr 1fr;gap:15px}.info-card{background:var(--s-card-bg);padding:12px 15px;border-radius:10px;border:1px solid var(--s-card-border);display:flex;flex-direction:column;gap:10px}.info-card.full-width{grid-column:1 / -1}.card-title{font-size:12px;color:var(--s-text-dim);font-weight:600;margin:0 0 5px;padding-bottom:5px;border-bottom:1px solid var(--s-card-border)}.card-content-item{display:flex;flex-direction:column;gap:8px;font-size:14px;align-items:flex-start}.label-wrapper{display:flex;justify-content:space-between;align-items:center;width:100%}.label{font-weight:600;color:var(--s-text-label)}.card-content-item .value{font-size:13px;color:var(--s-text-value);word-break:break-all}.card-content-item .value.success{color:#28a745}.card-content-item .value.warning{color:#ffc107}.card-content-item .value.error{color:#dc3545}.card-content-item .value ul{padding-left:18px;margin:5px 0 0}.card-content-item .value code{background:rgba(0,0,0,.05);padding:2px 5px;border-radius:4px;font-family:monospace;border:1px solid rgba(0,0,0,.05)}.copy-btn{background:rgba(0,122,255,.1);border:1px solid rgba(0,122,255,.2);color:#007aff;padding:3px 10px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;transition:background .2s ease,color .2s ease}.copy-btn:hover{background:rgba(0,122,255,.2);color:#0056b3}.details-toggle{cursor:pointer;color:var(--s-info);margin-top:10px;text-align:center;font-weight:600;padding:8px;background:rgba(0,122,255,.08);border-radius:8px}textarea{width:100%;box-sizing:border-box;background:var(--s-textarea-bg);color:var(--s-text-value);border:1px solid var(--s-card-border);border-radius:6px;font-family:monospace;font-size:10px;resize:vertical;padding:8px;margin-top:8px}textarea[data-info="m3u8-raw"],textarea[data-info="m3u8-processed"]{min-height:50px}.dmz-log-container{width:100%;box-sizing:border-box;background:var(--s-textarea-bg);color:var(--s-text-value);border:1px solid var(--s-card-border);border-radius:6px;font-family:monospace;font-size:10px;resize:vertical;padding:8px;margin-top:8px;min-height:300px;max-height:300px;overflow-y:auto}.dmz-log-container pre{margin:0;white-space:pre-wrap;word-break:break-all}.log-entry{line-height:1.4}.log-collapsible{cursor:pointer;padding:4px 8px;background:rgba(56,182,255,.15);border-radius:4px;margin:4px 0;user-select:none;transition:background .2s}.log-collapsible:hover{background:rgba(56,182,255,.3)}.log-collapsed-content .log-entry{padding-left:15px;border-left:2px solid rgba(255,255,255,.2)}.${CONSTANTS.CLASSES.SETTINGS_GRID}{display:flex;flex-direction:column;gap:15px}.${CONSTANTS.CLASSES.SETTINGS_CARD}{background:var(--s-card-bg);padding:12px 15px;border-radius:10px;border:1px solid var(--s-card-border)}h3.settings-title{color:var(--s-info);margin:0 0 10px;padding-bottom:10px;border-bottom:1px solid var(--s-card-border);font-size:16px;font-weight:600}.settings-card-info{background:rgba(56,182,255,.1);border:1px solid rgba(56,182,255,.25);padding:12px;border-radius:8px;color:var(--s-text-dim);margin-top:0;font-size:13px}.settings-card-info b{font-weight:700;color:var(--s-text-main)}.settings-card-info code{background:rgba(0,0,0,.05);padding:2px 5px;border-radius:4px;font-family:monospace;border:1px solid rgba(0,0,0,.08)}.option-item,.option-item-col{display:flex;justify-content:space-between;align-items:center;padding:8px 0;color:var(--s-text-main);font-size:15px}.option-item-col{flex-direction:column;align-items:flex-start;gap:8px}.option-item-col label{font-weight:600}.option-item-col input,.option-item-col textarea{width:100%;box-sizing:border-box;background:var(--s-input-bg);border:1px solid var(--s-input-border);border-radius:6px;padding:10px;color:var(--s-text-main);font-family:sans-serif;font-size:14px}#site-blacklist-input{resize:vertical;min-height:120px;font-family:monospace}.${CONSTANTS.CLASSES.SETTINGS_BTN}.action{background:rgba(0,122,255,.2);color:var(--s-info);margin-top:10px;width:100%;flex:none;border:1px solid rgba(0,122,255,.3)}.${CONSTANTS.CLASSES.SETTINGS_BTN}.action:hover{background:rgba(0,122,255,.3)}.${CONSTANTS.CLASSES.SETTINGS_BTN}{flex:0 1 auto;padding:8px 20px;border:none;border-radius:8px;cursor:pointer;color:#fff;font-size:15px;font-weight:600;box-shadow:0 2px 5px rgba(0,0,0,.1);transition:transform .1s ease,background .2s ease}.${CONSTANTS.CLASSES.SETTINGS_BTN}:active{transform:scale(0.97)}.${CONSTANTS.CLASSES.SETTINGS_BTN}.close{background:#555}.${CONSTANTS.CLASSES.SETTINGS_BTN}.save{background:#007aff}.${CONSTANTS.CLASSES.SETTINGS_BTN}.reset{background:#007aff}.${CONSTANTS.CLASSES.SWITCH}{position:relative;display:inline-block;width:51px;height:31px}.${CONSTANTS.CLASSES.SWITCH} input{opacity:0;width:0;height:0}.${CONSTANTS.CLASSES.SLIDER}{position:absolute;cursor:pointer;inset:0;background:var(--s-switch-bg);transition:.4s;border-radius:31px}.${CONSTANTS.CLASSES.SLIDER}:before{position:absolute;content:"";height:27px;width:27px;left:2px;bottom:2px;background:var(--s-switch-handle);transition:.4s;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.2)}input:checked+.${CONSTANTS.CLASSES.SLIDER}{background:var(--s-switch-checked)}input:checked+.${CONSTANTS.CLASSES.SLIDER}:before{transform:translateX(20px)}`
    };
    const EventBus = {
        listeners: {},
        on(event, callback) {
            if (!this.listeners[event]) this.listeners[event] = [];
            this.listeners[event].push(callback);
        },
        off(event, callback) {
            if (!this.listeners[event]) return;
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        },
        emit(event, data) {
            if (!this.listeners[event]) return;
            this.listeners[event].forEach(cb => cb(data));
        }
    };
    const State = {
        status: 'IDLE',
        currentVideo: { url: null, quality: null, format: null },
        config: {},
        isSystemHalted: false,
        isRestoreInProgress: false
    };
    class BaseModule {
        constructor(context, name) {
            this.context = context;
            this.name = name;
        }
        log(msg, type = CONSTANTS.LOG_TYPES.INFO) {
            this.context.actionLogger.log(msg, type);
        }
        init() {}
        enable(context) { this.init(); }
        disable(context) { }
    }
    const DomUtils = {
        create(tag, options = {}, children = []) {
            const el = document.createElement(tag);
            Object.entries(options).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') Object.assign(el.style, value);
                else if (key in el) el[key] = value;
                else el.setAttribute(key, value);
            });
            children.forEach(child => el.append(child));
            return el;
        },
        toggleIcon(showIcon, hideIcons = []) {
            if (showIcon) showIcon.style.display = 'block';
            hideIcons.forEach(icon => { if (icon) icon.style.display = 'none'; });
        },
        toggleVisibility(element, forceState) {
            if (!element) return false;
            element.classList.toggle(CONSTANTS.CLASSES.VISIBLE, forceState);
            return element.classList.contains(CONSTANTS.CLASSES.VISIBLE);
        },
        createCopyButtonWithFeedback(textToCopy, buttonText = '复制') {
            const button = this.create('button', { className: 'copy-btn', title: '复制', textContent: buttonText });
            button.addEventListener('click', e => {
                e.stopPropagation();
                Utils.copyToClipboard(textToCopy, () => {
                    button.textContent = '✔ 已复制!';
                    setTimeout(() => { button.textContent = buttonText; }, 1500);
                });
            });
            return button;
        },
        showButtonFeedback(button, { successText, originalContent, duration = 1500, successBgColor = '' }) {
            const originalWidth = button.style.width;
            const originalBgColor = button.style.backgroundColor;
            const content = originalContent ?? button.innerHTML;
            const preciseWidth = button.getBoundingClientRect().width;
            button.style.width = `${preciseWidth}px`;
            button.textContent = successText;
            if (successBgColor) button.style.backgroundColor = successBgColor;
            setTimeout(() => {
                button.innerHTML = content;
                button.style.width = originalWidth;
                button.style.backgroundColor = originalBgColor;
            }, duration);
        }
    };
    const Utils = {
        _noiseCache: new Map(),
        NoisePatterns: {
            HIGH_SCORE_PATH: /(?:^|[\/_\?&=-])(play|watch|vodplay|m3u8|player|view|videos|movie|film|drama|shorties|short|tvshows|jav|subtitles|photo)(?:$|[\/_\?&=-]|\d|\.)/i,
            HIGH_SCORE_FULL: /[\?&]vid=/i,
            DETAIL_PATH: /(gua_details|vod\/details|archives)[/_]/,
            DETAIL_SPLIT: /(?:^|[\/_])detail[\/_]/,
            MULTI_NUM: /(?:^|[\/_-])\d+[-_]\d+(?:[-_]\d+)?(?:[\/_\.]|$)/,
            YEAR: /[-_](19|20)\d{2}([-_]|$)/,
            FILTER: /[-_]0[-_]0/,
            CODE: /(?:^|[\/_-])[a-z]{2,}-?\d{3,}(?:$|[\/_\.]|html)/i,
            LONG_ID: /\/[a-z0-9-_]{3,}\/\d{6,}(\.html)?\/?$/,
            HEX_ROOT: /^\/[a-f0-9]{6,32}\/?$/i,
            MEDIUM_SCORE: /(?:^|[\/_\?&=-])(video|bangumi|anime|dsj|dy|zy|dm|tv)(?:$|[\/_\?&=-]|\d)/i,
            LOW_SCORE: /(?:^|[\/_\?&=-])(episode|chapter)(?:$|[\/_\?&=-])/i,
            MINIMAL_SCORE: /(?:^|[\/_\?&=-])vod(?:$|[\/_\?&=-]|\d)/i,
            PARAM_ID: /[\?&](id|vid|aid|cid|v|f)=([a-zA-Z0-9-_]+)/,
            PATH_ID: /[\/](id|vid|aid|cid|v|f)[\/]([a-zA-Z0-9-_]+)/,
            INVALID_ID: /^(video|videos|vod|view|drama|movie|movies|short|shorties|detail|details|archives|dongman|anime|category|tag|label|search|index|home|about|contact|help|feed|sitemap|overview|mail|email|product|features|upgrade|support|install|terms|privacy|policy|html|htm|php|jsp|asp|page|pages|list|tvshows)$/i,
            NEGATIVE_KEYWORDS: /(?:^|[\/_\?&=-])(detail|intro|book|read|novel|xiaoshuo|manhua|comic|article|news|doc|download|shop|cart|donate|login|auth|user|profile|archives|forum|thread|scripts|greasyfork|channel|board|subject|pages|overview|mail|email|product|about|help|faq|welcome|contact|terms|privacy|policy|install|upgrade|support|features|live|vodtype|voddetail|drama|movie|movies|dongman|edit|editor|console|dashboard|workbench|build|deploy|project|cloud|service|workers)(?:$|[\/_\?&=-]|\.)/i,
            NEGATIVE_PATH: /(^|\/)(s|search|query|results?|find)\/?$/i,
            STRONG_NEGATIVE: /^\/(jav|subtitles|chinese-subtitles|channels|models|stars|albums|full[-_]?(porn|movie|video|film|vod))\/?$/i,
            LIST_KEYWORDS: /(?:^|[\/_\?&=-])(list|cate|category|categories|tag|tags|sort|search|filter|index|home|default|genres|orderby|region|cats|pages?)(?:$|[\/_\?&=-]|\.)/i,
            SORT_PARAMS: /[\?&](p|page|q|query|sort|order|by)=/i
        },
        debounce(func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        wildcardToRegex(pattern) { return new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`); },
        isM3U8(url) {
            if (typeof url !== 'string') return false;
            const lower = url.toLowerCase();
            return lower.includes('.m3u8') || lower.includes('.m3u') || lower.includes('/m3u8/') || lower.includes('application/x-mpegurl') || lower.includes('application/vnd.apple.mpegurl');
        },
        copyToClipboard(text, successCallback) {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).then(successCallback).catch(err => console.error(`${CONSTANTS.SCRIPT_NAME}: Clipboard API failed`, err));
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                Object.assign(textArea.style, { position: 'fixed', top: '-9999px', left: '-9999px' });
                document.body.appendChild(textArea);
                textArea.focus(); textArea.select();
                try { if (document.execCommand('copy')) successCallback(); } catch (err) { console.error(`${CONSTANTS.SCRIPT_NAME}: execCommand failed`, err); }
                document.body.removeChild(textArea);
            }
        },
        formatTime(seconds) {
            if (isNaN(seconds) || seconds < 0) return '00:00';
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const s = Math.floor(seconds % 60).toString().padStart(2, '0');
            return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
        },
        getVideoFormat(url) {
            if (typeof url !== 'string') return { name: '未知', type: '未知' };
            if (this.isM3U8(url)) return { name: "M3U8", type: "流式传输" };
            const cleanUrl = url.split('?')[0].toLowerCase();
            const formats = [{ ext: '.mp4', name: 'MP4' }, { ext: '.mkv', name: 'MKV' }, { ext: '.webm', name: 'WebM' }, { ext: '.flv', name: 'FLV' }];
            const format = formats.find(f => cleanUrl.endsWith(f.ext));
            if (format) return { name: format.name, type: "常规文件" };
            try {
                const urlObj = new URL(url);
                for (const [key, value] of urlObj.searchParams.entries()) {
                    const lowerValue = value.toLowerCase();
                    const paramFormat = formats.find(f => lowerValue.endsWith(f.ext));
                    if (paramFormat) return { name: paramFormat.name, type: "常规文件" };
                    if ((key.includes('type') || key.includes('format')) && formats.some(f => lowerValue.includes(f.ext.substring(1)))) {
                        return { name: formats.find(f => lowerValue.includes(f.ext.substring(1))).name, type: "常规文件" };
                    }
                }
            } catch (e) { }
            return { name: "未知", type: "常规文件" };
        },
        _getNormalizedPath() {
            try {
                const loc = window.top.location;
                return {
                    path: decodeURIComponent(loc.pathname.toLowerCase()),
                    full: decodeURIComponent(loc.pathname.toLowerCase() + loc.search.toLowerCase()),
                    hostname: loc.hostname.toLowerCase()
                };
            } catch (e) {
                return {
                    path: window.location.pathname.toLowerCase(),
                    full: window.location.pathname.toLowerCase() + window.location.search.toLowerCase(),
                    hostname: window.location.hostname.toLowerCase()
                };
            }
        },
        _calculatePathScore(path, full, hostname) {
            const P = this.NoisePatterns;
            let score = 0;
            const check = (regex, points) => { if (regex.test(full)) score += points; };
            const checkPath = (regex, points) => { if (regex.test(path)) score += points; };
            if (path.indexOf('/play/') !== -1 || path.indexOf('/watch/') !== -1 || path.indexOf('/vodplay/') !== -1 || path.indexOf('/view/') !== -1 || path.indexOf('/videos/') !== -1 || path.indexOf('/video/') !== -1 || path.indexOf('/video-') !== -1 || path.indexOf('video.') !== -1 || path.indexOf('/v/') !== -1 || path.indexOf('/short/') !== -1 || path.indexOf('/shorties/') !== -1 || path.indexOf('/movie/') !== -1 || path.indexOf('/film/') !== -1 || path.indexOf('/movies/') !== -1 || path.indexOf('/tvshows/') !== -1 || full.includes('.m3u8')) score += 100;
            else check(P.HIGH_SCORE_PATH, 100);
            if (P.DETAIL_PATH.test(path) || P.HIGH_SCORE_FULL.test(full)) score += 100;
            else if (P.DETAIL_SPLIT.test(path)) { const afterDetail = path.split(P.DETAIL_SPLIT)[1]; if (afterDetail && !/^\d+(\.html)?\/?$/.test(afterDetail)) score += 100; }
            if (P.HEX_ROOT.test(path) && /[a-f]/i.test(path) && /[0-9]/.test(path)) score += 120;
            else {
                if (P.MULTI_NUM.test(path) && !P.YEAR.test(path) && !P.FILTER.test(path)) score += 80;
                if (P.CODE.test(path)) score += 50;
                if (P.LONG_ID.test(path)) score += 60;
            }
            check(P.MEDIUM_SCORE, 30);
            check(P.LOW_SCORE, 20);
            check(P.MINIMAL_SCORE, 10);
            if (/\.html$/.test(path)) score += 10;
            if (/(?:^|[\/])\d+\.html$/.test(path)) score += 30;
            if (hostname.startsWith('live.') || P.NEGATIVE_KEYWORDS.test(full) || /forumdisplay/i.test(full)) score -= 60;
            check(/(?:^|[\/_\?&=-])(tvshows)(?:$|[\/_\?&=-]|\.)/i, -100);
            checkPath(P.NEGATIVE_PATH, -200);
            checkPath(P.STRONG_NEGATIVE, -200);
            checkPath(/\/[-_]?(vod|v|dongman|tvshows)\/+\d+(\.html)?\/?$/i, -200);
            checkPath(/\/[-_]?(detail|intro|overview)\/+[a-z0-9-_]+(\.html)?\/?$/i, -200);
            checkPath(/\/[-_]?(video)\/+\d+\.html\/?$/i, -150);
            checkPath(/(^|\/|[-_])index\d+(\.html)?\/?$/i, -200);
            checkPath(/^\/(?=.*[a-z])(?=.*\d)[a-z0-9]{6,20}\/?$/i, -100);
            checkPath(/\/(?=.*[a-z])(?=.*\d)[a-z0-9]{6,20}\/\d{1,3}(\.html)?\/?$/i, -100);
            checkPath(/[-_]{2,}\d+/i, -100);
            check(P.LIST_KEYWORDS, -100);
            if (P.SORT_PARAMS.test(full)) score -= 60;
            if (/\/category\/[^\/]+\/\d{4,}(\.html)?\/?$/i.test(path)) score += 150;
            if (P.YEAR.test(path) && score < 100) score -= 50;
            return score;
        },
        _calculateIdScore(path, full) {
            let score = 0;
            const P = this.NoisePatterns;
            const parts = path.split(/\/|\./).filter(p => p && p.length > 0);
            const paramIdMatch = full.match(P.PARAM_ID);
            const pathIdMatch = path.match(P.PATH_ID);
            if (paramIdMatch) { parts.push(paramIdMatch[2]); if (['v', 'f', 'id'].includes(paramIdMatch[1])) score += 30; }
            if (pathIdMatch) { parts.push(pathIdMatch[2]); score += 30; }
            for (const p of parts) {
                if (P.INVALID_ID.test(p) || /^(19|20)\d{2}$/.test(p)) continue;
                if (p.length >= 5) { if (/[a-zA-Z]/.test(p) && /[0-9]/.test(p)) { score += 60; break; } else if (/^[a-zA-Z_-]+$/.test(p)) { if (p.length > 20) score -= 50; else score += 10; break; } }
                if (/^[-_]?\d+$/.test(p)) { if (p.replace(/[-_]/g, '').length >= 6) score += 60; else score += 20; break; }
            }
            return score;
        },
        isHighNoisePage() {
            const cacheKey = window.location.href;
            if (this._noiseCache && this._noiseCache.has(cacheKey)) return this._noiseCache.get(cacheKey);
            const { path, full, hostname } = this._getNormalizedPath();
            let score = this._calculatePathScore(path, full, hostname);
            score += this._calculateIdScore(path, full);
            const result = score >= 50 ? false : `特征不足(得分${score})`;
            if (this._noiseCache) this._noiseCache.set(cacheKey, result);
            return result;
        }
    };
    class EventManager {
        constructor() { this.listeners = []; }
        add(element, eventType, handler, options) { element?.addEventListener(eventType, handler, options); this.listeners.push({ element, eventType, handler, options }); }
        removeAll() { for (const { element, eventType, handler, options } of this.listeners) element?.removeEventListener(eventType, handler, options); this.listeners = []; }
    }
    class ActionLogger {
        constructor() { this.logs = []; this.maxEntries = CONSTANTS.LIMITS.MAX_LOG_ENTRIES; this.context = null; }
        setContext(context) { this.context = context; }
        log(message, type = CONSTANTS.LOG_TYPES.INFO) {
            if (this.logs.length >= this.maxEntries) this.logs.shift();
            const logEntry = { type, message, frame: CONSTANTS.IS_TOP_FRAME ? 'Top' : 'iFrame', timestamp: Date.now() };
            this.logs.push(logEntry);
            EventBus.emit('LOG_ENTRY', logEntry);
        }
        getLogs() { return this.logs; }
    }

    class SettingsManager extends BaseModule {
        constructor(context) {
            super(context, 'SettingsManager');
            this.defaults = {
                autoPlay: true, blacklist: ['github.com', 'stackoverflow.com', 'developer.mozilla.org', '*youtube.com'],
                crossFrameSupport: true, defaultPlaybackRate: 1.0, longPressRate: 2.0,
                enableDecryptionHook: true, enableNetworkInterceptor: true, enablePlayerTakeover: true,
                isMuted: false, isSmartSlicingEnabled: true, lastVolume: 0.8, maxRetryCount: 1,
                enableJsonInspector: true, enableSetAttributeHooker: true
            };
            this.config = {};
        }
        async load() {
            this.config = (await GM_getValue('dmz_v2_settings', {})) ?? {};
            if (this.config.floatingPlayerPos) delete this.config.floatingPlayerPos;
            this.config = { ...this.defaults, ...this.config };
            State.config = this.config;
            this.log("加载完成。", CONSTANTS.LOG_TYPES.CONFIG);
        }
        async save(newConfig, applyLive = true) {
            const oldConfig = { ...this.config };
            this.config = { ...this.config, ...newConfig };
            State.config = this.config;
            await GM_setValue('dmz_v2_settings', this.config);
            if (applyLive) {
                this.log("配置已保存", CONSTANTS.LOG_TYPES.CONFIG);
                EventBus.emit('CONFIG_UPDATED', { oldConfig, newConfig: this.config });
                this.context.frameCommunicator.showNotification('设置已保存并应用。部分更改可能需要刷新页面才能生效。');
            }
        }
        async reset() {
            const oldConfig = { ...this.config };
            const persistentState = { lastVolume: this.config.lastVolume, isMuted: this.config.isMuted };
            this.config = { ...this.defaults, ...persistentState };
            State.config = this.config;
            await GM_setValue('dmz_v2_settings', this.config);
            EventBus.emit('CONFIG_UPDATED', { oldConfig, newConfig: this.config });
            this.log("配置已重置为默认值", CONSTANTS.LOG_TYPES.CONFIG);
            this.context.frameCommunicator.showNotification('已恢复为默认设置。');
            return this.config;
        }
        _getSiteKey(hostname) {
            const host = hostname || window.location.hostname;
            const match = host.match(/([a-z0-9-]+\.(?:com|net|org|gov|edu|[a-z]{2})\.[a-z]{2}|[a-z0-9-]+\.[a-z0-9-]+)$/i);
            return match ? match[0] : host;
        }
        async savePlayerPosition(hostname, orientationKey, pos) {
            const positions = await GM_getValue('dmz_player_positions_v2', {});
            const siteKey = this._getSiteKey(hostname);
            if (!positions[siteKey]) positions[siteKey] = {};
            positions[siteKey][orientationKey] = pos;
            await GM_setValue('dmz_player_positions_v2', positions);
        }
        async loadPlayerPosition(hostname, orientationKey) {
            const positions = await GM_getValue('dmz_player_positions_v2', {});
            const siteKey = this._getSiteKey(hostname);
            return positions?.[siteKey]?.[orientationKey] || null;
        }
    }
    class DiagnosticsTool extends BaseModule {
        constructor(context) {
            super(context, 'DiagnosticsTool');
            this.eventTimeline = [];
            this.fatalNetworkErrors = [];
            this.maxLogEntries = 300;
            this.startTime = new Date();
            this.takeoverEvidence = { sources: [], url: null };
            this.lastProcessedM3u8 = null;
            this.playbackHealth = {};
            this.slicingReport = {};
            this.logSequence = 0;
            this.resetPlaybackHealth();
        }
        init() {
            EventBus.on('LOG_ENTRY', (event) => this.logEvent(event));
        }
        captureTakeoverEvidence(candidate) {
            this.takeoverEvidence = {
                sources: Array.from(candidate.sources),
                url: candidate.url,
                iframeSource: candidate.iframeSource || null,
                iframeOrigin: candidate.iframeOrigin || null
            };
        }
        logEvent(event) {
            if (this.eventTimeline.length >= this.maxLogEntries) this.eventTimeline.shift();
            const now = new Date();
            event.time = now;
            event.relativeTime = `+${((now - this.startTime) / 1000).toFixed(3)}s`;
            event.sequence = this.logSequence++;
            this.eventTimeline.push(event);
            if (event.type === 'FATAL_NET_ERROR') this.fatalNetworkErrors.push(event);
        }
        resetPlaybackHealth() {
            this.playbackHealth = {
                manifest: { status: 'pending', code: null },
                key: { status: 'pending', code: null },
                media: { status: 'pending', reason: null },
                segments: { status: 'pending', errorCount: 0, consecutiveErrors: 0 }
            };
        }
        resetSlicingReport() {
            this.slicingReport = {
                totalGroups: 0,
                slicedGroups: 0,
                slicedSegments: 0,
                slicedDuration: 0,
                slicedTimeRanges: [],
                activatedEngines: new Set(),
                foundFeatures: new Map([['URL_PATTERN', new Set()], ['BEHAVIOR_MODEL', new Set()]])
            };
        }
        analyzeUrlPatterns(m3u8Content, baseUrl) {
            if (!m3u8Content || typeof m3u8Content !== 'string' || !baseUrl) return null;
            const lines = m3u8Content.split('\n');
            const pathStats = new Map();
            let currentDuration = 0;
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('#EXTINF:')) {
                    currentDuration = parseFloat(trimmed.split(':')[1]);
                } else if ((trimmed.endsWith('.ts') || trimmed.includes('.jpeg')) && !trimmed.startsWith('#')) {
                    try {
                        const url = new URL(trimmed, baseUrl);
                        const path = url.pathname;
                        const lastSlash = path.lastIndexOf('/');
                        const basePath = (lastSlash > -1) ? path.substring(0, lastSlash + 1) : '/';
                        pathStats.set(basePath, (pathStats.get(basePath) || 0) + 1);
                    } catch (e) { }
                }
            }
            if (pathStats.size <= 1) {
                this.log(`所有分片路径统一，无法通过路径独特性分析。`, CONSTANTS.LOG_TYPES.CORE_SLICE);
                return null;
            }
            const sortedPaths = Array.from(pathStats.entries()).sort((a, b) => b[1] - a[1]);
            const [mainPath, mainPathCount] = sortedPaths[0];
            const suggestions = new Set();
            for (let i = 1; i < sortedPaths.length; i++) {
                const [suspectPath, suspectPathCount] = sortedPaths[i];
                if (suspectPathCount < mainPathCount / 2) {
                    const adParts = suspectPath.split('/').filter(Boolean);
                    const baselineParts = mainPath.split('/').filter(Boolean);
                    for (let j = 0; j < Math.min(adParts.length, baselineParts.length); j++) {
                        if (adParts[j] !== baselineParts[j]) {
                            if (/^\d+$/.test(adParts[j]) || /^(1080|720|480|360)p?$/i.test(adParts[j])) continue;
                            suggestions.add(adParts[j]);
                            this.log(`基于路径独特性发现高嫌疑关键词: ${adParts[j]}`, CONSTANTS.LOG_TYPES.CORE_SLICE);
                            break;
                        }
                    }
                }
            }
            if (suggestions.size > 0) {
                this.slicingReport.activatedEngines.add('URL_PATTERN');
                suggestions.forEach(s => this.slicingReport.foundFeatures.get('URL_PATTERN').add(s));
                return Array.from(suggestions);
            }
            return null;
        }
        generateDeveloperReport() {
            const nl = '\n';
            let reportHeader = `大魔王视频助手 开发者日志 (版本: ${CONSTANTS.SCRIPT_VERSION})${nl}页面URL: ${window.location.href}${nl}`;
            if (this.fatalNetworkErrors.length > 0) {
                reportHeader += `--- 深度网络故障分析 ---${nl}`;
                this.fatalNetworkErrors.forEach((err, i) => { reportHeader += `[错误${i + 1}]@${err.relativeTime}:${err.message}${nl}`; });
            }
            reportHeader += `--- 统一事件时间轴 ---${nl}`;
            const sortedLogs = [...this.eventTimeline].sort((a, b) => b.time - a.time || b.sequence - a.sequence);
            const COLLAPSE_PATTERN = /(嵌入式扫描器发现广告链接，已跳过|\[路径特征分析\] URL判定为广告)/;
            const escape = (s) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            let htmlOutput = `<div class="log-entry">${escape(reportHeader).replace(/\n/g, '<br>')}</div>`;
            let collapsedLines = [];
            let isCollapsing = false;
            const flushCollapsed = () => {
                if (collapsedLines.length > 0) {
                    htmlOutput += `<div class="log-collapsible"><strong>[+] 折叠了 ${collapsedLines.length} 条 "广告扫描/过滤" 噪音日志... (点击展开)</strong></div><div class="log-collapsed-content" style="display: none;">${collapsedLines.join('')}</div>`;
                    collapsedLines = [];
                }
            };
            sortedLogs.forEach(log => {
                const formattedType = log.type.replace(' ', ' [') + ']';
                const logMessage = `[${log.relativeTime}] ${formattedType} ${log.message}`;
                const escapedMessage = escape(logMessage);
                const currentLineHtml = `<div class="log-entry">${escapedMessage}</div>`;
                const isScanNoise = log.type === CONSTANTS.LOG_TYPES.SCAN_WARN && COLLAPSE_PATTERN.test(log.message);
                const isSliceLog = log.type === CONSTANTS.LOG_TYPES.CORE_SLICE;
                if (isScanNoise || isSliceLog) {
                    isCollapsing = true;
                    collapsedLines.push(currentLineHtml);
                } else {
                    if (isCollapsing) { flushCollapsed(); isCollapsing = false; }
                    if (log.message.length > 500 && (log.message.includes('base64,') || log.message.includes('M3U8处理完成'))) {
                        htmlOutput += `<div class="log-collapsible"><strong>[+] 折叠了过长的硬编码数据... (点击展开)</strong></div><div class="log-collapsed-content" style="display: none;">${currentLineHtml}</div>`;
                    } else {
                        htmlOutput += currentLineHtml;
                    }
                }
            });
            flushCollapsed();
            return htmlOutput;
        }
    }
    class FrameCommunicator extends BaseModule {
        constructor(context) {
            super(context, 'FrameCommunicator');
            this.boundHandleMessage = this.handleMessage.bind(this);
            this.dispatchMap = {
                [CONSTANTS.MESSAGE_TYPES.IFRAME_TRIGGER_CLICK]: this._handleTriggerClick,
                'DMZ_FALLBACK_SANDBOX_V1': this._handleFallbackSandbox,
                'DMZ_FORCE_SLEEP': this._handleForceSleep,
                [CONSTANTS.MESSAGE_TYPES.RAW_SIGNAL_FORWARDED]: this._handleRawSignal,
                [CONSTANTS.MESSAGE_TYPES.QUERY_IS_MAIN_PLAYER]: this._handleQueryMainPlayer,
                [CONSTANTS.MESSAGE_TYPES.ACTION_LOG_FORWARDED]: this._handleLogForward,
                [CONSTANTS.MESSAGE_TYPES.ACTIVATE_AUTOPLAY]: this._handleActivateAutoplay,
                [CONSTANTS.MESSAGE_TYPES.NEUTRALIZE_COMMAND]: this._handleNeutralize,
                [CONSTANTS.MESSAGE_TYPES.RESTORE_COMMAND]: this._handleRestore,
                [CONSTANTS.MESSAGE_TYPES.FORCE_PAUSE_ALL]: this._handleForcePause
            };
        }
        init() {
            window.addEventListener('message', this.boundHandleMessage);
            EventBus.on('LOG_ENTRY', (logEntry) => {
                if (!CONSTANTS.IS_TOP_FRAME && [CONSTANTS.LOG_TYPES.CORE_NEUTRALIZE, CONSTANTS.LOG_TYPES.SCAN, CONSTANTS.LOG_TYPES.SCAN_WARN, CONSTANTS.LOG_TYPES.CORE_IFRAME, CONSTANTS.LOG_TYPES.CORE_EXEC, CONSTANTS.LOG_TYPES.CORE, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT, CONSTANTS.LOG_TYPES.TAKEOVER_FAIL, CONSTANTS.LOG_TYPES.WARN, CONSTANTS.LOG_TYPES.ERROR].includes(logEntry.type)) {
                    this.postToTopFrame({ type: CONSTANTS.MESSAGE_TYPES.ACTION_LOG_FORWARDED, logEntry: { type: logEntry.type, message: logEntry.message } });
                }
            });
        }
        removeListeners() { window.removeEventListener('message', this.boundHandleMessage); }
        handleMessage(event) {
            const data = event.data;
            if (!data || !data.type) return;
            const handler = this.dispatchMap[data.type];
            if (handler) handler.call(this, data, event);
        }
        _handleTriggerClick(data, event) {
            if (CONSTANTS.IS_TOP_FRAME) this.context.coreLogic.handleRemoteTriggerClick();
            else this.context.coreLogic.handleRemoteTriggerClick();
        }
        _handleFallbackSandbox() {
            if (!CONSTANTS.IS_TOP_FRAME) {
                this.log("收到顶层回退指令，执行本地沙箱重载...", CONSTANTS.LOG_TYPES.CORE_EXEC);
                this.context.coreLogic.sandboxManager.reload();
            }
        }
        _handleForceSleep() {
            if (!CONSTANTS.IS_TOP_FRAME) {
                this.log("收到顶层休眠指令，停止所有活动。", CONSTANTS.LOG_TYPES.LIFECYCLE);
                this.context.coreLogic.restorePageToOriginalState();
            }
        }
        _handleRawSignal(data, event) {
            if (CONSTANTS.IS_TOP_FRAME) {
                if (this.context.coreLogic.isSystemHalted || this.context.coreLogic.isRestoreInProgress) {
                    try { event.source.postMessage({ type: CONSTANTS.MESSAGE_TYPES.RESTORE_COMMAND }, event.origin); } catch (e) { }
                    return;
                }
                const candidate = data.payload;
                let sourceFrame = Array.from(document.querySelectorAll('iframe')).find(f => f.contentWindow === event.source);
                if (sourceFrame && (sourceFrame.id === 'dmz_sandbox_frame' || sourceFrame.style.opacity === '0.01' || sourceFrame.style.width === '1px')) {
                    const visibleIframes = Array.from(document.querySelectorAll('iframe')).filter(f => f !== sourceFrame && f.offsetWidth > 50 && f.offsetHeight > 50);
                    if (visibleIframes.length > 0) {
                        sourceFrame = visibleIframes.sort((a, b) => {
                            const getScore = (el) => {
                                let s = 0;
                                const src = (el.src || '').toLowerCase();
                                const ratio = el.offsetWidth / el.offsetHeight;
                                if (/(play|video|vod|embed|m3u8)/.test(src)) s += 50;
                                if (/(comment|disqus|chat)/.test(src)) s -= 100;
                                if (ratio > 1.2) s += 30;
                                if (ratio < 0.8) s -= 30;
                                return s;
                            };
                            const scoreA = getScore(a);
                            const scoreB = getScore(b);
                            if (scoreA !== scoreB) return scoreB - scoreA;
                            return (b.offsetWidth * b.offsetHeight) - (a.offsetWidth * a.offsetHeight);
                        })[0];
                        this.log(`[修正] 信号来自沙箱，触发器已重定向至高置信度iFrame。`, CONSTANTS.LOG_TYPES.UI);
                    }
                }
                if (sourceFrame) this.context.coreLogic.overlayManager.attachIframeTrigger(sourceFrame, event.source);
                const simplifiedOrigin = event.origin.replace(/^https?:\/\/(?:www\.)?/, '').split('/')[0].split('.').slice(-2).join('.');
                this.log(`收到|🛰|[iFrame信使@${simplifiedOrigin}]的新情报，正在提交审查...`, CONSTANTS.LOG_TYPES.CORE);
                this.context.coreLogic.addTakeoverCandidate({ ...candidate, sourceName: `${CONSTANTS.TAKEOVER_SOURCES.CROSS_FRAME} (${candidate.sourceName})`, iframeSource: event.source, iframeOrigin: event.origin });
            }
        }
        _handleQueryMainPlayer(data, event) {
            if (CONSTANTS.IS_TOP_FRAME) {
                if (this.context.coreLogic.isSystemHalted || this.context.coreLogic.isRestoreInProgress) {
                    try { event.source.postMessage({ type: 'DMZ_FORCE_SLEEP' }, event.origin); } catch (e) { }
                    return;
                }
                if (this.context.playerManager.isPlayerActiveOrInitializing || this.context.coreLogic.takeoverCandidates.size > 0 || this.context.coreLogic.decisionInProgress) {
                    try { event.source.postMessage({ type: CONSTANTS.MESSAGE_TYPES.FORCE_PAUSE_ALL }, event.origin); } catch (e) { }
                }
                const sourceFrame = Array.from(document.querySelectorAll('iframe')).find(f => f.contentWindow === event.source);
                const origin = event.origin.toLowerCase();
                if (sourceFrame) {
                    if (sourceFrame === this.context.coreLogic.sandboxManager.iframeSandbox) return;
                    const src = sourceFrame.src.toLowerCase();
                    if (/(captcha|auth|login|signin|widget|comment|plugin|share|button|ads?|tracker|analytics|pixel|sync|oauth|verify|challenge|static|assets|google|facebook|twitter|instagram|disqus|editor|ide|workbench|console)/i.test(src)) return;
                    const rect = sourceFrame.getBoundingClientRect();
                    let score = 0;
                    const isCross = src.indexOf(window.location.hostname) === -1;
                    const area = rect.width * rect.height;
                    if (area > 150000) score += 40;
                    else if (area > 60000) score += 20;
                    if (/(play|video|vod|embed|stream|m3u8)/i.test(src) || /(play|video|vod|embed|stream|m3u8)/i.test(origin)) score += 60;
                    const attrStr = (sourceFrame.id + sourceFrame.className).toLowerCase();
                    if (/(wp-embedded-content|wp-block-embed|link-preview|shared-post)/.test(attrStr)) score -= 200;
                    if (/(editor|ide|workbench|console|terminal|debugger|preview)/.test(src) || /(editor|ide|workbench|console)/.test(attrStr)) score -= 200;
                    if (/(^|[\/\.-])(edit|code)([\/\.-]|$)/.test(src)) score -= 100;
                    if (/\/embed\/?$/.test(src.split('?')[0]) && !/(player|video|movie|film|vod|m3u8|mp4)/.test(src)) score -= 150;
                    if (/(player|video|wrapper|container)/.test(attrStr)) score += 20;
                    if (isCross) score += 30;
                    if (!isCross && !/(play|embed|video)/i.test(src) && !/(player)/.test(attrStr) && score < 60) {
                        if (area < 100000) score -= 50;
                    }
                    if (score >= 20) {
                        this.context.coreLogic.overlayManager.attachIframeTrigger(sourceFrame, event.source);
                        if (!this.context.playerManager.isPlayerActiveOrInitializing && !this.context.coreLogic.decisionInProgress) {
                            this.log(`指挥官：锁定目标[${event.origin}] (得分:${score})，执行激活！`, CONSTANTS.LOG_TYPES.CORE_IFRAME);
                            event.source.postMessage({ type: CONSTANTS.MESSAGE_TYPES.ACTIVATE_AUTOPLAY }, event.origin);
                        }
                    }
                } else {
                    if (/(play|video|vod|embed|stream|m3u8)/i.test(origin)) {
                        if (!this.context.playerManager.isPlayerActiveOrInitializing && !this.context.coreLogic.decisionInProgress) {
                            this.log(`指挥官：发现嵌套目标[${event.origin}]，盲发激活指令！`, CONSTANTS.LOG_TYPES.CORE_IFRAME);
                            event.source.postMessage({ type: CONSTANTS.MESSAGE_TYPES.ACTIVATE_AUTOPLAY }, event.origin);
                        }
                    }
                }
            }
        }
        _handleLogForward(data, event) {
            if (CONSTANTS.IS_TOP_FRAME) {
                const { logEntry } = data;
                if (logEntry) {
                    const simplifiedOrigin = event.origin.replace(/^https?:\/\/(?:www\.)?/, '').split('/')[0].split('.').slice(-2).join('.');
                    this.log(`[iFrame@${simplifiedOrigin}]${logEntry.message}`, logEntry.type);
                }
            }
        }
        _handleActivateAutoplay() {
            if (CONSTANTS.IS_TOP_FRAME) return;

            const now = Date.now();
            if (this._lastActivationTime && (now - this._lastActivationTime < 3000)) {
                return; 
            }
            this._lastActivationTime = now;

            this.log("士兵：收到指挥官的激活授权！启动轮询点击程序...", CONSTANTS.LOG_TYPES.CORE_IFRAME);
            this._performAutoplayActions();
        }
        _performAutoplayActions() {
            let attempts = 0;
            const pollAndClick = setInterval(() => {
                const video = document.querySelector('video');
                if (video) { try { video.play(); } catch (e) { } if (video.parentElement && !video.parentElement.classList.contains('dmz-video-wrapper')) video.click(); }
                const selectors = ['.jw-video', '.vjs-big-play-button', '#player_overlays_play_button', '[class*="play-button"]', '[aria-label*="Play"]', '[data-plyr="play"]', '.isnd.bigger.play', '.art-control-play', '.dplayer-mobile-play', '.dplayer-mobile-play-icon', '.dplayer-play-icon', '.plyr__control--overlaid', '.icon-play', 'button[class*="play"]', 'div[class*="play"]', '.fp-ui', 'div[style*="background"]'];
                const candidates = Array.from(document.querySelectorAll(selectors.join(', ')));
                let playButton = null;
                if (candidates.length > 0) {
                    playButton = candidates.filter(el => {
                        if (el.offsetParent === null || el.offsetWidth === 0 || el.offsetHeight === 0) return false;
                        const attrStr = (el.id + ' ' + el.className + ' ' + (el.getAttribute('aria-label') || '')).toLowerCase();
                        if (/(translate|comment|chat|disqus|feedback|reply|submit|login|signup|ad-|ads|tracker)/.test(attrStr)) return false;
                        if (el.closest('[id*="comment"], [class*="comment"], [id*="chat"], [class*="chat"], [id*="disqus"], [class*="disqus"]')) return false;
                        return true;
                    }).sort((a, b) => {
                        const areaA = a.offsetWidth * a.offsetHeight;
                        const areaB = b.offsetWidth * b.offsetHeight;
                        if (Math.abs(areaA - areaB) > 5000) return areaB - areaA;
                        const rectA = a.getBoundingClientRect();
                        const rectB = b.getBoundingClientRect();
                        const centerA = Math.abs((rectA.top + rectA.height/2) - window.innerHeight/2);
                        const centerB = Math.abs((rectB.top + rectB.height/2) - window.innerHeight/2);
                        return centerA - centerB;
                    })[0];
                }
                if (playButton) {
                    clearInterval(pollAndClick);
                    this.log(`士兵：锁定最佳点击目标(${playButton.className.slice(0, 20)}...)，执行强力模拟点击！`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                    try {
                        const touchOpts = { bubbles: true, cancelable: true, view: window };
                        ['touchstart', 'touchend', 'mousedown', 'mouseup', 'click'].forEach(evt => { try { playButton.dispatchEvent(new MouseEvent(evt, touchOpts)); } catch (e) { } });
                    } catch (e) { }
                    playButton.click();
                    setTimeout(() => this.context.coreLogic.handleRemoteTriggerClick(), 200);
                } else {
                    attempts++;
                    if (attempts % 5 === 0 && document.body) {
                        try {
                            const cx = window.innerWidth / 2; const cy = window.innerHeight / 2;
                            const el = document.elementFromPoint(cx, cy);
                            if (el && !el.closest('.dmz-iframe-remote-trigger')) {
                                const elAttr = (el.id + ' ' + el.className).toLowerCase();
                                if (!/(comment|chat|disqus|input|textarea)/.test(elAttr) && !el.closest('[id*="comment"], [class*="comment"]')) {
                                    ['touchstart', 'touchend', 'click'].forEach(evt => { try { el.dispatchEvent(new MouseEvent(evt, { bubbles: true, cancelable: true, view: window })); } catch (e) { } });
                                    el.click();
                                }
                            }
                        } catch (e) { }
                    }
                    if (attempts >= 100) { this.log(`士兵：轮询超时。`, CONSTANTS.LOG_TYPES.WARN); clearInterval(pollAndClick); }
                }
            }, 200);
        }
        _handleNeutralize() {
            if (!CONSTANTS.IS_TOP_FRAME) try { window.stop(); } catch (e) { }
        }
        _handleRestore() {
            this.context.coreLogic.restorePageToOriginalState();
        }
        _handleForcePause() {
            if (CONSTANTS.IS_TOP_FRAME || /(recaptcha|google|facebook|twitter|instagram|disqus|comment|widget|chat|analytics)/.test(window.location.hostname)) return;
            const mediaList = this.context.coreLogic.findAllVideosAndAudioInPage();
            if (mediaList.length === 0) return;
            let neutralizedCount = 0;
            mediaList.forEach(media => {
                if (media.id !== CONSTANTS.IDS.PLAYER) {
                    const result = this.context.coreLogic.neutralizeOriginalPlayer(media, 'active');
                    if (result) neutralizedCount++;
                }
            });
            if (neutralizedCount > 0) {
                this.log(`收到顶层压制指令，已强制静音并暂停 (${neutralizedCount}个媒体)。`, CONSTANTS.LOG_TYPES.CORE_NEUTRALIZE);
            }
        }
        postToTopFrame(message) {
            if (!CONSTANTS.IS_TOP_FRAME) {
                try {
                    let targetOrigin = '*';
                    try { targetOrigin = window.top.location.origin; } catch (e) { }
                    this.log(`向顶层窗口发送消息:${message.action || message.type}`, CONSTANTS.LOG_TYPES.COMM);
                    window.top.postMessage(message, targetOrigin);
                } catch (e) { this.log(`跨frame通信失败:${e.message}`, CONSTANTS.LOG_TYPES.ERROR); }
            }
        }
        showNotification(text, isError = false) {
            if (typeof GM_notification === 'function') GM_notification({ title: CONSTANTS.SCRIPT_NAME, text, silent: !isError, timeout: isError ? 5000 : 3000 });
            else console.log(`[${CONSTANTS.SCRIPT_NAME}] ${text}`);
        }
    }

    class StyleManager extends BaseModule {
        constructor(context) { super(context, 'StyleManager'); }
        injectPlayerStyles(shadowRoot) { if (!shadowRoot.querySelector(`#${CONSTANTS.IDS.PLAYER_STYLES}`)) { const style = document.createElement('style'); style.id = CONSTANTS.IDS.PLAYER_STYLES; style.textContent = CSS.PLAYER; shadowRoot.appendChild(style); } }
    }
    class SettingsUI extends BaseModule {
        constructor(context) {
            super(context, 'SettingsUI');
            this.UI_CONFIG = [
                { type: 'info', content: `💡 <b>作者：bug大魔王:</b> 脚本好用的话，点个赞，喜欢可以来tg群组交流 https://t.me/+HbQE7TdRe-4yMGM1 。` },
                { group: '播放控制', items: [{ id: 'auto-play-toggle', label: '自动播放', type: 'switch', configKey: 'autoPlay' }, { id: 'smart-slice-toggle', label: '广告净化', type: 'switch', configKey: 'isSmartSlicingEnabled' }, { id: 'playback-rate-input', label: '默认播放倍速', type: 'number', configKey: 'defaultPlaybackRate', props: { step: "0.25", min: "0.5", max: "5.0" } }, { id: 'long-press-rate-input', label: '长按倍速', type: 'number', configKey: 'longPressRate', props: { step: "0.25", min: "1.0", max: "5.0" } }] },
                { group: '高级设置', items: [{ id: 'max-retries-input', label: '网络最大重试次数 (快速失败建议为0)', type: 'number', configKey: 'maxRetryCount', props: { min: "0", max: "10" } }, { id: 'json-inspector-toggle', label: '深度JSON解析劫持 (增强成功率)', type: 'switch', configKey: 'enableJsonInspector' }, { id: 'set-attribute-hooker-toggle', label: '底层播放器属性劫持 (增强成功率)', type: 'switch', configKey: 'enableSetAttributeHooker' }] },
                { group: '站点管理', items: [{ id: 'site-blacklist-input', label: '黑名单 (在这些网站上禁用脚本，一行一个)', type: 'textarea', configKey: 'blacklist', props: { rows: "8", id: "site-blacklist-input" } }, { id: 'add-to-blacklist-btn', label: '添加当前站点到黑名单', type: 'button' }] }
            ];
            this.UI_HANDLERS = { 'switch': { getValue: el => el.checked, setValue: (el, value) => { el.checked = !!value; } }, 'textarea': { getValue: el => el.value.split('\n').map(s => s.trim()).filter(Boolean), setValue: (el, value) => { el.value = Array.isArray(value) ? value.join('\n') : (value ?? ''); } }, 'number': { getValue: (el, item) => parseFloat(el.value) || (item.configKey === 'maxRetryCount' ? 3 : 1.0), setValue: (el, value) => { el.value = value; } } };
        }
        _createLabeledInput(item) { const label = DomUtils.create('label', { htmlFor: item.id, textContent: item.label }); const input = DomUtils.create(item.type === 'number' ? 'input' : 'textarea', { id: item.id, ...item.props }); if (item.type === 'number') input.type = 'number'; return DomUtils.create('div', { className: 'option-item-col' }, [label, input]); }
        generateSettingsContent() {
            const contentArea = DomUtils.create('div', { className: CONSTANTS.CLASSES.SETTINGS_GRID });
            this.UI_CONFIG.forEach(section => {
                if (section.type === 'info') { contentArea.appendChild(DomUtils.create('div', { className: 'settings-card-info', innerHTML: section.content })); return; }
                const card = DomUtils.create('div', { className: CONSTANTS.CLASSES.SETTINGS_CARD });
                card.appendChild(DomUtils.create('h3', { className: 'settings-title', textContent: section.group }));
                section.items.forEach(item => {
                    let el;
                    switch (item.type) {
                        case 'switch':
                            el = DomUtils.create('div', { className: 'option-item' }, [
                                DomUtils.create('label', { htmlFor: item.id, textContent: item.label }),
                                DomUtils.create('label', { className: CONSTANTS.CLASSES.SWITCH }, [
                                    DomUtils.create('input', { type: 'checkbox', id: item.id }),
                                    DomUtils.create('span', { className: CONSTANTS.CLASSES.SLIDER })
                                ])
                            ]);
                            break;
                        case 'number':
                        case 'textarea':
                            el = this._createLabeledInput(item);
                            break;
                        case 'button':
                            el = DomUtils.create('button', { id: item.id, className: `${CONSTANTS.CLASSES.SETTINGS_BTN} action`, textContent: item.label });
                            break;
                    }
                    if (el) card.appendChild(el);
                });
                contentArea.appendChild(card);
            });
            return contentArea;
        }
        loadDataToUI(panel, data) { this.UI_CONFIG.flatMap(s => s.items ?? []).forEach(item => { if (!item.configKey) return; const el = panel.querySelector(`#${item.id}`); const handler = this.UI_HANDLERS[item.type]; if (el && handler) handler.setValue(el, data[item.configKey], item); }); }
        saveDataFromUI(panel) { const newConfig = {}; this.UI_CONFIG.flatMap(s => s.items ?? []).forEach(item => { if (!item.configKey) return; const el = panel.querySelector(`#${item.id}`); const handler = this.UI_HANDLERS[item.type]; if (el && handler) newConfig[item.configKey] = handler.getValue(el, item); }); return newConfig; }
    }
    class InfoPanelManager extends BaseModule {
        constructor(context) { super(context, 'InfoPanelManager'); }
        generateDiagnosticsContent() {
            const copyReportBtn = DomUtils.create('button', { className: 'copy-report-btn', title: '复制完整诊断报告', innerHTML: '📋 复制报告' });
            const content = DomUtils.create('div', { className: 'dmz-panel-pane-content', innerHTML: `<div class="status-banner"><span class="status-banner-icon" data-info="status-icon"></span><span data-info="status-text"></span></div><div class="cards-container"><div class="info-card full-width"><h4 class="card-title">[广告过滤]净化报告</h4><div class="card-content-item"><span class="label">净化结果</span><span class="value" data-info="ad-filter"></span></div><div class="card-content-item"><span class="label">分析摘要</span><div class="value" data-info="ad-analysis-result"></div></div></div><div class="info-card"><h4 class="card-title">视频与播放诊断</h4><div class="card-content-item"><span class="label">接管方式</span><span class="value" data-info="takeover"></span></div><div class="card-content-item" data-info-item="format"><span class="label">视频格式</span><span class="value" data-info="format"></span></div><div class="card-content-item"><span class="label">播放分辨率</span><span class="value" data-info="resolution"></span></div><div class="card-content-item"><span class="label">来源地址</span><span class="value" data-info="url"></span></div></div><div class="info-card"><h4 class="card-title">播放健康度诊断</h4><div data-info-container="health-m3u8"><div class="card-content-item"><span class="label">播放列表 (M3U8)</span><span class="value" data-info="health-m3u8"></span></div><div class="card-content-item"><span class="label">内容解密 (Key)</span><span class="value" data-info="health-key"></span></div><div class="card-content-item"><span class="label">视频流 (TS)</span><span class="value" data-info="health-ts"></span></div></div><div data-info-container="health-normal" style="display: none;"><div class="card-content-item"><span class="label" data-info-label="health-normal-label">媒体文件加载</span><span class="value" data-info="health-normal"></span></div></div></div></div><div class="details-toggle">▼ 展开开发者日志</div><div class="developer-logs" style="display: none;"><div class="card-content-item"><div class="label-wrapper"><span class="label">M3U8 原始情报</span><span data-info="m3u8-raw-controls"></span></div></div><textarea data-info="m3u8-raw" readonly></textarea><div class="card-content-item" data-info-container="m3u8-processed"><div class="label-wrapper"><span class="label" data-info="m3u8-processed-label">M3U8 净化后情报</span><span data-info="m3u8-processed-controls"></span></div></div><textarea data-info="m3u8-processed" readonly></textarea><div class="card-content-item"><div class="label-wrapper"><span class="label">开发者事件时间轴</span><span data-info="dev-log-controls"></span></div></div><div class="dmz-log-container"><pre data-info="dev-log"></pre></div></div>` });
            content.prepend(copyReportBtn);
            const devLogsContainer = content.querySelector('.developer-logs');
            const detailsToggle = content.querySelector('.details-toggle');
            detailsToggle.addEventListener('click', () => { const isVisible = devLogsContainer.style.display !== 'none'; devLogsContainer.style.display = isVisible ? 'none' : 'block'; detailsToggle.textContent = (!isVisible ? '▲ 收起' : '▼ 展开') + '开发者日志'; });
            copyReportBtn.addEventListener('click', () => { const reportText = this.generateFullReportText(); Utils.copyToClipboard(reportText, () => DomUtils.showButtonFeedback(copyReportBtn, { successText: '✔ 已复制!', duration: 2000 })); });
            return content;
        }
        generateFullReportText() {
            const root = this.context.unifiedPanelManager?.elements?.shadowRoot;
            if (!root) return "无法生成报告：面板未初始化。";
            const getText = (selector) => root.querySelector(selector)?.innerText.trim() ?? 'N/A';
            const getValue = (selector) => root.querySelector(selector)?.value ?? 'N/A';
            const nl = '\n', dbl = '\n\n';
            return `### 📊 ${CONSTANTS.SCRIPT_NAME} 诊断报告 ###${dbl}**版本:** ${CONSTANTS.SCRIPT_VERSION}${nl}**页面URL:** ${window.location.href}${dbl}--- [广告过滤]净化报告 ---${dbl}**净化结果:** ${getText('[data-info="ad-filter"]')}${nl}**分析摘要:**${nl}${getText('[data-info="ad-analysis-result"]').replace(/•/g, '* ')}${nl}${dbl}--- 视频与播放诊断 ---${dbl}**接管方式:** ${getText('[data-info="takeover"]')}${nl}**视频来源:** ${this.context.playerManager?.currentVideoUrl ?? 'N/A'}${nl}**播放健康度 - 播放列表:** ${getText('[data-info="health-m3u8"]')}${nl}**播放健康度 - 内容解密:** ${getText('[data-info="health-key"]')}${nl}**播放健康度 - 视频流:** ${getText('[data-info="health-ts"]')}${nl}${dbl}--- M3U8 原始情报 ---${dbl}${getValue('[data-info="m3u8-raw"]')}${dbl}--- M3U8 净化后情报 ---${dbl}${getValue('[data-info="m3u8-processed"]')}${dbl}--- 开发者事件时间轴 ---${dbl}${getText('[data-info="dev-log"]')}`;
        }
        _getStatusHtml(status, successText, errorText, pendingText, errorCode = '') {
            switch (status) {
                case 'success': return `✅ ${successText}`;
                case 'not_encrypted': return `✅ ${successText}`;
                case 'error': return `❌ ${errorText} ${errorCode ? `(错误: ${errorCode})` : ''}`;
                default: return `⏳${pendingText}`;
            }
        }
        _setText(root, selector, text) { const el = root.querySelector(selector); if(el) el.textContent = text; }
        _setHtml(root, selector, html) { const el = root.querySelector(selector); if(el) el.innerHTML = html; }
        update() {
            const root = this.context.unifiedPanelManager?.elements?.shadowRoot;
            if (!root || !this.context.playerManager || !this.context.diagnosticsTool) return;
            const qs = (selector) => root.querySelector(selector);
            const { playerManager, diagnosticsTool, settingsManager, domScanner, coreLogic } = this.context;
            const health = diagnosticsTool.playbackHealth;

            let icon = '🕵️', text = '正在页面上巡逻，待命中...';

            if (coreLogic.isSystemHalted) {
                icon = '💤';
                text = '当前页面疑似非视频页，已自动休眠。';
            } else if (domScanner && domScanner.isStopped) {
                icon = '💤';
                text = '扫描器暂停中...';
            }

            if (health.manifest.status === 'error') { icon = '❌'; text = `视频目录加载失败(错误:${health.manifest.code})，无法播放`; }
            else if (health.key.status === 'error') { icon = '❌'; text = `视频密钥获取失败(错误:${health.key.code})，无法解密`; }
            else if (health.media.status === 'error' && health.media.reason) { icon = '❌'; text = `媒体解码失败(原因:${health.media.reason})`; }
            else if (health.segments.status === 'error') { icon = '❌'; text = `视频数据加载失败 (已达最大重试)`; }
            else if (playerManager.isPlayerActiveOrInitializing) {
                const v = playerManager.videoElement;
                if (v && (!v.videoWidth || !v.videoHeight)) { icon = '📏'; text = '正在获取视频尺寸...'; }
                else if (v && v.readyState > 2 && !v.paused) { icon = '✅'; text = '视频正在流畅播放中！'; }
                else { icon = '⏳'; text = '正在缓冲视频...'; }
            }
            this._setHtml(root, '[data-info="status-icon"]', `<span style="font-size: 22px;">${icon}</span>`);
            this._setText(root, '[data-info="status-text"]', text);
            const report = diagnosticsTool.slicingReport ?? {};
            let videoFormat = playerManager.currentVideoFormat ?? { name: '未知', type: '' };
            if (playerManager.lastM3u8Content && videoFormat.name !== 'M3U8') videoFormat = { name: 'M3U8', type: '流式传输' };
            const adFilter = qs('[data-info="ad-filter"]');
            const adAnalysisResult = qs('[data-info="ad-analysis-result"]');
            if (!settingsManager.config.isSmartSlicingEnabled) { adFilter.innerHTML = `“广告过滤”系统未启用`; adAnalysisResult.innerHTML = `已在设置中关闭，所有净化模块将不会运行。`; }
            else if (playerManager.isPlayerActiveOrInitializing) {
                if (videoFormat.name === 'M3U8') {
                    if (report.slicedSegments > 0) {
                        const slicedDuration = report.slicedDuration ?? 0; let durationText = '';
                        if (slicedDuration > 0) {
                            let formattedDuration;
                            if (slicedDuration < 60) formattedDuration = `${slicedDuration.toFixed(1)}秒`;
                            else { const minutes = Math.floor(slicedDuration / 60); const remainingSeconds = Math.round(slicedDuration % 60); formattedDuration = `${minutes}分${remainingSeconds}秒`; }
                            durationText = `，总计时长约${formattedDuration}`;
                        }
                        adFilter.innerHTML = `🛡️〖任务完成〗 已为您拦截 ${report.slicedSegments} 个广告片段${durationText}。`;
                        let analysisHTML = '📄〖广告过滤〗模块已激活，净化协议启动：<ul>';
                        if (report.activatedEngines?.has('URL_PATTERN')) { const keywords = Array.from(report.foundFeatures.get('URL_PATTERN') ?? []).map(k => `<code>${k}</code>`).join(', '); analysisHTML += `<li><strong>「特征锁定」过滤:</strong> 根据「URL特征」(关键词: ${keywords})，精准清除了广告片段。</li>`; }
                        if (report.activatedEngines?.has('BEHAVIOR_MODEL')) { const details = Array.from(report.foundFeatures.get('BEHAVIOR_MODEL') ?? []).map(d => `<li>${d.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</li>`).join(''); analysisHTML += `<li><strong>「行为清扫」过滤:</strong> 识别并清扫了以下特征的广告组：<ul>${details}</ul></li>`; }
                        analysisHTML += '</ul>';
                        if (report.slicedTimeRanges?.length > 0) {
                            report.slicedTimeRanges.sort((a, b) => a.start - b.start);
                            analysisHTML += '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.1);"><strong>切除时间点:</strong><ul>';
                            report.slicedTimeRanges.forEach(range => { analysisHTML += `<li>⏱️ ${Utils.formatTime(range.start)} → ${Utils.formatTime(range.end)}</li>`; });
                            analysisHTML += '</ul></div>';
                        }
                        analysisHTML += '<small style="display: block; margin-top: 8px;">[广告过滤]模块已全面接管，为您带来无干扰的沉浸式观看体验。</small>';
                        adAnalysisResult.innerHTML = analysisHTML;
                    } else { adFilter.innerHTML = `🛡️〖无需净化〗 视频流纯净。`; adAnalysisResult.innerHTML = `📑〖广告过滤〗模块已完成扫描，未在视频流中发现任何广告特征。确认为纯净内容，请放心观看。`; }
                } else { adFilter.innerHTML = `🛡️( 常规文件〖无需净化〗)`; adAnalysisResult.innerHTML = `📑〖广告过滤〗模块仅适用于 M3U8 流媒体。当前 〖${videoFormat.name}〗 格式为单一文件，已为您直接播放。`; }
            } else { adFilter.innerHTML = `⏳ 等待视频...`; adAnalysisResult.innerHTML = `捕获到视频后，〖广告过滤〗模块将自动启动。`; }
            this._setText(root, '[data-info="takeover"]', Array.from(diagnosticsTool.takeoverEvidence.sources).join(' + ') || 'N/A');
            this._setText(root, '[data-info="format"]', playerManager.currentVideoFormat ? `${playerManager.currentVideoFormat.name} (${playerManager.currentVideoFormat.type})` : '未知');
            this._setText(root, '[data-info="resolution"]', playerManager.currentVideoResolution || '等待视频加载...');
            const urlEl = qs('[data-info="url"]');
            const fullUrl = playerManager.currentVideoUrl ?? 'N/A';
            urlEl.innerHTML = '';
            urlEl.appendChild(document.createTextNode((fullUrl.length > 80 ? '...' + fullUrl.slice(-80) : fullUrl) + ' '));
            if (fullUrl !== 'N/A') urlEl.appendChild(DomUtils.createCopyButtonWithFeedback(fullUrl, '复制'));
            const isM3U8Type = videoFormat.name === 'M3U8';
            qs('[data-info-container="health-m3u8"]').style.display = 'flex';
            qs('[data-info-container="health-m3u8"]').style.flexDirection = 'column';
            qs('[data-info-container="health-m3u8"]').style.gap = '10px';
            qs('[data-info-container="health-normal"]').style.display = 'none';
            if (playerManager.isPlayerActiveOrInitializing) {
                if (isM3U8Type) {
                    this._setHtml(root, '[data-info="health-m3u8"]', this._getStatusHtml(health.manifest.status, '播放列表已就绪', '播放列表加载失败', '正在请求播放列表...', health.manifest.code));
                    this._setHtml(root, '[data-info="health-key"]', this._getStatusHtml(health.key.status, health.key.status === 'not_encrypted' ? '内容未加密，无需解密' : '密钥获取成功', '密钥获取失败', '正在分析加密...', health.key.code));
                    this._setHtml(root, '[data-info="health-ts"]', this._getStatusHtml(health.segments.status, '视频流缓冲中 (加载正常)', `视频流加载不畅`, '等待视频流加载...'));
                } else {
                    qs('[data-info-container="health-m3u8"]').style.display = 'none';
                    qs('[data-info-container="health-normal"]').style.display = 'flex';
                    this._setText(root, '[data-info-label="health-normal-label"]', `〖${videoFormat.name}〗 文件加载状态`);
                    this._setHtml(root, '[data-info="health-normal"]', this._getStatusHtml(health.media.status, '媒体文件已加载', '媒体文件加载失败', '正在加载媒体文件...'));
                }
            } else {
                this._setText(root, '[data-info="health-m3u8"]', '⏳ 待命中');
                this._setText(root, '[data-info="health-key"]', '⏳ 待命中');
                this._setText(root, '[data-info="health-ts"]', '⏳ 待命中');
            }
            const m3u8Raw = qs('[data-info="m3u8-raw"]');
            m3u8Raw.value = playerManager.lastM3u8Content ?? '暂未捕获到M3U8情报。';
            qs('[data-info-container="m3u8-processed"]').style.display = isM3U8Type ? 'flex' : 'none';
            const m3u8Processed = qs('[data-info="m3u8-processed"]');
            m3u8Processed.value = diagnosticsTool.lastProcessedM3u8 ?? '暂无处理后内容。';
            const m3u8RawControls = qs('[data-info="m3u8-raw-controls"]');
            m3u8RawControls.innerHTML = '';
            if (m3u8Raw.value && !m3u8Raw.value.includes('暂未捕获')) m3u8RawControls.appendChild(DomUtils.createCopyButtonWithFeedback(m3u8Raw.value, '复制'));
            const m3u8ProcessedControls = qs('[data-info="m3u8-processed-controls"]');
            m3u8ProcessedControls.innerHTML = '';
            if (isM3U8Type && m3u8Processed.value && !m3u8Processed.value.includes('暂无')) m3u8ProcessedControls.appendChild(DomUtils.createCopyButtonWithFeedback(m3u8Processed.value, '复制'));
        }
        renderDeveloperLog() {
            const root = this.context.unifiedPanelManager?.elements?.shadowRoot;
            if (!root || !this.context.diagnosticsTool) return;
            const timeline = this.context.diagnosticsTool.eventTimeline;
            if (timeline.length > 0) {
                const lastLog = timeline[timeline.length - 1];
                const currentSignature = `${timeline.length}_${lastLog.sequence}`;
                if (this._lastLogSignature === currentSignature) return;
                this._lastLogSignature = currentSignature;
            }
            const qs = (selector) => root.querySelector(selector);
            const { diagnosticsTool } = this.context;
            const devLog = qs('[data-info="dev-log"]');
            if (devLog) devLog.innerHTML = diagnosticsTool.generateDeveloperReport();
            const devLogControls = qs('[data-info="dev-log-controls"]');
            if (devLogControls) {
                devLogControls.innerHTML = '';
                const button = document.createElement('button');
                button.className = 'copy-btn'; button.textContent = '复制日志 (所见即所得)';
                button.addEventListener('click', () => { const visibleText = devLog.innerText; Utils.copyToClipboard(visibleText, () => DomUtils.showButtonFeedback(button, { successText: '✔ 已复制!' })); });
                devLogControls.appendChild(button);
            }
        }
    }
    class UnifiedPanelManager extends BaseModule {
        constructor(context) { super(context, 'UnifiedPanelManager'); this.hostElement = null; this.infoUpdateInterval = null; this.elements = {}; }
        initGesture() {
            let timer = null, startX, startY;
            const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };
            document.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) { startX = e.touches[0].clientX; startY = e.touches[0].clientY; timer = setTimeout(() => { this.show(); if (navigator.vibrate) navigator.vibrate(50); }, 1000); }
                else clear();
            }, { capture: true, passive: true });
            document.addEventListener('touchmove', (e) => { if (timer && (Math.abs(e.touches[0].clientX - startX) > 20 || Math.abs(e.touches[0].clientY - startY) > 20)) clear(); }, { capture: true, passive: true });
            ['touchend', 'touchcancel'].forEach(evt => document.addEventListener(evt, clear, { capture: true, passive: true }));
        }
        create() {
            if (this.hostElement) return;
            this.hostElement = DomUtils.create('div', { id: 'dmz-unified-panel-host' });
            const preventPenetration = (e) => { e.stopPropagation(); if (e.type === 'contextmenu') e.preventDefault(); };
            ['touchstart', 'touchmove', 'touchend', 'mousedown', 'mousemove', 'mouseup', 'click', 'dblclick', 'contextmenu', 'wheel'].forEach(evt => this.hostElement.addEventListener(evt, preventPenetration, { passive: false }));
            if (document.body) document.body.appendChild(this.hostElement);
            else window.addEventListener('DOMContentLoaded', () => document.body.appendChild(this.hostElement), { once: true });
            const shadowRoot = this.hostElement.attachShadow({ mode: 'closed' });
            shadowRoot.appendChild(DomUtils.create('style', { textContent: CSS.PANEL }));
            const wrapper = DomUtils.create('div', { className: 'dmz-unified-panel-wrapper' });
            const header = DomUtils.create('div', { className: 'panel-header' }, [DomUtils.create('div', { className: 'title-bar' }, [DomUtils.create('h3', { innerHTML: `💡 ${CONSTANTS.SCRIPT_NAME}` }), DomUtils.create('button', { className: 'close-btn', title: '关闭', textContent: '×' })])]);
            const nav = DomUtils.create('div', { className: 'dmz-panel-nav' }, [DomUtils.create('button', { id: 'nav-btn-diagnostics', className: 'dmz-nav-btn', textContent: '诊断报告' }), DomUtils.create('button', { id: 'nav-btn-settings', className: 'dmz-nav-btn', textContent: '功能设置' })]);
            const content = DomUtils.create('div', { className: 'dmz-unified-panel-content' });
            const diagnosticsPane = DomUtils.create('div', { id: 'pane-diagnostics', className: 'dmz-panel-pane' }, [this.context.infoPanelManager.generateDiagnosticsContent()]);
            const settingsPane = DomUtils.create('div', { id: 'pane-settings', className: 'dmz-panel-pane' }, [this.context.settingsUI.generateSettingsContent()]);
            content.append(diagnosticsPane, settingsPane);
            const footer = DomUtils.create('div', { className: 'dmz-unified-panel-footer' }, [DomUtils.create('button', { id: 'dmz-settings-reset-btn', className: `${CONSTANTS.CLASSES.SETTINGS_BTN} reset`, textContent: '恢复默认' }), DomUtils.create('button', { id: 'dmz-settings-save-btn', className: `${CONSTANTS.CLASSES.SETTINGS_BTN} save`, textContent: '保存并应用' })]);
            wrapper.append(header, nav, content, footer);
            shadowRoot.appendChild(wrapper);
            this.elements = { shadowRoot, wrapper, footer, navBtnDiagnostics: shadowRoot.querySelector('#nav-btn-diagnostics'), navBtnSettings: shadowRoot.querySelector('#nav-btn-settings'), paneDiagnostics: shadowRoot.querySelector('#pane-diagnostics'), paneSettings: shadowRoot.querySelector('#pane-settings'), saveBtn: shadowRoot.querySelector('#dmz-settings-save-btn'), resetBtn: shadowRoot.querySelector('#dmz-settings-reset-btn'), closeBtn: shadowRoot.querySelector('.close-btn'), addToBlacklistBtn: shadowRoot.querySelector('#add-to-blacklist-btn') };
            this.bindEvents();
        }
        bindEvents() {
            this.elements.closeBtn.addEventListener('click', () => this.hide());
            this.elements.navBtnDiagnostics.addEventListener('click', () => this.switchToPane('diagnostics'));
            this.elements.navBtnSettings.addEventListener('click', () => this.switchToPane('settings'));
            this.elements.saveBtn.addEventListener('click', async () => {
                const newConfig = this.context.settingsUI.saveDataFromUI(this.elements.shadowRoot);
                await this.context.settingsManager.save(newConfig);
                DomUtils.showButtonFeedback(this.elements.saveBtn, { successText: '✔ 已保存!', successBgColor: '#28a745' });
                this.context.frameCommunicator.showNotification('设置已保存并应用。');
            });
            this.elements.resetBtn.addEventListener('click', async () => {
                if (window.confirm('您确定要将所有设置恢复为默认值吗？此操作不可撤销。')) {
                    const newConfig = await this.context.settingsManager.reset();
                    this.context.settingsUI.loadDataToUI(this.elements.shadowRoot, newConfig);
                }
            });
            if (this.elements.addToBlacklistBtn) {
                this.elements.addToBlacklistBtn.addEventListener('click', () => {
                    const blTextarea = this.elements.shadowRoot.querySelector('#site-blacklist-input');
                    const hostName = window.location.hostname;
                    const list = blTextarea.value.split('\n').map(s => s.trim()).filter(Boolean);
                    if (list.includes(hostName)) return this.context.frameCommunicator.showNotification(`"${hostName}" 已在黑名单中。`);
                    list.push(hostName);
                    blTextarea.value = list.join('\n');
                    this.context.frameCommunicator.showNotification(`已将 "${hostName}" 添加到黑名单。保存后将在所有页面生效。`);
                });
            }
            const contentContainer = this.elements.shadowRoot.querySelector('.dmz-unified-panel-content');
            if (contentContainer) {
                contentContainer.addEventListener('click', (e) => {
                    const collapsibleHeader = e.target.closest('.log-collapsible');
                    if (!collapsibleHeader) return;
                    const content = collapsibleHeader.nextElementSibling;
                    if (content && content.classList.contains('log-collapsed-content')) {
                        const isVisible = content.style.display !== 'none';
                        content.style.display = isVisible ? 'none' : 'block';
                        const icon = collapsibleHeader.querySelector('strong');
                        if (isVisible) icon.textContent = icon.textContent.replace('[-]', '[+]').replace('收起', '展开');
                        else icon.textContent = icon.textContent.replace('[+]', '[-]').replace('展开', '收起');
                    }
                });
            }
        }
        switchToPane(paneName) {
            const isDiagnostics = paneName === 'diagnostics';
            this.elements.navBtnDiagnostics.classList.toggle('active', isDiagnostics);
            this.elements.paneDiagnostics.classList.toggle('active', isDiagnostics);
            this.elements.navBtnSettings.classList.toggle('active', !isDiagnostics);
            this.elements.paneSettings.classList.toggle('active', !isDiagnostics);
            this.elements.footer.classList.toggle('active', !isDiagnostics);
            if (this.infoUpdateInterval) clearInterval(this.infoUpdateInterval);
            if (isDiagnostics) {
                this.context.infoPanelManager.renderDeveloperLog();
                this.context.infoPanelManager.update();
                this.infoUpdateInterval = setInterval(() => { this.context.infoPanelManager.update(); this.context.infoPanelManager.renderDeveloperLog(); }, 1500);
            }
        }
        show() {
            if (!CONSTANTS.IS_TOP_FRAME) return;
            if (!this.hostElement) this.create();
            this.hostElement.classList.add(CONSTANTS.CLASSES.VISIBLE);
            document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
            this.context.settingsUI.loadDataToUI(this.elements.shadowRoot, this.context.settingsManager.config);
            this.switchToPane('diagnostics');
        }
        hide() {
            if (this.hostElement) this.hostElement.classList.remove(CONSTANTS.CLASSES.VISIBLE);
            document.documentElement.style.overflow = ''; document.body.style.overflow = '';
            if (this.infoUpdateInterval) clearInterval(this.infoUpdateInterval);
        }
    }

    class Draggable extends BaseModule {
        constructor(context, element, handles, playerManager) {
            super(context, 'Draggable');
            this.element = element; this.handles = handles; this.playerManager = playerManager;
            this.isDragging = false; this.dragStartPos = { x: 0, y: 0 }; this.elementStartPos = { x: 0, y: 0 };
            this.boundHandleDragStart = this.handleDragStart.bind(this);
            this.boundHandleDragMove = this.handleDragMove.bind(this);
            this.boundHandleDragEnd = this.handleDragEnd.bind(this);
            this.addListeners();
        }
        addListeners() { this.handles.forEach(h => h.addEventListener('pointerdown', this.boundHandleDragStart, { capture: true })); }
        destroy() { this.removeDragListeners(); this.handles.forEach(h => h.removeEventListener('pointerdown', this.boundHandleDragStart, { capture: true })); this.element = null; }
        removeDragListeners() { document.removeEventListener('pointermove', this.boundHandleDragMove, { capture: true }); document.removeEventListener('pointerup', this.boundHandleDragEnd, { capture: true }); document.removeEventListener('pointercancel', this.boundHandleDragEnd, { capture: true }); }
        handleDragStart(e) {
            if (!this.element || e.button !== 0) return;
            e.stopPropagation(); e.preventDefault();
            this.isDragging = true;
            this.playerManager?.showIndicatorPermanently(true);
            this.element.style.transition = 'none';
            const rect = this.element.getBoundingClientRect();
            this.element.style.left = `0px`; this.element.style.top = `0px`;
            this.element.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
            this.elementStartPos = { x: rect.left, y: rect.top };
            this.dragStartPos = { x: e.clientX, y: e.clientY };
            document.addEventListener('pointermove', this.boundHandleDragMove, { capture: true });
            document.addEventListener('pointerup', this.boundHandleDragEnd, { capture: true });
            document.addEventListener('pointercancel', this.boundHandleDragEnd, { capture: true });
        }
        handleDragMove(e) {
            if (!this.isDragging || !this.element) return;
            e.stopPropagation(); e.preventDefault();
            let newX = this.elementStartPos.x + (e.clientX - this.dragStartPos.x);
            let newY = this.elementStartPos.y + (e.clientY - this.dragStartPos.y);
            newX = Math.max(0, Math.min(newX, window.innerWidth - this.element.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - this.element.offsetHeight));
            this.element.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
        }
        handleDragEnd(e) {
            if (!this.isDragging || !this.element) return;
            e.stopPropagation();
            this.isDragging = false;
            this.removeDragListeners();
            this.playerManager?.resetIndicatorTimeout();
            this.element.style.transition = '';
            const matrix = new DOMMatrix(window.getComputedStyle(this.element).transform);
            const finalPos = { top: `${matrix.m42}px`, left: `${matrix.m41}px` };
            this.element.style.left = finalPos.left; this.element.style.top = finalPos.top; this.element.style.transform = '';
            const isVideoVertical = this.playerManager.videoElement.videoHeight > this.playerManager.videoElement.videoWidth;
            const videoOrientationKey = isVideoVertical ? 'verticalVideo' : 'horizontalVideo';
            const isPhoneLandscape = screen.orientation.type.includes('landscape');
            const phoneOrientationKey = isPhoneLandscape ? 'landscape' : 'portrait';
            this.context.settingsManager.savePlayerPosition(window.location.hostname, `${phoneOrientationKey}_${videoOrientationKey}`, finalPos);
        }
    }
    class CustomControlsHandler extends BaseModule {
        constructor(context, container, video) {
            super(context, 'CustomControlsHandler');
            this.container = container; this.video = video; this.eventManager = new EventManager();
            this.hideTimeout = null; this.isSeeking = false; this.lastKnownVolumeBeforeMute = 1.0;
            this.boundHandleVolumeChange = this.handleVolumeChange.bind(this);
            this.boundHandleTimeUpdate = this.handleTimeUpdate.bind(this);
            this.boundHandleDurationChange = this.handleDurationChange.bind(this);
            this.boundHandleProgress = this.handleProgress.bind(this);
            this.boundOnPlay = this.onPlay.bind(this);
            this.boundOnPause = this.onPause.bind(this);
            this.boundHandleTap = this.handleTap.bind(this);
            this.boundResetHideTimeout = this.resetHideTimeout.bind(this);
            this.boundHideControls = this.hideControls.bind(this);
            this.controlActions = { '.dmz-big-play-button': this.togglePlay.bind(this), '.dmz-fullscreen-btn': this.toggleFullscreen.bind(this), '.dmz-mute-btn': this.toggleMute.bind(this), '.dmz-more-btn': this.toggleMoreMenu.bind(this), '.dmz-pip-btn': this.togglePip.bind(this), '.dmz-playback-rate-btn': this.showPlaybackRates.bind(this) };
        }
        init() {
            this.controlsBar = this.container.querySelector('.dmz-controls-bar');
            this.bigPlayButton = this.container.querySelector('.dmz-big-play-button');
            this.currentTimeEl = this.container.querySelector('.dmz-current-time');
            this.totalTimeEl = this.container.querySelector('.dmz-total-time');
            this.progressBar = this.container.querySelector('.dmz-progress-bar');
            this.playedBar = this.container.querySelector('.dmz-progress-played');
            this.bufferBar = this.container.querySelector('.dmz-progress-buffer');
            this.handle = this.container.querySelector('.dmz-progress-handle');
            this.fullscreenEnterIcon = this.container.querySelector('.dmz-fullscreen-btn .icon-fullscreen-enter');
            this.fullscreenExitIcon = this.container.querySelector('.dmz-fullscreen-btn .icon-fullscreen-exit');
            this.volumeOnIcon = this.container.querySelector('.dmz-mute-btn .icon-volume-on');
            this.volumeOffIcon = this.container.querySelector('.dmz-mute-btn .icon-volume-off');
            this.moreMenu = this.container.querySelector('.dmz-more-menu');
            this.pipBtn = this.container.querySelector('.dmz-pip-btn');
            this.playbackRateBtn = this.container.querySelector('.dmz-playback-rate-btn');
            this.playbackRateValue = this.container.querySelector('.dmz-playback-rate-btn .dmz-menu-item-value');
            this.playbackRatesContainer = this.container.querySelector('.dmz-playback-rates');
            this.lastKnownVolumeBeforeMute = this.context.settingsManager.config.lastVolume;
            this.addEventListeners();
            this.updatePlayButton();
            this.updateFullscreenButton();
            this.updateMuteButton();
            if (!document.pictureInPictureEnabled && this.pipBtn) this.pipBtn.style.display = 'none';
        }
        addEventListeners() {
            this.eventManager.add(this.video, 'play', this.boundOnPlay);
            this.eventManager.add(this.video, 'pause', this.boundOnPause);
            this.eventManager.add(this.video, 'volumechange', this.boundHandleVolumeChange);
            this.eventManager.add(this.video, 'timeupdate', this.boundHandleTimeUpdate);
            this.eventManager.add(this.video, 'durationchange', this.boundHandleDurationChange);
            this.eventManager.add(this.video, 'progress', this.boundHandleProgress);
            this.eventManager.add(this.container, 'mousemove', this.boundResetHideTimeout);
            const shield = (e) => e.stopPropagation();
            if (this.controlsBar) this.eventManager.add(this.controlsBar, 'pointerdown', shield, { capture: true });
            if (this.controlsBar) this.eventManager.add(this.controlsBar, 'click', this.boundHandleTap, { capture: true });
            if (this.bigPlayButton) this.eventManager.add(this.bigPlayButton, 'click', this.boundHandleTap, { capture: true });
        }
        destroy() { this.eventManager.removeAll(); clearTimeout(this.hideTimeout); }
        handleTap(e) { e.stopPropagation(); this.handleTapOnControl(e.target); }
        onPlay() {
            this.updatePlayButton();
            const { playerManager, diagnosticsTool, coreLogic } = this.context;
            if (playerManager.currentVideoType === 'normal') diagnosticsTool.playbackHealth.media.status = 'success';
            else if (diagnosticsTool.playbackHealth.media.status === 'pending') diagnosticsTool.playbackHealth.media.status = 'success';
            const currentPlayingUrl = playerManager.currentVideoUrl;
            if (!currentPlayingUrl) return;
            const getUrlCore = (url) => { try { return new URL(url).pathname; } catch (e) { return url; } };
            const playingUrlCore = getUrlCore(currentPlayingUrl);
            coreLogic.findAllVideosAndAudioInPage().forEach(media => {
                if (media.id === CONSTANTS.IDS.PLAYER || !media.dataset.dmzNeutralized) return;
                const originalSrc = media.dataset.dmzOriginalSrc;
                if (originalSrc && getUrlCore(originalSrc) === playingUrlCore) { coreLogic.neutralizedMedia.add(media); coreLogic.startPersistentEnforcer(); }
            });
        }
        onPause() { this.updatePlayButton(); }
        handleTapOnControl(targetElement) {
            if (!targetElement) return false;
            const actionKey = Object.keys(this.controlActions).find(selector => targetElement.closest(selector));
            if (actionKey) { this.controlActions[actionKey](); return true; }
            const rateButton = targetElement.closest('[data-rate]');
            if (rateButton) { this.setPlaybackRate(parseFloat(rateButton.dataset.rate)); return true; }
            return false;
        }
        toggleMoreMenu() {
            const isVisible = DomUtils.toggleVisibility(this.moreMenu);
            if (isVisible) {
                DomUtils.toggleVisibility(this.playbackRatesContainer, false);
                if (this.pipBtn) this.pipBtn.style.display = document.pictureInPictureEnabled ? 'flex' : 'none';
                if (this.playbackRateBtn) this.playbackRateBtn.style.display = 'flex';
            }
        }
        hideMoreMenu() { DomUtils.toggleVisibility(this.moreMenu, false); }
        togglePip() {
            this.hideMoreMenu();
            if (!document.pictureInPictureElement) this.video.requestPictureInPicture().catch(e => this.log(`请求画中画失败:${e.message}`, CONSTANTS.LOG_TYPES.ERROR));
            else document.exitPictureInPicture();
        }
        showPlaybackRates() {
            if (!this.playbackRatesContainer || !this.playbackRateBtn) return;
            if (this.pipBtn) this.pipBtn.style.display = 'none';
            if (this.playbackRateBtn) this.playbackRateBtn.style.display = 'none';
            DomUtils.toggleVisibility(this.playbackRatesContainer, true);
        }
        setPlaybackRate(rate) {
            this.video.playbackRate = rate;
            if (this.playbackRateValue) this.playbackRateValue.textContent = rate === 1.0 ? '正常' : `${rate}x`;
            if (this.playbackRatesContainer) {
                this.playbackRatesContainer.querySelector('.active')?.classList.remove('active');
                this.playbackRatesContainer.querySelector(`[data-rate="${rate}"]`)?.classList.add('active');
            }
            this.hideMoreMenu();
        }
        toggleControlsVisibility() { clearTimeout(this.hideTimeout); this.hideMoreMenu(); this.controlsBar?.classList.contains(CONSTANTS.CLASSES.HIDDEN) ? this.resetHideTimeout() : this.hideControls(); }
        updateSeekUI(clientX) {
            if (!this.progressBar || !this.video?.duration) return;
            const rect = this.progressBar.getBoundingClientRect();
            if (rect.width === 0) return;
            let pos = (clientX - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            const newTime = pos * this.video.duration;
            if (isNaN(newTime)) return;
            const percentage = pos * 100;
            if (this.playedBar) this.playedBar.style.width = `${percentage}%`;
            if (this.handle) this.handle.style.left = `${percentage}%`;
            if (this.currentTimeEl) this.currentTimeEl.textContent = Utils.formatTime(newTime);
            return newTime;
        }
        togglePlay() {
            if (this.video) {
                if (this.video.paused) {
                    const promise = this.video.play();
                    if (promise !== undefined) promise.catch(e => console.log('Playback blocked', e));
                } else {
                    this.video.pause();
                }
            }
        }
        toggleFullscreen() { this.context.playerManager.fullscreenHandler?.toggleState(); }
        toggleMute() {
            if (!this.video) return;
            if (this.video.muted || this.video.volume === 0) { this.video.volume = this.lastKnownVolumeBeforeMute > 0.05 ? this.lastKnownVolumeBeforeMute : 0.5; this.video.muted = false; }
            else this.video.muted = true;
            this.context.settingsManager.save({ isMuted: this.video.muted }, false);
        }
        handleVolumeChange() {
            this.updateMuteButton();
            const effectivelyMuted = this.video.muted || this.video.volume === 0;
            if (effectivelyMuted) this.context.settingsManager.save({ isMuted: true }, false);
            else { this.lastKnownVolumeBeforeMute = this.video.volume; this.context.settingsManager.save({ lastVolume: this.video.volume, isMuted: false }, false); }
        }
        updatePlayButton() {
            const bigPlayButton = this.container.querySelector('.dmz-big-play-button');
            const bigPlayButtonContainer = this.container.querySelector('.dmz-big-play-button-container');
            if (!bigPlayButton) return;
            if (this.video.paused) { bigPlayButton.innerHTML = ICONS.BIG_PLAY; if (bigPlayButtonContainer) bigPlayButtonContainer.style.opacity = '1'; }
            else { bigPlayButton.innerHTML = ICONS.BIG_PAUSE.replace(/^<svg[^>]+>/, '<svg class="icon-pause-fixed" viewBox="0 0 24 24">'); if (bigPlayButtonContainer) bigPlayButtonContainer.style.opacity = ''; }
        }
        updateFullscreenButton() { const isFullscreen = !!document.fullscreenElement; DomUtils.toggleIcon(isFullscreen ? this.fullscreenExitIcon : this.fullscreenEnterIcon, [isFullscreen ? this.fullscreenEnterIcon : this.fullscreenExitIcon]); }
        updateMuteButton() { const isMuted = this.video.muted || this.video.volume === 0; DomUtils.toggleIcon(isMuted ? this.volumeOffIcon : this.volumeOnIcon, [isMuted ? this.volumeOnIcon : this.volumeOffIcon]); }
        handleTimeUpdate() {
            if (this.isSeeking || !isFinite(this.video.duration)) return;
            requestAnimationFrame(() => {
                if (this.video && this.playedBar && this.handle && this.currentTimeEl) {
                    const percentage = (this.video.currentTime / this.video.duration) * 100;
                    this.playedBar.style.width = `${percentage}%`;
                    this.handle.style.left = `${percentage}%`;
                    this.currentTimeEl.textContent = Utils.formatTime(this.video.currentTime);
                }
            });
        }
        handleDurationChange() { if (this.totalTimeEl) this.totalTimeEl.textContent = Utils.formatTime(this.video.duration); }
        handleProgress() { if (this.video.duration > 0 && this.video.buffered.length > 0 && this.bufferBar) this.bufferBar.style.width = `${(this.video.buffered.end(this.video.buffered.length - 1) / this.video.duration) * 100}%`; }
        showControls() { this.controlsBar?.classList.remove(CONSTANTS.CLASSES.HIDDEN); this.container.classList.add('dmz-controls-visible'); }
        hideControls() { if (this.isSeeking) return; this.controlsBar?.classList.add(CONSTANTS.CLASSES.HIDDEN); this.container.classList.remove('dmz-controls-visible'); this.hideMoreMenu(); }
        resetHideTimeout() { this.showControls(); clearTimeout(this.hideTimeout); this.hideTimeout = setTimeout(this.boundHideControls, 1500); }
    }
    class FullscreenGestureHandler extends BaseModule {
        constructor(context, container, video) {
            super(context, 'FullscreenGestureHandler');
            this.container = container; this.video = video; this.isEnabled = false;
            this.indicator = container.querySelector('.dmz-gesture-indicator-wrapper');
            this.indicatorIconContainer = this.indicator?.querySelector('.dmz-indicator-icon');
            this.indicatorText = this.indicator?.querySelector('.dmz-indicator-text');
            this.brightnessOverlay = container.querySelector('.dmz-brightness-overlay');
            this.brightnessIndicator = container.querySelector('.dmz-side-indicator-container.left');
            this.brightnessFill = this.brightnessIndicator?.querySelector('.dmz-side-indicator-fill');
            this.volumeIndicator = container.querySelector('.dmz-side-indicator-container.right');
            this.volumeFill = this.volumeIndicator?.querySelector('.dmz-side-indicator-fill');
            this.isSwiping = false; this.swipeType = null; this.startX = 0; this.startY = 0; this.startCurrentTime = 0; this.startVolume = 0; this.startBrightness = 0; this.hideIndicatorTimeout = null; this.longPressTimer = null; this.isFastForwarding = false; this.originalPlaybackRate = 1.0; this.lastTapTime = 0;
        }
        deactivate() { clearTimeout(this.longPressTimer); clearTimeout(this.hideIndicatorTimeout); }
        enable() { this.isEnabled = true; }
        disable() { this.isEnabled = false; }
        onPointerDown(e) {
            this.isSwiping = false; this.swipeType = null; this.startX = e.clientX; this.startY = e.clientY; this.startCurrentTime = this.video.currentTime; this.startVolume = this.video.volume; this.startBrightness = this.brightnessOverlay ? (parseFloat(this.brightnessOverlay.style.opacity) || 0) : 0;
            clearTimeout(this.longPressTimer);
            this.longPressTimer = setTimeout(() => { if (!this.isSwiping) this.activateFastForward(); }, CONSTANTS.LIMITS.LONG_PRESS_DURATION_MS);
        }
        onPointerMove(e) {
            const deltaX = e.clientX - this.startX;
            const deltaY = e.clientY - this.startY;
            if (!this.isSwiping && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
                clearTimeout(this.longPressTimer);
                this.isSwiping = true;
                this.volumeFill?.classList.remove('transition-active');
                this.brightnessFill?.classList.remove('transition-active');
            }
            if (this.isSwiping) {
                if (!this.swipeType) {
                    const absDeltaX = Math.abs(deltaX);
                    const absDeltaY = Math.abs(deltaY);
                    if (absDeltaX > absDeltaY * 2.0) this.swipeType = 'progress';
                    else if (absDeltaY > absDeltaX * 2.0) {
                        const playerRect = this.container.getBoundingClientRect();
                        this.swipeType = (this.startX < playerRect.left + playerRect.width / 2) ? 'brightness' : 'volume';
                    }
                }
                const yAdjustment = (deltaY * 3.0) / window.innerHeight;
                switch (this.swipeType) {
                    case 'progress': this._handleProgressSwipe(deltaX); break;
                    case 'volume': this._handleVolumeSwipe(yAdjustment); break;
                    case 'brightness': this._handleBrightnessSwipe(yAdjustment); break;
                }
            }
        }
        _handleProgressSwipe(deltaX) {
            if (!isFinite(this.video.duration)) return;
            const newTime = this.startCurrentTime + (deltaX / window.innerWidth) * (this.video.duration * 0.15);
            this.video.currentTime = Math.max(0, Math.min(newTime, this.video.duration));
            this.context.playerManager.customControlsHandler?.handleTimeUpdate();
            this.showIndicator(deltaX > 0 ? 'progress' : 'rewind', `${Utils.formatTime(this.video.currentTime)} (${Math.round((this.video.currentTime / this.video.duration) * 100)}%)`);
        }
        _handleVolumeSwipe(yAdjustment) {
            const newVolume = Math.max(0, Math.min(this.startVolume - yAdjustment, 1));
            if (newVolume > 0 && this.video.muted) this.video.muted = false;
            this.video.volume = newVolume;
            this.showIndicator('volume', null, this.video.volume * 100);
        }
        _handleBrightnessSwipe(yAdjustment) {
            if (!this.brightnessOverlay) return;
            const newBrightness = this.startBrightness + yAdjustment;
            this.brightnessOverlay.style.opacity = Math.max(0, Math.min(newBrightness, 0.8));
            this.showIndicator('brightness', null, (1 - parseFloat(this.brightnessOverlay.style.opacity) / 0.8) * 100);
        }
        onPointerUp(e) {
            this.volumeFill?.classList.add('transition-active');
            this.brightnessFill?.classList.add('transition-active');
            clearTimeout(this.longPressTimer);
            if (this.isFastForwarding) this.deactivateFastForward();
            else if (this.isSwiping) this.hideIndicator();
            else {
                const { customControlsHandler } = this.context.playerManager;
                if (e.target.closest('.dmz-big-play-button')) customControlsHandler?.togglePlay();
                else {
                    const now = Date.now();
                    if (now - this.lastTapTime < 300) { customControlsHandler?.toggleFullscreen(); this.lastTapTime = 0; }
                    else {
                        this.lastTapTime = now;
                        if (this.video.dataset.dmzStrategicMute === 'true') { this.video.muted = false; this.log("首次交互，已自动恢复声音。", CONSTANTS.LOG_TYPES.PLAYER); customControlsHandler?.updateMuteButton(); delete this.video.dataset.dmzStrategicMute; }
                        customControlsHandler?.toggleControlsVisibility();
                    }
                }
            }
            this.isSwiping = false; this.swipeType = null;
        }
        activateFastForward() {
            if (!this.video || this.isFastForwarding) return;
            const longPressRate = this.context.settingsManager.config.longPressRate || 2.0;
            this.isFastForwarding = true;
            this.originalPlaybackRate = this.video.playbackRate;
            this.video.playbackRate = longPressRate;
            this.showIndicator('progress', `${longPressRate}x 倍速播放`);
            this.context.playerManager.customControlsHandler?.hideControls();
            this.context.playerManager.showIndicatorPermanently(false);
            this.log(`长按倍速已激活`, CONSTANTS.LOG_TYPES.PLAYER);
        }
        deactivateFastForward() {
            if (!this.video || !this.isFastForwarding) return;
            this.isFastForwarding = false;
            this.video.playbackRate = this.originalPlaybackRate;
            this._hideAllIndicators();
            this.log(`长按倍速已结束，恢复原速`, CONSTANTS.LOG_TYPES.PLAYER);
        }
        _hideAllIndicators() { this.indicator?.classList.remove(CONSTANTS.CLASSES.VISIBLE); this.brightnessIndicator?.classList.remove(CONSTANTS.CLASSES.VISIBLE); this.volumeIndicator?.classList.remove(CONSTANTS.CLASSES.VISIBLE); }
        _updateSideIndicator(indicator, fill, value) { if (!indicator || !fill) return; indicator.classList.add(CONSTANTS.CLASSES.VISIBLE); fill.style.height = `${value}%`; }
        showIndicator(type, text, value) {
            clearTimeout(this.hideIndicatorTimeout);
            this._hideAllIndicators();
            if (type === 'brightness') this._updateSideIndicator(this.brightnessIndicator, this.brightnessFill, value);
            else if (type === 'volume') this._updateSideIndicator(this.volumeIndicator, this.volumeFill, value);
            else if (this.indicator && this.indicatorIconContainer && this.indicatorText) {
                Array.from(this.indicatorIconContainer?.querySelectorAll('svg') || []).forEach(svg => (svg.style.display = 'none'));
                const icon = this.indicatorIconContainer.querySelector(type === 'rewind' ? '.icon-rewind' : `.icon-${type}`);
                if (icon) icon.style.display = 'block';
                this.indicatorText.textContent = text;
                this.indicator.classList.add(CONSTANTS.CLASSES.VISIBLE);
            }
        }
        hideIndicator() { this.hideIndicatorTimeout = setTimeout(() => this._hideAllIndicators(), 800); }
    }
    class FullscreenHandler extends BaseModule {
        constructor(context, container) { super(context, 'FullscreenHandler'); this.containerElement = container; this.eventManager = new EventManager(); this.onFullscreenChange = this.onFullscreenChange.bind(this); this.eventManager.add(document, 'fullscreenchange', this.onFullscreenChange); }
        destroy() { this.eventManager.removeAll(); }
        onFullscreenChange() { this.context.playerManager.customControlsHandler?.updateFullscreenButton(); this.context.playerManager.customControlsHandler?.resetHideTimeout(); }
        async toggleState() { document.fullscreenElement ? await this.exitFullscreen() : await this.enterFullscreen(); }
        async enterFullscreen() { try { await this.containerElement?.requestFullscreen(); } catch (e) { this.log(`全屏失败:${e.message}`, CONSTANTS.LOG_TYPES.ERROR); } }
        async exitFullscreen() { if (document.fullscreenElement) await document.exitFullscreen(); }
    }

    class PlayerManager extends BaseModule {
        constructor(context) {
            super(context, 'PlayerManager');
            this.hostElement = null; this.shadowRoot = null; this.videoElement = null;
            this.hlsInstance = null; this.draggableInstance = null; this.fullscreenGestureHandler = null;
            this.customControlsHandler = null; this.fullscreenHandler = null;
            this.isPlayerActiveOrInitializing = false; this.isInternalRequest = false;
            this.currentVideoType = null; this.currentVideoUrl = null; this.currentVideoFormat = null;
            this.currentPlaybackEngine = null; this.lastM3u8Content = ''; this.currentRequestUrl = null;
            this.originalPlayerStyle = null; this.dragHandles = []; this.indicatorHideTimeout = null;
            this.currentVideoResolution = null;
            this.boundHandleOrientationChange = this._handleOrientationChange.bind(this);
            this.boundHandlePointerDown = this.handlePointerDown.bind(this);
            this.boundHandlePointerMove = this.handlePointerMove.bind(this);
            this.boundHandlePointerUp = this.handlePointerUp.bind(this);
        }
        showIndicatorPermanently(visible) { clearTimeout(this.indicatorHideTimeout); this.dragHandles.forEach(h => h.classList.toggle('dmz-indicator-visible', visible)); }
        resetIndicatorTimeout() { this.showIndicatorPermanently(true); this.indicatorHideTimeout = setTimeout(() => { this.dragHandles.forEach(h => h.classList.remove('dmz-indicator-visible')); }, 1000); }
        _createDragHandleBar() { return DomUtils.create('div', { className: CONSTANTS.CLASSES.DRAG_HANDLE }, [DomUtils.create('div', { className: `${CONSTANTS.CLASSES.SCREW_EFFECT} left` }), DomUtils.create('div', { className: CONSTANTS.CLASSES.INDICATOR }), DomUtils.create('div', { className: `${CONSTANTS.CLASSES.SCREW_EFFECT} right` })]); }
        _createControlsBar() {
            return DomUtils.create('div', { className: 'dmz-controls-bar' }, [
                DomUtils.create('div', { className: 'dmz-bottom-controls' }, [
                    DomUtils.create('span', { className: 'dmz-time-display dmz-current-time', textContent: '00:00' }),
                    DomUtils.create('div', { className: 'dmz-time-separator', textContent: '/' }),
                    DomUtils.create('span', { className: 'dmz-time-display dmz-total-time', textContent: '00:00' }),
                    DomUtils.create('div', { className: 'dmz-spacer' }),
                    DomUtils.create('button', { className: 'dmz-control-button dmz-mute-btn', innerHTML: ICONS.VOLUME_ON + ICONS.VOLUME_OFF }),
                    DomUtils.create('button', { className: 'dmz-control-button dmz-fullscreen-btn', innerHTML: ICONS.FS_ENTER + ICONS.FS_EXIT }),
                    DomUtils.create('div', { className: 'dmz-more-menu-container' }, [
                        DomUtils.create('button', { className: 'dmz-control-button dmz-more-btn', innerHTML: ICONS.MORE }),
                        DomUtils.create('div', { className: 'dmz-more-menu' }, [
                            DomUtils.create('div', { className: 'dmz-menu-item dmz-pip-btn', innerHTML: ICONS.PIP + '<span class="dmz-menu-item-label">画中画</span>' }),
                            DomUtils.create('div', { className: 'dmz-menu-item dmz-playback-rate-btn', innerHTML: ICONS.PLAYBACK_RATE + '<span class="dmz-menu-item-label">播放速度</span><span class="dmz-menu-item-value">正常</span>' }),
                            DomUtils.create('div', { className: 'dmz-playback-rates' }, [DomUtils.create('div', { className: 'dmz-menu-item', 'data-rate': '0.5', textContent: '0.5x' }), DomUtils.create('div', { className: 'dmz-menu-item active', 'data-rate': '1.0', textContent: '正常' }), DomUtils.create('div', { className: 'dmz-menu-item', 'data-rate': '1.5', textContent: '1.5x' }), DomUtils.create('div', { className: 'dmz-menu-item', 'data-rate': '2.0', textContent: '2.0x' })])
                        ])
                    ])
                ]),
                DomUtils.create('div', { className: 'dmz-progress-container' }, [DomUtils.create('div', { className: 'dmz-progress-bar' }, [DomUtils.create('div', { className: 'dmz-progress-rail' }, [DomUtils.create('div', { className: 'dmz-progress-buffer' }), DomUtils.create('div', { className: 'dmz-progress-played' }), DomUtils.create('div', { className: 'dmz-progress-handle' })])])])
            ]);
        }
        async createBasePlayerContainer() {
            this.log("创建播放器基础容器...", CONSTANTS.LOG_TYPES.PLAYER);
            this.cleanup(true);
            this.hostElement = DomUtils.create('div', { id: CONSTANTS.IDS.ROOT, style: { left: '50%', top: '0px', width: '280px', height: '36px', gap: '0px', transform: 'translateX(-50%) translateY(0px)' } });
            this.hostElement.addEventListener('click', (e) => { if (e.target.closest(`.${CONSTANTS.CLASSES.VIDEO_WRAPPER}, .${CONSTANTS.CLASSES.DRAG_HANDLE}`)) { e.stopPropagation(); } }, true);
            window.addEventListener('orientationchange', this.boundHandleOrientationChange);
            if (!document.body) await new Promise(resolve => window.addEventListener('DOMContentLoaded', resolve, { once: true }));
            document.body.appendChild(this.hostElement);
            this.shadowRoot = this.hostElement.attachShadow({ mode: 'closed' });
            this.context.styleManager.injectPlayerStyles(this.shadowRoot);
            const closeButton = DomUtils.create('div', { className: CONSTANTS.CLASSES.CLOSE_BUTTON, textContent: '×' });
            const handleClose = (e) => { e.stopPropagation(); e.preventDefault(); this.context.coreLogic.restorePageToOriginalState(); };
            closeButton.addEventListener('touchend', handleClose);
            closeButton.addEventListener('click', handleClose);
            const savedConfig = this.context.settingsManager.config;
            const actualVideo = DomUtils.create('video', { id: CONSTANTS.IDS.PLAYER, playsInline: true, autoplay: savedConfig.autoPlay });
            this.videoElement = actualVideo;
            actualVideo.volume = savedConfig.lastVolume;
            actualVideo.playbackRate = savedConfig.defaultPlaybackRate;
            if (savedConfig.isMuted) { actualVideo.muted = true; this.log("应用用户偏好：静音。", CONSTANTS.LOG_TYPES.PLAYER); }
            else { actualVideo.muted = true; actualVideo.dataset.dmzStrategicMute = 'true'; this.log("应用用户偏好：策略性静音已启动。", CONSTANTS.LOG_TYPES.PLAYER); }
            const videoWrapper = DomUtils.create('div', { className: CONSTANTS.CLASSES.VIDEO_WRAPPER, innerHTML: `<div class="dmz-side-indicator-container left"><div class="dmz-side-indicator-bar-wrapper"><div class="dmz-side-indicator-fill transition-active"></div></div><div class="dmz-side-indicator-icon">${ICONS.BRIGHTNESS}</div></div><div class="dmz-side-indicator-container right"><div class="dmz-side-indicator-bar-wrapper"><div class="dmz-side-indicator-fill transition-active"></div></div><div class="dmz-side-indicator-icon">${ICONS.VOLUME_SIDE}</div></div><div class="dmz-big-play-button-container"><button class="dmz-big-play-button">${ICONS.BIG_PLAY}${ICONS.BIG_PAUSE}</button></div><div class="dmz-gesture-indicator-wrapper"><div class="dmz-indicator-icon">${ICONS.FORWARD}${ICONS.REWIND}</div><div class="dmz-indicator-text"></div></div><div class="dmz-brightness-overlay"></div>` });
            videoWrapper.prepend(closeButton, actualVideo);
            videoWrapper.append(this._createControlsBar());
            videoWrapper.addEventListener('touchstart', () => this.resetIndicatorTimeout(), { passive: true });
            videoWrapper.addEventListener('mousemove', () => this.resetIndicatorTimeout());
            const headerBar = this._createDragHandleBar();
            const footerBar = this._createDragHandleBar();
            this.dragHandles = [headerBar, footerBar];
            const container = DomUtils.create('div', {}, [headerBar, videoWrapper, footerBar]);
            this.shadowRoot.appendChild(container);
            this.draggableInstance = new Draggable(this.context, this.hostElement, this.dragHandles, this);
            this.customControlsHandler = new CustomControlsHandler(this.context, videoWrapper, actualVideo);
            this.customControlsHandler.init();
            this.fullscreenGestureHandler = new FullscreenGestureHandler(this.context, videoWrapper, actualVideo);
            this.fullscreenGestureHandler.enable();
            this.fullscreenHandler = new FullscreenHandler(this.context, videoWrapper);
            this.activeInteraction = null;
            videoWrapper.addEventListener('pointerdown', this.boundHandlePointerDown, { capture: true });
            this.log("所有模块初始化完成。", CONSTANTS.LOG_TYPES.PLAYER);
            return { video: actualVideo, videoWrapper };
        }
        async _applyOrientationLayout() {
            if (!this.hostElement || !this.videoElement || !this.isPlayerActiveOrInitializing || !this.videoElement.videoWidth) return;
            const orientationType = screen.orientation?.type ?? (Math.abs(window.orientation || 0) === 90 ? 'landscape' : 'portrait');
            const isPhoneLandscape = orientationType.includes('landscape');
            const isVideoVertical = this.videoElement.videoHeight > this.videoElement.videoWidth;
            const videoOrientationKey = isVideoVertical ? 'verticalVideo' : 'horizontalVideo';
            const phoneOrientationKey = isPhoneLandscape ? 'landscape' : 'portrait';
            const savedPos = await this.context.settingsManager.loadPlayerPosition(window.location.hostname, `${phoneOrientationKey}_${videoOrientationKey}`);
            if (!isPhoneLandscape) {
                if (this.originalPlayerStyle) { Object.assign(this.hostElement.style, this.originalPlayerStyle); this.originalPlayerStyle = null; }
                this.hostElement.style.width = isVideoVertical ? '60vw' : '100vw';
                this.hostElement.style.height = '';
                if (savedPos && savedPos.top) {
                    const l = parseFloat(savedPos.left), t = parseFloat(savedPos.top);
                    if (l > window.innerWidth - 30 || t > window.innerHeight - 30 || l < -50 || t < -50) { this.hostElement.style.top = isVideoVertical ? '192px' : '60px'; this.hostElement.style.left = '50%'; this.hostElement.style.transform = 'translateX(-50%)'; }
                    else { this.hostElement.style.top = savedPos.top; this.hostElement.style.left = savedPos.left; this.hostElement.style.transform = ''; }
                } else { this.hostElement.style.top = isVideoVertical ? '192px' : '60px'; this.hostElement.style.left = '50%'; this.hostElement.style.transform = 'translateX(-50%)'; }
                return;
            }
            if (isPhoneLandscape) {
                if (!this.originalPlayerStyle) this.originalPlayerStyle = { left: this.hostElement.style.left, top: this.hostElement.style.top, width: this.hostElement.style.width, height: this.hostElement.style.height, transform: this.hostElement.style.transform };
                this.log('应用横屏布局。', CONSTANTS.LOG_TYPES.UI);
                this.hostElement.style.transform = '';
                if (savedPos) {
                    const l = parseFloat(savedPos.left), t = parseFloat(savedPos.top);
                    if (l > window.innerWidth - 30 || t > window.innerHeight - 30 || l < -50 || t < -50) { this.hostElement.style.top = '20px'; this.hostElement.style.left = '20px'; }
                    else { this.hostElement.style.top = savedPos.top; this.hostElement.style.left = savedPos.left; }
                } else { this.hostElement.style.top = '20px'; this.hostElement.style.left = '20px'; }
                const videoAspectRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;
                if (isVideoVertical) { this.hostElement.style.height = 'calc(100vh - 40px)'; this.hostElement.style.width = `calc((100vh - 40px) * ${videoAspectRatio})`; }
                else { const defaultWidth = '45vw'; this.hostElement.style.width = defaultWidth; this.hostElement.style.height = `calc(${defaultWidth} / ${videoAspectRatio})`; }
            }
        }
        _handleOrientationChange() { this.hostElement.classList.add('dmz-no-transition'); this._applyOrientationLayout(); requestAnimationFrame(() => this.hostElement?.classList.remove('dmz-no-transition')); }
        async _preparePlaybackSession(videoType) {
            const { settingsManager } = this.context;
            this.isPlayerActiveOrInitializing = true;
            this.currentVideoType = videoType;
            if (!CONSTANTS.IS_TOP_FRAME && settingsManager.config.crossFrameSupport) { this.isPlayerActiveOrInitializing = false; return null; }
            return await this.createBasePlayerContainer();
        }
        async revealPlayer(video, videoWrapper) {
            const { settingsManager, coreLogic, frameCommunicator } = this.context;
            const mainIframe = frameCommunicator.mainPlayerIframeElement;
            if (mainIframe && mainIframe.style.visibility !== 'hidden') {
                this.log(`渲染成功，执行中和：留空间并隐藏Iframe。`, CONSTANTS.LOG_TYPES.CORE_NEUTRALIZE);
                coreLogic.hiddenIframeElement = mainIframe;
                coreLogic.originalIframeVisibilityStyle = mainIframe.style.visibility;
                coreLogic.originalIframePointerEventsStyle = mainIframe.style.pointerEvents;
                coreLogic.originalIframeSrc = mainIframe.src;
                mainIframe.style.visibility = 'hidden';
                mainIframe.style.pointerEvents = 'none';
            }
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                this._finalizePlayerReveal(video, videoWrapper, video.videoWidth, video.videoHeight);
                return;
            }
            if (this.predefinedResolution && this.predefinedResolution.width > 0) {
                this.log(`⚡️ 使用预读取尺寸 (${this.predefinedResolution.width}x${this.predefinedResolution.height}) 进行极速渲染。`, CONSTANTS.LOG_TYPES.PLAYER_REVEAL);
                Object.defineProperties(video, {
                    videoWidth: { value: this.predefinedResolution.width, configurable: true },
                    videoHeight: { value: this.predefinedResolution.height, configurable: true }
                });
                this._finalizePlayerReveal(video, videoWrapper, this.predefinedResolution.width, this.predefinedResolution.height);
                return;
            }
            this.log(`视频尺寸未就绪，启动严格校验模式...`, CONSTANTS.LOG_TYPES.PLAYER_REVEAL);
            try {
                await new Promise((resolve, reject) => {
                    let attempts = 0;
                    const maxAttempts = (this.context.coreLogic.lastCandidatesBackup?.size ?? 0) > 2 ? 200 : 500;
                    const intervalId = setInterval(() => {
                        if (!this.hostElement) { clearInterval(intervalId); reject(new Error('ABORT_TASK')); return; }
                        if (video.error || video.networkState === 3) { clearInterval(intervalId); reject(new Error('视频源已失效(NetworkState=3)或加载错误')); return; }
                        if (this.predefinedResolution || (video.videoWidth > 0 && video.videoHeight > 0)) { clearInterval(intervalId); resolve(); }
                        else {
                            attempts++;
                            if (attempts === 2) video.play().catch(() => { });
                            if (attempts === 40 && video.readyState === 0) video.load();
                            if (attempts > maxAttempts) { clearInterval(intervalId); reject(new Error(`等待视频尺寸超时`)); }
                        }
                    }, 20);
                });
                const w = video.videoWidth || this.predefinedResolution?.width;
                const h = video.videoHeight || this.predefinedResolution?.height;
                this.log(`轮询成功，视频尺寸已确认:(${w}x${h})。`, CONSTANTS.LOG_TYPES.PLAYER_REVEAL);
                this._finalizePlayerReveal(video, videoWrapper, w, h);
            } catch (error) {
                if (error.message === 'ABORT_TASK') { this.log(`[渲染中止]任务被中断 (用户操作/页面切换)。`, CONSTANTS.LOG_TYPES.LIFECYCLE); this.cleanup(); }
                else { this.log(`[渲染失败]|${error.message}->正在尝试备用信号...`, CONSTANTS.LOG_TYPES.WARN); coreLogic.reportPlaybackFailure({ failedUrl: this.currentVideoUrl, reason: error.message }); }
            }
        }
        async _finalizePlayerReveal(video, videoWrapper, finalW, finalH) {
            const { settingsManager, coreLogic } = this.context;
            this.currentVideoResolution = `${finalW}x${finalH}`;
            this.predefinedResolution = null;
            this.log(`视频分辨率已确认:(${this.currentVideoResolution})。`, CONSTANTS.LOG_TYPES.PLAYER_REVEAL);
            coreLogic.sandboxManager.cleanup();
            this.log(`视频元数据就绪，画面开始呈现(${finalW}x${finalH})。`, CONSTANTS.LOG_TYPES.PLAYER_REVEAL);
            try { const frames = window.frames; for (let i = 0; i < frames.length; i++) { try { frames[i].postMessage({ type: CONSTANTS.MESSAGE_TYPES.FORCE_PAUSE_ALL }, '*'); } catch (e) { } } } catch (e) { }
            if (!this.hostElement) { this.log("播放器显示失败：宿主元素不存在。", CONSTANTS.LOG_TYPES.WARN); this.cleanup(); return; }
            this.hostElement.classList.add('dmz-no-transition');
            await this._applyOrientationLayout();
            this.hostElement.style.gap = '3px';
            videoWrapper.style.flexGrow = '1';
            video.style.opacity = '1';
            void this.hostElement.offsetHeight;
            requestAnimationFrame(() => {
                if (this.hostElement) {
                    this.hostElement.classList.remove('dmz-no-transition');
                    this.hostElement.classList.add('dmz-visible');
                    requestAnimationFrame(() => { if (videoWrapper && finalW > 0) { const w = this.hostElement.clientWidth; const h = w * (finalH / finalW); videoWrapper.style.maxHeight = `${Math.min(h, window.innerHeight * 0.8)}px`; } });
                }
            });
            if (settingsManager.config.autoPlay) {
                const p = video.play();
                if (p !== undefined) p.catch(e => { this.log(`自动播放|⏸️|被阻断:${e.message}`, CONSTANTS.LOG_TYPES.WARN); });
                this.log("自动播放|▶️|已启动。", CONSTANTS.LOG_TYPES.PLAYER);
                this.customControlsHandler?.hideControls();
                this.showIndicatorPermanently(false);
            } else {
                this.log("自动播放|🚫|已禁用，请手动点击播放。", CONSTANTS.LOG_TYPES.PLAYER);
                video.pause();
                this.customControlsHandler?.resetHideTimeout();
            }
        }
        async play(videoData) {
            const { coreLogic } = this.context;
            this.log("指令已接收，准备渲染视频内容。", CONSTANTS.LOG_TYPES.PLAYER);
            const isM3U8 = typeof videoData === 'object';
            const videoType = isM3U8 ? 'm3u8' : 'normal';
            if (isM3U8) { this.currentVideoUrl = videoData.finalUrl; this.lastM3u8Content = videoData.original; }
            else { this.currentVideoUrl = videoData; this.lastM3u8Content = ''; }
            this.currentRequestUrl = this.currentVideoUrl;
            const containerElements = await this._preparePlaybackSession(videoType);
            if (!containerElements) { coreLogic.sendPlayCommand(videoType, videoData); return; }
            const { video, videoWrapper } = containerElements;
            const onReady = () => this.revealPlayer(video, videoWrapper);
            video.addEventListener('loadedmetadata', onReady, { once: true });
            if (isM3U8) this.playM3U8(videoData, video, true);
            else this.playNormalVideo(videoData, video);
        }
        playM3U8(m3u8Data, videoElement, isFirstPlay) {
            const { diagnosticsTool, coreLogic } = this.context;
            this.currentVideoFormat = { name: "M3U8", type: "流式传输" };
            const qualityMatch = m3u8Data.finalUrl.match(/\/(\d+p)\//);
            coreLogic.currentPlayingQuality = qualityMatch ? qualityMatch[1] : 'unknown';
            if (coreLogic.currentPlayingQuality !== 'unknown') {
                this.log(`当前播放清晰度已记录为:${coreLogic.currentPlayingQuality}。`, CONSTANTS.LOG_TYPES.PLAYER);
            }
            const originalContent = m3u8Data.original ?? '';
            if (originalContent.includes('#EXT-X-KEY') && !originalContent.includes('METHOD=NONE')) diagnosticsTool.playbackHealth.key.status = 'pending';
            else diagnosticsTool.playbackHealth.key.status = 'not_encrypted';
            const contentToPlay = m3u8Data.processed;
            if (this.m3u8BlobUrl) { URL.revokeObjectURL(this.m3u8BlobUrl); this.m3u8BlobUrl = null; }
            const blob = new Blob([contentToPlay], { type: 'application/vnd.apple.mpegurl' });
            this.m3u8BlobUrl = URL.createObjectURL(blob);
            diagnosticsTool.lastProcessedM3u8 = contentToPlay;
            try {
                this.isInternalRequest = true;
                if (CONSTANTS.Hls?.isSupported()) {
                    this.currentPlaybackEngine = 'HLS.js (v1.5.20 Optimized)';
                    const hls = new CONSTANTS.Hls(this._getHlsConfig());
                    this.hlsInstance = hls;
                    hls.attachMedia(videoElement);
                    this._bindHlsEvents(hls, videoElement, isFirstPlay);
                } else { this.log("HLS.js 不支持M3U8播放。", CONSTANTS.LOG_TYPES.ERROR); this.cleanup(); }
            } finally { setTimeout(() => { this.isInternalRequest = false; }, 500); }
        }
        _bindHlsEvents(hls, videoElement, isFirstPlay) {
            const { diagnosticsTool, settingsManager } = this.context;
            hls.on(CONSTANTS.Hls.Events.MEDIA_ATTACHED, () => { this.log("媒体元素已绑定，立即加载数据源...", CONSTANTS.LOG_TYPES.HLS); hls.loadSource(this.m3u8BlobUrl); });
            const captureResolution = (source, w, h) => { if (this.currentVideoResolution || this.predefinedResolution || !w || !h) return; this.predefinedResolution = { width: w, height: h }; this.log(`⚡️ [HLS优化] 通过${source} 获取真实尺寸:${w}x${h}，立即渲染。`, CONSTANTS.LOG_TYPES.PLAYER_REVEAL); };
            let consecutiveNetworkErrors = 0;
            hls.on(CONSTANTS.Hls.Events.MANIFEST_PARSED, (event, data) => {
                if (data.levels && data.levels.length > 0) {
                    const sortedLevels = data.levels.map((l, idx) => ({ level: l, index: idx })).sort((a, b) => {
                        const areaA = (a.level.width || 0) * (a.level.height || 0);
                        const areaB = (b.level.width || 0) * (b.level.height || 0);
                        if (areaA !== areaB) return areaB - areaA;
                        return (b.level.bitrate || 0) - (a.level.bitrate || 0);
                    });
                    const bestChoice = sortedLevels[0];
                    hls.startLevel = bestChoice.index;
                    hls.nextLevel = bestChoice.index;
                    const bestLevel = bestChoice.level;
                    const attrs = bestLevel.attrs || {};
                    const w = bestLevel.width || (attrs.RESOLUTION ? attrs.RESOLUTION.width : 0);
                    const h = bestLevel.height || (attrs.RESOLUTION ? attrs.RESOLUTION.height : 0);
                    const br = bestLevel.bitrate || attrs.BANDWIDTH || 0;
                    if (w && h) captureResolution('MANIFEST_PARSED', w, h);
                    const resInfo = (w && h) ? `${w}x${h}` : (br ? `约${(br / 1000).toFixed(0)}kbps` : `默认流(分辨率待测)。`);
                    this.log(`强制高分辨率|等级Lv${bestChoice.index}:${resInfo}`, CONSTANTS.LOG_TYPES.HLS);
                }
                this.log(`清单解析完成，发现${data.levels.length}个清晰度，开始缓冲...`, CONSTANTS.LOG_TYPES.HLS);
                diagnosticsTool.playbackHealth.manifest.status = 'success';
                consecutiveNetworkErrors = 0;
                if (isFirstPlay || settingsManager.config.autoPlay) { const playPromise = videoElement.play(); if (playPromise !== undefined) playPromise.catch(() => { }); }
            });
            hls.on(CONSTANTS.Hls.Events.FRAG_PARSED, (event, data) => { if (diagnosticsTool.playbackHealth.segments.status !== 'success') diagnosticsTool.playbackHealth.segments.status = 'success'; if (data.frag && hls.levels[data.frag.level]) { const level = hls.levels[data.frag.level]; captureResolution('FRAG_PARSED', level.width, level.height); } });
            hls.on(CONSTANTS.Hls.Events.LEVEL_UPDATED, (event, data) => { if (data.details && hls.levels[data.level]) { const level = hls.levels[data.level]; captureResolution('LEVEL_UPDATED', level.width, level.height); } });
            let firstFragStart = 0;
            hls.on(CONSTANTS.Hls.Events.FRAG_LOADING, () => { if (!firstFragStart) firstFragStart = performance.now(); });
            hls.on(CONSTANTS.Hls.Events.FRAG_LOADED, (event, data) => {
                if (diagnosticsTool.playbackHealth.segments.status !== 'success') {
                    const now = performance.now();
                    const manualTime = firstFragStart ? (now - firstFragStart) : 0;
                    const s1 = data.stats || {};
                    const s2 = (data.frag ? data.frag.stats : {}) || {};
                    let b = (data.payload ? (data.payload.byteLength || data.payload.length) : 0) || (s1.loaded || s1.total) || (s2.loaded || s2.total) || 0;
                    const timeStr = manualTime > 1 ? manualTime.toFixed(0) : (b > 0 ? '<1' : '0(缓存)');
                    const size = b > 0 ? (b < 1024 ? b + 'B' : (b / 1024).toFixed(1) + 'KB') : '缓存命中';
                    const timeDisplay = manualTime > 1000 ? `${(manualTime / 1000).toFixed(1)}s` : `${timeStr}ms`;
                    this.log(`首个分片下载成功(${size})，耗时${timeDisplay}。`, CONSTANTS.LOG_TYPES.HLS);
                }
                diagnosticsTool.playbackHealth.segments.status = 'success';
                consecutiveNetworkErrors = 0;
            });
            hls.on(CONSTANTS.Hls.Events.KEY_LOADED, () => { diagnosticsTool.playbackHealth.key.status = 'success'; });
            hls.on(CONSTANTS.Hls.Events.ERROR, (event, data) => {
                if (!data.fatal) return;
                if (data.type === CONSTANTS.Hls.ErrorTypes.NETWORK_ERROR) { consecutiveNetworkErrors++; this.log(`⚠️HLS 网络波动:${data.details}`, CONSTANTS.LOG_TYPES.WARN); if (consecutiveNetworkErrors <= 3) hls.startLoad(); else this.log(`❌ HLS 网络错误重试上限，停止播放。`, CONSTANTS.LOG_TYPES.ERROR); }
                else if (data.type === CONSTANTS.Hls.ErrorTypes.MEDIA_ERROR) { this.log("HLS 媒体解码异常，尝试恢复...", CONSTANTS.LOG_TYPES.HLS); hls.recoverMediaError(); }
                else { this.log(`HLS致命错误:${data.type}`, CONSTANTS.LOG_TYPES.ERROR); hls.destroy(); this.cleanup(); }
            });
        }
        _getHlsConfig() {
            return {
                debug: false,
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90,
                maxBufferLength: 60,
                maxMaxBufferLength: 600,
                maxBufferSize: 120 * 1024 * 1024,
                maxBufferHole: 2.5,
                maxSeekHole: 2.0,
                defaultAudioCodec: 'mp4a.40.2',
                startFragPrefetch: true,
                maxLoadingDelay: 4,
                minAutoBitrate: 0,
                manifestLoadingTimeOut: 15000,
                manifestLoadingMaxRetry: 3,
                manifestLoadingRetryDelay: 500,
                fragLoadingTimeOut: 25000,
                fragLoadingMaxRetry: 5,
                levelLoadingTimeOut: 15000,
                enableSoftwareAES: true,
                capLevelToPlayerSize: false,
                xhrSetup: (xhr) => { xhr.withCredentials = false; },
                fetchSetup: (context, init) => {
                    init.headers = init.headers || {};
                    init.headers.Origin = new URL(window.location.href).origin;
                    init.headers.Referer = window.location.href;
                    init.mode = 'cors';
                    init.cache = 'default';
                    return new Request(context.url, init);
                }
            };
        }
        playNormalVideo(videoUrl, videoElement) {
            this.currentPlaybackEngine = '浏览器原生';
            const { diagnosticsTool } = this.context;
            if (!this.currentVideoFormat) this.currentVideoFormat = Utils.getVideoFormat(videoUrl);
            this.currentVideoUrl = videoUrl; videoElement.src = videoUrl;
            videoElement.addEventListener('loadeddata', () => { diagnosticsTool.playbackHealth.media.status = 'success'; }, { once: true });
            videoElement.addEventListener('error', () => { diagnosticsTool.playbackHealth.media.status = 'error'; this.context.coreLogic.reportPlaybackFailure(); }, { once: true });
        }
        cleanup(isInternalCall = false) {
            window.removeEventListener('orientationchange', this.boundHandleOrientationChange);
            this.originalPlayerStyle = null;
            const { diagnosticsTool, coreLogic } = this.context;
            this.log(`开始清理播放器... (内部调用:${isInternalCall})。`, CONSTANTS.LOG_TYPES.PLAYER);
            document.querySelectorAll('.dmz-iframe-remote-trigger').forEach(el => { el.style.display = 'flex'; if (el.dmzUpdatePos) el.dmzUpdatePos(); });
            if (!isInternalCall) coreLogic.stopPersistentEnforcer();
            try {
                if (this.indicatorHideTimeout) clearTimeout(this.indicatorHideTimeout);
                if (this.hlsInstance) { this.hlsInstance.detachMedia(); this.hlsInstance.destroy(); }
                if (this.m3u8BlobUrl) { URL.revokeObjectURL(this.m3u8BlobUrl); this.m3u8BlobUrl = null; }
            }
            catch (e) { this.log(`清理HLS或Blob时发生错误:${e.message}`, CONSTANTS.LOG_TYPES.ERROR); }
            finally { this.hlsInstance = null; this.indicatorHideTimeout = null; }
            if (this.hostElement) {
                try {
                    if (this.videoElement) { this.videoElement.pause(); this.videoElement.removeAttribute('src'); this.videoElement.load(); }
                    this.draggableInstance?.destroy(); this.fullscreenGestureHandler?.deactivate(); this.customControlsHandler?.destroy(); this.fullscreenHandler?.destroy(); this.hostElement.remove();
                }
                catch (e) { this.log(`清理播放器UI模块时发生错误:${e.message}`, CONSTANTS.LOG_TYPES.ERROR); }
                finally { this.hostElement = null; this.shadowRoot = null; this.videoElement = null; this.draggableInstance = null; this.fullscreenGestureHandler = null; this.customControlsHandler = null; this.fullscreenHandler = null; }
            }
            this.currentVideoResolution = null;
            if (!isInternalCall) {
                try {
                    if (coreLogic.backupBufferTimer) { clearTimeout(coreLogic.backupBufferTimer); coreLogic.backupBufferTimer = null; }
                    coreLogic.isBufferingBackupCandidates = false; coreLogic.bufferedBackupCandidates.clear(); diagnosticsTool.lastProcessedM3u8 = null; diagnosticsTool.resetPlaybackHealth(); diagnosticsTool.resetSlicingReport(); diagnosticsTool.takeoverEvidence = { sources: [], url: null };
                } catch (e) { this.log(`清理核心状态时发生错误:${e.message}`, CONSTANTS.LOG_TYPES.ERROR); }
                finally {
                    this.isPlayerActiveOrInitializing = false; this.currentVideoType = null; this.currentVideoUrl = null; this.currentVideoFormat = null; this.currentPlaybackEngine = null; this.lastM3u8Content = ''; this.currentRequestUrl = null;
                    this.log("播放器状态锁已释放", CONSTANTS.LOG_TYPES.PLAYER_LOCK);
                    if (coreLogic.hiddenIframeElement) {
                        this.log(`检测到被隐藏的Iframe，开始恢复并重新加载...`, CONSTANTS.LOG_TYPES.LIFECYCLE);
                        if (coreLogic.originalIframeSrc) coreLogic.hiddenIframeElement.src = coreLogic.originalIframeSrc;
                        coreLogic.hiddenIframeElement.style.visibility = coreLogic.originalIframeVisibilityStyle;
                        coreLogic.hiddenIframeElement.style.pointerEvents = coreLogic.originalIframePointerEventsStyle;
                        coreLogic.hiddenIframeElement = null;
                        coreLogic.originalIframeVisibilityStyle = ''; coreLogic.originalIframePointerEventsStyle = ''; coreLogic.originalIframeSrc = '';
                    }
                }
            }
            this.isInternalRequest = false;
        }
        handlePointerDown(e) {
            if (!e.isPrimary || this.activeInteraction) return;
            const target = e.target;
            if (target.closest(`.${CONSTANTS.CLASSES.DRAG_HANDLE}`)) this.activeInteraction = 'drag';
            else if (target.closest('.dmz-progress-bar')) this.activeInteraction = 'seek';
            else if (!target.closest('.dmz-controls-bar, .dmz-close-button')) this.activeInteraction = 'gesture';
            else return;
            e.stopPropagation(); e.preventDefault();
            switch (this.activeInteraction) {
                case 'drag': this.draggableInstance.handleDragStart(e); break;
                case 'seek': this.customControlsHandler.isSeeking = true; this.customControlsHandler.updateSeekUI(e.clientX); break;
                case 'gesture': this.fullscreenGestureHandler.onPointerDown(e); break;
            }
            document.addEventListener('pointermove', this.boundHandlePointerMove, { capture: true });
            document.addEventListener('pointerup', this.boundHandlePointerUp, { capture: true });
            document.addEventListener('pointercancel', this.boundHandlePointerUp, { capture: true });
        }
        handlePointerMove(e) {
            if (!e.isPrimary || !this.activeInteraction) return;
            e.stopPropagation(); e.preventDefault();
            switch (this.activeInteraction) {
                case 'drag': this.draggableInstance.handleDragMove(e); break;
                case 'seek': this.customControlsHandler.updateSeekUI(e.clientX); break;
                case 'gesture': this.fullscreenGestureHandler.onPointerMove(e); break;
            }
        }
        handlePointerUp(e) {
            if (!e.isPrimary || !this.activeInteraction) return;
            e.stopPropagation(); e.preventDefault();
            document.removeEventListener('pointermove', this.boundHandlePointerMove, { capture: true });
            document.removeEventListener('pointerup', this.boundHandlePointerUp, { capture: true });
            document.removeEventListener('pointercancel', this.boundHandlePointerUp, { capture: true });
            switch (this.activeInteraction) {
                case 'drag': this.draggableInstance.handleDragEnd(e); break;
                case 'seek': { const newTime = this.customControlsHandler.updateSeekUI(e.clientX); if (this.videoElement && !isNaN(newTime)) this.videoElement.currentTime = newTime; this.customControlsHandler.isSeeking = false; this.customControlsHandler.resetHideTimeout(); break; }
                case 'gesture': this.fullscreenGestureHandler.onPointerUp(e); break;
            }
            this.activeInteraction = null;
        }
    }
    class M3U8Processor extends BaseModule {
        constructor(context) { super(context, 'M3u8'); }
        async fetchText(url, isValidSession, requestId) {
            const { diagnosticsTool } = this.context;
            this.log(`[m3u8处理器]|[ID:${requestId}]获取M3U8清单文本:${url}`, CONSTANTS.LOG_TYPES.CORE);
            const attemptFetch = async (retriesLeft) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                try {
                    const response = await fetch(url, { method: 'GET', headers: {}, signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (!isValidSession()) throw new Error('Request outdated');
                    if (response.ok) return await response.text();
                    throw new Error(`Status ${response.status}`);
                } catch (err) {
                    clearTimeout(timeoutId);
                    if (!isValidSession()) throw new Error('Request outdated');
                    if (retriesLeft > 0 && err.message !== 'Request outdated') {
                        this.log(`[m3u8处理器] 获取失败(${err.message})，重试中(剩余${retriesLeft}次)...`, CONSTANTS.LOG_TYPES.WARN);
                        await new Promise(r => setTimeout(r, 1000));
                        return attemptFetch(retriesLeft - 1);
                    }
                    throw err;
                }
            };
            try { return await attemptFetch(1); }
            catch (err) {
                if (err.message !== 'Request outdated' && diagnosticsTool.playbackHealth.manifest.status === 'pending') diagnosticsTool.playbackHealth.manifest = { status: 'error', code: err.message };
                throw new Error(`获取M3U8失败: ${err.message}`);
            }
        }
        rebuildFromGroups(originalLines, finalGroups, options = {}) {
            const { filterHeaderDiscontinuity = false } = options;
            const headerIndex = originalLines.findIndex(l => l.startsWith('#EXTINF'));
            let headerLines = headerIndex > -1 ? originalLines.slice(0, headerIndex) : [];
            if (filterHeaderDiscontinuity) headerLines = headerLines.filter(l => !l.trim().startsWith('#EXT-X-DISCONTINUITY'));
            let finalLines = [...headerLines];
            finalGroups.forEach((group, index) => { finalLines.push(...group); if (index < finalGroups.length - 1) finalLines.push('#EXT-X-DISCONTINUITY'); });
            const endlistPresent = originalLines.some(l => l.includes('#EXT-X-ENDLIST'));
            if (endlistPresent && !finalLines.some(l => l.includes('#EXT-X-ENDLIST'))) finalLines.push('#EXT-X-ENDLIST');
            return finalLines.filter(Boolean);
        }
        sliceAdSegmentsByKeywords(lines, keywords) {
            const { diagnosticsTool } = this.context;
            this.log(`[m3u8处理器]|执行「URL特征」净化，关键词:[${keywords.join(', ')}]`, CONSTANTS.LOG_TYPES.CORE_SLICE);
            const adMatcher = new RegExp(keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'));
            const segmentGroups = []; let currentGroup = [];
            lines.forEach(line => { if (line.trim().startsWith('#EXT-X-DISCONTINUITY')) { if (currentGroup.length > 0) segmentGroups.push(currentGroup); currentGroup = []; } else currentGroup.push(line); });
            if (currentGroup.length > 0) segmentGroups.push(currentGroup);
            if (segmentGroups.length === 0) return lines;
            let removedGroups = 0; let removedSegments = 0;
            const finalGroups = [];
            let originalTimelineDuration = 0;
            segmentGroups.forEach(group => {
                const isAd = group.some(line => adMatcher.test(line));
                const groupDuration = group.filter(l => l.startsWith('#EXTINF:')).reduce((sum, line) => { const duration = parseFloat(line.split(':')[1]); return sum + (isNaN(duration) ? 0 : duration); }, 0);
                if (isAd) {
                    removedGroups++; removedSegments += group.filter(l => l.trim().endsWith('.ts') || l.trim().includes('.jpeg')).length; diagnosticsTool.slicingReport.slicedDuration += groupDuration;
                    if (groupDuration > 0) diagnosticsTool.slicingReport.slicedTimeRanges.push({ start: originalTimelineDuration, end: originalTimelineDuration + groupDuration });
                } else finalGroups.push(group);
                originalTimelineDuration += groupDuration;
            });
            if (removedGroups === 0) return lines;
            diagnosticsTool.slicingReport.slicedGroups += removedGroups; diagnosticsTool.slicingReport.slicedSegments += removedSegments;
            this.log(`[m3u8处理器]|「URL特征」净化完成，移除${removedGroups}组共${removedSegments} 个广告分片。`, CONSTANTS.LOG_TYPES.CORE_SLICE);
            const finalLines = this.rebuildFromGroups(lines, finalGroups, { filterHeaderDiscontinuity: true });
            if (this.hasMediaSegments(finalLines)) return finalLines;
            else { this.log(`[m3u8处理器]|[安全锁]“特征锁定”净化后无任何可播放内容！已还原为原始列表。`, CONSTANTS.LOG_TYPES.CORE_SLICE); diagnosticsTool.slicingReport.slicedGroups -= removedGroups; diagnosticsTool.slicingReport.slicedSegments -= removedSegments; return lines; }
        }
        runFalconV3Engine(lines, baseUrl) {
            const { diagnosticsTool } = this.context;
            this.log("[m3u8处理器]|「行为清扫」：启动，扫描典型短广告分组...", CONSTANTS.LOG_TYPES.CORE_SLICE);
            const { headerLines, segmentGroups } = this._groupSegments(lines);
            if (segmentGroups.length < 2) {
                this.log(`[m3u8处理器]|「行为清扫」视频分组不足(少于2个)，不执行行为净化。`, CONSTANTS.LOG_TYPES.CORE_SLICE);
                return { wasSliced: false, content: lines };
            }
            const classifiedGroups = this._analyzeGroupFeatures(segmentGroups, baseUrl);
            return this._filterAdGroups(classifiedGroups, headerLines, lines);
        }
        _groupSegments(lines) {
            const headerTags = ['#EXTM3U', '#EXT-X-VERSION', '#EXT-X-TARGETDURATION', '#EXT-X-PLAYLIST-TYPE', '#EXT-X-MEDIA-SEQUENCE', '#EXT-X-ALLOW-CACHE', '#EXT-X-KEY'];
            const uniqueHeaders = new Set();
            const headerLines = [];
            const segmentGroups = [];
            let currentGroup = [];
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (headerTags.some(tag => trimmed.startsWith(tag))) {
                    const key = trimmed.split(':')[0];
                    if (!uniqueHeaders.has(key)) { uniqueHeaders.add(key); headerLines.push(line); }
                    continue;
                }
                if (trimmed.startsWith('#EXT-X-DISCONTINUITY')) { if (currentGroup.length > 0) segmentGroups.push(currentGroup); currentGroup = []; }
                else currentGroup.push(line);
            }
            if (currentGroup.length > 0) segmentGroups.push(currentGroup);
            return { headerLines, segmentGroups };
        }
        _analyzeGroupFeatures(segmentGroups, baseUrl) {
            const getGroupFirstUrl = (group) => { const line = group.find(l => !l.startsWith('#') && l.trim().length > 0); return line ? line.trim() : null; };
            const groupDurations = segmentGroups.map(g => g.filter(l => l.startsWith('#EXTINF:')).reduce((sum, l) => sum + (parseFloat(l.split(':')[1]) || 0), 0));
            const maxGroupDuration = Math.max(...groupDurations);
            const hostCounts = new Map();
            segmentGroups.forEach(g => {
                const u = getGroupFirstUrl(g);
                if (u) { try { const key = new URL(u, baseUrl).origin; hostCounts.set(key, (hostCounts.get(key) || 0) + g.length); } catch (e) { } }
            });
            let primaryHost = ''; let maxCount = 0;
            hostCounts.forEach((count, host) => { if (count > maxCount) { maxCount = count; primaryHost = host; } });
            this.log(`[m3u8处理器]|「行为清扫」识别主内容特征:${primaryHost || '无'} (基准时长:${maxGroupDuration.toFixed(1)}s)`, CONSTANTS.LOG_TYPES.CORE_SLICE);
            const extractSeqNum = (str) => {
                try { const m = str.split('?')[0].split('/').pop().match(/(\d+)\.(ts|mp4|mkv|jpeg|jpg|png)$/i); if (m) return parseInt(m[1], 10); } catch (e) { } return null;
            };
            const classified = segmentGroups.map((groupLines, index) => {
                const duration = groupDurations[index];
                const segmentCount = groupLines.filter(l => l.trim().endsWith('.ts') || l.trim().includes('.jpeg')).length;
                const firstUrl = getGroupFirstUrl(groupLines);
                let isSafeZone = false;
                if (firstUrl && primaryHost) { try { if (new URL(firstUrl, baseUrl).href.includes(primaryHost)) isSafeZone = true; } catch (e) { } }
                let isAdCandidate = false;
                let reason = "";
                if (isSafeZone) {
                    if (maxGroupDuration > 300 && duration < 120 && duration < (maxGroupDuration * 0.2)) { isAdCandidate = true; isSafeZone = false; reason = `同源但在时长占比极低 (${duration.toFixed(1)}s < ${Math.round(maxGroupDuration * 0.2)}s)`; }
                    else isAdCandidate = duration < 0.3;
                } else {
                    isAdCandidate = segmentCount > 0 && segmentCount <= 15 && duration <= 30;
                    if (isAdCandidate) reason = "异源/短时长模型";
                }
                return { lines: groupLines, isAdCandidate, segmentCount, totalDuration: duration, index, firstUrl, isSafeZone, reason, seq: firstUrl ? extractSeqNum(firstUrl) : null };
            });
            for (let i = 0; i < classified.length; i++) {
                const cur = classified[i];
                if (cur.seq === null) continue;
                if (cur.isSafeZone) {
                    let prevSeq = null, nextSeq = null;
                    if (i > 0) prevSeq = classified[i - 1].seq;
                    if (i < classified.length - 1) nextSeq = classified[i + 1].seq;
                    const isSeqJump = (prevSeq !== null && Math.abs(cur.seq - prevSeq) > 100) || (nextSeq !== null && Math.abs(nextSeq - cur.seq) > 100);
                    if (isSeqJump && cur.totalDuration < 180) { cur.isAdCandidate = true; cur.isSafeZone = false; cur.reason = `序列号断层 (Curr:${cur.seq} vs Prev:${prevSeq}/Next:${nextSeq})`; this.log(`[m3u8处理器]|🛡️|[序列断层检测]分组[${i}]虽同源，但序列号异常，判定为内嵌广告。`, CONSTANTS.LOG_TYPES.CORE_SLICE); }
                }
                if (!cur.isAdCandidate || cur.isSafeZone) continue;
                if (i > 0 && !classified[i - 1].isAdCandidate && classified[i - 1].seq !== null && cur.seq === classified[i - 1].seq + 1) { cur.isAdCandidate = false; continue; }
                if (i < classified.length - 1 && !classified[i + 1].isAdCandidate && classified[i + 1].seq !== null && classified[i + 1].seq === cur.seq + 1) { cur.isAdCandidate = false; continue; }
            }
            return classified;
        }
        _filterAdGroups(classifiedGroups, headerLines, originalLines) {
            const { diagnosticsTool } = this.context;
            const adCandidateCount = classifiedGroups.filter(g => g.isAdCandidate).length;
            const adRatio = adCandidateCount / classifiedGroups.length;
            if (adRatio > 0.8) { this.log(`[m3u8处理器]|「行为清扫-结构分析⚠️检测到${Math.round(adRatio * 100)}% 的分组为短分组，疑似正片被切割。为防止误杀，已跳过本次「行为清扫」。`, CONSTANTS.LOG_TYPES.CORE_SLICE); return { wasSliced: false, content: originalLines }; }
            const contentCandidateCount = classifiedGroups.filter(g => !g.isAdCandidate).length;
            if (contentCandidateCount === 0) { this.log(`[m3u8处理器]|「行为清扫-安全锁」未识别到明确的“主体内容”分组，判定为短视频。为防止误杀，已中止净化。`, CONSTANTS.LOG_TYPES.CORE_SLICE); return { wasSliced: false, content: originalLines }; }
            let removedGroups = 0; let removedSegments = 0; let originalTimelineDuration = 0; let hasAddedGroup = false;
            const finalLines = [...headerLines];
            classifiedGroups.forEach(group => {
                if (group.isAdCandidate) {
                    removedGroups++; removedSegments += group.segmentCount; diagnosticsTool.slicingReport.slicedDuration += group.totalDuration;
                    const feature = `<高置信度短分组> (分片:${group.segmentCount}, 时长:${group.totalDuration.toFixed(1)}s, 原因:${group.reason || '时长/特征'})`;
                    diagnosticsTool.slicingReport.foundFeatures.get('BEHAVIOR_MODEL').add(feature);
                    this.log(`[m3u8处理器]|「行为清扫」战果：移除广告组(${group.segmentCount}个分片, ${group.totalDuration.toFixed(1)}s) [${group.reason || '常规模型'}]。`, CONSTANTS.LOG_TYPES.CORE_SLICE);
                    if (group.totalDuration > 0) diagnosticsTool.slicingReport.slicedTimeRanges.push({ start: originalTimelineDuration, end: originalTimelineDuration + group.totalDuration });
                } else { if (hasAddedGroup) finalLines.push('#EXT-X-DISCONTINUITY'); finalLines.push(...group.lines); hasAddedGroup = true; }
                originalTimelineDuration += group.totalDuration;
            });
            if (originalLines.some(l => l.includes('#EXT-X-ENDLIST')) && !finalLines.some(l => l.includes('#EXT-X-ENDLIST'))) finalLines.push('#EXT-X-ENDLIST');
            if (removedGroups === 0) { this.log(`[m3u8处理器]|「行为清扫」未发现符合条件的广告。`, CONSTANTS.LOG_TYPES.CORE_SLICE); return { wasSliced: false, content: originalLines }; }
            diagnosticsTool.slicingReport.activatedEngines.add('BEHAVIOR_MODEL');
            diagnosticsTool.slicingReport.slicedGroups += removedGroups; diagnosticsTool.slicingReport.slicedSegments += removedSegments;
            this.log(`[m3u8处理器]|净化报告：通过「行为清扫」移除${removedGroups}组共${removedSegments}个广告分片。`, CONSTANTS.LOG_TYPES.CORE_SLICE);
            if (this.hasMediaSegments(finalLines)) return { wasSliced: true, content: finalLines };
            this.log(`[m3u8处理器]|[安全锁] “行为清扫”净化后无任何可播放内容！已还原为原始列表。`, CONSTANTS.LOG_TYPES.CORE_SLICE);
            diagnosticsTool.slicingReport.slicedGroups -= removedGroups; diagnosticsTool.slicingReport.slicedSegments -= removedSegments;
            return { wasSliced: false, content: originalLines };
        }
        hasMediaSegments(lines) { const mediaPattern = /\.(ts|mp4|mkv|webm|flv|jpeg|jpg)(\?.*)?$/i; return lines.some(line => !line.startsWith('#') && mediaPattern.test(line.trim())); }
        resolveRelativeUrls(lines, baseUrl) {
            if (baseUrl.startsWith('data:')) { this.log(`检测到Data URI，跳过URL解析，保留相对路径。`, CONSTANTS.LOG_TYPES.CORE_URL_RESOLVE); return lines; }
            this.log(`解析M3U8中的相对URL，基础URL:${baseUrl}`, CONSTANTS.LOG_TYPES.CORE_URL_RESOLVE);
            const resolveUrl = (relative, base) => new URL(relative, base).href;
            const isAbsoluteUrl = (url) => /^(https?:)?\/\//.test(url);
            const MEDIA_PATTERN = /\.(ts|mp4|mkv|webm|flv|m3u8?|jpeg|m4s)(\?.*)?$/i;
            const URI_MATCH_PATTERN = /URI="([^"]+)"/;
            return lines.map(line => {
                const t = line.trim();
                if (t.length === 0 || !t.includes('URI=') && (t.startsWith('#EXT') && !t.startsWith('#EXT-X-KEY') && !t.startsWith('#EXT-X-MEDIA'))) return line;
                try {
                    if (!t.startsWith('#')) { if (MEDIA_PATTERN.test(t) && !isAbsoluteUrl(t)) return resolveUrl(t, baseUrl); }
                    else if (t.startsWith('#EXT-X-KEY') || t.startsWith('#EXT-X-MEDIA') || t.startsWith('#EXT-X-MAP')) { const uriMatch = t.match(URI_MATCH_PATTERN); const uri = uriMatch?.[1]; if (uri && !isAbsoluteUrl(uri)) return t.replace(uri, resolveUrl(uri, baseUrl)); }
                } catch (e) { }
                return line;
            });
        }
        async process(initialText, initialUrl, requestId, isValidSession) {
            const { settingsManager, diagnosticsTool, playerManager } = this.context;
            this.log(`[m3u8处理器]|指令分发：将清单送往[广告过滤]模块进行净化。`, CONSTANTS.LOG_TYPES.CORE);
            let currentText = initialText;
            let baseUrl;
            try { baseUrl = new URL(initialUrl).href; } catch (e) { baseUrl = new URL(initialUrl, window.location.href).href; this.log(`[m3u8处理器]|初始URL为相对路径，已拼接为绝对路径:${baseUrl}`, CONSTANTS.LOG_TYPES.CORE_URL_RESOLVE); }
            let currentUrl = baseUrl;
            try {
                for (let i = 0; i < CONSTANTS.LIMITS.MAX_M3U8_REDIRECT_DEPTH; i++) {
                    if (!isValidSession()) throw new Error('Request outdated');
                    const lines = currentText.split('\n');
                    const isMaster = lines.some(l => l.startsWith('#EXT-X-STREAM-INF'));
                    if (isMaster) this.log(`[m3u8处理器]|发现MasterPlaylist，开始解析可用清晰度...`, CONSTANTS.LOG_TYPES.STREAM_SELECT);
                    const hasMedia = lines.some(l => l.startsWith('#EXTINF'));
                    let nextUrlLine = null;
                    if ((isMaster && !hasMedia) || (lines.length < 5 && !hasMedia)) {
                        const qualityUrls = lines.filter(l => l.trim() && !l.startsWith('#') && (l.endsWith('.m3u8') || l.endsWith('.m3u')));
                        if (qualityUrls.length > 0) {
                            const qualityRanks = { "2160p": 6, "1080p": 5, "720p": 4, "480p": 3, "360p": 2, "240p": 1 };
                            let bestQuality = -1; let bestUrl = qualityUrls[qualityUrls.length - 1];
                            qualityUrls.forEach(url => { for (const q in qualityRanks) { if (url.toLowerCase().includes(q) && qualityRanks[q] > bestQuality) { bestQuality = qualityRanks[q]; bestUrl = url; } } });
                            this.log(`[m3u8处理器]|解析完成,共${qualityUrls.length}个流。自动选择最高清晰度:${Object.keys(qualityRanks).find(k => qualityRanks[k] === bestQuality) || '未知'}`, CONSTANTS.LOG_TYPES.STREAM_SELECT);
                            nextUrlLine = bestUrl;
                        }
                    }
                    if (nextUrlLine) { currentUrl = new URL(nextUrlLine, currentUrl).href; currentText = await this.fetchText(currentUrl, isValidSession, requestId); continue; } break;
                }
                if (!isValidSession()) throw new Error('Request outdated');
                playerManager.lastM3u8Content = currentText;
                let processedLines = currentText.split('\n');
                if (settingsManager.config.isSmartSlicingEnabled) {
                    const hasDiscontinuity = currentText.includes('#EXT-X-DISCONTINUITY');
                    if (hasDiscontinuity) {
                        const urlKeywords = diagnosticsTool.analyzeUrlPatterns(currentText, currentUrl);
                        if (urlKeywords?.length > 0) { this.log(`[m3u8处理器]|决策：「URL特征」发现<高置信度>关键词，执行精准净化。`, CONSTANTS.LOG_TYPES.CORE_SLICE); processedLines = this.sliceAdSegmentsByKeywords(processedLines, urlKeywords); }
                        else this.log(`[m3u8处理器]|决策：「URL特征」未发现，转交「行为清扫」。`, CONSTANTS.LOG_TYPES.CORE_SLICE);
                    } else this.log(`[m3u8处理器]|决策：M3U8结构简单(无分组)，跳过路径分析以防误判，直接进入行为分析。`, CONSTANTS.LOG_TYPES.CORE_SLICE);
                    let falconResult = this.runFalconV3Engine(processedLines, currentUrl);
                    if (falconResult.wasSliced) processedLines = falconResult.content;
                } else this.log("[m3u8处理器]|智能净化已禁用，跳过处理", CONSTANTS.LOG_TYPES.CORE_SLICE);
                const finalLines = this.resolveRelativeUrls(processedLines, currentUrl);
                let result = finalLines.join('\n');
                if (!result.trim().startsWith('#EXTM3U')) result = '#EXTM3U\n' + result;
                this.log(`[m3u8处理器]|[ID:${requestId}] M3U8处理完成: 最终URL为${currentUrl}`, CONSTANTS.LOG_TYPES.CORE);
                return { original: currentText, processed: result, finalUrl: currentUrl };
            } catch (e) {
                if (e.message.includes('Request outdated')) {
                    this.log(`[m3u8处理器]|[ID:${requestId}] 任务已由新请求接管，停止处理旧请求。`, CONSTANTS.LOG_TYPES.INFO);
                } else {
                    this.log(`[m3u8处理器]|[ID:${requestId}]处理M3U8时出错:${initialUrl}, 错误:${e.message}`, CONSTANTS.LOG_TYPES.ERROR);
                }
                throw e;
            }
        }
    }
    class SandboxManager extends BaseModule {
        constructor(context) {
            super(context, 'SandboxManager');
            this.iframeSandbox = null; this.sandboxReloadTimer = null; this.sandboxCountdownTimer = null; this.hasTriggeredSandbox = false;
        }
        reload(consumeQuota = true) {
            if (new URLSearchParams(window.location.search).has('dmz_sandbox')) return;
            if (this.hasTriggeredSandbox) { this.log(`[沙箱]|📦|已执行过重载但仍未成功，停止尝试。`, CONSTANTS.LOG_TYPES.WARN); return; }
            if (consumeQuota) this.hasTriggeredSandbox = true;
            let targetUrl = window.location.href;
            let logMsg = "正在后台执行静默重载(全页模式)...";
            try {
                const potentialIframes = Array.from(document.querySelectorAll('iframe')).filter(f => {
                    const r = f.getBoundingClientRect();
                    const src = (f.src || '').toLowerCase();
                    if (r.width < 50 || r.height < 50) return false;
                    if (/(captcha|recaptcha|google|facebook|twitter|ads?|analytics|comments|chat|widget)/.test(src)) return false;
                    let score = 0;
                    if (f.hasAttribute('allowfullscreen') || f.getAttribute('allowfullscreen') === 'true') score += 50;
                    if (/(play|video|vod|embed|stream|m3u8|movie|film)/.test(src)) score += 30;
                    if (r.width > r.height * 1.2) score += 10;
                    const attrStr = (f.id + ' ' + f.className).toLowerCase();
                    if (/(player|video|wrapper|container|media)/.test(attrStr)) score += 10;
                    f.dmzScore = score;
                    f.dmzArea = r.width * r.height;
                    return score > 0 || f.dmzArea > 80000;
                });
                if (potentialIframes.length > 0) {
                    const bestIframe = potentialIframes.sort((a, b) => (b.dmzScore - a.dmzScore) || (b.dmzArea - a.dmzArea))[0];
                    if (bestIframe) {
                        this.log(`[加速] 🎯锁定目标iFrame (Score:${bestIframe.dmzScore}, Src:${bestIframe.src.slice(-30)})，启动连发指令...`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                        let pokeCount = 0;
                        const poker = setInterval(() => {
                            if (pokeCount++ > 15 || this.context.playerManager.isPlayerActiveOrInitializing) {
                                clearInterval(poker);
                                return;
                            }
                            try { bestIframe.contentWindow.postMessage({ type: CONSTANTS.MESSAGE_TYPES.ACTIVATE_AUTOPLAY }, '*'); } catch(e){}
                        }, 400);
                        targetUrl = bestIframe.src;
                        logMsg = `正在后台执行静默重载(精准模式)，目标:${targetUrl.slice(-80)}`;
                    }
                }
            } catch (e) { }
            this.log(`[沙箱]|📦|${logMsg}`, CONSTANTS.LOG_TYPES.CORE_IFRAME);
            this.iframeSandbox = DomUtils.create('iframe', { id: 'dmz_sandbox_frame', style: { display: 'block', width: '1px', height: '1px', border: 'none', position: 'absolute', top: '-10px', left: '-10px', opacity: '0.01', visibility: 'visible', zIndex: '-1', pointerEvents: 'none' } });
            try {
                const newUrl = new URL(targetUrl, window.location.href);
                newUrl.searchParams.set('dmz_sandbox', 'true');
                this.iframeSandbox.src = newUrl.href;
                document.body.appendChild(this.iframeSandbox);
            } catch(e) {
                this.log(`[沙箱] URL构造失败: ${e.message}`, CONSTANTS.LOG_TYPES.ERROR);
            }
            this.sandboxReloadTimer = setTimeout(() => { if (this.iframeSandbox) { this.log(`[沙箱]|📦|探测超时(15s)，未发现新信号。触发故障恢复...`, CONSTANTS.LOG_TYPES.WARN); this.cleanup(); if (!this.context.playerManager.isPlayerActiveOrInitializing) this.context.coreLogic.reportPlaybackFailure({ reason: 'Sandbox Timeout' }); } }, 15000);
        }
        startCountdown() {
            const { playerManager, coreLogic } = this.context;
            if (new URLSearchParams(window.location.search).has('dmz_sandbox') || playerManager.isPlayerActiveOrInitializing || coreLogic.isSystemHalted) return;
            this.log("[沙箱]视频页启动|⏳2秒倒计时...", CONSTANTS.LOG_TYPES.CORE);
            this.sandboxCountdownTimer = setTimeout(() => {
                if (playerManager.isPlayerActiveOrInitializing || coreLogic.decisionInProgress) return;
                if (document.readyState !== 'complete') {
                    this.log("[沙箱]|📦|检测到页面仍在加载中(网速较慢)，延长等待时间...", CONSTANTS.LOG_TYPES.CORE);
                    this.sandboxCountdownTimer = setTimeout(() => { if (playerManager.isPlayerActiveOrInitializing || coreLogic.decisionInProgress) return; this.log("[沙箱]|📦|宽限期结束仍无信号，触发重载(不消耗次数)。", CONSTANTS.LOG_TYPES.CORE_EXEC); this.reload(false); }, 3000);
                    return;
                }
                this.log("[沙箱]|📦|2秒内无有效信号且页面加载完毕，触发重载(不消耗次数)。", CONSTANTS.LOG_TYPES.CORE_EXEC);
                this.reload(false);
            }, 2000);
        }
        cancelCountdown(reason) { if (this.sandboxCountdownTimer) { clearTimeout(this.sandboxCountdownTimer); this.sandboxCountdownTimer = null; this.log(`[沙箱]|📦|倒计时已取消「${reason}」。`, CONSTANTS.LOG_TYPES.CORE); } }
        cleanup() { if (this.sandboxReloadTimer) { clearTimeout(this.sandboxReloadTimer); this.sandboxReloadTimer = null; } if (this.iframeSandbox) { this.iframeSandbox.remove(); this.iframeSandbox = null; this.log(`iFrame沙箱已清理。`, CONSTANTS.LOG_TYPES.CORE_IFRAME); } }
        reset() { this.hasTriggeredSandbox = false; this.cleanup(); }
    }
    class OverlayManager extends BaseModule {
        constructor(context) { super(context, 'OverlayManager'); }
        _getSmartAnchor(target) {
            let node = target.parentElement;
            while (node && node !== document.body) {
                const s = window.getComputedStyle(node);
                const isClipped = (s.overflow === 'hidden' || s.overflowX === 'hidden' || s.overflowY === 'hidden');
                const isSmall = (node.offsetHeight < target.offsetHeight || node.offsetWidth < target.offsetWidth);
                if (isClipped && isSmall) { node = node.parentElement; continue; }
                if (s.position !== 'static' || s.transform !== 'none' || s.contain === 'paint') return node;
                node = node.parentElement;
            }
            return document.body;
        }
        _getSafeZIndex(anchor) {
            let max = 10;
            try { Array.from(anchor.children).forEach(el => { const z = parseInt(window.getComputedStyle(el).zIndex); if (!isNaN(z) && z > max && z < 2147483640) max = z; }); } catch (e) { }
            return max + 1;
        }
        createTriggerOverlay(target, onActivate, onDismiss, isPassive = false) {

            const overlay = DomUtils.create('div', { className: isPassive ? 'dmz-switch-overlay' : 'dmz-iframe-remote-trigger', style: { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: isPassive ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 'auto', opacity: isPassive ? '1' : '0.8', pointerEvents: 'auto', transition: 'opacity 0.2s linear', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' } });
            overlay.innerHTML = `<div style="all:initial;width:64px;height:64px;background:rgba(28,28,30,.5);border-radius:50%;position:relative;box-shadow:0 2px 10px rgba(0,0,0,0.5);backdrop-filter:blur(5px);"><svg width="32" height="32" viewBox="0 0 24" fill="white" style="all:initial;display:block;width:32px;height:32px;fill:white;position:absolute;top:50%;left:50%;transform:translate(calc(-50% + 3.5px),calc(-50% + 3px));"><path d="M8 5v14l11-7z"></path></svg></div>`;
            const closeBtn = DomUtils.create('div', { style: { position: 'absolute', top: '0', left: '0', width: '30px', height: '30px', background: 'rgba(0,0,0,0.6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: '100', borderBottomRightRadius: '8px', fontSize: '20px', fontWeight: 'bold' }, textContent: '×', title: '关闭触发器' });
            closeBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); onDismiss(overlay); });
            overlay.appendChild(closeBtn);
            let longPressTimer;
            const startLongPress = (e) => { if ((e.type === 'mousedown' && e.button !== 0) || (e.type === 'touchstart' && e.touches.length > 1)) return; const playerHost = this.context.playerManager.hostElement; if (playerHost && playerHost.classList.contains('dmz-visible')) return; longPressTimer = setTimeout(() => { this.context.coreLogic.restorePageToOriginalState(); if (navigator.vibrate) navigator.vibrate(50); }, 1000); };
            const cancelLongPress = () => clearTimeout(longPressTimer);
            overlay.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation(); });
            overlay.addEventListener('mousedown', startLongPress);
            overlay.addEventListener('touchstart', startLongPress, { passive: true });
            ['mouseup', 'touchend', 'touchcancel', 'mouseleave'].forEach(evt => overlay.addEventListener(evt, cancelLongPress));
            overlay.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); clearTimeout(longPressTimer); onActivate(e, overlay); });

            const anchor = this._getSmartAnchor(target);

            overlay.style.zIndex = this._getSafeZIndex(anchor);
            anchor.appendChild(overlay);

            const updatePos = () => {
                if (!target.isConnected) { overlay.remove(); return; }
                if (!overlay.isConnected) return;

                let isCross = false;
                try { isCross = window.self.location.origin !== window.top.location.origin; } catch (e) { isCross = true; }
                if (!CONSTANTS.IS_TOP_FRAME && isCross) {
                    overlay.style.display = 'none';
                    requestAnimationFrame(updatePos);
                    return;
                }

                const tRect = target.getBoundingClientRect();
                if (tRect.width === 0 || tRect.height === 0 || tRect.bottom < 0 || tRect.top > window.innerHeight) { overlay.style.display = 'none'; }
                else {
                    if (!isPassive) overlay.style.display = 'flex';

                    if (anchor === document.body) { const scrollX = window.scrollX || window.pageXOffset, scrollY = window.scrollY || window.pageYOffset; overlay.style.top = `${tRect.top + scrollY}px`; overlay.style.left = `${tRect.left + scrollX}px`; }
                    else { const aRect = anchor.getBoundingClientRect(); overlay.style.top = `${tRect.top - aRect.top + anchor.scrollTop}px`; overlay.style.left = `${tRect.left - aRect.left + anchor.scrollLeft}px`; }
                    overlay.style.width = `${tRect.width}px`; overlay.style.height = `${tRect.height}px`;

                    if (!isPassive && !overlay.dataset.userHidden) overlay.style.opacity = '1';
                }
                requestAnimationFrame(updatePos);
            };
            requestAnimationFrame(updatePos);
            return overlay;
        }
        attachIframeTrigger(iframeElement, sourceWindow) {
            const { domScanner, coreLogic } = this.context;
            if (coreLogic.isSystemHalted || coreLogic.isRestoreInProgress) return;
            if (iframeElement.dataset.dmzHasTrigger === 'true' || iframeElement.dataset.dmzTriggerDismissed === 'true') return;
            iframeElement.dataset.dmzHasTrigger = 'true';
            this.log(`[跨域交互]|☎️|为Iframe添加智能层级触发器...`, CONSTANTS.LOG_TYPES.UI);
            const onDismiss = (overlay) => { iframeElement.dataset.dmzTriggerDismissed = 'true'; overlay.remove(); };
            const onActivate = (e, overlay) => {
                if (coreLogic.isRestoreInProgress) return;
                this.log(`[跨域交互]|☎️|外部触发器被点击...`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH);
                overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; overlay.dataset.userHidden = 'true';
                coreLogic.isSystemHalted = false; coreLogic.setUserIntentToSwitch(); domScanner.isStopped = false; domScanner.init();
                if (coreLogic.lastSuccessfulUrl && coreLogic.lastSuccessfulUrl.startsWith('http')) {
                    this.log(`[记忆回溯]|🌀|顶层直接复用历史地址进行重播:${coreLogic.lastSuccessfulUrl.slice(-50)}`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                    coreLogic.addTakeoverCandidate({ url: coreLogic.lastSuccessfulUrl, sourceName: '跨域遥控触发(顶层记忆)' });
                    try { sourceWindow.postMessage({ type: CONSTANTS.MESSAGE_TYPES.IFRAME_TRIGGER_CLICK }, '*'); } catch (err) { }
                    return;
                }
                this.log(`[跨域交互]|☎️|无历史记忆，向Iframe发送搜寻指令...`, CONSTANTS.LOG_TYPES.COMM);
                try { sourceWindow.postMessage({ type: CONSTANTS.MESSAGE_TYPES.IFRAME_TRIGGER_CLICK }, '*'); } catch (err) { this.log(`[跨域交互]|☎️|指令发送失败:${err.message}`, CONSTANTS.LOG_TYPES.ERROR); }
            };
            const overlay = this.createTriggerOverlay(iframeElement, onActivate, onDismiss, false);
            overlay.dmzUpdatePos = () => { delete overlay.dataset.userHidden; overlay.style.opacity = '1'; overlay.style.pointerEvents = 'auto'; };
            overlay.cleanup = () => { overlay.remove(); };
        }
    }
    class CoreLogic extends BaseModule {
        constructor(context) {
            super(context, 'CoreLogic');
            this.failedCandidateKeys = new Set(); this.lastSuccessfulUrl = null;
            this.decisionMade = false; this.decisionInProgress = false; this.takeoverCandidates = new Map();
            this.lastCandidatesBackup = new Map(); this.lastPostedUrl = null; this.currentRequestId = 0;
            this.activeNeutralizers = new Set(); this.currentPlayingQuality = null;
            this.backupBufferTimer = null; this.isBufferingBackupCandidates = false;
            this.bufferedBackupCandidates = new Map(); this.hiddenIframeElement = null; this.originalIframeSrc = '';
            this.neutralizedMedia = new Set(); this.enforcerInterval = null; this.passiveCandidates = new Map();
            this.userIntendsToSwitch = false; this.userActionTimeout = null;
            this.m3u8Processor = new M3U8Processor(context);
            this.sandboxManager = new SandboxManager(context);
            this.overlayManager = new OverlayManager(context);
            this.m3u8SessionCache = new Map();
        }
        startPersistentEnforcer() {
            if (this.enforcerInterval) return;
            this.log("启动【持久化压制器】，确保原生播放器静默。", CONSTANTS.LOG_TYPES.CORE_NEUTRALIZE);
            this.enforcerInterval = setInterval(() => {
                if (this.neutralizedMedia.size === 0) { this.stopPersistentEnforcer(); return; }
                this.neutralizedMedia.forEach(media => { if (!document.body.contains(media)) this.neutralizedMedia.delete(media); else if (media.paused === false || media.muted === false) { media.pause(); media.muted = true; } });
            }, 200);
        }
        stopPersistentEnforcer() { if (!this.enforcerInterval) return; this.log("停止【持久化压制器】。", CONSTANTS.LOG_TYPES.CORE_NEUTRALIZE); clearInterval(this.enforcerInterval); this.enforcerInterval = null; this.neutralizedMedia.clear(); }
        handleRemoteTriggerClick() {
            const { domScanner } = this.context;
            this.log(`[跨域交互]|☎️|收到来自顶层的激活指令，开始执行内部唤醒程序...`, CONSTANTS.LOG_TYPES.CORE_EXEC);
            this.isSystemHalted = false; this.setUserIntentToSwitch(); domScanner.isStopped = false;
            if (this.lastSuccessfulUrl && this.lastSuccessfulUrl.startsWith('http')) {
                this.log(`[记忆回溯]|🌀|远程触发：优先复用历史播放记录:${this.lastSuccessfulUrl.slice(-50)}。`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                this.addTakeoverCandidate({ url: this.lastSuccessfulUrl, sourceName: '跨域遥控触发(顶层记忆)' });
                return;
            }
            document.querySelectorAll('.dmz-switch-overlay').forEach((el) => { el.style.display = 'none'; });
            PageScanner.scanForFlashvars(this.context); PageScanner.scanForEmbeddedData(this.context);
            this.neutralizedMedia.forEach(media => {
                delete media.dataset.dmzSourceLocked;
                let targetUrl = media.src || media.querySelector('source')?.src || media.dataset.dmzOriginalSrc;
                if ((!targetUrl || targetUrl.startsWith('blob:')) && this.lastSuccessfulUrl) targetUrl = this.lastSuccessfulUrl;
                if (targetUrl && targetUrl.startsWith('http')) this.addTakeoverCandidate({ url: targetUrl, sourceName: '跨域遥控触发' });
                else { media.dataset.dmzAllowSignalGeneration = 'true'; try { media.currentTime = 0; media.play(); } catch (e) { } setTimeout(() => { delete media.dataset.dmzAllowSignalGeneration; media.pause(); }, 1500); }
            });
            domScanner.scanPage();
        }
        restorePageToOriginalState() {
            if (this.isRestoreInProgress) return;
            this.isRestoreInProgress = true;
            this.isSystemHalted = true;
            this.context.playerManager.cleanup();
            this.log(`[系统熔断]|🚨|收到关闭指令(${CONSTANTS.IS_TOP_FRAME ? '顶层' : '子框架'})，执行深度清理...`, CONSTANTS.LOG_TYPES.LIFECYCLE);
            this._restoreFrames();
            this.context.domScanner.stop();
            if (this.context.domScanner.observer) this.context.domScanner.observer.disconnect();
            if (this.context.domScanner.heartbeatTimer) clearInterval(this.context.domScanner.heartbeatTimer);
            if (this.context.iframeTerminator) try { this.context.iframeTerminator.stop(); } catch (e) { }
            this.stopPersistentEnforcer();
            this._restoreDom();
            this._restoreMedia();
            this.neutralizedMedia.clear();
            this.activeNeutralizers.forEach(obs => obs.disconnect());
            this.activeNeutralizers.clear();
            [NetworkInterceptor, PlayerHooker, DecryptionHooker, JsonInspector, SetAttributeHooker].forEach(mod => { if (mod && mod.isActive) mod.disable(this.context); });
            if (this.hiddenIframeElement) {
                this.hiddenIframeElement.style.visibility = this.originalIframeVisibilityStyle || 'visible';
                this.hiddenIframeElement.style.pointerEvents = this.originalIframePointerEventsStyle || 'auto';
                if (this.hiddenIframeElement.src === 'about:blank' && this.originalIframeSrc) this.hiddenIframeElement.src = this.originalIframeSrc;
                this.hiddenIframeElement = null;
            }
            this.sandboxManager.cleanup();
            if (CONSTANTS.IS_TOP_FRAME) { this.log("✅原生环境已恢复(Top)。", CONSTANTS.LOG_TYPES.LIFECYCLE); this.context.frameCommunicator.showNotification('沉浸模式已退出，所有框架已恢复原生状态。'); }
            this.isRestoreInProgress = false;
        }
        _restoreFrames() {
            try { const frames = window.frames; for (let i = 0; i < frames.length; i++) { try { frames[i].postMessage({ type: CONSTANTS.MESSAGE_TYPES.RESTORE_COMMAND }, '*'); } catch (e) { } } } catch (e) { }
            document.querySelectorAll('iframe').forEach(iframe => {
                try { if (iframe.contentWindow) iframe.contentWindow.postMessage({ type: CONSTANTS.MESSAGE_TYPES.RESTORE_COMMAND }, '*'); } catch (e) { }
                iframe.style.removeProperty('visibility'); iframe.style.removeProperty('opacity'); iframe.style.removeProperty('pointer-events');
                if (iframe.src === 'about:blank' && iframe.dataset.dmzOriginalSrc) { iframe.src = iframe.dataset.dmzOriginalSrc; delete iframe.dataset.dmzOriginalSrc; }
            });
        }
        _restoreDom() {
            const safeRemove = (el) => { if (el) { try { if (el.cleanup) el.cleanup(); else el.remove(); } catch (e) { } } };
            document.querySelectorAll('.dmz-switch-overlay, .dmz-iframe-remote-trigger').forEach(safeRemove);
            document.querySelectorAll('iframe[data-dmz-has-trigger]').forEach(iframe => delete iframe.dataset.dmzHasTrigger);
        }
        _restoreMedia() {
            const allMedia = this.findAllVideosAndAudioInPage();
            new Set([...this.neutralizedMedia, ...allMedia]).forEach(media => {
                try {
                    if (media.dmzOverlay) { media.dmzOverlay.remove(); media.dmzOverlay = null; }
                    if (media.parentElement) { const overlay = media.parentElement.querySelector('.dmz-switch-overlay'); if (overlay) overlay.remove(); }
                    media.dataset.dmzAllowSignalGeneration = 'true';
                    try { if (media.play.toString().indexOf('native') === -1) delete media.play; if (media.pause.toString().indexOf('native') === -1) delete media.pause; } catch (e) { }
                    if (media._dmzPreventPlay) { media.removeEventListener('play', media._dmzPreventPlay, true); media.removeEventListener('playing', media._dmzPreventPlay, true); delete media._dmzPreventPlay; }
                    media.removeAttribute('data-dmz-neutralized');
                    delete media.dataset.dmzOriginalSrc; delete media.dataset.dmzSourceLocked; delete media.dataset.dmzSentinelActive;
                    Object.assign(media.style, { visibility: '', opacity: '', pointerEvents: '' });
                    media.muted = false; media.controls = true;
                    if (media.dataset.dmzOriginalVolume) { media.volume = parseFloat(media.dataset.dmzOriginalVolume); delete media.dataset.dmzOriginalVolume; } else media.volume = 1.0;
                    if (media.paused) media.play().catch(() => {});
                    if (media.parentElement && media.parentElement.style.position === 'relative') media.parentElement.style.position = '';
                } catch (e) { }
            });
        }
        initializeUserIntentObserver() {
            if (!CONSTANTS.IS_TOP_FRAME) return;
            const { playerManager } = this.context;
            document.addEventListener('click', (e) => {
                if (this.isSystemHalted || !e.isTrusted) return;
                let target = e.target;
                if (!target) return;
                const path = e.composedPath();
                if ((playerManager.hostElement && path.includes(playerManager.hostElement)) || target.closest(`#${CONSTANTS.IDS.SETTINGS_PANEL}`)) return;
                const originalTarget = target;
                const interactiveWrapper = target.closest('a, button, [role="button"], li');
                if (interactiveWrapper) target = interactiveWrapper;
                const rect = target.getBoundingClientRect();
                const screenArea = window.innerWidth * window.innerHeight;
                if ((rect.width * rect.height) > (screenArea * 0.25)) return;
                const text = (target.textContent || '').trim();
                const tag = target.tagName.toUpperCase();
                const cls = (target.className || '').toString().toLowerCase();
                if (text.length > 0 && text.length < 12 && /第|集|话|季|EP\d+|E\d+|下一|上一|重播|Play|播放|刷新|路线|线路|源|高清|极速|PV|CM|Prev|Next|^[<>«»◀▶‹›]$/i.test(text)) { this.setUserIntentToSwitch(); this.log(`👆 [交互] 命中关键词 [${text}]，许可。`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH); return; }
                if ((tag === 'A' || tag === 'BUTTON' || tag === 'LI') && (rect.width < 60 && rect.height < 60 && rect.width > 20) && Math.abs(rect.width - rect.height) < 15) { this.setUserIntentToSwitch(); this.log(`👆 [交互] 命中方形功能按钮 (无文字/图标)，许可。`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH); return; }
                if (['SVG', 'I', 'EM', 'PATH', 'RECT'].includes(originalTarget.tagName.toUpperCase()) || (cls.includes('btn') || cls.includes('play') || cls.includes('prev') || cls.includes('next') || cls.includes('arrow') || cls.includes('icon') || cls.includes('fa-'))) { if (['A', 'BUTTON', 'LI'].includes(tag) || target.getAttribute('onclick')) { this.setUserIntentToSwitch(); this.log(`👆 [交互] 命中图标/导航类名 [${cls}]，许可。`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH); return; } }
                if (/^\d{1,3}$/.test(text) && target.closest('[class*="list"], [class*="play"], [class*="episode"], [class*="server"]')) { this.setUserIntentToSwitch(); this.log(`👆 [交互] 纯数字选集[${text}]，许可。`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH); }
            }, true);
            this.log("用户意图监听器已部署。", CONSTANTS.LOG_TYPES.INIT);
        }
        setUserIntentToSwitch() {
            this.sandboxManager.cancelCountdown("用户交互");
            this.log(" [用户操作]|👇|🔐检测到点击，强制重置所有决策锁，为新视频让路。", CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH);
            this.userIntendsToSwitch = true; this.decisionInProgress = false; this.decisionMade = false; this.failedCandidateKeys.clear();
            if (this.userActionTimeout) clearTimeout(this.userActionTimeout);
            this.userActionTimeout = setTimeout(() => { this.userIntendsToSwitch = false; }, 10000);
        }
        _getNormalizationKey(url) {
            if (typeof url !== 'string') return null;
            if (url.startsWith('blob:')) return url;
            try { const urlObj = new URL(url); if (urlObj.hostname.includes('googlevideo.com')) return url.split('?')[0]; return urlObj.href; } catch (e) { return url; }
        }
        _extractUrlFromParameter(urlString) {
            try {
                const urlObj = new URL(urlString, window.location.href);
                for (const param of ['url', 'src', 'vid', 'play_url']) { if (urlObj.searchParams.has(param)) { const nestedUrl = urlObj.searchParams.get(param); if (nestedUrl && (nestedUrl.startsWith('http') || nestedUrl.startsWith('/'))) { this.log(`在URL参数'${param}'中提取到真实视频地址。`, CONSTANTS.LOG_TYPES.CORE_URL_RESOLVE); return nestedUrl; } } }
            } catch (e) { }
            return urlString;
        }
        async addTakeoverCandidate(candidateInfo) {
            if (this.isSystemHalted) return;
            if (!candidateInfo.url || candidateInfo.url.length < 15 || candidateInfo.url === 'https://' || candidateInfo.url === 'http://' || /blank\.mp4|empty\.mp4/i.test(candidateInfo.url)) return;
            candidateInfo.url = this._extractUrlFromParameter(candidateInfo.url);
            const cacheKey = this._getNormalizationKey(candidateInfo.url);
            if (candidateInfo.m3u8Text) this.m3u8SessionCache.set(cacheKey, candidateInfo.m3u8Text);
            else if (cacheKey && this.m3u8SessionCache.has(cacheKey)) { candidateInfo.m3u8Text = this.m3u8SessionCache.get(cacheKey); this.log(`[缓存命中] ⚡️复用历史M3U8数据，规避一次性链接失效。`, CONSTANTS.LOG_TYPES.INFO); }
            const { playerManager, frameCommunicator } = this.context;
            if (this.staleVideoUrl && candidateInfo.url && (candidateInfo.url === this.staleVideoUrl || candidateInfo.url.includes(this.staleVideoUrl))) { if (!candidateInfo.sourceName.includes('触发器')) { this.log(`👻[幽灵过滤]|拦截到上一页面的尸体信号:${candidateInfo.url.slice(-30)}`, CONSTANTS.LOG_TYPES.WARN); return; } }
            if (candidateInfo.sourceName?.includes('触发器')) { this.log(`👆收到[${candidateInfo.sourceName}]信号，强制确认为用户交互意图。`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH); this.setUserIntentToSwitch(); }
            if ((candidateInfo.sourceName.includes('劫持') || candidateInfo.sourceName.includes('attr')) && !candidateInfo.sourceName.includes('JSON') && !candidateInfo.url.startsWith('blob:') && candidateInfo.url !== this.lastSuccessfulUrl) {
                this.log(`[智能穿透] ⚡️检测到底层变更(${candidateInfo.sourceName})，强制解锁换集保护。`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH);
                this.setUserIntentToSwitch();
            }
            if (candidateInfo.url && candidateInfo.url.startsWith('blob:')) {
                if (candidateInfo.sourceName.includes('网络拦截')) this.log(`[门禁]|🚧|🟢放行|网络拦截Blob(高置信度)|来源:${candidateInfo.sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
                else if (/扫描|DOM|ATTR/.test(candidateInfo.sourceName)) { this.log(`[门禁]|🚧|⛔️拦截|DOM扫描Blob(MSE对象无法跨实例复用)|来源:${candidateInfo.sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT); return; }
                else if (this.lastSuccessfulUrl) this.log(`⚠️检测到Blob URL变动，尝试使用核心档案中的真实地址。`, CONSTANTS.LOG_TYPES.WARN);
                else this.log(`[门禁]|🚧|尝试放行|Blob URL(未知来源)|来源:${candidateInfo.sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
            }
            if (playerManager.isPlayerActiveOrInitializing && this.userIntendsToSwitch) {
                this.log(`[最高指令]|📳|👇用户换集意图触发，强制刷新所有决策！`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH);
                playerManager.cleanup();
                Object.assign(this, { decisionMade: false, decisionInProgress: false, userIntendsToSwitch: false, isBufferingBackupCandidates: false });
                this.takeoverCandidates.clear(); this.lastCandidatesBackup.clear(); clearTimeout(this.backupBufferTimer);
            }

            if ((this.decisionInProgress || playerManager.isPlayerActiveOrInitializing) && !this.userIntendsToSwitch) {
                if (this._evaluateQualityOverride(candidateInfo)) return;
                if (candidateInfo.mediaElement && !PageScanner.isPreRollAdByPathFeatures(candidateInfo.url, this.context)) this.neutralizeOriginalPlayer(candidateInfo.mediaElement);
                if (this.isBufferingBackupCandidates) {
                    this.log(`[稳定性护盾]|🛡️|当前播放稳定，已拦截(${candidateInfo.sourceName})的平级/低级干扰，转为后台备份。`, CONSTANTS.LOG_TYPES.INFO);
                    const key = this._getNormalizationKey(candidateInfo.url);
                    if (key && !this.lastCandidatesBackup.has(key)) this.lastCandidatesBackup.set(key, { ...candidateInfo, sources: new Set([candidateInfo.sourceName]) });
                    return;
                }
                if (candidateInfo.url && !candidateInfo.url.startsWith('blob:')) { this.passiveCandidates.set(candidateInfo.url, candidateInfo); if (this.passiveCandidates.size > 15) this.passiveCandidates.delete(this.passiveCandidates.keys().next().value); }
                return;
            }
            if (!CONSTANTS.IS_TOP_FRAME) {
                this.log(`[iFrame勘查员]发现目标，打包情报上报...`, CONSTANTS.LOG_TYPES.COMM);
                frameCommunicator.postToTopFrame({ type: CONSTANTS.MESSAGE_TYPES.RAW_SIGNAL_FORWARDED, payload: { url: candidateInfo.url, sourceName: candidateInfo.sourceName, m3u8Text: candidateInfo.m3u8Text || null, survey: candidateInfo.survey, mediaElement: null } });
                return;
            }

            try {
                if (!this.context.behavioralFilter) this.context.behavioralFilter = new BehavioralFilter(this.context);
                const analysisResult = await this.context.behavioralFilter.analyze(candidateInfo);

                if (!analysisResult.isLegitimate) {

                    return;
                }

                if ((this.decisionInProgress || this.context.playerManager.isPlayerActiveOrInitializing) && !this.userIntendsToSwitch) {
                    if (this.isBufferingBackupCandidates) {
                        const key = this._getNormalizationKey(candidateInfo.url);
                        if (key && !this.lastCandidatesBackup.has(key)) {
                            this.lastCandidatesBackup.set(key, { ...candidateInfo, sources: new Set([candidateInfo.sourceName]) });
                            this.log(`[并发竞争] 🥈在分析期间失去主导权，转存为备份: ${candidateInfo.url.slice(-30)}`, CONSTANTS.LOG_TYPES.INFO);
                        }
                    }
                    return;
                }

                this.decisionInProgress = true;
                this.log(`[决策]|⚖️|🔒信号「${candidateInfo.sourceName}」通过门禁检查，系统上锁并执行接管。`, CONSTANTS.LOG_TYPES.INFO);

                this.sandboxManager.cancelCountdown(`捕获到有效信号:${candidateInfo.sourceName}`);
                this.log(`[决策]|⚖️|✅合格信号已确认「来源:${candidateInfo.sourceName}」，立即执行接管！`, CONSTANTS.LOG_TYPES.TAKEOVER_SUCCESS);
                this.log(`[备份]|💾|3秒备份窗口已在后台开启...`, CONSTANTS.LOG_TYPES.INFO);
                this.isBufferingBackupCandidates = true;
                this.backupBufferTimer = setTimeout(() => { this.isBufferingBackupCandidates = false; this.log(`[备份]|💾|3秒备份窗口关闭。`, CONSTANTS.LOG_TYPES.INFO); }, 3000);
                await this._executeTakeover(candidateInfo);
            } catch (err) {
                this.log(`[决策]|⚖️|接管执行失败:${err.message}`, CONSTANTS.LOG_TYPES.TAKEOVER_FAIL);
                this.decisionInProgress = false;
                this.reportPlaybackFailure();
            }
        }
        _evaluateQualityOverride(candidateInfo) {
            const { playerManager } = this.context;
            const currentUrl = playerManager.currentVideoUrl || "";
            const newUrl = candidateInfo.url || "";
            if (currentUrl === newUrl) return false;
            const isNewM3U8 = Utils.isM3U8(candidateInfo.url) || (candidateInfo.m3u8Text && candidateInfo.m3u8Text.includes('#EXTM3U'));
            const isCurrentM3U8 = (playerManager.currentVideoFormat?.name === 'M3U8') || (this.lastSuccessfulUrl && Utils.isM3U8(this.lastSuccessfulUrl));

            const getQualityScore = (u, isM3) => {
                let score = 0;
                if (/(\/|_|-)(240|360|480)p(\.h264|\.av1)?\.mp4\.m3u8(\?|$)/i.test(u) || /(\/|_|-)(240|360)[pP](\?|$)/.test(u)) {
                    score -= 50;
                } else {
                    if (/4k|2160[pP]|3840[-x]2160/i.test(u)) score += 10;
                    else if (/1080[pP]|1920[-x]1080/i.test(u)) score += 8;
                    else if (/720[pP]|1280[-x]720/i.test(u)) score += 6;
                    else if (/480[pP]|854[-x]480/i.test(u)) score += 2;
                }
                if (/master\.m3u8|playlist\.m3u8/i.test(u) || (isM3 && !/(240|360|480|720|1080|2160)p/i.test(u))) {
                    score += 5;
                }

                return isM3 ? score + 2.5 : score;
            };

            const targetUrl = this.decisionInProgress && this.lastSuccessfulUrl ? this.lastSuccessfulUrl : currentUrl;
            const targetIsM3 = this.decisionInProgress ? (Utils.isM3U8(targetUrl)) : isCurrentM3U8;

            try {
                const host = window.location.hostname;
                const isTargetLocal = targetUrl.startsWith('/') || targetUrl.includes(host);
                const isNewRemote = newUrl.startsWith('http') && !newUrl.includes(host);

                if (isTargetLocal && isNewRemote) {
                    const getSegs = (u) => u.split('?')[0].split('/').filter(s => s.length > 5 && /[0-9]/.test(s));
                    const cSegs = getSegs(targetUrl);
                    const nSegs = getSegs(newUrl);
                    if (cSegs.some(s => nSegs.includes(s))) {
                        this.log(`[纠错]|🎊|捕捉到更优的绝对路径信号(CDN)，执行无缝切换: ${newUrl.slice(-50)}`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                        this.decisionInProgress = true; this.decisionMade = false; this.isIntentionalSwitch = true;
                        if (playerManager.isPlayerActiveOrInitializing) {
                            try { playerManager.videoElement.pause(); playerManager.videoElement.src = ''; playerManager.videoElement.load(); } catch (e) { }
                            playerManager.isPlayerActiveOrInitializing = false;
                        }
                        this._executeTakeover(candidateInfo);
                        return true;
                    }
                }
            } catch(e) {}

            const newScore = getQualityScore(newUrl, isNewM3U8);
            const currentScore = getQualityScore(targetUrl, targetIsM3);
            if (!playerManager.hostElement?.classList.contains('dmz-visible') && (newScore > currentScore)) {
                this.log(`[画质升级]|🎉|发现更优信号(New:${newScore} vs Old:${currentScore})，执行抢断！`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                if (currentUrl && !currentUrl.startsWith('blob:')) {
                    const victimKey = this._getNormalizationKey(currentUrl);
                    if (victimKey) { this.takeoverCandidates.set(victimKey, { url: currentUrl, sourceName: '画质降级保底(历史信号)', score: currentScore }); }
                }
                this.decisionInProgress = true; this.decisionMade = false; this.isIntentionalSwitch = true;
                if (playerManager.isPlayerActiveOrInitializing) {
                    try { playerManager.videoElement.pause(); playerManager.videoElement.src = ''; playerManager.videoElement.load(); } catch (e) { }
                    playerManager.isPlayerActiveOrInitializing = false;
                }
                this._executeTakeover(candidateInfo);
                return true;
            }
            return false;
        }
        reportPlaybackFailure(failureContext = {}) {
            const currentActiveUrl = this.context.playerManager.currentVideoUrl;
            const failedUrl = failureContext.failedUrl || currentActiveUrl;
            const getBaseUrl = (u) => u ? u.split('?')[0].split('#')[0] : '';
            if (failedUrl && currentActiveUrl && failedUrl !== currentActiveUrl && getBaseUrl(currentActiveUrl) === getBaseUrl(failedUrl)) return;
            if (this.isIntentionalSwitch) { this.isIntentionalSwitch = false; return; }
            const { playerManager, frameCommunicator } = this.context;
            const failedKey = this._getNormalizationKey(failedUrl);
            if (!this.failedCandidateKeys) this.failedCandidateKeys = new Set();
            if (failedKey) { this.failedCandidateKeys.add(failedKey); this.log(`[FTR]|🧰|信号源(${failedUrl ? failedUrl.slice(-50) : '未知'}) 因(${failureContext.reason || 'Playback Error'})已被加入会话黑名单。`, CONSTANTS.LOG_TYPES.CORE_EXEC); }
            if (playerManager.isPlayerActiveOrInitializing) playerManager.cleanup();
            this.decisionMade = false; this.decisionInProgress = false;
            this.log(`[FTR]|🧰|🔐系统决策锁已解除，恢复监听状态。`, CONSTANTS.LOG_TYPES.CORE_EXEC);
            const validCandidates = new Map();
            new Map([...this.takeoverCandidates, ...this.bufferedBackupCandidates, ...this.lastCandidatesBackup]).forEach((v, k) => { if (!this.failedCandidateKeys.has(k)) validCandidates.set(k, v); });
            this.takeoverCandidates.clear(); this.bufferedBackupCandidates.clear(); this.lastCandidatesBackup.clear();
            if (validCandidates.size > 0) {
                this.log(`[FTR]|🧰|在备用信号中发现${validCandidates.size}个新选项，立即重新决策...`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                const bestAlternative = this._getBestCandidate(Array.from(validCandidates.values()));
                if (bestAlternative) this._executeTakeover(bestAlternative);
            } else if (frameCommunicator.pendingMainPlayerSource) {
                this.log(`[FTR]|🧰|启用候补Iframe信号，尝试激活...`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                const { source, origin, frameElement } = frameCommunicator.pendingMainPlayerSource;
                Object.assign(frameCommunicator, { mainPlayerFrameSource: source, mainPlayerFrameOrigin: origin, mainPlayerIframeElement: frameElement, pendingMainPlayerSource: null });
                source.postMessage({ type: CONSTANTS.MESSAGE_TYPES.ACTIVATE_AUTOPLAY }, origin);
                setTimeout(() => { if (!this.context.playerManager.isPlayerActiveOrInitializing) { this.log(`[FTR]|🧰|候补Iframe激活超时(未检测到播放)，强制执行沙箱重载。`, CONSTANTS.LOG_TYPES.WARN); this.sandboxManager.reload(); } }, 1000);
            } else if (!this.sandboxManager.hasTriggeredSandbox && !this.isSystemHalted) { this.log(`[FTR]|🧰|所有已知信号均失效，尝试最后手段：沙箱重载。`, CONSTANTS.LOG_TYPES.CORE_EXEC); this.sandboxManager.reload(); }
            else this.log(`[FTR]|🧰|无可用信号且沙箱已使用过(或系统已休眠)，停止尝试。`, CONSTANTS.LOG_TYPES.CORE_EXEC);
        }
        async sendPlayCommand(type, content) {
            const { playerManager, diagnosticsTool, frameCommunicator, actionLogger } = this.context;
            if (new URLSearchParams(window.location.search).has('dmz_sandbox')) {
                frameCommunicator.postToTopFrame({ type: CONSTANTS.MESSAGE_TYPES.SANDBOX_URL_FOUND, candidateInfo: { url: (type === 'm3u8') ? content.finalUrl : content, sourceName: CONSTANTS.TAKEOVER_SOURCES.CROSS_FRAME('沙箱重载'), m3u8Text: (type === 'm3u8') ? content.original : null } });
                return;
            }
            if (playerManager.isPlayerActiveOrInitializing) return;
            if (!CONSTANTS.IS_TOP_FRAME) {
                this.lastPostedUrl = (type === 'm3u8') ? content.finalUrl : content;
                this.findAllVideosAndAudioInPage().forEach(m => this.neutralizeOriginalPlayer(m));
                frameCommunicator.postToTopFrame({ type: CONSTANTS.MESSAGE_TYPES.M3U8_COMMAND, action: type === 'm3u8' ? 'PLAY_M3U8' : 'PLAY_NORMAL_VIDEO', content: (type === 'm3u8') ? content.processed : content, originalContent: (type === 'm3u8') ? content.original : null, finalUrl: this.lastPostedUrl, videoFormat: playerManager.currentVideoFormat, playbackHealth: diagnosticsTool.playbackHealth, slicingReport: diagnosticsTool.slicingReport, iframeLogs: actionLogger.getLogs().filter(log => log.type === CONSTANTS.LOG_TYPES.CORE_SLICE) });
            } else {
                await playerManager.play(content);
                try { const frames = window.frames; for (let i = 0; i < frames.length; i++) frames[i].postMessage({ type: CONSTANTS.MESSAGE_TYPES.FORCE_PAUSE_ALL }, '*'); } catch (e) { }
            }
        }
        findAllVideosAndAudioInPage() {
            const media = [], visited = new Set();
            function find(node) { if (!node || visited.has(node)) return; visited.add(node); try { node.querySelectorAll('video, audio').forEach(m => media.push(m)); node.querySelectorAll('*').forEach(el => el.shadowRoot && find(el.shadowRoot)); } catch (e) { } }
            if (document.body) find(document.body);
            return media;
        }
        neutralizeOriginalPlayer(media, initialState = 'active') {
            const self = this;
            if (self.isSystemHalted || self.isRestoreInProgress || !media || media.id === CONSTANTS.IDS.PLAYER || media.dataset.dmzDismissed === 'true') return null;
            if (!media.isConnected) return null;
            const parentLink = media.closest('a');
            if (parentLink && parentLink.href && !parentLink.href.includes('#') && !parentLink.href.includes('javascript:')) {
                const currentUrl = window.location.href.split('#')[0].split('?')[0];
                if (!parentLink.href.includes(currentUrl)) return null;
            }
            if (media.muted && media.autoplay && !media.controls && (media.videoWidth > 0 && media.videoWidth < 300)) return null;
            if (media.loop && !media.controls) return null;
            const src = media.src || media.querySelector('source')?.src;
            if (src && PageScanner.isPreRollAdByPathFeatures(src, self.context)) return null;
            if (media.dataset.dmzNeutralized === 'true') { if (!media.paused && media.dataset.dmzAllowSignalGeneration !== 'true') media.pause(); if (!media.muted) media.muted = true; return null; }
            if (media.dataset.dmzNeutralized === 'passive' && initialState === 'passive') return null;
            if (media.dataset.dmzNeutralized === 'passive' && initialState === 'active') {
                self.context.actionLogger.log(`[智能穿透] 监测到视频源转正，立即激活压制器！`, CONSTANTS.LOG_TYPES.CORE_NEUTRALIZE);
                media.dataset.dmzNeutralized = 'true';
                if (media.dmzOverlay) { media.dmzOverlay.style.display = 'flex'; media.dmzOverlay.style.opacity = '1'; media.dmzOverlay.style.pointerEvents = 'auto'; }
                media.pause(); media.muted = true;
                return null;
            }
            const isPassive = initialState === 'passive';
            if (!isPassive) MANAGED_MODULES.forEach(({ module, configKey }) => { if (self.context.settingsManager.config[configKey]) module.enable(self.context); });
            self.context.actionLogger.log(`开始改造原生 ${media.tagName} 为切换触发器...`, CONSTANTS.LOG_TYPES.CORE_NEUTRALIZE);
            const originalSrc = media.src || media.querySelector('source[src]')?.src;
            if (originalSrc) media.dataset.dmzOriginalSrc = originalSrc;
            media.dataset.dmzNeutralized = isPassive ? 'passive' : 'true';
            media.dmzOverlay = null;
            if (!isPassive) {
                media.pause(); media.muted = true; media.volume = 0; media.autoplay = false; media.loop = false; media.removeAttribute('autoplay');
                if (!media.dataset.dmzVolumeSaved) { media.dataset.dmzVolumeSaved = 'true'; media.dataset.dmzOriginalVolume = media.volume || 1.0; }
            }
            media._dmzPreventPlay = (e) => { if (media.dataset.dmzNeutralized === 'passive' || media.dataset.dmzAllowSignalGeneration === 'true' || !e.isTrusted) return; media.pause(); media.muted = true; e.stopPropagation(); e.stopImmediatePropagation(); };
            ['play', 'playing'].forEach(evt => media.addEventListener(evt, media._dmzPreventPlay, true));
            media.addEventListener('canplay', () => { if (media.dataset.dmzNeutralized !== 'passive' && media.dataset.dmzAllowSignalGeneration !== 'true') { media.pause(); media.muted = true; } }, { once: false, passive: true });
            media.style.removeProperty('visibility');
            const parent = media.parentElement;
            if (parent) {
                if (window.getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
                const r = parent.getBoundingClientRect();
                if (r.width > 50 && r.height < 20) { parent.style.minHeight = (r.width * 9 / 16) + 'px'; parent.dataset.dmzFixHeight = 'true'; }
            }
            const onDismiss = (overlay) => {
                if (parent && parent.dataset.dmzFixHeight) { parent.style.minHeight = ''; delete parent.dataset.dmzFixHeight; }
                overlay.remove(); self.neutralizedMedia.delete(media); media.dataset.dmzDismissed = 'true'; delete media.dataset.dmzNeutralized; delete media.dataset.dmzSourceLocked;
                try { delete media.play; delete media.pause; } catch (e) {}
                media.style.visibility = ''; media.style.opacity = ''; media.style.pointerEvents = ''; media.muted = false; media.controls = true;
            };
            const onActivate = (e, overlay) => {
                if (self.isRestoreInProgress) return;
                if (overlay.intersectionObserver) { overlay.intersectionObserver.disconnect(); overlay.intersectionObserver = null; }
                self.setUserIntentToSwitch();
                self.context.actionLogger.log(`播放器触发器被点击，系统已重置，准备捕获视频流...`, CONSTANTS.LOG_TYPES.PLAYBACK_SWITCH);
                if (CONSTANTS.IS_TOP_FRAME) { PageScanner.scanForFlashvars(self.context); PageScanner.scanForEmbeddedData(self.context); }
                let directUrl = media.src || media.querySelector('source')?.src || media.dataset.dmzOriginalSrc;
                if (directUrl && directUrl.startsWith('http') && directUrl !== self.lastSuccessfulUrl) { self.context.actionLogger.log(`[直接激活] 发现当前元素已有有效直链，立即播放: ${directUrl.slice(-30)}`, CONSTANTS.LOG_TYPES.CORE_EXEC); self.addTakeoverCandidate({ url: directUrl, sourceName: '原生播放器触发器(直连)' }); return; }
                const passiveArr = Array.from(self.passiveCandidates.values()).reverse();
                const bestMatch = passiveArr.find(c => (c.m3u8Text || Utils.isM3U8(c.url)) && c.url !== self.lastSuccessfulUrl) || passiveArr[0];
                if (bestMatch) { self.context.actionLogger.log(`[智能穿透] ⚡️命中后台缓存的潜伏信号(正片)，立即接管: ${bestMatch.url.slice(-50)}`, CONSTANTS.LOG_TYPES.CORE_EXEC); self.passiveCandidates.clear(); self.addTakeoverCandidate(bestMatch); return; }
                if (self.lastSuccessfulUrl && self.lastSuccessfulUrl.startsWith('http')) { self.context.actionLogger.log(`[记忆回溯] 触发器点击：无新信号，尝试复用历史记录: ${self.lastSuccessfulUrl.slice(-50)}`, CONSTANTS.LOG_TYPES.CORE_EXEC); self.addTakeoverCandidate({ url: self.lastSuccessfulUrl, sourceName: '原生播放器触发器(历史复用)' }); return; }
                if (!CONSTANTS.IS_TOP_FRAME) { self.context.actionLogger.log(`[交互] 触发器点击：源无效，请求顶层协助...`, CONSTANTS.LOG_TYPES.CORE_EXEC); self.context.frameCommunicator.postToTopFrame({ type: CONSTANTS.MESSAGE_TYPES.IFRAME_TRIGGER_CLICK }); return; }
                self.context.actionLogger.log(`[交互] 触发器点击：源无效(Blob/空)，强制启动沙箱重载以获取新签名...`, CONSTANTS.LOG_TYPES.CORE_EXEC);
                self.sandboxManager.hasTriggeredSandbox = false; if (self.sandboxManager.iframeSandbox) self.sandboxManager.cleanup(); self.sandboxManager.reload();
            };
            const overlay = this.overlayManager.createTriggerOverlay(media, onActivate, onDismiss, isPassive);
            try { if (parent) { parent.style.isolation = 'auto'; parent.style.zIndex = 'auto'; } } catch (e) {}
            if (!media.dmzOverlay) {
                media.dmzOverlay = overlay;
                const observer = new IntersectionObserver((entries) => {
                    if (media.dataset.dmzNeutralized === 'passive') return;
                    overlay.style.opacity = entries[0].isIntersecting ? '1' : '0'; overlay.style.pointerEvents = entries[0].isIntersecting ? 'auto' : 'none';
                }, { root: null, rootMargin: "0px", threshold: 0.1 });
                observer.observe(media);
                overlay.intersectionObserver = observer;
            }
            if (!isPassive) {
                try {
                    Object.defineProperties(media, {
                        play: { value: () => { if (media.dataset.dmzAllowSignalGeneration === 'true') return HTMLElement.prototype.play.call(media); return Promise.resolve(); }, configurable: true },
                        pause: { value: () => { if (media.dataset.dmzAllowSignalGeneration === 'true') return HTMLElement.prototype.pause.call(media); }, configurable: true },
                    });
                } catch (e) { }
            }
            const attributeObserver = new MutationObserver(() => {
                const newSrc = media.src || media.currentSrc;
                if (newSrc && newSrc !== media.dataset.dmzOriginalSrc) {
                    media.dataset.dmzOriginalSrc = newSrc;
                    if (media.dataset.dmzNeutralized === 'passive') { if (!PageScanner.isPreRollAdByPathFeatures(newSrc, self.context)) self.neutralizeOriginalPlayer(media, 'active'); return; }
                    if (media.dataset.dmzAllowSignalGeneration !== 'true') { media.pause(); media.muted = true; }
                }
            });
            attributeObserver.observe(media, { attributes: true, attributeFilter: ['src'] });
            if (!isPassive) {
                self.startPersistentEnforcer();
                self.activeNeutralizers.add(attributeObserver);
            }
            return attributeObserver;
        }
        _getBestCandidate(candidates) {
            const getScore = (u) => {
                let s = 0;
                if (/(\/|_|-)(240|360|480)p(\.h264|\.av1)?\.mp4\.m3u8(\?|$)/i.test(u)) s -= 50;
                else {
                    if (/4k|2160[pP]/.test(u)) s += 10;
                    else if (/1080[pP]/.test(u)) s += 8;
                    else if (/720[pP]/.test(u)) s += 6;
                }
                if (/master\.m3u8/i.test(u)) s += 5;
                if (u.includes('?sign=') || u.includes('&t=')) s += 2;
                return s;
            };
            return candidates.sort((a, b) => getScore(b.url) - getScore(a.url))[0];
        }
        async _executeTakeover(dossier) {
            this.userIntendsToSwitch = false;
            this.findAllVideosAndAudioInPage().forEach(m => { const obs = this.neutralizeOriginalPlayer(m); if (obs) this.activeNeutralizers.add(obs); });
            if (!dossier.sources && dossier.sourceName) dossier.sources = new Set([dossier.sourceName]);
            this.lastCandidatesBackup = new Map(this.takeoverCandidates);
            const { playerManager, diagnosticsTool } = this.context;
            if (dossier.url && !dossier.url.startsWith('blob:')) this.lastSuccessfulUrl = dossier.url;
            this.log(`[裁决]|👨‍⚖️|🔒决策锁定:[${dossier.url.slice(-50)}]|来源:${Array.from(dossier.sources).join(' + ')}。`, CONSTANTS.LOG_TYPES.TAKEOVER_SUCCESS);
            let { url, m3u8Text } = dossier;
            const requestId = ++this.currentRequestId;
            diagnosticsTool.captureTakeoverEvidence(dossier);
            try {
                diagnosticsTool.resetPlaybackHealth(); diagnosticsTool.resetSlicingReport();
                const hasM3u8Header = m3u8Text && typeof m3u8Text === 'string' && (m3u8Text.includes('#EXTM3U') || m3u8Text.includes('#EXTINF'));
                let isM3U8 = hasM3u8Header ? true : (/\.(mp4|webm|ogg|mov|avi|mkv)(\?|$)/i.test(url) ? false : Utils.isM3U8(url));

                if (!hasM3u8Header && !isM3U8) m3u8Text = null;

                const videoType = isM3U8 ? 'm3u8' : 'normal';
                let videoData = url;
                if (isM3U8) {
                    const check = () => this.currentRequestId === requestId;
                    const text = m3u8Text || await this.m3u8Processor.fetchText(url, check, requestId);
                    if (!check()) throw new Error('Request outdated');
                    const processed = await this.m3u8Processor.process(text, url, requestId, check);
                    if (!check()) throw new Error('Request outdated');
                    if (!processed?.processed) throw new Error("M3U8处理后内容为空");
                    videoData = processed;
                } else playerManager.currentVideoFormat = Utils.getVideoFormat(url);
                await this.sendPlayCommand(videoType, videoData);
            } catch (error) {
                if (!error.message.includes('Request outdated')) {
                    this.log(`[裁决]|👨‍⚖️|[ID:${requestId}]处理视频源失败:${error.message}`, CONSTANTS.LOG_TYPES.TAKEOVER_FAIL);
                    this.reportPlaybackFailure({ failedUrl: url, reason: error.message });
                }
            } finally { setTimeout(() => { this.isIntentionalSwitch = false; }, 1000); }
        }
    }
    class BehavioralFilter extends BaseModule {
        constructor(context) { super(context, 'BehavioralFilter'); }
        _isSameAsPageUrl(url) {
            if (!url || typeof url !== 'string') return false;
            try {
                const cleanPage = window.location.href.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
                return cleanPage.includes('view_video.php') ? cleanPage === cleanUrl : cleanUrl.includes(cleanPage);
            } catch (e) { return false; }
        }
        async analyze(candidate) {
            const { coreLogic } = this.context;
            const { url, sourceName, m3u8Text } = candidate;
            if (/JSON|DECRYPTION|ATTR/.test(sourceName)) {
                if (/\/e\/|\/v\//.test(url)) {
                    const hasVideoExtension = /\.(m3u8|mp4|flv|mkv|webm)(\?|$)/i.test(url);
                    if (!hasVideoExtension) {
                        this.log(`[门禁]|🚧|⛔️拦截|(确认是Iframe嵌入页)|来源:${sourceName}|URL:${url.slice(-50)}`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
                        return { isLegitimate: false };
                    }
                }
            }
            if (PageScanner.isPreRollAdByPathFeatures(url, this.context, candidate)) {
                this.log(`[门禁]|🚧|⛔️拦截|(广告特征)|URL:${url.slice(-50)}`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
                return { isLegitimate: false };
            }
            if ((sourceName.includes('iFrame') || sourceName.includes('跨域') || sourceName.includes('信使')) && url.startsWith('/') && !url.startsWith('//')) {
                const isTrusted = coreLogic.userIntendsToSwitch || coreLogic.sandboxManager.hasTriggeredSandbox || sourceName.includes('触发器') || sourceName.includes('记忆') || /\.m3u8/i.test(url) || /\.mp4/i.test(url) || /get_file/i.test(url);
                this.log(`[门禁]|🚧|${isTrusted ? '🟢放行' : '⛔️拦截'}|(跨域相对路径${isTrusted ? '-高置信度' : ''})|来源:${sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
                return { isLegitimate: isTrusted };
            }
            if (/JSON|DOM|ATTR|扫描|嵌入式|网络|Net/.test(sourceName)) {
                const path = window.location.pathname.toLowerCase(), full = (path + window.location.search).toLowerCase();
                const isListing = path.length < 2 || /^\/(index|home|default|main)(\.(html|php|jsp|asp|aspx))?\/?$/i.test(path) || /(^|\/)(s|search|query|results?|so)($|\/|\.|_)/i.test(path) || /(^|\/)(auth|login|signin|signup|register|account|dashboard|console|member|profile|settings|my|user)($|\/|\.|_)/i.test(path) || /^(auth|login|account|sso|id)\./i.test(window.location.hostname) || /(^|\/)(type|vodtype|list|category|tag|channel|column)($|\/|\.|_)/i.test(path);
                if (isListing) {
                    if (/(play|video|watch|detail|view)/i.test(full) || /[\?&](id|vid|v|f)=/.test(full)) this.log(`[门禁]|🚧|疑似|💭列表页但包含播放特征 [${full}]，豁免放行。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
                    else { this.log(`[门禁]|🚧|⛔️拦截|(页面场景自动推荐，防止误扰)|来源:${sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT); return { isLegitimate: false }; }
                }
            }
            if (Utils.isM3U8(url) || (m3u8Text && m3u8Text.includes('#EXTM3U'))) { this.log(`[门禁]|🚧|🟢放行|(高优先级M3U8信号)|来源:${sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT); return { isLegitimate: true }; }
            if (!url.startsWith('http') && !url.startsWith('//') && !url.startsWith('/') && !url.startsWith('blob:')) { this.log(`[门禁]|🚧|⛔️拦截|(无效的URL片段)|来源:${sourceName}|URL:${url.slice(0, 80)}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT); return { isLegitimate: false }; }
            if (this._isSameAsPageUrl(url)) { this.log(`[门禁]|🚧|⛔️拦截|(无效的页面URL)|来源:${sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT); return { isLegitimate: false }; }
            if (url.includes('/m3u8/') && !Utils.isM3U8(url)) {
                if (sourceName.includes('触发器') || sourceName.includes('记忆') || !/\.[a-zA-Z0-9]{2,4}$/.test(url.split('?')[0])) this.log(`[门禁]|🚧|疑似|💭M3U8接口(无后缀/触发器)，豁免放行。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
                else { this.log(`[门禁]|🚧|⛔️拦截|(M3U8路径下的非M3U8文件，疑似诱饵)|来源:${sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT); return { isLegitimate: false }; }
            }
            this.log(`[门禁]|🚧|🟢放行|来源:${sourceName}。`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
            return { isLegitimate: true };
        }
    }
    class SPANavigator extends BaseModule {
        constructor(context) { super(context, 'SPANavigator'); this.lastUrl = window.location.href; }
        init() {
            const pushState = history.pushState;
            const replaceState = history.replaceState;
            history.pushState = (...args) => { pushState.apply(history, args); this.onUrlChange(); };
            history.replaceState = (...args) => { replaceState.apply(history, args); this.onUrlChange(); };
            window.addEventListener('popstate', () => this.onUrlChange());
        }
        onUrlChange() {
            requestAnimationFrame(() => {
                if (window.location.href.split('#')[0] === this.lastUrl.split('#')[0]) return;
                const { playerManager, coreLogic, domScanner } = this.context;
                this.log(`URL 变化 (SPA):${this.lastUrl} ->${window.location.href}`, CONSTANTS.LOG_TYPES.NAV);
                this.lastUrl = window.location.href;
                if (coreLogic.lastSuccessfulUrl) coreLogic.staleVideoUrl = coreLogic.lastSuccessfulUrl;
                coreLogic.lastSuccessfulUrl = null;
                playerManager.cleanup();
                coreLogic.activeNeutralizers.forEach(obs => obs.disconnect());
                const noiseReason = Utils.isHighNoisePage();
                if (noiseReason) {
                    this.log(`[NAV] 新页面评分过低 [${noiseReason}]，保持/进入休眠模式。`, CONSTANTS.LOG_TYPES.NAV);
                    domScanner.isStopped = true;
                    coreLogic.isSystemHalted = true;
                    domScanner.stop();
                    return;
                }
                this.log(`[NAV] 新页面评分达标，激活/重置系统！`, CONSTANTS.LOG_TYPES.NAV);
                coreLogic.isSystemHalted = false;
                const survivedCandidates = new Map();
                const survivedPassive = new Map();
                const keepFresh = (source, target) => { source.forEach((v, k) => { if (!coreLogic.staleVideoUrl || !v.url.includes(coreLogic.staleVideoUrl.split('?')[0])) target.set(k, v); }); };
                keepFresh(coreLogic.takeoverCandidates, survivedCandidates);
                keepFresh(coreLogic.passiveCandidates, survivedPassive);
                Object.assign(coreLogic, { decisionMade: false, decisionInProgress: false, takeoverCandidates: survivedCandidates, lastCandidatesBackup: new Map(), currentRequestId: 0, navigationRequestId: (coreLogic.navigationRequestId || 0) + 1, activeNeutralizers: new Set(), backupBufferTimer: (coreLogic.backupBufferTimer && clearTimeout(coreLogic.backupBufferTimer), null), isBufferingBackupCandidates: false, bufferedBackupCandidates: new Map(), passiveCandidates: survivedPassive });
                coreLogic.sandboxManager.hasTriggeredSandbox = false;
                domScanner.isStopped = false;
                domScanner.init();
                MANAGED_MODULES.forEach(m => m.enable(this.context));
                PageScanner.scanForFlashvars(this.context);
                PageScanner.scanForEmbeddedData(this.context);
                coreLogic.sandboxManager.startCountdown();
            });
        }
    }
    class DOMScanner extends BaseModule {
        constructor(context) {
            super(context, 'DOMScanner');
            this.observer = null;
            this.heartbeatTimer = null;
            this.isStopped = false;
            this.boundScanPage = Utils.debounce(this.scanPage.bind(this), 200);
            this.boundHandleScroll = Utils.debounce(this.handleScroll.bind(this), 800);
            this.boundVisibilityChange = () => {
                if (document.hidden) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
                else if (!this.heartbeatTimer && !this.isStopped) { this.heartbeatTimer = setInterval(() => this.scanPage(), 1500); this.scanPage(); }
            };
        }
        init() {
            if (this.isStopped || this.observer) { this.isStopped = false; return; }
            if (/(captcha|auth|login|signin|widget|comment|plugin|share|button|tracker|analytics|pixel|sync|oauth|verify|challenge|static|assets|\/ads?\/)/i.test(window.location.href)) { this.isStopped = true; return; }
            this.log("DOM扫描器已激活，开始搜索视频源。", CONSTANTS.LOG_TYPES.SCAN);
            this.isStopped = false;
            this.scanPage();
            this.observer = new MutationObserver(() => this.boundScanPage());
            this.observer.observe(document.documentElement, { childList: true, subtree: true });
            window.addEventListener('scroll', this.boundHandleScroll, { passive: true });
            document.addEventListener('visibilitychange', this.boundVisibilityChange);
            if (!this.heartbeatTimer) this.heartbeatTimer = setInterval(() => { if (!this.isStopped) this.scanPage(); }, 1500);
        }
        stop() {
            this.isStopped = true;
            if (this.boundVisibilityChange) document.removeEventListener('visibilitychange', this.boundVisibilityChange);
        }
        handleScroll() { if (!this.isStopped) requestAnimationFrame(() => this.scanPage()); }
        scanPage() { if (!this.isStopped && !this.context.coreLogic.isSystemHalted) this.context.coreLogic.findAllVideosAndAudioInPage().forEach(media => this.processMediaElement(media)); }
        async processMediaElement(media) {
            const { coreLogic } = this.context;
            if (coreLogic.isSystemHalted || coreLogic.isRestoreInProgress || media.id === CONSTANTS.IDS.PLAYER) return false;
            const targetSrc = media.src || media.querySelector('source[src]')?.src;
            if (!targetSrc || media.dataset.dmzIsAd === 'true' || media.dataset.dmzIgnored === 'true') return false;
            if (PageScanner.isPreRollAdByPathFeatures(targetSrc, this.context)) { media.dataset.dmzIsAd = 'true'; return false; }
            const rect = media.getBoundingClientRect();
            const style = window.getComputedStyle(media);
            if (media.loop && media.muted && media.autoplay && !media.controls) { media.dataset.dmzIgnored = 'true'; return false; }
            coreLogic.neutralizeOriginalPlayer(media, 'active');
            if (media.dataset.dmzSourceLocked === targetSrc) return false;
            media.dataset.dmzSourceLocked = targetSrc;
            const candidateInfo = { mediaElement: media, survey: { rect: { width: rect.width, height: rect.height }, computedStyle: { display: style.display, visibility: style.visibility } }, url: targetSrc, sourceName: CONSTANTS.TAKEOVER_SOURCES.DOM_HTTP };
            if (media.tagName !== 'VIDEO') return false;
            for (const key in media.dataset) {
                const val = media.dataset[key];
                if (typeof val === 'string' && (val.includes('http') || val.includes('{'))) {
                    try {
                        if (val.trim().startsWith('{')) { const cfg = JSON.parse(val); const u = cfg.src || cfg.url || cfg.videoUrl; if (u && typeof u === 'string' && u.startsWith('http')) { candidateInfo.url = u; candidateInfo.sourceName = CONSTANTS.TAKEOVER_SOURCES.DOM_ATTR; break; } }
                        else if (val.startsWith('http') && !PageScanner.isPreRollAdByPathFeatures(val, this.context)) { candidateInfo.url = val; candidateInfo.sourceName = CONSTANTS.TAKEOVER_SOURCES.DOM_ATTR; break; }
                    } catch (e) { }
                }
            }
            coreLogic.addTakeoverCandidate(candidateInfo);
            return true;
        }
    }
    class IframeTerminator extends BaseModule {
        constructor(context) { super(context, 'IframeTerminator'); this.observer = null; this.processedIframes = new WeakSet(); }
        start() {
            if (this.observer || !CONSTANTS.IS_TOP_FRAME) return;
            const scan = (node) => { if(node.nodeType === 1) (node.matches('iframe') ? [node] : node.querySelectorAll('iframe')).forEach(f => this.terminate(f)); };
            this.observer = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(scan)));
            this.observer.observe(document.documentElement, { childList: true, subtree: true });
            scan(document.documentElement);
        }
        stop() { this.observer?.disconnect(); this.observer = null; }
        terminate(iframe) {
            if (this.processedIframes.has(iframe)) return;
            try {
                if (iframe.src && ['/acs/phone/', 'googleads', 'googlesyndication', 'doubleclick.net', '/ad/'].some(k => iframe.src.includes(k))) {
                    this.processedIframes.add(iframe);
                    iframe.dataset.dmzOriginalSrc = iframe.src;
                    iframe.src = 'about:blank';
                    Object.assign(iframe.style, { visibility: 'hidden', border: 'none', width: '0', height: '0' });
                }
            } catch (e) { }
        }
    }
    class BaseInterceptor extends BaseModule {
        constructor(name) { super(null, name); this.isActive = false; }
        enable(context) { this.context = context; if (!this.isActive) { this.activate(context); this.log(`已启用。`); } }
        disable(context) { if (this.isActive) { this.deactivate(context); this.log(`已禁用。`); } this.context = null; }
        log(msg, type = CONSTANTS.LOG_TYPES.MODULE) { this.context?.actionLogger.log(`[${this.name}] ${msg}`, type); }
    }
    const NetworkInterceptor = new class extends BaseInterceptor {
        constructor() {
            super('NetworkInterceptor');
            this.originalXhrOpen = null;
            this.originalFetch = null;
        }

        activate(context) {
            this.isActive = true;
            this.originalXhrOpen = XMLHttpRequest.prototype.open;
            this.originalFetch = window.fetch;
            const { coreLogic, playerManager } = context;

            const checkM3U8 = (text) => typeof text === 'string' && text.length > 10 && text.trim().startsWith('#EXTM3U') && text.includes('#EXTINF');

            XMLHttpRequest.prototype.open = function (method, url, ...args) {

                const urlStr = String(url);

                if (typeof urlStr === 'string' && !(playerManager.isInternalRequest && urlStr.startsWith('blob:'))) {
                    this.addEventListener('load', () => {
                        if (this.status >= 200 && this.status < 400 && this.responseText && (Utils.isM3U8(urlStr) || checkM3U8(this.responseText))) {
                            context.actionLogger.log(`[NetworkInterceptor] [XHR]${urlStr.slice(-80)}`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
                            coreLogic.addTakeoverCandidate({
                                url: urlStr,
                                sourceName: CONSTANTS.TAKEOVER_SOURCES.NET_XHR,
                                m3u8Text: this.responseText
                            });
                        }
                    }, { once: true });
                }

                return NetworkInterceptor.originalXhrOpen.call(this, method, url, ...args);
            };

            window.fetch = async function (...args) {
                let requestUrl = '';
                if (args[0] instanceof Request) {
                    requestUrl = args[0].url;
                } else {
                    requestUrl = String(args[0]);
                }

                if (playerManager.isInternalRequest && requestUrl.startsWith('blob:')) {
                    return NetworkInterceptor.originalFetch.apply(this, args);
                }

                const response = await NetworkInterceptor.originalFetch.apply(this, args);

                if (response.ok) {
                    const cType = response.headers.get('content-type') || '';

                    if (Utils.isM3U8(requestUrl) || cType.includes('mpegurl') || cType.includes('application/vnd.apple.mpegurl')) {
                        try {
                            const clone = response.clone();
                            const text = await clone.text();
                            if (checkM3U8(text)) {
                                context.actionLogger.log(`[NetworkInterceptor] [Fetch]${requestUrl.slice(-80)}`, CONSTANTS.LOG_TYPES.TAKEOVER_ATTEMPT);
                                coreLogic.addTakeoverCandidate({
                                    url: requestUrl,
                                    sourceName: CONSTANTS.TAKEOVER_SOURCES.NET_FETCH,
                                    m3u8Text: text
                                });
                            }
                        } catch (e) { }
                    }
                }
                return response;
            };
        }

        deactivate() {
            if (this.originalXhrOpen) XMLHttpRequest.prototype.open = this.originalXhrOpen;
            if (this.originalFetch) window.fetch = this.originalFetch;
            this.isActive = false;
        }
    };
    const PlayerHooker = new class extends BaseInterceptor {
        constructor() { super('PlayerHooker'); this.targets = ['aliplayer', 'DPlayer', 'TCPlayer', 'xgplayer', 'Chimee', 'videojs', 'player', 'jwplayer']; this.originalPlayers = {}; }
        activate(context) {
            this.isActive = true;
            this.targets.forEach(name => {
                let internalValue;
                try {
                    Object.defineProperty(window, name, {
                        configurable: true, enumerable: true,
                        set: (p) => { if (!this.originalPlayers[name]) { this.originalPlayers[name] = p; this.log(`监测到播放器库 ${name} 加载`, CONSTANTS.LOG_TYPES.HOOK); } internalValue = p; },
                        get: () => {
                            const original = this.originalPlayers[name] || internalValue;
                            if (!original) return undefined;
                            return (...args) => {
                                const src = this._extractSource(args[0]);
                                if (src) { context.coreLogic.addTakeoverCandidate({ url: src, sourceName: CONSTANTS.TAKEOVER_SOURCES.PLAYER_HOOK(name) }); return new Proxy({}, { get: (t, k) => (k in t) ? t[k] : () => {} }); }
                                return original.constructor ? Reflect.construct(original, args) : original(...args);
                            };
                        }
                    });
                } catch (e) { }
            });
        }
        deactivate() { this.isActive = false; }
        _extractSource(cfg) {
            if (!cfg) return null;
            const s = cfg.source || cfg.video?.url || cfg.url || cfg.src || cfg.file;
            if (typeof s === 'string') return s;
            if (Array.isArray(cfg.sources)) return cfg.sources.find(o => typeof o.src === 'string')?.src;
            if (Array.isArray(cfg.playlist)) return cfg.playlist[0]?.file;
            return null;
        }
    };
    const DecryptionHooker = new class extends BaseInterceptor {
        constructor() { super('DecryptionHooker'); this.originalAtob = null; this.originalDecode = null; }
        activate(context) {
            this.isActive = true;
            this.originalAtob = window.atob;
            window.atob = (...args) => {
                const res = this.originalAtob.apply(window, args);
                if (typeof res === 'string' && (Utils.isM3U8(res) || /\.(mp4|flv|webm)(\?|$)/.test(res))) {
                    this.log(`atob 发现链接`, CONSTANTS.LOG_TYPES.DECRYPTION_HOOK);
                    context.coreLogic.addTakeoverCandidate({ url: res, sourceName: CONSTANTS.TAKEOVER_SOURCES.DECRYPTION_HOOK_ATOB });
                }
                return res;
            };
            if (typeof TextDecoder !== 'undefined') {
                this.originalDecode = TextDecoder.prototype.decode;
                TextDecoder.prototype.decode = function (input, options) {
                    const res = DecryptionHooker.originalDecode.call(this, input, options);
                    if (res && res.length > 20 && res.includes('#EXTM3U')) {
                        DecryptionHooker.log(`TextDecoder 发现M3U8`, CONSTANTS.LOG_TYPES.DECRYPTION_HOOK);
                        context.coreLogic.addTakeoverCandidate({ url: 'blob:text_decoder_hook', m3u8Text: res, sourceName: 'TextDecoder劫持' });
                    }
                    return res;
                };
            }
        }
        deactivate() {
            if (this.originalAtob) window.atob = this.originalAtob;
            if (this.originalDecode) TextDecoder.prototype.decode = this.originalDecode;
            this.isActive = false;
        }
    };
    const JsonInspector = new class extends BaseInterceptor {
        constructor() {
            super('JsonInspector');
            this.originalParse = null;
            this.processedUrls = new Set();
            this.PATTERNS = {
                BLOCK: /googleads|doubleclick|syndication|adservice|criteo|taboola|favicon\.ico|blank\.mp4|empty\.mp4|\.gif|\.css|\.js|_TPL_|media=hls4A|analyt|pixel|beacon|stat|\.(jpg|jpeg|png|webp|svg|bmp|tiff|vtt|srt|ass|dfxp)(\?|$)/i,
                BAD_KEYS: /thumbnail|cover|poster|sprite|mask|icon|logo|avatar|ad_url|vast|vpaid|preroll|postroll|midroll|bumper|subtitle|caption|track|analytics|beacon|log|report|config|setting|preview|trailer|teaser|sample|snippet|intro/i,
                VIDEO_EXT: /\.(m3u8|mpd|mp4|flv|webm|mkv|avi|mov)(\?|$)/i,
                GOOD_KEYS: /^(src|url|play_?url|video_?url|stream|hls|dash|file|video|content|media|path|source)$/i
            };
        }
        activate(context) {
            this.isActive = true;
            this.originalParse = JSON.parse;
            JSON.parse = (text, reviver) => {
                const res = this.originalParse.call(JSON, text, reviver);
                if (!text || text.length < 50 || !/m3u8|mp4|flv|video|play|url|src|http/i.test(text) || Utils.isHighNoisePage()) return res;
                setTimeout(() => this._scan(res, context), 0);
                return res;
            };
        }
        deactivate() { if (this.originalParse) JSON.parse = this.originalParse; this.isActive = false; }

        _scan(obj, context) {
            const candidates = [];

            const processedObjects = new WeakSet();

            const walk = (o, depth) => {

                if (depth > 6 || !o || typeof o !== 'object' || processedObjects.has(o)) return;
                processedObjects.add(o);

                if (Array.isArray(o)) {

                    o.slice(0, 50).forEach(i => walk(i, depth + 1));
                    return;
                }
                for (const k in o) {
                    const v = o[k];
                    if (typeof v === 'string') {
                        const score = this._evaluate(k, v, o);
                        if (score >= 40) candidates.push({ url: v.trim(), score, jsonContext: o });
                    } else if (typeof v === 'object') {
                        walk(v, depth + 1);
                    }
                }
            };

            try {
                walk(obj, 0);
            } catch(e) {}

            if (candidates.length) {
                candidates.sort((a, b) => b.score - a.score).slice(0, 3).forEach(c => {
                    if (!this.processedUrls.has(c.url)) {
                        this.processedUrls.add(c.url);
                        context.coreLogic.addTakeoverCandidate({ url: c.url, sourceName: `${CONSTANTS.TAKEOVER_SOURCES.DECRYPTION_HOOK_JSON} (评分:${c.score})`, jsonContext: c.jsonContext });
                    }
                });
            }
        }
        _evaluate(key, val, parent) {
            if (val.length < 10 || this.processedUrls.has(val)) return 0;
            if (!/^(https?:|\/\/|blob:)/i.test(val) || this.PATTERNS.BLOCK.test(val) || this.PATTERNS.BAD_KEYS.test(key)) return 0;
            let score = 0;
            const isVid = this.PATTERNS.VIDEO_EXT.test(val);
            if (isVid) score += /\.m3u8|\.mpd/i.test(val) ? 80 : (/\/m3u8\/|\/hls\//i.test(val) ? 0 : 30);
            else score -= 20;
            if (this.PATTERNS.GOOD_KEYS.test(key)) score += 30;
            if (parent.type && /video|mpegURL/i.test(parent.type)) score += 30;
            if (val.includes('?') && isVid) score += 10;
            return score;
        }
    };
    const SetAttributeHooker = new class extends BaseInterceptor {
        constructor() { super('SetAttributeHooker'); this.originalSetAttribute = null; this.descriptors = new Map(); }
        activate(context) {
            this.isActive = true;
            this.originalSetAttribute = Element.prototype.setAttribute;
            const process = (el, val, type) => {
                if (typeof val === 'string' && val.startsWith('http') && el._dmzLastSrc !== val) {
                    el._dmzLastSrc = val;

                    if (!el.isConnected) return;

                    const parentLink = el.closest('a');
                    if (parentLink && parentLink.href && !parentLink.href.includes('#')) {
                        const currentUrl = window.location.href.split('#')[0].split('?')[0];
                        if (!parentLink.href.includes(currentUrl)) return;
                    }

                    if (el.muted && el.autoplay && !el.controls) return;

                    if (PageScanner.isPreRollAdByPathFeatures(val, context)) return;

                    this.log(`捕获〈${el.tagName}〉Src设置(${type})`, CONSTANTS.LOG_TYPES.DECRYPTION_HOOK);
                    context.coreLogic.addTakeoverCandidate({ url: val, sourceName: `${CONSTANTS.TAKEOVER_SOURCES.DECRYPTION_HOOK_ATTR} (${type})`, mediaElement: el.tagName === 'SOURCE' ? el.parentElement : el });
                }
            };
            Element.prototype.setAttribute = function (name, value) {
                if (/^(VIDEO|AUDIO|SOURCE)$/.test(this.tagName) && name.toLowerCase() === 'src') process(this, value, 'Attribute');
                return SetAttributeHooker.originalSetAttribute.apply(this, arguments);
            };
            const hook = (proto) => {
                const desc = Object.getOwnPropertyDescriptor(proto, 'src');
                if (desc?.set) {
                    this.descriptors.set(proto, desc);
                    Object.defineProperty(proto, 'src', { configurable: true, enumerable: true, get: desc.get, set: function(v) { process(this, v, 'Prop'); desc.set.call(this, v); } });
                }
            };
            hook(HTMLMediaElement.prototype); hook(HTMLSourceElement.prototype);
        }
        deactivate() {
            if (this.originalSetAttribute) Element.prototype.setAttribute = this.originalSetAttribute;
            this.descriptors.forEach((d, p) => Object.defineProperty(p, 'src', d));
            this.descriptors.clear();
            this.isActive = false;
        }
    };
    const SCANNER_RULES = {
        KEYWORDS: [
            { p: /(preview|trailer|teaser|snippet|sample|intro|opening|ending|partner|advert|background|banner|cover|thumb|poster|sprite|animation|loop|web_preview|short_video|biometric|guide|instruction)/i, s: 50 },
            { p: /(_|\-)(pv|ad|short)(_|\-|$|\.)/i, s: 40 }, { p: /(demo|try)=\d+/i, s: 40 }, { p: /(limit|start|end)=(?!1\b)\d{1,7}(?!\d)/i, s: 40 },
            { p: /\/ads?([\/\.&\?#]|$)/i, s: 50 }, { p: /advert|preroll|promo|sponsor|vast|vpaid/i, s: 40 }, { p: /\.gif|gif\./i, s: 60 }
        ],
        PARAMS: [ { p: /^ad_|^utm_|^gclid$/i, s: 30 }, { p: /campaign|creative|impression/i, s: 20 }, { p: /watermark|logo/i, s: 15 } ],
        LOW_RES: [ { p: /\/(\d+)x(\d+)\./, max: 230400, s: 30 }, { p: /_(\d{1,3})\.(mp4|ts|flv)/i, max: 240, s: 30 }, { p: /(_|\-)(360p|480p|540p|sd)(_|\-|\.|$)/i, s: 25 } ],
        BLOCK_DOMAINS: [ /doubleclick\.net|googlesyndication\.com|adservice\.google/i, /vp\.externulls\.com/i ]
    };
    class PageScanner {
        static get RULES() { return SCANNER_RULES; }
        static log(ctx, msg, type = CONSTANTS.LOG_TYPES.SCAN) { ctx.actionLogger.log(msg, type); }
        static scanForFlashvars(ctx) {
            if (Utils.isHighNoisePage()) return;
            try {
                const s = Array.from(document.querySelectorAll('script')).find(s => s.textContent.includes('var flashvars_'));
                const m = s && s.textContent.match(/var\s+flashvars_\d+\s*=\s*({[\s\S]*?});/);
                if (m) {
                    const data = JSON.parse(m[1]);
                    if (data.mediaDefinitions) {
                        let best = null;
                        data.mediaDefinitions.forEach(d => { if (d.videoUrl && parseInt(d.quality) > (best ? parseInt(best.quality) : -1)) best = d; });
                        if (best) {
                            this.log(ctx, `Flashvars 发现源: ${best.quality}p`, CONSTANTS.LOG_TYPES.TAKEOVER_SUCCESS);
                            ctx.coreLogic.addTakeoverCandidate({ url: best.videoUrl, sourceName: '页面数据扫描(flashvars)' });
                        }
                    }
                }
            } catch (e) { }
        }
        static scanForEmbeddedData(ctx) {
            if (Utils.isHighNoisePage()) return;
            const patterns = [/(?:'|")\w*(?:url|source|src)(?:'|")\s*:\s*(?:'|")([^'"]+\.(?:mp4|m3u8)[^'"]*)(?:'|")/gi, /['"](https?:\/\/[^'"]+\.(?:mp4|m3u8)[^'"]*)['"]/gi];
            try {
                Array.from(document.querySelectorAll('script:not([src])')).some(s => {
                    const txt = s.textContent.slice(0, 50000);
                    if (txt.length < 200) return false;
                    for (const p of patterns) {
                        let m;
                        while ((m = p.exec(txt)) !== null) {
                            const u = m[1].includes('\\u') ? m[1].replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\/g, '') : m[1].replace(/\\/g, '');
                            if (!this.isPreRollAdByPathFeatures(u, ctx)) {
                                this.log(ctx, `嵌入式扫描发现源`, CONSTANTS.LOG_TYPES.TAKEOVER_SUCCESS);
                                ctx.coreLogic.addTakeoverCandidate({ url: u, sourceName: '页面数据扫描(嵌入式)' });
                                return true;
                            }
                        }
                    }
                });
            } catch (e) { }
        }
        static isPreRollAdByPathFeatures(url, ctx) {
            if (typeof url !== 'string' || !url) return false;
            if (url.includes('.m3u8') && !/(preview|trailer|teaser|advert|promo|snippet)/i.test(url)) return false;
            if (/(preview|trailer|teaser|snippet|timeline|thumbnails?|sprite|vtt)/i.test(url)) return true;
            const path = window.location.pathname.toLowerCase();
            if (/(^|\/)(auth|login|signin|account|dashboard|member|profile|settings)($|\/|\.|_)/i.test(path) && !/(play|video|watch|detail|view)/i.test(path)) return true;
            let score = 0;
            SCANNER_RULES.KEYWORDS.forEach(r => { if (r.p.test(url)) score += r.s; });
            if (score >= 25) {
                this.log(ctx, `URL判定为广告(关键词). Score:${score}. URL:${url.slice(-50)}`, CONSTANTS.LOG_TYPES.SCAN_WARN); 
                return true;
            }
            if (url.includes('ipa=') && /(rst|t)=\d+k/.test(url)) return true;
            if (SCANNER_RULES.BLOCK_DOMAINS.some(r => r.test(url))) return true;
            try {
                const u = new URL(url, window.location.href);
                const segs = u.pathname.split('/').filter(Boolean);
                SCANNER_RULES.LOW_RES.forEach(r => {
                    const m = url.match(r.p);
                    if (m) {
                        const val = m.length > 2 ? (parseInt(m[1]) * parseInt(m[2])) : parseInt(m[1]);
                        if (val < r.max) score += r.s;
                    }
                });
                if (u.searchParams.size > 8) score += 10;
                segs.forEach(s => { if (s.length > 50 && /^[a-zA-Z0-9]+$/.test(s)) score += 5; });
                u.searchParams.forEach((v, k) => { SCANNER_RULES.PARAMS.forEach(r => { if (r.p.test(k)) score += r.s; }); });
                if (score >= 25) {
                    this.log(ctx, `URL判定为广告(结构). Score:${score}. URL:${url.slice(-50)}`, CONSTANTS.LOG_TYPES.SCAN_WARN); 
                    return true;
                }
            } catch (e) { }
            return false;
        }
    }
    const MANAGED_MODULES = [
        { module: PlayerHooker, configKey: 'enablePlayerTakeover' }, { module: NetworkInterceptor, configKey: 'enableNetworkInterceptor' },
        { module: DecryptionHooker, configKey: 'enableDecryptionHook' }, { module: JsonInspector, configKey: 'enableJsonInspector' },
        { module: SetAttributeHooker, configKey: 'enableSetAttributeHooker' }
    ];

    (async function main() {
        const actionLogger = new ActionLogger();
        const context = { actionLogger };
        Object.assign(context, {
            diagnosticsTool: new DiagnosticsTool(context), settingsManager: new SettingsManager(context), frameCommunicator: new FrameCommunicator(context),
            styleManager: new StyleManager(context), playerManager: new PlayerManager(context), coreLogic: new CoreLogic(context),
            spaNavigator: new SPANavigator(context), domScanner: new DOMScanner(context), settingsUI: new SettingsUI(context),
            infoPanelManager: new InfoPanelManager(context), unifiedPanelManager: new UnifiedPanelManager(context), iframeTerminator: new IframeTerminator(context)
        });
        actionLogger.setContext(context);
        window.diagnosticsTool = context.diagnosticsTool;
        context.diagnosticsTool.init();
        context.iframeTerminator.start();
        await context.settingsManager.load();
        const hostname = window.location.hostname;
        if (context.settingsManager.config.blacklist.some(d => { try { return Utils.wildcardToRegex(d.trim()).test(hostname); } catch (e) { return false; } })) {
            context.actionLogger.log(`黑名单匹配，已在 ${hostname} 停用。`, CONSTANTS.LOG_TYPES.INIT); context.iframeTerminator.stop(); return;
        }
        if (CONSTANTS.IS_TOP_FRAME) {
            context.unifiedPanelManager.initGesture();
            if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand(`📊 ${CONSTANTS.SCRIPT_NAME} 诊断与设置`, () => context.unifiedPanelManager.show());
            context.spaNavigator.init();
            context.coreLogic.initializeUserIntentObserver();
        }
        let isSleeping = false;
        if (CONSTANTS.IS_TOP_FRAME) {
            const noise = Utils.isHighNoisePage();
            if (noise) {
                context.actionLogger.log(`页面评分低[${noise}]，待机。`, CONSTANTS.LOG_TYPES.INIT);
                context.domScanner.isStopped = context.coreLogic.isSystemHalted = isSleeping = true;
            } else context.actionLogger.log(`页面评分达标，全速激活！`, CONSTANTS.LOG_TYPES.INIT);
        }
        console.log(`[${CONSTANTS.SCRIPT_NAME}] v${CONSTANTS.SCRIPT_VERSION} 激活 @ ${window.location.href}`);
        context.frameCommunicator.init();
        EventBus.on('CONFIG_UPDATED', ({ newConfig }) => MANAGED_MODULES.forEach(({ module, configKey }) => newConfig[configKey] ? module.enable(context) : module.disable(context)));
        if (!isSleeping) {
            if (CONSTANTS.IS_TOP_FRAME) {
                context.coreLogic.sandboxManager.startCountdown();
                const scan = () => { PageScanner.scanForFlashvars(context); PageScanner.scanForEmbeddedData(context); };
                document.readyState === 'loading' ? window.addEventListener('DOMContentLoaded', scan, { once: true }) : scan();
            }
            MANAGED_MODULES.forEach(({ module, configKey }) => { if (context.settingsManager.config[configKey]) module.enable(context); });
        }
        if (!CONSTANTS.IS_TOP_FRAME) setTimeout(() => context.frameCommunicator.postToTopFrame({ type: CONSTANTS.MESSAGE_TYPES.QUERY_IS_MAIN_PLAYER }), 100);
        document.readyState === 'loading' ? window.addEventListener('DOMContentLoaded', () => context.domScanner.init(), { once: true }) : context.domScanner.init();
        const origOpen = window.open;
        window.open = function (...args) {
            if (context.playerManager.isPlayerActiveOrInitializing || (typeof args[0] === 'string' && /(ads?|tracker|analytics)/i.test(args[0]))) return null;
            return origOpen.apply(window, args);
        };
        document.addEventListener('click', e => {
            const t = e.target.closest('a');
            if (t?.target === '_blank') { const v = document.querySelector('video, iframe'); if (v && (v.contains(t) || t.contains(v))) { e.preventDefault(); e.stopPropagation(); } }
        }, true);
        startHeuristicBootstrap(context);
    })().catch(e => console.error(`[${CONSTANTS.SCRIPT_NAME}] Fatal:`, e));

    function startHeuristicBootstrap(ctx) {
        let simClickCount = 0;
        let simClickTimer = setInterval(() => {

            if (ctx.coreLogic.isSystemHalted || ctx.domScanner.isStopped || simClickCount++ > 300) {
                if (simClickCount > 300) clearInterval(simClickTimer);
                return;
            }

            const pm = ctx.playerManager;

            const isScriptVisible = pm.hostElement && pm.hostElement.classList.contains('dmz-visible');

            let isListingPage = false;
            const mainVideo = document.querySelector('video');
            if (!mainVideo) {
                if (document.querySelectorAll('a > img').length > 8) isListingPage = true;
            } else {
                const r = mainVideo.getBoundingClientRect();
                if (r.width < 150 || r.height < 100) isListingPage = true;
            }
            if (isListingPage) {
                const s = window.location.href + document.title;
                if (!/(movie|video|play|watch|vod|film|anime|drama|episode|scene|jav|porn)/i.test(s)) return;
            }

            const videos = document.querySelectorAll('video');
            videos.forEach(v => {
                if (v.id === 'dmz-custom-player') return;
                if (v.dataset.dmzNeutralized) return;
                if (v.paused && !isListingPage) {
                    try { v.muted = true; v.play().catch(() => {}); } catch(e) {}
                }
            });

            const targets = [
                document.querySelector('.fp-ui'),
                document.querySelector('.jw-video'),
                document.querySelector('.vjs-big-play-button'),
                document.querySelector('.plyr__control--overlaid'),
                document.querySelector('.art-control-play'),
                document.querySelector('.dplayer-mobile-play'),
                document.querySelector('.play-button'),
                document.querySelector('div[class*="play"]'),
                document.querySelector('button[class*="play"]')
            ].filter(el => el && el.offsetParent !== null);
            targets.forEach(el => {
                const attrStr = (el.id + ' ' + el.className + ' ' + (el.getAttribute('aria-label') || '')).toLowerCase();
                if (/(translate|comment|reply|submit|login|signup)/.test(attrStr)) return;

                const parentLink = el.closest('a');
                if (parentLink && parentLink.href && !parentLink.href.includes('javascript')) {
                    const containsVideo = parentLink.querySelector('video');
                    if (!containsVideo) return;
                }

                const rect = el.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(evtType => {
                    try {
                        el.dispatchEvent(new MouseEvent(evtType, {
                            bubbles: true,
                            cancelable: true,
                            view: window,
                            clientX: centerX,
                            clientY: centerY
                        }));
                    } catch(e) {}
                });
                try { el.click(); } catch(e) {}
            });
        }, 1500);
    }
})();
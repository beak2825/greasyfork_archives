// ==UserScript==
// @name         发送到115 (悬浮窗版 - 手动配置)
// @author       yancj (重构 by AI Engineer)
// @version      9.9.9
// @icon         https://115.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/408466
// @description  115离线下载功能，重构为统一的悬浮窗交互，并支持手动配置UserID和Cookie，增强稳定性。新增手动输入离线链接功能。
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/398240-gm-config-zh-cn/code/GM_config_zh-CN.js
// @require      https://greasyfork.org/scripts/412267-base64-v1-0/code/base64_v10.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @resource     toastrCss   https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css
// @match        http*://*/*
// @match        http*://*.115.com/*
// @exclude      http*://*.115.com/bridge*
// @exclude      http*://*.115.com/*/static*
// @exclude      http*://*.baidu.com/*
// @exclude      http*://*.iqiyi.com/*
// @exclude      http*://*.qq.com/*
// @exclude      http*://*.youku.com/*
// @exclude      http*://*.bilibili.com/
// @exclude      http*://*.pptv.com/*
// @exclude      http*://*.fun.tv/*
// @exclude      http*://*.sohu.com/*
// @exclude      http*://*.le.com/*
// @exclude      http*://*.tudou.com/*
// @exclude      http*://*.bilibili.com/*
// @exclude      http*://music.163.com/*
// @exclude      http*://github.com/*
// @exclude      http*://gitee.com/*
// @exclude      http*://btcache.me/*
// @exclude      http*://*.jd.com/*
// @exclude      http*://*.taobao.com/*
// @exclude      http*://*.tmall.com/*
// @exclude      http*://*.vip.com/*
// @exclude      http*://*.pinduoduo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      115.com
// @connect      *
// @grant        unsafeWindow
// @grant        window.open
// @grant        window.close
// @run-at       document-start
// @compatible   chrome
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/558007/%E5%8F%91%E9%80%81%E5%88%B0115%20%28%E6%82%AC%E6%B5%AE%E7%AA%97%E7%89%88%20-%20%E6%89%8B%E5%8A%A8%E9%85%8D%E7%BD%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558007/%E5%8F%91%E9%80%81%E5%88%B0115%20%28%E6%82%AC%E6%B5%AE%E7%AA%97%E7%89%88%20-%20%E6%89%8B%E5%8A%A8%E9%85%8D%E7%BD%AE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var newVersion = 'v8.1.4'; // 版本号更新

    if (typeof GM_config == 'undefined') {
        alert('115优化大师：\n网络异常，相关库文件加载失败，脚本无法使用，请刷新网页重新加载！');
        return;
    }

    // 配置界面
    function config() {
        // 简化的CSS样式 - 只美化外观，不破坏功能
        var windowCss = `
            #Cfg {
                border-radius: 12px !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            }
            #Cfg .config_header {
                background: linear-gradient(135deg, #f0f6ff 0%, #e3f0ff 100%) !important;
                color: #2c6fbb !important;
                font-weight: 600 !important;
                border-bottom: 2px solid #2c6fbb !important;
            }
            #Cfg .section_header {
                color: #2c6fbb !important;
                border-bottom: 2px solid #2c6fbb !important;
            }
            #Cfg .config_var input[type="text"],
            #Cfg .config_var textarea {
                border-radius: 6px !important;
                border: 1px solid #ddd !important;
            }
            #Cfg .config_var input[type="text"]:focus,
            #Cfg .config_var textarea:focus {
                border-color: #2c6fbb !important;
                box-shadow: 0 0 0 3px rgba(44, 111, 187, 0.1) !important;
            }
            #Cfg_saveBtn {
                background: linear-gradient(145deg, #3a8dff, #2c6fbb) !important;
                color: white !important;
                border: none !important;
                border-radius: 6px !important;
                padding: 8px 20px !important;
                font-weight: 600 !important;
            }
            #Cfg_saveBtn:hover {
                opacity: 0.9 !important;
            }
        `;
        
        GM_registerMenuCommand('设置', () => GM_config.open());
        // 添加菜单命令：手动输入链接离线
        GM_registerMenuCommand('手动输入链接离线', showManualInputModal);

        // [v8.1.3] 恢复完整的配置项
        GM_config.init({
            id: 'Cfg', title: `115优化大师 ${newVersion}`, isTabs: true, skin: 'tab',
            css: windowCss, frameStyle: { height: '550px', width: '445px', zIndex: '2147483648' },
            fields: {
                offline_Down: { section: ['离线升级', ''], label: '启用悬浮窗一键离线', type: 'checkbox', default: true, },
                offline_result: { label: '任务添加后显示离线结果', type: 'checkbox', default: true },
                open_List: { label: '离线后自动打开任务列表', type: 'checkbox', default: false },
                open_search: { label: '离线成功后开启视频搜索', type: 'checkbox', default: true, line: 'start' },
                search_result: { label: '显示视频搜索结果', type: 'checkbox', default: true },
                open_Popup: { label: '搜到视频自动播放', type: 'checkbox', default: false, line: 'end' },
                fuzzy_find: { label: '启用下载地址模糊匹配', type: 'checkbox', default: false },
                folder_config: {
                    section: ['自定义文件夹', '可配置多个离线下载目标文件夹'],
                    label: '文件夹配置 (格式: 别名=CID)',
                    type: 'textarea',
                    default: '默认=0',
                    title: '每行一条记录，格式为"别名=CID值"。\n例如：\n电影=1234567890123456789\n剧集=9876543210987654321',
                    css: 'width: 95%; height: 120px;'
                },
                manual_credential: { section: ['手动身份凭证', '如果自动获取凭证失效，请在此手动配置'], label: '启用手动配置凭证', labelPos: 'right', type: 'checkbox', default: false, title: '勾选后，脚本将使用下方填写的UserID和Cookie，推荐使用此方式。' },
                manualUserID: { label: '115 UserID', type: 'text', default: '', title: '请填写您的115数字ID' },
                manualCookie: { label: '115 Cookie', type: 'textarea', default: '', title: '请填入完整的115登录Cookie' },
                credential_help: { label: '如何获取凭证？', type: 'button', click: function() { alert('1. 登录115网盘。\n2. 按F12打开开发者工具，切换到【网络(Network)】标签。\n3. 刷新页面或随便点击一个文件夹。\n4. 在网络请求列表中，找到任意一个发往 115.com 的请求，点击它。\n5. 在右侧出现的【标头(Headers)】面板中，向下滚动到【请求标头(Request Headers)】区域。\n6. UserID通常可以在Cookie值中找到(如`USER_ID=...;`)，或者在页面源代码中搜索`USER_ID`。\n7. 完整的Cookie值，请直接复制`Cookie:`后面的所有文本。'); } },
            },
            events: {
                save: function() { GM_config.close(); location.reload(); }
            },
        });
    }
    config();

    // ================================================================
    // 全局变量
    // ================================================================
    var G = GM_config;
    var localHref = window.location.href, show_result = G.get('offline_result'), down_reg = /^(magnet|thunder|ftp|ed2k):/i;
    var UA = navigator.userAgent, sign_url = 'http://115.com/?ct=offline&ac=space', add_urls = 'http://115.com/web/lixian/?ct=lixian&ac=add_task_urls';
    var lists_url = 'http://115.com/web/lixian/?ct=lixian&ac=task_lists', a_list = `<br><a target="_blank" class="openList" href="javascript:void(0);" style="color:blue;" title="点击打开离线链接任务列表">打开任务列表</a>`;
    var detectedLinks = [], $fab, $modal;

    // ================================================================
    // 所有函数定义 (确保在使用前定义)
    // ================================================================

    function loadGMConfigStyles() {
        GM_addStyle(`
            /* Modern Theme Variables */
            :root {
                --primary-color: #2c6fbb;
                --primary-color-light: #f0f6ff;
                --background-color: #ffffff;
                --text-color: #333;
                --secondary-text-color: #555;
                --border-color: #e0e0e0;
                --shadow-color: rgba(44, 111, 187, 0.2);
                --success-color: #4caf50;
                --error-color: #f44336;
            }

            /* ========================================
               GM_Config 现代化样式 - 与界面2统一
               ======================================== */
            #Cfg {
                border-radius: 16px !important;
                overflow: hidden !important;
                border: none !important;
                box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: var(--background-color) !important;
            }
            
            /* 标题栏 - 与界面2保持一致 */
            #Cfg .config_header {
                background-color: var(--primary-color-light) !important;
                color: var(--primary-color) !important;
                padding: 20px 30px !important;
                font-size: 22px !important;
                font-weight: 700 !important;
                text-align: left !important;
                border-bottom: 1px solid var(--border-color) !important;
            }
            
            /* 标签页容器 */
            #Cfg .tab-container {
                background-color: #fafafa !important;
                padding: 10px 20px 0 20px !important;
                border-bottom: 1px solid var(--border-color);
            }
            
            /* 标签页按钮 */
            #Cfg .tab {
                border: none !important;
                background-color: transparent !important;
                padding: 12px 20px !important;
                font-size: 15px !important;
                color: var(--secondary-text-color) !important;
                border-radius: 10px 10px 0 0 !important;
                transition: all 0.2s ease;
                position: relative;
                bottom: -1px;
                cursor: pointer;
                font-weight: 500;
            }
            #Cfg .tab:hover {
                background-color: rgba(44, 111, 187, 0.05) !important;
                color: var(--primary-color) !important;
            }
            #Cfg .tab[selected='true'] {
                background-color: var(--background-color) !important;
                color: var(--primary-color) !important;
                font-weight: 700 !important;
                border-top: 2px solid var(--primary-color) !important;
                border-left: 1px solid var(--border-color) !important;
                border-right: 1px solid var(--border-color) !important;
            }
            
            /* 配置项容器 */
            #Cfg .config_var {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 20px;
                align-items: center;
                padding: 18px 30px;
                border-bottom: 1px solid #f5f5f5;
                transition: background-color 0.2s;
            }
            #Cfg .config_var:hover {
                background-color: var(--primary-color-light);
            }
            #Cfg .config_var:last-of-type { border-bottom: none; }
            
            /* 分组标题 */
            #Cfg .section_header_div {
                grid-column: 1 / -1;
                border-bottom: none;
                padding: 25px 30px 10px 30px;
                margin-top: 10px;
            }
            #Cfg .section_header_div:first-child {
                margin-top: 0;
                padding-top: 20px;
            }
            #Cfg .section_header {
                font-size: 18px;
                font-weight: 700;
                color: var(--primary-color);
                margin: 0;
                padding-bottom: 12px;
                border-bottom: 2px solid var(--primary-color);
                display: inline-block;
            }
            #Cfg .section_desc {
                font-size: 13px;
                color: var(--secondary-text-color);
                margin-top: 8px;
                line-height: 1.5;
            }
            
            /* 标签文本 */
            #Cfg .config_var .field_label {
                font-weight: 600;
                font-size: 15px;
                color: var(--text-color);
                line-height: 1.5;
            }
            
            /* 输入框和文本域 */
            #Cfg .config_var input[type="text"],
            #Cfg .config_var textarea {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 15px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                font-size: 15px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                transition: all 0.2s ease;
                background-color: white;
            }
            #Cfg .config_var input[type="text"]:hover,
            #Cfg .config_var textarea:hover {
                border-color: #bbb;
            }
            #Cfg .config_var input[type="text"]:focus,
            #Cfg .config_var textarea:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 4px var(--shadow-color);
            }
            #Cfg .config_var textarea {
                height: 120px;
                resize: vertical;
                line-height: 1.6;
            }

            /* 复选框开关样式 */
            #Cfg .config_var input[type="checkbox"] {
                height: 0;
                width: 0;
                visibility: hidden;
                position: absolute;
            }
            #Cfg .config_var label[for] {
                position: relative;
                cursor: pointer;
                padding-left: 60px;
                line-height: 26px;
                display: inline-block;
                user-select: none;
            }
            #Cfg .config_var label[for]::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 48px;
                height: 26px;
                border-radius: 13px;
                background: #ddd;
                transition: background-color 0.3s ease;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            }
            #Cfg .config_var label[for]::after {
                content: '';
                position: absolute;
                left: 3px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            #Cfg .config_var input[type="checkbox"]:checked + label::before {
                background: linear-gradient(145deg, #3a8dff, #2c6fbb);
            }
            #Cfg .config_var input[type="checkbox"]:checked + label::after {
                transform: translate(22px, -50%);
            }
            
            /* 按钮样式 */
            #Cfg .config_var button {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 20px;
                height: 44px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 600;
                transition: all 0.2s ease;
                background-color: #f5f5f5;
                color: var(--text-color);
            }
            #Cfg .config_var button:hover {
                background-color: #e8e8e8;
                border-color: #bbb;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            /* 底部按钮区域 */
            #Cfg #Cfg_buttons_holder {
                padding: 20px 30px;
                border-top: 1px solid var(--border-color);
                background-color: #f9f9f9;
                text-align: right;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }
            #Cfg #Cfg_saveBtn,
            #Cfg #Cfg_closeBtn {
                padding: 0 24px;
                height: 44px;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
            }
            #Cfg #Cfg_saveBtn {
                background: linear-gradient(145deg, #3a8dff, #2c6fbb);
                color: white;
                box-shadow: 0 4px 10px var(--shadow-color);
            }
            #Cfg #Cfg_saveBtn:hover {
                opacity: 0.9;
                box-shadow: 0 6px 15px var(--shadow-color);
                transform: translateY(-2px);
            }
            #Cfg #Cfg_closeBtn {
                background-color: #f0f0f0;
                color: var(--text-color);
            }
            #Cfg #Cfg_closeBtn:hover {
                background-color: #e0e0e0;
            }
        `);
    }

    function addNewUIStyles() {
        GM_addStyle(`
            /* Modern Theme */
            :root {
                --primary-color: #2c6fbb;
                --primary-color-light: #f0f6ff;
                --background-color: #ffffff;
                --text-color: #333;
                --secondary-text-color: #555;
                --border-color: #e0e0e0;
                --shadow-color: rgba(44, 111, 187, 0.2);
                --success-color: #4caf50;
                --error-color: #f44336;
            }

            /* Floating Action Button */
            .s115-fab {
                position: fixed; bottom: 40px; right: 40px;
                width: 56px; height: 56px;
                background: linear-gradient(145deg, #3a8dff, #2c6fbb);
                border-radius: 50%;
                display: none;
                justify-content: center; align-items: center;
                cursor: pointer;
                box-shadow: 0 8px 25px var(--shadow-color);
                z-index: 2147483640;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                color: white;
                font-size: 22px;
                font-weight: bold;
                border: none;
            }
            .s115-fab:hover { transform: scale(1.1) rotate(15deg); box-shadow: 0 12px 30px var(--shadow-color); }

            /* Modal Styles */
            .s115-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 2147483641;
                display: none;
                justify-content: center; align-items: center;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

            .s115-modal-window {
                background-color: var(--background-color);
                width: 90%; max-width: 700px; max-height: 90vh;
                border-radius: 16px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.15);
                display: flex; flex-direction: column;
                overflow: hidden;
                transform: scale(0.95);
                animation: zoomIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
            }
            @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

            .s115-modal-header {
                padding: 20px 30px;
                font-size: 22px; font-weight: 700;
                color: var(--primary-color);
                border-bottom: 1px solid var(--border-color);
                display: flex; justify-content: space-between; align-items: center;
                background-color: var(--primary-color-light);
            }
            #s115-close-modal {
                background: none; border: none; font-size: 30px;
                color: #aaa; cursor: pointer;
                padding: 0; line-height: 1;
                transition: all 0.2s;
            }
            #s115-close-modal:hover { color: var(--text-color); transform: rotate(90deg); }

            .s115-modal-content { padding: 10px 30px; overflow-y: auto; flex-grow: 1; }
            .s115-modal-content ul { list-style: none; padding: 0; margin: 0; }
            .s115-modal-content li {
                display: flex; align-items: center;
                padding: 15px 5px;
                border-bottom: 1px solid #f0f0f0;
                transition: background-color 0.2s;
            }
            .s115-modal-content li:last-child { border-bottom: none; }
            .s115-modal-content li:hover { background-color: var(--primary-color-light); border-radius: 8px; }

            .s115-modal-content input[type="checkbox"] {
                margin-right: 20px;
                min-width: 20px; height: 20px;
                accent-color: var(--primary-color);
                cursor: pointer;
            }
            .s115-modal-content span { word-break: break-all; color: var(--text-color); font-size: 15px; }

            .s115-modal-footer {
                padding: 20px 30px;
                border-top: 1px solid var(--border-color);
                background-color: #f9f9f9;
                display: flex; justify-content: space-between; align-items: center;
                gap: 16px;
            }

            /* General Button & Select Styles */
            .s115-modal-footer button, #Cfg .config_var button, #s115-folder-select {
                padding: 0 20px;
                height: 44px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 600;
                transition: all 0.2s ease;
            }
            #s115-folder-select { background-color: white; }
            #s115-folder-select:focus, #Cfg .config_var input[type="text"]:focus, #Cfg .config_var textarea:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 4px var(--shadow-color);
            }
            .s115-btn-primary, #Cfg #Cfg_saveBtn {
                background: linear-gradient(145deg, #3a8dff, #2c6fbb);
                color: white;
                border: none;
                box-shadow: 0 4px 10px var(--shadow-color);
            }
            .s115-btn-primary:hover, #Cfg #Cfg_saveBtn:hover {
                opacity: 0.9;
                box-shadow: 0 6px 15px var(--shadow-color);
                transform: translateY(-2px);
            }
            .s115-modal-footer button:not(.s115-btn-primary) {
                background-color: #f0f0f0;
                color: var(--text-color);
            }
            .s115-modal-footer button:not(.s115-btn-primary):hover { background-color: #e0e0e0; }

            /* ========================================
               GM_Config 现代化样式 - 与界面2统一
               ======================================== */
            #Cfg {
                border-radius: 16px !important;
                overflow: hidden !important;
                border: none !important;
                box-shadow: 0 15px 40px rgba(0,0,0,0.15) !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: var(--background-color) !important;
            }
            
            /* 标题栏 - 与界面2保持一致 */
            #Cfg .config_header {
                background-color: var(--primary-color-light) !important;
                color: var(--primary-color) !important;
                padding: 20px 30px !important;
                font-size: 22px !important;
                font-weight: 700 !important;
                text-align: left !important;
                border-bottom: 1px solid var(--border-color) !important;
            }
            
            /* 标签页容器 */
            #Cfg .tab-container {
                background-color: #fafafa !important;
                padding: 10px 20px 0 20px !important;
                border-bottom: 1px solid var(--border-color);
            }
            
            /* 标签页按钮 */
            #Cfg .tab {
                border: none !important;
                background-color: transparent !important;
                padding: 12px 20px !important;
                font-size: 15px !important;
                color: var(--secondary-text-color) !important;
                border-radius: 10px 10px 0 0 !important;
                transition: all 0.2s ease;
                position: relative;
                bottom: -1px;
                cursor: pointer;
                font-weight: 500;
            }
            #Cfg .tab:hover {
                background-color: rgba(44, 111, 187, 0.05) !important;
                color: var(--primary-color) !important;
            }
            #Cfg .tab[selected='true'] {
                background-color: var(--background-color) !important;
                color: var(--primary-color) !important;
                font-weight: 700 !important;
                border-top: 2px solid var(--primary-color) !important;
                border-left: 1px solid var(--border-color) !important;
                border-right: 1px solid var(--border-color) !important;
            }
            
            /* 配置项容器 */
            #Cfg .config_var {
                display: grid;
                grid-template-columns: 200px 1fr;
                gap: 20px;
                align-items: center;
                padding: 18px 30px;
                border-bottom: 1px solid #f5f5f5;
                transition: background-color 0.2s;
            }
            #Cfg .config_var:hover {
                background-color: var(--primary-color-light);
            }
            #Cfg .config_var:last-of-type { border-bottom: none; }
            
            /* 分组标题 */
            #Cfg .section_header_div {
                grid-column: 1 / -1;
                border-bottom: none;
                padding: 25px 30px 10px 30px;
                margin-top: 10px;
            }
            #Cfg .section_header_div:first-child {
                margin-top: 0;
                padding-top: 20px;
            }
            #Cfg .section_header {
                font-size: 18px;
                font-weight: 700;
                color: var(--primary-color);
                margin: 0;
                padding-bottom: 12px;
                border-bottom: 2px solid var(--primary-color);
                display: inline-block;
            }
            #Cfg .section_desc {
                font-size: 13px;
                color: var(--secondary-text-color);
                margin-top: 8px;
                line-height: 1.5;
            }
            
            /* 标签文本 */
            #Cfg .config_var .field_label {
                font-weight: 600;
                font-size: 15px;
                color: var(--text-color);
                line-height: 1.5;
            }
            
            /* 输入框和文本域 */
            #Cfg .config_var input[type="text"],
            #Cfg .config_var textarea {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 15px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                font-size: 15px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                transition: all 0.2s ease;
                background-color: white;
            }
            #Cfg .config_var input[type="text"]:hover,
            #Cfg .config_var textarea:hover {
                border-color: #bbb;
            }
            #Cfg .config_var textarea {
                height: 120px;
                resize: vertical;
                line-height: 1.6;
            }

            /* 复选框开关样式 */
            #Cfg .config_var input[type="checkbox"] {
                height: 0;
                width: 0;
                visibility: hidden;
                position: absolute;
            }
            #Cfg .config_var label[for] {
                position: relative;
                cursor: pointer;
                padding-left: 60px;
                line-height: 26px;
                display: inline-block;
                user-select: none;
            }
            #Cfg .config_var label[for]::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 48px;
                height: 26px;
                border-radius: 13px;
                background: #ddd;
                transition: background-color 0.3s ease;
                box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
            }
            #Cfg .config_var label[for]::after {
                content: '';
                position: absolute;
                left: 3px;
                top: 50%;
                transform: translateY(-50%);
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            #Cfg .config_var input[type="checkbox"]:checked + label::before {
                background: linear-gradient(145deg, #3a8dff, #2c6fbb);
            }
            #Cfg .config_var input[type="checkbox"]:checked + label::after {
                transform: translate(22px, -50%);
            }
            
            /* 按钮样式 */
            #Cfg .config_var button {
                width: 100%;
                box-sizing: border-box;
                padding: 12px 20px;
                height: 44px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 600;
                transition: all 0.2s ease;
                background-color: #f5f5f5;
                color: var(--text-color);
            }
            #Cfg .config_var button:hover {
                background-color: #e8e8e8;
                border-color: #bbb;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            /* 底部按钮区域 */
            #Cfg #Cfg_buttons_holder {
                padding: 20px 30px;
                border-top: 1px solid var(--border-color);
                background-color: #f9f9f9;
                text-align: right;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }
            #Cfg #Cfg_saveBtn,
            #Cfg #Cfg_closeBtn {
                padding: 0 24px;
                height: 44px;
                border-radius: 10px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                border: none;
            }
            #Cfg #Cfg_closeBtn {
                background-color: #f0f0f0;
                color: var(--text-color);
            }
            #Cfg #Cfg_closeBtn:hover {
                background-color: #e0e0e0;
            }

            /* ========================================
               手动输入链接模态框 - 与界面2统一
               ======================================== */
            .s115-manual-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 2147483643;
                display: none;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease;
            }
            
            .s115-manual-modal-window {
                background-color: var(--background-color);
                width: 90%;
                max-width: 600px;
                max-height: 85vh;
                border-radius: 16px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.95);
                animation: zoomIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
            }
            
            /* 标题栏 - 与界面2保持一致的蓝色风格 */
            .s115-manual-modal-header {
                padding: 20px 30px;
                font-size: 22px;
                font-weight: 700;
                color: var(--primary-color);
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: var(--primary-color-light);
            }
            
            #s115-manual-close-modal {
                background: none;
                border: none;
                font-size: 30px;
                color: #aaa;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                transition: all 0.2s;
            }
            #s115-manual-close-modal:hover {
                color: var(--text-color);
                transform: rotate(90deg);
            }
            
            /* 内容区域 */
            .s115-manual-modal-content {
                padding: 25px 30px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                overflow-y: auto;
                flex-grow: 1;
            }
            
            .s115-manual-input-label {
                font-size: 15px;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 8px;
            }
            
            #s115-manual-input {
                width: 100%;
                height: 180px;
                padding: 12px 15px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                font-size: 15px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                resize: vertical;
                transition: all 0.2s ease;
                line-height: 1.6;
                box-sizing: border-box;
            }
            #s115-manual-input:hover {
                border-color: #bbb;
            }
            #s115-manual-input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 4px var(--shadow-color);
            }
            
            .s115-manual-select-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .s115-manual-select-group label {
                font-size: 15px;
                font-weight: 600;
                color: var(--text-color);
            }
            
            #s115-manual-folder-select {
                width: 100%;
                height: 44px;
                padding: 10px 15px;
                border: 1px solid var(--border-color);
                border-radius: 10px;
                font-size: 15px;
                background-color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                box-sizing: border-box;
            }
            #s115-manual-folder-select:hover {
                border-color: #bbb;
            }
            #s115-manual-folder-select:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 4px var(--shadow-color);
            }
            
            /* 底部按钮区域 */
            .s115-manual-modal-footer {
                padding: 20px 30px;
                border-top: 1px solid var(--border-color);
                background-color: #f9f9f9;
                display: flex;
                justify-content: space-between;
                gap: 12px;
            }
            
            .s115-btn-secondary {
                padding: 0 24px;
                height: 44px;
                background-color: #f0f0f0;
                color: var(--text-color);
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 600;
                transition: all 0.2s ease;
            }
            .s115-btn-secondary:hover {
                background-color: #e0e0e0;
                transform: translateY(-1px);
            }
        `);
    }

    function notice() { GM_addStyle(GM_getResourceText('toastrCss')); GM_addStyle('.toast{font-size:15px!important;width:360px!important;} .toast-title{font-size:16px!important;text-align:center}'); toastr.options = { "closeButton": true, "debug": false, "progressBar": true, "timeOut": 8000, "extendedTimeOut": 8000, "positionClass": 'toast-top-right', "allowHtml": true, "newestOnTop": false, }; }
    function getRightUrl(url) {
        var n = url.trim();
        if (/^thunder/i.test(n)) {
            n = decodeURIComponent(decode64(n.replace(/thunder:\/\//i, '')).slice(2, -2));
        }
        // After thunder decoding, it could be an ed2k or magnet link
        if (/^ed2k:\/\//i.test(n)) {
            const parts = n.split('|');
            if (parts.length >= 5 && parts[1] === 'file') {
                // Reconstruct to ensure a clean, standard link
                n = `ed2k://|file|${parts[2]}|${parts[3]}|${parts[4]}|/`;
            }
        }
        if (/^magnet/i.test(n)) {
            var h = n.split('&')[0].substring(20) || n.substring(20);
            if (h.length == 32) h = base32To16(h);
            n = 'magnet:?xt=urn:btih:' + h;
        } else if (/^\/\//.test(n)) {
            n = location.protocol + n;
        } else if (/^\/(?!\/)/.test(n)) {
            n = location.protocol + '//' + location.host + url;
        }
        return n;
    }
    function base32To16(str) { if (str.length % 8 !== 0 || /[0189]/.test(str)) return str; str = str.toUpperCase(); var bin = "", newStr = "", i; for (i = 0; i < str.length; i++) { var c = str.charCodeAt(i); c = '0000' + (c < 65 ? c - 24 : c - 65).toString(2); bin += c.substr(c.length - 5); } for (i = 0; i < bin.length; i += 4) { newStr += parseInt(bin.substring(i, i + 4), 2).toString(16); } return newStr; }
    function verify() { if (confirm('立即打开验证账号弹窗？')) { try { if (window.open('https://captchaapi.115.com/?ac=security_code&type=web&cb=Close' + Date.now(), '请验证账号', `height=500,width=335,top=${(window.screen.availHeight - 500) / 2},left=${(window.screen.availWidth - 335) / 2},toolbar=no,menubar=no`) === null) alert('验证弹窗已被拦截！'); } catch (e) { alert('验证弹窗已被拦截！'); } } }
    function get115Headers() { const h = { "User-Agent": UA, Origin: "https://115.com" }; if (G.get('manual_credential') && G.get('manualCookie').trim() !== '') { h['Cookie'] = G.get('manualCookie'); } return h; }
    function getAttribute(e) { var d = []; $.each(e.attributes, (i, attr) => { if (attr.specified && attr.value.length > 30) d.push(attr.value); }); if ($(e).text().length > 25) d.push($(e).text()); return d; }

    var offline = (() => ({
        getSign: (key, cid) => new Promise((resolve, reject) => {
            if (/^\w+=/.test(key)) { resolve(key); return; }
            const UserID = G.get('manual_credential') ? G.get('manualUserID') : GM_getValue('115ID') || '';
            if (!UserID) { toastr.error('请先登录115或在设置中手动填写UserID！', '认证失败'); return reject('No UserID'); }
            GM_xmlhttpRequest({
                method: 'GET', url: sign_url, responseType: 'json', headers: get115Headers(),
                onload: (res) => {
                    if (res.responseText.includes('<html')) {
                        toastr.error('请先登录115网盘或检查Cookie是否正确！', '离线任务添加失败');
                        setTimeout(() => { if (confirm('立即打开115登录页面？')) GM_openInTab('https://115.com/?mode=login', false); }, 3000);
                        return reject('Not logged in or invalid cookie');
                    }
                    const data = { uid: UserID, sign: res.response.sign, time: res.response.time, wp_path_id: cid || '0', savepath: '' };
                    const value = $.isPlainObject(key) ? $.param($.extend(data, key)) : $.param(data) + `&url=${encodeURIComponent(key)}`;
                    resolve(value);
                },
                onerror: reject,
            });
        }),
        getData: (herf, key, cid) => offline.getSign(key, cid).then(value => new Promise((resolve, reject) => {
            const headers = { ...get115Headers(), "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", "Accept": "application/json, text/javascript, */*; q=0.01", "X-Requested-With": "XMLHttpRequest" };
            GM_xmlhttpRequest({ method: 'POST', data: value, url: herf, responseType: 'json', headers, onload: (res) => resolve(res.response), onerror: reject });
        })),
        addButton: () => { $('[href]').not('[Searched]').each(function() { const url = $(this).attr('href'); if (!/^(magnet|thunder|ftp|ed2k):/i.test(url) && !/\.(torrent|rar|zip|7z|mp4|rmvb|mkv|avi)$/i.test(url)) return; $(this).attr('Searched', 'true'); const link = getRightUrl(url); if (!detectedLinks.some(item => item.url === link)) { detectedLinks.push({ url: link, text: $(this).text() }); } }); updateFab(); },
        addLink: () => { $('a,button,span,li').not('[Searched],[href*="google"]').each(function() { if ($(this).find('img').length > 0) return; for (let attr of getAttribute(this)) { if (/(^|\/|&|-|\.|\?|=|:|#|_|@)([a-f0-9]{40}|[a-z2-7]{32})(?!\w)/i.test(attr)) { const link = getRightUrl('magnet:?xt=urn:btih:' + attr.match(/(?:[a-f0-9]{40}|[a-z2-7]{32})/i)[0]); if (!detectedLinks.some(item => item.url === link)) { detectedLinks.push({ url: link, text: $(this).text() }); $(this).attr('Searched', 'true'); updateFab(); } return; } } }); },
        addEd2kLinksFromText: () => {
            const bodyText = document.body.innerText;
            const ed2kRegex = /(ed2k:\/\/(?:\|file\|[^|]+\|\d+\|[a-fA-F0-9]{32}\|\/))/gi;
            let match;
            while ((match = ed2kRegex.exec(bodyText)) !== null) {
                const link = getRightUrl(match[0]);
                if (!detectedLinks.some(item => item.url === link)) {
                    const parts = link.split('|');
                    const text = parts.length > 2 ? parts[2] : link; // Use filename as text
                    detectedLinks.push({ url: link, text: text });
                }
            }
        },
        addMagnetLinksFromText: () => {
            const bodyText = document.body.textContent || document.body.innerText;
            const magnetRegex = /magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,}(?:&dn=[^&\s]+)?(&tr=[^&\s]*)*/gi;
            let match;
            while ((match = magnetRegex.exec(bodyText)) !== null) {
                const link = getRightUrl(match[0]); // 使用您现有的链接处理函数
                if (!detectedLinks.some(item => item.url === link)) {
                    // 尝试从链接中提取文件名作为显示文本，若无则使用链接本身
                    const dnMatch = link.match(/&dn=([^&]+)/);
                    const text = dnMatch ? decodeURIComponent(dnMatch[1]) : link;
                    detectedLinks.push({ url: link, text: text });
                }
            }
    },

    }))();

    function executeBatchDownload(links, folderCid) {
        if (links.length === 0) {
            toastr.warning('没有发现任何可离线的链接');
            return;
        }

        const btn = $('#s115-batch-download');
        if(btn.attr('disabled')) return;
        btn.attr('disabled', true).css('opacity', '0.5');
        setTimeout(() => btn.attr('disabled', false).css('opacity', '1'), links.length > 10 ? 10000 : 5000);

        var linksParams = {};
        links.forEach((link, i) => linksParams[`url[${i}]`] = link.url);

        offline.getData(add_urls, linksParams, folderCid).then(json => {
            if (json.state) {
                let s = 0, e = 0, f = 0;
                json.result.forEach(r => {
                    if (r.state) s++;
                    else if (r.errcode == 10008) e++;
                    else f++;
                });
                toastr.success(`成功 ${s}, 存在 ${e}, 失败 ${f}` + a_list, `离线任务结果`, { timeOut: 10000 });
                if (G.get('open_List') && s > 0) setTimeout(() => GM_openInTab('https://115.com/?tab=offline&mode=wangpan', false), 2000);
            } else if (json.errcode == 911) {
                toastr.warning('账号异常，请验证。', '离线任务失败'); setTimeout(verify, 1000);
            } else {
                toastr.error((json.error_msg || '未知错误') + a_list, '离线任务失败');
            }
        }).catch(err => {
            toastr.error('服务器繁忙或网络错误', '离线任务异常');
            console.error(err);
        });
    }

    function handleBatchDownload() {
        var $checkedItems = $('.s115-link-checkbox:checked'), l = $checkedItems.length;
        if (l === 0) { toastr.warning('请至少选择一个链接。'); return; }

        const links = $checkedItems.map((i, el) => {
            return {
                url: $(el).val(),
                text: $(el).siblings('span').text()
            };
        }).get();

        const selectedCid = $('#s115-folder-select').val();
        hideModal();
        executeBatchDownload(links, selectedCid);
    }

    function showModal() {
        let linkHtml = '';
        detectedLinks.forEach(link => {
            const text = $('<div>').text(link.text || link.url).html();
            linkHtml += `<li><input type="checkbox" class="s115-link-checkbox" value="${link.url}" checked><span title="${link.url}">${text}</span></li>`;
        });
        $('#s115-link-list').html(linkHtml);

        let folderHtml = '';
        const folderConfig = G.get('folder_config').trim().split('\n');
        folderConfig.forEach(line => {
            const parts = line.split('=');
            if (parts.length === 2) {
                const alias = parts[0].trim();
                const cid = parts[1].trim();
                if (alias && /^\d+$/.test(cid)) {
                    folderHtml += `<option value="${cid}">${alias}</option>`;
                }
            }
        });
        $('#s115-folder-select').html(folderHtml);

        $modal.css('display', 'flex');
    }
    function hideModal() { $modal.hide(); }
    function updateFab() { var len = detectedLinks.length; if (len > 0) { $fab.css('display','flex').text(len); } else { $fab.hide(); } }
    function createUI() {
        $('body').append(`
            <div class="s115-fab">0</div>
            <div class="s115-modal-overlay"><div class="s115-modal-window">
                <div class="s115-modal-header"><span>115离线下载任务列表</span><button id="s115-close-modal" title="关闭">×</button></div>
                <div class="s115-modal-content"><ul id="s115-link-list"></ul></div>
                <div class="s115-modal-footer">
                    <div><button id="s115-select-all">全选</button><button id="s115-deselect-all" style="margin-left: 10px;">取消</button></div>
                    <div>
                        <select id="s115-folder-select" style="padding: 8px; border-radius: 5px; border: 1px solid #ccc; margin-right: 10px;"></select>
                        <button class="s115-btn-primary" id="s115-batch-download">离线下载选中项</button>
                    </div>
            </div></div></div>

            <!-- 手动输入链接离线模态框 -->
            <div class="s115-manual-modal-overlay">
                <div class="s115-manual-modal-window">
                    <div class="s115-manual-modal-header">
                        <span>手动输入链接离线下载</span>
                        <button id="s115-manual-close-modal" title="关闭">×</button>
                    </div>
                    <div class="s115-manual-modal-content">
                        <div>
                            <div class="s115-manual-input-label">输入下载链接</div>
                            <textarea
                                id="s115-manual-input"
                                placeholder="请输入磁力链接、ed2k链接、thunder链接或普通下载链接&#10;多个链接请分行输入..."
                            ></textarea>
                        </div>
                        <div class="s115-manual-select-group">
                            <label>保存到文件夹</label>
                            <select id="s115-manual-folder-select"></select>
                        </div>
                    </div>
                    <div class="s115-manual-modal-footer">
                        <button class="s115-btn-secondary" id="s115-manual-clear">清空</button>
                        <button class="s115-btn-primary" id="s115-manual-submit">开始离线下载</button>
                    </div>
                </div>
            </div>
        `);
        $fab = $('.s115-fab');
        $modal = $('.s115-modal-overlay');

        // 绑定主浮动窗口事件
        $fab.on('click', showModal);
        $modal.on('click', function(e) { if ($(e.target).is('#s115-close-modal') || $(e.target).is('.s115-modal-overlay')) hideModal(); });
        $('#s115-select-all').on('click', () => $('#s115-link-list :checkbox').prop('checked', true));
        $('#s115-deselect-all').on('click', () => $('#s115-link-list :checkbox').prop('checked', false));
        $('#s115-batch-download').on('click', handleBatchDownload);

        // 绑定手动输入窗口事件
        $('#s115-manual-close-modal').on('click', () => $('.s115-manual-modal-overlay').hide());
        $('#s115-manual-clear').on('click', () => $('#s115-manual-input').val(''));
        $('#s115-manual-submit').on('click', handleManualDownload);
        $('.s115-manual-modal-overlay').on('click', function(e) {
            if ($(e.target).is('.s115-manual-modal-overlay')) {
                $('.s115-manual-modal-overlay').hide();
            }
        });
    }

    // ================================================================
    // 手动输入链接离线功能
    // ================================================================
    function showManualInputModal() {
        populateFolderDropdown('#s115-manual-folder-select');
        $('.s115-manual-modal-overlay').css('display', 'flex');
        $('#s115-manual-input').focus();
    }

    function handleManualDownload() {
        const inputText = $('#s115-manual-input').val().trim();
        if (!inputText) {
            toastr.warning('请输入至少一个链接');
            return;
        }

        // 分割输入的链接
        const links = inputText.split('\n')
            .map(link => link.trim())
            .filter(link => link.length > 0)
            .map(link => ({
                url: getRightUrl(link),
                text: link.substring(0, 80) + (link.length > 80 ? '...' : '')
            }));

        if (links.length === 0) {
            toastr.warning('没有找到有效链接');
            return;
        }

        const selectedCid = $('#s115-manual-folder-select').val();
        $('.s115-manual-modal-overlay').hide();
        executeBatchDownload(links, selectedCid);
    }

    function populateFolderDropdown(selector) {
        let folderHtml = '';
        const folderConfig = G.get('folder_config').trim().split('\n');

        folderConfig.forEach(line => {
            const parts = line.split('=');
            if (parts.length === 2) {
                const alias = parts[0].trim();
                const cid = parts[1].trim();
                if (alias && /^\d+$/.test(cid)) {
                    folderHtml += `<option value="${cid}">${alias}</option>`;
                }
            }
        });

        $(selector).html(folderHtml);
    }

    // ================================================================
    // 主执行逻辑
    // ================================================================
    $(document).ready(function() {
        notice();

        if (localHref.includes('captchaapi.115.com')) {
            $('body').on('click', '.vcode-hint', () => setTimeout(() => window.close(), 200));
            return;
        }

        if (!G.get('manual_credential') && localHref.includes('115.com/')) {
            try {
                if (unsafeWindow.USER_ID) {
                    GM_setValue('115ID', unsafeWindow.USER_ID); console.log('115账号ID自动获取成功！');
                }
            } catch (e) {
                console.log('115账号未登录或页面结构变化，无法自动获取UserID。');
            }
        }

        if (G.get('offline_Down') && !localHref.includes('115.com/')) {
            addNewUIStyles();
            createUI();

            // Use MutationObserver for more efficient link detection
            const scanForLinks = () => {
                offline.addButton();
                offline.addEd2kLinksFromText();
                offline.addMagnetLinksFromText();
                if (G.get('fuzzy_find')) offline.addLink();
                updateFab(); // Consolidate FAB update
            };

            // Debounce function to avoid excessive scanning on busy pages
            let debounceTimer;
            const debouncedScan = () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(scanForLinks, 300);
            };

            // Initial scan on page load
            debouncedScan();

            // Set up an observer for dynamically added content
            const observer = new MutationObserver(debouncedScan);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    });

})();
// ==UserScript==
// @name         【智狐修改】全网VIP视频免费解析观看 (精简交互版)
// @namespace    zhihu_vip
// @version      2.3
// @description  精选解析线路为大家提供各大视频网站(PC+移动端)视频解析服务，简洁易用
// @author       zhihu
// @license MIT
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @match        *://*.youku.com/v_*
// @match        *://*.iqiyi.com/v_*
// @match        *://v.qq.com/x/cover/*
// @match        *://*.mgtv.com/b/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://www.le.com/ptv/vplay/*
// @match        *://tv.sohu.com/v/*
// @match        *://film.sohu.com/album/*
// @match        *://v.pptv.com/show/*
// @match        *://m.v.qq.com/x/m/play*
// @match        *://m.iqiyi.com/v_*
// @match        *://m.youku.com/video/*
// @match        *://m.mgtv.com/b/*
// @match        *://m.bilibili.com/video/*
// @match        *://m.bilibili.com/bangumi/play/*
// @match        *://m.le.com/vplay_*
// @match        *://m.tv.sohu.com/v*
// @match        *://m.pptv.com/show/*
// @downloadURL https://update.greasyfork.org/scripts/561492/%E3%80%90%E6%99%BA%E7%8B%90%E4%BF%AE%E6%94%B9%E3%80%91%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E8%A7%A3%E6%9E%90%E8%A7%82%E7%9C%8B%20%28%E7%B2%BE%E7%AE%80%E4%BA%A4%E4%BA%92%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561492/%E3%80%90%E6%99%BA%E7%8B%90%E4%BF%AE%E6%94%B9%E3%80%91%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E8%A7%A3%E6%9E%90%E8%A7%82%E7%9C%8B%20%28%E7%B2%BE%E7%AE%80%E4%BA%A4%E4%BA%92%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置部分 ====================
    const CONFIG = {
        // 内置解析接口（2024年最全集 - 42个线路）
        BUILTIN_APIS: [
            // ====== 你标记推荐的主力接口 ======
            {name: "七哥", url: "https://jx.nnxv.cn/tv.php?url="},
            {name: "虾米", url: "https://jx.xmflv.cc/?url="},

            // ====== 优选高频接口 (前10) ======
            {name: "B站综合", url: "https://jx.jsonplayer.com/player/?url="},
            {name: "爱豆", url: "https://jx.aidouer.net/?url="},
            {name: "M3U8.TV", url: "https://jx.m3u8.tv/jiexi/?url="},
            {name: "纯净", url: "https://im1907.top/?jx="},
            {name: "OK解析", url: "https://okjx.cc/?url="},
            {name: "夜幕", url: "https://www.yemu.xyz/?url="},
            {name: "BL解析", url: "https://vip.bljiex.com/?v="},
            {name: "冰豆(新)", url: "https://api.qianqi.net/vip/?url="},
            {name: "JY解析", url: "https://jx.playerjy.com/?url="},

            // ====== 其他备用接口 ======
            {name: "百域", url: "https://jx.618g.com/?url="},
            {name: "CK", url: "https://www.ckplayer.vip/jiexi/?url="},
            {name: "CHok", url: "https://www.gai4.com/?url="},
            {name: "ckmov", url: "https://www.ckmov.vip/api.php?url="},
            {name: "H8", url: "https://www.h8jx.com/jiexi.php?url="},
            {name: "解析", url: "https://ckmov.ccyjjd.com/ckmov/?url="},
            {name: "解析la", url: "https://api.jiexi.la/?url="},
            {name: "老板", url: "https://vip.laobandq.com/jiexi.php?url="},
            {name: "MAO", url: "https://www.mtosz.com/m3u8.php?url="},
            {name: "诺讯", url: "https://www.nxflv.com/?url="},
            {name: "PM", url: "https://www.playm3u8.cn/jiexi.php?url="},
            {name: "盘古", url: "https://www.pangujiexi.cc/jiexi.php?url="},
            {name: "RDHK", url: "https://jx.rdhk.net/?v="},
            {name: "人人迷", url: "https://jx.blbo.cc:4433/?url="},
            {name: "思云", url: "https://jx.ap2p.cn/?url="},
            {name: "思古3", url: "https://jsap.attakids.com/?url="},
            {name: "听乐", url: "https://jx.dj6u.com/?url="},
            {name: "维多", url: "https://jx.ivito.cn/?url="},
            {name: "YT", url: "https://jx.yangtu.top/?url="},
            {name: "云端", url: "https://sb.5gseo.net/?url="},
            {name: "0523", url: "https://go.yh0523.cn/y.cy?url="},
            {name: "17云", url: "https://www.1717yun.com/jx/ty.php?url="},
            {name: "180", url: "https://jx.000180.top/jx/?url="},
            {name: "4K", url: "https://jx.4kdv.com/?url="},
            {name: "8090", url: "https://www.8090g.cn/?url="},
            {name: "剖元", url: "https://www.pouyun.com/?url="},
            {name: "全民", url: "https://43.240.74.102:4433?url="}
        ],

        // 要删除的广告元素
        AD_SELECTORS: [
            '.playlist-intro__actions',
            '.playlist-vip-section__vip',
            '.game_switch_page_with_user_policies',
            '.game-switch-ad',
            '.playlist-video-modules-union',
            '.playlist-side__other',
            '.playlist-side__sub',
            '.page-content__bottom',
            '.page-slice-footer-wrap',
            '#ssi-footer',
            '.footer-color--override'
        ],

        // 默认设置
        DEFAULT_SETTINGS: {
            autoPlayDelay: 3,
            isAutoPlay: false,
            lastUsedApi: ""
        }
    };

    // ==================== 样式部分 ====================
    const STYLES = `
        /* 悬浮按钮样式 */
        #zhihu_vip_float_btn {
            position: fixed;
            top: 40%;
            left: 10px;
            z-index: 999999999;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            line-height: 60px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            user-select: none;
            transition: all 0.3s ease;
            overflow: hidden;
        }

        #zhihu_vip_float_btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }

        #zhihu_vip_float_btn .btn-icon {
            display: block;
            font-size: 24px;
            margin-bottom: 2px;
        }

        #zhihu_vip_float_btn .btn-text {
            display: block;
            font-size: 12px;
        }

        /* 弹窗样式 */
        .zhihu-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 999999998;
            display: none;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(3px);
        }

        .zhihu-popup {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            width: 450px;
            max-width: 90vw;
            max-height: 80vh;
            overflow: hidden;
            animation: popupFadeIn 0.3s ease;
        }

        @keyframes popupFadeIn {
            from { opacity: 0; transform: translateY(-20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .popup-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 18px 24px;
            font-size: 18px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .popup-close {
            cursor: pointer;
            font-size: 28px;
            line-height: 1;
            color: white;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        .popup-close:hover {
            opacity: 1;
        }

        .popup-content {
            padding: 24px;
            max-height: 60vh;
            overflow-y: auto;
        }

        .popup-footer {
            padding: 20px 24px;
            border-top: 1px solid #eaeaea;
            text-align: center;
            background: #f8f9fa;
        }

        /* 接口列表样式 */
        .api-section {
            margin-bottom: 24px;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #f0f0f0;
        }

        .api-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 12px;
        }

        .api-item {
            padding: 12px 8px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;
            color: #333;
        }

        .api-item:hover {
            border-color: #667eea;
            background: #f0f4ff;
            transform: translateY(-2px);
        }

        .api-item.active {
            border-color: #667eea;
            background: #667eea;
            color: white;
            font-weight: bold;
        }

        /* 设置项样式 */
        .settings-section {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }

        .setting-item {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }

        .setting-label {
            width: 120px;
            font-weight: bold;
            color: #444;
            font-size: 14px;
        }

        .setting-control {
            flex: 1;
        }

        .number-input {
            width: 80px;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            color: #333;
            background: white;
        }

        /* 复选框样式 */
        .checkbox-container {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            color: #333;
        }

        .checkbox-container input[type="checkbox"] {
            width: 18px;
            height: 18px;
            cursor: pointer;
        }

        /* 按钮样式 */
        .primary-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
            min-width: 140px;
        }

        .primary-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .primary-btn:active {
            transform: translateY(0);
        }

        /* 选中接口显示样式 */
        .selected-api-display {
            background: #f0f8ff;
            border-radius: 8px;
            padding: 16px;
            margin-top: 16px;
            border-left: 4px solid #667eea;
            color: #333;
        }

        .selected-api-display strong {
            color: #444;
        }

        .selected-api-display small {
            color: #666;
            font-size: 13px;
        }

        /* 提示信息样式 */
        .api-tips {
            color: #666;
            font-size: 13px;
            margin-bottom: 16px;
            line-height: 1.5;
        }

        /* 提示框样式 */
        #zhihu_toast {
            position: fixed;
            top: 30px;
            right: 30px;
            background: rgba(40, 167, 69, 0.95);
            color: white;
            padding: 14px 28px;
            border-radius: 8px;
            z-index: 1000000000;
            font-size: 14px;
            max-width: 320px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            animation: toastSlideIn 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #zhihu_toast.error {
            background: rgba(220, 53, 69, 0.95);
        }

        #zhihu_toast.info {
            background: rgba(23, 162, 184, 0.95);
        }

        .toast-close {
            margin-left: 15px;
            cursor: pointer;
            font-size: 20px;
            opacity: 0.8;
        }

        .toast-close:hover {
            opacity: 1;
        }

        @keyframes toastSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes toastFadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }

        /* 滚动条样式 */
        .popup-content::-webkit-scrollbar {
            width: 6px;
        }

        .popup-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .popup-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }

        .popup-content::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `;

    // ==================== 状态管理 ====================
    let state = {
        selectedApi: null,
        settings: {...CONFIG.DEFAULT_SETTINGS}
    };

    // ==================== 核心功能 ====================
    class VIPVideoParser {
        constructor() {
            this.init();
        }

        init() {
            // 注入样式
            this.injectStyles();

            // 加载设置
            this.loadSettings();

            // 删除广告元素
            this.removeAds();

            // 创建UI
            this.createUI();

            // 绑定事件
            this.bindEvents();

            console.log('智狐VIP视频解析 (精简交互版) 已加载');
        }

        injectStyles() {
            const styleEl = document.createElement('style');
            styleEl.textContent = STYLES;
            document.head.appendChild(styleEl);
        }

        loadSettings() {
            try {
                const saved = GM_getValue('zhihu_vip_simple_settings');
                if (saved) {
                    state.settings = {...CONFIG.DEFAULT_SETTINGS, ...saved};
                }

                // 设置默认选中接口
                if (state.settings.lastUsedApi) {
                    const api = CONFIG.BUILTIN_APIS.find(a => a.url === state.settings.lastUsedApi);
                    if (api) state.selectedApi = api;
                }

                if (!state.selectedApi && CONFIG.BUILTIN_APIS.length > 0) {
                    state.selectedApi = CONFIG.BUILTIN_APIS[0];
                }
            } catch (e) {
                console.error('加载设置失败:', e);
            }
        }

        saveSettings() {
            try {
                GM_setValue('zhihu_vip_simple_settings', state.settings);
            } catch (e) {
                console.error('保存设置失败:', e);
            }
        }

        removeAds() {
            const remove = () => {
                CONFIG.AD_SELECTORS.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => el.remove());
                });
            };

            remove();
            setInterval(remove, 2000);
        }

        // ==================== UI创建 ====================
        createUI() {
            this.createFloatButton();
            this.createPopupContainer();

            // 检查是否自动播放
            this.checkAutoPlay();
        }

        createFloatButton() {
            const btn = document.createElement('div');
            btn.id = 'zhihu_vip_float_btn';
            btn.innerHTML = `
                <div class="btn-icon">▶️</div>
                <div class="btn-text">解析</div>
            `;
            document.body.appendChild(btn);

            this.makeDraggable(btn);
        }

        createPopupContainer() {
            const overlay = document.createElement('div');
            overlay.className = 'zhihu-popup-overlay';
            overlay.id = 'zhihu_popup_overlay';

            overlay.innerHTML = `
                <div class="zhihu-popup" id="zhihu_main_popup">
                    <div class="popup-header">
                        <span>智狐视频解析</span>
                        <span class="popup-close" id="zhihu_popup_close">×</span>
                    </div>
                    <div class="popup-content" id="zhihu_popup_content">
                        <!-- 内容动态生成 -->
                    </div>
                    <div class="popup-footer">
                        <button class="primary-btn" id="parse_now">立即解析</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
        }

        // ==================== 渲染逻辑 ====================
        renderPopup() {
            const contentEl = document.getElementById('zhihu_popup_content');
            if (!contentEl) return;

            contentEl.innerHTML = this.renderContent();
            this.bindApiSelectionEvents();
        }

        renderContent() {
            return `
                <div class="api-section">
                    <div class="section-title">选择解析线路</div>
                    <div class="api-tips">
                        共 ${CONFIG.BUILTIN_APIS.length} 个线路，点击选择后点击下方"立即解析"按钮
                    </div>
                    <div class="api-list">
                        ${CONFIG.BUILTIN_APIS.map(api => `
                            <div class="api-item ${state.selectedApi?.url === api.url ? 'active' : ''}"
                                 data-api-url="${api.url}" data-api-name="${api.name}">
                                ${api.name}
                            </div>
                        `).join('')}
                    </div>

                    ${state.selectedApi ? `
                        <div class="selected-api-display">
                            <strong>当前选择：</strong> ${state.selectedApi.name}
                            <br>
                            <small>${state.selectedApi.url}</small>
                        </div>
                    ` : ''}
                </div>

                <div class="settings-section">
                    <div class="section-title">播放设置</div>

                    <div class="setting-item">
                        <div class="setting-label">自动播放</div>
                        <div class="setting-control">
                            <label class="checkbox-container">
                                <input type="checkbox" id="auto_play_checkbox"
                                       ${state.settings.isAutoPlay ? 'checked' : ''}>
                                <span>页面加载后自动解析播放</span>
                            </label>
                        </div>
                    </div>

                    <div class="setting-item">
                        <div class="setting-label">延迟时间</div>
                        <div class="setting-control">
                            <input type="number" class="number-input" id="auto_play_delay"
                                   value="${state.settings.autoPlayDelay}" min="1" max="10">
                            <span style="margin-left: 8px; color: #666;">秒</span>
                        </div>
                    </div>
                </div>
            `;
        }

        // ==================== 事件绑定 ====================
        bindEvents() {
            // 悬浮按钮点击
            document.getElementById('zhihu_vip_float_btn').addEventListener('click', (e) => {
                this.showPopup();
            });

            // 弹窗关闭
            document.getElementById('zhihu_popup_close').addEventListener('click', () => {
                this.hidePopup();
            });

            // 点击遮罩层关闭
            document.getElementById('zhihu_popup_overlay').addEventListener('click', (e) => {
                if (e.target.id === 'zhihu_popup_overlay') {
                    this.hidePopup();
                }
            });

            // 立即解析按钮
            document.getElementById('parse_now').addEventListener('click', () => {
                this.parseVideo();
            });

            // 键盘快捷键
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.hidePopup();
                }
            });
        }

        bindApiSelectionEvents() {
            // 接口选择
            document.querySelectorAll('.api-item[data-api-url]').forEach(item => {
                item.addEventListener('click', (e) => {
                    this.selectApi({
                        name: e.target.dataset.apiName,
                        url: e.target.dataset.apiUrl
                    });
                });
            });

            // 自动播放设置
            const autoPlayCheckbox = document.getElementById('auto_play_checkbox');
            if (autoPlayCheckbox) {
                autoPlayCheckbox.addEventListener('change', (e) => {
                    state.settings.isAutoPlay = e.target.checked;
                    this.saveSettings();
                });
            }

            // 延迟时间设置
            const delayInput = document.getElementById('auto_play_delay');
            if (delayInput) {
                delayInput.addEventListener('change', (e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= 10) {
                        state.settings.autoPlayDelay = value;
                        this.saveSettings();
                    } else {
                        e.target.value = state.settings.autoPlayDelay;
                    }
                });
            }
        }

        // ==================== 核心功能方法 ====================
        showPopup() {
            this.renderPopup();
            document.getElementById('zhihu_popup_overlay').style.display = 'flex';
        }

        hidePopup() {
            document.getElementById('zhihu_popup_overlay').style.display = 'none';
        }

        selectApi(api) {
            state.selectedApi = api;
            state.settings.lastUsedApi = api.url;
            this.saveSettings();
            this.renderPopup();
        }

        parseVideo() {
            if (!state.selectedApi) {
                this.showToast('请先选择一个解析接口', 2000, 'error');
                return;
            }

            this.hidePopup();
            this.playVideo(state.selectedApi.url);
        }

        playVideo(apiUrl) {
            const currentUrl = window.location.href;
            const playerSelectors = this.getPlayerSelectors();

            const host = window.location.host;
            const selectors = playerSelectors[host];

            if (selectors) {
                let videoContainer = null;
                for (const selector of selectors) {
                    videoContainer = document.querySelector(selector);
                    if (videoContainer) break;
                }

                if (videoContainer) {
                    // 清除原视频容器
                    videoContainer.innerHTML = '';

                    // 创建iframe播放器
                    const iframe = document.createElement('iframe');
                    iframe.id = 'zhihu_video_player';
                    iframe.src = apiUrl + encodeURIComponent(currentUrl);
                    iframe.style.cssText = `
                        width: 100%;
                        height: 100%;
                        border: none;
                        display: block;
                        background: #000;
                    `;
                    iframe.allowFullscreen = true;

                    // 添加加载状态
                    iframe.onload = () => {
                        this.showToast('视频加载完成，开始播放', 1500);
                    };

                    videoContainer.appendChild(iframe);

                    this.showToast('正在解析视频，请稍候...', 2000);

                    // 保存最后使用的接口
                    state.settings.lastUsedApi = apiUrl;
                    this.saveSettings();
                } else {
                    this.showToast('找不到视频播放器，请刷新页面重试', 2000, 'error');
                }
            } else {
                this.showToast('暂不支持该网站', 2000, 'error');
            }
        }

        checkAutoPlay() {
            if (state.settings.isAutoPlay) {
                setTimeout(() => {
                    if (state.selectedApi) {
                        this.showToast(`${state.settings.autoPlayDelay}秒后自动播放...`, 1500);
                        setTimeout(() => {
                            this.playVideo(state.selectedApi.url);
                        }, state.settings.autoPlayDelay * 1000);
                    }
                }, 1000);
            }
        }

        getPlayerSelectors() {
            return {
                'www.iqiyi.com': ['#flashbox'],
                'v.qq.com': ['#mod_player', '#player-container'],
                'v.youku.com': ['#player'],
                'www.mgtv.com': ['#mgtv-player-wrap', '#player'],
                'tv.sohu.com': ['#player'],
                'film.sohu.com': ['#playerWrap'],
                'www.le.com': ['#le_playbox'],
                'v.pptv.com': ['#pptv_playpage_box'],
                'www.wasu.cn': ['#flashContent', '#player'],
                'vip.1905.com': ['#playBox'],
                'www.bilibili.com': ['#player_module', '#bilibili-player'],
                'm.iqiyi.com': ['.m-video-player-wrap'],
                'm.v.qq.com': ['.player'],
                'm.youku.com': ['#player'],
                'm.mgtv.com': ['.video-area'],
                'm.bilibili.com': ['#bofqi'],
                'm.le.com': ['#j-player'],
                'm.tv.sohu.com': ['.player'],
                'm.pptv.com': ['.pp-details-video']
            };
        }

        makeDraggable(element) {
            let isDragging = false;
            let startX, startY, startLeft, startTop;

            element.addEventListener('mousedown', function(e) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;

                const rect = element.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;

                element.style.transition = 'none';

                const onMouseMove = (e) => {
                    if (!isDragging) return;

                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;

                    let newLeft = startLeft + deltaX;
                    let newTop = startTop + deltaY;

                    // 限制在屏幕内
                    const maxLeft = window.innerWidth - element.offsetWidth;
                    const maxTop = window.innerHeight - element.offsetHeight;

                    newLeft = Math.max(10, Math.min(newLeft, maxLeft - 10));
                    newTop = Math.max(10, Math.min(newTop, maxTop - 10));

                    element.style.left = newLeft + 'px';
                    element.style.top = newTop + 'px';
                };

                const onMouseUp = () => {
                    isDragging = false;
                    element.style.transition = 'all 0.3s ease';
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }

        showToast(message, duration = 2000, type = 'success') {
            const oldToast = document.getElementById('zhihu_toast');
            if (oldToast) oldToast.remove();

            const toast = document.createElement('div');
            toast.id = 'zhihu_toast';
            if (type !== 'success') toast.classList.add(type);

            toast.innerHTML = `
                <span>${message}</span>
                <span class="toast-close">×</span>
            `;

            document.body.appendChild(toast);

            // 关闭按钮事件
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.remove();
            });

            // 自动移除
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'toastFadeOut 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        }
    }

    // ==================== 初始化 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new VIPVideoParser();
        });
    } else {
        new VIPVideoParser();
    }

})();
// ==UserScript==
// @name         YouTube Shorts Auto-Scroll
// @namespace    prmgvyt-scripts
// @version      8.4
// @author       prmgvyt
// @description       🚀 Tự động lướt YouTube Shorts, Menu cài đặt đa ngôn ngữ tách biệt, hỗ trợ Auto-Like/Mute/Redirect chuyên nghiệp.
// @description:en    🚀 Auto-scroll YouTube Shorts, separate multi-language menu, supports Auto-Like/Mute/Redirect.
// @description:vi    🚀 Tự động lướt YouTube Shorts, menu cài đặt đa ngôn ngữ tách biệt, hỗ trợ Auto-Like/Mute/Redirect.
// @match        *://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561728/YouTube%20Shorts%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/561728/YouTube%20Shorts%20Auto-Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * @section SYSTEM CORE DATA
     * Khởi tạo và quản lý bộ nhớ của script
     */
    const SCRIPT_NAME = "YouTube Shorts Auto-Scroll";
    const BUILD_VER = "8.7.2026";

    let config = {
        enabled: GM_getValue('enabled', true),
        autoLike: GM_getValue('autoLike', false),
        autoMute: GM_getValue('autoMute', false),
        lang: GM_getValue('lang', navigator.language.split('-')[0]) || 'en'
    };

    /**
     * @section MULTI-LANGUAGE DICTIONARY (i18n)
     * Hệ thống ngôn ngữ hỗ trợ 6 quốc gia với thông báo chi tiết
     */
    const i18n = {
        vi: {
            nav: "🚀 [PHÍM TẮT] Mở YouTube Shorts ngay",
            status: config.enabled ? "✅ Tự động lướt: ĐANG BẬT" : "❌ Tự động lướt: ĐANG TẮT",
            like: config.autoLike ? "❤️ Tự động Like: ĐANG BẬT" : "🤍 Tự động Like: ĐANG TẮT",
            mute: config.autoMute ? "🔇 Tự động Mute: ĐANG BẬT" : "🔊 Tự động Mute: ĐANG TẮT",
            headerLang: "🌐 --- CHỌN NGÔN NGỮ GIAO DIỆN ---",
            active: " (Đang dùng)",
            logReady: "🚀 Hệ thống lướt tự động đã sẵn sàng!"
        },
        en: {
            nav: "🚀 [SHORTCUT] Open Shorts Now",
            status: config.enabled ? "✅ Auto-Scroll: ON" : "❌ Auto-Scroll: OFF",
            like: config.autoLike ? "❤️ Auto-Like: ON" : "🤍 Auto-Like: OFF",
            mute: config.autoMute ? "🔇 Auto-Mute: ON" : "🔊 Auto-Mute: OFF",
            headerLang: "🌐 --- SELECT INTERFACE LANGUAGE ---",
            active: " (Active)",
            logReady: "🚀 Auto-scroll system is ready!"
        },
        zh: { nav: "🚀 立即打开 Shorts", status: config.enabled ? "✅ 自动滚动: 开启" : "❌ 自动滚动: 关闭", like: "❤️ 自动点赞", mute: "🔇 自动静音", headerLang: "🌐 --- 选择界面语言 ---", active: " (当前)" },
        ja: { nav: "🚀 今すぐ視聴開始！", status: config.enabled ? "✅ 自動再生: オン" : "❌ 自動再生: オフ", like: "❤️ 自動いいね", mute: "🔇 自動消音", headerLang: "🌐 --- 言語設定を選択 ---", active: " (有効)" },
        ko: { nav: "🚀 지금 시청 시작!", status: config.enabled ? "✅ 자동 스크롤: 켜짐" : "❌ 자동 스크롤: 꺼짐", like: "❤️ 자동 좋아요", mute: "🔇 자동 음소거", headerLang: "🌐 --- 인터페이스 언어 선택 ---", active: " (사용 중)" },
        fr: { nav: "🚀 Ouvrir Shorts Maintenant", status: config.enabled ? "✅ Défilement: OUI" : "❌ Défilement: NON", like: "❤️ Auto-Like", mute: "🔇 Silence", headerLang: "🌐 --- CHOISIR LA LANGUE ---", active: " (Actif)" }
    };

    const t = i18n[config.lang] || i18n.en;

    /**
     * @section ADVANCED MENU REGISTRATION
     * Xây dựng bảng menu dài và tách biệt cho Tampermonkey
     */
    const registerProMenus = () => {
        // --- NHÓM ĐIỀU HƯỚNG ---
        GM_registerMenuCommand(t.nav, () => {
            window.location.href = 'https://www.youtube.com/shorts/';
        });

        // --- NHÓM CÀI ĐẶT CHỨC NĂNG ---
        GM_registerMenuCommand(t.status, () => { GM_setValue('enabled', !config.enabled); location.reload(); });
        GM_registerMenuCommand(t.like, () => { GM_setValue('autoLike', !config.autoLike); location.reload(); });
        GM_registerMenuCommand(t.mute, () => { GM_setValue('autoMute', !config.autoMute); location.reload(); });

        // --- NHÓM NGÔN NGỮ RIÊNG BIỆT ---
        GM_registerMenuCommand("────────────────────────", () => {}); // Separator
        GM_registerMenuCommand(t.headerLang, () => {});

        const langTable = [
            { id: 'vi', label: '🇻🇳 Tiếng Việt' },
            { id: 'en', label: '🇺🇸 English' },
            { id: 'zh', label: '🇨🇳 中文 (Chinese)' },
            { id: 'ja', label: '🇯🇵 日本語 (Japanese)' },
            { id: 'ko', label: '🇰🇷 한국어 (Korean)' },
            { id: 'fr', label: '🇫🇷 Français (French)' }
        ];

        langTable.forEach(item => {
            const isCurrent = (config.lang === item.id);
            const menuTitle = (isCurrent ? "🔹 " : "▫️ ") + item.label + (isCurrent ? t.active : "");

            GM_registerMenuCommand(menuTitle, () => {
                if (!isCurrent) {
                    GM_setValue('lang', item.id);
                    location.reload();
                }
            });
        });
    };
    registerProMenus();

    /**
     * @section INTERACTION MONITORING
     * Ngăn script tự lướt khi người dùng đang thao tác thủ công
     */
    let lastUserAction = 0;
    const recordAction = () => { lastUserAction = Date.now(); };

    ['keydown', 'wheel', 'mousedown', 'touchstart'].forEach(evt => {
        window.addEventListener(evt, recordAction, { passive: true });
    });

    /**
     * @section CORE SCROLL ENGINE
     * Cơ chế tìm kiếm nút bấm và giả lập phím cuộn
     */
    const performScroll = () => {
        const timeIdle = Date.now() - lastUserAction;
        if (!config.enabled || timeIdle < 1500) return;

        // Tìm nút xuống của YouTube Shorts
        const nextBtn = document.querySelector('ytd-reel-video-renderer[is-active] #navigation-button-down button, #navigation-button-down button, [aria-label*="Next"]');

        if (nextBtn) {
            nextBtn.click();
        } else {
            // Giải pháp dự phòng: Giả lập phím ArrowDown
            const downEvt = new KeyboardEvent('keydown', {
                key: 'ArrowDown', keyCode: 40, code: 'ArrowDown', which: 40, bubbles: true
            });
            document.dispatchEvent(downEvt);
        }
    };

    /**
     * @section VIDEO HANDLER & AUTOMATION
     * Quản lý vòng đời của video đang phát
     */
    const handleActiveVideo = (video) => {
        if (video.dataset.prmgvytStatus === 'running') return;

        // Reset loop để bắt đầu nhận diện sự kiện kết thúc
        video.loop = false;
        if (config.autoMute) video.muted = true;

        let likeTriggered = false;
        let lastLoggedTime = 0;

        const automationLoop = setInterval(() => {
            const isShorts = window.location.href.includes('/shorts/');
            const isActiveFrame = video.closest('ytd-reel-video-renderer[is-active]');

            // Thoát nếu không còn trong Shorts hoặc video không còn active
            if (!isShorts || !config.enabled || !isActiveFrame) {
                if (!isActiveFrame) video.dataset.prmgvytStatus = 'idle';
                clearInterval(automationLoop);
                return;
            }

            // 1. Tự động Like (Tại 85% thời lượng)
            if (config.autoLike && !likeTriggered && video.duration > 0) {
                if (video.currentTime > video.duration * 0.85) {
                    const lBtn = isActiveFrame.querySelector('#like-button button[aria-pressed="false"]');
                    if (lBtn) lBtn.click();
                    likeTriggered = true;
                }
            }

            // 2. Nhận diện kết thúc video
            const isNearEnd = (video.currentTime >= video.duration - 0.3 && video.duration > 0);
            const isLooped = (video.currentTime < lastLoggedTime && lastLoggedTime > 0.5);

            if (isNearEnd || isLooped) {
                console.log("%c[Auto-Scroll] End Detected -> Scrolling...", "color: #ff4500; font-weight: bold;");
                performScroll();
                lastLoggedTime = 0;
            } else {
                lastLoggedTime = video.currentTime;
            }
        }, 300);

        video.dataset.prmgvytStatus = 'running';
    };

    /**
     * @section BOOTSTRAP
     * Trình quét tìm video active định kỳ
     */
    setInterval(() => {
        if (window.location.href.includes('/shorts/')) {
            const activeVid = document.querySelector('ytd-reel-video-renderer[is-active] video');
            if (activeVid) handleActiveVideo(activeVid);
        }
    }, 1000);

    // Console Branding
    console.log(`%c ${t.logReady} `, "color: white; background: #f00; padding: 10px; font-weight: bold; border-radius: 5px;");
    console.log(`%c ${SCRIPT_NAME} v8.7 | Build: ${BUILD_VER} `, "color: #ff0; background: #000; padding: 3px; font-family: monospace;");

})();
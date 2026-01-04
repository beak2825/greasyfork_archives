// ==UserScript==
// @name         FACEIT Auto Tool v6.1 (Multi-Language)
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Auto-accept, auto-connect, custom sounds, and a multilingual interface
// @author       Evre1pro
// @match        https://www.faceit.com/*
// @grant        GM_setValue
// @icon         https://play-lh.googleusercontent.com/4iFS-rI0ImIFZyTwjidPChDOTUGxZqX2sCBLRsf9g_noMIUnH9ywsCmCzSu9vSM9Jg
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        window.focus
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556215/FACEIT%20Auto%20Tool%20v61%20%28Multi-Language%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556215/FACEIT%20Auto%20Tool%20v61%20%28Multi-Language%29.meta.js
// ==/UserScript==
// ==UserScript==

(function () {
    'use strict';

    // --- КОНФИГУРАЦИЯ ---
    const CONFIG_KEY = 'faceit_tool_config_v6';
    const POS_KEY = 'faceit_tool_pos_v6';
    const BTN_POS_KEY = 'faceit_tool_btn_pos_v6';

    const TRANSLATIONS = {
        ru: {
            title: 'FACEIT AUTO TOOL',
            header: 'FACEIT AUTO TOOL',
            sec_automation: 'Автоматизация',
            lbl_accept: 'Авто-Принятие',
            lbl_connect: 'Авто-Коннект (1 клик)',

            desc_connect: '* Коннект срабатывает 1 раз при появлении кнопки.',
            sec_sounds: 'Звуки и Оповещения',
            lbl_sound_on: 'Включить звуки',
            lbl_notify: 'Оповещения (свернутый)',
            lbl_sound_match: 'Звук "Матч найден"',
            lbl_sound_connect: 'Звук "Коннект"',
            lbl_volume: 'Громкость',
            sec_settings: 'Настройки',
            lbl_language: 'Язык / Language',
            lbl_style: 'Вид кнопки',
            opt_floating: 'Плавающая',
            opt_native: 'Встроить в меню',
            btn_test: 'Тест',
            btn_upload: 'Загр.',
            btn_telegram: 'Другие скрипты (Telegram)',
            footer: 'Меню можно перетаскивать | F8 для скрытия',
            notif_match: 'МАТЧ НАЙДЕН! Принимаю...',
            notif_ready: 'СЕРВЕР ГОТОВ! Подключаюсь...',
            notif_clicked: 'Кнопка подключения нажата.',
            alert_big_file: 'Файл > 1МБ. Используйте короткий звук.',
            alert_saved: 'Звук сохранен!',
            log_accept: '[FACEIT Tool] Матч принят',
            log_connect: '[FACEIT Tool] Коннект нажат'
        },
        en: {
            title: 'FACEIT AUTO TOOL',
            header: 'FACEIT AUTO TOOL',
            sec_automation: 'Automation',
            lbl_accept: 'Auto-Accept',
            lbl_connect: 'Auto-Connect (One-Tap)',

            desc_connect: '* Connect clicks once when button appears.',
            sec_sounds: 'Sounds & Notifications',
            lbl_sound_on: 'Enable Sounds',
            lbl_notify: 'Desktop Notifications',
            lbl_sound_match: 'Sound "Match Found"',
            lbl_sound_connect: 'Sound "Connect"',
            lbl_volume: 'Volume',
            sec_settings: 'Settings',
            lbl_language: 'Language',
            lbl_style: 'Button Style',
            opt_floating: 'Floating',
            opt_native: 'Native (Sidebar)',
            btn_test: 'Test',
            btn_upload: 'Upld',
            btn_telegram: 'More Scripts (Telegram)',
            footer: 'Drag header to move | F8 to hide',
            notif_match: 'MATCH FOUND! Accepting...',
            notif_ready: 'SERVER READY! Connecting...',
            notif_clicked: 'Connect button clicked.',
            alert_big_file: 'File > 1MB. Use short audio.',
            alert_saved: 'Sound saved!',
            log_accept: '[FACEIT Tool] Match Accepted',
            log_connect: '[FACEIT Tool] Connect Clicked'
        },
        de: {
            title: 'FACEIT AUTO TOOL',
            header: 'FACEIT AUTO TOOL',
            sec_automation: 'Automatisierung',
            lbl_accept: 'Auto-Akzeptieren',
            lbl_connect: 'Auto-Verbinden',

            desc_connect: '* Klickt einmal, wenn Button erscheint.',
            sec_sounds: 'Töne & Benachrichtigungen',
            lbl_sound_on: 'Töne aktivieren',
            lbl_notify: 'Desktop-Benachricht.',
            lbl_sound_match: 'Ton "Match gefunden"',
            lbl_sound_connect: 'Ton "Verbinden"',
            lbl_volume: 'Lautstärke',
            sec_settings: 'Einstellungen',
            lbl_language: 'Sprache / Language',
            lbl_style: 'Button-Stil',
            opt_floating: 'Schwebend',
            opt_native: 'Im Menü',
            btn_test: 'Test',
            btn_upload: 'Laden',
            btn_telegram: 'Andere Skripte (Telegram)',
            footer: 'Kopfzeile ziehen zum Bewegen | F8',
            notif_match: 'MATCH GEFUNDEN! Akzeptiere...',
            notif_ready: 'SERVER BEREIT! Verbinde...',
            notif_clicked: 'Verbinden geklickt.',
            alert_big_file: 'Datei > 1MB. Kurz halten.',
            alert_saved: 'Ton gespeichert!',
            log_accept: '[FACEIT Tool] Match akzeptiert',
            log_connect: '[FACEIT Tool] Verbindung geklickt'
        },
        zh: {
            title: 'FACEIT 自动工具',
            header: 'FACEIT 自动工具',
            sec_automation: '自动化',
            lbl_accept: '自动接受',
            lbl_connect: '自动连接 (单次)',

            desc_connect: '* 按钮出现时自动点击一次。',
            sec_sounds: '声音和通知',
            lbl_sound_on: '启用声音',
            lbl_notify: '桌面通知',
            lbl_sound_match: '声音 "找到比赛"',
            lbl_sound_connect: '声音 "连接"',
            lbl_volume: '音量',
            sec_settings: '设置',
            lbl_language: '语言 / Language',
            lbl_style: '按钮样式',
            opt_floating: '悬浮球',
            opt_native: '嵌入菜单',
            btn_test: '测试',
            btn_upload: '上传',
            btn_telegram: '更多脚本 (Telegram)',
            footer: '拖动标题移动 | 按 F8 隐藏',
            notif_match: '找到比赛！正在接受...',
            notif_ready: '服务器就绪！正在连接...',
            notif_clicked: '已点击连接按钮。',
            alert_big_file: '文件 > 1MB。请使用短音频。',
            alert_saved: '声音已保存！',
            log_accept: '[FACEIT Tool] 已接受比赛',
            log_connect: '[FACEIT Tool] 已点击连接'
        }
    };

    const DEFAULT_CONFIG = {
        lang: 'ru',
        autoAccept: true,
        autoConnect: true,

        soundEnabled: true,
        volume: 0.5,
        buttonStyle: 'floating',
        acceptSoundData: null,
        connectSoundData: null,
        notifications: true
    };

    let config = { ...DEFAULT_CONFIG, ...GM_getValue(CONFIG_KEY, {}) };
    let menuPos = GM_getValue(POS_KEY, { top: '15%', left: '85%' });
    let isMenuOpen = false;
    let t = TRANSLATIONS[config.lang];

    let state = {
        hasAccepted: false,
        hasConnected: false,
        lastUrl: window.location.href,
        connectRetryCount: 0
    };

    // --- АУДИО КОНТЕКСТ (FIX) ---
    // Создаем глобальный контекст и активируем его по первому клику пользователя
    let audioCtx;
    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
    // Вешаем слушатель на любой клик на странице, чтобы "разбудить" аудио
    document.addEventListener('click', initAudioContext, { once: true });
    document.addEventListener('keydown', initAudioContext, { once: true });


    // Иконки (Чистый SVG для исправления деформации)
    const ICONS = {
        robot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>`,
        gear: `<svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="24px" height="24px" viewBox="0 0 24 24" role="img" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"><path d="M23.999 2.705a.167.167 0 0 0-.312-.1 1141.27 1141.27 0 0 0-6.053 9.375H.218c-.221 0-.301.282-.11.352 7.227 2.73 17.667 6.836 23.5 9.134.15.06.39-.08.39-.18z"/></g></svg>`,
        play: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
        upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
        telegram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`
    };

    GM_addStyle(`
        .f-tool-btn-floating {
            position: fixed; top: 15%; right: 20px; z-index: 9999;
            background: #FF5500; color: white; border: none;
            border-radius: 50%;
            width: 50px; height: 50px;
            min-width: 50px; min-height: 50px;
            padding: 0; margin: 0;
            cursor: pointer; box-shadow: 0 4px 15px rgba(255, 85, 0, 0.4);
            display: flex; align-items: center; justify-content: center;
            transition: transform 0.2s;
        }
        .f-tool-btn-floating:hover { transform: scale(1.1); }
        .f-tool-btn-floating svg { width: 24px; height: 24px; display: block; }

        .f-tool-btn-native {
            display: flex; align-items: center; justify-content: center;
            width: 40px; height: 40px; margin: 10px auto;
            border-radius: 50%; cursor: pointer;
            background: transparent; border: 1px solid #333;
            color: #888; transition: all 0.2s;
        }
        .f-tool-btn-native:hover, .f-tool-btn-native.active {
            color: #FF5500; border-color: #FF5500; background: rgba(255, 85, 0, 0.1);
        }

        .f-tool-modal {
            position: fixed; z-index: 10000;
            width: 360px; background: #1f1f1f;
            border-radius: 8px; box-shadow: 0 10px 50px rgba(0,0,0,0.9);
            border: 1px solid #333; color: #fff; font-family: "Play", sans-serif;
            display: none; opacity: 0; transition: opacity 0.2s;
            user-select: none;
        }
        .f-tool-modal.active { display: block; opacity: 1; }

        .f-tool-header {
            padding: 8px 10px; border-bottom: 1px solid #333;
            display: flex; justify-content: space-between; align-items: center;
            background: #161616; border-radius: 8px 8px 0 0;
            cursor: grab;
            min-height: 36px;
        }
        .f-tool-header svg { width: 16px; height: 16px; }
        .f-tool-header:active { cursor: grabbing; }

        .f-tool-body { padding: 15px; }

        .f-tool-group {
            background: #262626; padding: 12px; border-radius: 6px;
            margin-bottom: 10px; border: 1px solid #333;
        }
        .f-tool-group h4 { margin: 0 0 10px 0; color: #FF5500; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }

        .f-tool-row {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 10px; font-size: 13px;
        }
        .f-tool-row svg { width: 16px; height: 16px; }

        .f-switch { position: relative; display: inline-block; width: 36px; height: 18px; }
        .f-switch input { opacity: 0; width: 0; height: 0; }
        .f-slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: #444; transition: .3s; border-radius: 18px;
        }
        .f-slider:before {
            position: absolute; content: ""; height: 14px; width: 14px;
            left: 2px; bottom: 2px; background-color: white;
            transition: .3s; border-radius: 50%;
        }
        input:checked + .f-slider { background-color: #FF5500; }
        input:checked + .f-slider:before { transform: translateX(18px); }

        .f-btn {
            background: #333; color: white; border: 1px solid #444;
            padding: 4px 8px; border-radius: 4px; cursor: pointer;
            font-size: 11px; display: flex; align-items: center; gap: 5px;
        }
        .f-btn:hover { background: #444; border-color: #555; }

        .f-telegram-btn {
            display: flex; align-items: center; justify-content: center; gap: 6px;
            background: #24A1DE; /* Telegram Blue */
            color: white !important; text-decoration: none;
            padding: 6px 10px; border-radius: 4px; margin-top: 10px;
            font-weight: bold; font-size: 12px;
            border: 1px solid #24A1DE;
            transition: opacity 0.2s;
        }
        .f-telegram-btn svg { width: 16px; height: 16px; }
        .f-telegram-btn:hover { opacity: 0.9; }

        .f-select {
            background: #333; color: white; border: 1px solid #444;
            padding: 4px; border-radius: 4px; font-size: 12px; outline: none;
        }
        .f-volume-slider { width: 100%; accent-color: #FF5500; margin-top: 8px; height: 4px; }
        .f-close { cursor: pointer; font-size: 20px; color: #888; line-height: 1; }
        .f-close:hover { color: white; }
    `);

    function setLanguage(langCode) {
        if (!TRANSLATIONS[langCode]) return;
        config.lang = langCode;
        t = TRANSLATIONS[langCode];
        GM_setValue(CONFIG_KEY, config);
        updateModalContent();
    }

    function makeDraggable(el, storageKey) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;

        // Use header as handle if exists, otherwise the element itself
        const header = el.querySelector('.f-tool-header');
        const handle = header || el;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            // Allow interaction with inputs/buttons inside header
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.className === 'f-close') return;

            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            isDragging = false;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            // Calc movement
            const dx = pos3 - e.clientX;
            const dy = pos4 - e.clientY;

            // Threshold to distinguish click from drag
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                isDragging = true;
                el.setAttribute('data-dragged', 'true');
            }

            pos1 = dx;
            pos2 = dy;
            pos3 = e.clientX;
            pos4 = e.clientY;

            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
            el.style.right = 'auto'; // Override CSS right
            el.style.bottom = 'auto';

            // Only clear transform for modal (to avoid breaking button hover scale)
            if (header) {
                el.style.transform = 'none';
            }
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            if (isDragging) {
                if (storageKey) {
                    GM_setValue(storageKey, { top: el.style.top, left: el.style.left });
                }
            }
        }
    }

    function playSound(type) {
        if (!config.soundEnabled) return;

        if (document.hidden && config.notifications) {
            GM_notification({
                title: 'FACEIT Auto Tool',
                text: type === 'accept' ? t.notif_match : t.notif_ready,
                timeout: 4000,
                onclick: () => window.focus()
            });
        }

        const customData = type === 'accept' ? config.acceptSoundData : config.connectSoundData;
        if (customData) {
            const audio = new Audio(customData);
            audio.volume = config.volume;
            audio.play().catch(e => console.error("Audio error:", e));
            return;
        }

        // Используем глобальный контекст
        if (!audioCtx) initAudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.gain.value = config.volume * 0.2;

        if (type === 'accept') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.2);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.5);
        }
    }

    function safeClick(element) {
        ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(event => {
            const win = element.ownerDocument.defaultView || window;
            element.dispatchEvent(new MouseEvent(event, {
                bubbles: true,
                cancelable: true,
                view: win
            }));
        });
    }

    function findBtnByText(textArray, context = document) {
        const buttons = context.querySelectorAll('button');
        for (let btn of buttons) {
            if (btn.disabled || btn.offsetParent === null) continue;
            const btnText = btn.innerText.toUpperCase();
            if (textArray.some(t => btnText.includes(t))) return btn;
        }
        return null;
    }

    function automationLoop() {
        if (window.location.href !== state.lastUrl) {
            state.lastUrl = window.location.href;
            state.hasAccepted = false;
            state.hasConnected = false;
            state.connectRetryCount = 0;
        }

        // AUTO ACCEPT
        if (config.autoAccept && !state.hasAccepted) {
            const modal = document.querySelector('div[data-dialog-type="MODAL"]');
            if (modal) {
                const btn = findBtnByText(['ACCEPT', 'ПРИНЯТЬ', 'CHECK IN', 'ANNEHMEN', '接受'], modal);
                if (btn) {
                    playSound('accept');
                    state.hasAccepted = true;
                    setTimeout(() => safeClick(btn), 200);
                    console.log(t.log_accept);
                }
            }
        }

        // AUTO CONNECT
        if (config.autoConnect && !state.hasConnected) {
            // Strategy: Look for the main action button in the match room
            // Usually "CONNECT", "GO TO SERVER" or explicit "IP" button.
            const keywords = ['CONNECT', 'GO TO SERVER', 'ПОДКЛЮЧИТЬСЯ', 'ИГРАТЬ', 'PLAY'];
            const connectBtn = findBtnByText(keywords);

            if (connectBtn) {
                // Check if it's the "Connect to Server" button (often green or orange)
                // We want to avoid clicking it multiple times if it just opens a modal

                // If we haven't clicked it yet for this match (URL)
                // Note: The logic might need to handle the modal that appears AFTER clicking connect.
                // But for "One-Tap", usually clicking the main button triggers the steam protocol or opens the IP.

                // Detection improvement: Ensure it's not a generic nav button
                // Facebook buttons often have specific classes, but text is reliable enough for valid context.

                playSound('connect');
                state.hasConnected = true;

                setTimeout(() => {
                    safeClick(connectBtn);
                    console.log(t.log_connect);

                    // Optional: If it opens a modal with "Connect with Steam" or "Copy IP", we could try to click that too.
                    // But usually the first button is enough or opens the client.
                }, 500);
            }
        }


    }



    function toggleMenu() {
        const modal = document.querySelector('.f-tool-modal');
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) modal.classList.add('active');
        else modal.classList.remove('active');
        // Попытка активировать аудио при открытии меню
        initAudioContext();
    }

    function renderButtons() {
        document.querySelectorAll('.f-tool-btn-floating, .f-tool-btn-native').forEach(e => e.remove());
        if (config.buttonStyle === 'native') {
            const sidebar = document.querySelector('div[class*="NavigationSidebar"] div[class*="Scrollable"]');
            if (sidebar) {
                const container = document.createElement('div');
                container.style.display = 'contents';
                const btn = document.createElement('button');
                btn.className = 'f-tool-btn-native';
                btn.innerHTML = ICONS.robot;
                btn.onclick = toggleMenu;
                sidebar.appendChild(container);
                container.appendChild(btn);
            } else {
                renderFloatingBtn();
            }
        } else {
            renderFloatingBtn();
        }
    }

    function renderFloatingBtn() {
        const btn = document.createElement('button');
        btn.className = 'f-tool-btn-floating';
        btn.innerHTML = ICONS.gear;

        // Load position
        const savedPos = GM_getValue(BTN_POS_KEY, null);
        if (savedPos) {
            btn.style.top = savedPos.top;
            btn.style.left = savedPos.left;
            btn.style.right = 'auto';
        }

        makeDraggable(btn, BTN_POS_KEY);

        btn.onclick = (e) => {
            if (btn.getAttribute('data-dragged') === 'true') {
                btn.removeAttribute('data-dragged');
                return;
            }
            toggleMenu();
        };

        document.body.appendChild(btn);
    }

    function updateModalContent() {
        const modal = document.querySelector('.f-tool-modal');
        if (!modal) return;

        const html = `
            <div class="f-tool-header">
                <span style="font-weight:bold; color:#FF5500; display:flex; gap:8px; align-items:center">
                    ${ICONS.robot} ${t.header}
                </span>
                <span class="f-close" id="f-tool-close">×</span>
            </div>
            <div class="f-tool-body">
                <div class="f-tool-group">
                    <h4>${t.sec_automation}</h4>
                    <div class="f-tool-row">
                        <span>${t.lbl_accept}</span>
                        <label class="f-switch">
                            <input type="checkbox" id="chk-accept" ${config.autoAccept ? 'checked' : ''}>
                            <span class="f-slider"></span>
                        </label>
                    </div>



                </div>

                <div class="f-tool-group">
                    <h4>${t.sec_sounds}</h4>
                    <div class="f-tool-row">
                        <span>${t.lbl_sound_on}</span>
                        <label class="f-switch">
                            <input type="checkbox" id="chk-sound" ${config.soundEnabled ? 'checked' : ''}>
                            <span class="f-slider"></span>
                        </label>
                    </div>
                      <div class="f-tool-row">
                        <span>${t.lbl_notify}</span>
                        <label class="f-switch">
                            <input type="checkbox" id="chk-notify" ${config.notifications ? 'checked' : ''}>
                            <span class="f-slider"></span>
                        </label>
                    </div>

                    <div class="f-tool-row" style="margin-top:10px">
                        <span>${t.lbl_sound_match}</span>
                        <div style="display:flex; gap:5px">
                            <button class="f-btn" id="btn-test-accept" title="${t.btn_test}">${ICONS.play}</button>
                            <label class="f-btn" title="${t.btn_upload}">
                                ${ICONS.upload}
                                <input type="file" id="file-accept" accept="audio/*" style="display:none">
                            </label>
                        </div>
                    </div>

                    <div class="f-tool-row" style="flex-direction:column; align-items:flex-start; gap:5px;">
                        <span>${t.lbl_volume}</span>
                        <input type="range" class="f-volume-slider" id="rng-volume" min="0" max="1" step="0.1" value="${config.volume}">
                    </div>
                </div>

                <div class="f-tool-group">
                    <h4>${t.sec_settings}</h4>
                    <div class="f-tool-row">
                        <span>${t.lbl_language}</span>
                        <select id="sel-lang" class="f-select">
                            <option value="ru" ${config.lang === 'ru' ? 'selected' : ''}>Русский</option>
                            <option value="en" ${config.lang === 'en' ? 'selected' : ''}>English</option>
                            <option value="de" ${config.lang === 'de' ? 'selected' : ''}>Deutsch</option>
                            <option value="zh" ${config.lang === 'zh' ? 'selected' : ''}>中文</option>
                        </select>
                    </div>
                    <div class="f-tool-row">
                        <span>${t.lbl_style}</span>
                        <select id="sel-style" class="f-select">
                            <option value="floating" ${config.buttonStyle === 'floating' ? 'selected' : ''}>${t.opt_floating}</option>
                            <option value="native" ${config.buttonStyle === 'native' ? 'selected' : ''}>${t.opt_native}</option>
                        </select>
                    </div>
                </div>

                <a href="https://t.me/gostibissi" target="_blank" class="f-telegram-btn">
                    ${ICONS.telegram} ${t.btn_telegram}
                </a>

                <div style="text-align:center; font-size:10px; color:#555; margin-top:10px;">${t.footer}</div>
            </div>
        `;

        modal.innerHTML = html;
        bindEvents();
        makeDraggable(modal, POS_KEY);
    }

    function bindEvents() {
        document.getElementById('f-tool-close').onclick = toggleMenu;

        ['autoAccept', 'soundEnabled', 'notifications'].forEach(key => {
            const id = 'chk-' + (key === 'soundEnabled' ? 'sound' : key === 'notifications' ? 'notify' : 'accept');
            document.getElementById(id).onchange = (e) => {
                config[key] = e.target.checked;
                GM_setValue(CONFIG_KEY, config);
                // Force reload if needed, or it will pick up in next loop
            };
        });

        document.getElementById('rng-volume').oninput = (e) => {
            config.volume = parseFloat(e.target.value);
            GM_setValue(CONFIG_KEY, config);
        };

        document.getElementById('sel-style').onchange = (e) => {
            config.buttonStyle = e.target.value;
            GM_setValue(CONFIG_KEY, config);
            renderButtons();
        };

        document.getElementById('sel-lang').onchange = (e) => {
            setLanguage(e.target.value);
        };

        const handleUpload = (id, key) => {
            document.getElementById(id).onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > 1024 * 1024) {
                    alert(t.alert_big_file);
                    return;
                }
                const reader = new FileReader();
                reader.onload = (evt) => {
                    config[key] = evt.target.result;
                    GM_setValue(CONFIG_KEY, config);
                    alert(t.alert_saved);
                };
                reader.readAsDataURL(file);
            };
        };
        handleUpload('file-accept', 'acceptSoundData');


        document.getElementById('btn-test-accept').onclick = () => playSound('accept');

    }

    function init() {
        const modal = document.createElement('div');
        modal.className = 'f-tool-modal';
        modal.style.top = menuPos.top;
        modal.style.left = menuPos.left;
        if (menuPos.top !== '50%') modal.style.transform = 'none';
        document.body.appendChild(modal);

        updateModalContent();
        renderButtons();

        setInterval(() => {
            if (config.buttonStyle === 'native' && !document.querySelector('.f-tool-btn-native')) {
                renderButtons();
            }
        }, 2000);

        setInterval(automationLoop, 1000);

        document.addEventListener('keydown', (e) => {
            if (e.code === 'F8') toggleMenu();
        });
    }

    init();
    console.log("FACEIT Auto Tool v6.6 Loaded");

})();
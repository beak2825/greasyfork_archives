// ==UserScript==
// @name         X & Threads Grok Fact Checker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  X and Threads。Fact checking, long press to exit function.
// @author       GFgatus
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://www.threads.net/*
// @match        https://www.threads.com/*
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559370/X%20%20Threads%20Grok%20Fact%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/559370/X%20%20Threads%20Grok%20Fact%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LANG_DICT = {
        'zh-TW': {
            name: '🇹🇼 繁體中文 (Traditional Chinese)',
            prompt: '請進行事實查核，詳細分析以下這則貼文的真實性，並指出可能的錯誤或誤導資訊：\n',
            ui: {
                menu_auto: '⚙️ 預設自動送出',
                menu_lang: '🌐 語言設定 (Language)',
                init: '環境初始化...',
                mode_direct: '🚀 直出模式 (自動送出)',
                mode_std: '🛡️ 標準模式 (僅填寫)',
                mode_fast: '🚀 急速直出模式啟用',
                privacy_check: '🔒 切換至隱私模式...',
                privacy_skip: '⚠️ 跳過隱私設定',
                privacy_skip_sub: '繼續執行...',
                writing: '📝 寫入指令...',
                sending: '🚀 正在送出...',
                done: '✅ 完成',
                done_manual: '✅ 指令已填入',
                done_manual_sub: '請確認後手動送出',
                error_btn: '⚠️ 找不到送出鈕',
                error_btn_sub: '請手動點擊',
                error_timeout: '⚠️ 逾時',
                error_timeout_sub: '找不到輸入框',
                error_script: '❌ 腳本錯誤',
                error_script_sub: '請查看控制台',
                toggle_focus: '切換專注模式',
                settings_title: '選擇語言 / Select Language'
            }
        },
        'zh-CN': {
            name: '🇨🇳 简体中文 (Simplified Chinese)',
            prompt: '请进行事实核查，详细分析以下帖子的真实性，并指出可能的错误或误导信息：\n',
            ui: {
                menu_auto: '⚙️ 默认自动发送',
                menu_lang: '🌐 语言设置 (Language)',
                init: '环境初始化...',
                mode_direct: '🚀 直出模式 (自动发送)',
                mode_std: '🛡️ 标准模式 (仅填写)',
                mode_fast: '🚀 急速直出模式启用',
                privacy_check: '🔒 切换至隐私模式...',
                privacy_skip: '⚠️ 跳过隐私设置',
                privacy_skip_sub: '继续执行...',
                writing: '📝 写入指令...',
                sending: '🚀 正在发送...',
                done: '✅ 完成',
                done_manual: '✅ 指令已填入',
                done_manual_sub: '请确认后手动发送',
                error_btn: '⚠️ 找不到发送按钮',
                error_btn_sub: '请手动点击',
                error_timeout: '⚠️ 超时',
                error_timeout_sub: '找不到输入框',
                error_script: '❌ 脚本错误',
                error_script_sub: '请查看控制台',
                toggle_focus: '切换专注模式',
                settings_title: '选择语言 / Select Language'
            }
        },
        'en': {
            name: '🇺🇸 English',
            prompt: 'Please fact-check this post. Analyze its authenticity in detail and point out any potential errors or misleading information:\n',
            ui: {
                menu_auto: '⚙️ Auto Send',
                menu_lang: '🌐 Language Settings',
                init: 'Initializing...',
                mode_direct: '🚀 Direct Mode (Auto Send)',
                mode_std: '🛡️ Standard Mode (Fill Only)',
                mode_fast: '🚀 Fast Direct Mode',
                privacy_check: '🔒 Switching to Privacy Mode...',
                privacy_skip: '⚠️ Skip Privacy Check',
                privacy_skip_sub: 'Proceeding...',
                writing: '📝 Writing Command...',
                sending: '🚀 Sending...',
                done: '✅ Done',
                done_manual: '✅ Command Filled',
                done_manual_sub: 'Please send manually',
                error_btn: '⚠️ Send Button Not Found',
                error_btn_sub: 'Click manually',
                error_timeout: '⚠️ Timeout',
                error_timeout_sub: 'Input box not found',
                error_script: '❌ Script Error',
                error_script_sub: 'Check Console',
                toggle_focus: 'Toggle Focus Mode',
                settings_title: 'Select Language'
            }
        },
        'ja': {
            name: '🇯🇵 日本語 (Japanese)',
            prompt: '以下の投稿の事実確認（ファクトチェック）を行ってください。信憑性を詳細に分析し、誤りや誤解を招く情報があれば指摘してください：\n',
            ui: {
                menu_auto: '⚙️ 自動送信',
                menu_lang: '🌐 言語設定 (Language)',
                init: '初期化中...',
                mode_direct: '🚀 直接モード (自動送信)',
                mode_std: '🛡️ 標準モード (入力のみ)',
                mode_fast: '🚀 高速直接モード',
                privacy_check: '🔒 プライバシーモードへ切替...',
                privacy_skip: '⚠️ プライバシー設定をスキップ',
                privacy_skip_sub: '続行します...',
                writing: '📝 コマンド入力中...',
                sending: '🚀 送信中...',
                done: '✅ 完了',
                done_manual: '✅ 入力完了',
                done_manual_sub: '手動で送信してください',
                error_btn: '⚠️ 送信ボタンなし',
                error_btn_sub: '手動でクリック',
                error_timeout: '⚠️ タイムアウト',
                error_timeout_sub: '入力欄が見つかりません',
                error_script: '❌ スクリプトエラー',
                error_script_sub: 'コンソールを確認',
                toggle_focus: '集中モード切替',
                settings_title: '言語を選択 / Select Language'
            }
        },
        'ko': {
            name: '🇰🇷 한국어 (Korean)',
            prompt: '다음 게시물의 사실 여부를 확인해 주세요. 진위를 자세히 분석하고 오류나 오해의 소지가 있는 정보를 지적해 주세요:\n',
            ui: {
                menu_auto: '⚙️ 자동 전송',
                menu_lang: '🌐 언어 설정 (Language)',
                init: '초기화 중...',
                mode_direct: '🚀 직접 모드 (자동 전송)',
                mode_std: '🛡️ 표준 모드 (입력만)',
                mode_fast: '🚀 고속 직접 모드',
                privacy_check: '🔒 비공개 모드로 전환...',
                privacy_skip: '⚠️ 개인정보 설정 건너뛰기',
                privacy_skip_sub: '계속 진행...',
                writing: '📝 명령어 입력 중...',
                sending: '🚀 전송 중...',
                done: '✅ 완료',
                done_manual: '✅ 입력 완료',
                done_manual_sub: '수동으로 전송하세요',
                error_btn: '⚠️ 전송 버튼 없음',
                error_btn_sub: '수동 클릭 필요',
                error_timeout: '⚠️ 시간 초과',
                error_timeout_sub: '입력창을 찾을 수 없음',
                error_script: '❌ 스크립트 오류',
                error_script_sub: '콘솔 확인',
                toggle_focus: '집중 모드 전환',
                settings_title: '언어 선택 / Select Language'
            }
        }
    };

    const LangSystem = {
        getKey: () => GM_getValue('cfg_lang_code', null),
        setKey: (code) => {
            if (LANG_DICT[code]) GM_setValue('cfg_lang_code', code);
        },
        getCurrent: () => {
            const code = LangSystem.getKey();
            if (code && LANG_DICT[code]) return LANG_DICT[code];

            const browserLang = navigator.language;
            if (browserLang.includes('zh-CN')) return LANG_DICT['zh-CN'];
            if (browserLang.includes('zh')) return LANG_DICT['zh-TW'];
            if (browserLang.includes('ja')) return LANG_DICT['ja'];
            if (browserLang.includes('ko')) return LANG_DICT['ko'];
            if (browserLang.includes('en')) return LANG_DICT['en'];

            return LANG_DICT['zh-TW']; // 最終預設
        },
        getText: (key) => {
            const dict = LangSystem.getCurrent();
            return dict.ui[key] || LANG_DICT['zh-TW'].ui[key] || key;
        },
        getPrompt: () => {
            return LangSystem.getCurrent().prompt;
        }
    };

    const GROK_URL = 'https://x.com/i/grok';
    const PRIVACY_KEYWORDS = ['私人', 'Private', '隐私', 'プライベート', '비공개', 'Privado', 'Privé', 'Privat'];
    const LOCK_ICON_PATH_SIGNATURE = "M9.375 8.541H8.042c0 .157";
    const HARDCODED_XPATH = '//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[1]/div[1]/div/div/div/div/div/div/div[2]/div/div[3]/div/button[2]';

    const ICONS = {
        ROBOT: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z" /><path d="M10 16h4" /><circle cx="8.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><path d="M9 7l-1 -4" /><path d="M15 7l1 -4" /></svg>',
        SENDING: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="#1d9bf0" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>',
        ROCKET: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="#f91880" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" /><path d="M7 14a6 6 0 0 0 -3 8" /><path d="M14 7a6 6 0 0 0 8 -3" /></svg>',
        EYE_OPEN: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>',
        EYE_OFF: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 3.15 -3.692 5.252 -4.753m3.243 -.745c.168 -.006 .337 -.006 .505 .006c3.6 0 6.6 2 9 6c-.632 1.053 -1.333 1.944 -2.103 2.673" /><path d="M3 3l18 18" /></svg>'
    };

    function registerMenus() {
        const isAutoSend = GM_getValue('cfg_auto_send', false);
        const autoSendText = isAutoSend ? '✅ ON' : '❌ OFF';
        GM_registerMenuCommand(`${LangSystem.getText('menu_auto')}: ${autoSendText}`, () => {
            GM_setValue('cfg_auto_send', !isAutoSend);
            location.reload();
        });
        GM_registerMenuCommand(LangSystem.getText('menu_lang'), () => {
            showLanguageSelectionUI();
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        .my-grok-robot-btn {
            display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px;
            border-radius: 9999px; background-color: transparent; color: rgb(113, 118, 123);
            cursor: pointer; transition: all 0.2s; margin-right: 8px; border: none; outline: none;
            user-select: none; -webkit-user-select: none;
        }
        .threads-grok-btn { margin-right: 0; margin-left: 8px; color: inherit; }
        .my-grok-robot-btn:hover { background-color: rgba(29, 155, 240, 0.1); color: rgb(29, 155, 240); }
        .my-grok-robot-btn.charging { color: #f91880; background-color: rgba(249, 24, 128, 0.1); transform: scale(1.15); }
        .my-grok-robot-btn svg { width: 20px; height: 20px; }

        .grok-curtain-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.85); backdrop-filter: blur(5px);
            z-index: 2147483647; display: flex; align-items: center; justify-content: center;
            transition: opacity 0.3s ease-out; opacity: 1; pointer-events: auto; flex-direction: column; gap: 10px;
        }
        .grok-curtain-fade-out { opacity: 0; pointer-events: none; }
        .grok-curtain-text {
            color: #ffffff; font-family: sans-serif; font-size: 22px; font-weight: 500;
            letter-spacing: 1.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); text-align: center;
        }
        .grok-curtain-sub { color: #8899a6; font-size: 14px; margin-top: 5px; }

        .grok-lang-panel {
            background: #16181c; border: 1px solid #2f3336; border-radius: 16px;
            padding: 20px; width: 300px; display: flex; flex-direction: column; gap: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .grok-lang-title { color: #e7e9ea; font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 8px; }
        .grok-lang-btn {
            background: transparent; border: 1px solid #536471; color: #e7e9ea;
            padding: 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 14px;
            text-align: left;
        }
        .grok-lang-btn:hover { background: rgba(29, 155, 240, 0.1); border-color: #1d9bf0; color: #1d9bf0; }
        .grok-lang-btn.active { background: #1d9bf0; border-color: #1d9bf0; color: white; }

        .grok-sidebar-toggle {
            position: fixed; bottom: 20px; left: 20px; width: 40px; height: 40px;
            background-color: rgba(21, 32, 43, 0.8); border: 1px solid rgba(113, 118, 123, 0.3);
            border-radius: 50%; color: #eff3f4; display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 9999; transition: all 0.2s; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .grok-sidebar-toggle:hover { background-color: rgba(29, 155, 240, 0.9); transform: scale(1.1); }
        .grok-sidebar-toggle svg { width: 22px; height: 22px; }

        body.grok-focus-mode header[role="banner"],
        body.grok-focus-mode [data-testid="sidebarColumn"],
        body.grok-focus-mode div[data-testid="TopNavBar"] { display: none !important; }
        body.grok-focus-mode main[role="main"] { align-items: center !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
        body.grok-focus-mode div[data-testid="primaryColumn"] { max-width: 900px !important; width: 100% !important; margin: 0 auto !important; border: none !important; }
    `;
    document.head.appendChild(style);

    function findAny(selectors, root = document) {
        for (const selector of selectors) {
            const el = root.querySelector(selector);
            if (el) return el;
        }
        return null;
    }

    function removeGrokAds() {
        const keywords = ["建立重複工作", "在 grok.com 上存取更多功能", "grok.com", "Get more with grok.com"];
        const candidates = document.querySelectorAll('span, div[dir="ltr"]');
        candidates.forEach(el => {
            if (!el.innerText) return;
            if (keywords.some(kw => el.innerText.includes(kw))) {
                const btn = el.closest('button');
                if (btn) btn.style.display = 'none';
            }
        });
    }

    function createSidebarToggle() {
        if (document.querySelector('.grok-sidebar-toggle')) return;
        const btn = document.createElement('div');
        btn.className = 'grok-sidebar-toggle';
        btn.innerHTML = ICONS.EYE_OPEN;
        btn.title = LangSystem.getText('toggle_focus');
        let isFocusMode = false;
        btn.addEventListener('click', () => {
            isFocusMode = !isFocusMode;
            if (isFocusMode) {
                document.body.classList.add('grok-focus-mode');
                btn.innerHTML = ICONS.EYE_OFF;
            } else {
                document.body.classList.remove('grok-focus-mode');
                btn.innerHTML = ICONS.EYE_OPEN;
            }
        });
        document.body.appendChild(btn);
    }

    let curtainElement = null;
    let curtainMsgElement = null;
    let curtainSubElement = null;

    function showCurtain(initialText, subText = '') {
        if (document.querySelector('.grok-curtain-overlay')) return;
        curtainElement = document.createElement('div');
        curtainElement.className = 'grok-curtain-overlay';
        curtainMsgElement = document.createElement('div');
        curtainMsgElement.className = 'grok-curtain-text';
        curtainMsgElement.innerHTML = initialText;
        curtainSubElement = document.createElement('div');
        curtainSubElement.className = 'grok-curtain-sub';
        curtainSubElement.innerHTML = subText;
        curtainElement.appendChild(curtainMsgElement);
        curtainElement.appendChild(curtainSubElement);
        document.body.appendChild(curtainElement);
    }

    function updateCurtainText(text, sub = null) {
        if (curtainMsgElement) curtainMsgElement.innerHTML = text;
        if (sub !== null && curtainSubElement) curtainSubElement.innerHTML = sub;
    }

    function hideCurtain(delay = 500) {
        if (curtainElement) {
            setTimeout(() => { if (curtainElement) curtainElement.classList.add('grok-curtain-fade-out'); }, delay);
            setTimeout(() => {
                if (curtainElement && curtainElement.parentNode) {
                    curtainElement.parentNode.removeChild(curtainElement);
                    curtainElement = null;
                    curtainMsgElement = null;
                    curtainSubElement = null;
                }
            }, delay + 350);
        }
    }

    function showLanguageSelectionUI() {
        if (document.querySelector('.grok-curtain-overlay')) {
            const existing = document.querySelector('.grok-curtain-overlay');
            existing.parentNode.removeChild(existing);
        }
        const overlay = document.createElement('div');
        overlay.className = 'grok-curtain-overlay';
        const panel = document.createElement('div');
        panel.className = 'grok-lang-panel';
        const title = document.createElement('div');
        title.className = 'grok-lang-title';
        title.innerText = LangSystem.getText('settings_title');
        panel.appendChild(title);
        const currentCode = GM_getValue('cfg_lang_code', 'zh-TW');
        Object.keys(LANG_DICT).forEach(code => {
            const btn = document.createElement('button');
            btn.className = 'grok-lang-btn';
            if (code === currentCode) btn.classList.add('active');
            btn.innerText = LANG_DICT[code].name;
            btn.onclick = () => {
                LangSystem.setKey(code);
                location.reload();
            };
            panel.appendChild(btn);
        });
        const closeBtn = document.createElement('button');
        closeBtn.className = 'grok-lang-btn';
        closeBtn.innerText = '❌ Close';
        closeBtn.style.textAlign = 'center';
        closeBtn.style.marginTop = '10px';
        closeBtn.onclick = () => {
            overlay.classList.add('grok-curtain-fade-out');
            setTimeout(() => overlay.remove(), 350);
        };
        panel.appendChild(closeBtn);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }

    function simulateTypeInput(element, text) {
        if (!element) return;
        element.focus();
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        if (nativeInputValueSetter) {
            nativeInputValueSetter.call(element, text);
        } else {
            element.value = text;
        }
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        try {
            element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
        } catch (e) { }
    }

    function safeSimulateClick(element) {
        if (!element) return;
        // 確保點擊到的是可互動的 button，而非內層 SVG
        const clickable = element.closest('button') || element.closest('[role="button"]') || element;

        console.log('[GrokFix] Executing safe click on:', clickable);

        clickable.focus();
        clickable.click(); // 原生點擊 (主要)

        // 備用：冒泡點擊
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        clickable.dispatchEvent(event);
    }

    function findSendButton() {
        const selectors = [
            'button[aria-label="問 Grok 一些問題"]', 'button[aria-label="Ask Grok"]', 'button[aria-label="Grok"]',
            'button[data-testid="grok-send-button"]', 'button[aria-label="傳送"]', 'button[aria-label="Send"]'
        ];
        let btn = findAny(selectors);
        if (btn) return btn;
        const svgs = document.querySelectorAll('button svg path');
        for (const path of svgs) {
            const d = path.getAttribute('d');
            if (d && (d.includes('M21 3l-6.5 18') || d.includes('M10 14l11 -11'))) return path.closest('button');
        }
        return null;
    }

    function findPrivacyButton() {
        // 1. 優先透過 SVG 特徵碼尋找
        const paths = document.querySelectorAll('path');
        for (const path of paths) {
            const d = path.getAttribute('d');
            if (d && d.startsWith(LOCK_ICON_PATH_SIGNATURE)) {
                const btn = path.closest('button') || path.closest('[role="button"]');
                if (btn) return btn;
            }
        }

        // 2. 備用：透過關鍵字尋找
        const xpathConditions = PRIVACY_KEYWORDS.map(k => `contains(., '${k}')`).join(' or ');
        const v13Xpath = `//button[${xpathConditions}]`;
        try {
            const result = document.evaluate(v13Xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) return result.singleNodeValue;
        } catch (e) { }

        // 3. 最後備案
        try {
            const result = document.evaluate(HARDCODED_XPATH, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) return result.singleNodeValue;
        } catch (e) { }

        return null;
    }

    function runGrokAutomation() {
        if (!GM_getValue('is_fact_checking', false)) return;
        const configAutoSend = GM_getValue('cfg_auto_send', false);
        const forceSend = GM_getValue('force_direct_send', false);
        const shouldSend = forceSend || configAutoSend;

        createSidebarToggle();
        let statusTitle = shouldSend ? LangSystem.getText('mode_direct') : LangSystem.getText('mode_std');
        if (forceSend) statusTitle = LangSystem.getText('mode_fast');

        showCurtain(LangSystem.getText('init'), statusTitle);
        let attempts = 0;
        const maxAttempts = 30;
        const privacySkipThreshold = 6;
        let hasTriedPrivacy = false;

        const interval = setInterval(() => {
            try {
                attempts++;
                removeGrokAds();

                if (!hasTriedPrivacy) {
                    const targetBtn = findPrivacyButton();
                    if (targetBtn) {
                        const btnText = targetBtn.innerText || "";
                        if (!btnText.includes("圖片") && !btnText.includes("Image") && !btnText.includes("消息")) {
                            setTimeout(() => safeSimulateClick(targetBtn), 50);
                            hasTriedPrivacy = true;
                            updateCurtainText(LangSystem.getText('privacy_check'), statusTitle);
                        }
                    } else if (attempts > privacySkipThreshold) {
                        console.warn('[GrokFix] Skip privacy check (Timeout)');
                        hasTriedPrivacy = true;
                        updateCurtainText(LangSystem.getText('privacy_skip'), LangSystem.getText('privacy_skip_sub'));
                    }
                }

                if (hasTriedPrivacy || attempts > privacySkipThreshold) {
                    const payload = GM_getValue('check_payload', '');
                    const inputSelectors = [
                        'textarea[placeholder*="Grok"]', 'textarea[aria-label*="Grok"]',
                        'textarea[data-testid="grok-input"]', 'textarea'
                    ];
                    const textarea = findAny(inputSelectors);

                    if (textarea && payload) {
                        clearInterval(interval);
                        updateCurtainText(LangSystem.getText('writing'), statusTitle);

                        setTimeout(() => {
                            simulateTypeInput(textarea, payload);

                            if (shouldSend) {
                                updateCurtainText(LangSystem.getText('sending'), statusTitle);
                                setTimeout(() => {
                                    if (!textarea.value) simulateTypeInput(textarea, payload);
                                    const sendBtn = findSendButton();
                                    if (sendBtn) {
                                        safeSimulateClick(sendBtn);
                                        updateCurtainText(LangSystem.getText('done'));
                                    } else {
                                        updateCurtainText(LangSystem.getText('error_btn'), LangSystem.getText('error_btn_sub'));
                                    }
                                    cleanup();
                                }, 800);
                            } else {
                                updateCurtainText(LangSystem.getText('done_manual'), LangSystem.getText('done_manual_sub'));
                                cleanup();
                            }
                        }, 500);
                    } else if (attempts >= maxAttempts) {
                        updateCurtainText(LangSystem.getText('error_timeout'), LangSystem.getText('error_timeout_sub'));
                        cleanup();
                        clearInterval(interval);
                    }
                }
            } catch (err) {
                console.error('[GrokFix] Automation Error:', err);
                GM_deleteValue('is_fact_checking');
                clearInterval(interval);
                updateCurtainText(LangSystem.getText('error_script'), LangSystem.getText('error_script_sub'));
                setTimeout(() => hideCurtain(1000), 2000);
            }
        }, 500);
    }

    function cleanup() {
        GM_deleteValue('is_fact_checking');
        GM_deleteValue('check_payload');
        GM_deleteValue('force_direct_send');
        hideCurtain(800);
    }

    function createGrokButton(getUrlFn, isThreads = false) {
        const btn = document.createElement('button');
        btn.className = 'my-grok-robot-btn';
        if (isThreads) btn.classList.add('threads-grok-btn');
        btn.innerHTML = ICONS.ROBOT;
        btn.title = '點擊: 查核 / 長按1秒: 強制自動送出';
        let pressTimer = null;
        let isLongPress = false;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
        });
        btn.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isLongPress = false;
            GM_setValue('force_direct_send', false);

            btn.style.transition = 'transform 1s ease-out';
            pressTimer = setTimeout(() => {
                isLongPress = true;
                btn.innerHTML = ICONS.ROCKET;
                btn.classList.add('charging');
            }, 800);
        });
        btn.addEventListener('mouseleave', () => {
            if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
            if (!isLongPress) {
                btn.classList.remove('charging');
                btn.style.transition = 'all 0.2s';
                btn.style.transform = 'scale(1)';
                if (btn.innerHTML !== ICONS.SENDING) btn.innerHTML = ICONS.ROBOT;
            }
        });
        btn.addEventListener('mouseup', (e) => {
            if (e.button !== 0) return;
            if (pressTimer) clearTimeout(pressTimer);
            e.stopPropagation(); e.preventDefault();

            const url = getUrlFn();
            if (!url) return;

            const currentPrompt = LangSystem.getPrompt();
            const text = `${currentPrompt}${url}`;

            GM_setValue('is_fact_checking', true);
            GM_setValue('check_payload', text);

            if (isLongPress) {
                GM_setValue('force_direct_send', true);
                console.log('Mode: Force Direct Send (Long Press)');
            } else {
                GM_setValue('force_direct_send', false);
                console.log('Mode: Standard (Short Press)');
            }

            btn.classList.remove('charging');
            btn.style.transition = 'all 0.2s';
            btn.style.transform = 'scale(1)';
            btn.innerHTML = ICONS.SENDING;
            setTimeout(() => btn.innerHTML = ICONS.ROBOT, 2000);

            // 修正：增加 150ms 延遲，確保 GM_setValue 有足夠時間寫入資料，避免新分頁讀取到 null
            setTimeout(() => {
                GM_openInTab(GROK_URL, { active: true });
            }, 150);
        });
        return btn;
    }

    const AdapterX = {
        isMatch: () => location.hostname.includes('twitter.com') || location.hostname.includes('x.com'),
        init: () => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'ARTICLE') AdapterX.insertBtn(node);
                            else node.querySelectorAll?.('article').forEach(AdapterX.insertBtn);
                        }
                    });
                });
                document.querySelectorAll('article').forEach(AdapterX.insertBtn);
            });
            observer.observe(document.body, { childList: true, subtree: true });
            document.querySelectorAll('article').forEach(AdapterX.insertBtn);
        },
        insertBtn: (article) => {
            if (article.querySelector('.my-grok-robot-btn')) return;
            const targetAnchor = article.querySelector('[aria-label="Grok"], [aria-label="解釋這則貼文"], [data-testid="caret"], [aria-label="More"], [aria-label="更多"]');
            const fallbackContainer = article.querySelector('div[role="group"]');
            const finalTarget = targetAnchor || (fallbackContainer ? fallbackContainer.lastElementChild : null);

            if (!finalTarget) return;

            const getUrl = () => {
                const linkElement = article.querySelector('a[href*="/status/"] > time');
                if (linkElement) {
                    let url = linkElement.parentElement.getAttribute('href');
                    if (!url.startsWith('/')) url = '/' + url;
                    return `https://x.com${url}`;
                }
                const fallback = article.querySelector('a[href*="/status/"]');
                if (fallback) {
                    let url = fallback.getAttribute('href');
                    return `https://x.com${url.startsWith('/') ? url : '/' + url}`;
                }
                return window.location.href;
            };

            const btn = createGrokButton(getUrl, false);
            const container = finalTarget.parentElement;
            if (container) container.insertBefore(btn, finalTarget);
        }
    };

    const AdapterThreads = {
        isMatch: () => location.hostname.includes('threads'),
        init: () => {
            setInterval(AdapterThreads.scan, 1500);
        },
        scan: () => {
            const svgs = document.querySelectorAll('svg[aria-label*="分享"], svg[aria-label*="Share"], svg[aria-label*="Send"], svg[aria-label*="Repost"]');
            svgs.forEach(svg => {
                const btnRole = svg.closest('[role="button"]');
                if (!btnRole) return;
                const toolbar = btnRole.parentElement;
                if (!toolbar) return;
                if (toolbar.querySelector('.my-grok-robot-btn')) return;
                const robotBtn = createGrokButton(() => AdapterThreads.getUrl(toolbar), true);
                toolbar.appendChild(robotBtn);
            });
        },
        getUrl: (toolbarElement) => {
            let current = toolbarElement;
            for (let i = 0; i < 8; i++) {
                if (!current) break;
                const postLink = current.querySelector('a[href*="/post/"]');
                if (postLink) {
                    const href = postLink.getAttribute('href');
                    return `https://www.threads.net${href}`;
                }
                current = current.parentElement;
            }
            if (window.location.href.includes('/post/')) return window.location.href;
            return null;
        }
    };

    function init() {
        registerMenus();
        if (!GM_getValue('cfg_lang_code')) {
            let defaultCode = 'zh-TW';
            const navLang = navigator.language;
            if (navLang.includes('en')) defaultCode = 'en';
            else if (navLang.includes('zh-CN')) defaultCode = 'zh-CN';
            else if (navLang.includes('ja')) defaultCode = 'ja';
            else if (navLang.includes('ko')) defaultCode = 'ko';

            GM_setValue('cfg_lang_code', defaultCode);
            console.log(`[GrokCheck] First run detected. Default set to ${defaultCode}. Showing UI.`);
            setTimeout(() => showLanguageSelectionUI(), 2000);
        }

        if (window.location.href.includes('/i/grok')) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', runGrokAutomation);
            } else {
                runGrokAutomation();
            }
            const obs = new MutationObserver(() => {
                removeGrokAds();
                if (GM_getValue('is_fact_checking', false)) createSidebarToggle();
            });
            obs.observe(document.body, { childList: true, subtree: true });
        } else {
            if (AdapterThreads.isMatch()) {
                console.log('Grok Checker: Threads 模式啟動');
                AdapterThreads.init();
            } else if (AdapterX.isMatch()) {
                console.log('Grok Checker: X 模式啟動');
                AdapterX.init();
            }
        }
    }

    init();
})();
// ==UserScript==
// @name         Firefox Force English bish - UI Only
// @namespace    http://tampermonkey.net/
// @description  シンプルな翻訳トグルボタン - 自動リダイレクトなし
// @match        *://*/*
// @run-at       document-end
// @version      1.2
// @icon         https://icons8.com/icon/tM5WsaZgzeEC/jake
// @author       M3X1C0
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563325/Firefox%20Force%20English%20bish%20-%20UI%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/563325/Firefox%20Force%20English%20bish%20-%20UI%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 重複実行防止
    if (document.getElementById('translateToggleBtn')) {
        return;
    }

    // ========== 設定定数 ==========
    const CONFIG = {
        // ボタン設定
        BUTTON: {
            WIDTH: 140,
            HEIGHT: 40,
            MIN_WIDTH: 140,
            DEFAULT_LEFT: 20,
            DEFAULT_TOP: 20,
            COLORS: {
                NORMAL: '#1a73e8',
                HOVER: '#1558b0',
                TRANSLATING: '#d93025',
                TRANSLATING_HOVER: '#a50e0e'
            },
            SHADOW: '0 4px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)',
            TRANSITION: 'all 0.2s ease-in-out',
            BORDER_RADIUS: '8px'
        },
        // 保存キー
        STORAGE_KEYS: {
            TOP: 'translateBtn-top',
            LEFT: 'translateBtn-left',
            STATE: 'translateBtn-state'
        },
        // 翻訳サービス判定用ドメイン
        TRANSLATE_DOMAINS: [
            "translate.google.com",
            "translate.googleusercontent.com"
        ]
    };

    // ========== 状態管理 ==========
    const state = {
        isTranslating: false,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        positionStart: { left: 0, top: 0 },
        clickStart: { x: 0, y: 0 }
    };

    // ========== ストレージ管理 ==========
    const storage = {
        // 位置情報の保存
        savePosition(top, left) {
            const methods = [
                () => {
                    if (typeof GM_setValue !== 'undefined') {
                        GM_setValue(CONFIG.STORAGE_KEYS.TOP, top.toString());
                        GM_setValue(CONFIG.STORAGE_KEYS.LEFT, left.toString());
                    }
                },
                () => {
                    localStorage.setItem(CONFIG.STORAGE_KEYS.TOP, top);
                    localStorage.setItem(CONFIG.STORAGE_KEYS.LEFT, left);
                }
            ];
            
            methods.forEach(method => {
                try {
                    method();
                } catch (e) {
                    console.debug('Storage method failed:', e);
                }
            });
        },

        // 位置情報の取得
        getPosition(key, defaultValue) {
            const sources = [
                () => typeof GM_getValue !== 'undefined' ? GM_getValue(key) : null,
                () => localStorage.getItem(key)
            ];

            for (const source of sources) {
                try {
                    const value = source();
                    if (value !== null && value !== undefined) {
                        return value;
                    }
                } catch (e) {
                    console.debug('Storage read failed:', e);
                }
            }
            
            return defaultValue;
        }
    };

    // ========== 翻訳状態判定 ==========
    function checkTranslationState() {
        const hostname = window.location.hostname;
        const isTranslateDomain = CONFIG.TRANSLATE_DOMAINS.some(domain => 
            hostname.includes(domain)
        );
        const isTranslateGoog = hostname.endsWith(".translate.goog");
        
        state.isTranslating = isTranslateDomain || isTranslateGoog;
        return state.isTranslating;
    }

    // ========== UI作成 ==========
    function createUI() {
        // スタイルの追加
        const style = document.createElement('style');
        style.textContent = `
            #translateToggleBtn {
                /* レイアウト */
                position: fixed !important;
                z-index: 2147483647 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                
                /* サイズ */
                width: ${CONFIG.BUTTON.WIDTH}px !important;
                height: ${CONFIG.BUTTON.HEIGHT}px !important;
                min-width: ${CONFIG.BUTTON.MIN_WIDTH}px !important;
                
                /* 視覚スタイル */
                background-color: ${CONFIG.BUTTON.COLORS.NORMAL} !important;
                color: white !important;
                border: none !important;
                border-radius: ${CONFIG.BUTTON.BORDER_RADIUS} !important;
                box-shadow: ${CONFIG.BUTTON.SHADOW} !important;
                
                /* タイポグラフィ */
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                           "Helvetica Neue", Arial, sans-serif !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                letter-spacing: 0.25px !important;
                
                /* インタラクション */
                cursor: move !important;
                user-select: none !important;
                touch-action: none !important;
                transition: ${CONFIG.BUTTON.TRANSITION} !important;
                outline: none !important;
                
                /* テキスト */
                text-align: center !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                padding: 0 16px !important;
            }
            
            #translateToggleBtn:hover {
                background-color: ${CONFIG.BUTTON.COLORS.HOVER} !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 6px 16px rgba(0,0,0,0.2), 0 2px 5px rgba(0,0,0,0.15) !important;
            }
            
            #translateToggleBtn:active {
                transform: translateY(0) !important;
                transition: transform 0.1s !important;
            }
            
            #translateToggleBtn.translating {
                background-color: ${CONFIG.BUTTON.COLORS.TRANSLATING} !important;
            }
            
            #translateToggleBtn.translating:hover {
                background-color: ${CONFIG.BUTTON.COLORS.TRANSLATING_HOVER} !important;
            }
            
            #translateToggleBtn.dragging {
                opacity: 0.8 !important;
                cursor: grabbing !important;
                transform: scale(1.02) !important;
                box-shadow: 0 8px 20px rgba(0,0,0,0.25) !important;
            }
            
            /* モバイル対応 */
            @media (max-width: 768px) {
                #translateToggleBtn {
                    width: 120px !important;
                    height: 36px !important;
                    min-width: 120px !important;
                    font-size: 13px !important;
                }
            }
            
            /* 高コントラストモード対応 */
            @media (prefers-contrast: high) {
                #translateToggleBtn {
                    border: 2px solid #000 !important;
                }
            }
        `;
        document.head.appendChild(style);

        // ボタン作成
        const btn = document.createElement('button');
        btn.id = 'translateToggleBtn';
        btn.type = 'button';
        btn.title = 'クリック: 翻訳切り替え / ドラッグ: 移動';
        btn.setAttribute('aria-label', '翻訳切り替えボタン');

        // 位置の復元
        const savedTop = storage.getPosition(
            CONFIG.STORAGE_KEYS.TOP, 
            CONFIG.BUTTON.DEFAULT_TOP.toString()
        );
        const savedLeft = storage.getPosition(
            CONFIG.STORAGE_KEYS.LEFT,
            (window.innerWidth - CONFIG.BUTTON.WIDTH - CONFIG.BUTTON.DEFAULT_LEFT).toString()
        );

        btn.style.top = `${parseInt(savedTop)}px`;
        btn.style.left = `${parseInt(savedLeft)}px`;

        // 翻訳状態の更新
        updateButtonState(btn);
        
        return btn;
    }

    // ========== ボタン状態更新 ==========
    function updateButtonState(button) {
        checkTranslationState();
        
        if (state.isTranslating) {
            button.textContent = '翻訳終了';
            button.classList.add('translating');
            button.classList.remove('translating', 'exiting');
        } else {
            button.textContent = '翻訳開始';
            button.classList.remove('translating');
        }
    }

    // ========== ドラッグ処理 ==========
    function setupDrag(button) {
        // ドラッグ開始
        button.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // 左クリックのみ
            
            state.isDragging = true;
            state.dragStart.x = e.clientX;
            state.dragStart.y = e.clientY;
            state.positionStart.left = parseInt(button.style.left) || 0;
            state.positionStart.top = parseInt(button.style.top) || 0;
            state.clickStart.x = e.clientX;
            state.clickStart.y = e.clientY;
            
            button.classList.add('dragging');
            e.preventDefault();
            e.stopPropagation();
        });

        // ドラッグ中
        document.addEventListener('mousemove', (e) => {
            if (!state.isDragging) return;
            
            e.preventDefault();
            
            const deltaX = e.clientX - state.dragStart.x;
            const deltaY = e.clientY - state.dragStart.y;
            
            let newLeft = state.positionStart.left + deltaX;
            let newTop = state.positionStart.top + deltaY;
            
            // 画面内に制限
            const maxLeft = window.innerWidth - button.offsetWidth;
            const maxTop = window.innerHeight - button.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            button.style.left = `${newLeft}px`;
            button.style.top = `${newTop}px`;
        });

        // ドラッグ終了
        document.addEventListener('mouseup', (e) => {
            if (!state.isDragging) return;
            
            state.isDragging = false;
            button.classList.remove('dragging');
            
            // 位置を保存
            const top = parseInt(button.style.top);
            const left = parseInt(button.style.left);
            storage.savePosition(top, left);
            
            // クリック判定（5px以内の移動はクリックとみなす）
            const moveDistance = Math.sqrt(
                Math.pow(e.clientX - state.clickStart.x, 2) +
                Math.pow(e.clientY - state.clickStart.y, 2)
            );
            
            if (moveDistance < 5) {
                handleButtonClick(e);
            }
        });
    }

    // ========== クリック処理 ==========
    function handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (state.isTranslating) {
            exitTranslation();
        } else {
            startTranslation();
        }
    }

    // ========== 翻訳開始 ==========
    function startTranslation() {
        const currentUrl = new URL(window.location.href);
        
        // 既存の言語パラメータを削除
        currentUrl.searchParams.delete('lang');
        currentUrl.searchParams.delete('hl');
        
        const cleanUrl = `${currentUrl.origin}${currentUrl.pathname}${currentUrl.search}`;
        const translateUrl = `https://translate.google.com/translate?sl=auto&tl=ja&u=${encodeURIComponent(cleanUrl)}`;
        
        // 新しいタブで開く（ユーザビリティ向上）
        const newWindow = window.open(translateUrl, '_blank');
        if (!newWindow) {
            // ポップアップブロックされている場合は現在のタブで開く
            window.location.href = translateUrl;
        }
    }

    // ========== 翻訳終了 ==========
    function exitTranslation() {
        const currentUrl = new URL(window.location.href);
        const hostname = currentUrl.hostname;
        
        let originalUrl = '';
        
        // Google翻訳サービスからの復元
        if (hostname.includes('translate.google.com') || 
            hostname.includes('translate.googleusercontent.com')) {
            const uParam = currentUrl.searchParams.get('u');
            if (uParam) {
                originalUrl = decodeURIComponent(uParam);
            }
        }
        // .translate.googドメインからの復元
        else if (hostname.endsWith('.translate.goog')) {
            const originalDomain = hostname
                .replace('.translate.goog', '')
                .replace(/-/g, '.');
            const path = currentUrl.pathname;
            
            const searchParams = new URLSearchParams();
            currentUrl.searchParams.forEach((value, key) => {
                if (!key.startsWith('_x_tr_')) {
                    searchParams.set(key, value);
                }
            });
            
            const search = searchParams.toString();
            originalUrl = `https://${originalDomain}${path}${search ? '?' + search : ''}`;
        }
        
        if (originalUrl) {
            window.location.href = originalUrl;
        } else {
            alert('元のURLを取得できませんでした。手動で移動してください。');
        }
    }

    // ========== 初期化 ==========
    function initialize() {
        const button = createUI();
        document.body.appendChild(button);
        
        setupDrag(button);
        
        // クリックイベントの設定（直接クリック用）
        button.addEventListener('click', handleButtonClick);
        
        // ウィンドウリサイズ時の位置調整
        window.addEventListener('resize', () => {
            const maxLeft = window.innerWidth - CONFIG.BUTTON.WIDTH;
            const maxTop = window.innerHeight - CONFIG.BUTTON.HEIGHT;
            
            let left = parseInt(button.style.left) || 0;
            let top = parseInt(button.style.top) || 0;
            
            left = Math.min(left, maxLeft);
            top = Math.min(top, maxTop);
            
            button.style.left = `${Math.max(0, left)}px`;
            button.style.top = `${Math.max(0, top)}px`;
            
            // 新しい位置を保存
            storage.savePosition(top, left);
        });
        
        // ページ遷移時に状態を更新
        const observer = new MutationObserver(() => {
            updateButtonState(button);
        });
        
        observer.observe(document.title, { 
            subtree: true, 
            characterData: true, 
            childList: true 
        });
    }

    // スクリプト実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
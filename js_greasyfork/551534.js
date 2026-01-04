// ==UserScript==
// @name         Claude.ai用日本語入力修正（Safari用）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  MacOSのSafariでClaude.aiを使用する際に日本語入力時のEnterキー競合を解決
// @author       djshigel
// @match        https://*.claude.ai/*
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-start
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/551534/Claudeai%E7%94%A8%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%85%A5%E5%8A%9B%E4%BF%AE%E6%AD%A3%EF%BC%88Safari%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551534/Claudeai%E7%94%A8%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%85%A5%E5%8A%9B%E4%BF%AE%E6%AD%A3%EF%BC%88Safari%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // フラグとタイムスタンプの保存用
    let isComposing = false;
    let lastCompositionEndTime = 0;
    const THRESHOLD_MS = 300; // 日本語確定後の送信防止時間（ミリ秒）

    // Enter送信が有効かをチェックする
    function isEnterSubmitAllowed() {
        // 現在入力中か、または入力確定から閾値時間以内ならfalse
        if (isComposing) return false;

        const now = Date.now();
        if (now - lastCompositionEndTime < THRESHOLD_MS) return false;

        return true;
    }

    // キーイベントの完全なインターセプト（多重防御）
    function interceptKeyEvents() {
        // キーイベントを複数のフェーズでブロック
        const blockEnterHandler = function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                if (!isEnterSubmitAllowed()) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('グローバルEnterキーブロック:', event.type);
                    return false;
                }
            }
        };
        
        // 複数のイベントタイプでブロック（多重防御）
        document.addEventListener('keydown', blockEnterHandler, true);
        document.addEventListener('keypress', blockEnterHandler, true);
        document.addEventListener('keyup', blockEnterHandler, true);
        
        // バブリングフェーズでも念のためブロック
        document.addEventListener('keydown', blockEnterHandler, false);
        document.addEventListener('keypress', blockEnterHandler, false);

        // 入力開始イベント
        document.addEventListener('compositionstart', function(event) {
            isComposing = true;
            console.log('日本語入力開始');
        }, true);

        // 入力確定イベント
        document.addEventListener('compositionend', function(event) {
            isComposing = false;
            lastCompositionEndTime = Date.now();
            console.log('日本語入力確定');
        }, true);
    }

    // テキストエリア固有の処理
    function setupTextareas() {
        // Claude.aiの入力欄を取得（標準的なテキストエリアとプロンプト入力欄の両方を対象）
        const inputElements = document.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]');

        inputElements.forEach(input => {
            // 既に処理済みの場合はスキップ
            if (input.getAttribute('japanese-fix-applied')) return;

            // 入力要素固有のハンドラ（多重防御）
            const inputBlockHandler = function(event) {
                if (event.key === 'Enter' && !event.shiftKey && !isEnterSubmitAllowed()) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    event.stopPropagation();
                    console.log('入力欄でのEnterキーブロック:', event.type);
                    return false;
                }
            };
            
            // 複数のイベントタイプでブロック
            input.addEventListener('keydown', inputBlockHandler, true);
            input.addEventListener('keypress', inputBlockHandler, true);
            input.addEventListener('keyup', inputBlockHandler, true);
            input.addEventListener('keydown', inputBlockHandler, false);
            input.addEventListener('keypress', inputBlockHandler, false);

            // 入力要素特有のcomposition処理
            input.addEventListener('compositionstart', function() {
                isComposing = true;
                console.log('入力欄で日本語入力開始');
            }, true);

            input.addEventListener('compositionend', function() {
                isComposing = false;
                lastCompositionEndTime = Date.now();
                console.log('入力欄で日本語入力確定');
            }, true);

            // 処理済みマーク
            input.setAttribute('japanese-fix-applied', 'true');
        });
    }

    // スタイルを動的に適用/削除する関数
    function updateSendButtonStyle() {
        // $('[data-state="closed"] > button > svg').parentElementで選択できる送信ボタンを探す
        const svgElements = document.querySelectorAll('[data-state="closed"] > button > svg');
        
        svgElements.forEach(svg => {
            const button = svg.parentElement;
            if (button && button.tagName === 'BUTTON') {
                if (!isEnterSubmitAllowed()) {
                    // Enter防止中のスタイルを適用
                    if (!button.getAttribute('japanese-style-applied')) {
                        button.style.setProperty('background', 'transparent', 'important');
                        button.style.setProperty('border', '1px solid #666', 'important');
                        button.setAttribute('japanese-style-applied', 'true');
                        
                        // :not(:hover)効果のためのイベントリスナー
                        const mouseEnterHandler = () => {
                            if (!isEnterSubmitAllowed()) {
                                button.style.removeProperty('background');
                                button.style.removeProperty('border');
                            }
                        };
                        const mouseLeaveHandler = () => {
                            if (!isEnterSubmitAllowed()) {
                                button.style.setProperty('background', 'transparent', 'important');
                                button.style.setProperty('border', '1px solid #666', 'important');
                            }
                        };
                        
                        button.addEventListener('mouseenter', mouseEnterHandler);
                        button.addEventListener('mouseleave', mouseLeaveHandler);
                        
                        // クリーンアップのためにハンドラーを保存
                        button._mouseEnterHandler = mouseEnterHandler;
                        button._mouseLeaveHandler = mouseLeaveHandler;
                    }
                } else {
                    // Enter防止が解除されたらスタイルを元に戻す
                    if (button.getAttribute('japanese-style-applied')) {
                        button.style.removeProperty('background');
                        button.style.removeProperty('border');
                        button.removeAttribute('japanese-style-applied');
                        
                        // イベントリスナーをクリーンアップ
                        if (button._mouseEnterHandler) {
                            button.removeEventListener('mouseenter', button._mouseEnterHandler);
                            delete button._mouseEnterHandler;
                        }
                        if (button._mouseLeaveHandler) {
                            button.removeEventListener('mouseleave', button._mouseLeaveHandler);
                            delete button._mouseLeaveHandler;
                        }
                    }
                }
            }
        });
    }

    // 送信ボタンをオーバーライドする関数
    function overrideSendButton() {
        // 一定間隔で送信ボタンを検索
        setInterval(() => {
            // Claude.aiの送信ボタンを探す（複数のセレクタをカバー）
            const sendButtons = document.querySelectorAll('button[type="submit"], button[aria-label*="send"], button[aria-label*="Send"], button.send-button, form button');

            sendButtons.forEach(button => {
                // 既に処理済みならスキップ
                if (button.getAttribute('japanese-fix-applied')) return;

                // クリックイベントを完全にブロック（多重防御）
                const blockClickHandler = function(event) {
                    if (!isEnterSubmitAllowed()) {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                        event.stopPropagation();
                        console.log('送信ボタンクリックをブロック:', event.type);
                        return false;
                    }
                };
                
                // 複数のクリックイベントでブロック
                button.addEventListener('click', blockClickHandler, true);
                button.addEventListener('mousedown', blockClickHandler, true);
                button.addEventListener('mouseup', blockClickHandler, true);
                
                // オリジナルのonclickも保護
                const originalClick = button.onclick;
                button.onclick = function(event) {
                    if (!isEnterSubmitAllowed()) {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                        event.stopPropagation();
                        console.log('送信ボタンonclickをブロック');
                        return false;
                    }
                    if (originalClick) return originalClick.call(this, event);
                    return true;
                };

                // 処理済みマーク
                button.setAttribute('japanese-fix-applied', 'true');
            });
            
            // 送信ボタンのスタイルを更新
            updateSendButtonStyle();
        }, 100); // より頻繁にチェックしてスタイル更新の応答性を向上
    }

    // DOM要素の直接制御（仕様変更対応）
    function overrideDOMInteraction() {
        // 送信ボタンの無効化処理
        setInterval(() => {
            if (!isEnterSubmitAllowed()) {
                // 送信ボタンを一時的に無効化
                const sendButtons = document.querySelectorAll(
                    '[data-state="closed"] > button, button[type="submit"], button[aria-label*="send"], button[aria-label*="Send"]'
                );
                
                sendButtons.forEach(button => {
                    if (!button.hasAttribute('original-disabled')) {
                        button.setAttribute('original-disabled', button.disabled || 'false');
                    }
                    button.disabled = true;
                    button.style.pointerEvents = 'none';
                    button.setAttribute('data-japanese-blocked', 'true');
                });
                
                // テキストエリアのフォーカス制御
                const textareas = document.querySelectorAll('textarea, [contenteditable="true"], [role="textbox"]');
                textareas.forEach(textarea => {
                    if (document.activeElement === textarea && textarea.getAttribute('data-composition-active') !== 'true') {
                        textarea.setAttribute('data-composition-active', 'true');
                        // Enterキーのdefaultを完全に無効化
                        textarea.style.cssText += '; pointer-events: auto !important;';
                    }
                });
            } else {
                // Enter送信が許可されたら元に戻す
                const blockedButtons = document.querySelectorAll('[data-japanese-blocked="true"]');
                blockedButtons.forEach(button => {
                    const originalDisabled = button.getAttribute('original-disabled');
                    button.disabled = originalDisabled === 'true';
                    button.style.pointerEvents = '';
                    button.removeAttribute('data-japanese-blocked');
                    button.removeAttribute('original-disabled');
                });
                
                const composingTextareas = document.querySelectorAll('[data-composition-active="true"]');
                composingTextareas.forEach(textarea => {
                    textarea.removeAttribute('data-composition-active');
                });
            }
        }, 50); // 高頻度でチェック
    }

    // フォーム送信を直接制御（多重防御）
    function overrideFormSubmission() {
        // フォーム送信の監視（キャプチャ・バブリング両方）
        const blockSubmitHandler = function(event) {
            if (!isEnterSubmitAllowed()) {
                event.stopImmediatePropagation();
                event.preventDefault();
                event.stopPropagation();
                console.log('フォーム送信をブロック:', event.type);
                return false;
            }
        };
        
        document.addEventListener('submit', blockSubmitHandler, true);
        document.addEventListener('submit', blockSubmitHandler, false);

        // Claude.aiで可能性のあるカスタム送信処理をインターセプト
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            if (!isEnterSubmitAllowed() && args[0] && typeof args[0] === 'string' &&
                (args[0].includes('/api/') || args[0].includes('/conversation') || args[0].includes('/claude'))) {
                console.log('fetch APIによる送信をブロック', args[0]);
                return Promise.reject(new Error('日本語入力中のため送信をブロック'));
            }
            return originalFetch.apply(this, args);
        };
        
        // XMLHttpRequestもインターセプト  
        const originalXHRSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(...args) {
            if (!isEnterSubmitAllowed() && this.responseURL && 
                (this.responseURL.includes('/api/') || this.responseURL.includes('/conversation') || this.responseURL.includes('/claude'))) {
                console.log('XMLHttpRequestによる送信をブロック');
                return;
            }
            return originalXHRSend.apply(this, args);
        };
        
        // Enterキー自体を最上位レベルでインターセプト（仕様変更対応）
        const ultimateEnterBlocker = function(event) {
            if (event.key === 'Enter' && !event.shiftKey && !isEnterSubmitAllowed()) {
                // イベントチェーンを完全に断ち切る
                event.stopImmediatePropagation();
                event.preventDefault();
                event.stopPropagation();
                
                // ネイティブイベントの伝播も阻止
                Object.defineProperty(event, 'defaultPrevented', { value: true, writable: false });
                Object.defineProperty(event, 'cancelBubble', { value: true, writable: false });
                
                console.log('最終防御ラインでEnterキーブロック:', event.type);
                return false;
            }
        };
        
        // 最高優先度でキャプチャ
        window.addEventListener('keydown', ultimateEnterBlocker, true);
        window.addEventListener('keypress', ultimateEnterBlocker, true);
        window.addEventListener('keyup', ultimateEnterBlocker, true);
    }

    // DOM変更の監視
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            setupTextareas();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初期化関数
    function initialize() {
        console.log('Claude.ai日本語入力修正スクリプトを初期化');
        interceptKeyEvents();
        setupTextareas();
        overrideSendButton();
        overrideDOMInteraction(); // 新しいDOM制御を追加
        overrideFormSubmission();
        observeDOM();
    }

    // ページ読み込み時に実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 早期実行（document-startで）
    interceptKeyEvents();
    overrideDOMInteraction(); // DOM制御を早期開始
    overrideFormSubmission();
})();

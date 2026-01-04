// ==UserScript==
// @name         Pitroytech Multi Search Support - Auto Submit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hỗ trợ tự động điền và gửi tin nhắn cho ChatGPT, Claude và Gemini (Hybrid Mode)
// @author       Pitroytech
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://gemini.google.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556752/Pitroytech%20Multi%20Search%20Support%20-%20Auto%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/556752/Pitroytech%20Multi%20Search%20Support%20-%20Auto%20Submit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== CẤU HÌNH CHUNG ====================
    const CONFIG = {
        chatgpt: {
            name: 'ChatGPT',
            urlParams: ['?prompt=', '?q=', '&prompt='],
            conversationPattern: '/c/',
            buttonSelector: '#composer-submit-button'
        },
        claude: {
            name: 'Claude',
            urlParams: ['new?q='],
            conversationPattern: '/chat/',
            buttonSelector: 'button[aria-label="Send message"]'
        },
        gemini: {
            name: 'Gemini',
            urlParams: ['prompt='], // URL Gemini có dạng ?prompt=...
            conversationPattern: '/app/', // Khi vào hội thoại sẽ dài hơn /app
            // Selector input và button của Gemini
            inputSelector: 'rich-textarea div[contenteditable="true"], .ql-editor, div[role="textbox"]',
            buttonSelector: 'button.send-button, button[aria-label*="Send"], button:has(.send-button-icon), button:has(mat-icon[data-mat-icon-name="send"])'
        }
    };

    function log(msg, color = '#4CAF50') {
        console.log('%c[Pitroytech AI] ' + msg, `color: ${color}; font-weight: bold;`);
    }

    function detectPlatform() {
        const h = window.location.hostname;
        if (h.includes('chatgpt')) return 'chatgpt';
        if (h.includes('claude')) return 'claude';
        if (h.includes('gemini')) return 'gemini';
        return null;
    }

    const platform = detectPlatform();
    if (!platform) return;

    const config = CONFIG[platform];

    // ==================== LOGIC RIÊNG CHO GEMINI (Silent & Fast) ====================
    // Gemini cần chạy ngay từ document-start để bắt prompt và xóa URL
    if (platform === 'gemini') {
        const url = new URL(window.location.href);
        const txt = url.searchParams.get('prompt');

        // Nếu không có prompt thì nghỉ
        if (!txt) return;

        // Xóa prompt khỏi URL ngay lập tức cho đẹp
        url.searchParams.delete('prompt');
        history.replaceState(null, '', url.toString());

        log('Gemini Hybrid Mode Activated.');

        // Hàm thực thi (Chạy khi DOM sẵn sàng)
        const runGemini = () => {
            // Dùng MutationObserver để bắt ngay khi ô input xuất hiện
            const obs = new MutationObserver((_, o) => {
                const input = document.querySelector(config.inputSelector);
                if (input) {
                    o.disconnect(); // Dừng quan sát input

                    log('🎯 Input found. Filling...');
                    input.focus();
                    document.execCommand('insertText', false, txt);

                    // Tìm nút gửi (Button Observer)
                    const btnObs = new MutationObserver((_, bo) => {
                        const btn = document.querySelector(config.buttonSelector);

                        // Kiểm tra nút tồn tại và không disabled
                        if (btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true') {
                            log('🚀 Clicking submit...');
                            btn.click();

                            // Click bồi thêm phát nữa vào icon con nếu cần
                            const icon = btn.querySelector('.send-button-icon, mat-icon');
                            if (icon) icon.click();

                            bo.disconnect(); // Dừng quan sát button
                        }
                    });

                    btnObs.observe(document.body, { childList: true, subtree: true, attributes: true });
                }
            });

            obs.observe(document.body, { childList: true, subtree: true });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runGemini);
        } else {
            runGemini();
        }
        return; // Kết thúc phần Gemini, không chạy xuống logic ChatGPT/Claude bên dưới
    }

    // ==================== LOGIC CHO CHATGPT & CLAUDE (Stable Logic) ====================
    // Logic cũ của bạn: Chờ 2s, Check URL, Retry click

    // Chỉ chạy ở document-idle (đợi trang load xong)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(runLegacyLogic, 2000));
    } else {
        setTimeout(runLegacyLogic, 2000);
    }

    function runLegacyLogic() {
        log('🚀 Script Auto Enter (GPT/Claude) khởi động!');

        const currentUrl = window.location.href;

        // Kiểm tra URL có prompt không
        const hasPrompt = config.urlParams.some(param => currentUrl.includes(param));
        if (!hasPrompt) return;

        // Nếu đã vào hội thoại thì thôi
        if (currentUrl.includes(config.conversationPattern)) return;

        log('✅ URL đúng! Bắt đầu tìm nút...', '#4CAF50');

        let attemptCount = 0;
        const maxAttempts = 50;
        let isCompleted = false;

        function tryClickButton() {
            if (isCompleted) return true;

            // Check lại URL lần nữa
            if (window.location.href.includes(config.conversationPattern)) {
                isCompleted = true;
                log('✅ Đã vào hội thoại -> Stop', '#4CAF50');
                return true;
            }

            attemptCount++;
            const button = document.querySelector(config.buttonSelector);

            if (button) {
                try {
                    button.click();
                    isCompleted = true;
                    log('✅ Đã nhấn nút!', '#4CAF50');

                    // Theo dõi chuyển trang
                    setTimeout(() => {
                        if (window.location.href.includes(config.conversationPattern)) {
                            log('🎉 Thành công!', '#4CAF50');
                        }
                    }, 2000);
                    return true;
                } catch (error) {
                    log('❌ Lỗi click', '#e74c3c');
                    return false;
                }
            } else {
                if (attemptCount >= maxAttempts) return false;
                setTimeout(tryClickButton, 300);
                return false;
            }
        }

        tryClickButton();
    }

})();
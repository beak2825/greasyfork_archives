// ==UserScript==
// @name         ouo.io bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypass ouo.io
// @author       nth-zik
// @match        https://ouo.io/*
// @match        https://ouo.press/*
// @match        https://*.ouo.io/*
// @match        https://*.ouo.press/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550172/ouoio%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/550172/ouoio%20bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let running = true;
    let currentUrl = window.location.href;
    let submitCount = 0;
    let pageChangeDetected = false;

    console.log('🚀 ouo.io Stop On Page Change v9.0');
    console.log('📍 Starting URL:', currentUrl);

    // Tạo UI
    function createUI() {
        const ui = document.createElement('div');
        ui.id = 'ouo-status-ui';
        ui.innerHTML = `
            <div style="
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                color: white !important;
                padding: 15px 20px !important;
                border-radius: 10px !important;
                font-family: Arial, sans-serif !important;
                font-size: 14px !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                z-index: 999999 !important;
                min-width: 280px !important;
                border: 2px solid rgba(255,255,255,0.3) !important;
            ">
                <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px;">
                    🎯 ouo.io Bypass v9.0
                </div>
                <div id="status-text" style="
                    background: rgba(255,255,255,0.1);
                    padding: 8px 12px;
                    border-radius: 5px;
                    margin-bottom: 8px;
                ">Đang khởi động...</div>
                <div id="url-monitor" style="font-size: 11px; opacity: 0.8; margin-bottom: 8px;">
                    URL: ${currentUrl.substring(0, 50)}...
                </div>
                <div id="submit-counter" style="text-align: center; font-weight: bold;">
                    Lần thử: 0
                </div>
            </div>
        `;

        document.body.appendChild(ui);
        return ui;
    }

    // Cập nhật UI
    function updateUI(status, counter = null) {
        const statusEl = document.getElementById('status-text');
        const counterEl = document.getElementById('submit-counter');
        const urlEl = document.getElementById('url-monitor');

        if (statusEl) statusEl.textContent = status;
        if (counter !== null && counterEl) counterEl.textContent = `Lần thử: ${counter}`;
        if (urlEl) urlEl.textContent = `URL: ${window.location.href.substring(0, 50)}...`;

        console.log('📊', status);
    }

    // Phát hiện chuyển trang
    function detectPageChange() {
        // Phương pháp 1: Theo dõi URL change
        const urlWatcher = setInterval(() => {
            if (!running) {
                clearInterval(urlWatcher);
                return;
            }

            if (window.location.href !== currentUrl) {
                console.log('🎉 PAGE CHANGE DETECTED!');
                console.log('📍 Old URL:', currentUrl);
                console.log('📍 New URL:', window.location.href);

                pageChangeDetected = true;
                running = false;

                updateUI('🎉 Thành công! Đã chuyển trang');

                // Đổi màu UI thành công
                const ui = document.getElementById('ouo-status-ui');
                if (ui) {
                    ui.querySelector('div').style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
                }

                clearInterval(urlWatcher);
            }
        }, 500); // Check mỗi 0.5 giây

        // Phương pháp 2: Theo dõi beforeunload
        window.addEventListener('beforeunload', function() {
            if (running) {
                console.log('🚪 beforeunload event - trang sắp chuyển');
                pageChangeDetected = true;
                running = false;
                updateUI('🚪 Đang chuyển trang...');
            }
        });

        // Phương pháp 3: Theo dõi popstate
        window.addEventListener('popstate', function() {
            if (running) {
                console.log('🔙 popstate event - navigation change');
                pageChangeDetected = true;
                running = false;
                updateUI('🔙 Navigation changed');
            }
        });

        // Phương pháp 4: Theo dõi document title change
        let lastTitle = document.title;
        const titleWatcher = setInterval(() => {
            if (!running) {
                clearInterval(titleWatcher);
                return;
            }

            if (document.title !== lastTitle) {
                console.log('📄 Title changed:', lastTitle, '->', document.title);
                lastTitle = document.title;

                // Nếu title thay đổi đáng kể, có thể là chuyển trang
                if (!document.title.toLowerCase().includes('ouo')) {
                    console.log('🎯 Có thể đã bypass thành công (title change)');
                    pageChangeDetected = true;
                    running = false;
                    updateUI('🎯 Bypass thành công! (title change)');
                }
            }
        }, 1000);
    }

    // Click I'm a human
    function clickHuman() {
        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], div[role="button"]');

        for (const btn of buttons) {
            const text = (btn.textContent || btn.value || '').toLowerCase().trim();

            if ((text.includes('human') || text.includes('verify') || text.includes('not a robot')) &&
                btn.offsetParent !== null && !btn.disabled) {

                console.log('👤 Click I\'m a human:', text);
                updateUI('👤 Đang click "I\'m a human"...');
                btn.click();
                return true;
            }
        }

        return false;
    }

    // Submit form-go
    function submitFormGo() {
        if (!running || pageChangeDetected) {
            console.log('⏹️ Stopped - không submit nữa');
            return false;
        }

        submitCount++;
        updateUI(`🔄 Đang tìm form-go... (lần ${submitCount})`, submitCount);

        const formGo = document.getElementById('form-go');

        if (formGo) {
            console.log('✅ Tìm thấy form-go, đang submit...');
            updateUI(`📤 Submit form-go (lần ${submitCount})`, submitCount);

            try {
                // Submit form
                formGo.submit();
                console.log('📤 Form submitted');

                // Backup: Click button trong form
                setTimeout(() => {
                    if (running && !pageChangeDetected) {
                        const btn = formGo.querySelector('#btn-main, button[type="submit"], button');
                        if (btn && !btn.disabled) {
                            console.log('🖱️ Backup click button');
                            btn.click();
                        }
                    }
                }, 200);

                return true;

            } catch (error) {
                console.error('❌ Submit error:', error);

                // Fallback click button
                const btn = formGo.querySelector('#btn-main, button[type="submit"], button');
                if (btn && !btn.disabled) {
                    console.log('🔄 Fallback click button');
                    btn.click();
                    return true;
                }
            }
        } else {
            console.log('❌ Không tìm thấy form-go');
            updateUI(`❌ Chưa có form-go (lần ${submitCount})`, submitCount);
        }

        return false;
    }

    // Main loop
    function startBypassLoop() {
        console.log('🔄 Bắt đầu bypass loop...');
        updateUI('🔄 Bắt đầu bypass loop...');

        // Click human trước
        setTimeout(() => {
            if (running && !pageChangeDetected) {
                clickHuman();
            }
        }, 2000);

        // Loop submit form-go
        const submitInterval = setInterval(() => {
            if (!running || pageChangeDetected) {
                console.log('⏹️ Dừng loop - page changed hoặc stopped');
                clearInterval(submitInterval);
                return;
            }

            submitFormGo();

            // Dừng sau 30 lần thử
            if (submitCount >= 30) {
                console.log('⚠️ Dừng sau 30 lần thử');
                running = false;
                updateUI('⚠️ Dừng sau 30 lần thử');
                clearInterval(submitInterval);
            }

        }, 2000); // Mỗi 2 giây
    }

    // Init
    function init() {
        console.log('🔥 Init bypass script...');

        // Tạo UI
        createUI();
        updateUI('🔥 Script đã khởi động');

        // Setup page change detection
        detectPageChange();

        // Bắt đầu bypass sau 3 giây
        setTimeout(() => {
            if (running) {
                startBypassLoop();
            }
        }, 3000);
    }

    // Chạy script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

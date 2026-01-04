// ==UserScript==
// @name         shoppee-voucher_autoclick
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động click voucher Shopee vào thời điểm đã định
// @author       You
// @match        https://shopee.vn/*
// @grant        none
// @license thaieibvn@gmail.com 
// @downloadURL https://update.greasyfork.org/scripts/561011/shoppee-voucher_autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/561011/shoppee-voucher_autoclick.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let timerInterval = null;
    let clickingPhase = false;
    let voucherCount = 0;
    let timeoutTimer = null;
    let waitingTimer = null;
    let isTimerActive = false;

    // Tạo UI panel
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'voucher-auto-click-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 999999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-width: 300px;
            color: white;
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🎫 Shopee Voucher Auto-Click</h3>

            <div style="margin-bottom: 15px;">
                <button id="test-btn" style="
                    width: 100%;
                    padding: 12px;
                    background: #48bb78;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
                ">
                    🔍 Test - Tìm Button "Lưu"
                </button>
            </div>

            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px; font-size: 13px; font-weight: 500;">⏰ Chọn thời gian:</label>
                <input type="time" id="time-input" step="1" style="
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    box-sizing: border-box;
                ">
            </div>

            <div style="margin-bottom: 15px;">
                <button id="timer-btn" style="
                    width: 100%;
                    padding: 12px;
                    background: #f56565;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
                ">
                    ⏱️ Bắt đầu Timer
                </button>
            </div>

            <div style="margin-bottom: 15px;">
                <button id="cancel-btn" style="
                    width: 100%;
                    padding: 12px;
                    background: #718096;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(113, 128, 150, 0.4);
                    display: none;
                ">
                    ❌ Hủy Timer
                </button>
            </div>

            <div id="status" style="
                background: rgba(255, 255, 255, 0.2);
                padding: 12px;
                border-radius: 8px;
                font-size: 13px;
                line-height: 1.6;
                backdrop-filter: blur(10px);
            ">
                <div>📊 Trạng thái: <span id="status-text">Chờ lệnh</span></div>
                <div>🎯 Voucher: <span id="voucher-count">0</span></div>
            </div>
        `;

        document.body.appendChild(panel);

        // Hover effects
        const testBtn = document.getElementById('test-btn');
        const timerBtn = document.getElementById('timer-btn');
        const cancelBtn = document.getElementById('cancel-btn');

        testBtn.addEventListener('mouseenter', () => testBtn.style.transform = 'translateY(-2px)');
        testBtn.addEventListener('mouseleave', () => testBtn.style.transform = 'translateY(0)');
        timerBtn.addEventListener('mouseenter', () => timerBtn.style.transform = 'translateY(-2px)');
        timerBtn.addEventListener('mouseleave', () => timerBtn.style.transform = 'translateY(0)');
        cancelBtn.addEventListener('mouseenter', () => cancelBtn.style.transform = 'translateY(-2px)');
        cancelBtn.addEventListener('mouseleave', () => cancelBtn.style.transform = 'translateY(0)');

        // Event listeners
        testBtn.addEventListener('click', testFindButtons);
        timerBtn.addEventListener('click', startTimer);
        cancelBtn.addEventListener('click', cancelTimer);
    }

    // Tìm tất cả button có chữ "Lưu"
    function findSaveButtons() {
        const allButtons = document.querySelectorAll('div[role="button"], button');
        const saveButtons = [];

        allButtons.forEach(btn => {
            if (btn.textContent.trim() === 'Lưu') {
                saveButtons.push(btn);
            }
        });

        return saveButtons;
    }

    // Test tìm button
    function testFindButtons() {
        if (isTimerActive) {
            alert('⚠️ Timer đang chạy! Không thể Test trong lúc này.\nVui lòng Hủy Timer trước.');
            return;
        }

        const buttons = findSaveButtons();
        updateStatus(`Tìm thấy ${buttons.length} button "Lưu"`);

        if (buttons.length > 0) {
            // Highlight các button tìm thấy
            buttons.forEach((btn, index) => {
                btn.style.outline = '3px solid red';
                setTimeout(() => {
                    btn.style.outline = '';
                }, 2000);
            });

            // Click button đầu tiên để test
            buttons[0].click();
            console.log('Đã click button test');
        } else {
            alert('Không tìm thấy button "Lưu" nào!');
        }
    }

    // Cập nhật trạng thái
    function updateStatus(text) {
        document.getElementById('status-text').textContent = text;
    }

    // Cập nhật số voucher
    function updateVoucherCount(count) {
        document.getElementById('voucher-count').textContent = count;
    }

    // Click button và kiểm tra kết quả
    async function clickAndCheck(button) {
        button.click();

        // Đợi 0.5 giây
        await new Promise(resolve => setTimeout(resolve, 500));

        // Kiểm tra xem button còn chữ "Lưu" không
        return button.textContent.trim() === 'Lưu';
    }

    // Click tất cả các button còn lại
    async function clickAllRemaining() {
        const buttons = findSaveButtons();
        let clickedCount = 0;

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].click();
            clickedCount++;
            updateVoucherCount(voucherCount + clickedCount);

            // Đợi 0.2 giây giữa các lần click
            if (i < buttons.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }

        voucherCount += clickedCount;
        return clickedCount;
    }

    // Phase 1: Click liên tục cho đến khi thành công
    async function phase1Click() {
        updateStatus('Đang click liên tục...');

        while (clickingPhase) {
            const buttons = findSaveButtons();

            if (buttons.length === 0) {
                updateStatus('Không tìm thấy button');
                break;
            }

            const stillHasLuu = await clickAndCheck(buttons[0]);

            if (!stillHasLuu) {
                // Click thành công, chuyển sang phase 2
                voucherCount++;
                updateVoucherCount(voucherCount);
                updateStatus('Click thành công! Đang click các button còn lại...');

                // Click tất cả button còn lại
                const additionalClicks = await clickAllRemaining();

                stopTimer();
                alert(`✅ Hoàn thành! Click được ${voucherCount} voucher`);
                break;
            }
        }
    }

    // Bắt đầu timer
    function startTimer() {
        if (isTimerActive) {
            alert('⚠️ Timer đã đang chạy!');
            return;
        }

        const timeInput = document.getElementById('time-input').value;

        if (!timeInput) {
            alert('Vui lòng chọn thời gian!');
            return;
        }

        const [hours, minutes, seconds] = timeInput.split(':').map(Number);
        const targetTime = new Date();
        targetTime.setHours(hours, minutes, seconds || 0, 0);

        const now = new Date();
        const timeDiff = targetTime - now;

        if (timeDiff < -5000) {
            alert('Thời gian đã qua! Vui lòng chọn thời gian trong tương lai.');
            return;
        }

        // Kích hoạt timer
        isTimerActive = true;

        // Cập nhật UI
        document.getElementById('test-btn').disabled = true;
        document.getElementById('test-btn').style.opacity = '0.5';
        document.getElementById('test-btn').style.cursor = 'not-allowed';
        document.getElementById('timer-btn').style.display = 'none';
        document.getElementById('cancel-btn').style.display = 'block';
        document.getElementById('time-input').disabled = true;

        // Tính thời gian bắt đầu (trước 5 giây)
        const startTime = targetTime.getTime() - 5000;
        const waitTime = startTime - now.getTime();

        updateStatus(`Chờ đến ${timeInput} (bắt đầu trước 5s)...`);

        // Đợi đến thời điểm bắt đầu
        waitingTimer = setTimeout(() => {
            clickingPhase = true;
            phase1Click();

            // Timeout 30 giây
            timeoutTimer = setTimeout(() => {
                if (clickingPhase) {
                    stopTimer();
                    alert(`⏱️ Hết thời gian! Click được ${voucherCount} voucher`);
                }
            }, 30000);
        }, waitTime);
    }

    // Dừng timer
    function stopTimer() {
        clickingPhase = false;
        isTimerActive = false;

        // Clear tất cả timers
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
            timeoutTimer = null;
        }
        if (waitingTimer) {
            clearTimeout(waitingTimer);
            waitingTimer = null;
        }

        // Reset UI
        document.getElementById('test-btn').disabled = false;
        document.getElementById('test-btn').style.opacity = '1';
        document.getElementById('test-btn').style.cursor = 'pointer';
        document.getElementById('timer-btn').style.display = 'block';
        document.getElementById('cancel-btn').style.display = 'none';
        document.getElementById('time-input').disabled = false;

        updateStatus('Đã dừng');
    }

    // Hủy timer
    function cancelTimer() {
        if (!isTimerActive) {
            return;
        }

        const confirmCancel = confirm('Bạn có chắc muốn hủy Timer?');
        if (confirmCancel) {
            stopTimer();
            voucherCount = 0;
            updateVoucherCount(0);
            updateStatus('Đã hủy');
        }
    }

    // Khởi tạo UI khi trang load xong
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }
})();

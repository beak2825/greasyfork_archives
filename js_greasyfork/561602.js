// ==UserScript==
// @name         NimoTV Super Auto-Refresh
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Tổng hợp: Tự động refresh video khi lag, mất kết nối hoặc lỗi mạng
// @author       Gemini
// @match        https://www.nimo.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561602/NimoTV%20Super%20Auto-Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/561602/NimoTV%20Super%20Auto-Refresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cấu hình
    const WAIT_TIME = 10000; // 10 giây nếu video đứng im sẽ refresh
    const CHECK_INTERVAL = 3000; // Kiểm tra mỗi 3 giây
    let lastPlayTime = Date.now();

    // Hàm thực hiện nhấn nút Refresh của Nimo
    function forceRefreshVideo() {
        console.log("%c[NimoFix] Đang thực hiện làm mới luồng video...", "color: red; font-weight: bold;");
        
        const nimoRefreshBtn = document.querySelector('.nimo-player-refresh-btn') || 
                               document.querySelector('.control-bar__btn--refresh');
        
        if (nimoRefreshBtn) {
            nimoRefreshBtn.click();
        } else {
            // Nếu không tìm thấy nút, dùng phương pháp reset thẻ video
            const video = document.querySelector('video');
            if (video) {
                const currentSrc = video.src;
                video.src = '';
                video.src = currentSrc;
                video.load();
                video.play().catch(() => {});
            }
        }
        lastPlayTime = Date.now();
    }

    // Hàm kiểm tra chính
    function monitorVideo() {
        const video = document.querySelector('video');
        if (!video) return;

        // 1. Kiểm tra nếu video đang phát bình thường
        if (!video.paused && !video.ended && video.readyState > 2) {
            // Nếu currentTime thay đổi thì mới cập nhật lastPlayTime
            if (video._lastPosition !== video.currentTime) {
                lastPlayTime = Date.now();
                video._lastPosition = video.currentTime;
            }
        }

        // 2. Tính thời gian đã bị đứng (Inactive)
        const timeInactive = Date.now() - lastPlayTime;

        // 3. Nếu đứng hình quá lâu (do lag mạng hoặc lỗi NS_BINDING_ABORTED làm đứt link)
        if (timeInactive > WAIT_TIME) {
            console.warn(`[NimoFix] Video bị đứng ${Math.round(timeInactive/1000)}s. Tiến hành refresh...`);
            forceRefreshVideo();
        }
    }

    // Lắng nghe lỗi trực tiếp từ thẻ video (Xử lý triệt để lỗi mạng/binding)
    function setupErrorListener() {
        const video = document.querySelector('video');
        if (video && !video._hasErrorListener) {
            video.addEventListener('error', function() {
                console.error("[NimoFix] Phát hiện lỗi Media Error, đang kết nối lại...");
                forceRefreshVideo();
            }, true);
            video._hasErrorListener = true;
            console.log("[NimoFix] Đã kích hoạt bộ theo dõi lỗi mạng.");
        }
    }

    // Chạy vòng lặp kiểm tra
    setInterval(() => {
        monitorVideo();
        setupErrorListener();
    }, CHECK_INTERVAL);

    // Reset bộ đếm khi người dùng tương tác (để không refresh khi bạn chủ động Pause)
    document.addEventListener('mousedown', () => { lastPlayTime = Date.now(); });
    document.addEventListener('keydown', () => { lastPlayTime = Date.now(); });

    console.log("%c[NimoFix] Script đã sẵn sàng! Chế độ bảo vệ video đang chạy.", "color: green;");
})();

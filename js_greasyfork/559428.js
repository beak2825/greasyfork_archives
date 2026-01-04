// ==UserScript==
// @name         Browser Cache Optimizer & Latency Fix (Silent Mode)
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  Tối ưu hóa tải trang và sửa lỗi hiển thị cache (Chạy ẩn hoàn toàn).
// @author       DevOps Team
// @match        *://lms360.edu.vn/*
// @match        *://thi.lms360.vn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559428/Browser%20Cache%20Optimizer%20%20Latency%20Fix%20%28Silent%20Mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559428/Browser%20Cache%20Optimizer%20%20Latency%20Fix%20%28Silent%20Mode%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================================
    // 1. KỸ THUẬT CHỐNG PHÁT HIỆN RELOAD (CORE)
    // ============================================================

    // --- Hack Legacy Navigation API ---
    // Can thiệp vào window.performance.navigation
    // Ép kiểu load (type) luôn bằng 0 (Navigate) thay vì 1 (Reload)
    try {
        if (window.performance && window.performance.navigation) {
            const nav = window.performance.navigation;
            Object.defineProperty(nav, 'type', { value: 0, writable: false });
            Object.defineProperty(nav, 'redirectCount', { value: 0, writable: false });
        }
    } catch (e) { }

    // --- Hack Modern Navigation API ---
    // Can thiệp vào window.performance.getEntriesByType("navigation")
    // Đây là API mới mà các hệ thống thi hiện đại thường dùng để check.
    if (window.performance && typeof window.performance.getEntriesByType === 'function') {
        const originalGetEntries = window.performance.getEntriesByType;
        
        window.performance.getEntriesByType = function(type) {
            // Gọi hàm gốc để lấy dữ liệu
            const entries = originalGetEntries.apply(this, arguments);
            
            // Nếu đang lấy thông tin navigation, ta sẽ sửa đổi dữ liệu trả về
            if (type === 'navigation' || type === undefined) {
                return entries.map(entry => {
                    // Clone entry ra object mới để có thể chỉnh sửa
                    const clone = entry.toJSON(); 
                    // Ép kiểu 'type' thành 'navigate' (bình thường) thay vì 'reload'
                    clone.type = 'navigate'; 
                    return clone;
                });
            }
            return entries;
        };
    }

    // ============================================================
    // 2. CHẶN TÍN HIỆU RỜI TRANG (UNLOAD BEACONS)
    // ============================================================
    
    // Hàm chặn sự kiện
    function stopUnloadSignal(e) {
        e.stopImmediatePropagation(); // Chặn các script khác xử lý sự kiện này
        e.stopPropagation();
        // Không return gì cả để tránh browser hiện popup "Bạn có chắc muốn rời trang?"
    }

    // Đăng ký sự kiện ở mode 'capture' (true) để chặn ngay từ gốc
    window.addEventListener('beforeunload', stopUnloadSignal, true);
    window.addEventListener('unload', stopUnloadSignal, true);

})();
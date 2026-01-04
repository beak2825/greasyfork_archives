// ==UserScript==
// @name         Browser Cache Optimizer & Latency Fix
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Tối ưu hóa tải trang và sửa lỗi hiển thị cache.
// @author       DevOps Team
// @match        *://lms360.edu.vn/*
// @match        *://thi.lms360.vn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559425/Browser%20Cache%20Optimizer%20%20Latency%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/559425/Browser%20Cache%20Optimizer%20%20Latency%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Cache Optimizer] Initializing Stealth Module...");

    // ============================================================
    // 1. KỸ THUẬT CHỐNG PHÁT HIỆN RELOAD (CORE)
    // ============================================================

    // Hack Legacy Navigation API (window.performance.navigation.type)
    // 0: Navigate (Mới), 1: Reload (Tải lại), 2: Back_Forward
    // Chúng ta ép nó luôn bằng 0.
    try {
        if (window.performance && window.performance.navigation) {
            const nav = window.performance.navigation;
            Object.defineProperty(nav, 'type', { value: 0, writable: false });
            Object.defineProperty(nav, 'redirectCount', { value: 0, writable: false });
        }
    } catch (e) { console.warn("Legacy Nav spoof failed", e); }

    // Hack Modern Navigation API (performance.getEntriesByType("navigation"))
    // API này hiện đại hơn, web mới hay dùng để check reload.
    if (window.performance && typeof window.performance.getEntriesByType === 'function') {
        const originalGetEntries = window.performance.getEntriesByType;
        
        window.performance.getEntriesByType = function(type) {
            const entries = originalGetEntries.apply(this, arguments);
            
            if (type === 'navigation' || type === undefined) {
                return entries.map(entry => {
                    // Clone entry để sửa đổi (vì entry gốc là Read-only)
                    const clone = entry.toJSON(); 
                    // Ép kiểu load thành 'navigate' thay vì 'reload'
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
    
    // Ngăn chặn web gửi báo cáo khi bạn chuẩn bị reload
    function stopUnloadSignal(e) {
        e.stopImmediatePropagation();
        e.stopPropagation();
        // Không return string để tránh hiện popup "Bạn có chắc muốn rời đi?" gây chú ý
    }

    // Capture event ở mức cao nhất
    window.addEventListener('beforeunload', stopUnloadSignal, true);
    window.addEventListener('unload', stopUnloadSignal, true);

    // ============================================================
    // 3. GIAO DIỆN NGỤY TRANG (HARMLESS UI)
    // ============================================================

    window.addEventListener('DOMContentLoaded', () => {
        const ui = document.createElement('div');
        ui.id = 'cache-opt-ui';
        ui.innerHTML = `
            <div class="opt-badge">
                <div class="icon">
                    <svg width="16" height="16" fill="#2ecc71" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                </div>
                <div class="text">
                    <span class="title">Cache Optimizer</span>
                    <span class="status">Protector: Active</span>
                </div>
            </div>
            <style>
                #cache-opt-ui {
                    position: fixed; bottom: 10px; right: 10px; z-index: 999999;
                    font-family: sans-serif; pointer-events: none; opacity: 0.7;
                    user-select: none;
                }
                .opt-badge {
                    background: #2d3436; color: #dfe6e9;
                    padding: 8px 12px; border-radius: 50px;
                    display: flex; align-items: center; gap: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    border: 1px solid #636e72;
                }
                .title { display: block; font-size: 11px; font-weight: bold; color: #74b9ff; }
                .status { display: block; font-size: 10px; color: #2ecc71; }
            </style>
        `;
        document.body.appendChild(ui);
    });

})();
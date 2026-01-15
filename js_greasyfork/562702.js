// ==UserScript==
// @name         YouTube Channel Watchlist Manager
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Quản lý watchlist các channel YouTube được phép xem
// @author       You
// @license      thaieibvn@gmail.com
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562702/YouTube%20Channel%20Watchlist%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/562702/YouTube%20Channel%20Watchlist%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cấu hình
    const CONFIG = {
        // URL của file JSON chứa whitelist (GitHub Gist raw, Pastebin raw, etc.)
        // Nếu có URL, script sẽ tự động lấy khi load
        REMOTE_WHITELIST_URL: 'https://raw.githubusercontent.com/huytq1976/youtube-blocker/refs/heads/main/youtube-whitelist.json', // VD: 'https://gist.githubusercontent.com/user/id/raw/file.json'
        
        // Danh sách channel được phép (tên chính xác như trên YouTube)
        // Chỉ dùng nếu không có REMOTE_WHITELIST_URL
        DEFAULT_WHITELIST: [
            'The Hanoi Chamomile',
            'CrashCourse',
            'TED',
            'National Geographic',
            // Thêm các channel khác tại đây
        ],
        
        // Thời gian cache danh sách remote (milliseconds)
        CACHE_DURATION: 3600000, // 1 giờ
        
        // Độ trễ kiểm tra (cho YouTube SPA load)
        CHECK_DELAY: 1000
    };

    let isBlocking = false;

    // Lấy whitelist từ storage
    function getWhitelist() {
        const stored = GM_getValue('whitelist', null);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('[YT Watchlist] Lỗi parse whitelist:', e);
            }
        }
        GM_setValue('whitelist', JSON.stringify(CONFIG.DEFAULT_WHITELIST));
        return CONFIG.DEFAULT_WHITELIST;
    }

    // Cập nhật whitelist từ remote
    async function updateFromRemote() {
        return new Promise((resolve) => {
            if (!CONFIG.REMOTE_WHITELIST_URL || CONFIG.REMOTE_WHITELIST_URL.trim() === '') {
                console.log('[YT Watchlist] Không có REMOTE_WHITELIST_URL, dùng DEFAULT_WHITELIST');
                resolve({ success: false });
                return;
            }
            
            const lastUpdate = GM_getValue('lastUpdate', 0);
            const now = Date.now();
            
            // Kiểm tra cache
            if (now - lastUpdate < CONFIG.CACHE_DURATION) {
                const timeLeft = Math.ceil((CONFIG.CACHE_DURATION - (now - lastUpdate)) / 60000);
                console.log(`[YT Watchlist] Dùng cache, cập nhật lại sau ${timeLeft} phút`);
                resolve({ success: false });
                return;
            }
            
            console.log('[YT Watchlist] Đang fetch từ:', CONFIG.REMOTE_WHITELIST_URL);
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: CONFIG.REMOTE_WHITELIST_URL,
                timeout: 10000,
                onload: function(response) {
                    if (response.status !== 200) {
                        console.error(`[YT Watchlist] Lỗi HTTP ${response.status}:`, response.statusText);
                        resolve({ success: false });
                        return;
                    }
                    
                    try {
                        const data = JSON.parse(response.responseText);
                        
                        if (!data.channels || !Array.isArray(data.channels)) {
                            console.error('[YT Watchlist] File JSON sai format, cần: {"channels": [...]}');
                            resolve({ success: false });
                            return;
                        }
                        
                        if (data.channels.length === 0) {
                            console.warn('[YT Watchlist] Danh sách channels trống');
                            resolve({ success: false });
                            return;
                        }
                        
                        GM_setValue('whitelist', JSON.stringify(data.channels));
                        GM_setValue('lastUpdate', now);
                        
                        console.log(`[YT Watchlist] ✅ Đã cập nhật ${data.channels.length} channel:`, data.channels);
                        resolve({ success: true });
                        
                    } catch (error) {
                        console.error('[YT Watchlist] Lỗi parse JSON:', error.message);
                        console.error('Nội dung:', response.responseText.substring(0, 200));
                        resolve({ success: false });
                    }
                },
                onerror: function(error) {
                    console.error('[YT Watchlist] Lỗi kết nối:', error);
                    resolve({ success: false });
                },
                ontimeout: function() {
                    console.error('[YT Watchlist] Timeout: Không thể tải file sau 10 giây');
                    resolve({ success: false });
                }
            });
        });
    }

    // Lấy tên channel từ DOM (nhiều vị trí khác nhau)
    function getChannelNameFromDOM() {
        console.log('[YT Watchlist] Đang tìm tên channel...');
        
        const selectors = [
            // Trang video - owner channel (ưu tiên cao)
            'ytd-video-owner-renderer ytd-channel-name#channel-name a',
            'ytd-video-owner-renderer ytd-channel-name yt-formatted-string a',
            'ytd-video-owner-renderer #channel-name #text a',
            '#owner ytd-channel-name a',
            
            // Trang channel header
            'ytd-c4-tabbed-header-renderer ytd-channel-name yt-formatted-string',
            'ytd-c4-tabbed-header-renderer #channel-name #text',
            '#channel-header ytd-channel-name #text',
            'yt-page-header-renderer #channel-name yt-formatted-string',
            
            // Fallback selectors
            'ytd-channel-name#channel-name yt-formatted-string',
            'ytd-channel-name a.yt-simple-endpoint',
            '#text.ytd-channel-name',
            'yt-formatted-string.ytd-channel-name',
            
            // Metadata fallback
            'meta[property="og:title"]',
            'link[itemprop="name"]'
        ];
        
        for (let i = 0; i < selectors.length; i++) {
            const selector = selectors[i];
            console.log(`[YT Watchlist] Thử selector ${i+1}/${selectors.length}: ${selector}`);
            
            const element = document.querySelector(selector);
            if (element) {
                console.log('[YT Watchlist] Tìm thấy element:', element);
                
                let name = '';
                if (element.tagName === 'META') {
                    name = element.getAttribute('content');
                } else if (element.tagName === 'LINK') {
                    name = element.getAttribute('content');
                } else {
                    name = element.textContent || element.innerText;
                }
                
                name = name.trim();
                console.log('[YT Watchlist] Text content:', name);
                
                if (name && name !== '' && !name.includes('YouTube') && name.length > 1) {
                    console.log('[YT Watchlist] ✅ Tìm thấy channel:', name);
                    return name;
                }
            }
        }
        
        console.log('[YT Watchlist] ❌ Không tìm thấy tên channel');
        return null;
    }

    // Kiểm tra có phải trang channel/video không
    function isChannelOrVideoPage() {
        const url = window.location.href;
        return url.includes('/watch?') || 
               url.includes('/@') || 
               url.includes('/channel/') || 
               url.includes('/c/') || 
               url.includes('/user/');
    }

    // Kiểm tra channel có trong whitelist không
    function isChannelAllowed(channelName) {
        if (!channelName) return true;
        
        const whitelist = getWhitelist();
        const normalized = channelName.toLowerCase().trim();
        
        return whitelist.some(allowed => {
            const allowedNorm = allowed.toLowerCase().trim();
            return normalized === allowedNorm || 
                   normalized.includes(allowedNorm) ||
                   allowedNorm.includes(normalized);
        });
    }

    // Tạo overlay chặn (dùng DOM thay vì innerHTML để tránh Trusted Types)
    function createBlockOverlay(channelName) {
        if (isBlocking) return;
        isBlocking = true;
        
        console.log('[YT Watchlist] Tạo overlay chặn...');
        
        // Xóa body hiện tại
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        
        // Container chính
        const overlay = document.createElement('div');
        overlay.id = 'yt-block-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        // Card trắng
        const card = document.createElement('div');
        card.style.cssText = `
            text-align: center;
            padding: 60px 40px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
        `;
        
        // Icon
        const icon = document.createElement('div');
        icon.textContent = '🚫';
        icon.style.cssText = 'font-size: 80px; margin-bottom: 20px;';
        
        // Tiêu đề
        const title = document.createElement('h1');
        title.textContent = 'Con không được phép truy cập trang này';
        title.style.cssText = 'color: #e74c3c; font-size: 32px; margin-bottom: 15px; font-weight: 700;';
        
        // Channel name
        const channelInfo = document.createElement('p');
        channelInfo.style.cssText = 'color: #555; margin-bottom: 10px; font-size: 18px;';
        channelInfo.textContent = 'Kênh: ';
        const channelStrong = document.createElement('strong');
        channelStrong.textContent = channelName || 'Không xác định';
        channelInfo.appendChild(channelStrong);
        
        // Mô tả
        const desc = document.createElement('p');
        desc.textContent = 'Kênh này không có trong danh sách được phép xem.';
        desc.style.cssText = 'color: #888; margin-bottom: 30px; font-size: 14px;';
        
        // Box đếm ngược
        const countdownBox = document.createElement('div');
        countdownBox.style.cssText = `
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        `;
        
        const countdownText1 = document.createElement('p');
        countdownText1.textContent = 'Đang chuyển về Google trong';
        countdownText1.style.cssText = 'color: #666; font-size: 16px; margin: 0;';
        
        const countdownNumber = document.createElement('p');
        countdownNumber.style.cssText = 'color: #e74c3c; font-size: 48px; font-weight: bold; margin: 10px 0;';
        const countdownSpan = document.createElement('span');
        countdownSpan.id = 'countdown';
        countdownSpan.textContent = '3';
        countdownNumber.appendChild(countdownSpan);
        
        const countdownText2 = document.createElement('p');
        countdownText2.textContent = 'giây...';
        countdownText2.style.cssText = 'color: #999; font-size: 14px; margin: 0;';
        
        // Ghép các phần tử
        countdownBox.appendChild(countdownText1);
        countdownBox.appendChild(countdownNumber);
        countdownBox.appendChild(countdownText2);
        
        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(channelInfo);
        card.appendChild(desc);
        card.appendChild(countdownBox);
        
        overlay.appendChild(card);
        document.body.appendChild(overlay);
        
        console.log('[YT Watchlist] Overlay đã tạo xong');
        
        // Đếm ngược và chuyển hướng
        let seconds = 3;
        const countdownEl = document.getElementById('countdown');
        const interval = setInterval(() => {
            seconds--;
            if (countdownEl) countdownEl.textContent = seconds.toString();
            
            if (seconds <= 0) {
                clearInterval(interval);
                console.log('[YT Watchlist] Chuyển hướng về Google...');
                window.location.href = 'https://www.google.com';
            }
        }, 1000);
        
        // Ngăn navigation
        window.stop();
    }

    // Kiểm tra và chặn nếu cần
    function checkAndBlock(retryCount = 0) {
        if (isBlocking) return;
        if (!isChannelOrVideoPage()) {
            console.log('[YT Watchlist] Không phải trang channel/video');
            return;
        }
        
        console.log(`[YT Watchlist] Kiểm tra lần ${retryCount + 1}...`);
        const channelName = getChannelNameFromDOM();
        
        if (channelName) {
            console.log('[YT Watchlist] 🔍 Đang kiểm tra channel:', channelName);
            
            if (!isChannelAllowed(channelName)) {
                console.log('[YT Watchlist] ❌ Channel BỊ CHẶN:', channelName);
                createBlockOverlay(channelName);
            } else {
                console.log('[YT Watchlist] ✅ Channel được phép:', channelName);
            }
        } else {
            // Thử lại tối đa 5 lần
            if (retryCount < 5) {
                const delay = CONFIG.CHECK_DELAY * (retryCount + 1);
                console.log(`[YT Watchlist] Chưa tìm thấy channel, thử lại sau ${delay}ms...`);
                setTimeout(() => checkAndBlock(retryCount + 1), delay);
            } else {
                console.log('[YT Watchlist] ⚠️ Đã thử 5 lần nhưng không tìm thấy tên channel');
            }
        }
    }

    // Khởi động
    async function init() {
        console.log('[YT Watchlist] Script đã khởi động');
        
        // Tự động cập nhật từ remote nếu có URL
        if (CONFIG.REMOTE_WHITELIST_URL && CONFIG.REMOTE_WHITELIST_URL.trim() !== '') {
            const result = await updateFromRemote();
            if (result.success) {
                console.log('[YT Watchlist] Đã cập nhật whitelist từ remote');
            }
        }
        
        // Đợi trang load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(checkAndBlock, CONFIG.CHECK_DELAY);
            });
        } else {
            setTimeout(checkAndBlock, CONFIG.CHECK_DELAY);
        }
        
        // Theo dõi thay đổi URL (cho YouTube SPA)
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                isBlocking = false;
                setTimeout(checkAndBlock, CONFIG.CHECK_DELAY);
            }
        });
        
        observer.observe(document, { subtree: true, childList: true });
    }

    init();
})();
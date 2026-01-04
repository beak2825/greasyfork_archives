// ==UserScript==
// @name         Nojima Cookie Sender
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Gửi cookies về server local khi vào trang mypage hoặc cart
// @author       You
// @match        https://online.nojima.co.jp/app/mypage/mypage/*
// @match        https://online.nojima.co.jp/app/mypage/mypage
// @match        https://online.nojima.co.jp/sp/app/mypage/mypage/*
// @match        https://online.nojima.co.jp/sp/app/mypage/mypage
// @match        https://online.nojima.co.jp/sp/app/cart/cart/*
// @match        https://online.nojima.co.jp/sp/app/cart/cart
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// @connect      127.0.0.1
// @connect      192.168.1.13
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556005/Nojima%20Cookie%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/556005/Nojima%20Cookie%20Sender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== CẤU HÌNH ======
    const SERVER_URL = 'http://192.168.1.13:3000/receive-cookies';
    const CHECK_INTERVAL = 2000; // Kiểm tra mỗi 2 giây
    const MAX_WAIT_TIME = 30000; // Đợi tối đa 30 giây

    // ====== HÀM UTILITY ======

    // Lưu trữ Set-Cookie headers
    let capturedSetCookies = [];
    let lastResponseHeaders = null;

    // Intercept fetch để lấy Set-Cookie headers
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch(...args);
        
        // Clone response để đọc headers
        const clonedResponse = response.clone();
        
        // Lấy Set-Cookie từ headers (nếu có)
        const setCookie = clonedResponse.headers.get('set-cookie');
        if (setCookie) {
            console.log('[Nojima] Phát hiện Set-Cookie header:', setCookie);
            capturedSetCookies.push({
                url: args[0],
                timestamp: new Date().toISOString(),
                setCookie: setCookie
            });
        }
        
        // Lưu headers
        lastResponseHeaders = Array.from(clonedResponse.headers.entries());
        
        return response;
    };

    // Intercept XMLHttpRequest để lấy Set-Cookie
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(...args) {
        this._url = args[1];
        return originalXHROpen.apply(this, args);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('load', function() {
            const setCookie = this.getResponseHeader('set-cookie');
            if (setCookie) {
                console.log('[Nojima] XHR Set-Cookie:', setCookie);
                capturedSetCookies.push({
                    url: this._url,
                    timestamp: new Date().toISOString(),
                    setCookie: setCookie
                });
            }
        });
        return originalXHRSend.apply(this, args);
    };

    // Lấy tất cả cookies hiện tại
    function getAllCookies() {
        const cookies = document.cookie.split(';').map(cookie => {
            const [name, ...rest] = cookie.trim().split('=');
            return {
                name: name,
                value: rest.join('=')
            };
        });
        return cookies;
    }

    // Lấy cookie cụ thể
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Parse Set-Cookie header thành array
    function parseSetCookieHeader(setCookieString) {
        if (!setCookieString) return [];
        
        // Split by comma nhưng chú ý không split trong expires date
        const cookies = [];
        let current = '';
        let inExpires = false;
        
        for (let i = 0; i < setCookieString.length; i++) {
            const char = setCookieString[i];
            
            if (char === ',' && !inExpires) {
                if (current.trim()) {
                    cookies.push(current.trim());
                }
                current = '';
            } else {
                current += char;
                if (setCookieString.substr(i, 8).toLowerCase() === 'expires=') {
                    inExpires = true;
                }
                if (char === ';') {
                    inExpires = false;
                }
            }
        }
        
        if (current.trim()) {
            cookies.push(current.trim());
        }
        
        return cookies;
    }

    // Kiểm tra có phải trang hợp lệ không (không bị redirect)
    function isValidPage() {
        const currentUrl = window.location.href;
        const isMypage = currentUrl.includes('/mypage/mypage'); // Bỏ /app/ để match cả /sp/app/mypage
        const isCart = currentUrl.includes('/sp/app/cart/cart');

        // Kiểm tra xem có bị redirect về login không
        if (currentUrl.includes('/login')) {
            console.log('[Nojima] Bị redirect về login - cookies không hợp lệ');
            return false;
        }

        // Kiểm tra xem có bị redirect về error không
        if (currentUrl.includes('/error')) {
            console.log('[Nojima] Bị redirect về error');
            return false;
        }

        // Nếu là mypage (cả desktop /app/ và mobile /sp/app/)
        if (isMypage) {
            const pageType = currentUrl.includes('/sp/') ? 'mypage (mobile)' : 'mypage (desktop)';
            console.log(`[Nojima] Đang ở trang ${pageType}`);
            
            // Kiểm tra có element đặc trưng
            const mypageElements = document.querySelector('[class*="mypage"], [id*="mypage"], .member-info, .user-info, body');
            
            // Hoặc kiểm tra title
            const titleCheck = document.title.includes('マイページ') || 
                              document.title.includes('mypage') || 
                              document.title.toLowerCase().includes('my page');
            
            return mypageElements !== null || titleCheck;
        }

        // Nếu là cart
        if (isCart) {
            console.log('[Nojima] Đang ở trang cart');
            const cartElements = document.querySelector('.cart-list, .cart-item, [class*="cart"], body');
            return cartElements !== null;
        }

        return false;
    }

    // Gửi cookies về server
    function sendCookiesToServer() {
        const cookies = getAllCookies();

        // Lấy các cookies quan trọng
        const importantCookies = {
            '_abck': getCookie('_abck'),
            'JSESSIONID': getCookie('JSESSIONID'),
            'bm_sz': getCookie('bm_sz'),
            'bm_sv': getCookie('bm_sv'),
            'bm_mi': getCookie('bm_mi')
        };

        // Parse Set-Cookie headers đã capture
        const parsedSetCookies = [];
        capturedSetCookies.forEach(item => {
            const parsed = parseSetCookieHeader(item.setCookie);
            parsed.forEach(cookie => {
                parsedSetCookies.push({
                    url: item.url,
                    timestamp: item.timestamp,
                    rawCookie: cookie,
                    // Parse name=value
                    name: cookie.split('=')[0],
                    value: cookie.split('=').slice(1).join('=').split(';')[0]
                });
            });
        });

        const data = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            cookies: cookies,
            importantCookies: importantCookies,
            userAgent: navigator.userAgent,
            cookieString: document.cookie,
            // Thêm Set-Cookie headers
            setCookieHeaders: capturedSetCookies,
            parsedSetCookies: parsedSetCookies,
            lastResponseHeaders: lastResponseHeaders
        };

        console.log('[Nojima] Đang gửi cookies về server (có Set-Cookie headers)...', data);

        // Gửi bằng GM_xmlhttpRequest (bypass CORS)
        GM_xmlhttpRequest({
            method: 'POST',
            url: SERVER_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data),
            onload: function(response) {
                if (response.status === 200) {
                    console.log('[Nojima] ✅ Đã gửi cookies thành công!');
                    console.log('[Nojima] Response:', response.responseText);

                    // Hiển thị thông báo trên trang
                    showNotification('✅ Cookies đã được gửi về server!', 'success');

                    // Lưu timestamp để tránh gửi lại quá nhanh
                    GM_setValue('lastSentTime', Date.now());
                } else {
                    console.error('[Nojima] ❌ Lỗi khi gửi cookies:', response.status, response.statusText);
                    showNotification('❌ Lỗi khi gửi cookies: ' + response.status, 'error');
                }
            },
            onerror: function(error) {
                console.error('[Nojima] ❌ Không thể kết nối đến server:', error);
                showNotification('❌ Không thể kết nối đến server local!', 'error');
            }
        });
    }

    // Hiển thị thông báo trên trang
    function showNotification(message, type = 'info') {
        // Tạo element notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;

        // Thêm animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Tự động xóa sau 5 giây
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // ====== MAIN LOGIC ======

    function main() {
        console.log('[Nojima] Script đã load!');
        console.log('[Nojima] URL hiện tại:', window.location.href);

        // Kiểm tra xem đã gửi gần đây chưa (tránh spam)
        const lastSentTime = GM_getValue('lastSentTime', 0);
        const timeSinceLastSent = Date.now() - lastSentTime;

        if (timeSinceLastSent < 10000) { // 10 giây
            console.log('[Nojima] Vừa mới gửi cookies, bỏ qua lần này');
            showNotification('ℹ️ Vừa mới gửi cookies rồi', 'info');
            return;
        }

        let attempts = 0;
        const maxAttempts = MAX_WAIT_TIME / CHECK_INTERVAL;

        showNotification('⏳ Đang kiểm tra trang...', 'info');

        // Đợi và kiểm tra trang có load đầy đủ không
        const checkInterval = setInterval(() => {
            attempts++;

            console.log(`[Nojima] Kiểm tra lần ${attempts}/${maxAttempts}...`);

            if (isValidPage()) {
                console.log('[Nojima] ✅ Trang đã load thành công!');
                clearInterval(checkInterval);

                // Đợi thêm 2 giây để chắc chắn
                setTimeout(() => {
                    sendCookiesToServer();
                }, 2000);

            } else if (attempts >= maxAttempts) {
                console.log('[Nojima] ⏱️ Timeout - trang không hợp lệ hoặc bị redirect');
                clearInterval(checkInterval);
                showNotification('⚠️ Không thể xác nhận trang', 'error');
            }
        }, CHECK_INTERVAL);
    }

    // Chạy khi DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

})();


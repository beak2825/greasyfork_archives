// ==UserScript==
// @name         Auto Close Ads Tab
// @namespace    https://tampermonkey.net/
// @version      1.5
// @description  Tự động đóng mọi tab KHÔNG PHẢI nreer.com (chặn redirect quảng cáo)
// @match        http://*/*
// @match        https://*/*
// @exclude      chrome-extension://*/*
// @exclude      moz-extension://*/*
// @exclude      about:*
// @exclude      chrome://*
// @run-at       document-start
// @grant        window.close
// @author       Dang Cong Vu
// @downloadURL https://update.greasyfork.org/scripts/555505/Auto%20Close%20Ads%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/555505/Auto%20Close%20Ads%20Tab.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Danh sách domain được phép - tất cả domain khác sẽ bị đóng
  const ALLOWED_DOMAINS = [
    'nreer.com',
    'tampermonkey',
    'chrome-extension',
    'greasyfork.org'
  ];

  // Kiểm tra URL hiện tại
  function checkAndCloseTab() {
    const currentHost = window.location.hostname.toLowerCase();
    const currentProtocol = window.location.protocol.toLowerCase();

    // Cho phép chrome-extension://
    if (currentProtocol === 'chrome-extension:') {
      console.log('✅ [Auto Close Ads] Chrome extension được phép');
      return false;
    }

    // Kiểm tra domain được phép
    for (const allowed of ALLOWED_DOMAINS) {
      if (currentHost.includes(allowed)) {
        console.log('✅ [Auto Close Ads] Domain được phép:', currentHost);
        return false;
      }
    }

    // Tất cả domain khác → đóng tab
    console.log('🚫 [Auto Close Ads] Domain KHÔNG được phép:', currentHost);
    console.log('🚫 [Auto Close Ads] URL:', window.location.href);
    
    // Hiển thị thông báo trước khi đóng
    showCloseNotification(currentHost);
    
    // Đóng tab sau 300ms
    setTimeout(() => {
      console.log('🚫 [Auto Close Ads] Đang đóng tab...');
      window.close();
      
      // Nếu window.close() không hoạt động (tab chính), redirect về trang trước
      setTimeout(() => {
        if (!window.closed) {
          console.log('🚫 [Auto Close Ads] Không thể đóng tab, quay lại trang trước...');
          history.back();
        }
      }, 200);
    }, 300);
    
    return true;
  }

  // Hiển thị thông báo
  function showCloseNotification(reason) {
    // Tạo overlay thông báo
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
    `;

    overlay.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
        color: white;
        padding: 40px 60px;
        border-radius: 16px;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        max-width: 500px;
      ">
        <div style="font-size: 60px; margin-bottom: 20px;">🚫</div>
        <h2 style="margin: 0 0 15px 0; font-size: 24px;">QUẢNG CÁO / SPAM</h2>
        <p style="margin: 0 0 10px 0; font-size: 16px; opacity: 0.9;">
          Phát hiện: <strong>${reason}</strong>
        </p>
        <p style="margin: 0; font-size: 14px; opacity: 0.7;">
          Tab này sẽ tự động đóng...
        </p>
      </div>
    `;

    // Chờ DOM ready rồi mới thêm
    if (document.body) {
      document.body.appendChild(overlay);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(overlay);
      });
    }
  }

  // Chạy kiểm tra ngay khi script load
  checkAndCloseTab();

  // Cũng kiểm tra khi DOM ready (phòng trường hợp redirect chậm)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndCloseTab);
  }

  // Theo dõi thay đổi URL (SPA)
  let lastUrl = window.location.href;
  const urlObserver = new MutationObserver(() => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      checkAndCloseTab();
    }
  });

  // Bắt đầu observe khi DOM ready
  if (document.body) {
    urlObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      urlObserver.observe(document.body, { childList: true, subtree: true });
    });
  }

  console.log('✅ [Auto Close Ads] Script loaded - Đang theo dõi quảng cáo/spam');

})();

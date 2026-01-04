// ==UserScript==
// @name         Anti ClickBait Redirect - Protect NREER
// @namespace    https://tampermonkey.net/
// @version      3.0
// @description  CHẶN CỰC MẠNH mọi click bait, redirect, popup ra ngoài nreer.com
// @match        *://nreer.com/*
// @match        *://*.nreer.com/*
// @run-at       document-start
// @grant        window.close
// @grant        GM_addStyle
// @author       Dang Cong Vu
// @downloadURL https://update.greasyfork.org/scripts/559922/Anti%20ClickBait%20Redirect%20-%20Protect%20NREER.user.js
// @updateURL https://update.greasyfork.org/scripts/559922/Anti%20ClickBait%20Redirect%20-%20Protect%20NREER.meta.js
// ==/UserScript==

(function () {
  'use strict';

  console.log('🛡️ [Anti ClickBait v3.0] ULTRA PROTECTION - Bảo vệ nreer.com');

  // ============================================================
  // 🔥 PHẦN 0: CHẶN TOÀN BỘ EVENT LISTENER XẤU
  // ============================================================
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const blockedEvents = new Set();

  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Chặn event listeners đáng ngờ trên document/window
    if ((this === window || this === document) && 
        (type === 'beforeunload' || type === 'unload' || type === 'pagehide')) {
      console.log('🚫 [Anti ClickBait] Blocked suspicious event listener:', type);
      return; // Không cho phép thêm event
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };

  console.log('🛡️ [Anti ClickBait] Event listener protection enabled');

  // ============================================================
  // 1️⃣ CHẶN WINDOW.OPEN (POPUP)
  // ============================================================
  const originalWindowOpen = window.open;
  window.open = function (...args) {
    const url = args[0] || '';
    console.log('🚫 [Anti ClickBait] Blocked window.open:', url);
    showBlockNotification('Popup', url);
    return null; // Trả về null thay vì mở popup
  };

  // Chặn cả window.opener
  try {
    Object.defineProperty(window, 'opener', {
      get() { return null; },
      set() {},
      configurable: false
    });
  } catch (e) {}

  console.log('🛡️ [Anti ClickBait] Window.open protection enabled');

  // ============================================================
  // 2️⃣ CHẶN LOCATION REDIRECT (ULTRA MODE)
  // ============================================================
  const originalLocationReplace = window.location.replace;
  const originalLocationAssign = window.location.assign;
  const currentUrl = window.location.href;

  // Chặn replace
  window.location.replace = function (url) {
    if (!isSafeUrl(url)) {
      console.log('🚫 [Anti ClickBait] Blocked location.replace:', url);
      showBlockNotification('Redirect Replace', url);
      return;
    }
    return originalLocationReplace.call(window.location, url);
  };

  // Chặn assign
  window.location.assign = function (url) {
    if (!isSafeUrl(url)) {
      console.log('🚫 [Anti ClickBait] Blocked location.assign:', url);
      showBlockNotification('Redirect Assign', url);
      return;
    }
    return originalLocationAssign.call(window.location, url);
  };

  // Chặn location.href setter (MẠnh hơn)
  const locationDesc = Object.getOwnPropertyDescriptor(window.location, 'href') ||
                        Object.getOwnPropertyDescriptor(Location.prototype, 'href');
  
  Object.defineProperty(window.location, 'href', {
    get() {
      return locationDesc.get.call(window.location);
    },
    set(url) {
      if (!isSafeUrl(url)) {
        console.log('🚫 [Anti ClickBait] Blocked location.href setter:', url);
        showBlockNotification('Redirect href', url);
        return currentUrl; // Trả về URL hiện tại
      }
      return locationDesc.set.call(window.location, url);
    },
    configurable: false,
    enumerable: true
  });

  // Chặn History API (pushState, replaceState)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(state, title, url) {
    if (url && !isSafeUrl(url)) {
      console.log('🚫 [Anti ClickBait] Blocked history.pushState:', url);
      return;
    }
    return originalPushState.apply(history, arguments);
  };

  history.replaceState = function(state, title, url) {
    if (url && !isSafeUrl(url)) {
      console.log('🚫 [Anti ClickBait] Blocked history.replaceState:', url);
      return;
    }
    return originalReplaceState.apply(history, arguments);
  };

  console.log('🛡️ [Anti ClickBait] Location & History protection enabled');

  // ============================================================
  // 3️⃣ CHẶN CLICK VÀO MỌI THỨ (ULTRA AGGRESSIVE)
  // ============================================================
  function blockExternalClicks(e) {
    let target = e.target;
    
    // Tìm thẻ <a> gần nhất
    while (target && target !== document) {
      if (target.tagName === 'A') {
        const href = target.getAttribute('href') || target.href || '';
        
        // Chặn mọi link ngoài nreer.com
        if (href && !isSafeUrl(href)) {
          console.log('🚫 [Anti ClickBait] Blocked click on link:', href);
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          showBlockNotification('Click bait link', href);
          
          // XÓA LUÔN LINK ĐÓ
          target.style.pointerEvents = 'none';
          target.style.opacity = '0.3';
          target.removeAttribute('href');
          
          return false;
        }
        
        // Chặn target="_blank" nếu link ngoài
        if (target.target === '_blank' && !isSafeUrl(href)) {
          console.log('🚫 [Anti ClickBait] Blocked _blank:', href);
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
      
      // Chặn form submit ra ngoài
      if (target.tagName === 'FORM') {
        const action = target.action || '';
        if (action && !isSafeUrl(action)) {
          console.log('🚫 [Anti ClickBait] Blocked form submit:', action);
          e.preventDefault();
          e.stopPropagation();
          showBlockNotification('Form submit', action);
          return false;
        }
      }
      
      target = target.parentElement;
    }
  }

  // Chặn ở TẤT CẢ các event và phase
  const clickEvents = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'pointerup'];
  clickEvents.forEach(eventType => {
    document.addEventListener(eventType, blockExternalClicks, true); // Capture
    document.addEventListener(eventType, blockExternalClicks, false); // Bubble
  });

  console.log('🛡️ [Anti ClickBait] Click & Form protection enabled');

  // ============================================================
  // 4️⃣ CHẶN META REFRESH + IFRAME REDIRECT
  // ============================================================
  function blockMetaRefresh() {
    // Chặn meta refresh
    const metaTags = document.querySelectorAll('meta[http-equiv="refresh"]');
    metaTags.forEach(meta => {
      const content = meta.getAttribute('content') || '';
      const urlMatch = content.match(/url=(.+)/i);
      if (urlMatch && !isSafeUrl(urlMatch[1])) {
        console.log('🚫 [Anti ClickBait] Blocked meta refresh:', urlMatch[1]);
        meta.remove();
        showBlockNotification('Meta refresh redirect', urlMatch[1]);
      }
    });

    // Chặn iframe redirect
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      const src = iframe.src || '';
      if (src && !isSafeUrl(src)) {
        console.log('🚫 [Anti ClickBait] Blocked iframe:', src);
        iframe.src = 'about:blank';
        iframe.remove();
      }
    });

    // Chặn base tag (có thể thay đổi base URL)
    const baseTags = document.querySelectorAll('base[href]');
    baseTags.forEach(base => {
      const href = base.getAttribute('href');
      if (href && !isSafeUrl(href)) {
        console.log('🚫 [Anti ClickBait] Blocked base tag:', href);
        base.remove();
      }
    });
  }

  console.log('🛡️ [Anti ClickBait] Meta/Iframe protection enabled');

  // ============================================================
  // 5️⃣ THEO DÕI VÀ XÓA ELEMENT XẤU LIÊN TỤC
  // ============================================================
  const observer = new MutationObserver((mutations) => {
    blockMetaRefresh();
    
    // Kiểm tra các node mới được thêm
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // Element node
          // Xóa script có src ngoài nreer.com
          if (node.tagName === 'SCRIPT' && node.src && !isSafeUrl(node.src)) {
            console.log('🚫 [Anti ClickBait] Blocked external script:', node.src);
            node.remove();
          }
          
          // Xóa iframe ngoài
          if (node.tagName === 'IFRAME' && node.src && !isSafeUrl(node.src)) {
            console.log('🚫 [Anti ClickBait] Blocked external iframe:', node.src);
            node.remove();
          }

          // Xóa link có target="_blank" dẫn ra ngoài
          if (node.tagName === 'A') {
            const href = node.getAttribute('href') || node.href || '';
            if (href && !isSafeUrl(href)) {
              console.log('🚫 [Anti ClickBait] Disabled external link:', href);
              node.style.pointerEvents = 'none';
              node.style.opacity = '0.3';
              node.removeAttribute('href');
            }
          }
        }
      });
    });
  });

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'src', 'action']
    });
  }

  console.log('🛡️ [Anti ClickBait] DOM mutation observer enabled');

  // ============================================================
  // 6️⃣ HÀM KIỂM TRA URL AN TOÀN (CẢI TIẾN)
  // ============================================================
  function isSafeUrl(url) {
    if (!url) return true;
    
    // Loại bỏ khoảng trắng
    url = url.toString().trim();
    
    // Cho phép URL tương đối và anchor
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
      return true;
    }
    
    // Cho phép javascript: và about: (tránh break trang)
    if (url.startsWith('javascript:') || url.startsWith('about:') || url.startsWith('data:')) {
      return true;
    }
    
    try {
      const urlObj = new URL(url, window.location.href);
      const host = urlObj.hostname.toLowerCase();
      
      // CHỈ cho phép nreer.com và subdomain
      const isNreerDomain = host === 'nreer.com' || 
                           host.endsWith('.nreer.com');
      
      if (!isNreerDomain) {
        console.warn('⚠️ [Anti ClickBait] External URL detected:', host);
      }
      
      return isNreerDomain;
    } catch (e) {
      // Nếu không parse được, cho phép (có thể là relative URL)
      console.warn('⚠️ [Anti ClickBait] Cannot parse URL:', url);
      return true;
    }
  }

  console.log('🛡️ [Anti ClickBait] URL validation enabled');

  // ============================================================
  // 7️⃣ HIỂN THỊ THÔNG BÁO CHẶN
  // ============================================================
  let lastNotificationTime = 0;
  const NOTIFICATION_COOLDOWN = 2000; // 2 giây

  function showBlockNotification(type, url) {
    const now = Date.now();
    if (now - lastNotificationTime < NOTIFICATION_COOLDOWN) {
      return; // Tránh spam thông báo
    }
    lastNotificationTime = now;

    // Rút gọn URL
    let shortUrl = url.toString();
    try {
      const urlObj = new URL(url, window.location.href);
      shortUrl = urlObj.hostname;
    } catch (e) {
      shortUrl = url.substring(0, 50);
    }

    // Tạo toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 2147483647;
      font-family: Arial, sans-serif;
      font-size: 14px;
      max-width: 350px;
      animation: slideIn 0.3s ease-out;
    `;

    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="font-size: 24px;">🛡️</div>
        <div>
          <div style="font-weight: bold; margin-bottom: 5px;">ĐÃ CHẶN ${type.toUpperCase()}</div>
          <div style="font-size: 12px; opacity: 0.9;">${shortUrl}</div>
        </div>
      </div>
    `;

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
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================================
  // 8️⃣ CHẠY KIỂM TRA LIÊN TỤC
  // ============================================================
  // Chạy ngay khi load
  blockMetaRefresh();
  
  // Chạy lại mỗi 500ms để bắt các element được thêm động
  setInterval(blockMetaRefresh, 500);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockMetaRefresh);
  }

  // Chạy khi trang load xong
  window.addEventListener('load', blockMetaRefresh);

  console.log('🛡️ [Anti ClickBait] Continuous monitoring enabled');

  // ============================================================
  // 9️⃣ BẢO VỆ CHỐNG GHI ĐÈ + THÊM CSP
  // ============================================================
  // Freeze các function để không thể override
  try {
    Object.freeze(window.open);
    Object.freeze(window.location.replace);
    Object.freeze(window.location.assign);
    Object.freeze(history.pushState);
    Object.freeze(history.replaceState);
  } catch (e) {
    console.warn('⚠️ [Anti ClickBait] Cannot freeze some functions:', e);
  }

  // Thêm CSP meta tag (nếu chưa có)
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://nreer.com https://*.nreer.com; navigate-to 'self' https://nreer.com https://*.nreer.com;";
    
    if (document.head) {
      document.head.insertBefore(cspMeta, document.head.firstChild);
      console.log('🛡️ [Anti ClickBait] CSP meta tag added');
    }
  }

  // Ngăn trang bị đóng bởi script quảng cáo
  window.addEventListener('beforeunload', function(e) {
    // Không cho phép close nếu không phải user action
    if (!e.isTrusted) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  }, true);

  console.log('🛡️ [Anti ClickBait] Protection freezing & CSP enabled');
  console.log('✅ [Anti ClickBait v3.0] ULTRA PROTECTION HOÀN TẤT - Bảo vệ cực mạnh cho nreer.com! 🔥');
})();

// ==UserScript==
// @name         Auto ZF By DANG CONG VU
// @namespace    https://tampermonkey.net/
// @version      1.0.0
// @description  Auto ZF - Zefoy automation
// @match        https://zefoy.com/*
// @run-at       document-end
// @grant        none
// @author       Dang Cong Vu
// @downloadURL https://update.greasyfork.org/scripts/555291/Auto%20ZF%20By%20DANG%20CONG%20VU.user.js
// @updateURL https://update.greasyfork.org/scripts/555291/Auto%20ZF%20By%20DANG%20CONG%20VU.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  console.log('🎯 [AUTO ZF] Script loaded');
  
  /* ============ CẤU HÌNH ============ */
  const CONFIG = {
    // Nút "Comment" - Auto click (XPath)
    COMMENT_BUTTON_SELECTOR: '//*[contains(concat(" ", @class, " "), concat(" ", "t-chearts-button", " "))]',
    
    // Input URL
    INPUT_SELECTOR: 'input.form-control.text-center.font-weight-bold.rounded-0.remove-spaces',
    
    // Nút Submit
    SUBMIT_BUTTON_SELECTOR: 'button.disableButton.btn.btn-primary.rounded-0',

    // Nút "Show comments"
    SHOW_COMMENTS_SELECTOR: 'button.wbutton.btn.btn-dark.rounded-0.font-weight-bold.p-2',
    
    // Danh sách comments
    COMMENT_ITEM_SELECTOR: 'form.w1a',
    
    // Username trong comment
    USERNAME_SELECTOR: '.font-weight-bold.d-inline-flex.kadi-rengi',
    
    // Danh sách username cần tăng tym (có thể để [] hoặc null để tăng tất cả)
    TARGET_USERNAMES: ['@tnhi6096'], // Default value
    
    // LocalStorage key để lưu settings
    STORAGE_KEY: 'autoZF_targetUsers',
    
    // Button tăng tym trong comment
    LIKE_BUTTON_SELECTOR: 'button.btn.btn-primary.rounded-0.mt-2',
    
    // Nút chuyển trang (pagination)
    NEXT_PAGE_SELECTOR: 'button.btn.btn-light.rounded-0.font-weight-bold',
    
    // Thời gian chờ giữa các lần click (tránh spam)
    CLICK_INTERVAL: 5000, // 5 giây
  };
  
  /* ============ TIỆN ÍCH ============ */
  // Helper function để sử dụng XPath selector
  function getElementByXPath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  
  function isVisible(el) {
    if (!el) return false;
    const style = getComputedStyle(el);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           !el.disabled;
  }
  
  async function clickElement(el) {
    if (!isVisible(el)) return false;
    
    try {
      // Giả lập hành vi NGƯỜI THẬT để bypass detection
      
      // 1. Scroll button vào view
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(r => setTimeout(r, 200)); // Đợi scroll xong
      
      // 2. Hover vào button (mouseover)
      el.dispatchEvent(new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
      el.dispatchEvent(new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
      await new Promise(r => setTimeout(r, 100)); // Đợi 100ms như người thật
      
      // 3. Dispatch full click sequence với coordinates
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      ['mousedown', 'mouseup', 'click'].forEach(type => {
        el.dispatchEvent(new MouseEvent(type, {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          screenX: x + window.screenX,
          screenY: y + window.screenY
        }));
      });
      
      // 4. Native click
      el.click();
      
      console.log('✅ Clicked (human-like):', el);
      return true;
    } catch (e) {
      console.error('❌ Click failed:', e);
      return false;
    }
  }
  
  /* ============ AUTO SUBMIT FORM ============ */
  let lastSubmittedLink = '';
  let hasSubmitted = false;
  let isProcessingTask = false;
  
  function autoCheckAndSubmit() {
    const input = document.querySelector(CONFIG.INPUT_SELECTOR);
    if (!input) return;
    
    const currentLink = input.value.trim();
    
    // Kiểm tra xem có đang ở trang Home không
    const submitButton = document.querySelector(CONFIG.SUBMIT_BUTTON_SELECTOR);
    const isAtHome = input && submitButton;
    
    // Nếu KHÔNG ở Home (đang xử lý task) → set flag
    if (!isAtHome) {
      if (!isProcessingTask) {
        console.log('📍 Not at Home, processing task...');
        isProcessingTask = true;
      }
      return;
    }
    
    // Nếu về Home SAU KHI xử lý task → reset TẤT CẢ
    if (isProcessingTask && isAtHome) {
      console.log('🏠 Back to Home after task, resetting ALL states...');
      lastSubmittedLink = '';
      isProcessingTask = false;
      lastClickTime = 0;
      clickedButtons.clear();
      console.log('✅ All states reset, ready for new link!');
    }
    
    // Nếu không có link hoặc đã submit link này rồi
    if (!currentLink || currentLink === lastSubmittedLink) return;
    
    // Nếu có link VÀ có button → Click!
    if (submitButton && isVisible(submitButton)) {
      console.log('🔗 Found link:', currentLink);
      console.log('🔘 Found Submit button:', submitButton);
      console.log('🚀 Auto clicking Submit button...');
      
      if (clickElement(submitButton)) {
        lastSubmittedLink = currentLink;
        hasSubmitted = true;
        console.log('✅ Form submitted successfully!');
      }
    } else {
      console.log('⏳ Waiting for Submit button...');
    }
  }
  
  function setupAutoSubmit() {
    console.log('👁️ Setting up auto submit watcher...');
    
    // Listen cho MỌI sự kiện tương tác với input → clear lastSubmittedLink
    function attachInputListener() {
      const input = document.querySelector(CONFIG.INPUT_SELECTOR);
      if (input && !input._listenerAttached) {
        const clearLastLink = () => {
          console.log('✏️ User interacted with input → Clearing lastSubmittedLink');
          lastSubmittedLink = '';
        };
        
        // Listen nhiều events để bắt mọi trường hợp
        input.addEventListener('input', clearLastLink);
        input.addEventListener('paste', clearLastLink);
        input.addEventListener('focus', clearLastLink);
        input.addEventListener('change', clearLastLink);
        
        input._listenerAttached = true;
        console.log('🎧 Multiple input listeners attached!');
      }
    }
    
    // Attach listener ngay khi load
    attachInputListener();
    
    // Check liên tục mỗi 500ms
    setInterval(autoCheckAndSubmit, 500);
    
    // Watch DOM changes
    const observer = new MutationObserver(() => {
      autoCheckAndSubmit();
      attachInputListener();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ Auto submit watcher ready!');
  }
  
  /* ============ AUTO CLICK BUTTONS ============ */
  let lastClickTime = 0;
  let clickedButtons = new Set();
  
  async function autoClickButtons() {
    const now = Date.now();
    
    // Check cooldown
    if (now - lastClickTime < CONFIG.CLICK_INTERVAL) {
      return;
    }
    
    // Ưu tiên 1: Tìm Comments Hearts button bằng XPath
    const commentButton = getElementByXPath(CONFIG.COMMENT_BUTTON_SELECTOR);
    
    if (commentButton && isVisible(commentButton)) {
      console.log('💬 Tìm thấy Comments Hearts button - Chuẩn bị click...');
      console.log('📋 Button HTML:', commentButton.outerHTML.substring(0, 200));
      
      // Random delay 500ms - 1500ms
      const randomDelay = 500 + Math.random() * 1000;
      await new Promise(r => setTimeout(r, randomDelay));
      
      console.log(`⏰ Đợi ${Math.round(randomDelay)}ms rồi click...`);
      
      if (await clickElement(commentButton)) {
        lastClickTime = now;
        console.log('✅ Comments Hearts button clicked!');
        console.log('⏰ Cooldown 5s...');
      }
      return;
    }
    
    // Ưu tiên 2: Auto click nút "Show comments" (sau khi Submit)
    const showCommentsBtn = document.querySelector(CONFIG.SHOW_COMMENTS_SELECTOR);
    if (showCommentsBtn && isVisible(showCommentsBtn)) {
      const btnId = showCommentsBtn.outerHTML;
      if (!clickedButtons.has(btnId)) {
        console.log('💬 Auto clicking Show comments button...');
        if (await clickElement(showCommentsBtn)) {
          clickedButtons.add(btnId);
          console.log('✅ Show comments button clicked!');
          setTimeout(() => clickedButtons.delete(btnId), 10000);
        }
      }
    }
  }
  
  /* ============ AUTO LIKE COMMENTS ============ */
  let likeClickCount = 0;
  let currentPage = 1;
  const MAX_PAGES = 20;
  
  async function autoClickLikeButtons() {
    const commentsList = document.querySelectorAll(CONFIG.COMMENT_ITEM_SELECTOR);
    
    if (commentsList.length === 0) return;
    
    console.log(`📋 Tìm thấy ${commentsList.length} comments`);
    
    for (const comment of commentsList) {
      const usernameEl = comment.querySelector(CONFIG.USERNAME_SELECTOR);
      if (!usernameEl) continue;
      
      const username = usernameEl.textContent.trim();
      const shouldLike = CONFIG.TARGET_USERNAMES.length === 0 || 
                         CONFIG.TARGET_USERNAMES.some(target => username.includes(target));
      
      if (!shouldLike) continue;
      
      const likeButton = comment.querySelector(CONFIG.LIKE_BUTTON_SELECTOR);
      if (!likeButton || !isVisible(likeButton) || likeButton._clicked) continue;
      
      console.log(`💖 Found target: ${username}`);
      
      if (await clickElement(likeButton)) {
        likeButton._clicked = true;
        likeClickCount++;
        console.log(`✅ Liked! Total: ${likeClickCount}`);
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
      }
    }
    
    await handlePagination();
  }
  
  async function handlePagination() {
    if (currentPage >= MAX_PAGES) {
      console.log(`🏁 Reached max pages (${MAX_PAGES})`);
      goBackToHome();
      return;
    }
    
    const nextButton = document.querySelector(CONFIG.NEXT_PAGE_SELECTOR);
    
    if (!nextButton || !isVisible(nextButton)) {
      console.log('🏁 No more pages');
      goBackToHome();
      return;
    }
    
    console.log(`📄 Chuyển trang ${currentPage + 1}...`);
    
    if (await clickElement(nextButton)) {
      currentPage++;
      console.log(`✅ Page ${currentPage}`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  function goBackToHome() {
    console.log('🏠 Returning to Home...');
    likeClickCount = 0;
    currentPage = 1;
    lastSubmittedLink = '';
    clickedButtons.clear();
    
    const homeButton = document.querySelector('a[href="#"]');
    if (homeButton) {
      homeButton.click();
    } else {
      window.location.href = window.location.origin;
    }
  }
  
  /* ============ SETTINGS UI ============ */
  function loadSettings() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          CONFIG.TARGET_USERNAMES = parsed;
          console.log('✅ Loaded target users from storage:', CONFIG.TARGET_USERNAMES);
        }
      }
    } catch (e) {
      console.error('❌ Error loading settings:', e);
    }
  }
  
  function saveSettings(usernames) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(usernames));
      CONFIG.TARGET_USERNAMES = usernames;
      console.log('💾 Saved target users:', usernames);
    } catch (e) {
      console.error('❌ Error saving settings:', e);
    }
  }
  
  function createSettingsUI() {
    // Tạo floating button - giống y hệt Auto NR
    const floatingBtn = document.createElement('button');
    floatingBtn.id = 'autoZF-settings-btn';
    floatingBtn.textContent = '⚙️';
    floatingBtn.title = 'Cài đặt Auto ZF';
    Object.assign(floatingBtn.style, {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      zIndex: '2147483647',
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontWeight: '600',
      fontSize: '10px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
      cursor: 'pointer'
    });
    
    floatingBtn.onmouseover = () => floatingBtn.style.transform = 'scale(1.1)';
    floatingBtn.onmouseout = () => floatingBtn.style.transform = 'scale(1)';
    
    // Tạo modal settings
    const modal = document.createElement('div');
    modal.id = 'autoZF-settings-modal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 1000000;
      align-items: center;
      justify-content: center;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      ">
        <h3 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">⚙️ Cài đặt Target Users</h3>
        <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
          Nhập danh sách username cần tăng tym (mỗi username 1 dòng, có @ ở đầu):
        </p>
        <textarea id="autoZF-usernames" style="
          width: 100%;
          height: 150px;
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          font-family: monospace;
          resize: vertical;
        " placeholder="@tnhi6096\n@user2\n@user3"></textarea>
        <p style="margin: 10px 0; color: #999; font-size: 12px;">
          💡 Để trống để tăng tym TẤT CẢ comments
        </p>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="autoZF-save-btn" style="
            flex: 1;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            font-weight: bold;
          ">💾 Lưu</button>
          <button id="autoZF-cancel-btn" style="
            flex: 1;
            padding: 12px;
            background: #ccc;
            color: #333;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
          ">❌ Hủy</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(floatingBtn);
    document.body.appendChild(modal);
    
    // Event handlers
    floatingBtn.onclick = () => {
      const textarea = document.getElementById('autoZF-usernames');
      textarea.value = CONFIG.TARGET_USERNAMES.join('\n');
      modal.style.display = 'flex';
    };
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    };
    
    document.getElementById('autoZF-save-btn').onclick = () => {
      const textarea = document.getElementById('autoZF-usernames');
      const text = textarea.value.trim();
      
      let usernames = [];
      if (text) {
        usernames = text.split('\n')
          .map(u => u.trim())
          .filter(u => u.length > 0);
      }
      
      saveSettings(usernames);
      modal.style.display = 'none';
      alert(`✅ Đã lưu ${usernames.length} target users!`);
    };
    
    document.getElementById('autoZF-cancel-btn').onclick = () => {
      modal.style.display = 'none';
    };
    
    console.log('✅ Settings UI created!');
  }
  
  /* ============ KHỞI TẠO ============ */
  function init() {
    console.log('🚀 [AUTO ZF] Initializing...');
    console.log('📍 Current URL:', location.href);
    
    // Load settings từ localStorage
    loadSettings();
    
    setTimeout(() => {
      console.log('✅ Starting auto features...');
      
      // Setup auto submit
      setupAutoSubmit();
      
      // Auto click Show comments mỗi 1 giây
      setInterval(autoClickButtons, 1000);
      
      // Auto like comments mỗi 2 giây
      setInterval(autoClickLikeButtons, 2000);
      
      // Watch DOM changes
      if (document.body) {
        const observer = new MutationObserver(() => {
          autoClickButtons();
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        console.log('👁️ DOM observer active');
      }
      
      console.log('✅ [AUTO ZF] Ready!');
    }, 1000);
    
    // Tạo Settings UI SAU cùng để đảm bảo body đã ready
    setTimeout(() => {
      if (document.body) {
        createSettingsUI();
      } else {
        console.error('❌ Body not ready for Settings UI!');
      }
    }, 2000);
  }
  
  // Đảm bảo chạy sau khi trang load xong
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();

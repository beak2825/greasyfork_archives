// ==UserScript==
// @name         Auto NR By DANG CONG VU
// @namespace    https://tampermonkey.net/
// @version      2.4.17
// @description  Auto NR - Build mới từ đầu + Settings UI
// @match        https://nreer.com/*
// @run-at       document-end
// @grant        none
// @author       Dang Cong Vu
// @downloadURL https://update.greasyfork.org/scripts/555283/Auto%20NR%20By%20DANG%20CONG%20VU.user.js
// @updateURL https://update.greasyfork.org/scripts/555283/Auto%20NR%20By%20DANG%20CONG%20VU.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  console.log('🎯 [AUTO NR v2] Script loaded');
  
  /* ============ CẤU HÌNH API ============ */
  // Chạy local: http://localhost:3000
  // Deploy online: https://your-repl.replit.app
  const API_BASE_URL = 'http://localhost:3100';
  
  /* ============ CẤU HÌNH ============ */
  const CONFIG = {
    // Nút "Use" - Auto click
    USE_BUTTON_SELECTOR: 'button.btn.btn-primary.btn-lg.btn-block',
    
    // Nút "Show comments" (mở modal comments) - có data-type="com_op"
    SHOW_COMMENTS_SELECTOR: 'button.btn.btn-link.btn-block.bg-dark[data-type="com_op"]',
    
    // Nút "Show comments" trong modal (sau khi modal mở) - có onclick chứa "show_comments"
    SHOW_COMMENTS_MODAL_SELECTOR: 'button.btn.btn-lg.btn-secondary[onclick*="show_comments"]',
    
    // Danh sách comments
    COMMENTS_LIST_SELECTOR: '.col-12.text-left.p-0',
    COMMENT_ITEM_SELECTOR: '.input-group.mb-1',
    
    // Agent number - TÔI LÀ AGENT SỐ MẤY? (1-18)
    MY_AGENT_NUMBER: null, // Sẽ được load từ localStorage
    
    // Danh sách username cần tăng tym (có thể để [] hoặc null để tăng tất cả)
    TARGET_USERNAMES: ['@shinchan13_09'], // Default value
    
    // LocalStorage keys
    STORAGE_KEY_AGENT: 'autoNR_myAgentNumber',
    STORAGE_KEY_MAPPING: 'autoNR_agentUserMapping',
    
    // Button tăng tym trong comment
    LIKE_BUTTON_SELECTOR: 'button.btn.btn-info.btn-sm',
    
    // Element text-muted (auto click)
    TEXT_MUTED_SELECTOR: '.text-muted, small.text-muted',
    
    // Input URL
    INPUT_SELECTOR: 'input.form-control.form-control-lg',
    
    // Nút Submit (tìm kiếm)
    SUBMIT_BUTTON_SELECTOR: 'button.btn.btn-outline-secondary',
    
    // Thời gian chờ giữa các lần click (tránh spam)
    CLICK_INTERVAL: 5000, // 5 giây
    
    // Thời gian chờ sau khi có link mới thì submit
    SUBMIT_DELAY: 3000, // 3 giây
  };
  
  /* ============ TIỆN ÍCH ============ */
  function isVisible(el) {
    if (!el) return false;
    const style = getComputedStyle(el);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           !el.disabled;
  }
  
  function clickElement(el) {
    if (!isVisible(el)) return false;
    
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      el.dispatchEvent(new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      }));
    });
    
    console.log('✅ Clicked:', el);
    return true;
  }
  
  /* ============ AUTO CLICK BUTTONS ============ */
  let lastClickTime = 0;
  let clickedButtons = new Set(); // Nhớ các button đã click
  
  function autoClickButtons() {
    const now = Date.now();
    
    // Debug: Log các button tìm được
    const allButtons = document.querySelectorAll('button');
    console.log(`🔍 Total buttons found: ${allButtons.length}`);
    
    // Ưu tiên 1: Click button tăng tym trong danh sách comments
    if (autoClickLikeButtons()) {
      lastClickTime = now;
      return;
    }
    
    // Check cooldown cho các nút khác
    if (now - lastClickTime < CONFIG.CLICK_INTERVAL) {
      console.log(`⏰ Cooldown active, ${Math.ceil((CONFIG.CLICK_INTERVAL - (now - lastClickTime)) / 1000)}s remaining`);
      return;
    }
    
    // Ưu tiên 2: Click nút "Show comments" trong modal (nếu modal đã mở)
    console.log('🔍 Checking for modal Show comments button...');
    const showCommentsModalBtn = document.querySelector(CONFIG.SHOW_COMMENTS_MODAL_SELECTOR);
    console.log('Modal button found:', !!showCommentsModalBtn);
    if (showCommentsModalBtn && isVisible(showCommentsModalBtn)) {
      const btnId = showCommentsModalBtn.outerHTML;
      if (!clickedButtons.has(btnId)) {
        console.log('💬 Attempting to click modal Show comments button...');
        if (clickElement(showCommentsModalBtn)) {
          lastClickTime = now;
          clickedButtons.add(btnId);
          console.log('💬 Show comments (modal) button clicked!');
          setTimeout(() => clickedButtons.delete(btnId), 10000);
          return;
        }
      }
    }
    
    // Ưu tiên 3: Click nút "Show comments" (mở modal)
    console.log('🔍 Checking for Show comments button [data-type="com_op"]...');
    const showCommentsBtn = document.querySelector(CONFIG.SHOW_COMMENTS_SELECTOR);
    console.log('Show comments button found:', !!showCommentsBtn);
    if (showCommentsBtn) {
      console.log('Show comments button visible:', isVisible(showCommentsBtn));
    }
    if (showCommentsBtn && isVisible(showCommentsBtn)) {
      const btnId = showCommentsBtn.outerHTML;
      if (!clickedButtons.has(btnId)) {
        console.log('💬 Attempting to click Show comments button...');
        if (clickElement(showCommentsBtn)) {
          lastClickTime = now;
          clickedButtons.add(btnId);
          console.log('💬 Show comments button clicked!');
          setTimeout(() => clickedButtons.delete(btnId), 10000);
          return;
        }
      } else {
        console.log('⚠️ Show comments button already clicked recently');
      }
    }
    
    // Ưu tiên 4: Click nút "Use"
    console.log('🔍 Checking for Use button...');
    const useButton = document.querySelector(CONFIG.USE_BUTTON_SELECTOR);
    console.log('Use button found:', !!useButton);
    if (useButton && isVisible(useButton)) {
      const btnId = useButton.outerHTML;
      if (!clickedButtons.has(btnId)) {
        console.log('🎯 Attempting to click Use button...');
        if (clickElement(useButton)) {
          lastClickTime = now;
          clickedButtons.add(btnId);
          console.log('🎯 Use button clicked!');
          setTimeout(() => clickedButtons.delete(btnId), 10000);
        }
      }
    }
    
    // Ưu tiên 5: Click element text-muted
    console.log('🔍 Checking for text-muted element...');
    const textMutedElements = document.querySelectorAll(CONFIG.TEXT_MUTED_SELECTOR);
    console.log('Text-muted elements found:', textMutedElements.length);
    if (textMutedElements.length > 0) {
      for (const element of textMutedElements) {
        if (isVisible(element)) {
          const elId = element.outerHTML;
          if (!clickedButtons.has(elId)) {
            console.log('📝 Attempting to click text-muted element:', element.textContent.trim());
            if (clickElement(element)) {
              lastClickTime = now;
              clickedButtons.add(elId);
              console.log('📝 Text-muted element clicked!');
              setTimeout(() => clickedButtons.delete(elId), 10000);
              return; // Click 1 lần rồi thoát
            }
          }
        }
      }
    }
  }
  
  /* ============ AUTO CLICK LIKE BUTTONS IN COMMENTS ============ */
  let lastCheckedPage = 0; // Nhớ trang đã check
  let isLoadingNextPage = false; // Flag để biết đang load trang mới
  
  function autoClickLikeButtons() {
    // Nếu đang load trang mới → đợi
    if (isLoadingNextPage) {
      console.log('⏳ Waiting for next page to load...');
      return false;
    }
    
    const commentsList = document.querySelector(CONFIG.COMMENTS_LIST_SELECTOR);
    if (!commentsList) return false;
    
    const commentItems = commentsList.querySelectorAll(CONFIG.COMMENT_ITEM_SELECTOR);
    if (commentItems.length === 0) return false;
    
    console.log(`📝 Found ${commentItems.length} comments`);
    
    // Tìm button tăng tym cho user cụ thể
    for (const item of commentItems) {
      // Tìm username trong comment
      const usernameElement = item.querySelector('strong.d-block');
      const username = usernameElement?.textContent?.trim() || '';
      
      console.log(`👤 Checking comment from: ${username}`);
      
      // Nếu có TARGET_USERNAMES, chỉ click cho user trong danh sách
      // Nếu không có TARGET_USERNAMES (null/empty), click tất cả
      const shouldClick = !CONFIG.TARGET_USERNAMES || 
                         CONFIG.TARGET_USERNAMES.length === 0 || 
                         CONFIG.TARGET_USERNAMES.includes(username);
      
      if (shouldClick) {
        const likeButton = item.querySelector(CONFIG.LIKE_BUTTON_SELECTOR);
        
        if (likeButton && isVisible(likeButton)) {
          console.log(`✅ Target user found: ${username}`);
          if (clickElement(likeButton)) {
            console.log(`❤️ Liked comment from: ${username}`);
            lastCheckedPage = 0; // Reset về trang đầu cho lần sau
            return true;
          }
        } else {
          console.log(`⚠️ Like button not found or not visible for: ${username}`);
        }
      } else {
        console.log(`⏭️ Skipping comment from: ${username} (not target user)`);
      }
    }
    
    // Không tìm thấy target user ở trang này → Sang trang tiếp theo
    console.log(`⚠️ No target user found on current page`);
    
    // Tìm nút next page: button.page-link có icon fa-chevron-right
    const allPageButtons = document.querySelectorAll('button.page-link');
    let nextBtn = null;
    
    for (const btn of allPageButtons) {
      const hasRightIcon = btn.querySelector('i.fa.fa-chevron-right, .fa-chevron-right');
      if (hasRightIcon && isVisible(btn)) {
        nextBtn = btn;
        break;
      }
    }
    
    if (nextBtn) {
      console.log(`➡️ Found next page button, clicking...`);
      
      // Check xem có phải đang loop không (tránh click vô hạn)
      const currentTime = Date.now();
      if (!window._lastPageClickTime) window._lastPageClickTime = 0;
      if (!window._pageClickCount) window._pageClickCount = 0;
      
      if (currentTime - window._lastPageClickTime < 5000) {
        window._pageClickCount++;
        if (window._pageClickCount > 20) {
          console.log(`🛑 Clicked too many pages (${window._pageClickCount}), stopping...`);
          window._pageClickCount = 0;
          lastCheckedPage = 0;
          isLoadingNextPage = false;
          return false;
        }
      } else {
        window._pageClickCount = 1;
      }
      
      window._lastPageClickTime = currentTime;
      
      // Set flag đang load và click
      isLoadingNextPage = true;
      clickElement(nextBtn);
      
      // Sau 3 giây mới cho phép check lại (đợi trang load đủ lâu)
      setTimeout(() => {
        isLoadingNextPage = false;
        console.log('✅ Ready to check next page');
      }, 3000);
      
      return false; // Không block cooldown, sẽ check lại trang mới
    } else {
      console.log(`🏁 No next page button found, resetting...`);
      lastCheckedPage = 0;
      window._pageClickCount = 0;
      isLoadingNextPage = false;
    }
    
    return false;
  }
  
  /* ============ AUTO SUBMIT FORM ============ */
  let lastSubmittedLink = '';
  let hasSubmitted = false;
  let isProcessingTask = false; // Flag để biết đang xử lý task
  
  function autoCheckAndSubmit() {
    const input = document.querySelector(CONFIG.INPUT_SELECTOR);
    if (!input) return;
    
    const currentLink = input.value.trim();
    
    // Kiểm tra xem có đang ở trang Home không (có input và nút Search)
    const searchButton = document.querySelector(CONFIG.SUBMIT_BUTTON_SELECTOR);
    const isAtHome = input && searchButton && (location.pathname === '/' || location.pathname === '/home');
    
    // Nếu KHÔNG ở Home (đang xử lý task) → set flag và KHÔNG submit
    if (!isAtHome) {
      if (!isProcessingTask) {
        console.log('📍 Not at Home, processing task...');
        isProcessingTask = true;
      }
      return;
    }
    
    // Nếu về Home SAU KHI xử lý task → reset TẤT CẢ để sẵn sàng cho link mới
    if (isProcessingTask && isAtHome) {
      console.log('🏠 Back to Home after task, resetting ALL states...');
      lastSubmittedLink = '';
      isProcessingTask = false;
      lastClickTime = 0;
      clickedButtons.clear();
      isLoadingNextPage = false;
      lastCheckedPage = 0;
      window._pageClickCount = 0;
      window._lastPageClickTime = 0;
      console.log('✅ All states reset, ready for new link!');
    }
    
    // Nếu không có link hoặc đã submit link này rồi
    if (!currentLink || currentLink === lastSubmittedLink) return;
    
    // Tìm nút submit
    let submitButton = document.querySelector(CONFIG.SUBMIT_BUTTON_SELECTOR);
    
    // Thử tìm button có text "Search"
    if (!submitButton) {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = btn.textContent.trim().toLowerCase();
        if (text.includes('search') || text.includes('tìm')) {
          submitButton = btn;
          break;
        }
      }
    }
    
    // Nếu có link VÀ có button → Click!
    if (submitButton && isVisible(submitButton)) {
      console.log('🔗 Found link:', currentLink);
      console.log('🔘 Found Search button:', submitButton);
      console.log('🚀 Auto clicking Search button...');
      
      if (clickElement(submitButton)) {
        lastSubmittedLink = currentLink;
        hasSubmitted = true;
        console.log('✅ Form submitted successfully!');
      }
    } else {
      console.log('⏳ Waiting for Search button...');
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
        input.addEventListener('input', clearLastLink);   // Khi type/change
        input.addEventListener('paste', clearLastLink);   // Khi paste
        input.addEventListener('focus', clearLastLink);   // Khi click vào input
        input.addEventListener('change', clearLastLink);  // Khi blur sau khi edit
        
        input._listenerAttached = true;
        console.log('🎧 Multiple input listeners attached (input, paste, focus, change)!');
      }
    }
    
    // Attach listener ngay khi load
    attachInputListener();
    
    // Check liên tục mỗi 500ms (nhanh hơn để bắt kịp)
    setInterval(autoCheckAndSubmit, 500);
    
    // Watch DOM changes để bắt khi button xuất hiện và attach listener cho input mới
    const observer = new MutationObserver(() => {
      autoCheckAndSubmit();
      attachInputListener(); // Re-attach nếu input bị replace
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ Auto submit watcher ready!');
  }
  
  /* ============ SETTINGS UI ============ */
  async function loadSettings() {
    try {
      // Load agent number từ localStorage (vẫn lưu local)
      const savedAgent = localStorage.getItem(CONFIG.STORAGE_KEY_AGENT);
      if (savedAgent) {
        CONFIG.MY_AGENT_NUMBER = savedAgent;
        console.log('✅ Tôi là Agent:', CONFIG.MY_AGENT_NUMBER);
      }
      
      // GET user từ API server
      if (CONFIG.MY_AGENT_NUMBER) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/${CONFIG.MY_AGENT_NUMBER}`);
          if (response.ok) {
            const result = await response.json();
            const myUser = result.user;
            
            if (myUser) {
              CONFIG.TARGET_USERNAMES = [myUser];
              console.log(`✅ Agent ${CONFIG.MY_AGENT_NUMBER} → User: ${myUser} (from API)`);
            } else {
              CONFIG.TARGET_USERNAMES = [];
              console.log(`⚠️ Agent ${CONFIG.MY_AGENT_NUMBER} không có user (API)`);
            }
          } else {
            console.error('❌ API Error:', response.status);
            CONFIG.TARGET_USERNAMES = [];
          }
        } catch (apiError) {
          console.error('❌ API Fetch Error:', apiError.message);
          console.log('⚠️ Không kết nối được API server! Kiểm tra xem server đang chạy chưa.');
          CONFIG.TARGET_USERNAMES = [];
        }
      } else {
        console.log('⚠️ Chưa chọn Agent Number! Hãy mở Settings để chọn.');
      }
    } catch (e) {
      console.error('❌ Error loading settings:', e);
    }
  }
  
  async function saveSettings(agentNumber, usernames) {
    try {
      // Lưu agent number vào localStorage
      if (agentNumber) {
        localStorage.setItem(CONFIG.STORAGE_KEY_AGENT, agentNumber);
        CONFIG.MY_AGENT_NUMBER = agentNumber;
        console.log('💾 Saved Agent Number:', agentNumber);
        
        // GET user từ API cho agent này
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/${agentNumber}`);
          if (response.ok) {
            const result = await response.json();
            const myUser = result.user;
            
            if (myUser) {
              CONFIG.TARGET_USERNAMES = [myUser];
              console.log(`✅ Agent ${agentNumber} → User: ${myUser} (from API)`);
            } else {
              CONFIG.TARGET_USERNAMES = [];
              console.log(`⚠️ Agent ${agentNumber} chưa có user (chờ đồng bộ từ HTML)`);
            }
          } else {
            console.error('❌ API Error:', response.status);
            CONFIG.TARGET_USERNAMES = [];
          }
        } catch (apiError) {
          console.error('❌ API Fetch Error:', apiError.message);
          CONFIG.TARGET_USERNAMES = [];
        }
      }
    } catch (e) {
      console.error('❌ Error saving settings:', e);
    }
  }
  
  function createSettingsUI() {
    // Tạo floating button - giống y hệt icon NR, nằm bên trái nó
    const floatingBtn = document.createElement('button');
    floatingBtn.id = 'autoNR-settings-btn';
    floatingBtn.textContent = '⚙️';
    floatingBtn.title = 'Cài đặt Auto NR';
    Object.assign(floatingBtn.style, {
      position: 'fixed',
      right: '40px',        // Icon NR ở 12px, cộng thêm 22px (width) + 6px gap = 40px
      bottom: '14px',       // Giống icon NR
      zIndex: '2147483647',
      width: '22px',        // Giống icon NR
      height: '22px',       // Giống icon NR
      borderRadius: '50%',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontWeight: '600',
      fontSize: '10px',     // Giống icon NR
      boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
      cursor: 'pointer'
    });
    
    floatingBtn.onmouseover = () => floatingBtn.style.transform = 'scale(1.1)';
    floatingBtn.onmouseout = () => floatingBtn.style.transform = 'scale(1)';
    
    // Tạo modal settings
    const modal = document.createElement('div');
    modal.id = 'autoNR-settings-modal';
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
        <h3 style="margin: 0 0 20px 0; color: #333; font-size: 20px;">⚙️ Cài đặt Auto NR</h3>
        
        <div style="margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 6px;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #333;">
            🎯 Tôi là Agent số:
          </label>
          <select id="autoNR-agent-number" style="
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
            font-weight: bold;
            background: white;
          ">
            <option value="">-- Chọn Agent Number --</option>
            <option value="1">Agent 1</option>
            <option value="2">Agent 2</option>
            <option value="3">Agent 3</option>
            <option value="4">Agent 4</option>
            <option value="5">Agent 5</option>
            <option value="6">Agent 6</option>
            <option value="7">Agent 7</option>
            <option value="8">Agent 8</option>
            <option value="9">Agent 9</option>
            <option value="10">Agent 10</option>
            <option value="11">Agent 11</option>
            <option value="12">Agent 12</option>
            <option value="13">Agent 13</option>
            <option value="14">Agent 14</option>
            <option value="15">Agent 15</option>
            <option value="16">Agent 16</option>
            <option value="17">Agent 17</option>
            <option value="18">Agent 18</option>
          </select>
          <p style="margin: 8px 0 0 0; color: #666; font-size: 12px;">
            💡 Mỗi Chrome/Agent cần chọn số riêng (1-18)
          </p>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background: #e8f5e9; border-radius: 6px; border: 2px solid #4caf50;">
          <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #2e7d32;">
            👤 Username cho Agent này:
          </label>
          <div id="autoNR-current-user" style="
            padding: 12px;
            background: white;
            border-radius: 6px;
            font-size: 16px;
            font-family: monospace;
            font-weight: bold;
            color: #2e7d32;
            text-align: center;
          ">Chưa có user</div>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">
            ✨ Tự động đồng bộ từ HTML khi bạn nhập user bên đó!
          </p>
        </div>
        <div style="display: flex; gap: 10px; margin-top: 20px;">
          <button id="autoNR-save-btn" style="
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
          <button id="autoNR-cancel-btn" style="
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
      const select = document.getElementById('autoNR-agent-number');
      const userDisplay = document.getElementById('autoNR-current-user');
      
      // Load current settings
      if (CONFIG.MY_AGENT_NUMBER) {
        select.value = CONFIG.MY_AGENT_NUMBER;
      }
      
      // Hiển thị user hiện tại
      if (CONFIG.TARGET_USERNAMES && CONFIG.TARGET_USERNAMES.length > 0) {
        userDisplay.textContent = CONFIG.TARGET_USERNAMES[0];
        userDisplay.style.color = '#2e7d32';
      } else {
        userDisplay.textContent = 'Chưa có user (nhập bên HTML)';
        userDisplay.style.color = '#999';
      }
      
      modal.style.display = 'flex';
    };
    
    // Khi đổi Agent Number, cập nhật user hiện tại từ API
    document.getElementById('autoNR-agent-number').onchange = async (e) => {
      const agentNumber = e.target.value;
      const userDisplay = document.getElementById('autoNR-current-user');
      
      if (!agentNumber) {
        userDisplay.textContent = 'Chưa chọn Agent';
        userDisplay.style.color = '#999';
        return;
      }
      
      // GET user từ API
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${agentNumber}`);
        if (response.ok) {
          const result = await response.json();
          const user = result.user;
          
          if (user) {
            userDisplay.textContent = user;
            userDisplay.style.color = '#2e7d32';
          } else {
            userDisplay.textContent = 'Chưa có user (nhập bên HTML)';
            userDisplay.style.color = '#999';
          }
        } else {
          userDisplay.textContent = 'Lỗi API';
          userDisplay.style.color = '#f44336';
        }
      } catch (e) {
        console.error('Error fetching from API:', e);
        userDisplay.textContent = 'Không kết nối API';
        userDisplay.style.color = '#f44336';
      }
    };
    
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    };
    
    document.getElementById('autoNR-save-btn').onclick = () => {
      const select = document.getElementById('autoNR-agent-number');
      
      const agentNumber = select.value;
      
      if (!agentNumber) {
        alert('⚠️ Vui lòng chọn Agent Number!');
        return;
      }
      
      // Chỉ lưu agent number, user sẽ tự động đồng bộ từ HTML
      saveSettings(agentNumber, null);
      modal.style.display = 'none';
      
      const userDisplay = document.getElementById('autoNR-current-user');
      const currentUser = userDisplay.textContent;
      
      if (currentUser && !currentUser.includes('Chưa')) {
        alert(`✅ Đã lưu!\nAgent ${agentNumber} → ${currentUser}\n\n💡 Username sẽ tự động cập nhật khi bạn nhập bên HTML!`);
      } else {
        alert(`✅ Đã lưu Agent ${agentNumber}!\n\n💡 Hãy nhập username bên HTML để tự động đồng bộ sang đây.`);
      }
    };
    
    document.getElementById('autoNR-cancel-btn').onclick = () => {
      modal.style.display = 'none';
    };
    
    console.log('✅ Settings UI created!');
  }
  
  /* ============ NOTIFICATION KHI USER THAY ĐỔI ============ */
  function showUserChangeNotification(agentNumber, newUser) {
    // Tạo notification popup
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 5px 7px;
      border-radius: 4px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.18);
      z-index: 2147483647;
      font-size: 7px;
      font-weight: bold;
      animation: slideIn 0.3s ease-out;
      min-width: 90px;
    `;
    
    notif.innerHTML = `
      <div style="display: flex; align-items: center; gap: 3px; margin-bottom: 3px;">
        <span style="font-size: 9px;">🔄</span>
        <span style="font-size: 7px;">USER ĐÃ CẬP NHẬT!</span>
      </div>
      <div style="background: rgba(255,255,255,0.13); padding: 3px; border-radius: 2px; margin-top: 3px;">
        <div style="font-size: 6px; opacity: 0.9; margin-bottom: 1px;">Agent ${agentNumber} →</div>
        <div style="font-size: 7px; font-family: monospace;">${newUser || 'KHÔNG CÓ USER'}</div>
      </div>
    `;
    
    // Thêm CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    if (!document.getElementById('autoNR-notif-style')) {
      style.id = 'autoNR-notif-style';
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notif);
    
    // Tự động ẩn sau 2 giây
    setTimeout(() => {
      notif.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }
  
  /* ============ AUTO APPLY UA KHI PHÁT HIỆN "PLEASE UPDATE YOUR BROWSER" ============ */
  let lastApplyUATime = 0;
  const APPLY_UA_COOLDOWN = 10000; // 10 giây cooldown để tránh spam
  
  function checkAndApplyUA() {
    // Tìm element có class "text-danger font-weight-bold" với nội dung "Please update your browser"
    const warningElement = document.querySelector('h2.text-danger.font-weight-bold');
    
    if (warningElement && warningElement.textContent.includes('Please update your browser')) {
      const now = Date.now();
      
      // Check cooldown
      if (now - lastApplyUATime < APPLY_UA_COOLDOWN) {
        console.log(`⏰ Apply UA cooldown, ${Math.ceil((APPLY_UA_COOLDOWN - (now - lastApplyUATime)) / 1000)}s remaining`);
        return;
      }
      
      console.log('');
      console.log('🚨🚨🚨 ================================ 🚨🚨🚨');
      console.log('⚠️ PHÁT HIỆN: "Please update your browser"');
      console.log('🔄 Đang gửi lệnh APPLY THIS TAB...');
      console.log('🚨🚨🚨 ================================ 🚨🚨🚨');
      console.log('');
      
      // Gửi lệnh apply-this-tab qua WebSocket
      sendApplyThisTabCommand();
      lastApplyUATime = now;
    }
  }
  
  function sendApplyThisTabCommand() {
    if (!CONFIG.MY_AGENT_NUMBER) {
      console.error('❌ Chưa chọn Agent Number! Không thể gửi lệnh Apply UA.');
      showApplyUANotification(false, 'Chưa chọn Agent Number!');
      return;
    }
    
    // Kết nối WebSocket và gửi lệnh
    const wsUrl = 'ws://localhost:9999';
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected, sending apply-this-tab command...');
        
        // Đăng ký là manager để có quyền gửi lệnh
        ws.send(JSON.stringify({ type: 'register-manager' }));
        
        // Gửi lệnh apply-this-tab cho agent của mình
        setTimeout(() => {
          const command = {
            type: 'apply-this-tab',
            agentNumber: String(CONFIG.MY_AGENT_NUMBER)
          };
          ws.send(JSON.stringify(command));
          console.log(`✅ Đã gửi lệnh apply-this-tab cho Agent ${CONFIG.MY_AGENT_NUMBER}`);
          showApplyUANotification(true, `Agent ${CONFIG.MY_AGENT_NUMBER}`);
          
          // Đóng WebSocket sau khi gửi xong
          setTimeout(() => ws.close(), 500);
        }, 100);
      };
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        showApplyUANotification(false, 'Không kết nối được WebSocket!');
      };
      
      ws.onclose = () => {
        console.log('🔌 WebSocket closed');
      };
      
    } catch (e) {
      console.error('❌ Error creating WebSocket:', e);
      showApplyUANotification(false, 'Lỗi kết nối WebSocket!');
    }
  }
  
  function showApplyUANotification(success, message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: ${success ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      z-index: 2147483647;
      font-size: 14px;
      font-weight: bold;
      animation: slideDown 0.3s ease-out;
    `;
    
    notif.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">${success ? '✅' : '❌'}</span>
        <span>${success ? 'Đã gửi Apply UA!' : 'Lỗi Apply UA!'}</span>
      </div>
      <div style="font-size: 11px; opacity: 0.9; margin-top: 4px;">${message}</div>
    `;
    
    // Thêm CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    if (!document.getElementById('autoNR-applyUA-style')) {
      style.id = 'autoNR-applyUA-style';
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notif);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transition = 'opacity 0.3s';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }
  
  /* ============ AUTO CLOSE TIME LIMIT & SUCCESS MODAL ============ */
  function autoClosePopup() {
    // Tìm modal đang hiển thị
    const modals = document.querySelectorAll('.modal.show, .modal[style*="display: block"], .bootbox');
    
    let closedCount = 0;
    
    for (const modal of modals) {
      // Đóng modal có icon warning (Time Limit) hoặc icon info (Success)
      const hasWarningIcon = modal.querySelector('.fa.fa-warning, i.fa.fa-warning');
      const hasInfoIcon = modal.querySelector('.fa.fa-info, i.fa.fa-info');
      const title = (modal.querySelector('.modal-title')?.innerText || '').toLowerCase();
      const body = (modal.querySelector('.modal-body')?.innerText || '').toLowerCase();
      
      const shouldClose = 
        hasWarningIcon || 
        hasInfoIcon ||
        title.includes('time limit') || 
        title.includes('limit') ||
        title.includes('success');
      
      if (shouldClose) {
        const closeBtn = 
          modal.querySelector('button.close[data-dismiss="modal"]') ||
          modal.querySelector('button.close') ||
          modal.querySelector('[data-dismiss="modal"]') ||
          modal.querySelector('[aria-label="Close"]');
        
        if (closeBtn && isVisible(closeBtn)) {
          closedCount++;
          const modalName = title || 'Unknown';
          console.log(`🔴 Modal #${closedCount} "${modalName}" detected, closing...`);
          setTimeout(() => {
            clickElement(closeBtn);
            console.log(`✅ Modal #${closedCount} "${modalName}" closed!`);
          }, 800 * closedCount); // Delay tăng dần để đóng lần lượt
          // KHÔNG return - tiếp tục đóng modal tiếp theo nếu có
        }
      }
    }
  }
  
  /* ============ KHỞI TẠO ============ */
  function init() {
    console.log('🚀 [AUTO NR v2] Initializing...');
    console.log('📍 Current URL:', location.href);
    console.log('📍 Document ready state:', document.readyState);
    
    // Load settings từ localStorage
    loadSettings();
    
    // 🔥 AUTO RELOAD SETTINGS từ API mỗi 3 giây (realtime sync từ HTML)
    setInterval(async () => {
      const oldUsers = JSON.stringify(CONFIG.TARGET_USERNAMES);
      const oldAgent = CONFIG.MY_AGENT_NUMBER;
      
      await loadSettings();
      
      const newUsers = JSON.stringify(CONFIG.TARGET_USERNAMES);
      const newAgent = CONFIG.MY_AGENT_NUMBER;
      
      // Phát hiện thay đổi user
      if (oldUsers !== newUsers) {
        console.log('');
        console.log('🔥🔥🔥 ================================ 🔥🔥🔥');
        console.log('⚡ USER ĐÃ THAY ĐỔI! ĐỒNG BỘ TỪ API');
        console.log('📋 Agent:', CONFIG.MY_AGENT_NUMBER);
        console.log('👤 User CŨ:', oldUsers === '[]' ? 'CHƯA CÓ' : JSON.parse(oldUsers)[0]);
        console.log('👤 User MỚI:', CONFIG.TARGET_USERNAMES.length > 0 ? CONFIG.TARGET_USERNAMES[0] : 'CHƯA CÓ');
        console.log('🔥🔥🔥 ================================ 🔥🔥🔥');
        console.log('');
        
        // Hiển thị notification trên page
        showUserChangeNotification(CONFIG.MY_AGENT_NUMBER, CONFIG.TARGET_USERNAMES[0]);
      }
    }, 3000);
    
    // Chờ một chút để DOM ổn định
    setTimeout(() => {
      console.log('✅ Starting auto features...');
      
      // Setup auto submit
      setupAutoSubmit();
      
      // Check buttons liên tục mỗi 1 giây
      setInterval(autoClickButtons, 1000);
      
      // Watch DOM changes để bắt buttons xuất hiện
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
      
      // Auto close ALL popups - check mỗi 2 giây
      setInterval(autoClosePopup, 2000);
      
      // Auto check "Please update your browser" và Apply UA - check mỗi 2 giây
      setInterval(checkAndApplyUA, 2000);
      
      console.log('✅ [AUTO NR v2] Ready!');
    }, 1000);
    
    // Tạo Settings UI SAU cùng để đảm bảo body đã ready
    setTimeout(() => {
      if (document.body) {
        createSettingsUI();
      } else {
        console.error('❌ Body not ready for Settings UI!');
      }
    }, 2000); // Delay 2s để chắc chắn page đã load xong
  }
  
  // Đảm bảo chạy sau khi trang load xong
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();

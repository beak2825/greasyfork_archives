// ==UserScript==
// @name         💬 Sleek Chat
// @namespace    chk.chat.popup.sleek
// @version      4.9.8
// @description  Modern, lightweight floating chat with smooth animations - single latest conversation with load older messages (Safari compatible, mobile audio fix, keyboard fix, fast initial load)
// @author       anon
// @match        https://*.popmundo.com/World/Popmundo.aspx/Conversations
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561171/%F0%9F%92%AC%20Sleek%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/561171/%F0%9F%92%AC%20Sleek%20Chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const POLL_INTERVAL = 5000;
  const REQUEST_DELAY = 800;
  let lastMessages = '';
  let CHAT_ID = null;
  let replyIframe = null;
  let isSending = false;
  let CURRENT_PAGE = 1;
  let LAST_PAGE = 1;
  let lastRequestTime = 0;
  let isMinimized = true;
  let lastFormTokens = null;
  let lastNotifiedMsg = '';
  let notificationPermission = 'default';
  let notificationSoundEnabled = true;
  let isViewingOlderMessages = false;
  let scrollPositionBeforeLoad = 0;
  let messageHistory = []; // Track message history for comparison
  let currentChatName = ''; // Track current chat name
  let isInitialLoadComplete = false; // Track initial load status

  // Detect Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isMobileSafari = isIOS && isSafari;

  async function waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < REQUEST_DELAY) {
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();
  }

  function createReplyIframe(id) {
    if (replyIframe) return replyIframe;
    replyIframe = document.createElement('iframe');
    replyIframe.style.display = 'none';
    replyIframe.sandbox = 'allow-forms allow-scripts allow-same-origin';
    replyIframe.src = `${location.origin}/World/Popmundo.aspx/Conversations/Conversation/${id}`;
    document.body.appendChild(replyIframe);
    return replyIframe;
  }

  // Audio setup for all browsers
  const notifAudio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1331-involved.mp3");
  notifAudio.preload = "auto"; // Preload for better reliability
  notifAudio.volume = 0.3; // Lower volume
  notifAudio.muted = false; // Start unmuted

  // Audio context for all browsers
  let audioContext = null;
  let audioUnlocked = false;
  let isAudioInitialized = false;

  // Initialize audio for ALL browsers
  function initializeAudio() {
    if (isAudioInitialized) return;

    console.log('🔊 Initializing audio for all browsers');

    // For all browsers
    if (window.AudioContext || window.webkitAudioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      try {
        audioContext = new AudioContext();
        if (audioContext.state === 'suspended') {
          // Try to resume the audio context
          audioContext.resume().then(() => {
            console.log('✅ AudioContext resumed');
          }).catch(e => {
            console.log('⚠️ AudioContext resume failed:', e.message);
          });
        }
      } catch (e) {
        console.log('⚠️ AudioContext creation failed:', e.message);
      }
    }

    // Preload the audio
    notifAudio.load();

    // Try to unlock audio immediately for non-iOS browsers
    if (!isMobileSafari) {
      unlockAudioForPlayback();
    }

    isAudioInitialized = true;
  }

  function unlockAudioForPlayback() {
    if (audioUnlocked) return true;

    console.log('🔓 Unlocking audio playback');

    // iOS Safari'de background audio'yu kesmemek için
    if (isMobileSafari) {
      try {
        // Muted durumdan çıkar
        notifAudio.muted = false;

        // Çok kısa bir süre oynat ve hemen durdur
        notifAudio.play().then(() => {
          setTimeout(() => {
            notifAudio.pause();
            notifAudio.currentTime = 0;
            audioUnlocked = true;
            console.log('✅ iOS için audio unlocked');
          }, 100);
        }).catch(e => {
          console.log('⚠️ iOS audio unlock başarısız:', e.message);
          // Başarısız olursa bile devam et
          audioUnlocked = true;
        });

        return true;
      } catch (e) {
        console.log('⚠️ iOS audio unlock hatası:', e);
        audioUnlocked = true;
        return true;
      }
    }

    // Diğer browserlar için normal unlock
    try {
      notifAudio.play().then(() => {
        notifAudio.pause();
        notifAudio.currentTime = 0;
        audioUnlocked = true;
        console.log('✅ Audio unlocked successfully');
      }).catch(e => {
        console.log('⚠️ Audio unlock başarısız:', e.message);
        // Retry with user interaction simulation
        setTimeout(() => {
          document.addEventListener('click', tryUnlockOnClick, { once: true });
          document.addEventListener('keydown', tryUnlockOnClick, { once: true });
        }, 1000);
      });
    } catch (e) {
      console.log('⚠️ Audio unlock hatası:', e);
    }

    return audioUnlocked;
  }

  // Helper function for unlocking on user interaction
  function tryUnlockOnClick() {
    console.log('🖱️ User interaction detected, trying to unlock audio');
    if (!audioUnlocked) {
      try {
        notifAudio.play().then(() => {
          notifAudio.pause();
          notifAudio.currentTime = 0;
          audioUnlocked = true;
          console.log('✅ Audio unlocked via user interaction');
        }).catch(e => {
          console.log('⚠️ Audio unlock via interaction failed:', e.message);
        });
      } catch (e) {
        console.log('⚠️ Audio unlock error:', e);
      }
    }
  }

  function playNotifSound() {
    if (!notificationSoundEnabled) {
      console.log('🔇 Sound disabled in settings');
      return;
    }

    console.log('🔔 Attempting to play notification sound');

    // iOS Safari'de background müziği kesmemek için
    if (isMobileSafari) {
      console.log('📱 iOS: Notification sound atlandı (background audio koruması)');
      return; // iOS'ta ses çalmayı atla
    }

    try {
      if (!audioUnlocked) {
        console.log('🔒 Audio not unlocked, attempting unlock');
        if (!unlockAudioForPlayback()) {
          console.log('❌ Audio unlock failed, cannot play sound');
          return;
        }
      }

      // Make sure audio is not muted
      notifAudio.muted = false;
      notifAudio.currentTime = 0;
      notifAudio.volume = 0.3; // Düşük volume

      console.log('▶️ Playing notification sound');
      notifAudio.play().then(() => {
        console.log('✅ Sound played successfully');
      }).catch(e => {
        console.log('❌ Sound playback failed:', e.message);
        // If playback fails, try to re-unlock
        audioUnlocked = false;
        unlockAudioForPlayback();
      });
    } catch (e) {
      console.log('❌ Sound playback error:', e);
    }
  }

  function wrapSelection(input, startTag, endTag, placeholder = '') {
    input.focus();
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const before = input.value.substring(0, start);
    const sel = input.value.substring(start, end) || placeholder;
    const after = input.value.substring(end);
    input.value = before + startTag + sel + endTag + after;
    const pos = before.length + startTag.length + sel.length + endTag.length;
    input.setSelectionRange(pos, pos);
  }

  async function getLatestConversationId() {
    await waitForRateLimit();
    const res = await fetch(`${location.origin}/World/Popmundo.aspx/Conversations`, {
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    });
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const link = doc.querySelector('a[href*="/Conversations/Conversation/"]');
    const match = link?.getAttribute('href')?.match(/\/Conversations\/Conversation\/(\d+)/);
    return match ? match[1] : null;
  }

  async function loadOlderMessages() {
    if (!CHAT_ID || isSending) return;

    const loadBtn = document.querySelector('.load-older-btn');
    const messagesContainer = document.querySelector('.chat-messages');

    if (loadBtn) loadBtn.innerHTML = '⏳ Loading...';

    try {
      await waitForRateLimit();

      // Save current scroll position BEFORE loading
      scrollPositionBeforeLoad = messagesContainer.scrollTop;

      // Fetch the CURRENT page we're viewing to get accurate form data
      let doc;
      if (!lastFormTokens || !isViewingOlderMessages) {
        // If we're viewing latest messages or no form tokens, fetch current page
        const pageToFetch = isViewingOlderMessages ? CURRENT_PAGE : LAST_PAGE;
        const res = await fetch(
          `${location.origin}/World/Popmundo.aspx/Conversations/Conversation/${CHAT_ID}?Page=${pageToFetch}`,
          { credentials: 'include' }
        );
        const html = await res.text();
        doc = new DOMParser().parseFromString(html, 'text/html');
      } else {
        doc = lastFormTokens.doc;
      }

      const botInput = doc.querySelector('#ctl00_cphLeftColumn_ctl00_txtBotGoToPage');
      const current = parseInt(botInput?.value || '1', 10);

      const targetPage = current - 1;

      if (targetPage < 1) {
        console.log(`🔚 Reached oldest page`);
        if (loadBtn) {
          loadBtn.innerHTML = 'No older messages';
          loadBtn.style.display = 'none';
        }
        return;
      }
      console.log(`⬆ Loading older: page ${targetPage} (current form shows: ${current})`);

      const formData = new URLSearchParams();
      formData.append('__EVENTTARGET', 'ctl00$cphLeftColumn$ctl00$btnBotGoToPage');
      formData.append('ctl00$cphLeftColumn$ctl00$txtBotGoToPage', String(targetPage));

      ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION'].forEach(k => {
        const el = doc.querySelector(`[name="${k}"]`);
        if (el) formData.append(k, el.value);
      });

      await waitForRateLimit();
      const postRes = await fetch(
        `${location.origin}/World/Popmundo.aspx/Conversations/Conversation/${CHAT_ID}`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const html = await postRes.text();
      const newDoc = new DOMParser().parseFromString(html, 'text/html');

      const olderMessages = extractMessagesFromDoc(newDoc, await getOtherName());
      const olderContent = renderMessages(olderMessages);

      if (messagesContainer && olderContent.trim()) {
        const oldScrollHeight = messagesContainer.scrollHeight;
        const oldScrollTop = messagesContainer.scrollTop;
        messagesContainer.insertAdjacentHTML('beforeend', olderContent);

        // RESTORE scroll position to where user was reading
        requestAnimationFrame(() => {
          // Calculate the height of newly added content
          const newScrollHeight = messagesContainer.scrollHeight;
          const addedHeight = newScrollHeight - oldScrollHeight;

          // Restore scroll position to where user was before loading
          messagesContainer.scrollTop = scrollPositionBeforeLoad + addedHeight;
        });
      }

      lastFormTokens = { doc: newDoc };
      CURRENT_PAGE = targetPage;
      isViewingOlderMessages = true;

      const newCurrentValue = parseInt(
        newDoc.querySelector('#ctl00_cphLeftColumn_ctl00_txtBotGoToPage')?.value || '1',
        10
      );
      if (newCurrentValue <= 1 && loadBtn) {
        loadBtn.innerHTML = 'No older messages';
        loadBtn.style.display = 'none';
      } else if (loadBtn) {
        loadBtn.innerHTML = '⬆ Load older messages';
      }

    } catch (e) {
      console.error('Load older failed', e);
      if (loadBtn) loadBtn.innerHTML = '⬆ Load older messages';
    }
  }

  function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 4px 20px rgba(213, 219, 255, 0.4); }
        50% { box-shadow: 0 4px 30px rgba(213, 219, 255, 0.6); }
      }
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(213, 219, 255, 0.7); }
        50% { box-shadow: 0 0 0 10px rgba(213, 219, 255, 0); }
      }

      #sleek-chat-container {
        position: fixed;
        bottom: 16px;
        left: 16px;
        width: 300px;
        max-height: 800px;
        background: linear-gradient(135deg, #d5dbff 0%, #eef0ff 100%);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(213, 219, 255, 0.25);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        z-index: 9999;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* MOBILE STYLES - FIXED KEYBOARD ISSUE */
      @media (max-width: 768px) {
        #sleek-chat-container {
          position: fixed !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          top: auto !important;
          width: 100% !important;
          max-width: 100% !important;
          height: 100vh !important;
          max-height: 100vh !important;
          border-radius: 0 !important;
          transform: none !important;
          margin: 0 !important;
          z-index: 10000 !important;
          display: flex !important;
          flex-direction: column !important;
        }

        #sleek-chat-container.minimized {
          width: 52px !important;
          height: 52px !important;
          left: 16px !important;
          bottom: 16px !important;
          top: auto !important;
          right: auto !important;
          border-radius: 26px !important;
          max-height: 52px !important;
        }

        #sleek-chat-container:not(.minimized) {
          height: 100vh !important;
          max-height: 100vh !important;
        }

        #sleek-chat-container.keyboard-open {
          height: calc(100vh - var(--keyboard-height, 250px)) !important;
          max-height: calc(100vh - var(--keyboard-height, 250px)) !important;
          bottom: 0 !important;
          top: auto !important;
        }

        .chat-content {
          height: 100% !important;
          display: flex;
          flex-direction: column;
          max-height: 100%;
          flex: 1;
          overflow: hidden;
        }

        .chat-messages {
          padding: 12px;
          gap: 8px;
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 45px !important;
        }

        #sleek-chat-container.keyboard-open .chat-messages {
          padding-bottom: 20px !important;
        }

        .message-bubble {
          max-width: 85%;
          padding: 10px 14px;
        }

        .format-toolbar {
          gap: 4px;
          flex-wrap: wrap;
          flex-shrink: 0;
          display: flex !important;
        }

        .format-btn {
          width: 26px;
          height: 26px;
          font-size: 12px;
        }

        #chat-input {
          width: calc(100% - 32px - 6px) !important;
          box-sizing: border-box !important;
          font-size: 16px !important;
          padding: 6px 12px !important;
          max-height: 80px !important;
          min-height: 32px !important;
          overflow-y: auto;
          line-height: 1.4;
          -webkit-appearance: none;
          border-radius: 8px !important;
          cursor: text !important; /* iOS Safari için cursor */
        }

        .chat-input-area {
          box-sizing: border-box !important;
          overflow: hidden !important;
          padding: 10px !important;
          flex-shrink: 0;
          border-top: 1px solid #d5dbff;
          background: #fafbff;
          position: relative;
          width: 100%;
        }

        #sleek-chat-container.keyboard-open .chat-input-area {
          position: relative !important;
          bottom: auto !important;
          background: #fafbff !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          z-index: 2 !important;
          border-top: 1px solid #d5dbff !important;
          padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px)) !important;
        }

        #send-btn {
          width: 32px !important;
          height: 32px !important;
          font-size: 14px !important;
          border-radius: 8px !important;
        }

        .input-wrapper {
          box-sizing: border-box !important;
          overflow: hidden !important;
          gap: 6px !important;
          align-items: center !important;
        }

        .load-older-btn {
          margin-bottom: 12px !important;
          padding: 6px 12px !important;
          font-size: 11px !important;
          margin-top: 8px !important;
        }

        .settings-panel {
          padding: 10px !important;
          max-height: 150px !important;
        }
      }

      @media (max-width: 768px) and (orientation: landscape) {
        #sleek-chat-container:not(.minimized) {
          height: 100vh !important;
          max-height: 100vh !important;
        }

        #sleek-chat-container.keyboard-open {
          height: calc(100vh - var(--keyboard-height, 150px)) !important;
          max-height: calc(100vh - var(--keyboard-height, 150px)) !important;
        }

        .chat-input-area {
          padding: 8px !important;
          padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px)) !important;
        }

        #chat-input {
          min-height: 32px !important;
          padding: 6px 10px !important;
          font-size: 15px !important;
        }

        #send-btn {
          width: 32px !important;
          height: 32px !important;
          font-size: 13px !important;
        }

        .chat-messages {
          padding-bottom: 60px !important;
        }

        #sleek-chat-container.keyboard-open .chat-messages {
          padding-bottom: 50px !important;
        }

        .settings-panel {
          padding: 8px !important;
          max-height: 120px !important;
        }
      }

      #sleek-chat-container.minimized {
        width: 52px;
        height: 52px;
        border-radius: 26px;
        cursor: pointer;
      }

      #sleek-chat-container.minimized:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 40px rgba(213, 219, 255, 0.5);
      }

      #sleek-chat-container.minimized.has-notification {
        animation: pulseGlow 2s infinite;
      }

      .chat-header {
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px); /* Safari */
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: background 0.2s;
        flex-shrink: 0;
      }

      .chat-header:hover {
        background: rgba(255, 255, 255, 0.4);
      }

      .chat-header.flash {
        box-shadow: 0 0 12px 2px #00cfff;
        transition: box-shadow 0.3s ease-in-out;
      }

      .chat-header.loading {
        background: linear-gradient(90deg, #d5dbff, #eef0ff, #d5dbff);
        background-size: 200% 100%;
        animation: loadingShine 1.5s infinite;
      }

      @keyframes loadingShine {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .chat-header-title {
        color: #1c1c1c;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      .chat-header-title.loading {
        color: #666;
        font-style: italic;
      }

      .chat-toggle {
        color: #1c1c1c;
        font-size: 16px;
        transition: transform 0.3s;
        font-weight: 700;
      }

      .chat-toggle.expanded {
        transform: rotate(180deg);
        -webkit-transform: rotate(180deg); /* Safari */
      }

      .chat-content {
        background: #fafbff;
        display: flex;
        flex-direction: column;
        height: calc(480px - 46px);
        animation: slideUp 0.3s ease-out;
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column-reverse;
        gap: 1px;
        min-height: 0;
      }

      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .chat-messages::-webkit-scrollbar-track {
        background: #fafbff;
      }

      .chat-messages::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #d5dbff, #eef0ff);
        border-radius: 3px;
      }

      .chat-messages::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #c4cafe, #d5dbff);
      }

      /* Safari scrollbar styling */
      @media not all and (min-resolution:.001dpcm) {
        @supports (-webkit-appearance:none) {
          .chat-messages {
            scrollbar-width: thin;
            scrollbar-color: #cccfe5 #fafbff;
          }
        }
      }

      .message-bubble {
        padding: 10px 14px;
        border-radius: 16px;
        position: relative;
        box-shadow: 0 1px 0px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
      }

      .message-bubble.new-message {
        animation: fadeIn 0.3s ease-out;
      }

      .message-bubble.mine {
        background: #ffffef;
        color: #05050a;
        border-radius: 16px;
      }

      .message-bubble.theirs {
        background: #edebff;
        color: #05050a;
        border-radius: 16px;
      }

      .message-sender {
        font-weight: 600;
        font-size: 12px;
        opacity: 1;
        letter-spacing: -0.3px;
        color: #000 !important;
        display: inline;
        margin-right: 1px;
      }

      .message-text {
        font-size: 13px;
        line-height: 1.5;
        word-wrap: break-word;
        font-weight: 400;
        display: inline;
      }

      .message-text a {
        color: #8800ff;
        text-decoration: none;
        font-weight: 600;
      }

      .message-text a:hover {
        text-decoration: underline;
      }

      .message-time {
        font-size: 11px;
        color: #ccc !important;
        background: #fff;
        margin-top: 8px;
        padding: 4px 8px;
        border-radius: 10px;
        align-self: flex-end;
        opacity: 0.8;
        font-style: italic;
        font-weight: 500;
        width: fit-content;
      }

      .chat-input-area {
        padding: 12px;
        background: #fafbff;
        border-top: 1px solid #d5dbff;
        flex-shrink: 0;
      }

      .format-toolbar {
        display: flex;
        gap: 6px;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }

      .format-btn {
        width: 28px;
        height: 28px;
        border: none;
        background: #f0f0f5;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        transition: all 0.2s;
        box-shadow: 0 1px 3px rgba(213, 219, 255, 0.2);
        color: #1c1c1c;
        font-weight: 600;
        -webkit-tap-highlight-color: transparent; /* iOS tap highlight */
      }

      .format-btn:hover {
        transform: translateY(-2px);
        -webkit-transform: translateY(-2px); /* Safari */
        box-shadow: 0 4px 8px rgba(213, 219, 255, 0.3);
        background: #d5dbff;
        color: #3730a3;
        filter: brightness(0.9);
      }

      .input-wrapper {
        display: flex;
        gap: 10px;
        align-items: flex-end;
      }

      #chat-input {
        flex: 1;
        border: 2px solid #d5dbff;
        border-radius: 10px;
        padding: 9px 8px 10px;
        font-size: 13px !important;
        resize: none;
        outline: none;
        transition: border-color 0.2s;
        font-family: 'Inter', 'Segoe UI', sans-serif !important;
        background: white;
        color: #05050a;
        font-weight: 500;
        line-height: 15px;
        max-height: 15px;
        min-height: 15px;
        -webkit-appearance: none; /* Safari form styling */
        -webkit-tap-highlight-color: transparent; /* iOS tap highlight */
        cursor: text !important; /* iOS Safari için cursor */
        -webkit-user-select: text !important; /* iOS Safari için text selection */
      }

      #chat-input:focus {
        border-color: #c4cafe;
        background: white;
        outline: none;
        box-shadow: 0 0 0 2px #d5dbff;
      }

      #send-btn {
        width: 38px;
        height: 38px;
        border: none;
        background: #444;
        border-radius: 10px;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px !important;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(68, 68, 68, 0.3);
        font-weight: 600;
        font-family: 'Inter', sans-serif !important;
        -webkit-tap-highlight-color: transparent; /* iOS tap highlight */
      }

      #send-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        -webkit-transform: translateY(-2px); /* Safari */
        box-shadow: 0 4px 12px rgba(68, 68, 68, 0.4);
        background: #333;
        filter: brightness(0.9);
      }

      #send-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .minimized-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-transform: translate(-50%, -50%); /* Safari */
        color: #1c1c1c;
        font-size: 24px;
        transition: transform 0.3s ease;
      }

      .unread-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 12px;
        height: 12px;
        background: #fca5a5;
        border-radius: 50%;
        border: 2px solid white;
        animation: pulse 2s infinite;
        -webkit-animation: pulse 2s infinite; /* Safari */
      }

      .load-older-btn {
        align-self: center;
        padding: 8px 16px;
        background: #f0f0f5;
        border: 2px solid #d5dbff;
        border-radius: 20px;
        color: #1c1c1c;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 12px;
        margin-top: 12px;
        flex-shrink: 0;
        -webkit-tap-highlight-color: transparent; /* iOS tap highlight */
      }

      .load-older-btn:hover {
        background: #d5dbff;
        color: #1c1c1c;
        transform: translateY(-2px);
        -webkit-transform: translateY(-2px); /* Safari */
        filter: brightness(0.9);
      }

      .settings-btn {
        position: absolute;
        top: 8px;
        right: 40px;
        width: 24px;
        height: 24px;
        border: none;
        background: transparent;
        color: #1c1c1c;
        cursor: pointer;
        font-size: 16px;
        border-radius: 50%;
        transition: all 0.2s;
        display: none;
        align-items: center;
        justify-content: center;
        -webkit-tap-highlight-color: transparent; /* iOS tap highlight */
      }

      .settings-btn:hover {
        background: rgba(0, 0, 0, 0.1);
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg); /* Safari */
      }

      .settings-panel {
        position: absolute;
        top: 40px;
        right: 8px;
        background: white;
        border-radius: 8px;
        padding: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        animation: fadeIn 0.2s ease-out;
        -webkit-animation: fadeIn 0.2s ease-out; /* Safari */
        min-width: 200px;
        border: 1px solid #d5dbff;
      }

      .settings-panel h4 {
        margin: 0 0 8px 0;
        font-size: 12px;
        font-weight: 700;
        color: #1c1c1c;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .settings-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 13px;
        color: #1c1c1c;
      }

      .settings-option label {
        cursor: pointer;
        flex-grow: 1;
        margin-right: 8px;
      }

      .settings-option input[type="checkbox"] {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }

      .close-settings-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 20px;
        height: 20px;
        border: none;
        background: transparent;
        color: #666;
        cursor: pointer;
        font-size: 14px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-settings-btn:hover {
        background: rgba(0, 0, 0, 0.1);
      }

      /* Loading spinner */
      .loading-spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #d5dbff;
        border-top: 2px solid #444;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .chat-messages-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #999;
        font-style: italic;
        font-size: 13px;
        text-align: center;
        padding: 20px;
      }

      /* Spoiler styles */
      .spoiler-block {
        background: #f0f0f5;
        border: 1px solid #d5dbff;
        border-radius: 8px;
        padding: 8px 12px;
        margin: 8px 0;
        position: relative;
      }

      .spoiler-block .spoiler-link {
        color: #8800ff;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
      }

      .spoiler-block .spoiler-link:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  }

  async function fetchConversationPage(id, page = 1) {
    await waitForRateLimit();
    const url = `${location.origin}/World/Popmundo.aspx/Conversations/Conversation/${id}?Page=${page}&_=${Date.now()}`;
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      cache: 'no-cache'
    });
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const header = doc.querySelector('#ctl00_cphLeftColumn_ctl00_hdrMain');
    const rawName = header?.textContent?.replace('Conversation with ', '').trim() || 'Chat';
    const name = rawName.replace(/ ile Sohbetleriniz$/i, '').trim();
    return { doc, name };
  }

  async function getOtherName() {
    if (!CHAT_ID) return 'Chat';
    const { name } = await fetchConversationPage(CHAT_ID, 1);
    return name;
  }

  function getLastPageNumber(doc) {
    const navDivs = [
      doc.querySelector('#ctl00_cphLeftColumn_ctl00_divNavTop'),
      doc.querySelector('#ctl00_cphLeftColumn_ctl00_divNavBot')
    ];

    for (const navDiv of navDivs) {
      if (navDiv) {
        const text = navDiv.textContent || '';
        const match = text.match(/of\s+(\d+)\./);
        if (match) {
          const lastPage = parseInt(match[1], 10);
          if (!isNaN(lastPage)) {
            return lastPage;
          }
        }
      }
    }

    const input = doc.querySelector('#ctl00_cphLeftColumn_ctl00_txtTopGoToPage');
    const page = parseInt(input?.getAttribute('value') || '1', 10);
    return isNaN(page) ? 1 : page;
  }

  function extractMessagesFromDoc(doc, otherName) {
    const boxes = [...doc.querySelectorAll('.talkbox')];
    return boxes.map(box => {
      const isMine = box.classList.contains('sayright');
      const content = box.querySelector('.talkbox-content');
      const timeNode = box.querySelector('.talkbox-byline p');

      if (!content) return null;

      // Extract time from both English and Turkish formats
      let time = '';
      if (timeNode) {
        const timeText = timeNode.textContent || '';

        // Look for date pattern: "2/01/2026, 8:30 PM"
        const dateMatch = timeText.match(/(\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2} [AP]M)/);
        if (dateMatch) {
          time = dateMatch[0];
        } else {
          // Try to extract just the date/time part before language-specific words
          const cleanedText = timeText
            .replace(/\s+tarihinde\s+.*/i, '')  // Remove Turkish "tarihinde" and everything after
            .replace(/\s+by\s+.*/i, '')         // Remove English "by" and everything after
            .trim();

          // If we still have something reasonable, use it
          if (cleanedText && cleanedText.length > 0) {
            time = cleanedText;
          } else {
            // Fallback: use the whole text but clean it up
            time = timeText
              .replace(/<[^>]*>/g, '')
              .replace(/\s+/g, ' ')
              .trim();
          }
        }
      }

      // Clone the content to avoid modifying the original
      const contentClone = content.cloneNode(true);

      // Clean up content HTML - remove unwanted elements
      [...contentClone.querySelectorAll('.sub-menu, .sub-menu-float-right, .abusereport, .material-icons')].forEach(el => el.remove());

      // FIX: Handle spoiler blocks to prevent duplication
      // Find all spoiler blocks and process them
      const spoilerBlocks = contentClone.querySelectorAll('.spoiler, blockquote.spoiler');
      spoilerBlocks.forEach(spoiler => {
        // Check if this is a spoiler block with the show spoiler link
        const spoilerLink = spoiler.querySelector('a[href^="javascript:showSpoiler"]');
        if (spoilerLink) {
          // Get the spoiler ID from the href
          const href = spoilerLink.getAttribute('href') || '';
          const spoilerIdMatch = href.match(/showSpoiler\('([^']+)'\)/);
          const spoilerId = spoilerIdMatch ? spoilerIdMatch[1] : '';

          // Create a simplified spoiler representation
          const spoilerReplacement = document.createElement('div');
          spoilerReplacement.className = 'spoiler-block';
          spoilerReplacement.innerHTML = `<a class="spoiler-link" onclick="showSpoiler('${spoilerId}'); return false;">Show spoiler</a>`;

          // Replace the original spoiler with our simplified version
          spoiler.parentNode.replaceChild(spoilerReplacement, spoiler);
        }
      });

      // Clean up the HTML - remove extra tags but preserve formatting
      let text = contentClone.innerHTML.trim()
        .replace(/^<br\s*\/?>/i, '')
        .replace(/<\/?(div|p)[^>]*>/gi, ' ')  // Replace div/p with space
        .replace(/<br\s*\/?>/gi, '<br>')      // Standardize line breaks
        .replace(/\s+/g, ' ')                 // Collapse multiple spaces
        .trim();

      return {
        isMine,
        sender: isMine ? 'You' : otherName,
        text,
        time
      };
    }).filter(Boolean);
  }

  function createMessageHTML(msg, withAnimation = false) {
    const animationClass = withAnimation ? ' new-message' : '';
    return `
      <div class="message-bubble ${msg.isMine ? 'mine' : 'theirs'}${animationClass}">
        <div style="margin-bottom: 0;">
          <span class="message-sender">${msg.sender}:</span>
          <span class="message-text">${msg.text}</span>
        </div>
        <div class="message-time">${msg.time}</div>
      </div>
    `;
  }

  function renderMessages(messages) {
    return messages.slice().reverse().map(msg => createMessageHTML(msg, false)).join('');
  }

  // Safari-compatible notification permission handling
  async function requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      notificationPermission = 'denied';
      return false;
    }

    if (Notification.permission === 'granted') {
      notificationPermission = 'granted';
      return true;
    }

    if (Notification.permission === 'denied') {
      notificationPermission = 'denied';
      console.log('Notification permission denied by user');
      return false;
    }

    // Safari uses callback-style, but modern Safari also supports Promise
    try {
      if (typeof Notification.requestPermission === 'function') {
        const permission = await Notification.requestPermission();
        notificationPermission = permission;
        return permission === 'granted';
      } else if (typeof Notification.requestPermission === 'object' ||
                 typeof Notification.requestPermission === 'undefined') {
        // Older Safari versions might have the callback style
        return new Promise(resolve => {
          Notification.requestPermission(function(permission) {
            notificationPermission = permission;
            resolve(permission === 'granted');
          });
        });
      }
    } catch (e) {
      console.log('Notification permission request error:', e);
      notificationPermission = 'denied';
      return false;
    }

    return false;
  }

  function showDesktopNotification(otherName, messageText) {
    const desktopNotifEnabled = localStorage.getItem('chat-desktop-notif-enabled') !== 'false';

    if (!desktopNotifEnabled) {
      console.log('Desktop notifications disabled in settings');
      return;
    }

    if (notificationPermission !== 'granted') {
      // Don't request permission automatically on Safari
      return;
    }

    if (Notification.permission !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    // iOS Safari doesn't support notifications from websites (except PWAs)
    if (isIOS && !window.navigator.standalone) {
      console.log('iOS Safari requires PWA for notifications');
      return;
    }

    const iconUrl = 'https://www.popmundo.com/favicon.ico';

    const notification = new Notification(`New message from ${otherName}`, {
      body: messageText.length > 100 ? messageText.substring(0, 100) + '...' : messageText,
      icon: iconUrl,
      tag: 'popmundo-chat',
      requireInteraction: false,
      silent: true
    });

    notification.onclick = function() {
      window.focus();
      this.close();

      if (isMinimized) {
        const container = document.getElementById('sleek-chat-container');
        const header = container.querySelector('.chat-header');
        const icon = container.querySelector('.minimized-icon');
        const toggle = container.querySelector('.chat-toggle');

        if (container && header && icon) {
          isMinimized = false;
          container.classList.remove('minimized');
          header.style.display = 'flex';
          icon.style.display = 'none';
          container.querySelector('.chat-content').style.display = 'flex';
          if (toggle) toggle.classList.add('expanded');
          clearUnreadBadge();

          const settingsBtn = container.querySelector('.settings-btn');
          if (settingsBtn) settingsBtn.style.display = 'flex';

          const input = document.getElementById('chat-input');
          if (input) {
            setTimeout(() => input.focus(), 100);
          }
        }
      }
    };

    setTimeout(() => {
      notification.close();
    }, 5000);
  }

  // Get the actual current page from the document's form input
  function getCurrentPageFromForm(doc) {
    const botInput = doc.querySelector('#ctl00_cphLeftColumn_ctl00_txtBotGoToPage');
    const topInput = doc.querySelector('#ctl00_cphLeftColumn_ctl00_txtTopGoToPage');

    if (botInput) {
      const current = parseInt(botInput.value || '1', 10);
      return current;
    }

    if (topInput) {
      const current = parseInt(topInput.value || '1', 10);
      return current;
    }

    return 1;
  }

  async function fetchCurrentConversation() {
    if (!CHAT_ID) return { messages: [], name: '' };

    try {
      // Fetch page 1 to get current page count and name
      const { doc: firstPageDoc, name } = await fetchConversationPage(CHAT_ID, 1);
      const newLastPage = getLastPageNumber(firstPageDoc);

      // Update LAST_PAGE if it changed
      if (newLastPage !== LAST_PAGE) {
        console.log(`📄 Page count updated from ${LAST_PAGE} to ${newLastPage}`);
        LAST_PAGE = newLastPage;

        // If we were viewing the "latest" page and new pages were added,
        // we need to update our current page too
        if (!isViewingOlderMessages) {
          CURRENT_PAGE = LAST_PAGE;
        }
      }

      // Determine which page to fetch
      let pageToFetch;
      if (isViewingOlderMessages) {
        // We're viewing older messages, stay on CURRENT_PAGE
        pageToFetch = CURRENT_PAGE;
      } else {
        // We're viewing latest messages, go to LAST_PAGE
        pageToFetch = LAST_PAGE;
      }

      // Make sure pageToFetch exists
      if (pageToFetch > LAST_PAGE) {
        pageToFetch = LAST_PAGE;
        CURRENT_PAGE = LAST_PAGE;
      }

      console.log(`📄 Fetching page ${pageToFetch} of ${LAST_PAGE} (viewing older: ${isViewingOlderMessages})`);

      // Fetch the specific page
      const { doc } = await fetchConversationPage(CHAT_ID, pageToFetch);
      const messages = extractMessagesFromDoc(doc, name);
      return { messages, name };

    } catch (err) {
      console.error('Failed to fetch conversation:', err);
      return { messages: [], name: '' };
    }
  }

  async function updateMessages() {
    if (!CHAT_ID) return;

    const container = document.querySelector('.chat-messages');
    if (!container) return;

    try {
      const { messages, name } = await fetchCurrentConversation();

      // Update chat name if changed
      if (name && name !== currentChatName) {
        currentChatName = name;
        const titleEl = document.querySelector('.chat-header-title');
        if (titleEl) {
          titleEl.textContent = `💬 ${name}`;
        }
      }

      // Mark initial load as complete if we have messages
      if (!isInitialLoadComplete && messages.length > 0) {
        isInitialLoadComplete = true;
        console.log('✅ Initial messages loaded');

        // Remove loading state from header
        const header = document.querySelector('.chat-header');
        const headerTitle = document.querySelector('.chat-header-title');
        if (header && headerTitle) {
          header.classList.remove('loading');
          headerTitle.classList.remove('loading');
        }
      }

      // Only update if we're not in the middle of reading older messages
      if (!isViewingOlderMessages) {
        const wasAtTop = container.scrollTop <= 50;

        // Check if messages actually changed
        const messagesChanged = JSON.stringify(messages.map(m => ({
          isMine: m.isMine,
          text: m.text,
          time: m.time
        }))) !== JSON.stringify(messageHistory);

        if (messagesChanged) {
          // Store current messages for next comparison
          messageHistory = messages.map(m => ({
            isMine: m.isMine,
            text: m.text,
            time: m.time
          }));

          // Render all messages, but only add animation to messages that are actually new
          const existingMessages = container.querySelectorAll('.message-bubble');
          let hasExistingMessages = existingMessages.length > 0;

          // If we have existing messages, compare to see which are new
          if (hasExistingMessages) {
            // Get existing message data
            const existingMessageData = Array.from(existingMessages).map(el => {
              const textEl = el.querySelector('.message-text');
              const timeEl = el.querySelector('.message-time');
              return {
                text: textEl ? textEl.innerHTML.trim() : '',
                time: timeEl ? timeEl.textContent.trim() : ''
              };
            });

            // Find which messages in the new list don't exist in the current display
            const messagesToAdd = [];
            messages.forEach(msg => {
              const msgText = msg.text.trim();
              const msgTime = msg.time.trim();

              const exists = existingMessageData.some(existing =>
                existing.text === msgText && existing.time === msgTime
              );

              if (!exists) {
                messagesToAdd.push(msg);
              }
            });

            // If there are new messages, add them with animation
            if (messagesToAdd.length > 0) {
              // Render new messages with animation
              const newMessagesHTML = messagesToAdd.map(msg =>
                createMessageHTML(msg, true) // true = with animation
              ).join('');

              // Insert new messages at the top (since we use column-reverse)
              container.insertAdjacentHTML('afterbegin', newMessagesHTML);

              // Check for notifications only for new messages
              if (isMinimized) {
                const newMsgFromOther = messagesToAdd.find(msg => !msg.isMine);
                if (newMsgFromOther) {
                  const lastText = newMsgFromOther.text.trim();
                  if (lastNotifiedMsg !== lastText) {
                    lastNotifiedMsg = lastText;
                    showUnreadBadge();
                    playNotifSound();

                    // Sadece bildirim geldiğinde pulseGlow animasyonu
                    const chatContainer = document.getElementById('sleek-chat-container');
                    if (chatContainer && chatContainer.classList.contains('minimized')) {
                      chatContainer.classList.add('has-notification');
                    }

                    const headerEl = document.querySelector('.chat-header');
                    if (headerEl) {
                      headerEl.classList.add('flash');
                      setTimeout(() => headerEl.classList.remove('flash'), 600);
                    }

                    showDesktopNotification(name, lastText);
                  }
                }
              }

              // Maintain scroll position if user was at top
              if (wasAtTop) {
                setTimeout(() => {
                  container.scrollTo({ top: 0, behavior: 'instant' });
                }, 50);
              }
            }
          } else {
            // First load or no existing messages, render all without animation
            container.innerHTML = renderMessages(messages);
            setTimeout(() => {
              container.scrollTo({ top: 0, behavior: 'instant' });
            }, 100);
          }
        }
      }
    } catch (err) {
      console.error('Failed to update messages:', err);
    }
  }

  function showUnreadBadge() {
    const container = document.getElementById('sleek-chat-container');
    if (!container.querySelector('.unread-badge')) {
      const badge = document.createElement('div');
      badge.className = 'unread-badge';
      container.appendChild(badge);
    }
  }

  function clearUnreadBadge() {
    const badge = document.querySelector('.unread-badge');
    if (badge) badge.remove();

    // Ayrıca notification animasyon class'ını da kaldır
    const chatContainer = document.getElementById('sleek-chat-container');
    if (chatContainer) {
      chatContainer.classList.remove('has-notification');
    }
  }

  function sendMessage() {
    if (isSending) return;

    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const message = input?.value?.trim();

    if (!message || !input || !sendBtn) return;

    isSending = true;
    input.readOnly = true;
    sendBtn.innerHTML = '⏳';
    sendBtn.disabled = true;

    const iframe = createReplyIframe(CHAT_ID);

    const onIframeLoad = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        const nativeInput = doc.getElementById('ctl00_cphLeftColumn_ctl00_txtEditor');
        const replyButton = doc.getElementById('ctl00_cphLeftColumn_ctl00_btnReply');

        if (nativeInput && replyButton) {
          nativeInput.value = message;
          setTimeout(() => {
            replyButton.click();
            input.value = '';

            iframe.onload = () => {
              setTimeout(() => {
                // After sending, switch to viewing latest messages
                isViewingOlderMessages = false;
                CURRENT_PAGE = LAST_PAGE;
                updateMessages();
                isSending = false;
                input.readOnly = false;
                sendBtn.innerHTML = '➤';
                sendBtn.disabled = false;
                // iOS Safari için focus optimization
                setTimeout(() => {
                  if (!isMinimized) {
                    input.focus();
                  }
                }, 100);
              }, 1000);
            };
          }, 350);
        } else {
            throw new Error("Could not find reply elements in iframe.");
        }
      } catch (err) {
        console.error('Failed to send:', err);
        isSending = false;
        input.readOnly = false;
        sendBtn.innerHTML = '➤';
        sendBtn.disabled = false;
        // iOS Safari için focus optimization
        setTimeout(() => {
          if (!isMinimized) {
            input.focus();
          }
        }, 100);
      }
    };

    iframe.onload = onIframeLoad;
    iframe.src = `${location.origin}/World/Popmundo.aspx/Conversations/Conversation/${CHAT_ID}`;
  }

  function setupMobileKeyboardHandling() {
    const container = document.getElementById('sleek-chat-container');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.querySelector('.chat-messages');

    if (!container || !chatInput || !messagesContainer) return;

    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    let originalViewportHeight = window.innerHeight;
    let isKeyboardOpen = false;

    function adjustForKeyboard() {
      if (!isMinimized && document.activeElement === chatInput) {
        const currentViewportHeight = window.innerHeight;
        const keyboardHeight = originalViewportHeight - currentViewportHeight;

        if (keyboardHeight > 100) {
          isKeyboardOpen = true;
          container.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
          container.classList.add('keyboard-open');

          setTimeout(() => {
            messagesContainer.scrollTop = 0;
          }, 300);
        }
      }
    }

    function resetChatHeight() {
      isKeyboardOpen = false;
      container.classList.remove('keyboard-open');
      container.style.removeProperty('--keyboard-height');
    }

    // iOS Safari için optimize edilmiş focus handling
    function forceFocusOnInput() {
      if (!chatInput || isMinimized) return;

      // iOS Safari'de input'a focus etmek için özel handling
      chatInput.focus();

      // iOS için ek bir tetikleyici
      if (isMobileSafari) {
        // Input'u seç ve focus et
        chatInput.setSelectionRange(0, 0);

        // Touch event ile tetikle
        setTimeout(() => {
          const event = new Event('touchstart', { bubbles: true });
          chatInput.dispatchEvent(event);
        }, 50);

        // Click event ile tetikle
        setTimeout(() => {
          const event = new Event('click', { bubbles: true });
          chatInput.dispatchEvent(event);
        }, 100);

        // Tekrar focus et
        setTimeout(() => {
          chatInput.focus();
        }, 150);
      }
    }

    chatInput.addEventListener('focus', () => {
      originalViewportHeight = window.innerHeight;
      setTimeout(adjustForKeyboard, 300);
    });

    chatInput.addEventListener('blur', () => {
      setTimeout(resetChatHeight, 300);
    });

    // iOS Safari için click/tap handling
    chatInput.addEventListener('click', function(e) {
      // iOS Safari'de tıklanınca focus'u garanti et
      if (isMobileSafari) {
        e.preventDefault();
        setTimeout(() => {
          this.focus();
        }, 10);
      }
    });

    // iOS Safari için touch handling
    chatInput.addEventListener('touchstart', function(e) {
      if (isMobileSafari) {
        // Touch başlangıcında focus et
        this.focus();
      }
    }, { passive: true });

    // Sayfa görünür olduğunda (başka sekmeye gidip gelince) input'u kontrol et
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !isMinimized) {
        // Sayfa tekrar görünür olduğunda input'a focus olup olmadığını kontrol et
        setTimeout(() => {
          if (document.activeElement !== chatInput && chatInput) {
            // Eğer focus kaybolduysa, chat area'yı tıklayarak geri getir
            const chatArea = document.querySelector('.chat-input-area');
            if (chatArea) {
              chatArea.click();
              setTimeout(() => {
                chatInput.focus();
              }, 100);
            }
          }
        }, 500);
      }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (document.activeElement === chatInput) {
          adjustForKeyboard();
        } else {
          resetChatHeight();
        }
      }, 100);
    });

    chatInput.addEventListener('input', function() {
      this.style.height = 'auto';
      const newHeight = Math.min(this.scrollHeight, 80);
      this.style.height = newHeight + 'px';

      if (isKeyboardOpen) {
        setTimeout(() => {
          messagesContainer.scrollTop = 0;
        }, 100);
      }
    });
  }

  function createSettingsPanel(container) {
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'settings-btn';
    settingsBtn.innerHTML = '⚙';
    settingsBtn.title = 'Settings';
    settingsBtn.style.display = 'none';

    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel';
    settingsPanel.style.display = 'none';

    settingsPanel.innerHTML = `
      <button class="close-settings-btn">×</button>
      <h4>Notification Settings</h4>
      <div class="settings-option">
        <label for="sound-toggle">Notification Sound</label>
        <input type="checkbox" id="sound-toggle" checked>
      </div>
      <div class="settings-option">
        <label for="desktop-notif-toggle">Desktop Notifications</label>
        <input type="checkbox" id="desktop-notif-toggle" checked>
      </div>
    `;

    container.appendChild(settingsBtn);
    container.appendChild(settingsPanel);

    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    const closeBtn = settingsPanel.querySelector('.close-settings-btn');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.style.display = 'none';
    });

    const soundToggle = settingsPanel.querySelector('#sound-toggle');
    const desktopNotifToggle = settingsPanel.querySelector('#desktop-notif-toggle');

    soundToggle.checked = localStorage.getItem('chat-sound-enabled') !== 'false';
    desktopNotifToggle.checked = localStorage.getItem('chat-desktop-notif-enabled') !== 'false';

    notificationSoundEnabled = soundToggle.checked;

    soundToggle.addEventListener('change', () => {
      notificationSoundEnabled = soundToggle.checked;
      localStorage.setItem('chat-sound-enabled', soundToggle.checked);
    });

    desktopNotifToggle.addEventListener('change', () => {
      const enabled = desktopNotifToggle.checked;
      localStorage.setItem('chat-desktop-notif-enabled', enabled);

      if (enabled) {
        // Only request permission when user explicitly enables it
        requestNotificationPermission();
      } else {
        notificationPermission = 'denied';
      }
    });

    document.addEventListener('click', (e) => {
      if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
        settingsPanel.style.display = 'none';
      }
    });

    return {
      show: () => {
        settingsBtn.style.display = 'flex';
      },
      hide: () => {
        settingsBtn.style.display = 'none';
        settingsPanel.style.display = 'none';
      }
    };
  }

  function createChatUI() {
    const container = document.createElement('div');
    container.id = 'sleek-chat-container';
    container.className = 'minimized';

    container.innerHTML = `
      <div class="minimized-icon">💬</div>
      <div class="chat-header" style="display: none;">
        <span class="chat-header-title loading">💬 Loading chat...</span>
        <span class="chat-toggle">▼</span>
      </div>
      <div class="chat-content" style="display: none;">
        <button class="load-older-btn">⬆ Load older messages</button>
        <div class="chat-messages"></div>
        <div class="chat-input-area">
          <div class="format-toolbar">
            <button class="format-btn" data-fmt="b" title="Bold">𝐁</button>
            <button class="format-btn" data-fmt="i" title="Italic">𝐼</button>
            <button class="format-btn" data-fmt="u" title="Underline">U̲</button>
            <button class="format-btn" data-fmt="quote" title="Quote">❝</button>
            <button class="format-btn" data-fmt="link" title="Link">🔗</button>
            <button class="format-btn" data-fmt="img" title="Image">🖼</button>
            <button class="format-btn" data-fmt="spoiler" title="Spoiler">👀</button>
          </div>
          <div class="input-wrapper">
            <textarea id="chat-input" rows="1" placeholder="Type a message..."></textarea>
            <button id="send-btn">➤</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    const settingsControls = createSettingsPanel(container);

    setTimeout(() => {
      setupMobileKeyboardHandling();
      // Initialize audio for ALL browsers
      initializeAudio();
    }, 500);

    const loadOlderBtn = container.querySelector('.load-older-btn');
    if (loadOlderBtn) {
      loadOlderBtn.addEventListener('click', loadOlderMessages);
    }

    const header = container.querySelector('.chat-header');
    const icon = container.querySelector('.minimized-icon');
    const toggle = container.querySelector('.chat-toggle');

    function toggleChat() {
      isMinimized = !isMinimized;
      container.classList.toggle('minimized');

      if (isMinimized) {
        header.style.display = 'none';
        icon.style.display = 'block';
        container.querySelector('.chat-content').style.display = 'none';
        settingsControls.hide();

        if (window.innerWidth <= 768) {
          container.classList.remove('keyboard-open');
          container.style.removeProperty('--keyboard-height');
        }
      } else {
        header.style.display = 'flex';
        icon.style.display = 'none';
        container.querySelector('.chat-content').style.display = 'flex';
        toggle.classList.add('expanded');
        settingsControls.show();
        clearUnreadBadge();

        // When expanding chat, switch to viewing latest messages
        isViewingOlderMessages = false;
        CURRENT_PAGE = LAST_PAGE;

        // iOS Safari için optimize edilmiş focus
        setTimeout(() => {
          const input = document.getElementById('chat-input');
          if (input && isMobileSafari) {
            // iOS Safari'de input'a focus et
            setTimeout(() => {
              input.focus();
              // iOS için ek bir tetikleyici
              if (isMobileSafari) {
                input.setSelectionRange(0, 0);
              }
            }, 200);
          }

          const messages = container.querySelector('.chat-messages');
          if (messages) {
            messages.scrollTop = 0;
          }
        }, 100);
      }
    }

    container.addEventListener('click', (e) => {
      if (isMinimized) toggleChat();
    });

    header.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat();
    });

    // Chat input area'ya tıklanınca input'a focus et (iOS Safari için)
    const chatInputArea = container.querySelector('.chat-input-area');
    if (chatInputArea) {
      chatInputArea.addEventListener('click', (e) => {
        if (e.target !== chatInputArea && !e.target.classList.contains('format-btn')) {
          return;
        }
        const input = document.getElementById('chat-input');
        if (input && !isMinimized) {
          // iOS Safari için optimize edilmiş focus
          if (isMobileSafari) {
            setTimeout(() => {
              input.focus();
              input.setSelectionRange(input.value.length, input.value.length);
            }, 10);
          } else {
            input.focus();
          }
        }
      });
    }

    container.querySelectorAll('.format-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        const fmt = btn.dataset.fmt;

        switch(fmt) {
          case 'b': wrapSelection(input, '[b]', '[/b]'); break;
          case 'i': wrapSelection(input, '[i]', '[/i]'); break;
          case 'u': wrapSelection(input, '[u]', '[/u]'); break;
          case 'quote': wrapSelection(input, '[quote]', '[/quote]'); break;
          case 'link': wrapSelection(input, '[link=', ' text=]'); break;
          case 'img': wrapSelection(input, '[image=', ']'); break;
          case 'spoiler': wrapSelection(input, '[spoiler]', '[/spoiler]'); break;
        }

        // iOS Safari için focus'u koru
        if (isMobileSafari && input) {
          setTimeout(() => {
            input.focus();
          }, 50);
        }
      });
    });

    const sendBtn = container.querySelector('#send-btn');
    sendBtn.addEventListener('click', sendMessage);

    const input = container.querySelector('#chat-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
      const container = document.querySelector('.chat-messages');
      if (container) {
        const wasAtTop = container.scrollTop <= 50;
        if (wasAtTop) {
          container.scrollTop = 0;
        }
      }
    });
  }

  // Optimized initialization to create UI immediately and load data in parallel
  window.addEventListener('load', async () => {
    injectCSS();

    // Initialize settings from localStorage (non-blocking)
    if (localStorage.getItem('chat-sound-enabled') === null) {
      localStorage.setItem('chat-sound-enabled', 'true');
    }
    if (localStorage.getItem('chat-desktop-notif-enabled') === null) {
      localStorage.setItem('chat-desktop-notif-enabled', 'true');
    }

    notificationSoundEnabled = localStorage.getItem('chat-sound-enabled') !== 'false';

    // Set notification permission without blocking
    if ('Notification' in window) {
      notificationPermission = Notification.permission;
    } else {
      notificationPermission = 'denied';
    }

    // Create UI immediately - don't wait for data
    createChatUI();

    // Show loading state in header
    const container = document.getElementById('sleek-chat-container');
    if (container) {
      const header = container.querySelector('.chat-header');
      const titleEl = container.querySelector('.chat-header-title');
      if (header && titleEl) {
        header.classList.add('loading');
        titleEl.classList.add('loading');
      }
    }

    // Start data loading in parallel - don't block UI
    setTimeout(async () => {
      try {
        console.log('🚀 Starting chat data loading...');

        // 1. Get latest conversation ID (fastest operation)
        CHAT_ID = await getLatestConversationId();
        if (!CHAT_ID) {
          console.warn('No conversations found');
          if (container) {
            const header = container.querySelector('.chat-header');
            const titleEl = container.querySelector('.chat-header-title');
            if (header && titleEl) {
              header.classList.remove('loading');
              titleEl.classList.remove('loading');
              titleEl.textContent = '💬 No conversations';
            }
          }
          isInitialLoadComplete = true;
          return;
        }

        console.log(`✅ Found chat ID: ${CHAT_ID}`);

        // 2. Start polling immediately (messages will update when ready)
        const startPolling = async () => {
          if (isInitialLoadComplete) {
            await updateMessages();
          }
          setTimeout(startPolling, POLL_INTERVAL);
        };

        // Start polling in 1 second
        setTimeout(startPolling, 1000);

        // 3. Load conversation data
        const { doc: firstPageDoc, name } = await fetchConversationPage(CHAT_ID, 1);

        // 4. Update UI with chat name
        if (name && container) {
          currentChatName = name;
          const titleEl = container.querySelector('.chat-header-title');
          if (titleEl) {
            titleEl.textContent = `💬 ${name}`;
            titleEl.classList.remove('loading');
          }
          const header = container.querySelector('.chat-header');
          if (header) {
            header.classList.remove('loading');
          }
        }

        // 5. Calculate page info
        LAST_PAGE = getLastPageNumber(firstPageDoc);
        CURRENT_PAGE = LAST_PAGE;
        isViewingOlderMessages = false;
        console.log(`📄 Starting at page ${CURRENT_PAGE} of ${LAST_PAGE}`);

        // 6. Load initial messages
        await updateMessages();

        // Mark initial load as complete
        isInitialLoadComplete = true;
        console.log('✅ Initial chat load complete');

      } catch (err) {
        console.error('Failed to initialize chat:', err);
        isInitialLoadComplete = true;

        // Show error state
        const container = document.getElementById('sleek-chat-container');
        if (container) {
          const header = container.querySelector('.chat-header');
          const titleEl = container.querySelector('.chat-header-title');
          if (header && titleEl) {
            header.classList.remove('loading');
            titleEl.classList.remove('loading');
            titleEl.textContent = '💬 Error loading';
          }
        }
      }
    }, 50); // Short delay to ensure UI is rendered

    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState === 'visible') {
        // Update messages if initial load is complete
        if (isInitialLoadComplete) {
          updateMessages();
        }

        // iOS Safari: Check input focus when page becomes visible
        if (isMobileSafari && !isMinimized) {
          setTimeout(() => {
            const input = document.getElementById('chat-input');
            const chatArea = document.querySelector('.chat-input-area');
            if (input && chatArea && document.activeElement !== input) {
              // Restore focus if lost
              chatArea.click();
              setTimeout(() => {
                input.focus();
                if (isMobileSafari) {
                  input.setSelectionRange(input.value.length, input.value.length);
                }
              }, 200);
            }
          }, 300);
        }
      }
    });
  });
})();
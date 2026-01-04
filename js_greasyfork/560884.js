// ==UserScript==
// @name         💬 Sleek Chat Popup OLD DESIGN
// @namespace    chk.chat.popup.sleek
// @version      4.3
// @description  Modern, lightweight floating chat with smooth animations - single latest conversation with load older messages
// @author       anon
// @match        https://*.popmundo.com/World/Popmundo.aspx/Conversations
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560884/%F0%9F%92%AC%20Sleek%20Chat%20Popup%20OLD%20DESIGN.user.js
// @updateURL https://update.greasyfork.org/scripts/560884/%F0%9F%92%AC%20Sleek%20Chat%20Popup%20OLD%20DESIGN.meta.js
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
  let lastRequestTime = 0;
  let isMinimized = true;
  let lastFormTokens = null;
  let lastNotifiedMsg = '';
  let notificationPermission = 'default';
  let notificationSoundEnabled = true;

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

  const notifAudio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1331-involved.mp3");
  notifAudio.preload = "auto";
  notifAudio.volume = 0.5;

  function unlockGlobalAudio() {
    notifAudio.play().then(() => {
      notifAudio.pause();
      notifAudio.currentTime = 0;
    }).catch(() => {});
    window.removeEventListener('click', unlockGlobalAudio);
  }
  window.addEventListener('click', unlockGlobalAudio);

  function playNotifSound() {
    if (!notificationSoundEnabled) return;
    notifAudio.currentTime = 0;
    notifAudio.play().catch(() => {});
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

      let doc;
      if (!lastFormTokens) {
        const res = await fetch(
          `${location.origin}/World/Popmundo.aspx/Conversations/Conversation/${CHAT_ID}`,
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
      console.log(`⬆ Loading older: page ${targetPage}`);

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

        requestAnimationFrame(() => {
          messagesContainer.scrollTop = oldScrollTop + (messagesContainer.scrollHeight - oldScrollHeight);
        });
      }

      lastFormTokens = { doc: newDoc };
      CURRENT_PAGE = targetPage; // Use the targetPage we requested

      const newCurrentValue = parseInt(
        newDoc.querySelector('#ctl00_cphLeftColumn_ctl00_txtBotGoToPage')?.value || '1',
        10
      );
      if (newCurrentValue <= 1 && loadBtn) { // Check if new current value is 1 or less
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

      .chat-header {
        background: rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
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

      .chat-header-title {
        color: #1c1c1c;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      .chat-toggle {
        color: #1c1c1c;
        font-size: 16px;
        transition: transform 0.3s;
        font-weight: 700;
      }

      .chat-toggle.expanded {
        transform: rotate(180deg);
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

      .chat-messages {
        scrollbar-width: thin;
        scrollbar-color: #cccfe5 #fafbff;
      }

      .message-bubble {
        padding: 10px 14px;
        border-radius: 16px;
        animation: fadeIn 0.3s ease-out;
        position: relative;
        box-shadow: 0 1px 0px rgba(0, 0, 0, 0.06);
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;
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
      }

      .format-btn:hover {
        transform: translateY(-2px);
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
      }

      #send-btn:hover:not(:disabled) {
        transform: translateY(-2px);
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
        color: #1c1c1c;
        font-size: 24px;
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
      }

      .load-older-btn:hover {
        background: #d5dbff;
        color: #1c1c1c;
        transform: translateY(-2px);
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
      }

      .settings-btn:hover {
        background: rgba(0, 0, 0, 0.1);
        transform: rotate(90deg);
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
    const input = doc.querySelector('#ctl00_cphLeftColumn_ctl00_txtTopGoToPage');
    const lastPage = parseInt(input?.getAttribute('value') || '1', 10);
    return isNaN(lastPage) ? 1 : lastPage;
  }

  function extractMessagesFromDoc(doc, otherName) {
    const boxes = [...doc.querySelectorAll('.talkbox')];
    return boxes.map(box => {
      const isMine = box.classList.contains('sayright');
      const content = box.querySelector('.talkbox-content');
      const timeNode = box.querySelector('.talkbox-byline p');
      const time = timeNode?.childNodes?.[timeNode.childNodes.length - 1]?.textContent?.trim() || '';

      if (!content) return null;

      [...content.querySelectorAll('.sub-menu, .sub-menu-float-right, .abusereport, .material-icons')].forEach(el => el.remove());

      let text = content.innerHTML.trim()
        .replace(/^<br\s*\/?>/i, '')
        .replace(/<\/?(div|p)[^>]*>/gi, ' ')
        .replace(/<br\s*\/?>/gi, '<br>')
        .replace(/\s+/g, ' ')
        .trim();

      return {
        isMine,
        sender: isMine ? 'You' : otherName,
        text,
        time
      };
    }).filter(Boolean);
  }

  function renderMessages(messages) {
    return messages.slice().reverse().map(msg => `
      <div class="message-bubble ${msg.isMine ? 'mine' : 'theirs'}">
        <div style="margin-bottom: 0;">
          <span class="message-sender">${msg.sender}:</span>
          <span class="message-text">${msg.text}</span>
        </div>
        <div class="message-time">${msg.time}</div>
      </div>
    `).join('');
  }


// Request notification permission
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

  // Permission not requested yet
  const permission = await Notification.requestPermission();
  notificationPermission = permission;
  return permission === 'granted';
}


// Show Chrome desktop notification
function showDesktopNotification(otherName, messageText) {
  // Check if desktop notifications are enabled in settings
  const desktopNotifEnabled = localStorage.getItem('chat-desktop-notif-enabled') !== 'false';

  if (!desktopNotifEnabled) {
    console.log('Desktop notifications disabled in settings');
    return; // Don't show notification if disabled
  }

  if (notificationPermission !== 'granted') {
    // Try to request permission again
    requestNotificationPermission().then(granted => {
      if (granted) {
        createNotification(otherName, messageText);
      }
    });
    return;
  }

  createNotification(otherName, messageText);
}

function createNotification(otherName, messageText) {
  // Double-check permission
  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return;
  }

  const iconUrl = 'https://www.popmundo.com/favicon.ico';

  // Create notification
  const notification = new Notification(`New message from ${otherName}`, {
    body: messageText.length > 100 ? messageText.substring(0, 100) + '...' : messageText,
    icon: iconUrl,
    tag: 'popmundo-chat', // Group notifications
    requireInteraction: false,
    silent: true // We'll use our own sound
  });

  // Focus window when notification is clicked
  notification.onclick = function() {
    window.focus();
    this.close();

    // Expand chat if minimized
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

        // Show settings button
        const settingsBtn = container.querySelector('.settings-btn');
        if (settingsBtn) settingsBtn.style.display = 'flex';

        // Focus input
        const input = document.getElementById('chat-input');
        if (input) {
          setTimeout(() => input.focus(), 100);
        }
      }
    }
  };

  // Close notification after 5 seconds
  setTimeout(() => {
    notification.close();
  }, 5000);
}

  async function updateMessages() {
    if (!CHAT_ID) return;

    const container = document.querySelector('.chat-messages');
    if (!container) return;

    try {
      const { doc, name } = await fetchConversationPage(CHAT_ID, CURRENT_PAGE);
      const messages = extractMessagesFromDoc(doc, name);
      const newContent = renderMessages(messages);

      if (newContent !== lastMessages) {
        const wasAtTop = container.scrollTop <= 50;
        container.innerHTML = newContent;
        lastMessages = newContent;

        if (wasAtTop || !isMinimized) {
          setTimeout(() => {
            container.scrollTo({ top: 0, behavior: 'instant' });
          }, 100);
        }

        const titleEl = document.querySelector('.chat-header-title');
        if (titleEl && titleEl.textContent === '💬 Loading...') {
          titleEl.textContent = `💬 ${name}`;
        }

        if (isMinimized) {
          const lastMsg = messages[messages.length - 1];
          if (lastMsg && !lastMsg.isMine) {
            const lastText = lastMsg.text.trim();
            if (lastNotifiedMsg !== lastText) {
              lastNotifiedMsg = lastText;
              showUnreadBadge();
              playNotifSound();

              // Visual flash effect
              const headerEl = document.querySelector('.chat-header');
              if (headerEl) {
                headerEl.classList.add('flash');
                setTimeout(() => headerEl.classList.remove('flash'), 600);
              }

              // Show desktop notification
              showDesktopNotification(name, lastText);
            }
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
                updateMessages();
                isSending = false;
                input.readOnly = false;
                sendBtn.innerHTML = '➤';
                sendBtn.disabled = false;
                input.focus();
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
        input.focus();
      }
    };

    iframe.onload = onIframeLoad;
    iframe.src = `${location.origin}/World/Popmundo.aspx/Conversations/Conversation/${CHAT_ID}`;
  }

  // SIMPLIFIED mobile keyboard handling
  function setupMobileKeyboardHandling() {
    const container = document.getElementById('sleek-chat-container');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.querySelector('.chat-messages');

    if (!container || !chatInput || !messagesContainer) return;

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    let originalViewportHeight = window.innerHeight;
    let isKeyboardOpen = false;

    // Function to adjust chat height based on keyboard
    function adjustForKeyboard() {
      if (!isMinimized && document.activeElement === chatInput) {
        // Calculate keyboard height
        const currentViewportHeight = window.innerHeight;
        const keyboardHeight = originalViewportHeight - currentViewportHeight;

        if (keyboardHeight > 100) { // Keyboard is definitely open
          isKeyboardOpen = true;

          // Set CSS variable for keyboard height
          container.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
          container.classList.add('keyboard-open');

          // Scroll messages to show the latest ones
          setTimeout(() => {
            messagesContainer.scrollTop = 0;
          }, 300);
        }
      }
    }

    // Function to reset chat height
    function resetChatHeight() {
      isKeyboardOpen = false;
      container.classList.remove('keyboard-open');
      container.style.removeProperty('--keyboard-height');
    }

    // Handle focus/blur events
    chatInput.addEventListener('focus', () => {
      originalViewportHeight = window.innerHeight;
      setTimeout(adjustForKeyboard, 300);
    });

    chatInput.addEventListener('blur', () => {
      setTimeout(resetChatHeight, 300);
    });

    // Handle window resize (keyboard open/close on iOS)
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

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
      this.style.height = 'auto';
      const newHeight = Math.min(this.scrollHeight, 80);
      this.style.height = newHeight + 'px';

      // If keyboard is open, scroll to show messages
      if (isKeyboardOpen) {
        setTimeout(() => {
          messagesContainer.scrollTop = 0;
        }, 100);
      }
    });
  }

  // Create settings panel
  function createSettingsPanel(container) {
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'settings-btn';
    settingsBtn.innerHTML = '⚙';
    settingsBtn.title = 'Settings';
    settingsBtn.style.display = 'none'; // Hidden by default

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

    // Toggle settings panel
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Close settings panel
    const closeBtn = settingsPanel.querySelector('.close-settings-btn');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.style.display = 'none';
    });

    // Load saved settings
    const soundToggle = settingsPanel.querySelector('#sound-toggle');
    const desktopNotifToggle = settingsPanel.querySelector('#desktop-notif-toggle');

    soundToggle.checked = localStorage.getItem('chat-sound-enabled') !== 'false';
    desktopNotifToggle.checked = localStorage.getItem('chat-desktop-notif-enabled') !== 'false';

    notificationSoundEnabled = soundToggle.checked;

    // Save settings
    soundToggle.addEventListener('change', () => {
      notificationSoundEnabled = soundToggle.checked;
      localStorage.setItem('chat-sound-enabled', soundToggle.checked);
    });

    desktopNotifToggle.addEventListener('change', () => {
      const enabled = desktopNotifToggle.checked;
      localStorage.setItem('chat-desktop-notif-enabled', enabled);

      if (enabled) {
        requestNotificationPermission();
      } else {
        notificationPermission = 'denied';
      }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
        settingsPanel.style.display = 'none';
      }
    });

    // Return functions to show/hide settings button
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
        <span class="chat-header-title">💬 Loading...</span>
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

    // Add settings panel and get show/hide functions
    const settingsControls = createSettingsPanel(container);

    // Set up mobile keyboard handling
    setTimeout(setupMobileKeyboardHandling, 500);

    // Load older button handler
    const loadOlderBtn = container.querySelector('.load-older-btn');
    if (loadOlderBtn) {
      loadOlderBtn.addEventListener('click', loadOlderMessages);
    }

    // Toggle minimize/expand
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
        settingsControls.hide(); // Hide settings button when minimized

        // Reset mobile states when minimizing
        if (window.innerWidth <= 768) {
          container.classList.remove('keyboard-open');
          container.style.removeProperty('--keyboard-height');
        }
      } else {
        header.style.display = 'flex';
        icon.style.display = 'none';
        container.querySelector('.chat-content').style.display = 'flex';
        toggle.classList.add('expanded');
        settingsControls.show(); // Show settings button when expanded
        clearUnreadBadge();

        setTimeout(() => {
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

    // Format buttons
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
      });
    });

    // Send button
    const sendBtn = container.querySelector('#send-btn');
    sendBtn.addEventListener('click', sendMessage);

    // Enter to send
    const input = container.querySelector('#chat-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
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

  // Initialize
// Initialize
window.addEventListener('load', async () => {
  injectCSS();

  // Set initial notification permission
  notificationPermission = Notification.permission;

  // Request notification permission on load if not already set
  if (notificationPermission === 'default') {
    await requestNotificationPermission();
  }

  // Load saved settings
  if (localStorage.getItem('chat-sound-enabled') === null) {
    localStorage.setItem('chat-sound-enabled', 'true');
  }
  if (localStorage.getItem('chat-desktop-notif-enabled') === null) {
    localStorage.setItem('chat-desktop-notif-enabled', 'true');
  }

  notificationSoundEnabled = localStorage.getItem('chat-sound-enabled') !== 'false';

  CHAT_ID = await getLatestConversationId();
  if (!CHAT_ID) {
    console.warn('No conversations found');
    return;
  }

  const { doc } = await fetchConversationPage(CHAT_ID, 1);
  CURRENT_PAGE = getLastPageNumber(doc);

  createChatUI();

  await updateMessages();

  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
      updateMessages();
    }
  });

  const poll = async () => {
      await updateMessages();
      setTimeout(poll, POLL_INTERVAL);
  };
  setTimeout(poll, POLL_INTERVAL);
});
})();
// ==UserScript==
// @name         YouTube Streamer Chat Highlight
// @namespace    https://github.com/dudebot/greasyfork-scripts
// @version      1.3.0
// @description  Collects streamer messages from live chat into a persistent panel that doesn't truncate
// @author       dudebot
// @license      MIT
// @supportURL   https://github.com/dudebot/greasyfork-scripts/issues
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/live/*
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557479/YouTube%20Streamer%20Chat%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/557479/YouTube%20Streamer%20Chat%20Highlight.meta.js
// ==/UserScript==

(() => {
  const MESSAGE_TYPE = 'yt-streamer-chat-message';
  const HEIGHT_STORAGE_KEY = 'yt-streamer-chat-height';

  // ============ SHARED: TrustedTypes policy ============
  let trustedPolicy = null;
  function getTrustedPolicy() {
    if (trustedPolicy) return trustedPolicy;
    if (window.trustedTypes && trustedTypes.createPolicy) {
      try {
        trustedPolicy = trustedTypes.createPolicy('streamerChatPolicy', {
          createHTML: (string) => string
        });
      } catch (e) {
        console.log('[Streamer Chat] Could not create TrustedTypes policy:', e);
      }
    }
    return trustedPolicy;
  }

  function safeSetInnerHTML(element, html) {
    const policy = getTrustedPolicy();
    if (policy) {
      element.innerHTML = policy.createHTML(html);
    } else {
      element.innerHTML = html;
    }
  }

  // ============ SHARED: Extract message data from chat node ============
  function extractOwnerMessage(node, seenMessages) {
    if (node.getAttribute('author-type') !== 'owner') return null;

    const authorEl = node.querySelector('#author-name');
    const messageEl = node.querySelector('#message');
    if (!authorEl || !messageEl) return null;

    const authorName = authorEl.textContent.trim();
    const messageText = messageEl.textContent.trim();
    const timestampEl = node.querySelector('#timestamp');
    const timestamp = timestampEl?.textContent?.trim() || new Date().toLocaleTimeString();
    const msgKey = `${authorName}-${timestamp}-${messageText}`;

    if (seenMessages.has(msgKey)) return null;
    seenMessages.add(msgKey);

    const authorPhotoEl = node.querySelector('#author-photo img');
    return {
      authorName,
      messageHtml: messageEl.innerHTML,
      messageText,
      timestamp,
      authorPhotoSrc: authorPhotoEl?.src || ''
    };
  }

  // ============ SHARED: Chat observer setup ============
  function createChatObserver(onMessage, seenMessages) {
    function processNode(node) {
      if (node.nodeType !== 1) return;
      const data = extractOwnerMessage(node, seenMessages);
      if (data) {
        onMessage(data);
        console.log('[Streamer Chat] Owner message:', data.authorName, data.messageText);
      }
    }

    function scanExisting() {
      const messages = document.querySelectorAll('yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer');
      console.log('[Streamer Chat] Scanning existing messages:', messages.length);
      messages.forEach(processNode);
    }

    function setup() {
      const chatContainer = document.querySelector('yt-live-chat-item-list-renderer #items');
      if (!chatContainer) {
        console.log('[Streamer Chat] Chat container not found, retrying...');
        setTimeout(setup, 1000);
        return;
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach(processNode);
        });
      });

      observer.observe(chatContainer, { childList: true });
      console.log('[Streamer Chat] Observer attached to chat');
      scanExisting();
    }

    return setup;
  }

  // ============ SHARED: Panel UI ============
  function createPanelUI(isPopout) {
    let collapsed = false;
    let messageContainer = null;
    let currentHeight = parseInt(localStorage.getItem(HEIGHT_STORAGE_KEY)) || 300;

    const panel = document.createElement('div');
    panel.id = 'streamer-chat-panel';
    panel.style.cssText = (isPopout ? `
      background: #0f0f0f;
      border-bottom: 1px solid #3f3f3f;
      position: relative;
      z-index: 1000;
    ` : `
      background: #0f0f0f;
      border: 1px solid #3f3f3f;
      border-radius: 8px;
      margin-bottom: 8px;
    `) + `
      height: ${currentHeight}px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid #3f3f3f;
      background: #1a1a1a;
      flex-shrink: 0;
      cursor: pointer;
      user-select: none;
    `;

    const title = document.createElement('span');
    title.textContent = 'Streamer Messages';
    title.style.cssText = 'color: #fff; font-size: 13px; font-weight: 500;';

    const chevron = document.createElement('span');
    chevron.textContent = '\u25BC';
    chevron.style.cssText = 'color: #aaa; font-size: 10px; transition: transform 0.2s;';

    header.appendChild(title);
    header.appendChild(chevron);

    header.addEventListener('click', () => {
      collapsed = !collapsed;
      chevron.style.transform = collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
      if (collapsed) {
        messageContainer.style.display = 'none';
        resizeHandle.style.display = 'none';
        panel.style.height = 'auto';
      } else {
        messageContainer.style.display = 'block';
        resizeHandle.style.display = 'flex';
        panel.style.height = currentHeight + 'px';
      }
    });

    messageContainer = document.createElement('div');
    messageContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      padding: 8px;
    `;

    const placeholder = document.createElement('div');
    placeholder.id = 'streamer-chat-placeholder';
    placeholder.textContent = 'No streamer messages yet...';
    placeholder.style.cssText = 'color: #aaa; font-size: 12px; text-align: center; padding: 16px;';
    messageContainer.appendChild(placeholder);

    // Resize handle at the bottom
    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
      height: 6px;
      background: #2a2a2a;
      cursor: ns-resize;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    // Visual grip indicator
    const grip = document.createElement('div');
    grip.style.cssText = `
      width: 40px;
      height: 2px;
      background: #555;
      border-radius: 1px;
    `;
    resizeHandle.appendChild(grip);

    let isDragging = false;
    let startY = 0;
    let startHeight = 0;
    let overlay = null;

    resizeHandle.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.clientY;
      startHeight = panel.offsetHeight;
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';

      // Create overlay to capture mouse events over iframes
      overlay = document.createElement('div');
      overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; cursor: ns-resize;';
      document.body.appendChild(overlay);

      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = e.clientY - startY;
      const newHeight = Math.max(80, Math.min(startHeight + delta, window.innerHeight * 0.8));
      panel.style.height = newHeight + 'px';
      currentHeight = newHeight;
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem(HEIGHT_STORAGE_KEY, currentHeight);

        if (overlay) {
          overlay.remove();
          overlay = null;
        }
      }
    });

    panel.appendChild(header);
    panel.appendChild(messageContainer);
    panel.appendChild(resizeHandle);

    function addMessage(data) {
      if (!messageContainer) {
        setTimeout(() => addMessage(data), 500);
        return;
      }

      const placeholder = document.getElementById('streamer-chat-placeholder');
      if (placeholder) placeholder.remove();

      const msgDiv = document.createElement('div');
      msgDiv.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 3px 8px;
        border-radius: 4px;
      `;

      if (data.authorPhotoSrc) {
        const pfp = document.createElement('img');
        pfp.src = data.authorPhotoSrc;
        pfp.style.cssText = 'width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;';
        msgDiv.appendChild(pfp);
      }

      const time = document.createElement('span');
      time.textContent = data.timestamp;
      time.style.cssText = 'color: #aaa; font-size: 11px; flex-shrink: 0; margin-right: 8px;';

      const name = document.createElement('span');
      name.textContent = data.authorName;
      name.style.cssText = `
        color: rgba(0, 0, 0, 0.87);
        font-weight: 500;
        margin-right: 6px;
        background-color: #ffd600;
        padding: 2px 4px;
        border-radius: 2px;
      `;

      const content = document.createElement('span');
      safeSetInnerHTML(content, data.messageHtml);
      content.style.cssText = 'display: inline; color: #fff;';
      content.querySelectorAll('img').forEach(img => {
        img.style.cssText = 'height: 18px; width: 18px; vertical-align: middle;';
      });

      msgDiv.appendChild(time);
      msgDiv.appendChild(name);
      msgDiv.appendChild(content);

      messageContainer.appendChild(msgDiv);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    return { panel, addMessage };
  }

  // Detect context
  const isLiveChatPage = window.location.pathname.startsWith('/live_chat');
  const isPopout = isLiveChatPage && window.self === window.top;
  const isInChatIframe = isLiveChatPage && window.self !== window.top;

  if (isPopout) {
    runInPopout();
  } else if (isInChatIframe) {
    runInChatIframe();
  } else {
    runInMainPage();
  }

  // ============ CHAT IFRAME: Just observes and sends to parent ============
  function runInChatIframe() {
    console.log('[Streamer Chat] Running in chat iframe');
    const seenMessages = new Set();

    const setupObserver = createChatObserver((data) => {
      window.parent.postMessage({ type: MESSAGE_TYPE, ...data }, '*');
    }, seenMessages);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupObserver);
    } else {
      setupObserver();
    }
  }

  // ============ POPOUT: Panel + direct observation ============
  function runInPopout() {
    console.log('[Streamer Chat] Running in popout mode');
    const seenMessages = new Set();
    const { panel, addMessage } = createPanelUI(true);

    function injectPanel(callback) {
      if (document.getElementById('streamer-chat-panel')) {
        if (callback) callback();
        return;
      }

      const itemList = document.querySelector('#item-list.yt-live-chat-renderer');
      if (itemList) {
        itemList.insertBefore(panel, itemList.firstChild);
        console.log('[Streamer Chat] Panel injected in popout');
        if (callback) callback();
      } else {
        setTimeout(() => injectPanel(callback), 500);
      }
    }

    const setupObserver = createChatObserver(addMessage, seenMessages);

    injectPanel(() => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObserver);
      } else {
        setupObserver();
      }
    });
  }

  // ============ MAIN PAGE: Panel + listens for messages from iframe ============
  function runInMainPage() {
    console.log('[Streamer Chat] Running in main page');
    const { panel, addMessage } = createPanelUI(false);

    function injectPanel() {
      if (document.getElementById('streamer-chat-panel')) return;

      const chatContainer = document.querySelector('ytd-live-chat-frame') ||
                            document.querySelector('#chat-container') ||
                            document.querySelector('#secondary #chat');
      if (chatContainer) {
        chatContainer.parentElement.insertBefore(panel, chatContainer);
        console.log('[Streamer Chat] Panel injected');
      }
    }

    window.addEventListener('message', (event) => {
      if (event.data?.type === MESSAGE_TYPE) {
        console.log('[Streamer Chat] Received message from iframe:', event.data);
        addMessage(event.data);
      }
    });

    const checkReady = setInterval(() => {
      const chatFrame = document.querySelector('ytd-live-chat-frame');
      if (chatFrame) {
        clearInterval(checkReady);
        injectPanel();
      }
    }, 500);

    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(injectPanel, 1000);
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
})();

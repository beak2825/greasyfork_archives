// ==UserScript==
// @name         JanitorAI: Send Images + Image Generation + Screenshare
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @license      MIT
// @description  Send images to JanitorAI bots and generate images!. Includes Screenshare support.
// @author       Zephyr (xzeph__ on Discord)
// @match        https://gemini.google.com/app/*
// @match        https://janitorai.com/chats/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561922/JanitorAI%3A%20Send%20Images%20%2B%20Image%20Generation%20%2B%20Screenshare.user.js
// @updateURL https://update.greasyfork.org/scripts/561922/JanitorAI%3A%20Send%20Images%20%2B%20Image%20Generation%20%2B%20Screenshare.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 🛑 STOP GHOSTS: Prevent script from running in iframes/ads
  if (window.top !== window.self) return;

  // ==========================================================
  // SHARED: COMMUNICATION BRIDGE (The Link between Tabs)
  // ==========================================================

  const CMD_KEY = "GEMINI_REMOTE_CMD";
  const RESP_KEY = "GEMINI_REMOTE_RESP";

  const MSG_TYPES = {
    SET_TEXT: "SET_TEXT",
    SEND_MESSAGE: "SEND_MESSAGE",
    PING_GEMINI: "PING_GEMINI",
    IMAGE_RESPONSE: "IMAGE_RESPONSE",
    GEMINI_READY: "GEMINI_READY",
    GEMINI_PONG: "GEMINI_PONG",
    TEXT_SENT: "TEXT_SENT",
    REQUEST_IMAGE: "REQUEST_IMAGE", // New: marks that script is expecting an image
    ERROR: "ERROR"
  };

  function sendSignal(key, type, data = {}) {
    // Clear the key first to ensure the change listener fires even if values are similar
    GM_setValue(key, null);
    // Small delay to ensure the clear is processed before setting new value
    setTimeout(() => {
      GM_setValue(key, {
        id: Math.random().toString(36).substring(7) + '_' + Date.now(),
        type: type,
        ...data,
        timestamp: Date.now()
      });
    }, 10);
  }

  // ==========================================================
  // HOST LOGIC: GEMINI.GOOGLE.COM (The Engine)
  // ==========================================================
  if (window.location.hostname.includes("gemini.google.com")) {
    console.log("[Gemini Remote] 🤖 Host Active - Ready to serve JanitorAI");

    let lastCmdId = "";

    function handleRemoteCommand(payload) {
        if (payload.id === lastCmdId) return;
        lastCmdId = payload.id;

        const { type, text } = payload;
        switch (type) {
            case MSG_TYPES.SET_TEXT:
                setTextInGemini(text);
                break;
            case MSG_TYPES.SEND_MESSAGE:
                if (text) setTextInGemini(text);
                setTimeout(() => clickSendButton(), 600);
                break;
            case MSG_TYPES.PING_GEMINI:
                sendSignal(RESP_KEY, MSG_TYPES.GEMINI_PONG);
                break;
        }
    }

    function findTextarea() {
      const selectors = ['.ql-editor', 'textarea', '[contenteditable="true"]'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
      }
      return null;
    }

    function findSendButton() {
      const selectors = ['button[aria-label*="Send"]', '.send-button', 'button[data-test-id="send-button"]'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && !el.disabled) return el;
      }
      return document.querySelector('button[aria-label*="Send"]');
    }

    function setTextInGemini(text) {
      const textarea = findTextarea();
      if (!textarea) return;

      if (textarea.classList.contains('ql-editor')) {
        textarea.innerHTML = `<p>${text}</p>`;
      } else {
        textarea.value = text;
      }
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function clickSendButton() {
      const btn = findSendButton();
      if (btn && !btn.disabled) {
          btn.click();
          sendSignal(RESP_KEY, MSG_TYPES.TEXT_SENT);
      }
    }

    // IMAGE WATCHER
    const processedImages = new Set();
    let expectingImage = false; // Track if script requested an image
    let expectingImageTimestamp = 0; // When the request was made
    const IMAGE_EXPECTATION_TIMEOUT = 120000; // 2 minutes timeout for image generation

    function ignoreHistory() {
        const images = document.querySelectorAll('img');
        let count = 0;
        for (const img of images) {
            if (img.src && img.src.startsWith('http')) {
                processedImages.add(img.src);
                count++;
            }
        }
        if(count > 0) console.log(`[Gemini Host] 🙈 Ignored ${count} existing images.`);
    }

    // Listen for image generation requests from JanitorAI
    GM_addValueChangeListener(CMD_KEY, function(key, oldVal, newVal, remote) {
      if (!newVal) return;

      // Check if this is an image generation request
      if (newVal.type === MSG_TYPES.SEND_MESSAGE) {
        // Mark that we're expecting an image from this request
        expectingImage = true;
        expectingImageTimestamp = Date.now();
        console.log("[Gemini Host] 🎯 Script requested image generation - now expecting image");
      }

      handleRemoteCommand(newVal);
    });

    // Core function to scan and send new images
    function scanForNewImages() {
        // Check if expectation has timed out
        if (expectingImage && (Date.now() - expectingImageTimestamp > IMAGE_EXPECTATION_TIMEOUT)) {
            console.log("[Gemini Host] ⏰ Image expectation timed out");
            expectingImage = false;
        }

        // Only process images if we're expecting one from the script
        if (!expectingImage) {
            return; // Don't process any images if script didn't request one
        }

        const images = document.querySelectorAll('img');

        for (const img of images) {
          let src = img.src;
          if (!src) continue;

          // Skip small images (icons, avatars, etc.)
          if (img.width < 200 && img.naturalWidth < 200) continue;
          if (src.includes('googleusercontent.com/auth')) continue;
          if (src.includes('profile')) continue;

          if (src.startsWith('http:')) src = src.replace('http:', 'https:');
          if (processedImages.has(src)) continue;

          if (src.startsWith('https://') && !src.includes('data:image')) {
              processedImages.add(src);
              console.log("[Gemini Host] 📸 Sent Image to Janitor:", src);
              sendSignal(RESP_KEY, MSG_TYPES.IMAGE_RESPONSE, { imageUrl: src });

              // Reset expectation after successfully sending an image
              expectingImage = false;
              console.log("[Gemini Host] ✅ Image sent, no longer expecting");
              return; // Only send one image per request
          }
        }
    }

    function watchForImages() {
      // MutationObserver for real-time detection when tab is active
      const observer = new MutationObserver(() => {
        scanForNewImages();
      });

      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
      console.log("[Gemini Host] 👀 Watcher active.");

      // CRITICAL FIX: Also scan when tab becomes visible (switching back from JanitorAI)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          console.log("[Gemini Host] 👁️ Tab became visible, scanning for new images...");
          // Small delay to let any pending renders complete
          setTimeout(scanForNewImages, 100);
          setTimeout(scanForNewImages, 500);
          setTimeout(scanForNewImages, 1000);
        }
      });

      // CRITICAL FIX: Periodic scanning to catch images generated while tab was hidden
      // Browsers throttle background tabs, so we need to actively poll
      setInterval(() => {
        scanForNewImages();
      }, 2000); // Check every 2 seconds
    }

    setTimeout(() => {
        ignoreHistory();
        watchForImages();
        sendSignal(RESP_KEY, MSG_TYPES.GEMINI_READY);
    }, 2000);

    return; // STOP HERE IF ON GEMINI
  }

  // ==========================================================
  // CLIENT LOGIC: JANITORAI.COM (The Interface)
  // ==========================================================

  if (!window.location.hostname.includes("janitorai.com")) return;

  // ==========================================================
  // SCRIPT COORDINATION - Communicate with other Zephyr scripts
  // ==========================================================
  // This allows multiple scripts to coordinate their attach menus
  // ImageGen uses z-index 50, QoL WebSearch uses z-index 60 (overlays this)

  const ZEPHYR_SCRIPTS = {
    IMAGEGEN: 'zephyr-imagegen',
    QOL_WEBSEARCH: 'zephyr-qol-websearch'
  };

  // Announce this script's presence
  window.__ZEPHYR_SCRIPTS__ = window.__ZEPHYR_SCRIPTS__ || {};
  window.__ZEPHYR_SCRIPTS__[ZEPHYR_SCRIPTS.IMAGEGEN] = {
    version: '2.5.0',
    previewPanelClass: 'imagegen-preview-panel',
    attachBtnClass: 'imagegen-attach-btn',
    zIndex: 50
  };

  // Dispatch event to notify other scripts
  window.dispatchEvent(new CustomEvent('zephyr-script-loaded', {
    detail: { script: ZEPHYR_SCRIPTS.IMAGEGEN, data: window.__ZEPHYR_SCRIPTS__[ZEPHYR_SCRIPTS.IMAGEGEN] }
  }));

  // Listen for other scripts (for future coordination features)
  window.addEventListener('zephyr-script-loaded', (e) => {
    if (e.detail.script !== ZEPHYR_SCRIPTS.IMAGEGEN) {
      console.log(`[ImageGen] 🤝 Detected companion script: ${e.detail.script}`);
    }
  });

  // ==========================================================
  // SECCIÓN 0. SETTINGS STORAGE
  // ==========================================================

  const DEFAULT_SETTINGS = {
    enabled: false,
    generateUserImages: false,
    autoGeneration: false,
    useLocalStorage: false, // NEW OPTION
    editBeforeSending: false, // Allow editing prompt before sending
    provider: 'gemini-remote', // Default provider
    triggerWords: [],
    triggerWordsEnabled: true,
    testMode: false,
    testImageUrl: "",
    contextualPrompt: "Generate an image based on the context:\n\nPrevious message:\n{{previousMsg}}\n\nCurrent message:\n{{presentMsg}}",
    loadHistoryOnPageLoad: true,
    // Image Captioning settings
    captioningEnabled: true,
    captioningProvider: 'gemini-api',
    captioningApiKey: '',
    captioningModel: 'gemini-2.5-flash',
    captioningPrompt: `Describe this image in 2-3 paragraphs. Be objective and factual - do NOT mention emotions, mood, or feelings the image evokes.

If you recognize characters from any media (anime, games, movies, etc.), state their name and source. If you recognize a specific app or website interface, mention it - otherwise just describe what's shown.

Cover: appearance (hair, eyes, skin, notable features), facial expression, clothing/accessories, pose, background, and art style if applicable. Transcribe any visible text. Use specific color names when possible. No bullet points or lists.`,
    editCaptionBeforeSaving: false,
    injectCaptionsToLLM: true, // Inject captions into LLM requests (always active)
    cleanupOrphanedSwipes: true // When user responds, delete images from non-selected swipes
  };

  function loadSettings() {
    try {
      const saved = localStorage.getItem("imageGenSettings");
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("[ImageGen] Failed to load settings:", e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem("imageGenSettings", JSON.stringify(settings));
    } catch (e) {
      console.error("[ImageGen] Failed to save settings:", e);
    }
  }

  let currentSettings = loadSettings();

  // Image history storage - UPDATED TO USE GM_getValue/setValue to support BASE64
  let imageHistory = [];

  // Cache the character name to avoid DOM dependency issues
  let _cachedCharacterName = null;
  let _cachedChatId = null;

  function getCurrentChatId() {
    // Use cached value if available and URL hasn't changed
    const urlMatch = window.location.pathname.match(/\/chats\/(\d+)/);
    if (urlMatch) {
      _cachedChatId = urlMatch[1];
      return urlMatch[1];
    }
    return _cachedChatId || "unknown";
  }

  function getCurrentCharacterName() {
    // Return cached name if we have it for this chat
    const currentChatId = getCurrentChatId();
    if (_cachedCharacterName && _cachedChatId === currentChatId) {
      return _cachedCharacterName;
    }

    // Try to get from DOM
    const botNameElement = document.querySelector('[class^="_nameText_"]');
    if (botNameElement) {
      const name = botNameElement.textContent.trim();
      if (name) {
        _cachedCharacterName = name;
        console.log(`[ImageGen] 📝 Cached character name: "${name}" for chat ${currentChatId}`);
        return name;
      }
    }

    // Fallback to chat ID if bot name not found
    // This ensures consistent keys even if DOM isn't ready
    return currentChatId;
  }

  function getHistoryStorageKey(characterName) {
    const chatId = getCurrentChatId();
    // IMPORTANT: Use ONLY the chat ID for the storage key to ensure consistency
    // The character name can change during page load (DOM not ready), but chat ID is always stable
    // We keep the function signature for compatibility but ignore the characterName parameter for the key
    return `imageGenHistory_chat_${chatId}`;
  }

  // Migration function to move old history format to new format
  function migrateOldHistoryFormat() {
    const chatId = getCurrentChatId();
    if (chatId === "unknown") return;

    const newKey = `imageGenHistory_chat_${chatId}`;

    // Check if we already have data in the new format
    const existingNewData = GM_getValue(newKey);
    if (existingNewData && existingNewData.length > 0) {
      console.log(`[ImageGen] 📂 History already exists in new format (${existingNewData.length} items)`);
      return;
    }

    // Try to find old format data by trying common patterns
    const oldPatterns = [
      `imageGenHistory_${chatId}_${chatId}`, // When character name wasn't loaded
    ];

    // Also try with the character name if we can get it
    const charName = getCurrentCharacterName();
    if (charName && charName !== chatId) {
      const safeCharName = charName.replace(/[^a-zA-Z0-9_-]/g, '_');
      oldPatterns.push(`imageGenHistory_${safeCharName}_${chatId}`);
    }

    for (const oldKey of oldPatterns) {
      const oldData = GM_getValue(oldKey);
      if (oldData && oldData.length > 0) {
        console.log(`[ImageGen] 🔄 Migrating ${oldData.length} items from old key "${oldKey}" to new key "${newKey}"`);
        GM_setValue(newKey, oldData);
        // Don't delete old data in case of issues - it's just extra storage
        console.log(`[ImageGen] ✅ Migration complete!`);
        return;
      }
    }
  }

  // Force update of cached character name (call when DOM is ready)
  function refreshCharacterNameCache() {
    const oldName = _cachedCharacterName;
    _cachedCharacterName = null; // Clear cache to force refresh
    const newName = getCurrentCharacterName();
    if (oldName && oldName !== newName && oldName !== getCurrentChatId()) {
      console.log(`[ImageGen] ⚠️ Character name changed: "${oldName}" -> "${newName}"`);
    }
  }

  // Changed to GM_getValue to support larger files
  function loadImageHistory(characterName = null) {
    try {
      const charName = characterName || getCurrentCharacterName();
      const key = getHistoryStorageKey(charName);
      console.log(`[ImageGen] 📂 Loading history with key: ${key}`);
      // Fallback check for old localstorage data to migrate could go here, but keeping it simple
      const saved = GM_getValue(key);
      if (saved) {
        const history = typeof saved === 'string' ? JSON.parse(saved) : saved;
        console.log(`[ImageGen] 📂 Loaded ${history.length} items from history`);
        return history;
      }
      console.log(`[ImageGen] 📂 No history found for key: ${key}`);
    } catch (e) {
      console.error("[ImageGen] Failed to load image history:", e);
    }
    return [];
  }

  // Changed to GM_setValue
  function saveImageHistory(history, characterName = null) {
    try {
      const charName = characterName || getCurrentCharacterName();
      const key = getHistoryStorageKey(charName);
      console.log(`[ImageGen] 💾 Saving ${history.length} items to history with key: ${key}`);
      GM_setValue(key, history);
    } catch (e) {
      console.error("[ImageGen] Failed to save image history:", e);
    }
  }

  function addToImageHistory(messageIndex, swipeIndex, imageUrl, caption = '', isUserMessage = false) {
    const charName = getCurrentCharacterName();
    const history = loadImageHistory(charName);

    // Check if this exact image already exists in history for this message/swipe
    const existingEntry = history.find(item =>
      item.messageIndex === messageIndex &&
      item.swipeIndex === swipeIndex &&
      item.imageUrl === imageUrl
    );
    if (existingEntry) {
      console.log(`[ImageGen] ⚠️ Image already exists in history for message ${messageIndex}, swipe ${swipeIndex}, skipping add`);
      return existingEntry;
    }

    const entry = {
      id: Date.now(),
      messageIndex,
      swipeIndex,
      imageUrl,
      caption: caption,
      visible: true, // Default: caption will be injected into LLM requests
      isUserMessage: isUserMessage, // User messages don't have swipes, always include their captions
      timestamp: new Date().toISOString()
    };
    history.push(entry);
    saveImageHistory(history, charName);
    imageHistory = history;
    console.log(`[ImageGen] ✅ Added to history: message ${messageIndex}, swipe ${swipeIndex}, entry ID ${entry.id}, total items: ${history.length}`);
    return entry;
  }

  function toggleImageVisibility(imageUrl) {
    const charName = getCurrentCharacterName();
    let history = loadImageHistory(charName);
    const index = history.findIndex(item => item.imageUrl === imageUrl);
    if (index !== -1) {
      // Toggle visibility (default to true if undefined)
      history[index].visible = !(history[index].visible !== false);
      saveImageHistory(history, charName);
      imageHistory = history;
      return history[index].visible;
    }
    return null;
  }

  function getImageVisibility(imageUrl) {
    const charName = getCurrentCharacterName();
    const history = loadImageHistory(charName);
    const item = history.find(item => item.imageUrl === imageUrl);
    // Default to true if not found or undefined
    return item ? (item.visible !== false) : true;
  }

  function updateImageCaption(id, newCaption) {
    const charName = getCurrentCharacterName();
    let history = loadImageHistory(charName);
    const index = history.findIndex(item => item.id === id);
    if (index !== -1) {
      history[index].caption = newCaption;
      saveImageHistory(history, charName);
      imageHistory = history;
    }
    return history;
  }

  function updateImageCaptionByUrl(imageUrl, newCaption) {
    const charName = getCurrentCharacterName();
    let history = loadImageHistory(charName);
    const index = history.findIndex(item => item.imageUrl === imageUrl);
    if (index !== -1) {
      history[index].caption = newCaption;
      saveImageHistory(history, charName);
      imageHistory = history;
      return true;
    }
    return false;
  }

  function clearImageHistory() {
    const charName = getCurrentCharacterName();
    imageHistory = [];
    saveImageHistory(imageHistory, charName);
  }

  function removeFromImageHistory(id) {
    const charName = getCurrentCharacterName();
    let history = loadImageHistory(charName);
    history = history.filter(item => item.id !== id);
    saveImageHistory(history, charName);
    imageHistory = history;
    return history;
  }

  // Clear all gallery containers from DOM and re-inject from history
  function refreshImagesFromHistory() {
    // Remove all existing gallery containers from the DOM
    document.querySelectorAll('.imagegen-gallery-container').forEach(container => {
      container.remove();
    });
    // Re-inject images from the updated history
    // Use a small delay to ensure DOM is ready
    setTimeout(() => {
      reinjectImagesFromHistory();
    }, 100);
  }

  // ==========================================================
  // SWIPE CONSOLIDATION - Handle when user responds and swipes are locked
  // ==========================================================
  // When a user responds, JanitorAI locks the current swipe as the only one (becomes swipe 0)
  // This function detects this and updates the image history accordingly

  function consolidateSwipesInHistory() {
    const settings = loadSettings();
    if (!settings.cleanupOrphanedSwipes) return;

    const charName = getCurrentCharacterName();
    let history = loadImageHistory(charName);
    if (history.length === 0) return;

    const MESSAGE_CONTAINER_SELECTOR = '[data-testid="virtuoso-item-list"] > div[data-index]';
    const LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR = '[class^="_botChoicesContainer_"]';
    const BOT_NAME_ICON_SELECTOR = '[class^="_nameIcon_"]';

    const allNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    let modified = false;

    // Build a map of which messages currently have swipe containers
    const messagesWithSwipeContainers = new Set();

    allNodes.forEach(node => {
      const index = parseInt(node.dataset.index, 10);
      if (isNaN(index)) return;

      // Only bot messages can have swipes
      if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
        const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
        if (swipeContainer) {
          messagesWithSwipeContainers.add(index);
        }
      }
    });

    // Group history items by messageIndex
    const historyByMessage = {};
    history.forEach(item => {
      if (!historyByMessage[item.messageIndex]) {
        historyByMessage[item.messageIndex] = [];
      }
      historyByMessage[item.messageIndex].push(item);
    });

    // Build a set of visible message indices
    const visibleMessageIndices = new Set();
    allNodes.forEach(node => {
      const index = parseInt(node.dataset.index, 10);
      if (!isNaN(index)) visibleMessageIndices.add(index);
    });

    // Check each message that has history items
    const newHistory = [];

    for (const [msgIndexStr, items] of Object.entries(historyByMessage)) {
      const msgIndex = parseInt(msgIndexStr, 10);

      // IMPORTANT: Skip consolidation logic for messages not currently visible in the DOM
      // JanitorAI virtualizes messages, so messages that scroll out of view are removed
      // We must NOT assume swipes were consolidated just because the message isn't visible
      if (!visibleMessageIndices.has(msgIndex)) {
        // Message not in DOM - keep all items as-is, no consolidation
        newHistory.push(...items);
        continue;
      }

      // Check if this message has items on non-zero swipes in history
      const swipeIndices = [...new Set(items.map(item => item.swipeIndex))];
      const hasNonZeroSwipes = swipeIndices.some(idx => idx !== 0);

      // Get the highest visible message index to determine "last" message
      const maxVisibleIndex = Math.max(...visibleMessageIndices);

      // If message has history with non-zero swipes but DOM no longer shows swipe container,
      // AND this is not the last message (last message can still have swipes),
      // it means the user responded and swipes were consolidated
      const isNotLastBotMessage = msgIndex < maxVisibleIndex;

      if (hasNonZeroSwipes && !messagesWithSwipeContainers.has(msgIndex) && isNotLastBotMessage) {
        // This message had its swipes consolidated
        // The currently selected swipe became swipe 0
        // We need to determine which swipe was active when user responded

        // Strategy: Look at the history items. The ones with images that would have been
        // visible are the ones we keep. Since we can't know which swipe was selected,
        // we'll use the getActiveSwipesMap data if available, or fall back to keeping
        // all items but updating their swipe index to 0

        // Get the active swipe from our stored map (if we tracked it)
        // For now, we'll use a simpler approach: find items that have the same swipe index
        // as the most common one, and assume that was the active swipe

        // Actually, the best approach: The active swipe at time of consolidation
        // is the one that's now showing. Since swipes are gone, we need to check
        // which images from history match what would be in the current message.

        // Find the node for this message
        const node = Array.from(allNodes).find(n => parseInt(n.dataset.index, 10) === msgIndex);
        if (node) {
          // Since images haven't been reinjected yet, we need to determine which swipe was active
          // The best way is to track this separately, but for now we'll use a heuristic:
          // If there are items with different swipe indices, we need to figure out which one
          // was the active one.

          // Check if we stored the last known active swipe for this message
          const lastActiveSwipe = window._imageGenLastActiveSwipes?.[msgIndex];

          if (lastActiveSwipe !== undefined) {
            // We know which swipe was active, keep only those items
            items.forEach(item => {
              if (item.swipeIndex === lastActiveSwipe) {
                // Update to swipe 0 since that's what it is now
                const oldSwipe = item.swipeIndex;
                item.swipeIndex = 0;
                newHistory.push(item);
                modified = true;
                console.log(`[ImageGen] 🔄 Consolidated image from swipe ${oldSwipe} to swipe 0 for message #${msgIndex}`);
              } else {
                // This image is from a discarded swipe, remove it
                modified = true;
                console.log(`[ImageGen] 🗑️ Removed orphaned image from swipe ${item.swipeIndex} for message #${msgIndex}`);
              }
            });
          } else {
            // We don't know which swipe was active, keep all items but set to swipe 0
            // This is a fallback - not ideal but prevents data loss
            items.forEach(item => {
              if (item.swipeIndex !== 0) {
                const oldSwipe = item.swipeIndex;
                item.swipeIndex = 0;
                modified = true;
                console.log(`[ImageGen] 🔄 Consolidated image from swipe ${oldSwipe} to swipe 0 for message #${msgIndex} (fallback)`);
              }
              newHistory.push(item);
            });
          }
        } else {
          // Message not in DOM, keep all items as-is
          newHistory.push(...items);
        }
      } else {
        // No consolidation needed, keep items as-is
        newHistory.push(...items);
      }
    }

    if (modified) {
      saveImageHistory(newHistory, charName);
      imageHistory = newHistory;
      console.log(`[ImageGen] ✅ Swipe consolidation complete. History updated.`);
    }
  }

  // Track active swipes for consolidation purposes
  function updateActiveSwipesTracking() {
    const activeSwipesMap = getActiveSwipesMap();
    window._imageGenLastActiveSwipes = activeSwipesMap;
  }

  // ==========================================================
  // FETCH INTERCEPTOR - Inject Captions into LLM Requests
  // ==========================================================
  // This uses page context injection (like God Mode) to properly intercept fetch

  // Communication bridge: Tampermonkey -> Page Context
  const CAPTION_DATA_EVENT = 'imagegen-caption-data';
  const CAPTION_REQUEST_EVENT = 'imagegen-caption-request';

  // Helper: Get the currently active swipe index for each message from the DOM
  function getActiveSwipesMap() {
    const activeSwipes = {};
    const MESSAGE_CONTAINER_SELECTOR = '[data-testid="virtuoso-item-list"] > div[data-index]';
    const LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR = '[class^="_botChoicesContainer_"]';
    const SWIPE_SLIDER_SELECTOR = '[class^="_botChoicesSlider_"]';

    const allMessageNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    allMessageNodes.forEach(node => {
      const index = parseInt(node.dataset.index, 10);
      if (isNaN(index)) return;

      // Check if this message has swipes (bot messages with alternatives)
      const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
      if (swipeContainer) {
        const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
        if (slider) {
          const transform = slider.style.transform;
          const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
          const activeSwipeIndex = Math.round(Math.abs(translateX) / 100);
          activeSwipes[index] = activeSwipeIndex;
          return;
        }
      }
      // Default: swipe 0 (first/only swipe)
      activeSwipes[index] = 0;
    });

    return activeSwipes;
  }

  // Listen for caption data requests from the injected script
  window.addEventListener(CAPTION_REQUEST_EVENT, () => {
    const settings = loadSettings();
    if (!settings.injectCaptionsToLLM) {
      // Send empty data if injection is disabled
      window.dispatchEvent(new CustomEvent(CAPTION_DATA_EVENT, {
        detail: { enabled: false, history: [] }
      }));
      return;
    }

    const charName = getCurrentCharacterName();
    const history = loadImageHistory(charName);

    // Get the currently active swipe for each message and track it
    const activeSwipesMap = getActiveSwipesMap();
    // Store for consolidation purposes (in case user responds after this)
    window._imageGenLastActiveSwipes = activeSwipesMap;

    // Filter history items for caption injection
    const filteredHistory = history.filter(item => {
      // Must be visible
      if (item.visible === false) {
        console.log(`[ImageGen] Filtering out msg #${item.messageIndex} - visibility set to false`);
        return false;
      }

      // User messages don't have swipes - always include their captions
      if (item.isUserMessage) return true;

      // Must match the currently active swipe for this message
      const activeSwipe = activeSwipesMap[item.messageIndex];
      // If we don't know the active swipe (message not in DOM), include it
      // This is critical for virtualized scrolling - messages out of view should still be included
      if (activeSwipe === undefined) {
        console.log(`[ImageGen] Including msg #${item.messageIndex} (not in DOM, assuming valid)`);
        return true;
      }
      // Only include if swipe matches
      const matches = item.swipeIndex === activeSwipe;
      if (!matches) {
        console.log(`[ImageGen] Filtering out msg #${item.messageIndex} - swipe mismatch (history: ${item.swipeIndex}, active: ${activeSwipe})`);
      }
      return matches;
    });

    // Send caption data to page context
    window.dispatchEvent(new CustomEvent(CAPTION_DATA_EVENT, {
      detail: {
        enabled: true,
        history: filteredHistory.map(item => ({
          messageIndex: item.messageIndex,
          swipeIndex: item.swipeIndex,
          caption: item.caption || ''
        }))
      }
    }));

    console.log(`[ImageGen] 📤 Sent ${filteredHistory.length}/${history.length} caption items. Active swipes:`, activeSwipesMap);
  });

  // Inject the fetch interceptor into the page context
  function injectFetchInterceptor() {
    const script = document.createElement('script');
    script.textContent = `(${function() {
      // This runs in the page context, not Tampermonkey sandbox
      const CAPTION_DATA_EVENT = 'imagegen-caption-data';
      const CAPTION_REQUEST_EVENT = 'imagegen-caption-request';

      // Store for caption data received from Tampermonkey context
      let captionData = { enabled: false, history: [] };
      let captionDataPromiseResolve = null;

      // Listen for caption data from Tampermonkey context
      window.addEventListener(CAPTION_DATA_EVENT, (e) => {
        captionData = e.detail;
        if (captionDataPromiseResolve) {
          captionDataPromiseResolve(captionData);
          captionDataPromiseResolve = null;
        }
      });

      // Request fresh caption data and wait for response
      function requestCaptionData() {
        return new Promise((resolve) => {
          captionDataPromiseResolve = resolve;
          window.dispatchEvent(new CustomEvent(CAPTION_REQUEST_EVENT));
          // Timeout fallback in case no response
          setTimeout(() => {
            if (captionDataPromiseResolve) {
              captionDataPromiseResolve({ enabled: false, history: [] });
              captionDataPromiseResolve = null;
            }
          }, 500);
        });
      }

      // Function to inject captions into the payload
      function injectCaptionsIntoPayload(payload, history) {
        try {
          const data = typeof payload === 'string' ? JSON.parse(payload) : payload;

          // Check if this is a chat generation request with chatMessages
          if (!data.chatMessages || !Array.isArray(data.chatMessages)) {
            return payload;
          }

          if (history.length === 0) {
            console.log("[ImageGen] No image history to inject");
            return payload;
          }

          // Group captions by messageIndex
          const captionsByMessage = {};
          history.forEach(item => {
            if (item.caption && item.caption.trim()) {
              if (!captionsByMessage[item.messageIndex]) {
                captionsByMessage[item.messageIndex] = [];
              }
              captionsByMessage[item.messageIndex].push({
                swipeIndex: item.swipeIndex,
                caption: item.caption
              });
            }
          });

          if (Object.keys(captionsByMessage).length === 0) {
            console.log("[ImageGen] No captions to inject (all empty)");
            return payload;
          }

          // Inject captions into corresponding messages
          let injectedCount = 0;
          data.chatMessages.forEach((msg, index) => {
            if (captionsByMessage[index]) {
              const captions = captionsByMessage[index];
              // Sort by swipe index for consistent ordering
              captions.sort((a, b) => (a.swipeIndex || 0) - (b.swipeIndex || 0));

              let captionText = '\\n\\n[Attached Image(s) in this message:]';
              captions.forEach((item, i) => {
                captionText += '\\n[Image ' + (i + 1) + ']: ' + item.caption;
              });

              // Append captions to the message
              msg.message = msg.message + captionText;
              injectedCount++;
              console.log('[ImageGen] 💉 Injected ' + captions.length + ' caption(s) into message #' + index + ' (' + (msg.is_bot ? 'bot' : 'user') + ')');
            }
          });

          console.log('[ImageGen] ✅ Caption injection complete: ' + injectedCount + ' messages modified');
          return JSON.stringify(data);
        } catch (e) {
          console.error("[ImageGen] Failed to inject captions:", e);
          return payload;
        }
      }

      // Store original fetch
      const originalFetch = window.fetch;

      // Override fetch to intercept LLM requests
      window.fetch = async function(...args) {
        let [resource, config] = args;
        let url = typeof resource === 'string' ? resource : resource.url;
        let method = 'GET';
        let body = null;

        if (config) {
          method = config.method || 'GET';
          body = config.body;
        } else if (resource instanceof Request) {
          method = resource.method;
        }

        // Check if this is an LLM generation request
        const isLLMRequest = url.includes('generateAlpha') || url.includes('/messages');

        if (method.toUpperCase() === 'POST' && isLLMRequest && body) {
          try {
            // Request fresh caption data from Tampermonkey context
            const data = await requestCaptionData();

            if (data.enabled && data.history.length > 0) {
              console.log("[ImageGen] 🎯 Intercepted LLM request:", url);
              const modifiedBody = injectCaptionsIntoPayload(body, data.history);
              if (config) {
                config.body = modifiedBody;
              }
              // Return with modified config
              return originalFetch.call(this, resource, config);
            }
          } catch (e) {
            console.error("[ImageGen] Error in fetch interceptor:", e);
          }
        }

        return originalFetch.apply(this, args);
      };

      console.log("[ImageGen] 🔌 Page-context fetch interceptor installed for caption injection");
    }.toString()})();`;

    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }

  // Inject immediately
  injectFetchInterceptor();
  console.log("[ImageGen] 🔌 Fetch interceptor bridge installed");

  // ==========================================================
  // SECCIÓN 1. CSS DEL MENÚ - Glassmorphism Style
  // ==========================================================

  const IMAGEGEN_MENU_CSS = `
    /* === GLASSMORPHISM BASE VARIABLES === */
    .imagegen-modal-overlay {
      --glass-bg: rgba(0, 0, 0, 0.5);
      --glass-bg-light: rgba(30, 30, 36, 0.7);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-border-hover: rgba(128, 90, 213, 0.5);
      --accent-primary: rgba(128, 90, 213, 0.9);
      --accent-gradient: linear-gradient(135deg, rgba(128, 90, 213, 0.9), rgba(159, 122, 234, 0.8));
      --accent-glow: 0 0 15px rgba(128, 90, 213, 0.4);
      --accent-glow-strong: 0 0 20px rgba(128, 90, 213, 0.6), 0 0 40px rgba(128, 90, 213, 0.2);
      --text-primary: rgba(255, 255, 255, 0.95);
      --text-secondary: rgba(200, 200, 220, 0.8);
      --text-muted: rgba(160, 160, 180, 0.7);
      --blur-amount: 12px;
      --radius-sm: 8px;
      --radius-md: 15px;
      --radius-lg: 20px;
    }

    /* === MODAL OVERLAY === */
    .imagegen-modal-overlay {
      position: fixed; z-index: 21474836; inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex; align-items: center; justify-content: center;
      animation: imagegenFadeIn 0.2s ease-out;
    }
    @keyframes imagegenFadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes imagegenSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    /* === MODAL CONTAINER === */
    .imagegen-modal-container {
      background: var(--glass-bg);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-radius: var(--radius-lg);
      border: none;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      width: 700px; max-width: 95vw; min-height: 320px; max-height: 90vh; padding: 0;
      display: flex; flex-direction: column; font-family: 'Segoe UI', system-ui, sans-serif;
      animation: imagegenSlideUp 0.3s ease-out;
    }

    /* === HEADER === */
    .imagegen-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 28px 16px 28px;
      border-bottom: 1px solid var(--glass-border);
    }
    .imagegen-modal-title {
      font-size: 1.35rem; font-weight: 600;
      background: linear-gradient(135deg, rgba(200, 170, 255, 1) 0%, rgba(128, 90, 213, 1) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text; margin: 0;
      filter: drop-shadow(0 0 8px rgba(128, 90, 213, 0.4));
    }
    .imagegen-modal-close {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 1.2rem; cursor: pointer;
      padding: 8px; border-radius: var(--radius-sm);
      transition: all 0.2s ease;
      display: flex; align-items: center; justify-content: center;
    }

    /* === BODY === */
    .imagegen-modal-body {
      padding: 24px 28px; display: flex; flex-direction: column; gap: 18px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(128, 90, 213, 0.3) transparent;
      flex-grow: 1;
    }
    .imagegen-modal-body::-webkit-scrollbar { width: 6px; }
    .imagegen-modal-body::-webkit-scrollbar-track { background: transparent; }
    .imagegen-modal-body::-webkit-scrollbar-thumb { background: rgba(128, 90, 213, 0.3); border-radius: 3px; }
    .imagegen-modal-body::-webkit-scrollbar-thumb:hover { background: rgba(128, 90, 213, 0.5); }

    /* === EMPTY STATE === */
    .imagegen-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: var(--text-muted);
    }
    .imagegen-empty-state svg {
      width: 64px;
      height: 64px;
      margin-bottom: 20px;
      opacity: 0.5;
      stroke: var(--accent-primary);
    }
    .imagegen-empty-state h3 {
      font-size: 1.1rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin: 0 0 8px 0;
    }
    .imagegen-empty-state p {
      font-size: 0.9rem;
      margin: 0;
      max-width: 300px;
      line-height: 1.5;
    }

    /* === FOOTER === */
    .imagegen-modal-footer {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 18px 28px;
      border-top: 1px solid var(--glass-border);
      background: transparent;
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    }


/* === BUTTONS === */
    .imagegen-modal-btn {
      padding: 10px 28px; border-radius: var(--radius-sm); border: none;
      font-size: 0.95rem; font-weight: 600; cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .imagegen-modal-btn.cancel {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
    }
    .imagegen-modal-btn.save {
      background: var(--accent-gradient);
      color: #1a1a2e;
      box-shadow: var(--accent-glow);
    }
    .imagegen-modal-btn.cancel:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--glass-border-hover);
      color: var(--text-primary);
    }
    .imagegen-modal-btn.save:hover {
      box-shadow: var(--accent-glow-strong);
      transform: translateY(-1px);
    }

    /* === CHECKBOXES === */
    .imagegen-checkbox-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 8px; }
    .imagegen-checkbox-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.02);
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }
    .imagegen-checkbox-row:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--glass-border);
    }
    .imagegen-checkbox-row label { color: var(--text-secondary); font-size: 0.95rem; cursor: pointer; }
    .imagegen-checkbox-row input[type="checkbox"],
    .imagegen-checkbox {
      appearance: none; -webkit-appearance: none;
      width: 20px; height: 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(176, 196, 222, 0.3);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      flex-shrink: 0;
    }
    .imagegen-checkbox-row input[type="checkbox"]:checked,
    .imagegen-checkbox:checked {
      background: var(--accent-gradient);
      border-color: transparent;
      box-shadow: var(--accent-glow);
    }
    .imagegen-checkbox-row input[type="checkbox"]:checked::after,
    .imagegen-checkbox:checked::after {
      content: '✓';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      color: #1a1a2e;
      font-size: 12px;
      font-weight: bold;
    }

    /* === DROPDOWNS & SLIDERS === */
    .imagegen-dropdown-row { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
    .imagegen-dropdown-label { color: var(--text-secondary); font-size: 0.9rem; font-weight: 500; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
    .imagegen-dropdown { padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); background: rgba(255, 255, 255, 0.05); color: var(--text-primary); font-size: 0.95rem; min-width: 120px; margin-bottom: 2px; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(4px); }
    .imagegen-dropdown option { background: #1e1f28; color: var(--text-primary); }

    /* === TRIGGER WORDS TABLE === */
    .imagegen-trigger-table-container { display: flex; flex-direction: column; gap: 12px; }
    .imagegen-trigger-table { width: 100%; border-collapse: collapse; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--glass-border); }
    .imagegen-trigger-table th, .imagegen-trigger-table td { padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--glass-border); }
    .imagegen-trigger-table th { background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
    .imagegen-trigger-table td { background: rgba(255, 255, 255, 0.02); color: var(--text-primary); }
    .imagegen-trigger-delete-btn { background: rgba(248, 113, 113, 0.1); border: 1px solid rgba(248, 113, 113, 0.3); color: #f87171; padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem; min-width: 60px; text-align: center; }
    .imagegen-trigger-edit-btn { background: rgba(147, 197, 253, 0.1); border: 1px solid rgba(147, 197, 253, 0.3); color: #93c5fd; padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; margin-right: 6px; font-size: 0.8rem; min-width: 60px; text-align: center; }
    .imagegen-trigger-edit-btn:hover { background: rgba(147, 197, 253, 0.2); }
    .imagegen-trigger-delete-btn:hover { background: rgba(248, 113, 113, 0.2); }
    .imagegen-trigger-edit-input { padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid var(--accent-primary); background: rgba(255, 255, 255, 0.1); color: var(--text-primary); font-size: 0.9rem; width: 100%; }
    .imagegen-trigger-save-btn { background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); color: #4ade80; padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; margin-right: 6px; font-size: 0.8rem; min-width: 60px; text-align: center; }
    .imagegen-trigger-cancel-btn { background: rgba(156, 163, 175, 0.1); border: 1px solid rgba(156, 163, 175, 0.3); color: #9ca3af; padding: 4px 10px; border-radius: var(--radius-sm); cursor: pointer; font-size: 0.8rem; min-width: 60px; text-align: center; }
    .imagegen-trigger-add-row { display: flex; gap: 10px; }
    .imagegen-trigger-input { flex: 1; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
    .imagegen-trigger-add-btn { padding: 10px 20px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); background: rgba(74, 222, 128, 0.1); color: #4ade80; cursor: pointer; }
    .imagegen-trigger-info { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; padding: 10px 14px; background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-sm); border: 1px solid var(--glass-border); }

    /* === TEXTAREAS & INPUTS === */
    .imagegen-textarea-label { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 8px; }
    .imagegen-textarea, .imagegen-contextual-textarea { width: 100%; padding: 12px; font-size: 0.9rem; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--glass-border); border-radius: var(--radius-sm); color: var(--text-primary); resize: vertical; min-height: 60px; margin-top: 8px; font-family: inherit; box-sizing: border-box; }
    .imagegen-contextual-textarea { font-family: 'JetBrains Mono', 'Consolas', monospace; min-height: 150px; }

    /* === GENERATED IMAGES & HISTORY === */
    .imagegen-gallery-container {
      margin-top: 12px;
      position: relative;
      display: inline-block;
      max-width: 100%;
    }
    .imagegen-gallery-container:hover .imagegen-gallery-controls {
      opacity: 1;
    }
    .imagegen-generated-image {
      max-width: 100%;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      display: block;
    }
    .imagegen-generated-image.hidden {
      display: none;
    }
    .imagegen-gallery-controls {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 20px;
      opacity: 0;
      transition: opacity 0.25s ease;
      user-select: none;
    }
    .imagegen-gallery-arrow {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.9);
      font-size: 18px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.2s ease, color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .imagegen-gallery-arrow:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
    .imagegen-gallery-arrow:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .imagegen-gallery-arrow:disabled:hover {
      background: none;
    }
    .imagegen-gallery-counter {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.85rem;
      font-weight: 500;
      min-width: 40px;
      text-align: center;
    }
    .imagegen-image-wrapper {
      position: relative;
      display: inline-block;
    }
    .imagegen-image-wrapper.hidden {
      display: none;
    }
    .imagegen-image-wrapper:hover .imagegen-caption-btn,
    .imagegen-image-wrapper:hover .imagegen-visibility-btn {
      opacity: 1;
    }
    .imagegen-visibility-btn {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: none;
      border-radius: 6px;
      padding: 6px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease, background 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .imagegen-visibility-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    .imagegen-visibility-btn svg {
      width: 20px;
      height: 20px;
      stroke: rgba(255, 255, 255, 0.9);
    }
    .imagegen-visibility-btn.hidden-caption {
      opacity: 0.7;
    }
    .imagegen-visibility-btn.hidden-caption svg {
      stroke: rgba(255, 100, 100, 0.9);
    }
    .imagegen-caption-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: none;
      border-radius: 6px;
      padding: 6px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease, background 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .imagegen-caption-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }
    .imagegen-caption-btn svg {
      width: 20px;
      height: 20px;
      stroke: rgba(255, 255, 255, 0.9);
    }
    .imagegen-history-container { display: flex; flex-direction: column; gap: 12px; max-height: 400px; overflow-y: auto; }
    .imagegen-history-item { display: flex; gap: 12px; padding: 12px; background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-sm); border: 1px solid var(--glass-border); }
    .imagegen-history-thumb { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); cursor: pointer; }
    .imagegen-history-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .imagegen-history-meta { font-size: 0.85rem; color: var(--text-secondary); }
    .imagegen-history-meta span { color: var(--accent-primary); font-weight: 500; }
    .imagegen-history-time { font-size: 0.75rem; color: var(--text-muted); }
    .imagegen-history-actions { display: flex; gap: 8px; margin-top: auto; }
    .imagegen-history-btn { padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); background: rgba(255, 255, 255, 0.05); color: var(--text-secondary); font-size: 0.8rem; cursor: pointer; }
    .imagegen-placeholder-tag { display: inline-block; background: rgba(176, 196, 222, 0.15); border: 1px solid rgba(176, 196, 222, 0.3); border-radius: 4px; padding: 2px 8px; font-family: monospace; font-size: 0.8rem; color: var(--accent-primary); margin: 2px 4px 2px 0; }

    /* === HIDDEN FILE INPUT === */
    .imagegen-upload-input {
      display: none;
    }

    /* === CAPTION LOADING OVERLAY === */
    .imagegen-image-wrapper.caption-loading .imagegen-generated-image {
      filter: brightness(0.4);
    }
    .imagegen-caption-loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .imagegen-caption-loading-overlay svg {
      width: 48px;
      height: 48px;
      stroke: rgba(255, 255, 255, 0.9);
      animation: imagegen-spin 1s linear infinite;
    }
    @keyframes imagegen-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* === PROVIDER CARDS === */
    .imagegen-provider-list { display: flex; flex-direction: column; gap: 12px; }
    .imagegen-provider-card {
      display: flex; align-items: center; gap: 16px;
      padding: 16px; background: rgba(255, 255, 255, 0.02);
      border-radius: var(--radius-sm); border: 2px solid var(--glass-border);
      cursor: pointer; transition: all 0.2s ease;
    }
    .imagegen-provider-card:hover { background: rgba(255, 255, 255, 0.05); border-color: var(--glass-border-hover); }
    .imagegen-provider-card.selected { border-color: var(--accent-primary); background: rgba(176, 196, 222, 0.1); box-shadow: var(--accent-glow); }
    .imagegen-provider-icon { width: 48px; height: 48px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 24px; background: rgba(255, 255, 255, 0.05); }
    .imagegen-provider-info { flex: 1; }
    .imagegen-provider-name { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px; }
    .imagegen-provider-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }
    .imagegen-provider-badge { padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
    .imagegen-provider-badge.default { background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }
    .imagegen-provider-badge.coming { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
    .imagegen-provider-radio { appearance: none; width: 20px; height: 20px; border: 2px solid var(--glass-border); border-radius: 50%; transition: all 0.2s ease; flex-shrink: 0; }
    .imagegen-provider-radio:checked { border-color: var(--accent-primary); background: var(--accent-primary); box-shadow: inset 0 0 0 4px var(--glass-bg); }

    /* === SECTIONS === */
    .imagegen-settings-section { display: none; flex-direction: column; gap: 12px; }
    .imagegen-settings-section.active { display: flex; }
  `;

  if (!document.getElementById("imagegen-menu-style")) {
    const style = document.createElement("style");
    style.id = "imagegen-menu-style";
    style.textContent = IMAGEGEN_MENU_CSS;
    document.head.appendChild(style);
  }

  // ==========================================================
  // SECCIÓN 2. CREACIÓN DEL MENÚ
  // ==========================================================

  const MENU_SECTIONS = [
    { id: 'general', label: 'General' },
    { id: 'providers', label: 'Providers' },
    { id: 'triggerwords', label: 'Trigger Words' },
    { id: 'contextual', label: 'Contextual Image Generation' },
    { id: 'captioning', label: 'Image Captioning' },
    { id: 'history', label: 'Image History' },
    { id: 'test', label: 'Test' }
  ];

  function createImageGenMenu() {
    const settings = loadSettings();
    const overlay = document.createElement("div");
    overlay.className = "imagegen-modal-overlay";

    const container = document.createElement("div");
    container.className = "imagegen-modal-container";

    // Header
    const header = document.createElement("div");
    header.className = "imagegen-modal-header";
    const title = document.createElement("h2");
    title.className = "imagegen-modal-title";
    title.textContent = "Image Generation Settings";

    const closeBtn = document.createElement("button");
    closeBtn.className = "imagegen-modal-close";
    closeBtn.innerHTML = `✕`;
    closeBtn.onclick = () => overlay.remove();

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Body
    const mainBody = document.createElement("div");
    mainBody.className = "imagegen-modal-body";

    // Section Selector
    const sectionSelectorRow = document.createElement("div");
    sectionSelectorRow.className = "imagegen-dropdown-row imagegen-section-selector";
    const sectionLabel = document.createElement("label");
    sectionLabel.className = "imagegen-dropdown-label";
    sectionLabel.textContent = "Settings Section";
    const sectionSelect = document.createElement("select");
    sectionSelect.className = "imagegen-dropdown";

    MENU_SECTIONS.forEach(section => {
      const option = document.createElement("option");
      option.value = section.id;
      option.textContent = section.label;
      sectionSelect.appendChild(option);
    });

    sectionSelectorRow.appendChild(sectionLabel);
    sectionSelectorRow.appendChild(sectionSelect);
    mainBody.appendChild(sectionSelectorRow);

    // === GENERAL SECTION ===
    const generalSection = document.createElement("div");
    generalSection.className = "imagegen-settings-section active";
    generalSection.id = "imagegen-section-general";

    const createCheckbox = (id, label, checked) => {
        const row = document.createElement("div");
        row.className = "imagegen-checkbox-row";
        const cb = document.createElement("input");
        cb.type = "checkbox"; cb.id = id; cb.checked = checked;
        const lbl = document.createElement("label");
        lbl.htmlFor = id; lbl.textContent = label;
        row.appendChild(cb); row.appendChild(lbl);
        return { row, cb };
    };

    const enabledUI = createCheckbox("imagegen-enabled", "Enabled", settings.enabled);
    const userImagesUI = createCheckbox("imagegen-user-images", "Generate user images", settings.generateUserImages);
    const autoGenUI = createCheckbox("imagegen-auto-gen", "Auto Generation", settings.autoGeneration);

    // NEW LOCAL STORAGE OPTION
    const localStorageUI = createCheckbox("imagegen-local-storage", "Save Images Locally (Base64) - Fixes broken links", settings.useLocalStorage);

    // Edit before sending option
    const editBeforeSendingUI = createCheckbox("imagegen-edit-before-sending", "Edit prompt before sending", settings.editBeforeSending);


    generalSection.appendChild(enabledUI.row);
    generalSection.appendChild(userImagesUI.row);
    generalSection.appendChild(autoGenUI.row);
    generalSection.appendChild(localStorageUI.row); // Append new option
    generalSection.appendChild(editBeforeSendingUI.row); // Append edit before sending option
    mainBody.appendChild(generalSection);

    // === PROVIDERS SECTION ===
    const providersSection = document.createElement("div");
    providersSection.className = "imagegen-settings-section";
    providersSection.id = "imagegen-section-providers";

    const providerInfo = document.createElement("div");
    providerInfo.className = "imagegen-trigger-info";
    providerInfo.innerHTML = "Select the image generation provider to use. More providers coming soon!";
    providersSection.appendChild(providerInfo);

    const providerList = document.createElement("div");
    providerList.className = "imagegen-provider-list";

    // Provider definitions
    const PROVIDERS = [
        {
            id: 'gemini-remote',
            name: 'Gemini (Remote)',
            desc: 'Uses a Gemini browser tab for image generation. Requires gemini.google.com open in another tab.',
            icon: '✨',
            available: true,
            default: true
        },
        {
            id: 'placeholder-1',
            name: 'Coming Soon',
            desc: 'Additional image generation providers will be added in future updates.',
            icon: '🔜',
            available: false
        },
        {
            id: 'placeholder-2',
            name: 'Coming Soon',
            desc: 'Stay tuned for more provider options.',
            icon: '🔜',
            available: false
        },
        {
            id: 'placeholder-3',
            name: 'Coming Soon',
            desc: 'More providers coming soon!',
            icon: '🔜',
            available: false
        }
    ];

    let tempProvider = settings.provider || 'gemini-remote';

    PROVIDERS.forEach(provider => {
        const card = document.createElement("div");
        card.className = `imagegen-provider-card ${tempProvider === provider.id ? 'selected' : ''}`;
        card.dataset.providerId = provider.id;

        if (!provider.available) {
            card.style.opacity = '0.6';
            card.style.cursor = 'not-allowed';
        }

        card.innerHTML = `
            <div class="imagegen-provider-icon">${provider.icon}</div>
            <div class="imagegen-provider-info">
                <div class="imagegen-provider-name">${provider.name}</div>
                <div class="imagegen-provider-desc">${provider.desc}</div>
            </div>
            ${provider.default ? '<span class="imagegen-provider-badge default">Default</span>' : ''}
            ${!provider.available ? '<span class="imagegen-provider-badge coming">Coming Soon</span>' : ''}
        `;

        if (provider.available) {
            card.onclick = () => {
                tempProvider = provider.id;
                providerList.querySelectorAll('.imagegen-provider-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            };
        }

        providerList.appendChild(card);
    });

    providersSection.appendChild(providerList);
    mainBody.appendChild(providersSection);

    // === TRIGGER WORDS SECTION ===
    const triggerWordsSection = document.createElement("div");
    triggerWordsSection.className = "imagegen-settings-section";
    triggerWordsSection.id = "imagegen-section-triggerwords";

    const triggerInfo = document.createElement("div");
    triggerInfo.className = "imagegen-trigger-info";
    triggerInfo.innerHTML = "Add words/sentences to trigger auto-generation (case-insensitive).";
    triggerWordsSection.appendChild(triggerInfo);

    const triggerEnabledUI = createCheckbox("imagegen-trigger-enabled", "Enable trigger words filtering", settings.triggerWordsEnabled !== false);
    triggerWordsSection.appendChild(triggerEnabledUI.row);

    const tableContainer = document.createElement("div");
    tableContainer.className = "imagegen-trigger-table-container";
    const table = document.createElement("table");
    table.className = "imagegen-trigger-table";
    table.innerHTML = `<thead><tr><th style="width:60px;">#</th><th>Trigger</th><th style="width:100px;">Action</th></tr></thead><tbody id="imagegen-trigger-tbody"></tbody>`;

    let tempTriggerWords = [...(settings.triggerWords || [])];
    const tbody = table.querySelector('tbody');

    let editingIndex = -1; // Track which row is being edited

    function renderTriggerTable() {
        tbody.innerHTML = "";
        if (tempTriggerWords.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:20px; color:#888;">No triggers. Add one below.</td></tr>`;
        } else {
            tempTriggerWords.forEach((word, index) => {
                const row = document.createElement("tr");

                if (editingIndex === index) {
                    // Edit mode row
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td><input type="text" class="imagegen-trigger-edit-input" value="${word}" data-index="${index}"></td>
                        <td>
                            <button class="imagegen-trigger-save-btn" data-index="${index}">Save</button>
                            <button class="imagegen-trigger-cancel-btn" data-index="${index}">Cancel</button>
                        </td>
                    `;
                } else {
                    // Normal row
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${word}</td>
                        <td>
                            <button class="imagegen-trigger-edit-btn" data-index="${index}">Edit</button>
                            <button class="imagegen-trigger-delete-btn" data-index="${index}">Delete</button>
                        </td>
                    `;
                }
                tbody.appendChild(row);
            });

            // Edit button handlers
            tbody.querySelectorAll(".imagegen-trigger-edit-btn").forEach(btn => {
                btn.onclick = function() {
                    editingIndex = parseInt(this.dataset.index);
                    renderTriggerTable();
                    // Focus the input after render
                    const input = tbody.querySelector('.imagegen-trigger-edit-input');
                    if (input) { input.focus(); input.select(); }
                };
            });

            // Save button handlers
            tbody.querySelectorAll(".imagegen-trigger-save-btn").forEach(btn => {
                btn.onclick = function() {
                    const idx = parseInt(this.dataset.index);
                    const input = tbody.querySelector(`.imagegen-trigger-edit-input[data-index="${idx}"]`);
                    if (input && input.value.trim()) {
                        tempTriggerWords[idx] = input.value.trim();
                    }
                    editingIndex = -1;
                    renderTriggerTable();
                };
            });

            // Cancel button handlers
            tbody.querySelectorAll(".imagegen-trigger-cancel-btn").forEach(btn => {
                btn.onclick = function() {
                    editingIndex = -1;
                    renderTriggerTable();
                };
            });

            // Delete button handlers
            tbody.querySelectorAll(".imagegen-trigger-delete-btn").forEach(btn => {
                btn.onclick = function() {
                    tempTriggerWords.splice(parseInt(this.dataset.index), 1);
                    if (editingIndex >= tempTriggerWords.length) editingIndex = -1;
                    renderTriggerTable();
                };
            });

            // Handle Enter key in edit input
            const editInput = tbody.querySelector('.imagegen-trigger-edit-input');
            if (editInput) {
                editInput.onkeypress = function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const idx = parseInt(this.dataset.index);
                        if (this.value.trim()) {
                            tempTriggerWords[idx] = this.value.trim();
                        }
                        editingIndex = -1;
                        renderTriggerTable();
                    }
                };
                editInput.onkeydown = function(e) {
                    if (e.key === 'Escape') {
                        editingIndex = -1;
                        renderTriggerTable();
                    }
                };
            }
        }
    }
    tableContainer.appendChild(table);

    const addRow = document.createElement("div");
    addRow.className = "imagegen-trigger-add-row";
    const triggerInput = document.createElement("input");
    triggerInput.className = "imagegen-trigger-input";
    triggerInput.placeholder = "Enter trigger...";
    const addBtn = document.createElement("button");
    addBtn.className = "imagegen-trigger-add-btn";
    addBtn.textContent = "+ Add";

    const addTrigger = () => {
        const val = triggerInput.value.trim();
        if(val && !tempTriggerWords.includes(val)) {
            tempTriggerWords.push(val);
            triggerInput.value = "";
            renderTriggerTable();
        }
    };
    addBtn.onclick = addTrigger;
    triggerInput.onkeypress = (e) => { if(e.key === "Enter") { e.preventDefault(); addTrigger(); }};

    addRow.appendChild(triggerInput);
    addRow.appendChild(addBtn);
    tableContainer.appendChild(addRow);
    triggerWordsSection.appendChild(tableContainer);
    renderTriggerTable();
    mainBody.appendChild(triggerWordsSection);

    // === CONTEXTUAL SECTION ===
    const contextualSection = document.createElement("div");
    contextualSection.className = "imagegen-settings-section";
    contextualSection.id = "imagegen-section-contextual";

    const contextInfo = document.createElement("div");
    contextInfo.className = "imagegen-trigger-info";
    contextInfo.innerHTML = "Configure the prompt template sent to Gemini.<br>Use placeholder tags.";
    contextualSection.appendChild(contextInfo);

    const promptLabel = document.createElement("label");
    promptLabel.className = "imagegen-textarea-label";
    promptLabel.textContent = "Prompt Template:";
    contextualSection.appendChild(promptLabel);

    const contextualPromptTextarea = document.createElement("textarea");
    contextualPromptTextarea.className = "imagegen-contextual-textarea";
    contextualPromptTextarea.value = settings.contextualPrompt || DEFAULT_SETTINGS.contextualPrompt;
    contextualSection.appendChild(contextualPromptTextarea);

    const placeholderList = document.createElement("div");
    placeholderList.innerHTML = `<span class="imagegen-placeholder-tag">{{previousMsg}}</span> <span class="imagegen-placeholder-tag">{{presentMsg}}</span>`;
    contextualSection.appendChild(placeholderList);
    mainBody.appendChild(contextualSection);

    // === IMAGE CAPTIONING SECTION ===
    const captioningSection = document.createElement("div");
    captioningSection.className = "imagegen-settings-section";
    captioningSection.id = "imagegen-section-captioning";

    const captioningInfo = document.createElement("div");
    captioningInfo.className = "imagegen-trigger-info";
    captioningInfo.innerHTML = "Configure automatic image captioning. Captions are generated using AI when images are created and stored in history.";
    captioningSection.appendChild(captioningInfo);

    // Provider selection for captioning
    const captioningProviderRow = document.createElement("div");
    captioningProviderRow.className = "imagegen-dropdown-row";
    const captioningProviderLabel = document.createElement("label");
    captioningProviderLabel.className = "imagegen-dropdown-label";
    captioningProviderLabel.textContent = "Captioning Provider";
    const captioningProviderSelect = document.createElement("select");
    captioningProviderSelect.className = "imagegen-dropdown";
    captioningProviderSelect.id = "imagegen-captioning-provider";

    const CAPTIONING_PROVIDERS = [
        { id: 'gemini-api', name: 'Gemini API' }
    ];

    CAPTIONING_PROVIDERS.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        opt.selected = settings.captioningProvider === p.id;
        captioningProviderSelect.appendChild(opt);
    });

    captioningProviderRow.appendChild(captioningProviderLabel);
    captioningProviderRow.appendChild(captioningProviderSelect);
    captioningSection.appendChild(captioningProviderRow);

    // API Key input
    const apiKeyRow = document.createElement("div");
    apiKeyRow.className = "imagegen-dropdown-row";
    const apiKeyLabel = document.createElement("label");
    apiKeyLabel.className = "imagegen-dropdown-label";
    apiKeyLabel.textContent = "Gemini API Key";
    const apiKeyInput = document.createElement("input");
    apiKeyInput.type = "password";
    apiKeyInput.className = "imagegen-trigger-input";
    apiKeyInput.id = "imagegen-captioning-api-key";
    apiKeyInput.placeholder = "Enter your Gemini API key...";
    apiKeyInput.value = settings.captioningApiKey || '';
    apiKeyInput.style.width = "100%";

    const apiKeyToggle = document.createElement("button");
    apiKeyToggle.type = "button";
    apiKeyToggle.className = "imagegen-history-btn";
    apiKeyToggle.style.marginTop = "8px";
    apiKeyToggle.textContent = "Show Key";
    apiKeyToggle.onclick = () => {
        if (apiKeyInput.type === "password") {
            apiKeyInput.type = "text";
            apiKeyToggle.textContent = "Hide Key";
        } else {
            apiKeyInput.type = "password";
            apiKeyToggle.textContent = "Show Key";
        }
    };

    const apiKeyHelp = document.createElement("div");
    apiKeyHelp.style.cssText = "font-size:0.8rem; color:var(--text-muted); margin-top:6px;";
    apiKeyHelp.innerHTML = 'Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--accent-primary);">Google AI Studio</a>';

    apiKeyRow.appendChild(apiKeyLabel);
    apiKeyRow.appendChild(apiKeyInput);
    apiKeyRow.appendChild(apiKeyToggle);
    apiKeyRow.appendChild(apiKeyHelp);
    captioningSection.appendChild(apiKeyRow);

    // Model selection
    const modelRow = document.createElement("div");
    modelRow.className = "imagegen-dropdown-row";
    const modelLabel = document.createElement("label");
    modelLabel.className = "imagegen-dropdown-label";
    modelLabel.textContent = "Captioning Model";
    const modelSelect = document.createElement("select");
    modelSelect.className = "imagegen-dropdown";
    modelSelect.id = "imagegen-captioning-model";

    const GEMINI_MODELS = [
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Recommended)' },
        { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite (Faster)' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Best Quality)' },
        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
        { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro' }
    ];

    GEMINI_MODELS.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.name;
        opt.selected = settings.captioningModel === m.id;
        modelSelect.appendChild(opt);
    });

    modelRow.appendChild(modelLabel);
    modelRow.appendChild(modelSelect);
    captioningSection.appendChild(modelRow);

    // Captioning prompt
    const captioningPromptLabel = document.createElement("label");
    captioningPromptLabel.className = "imagegen-textarea-label";
    captioningPromptLabel.textContent = "Captioning Prompt:";
    captioningSection.appendChild(captioningPromptLabel);

    const captioningPromptTextarea = document.createElement("textarea");
    captioningPromptTextarea.className = "imagegen-contextual-textarea";
    captioningPromptTextarea.id = "imagegen-captioning-prompt";
    captioningPromptTextarea.value = settings.captioningPrompt || DEFAULT_SETTINGS.captioningPrompt;
    captioningPromptTextarea.style.minHeight = "100px";
    captioningSection.appendChild(captioningPromptTextarea);

    // Edit caption before saving checkbox
    const editCaptionUI = createCheckbox("imagegen-edit-caption", "Edit caption before saving", settings.editCaptionBeforeSaving === true);
    editCaptionUI.row.style.marginTop = "12px";
    captioningSection.appendChild(editCaptionUI.row);



    // Test captioning button
    const testCaptioningBtn = document.createElement("button");
    testCaptioningBtn.className = "imagegen-modal-btn cancel";
    testCaptioningBtn.style.marginTop = "12px";
    testCaptioningBtn.textContent = "Test API Connection";
    testCaptioningBtn.onclick = async () => {
        const apiKey = apiKeyInput.value.trim();
        const model = modelSelect.value;
        if (!apiKey) {
            alert("Please enter an API key first.");
            return;
        }
        testCaptioningBtn.textContent = "Testing...";
        testCaptioningBtn.disabled = true;
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Say 'API connection successful!' in exactly those words." }] }]
                })
            });
            const data = await response.json();
            if (data.error) {
                alert(`API Error: ${data.error.message}`);
            } else if (data.candidates && data.candidates[0]) {
                alert("✅ API connection successful! Your API key is working.");
            } else {
                alert("Unexpected response from API. Please check your key.");
            }
        } catch (e) {
            alert(`Connection failed: ${e.message}`);
        }
        testCaptioningBtn.textContent = "Test API Connection";
        testCaptioningBtn.disabled = false;
    };
    captioningSection.appendChild(testCaptioningBtn);

    mainBody.appendChild(captioningSection);

    // === HISTORY SECTION ===
    const historySection = document.createElement("div");
    historySection.className = "imagegen-settings-section";
    historySection.id = "imagegen-section-history";

    const charNameDisplay = document.createElement("div");
    charNameDisplay.className = "imagegen-trigger-info";
    charNameDisplay.innerHTML = `<strong>Current Character:</strong> <span style="color:var(--accent-primary);">${getCurrentCharacterName()}</span>`;
    historySection.appendChild(charNameDisplay);

    const loadHistoryUI = createCheckbox("imagegen-load-history", "Re-inject images on page load", settings.loadHistoryOnPageLoad !== false);
    historySection.appendChild(loadHistoryUI.row);

    const historyContainer = document.createElement("div");
    historyContainer.className = "imagegen-history-container";

    let editingCaptionId = null;

    function renderImageHistory() {
        historyContainer.innerHTML = "";
        const history = loadImageHistory();
        if(history.length === 0) {
            historyContainer.innerHTML = `<div class="imagegen-empty-state"><p>No images generated yet.</p></div>`;
            return;
        }
        [...history].reverse().forEach(item => {
            const el = document.createElement("div");
            el.className = "imagegen-history-item";
            el.style.flexDirection = "column";
            // Check if it's base64 (data:image) or a link
            const isDataUrl = item.imageUrl.startsWith("data:");
            const displayUrl = isDataUrl ? item.imageUrl : item.imageUrl;
            const isEditingCaption = editingCaptionId === item.id;
            const captionText = item.caption || '';

            el.innerHTML = `
                <div style="display:flex; gap:12px; width:100%;">
                    <img src="${displayUrl}" class="imagegen-history-thumb" onclick="const w=window.open(); w.document.write('<img src=\\'${displayUrl}\\' style=\\'max-width:100%\\'>');">
                    <div class="imagegen-history-info">
                        <div class="imagegen-history-meta">Msg: <span>${item.messageIndex}</span> | Swipe: <span>${item.swipeIndex + 1}</span></div>
                        <div class="imagegen-history-time">${new Date(item.timestamp).toLocaleString()}</div>
                        <div class="imagegen-history-actions">
                            ${isDataUrl ? '<span style="font-size:0.8rem; color:#4ade80; border:1px solid #4ade80; padding:2px 6px; border-radius:4px;">Local</span>' : `<button class="imagegen-history-btn" onclick="navigator.clipboard.writeText('${item.imageUrl}')">Copy URL</button>`}
                            <button class="imagegen-history-btn" style="color:#f87171; border-color:rgba(248,113,113,0.3);" id="del-${item.id}">Delete</button>
                        </div>
                    </div>
                </div>
                <div class="imagegen-caption-section" style="margin-top:10px; padding-top:10px; border-top:1px solid var(--glass-border); width:100%;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                        <span style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Caption</span>
                    </div>
                    ${isEditingCaption ? `
                        <input type="text" class="imagegen-trigger-edit-input imagegen-caption-edit-input" value="${captionText.replace(/"/g, '&quot;')}" style="margin-bottom:8px;" />
                        <div style="display:flex; gap:6px;">
                            <button class="imagegen-trigger-save-btn imagegen-caption-save-btn" data-id="${item.id}">Save</button>
                            <button class="imagegen-trigger-cancel-btn imagegen-caption-cancel-btn">Cancel</button>
                        </div>
                    ` : `
                        <div style="display:flex; align-items:flex-start; gap:8px;">
                            <p style="flex:1; font-size:0.85rem; color:var(--text-secondary); margin:0; font-style:${captionText ? 'normal' : 'italic'}; opacity:${captionText ? '1' : '0.6'};">${captionText || 'No caption'}</p>
                            <button class="imagegen-trigger-edit-btn imagegen-caption-edit-btn" data-id="${item.id}" style="flex-shrink:0;">Edit</button>
                            ${captionText ? `<button class="imagegen-trigger-delete-btn imagegen-caption-delete-btn" data-id="${item.id}" style="flex-shrink:0;">Clear</button>` : ''}
                        </div>
                    `}
                </div>
            `;
            el.querySelector(`#del-${item.id}`).onclick = () => {
                removeFromImageHistory(item.id);
                renderImageHistory();
                refreshImagesFromHistory(); // Refresh the chat bubbles to remove deleted image
            };

            // Caption edit button
            const editCaptionBtn = el.querySelector('.imagegen-caption-edit-btn');
            if (editCaptionBtn) {
                editCaptionBtn.onclick = () => {
                    editingCaptionId = item.id;
                    renderImageHistory();
                };
            }

            // Caption save button
            const saveCaptionBtn = el.querySelector('.imagegen-caption-save-btn');
            if (saveCaptionBtn) {
                saveCaptionBtn.onclick = () => {
                    const input = el.querySelector('.imagegen-caption-edit-input');
                    if (input) {
                        updateImageCaption(item.id, input.value.trim());
                        editingCaptionId = null;
                        renderImageHistory();
                    }
                };
            }

            // Caption cancel button
            const cancelCaptionBtn = el.querySelector('.imagegen-caption-cancel-btn');
            if (cancelCaptionBtn) {
                cancelCaptionBtn.onclick = () => {
                    editingCaptionId = null;
                    renderImageHistory();
                };
            }

            // Caption delete/clear button
            const deleteCaptionBtn = el.querySelector('.imagegen-caption-delete-btn');
            if (deleteCaptionBtn) {
                deleteCaptionBtn.onclick = () => {
                    updateImageCaption(item.id, '');
                    renderImageHistory();
                };
            }

            // Handle Enter key in caption edit input
            const captionInput = el.querySelector('.imagegen-caption-edit-input');
            if (captionInput) {
                captionInput.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        updateImageCaption(item.id, captionInput.value.trim());
                        editingCaptionId = null;
                        renderImageHistory();
                    } else if (e.key === 'Escape') {
                        editingCaptionId = null;
                        renderImageHistory();
                    }
                };
                // Auto focus
                setTimeout(() => captionInput.focus(), 0);
            }

            historyContainer.appendChild(el);
        });
    }
    historySection.appendChild(historyContainer);
    renderImageHistory();

    const clearBtn = document.createElement("button");
    clearBtn.className = "imagegen-modal-btn cancel";
    clearBtn.style.color = "#f87171"; clearBtn.style.borderColor = "#f87171"; clearBtn.textContent = "Clear All History";
    clearBtn.onclick = () => { if(confirm("Clear all history?")) { clearImageHistory(); renderImageHistory(); }};
    historySection.appendChild(clearBtn);
    mainBody.appendChild(historySection);

    // === TEST SECTION ===
    const testSection = document.createElement("div");
    testSection.className = "imagegen-settings-section";
    testSection.id = "imagegen-section-test";

    const testModeUI = createCheckbox("imagegen-test-mode", "Enable test mode (Inject specific URL)", settings.testMode === true);
    testSection.appendChild(testModeUI.row);

    const urlLabel = document.createElement("label");
    urlLabel.className = "imagegen-textarea-label";
    urlLabel.textContent = "Test Image URL:";
    testSection.appendChild(urlLabel);

    const imageUrlTextarea = document.createElement("textarea");
    imageUrlTextarea.className = "imagegen-textarea";
    imageUrlTextarea.value = settings.testImageUrl || "";
    testSection.appendChild(imageUrlTextarea);
    mainBody.appendChild(testSection);

    // Logic
    sectionSelect.onchange = function() {
        mainBody.querySelectorAll(".imagegen-settings-section").forEach(sec => sec.classList.remove("active"));
        document.getElementById(`imagegen-section-${this.value}`).classList.add("active");
    };

    // Footer
    const footer = document.createElement("div");
    footer.className = "imagegen-modal-footer";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "imagegen-modal-btn cancel";
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => overlay.remove();

    const saveBtn = document.createElement("button");
    saveBtn.className = "imagegen-modal-btn save";
    saveBtn.textContent = "Save Settings";
    saveBtn.onclick = () => {
        const newSettings = {
            enabled: enabledUI.cb.checked,
            generateUserImages: userImagesUI.cb.checked,
            autoGeneration: autoGenUI.cb.checked,
            useLocalStorage: localStorageUI.cb.checked,
            editBeforeSending: editBeforeSendingUI.cb.checked,
            provider: tempProvider,
            triggerWords: tempTriggerWords,
            triggerWordsEnabled: triggerEnabledUI.cb.checked,
            testMode: testModeUI.cb.checked,
            testImageUrl: imageUrlTextarea.value.trim(),
            contextualPrompt: contextualPromptTextarea.value,
            loadHistoryOnPageLoad: loadHistoryUI.cb.checked,
            // Captioning settings (captioningEnabled and injectCaptionsToLLM are always true)
            captioningEnabled: true,
            captioningProvider: captioningProviderSelect.value,
            captioningApiKey: apiKeyInput.value.trim(),
            captioningModel: modelSelect.value,
            captioningPrompt: captioningPromptTextarea.value,
            editCaptionBeforeSaving: editCaptionUI.cb.checked,
            injectCaptionsToLLM: true
        };
        saveSettings(newSettings);
        currentSettings = newSettings;
        updateImageGenButtonsVisibility();
        overlay.remove();
        console.log("[ImageGen] Settings saved:", newSettings);
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);
    container.appendChild(header);
    container.appendChild(mainBody);
    container.appendChild(footer);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }

  // ==========================================================
  // SECCIÓN 3. INYECCIÓN EN EL MENÚ DE LA APP
  // ==========================================================

  const MENU_LIST_SELECTOR = '[class^="_menuList_"]';
  const MENU_ITEM_CLASS = '[class^="_menuItem_"]';
  const IMAGEGEN_BUTTON_ID = 'imagegen-menu-item';

  const bodyObserver = new MutationObserver(() => injectImageGenMenuItem());
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  function injectImageGenMenuItem() {
    const menuList = document.querySelector(MENU_LIST_SELECTOR);
    if (!menuList) return;
    if (menuList.querySelector(`#${IMAGEGEN_BUTTON_ID}`)) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    // Attempt to copy class from existing menu item for consistency
    const firstMenuItem = menuList.querySelector(MENU_ITEM_CLASS);
    btn.className = firstMenuItem ? firstMenuItem.className : '';
    btn.id = IMAGEGEN_BUTTON_ID;
    btn.innerHTML = `
      <span class="_menuItemIcon_1fzcr_81"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></span>
      <span class="_menuItemContent_1fzcr_96">Image Generation</span>
    `;

    btn.onclick = createImageGenMenu;

    // Insertion logic: Insert after TTS button if present, otherwise after "Generation Settings"
    const menuItems = Array.from(menuList.querySelectorAll(MENU_ITEM_CLASS));
    let inserted = false;

    // First, try to insert after TTS button if it exists
    const ttsButton = menuList.querySelector('#tts-menu-item');
    if (ttsButton) {
      if (ttsButton.nextSibling) {
        menuList.insertBefore(btn, ttsButton.nextSibling);
      } else {
        menuList.appendChild(btn);
      }
      inserted = true;
    }

    // If TTS button not found, insert after "Generation Settings"
    if (!inserted) {
      for (let i = 0; i < menuItems.length; i++) {
        const span = menuItems[i].querySelector('span[class*="_menuItemContent_"]');
        if (span && span.textContent.trim() === "Generation Settings") {
          if (menuItems[i].nextSibling) {
            menuList.insertBefore(btn, menuItems[i].nextSibling);
          } else {
            menuList.appendChild(btn);
          }
          inserted = true;
          break;
        }
      }
    }

    // Fallback: append to end if nothing else worked
    if (!inserted) menuList.appendChild(btn);
  }


// ==========================================================
  // SECCIÓN 4. MESSAGE DETECTION & GEMINI BRIDGE
  // ==========================================================

  // Selectors
  const CHAT_CONTAINER_SELECTOR = '[class^="_messagesMain_"]';
  const MESSAGE_CONTAINER_SELECTOR = '[data-testid="virtuoso-item-list"] > div[data-index]';
  const LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR = '[class^="_botChoicesContainer_"]';
  const SWIPE_SLIDER_SELECTOR = '[class^="_botChoicesSlider_"]';
  const EDIT_PANEL_SELECTOR = '[class^="_editPanel_"]';
  const CONTROL_PANEL_SELECTOR = '[class^="_controlPanel_"]';
  const BOT_NAME_ICON_SELECTOR = '[class^="_nameIcon_"]';
  const MESSAGE_WRAPPER_SELECTOR = 'li[class^="_messageDisplayWrapper_"]';
  const MESSAGE_BODY_SELECTOR = '[class^="_messageBody_"]';

  // ==========================================================
  // EDIT MODE DETECTION - Hide gallery when message is being edited
  // ==========================================================

  // Track which messages are currently being edited
  const messagesInEditMode = new Set();

  function hideGalleryForEditMode(messageWrapper) {
    const gallery = messageWrapper.querySelector('.imagegen-gallery-container');
    if (gallery) {
      gallery.dataset.hiddenForEdit = 'true';
      gallery.style.display = 'none';
      console.log('[ImageGen] 🙈 Gallery hidden for edit mode');
    }
  }

  function restoreGalleryAfterEdit(messageWrapper, messageIndex) {
    // Remove the old gallery completely
    const oldGallery = messageWrapper.querySelector('.imagegen-gallery-container');
    if (oldGallery) {
      oldGallery.remove();
      console.log('[ImageGen] 🗑️ Old gallery removed for re-injection');
    }

    // Wait for DOM to settle, then reinject from history
    setTimeout(() => {
      reinjectImagesFromHistory();
      console.log('[ImageGen] 👁️ Gallery re-injected after edit for message', messageIndex);
    }, 150);
  }

  function checkEditModeForAllMessages() {
    const allMessageWrappers = document.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);

    allMessageWrappers.forEach(wrapper => {
      const messageIndex = wrapper.closest('[data-index]')?.dataset?.index;
      if (!messageIndex) return;

      const editPanel = wrapper.querySelector(EDIT_PANEL_SELECTOR);
      const isEditing = !!editPanel;
      const wasEditing = messagesInEditMode.has(messageIndex);

      if (isEditing && !wasEditing) {
        // Message just entered edit mode
        messagesInEditMode.add(messageIndex);
        hideGalleryForEditMode(wrapper);
      } else if (!isEditing && wasEditing) {
        // Message just exited edit mode
        messagesInEditMode.delete(messageIndex);
        restoreGalleryAfterEdit(wrapper, messageIndex);
      }
    });
  }

  // Initialize edit mode observer
  function initializeEditModeObserver() {
    const chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);
    if (!chatContainer) {
      setTimeout(initializeEditModeObserver, 1000);
      return;
    }

    const editModeObserver = new MutationObserver((mutations) => {
      // Debounce the check to avoid excessive processing
      clearTimeout(window.imageGenEditModeTimeout);
      window.imageGenEditModeTimeout = setTimeout(checkEditModeForAllMessages, 50);
    });

    editModeObserver.observe(chatContainer, { childList: true, subtree: true });
    console.log('[ImageGen] 📝 Edit mode observer initialized');
  }

  // ==========================================================
  // PRE-ATTACH IMAGE - Attach image before sending a message
  // ==========================================================

  let pendingAttachImages = []; // Array of { base64: string, caption: string, visible: boolean, id: string }
  let isProcessingPendingAttach = false;
  let activeAttachButton = null; // Reference to the currently active attach button
  let captionsInProgress = 0; // Track how many captions are being generated

  // Generate unique ID for each pending image
  function generateImageId() {
    return 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // CSS for the attach button in popover and preview panel
  const ATTACH_BUTTON_CSS = `
    .imagegen-attach-btn {
                width: 100%;
                display: flex;
                border: 0;
                background: transparent;
                padding: .5rem;
                margin: 0;
                font-family: Jura,sans-serif;
                font-weight: 700;
                color: #ffffffe6;
                cursor: pointer;
                border-radius: 6px;
                font-size: .875rem;
                transition: background-color .2s ease;
    }
    .imagegen-attach-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .imagegen-attach-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .imagegen-attach-btn svg {
      width: 1em;
      height: 1em;
      flex-shrink: 0;
    }
    .imagegen-attach-btn.has-image {
      color: #4ade80;
    }

    /* Shared wrapper for all attach preview panels (coordinates with QoL script) */
    .zephyr-attach-panels-wrapper {
      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 8px;
      pointer-events: none;
    }
    .zephyr-attach-panels-wrapper > * {
      pointer-events: auto;
    }

    /* Preview Panel Styles - stacks with other attach panels via shared wrapper */
    .imagegen-preview-panel {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(30, 30, 40, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.3) transparent;
      box-sizing: border-box;
    }
    .imagegen-preview-panel::-webkit-scrollbar {
      height: 6px;
    }
    .imagegen-preview-panel::-webkit-scrollbar-track {
      background: transparent;
    }
    .imagegen-preview-panel::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
    }
    .imagegen-preview-item {
      position: relative;
      flex-shrink: 0;
      width: 64px;
      height: 64px;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid transparent;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
    .imagegen-preview-item:hover {
      border-color: rgba(255, 255, 255, 0.4);
      transform: scale(1.05);
    }
    .imagegen-preview-item.generating {
      border-color: rgba(176, 196, 222, 0.6);
      animation: imagegenPreviewPulse 1.5s ease-in-out infinite;
    }
    @keyframes imagegenPreviewPulse {
      0%, 100% { box-shadow: 0 0 5px rgba(176, 196, 222, 0.3); }
      50% { box-shadow: 0 0 15px rgba(176, 196, 222, 0.6); }
    }
    .imagegen-preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .imagegen-preview-delete {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 20px;
      height: 20px;
      background: rgba(0, 0, 0, 0.7);
      border: none;
      border-radius: 50%;
      color: #fff;
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease, background 0.2s ease;
    }
    .imagegen-preview-item:hover .imagegen-preview-delete {
      opacity: 1;
    }
    .imagegen-preview-delete:hover {
      background: rgba(239, 68, 68, 0.8);
    }
    .imagegen-preview-add {
      flex-shrink: 0;
      width: 64px;
      height: 64px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 2px dashed rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.5);
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }
    .imagegen-preview-add:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.4);
      color: rgba(255, 255, 255, 0.8);
    }
    .imagegen-preview-add:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      cursor: not-allowed;
    }
    .imagegen-attach-btn.generating-caption {
      animation: imagegenAttachGlow 1.5s ease-in-out infinite;
    }
    @keyframes imagegenAttachGlow {
      0%, 100% {
        box-shadow: 0 0 5px rgba(176, 196, 222, 0.3);
        background: rgba(176, 196, 222, 0.1);
      }
      50% {
        box-shadow: 0 0 20px rgba(176, 196, 222, 0.6), 0 0 30px rgba(176, 196, 222, 0.4);
        background: rgba(176, 196, 222, 0.25);
      }
    }

    /* Screenshare button styles */
    .imagegen-screenshare-btn {
      width: 100%;
      display: flex;
      border: 0;
      background: transparent;
      padding: .5rem;
      margin: 0;
      font-family: Jura,sans-serif;
      font-weight: 700;
      color: #ffffffe6;
      cursor: pointer;
      border-radius: 6px;
      font-size: .875rem;
      transition: background-color .2s ease;
    }
    .imagegen-screenshare-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .imagegen-screenshare-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .imagegen-screenshare-btn.active {
      color: #f87171;
      background: rgba(248, 113, 113, 0.1);
      animation: imagegenScreenshareActive 2s ease-in-out infinite;
    }
    @keyframes imagegenScreenshareActive {
      0%, 100% {
        box-shadow: 0 0 5px rgba(248, 113, 113, 0.3);
      }
      50% {
        box-shadow: 0 0 12px rgba(248, 113, 113, 0.5);
      }
    }
    .imagegen-screenshare-btn.capturing {
      animation: imagegenScreensharePulse 1s ease-in-out infinite;
    }
    @keyframes imagegenScreensharePulse {
      0%, 100% {
        box-shadow: 0 0 5px rgba(96, 165, 250, 0.3);
        background: rgba(96, 165, 250, 0.1);
      }
      50% {
        box-shadow: 0 0 15px rgba(96, 165, 250, 0.6);
        background: rgba(96, 165, 250, 0.25);
      }
    }

  `;

  // Inject attach button CSS
  if (!document.getElementById("imagegen-attach-style")) {
    const style = document.createElement("style");
    style.id = "imagegen-attach-style";
    style.textContent = ATTACH_BUTTON_CSS;
    document.head.appendChild(style);
  }

  function setAttachButtonGlowing(isGlowing) {
    if (activeAttachButton) {
      if (isGlowing) {
        activeAttachButton.classList.add('generating-caption');
      } else {
        activeAttachButton.classList.remove('generating-caption');
      }
    }
  }

  function updateAttachButtonState() {
    if (activeAttachButton) {
      if (pendingAttachImages.length > 0) {
        activeAttachButton.classList.add('has-image');
        activeAttachButton.textContent = `✓ ${pendingAttachImages.length} image${pendingAttachImages.length > 1 ? 's' : ''}`;
      } else {
        activeAttachButton.classList.remove('has-image');
        activeAttachButton.textContent = 'Attach img';
      }
    }
    // Update preview panel
    updatePreviewPanel();
  }

  function clearPendingAttachImages() {
    pendingAttachImages = [];
    captionsInProgress = 0;
    setAttachButtonGlowing(false);
    setSendButtonDisabled(false);
    updateAttachButtonState();
    removePreviewPanel();
    console.log('[ImageGen] 📎 All pending attach images cleared');
  }

  function removePendingImage(imageId) {
    const index = pendingAttachImages.findIndex(img => img.id === imageId);
    if (index !== -1) {
      pendingAttachImages.splice(index, 1);
      console.log(`[ImageGen] 📎 Removed pending image: ${imageId}`);
      updateAttachButtonState();

      // If no more images, remove the panel
      if (pendingAttachImages.length === 0) {
        removePreviewPanel();
      }
    }
  }

  // Preview Panel Functions
  function getOrCreateSharedWrapper() {
    let wrapper = document.querySelector('.zephyr-attach-panels-wrapper');
    if (wrapper) return wrapper;

    // Find the chat input inner container
    const chatInputInner = document.querySelector('[class*="_chatInputInner_"]');
    if (!chatInputInner) return null;

    // Ensure chatInputInner has position relative for absolute positioning of wrapper
    if (getComputedStyle(chatInputInner).position === 'static') {
      chatInputInner.style.position = 'relative';
    }

    // Create the shared wrapper
    wrapper = document.createElement('div');
    wrapper.className = 'zephyr-attach-panels-wrapper';
    chatInputInner.insertBefore(wrapper, chatInputInner.firstChild);

    // Dispatch event to notify other scripts
    window.dispatchEvent(new CustomEvent('zephyr-attach-wrapper-created'));

    return wrapper;
  }

  function getOrCreatePreviewPanel() {
    let panel = document.querySelector('.imagegen-preview-panel');
    if (panel) return panel;

    const wrapper = getOrCreateSharedWrapper();
    if (!wrapper) return null;

    // Create the preview panel
    panel = document.createElement('div');
    panel.className = 'imagegen-preview-panel';

    // Append at end so image panel is below web search panel
    wrapper.appendChild(panel);

    return panel;
  }

  function removePreviewPanel() {
    const panel = document.querySelector('.imagegen-preview-panel');
    if (panel) {
      panel.remove();
    }

    // Clean up shared wrapper if empty
    const wrapper = document.querySelector('.zephyr-attach-panels-wrapper');
    if (wrapper && wrapper.children.length === 0) {
      wrapper.remove();
    }
  }

  function updatePreviewPanel() {
    if (pendingAttachImages.length === 0) {
      removePreviewPanel();
      return;
    }

    const panel = getOrCreatePreviewPanel();
    if (!panel) return;

    // Clear existing content
    panel.innerHTML = '';

    // Add each image preview
    pendingAttachImages.forEach((imgData) => {
      const item = document.createElement('div');
      item.className = 'imagegen-preview-item' + (imgData.generating ? ' generating' : '');
      item.dataset.imageId = imgData.id;

      const img = document.createElement('img');
      img.src = imgData.base64;
      img.alt = 'Pending attachment';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'imagegen-preview-delete';
      deleteBtn.innerHTML = '×';
      deleteBtn.title = 'Remove image';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        removePendingImage(imgData.id);
      };

      item.appendChild(img);
      item.appendChild(deleteBtn);
      panel.appendChild(item);
    });

    // Add the "+" button to add more images
    const addBtn = document.createElement('button');
    addBtn.className = 'imagegen-preview-add';
    addBtn.innerHTML = '+';
    addBtn.title = 'Add another image';
    addBtn.disabled = captionsInProgress > 0;

    // Hidden file input for adding more
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      addBtn.disabled = true;

      try {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const base64Data = ev.target.result;
          await addPendingAttachImage(base64Data, activeAttachButton);
          addBtn.disabled = captionsInProgress > 0;
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('[ImageGen] Failed to process additional attachment:', err);
        addBtn.disabled = captionsInProgress > 0;
      }

      fileInput.value = '';
    };

    addBtn.onclick = () => fileInput.click();
    addBtn.appendChild(fileInput);
    panel.appendChild(addBtn);
  }

  async function addPendingAttachImage(base64Data, attachBtn) {
    const settings = loadSettings();
    const imageId = generateImageId();

    // Store button reference for glow updates
    activeAttachButton = attachBtn;

    const newImage = {
      id: imageId,
      base64: base64Data,
      caption: '',
      visible: true, // Default to visible, respecting injectCaptionsToLLM setting when saving
      generating: false
    };

    pendingAttachImages.push(newImage);
    updateAttachButtonState();
    console.log(`[ImageGen] 📎 Image staged for attachment (${pendingAttachImages.length} total)`);

    // Generate caption if enabled
    if (settings.captioningEnabled && settings.captioningApiKey) {
      // Mark as generating and update UI
      newImage.generating = true;
      captionsInProgress++;
      updatePreviewPanel();

      // Start glowing animation and disable send button
      setAttachButtonGlowing(true);
      setSendButtonDisabled(true);

      try {
        const caption = await generateImageCaption(base64Data);

        // Find the image in case array changed
        const imgInArray = pendingAttachImages.find(img => img.id === imageId);

        if (imgInArray) {
          imgInArray.generating = false;

          // Check if user wants to edit caption before saving
          if (settings.editCaptionBeforeSaving && caption) {
            // Show caption editor and WAIT for it to complete
            await new Promise((resolve) => {
              showCaptionEditor(caption, base64Data, (editedCaption) => {
                const img = pendingAttachImages.find(i => i.id === imageId);
                if (img) {
                  img.caption = editedCaption || '';
                  console.log('[ImageGen] 📎 Edited caption saved for pending image');
                }
                resolve();
              }, () => {
                // User cancelled - use original caption
                const img = pendingAttachImages.find(i => i.id === imageId);
                if (img) {
                  img.caption = caption || '';
                  console.log('[ImageGen] 📎 Original caption kept for pending image');
                }
                resolve();
              });
            });
          } else {
            imgInArray.caption = caption || '';
            console.log('[ImageGen] 📎 Caption generated for pending image');
          }
        }
      } catch (err) {
        const imgInArray = pendingAttachImages.find(img => img.id === imageId);
        if (imgInArray) {
          imgInArray.generating = false;
        }
        console.error('[ImageGen] Failed to generate caption for pending image:', err);
      } finally {
        captionsInProgress--;
        updatePreviewPanel();

        // Only stop glowing and re-enable if no more captions in progress
        if (captionsInProgress <= 0) {
          captionsInProgress = 0;
          setAttachButtonGlowing(false);
          setSendButtonDisabled(false);
        }
      }
    }
  }

  function getLastUserMessageWrapper() {
    const allNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    let lastUserNode = null;
    let lastUserIndex = -1;

    for (const node of allNodes) {
      const index = parseInt(node.dataset.index, 10);
      const isBot = !!node.querySelector(BOT_NAME_ICON_SELECTOR);

      if (!isBot && index > lastUserIndex) {
        lastUserIndex = index;
        lastUserNode = node;
      }
    }

    if (lastUserNode) {
      return {
        wrapper: lastUserNode.querySelector(MESSAGE_WRAPPER_SELECTOR),
        index: lastUserIndex
      };
    }
    return null;
  }

  async function processPendingAttachAfterSend() {
    if (pendingAttachImages.length === 0 || isProcessingPendingAttach) return;

    isProcessingPendingAttach = true;
    const imagesToAttach = [...pendingAttachImages]; // Copy the array
    const settings = loadSettings();

    console.log(`[ImageGen] 📎 Processing ${imagesToAttach.length} pending images for attachment`);

    clearPendingAttachImages();

    // Wait for DOM to update with the new user message
    await new Promise(resolve => setTimeout(resolve, 150));

    const lastUser = getLastUserMessageWrapper();
    if (lastUser && lastUser.wrapper) {
      // Determine visibility based on injectCaptionsToLLM setting
      const shouldBeVisible = settings.injectCaptionsToLLM;

      // Attach each image - all images belong to swipe 0 (current swipe)
      for (let i = 0; i < imagesToAttach.length; i++) {
        const imageData = imagesToAttach[i];

        console.log(`[ImageGen] 📎 Attaching image ${i + 1}/${imagesToAttach.length} (id: ${imageData.id}, base64 length: ${imageData.base64?.length || 0})`);

        // Add to history with swipeIndex 0 and mark as user message
        const historyEntry = addToImageHistory(lastUser.index, 0, imageData.base64, imageData.caption, true);
        console.log(`[ImageGen] 📎 Added to history: ${historyEntry ? 'success' : 'failed'}`);

        // Update visibility in history if needed
        if (!shouldBeVisible && historyEntry) {
          toggleImageVisibility(imageData.base64); // This will set it to hidden
        }

        const injected = injectImageIntoMessage(lastUser.wrapper, imageData.base64, -1, 0);
        console.log(`[ImageGen] 📎 Injected image ${i + 1}: ${injected ? 'success' : 'skipped/failed'}`);
      }

      console.log(`[ImageGen] 📎 Attached ${imagesToAttach.length} image(s) to user message ${lastUser.index}`);
    } else {
      console.warn('[ImageGen] Could not find last user message to attach images');
    }

    isProcessingPendingAttach = false;
  }

  // Intercept send button clicks
  // Track if we're currently capturing a screenshot for send
  let isCapturingForSend = false;

  function setupSendButtonInterceptor() {
    // Intercept click on send button
    document.addEventListener('click', async (e) => {
      const sendBtn = e.target.closest('button[aria-label="Send"]');
      if (!sendBtn || sendBtn.disabled) return;

      // If screenshare is active and NO pending images yet, capture screenshot first
      // Skip if there are already pending images (user already captured a screenshot)
      if (activeScreenshareStream && activeScreenshareStream.active && !isCapturingForSend && pendingAttachImages.length === 0) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        isCapturingForSend = true;
        updateScreenshareButtonState(); // Show capturing state

        try {
          console.log('[ImageGen] Capturing screenshot before send...');
          const base64Data = await captureScreenshotFromStream();
          await addPendingAttachImage(base64Data, activeAttachButton);
          console.log('[ImageGen] Screenshot captured and attached - user can now send');
        } catch (err) {
          console.error('[ImageGen] Failed to capture screenshot on send:', err);
        } finally {
          isCapturingForSend = false;
          updateScreenshareButtonState();
        }

        // Don't auto-send - let user click send again when ready
        return;
      }

      // Handle pending attach images
      if (pendingAttachImages.length > 0) {
        // Process pending attach after the message is sent
        // Use a small delay to ensure the message is sent first
        setTimeout(processPendingAttachAfterSend, 50);
      }
    }, true); // Use capture phase to catch the event early

    // Also intercept Enter key presses in the textarea
    document.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        const textarea = e.target.closest('textarea[class*="_chatTextarea_"]');
        if (!textarea || !textarea.value.trim()) return;

        // If screenshare is active and NO pending images yet, capture screenshot first
        // Skip if there are already pending images (user already captured a screenshot)
        if (activeScreenshareStream && activeScreenshareStream.active && !isCapturingForSend && pendingAttachImages.length === 0) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          isCapturingForSend = true;
          updateScreenshareButtonState();

          try {
            console.log('[ImageGen] Capturing screenshot before send (Enter key)...');
            const base64Data = await captureScreenshotFromStream();
            await addPendingAttachImage(base64Data, activeAttachButton);
            console.log('[ImageGen] Screenshot captured and attached - user can now send');
          } catch (err) {
            console.error('[ImageGen] Failed to capture screenshot on send:', err);
          } finally {
            isCapturingForSend = false;
            updateScreenshareButtonState();
          }

          // Don't auto-send - let user press Enter again when ready
          return;
        }

        // Handle pending attach images
        if (pendingAttachImages.length > 0) {
          setTimeout(processPendingAttachAfterSend, 50);
        }
      }
    }, true);
  }

  // Inject attach button into popover
  function injectAttachButtonIntoPopover(popoverList) {
    if (!currentSettings.enabled) return;
    if (popoverList.querySelector('.imagegen-attach-btn')) return;

    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'imagegen-attach-btn';
    btn.textContent = 'Attach img';

    // Hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      btn.disabled = true;
      btn.textContent = 'Processing...';

      try {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const base64Data = ev.target.result;
          btn.disabled = false;
          await addPendingAttachImage(base64Data, btn);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error('[ImageGen] Failed to process attachment:', err);
        btn.disabled = false;
        updateAttachButtonState();
      }

      fileInput.value = '';
    };

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileInput.click();
    };

    li.appendChild(fileInput);
    li.appendChild(btn);

    // Store reference to button for state updates
    activeAttachButton = btn;

    // Update button state in case there's already a pending image
    updateAttachButtonState();

    // Insert at the top of the list (before "Enhance msg")
    popoverList.insertBefore(li, popoverList.firstChild);

    // Also inject screenshare button right after attach button
    injectScreenshareButtonIntoPopover(popoverList, li);
  }

  // Active screenshare stream reference
  let activeScreenshareStream = null;
  let activeScreenshareButton = null;

  // Start screen sharing (just activates the stream, doesn't capture yet)
  async function startScreenshare() {
    try {
      console.log('[ImageGen] Requesting screen share...');
      activeScreenshareStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: false
      });

      // Listen for when user stops sharing
      activeScreenshareStream.getVideoTracks()[0].onended = () => {
        console.log('[ImageGen] Screen share stopped by user');
        activeScreenshareStream = null;
        updateScreenshareButtonState();
      };

      console.log('[ImageGen] Screen share started - screenshots will be captured on Send');
      return true;
    } catch (err) {
      console.error('[ImageGen] Failed to start screen share:', err);
      activeScreenshareStream = null;
      throw err;
    }
  }

  // Capture screenshot from the active stream (called when user sends)
  async function captureScreenshotFromStream() {
    if (!activeScreenshareStream || !activeScreenshareStream.active) {
      throw new Error('No active screen share');
    }

    const track = activeScreenshareStream.getVideoTracks()[0];
    if (!track) {
      throw new Error('No video track available');
    }

    // Create video element to capture frame
    const video = document.createElement('video');
    video.srcObject = activeScreenshareStream;
    video.muted = true;

    await new Promise((resolve, reject) => {
      video.onloadedmetadata = () => {
        video.play().then(resolve).catch(reject);
      };
      video.onerror = reject;
    });

    // Wait a frame to ensure video is playing
    await new Promise(resolve => requestAnimationFrame(resolve));

    // Capture to canvas
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    // Stop the video element (not the stream - keep it for future captures)
    video.pause();
    video.srcObject = null;

    // Convert to base64
    const base64Data = canvas.toDataURL('image/png');
    console.log('[ImageGen] Screenshot captured successfully');

    return base64Data;
  }

  // Stop active screenshare
  function stopScreenshare() {
    if (activeScreenshareStream) {
      activeScreenshareStream.getTracks().forEach(track => track.stop());
      activeScreenshareStream = null;
      console.log('[ImageGen] Screen share stopped');
    }
    updateScreenshareButtonState();
  }

  // Update all screenshare buttons to reflect current state
  function updateScreenshareButtonState() {
    const buttons = document.querySelectorAll('.imagegen-screenshare-btn');
    buttons.forEach(btn => {
      if (isCapturingForSend) {
        btn.classList.add('capturing');
        btn.classList.remove('active');
        btn.textContent = 'Capturing...';
      } else if (activeScreenshareStream && activeScreenshareStream.active) {
        btn.classList.add('active');
        btn.classList.remove('capturing');
        btn.textContent = 'Stop Share';
      } else {
        btn.classList.remove('active', 'capturing');
        btn.textContent = 'Screenshare';
      }
    });
  }

  // Inject screenshare button into popover
  function injectScreenshareButtonIntoPopover(popoverList, attachLi) {
    if (!currentSettings.enabled) return;
    if (popoverList.querySelector('.imagegen-screenshare-btn')) return;

    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'imagegen-screenshare-btn';
    btn.textContent = 'Screenshare';

    // Update button state in case screenshare is already active
    if (activeScreenshareStream && activeScreenshareStream.active) {
      btn.classList.add('active');
      btn.textContent = 'Stop Share';
    }

    btn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Toggle screenshare on/off
      if (activeScreenshareStream && activeScreenshareStream.active) {
        // Stop screen sharing
        stopScreenshare();
      } else {
        // Start screen sharing
        btn.disabled = true;
        try {
          await startScreenshare();
          updateScreenshareButtonState();
        } catch (err) {
          console.error('[ImageGen] Screenshare start failed:', err);
          if (err.name === 'NotAllowedError') {
            // User cancelled - don't show alert, just silently fail
            console.log('[ImageGen] User cancelled screen share request');
          } else {
            alert('Failed to start screen share: ' + err.message);
          }
        } finally {
          btn.disabled = false;
        }
      }
    };

    activeScreenshareButton = btn;
    li.appendChild(btn);

    // Insert right after the attach button
    if (attachLi.nextSibling) {
      popoverList.insertBefore(li, attachLi.nextSibling);
    } else {
      popoverList.appendChild(li);
    }
  }

  // Observer to watch for popover appearing
  function initializePopoverObserver() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;

          // Look for the popover list
          const popoverList = node.matches?.('[class*="_popoverList_"]')
            ? node
            : node.querySelector?.('[class*="_popoverList_"]');

          if (popoverList) {
            injectAttachButtonIntoPopover(popoverList);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also check existing popovers
    document.querySelectorAll('[class*="_popoverList_"]').forEach(list => {
      injectAttachButtonIntoPopover(list);
    });

    console.log('[ImageGen] 📎 Popover observer initialized');
  }

  // Initialize send button interceptor
  setupSendButtonInterceptor();

  // --- SEND BUTTON & CAPTION LOADING STATE ---

  let captionGenerationCount = 0; // Track how many captions are being generated

  function getSendButton() {
    // Use aria-label which is more stable than class names
    return document.querySelector('button[aria-label="Send"]');
  }

  // Track if we're currently generating a caption for pre-attach
  let isGeneratingAttachCaption = false;
  let sendButtonObserver = null;

  function setSendButtonDisabled(disabled) {
    const sendBtn = getSendButton();
    if (!sendBtn) return;

    if (disabled) {
      isGeneratingAttachCaption = true;
      sendBtn.dataset.imagegenDisabled = 'true';
      sendBtn.disabled = true;

      // Set up observer to keep button disabled if something tries to enable it
      if (!sendButtonObserver) {
        sendButtonObserver = new MutationObserver((mutations) => {
          if (isGeneratingAttachCaption && sendBtn && !sendBtn.disabled) {
            sendBtn.disabled = true;
          }
        });
        sendButtonObserver.observe(sendBtn, { attributes: true, attributeFilter: ['disabled'] });
      }
    } else {
      isGeneratingAttachCaption = false;

      // Disconnect observer before re-enabling
      if (sendButtonObserver) {
        sendButtonObserver.disconnect();
        sendButtonObserver = null;
      }

      delete sendBtn.dataset.imagegenDisabled;
      // Re-enable the button
      sendBtn.disabled = false;
    }
  }

  function showImageCaptionLoading(imageWrapper) {
    if (!imageWrapper) return;
    imageWrapper.classList.add('caption-loading');

    // Add loading overlay if not exists
    if (!imageWrapper.querySelector('.imagegen-caption-loading-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'imagegen-caption-loading-overlay';
      overlay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>`;
      imageWrapper.appendChild(overlay);
    }

    // Increment counter and disable send button
    captionGenerationCount++;
    setSendButtonDisabled(true);
  }

  function hideImageCaptionLoading(imageWrapper) {
    if (!imageWrapper) return;
    imageWrapper.classList.remove('caption-loading');

    // Remove loading overlay
    const overlay = imageWrapper.querySelector('.imagegen-caption-loading-overlay');
    if (overlay) {
      overlay.remove();
    }

    // Decrement counter and re-enable send button if no more captions being generated
    captionGenerationCount--;
    if (captionGenerationCount <= 0) {
      captionGenerationCount = 0;
      setSendButtonDisabled(false);
    }
  }

  // --- GEMINI CLIENT BRIDGE ---

  let pendingRequest = null;

  // New Helper: Convert Remote URL to Base64 via GM_xmlhttpRequest
  function convertUrlToBase64(url) {
      return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
              method: "GET",
              url: url,
              responseType: "blob",
              onload: function(response) {
                  const reader = new FileReader();
                  reader.onloadend = function() {
                      resolve(reader.result); // This is the data:image/png;base64... string
                  }
                  reader.readAsDataURL(response.response);
              },
              onerror: (err) => {
                  console.error("GM Download Error", err);
                  reject(err);
              }
          });
      });
  }

  // Generate caption for an image using Gemini API
  async function generateImageCaption(imageUrl) {
      const settings = loadSettings();

      if (!settings.captioningEnabled) {
          console.log("[ImageGen] Captioning disabled, skipping.");
          return '';
      }

      if (!settings.captioningApiKey) {
          console.warn("[ImageGen] No API key configured for captioning.");
          return '';
      }

      console.log("[ImageGen] 🏷️ Generating caption...");

      try {
          // Get image as base64 if it's not already
          let base64Data = imageUrl;
          let mimeType = 'image/png';

          if (imageUrl.startsWith('data:')) {
              // Extract mime type and base64 data
              const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
              if (match) {
                  mimeType = match[1];
                  base64Data = match[2];
              }
          } else {
              // Download and convert to base64
              const fullBase64 = await convertUrlToBase64(imageUrl);
              const match = fullBase64.match(/^data:([^;]+);base64,(.+)$/);
              if (match) {
                  mimeType = match[1];
                  base64Data = match[2];
              }
          }

          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${settings.captioningModel}:generateContent?key=${settings.captioningApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{
                      parts: [
                          {
                              inline_data: {
                                  mime_type: mimeType,
                                  data: base64Data
                              }
                          },
                          {
                              text: settings.captioningPrompt || "Provide an extremely detailed, objective description of this image. Identify any characters from media by name. Describe all physical features, clothing, pose, background, and composition. Do not describe emotions or feelings the image evokes."
                          }
                      ]
                  }]
              })
          });

          const data = await response.json();

          if (data.error) {
              console.error("[ImageGen] Captioning API Error:", data.error.message);
              return '';
          }

          if (data.candidates && data.candidates[0] && data.candidates[0].content) {
              const caption = data.candidates[0].content.parts[0].text.trim();
              console.log("[ImageGen] ✅ Caption generated:", caption);
              return caption;
          }

          return '';
      } catch (e) {
          console.error("[ImageGen] Failed to generate caption:", e);
          return '';
      }
  }

  // Listen for images coming from Gemini
  GM_addValueChangeListener(RESP_KEY, function(key, oldVal, newVal) {
      if (!newVal || newVal.type !== MSG_TYPES.IMAGE_RESPONSE) return;

      handleIncomingImage(newVal.imageUrl);
  });

  // Show image review modal
  function showImageReviewModal(imageUrl, onAccept, onRegenerate, onCancel) {
      const overlay = document.createElement("div");
      overlay.className = "imagegen-modal-overlay";

      const container = document.createElement("div");
      container.className = "imagegen-modal-container";
      container.style.minWidth = "500px";
      container.style.maxWidth = "800px";

      const header = document.createElement("div");
      header.className = "imagegen-modal-header";
      const title = document.createElement("h2");
      title.className = "imagegen-modal-title";
      title.textContent = "Review Generated Image";

      const closeBtn = document.createElement("button");
      closeBtn.className = "imagegen-modal-close";
      closeBtn.innerHTML = "✕";
      closeBtn.onclick = () => {
          overlay.remove();
          if (onCancel) onCancel();
      };

      header.appendChild(title);
      header.appendChild(closeBtn);

      const body = document.createElement("div");
      body.className = "imagegen-modal-body";
      body.style.alignItems = "center";

      const imgPreview = document.createElement("img");
      imgPreview.src = imageUrl;
      imgPreview.style.cssText = "max-width:100%; max-height:400px; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.3);";
      body.appendChild(imgPreview);

      const info = document.createElement("div");
      info.className = "imagegen-trigger-info";
      info.style.marginTop = "16px";
      info.innerHTML = "Accept this image or regenerate with a new prompt.";
      body.appendChild(info);

      const footer = document.createElement("div");
      footer.className = "imagegen-modal-footer";
      footer.style.justifyContent = "space-between";

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "imagegen-modal-btn cancel";
      cancelBtn.textContent = "Discard";
      cancelBtn.onclick = () => {
          overlay.remove();
          if (onCancel) onCancel();
      };

      const rightBtns = document.createElement("div");
      rightBtns.style.display = "flex";
      rightBtns.style.gap = "12px";

      const regenBtn = document.createElement("button");
      regenBtn.className = "imagegen-modal-btn cancel";
      regenBtn.textContent = "Regenerate";
      regenBtn.onclick = () => {
          overlay.remove();
          if (onRegenerate) onRegenerate();
      };

      const acceptBtn = document.createElement("button");
      acceptBtn.className = "imagegen-modal-btn save";
      acceptBtn.textContent = "Accept";
      acceptBtn.onclick = () => {
          overlay.remove();
          onAccept(imageUrl);
      };

      rightBtns.appendChild(regenBtn);
      rightBtns.appendChild(acceptBtn);

      footer.appendChild(cancelBtn);
      footer.appendChild(rightBtns);

      container.appendChild(header);
      container.appendChild(body);
      container.appendChild(footer);
      overlay.appendChild(container);
      document.body.appendChild(overlay);
  }

  // Separate async handler
  async function handleIncomingImage(originalUrl) {
      let finalUrl = originalUrl;
      const settings = loadSettings();

      // IF LOCAL STORAGE IS ENABLED: DOWNLOAD AND CONVERT
      if (settings.useLocalStorage) {
          console.log("[ImageGen] 💾 Attempting to download image to local storage (Base64)...");
          try {
              finalUrl = await convertUrlToBase64(originalUrl);
              console.log("[ImageGen] ✅ Image converted to Base64 successfully.");
          } catch (e) {
              console.error("[ImageGen] ❌ Failed to convert image. Using original URL.", e);
          }
      }

      console.log("[ImageGen] 📥 Processing Image...");

      // If edit before sending is enabled, show review modal
      if (settings.editBeforeSending && pendingRequest) {
          const { messageIndex, swipeIndex } = pendingRequest;
          const savedRequest = { ...pendingRequest };
          pendingRequest = null;

          showImageReviewModal(finalUrl,
              // On Accept
              (acceptedUrl) => {
                  const wrapper = findWrapperByIndices(savedRequest.messageIndex, savedRequest.swipeIndex);
                  if (wrapper) {
                      injectImageIntoMessage(wrapper, acceptedUrl, savedRequest.messageIndex, savedRequest.swipeIndex);
                  } else {
                      const lastWrapper = getLastFinishedMessageWrapper();
                      if (lastWrapper) injectImageIntoMessage(lastWrapper, acceptedUrl, savedRequest.messageIndex, savedRequest.swipeIndex);
                  }
              },
              // On Regenerate
              () => {
                  // Show prompt editor to regenerate
                  const wrapper = findWrapperByIndices(savedRequest.messageIndex, savedRequest.swipeIndex);
                  if (wrapper) {
                      const text = extractFormattedMessageText(wrapper);
                      const prompt = processContextualPrompt(text, savedRequest.messageIndex);
                      showPromptEditor(prompt, (editedPrompt) => {
                          sendToGemini(editedPrompt, savedRequest.messageIndex, savedRequest.swipeIndex);
                      }, () => {
                          console.log("[ImageGen] ❌ Regeneration cancelled");
                      });
                  }
              },
              // On Cancel/Discard
              () => {
                  console.log("[ImageGen] ❌ Image discarded by user");
              }
          );
      } else {
          // Direct injection without review
          if (pendingRequest) {
              const { messageIndex, swipeIndex } = pendingRequest;
              const wrapper = findWrapperByIndices(messageIndex, swipeIndex);

              if (wrapper) {
                  injectImageIntoMessage(wrapper, finalUrl, messageIndex, swipeIndex);
              } else {
                  console.warn("[ImageGen] Could not find original message wrapper for injection. Trying last finished message.");
                  const lastWrapper = getLastFinishedMessageWrapper();
                  if (lastWrapper) injectImageIntoMessage(lastWrapper, finalUrl, messageIndex, swipeIndex);
              }
              pendingRequest = null;
          } else {
              const lastWrapper = getLastFinishedMessageWrapper();
              if (lastWrapper) injectImageIntoMessage(lastWrapper, finalUrl);
          }
      }
  }

  // Show prompt editor modal
  function showPromptEditor(prompt, onConfirm, onCancel) {
      const overlay = document.createElement("div");
      overlay.className = "imagegen-modal-overlay";

      const container = document.createElement("div");
      container.className = "imagegen-modal-container";
      container.style.minWidth = "500px";
      container.style.maxWidth = "700px";

      const header = document.createElement("div");
      header.className = "imagegen-modal-header";
      const title = document.createElement("h2");
      title.className = "imagegen-modal-title";
      title.textContent = "Edit Prompt Before Sending";

      const closeBtn = document.createElement("button");
      closeBtn.className = "imagegen-modal-close";
      closeBtn.innerHTML = "✕";
      closeBtn.onclick = () => {
          overlay.remove();
          if (onCancel) onCancel();
      };

      header.appendChild(title);
      header.appendChild(closeBtn);

      const body = document.createElement("div");
      body.className = "imagegen-modal-body";

      const info = document.createElement("div");
      info.className = "imagegen-trigger-info";
      info.innerHTML = "Edit the prompt below before sending to Gemini for image generation.";
      body.appendChild(info);

      const textarea = document.createElement("textarea");
      textarea.className = "imagegen-contextual-textarea";
      textarea.value = prompt;
      textarea.style.minHeight = "200px";
      body.appendChild(textarea);

      const footer = document.createElement("div");
      footer.className = "imagegen-modal-footer";

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "imagegen-modal-btn cancel";
      cancelBtn.textContent = "Cancel";
      cancelBtn.onclick = () => {
          overlay.remove();
          if (onCancel) onCancel();
      };

      const sendBtn = document.createElement("button");
      sendBtn.className = "imagegen-modal-btn save";
      sendBtn.textContent = "Send to Gemini";
      sendBtn.onclick = () => {
          overlay.remove();
          onConfirm(textarea.value);
      };

      footer.appendChild(cancelBtn);
      footer.appendChild(sendBtn);

      container.appendChild(header);
      container.appendChild(body);
      container.appendChild(footer);
      overlay.appendChild(container);
      document.body.appendChild(overlay);

      // Focus textarea
      setTimeout(() => textarea.focus(), 100);
  }

  // Show caption editor modal
  function showCaptionEditor(caption, imageUrl, onConfirm, onCancel) {
      const overlay = document.createElement("div");
      overlay.className = "imagegen-modal-overlay";

      const container = document.createElement("div");
      container.className = "imagegen-modal-container";
      container.style.minWidth = "500px";
      container.style.maxWidth = "700px";

      const header = document.createElement("div");
      header.className = "imagegen-modal-header";
      const title = document.createElement("h2");
      title.className = "imagegen-modal-title";
      title.textContent = "Edit Caption";

      const closeBtn = document.createElement("button");
      closeBtn.className = "imagegen-modal-close";
      closeBtn.innerHTML = "✕";
      closeBtn.onclick = () => {
          overlay.remove();
          if (onCancel) onCancel();
      };

      header.appendChild(title);
      header.appendChild(closeBtn);

      const body = document.createElement("div");
      body.className = "imagegen-modal-body";
      body.style.alignItems = "center";

      // Show image preview
      if (imageUrl) {
          const imgPreview = document.createElement("img");
          imgPreview.src = imageUrl;
          imgPreview.style.cssText = "max-width:100%; max-height:200px; border-radius:8px; box-shadow:0 4px 15px rgba(0,0,0,0.3); margin-bottom:16px;";
          body.appendChild(imgPreview);
      }

      const info = document.createElement("div");
      info.className = "imagegen-trigger-info";
      info.innerHTML = "Edit the AI-generated caption below before saving.";
      body.appendChild(info);

      const textarea = document.createElement("textarea");
      textarea.className = "imagegen-contextual-textarea";
      textarea.value = caption;
      textarea.style.minHeight = "100px";
      textarea.style.width = "100%";
      body.appendChild(textarea);

      const footer = document.createElement("div");
      footer.className = "imagegen-modal-footer";

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "imagegen-modal-btn cancel";
      cancelBtn.textContent = "Discard";
      cancelBtn.onclick = () => {
          overlay.remove();
          if (onCancel) onCancel();
      };

      const saveBtn = document.createElement("button");
      saveBtn.className = "imagegen-modal-btn save";
      saveBtn.textContent = "Save Caption";
      saveBtn.onclick = () => {
          overlay.remove();
          onConfirm(textarea.value.trim());
      };

      footer.appendChild(cancelBtn);
      footer.appendChild(saveBtn);

      container.appendChild(header);
      container.appendChild(body);
      container.appendChild(footer);
      overlay.appendChild(container);
      document.body.appendChild(overlay);

      // Focus textarea
      setTimeout(() => textarea.focus(), 100);
  }

  function requestGeminiGeneration(prompt, messageIndex, swipeIndex) {
      const settings = loadSettings();

      // If edit before sending is enabled, show the editor
      if (settings.editBeforeSending) {
          showPromptEditor(prompt, (editedPrompt) => {
              // User confirmed - send the edited prompt
              sendToGemini(editedPrompt, messageIndex, swipeIndex);
          }, () => {
              // User cancelled
              console.log("[ImageGen] ❌ Image generation cancelled by user");
          });
      } else {
          // Send directly
          sendToGemini(prompt, messageIndex, swipeIndex);
      }
  }

  function sendToGemini(prompt, messageIndex, swipeIndex) {
      console.log(`[ImageGen] 📤 Sending request to Gemini: "${prompt}"`);

      // visual feedback that it's processing
      const wrapper = findWrapperByIndices(messageIndex, swipeIndex);
      if(wrapper) {
          const body = wrapper.querySelector('[class^="_messageBody_"]');
          if(body && !body.querySelector('.imagegen-spinner')) {
             // Create a temporary spinner or marker if desired
          }
      }

      pendingRequest = { messageIndex, swipeIndex, timestamp: Date.now() };
      sendSignal(CMD_KEY, MSG_TYPES.SEND_MESSAGE, { text: prompt });
  }

  // --- TEXT EXTRACTION UTILITIES ---

  function extractFormattedMessageText(messageNode) {
    // Find the message text container dynamically
    // Structure: _messageBody_ > [_nameContainer_, textContainer]
    // The text container is a direct child of _messageBody_ that is NOT _nameContainer_
    const messageBody = messageNode.querySelector(MESSAGE_BODY_SELECTOR);
    if (!messageBody) return "";

    // Find the text container: it's a div child of messageBody that is not the name container
    let textContainer = null;
    for (const child of messageBody.children) {
      if (child.tagName === 'DIV' && !child.className.match(/_nameContainer_/)) {
        // This should be the text container (has dynamic css-XXXXX class)
        textContainer = child;
        break;
      }
    }
    if (!textContainer) return "";

    let result = [];
    // Find text blocks - they have class 'css-0' or are direct children with content
    const blocks = textContainer.querySelectorAll('[class^="css-"]');
    blocks.forEach(block => {
      const p = block.querySelector('p');
      if (p) {
        let line = '';
        p.childNodes.forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName === 'EM') line += '*' + child.textContent + '*';
            else if (child.tagName === 'STRONG') line += '**' + child.textContent + '**';
            else if (child.tagName === 'CODE') line += '`' + child.textContent + '`';
            else line += child.textContent;
          } else if (child.nodeType === Node.TEXT_NODE) {
            line += child.textContent;
          }
        });
        if (line.trim()) result.push(line.trim());
        return;
      }
      const ul = block.querySelector('ul');
      if (ul) {
        ul.querySelectorAll('li').forEach(li => result.push('• ' + li.textContent.trim()));
        return;
      }
      const code = block.querySelector('code');
      if (code && !p) { result.push('`' + code.textContent.trim() + '`'); return; }
      if (!block.textContent.trim()) return;
      result.push(block.textContent.trim());
    });
    return result.join('\n\n');
  }

  function getMessageTextAtIndex(targetIndex) {
    const allMessageNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    for (const node of allMessageNodes) {
      const index = parseInt(node.dataset.index, 10);
      if (index === targetIndex) {
        if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
          const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
          if (swipeContainer) {
            const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
            if (slider) {
              const transform = slider.style.transform;
              const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
              const activeSwipeIndex = Math.round(Math.abs(translateX) / 100);
              const allSwipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
              if (allSwipes.length > activeSwipeIndex) {
                return extractFormattedMessageText(allSwipes[activeSwipeIndex]);
              }
            }
          }
        }
        const messageWrapper = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        if (messageWrapper) return extractFormattedMessageText(messageWrapper);
      }
    }
    return "";
  }

  function processContextualPrompt(presentMsgText, presentMsgIndex) {
    const settings = loadSettings();
    let prompt = settings.contextualPrompt || DEFAULT_SETTINGS.contextualPrompt;
    const previousMsgText = presentMsgIndex > 0 ? getMessageTextAtIndex(presentMsgIndex - 1) : "";

    prompt = prompt.replace(/\{\{previousMsg\}\}/g, previousMsgText || "[No previous message]");
    prompt = prompt.replace(/\{\{presentMsg\}\}/g, presentMsgText || "[No message]");

    // Append instruction for Gemini
    return prompt + "\n\n(IMPORTANT: Generate an image based on this description. Output ONLY the image if possible.)";
  }

  // Helper to find a specific message wrapper by index and swipe
  function findWrapperByIndices(msgIndex, swipeIdx) {
      const allNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
      for(const node of allNodes) {
          if(parseInt(node.dataset.index) === msgIndex) {
              // Check swipes
              if(node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR)) {
                  const slider = node.querySelector(SWIPE_SLIDER_SELECTOR);
                  if(slider) {
                      const swipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
                      if(swipes[swipeIdx]) return swipes[swipeIdx];
                  }
              }
              // Check default
              return node.querySelector(MESSAGE_WRAPPER_SELECTOR);
          }
      }
      return null;
  }

// ==========================================================
  // SECCIÓN 5. CORE INJECTION & AUTOMATION LOGIC
  // ==========================================================

  function createGalleryControls(container) {
    const controls = document.createElement('div');
    controls.className = 'imagegen-gallery-controls';

    const leftArrow = document.createElement('button');
    leftArrow.className = 'imagegen-gallery-arrow imagegen-gallery-prev';
    leftArrow.innerHTML = '&#10094;'; // Left chevron
    leftArrow.title = 'Previous image';

    const counter = document.createElement('span');
    counter.className = 'imagegen-gallery-counter';

    const rightArrow = document.createElement('button');
    rightArrow.className = 'imagegen-gallery-arrow imagegen-gallery-next';
    rightArrow.innerHTML = '&#10095;'; // Right chevron
    rightArrow.title = 'Next image';

    controls.appendChild(leftArrow);
    controls.appendChild(counter);
    controls.appendChild(rightArrow);

    return controls;
  }

  function updateGalleryView(container) {
    const imageWrappers = container.querySelectorAll('.imagegen-image-wrapper');
    const images = container.querySelectorAll('.imagegen-generated-image');
    const controls = container.querySelector('.imagegen-gallery-controls');
    const counter = container.querySelector('.imagegen-gallery-counter');
    const prevBtn = container.querySelector('.imagegen-gallery-prev');
    const nextBtn = container.querySelector('.imagegen-gallery-next');

    if (images.length === 0) return;

    let currentIndex = parseInt(container.dataset.currentIndex || '0', 10);

    // Ensure index is valid
    if (currentIndex >= images.length) currentIndex = images.length - 1;
    if (currentIndex < 0) currentIndex = 0;
    container.dataset.currentIndex = currentIndex;

    // Show/hide image wrappers (or images if no wrappers)
    if (imageWrappers.length > 0) {
      imageWrappers.forEach((wrapper, idx) => {
        if (idx === currentIndex) {
          wrapper.classList.remove('hidden');
        } else {
          wrapper.classList.add('hidden');
        }
      });
    } else {
      // Fallback for old structure without wrappers
      images.forEach((img, idx) => {
        if (idx === currentIndex) {
          img.classList.remove('hidden');
        } else {
          img.classList.add('hidden');
        }
      });
    }

    // Update counter
    counter.textContent = `${currentIndex + 1}/${images.length}`;

    // Update arrow states
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === images.length - 1;

    // Show/hide controls based on image count
    controls.style.display = images.length > 1 ? 'flex' : 'none';
  }

  function injectImageIntoMessage(messageWrapperNode, imageUrl, messageIndex = -1, swipeIndex = 0) {
    if (!messageWrapperNode || !imageUrl) {
      console.warn("[ImageGen] Cannot inject image: missing node or url");
      return false;
    }

    const messageBody = messageWrapperNode.querySelector('[class^="_messageBody_"]');
    if (!messageBody) {
      console.warn("[ImageGen] Cannot inject image: messageBody not found");
      return false;
    }

    // Check if gallery container already exists, create if not
    let galleryContainer = messageBody.querySelector('.imagegen-gallery-container');
    const galleryExisted = !!galleryContainer;

    if (!galleryContainer) {
      console.log("[ImageGen] Creating new gallery container");
      galleryContainer = document.createElement('div');
      galleryContainer.className = 'imagegen-gallery-container';
      galleryContainer.dataset.currentIndex = '0';

      // Add controls
      const controls = createGalleryControls(galleryContainer);
      galleryContainer.appendChild(controls);

      // Setup arrow click handlers
      const prevBtn = controls.querySelector('.imagegen-gallery-prev');
      const nextBtn = controls.querySelector('.imagegen-gallery-next');

      prevBtn.onclick = (e) => {
        e.stopPropagation();
        let idx = parseInt(galleryContainer.dataset.currentIndex || '0', 10);
        if (idx > 0) {
          galleryContainer.dataset.currentIndex = idx - 1;
          updateGalleryView(galleryContainer);
        }
      };

      nextBtn.onclick = (e) => {
        e.stopPropagation();
        const images = galleryContainer.querySelectorAll('.imagegen-generated-image');
        let idx = parseInt(galleryContainer.dataset.currentIndex || '0', 10);
        if (idx < images.length - 1) {
          galleryContainer.dataset.currentIndex = idx + 1;
          updateGalleryView(galleryContainer);
        }
      };

      messageBody.appendChild(galleryContainer);
    }

    // Check if this exact image already exists in the gallery
    const existingImages = galleryContainer.querySelectorAll('.imagegen-generated-image');
    const newImageHash = imageUrl.substring(0, 100); // Use first 100 chars as identifier for logging
    console.log(`[ImageGen] Gallery ${galleryExisted ? 'existed' : 'created'}, checking ${existingImages.length} existing images`);
    for (const existingImg of existingImages) {
      if (existingImg.src === imageUrl) {
        console.log(`[ImageGen] Image already exists in gallery, skipping (hash: ${newImageHash}...)`);
        return false;
      }
    }
    console.log(`[ImageGen] Adding new image to gallery (total will be: ${existingImages.length + 1}, hash: ${newImageHash}...)`);

    // Create wrapper for image + caption button
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'imagegen-image-wrapper';

    // Create the new image
    const img = document.createElement("img");
    img.src = imageUrl;
    img.className = "imagegen-generated-image";
    img.alt = "Generated Image";
    // No onclick handler - tapping/clicking should only show the UI controls (visibility, caption, carousel)
    // This prevents accidental navigation especially on mobile devices

    // SVG icons for eye visibility toggle
    const eyeOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeClosedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>`;

    // Create visibility toggle button (eye)
    const visibilityBtn = document.createElement('button');
    visibilityBtn.className = 'imagegen-visibility-btn';
    const isVisible = getImageVisibility(imageUrl);
    visibilityBtn.innerHTML = isVisible ? eyeOpenSvg : eyeClosedSvg;
    visibilityBtn.title = isVisible ? 'Caption visible to AI (click to hide)' : 'Caption hidden from AI (click to show)';
    if (!isVisible) {
      visibilityBtn.classList.add('hidden-caption');
    }
    visibilityBtn.onclick = (e) => {
      e.stopPropagation();
      const newVisibility = toggleImageVisibility(imageUrl);
      if (newVisibility !== null) {
        visibilityBtn.innerHTML = newVisibility ? eyeOpenSvg : eyeClosedSvg;
        visibilityBtn.title = newVisibility ? 'Caption visible to AI (click to hide)' : 'Caption hidden from AI (click to show)';
        if (newVisibility) {
          visibilityBtn.classList.remove('hidden-caption');
        } else {
          visibilityBtn.classList.add('hidden-caption');
        }
        console.log(`[ImageGen] 👁️ Image caption visibility toggled: ${newVisibility ? 'visible' : 'hidden'}`);
      }
    };

    // Create caption button
    const captionBtn = document.createElement('button');
    captionBtn.className = 'imagegen-caption-btn';
    captionBtn.title = 'Generate Caption';
    captionBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/></svg>`;
    captionBtn.onclick = async (e) => {
        e.stopPropagation();
        captionBtn.disabled = true;
        captionBtn.style.opacity = '0.5';
        captionBtn.title = 'Generating caption...';

        const settings = loadSettings();

        // Show loading state on the image wrapper
        showImageCaptionLoading(imageWrapper);

        try {
            const caption = await generateImageCaption(imageUrl);

            // Hide loading state
            hideImageCaptionLoading(imageWrapper);

            if (caption) {
                // Check if we should show editor
                if (settings.editCaptionBeforeSaving) {
                    captionBtn.disabled = false;
                    captionBtn.style.opacity = '';
                    captionBtn.title = 'Generate Caption';

                    showCaptionEditor(caption, imageUrl, (editedCaption) => {
                        const saved = updateImageCaptionByUrl(imageUrl, editedCaption);
                        if (saved) {
                            console.log(`[ImageGen] 🏷️ Edited caption saved to history: "${editedCaption}"`);
                        } else {
                            console.log(`[ImageGen] 🏷️ Edited caption (not in history): "${editedCaption}"`);
                        }
                    }, () => {
                        console.log("[ImageGen] Caption editing cancelled");
                    });
                } else {
                    // Save directly without editing
                    const saved = updateImageCaptionByUrl(imageUrl, caption);
                    if (saved) {
                        console.log(`[ImageGen] 🏷️ Caption saved to history: "${caption}"`);
                    } else {
                        console.log(`[ImageGen] 🏷️ Caption generated (not in history): "${caption}"`);
                    }
                }
            } else {
                console.warn('[ImageGen] Failed to generate caption. Check your API key and settings.');
            }
        } catch (err) {
            // Hide loading state on error too
            hideImageCaptionLoading(imageWrapper);
            console.error("[ImageGen] Manual caption failed:", err);
        } finally {
            if (!settings.editCaptionBeforeSaving) {
                captionBtn.disabled = false;
                captionBtn.style.opacity = '';
                captionBtn.title = 'Generate Caption';
            }
        }
    };

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(visibilityBtn);
    imageWrapper.appendChild(captionBtn);

    // Insert image wrapper before controls
    const controls = galleryContainer.querySelector('.imagegen-gallery-controls');
    console.log(`[ImageGen] Inserting image wrapper, controls found: ${!!controls}`);
    galleryContainer.insertBefore(imageWrapper, controls);

    // Update gallery to show the new image (jump to it)
    const allImages = galleryContainer.querySelectorAll('.imagegen-generated-image');
    console.log(`[ImageGen] Gallery now has ${allImages.length} images after insertion`);
    galleryContainer.dataset.currentIndex = allImages.length - 1;
    updateGalleryView(galleryContainer);

    // Save history and generate caption
    if (messageIndex >= 0) {
      // Add to history first (without caption)
      const historyEntry = addToImageHistory(messageIndex, swipeIndex, imageUrl, '');
      console.log(`[ImageGen] ✅ Image added to history (Msg: ${messageIndex}, Swipe: ${swipeIndex + 1}, Image #${allImages.length})`);

      const settings = loadSettings();

      // Show loading state on the image
      showImageCaptionLoading(imageWrapper);

      // Generate caption asynchronously and save to history
      generateImageCaption(imageUrl).then(caption => {
          // Hide loading state
          hideImageCaptionLoading(imageWrapper);

          if (caption) {
              // Check if we should show editor
              if (settings.editCaptionBeforeSaving) {
                  showCaptionEditor(caption, imageUrl, (editedCaption) => {
                      updateImageCaption(historyEntry.id, editedCaption);
                      console.log(`[ImageGen] 🏷️ Edited caption saved for image #${historyEntry.id}: "${editedCaption}"`);
                  }, () => {
                      // User cancelled - save original caption anyway
                      updateImageCaption(historyEntry.id, caption);
                      console.log(`[ImageGen] 🏷️ Original caption saved for image #${historyEntry.id}: "${caption}"`);
                  });
              } else {
                  updateImageCaption(historyEntry.id, caption);
                  console.log(`[ImageGen] 🏷️ Caption saved to history for image #${historyEntry.id}: "${caption}"`);
              }
          }
      }).catch(err => {
          // Hide loading state on error too
          hideImageCaptionLoading(imageWrapper);
          console.error("[ImageGen] Caption generation failed:", err);
      });
    }

    return true;
  }

  function getLastFinishedMessageWrapper() {
    const allMessages = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    if (allMessages.length === 0) return null;

    for (let i = allMessages.length - 1; i >= 0; i--) {
      const node = allMessages[i];
      let candidateNode;

      if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
        const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
        if (swipeContainer) {
          const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
          if (!slider) continue;
          const transform = slider.style.transform;
          const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
          const activeSwipeIndex = Math.round(Math.abs(translateX) / 100);
          const allSwipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
          if (allSwipes.length <= activeSwipeIndex) continue;
          candidateNode = allSwipes[activeSwipeIndex];
        } else {
          candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        }
      } else {
        candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
      }

      if (!candidateNode) continue;
      if (candidateNode.querySelector(EDIT_PANEL_SELECTOR)) continue;
      if (candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) return candidateNode;
    }
    return null;
  }

  // ==========================================================
  // SECCIÓN 6. AUTOMATION OBSERVER (AUTO-GEN)
  // ==========================================================

  let lastLoggedText = "";
  let lastLoggedStatus = "";
  let lastLoggedSwipeIndex = -1;
  let lastLoggedMessageIndex = -1;

  function logLastFinishedMessage() {
    const settings = loadSettings();
    if (!settings.enabled || !settings.autoGeneration) return;

    const allMessageNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    if (allMessageNodes.length === 0) return;

    let lastFinishedNode = null;
    let messageIndex = -1;
    let isBot = false;
    let activeSwipeIndex = 0;

    for (let i = allMessageNodes.length - 1; i >= 0; i--) {
      const node = allMessageNodes[i];
      let candidateNode;

      // Bot Detection
      if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
        const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
        if (swipeContainer) {
          const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
          if (!slider) continue;
          const transform = slider.style.transform;
          const translateX = transform ? parseFloat(transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
          activeSwipeIndex = Math.round(Math.abs(translateX) / 100);
          const allSwipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
          if (allSwipes.length <= activeSwipeIndex) continue;
          candidateNode = allSwipes[activeSwipeIndex];
        } else {
          candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        }
        if (!candidateNode || candidateNode.querySelector(EDIT_PANEL_SELECTOR) || !candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) continue;
        lastFinishedNode = candidateNode;
        messageIndex = parseInt(node.dataset.index, 10);
        isBot = true;
        break;
      }
      // User Detection
      else {
        if (!settings.generateUserImages) continue;
        candidateNode = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
        if (!candidateNode || candidateNode.querySelector(EDIT_PANEL_SELECTOR) || !candidateNode.querySelector(CONTROL_PANEL_SELECTOR)) continue;
        lastFinishedNode = candidateNode;
        messageIndex = parseInt(node.dataset.index, 10);
        isBot = false;
        break;
      }
    }

    if (!lastFinishedNode) return;

    const messageText = extractFormattedMessageText(lastFinishedNode);
    if (!messageText) return;

    const status = isBot ? "bot" : "user";

    // Deduplication check
    if (messageText === lastLoggedText && status === lastLoggedStatus && messageIndex === lastLoggedMessageIndex && activeSwipeIndex === lastLoggedSwipeIndex) return;

    lastLoggedText = messageText;
    lastLoggedStatus = status;
    lastLoggedMessageIndex = messageIndex;
    lastLoggedSwipeIndex = activeSwipeIndex;

    // Trigger Word Check
    if (settings.triggerWordsEnabled !== false && settings.triggerWords && settings.triggerWords.length > 0) {
      const lower = messageText.toLowerCase();
      const matched = settings.triggerWords.find(t => lower.includes(t.toLowerCase()));
      if (!matched) return;
      console.log(`[ImageGen] ✅ Trigger Detected: "${matched}"`);
    }

    // --- EXECUTION ---

    // 1. Test Mode Handling
    if (settings.testMode && settings.testImageUrl) {
        injectImageIntoMessage(lastFinishedNode, settings.testImageUrl, messageIndex, activeSwipeIndex);
        console.log("[ImageGen] Test image injected via auto-detection");
        return;
    }

    // 2. Gemini Generation Handling
    const prompt = processContextualPrompt(messageText, messageIndex);
    requestGeminiGeneration(prompt, messageIndex, activeSwipeIndex);
  }

  function initializeObserver() {
    const chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);
    if (!chatContainer) {
      setTimeout(initializeObserver, 1000);
      return;
    }

    // Refresh character name cache when DOM is ready
    refreshCharacterNameCache();

    // Initial tracking of active swipes
    updateActiveSwipesTracking();

    // Re-inject history
    setTimeout(() => reinjectImagesFromHistory(), 500);

    // === SCROLL LISTENER for Virtuoso virtualized list ===
    // JanitorAI uses Virtuoso which removes DOM elements when scrolling
    // We need to re-inject images when the user scrolls to reveal new message elements
    const scrollContainer = document.querySelector('[data-testid="virtuoso-scroller"]');
    if (scrollContainer) {
      let scrollReinjectTimeout;
      scrollContainer.addEventListener('scroll', () => {
        // Debounced re-injection on scroll
        clearTimeout(scrollReinjectTimeout);
        scrollReinjectTimeout = setTimeout(() => {
          reinjectImagesFromHistory();
        }, 150);
      }, { passive: true });
      console.log('[ImageGen] 📜 Scroll listener attached for virtualized list');
    }

    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      let shouldReinject = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldCheck = true;
          // Check if any message containers were added/modified
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element node
              // If a message container or its parent was added, we need to reinject
              if (node.matches?.('[data-index]') ||
                  node.querySelector?.('[data-index]') ||
                  node.matches?.('[class^="_messageDisplayWrapper_"]') ||
                  node.querySelector?.('[class^="_messageDisplayWrapper_"]')) {
                shouldReinject = true;
                break;
              }
            }
          }
        }
        if (mutation.type === 'characterData') { shouldCheck = true; }
        if (shouldReinject) break;
      }

      // Track active swipes periodically (debounced)
      clearTimeout(window.imageGenSwipeTrackTimeout);
      window.imageGenSwipeTrackTimeout = setTimeout(() => {
        updateActiveSwipesTracking();
      }, 500);

      // Re-inject images when DOM structure changes (debounced)
      if (shouldReinject) {
        clearTimeout(window.imageGenReinjectTimeout);
        window.imageGenReinjectTimeout = setTimeout(() => {
          // NOTE: Consolidation is now only triggered when user actually sends a message
          // (detected via message count increase), not on every DOM change
          // This prevents history corruption when scrolling causes messages to be virtualized
          reinjectImagesFromHistory();
        }, 200);
      }

      // Auto-generation logic
      if (shouldCheck && currentSettings.enabled && currentSettings.autoGeneration) {
        clearTimeout(window.imageGenObserverTimeout);
        window.imageGenObserverTimeout = setTimeout(logLastFinishedMessage, 300);
      }
    });

    observer.observe(chatContainer, { childList: true, subtree: true, characterData: true });
    logLastFinishedMessage();
  }

  // ==========================================================
  // SECCIÓN 7. HISTORY REINJECTION
  // ==========================================================

  function reinjectImagesFromHistory() {
    const settings = loadSettings();
    // Note: We check loadHistoryOnPageLoad only for initial load, not for re-injection during runtime
    // This function is now also called when DOM changes, so we should always try to reinject
    const history = loadImageHistory();
    if (history.length === 0) {
      console.log(`[ImageGen] 🔄 No history to reinject`);
      return;
    }

    const allNodes = document.querySelectorAll(MESSAGE_CONTAINER_SELECTOR);
    let injectedCount = 0;
    let notFoundCount = 0;
    let alreadyInjectedCount = 0;

    // Build set of visible message indices for logging
    const visibleIndices = new Set();
    allNodes.forEach(node => {
      const idx = parseInt(node.dataset.index, 10);
      if (!isNaN(idx)) visibleIndices.add(idx);
    });
    console.log(`[ImageGen] 🔄 Reinjecting: ${history.length} items in history, ${visibleIndices.size} messages visible in DOM (indices: ${[...visibleIndices].sort((a,b)=>a-b).join(', ')})`);

    history.forEach(item => {
      let found = false;
      for (const node of allNodes) {
        if (parseInt(node.dataset.index, 10) === item.messageIndex) {
          found = true;
          let targetWrapper = null;
          // Bot logic with swipes
          if (node.querySelector(BOT_NAME_ICON_SELECTOR)) {
            const swipeContainer = node.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
            if (swipeContainer) {
               const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
               if (slider) {
                 const swipes = slider.querySelectorAll(MESSAGE_WRAPPER_SELECTOR);
                 if (swipes[item.swipeIndex]) targetWrapper = swipes[item.swipeIndex];
               }
            } else if (item.swipeIndex === 0) {
               targetWrapper = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
            }
          }
          // User logic
          else if (item.swipeIndex === 0) {
             targetWrapper = node.querySelector(MESSAGE_WRAPPER_SELECTOR);
          }

          if (targetWrapper) {
             // Use the updated injectImageIntoMessage which handles galleries
             // Pass -1 for messageIndex to avoid re-adding to history
             const result = injectImageIntoMessage(targetWrapper, item.imageUrl, -1, item.swipeIndex);
             if (result) {
               injectedCount++;
             } else {
               alreadyInjectedCount++;
             }
          }
          break;
        }
      }
      if (!found) {
        notFoundCount++;
      }
    });

    if (injectedCount > 0 || notFoundCount > 0) {
      console.log(`[ImageGen] 🔄 Reinjection complete: ${injectedCount} injected, ${alreadyInjectedCount} already present, ${notFoundCount} not visible in DOM`);
    }
  }

  // ==========================================================
  // SECCIÓN 8. MANUAL BUTTONS
  // ==========================================================

  // Helper function to handle uploaded image processing
  async function handleUploadedImage(file, wrapper, msgIndex, swipeIdx) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result; // This is the full data:image/...;base64,... string
        console.log("[ImageGen] 📤 Image uploaded, processing...");

        try {
          // Inject the image first
          const injected = injectImageIntoMessage(wrapper, base64Data, msgIndex, swipeIdx);
          if (injected) {
            console.log("[ImageGen] ✅ Uploaded image injected into message");
          }
          resolve(base64Data);
        } catch (err) {
          console.error("[ImageGen] Failed to process uploaded image:", err);
          reject(err);
        }
      };
      reader.onerror = (err) => {
        console.error("[ImageGen] Failed to read file:", err);
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  }

  function injectImageGenButton(panel) {
    // Check if buttons already exist
    if (panel.querySelector('.imagegen-btn') || panel.querySelector('.imagegen-upload-btn')) return;
    if (!currentSettings.enabled) return;

    const wrapper = panel.closest(MESSAGE_WRAPPER_SELECTOR);
    if (!wrapper) return;
    const container = panel.closest('[data-index]');
    const isBot = !!(container && container.querySelector(BOT_NAME_ICON_SELECTOR));
    if (!isBot && !currentSettings.generateUserImages) return;

    // Helper to get message index and swipe index
    const getMessageContext = () => {
      const msgIndex = container ? parseInt(container.dataset.index, 10) : -1;
      let swipeIdx = 0;
      if (isBot && container) {
        const swipeContainer = container.querySelector(LAST_MESSAGE_SWIPE_CONTAINER_SELECTOR);
        if (swipeContainer) {
          const slider = swipeContainer.querySelector(SWIPE_SLIDER_SELECTOR);
          if (slider) {
            const tx = slider.style.transform ? parseFloat(slider.style.transform.match(/translateX\(([-0-9.]+)%\)/)?.[1] || "0") : 0;
            swipeIdx = Math.round(Math.abs(tx) / 100);
          }
        }
      }
      return { msgIndex, swipeIdx };
    };

    // Generate Image Button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "_controlPanelButton_prxth_8 imagegen-btn";
    btn.style.marginLeft = "4px";
    btn.style.marginRight = "4px";
    btn.title = "Generate Image";
    btn.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="9" r="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" fill="none" stroke="currentColor" stroke-width="2"/></svg>`;

    btn.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();

        const { msgIndex, swipeIdx } = getMessageContext();

        const text = extractFormattedMessageText(wrapper);
        if (!text) return;

        // Handle Test Mode vs Gemini
        const settings = loadSettings();
        if (settings.testMode && settings.testImageUrl) {
            injectImageIntoMessage(wrapper, settings.testImageUrl, msgIndex, swipeIdx);
            console.log("[ImageGen] Manual test injection");
        } else {
            const prompt = processContextualPrompt(text, msgIndex);
            requestGeminiGeneration(prompt, msgIndex, swipeIdx);
        }
    };

    // Upload Image Button
    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.className = "_controlPanelButton_prxth_8 imagegen-upload-btn";
    uploadBtn.style.marginLeft = "4px";
    uploadBtn.style.marginRight = "4px";
    uploadBtn.title = "Upload Image";
    uploadBtn.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 8 12 3 7 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="3" x2="12" y2="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // Hidden file input for image upload
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.className = "imagegen-upload-input";
    fileInput.style.display = "none";

    fileInput.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Visual feedback
      uploadBtn.style.opacity = "0.5";
      uploadBtn.title = "Uploading...";

      try {
        const { msgIndex, swipeIdx } = getMessageContext();
        await handleUploadedImage(file, wrapper, msgIndex, swipeIdx);
      } catch (err) {
        console.error("[ImageGen] Upload failed:", err);
      } finally {
        // Reset button state
        uploadBtn.style.opacity = "";
        uploadBtn.title = "Upload Image";
        // Reset file input so same file can be selected again
        fileInput.value = "";
      }
    };

    uploadBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileInput.click();
    };

    // Insert buttons into panel
    panel.insertBefore(uploadBtn, panel.firstChild);
    panel.insertBefore(fileInput, panel.firstChild);
    panel.insertBefore(btn, panel.firstChild);
  }

  function updateImageGenButtonsVisibility() {
    document.querySelectorAll('.imagegen-btn').forEach(b => b.remove());
    document.querySelectorAll('.imagegen-upload-btn').forEach(b => b.remove());
    document.querySelectorAll('.imagegen-upload-input').forEach(b => b.remove());
    if (currentSettings.enabled) {
      document.querySelectorAll(CONTROL_PANEL_SELECTOR).forEach(injectImageGenButton);
    }
  }

  const controlPanelObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        const panels = node.matches && node.matches(CONTROL_PANEL_SELECTOR) ? [node] : (node.querySelectorAll ? node.querySelectorAll(CONTROL_PANEL_SELECTOR) : []);
        panels.forEach(injectImageGenButton);
      }
    }
  });

  function startControlPanelObserver() {
    const chatContainer = document.querySelector('[class^="_messagesMain_"]') || document.body;
    controlPanelObserver.observe(chatContainer, { childList: true, subtree: true });
    document.querySelectorAll(CONTROL_PANEL_SELECTOR).forEach(injectImageGenButton);
  }

  // --- INIT ---
  function initializeScript() {
    // Run migration for old history format
    migrateOldHistoryFormat();

    initializeObserver();
    startControlPanelObserver();
    initializeEditModeObserver();
    initializePopoverObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeScript);
  } else {
    initializeScript();
  }

  console.log("[ImageGen] JanitorAI + Gemini Script Fully Initialized.");

})();
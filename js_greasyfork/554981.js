// ==UserScript==
// @name         Discourse Customizable Quick Replies
// @namespace    https://github.com/stevessr/bug-v3
// @version      2.1.0
// @description  Adds customizable quick replies with a UI to Discourse forums, with enhanced UI theming.
// @author       stevessr (modified by an AI assistant)
// @match        https://linux.do/*
// @match        https://meta.discourse.org/*
// @match        https://*.discourse.org/*
// @match        http://localhost:5173/*
// @exclude      https://linux.do/a/*
// @match        https://idcflare.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/stevessr/bug-v3
// @supportURL   https://github.com/stevessr/bug-v3/issues
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554981/Discourse%20Customizable%20Quick%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/554981/Discourse%20Customizable%20Quick%20Replies.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== Settings Management =====
  const SETTINGS_KEY = 'custom_quick_replies_settings';
  let quickReplies = [];

  const DEFAULT_QUICK_REPLIES = [
    { display: 'Info', insert: '>[!info]+\n', prefix: '[!info' },
    { display: 'Tip', insert: '>[!tip]+\n', prefix: '[!tip' },
    { display: 'Success', insert: '>[!success]+\n', prefix: '[!success' },
    { display: 'Warning', insert: '>[!warning]+\n', prefix: '[!warning' },
    { display: 'Danger', insert: '>[!danger]+\n', prefix: '[!danger' },
  ];

  function loadQuickReplies() {
    try {
      const settingsData = localStorage.getItem(SETTINGS_KEY);
      if (settingsData) {
        quickReplies = JSON.parse(settingsData);
      } else {
        quickReplies = DEFAULT_QUICK_REPLIES;
      }
    } catch (e) {
      console.warn('[Quick Replies] Failed to load settings:', e);
      quickReplies = DEFAULT_QUICK_REPLIES;
    }
  }

  function saveQuickReplies() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(quickReplies));
    } catch (e) {
      console.error('[Quick Replies] Failed to save settings:', e);
    }
  }

  // ===== Suggestion Box =====
  let suggestionBox = null;
  let activeSuggestionIndex = 0;

  // ===== Entry Point =====
  if (isDiscoursePage()) {
    console.log('[Quick Replies] Discourse detected, initializing...');
    loadQuickReplies();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initQuickReplyFeatures();
        initQuickInsertButton();
      });
    } else {
      initQuickReplyFeatures();
      initQuickInsertButton();
    }
  }

  // ===== Detailed Implementation =====

  function isDiscoursePage() {
    return document.querySelector('#main-outlet, .ember-application, textarea.d-editor-input, .ProseMirror.d-editor-input');
  }

  function initQuickReplyFeatures() {
    createSuggestionBox();
    document.addEventListener('input', handleInput, true);
    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('click', e => {
      if (e.target && e.target.tagName !== 'TEXTAREA' && suggestionBox && !suggestionBox.contains(e.target)) {
        hideSuggestionBox();
      }
    });
    console.log('[Quick Replies] Suggestion features initialized.');
  }

  function initQuickInsertButton() {
    const observer = new MutationObserver(() => {
      const toolbars = document.querySelectorAll('.d-editor-button-bar, .chat-composer__inner-container');
      toolbars.forEach(toolbar => {
        if (!toolbar.querySelector('.quick-reply-settings-btn')) {
          injectQuickInsertButton(toolbar);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[Quick Replies] Quick insert button observer initialized.');
  }

  function injectQuickInsertButton(toolbar) {
    const quickInsertButton = document.createElement('button');
    quickInsertButton.className = 'btn no-text btn-icon toolbar__button quick-insert-button';
    quickInsertButton.title = 'Quick Replies';
    quickInsertButton.innerHTML = '⎘';
    quickInsertButton.addEventListener('click', e => {
      e.stopPropagation();
      toggleQuickInsertMenu(quickInsertButton);
    });

    const settingsButton = document.createElement('button');
    settingsButton.className = 'btn no-text btn-icon toolbar__button quick-reply-settings-btn';
    settingsButton.title = 'Quick Reply Settings';
    settingsButton.innerHTML = '⚙️';
    settingsButton.addEventListener('click', e => {
      e.stopPropagation();
      createSettingsUI();
    });

    toolbar.appendChild(quickInsertButton);
    toolbar.appendChild(settingsButton);
  }

  function toggleQuickInsertMenu(button) {
    let menu = document.getElementById('quick-insert-menu');
    if (menu) {
      menu.remove();
      return;
    }
    menu = createQuickInsertMenu();
    document.body.appendChild(menu);
    const rect = button.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left}px`;

    const removeMenu = ev => {
      if (menu && !menu.contains(ev.target)) {
        menu.remove();
        document.removeEventListener('click', removeMenu);
      }
    };
    setTimeout(() => document.addEventListener('click', removeMenu), 100);
  }

  function createQuickInsertMenu() {
    const menu = document.createElement('div');
    menu.id = 'quick-insert-menu';
    menu.style.cssText = `
      position: absolute;
      background-color: var(--secondary);
      border: 1px solid var(--primary-low-mid);
      border-radius: 6px;
      box-shadow: var(--d-shadow-medium);
      z-index: 10000;
      padding: 5px;
    `;
    quickReplies.forEach(reply => {
      const item = document.createElement('div');
      item.textContent = reply.display;
      item.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        color: var(--primary-high);
        border-radius: 4px;
      `;
      item.onmouseover = () => item.style.backgroundColor = 'var(--d-hover)';
      item.onmouseout = () => item.style.backgroundColor = 'transparent';
      item.addEventListener('click', () => {
        insertIntoEditor(reply.insert);
        toggleQuickInsertMenu(); // Close menu
      });
      menu.appendChild(item);
    });
    return menu;
  }

  function insertIntoEditor(text) {
    const textarea = document.querySelector('textarea.d-editor-input, textarea.ember-text-area');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        document.execCommand('insertText', false, text);
    }
  }

  // --- Suggestion Box Functions ---

  function createSuggestionBox() {
    if (suggestionBox) return;
    suggestionBox = document.createElement('div');
    suggestionBox.id = 'callout-suggestion-box';
    document.body.appendChild(suggestionBox);
    const style = document.createElement('style');
    style.textContent = `
      #callout-suggestion-box {
        position: absolute;
        background-color: var(--secondary);
        border: 1px solid var(--primary-low-mid);
        border-radius: 6px;
        box-shadow: var(--d-shadow-medium);
        z-index: 999999;
        padding: 5px;
        display: none;
      }
      .callout-suggestion-item {
        padding: 8px 12px;
        cursor: pointer;
        color: var(--primary-high);
        border-radius: 4px;
      }
      .callout-suggestion-item.active {
        background-color: var(--d-hover) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function hideSuggestionBox() {
    if (suggestionBox) suggestionBox.style.display = 'none';
  }

  function updateSuggestionBox(element, matches) {
    if (!suggestionBox || matches.length === 0) {
      hideSuggestionBox();
      return;
    }
    suggestionBox.innerHTML = matches.map((reply, index) =>
      `<div class="callout-suggestion-item" data-index="${index}">${reply.display}</div>`
    ).join('');

    suggestionBox.querySelectorAll('.callout-suggestion-item').forEach((item, index) => {
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        applyCompletion(element, matches[index]);
        hideSuggestionBox();
      });
    });

    const cursorPos = getCursorXY(element);
    suggestionBox.style.display = 'block';
    suggestionBox.style.left = `${cursorPos.x}px`;
    suggestionBox.style.top = `${cursorPos.bottom}px`;
    activeSuggestionIndex = 0;
    updateActiveSuggestion();
  }

    function updateActiveSuggestion() {
        if (!suggestionBox) return;
        const items = suggestionBox.querySelectorAll('.callout-suggestion-item');
        items.forEach((item, idx) => {
            item.classList.toggle('active', idx === activeSuggestionIndex);
            if (idx === activeSuggestionIndex) {
                item.scrollIntoView({ block: 'nearest' });
            }
        });
    }

  function handleInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    const textBeforeCursor = target.value.substring(0, target.selectionStart);
    const matches = quickReplies.filter(reply => textBeforeCursor.endsWith(reply.prefix));
    if (matches.length > 0) {
      updateSuggestionBox(target, matches);
    } else {
      hideSuggestionBox();
    }
  }

  function handleKeydown(event) {
    if (!suggestionBox || suggestionBox.style.display === 'none') return;
    const items = suggestionBox.querySelectorAll('.callout-suggestion-item');
    if (items.length === 0) return;
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
    }
    switch (event.key) {
        case 'ArrowDown':
            activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
            updateActiveSuggestion();
            break;
        case 'ArrowUp':
            activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
            updateActiveSuggestion();
            break;
        case 'Enter':
            const selectedItem = suggestionBox.querySelector(`.callout-suggestion-item[data-index="${activeSuggestionIndex}"]`);
            if (selectedItem) {
                const textBeforeCursor = document.activeElement.value.substring(0, document.activeElement.selectionStart);
                const matches = quickReplies.filter(reply => textBeforeCursor.endsWith(reply.prefix));
                if (matches.length > 0) {
                    applyCompletion(document.activeElement, matches[activeSuggestionIndex]);
                }
            }
            hideSuggestionBox();
            break;
        case 'Escape':
            hideSuggestionBox();
            break;
    }
  }

  function applyCompletion(element, selectedReply) {
    const text = element.value;
    const selectionStart = element.selectionStart;
    const textBeforeCursor = text.substring(0, selectionStart);
    const triggerIndex = textBeforeCursor.lastIndexOf(selectedReply.prefix);

    if (triggerIndex !== -1) {
        const textAfter = text.substring(selectionStart);
        element.value = text.substring(0, triggerIndex) + selectedReply.insert + textAfter;
        const newCursorPos = triggerIndex + selectedReply.insert.length;
        element.selectionStart = element.selectionEnd = newCursorPos;
        element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function getCursorXY(element) {
    const mirrorId = 'textarea-mirror-div';
    let mirror = document.getElementById(mirrorId);
    if (!mirror) {
        mirror = document.createElement('div');
        mirror.id = mirrorId;
        document.body.appendChild(mirror);
    }
    const style = window.getComputedStyle(element);
    const props = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'padding', 'border'];
    props.forEach(p => mirror.style[p] = style[p]);
    mirror.style.position = 'absolute';
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre-wrap';
    mirror.style.wordWrap = 'break-word';
    mirror.style.left = `${element.offsetLeft}px`;
    mirror.style.top = `${element.offsetTop}px`;
    mirror.style.width = `${element.clientWidth}px`;
    mirror.style.height = 'auto';

    const textUpToCursor = element.value.substring(0, element.selectionEnd);
    mirror.textContent = textUpToCursor;
    const span = document.createElement('span');
    span.textContent = '.';
    mirror.appendChild(span);

    const rect = element.getBoundingClientRect();
    const spanRect = span.getBoundingClientRect();
    return {
        x: rect.left + span.offsetLeft,
        y: rect.top + span.offsetTop,
        bottom: rect.top + span.offsetTop + span.offsetHeight,
    };
  }


  // --- Settings UI ---

  function createSettingsUI() {
    let modal = document.getElementById('quick-reply-settings-modal');
    if (modal) {
      modal.remove();
      return;
    }

    modal = document.createElement('div');
    modal.id = 'quick-reply-settings-modal';
    modal.style.cssText = `
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 600px; max-width: 90vw; max-height: 80vh;
      background-color: var(--secondary);
      color: var(--primary-high);
      border: 1px solid var(--primary-low-mid);
      border-radius: 8px;
      z-index: 10001;
      box-shadow: var(--d-shadow-huge);
      display: flex; flex-direction: column;
    `;

    const header = document.createElement('div');
    header.textContent = 'Quick Reply Settings';
    header.style.cssText = 'font-size: 1.2em; padding: 15px; border-bottom: 1px solid var(--primary-low-mid);';

    const content = document.createElement('div');
    content.id = 'quick-reply-list-container';
    content.style.cssText = 'padding: 15px; overflow-y: auto;';

    const footer = document.createElement('div');
    footer.style.cssText = 'padding: 15px; border-top: 1px solid var(--primary-low-mid); display: flex; justify-content: space-between; align-items: center;';

    const addButton = document.createElement('button');
    addButton.textContent = 'Add New';
    addButton.className = 'btn';
    addButton.onclick = () => {
        quickReplies.push({ display: 'New Reply', insert: '', prefix: ''});
        renderQuickReplyList(content);
    };

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save and Close';
    saveButton.className = 'btn btn-primary';
    saveButton.onclick = () => {
        saveQuickReplies();
        modal.remove();
    };

    footer.appendChild(addButton);
    footer.appendChild(saveButton);

    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(footer);
    document.body.appendChild(modal);

    renderQuickReplyList(content);
  }

  function renderQuickReplyList(container) {
    container.innerHTML = '';
    quickReplies.forEach((reply, index) => {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px; gap: 10px;';

        const inputs = ['display', 'insert', 'prefix'].map(key => {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = key.charAt(0).toUpperCase() + key.slice(1);
            input.value = reply[key];
            input.style.cssText = `
              flex: 1;
              padding: 8px;
              background-color: var(--input-background);
              border: 1px solid var(--primary-low-mid);
              color: var(--primary-high);
              border-radius: 5px;
            `;
            input.oninput = () => quickReplies[index][key] = input.value;
            return input;
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger';
        deleteButton.onclick = () => {
            quickReplies.splice(index, 1);
            renderQuickReplyList(container);
        };

        inputs.forEach(input => item.appendChild(input));
        item.appendChild(deleteButton);
        container.appendChild(item);
    });
  }
})();
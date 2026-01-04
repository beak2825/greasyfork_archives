// ==UserScript==
// @name         DeepSeek System Prompt Injector
// @name:zh-CN   深度搜索系统提示词
// @namespace    https://github.com/NoahTheGinger/
// @version      2.5.1
// @description  System prompt + presets for DeepSeek with header toggle button
// @description:zh-CN 深度搜索系统提示词.
// @match        https://chat.deepseek.com
// @match        https://chat.deepseek.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556036/DeepSeek%20System%20Prompt%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/556036/DeepSeek%20System%20Prompt%20Injector.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEBUG = true;

  const STORAGE_KEY = 'deepseek_system_prompt';
  const ENABLED_KEY = 'deepseek_system_prompt_enabled';
  const INDICATOR_POS_KEY = 'deepseek_system_prompt_indicator_pos'; // legacy, не используется
  const PRESETS_KEY = 'deepseek_system_prompt_presets';
  const ACTIVE_PRESET_KEY = 'deepseek_system_prompt_active_preset';

  const API_PATTERNS = [
    '/api/v0/chat/completion',
    '/chat/completions',
    '/v1/chat/completions',
  ];

  const locale = {
    en: {
      set: '⚙️ Set System Prompt',
      clear: '🗑️ Clear System Prompt',
      toggle: '🔄 Toggle System Prompt',
      view: '👁️ View Current System Prompt',
      prompt:
        'Enter system prompt for DeepSeek:\n\n' +
        'This will be sent as a system-level instruction before every message.',
      updated: '✅ System Prompt Updated!',
      confirm: 'Are you sure you want to clear the system prompt?',
      cleared: 'System prompt cleared!',
      enabled: '✅ System Prompt Enabled',
      disabled: '❌ System Prompt Disabled',
      current: 'Current System Prompt:',
      none: 'No system prompt set.',
      systemPrefix: 'SYSTEM INSTRUCTION',
      separator: '─'.repeat(50),
      indicatorNoPrompt: '🤖 No System Prompt',
      indicatorActive: '🤖 System Prompt Active',
      indicatorDisabled: '🤖 System Prompt Disabled',
      indicatorLabel: 'Prompt',
      modalTitle: 'System Prompt',
      modalHint: 'Ctrl+Enter — save, Esc — close without saving.',
      modalEnabledLabel: 'Enabled',
      modalSave: 'Save',
      modalCancel: 'Cancel',
      presetsTitle: 'Preset',
      presetsEmpty: 'No presets yet.',
      presetsSaveCurrent: 'Save current as preset',
      presetsDelete: 'Delete',
      presetNamePrompt: 'Preset name:',
      presetDeleteConfirm: 'Delete this preset?',
      presetSaved: 'Preset saved.',
      presetsSelectPlaceholder: 'Select preset',
      presetsNoneOption: 'No preset',
    },
    zh: {
      set: '⚙️ 设置系统提示词',
      clear: '🗑️ 清除系统提示词',
      toggle: '🔄 切换系统提示词',
      view: '👁️ 查看当前系统提示词',
      prompt:
        '输入DeepSeek的系统提示词：\n\n' +
        '这将作为系统级指令在每条消息前发送。',
      updated: '✅ 系统提示词已更新！',
      confirm: '确定要清除系统提示词吗？',
      cleared: '系统提示词已清除！',
      enabled: '✅ 系统提示词已启用',
      disabled: '❌ 系统提示词已禁用',
      current: '当前系统提示词：',
      none: '未设置系统提示词。',
      systemPrefix: '系统指令',
      separator: '─'.repeat(50),
      indicatorNoPrompt: '🤖 未设置系统提示词',
      indicatorActive: '🤖 系统提示词已启用',
      indicatorDisabled: '🤖 系统提示词已禁用',
      indicatorLabel: '提示词',
      modalTitle: '系统提示词',
      modalHint: 'Ctrl+Enter 保存，Esc 关闭而不保存。',
      modalEnabledLabel: '启用',
      modalSave: '保存',
      modalCancel: '取消',
      presetsTitle: '预设',
      presetsEmpty: '尚无预设。',
      presetsSaveCurrent: '将当前保存为预设',
      presetsDelete: '删除',
      presetNamePrompt: '预设名称：',
      presetDeleteConfirm: '确定删除该预设？',
      presetSaved: '预设已保存。',
      presetsSelectPlaceholder: '选择预设',
      presetsNoneOption: '无预设',
    },
    ru: {
      set: '⚙️ Задать системный промпт',
      clear: '🗑️ Очистить системный промпт',
      toggle: '🔄 Включить/выключить промпт',
      view: '👁️ Открыть редактор промпта',
      prompt:
        'Введите системный промпт для DeepSeek:\n\n' +
        'Он будет отправляться как системная инструкция перед каждым сообщением.',
      updated: '✅ Системный промпт обновлён!',
      confirm: 'Точно очистить системный промпт?',
      cleared: 'Системный промпт очищен!',
      enabled: '✅ Системный промпт включён',
      disabled: '❌ Системный промпт выключен',
      current: 'Текущий системный промпт:',
      none: 'Системный промпт не задан.',
      systemPrefix: 'SYSTEM INSTRUCTION',
      separator: '─'.repeat(50),
      indicatorNoPrompt: '🤖 Промпт не задан',
      indicatorActive: '🤖 Промпт активен',
      indicatorDisabled: '🤖 Промпт отключён',
      indicatorLabel: 'Промпт',
      modalTitle: 'Системный промпт',
      modalHint: 'Ctrl+Enter — сохранить, Esc — закрыть без сохранения.',
      modalEnabledLabel: 'Включить промпт',
      modalSave: 'Сохранить',
      modalCancel: 'Отмена',
      presetsTitle: 'Пресет',
      presetsEmpty: 'Пока нет ни одного пресета.',
      presetsSaveCurrent: 'Сохранить текущий как пресет',
      presetsDelete: 'Удалить',
      presetNamePrompt: 'Название пресета:',
      presetDeleteConfirm: 'Удалить этот пресет?',
      presetSaved: 'Пресет сохранён.',
      presetsSelectPlaceholder: 'Выберите пресет',
      presetsNoneOption: 'Без пресета',
    },
  };

  const lang = (navigator.language || '').toLowerCase();
  const t =
    lang.startsWith('ru') ? locale.ru :
    lang.startsWith('zh') ? locale.zh :
    locale.en;

  let systemPrompt = GM_getValue(STORAGE_KEY, '');
  let isEnabled = GM_getValue(ENABLED_KEY, true);
  let indicatorPos = GM_getValue(INDICATOR_POS_KEY, null); // legacy
  let presets = GM_getValue(PRESETS_KEY, []);
  let activePresetId = GM_getValue(ACTIVE_PRESET_KEY, null);

  if (!Array.isArray(presets)) presets = [];

  const interceptedInstances = new WeakSet();

  function log(...args) {
    if (DEBUG) console.log('[DeepSeek System Prompt v2]', ...args);
  }

  function savePresets() {
    GM_setValue(PRESETS_KEY, presets);
  }

  GM_addStyle(`
 .deepseek-system-prompt-indicator {
    pointer-events: auto;
    cursor: pointer;
  }

  /* Иконка: серый по умолчанию, синий только когда кнопка активна */
  .deepseek-system-prompt-indicator .ds-atom-button__icon {
    font-size: 14px;
    width: 14px;
    height: 14px;
    margin-right: 6px; /* такой же визуальный отступ, как у соседних кнопок */
    color: var(--dsw-alias-label-primary, #9ca3af);
  }
  .deepseek-system-prompt-indicator.active .ds-atom-button__icon,
  .deepseek-system-prompt-indicator.ds-toggle-button--selected .ds-atom-button__icon {
    color: var(--dsw-alias-brand-text, #2563eb);
  }

  /* Текст: фиксируем Open Sans, остальное наследуем от кнопки */
  .deepseek-system-prompt-label {
    font-family: "Open Sans", system-ui, -apple-system, BlinkMacSystemFont,
                 "Segoe UI", sans-serif;
    font: inherit;
    white-space: nowrap;
  }

  /* На узких экранах убираем и текст, и отступ от иконки */
  @media (max-width: 768px) {
    .deepseek-system-prompt-label {
      display: none;
    }
    .deepseek-system-prompt-indicator .ds-atom-button__icon {
      margin-right: 0;
    }
  }
    .deepseek-prompt-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.35);
      z-index: 10001;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(2px);
    }
    .deepseek-prompt-modal {
      max-width: 700px;
      width: 90%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }
    .deepseek-prompt-modal-body {
      margin-top: 12px;
      max-height: 50vh;
      overflow: auto;
    }
    .deepseek-prompt-modal-body textarea {
      width: 100%;
      min-height: 220px;
      resize: vertical;
      background: transparent;
      color: inherit;
      border-radius: 10px;
      border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.1));
      padding: 6px 10px;
      font-family: var(--ds-font-family-code, monospace);
      font-size: 12px;
      box-sizing: border-box;
    }
    [data-ds-dark-theme] .deepseek-prompt-modal-body textarea {
      border-color: var(--dsw-alias-border-l2, rgba(255,255,255,.12));
    }
    .deepseek-prompt-modal-hint {
      margin-top: 6px;
      font-size: 11px;
      opacity: 0.8;
    }
    .deepseek-prompt-modal-footer {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .deepseek-prompt-footer-left {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--dsw-alias-label-primary, #111827);
    }
    [data-ds-dark-theme] .deepseek-prompt-footer-left {
      color: var(--dsw-alias-label-primary, #e5e7eb);
    }
    .deepseek-prompt-footer-right {
      display: flex;
      gap: 8px;
    }
    .deepseek-preset-section {
      margin-top: 10px;
      border-top: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.08));
      padding-top: 8px;
    }
    [data-ds-dark-theme] .deepseek-preset-section {
      border-color: var(--dsw-alias-border-l2, rgba(255,255,255,.12));
    }
    .deepseek-preset-row {
      padding: 12px 0;
      min-height: 60px;
      box-sizing: border-box;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }
    .deepseek-preset-label {
      font-size: 13px;
      color: var(--dsw-alias-label-primary, #111827);
    }
    [data-ds-dark-theme] .deepseek-preset-label {
      color: var(--dsw-alias-label-primary, #e5e7eb);
    }
    .deepseek-preset-dropdown {
      margin-top: 4px;
      max-height: 200px;
      overflow-y: auto;
      border-radius: 8px;
      border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,.1));
      background: var(--dsw-alias-bg-layer-3, #fff);
      box-shadow: var(--dsw-shadow-lv3, 0 3px 6px -4px rgba(0,0,0,.12),
                      0 6px 16px rgba(0,0,0,.08),
                      0 9px 28px 8px rgba(0,0,0,.05));
      padding: 4px 0;
      z-index: 10002;
    }
    [data-ds-dark-theme] .deepseek-preset-dropdown {
      background: var(--dsw-alias-bg-layer-3, #111827);
      border-color: var(--dsw-alias-border-l2, rgba(255,255,255,.12));
    }
    .deepseek-preset-option {
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .deepseek-preset-option:hover {
      background: var(--dsw-alias-interactive-bg-hover, rgba(17,24,39,.04));
    }
    [data-ds-dark-theme] .deepseek-preset-option:hover {
      background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.06));
    }
    .deepseek-preset-option--active {
      color: var(--dsw-alias-brand-primary, #3964fe);
    }
    .deepseek-preset-empty {
      font-size: 11px;
      opacity: 0.7;
      padding: 4px 0;
    }
    .deepseek-preset-save-button {
      margin-top: 8px;
    }
  `);

  // === Индикатор в шапке ===

  function ensureHeaderIndicator() {
    let indicator = document.querySelector('.deepseek-system-prompt-indicator');
    if (indicator) return indicator;

    const allButtons = Array.from(document.querySelectorAll('button'));

    const deepThinkBtn = allButtons.find((btn) =>
      (btn.textContent || '').trim().includes('DeepThink'),
    );
    const searchBtn = allButtons.find((btn) =>
      (btn.textContent || '').trim().includes('Search'),
    );

    const anchorBtn = searchBtn || deepThinkBtn;
    if (!anchorBtn) {
      if (DEBUG) log('No DeepThink/Search button found yet');
      return null;
    }

    indicator = document.createElement('button');
    indicator.type = 'button';
    indicator.className =
      'deepseek-system-prompt-indicator ds-atom-button f79352dc ds-toggle-button ds-toggle-button--md';
    indicator.setAttribute('aria-label', 'System Prompt');

    indicator.innerHTML = `
  <div class="ds-icon ds-atom-button__icon">
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"
         xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor"
        d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.1 7.1 0 00-1.62-.94l-.36-2.54A.5.5 0 0014 2h-4a.5.5 0 00-.49.42l-.36 2.54c-.6.24-1.14.56-1.62.94l-2.39-.96a.5.5 0 00-.61.22L2.22 8.7a.5.5 0 00.12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.34 13.4a.5.5 0 00-.12.64l1.92 3.32a.5.5 0 00.61.22l2.39-.96c.48.38 1.02.7 1.62.94l.36 2.54A.5.5 0 0010 22h4a.5.5 0 00.49-.42l.36-2.54c.6-.24 1.14-.56 1.62-.94l2.39.96a.5.5 0 00.61-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zm-7.14 2.06a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  </div>
  <span class="deepseek-system-prompt-label">${t.indicatorLabel}</span>
`;

    anchorBtn.insertAdjacentElement('afterend', indicator);

    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      openPromptEditor();
    });

    try {
      window.dispatchEvent(new Event('resize'));
    } catch {}

    return indicator;
  }

  function updateIndicator() {
    if (!document.body) return;

    const indicator = ensureHeaderIndicator();
    if (!indicator) return;

    indicator.className =
      'deepseek-system-prompt-indicator ds-atom-button f79352dc ds-toggle-button ds-toggle-button--md';

    const hasPrompt = !!systemPrompt;

    if (!hasPrompt) {
      indicator.classList.add('none');
      indicator.setAttribute('aria-pressed', 'false');
    } else if (isEnabled) {
      indicator.classList.add('ds-toggle-button--selected', 'active');
      indicator.setAttribute('aria-pressed', 'true');
    } else {
      indicator.classList.add('inactive');
      indicator.setAttribute('aria-pressed', 'false');
    }
  }

  // === Скрытие SYSTEM INSTRUCTION ===

  function stripSystemInstructionFromText(text) {
    if (!text || !text.includes('[' + t.systemPrefix + ']')) return text;

    const prefix = '[' + t.systemPrefix + ']';
    const userMarker = '[USER MESSAGE]';

    const start = text.indexOf(prefix);
    const user = text.indexOf(userMarker);
    if (start === -1 || user === -1 || user < start) return text;

    const before = text.slice(0, start);
    const after = text.slice(user + userMarker.length);
    return (before + after).trimStart();
  }

  function cleanSystemInstructionInElement(root) {
    if (!root) return;

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const toChange = [];
    let node;
    while ((node = walker.nextNode())) {
      if (
        node.nodeValue &&
        node.nodeValue.includes('[' + t.systemPrefix + ']')
      ) {
        toChange.push(node);
      }
    }

    for (const n of toChange) {
      n.nodeValue = stripSystemInstructionFromText(n.nodeValue);
    }
  }

  const systemInstructionObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        if (
          node.matches('.ds-markdown, [data-testid="message-text"], .markdown-body') ||
          node.querySelector('.ds-markdown, [data-testid="message-text"], .markdown-body')
        ) {
          cleanSystemInstructionInElement(node);
        }
      }
    }
  });

  function startSystemInstructionCleaner() {
    const root = document.querySelector('#__next') || document.body;
    cleanSystemInstructionInElement(root);

    systemInstructionObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // === Модалка + пресеты (select) ===

  function openPromptEditor() {
    if (!document.body) return;
    if (document.querySelector('.deepseek-prompt-modal-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'deepseek-prompt-modal-backdrop';

    const modal = document.createElement('div');
    modal.className =
      'ds-modal-content ds-modal-content--dialog deepseek-prompt-modal';

    modal.innerHTML = `
      <div class="ds-modal-content__header-wrapper">
        <div class="ds-modal-content__title">${t.modalTitle}</div>
        <button class="ds-atom-button ds-modal-content__close" type="button" aria-label="Close">
          <span class="ds-icon" style="font-size:16px;line-height:0;">✕</span>
        </button>
      </div>
      <div class="deepseek-prompt-modal-body">
        <textarea spellcheck="false"></textarea>
        <div class="deepseek-prompt-modal-hint">
          ${t.modalHint}
        </div>
        <div class="deepseek-preset-section">
          <div class="ds-flex deepseek-preset-row">
            <div class="deepseek-preset-label">${t.presetsTitle}</div>
            <div class="deepseek-preset-select e311289c ds-select ds-select--filled ds-select--none ds-select--m" tabindex="0">
              <div class="ds-select__select deepseek-preset-select-value">${t.presetsSelectPlaceholder}</div>
              <div class="ds-select__arrow" aria-hidden="true">
                <svg viewBox="0 0 512 512">
                  <path d="M256,294.1L383,167c9.4-9.4,24.6-9.4,33.9,0s9.3,24.6,0,34L273,345c-9.1,9.1-23.7,9.3-33.1,0.7L95,201.1
                  c-4.7-4.7-7-10.9-7-17c0-6.1,2.3-12.3,7-17c9.4-9.4,24.6-9.4,33.9,0L256,294.1z" fill="currentColor"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="deepseek-preset-dropdown" style="display:none;"></div>
          <div class="deepseek-preset-save-button">
            <button class="ds-atom-button ds-toggle-button ds-toggle-button--md f79352dc"
                    type="button" data-preset-action="saveCurrent">
              <span>${t.presetsSaveCurrent}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="ds-modal-content__footer deepseek-prompt-modal-footer">
        <label class="deepseek-prompt-footer-left">
          <input type="checkbox" id="deepseek-prompt-enabled-toggle" style="margin:0;">
          <span>${t.modalEnabledLabel}</span>
        </label>
        <div class="ds-modal-content__button-group deepseek-prompt-footer-right">
          <button class="ds-button ds-button--bordered ds-button--secondary ds-button--m"
                  data-action="cancel" type="button">
            <span class="ds-button__text">${t.modalCancel}</span>
          </button>
          <button class="ds-button ds-button--filled ds-button--primary ds-button--m"
                  data-action="save" type="button">
            <span class="ds-button__text">${t.modalSave}</span>
          </button>
        </div>
      </div>
    `;

    const textarea = modal.querySelector('textarea');
    const closeBtn = modal.querySelector('.ds-modal-content__close');
    const enabledCheckbox = modal.querySelector('#deepseek-prompt-enabled-toggle');
    const presetDropdown = modal.querySelector('.deepseek-preset-dropdown');
    const presetSelect = modal.querySelector('.deepseek-preset-select');
    const presetSelectValue = modal.querySelector('.deepseek-preset-select-value');

    let dropdownOpen = false;

    function updatePresetSelectLabel() {
      const active = presets.find((p) => p.id === activePresetId);
      if (active) {
        presetSelectValue.textContent = active.name;
      } else if (presets.length === 0) {
        presetSelectValue.textContent = t.presetsEmpty;
      } else {
        presetSelectValue.textContent = t.presetsNoneOption;
      }
    }

    textarea.value = systemPrompt || '';
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;

    enabledCheckbox.checked = !!isEnabled;

    function close() {
      backdrop.remove();
      document.removeEventListener('click', onDocumentClick, true);
    }

    function save() {
      const value = textarea.value.trim();
      systemPrompt = value;
      GM_setValue(STORAGE_KEY, systemPrompt);

      isEnabled = !!enabledCheckbox.checked;
      GM_setValue(ENABLED_KEY, isEnabled);

      updateIndicator();
      log('Updated system prompt via editor:', systemPrompt, 'Enabled:', isEnabled);
      close();
    }

    function renderPresetDropdown() {
      presetDropdown.innerHTML = '';
      if (!presets.length) {
        const empty = document.createElement('div');
        empty.className = 'deepseek-preset-option';
        empty.textContent = t.presetsEmpty;
        presetDropdown.appendChild(empty);
        return;
      }

      const noneOption = document.createElement('div');
      noneOption.className = 'deepseek-preset-option' + (activePresetId ? '' : ' deepseek-preset-option--active');
      noneOption.textContent = t.presetsNoneOption;
      noneOption.dataset.presetId = '';
      presetDropdown.appendChild(noneOption);

      for (const preset of presets) {
        const opt = document.createElement('div');
        opt.className = 'deepseek-preset-option';
        if (preset.id === activePresetId) {
          opt.classList.add('deepseek-preset-option--active');
        }
        opt.dataset.presetId = preset.id;
        opt.textContent = preset.name;
        presetDropdown.appendChild(opt);
      }
    }

    function openDropdown() {
      if (dropdownOpen) return;
      dropdownOpen = true;
      renderPresetDropdown();
      presetDropdown.style.display = 'block';
      presetSelect.classList.add('ds-select--open');
      document.addEventListener('click', onDocumentClick, true);
    }

    function closeDropdown() {
      if (!dropdownOpen) return;
      dropdownOpen = false;
      presetDropdown.style.display = 'none';
      presetSelect.classList.remove('ds-select--open');
      document.removeEventListener('click', onDocumentClick, true);
    }

    function onDocumentClick(e) {
      if (!modal.contains(e.target)) {
        closeDropdown();
      }
    }

    presetSelect.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dropdownOpen) closeDropdown();
      else openDropdown();
    });

    presetDropdown.addEventListener('click', (e) => {
      const opt = e.target.closest('.deepseek-preset-option');
      if (!opt) return;
      const id = opt.dataset.presetId || null;

      if (!id) {
        activePresetId = null;
        GM_setValue(ACTIVE_PRESET_KEY, activePresetId);
      } else {
        const preset = presets.find((p) => p.id === id);
        if (!preset) return;
        activePresetId = id;
        GM_setValue(ACTIVE_PRESET_KEY, activePresetId);
        textarea.value = preset.value;
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      }

      updatePresetSelectLabel();
      closeDropdown();
    });

    function renderPresetsSelectOnly() {
      renderPresetDropdown();
      updatePresetSelectLabel();
    }

    function saveCurrentAsPreset() {
      const value = textarea.value.trim();
      if (!value) return;

      const name = prompt(t.presetNamePrompt, '');
      if (!name) return;

      const preset = {
        id:
          Date.now().toString(36) +
          Math.random().toString(36).slice(2, 8),
        name: name.trim(),
        value,
      };
      presets.push(preset);
      activePresetId = preset.id;
      GM_setValue(ACTIVE_PRESET_KEY, activePresetId);
      savePresets();
      renderPresetsSelectOnly();
      alert(t.presetSaved);
    }

    renderPresetsSelectOnly();

    modal.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('button[data-action]');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-action');
        if (action === 'save') {
          save();
        } else if (action === 'cancel') {
          close();
        }
        return;
      }

      const presetBtn = e.target.closest('button[data-preset-action]');
      if (presetBtn) {
        const pAction = presetBtn.getAttribute('data-preset-action');
        if (pAction === 'saveCurrent') {
          saveCurrentAsPreset();
        }
      }
    });

    closeBtn.addEventListener('click', close);

    let backdropMouseDownOnSelf = false;

    backdrop.addEventListener('mousedown', (e) => {
      backdropMouseDownOnSelf = e.target === backdrop;
    });

    backdrop.addEventListener('mouseup', (e) => {
      if (backdropMouseDownOnSelf && e.target === backdrop) {
        close();
      }
      backdropMouseDownOnSelf = false;
    });

    backdrop.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        close();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.stopPropagation();
        e.preventDefault();
        save();
      }
    });

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    backdrop.tabIndex = -1;
    backdrop.focus();
  }

  // Menu

  GM_registerMenuCommand(t.set, openPromptEditor);
  GM_registerMenuCommand(t.view, openPromptEditor);

  GM_registerMenuCommand(t.clear, () => {
    if (!confirm(t.confirm)) return;
    systemPrompt = '';
    GM_setValue(STORAGE_KEY, systemPrompt);
    alert(t.cleared);
    updateIndicator();
    log('Cleared system prompt');
  });

  GM_registerMenuCommand(t.toggle, () => {
    isEnabled = !isEnabled;
    GM_setValue(ENABLED_KEY, isEnabled);
    alert(isEnabled ? t.enabled : t.disabled);
    updateIndicator();
    log('Toggled:', isEnabled);
  });

  // Request interception

  function isTargetUrl(url) {
    if (!url) return false;
    try {
      const s = url.toString();
      return API_PATTERNS.some((pattern) => s.includes(pattern));
    } catch {
      return false;
    }
  }

  function formatSystemPrompt(userMessage) {
    if (!systemPrompt || !isEnabled) return userMessage;
    return (
      `[${t.systemPrefix}]\n` +
      `${t.separator}\n` +
      `${systemPrompt}\n` +
      `${t.separator}\n` +
      `[USER MESSAGE]\n` +
      `${userMessage}`
    );
  }

  function modifyRequestBody(body, url) {
    if (!body || !systemPrompt || !isEnabled || !isTargetUrl(url)) {
      return body;
    }

    let isString = false;
    let data = body;

    try {
      if (typeof body === 'string') {
        isString = true;
        data = JSON.parse(body);
      } else if (body instanceof Blob || body instanceof FormData) {
        return body;
      }

      if (data && typeof data === 'object') {
        if (typeof data.prompt === 'string') {
          const originalPrompt = data.prompt;
          data.prompt = formatSystemPrompt(originalPrompt);
          log('Modified request (prompt field) for:', url);
          return isString ? JSON.stringify(data) : data;
        }

        if (Array.isArray(data.messages) && systemPrompt) {
          const hasSystem = data.messages.some(
            (m) => m && m.role === 'system',
          );
          if (!hasSystem) {
            data.messages.unshift({
              role: 'system',
              content: systemPrompt,
            });
            log('Added system message to messages array for:', url);
            return isString ? JSON.stringify(data) : data;
          }
        }
      }
    } catch (e) {
      log('Error modifying request:', e);
    }

    return body;
  }

  function interceptXHR() {
    const OriginalXHR = unsafeWindow.XMLHttpRequest;
    if (!OriginalXHR || interceptedInstances.has(OriginalXHR.prototype)) {
      return;
    }

    const originalOpen = OriginalXHR.prototype.open;
    const originalSend = OriginalXHR.prototype.send;

    OriginalXHR.prototype.open = function (method, url, ...args) {
      this._url = url;
      this._method = method;
      return originalOpen.call(this, method, url, ...args);
    };

    OriginalXHR.prototype.send = function (body) {
      if (isTargetUrl(this._url)) {
        log('Intercepting XMLHttpRequest to:', this._url);
        body = modifyRequestBody(body, this._url);
      }
      return originalSend.call(this, body);
    };

    interceptedInstances.add(OriginalXHR.prototype);
    log('XMLHttpRequest intercepted');
  }

  function interceptFetch() {
    const targetWindow = unsafeWindow;
    const originalFetch = targetWindow && targetWindow.fetch;
    if (!originalFetch || interceptedInstances.has(originalFetch)) {
      return;
    }

    const wrappedFetch = async function (input, init = {}) {
      const url =
        typeof input === 'string' ? input : (input && input.url) || '';
      if (!isTargetUrl(url) || !init || !init.body) {
        return originalFetch.call(this, input, init);
      }

      log('Intercepting fetch to:', url);
      const modifiedInit = { ...init };

      if (modifiedInit.body instanceof Blob) {
        try {
          const text = await modifiedInit.body.text();
          const modifiedText = modifyRequestBody(text, url);
          if (modifiedText !== text) {
            modifiedInit.body = new Blob([modifiedText], {
              type: modifiedInit.body.type,
            });
          }
        } catch (e) {
          log('Error handling Blob body:', e);
        }
      } else {
        modifiedInit.body = modifyRequestBody(modifiedInit.body, url);
      }

      return originalFetch.call(this, input, modifiedInit);
    };

    for (const prop in originalFetch) {
      if (Object.prototype.hasOwnProperty.call(originalFetch, prop)) {
        wrappedFetch[prop] = originalFetch[prop];
      }
    }

    targetWindow.fetch = wrappedFetch;
    interceptedInstances.add(originalFetch);
    log('Fetch API intercepted');
  }

  function interceptWebSocket() {
    const OriginalWebSocket = unsafeWindow.WebSocket;
    if (!OriginalWebSocket || interceptedInstances.has(OriginalWebSocket)) {
      return;
    }

    unsafeWindow.WebSocket = function (url, protocols) {
      const ws = new OriginalWebSocket(url, protocols);
      log('WebSocket connection to:', url);

      const originalSend = ws.send;
      ws.send = function (data) {
        if (systemPrompt && isEnabled) {
          try {
            let parsed =
              typeof data === 'string' ? JSON.parse(data) : data;
            if (
              parsed &&
              typeof parsed === 'object' &&
              typeof parsed.prompt === 'string'
            ) {
              parsed.prompt = formatSystemPrompt(parsed.prompt);
              data =
                typeof data === 'string'
                  ? JSON.stringify(parsed)
                  : parsed;
              log('Modified WebSocket message');
            }
          } catch {
            // ignore non-JSON
          }
        }
        return originalSend.call(this, data);
      };

      return ws;
    };

    for (const prop in OriginalWebSocket) {
      if (Object.prototype.hasOwnProperty.call(OriginalWebSocket, prop)) {
        unsafeWindow.WebSocket[prop] = OriginalWebSocket[prop];
      }
    }

    interceptedInstances.add(OriginalWebSocket);
    log('WebSocket intercepted');
  }

  function handleServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => {
        if (regs && regs.length) {
          log('Service Workers detected:', regs.length);
        }
      })
      .catch(() => {});
  }

  function applyInterceptions() {
    interceptXHR();
    interceptFetch();
    interceptWebSocket();
    handleServiceWorker();
  }

  applyInterceptions();

  let reapplyCount = 0;
  const reapplyInterval = setInterval(() => {
    applyInterceptions();
    reapplyCount += 1;
    if (reapplyCount > 20) {
      clearInterval(reapplyInterval);
      log('Stopped re-applying interceptions');
    }
  }, 500);

  const iframeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.tagName === 'IFRAME' && node.contentWindow) {
          try {
            const w = node.contentWindow;
            if (w.fetch && !interceptedInstances.has(w.fetch)) {
              log('Iframe detected (same-origin), possible interceptions');
            }
          } catch {}
        }
      }
    }
  });

  const headerIndicatorObserver = new MutationObserver((mutations) => {
    let needUpdate = false;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        const txt = node.textContent || '';
        if (txt.includes('DeepThink') || txt.includes('Search')) {
          needUpdate = true;
          break;
        }
        const btn = node.querySelector && node.querySelector('button');
        if (btn) {
          const t = btn.textContent || '';
          if (t.includes('DeepThink') || t.includes('Search')) {
            needUpdate = true;
            break;
          }
        }
      }
      if (needUpdate) break;
    }
    if (needUpdate) {
      updateIndicator();
    }
  });

  function startObservers() {
    updateIndicator();
    startSystemInstructionCleaner();
    if (document.body) {
      iframeObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      headerIndicatorObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    let tries = 0;
    const headerInterval = setInterval(() => {
      updateIndicator();
      const indicator = document.querySelector('.deepseek-system-prompt-indicator');
      if (indicator || tries++ > 40) {
        clearInterval(headerInterval);
      }
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObservers);
  } else {
    setTimeout(startObservers, 100);
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      log('URL changed, re-applying interceptions');
      applyInterceptions();
      setTimeout(updateIndicator, 500);
    }
  }).observe(document, { subtree: true, childList: true });

  unsafeWindow.__deepseekSystemPrompt = {
    version: '2.5.1-ru-ui-ds-header-select',
    isEnabled: () => isEnabled,
    getPrompt: () => systemPrompt,
    getPresets: () => presets.slice(),
    getActivePresetId: () => activePresetId,
    reapply: applyInterceptions,
  };

  log('Initialized v2.5.1 (header toggle + select presets + hidden SYSTEM + fixed icon/text)');
  log('Current prompt:', systemPrompt);
  log('Enabled:', isEnabled);
})();

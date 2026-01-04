// ==UserScript==
// @name         PasteMaster
// @namespace    https://greasyfork.org/zh-CN/scripts/pastemaster
// @version      1.8.0
// @description  多格式智能转换下载（JSON/Markdown/CSV/YAML/HTML/Base64/TXT）+ 自动检测可转换区域 + 拖动按钮 + Pastebin 标题命名 + Violentmonkey 云同步
// @author       alisa
// @match        *://*/*
// @run-at       document-end
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561383/PasteMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/561383/PasteMaster.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const CURRENT_VERSION = '1.8.0';

  /********************
   * ⚙️ 默认配置
   ********************/
  const DEFAULT_SETTINGS = {
    enableFloatingButton: true,
    buttonOpacity: 0.8,
    customBlacklist: [],
    buttonFloatingPosition: null,   // { x, y } 或 null
    buttonSettingsPosition: null,
  };

  const isViolentmonkey = typeof GM !== 'undefined' && typeof GM.setValue === 'function';

  let settings = loadLocalSettings();
  let autoSaveTimeout = null;

  // 本地存储
  function loadLocalSettings() {
    try {
      const saved = localStorage.getItem('pasteMasterSettings');
      const parsed = saved ? JSON.parse(saved) : {};
      if (!Array.isArray(parsed.customBlacklist)) parsed.customBlacklist = [];
      if (parsed.buttonFloatingPosition && typeof parsed.buttonFloatingPosition.x !== 'number') parsed.buttonFloatingPosition = null;
      if (parsed.buttonSettingsPosition && typeof parsed.buttonSettingsPosition.x !== 'number') parsed.buttonSettingsPosition = null;
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      console.warn('[PasteMaster] 读取本地设置失败', e);
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettingsLocally(newSettings) {
    settings = { ...settings, ...newSettings };
    try {
      localStorage.setItem('pasteMasterSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('[PasteMaster] 保存本地设置失败', e);
    }
  }

  const saveSettings = (newSettings) => {
    saveSettingsLocally(newSettings);
    autoSaveToCloud();
  };

  // 云同步
  const generateSummary = (settings) => {
    const status = settings.enableFloatingButton ? '启用' : '禁用';
    const count = settings.customBlacklist.length;
    return `${status}, 黑名单: ${count} 项`;
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  const autoSaveToCloud = () => {
    if (!isViolentmonkey) return;
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(async () => {
      try {
        const newItem = {
          timestamp: Date.now(),
          settings: { ...settings },
          summary: generateSummary(settings)
        };
        const history = await loadCloudHistory();
        const newHistory = [newItem, ...history].slice(0, 2);
        await GM.setValue('settingsHistory', JSON.stringify(newHistory));
        console.log('[PasteMaster] 自动保存设置到云');
      } catch (e) {
        console.warn('[PasteMaster] 自动云保存失败', e);
      }
    }, 2000);
  };

  const loadCloudHistory = async () => {
    if (!isViolentmonkey) return [];
    try {
      const val = await GM.getValue('settingsHistory', null);
      if (val === null) return [];
      const history = JSON.parse(val);
      if (!Array.isArray(history)) return [];
      return history.filter(item =>
        typeof item.timestamp === 'number' &&
        typeof item.settings === 'object'
      ).slice(0, 2);
    } catch (e) {
      console.warn('[PasteMaster] 读取云历史失败', e);
      return [];
    }
  };

  const deleteCloudHistory = async () => {
    if (!isViolentmonkey) return;
    try {
      await GM.deleteValue('settingsHistory');
    } catch (e) {
      console.warn('[PasteMaster] 删除云历史失败', e);
    }
  };

  /********************
   * 🌐 域名与黑名单
   ********************/
  const getMainDomain = (hostname) => {
    const parts = hostname.split('.');
    if (parts.length <= 2) return hostname;
    return parts.slice(-2).join('.');
  };

  const matchPattern = (pattern, domain) => {
    if (pattern.startsWith('*.') && domain.endsWith(pattern.slice(2))) {
      return true;
    }
    return pattern === domain;
  };

  const BUILTIN_BLACKLIST = [
    'pastebin.com',
    'github.com',
    'gitlab.com',
    'docs.google.com',
    'drive.google.com',
    'notion.so',
    'obsidian.md',
    'codepen.io',
    'jsfiddle.net'
  ];

  const getAllBlacklist = () => {
    return [...new Set([...BUILTIN_BLACKLIST, ...settings.customBlacklist])];
  };

  const shouldShowFloatingButton = () => {
    if (!settings.enableFloatingButton) return false;
    const mainDomain = getMainDomain(location.hostname);
    return !getAllBlacklist().some(p => matchPattern(p, mainDomain));
  };

  /********************
   * 🛠 工具函数
   ********************/
  const nowStamp = () => {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  };

  const download = (content, filename, type = 'application/json') => {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const tryParseJSON = txt => {
    try { return JSON.parse(txt); } catch { return null; }
  };

  const detectFormat = txt => {
    if (tryParseJSON(txt)) return 'json';
    if (/^---\n/.test(txt)) return 'yaml';
    if (/,/.test(txt) && /\n/.test(txt)) return 'csv';
    if (/^#\s+/m.test(txt)) return 'markdown';
    if (/<[a-z][\s\S]*>/i.test(txt)) return 'html';
    return 'text';
  };

  const converters = {
    json: txt => JSON.stringify(tryParseJSON(txt) ?? txt, null, 2),
    markdown: txt => txt,
    csv: txt => txt,
    yaml: txt => txt,
    html: txt => `<pre>${txt.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[m]))}</pre>`,
    base64: txt => btoa(unescape(encodeURIComponent(txt))),
    text: txt => txt,
  };

  const mimeMap = {
    json: 'application/json',
    markdown: 'text/markdown',
    csv: 'text/csv',
    yaml: 'text/yaml',
    html: 'text/html',
    base64: 'text/plain',
    text: 'text/plain',
  };

  /********************
   * ✨ 新增：自动检测可转换区域
   ********************/
  const observedContainers = new Set();
  const createdButtons = new WeakSet();

  const isLikelyJSON = (txt) => {
    if (txt.length < 10) return false;
    const trimmed = txt.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
           (trimmed.startsWith('[') && trimmed.endsWith(']'));
  };

  const isLikelyYAML = (txt) => {
    return txt.includes('\n') && (txt.startsWith('---') || /:\s/.test(txt));
  };

  const isLikelyCSV = (txt) => {
    const lines = txt.split('\n').filter(l => l.trim());
    return lines.length >= 2 && lines[0].includes(',');
  };

  const isLikelyMarkdown = (txt) => {
    return /^# |^\* |^- /.test(txt) || /!\[.*\]\(/.test(txt);
  };

  const detectFormatLight = (txt) => {
    if (isLikelyJSON(txt)) return 'json';
    if (isLikelyYAML(txt)) return 'yaml';
    if (isLikelyCSV(txt)) return 'csv';
    if (isLikelyMarkdown(txt)) return 'markdown';
    return null;
  };

  const createMiniButton = (text, baseName) => {
    const btn = document.createElement('div');
    btn.textContent = '📥';
    Object.assign(btn.style, {
      position: 'absolute',
      top: '4px',
      right: '4px',
      width: '20px',
      height: '20px',
      borderRadius: '4px',
      background: 'rgba(79, 70, 229, 0.85)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 99990,
      fontSize: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      opacity: '0.8',
      transition: 'opacity 0.2s',
      pointerEvents: 'auto'
    });
    btn.onmouseenter = () => btn.style.opacity = '1';
    btn.onmouseleave = () => btn.style.opacity = '0.8';
    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      showMenu(text, baseName);
    };
    return btn;
  };

  const scanAndAttachButtons = (container = document.body) => {
    if (observedContainers.has(container)) return;
    observedContainers.add(container);

    const candidates = container.querySelectorAll('pre, code, [class*="json"], [class*="yaml"], [class*="csv"], [class*="md"]');

    candidates.forEach(el => {
      if (createdButtons.has(el)) return;
      if (el.closest && (el.closest('.gm-ui')) || el.closest('#pasteMasterPanel')) return;

      const text = el.textContent || el.innerText || '';
      if (text.length < 20) return;

      const format = detectFormatLight(text);
      if (!format) return;

      // 确保可定位
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }

      const baseName = `detected_${format}_${nowStamp()}`;
      const btn = createMiniButton(text, baseName);
      el.appendChild(btn);
      createdButtons.add(el);
    });
  };

  const startObserver = () => {
    scanAndAttachButtons();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          for (const node of m.addedNodes) {
            if (node.nodeType === 1) {
              scanAndAttachButtons(node);
            }
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  /********************
   * 🖱 新增：拖动按钮
   ********************/
  const makeDraggable = (element, positionKey) => {
    let isDragging = false;
    let offsetX, offsetY;

    element.onmousedown = (e) => {
      isDragging = true;
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
      element.style.transition = 'none';
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      const maxX = window.innerWidth - 36;
      const maxY = window.innerHeight - 36;
      element.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
      element.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
      element.style.right = 'auto';
      element.style.bottom = 'auto';
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        const rect = element.getBoundingClientRect();
        saveSettings({ 
          [`button${positionKey}Position`]: { x: rect.left, y: rect.top }
        });
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // 清理（可选）
    element._cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  };

  const getButtonStyle = (opacity = 1) => ({
    position: 'fixed',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'move',
    zIndex: 99999,
    fontSize: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    opacity: opacity,
  });

  /********************
   * UI：按钮与面板
   ********************/
  let floatingButton = null;
  let settingsButton = null;
  let settingsPanel = null;

  const updateButtons = () => {
    [floatingButton, settingsButton].forEach(btn => {
      btn?._cleanup?.();
      btn?.remove();
    });
    floatingButton = null;
    settingsButton = null;

    // 设置按钮
    settingsButton = document.createElement('div');
    settingsButton.textContent = '⚙️';
    const settingsPos = settings.buttonSettingsPosition;
    if (settingsPos && settingsPos.x !== null) {
      Object.assign(settingsButton.style, {
        position: 'fixed',
        left: settingsPos.x + 'px',
        top: settingsPos.y + 'px',
        right: 'auto',
        bottom: 'auto',
        ...getButtonStyle(settings.buttonOpacity)
      });
    } else {
      Object.assign(settingsButton.style, {
        ...getButtonStyle(settings.buttonOpacity),
        right: '16px',
        bottom: '16px',
        background: '#6b7280',
        color: '#fff',
      });
    }
    document.body.appendChild(settingsButton);
    settingsButton.onclick = toggleSettingsPanel;
    makeDraggable(settingsButton, 'Settings');

    // 浮动按钮
    if (shouldShowFloatingButton()) {
      floatingButton = document.createElement('div');
      floatingButton.textContent = '📋';
      const floatingPos = settings.buttonFloatingPosition;
      if (floatingPos && floatingPos.x !== null) {
        Object.assign(floatingButton.style, {
          position: 'fixed',
          left: floatingPos.x + 'px',
          top: floatingPos.y + 'px',
          right: 'auto',
          bottom: 'auto',
          ...getButtonStyle(settings.buttonOpacity)
        });
      } else {
        Object.assign(floatingButton.style, {
          ...getButtonStyle(settings.buttonOpacity),
          right: '60px',
          bottom: '16px',
          background: '#4f46e5',
          color: '#fff',
        });
      }
      document.body.appendChild(floatingButton);
      floatingButton.onclick = async () => {
        try {
          const txt = await navigator.clipboard.readText();
          if (txt.trim()) {
            showMenu(txt, `clipboard_${nowStamp()}`);
          } else {
            alert('剪贴板为空');
          }
        } catch (err) {
          alert('无法读取剪贴板：请确保网站已获得权限，或手动复制内容后重试。');
        }
      };
      makeDraggable(floatingButton, 'Floating');
    }
  };

  const showPanelMessage = (text, isError = false) => {
    if (!settingsPanel) return;
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.fontSize = '12px';
    msg.style.marginTop = '6px';
    msg.style.color = isError ? '#ef4444' : '#10b981';
    msg.style.fontWeight = 'bold';
    settingsPanel.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  };

  const toggleSettingsPanel = () => {
    if (settingsPanel) {
      settingsPanel.remove();
      settingsPanel = null;
    } else {
      showSettingsPanel();
    }
  };

  const showCloudHistoryPanel = async () => {
    const history = await loadCloudHistory();
    if (history.length === 0) {
      showPanelMessage('⚠️ 云中无历史记录', true);
      return;
    }

    const panel = document.createElement('div');
    panel.id = 'pasteMasterPanel';
    Object.assign(panel.style, {
      position: 'fixed',
      right: '16px',
      bottom: '60px',
      background: '#1f2937',
      color: '#f9fafb',
      padding: '14px',
      borderRadius: '10px',
      zIndex: 99999,
      fontSize: '13px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      minWidth: '280px',
      maxWidth: '320px'
    });

    const title = document.createElement('div');
    title.textContent = '请选择要加载的设置版本';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '12px';
    panel.appendChild(title);

    history.forEach((item, i) => {
      const itemDiv = document.createElement('div');
      itemDiv.style.padding = '8px';
      itemDiv.style.border = '1px solid #374151';
      itemDiv.style.borderRadius = '6px';
      itemDiv.style.marginBottom = '8px';
      itemDiv.style.cursor = 'pointer';
      itemDiv.onmouseenter = () => itemDiv.style.background = '#374151';
      itemDiv.onmouseleave = () => itemDiv.style.background = '';

      const time = document.createElement('div');
      time.textContent = formatTime(item.timestamp);
      time.style.fontSize = '12px';
      time.style.color = '#9ca3af';

      const summary = document.createElement('div');
      summary.textContent = item.summary;
      summary.style.fontWeight = 'bold';
      summary.style.marginTop = '4px';

      itemDiv.appendChild(time);
      itemDiv.appendChild(summary);

      itemDiv.onclick = () => {
        saveSettingsLocally(item.settings);
        panel.remove();
        showPanelMessage('✅ 已加载所选设置', false);
        setTimeout(() => {
          settingsPanel?.remove();
          showSettingsPanel();
        }, 800);
        updateButtons();
      };

      panel.appendChild(itemDiv);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    Object.assign(cancelBtn.style, {
      width: '100%',
      padding: '6px',
      background: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
      marginTop: '8px'
    });
    cancelBtn.onclick = () => panel.remove();

    panel.appendChild(cancelBtn);
    document.body.appendChild(panel);

    setTimeout(() => {
      if (panel.parentNode) panel.remove();
    }, 15000);
  };

  const showSettingsPanel = () => {
    settingsPanel = document.createElement('div');
    settingsPanel.id = 'pasteMasterPanel';
    Object.assign(settingsPanel.style, {
      position: 'fixed',
      right: '16px',
      bottom: '60px',
      background: '#1f2937',
      color: '#f9fafb',
      padding: '14px',
      borderRadius: '10px',
      zIndex: 99999,
      fontSize: '14px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      minWidth: '280px',
      maxWidth: '340px',
      maxHeight: '80vh',
      overflowY: 'auto'
    });

    const title = document.createElement('div');
    title.textContent = `📋 PasteMaster 设置 (v${CURRENT_VERSION})`;
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '12px';

    const toggleDiv = document.createElement('div');
    toggleDiv.style.display = 'flex';
    toggleDiv.style.alignItems = 'center';
    toggleDiv.style.marginBottom = '12px';
    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.checked = settings.enableFloatingButton;
    toggleInput.onchange = () => {
      saveSettings({ enableFloatingButton: toggleInput.checked });
      updateButtons();
    };
    const toggleLabel = document.createElement('label');
    toggleLabel.textContent = ' 启用全局浮动按钮';
    toggleLabel.style.marginLeft = '8px';
    toggleDiv.appendChild(toggleInput);
    toggleDiv.appendChild(toggleLabel);

    const opacityDiv = document.createElement('div');
    opacityDiv.style.marginBottom = '12px';
    const opacityLabel = document.createElement('div');
    opacityLabel.textContent = `按钮透明度: ${Math.round(settings.buttonOpacity * 100)}%`;
    opacityLabel.style.marginBottom = '4px';
    const opacitySlider = document.createElement('input');
    opacitySlider.type = 'range';
    opacitySlider.min = '0.3'; opacitySlider.max = '1.0'; opacitySlider.step = '0.01';
    opacitySlider.value = settings.buttonOpacity;
    opacitySlider.oninput = () => {
      opacityLabel.textContent = `按钮透明度: ${Math.round(opacitySlider.value * 100)}%`;
    };
    opacitySlider.onchange = () => {
      saveSettings({ buttonOpacity: parseFloat(opacitySlider.value) });
      updateButtons();
    };
    opacityDiv.appendChild(opacityLabel);
    opacityDiv.appendChild(opacitySlider);

    const blacklistDiv = document.createElement('div');
    blacklistDiv.style.marginBottom = '12px';
    const blacklistTitle = document.createElement('div');
    blacklistTitle.textContent = '自定义黑名单';
    blacklistTitle.style.fontWeight = 'bold';
    blacklistTitle.style.marginBottom = '6px';
    const blacklistInput = document.createElement('input');
    blacklistInput.type = 'text';
    blacklistInput.placeholder = '例如: *.google.com';
    blacklistInput.style.width = '100%';
    blacklistInput.style.padding = '4px';
    blacklistInput.style.marginBottom = '6px';
    const addButton = document.createElement('button');
    addButton.textContent = '添加';
    Object.assign(addButton.style, {
      padding: '3px 8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
    });
    addButton.onclick = () => {
      const val = blacklistInput.value.trim();
      if (val && !settings.customBlacklist.includes(val)) {
        saveSettings({ customBlacklist: [...settings.customBlacklist, val] });
        blacklistInput.value = '';
        renderBlacklistList();
        updateButtons();
      }
    };
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex'; inputContainer.style.gap = '6px';
    inputContainer.appendChild(blacklistInput); inputContainer.appendChild(addButton);
    const blacklistList = document.createElement('div');
    const renderBlacklistList = () => {
      blacklistList.innerHTML = '';
      settings.customBlacklist.forEach((item, i) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex'; itemDiv.style.justifyContent = 'space-between';
        const text = document.createElement('span'); text.textContent = item;
        const delBtn = document.createElement('button');
        delBtn.textContent = '×'; delBtn.style.background = '#ef4444'; delBtn.style.color = 'white';
        delBtn.style.border = 'none'; delBtn.style.borderRadius = '3px'; delBtn.style.width = '18px'; delBtn.style.height = '18px'; delBtn.style.fontSize = '12px'; delBtn.style.cursor = 'pointer';
        delBtn.onclick = () => {
          const newBlacklist = settings.customBlacklist.filter((_, idx) => idx !== i);
          saveSettings({ customBlacklist: newBlacklist });
          renderBlacklistList();
          updateButtons();
        };
        itemDiv.appendChild(text); itemDiv.appendChild(delBtn);
        blacklistList.appendChild(itemDiv);
      });
    };
    renderBlacklistList();
    blacklistDiv.appendChild(blacklistTitle);
    blacklistDiv.appendChild(inputContainer);
    blacklistDiv.appendChild(blacklistList);

    const status = document.createElement('div');
    status.style.fontSize = '12px'; status.style.color = '#9ca3af'; status.style.marginBottom = '12px';
    const domain = getMainDomain(location.hostname);
    const isBlacklisted = getAllBlacklist().some(p => matchPattern(p, domain));
    status.textContent = !settings.enableFloatingButton ? '❌ 浮动按钮已全局禁用'
      : isBlacklisted ? `⚠️ 当前站点 (${domain}) 被黑名单屏蔽`
      : '✅ 浮动按钮将在本页显示';

    const syncDiv = document.createElement('div');
    syncDiv.style.marginTop = '16px';
    syncDiv.style.paddingTop = '12px';
    syncDiv.style.borderTop = '1px solid #374151';

    const syncTitle = document.createElement('div');
    syncTitle.textContent = '导入/导出 & 云同步';
    syncTitle.style.fontWeight = 'bold';
    syncTitle.style.marginBottom = '10px';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = '导出设置';
    Object.assign(exportBtn.style, {
      padding: '5px 10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', marginRight: '8px'
    });
    exportBtn.onclick = () => {
      const dataStr = JSON.stringify(settings, null, 2);
      download(dataStr, `pasteMaster_settings_${nowStamp()}.json`, 'application/json');
    };

    const importBtn = document.createElement('button');
    importBtn.textContent = '导入设置';
    Object.assign(importBtn.style, {
      padding: '5px 10px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
    });
    importBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const imported = JSON.parse(reader.result);
            if (typeof imported.enableFloatingButton !== 'boolean') throw new Error('无效格式');
            saveSettings(imported);
            showPanelMessage('✅ 设置已导入并应用', false);
            setTimeout(() => {
              settingsPanel?.remove();
              showSettingsPanel();
            }, 1000);
          } catch (err) {
            showPanelMessage('❌ 无效的设置文件', true);
          }
        };
        reader.readAsText(file);
      };
      input.click();
    };

    syncDiv.appendChild(syncTitle);
    syncDiv.appendChild(exportBtn);
    syncDiv.appendChild(importBtn);

    if (isViolentmonkey) {
      syncDiv.style.marginTop = '12px';
      const cloudTitle = document.createElement('div');
      cloudTitle.textContent = 'Violentmonkey 云同步（自动保存，最多2条）';
      cloudTitle.style.fontWeight = 'bold';
      cloudTitle.style.marginTop = '12px';
      cloudTitle.style.marginBottom = '8px';

      const loadCloudBtn = document.createElement('button');
      loadCloudBtn.textContent = '从云加载...';
      Object.assign(loadCloudBtn.style, {
        padding: '5px 10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
      });
      loadCloudBtn.onclick = showCloudHistoryPanel;

      const deleteCloudBtn = document.createElement('button');
      deleteCloudBtn.textContent = '清空云历史';
      Object.assign(deleteCloudBtn.style, {
        padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', marginLeft: '8px'
      });
      deleteCloudBtn.onclick = async () => {
        if (confirm('确定删除所有云历史记录？')) {
          await deleteCloudHistory();
          showPanelMessage('🗑️ 云历史已清空', false);
        }
      };

      syncDiv.appendChild(cloudTitle);
      syncDiv.appendChild(loadCloudBtn);
      syncDiv.appendChild(deleteCloudBtn);
    }

    const resetBtn = document.createElement('button');
    resetBtn.textContent = '重置为默认';
    Object.assign(resetBtn.style, {
      width: '100%', padding: '6px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', marginTop: '12px'
    });
    resetBtn.onclick = () => {
      if (confirm('重置所有设置？')) {
        localStorage.removeItem('pasteMasterSettings');
        if (isViolentmonkey) deleteCloudHistory();
        settings = { ...DEFAULT_SETTINGS };
        updateButtons();
        settingsPanel?.remove();
        showSettingsPanel();
      }
    };

    settingsPanel.appendChild(title);
    settingsPanel.appendChild(toggleDiv);
    settingsPanel.appendChild(opacityDiv);
    settingsPanel.appendChild(blacklistDiv);
    settingsPanel.appendChild(status);
    settingsPanel.appendChild(syncDiv);
    settingsPanel.appendChild(resetBtn);

    document.body.appendChild(settingsPanel);

    setTimeout(() => {
      if (settingsPanel?.parentNode) settingsPanel.remove();
    }, 15000);
  };

  const showMenu = (text, baseName) => {
    const detected = detectFormat(text);
    const menu = document.createElement('div');
    Object.assign(menu.style, {
      position: 'fixed',
      right: '16px',
      bottom: '60px',
      background: '#1f2937',
      color: '#f9fafb',
      padding: '8px',
      borderRadius: '8px',
      zIndex: 99999,
      fontSize: '13px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      minWidth: '140px'
    });

    ['json','markdown','csv','yaml','html','base64','text'].forEach(fmt => {
      const item = document.createElement('div');
      item.textContent = `${fmt.toUpperCase()}${fmt === detected ? ' ⭐' : ''}`;
      item.style.cursor = 'pointer';
      item.style.padding = '6px 10px';
      item.style.borderRadius = '4px';
      item.onmouseenter = () => item.style.background = '#374151';
      item.onmouseleave = () => item.style.background = '';
      item.onclick = () => {
        const out = converters[fmt](text);
        download(out, `${baseName}.${fmt}`, mimeMap[fmt]);
        menu.remove();
      };
      menu.appendChild(item);
    });

    document.body.appendChild(menu);
    setTimeout(() => menu?.remove(), 8000);
  };

  // Pastebin 专属
  const enhancePastebin = () => {
    if (!location.hostname.includes('pastebin.com')) return;
    if (!/^\/[a-zA-Z0-9]+$/.test(location.pathname)) return;

    const wait = setInterval(() => {
      const codeContainer =
        document.querySelector('.source') ||
        document.querySelector('.post-view') ||
        document.querySelector('.code-section') ||
        document.querySelector('pre')?.closest('div') ||
        Array.from(document.querySelectorAll('div')).find(el =>
          el.querySelector('pre') || (el.innerText && el.innerText.length > 50)
        );

      if (!codeContainer) return;

      let text = '';
      const preOrTextarea = codeContainer.querySelector('textarea, pre') || codeContainer;
      if (preOrTextarea.tagName === 'TEXTAREA') {
        text = preOrTextarea.value;
      } else {
        text = preOrTextarea.innerText || preOrTextarea.textContent || '';
      }

      if (!text.trim()) return;

      clearInterval(wait);

      let title = '';
      const h1 = document.querySelector('h1') || document.querySelector('.header h1');
      if (h1 && h1.textContent.trim()) {
        title = h1.textContent.trim();
      } else {
        title = (document.title || '').replace(/\s*-\s*Pastebin\.com\s*$/i, '').trim();
      }

      const sanitizeFileName = (name) => {
        return name
          .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
          .replace(/\s+/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_+|_+$/g, '')
          .substring(0, 80)
          .trim() || 'paste_snippet';
      };

      const safeTitle = sanitizeFileName(title);
      const baseName = `${safeTitle}_${nowStamp()}`;

      const btn = document.createElement('button');
      btn.textContent = 'Download as...';
      Object.assign(btn.style, {
        padding: '6px 12px',
        cursor: 'pointer',
        backgroundColor: '#4f46e5',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      });

      btn.onclick = () => showMenu(text, baseName);

      const wrapper = document.createElement('div');
      wrapper.style.margin = '0 0 15px 0';
      wrapper.style.textAlign = 'right';
      wrapper.appendChild(btn);

      codeContainer.parentNode.insertBefore(wrapper, codeContainer);
    }, 500);
  };

  document.addEventListener('paste', e => {
    const txt = e.clipboardData?.getData('text/plain');
    if (!txt || !txt.trim()) return;
    if (tryParseJSON(txt)) {
      if (confirm('检测到 JSON，是否转换为 Markdown 代码块并粘贴？')) {
        e.preventDefault();
        const markdown = '```json\n' + txt + '\n```';
        if (document.activeElement?.tagName === 'TEXTAREA' || 
            (document.activeElement?.contentEditable === 'true' && document.activeElement?.isContentEditable)) {
          document.execCommand('insertText', false, markdown);
        } else {
          alert('请在可编辑区域（如文本框）中粘贴以使用此功能。');
        }
      }
    }
  });

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateButtons();
      enhancePastebin();
      if (shouldShowFloatingButton()) startObserver();
    });
  } else {
    updateButtons();
    enhancePastebin();
    if (shouldShowFloatingButton()) startObserver();
  }

})();
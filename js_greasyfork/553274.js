// ==UserScript==
// @name         读弹幕 - B站弹幕语音阅读
// @namespace    http://tampermonkey.net/
// @version      0.8.4
// @description  在B站自动用语音读出弹幕内容（轮询版本）
// @author       Claude
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553274/%E8%AF%BB%E5%BC%B9%E5%B9%95%20-%20B%E7%AB%99%E5%BC%B9%E5%B9%95%E8%AF%AD%E9%9F%B3%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/553274/%E8%AF%BB%E5%BC%B9%E5%B9%95%20-%20B%E7%AB%99%E5%BC%B9%E5%B9%95%E8%AF%AD%E9%9F%B3%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const CONFIG = {
    enabled: true,
    rate: 1,
    pitch: 1,
    volume: 1,
    deduplicateTime: 500,
    maxHistorySize: 100,
  };

  let lastSpokenTexts = {};
  let spokenCount = 0;
  let synth = window.speechSynthesis;
  let processedTexts = new Set();  // 改为记录文本而不是元素引用
  let speakQueue = [];
  let isProcessingQueue = false;

  // ============== 工具函数 ==============

  function getDanmuElements() {
    const selectors = [
      '.bili-danmaku-x-dm',
      '.bili-live-chat-item',
      '.danmaku-item',
      '.bili-danmaku-item',
      '[class*="danmaku"]',
    ];

    for (let selector of selectors) {
      let elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        return elements;
      }
    }
    return [];
  }

  function extractTextFromDanmu(element) {
    if (!element) return '';

    const textSelectors = [
      '.bili-live-chat-item__content',
      '.danmaku-content',
      '.bili-danmaku-item__content',
      'span',
    ];

    for (let selector of textSelectors) {
      let textEl = element.querySelector(selector);
      if (textEl) {
        return textEl.textContent.trim();
      }
    }

    return element.textContent.trim();
  }

  function shouldSpeak(text) {
    if (!text) return false;

    const now = Date.now();
    const keys = Object.keys(lastSpokenTexts);

    if (keys.length > CONFIG.maxHistorySize) {
      keys
        .sort((a, b) => lastSpokenTexts[a] - lastSpokenTexts[b])
        .slice(0, Math.floor(keys.length / 2))
        .forEach(key => delete lastSpokenTexts[key]);
    } else {
      keys.forEach(key => {
        if (now - lastSpokenTexts[key] > CONFIG.deduplicateTime) {
          delete lastSpokenTexts[key];
        }
      });
    }

    if (lastSpokenTexts[text]) {
      return false;
    }

    lastSpokenTexts[text] = now;
    return true;
  }

  function addToQueue(text) {
    if (!text || !CONFIG.enabled) return;

    if (!shouldSpeak(text)) {
      return;
    }

    speakQueue.push(text);
    processQueue();
  }

  function processQueue() {
    if (isProcessingQueue || speakQueue.length === 0) {
      return;
    }

    if (synth.speaking) {
      setTimeout(processQueue, 300);
      return;
    }

    isProcessingQueue = true;
    const text = speakQueue.shift();

    try {
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = CONFIG.rate;
      utterance.pitch = CONFIG.pitch;
      utterance.volume = CONFIG.volume;

      utterance.onstart = () => {
        // console.log('[读弹幕] ▶ 开始:', text.substring(0, 20));
      };

      utterance.onend = () => {
        spokenCount++;
        isProcessingQueue = false;
        setTimeout(processQueue, 50);
      };

      utterance.onerror = (event) => {
        console.error('[读弹幕] 语音错误:', event.error);
        isProcessingQueue = false;
        setTimeout(processQueue, 100);
      };

      synth.cancel();
      synth.speak(utterance);
    } catch (e) {
      console.error('[读弹幕] 播放失败:', e.message);
      isProcessingQueue = false;
      setTimeout(processQueue, 100);
    }
  }

  /**
   * 核心轮询函数 - 不依赖 MutationObserver
   * 每次检查是否有新的未处理弹幕
   * 改为用文本内容去重，防止弹幕元素删除后重复读
   */
  function pollNewDanmu() {
    try {
      const allDanmu = getDanmuElements();

      allDanmu.forEach(element => {
        // 提取文本
        let text = extractTextFromDanmu(element);
        if (!text) return;

        // 用文本去重，而不是元素引用
        const textId = `${text}:${element.offsetHeight}:${element.offsetWidth}`; // 用内容+位置作为ID
        if (processedTexts.has(textId)) {
          return;
        }

        // 标记为已处理
        processedTexts.add(textId);

        // 加入队列
        addToQueue(text);
      });
    } catch (e) {
      console.error('[读弹幕] 轮询错误:', e.message);
    }
  }

  function createControlPanel() {
    let panel = document.createElement('div');
    panel.id = 'duanmu-reader-panel';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: white;
      min-width: 220px;
    `;

    let title = document.createElement('div');
    title.style.cssText = `
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: move;
      user-select: none;
    `;
    title.innerHTML = '🎤 读弹幕 v0.8.3';

    // 添加拖拽功能
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    title.addEventListener('mousedown', (e) => {
      // 如果是点击标题本身（收起功能），需要检查是否真的是拖拽
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.style.right = 'auto';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    let toggleBtn = document.createElement('button');
    toggleBtn.style.cssText = `
      width: 100%;
      padding: 6px 12px;
      margin-bottom: 6px;
      border: none;
      border-radius: 6px;
      background: ${CONFIG.enabled ? '#4ade80' : '#ef4444'};
      color: white;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s;
    `;
    toggleBtn.textContent = CONFIG.enabled ? '✓ 已启用' : '✗ 已禁用';

    toggleBtn.onclick = () => {
      CONFIG.enabled = !CONFIG.enabled;
      toggleBtn.textContent = CONFIG.enabled ? '✓ 已启用' : '✗ 已禁用';
      toggleBtn.style.background = CONFIG.enabled ? '#4ade80' : '#ef4444';
      GM_setValue('duanmu_reader_enabled', CONFIG.enabled);
    };

    let statsDiv = document.createElement('div');
    statsDiv.id = 'duanmu-stats';
    statsDiv.style.cssText = `
      font-size: 11px;
      margin-top: 8px;
      padding: 6px;
      background: rgba(0,0,0,0.2);
      border-radius: 4px;
      text-align: center;
      line-height: 1.6;
    `;
    statsDiv.innerHTML = `✓已读: <span id="spoken-count">0</span><br/>⏳队列: <span id="queue-count">0</span><br/>📊页面: <span id="danmu-count">0</span>`;

    // 语速调整
    let rateLabel = document.createElement('div');
    rateLabel.style.cssText = 'font-size: 12px; margin-top: 8px; margin-bottom: 4px; display: flex; justify-content: space-between;';
    rateLabel.innerHTML = `<span>语速</span><span>${CONFIG.rate.toFixed(1)}x</span>`;
    rateLabel.id = 'rate-label';

    let rateSlider = document.createElement('input');
    rateSlider.type = 'range';
    rateSlider.min = '0.5';
    rateSlider.max = '2';
    rateSlider.step = '0.1';
    rateSlider.value = CONFIG.rate;
    rateSlider.style.cssText = `width: 100%; height: 4px; margin-bottom: 8px; cursor: pointer;`;
    rateSlider.oninput = (e) => {
      CONFIG.rate = parseFloat(e.target.value);
      document.getElementById('rate-label').innerHTML = `<span>语速</span><span>${CONFIG.rate.toFixed(1)}x</span>`;
      GM_setValue('duanmu_reader_rate', CONFIG.rate);
    };

    // 音量调整
    let volumeLabel = document.createElement('div');
    volumeLabel.style.cssText = 'font-size: 12px; margin-bottom: 4px; display: flex; justify-content: space-between;';
    volumeLabel.innerHTML = `<span>音量</span><span>${Math.round(CONFIG.volume * 100)}%</span>`;
    volumeLabel.id = 'volume-label';

    let volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.1';
    volumeSlider.value = CONFIG.volume;
    volumeSlider.style.cssText = `width: 100%; height: 4px; margin-bottom: 8px; cursor: pointer;`;
    volumeSlider.oninput = (e) => {
      CONFIG.volume = parseFloat(e.target.value);
      document.getElementById('volume-label').innerHTML = `<span>音量</span><span>${Math.round(CONFIG.volume * 100)}%</span>`;
      GM_setValue('duanmu_reader_volume', CONFIG.volume);
    };

    let hint = document.createElement('div');
    hint.style.cssText = `
      font-size: 11px;
      margin-top: 8px;
      opacity: 0.8;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.2);
    `;
    hint.innerHTML = 'Alt+R: 切换<br/>拖拽移动<br/>双击收起';

    panel.appendChild(title);
    panel.appendChild(toggleBtn);
    panel.appendChild(statsDiv);
    panel.appendChild(rateLabel);
    panel.appendChild(rateSlider);
    panel.appendChild(volumeLabel);
    panel.appendChild(volumeSlider);
    panel.appendChild(hint);

    document.body.appendChild(panel);

    let isCollapsed = false;
    title.ondblclick = () => {
      isCollapsed = !isCollapsed;
      toggleBtn.style.display = isCollapsed ? 'none' : 'block';
      statsDiv.style.display = isCollapsed ? 'none' : 'block';
      rateLabel.style.display = isCollapsed ? 'none' : 'block';
      rateSlider.style.display = isCollapsed ? 'none' : 'block';
      volumeLabel.style.display = isCollapsed ? 'none' : 'block';
      volumeSlider.style.display = isCollapsed ? 'none' : 'block';
      hint.style.display = isCollapsed ? 'none' : 'block';
      title.style.marginBottom = isCollapsed ? '0' : '8px';
    };

    setInterval(() => {
      const countEl = document.getElementById('spoken-count');
      const queueEl = document.getElementById('queue-count');
      const danmuEl = document.getElementById('danmu-count');

      if (countEl) countEl.textContent = spokenCount;
      if (queueEl) queueEl.textContent = speakQueue.length;
      if (danmuEl) danmuEl.textContent = getDanmuElements().length;
    }, 500);
  }

  function setupKeyboardShortcut() {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toUpperCase() === 'R') {
        e.preventDefault();
        CONFIG.enabled = !CONFIG.enabled;
        let btn = document.querySelector('#duanmu-reader-panel button');
        if (btn) {
          btn.textContent = CONFIG.enabled ? '✓ 已启用' : '✗ 已禁用';
          btn.style.background = CONFIG.enabled ? '#4ade80' : '#ef4444';
        }
        console.log('[读弹幕]', CONFIG.enabled ? '已启用' : '已禁用');
      }
    });
  }

  function loadConfig() {
    if (typeof GM_getValue !== 'undefined') {
      CONFIG.enabled = GM_getValue('duanmu_reader_enabled', true);
      CONFIG.rate = parseFloat(GM_getValue('duanmu_reader_rate', 1));
      CONFIG.volume = parseFloat(GM_getValue('duanmu_reader_volume', 1));
    }
  }

  function init() {
    console.log('[读弹幕] 脚本已加载 v0.8.0 - 轮询模式（不依赖MutationObserver）');

    if (!('speechSynthesis' in window)) {
      console.error('[读弹幕] 浏览器不支持 Web Speech API');
      alert('您的浏览器不支持 Web Speech API，请升级浏览器');
      return;
    }

    loadConfig();
    createControlPanel();
    setupKeyboardShortcut();

    // 启动轮询 - 每 100ms 检查一次新弹幕（加快速度以捕捉快速出现的弹幕）
    setInterval(pollNewDanmu, 100);

    console.log('[读弹幕] ✓ 轮询模式已启动 (100ms 间隔)');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

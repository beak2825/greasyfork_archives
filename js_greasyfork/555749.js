// ==UserScript==
// @name         YouTube 本地字幕 - 原生 CC 集成
// @version      0.6
// @description  从本地加载 SRT/VTT 字幕，集成到 YouTube 原生字幕逻辑里：有原生CC时出现在字幕面板，由CC按钮控制；无原生CC时出现在设置根菜单也能加载。
// @match        https://www.youtube.com/watch*
// @match        https://www.youtube.com/*&v=*
// @grant        none
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/555749/YouTube%20%E6%9C%AC%E5%9C%B0%E5%AD%97%E5%B9%95%20-%20%E5%8E%9F%E7%94%9F%20CC%20%E9%9B%86%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/555749/YouTube%20%E6%9C%AC%E5%9C%B0%E5%AD%97%E5%B9%95%20-%20%E5%8E%9F%E7%94%9F%20CC%20%E9%9B%86%E6%88%90.meta.js
// ==/UserScript==


(function () {
  'use strict';

  /*** 可调参数 ***/
  const FONT_SIZE_PX = 24;        // 普通模式字号
  const FONT_SIZE_FULL_PX = 48;   // 全屏时字号
  const BOTTOM_PERCENT = 8;       // 离底部的百分比

  /*** 工具函数 ***/
  function onReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /*** 全局状态 ***/
  let subtitles = [];
  let currentIndex = -1;
  let overlay = null;
  let fileInput = null;
  let video = null;
  let isLocalTrackActive = false;     // 是否选择了“本地字幕”为当前轨道
  let nativeStyleInjected = false;
  let hasNativeSubtitlePanel = false; // 是否存在“字幕选择面板”（Off + 各语言）

  /*** 多语言支持 ***/
  /*** 多语言支持 ***/
  const MESSAGES = {
    'zh-CN': {
      btnLabel: '本地字幕',
      statusEnabled: '启用',
      statusLoaded: '已加载',
      statusNotLoaded: '未加载',
      consoleLoaded: '[本地字幕] 已加载字幕:',
      consoleCount: '条目数:',
      langLabel: '语言',
      langValue: '简体中文'
    },
    'zh-TW': {
      btnLabel: '本地字幕',
      statusEnabled: '啟用',
      statusLoaded: '已加載',
      statusNotLoaded: '未加載',
      consoleLoaded: '[本地字幕] 已加載字幕:',
      consoleCount: '條目數:',
      langLabel: '語言',
      langValue: '繁體中文'
    },
    'en': {
      btnLabel: 'Local Sub',
      statusEnabled: 'Enabled',
      statusLoaded: 'Loaded',
      statusNotLoaded: 'Not Loaded',
      consoleLoaded: '[Local Sub] Loaded:',
      consoleCount: 'Entries:',
      langLabel: 'Language',
      langValue: 'English'
    }
  };

  // 语言选项: auto -> zh-CN -> zh-TW -> en -> auto
  const LANG_ORDER = ['auto', 'zh-CN', 'zh-TW', 'en'];
  const LANG_KEY = 'tm_youtube_local_sub_lang';

  function getStoredLanguage() {
    return localStorage.getItem(LANG_KEY) || 'auto';
  }

  function setStoredLanguage(lang) {
    localStorage.setItem(LANG_KEY, lang);
  }

  function detectLanguage() {
    const stored = getStoredLanguage();
    if (stored && stored !== 'auto') return stored;

    const lang = navigator.language || 'en';
    if (lang.startsWith('zh-CN')) return 'zh-CN';
    if (lang.startsWith('zh')) return 'zh-TW'; // zh-TW, zh-HK, etc.
    return 'en';
  }

  let currentLang = detectLanguage();

  function t(key) {
    return MESSAGES[currentLang][key] || MESSAGES['en'][key];
  }

  function getLangDisplayValue(langCode) {
    if (langCode === 'auto') return 'Auto';
    return MESSAGES[langCode] ? MESSAGES[langCode].langValue : langCode;
  }

  /*** 初始化 ***/
  function init() {
    ensureNativeCaptionStyle();
    ensureOverlay();
    ensureFileInput();
    attachVideoListener();
    setupSettingsObserver();
    syncNativeSubtitleVisibility();
    updateOverlayFontSize();
  }

  // 注入：隐藏原生字幕 + 本地字幕黑底样式
  function ensureNativeCaptionStyle() {
    if (nativeStyleInjected) return;
    const style = document.createElement('style');
    style.textContent = `
/* 启用本地字幕时隐藏原生 CC */
.html5-video-player.tm-hide-native-subs .ytp-caption-window-container,
.html5-video-player.tm-hide-native-subs .ytp-caption-window-bottom,
.html5-video-player.tm-hide-native-subs .caption-window,
.html5-video-player.tm-hide-native-subs .ytp-caption-segment {
  display: none !important;
}

/* 本地字幕外层黑底半透明（接近原生） */
.tm-caption-box {
  display: inline-block;
  background: rgba(8, 8, 8, 0.80);
  padding: 2px 8px;
  border-radius: 2px;
  box-sizing: border-box;
}
`;
    document.head.appendChild(style);
    nativeStyleInjected = true;
  }

  // 创建 overlay 容器
  function ensureOverlay() {
    if (overlay && document.body.contains(overlay)) return;

    const player = document.querySelector('.html5-video-player');
    if (!player) return;

    overlay = document.createElement('div');
    overlay.id = 'tm-local-subtitle-overlay';
    Object.assign(overlay.style, {
      position: 'absolute',
      left: '0',
      right: '0',
      bottom: BOTTOM_PERCENT + '%',
      padding: '0 4%',
      textAlign: 'center',
      fontSize: FONT_SIZE_PX + 'px',
      lineHeight: '1.4',
      color: '#fff',
      textShadow: '0 0 2px #000, 0 0 4px #000, 0 0 6px #000',
      pointerEvents: 'none',
      zIndex: '9998',
      whiteSpace: 'pre-line',
      fontFamily: '"Segoe UI", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
    });

    if (!player.style.position || player.style.position === 'static') {
      player.style.position = 'relative';
    }

    player.appendChild(overlay);
  }

  // 根据是否全屏调整字号 / 位置
  function updateOverlayFontSize() {
    if (!overlay) return;
    const player = document.querySelector('.html5-video-player');
    if (!player) return;

    const isFullscreen =
      player.classList.contains('ytp-fullscreen') ||
      !!document.fullscreenElement;

    const size = isFullscreen ? FONT_SIZE_FULL_PX : FONT_SIZE_PX;
    overlay.style.fontSize = size + 'px';
    // 想全屏时稍微靠上一点可以放开下面这行：
    // overlay.style.bottom = isFullscreen ? '10%' : BOTTOM_PERCENT + '%';
  }

  function ensureFileInput() {
    if (fileInput) return;
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.srt,.vtt,.ass,.ssa,.lrc,.txt';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleFileChange);
    document.body.appendChild(fileInput);
  }

  function attachVideoListener() {
    const v = document.querySelector('video.html5-main-video');
    if (!v) return;
    video = v;
    if (video._tmLocalSubListenerAttached) return;

    video.addEventListener('timeupdate', onTimeUpdate);
    video._tmLocalSubListenerAttached = true;
  }

  function onTimeUpdate() {
    if (!overlay) return;

    if (!subtitles.length || !isLocalTrackActive) {
      setOverlayText('');
      return;
    }

    let ccOn = true;
    const ccBtn = document.querySelector('.ytp-subtitles-button');

    // 只有在“有原生字幕面板”的情况下才跟随 CC 按钮
    if (hasNativeSubtitlePanel && ccBtn) {
      ccOn = ccBtn.getAttribute('aria-pressed') === 'true';
    }
    // 否则（无字幕面板），忽略 CC 按钮，始终视为开启

    if (!ccOn) {
      setOverlayText('');
      return;
    }

    if (!video) return;
    const t = video.currentTime;
    updateSubtitleForTime(t);
  }

  /*** 设置菜单集成 ***/
  function setupSettingsObserver() {
    const player = document.querySelector('.html5-video-player');
    if (!player) return;
    const settingsMenu = player.querySelector('.ytp-settings-menu');
    if (!settingsMenu) return;

    if (settingsMenu._tmObserverAttached) return;

    const observer = new MutationObserver(() => {
      injectLocalSubtitleMenuItems(settingsMenu);
    });

    observer.observe(settingsMenu, { childList: true, subtree: true });
    settingsMenu._tmObserverAttached = true;

    injectLocalSubtitleMenuItems(settingsMenu);
  }

  // 在字幕面板里只做"关闭本地字幕"的 hook,不再插按钮;
  // 只在根菜单挂一个"本地字幕"按钮。
  function injectLocalSubtitleMenuItems(settingsMenu) {
    if (!settingsMenu) return;

    const menus = settingsMenu.querySelectorAll('.ytp-panel-menu');
    hasNativeSubtitlePanel = false;
    let rootMenu = null;

    menus.forEach((menu) => {
      // 结构判断: 如果菜单所在的 panel 有 header(通常包含返回按钮),那它就是二级子菜单
      // 根菜单通常没有 header
      const panel = menu.closest('.ytp-panel');
      const hasHeader = panel && panel.querySelector('.ytp-panel-header');

      if (hasHeader) {
        // 这是二级菜单(字幕、画质、速度等)
        // 检查是否是字幕面板,以便 hook "关闭" 按钮
        const labels = Array.from(menu.querySelectorAll('.ytp-menuitem-label')).map((el) =>
          el.textContent.trim()
        );
        const hasOff = labels.some((t) => /^(Off)$/i.test(t) || /关闭|關閉/.test(t));

        if (hasOff) {
          hasNativeSubtitlePanel = true;
          hookOtherSubtitleItems(menu);
        }
      } else {
        // 没有 header, 认为是根菜单
        rootMenu = menu;
      }
    });

    // 确保根菜单上有且只有一个"本地字幕"
    if (rootMenu) {
      if (!rootMenu.querySelector('.tm-local-sub-menuitem')) {
        createRootLocalMenuItem(rootMenu);
      }
    }
  }

  // 根菜单上的“本地字幕”按钮
  function createRootLocalMenuItem(menu) {
    const item = document.createElement('div');
    item.className = 'ytp-menuitem tm-local-sub-menuitem tm-local-sub-root-item';
    item.style.position = 'relative'; // 为定位语言按钮做准备

    const labelDiv = document.createElement('div');
    labelDiv.className = 'ytp-menuitem-label';

    // 主文本
    const textSpan = document.createElement('span');
    textSpan.className = 'tm-label-text';
    textSpan.textContent = t('btnLabel');
    labelDiv.appendChild(textSpan);

    // 语言切换小按钮
    const langSwitch = document.createElement('span');
    langSwitch.className = 'tm-lang-switch';
    langSwitch.textContent = '🌐'; // 或者用 SVG 图标
    langSwitch.title = 'Switch Language';
    Object.assign(langSwitch.style, {
      cursor: 'pointer',
      marginLeft: '8px',
      fontSize: '12px',
      opacity: '0.6',
      display: 'inline-block',
      verticalAlign: 'middle'
    });

    // 鼠标悬停效果
    langSwitch.onmouseover = () => langSwitch.style.opacity = '1';
    langSwitch.onmouseout = () => langSwitch.style.opacity = '0.6';

    // 点击语言切换
    langSwitch.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation(); // 阻止冒泡，不触发主菜单点击

      // 循环切换语言
      const currentStored = getStoredLanguage();
      const idx = LANG_ORDER.indexOf(currentStored);
      const nextIdx = (idx + 1) % LANG_ORDER.length;
      const nextLang = LANG_ORDER[nextIdx];

      setStoredLanguage(nextLang);
      currentLang = detectLanguage(); // 重新检测

      updateAllInterfaceText();
    });

    labelDiv.appendChild(langSwitch);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'ytp-menuitem-content';
    contentDiv.textContent = subtitles.length ? (isLocalTrackActive ? t('statusEnabled') : t('statusLoaded')) : t('statusNotLoaded');

    item.appendChild(labelDiv);
    item.appendChild(contentDiv);

    // 点击主菜单项（加载/开关字幕）
    item.addEventListener('click', function (e) {
      // 如果点的是语言按钮，已经在上面处理了，这里忽略
      if (e.target === langSwitch) return;

      e.preventDefault();
      e.stopPropagation();

      if (!subtitles.length) {
        // 首次点击：还没加载文件 => 弹文件选择
        if (fileInput) fileInput.click();
      } else {
        // 已有字幕：根菜单按钮负责开/关本地字幕
        isLocalTrackActive = !isLocalTrackActive;

        updateMenuStatus();
        syncNativeSubtitleVisibility();

        const ccBtn = document.querySelector('.ytp-subtitles-button');
        if (hasNativeSubtitlePanel && ccBtn && isLocalTrackActive && ccBtn.getAttribute('aria-pressed') !== 'true') {
          ccBtn.click();
        }

        if (!isLocalTrackActive) {
          setOverlayText('');
          currentIndex = -1;
        } else if (video) {
          onTimeUpdate();
        }
      }
    });

    menu.appendChild(item);
  }

  function updateAllInterfaceText() {
    // 更新所有已存在的菜单项文本
    const subLabelText = document.querySelector('.tm-local-sub-menuitem .tm-label-text');
    if (subLabelText) subLabelText.textContent = t('btnLabel');

    updateMenuStatus();
  }

  // 字幕选择面板里：选其他字幕/Off 时关闭本地字幕
  function hookOtherSubtitleItems(menu) {
    const items = menu.querySelectorAll('.ytp-menuitem');
    items.forEach((mi) => {
      if (mi.classList.contains('tm-local-sub-menuitem')) return;
      if (mi._tmLocalHooked) return;
      mi._tmLocalHooked = true;
      mi.addEventListener('click', function () {
        isLocalTrackActive = false;
        updateMenuStatus();
        syncNativeSubtitleVisibility();
        setOverlayText('');
        currentIndex = -1;
      });
    });
  }

  function updateMenuStatus() {
    const elems = document.querySelectorAll('.tm-local-sub-menuitem .ytp-menuitem-content');
    elems.forEach((el) => {
      if (!subtitles.length) {
        el.textContent = t('statusNotLoaded');
      } else if (isLocalTrackActive) {
        el.textContent = t('statusEnabled');
      } else {
        el.textContent = t('statusLoaded');
      }
    });
  }

  // 控制原生字幕显隐
  function syncNativeSubtitleVisibility() {
    const player = document.querySelector('.html5-video-player');
    if (!player) return;
    if (isLocalTrackActive) {
      player.classList.add('tm-hide-native-subs');
    } else {
      player.classList.remove('tm-hide-native-subs');
    }
  }

  /*** 新视频时重置本地字幕状态 ***/
  function resetLocalSubtitleState() {
    subtitles = [];
    currentIndex = -1;
    isLocalTrackActive = false;
    hasNativeSubtitlePanel = false;
    setOverlayText('');
    syncNativeSubtitleVisibility();
    updateMenuStatus();
  }

  /*** 文件加载 & 字幕解析 ***/
  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = ''; // 允许重复选同一个文件
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      const text = ev.target && ev.target.result ? String(ev.target.result) : '';
      loadSubtitlesFromText(text, file.name);
    };
    reader.readAsText(file, 'utf-8');
  }

  function loadSubtitlesFromText(text, filename) {
    const isVtt = /^\s*WEBVTT/i.test(text);
    if (isVtt) {
      subtitles = parseVtt(text);
    } else {
      subtitles = parseSrt(text);
    }

    subtitles.sort((a, b) => a.start - b.start);
    currentIndex = -1;
    isLocalTrackActive = subtitles.length > 0;
    updateMenuStatus();
    syncNativeSubtitleVisibility();

    console.log(t('consoleLoaded'), filename, t('consoleCount'), subtitles.length);

    const ccBtn = document.querySelector('.ytp-subtitles-button');
    if (hasNativeSubtitlePanel && ccBtn && isLocalTrackActive && ccBtn.getAttribute('aria-pressed') !== 'true') {
      ccBtn.click();
    }

    if (video) onTimeUpdate();
  }

  function parseSrt(text) {
    const lines = text.replace(/\r/g, '').split('\n');
    const entries = [];
    let i = 0;

    while (i < lines.length) {
      let line = lines[i].trim();

      if (!line) {
        i++;
        continue;
      }

      // 跳过序号行
      if (/^\d+$/.test(line)) {
        i++;
        line = (lines[i] || '').trim();
      }

      const timeMatch = line.match(/(.+?)\s*-->\s*(.+)/);
      if (!timeMatch) {
        i++;
        continue;
      }

      const start = parseTime(timeMatch[1]);
      const end = parseTime(timeMatch[2]);

      i++;
      const textLines = [];
      while (i < lines.length && lines[i].trim() !== '') {
        textLines.push(lines[i]);
        i++;
      }

      entries.push({
        start,
        end,
        text: textLines.join('\n'),
      });
    }
    return entries;
  }

  function parseVtt(text) {
    const lines = text.replace(/\r/g, '').split('\n');
    const entries = [];
    let i = 0;

    // 跳过 WEBVTT 头以及空行/注释
    while (i < lines.length) {
      const l = lines[i].trim();
      if (l === '' || /^WEBVTT/i.test(l) || l.startsWith('NOTE')) {
        i++;
      } else {
        break;
      }
    }

    while (i < lines.length) {
      let line = lines[i].trim();

      if (!line) {
        i++;
        continue;
      }

      // 可选 cue id
      if (!line.includes('-->')) {
        i++;
        line = (lines[i] || '').trim();
      }

      const timeMatch = line.match(/(.+?)\s*-->\s*(.+)/);
      if (!timeMatch) {
        i++;
        continue;
      }

      const start = parseTime(timeMatch[1]);
      const end = parseTime(timeMatch[2]);

      i++;
      const textLines = [];
      while (i < lines.length && lines[i].trim() !== '') {
        textLines.push(lines[i]);
        i++;
      }

      entries.push({
        start,
        end,
        text: textLines.join('\n'),
      });
    }

    return entries;
  }

  // 宽松时间解析：支持 hh:mm:ss.mmm / mm:ss,mmm / ss.mmm / ss
  function parseTime(raw) {
    if (!raw) return 0;
    let t = String(raw).trim();
    t = t.split(/[ \t]/)[0]; // 去掉样式信息
    t = t.replace(',', '.');

    const parts = t.split(':');
    let h = 0;
    let m = 0;
    let s = 0;

    if (parts.length === 3) {
      h = parseInt(parts[0], 10) || 0;
      m = parseInt(parts[1], 10) || 0;
      s = parseFloat(parts[2]) || 0;
    } else if (parts.length === 2) {
      m = parseInt(parts[0], 10) || 0;
      s = parseFloat(parts[1]) || 0;
    } else if (parts.length === 1) {
      s = parseFloat(parts[0]) || 0;
    }

    return h * 3600 + m * 60 + s;
  }

  /*** 字幕显示逻辑 ***/
  function setOverlayText(str) {
    if (!overlay) return;
    if (!str) {
      overlay.textContent = '';
      return;
    }
    overlay.innerHTML =
      '<span class="tm-caption-box">' +
      escapeHtml(str).replace(/\n/g, '<br>') +
      '</span>';
  }

  function updateSubtitleForTime(t) {
    if (!overlay) return;
    if (!subtitles.length) {
      setOverlayText('');
      return;
    }

    if (currentIndex >= 0) {
      const cur = subtitles[currentIndex];
      if (t >= cur.start && t <= cur.end) {
        return; // 仍在当前字幕范围内
      }

      if (t > cur.end) {
        // 向后查找
        let i = currentIndex + 1;
        while (i < subtitles.length && subtitles[i].start <= t) {
          if (t >= subtitles[i].start && t <= subtitles[i].end) {
            currentIndex = i;
            setOverlayText(subtitles[i].text);
            return;
          }
          i++;
        }
      } else if (t < cur.start) {
        // 向前回溯
        let i = currentIndex - 1;
        while (i >= 0 && subtitles[i].end >= t) {
          if (t >= subtitles[i].start && t <= subtitles[i].end) {
            currentIndex = i;
            setOverlayText(subtitles[i].text);
            return;
          }
          i--;
        }
      }
    }

    // 二分查找
    let low = 0;
    let high = subtitles.length - 1;
    let found = -1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const cue = subtitles[mid];
      if (t < cue.start) {
        high = mid - 1;
      } else if (t > cue.end) {
        low = mid + 1;
      } else {
        found = mid;
        break;
      }
    }

    if (found !== -1) {
      currentIndex = found;
      setOverlayText(subtitles[found].text);
    } else {
      currentIndex = -1;
      setOverlayText('');
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /*** 启动逻辑 ***/
  onReady(init);

  // YouTube 单页路由：开始跳转时就重置本地字幕；跳转完成后重新 init
  window.addEventListener(
    'yt-navigate-start',
    () => {
      resetLocalSubtitleState();
    },
    true
  );

  window.addEventListener(
    'yt-navigate-finish',
    () => {
      setTimeout(init, 1000);
    },
    true
  );

  // 监听全屏切换，动态调整字号
  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(
    (evt) => {
      document.addEventListener(evt, updateOverlayFontSize, false);
    }
  );

  // 定时兜底检查（防止某些奇怪情况下 init 没跑到）
  setInterval(init, 5000);
})();

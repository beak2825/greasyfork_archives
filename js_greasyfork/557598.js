// ==UserScript==
// @name         微信读书阅读时长估算
// @namespace    https://okjk.co/VJQF62
// @version      1.2.0
// @description  在工具栏第一位显示章节阅读时长（分钟徽标）；悬停与点击均在左侧弹出；按书本保存“掌握程度”设置；失败时回退统计正文字数。
// @match        https://weread.qq.com/web/reader/*
// @run-at       document-idle
// @author       moyuguy
// @homepage     https://github.com/moyuguy
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557598/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E4%BC%B0%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/557598/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%E4%BC%B0%E7%AE%97.meta.js
// ==/UserScript==

(function () {
  const STYLE_ID = 'wr-rt-left-style';
  const BTN_ID = 'wr-rt-btn';
  const PANEL_ID = 'wr-rt-panel';
  const TOOLTIP_CONTAINER_CLASS = 'wr_tooltip_container';
  const READER_CONTROLS_SEL = '.readerControls';
  const BADGE_ID = 'wr-rt-badge';

  // —— 经验速度（中文 每分钟字数）——
  const SPEEDS = {
    困难: 300,
    普通: 450,
    轻松: 600,
  };

  // ===== Theme Detection =====
  function isDarkTheme() {
    // 方法1: 检查微信读书主题切换按钮的状态
    // 微信读书的主题按钮通常是最后一个readerControls_item，className包含white
    const themeBtns = [
      document.querySelector('.readerControls_item.white'),
      document.querySelector('.readerControls_item[title*="主题"]'),
      document.querySelector('.readerControls_item[title*="夜间"]'),
      document.querySelector('.readerControls_item[title*="日间"]'),
      // 也检查所有readerControls_item，找最后一个
      ...Array.from(document.querySelectorAll('.readerControls_item')).slice(-2)
    ].filter(Boolean);
    
    for (const themeBtn of themeBtns) {
      const title = themeBtn.getAttribute('title') || themeBtn.textContent || '';
      const className = themeBtn.className || '';
      console.log('🔍 Checking button:', { title, className });
      
      // 如果按钮显示"日间"，说明当前是夜间模式
      if (title.includes('日间')) {
        console.log('🌙 Dark theme detected via button (shows 日间)');
        return true;
      }
      // 如果按钮显示"夜间"，说明当前是日间模式
      if (title.includes('夜间')) {
        console.log('☀️ Light theme detected via button (shows 夜间)');
        return false;
      }
      
      // 检查className，white通常表示主题按钮
      if (className.includes('white')) {
        console.log('🎯 Found theme button with white class');
        // 这里我们需要通过其他方式判断当前主题
        break;
      }
    }
    
    // 方法2: 检查页面背景色
    const elements = [document.body, document.documentElement, document.querySelector('.app'), document.querySelector('.readerApp')];
    
    for (const element of elements) {
      if (!element) continue;
      
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      
      console.log(`🎨 Checking ${element.tagName || element.className}: ${bgColor}`);
      
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        // 解析RGB值
        const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (rgbMatch) {
          const [, r, g, b] = rgbMatch.map(Number);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          console.log(`📊 RGB: ${r}, ${g}, ${b}, Brightness: ${brightness}`);
          
          if (brightness < 100) {
            console.log('🌙 Dark theme detected via background brightness');
            return true;
          } else if (brightness > 200) {
            console.log('☀️ Light theme detected via background brightness');
            return false;
          }
        }
      }
    }
    
    // 方法3: 检查文字颜色（暗色主题通常文字是浅色）
    const textColor = window.getComputedStyle(document.body).color;
    console.log('📝 Text color:', textColor);
    
    if (textColor) {
      const rgbMatch = textColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        console.log(`📊 Text brightness: ${brightness}`);
        
        if (brightness > 180) {
          console.log('🌙 Dark theme detected via text color (light text)');
          return true;
        }
      }
    }
    
    console.log('🔄 Using default theme: light');
    return false; // 默认浅色主题
  }

  // ===== Style =====
  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const isDark = isDarkTheme();
    const css = `
      /* 让官方容器允许向左溢出 */
      .readerControls, .readerControls .${TOOLTIP_CONTAINER_CLASS} { overflow: visible !important; }

      /* 主按钮：匹配官方48x48px尺寸 */
      #${BTN_ID}{
        position: relative;
        width: 48px; height: 48px;
        border-radius: 50%;
        border: none;
        background: ${isDark ? '#1C1C1D' : '#fff'};
        box-shadow: ${isDark ? '0 2px 8px rgba(0,0,0,.3)' : '0 2px 8px rgba(0,0,0,.08)'};
        display: grid; place-items: center;
        cursor: pointer;
        outline: none;
        transition: all 0.2s ease;
      }
      #${BTN_ID}:hover{ 
        box-shadow: ${isDark ? '0 4px 12px rgba(0,0,0,.4)' : '0 4px 12px rgba(0,0,0,.12)'};
      }
      #${BTN_ID} svg{ 
        width: 24px; height: 24px; 
        color: ${isDark ? '#8C8C8E' : '#61656b'};
        transition: color 0.2s ease;
      }
      #${BTN_ID}:hover svg{ 
        color: ${isDark ? '#F0F0F2' : '#61656b'};
      }

      /* 右上角分钟徽标 */
      #${BADGE_ID}{
        position:absolute; right:-3px; top:-3px;
        min-width:20px; height:20px; padding:0 4px;
        background:#2e7d32; color:#fff; font-size:12px; line-height:20px;
        border-radius:10px; text-align:center; font-weight:700;
        box-shadow: 0 0 0 2px ${isDark ? '#1C1C1D' : '#fff'};
        pointer-events:none;
        transition: box-shadow 0.2s ease;
      }

      /* 左侧弹层（对齐官方浮层风格） */
      #${PANEL_ID}{
        position:absolute;
        right: calc(100% + 10px); /* 向左侧弹出 */
        top: 0;
        width: 260px;  /* 收紧宽度以适配笔记本 */
        background: ${isDark ? '#1C1C1D' : '#fff'};
        border: ${isDark ? '1px solid #404040' : 'none'};
        border-radius: 10px;
        box-shadow: ${isDark ? '0 8px 24px rgba(0,0,0,.4)' : '0 8px 24px rgba(0,0,0,.12)'};
        padding: 12px 12px 10px;
        z-index: 9999;
        display:none;
        transition: all 0.2s ease;
      }
      #${PANEL_ID}.show{ display:block; }

      /* 面板内容 */
      .wr-rt-title{
        font-size:13px; font-weight:600; 
        color: ${isDark ? '#e0e0e0' : '#222'};
        max-height: 40px; overflow: hidden;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        transition: color 0.2s ease;
      }
      .wr-rt-sub{
        margin-top:6px; font-size:12px; 
        color: ${isDark ? '#b0b0b0' : '#666'}; 
        font-weight:500;
        transition: color 0.2s ease;
      }
      .wr-rt-divider{ 
        height:1px; 
        background: ${isDark ? '#404040' : '#eee'}; 
        margin:10px 0;
        transition: background 0.2s ease;
      }

      /* 设置（点击时展开） */
      .wr-rt-settings{ display:none; }
      .wr-rt-settings.show{ display:block; }
      .wr-rt-group-title{ 
        font-size:12px; 
        color: ${isDark ? '#c0c0c0' : '#444'}; 
        margin-bottom:6px; font-weight:600;
        transition: color 0.2s ease;
      }
      .wr-rt-opts{ display:flex; flex-direction:column; gap:6px; }
      .wr-rt-radio{
        display:flex; align-items:center; gap:8px;
        padding:8px; 
        border:1px solid ${isDark ? '#404040' : '#e8e8e8'}; 
        border-radius:8px;
        font-size:12px; 
        color: ${isDark ? '#d0d0d0' : '#333'}; 
        cursor:pointer;
        background: ${isDark ? '#1a1a1a' : 'transparent'};
        transition: all 0.2s ease;
      }
      .wr-rt-radio:hover{
        border-color: ${isDark ? '#505050' : '#d0d0d0'};
        background: ${isDark ? '#333' : '#f8f8f8'};
      }
      .wr-rt-radio input{ transform:translateY(1px); }
      .wr-rt-radio.active{ 
        border-color:#2e7d32; 
        background: ${isDark ? '#1a3a1a' : '#f4faf4'};
      }

      /* 与官方 tooltip 的间距一致 */
      .${TOOLTIP_CONTAINER_CLASS}{ --offset: 6px; }
    `;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== DOM utils =====
  function el(html) {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstElementChild;
  }

  // ===== Book / Chapter detection =====
  function getBookId() {
    try {
      const ld = document.querySelector('script[type="application/ld+json"]');
      if (ld) {
        const j = JSON.parse(ld.textContent || '{}');
        return j['@Id'] || j.bookId || (j.book && j.book.bookId) || null;
      }
    } catch {}
    return null;
  }

  function norm(s) {
    return (s || '')
      .replace(/[\s\p{P}·•—–-]+/gu, '')
      .toLowerCase();
  }

  function getCurrentChapterTitle() {
    const sels = [
      '.readerTopBar_title',
      '.wr_readerTopBar_title',
      '.readerChapterTitle',
      '.chapterTitle',
      '.reader_header_title',
      '.wr_reader_header_title'
    ];
    for (const s of sels) {
      const n = document.querySelector(s);
      if (n && n.textContent.trim()) return n.textContent.trim();
    }
    // 退化：抓正文第一个大号标题
    const h = document.querySelector('h1,h2,.section-title,.title');
    return h ? h.textContent.trim() : document.title.replace(/\s*\|\s*微信读书.*/,'');
  }

  // 缓存：避免频繁请求
  const cache = { chapterListByBook: new Map() };

  async function fetchChapterInfos(bookId) {
    if (cache.chapterListByBook.has(bookId)) return cache.chapterListByBook.get(bookId);
    try {
      const r = await fetch('/web/book/chapterInfos', {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({ bookIds: [String(bookId)], synckeys: ['0'], teenmode: 0 }),
      });
      const j = await r.json().catch(() => ({}));
      const list = j?.data?.[0]?.updated || [];
      cache.chapterListByBook.set(bookId, list);
      return list;
    } catch {
      return [];
    }
  }

  function findChapterMeta(chapters, title) {
    if (!chapters?.length) return null;
    const tNorm = norm(title);
    // 完整包含匹配优先
    let best = chapters.find(c => norm(c.title) === tNorm)
      || chapters.find(c => norm(c.title).includes(tNorm) || tNorm.includes(norm(c.title)));
    if (!best) {
      // 简单相似度：最长公共子串长度
      let maxScore = 0;
      for (const c of chapters) {
        const cn = norm(c.title);
        let score = 0;
        // 取两端关键词（数字+短语）
        const keys = title.split(/\s+/).slice(0, 3);
        for (const k of keys) if (cn.includes(norm(k))) score += norm(k).length;
        if (score > maxScore) { maxScore = score; best = c; }
      }
    }
    return best || null;
  }

  // 退化统计：从正文数字符（中英数字）
  function countVisibleChars() {
    const candidates = [
      '.readerChapterContent', '.wr_reader_content', '.app_content',
      'article', '.renderTargetContent', '.readerContent'
    ];
    let host = null;
    for (const s of candidates) { const n = document.querySelector(s); if (n) { host = n; break; } }
    if (!host) host = document.body;
    const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const t = node.nodeValue;
        if (!t || !t.trim()) return NodeFilter.FILTER_REJECT;
        // 排除隐藏
        const p = node.parentElement;
        const style = p && getComputedStyle(p);
        if (style && (style.visibility === 'hidden' || style.display === 'none')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let count = 0, n;
    const re = /[\u4e00-\u9fffA-Za-z0-9]/g;
    while ((n = walker.nextNode())) {
      const m = n.nodeValue.match(re);
      if (m) count += m.length;
    }
    return count;
  }

  // ===== Settings (per book) =====
  function getSpeed(bookId) {
    const key = `wrRtSpeed:${bookId}`;
    const diffKey = `wrRtDiff:${bookId}`;
    const diff = localStorage.getItem(diffKey) || '普通';
    const sp = Number(localStorage.getItem(key));
    return { diff, cpm: Number.isFinite(sp) && sp > 0 ? sp : SPEEDS[diff] };
  }
  function setDiff(bookId, diff) {
    const key = `wrRtSpeed:${bookId}`;
    const diffKey = `wrRtDiff:${bookId}`;
    localStorage.setItem(diffKey, diff);
    localStorage.setItem(key, String(SPEEDS[diff]));
  }

  // ===== UI build =====
  function buildButton() {
    const btn = el(`
      <button id="${BTN_ID}" class="readerControls_item" title="阅读时长">
        <!-- clock icon -->
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm0 18.2A8.2 8.2 0 1 1 12 3.8a8.2 8.2 0 0 1 0 16.4Zm.7-12.9h-1.4v5.2l4.5 2.6.7-1.2-3.8-2.2V7.3Z"/>
        </svg>
        <span id="${BADGE_ID}">--</span>
      </button>
    `);
    return btn;
  }

  function buildPanel() {
    const panel = el(`
      <div id="${PANEL_ID}" role="dialog" aria-label="阅读时长">
        <div class="wr-rt-title">正在获取章节信息…</div>
        <div class="wr-rt-sub">—</div>
        <div class="wr-rt-divider"></div>
        <div class="wr-rt-settings">
          <div class="wr-rt-group-title">掌握程度</div>
          <div class="wr-rt-opts">
            ${Object.keys(SPEEDS).map(k => `
              <label class="wr-rt-radio" data-diff="${k}">
                <input type="radio" name="wr-rt-diff" value="${k}"/>
                <span>${k}（≈${SPEEDS[k]} 字/分）</span>
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `);
    return panel;
  }

  // ===== Theme Observer =====
  function observeThemeChanges() {
    let lastTheme = isDarkTheme();
    console.log('🌟 Initial theme:', lastTheme ? 'dark' : 'light');
    
    const updateTheme = () => {
      const currentTheme = isDarkTheme();
      if (currentTheme !== lastTheme) {
        console.log('🎨 Theme changed:', lastTheme ? 'dark' : 'light', '->', currentTheme ? 'dark' : 'light');
        lastTheme = currentTheme;
        
        // 立即移除旧样式并注入新样式
        const existingStyle = document.getElementById(STYLE_ID);
        if (existingStyle) {
          existingStyle.remove();
        }
        injectStyle();
        
        console.log('✅ Theme updated instantly');
        return true;
      }
      return false;
    };
    
    // 监听主题按钮点击
    const setupThemeButtonListener = () => {
      // 查找所有可能的主题按钮
      const selectors = [
        '.readerControls_item.white',  // 微信读书的主题按钮
        '.readerControls_item[title*="主题"]',
        '.readerControls_item[title*="夜间"]', 
        '.readerControls_item[title*="日间"]',
        '[class*="theme"][class*="btn"]',
        '[class*="theme"][class*="button"]'
      ];
      
      // 同时监听所有readerControls_item（包括最后几个）
      const allControls = document.querySelectorAll('.readerControls_item');
      const lastControls = Array.from(allControls).slice(-3); // 最后3个控件
      
      const allButtons = [];
      selectors.forEach(selector => {
        allButtons.push(...document.querySelectorAll(selector));
      });
      allButtons.push(...lastControls);
      
      allButtons.forEach(btn => {
        if (btn && !btn.hasAttribute('data-theme-listener')) {
          const title = btn.getAttribute('title') || btn.textContent || '';
          const className = btn.className || '';
          
          // 如果是主题相关按钮或者是white class的按钮
          if (title.includes('主题') || title.includes('夜间') || title.includes('日间') || 
              className.includes('white')) {
            btn.setAttribute('data-theme-listener', 'true');
            btn.addEventListener('click', () => {
              console.log('🔘 Theme button clicked:', { title, className });
              // 立即检查主题变化，然后快速跟进检查
              updateTheme();
              setTimeout(updateTheme, 50);
              setTimeout(updateTheme, 150);
            });
            console.log('✅ Theme button listener attached to:', { title, className });
          }
        }
      });
    };
    
    // 监听DOM变化（更全面的监听）
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          const attrName = mutation.attributeName;
          if (attrName === 'style' || attrName === 'class' || attrName === 'data-theme') {
            console.log(`🔍 ${mutation.target.tagName} ${attrName} changed:`, mutation.target.getAttribute(attrName));
            shouldCheck = true;
          }
        } else if (mutation.type === 'childList') {
          // 检查是否有新的主题相关元素添加
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const element = node;
              if (element.className && (element.className.includes('theme') || element.className.includes('dark') || element.className.includes('light'))) {
                console.log('🆕 Theme-related element added:', element.className);
                shouldCheck = true;
              }
            }
          });
        }
      });
      if (shouldCheck) {
        console.log('📝 DOM changed, checking theme');
        updateTheme(); // 立即检查
        setTimeout(updateTheme, 16); // 一帧后再次检查确保完成
      }
    });
    
    // 监听多个目标元素
    const targets = [
      document.documentElement,
      document.body,
      document.querySelector('.app'),
      document.querySelector('.readerApp'),
      document.querySelector('.wr_readerApp')
    ].filter(Boolean);
    
    targets.forEach(target => {
      observer.observe(target, {
        attributes: true,
        attributeFilter: ['style', 'class', 'data-theme', 'data-mode'],
        childList: true,
        subtree: false
      });
      console.log('👀 Observing:', target.tagName || target.className);
    });
    
    // 定期检查主题按钮并设置监听器
    const buttonCheckInterval = setInterval(() => {
      setupThemeButtonListener();
    }, 1000);
    
    // 定时检查主题变化（兜底方案）
    const themeCheckInterval = setInterval(() => {
      updateTheme();
    }, 2000);
    
    // 初始设置主题按钮监听器
    setTimeout(setupThemeButtonListener, 1000);
    
    return { 
      observer, 
      buttonCheckInterval,
      themeCheckInterval,
      cleanup: () => {
        clearInterval(buttonCheckInterval);
        clearInterval(themeCheckInterval);
        observer.disconnect();
      }
    };
  }

  // ===== Mount / logic =====
  let pinned = false; // 点击后固定展开
  let panel, btn, badge;
  let themeWatcher;

  async function updateDataAndUI({ showPanel = false, openSettings = false } = {}) {
    const bookId = getBookId();
    const chapTitle = getCurrentChapterTitle();
    const { diff, cpm } = getSpeed(bookId || 'global');

    let wordCount = 0, matchedTitle = chapTitle, source = 'api';
    if (bookId) {
      const chapters = await fetchChapterInfos(bookId);
      const match = findChapterMeta(chapters, chapTitle);
      if (match && Number(match.wordCount) > 0) {
        wordCount = Number(match.wordCount);
        matchedTitle = match.title || chapTitle;
      }
    }
    if (!wordCount) { // fallback
      wordCount = countVisibleChars();
      source = 'dom';
    }

    const minutes = Math.max(1, Math.ceil(wordCount / Math.max(1, cpm)));
    // 徽标
    badge.textContent = String(minutes);

    // 面板内容
    panel.querySelector('.wr-rt-title').textContent = matchedTitle;
    panel.querySelector('.wr-rt-sub').textContent =
      `约 ${minutes} 分钟 · ${wordCount} 字 · ${diff}（${cpm}字/分${source==='dom'?' · 估算':''}）`;

    // 设置区状态
    const settings = panel.querySelector('.wr-rt-settings');
    settings.classList.toggle('show', !!openSettings);
    
    // 面板显示状态
    panel.classList.toggle('show', !!showPanel);

    // 高亮当前难度
    panel.querySelectorAll('.wr-rt-radio').forEach(x => {
      const on = x.getAttribute('data-diff') === diff;
      x.classList.toggle('active', on);
      const input = x.querySelector('input');
      if (input) input.checked = on;
    });
  }

  function attachEvents(container) {
    const wrapper = el(`<div class="${TOOLTIP_CONTAINER_CLASS}" style="--offset:6px; position:relative;"></div>`);
    btn = buildButton();
    badge = btn.querySelector('#'+BADGE_ID);
    panel = buildPanel();

    wrapper.appendChild(btn);
    wrapper.appendChild(panel);

    // 插到第一位
    container.insertBefore(wrapper, container.firstElementChild);

    // 悬停：显示详情（不显示设置）
    let hoverTimer;
    const showHover = () => {
      if (pinned) return;
      clearTimeout(hoverTimer);
      updateDataAndUI({ showPanel: true, openSettings: false });
    };
    const hideHover = () => {
      if (pinned) return;
      hoverTimer = setTimeout(() => {
        updateDataAndUI({ showPanel: false, openSettings: false });
      }, 120);
    };

    btn.addEventListener('mouseenter', showHover);
    btn.addEventListener('mouseleave', hideHover);
    panel.addEventListener('mouseenter', () => { if (!pinned) clearTimeout(hoverTimer); });
    panel.addEventListener('mouseleave', hideHover);

    // 点击：切换固定状态并展开设置
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (pinned) {
        // 如果已经固定，则取消固定并隐藏
        pinned = false;
        await updateDataAndUI({ showPanel: false, openSettings: false });
      } else {
        // 如果未固定，则固定并显示设置
        pinned = true;
        await updateDataAndUI({ showPanel: true, openSettings: true });
      }
    });

    // 点击外部关闭
    document.addEventListener('click', (e) => {
      if (!pinned) return;
      if (!panel.contains(e.target) && e.target !== btn) {
        pinned = false;
        updateDataAndUI({ showPanel: false, openSettings: false });
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { 
        pinned = false; 
        updateDataAndUI({ showPanel: false, openSettings: false });
      }
    });

    // 切换掌握程度
    panel.querySelectorAll('.wr-rt-radio input').forEach(input => {
      input.addEventListener('change', async () => {
        const diff = input.value;
        const bookId = getBookId() || 'global';
        setDiff(bookId, diff);
        await updateDataAndUI({ openSettings: true });
      });
    });

    // 初始先拉一次数据，徽标不空着，但不显示面板
    updateDataAndUI({ showPanel: false, openSettings: false });

    // 监听标题变化（翻章时）
    const titleNode = document.querySelector('.readerTopBar_title') || document.body;
    const mo = new MutationObserver(() => {
      if (!pinned) updateDataAndUI({ openSettings: false });
    });
    mo.observe(titleNode, { childList: true, subtree: true, characterData: true });
  }

  function mount() {
    injectStyle();
    const container = document.querySelector(READER_CONTROLS_SEL);
    if (container && !document.getElementById(BTN_ID)) {
      attachEvents(container);
      // 启动主题监听器
      if (!themeWatcher) {
        themeWatcher = observeThemeChanges();
      }
    }
  }

  // 初装 & 重渲染兜底
  mount();
  const mo = new MutationObserver(() => mount());
  mo.observe(document.body, { childList: true, subtree: true });
})();
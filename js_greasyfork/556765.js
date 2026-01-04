// ==UserScript==
// @name         烟草网络学院通用智能学习助手 v10.0（内存优化版）
// @namespace    http://tampermonkey.net/
// @version      10.0.0
// @description  优化内存占用，单标签页运行，智能资源清理
// @author       Copilot & Assistant
// @match        https://mooc.ctt.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556765/%E7%83%9F%E8%8D%89%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E9%80%9A%E7%94%A8%E6%99%BA%E8%83%BD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20v100%EF%BC%88%E5%86%85%E5%AD%98%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/556765/%E7%83%9F%E8%8D%89%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E9%80%9A%E7%94%A8%E6%99%BA%E8%83%BD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20v100%EF%BC%88%E5%86%85%E5%AD%98%E4%BC%98%E5%8C%96%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
'use strict';

// --- 内存优化：清理定时器和事件监听 ---
const CLEANUP = {
  timers: [],
  observers: [],
  addTimer(id) { this.timers.push(id); },
  addObserver(obs) { this.observers.push(obs); },
  clear() {
    this.timers.forEach(t => clearInterval(t));
    this.observers.forEach(o => o.disconnect());
    this.timers = [];
    this.observers = [];
  }
};

// --- 样式注入（压缩） ---
GM_addStyle(`
#yt-helper-panel{position:fixed;bottom:20px;right:20px;z-index:999999;background:rgba(0,0,0,0.9);color:#fff;padding:12px;border-radius:8px;font-size:13px;box-shadow:0 4px 15px rgba(0,0,0,0.5);width:240px;border-left:4px solid #9C27B0}
#yt-helper-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid #444;padding-bottom:5px}
#yt-helper-content{margin-bottom:8px;line-height:1.4;color:#ddd}
.yt-btn{background:#2196F3;color:#fff;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px;margin-right:5px}
.yt-btn:hover{background:#1976D2}
.yt-btn.warn{background:#FF9800}
#yt-controls{display:flex;gap:5px}
`);

// --- 状态管理 ---
const STATE = {
  returnUrl: GM_getValue('returnUrl', ''),
  completedCourses: new Set(JSON.parse(GM_getValue('completedCourses', '[]'))),
  isProcessing: false,
  currentVideo: null
};

// --- UI 工具 ---
const UI = {
  panel: null,
  content: null,
  init() {
    if (this.panel) return;
    this.panel = document.createElement('div');
    this.panel.id = 'yt-helper-panel';
    this.panel.innerHTML = `
      <div id="yt-helper-header">
        <span style="font-weight:bold">🎓 学习助手 v10.0</span>
        <span id="yt-status-icon">🤖</span>
      </div>
      <div id="yt-helper-content">初始化中...</div>
      <div id="yt-controls">
        <button id="btn-scan-cat" class="yt-btn">📂 扫目录</button>
        <button id="btn-scan-vid" class="yt-btn warn">🎬 扫视频</button>
      </div>
    `;
    document.body.appendChild(this.panel);
    this.content = this.panel.querySelector('#yt-helper-content');
    
    document.getElementById('btn-scan-cat').onclick = () => {
      this.update('手动启动目录扫描...', 'search');
      handleCatalog();
    };
    document.getElementById('btn-scan-vid').onclick = () => {
      this.update('手动启动视频检测...', 'search');
      handleVideo();
    };
  },
  update(msg, type = 'normal') {
    if (!this.panel) this.init();
    const icons = {normal:'🤖',success:'✅',warn:'⚠️',error:'❌',play:'▶️',search:'🔍'};
    this.panel.querySelector('#yt-status-icon').textContent = icons[type] || '🤖';
    this.content.textContent = msg;
    console.log(`[助手] ${msg}`);
  }
};

// --- 基础工具 ---
function saveReturnUrl(url) {
  if (!url || url.includes('course/detail') || url.includes('video/play')) return;
  STATE.returnUrl = url;
  GM_setValue('returnUrl', url);
}

function isCompleted(item) {
  if (!item) return false;
  const text = item.textContent || '';
  return text.includes('复习') || text.includes('已完成') || text.includes('100%') ||
         !!item.querySelector('.completed, .status-completed, [class*="complete"]');
}

// --- 内存优化：单标签页跳转（添加页面卸载清理） ---
function singleTabClick(item) {
  // 跳转前清理资源
  CLEANUP.clear();
  if (STATE.currentVideo) {
    STATE.currentVideo.pause();
    STATE.currentVideo.src = '';
    STATE.currentVideo = null;
  }
  
  const target = item.querySelector('a') || item.querySelector('.title') || item;
  let href = null;
  
  if (target.tagName === 'A') {
    href = target.getAttribute('href');
  } else {
    const link = item.querySelector('a');
    if (link) href = link.getAttribute('href');
  }
  
  if (href && href !== '#' && !href.startsWith('javascript')) {
    console.log('使用 href 跳转:', href);
    window.location.href = href;
    return true;
  }
  
  // 强制当前标签页打开
  if (target.tagName === 'A') target.setAttribute('target', '_self');
  item.querySelectorAll('a').forEach(a => a.setAttribute('target', '_self'));
  
  try {
    target.click();
    return true;
  } catch (e) {
    try {
      target.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true}));
      return true;
    } catch (e2) { 
      return false; 
    }
  }
}

// --- 寻找下一集（避免返回目录） ---
async function findNextOrReturn(ignoreCurrent = false) {
  if (STATE.isProcessing) return;
  STATE.isProcessing = true;
  UI.update('正在寻找下一集...', 'search');
  
  // 展开章节
  document.querySelectorAll('i.iconfont.icon-triangle-down, .chapter-arrow').forEach(el => {
    try { el.click(); } catch(e){}
  });
  await new Promise(r => setTimeout(r, 1000));
  
  const items = Array.from(document.querySelectorAll(
    '.video-status, .lesson-item, .catalog-item, .chapter-item li, .section-item'
  ));
  
  let nextItem = null;
  let currentIndex = -1;
  
  // 策略A：找当前高亮项的下一个
  for (let i = 0; i < items.length; i++) {
    if (items[i].classList.contains('active') || items[i].classList.contains('current')) {
      currentIndex = i;
      break;
    }
  }
  
  if (currentIndex !== -1) {
    for (let i = currentIndex + 1; i < items.length; i++) {
      if (!isCompleted(items[i]) && !items[i].textContent.includes('选修')) {
        nextItem = items[i];
        console.log('策略A：找到后续未完成章节');
        break;
      }
    }
  }
  
  // 策略B：全局扫描
  if (!nextItem) {
    for (const item of items) {
      if (ignoreCurrent && (item.classList.contains('active') || item.classList.contains('current'))) {
        continue;
      }
      if (!isCompleted(item) && !item.textContent.includes('选修')) {
        nextItem = item;
        console.log('策略B：全局扫描找到未完成章节');
        break;
      }
    }
  }
  
  // 执行跳转
  if (nextItem) {
    const title = nextItem.textContent.trim();
    UI.update(`即将播放: ${title.substring(0, 8)}...`, 'play');
    nextItem.scrollIntoView({behavior:'smooth', block:'center'});
    await new Promise(r => setTimeout(r, 1000));
    
    if (singleTabClick(nextItem)) {
      // 超时保护
      const timeoutId = setTimeout(() => {
        UI.update('跳转超时，重试', 'warn');
        STATE.isProcessing = false;
        findNextOrReturn(false);
      }, 4000);
      CLEANUP.addTimer(timeoutId);
      return;
    }
  } else {
    // 【关键优化】当前课程学完，直接返回目录，不再重复跳转
    goBackToCatalog();
  }
  
  STATE.isProcessing = false;
}

function goBackToCatalog() {
  UI.update('本课全部完成，返回目录...', 'success');
  
  // 记录完成
  try {
    const title = document.querySelector('h1')?.textContent.trim() || document.title;
    STATE.completedCourses.add(title);
    GM_setValue('completedCourses', JSON.stringify(Array.from(STATE.completedCourses)));
  } catch(e) {}
  
  setTimeout(() => {
    CLEANUP.clear(); // 清理资源
    
    // 【关键优化】只返回一次目录，避免重复跳转
    if (STATE.returnUrl && STATE.returnUrl !== location.href) {
      const targetUrl = STATE.returnUrl;
      STATE.returnUrl = ''; // 清空，避免下次重复返回
      window.location.href = targetUrl;
    } else {
      const breadcrumb = document.querySelector('.breadcrumb a:nth-last-child(2)');
      if (breadcrumb) breadcrumb.click();
      else window.history.back();
    }
  }, 2000);
}

// --- 视频处理（内存优化版） ---
async function handleVideo() {
  UI.update('检测视频...', 'search');
  
  const currentStatus = document.querySelector('.section-item.active, .lesson-item.active, .current');
  if (currentStatus && isCompleted(currentStatus)) {
    UI.update('当前已复习，找下一集', 'warn');
    findNextOrReturn(true);
    return;
  }
  
  let video = document.querySelector('video');
  if (!video) {
    await new Promise(r => setTimeout(r, 3000));
    video = document.querySelector('video');
  }
  
  if (!video) {
    UI.update('无视频，检查章节', 'warn');
    findNextOrReturn(false);
    return;
  }
  
  // 保存视频引用用于清理
  STATE.currentVideo = video;
  UI.update('正在播放...', 'play');
  video.muted = true;
  
  const tryPlay = () => {
    video.play().catch(() => {
      const btn = document.querySelector('.vjs-big-play-button, [title="播放"]');
      if (btn) btn.click();
    });
  };
  
  tryPlay();
  
  // 清理旧定时器
  CLEANUP.clear();
  
  // 播放监控（降低检测频率到5秒节省资源）
  const checkTimerId = setInterval(() => {
    if (!video || !document.contains(video)) {
      clearInterval(checkTimerId);
      return;
    }
    
    if (video.paused && !video.ended) tryPlay();
    
    if (video.ended || (video.duration && video.currentTime / video.duration > 0.98)) {
      UI.update('播放结束', 'success');
      clearInterval(checkTimerId);
      findNextOrReturn(true);
    }
  }, 5000);
  
  CLEANUP.addTimer(checkTimerId);
}

// --- 目录处理（优化：连续学习，减少返回） ---
async function handleCatalog() {
  if (STATE.isProcessing) return;
  STATE.isProcessing = true;
  
  // 【关键优化】只在首次进入目录时保存URL，避免重复保存
  if (!STATE.returnUrl || STATE.returnUrl === '') {
    saveReturnUrl(location.href);
  }
  
  UI.update('扫描目录...', 'search');
  await new Promise(r => setTimeout(r, 1500));
  
  const items = document.querySelectorAll('.item, .course-item, li.list-item, .subject-catalog .item');
  let found = false;
  
  for (const item of items) {
    const isReq = item.textContent.includes('必修') || item.querySelector('.required');
    if (isReq && !isCompleted(item)) {
      UI.update(`进入: ${item.textContent.trim().substring(0, 8)}...`, 'play');
      singleTabClick(item);
      found = true;
      break;
    }
  }
  
  if (!found) {
    UI.update('当前页必修课已全完！', 'success');
    STATE.isProcessing = false;
    STATE.returnUrl = ''; // 清空，准备下一轮
  }
}

// --- 初始化（添加页面卸载事件） ---
function init() {
  UI.init();
  STATE.isProcessing = false;
  CLEANUP.clear();
  
  const url = location.href;
  const catalogPatterns = ['catalog', 'course-list', 'class-detail', 'subject/detail', 'train-new/class'];
  const coursePatterns = ['course/detail', 'study/learn', 'video/play', 'lesson/view'];
  
  if (coursePatterns.some(k => url.includes(k))) {
    setTimeout(handleVideo, 4000);
  } else if (catalogPatterns.some(k => url.includes(k))) {
    setTimeout(handleCatalog, 4000);
  } else {
    UI.update('等待指令', 'normal');
  }
  
  // 防挂机（降低到120秒）
  const keepAliveId = setInterval(() => {
    document.dispatchEvent(new MouseEvent('mousemove'));
  }, 120000);
  CLEANUP.addTimer(keepAliveId);
}

// --- 页面跳转监听（优化） ---
let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    UI.update('跳转中...', 'normal');
    CLEANUP.clear(); // 清理旧页面资源
    setTimeout(init, 2000);
  }
});
urlObserver.observe(document, {subtree:true, childList:true});
CLEANUP.addObserver(urlObserver);

// --- 页面卸载时清理资源 ---
window.addEventListener('beforeunload', () => {
  CLEANUP.clear();
  if (STATE.currentVideo) {
    STATE.currentVideo.pause();
    STATE.currentVideo.src = '';
  }
});

// 启动
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}

})();
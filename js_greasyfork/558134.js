// ==UserScript==
// @name         YouTube Mobile 体验增强版
// @namespace    yt-mobile-autoreply-ui
// @version      3.13
// @description  自动@回复 + 引用 + 播放列表 + 全局速度控制 + 自动跳下一条 (增强版)
// @match        https://m.youtube.com/*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558134/YouTube%20Mobile%20%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558134/YouTube%20Mobile%20%E4%BD%93%E9%AA%8C%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG = (...args) => console.log('[YT-MOBILE]', ...args);

  // ====== 1. 通用工具：消息提示 ======
  function showDebugMsg(msg) {
    let box = document.getElementById('yt-debug-msg');
    if (!box) {
      box = document.createElement('div');
      box.id = 'yt-debug-msg';
      Object.assign(box.style, {
        position: 'fixed',
        bottom: '180px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        fontSize: '13px',
        padding: '8px 16px',
        borderRadius: '20px',
        zIndex: 9999999,
        pointerEvents: 'none',
        transition: 'opacity 0.3s'
      });
      document.body.appendChild(box);
    }
    box.textContent = msg;
    box.style.opacity = '1';
    clearTimeout(box._timer);
    box._timer = setTimeout(() => box.style.opacity = '0', 1800);
  }

  // ====== 2. UI 容器 (按钮组) ======
  function createButtonContainer() {
    if (document.getElementById('yt-btn-container')) return;
    const container = document.createElement('div');
    container.id = 'yt-btn-container';
    Object.assign(container.style, {
      position: 'fixed',
      bottom: '12px',
      left: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 999998
    });
    document.body.appendChild(container);
  }

// 辅助函数：创建圆形按钮 (修复版：颜色应用在背景上)
  function createRoundBtn(id, text, color, title, onClick) {
    if (document.getElementById(id)) return document.getElementById(id);
    
    const btn = document.createElement('div');
    btn.id = id;
    btn.textContent = text;
    
    // 如果没有传入颜色，给一个默认深色
    const bgColor = color || 'rgba(40, 40, 40, 0.9)';
    
    Object.assign(btn.style, {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      // === 核心修改：将传入的颜色赋给背景 ===
      backgroundColor: bgColor, 
      // 文字/图标颜色统一设为白色，避免颜色冲突
      color: '#fff', 
      // ===================================
      fontSize: '20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)', // 稍微调淡一点阴影
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(4px)',
      userSelect: 'none',
      fontWeight: 'bold',
      transition: 'all 0.2s ease'
    });
    
    btn.dataset.defaultColor = bgColor; // 存一下默认颜色供恢复使用

    btn.title = title;
    
    btn.onmousedown = () => btn.style.transform = 'scale(0.95)';
    btn.onmouseup = () => btn.style.transform = 'scale(1)';
    
    btn.onclick = (e) => {
        e.stopPropagation();
        onClick(btn);
    };
    
    document.getElementById('yt-btn-container').appendChild(btn);
    return btn;
  }

  // ====== 3. 功能模块：评论引用 ======
  const KEY_ENABLE_QUOTE = 'enable_quote';
  let isQuoteEnabled = GM_getValue(KEY_ENABLE_QUOTE, false);
  let lastClickedUser = null;
  let lastClickedText = null;

function initQuoteModule() {
    // 颜色定义
    const activeColor = '#4ade80'; // 开：薄荷绿
    const inactiveColor = 'rgba(40, 40, 40, 0.9)'; // 关：深灰

    const btn = createRoundBtn(
      'yt-quote-switch-btn',
      '❝',
      // === 修改这里：初始化时，根据状态传背景色 ===
      isQuoteEnabled ? activeColor : inactiveColor, 
      '引用模式开关',
      (b) => {
        isQuoteEnabled = !isQuoteEnabled;
        GM_setValue(KEY_ENABLE_QUOTE, isQuoteEnabled);
        
        // 切换背景色
        if (isQuoteEnabled) {
            b.style.backgroundColor = activeColor;
            b.style.color = '#000'; // 亮背景配黑字
            b.style.boxShadow = `0 0 10px ${activeColor}66`;
        } else {
            b.style.backgroundColor = inactiveColor;
            b.style.color = '#fff'; // 暗背景配白字
            b.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }
        showDebugMsg(isQuoteEnabled ? '✅ 引用模式: 开启' : '🚫 引用模式: 关闭');
      }
    );
    
    // 确保初始化后的文字颜色正确 (如果是开启状态，字要是黑的)
    if (isQuoteEnabled) {
        btn.style.color = '#000';
    }
  }

  // 3.2 抓取用户名
  function extractUsername(comment) {
    if (!comment) return null;
    const selectors = ['.comment-header .author-text', '.YtmCommentRendererTitle', 'a[href*="/@"]', '.comment-title'];
    for (const s of selectors) {
      const el = comment.querySelector(s);
      if (el && el.textContent.trim()) return el.textContent.trim();
    }
    return null;
  }

  // 3.3 抓取评论内容
  function extractCommentText(comment) {
    if (!comment) return null;
    let el = comment.querySelector('.YtmCommentRendererText') || comment.querySelector('.user-text');
    
    if (!el) {
      const contentSection = comment.querySelector('.comment-content');
      if (contentSection) el = contentSection.querySelector('.yt-core-attributed-string');
    }
    
    if (!el) {
        const allSpans = comment.querySelectorAll('.yt-core-attributed-string[role="text"]');
        for (const span of allSpans) {
            if (!span.closest('.comment-header') && !span.closest('.YtmCommentRendererTitle')) {
                el = span;
                break;
            }
        }
    }
    if (!el) return null;
    let txt = el.textContent.trim().replace(/\s+/g, ' ');
    if (txt.length > 50) txt = txt.slice(0, 50) + '…';
    return txt;
  }

  // 3.4 填充文本框逻辑
  function waitForReplyDialog() {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const textarea = document.querySelector('textarea.YtmCommentReplyDialogRendererInput, textarea[placeholder*="reply"], textarea[placeholder*="回复"]');
      if (textarea) {
        clearInterval(interval);
        insertContent(textarea);
      }
      if (attempts > 20) clearInterval(interval);
    }, 100);
  }

  function insertContent(textarea) {
    if (!textarea || !lastClickedUser) return;
    let username = lastClickedUser.trim();
    if (!username.startsWith('@')) username = '@' + username;
    
    let finalContent = `${username} `;
    
    // 判断开关状态
    if (isQuoteEnabled && lastClickedText) {
      const isTimeLike = /^\d+\s?(小时|天|周|月|年|minute|hour|day|week|month|year)/.test(lastClickedText);
      if (!isTimeLike) {
        finalContent = `${username} 「 _${lastClickedText}_ 」 `;
      }
    }

    // 模拟原生输入以触发框架绑定
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
    nativeInputValueSetter.call(textarea, finalContent);
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
    // 将光标移到最后
    textarea.setSelectionRange(finalContent.length, finalContent.length);
  }

  // 3.5 全局点击监听 (核心逻辑)
  document.addEventListener('click', function(e) {
    // A. 尝试抓取点击处的评论信息
    const comment = e.target.closest('ytm-comment-renderer') || e.target.closest('.comment-view-model');
    if (comment) {
      const user = extractUsername(comment);
      const text = extractCommentText(comment);
      if (user) lastClickedUser = user;
      if (text) lastClickedText = text;
    }

    // B. 检测是否点击了回复按钮
    const targetText = e.target.textContent?.trim();
    const btn = e.target.closest('button') || e.target;
    const isReplyBtn = targetText === 'Reply' || targetText === '回复' || 
                       btn.getAttribute('aria-label') === 'Reply' ||
                       btn.getAttribute('aria-label') === '回复';

    if (isReplyBtn && lastClickedUser) {
      showDebugMsg(`准备回复: ${lastClickedUser}`);
      waitForReplyDialog();
    }
  }, true);


  // ====== 4. 功能模块：播放列表 (Playlist) ======
  const KEY_PLAYLIST = 'yt_mobile_playlist';
  const KEY_PLAYED_LIST = 'yt_mobile_played';
  let playlist = GM_getValue(KEY_PLAYLIST, []);
  let playedList = GM_getValue(KEY_PLAYED_LIST, []);

  function markPlayed(id) {
    if (id && !playedList.includes(id)) {
      playedList.push(id);
      GM_setValue(KEY_PLAYED_LIST, playedList);
    }
  }

  function isPlayed(id) {
    return playedList.includes(id);
  }

  function savePlaylist() {
    GM_setValue(KEY_PLAYLIST, playlist);
  }

  function addToPlaylist(item) {
    if (playlist.find(v => v.id === item.id)) {
      showDebugMsg('⚠ 已在播放列表');
      return;
    }
    playlist.push(item);
    savePlaylist();
    showDebugMsg('🛒 已加入播放列表');
    // 如果面板开着，刷新它
    if (document.getElementById('yt-playlist-panel')) {
        renderPlaylistPanel();
    }
  }

  function removeFromPlaylist(id) {
    playlist = playlist.filter(v => v.id !== id);
    savePlaylist();
    renderPlaylistPanel();
  }

  function clearPlaylist() {
    if (!confirm('确认要清空播放列表吗？')) return;
    playlist = [];
    playedList = [];
    GM_setValue(KEY_PLAYLIST, playlist);
    GM_setValue(KEY_PLAYED_LIST, playedList);
    renderPlaylistPanel();
    showDebugMsg('播放列表已清空');
  }

function initPlaylistModule() {
      // 颜色：珊瑚粉 (不刺眼的红)
      createRoundBtn(
          'yt-playlist-btn',
          '🎶',
          '#fb7185', 
          '播放列表',
          togglePlaylistPanel
      );
  }

  function togglePlaylistPanel() {
    const panel = document.getElementById('yt-playlist-panel');
    if (panel) panel.remove();
    else renderPlaylistPanel();
  }

  function renderPlaylistPanel() {
    const old = document.getElementById('yt-playlist-panel');
    if (old) old.remove();

    const panel = document.createElement('div');
    panel.id = 'yt-playlist-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '12px',
      left: '72px', // 在按钮组右侧
      width: '300px',
      maxHeight: '60vh',
      overflowY: 'auto',
      backgroundColor: '#222',
      color: '#fff',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '13px',
      zIndex: 999999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      border: '1px solid #444'
    });

    // 头部
    const header = document.createElement('div');
    Object.assign(header.style, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #444', paddingBottom: '5px' });

    const title = document.createElement('div');
    title.textContent = `🎶 待播清单 (${playlist.length})`;
    title.style.fontWeight = 'bold';

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '清空';
    Object.assign(clearBtn.style, { background: '#444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' });
    clearBtn.onclick = clearPlaylist;

    header.appendChild(title);
    header.appendChild(clearBtn);
    panel.appendChild(header);

    // 列表
    if (playlist.length === 0) {
        const empty = document.createElement('div');
        empty.textContent = "列表为空。点击视频标题旁的 ➕ 添加。";
        empty.style.color = '#888';
        empty.style.textAlign = 'center';
        empty.style.padding = '20px 0';
        panel.appendChild(empty);
    } else {
        playlist.forEach(item => {
          const row = document.createElement('div');
          Object.assign(row.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', background: '#333', padding: '6px', borderRadius: '4px'
          });

          const lbl = document.createElement('span');
          lbl.textContent = item.title || item.id;
          lbl.style.cssText = "white-space: normal; word-break: break-word; cursor: pointer; flex: 1; margin-right: 10px; line-height: 1.4;";
          lbl.style.color = isPlayed(item.id) ? '#888' : '#fff';
          lbl.onclick = () => location.href = item.url;

          const ctrl = document.createElement('div');
          ctrl.style.flexShrink = '0';

          const playBtn = document.createElement('button');
          playBtn.textContent = '▶';
          Object.assign(playBtn.style, { background: 'none', border: 'none', color: '#4caf50', cursor: 'pointer', fontSize: '14px', marginRight: '5px' });
          playBtn.onclick = () => location.href = item.url;

          const delBtn = document.createElement('button');
          delBtn.textContent = '✕';
          Object.assign(delBtn.style, { background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', fontSize: '14px' });
          delBtn.onclick = () => removeFromPlaylist(item.id);

          ctrl.appendChild(playBtn);
          ctrl.appendChild(delBtn);

          row.appendChild(lbl);
          row.appendChild(ctrl);
          panel.appendChild(row);
        });
    }

    document.body.appendChild(panel);
  }

  // 4.1 扫描视频并添加 [+] 按钮
  function scanVideoEntries() {
    document.querySelectorAll('h3.media-item-headline, .compact-media-item-headline').forEach(headline => {
      if (headline.dataset.plBound) return;
      try {
        // 尝试找到文本节点
        let textNode = headline.querySelector('span[role="text"]') || headline;
        // 如果是直接的文本
        const titleText = textNode.textContent.trim();
        if (!titleText) return;

        const btn = document.createElement('span');
        btn.textContent = '➕';
        Object.assign(btn.style, {
          marginRight: '8px',
          color: '#0f0',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'inline-block',
          verticalAlign: 'middle'
        });
        btn.title = '加入播放列表';

        btn.onclick = e => {
          e.stopPropagation();
          e.preventDefault();
          let url = null;
          // 向上查找A标签
          const parentA = headline.closest('a[href*="/watch"]');
          if (parentA) url = parentA.href;
          if (!url) {
            showDebugMsg('⚠ 无法提取视频链接');
            return;
          }
          const vid = new URL(url, location.origin).searchParams.get('v');
          
          // 简单的点击动画
          btn.textContent = '✔';
          setTimeout(() => btn.textContent = '➕', 1000);

          addToPlaylist({ id: vid, title: titleText, url });
        };

        // 插入到标题最前面
        if(headline.firstChild) {
            headline.insertBefore(btn, headline.firstChild);
        } else {
            headline.appendChild(btn);
        }
        headline.dataset.plBound = '1';
      } catch (err) {
        // 静默失败
      }
    });
  }

  // 4.2 自动跳转下一集
  function detectVideoEnd(videoEl) {
    if (!videoEl) return;

    let triggered = false;
    const tryNext = () => {
      if (triggered) return;
      
      // 检查列表是否有下一条
      const currentVid = new URL(location.href).searchParams.get('v');
      const idx = playlist.findIndex(v => v.id === currentVid);
      
      // 如果当前视频在列表里，且不是最后一个，则跳转
      if (idx !== -1 && idx < playlist.length - 1) {
          triggered = true;
          const nextItem = playlist[idx + 1];
          showDebugMsg(`即将播放: ${nextItem.title}`);
          setTimeout(() => {
              location.href = nextItem.url;
          }, 1500); // 留一点缓冲时间
      }
    };

    // A. 监听时间进度 (Web端常用)
    videoEl.addEventListener('timeupdate', () => {
      if (!videoEl.duration) return;
      // 剩余不到 0.5 秒视为结束
      if (videoEl.duration - videoEl.currentTime < 0.5) tryNext();
    });
    
    // B. 监听结束事件 (Mobile端常用)
    videoEl.addEventListener('ended', tryNext);

    // C. 观察 "Next video" 按钮出现 (备用)
    new MutationObserver(() => {
      const nextBtn = document.querySelector(
        '.player-controls-middle-core-buttons.center button[aria-label="Next video"]:not([aria-disabled="true"])'
      );
      if (nextBtn) tryNext();
    }).observe(document.body, { subtree: true, childList: true });
  }

  // ====== 5. 功能模块：速度控制 ======
  const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];
  let currentSpeed = GM_getValue('yt_mobile_speed', 1.0);

function initSpeedModule() {
      // 颜色：靛青色 (高级蓝)
      createRoundBtn(
          'yt-speed-btn',
          '⏩',
          '#818cf8',
          `播放速度 (${currentSpeed}x)`,
          toggleSpeedPanel
      );
  }

  function toggleSpeedPanel() {
    const panel = document.getElementById('yt-speed-panel');
    if (panel) panel.remove();
    else renderSpeedPanel();
  }

  function renderSpeedPanel() {
    const old = document.getElementById('yt-speed-panel');
    if (old) old.remove();

    const panel = document.createElement('div');
    panel.id = 'yt-speed-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '12px',
      left: '72px',
      backgroundColor: '#222',
      color: '#fff',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '13px',
      zIndex: 999999,
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '5px',
      border: '1px solid #444'
    });

    SPEED_OPTIONS.forEach(sp => {
      const b = document.createElement('div');
      b.textContent = `${sp}x`;
      Object.assign(b.style, {
          padding: '6px 2px',
          textAlign: 'center',
          background: currentSpeed === sp ? '#007acc' : '#444',
          borderRadius: '4px',
          cursor: 'pointer',
          minWidth: '35px'
      });
      b.onclick = () => {
        currentSpeed = sp;
        GM_setValue('yt_mobile_speed', currentSpeed);
        applySpeedToVideo();
        showDebugMsg(`🚀 速度: ${currentSpeed}x`);
        
        const btn = document.getElementById('yt-speed-btn');
        if(btn) btn.title = `播放速度 (${currentSpeed}x)`;
        
        panel.remove();
      };
      panel.appendChild(b);
    });

    document.body.appendChild(panel);
  }

  function applySpeedToVideo() {
    const videoEl = document.querySelector('video');
    if (videoEl) {
      try {
        if (videoEl.playbackRate !== currentSpeed) {
            videoEl.playbackRate = currentSpeed;
        }
        // 绑定播放事件以标记已读
        videoEl.addEventListener('play', () => {
          const currentVid = new URL(location.href).searchParams.get('v');
          markPlayed(currentVid);
        });
        // 绑定结束检测
        detectVideoEnd(videoEl);
      } catch {}
    }
  }

  // ====== 6. 主循环与初始化 ======
  function mainLoop() {
    createButtonContainer();
    
    // 确保三个按钮始终存在
    initQuoteModule();
    initPlaylistModule();
    initSpeedModule();
    
    // 持续扫描新加载的视频
    scanVideoEntries();
    
    // 确保速度和结束检测一直生效 (应对SPA页面跳转)
    applySpeedToVideo();
  }

  // 启动
  setInterval(mainLoop, 1500);

})();
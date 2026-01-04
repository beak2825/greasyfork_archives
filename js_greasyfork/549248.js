// ==UserScript==
// @name         YouTube Loop Clip
// @name:zh-CN   YouTube 循环片段
// @name:zh-TW   YouTube 循環片段
// @name:en      YouTube Loop Clip
// @name:ja      YouTubeループクリップ
// @name:ko      유튜브 루프 클립
// @namespace    https://github.com/ooking/youtube-loop-clip
// @version      1.0.4
// @description  在YouTube视频时间轴上选择片段并循环播放，支持无限循环和刷新页面后设置不丢失
// @description:zh-CN 在YouTube视频时间轴上选择片段并循环播放，支持无限循环和刷新页面后设置不丢失
// @description:zh-TW 在YouTube影片時間軸上選擇片段並循環播放，支援無限循環且刷新頁面後設定不丟失
// @description:en    Select a clip on the YouTube timeline and loop playback, supports infinite loop and persistent settings after refresh
// @description:ja    YouTubeのタイムラインでクリップを選択してループ再生、無限ループとリフレッシュ後も設定保持
// @description:ko    유튜브 타임라인에서 클립을 선택해 반복 재생, 무한 반복 및 새로고침 후에도 설정 유지
// @author       King Chan (chenwenj@gmail.com)
// @include      *://*.youtube.com/**
// @exclude      *://accounts.youtube.com/*
// @exclude      *://www.youtube.com/live_chat_replay*
// @exclude      *://www.youtube.com/persist_identity*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABm0lEQVR4AdSWAZaCIBRFaTY2tbJsZTUra979iqECYqLWHJ4IfP67cMLhxx38NwF4Onfu1KiurfN4vQMAGd4V4HXVe23dOw+lbksP0A1MCNuwqk92mEVaUgOQOcbIOnd4AGF+BiBDa6jevXiA3Y1laIs+EkAMzn0FwEOoN+kS6uTcaSznnI8h3kvd6TK3AzeZXKRGeoSKpQzGiTcpDihV8ZIDwLCJTyvvBUrR7KKqackB/E3DXz36dqyGI1sOgPGoZM4Ruqp+SiUgycW8BTCiAqQEYjStbdYAIBMQ7AY7Q7tYtQAwTP7QGEypFoA/rosh1gJgaN+J1Arn+nMAvzOTl6w6mSsHkPTn4yK9/csPE+cA+ktDOGHpe/edSJ6OHABe3OHCi2kSSkY2FtTM4+rFvZJcUc0BMIkEXiQEijM/kAJtLKiZk1y54qyUAFjgVo+PAeA8b7XIbN4jd8AWbQA60zRQlrbiIJcd8zMAEguCq5N10t5QmONlFj0ArQ6CQX+hrFmTl/8b1NiZBgD0CAJCu1DqfXUd5CDvZIf/AQAA//8BTt4CAAAABklEQVQDALNfokFDr0z6AAAAAElFTkSuQmCC
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/549248/YouTube%20Loop%20Clip.user.js
// @updateURL https://update.greasyfork.org/scripts/549248/YouTube%20Loop%20Clip.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 工具函数：格式化时间为 hh:mm:ss
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s]
      .map((v) => v < 10 ? '0' + v : v)
      .join(':');
  }

  // 工具函数：解析 hh:mm:ss 为秒
  function parseTime(str) {
    const parts = str.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      return parts[0];
    }
    return 0;
  }

  // 获取当前视频ID
  function getVideoId() {
    const url = new URL(window.location.href);
    return url.searchParams.get('v');
  }

  // 获取播放器元素
  function getPlayer() {
    return document.querySelector('video');
  }

  // 持久化设置
  function saveSettings(settings) {
    const videoId = getVideoId();
    if (videoId) {
      GM_setValue('yt_loop_' + videoId, JSON.stringify(settings));
    }
  }

  function loadSettings() {
    const videoId = getVideoId();
    if (videoId) {
      const data = GM_getValue('yt_loop_' + videoId, null);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  // 创建控制按钮
  function createButton(text, onClick) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.margin = '0 4px';
    btn.style.padding = '4px 8px';
    btn.style.zIndex = '9999';
    btn.style.background = '#ff0';
    btn.style.border = '1px solid #888';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.onclick = onClick;
    return btn;
  }

  // 创建循环设置按钮（小巧美观）
  function createLoopButton(onClick) {
    const btn = document.createElement('button');
    btn.textContent = 'LoopClip';
    btn.style.margin = 'auto 4px';
    btn.style.padding = '0 10px';
    btn.style.fontSize = '13px';
    btn.style.zIndex = '9999';
    btn.style.background = '#ffe066';
    btn.style.border = '1px solid #bbb';
    btn.style.borderRadius = '20px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
    btn.className = 'yt-loop-btn';
    btn.onclick = onClick;
    return btn;
  }

  // 创建设置弹窗（安全版，避免 innerHTML）
  function showDialog(settings, onSave) {
    // 创建遮罩
    const mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100vw';
    mask.style.height = '100vh';
    mask.style.background = 'rgba(0,0,0,0.3)';
    mask.style.zIndex = '99999';

    // 弹窗内容
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.background = '#fff';
    dialog.style.padding = '24px';
    dialog.style.borderRadius = '8px';
    dialog.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
    dialog.style.minWidth = '320px';

    // 标题
    const title = document.createElement('h3');
    title.style.marginTop = '0';
    title.textContent = '循环片段设置';
    dialog.appendChild(title);

    // 开始时间
    const labelStart = document.createElement('label');
    labelStart.textContent = '开始时间 ';
    const inputStart = document.createElement('input');
    inputStart.id = 'yt-loop-start';
    inputStart.type = 'text';
    inputStart.value = formatTime(settings.start);
    inputStart.style.width = '80px';
    labelStart.appendChild(inputStart);
    dialog.appendChild(labelStart);
    dialog.appendChild(document.createElement('br'));
    dialog.appendChild(document.createElement('br'));

    // 结束时间
    const labelEnd = document.createElement('label');
    labelEnd.textContent = '结束时间 ';
    const inputEnd = document.createElement('input');
    inputEnd.id = 'yt-loop-end';
    inputEnd.type = 'text';
    inputEnd.value = formatTime(settings.end);
    inputEnd.style.width = '80px';
    labelEnd.appendChild(inputEnd);
    dialog.appendChild(labelEnd);
    dialog.appendChild(document.createElement('br'));
    dialog.appendChild(document.createElement('br'));

    // 循环次数和无限循环
    const labelCount = document.createElement('label');
    labelCount.textContent = '循环次数 ';
    const inputCount = document.createElement('input');
    inputCount.id = 'yt-loop-count';
    inputCount.type = 'number';
    inputCount.min = '1';
    inputCount.value = settings.count || '';
    inputCount.style.width = '60px';
    labelCount.appendChild(inputCount);

    const spanInfinite = document.createElement('span');
    const inputInfinite = document.createElement('input');
    inputInfinite.id = 'yt-loop-infinite';
    inputInfinite.type = 'checkbox';
    inputInfinite.checked = !!settings.infinite;
    spanInfinite.appendChild(inputInfinite);
    spanInfinite.appendChild(document.createTextNode(' 无限循环'));
    labelCount.appendChild(spanInfinite);

    dialog.appendChild(labelCount);
    dialog.appendChild(document.createElement('br'));
    dialog.appendChild(document.createElement('br'));

    // 保存按钮
    const btnSave = document.createElement('button');
    btnSave.id = 'yt-loop-save';
    btnSave.textContent = '保存';
    btnSave.style.marginRight = '8px';
    dialog.appendChild(btnSave);

    // 取消按钮
    const btnCancel = document.createElement('button');
    btnCancel.id = 'yt-loop-cancel';
    btnCancel.textContent = '取消';
    dialog.appendChild(btnCancel);

    mask.appendChild(dialog);
    document.body.appendChild(mask);

    // 事件绑定
    btnSave.onclick = () => {
      const start = parseTime(inputStart.value);
      const end = parseTime(inputEnd.value);
      const infinite = inputInfinite.checked;
      const count = infinite ? 0 : parseInt(inputCount.value, 10) || 1;
      onSave({ start, end, count, infinite });
      document.body.removeChild(mask);
    };
    btnCancel.onclick = () => {
      document.body.removeChild(mask);
    };
    inputInfinite.onchange = (e) => {
      inputCount.disabled = e.target.checked;
    };
  }

  // 创建循环设置弹窗（美化，英文，按钮上方弹出，任意空白处可拖动）
  function showLoopDialog(settings, player, onSave) {
    if (document.getElementById('yt-loop-dialog')) return;
    if (player) player.pause();

    // 获取按钮位置
    const btn = document.querySelector('.yt-loop-btn');
    let top = 80, left = window.innerWidth / 2;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      top = rect.top - 16 - 240; // 240为弹窗高度预估，16为间距
      if (top < 10) top = 10;
      left = rect.left + rect.width / 2;
    }

    const dialog = document.createElement('div');
    dialog.id = 'yt-loop-dialog';
    dialog.style.position = 'fixed';
    dialog.style.top = top + 'px';
    dialog.style.left = left + 'px';
    dialog.style.transform = 'translateX(-50%)';
    dialog.style.background = 'linear-gradient(135deg, #fffbe6 0%, #f7f7fa 10%)';
    dialog.style.padding = '8px 28px 20px 28px';
    dialog.style.borderRadius = '16px';
    dialog.style.boxShadow = '0 4px 24px rgba(0,0,0,0.13)';
    dialog.style.minWidth = '340px';
    dialog.style.zIndex = '99999';
    dialog.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    dialog.style.color = '#222';
    dialog.style.cursor = 'move';

    // 标题栏
    const titleBar = document.createElement('div');
    titleBar.style.fontWeight = 'bold';
    titleBar.style.marginBottom = '18px';
    titleBar.style.fontSize = '20px';
    titleBar.style.letterSpacing = '0.5px';
    titleBar.style.textAlign = 'center';
    titleBar.textContent = 'Loop Clip Settings';
    dialog.appendChild(titleBar);

    // label样式
    const labelStyle = 'display:inline-block;min-width:110px;font-size:16px;margin-bottom:8px;';
    const inputStyle = 'font-size:15px;padding:2px 8px;border-radius:6px;border:1px solid #ccc;margin-right:8px;width:90px;background:#fff;';
    const btnStyle = 'font-size:14px;padding:2px 10px;border-radius:8px;border:1px solid #bbb;background:#ffe066;cursor:pointer;margin-left:8px;';

    // 开始时间
    const labelStart = document.createElement('label');
    labelStart.setAttribute('style', labelStyle);
    labelStart.textContent = 'Start Time:';
    const inputStart = document.createElement('input');
    inputStart.id = 'yt-loop-start';
    inputStart.type = 'text';
    inputStart.value = formatTime(settings.start);
    inputStart.setAttribute('style', inputStyle);
    labelStart.appendChild(inputStart);
    const btnGetStart = document.createElement('button');
    btnGetStart.textContent = 'Get Current';
    btnGetStart.setAttribute('style', btnStyle);
    btnGetStart.onclick = () => {
      inputStart.value = formatTime(Math.floor(player.currentTime));
    };
    labelStart.appendChild(btnGetStart);
    dialog.appendChild(labelStart);
    dialog.appendChild(document.createElement('br'));
    dialog.appendChild(document.createElement('br'));

    // 结束时间
    const labelEnd = document.createElement('label');
    labelEnd.setAttribute('style', labelStyle);
    labelEnd.textContent = 'End Time:';
    const inputEnd = document.createElement('input');
    inputEnd.id = 'yt-loop-end';
    inputEnd.type = 'text';
    inputEnd.value = formatTime(settings.end);
    inputEnd.setAttribute('style', inputStyle);
    labelEnd.appendChild(inputEnd);
    const btnGetEnd = document.createElement('button');
    btnGetEnd.textContent = 'Get Current';
    btnGetEnd.setAttribute('style', btnStyle);
    btnGetEnd.onclick = () => {
      inputEnd.value = formatTime(Math.floor(player.currentTime));
    };
    labelEnd.appendChild(btnGetEnd);
    dialog.appendChild(labelEnd);
    dialog.appendChild(document.createElement('br'));
    dialog.appendChild(document.createElement('br'));

    // 循环次数和无限循环
    const labelCount = document.createElement('label');
    labelCount.setAttribute('style', labelStyle);
    labelCount.textContent = 'Loop Count:';
    const inputCount = document.createElement('input');
    inputCount.id = 'yt-loop-count';
    inputCount.type = 'number';
    inputCount.min = '1';
    inputCount.value = settings.count || '';
    inputCount.setAttribute('style', inputStyle);
    labelCount.appendChild(inputCount);

    const spanInfinite = document.createElement('span');
    spanInfinite.setAttribute('style', 'margin-left:12px;font-size:15px;');
    const inputInfinite = document.createElement('input');
    inputInfinite.id = 'yt-loop-infinite';
    inputInfinite.type = 'checkbox';
    inputInfinite.checked = !!settings.infinite;
    spanInfinite.appendChild(inputInfinite);
    spanInfinite.appendChild(document.createTextNode(' Infinite'));
    labelCount.appendChild(spanInfinite);

    dialog.appendChild(labelCount);
    dialog.appendChild(document.createElement('br'));
    dialog.appendChild(document.createElement('br'));

    // 循环播放/暂停按钮
    let isLoopPlaying = false;
    const btnLoopPlay = document.createElement('button');
    btnLoopPlay.textContent = 'Play Loop';
    btnLoopPlay.setAttribute('style', btnStyle + 'margin-right:8px;background:#7ed957;border:1px solid #6bbf4e;');
    const btnLoopPause = document.createElement('button');
    btnLoopPause.textContent = 'Stop';
    btnLoopPause.setAttribute('style', btnStyle + 'margin-right:8px;background:#ffb4b4;border:1px solid #e88c8c;');
    btnLoopPause.disabled = true;
    dialog.appendChild(btnLoopPlay);
    dialog.appendChild(btnLoopPause);

    // 保存按钮
    const btnSave = document.createElement('button');
    btnSave.id = 'yt-loop-save';
    btnSave.textContent = 'Save';
    btnSave.setAttribute('style', btnStyle + 'margin-right:8px;background:#e0e0e0;border:1px solid #bbb;');
    dialog.appendChild(btnSave);

    // 取消按钮
    const btnCancel = document.createElement('button');
    btnCancel.id = 'yt-loop-cancel';
    btnCancel.textContent = 'Close';
    btnCancel.setAttribute('style', btnStyle + 'background:#e0e0e0;border:1px solid #bbb;');
    dialog.appendChild(btnCancel);

    document.body.appendChild(dialog);

    // 拖动逻辑：点击弹窗任意空白处都可拖动
    let isDragging = false, offsetX = 0, offsetY = 0;
    dialog.addEventListener('mousedown', function(e) {
      // 只响应左键且不响应按钮、输入框等控件
      if (e.button !== 0) return;
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') return;
      isDragging = true;
      offsetX = e.clientX - dialog.getBoundingClientRect().left;
      offsetY = e.clientY - dialog.getBoundingClientRect().top;
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', upHandler);
      document.body.style.userSelect = 'none';
    });
    function moveHandler(e) {
      if (isDragging) {
        dialog.style.left = e.clientX - offsetX + 'px';
        dialog.style.top = e.clientY - offsetY + 'px';
        dialog.style.transform = '';
      }
    }
    function upHandler() {
      isDragging = false;
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
      document.body.style.userSelect = '';
    }

    // 事件绑定
    btnSave.onclick = () => {
      const start = parseTime(inputStart.value);
      const end = parseTime(inputEnd.value);
      const infinite = inputInfinite.checked;
      const count = infinite ? 0 : parseInt(inputCount.value, 10) || 1;
      onSave({ start, end, count, infinite });
    };
    btnCancel.onclick = () => {
      document.body.removeChild(dialog);
      stopLoopPlay();
    };
    inputInfinite.onchange = (e) => {
      inputCount.disabled = e.target.checked;
    };

    // 循环播放逻辑
    let loopCount = 0;
    let loopHandler = null;
    function startLoopPlay() {
      if (isLoopPlaying) return;
      isLoopPlaying = true;
      btnLoopPlay.disabled = true;
      btnLoopPause.disabled = false;
      loopCount = 0;
      player.currentTime = parseTime(inputStart.value);
      player.play();
      loopHandler = function() {
        const start = parseTime(inputStart.value);
        const end = parseTime(inputEnd.value);
        const infinite = inputInfinite.checked;
        const count = infinite ? 0 : parseInt(inputCount.value, 10) || 1;
        if (start < end && player.currentTime >= end) {
          if (infinite || loopCount < count - 1) {
            player.currentTime = start;
            player.play();
            loopCount++;
          } else {
            loopCount = 0;
            player.pause();
            stopLoopPlay();
          }
        }
        if (player.currentTime < start || player.currentTime > end) {
          loopCount = 0;
        }
      };
      player.addEventListener('timeupdate', loopHandler);
    }
    function stopLoopPlay() {
      if (!isLoopPlaying) return;
      isLoopPlaying = false;
      btnLoopPlay.disabled = false;
      btnLoopPause.disabled = true;
      if (loopHandler) player.removeEventListener('timeupdate', loopHandler);
      loopHandler = null;
      player.pause();
    }
    btnLoopPlay.onclick = startLoopPlay;
    btnLoopPause.onclick = stopLoopPlay;
  }

  // 主逻辑
  function main() {
    // 等待播放器加载
    let lastUrl = '';
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        setTimeout(init, 1000);
      }
    }, 1000);

    function init() {
      // 移除旧按钮
      document.querySelectorAll('.yt-loop-btn').forEach((el) => el.remove());

      const player = getPlayer();
      if (!player) return;

      // 按钮容器
      const controls = document.querySelector('.ytp-left-controls');
      if (!controls) return;

      // 加载设置
      let settings = loadSettings() || { start: 0, end: Math.floor(player.duration), count: 1, infinite: false };

      // 创建循环设置按钮
      const btnLoop = createLoopButton(() => {
        showLoopDialog(settings, player, (newSettings) => {
          settings = { ...settings, ...newSettings };
          saveSettings(settings);
        });
      });
      controls.appendChild(btnLoop);

      // 原生播放器按钮正常播放
      // 循环逻辑已移到弹窗按钮
    }
    // 首次初始化
    setTimeout(init, 1000);
  }

  // 启动脚本
  main();
})();
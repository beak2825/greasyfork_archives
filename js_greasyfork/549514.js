// ==UserScript==
// @name:zh-CN   Bilibili 循环片段
// @name         Bilibili Loop Clip
// @name:zh-TW   Bilibili 循環片段
// @name:en      Bilibili Loop Clip
// @namespace    https://github.com/ooking/bilibili-loop-clip
// @version      1.0.0
// @description  可在Bilibili视频时间轴上选取片段循环播放，支持无限循环及刷新页面后设置持久保存。例如：学习英语时可反复播放某段对话，便于听力练习。
// @description:zh-CN 可在Bilibili视频时间轴上选取片段循环播放，支持无限循环及刷新页面后设置持久保存。例如：学习英语时可反复播放某段对话，便于听力练习。
// @description:zh-TW 可在Bilibili影片時間軸上選取片段循環播放，支援無限循環且刷新頁面後設定持久保存。例如：學習英語時可反覆播放某段對話，便於聽力練習。
// @description:en    Select and loop a clip on the Bilibili timeline, supports infinite loop and persistent settings after refresh. For example: repeatedly play a dialogue for English listening practice.
// @author       King Chan (chenwenj@gmail.com)
// @include      *://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MPL-2.0
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/549514/Bilibili%20Loop%20Clip.user.js
// @updateURL https://update.greasyfork.org/scripts/549514/Bilibili%20Loop%20Clip.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s]
      .map((v) => v < 10 ? '0' + v : v)
      .join(':');
  }

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

  // 获取当前Bilibili视频bvid
  function getBvid() {
    const match = window.location.pathname.match(/\/video\/(BV[\w]+)/);
    return match ? match[1] : null;
  }

  function getPlayer() {
    return document.querySelector('video');
  }

  function saveSettings(settings) {
    const bvid = getBvid();
    if (bvid) {
      GM_setValue('bl_loop_' + bvid, JSON.stringify(settings));
    }
  }

  function loadSettings() {
    const bvid = getBvid();
    if (bvid) {
      const data = GM_getValue('bl_loop_' + bvid, null);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  function createLoopButton(onClick) {
    const btn = document.createElement('div');
    btn.className = 'bpx-player-ctrl-btn bl-loop-btn';
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('aria-label', '循环片段');
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.margin = '0 4px';
    btn.style.cursor = 'pointer';
    btn.style.width = 'auto'; // 去除原生 class 的宽度限制
    btn.style.minWidth = 'unset';
    btn.style.maxWidth = 'unset';
    btn.onclick = onClick;

    // 模仿原生按钮，仅显示文字
    const textSpan = document.createElement('span');
    textSpan.textContent = '循环片段';
    textSpan.style.color = '#00a1d6'; // 蓝色文字
    textSpan.style.fontSize = '12px';
    textSpan.style.fontWeight = 'bold';
    textSpan.style.padding = '0 8px';
    textSpan.style.lineHeight = '24px';
    btn.appendChild(textSpan);

    return btn;
  }

  function showLoopDialog(settings, player, onSave) {
    if (document.getElementById('bl-loop-dialog')) return;
    if (player) player.pause();

    const btn = document.querySelector('.bl-loop-btn');
    const btnText = btn ? btn.querySelector('span') : null;
    let top = 80, left = window.innerWidth / 2;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      top = rect.top - 16 - 240;
      if (top < 10) top = 10;
      left = rect.left + rect.width / 2;
    }

    const dialog = document.createElement('div');
    dialog.id = 'bl-loop-dialog';
    dialog.style.position = 'fixed';
    dialog.style.top = top + 'px';
    dialog.style.left = left + 'px';
    dialog.style.transform = 'translateX(-50%)';
    dialog.style.background = 'linear-gradient(135deg, #fffbe6 0%, #f7f7fa 10%)';
    dialog.style.padding = '8px 28px 20px 28px';
    dialog.style.borderRadius = '16px';
    dialog.style.boxShadow = '0 4px 24px rgba(0,0,0,0.13)';
    dialog.style.minWidth = '250px';
    dialog.style.zIndex = '99999';
    dialog.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    dialog.style.color = '#222';
    dialog.style.cursor = 'move';

    const titleBar = document.createElement('div');
    titleBar.style.fontWeight = 'bold';
    titleBar.style.marginBottom = '18px';
    titleBar.style.fontSize = '14px';
    titleBar.style.letterSpacing = '0.5px';
    titleBar.style.textAlign = 'center';
    titleBar.textContent = '循环片段设置';
    dialog.appendChild(titleBar);

    const labelStyle = 'display:inline-block;min-width:110px;font-size:12px;margin-bottom:8px;';
    const inputStyle = 'font-size:12px;padding:2px 8px;border-radius:6px;border:1px solid #ccc;margin-right:8px;width:60px;background:#fff;';
    const btnStyle = 'font-size:12px;padding:2px 10px;border-radius:8px;border:1px solid #bbb;background:#00a1d6;color:#fff;cursor:pointer;margin-left:8px;';

    const labelStart = document.createElement('label');
    labelStart.setAttribute('style', labelStyle);
    labelStart.textContent = '开始时间:';
    const inputStart = document.createElement('input');
    inputStart.id = 'bl-loop-start';
    inputStart.type = 'text';
    inputStart.value = formatTime(settings.start);
    inputStart.setAttribute('style', inputStyle);
    labelStart.appendChild(inputStart);
    const btnGetStart = document.createElement('button');
    btnGetStart.textContent = '获取当前';
    btnGetStart.setAttribute('style', btnStyle);
    btnGetStart.onclick = () => {
      inputStart.value = formatTime(Math.floor(player.currentTime));
    };
    labelStart.appendChild(btnGetStart);
    dialog.appendChild(labelStart);
    dialog.appendChild(document.createElement('br'));

    const labelEnd = document.createElement('label');
    labelEnd.setAttribute('style', labelStyle);
    labelEnd.textContent = '结束时间:';
    const inputEnd = document.createElement('input');
    inputEnd.id = 'bl-loop-end';
    inputEnd.type = 'text';
    inputEnd.value = formatTime(settings.end);
    inputEnd.setAttribute('style', inputStyle);
    labelEnd.appendChild(inputEnd);
    const btnGetEnd = document.createElement('button');
    btnGetEnd.textContent = '获取当前';
    btnGetEnd.setAttribute('style', btnStyle);
    btnGetEnd.onclick = () => {
      inputEnd.value = formatTime(Math.floor(player.currentTime));
    };
    labelEnd.appendChild(btnGetEnd);
    dialog.appendChild(labelEnd);
    dialog.appendChild(document.createElement('br'));

    const labelCount = document.createElement('label');
    labelCount.setAttribute('style', labelStyle);
    labelCount.textContent = '循环次数:';
    const inputCount = document.createElement('input');
    inputCount.id = 'bl-loop-count';
    inputCount.type = 'number';
    inputCount.min = '1';
    inputCount.value = settings.count || '';
    inputCount.setAttribute('style', inputStyle);
    labelCount.appendChild(inputCount);

    const spanInfinite = document.createElement('span');
    spanInfinite.setAttribute('style', 'margin-left:12px;font-size:12px;');
    // 无限循环默认选中
    const inputInfinite = document.createElement('input');
    inputInfinite.id = 'bl-loop-infinite';
    inputInfinite.type = 'checkbox';
    inputInfinite.checked = true;
    spanInfinite.appendChild(inputInfinite);
    spanInfinite.appendChild(document.createTextNode(' 无限循环'));
    labelCount.appendChild(spanInfinite);

    // 默认选中时禁用循环次数输入框
    inputCount.disabled = inputInfinite.checked;

    dialog.appendChild(labelCount);
    dialog.appendChild(document.createElement('br'));

    let isLoopPlaying = false;
    const btnLoopPlay = document.createElement('button');
    btnLoopPlay.textContent = '播放';
    btnLoopPlay.setAttribute('style', btnStyle + 'margin-right:8px;background:#7ed957;border:1px solid #6bbf4e;');
    const btnLoopPause = document.createElement('button');
    btnLoopPause.textContent = '停止';
    btnLoopPause.setAttribute('style', btnStyle + 'margin-right:8px;background:#ffb4b4;border:1px solid #e88c8c;');
    btnLoopPause.disabled = true;
    dialog.appendChild(btnLoopPlay);
    dialog.appendChild(btnLoopPause);

    // 保存按钮
    const btnSave = document.createElement('button');
    btnSave.id = 'bl-loop-save';
    btnSave.textContent = '保存';
    btnSave.setAttribute('style', btnStyle + 'margin-right:8px;background:#00a1d6;color:#fff;border:1px solid #00a1d6;');
    dialog.appendChild(btnSave);

    // 取消按钮
    const btnCancel = document.createElement('button');
    btnCancel.id = 'bl-loop-cancel';
    btnCancel.textContent = '关闭';
    btnCancel.setAttribute('style', btnStyle + 'background:#00a1d6;color:#fff;border:1px solid #00a1d6;');
    dialog.appendChild(btnCancel);

    document.body.appendChild(dialog);

    let isDragging = false, offsetX = 0, offsetY = 0;
    dialog.addEventListener('mousedown', function(e) {
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

    btnSave.onclick = () => {
      const start = parseTime(inputStart.value);
      const end = parseTime(inputEnd.value);
      const infinite = inputInfinite.checked;
      const count = infinite ? 0 : parseInt(inputCount.value, 10) || 1;
      onSave({ start, end, count, infinite });
    };
    btnCancel.onclick = () => {
      document.body.removeChild(dialog);
      // stopLoopPlay();
    };
    inputInfinite.onchange = (e) => {
      inputCount.disabled = e.target.checked;
    };

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
      // 按钮文字变绿色
      if (btnText) btnText.style.color = '#43d15d';
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
      // 恢复按钮文字颜色
      if (btnText) btnText.style.color = '#00a1d6';
    }
    btnLoopPlay.onclick = startLoopPlay;
    btnLoopPause.onclick = stopLoopPlay;
  }

  function main() {
    let lastUrl = '';
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        setTimeout(init, 1000);
      }
    }, 1000);

    function init() {
      document.querySelectorAll('.bl-loop-btn').forEach((el) => el.remove());

      const player = getPlayer();
      if (!player) return;

      // 优先插入到底部右侧控制容器
      let bottomRight = document.querySelector('.bpx-player-control-bottom-right');
      let sendBtn = document.querySelector('.bui-area.bui-button-blue');
      let dmBtn = document.querySelector('.bpx-player-dm-btn');
      let controls = null;
      if (bottomRight) {
        controls = bottomRight;
      } else if (sendBtn && sendBtn.parentNode) {
        controls = sendBtn.parentNode;
      } else if (dmBtn && dmBtn.parentNode) {
        controls = dmBtn.parentNode;
      } else {
        controls = document.querySelector('.bpx-player-control-left')
          || document.querySelector('.bilibili-player-video-control-left')
          || document.querySelector('.bilibili-player-video-control-bottom')
          || document.querySelector('.bpx-player-control-bar')
          || document.body;
      }

      let settings = loadSettings() || { start: 0, end: Math.floor(player.duration), count: 1, infinite: false };

      const btnLoop = createLoopButton(() => {
        showLoopDialog(settings, player, (newSettings) => {
          settings = { ...settings, ...newSettings };
          saveSettings(settings);
        });
      });

      if (bottomRight) {
        controls.appendChild(btnLoop);
      } else if (sendBtn && sendBtn.parentNode) {
        sendBtn.parentNode.insertBefore(btnLoop, sendBtn.nextSibling);
      } else if (dmBtn && dmBtn.parentNode) {
        dmBtn.parentNode.insertBefore(btnLoop, dmBtn.nextSibling);
      } else {
        controls.appendChild(btnLoop);
      }
    }
    setTimeout(init, 1000);
  }

  main();
})();
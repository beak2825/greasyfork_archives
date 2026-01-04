// ==UserScript==
// @name         X(Twitter) 自动取关助手
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  自动取关 X(Twitter)
// @author       Ri
// @match        https://twitter.com/*/following
// @match        https://x.com/*/following
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548483/X%28Twitter%29%20%E8%87%AA%E5%8A%A8%E5%8F%96%E5%85%B3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/548483/X%28Twitter%29%20%E8%87%AA%E5%8A%A8%E5%8F%96%E5%85%B3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ---------------- global state ----------------
  let unfollowCount = 0;
  let maxUnfollows = 200;
  let onlyNotFollowingBack = true;
  let running = false;
  let paused = false;
  let delayTime = 2000; // 毫秒

  // ---------------- load web fonts (Poppins 主体, Pacifico 广告) ----------------
  function loadFonts() {
    try {
      const href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Pacifico&display=swap';
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    } catch (e) {
      console.warn('加载字体失败', e);
    }
  }
  loadFonts();

  // ---------------- util ----------------
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
  function now() { return new Date().toLocaleTimeString(); }

  // ---------------- core unfollow loop ----------------
  async function autoUnfollow() {
    logMessage('✅ 脚本启动');
    while (running && unfollowCount < maxUnfollows) {
      if (paused) {
        await sleep(1000);
        continue;
      }

      // 查找按钮：保留你在控制台测试通过的简单策略（按钮文本匹配）
      const unfollowButtons = [...document.querySelectorAll('button')]
        .filter(btn => {
          const txt = (btn.innerText || '').trim();
          return ["フォロー中", "Following", "已关注", "正在关注"].includes(txt);
        });

      if (unfollowButtons.length === 0) {
        logMessage('⚠ 未找到可用按钮，滚动加载更多...');
        window.scrollBy(0, 1200);
        await sleep(2000);
        continue;
      }

      for (const btn of unfollowButtons) {
        if (!running || unfollowCount >= maxUnfollows) break;
        if (paused) break;

        // 判断是否是同一个主列项（尽量使用你原始脚本里成功的 cellInnerDiv）
        const userBlock = btn.closest('div[data-testid="cellInnerDiv"]');
        const textContent = userBlock ? userBlock.innerText : '';

        if (onlyNotFollowingBack &&
            (textContent.includes("フォローされています") ||
             textContent.includes("Follows you") ||
             textContent.includes("正在关注你") ||
             textContent.includes("关注了你"))) {
          logMessage('➡ 跳过：已回关');
          continue;
        }

        // 点击“フォロー中 / Following”
        try {
          btn.click();
          await sleep(700);
        } catch (e) {
          logMessage('⚠ 点击按钮失败：' + (e.message || e));
          continue;
        }

        // 点击确认按钮（多语言）
        const confirmBtn = [...document.querySelectorAll('button')]
          .find(b => ["フォロー解除","Unfollow","取消关注"].some(t => (b.innerText || '').includes(t)));

        if (confirmBtn) {
          try {
            confirmBtn.click();
            unfollowCount++;
            logMessage(`✅ 已取关 ${unfollowCount} / ${maxUnfollows}`);
            updateProgress();
          } catch (e) {
            logMessage('⚠ 点击确认失败：' + (e.message || e));
          }
        } else {
          logMessage('⚠ 未找到确认按钮（已跳过）');
        }

        // 随机或固定延迟（这里使用固定 delayTime）
        await sleep(delayTime);
      }

      // 向下滚动加载更多
      window.scrollBy(0, 1200);
      await sleep(1200);
    }

    running = false;
    paused = false;
    updateButtonStates('stop');
    logMessage(`🎯 任务结束：共处理 ${unfollowCount} 人`);
    try { alert(`任务完成，共处理 ${unfollowCount} 人`); } catch(e){}
  }

  // ---------------- UI panel ----------------
  function createPanel() {
    if (document.getElementById('xauto-panel-v3')) return;
    const panel = document.createElement('div');
    panel.id = 'xauto-panel-v3';
    Object.assign(panel.style, {
      position: 'fixed',
      top: '80px',
      right: '20px',
      width: '300px',
      zIndex: 2147483647,
      boxSizing: 'border-box',
      fontFamily: "Poppins, 'Segoe UI', Roboto, Arial, sans-serif",
      fontSize: '14px'
    });

    panel.innerHTML = `
      <div style="background:#fff;border-radius:12px;box-shadow:0 6px 20px rgba(2,6,23,.25);padding:12px;border:1px solid rgba(0,0,0,0.06);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div style="font-weight:600;font-size:16px;color:#111">🚀 自动取关助手</div>
          <div style="font-size:12px;color:#6b7280">v3.2</div>
        </div>

        <div style="margin-bottom:8px;">
          <label style="color:#374151;">数量上限：
            <input id="maxUnf" type="number" value="${maxUnfollows}" min="1" style="width:90px;padding:6px;border-radius:6px;border:1px solid #e5e7eb;text-align:center;margin-left:6px;">
          </label>
        </div>

        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
          <label style="flex:1;color:#374151;"><input id="onlyNotBack" type="checkbox" ${onlyNotFollowingBack? 'checked':''}> 仅未回关者</label>
          <label style="color:#374151;">间隔(秒):
            <input id="delayTime" type="number" value="${delayTime/1000}" min="1" max="60" style="width:60px;padding:6px;border-radius:6px;border:1px solid #e5e7eb;text-align:center;margin-left:6px;">
          </label>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <button id="startUnf" style="flex:1;padding:8px;border-radius:8px;border:0;background:#16a34a;color:#fff;font-weight:600;cursor:pointer;">▶ 开始</button>
          <button id="pauseUnf" style="flex:1;padding:8px;border-radius:8px;border:0;background:#f59e0b;color:#fff;font-weight:600;cursor:pointer;" disabled>⏸ 暂停</button>
          <button id="stopUnf" style="flex:1;padding:8px;border-radius:8px;border:0;background:#ef4444;color:#fff;font-weight:600;cursor:pointer;" disabled>⏹ 停止</button>
        </div>

        <div style="margin-bottom:8px;color:#374151;font-size:13px;">进度：<span id="progressText">0 / ${maxUnfollows}</span></div>
        <div style="background:#f3f4f6;border-radius:8px;height:10px;overflow:hidden;margin-bottom:10px;">
          <div id="progressBar" style="width:0%;height:100%;background:linear-gradient(90deg,#10b981,#059669);"></div>
        </div>

        <div id="logBox" style="height:120px;overflow:auto;background:#fbfeff;border:1px solid #eef2ff;padding:8px;border-radius:8px;font-size:12px;color:#374151;">
          ${now()} - 面板就绪，请设置后点击开始。
        </div>

        <div id="xauto-ad" style="margin-top:10px;border-radius:8px;padding:10px;color:#fff;text-align:center;background:linear-gradient(90deg,#ff416c,#ff4b2b);">
          <div style="font-weight:700;font-size:14px;">覆盖海内外各大电商短视频平台</div>
          <div style="margin:6px 0;font-size:13px;">粉丝｜点赞｜评论｜分享｜收藏｜播放｜直播人气｜电商引流</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:6px;">业务项目超900+，全网独家货源</div>
          <div style="font-size:12px;margin-bottom:8px;">/ 安全稳定 · 自助下单 /</div>
          <a href="https://hdwx.wstop.top/" target="_blank" style="display:inline-block;padding:8px 12px;background:#fff;color:#ff4b2b;border-radius:8px;font-weight:700;text-decoration:none;">👉 点击进入</a>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // 强制设置广告字体（高优先级）
    const ad = document.getElementById('xauto-ad');
    try {
      ad.style.setProperty('font-family', "Pacifico, 'Trebuchet MS', 'Comic Sans MS', sans-serif", 'important');
    } catch (e) { /* ignore */ }

    // 按钮 & 控件
    const startBtn = document.getElementById('startUnf');
    const pauseBtn = document.getElementById('pauseUnf');
    const stopBtn = document.getElementById('stopUnf');
    const maxInput = document.getElementById('maxUnf');
    const delayInput = document.getElementById('delayTime');
    const onlyNotBackInput = document.getElementById('onlyNotBack');

    // 初始化进度显示
    maxUnfollows = parseInt(maxInput.value) || maxUnfollows;
    updateProgress();

    // 监听上限实时变化（立即更新进度显示）
    maxInput.addEventListener('change', () => {
      maxUnfollows = parseInt(maxInput.value) || 1;
      updateProgress();
    });

    // 监听间隔输入变化（动态生效，下次开始或继续生效）
    delayInput.addEventListener('change', () => {
      const v = parseInt(delayInput.value);
      if (!isNaN(v) && v >= 1) delayTime = v * 1000;
    });

    // 监听仅未回关切换
    onlyNotBackInput.addEventListener('change', () => {
      onlyNotFollowingBack = !!onlyNotBackInput.checked;
    });

    // 按钮行为
    startBtn.addEventListener('click', (e) => {
      if (running) return;
      unfollowCount = 0;
      maxUnfollows = parseInt(maxInput.value) || 200;
      delayTime = (parseInt(delayInput.value) || 2) * 1000;
      onlyNotFollowingBack = !!onlyNotBackInput.checked;
      running = true;
      paused = false;
      updateButtonStates('start');
      logMessage('▶ 已开始任务');
      updateProgress();
      autoUnfollow();
    });

    pauseBtn.addEventListener('click', (e) => {
      if (!running) return;
      paused = !paused;
      updateButtonStates(paused ? 'pause' : 'resume');
      logMessage(paused ? '⏸ 已暂停' : '▶ 已继续');
    });

    stopBtn.addEventListener('click', () => {
      if (!running) { logMessage('脚本未在运行'); return; }
      running = false;
      paused = false;
      updateButtonStates('stop');
      logMessage('⏹ 已停止');
    });

    // 初始按钮状态
    updateButtonStates('idle');
  }

  // ---------------- button visuals ----------------
  function updateButtonStates(state) {
    const startBtn = document.getElementById('startUnf');
    const pauseBtn = document.getElementById('pauseUnf');
    const stopBtn = document.getElementById('stopUnf');
    if (!startBtn || !pauseBtn || !stopBtn) return;

    if (state === 'start') {
      startBtn.disabled = true; startBtn.style.opacity = '0.6';
      pauseBtn.disabled = false; pauseBtn.style.opacity = '1'; pauseBtn.innerText = '⏸ 暂停';
      stopBtn.disabled = false; stopBtn.style.opacity = '1';
    } else if (state === 'pause') {
      pauseBtn.innerText = '▶ 继续';
      pauseBtn.style.opacity = '0.6';
    } else if (state === 'resume') {
      pauseBtn.innerText = '⏸ 暂停';
      pauseBtn.style.opacity = '1';
    } else if (state === 'stop') {
      startBtn.disabled = false; startBtn.style.opacity = '1';
      pauseBtn.disabled = true; pauseBtn.style.opacity = '0.6'; pauseBtn.innerText = '⏸ 暂停';
      stopBtn.disabled = true; stopBtn.style.opacity = '0.6';
    } else { // idle
      startBtn.disabled = false; startBtn.style.opacity = '1';
      pauseBtn.disabled = true; pauseBtn.style.opacity = '0.6'; pauseBtn.innerText = '⏸ 暂停';
      stopBtn.disabled = true; stopBtn.style.opacity = '0.6';
    }
  }

  // ---------------- logging & progress ----------------
  function logMessage(msg) {
    const box = document.getElementById('logBox');
    if (!box) return console.log(msg);
    const line = document.createElement('div');
    line.textContent = `${now()} - ${msg}`;
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  }

  function updateProgress() {
    const pText = document.getElementById('progressText');
    const pBar = document.getElementById('progressBar');
    if (!pText || !pBar) return;
    pText.textContent = `${unfollowCount} / ${maxUnfollows}`;
    const pct = Math.min(100, (maxUnfollows > 0 ? (unfollowCount / maxUnfollows) * 100 : 0));
    pBar.style.width = `${pct}%`;
    if (pct >= 100) pBar.style.background = 'linear-gradient(90deg,#10b981,#059669)';
  }

  // ---------------- init ----------------
  try {
    window.addEventListener('load', () => setTimeout(createPanel, 900));
    // also create panel earlier if DOM already ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(createPanel, 300);
    }
  } catch (e) {
    console.error('初始化面板失败', e);
  }

})();

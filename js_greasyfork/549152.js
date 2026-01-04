// ==UserScript==
// @name         B站bili直播间挂机全自动升级粉丝团灯牌等级
// @namespace    http://tampermonkey.net/
// @version      7.1
// @description  分批打开粉丝团灯牌直播间自动挂机升等级，带设置面板、进度显示、倒计时自动关闭（可暂停）、自动点赞300次
// @match        *://*.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.live.bilibili.com
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/549152/B%E7%AB%99bili%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8D%87%E7%BA%A7%E7%B2%89%E4%B8%9D%E5%9B%A2%E7%81%AF%E7%89%8C%E7%AD%89%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/549152/B%E7%AB%99bili%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%85%A8%E8%87%AA%E5%8A%A8%E5%8D%87%E7%BA%A7%E7%B2%89%E4%B8%9D%E5%9B%A2%E7%81%AF%E7%89%8C%E7%AD%89%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ===== 工具：配置（GM 存储，跨域共享） =====
  const defaultConfig = {
    BATCH_SIZE: 5,
    BATCH_INTERVAL_MIN: 30,
    AUTO_CLOSE_MIN: 30,
    AUTO_LIKE: true
  };
  function getConfig() {
    return Object.assign({}, defaultConfig, JSON.parse(GM_getValue('medalOpenerConfig', '{}')));
  }
  function saveConfig(cfg) {
    GM_setValue('medalOpenerConfig', JSON.stringify(cfg));
  }

  const isLiveRoom = location.hostname.includes('live.bilibili.com');

  // ===== 直播间页面逻辑 =====
  if (isLiveRoom) {
    // 单次注入保护，避免 SPA 或重复执行导致多份定时器
    if (window.__medalOpener_live_injected) return;
    window.__medalOpener_live_injected = true;

    const cfg = getConfig();

    // ---------- 自动点赞 300 次（可开关） ----------
    if (cfg.AUTO_LIKE) {
      (async function autoLike300() {
        try {
          const roomIdMatch = location.href.match(/live\.bilibili\.com\/(\d+)/);
          if (!roomIdMatch) return;
          const roomId = roomIdMatch[1];

          const infoRes = await fetch(
            `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=${roomId}`,
            { credentials: 'include' }
          );
          const infoJson = await infoRes.json();
          if (infoJson.code !== 0) throw new Error(infoJson.message);
          const medalInfo = infoJson.data.medal.curr_weared;
          if (!medalInfo) {
            console.warn('没有佩戴该直播间的粉丝勋章，跳过自动点赞');
            return;
          }

          const csrfMatch = document.cookie.match(/bili_jct=([0-9a-fA-F]{32})/);
          const csrf = csrfMatch ? csrfMatch[1] : '';
          const uidMatch = document.cookie.match(/DedeUserID=(\d+)/);
          const uid = uidMatch ? uidMatch[1] : '';

          const body = new URLSearchParams({
            click_time: '300',
            room_id: roomId,
            anchor_id: medalInfo.target_id,
            uid: uid,
            csrf: csrf
          });

          const likeRes = await fetch(
            'https://api.live.bilibili.com/xlive/app-ucenter/v1/like_info_v3/like/likeReportV3',
            {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body
            }
          );
          const likeJson = await likeRes.json();
          if (likeJson.code === 0) {
            console.log(`已自动为直播间 ${roomId} 点赞 300 次`);
          } else {
            console.warn(`点赞失败：${likeJson.message}`);
          }
        } catch (err) {
          console.error('自动点赞出错：', err);
        }
      })();
    }

    // ---------- 倒计时 + 暂停/恢复按钮 ----------
    // UI
    const Z = 2147483647; // 最大 z-index，确保可点
    const countdownDiv = document.createElement('div');
    countdownDiv.style.cssText = `
      position:fixed;top:60px;right:20px;z-index:${Z};
      padding:8px 12px;background:rgba(0,0,0,0.7);
      color:#fff;font-size:14px;border-radius:4px;
      pointer-events:auto;
    `;
    document.body.appendChild(countdownDiv);

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '保持直播间打开（暂停自动关闭）';
    toggleBtn.style.cssText = `
      position:fixed;top:100px;right:20px;z-index:${Z};
      padding:10px;background:#f25d8e;color:#fff;
      border:none;cursor:pointer;border-radius:4px;
      pointer-events:auto;
    `;
    document.body.appendChild(toggleBtn);

    // 状态与逻辑
    let remainingSec = Math.max(1, Number(cfg.AUTO_CLOSE_MIN) || 30) * 60;
    let intervalId = null;
    let paused = false;

    function formatTime(sec) {
      if (!Number.isFinite(sec) || sec < 0) sec = 0;
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}分${s.toString().padStart(2, '0')}秒`;
    }

    function renderCountdown() {
      if (paused) {
        countdownDiv.textContent = `自动关闭：已暂停`;
      } else {
        countdownDiv.textContent = `自动关闭倒计时：${formatTime(remainingSec)}`;
      }
    }

    function stopCountdown() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function startCountdown() {
      stopCountdown();
      paused = false;
      renderCountdown();
      intervalId = setInterval(() => {
        if (paused) return;
        remainingSec -= 1;
        renderCountdown();
        if (remainingSec <= 0) {
          stopCountdown();
          // 仅当页面是由脚本打开时，window.close() 才能成功
          try { window.close(); } catch (e) { console.warn('window.close() 可能被浏览器拦截'); }
        }
      }, 1000);
    }

    function pauseAutoClose() {
      paused = true;
      stopCountdown();
      renderCountdown();
      toggleBtn.textContent = '恢复自动关闭';
      toggleBtn.style.background = '#00a1d6';
    }

    function resumeAutoClose() {
      const freshCfg = getConfig(); // 恢复时读取最新配置
      remainingSec = Math.max(1, Number(freshCfg.AUTO_CLOSE_MIN) || 30) * 60;
      startCountdown();
      toggleBtn.textContent = '保持直播间打开（暂停自动关闭）';
      toggleBtn.style.background = '#f25d8e';
    }

    // 初始启动倒计时
    startCountdown();

    // 点击切换暂停/恢复
    toggleBtn.addEventListener('click', () => {
      if (paused) {
        resumeAutoClose();
      } else {
        pauseAutoClose();
      }
    });

    return; // live 页面逻辑到此结束
  }

  // ===== 非直播间页面（主站）逻辑 =====
  function getMedalList(page = 1, pageSize = 50) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://api.live.bilibili.com/xlive/app-ucenter/v1/fansMedal/panel?page=${page}&page_size=${pageSize}`,
        headers: { 'Cookie': document.cookie },
        onload: res => {
          try {
            const json = JSON.parse(res.responseText);
            if (json.code === 0) {
              resolve([
                ...(json.data.list || []),
                ...(json.data.special_list || [])
              ]);
            } else {
              reject(json.message);
            }
          } catch (e) { reject(e); }
        },
        onerror: reject
      });
    });
  }

  function openLiveRoom(roomId) {
    // 提示：window.open 可能被拦截，需按钮触发
    window.open(`https://live.bilibili.com/${roomId}`, '_blank');
  }

  // ----- 设置面板 -----
  const Z = 2147483647;
  const settingsBtn = document.createElement('button');
  settingsBtn.textContent = '⚙ 设置';
  settingsBtn.style.cssText = `
    position:fixed;top:220px;right:20px;z-index:${Z};
    padding:6px 10px;background:#666;color:#fff;
    border:none;cursor:pointer;border-radius:4px;
  `;
  document.body.appendChild(settingsBtn);

  const settingsPanel = document.createElement('div');
  settingsPanel.style.cssText = `
    position:fixed;top:250px;right:20px;z-index:${Z};
    background:#fff;padding:10px;border:1px solid #ccc;
    display:none;width:240px;border-radius:6px;
    box-shadow:0 6px 18px rgba(0,0,0,0.15);
  `;
  const cfgNow = getConfig();
  settingsPanel.innerHTML = `
    <div style="font-weight:bold;margin-bottom:6px;">批量打开设置</div>
    <label style="display:block;margin:6px 0;">每批数量：
      <input type="number" id="batchSize" value="${cfgNow.BATCH_SIZE}" min="1" style="width:90px;">
    </label>
    <label style="display:block;margin:6px 0;">间隔(分钟)：
      <input type="number" id="batchInterval" value="${cfgNow.BATCH_INTERVAL_MIN}" min="1" style="width:90px;">
    </label>
    <label style="display:block;margin:6px 0;">关闭时间(分钟)：
      <input type="number" id="autoClose" value="${cfgNow.AUTO_CLOSE_MIN}" min="1" style="width:90px;">
    </label>
    <label style="display:block;margin:6px 0;">
      <input type="checkbox" id="autoLike" ${cfgNow.AUTO_LIKE ? 'checked' : ''}> 进入直播间自动点赞300次
    </label>
    <button id="saveSettings" style="margin-top:8px;padding:6px 10px;background:#00a1d6;color:#fff;border:none;border-radius:4px;cursor:pointer;">保存</button>
  `;
  document.body.appendChild(settingsPanel);

  settingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
  });

  settingsPanel.querySelector('#saveSettings').addEventListener('click', () => {
    const newCfg = {
      BATCH_SIZE: parseInt(settingsPanel.querySelector('#batchSize').value),
      BATCH_INTERVAL_MIN: parseInt(settingsPanel.querySelector('#batchInterval').value),
      AUTO_CLOSE_MIN: parseInt(settingsPanel.querySelector('#autoClose').value),
      AUTO_LIKE: settingsPanel.querySelector('#autoLike').checked
    };
    // 合法性兜底
    if (!Number.isFinite(newCfg.BATCH_SIZE) || newCfg.BATCH_SIZE < 1) newCfg.BATCH_SIZE = defaultConfig.BATCH_SIZE;
    if (!Number.isFinite(newCfg.BATCH_INTERVAL_MIN) || newCfg.BATCH_INTERVAL_MIN < 1) newCfg.BATCH_INTERVAL_MIN = defaultConfig.BATCH_INTERVAL_MIN;
    if (!Number.isFinite(newCfg.AUTO_CLOSE_MIN) || newCfg.AUTO_CLOSE_MIN < 1) newCfg.AUTO_CLOSE_MIN = defaultConfig.AUTO_CLOSE_MIN;

    saveConfig(newCfg);
    alert('设置已保存');
    settingsPanel.style.display = 'none';
  });

  // ----- 进度显示 -----
  const progressDiv = document.createElement('div');
  progressDiv.style.cssText = `
    position:fixed;top:140px;right:20px;z-index:${Z};
    padding:8px 10px;background:#00a1d6;color:#fff;
    border-radius:4px;
  `;
  progressDiv.textContent = '进度：未开始';
  document.body.appendChild(progressDiv);

  // ----- 执行按钮 -----
  const startBtn = document.createElement('button');
  startBtn.textContent = '批量挂机直播';
  startBtn.style.cssText = `
    position:fixed;top:180px;right:20px;z-index:${Z};
    padding:10px;background:#00a1d6;color:#fff;
    border:none;cursor:pointer;border-radius:4px;
  `;
  document.body.appendChild(startBtn);

  startBtn.addEventListener('click', async () => {
    try {
      const cfg = getConfig(); // 实时读取
      const medals = await getMedalList();
      if (!medals.length) {
        progressDiv.textContent = '进度：无可用勋章';
        return;
      }
      let index = 0;
      const totalBatches = Math.ceil(medals.length / cfg.BATCH_SIZE);

      async function openBatch() {
        const batch = medals.slice(index, index + cfg.BATCH_SIZE);
        batch.forEach(medal => {
          if (medal?.room_info?.room_id) {
            openLiveRoom(medal.room_info.room_id);
          }
        });
        index += cfg.BATCH_SIZE;
        const currentBatch = Math.min(totalBatches, Math.ceil(index / cfg.BATCH_SIZE));
        const percent = Math.min(100, Math.round((currentBatch / totalBatches) * 100));
        progressDiv.textContent = `进度：${currentBatch}/${totalBatches} 批 (${percent}%)`;

        if (index < medals.length) {
          setTimeout(openBatch, cfg.BATCH_INTERVAL_MIN * 60 * 1000);
        }
      }

      openBatch();
    } catch (err) {
      console.error('获取勋章列表失败：', err);
      progressDiv.textContent = '进度：获取勋章失败';
    }
  });

})();

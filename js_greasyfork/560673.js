// ==UserScript==
// @name         Music Room
// @namespace    music-room-bgm
// @version      1.7.2
// @author       CHANG
// @description  一起在bgm听bgm吧！
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560673/Music%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/560673/Music%20Room.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1. 配置 WebSocket 地址 (请替换成你部署后的域名)
  const WORKER_WS = "wss://music-room.mikuorz.workers.dev/room/default";

  // 2. 抓取 Bangumi 昵称
  const getBgmUser = () => {
    const nickLink = document.querySelector('#header h1 a.l');
    if (nickLink && nickLink.innerText.trim()) return nickLink.innerText.trim();
    const avatarLink = document.querySelector('a.avatar.l');
    if (avatarLink && avatarLink.innerText.trim()) return avatarLink.innerText.trim();
    return "游客";
  };

  // 3. UI 样式注入
  const style = document.createElement("style");
  style.innerHTML = `
    #music-room-panel { position: fixed; top: 100px; right: 20px; width: 320px; background: rgba(17, 17, 17, 0.98); color: #eee; border-radius: 12px; font-family: sans-serif; z-index: 999999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid #333; display: flex; flex-direction: column; overflow: hidden; transition: width 0.3s; }
    #music-room-panel.minimized { width: 45px; height: 45px; border-radius: 50%; }
    #room-header { background: #222; padding: 10px 15px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; user-select: none; }
    .header-btns span { margin-left: 10px; cursor: pointer; font-size: 16px; color: #888; }
    .room-content { padding: 15px; }
    #statusTag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: #333; color: #7fd; }
    #current-title { font-size: 15px; font-weight: bold; margin: 10px 0 2px; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    #current-user { font-size: 11px; color: #888; margin-bottom: 8px; }
    #playlist-container { max-height: 100px; overflow-y: auto; font-size: 12px; color: #999; margin: 10px 0; border-top: 1px solid #222; padding-top: 5px; }
    .song-item { padding: 4px 0; border-bottom: 1px solid #222; display: flex; justify-content: space-between; gap: 10px; }
    .song-user { color: #555; font-size: 10px; flex-shrink: 0; }
    .input-group { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
    .input-group input { background: #111; border: 1px solid #444; color: #fff; padding: 6px; border-radius: 4px; font-size: 12px; }
    .input-group button { background: #1db954; border: none; color: #fff; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    #room-audio { width: 100%; height: 35px; filter: invert(90%) hue-rotate(180deg); margin-top: 5px; }
    #mini-icon { display: none; width: 100%; height: 100%; justify-content: center; align-items: center; font-size: 20px; cursor: pointer; background: #1db954; }
    #music-room-panel.minimized .room-content, #music-room-panel.minimized #room-header { display: none; }
    #music-room-panel.minimized #mini-icon { display: flex; }
  `;
  document.head.appendChild(style);

  // 4. DOM 结构
  const panel = document.createElement("div");
  panel.id = "music-room-panel";
  panel.innerHTML = `
    <div id="mini-icon">🎵</div>
    <div id="room-header"><span style="font-weight:bold;">🎵 Music Room</span><div class="header-btns"><span id="btn-min">－</span><span id="btn-close">✕</span></div></div>
    <div class="room-content">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <span id="statusTag">CONNECTING</span>
            <span id="onlineCount" style="font-size:10px; color:#555;">0人</span>
        </div>
        <div id="current-title">等待播放</div>
        <div id="current-user"></div>
        <div id="time-info" style="font-size:11px; color:#666;">00:00 / 00:00</div>
        <audio id="room-audio" controls crossorigin="anonymous"></audio>
        <div id="playlist-container"></div>
        <div class="input-group">
            <input type="text" id="songTitle" placeholder="歌曲名 (可选)">
            <input type="text" id="songUrl" placeholder="MP3 直链">
            <button id="addSong">解析并点歌</button>
        </div>
        <div id="skip-link" style="font-size:11px; color:#444; text-align:center; cursor:pointer; margin-top:8px;">Skip (跳过)</div>
    </div>
  `;
  document.body.appendChild(panel);

  const audio = document.getElementById("room-audio");
  const titleText = document.getElementById("current-title");
  const userText = document.getElementById("current-user");
  const listContainer = document.getElementById("playlist-container");

  // 5. 窗口交互逻辑
  document.getElementById("btn-min").onclick = (e) => { e.stopPropagation(); panel.classList.add("minimized"); };
  document.getElementById("mini-icon").onclick = () => panel.classList.remove("minimized");
  document.getElementById("btn-close").onclick = () => { if(confirm("确定退出点歌房？")) panel.style.display = "none"; };

  let isDragging = false, offsetX, offsetY;
  document.getElementById("room-header").onmousedown = (e) => { isDragging = true; offsetX = e.clientX - panel.offsetLeft; offsetY = e.clientY - panel.offsetTop; };
  document.onmousemove = (e) => { if (!isDragging || panel.classList.contains("minimized")) return; panel.style.left = (e.clientX - offsetX) + "px"; panel.style.top = (e.clientY - offsetY) + "px"; panel.style.right = "auto"; };
  document.onmouseup = () => { isDragging = false; };

  // 6. WebSocket 业务逻辑
  const ws = new WebSocket(WORKER_WS);
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "state") {
        if (!data.current) {
            titleText.textContent = "暂无播放";
            userText.textContent = "";
            listContainer.innerHTML = "";
            audio.src = "";
            return;
        }

        titleText.textContent = data.current.title;
        userText.textContent = `点歌人: ${data.current.user || '匿名'}`;

        listContainer.innerHTML = "<strong>队列:</strong>";
        data.playlist.forEach(s => {
            const item = document.createElement("div");
            item.className = "song-item";
            item.innerHTML = `<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${s.title}</span><span class="song-user">${s.user || ''}</span>`;
            listContainer.appendChild(item);
        });

        const now = Date.now();
        if (now >= data.endsAt) {
            statusTag.textContent = "BUFFERING";
            audio.pause();
            return;
        }

        statusTag.textContent = "LIVE";
        if (audio.src !== data.current.url) {
            audio.src = data.current.url;
            audio.load();
        }

        const target = (now - data.startedAt) / 1000;
        if (Math.abs(audio.currentTime - target) > 2) audio.currentTime = target;
        if (audio.paused) audio.play().catch(() => statusTag.textContent = "MUTED (Click!)");
    } else if (data.type === "online") {
        document.getElementById("onlineCount").textContent = `${data.count}人`;
    }
  };

  // 7. 点歌处理 (含美化文件名)
  document.getElementById("addSong").onclick = async () => {
    const tI = document.getElementById("songTitle"), uI = document.getElementById("songUrl"), btn = document.getElementById("addSong");
    const url = uI.value.trim(); if(!url) return;

    btn.disabled = true; btn.textContent = "解析中...";
    try {
        const dur = await new Promise((res, rej) => {
            const a = new Audio(url);
            a.onloadedmetadata = () => res(a.duration);
            a.onerror = rej;
            setTimeout(rej, 8000);
        });

        // 美化文件名逻辑
        let autoTitle = url.split('/').pop().split('?')[0];
        autoTitle = decodeURIComponent(autoTitle).replace(/%20/g, ' ');

        ws.send(JSON.stringify({
            type: "enqueue",
            song: {
                id: Date.now().toString(),
                title: tI.value.trim() || autoTitle,
                url,
                duration: Math.ceil(dur),
                user: getBgmUser()
            }
        }));
        tI.value = ""; uI.value = "";
    } catch(e) {
        alert("解析失败：链接无法加载或时长读取超时");
    }
    btn.disabled = false; btn.textContent = "解析并点歌";
  };

  document.getElementById("skip-link").onclick = () => ws.send(JSON.stringify({ type: "skip" }));

  // 8. 实时时间刷新
  setInterval(() => {
    if (audio.src && !audio.paused) {
        const cur = Math.floor(audio.currentTime);
        const dur = Math.floor(audio.duration || 0);
        const format = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
        document.getElementById("time-info").textContent = `${format(cur)} / ${format(dur)}`;
    }
  }, 1000);
})();
// ==UserScript==
// @name         Music Room
// @namespace    music-room-bgm
// @version      2.0.0
// @author       CHANG
// @description  一起在bgm听bgm吧！集成至Dock栏，支持网易云直链解析。
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @grant        GM_xmlhttpRequest
// @connect      163.com
// @connect      126.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560673/Music%20Room.user.js
// @updateURL https://update.greasyfork.org/scripts/560673/Music%20Room.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const WORKER_WS = "wss://music-room.mikuorz.workers.dev/room/default";
  const MUSIC_ICON_SVG = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22%23000%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%2013c0%201.105-1.12%202-2.5%202S1%2014.105%201%2013s1.12-2%202.5-2c.44%200%20.85.09%201.2.25V2l9-1.5V12c0%201.105-1.12%202-2.5%202S8.5%2013.105%208.5%2012s1.12-2%202.5-2c.44%200%20.85.09%201.2.25V3.5l-6.2%201V13z%22%2F%3E%3C%2Fsvg%3E`;

  const style = document.createElement("style");
  style.innerHTML = `
    .ico_music_room { background-image: url("${MUSIC_ICON_SVG}"); filter: invert(100%) brightness(.7); transition: filter 0.2s, opacity 0.2s; }
    #dock-music-room-li:hover .ico_music_room { filter: invert(100%) brightness(1); opacity: 1; }
    #music-room-panel { position: fixed; top: 100px; right: 20px; width: 320px; background: rgba(17, 17, 17, 0.75); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); color: #eee; border-radius: 12px; font-family: sans-serif; z-index: 999999; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); display: none; flex-direction: column; overflow: hidden; }
    #room-header { background: rgba(255, 255, 255, 0.05); padding: 10px 15px; cursor: move; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); user-select: none; }
    .header-btns span { margin-left: 10px; cursor: pointer; font-size: 16px; color: #888; }
    .room-content { padding: 15px; }
    #statusTag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(51, 51, 51, 0.8); color: #7fd; }
    #current-title { font-size: 15px; font-weight: bold; margin: 10px 0 2px; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    #current-user { font-size: 11px; color: #888; margin-bottom: 8px; }
    #playlist-container { max-height: 100px; overflow-y: auto; font-size: 12px; color: #999; margin: 10px 0; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 5px; }
    .song-item { padding: 4px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; gap: 10px; }
    .song-user { color: #555; font-size: 10px; flex-shrink: 0; }
    .input-group { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
    .input-group input { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 8px; border-radius: 6px; font-size: 12px; }
    .input-group input:focus { outline: none; border-color: #1db954; }
    .input-group button { background: #1db954; border: none; color: #fff; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .input-group button:hover { background: #1ed760; }
    #room-audio { width: 100%; height: 32px; filter: invert(90%) hue-rotate(180deg) brightness(1.2) opacity(0.85); margin-top: 10px; }
    #skip-link { font-size: 11px; color: #666; text-align: center; cursor: pointer; margin-top: 10px; }
  `;
  document.head.appendChild(style);

  const injectUI = () => {
    const panel = document.createElement("div");
    panel.id = "music-room-panel";
    panel.innerHTML = `
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
              <input type="text" id="songTitle" placeholder="歌曲名 (不填则自动解析)">
              <input type="text" id="songUrl" placeholder="MP3直链 或 网易云链接">
              <button id="addSong">解析并点歌</button>
          </div>
          <div id="skip-link">Skip (跳过)</div>
      </div>
    `;
    document.body.appendChild(panel);

    const dockUl = document.querySelector('#dock .content ul.clearit');
    if (dockUl) {
      const li = document.createElement('li');
      li.id = 'dock-music-room-li';
      li.innerHTML = `<a href="javascript:void(0);" title="音乐房间"><span class="ico ico-sq ico_music_room">音乐</span></a>`;
      const firstLi = dockUl.querySelector('li.first');
      if (firstLi) firstLi.insertAdjacentElement('afterend', li);
      else dockUl.prepend(li);
      li.onclick = (e) => {
        e.preventDefault();
        panel.style.display = (panel.style.display === "none" || panel.style.display === "") ? "flex" : "none";
      };
    }
  };

  injectUI();

  const panel = document.getElementById("music-room-panel");
  const audio = document.getElementById("room-audio");
  const titleText = document.getElementById("current-title");
  const userText = document.getElementById("current-user");
  const listContainer = document.getElementById("playlist-container");
  const statusTag = document.getElementById("statusTag");

  document.getElementById("btn-min").onclick = () => panel.style.display = "none";
  document.getElementById("btn-close").onclick = () => { if(confirm("确定退出点歌房？")) panel.style.display = "none"; };

  let isDragging = false, offsetX, offsetY;
  document.getElementById("room-header").onmousedown = (e) => { isDragging = true; offsetX = e.clientX - panel.offsetLeft; offsetY = e.clientY - panel.offsetTop; };
  document.onmousemove = (e) => { if (!isDragging) return; panel.style.left = (e.clientX - offsetX) + "px"; panel.style.top = (e.clientY - offsetY) + "px"; panel.style.right = "auto"; };
  document.onmouseup = () => { isDragging = false; };

  const getBgmUser = () => {
    const nickLink = document.querySelector('#header h1 a.l');
    return (nickLink && nickLink.innerText.trim()) || "游客";
  };

  const ws = new WebSocket(WORKER_WS);
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === "state") {
      if (!data.current) {
        titleText.textContent = "暂无播放"; userText.textContent = ""; listContainer.innerHTML = ""; audio.src = ""; return;
      }
      titleText.textContent = data.current.title;
      userText.textContent = `点歌人: ${data.current.user || '匿名'}`;
      listContainer.innerHTML = "<strong>队列:</strong>";
      data.playlist.forEach(s => {
        const item = document.createElement("div");
        item.className = "song-item";
        item.innerHTML = `<span>${s.title}</span><span class="song-user">${s.user || ''}</span>`;
        listContainer.appendChild(item);
      });
      const now = Date.now();
      if (now >= data.endsAt) { statusTag.textContent = "BUFFERING"; audio.pause(); return; }
      statusTag.textContent = "LIVE";
      if (audio.src !== data.current.url) { audio.src = data.current.url; audio.load(); }
      const target = (now - data.startedAt) / 1000;
      if (Math.abs(audio.currentTime - target) > 2) audio.currentTime = target;
      if (audio.paused) audio.play().catch(() => statusTag.textContent = "MUTED (Click!)");
    } else if (data.type === "online") {
      document.getElementById("onlineCount").textContent = `${data.count}人`;
    }
  };

  async function getNcmRealInfo(songId) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET", url: `https://music.163.com/song?id=${songId}`,
        onload: function(res) {
          const doc = new DOMParser().parseFromString(res.responseText, "text/html");
          let fullTitle = doc.querySelector("title").innerText.replace(" - 网易云音乐", "");
          GM_xmlhttpRequest({
            method: "GET", url: `https://music.163.com/song/media/outer/url?id=${songId}.mp3`,
            onload: function(response) {
              if (response.finalUrl.includes("126.net")) resolve({ title: fullTitle, url: response.finalUrl });
              else reject("无法获取有效直链");
            },
            onerror: reject
          });
        },
        onerror: reject
      });
    });
  }

  document.getElementById("addSong").onclick = async () => {
    const tI = document.getElementById("songTitle"), uI = document.getElementById("songUrl"), btn = document.getElementById("addSong");
    let inputUrl = uI.value.trim();
    if(!inputUrl) return;
    btn.disabled = true; btn.textContent = "解析中...";
    try {
      let finalUrl = inputUrl, finalTitle = tI.value.trim();
      const ncmMatch = inputUrl.match(/id=(\d+)/);
      if (inputUrl.includes("music.163.com") && ncmMatch) {
        const info = await getNcmRealInfo(ncmMatch[1]);
        finalUrl = info.url; if (!finalTitle) finalTitle = info.title;
      }
      const dur = await new Promise((res, rej) => {
        const a = new Audio(finalUrl);
        a.onloadedmetadata = () => res(a.duration);
        a.onerror = rej;
        setTimeout(rej, 12000);
      });
      ws.send(JSON.stringify({
        type: "enqueue",
        song: { id: Date.now().toString(), title: finalTitle || "未知音乐", url: finalUrl, duration: Math.ceil(dur), user: getBgmUser() }
      }));
      tI.value = ""; uI.value = "";
    } catch(e) { alert("解析失败：" + (e.message || "版权限制或链接失效")); }
    btn.disabled = false; btn.textContent = "解析并点歌";
  };

  document.getElementById("skip-link").onclick = () => ws.send(JSON.stringify({ type: "skip" }));

  setInterval(() => {
    if (audio.src && !audio.paused) {
      const cur = Math.floor(audio.currentTime), dur = Math.floor(audio.duration || 0);
      const format = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
      document.getElementById("time-info").textContent = `${format(cur)} / ${format(dur)}`;
    }
  }, 1000);
})();
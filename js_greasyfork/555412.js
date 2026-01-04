// ==UserScript==
// @name         Telegram Web – Unified Saver (Stable + Audio fixes)
// @namespace    https://nibbl.ru/
// @version      1.4
// @description  Скачивание контента с Telegram (видео фото аудио). Надёжнее определение аудио, поддержка pinned-audio, прогресс. Автор Vitaliy (Nibbl)
// @author       Vиталий (Nibbl) - https://nibbl.ru/
// @homepageURL  https://nibbl.ru/
// @supportURL   https://nibbl.ru/contact
// @match        https://web.telegram.org/*
// @match        https://webz.telegram.org/*
// @match        https://webk.telegram.org/*
// @grant        GM_download
// @grant        GM_addStyle
// @icon         https://nibbl.ru/favicon.ico
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/555412/Telegram%20Web%20%E2%80%93%20Unified%20Saver%20%28Stable%20%2B%20Audio%20fixes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555412/Telegram%20Web%20%E2%80%93%20Unified%20Saver%20%28Stable%20%2B%20Audio%20fixes%29.meta.js
// ==/UserScript==

/* === Общие стили === */
(function(){
  const css = `
  .tg-audio-download-btn {
    cursor: pointer;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-left: 6px;
    font-size: 15px;
    background: rgba(255,255,255,0.12);
    color: white;
    transition: 0.15s;
    user-select: none;
  }
  .tg-audio-download-btn:hover { background: rgba(255,255,255,0.25); }
  #tg-download-progress {
    position: fixed; bottom: 10px; right: 10px; z-index: 99999;
    background: rgba(0,0,0,0.6); padding: 8px 12px; border-radius: 8px;
    color: white; font-size: 14px;
  }`;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();

/* ===== Turbo downloader (fetch + прогресс + retry) ===== */
async function turboDownload(url, filename, onProgress) {
  const maxRetries = 5;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Response not OK " + res.status);
      const total = Number(res.headers.get("Content-Length")) || null;
      const reader = res.body.getReader();
      let received = 0;
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length || value.byteLength || 0;
        if (onProgress && total) onProgress(Math.round(received / total * 100));
      }
      const blob = new Blob(chunks);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 1000);
      return;
    } catch (e) {
      console.warn("Download attempt", attempt, "failed:", e);
      if (attempt === maxRetries) {
        console.error("Download failed after retries:", e);
        alert("Ошибка загрузки. Попробуйте снова или сохраните вручную.");
        return;
      }
      await new Promise(r => setTimeout(r, attempt * 700));
    }
  }
}

/* ===== UI прогресс ===== */
function showProgressBar() {
  if (document.getElementById("tg-download-progress")) return;
  const bar = document.createElement("div");
  bar.id = "tg-download-progress";
  bar.innerHTML = `⏳ Скачивание: <span id="tg-download-progress-value">0</span>%`;
  document.body.appendChild(bar);
}
function updateProgress(v){
  const el = document.getElementById("tg-download-progress-value");
  if (el) el.textContent = v;
}
function hideProgress(){
  const el = document.getElementById("tg-download-progress");
  if (el) el.remove();
}

/* ===== Вспомогательные функции для поиска аудио URL ===== */
function findAudioUrlFromElement(el) {
  // пытаемся получить из audio/currentSrc/source
  if (!el) return null;
  if (el.tagName === 'AUDIO') {
    if (el.currentSrc) return el.currentSrc;
    if (el.src) return el.src;
    const srcEl = el.querySelector('source');
    if (srcEl && srcEl.src) return srcEl.src;
  }
  // если элемент содержит источник в атрибутах
  if (el.dataset && (el.dataset.src || el.dataset.audioUrl)) return el.dataset.src || el.dataset.audioUrl;
  return null;
}

function findActiveAudioUrl() {
  // 1) pinned-audio -> ищем сопутствующий audio (часто бывает в другом месте, но проверим)
  const pinned = document.querySelector('.pinned-audio, .pinned-audio-wrapper, #column-center .pinned-audio');
  if (pinned) {
    // проверим внутри pinned
    let url = findAudioUrlFromElement(pinned.querySelector('audio'));
    if (url) return url;
    // иногда источник хранится в data-атрибутах на контейнере
    url = pinned.getAttribute('data-src') || pinned.dataset.src || null;
    if (url) return url;
  }

  // 2) классические аудио-плееры (Web/WebZ)
  const players = Array.from(document.querySelectorAll('audio, .audio-player audio, .audio_wrap audio, .audio-wrap audio'));
  // ищем активно воспроизводимый или с ненулевым currentTime
  for (const a of players) {
    try {
      if (a.currentSrc || a.src) {
        // если есть источник - возвращаем
        if (a.currentSrc) return a.currentSrc;
        if (a.src) return a.src;
      }
    } catch (e) { /* ignore cross-origin */ }
  }

  // 3) найти аудио-элемент у которого paused === false или currentTime > 0
  for (const a of players) {
    try {
      if (!a.paused || (a.currentTime && a.currentTime > 0)) {
        if (a.currentSrc) return a.currentSrc;
        if (a.src) return a.src;
      }
    } catch (e){ }
  }

  // 4) возможно источник в .media-player или в data-атрибутах медиа-viewer
  const mediaView = document.querySelector('.media-viewer, .media-player, .media-viewer-topbar, .media-viewer-image');
  if (mediaView) {
    const urls = [];
    const imgs = mediaView.querySelectorAll('img');
    imgs.forEach(i => i.src && urls.push(i.src));
    const vids = mediaView.querySelectorAll('video');
    vids.forEach(v => (v.currentSrc || v.src) && urls.push(v.currentSrc || v.src));
    if (urls.length) return urls[0];
  }

  // 5) последний шанс - взять любой audio с src, даже blob
  for (const a of document.querySelectorAll('audio')) {
    try {
      if (a.src) return a.src;
      if (a.currentSrc) return a.currentSrc;
    } catch (e) { }
  }

  return null;
}

/* ===== Добавление кнопки в pinned-audio и в обычные плееры ===== */
function createAudioButton(container) {
  if (!container || container.querySelector('.tg-audio-download-btn')) return;
  const btn = document.createElement('div');
  btn.className = "tg-audio-download-btn";
  btn.textContent = "↓";
  btn.title = "Скачать аудио";

  btn.onclick = async (ev) => {
    ev.stopPropagation();
    // пытаемся найти URL аудио
    const urlCandidates = [];

    // если в контейнер есть audio
    const localAudio = container.querySelector('audio');
    if (localAudio) {
      const u = localAudio.currentSrc || localAudio.src || (localAudio.querySelector('source') && localAudio.querySelector('source').src);
      if (u) urlCandidates.push(u);
    }

    // общий поиск активного аудио
    const found = findActiveAudioUrl();
    if (found) urlCandidates.push(found);

    // оставим только уникальные ненулевые
    const url = urlCandidates.find(u => !!u);
    if (!url) {
      alert('Не удалось найти ссылку на аудио. Возможно поток идёт через blob/MediaSource — сохранение может быть недоступно.');
      return;
    }

    // проверка blob
    if (url.startsWith('blob:')) {
      // попробуем скачать через fetch. Но часто blob: относится к привязке внутри страницы и не доступен извне
      try {
        showProgressBar();
        await turboDownload(url, `tg_audio_${Date.now()}.ogg`, p => updateProgress(p));
        setTimeout(hideProgress, 800);
      } catch (e) {
        hideProgress();
        alert('Не удалось скачать blob-поток напрямую. Попробуйте открыть аудио в новой вкладке и сохранить через "Сохранить как"...');
      }
      return;
    }

    // нормальный https URL — скачиваем
    const ext = url.split('?')[0].split('.').pop().split('#')[0] || 'ogg';
    const filename = `tg_audio_${Date.now()}.${ext}`;
    showProgressBar();
    await turboDownload(url, filename, p => updateProgress(p));
    setTimeout(hideProgress, 800);
  };

  // вставляем в область управления плеером
  // варианты контейнеров для WebK и Web
  const target = container.querySelector('.pinned-container-wrapper-utils, .audio-player-controls, .audio-wrap, .message-content, .audio-player-inner, .pinned-container-wrapper-utils');
  (target || container).appendChild(btn);
}

/* ===== Основной наблюдатель: мониторим DOM и добавляем кнопки ===== */
(function observeAndInsert() {
  // шорткат для селекторов которые нужно мониторить
  const playerSelectors = [
    '.pinned-audio',         // pinned player (WebK)
    '.audio-player',         // классические аудио-плееры
    '.audio-wrap',           // альтернативные оболочки
    '.media-player',         // возможно в web
  ].join(',');

  // один общий интервал, не плодим setInterval'ы
  setInterval(() => {
    // кнопка в media viewer (вверху) — уже была в твоём скрипте
    try {
      const actions = document.querySelector(".media-viewer-header, .media-viewer-topbar .media-viewer-buttons");
      if (actions && !document.getElementById("tg-dl-btn")) {
        const btn = document.createElement("button");
        btn.id = "tg-dl-btn";
        btn.textContent = "⬇ Скачать";
        btn.style = `cursor:pointer; padding:6px 10px; margin-right:6px; background:#fff2; border:1px solid #ccc; border-radius:6px;`;
        btn.onclick = () => {
          const video = document.querySelector("video");
          const img = document.querySelector(".media-viewer-image img, .media-photo img");
          const url = video?.currentSrc || video?.src || img?.src || null;
          if (!url) return alert("Не найден медиа-объект");
          const ext = (video ? 'mp4' : 'jpg');
          const filename = "telegram_download_" + Date.now() + "." + ext;
          showProgressBar();
          turboDownload(url, filename, p => updateProgress(p)).then(()=> setTimeout(hideProgress,800));
        };
        actions.prepend(btn);
      }
    } catch(e){ console.warn(e); }

    // добавляем аудио-кнопки
    try {
      const players = document.querySelectorAll(playerSelectors);
      players.forEach(p => createAudioButton(p));
    } catch(e){ console.warn(e); }

  }, 500);
})();

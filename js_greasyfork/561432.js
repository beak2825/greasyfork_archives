// ==UserScript==
// @name               YouTube Video 4K/HD Downloader✨🚀 - NO ADS🚫🌐 (EasyTube V1)
// @name:vi            Trình tải video YouTube✨ - KHÔNG QUẢNG CÁO🚫
// @name:zh-CN         YouTube 视频下载器✨ - 无广告🚫
// @name:zh-TW         YouTube 影片下載器✨ - 無廣告🚫
// @name:ru            Загрузчик видео YouTube✨ - БЕЗ РЕКЛАМЫ🚫
// @name:ja            YouTube動画ダウンローダー✨ - 広告なし🚫
// @name:ko            YouTube 동영상 다운로더✨ - 광고 없음🚫
// @name:es            Descargador de videos de YouTube✨ - SIN ANUNCIOS🚫
// @name:pt-BR         Baixador de vídeos do YouTube✨ - SEM ANÚNCIOS🚫
// @name:fr            Téléchargeur de vidéos YouTube✨ - SANS PUB🚫
// @name:de            YouTube-Video-Downloader✨ - KEINE WERBUNG🚫
// @name:it            Downloader video YouTube✨ - NIENTE PUBBLICITÀ🚫
// @name:tr            YouTube Video İndirici✨ - REKLAMSIZ🚫
// @name:pl            Pobieracz filmów z YouTube✨ - BEZ REKLAM🚫
// @name:id            Pengunduh Video YouTube✨ - TANPA IKLAN🚫
// @name:ar            مُحمّل فيديوهات YouTube✨ - بدون إعلانات🚫 & تمرير تلقائي & عرض كلاسيكي (
// @description        EasyTube helps you enhance YouTube with safe and fast video & audio downloading, auto-scroll for Shorts, and classic view — all in one panel!
// @description:vi     EasyTube giúp bạn nâng cấp trải nghiệm YouTube với trình tải video & âm thanh an toàn và nhanh, tự cuộn cho Shorts và chế độ xem cổ điển — tất cả trong một bảng điều khiển!
// @description:zh-CN  EasyTube 让你的 YouTube 体验更强：安全且快速的视频与音频下载、Shorts 自动滚动和经典视图——全都集成在一个面板里！
// @description:zh-TW  EasyTube 強化你的 YouTube 體驗：安全且快速的影片與音訊下載、Shorts 自動捲動與經典檢視——全都整合在一個面板中！
// @description:ru     EasyTube улучшает YouTube: безопасная и быстрая загрузка видео и аудио, автопрокрутка для Shorts и классический вид — всё в одной панели!
// @description:ja     EasyTubeでYouTube体験を強化：安全で高速な動画・音声ダウンロード、Shortsの自動スクロール、クラシック表示を1つのパネルに統合！
// @description:ko     EasyTube로 YouTube 경험을 업그레이드하세요: 안전하고 빠른 동영상/오디오 다운로드, Shorts 자동 스크롤, 클래식 보기까지 한 패널에!
// @description:es     EasyTube mejora tu experiencia en YouTube con descargas seguras y rápidas de video y audio, desplazamiento automático para Shorts y vista clásica, ¡todo en un solo panel!
// @description:pt-BR  EasyTube melhora sua experiência no YouTube com download seguro e rápido de vídeos e áudios, rolagem automática para Shorts e visualização clássica — tudo em um só painel!
// @description:fr     EasyTube améliore votre expérience YouTube avec un téléchargeur sûr et rapide de vidéos et d’audios, le défilement automatique pour les Shorts et la vue classique — le tout dans un seul panneau !
// @description:de     EasyTube verbessert dein YouTube-Erlebnis mit sicherem und schnellem Video- und Audio-Download, Auto-Scroll für Shorts und klassischer Ansicht — alles in einem Panel!
// @description:it     EasyTube migliora la tua esperienza su YouTube con download sicuro e veloce di video e audio, scorrimento automatico per gli Shorts e vista classica — tutto in un unico pannello!
// @description:tr     EasyTube; güvenli ve hızlı video ve ses indirme, Shorts için otomatik kaydırma ve klasik görünüm ile YouTube deneyimini geliştirir — hepsi tek panelde!
// @description:pl     EasyTube ulepsza YouTube: bezpieczne i szybkie pobieranie wideo i audio, automatyczne przewijanie Shorts oraz widok klasyczny — wszystko w jednym panelu!
// @description:id     EasyTube meningkatkan pengalaman YouTube Anda dengan pengunduh video dan audio yang aman dan cepat, gulir otomatis untuk Shorts, dan tampilan klasik — semuanya dalam satu panel!
// @description:ar     EasyTube يحسّن تجربتك على YouTube عبر تنزيل آمن وسريع للفيديو والصوت، وتمرير تلقائي لـ Shorts، وعرض كلاسيكي — كل ذلك في لوحة واحدة!

// @namespace          http://twisk.fun/EasyTube
// @version            1.0.0
// @author             sleepycat
// @match              https://*.youtube.com/*
// @grant              GM_addStyle
// @run-at             document-end
// @icon               https://github.com/helloticc/TampermonkeyProjects/blob/main/EasyTube.png?raw=true
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/561432/YouTube%20Video%204KHD%20Downloader%E2%9C%A8%F0%9F%9A%80%20-%20NO%20ADS%F0%9F%9A%AB%F0%9F%8C%90%20%28EasyTube%20V1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561432/YouTube%20Video%204KHD%20Downloader%E2%9C%A8%F0%9F%9A%80%20-%20NO%20ADS%F0%9F%9A%AB%F0%9F%8C%90%20%28EasyTube%20V1%29.meta.js
// ==/UserScript==

const FALLBACK_TITLE = 'YouTube EasyTube';
(function() {
  'use strict';

  const YT_SWITCH_SVG = '<svg class="ytHub-ytlogo" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="#FF0000" d="M23.2 7.1a3.0 3.0 0 0 0-2.1-2.1C19.2 4.5 12 4.5 12 4.5s-7.2 0-9.1.5A3.0 3.0 0 0 0.8 7.1 31.6 31.6 0 0 0 0.3 12c0 1.6.2 3.3.5 4.9a3.0 3.0 0 0 0 2.1 2.1c1.9.5 9.1.5 9.1.5s7.2 0 9.1-.5a3.0 3.0 0 0 0 2.1-2.1c.3-1.6.5-3.3.5-4.9 0-1.6-.2-3.3-.5-4.9z"/><path fill="#FFFFFF" d="M10 15.5v-7l6 3.5-6 3.5z"/></svg>';

  // for trustedtype
  const createYouTubeSvg = (cls) => {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    if (cls) svg.setAttribute('class', cls);

    const p1 = document.createElementNS(NS, 'path');
    p1.setAttribute('d', 'M23.5 6.3a3.1 3.1 0 0 0-2.2-2.2C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.3.6A3.1 3.1 0 0 0 .5 6.3 32.7 32.7 0 0 0 0 12a32.7 32.7 0 0 0 .5 5.7 3.1 3.1 0 0 0 2.2 2.2c1.9.6 9.3.6 9.3.6s7.4 0 9.3-.6a3.1 3.1 0 0 0 2.2-2.2A32.7 32.7 0 0 0 24 12a32.7 32.7 0 0 0-.5-5.7Z');
    p1.setAttribute('fill', '#FF0000');

    const p2 = document.createElementNS(NS, 'path');
    p2.setAttribute('d', 'M9.75 15.5V8.5L16 12l-6.25 3.5Z');
    p2.setAttribute('fill', '#FFFFFF');

    svg.appendChild(p1);
    svg.appendChild(p2);
    return svg;
  };

  const makeMacSwitch = (id) => {
    const btn = document.createElement('button');
    btn.className = 'ytHub-switch';
    btn.id = id;
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    // Build thumb + SVG without innerHTML (Trusted Types safe)
    const thumb = document.createElement('span');
    thumb.className = 'ytHub-thumb';
    thumb.setAttribute('aria-hidden', 'true');
    btn.appendChild(thumb);
    return btn;
  };
  const CONFIG = {
    panelId: 'ytHubPanel',
    toggleId: 'ytHubToggle',
    downloadUrl: '//evdfrance.fr//convert/?id=',
    supportUrl: 'https://twisk.fun/discord',
    shortsWheelDelta: 1200,
    shortsScrollPower: 900,
  };
  const styles = `
    #${CONFIG.panelId}, #${CONFIG.panelId} * { box-sizing: border-box; }
    #${CONFIG.toggleId} {
      position: fixed;
      bottom: 96px;
      right: 20px;
      width: 60px;
      height: 40px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(255, 255, 255, 0.22);
      box-shadow: 0 10px 26px rgba(0,0,0,0.22);
      z-index: 99998;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(18px) saturate(180%);
      -webkit-backdrop-filter: blur(18px) saturate(180%);
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    }
    #${CONFIG.toggleId}:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 34px rgba(0,0,0,0.28);
      background: rgba(255, 255, 255, 0.22);
    }
    #${CONFIG.toggleId}:active { transform: translateY(0) scale(0.98); }
    .ytHub-toggle-icon {
      font-size: 18px;
      color: rgba(15,15,15,0.92);
      transition: transform 0.22s ease;
      user-select: none;
    }
    .ytHub-toggle-icon svg {
      width: 20px;
      height: 20px;
      display: block;
    }
    #${CONFIG.toggleId}.active .ytHub-toggle-icon { transform: rotate(180deg); }
    #${CONFIG.panelId} {
      position: fixed;
      top: 0px;
      left: 0px;
      right: auto;
      bottom: auto;
      width: 360px;
      max-width: 92vw;
      max-height: min(520px, calc(100vh - 220px));
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 28px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28);
      z-index: 99999;
      font-family: "Roboto", "YouTube Sans", Arial, sans-serif;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      will-change: transform, opacity;
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      transform: translateY(30px);
    }
    #${CONFIG.panelId}.show {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }
    #${CONFIG.panelId}.dragging { transition: none !important; }
    .ytHub-header {
      background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
      padding: 14px 16px;
      cursor: move;
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      border-top-left-radius: 28px;
      border-top-right-radius: 28px;
      flex: 0 0 auto;
    }
    .ytHub-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.12) 100%);
      pointer-events: none;
    }
    .ytHub-logo-container {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
      z-index: 1;
    }
    .ytHub-logo {
      width: 54px;
      height: 36px;
      background: #ff0000;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: bold;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(255,0,0,0.3);
    }
    .ytHub-title-wrapper { display: flex; flex-direction: column; }
    .ytHub-title {
      color: #ffffff;
      font-size: 17px;
      font-weight: 600;
      letter-spacing: 0.2px;
      line-height: 1.2;
    }
    .ytHub-subtitle {
      color: rgba(255,255,255,0.85);
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.3px;
    }
    .ytHub-drag-icon {
      color: rgba(255,255,255,0.92);
      font-size: 24px;
      cursor: move;
      line-height: 1;
      position: relative;
      z-index: 1;
    }
    .ytHub-content {
      padding: 14px 16px 16px 16px;
      background: transparent;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      flex: 1 1 auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.35) transparent;
    }
    .ytHub-content::-webkit-scrollbar { width: 10px; }
    .ytHub-content::-webkit-scrollbar-track { background: transparent; }
    .ytHub-content::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.28);
      border-radius: 999px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    .ytHub-content::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.40);
      border: 2px solid transparent;
      background-clip: padding-box;
    }
    .ytHub-video-card {
      background: rgba(255, 255, 255, 0.25);
      border-radius: 22px;
      padding: 14px;
      margin-bottom: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.2s ease;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    .ytHub-video-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    .ytHub-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .ytHub-info-label {
      font-size: 11px;
      color: #505050;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.8px;
    }
    .ytHub-status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #00a152;
      background: rgba(232, 245, 233, 0.9);
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 500;
    }
    .ytHub-status-dot {
      width: 6px;
      height: 6px;
      background: #00a152;
      border-radius: 50%;
    }
    .ytHub-video-title {
      font-size: 15px;
      color: #0f0f0f;
      font-weight: 600;
      line-height: 1.45;
      margin-bottom: 10px;
      word-break: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    .ytHub-video-id-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .ytHub-id-label {
      font-size: 11px;
      color: #505050;
      font-weight: 600;
    }
    .ytHub-video-id {
      font-size: 12px;
      color: #0f0f0f;
      font-family: 'Consolas', 'Courier New', monospace;
      background: rgba(255, 255, 255, 0.7);
      padding: 5px 12px;
      border-radius: 20px;
      font-weight: 500;
    }
    .ytHub-buttons {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .ytHub-button {
      width: 100%;
      padding: 14px 18px;
      border: none;
      border-radius: 22px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
      color: #ffffff;
      position: relative;
      overflow: hidden;
      letter-spacing: 0.3px;
    }
    .ytHub-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.18);
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .ytHub-button:hover::before { opacity: 1; }
    .ytHub-button:hover { transform: translateY(-2px); }
    .ytHub-button:active { transform: translateY(0); }
    .ytHub-download {
      background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
      box-shadow: 0 4px 14px rgba(255,0,0,0.3);
    }
    .ytHub-download:hover { box-shadow: 0 8px 20px rgba(255,0,0,0.4); }
    .ytHub-like {
      background: linear-gradient(135deg, #ff4d6d 0%, #d81b60 100%);
      box-shadow: 0 4px 14px rgba(216,27,96,0.25);
    }
    .ytHub-like:hover { box-shadow: 0 8px 20px rgba(216,27,96,0.33); }
    .ytHub-autoscroll {
      background: linear-gradient(135deg, #222 0%, #111 100%);
      box-shadow: 0 4px 14px rgba(0,0,0,0.28);
    }
    .ytHub-autoscroll:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.36); }
    .ytHub-autoscroll.on {
      background: linear-gradient(135deg, #00a152 0%, #007a3d 100%);
      box-shadow: 0 4px 14px rgba(0,161,82,0.25);
    }

.ytHub-ram {
  background: linear-gradient(135deg, #ff9800 0%, #e65100 100%);
  box-shadow: 0 4px 14px rgba(255,152,0,0.25);
}
.ytHub-ram:hover { box-shadow: 0 8px 20px rgba(255,152,0,0.35); }
.ytHub-ram.on {
  background: linear-gradient(135deg, #00a152 0%, #007a3d 100%);
  box-shadow: 0 4px 14px rgba(0,161,82,0.25);
}

    .ytHub-toggle-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 6px;
      margin-bottom: 2px;
    }
    .ytHub-row {
      width: 100%;
      padding: 12px 12px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.18);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .ytHub-row:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); transform: translateY(-1px); }
    .ytHub-row-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .ytHub-row-icon {
      width: 34px;
      height: 34px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      background: rgba(255,255,255,0.55);
      flex: 0 0 auto;
    }
    .ytHub-row-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .ytHub-row-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f0f0f;
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ytHub-row-sub {
      font-size: 11px;
      color: rgba(15,15,15,0.72);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ytHub-row-status {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: rgba(15,15,15,0.65);
      margin-right: 8px;
      min-width: 36px;
      text-align: right;
    }
    .ytHub-switch {
      width: 46px;
      height: 28px;
      border-radius: 999px;
      border: none;
      background: rgba(120,120,128,0.24);
      position: relative;
      cursor: pointer;
      flex: 0 0 auto;
      box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
      transition: background 0.18s ease;
    }
    .ytHub-switch .ytHub-thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      border-radius: 999px;
      background: #ffffff;
      box-shadow: 0 6px 14px rgba(0,0,0,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.18s ease;
      overflow: hidden;
    }
    .ytHub-ytlogo { width: 14px; height: 14px; display: block; }
    .ytHub-switch.on { background: rgba(52,199,89,0.95); }
    .ytHub-switch.on .ytHub-thumb { transform: translateX(18px); }

    .ytHub-support {
      background: linear-gradient(135deg, #065fd4 0%, #0448a3 100%);
      box-shadow: 0 4px 14px rgba(6,95,212,0.3);
    }
    .ytHub-support:hover { box-shadow: 0 8px 20px rgba(6,95,212,0.4); }
    .ytHub-disabled {
      opacity: 0.5;
      cursor: not-allowed !important;
      pointer-events: none;
    }
    .ytHub-icon {
      font-size: 20px;
      display: flex;
      align-items: center;
    }
    .ytHub-footer {
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.15);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
      border-bottom-left-radius: 28px;
      border-bottom-right-radius: 28px;
      flex: 0 0 auto;
    }
    .ytHub-footer-text {
      font-size: 11px;
      color: #505050;
      line-height: 1.4;
      font-weight: 400;
    }
  `;
  GM_addStyle(styles);
  class YouTubeHub {
    constructor() {
      this.panel = null;
      this.toggle = null;
      this.isVisible = false;
      this.isDragging = false;
      this.currentX = 0;
      this.currentY = 0;
      this.initialX = 0;
      this.initialY = 0;
      this.xOffset = 0;
      this.yOffset = 0;
      this.autoScrollEnabled = false;
      this.ramOptimizeEnabled = false;
      this._autoScrollTimer = null;
      this._lastShortsId = null;
    }
    init() {
      this.createToggleButton();
      this.createPanel();
      this.attachEventListeners();
      this.observePageChanges();
      setInterval(() => this.updateVideoInfo(), 1500);
      setInterval(() => this.autoScrollTick(), 700);
    }
    createToggleButton() {
      const existing = document.getElementById(CONFIG.toggleId);
      if (existing) { this.toggle = existing; return; }
      const toggle = document.createElement('div');
      toggle.id = CONFIG.toggleId;
      const icon = document.createElement('div');
      icon.className = 'ytHub-toggle-icon';
      icon.appendChild(createYouTubeSvg('ytHub-yt-svg'));
      toggle.appendChild(icon);
      document.body.appendChild(toggle);
      this.toggle = toggle;
      toggle.addEventListener('click', () => this.togglePanel());
    }
    togglePanel() {
      this.isVisible = !this.isVisible;

      // Re-bind panel/toggle after SPA navigations
      if (!this.panel) this.panel = document.getElementById(CONFIG.panelId);
      if (!this.toggle) this.toggle = document.getElementById(CONFIG.toggleId);
      if (!this.panel) { this.createPanel(); }
      if (!this.panel) return;
      if (this.isVisible) {
        this.panel.classList.add('show');
        this.toggle.classList.add('active');
      } else {
        this.panel.classList.remove('show');
        this.toggle.classList.remove('active');
      }
    }
    createPanel() {
      const existingPanel = document.getElementById(CONFIG.panelId);
      if (existingPanel) { this.panel = existingPanel; return; }
      const panel = document.createElement('div');
      panel.id = CONFIG.panelId;
      const header = document.createElement('div');
      header.className = 'ytHub-header';
      const logoContainer = document.createElement('div');
      logoContainer.className = 'ytHub-logo-container';
      const logo = document.createElement('div');
      logo.className = 'ytHub-logo';
      logo.textContent = '▶';
      const titleWrapper = document.createElement('div');
      titleWrapper.className = 'ytHub-title-wrapper';
      const title = document.createElement('div');
      title.className = 'ytHub-title';
      title.textContent = 'EasyTube by Mint';
      const subtitle = document.createElement('div');
      subtitle.className = 'ytHub-subtitle';
      subtitle.textContent = 'Improve your YouTube performance';
      titleWrapper.appendChild(title);
      titleWrapper.appendChild(subtitle);
      logoContainer.appendChild(logo);
      logoContainer.appendChild(titleWrapper);
      const dragIcon = document.createElement('div');
      dragIcon.className = 'ytHub-drag-icon';
      dragIcon.textContent = '⋮';
      header.appendChild(logoContainer);
      header.appendChild(dragIcon);
      const content = document.createElement('div');
      content.className = 'ytHub-content';
      const videoCard = document.createElement('div');
      videoCard.className = 'ytHub-video-card';
      const cardHeader = document.createElement('div');
      cardHeader.className = 'ytHub-card-header';
      const infoLabel = document.createElement('div');
      infoLabel.className = 'ytHub-info-label';
      infoLabel.textContent = 'CURRENT VIDEO';
      const statusBadge = document.createElement('div');
      statusBadge.className = 'ytHub-status-badge';
      const statusDot = document.createElement('div');
      statusDot.className = 'ytHub-status-dot';
      const statusText = document.createElement('span');
      statusText.textContent = 'Ready';
      statusBadge.appendChild(statusDot);
      statusBadge.appendChild(statusText);
      cardHeader.appendChild(infoLabel);
      cardHeader.appendChild(statusBadge);
      const videoTitle = document.createElement('div');
      videoTitle.className = 'ytHub-video-title';
      videoTitle.textContent = 'This type of videos isn\'t supported yet.';
      videoTitle.id = 'ytHubVideoTitle';
      const videoIdWrapper = document.createElement('div');
      videoIdWrapper.className = 'ytHub-video-id-wrapper';
      const idLabel = document.createElement('div');
      idLabel.className = 'ytHub-id-label';
      idLabel.textContent = 'VIDEO ID:';
      const videoId = document.createElement('div');
      videoId.className = 'ytHub-video-id';
      videoId.textContent = 'N/A';
      videoId.id = 'ytHubVideoId';
      videoIdWrapper.appendChild(idLabel);
      videoIdWrapper.appendChild(videoId);
      videoCard.appendChild(cardHeader);
      videoCard.appendChild(videoTitle);
      videoCard.appendChild(videoIdWrapper);
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'ytHub-buttons';
      const downloadBtn = document.createElement('a');
      downloadBtn.href = '#';
      downloadBtn.className = 'ytHub-button ytHub-download';
      downloadBtn.id = 'ytHubDownloadBtn';
      const downloadIcon = document.createElement('span');
      downloadIcon.className = 'ytHub-icon';
      downloadIcon.textContent = '⬇';
      const downloadText = document.createElement('span');
      downloadText.textContent = 'Download Video';
      downloadBtn.appendChild(downloadIcon);
      downloadBtn.appendChild(downloadText);
      const likeBtn = document.createElement('a');
      likeBtn.href = '#';
      likeBtn.className = 'ytHub-button ytHub-like';
      likeBtn.id = 'ytHubLikeBtn';
      const likeIcon = document.createElement('span');
      likeIcon.className = 'ytHub-icon';
      likeIcon.textContent = '👍';
      const likeText = document.createElement('span');
      likeText.textContent = 'Like This Video';
      likeBtn.appendChild(likeIcon);
      likeBtn.appendChild(likeText);
const toggleList = document.createElement('div');
toggleList.className = 'ytHub-toggle-list';

const autoRow = document.createElement('div');
autoRow.className = 'ytHub-row';
const autoLeft = document.createElement('div');
autoLeft.className = 'ytHub-row-left';
const autoRowIcon = document.createElement('div');
autoRowIcon.className = 'ytHub-row-icon';
autoRowIcon.textContent = '⬇';
const autoTextWrap = document.createElement('div');
autoTextWrap.className = 'ytHub-row-text';
const autoTitle = document.createElement('div');
autoTitle.className = 'ytHub-row-title';
autoTitle.textContent = 'Auto-Scroll (Shorts)';
const autoSub = document.createElement('div');
autoSub.className = 'ytHub-row-sub';
autoSub.textContent = 'Auto-advance Shorts every few seconds';
autoTextWrap.appendChild(autoTitle);
autoTextWrap.appendChild(autoSub);
autoLeft.appendChild(autoRowIcon);
autoLeft.appendChild(autoTextWrap);

const autoRight = document.createElement('div');
autoRight.style.display = 'flex';
autoRight.style.alignItems = 'center';
const autoStatus = document.createElement('div');
autoStatus.className = 'ytHub-row-status';
autoStatus.id = 'ytHubAutoScrollStatus';
autoStatus.textContent = 'OFF';
const autoSwitch = makeMacSwitch('ytHubAutoScrollSwitch');
autoRight.appendChild(autoStatus);
autoRight.appendChild(autoSwitch);

autoRow.appendChild(autoLeft);
autoRow.appendChild(autoRight);
toggleList.appendChild(autoRow);


const ramRow = document.createElement('div');
ramRow.className = 'ytHub-row';
const ramLeft = document.createElement('div');
ramLeft.className = 'ytHub-row-left';
const ramRowIcon = document.createElement('div');
ramRowIcon.className = 'ytHub-row-icon';
ramRowIcon.textContent = '🧹';
const ramTextWrap = document.createElement('div');
ramTextWrap.className = 'ytHub-row-text';
const ramTitle = document.createElement('div');
ramTitle.className = 'ytHub-row-title';
ramTitle.textContent = 'Classic View';
const ramSub = document.createElement('div');
ramSub.className = 'ytHub-row-sub';
ramSub.textContent = 'Hide comments/sidebar to reduce RAM';
ramTextWrap.appendChild(ramTitle);
ramTextWrap.appendChild(ramSub);
ramLeft.appendChild(ramRowIcon);
ramLeft.appendChild(ramTextWrap);

const ramRight = document.createElement('div');
ramRight.style.display = 'flex';
ramRight.style.alignItems = 'center';
const ramStatus = document.createElement('div');
ramStatus.className = 'ytHub-row-status';
ramStatus.id = 'ytHubRamStatus';
ramStatus.textContent = 'OFF';
const ramSwitch = makeMacSwitch('ytHubRamSwitch');
ramSwitch.setAttribute('aria-pressed', 'false');

ramRight.appendChild(ramStatus);
ramRight.appendChild(ramSwitch);

ramRow.appendChild(ramLeft);
ramRow.appendChild(ramRight);
toggleList.appendChild(ramRow);
      const supportBtn = document.createElement('a');
      supportBtn.href = CONFIG.supportUrl;
      supportBtn.target = '_blank';
      supportBtn.rel = 'noopener noreferrer';
      supportBtn.className = 'ytHub-button ytHub-support';
      const supportIcon = document.createElement('span');
      supportIcon.className = 'ytHub-icon';
      supportIcon.textContent = '💬';
      const supportText = document.createElement('span');
      supportText.textContent = 'Join our community/Report a bug';
      supportBtn.appendChild(supportIcon);
      supportBtn.appendChild(supportText);
      buttonsContainer.appendChild(downloadBtn);
      buttonsContainer.appendChild(likeBtn);
      buttonsContainer.appendChild(toggleList);
      buttonsContainer.appendChild(supportBtn);
      content.appendChild(videoCard);
      content.appendChild(buttonsContainer);
      const footer = document.createElement('div');
      footer.className = 'ytHub-footer';
      const footerText = document.createElement('div');
      footerText.className = 'ytHub-footer-text';
      footerText.textContent = '© EasyTube by Mint • Fast & Secure';
      footer.appendChild(footerText);
      panel.appendChild(header);
      panel.appendChild(content);
      panel.appendChild(footer);
      document.body.appendChild(panel);
      this.panel = panel;

      // Use top-left coordinate system for dragging (so X movement works even if the panel was originally anchored with right/bottom)
      panel.style.left = '0px';
      panel.style.top = '0px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';

      // Default position near bottom-right (similar to old layout)
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pw = panel.offsetWidth || 360;
      const ph = panel.offsetHeight || 320;
      const maxX = Math.max(8, vw - pw - 8);
      const maxY = Math.max(8, vh - ph - 8);
      const defaultX = Math.max(8, Math.min(maxX, vw - pw - 20));
      const defaultY = Math.max(8, Math.min(maxY, vh - ph - 170));

      this.xOffset = defaultX;
      this.yOffset = defaultY;
      this.currentX = defaultX;
      this.currentY = defaultY;
      this.setTranslate(defaultX, defaultY);
      this.updateVideoInfo();
      this.syncAutoScrollUi();
      this.applyRamOptimize(this.ramOptimizeEnabled);
      this.syncRamUi();
    }
    attachEventListeners() {
      const header = this.panel.querySelector('.ytHub-header');
      // Use Pointer Events + attach move/up listeners only while dragging (less lag)
      this._boundDragStart = this.dragStart.bind(this);
      this._boundDragMove  = this.drag.bind(this);
      this._boundDragEnd   = this.dragEnd.bind(this);

      header.addEventListener('pointerdown', this._boundDragStart, { passive: false });
      const downloadBtn = document.getElementById('ytHubDownloadBtn');
      downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const videoId = this.extractVideoId(window.location.href);
        if (videoId) window.open(`${CONFIG.downloadUrl}${videoId}`, '_blank');
      });
      const likeBtn = document.getElementById('ytHubLikeBtn');
      likeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.clickLikeButtonOnce();
      });
      const autoSwitch = document.getElementById('ytHubAutoScrollSwitch');
      autoSwitch.addEventListener('click', (e) => {
        e.preventDefault();
        this.autoScrollEnabled = !this.autoScrollEnabled;
        this.resetAutoScrollTimer(true);
        this.syncAutoScrollUi();
      });


const ramSwitch = document.getElementById('ytHubRamSwitch');
ramSwitch.addEventListener('click', (e) => {
  e.preventDefault();
  this.ramOptimizeEnabled = !this.ramOptimizeEnabled;
  this.applyRamOptimize(this.ramOptimizeEnabled);
  this.syncRamUi();
});
    }
    dragStart(e) {
      if (!e || !e.target || !e.target.closest('.ytHub-header')) return;
      e.preventDefault();

      // Re-bind in case YouTube SPA replaced the DOM
      this.panel = this.panel || document.getElementById(CONFIG.panelId);
      if (!this.panel) return;

      this.isDragging = true;
      this.panel.classList.add('dragging');

      // Ensure we are positioned from the top-left; otherwise translateX may appear "locked" when right/bottom anchoring is active.
      this.panel.style.left = '0px';
      this.panel.style.top = '0px';
      this.panel.style.right = 'auto';
      this.panel.style.bottom = 'auto';

      // Cache panel size to avoid layout reads on every frame (smoother)
      const rect = this.panel.getBoundingClientRect();
      this._panelW = rect.width;
      this._panelH = rect.height;

      // Pointer capture for smoother dragging
      try {
        const header = this.panel.querySelector('.ytHub-header');
        if (header && typeof header.setPointerCapture === 'function' && e.pointerId != null) {
          header.setPointerCapture(e.pointerId);
        }
      } catch (_) {}

      // Store active pointer
      this._activePointerId = (e && typeof e.pointerId === 'number') ? e.pointerId : null;

      // Track both axes
      this.initialX = e.clientX - this.xOffset;
      this.initialY = e.clientY - this.yOffset;
      this._nextX = this.xOffset || 0;
      this._nextY = this.yOffset || 0;

      window.addEventListener('pointermove', this._boundDragMove, { passive: false });
      window.addEventListener('pointerup', this._boundDragEnd, { passive: true });
      window.addEventListener('pointercancel', this._boundDragEnd, { passive: true });
    }
    drag(e) {
      if (!this.isDragging) return;
      if (this._activePointerId != null && e.pointerId !== this._activePointerId) return;
      e.preventDefault();

      // Track both axes
      this._nextX = e.clientX - this.initialX;
      this._nextY = e.clientY - this.initialY;

      if (this._rafPending) return;
      this._rafPending = true;

      requestAnimationFrame(() => {
        if (!this.panel) { this._rafPending = false; return; }

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const maxX = vw - (this._panelW || this.panel.offsetWidth || 0) - 8;
        const maxY = vh - (this._panelH || this.panel.offsetHeight || 0) - 8;

        this.currentX = Math.max(8, Math.min(maxX, this._nextX));
        this.currentY = Math.max(8, Math.min(maxY, this._nextY));

        // Persist offsets
        this.xOffset = this.currentX;
        this.yOffset = this.currentY;

        this.setTranslate(this.currentX, this.currentY);
        this._rafPending = false;
      });
    }
    dragEnd(e) {
      if (!this.isDragging) return;
      if (e && this._activePointerId != null && e.pointerId !== this._activePointerId) return;

      this.initialX = this.currentX;
      this.initialY = this.currentY;
      this.isDragging = false;

      // Release pointer capture (if any)
      try {
        const header = this.panel && this.panel.querySelector('.ytHub-header');
        if (header && typeof header.releasePointerCapture === 'function' && e && e.pointerId != null) {
          header.releasePointerCapture(e.pointerId);
        }
      } catch (_) {}

      if (this.panel) this.panel.classList.remove('dragging');

      window.removeEventListener('pointermove', this._boundDragMove);
      window.removeEventListener('pointerup', this._boundDragEnd);
      window.removeEventListener('pointercancel', this._boundDragEnd);

      this._activePointerId = null;
    }
    setTranslate(xPos, yPos) {
      this.panel.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
    extractVideoId(url) {
      const patterns = [
        /[?&]v=([^&#]*)/,
        /youtu\.be\/([^?&#]*)/,
        /embed\/([^?&#]*)/,
        /shorts\/([^?&#]*)/
      ];
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1] && match[1].length === 11) return match[1];
      }
      return null;
    }
    getVideoTitle() {
      const isShorts = window.location.pathname.startsWith('/shorts/');
      if (isShorts) {
        const activeReel =
          document.querySelector('ytd-reel-video-renderer[is-active]') ||
          document.querySelector('ytd-reel-video-renderer') ||
          document;
        const shortsSelectors = [
          'h2 span.yt-core-attributed-string[role="text"]',
          'h2.ytd-reel-player-header-renderer span.yt-core-attributed-string[role="text"]',
          'ytd-reel-player-header-renderer h2 span[role="text"]',
          'ytd-reel-player-header-renderer span.yt-core-attributed-string[role="text"]'
        ];
        for (const sel of shortsSelectors) {
          const el = activeReel.querySelector(sel);
          const text = el?.textContent?.trim();
          if (text && text.length > 1 && !this.isBadTitle(text)) return text;
        }
        const doc = document.title?.replace(/\s*-\s*YouTube\s*$/i, '').trim();
        if (doc && doc.length > 1 && !this.isBadTitle(doc)) return doc;
        return "This type of videos isn't supported yet.";
      }
      const selectors = [
        'ytd-watch-metadata h1 yt-formatted-string',
        'h1.ytd-watch-metadata yt-formatted-string',
        '#title h1 yt-formatted-string'
      ];
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        const text = el?.textContent?.trim();
        if (text && text.length > 1 && !this.isBadTitle(text)) return text;
      }
      const doc = document.title?.replace(/\s*-\s*YouTube\s*$/i, '').trim();
      if (doc && doc.length > 1 && !this.isBadTitle(doc)) return doc;
      return "This type of videos isn't supported yet.";
    }
    isBadTitle(text) {
      const bad = [
        'Bỏ qua điều hướng', 'Skip navigation',
        'Trang chủ', 'Home',
        'Đăng ký', 'Subscribe'
      ];
      if (bad.includes(text)) return true;
      if (text.length < 2) return true;
      return false;
    }
    updateVideoInfo() {
      const videoId = this.extractVideoId(window.location.href);
      const titleElement = document.getElementById('ytHubVideoTitle');
      const idElement = document.getElementById('ytHubVideoId');
      const downloadBtn = document.getElementById('ytHubDownloadBtn');
      if (!videoId) {
        if (titleElement) titleElement.textContent = FALLBACK_TITLE;
        if (idElement) idElement.textContent = 'N/A';
        if (downloadBtn) downloadBtn.classList.add('ytHub-disabled');
        return;
      }
      const videoTitle = this.getVideoTitle();
      if (titleElement) titleElement.textContent = videoTitle;
      if (idElement) idElement.textContent = videoId;
      if (downloadBtn) downloadBtn.classList.remove('ytHub-disabled');
    }
    observePageChanges() {
      let lastUrl = location.href;
      const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          setTimeout(() => this.updateVideoInfo(), 500);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.addEventListener('yt-navigate-finish', () => {
        setTimeout(() => this.updateVideoInfo(), 500);
      });
    }
    syncAutoScrollUi() {
      const sw = document.getElementById('ytHubAutoScrollSwitch');
      const st = document.getElementById('ytHubAutoScrollStatus');
      if (sw) {
        sw.classList.toggle('on', !!this.autoScrollEnabled);
        sw.setAttribute('aria-pressed', this.autoScrollEnabled ? 'true' : 'false');
      }
      if (st) st.textContent = this.autoScrollEnabled ? 'ON' : 'OFF';
    }


syncRamUi() {
  const sw = document.getElementById('ytHubRamSwitch');
  const st = document.getElementById('ytHubRamStatus');
  if (sw) {
    sw.classList.toggle('on', !!this.ramOptimizeEnabled);
    sw.setAttribute('aria-pressed', this.ramOptimizeEnabled ? 'true' : 'false');
  }
  if (st) st.textContent = this.ramOptimizeEnabled ? 'ON' : 'OFF';
}

applyRamOptimize(on) {
  const styleId = 'ytHubRamOptimizeStyle';
  let styleEl = document.getElementById(styleId);
  if (!on) {
    if (styleEl) styleEl.remove();
    return;
  }
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      /* Hide heavy sections to reduce DOM work/memory */
      #comments, ytd-comments, ytd-comments-header-renderer { display: none !important; }
      #secondary, ytd-watch-next-secondary-results-renderer { display: none !important; }
      ytd-live-chat-frame, #chat, #chatframe, ytd-live-chat-renderer { display: none !important; }
      ytd-merch-shelf-renderer, ytd-engagement-panel-section-list-renderer { display: none !important; }
      /* Stop hover previews where possible */
      ytd-rich-item-renderer video, ytd-video-preview video { display: none !important; }
    `;
    document.documentElement.appendChild(styleEl);
  }

  // Best-effort: unload thumbnails by forcing lazy loading
  try {
    document.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    });
  } catch (e) {}

  // Best-effort: pause any offscreen videos/previews (won't affect the main player)
  try {
    const main = document.querySelector('video.html5-main-video');
    document.querySelectorAll('video').forEach(v => {
      if (main && v === main) return;
      if (!v.paused) v.pause();
      v.removeAttribute('src');
      v.load?.();
    });
  } catch (e) {}
}

    resetAutoScrollTimer(immediate) {
      if (this._autoScrollTimer) {
        clearTimeout(this._autoScrollTimer);
        this._autoScrollTimer = null;
      }
      if (!this.autoScrollEnabled) return;
      const delay = immediate ? 0 : (3000 + Math.floor(Math.random() * 2001));
      this._autoScrollTimer = setTimeout(() => {
        this.tryAdvanceShorts();
        this.resetAutoScrollTimer(false);
      }, delay);
    }
    autoScrollTick() {
      const isShorts = location.pathname.startsWith('/shorts/');
      if (!this.autoScrollEnabled || !isShorts) {
        if (this._autoScrollTimer) {
          clearTimeout(this._autoScrollTimer);
          this._autoScrollTimer = null;
        }
        this._lastShortsId = null;
        return;
      }
      const id = this.extractVideoId(location.href) || '';
      if (id && id !== this._lastShortsId) {
        this._lastShortsId = id;
        this.resetAutoScrollTimer(false);
      }
      if (!this._autoScrollTimer) this.resetAutoScrollTimer(false);
    }
    tryAdvanceShorts() {
  if (!location.pathname.startsWith('/shorts/')) return;
  const root =
    document.querySelector('ytd-reel-video-renderer[is-active]') ||
    document.querySelector('ytd-reel-video-renderer') ||
    document;
  const candidates = [
    document.querySelector('ytd-reel-player-overlay-renderer #navigation-button-down'),
    document.querySelector('ytd-reel-player-overlay-renderer [id="navigation-button-down"]'),
    document.querySelector('tp-yt-paper-icon-button#navigation-button-down'),
    document.querySelector('button[aria-label*="Next"]'),
    document.querySelector('button[aria-label*="Tiếp"]'),
    document.querySelector('tp-yt-paper-icon-button[aria-label*="Next"]'),
    document.querySelector('tp-yt-paper-icon-button[aria-label*="Tiếp"]')
  ].filter(Boolean);
  const fill =
    document.querySelector('#navigation-button-down .yt-spec-touch-feedback-shape__fill') ||
    document.querySelector('.yt-spec-touch-feedback-shape__fill');
  if (fill) candidates.unshift(fill);
  for (const el of candidates) {
    if (fireRealClick(el)) return;
  }
  const wheelTarget =
    root.querySelector('#shorts-player') ||
    root.querySelector('ytd-reel-player-renderer') ||
    root;
  wheelTarget.dispatchEvent(new WheelEvent('wheel', {
    bubbles: true,
    cancelable: true,
    deltaY: CONFIG.shortsWheelDelta
  }));
  window.scrollBy({ top: CONFIG.shortsScrollPower, left: 0, behavior: 'smooth' });
  const ev = new KeyboardEvent('keydown', { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40, bubbles: true });
  document.dispatchEvent(ev);
}
clickLikeButtonOnce() {
  const pickFrom = (root) => {
    const buttons = Array.from(root.querySelectorAll('button[aria-label]'));
    const likeBtns = buttons.filter(b => {
      const a = (b.getAttribute('aria-label') || '').toLowerCase();
      return a.includes('like') || a.includes('thích');
    });
    return likeBtns[0] || null;
  };
  const tryWatchPage = () => {
    const root =
      document.querySelector('ytd-watch-metadata') ||
      document.querySelector('#top-level-buttons-computed') ||
      document;
    let btn = pickFrom(root) || pickFrom(document);
    if (!btn) {
      const maybe = document.querySelector('ytd-segmented-like-dislike-button-renderer button') ||
                    document.querySelector('ytd-toggle-button-renderer button') ||
                    null;
      btn = maybe || btn;
    }
    if (btn) btn.click();
  };
  const tryShorts = () => {
    const active =
      document.querySelector('ytd-reel-video-renderer[is-active]') ||
      document.querySelector('ytd-reel-video-renderer') ||
      document;
    let btn = pickFrom(active) || pickFrom(document);
    if (!btn) {
      const candidate = active.querySelector('button') || null;
      btn = candidate || btn;
    }
    if (btn) btn.click();
  };
  if (location.pathname.startsWith('/shorts/')) tryShorts();
  else tryWatchPage();
}
  }
function fireRealClick(el) {
  if (!el) return false;
  const clickable =
    el.closest('button, tp-yt-paper-icon-button, a, ytd-button-renderer, yt-button-shape') || el;
  const rect = clickable.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  clickable.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'mouse', clientX: x, clientY: y }));
  clickable.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
  clickable.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
  clickable.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
  return true;
}
  function initialize() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => { const hub = new YouTubeHub(); hub.init(); }, 1000);
      });
    } else {
      setTimeout(() => { const hub = new YouTubeHub(); hub.init(); }, 1000);
    }
  }
  initialize();
})();

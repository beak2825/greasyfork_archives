// ==UserScript==
// @name         Universal Media Downloader - Local Server (YouTube, TikTok, Instagram + All Sites)
// @name:pt-BR   Universal Media Downloader - Servidor Local (YouTube, TikTok, Instagram + Todos os sites)
// @name:es      Universal Media Downloader - Servidor Local (YouTube, TikTok, Instagram + Todos los sitios)
// @name:fr      Universal Media Downloader - Serveur Local (YouTube, TikTok, Instagram + Tous les sites)
// @name:de      Universal Media Downloader - Lokaler Server (YouTube, TikTok, Instagram + Alle Seiten)
// @name:it      Universal Media Downloader - Server Locale (YouTube, TikTok, Instagram + Tutti i siti)
// @name:ru      Universal Media Downloader - Локальный Сервер (YouTube, TikTok, Instagram + Все сайты)
// @name:zh-CN   Universal Media Downloader - 本地服务器 (YouTube, TikTok, Instagram + 所有网站)
// @name:ja      Universal Media Downloader - ローカルサーバー (YouTube, TikTok, Instagram + すべてのサイト)
// @name:ko      Universal Media Downloader - 로컬 서버 (YouTube, TikTok, Instagram + 모든 사이트)
// @namespace    http://tampermonkey.net/
// @version      1.11.6
// @description  Universal media downloader via Local Server. Supports YouTube, Instagram, TikTok, and all websites. Features: Audio/Video/Image via Shortcuts, Batch Download, Smart Grabber, Auto Screenshot, High Quality (1080p/4k), No Ads.
// @description:pt-BR Downloader de mídia universal via Servidor Local. Suporta YouTube, Instagram, TikTok e todos os sites. Funcionalidades: Baixe Áudio, Vídeo e Imagens por Atalhos, Download em Lote, Seleção Inteligente, Auto Screenshot, Alta Qualidade (1080p/4k), Sem Anúncios.
// @description:es   Descargador universal de medios a través del Servidor Local. Soporta YouTube, Instagram, TikTok y todos los sitios. Características: Audio/Video/Imagen por Atajos, Descarga por Lotes, Captura Inteligente, Alta Calidad (1080p/4k), Sin Anuncios.
// @description:fr   Téléchargeur multimédia universel via serveur local. Supporte YouTube, Instagram, TikTok et tous les sites. Caractéristiques : Audio/Vidéo/Image par Raccourcis, Téléchargement par lots, Capture intelligente, Haute qualité (1080p/4k), Sans publicité.
// @description:de   Universeller Medien-Downloader über lokalen Server. Unterstützt YouTube, Instagram, TikTok und alle Seiten. Funktionen: Audio/Video/Bild per Tastenkombination, Batch-Download, Smart Grabber, Hohe Qualität (1080p/4k), Keine Werbung.
// @description:it   Downloader universale di media tramite server locale. Supporta YouTube, Instagram, TikTok e tutti i siti. Funzioni: Audio/Video/Immagine tramite Scorciatoie, Download in batch, Smart Grabber, Alta qualità (1080p/4k), Senza annunci.
// @description:ru   Универсальный загрузчик медиа через локальный сервер. Поддерживает YouTube, Instagram, TikTok и все сайты. Функции: Аудио/Видео/Фото через горячие клавиши, пакетная загрузка, интеллектуальный захват, высокое качество (1080p/4k), Без рекламы.
// @description:zh-CN 本地服务器通用媒体下载器。支持 YouTube、Instagram、TikTok 和所有网站。功能：通过快捷键下载音频/视频/图片、批量下载、智能抓取、自动截图、高质量 (1080p/4k)、无广告。
// @description:ja   ローカルサーバー経由のユニバーサルメディアダウンローダー。YouTube、Instagram、TikTok、およびすべてのサイトをサポートします。機能：ショートカットでオーディオ/ビデオ/画像をダウンロード、バッチダウンロード、スマートグラバー、高品質 (1080p/4k)、広告なし。
// @description:ko   로컬 서버를 통한 범용 미디어 다운로더. YouTube, Instagram, TikTok 및 모든 사이트를 지원합니다. 기능: 단축키로 오디오/비디오/이미지 다운로드, 일괄 다운로드, 스마트 그래버, 고화질 (1080p/4k), 광고 없음.
// @author       Tauã B. Kloch Leite
// @copyright    2025, Tauã B. Kloch Leite - All Rights Reserved.
// @icon         https://img.icons8.com/?size=100&id=12993&format=png&color=000000
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      *
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/557800/Universal%20Media%20Downloader%20-%20Local%20Server%20%28YouTube%2C%20TikTok%2C%20Instagram%20%2B%20All%20Sites%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557800/Universal%20Media%20Downloader%20-%20Local%20Server%20%28YouTube%2C%20TikTok%2C%20Instagram%20%2B%20All%20Sites%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.top !== window.self) return;

  // --- CONFIG ---
  const SERVER_URL = "http://127.0.0.1:5000";
  const DRIVE_LINK = "https://drive.google.com/file/d/1MHOYc9haviNrfOZX_IeFwszBLj6K-f3o/view?usp=sharing";
  const UPDATE_URL = "https://greasyfork.org/en/scripts/557800-universal-media-downloader-local-server";
  const POLLING_INTERVAL = 1500;
  const IS_YOUTUBE = window.location.hostname.includes('youtube.com');
  const IS_TWITTER = window.location.hostname.includes('twitter.com') || window.location.hostname.includes('x.com');

  // --- SECURITY ---
  let policy = null;
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
      try { policy = window.trustedTypes.createPolicy('uni-dl-policy', { createHTML: (s) => s }); } catch (e) {}
  }
  const safeHTML = (html) => policy ? policy.createHTML(html) : html;

  // --- ICONS ---
  const ICONS = {
       warn: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/200px-Antu_dialog-warning.svg.png",
       pix: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg",
       paypal: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
       btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025",
       eth: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
       sol: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025",
       bnb: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025",
       matic: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025",
       usdt: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025"
  };

  // --- TRANSLATIONS ---
  const STRINGS = {
    en: {
        title: "Universal Downloader", tab_dl: "Home", tab_batch: "Batch List", tab_sup: "Donate", tab_help: "Help",
        vid: "🎬 VIDEO", aud: "🎵 AUDIO", img: "🖼️ IMG",
        queue: "Queue", done: "Done", err: "Error", refresh: "🔄 Refresh", clear: "🗑️ Clear",
        conn_err: "Server Offline? Start App!", open: "Open", folder: "Folder",
        sup_title: "SUPPORT THE CODE", sup_desc: "Help keep updates coming!", lbl_pix: "PIX KEY (BR)", btn_copy: "COPY",
        auto_dl: "⬇️ Saved: ", wallet_title: "CRYPTO WALLETS", login_err: "⚠️ LOGIN NEEDED", retry: "Retry", cancel: "Cancel",
        open_panel: "🚀 Panel", toggle: "👁️ Show/Hide UI (Alt+Shift+Y)", help_btn: "❓ Help / Shortcuts",
        btn_main: "⬇️ DOWNLOAD PAGE MEDIA",
        tip_title: "SHORTCUTS:",
        tip_1: "<b>SHIFT + R-Click:</b> Video ONLY",
        tip_2: "<b>ALT + R-Click:</b> Audio (MP3)",
        tip_4: "<b>CTRL + R-Click:</b> Image ONLY",
        tip_sc: "<b>CTRL + SHIFT + S:</b> Auto Screenshot",
        tip_3: "<b>Login Error?</b> Click the yellow warning.",
        tip_fail: "USE SHORTCUTS IF BUTTONS FAIL!",
        tip_pro: "<b>PRO TIP:</b> Use shortcuts directly on thumbnails. No need to open the video!",
        smart_err: "Failed? Try SHIFT+Right Click!",
        batch_ph: "Paste links here...", batch_btn: "PROCESS LIST", batch_tips: "Tips: One link per line.",
        help_title: "INSTALLATION REQUIRED",
        help_s1: "1. Download Universal_Downloader_Server_v6.1.exe",
        help_s2: "2. Open the App",
        help_s3: "3. Click 'Start Server'",
        help_btn_dl: "DOWNLOAD SERVER",
        help_warn: "⚠️ THE SCRIPT DOES NOT WORK WITHOUT THIS APP!",
        back: "BACK", empty_list: "Empty list", cleared: "List Cleared! 🗑️",
        partial_clean: "Cleaned Finished (Active kept) 🧹",
        media_not_found: "Media not found or protected",
        nothing_to_clean: "Nothing to clean (Active downloads only)",
        batch_sent: "Batch sent: ",
        menu_panel: "⚙️ Open Server Panel",
        menu_dl_server: "📥 Download Server App",
        menu_update: "🔄 Check Update",
        footer_txt: "Universal Media Downloader"
    },
    pt: {
        title: "Universal Downloader", tab_dl: "Início", tab_batch: "Lista Batch", tab_sup: "Doação", tab_help: "Ajuda",
        vid: "🎬 VÍDEO", aud: "🎵 ÁUDIO", img: "🖼️ IMG",
        queue: "Fila", done: "Prontos", err: "Erros", refresh: "🔄 Atualizar", clear: "🗑️ Limpar",
        conn_err: "Servidor Offline? Inicie o App!", open: "Abrir", folder: "Pasta",
        sup_title: "APOIE O PROJETO", sup_desc: "Mantenha as atualizações vivas!", lbl_pix: "CHAVE PIX", btn_copy: "COPIAR",
        auto_dl: "⬇️ Salvo: ", wallet_title: "CARTEIRAS CRIPTO", login_err: "⚠️ LOGIN NECESSÁRIO", retry: "🔄 Reiniciar", cancel: "❌ Cancelar",
        open_panel: "🚀 Painel", toggle: "👁️ Mostrar/Ocultar UI (Alt+Shift+Y)", help_btn: "❓ Ajuda / Atalhos",
        btn_main: "⬇️ BAIXAR MÍDIA DA ABA",
        tip_title: "ATALHOS (SEPARADOS):",
        tip_1: "<b>SHIFT + Clique Dir:</b> VÍDEO (Força Vídeo)",
        tip_2: "<b>ALT + Clique Dir:</b> ÁUDIO (MP3)",
        tip_4: "<b>CTRL + Clique Dir:</b> IMAGEM (Só Foto)",
        tip_sc: "<b>CTRL + SHIFT + S:</b> Auto Screenshot",
        tip_3: "<b>Erro de Login?</b> Clique no aviso amarelo.",
        tip_fail: "USE OS ATALHOS CASO OS BOTÕES FALHEM!",
        tip_pro: "<b>DICA PRO:</b> Use os atalhos direto nas miniaturas. Não precisa abrir o vídeo!",
        smart_err: "Falhou? Tente SHIFT+Clique na mídia!",
        batch_ph: "Cole links aqui...", batch_btn: "PROCESSAR LISTA", batch_tips: "Dica: Um link por linha.",
        help_title: "INSTALAÇÃO NECESSÁRIA",
        help_s1: "1. Baixe Universal_Downloader_Server_v6.1.exe",
        help_s2: "2. Abra o Aplicativo",
        help_s3: "3. Clique em 'Start Server'",
        help_btn_dl: "BAIXAR SERVIDOR",
        help_warn: "⚠️ O SCRIPT NÃO FUNCIONA SEM ESSE APP!",
        back: "VOLTAR", empty_list: "Lista Vazia", cleared: "Lista Limpa! 🗑️",
        partial_clean: "Prontos Removidos (Ativos mantidos) 🧹",
        media_not_found: "Mídia não encontrada ou protegida",
        nothing_to_clean: "Nada para limpar (Apenas downloads ativos)",
        batch_sent: "Batch enviado: ",
        menu_panel: "⚙️ Abrir Painel",
        menu_dl_server: "📥 Baixar Servidor",
        menu_update: "🔄 Verificar Atualização",
        footer_txt: "Universal Media Downloader"
    },
    es: {
        title: "Descargador Universal", tab_dl: "Inicio", tab_batch: "Lista Batch", tab_sup: "Donar", tab_help: "Ayuda",
        vid: "🎬 VIDEO", aud: "🎵 AUDIO", img: "🖼️ IMG",
        queue: "Cola", done: "Listo", err: "Error", refresh: "🔄", clear: "🗑️ Limpiar",
        conn_err: "¿Servidor Offline? ¡Inicia la App!", open: "Abrir", folder: "Carpeta",
        sup_title: "APOYA EL CÓDIGO", sup_desc: "¡Mantén las actualizaciones!", lbl_pix: "PIX", btn_copy: "COPIAR",
        auto_dl: "⬇️ Guardado: ", wallet_title: "CRIPTO", login_err: "⚠️ LOGIN", retry: "Reintentar", cancel: "Cancelar",
        open_panel: "🚀 Panel", toggle: "👁️ Mostrar/Ocultar UI (Alt+Shift+Y)", help_btn: "❓ Ayuda",
        btn_main: "⬇️ DESCARGAR MEDIA",
        tip_title: "ATAJOS:",
        tip_1: "<b>SHIFT + Clic Der:</b> VIDEO",
        tip_2: "<b>ALT + Clic Der:</b> AUDIO",
        tip_4: "<b>CTRL + Clic Der:</b> IMAGEN",
        tip_sc: "<b>CTRL + SHIFT + S:</b> Auto Screenshot",
        tip_3: "<b>¿Error de Login?</b> Clic en aviso amarillo.",
        tip_fail: "¡USA ATAJOS SI LOS BOTONES FALLAN!",
        tip_pro: "<b>TIP PRO:</b> Usa atajos directo en las miniaturas. ¡No hace falta abrir el video!",
        smart_err: "¡Prueba SHIFT+Clic en la media!",
        batch_ph: "Pega enlaces aquí...", batch_btn: "PROCESAR", batch_tips: "Tips: Un enlace por línea.",
        help_title: "INSTALACIÓN REQUERIDA",
        help_s1: "1. Descarga el Servidor",
        help_s2: "2. Abre la App",
        help_s3: "3. Clic 'Start Server'",
        help_btn_dl: "DESCARGAR SERVIDOR",
        help_warn: "⚠️ ¡REQUIERE LA APP PARA FUNCIONAR!",
        back: "VOLVER", empty_list: "Lista vacía", cleared: "¡Lista limpia!",
        partial_clean: "Limpieza Parcial (Activos mantenidos) 🧹",
        media_not_found: "Medios no encontrados",
        nothing_to_clean: "Nada que limpiar (Solo descargas activas)",
        batch_sent: "Lote enviado: ",
        menu_panel: "⚙️ Abrir Panel",
        menu_dl_server: "📥 Descargar Servidor",
        menu_update: "🔄 Buscar Actualización",
        footer_txt: "Universal Media Downloader"
    }
  };

  const getLang = () => {
      const l = navigator.language || "en";
      if (l.startsWith("pt")) return STRINGS.pt;
      if (l.startsWith("es")) return STRINGS.es;
      return STRINGS.en;
  };
  const T = getLang();

  // --- STATE ---
  const state = { uiMode: GM_getValue("uni_dl_uiMode", 1), stats: {}, items: [], activeTab: 'dl' };
  let lastHtml = '';
  const imgCache = {};
  let isServerOnline = false;
  let isProcessingClick = false;

  let bubblePos = { left: '20px', bottom: '20px', top: 'auto', right: 'auto' };
  let panelPos = null;

  const setUIMode = (m) => {
      if (container) {
          if (state.uiMode === 1) {
              bubblePos = { left: container.style.left, top: container.style.top, bottom: container.style.bottom, right: container.style.right };
          } else if (state.uiMode === 2) {
              panelPos = { left: container.style.left, top: container.style.top, width: container.style.width, height: container.style.height };
          }
      }

      state.uiMode = m;
      GM_setValue("uni_dl_uiMode", m);
      renderUI();

      if (!container) return;

      if (m === 1) {
          container.style.width = '';
          container.style.height = '';
          container.style.resize = 'none';
          applyStyles(container, bubblePos);
      } else if (m === 2) {
          container.style.resize = 'both';

          if (panelPos) {
              applyStyles(container, { ...panelPos, bottom: 'auto', right: 'auto' });
              if(panelPos.width) container.style.width = panelPos.width;
              if(panelPos.height) container.style.height = panelPos.height;
          } else {
              const bRect = container.getBoundingClientRect();
              container.style.bottom = 'auto'; container.style.right = 'auto';

              let startLeft = bubblePos.left;
              if(!startLeft || startLeft === 'auto') startLeft = '20px';

              let calcTop = parseInt(bubblePos.top);
              if (bubblePos.bottom && bubblePos.bottom !== 'auto') {
                  const winH = window.innerHeight;
                  const bottomVal = parseInt(bubblePos.bottom);
                  calcTop = winH - bottomVal - 460;
              } else {
                  if (!calcTop) calcTop = 60;
              }

              if (calcTop < 10) calcTop = 10;
              if (calcTop > window.innerHeight - 100) calcTop = window.innerHeight - 450;

              container.style.left = startLeft;
              container.style.top = calcTop + 'px';
          }
      }
  };

  const applyStyles = (el, styles) => {
      if(styles.left) el.style.left = styles.left;
      if(styles.top) el.style.top = styles.top;
      if(styles.bottom) el.style.bottom = styles.bottom;
      if(styles.right) el.style.right = styles.right;
  };

  const getHistory = () => GM_getValue('uni_dl_history', []);
  const addToHistory = (f) => { let h=getHistory(); if(!h.includes(f)){ h.push(f); if(h.length>50)h.shift(); GM_setValue('uni_dl_history', h); }};
  const getHiddenIds = () => GM_getValue('uni_dl_hidden', []);
  const addHiddenIds = (ids) => {
      const current = getHiddenIds();
      const newIds = [...new Set([...current, ...ids])];
      GM_setValue('uni_dl_hidden', newIds);
  };

  const cleanFileName = (name) => name.replace(/[^a-z0-9\u00a0-\uffff _-]/gi, '_').trim();
  const generateRandomId = () => Math.floor(Math.random() * 900000) + 100000;
  const formatTitle = (title) => title.replace(/^(Thumbnail:|Image:|Video:|Audio:)\s*/i, '').trim();

  // --- URL FIXER ---
  const fixUrl = (url) => {
      if (!url) return null;
      if (url.startsWith('//')) return 'https:' + url;
      if (url.startsWith('/')) return window.location.origin + url;
      return url;
  };

  // --- CONNECTION ---
  const gmFetch = (url, options = {}) => {
      return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
              method: options.method || "GET",
              url: url,
              headers: options.headers || {},
              data: options.body,
              timeout: options.customTimeout || 2000,
              responseType: options.responseType || null,
              onload: (res) => {
                  if (!res.status || res.status === 0) return reject("OFFLINE");
                  try {
                      if(options.responseType === 'arraybuffer' || options.responseType === 'blob') {
                           resolve(res.response);
                      } else {
                          resolve({ json: () => JSON.parse(res.responseText), ok: true, status: res.status });
                      }
                  } catch (e) { reject(e); }
              },
              onerror: () => reject("OFFLINE"),
              ontimeout: () => reject("OFFLINE")
          });
      });
  };

  const bufferToBase64 = (buffer) => {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
      return window.btoa(binary);
  };

  const tunnelUniversalImage = (imgElement, path, id) => {
      if (imgCache[id]) { imgElement.src = imgCache[id]; return; }
      let url = path.startsWith('/') ? `${SERVER_URL}${path}` : path;
      gmFetch(url, { responseType: 'arraybuffer', customTimeout: 5000 }).then(buffer => {
          const base64 = bufferToBase64(buffer);
          let mime = 'image/jpeg';
          if(path.toLowerCase().endsWith('.png')) mime = 'image/png';
          if(path.toLowerCase().endsWith('.webp')) mime = 'image/webp';
          const dataUri = `data:${mime};base64,${base64}`;
          imgCache[id] = dataUri;
          imgElement.src = dataUri;
      }).catch(() => { imgElement.src = ""; });
  };

  // --- IMAGE FINDER ---
  const getImgFromContext = (el) => {
      if (!el) return null;
      if (el.tagName === 'IMG') return el;
      let img = el.querySelector('img');
      if (img) return img;
      let link = el.closest('a');
      if (link) img = link.querySelector('img');
      if (img) return img;
      let parent = el.parentElement;
      for(let i=0; i<5 && parent; i++) {
          img = parent.querySelector('img');
          if(img) return img;
          parent = parent.parentElement;
      }
      return null;
  };

  const findMainImage = () => {
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg && ogImg.content) return { url: ogImg.content, title: document.title };
      let maxArea = 0, bestImg = null;
      document.querySelectorAll('img').forEach(img => {
          const rect = img.getBoundingClientRect();
          const area = rect.width * rect.height;
          if (area > maxArea && rect.width > 200) { maxArea = area; bestImg = img; }
      });
      if (bestImg) {
           let url = bestImg.dataset.src || bestImg.src;
           return { url: url, title: bestImg.alt || document.title };
      }
      const video = document.querySelector('video');
      if(video && video.poster) return { url: video.poster, title: document.title };
      return null;
  };

  const getYoutubeVideoID = (url) => {
      try {
          const u = new URL(url);
          if (u.hostname.includes('youtube.com')) {
              if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2];
              return u.searchParams.get('v');
          }
          if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
      } catch(e){}
      return null;
  };

  // --- MEDIA GRABBER ---
  const findMediaUrl = (target, mode) => {
    let foundUrl = null, foundThumb = null, foundTitle = null;

    if (IS_TWITTER && target) {
        const article = target.closest('article');
        if (article) {
            if (mode !== 'image') {
                const link = article.querySelector('a[href*="/status/"]');
                if (link) {
                    foundUrl = link.href;
                    const textEl = article.querySelector('div[data-testid="tweetText"]');
                    if(textEl) foundTitle = textEl.innerText.substring(0, 50);
                }
            } else {
                let imgEl = (target.tagName === 'IMG' && target.src.includes('twimg')) ? target : article.querySelector('img[src*="twimg"]');
                if(imgEl) {
                    foundUrl = imgEl.src;
                    if(foundUrl.includes('&name=')) foundUrl = foundUrl.split('&name=')[0] + '&name=orig';
                    foundThumb = foundUrl;
                    foundTitle = "Twitter_Image";
                }
            }
        }
    }

    else if (IS_YOUTUBE) {
        if (mode === 'image' && target) {
             const container = target.closest('ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-playlist-panel-video-renderer, ytd-reel-item-renderer');
             if (container) {
                 const link = container.querySelector('a#thumbnail, a[href*="/watch"]');
                 const titleEl = container.querySelector('#video-title');
                 if (link) {
                     const vidId = getYoutubeVideoID(link.href);
                     if(vidId) {
                         foundUrl = `https://i.ytimg.com/vi/${vidId}/maxresdefault.jpg`;
                         foundThumb = foundUrl;
                     }
                 }
                 if (!foundUrl) {
                      const imgEl = container.querySelector('ytd-thumbnail img') || container.querySelector('img');
                      if (imgEl && imgEl.src) { foundUrl = imgEl.src.split('?')[0]; foundThumb = foundUrl; }
                 }
                 if (titleEl) { foundTitle = titleEl.textContent.trim() || titleEl.title; }
                 if (!foundTitle) foundTitle = "Image_YouTube";
             }
        }
        if (!foundUrl) {
            let link = null;
            if(target) link = target.closest('a[href*="/watch"], a[href*="/shorts/"]');
            if (link) {
                foundUrl = link.href;
                const vidId = getYoutubeVideoID(foundUrl);
                if (vidId) {
                    foundThumb = `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`;
                }
                const container = target.closest('ytd-compact-video-renderer') || target.closest('ytd-video-renderer') || target.closest('ytd-rich-item-renderer') || target.closest('ytd-grid-video-renderer');
                if (container) {
                    const titleEl = container.querySelector('#video-title');
                    if (titleEl) foundTitle = titleEl.textContent.trim();
                }
            }
            if (!foundUrl && (window.location.pathname === '/watch' || window.location.pathname.startsWith('/shorts/'))) {
                foundUrl = window.location.href;
                foundTitle = document.title.replace(" - YouTube", "");
            }
        }
    }

    if (!foundUrl) {
        if (mode === 'image') {
            if (target) {
                const imgTarget = getImgFromContext(target);
                if (imgTarget) {
                    foundUrl = imgTarget.getAttribute('data-src') || imgTarget.getAttribute('data-ip-src') || imgTarget.src;
                    foundThumb = imgTarget.src;
                    foundTitle = imgTarget.alt || imgTarget.title;
                } else {
                    let el = target;
                    for(let i=0; i<4 && el; i++) {
                        const bg = window.getComputedStyle(el).backgroundImage;
                        if (bg && bg.startsWith('url')) { 
                            foundUrl = bg.slice(5, -2).replace(/['"]/g, ""); 
                            foundThumb = foundUrl; 
                            foundTitle = "Background_Image"; 
                            break; 
                        }
                        el = el.parentElement;
                    }
                }
            }
            if (!foundUrl) {
                const mainImg = findMainImage();
                if(mainImg) { foundUrl = mainImg.url; foundThumb = mainImg.url; foundTitle = mainImg.title; }
            }
        }
        else {
            let closestLink = null;
            if(target) closestLink = target.closest('a');
            
            if (closestLink && closestLink.href) {
                foundUrl = closestLink.href;
            }

            if(target) {
                let container = target;
                for(let i=0; i<4; i++) {
                    if(!container) break;
                    if(!foundThumb) {
                        const imgs = container.querySelectorAll('img');
                        let maxDim = 0;
                        imgs.forEach(img => {
                            const dim = img.width * img.height;
                            if(dim > maxDim && dim > 2000) { 
                                 maxDim = dim;
                                 foundThumb = img.getAttribute('data-src') || img.getAttribute('data-ip-src') || img.src;
                            }
                        });
                    }
                    if(!foundTitle) {
                         const titleEl = container.querySelector('h1, h2, h3, h4, .title, [class*="title"]');
                         if(titleEl) foundTitle = titleEl.innerText.trim();
                    }
                    if(foundThumb && foundTitle) break;
                    container = container.parentElement;
                }
            }

            if (!foundUrl) {
                 if(IS_YOUTUBE) {
                     if (window.location.pathname === '/watch' || window.location.pathname.startsWith('/shorts/')) {
                         foundUrl = window.location.href;
                         foundTitle = document.title.replace(" - YouTube", "");
                     }
                 } else if (IS_TWITTER) {
                     if(window.location.pathname.includes('/status/')) {
                         foundUrl = window.location.href;
                     }
                 } else {
                     const v = document.querySelector('video');
                     if(v || document.querySelector('meta[property="og:video"]')) {
                         foundUrl = window.location.href;
                         foundTitle = document.title;
                         if(v && v.poster) foundThumb = v.poster;
                     }
                 }
            }
        }
    }

    if (foundUrl && !foundThumb && mode !== 'image') {
        const currentLoc = window.location.href.split('#')[0];
        const foundLoc = foundUrl.split('#')[0];
        
        if (foundLoc === currentLoc || !target) {
             // YOUTUBE THUMBNAIL FIX (Main Page)
             if (IS_YOUTUBE && (window.location.pathname.startsWith('/watch') || window.location.pathname.startsWith('/shorts/'))) {
                 const vidId = getYoutubeVideoID(foundUrl);
                 if(vidId) foundThumb = `https://i.ytimg.com/vi/${vidId}/maxresdefault.jpg`;
             } 
             
             if (!foundThumb) {
                 const ogImg = document.querySelector('meta[property="og:image"]');
                 if (ogImg && ogImg.content) {
                     foundThumb = ogImg.content;
                 }
             }
        }
    }

    if(foundUrl) {
        foundUrl = fixUrl(foundUrl);
        foundThumb = fixUrl(foundThumb);
    
        if (!foundTitle) foundTitle = "Media";
        if(foundTitle === 'Media' || foundTitle === 'Image' || foundTitle === 'Twitter_Image' || foundTitle === 'Background_Image' || foundTitle === 'Image_YouTube') {
             foundTitle = `${foundTitle}_${generateRandomId()}`;
        } else {
            foundTitle = cleanFileName(foundTitle);
            if(foundTitle.length > 80) foundTitle = foundTitle.substring(0, 80);
        }
    }

    if (mode === 'image' && !foundUrl) return { url: null };
    return { url: foundUrl, thumb: foundThumb, title: foundTitle };
  };

  // --- DRAG LOGIC ---
  let isDraggingUI = false;

  const makeDraggable = (el) => {
      let startX, startY, initialLeft, initialTop;

      const onMouseDown = (e) => {
          if (state.uiMode === 2 && !e.target.closest('.uni-dl-head') && !e.target.closest('.uni-footer')) return;
          if (state.uiMode === 1 && !e.target.closest('.uni-dl-bubble')) return;

          if (state.uiMode === 2) {
              const rect = el.getBoundingClientRect();
              if (e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20) return;
          }

          isDraggingUI = true;
          el.dataset.moved = "false";
          startX = e.clientX; startY = e.clientY;

          const rect = el.getBoundingClientRect();
          initialLeft = rect.left; initialTop = rect.top;

          el.style.bottom = 'auto'; el.style.right = 'auto';
          el.style.left = initialLeft + 'px'; el.style.top = initialTop + 'px';

          e.preventDefault();
      };

      const onMouseMove = (e) => {
          if (!isDraggingUI) return;
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
              el.dataset.moved = "true";
              el.style.left = (initialLeft + dx) + 'px';
              el.style.top = (initialTop + dy) + 'px';
          }
      };

      const onMouseUp = () => {
          if (isDraggingUI) {
              isDraggingUI = false;
              if (state.uiMode === 1) {
                  bubblePos = { left: el.style.left, top: el.style.top, bottom: 'auto', right: 'auto' };
              } else {
                  panelPos = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
              }
          }
      };

      el.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
  };

  // --- ACTIONS ---
  const clearList = async () => {
      const activeItems = state.items.filter(i => i.status === 'queued' || i.status === 'downloading');
      const finishedItems = state.items.filter(i => ['finished','error','cancelled','auth_error'].includes(i.status));

      if (activeItems.length > 0) {
          if(finishedItems.length > 0) {
              const idsToHide = finishedItems.map(i => i.id);
              addHiddenIds(idsToHide);
              toast(T.partial_clean);
              refreshData();
          } else { toast(T.nothing_to_clean); }
      } else {
          try {
              await gmFetch(`${SERVER_URL}/clear`, { method: 'POST', customTimeout: 1000 });
              GM_setValue('uni_dl_hidden', []);
              GM_setValue('uni_dl_history', []);
              state.items = [];
              state.stats = { total:0, in_progress:0, finished:0, errors:0 };
              lastHtml = '';
              Object.keys(imgCache).forEach(k => delete imgCache[k]);
              updateListContent();
              toast(T.cleared);
          } catch(e) { console.error(e); }
      }
  };

  const openLocalFile = async (filename) => { try { await gmFetch(`${SERVER_URL}/open_file`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({filename}), customTimeout: 1000 }); } catch(e) { if(e === "OFFLINE") toast(T.conn_err, false); } };
  const openFolder = async (type) => { try { await gmFetch(`${SERVER_URL}/open_folder`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({type}), customTimeout: 1000 }); } catch(e) { if(e === "OFFLINE") toast(T.conn_err, false); } };
  const copyToClipboard = (text) => { GM_setClipboard(text); toast(T.btn_copy + " OK!"); };
  const cancelDownload = async (id) => { try { await gmFetch(`${SERVER_URL}/cancel`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id}), customTimeout: 1000 }); toast(T.cancel + " OK"); refreshData(); } catch(e) {} };

  // --- BUTTON STATE CHECKER ---
  const updateButtonState = () => {
      if(!container || state.uiMode !== 2) return;
      
      let hasMedia = false;
      if (IS_YOUTUBE) {
           const path = window.location.pathname;
           hasMedia = path.startsWith('/watch') || path.startsWith('/shorts/');
      } else if (IS_TWITTER) {
           hasMedia = window.location.pathname.includes('/status/');
      } else {
           // Generic: Check if video detected or if findMediaUrl returns something
           const check = findMediaUrl(null, 'video');
           hasMedia = !!(check.url && check.url !== window.location.href);
           // Strict check: only enable if we found a REAL video file/link, or if there is a video tag
           if(!hasMedia) hasMedia = !!document.querySelector('video');
      }
      
      ['btn-uni-vid', 'btn-uni-aud', 'btn-uni-img'].forEach(id => {
          const btn = document.getElementById(id);
          if(btn) btn.disabled = !hasMedia;
      });
  };

  const refreshData = async () => {
      updateButtonState();
      if(document.hidden && Math.random() > 0.2) return;
      try {
          const [sRes, fRes] = await Promise.all([ 
              gmFetch(`${SERVER_URL}/stats`, { customTimeout: 1000 }), 
              gmFetch(`${SERVER_URL}/files`, { customTimeout: 1000 }) 
          ]);
          isServerOnline = true;
          state.stats = await sRes.json();
          const files = await fRes.json();

          const rawItems = files.items || [];
          const hiddenIds = getHiddenIds();
          state.items = rawItems.filter(item => !hiddenIds.includes(item.id));
          if(rawItems.length === 0 && hiddenIds.length > 0) GM_setValue('uni_dl_hidden', []);

          state.items.forEach(i => {
              if(i.status === 'finished' && i.filename && !getHistory().includes(i.filename)) {
                  addToHistory(i.filename);
                  toast(T.auto_dl + i.title.substring(0,20)+"...");
              }
          });
          if(state.uiMode === 2) updateListContent();
      } catch (e) {
          isServerOnline = false;
      }
  };

  const sendMedia = async (mode, target = null) => {
      if (mode === 'screenshot') {
         try {
             await gmFetch(`${SERVER_URL}/screenshot`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ url: window.location.href, title: document.title }) });
             toast("SCREENSHOT OK 📸");
         } catch(e) { if(e==="OFFLINE") toast(T.conn_err, false); }
         return;
      }

      // 1. FAST CHECK: Offline
      if (!isServerOnline) {
          toast(T.conn_err, false);
          gmFetch(`${SERVER_URL}/stats`, { customTimeout: 500 }).then(()=> isServerOnline=true).catch(()=>{});
          return;
      }

      // 2. DEBOUNCE
      if (isProcessingClick) return;
      isProcessingClick = true;
      setTimeout(() => isProcessingClick = false, 500);

      try {
          const media = findMediaUrl(target, mode);
          if (!media.url) return toast(T.media_not_found, false);

          let endpoint = 'download';
          if (mode === 'audio') endpoint = 'download_audio';
          if (mode === 'image') endpoint = 'download_image';

          const req = await gmFetch(`${SERVER_URL}/${endpoint}`, {
              method: 'POST', headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ 
                  videoUrl: media.url, 
                  thumb: media.thumb, 
                  type: mode, 
                  title: media.title, 
                  referer: window.location.href 
              }),
              customTimeout: 2500
          });
          const res = await req.json();
          if (res.status === 'ok') {
              lastHtml = '';
              refreshData();
              toast(`${mode.toUpperCase()} OK 🚀`);
              if(state.uiMode === 1) setUIMode(2);
          } else { toast(T.err + ": " + (res.msg || ""), false); }
      } catch(e) { 
          if (e === "OFFLINE") {
               toast(T.conn_err, false);
               isServerOnline = false;
          } else {
               toast(T.conn_err, false);
          }
      }
  };

  const sendVideo = () => sendMedia('video', null);
  const sendAudio = () => sendMedia('audio', null);
  const sendImage = () => sendMedia('image', null);

  const processBatch = () => {
      const area = document.getElementById('uni-dl-batch-area');
      if(!area) return;
      const lines = area.value.split('\n');
      let count = 0;
      lines.forEach(line => {
          const url = line.trim();
          if(url.startsWith('http')) {
              gmFetch(`${SERVER_URL}/download`, {
                  method: 'POST', headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({ videoUrl: url, thumb: null, type: 'video', title: `Batch_${generateRandomId()}` })
              });
              count++;
          }
      });
      area.value = '';
      lastHtml = '';
      toast(`${T.batch_sent}${count}`);
      state.activeTab = 'dl';
      renderUI();
  };

  document.addEventListener('contextmenu', (e) => {
      if (e.shiftKey || e.altKey || e.ctrlKey) {
          e.preventDefault();
          let mode = 'video';
          if (e.altKey) mode = 'audio';
          if (e.ctrlKey) mode = 'image';
          if (e.shiftKey) mode = 'video';
          sendMedia(mode, e.target);
      }
  });

  window.addEventListener("keydown", (e) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === "y") setUIMode(state.uiMode === 0 ? 1 : 0);
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") { e.preventDefault(); sendMedia('screenshot'); }
  });

  GM_registerMenuCommand(T.menu_update, () => GM_openInTab(UPDATE_URL, {active:true}));
  GM_registerMenuCommand(T.toggle, () => setUIMode(state.uiMode === 0 ? 1 : 0));
  GM_registerMenuCommand(T.help_btn, () => { state.activeTab = 'help'; setUIMode(2); });
  GM_registerMenuCommand(T.menu_panel, () => GM_openInTab(`${SERVER_URL}/panel`, {active: true}));
  GM_registerMenuCommand(T.menu_dl_server, () => GM_openInTab(DRIVE_LINK, {active: true}));

  // --- UI RENDERER ---
  const css = `
    .uni-dl-container { font-family: 'Segoe UI', sans-serif; z-index: 2147483647; position: fixed; bottom: 20px; left: 20px; }
    .uni-dl-bubble {
        width: 45px; height: 45px;
        background: #2b2b2b;
        border: 2px solid #9c27b0;
        border-radius: 50%;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        cursor: move;
        display: flex; align-items: center; justify-content: center;
        transition: 0.2s;
        color: #9c27b0;
    }
    .uni-dl-bubble:hover { transform: scale(1.1); background: #333; border-color: #ba68c8; color: #ba68c8; }
    .uni-dl-bubble svg { width: 24px; height: 24px; fill: currentColor; }

    .uni-dl-panel { width: 340px; min-width: 320px; min-height: 200px; max-width: 95vw; max-height: 95vh;
                    resize: both; overflow: hidden; display: flex; flex-direction: column;
                    background: #0f0f0f; color: #fff; border-radius: 12px; border: 1px solid #333; font-size: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.9); animation: slideUp 0.2s; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .uni-dl-head { background: #1a1a1a; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; cursor: move; }
    .uni-dl-tabs { display: flex; background: #0a0a0a; border-bottom: 1px solid #222; flex-shrink: 0; }
    .uni-dl-tab { flex: 1; text-align: center; padding: 12px 0; cursor: pointer; color: #777; font-weight: 600; border-bottom: 2px solid transparent; transition: 0.2s; font-size:11px; text-transform: uppercase; }
    .uni-dl-tab.active { color: #fff; border-bottom: 2px solid #9c27b0; background: #151515; }
    .uni-dl-body { flex: 1; overflow-y: auto; padding: 10px; }
    .uni-dl-item { display: flex; gap: 10px; padding: 10px; border-bottom: 1px solid #222; align-items: center; background: #151515; border-radius: 6px; margin-bottom: 5px; transition: 0.2s; }
    .uni-dl-item:hover { background: #1f1f1f; }
    .uni-dl-thumb { width: 45px; height: 45px; background: #000; border-radius: 4px; object-fit: cover; }
    .ctrl-btn { background: #333; border: 1px solid #444; color: #ccc; cursor: pointer; font-size: 10px; border-radius: 4px; padding: 4px 8px; margin-left: 3px; }
    .ctrl-btn:hover { background: #555; color: #fff; }
    .uni-dl-toast { position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 12px 24px; border-radius: 6px; z-index: 2147483648; font-weight: bold; animation: fadein 0.5s; font-size:13px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
    @keyframes fadein { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
    .batch-area { width: 100%; height: 100px; background: #0a0a0a; color: #ddd; border: 1px solid #333; padding: 10px; font-size: 11px; box-sizing: border-box; resize: vertical; margin-bottom: 10px; border-radius: 6px; }
    .batch-btn { width: 100%; padding: 12px; background: #9c27b0; color: #fff; border: none; font-weight: bold; cursor: pointer; border-radius: 6px; font-size: 12px; transition: 0.2s; }
    .batch-btn:hover { filter: brightness(1.1); }
    .batch-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(100%); }
    .auth-fix-btn { color: #ff9800; text-decoration: underline; cursor: pointer; font-weight: bold; }
    .tip-box { background: #1a1a1a; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #ffeb3b; margin-top: 10px; font-size: 11px; color: #ccc; line-height: 1.5; }
    .sup-row { display: flex; align-items: center; gap: 8px; background: #1a1a1a; padding: 8px; border-radius: 6px; border: 1px solid #333; margin-bottom: 8px; }
    .sup-icon { width: 20px; height: 20px; object-fit: contain; }
    .sup-val { flex: 1; background: none; border: none; color: #eee; font-size: 11px; font-family: monospace; outline: none; }
    .sup-copy { background: #d63384; border: none; color: #fff; border-radius: 4px; cursor: pointer; font-size: 10px; padding: 4px 8px; }
    .uni-footer { margin-top: 15px; text-align: center; color: #555; font-size: 10px; border-top: 1px solid #222; padding-top: 10px; flex-shrink: 0; background: #0f0f0f; cursor: move; }
    .tag-type { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px; margin-right: 5px; }
    .tag-vid { background: #0f3d5c; color: #3ea6ff; border: 1px solid #1e5985; }
    .tag-aud { background: #3c1f30; color: #ff66b2; border: 1px solid #7d2a58; }
    .tag-img { background: #3d2b0f; color: #ff9800; border: 1px solid #855a15; }
    .progress-bg { width: 100%; height: 4px; background: #333; margin-top: 4px; border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: #4caf50; width: 0%; transition: width 0.3s ease; }
    .prog-text { font-size: 9px; color: #888; text-align: right; margin-top: 2px; }
  `;
  const injectCSS = () => { if(!document.getElementById("uni-dl-style")) { const s=document.createElement("style"); s.id="uni-dl-style"; s.textContent=css; document.head.appendChild(s); }};
  
  // TOAST MODIFICADO
  const toast = (msg, success=true) => {
      const existing = document.querySelector('.uni-dl-toast');
      if (existing) existing.remove();

      const el=document.createElement("div");
      el.className="uni-dl-toast";
      el.textContent=msg;
      if(!success) el.style.background="#d32f2f";
      document.body.appendChild(el);
      setTimeout(()=> { if(el.parentNode) el.remove(); }, 3000);
  };

  let container;

  const generateListHTML = () => {
      if(state.items.length === 0) return `<div style="text-align:center;color:#444;padding:20px;">${T.empty_list}</div>`;
      return state.items.slice().reverse().slice(0,5).map(i => {
          const ext = i.filename ? i.filename.split('.').pop().toLowerCase() : '';
          let tagHtml = '<span class="tag-type tag-vid">MP4</span>', icon = '🎬';
          if(i.type === 'audio') { tagHtml = '<span class="tag-type tag-aud">MP3</span>'; icon = '🎵'; }
          else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) || i.type === 'image') { tagHtml = '<span class="tag-type tag-img">IMG</span>'; icon = '🖼️'; }

          let statusHtml = `<span style="color:${i.status==='finished'?'#4caf50':(i.status==='error'?'#f44336':'#888')}">${i.status}</span>`;
          // FORCE LOGIN MSG FOR IMAGE ERRORS
          if(i.status==='auth_error' || (i.status==='error' && i.type==='image')) {
              statusHtml = `<span class="auth-fix-btn" data-act="fix-auth">${T.login_err}</span>`;
          }

          // Progress Bar Logic
          let progressHtml = '';
          if (i.status === 'downloading' || i.status === 'recording') {
              let pct = i.progress ? i.progress : 0;
              if(i.status === 'recording') pct = 100;
              progressHtml = `
              <div class="progress-bg">
                  <div class="progress-fill" style="width:${pct}%"></div>
              </div>
              <div class="prog-text">${i.status === 'recording' ? 'REC ●' : pct + '%'}</div>
              `;
          }

          let thumbSrc = "";
          let useTunnel = false, dataTunnel = "";

          if (i.thumb && i.thumb.length > 5) {
              thumbSrc = i.thumb;
              if (!i.thumb.startsWith('https://')) useTunnel = true;
              dataTunnel = i.thumb;
          } else if (i.status === 'finished' && i.type === 'image' && i.filename) {
              dataTunnel = `/file/${encodeURIComponent(i.filename)}`;
              useTunnel = true;
          }
          if(imgCache[i.id]) { thumbSrc = imgCache[i.id]; useTunnel = false; }

          let actions = '';
          if(i.status === 'finished') {
              actions = `<div style="display:flex;gap:2px"><button class="ctrl-btn" data-act="open" data-file="${encodeURIComponent(i.filename)}" title="Play">▶</button><button class="ctrl-btn" data-act="folder" data-type="${i.type}" title="Folder">📂</button></div>`;
          } else if (i.status === 'error' || i.status === 'cancelled' || i.status === 'auth_error') {
              actions = `<button class="ctrl-btn" data-act="retry" data-url="${i.url}" data-type="${i.type}">↻</button>`;
          } else { actions = `<button class="ctrl-btn" data-act="cancel" data-id="${i.id}">${T.cancel}</button>`; }

          const displayTitle = formatTitle(i.title || "Loading...");
          const imgHTML = `<img class="uni-dl-thumb" src="${useTunnel ? '' : thumbSrc}" ${useTunnel && !imgCache[i.id] ? `data-tunnel="${dataTunnel}" data-id="${i.id}"` : ''} onerror="this.style.display='none'">`;
          return `<div class="uni-dl-item">${imgHTML}<div style="flex:1;overflow:hidden"><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;font-size:11px" title="${displayTitle}">${icon} ${displayTitle}</div><div style="font-size:10px;display:flex;align-items:center;margin-top:2px">${tagHtml} ${statusHtml}</div>${progressHtml}</div><div>${actions}</div></div>`;
      }).join('');
  };

  const updateListContent = () => {
      if(!container || state.uiMode !== 2) return;
      const listEl = document.getElementById('uni-dl-list');
      const statsEl = document.getElementById('uni-dl-stats');
      const newHtml = generateListHTML();
      if(listEl && newHtml !== lastHtml) {
          listEl.innerHTML = safeHTML(newHtml);
          lastHtml = newHtml;
          bindDynamicEvents();
          listEl.querySelectorAll('img[data-tunnel]').forEach(img => {
              const url = img.getAttribute('data-tunnel');
              const id = img.getAttribute('data-id');
              if(url && id) tunnelUniversalImage(img, url, id);
          });
      }
      if(statsEl) statsEl.innerHTML = safeHTML(`Queue: <b style="color:#ffeb3b">${state.stats.in_progress||0}</b> | Done: <b style="color:#4caf50">${state.stats.finished||0}</b>`);
  };

  const bindDynamicEvents = () => {
      if(!container) return;
      container.querySelectorAll('.ctrl-btn[data-act]').forEach(b => {
          b.onclick = (e) => {
              const d = e.target.dataset;
              if(d.act === 'open') openLocalFile(decodeURIComponent(d.file));
              if(d.act === 'folder') openFolder(d.type);
              if(d.act === 'retry') sendMedia(d.type);
              if(d.act === 'cancel') cancelDownload(d.id);
          };
      });
      container.querySelectorAll('.auth-fix-btn').forEach(b => {
          b.onclick = () => GM_openInTab(`${SERVER_URL}/panel?tab=cook`, {active: true});
      });
  };

  const renderUI = () => {
      injectCSS();
      if(!container) { container=document.createElement('div'); container.className='uni-dl-container'; document.body.appendChild(container); makeDraggable(container); }
      if(state.uiMode === 0) { container.style.display = 'none'; return; }
      container.style.display = 'block';

      if(state.uiMode === 1) {
          const svgIcon = `<svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>`;
          container.innerHTML = safeHTML(`<div class="uni-dl-bubble" id="uni-dl-bubble-btn" title="${T.open}">${svgIcon}</div>`);
          document.getElementById('uni-dl-bubble-btn').onclick = () => {
              if(container.dataset.moved !== "true") setUIMode(2);
          };
          return;
      }

      const dlContent = `
        <div style="display:flex;gap:5px;margin-bottom:5px">
            <button class="batch-btn" id="btn-uni-vid" style="background:#3ea6ff;flex:1;font-size:10px">${T.vid}</button>
            <button class="batch-btn" id="btn-uni-aud" style="background:#d63384;color:#fff;flex:1;font-size:10px">${T.aud}</button>
            <button class="batch-btn" id="btn-uni-img" style="background:#ff9800;color:#000;flex:1;font-size:10px">${T.img}</button>
        </div>
        <div style="display:flex;gap:5px;margin-bottom:8px">
             <button class="ctrl-btn" id="btn-uni-clear" style="flex:1; padding: 10px; font-weight:bold" title="${T.clear}">${T.clear}</button>
             <button class="ctrl-btn" id="btn-uni-panel" style="flex:1; padding: 10px; font-weight:bold; background:#1e5985" title="${T.open_panel}">${T.open_panel}</button>
        </div>
        <div class="tip-box">
            <div style="font-size:12px;font-weight:bold;color:#ffeb3b;margin-bottom:5px;text-transform:uppercase">${T.tip_fail}</div>
            <div style="margin-bottom:5px;border-top:1px solid #444;padding-top:5px;font-style:italic;color:#ddd;font-size:10px">${T.tip_pro}</div>
        </div>
        <div id="uni-dl-stats" style="font-size:10px;color:#666;margin:8px 0 4px 0;text-align:right">...</div>
        <div id="uni-dl-list">${generateListHTML()}</div>`;

      const batchContent = `
        <div style="padding:5px">
            <textarea id="uni-dl-batch-area" class="batch-area" placeholder="${T.batch_ph}"></textarea>
            <button id="btn-batch-proc" class="batch-btn">${T.batch_btn}</button>
            <p style="font-size:10px;color:#666;margin-top:10px;text-align:center">${T.batch_tips}</p>
        </div>`;

      const helpContent = `
        <div style="padding:15px">
             <div class="tip-box" style="margin-top:0">
                <div style="color:#ffeb3b;font-weight:bold;margin-bottom:5px">${T.tip_title}</div>
                <div style="margin-bottom:5px">${T.tip_1}</div>
                <div style="margin-bottom:5px">${T.tip_2}</div>
                <div style="margin-bottom:5px">${T.tip_4}</div>
                <div style="margin-bottom:5px">${T.tip_sc}</div>
                <div style="margin-bottom:8px;color:#fff;font-weight:bold;background:#b71c1c;padding:3px 6px;border-radius:4px;display:inline-block">${T.tip_3}</div>
             </div>
             <div style="text-align:center;margin-top:15px">
                 <div style="color:#ccc;margin-bottom:10px;font-weight:bold">${T.help_title}</div>
                 <div style="text-align:left;background:#1a1a1a;padding:10px;border-radius:5px;font-size:11px;color:#888;margin-bottom:10px;line-height:1.6">
                     ${T.help_s1}<br>${T.help_s2}<br>${T.help_s3}
                 </div>
                 <button id="btn-dl-server" class="batch-btn" style="background:#4caf50;width:100%;color:#fff;">${T.help_btn_dl}</button>
                 <div style="color:#ff9800;font-weight:bold;font-size:10px;margin-top:10px;text-transform:uppercase">${T.help_warn}</div>
                 <div id="btn-back-help" style="margin-top:15px;cursor:pointer;text-decoration:underline;color:#777">${T.back}</div>
             </div>
        </div>`;

      const cryptoList = [
          {img: ICONS.btc, name: "BTC", val: "bc1q6gz3dtj9qvlxyyh3grz35x8xc7hkuj07knlemn"},
          {img: ICONS.eth, name: "ETH", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"},
          {img: ICONS.sol, name: "SOL", val: "7ztAogE7SsyBw7mwVHhUr5ZcjUXQr99JoJ6oAgP99aCn"},
          {img: ICONS.usdt, name: "USDT", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"},
          {img: ICONS.bnb, name: "BNB", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"},
          {img: ICONS.matic, name: "MATIC", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"}
      ].map(c => `<div class="sup-row"><img src="${c.img}" class="sup-icon"><span style="font-size:9px;color:#888;width:30px">${c.name}</span><input type="text" class="sup-val" readonly value="${c.val}"><button class="sup-copy" data-val="${c.val}">${T.btn_copy}</button></div>`).join('');

      const supContent = `
        <div style="padding:15px;text-align:center">
            <div style="color:#d63384;font-weight:bold;margin-bottom:5px">${T.sup_title}</div>
            <div style="color:#aaa;font-size:11px;margin-bottom:15px">${T.sup_desc}</div>
            <div style="text-align:left;color:#d63384;font-weight:bold;font-size:10px;margin-bottom:5px">${T.lbl_pix}</div>
            <div class="sup-row"><img src="${ICONS.pix}" class="sup-icon"><input type="text" class="sup-val" readonly value="69993230419"><button class="sup-copy" data-val="69993230419">${T.btn_copy}</button></div>
            <div style="text-align:left;color:#d63384;font-weight:bold;font-size:10px;margin:15px 0 5px">${T.wallet_title}</div>
            ${cryptoList}
            <a href="https://www.paypal.com/donate/?business=4J4UK7ACU3DS6" target="_blank" style="display:inline-flex;align-items:center;gap:8px;background:#003087;color:white;padding:8px 20px;border-radius:20px;text-decoration:none;font-weight:bold;margin-top:20px;font-size:12px"><img src="${ICONS.paypal}" style="height:20px"> PayPal</a>
        </div>`;

      let activeHtml = dlContent;
      if(state.activeTab === 'batch') activeHtml = batchContent;
      if(state.activeTab === 'help') activeHtml = helpContent;
      if(state.activeTab === 'sup') activeHtml = supContent;

      const panelHtml = `
      <div class="uni-dl-panel">
          <div class="uni-dl-head">
              <span style="font-weight:700;color:#fff;">${T.title}</span>
              <div style="display:flex;gap:10px;align-items:center">
                  <span id="uni-help" style="cursor:pointer;color:#4caf50;font-weight:bold;font-size:11px">[?]</span>
                  <span id="uni-min" style="cursor:pointer;color:#aaa">▼</span>
              </div>
          </div>
          <div class="uni-dl-tabs">
            <div class="uni-dl-tab ${state.activeTab==='dl'?'active':''}" id="tab-dl">${T.tab_dl}</div>
            <div class="uni-dl-tab ${state.activeTab==='batch'?'active':''}" id="tab-batch">${T.tab_batch}</div>
            <div class="uni-dl-tab ${state.activeTab==='help'?'active':''}" id="tab-help">${T.tab_help}</div>
            <div class="uni-dl-tab ${state.activeTab==='sup'?'active':''}" id="tab-sup">${T.tab_sup}</div>
          </div>
          <div class="uni-dl-body">${activeHtml}</div>
          <div class="uni-footer">${T.footer_txt}</div>
      </div>`;

      container.innerHTML = safeHTML(panelHtml);

      document.getElementById('uni-min').onclick = () => setUIMode(1);
      document.getElementById('uni-help').onclick = () => { state.activeTab='help'; renderUI(); };
      document.getElementById('tab-dl').onclick = () => { state.activeTab='dl'; renderUI(); };
      document.getElementById('tab-batch').onclick = () => { state.activeTab='batch'; renderUI(); };
      document.getElementById('tab-help').onclick = () => { state.activeTab='help'; renderUI(); };
      document.getElementById('tab-sup').onclick = () => { state.activeTab='sup'; renderUI(); };

      if(state.activeTab === 'dl') {
          document.getElementById('btn-uni-vid').onclick = sendVideo;
          document.getElementById('btn-uni-aud').onclick = sendAudio;
          document.getElementById('btn-uni-img').onclick = sendImage;
          document.getElementById('btn-uni-clear').onclick = clearList;
          document.getElementById('btn-uni-panel').onclick = () => GM_openInTab(`${SERVER_URL}/panel`, {active: true});
          bindDynamicEvents();
      } else if (state.activeTab === 'batch') {
          document.getElementById('btn-batch-proc').onclick = processBatch;
      } else if (state.activeTab === 'help') {
          document.getElementById('btn-dl-server').onclick = () => GM_openInTab(DRIVE_LINK, {active:true});
          document.getElementById('btn-back-help').onclick = () => { state.activeTab='dl'; renderUI(); };
      } else if (state.activeTab === 'sup') {
          container.querySelectorAll('.sup-copy').forEach(btn => { btn.onclick = (e) => copyToClipboard(e.target.dataset.val); });
      }
      updateListContent();
  };

  const addYouTubeButtons = () => {
      if(!IS_YOUTUBE) return;
      const container = document.querySelector('[id^="top-level-buttons"]');
      if (!container || container.querySelector("#uni-dl-yt-vid")) return;
      const style = "height:36px; padding:0 16px; border-radius:18px; margin-left:8px; cursor:pointer; font-weight:500; font-size:14px; border:none; display:inline-flex; align-items:center; justify-content:center;";
      const btnV = document.createElement("button");
      btnV.id = "uni-dl-yt-vid"; btnV.textContent = T.vid; btnV.style.cssText = style + "background:#3ea6ff; color:#0f0f0f;";
      btnV.onclick = () => sendMedia('video');
      const btnA = document.createElement("button");
      btnA.id = "uni-dl-yt-aud"; btnA.textContent = T.aud;
      btnA.style.cssText = style + "background:#d63384; color:#fff;";
      btnA.onclick = () => sendMedia('audio');
      container.appendChild(btnV); container.appendChild(btnA);
  };

  if(IS_YOUTUBE) {
      const observer = new MutationObserver(addYouTubeButtons);
      observer.observe(document.body, { childList: true, subtree: true });
  }

  setTimeout(() => renderUI(), 1000);
  setInterval(refreshData, POLLING_INTERVAL);
})();
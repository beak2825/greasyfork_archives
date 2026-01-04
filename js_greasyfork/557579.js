// ==UserScript==
// @name         YouTube Downloader - Local Server Interface - PRO
// @name:pt-BR   YouTube Downloader - Local Server Interface - PRO
// @name:es      YouTube Downloader - Local Server Interface - PRO
// @name:fr      YouTube Downloader - Local Server Interface - PRO
// @name:de      YouTube Downloader - Local Server Interface - PRO
// @name:it      YouTube Downloader - Local Server Interface - PRO
// @name:ru      YouTube Downloader - Local Server Interface - PRO
// @name:zh-CN   YouTube 下载器 - 本地服务器界面 - 专业版
// @name:zh-TW   YouTube 下載器 - 本地伺服器界面 - 專業版
// @name:zh-HK   YouTube 下載器 - 本地伺服器界面 - 專業版
// @name:zh-SG   YouTube 下载器 - 本地服务器界面 - 专业版
// @name:zh-MO   YouTube 下載器 - 本地伺服器界面 - 專業版
// @name:ja      YouTube Downloader - Local Server Interface - PRO
// @name:ko      YouTube Downloader - Local Server Interface - PRO
// @name:hi      YouTube Downloader - Local Server Interface - PRO
// @name:id      YouTube Downloader - Local Server Interface - PRO
// @namespace    http://tampermonkey.net/
// @version      3.12.7
// @description  The Best YouTube Downloader! Download Video (Full HD/4K/8K), Audio (MP3), Images, Record Livestreams & Screenshots via Local Server. Features: Universal Support, Batch Download, Shortcuts, Quality Selection, Resizable UI.
// @description:pt-BR A melhor ferramenta para baixar YouTube! Baixe Vídeos (Full HD/4K/8K), Áudio (MP3), Imagens, Grave Lives e Captura de Tela via Servidor Local. Recursos: Suporte Universal, Download em Lote, Atalhos, Seleção de Qualidade, UI Redimensionável.
// @description:es   ¡El mejor descargador de YouTube! Descarga Video (Full HD/4K/8K), Audio (MP3), Imágenes, Graba Transmisiones y Capturas de Pantalla a través del Servidor Local. Características: Soporte Universal, Descarga por Lotes, Atajos, Selección de Calidad, UI Redimensionable.
// @description:zh-CN 最好的YouTube下载器！通过本地服务器下载视频（全高清/4K/8K）、音频（MP3）、图片、录制直播和截图。功能：通用支持、批量下载、快捷键、质量选择、可调整大小的UI。
// @description:zh-TW 最好的YouTube下載器！透過本地伺服器下載影片（全高清/4K/8K）、音頻（MP3）、圖片、錄製直播和截圖。功能：通用支援、批次下載、快捷鍵、質量選擇、可調整大小的UI。
// @description:zh-HK 最好的YouTube下載器！透過本地伺服器下載影片（全高清/4K/8K）、音頻（MP3）、圖片、錄製直播和截圖。功能：通用支援、批量下載、快捷鍵、質量選擇、可調整大小的UI。
// @description:zh-SG 最好的YouTube下载器！通过本地服务器下载视频（全高清/4K/8K）、音频（MP3）、图片、录制直播和截图。功能：通用支持、批量下载、快捷键、质量选择、可调整大小的UI。
// @description:zh-MO 最好的YouTube下載器！透過本地伺服器下載影片（全高清/4K/8K）、音頻（MP3）、圖片、錄製直播和截圖。功能：通用支援、批量下載、快捷鍵、質量選擇、可調整大小的UI。
// @description:ru   Лучший загрузчик YouTube! Скачивайте Видео (Full HD/4K/8K), Аудио (MP3), Картинки, Запись Стримов и Скриншоты через локальный сервер. Функции: Универсальная поддержка, Выбор качества, Горячие клавиши, Изменяемый размер UI.
// @description:fr   Le meilleur téléchargeur YouTube ! Téléchargez Vidéo (Full HD/4K/8K), Audio (MP3), Images, Enregistrez Lives et Captures d'Écran via serveur local. Fonctionnalités : Support Universel, Raccourcis clavier, Sélection de Qualité, UI redimensionnable.
// @description:de   Der beste YouTube-Downloader! Video (Full HD/4K/8K), Audio (MP3), Bilder, Live-Streams aufnehmen & Screenshots über lokalen Server herunterladen. Features: Universelle Unterstützung, Tastenkürzel, Qualitätsauswahl, Anpassbare UI.
// @description:ja   最高のYouTubeダウンローダー！ローカルサーバー経由でビデオ（フルHD/4K/8K）、オーディオ（MP3）、画像、ライブ録画、スクリーンショットをダウンロード。機能：ユニバーサルサポート、ショートカット、品質選択、サイズ変更可能なUI。
// @description:it   Il miglior downloader di YouTube! Scarica Video (Full HD/4K/8K), Audio (MP3), Immagini, Registra Live e Screenshot tramite server locale. Funzioni: Supporto Universale, Scorciatoie da tastiera, Selezione Qualità, UI ridimensionabile.
// @description:hi   सर्वश्रेष्ठ यूट्यूब डाउनलोडर! स्थानीय सर्वर के माध्यम से वीडियो (पूर्ण एचडी/4K/8K), ऑडियो (MP3), चित्र, लाइव रिकॉर्डिंग और स्क्रीनशॉट डाउनलोड करें। विशेषताएं: यूनिवर्सल समर्थन, कीबोर्ड शॉर्टकट, गुणवत्ता चयन, आकार बदलने योग्य यूआई।
// @description:id   Pengunduh YouTube Terbaik! Unduh Video (Full HD/4K/8K), Audio (MP3), Gambar, Rekam Langsung & Tangkapan Layar melalui Server Lokal. Fitur: Dukungan Universal, Pintasan Keyboard, Pilihan Kualitas, UI yang Dapat Diubah Ukurannya.
// @description:ko   최고의 YouTube 다운로더! 로컬 서버를 통해 비디오(Full HD/4K/8K), 오디오(MP3), 이미지, 라이브 녹화 및 스크린샷을 다운로드하십시오。機能：범용 지원, 단축키, 품질 선택, 크기 조정 가능한 UI。
// @description:ar   أفضل تنزيل يوتيوب! قم بتنزيل الفيديو (Full HD/4K/8K) والصوت (MP3) والصور وتسجيل البث المباشر ولقطات الشاشة عبر الخادم المحلي。الميزات：الدعم العالمي ，اختصارات لوحة المفاتيح ，تحديد الجودة ，واجهة المستخدم القابلة لتغيير الحجم。
// @copyright    2025, Tauã B. Kloch Leite - All Rights Reserved.
// @author       Tauã B. Kloch Leite
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/557579/YouTube%20Downloader%20-%20Local%20Server%20Interface%20-%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/557579/YouTube%20Downloader%20-%20Local%20Server%20Interface%20-%20PRO.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.self !== window.top) return;

  let policy = null;
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
      try { policy = window.trustedTypes.createPolicy('yt-dl-policy', { createHTML: (s) => s }); } catch (e) { }
  }
  const safeHTML = (html) => policy ? policy.createHTML(html) : html;

  const SERVER_URL = "http://127.0.0.1:5000";
  const DRIVE_LINK = "https://drive.google.com/file/d/1RFw0VR_cnLpBjJbIajNz0XHESLVfIYG1/view?usp=sharing";
  const UPDATE_URL = "https://greasyfork.org/en/scripts/557579-youtube-downloader-local-server-interface-pro";
  const POLLING_INTERVAL = 1500;

  const ICONS = {
        pix: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg",
        paypal: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
        btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025",
        eth: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
        sol: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025",
        usdt: "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=025",
        bubble: "https://www.google.com/s2/favicons?sz=64&domain=youtube.com",
        warn: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Antu_dialog-warning.svg/200px-Antu_dialog-warning.svg.png"
  };

  const EN_BASE = {
        title: "Local Downloader PRO", tab_dl: "Downloads", tab_batch: "Batch List", tab_sup: "Donate", tab_help: "Help",
        vid: "🎬 Video", aud: "🎵 Audio", img: "🖼️ Image", queue: "Queue", done: "Done", err: "Error", refresh: "🔄 Refresh", clear: "🗑️ Clear",
        conn_err: "Server Offline? Start the App!", open: "Open", folder: "Folder", sup_title: "SUPPORT THE CODE", sup_desc: "Help keep updates coming!",
        lbl_pix: "PIX KEY (BR)", btn_copy: "COPY", auto_dl: "⬇️ Saved: ", wallet_title: "CRYPTO WALLETS", login_err: "⚠️ LOGIN NEEDED",
        retry: "Retry", cancel: "Cancel", open_panel: "🚀 Open Server Panel", toggle: "👁️ Show/Hide UI",
        help_btn: "❓ Help / Install", back: "Back to Panel",
        batch_ph: "Paste links here (one per line)...", batch_btn: "PROCESS LIST", batch_sent: "Links sent: ",
        sc_vid: "SHIFT + Right Click", sc_aud: "ALT + Right Click", sc_img: "CTRL + Right Click",
        pro_tip: "💡 PRO TIP: No need to open the video! Hold the shortcut key and use Right Click directly on the thumbnail.",
        err_old_ver: "⚠️ Requires New Universal Server!",
        help_login_err: "Login Error? Click the yellow warning.",
        footer_msg: "Tauã B. Kloch Leite - All Rights Reserved 2025",
        help_title: "INSTALLATION REQUIRED",
        help_s1: "1. Download Universal_Downloader.exe", help_s2: "2. Open the App", help_s3: "3. Click 'Start Server'",
        help_btn_dl: "DOWNLOAD SERVER", help_warn: "The script needs this app!",
        univ_note: "NOTE: The new server is UNIVERSAL. Update now!",
        menu_toggle: "👁️ Show/Hide UI (Alt+Shift+Y)", menu_help: "❓ Help / Shortcuts", menu_panel: "⚙️ Open Panel", menu_dl: "📥 Download Server",
        menu_update: "🔄 Check Update", btn_panel: "Panel",
        lbl_qual: "Quality:", q_best: "💎 Best (4K/8K)", q_1080: "📺 Full HD (1080p)", q_720: "HD (720p)", q_480: "SD (480p)",
        rec: "🔴 Rec Clip", rec_stop: "⏹️ Stop Rec", rec_err: "Rec Error",
        ss_btn: "📸 Frame", ss_ok: "✅ Frame Captured!",
        sc_rec: "ALT + R", sc_ss: "ALT + S",
        server_update_warn: "⚠️ ATTENTION: Update to Server v6.9.1 to fix Asian/Symbol filenames!",
        banner_msg: "NEW SERVER v6.9.1! Fixed file names (JP/CN/Symbols). Update now!",
        banner_btn: "UPDATE"
  };

  const STRINGS = {
    en: EN_BASE,
    pt: {
        ...EN_BASE,
        title: "Downloader Local PRO", tab_dl: "Downloads", tab_batch: "Lista Batch", tab_sup: "Doação", tab_help: "Ajuda",
        vid: "🎬 Vídeo", aud: "🎵 Áudio", img: "🖼️ Imagem", queue: "Fila", done: "Prontos", err: "Erros", refresh: "🔄 Atualizar", clear: "🗑️ Limpar",
        conn_err: "Servidor Offline? Inicie o App!", open: "Abrir", folder: "Pasta", sup_title: "APOIE O PROJETO", sup_desc: "Mantenha as atualizações vivas!",
        lbl_pix: "CHAVE PIX", btn_copy: "COPIAR", auto_dl: "⬇️ Salvo: ", wallet_title: "CARTEIRAS CRIPTO", login_err: "⚠️ LOGIN NECESSÁRIO",
        retry: "🔄 Reiniciar", cancel: "❌ Cancelar", open_panel: "🚀 Abrir Painel Server", toggle: "👁️ Mostrar/Ocultar UI",
        help_btn: "❓ Ajuda / Instalação", back: "Voltar para o Painel",
        batch_ph: "Cole os links aqui (um por linha)...", batch_btn: "PROCESSAR LISTA", batch_sent: "Links enviados: ",
        sc_vid: "SHIFT + Clique Direito", sc_aud: "ALT + Clique Direito", sc_img: "CTRL + Clique Direito",
        pro_tip: "💡 DICA PRO: Não precisa abrir o vídeo! Segure a tecla de atalho e use o Clique Direito na miniatura.",
        err_old_ver: "⚠️ Requer Novo Servidor Universal!",
        help_login_err: "Erro de Login? Clique no aviso amarelo.",
        footer_msg: "Tauã B. Kloch Leite - All Rights Reserved 2025",
        help_title: "INSTALAÇÃO NECESSÁRIA",
        help_s1: "1. Baixe o Universal_Downloader.exe", help_s2: "2. Abra o Aplicativo", help_s3: "3. Clique em 'Start Server'",
        help_btn_dl: "BAIXAR SERVIDOR", help_warn: "O script precisa disso!",
        univ_note: "NOTA: O novo servidor é UNIVERSAL. Atualize!",
        menu_toggle: "👁️ Mostrar/Ocultar UI (Alt+Shift+Y)", menu_help: "❓ Ajuda / Atalhos", menu_panel: "⚙️ Abrir Painel", menu_dl: "📥 Baixar Servidor",
        menu_update: "🔄 Verificar Atualização", btn_panel: "Painel",
        lbl_qual: "Qualidade:", q_best: "💎 Melhor (4K/8K)", q_1080: "📺 Full HD (1080p)", q_720: "HD (720p)", q_480: "SD (480p)",
        rec: "🔴 Gravar Clip", rec_stop: "⏹️ Parar Gravação", rec_err: "Erro ao Gravar",
        ss_btn: "📸 Capturar Frame", ss_ok: "✅ Frame Salvo!",
        sc_rec: "ALT + R", sc_ss: "ALT + S",
        server_update_warn: "⚠️ ATENÇÃO: Atualize para o Servidor v6.9.1 para corrigir nomes (JP/CN/Símbolos)!",
        banner_msg: "NOVO SERVIDOR v6.9.1! Correção de nomes de arquivos (JP/CN). Atualize!",
        banner_btn: "ATUALIZAR"
    },
    'zh-CN': {
        ...EN_BASE,
        title: "本地下载器专业版", tab_dl: "下载列表", tab_batch: "批量处理", tab_sup: "捐赠支持", tab_help: "帮助",
        vid: "🎬 视频", aud: "🎵 音频", img: "🖼️ 图片", queue: "队列中", done: "已完成", err: "错误", refresh: "🔄 刷新", clear: "🗑️ 清空",
        conn_err: "服务器离线？请启动应用程序！", open: "打开", folder: "文件夹", sup_title: "支持开发", sup_desc: "帮助持续更新！",
        lbl_pix: "PIX密钥 (巴西)", btn_copy: "复制", auto_dl: "⬇️ 已保存: ", wallet_title: "加密货币钱包", login_err: "⚠️ 需要登录",
        retry: "重试", cancel: "取消", open_panel: "🚀 打开服务器面板", toggle: "👁️ 显示/隐藏界面",
        help_btn: "❓ 帮助 / 安装", back: "返回面板",
        batch_ph: "在此粘贴链接 (每行一个)...", batch_btn: "处理列表", batch_sent: "链接已发送: ",
        sc_vid: "Shift + 右键", sc_aud: "Alt + 右键", sc_img: "Ctrl + 右键",
        pro_tip: "💡 专业提示：无需打开视频！按住快捷键并直接在缩略图上使用右键。",
        err_old_ver: "⚠️ 需要新通用服务器！",
        help_login_err: "登录错误？点击黄色警告。",
        footer_msg: "Tauã B. Kloch Leite - 版权所有 2025",
        help_title: "需要安装",
        help_s1: "1. 下载 Universal_Downloader.exe", help_s2: "2. 打开应用程序", help_s3: "3. 点击'启动服务器'",
        help_btn_dl: "下载服务器", help_warn: "脚本需要此应用程序！",
        univ_note: "注意：新服务器是通用的。立即更新！",
        menu_toggle: "👁️ 显示/隐藏界面 (Alt+Shift+Y)", menu_help: "❓ 帮助 / 快捷键", menu_panel: "⚙️ 打开面板", menu_dl: "📥 下载服务器",
        menu_update: "🔄 检查更新", btn_panel: "面板",
        lbl_qual: "质量:", q_best: "💎 最佳 (4K/8K)", q_1080: "📺 全高清 (1080p)", q_720: "高清 (720p)", q_480: "标清 (480p)",
        rec: "🔴 录制片段", rec_stop: "⏹️ 停止录制", rec_err: "录制错误",
        ss_btn: "📸 捕捉画面", ss_ok: "✅ 画面已保存！",
        sc_rec: "Alt + R", sc_ss: "Alt + S",
        server_update_warn: "⚠️ 注意：更新到服务器 v6.9.1 以修复亚洲/符号文件名！",
        banner_msg: "新服务器 v6.9.1！修复了文件名（日语/中文/符号）。立即更新！",
        banner_btn: "更新"
    },
    'zh-TW': {
        ...EN_BASE,
        title: "本地下載器專業版", tab_dl: "下載列表", tab_batch: "批次處理", tab_sup: "捐贈支持", tab_help: "幫助",
        vid: "🎬 影片", aud: "🎵 音頻", img: "🖼️ 圖片", queue: "佇列中", done: "已完成", err: "錯誤", refresh: "🔄 重新整理", clear: "🗑️ 清空",
        conn_err: "伺服器離線？請啟動應用程式！", open: "開啟", folder: "資料夾", sup_title: "支持開發", sup_desc: "幫助持續更新！",
        lbl_pix: "PIX金鑰 (巴西)", btn_copy: "複製", auto_dl: "⬇️ 已儲存: ", wallet_title: "加密貨幣錢包", login_err: "⚠️ 需要登入",
        retry: "重試", cancel: "取消", open_panel: "🚀 開啟伺服器面板", toggle: "👁️ 顯示/隱藏介面",
        help_btn: "❓ 幫助 / 安裝", back: "返回面板",
        batch_ph: "在此貼上連結 (每行一個)...", batch_btn: "處理清單", batch_sent: "連結已發送: ",
        sc_vid: "Shift + 右鍵", sc_aud: "Alt + 右鍵", sc_img: "Ctrl + 右鍵",
        pro_tip: "💡 專業提示：無需打開影片！按住快捷鍵並直接在縮圖上使用右鍵。",
        err_old_ver: "⚠️ 需要新通用伺服器！",
        help_login_err: "登入錯誤？點擊黃色警告。",
        footer_msg: "Tauã B. Kloch Leite - 版權所有 2025",
        help_title: "需要安裝",
        help_s1: "1. 下載 Universal_Downloader.exe", help_s2: "2. 開啟應用程式", help_s3: "3. 點擊'啟動伺服器'",
        help_btn_dl: "下載伺服器", help_warn: "腳本需要此應用程式！",
        univ_note: "注意：新伺服器是通用的。立即更新！",
        menu_toggle: "👁️ 顯示/隱藏介面 (Alt+Shift+Y)", menu_help: "❓ 幫助 / 快捷鍵", menu_panel: "⚙️ 開啟面板", menu_dl: "📥 下載伺服器",
        menu_update: "🔄 檢查更新", btn_panel: "面板",
        lbl_qual: "質量:", q_best: "💎 最佳 (4K/8K)", q_1080: "📺 全高清 (1080p)", q_720: "高清 (720p)", q_480: "標清 (480p)",
        rec: "🔴 錄製片段", rec_stop: "⏹️ 停止錄製", rec_err: "錄製錯誤",
        ss_btn: "📸 捕捉畫面", ss_ok: "✅ 畫面已儲存！",
        sc_rec: "Alt + R", sc_ss: "Alt + S",
        server_update_warn: "⚠️ 注意：更新到伺服器 v6.9.1 以修復亞洲/符號檔名！",
        banner_msg: "新伺服器 v6.9.1！修復了檔名（日語/中文/符號）。立即更新！",
        banner_btn: "更新"
    },
    'zh-HK': {
        ...EN_BASE,
        title: "本地下載器專業版", tab_dl: "下載列表", tab_batch: "批量處理", tab_sup: "捐贈支持", tab_help: "幫助",
        vid: "🎬 影片", aud: "🎵 音頻", img: "🖼️ 圖片", queue: "佇列中", done: "已完成", err: "錯誤", refresh: "🔄 重新整理", clear: "🗑️ 清空",
        conn_err: "伺服器離線？請啟動應用程式！", open: "開啟", folder: "資料夾", sup_title: "支持開發", sup_desc: "幫助持續更新！",
        lbl_pix: "PIX金鑰 (巴西)", btn_copy: "複製", auto_dl: "⬇️ 已儲存: ", wallet_title: "加密貨幣錢包", login_err: "⚠️ 需要登入",
        retry: "重試", cancel: "取消", open_panel: "🚀 開啟伺服器面板", toggle: "👁️ 顯示/隱藏介面",
        help_btn: "❓ 幫助 / 安裝", back: "返回面板",
        batch_ph: "在此貼上連結 (每行一個)...", batch_btn: "處理清單", batch_sent: "連結已發送: ",
        sc_vid: "Shift + 右鍵", sc_aud: "Alt + 右鍵", sc_img: "Ctrl + 右鍵",
        pro_tip: "💡 專業提示：無需打開影片！按住快捷鍵並直接在縮圖上使用右鍵。",
        err_old_ver: "⚠️ 需要新通用伺服器！",
        help_login_err: "登入錯誤？點擊黃色警告。",
        footer_msg: "Tauã B. Kloch Leite - 版權所有 2025",
        help_title: "需要安裝",
        help_s1: "1. 下載 Universal_Downloader.exe", help_s2: "2. 開啟應用程式", help_s3: "3. 點擊'啟動伺服器'",
        help_btn_dl: "下載伺服器", help_warn: "腳本需要此應用程式！",
        univ_note: "注意：新伺服器是通用的。立即更新！",
        menu_toggle: "👁️ 顯示/隱藏介面 (Alt+Shift+Y)", menu_help: "❓ 幫助 / 快捷鍵", menu_panel: "⚙️ 開啟面板", menu_dl: "📥 下載伺服器",
        menu_update: "🔄 檢查更新", btn_panel: "面板",
        lbl_qual: "質量:", q_best: "💎 最佳 (4K/8K)", q_1080: "📺 全高清 (1080p)", q_720: "高清 (720p)", q_480: "標清 (480p)",
        rec: "🔴 錄製片段", rec_stop: "⏹️ 停止錄製", rec_err: "錄製錯誤",
        ss_btn: "📸 捕捉畫面", ss_ok: "✅ 畫面已儲存！",
        sc_rec: "Alt + R", sc_ss: "Alt + S",
        server_update_warn: "⚠️ 注意：更新到伺服器 v6.9.1 以修復亞洲/符號檔名！",
        banner_msg: "新伺服器 v6.9.1！修復了檔名（日語/中文/符號）。立即更新！",
        banner_btn: "更新"
    },
    'zh-SG': {
        ...EN_BASE,
        title: "本地下载器专业版", tab_dl: "下载列表", tab_batch: "批量处理", tab_sup: "捐赠支持", tab_help: "帮助",
        vid: "🎬 视频", aud: "🎵 音频", img: "🖼️ 图片", queue: "队列中", done: "已完成", err: "错误", refresh: "🔄 刷新", clear: "🗑️ 清除",
        conn_err: "服务器离线？请启动应用程序！", open: "打开", folder: "文件夹", sup_title: "支持开发", sup_desc: "帮助持续更新！",
        lbl_pix: "PIX密钥 (巴西)", btn_copy: "复制", auto_dl: "⬇️ 已保存: ", wallet_title: "加密货币钱包", login_err: "⚠️ 需要登录",
        retry: "重试", cancel: "取消", open_panel: "🚀 打开服务器面板", toggle: "👁️ 显示/隐藏界面",
        help_btn: "❓ 帮助 / 安装", back: "返回面板",
        batch_ph: "在此粘贴链接 (每行一个)...", batch_btn: "处理列表", batch_sent: "链接已发送: ",
        sc_vid: "Shift + 右键", sc_aud: "Alt + 右键", sc_img: "Ctrl + 右键",
        pro_tip: "💡 专业提示：无需打开视频！按住快捷键并直接在缩略图上使用右键。",
        err_old_ver: "⚠️ 需要新通用服务器！",
        help_login_err: "登录错误？点击黄色警告。",
        footer_msg: "Tauã B. Kloch Leite - 版权所有 2025",
        help_title: "需要安装",
        help_s1: "1. 下载 Universal_Downloader.exe", help_s2: "2. 打开应用程序", help_s3: "3. 点击'启动服务器'",
        help_btn_dl: "下载服务器", help_warn: "脚本需要此应用程序！",
        univ_note: "注意：新服务器是通用的。立即更新！",
        menu_toggle: "👁️ 显示/隐藏界面 (Alt+Shift+Y)", menu_help: "❓ 帮助 / 快捷键", menu_panel: "⚙️ 打开面板", menu_dl: "📥 下载服务器",
        menu_update: "🔄 检查更新", btn_panel: "面板",
        lbl_qual: "质量:", q_best: "💎 最佳 (4K/8K)", q_1080: "📺 全高清 (1080p)", q_720: "高清 (720p)", q_480: "标清 (480p)",
        rec: "🔴 录制片段", rec_stop: "⏹️ 停止录制", rec_err: "录制错误",
        ss_btn: "📸 捕捉画面", ss_ok: "✅ 画面已保存！",
        sc_rec: "Alt + R", sc_ss: "Alt + S",
        server_update_warn: "⚠️ 注意：更新到服务器 v6.9.1 以修复亚洲/符号文件名！",
        banner_msg: "新服务器 v6.9.1！修复了文件名（日语/中文/符号）。立即更新！",
        banner_btn: "更新"
    },
    'zh-MO': {
        ...EN_BASE,
        title: "本地下載器專業版", tab_dl: "下載列表", tab_batch: "批量處理", tab_sup: "捐贈支持", tab_help: "幫助",
        vid: "🎬 影片", aud: "🎵 音頻", img: "🖼️ 圖片", queue: "佇列中", done: "已完成", err: "錯誤", refresh: "🔄 重新整理", clear: "🗑️ 清除",
        conn_err: "伺服器離線？請啟動應用程式！", open: "開啟", folder: "資料夾", sup_title: "支持開發", sup_desc: "幫助持續更新！",
        lbl_pix: "PIX金鑰 (巴西)", btn_copy: "複製", auto_dl: "⬇️ 已儲存: ", wallet_title: "加密貨幣錢包", login_err: "⚠️ 需要登入",
        retry: "重試", cancel: "取消", open_panel: "🚀 開啟伺服器面板", toggle: "👁️ 顯示/隱藏介面",
        help_btn: "❓ 幫助 / 安裝", back: "返回面板",
        batch_ph: "在此貼上連結 (每行一個)...", batch_btn: "處理清單", batch_sent: "連結已發送: ",
        sc_vid: "Shift + 右鍵", sc_aud: "Alt + 右鍵", sc_img: "Ctrl + 右鍵",
        pro_tip: "💡 專業提示：無需打開影片！按住快捷鍵並直接在縮圖上使用右鍵。",
        err_old_ver: "⚠️ 需要新通用伺服器！",
        help_login_err: "登入錯誤？點擊黃色警告。",
        footer_msg: "Tauã B. Kloch Leite - 版權所有 2025",
        help_title: "需要安裝",
        help_s1: "1. 下載 Universal_Downloader.exe", help_s2: "2. 開啟應用程式", help_s3: "3. 點擊'啟動伺服器'",
        help_btn_dl: "下載伺服器", help_warn: "腳本需要此應用程式！",
        univ_note: "注意：新伺服器是通用的。立即更新！",
        menu_toggle: "👁️ 顯示/隱藏介面 (Alt+Shift+Y)", menu_help: "❓ 幫助 / 快捷鍵", menu_panel: "⚙️ 開啟面板", menu_dl: "📥 下載伺服器",
        menu_update: "🔄 檢查更新", btn_panel: "面板",
        lbl_qual: "質量:", q_best: "💎 最佳 (4K/8K)", q_1080: "📺 全高清 (1080p)", q_720: "高清 (720p)", q_480: "標清 (480p)",
        rec: "🔴 錄製片段", rec_stop: "⏹️ 停止錄製", rec_err: "錄製錯誤",
        ss_btn: "📸 捕捉畫面", ss_ok: "✅ 畫面已儲存！",
        sc_rec: "Alt + R", sc_ss: "Alt + S",
        server_update_warn: "⚠️ 注意：更新到伺服器 v6.9.1 以修復亞洲/符號檔名！",
        banner_msg: "新伺服器 v6.9.1！修復了檔名（日語/中文/符號）。立即更新！",
        banner_btn: "更新"
    }
  };

  const getLang = () => {
      const l = navigator.language || "en";
      if (STRINGS[l]) return { ...EN_BASE, ...STRINGS[l] };
      const code = l.split('-')[0];
      if (code === 'zh') {
          // 对于中文变体，根据地区选择最合适的翻译
          // zh-CN: 简体中文 (中国大陆)
          // zh-SG: 简体中文 (新加坡)
          // zh-TW: 繁体中文 (台湾)
          // zh-HK: 繁体中文 (香港)
          // zh-MO: 繁体中文 (澳门)
          // 默认使用简体中文
          return { ...EN_BASE, ...STRINGS['zh-CN'] };
      }
      if (STRINGS[code]) return { ...EN_BASE, ...STRINGS[code] };
      return EN_BASE;
  };
  const T = getLang();

  const state = { uiMode: GM_getValue("yt_dl_uiMode", 1), stats: {}, items: [], activeTab: 'dl' };
  const imgCache = {};
  let lastHtml = '';
  let isServerOnline = false;
  let isProcessingClick = false;

  let mediaRecorder = null;
  let recordedChunks = [];
  let isRecording = false;

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
      GM_setValue("yt_dl_uiMode", m);
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
              const defW = 360;
              const defH = 500;
              const left = Math.max(0, (window.innerWidth / 2) - (defW / 2));
              const top = Math.max(0, (window.innerHeight / 2) - (defH / 2));

              container.style.position = 'fixed';
              container.style.left = left + 'px';
              container.style.top = top + 'px';
              container.style.width = defW + 'px';
              container.style.height = defH + 'px';
              container.style.bottom = 'auto';
              container.style.right = 'auto';
          }
      }
  };

  const applyStyles = (el, styles) => {
      if(styles.left) el.style.left = styles.left;
      if(styles.top) el.style.top = styles.top;
      if(styles.bottom) el.style.bottom = styles.bottom;
      if(styles.right) el.style.right = styles.right;
  };

  const getHistory = () => GM_getValue('yt_dl_history_local', []);
  const addToHistory = (f) => { let h=getHistory(); if(!h.includes(f)){ h.push(f); if(h.length>50)h.shift(); GM_setValue('yt_dl_history_local', h); }};

  const cleanFileName = (name) => {
      if (!name) return "download_unknown";

      return name
          .replace(/[<>:"/\\|?*]/g, "_")
          .replace(/[\x00-\x1F]/g, "")
          .replace(/^\.+|\.+$/g, "")
          .trim();
  };

  const generateRandomId = () => Math.floor(Math.random() * 900000) + 100000;

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

  const startRecording = () => {
      const video = document.querySelector('video');
      if (!video) { toast(T.rec_err, false); return; }
      try {
          const stream = video.captureStream();
          mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          recordedChunks = [];
          mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) recordedChunks.push(event.data); };
          mediaRecorder.onstop = () => {
              const blob = new Blob(recordedChunks, { type: 'video/webm' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `yt_rec_${new Date().getTime()}.webm`;
              a.click();
              window.URL.revokeObjectURL(url);
              updateRecButton(false);
          };
          mediaRecorder.start();
          isRecording = true;
          updateRecButton(true);
      } catch (e) {
          toast("Error: " + e.message, false);
      }
  };

  const stopRecording = () => { if (mediaRecorder && isRecording) { mediaRecorder.stop(); isRecording = false; } };
  const toggleRecording = () => { if (isRecording) stopRecording(); else startRecording(); };

  const updateRecButton = (active) => {
      const btn = document.getElementById('btn-rec');
      if (btn) {
          if (active) {
              btn.textContent = T.rec_stop;
              btn.classList.add('rec-active');
              btn.classList.remove('btn-gray');
          } else {
              btn.textContent = T.rec;
              btn.classList.remove('rec-active');
              btn.classList.add('btn-gray');
          }
      }
  };

  const captureFrame = () => {
      const video = document.querySelector('video');
      if (!video) { toast(T.err, false); return; }
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      try {
          const dataUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = dataUrl;
          const title = document.title.replace(' - YouTube', '') || 'snapshot';
          a.download = `${cleanFileName(title)}_${generateRandomId()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast(T.ss_ok);
      } catch (e) {
          toast("Error: " + e.message, false);
      }
  };

  const findMediaUrl = (target, mode) => {
      let foundUrl = null, foundThumb = null, foundTitle = null;
      if (mode === 'image') {
          const container = target.closest('ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-playlist-panel-video-renderer, ytd-reel-item-renderer');
          if (container) {
              const link = container.querySelector('a#thumbnail, a[href*="/watch"]');
              const imgEl = container.querySelector('ytd-thumbnail img') || container.querySelector('img');
              const titleEl = container.querySelector('#video-title');
              if (imgEl && imgEl.src) { foundUrl = imgEl.src.split('?')[0]; foundThumb = foundUrl; }
              else if (link) { const deepImg = link.querySelector('img'); if(deepImg) { foundUrl = deepImg.src.split('?')[0]; foundThumb = foundUrl; } }
              if (titleEl) { foundTitle = titleEl.textContent.trim() || titleEl.title; }
              if (foundUrl) {
                  if (!foundTitle) foundTitle = "Image_Sidebar";
                  const uniqueTitle = `${cleanFileName(foundTitle)}_${generateRandomId()}`;
                  return { url: foundUrl, thumb: foundThumb, title: uniqueTitle };
              }
          }
      }
      if (!foundUrl) {
          const link = target.closest('a[href*="/watch"], a[href*="/shorts/"]');
          if (link) {
              foundUrl = link.href;
              const vidId = getYoutubeVideoID(foundUrl);
              if (vidId) foundThumb = `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`;
              const container = target.closest('ytd-compact-video-renderer') || target.closest('ytd-video-renderer') || target.closest('ytd-rich-item-renderer');
              if (container) { const titleEl = container.querySelector('#video-title'); if (titleEl) foundTitle = titleEl.textContent.trim(); }
          }
      }
      if (!foundUrl) { foundUrl = window.location.href; foundTitle = document.title.replace(" - YouTube", ""); }
      if (foundUrl && !foundThumb && (window.location.pathname.startsWith('/watch') || window.location.pathname.startsWith('/shorts/'))) {
            const vidId = getYoutubeVideoID(foundUrl);
            if(vidId) foundThumb = `https://i.ytimg.com/vi/${vidId}/maxresdefault.jpg`;
      }
      if (!foundTitle) foundTitle = "Media";
      return { url: foundUrl, thumb: foundThumb, title: `${cleanFileName(foundTitle)}_${generateRandomId()}` };
  };

  const handleShortcut = (e, type) => {
      e.preventDefault();
      const media = findMediaUrl(e.target, type);
      if(media.url) send(type, media); else toast("Media Not Found", false);
  };

  document.addEventListener('contextmenu', (e) => {
      if (e.shiftKey) handleShortcut(e, 'video');
      if (e.altKey) handleShortcut(e, 'audio');
      if (e.ctrlKey) handleShortcut(e, 'image');
  });

  let isDraggingUI = false;
  const makeDraggable = (el) => {
      let startX, startY, initialLeft, initialTop;
      const onMouseDown = (e) => {
          if (state.uiMode === 2 && !e.target.closest('.yt-dl-head') && !e.target.closest('.yt-dl-footer')) return;
          if (state.uiMode === 1 && !e.target.closest('.yt-dl-bubble')) return;
          if (state.uiMode === 2) { const rect = el.getBoundingClientRect(); if (e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20) return; }
          isDraggingUI = true; el.dataset.moved = "false"; startX = e.clientX; startY = e.clientY;
          const rect = el.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top;
          el.style.bottom = 'auto'; el.style.right = 'auto'; el.style.left = initialLeft + 'px'; el.style.top = initialTop + 'px';
          e.preventDefault();
      };
      const onMouseMove = (e) => {
          if (!isDraggingUI) return;
          const dx = e.clientX - startX; const dy = e.clientY - startY;
          if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
              el.dataset.moved = "true"; el.style.left = (initialLeft + dx) + 'px'; el.style.top = (initialTop + dy) + 'px';
          }
      };
      const onMouseUp = () => {
          if (isDraggingUI) {
              isDraggingUI = false;
              if (state.uiMode === 1) bubblePos = { left: el.style.left, top: el.style.top, bottom: 'auto', right: 'auto' };
              else panelPos = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height };
          }
      };
      el.addEventListener('mousedown', onMouseDown); window.addEventListener('mousemove', onMouseMove); window.addEventListener('mouseup', onMouseUp);
  };

  const clearList = async () => { try { await gmFetch(`${SERVER_URL}/clear`, { method: 'POST', customTimeout: 1000 }); } catch(e){ } GM_setValue('yt_dl_history_local', []); state.items = []; state.stats = { total:0, in_progress:0, finished:0, errors:0 }; lastHtml = ''; updateListContent(); };
  const openLocalFile = async (filename) => { try { await gmFetch(`${SERVER_URL}/open_file`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({filename: filename}), customTimeout: 1000 }); } catch(e) { if(e === "OFFLINE") toast(T.conn_err, false); } };
  const openFolder = async (type) => { try { await gmFetch(`${SERVER_URL}/open_folder`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({type: type}), customTimeout: 1000 }); } catch(e) { if(e === "OFFLINE") toast(T.conn_err, false); } };
  const copyToClipboard = (text) => { GM_setClipboard(text); toast(T.btn_copy + " OK!"); };
  const cancelDownload = async (id) => { try { await gmFetch(`${SERVER_URL}/cancel`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: id}), customTimeout: 1000 }); toast(T.cancel + " OK"); refreshData(); } catch(e) { } };

  const updateButtonState = () => {
      if(!container || state.uiMode !== 2) return;
      const path = window.location.pathname;
      const isVideoPage = path.startsWith('/watch') || path.startsWith('/shorts/');
      const hasVideoElement = !!document.querySelector('video');

      ['btn-vid', 'btn-aud', 'btn-img'].forEach(id => {
          const btn = document.getElementById(id);
          if(btn) {
              btn.disabled = !isVideoPage;
              if (btn.disabled) {
                  btn.style.opacity = "0.4";
                  btn.style.filter = "grayscale(100%)";
                  btn.style.cursor = "not-allowed";
              } else {
                  btn.style.opacity = "1";
                  btn.style.filter = "none";
                  btn.style.cursor = "pointer";
              }
          }
      });

      const btnRec = document.getElementById('btn-rec');
      if (btnRec && !isRecording) {
           btnRec.disabled = !(isVideoPage && hasVideoElement);
           if (btnRec.disabled) {
               btnRec.style.opacity = "0.4";
               btnRec.style.filter = "grayscale(100%)";
               btnRec.style.cursor = "not-allowed";
           } else {
               btnRec.style.opacity = "1";
               btnRec.style.filter = "none";
               btnRec.style.cursor = "pointer";
           }
      }

      const btnSs = document.getElementById('btn-ss');
      if (btnSs) {
           btnSs.disabled = !(isVideoPage && hasVideoElement);
           if (btnSs.disabled) {
               btnSs.style.opacity = "0.4";
               btnSs.style.filter = "grayscale(100%)";
               btnSs.style.cursor = "not-allowed";
           } else {
               btnSs.style.opacity = "1";
               btnSs.style.filter = "none";
               btnSs.style.cursor = "pointer";
           }
      }
  };

  const processBatch = () => {
      const area = document.getElementById('yt-dl-batch-area'); if(!area) return;
      const lines = area.value.split('\n'); let count = 0;
      lines.forEach(line => { const url = line.trim(); if(url.startsWith('http')) { send('video', { url: url, thumb: null, title: `Batch_${generateRandomId()}` }); count++; } });
      area.value = ''; lastHtml = ''; toast(`${T.batch_sent}${count}`); state.activeTab = 'dl'; renderUI();
  };

  const refreshData = async () => {
      updateButtonState();
      try {
          const [sRes, fRes] = await Promise.all([ gmFetch(`${SERVER_URL}/stats`, { customTimeout: 1000 }), gmFetch(`${SERVER_URL}/files`, { customTimeout: 1000 }) ]);
          isServerOnline = true;
          state.stats = await sRes.json();
          const files = await fRes.json();
          state.items = files.items || [];
          state.items.forEach(i => { if(i.status === 'finished' && i.filename && !getHistory().includes(i.filename)) { addToHistory(i.filename); toast(T.auto_dl + i.title.substring(0,20)+"..."); } });
          if(state.uiMode === 2) updateListContent();
      } catch (e) { isServerOnline = false; }
  };

  const send = async (type, mediaData) => {
      if (!isServerOnline) { toast(T.conn_err, false); gmFetch(`${SERVER_URL}/stats`, { customTimeout: 500 }).then(()=> isServerOnline=true).catch(()=>{}); return; }
      if (isProcessingClick) return;
      isProcessingClick = true; setTimeout(() => isProcessingClick = false, 500);

      try {
          let finalUrl, thumbUrl, title;
          if (typeof mediaData === 'object' && mediaData.url) { finalUrl = mediaData.url; thumbUrl = mediaData.thumb; title = mediaData.title; }
          else { finalUrl = location.href; const extracted = findMediaUrl(document.body, type); thumbUrl = extracted.thumb; title = extracted.title; }

          let endpoint = 'download';
          if (type === 'audio') endpoint = 'download_audio';
          if (type === 'image') endpoint = 'download_image';

          const quality = document.getElementById('yt-dl-quality') ? document.getElementById('yt-dl-quality').value : 'best';

          const cleanTitle = cleanFileName(title);
          console.log("[YT-DL] Sending Title:", cleanTitle);

          const response = await gmFetch(`${SERVER_URL}/${endpoint}`, {
              method: 'POST', headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ videoUrl: finalUrl, thumb: thumbUrl, type: type, title: cleanTitle, quality: quality }),
              customTimeout: 2500
          });

          if (!response.ok) { if (type === 'image') throw new Error("OLD_SERVER"); throw new Error("Generic Error"); }
          lastHtml = ''; refreshData(); toast(`${type.toUpperCase()} OK 🚀`);
          if(state.uiMode === 1) setUIMode(2);
      } catch(e) {
          if (e === "OFFLINE") { toast(T.conn_err, false); isServerOnline = false; }
          else if (e.message === "OLD_SERVER") { toast(T.err_old_ver, false); }
          else { toast(T.conn_err, false); }
      }
  };

  const css = `
    .yt-dl-container { font-family: 'Roboto', sans-serif; z-index: 2147483647; position: fixed; bottom: 20px; left: 20px; }
    @media (max-width: 768px) { .yt-dl-panel { width: 90% !important; left: 5% !important; bottom: 10px !important; } }
    .yt-dl-bubble { width: 60px; height: 60px; background: transparent; border: none; cursor: move; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
    .yt-dl-bubble img { width: 100%; height: 100%; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.6)); }
    .yt-dl-bubble:hover { transform: scale(1.1); }

    .yt-dl-panel { width: 360px; height: 500px; min-width: 320px; min-height: 300px; max-width: 95vw; max-height: 80vh; resize: both; overflow: hidden; display: flex; flex-direction: column; background: #0f0f0f; color: #fff; border-radius: 12px; border: 1px solid #333; font-size: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.9); animation: slideUp 0.3s ease-out; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .yt-dl-head { background: #1a1a1a; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; cursor: move; flex-shrink: 0; }
    .yt-dl-min-btn { cursor: pointer; font-size: 18px; color: #aaa; padding: 0 5px; } .yt-dl-min-btn:hover { color: #fff; }
    .progress-bg { width: 100%; height: 4px; background: #333; margin-top: 4px; border-radius: 2px; overflow: hidden; }
    .progress-fill { height: 100%; background: #4caf50; width: 0%; transition: width 0.3s ease; }
    .prog-text { font-size: 9px; color: #888; text-align: right; margin-top: 2px; }
    .yt-dl-tabs { display: flex; background: #111; flex-shrink: 0; }
    .yt-dl-tab { flex: 1; text-align: center; padding: 10px 0; cursor: pointer; color: #aaa; border-bottom: 2px solid transparent; font-weight: 700; text-transform: uppercase; font-size: 10px; }
    .yt-dl-tab.active { color: #fff; border-bottom: 2px solid #d63384; background: #222; }
    .yt-dl-body { flex: 1; overflow-y: auto; padding: 15px; }
    .yt-dl-footer { text-align: center; font-size: 9px; color: #555; border-top: 1px solid #222; padding: 8px 0; flex-shrink: 0; background: #0f0f0f; cursor: move; }
    .yt-dl-btn-group { display: flex; gap: 8px; margin-bottom: 5px; }
    .yt-dl-btn { flex: 1; border: none; padding: 10px; border-radius: 6px; cursor: pointer; color: #fff; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 5px; transition: 0.2s; }
    .yt-dl-btn:hover { filter: brightness(1.1); }
    .btn-blue { background: #3ea6ff; color: #000; } .btn-purple { background: #d63384; } .btn-gray { background: #333; border: 1px solid #444; } .btn-red { background: #d32f2f; } .btn-orange { background: #ff9800; color:#000; }
    .yt-dl-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #222; }
    .yt-dl-thumb { width: 50px; height: 50px; background: #000; border-radius: 6px; object-fit: cover; }
    .yt-dl-info { flex: 1; overflow: hidden; }
    .yt-dl-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; font-size: 12px; margin-bottom: 4px; }
    .yt-dl-status { font-size: 10px; display: flex; align-items: center; gap: 6px; }
    .tag-type { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px; text-transform: uppercase; }
    .tag-vid { background: #0f3d5c; color: #3ea6ff; border: 1px solid #1e5985; } .tag-aud { background: #3c1f30; color: #ff66b2; border: 1px solid #7d2a58; } .tag-img { background: #3d2b0f; color: #ff9800; border: 1px solid #855a15; }
    .ctrl-btn { background: #333; border: 1px solid #444; color: #ccc; cursor: pointer; font-size: 10px; border-radius: 4px; padding: 3px 8px; margin-left: 5px; }
    .ctrl-btn:hover { background: #555; color: #fff; }
    .btn-retry { color: #4caf50; border-color: #2e7d32; } .btn-cancel { color: #f44336; border-color: #c62828; }
    .sup-row { display: flex; align-items: center; gap: 8px; background: #1a1a1a; padding: 8px; border-radius: 6px; border: 1px solid #333; margin-bottom: 8px; }
    .sup-icon { width: 20px; height: 20px; object-fit: contain; }
    .sup-val { flex: 1; background: none; border: none; color: #eee; font-size: 11px; font-family: monospace; outline: none; }
    .sup-copy { background: #d63384; border: none; color: #fff; border-radius: 4px; cursor: pointer; font-size: 10px; padding: 4px 8px; }
    .auth-fix-btn { cursor: pointer; text-decoration: underline; } .auth-fix-btn:hover { color: #fff !important; }
    .batch-area { width: 100%; height: 100px; background: #0a0a0a; color: #ddd; border: 1px solid #333; padding: 10px; font-size: 11px; box-sizing: border-box; resize: vertical; margin-bottom: 10px; border-radius: 6px; }
    .yt-dl-toast { position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 10px 20px; border-radius: 4px; z-index: 2147483648; font-weight: bold; animation: fadein 0.5s; }
    @keyframes fadein { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
    .yt-dl-select { width: 100%; background: #1a1a1a; color: #fff; border: 1px solid #333; border-radius: 6px; padding: 8px; margin-bottom: 8px; font-size: 11px; outline: none; cursor: pointer; }
    .yt-dl-select:hover { border-color: #555; }
    .rec-active { background: #f00 !important; color: #fff !important; animation: pulse 1.5s infinite; }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(255, 0, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); } }
    .btn-group-v { display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1; }
    .sc-label { font-size: 9px; font-weight: bold; margin-top: 2px; text-align: center; white-space: nowrap; }
    .yt-dl-banner { background: linear-gradient(90deg, #d63384, #ff9800); color: white; padding: 12px; margin-bottom: 10px; border-radius: 6px; font-weight: bold; font-size: 12px; display: flex; justify-content: space-between; align-items: center; animation: slideUp 0.5s; }
  `;
  const injectCSS = () => { if(!document.getElementById("yt-dl-style")) { const s=document.createElement("style"); s.id="yt-dl-style"; s.textContent=css; document.head.appendChild(s); }};

  const toast = (msg, success=true) => {
      const existing = document.querySelector('.yt-dl-toast'); if (existing) existing.remove();
      const el=document.createElement("div"); el.className="yt-dl-toast"; el.textContent=msg;
      if(!success) el.style.background="#f44336";
      document.body.appendChild(el); setTimeout(()=> { if(el.parentNode) el.remove(); }, 3000);
  };

  let container;

  const generateListHTML = () => {
      if(state.items.length === 0) return `<div style="text-align:center;color:#444;padding:20px;">Empty list</div>`;
      return state.items.slice().reverse().slice(0,5).map(i => {
            const isAud = i.type === 'audio'; const isImg = i.type === 'image';
            let tagClass = 'tag-vid'; let tagTxt = 'MP4';
            if(isAud) { tagClass='tag-aud'; tagTxt='MP3'; }
            if(isImg) { tagClass='tag-img'; tagTxt='IMG'; }

            let statusHtml = `<span style="color:${i.status==='finished'?'#4caf50':(i.status==='error'?'#f44336':'#aaa')}">${i.status}</span>`;
            if(i.status==='auth_error') statusHtml = `<span class="auth-fix-btn" style="color:#ff9800;font-weight:bold" title="Click to Fix">${T.login_err}</span>`;
            if(i.status==='cancelled') statusHtml = `<span style="color:#f44336;font-size:10px">${T.cancel}</span>`;

            let progressHtml = '';
            if (i.status === 'downloading' || i.status === 'recording') {
                let pct = i.progress ? i.progress : 0;
                if(i.status === 'recording') pct = 100;
                progressHtml = `
                <div class="progress-bg"><div class="progress-fill" style="width:${pct}%"></div></div>
                <div class="prog-text">${i.status === 'recording' ? 'REC ●' : pct + '%'}</div>`;
            }

            let actions = '';
            if(i.status === 'downloading' || i.status === 'queued' || i.status === 'recording') {
                actions = `<button class="ctrl-btn btn-cancel" data-act="cancel" data-id="${i.id}">${T.cancel}</button>`;
            } else if(i.status === 'finished') {
                actions = `<button class="ctrl-btn" data-act="open" data-file="${encodeURIComponent(i.filename)}">▶️</button> <button class="ctrl-btn" data-act="folder" data-type="${i.type}">📂</button>`;
            } else if(i.status === 'error' || i.status === 'cancelled' || i.status === 'auth_error') {
                actions = `<button class="ctrl-btn btn-retry" data-act="retry" data-url="${i.url}" data-type="${i.type}" data-thumb="${i.thumb}">${T.retry}</button>`;
            }

            let thumbSrc = ""; let useTunnel = false; let dataTunnel = "";
            if (i.thumb && i.thumb.length > 5) { thumbSrc = i.thumb; if (!i.thumb.startsWith('https://')) useTunnel = true; dataTunnel = i.thumb; }
            else if (i.status === 'finished' && i.type === 'image' && i.filename) { dataTunnel = `/file/${encodeURIComponent(i.filename)}`; useTunnel = true; }
            if(imgCache[i.id]) { thumbSrc = imgCache[i.id]; useTunnel = false; }

            const imgHTML = `<img class="yt-dl-thumb" src="${useTunnel ? '' : thumbSrc}" ${useTunnel && !imgCache[i.id] ? `data-tunnel="${dataTunnel}" data-id="${i.id}"` : ''} onerror="this.style.display='none'">`;
            return `<div class="yt-dl-item">${imgHTML}<div class="yt-dl-info"><div class="yt-dl-name" title="${i.title}">${isAud?'🎵':(isImg?'🖼️':'🎬')} ${i.title||'...'}</div><div class="yt-dl-status"><span class="tag-type ${tagClass}">${tagTxt}</span>${statusHtml}</div>${progressHtml}</div><div style="display:flex; flex-direction:column; gap:2px;">${actions}</div></div>`;
      }).join('');
  };

  const updateListContent = () => {
      if(!container || state.uiMode !== 2) return;
      const listEl = document.getElementById('yt-dl-list');
      const statsEl = document.getElementById('yt-dl-stats-bar');
      const newHtml = generateListHTML();
      if(listEl && newHtml !== lastHtml) {
          listEl.innerHTML = safeHTML(newHtml); lastHtml = newHtml;
          listEl.querySelectorAll('img[data-tunnel]').forEach(img => { const url = img.getAttribute('data-tunnel'); const id = img.getAttribute('data-id'); if(url && id) tunnelUniversalImage(img, url, id); });
          bindListButtons();
      }
      if(statsEl) statsEl.innerHTML = safeHTML(`<span>${T.queue}: <b style="color:#ffeb3b">${state.stats.in_progress||0}</b></span> <span>${T.done}: <b style="color:#4caf50">${state.stats.finished||0}</b></span> <span>${T.err}: <b style="color:#f44336">${state.stats.errors||0}</b></span>`);
  };

  const bindListButtons = () => {
      if(!container) return;
      container.querySelectorAll('.ctrl-btn').forEach(b => {
          b.onclick = (e) => {
              const d = e.target.dataset;
              if(d.act === 'open') openLocalFile(decodeURIComponent(d.file));
              if(d.act === 'folder') openFolder(d.type);
              if(d.act === 'cancel') cancelDownload(d.id);
              if(d.act === 'retry') send(d.type, d.url, d.thumb);
          };
      });
      container.querySelectorAll('.auth-fix-btn').forEach(b => { b.onclick = (e) => { e.preventDefault(); GM_openInTab(`${SERVER_URL}/panel?tab=cook`, {active: true}); }; });
  };

  const renderUI = () => {
      injectCSS();
      if(!container) { container=document.createElement('div'); container.className='yt-dl-container'; document.body.appendChild(container); makeDraggable(container); }
      if(state.uiMode === 0) { container.style.display = 'none'; return; }
      container.style.display = 'block';

      if(state.uiMode === 1) {
          container.innerHTML = safeHTML(`<div class="yt-dl-bubble" id="yt-dl-bubble-btn" title="${T.open}"><img src="${ICONS.bubble}"></div>`);
          document.getElementById('yt-dl-bubble-btn').onclick = () => { if(container.dataset.moved !== "true") setUIMode(2); };
          return;
      }

      let bannerHtml = '';
      if (!GM_getValue('yt_dl_seen_v691_banner', false)) {
          bannerHtml = `
          <div class="yt-dl-banner" id="yt-dl-banner-v69">
            <span>${T.banner_msg}</span>
            <button id="btn-close-banner" style="background:white;color:#d63384;border:none;border-radius:4px;cursor:pointer;padding:2px 8px;font-weight:bold">${T.banner_btn}</button>
          </div>`;
      }

      const dlContent = `
        ${bannerHtml}
        <select id="yt-dl-quality" class="yt-dl-select">
            <option value="best">${T.q_best}</option>
            <option value="1080">${T.q_1080}</option>
            <option value="720">${T.q_720}</option>
            <option value="480">${T.q_480}</option>
        </select>

        <div class="yt-dl-btn-group">
            <div class="btn-group-v">
                <button class="yt-dl-btn btn-blue" id="btn-vid" style="width:100%">${T.vid}</button>
                <div class="sc-label" style="color:#3ea6ff">${T.sc_vid}</div>
            </div>
            <div class="btn-group-v">
                <button class="yt-dl-btn btn-purple" id="btn-aud" style="width:100%">${T.aud}</button>
                <div class="sc-label" style="color:#d63384">${T.sc_aud}</div>
            </div>
            <div class="btn-group-v">
                <button class="yt-dl-btn btn-orange" id="btn-img" style="width:100%">${T.img}</button>
                <div class="sc-label" style="color:#ff9800">${T.sc_img}</div>
            </div>
        </div>

        <div style="display:flex; gap:8px; margin:10px 0;">
            <div class="btn-group-v">
                <button class="yt-dl-btn btn-gray" id="btn-rec" style="width:100%">${T.rec}</button>
                <div class="sc-label" style="color:#f44336">${T.sc_rec}</div>
            </div>
            <div class="btn-group-v">
                <button class="yt-dl-btn btn-purple" id="btn-ss" style="width:100%">${T.ss_btn}</button>
                <div class="sc-label" style="color:#9c27b0">${T.sc_ss}</div>
            </div>
        </div>

        <div style="background:#222; color:#ffeb3b; padding:8px; border-radius:6px; font-size:10px; margin-bottom:12px; line-height:1.4; border:1px solid #444;">${T.pro_tip}</div>
        <div id="yt-dl-stats-bar" style="font-size:10px; color:#aaa; display:flex; justify-content:space-between; margin-bottom:10px; background:#1a1a1a; padding:8px; border-radius:6px;"><span>${T.queue}: ...</span></div>
        <div id="yt-dl-list">${generateListHTML()}</div>
        <div style="margin-top:15px; display:flex; gap:5px;">
            <button class="yt-dl-btn btn-gray" id="btn-refresh" style="font-size:11px; padding:6px; flex:1;">${T.refresh}</button>
            <button class="yt-dl-btn btn-blue" id="btn-open-panel" style="font-size:11px; padding:6px; flex:1;">${T.btn_panel}</button>
            <button class="yt-dl-btn btn-red" id="btn-clear" style="font-size:11px; padding:6px; flex:1;">${T.clear}</button>
        </div>`;

      const batchContent = `<div style="padding:5px"><textarea id="yt-dl-batch-area" class="batch-area" placeholder="${T.batch_ph}"></textarea><button id="btn-batch-proc" class="yt-dl-btn btn-purple" style="width:100%">${T.batch_btn}</button></div>`;

      const helpContent = `
        <div style="padding:20px; text-align:center;">
            <img src="${ICONS.warn}" style="width:50px;margin-bottom:10px;" onerror="this.src='https://img.icons8.com/?size=100&id=42452&format=png&color=ff9800'">
            <div style="background:#ffeb3b; color:#000; padding:10px; border-radius:6px; font-weight:bold; margin-bottom:15px; font-size:11px; border:2px solid #fbc02d;">${T.server_update_warn}</div>
            <h3 style="color:#fff;margin:0 0 15px 0;font-size:16px;">${T.help_title}</h3>
            <div style="background:#1a1a1a; border-radius:8px; padding:20px; text-align:left; font-size:12px; line-height:1.8; color:#ccc; border:1px solid #333;">
                <div style="margin-bottom:5px"><b>${T.help_s1}</b></div>
                <div style="margin-bottom:5px"><b>${T.help_s2}</b></div>
                <div style="margin-bottom:5px"><b>${T.help_s3}</b></div>
            </div>
            <p style="color:#f44336; font-size:11px; font-weight:bold; margin:15px 0 15px;">${T.help_warn}</p>
            <button id="btn-do-download" style="background:#4caf50; color:white; border:none; padding:12px 20px; border-radius:6px; font-weight:bold; cursor:pointer; width:100%; font-size:14px; box-shadow:0 4px 15px rgba(76,175,80,0.3); text-transform:uppercase;">${T.help_btn_dl}</button>
            <div style="margin-top:10px; font-size:10px; color:#4caf50; font-weight:bold">${T.univ_note}</div>
            <div style="background:#b71c1c; color:#fff; font-weight:bold; padding:8px; border-radius:6px; font-size:11px; margin-top:10px;">${T.help_login_err}</div>
            <div id="btn-back-dl" style="margin-top:20px; font-size:12px; color:#aaa; cursor:pointer; text-decoration:underline;">${T.back}</div>
        </div>`;

      const cryptoList = [ {img: ICONS.btc, name: "BTC", val: "bc1q6gz3dtj9qvlxyyh3grz35x8xc7hkuj07knlemn"}, {img: ICONS.eth, name: "ETH", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"}, {img: ICONS.sol, name: "SOL", val: "7ztAogE7SsyBw7mwVhUr5ZcjUXQr99JoJ6oAgP99aCn"}, {img: ICONS.usdt, name: "USDT", val: "0xd8724d0b19d355e9817d2a468f49e8ce067e70a6"} ].map(c => `<div class="sup-row"><img src="${c.img}" class="sup-icon"><span style="font-size:9px;color:#888;width:30px">${c.name}</span><input type="text" class="sup-val" readonly value="${c.val}"><button class="sup-copy" data-val="${c.val}">${T.btn_copy}</button></div>`).join('');
      const supContent = `<div style="padding:15px;text-align:center"><div style="color:#d63384;font-weight:bold;margin-bottom:5px">${T.sup_title}</div><div style="color:#aaa;font-size:11px;margin-bottom:15px">${T.sup_desc}</div><div style="text-align:left;color:#d63384;font-weight:bold;font-size:10px;margin-bottom:5px">${T.lbl_pix}</div><div class="sup-row"><img src="${ICONS.pix}" class="sup-icon"><input type="text" class="sup-val" readonly value="69993230419"><button class="sup-copy" data-val="69993230419">${T.btn_copy}</button></div><div style="text-align:left;color:#d63384;font-weight:bold;font-size:10px;margin:15px 0 5px">${T.wallet_title}</div>${cryptoList}<div style="text-align:center;margin-top:20px;"><a href="https://www.paypal.com/donate/?business=4J4UK7ACU3DS6" target="_blank" style="display:inline-flex;align-items:center;gap:8px;background:#003087;color:white;padding:8px 20px;border-radius:20px;text-decoration:none;font-weight:bold;font-size:12px"><img src="${ICONS.paypal}" style="height:20px"> PayPal</a></div></div>`;

      let activeContent = dlContent;
      if (state.activeTab === 'sup') activeContent = supContent;
      if (state.activeTab === 'help') activeContent = helpContent;
      if (state.activeTab === 'batch') activeContent = batchContent;

      const panelHtml = `
      <div class="yt-dl-panel">
          <div class="yt-dl-head"><span style="font-weight:700;color:#fff;font-size:13px;">${T.title}</span><div style="display:flex;gap:10px;align-items:center"><span id="yt-dl-help-btn" style="cursor:pointer;font-size:12px;color:${state.activeTab==='help'?'#fff':'#4caf50'};font-weight:bold" title="${T.help_btn}">[?]</span><span class="yt-dl-min-btn" id="yt-dl-min" title="Minimize">▼</span></div></div>
          <div class="yt-dl-tabs"><div class="yt-dl-tab ${state.activeTab==='dl'?'active':''}" id="tab-btn-dl">${T.tab_dl}</div><div class="yt-dl-tab ${state.activeTab==='batch'?'active':''}" id="tab-btn-batch">${T.tab_batch}</div><div class="yt-dl-tab ${state.activeTab==='sup'?'active':''}" id="tab-btn-sup">${T.tab_sup}</div><div class="yt-dl-tab ${state.activeTab==='help'?'active':''}" id="tab-btn-help">${T.tab_help}</div></div>
          <div class="yt-dl-body">${activeContent}</div>
          <div class="yt-dl-footer">${T.footer_msg}</div>
      </div>`;

      container.innerHTML = safeHTML(panelHtml);

      const btnCloseBanner = document.getElementById('btn-close-banner');
      if (btnCloseBanner) btnCloseBanner.onclick = () => { GM_setValue('yt_dl_seen_v691_banner', true); GM_openInTab(DRIVE_LINK, {active:true}); renderUI(); };

      document.getElementById('yt-dl-min').onclick = () => setUIMode(1);
      document.getElementById('yt-dl-help-btn').onclick = () => { state.activeTab='help'; renderUI(); };
      document.getElementById('tab-btn-dl').onclick = () => { state.activeTab='dl'; renderUI(); };
      document.getElementById('tab-btn-batch').onclick = () => { state.activeTab='batch'; renderUI(); };
      document.getElementById('tab-btn-sup').onclick = () => { state.activeTab='sup'; renderUI(); };
      document.getElementById('tab-btn-help').onclick = () => { state.activeTab='help'; renderUI(); };

      if(state.activeTab === 'dl') {
          document.getElementById('btn-vid').onclick = () => send('video');
          document.getElementById('btn-aud').onclick = () => send('audio');
          document.getElementById('btn-img').onclick = () => send('image');
          document.getElementById('btn-rec').onclick = toggleRecording;
          document.getElementById('btn-ss').onclick = captureFrame;
          document.getElementById('btn-refresh').onclick = refreshData;
          document.getElementById('btn-clear').onclick = clearList;
          document.getElementById('btn-open-panel').onclick = () => GM_openInTab(SERVER_URL + '/panel', {active:true});
          bindListButtons();
      } else if (state.activeTab === 'batch') { document.getElementById('btn-batch-proc').onclick = processBatch;
      } else if (state.activeTab === 'help') { document.getElementById('btn-do-download').onclick = () => GM_openInTab(DRIVE_LINK, {active:true}); document.getElementById('btn-back-dl').onclick = () => { state.activeTab='dl'; renderUI(); };
      } else { container.querySelectorAll('.sup-copy').forEach(btn => { btn.onclick = (e) => copyToClipboard(e.target.dataset.val); }); }
      updateListContent();
      updateButtonState();
  };

  const addInlineButtons = () => {
      const container = document.querySelector('[id^="top-level-buttons"]');
      if (!container || container.querySelector("#yt-dl-inline-vid")) return;
      const style = "height:36px; padding:0 16px; border-radius:18px; margin-left:8px; cursor:pointer; font-weight:500; font-size:14px; border:none; display:inline-flex; align-items:center; justify-content:center;";
      const btnV = document.createElement("button"); btnV.id = "yt-dl-inline-vid"; btnV.textContent = T.vid; btnV.style.cssText = style + "background:#3ea6ff; color:#0f0f0f;"; btnV.onclick = (e) => { e.preventDefault(); send('video'); };
      const btnA = document.createElement("button"); btnA.id = "yt-dl-inline-aud"; btnA.textContent = T.aud; btnA.style.cssText = style + "background:#d63384; color:#fff;"; btnA.onclick = (e) => { e.preventDefault(); send('audio'); };
      container.appendChild(btnV); container.appendChild(btnA);
  };
  const observer = new MutationObserver(addInlineButtons);
  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(refreshData, POLLING_INTERVAL);

  window.addEventListener("keydown", (e) => {
      if (e.altKey && e.shiftKey && (e.key === "Y" || e.key === "y")) { setUIMode(state.uiMode === 0 ? 1 : 0); e.preventDefault(); }
      if (e.altKey && (e.key === "R" || e.key === "r")) { toggleRecording(); e.preventDefault(); }
      if (e.altKey && (e.key === "S" || e.key === "s")) { captureFrame(); e.preventDefault(); }
  });

  GM_registerMenuCommand(T.menu_update, () => GM_openInTab(UPDATE_URL, {active:true}));
  GM_registerMenuCommand(T.menu_toggle, () => setUIMode(state.uiMode === 0 ? 1 : 0));
  GM_registerMenuCommand(T.menu_help, () => { state.activeTab='help'; setUIMode(2); });
  GM_registerMenuCommand(T.menu_panel, () => GM_openInTab(SERVER_URL + '/panel', {active:true}));
  GM_registerMenuCommand(T.menu_dl, () => GM_openInTab(DRIVE_LINK, {active:true}));
  GM_registerMenuCommand(T.rec, toggleRecording);
  GM_registerMenuCommand(T.ss_btn, captureFrame);

  setTimeout(() => renderUI(), 1000);
  refreshData();
})();
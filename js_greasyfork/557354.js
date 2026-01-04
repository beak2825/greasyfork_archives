// ==UserScript==
// @name         StockXpert - Universal Media Hunter - PRO
// @name:pt-BR   StockXpert - Universal Media Hunter - PRO
// @name:es      StockXpert - Universal Media Hunter - PRO
// @name:fr      StockXpert - Universal Media Hunter - PRO
// @name:de      StockXpert - Universal Media Hunter - PRO
// @name:it      StockXpert - Universal Media Hunter - PRO
// @name:ru      StockXpert - Universal Media Hunter - PRO
// @name:zh-CN   StockXpert - Universal Media Hunter - PRO
// @name:ja      StockXpert - Universal Media Hunter - PRO
// @name:ko      StockXpert - Universal Media Hunter - PRO
// @name:hi      StockXpert - Universal Media Hunter - PRO
// @name:id      StockXpert - Universal Media Hunter - PRO
// @namespace    http://tampermonkey.net/
// @version      2.5.5
// @description  The most powerful media search & download tool. Search/Batch Download Photos, Videos, Vectors from multiple sources (Pixabay, Pexels, Unsplash, etc.). Features: Deep Scan, 4K/HD Unlocker, Reverse Image Search, Auto-Scan & Multi-Downloader.
// @description:pt-BR A ferramenta de busca e download de mídia mais poderosa. Busque/Baixe em lote Fotos, Vídeos, Vetores de várias fontes. Funcionalidades: Deep Scan, Desbloqueio 4K/HD, Busca Reversa, Auto-Scan e Multi-Downloader.
// @description:es   La herramienta de búsqueda y descarga de medios más potente. Busque/Descargue por lotes fotos, vídeos y vectores de múltiples fuentes. Características: Deep Scan, desbloqueo 4K/HD, búsqueda inversa, escaneo automático y descarga múltiple.
// @description:zh-CN 最强大的媒体搜索和下载工具。从多个来源搜索/批量下载照片、视频、矢量图。功能：深度扫描、4K/HD解锁、反向图片搜索、自动扫描和多重下载器。
// @description:ru   Самый мощный инструмент для поиска и загрузки медиафайлов. Поиск/пакетная загрузка фото, видео, векторов из нескольких источников. Функции: глубокое сканирование, разблокировка 4K/HD, обратный поиск изображений, автосканирование и мультизагрузчик.
// @description:fr   L'outil de recherche et de téléchargement de médias le plus puissant. Cherchez/téléchargez en masse des photos, vidéos, vecteurs de plusieurs sources. Fonctionnalités : Deep Scan, déblocage 4K/HD, recherche inversée, Auto-Scan et Multi-Downloader.
// @description:de   Das leistungsstärkste Tool zur Mediensuche und zum Download. Suchen/Batch-Download von Fotos, Videos, Vektoren aus mehreren Quellen. Funktionen: Deep Scan, 4K/HD-Unlocker, Rückwärtssuche, Auto-Scan und Multi-Downloader.
// @description:ja   最も強力なメディア検索およびダウンロードツール。複数のソースから写真、動画、ベクターを検索/一括ダウンロード。機能：ディープスキャン、4K/HDロック解除、逆画像検索、自動スキャン、マルチダウンローダー。
// @description:it   Lo strumento di ricerca e download multimediale più potente. Cerca/Scarica in batch foto, video, vettori da più fonti. Funzionalità: Deep Scan, sblocco 4K/HD, ricerca inversa, Auto-Scan e Multi-Downloader.
// @description:hi   सबसे शक्तिशाली मीडिया खोज और डाउनलोड उपकरण। कई स्रोतों से फोटो, वीडियो, वैक्टर खोजें/बैच डाउनलोड करें। विशेषताएं: डीप स्कैन, 4K/HD अनलॉकर, रिवर्स इमेज सर्च, ऑटो-स्कैन और मल्टी-डाउनलोडर।
// @description:id   Alat pencarian & pengunduhan media paling ampuh. Cari/Unduh Batch Foto, Video, Vektor dari berbagai sumber. Fitur: Deep Scan, Pembuka Kunci 4K/HD, Pencarian Gambar Terbalik, Pindai Otomatis & Pengunduh Multi.
// @description:ko   가장 강력한 미디어 검색 및 다운로드 도구. 여러 소스에서 사진, 비디오, 벡터 검색/일괄 다운로드. 기능: 정밀 검사, 4K/HD 잠금 해제, 역이미지 검색, 자동 스캔 및 멀티 다운로더.
// @description:ar   أقوى أداة للبحث عن الوسائط وتنزيلها. ابحث/نزل مجموعة من الصور ومقاطع الفيديو والمتجهات من مصادر متعددة. الميزات: مسح عميق، فتح قفل 4K/HD، بحث عكسي عن الصور، مسح تلقائي وتنزيل متعدد.
// @copyright    2025, Tauã B. Kloch Leite - All Rights Reserved.
// @author       Tauã B. Kloch Leite
// @icon         https://img.icons8.com/?size=100&id=zS0X1cipar3P&format=png&color=000000
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @connect      unsplash.com
// @connect      pexels.com
// @connect      pixabay.com
// @connect      mixkit.co
// @connect      youtube.com
// @connect      google.com
// @connect      wikimedia.org
// @connect      images.pexels.com
// @connect      images.unsplash.com
// @connect      cdn.pixabay.com
// @connect      upload.wikimedia.org
// @connect      i.ytimg.com
// @noframes
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557354/StockXpert%20-%20Universal%20Media%20Hunter%20-%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/557354/StockXpert%20-%20Universal%20Media%20Hunter%20-%20PRO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;

    /* --- ICONS (BASE64 & SVG) --- */
    const ICONS = {
        pix: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo%E2%80%94pix_powered_by_Banco_Central_%28Brazil%2C_2020%29.svg",
        btc: "https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=025",
        eth: "https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=025",
        sol: "https://cryptologos.cc/logos/solana-sol-logo.svg?v=025",
        bnb: "https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=025",
        matic: "https://cryptologos.cc/logos/polygon-matic-logo.svg?v=025",
        arb: "https://cryptologos.cc/logos/arbitrum-arb-logo.svg?v=025",
        paypal: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
        // Floating Trigger Icon
        gear: `<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.58 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
        // Nav Bar Icon (Thicker, simpler for small size)
        gearNav: `<svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M20.2 13c.1-.6.1-1 .1-1s0-.4-.1-1l2.3-1.7c.2-.2.3-.5.1-.7l-2.2-3.8c-.1-.3-.4-.4-.6-.3l-2.7 1.1c-.6-.4-1.2-.8-1.9-1l-.4-2.8c0-.3-.3-.5-.6-.5h-4.4c-.3 0-.5.2-.6.5l-.4 2.8c-.7.2-1.3.6-1.9 1l-2.7-1.1c-.3-.1-.6 0-.7.3l-2.2 3.8c-.1.3 0 .6.2.7l2.3 1.7c-.1.6-.1 1-.1 1s0 .4.1 1l-2.3 1.7c-.2.2-.3.5-.1.7l2.2 3.8c.1.3.4.4.6.3l2.7-1.1c.6.4 1.2.8 1.9 1l.4 2.8c0 .3.3.5.6.5h4.4c.3 0 .5-.2.6-.5l.4-2.8c.7-.2 1.3-.6 1.9-1l2.7 1.1c.3.1.6 0 .7-.3l2.2-3.8c.1-.3 0-.6-.2-.7l-2.3-1.7zM12 16.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/></svg>`
    };

    /* --- INTERNATIONALIZATION --- */
    const userLang = navigator.language || navigator.userLanguage;
    const langCode = userLang.slice(0, 2).toLowerCase();
    const i18n = {
        en: {
            title: "STOCKXPERT", subtitle: "v2.5.4 GLOBAL",
            tab_p: "PHOTOS", tab_v: "VIDEOS", tab_h: "HISTORY", tab_s: "SUPPORT", tab_c: "CONFIG",
            ph_p: "Search Global...", ph_v: "Search Footage...",
            lbl_int: "INTERNAL (LOCKED)", lbl_ext: "🌍 SEARCH EXTERNAL", lbl_ori: "ORIENTATION",
            btn_p: "🚀 SEARCH INTERNAL", btn_scan_p: "👁️ DEEP SCAN PHOTOS", btn_scan_v: "👁️ DEEP SCAN VIDEOS", btn_v: "🎥 SEARCH VIDEOS", btn_ext: "🌐 OPEN ALL ENGINES",
            btn_clr: "Clear History", btn_dl: "DOWNLOAD", load: "Smart Scanning...", dl_wait: "⏳...",
            confirm_del: "Delete Gallery?", confirm_clr: "Empty Gallery?", empty: "Empty!",
            vid_tag: "Video Tag", file_link: "File Link", xray_src: "Smart Match", json_src: "Smart Data", yt_copy: "Link Copied!",
            sup_title: "FUEL THE CODE ☕", sup_desc: "Servers don't run on love. Help keep the updates coming!",
            lbl_pix: "PIX (BRAZIL)", btn_copy: "COPY", copied: "COPIED!", lbl_paypal: "PAYPAL",
            cfg_theme: "UI COLOR THEME", cfg_keys: "KEYBOARD SHORTCUTS", cfg_hide: "HIDE UI NOW",
            key_h: "Hide/Show All", key_s: "Toggle Search", key_b: "Toggle Gallery", power_off: "Hide Interface (Alt+X)"
        },
        pt: {
            title: "STOCKXPERT", subtitle: "v2.5.4 GLOBAL",
            tab_p: "FOTOS", tab_v: "VÍDEOS", tab_h: "HISTÓRICO", tab_s: "DOAÇÃO", tab_c: "CONFIG",
            ph_p: "Busca Global...", ph_v: "Buscar Vídeos...",
            lbl_int: "FONTES (TRAVADO)", lbl_ext: "🌍 BUSCA EXTERNA", lbl_ori: "ORIENTAÇÃO",
            btn_p: "🚀 BUSCAR INTERNO", btn_scan_p: "👁️ ESCANEAR FOTOS", btn_scan_v: "👁️ ESCANEAR VÍDEOS", btn_v: "🎥 BUSCAR VÍDEOS", btn_ext: "🌐 ABRIR MOTORES",
            btn_clr: "Limpar Histórico", btn_dl: "DOWNLOAD", load: "Escaneando...", dl_wait: "⏳...",
            confirm_del: "Deletar Galeria?", confirm_clr: "Esvaziar Galeria?", empty: "Vazia!",
            vid_tag: "Player Vídeo", file_link: "Link Arquivo", xray_src: "Pareamento Smart", json_src: "Dados Inteligentes", yt_copy: "Link Copiado!",
            sup_title: "ABASTEÇA O CÓDIGO ☕", sup_desc: "Servidores custam dinheiro. Ajude a manter as atualizações!",
            lbl_pix: "CHAVE PIX", btn_copy: "COPIAR", copied: "COPIADO!", lbl_paypal: "PAYPAL",
            cfg_theme: "TEMA DE CORES", cfg_keys: "ATALHOS", cfg_hide: "ESCONDER TUDO AGORA",
            key_h: "Esconder/Mostrar", key_s: "Alternar Busca", key_b: "Alternar Galeria", power_off: "Esconder Interface (Alt+X)"
        },
        es: {
            title: "STOCKXPERT", subtitle: "v2.5.4 GLOBAL",
            tab_p: "FOTOS", tab_v: "VIDEOS", tab_h: "HISTORIAL", tab_s: "DONAR", tab_c: "CONFIG",
            ph_p: "Búsqueda Global...", ph_v: "Buscar Videos...",
            lbl_int: "FUENTES (BLOQ)", lbl_ext: "🌍 BÚSQUEDA EXTERNA", lbl_ori: "ORIENTACIÓN",
            btn_p: "🚀 BUSCAR INTERNO", btn_scan_p: "👁️ ESCANEAR FOTOS", btn_scan_v: "👁️ ESCANEAR VIDEOS", btn_v: "🎥 BUSCAR VIDEOS", btn_ext: "🌐 ABRIR MOTORES",
            btn_clr: "Borrar Historial", btn_dl: "DESCARGAR", load: "Escaneando...", dl_wait: "⏳...",
            confirm_del: "¿Eliminar Galería?", confirm_clr: "¿Vaciar Galería?", empty: "¡Vacía!",
            vid_tag: "Reproductor", file_link: "Enlace", xray_src: "Smart Match", json_src: "Datos Smart", yt_copy: "¡Copiado!",
            sup_title: "APOYA EL CÓDIGO ☕", sup_desc: "¡Ayuda a mantener las actualizaciones llegando!",
            lbl_pix: "PIX (BRASIL)", btn_copy: "COPIAR", copied: "¡COPIADO!", lbl_paypal: "PAYPAL",
            cfg_theme: "COLOR DEL TEMA", cfg_keys: "ATAJOS", cfg_hide: "OCULTAR AHORA",
            key_h: "Ocultar/Mostrar", key_s: "Panel de Búsqueda", key_b: "Barra de Galería", power_off: "Ocultar Interfaz (Alt+X)"
        },
        fr: {
            title: "STOCKXPERT", subtitle: "v2.5.4 GLOBAL",
            tab_p: "PHOTOS", tab_v: "VIDÉOS", tab_h: "HISTORIQUE", tab_s: "DONNER", tab_c: "CONFIG",
            ph_p: "Recherche Globale...", ph_v: "Chercher Vidéos...",
            lbl_int: "SOURCES (VERROU)", lbl_ext: "🌍 RECHERCHE EXT", lbl_ori: "ORIENTATION",
            btn_p: "🚀 RECHERCHE INTERNE", btn_scan_p: "👁️ SCAN PHOTOS", btn_scan_v: "👁️ SCAN VIDÉOS", btn_v: "🎥 CHERCHER VIDÉOS", btn_ext: "🌐 TOUT OUVRIR",
            btn_clr: "Effacer l'historique", btn_dl: "TÉLÉCHARGER", load: "Analyse en cours...", dl_wait: "⏳...",
            confirm_del: "Supprimer la galerie ?", confirm_clr: "Vider la galerie ?", empty: "Vide !",
            vid_tag: "Balise Vidéo", file_link: "Lien Fichier", xray_src: "Smart Match", json_src: "Données Smart", yt_copy: "Copié !",
            sup_title: "SOUTENIR LE CODE ☕", sup_desc: "Aidez à maintenir les mises à jour !",
            lbl_pix: "PIX (BRÉSIL)", btn_copy: "COPIER", copied: "COPIÉ !", lbl_paypal: "PAYPAL",
            cfg_theme: "THÈME COULEUR", cfg_keys: "RACCOURCIS", cfg_hide: "CACHER TOUT",
            key_h: "Cacher/Montrer", key_s: "Panneau Recherche", key_b: "Barre Galerie", power_off: "Cacher l'interface (Alt+X)"
        },
        de: {
            title: "STOCKXPERT", subtitle: "v2.5.4 GLOBAL",
            tab_p: "FOTOS", tab_v: "VIDEOS", tab_h: "VERLAUF", tab_s: "SPENDEN", tab_c: "KONFIG",
            ph_p: "Suche...", ph_v: "Videos suchen...",
            lbl_int: "QUELLEN (GESPERRT)", lbl_ext: "🌍 EXTERNE SUCHE", lbl_ori: "AUSRICHTUNG",
            btn_p: "🚀 INTERNE SUCHE", btn_scan_p: "👁️ FOTOS SCANNEN", btn_scan_v: "👁️ VIDEOS SCANNEN", btn_v: "🎥 VIDEOS SUCHEN", btn_ext: "🌐 ALLE ÖFFNEN",
            btn_clr: "Verlauf löschen", btn_dl: "HERUNTERLADEN", load: "Scannen...", dl_wait: "⏳...",
            confirm_del: "Galerie löschen?", confirm_clr: "Galerie leeren?", empty: "Leer!",
            vid_tag: "Video-Tag", file_link: "Datei-Link", xray_src: "Smart Match", json_src: "Smart Data", yt_copy: "Kopiert!",
            sup_title: "UNTERSTÜTZEN ☕", sup_desc: "Helfen Sie, Updates am Laufen zu halten!",
            lbl_pix: "PIX (BRASILIEN)", btn_copy: "KOPIEREN", copied: "KOPIERT!", lbl_paypal: "PAYPAL",
            cfg_theme: "FARBTHEMA", cfg_keys: "TASTATURKÜRZEL", cfg_hide: "JETZT AUSBLENDEN",
            key_h: "Ausblenden/Anzeigen", key_s: "Suchfeld", key_b: "Galerieleiste", power_off: "Interface ausblenden (Alt+X)"
        },
        it: {
            title: "STOCKXPERT", subtitle: "v2.5.4 GLOBAL",
            tab_p: "FOTO", tab_v: "VIDEO", tab_h: "STORIA", tab_s: "DONARE", tab_c: "CONFIG",
            ph_p: "Cerca...", ph_v: "Cerca Video...",
            lbl_int: "FONTI (BLOCCATO)", lbl_ext: "🌍 RICERCA ESTERNA", lbl_ori: "ORIENTAMENTO",
            btn_p: "🚀 CERCA INTERNO", btn_scan_p: "👁️ SCAN FOTO", btn_scan_v: "👁️ SCAN VIDEO", btn_v: "🎥 CERCA VIDEO", btn_ext: "🌐 APRI TUTTI",
            btn_clr: "Cancella Storia", btn_dl: "SCARICARE", load: "Scansione...", dl_wait: "⏳...",
            confirm_del: "Eliminare Galleria?", confirm_clr: "Svuotare Galleria?", empty: "Vuota!",
            vid_tag: "Tag Video", file_link: "Link File", xray_src: "Smart Match", json_src: "Dati Smart", yt_copy: "Copiato!",
            sup_title: "SUPPORTO ☕", sup_desc: "Aiutaci a mantenere gli aggiornamenti!",
            lbl_pix: "PIX (BRASILE)", btn_copy: "COPIA", copied: "COPIATO!", lbl_paypal: "PAYPAL",
            cfg_theme: "TEMA COLORE", cfg_keys: "SCORCIATOIE", cfg_hide: "NASCONDI ORA",
            key_h: "Mostra/Nascondi", key_s: "Pannello Ricerca", key_b: "Barra Galleria", power_off: "Nascondi Interfaccia (Alt+X)"
        },
        ru: {
            title: "STOCKXPERT", subtitle: "v2.5.4 GLOBAL",
            tab_p: "ФОТО", tab_v: "ВИДЕО", tab_h: "ИСТОРИЯ", tab_s: "ДОНАТ", tab_c: "КОНФИГ",
            ph_p: "Поиск...", ph_v: "Поиск видео...",
            lbl_int: "ИСТОЧНИКИ (БЛОК)", lbl_ext: "🌍 ВНЕШНИЙ ПОИСК", lbl_ori: "ОРИЕНТАЦИЯ",
            btn_p: "🚀 ПОИСК", btn_scan_p: "👁️ СКАН ФОТО", btn_scan_v: "👁️ СКАН ВИДЕО", btn_v: "🎥 ИСКАТЬ ВИДЕО", btn_ext: "🌐 ОТКРЫТЬ ВСЕ",
            btn_clr: "Очистить", btn_dl: "СКАЧАТЬ", load: "Сканирование...", dl_wait: "⏳...",
            confirm_del: "Удалить?", confirm_clr: "Очистить?", empty: "Пусто!",
            vid_tag: "Видео Тег", file_link: "Ссылка", xray_src: "Smart Match", json_src: "Smart Data", yt_copy: "Скопировано!",
            sup_title: "ПОДДЕРЖКА ☕", sup_desc: "Помогите поддерживать обновления!",
            lbl_pix: "PIX (БРАЗИЛИЯ)", btn_copy: "КОПИРОВАТЬ", copied: "ГОТОВО!", lbl_paypal: "PAYPAL",
            cfg_theme: "ТЕМА", cfg_keys: "ГОРЯЧИЕ КЛАВИШИ", cfg_hide: "СКРЫТЬ",
            key_h: "Скрыть/Показать", key_s: "Поиск", key_b: "Галерея", power_off: "Скрыть (Alt+X)"
        },
        hi: {
            title: "STOCKXPERT", subtitle: "v2.5.4 वैश्विक",
            tab_p: "तस्वीरें", tab_v: "वीडियो", tab_h: "इतिहास", tab_s: "दान करें", tab_c: "सेटिंग्स",
            ph_p: "खोज...", ph_v: "वीडियो खोजें...",
            lbl_int: "आंतरिक स्रोत", lbl_ext: "🌍 बाहरी खोज", lbl_ori: "अभिविन्यास",
            btn_p: "🚀 खोज", btn_scan_p: "👁️ स्कैन फोटो", btn_scan_v: "👁️ स्कैन वीडियो", btn_v: "🎥 वीडियो खोजें", btn_ext: "🌐 सब खोलें",
            btn_clr: "इतिहास साफ़ करें", btn_dl: "डाउनलोड", load: "स्कैनिंग...", dl_wait: "⏳...",
            confirm_del: "हटाएं?", confirm_clr: "खाली करें?", empty: "खाली!",
            vid_tag: "वीडियो टैग", file_link: "लिंक", xray_src: "स्मार्ट मैच", json_src: "स्मार्ट डेटा", yt_copy: "कॉपी किया गया!",
            sup_title: "समर्थन ☕", sup_desc: "अपडेट जारी रखने में मदद करें!",
            lbl_pix: "PIX (ब्राजील)", btn_copy: "कॉपी", copied: "हो गया!", lbl_paypal: "PAYPAL",
            cfg_theme: "रंग थीम", cfg_keys: "शॉर्टकट", cfg_hide: "छिपाएँ",
            key_h: "छिपाएँ/दिखाएँ", key_s: "खोज पैनल", key_b: "गैलरी", power_off: "इंटरफ़ेस छिपाएँ (Alt+X)"
        },
        zh: {
            title: "STOCKXPERT", subtitle: "v2.5.4 全球版",
            tab_p: "照片", tab_v: "视频", tab_h: "历史", tab_s: "捐赠", tab_c: "设置",
            ph_p: "全球搜索...", ph_v: "搜索素材...",
            lbl_int: "内部来源 (锁定)", lbl_ext: "🌍 外部搜索", lbl_ori: "方向",
            btn_p: "🚀 内部搜索", btn_scan_p: "👁️ 深度扫描照片", btn_scan_v: "👁️ 深度扫描视频", btn_v: "🎥 搜索视频", btn_ext: "🌐 打开所有",
            btn_clr: "清除历史", btn_dl: "下载", load: "扫描中...", dl_wait: "⏳...",
            confirm_del: "删除图库？", confirm_clr: "清空图库？", empty: "空的！",
            vid_tag: "视频标签", file_link: "文件链接", xray_src: "智能匹配", json_src: "智能数据", yt_copy: "已复制！",
            sup_title: "支持开发 ☕", sup_desc: "请喝杯咖啡，支持更新！",
            lbl_pix: "PIX (巴西)", btn_copy: "复制", copied: "已复制！", lbl_paypal: "贝宝",
            cfg_theme: "界面颜色", cfg_keys: "键盘快捷键", cfg_hide: "立即隐藏",
            key_h: "隐藏/显示", key_s: "切换搜索", key_b: "切换图库", power_off: "隐藏界面 (Alt+X)"
        },
        ja: {
            title: "STOCKXPERT", subtitle: "v2.5.4 グローバル",
            tab_p: "写真", tab_v: "動画", tab_h: "履歴", tab_s: "寄付", tab_c: "設定",
            ph_p: "検索...", ph_v: "動画検索...",
            lbl_int: "内部ソース (ロック)", lbl_ext: "🌍 外部検索", lbl_ori: "方向",
            btn_p: "🚀 内部検索", btn_scan_p: "👁️ 写真スキャン", btn_scan_v: "👁️ 動画スキャン", btn_v: "🎥 動画検索", btn_ext: "🌐 全て開く",
            btn_clr: "履歴消去", btn_dl: "ダウンロード", load: "スキャン中...", dl_wait: "⏳...",
            confirm_del: "削除しますか？", confirm_clr: "空にしますか？", empty: "空です！",
            vid_tag: "動画タグ", file_link: "リンク", xray_src: "スマートマッチ", json_src: "スマートデータ", yt_copy: "コピー完了！",
            sup_title: "サポート ☕", sup_desc: "開発を支援してください！",
            lbl_pix: "PIX (ブラジル)", btn_copy: "コピー", copied: "完了！", lbl_paypal: "ペイパル",
            cfg_theme: "カラーテーマ", cfg_keys: "ショートカット", cfg_hide: "今すぐ隠す",
            key_h: "表示/非表示", key_s: "検索パネル", key_b: "ギャラリーバー", power_off: "インターフェースを隠す (Alt+X)"
        },
        id: {
            title: "STOCKXPERT", subtitle: "v2.5.4 GLOBAL",
            tab_p: "FOTO", tab_v: "VIDEO", tab_h: "RIWAYAT", tab_s: "DONASI", tab_c: "KONFIG",
            ph_p: "Cari...", ph_v: "Cari Video...",
            lbl_int: "SUMBER (TERKUNCI)", lbl_ext: "🌍 PENCARIAN LUAR", lbl_ori: "ORIENTASI",
            btn_p: "🚀 CARI INTERNAL", btn_scan_p: "👁️ PINDAI FOTO", btn_scan_v: "👁️ PINDAI VIDEO", btn_v: "🎥 CARI VIDEO", btn_ext: "🌐 BUKA SEMUA",
            btn_clr: "Hapus Riwayat", btn_dl: "UNDUH", load: "Memindai...", dl_wait: "⏳...",
            confirm_del: "Hapus Galeri?", confirm_clr: "Kosongkan?", empty: "Kosong!",
            vid_tag: "Tag Video", file_link: "Tautan", xray_src: "Smart Match", json_src: "Smart Data", yt_copy: "Disalin!",
            sup_title: "DUKUNGAN ☕", sup_desc: "Bantu terus perbarui!",
            lbl_pix: "PIX (BRASIL)", btn_copy: "SALIN", copied: "DISALIN!", lbl_paypal: "PAYPAL",
            cfg_theme: "TEMA WARNA", cfg_keys: "PINTASAN", cfg_hide: "SEMBUNYIKAN",
            key_h: "Sembunyi/Tampil", key_s: "Panel Cari", key_b: "Bar Galeri", power_off: "Sembunyikan Antarmuka (Alt+X)"
        }
    };
    const l = i18n[langCode] ? langCode : 'en';
    const t = (key) => i18n[l][key] || i18n['en'][key];

    /* --- CONFIG & STATE --- */
    const defaultCollection = { name: 'Geral', items: [] };
    const storedCollections = JSON.parse(GM_getValue('ymh_global_collections', '[]'));
    const storedHistory = JSON.parse(GM_getValue('ymh_global_history', '[]'));
    const storedTheme = GM_getValue('ymh_theme', '#00E676');
    // Load persistence state for visibility
    const storedVisibility = GM_getValue('ymh_is_visible', true);

    const state = {
        collections: storedCollections.length ? storedCollections : [defaultCollection],
        activeCollectionIndex: GM_getValue('ymh_active_index', 0),
        history: storedHistory,
        page: 1,
        isOpen: false,
        isBarOpen: true,
        isVisible: storedVisibility, // Use stored value
        themeColor: storedTheme,
        sources: { unsplash: true, pexels: true, pixabay: true, wikimedia: true, pexelsVideo: true, pixabayVideo: true, mixkit: true, youtube: true },
        orientation: 'landscape',
        minSize: 150,
        currentQuery: '',
        currentMode: 'photos',
        isScanning: false,
        isLoading: false,
        pulseInterval: null,
        scrollTimer: null
    };

    /* --- HELPERS --- */
    function saveCollections() {
        GM_setValue('ymh_global_collections', JSON.stringify(state.collections));
        GM_setValue('ymh_active_index', state.activeCollectionIndex);
    }

    function saveHistory() {
        GM_setValue('ymh_global_history', JSON.stringify(state.history));
        renderHistory();
    }

    function getActiveCollection() {
        if (!state.collections[state.activeCollectionIndex]) state.activeCollectionIndex = 0;
        return state.collections[state.activeCollectionIndex];
    }

    function wipeResults(type) {
        const id = type === 'video' ? 'ymh-res-v' : 'ymh-res-p';
        const el = document.getElementById(id);
        if(el) el.innerHTML = '';
        state.page = 1;
        state.isLoading = false;
        document.querySelector('.ymh-content').scrollTop = 0;
    }

    function extractValidImage(imgEl) {
        if (!imgEl) return null;
        if (imgEl.closest('#ymh-suite') || imgEl.closest('#ymh-bar') || imgEl.closest('#ymh-big-preview')) return null;
        let src = imgEl.src || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy-src') || imgEl.getAttribute('data-sfwthumb');
        if (src && src.includes('blank.gif') && imgEl.srcset) {
            let parts = imgEl.srcset.split(',');
            if(parts.length > 0) src = parts[0].trim().split(' ')[0];
        }
        if (src && (src.includes('blank.gif') || src.startsWith('data:'))) return null;
        return src;
    }

    function magicPixabayLink(url) {
        if (!url) return url;
        if (url.includes('cdn.pixabay.com')) {
            return url.replace(/(_tiny|_small|_medium|_large)\.(jpg|jpeg|mp4)/i, '_large.mp4');
        }
        return url;
    }

    function magicPexelsLink(url) {
        const match = url.match(/\/video\/.*?(\d+)\/?/);
        if (match && match[1]) {
            return `https://www.pexels.com/download/video/${match[1]}/`;
        }
        return url;
    }

    function getFileNameFromUrl(url, type) {
        try {
            if(url.includes('pexels.com/download')) return 'pexels_' + Date.now() + (type === 'video' ? '.mp4' : '.jpg');
            const cleanUrl = url.split('?')[0];
            let filename = cleanUrl.split('/').pop();
            filename = decodeURIComponent(filename);
            if (!filename.includes('.')) filename += (type === 'video' ? '.mp4' : '.jpg');
            return filename;
        } catch (e) {
            return (type === 'video' ? 'video_' : 'image_') + Date.now() + (type === 'video' ? '.mp4' : '.jpg');
        }
    }

    function getYoutubeID(url) {
        let vidId = '';
        if(url.includes('v=')) vidId = url.split('v=')[1].split('&')[0];
        else if(url.includes('youtu.be/')) vidId = url.split('youtu.be/')[1].split('?')[0];
        return vidId;
    }

    function setTheme(color) {
        state.themeColor = color;
        GM_setValue('ymh_theme', color);
        document.documentElement.style.setProperty('--ymh-theme', color);
    }

    /* --- MENUS & SHORTCUTS --- */
    GM_registerMenuCommand(`👁️ Toggle Panel (Alt+M)`, toggleSuite);
    GM_registerMenuCommand(`🎞️ Toggle Bar (Alt+B)`, toggleBar);
    GM_registerMenuCommand(`👻 Stealth Mode (Alt+X)`, toggleMasterVisibility);

    document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'x' || e.key === 'X')) toggleMasterVisibility();
        if (e.altKey && (e.key === 'm' || e.key === 'M')) toggleSuite();
        if (e.altKey && (e.key === 'b' || e.key === 'B')) toggleBar();
        if (e.altKey && (e.key === 's' || e.key === 'S')) toggleSuite();
    });

    function toggleMasterVisibility() {
        state.isVisible = !state.isVisible;
        GM_setValue('ymh_is_visible', state.isVisible); // Save to storage
        const elements = ['#ymh-suite', '#ymh-bar', '#ymh-trigger', '#ymh-big-preview'];
        elements.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                if (!state.isVisible) el.classList.add('ymh-invisible');
                else el.classList.remove('ymh-invisible');
            }
        });
    }

    /* --- STYLES --- */
    const css = `
        :root { --ymh-theme: ${state.themeColor}; }
        #ymh-suite { position: fixed; top: 0; right: 0; width: 480px; height: 100vh;
        background: #121212; border-left: 1px solid #333; z-index: 2147483647; display: flex; flex-direction: column; transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); font-family: 'Segoe UI', Roboto, sans-serif; color: #eee; box-shadow: -10px 0 60px rgba(0,0,0,0.9); }
        #ymh-suite.visible { transform: translateX(0); }
        .ymh-header { padding: 15px 20px; background: #1a1a1a; border-bottom: 2px solid var(--ymh-theme);
        display: flex; justify-content: space-between; align-items: center; }
        .ymh-title { font-weight: 900; color: #fff; letter-spacing: 1px; font-size: 16px; }
        .ymh-subtitle { color: var(--ymh-theme); font-size: 12px; margin-left: 5px; text-transform: uppercase; font-weight:bold; }
        .ymh-close { cursor: pointer; font-size: 20px; color: #888; transition:0.2s; margin-left:10px;} .ymh-close:hover { color: #fff; }
        .ymh-power { cursor: pointer; font-size: 18px; color: #D32F2F; transition:0.2s; margin-right: auto; margin-left: 15px; }
        .ymh-power:hover { color: #ff5252; transform: scale(1.1); text-shadow: 0 0 5px red; }
        .ymh-nav { display: flex; background: #222; }
        .ymh-nav-btn { flex: 1; padding: 12px 0; text-align: center; cursor: pointer; font-size: 12px; font-weight: 700; color: #666; border-bottom: 3px solid transparent; transition:0.2s; }
        .ymh-nav-btn:hover { background: #333; color: #ccc; }
        .ymh-nav-btn.active { color: #fff; border-bottom-color: var(--ymh-theme); background: #181818; }

        /* NEW ICON STYLES */
        .ymh-nav-btn svg { width: 20px; height: 20px; fill: currentColor; vertical-align:middle; transition: 0.3s ease; }
        .ymh-nav-btn.active svg { fill: #fff; filter: drop-shadow(0 0 6px var(--ymh-theme)); transform: rotate(45deg); }

        .ymh-content { flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; }
        .ymh-section { display: none; width: 100%; } .ymh-section.active { display: block; }
        .ymh-input { width: 100%; background: #000; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 4px; font-size: 14px; outline: none; margin-bottom: 10px; }
        .ymh-input:focus { border-color: var(--ymh-theme); }
        .ymh-box { background: #1e1e1e; padding: 12px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #333; }
        .ymh-label { font-size: 10px; font-weight: 800; color: #888; margin-bottom: 8px; display: block; text-transform: uppercase; }
        .ymh-chips { display: flex; gap: 6px; flex-wrap: wrap; }
        .ymh-chip { background: #2a2a2a; border: 1px solid #444; padding: 6px 12px; border-radius: 4px; font-size: 11px; cursor: pointer; user-select: none; transition: 0.2s; color: #aaa; }
        .ymh-chip:hover { color: #fff; border-color: #666; }
        .ymh-chip.selected { background: var(--ymh-theme); border-color: var(--ymh-theme); color: #000; font-weight: bold; }
        .ymh-chip.selected[data-src] { cursor: default; }
        .ymh-btn { width: 100%; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; text-transform: uppercase; }
        .btn-main { background: var(--ymh-theme); color: #000; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
        .btn-main:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-sec { background: #333; color: #ccc; margin-top: 10px; } .btn-sec:hover { background: #444; color: #fff; }
        .ymh-engines { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
        .ymh-eng-btn { background: #111; border: 1px solid #333; color: #aaa; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 11px; text-align: center; transition: 0.2s; }
        .ymh-eng-btn:hover { border-color: var(--ymh-theme); color: #fff; background: #222; }
        #ymh-res-p, #ymh-res-v { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
        .ymh-res-item { height: 130px; background: #000; border-radius: 6px; overflow: hidden; position: relative; border: 2px solid #222; cursor: pointer; transition: 0.2s; }
        .ymh-res-item:hover { border-color: var(--ymh-theme); transform: scale(1.02); z-index: 2; }
        .ymh-res-item img, .ymh-res-item video { width: 100%; height: 100%; object-fit: cover; }
        #ymh-bar { position: fixed; bottom: 0; left: 0; width: 100%; height: 160px; background: #0f0f0f; border-top: 3px solid var(--ymh-theme); z-index: 2147483646; transform: translateY(100%); transition: transform 0.3s; display: flex; flex-direction: column; }
        #ymh-bar.visible { transform: translateY(0); }
        .ymh-bar-head { padding: 8px 20px; background: #000; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #222; }
        .ymh-gal-ctrl { display: flex; align-items: center; gap: 10px; }
        .ymh-select { background: #222; color: #fff; border: 1px solid #444; padding: 5px; border-radius: 4px; font-size: 11px; outline: none; }
        .ymh-icon-btn { cursor: pointer; font-size: 14px; padding: 4px; border-radius: 4px; background: #222; border: 1px solid #444; color: #ccc; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
        .ymh-icon-btn:hover { background: #444; color: #fff; }
        .btn-danger:hover { background: #D32F2F; border-color: #D32F2F; }
        .ymh-bar-list { flex-grow: 1; display: flex; gap: 12px; padding: 15px; overflow-x: auto; align-items: center; }
        .ymh-col-item { min-width: 150px; height: 90px; border: 1px solid #333; border-radius: 6px; overflow: hidden; position: relative; group; transition: 0.2s; }
        .ymh-col-item:hover { border-color: var(--ymh-theme); }
        .ymh-col-item img, .ymh-col-item video { width: 100%; height: 100%; object-fit: cover; }
        .ymh-col-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(2px); display: none; flex-direction: column; justify-content: space-evenly; align-items: center; padding: 5px; box-sizing: border-box; }
        .ymh-col-item:hover .ymh-col-overlay { display: flex; }
        .ymh-btn-row { display: flex; gap: 5px; width: 100%; justify-content: center; }
        .ymh-mini-btn { font-size: 10px; font-weight: bold; padding: 6px; border-radius: 4px; border: 1px solid #555; background: #000; color: #fff; cursor: pointer; text-align: center; transition: 0.2s; text-transform: uppercase; }
        .ymh-mini-btn:hover { transform: scale(1.05); }
        .btn-dl { width: 90%; border-color: var(--ymh-theme); color: var(--ymh-theme); } .btn-dl:hover { background: var(--ymh-theme); color: #000; }
        .btn-google { flex: 1; border-color: #4285F4; color: #4285F4; } .btn-google:hover { background: #4285F4; color: #fff; }
        .btn-yandex { flex: 1; border-color: #FC3F1D; color: #FC3F1D; } .btn-yandex:hover { background: #FC3F1D; color: #fff; }
        .btn-rmv { width: 90%; border-color: #D32F2F; color: #D32F2F; } .btn-rmv:hover { background: #D32F2F; color: #fff; }
        #ymh-big-preview { position: fixed; bottom: 180px; left: 20px; width: 480px; height: 270px; background: #000; border: 3px solid var(--ymh-theme); box-shadow: 10px 10px 40px rgba(0,0,0,0.9); z-index: 2147483655; display: none; border-radius: 8px; overflow: hidden; }
        #ymh-big-preview img, #ymh-big-preview video, #ymh-big-preview iframe { width: 100%; height: 100%; object-fit: contain; background: #111; border:none; }

        /* TRIGGER BUTTON */
        #ymh-trigger {
            position: fixed; bottom: 170px; right: 20px;
            width: 64px; height: 64px;
            background: rgba(18, 18, 18, 0.85);
            backdrop-filter: blur(10px);
            border: 2px solid var(--ymh-theme);
            border-radius: 50%;
            z-index: 2147483645;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--ymh-theme);
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #ymh-trigger:hover {
            transform: scale(1.1) rotate(90deg);
            color: #000;
            background: var(--ymh-theme);
            box-shadow: 0 10px 40px var(--ymh-theme);
            border-color: #fff;
        }

        .ymh-loading { grid-column: span 2; text-align: center; color: #888; padding: 20px; font-size: 12px; }
        .ymh-hist-item { padding: 10px; border-bottom: 1px solid #333; cursor: pointer; color: #ccc; }
        .ymh-hist-item:hover { background: #222; }
        .ymh-badge { position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); color: #fff; font-size: 9px; padding: 15px 5px 3px 5px; text-align: right; box-sizing: border-box; }
        .ymh-yt-menu { position: absolute; bottom: 35px; left: 5%; width: 90%; background: #111; border: 1px solid var(--ymh-theme); border-radius: 4px; z-index: 10; display: flex; flex-direction: column; box-shadow: 0 5px 15px rgba(0,0,0,0.9); }
        .ymh-yt-opt { padding: 6px; text-align: center; font-size: 10px; color: #ccc; cursor: pointer; border-bottom: 1px solid #333; text-transform: uppercase; font-weight: bold; }
        .ymh-yt-opt:last-child { border-bottom: none; }
        .ymh-yt-opt:hover { background: var(--ymh-theme); color: #000; }
        .ymh-invisible { display: none !important; }

        /* CONFIG & SUPPORT */
        .ymh-copy-row { display:flex; gap:5px; margin-bottom:10px; align-items:center; }
        .ymh-copy-input { flex:1; background:#111; border:1px solid #333; color:#ccc; padding:8px; border-radius:4px; font-size:10px; font-family:monospace; }
        .ymh-copy-btn { background:#222; border:1px solid var(--ymh-theme); color:var(--ymh-theme); padding:8px 10px; cursor:pointer; border-radius:4px; font-weight:bold; font-size:10px; }
        .ymh-copy-btn:hover { background:var(--ymh-theme); color:#000; }
        .ymh-crypto-chip { background:#222; border:1px solid #333; padding:8px 10px; border-radius:4px; cursor:pointer; font-size:11px; color:#ccc; display:flex; justify-content:space-between; align-items:center; transition:0.2s; margin-bottom:6px; }
        .ymh-crypto-chip img { width:16px; height:16px; margin-right:8px; vertical-align:middle; }
        .ymh-crypto-chip:hover { border-color:var(--ymh-theme); color:#fff; background:#181818; }
        .ymh-paypal-btn { width:100%; background:#003087; color:#fff; padding:12px; border-radius:4px; border:none; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; margin-top:15px; text-transform:uppercase; font-size:12px; transition:0.2s; text-decoration:none; box-sizing:border-box; }
        .ymh-paypal-btn img { width:16px; height:16px; }
        .ymh-paypal-btn:hover { background:#0045c2; }
        .ymh-copyright { margin-top: auto; text-align: center; font-size: 9px; color: #555; padding: 20px 0; border-top: 1px solid #222; }

        .ymh-theme-grid { display:flex; gap:10px; margin-bottom:20px; }
        .ymh-theme-btn { width:40px; height:40px; border-radius:6px; cursor:pointer; border:2px solid #333; }
        .ymh-theme-btn.active { border-color:#fff; }
        .ymh-shortcut-row { display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:10px 0; font-size:11px; color:#aaa; }
        .ymh-shortcut-key { color:var(--ymh-theme); font-weight:bold; font-family:monospace; }
    `;
    GM_addStyle(css);

    // --- 6. HTML INTERFACE ---
    // Apply visibility class immediately based on stored state
    const visibilityClass = state.isVisible ? '' : 'ymh-invisible';

    const html = `
        <div id="ymh-trigger" class="${visibilityClass}">${ICONS.gear}</div>
        <div id="ymh-big-preview" class="${visibilityClass}"></div>
        <div id="ymh-suite" class="${visibilityClass}">
            <div class="ymh-header">
                <div><span class="ymh-title">${t('title')}</span><span class="ymh-subtitle">${t('subtitle')}</span></div>
                <div style="display:flex;align-items:center;">
                    <span class="ymh-power" id="ymh-power-btn" title="${t('power_off')}">⏻</span>
                    <span class="ymh-close" id="ymh-close">▼</span>
                </div>
            </div>
            <div class="ymh-nav">
                <div class="ymh-nav-btn active" data-tab="photos">${t('tab_p')}</div>
                <div class="ymh-nav-btn" data-tab="videos">${t('tab_v')}</div>
                <div class="ymh-nav-btn" data-tab="history">${t('tab_h')}</div>
                <div class="ymh-nav-btn" data-tab="support" style="color:#ccc;">${t('tab_s')}</div>
                <div class="ymh-nav-btn" data-tab="config">${ICONS.gearNav}</div>
            </div>
            <div class="ymh-content">

                <div id="tab-photos" class="ymh-section active">
                    <input type="text" id="ymh-input-p" class="ymh-input" style="margin-bottom:15px;" placeholder="${t('ph_p')}">
                    <div class="ymh-box">
                        <span class="ymh-label">${t('lbl_int')}</span>
                        <div class="ymh-chips">
                            <div class="ymh-chip selected" data-src="unsplash">Unsplash</div>
                            <div class="ymh-chip selected" data-src="pexels">Pexels</div>
                            <div class="ymh-chip selected" data-src="pixabay">Pixabay</div>
                            <div class="ymh-chip selected" data-src="wikimedia">Wikimedia</div>
                        </div>
                        <span class="ymh-label" style="margin-top:10px;">${t('lbl_ori')}</span>
                        <div class="ymh-chips">
                            <div class="ymh-chip selected" data-orient="landscape">Landscape</div>
                            <div class="ymh-chip" data-orient="portrait">Portrait</div>
                            <div class="ymh-chip" data-orient="all">All</div>
                        </div>
                    </div>
                    <button class="ymh-btn btn-main" id="btn-search-p">${t('btn_p')}</button>
                    <div class="ymh-box" style="margin-top:15px; border-color:#444;">
                        <span class="ymh-label" style="color:var(--ymh-theme);">${t('lbl_ext')}</span>
                        <div class="ymh-engines">
                            <div class="ymh-eng-btn" data-eng="google">Google HD</div>
                            <div class="ymh-eng-btn" data-eng="yandex">Yandex (Best)</div>
                            <div class="ymh-eng-btn" data-eng="bing">Bing HD</div>
                            <div class="ymh-eng-btn" data-eng="flickr">Flickr</div>
                            <div class="ymh-eng-btn" data-eng="openverse">Openverse</div>
                            <div class="ymh-eng-btn" data-eng="tineye">TinEye (Reverse)</div>
                        </div>
                        <button class="ymh-btn btn-sec" id="btn-search-world" style="margin-top:10px; border:1px solid var(--ymh-theme); color:var(--ymh-theme);">${t('btn_ext')}</button>
                    </div>
                    <button class="ymh-btn btn-sec" id="btn-scan">${t('btn_scan_p')}</button>
                    <div id="ymh-res-p"></div>
                </div>

                <div id="tab-videos" class="ymh-section">
                    <input type="text" id="ymh-input-v" class="ymh-input" style="margin-bottom:15px;" placeholder="${t('ph_v')}">
                    <div class="ymh-box">
                        <span class="ymh-label">${t('lbl_int')}</span>
                        <div class="ymh-chips">
                            <div class="ymh-chip selected" data-src="pexelsVideo">Pexels (Crawler)</div>
                            <div class="ymh-chip selected" data-src="pixabayVideo">Pixabay (Crawler)</div>
                            <div class="ymh-chip selected" data-src="mixkit">Mixkit</div>
                            <div class="ymh-chip selected" data-src="youtube">YouTube</div>
                        </div>
                    </div>
                    <button class="ymh-btn btn-main" id="btn-search-v">${t('btn_v')}</button>
                    <button class="ymh-btn btn-sec" id="btn-scan-v">${t('btn_scan_v')}</button>
                    <div id="ymh-res-v"></div>
                </div>

                <div id="tab-history" class="ymh-section">
                    <button class="ymh-btn btn-sec" id="btn-clear-hist" style="color:#F44336; border-color:#F44336;">${t('btn_clr')}</button>
                    <div id="ymh-hist-list"></div>
                </div>

                <div id="tab-support" class="ymh-section">
                    <div class="ymh-box" style="text-align:center; padding:20px;">
                        <h3 style="color:var(--ymh-theme); margin:0 0 10px 0;">${t('sup_title')}</h3>
                        <p style="color:#ccc; font-size:11px; margin-bottom:20px; line-height:1.5;">${t('sup_desc')}</p>

                        <span class="ymh-label" style="text-align:left; color:var(--ymh-theme);">${t('lbl_pix')}</span>
                        <div class="ymh-copy-row">
                            <div style="display:flex; align-items:center; gap:10px; flex:1; background:#111; padding:8px; border-radius:4px; border:1px solid #333;">
                                <img src="${ICONS.pix}" style="width:20px;">
                                <input type="text" style="background:none; border:none; color:#ccc; width:100%; font-size:11px;" readonly value="69993230419">
                            </div>
                            <button class="ymh-copy-btn">${t('btn_copy')}</button>
                        </div>

                        <span class="ymh-label" style="text-align:left; margin-top:15px; color:var(--ymh-theme);">${t('lbl_crypto')}</span>

                        <div class="ymh-crypto-chip" data-val="0xd8724d0b19d355e9817d2a468f49e8ce067e70a6">
                            <div><img src="${ICONS.eth}"> Ethereum (ETH)</div> <small>${t('btn_copy')}</small>
                        </div>
                        <div class="ymh-crypto-chip" data-val="bc1q6gz3dtj9qvlxyyh3grz35x8xc7hkuj07knlemn">
                            <div><img src="${ICONS.btc}"> Bitcoin (BTC)</div> <small>${t('btn_copy')}</small>
                        </div>
                        <div class="ymh-crypto-chip" data-val="7ztAogE7SsyBw7mwVHhUr5ZcjUXQr99JoJ6oAgP99aCn">
                            <div><img src="${ICONS.sol}"> Solana (SOL)</div> <small>${t('btn_copy')}</small>
                        </div>
                        <div class="ymh-crypto-chip" data-val="0xd8724d0b19d355e9817d2a468f49e8ce067e70a6">
                            <div><img src="${ICONS.bnb}"> BNB (BSC)</div> <small>${t('btn_copy')}</small>
                        </div>
                         <div class="ymh-crypto-chip" data-val="0xd8724d0b19d355e9817d2a468f49e8ce067e70a6">
                            <div><img src="${ICONS.matic}"> Polygon (MATIC)</div> <small>${t('btn_copy')}</small>
                        </div>
                        <div class="ymh-crypto-chip" data-val="0xd8724d0b19d355e9817d2a468f49e8ce067e70a6">
                            <div><img src="${ICONS.arb}"> Arbitrum (ARB)</div> <small>${t('btn_copy')}</small>
                        </div>

                        <a href="https://www.paypal.com/donate/?business=4J4UK7ACU3DS6" target="_blank" class="ymh-paypal-btn">
                            <img src="${ICONS.paypal}"> ${t('lbl_paypal')}
                        </a>
                    </div>
                </div>

                <div id="tab-config" class="ymh-section">
                    <div class="ymh-box">
                        <span class="ymh-label">${t('cfg_theme')}</span>
                        <div class="ymh-theme-grid">
                            <div class="ymh-theme-btn" style="background:#00E676" data-color="#00E676"></div>
                            <div class="ymh-theme-btn" style="background:#2979FF" data-color="#2979FF"></div>
                            <div class="ymh-theme-btn" style="background:#FF1744" data-color="#FF1744"></div>
                            <div class="ymh-theme-btn" style="background:#D500F9" data-color="#D500F9"></div>
                            <div class="ymh-theme-btn" style="background:#FF9100" data-color="#FF9100"></div>
                        </div>

                        <span class="ymh-label" style="margin-top:20px;">${t('cfg_keys')}</span>
                        <div class="ymh-shortcut-row"><span>${t('key_h')}</span><span class="ymh-shortcut-key">Alt + X</span></div>
                        <div class="ymh-shortcut-row"><span>${t('key_s')}</span><span class="ymh-shortcut-key">Alt + S</span></div>
                        <div class="ymh-shortcut-row"><span>${t('key_b')}</span><span class="ymh-shortcut-key">Alt + B</span></div>

                        <button class="ymh-btn btn-sec" id="btn-hide-ui" style="margin-top:20px; border-color:#D32F2F; color:#D32F2F;">⛔ ${t('cfg_hide')}</button>
                    </div>
                </div>

                <div class="ymh-copyright">
                    Developed for <b style="color:#ccc">Tauã B. Kloch Leite</b><br>
                    All rights reserved © 2025
                </div>

            </div>
        </div>
        <div id="ymh-bar" class="visible ${visibilityClass}">
            <div class="ymh-bar-head">
                <div class="ymh-gal-ctrl">
                    <span style="font-weight:bold; color:#fff; font-size:11px;">GALLERY:</span>
                    <select id="ymh-gal-select" class="ymh-select"></select>
                    <button id="ymh-add-gal" class="ymh-icon-btn" title="New Gallery">+</button>
                    <button id="ymh-clear-gal" class="ymh-icon-btn" title="Empty Gallery" style="margin-left:5px;">♻️</button>
                    <button id="ymh-del-gal" class="ymh-icon-btn btn-danger" title="Delete Gallery">🗑️</button>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:11px; color:#aaa;">ITEMS: <span id="col-count">0</span></span>
                    <span style="cursor:pointer; color:var(--ymh-theme); font-weight:bold; font-size:11px;" id="btn-dl-all">${t('btn_dl')}</span>
                    <span style="cursor:pointer;" id="btn-hide-bar">▼</span>
                </div>
            </div>
            <div class="ymh-bar-list" id="ymh-col-list"></div>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);

    // --- 7. LOGIC ---
    const suite = document.getElementById('ymh-suite');
    const bar = document.getElementById('ymh-bar');
    const bigPreview = document.getElementById('ymh-big-preview');
    const contentArea = document.querySelector('.ymh-content');

    // INITIAL THEME APPLY
    document.documentElement.style.setProperty('--ymh-theme', state.themeColor);

    // TOGGLE VISIBILITY
    document.getElementById('ymh-trigger').onclick = toggleSuite;
    document.getElementById('ymh-close').onclick = toggleSuite;
    document.getElementById('btn-hide-bar').onclick = toggleBar;
    document.getElementById('ymh-power-btn').onclick = toggleMasterVisibility;
    document.getElementById('btn-hide-ui').onclick = toggleMasterVisibility;

    function toggleSuite() { state.isOpen = !state.isOpen; state.isOpen ? suite.classList.add('visible') : suite.classList.remove('visible'); }
    function toggleBar() { state.isBarOpen = !state.isBarOpen; state.isBarOpen ? bar.classList.add('visible') : bar.classList.remove('visible'); }

    document.querySelectorAll('.ymh-nav-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.ymh-nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.ymh-section').forEach(s => s.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
            state.activeTab = btn.dataset.tab;
        };
    });
    // SUPPORT TAB LOGIC
    document.querySelectorAll('.ymh-copy-btn').forEach(btn => {
        btn.onclick = () => {
            const input = btn.parentElement.querySelector('input');
            input.select();
            document.execCommand('copy');
            const originalText = btn.innerText;
            btn.innerText = t('copied');
            setTimeout(() => btn.innerText = originalText, 2000);
        };
    });
    document.querySelectorAll('.ymh-crypto-chip').forEach(chip => {
        chip.onclick = () => {
            const val = chip.dataset.val;
            GM_setClipboard(val);
            const small = chip.querySelector('small');
            const original = small.innerText;
            small.innerText = t('copied');
            small.style.color = 'var(--ymh-theme)';
            setTimeout(() => { small.innerText = original; small.style.color = '#aaa'; }, 2000);
        };
    });
    // CONFIG TAB LOGIC
    document.querySelectorAll('.ymh-theme-btn').forEach(btn => {
        btn.onclick = () => {
            setTheme(btn.dataset.color);
        };
    });
    document.querySelectorAll('.ymh-chip').forEach(chip => {
        chip.onclick = () => {
            if (chip.dataset.orient) {
                chip.parentElement.querySelectorAll('.ymh-chip').forEach(c => c.classList.remove('selected'));
                chip.classList.add('selected');
                state.orientation = chip.dataset.orient;
            }
        };
    });

    // AUTO-SCAN
    const mutationConfig = { childList: true, subtree: true };
    const observerCallback = function(mutationsList, observer) {
        if (state.isScanning && state.isOpen && state.isVisible) {
            if(state.scrollTimer) clearTimeout(state.scrollTimer);
            state.scrollTimer = setTimeout(() => { scanPage(false, state.currentMode === 'videos' ? 'video' : 'image'); }, 500);
        }
    };
    state.observer = new MutationObserver(observerCallback);
    state.observer.observe(document.body, mutationConfig);

    window.addEventListener('scroll', () => {
        if (state.isScanning && state.isOpen && state.isVisible) scanPage(false, state.currentMode === 'videos' ? 'video' : 'image');
    });
    if (state.pulseInterval) clearInterval(state.pulseInterval);
    state.pulseInterval = setInterval(() => {
        if (!state.isOpen || !state.isVisible) return;
        if (state.isScanning) {
            scanPage(false, state.currentMode === 'videos' ? 'video' : 'image');
        } else if (state.currentQuery && !state.isLoading) {
             const distanceToBottom = contentArea.scrollHeight - contentArea.scrollTop - contentArea.offsetHeight;
             if (distanceToBottom < 1500) {
                 state.page++;
                 if (state.currentMode === 'videos') searchVideos(false);
                 else searchPhotos(false);
             }
        }
    }, 2000);
    function searchPhotos(isNew = true) {
        let query = document.getElementById('ymh-input-p').value;
        if (!query) return;
        if (isNew) {
            state.isScanning = false;
            wipeResults('photo');
            state.currentMode = 'photos';
            state.currentQuery = query;
            addToHistory(query);
        }
        const container = document.getElementById('ymh-res-p');
        if(isNew) container.innerHTML = `<div class="ymh-loading">${t('load')}</div>`;
        state.isLoading = true;
        const finish = () => { state.isLoading = false; };
        let orientUnsplash = state.orientation; if(state.orientation === 'all') orientUnsplash = '';
        let orientPexels = state.orientation; if(state.orientation === 'all') orientPexels = '';
        let orientPixabay = state.orientation; if(state.orientation === 'landscape') orientPixabay = 'horizontal'; if(state.orientation === 'portrait') orientPixabay = 'vertical';
        if (state.sources.unsplash) {
            const uUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=12&page=${state.page}&orientation=${orientUnsplash}`;
            GM_xmlhttpRequest({ method: "GET", url: uUrl, onload: (res) => { try { const data = JSON.parse(res.responseText); if(container.innerText.includes('Scanning')) container.innerHTML = ''; data.results.forEach(p => renderResult(container, p.urls.small, p.urls.regular, 'Unsplash')); } catch(e){} finish(); }, onerror: finish });
        }
        if (state.sources.pexels) {
            const pUrl = `https://www.pexels.com/search/${encodeURIComponent(query)}/?page=${state.page}&orientation=${orientPexels}`;
            GM_xmlhttpRequest({ method: "GET", url: pUrl, headers: { "User-Agent": navigator.userAgent }, onload: (res) => { const doc = new DOMParser().parseFromString(res.responseText, "text/html"); doc.querySelectorAll('img').forEach(img => { const src = extractValidImage(img); if(src && src.includes('images.pexels.com/photos')) renderResult(container, src.replace('w=500', 'w=300'), src.split('?')[0], 'Pexels'); }); finish(); }, onerror: finish });
        }
        if (state.sources.pixabay) {
            const pbUrl = `https://pixabay.com/images/search/${encodeURIComponent(query)}/?pagi=${state.page}&orientation=${orientPixabay}`;
            GM_xmlhttpRequest({ method: "GET", url: pbUrl, headers: { "User-Agent": navigator.userAgent }, onload: (res) => { const doc = new DOMParser().parseFromString(res.responseText, "text/html"); if(container.innerText.includes('Scanning')) container.innerHTML = ''; doc.querySelectorAll('a > img').forEach(img => { const src = extractValidImage(img); if (src && src.includes('pixabay.com/photo')) renderResult(container, src, src.replace('_340', '_1280').replace('__340', '_1280'), 'Pixabay'); }); finish(); }, onerror: finish });
        }
        if (state.sources.wikimedia) {
             const wUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=10&gsroffset=${(state.page-1)*10}&prop=imageinfo&iiprop=url&format=json&origin=*`;
            GM_xmlhttpRequest({ method: "GET", url: wUrl, onload: (res) => { try { const data = JSON.parse(res.responseText); Object.values(data.query.pages).forEach(page => { if(page.imageinfo && page.imageinfo[0]) renderResult(container, page.imageinfo[0].url, page.imageinfo[0].url, 'Wikimedia'); }); } catch(e){} finish(); }, onerror: finish });
        }
    }

    function searchVideos(isNew = true) {
        const query = document.getElementById('ymh-input-v').value;
        if (!query) return alert("Type something!");
        if(isNew) {
            state.isScanning = false;
            addToHistory(query);
            wipeResults('video');
            state.currentMode = 'videos';
            state.currentQuery = query;
        }
        const container = document.getElementById('ymh-res-v');
        if(isNew) container.innerHTML = `<div class="ymh-loading">${t('load')}</div>`;
        state.isLoading = true;
        const finish = () => { state.isLoading = false; };
        if (state.sources.mixkit) {
            const mkUrl = `https://mixkit.co/free-stock-video/${encodeURIComponent(query)}/?page=${state.page}`;
            GM_xmlhttpRequest({ method: "GET", url: mkUrl, onload: (res) => { if(container.innerText.includes('Searching')) container.innerHTML = ''; const doc = new DOMParser().parseFromString(res.responseText, "text/html"); doc.querySelectorAll('video').forEach(vid => { if(vid.src) renderResult(container, vid.src, vid.src, 'Mixkit', 'video'); }); finish(); }, onerror: finish });
        }
        if (state.sources.pixabayVideo) {
            const pbUrl = `https://pixabay.com/videos/search/${encodeURIComponent(query)}/?pagi=${state.page}`;
            GM_xmlhttpRequest({ method: "GET", url: pbUrl, onload: (res) => { const doc = new DOMParser().parseFromString(res.responseText, "text/html"); doc.querySelectorAll('a[href*="/videos/"]').forEach(a => { const img = a.querySelector('img'); const thumb = extractValidImage(img); if(thumb && !a.href.includes('search')) { const largeVideo = magicPixabayLink(thumb); renderResult(container, thumb, largeVideo, 'Pixabay Video', 'image'); } }); finish(); }, onerror: finish });
        }
        if (state.sources.pexelsVideo) {
             const pxUrl = `https://www.pexels.com/search/videos/${encodeURIComponent(query)}/?page=${state.page}`;
            GM_xmlhttpRequest({ method: "GET", url: pxUrl, headers: { "User-Agent": navigator.userAgent }, onload: (res) => { const doc = new DOMParser().parseFromString(res.responseText, "text/html"); let found = false; doc.querySelectorAll('video source').forEach(src => { if(src.type === 'video/mp4') { renderResult(container, src.src, src.src, 'Pexels', 'video'); found = true; } }); if(!found) { doc.querySelectorAll('a[href*="/video/"]').forEach(a => { const img = a.querySelector('img'); const thumb = extractValidImage(img); if(thumb) { const dlLink = magicPexelsLink(a.href); renderResult(container, thumb, dlLink, 'Pexels (Link)', 'image'); } }); } finish(); }, onerror: finish });
        }
        if (state.sources.youtube) {
            const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+4k`;
            GM_xmlhttpRequest({ method: "GET", url: ytUrl, onload: (res) => { const match = res.responseText.match(/var ytInitialData = ({.*?});/); if(match) { try { const data = JSON.parse(match[1]); const items = data.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents; items.forEach(item => { if(item.videoRenderer) { const v = item.videoRenderer; const thumb = v.thumbnail.thumbnails[0].url; renderResult(container, thumb, `https://www.youtube.com/watch?v=${v.videoId}`, 'YouTube', 'image'); } }); } catch(e){} } finish(); }, onerror: finish });
        }
    }

    // --- DEEP SCAN (SMART MATCHER) ---
    function scanPage(isNew = true, mode = 'image') {
        const containerId = mode === 'video' ? 'ymh-res-v' : 'ymh-res-p';
        const container = document.getElementById(containerId);
        if (isNew) {
            state.isScanning = true;
            state.currentQuery = '';
            state.currentMode = mode === 'image' ? 'photos' : 'videos';
            wipeResults(mode === 'video' ? 'video' : 'photo');
            container.innerHTML = `<div class="ymh-loading">${t('load')}</div>`;
        }

        const foundItems = new Set();
        container.querySelectorAll('.ymh-res-item').forEach(i => {
            if(i.dataset.full) foundItems.add(i.dataset.full);
        });
        if (mode === 'image') {
            const processImg = (src) => {
                if (!src || src.startsWith('data:') || foundItems.has(src)) return;
                const i = new Image();
                i.referrerPolicy = "no-referrer";
                i.src = src;
                i.onload = () => {
                    if (i.width >= (state.minSize || 150) && i.height >= 150) {
                        foundItems.add(src);
                        if(container.innerText.includes('Scanning')) container.innerHTML = '';
                        renderResult(container, src, src, `${i.width}x${i.height}`, 'image');
                    }
                };
            };
            document.querySelectorAll('img').forEach(img => processImg(extractValidImage(img)));
            document.querySelectorAll('*').forEach(el => {
                const bg = window.getComputedStyle(el).backgroundImage;
                if (bg && bg.startsWith('url')) processImg(bg.slice(5, -2).replace(/['"]/g, ''));
            });
        } else {
            document.querySelectorAll('a[href*="/videos/"], a[href*="/video/"]').forEach(a => {
                 if (a.href.includes('canva.com')) return;
                 const img = a.querySelector('img');
                 if (img) {
                     const thumbUrl = extractValidImage(img);
                     if(thumbUrl && !foundItems.has(thumbUrl)) {
                         foundItems.add(thumbUrl);
                         if(container.innerText.includes('Scanning')) container.innerHTML = '';
                         const finalUrl = a.href.includes('pixabay') ? magicPixabayLink(thumbUrl) : a.href;
                         renderResult(container, thumbUrl, finalUrl, 'Page Link', 'image');
                     }
                 }
            });
            const rawHtml = document.body.innerHTML;
            const xvVideoMatch = rawHtml.match(/html5player\.setVideoUrlHigh\('([^']+)'\)/);
            const xvThumbMatch = rawHtml.match(/html5player\.setThumbUrl169\('([^']+)'\)/);
            if (xvVideoMatch && xvVideoMatch[1] && !foundItems.has(xvVideoMatch[1])) {
                const videoUrl = xvVideoMatch[1];
                const thumbUrl = (xvThumbMatch && xvThumbMatch[1]) ? xvThumbMatch[1] : 'https://cdn-icons-png.flaticon.com/512/4404/4404094.png';
                foundItems.add(videoUrl);
                if(container.innerText.includes('Scanning')) container.innerHTML = '';
                renderResult(container, thumbUrl, videoUrl, t('xray_src'), 'image');
            }

            const mp4Matches = rawHtml.match(/https?:\/\/[^\s"']+\.mp4([^\s"']*)/g);
            if (mp4Matches) {
                mp4Matches.forEach(url => {
                    let clean = url.replace(/\\/g, '').replace(/["']/g, '');
                    if(clean.includes('360p') && mp4Matches.some(u => u.includes('1080p') || u.includes('720p'))) return;

                    if (clean.length < 500 && !foundItems.has(clean) && !clean.includes('canva')) {
                         foundItems.add(clean);
                         if(container.innerText.includes('Scanning')) container.innerHTML = '';

                         let thumb = 'https://cdn-icons-png.flaticon.com/512/4404/4404094.png';
                         const idMatch = clean.match(/(\d+)/g);
                         if (idMatch) {
                             const longestId = idMatch.reduce((a, b) => a.length > b.length ? a : b);
                             if (longestId.length > 3) {
                                 const matchingImg = Array.from(document.querySelectorAll('img')).find(img => img.src.includes(longestId) && !img.closest('#ymh-suite'));
                                 if(matchingImg) thumb = matchingImg.src;
                             }
                         }
                         renderResult(container, thumb, clean, t('xray_src'), 'image');
                    }
                });
            }

            if (location.hostname.includes('youtube')) {
                 document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer').forEach(vid => {
                     const link = vid.querySelector('a#thumbnail');
                     const img = vid.querySelector('img');
                     if (link && img && img.src) {
                         const fullLink = 'https://www.youtube.com' + link.getAttribute('href').split('&')[0];
                         if (!foundItems.has(fullLink)) {
                             foundItems.add(fullLink);
                             if(container.innerText.includes('Scanning')) container.innerHTML = '';
                             renderResult(container, img.src, fullLink, t('source_yt_scan'), 'image');
                         }
                     }
                 });
            }

            document.querySelectorAll('video').forEach(vid => {
                const src = vid.src || vid.querySelector('source')?.src;
                const poster = vid.poster;
                if(src && !src.includes('canva') && !foundItems.has(src)) {
                    foundItems.add(src);
                    if(container.innerText.includes('Scanning')) container.innerHTML = '';
                    renderResult(container, poster || src, src, t('vid_tag'), 'video');
                }
            });
            const videoExts = ['.mp4', '.webm', '.mkv', '.mov', '.avi', '.m4v'];
            document.querySelectorAll('a').forEach(link => {
                if (link.href.includes('canva.com') || link.href.includes('content-partner')) return;
                if (link.href && videoExts.some(ext => link.href.toLowerCase().includes(ext))) {
                     if(!foundItems.has(link.href)) {
                         foundItems.add(link.href);
                         if(container.innerText.includes('Scanning')) container.innerHTML = '';
                         renderResult(container, link.href, link.href, t('file_link'), 'video');
                     }
                }
            });
        }
    }

    function renderResult(container, thumb, full, label, type='image') {
        const div = document.createElement('div');
        div.className = 'ymh-res-item';
        div.dataset.full = full;

        // FIXED: ADDED referrerpolicy="no-referrer" TO VIDEO TAG
        let content = (type === 'video') ?
            `<video src="${thumb}" referrerpolicy="no-referrer" muted onmouseover="this.play()" onmouseout="this.pause()"></video>` : `<img src="${thumb}" referrerpolicy="no-referrer">`;
        div.innerHTML = `${content}<div class="ymh-badge">${label}</div>`;
        div.onclick = () => {
             let finalUrl = full;
             if (full.includes('pixabay')) finalUrl = magicPixabayLink(full);
             const isVideoFile = finalUrl.match(/\.(mp4|webm|mkv|mov|avi|m4v)(\?|$)/i) || finalUrl.includes('/video') || finalUrl.includes('cdn77');
             const isYT = finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be');
             const finalType = isYT ? 'youtube' : (isVideoFile ? 'video' : 'image');
             addToCollection(finalUrl, thumb, finalType);
        };
        container.appendChild(div);
    }

    function updateGalleryDropdown() {
        const select = document.getElementById('ymh-gal-select');
        select.innerHTML = '';
        state.collections.forEach((col, idx) => {
            const option = document.createElement('option');
            option.value = idx;
            option.text = `${col.name} (${col.items.length})`;
            if(idx === state.activeCollectionIndex) option.selected = true;
            select.appendChild(option);
        });
    }
    document.getElementById('ymh-gal-select').onchange = (e) => {
        state.activeCollectionIndex = parseInt(e.target.value);
        saveCollections();
        renderCollection();
    };
    document.getElementById('ymh-add-gal').onclick = () => {
        const name = prompt("New Gallery Name:");
        if(name) {
            state.collections.push({ name, items: [] });
            state.activeCollectionIndex = state.collections.length - 1;
            saveCollections(); updateGalleryDropdown(); renderCollection();
        }
    };
    document.getElementById('ymh-del-gal').onclick = () => {
        if(state.collections.length <= 1) return alert("Cannot delete default gallery.");
        if(confirm(t('confirm_del'))) {
            state.collections.splice(state.activeCollectionIndex, 1);
            state.activeCollectionIndex = 0;
            saveCollections(); updateGalleryDropdown();
            renderCollection();
        }
    };
    document.getElementById('ymh-clear-gal').onclick = () => {
        if(confirm(t('confirm_clr'))) {
            const active = getActiveCollection();
            active.items = [];
            saveCollections(); renderCollection(); updateGalleryDropdown();
        }
    };
    function addToCollection(full, thumb, type) {
        const active = getActiveCollection();
        if (active.items.some(i => i.full === full)) return;
        const name = getFileNameFromUrl(full, type);
        active.items.push({ full, thumb, type, name });
        saveCollections(); renderCollection();
        updateGalleryDropdown();
    }

    function renderCollection() {
        const list = document.getElementById('ymh-col-list');
        const bigPreview = document.getElementById('ymh-big-preview');
        const active = getActiveCollection();
        document.getElementById('col-count').innerText = active.items.length;
        list.innerHTML = '';
        active.items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'ymh-col-item';

            const isImageThumb = item.thumb.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);

            const media = (item.type === 'video' || item.type === 'youtube')
                ? (isImageThumb ? `<img src="${item.thumb}">` : `<video src="${item.thumb}" muted></video>`)
                : `<img src="${item.thumb}" referrerpolicy="no-referrer">`;

            div.innerHTML = `${media}<div class="ymh-col-overlay"><button class="ymh-mini-btn btn-dl">DOWNLOAD</button><div class="ymh-btn-row"><button class="ymh-mini-btn btn-google" title="Lens">G</button><button class="ymh-mini-btn btn-yandex" title="Yandex">Y</button></div><button class="ymh-mini-btn btn-rmv">REMOVE</button></div>`;

            div.onmouseenter = () => {
                bigPreview.style.display = 'block';
                if (item.type === 'youtube') {
                    const id = getYoutubeID(item.full);
                    bigPreview.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0" style="width:100%;height:100%;border:none;"></iframe>`;
                } else if (item.type === 'video') {
                     bigPreview.innerHTML = `<video src="${item.full}" poster="${item.thumb}" autoplay muted loop style="width:100%;height:100%;object-fit:contain;"></video>`;
                } else {
                     bigPreview.innerHTML = `<img src="${item.full}" style="width:100%;height:100%;object-fit:contain;">`;
                }
            };
            div.onmouseleave = () => { bigPreview.style.display = 'none'; bigPreview.innerHTML = ''; };
            div.querySelector('.btn-rmv').onclick = () => {
                active.items.splice(index, 1);
                saveCollections();
                renderCollection();
                updateGalleryDropdown();
                bigPreview.style.display = 'none';
            };

            div.querySelector('.btn-dl').onclick = () => {
                if (item.type === 'youtube') {
                    if (div.querySelector('.ymh-yt-menu')) {
                        div.querySelector('.ymh-yt-menu').remove();
                        return;
                    }
                    const menu = document.createElement('div');
                    menu.className = 'ymh-yt-menu';
                    menu.innerHTML = `
                        <div class="ymh-yt-opt" data-srv="cobalt">Cobalt (4K/Best)</div>
                        <div class="ymh-yt-opt" data-srv="y2mate">Y2Mate</div>
                        <div class="ymh-yt-opt" data-srv="savefrom">SaveFrom</div>
                        <div class="ymh-yt-opt" data-srv="copy">${t('yt_copy').replace('!','')}</div>
                    `;
                    div.appendChild(menu);
                    menu.querySelectorAll('.ymh-yt-opt').forEach(opt => {
                        opt.onclick = () => {
                            const srv = opt.dataset.srv;
                            const vidId = getYoutubeID(item.full);
                            if (srv === 'cobalt') {
                                GM_setClipboard(item.full);
                                alert(t('yt_copy'));
                                window.open('https://cobalt.tools/', '_blank');
                            } else if (srv === 'y2mate') {
                                window.open(`https://www.y2mate.com/youtube/${vidId}`, '_blank');
                            } else if (srv === 'savefrom') {
                                window.open(`https://en.savefrom.net/1-youtube-video-downloader-360/?url=${encodeURIComponent(item.full)}`, '_blank');
                            } else if (srv === 'copy') {
                                GM_setClipboard(item.full);
                                alert(t('yt_copy'));
                            }
                            menu.remove();
                        };
                    });
                    div.onmouseleave = () => {
                        menu.remove();
                        bigPreview.style.display = 'none';
                        bigPreview.innerHTML = '';
                    };
                } else {
                    GM_download({ url: item.full, name: item.name, saveAs: false });
                }
            };

            div.querySelector('.btn-google').onclick = () => GM_openInTab(`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(item.full)}`, {active:true});
            div.querySelector('.btn-yandex').onclick = () => GM_openInTab(`https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(item.full)}`, {active:true});
            list.appendChild(div);
        });
    }

    function addToHistory(term) {
        state.history = state.history.filter(h => h !== term);
        state.history.unshift(term);
        saveHistory(); renderHistory();
    }
    function renderHistory() {
        const list = document.getElementById('ymh-hist-list');
        list.innerHTML = '';
        state.history.forEach(term => {
            const div = document.createElement('div');
            div.className = 'ymh-hist-item';
            div.innerText = `🕒 ${term}`;
            div.onclick = () => {
                document.getElementById('ymh-input-p').value = term;
                document.getElementById('ymh-input-v').value = term;
                if (state.currentMode === 'videos') searchVideos(true);
                else searchPhotos(true);
            };
            list.appendChild(div);
        });
    }

    document.getElementById('btn-search-p').onclick = () => searchPhotos(true);
    document.getElementById('btn-scan').onclick = () => scanPage(true, 'image');
    document.getElementById('btn-search-v').onclick = () => searchVideos(true);
    document.getElementById('btn-scan-v').onclick = () => scanPage(true, 'video');
    document.getElementById('btn-clear-hist').onclick = () => { state.history = []; saveHistory(); };
    document.querySelectorAll('.ymh-eng-btn').forEach(btn => btn.onclick = () => openExternal(btn.dataset.eng));
    document.getElementById('btn-search-world').onclick = () => ['google', 'yandex', 'bing', 'flickr', 'openverse'].forEach(eng => openExternal(eng));
    document.getElementById('ymh-input-p').addEventListener('keypress', (e) => { if(e.key==='Enter') searchPhotos(true); });
    document.getElementById('ymh-input-v').addEventListener('keypress', (e) => { if(e.key==='Enter') searchVideos(true); });
    document.getElementById('btn-dl-all').onclick = () => {
        const active = getActiveCollection();
        if(active.items.length === 0) return alert(t('empty'));
        const btn = document.getElementById('btn-dl-all');
        btn.innerText = t('dl_wait');
        active.items.forEach((item, i) => {
             if (item.type === 'youtube') {
                 // Skip auto-download for YT in batch to avoid popup hell/errors
             } else {
                 GM_download({ url: item.full, name: item.name, saveAs: false });
             }
        });
        setTimeout(() => btn.innerText = t('btn_dl'), 3000);
    };
    function openExternal(engine) {
        const q = document.getElementById('ymh-input-p').value;
        if(!q) return alert("Enter keyword!");
        const enc = encodeURIComponent(q);
        let url = '';
        switch(engine) {
            case 'google': url = `https://www.google.com/search?tbm=isch&q=${enc}&tbs=isz:lt,islt:2mp`; break;
            case 'yandex': url = `https://yandex.com/images/search?text=${enc}&isize=large`; break;
            case 'bing': url = `https://www.bing.com/images/search?q=${enc}&qft=+filterui:imagesize-large`; break;
            case 'flickr': url = `https://www.flickr.com/search/?text=${enc}&license=2%2C3%2C4%2C5%2C6%2C9`; break;
            case 'openverse': url = `https://openverse.org/search/image?q=${enc}`; break;
            case 'tineye': url = `https://tineye.com/`; break;
        }
        if (window.location.hostname.includes(engine.split('.')[0])) window.location.href = url;
        else GM_openInTab(url, {active:true});
    }

    updateGalleryDropdown();
    renderCollection();
    renderHistory();

})();
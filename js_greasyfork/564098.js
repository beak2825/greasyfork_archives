// ==UserScript==
// @name         X-Vision：沉浸式影院播放器
// @name:en      X-Vision: Cinematic Player Pro
// @name:ja      X-Vision：没入型シネマプレーヤー
// @name:ko      X-Vision: 몰입형 시네마 플레이어
// @name:ru      X-Vision: Кинематографический плеер
// @name:th      X-Vision: เครื่องเล่นภาพยนตร์แบบแช่ตัว
// @name:fr      X-Vision: Lecteur Cinématographique Pro
// @name:de      X-Vision: Kinematografischer Player Pro
// @name:es      X-Vision: Reproductor Cinematográfico Pro
// @name:pt      X-Vision: Player Cinematográfico Pro
// @name:it      X-Vision: Player Cinematografico Pro
// @namespace    leo.local
// @version      1.1.2
// @description  X-Vision：沉浸式影院播放器 - Apple风格设计，支持长按2倍速、智能预加载、手势快捷操作、PiP画中画、智能续播（记住进度）
// @description:en X-Vision: Cinematic Player Pro - Apple-style design with long-press 2x speed, smart preloading, gesture shortcuts, PiP picture-in-picture, and smart resume (remembers progress)
// @description:ja X-Vision：没入型シネマプレーヤー - Appleスタイルデザイン、長押し2倍速、スマートプリロード、ジェスチャーショートカット、PiP画中画、スマート再開（進捗を記憶）
// @description:ko X-Vision: 몰입형 시네마 플레이어 - Apple 스타일 디자인, 길게 누르기 2배속, 스마트 프리로딩, 제스처 단축키, PiP 화면 속 화면, 스마트 재개 (진행률 기억)
// @description:ru X-Vision: Кинематографический плеер - Дизайн в стиле Apple с 2x скоростью при долгом нажатии, умной предзагрузкой, жестовыми ярлыками, PiP картинка в картинке и умным возобновлением (запоминает прогресс)
// @description:th X-Vision: เครื่องเล่นภาพยนตร์แบบแช่ตัว - การออกแบบสไตล์ Apple พร้อมความเร็ว 2x เมื่อกดค้าง การโหลดล่วงหน้าอัจฉริยะ ทางลัดด้วยท่าทาง PiP ภาพในภาพ และการเล่นต่ออัจฉริยะ (จำความคืบหน้า)
// @description:fr X-Vision: Lecteur Cinématographique Pro - Design style Apple avec vitesse 2x en appui long, préchargement intelligent, raccourcis gestuels, PiP image dans l'image et reprise intelligente (mémorise la progression)
// @description:de X-Vision: Kinematografischer Player Pro - Apple-Design mit 2x Geschwindigkeit bei langem Drücken, intelligentem Vorladen, Gestenkürzeln, PiP Bild-im-Bild und intelligentem Fortsetzen (merkt sich den Fortschritt)
// @description:es X-Vision: Reproductor Cinematográfico Pro - Diseño estilo Apple con velocidad 2x al mantener presionado, precarga inteligente, atajos gestuales, PiP imagen en imagen y reanudación inteligente (recuerda el progreso)
// @description:pt X-Vision: Player Cinematográfico Pro - Design estilo Apple com velocidade 2x ao pressionar, pré-carregamento inteligente, atalhos gestuais, PiP imagem em imagem e retomada inteligente (lembra o progresso)
// @description:it X-Vision: Player Cinematografico Pro - Design stile Apple con velocità 2x premendo a lungo, precaricamento intelligente, scorciatoie gestuali, PiP picture-in-picture e ripresa intelligente (ricorda il progresso)
// @author       Leo (Based on work by Chris_C)
// @license      MIT
// @match        https://twitter-ero-video-ranking.com/*
// @match        https://x-ero-anime.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      twitter-ero-video-ranking.com
// @connect      video.twimg.com
// @connect      pbs.twimg.com
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564098/X-Vision%EF%BC%9A%E6%B2%89%E6%B5%B8%E5%BC%8F%E5%BD%B1%E9%99%A2%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/564098/X-Vision%EF%BC%9A%E6%B2%89%E6%B5%B8%E5%BC%8F%E5%BD%B1%E9%99%A2%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // ========================================
    // 0. 核心修正: 立即注入 Referer 禁用策略
    // ========================================
    const meta = document.createElement('meta');
    meta.name = "referrer";
    meta.content = "no-referrer";
    if (document.head) {
        document.head.appendChild(meta);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.head) {
                document.head.appendChild(meta);
                obs.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
 
    // ========================================
    // 样式定义 - TikTok风格模态框
    // ========================================
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap');
 
        body {
            background-color: #000 !important;
        }
 
        body > div.container.mx-auto.mt-3.mb-3.px-2.relative {
            background-color: #fff !important;
        }
 
        :root {
            --primary-red: #FE2C55;
            --primary-cyan: #25F4EE;
            --glass-bg: rgba(20, 20, 20, 0.3);
            --glass-bg-hover: rgba(40, 40, 40, 0.5);
            --glass-border: rgba(255, 255, 255, 0.08);
            --glass-blur: blur(20px);
            --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.2);
            --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.4);
            --ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
            --ease-smooth: cubic-bezier(0.25, 0.8, 0.25, 1);
        }
 
        html.tiktok-modal-open,
        body.tiktok-modal-open {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
            overscroll-behavior: none !important;
            touch-action: none !important;
            background-color: #000 !important;
        }
 
        .tiktok-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw !important;
            height: 100vh !important;
            height: 100dvh !important;
            background: #000;
            z-index: 2147483647;
            display: none;
            flex-direction: column !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            max-width: none !important;
            max-height: none !important;
            
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
            padding-left: env(safe-area-inset-left);
            padding-right: env(safe-area-inset-right);
            opacity: 0;
            transition: opacity 0.3s var(--ease-smooth);
            
            /* Disable selection and touch callouts for long press speed */
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            -khtml-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
 
        .tiktok-modal-overlay.active {
            display: flex;
            opacity: 1;
            animation: modalIn 0.4s var(--ease-smooth) forwards;
        }
 
        @keyframes modalIn {
            from { transform: scale(0.98); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes tiktokFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
 
        /* 视频切换动画 */
        @keyframes slideOutUp {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
        @keyframes slideInDown {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
 
        .tiktok-video-player.slide-out-up { animation: slideOutUp 0.3s ease-out forwards; }
        .tiktok-video-player.slide-in-up { animation: slideInUp 0.3s ease-out forwards; }
        .tiktok-video-player.slide-out-down { animation: slideOutDown 0.3s ease-out forwards; }
        .tiktok-video-player.slide-in-down { animation: slideInDown 0.3s ease-out forwards; }
 
        /* --- 视频容器与遮罩 --- */
        .tiktok-video-container {
            flex: 1;
            position: relative;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            background: #000;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            /* 缩略图背景 */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        }
        
        .tiktok-video-container::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: inherit;
            filter: blur(20px) brightness(0.4);
            transform: scale(1.1);
            z-index: 0;
        }
 
        /* 顶部遮罩 - 柔和的线性渐变 */
        .tiktok-video-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, transparent 100%);
            pointer-events: none;
            z-index: 2;
        }
 
        /* 底部遮罩 - 仅覆盖控件区域 */
        .tiktok-progress-container::before {
            content: '';
            position: absolute;
            left: -10px;  /* 抵消父元素 padding */
            right: -10px; /* 抵消父元素 padding */
            height: 120px;
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
            z-index: -1;
            pointer-events: none;
        }
 
        .tiktok-video-player {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            max-height: none !important;
            object-fit: contain;
            cursor: pointer;
            z-index: 1;
            background: #000;
            opacity: 0;
            transition: opacity 0.15s ease-out;
        }
 
        .tiktok-video-player.visible {
            opacity: 1;
        }
 
        .tiktok-thumbnail-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            max-height: none !important;
            object-fit: contain;
            z-index: 2;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.15s ease-out;
            background: #000;
        }
 
        .tiktok-thumbnail-layer.hidden {
            opacity: 0;
        }
        
        /* 隐藏原生控件 */
        .tiktok-video-player::-webkit-media-controls { display: none !important; }
        .tiktok-video-player::-webkit-media-controls-enclosure { display: none !important; }
 
        /* --- 视频切换动画 --- */
        .tiktok-video-player.slide-out-up, .tiktok-thumbnail-layer.slide-out-up { animation: slideOutUp 0.3s ease-out forwards; }
        .tiktok-video-player.slide-in-up, .tiktok-thumbnail-layer.slide-in-up { animation: slideInUp 0.3s ease-out forwards; }
        .tiktok-video-player.slide-out-down, .tiktok-thumbnail-layer.slide-out-down { animation: slideOutDown 0.3s ease-out forwards; }
        .tiktok-video-player.slide-in-down, .tiktok-thumbnail-layer.slide-in-down { animation: slideInDown 0.3s ease-out forwards; }
        .glass-panel {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow-sm);
            color: rgba(255, 255, 255, 0.95);
        }
 
        /* 关闭按钮 */
        .tiktok-close-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 2147483648;
            transition: all 0.3s var(--ease-smooth);
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border: none; /* Reset */
        }
 
        .tiktok-close-btn:hover {
            background: var(--glass-bg-hover);
            transform: rotate(90deg) scale(1.1);
        }
        
        .tiktok-close-btn svg {
            width: 24px;
            height: 24px;
            fill: white;
        }
 
        /* 未读开关 */
        .tiktok-unread-toggle {
            position: absolute;
            top: 20px;
            right: 80px;
            height: 44px;
            padding: 0 16px;
            border-radius: 22px;
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            z-index: 2147483648;
            font-size: 0.85rem;
            font-weight: 500;
            letter-spacing: 0.5px;
            transition: all 0.3s var(--ease-smooth);
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            color: white;
        }
 
        .tiktok-unread-toggle:hover {
            background: var(--glass-bg-hover);
        }
 
        .toggle-switch {
            width: 36px;
            height: 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            position: relative;
            transition: background 0.3s var(--ease-smooth);
        }
 
        .toggle-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: #fff;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: transform 0.3s var(--ease-elastic);
        }
 
        .tiktok-unread-toggle.active .toggle-switch {
            background: var(--primary-red);
            box-shadow: 0 0 10px rgba(254, 44, 85, 0.4);
        }
 
        .tiktok-unread-toggle.active .toggle-switch::after {
            transform: translateX(16px);
        }
 
        /* 视频计数器 */
        .tiktok-video-count {
            position: absolute;
            top: 20px;
            left: 20px;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 1px;
            z-index: 2147483648;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            color: white;
        }
 
        /* --- 交互动效区域 --- */
        .tiktok-actions {
            position: absolute;
            right: 16px;
            bottom: 140px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            z-index: 2147483648;
        }
 
        .tiktok-action-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }
 
        .tiktok-action-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s var(--ease-elastic);
            /* Glassmorphism for icons */
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
        }
 
        .tiktok-action-item:hover .tiktok-action-icon {
            transform: scale(1.15);
            background: var(--glass-bg-hover);
            border-color: rgba(255,255,255,0.3);
        }
 
        .tiktok-action-icon svg {
            width: 26px;
            height: 26px;
            fill: #fff;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            transition: all 0.3s ease;
        }
 
        /* 点赞动画 */
        .tiktok-action-icon.liked {
            border-color: rgba(254, 44, 85, 0.5);
            background: rgba(254, 44, 85, 0.15);
        }
 
        .tiktok-action-icon.liked svg {
            fill: var(--primary-red);
            filter: drop-shadow(0 0 8px rgba(254, 44, 85, 0.6));
            animation: heartBeat 0.4s var(--ease-elastic);
        }
 
        @keyframes heartBeat {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
        }
 
        .tiktok-action-text {
            font-size: 0.75rem;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            opacity: 0.9;
        }
 
        /* --- 视频信息区 --- */
        .tiktok-video-info {
            position: absolute;
            bottom: 60px;
            left: 16px;
            right: 80px;
            z-index: 2147483647;
            perspective: 1000px;
        }
 
        .tiktok-video-info h3 {
            font-size: 1.1rem;
            font-weight: 700;
            line-height: 1.4;
            margin: 0;
            color: #fff;
            text-shadow: 0 2px 10px rgba(0,0,0,0.5);
            transform-origin: left bottom;
            animation: slideUpFade 0.5s var(--ease-smooth);
        }
 
        @keyframes slideUpFade {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
 
        /* --- 极致进度条 --- */
        /* --- 极致进度条 (触屏优化版) --- */
        .tiktok-progress-container {
            position: absolute;
            bottom: 20px; /* 抬高20px，避开iOS底部Home条 */
            left: 10px;
            right: 10px;
            height: 48px; /* 增加热区高度 */
            display: flex;
            align-items: center; /* 垂直居中对齐，更易点击 */
            padding: 0 10px;
            z-index: 2147483648;
            cursor: pointer;
            /* 增加触摸接触面积但视觉上不影响 */
            touch-action: none; /* 防止拖动时触发浏览器手势 */
        }
        
        /* 交互扩展热区 - 触屏与鼠标优化 */
        .tiktok-progress-container:active .tiktok-progress-bar,
        .tiktok-progress-container:hover .tiktok-progress-bar,
        .tiktok-progress-container.dragging .tiktok-progress-bar {
            height: 8px; /* 加粗 */
            background: rgba(255, 255, 255, 0.5);
            border-radius: 4px;
        }
        
        .tiktok-progress-container:active .tiktok-progress-filled::after,
        .tiktok-progress-container:hover .tiktok-progress-filled::after,
        .tiktok-progress-container.dragging .tiktok-progress-filled::after {
            transform: translateY(-50%) scale(1); /* 显示拖动点 */
        }
        
        /* 拖拽时增强效果 */
        .tiktok-progress-container.dragging .tiktok-progress-filled::after {
            transform: translateY(-50%) scale(1.3); /* 拖动时放大 */
            box-shadow: 0 0 20px rgba(255, 255, 255, 1), 0 0 30px rgba(254, 44, 85, 0.5);
        }
        
        .tiktok-progress-container.dragging .tiktok-progress-filled {
            box-shadow: 0 0 15px rgba(255,255,255,0.8), 0 0 25px rgba(254, 44, 85, 0.4);
        }
 
        .tiktok-progress-bar {
            flex: 1;
            height: 4px; /* 默认加粗一点点，手机上看不清2px */
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            position: relative;
            transition: all 0.15s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
 
        .tiktok-progress-filled {
            height: 100%;
            background: #fff;
            border-radius: 2px;
            width: 0%;
            position: relative;
            box-shadow: 0 0 10px rgba(255,255,255,0.5);
            transition: box-shadow 0.15s ease;
        }
 
        .tiktok-progress-filled::after {
            content: '';
            position: absolute;
            right: -10px; /* 稍微向右偏移，对准手指 */
            top: 50%;
            width: 20px; /* 加大拖动点，触摸更友好 */
            height: 20px;
            background: #fff;
            border-radius: 50%;
            transform: translateY(-50%) scale(0); /* 默认隐藏 */
            transition: transform 0.2s cubic-bezier(0.68, -0.6, 0.32, 1.6), box-shadow 0.2s ease;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
            pointer-events: none; /* 穿透点击，由container接管 */
        }
 
        .tiktok-time-display {
            margin-left: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            font-variant-numeric: tabular-nums;
            color: rgba(255, 255, 255, 0.9);
            text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            opacity: 0.8;
        }
 
        /* --- 加载与错误 --- */
        .tiktok-loading, .tiktok-error {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483648;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            text-align: center;
        }
        
        .tiktok-error { display: none; padding: 20px; max-width: 80%; }
 
        .tiktok-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-top-color: var(--primary-red);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        .tiktok-loading-text { margin-top: 15px; color: rgba(255,255,255,0.7); font-size: 0.9rem; }
        
        .tiktok-error svg { width: 64px; height: 64px; fill: var(--primary-red); margin-bottom: 20px; }
        .tiktok-error h3 { font-size: 1.2rem; margin-bottom: 10px; }
        .tiktok-error p { color: rgba(255,255,255,0.7); margin-bottom: 20px; }
        
        .tiktok-error-btn {
            background: var(--primary-red);
            color: white; border: none;
            padding: 12px 24px; border-radius: 24px;
            font-size: 1rem; cursor: pointer;
            transition: background 0.3s;
        }
        .tiktok-error-btn:hover { background: #e8254d; }
        
        /* 链接按钮 */
        .tiktok-original-link {
            position: absolute; bottom: 30px; right: 20px; z-index: 2147483648;
        }
        .tiktok-original-link a {
            display: flex; align-items: center; gap: 6px;
            color: rgba(255, 255, 255, 0.8); text-decoration: none;
            font-size: 0.8rem; padding: 8px 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px; transition: all 0.3s;
            backdrop-filter: blur(10px);
        }
        .tiktok-original-link a:hover {
            background: rgba(255, 255, 255, 0.2); color: white;
        }
 
        /* --- 音量控制样式 (水平版) --- */
        .tiktok-volume-control {
            position: absolute;
            left: 16px;
            bottom: 140px; /* 与右侧按钮底部对齐 */
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 2147483648;
            transition: all 0.3s var(--ease-smooth);
            padding: 8px;
            border-radius: 30px;
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(4px);
        }
 
        .tiktok-volume-control:hover,
        .tiktok-volume-control.active {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
        }
 
        .tiktok-volume-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s var(--ease-smooth);
            flex-shrink: 0;
        }
 
        .tiktok-volume-control:hover .tiktok-volume-btn {
            background: rgba(255,255,255,0.1);
        }
 
        .tiktok-volume-btn svg {
            width: 20px;
            height: 20px;
            fill: #fff;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
 
        .tiktok-volume-btn.muted svg {
            fill: rgba(255, 255, 255, 0.5);
        }
 
        .tiktok-volume-slider-container {
            width: 0;
            height: 36px;
            display: flex;
            align-items: center;
            overflow: hidden;
            transition: width 0.3s var(--ease-smooth), opacity 0.3s var(--ease-smooth);
            opacity: 0;
        }
 
        .tiktok-volume-control:hover .tiktok-volume-slider-container,
        .tiktok-volume-control.active .tiktok-volume-slider-container {
            width: 80px;
            opacity: 1;
            margin-right: 8px;
        }
 
        .tiktok-volume-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 2px;
            outline: none;
            cursor: pointer;
        }
 
        .tiktok-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            background: #fff;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 1px 4px rgba(0,0,0,0.3);
            transition: transform 0.2s ease;
        }
        
        .tiktok-volume-slider::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
 
        /* --- 顶部控制栏 & 设置面板 --- */
        .tiktok-header {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 16px 20px;
            padding-top: calc(16px + env(safe-area-inset-top));
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 2147483648;
            pointer-events: none; /* 让点击穿透到遮罩关闭 */
        }
 
        .tiktok-header > * {
            pointer-events: auto; /* 恢复按钮点击 */
        }
 
        .tiktok-header-right {
            display: flex;
            align-items: center;
            gap: 12px;
        }
 
        .tiktok-settings-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            -webkit-backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            transition: all 0.3s var(--ease-smooth);
        }
 
        .tiktok-settings-btn:hover, .tiktok-settings-btn.active {
            background: var(--glass-bg-hover);
            transform: rotate(45deg);
        }
 
        .tiktok-settings-btn svg {
            width: 22px;
            height: 22px;
            fill: white;
        }
        
        /* 复用关闭按钮样式，微调位置 */
        .tiktok-close-btn {
            position: static; /* 由 header 管理布局 */
            border: none;
            width: 40px;
            height: 40px;
        }
 
        /* 设置面板 */
        .tiktok-settings-panel {
            position: absolute;
            top: 70px;
            right: 20px;
            top: calc(70px + env(safe-area-inset-top));
            width: 240px;
            background: rgba(20, 20, 20, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
            pointer-events: none;
            transition: all 0.25s var(--ease-smooth);
            z-index: 2147483649;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
 
        .tiktok-settings-panel.active {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }
 
        .tiktok-setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 16px;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.2s;
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            font-weight: 500;
        }
 
        .tiktok-setting-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .tiktok-setting-label {
            display: flex;
            align-items: center;
            gap: 8px;
        }
 
        .tiktok-setting-label svg {
            width: 18px;
            height: 18px;
            fill: rgba(255, 255, 255, 0.7);
        }
 
        /* 开关样式复用并微调 */
        .setting-switch {
            width: 40px;
            height: 24px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            position: relative;
            transition: background 0.3s;
        }
 
        .setting-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
            transition: transform 0.3s var(--ease-elastic);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
 
        .tiktok-setting-item.active .setting-switch {
            background: var(--primary-cyan); /* 默认用青色，更现代 */
        }
        
        .tiktok-setting-item[data-type="unread"].active .setting-switch {
            background: var(--primary-red); /* 未读用红色强调 */
        }
 
        .tiktok-setting-item.active .setting-switch::after {
            transform: translateX(16px);
        }
 
        /* --- 暂停图标 & 倍速提示 --- */
        .tiktok-overlay-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.5);
            width: 80px;
            height: 80px;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            opacity: 0;
            transition: all 0.2s var(--ease-elastic);
            z-index: 2147483648;
        }
 
        .tiktok-overlay-icon.visible {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .tiktok-overlay-icon svg {
            width: 40px;
            height: 40px;
            fill: rgba(255, 255, 255, 0.9);
        }
 
        .tiktok-speed-overlay {
            position: absolute;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 2147483648;
            pointer-events: none;
        }
 
        .tiktok-speed-overlay.visible {
            opacity: 1;
        }
 
        .tiktok-speed-overlay svg {
            width: 16px;
            height: 16px;
            fill: white;
        }
 
        .tiktok-debug-btn {
            padding: 6px 12px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.4);
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;
            /* 布局调整 */
            display: flex;
            align-items: center;
            height: 32px;
            margin-right: 4px;
        }
 
        .tiktok-debug-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            color: rgba(255, 255, 255, 0.9);
            border-color: rgba(255, 255, 255, 0.2);
        }
 
        /* --- 移动端适配调整 --- */
        @media (max-width: 768px) {
            .tiktok-header { padding: 12px 16px; }
            .tiktok-settings-btn, .tiktok-close-btn { width: 36px; height: 36px; }
            .tiktok-video-count { position: static; background: rgba(0,0,0,0.3); padding: 4px 10px; font-size: 12px; }
            
            /* 移动端隐藏 Log 文字，只留图标或简写，防止挤压 */
            .tiktok-debug-btn { 
                padding: 0 8px; 
                font-size: 10px; 
                background: transparent; 
                border: none;
            }
            
            .tiktok-volume-control { bottom: 110px; left: 10px; }
            .tiktok-actions { bottom: 110px; right: 10px; }
            
            /* 移动端音量条展开更宽一点，方便触摸 */
            .tiktok-volume-control.active .tiktok-volume-slider-container { width: 100px; }
        }
 
    `;
 
 
    // ========================================
    // 主要功能类 - TikTokModalPlayer
    // ========================================
    class TikTokModalPlayer {
        constructor() {
            this.currentVideoIndex = 0;
            this.videoList = [];
            this.filteredVideoList = []; // 过滤后的视频列表
            this.isLoading = false;
            this.isDragging = false;
            this.startY = 0;
            this.currentY = 0;
            this.videoElement = null;
            this.isLiked = false;
 
            this.videoUrlCache = new Map();
            
            this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
                            (/AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));
            this.isIOSSafari = this.isIOS && this.isSafari;
 
            // 动画状态
            this.isTransitioning = false;
 
            // 进度条拖拽状态
            this.isProgressDragging = false;
 
            // 重试机制状态
            this.retryCount = 0;
            this.MAX_RETRIES = 3;
            this.retryTimeoutId = null; // 用于取消旧的重试定时器
            this.loadVersion = 0; // 加载版本号，用于丢弃过期的回调
 
            // 已观看视频记录 (localStorage)
            this.WATCHED_STORAGE_KEY = 'tiktok_modal_watched_videos';
            this.watchedVideos = this.loadWatchedVideos();
 
            // 只看未读模式
            this.unreadOnlyMode = false;
 
            // 循环播放模式
            this.isLooping = false;
 
            // 音量控制
            this.VOLUME_STORAGE_KEY = 'tiktok_modal_volume';
            this.currentVolume = this.loadSavedVolume();
            this.isMuted = false;
 
            this.PERF_MODE_KEY = 'tiktok_modal_perf_mode';
            this.perfModeEnabled = this.loadPerfMode();
 
            // Debug模式开关
            this.debugMode = false;
 
            // 统计数据
            this.stats = {
                mp4: 0,
                failed: 0,
                total: 0,
                parsedHistory: []
            };
 
            this.init();
        }
 
        init() {
            // 强制全局禁用 Referer (解决403的关键)
            const meta = document.createElement('meta');
            meta.name = "referrer";
            meta.content = "no-referrer";
            document.head.appendChild(meta);
 
            // 确保 viewport-fit=cover 以扩展到安全区域 (解决底部白条)
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                if (!viewport.content.includes('viewport-fit=cover')) {
                    viewport.content = `${viewport.content}, viewport-fit=cover`;
                }
            } else {
                const v = document.createElement('meta');
                v.name = 'viewport';
                v.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
                document.head.appendChild(v);
            }
 
            // 注入样式
            this.injectStyles();
 
            // 创建模态框DOM (立即可用)
            this.createModalDOM();
            
            // 创建 Debug 按钮
            this.createDebugButton();
 
            // 绑定事件
            this.bindEvents();
 
            // 异步收集视频列表 - 不阻塞模态框初始化
            this.scheduleVideoCollection();
 
            // 启动 DOM 监听，处理动态加载的内容 (修复切换排序后失效的问题)
            this.setupMutationObserver();
 
            console.log('🎬 TikTok Modal Player 初始化完成 - 模态框已就绪');
        }
 
        createDebugButton() {
            const btn = document.createElement('div');
            btn.className = 'tiktok-debug-btn';
            btn.textContent = 'Log'; // 简化文字
            btn.title = '点击复制调试日志';
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyDebugLogs();
            });
 
            const modal = document.getElementById('tiktok-modal');
            if (modal) {
                // 尝试插入到 header 右侧容器
                const headerRight = modal.querySelector('.tiktok-header-right');
                if (headerRight) {
                    // 插入到第一个位置（在设置按钮左边）
                    headerRight.insertBefore(btn, headerRight.firstChild);
                } else {
                    modal.appendChild(btn);
                }
            }
        }
 
        copyDebugLogs() {
            const report = [
                `=== Twitter Video Player Debug Log ===`,
                `Time: ${new Date().toLocaleString()}`,
                `UA: ${navigator.userAgent}`,
                `Platform: ${navigator.platform}`,
                `Version: ${GM_info?.script?.version || 'Unknown'}`,
                ``,
                `=== Statistics ===`,
                `Total Parsed: ${this.stats.total}`,
                `MP4: ${this.stats.mp4}`,
                `Failed: ${this.stats.failed}`,
                `Platform: ${this.isIOS ? 'iOS' : 'Other'} / ${this.isSafari ? 'Safari' : 'Non-Safari'}`,
                ``,
                `=== Recent Parsed Videos (Last 20) ===`,
                ...this.stats.parsedHistory.slice(-20).map(item => 
                    `[${item.time}] ${item.type.toUpperCase()}: ${item.url.slice(-50)}`
                )
            ].join('\n');
 
            navigator.clipboard.writeText(report).then(() => {
                const originalText = document.querySelector('.tiktok-debug-btn').textContent;
                document.querySelector('.tiktok-debug-btn').textContent = '✅ Copied!';
                setTimeout(() => {
                    if(document.querySelector('.tiktok-debug-btn')) 
                        document.querySelector('.tiktok-debug-btn').textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Copy failed', err);
                alert('复制失败，请查看控制台');
            });
        }
 
        setupMutationObserver() {
            // 防抖定时器
            let timeout = null;
 
            const observer = new MutationObserver((mutations) => {
                // 如果模态框是打开的，暂停DOM扫描以节省资源
                if (this.isModalOpen()) return;
 
                // 检查是否有相关节点变动 (简单的性能优化)
                let shouldUpdate = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        shouldUpdate = true;
                        break;
                    }
                }
 
                if (shouldUpdate) {
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        console.log('DOM 变动检测 - 重新扫描视频...');
                        this.collectVideoLinks();
                    }, 500); // 缩短防抖时间到 500ms，提高响应速度
                }
            });
 
            // 监听 body 的子树变化
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
 
            console.log('👀 DOM 监听器已启动');
        }
 
        // 初始化可视区域观察者
        initViewportObserver() {
            // 使用 IntersectionObserver 监听视频元素是否进入可视区域
            this.viewportObserver = new IntersectionObserver((entries) => {
                // 如果模态框已打开，暂停预加载以节省带宽
                if (this.isModalOpen()) return;
 
                entries.forEach(entry => {
                    // 当元素进入可视区域超过 10% 时触发
                    if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                        const element = entry.target;
                        // 找到对应的视频对象
                        const index = this.videoList.findIndex(v => v.element === element);
                        if (index !== -1) {
                            // 触发预加载 (带有防抖，避免滚动过快时触发太多请求)
                            this.scheduleSingleVideoPreload(index);
                        }
                    }
                });
            }, {
                root: null, // 视口作为根
                rootMargin: '100px', // 提前 100px 触发
                threshold: 0.1
            });
        }
 
        scheduleSingleVideoPreload(index) {
            // 简单的防抖机制
            if (this._preloadTimeout) clearTimeout(this._preloadTimeout);
 
            this._preloadTimeout = setTimeout(() => {
                this.preloadSingleVideo(index);
            }, 500); // 停留 500ms 后才开始预加载
        }
 
        async preloadSingleVideo(index) {
            const video = this.videoList[index];
            if (!video) return;
 
            // 1. 如果没有真实URL，先解析
            if (!this.videoUrlCache.has(video.url)) {
                // console.log(`👁️ 视频进入可视区域/悬停，触发预解析: ${index}`);
                try {
                    const realUrl = await this.fetchRealVideoUrl(video.url);
                    if (realUrl) {
                        this.videoUrlCache.set(video.url, realUrl);
                        this.warmupVideoConnection(realUrl);
                    }
                } catch (e) {
                    console.error('预解析失败:', e);
                }
            } else {
                // 2. 如果已有真实URL，直接预热连接
                // console.log(`🔥 视频已解析，触发连接预热: ${index}`);
                const realUrl = this.videoUrlCache.get(video.url);
                this.warmupVideoConnection(realUrl);
            }
        }
 
        // 使用空闲时间收集视频，不阻塞其他操作
        scheduleVideoCollection() {
            const collect = () => {
                this.collectVideoLinks();
                // 首次收集后，如果列表为空，可能页面还没渲染完，设置一个短定时器再次检查
                if (this.videoList.length === 0) {
                    setTimeout(() => this.collectVideoLinks(), 1000);
                }
            };
 
            // 立即尝试一次
            collect();
 
            // 确保在 DOM 加载完成后再次执行
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', collect);
                window.addEventListener('load', collect);
            }
        }
 
        // 启动列表预加载（核心优化：提前解析视频地址）
        async startListPreloading() {
            if (this.isListPreloading) return;
            this.isListPreloading = true;
 
            // console.log('🚀 启动列表预解析 (Top 5)...');
 
            // 优化：优先预加载前3个视频，确保首屏秒开
            const videosToPreload = this.videoList.slice(0, 3);
            let hasNewPreload = false;
 
            for (const video of videosToPreload) {
                // 如果已经缓存了真实URL，跳过
                if (this.videoUrlCache.has(video.url)) continue;
 
                hasNewPreload = true;
                try {
                    const realUrl = await this.fetchRealVideoUrl(video.url);
                    if (realUrl) {
                        this.videoUrlCache.set(video.url, realUrl);
                    }
                    await new Promise(r => setTimeout(r, 100));
                } catch (e) {
                    console.error('列表预解析失败:', video.url, e);
                }
            }
 
            this.isListPreloading = false;
            if (hasNewPreload) {
                console.log('✨ 列表预解析完成 (新缓存已更新)');
            }
        }
 
        injectStyles() {
            const styleSheet = document.createElement('style');
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
 
        createModalDOM() {
            const modal = document.createElement('div');
            modal.className = 'tiktok-modal-overlay';
            modal.id = 'tiktok-modal';
 
            // Disable context menu to prevent conflicts with long press
            modal.oncontextmenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
 
            modal.innerHTML = `
                <!-- 顶部控制栏 -->
                <div class="tiktok-header">
                    <div class="tiktok-header-left">
                        <div class="tiktok-video-count" id="tiktok-count">1 / 1</div>
                    </div>
                    <div class="tiktok-header-right">
                        <button class="tiktok-settings-btn" id="tiktok-settings-btn" title="设置">
                            <svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>
                        </button>
                        <button class="tiktok-close-btn" id="tiktok-close" aria-label="关闭">
                            <svg viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                </div>
 
                <!-- 设置面板 -->
                <div class="tiktok-settings-panel" id="tiktok-settings-panel">
                    <div class="tiktok-setting-item" id="tiktok-perf-toggle" data-type="perf">
                        <div class="tiktok-setting-label">
                            <svg viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM11 20v-5.5H9L13 7v5.5h2L11 20z"/></svg>
                            <span>低功耗模式</span>
                        </div>
                        <div class="setting-switch"></div>
                    </div>
                    
                    <div class="tiktok-setting-item" id="tiktok-unread-toggle" data-type="unread">
                        <div class="tiktok-setting-label">
                            <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                            <span>只看未读</span>
                        </div>
                        <div class="setting-switch"></div>
                    </div>
 
                    <div class="tiktok-setting-item" id="tiktok-loop-toggle" data-type="loop">
                        <div class="tiktok-setting-label">
                            <svg viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
                            <span>循环播放</span>
                        </div>
                        <div class="setting-switch"></div>
                    </div>
                </div>
 
                <div class="tiktok-video-container" id="tiktok-container">
                    <!-- 交互反馈覆盖层 -->
                    <div class="tiktok-overlay-icon" id="tiktok-pause-icon">
                        <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    </div>
                    
                    <div class="tiktok-speed-overlay" id="tiktok-speed-overlay">
                        <svg viewBox="0 0 24 24"><path d="M10 8v8l6-4-6-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 9.5l-2.5 1.5V11H12v2.5L9.5 12 12 10.5V13h3.5v-2.5L18 12.5z"/></svg>
                        <span>2x 倍速中</span>
                    </div>
 
                    <div class="tiktok-loading" id="tiktok-loading">
                        <div class="tiktok-loading-spinner"></div>
                        <div class="tiktok-loading-text">加载中...</div>
                    </div>
 
                    <div class="tiktok-error" id="tiktok-error">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        <h3>视频加载失败</h3>
                        <p>无法加载视频,请尝试在原页面观看</p>
                        <button class="tiktok-error-btn" id="tiktok-retry">重试</button>
                    </div>
 
                    <!-- 双层渲染：缩略图层（立即显示） -->
                    <img class="tiktok-thumbnail-layer" id="tiktok-thumbnail" alt="" />
 
                    <!-- 双层渲染：视频层（背后加载） -->
                    <video class="tiktok-video-player" id="tiktok-player" playsinline webkit-playsinline x5-playsinline preload="metadata" muted referrerpolicy="no-referrer"></video>
 
                    <div class="tiktok-progress-container" id="tiktok-progress-container">
                        <div class="tiktok-progress-bar" id="tiktok-progress-bar">
                            <div class="tiktok-progress-filled" id="tiktok-progress-filled"></div>
                        </div>
                        <div class="tiktok-time-display" id="tiktok-time-display">0:00 / 0:00</div>
                    </div>
 
                    <div class="tiktok-video-info" id="tiktok-info">
                        <h3 id="tiktok-title">视频标题</h3>
                    </div>
 
                    <div class="tiktok-volume-control" id="tiktok-volume-control">
                        <div class="tiktok-volume-btn" id="tiktok-volume-btn" title="静音/取消静音">
                            <svg id="tiktok-volume-icon" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                        </div>
                        <div class="tiktok-volume-slider-container">
                            <input type="range" class="tiktok-volume-slider" id="tiktok-volume-slider" min="0" max="1" step="0.05" value="1">
                        </div>
                    </div>
 
                    <div class="tiktok-actions" id="tiktok-actions">
                        <div class="tiktok-action-item" data-action="like" title="点赞">
                            <div class="tiktok-action-icon" id="tiktok-like-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </div>
                            <span class="tiktok-action-text">喜欢</span>
                        </div>
 
                        <div class="tiktok-action-item" data-action="download" title="下载">
                            <div class="tiktok-action-icon" id="tiktok-download-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                                </svg>
                            </div>
                            <span class="tiktok-action-text">下载</span>
                        </div>
 
                        <div class="tiktok-action-item" data-action="share" title="分享">
                            <div class="tiktok-action-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                                </svg>
                            </div>
                            <span class="tiktok-action-text">分享</span>
                        </div>
                    </div>
                </div>
            `;
 
            document.body.appendChild(modal);
        }
 
        bindEvents() {
            // 关闭按钮
            const closeBtn = document.getElementById('tiktok-close');
            closeBtn.addEventListener('click', () => this.closeModal());
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.closeModal();
            });
 
            // 点击背景关闭 & 设置面板关闭逻辑
            const modal = document.getElementById('tiktok-modal');
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'tiktok-modal') {
                    this.closeModal();
                }
                
                // 点击非设置区域关闭设置面板
                const settingsPanel = document.getElementById('tiktok-settings-panel');
                const settingsBtn = document.getElementById('tiktok-settings-btn');
                if (settingsPanel && settingsPanel.classList.contains('active')) {
                    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
                        settingsPanel.classList.remove('active');
                        settingsBtn.classList.remove('active');
                    }
                }
            });
 
            // 重试按钮
            document.getElementById('tiktok-retry').addEventListener('click', () => {
                this.loadVideo(this.currentVideoIndex);
            });
 
            // 设置按钮
            const settingsBtn = document.getElementById('tiktok-settings-btn');
            const settingsPanel = document.getElementById('tiktok-settings-panel');
            
            const toggleSettings = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const isActive = settingsPanel.classList.toggle('active');
                settingsBtn.classList.toggle('active', isActive);
            };
 
            settingsBtn.addEventListener('click', toggleSettings);
            settingsBtn.addEventListener('touchend', toggleSettings);
 
            // 防止点击面板内部触发关闭
            settingsPanel.addEventListener('click', (e) => e.stopPropagation());
            settingsPanel.addEventListener('touchend', (e) => e.stopPropagation());
 
            // 设置项点击处理 (事件委托)
            const handleSettingClick = (type) => {
                switch(type) {
                    case 'perf':
                        this.togglePerfMode();
                        break;
                    case 'unread':
                        this.toggleUnreadMode();
                        break;
                    case 'loop':
                        this.toggleLoopMode();
                        break;
                }
                this.updateSettingsUI();
            };
 
            document.querySelectorAll('.tiktok-setting-item').forEach(item => {
                const handler = (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // 防止冒泡关闭面板
                    handleSettingClick(item.dataset.type);
                };
                item.addEventListener('click', handler);
                item.addEventListener('touchend', handler);
            });
 
            // 初始化设置UI状态
            this.updateSettingsUI();
 
            // 键盘导航
            document.addEventListener('keydown', (e) => {
                if (!this.isModalOpen()) return;
 
                switch (e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.previousVideo();
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.nextVideo();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.seekBy(-5);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.seekBy(5);
                        break;
                    case ' ':
                        e.preventDefault();
                        this.togglePlay();
                        break;
                    case 'Enter':
                        this.togglePlay();
                        break;
                }
            });
 
            // 触摸滑动 - 移动端
            const container = document.getElementById('tiktok-container');
            let touchStartY = 0;
            let touchStartX = 0;
 
            container.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
                this.isDragging = true;
            }, { passive: true });
 
            container.addEventListener('touchmove', (e) => {
                if (!this.isDragging) return;
                if (this.isProgressDragging) return;
 
                const touchY = e.touches[0].clientY;
                const touchX = e.touches[0].clientX;
                const diffY = touchStartY - touchY;
                const diffX = touchStartX - touchX;
 
                // 判断是垂直滑动还是水平滑动
                if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 30) {
                    e.preventDefault(); // 阻止页面滚动
                }
            }, { passive: false });
 
            container.addEventListener('touchend', (e) => {
                if (!this.isDragging) return;
                this.isDragging = false;
 
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndX = e.changedTouches[0].clientX;
 
                const diffY = touchStartY - touchEndY;
                const diffX = touchStartX - touchEndX;
                const threshold = 50;
 
                // 确保是垂直滑动
                if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > threshold) {
                    if (diffY > 0) {
                        // 向上滑动 - 下一个视频
                        this.nextVideo();
                    } else {
                        // 向下滑动 - 上一个视频
                        this.previousVideo();
                    }
                }
            }, { passive: true });
 
            container.addEventListener('touchcancel', () => {
                this.isDragging = false;
            }, { passive: true });
 
            // 鼠标滚轮导航 - PC端
            let wheelTimeout = null;
            container.addEventListener('wheel', (e) => {
                if (!this.isModalOpen()) return;
                if (wheelTimeout) return; // 防止快速滚动
 
                wheelTimeout = setTimeout(() => {
                    wheelTimeout = null;
                }, 500);
 
                e.preventDefault();
 
                if (e.deltaY > 0) {
                    this.nextVideo();
                } else {
                    this.previousVideo();
                }
            }, { passive: false });
 
            // 鼠标拖拽 - PC端
            let mouseStartY = 0;
            let isMouseDown = false;
 
            container.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // 只响应左键
                mouseStartY = e.clientY;
                isMouseDown = true;
                container.style.cursor = 'grabbing';
            });
 
            container.addEventListener('mousemove', (e) => {
                if (!isMouseDown) return;
 
                const diff = mouseStartY - e.clientY;
 
                if (Math.abs(diff) > 100) {
                    isMouseDown = false;
                    container.style.cursor = 'pointer';
 
                    if (diff > 0) {
                        this.nextVideo();
                    } else {
                        this.previousVideo();
                    }
                }
            });
 
            container.addEventListener('mouseup', () => resetMouseState());
            container.addEventListener('mouseleave', () => resetMouseState());
 
            function resetMouseState() {
                isMouseDown = false;
                container.style.cursor = 'pointer';
            }
 
            // 操作按钮
            document.querySelectorAll('.tiktok-action-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;
                    this.handleAction(action);
                });
 
                // 触摸优化
                item.addEventListener('touchend', (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;
                    this.handleAction(action);
                });
            });
 
            // 初始化视频事件绑定
            this.videoElement = document.getElementById('tiktok-player');
            this.bindVideoPlayerEvents(this.videoElement);
 
            // 进度条交互
            this.setupProgressBarInteraction();
 
            // 音量控制交互
            this.setupVolumeControl();
        }
 
        updateSettingsUI() {
            // 更新设置面板中各个开关的状态
            const perfItem = document.querySelector('.tiktok-setting-item[data-type="perf"]');
            const unreadItem = document.querySelector('.tiktok-setting-item[data-type="unread"]');
            const loopItem = document.querySelector('.tiktok-setting-item[data-type="loop"]');
 
            if (perfItem) perfItem.classList.toggle('active', this.perfModeEnabled);
            if (unreadItem) unreadItem.classList.toggle('active', this.unreadOnlyMode);
            if (loopItem) loopItem.classList.toggle('active', this.isLooping);
        }
 
        toggleLoopMode() {
            this.isLooping = !this.isLooping;
            console.log(`🔁 循环播放: ${this.isLooping ? '开启' : '关闭'}`);
            if (this.videoElement) {
                this.videoElement.loop = this.isLooping;
            }
        }
 
        seekBy(seconds) {
            if (this.videoElement && this.videoElement.duration) {
                const newTime = Math.max(0, Math.min(this.videoElement.duration, this.videoElement.currentTime + seconds));
                this.videoElement.currentTime = newTime;
                this.updateProgressBar();
            }
        }
 
        // 绑定视频播放器相关的所有事件
        bindVideoPlayerEvents(videoEl) {
            // 视频加载完成
            videoEl.addEventListener('loadedmetadata', () => {
                if (this.loadStartTime) {
                    console.log(`[Timer] 视频元数据加载完成 (loadedmetadata)，总耗时: ${Date.now() - this.loadStartTime}ms`);
                }
                this.hideLoading();
                this.updateTimeDisplay();
                // 恢复之前的倍速设置
                if (this.isSpeeding) {
                    videoEl.playbackRate = 2.0;
                }
                // 应用循环设置
                videoEl.loop = this.isLooping;
            });
 
            videoEl.addEventListener('loadeddata', () => {
                if (this.loadStartTime) {
                    console.log(`[Timer] 视频首帧加载完成 (loadeddata)，总耗时: ${Date.now() - this.loadStartTime}ms`);
                }
            });
 
            videoEl.addEventListener('canplay', () => {
            }, { once: false });
 
            videoEl.addEventListener('timeupdate', () => {
                if (!this.isProgressDragging) {
                    this.updateProgressBar();
                }
            });
 
            // 视频加载错误处理
            videoEl.addEventListener('error', (e) => {
                if (e.target !== this.videoElement) {
                    console.log('⏭️ 忽略旧视频的 error 事件 (已切换到其他视频)');
                    return;
                }
 
                const currentVideo = this.getCurrentVideo();
                
                if (this.retryCount < this.MAX_RETRIES) {
                    this.retryCount++;
                    const delay = Math.pow(2, this.retryCount) * 1000;
                    console.log(`🔄 视频加载失败，${delay / 1000}秒后尝试第 ${this.retryCount}/${this.MAX_RETRIES} 次重试...`);
 
                    const versionAtError = this.loadVersion;
                    if (currentVideo) {
                        if (this.videoUrlCache.has(currentVideo.url)) {
                            console.log('🧹 清除可能的过期URL缓存');
                            this.videoUrlCache.delete(currentVideo.url);
                        }
 
                        if (this.retryTimeoutId) {
                            clearTimeout(this.retryTimeoutId);
                        }
 
                        this.retryTimeoutId = setTimeout(() => {
                            if (this.loadVersion !== versionAtError) {
                                console.log('⏭️ 放弃重试 (用户已切换视频)');
                                return;
                            }
                            console.log('🔁 发起重试...');
                            this.loadVideo(this.currentVideoIndex); // 重新加载完整流程
                        }, delay);
                        return;
                    }
                }
 
                this.showError();
            });
 
            videoEl.addEventListener('ended', () => {
                if (this.isLooping) {
                    // 循环播放已由 video.loop 属性处理，这里作为备用
                    videoEl.play();
                } else {
                    // 自动播放下一个视频
                    this.nextVideo();
                }
            });
 
            // 点击视频播放/暂停 (与长按逻辑区分)
            let pressTimer = null;
            let isLongPress = false;
            const container = document.getElementById('tiktok-container');
 
            const startPress = (e) => {
                // 忽略非主按键
                if (e.type === 'mousedown' && e.button !== 0) return;
                
                // 忽略控件上的点击
                if (e.target.closest('.tiktok-volume-control, .tiktok-actions, .tiktok-progress-container, .tiktok-header')) return;
 
                isLongPress = false;
                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    this.enableSpeedMode();
                }, 500); // 长按 500ms 触发
            };
 
            const endPress = (e) => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    pressTimer = null;
                }
 
                if (isLongPress) {
                    // 如果是长按结束，恢复倍速
                    this.disableSpeedMode();
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    // 如果不是长按，且是在视频/容器上触发的，则切换播放
                    // (click事件会处理，但为了防止冲突，这里不做处理，交给 click)
                }
            };
 
            // 使用容器监听以覆盖整个区域
            if (container) {
                // 清除旧监听器（如果有）
                // ... (简化，直接添加)
                
                container.addEventListener('mousedown', startPress);
                container.addEventListener('mouseup', endPress);
                container.addEventListener('mouseleave', endPress);
 
                container.addEventListener('touchstart', startPress, { passive: true });
                container.addEventListener('touchend', endPress, { passive: true });
                container.addEventListener('touchcancel', endPress, { passive: true });
                
                // 点击事件：只处理非长按
                container.addEventListener('click', (e) => {
                    if (isLongPress) {
                        e.stopPropagation();
                        e.preventDefault();
                        isLongPress = false; 
                        return;
                    }
                    
                    // 忽略控件点击
                    if (e.target.closest('.tiktok-volume-control, .tiktok-actions, .tiktok-progress-container, .tiktok-header, .tiktok-settings-panel')) return;
                    
                    this.togglePlay();
                });
            }
        }
 
        enableSpeedMode() {
            if (!this.videoElement || this.isSpeeding) return;
            this.isSpeeding = true;
            this.videoElement.playbackRate = 2.0;
            this.showSpeedOverlay();
        }
 
        disableSpeedMode() {
            if (!this.videoElement || !this.isSpeeding) return;
            this.isSpeeding = false;
            this.videoElement.playbackRate = 1.0;
            this.hideSpeedOverlay();
        }
 
        showSpeedOverlay() {
            const overlay = document.getElementById('tiktok-speed-overlay');
            if (overlay) overlay.classList.add('visible');
        }
 
        hideSpeedOverlay() {
            const overlay = document.getElementById('tiktok-speed-overlay');
            if (overlay) overlay.classList.remove('visible');
        }
 
        showPauseIcon() {
            const icon = document.getElementById('tiktok-pause-icon');
            if (icon) {
                icon.classList.add('visible');
                // 动画结束后移除
                setTimeout(() => {
                    icon.classList.remove('visible');
                }, 500);
            }
        }
 
        // 进度条更新
        updateProgressBar() {
            if (!this.videoElement || !this.videoElement.duration) return;
            const percent = (this.videoElement.currentTime / this.videoElement.duration) * 100;
            document.getElementById('tiktok-progress-filled').style.width = percent + '%';
            this.updateTimeDisplay();
        }
 
        // 时间显示更新
        updateTimeDisplay() {
            if (!this.videoElement) return;
            const current = this.formatTime(this.videoElement.currentTime);
            const total = this.formatTime(this.videoElement.duration || 0);
            document.getElementById('tiktok-time-display').textContent = `${current} / ${total}`;
        }
 
        // 格式化时间
        formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }
 
        // 跳转到指定位置
        seekToPosition(e) {
            const bar = document.getElementById('tiktok-progress-bar');
            const rect = bar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (this.videoElement && this.videoElement.duration) {
                this.videoElement.currentTime = percent * this.videoElement.duration;
            }
        }
 
        // 更新进度条位置（用于拖拽预览，不改变视频时间）
        updateProgressPreview(clientX) {
            const bar = document.getElementById('tiktok-progress-bar');
            const rect = bar.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
 
            // 更新进度条视觉位置
            document.getElementById('tiktok-progress-filled').style.width = (percent * 100) + '%';
 
            // 更新时间显示预览
            if (this.videoElement && this.videoElement.duration) {
                const previewTime = percent * this.videoElement.duration;
                const current = this.formatTime(previewTime);
                const total = this.formatTime(this.videoElement.duration);
                document.getElementById('tiktok-time-display').textContent = `${current} / ${total}`;
            }
 
            return percent;
        }
 
        // 设置进度条交互（鼠标和触摸）
        setupProgressBarInteraction() {
            const container = document.getElementById('tiktok-progress-container');
            const progressBar = document.getElementById('tiktok-progress-bar');
 
            // 初始化拖拽状态
            this.isProgressDragging = false;
            let lastPercent = 0;
 
            // ==================== 鼠标交互 ====================
 
            // 鼠标点击/拖拽开始
            container.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.isProgressDragging = true;
                container.classList.add('dragging');
                lastPercent = this.updateProgressPreview(e.clientX);
            });
 
            // 鼠标移动（全局监听以支持拖出进度条范围）
            document.addEventListener('mousemove', (e) => {
                if (!this.isProgressDragging) return;
                e.preventDefault();
                lastPercent = this.updateProgressPreview(e.clientX);
            });
 
            // 鼠标释放（全局监听）
            document.addEventListener('mouseup', (e) => {
                if (!this.isProgressDragging) return;
 
                this.isProgressDragging = false;
                container.classList.remove('dragging');
 
                // 应用最终位置
                if (this.videoElement && this.videoElement.duration) {
                    this.videoElement.currentTime = lastPercent * this.videoElement.duration;
                }
            });
 
            // ==================== 触摸交互 ====================
 
            // 触摸开始
            container.addEventListener('touchstart', (e) => {
                // 阻止事件冒泡，防止触发视频切换
                e.stopPropagation();
                this.isDragging = false;
 
                const touch = e.touches[0];
                this.isProgressDragging = true;
                container.classList.add('dragging');
                lastPercent = this.updateProgressPreview(touch.clientX);
            }, { passive: true });
 
            // 触摸移动
            container.addEventListener('touchmove', (e) => {
                if (!this.isProgressDragging) return;
 
                // 阻止默认行为，防止页面滚动
                e.preventDefault();
                e.stopPropagation();
 
                const touch = e.touches[0];
                lastPercent = this.updateProgressPreview(touch.clientX);
            }, { passive: false });
 
            // 触摸结束
            container.addEventListener('touchend', (e) => {
                if (!this.isProgressDragging) return;
 
                e.stopPropagation();
 
                this.isProgressDragging = false;
                container.classList.remove('dragging');
 
                // 应用最终位置
                if (this.videoElement && this.videoElement.duration) {
                    this.videoElement.currentTime = lastPercent * this.videoElement.duration;
                }
            }, { passive: true });
 
            // 触摸取消（例如来电打断）
            container.addEventListener('touchcancel', () => {
                if (!this.isProgressDragging) return;
 
                this.isProgressDragging = false;
                container.classList.remove('dragging');
 
                // 恢复到当前实际播放位置
                this.updateProgressBar();
            }, { passive: true });
 
            // ==================== 点击跳转（非拖拽的快速点击） ====================
 
            // 使用 click 事件作为后备（如果只是单击而非拖拽）
            progressBar.addEventListener('click', (e) => {
                e.stopPropagation();
                // 如果正在拖拽，不处理 click
                if (this.isProgressDragging) return;
                this.seekToPosition(e);
            });
        }
 
        collectVideoLinks() {
            // 查找视频链接 - 支持多种格式
 
            // 策略1: 查找带有 /movie/ 的链接（主要格式）
            const movieLinks = document.querySelectorAll('a[href*="/movie/"]');
 
            // 策略2: 查找带有 s-popunder 类的链接
            const popunderLinks = document.querySelectorAll('a.s-popunder[href*="/movie/"]');
 
            // 合并所有链接
            const allLinks = new Set([...movieLinks, ...popunderLinks]);
 
            if (allLinks.size > 0) {
                console.log(`🎬 找到 ${allLinks.size} 个视频链接`);
 
                let index = 0;
                allLinks.forEach(link => {
                    const href = link.href;
                    if (!href) return;
 
                    const existingVideo = this.videoList.find(v => v.url === href);
 
                    if (existingVideo) {
                        // Update element reference if changed
                        if (existingVideo.element !== link) {
                            existingVideo.element = link;
                            existingVideo.hasBoundEvents = false;
                        }
                    } else {
                        // 获取视频标题和时长信息
                        const parent = link.closest('.block, [class*="video"], [class*="movie"], .relative');
                        let title = '';
                        let duration = '';
 
                        if (parent) {
                            // 尝试获取时长
                            const durationEl = parent.querySelector('[class*="duration"], .bg-black\\/60, .absolute.bottom-2');
                            if (durationEl) {
                                duration = durationEl.textContent.trim();
                            }
 
                            // 尝试获取alt属性作为标题
                            const img = parent.querySelector('img[alt]');
                            if (img) {
                                title = img.alt || 'Twitter Video';
                            }
                        }
 
                        // 提取缩略图
                        const thumbnailImg = link.querySelector('img[src]') ||
                            (parent ? parent.querySelector('img[src]') : null);
                        const thumbnail = thumbnailImg?.src || '';
 
                        // 提取 movieId
                        const movieIdMatch = href.match(/\/movie\/([a-zA-Z0-9_-]+)/);
                        const movieId = movieIdMatch ? movieIdMatch[1] : '';
 
                        // 生成模拟的点赞数和观看数
                        const likes = Math.floor(Math.random() * 50000) + 1000;
                        const views = Math.floor(Math.random() * 500000) + 10000;
 
                        this.videoList.push({
                            url: href,
                            title: title || `视频 ${this.videoList.length + 1}`,
                            duration: duration,
                            thumbnail: thumbnail,
                            likes: likes,
                            views: views,
                            comments: Math.floor(Math.random() * 2000) + 100,
                            element: link,
                            movieId: movieId
                        });
                    }
                });
 
                // 触发预加载
                this.startListPreloading();
            } else {
                // 备用策略:查找其他可能的视频链接
                const videoSelectors = [
                    'a[href*="/videos/"]',
                    'a[href*="/watch/"]',
                    'a[href*="/status/"]',
                    '[data-video-id]',
                    '[data-video-url]'
                ];
 
                videoSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        const href = el.href || el.dataset.videoUrl;
                        if (href && !this.videoList.some(v => v.url === href)) {
                            this.videoList.push({
                                url: href,
                                title: el.textContent?.trim() || '视频',
                                element: el
                            });
                        }
                    });
                });
            }
 
            // 为找到的视频元素添加交互
            this.enhanceVideoElements();
 
            console.log(`📹 共收集到 ${this.videoList.length} 个视频链接`);
        }
 
        isValidVideoLink(url) {
            // 验证是否为有效的视频链接
            if (!url) return false;
 
            const patterns = [
                /\/videos\//,
                /\/watch\//,
                /\/status\//,
                /\.mp4$/,
                /\.webm$/,
                /\.mov$/,
                /\/(video|movie)\//,
                /\?.*video=/,
                /twitter\.com\/.*\/status/
            ];
 
            return patterns.some(pattern => pattern.test(url));
        }
 
        addVideoLink(element, url) {
            // 避免重复
            if (this.videoList.some(v => v.url === url)) return;
 
            // 获取视频信息
            let title = this.extractVideoTitle(element);
            let thumbnail = this.extractThumbnail(element);
 
            this.videoList.push({
                url: url,
                title: title,
                thumbnail: thumbnail,
                element: element,
                likes: Math.floor(Math.random() * 50000) + 1000,
                views: Math.floor(Math.random() * 500000) + 10000,
                comments: Math.floor(Math.random() * 2000) + 100
            });
        }
 
        extractVideoTitle(element) {
            // 尝试从元素中提取标题
            const titleEl = element.querySelector('img')?.alt ||
                element.closest('[class*="card"], [class*="item"]')?.querySelector('h3, h4, .title, [class*="title"]')?.textContent?.trim() ||
                element.textContent?.trim();
 
            // 清理标题
            return titleEl?.substring(0, 100) || '未知视频';
        }
 
        extractThumbnail(element) {
            // 尝试提取缩略图
            const img = element.querySelector('img[src]');
            return img?.src || '';
        }
 
        enhanceVideoElements() {
            // 为视频元素添加视觉提示
            this.videoList.forEach((video, index) => {
                // 防止重复绑定
                if (video.hasBoundEvents || !video.element) return;
 
                // 标记已绑定
                video.hasBoundEvents = true;
 
                if (video.element) {
                    // 触摸追踪变量
                    let touchStartX = 0;
                    let touchStartY = 0;
                    let isTouchMoved = false;
 
                    // 记录触摸开始位置
                    video.element.addEventListener('touchstart', (e) => {
                        touchStartX = e.touches[0].clientX;
                        touchStartY = e.touches[0].clientY;
                        isTouchMoved = false;
                    }, { passive: true });
 
                    // 检测是否移动了（滚动）
                    video.element.addEventListener('touchmove', (e) => {
                        const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
                        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
                        // 如果移动超过10px，认为是滚动而非点击
                        if (deltaX > 10 || deltaY > 10) {
                            isTouchMoved = true;
                        }
                    }, { passive: true });
 
                    // 只有在没有滚动的情况下才触发模态框
                    video.element.addEventListener('touchend', (e) => {
                        if (!isTouchMoved) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.currentVideoIndex = this.getActualVideoIndex(index);
                            this.openModal();
                        }
                    });
 
                    // 添加点击事件拦截 (PC端)
                    video.element.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.currentVideoIndex = this.getActualVideoIndex(index);
                        this.openModal();
                    });
 
                    // 添加视觉样式
                    video.element.style.cursor = 'pointer';
                    video.element.title = '点击在模态框中播放 (TikTok风格)';
 
                    // 添加悬浮效果
                    video.element.addEventListener('mouseenter', () => {
                        video.element.style.transform = 'scale(1.02)';
                        video.element.style.transition = 'transform 0.2s';
                        // 鼠标悬停时触发高优先级预加载
                        this.preloadSingleVideo(index);
                    });
 
                    // 注册到可视区域观察者 (移动端/滚动预加载)
                    if (this.viewportObserver) {
                        this.viewportObserver.observe(video.element);
                    }
 
                    video.element.addEventListener('mouseleave', () => {
                        video.element.style.transform = 'scale(1)';
                    });
                }
            });
        }
 
        // 获取实际视频索引（考虑过滤模式）
        getActualVideoIndex(originalIndex) {
            if (!this.unreadOnlyMode) {
                return originalIndex;
            }
            // 在过滤模式下，找到对应的过滤列表索引
            const video = this.videoList[originalIndex];
            return this.filteredVideoList.findIndex(v => v.url === video.url);
        }
 
        // 获取当前使用的视频列表
        getActiveVideoList() {
            return this.unreadOnlyMode ? this.filteredVideoList : this.videoList;
        }
 
        // 获取当前播放的视频
        getCurrentVideo() {
            const list = this.getActiveVideoList();
            return list[this.currentVideoIndex];
        }
 
        // 更新过滤后的视频列表
        updateFilteredList() {
            this.filteredVideoList = this.videoList.filter(v => !this.isVideoWatched(v.url));
        }
 
        isModalOpen() {
            return document.getElementById('tiktok-modal').classList.contains('active');
        }
 
        openModal() {
            const modal = document.getElementById('tiktok-modal');
            modal.classList.add('active');
 
            // iOS Safari: 禁用橡皮筋效果和滚动
            document.body.classList.add('tiktok-modal-open');
            document.documentElement.classList.add('tiktok-modal-open');
            document.body.style.overflow = 'hidden';
 
            // iOS Safari: 设置状态栏颜色
            this.setThemeColor('#000000');
 
            // 重置点赞状态
            this.isLiked = false;
            document.getElementById('tiktok-like-icon').classList.remove('liked');
 
            // 加载当前视频
            this.loadVideo(this.currentVideoIndex);
 
            // 3秒后隐藏滑动提示
            setTimeout(() => {
                const hint = document.getElementById('tiktok-swipe-hint');
                if (hint) hint.style.opacity = '0';
            }, 3000);
        }
 
        closeModal() {
            const modal = document.getElementById('tiktok-modal');
            modal.classList.remove('active');
 
            // 状态重置
            this.isTransitioning = false;
            this.isDragging = false;
 
            // iOS Safari: 恢复滚动
            document.body.classList.remove('tiktok-modal-open');
            document.documentElement.classList.remove('tiktok-modal-open');
            document.body.style.overflow = '';
 
            // iOS Safari: 恢复状态栏颜色
            this.restoreThemeColor();
 
            if (this.videoElement) {
                this.videoElement.pause();
                this.videoElement.src = '';
                this.videoElement.load();
            }
        }
 
        // iOS Safari 状态栏颜色管理
        setThemeColor(color) {
            let themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (!themeColorMeta) {
                themeColorMeta = document.createElement('meta');
                themeColorMeta.name = 'theme-color';
                document.head.appendChild(themeColorMeta);
            }
            this._originalThemeColor = themeColorMeta.content;
            themeColorMeta.content = color;
        }
 
        restoreThemeColor() {
            const themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (themeColorMeta && this._originalThemeColor !== undefined) {
                themeColorMeta.content = this._originalThemeColor;
            }
        }
 
        showLoading() {
            const loading = document.getElementById('tiktok-loading');
            const error = document.getElementById('tiktok-error');
 
            if (loading) loading.style.display = 'flex';
            if (error) error.style.display = 'none';
        }
 
        hideLoading() {
            const loading = document.getElementById('tiktok-loading');
            const error = document.getElementById('tiktok-error');
 
            if (loading) loading.style.display = 'none';
            if (error) error.style.display = 'none';
        }
 
        showError() {
            const loading = document.getElementById('tiktok-loading');
            const error = document.getElementById('tiktok-error');
            const thumbnailLayer = document.getElementById('tiktok-thumbnail');
 
            if (loading) loading.style.display = 'none';
            if (thumbnailLayer) thumbnailLayer.classList.add('hidden');
            if (error) error.style.display = 'block';
        }
 
        updateDebugInfo(status, extra = '') {
        }
 
        loadVideo(index) {
            const list = this.getActiveVideoList();
 
            if (index < 0 || index >= list.length) {
                console.log('视频索引无效');
                return;
            }
 
            const video = list[index];
            const container = document.getElementById('tiktok-container');
            const thumbnailLayer = document.getElementById('tiktok-thumbnail');
            const videoLayer = document.getElementById('tiktok-player');
 
            console.log(`[Timer] 开始加载视频: ${index} (URL: ${video.url})`);
            this.loadStartTime = Date.now();
 
            this.retryCount = 0;
            if (this.retryTimeoutId) {
                clearTimeout(this.retryTimeoutId);
                this.retryTimeoutId = null;
            }
            this.loadVersion++;
            const currentLoadVersion = this.loadVersion;
 
            thumbnailLayer.classList.remove('hidden');
            videoLayer.classList.remove('visible');
 
            const realUrl = this.videoUrlCache.get(video.url);
            if (video.thumbnail) {
                thumbnailLayer.src = video.thumbnail;
            } else {
                thumbnailLayer.src = '';
            }
 
            if (video.thumbnail) {
                container.style.backgroundImage = `url(${video.thumbnail})`;
            } else {
                container.style.backgroundImage = 'none';
            }
 
            this.updateVideoInfo(video);
            document.getElementById('tiktok-count').textContent = `${index + 1} / ${list.length}`;
            this.markVideoAsWatched(video.url);
 
            this.loadVideoWithBlobCache(video, currentLoadVersion);
 
            this.scheduleSmartPrefetch(index, list);
        }
 
        async loadVideoWithBlobCache(video, loadVersion) {
            try {
                let realUrl = this.videoUrlCache.get(video.url);
 
                if (!realUrl && video.url.includes('/movie/')) {
                    realUrl = await this.fetchRealVideoUrl(video.url);
                    if (this.loadVersion !== loadVersion) return;
                    if (realUrl) {
                        this.videoUrlCache.set(video.url, realUrl);
                    }
                }
 
                if (!realUrl) {
                    this.showErrorWithOriginalLink(video.url);
                    return;
                }
 
                const videoLayer = document.getElementById('tiktok-player');
                const thumbnailLayer = document.getElementById('tiktok-thumbnail');
                const loadingLayer = document.getElementById('tiktok-loading');
 
                videoLayer.pause();
                videoLayer.removeAttribute('src');
                videoLayer.load();
 
                this.videoElement = videoLayer;
                videoLayer.src = realUrl;
                
                if (this.isSafari) {
                    videoLayer.load();
                }
 
                this.handleVideoReady(videoLayer, thumbnailLayer, loadingLayer, loadVersion);
 
            } catch (error) {
                if (this.loadVersion !== loadVersion) return;
                console.error('加载视频失败:', error);
                this.showErrorWithOriginalLink(video.url);
            }
        }
 
        async handleVideoReady(videoLayer, thumbnailLayer, loadingLayer, loadVersion) {
            const FIRST_FRAME_TIMEOUT = this.isIOSSafari ? 2500 : 1500;
            const thumbnailTimeout = setTimeout(() => {
                if (this.loadVersion === loadVersion) {
                    if (videoLayer.readyState >= 3) return;
                    console.warn('⚠️ [超时] 首帧等待过久，显示Loading...');
                    thumbnailLayer.classList.add('hidden');
                    loadingLayer.style.display = 'flex';
                }
            }, FIRST_FRAME_TIMEOUT);
 
            const onVideoReady = async () => {
                if (this.loadVersion !== loadVersion) return;
                
                videoLayer.removeEventListener('canplay', onVideoReady);
                videoLayer.removeEventListener('loadeddata', onVideoReady);
                clearTimeout(thumbnailTimeout);
                
                if (this.isIOSSafari) {
                    await new Promise(r => setTimeout(r, 80));
                }
 
                loadingLayer.style.display = 'none';
                thumbnailLayer.classList.add('hidden');
                videoLayer.classList.add('visible');
 
                this.applyVolumeToVideo();
                
                const playPromise = videoLayer.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        videoLayer.muted = true;
                        videoLayer.play().catch(() => {});
                    });
                }
 
                console.log(`🎬 [就绪] 视频开始播放: ${Date.now() - this.loadStartTime}ms`);
                this.loadStartTime = null;
            };
 
            if (this.isSafari) {
                videoLayer.addEventListener('loadeddata', onVideoReady);
            } else {
                videoLayer.addEventListener('canplay', onVideoReady);
            }
 
            if (videoLayer.readyState >= 3) {
                onVideoReady();
            }
        }
 
        scheduleSmartPrefetch(currentIndex, videoList) {
            if (this.perfModeEnabled) {
                console.log('⚡ [低功耗模式] 跳过预取');
                return;
            }
            const indicesToPrefetch = [
                currentIndex + 1,
                currentIndex - 1,
            ].filter(i => i >= 0 && i < videoList.length);
 
            this.executePrefetchQueue(indicesToPrefetch, videoList);
        }
 
        async executePrefetchQueue(indices, videoList) {
            for (let i = 0; i < indices.length; i++) {
                const index = indices[i];
                const video = videoList[index];
                if (!video) continue;
 
                let realUrl = this.videoUrlCache.get(video.url);
                if (!realUrl) {
                    try {
                        realUrl = await this.fetchRealVideoUrl(video.url);
                        if (realUrl) this.videoUrlCache.set(video.url, realUrl);
                    } catch (e) {
                        continue;
                    }
                }
 
                if (i < indices.length - 1) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }
        }
 
        async fetchRealVideoUrl(moviePageUrl) {
            return new Promise((resolve) => {
                if (typeof GM_xmlhttpRequest === 'undefined') {
                    console.log('GM_xmlhttpRequest 不可用,无法获取真实视频URL');
                    resolve(null);
                    return;
                }
 
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: moviePageUrl,
                    onload: (response) => {
                        try {
                            const html = response.responseText;
 
                            // 方法0: 尝试解析 application/ld+json (最准确)
                            try {
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');
                                const jsonScripts = doc.querySelectorAll('script[type="application/ld+json"]');
 
                                for (const script of jsonScripts) {
                                    try {
                                        const data = JSON.parse(script.textContent);
                                        if (data.contentUrl) {
                                            console.log('✅ 通过LD+JSON找到视频URL:', data.contentUrl);
                                            
                                            this.stats.mp4++;
                                            this.stats.total++;
                                            this.stats.parsedHistory.push({
                                                time: new Date().toLocaleTimeString(),
                                                type: 'mp4 (ld+json)',
                                                url: data.contentUrl
                                            });
                                            
                                            resolve(data.contentUrl);
                                            return;
                                        }
                                        if (data['@type'] === 'VideoObject' && data.contentUrl) {
                                            
                                            this.stats.mp4++;
                                            this.stats.total++;
                                            this.stats.parsedHistory.push({
                                                time: new Date().toLocaleTimeString(),
                                                type: 'mp4 (ld+json-nested)',
                                                url: data.contentUrl
                                            });
 
                                            resolve(data.contentUrl);
                                            return;
                                        }
                                    } catch (e) { /* ignore json parse error */ }
                                }
                            } catch (e) {
                                console.log('LD+JSON解析失败:', e);
                            }
 
                            // 方法1: 查找 video.twimg.com 的链接
                            const videoMatch = html.match(/https?:\/\/video\.twimg\.com\/[^"'\s<>]+\.mp4[^"'\s<>]*/i) ||
                                html.match(/https?:\/\/video\.twimg\.com\/[^"'\s<>]+/);
                            if (videoMatch) {
                                console.log('✅ 找到真实视频URL:', videoMatch[0]);
                                
                                this.stats.mp4++;
                                this.stats.total++;
                                this.stats.parsedHistory.push({
                                    time: new Date().toLocaleTimeString(),
                                    type: 'mp4 (regex)',
                                    url: videoMatch[0]
                                });
 
                                resolve(videoMatch[0]);
                                return;
                            }
 
                            // 方法2: 查找 data-video-src 或类似的属性
                            const dataVideoMatch = html.match(/data-video-src=["']([^"']+)["']/);
                            if (dataVideoMatch) {
                                resolve(dataVideoMatch[1]);
                                return;
                            }
 
                            // 方法3: 查找 video 标签的 src
                            const videoTagMatch = html.match(/<video[^>]+src=["']([^"']+)["']/);
                            if (videoTagMatch) {
                                resolve(videoTagMatch[1]);
                                return;
                            }
 
                            // 方法4: 查找其他可能的视频链接模式
                            const patterns = [
                                /video_url["']:\s*["']([^"']+)["']/,
                                /"url":"([^"]+\.mp4[^"]*)"/,
                                /src=["']([^"']*\.mp4[^"']*)["']/
                            ];
 
                            for (const pattern of patterns) {
                                const match = html.match(pattern);
                                if (match) {
                                    let url = match[1].replace(/\\/g, '');
                                    if (url.startsWith('//')) {
                                        url = 'https:' + url;
                                    }
                                    resolve(url);
                                    return;
                                }
                            }
 
                            console.log('❌ 无法从页面中提取视频URL');
                            resolve(null);
 
                        } catch (error) {
                            console.error('解析视频URL失败:', error);
                            this.stats.failed++;
                            resolve(null);
                        }
                    },
                    onerror: (error) => {
                        console.error('请求视频页面失败:', error);
                        this.stats.failed++;
                        resolve(null);
                    },
                    timeout: 10000
                });
            });
        }
 
        showErrorWithOriginalLink(videoUrl) {
            this.showError();
 
            // 更新错误信息,添加原链接按钮
            const errorDiv = document.getElementById('tiktok-error');
            const originalLinkBtn = errorDiv.querySelector('.tiktok-error-btn');
 
            if (originalLinkBtn) {
                originalLinkBtn.textContent = '在新标签页打开';
                originalLinkBtn.onclick = () => {
                    if (typeof GM_openInTab !== 'undefined') {
                        GM_openInTab(videoUrl, { active: true });
                    } else {
                        window.open(videoUrl, '_blank');
                    }
                };
            }
        }
 
        updateVideoInfo(video) {
            // 更新标题
            const titleEl = document.getElementById('tiktok-title');
            if (titleEl) {
                titleEl.textContent = video.title || '未知视频';
            }
        }
 
        formatNumber(num) {
            if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toLocaleString();
        }
 
        nextVideo() {
            if (this.isTransitioning) return;
            const list = this.getActiveVideoList();
            const nextIndex = this.currentVideoIndex < list.length - 1
                ? this.currentVideoIndex + 1
                : 0;
            this.transitionToVideo(nextIndex, 'up');
        }
 
        previousVideo() {
            if (this.isTransitioning) return;
            const list = this.getActiveVideoList();
            const prevIndex = this.currentVideoIndex > 0
                ? this.currentVideoIndex - 1
                : list.length - 1;
            this.transitionToVideo(prevIndex, 'down');
        }
 
        transitionToVideo(newIndex, direction) {
            const thumbnailLayer = document.getElementById('tiktok-thumbnail');
            const player = this.videoElement;
 
            // 允许打断：如果正在进行转场，立即清理上一轮的定时器和状态
            if (this.isTransitioning) {
                // 清理所有潜在的定时器
                if (this.transitionTimers) {
                    this.transitionTimers.forEach(t => clearTimeout(t));
                }
                // 立即移除所有动画类，复位状态
                player.classList.remove('slide-out-up', 'slide-out-down', 'slide-in-up', 'slide-in-down');
                if (thumbnailLayer) {
                    thumbnailLayer.classList.remove('slide-out-up', 'slide-out-down', 'slide-in-up', 'slide-in-down');
                }
            }
 
            this.isTransitioning = true;
            this.transitionTimers = [];
 
            const list = this.getActiveVideoList();
            const action = direction === 'up' ? 'Next (↓)' : 'Prev (↑)';
            console.log(`🖱️ 用户操作: ${action} -> 目标索引: ${newIndex + 1}/${list.length}`);
 
            const outClass = direction === 'up' ? 'slide-out-up' : 'slide-out-down';
            const inClass = direction === 'up' ? 'slide-in-up' : 'slide-in-down';
 
            // 1. 立即播放退出动画 (视频和缩略图一起动)
            const container = document.getElementById('tiktok-container');
            // 清除背景图防止"鬼影" (旧缩略图在视频滑出后显示)
            if (container) container.style.backgroundImage = 'none';
 
            player.classList.add(outClass);
            if (thumbnailLayer) thumbnailLayer.classList.add(outClass);
 
            // 2. 动画结束时切换数据 (同步 300ms 动画时间)
            const loadTimer = setTimeout(() => {
                player.classList.remove(outClass);
                if (thumbnailLayer) thumbnailLayer.classList.remove(outClass);
                
                this.currentVideoIndex = newIndex;
                this.loadVideo(this.currentVideoIndex);
                
                player.classList.add(inClass);
                if (thumbnailLayer) thumbnailLayer.classList.add(inClass);
            }, 300); 
            this.transitionTimers.push(loadTimer);
 
            // 3. 进场动画结束清理
            const cleanupTimer = setTimeout(() => {
                player.classList.remove(inClass);
                if (thumbnailLayer) thumbnailLayer.classList.remove(inClass);
                
                this.isTransitioning = false;
                this.transitionTimers = [];
            }, 600); // 300ms + 300ms
            this.transitionTimers.push(cleanupTimer);
        }
 
        togglePlay() {
            if (this.videoElement.paused) {
                this.videoElement.play();
            } else {
                this.videoElement.pause();
                this.showPauseIcon();
            }
        }
 
        handleAction(action) {
            switch (action) {
                case 'like':
                    this.toggleLike();
                    break;
                case 'download':
                    this.downloadVideo();
                    break;
                case 'share':
                    this.shareVideo();
                    break;
            }
        }
 
        async toggleLike() {
            const video = this.getCurrentVideo();
            if (!video?.movieId) {
                console.log('无法获取视频ID');
                return;
            }
 
            const likeIcon = document.getElementById('tiktok-like-icon');
            const newLikedState = !this.isLiked;
 
            // 先更新UI
            this.isLiked = newLikedState;
            likeIcon.classList.toggle('liked', newLikedState);
 
            // 调用API
            try {
                const response = await fetch(`https://twitter-ero-video-ranking.com/api/media/${video.movieId}/favorite`, {
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'content-type': 'application/json',
                        'cache-control': 'no-cache'
                    },
                    body: JSON.stringify({ favorite: newLikedState ? 1 : 0 }),
                    credentials: 'include'
                });
 
                if (!response.ok) {
                    throw new Error('API请求失败');
                }
 
                console.log(`${newLikedState ? '❤️ 已收藏' : '💔 已取消收藏'}: ${video.movieId}`);
            } catch (error) {
                console.error('收藏请求失败:', error);
                // 回滚UI状态
                this.isLiked = !newLikedState;
                likeIcon.classList.toggle('liked', !newLikedState);
            }
        }
 
        downloadVideo() {
            const video = this.getCurrentVideo();
            const videoSrc = this.videoElement?.src;
 
            // 优先使用已加载的视频URL，否则使用原始链接
            const downloadUrl = (videoSrc && videoSrc.startsWith('http')) ? videoSrc : video?.url;
 
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                alert('无法获取视频下载链接');
            }
        }
 
        shareVideo() {
            const video = this.getCurrentVideo();
            if (!video?.url) return;
 
            if (navigator.share) {
                navigator.share({
                    title: video.title,
                    url: video.url
                }).catch(console.error);
            } else {
                this.copyToClipboard(video.url);
            }
        }
 
        copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => alert('链接已复制到剪贴板!'))
                .catch(() => {
                    // 降级方案
                    const input = document.createElement('input');
                    input.value = text;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand('copy');
                    document.body.removeChild(input);
                    alert('链接已复制!');
                });
        }
 
        // ========================================
        // 已观看视频记录系统
        // ========================================
        loadWatchedVideos() {
            try {
                const stored = localStorage.getItem(this.WATCHED_STORAGE_KEY);
                return stored ? new Set(JSON.parse(stored)) : new Set();
            } catch (e) {
                console.error('加载观看记录失败:', e);
                return new Set();
            }
        }
 
        saveWatchedVideos() {
            try {
                const arr = Array.from(this.watchedVideos);
                // 只保留最近1000条记录
                const trimmed = arr.slice(-1000);
                localStorage.setItem(this.WATCHED_STORAGE_KEY, JSON.stringify(trimmed));
            } catch (e) {
                console.error('保存观看记录失败:', e);
            }
        }
 
        markVideoAsWatched(videoUrl) {
            if (!videoUrl) return;
            // 使用 movieId 或 URL 作为标识
            const id = this.extractVideoId(videoUrl);
            if (!this.watchedVideos.has(id)) {
                this.watchedVideos.add(id);
                this.saveWatchedVideos();
            }
        }
 
        isVideoWatched(videoUrl) {
            const id = this.extractVideoId(videoUrl);
            return this.watchedVideos.has(id);
        }
 
        extractVideoId(url) {
            // 尝试提取 movieId
            const match = url.match(/\/movie\/([a-zA-Z0-9_-]+)/);
            return match ? match[1] : url;
        }
 
        // ========================================
        // 只看未读模式
        // ========================================
        toggleUnreadMode() {
            this.unreadOnlyMode = !this.unreadOnlyMode;
            this.updateSettingsUI();
 
            if (this.unreadOnlyMode) {
                // 更新过滤列表
                this.updateFilteredList();
 
                if (this.filteredVideoList.length === 0) {
                    alert('没有未读视频了！');
                    this.unreadOnlyMode = false;
                    this.updateSettingsUI();
                    return;
                }
 
                // 重置到第一个未读视频
                this.currentVideoIndex = 0;
                this.loadVideo(0);
            } else {
                // 恢复到原始列表
                this.updateVideoCount();
            }
        }
 
        updateVideoCount() {
            const list = this.getActiveVideoList();
            document.getElementById('tiktok-count').textContent =
                `${this.currentVideoIndex + 1} / ${list.length}`;
        }
 
        loadSavedVolume() {
            try {
                const saved = localStorage.getItem(this.VOLUME_STORAGE_KEY);
                return saved !== null ? parseFloat(saved) : 1;
            } catch (e) {
                return 1;
            }
        }
 
        saveVolume(volume) {
            try {
                localStorage.setItem(this.VOLUME_STORAGE_KEY, volume.toString());
            } catch (e) {
                console.error('保存音量失败:', e);
            }
        }
 
        setupVolumeControl() {
            const volumeBtn = document.getElementById('tiktok-volume-btn');
            const volumeSlider = document.getElementById('tiktok-volume-slider');
            const volumeControl = document.getElementById('tiktok-volume-control');
            const volumeIcon = document.getElementById('tiktok-volume-icon');
 
            volumeSlider.value = this.currentVolume;
 
            const updateVolumeIcon = (volume, muted) => {
                let iconPath;
                if (muted || volume === 0) {
                    iconPath = 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z';
                } else if (volume < 0.5) {
                    iconPath = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z';
                } else {
                    iconPath = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
                }
                volumeIcon.innerHTML = `<path d="${iconPath}"/>`;
                volumeBtn.classList.toggle('muted', muted || volume === 0);
            };
 
            const applyVolume = (volume, muted) => {
                if (this.videoElement) {
                    this.videoElement.volume = muted ? 0 : volume;
                    this.videoElement.muted = muted;
                }
                updateVolumeIcon(volume, muted);
            };
 
            volumeSlider.addEventListener('input', (e) => {
                e.stopPropagation();
                this.currentVolume = parseFloat(e.target.value);
                this.isMuted = false;
                applyVolume(this.currentVolume, false);
                this.saveVolume(this.currentVolume);
            });
 
            volumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isMuted = !this.isMuted;
                applyVolume(this.currentVolume, this.isMuted);
            });
 
            volumeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.isMuted = !this.isMuted;
                applyVolume(this.currentVolume, this.isMuted);
            });
 
            let hideTimeout;
            volumeControl.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                volumeControl.classList.add('active');
            });
            volumeControl.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    volumeControl.classList.remove('active');
                }, 300);
            });
 
            volumeControl.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                volumeControl.classList.add('active');
            }, { passive: true });
 
            document.addEventListener('touchend', (e) => {
                if (!volumeControl.contains(e.target)) {
                    volumeControl.classList.remove('active');
                }
            }, { passive: true });
 
            updateVolumeIcon(this.currentVolume, this.isMuted);
        }
 
        applyVolumeToVideo() {
            if (this.videoElement) {
                this.videoElement.volume = this.isMuted ? 0 : this.currentVolume;
                this.videoElement.muted = this.isMuted;
            }
        }
 
        loadPerfMode() {
            try {
                return localStorage.getItem(this.PERF_MODE_KEY) === 'true';
            } catch (e) {
                return false;
            }
        }
 
        savePerfMode(enabled) {
            try {
                localStorage.setItem(this.PERF_MODE_KEY, enabled.toString());
            } catch (e) {
                console.error('保存低功耗模式失败:', e);
            }
        }
 
        togglePerfMode() {
            this.perfModeEnabled = !this.perfModeEnabled;
            this.updateSettingsUI();
            this.savePerfMode(this.perfModeEnabled);
            console.log(`⚡ 低功耗模式: ${this.perfModeEnabled ? '已开启' : '已关闭'}`);
        }
    }
 
    // ========================================
    // 初始化
    // ========================================
    // 等待DOM加载完成
    function initPlayer() {
        // 检查是否已经初始化
        if (window.tiktokModalPlayer) {
            return;
        }
 
        // 确保body存在
        if (!document.body) {
            setTimeout(initPlayer, 100);
            return;
        }
 
        window.tiktokModalPlayer = new TikTokModalPlayer();
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayer);
    } else {
        initPlayer();
    }
 
})();
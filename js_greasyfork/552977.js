// ==UserScript==
// @name         YouTube 控制介面透明度調整
// @name:zh-TW   YouTube 控制介面透明度調整
// @name:zh-CN   YouTube 控制界面透明度调整
// @name:en      YouTube Player Opacity Control
// @name:ja      YouTube プレーヤー透明度調整
// @name:ko      YouTube 플레이어 투명도 조정
// @name:es      Control de Opacidad del Reproductor de YouTube
// @name:fr      Contrôle de l'Opacité du Lecteur YouTube
// @name:de      YouTube Player Transparenz-Steuerung
// @name:ru      Управление Прозрачностью Плеера YouTube
// @name:pt-BR   Controle de Opacidade do Player do YouTube
// @name:it      Controllo Opacità Player YouTube
// @name:vi      Điều Chỉnh Độ Trong Suốt Trình Phát YouTube
// @name:th      ปรับความโปร่งใสเครื่องเล่น YouTube
// @version      1.4
// @description  調整 YouTube 播放器的進度條、按鈕、背景透明度
// @description:zh-TW  調整 YouTube 播放器的進度條、按鈕、背景透明度
// @description:zh-CN  调整 YouTube 播放器的进度条、按钮、背景透明度
// @description:en     Adjust the opacity of YouTube player's progress bar, buttons, and background
// @description:ja     YouTubeプレーヤーのプログレスバー、ボタン、背景の透明度を調整
// @description:ko     YouTube 플레이어의 진행 표시줄, 버튼 및 배경 투명도 조정
// @description:es     Ajusta la opacidad de la barra de progreso, botones y fondo del reproductor de YouTube
// @description:fr     Ajustez l'opacité de la barre de progression, des boutons et de l'arrière-plan du lecteur YouTube
// @description:de     Passen Sie die Transparenz der Fortschrittsleiste, Schaltflächen und des Hintergrunds des YouTube-Players an
// @description:ru     Настройка прозрачности полосы прогресса, кнопок и фона плеера YouTube
// @description:pt-BR  Ajuste a opacidade da barra de progresso, botões e fundo do player do YouTube
// @description:it     Regola l'opacità della barra di avanzamento, dei pulsanti e dello sfondo del player YouTube
// @description:vi     Điều chỉnh độ trong suốt của thanh tiến trình, nút và nền trình phát YouTube
// @description:th     ปรับความโปร่งใสของแถบความคืบหน้า ปุ่ม และพื้นหลังของเครื่องเล่น YouTube
// @author       BaconEgg
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/735944
// @downloadURL https://update.greasyfork.org/scripts/552977/YouTube%20Player%20Opacity%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/552977/YouTube%20Player%20Opacity%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== 透明度設定 (0.0 = 完全透明, 1.0 = 完全不透明) ==========
    const PROGRESS_BAR_OPACITY = 1.0;            // 進度條透明度 (預設: 1.0)
    const CHAPTER_MARKER_OPACITY = 0.3;      // 進度條透明度(不含時間軸指示點) (預設: 1.0)
    const BUTTON_OPACITY = 0.9;                         // 按鈕透明度 (預設: 1.0)
    const TIME_DISPLAY_OPACITY = 0.8;              // 影片播放時間透明度 (預設: 1.0)
    const VOLUME_SLIDER_OPACITY = 1.0;          // 音量滑桿透明度 (預設: 1.0)
    const CONTROL_BAR_BG_OPACITY = 0.0;      // 控制列黑色背景透明度 (預設: 0.0)

    // ========== 開關設定 ==========
    const REMOVE_BUTTON_BG = true;             // 移除按鈕黑色背景 | true = 移除, false = 保留 (預設: false)

    // ========== 額外設定 ==========
    const TOOLTIP_OPACITY = 1.0;                      // 縮圖提示透明度 (預設: 1.0)
    const TOP_GRADIENT_OPACITY = 0.0;         // 頂部漸層透明度 (預設: 0.0)
    const HOVER_OPACITY_BOOST = 0.0;          // 懸停時增加的透明度 (預設: 0.0)


    // ========== 注入自訂 CSS 樣式 ==========
    GM_addStyle(`
        /* ========== 進度條透明度 ========== */
        .ytp-progress-bar-container,
        .ytp-progress-bar,
        .ytp-play-progress,
        .ytp-load-progress,
        .ytp-scrubber-container,
        .ytp-scrubber-button {
            opacity: ${PROGRESS_BAR_OPACITY} !important;
        }

        .ytp-progress-bar-container:hover {
            opacity: ${Math.min(PROGRESS_BAR_OPACITY + HOVER_OPACITY_BOOST, 1.0)} !important;
        }

        /* ========== 控制列背景透明度 ========== */
        .ytp-gradient-bottom {
            opacity: ${CONTROL_BAR_BG_OPACITY} !important;
        }

        .ytp-chrome-bottom,
        .html5-video-player .ytp-chrome-bottom {
            background: rgba(0, 0, 0, ${CONTROL_BAR_BG_OPACITY}) !important;
        }

        /* ========== 按鈕透明度 ========== */
        .ytp-chrome-controls .ytp-button,
        .ytp-play-button,
        .ytp-pause-button,
        .ytp-next-button,
        .ytp-prev-button,
        .ytp-volume-panel,
        .ytp-settings-button,
        .ytp-miniplayer-button,
        .ytp-size-button,
        .ytp-fullscreen-button,
        .ytp-subtitles-button,
        .ytp-left-controls,
        .ytp-right-controls,
        .ytp-chrome-controls .ytp-button svg,
        .ytp-button svg path,
        .ytp-play-button svg,
        .ytp-settings-button svg,
        .ytp-fullscreen-button svg,
        .ytp-miniplayer-button svg,
        .ytp-size-button svg,
        .ytp-volume-panel svg,
        .ytp-subtitles-button-icon {
            opacity: ${BUTTON_OPACITY} !important;
        }

        .ytp-chrome-controls .ytp-button:hover,
        .ytp-play-button:hover,
        .ytp-volume-panel:hover,
        .ytp-settings-button:hover,
        .ytp-miniplayer-button:hover,
        .ytp-size-button:hover,
        .ytp-fullscreen-button:hover,
        .ytp-subtitles-button:hover {
            opacity: ${Math.min(BUTTON_OPACITY + HOVER_OPACITY_BOOST, 1.0)} !important;
        }

        ${REMOVE_BUTTON_BG ? `
        /* ========== 移除按鈕背景 ========== */
        .ytp-chrome-controls .ytp-button,
        .ytp-play-button,
        .ytp-pause-button,
        .ytp-settings-button,
        .ytp-miniplayer-button,
        .ytp-size-button,
        .ytp-fullscreen-button,
        .ytp-subtitles-button,
        .ytp-next-button,
        .ytp-prev-button,
        .ytp-volume-panel,
        .ytp-volume-area,
        .ytp-mute-button,
        .ytp-unmute,
        .ytp-time-display,
        .ytp-left-controls,
        .ytp-right-controls,
        .ytp-chrome-controls .ytp-button::before,
        .ytp-chrome-controls .ytp-button::after,
        .ytp-play-button::before,
        .ytp-play-button::after,
        .ytp-volume-panel::before,
        .ytp-volume-panel::after {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
        }
        ` : ''}

        /* ========== 音量滑桿透明度 ========== */
        .ytp-volume-slider,
        .ytp-volume-slider-handle,
        .ytp-volume-slider-handle::before,
        .ytp-volume-slider-handle::after {
            opacity: ${VOLUME_SLIDER_OPACITY} !important;
        }

        /* ========== 時間顯示透明度 ========== */
        .ytp-time-display,
        .ytp-time-current,
        .ytp-time-separator,
        .ytp-time-duration {
            opacity: ${TIME_DISPLAY_OPACITY} !important;
        }

        ${REMOVE_BUTTON_BG ? `
        /* 移除時間顯示背景 */
        .ytp-time-display,
        .html5-video-player .ytp-time-display,
        .ytp-chrome-controls .ytp-time-display,
        .ytp-time-display *,
        .ytp-time-display::before,
        .ytp-time-display::after {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            box-shadow: none !important;
        }

        .ytp-time-display::before,
        .ytp-time-display::after {
            content: none !important;
            display: none !important;
            opacity: 0 !important;
        }
        ` : ''}

        /* ========== 章節標記透明度 ========== */
        .ytp-chapter-hover-container,
        .ytp-chapters-container,
        .ytp-heat-map-container,
        .ytp-heat-map-chapter {
            opacity: ${CHAPTER_MARKER_OPACITY} !important;
        }

        /* ========== 縮圖提示透明度 ========== */
        .ytp-tooltip,
        .ytp-tooltip-bg,
        .ytp-tooltip-text,
        .ytp-tooltip.ytp-preview,
        .ytp-tooltip.ytp-text-detail,
        div.ytp-tooltip,
        .html5-video-player .ytp-tooltip {
            opacity: ${TOOLTIP_OPACITY} !important;
        }

        /* ========== 頂部漸層透明度 ========== */
        .ytp-gradient-top,
        div.ytp-gradient-top,
        .html5-video-player .ytp-gradient-top,
        .html5-video-player:not(.ytp-autohide) .ytp-gradient-top {
            opacity: ${TOP_GRADIENT_OPACITY} !important;
            background: rgba(0, 0, 0, ${TOP_GRADIENT_OPACITY}) !important;
            display: ${TOP_GRADIENT_OPACITY === 0 ? 'none' : 'block'} !important;
        }

        /* ========== 移除預設背景和陰影 ========== */
        .ytp-chrome-controls,
        .ytp-chrome-bottom {
            background-image: none !important;
            box-shadow: none !important;
        }

        /* ========== 平滑過渡效果 ========== */
        .ytp-progress-bar-container,
        .ytp-chrome-controls .ytp-button,
        .ytp-gradient-bottom,
        .ytp-chrome-bottom {
            transition: opacity 0.2s ease !important;
        }
    `);

    // console.log('🎬 YouTube 透明度調整腳本已載入');
    // console.log('📊 設定值:');
    // console.log(`  ├─ 進度條透明度: ${PROGRESS_BAR_OPACITY}`);
    // console.log(`  ├─ 按鈕透明度: ${BUTTON_OPACITY}`);
    // console.log(`  ├─ 移除按鈕背景: ${REMOVE_BUTTON_BG ? '✅ 是' : '❌ 否'}`);
    // console.log(`  ├─ 控制列背景: ${CONTROL_BAR_BG_OPACITY}`);
    // console.log(`  ├─ 時間顯示: ${TIME_DISPLAY_OPACITY}`);
    // console.log(`  ├─ 音量滑桿: ${VOLUME_SLIDER_OPACITY}`);
    // console.log(`  ├─ 章節標記: ${CHAPTER_MARKER_OPACITY}`);
    // console.log(`  ├─ 縮圖提示: ${TOOLTIP_OPACITY}`);
    // console.log(`  ├─ 頂部漸層: ${TOP_GRADIENT_OPACITY}`);
    // console.log(`  └─ 懸停增強: ${HOVER_OPACITY_BOOST}`);
    // console.log('✨ 腳本運行中...');

})();
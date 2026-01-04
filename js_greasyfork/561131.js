// ==UserScript==
// @name         YouTube 劇院模式排版最優化
// @name:en      BEST YouTube Theater Mode Layout Optimization
// @name:ja      YouTube シアターモード レイアウト最適化
// @namespace    https://greasyfork.org/scripts/454092-youtube-theater-layout
// @version      1.2
// @description  YouTube 劇院模式 / 直播排版優化：影片標題位置優化、聊天室寬度修改、聊天室按鈕、首頁搜尋欄延遲顯示、清理播放器快捷按鈕
// @description:en  YouTube Theater Mode / Live Layout Optimization: Adjust video title position, modify chat width, add chat button, delay homepage search bar display, clean player quick actions
// @description:ja  YouTube シアターモード / ライブレイアウト最適化：動画タイトル位置の調整、チャット幅の変更、チャットボタン、ホームページ検索バーの遅延表示、プレーヤークイックアクションのクリーンアップ
// @author       Leam
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561131/YouTube%20%E5%8A%87%E9%99%A2%E6%A8%A1%E5%BC%8F%E6%8E%92%E7%89%88%E6%9C%80%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561131/YouTube%20%E5%8A%87%E9%99%A2%E6%A8%A1%E5%BC%8F%E6%8E%92%E7%89%88%E6%9C%80%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ============================
  // 參數設定
  // ============================
  const CHAT_WIDTH = 300; //調整聊天室寬度調整 Adjust chat width コメント欄幅を調整
  const CHAT_OFFSET = -55;
  const SECONDARY_TOP_OFFSET = 117;
  const BUTTON_ZINDEX = 9999;
  const TITLE_OFFSET = -3;
  const TITLE_OFFSET_LEFT = 0;
  const HEADER_HOVER_DELAY = 300;// Header 滑鼠移入顯示延遲時間（毫秒）Header hover delay (ms)  ヘッダー表示のホバー遅延（ミリ秒）
  const TITLE_WIDTH_REDUCTION = 125; // 標題寬度減少量
  const BUTTON_CLEAN_DEBOUNCE = 150; // 按鈕清理防抖延遲（毫秒）

  // ============================
  // 狀態管理
  // ============================
  let hoverTimer = null;
  let mastheadEl = null;
  let heightObserver = null;
  let buttonCleanTimer = null;
  let quickActionObserver = null;

  // ============================
  // Share 按鈕 SVG 特徵
  // ============================
  const SHARE_PATH_KEY = 'M10 3.158V7.51';

  // ============================
  // 注入 CSS 樣式
  // ============================
  const injectStyles = () => {
    GM_addStyle(`
      /* 劇院模式基本設定 (排除全螢幕,只在 watch 頁面生效) */
      ytd-watch-flexy[theater] ~ ytd-page-manager.theater-mode:not(.fullscreen-mode),
      body[page-type="watch"] ytd-page-manager.theater-mode:not(.fullscreen-mode) {
        margin-top: -40px !important;
      }
      /* 聊天室圓角 */
      ytd-live-chat-frame[theater-watch-while][rounded-container] {
      border-radius: 0 !important;
      }

      /* 全螢幕時重置 margin */
      ytd-page-manager.fullscreen-mode {
        margin-top: 0 !important;
      }

      /* 只在 watch 頁面的劇院模式調整容器 */
      body[page-type="watch"] #full-bleed-container.theater-mode:not(.fullscreen-mode) {
        min-height: 100vh !important;
        min-width: calc(100vw - 200px) !important;
      }

      /* 全螢幕時重置容器 */
      #full-bleed-container.fullscreen-mode {
        min-height: 100vh !important;
        min-width: 100vw !important;
      }

      /* 聊天室寬度 */
      #chat, ytd-live-chat-frame, #chatframe {
        width: ${CHAT_WIDTH}px !important;
        min-width: ${CHAT_WIDTH}px !important;
        max-width: ${CHAT_WIDTH}px !important;
      }

      /* 側邊欄寬度 */
      ytd-watch-flexy #secondary,
      ytd-watch-flexy #secondary-inner,
      ytd-watch-flexy #related {
        width: ${CHAT_WIDTH}px !important;
        min-width: ${CHAT_WIDTH}px !important;
        max-width: ${CHAT_WIDTH}px !important;
        flex: 0 0 ${CHAT_WIDTH}px !important;
      }

      /* 欄位排版 */
      ytd-watch-flexy[flexy] #columns,
      ytd-watch-flexy[theater] #columns {
        grid-template-columns: minmax(0,1fr) ${CHAT_WIDTH}px !important;
        position: relative;
      }

      /* 聊天室偏移 */
      #chat {
        margin-top: ${CHAT_OFFSET}px !important;
      }

      /* 側邊欄偏移 */
      #secondary {
        margin-top: ${SECONDARY_TOP_OFFSET}px !important;
      }

      /* 隱藏滾動條 */
      ::-webkit-scrollbar {
        width: 0px !important;
        background: transparent !important;
      }
      html {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
      }

      /* 按鈕位置（劇院模式,非全螢幕） */
      ytd-watch-flexy[theater]:not(.fullscreen-active) #actions {
        position: absolute !important;
        top: -20px !important;
        right: -372px !important;
        z-index: ${BUTTON_ZINDEX} !important;
        transform: none !important;
        width: auto !important;
        background: transparent !important;
      }

      /* 按鈕位置（全螢幕時重置） */
      ytd-watch-flexy.fullscreen-active #actions {
        position: relative !important;
        top: auto !important;
        right: auto !important;
        transform: none !important;
      }

      /* 按鈕位置（非劇院模式） */
      ytd-watch-flexy:not([theater]) #actions {
        position: relative !important;
        transform: none !important;
        z-index: ${BUTTON_ZINDEX} !important;
      }

      /* 標題位置（劇院模式,非全螢幕） */
      ytd-watch-flexy[theater]:not(.fullscreen-active) #title.ytd-watch-metadata {
        position: relative !important;
        top: ${TITLE_OFFSET}px !important;
        left: ${TITLE_OFFSET_LEFT}px !important;
        z-index: 1 !important;
      }

      /* 標題位置（全螢幕時重置） */
      ytd-watch-flexy.fullscreen-active #title.ytd-watch-metadata {
        position: relative !important;
        top: 0 !important;
        left: 0 !important;
      }

      /* 標題寬度調整 - 減少 50px */
      h1.ytd-watch-metadata.style-scope {
        max-width: calc(100% - ${TITLE_WIDTH_REDUCTION}px) !important;
        width: calc(100% - ${TITLE_WIDTH_REDUCTION}px) !important;
      }

      ytd-watch-flexy[theater] #primary-inner {
        position: relative !important;
      }

      /* 影片容器（劇院模式,非全螢幕）- 移除固定高度,改用動態高度 */
      ytd-watch-flexy[theater]:not(.fullscreen-active) #ytd-player #player-container-outer,
      ytd-watch-flexy[theater]:not(.fullscreen-active) ytd-player #movie_player {
        height: auto !important;
        margin: 40px auto 0 auto !important;
      }

      /* 影片容器（全螢幕時重置） */
      ytd-watch-flexy.fullscreen-active #ytd-player #player-container-outer,
      ytd-watch-flexy.fullscreen-active ytd-player #movie_player {
        height: 100vh !important;
        margin: 0 !important;
      }

      /* Header 延遲顯示（只在 watch 頁面） */
      body[page-type="watch"] #masthead-container.ytd-app.minUI-theater {
        opacity: 0;
        top: calc(var(--ytd-toolbar-height) / -1.4);
        transform: translateY(0);
        transition: transform 0.3s ease, opacity 0.2s ease;
      }

      body[page-type="watch"] #masthead-container.ytd-app.minUI-theater.showMasthead,
      body[page-type="watch"] #masthead-container.ytd-app.minUI-theater:focus-within {
        opacity: 1;
        transform: translateY(calc(var(--ytd-toolbar-height) / 1.4));
      }

      /* 全螢幕時隱藏 Header */
      html.fullscreen-mode #masthead-container.ytd-app {
        display: none !important;
      }

      /* 全螢幕時聊天室位置和高度調整 */
      ytd-watch-flexy.fullscreen-active #chat,
      ytd-watch-flexy.fullscreen-active ytd-live-chat-frame {
        height: 100% !important;
        max-height: 100% !important;
        position: relative !important;
        right: -0px !important;
        top: 55px !important;
      }

      /* panels-full-bleed-container 固定寬度 ${CHAT_WIDTH}px */
      #panels-full-bleed-container {
        width: ${CHAT_WIDTH}px !important;
        min-width: ${CHAT_WIDTH}px !important;
        max-width: ${CHAT_WIDTH}px !important;
      }

      /* 全螢幕快速操作按鈕顯示（保持可見性以便 JS 選擇） */
      .ytp-fullscreen-quick-actions {
        display: unset !important;
      }
    `);
  };

  // ============================
  // 清理播放器快捷按鈕（Like/Dislike/Share）
  // ============================
  const cleanQuickActionButtons = () => {
    // 只針對播放器內的 quick action 容器
    document.querySelectorAll('yt-player-quick-action-buttons').forEach(container => {
      // 移除 Like 按鈕
      container.querySelectorAll('like-button-view-model').forEach(btn => btn.remove());

      // 移除 Dislike 按鈕
      container.querySelectorAll('dislike-button-view-model').forEach(btn => btn.remove());

      // 移除 Share 按鈕（通過 SVG path 特徵判斷）
      container.querySelectorAll('button').forEach(btn => {
        const path = btn.querySelector('svg path');
        if (path && path.getAttribute('d')?.includes(SHARE_PATH_KEY)) {
          btn.closest('button-view-model')?.remove();
        }
      });
    });
  };

  // ============================
  // 防抖版按鈕清理
  // ============================
  const debouncedCleanButtons = () => {
    if (buttonCleanTimer) clearTimeout(buttonCleanTimer);
    buttonCleanTimer = setTimeout(cleanQuickActionButtons, BUTTON_CLEAN_DEBOUNCE);
  };

  // ============================
  // 監聽播放器按鈕變化（優化版）
  // ============================
  const observeQuickActions = () => {
    // 清除舊的 observer
    if (quickActionObserver) {
      quickActionObserver.disconnect();
    }

    // 初次清理
    cleanQuickActionButtons();

    // 使用更精確的監聽範圍 - 只監聽播放器區域
    const playerContainer = document.querySelector('#movie_player');
    if (!playerContainer) {
      // 如果播放器還沒載入,稍後重試
      setTimeout(observeQuickActions, 500);
      return;
    }

    quickActionObserver = new MutationObserver((mutations) => {
      // 只在有新增節點時才觸發清理
      const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0);
      if (hasAddedNodes) {
        debouncedCleanButtons();
      }
    });

    quickActionObserver.observe(playerContainer, {
      childList: true,
      subtree: true
    });
  };

  // ============================
  // 動態調整影片高度
  // ============================
  const updatePlayerHeight = () => {
    const flexy = document.querySelector('ytd-watch-flexy');
    if (!flexy) return;

    const isTheater = flexy.hasAttribute('theater') || (flexy.isTheater_ && flexy.isTheater_());
    const isFullscreen = !!document.fullscreenElement;

    const playerOuter = document.querySelector('#ytd-player #player-container-outer');
    const moviePlayer = document.querySelector('ytd-player #movie_player');

    // 全螢幕時重置高度
    if (isFullscreen) {
      if (playerOuter) {
        playerOuter.style.removeProperty('height');
      }
      if (moviePlayer) {
        moviePlayer.style.removeProperty('height');
      }
      return;
    }

    // 只在劇院模式且非全螢幕時調整
    if (isTheater) {
      const playerContainer = document.querySelector('#player-full-bleed-container > #player-container');

      if (playerContainer) {
        const height = playerContainer.offsetHeight - 40; // 減少 40px
        if (height > 0) {
          if (playerOuter) {
            playerOuter.style.setProperty('height', `${height}px`, 'important');
          }
          if (moviePlayer) {
            moviePlayer.style.setProperty('height', `${height}px`, 'important');
          }
        }
      }
    }
  };

  // ============================
  // 監聽播放器容器高度變化
  // ============================
  const observePlayerHeight = () => {
    // 清除舊的 observer
    if (heightObserver) {
      heightObserver.disconnect();
    }

    const playerContainer = document.querySelector('#player-full-bleed-container > #player-container');
    if (!playerContainer) return;

    // 使用 ResizeObserver 監聽高度變化
    heightObserver = new ResizeObserver(() => {
      updatePlayerHeight();
    });

    heightObserver.observe(playerContainer);

    // 初始化高度
    updatePlayerHeight();
  };

  // ============================
  // 檢測當前頁面類型
  // ============================
  const updatePageType = () => {
    const isWatchPage = window.location.pathname.startsWith('/watch') ||
                        window.location.pathname.startsWith('/live/');
    document.body.setAttribute('page-type', isWatchPage ? 'watch' : 'other');
  };

  // ============================
  // Header 延遲顯示/隱藏
  // ============================
  const handleMouseEnter = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      mastheadEl?.classList.add('showMasthead');
    }, HEADER_HOVER_DELAY);
  };

  const handleMouseLeave = () => {
    if (hoverTimer) clearTimeout(hoverTimer);
    mastheadEl?.classList.remove('showMasthead');
  };

  const updateHeaderVisibility = () => {
    const flexy = document.querySelector('ytd-watch-flexy');
    if (!flexy) return;

    const isTheater = flexy.hasAttribute('theater') || (flexy.isTheater_ && flexy.isTheater_());
    const isHidden = flexy.hasAttribute('hidden');
    const isFullscreen = !!document.fullscreenElement;
    const isWatchPage = document.body.getAttribute('page-type') === 'watch';

    if (isTheater && !isHidden && !isFullscreen && isWatchPage) {
      // 啟用 Header 隱藏（只在 watch 頁面）
      document.documentElement.classList.add('miniUI-theater');
      const pageManager = document.querySelector('#page-manager.ytd-app');
      pageManager?.classList.add('minUI-theater');

      mastheadEl = document.querySelector('#masthead-container.ytd-app');
      if (mastheadEl) {
        mastheadEl.classList.add('minUI-theater');
        mastheadEl.classList.remove('showMasthead');
        mastheadEl.addEventListener('mouseenter', handleMouseEnter);
        mastheadEl.addEventListener('mouseleave', handleMouseLeave);
      }
    } else {
      // 移除 Header 隱藏
      document.documentElement.classList.remove('miniUI-theater');
      const pageManager = document.querySelector('#page-manager.ytd-app');
      pageManager?.classList.remove('minUI-theater');

      if (mastheadEl) {
        mastheadEl.classList.remove('minUI-theater');
        mastheadEl.classList.remove('showMasthead');
        mastheadEl.removeEventListener('mouseenter', handleMouseEnter);
        mastheadEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    }
  };

  // ============================
  // 劇院模式樣式切換
  // ============================
  const updateTheaterMode = () => {
    const flexy = document.querySelector('ytd-watch-flexy');
    if (!flexy) return;

    const isTheater = flexy.hasAttribute('theater') || (flexy.isTheater_ && flexy.isTheater_());
    const isFullscreen = !!document.fullscreenElement;
    const pageManager = document.querySelector('ytd-page-manager');
    const fullBleed = document.querySelector('#full-bleed-container');

    // 處理全螢幕狀態
    if (isFullscreen) {
      pageManager?.classList.add('fullscreen-mode');
      pageManager?.classList.remove('theater-mode');
      fullBleed?.classList.add('fullscreen-mode');
      fullBleed?.classList.remove('theater-mode');
      flexy.classList.add('fullscreen-active');
      document.documentElement.classList.add('fullscreen-mode');
    } else if (isTheater) {
      pageManager?.classList.add('theater-mode');
      pageManager?.classList.remove('fullscreen-mode');
      fullBleed?.classList.add('theater-mode');
      fullBleed?.classList.remove('fullscreen-mode');
      flexy.classList.remove('fullscreen-active');
      document.documentElement.classList.remove('fullscreen-mode');

      // 劇院模式啟用時開始監聽高度變化
      setTimeout(observePlayerHeight, 100);
    } else {
      pageManager?.classList.remove('theater-mode', 'fullscreen-mode');
      fullBleed?.classList.remove('theater-mode', 'fullscreen-mode');
      flexy.classList.remove('fullscreen-active');
      document.documentElement.classList.remove('fullscreen-mode');
    }

    // 同時更新 Header 顯示狀態
    updateHeaderVisibility();

    // 劇院模式或全螢幕時重新初始化按鈕清理
    if (isTheater || isFullscreen) {
      observeQuickActions();
    }
  };

  // ============================
  // 監聽劇院模式切換
  // ============================
  const observeTheaterMode = () => {
    const observer = new MutationObserver(() => {
      const flexy = document.querySelector('ytd-watch-flexy');
      if (flexy) {
        observer.disconnect();

        const attrObserver = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'theater' || mutation.attributeName === 'hidden')) {
              updateTheaterMode();
            }
          }
        });

        attrObserver.observe(flexy, { attributes: true, attributeFilter: ['theater', 'hidden'] });
        updateTheaterMode();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  // ============================
  // 監聽全螢幕變化
  // ============================
  const observeFullscreen = () => {
    document.addEventListener('fullscreenchange', updateTheaterMode);
    document.addEventListener('webkitfullscreenchange', updateTheaterMode);
  };

  // ============================
  // 監聽 URL 變化
  // ============================
  const observeUrlChange = () => {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        updatePageType();
        updateTheaterMode();
        // URL 變化時重新初始化按鈕清理
        setTimeout(observeQuickActions, 300);
      }
    }).observe(document, { subtree: true, childList: true });
  };

  // ============================
  // 初始化
  // ============================
  const init = () => {
    updatePageType();
    injectStyles();
    observeTheaterMode();
    observeFullscreen();
    observeUrlChange();
    // 初始化按鈕清理
    setTimeout(observeQuickActions, 500);
  };

  // ============================
  // 啟動
  // ============================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

})();
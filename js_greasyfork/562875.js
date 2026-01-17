// ==UserScript==
// @name         网页给我滚/Auto Scroll 
// @author       xouou
// @namespace    https://github.com/xouou/browserScript
// @version      1.0
// @description  网页自动滚动，1~100速度可调，默认10。主控面板可拖拽、吸附边沿、自动隐藏。滚动效果丝滑流畅。新增“顶/底”快速跳转按钮。
// @match        *://*/*
// @grant        none
// @date         2026.1.16
// @license	 MIT license
// @downloadURL https://update.greasyfork.org/scripts/562875/%E7%BD%91%E9%A1%B5%E7%BB%99%E6%88%91%E6%BB%9AAuto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/562875/%E7%BD%91%E9%A1%B5%E7%BB%99%E6%88%91%E6%BB%9AAuto%20Scroll.meta.js
// ==/UserScript==
(function () {
  'use strict';
  if (window.top !== window) return;
  let scrolling = false;
  let scrollRAF = null;
  let scrollTimestamp = 0;
  let scrollAccumulated = 0;

  let hideTimeout = null;
  let lastYPosition = null; 
  let panelSide = 'left';
  let mouseOnPanel = false;
  let mouseOnMini = false;
  let mouseOnTopBtn = false;
  let mouseOnBottomBtn = false;

  const PANEL_WIDTH = 66;
  const PANEL_HEIGHT = 80;
  const BTN_SIZE = 32;
  const BTN_GAP = 2;
  const STORAGE_KEY = 'autoScrollPanel_v2_viewport';

  // —————— 从 localStorage 读取（仅视口坐标）——————
  let savedPos = null;
  try {
    savedPos = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    savedPos = null;
  }

  if (savedPos && (savedPos.side === 'left' || savedPos.side === 'right') && typeof savedPos.y === 'number') {
    panelSide = savedPos.side;
    lastYPosition = savedPos.y;
  } else {
    panelSide = 'left';
    lastYPosition = Math.min(window.innerHeight * 0.4, window.innerHeight - PANEL_HEIGHT);
  }

  // —————— 主控制面板 ——————
  const panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.width = PANEL_WIDTH + 'px';
  panel.style.height = PANEL_HEIGHT + 'px';
  panel.style.zIndex = '999998';
  panel.style.background = 'rgba(255, 0, 0, 0.35)';
  panel.style.borderRadius = panelSide === 'left' ? '0 10px 10px 0' : '10px 0 0 10px';
  panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
  panel.style.padding = '8px';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';
  panel.style.justifyContent = 'space-between';
  panel.style.alignItems = 'center';
  panel.style.boxSizing = 'border-box';
  panel.style.cursor = 'grab';
  panel.style.opacity = '1';
  panel.style.pointerEvents = 'auto';

  panel.style.left = panelSide === 'left' ? '0px' : (window.innerWidth - PANEL_WIDTH) + 'px';
  panel.style.top = Math.max(0, Math.min(lastYPosition, window.innerHeight - PANEL_HEIGHT)) + 'px';

  const speedInput = document.createElement('input');
  speedInput.type = 'number';
  speedInput.min = '1';
  speedInput.max = '100';
  speedInput.value = '10';
  speedInput.style.width = '55px';
  speedInput.style.textAlign = 'center';
  speedInput.style.fontSize = '14px';
  speedInput.style.border = '1px solid rgba(0,0,0,0.2)';
  speedInput.style.borderRadius = '6px';
  speedInput.style.background = 'rgba(243, 227, 220, 0.9)';
  speedInput.style.color = '#000';
  speedInput.style.outline = 'none';
  speedInput.style.padding = '5px 4px';
  speedInput.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)';

  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '▼';
  toggleBtn.style.width = '32px';
  toggleBtn.style.height = '32px';
  toggleBtn.style.border = '2px solid #ddd';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.background = 'rgba(255,255,255,0.9)';
  toggleBtn.style.color = '#4CAF50';
  toggleBtn.style.fontSize = '16px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.outline = 'none';
  toggleBtn.style.transform = 'translate(0px, 3px)';

  panel.appendChild(speedInput);
  panel.appendChild(toggleBtn);
  document.body.appendChild(panel);

  // —— 顶/底按钮 ——
  const topBtn = document.createElement('div');
  topBtn.innerText = '顶';
  topBtn.style.position = 'fixed';
  topBtn.style.zIndex = '999999';
  topBtn.style.width = BTN_SIZE + 'px';
  topBtn.style.height = BTN_SIZE + 'px';
  topBtn.style.borderRadius = '50%';
  topBtn.style.background = 'rgba(255, 0, 0, 0.35)';
  topBtn.style.color = '#4CAF50';
  topBtn.style.display = 'flex';
  topBtn.style.justifyContent = 'center';
  topBtn.style.alignItems = 'center';
  topBtn.style.fontSize = '14px';
  topBtn.style.fontWeight = 'bold';
  topBtn.style.cursor = 'pointer';
  topBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  topBtn.style.userSelect = 'none';

  const bottomBtn = document.createElement('div');
  bottomBtn.innerText = '底';
  bottomBtn.style.position = 'fixed';
  bottomBtn.style.zIndex = '999999';
  bottomBtn.style.width = BTN_SIZE + 'px';
  bottomBtn.style.height = BTN_SIZE + 'px';
  bottomBtn.style.borderRadius = '50%';
  bottomBtn.style.background = 'rgba(255, 0, 0, 0.35)';
  bottomBtn.style.color = '#4CAF50';
  bottomBtn.style.display = 'flex';
  bottomBtn.style.justifyContent = 'center';
  bottomBtn.style.alignItems = 'center';
  bottomBtn.style.fontSize = '14px';
  bottomBtn.style.fontWeight = 'bold';
  bottomBtn.style.cursor = 'pointer';
  bottomBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  bottomBtn.style.userSelect = 'none';

  document.body.appendChild(topBtn);
  document.body.appendChild(bottomBtn);

  const updateHelperButtonsPosition = () => {
    const panelRect = panel.getBoundingClientRect();
    const centerX = panelRect.left + PANEL_WIDTH / 2;
    const topY = panelRect.top - BTN_SIZE - BTN_GAP;
    const bottomY = panelRect.bottom + BTN_GAP;

    topBtn.style.left = (centerX - BTN_SIZE / 2) + 'px';
    topBtn.style.top = Math.max(0, topY) + 'px';

    bottomBtn.style.left = (centerX - BTN_SIZE / 2) + 'px';
    bottomBtn.style.top = Math.min(window.innerHeight - BTN_SIZE, bottomY) + 'px';
  };

  topBtn.addEventListener('mouseenter', () => {
    mouseOnTopBtn = true;
    resetHideTimer();
  });
  topBtn.addEventListener('mouseleave', () => {
    mouseOnTopBtn = false;
    startAutoHide();
  });

  bottomBtn.addEventListener('mouseenter', () => {
    mouseOnBottomBtn = true;
    resetHideTimer();
  });
  bottomBtn.addEventListener('mouseleave', () => {
    mouseOnBottomBtn = false;
    startAutoHide();
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  });
  bottomBtn.addEventListener('click', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll, behavior: 'auto' });
      stopScroll();
  });

 
  const miniButton = document.createElement('div');
  miniButton.innerText = '▼';
  miniButton.style.position = 'fixed';
  miniButton.style.zIndex = '999999';
  miniButton.style.width = '24px';
  miniButton.style.height = '24px';
  miniButton.style.background = 'rgba(0, 200, 0, 0.9)';
  miniButton.style.color = '#fff';
  miniButton.style.borderRadius = '50%';
  miniButton.style.display = 'none';
  miniButton.style.justifyContent = 'center';
  miniButton.style.alignItems = 'center';
  miniButton.style.cursor = 'pointer';
  miniButton.style.fontSize = '16px';
  miniButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  document.body.appendChild(miniButton);

  panel.addEventListener('mouseenter', () => {
    mouseOnPanel = true;
    resetHideTimer();
  });
  panel.addEventListener('mouseleave', () => {
    mouseOnPanel = false;
    startAutoHide();
  });
  miniButton.addEventListener('mouseenter', () => {
    mouseOnMini = true;
    miniButton.style.display = 'none';
    miniButton.style.opacity = '0';
    panel.style.opacity = '1';
    panel.style.pointerEvents = 'auto';
    panel.style.top = miniButton.style.top;
    if (panelSide === 'left') {
      panel.style.left = '0px';
      panel.style.borderRadius = '0 10px 10px 0';
    } else {
      panel.style.left = (window.innerWidth - PANEL_WIDTH) + 'px';
      panel.style.borderRadius = '10px 0 0 10px';
    }
    resetHideTimer();
  });
  miniButton.addEventListener('mouseleave', () => {
    mouseOnMini = false;
    startAutoHide();
  });


  function startAutoHide() {
    if (mouseOnPanel || mouseOnMini || mouseOnTopBtn || mouseOnBottomBtn) return;
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hidePanel, 1000);
  }
  function hidePanel() {
    const rect = panel.getBoundingClientRect();

    lastYPosition = rect.top;
    const centerX = rect.left + PANEL_WIDTH / 2;
    panelSide = centerX < window.innerWidth / 2 ? 'left' : 'right';

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        side: panelSide,
        y: lastYPosition // ← 纯视口坐标
      }));
    } catch (e) {}

    panel.style.opacity = '0';
    panel.style.pointerEvents = 'none';
    miniButton.style.display = 'flex';
    topBtn.style.display = 'none';
    bottomBtn.style.display = 'none';

    if (panelSide === 'left') {
      miniButton.style.left = '0';
      miniButton.style.borderRadius = '0 8px 8px 0';
    } else {
      miniButton.style.right = '0';
      miniButton.style.borderRadius = '8px 0 0 8px';
    }

    miniButton.style.top = lastYPosition + 'px';
    miniButton.style.opacity = '1';
  }
  function resetHideTimer() {
    clearTimeout(hideTimeout);
    if (!mouseOnPanel && !mouseOnMini && !mouseOnTopBtn && !mouseOnBottomBtn) {
      startAutoHide();
    } else {
      panel.style.opacity = '1';
      panel.style.pointerEvents = 'auto';
      topBtn.style.display = 'flex';
      bottomBtn.style.display = 'flex';
      updateHelperButtonsPosition();
    }
  }


  function startScroll() {
    let speed = parseInt(speedInput.value, 10);
    if (isNaN(speed) || speed < 1) speed = 1;
    if (speed > 100) speed = 100;
    const baseSpeed = Math.pow(speed / 20, 1.6);
    scrolling = true;
    toggleBtn.innerHTML = '■';
    toggleBtn.style.color = '#F44336';
    scrollTimestamp = 0;
    scrollAccumulated = 0;

    function scrollStep(timestamp) {
      if (!scrolling) return;
      if (!scrollTimestamp) scrollTimestamp = timestamp;
      const delta = timestamp - scrollTimestamp;
      scrollTimestamp = timestamp;

      scrollAccumulated += baseSpeed * (delta / 16.67);
      let scrollNow = Math.floor(scrollAccumulated);
      scrollAccumulated -= scrollNow;

      if (scrollNow > 0) {
        const currentScroll = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (currentScroll >= maxScroll) {
          stopScroll();
          return;
        }
        window.scrollBy(0, scrollNow);
      }

      scrollRAF = requestAnimationFrame(scrollStep);
    }

    scrollRAF = requestAnimationFrame(scrollStep);
  }

  function stopScroll() {
    scrolling = false;
    if (scrollRAF) {
      cancelAnimationFrame(scrollRAF);
      scrollRAF = null;
    }
    toggleBtn.innerHTML = '▼';
    toggleBtn.style.color = '#4CAF50';
  }

  toggleBtn.addEventListener('click', () => {
    if (scrolling) stopScroll(); else startScroll();
    resetHideTimer();
  });
  speedInput.addEventListener('input', resetHideTimer);


  let isDragging = false;
  let offsetX, offsetY;
  panel.addEventListener('mousedown', (e) => {
    if (e.target !== speedInput && e.target !== toggleBtn) {
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      panel.style.cursor = 'grabbing';
      e.preventDefault();
    }
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;
    const maxX = window.innerWidth - PANEL_WIDTH;
    const maxY = window.innerHeight - PANEL_HEIGHT;
    panel.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    panel.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
    resetHideTimer();
  });
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      panel.style.cursor = 'grab';
      const rect = panel.getBoundingClientRect();
      const centerX = rect.left + PANEL_WIDTH / 2;
      panelSide = centerX < window.innerWidth / 2 ? 'left' : 'right';
      if (panelSide === 'left') {
        panel.style.left = '0px';
        panel.style.borderRadius = '0 10px 10px 0';
      } else {
        panel.style.left = (window.innerWidth - PANEL_WIDTH) + 'px';
        panel.style.borderRadius = '10px 0 0 10px';
      }


      lastYPosition = rect.top;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          side: panelSide,
          y: lastYPosition
        }));
      } catch (e) {}

      resetHideTimer();
    }
  });

  window.addEventListener('resize', resetHideTimer);

  setTimeout(() => {
    topBtn.style.display = 'flex';
    bottomBtn.style.display = 'flex';
    updateHelperButtonsPosition();
    if (!mouseOnPanel && !mouseOnMini && !mouseOnTopBtn && !mouseOnBottomBtn) {
      startAutoHide();
    }
  }, 300);
})();
// ==UserScript==
// @name         禁漫天堂移动端阅读优化
// @namespace    https://greasyfork.org/zh-CN/users/1531924-a-w1nner
// @match        https://18comic.ink/photo/*
// @match        https://18comic.vip/photo/*
// @run-at       document-end
// @grant        none
// @version      1.0
// @author       Grok ChatGPT
// @description  支持禁漫天堂阅读页面手势，左滑下一话、右滑上一话、边缘下滑刷新、屏幕双击滚动页面功能，并配有可调设置悬浮窗。让用户在阅读过程中，解放双手，享受阅读。
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/554190/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/554190/%E7%A6%81%E6%BC%AB%E5%A4%A9%E5%A0%82%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ====== 默认配置 ======
  const defaultConfig = {
    leftSwipe: true,
    rightSwipe: true,
    leftEdgeDown: true,
    rightEdgeDown: true,
    leftEdgeWidth: 0.2,  // 屏宽比例
    rightEdgeWidth: 0.2,
    doubleTapScroll: true,
    doubleTapScrollSpeed: 2
  };

  // ====== 读取/保存配置 ======
  const cfgKey = 'comicGestureConfig';
  let cfg = JSON.parse(localStorage.getItem(cfgKey) || '{}');
  cfg = Object.assign({}, defaultConfig, cfg);

  const posKey = 'comicIconPosition';
  let iconPos = JSON.parse(localStorage.getItem(posKey) || '{}');

  function saveConfig() {
    localStorage.setItem(cfgKey, JSON.stringify(cfg));
    if (Object.keys(iconPos).length > 0) {
      localStorage.setItem(posKey, JSON.stringify(iconPos));
    }
  }

  function cancelConfig() {
    cfg = Object.assign({}, defaultConfig, JSON.parse(localStorage.getItem(cfgKey) || '{}'));
  }

  // ====== 手势参数 ======
  let minSlideDistance = window.innerWidth / 6;
  let maxVerticalOffset = window.innerHeight / 4;
  let startX = 0, startY = 0;
  let isSliding = false, isEdgeSwipe = false;
  let settingsOpen = false;
  let lastTapTime = 0;
  let doubleTapThreshold = 300; // ms
  let isDoubleTapScrolling = false;
  let doubleTapScrollTimer = null;

  // ====== 提示弹窗 ======
  function showToast(message, callback) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:#fff;padding:10px 20px;border-radius:5px;z-index:10000;font-size:16px;white-space:nowrap;`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
      if (callback) callback();
    }, 1000);
  }

  // ====== 查找链接 ======
  async function findLink(direction) {
    const textPatterns = direction === 'next'
      ? /下一|next|下一頁|下一话|下一章|後一|後頁/
      : /上一|prev|previous|上頁|上一话|上一章|前一/;
    // 文字匹配
    let candidate = Array.from(document.querySelectorAll('a')).find(a =>
      textPatterns.test(a.textContent || '')
    );
    if (candidate && candidate.href) return candidate;

    // href /photo/<id> fallback
    const anchors = Array.from(document.querySelectorAll('a[href*="/photo/"]'));
    const parseId = href => {
      const m = href.match(/\/photo\/(\d+)/);
      return m ? parseInt(m[1], 10) : null;
    };
    const currentId = parseId(location.pathname);
    if (currentId) {
      const withId = anchors.map(a => ({el: a, id: parseId(a.href)})).filter(x => x.id);
      withId.sort((a,b)=>a.id-b.id);
      if (direction==='next') return withId.find(x=>x.id>currentId)?.el || null;
      else return withId.filter(x=>x.id<currentId).pop()?.el || null;
    }
    return null;
  }

  async function navigateToElement(aEl) {
    if (!aEl) return false;
    const href = aEl.getAttribute('href') || aEl.href;
    try {
      location.href = new URL(href, location.origin).href;
      return true;
    } catch {
      aEl.click();
      return true;
    }
  }

  // ====== 双击自动滚动 ======
  function toggleDoubleTapScroll() {
    if (isDoubleTapScrolling) {
      stopDoubleTapScroll();
      showToast('自动滚动已停止');
    } else {
      startDoubleTapScroll();
      showToast('自动滚动已启动');
    }
  }

  function startDoubleTapScroll() {
    isDoubleTapScrolling = true;
    doubleTapScrollTimer = setInterval(() => {
      window.scrollBy(0, cfg.doubleTapScrollSpeed);
    }, 16);
  }

  function stopDoubleTapScroll() {
    isDoubleTapScrolling = false;
    if (doubleTapScrollTimer) {
      clearInterval(doubleTapScrollTimer);
      doubleTapScrollTimer = null;
    }
  }

  // ====== 手势事件 ======
  document.addEventListener('touchstart', function(e){
    if (settingsOpen) return;
    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTapTime;
    const centerWidth = window.innerWidth * 0.4; // 中央区域宽度比例
    const isCenter = Math.abs(touch.clientX - window.innerWidth / 2) < centerWidth / 2 && cfg.doubleTapScroll;

    if (isCenter && deltaTime < doubleTapThreshold && deltaTime > 0) {
      e.preventDefault();
      toggleDoubleTapScroll();
      return; // 防止其他手势
    }

    if (isCenter) {
      lastTapTime = currentTime;
    }

    startX = touch.clientX;
    startY = touch.clientY;
    isSliding = true;

    // 判断边缘触发
    const leftWidth = window.innerWidth * cfg.leftEdgeWidth;
    const rightWidth = window.innerWidth * cfg.rightEdgeWidth;
    isEdgeSwipe = (touch.clientX<leftWidth && cfg.leftEdgeDown) || (touch.clientX>window.innerWidth-rightWidth && cfg.rightEdgeDown);
  }, {passive: false});

  document.addEventListener('touchmove', async function(e){
    if (settingsOpen || !isSliding) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    // 左右滑
    if(Math.abs(deltaX) > Math.abs(deltaY)) {
      if(deltaX<-minSlideDistance && Math.abs(deltaY)<maxVerticalOffset && cfg.leftSwipe){
        isSliding=false;
        const link = await findLink('next');
        if(link) {
          showToast('正在进入下一话', () => navigateToElement(link));
        }
      } else if(deltaX>minSlideDistance && Math.abs(deltaY)<maxVerticalOffset && cfg.rightSwipe){
        isSliding=false;
        const link = await findLink('prev');
        if(link) {
          showToast('正在进入上一话', () => navigateToElement(link));
        }
      }
    }
    // 边缘下滑刷新
    else if(isEdgeSwipe && deltaY>window.innerHeight/4){
      isSliding=false;
      const side = startX < window.innerWidth / 2 ? '左' : '右';
      showToast(`正在${side}边缘刷新页面`, () => location.reload());
    }
  }, {passive:true});

  document.addEventListener('touchend', function(){
    if (settingsOpen) return;
    isSliding=false; isEdgeSwipe=false;
  }, {passive:true});

  // ====== 悬浮窗 UI ======
  // 小图标
  const iconBtn = document.createElement('div');
  iconBtn.innerHTML = '⚙️';
  iconBtn.style.cssText = `position:fixed;width:40px;height:40px;background:#222;color:#fff;border-radius:50%;z-index:9999;font-size:20px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 10px rgba(0,0,0,0.5);cursor:pointer;user-select:none;touch-action:manipulation;`;
  // 应用保存的位置
  if (Object.keys(iconPos).length > 0 && iconPos.left !== undefined && iconPos.top !== undefined) {
    iconBtn.style.left = iconPos.left + 'px';
    iconBtn.style.top = iconPos.top + 'px';
    iconBtn.style.right = 'auto';
    iconBtn.style.bottom = 'auto';
  } else {
    iconBtn.style.top = '10px';
    iconBtn.style.right = '10px';
    iconBtn.style.left = 'auto';
    iconBtn.style.bottom = 'auto';
  }
  document.body.appendChild(iconBtn);

  // 面板
  const panel = document.createElement('div');
  panel.style.cssText=`position:fixed;width:250px;background:#222;color:#fff;padding:10px;border-radius:8px;z-index:9999;font-size:14px;box-shadow:0 0 10px rgba(0,0,0,0.5);display:none;touch-action:manipulation;`;
  panel.innerHTML=`
    <label><input type="checkbox" id="cfgLeftSwipe"> 左滑下一话</label><br>
    <label><input type="checkbox" id="cfgRightSwipe"> 右滑上一话</label><br>
    <label>左边缘刷新<input type="checkbox" id="cfgLeftEdge"> 开启</label><br>
    <label>触发区宽度: <input type="range" id="cfgLeftWidth" min="0" max="1" step="0.05" style="width:150px;"><span id="leftWidthVal">0.2</span></label><br>
    <label>右边缘刷新<input type="checkbox" id="cfgRightEdge"> 开启</label><br>
    <label>触发区宽度: <input type="range" id="cfgRightWidth" min="0" max="1" step="0.05" style="width:150px;"><span id="rightWidthVal">0.2</span></label><br>
    <label>双击自动滚动<input type="checkbox" id="cfgDoubleTapScroll"> 开启</label><br>
    <label>滚动速度: <input type="range" id="cfgDoubleTapScrollSpeed" min="1" max="20" step="1" style="width:150px;"><span id="doubleTapScrollSpeedVal">2</span></label><br>
    <div style="text-align:center;margin-top:5px">
      <button id="cfgSave" style="margin-right:5px;background:none;border:none;color:#fff;cursor:pointer;padding:5px;">保存</button>
      <button id="cfgCancel" style="background:none;border:none;color:#fff;cursor:pointer;padding:5px;">取消</button>
    </div>
  `;
  document.body.appendChild(panel);

  // 初始化面板
  function updatePanel(){
    document.getElementById('cfgLeftSwipe').checked=cfg.leftSwipe;
    document.getElementById('cfgRightSwipe').checked=cfg.rightSwipe;
    document.getElementById('cfgLeftEdge').checked=cfg.leftEdgeDown;
    document.getElementById('cfgRightEdge').checked=cfg.rightEdgeDown;
    document.getElementById('cfgLeftWidth').value=cfg.leftEdgeWidth;
    document.getElementById('leftWidthVal').textContent=cfg.leftEdgeWidth;
    document.getElementById('cfgRightWidth').value=cfg.rightEdgeWidth;
    document.getElementById('rightWidthVal').textContent=cfg.rightEdgeWidth;
    document.getElementById('cfgDoubleTapScroll').checked=cfg.doubleTapScroll;
    document.getElementById('cfgDoubleTapScrollSpeed').value=cfg.doubleTapScrollSpeed;
    document.getElementById('doubleTapScrollSpeedVal').textContent=cfg.doubleTapScrollSpeed;
  }

  // 滑动条值更新显示
  const leftWidthSlider = document.getElementById('cfgLeftWidth');
  const rightWidthSlider = document.getElementById('cfgRightWidth');
  const doubleTapScrollSpeedSlider = document.getElementById('cfgDoubleTapScrollSpeed');

  if (leftWidthSlider) {
    leftWidthSlider.addEventListener('input', function(e) {
      document.getElementById('leftWidthVal').textContent = parseFloat(e.target.value).toFixed(2);
    });
  }
  if (rightWidthSlider) {
    rightWidthSlider.addEventListener('input', function(e) {
      document.getElementById('rightWidthVal').textContent = parseFloat(e.target.value).toFixed(2);
    });
  }
  if (doubleTapScrollSpeedSlider) {
    doubleTapScrollSpeedSlider.addEventListener('input', function(e) {
      document.getElementById('doubleTapScrollSpeedVal').textContent = e.target.value;
    });
  }

  // 关闭面板函数
  function closePanel() {
    panel.style.display = 'none';
    settingsOpen = false;
  }

  // 点击小图标切换面板
  iconBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (settingsOpen) {
      closePanel();
    } else {
      const iconRect = iconBtn.getBoundingClientRect();
      // 确保图标位置使用 left/top
      let iconLeft, iconTop;
      if (iconBtn.style.left !== 'auto' && iconBtn.style.left !== '') {
        iconLeft = parseFloat(iconBtn.style.left);
        iconTop = parseFloat(iconBtn.style.top);
      } else {
        iconLeft = iconRect.left;
        iconTop = iconRect.top;
        iconBtn.style.left = iconLeft + 'px';
        iconBtn.style.top = iconTop + 'px';
        iconBtn.style.right = 'auto';
        iconBtn.style.bottom = 'auto';
      }
      panel.style.display = 'block';
      settingsOpen = true;
      // 延迟计算位置以获取准确高度
      requestAnimationFrame(() => {
        const panelHeight = panel.offsetHeight;
        const panelWidth = panel.offsetWidth;
        let panelTop, panelLeft;
        // 垂直位置
        if (iconTop < 50) {
          // 上边缘，面板上边缘对齐屏幕上边缘
          panelTop = 0;
        } else if (iconRect.bottom > window.innerHeight - 50) {
          // 下边缘，面板下边缘对齐屏幕下边缘
          panelTop = window.innerHeight - panelHeight;
        } else {
          // 非边缘，检查空间
          const downSpace = window.innerHeight - iconRect.bottom;
          if (downSpace >= panelHeight) {
            panelTop = iconTop + 40;
          } else {
            panelTop = iconTop - panelHeight;
            if (panelTop < 0) panelTop = 0;
          }
        }
        // 水平位置
        if (iconLeft < 50) {
          // 左边缘，面板左边缘对齐屏幕左边缘
          panelLeft = 0;
        } else if (iconRect.right > window.innerWidth - 50) {
          // 右边缘，面板右边缘对齐屏幕右边缘
          panelLeft = window.innerWidth - panelWidth;
        } else {
          // 非边缘，居中于图标
          panelLeft = iconLeft + 20 - panelWidth / 2;
          // 确保不超出屏幕
          if (panelLeft < 0) panelLeft = 0;
          if (panelLeft + panelWidth > window.innerWidth) panelLeft = window.innerWidth - panelWidth;
        }
        panel.style.left = panelLeft + 'px';
        panel.style.top = panelTop + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        updatePanel();
      });
    }
  });

  // 点击外部关闭面板
  document.addEventListener('click', function(e) {
    if (settingsOpen && !panel.contains(e.target) && !iconBtn.contains(e.target)) {
      closePanel();
    }
  });

  // 保存
  document.getElementById('cfgSave').onclick=function(e){
    e.stopPropagation();
    cfg.leftSwipe=document.getElementById('cfgLeftSwipe').checked;
    cfg.rightSwipe=document.getElementById('cfgRightSwipe').checked;
    cfg.leftEdgeDown=document.getElementById('cfgLeftEdge').checked;
    cfg.rightEdgeDown=document.getElementById('cfgRightEdge').checked;
    cfg.leftEdgeWidth=parseFloat(document.getElementById('cfgLeftWidth').value);
    cfg.rightEdgeWidth=parseFloat(document.getElementById('cfgRightWidth').value);
    cfg.doubleTapScroll=document.getElementById('cfgDoubleTapScroll').checked;
    cfg.doubleTapScrollSpeed=parseInt(document.getElementById('cfgDoubleTapScrollSpeed').value);
    saveConfig();
    alert('保存成功！点击确认后会刷新本页面！');
    closePanel();
    location.reload();
  }

  // 取消
  document.getElementById('cfgCancel').onclick=function(e){
    e.stopPropagation();
    cancelConfig();
    updatePanel();
    closePanel();
  }

  // ====== 拖动功能（仅触控，支持阈值，仅当触碰元素时激活，全屏吸附） ======
  function addDragSupport(element) {
    let isDragging = false;
    let touchActive = false;
    let dragOffsetX = 0, dragOffsetY = 0;
    let dragStartX = 0, dragStartY = 0;

    // 触控事件
    element.addEventListener('touchstart', function(e) {
      if (settingsOpen) return;
      e.stopPropagation();
      touchActive = true;
      const touch = e.touches[0];
      dragStartX = touch.clientX;
      dragStartY = touch.clientY;
      isDragging = false;
      // 转换为 left/top 如果是初始 right/top
      const rect = element.getBoundingClientRect();
      if (element.style.left === 'auto' || element.style.left === '') {
        element.style.left = rect.left + 'px';
        element.style.top = rect.top + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
      }
    }, {passive: true});

    document.addEventListener('touchmove', function(e) {
      if (settingsOpen || !touchActive) return;
      if (isDragging) {
        e.preventDefault();
        const touch = e.touches[0];
        element.style.left = (touch.clientX - dragOffsetX) + 'px';
        element.style.top = (touch.clientY - dragOffsetY) + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        return;
      }

      // 检查是否开始拖动
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - dragStartX);
      const deltaY = Math.abs(touch.clientY - dragStartY);
      if (deltaX > 10 || deltaY > 10) {
        isDragging = true;
        const rect = element.getBoundingClientRect();
        dragOffsetX = touch.clientX - rect.left;
        dragOffsetY = touch.clientY - rect.top;
        element.style.left = rect.left + 'px';
        element.style.top = rect.top + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        e.preventDefault();
      }
    }, {passive: false});

    document.addEventListener('touchend', function() {
      if (settingsOpen) return;
      touchActive = false;
      if (isDragging) {
        isDragging = false;
        // 全屏吸附到最近边缘（无阈值限制）
        const rect = element.getBoundingClientRect();
        const iconWidth = 40;
        const iconHeight = 40;
        const margin = 10;
        const leftDist = rect.left;
        const rightDist = window.innerWidth - rect.right;
        const topDist = rect.top;
        const bottomDist = window.innerHeight - rect.bottom;
        const distances = {left: leftDist, right: rightDist, top: topDist, bottom: bottomDist};
        const minDist = Math.min(...Object.values(distances));
        const edge = Object.keys(distances).find(key => distances[key] === minDist);
        let newLeft, newTop;
        switch(edge) {
          case 'left':
            newLeft = margin + 'px';
            newTop = rect.top + 'px';
            break;
          case 'right':
            newLeft = (window.innerWidth - iconWidth - margin) + 'px';
            newTop = rect.top + 'px';
            break;
          case 'top':
            newLeft = rect.left + 'px';
            newTop = margin + 'px';
            break;
          case 'bottom':
            newLeft = rect.left + 'px';
            newTop = (window.innerHeight - iconHeight - margin) + 'px';
            break;
        }
        element.style.left = newLeft;
        element.style.top = newTop;
        element.style.right = 'auto';
        element.style.bottom = 'auto';
        // 保存精确位置
        const finalRect = element.getBoundingClientRect();
        iconPos = {left: finalRect.left, top: finalRect.top};
        saveConfig();
      }
    }, {passive: true});
  }

  // 只为小图标添加拖动支持
  addDragSupport(iconBtn);

})();
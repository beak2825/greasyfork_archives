// ==UserScript==
// @name         双指缩放网页（修复版）
// @namespace    https://greasyfork.cc/
// @version      20251103
// @description  手机浏览器双指缩放网页，修复原版问题
// @author       Fixed Version
// @license      MIT
// @run-at       document-start
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/554775/%E5%8F%8C%E6%8C%87%E7%BC%A9%E6%94%BE%E7%BD%91%E9%A1%B5%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554775/%E5%8F%8C%E6%8C%87%E7%BC%A9%E6%94%BE%E7%BD%91%E9%A1%B5%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  const host = location.hostname;
  const minScale = 0.3, maxScale = 5;
  let scale = Number(GM_getValue(`${host}_zoom`, 1)) || 1;
  let startDist = 0, startScale = scale;
  let isScaling = false;

  // 立即设置viewport防止页面跳动
  let metaViewport = document.querySelector('meta[name="viewport"]');
  if (!metaViewport) {
    metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    document.head.appendChild(metaViewport);
  }
  
  // 保存原始viewport内容
  const originalViewport = metaViewport.content;
  metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

  // 添加CSS样式
  GM_addStyle(`
    body {
      transform-origin: 0 0;
      overflow-x: hidden !important;
    }
    img, video, canvas {
      max-width: 100% !important;
      height: auto !important;
    }
  `);

  // 等待DOM加载完成
  function initZoom() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyZoom);
    } else {
      applyZoom();
    }
  }

  function applyZoom() {
    if (scale !== 1) {
      document.body.style.transform = `scale(${scale})`;
      document.body.style.width = `${100 / scale}%`;
      document.body.style.height = `${100 / scale}%`;
    }
  }

  // 双指触摸事件
  document.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      isScaling = true;
      startDist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      startScale = scale;
      
      // 临时允许默认行为防止页面滚动
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchmove', function(e) {
    if (!isScaling || e.touches.length !== 2) return;
    
    e.preventDefault();
    
    const newDist = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    
    if (startDist > 0) {
      let newScale = startScale * (newDist / startDist);
      newScale = Math.min(maxScale, Math.max(minScale, newScale));
      
      if (Math.abs(newScale - scale) > 0.01) {
        scale = newScale;
        document.body.style.transform = `scale(${scale})`;
        document.body.style.width = `${100 / scale}%`;
        document.body.style.height = `${100 / scale}%`;
      }
    }
  }, { passive: false });

  document.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
      isScaling = false;
    }
  }, { passive: true });

  // 菜单功能
  GM_registerMenuCommand('设置缩放比', () => {
    const val = parseFloat(prompt('请输入缩放比（0.3~5）', scale.toFixed(2)));
    if (!isNaN(val) && val >= minScale && val <= maxScale) {
      scale = val;
      applyZoom();
    }
  });
  
  GM_registerMenuCommand('记住当前缩放比', () => {
    GM_setValue(`${host}_zoom`, scale);
    alert(`已记住缩放比: ${scale.toFixed(2)}`);
  });
  
  GM_registerMenuCommand('重置缩放比', () => {
    scale = 1;
    applyZoom();
    GM_deleteValue(`${host}_zoom`);
    alert('缩放比已重置');
  });

  // 初始化
  initZoom();
})();
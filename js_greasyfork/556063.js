// ==UserScript==
// @name         豆包去水印
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  通过hook掉JSON.parse实现豆包AI生图下载原图去水印!
// @author       核心脚本作者: https://github.com/LauZzL/doubao-downloader  |  二次开发：小张 | 个人博客：https://blog.z-l.top | 公众号“爱吃馍” | 设计导航站 ：https://dh.z-l.top | quicker账号昵称：星河城野❤
// @license      GPL-3.0
// @match        https://www.doubao.com/*
// @icon         https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/chat/static/image/logo-icon-white-bg.72df0b1a.png
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556063/%E8%B1%86%E5%8C%85%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/556063/%E8%B1%86%E5%8C%85%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function findAllKeysInJson(obj, key) {
    const results = [];
    function search(current) {
      if (current && typeof current === 'object') {
        if (!Array.isArray(current) && Object.prototype.hasOwnProperty.call(current, key)) {
          results.push(current[key]);
        }
        const items = Array.isArray(current) ? current : Object.values(current);
        for (const item of items) {
          search(item);
        }
      }
    }
    search(obj);
    return results;
  }

  let _parse = JSON.parse;
  JSON.parse = function (data) {
    let jsonData = _parse(data);
    if (!data.match('creations')) return jsonData;
    let creations = findAllKeysInJson(jsonData, 'creations');
    if (creations.length > 0) {
      creations.forEach((creaetion) => {
        creaetion.map((item) => {
          // 原始图片url
          const rawUrl = item.image.image_ori_raw.url;
          // 下载原图时的去水印选项. 绑定到 下载去水印复选框
          // 根据设置决定是否替换URL
          const downloadEnabled = typeof GM_getValue !== 'undefined' ? GM_getValue('download-watermark', true) : true;
          const largeEnabled = typeof GM_getValue !== 'undefined' ? GM_getValue('large-watermark', true) : true;
          const previewEnabled = typeof GM_getValue !== 'undefined' ? GM_getValue('preview-watermark', true) : true;

          // 应用去水印设置到图片URL
          applyWatermarkSettings(item.image, rawUrl);
          return item;
        });
      })
    }
    return jsonData;
  }
  // 注册菜单命令打开设置界面
  GM_registerMenuCommand('设置首选项', function () {
    // 触发设置按钮点击事件以显示模态框
    document.querySelector('#watermark-settings-button').click();
  });

  // 创建设置按钮
  function createSettingsButton() {
    GM_addStyle(`
  .settings-btn {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9999;
    padding: 0;
    background: #0057ff0f;
    border: 1px solid #0057ff26;
    border-radius: 26px 0 0 26px;
    cursor: move;
    transition: all 0.3s ease;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .settings-btn img {
    width: 32px;
    height: 32px;
    object-contain;
    pointer-events: none; /* 确保图片不阻止拖拽事件 */
  }
`);

    const button = document.createElement('button');
    button.id = 'watermark-settings-button';
    button.className = 'settings-btn';
    button.innerHTML = '<img src="https://lf-flow-web-cdn.doubao.com/obj/flow-doubao/doubao/chat/static/image/logo-icon-white-bg.72df0b1a.png" alt="设置">';
    let isDragging = false;
    let offsetX, offsetY;

    let longPressTimer;
    const LONG_PRESS_DELAY = 100; // 缩短长按时间，提高拖拽灵敏度

    button.addEventListener('mousedown', (e) => {
      // 阻止事件冒泡，确保整个按钮区域都能触发拖拽
      e.stopPropagation();
      const rect = button.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      isDragging = false;
      button.style.transition = 'none';

      // 启动长按定时器
      longPressTimer = setTimeout(() => {
        // 只有长按后才允许拖拽
        isDragging = true;
        button.style.cursor = 'grabbing';
      }, LONG_PRESS_DELAY);
    });

    document.addEventListener('mousemove', (e) => {
      // 只有长按定时器触发后才允许拖拽
      if (!isDragging) return;

      // 放宽鼠标范围检查，提高拖拽容错性
      const rect = button.getBoundingClientRect();
      // 扩大检测范围10px
      if (e.clientX < rect.left - 10 || e.clientX > rect.right + 10 || e.clientY < rect.top - 10 || e.clientY > rect.bottom + 10) {
        isDragging = false;
        return;
      }

      if (isDragging) {
        // 检查鼠标是否仍在按钮范围内
        const rect = button.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
          isDragging = false;
          return;
        }

        e.preventDefault();

        const newTop = e.clientY - offsetY;
        const windowHeight = window.innerHeight;
        const buttonHeight = button.offsetHeight;
        const maxTop = windowHeight - buttonHeight;
        const constrainedTop = Math.max(0, Math.min(newTop, maxTop));

        button.style.top = `${constrainedTop}px`;
        button.style.transform = 'translateY(0)';
      }
    });

    document.addEventListener('mouseup', () => {
      // 清除长按定时器
      clearTimeout(longPressTimer);
      isDragging = false;
      button.style.transition = 'all 0.3s ease';
      button.style.cursor = 'move';
    });

    button.addEventListener('mouseleave', () => {
      // 清除长按定时器
      clearTimeout(longPressTimer);
      isDragging = false;
      button.style.transition = 'all 0.3s ease';
      button.style.cursor = 'move';
    });

    button.addEventListener('click', (e) => {
      // 如果是拖拽状态，完全阻止点击事件
      if (isDragging) {
        isDragging = false;
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      // 创建外部页面弹窗容器，类似花瓣去水印脚本的弹窗方式
      const popupContainer = document.createElement('div');
      popupContainer.id = 'settings-popup';
      popupContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
    backdrop-filter: blur(5px);
      `;

      // 创建弹窗内容容器
      const popupContent = document.createElement('div');
      popupContent.style.cssText = `
        width: 583px;
        height: 631px;
        background: white;
        border-radius: 28px;
        overflow: hidden;
        position: relative;
      `;

      // 创建关闭按钮
      const closeButton = document.createElement('button');
      closeButton.textContent = '×';
      closeButton.style.cssText = `
        position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(0, 0, 0, 0.2);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 22px;
    cursor: pointer;
    display: flex
;
    align-items: center;
    justify-content: center;
        z-index: 10;
      `;

      // 创建iframe加载外部设置页面
      const settingsIframe = document.createElement('iframe');
      // 恢复为本地服务器URL，确保本地服务器已启动
      // 使用GitHub Pages上的设置界面URL，提高可访问性
      settingsIframe.src = 'https://xiaolongmr.github.io/tampermonkey-scripts/%E8%B1%86%E5%8C%85%E5%8E%BB%E6%B0%B4%E5%8D%B0/svg%20to%20html/%E8%AE%BE%E7%BD%AE%E9%A6%96%E9%80%89%E9%A1%B9.html';
      // 添加错误处理
      settingsIframe.onerror = function () {
        alert('设置页面加载失败，请确保本地服务器已启动且文件路径正确');
        closePopup();
      };
      settingsIframe.onload = function () {
        console.log('设置页面加载成功');
        // 发送当前设置状态到iframe
        const currentSettings = {
          'download-watermark': GM_getValue('download-watermark', true),
          'large-watermark': GM_getValue('large-watermark', true),
          'preview-watermark': GM_getValue('preview-watermark', true)
        };
        try {
          settingsIframe.contentWindow.postMessage({
            type: 'INITIAL_SETTINGS',
            settings: currentSettings
          }, 'https://xiaolongmr.github.io');
        } catch (e) {
          console.error('Failed to send initial settings:', e);
        }
      };
      settingsIframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
      `;

      // 组装弹窗
      popupContent.appendChild(closeButton);
      popupContent.appendChild(settingsIframe);
      popupContainer.appendChild(popupContent);
      document.body.appendChild(popupContainer);

      // 关闭弹窗功能
      const closePopup = () => popupContainer.remove();
      closeButton.addEventListener('click', closePopup);
      popupContainer.addEventListener('click', (e) => {
        if (e.target === popupContainer) closePopup();
      });
    });
    document.body.appendChild(button);
  }

  // 应用去水印设置到图片对象
  function applyWatermarkSettings(imageObj, rawUrl) {
    const downloadEnabled = GM_getValue('download-watermark', true);
    const largeEnabled = GM_getValue('large-watermark', true);
    const previewEnabled = GM_getValue('preview-watermark', true);

    if (downloadEnabled) imageObj.image_ori.url = rawUrl;
    if (largeEnabled) imageObj.image_preview.url = rawUrl;
    if (previewEnabled) imageObj.image_thumb.url = rawUrl;
  }

  // 实时更新页面上的图片URL
  function updatePageImages() {
    // 获取当前设置
    const downloadEnabled = GM_getValue('download-watermark', true);
    const largeEnabled = GM_getValue('large-watermark', true);
    const previewEnabled = GM_getValue('preview-watermark', true);

    // 查找所有可能的图片元素并更新
    document.querySelectorAll('img[src*="image_ori"], img[src*="image_preview"], img[src*="image_thumb"]').forEach(img => {
      // 提取原始URL（移除水印参数）
      const rawUrl = img.src.split('?')[0];

      // 根据图片类型应用对应设置
      if (img.src.includes('image_ori') && downloadEnabled) {
        img.src = rawUrl;
      } else if (img.src.includes('image_preview') && largeEnabled) {
        img.src = rawUrl;
      } else if (img.src.includes('image_thumb') && previewEnabled) {
        img.src = rawUrl;
      }
    });
  }

  function saveSetting(id, checked) {
    GM_setValue(id, checked);
    localStorage.setItem(`watermark-${id}`, JSON.stringify(checked));

    // 通知iframe更新设置
    const iframe = document.getElementById('settings-iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage({ type: 'SETTING_UPDATED', id, checked }, 'https://xiaolongmr.github.io');
      } catch (e) {
        console.error('Failed to send setting update:', e);
      }
    }

    // 设置更改后立即更新页面图片
    updatePageImages();
  }

  // 在页面加载完成后创建按钮
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSettingsButton);
  } else {
    createSettingsButton();
  }

  // 添加跨域消息通信
  // 支持GitHub Pages域名的跨域消息通信
  window.addEventListener('message', function (e) {
    // 允许来自GitHub Pages和本地服务器的消息，便于开发和生产环境切换
    if (e.origin !== 'https://xiaolongmr.github.io' && e.origin !== 'http://127.0.0.1:5501') return;

    if (e.data.type === 'SETTING_CHANGED') {
      const { id, checked } = e.data;
      saveSetting(id, checked);
    }
  });

})();
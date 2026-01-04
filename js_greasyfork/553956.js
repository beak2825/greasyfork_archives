// ==UserScript==
// @name         Sora2 去水印自动下载助手（新数据格式适配版+下载提示）
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  在 Sora2 视频详情页添加"去水印下载"按钮，适配新数据格式，直接解析页面数据获取MP4链接，添加下载状态提示
// @author       ChatGPT
// @match        https://sora.chatgpt.com/*
// @grant        GM_download
// @grant        GM_notification
// @connect      sora3.wanwuhuanxin.cn
// @connect      api.dyysy.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553956/Sora2%20%E5%8E%BB%E6%B0%B4%E5%8D%B0%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E6%96%B0%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F%E9%80%82%E9%85%8D%E7%89%88%2B%E4%B8%8B%E8%BD%BD%E6%8F%90%E7%A4%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553956/Sora2%20%E5%8E%BB%E6%B0%B4%E5%8D%B0%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BC%88%E6%96%B0%E6%95%B0%E6%8D%AE%E6%A0%BC%E5%BC%8F%E9%80%82%E9%85%8D%E7%89%88%2B%E4%B8%8B%E8%BD%BD%E6%8F%90%E7%A4%BA%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('[Sora2 去水印助手] 新数据格式适配版已启动。');

  // 创建提示样式
  function createNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .sora-download-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 300px;
        word-wrap: break-word;
        transition: all 0.3s ease;
        transform: translateX(400px);
        opacity: 0;
      }
      .sora-download-notification.show {
        transform: translateX(0);
        opacity: 1;
      }
      .sora-download-notification.hide {
        transform: translateX(400px);
        opacity: 0;
      }
      .sora-download-notification.success {
        background: linear-gradient(135deg, #10b981, #059669);
        border-left: 4px solid #047857;
      }
      .sora-download-notification.info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        border-left: 4px solid #1d4ed8;
      }
      .sora-download-notification.warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        border-left: 4px solid #b45309;
      }
      .sora-download-notification.error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border-left: 4px solid #b91c1c;
      }
      .sora-download-notification .notification-title {
        font-weight: 600;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sora-download-notification .notification-message {
        font-size: 13px;
        opacity: 0.9;
      }
      .sora-download-notification .notification-progress {
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        margin-top: 8px;
        overflow: hidden;
      }
      .sora-download-notification .notification-progress-bar {
        height: 100%;
        background: white;
        border-radius: 2px;
        transition: width 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }

  // 显示通知
  function showNotification(type, title, message, duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `sora-download-notification ${type}`;

    const icon = getNotificationIcon(type);

    notification.innerHTML = `
      <div class="notification-title">
        ${icon}${title}
      </div>
      <div class="notification-message">${message}</div>
      <div class="notification-progress">
        <div class="notification-progress-bar" style="width: 100%"></div>
      </div>
    `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // 进度条动画
    setTimeout(() => {
      const progressBar = notification.querySelector('.notification-progress-bar');
      if (progressBar) {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '0%';
      }
    }, 100);

    // 自动隐藏
    setTimeout(() => {
      notification.classList.remove('show');
      notification.classList.add('hide');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);

    return notification;
  }

  // 获取通知图标
  function getNotificationIcon(type) {
    const icons = {
      success: '✅',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || '💡';
  }

  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // 生成文件名 - 适配新数据格式
  function generateFilename(data) {
    try {
      if (data.post_info && data.post_info.title) {
        let titleInfo;
        // 解析title字段（现在是JSON字符串）
        if (typeof data.post_info.title === 'string') {
          try {
            titleInfo = JSON.parse(data.post_info.title);
          } catch (e) {
            // 如果不是JSON，直接使用字符串
            return data.post_info.title.replace(/[\\\/:*?"<>|]/g, '').substring(0, 100);
          }
        } else {
          titleInfo = data.post_info.title;
        }

        // 从新数据格式中生成有意义的文件名
        if (titleInfo.scene_description) {
          return titleInfo.scene_description.replace(/[\\\/:*?"<>|]/g, '').substring(0, 100);
        } else if (titleInfo.prompt_cn) {
          return titleInfo.prompt_cn.replace(/[\\\/:*?"<>|]/g, '').substring(0, 100);
        } else if (titleInfo.prompt_en) {
          return titleInfo.prompt_en.replace(/[\\\/:*?"<>|]/g, '').substring(0, 100);
        }
      }

      // 备用方案：使用post_id
      return `sora_video_${data.post_id || Date.now()}`;
    } catch (error) {
      console.error('[Sora2 去水印助手] 生成文件名时出错:', error);
      return `sora_video_${Date.now()}`;
    }
  }

  // 添加"去水印下载"按钮
  function addNoWatermarkButton() {
    if (!window.location.href.includes('/p/')) return;

    const downloadButtonText = 'Download';
    const buttons = document.querySelectorAll('[role="menuitem"]');

    buttons.forEach(buttonElement => {
      if (buttonElement.textContent.trim() === downloadButtonText) {
        const parent = buttonElement.parentNode;
        if (!parent || parent.querySelector('.sora-helper-no-watermark-btn')) return;

        console.log('[Sora2 去水印助手] 找到 Download 按钮，准备添加新按钮...');

        const newButton = document.createElement('div');
        newButton.className = buttonElement.className + ' sora-helper-no-watermark-btn';
        newButton.setAttribute('role', 'menuitem');
        newButton.innerHTML = buttonElement.innerHTML.replace(downloadButtonText, '去水印下载');
        newButton.style.cursor = 'pointer';

        // 点击逻辑 - 保持原有请求方式，只更新数据解析
        newButton.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const videoUrl = window.location.href;
          const apiUrl = `https://api.dyysy.com/links1106/${encodeURIComponent(videoUrl)}`;

          console.log(`[Sora2 去水印助手] 请求接口: ${apiUrl}`);

          // 显示开始下载提示
          const startNotification = showNotification(
            'info',
            '开始下载',
            '正在解析视频链接，请稍候...',
            3000
          );

          try {
            const resp = await fetch(apiUrl);
            const data = await resp.json();

            console.log('[Sora2 去水印助手] API返回数据:', data);

            // 适配新数据格式
            if (data && data.links && data.links.mp4) {
              const mp4Url = data.links.mp4;
              const title = generateFilename(data);

              console.log(`[Sora2 去水印助手] ✅ 无水印视频地址: ${mp4Url}`);
              console.log(`[Sora2 去水印助手] 开始自动下载: ${title}.mp4`);

              // 显示下载中提示
              showNotification(
                'info',
                '下载中',
                `文件: ${title}.mp4<br>视频已开始下载，请查看浏览器下载列表`,
                5000
              );

              // 检测 GM_download 是否可用
              if (typeof GM_download === 'function') {
                try {
                  GM_download({
                    url: mp4Url,
                    name: `${title}.mp4`,
                    saveAs: false,
                    onerror: (err) => {
                      console.warn('[Sora2 去水印助手] GM_download 失败，自动切换到 a.href 模式:', err);
                      showNotification(
                        'warning',
                        '下载方式切换',
                        '使用备用下载方式，请确认下载',
                        3000
                      );
                      fallbackDownload(mp4Url, title);
                    },
                    ontimeout: () => {
                      showNotification(
                        'error',
                        '下载超时',
                        '下载超时，请稍后重试',
                        4000
                      );
                    },
                    onload: () => {
                      console.log('[Sora2 去水印助手] ✅ 下载完成。');
                      showNotification(
                        'success',
                        '下载完成',
                        `文件: ${title}.mp4<br>视频已成功下载到默认下载文件夹`,
                        5000
                      );
                    }
                  });
                } catch (err) {
                  console.error('[Sora2 去水印助手] GM_download 出错:', err);
                  showNotification(
                    'warning',
                    '下载方式切换',
                    '使用备用下载方式，请确认下载',
                    3000
                  );
                  fallbackDownload(mp4Url, title);
                }
              } else {
                showNotification(
                  'info',
                  '开始下载',
                  '使用浏览器默认下载，请确认下载对话框',
                  3000
                );
                fallbackDownload(mp4Url, title);
              }
            } else {
              showNotification(
                'error',
                '解析失败',
                '未找到无水印视频链接，请稍后重试',
                4000
              );
              console.error('[Sora2 去水印助手] 数据格式异常:', data);
            }
          } catch (err) {
            console.error('[Sora2 去水印助手] 请求失败:', err);
            showNotification(
              'error',
              '请求失败',
              '解析失败，请检查网络或接口是否可用',
              4000
            );
          }
        });

        parent.insertBefore(newButton, buttonElement.nextSibling);
        console.log('[Sora2 去水印助手] "去水印下载"按钮已成功添加。');
      }
    });
  }

  // 备用下载方式（兼容所有浏览器）
  function fallbackDownload(url, title) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log('[Sora2 去水印助手] ✅ 使用 fallback 下载完成。');

    // 对于fallback下载，我们无法准确知道何时完成，所以显示一个提示
    setTimeout(() => {
      showNotification(
        'success',
        '下载已开始',
        `文件: ${title}.mp4<br>请查看浏览器下载列表`,
        4000
      );
    }, 1000);
  }

  // 监听 DOM 变化（单页应用）
  const observer = new MutationObserver(debounce(addNoWatermarkButton, 500));
  observer.observe(document.body, { childList: true, subtree: true });

  // 初始化样式和功能
  createNotificationStyles();

  // 初次执行
  addNoWatermarkButton();
})();

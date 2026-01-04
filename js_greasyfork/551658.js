// ==UserScript==
// @name         智慧树下载器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在学习页左下角添加下载按钮，能自动识别并下载PPT、视频、PDF等多种类型的课件。
// @author       GPT-5 & Gemini-2.5-Pro
// @match        *://ai-smart-course-student-pro.zhihuishu.com/learnPage/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551658/%E6%99%BA%E6%85%A7%E6%A0%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551658/%E6%99%BA%E6%85%A7%E6%A0%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * 显示一个短暂的提示消息 (Toast)
   * @param {string} msg - 要显示的消息内容
   * @param {boolean} isError - 是否为错误消息，错误消息背景为红色
   */
  function showToast(msg, isError = false) {
    let toast = document.getElementById('__tamper_download_toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = '__tamper_download_toast';
      Object.assign(toast.style, {
        position: 'fixed',
        left: '50%',
        bottom: '80px',
        transform: 'translateX(-50%)',
        padding: '8px 12px',
        borderRadius: '6px',
        color: 'white',
        fontSize: '13px',
        zIndex: 999999,
        background: 'rgba(0,0,0,0.8)',
        transition: 'opacity 0.3s',
      });
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = isError ? 'rgba(200,50,50,0.9)' : 'rgba(40,40,40,0.9)';
    toast.style.opacity = 1;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => (toast.style.opacity = 0), 2500);
  }

  /**
   * 创建并显示下载按钮
   */
  function createButton() {
    // 如果按钮已存在，则不再创建
    if (document.getElementById('__tamper_download_btn')) return;

    const btn = document.createElement('button');
    btn.id = '__tamper_download_btn';
    btn.textContent = '下载课件';
    Object.assign(btn.style, {
      position: 'fixed',
      left: '16px',
      bottom: '16px',
      padding: '10px 14px',
      fontSize: '14px',
      color: '#fff',
      background: '#1a73e8',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
      zIndex: 999999,
    });
    btn.addEventListener('click', onDownloadClick);
    document.body.appendChild(btn);
  }

  /**
   * 处理下载按钮的点击事件
   */
  function onDownloadClick() {
    // 使用更通用的 CSS 选择器来定位课件预览的容器
    const previewContainer = document.querySelector('.diagram-preview');
    if (!previewContainer) {
      showToast('未找到课件预览区域', true);
      return;
    }

    // 在容器内查找课件资源元素 (可能是图片、视频等)
    const resourceElement = previewContainer.querySelector('.diagram-image');
    const resourceSrc = resourceElement ? resourceElement.getAttribute('src') : null;

    if (!resourceSrc) {
      showToast('未找到课件下载链接', true);
      return;
    }

    // 在容器内查找课件名称元素
    const filenameElement = previewContainer.querySelector('.diagram-chapter-name');
    let filename = (filenameElement ? filenameElement.textContent.trim() : null) || '未知课件';

    // 清理文件名中的非法字符，替换为下划线
    filename = filename.replace(/[\\/:*?"<>|]+/g, '_');

    // 将相对URL转换为绝对URL
    const url = new URL(resourceSrc, location.href).href;

    showToast('正在准备下载：' + filename);

    // 创建一个隐藏的 <a> 标签来触发浏览器下载
    // 这种方法可以自动携带当前域的 Cookie 和 Referer，解决权限问题
    const a = document.createElement('a');
    a.href = url;
    a.download = filename; // 设置下载的文件名
    document.body.appendChild(a);
    a.click(); // 模拟点击
    a.remove(); // 点击后立即移除

    showToast('下载已开始：' + filename);
  }

  // 确保在 DOM 加载完成后再创建按钮
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }
})();
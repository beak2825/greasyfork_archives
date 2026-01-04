// ==UserScript==
// @name         Telegraph 批量插入图床图片
// @namespace    https://telegra.ph/batch-insert-images
// @version      1.2
// @description  支持快速批量插入图床URL为图片到Telegraph编辑器
// @match        https://telegra.ph/*
// @match        https://edit.telegra.ph/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551744/Telegraph%20%E6%89%B9%E9%87%8F%E6%8F%92%E5%85%A5%E5%9B%BE%E5%BA%8A%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/551744/Telegraph%20%E6%89%B9%E9%87%8F%E6%8F%92%E5%85%A5%E5%9B%BE%E5%BA%8A%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let batchButton = null;

    // 检查是否在编辑模式
    function isEditMode() {
        // 方法1: 检查文章容器是否有编辑类
        const article = document.querySelector('.tl_article');
        if (article && article.classList.contains('tl_article_edit')) {
            return true;
        }

        // 方法2: 检查编辑器是否可编辑
        const editor = document.querySelector('.ql-editor');
        if (editor && editor.getAttribute('contenteditable') === 'true') {
            return true;
        }

        // 方法3: 检查Quill实例是否启用
        if (window.quill && window.quill.isEnabled && window.quill.isEnabled()) {
            return true;
        }

        return false;
    }

    // 创建批量插入按钮
    function createBatchInsertButton() {
        if (batchButton) return; // 避免重复创建

        batchButton = document.createElement('button');
        batchButton.textContent = '批量插入图片';
        batchButton.style.cssText = `
              position: fixed;
              top: 10px;
              right: 10px;
              z-index: 10000;
              padding: 10px 20px;
              background: #4CAF50;
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 14px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          `;
          batchButton.addEventListener('click', showImageDialog);
          document.body.appendChild(batchButton);
      }

      // 移除按钮
      function removeButton() {
          if (batchButton) {
              batchButton.remove();
              batchButton = null;
          }
      }

      // 检查并更新按钮显示状态
      function updateButtonVisibility() {
          if (isEditMode()) {
              if (!batchButton) {
                  createBatchInsertButton();
              }
          } else {
              removeButton();
          }
      }

      // 显示输入对话框
      function showImageDialog() {
          const dialog = document.createElement('div');
          dialog.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
              z-index: 10001;
              min-width: 500px;
          `;

          dialog.innerHTML = `
              <h3 style="margin-top: 0;">批量插入图片URL</h3>
              <textarea id="imageUrls"
  placeholder="每行一个图片URL，支持以下格式：&#10;https://example.com/image.jpg&#10;https://example.com/image.png"
                  style="width: 100%; height: 200px; padding: 10px; box-sizing: border-box; font-family:
  monospace;"></textarea>
              <div style="margin-top: 10px;">
                  <button id="insertBtn" style="padding: 8px 16px; background: #2196F3; color: white; border: none;
  border-radius: 4px; cursor: pointer; margin-right: 10px;">插入</button>
                  <button id="cancelBtn" style="padding: 8px 16px; background: #f44336; color: white; border: none;
  border-radius: 4px; cursor: pointer;">取消</button>
              </div>
          `;

          // 遮罩层
          const overlay = document.createElement('div');
          overlay.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0,0,0,0.5);
              z-index: 10000;
          `;

          document.body.appendChild(overlay);
          document.body.appendChild(dialog);

          // 绑定事件
          document.getElementById('insertBtn').addEventListener('click', () => {
              const urls = document.getElementById('imageUrls').value.trim().split('\n').filter(url => url.trim());
              insertImages(urls);
              cleanup();
          });

          document.getElementById('cancelBtn').addEventListener('click', cleanup);
          overlay.addEventListener('click', cleanup);

          function cleanup() {
              dialog.remove();
              overlay.remove();
          }
      }

      // 插入图片到编辑器
      function insertImages(urls) {
          if (!window.quill) {
              alert('未找到编辑器实例，请确保在编辑页面使用');
              return;
          }

          const selection = window.quill.getSelection(true);
          let index = selection ? selection.index : window.quill.getLength();

          urls.forEach((url, i) => {
              url = url.trim();
              if (!url) return;

              // 验证URL格式
              if (!url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|bmp)$/i) &&
                  !url.match(/^data:image\//)) {
                  console.warn('跳过无效图片URL:', url);
                  return;
              }

              // Telegraph使用blockFigure格式插入图片
              const Delta = window.Quill.import('delta');
              const delta = new Delta()
              .retain(index)
              .insert({
                  blockFigure: {
                      image: url,
                      caption: ''
                  }
              });

              window.quill.updateContents(delta, 'user');

              // 更新索引（blockFigure占1个字符）
              index++;
          });

          // 在最后插入一个换行符，方便继续编辑
          window.quill.insertText(index, '\n', 'user');
          window.quill.setSelection(index + 1, 0, 'user');

          const successCount = urls.filter(u => u.trim()).length;
          alert(`成功插入 ${successCount} 张图片`);
      }

      // 监听编辑状态变化
      function observeEditMode() {
          // 监听class变化
          const article = document.querySelector('.tl_article');
          if (article) {
              const observer = new MutationObserver(() => {
                  updateButtonVisibility();
              });

              observer.observe(article, {
                  attributes: true,
                  attributeFilter: ['class']
              });
          }

          // 监听编辑按钮点击
          const editButton = document.querySelector('#_edit_button');
          if (editButton) {
              editButton.addEventListener('click', () => {
                  setTimeout(updateButtonVisibility, 300);
              });
          }

          // 监听发布按钮点击
          const publishButton = document.querySelector('#_publish_button');
          if (publishButton) {
              publishButton.addEventListener('click', () => {
                  setTimeout(updateButtonVisibility, 300);
              });
          }
      }

      // 等待Quill加载完成
      function waitForQuill() {
          if (window.quill && window.Quill) {
              updateButtonVisibility();
              observeEditMode();

              // 定期检查编辑状态（备用方案）
              setInterval(updateButtonVisibility, 1000);
          } else {
              setTimeout(waitForQuill, 500);
          }
      }

      // 页面加载完成后等待Quill
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', waitForQuill);
      } else {
          waitForQuill();
      }
  })();
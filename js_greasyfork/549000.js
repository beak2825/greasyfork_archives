// ==UserScript==
// @name         网页里面复制内容
// @namespace    https://leochan.me
// @version      1.0.0
// @description  网页一个简单的复制能力
// @author       Leo
// @license      GPLv2
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @grant        none
// ==/UserScript==


/**
 * 使用 Promise 将文本复制到剪贴板（兼容新旧浏览器）
 * @param {string} text - 要复制到剪贴板的文本
 * @returns {Promise<boolean>} - 复制成功解析为 true，失败解析为 false
 */
function webPageCopyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (typeof text !== 'string') {
      reject(new Error('参数必须为字符串'));
      return;
    }

    // 方案1: 优先尝试使用现代的 Clipboard API [1,3,5](@ref)
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('文本已成功复制到剪贴板 (使用Clipboard API)');
          resolve(true);
        })
        .catch(err => {
          console.error('Clipboard API 复制失败:', err);
          // 继续尝试方案2
          webPageFallbackCopy(text, resolve, reject);
        });
    } else {
      // 直接使用回退方案
      webPageFallbackCopy(text, resolve, reject);
    }
  });
}

/**
 * 回退方案 - 使用传统的 document.execCommand 方法 [1,4](@ref)
 * @param {string} text - 要复制的文本
 * @param {Function} resolve - Promise 的 resolve 回调
 * @param {Function} reject - Promise 的 reject 回调
 */
function webPageFallbackCopy(text, resolve, reject) {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    
    // 避免在iOS上打开键盘 [2](@ref)
    textArea.readOnly = true;
    textArea.contentEditable = 'true';

    document.body.appendChild(textArea);
    
    // 选中文本 [1,4](@ref)
    textArea.focus();
    textArea.select();
    
    // 对于移动设备iOS的特殊处理 [2](@ref)
    if (textArea.setSelectionRange) {
      const length = textArea.value.length;
      textArea.setSelectionRange(0, length);
    }

    // 执行复制命令 [1,4](@ref)
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (successful) {
      console.log('文本已成功复制到剪贴板 (使用document.execCommand)');
      resolve(true);
    } else {
      console.error('使用document.execCommand复制失败');
      reject(new Error('无法复制文本'));
    }
  } catch (err) {
    console.error('无法使用传统方法复制文本: ', err);
    reject(new Error('复制操作失败'));
  }
}
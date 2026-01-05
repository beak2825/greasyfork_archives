// ==UserScript==
// @name         夸克网盘复制增强版
// @namespace    http://tampermonkey.net/
// @version      2024-07-08
// @description  为夸克网盘文件和目录添加复制按钮(增强版)
// @author       CunShao
// @match        https://pan.quark.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quark.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558975/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%A4%8D%E5%88%B6%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/558975/%E5%A4%B8%E5%85%8B%E7%BD%91%E7%9B%98%E5%A4%8D%E5%88%B6%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 配置选项
  const config = {
    checkInterval: 1000,     // 轮询检查间隔(毫秒)
    maxRetries: 10,          // 最大重试次数
    initialDelay: 1500,      // 初始延迟(毫秒)
    observerDebounce: 200,   // 防抖时间(毫秒)
  };

  // 可能的文件名选择器列表
  const possibleSelectors = [
    '.filename',
    '.file-name',
    '.file-title',
    '.name-text',
    '.list-view-item-name',
    '[title][class*="name"]',
    '[class*="fileName"]',
    '[class*="file-name"]'
  ];

  // 防抖函数
  const debounce = (func, delay) => {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // 添加样式
  const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .qk-copy-button {
        margin-left: 8px;
        display: inline-block;
        font-size: 12px;
        padding: 0 6px;
        background-color: #4A90E2;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 400;
        line-height: 20px;
        height: 20px;
        transition: background-color 0.3s;
        position: relative;
        z-index: 100;
      }

      .qk-copy-button:hover {
        background-color: #357ABD;
      }

      .qk-copy-alert {
        position: fixed;
        bottom: 10px;
        right: 10px;
        background-color: #28a745;
        color: #fff;
        padding: 10px;
        border-radius: 4px;
        z-index: 10000;
        animation: fadeInOut 3s forwards;
      }

      @keyframes fadeInOut {
        0% { opacity: 0; }
        10% { opacity: 1; }
        80% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  };

  // 显示复制成功提示
  const showCopyAlert = (message) => {
    const existingAlert = document.querySelector('.qk-copy-alert');
    if (existingAlert) {
      existingAlert.remove();
    }

    const alertBox = document.createElement('div');
    alertBox.innerText = message || '文字已复制到剪贴板!';
    alertBox.className = 'qk-copy-alert';
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 3000);
  };

  // 提取文件名文本
  const extractFilename = (element) => {
    // 创建一个临时的元素克隆
    const tempElement = element.cloneNode(true);

    // 移除其中的按钮元素
    const buttons = tempElement.querySelectorAll('button');
    buttons.forEach(btn => btn.remove());

    // 获取纯文本
    return tempElement.innerText.trim();
  };

  // 添加复制按钮到文件名元素
  const addCopyButton = (element) => {
    // 检查元素是否已有我们添加的复制按钮
    if (element.querySelector('.qk-copy-button')) {
      return;
    }

    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.innerText = '复制';
    copyButton.className = 'qk-copy-button';

    // 按钮点击事件
    copyButton.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();

      const filenameText = extractFilename(element);

      navigator.clipboard.writeText(filenameText)
        .then(() => showCopyAlert())
        .catch(err => {
          console.error('无法复制文字: ', err);
          showCopyAlert('复制失败，请重试!');
        });
    });

    // 添加按钮，使用不同的添加方式避免破坏原有布局
    try {
      if (window.getComputedStyle(element).display === 'flex') {
        element.appendChild(copyButton);
      } else {
        // 创建一个容器来保持原有布局
        const container = document.createElement('span');
        container.style.display = 'inline-flex';
        container.style.alignItems = 'center';

        // 将原内容移到容器中
        while (element.firstChild) {
          container.appendChild(element.firstChild);
        }

        // 添加按钮和容器
        container.appendChild(copyButton);
        element.appendChild(container);
      }
    } catch (e) {
      // 简单添加方式作为后备
      element.appendChild(copyButton);
    }
  };

  // 查找并处理所有文件名元素
  const processFileElements = () => {
    let found = false;

    // 先隐藏原生的复制按钮
    const nativeCopyButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
      btn.innerText === '复制' && !btn.classList.contains('qk-copy-button')
    );

    nativeCopyButtons.forEach(btn => {
      btn.style.display = 'none';
    });

    // 尝试所有可能的选择器
    for (const selector of possibleSelectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        found = true;
        elements.forEach(addCopyButton);
      }
    }

    return found;
  };

  // 初始化处理函数
  const init = () => {
    console.log('夸克网盘复制增强版启动...');
    addStyles();

    // 尝试初始化处理
    setTimeout(() => {
      let retries = 0;

      const attemptProcess = () => {
        const found = processFileElements();

        if (!found && retries < config.maxRetries) {
          retries++;
          setTimeout(attemptProcess, config.checkInterval);
          console.log(`未找到文件元素，${config.checkInterval}ms后重试(${retries}/${config.maxRetries})`);
        }
      };

      attemptProcess();

      // 设置MutationObserver以监视DOM变化
      const debouncedProcess = debounce(processFileElements, config.observerDebounce);

      const observer = new MutationObserver((mutationsList, observer) => {
        let shouldProcess = false;

        for (let mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            shouldProcess = true;
            break;
          }
        }

        if (shouldProcess) {
          debouncedProcess();
        }
      });

      // 监视整个文档，包括子树变化和属性变化
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: false
      });

      // 在路由变化或AJAX加载时也可能需要重新处理
      window.addEventListener('popstate', debouncedProcess);
      window.addEventListener('pushstate', debouncedProcess);
      window.addEventListener('replacestate', debouncedProcess);

      // 滚动时检查是否有新元素出现（惰性加载的情况）
      window.addEventListener('scroll', debouncedProcess);

    }, config.initialDelay);
  };

  // 当DOM加载完成后或窗口加载完成后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
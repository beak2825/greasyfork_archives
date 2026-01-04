// ==UserScript==
// @name         siliconflow-free-selector
// @namespace    https://github.com/timerring/siliconflow-free-selector
// @version      1.0
// @description  快速筛选出硅基流动 SiliconFlow 所有免费模型
// @match        https://cloud.siliconflow.cn/me/*
// @grant        none
// @license      MIT
// @icon         https://cloud.siliconflow.cn/favicon.ico
// @homepage     https://github.com/timerring/siliconflow-free-selector
// @supportURL   https://github.com/timerring/siliconflow-free-selector/issues
// @downloadURL https://update.greasyfork.org/scripts/556645/siliconflow-free-selector.user.js
// @updateURL https://update.greasyfork.org/scripts/556645/siliconflow-free-selector.meta.js
// ==/UserScript==

// 添加免费标签的核心函数
function addFreeTag() {
  // 1. 找到 tag 区域
  const tagLabel = Array.from(document.querySelectorAll('div.text-slate-400.text-xs'))
    .find(el => el.textContent.includes('标签'));
  
  if (!tagLabel) {
    return false; // 未找到标签栏
  }
  
  // 往下寻找到具体标签按钮父容器
  const tagGrid = tagLabel.parentElement.nextElementSibling;
  if (!tagGrid || !tagGrid.classList.contains('grid')) {
    return false; // 未找到标签按钮栏
  }
  
  // 判断是否已经存在"免费"按钮，避免重复添加
  if (Array.from(tagGrid.children).some(el => el.textContent === '免费')) {
    return true; // 已存在，无需添加
  }
  
  // 2. 创建免费 tag，样式与其它标签一致
  const freeTag = document.createElement('div');
  freeTag.className = 'h-[24px] rounded border text-sm text-slate-700 flex items-center justify-center cursor-pointer select-none bg-slate-50';
  freeTag.innerHTML = '<div>免费</div>';
  
  // 3. 点击逻辑：只保留带"免费"的模型
  freeTag.onclick = () => {
    // 每张卡片外部容器
    const modelCards = document.querySelectorAll('div.border.border-transparent.cursor-pointer.p-4.flex.flex-col.justify-between.overflow-hidden.rounded-lg.hover\\:border.hover\\:border-primary.relative');
    let count = 0;
    modelCards.forEach(card => {
      if (card.textContent.includes('免费')) {
        count++;
      } else {
        card.parentNode.removeChild(card);
      }
    });
    console.log(`已筛选出 ${count} 个免费模型`);
  };
  
  // 4. 添加到标签末尾
  tagGrid.appendChild(freeTag);
  console.log('免费标签已添加');
  return true;
}

// 检查当前页面 URL 是否匹配
function isTargetPage() {
  return window.location.href.includes('cloud.siliconflow.cn/me/models');
}

// 初始化：持续监听并在检测到标签栏时立即添加
function init() {
  if (!isTargetPage()) {
    return;
  }
  
  // 尝试立即添加
  addFreeTag();
  
  // 使用 MutationObserver 持续监听 DOM 变化
  const observer = new MutationObserver((mutations) => {
    // 每次 DOM 变化都尝试添加，函数内部会检查是否已存在
    addFreeTag();
  });
  
  // 开始观察整个 document.body 的子树变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// 监听 URL 变化（适用于单页应用）
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    if (isTargetPage()) {
      setTimeout(init, 500); // 延迟执行，等待页面渲染
    }
  }
}).observe(document.body, { childList: true, subtree: true });
